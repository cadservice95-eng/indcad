import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { eq } from "drizzle-orm";

process.env.PGLITE_DIR = "memory://";
process.env.APP_SECRET = "test-secret-for-unit-tests-only-0123456789";
process.env.SMTP_HOST = "127.0.0.1";
process.env.SMTP_SECURE = "false";
process.env.SMTP_FROM_EMAIL = "support@rendercadhub.com";
process.env.ADMIN_TIMEZONE = "Asia/Kolkata";

import { startSmtpSink, type SmtpSink } from "../scripts/dev-smtp";

type Modules = {
  db: typeof import("../lib/server/db");
  create: typeof import("../lib/server/enquiries/create");
  reply: typeof import("../lib/server/enquiries/reply");
  inbound: typeof import("../lib/server/email/inbound");
  send: typeof import("../lib/server/email/send");
  mutate: typeof import("../lib/server/enquiries/mutate");
  queries: typeof import("../lib/server/enquiries/queries");
  analytics: typeof import("../lib/server/enquiries/analytics");
  exporter: typeof import("../lib/server/enquiries/export");
  filters: typeof import("../lib/server/enquiries/filters");
  rate: typeof import("../lib/server/auth/rate-limit");
  notifications: typeof import("../lib/server/enquiries/notifications");
};

let sink: SmtpSink;
let m: Modules;

const pdf = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n");
let counter = 0;

function input(overrides: Partial<import("../lib/server/enquiries/create").NewEnquiryInput> = {}): import("../lib/server/enquiries/create").NewEnquiryInput {
  counter += 1;
  return {
    type: "QUOTE_REQUEST",
    source: "QUOTE_FORM",
    name: `Customer ${counter}`,
    email: `customer${counter}@example.com`,
    company: "Acme Engineering",
    phone: "+91 98765 43210",
    service: "Mechanical",
    projectType: "New design / new build",
    description: `Need drawings for pump housing number ${counter}, please quote.`,
    files: [],
    ...overrides,
  };
}

function inboundMail(overrides: Partial<import("../lib/server/email/inbound").InboundEmail> = {}): import("../lib/server/email/inbound").InboundEmail {
  counter += 1;
  return {
    messageId: `<in-${counter}-${Date.now()}@mail.example.com>`,
    inReplyTo: null,
    references: [],
    fromEmail: `sender${counter}@example.com`,
    fromName: "Some Sender",
    to: ["support@rendercadhub.com"],
    cc: [],
    subject: "Hello",
    text: "Body text",
    html: null,
    date: new Date(),
    attachments: [],
    headers: {},
    ...overrides,
  };
}

before(async () => {
  sink = await startSmtpSink({ port: 0 });
  process.env.SMTP_PORT = String(sink.port);
  m = {
    db: await import("../lib/server/db"),
    create: await import("../lib/server/enquiries/create"),
    reply: await import("../lib/server/enquiries/reply"),
    inbound: await import("../lib/server/email/inbound"),
    send: await import("../lib/server/email/send"),
    mutate: await import("../lib/server/enquiries/mutate"),
    queries: await import("../lib/server/enquiries/queries"),
    analytics: await import("../lib/server/enquiries/analytics"),
    exporter: await import("../lib/server/enquiries/export"),
    filters: await import("../lib/server/enquiries/filters"),
    rate: await import("../lib/server/auth/rate-limit"),
    notifications: await import("../lib/server/enquiries/notifications"),
  };
  await m.db.getDb();
});

after(async () => {
  await sink.close();
  await m.db.closeDb();
});

describe("enquiry creation", () => {
  it("issues unique, sequential reference numbers under concurrency", async () => {
    const results = await Promise.all(Array.from({ length: 20 }, () => m.create.createEnquiry(input())));
    const refs = results.map((r) => r.referenceNumber);
    assert.equal(new Set(refs).size, 20);
    for (const ref of refs) assert.match(ref, /^RCH-\d{4}-\d{6}$/);
    const numbers = refs.map((r) => Number(r.slice(-6))).sort((a, b) => a - b);
    assert.equal(numbers.at(-1)! - numbers[0], 19, "numbers are consecutive");
  });

  it("stores customer, first message, activity and attachments in one go", async () => {
    const created = await m.create.createEnquiry(input({ files: [{ originalName: "part.pdf", safeName: "part.pdf", extension: "pdf", mimeType: "application/pdf", size: pdf.length, data: pdf }] }));
    const detail = await m.queries.getEnquiryDetail(created.id);
    assert.ok(detail);
    assert.equal(detail.messages.length, 1);
    assert.equal(detail.messages[0].direction, "INBOUND");
    assert.equal(detail.attachments.length, 1);
    assert.equal(detail.enquiry.isRead, false);
    assert.equal(detail.enquiry.status, "NEW");
    assert.ok(detail.activity.some((a) => a.action === "ENQUIRY_CREATED"));
    assert.ok(detail.activity.some((a) => a.action === "ATTACHMENT_UPLOADED"));
  });

  it("reuses one customer per email and ignores exact duplicate submissions", async () => {
    const base = input();
    const first = await m.create.createEnquiry(base);
    const dup = await m.create.createEnquiry(base);
    assert.equal(dup.duplicate, true);
    assert.equal(dup.referenceNumber, first.referenceNumber);

    const second = await m.create.createEnquiry({ ...base, description: "A completely different second project for the same person." });
    assert.equal(second.duplicate, false);
    const a = await m.queries.getEnquiryDetail(first.id);
    const b = await m.queries.getEnquiryDetail(second.id);
    assert.equal(a!.enquiry.customerId, b!.enquiry.customerId);
    assert.equal(b!.history.length, 1);
  });

  it("does not merge different people who share a name", async () => {
    const a = await m.create.createEnquiry(input({ name: "Rahul Sharma" }));
    const b = await m.create.createEnquiry(input({ name: "Rahul Sharma" }));
    const da = await m.queries.getEnquiryDetail(a.id);
    const db_ = await m.queries.getEnquiryDetail(b.id);
    assert.notEqual(da!.enquiry.customerId, db_!.enquiry.customerId);
  });
});

describe("emails", () => {
  it("sends the admin notification and customer confirmation with the reference number", async () => {
    sink.messages.length = 0;
    const created = await m.create.createEnquiry(input({ name: "Priya Nair", email: "priya@example.com" }));
    await m.create.dispatchNewEnquiryEmails(created.id);
    const subjects = sink.messages.map((x) => x.parsed.subject);
    assert.ok(subjects.includes(`New Enquiry — ${created.referenceNumber}`), subjects.join(" | "));
    assert.ok(subjects.includes(`Quote Request Received — ${created.referenceNumber}`), subjects.join(" | "));
    const confirmation = sink.messages.find((x) => x.parsed.subject?.startsWith("Quote Request Received"))!;
    assert.equal(confirmation.envelopeTo[0], "priya@example.com");
    assert.equal(confirmation.parsed.headers.get("auto-submitted"), "auto-generated");
    const notification = sink.messages.find((x) => x.parsed.subject?.startsWith("New Enquiry"))!;
    assert.match(String(notification.parsed.html), /View Enquiry/);
    assert.equal(notification.parsed.replyTo?.value[0].address, "priya@example.com");
  });

  it("keeps the enquiry when email delivery fails, records it, and retries exactly once", async () => {
    const created = await m.create.createEnquiry(input());
    sink.messages.length = 0;
    sink.failWith = { code: 550, message: "Mailbox unavailable" };
    await m.create.dispatchNewEnquiryEmails(created.id);
    sink.failWith = null;

    const db = await m.db.getDb();
    const failed = await db.select().from(m.db.emailLogs).where(eq(m.db.emailLogs.enquiryId, created.id));
    assert.ok(failed.length >= 2);
    assert.ok(failed.every((row) => row.status === "FAILED" && row.attemptCount === 1 && row.errorMessage));
    assert.ok(await m.queries.getEnquiryDetail(created.id), "the enquiry survives the email failure");
    const alerts = await m.notifications.listNotifications({ limit: 50 });
    assert.ok(alerts.rows.some((n) => n.type === "EMAIL_FAILED" && n.enquiryId === created.id));

    // Two simultaneous retries of the same email must deliver it once.
    const target = failed[0];
    const [r1, r2] = await Promise.all([m.send.retryEmail(target.id), m.send.retryEmail(target.id)]);
    assert.ok([r1.status, r2.status].includes("SENT"));
    const deliveries = sink.messages.filter((x) => x.parsed.subject === target.subject);
    assert.equal(deliveries.length, 1, "no duplicate delivery from concurrent retries");
    const [after_] = await db.select().from(m.db.emailLogs).where(eq(m.db.emailLogs.id, target.id));
    assert.equal(after_.status, "SENT");
  });

  it("never stores password-reset content in the email log", async () => {
    const before_ = sink.messages.length;
    const result = await m.send.sendPasswordReset({ email: "admin@example.com", name: "Admin" }, "https://example.com/admin/reset-password/?token=SECRET-TOKEN-VALUE");
    assert.equal(result.status, "SENT");
    assert.equal(sink.messages.length, before_ + 1);
    const db = await m.db.getDb();
    const [row] = await db.select().from(m.db.emailLogs).where(eq(m.db.emailLogs.id, result.logId));
    assert.equal(row.payload, null);
    assert.ok(!JSON.stringify(row).includes("SECRET-TOKEN-VALUE"));
  });
});

describe("conversation threading", () => {
  it("sends a reply with proper headers and matches the customer's answer back to the enquiry", async () => {
    const created = await m.create.createEnquiry(input({ email: "thread@example.com", name: "Thread Person" }));
    sink.messages.length = 0;

    const sent = await m.reply.sendAdminReply({ enquiryId: created.id, to: "thread@example.com", subject: "Re: Quote", bodyHtml: "<p>We can do this by Friday.</p>", files: [] });
    assert.equal(sent.status, "SENT");
    const out = sink.messages.at(-1)!;
    assert.ok(out.parsed.subject!.includes(created.referenceNumber), "reference number is added to the subject");
    assert.ok(out.parsed.messageId);
    assert.equal(out.parsed.replyTo?.value[0].address, "support@rendercadhub.com");

    let detail = await m.queries.getEnquiryDetail(created.id);
    assert.equal(detail!.enquiry.status, "CONTACTED");
    assert.equal(detail!.enquiry.lastMessageDirection, "OUTBOUND");
    assert.ok(detail!.enquiry.lastContactedAt);

    // The customer replies to that exact message.
    const ingested = await m.inbound.ingestInboundEmail(
      inboundMail({ fromEmail: "thread@example.com", inReplyTo: out.parsed.messageId!, references: [out.parsed.messageId!], subject: `Re: ${out.parsed.subject}`, text: "Friday works.\n\nOn Mon, someone wrote:\n> We can do this by Friday." }),
    );
    assert.equal(ingested.outcome, "matched");
    detail = await m.queries.getEnquiryDetail(created.id);
    assert.equal(detail!.messages.length, 3, "web form message, our reply, customer answer");
    assert.equal(detail!.enquiry.lastMessageDirection, "INBOUND");
    assert.equal(detail!.enquiry.isRead, false);
    assert.ok(detail!.enquiry.lastCustomerReplyAt);
    const reply = detail!.messages.at(-1)!;
    assert.equal(reply.direction, "INBOUND");
    assert.equal(reply.bodyText, "Friday works.");

    // Our next reply threads onto the customer's message.
    const second = await m.reply.sendAdminReply({ enquiryId: created.id, to: "thread@example.com", subject: "Re: Quote", bodyHtml: "<p>Great.</p>", files: [] });
    assert.equal(second.status, "SENT");
    const out2 = sink.messages.at(-1)!;
    const inReplyTo = String(out2.parsed.inReplyTo);
    assert.ok(inReplyTo.includes("@mail.example.com"), inReplyTo);
    assert.ok(String(out2.parsed.references).includes(out.parsed.messageId!));
  });

  it("matches by reference number only when the sender is the enquiry's own customer", async () => {
    const created = await m.create.createEnquiry(input({ email: "owner@example.com" }));
    const own = await m.inbound.ingestInboundEmail(inboundMail({ fromEmail: "owner@example.com", subject: `Question about ${created.referenceNumber}` }));
    assert.equal(own.outcome, "matched");

    const stranger = await m.inbound.ingestInboundEmail(inboundMail({ fromEmail: "stranger@example.com", subject: `Trying ${created.referenceNumber}` }));
    assert.equal(stranger.outcome, "created", "a stranger quoting a reference cannot inject into the thread");
    assert.notEqual((stranger as { enquiryId: string }).enquiryId, created.id);
  });

  it("matches replies to the confirmation email and re-opens closed enquiries", async () => {
    const created = await m.create.createEnquiry(input({ email: "closed@example.com" }));
    sink.messages.length = 0;
    await m.send.sendCustomerConfirmation(created.id);
    const confirmationId = sink.messages.at(-1)!.parsed.messageId!;
    await m.mutate.setStatus(created.id, "CLOSED");
    const result = await m.inbound.ingestInboundEmail(inboundMail({ fromEmail: "closed@example.com", inReplyTo: confirmationId, subject: "Re: Quote Request Received" }));
    assert.equal(result.outcome, "matched");
    const detail = await m.queries.getEnquiryDetail(created.id);
    assert.equal(detail!.enquiry.status, "IN_REVIEW");
    assert.equal(detail!.enquiry.closedAt, null);
  });

  it("ignores duplicates, auto-replies, bounces and mail from our own address", async () => {
    const mail = inboundMail({ text: "A genuine new enquiry from email" });
    assert.equal((await m.inbound.ingestInboundEmail(mail)).outcome, "created");
    assert.equal((await m.inbound.ingestInboundEmail(mail)).outcome, "duplicate");
    assert.equal((await m.inbound.ingestInboundEmail(inboundMail({ headers: { "auto-submitted": "auto-replied" } }))).outcome, "ignored");
    assert.equal((await m.inbound.ingestInboundEmail(inboundMail({ fromEmail: "support@rendercadhub.com" }))).outcome, "ignored");
    assert.equal((await m.inbound.ingestInboundEmail(inboundMail({ fromEmail: "mailer-daemon@mail.example.com", subject: "Undelivered Mail" }))).outcome, "ignored");
    assert.equal((await m.inbound.ingestInboundEmail(inboundMail({ text: "", attachments: [] }))).outcome, "ignored");
  });

  it("validates inbound attachments: safe files kept, executables rejected and reported", async () => {
    const created = await m.create.createEnquiry(input({ email: "files@example.com" }));
    const result = await m.inbound.ingestInboundEmail(
      inboundMail({
        fromEmail: "files@example.com",
        subject: `Files for ${created.referenceNumber}`,
        attachments: [
          { filename: "drawing.pdf", contentType: "application/pdf", content: pdf },
          { filename: "setup.exe", contentType: "application/octet-stream", content: Buffer.from("MZ....") },
        ],
      }),
    );
    assert.equal(result.outcome, "matched");
    const detail = await m.queries.getEnquiryDetail(created.id);
    assert.deepEqual(detail!.attachments.map((a) => a.originalFilename), ["drawing.pdf"]);
    assert.ok(detail!.activity.some((a) => a.action === "ATTACHMENT_REJECTED" && a.description.includes("setup.exe")));
  });

  it("neutralises hostile HTML in inbound mail", async () => {
    const created = await m.create.createEnquiry(input({ email: "xss@example.com" }));
    await m.inbound.ingestInboundEmail(
      inboundMail({ fromEmail: "xss@example.com", subject: `Re ${created.referenceNumber}`, html: '<p>Hello</p><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(2)">x</a>', text: "Hello" }),
    );
    const detail = await m.queries.getEnquiryDetail(created.id);
    const html = detail!.messages.at(-1)!.bodyHtml ?? "";
    assert.ok(!/<script|onerror|javascript:|<img/i.test(html), html);
  });
});

describe("follow-ups, notes, archive and trash", () => {
  it("schedules, reschedules and completes follow-ups and keeps next_follow_up_at in sync", async () => {
    const created = await m.create.createEnquiry(input());
    const soon = new Date(Date.now() + 2 * 86_400_000);
    const later = new Date(Date.now() + 9 * 86_400_000);
    const first = await m.mutate.scheduleFollowUp(created.id, { dueAt: later, note: "Call" });
    await m.mutate.scheduleFollowUp(created.id, { dueAt: soon });
    let enquiry = (await m.queries.getEnquiryDetail(created.id))!.enquiry;
    assert.equal(enquiry.nextFollowUpAt?.getTime(), soon.getTime());

    await m.mutate.completeFollowUp(first.id);
    await m.mutate.rescheduleFollowUp(first.id, new Date(Date.now() + 86_400_000));
    enquiry = (await m.queries.getEnquiryDetail(created.id))!.enquiry;
    assert.ok(enquiry.nextFollowUpAt!.getTime() < soon.getTime());
    const counts = await m.queries.followUpCounts();
    assert.ok(counts.upcoming >= 2);
  });

  it("keeps internal notes private and audited", async () => {
    const created = await m.create.createEnquiry(input());
    sink.messages.length = 0;
    const note = await m.mutate.addNote(created.id, "Customer is price sensitive — internal only");
    await m.mutate.editNote(created.id, note.id, "Edited internal note");
    assert.equal(sink.messages.length, 0, "notes never generate email");
    await m.mutate.deleteNote(created.id, note.id);
    const detail = await m.queries.getEnquiryDetail(created.id);
    assert.equal(detail!.notes.length, 0);
    for (const action of ["NOTE_ADDED", "NOTE_EDITED", "NOTE_DELETED"]) assert.ok(detail!.activity.some((a) => a.action === action), action);
  });

  it("archives, trashes, restores and only purges from the trash", async () => {
    const created = await m.create.createEnquiry(input());
    await m.mutate.setArchived(created.id, true);
    assert.equal((await m.queries.listEnquiries({ view: "archived", ids: [created.id] })).total, 1);
    assert.equal((await m.queries.listEnquiries({ ids: [created.id] })).total, 0);

    await assert.rejects(() => m.mutate.purgeEnquiry(created.id), /trash/i);
    await m.mutate.moveToTrash(created.id);
    assert.equal((await m.queries.listEnquiries({ view: "trash", ids: [created.id] })).total, 1);
    await m.mutate.restoreFromTrash(created.id);
    assert.equal((await m.queries.listEnquiries({ view: "archived", ids: [created.id] })).total, 1);

    await m.mutate.moveToTrash(created.id);
    await m.mutate.purgeEnquiry(created.id);
    assert.equal(await m.queries.getEnquiryDetail(created.id), null);
  });

  it("applies bulk actions and reports skipped ids", async () => {
    const a = await m.create.createEnquiry(input());
    const b = await m.create.createEnquiry(input());
    const result = await m.mutate.bulkApply([a.id, b.id, "00000000-0000-4000-8000-000000000000"], { action: "status", status: "QUOTED" });
    assert.equal(result.done, 2);
    assert.equal(result.skipped, 1);
    const list = await m.queries.listEnquiries({ ids: [a.id, b.id], status: ["QUOTED"] });
    assert.equal(list.total, 2);
  });
});

describe("search, filters, analytics and export", () => {
  it("finds enquiries by reference, name, email, phone, company, service and message text", async () => {
    const created = await m.create.createEnquiry(
      input({ name: "Zebulon Quixote", email: "zeb.quixote@unique-domain.test", phone: "+91 90000 12345", company: "Zzyzx Fabrication", service: "Structural", description: "Rooftop gantry crane girder detailing please" }),
    );
    for (const q of [created.referenceNumber, "Zebulon", "unique-domain.test", "90000 12345", "Zzyzx", "gantry crane"]) {
      const result = await m.queries.listEnquiries({ q });
      assert.ok(result.rows.some((r) => r.id === created.id), `search for ${q}`);
    }
    assert.equal((await m.queries.listEnquiries({ q: "definitely-not-present-xyz" })).total, 0);
  });

  it("treats hostile search input as data (SQL injection and LIKE wildcards)", async () => {
    for (const q of ["'; DROP TABLE enquiries; --", "%", "_", "\\", "' OR '1'='1"]) {
      const result = await m.queries.listEnquiries({ q });
      assert.ok(Array.isArray(result.rows));
    }
    const all = await m.queries.listEnquiries({});
    assert.ok(all.total > 0, "table still exists and has rows");
    assert.equal((await m.queries.listEnquiries({ q: "%" })).total, 0, "a literal % does not act as a wildcard");
  });

  it("combines filters", async () => {
    const created = await m.create.createEnquiry(input({ type: "CONTACT_MESSAGE", source: "CONTACT_FORM", service: null }));
    await m.mutate.setPriority(created.id, "URGENT");
    const result = await m.queries.listEnquiries({ type: "CONTACT_MESSAGE", priority: ["URGENT"], source: "CONTACT_FORM", unread: true, status: ["NEW"] });
    assert.ok(result.rows.some((r) => r.id === created.id));
  });

  it("computes dashboard analytics", async () => {
    const data = await m.analytics.getDashboard({ preset: "today" });
    assert.equal(data.cards.total, data.cards.quotes + data.cards.contacts);
    assert.ok(data.cards.total > 0);
    assert.equal(data.series.points.reduce((sum, p) => sum + p.total, 0), data.cards.total);
    assert.ok(data.byStatus.length > 0);
    assert.ok(data.byService.length > 0);
    const all = await m.analytics.getDashboard({ preset: "all" });
    assert.ok(all.cards.total >= data.cards.total);
    const custom = await m.analytics.getDashboard({ preset: "custom", from: "2020-01-01", to: "2020-01-31" });
    assert.equal(custom.cards.total, 0);
  });

  it("exports the filtered enquiries as safe CSV", async () => {
    const created = await m.create.createEnquiry(input({ name: "=cmd|' /C calc'!A0", company: "Comma, Inc", email: "csv@example.com" }));
    const { csv, count } = await m.exporter.exportEnquiriesCsv({ ids: [created.id] });
    assert.equal(count, 1);
    assert.ok(csv.includes(created.referenceNumber));
    assert.ok(csv.includes("'=cmd"), "formula prefix is neutralised");
    assert.ok(csv.includes('"Comma, Inc"'));
    assert.ok(!/password|token|session/i.test(csv.split("\r\n")[0]), "no auth data columns");
  });
});

describe("rate limiting", () => {
  it("allows up to the limit then blocks, with a retry-after", async () => {
    const key = `test:${Date.now()}`;
    const results = [];
    for (let i = 0; i < 5; i += 1) results.push(await m.rate.hitRateLimit(key, 3, 60));
    assert.deepEqual(results.map((r) => r.allowed), [true, true, true, false, false]);
    assert.ok(results[3].retryAfterSeconds > 0);
    assert.equal((await m.rate.peekRateLimit(key, 3, 60)).allowed, false);
    await m.rate.resetRateLimit(key);
    assert.equal((await m.rate.peekRateLimit(key, 3, 60)).allowed, true);
  });

  it("counts correctly when many requests arrive at once", async () => {
    const key = `burst:${Date.now()}`;
    const results = await Promise.all(Array.from({ length: 30 }, () => m.rate.hitRateLimit(key, 10, 60)));
    assert.equal(results.filter((r) => r.allowed).length, 10);
  });
});
