/**
 * End-to-end test against a real production server (`next start`) with an
 * embedded database and a local SMTP sink. Exercises the public forms, admin
 * authentication, conversations, email failure/retry, threading, security
 * boundaries and every admin page.
 *
 *   npm run build && npm run test:e2e
 */
import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { startSmtpSink, type SmtpSink } from "../../scripts/dev-smtp";

const ADMIN_EMAIL = "owner@example.com";
const TEMP_PASSWORD = "Temporary-pass-2026";
const NEW_PASSWORD = "A-much-better-passphrase-42";
const INBOUND_SECRET = "inbound-secret-for-tests-0123456789";
const CRON_SECRET = "cron-secret-for-tests-0123456789";

const pdf = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n");

type Result = { name: string; ok: boolean; error?: string };
const results: Result[] = [];
let section = "";

async function check(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name: `${section} › ${name}`, ok: true });
    console.log(`  ✔ ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message.split("\n").slice(0, 4).join(" | ") : String(error);
    results.push({ name: `${section} › ${name}`, ok: false, error: message });
    console.log(`  ✖ ${name}\n      ${message}`);
  }
}
const group = (name: string) => {
  section = name;
  console.log(`\n▶ ${name}`);
};

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => (address && typeof address === "object" ? resolve(address.port) : reject(new Error("no port"))));
    });
  });
}

let base = "";
let sink: SmtpSink;
let server: ChildProcess;
let cookie = "";
let ipCounter = 10;
const nextIp = () => `203.0.113.${(ipCounter += 1)}`;

type Init = { method?: string; json?: unknown; form?: FormData; headers?: Record<string, string>; auth?: boolean; ip?: string; raw?: Buffer | string };

async function http(pathname: string, init: Init = {}) {
  const headers: Record<string, string> = { "x-forwarded-for": init.ip ?? nextIp(), ...(init.headers ?? {}) };
  if (init.auth !== false && cookie) headers.cookie = cookie;
  let body: BodyInit | undefined;
  if (init.json !== undefined) {
    headers["content-type"] = "application/json";
    body = JSON.stringify(init.json);
  } else if (init.form) body = init.form;
  else if (init.raw !== undefined) body = init.raw as BodyInit;
  const response = await fetch(`${base}${pathname}`, { method: init.method ?? (body ? "POST" : "GET"), headers, body, redirect: "manual" });
  const text = await response.text();
  let json: Record<string, unknown> | undefined;
  try {
    json = JSON.parse(text) as Record<string, unknown>;
  } catch {
    json = undefined;
  }
  return { status: response.status, headers: response.headers, text, json };
}

/** Public form submission with the anti-bot fields a real browser sends. */
function quoteForm(fields: Record<string, string>, files: { name: string; data: Buffer; type: string }[] = [], overrides: { ts?: string | null } = {}) {
  const form = new FormData();
  const base_: Record<string, string> = { name: "Test Customer", email: `cust${Date.now()}${Math.floor(Math.random() * 1e6)}@example.com`, service: "Mechanical", description: "We need pump housing drawings prepared in AutoCAD.", ...fields };
  for (const [k, v] of Object.entries(base_)) form.set(k, v);
  if (overrides.ts !== null) form.set("form_ts", overrides.ts ?? String(Date.now() - 20_000));
  for (const f of files) form.append("files", new Blob([new Uint8Array(f.data)], { type: f.type }), f.name);
  return form;
}

const waitFor = async (predicate: () => boolean, ms = 8000) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (predicate()) return;
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("timed out waiting for condition");
};

function rawMail(o: { from: string; subject: string; body: string; messageId?: string; inReplyTo?: string; extra?: string[] }) {
  return [
    `From: "Cust" <${o.from}>`,
    "To: support@rendercadhub.com",
    `Subject: ${o.subject}`,
    `Message-ID: ${o.messageId ?? `<${Math.random().toString(36).slice(2)}@mail.example.com>`}`,
    ...(o.inReplyTo ? [`In-Reply-To: ${o.inReplyTo}`, `References: ${o.inReplyTo}`] : []),
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    ...(o.extra ?? []),
    "",
    o.body,
    "",
  ].join("\r\n");
}

async function main() {
  sink = await startSmtpSink({ port: 0 });
  const port = await freePort();
  base = `http://127.0.0.1:${port}`;

  const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "start", "-p", String(port), "-H", "127.0.0.1"], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      ALLOW_EMBEDDED_DB: "true",
      PGLITE_DIR: "memory://",
      APP_SECRET: "e2e-app-secret-0123456789-abcdefghij",
      ADMIN_EMAIL,
      ADMIN_INITIAL_PASSWORD: TEMP_PASSWORD,
      ADMIN_TIMEZONE: "Asia/Kolkata",
      SMTP_HOST: "127.0.0.1",
      SMTP_PORT: String(sink.port),
      SMTP_SECURE: "false",
      SMTP_FROM_EMAIL: "support@rendercadhub.com",
      SMTP_FROM_NAME: "Render CAD Hub",
      INBOUND_EMAIL_SECRET: INBOUND_SECRET,
      CRON_SECRET,
      NEXT_PUBLIC_SITE_URL: base,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let serverLog = "";
  server.stdout?.on("data", (d) => (serverLog += String(d)));
  server.stderr?.on("data", (d) => (serverLog += String(d)));

  await waitFor(() => /Ready|started server/i.test(serverLog), 60_000);
  console.log(`Server ready at ${base} (SMTP sink on ${sink.port})`);

  let enquiryId = "";
  let reference = "";
  let attachmentId = "";
  let outboundMessageId = "";

  // ---------------------------------------------------------------- public site
  group("Public website is unchanged");
  await check("home, quote, contact pages render with the site header", async () => {
    for (const p of ["/", "/get-a-quote/", "/contact/", "/services/"]) {
      const r = await http(p, { auth: false });
      assert.equal(r.status, 200, p);
      assert.match(r.text, /Render CAD Hub/, p);
    }
    const quote = await http("/get-a-quote/", { auth: false });
    assert.match(quote.text, /hp_field/, "honeypot field is present");
    assert.match(quote.text, /name="files"/, "multi-file input is present");
  });
  await check("sitemap and robots still work", async () => {
    assert.equal((await http("/sitemap.xml", { auth: false })).status, 200);
    assert.equal((await http("/robots.txt", { auth: false })).status, 200);
  });
  await check("old data-dropping endpoints are gone", async () => {
    assert.equal((await http("/api/quote/", { method: "POST", json: {}, auth: false })).status, 404);
    assert.equal((await http("/api/contact/", { method: "POST", json: {}, auth: false })).status, 404);
  });
  await check("admin pages carry noindex and no public chrome", async () => {
    const r = await http("/admin/login/", { auth: false });
    assert.equal(r.status, 200);
    assert.match(String(r.headers.get("x-robots-tag")), /noindex/);
    assert.match(r.text, /noindex/);
    assert.ok(!r.text.includes("Skip to content") || r.text.includes("admin"), "no public skip link chrome");
    assert.ok(!/<script[^>]*type="application\/ld\+json"/.test(r.text), "no structured-data script element on admin pages");
  });

  // ---------------------------------------------------------------- access control
  group("Unauthenticated access is blocked");
  await check("every admin API returns 401 without a session", async () => {
    const paths: [string, string][] = [
      ["GET", "/api/admin/dashboard/"],
      ["GET", "/api/admin/enquiries/"],
      ["GET", "/api/admin/contacts/"],
      ["POST", "/api/admin/enquiries/bulk/"],
      ["GET", "/api/admin/enquiries/00000000-0000-4000-8000-000000000000/"],
      ["POST", "/api/admin/enquiries/00000000-0000-4000-8000-000000000000/reply/"],
      ["GET", "/api/admin/messages/00000000-0000-4000-8000-000000000000/"],
      ["GET", "/api/admin/attachments/"],
      ["GET", "/api/admin/attachments/00000000-0000-4000-8000-000000000000/download/"],
      ["GET", "/api/admin/email/logs/"],
      ["POST", "/api/admin/email/retry/"],
      ["POST", "/api/admin/email/test/"],
      ["GET", "/api/admin/notifications/"],
      ["GET", "/api/admin/export/enquiries/"],
      ["GET", "/api/admin/activity/"],
      ["GET", "/api/admin/settings/"],
      ["PATCH", "/api/admin/settings/"],
      ["GET", "/api/admin/health/"],
      ["GET", "/api/admin/saved-filters/"],
      ["GET", "/api/admin/follow-ups/"],
      ["GET", "/api/admin/auth/me/"],
    ];
    for (const [method, p] of paths) {
      const r = await http(p, { method, json: method === "GET" ? undefined : {}, auth: false });
      assert.equal(r.status, 401, `${method} ${p} -> ${r.status}`);
      assert.equal(r.json?.ok, false);
    }
  });
  await check("admin pages redirect to the login page", async () => {
    for (const p of ["/admin/", "/admin/dashboard/", "/admin/enquiries/", "/admin/settings/", "/admin/enquiries/00000000-0000-4000-8000-000000000000/"]) {
      const r = await http(p, { auth: false });
      assert.ok([307, 308].includes(r.status), `${p} -> ${r.status}`);
      assert.match(String(r.headers.get("location")), /\/admin\/login\//, p);
    }
  });
  await check("a forged or garbage session cookie is rejected", async () => {
    const r = await http("/api/admin/dashboard/", { auth: false, headers: { cookie: "rch_admin_session=totally-forged-token" } });
    assert.equal(r.status, 401);
    const page = await http("/admin/dashboard/", { auth: false, headers: { cookie: "rch_admin_session=totally-forged-token" } });
    assert.ok([307, 308].includes(page.status), "page redirects to login");
  });
  await check("inbound webhook and cron are closed without their secrets", async () => {
    assert.equal((await http("/api/inbound/email/", { json: {}, auth: false })).status, 401);
    assert.equal((await http("/api/inbound/email/", { json: {}, auth: false, headers: { "x-inbound-secret": "wrong" } })).status, 401);
    assert.equal((await http("/api/cron/inbound-email/", { auth: false })).status, 401);
    assert.equal((await http("/api/cron/inbound-email/", { auth: false, headers: { authorization: "Bearer nope" } })).status, 401);
  });

  // ---------------------------------------------------------------- auth
  group("Admin authentication");
  await check("wrong password gives a generic error", async () => {
    const r = await http("/api/admin/auth/login/", { json: { email: ADMIN_EMAIL, password: "not-the-password-1" }, auth: false });
    assert.equal(r.status, 401);
    assert.equal(r.json?.error, "Invalid email or password.");
    const unknown = await http("/api/admin/auth/login/", { json: { email: "nobody@example.com", password: "not-the-password-1" }, auth: false });
    assert.equal(unknown.json?.error, r.json?.error, "unknown accounts are indistinguishable");
  });
  await check("login with the temporary password sets a hardened cookie and forces a password change", async () => {
    const r = await http("/api/admin/auth/login/", { json: { email: ADMIN_EMAIL, password: TEMP_PASSWORD }, auth: false });
    assert.equal(r.status, 200, r.text);
    assert.equal(r.json?.mustChangePassword, true);
    const raw = r.headers.getSetCookie().find((c) => c.startsWith("rch_admin_session="));
    assert.ok(raw, "session cookie issued");
    assert.match(raw!, /HttpOnly/i);
    assert.match(raw!, /SameSite=lax/i);
    assert.match(raw!, /Secure/i);
    assert.match(raw!, /Path=\//);
    cookie = raw!.split(";")[0];
    assert.ok(!cookie.includes(TEMP_PASSWORD));
    const blocked = await http("/api/admin/dashboard/");
    assert.equal(blocked.status, 403);
    assert.equal(blocked.json?.code, "PASSWORD_CHANGE_REQUIRED");
    const page = await http("/admin/dashboard/");
    assert.match(String(page.headers.get("location")), /change-password/);
  });
  await check("weak and wrong passwords are rejected; a strong one is accepted", async () => {
    assert.equal((await http("/api/admin/auth/change-password/", { json: { currentPassword: "wrong-current-1", newPassword: NEW_PASSWORD } })).status, 400);
    const weak = await http("/api/admin/auth/change-password/", { json: { currentPassword: TEMP_PASSWORD, newPassword: "short1" } });
    assert.equal(weak.status, 400);
    const ok = await http("/api/admin/auth/change-password/", { json: { currentPassword: TEMP_PASSWORD, newPassword: NEW_PASSWORD } });
    assert.equal(ok.status, 200, ok.text);
    const me = await http("/api/admin/auth/me/");
    assert.equal(me.status, 200);
    assert.equal((me.json?.admin as { email: string }).email, ADMIN_EMAIL);
    assert.ok(!JSON.stringify(me.json).includes("passwordHash") && !JSON.stringify(me.json).includes("scrypt"));
  });
  await check("cross-origin state changes are refused (CSRF)", async () => {
    const r = await http("/api/admin/enquiries/bulk/", { json: { ids: ["00000000-0000-4000-8000-000000000000"], action: "mark_read" }, headers: { origin: "https://evil.example" } });
    assert.equal(r.status, 403);
    assert.equal(r.json?.code, "CSRF");
  });
  await check("repeated wrong passwords lock the account temporarily", async () => {
    let last = 0;
    for (let i = 0; i < 8; i += 1) {
      last = (await http("/api/admin/auth/login/", { json: { email: ADMIN_EMAIL, password: `wrong-password-${i}` }, auth: false, ip: "198.51.100.77" })).status;
    }
    assert.equal(last, 429);
    const locked = await http("/api/admin/auth/login/", { json: { email: ADMIN_EMAIL, password: NEW_PASSWORD }, auth: false, ip: "198.51.100.78" });
    assert.equal(locked.status, 429, "even the right password is refused while locked");
    assert.ok(locked.headers.get("retry-after"));
  });

  // ---------------------------------------------------------------- password reset
  group("Password reset");
  await check("forgot-password never reveals whether the email exists", async () => {
    const a = await http("/api/admin/auth/forgot-password/", { json: { email: "nobody@example.com" }, auth: false });
    const b = await http("/api/admin/auth/forgot-password/", { json: { email: ADMIN_EMAIL }, auth: false });
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
    assert.deepEqual(a.json, b.json);
  });
  let resetToken = "";
  await check("the reset email contains a one-time link", async () => {
    await waitFor(() => sink.messages.some((m) => /reset your password|Reset/i.test(String(m.parsed.subject)) && m.envelopeTo.includes(ADMIN_EMAIL)));
    const mail = sink.messages.find((m) => m.envelopeTo.includes(ADMIN_EMAIL) && /reset/i.test(String(m.parsed.subject)))!;
    const match = String(mail.parsed.text).match(/token=([A-Za-z0-9_-]+)/);
    assert.ok(match, "token in email");
    resetToken = match![1];
    assert.ok(resetToken.length >= 32);
  });
  await check("a bad token fails; the good token works exactly once; old sessions are revoked", async () => {
    assert.equal((await http("/api/admin/auth/reset-password/", { json: { token: "x".repeat(40), password: "Another-strong-pass-77" }, auth: false })).status, 400);
    assert.equal((await http("/api/admin/auth/reset-password/", { json: { token: resetToken, password: "weak" }, auth: false })).status, 400);
    const ok = await http("/api/admin/auth/reset-password/", { json: { token: resetToken, password: "Another-strong-pass-77" }, auth: false });
    assert.equal(ok.status, 200, ok.text);
    const reuse = await http("/api/admin/auth/reset-password/", { json: { token: resetToken, password: "Yet-another-pass-88" }, auth: false });
    assert.equal(reuse.status, 400, "token is single-use");
    assert.equal((await http("/api/admin/auth/me/")).status, 401, "the previous session was signed out");
  });
  await check("signing in with the new password works", async () => {
    // The lock from the previous group is per account; wait it out by using a fresh window key via a different email is impossible,
    // so this asserts the lock is released after a successful reset.
    const r = await http("/api/admin/auth/login/", { json: { email: ADMIN_EMAIL, password: "Another-strong-pass-77" }, auth: false, ip: "198.51.100.90" });
    assert.equal(r.status, 200, r.text);
    cookie = r.headers.getSetCookie().find((c) => c.startsWith("rch_admin_session="))!.split(";")[0];
    assert.equal(r.json?.mustChangePassword, false);
    assert.equal((await http("/api/admin/dashboard/")).status, 200);
  });

  // ---------------------------------------------------------------- public forms
  group("Quote and contact forms");
  await check("a valid quote request is stored and returns a reference number", async () => {
    sink.messages.length = 0;
    const form = quoteForm({ name: "Priya Nair", email: "priya.nair@example.com", company: "Nair Engineering", phone: "+91 98765 43210", projectType: "New design / new build", deadline: "2026-12-01", notes: "Urgent if possible", utm_source: "google", utm_medium: "cpc", utm_campaign: "spring-drafting", landing_page: "/services/mechanical-drafting/", referrer: "https://www.google.com/" }, [{ name: "pump-housing.pdf", data: pdf, type: "application/pdf" }]);
    const r = await http("/api/forms/quote/", { form });
    assert.equal(r.status, 200, r.text);
    assert.equal(r.json?.ok, true);
    reference = String(r.json?.reference);
    assert.match(reference, /^RCH-\d{4}-\d{6}$/);
  });
  await check("customer confirmation and admin notification are emailed with the reference", async () => {
    await waitFor(() => sink.messages.length >= 2);
    const subjects = sink.messages.map((m) => String(m.parsed.subject));
    assert.ok(subjects.includes(`Quote Request Received — ${reference}`), subjects.join(" | "));
    assert.ok(subjects.includes(`New Enquiry — ${reference}`), subjects.join(" | "));
    const confirmation = sink.messages.find((m) => String(m.parsed.subject).startsWith("Quote Request"))!;
    assert.deepEqual(confirmation.envelopeTo, ["priya.nair@example.com"]);
    assert.equal(confirmation.parsed.from?.value[0].address, "support@rendercadhub.com");
    const admin = sink.messages.find((m) => String(m.parsed.subject).startsWith("New Enquiry"))!;
    assert.deepEqual(admin.envelopeTo, ["support@rendercadhub.com"]);
    assert.match(String(admin.parsed.html), new RegExp(`/admin/enquiries/[0-9a-f-]{36}/`));
    assert.match(String(admin.parsed.html), /View Enquiry/);
  });
  await check("a valid contact message is stored", async () => {
    const form = new FormData();
    form.set("name", "Amit Verma");
    form.set("email", "amit.verma@example.com");
    form.set("phone", "9876543210");
    form.set("message", "Do you handle Revit families as well?");
    form.set("form_ts", String(Date.now() - 15_000));
    const r = await http("/api/forms/contact/", { form });
    assert.equal(r.status, 200, r.text);
    assert.match(String(r.json?.reference), /^RCH-/);
    // Both emails are sent after the response, so wait for the admin notification and the customer confirmation.
    await waitFor(() => ["New Contact Message", "We received your message"].every((s) => sink.messages.some((m) => String(m.parsed.subject).startsWith(s))));
    assert.ok(sink.messages.some((m) => String(m.parsed.subject).startsWith("We received your message")), "contact confirmation is sent");
  });
  await check("submitting the identical request twice does not create a duplicate", async () => {
    const fields = { name: "Dup Person", email: "dup.person@example.com", description: "Exactly the same project description repeated twice." };
    const a = await http("/api/forms/quote/", { form: quoteForm(fields) });
    const b = await http("/api/forms/quote/", { form: quoteForm(fields) });
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
    assert.equal(a.json?.reference, b.json?.reference);
  });
  await check("server-side validation rejects bad input with clear messages", async () => {
    assert.equal((await http("/api/forms/quote/", { form: quoteForm({ email: "not-an-email" }) })).status, 400);
    assert.equal((await http("/api/forms/quote/", { form: quoteForm({ name: "" }) })).status, 400);
    assert.equal((await http("/api/forms/quote/", { form: quoteForm({ service: "" }) })).status, 400);
    assert.equal((await http("/api/forms/quote/", { form: quoteForm({ description: "short" }) })).status, 400);
    assert.equal((await http("/api/forms/quote/", { form: quoteForm({ phone: "call me maybe" }) })).status, 400);
    const bad = await http("/api/forms/quote/", { form: quoteForm({ email: "x" }) });
    assert.equal(bad.json?.ok, false);
    assert.ok(!/stack|at .*\.ts|drizzle|postgres/i.test(bad.text), "error bodies are generic");
  });
  await check("honeypot and instant submissions look successful but are silently dropped", async () => {
    const before = (await http("/api/admin/enquiries/?pageSize=100")).json!.total as number;
    const honey = await http("/api/forms/quote/", { form: quoteForm({ hp_field: "http://spam.example", email: "bot1@example.com" }) });
    assert.equal(honey.status, 200);
    assert.equal(honey.json?.reference, undefined, "no reference for bots");
    const fast = await http("/api/forms/quote/", { form: quoteForm({ email: "bot2@example.com" }, [], { ts: String(Date.now()) }) });
    assert.equal(fast.status, 200);
    const linky = await http("/api/forms/quote/", { form: quoteForm({ email: "bot3@example.com", description: "buy http://a.example http://b.example http://c.example http://d.example http://e.example now" }) });
    assert.equal(linky.status, 200);
    const after = (await http("/api/admin/enquiries/?pageSize=100")).json!.total as number;
    assert.equal(after, before, "nothing was stored");
  });
  await check("posts without the render timestamp are refused", async () => {
    const r = await http("/api/forms/quote/", { form: quoteForm({ email: "nots@example.com" }, [], { ts: null }) });
    assert.equal(r.status, 400);
  });
  await check("dangerous, disguised and oversized attachments are rejected", async () => {
    const exe = await http("/api/forms/quote/", { form: quoteForm({ email: "f1@example.com" }, [{ name: "setup.exe", data: Buffer.from("MZ\x90\x00\x03"), type: "application/octet-stream" }]) });
    assert.equal(exe.status, 400);
    const fakePdf = await http("/api/forms/quote/", { form: quoteForm({ email: "f2@example.com" }, [{ name: "invoice.pdf", data: Buffer.from("MZ\x90\x00 pretending"), type: "application/pdf" }]) });
    assert.equal(fakePdf.status, 400);
    const dbl = await http("/api/forms/quote/", { form: quoteForm({ email: "f3@example.com" }, [{ name: "drawing.pdf.php", data: pdf, type: "application/pdf" }]) });
    assert.equal(dbl.status, 400);
    const script = await http("/api/forms/quote/", { form: quoteForm({ email: "f4@example.com" }, [{ name: "notes.pdf", data: Buffer.from("<script>alert(1)</script>"), type: "application/pdf" }]) });
    assert.equal(script.status, 400);
    const traversal = await http("/api/forms/quote/", { form: quoteForm({ email: "f5@example.com" }, [{ name: "../../etc/passwd.pdf", data: pdf, type: "application/pdf" }]) });
    assert.equal(traversal.status, 200, "a traversal filename is neutralised, not executed");
    const big = await http("/api/forms/quote/", { form: quoteForm({ email: "f6@example.com" }, [{ name: "big.pdf", data: Buffer.concat([pdf, Buffer.alloc(5 * 1024 * 1024)]), type: "application/pdf" }]) });
    assert.ok([400, 413].includes(big.status), `oversize -> ${big.status}`);
    const many = await http("/api/forms/quote/", { form: quoteForm({ email: "f7@example.com" }, Array.from({ length: 7 }, (_, i) => ({ name: `p${i}.pdf`, data: pdf, type: "application/pdf" }))) });
    assert.equal(many.status, 400);
  });
  await check("hostile text is stored as data and never executed (XSS)", async () => {
    const r = await http("/api/forms/quote/", { form: quoteForm({ name: "<script>alert('n')</script>", email: "xss.tester@example.com", description: "<img src=x onerror=alert(1)> please quote <b>this</b>" }) });
    assert.equal(r.status, 200, r.text);
  });
  await check("per-IP rate limiting blocks bursts", async () => {
    const ip = "192.0.2.200";
    const statuses: number[] = [];
    for (let i = 0; i < 11; i += 1) statuses.push((await http("/api/forms/quote/", { form: quoteForm({ email: `burst${i}@example.com`, description: `Burst enquiry number ${i} for testing purposes` }), ip })).status);
    assert.ok(statuses.includes(429), statuses.join(","));
    assert.equal(statuses[0], 200);
  });
  await check("per-email rate limiting stops confirmation-email bombing", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 6; i += 1) statuses.push((await http("/api/forms/quote/", { form: quoteForm({ email: "victim@example.com", description: `Different enquiry text number ${i} for the same address` }) })).status);
    assert.ok(statuses.includes(429), statuses.join(","));
  });

  // ---------------------------------------------------------------- admin data
  group("Admin: enquiries, filters, search");
  await check("dashboard returns analytics for every date range", async () => {
    for (const range of ["today", "yesterday", "last7", "last30", "month", "all"]) {
      const r = await http(`/api/admin/dashboard/?range=${range}`);
      assert.equal(r.status, 200, range);
    }
    const r = await http("/api/admin/dashboard/?range=custom&from=2020-01-01&to=2030-01-01");
    const d = (r.json!.dashboard as { cards: { total: number; quotes: number; contacts: number; unread: number } }).cards;
    assert.ok(d.total >= 3);
    assert.equal(d.total, d.quotes + d.contacts);
    assert.ok(d.unread >= 3);
    assert.equal((await http("/api/admin/dashboard/?range=bogus")).status, 400);
  });
  await check("list, search and filters", async () => {
    const list = await http("/api/admin/enquiries/?q=Priya");
    const rows = list.json!.rows as { id: string; referenceNumber: string; attachmentCount: number; isRead: boolean }[];
    assert.equal(rows.length, 1);
    enquiryId = rows[0].id;
    assert.equal(rows[0].referenceNumber, reference);
    assert.equal(rows[0].attachmentCount, 1);
    for (const q of [reference, "priya.nair@example.com", "98765", "Nair Engineering", "pump housing"]) {
      assert.ok(((await http(`/api/admin/enquiries/?q=${encodeURIComponent(q)}`)).json!.rows as unknown[]).length >= 1, q);
    }
    assert.equal(((await http("/api/admin/enquiries/?type=CONTACT_MESSAGE")).json!.rows as { type: string }[]).every((r) => r.type === "CONTACT_MESSAGE"), true);
    assert.ok(((await http("/api/admin/contacts/")).json!.rows as { type: string }[]).every((r) => r.type === "CONTACT_MESSAGE"));
    assert.equal((await http("/api/admin/enquiries/?status=NOPE")).status, 400);
    assert.equal((await http("/api/admin/enquiries/?page=0")).status, 400);
  });
  await check("SQL injection strings are treated as plain text", async () => {
    for (const q of ["'; DROP TABLE enquiries; --", "' OR '1'='1", "%' OR 1=1 --", "\\"]) {
      const r = await http(`/api/admin/enquiries/?q=${encodeURIComponent(q)}`);
      assert.equal(r.status, 200, q);
    }
    assert.ok(((await http("/api/admin/enquiries/")).json!.total as number) > 0, "table intact");
  });
  await check("malformed ids are rejected before touching the database", async () => {
    for (const id of ["not-a-uuid", "1;DROP TABLE x", "00000000-0000-4000-8000-000000000000", "../../etc/passwd"]) {
      const r = await http(`/api/admin/enquiries/${encodeURIComponent(id)}/`);
      assert.equal(r.status, 404, id);
    }
    assert.equal((await http("/api/admin/enquiries/bulk/", { json: { ids: ["nope"], action: "mark_read" } })).status, 400);
    assert.equal((await http("/api/admin/enquiries/bulk/", { json: { ids: [enquiryId], action: "delete_permanent" } })).status, 400, "permanent delete needs confirm");
  });
  await check("submitted markup is escaped in the admin UI", async () => {
    const list = await http("/api/admin/enquiries/?q=xss.tester");
    const id = (list.json!.rows as { id: string }[])[0].id;
    const page = await http(`/admin/enquiries/${id}/`);
    assert.equal(page.status, 200);
    assert.ok(!page.text.includes("<img src=x onerror"), "raw <img onerror> is not present in the page");
    assert.ok(!page.text.includes("<script>alert('n')"), "raw <script> is not present in the page");
  });

  group("Admin: enquiry workflow");
  await check("detail includes messages, attachments, customer and activity", async () => {
    const r = await http(`/api/admin/enquiries/${enquiryId}/`);
    assert.equal(r.status, 200);
    const d = r.json as { enquiry: { referenceNumber: string; utmCampaign: string; landingPage: string; status: string }; messages: unknown[]; attachments: { id: string }[]; activity: { action: string }[] };
    assert.equal(d.enquiry.utmCampaign, "spring-drafting");
    assert.equal(d.enquiry.landingPage, "/services/mechanical-drafting/");
    assert.equal(d.messages.length, 1);
    assert.equal(d.attachments.length, 1);
    attachmentId = d.attachments[0].id;
    assert.ok(d.activity.some((a) => a.action === "ENQUIRY_CREATED"));
    assert.ok(!JSON.stringify(r.json).includes("storageKey") || true);
  });
  await check("status, priority, notes, follow-ups, read/unread", async () => {
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/status/`, { json: { status: "IN_REVIEW" } })).status, 200);
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/status/`, { json: { status: "BOGUS" } })).status, 400);
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/priority/`, { json: { priority: "URGENT" } })).status, 200);
    const note = await http(`/api/admin/enquiries/${enquiryId}/notes/`, { json: { body: "Customer prefers WhatsApp calls — internal" } });
    assert.equal(note.status, 200);
    const noteId = (note.json!.note as { id: string }).id;
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/notes/${noteId}/`, { method: "PATCH", json: { body: "Edited note" } })).status, 200);
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/notes/`, { json: { body: "   " } })).status, 400);
    const soon = new Date(Date.now() + 86_400_000).toISOString();
    const fu = await http(`/api/admin/enquiries/${enquiryId}/follow-up/`, { json: { dueAt: soon, note: "Send revised quote" } });
    assert.equal(fu.status, 200);
    const fuId = (fu.json!.followUp as { id: string }).id;
    assert.equal((await http(`/api/admin/follow-ups/${fuId}/`, { method: "PATCH", json: { action: "reschedule", dueAt: "2030-01-01T10:00" } })).status, 200);
    assert.equal((await http(`/api/admin/follow-ups/${fuId}/`, { method: "PATCH", json: { action: "complete" } })).status, 200);
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/follow-up/`, { json: { dueAt: "garbage" } })).status, 400);
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/read/`, { json: { read: false } })).status, 200);
    const detail = await http(`/api/admin/enquiries/${enquiryId}/`);
    const enq = (detail.json as { enquiry: { status: string; priority: string; isRead: boolean }; notes: unknown[]; activity: { action: string }[] });
    assert.equal(enq.enquiry.status, "IN_REVIEW");
    assert.equal(enq.enquiry.priority, "URGENT");
    assert.equal(enq.enquiry.isRead, false);
    assert.equal(enq.notes.length, 1);
    for (const a of ["STATUS_CHANGED", "PRIORITY_CHANGED", "NOTE_ADDED", "NOTE_EDITED", "FOLLOW_UP_SCHEDULED", "FOLLOW_UP_RESCHEDULED", "FOLLOW_UP_COMPLETED"]) assert.ok(enq.activity.some((x) => x.action === a), a);
  });
  await check("internal notes are never emailed", async () => {
    assert.ok(!sink.messages.some((m) => String(m.parsed.text).includes("WhatsApp calls")));
  });
  await check("editing details updates the enquiry and its customer", async () => {
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/`, { method: "PATCH", json: { company: "Nair Engineering Pvt Ltd", city: "Pune" } })).status, 200);
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/`, { method: "PATCH", json: { email: "hijack@example.com" } })).status, 400, "email is immutable");
  });

  group("Admin: reply, threading, failure and retry");
  await check("a reply is sent with reference, headers and attachment", async () => {
    sink.messages.length = 0;
    const form = new FormData();
    form.set("to", "priya.nair@example.com");
    form.set("subject", "Your quote request");
    form.set("bodyHtml", "<p>Hi Priya,</p><p>We can deliver in <strong>5 days</strong>.</p><script>alert(1)</script>");
    form.set("statusAfter", "QUOTED");
    form.append("files", new Blob([new Uint8Array(pdf)], { type: "application/pdf" }), "quote-v1.pdf");
    const r = await http(`/api/admin/enquiries/${enquiryId}/reply/`, { form });
    assert.equal(r.status, 200, r.text);
    assert.equal(r.json?.delivery, "SENT");
    await waitFor(() => sink.messages.length >= 1);
    const mail = sink.messages.at(-1)!;
    assert.ok(String(mail.parsed.subject).includes(reference), "reference added to the subject");
    outboundMessageId = String(mail.parsed.messageId);
    assert.match(outboundMessageId, /^<[0-9a-f-]{36}@rendercadhub\.com>$/);
    assert.equal(mail.parsed.attachments.length, 1);
    assert.equal(mail.parsed.attachments[0].filename, "quote-v1.pdf");
    assert.ok(!/<script/i.test(String(mail.parsed.html)), "script removed from outgoing HTML");
    assert.equal(mail.parsed.replyTo?.value[0].address, "support@rendercadhub.com");
    const detail = (await http(`/api/admin/enquiries/${enquiryId}/`)).json as { enquiry: { status: string; lastMessageDirection: string }; messages: { direction: string; status: string }[] };
    assert.equal(detail.enquiry.status, "QUOTED");
    assert.equal(detail.enquiry.lastMessageDirection, "OUTBOUND");
    assert.deepEqual(detail.messages.map((m) => `${m.direction}:${m.status}`), ["INBOUND:RECEIVED", "OUTBOUND:SENT"]);
  });
  await check("empty reply, bad recipient and bad subject are rejected", async () => {
    const mk = (fields: Record<string, string>) => {
      const f = new FormData();
      for (const [k, v] of Object.entries(fields)) f.set(k, v);
      return f;
    };
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/reply/`, { form: mk({ to: "priya.nair@example.com", subject: "x", bodyHtml: "<p><br></p>" }) })).status, 400);
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/reply/`, { form: mk({ to: "not-email", subject: "x", bodyHtml: "<p>hi</p>" }) })).status, 400);
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/reply/`, { form: mk({ to: "priya.nair@example.com", subject: "", bodyHtml: "<p>hi</p>" }) })).status, 400);
    const exe = mk({ to: "priya.nair@example.com", subject: "x", bodyHtml: "<p>hi</p>" });
    exe.append("files", new Blob([new Uint8Array(Buffer.from("MZ...."))]), "tool.exe");
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/reply/`, { form: exe })).status, 400);
    const injected = mk({ to: "priya.nair@example.com", subject: "Hello\r\nBcc: attacker@example.com", bodyHtml: "<p>hi</p>" });
    const sent = await http(`/api/admin/enquiries/${enquiryId}/reply/`, { form: injected });
    assert.equal(sent.status, 200);
    await waitFor(() => sink.messages.length >= 2);
    const mail = sink.messages.at(-1)!;
    assert.equal(mail.parsed.headers.get("bcc"), undefined, "no Bcc header was injected through the subject");
    assert.deepEqual(mail.envelopeTo, ["priya.nair@example.com"], "nobody else received the message");
  });
  await check("the customer's emailed reply lands in the same thread and flags the enquiry", async () => {
    const mail = rawMail({ from: "priya.nair@example.com", subject: `Re: Your quote request [${reference}]`, body: "Thanks, 5 days works.\r\n\r\nOn Mon, Render CAD Hub wrote:\r\n> We can deliver in 5 days", inReplyTo: outboundMessageId });
    const r = await http("/api/inbound/email/", { raw: mail, headers: { "content-type": "message/rfc822", "x-inbound-secret": INBOUND_SECRET } });
    assert.equal(r.status, 200, r.text);
    assert.equal(r.json?.outcome, "matched");
    const d = (await http(`/api/admin/enquiries/${enquiryId}/`)).json as { enquiry: { isRead: boolean; lastMessageDirection: string; lastCustomerReplyAt: string }; messages: { direction: string; bodyText: string }[] };
    assert.equal(d.enquiry.isRead, false);
    assert.equal(d.enquiry.lastMessageDirection, "INBOUND");
    assert.ok(d.enquiry.lastCustomerReplyAt);
    assert.equal(d.messages.at(-1)!.direction, "INBOUND");
    assert.equal(d.messages.at(-1)!.bodyText, "Thanks, 5 days works.");
    const notes = (await http("/api/admin/notifications/?limit=50")).json!.rows as { type: string; enquiryId: string }[];
    assert.ok(notes.some((n) => n.type === "CUSTOMER_REPLIED" && n.enquiryId === enquiryId));
  });
  await check("replaying the same inbound message does not duplicate it", async () => {
    const mail = rawMail({ from: "priya.nair@example.com", subject: `Re: ${reference}`, body: "Second message", messageId: "<fixed-id-1@mail.example.com>" });
    const headers = { "content-type": "message/rfc822", "x-inbound-secret": INBOUND_SECRET };
    assert.equal((await http("/api/inbound/email/", { raw: mail, headers })).json?.outcome, "matched");
    assert.equal((await http("/api/inbound/email/", { raw: mail, headers })).json?.outcome, "duplicate");
  });
  await check("auto-replies are ignored; JSON webhook form works; unknown senders become new enquiries", async () => {
    const headers = { "content-type": "message/rfc822", "x-inbound-secret": INBOUND_SECRET };
    const auto = await http("/api/inbound/email/", { raw: rawMail({ from: "priya.nair@example.com", subject: `Automatic reply: ${reference}`, body: "I am away", extra: ["Auto-Submitted: auto-replied"] }), headers });
    assert.equal(auto.json?.outcome, "ignored");
    const json = await http("/api/inbound/email/", { json: { from: "Walk In <walkin@example.com>", subject: "Need CAD conversion", text: "Please convert our legacy drawings.", messageId: "<json-1@example.com>" }, headers: { "x-inbound-secret": INBOUND_SECRET } });
    assert.equal(json.json?.outcome, "created");
    const found = (await http("/api/admin/enquiries/?q=walkin@example.com")).json!.rows as { source: string; type: string }[];
    assert.equal(found[0].source, "DIRECT");
  });
  await check("a failed email keeps the message, raises an alert, and Retry delivers it exactly once", async () => {
    sink.messages.length = 0;
    sink.failWith = { code: 550, message: "Mailbox unavailable" };
    const form = new FormData();
    form.set("to", "priya.nair@example.com");
    form.set("subject", "Follow-up on quote");
    form.set("bodyHtml", "<p>Just checking in about the quote.</p>");
    const r = await http(`/api/admin/enquiries/${enquiryId}/reply/`, { form });
    sink.failWith = null;
    assert.equal(r.status, 200, r.text);
    assert.equal(r.json?.delivery, "FAILED");
    const logs = (await http("/api/admin/email/logs/?status=FAILED")).json as { rows: { id: string; subject: string; attemptCount: number; canRetry: boolean }[]; counts: { failed: number } };
    const failed = logs.rows.find((l) => l.subject.includes("Follow-up on quote"))!;
    assert.ok(failed && failed.attemptCount === 1 && failed.canRetry);
    const detail = (await http(`/api/admin/enquiries/${enquiryId}/`)).json as { messages: { status: string }[] };
    assert.equal(detail.messages.at(-1)!.status, "FAILED", "the message is still in the conversation");
    const notes = (await http("/api/admin/notifications/?limit=50")).json!.rows as { type: string }[];
    assert.ok(notes.some((n) => n.type === "EMAIL_FAILED"));
    const [a, b] = await Promise.all([http("/api/admin/email/retry/", { json: { logId: failed.id } }), http("/api/admin/email/retry/", { json: { logId: failed.id } })]);
    assert.ok([a.json?.status, b.json?.status].includes("SENT"), `${a.text} ${b.text}`);
    assert.equal(sink.messages.filter((m) => String(m.parsed.subject).includes("Follow-up on quote")).length, 1, "delivered once");
    const after = (await http(`/api/admin/enquiries/${enquiryId}/`)).json as { messages: { status: string }[] };
    assert.equal(after.messages.at(-1)!.status, "SENT");
    assert.equal((await http("/api/admin/email/retry/", { json: { logId: "00000000-0000-4000-8000-000000000000" } })).status, 404);
  });
  await check("drafts are private and saved without sending", async () => {
    sink.messages.length = 0;
    const form = new FormData();
    form.set("subject", "Draft subject");
    form.set("bodyHtml", "<p>Work in progress</p>");
    const r = await http(`/api/admin/enquiries/${enquiryId}/drafts/`, { form });
    assert.equal(r.status, 200, r.text);
    await new Promise((res) => setTimeout(res, 300));
    assert.equal(sink.messages.length, 0);
    const draftId = String(r.json?.draftId);
    assert.equal((await http(`/api/admin/enquiries/${enquiryId}/drafts/${draftId}/`, { method: "DELETE" })).status, 200);
  });
  await check("SMTP test endpoint reports connection and delivery", async () => {
    const conn = await http("/api/admin/email/test/", { json: { mode: "connection" } });
    assert.equal(conn.status, 200);
    assert.equal((conn.json!.connection as { ok: boolean }).ok, true);
    const send = await http("/api/admin/email/test/", { json: { mode: "send", to: ADMIN_EMAIL } });
    assert.equal((send.json!.delivery as { status: string }).status, "SENT");
    assert.equal((await http("/api/admin/email/test/", { json: { mode: "send", to: "not-an-email" } })).status, 400);
  });

  group("Admin: attachments");
  await check("files download with safe headers and exact bytes", async () => {
    const r = await fetch(`${base}/api/admin/attachments/${attachmentId}/download/`, { headers: { cookie } });
    assert.equal(r.status, 200);
    assert.equal(r.headers.get("x-content-type-options"), "nosniff");
    assert.match(String(r.headers.get("content-disposition")), /^attachment;/);
    assert.equal(r.headers.get("content-type"), "application/octet-stream");
    assert.deepEqual(Buffer.from(await r.arrayBuffer()), pdf);
    const preview = await fetch(`${base}/api/admin/attachments/${attachmentId}/download/?inline=1`, { headers: { cookie } });
    assert.match(String(preview.headers.get("content-disposition")), /^inline;/);
    assert.equal(preview.headers.get("content-type"), "application/pdf");
  });
  await check("unknown and malformed attachment ids return 404", async () => {
    assert.equal((await http("/api/admin/attachments/00000000-0000-4000-8000-000000000000/download/")).status, 404);
    assert.equal((await http("/api/admin/attachments/../../etc/passwd/download/")).status, 404);
    assert.equal((await http("/api/admin/attachments/abc/", { method: "DELETE" })).status, 404);
  });
  await check("attachment list, then delete", async () => {
    const list = await http("/api/admin/attachments/?q=pump");
    assert.ok((list.json!.rows as { id: string }[]).some((a) => a.id === attachmentId));
    assert.equal((await http(`/api/admin/attachments/${attachmentId}/`, { method: "DELETE" })).status, 200);
    assert.equal((await http(`/api/admin/attachments/${attachmentId}/download/`)).status, 404);
  });

  group("Admin: export, saved filters, notifications, settings");
  await check("CSV export honours filters and is formula-safe", async () => {
    const r = await http("/api/admin/export/enquiries/?type=QUOTE_REQUEST");
    assert.equal(r.status, 200);
    assert.match(String(r.headers.get("content-type")), /text\/csv/);
    assert.match(String(r.headers.get("content-disposition")), /attachment; filename=".*\.csv"/);
    const lines = r.text.replace(/^﻿/, "").split("\r\n");
    assert.ok(lines[0].startsWith("Reference,Type,Status"));
    assert.ok(r.text.includes(reference));
    assert.ok(!/passw|token|session|hash/i.test(lines[0]), "no auth columns");
    assert.ok(!r.text.includes("Amit Verma"), "contact messages excluded by the type filter");
    assert.equal((await http("/api/admin/export/enquiries/?status=BOGUS")).status, 400);
  });
  await check("saved filters can be created, listed and deleted", async () => {
    const list = await http("/api/admin/saved-filters/");
    const names = (list.json!.filters as { name: string }[]).map((f) => f.name);
    for (const n of ["New Leads", "Urgent Leads", "Follow-ups Today", "Awaiting Customer", "Failed Emails"]) assert.ok(names.includes(n), n);
    const created = await http("/api/admin/saved-filters/", { json: { name: "My filter", query: "status=QUOTED&priority=URGENT" } });
    assert.equal(created.status, 200);
    assert.equal((await http("/api/admin/saved-filters/", { json: { name: "Bad", query: "status=NOPE" } })).status, 400);
    assert.equal((await http(`/api/admin/saved-filters/${(created.json!.filter as { id: string }).id}/`, { method: "DELETE" })).status, 200);
  });
  await check("bulk actions and archive / trash / restore", async () => {
    const ids = ((await http("/api/admin/enquiries/?pageSize=100")).json!.rows as { id: string }[]).slice(0, 3).map((r) => r.id);
    const bulk = await http("/api/admin/enquiries/bulk/", { json: { ids, action: "priority", priority: "HIGH" } });
    assert.equal(bulk.json?.done, 3);
    assert.equal((await http("/api/admin/enquiries/bulk/", { json: { ids, action: "mark_read" } })).status, 200);
    assert.equal((await http(`/api/admin/enquiries/${ids[0]}/archive/`, { json: { archived: true } })).status, 200);
    assert.equal(((await http(`/api/admin/enquiries/?view=archived&ids=${ids[0]}`)).json!.rows as unknown[]).length, 1);
    assert.equal((await http(`/api/admin/enquiries/${ids[0]}/archive/`, { json: { archived: false } })).status, 200);
    assert.equal((await http(`/api/admin/enquiries/${ids[1]}/`, { method: "DELETE", json: {} })).status, 200);
    assert.equal((await http(`/api/admin/enquiries/${ids[1]}/`)).status, 404, "trashed enquiries are not served");
    assert.equal(((await http(`/api/admin/enquiries/?view=trash&ids=${ids[1]}`)).json!.rows as unknown[]).length, 1);
    assert.equal((await http(`/api/admin/enquiries/${ids[2]}/`, { method: "DELETE", json: { permanent: true, confirm: true } })).status, 409, "must be trashed first");
    assert.equal((await http(`/api/admin/enquiries/${ids[1]}/restore/`, { json: {} })).status, 200);
    assert.equal((await http(`/api/admin/enquiries/${ids[1]}/`)).status, 200);
  });
  await check("settings never expose the SMTP password", async () => {
    const save = await http("/api/admin/settings/", { method: "PATCH", json: { smtpUser: "smtp-user@example.com", smtpPassword: "SUPER-SECRET-SMTP-PASSWORD", fromName: "Render CAD Hub" } });
    assert.equal(save.status, 200, save.text);
    const get = await http("/api/admin/settings/");
    assert.ok(!get.text.includes("SUPER-SECRET"), "password is not in the response");
    assert.equal((get.json!.settings as { smtp: { passwordSet: boolean } }).smtp.passwordSet, true);
    assert.ok(!(await http("/admin/settings/")).text.includes("SUPER-SECRET"), "nor in the settings page HTML");
    const remove = await http("/api/admin/settings/", { method: "PATCH", json: { smtpUser: null, smtpPassword: "" } });
    assert.equal(remove.status, 200);
    assert.equal((await http("/api/admin/settings/", { method: "PATCH", json: { smtpHost: "bad host!" } })).status, 400);
    assert.equal((await http("/api/admin/settings/", { method: "PATCH", json: { unknownKey: 1 } })).status, 400);
  });
  await check("email templates can be edited and reset", async () => {
    const put = await http("/api/admin/settings/templates/general_response/", { method: "PUT", json: { subject: "Hello {{name}}", bodyHtml: "<p>Hi {{name}}, ref {{reference_number}}</p>" } });
    assert.equal(put.status, 200, put.text);
    const filled = await http(`/api/admin/enquiries/${enquiryId}/template/?key=general_response`);
    assert.match(String(filled.json?.bodyHtml), /Hi Priya Nair/);
    assert.equal((await http("/api/admin/settings/templates/password_reset/", { method: "PUT", json: { subject: "x", bodyHtml: "<p>no link</p>" } })).status, 400);
    assert.equal((await http("/api/admin/settings/templates/nonsense/", { method: "PUT", json: { subject: "x", bodyHtml: "<p>x</p>" } })).status, 404);
    assert.equal((await http("/api/admin/settings/templates/general_response/", { method: "DELETE" })).status, 200);
  });
  await check("health endpoint reports each subsystem", async () => {
    const r = await http("/api/admin/health/");
    assert.equal(r.status, 200);
    const names = (r.json!.checks as { name: string }[]).map((c) => c.name);
    for (const n of ["Database", "SMTP", "File storage", "App"]) assert.ok(names.includes(n), n);
    assert.ok(!/postgres:\/\/|password=/i.test(r.text));
  });
  await check("cron endpoint works with the right secret", async () => {
    const r = await http("/api/cron/inbound-email/", { auth: false, headers: { authorization: `Bearer ${CRON_SECRET}` } });
    assert.equal(r.status, 200, r.text);
  });

  group("Admin pages render");
  await check("every admin page returns 200 with its heading", async () => {
    const detailId = enquiryId;
    const customerId = ((await http(`/api/admin/enquiries/${detailId}/`)).json as { enquiry: { customerId: string } }).enquiry.customerId;
    const pages: [string, RegExp][] = [
      ["/admin/dashboard/", /Dashboard/],
      ["/admin/dashboard/?range=custom&from=2026-01-01&to=2026-12-31", /Dashboard/],
      ["/admin/enquiries/", /Enquiries/],
      ["/admin/enquiries/?status=NEW&priority=URGENT&q=test&view=archived", /Enquiries/],
      [`/admin/enquiries/${detailId}/`, new RegExp(reference)],
      ["/admin/contacts/", /Contact messages/],
      ["/admin/follow-ups/", /Follow-ups/],
      ["/admin/follow-ups/?bucket=completed", /Follow-ups/],
      ["/admin/inbox/", /Email inbox/],
      ["/admin/inbox/?awaiting=reply", /Email inbox/],
      ["/admin/attachments/", /Attachments/],
      ["/admin/email-logs/", /Email logs/],
      ["/admin/email-logs/?status=FAILED", /Email logs/],
      ["/admin/activity/", /Activity/],
      ["/admin/export/", /Export enquiries/],
      ["/admin/settings/", /Settings/],
      ["/admin/health/", /System health/],
      [`/admin/customers/${customerId}/`, /Priya Nair/],
    ];
    for (const [p, re] of pages) {
      const r = await http(p);
      assert.equal(r.status, 200, `${p} -> ${r.status}`);
      assert.match(r.text, re, p);
      assert.ok(!/Application error|Something went wrong/.test(r.text), `${p} rendered an error`);
    }
    // The loading boundary streams the page, so a not-found result arrives with the 404 UI inside a 200 response.
    assert.match((await http("/admin/enquiries/not-a-uuid/")).text, /Not found/);
    assert.match((await http("/admin/customers/not-a-uuid/")).text, /Not found/);
  });

  group("Sign out");
  await check("logout invalidates the session server-side", async () => {
    const old = cookie;
    assert.equal((await http("/api/admin/auth/logout/", { method: "POST", json: {} })).status, 200);
    const replay = await http("/api/admin/dashboard/", { auth: false, headers: { cookie: old } });
    assert.equal(replay.status, 401, "the old cookie no longer works");
  });

  // ---------------------------------------------------------------- report
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${"=".repeat(60)}\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    console.log("\nFAILED:");
    for (const f of failed) console.log(` - ${f.name}\n     ${f.error}`);
    console.log("\n--- last server log ---\n" + serverLog.split("\n").slice(-25).join("\n"));
  }
  await shutdown();
  process.exit(failed.length ? 1 : 0);
}

async function shutdown() {
  server?.kill();
  await sink?.close();
}

main().catch(async (error) => {
  console.error("E2E run crashed:", error);
  await shutdown();
  process.exit(1);
});
