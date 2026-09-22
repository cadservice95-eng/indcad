"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Plug, Send, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "./api";
import { ChangePasswordForm } from "./AuthForms";
import { useConfirm, useToast } from "./feedback";
import { Card, btn, inputClass } from "./ui";

export type SettingsData = {
  businessEmail: string;
  fromName: string;
  fromEmail: string;
  smtp: { host: string | null; port: number; secure: boolean; user: string | null; passwordSet: boolean; configured: boolean; source: string };
  notify: { newEnquiry: boolean; customerConfirmation: boolean; emailFailure: boolean };
  canStoreSecrets: boolean;
  imapConfigured: boolean;
  inboundWebhookConfigured: boolean;
};

export type TemplateData = { key: string; label: string; description: string; automatic: boolean; subject: string; bodyHtml: string; variables: string[]; customised: boolean };

export type GeneralInfo = { siteUrl: string; adminUrl: string; timezone: string; environment: string; storage: string; inboundUrl: string; cronUrl: string; adminEmail: string; lastLogin: string | null };

const TABS = [
  ["business", "Business email"],
  ["smtp", "SMTP"],
  ["notifications", "Notifications"],
  ["templates", "Templates"],
  ["inbound", "Inbound email"],
  ["account", "Admin account"],
  ["general", "General"],
] as const;
type Tab = (typeof TABS)[number][0];

const label = "block text-sm font-medium text-navy-900";
const help = "mt-1 text-xs text-neutral-500";

export function SettingsView({ settings, templates, general }: { settings: SettingsData; templates: TemplateData[]; general: GeneralInfo }) {
  const [tab, setTab] = useState<Tab>("business");

  return (
    <div className="grid gap-5 lg:grid-cols-[13rem_minmax(0,1fr)]">
      <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {TABS.map(([id, name]) => (
          <button key={id} type="button" onClick={() => setTab(id)} aria-current={tab === id ? "page" : undefined} className={cn("whitespace-nowrap border px-3 py-2 text-left text-sm", tab === id ? "border-navy-900 bg-navy-900 font-medium text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400")}>
            {name}
          </button>
        ))}
      </nav>

      <div className="min-w-0">
        {tab === "business" ? <BusinessTab settings={settings} /> : null}
        {tab === "smtp" ? <SmtpTab settings={settings} adminEmail={general.adminEmail} /> : null}
        {tab === "notifications" ? <NotificationsTab settings={settings} /> : null}
        {tab === "templates" ? <TemplatesTab templates={templates} /> : null}
        {tab === "inbound" ? <InboundTab settings={settings} general={general} /> : null}
        {tab === "account" ? <AccountTab general={general} /> : null}
        {tab === "general" ? <GeneralTab general={general} /> : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function BusinessTab({ settings }: { settings: SettingsData }) {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState(settings.businessEmail);
  const [name, setName] = useState(settings.fromName);
  const [busy, setBusy] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const result = await api("/api/admin/settings/", { method: "PATCH", json: { businessEmail: email.trim(), fromName: name.trim() || null } });
    setBusy(false);
    if (!result.ok) return toast.error(result.error);
    toast.success("Business email settings saved.");
    router.refresh();
  }

  return (
    <Card title="Business email">
      <form onSubmit={save} className="max-w-xl space-y-4">
        <div>
          <label htmlFor="biz-email" className={label}>
            Support / business email
          </label>
          <input id="biz-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={cn(inputClass, "mt-1")} />
          <p className={help}>Where new-enquiry notifications are delivered and the address customers reply to.</p>
        </div>
        <div>
          <label htmlFor="biz-name" className={label}>
            Sender name
          </label>
          <input id="biz-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} className={cn(inputClass, "mt-1")} />
          <p className={help}>Shown as the &ldquo;From&rdquo; name on emails to customers.</p>
        </div>
        <p className="border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
          Emails are sent from <span className="font-mono">{settings.fromEmail}</span>. That address is set with the SMTP_FROM_EMAIL environment variable so it always matches your mail provider&apos;s authenticated sender.
        </p>
        <button type="submit" disabled={busy} className={btn.primary}>
          {busy ? "Saving…" : "Save"}
        </button>
      </form>
    </Card>
  );
}

// ---------------------------------------------------------------------------

type Connection = { ok: boolean; configured: boolean; error?: string; host?: string | null; port?: number };

function SmtpTab({ settings, adminEmail }: { settings: SettingsData; adminEmail: string }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const { smtp } = settings;
  const [host, setHost] = useState(smtp.host ?? "");
  const [port, setPort] = useState(String(smtp.port));
  const [secure, setSecure] = useState(smtp.secure ? "true" : "false");
  const [user, setUser] = useState(smtp.user ?? "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [testing, setTesting] = useState<"connection" | "send" | null>(null);
  const [testTo, setTestTo] = useState(adminEmail);
  const [result, setResult] = useState<{ connection: Connection; delivery: { status: string; error: string | null; to: string } | null } | null>(null);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const json: Record<string, unknown> = { smtpHost: host.trim() || null, smtpPort: Number(port) || null, smtpSecure: secure === "true", smtpUser: user.trim() || null };
    if (password) json.smtpPassword = password;
    const response = await api("/api/admin/settings/", { method: "PATCH", json });
    setBusy(false);
    if (!response.ok) return toast.error(response.error);
    setPassword("");
    toast.success("SMTP settings saved.");
    router.refresh();
  }

  async function removePassword() {
    if (!(await confirm({ title: "Remove the stored SMTP password?", message: "Emails will fail to send until a password is provided again (here or through the SMTP_PASSWORD environment variable).", confirmLabel: "Remove password", destructive: true }))) return;
    const response = await api("/api/admin/settings/", { method: "PATCH", json: { smtpPassword: "" } });
    if (!response.ok) return toast.error(response.error);
    toast.success("Stored password removed.");
    router.refresh();
  }

  async function test(mode: "connection" | "send") {
    setTesting(mode);
    setResult(null);
    const response = await api<{ connection: Connection; delivery: { status: string; error: string | null; to: string } | null }>("/api/admin/email/test/", { json: { mode, ...(mode === "send" && testTo.trim() ? { to: testTo.trim() } : {}) } });
    setTesting(null);
    if (!response.ok) return toast.error(response.error);
    setResult(response.data);
    router.refresh();
  }

  const sourceNote =
    smtp.source === "database" ? "These values are saved in the admin and override environment variables." : smtp.source === "environment" ? "Currently using the SMTP_* environment variables. Saving values here overrides them." : "SMTP is not configured yet.";

  return (
    <div className="space-y-5">
      <Card title="SMTP server">
        <p className="mb-4 flex items-center gap-2 text-sm">
          {smtp.configured ? <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden /> : <XCircle className="h-4 w-4 text-amber-600" aria-hidden />}
          <span className={smtp.configured ? "text-emerald-800" : "text-amber-800"}>{smtp.configured ? "Configured" : "Not configured"}</span>
          <span className="text-neutral-500">— {sourceNote}</span>
        </p>
        <form onSubmit={save} className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="smtp-host" className={label}>
              Host
            </label>
            <input id="smtp-host" value={host} onChange={(e) => setHost(e.target.value)} placeholder="smtp.your-provider.com" className={cn(inputClass, "mt-1")} autoComplete="off" />
            <p className={help}>Use the SMTP host your email provider gives you. Nothing is assumed about which provider you use.</p>
          </div>
          <div>
            <label htmlFor="smtp-port" className={label}>
              Port
            </label>
            <input id="smtp-port" type="number" min={1} max={65535} value={port} onChange={(e) => setPort(e.target.value)} className={cn(inputClass, "mt-1")} />
          </div>
          <div>
            <label htmlFor="smtp-secure" className={label}>
              Connection
            </label>
            <select id="smtp-secure" value={secure} onChange={(e) => setSecure(e.target.value)} className={cn(inputClass, "mt-1")}>
              <option value="true">SSL/TLS from the start (usually port 465)</option>
              <option value="false">STARTTLS / plain (usually port 587)</option>
            </select>
          </div>
          <div>
            <label htmlFor="smtp-user" className={label}>
              Username
            </label>
            <input id="smtp-user" value={user} onChange={(e) => setUser(e.target.value)} className={cn(inputClass, "mt-1")} autoComplete="off" />
          </div>
          <div>
            <label htmlFor="smtp-password" className={label}>
              Password
            </label>
            <input id="smtp-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={smtp.passwordSet ? "•••••••• (saved — leave blank to keep)" : "Enter password"} autoComplete="new-password" className={cn(inputClass, "mt-1")} />
            <p className={help}>
              {settings.canStoreSecrets ? "Stored encrypted. It is never shown again and never sent to the browser." : "To store a password here, set a 16+ character APP_SECRET on the server. Otherwise use the SMTP_PASSWORD environment variable."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
            <button type="submit" disabled={busy} className={btn.primary}>
              {busy ? "Saving…" : "Save SMTP settings"}
            </button>
            {smtp.passwordSet && smtp.source === "database" ? (
              <button type="button" onClick={removePassword} className={cn(btn.outline, "text-red-700")}>
                Remove stored password
              </button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card title="Test the connection">
        <div className="max-w-2xl space-y-4">
          <div className="flex flex-wrap items-end gap-2">
            <button type="button" onClick={() => test("connection")} disabled={testing !== null} className={btn.outline}>
              <Plug className="h-4 w-4" aria-hidden /> {testing === "connection" ? "Testing…" : "Test connection"}
            </button>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-0 flex-1">
              <label htmlFor="smtp-test-to" className={label}>
                Send a test email to
              </label>
              <input id="smtp-test-to" type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} className={cn(inputClass, "mt-1")} />
            </div>
            <button type="button" onClick={() => test("send")} disabled={testing !== null || !testTo.trim()} className={btn.secondary}>
              <Send className="h-4 w-4" aria-hidden /> {testing === "send" ? "Sending…" : "Send test email"}
            </button>
          </div>
          <p className={help}>Save your changes first — the test uses the saved settings.</p>

          {result ? (
            <div className="space-y-2" role="status">
              <p className={cn("flex items-start gap-2 border px-3 py-2 text-sm", result.connection.ok ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-red-300 bg-red-50 text-red-900")}>
                {result.connection.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
                {result.connection.ok ? `Connected to ${result.connection.host}:${result.connection.port}.` : `Connection failed: ${result.connection.error ?? "unknown error"}`}
              </p>
              {result.delivery ? (
                <p className={cn("flex items-start gap-2 border px-3 py-2 text-sm", result.delivery.status === "SENT" ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-red-300 bg-red-50 text-red-900")}>
                  {result.delivery.status === "SENT" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
                  {result.delivery.status === "SENT" ? `Test email delivered to the mail server for ${result.delivery.to}. Check that inbox (and spam).` : `Test email failed: ${result.delivery.error ?? "unknown error"}`}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------

function NotificationsTab({ settings }: { settings: SettingsData }) {
  const router = useRouter();
  const toast = useToast();
  const [notify, setNotify] = useState(settings.notify);
  const [busy, setBusy] = useState(false);

  const items: [keyof typeof notify, string, string][] = [
    ["newEnquiry", "New enquiry alerts", "Email the business address whenever a quote request or contact message arrives."],
    ["customerConfirmation", "Customer confirmation emails", "Send customers an automatic “we received your request” email with their reference number."],
    ["emailFailure", "Email failure alerts", "Raise an admin notification when an email could not be delivered."],
  ];

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const result = await api("/api/admin/settings/", { method: "PATCH", json: { notifyNewEnquiry: notify.newEnquiry, notifyCustomerConfirmation: notify.customerConfirmation, notifyEmailFailure: notify.emailFailure } });
    setBusy(false);
    if (!result.ok) return toast.error(result.error);
    toast.success("Notification settings saved.");
    router.refresh();
  }

  return (
    <Card title="Notifications">
      <form onSubmit={save} className="max-w-xl space-y-4">
        {items.map(([key, title, description]) => (
          <label key={key} className="flex cursor-pointer items-start gap-3 border border-neutral-200 p-3 hover:bg-neutral-50">
            <input type="checkbox" checked={notify[key]} onChange={(e) => setNotify((n) => ({ ...n, [key]: e.target.checked }))} className="mt-1 h-4 w-4 accent-copper-500" />
            <span>
              <span className="block text-sm font-medium text-navy-900">{title}</span>
              <span className="block text-xs text-neutral-500">{description}</span>
            </span>
          </label>
        ))}
        <p className="text-xs text-neutral-500">In-app notifications (the bell) are always on: new enquiries, customer replies, failed emails and follow-ups due.</p>
        <button type="submit" disabled={busy} className={btn.primary}>
          {busy ? "Saving…" : "Save"}
        </button>
      </form>
    </Card>
  );
}

// ---------------------------------------------------------------------------

const SAMPLE: Record<string, string> = {
  name: "Priya Nair",
  reference_number: "RCH-2026-000124",
  service: "Mechanical drafting",
  company: "Acme Engineering",
  support_email: "support@example.com",
  site_name: "Render CAD Hub",
  project_description: "Pump housing drawings for a new build.",
  reset_link: "https://example.com/admin/reset-password/?token=…",
};

function fillSample(source: string) {
  return source.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (_m, key: string) => SAMPLE[key] ?? "");
}

function TemplatesTab({ templates }: { templates: TemplateData[] }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [key, setKey] = useState(templates[0]?.key ?? "");
  const current = templates.find((t) => t.key === key) ?? templates[0];
  const [subject, setSubject] = useState(current?.subject ?? "");
  const [body, setBody] = useState(current?.bodyHtml ?? "");
  const [busy, setBusy] = useState(false);

  function choose(next: string) {
    const t = templates.find((x) => x.key === next);
    if (!t) return;
    setKey(next);
    setSubject(t.subject);
    setBody(t.bodyHtml);
  }

  if (!current) return null;
  const dirty = subject !== current.subject || body !== current.bodyHtml;

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const result = await api(`/api/admin/settings/templates/${key}/`, { method: "PUT", json: { subject, bodyHtml: body } });
    setBusy(false);
    if (!result.ok) return toast.error(result.error);
    toast.success("Template saved.");
    router.refresh();
  }

  async function reset() {
    if (!(await confirm({ title: "Restore the default text?", message: "Your edits to this template will be replaced by the built-in wording.", confirmLabel: "Restore default", destructive: true }))) return;
    const result = await api<{ template: TemplateData }>(`/api/admin/settings/templates/${key}/`, { method: "DELETE" });
    if (!result.ok) return toast.error(result.error);
    setSubject(result.data.template.subject);
    setBody(result.data.template.bodyHtml);
    toast.success("Default restored.");
    router.refresh();
  }

  const preview = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;line-height:1.6;color:#0b121c;padding:12px;margin:0">${fillSample(body)}</body></html>`;

  return (
    <Card title="Email templates">
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="tpl-select" className={label}>
            Template
          </label>
          <select id="tpl-select" value={key} onChange={(e) => choose(e.target.value)} className={cn(inputClass, "mt-1 w-auto min-w-64")}>
            {templates.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
                {t.customised ? " (edited)" : ""}
              </option>
            ))}
          </select>
        </div>
        <p className="max-w-md pb-2 text-xs text-neutral-500">
          {current.description} {current.automatic ? "Sent automatically." : "Inserted by you into a reply."}
        </p>
      </div>

      <form onSubmit={save} className="grid gap-5 xl:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label htmlFor="tpl-subject" className={label}>
              Subject
            </label>
            <input id="tpl-subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} required className={cn(inputClass, "mt-1")} />
          </div>
          <div>
            <label htmlFor="tpl-body" className={label}>
              Body (HTML)
            </label>
            <textarea id="tpl-body" value={body} onChange={(e) => setBody(e.target.value)} rows={14} required className={cn(inputClass, "mt-1 font-mono text-xs")} spellCheck={false} />
            <p className={help}>
              Basic tags only (p, br, strong, em, ul, ol, li, a). Placeholders:{" "}
              {current.variables.map((v) => (
                <code key={v} className="mr-1 bg-neutral-100 px-1 py-0.5 text-[11px]">{`{{${v}}}`}</code>
              ))}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy || !dirty} className={btn.primary}>
              {busy ? "Saving…" : "Save template"}
            </button>
            {current.customised ? (
              <button type="button" onClick={reset} className={btn.outline}>
                Restore default
              </button>
            ) : null}
          </div>
        </div>
        <div>
          <p className={label}>Preview (sample data)</p>
          <p className="mt-1 truncate border border-b-0 border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
            <span className="text-neutral-500">Subject: </span>
            {fillSample(subject)}
          </p>
          <iframe title="Template preview" sandbox="" srcDoc={preview} className="h-80 w-full border border-neutral-200 bg-white" />
        </div>
      </form>
    </Card>
  );
}

// ---------------------------------------------------------------------------

function InboundTab({ settings, general }: { settings: SettingsData; general: GeneralInfo }) {
  const code = "bg-neutral-100 px-1.5 py-0.5 font-mono text-xs break-all";
  return (
    <div className="space-y-5">
      <Card title="How customer replies reach this inbox">
        <div className="max-w-2xl space-y-3 text-sm text-neutral-700">
          <p>Sending email (Nodemailer / SMTP) cannot receive email. Customer replies come back into the conversation through one of two routes. Both match a reply to its enquiry using the email&apos;s threading headers, or the reference number in the subject.</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              {settings.imapConfigured ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" aria-hidden />}
              <span>
                <strong>IMAP mailbox</strong> — {settings.imapConfigured ? "configured. Use “Check inbox now” on the Email inbox page; a scheduled job checks it automatically." : "not configured. Set IMAP_HOST, IMAP_USER and IMAP_PASSWORD to read replies from the support mailbox."}
              </span>
            </li>
            <li className="flex items-start gap-2">
              {settings.inboundWebhookConfigured ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" aria-hidden />}
              <span>
                <strong>Provider webhook</strong> — {settings.inboundWebhookConfigured ? "enabled." : "disabled. Set INBOUND_EMAIL_SECRET to enable it."} Point your email provider&apos;s inbound routing at:
                <br />
                <code className={code}>{general.inboundUrl}</code>
                <br />
                <span className="text-xs text-neutral-500">POST the raw message (or the JSON form described in the setup guide) with the header </span>
                <code className="bg-neutral-100 px-1 font-mono text-xs">x-inbound-secret: &lt;your secret&gt;</code>
              </span>
            </li>
          </ul>
          <p>
            Scheduled check (IMAP): call <code className={code}>{general.cronUrl}</code> every few minutes with <code className="bg-neutral-100 px-1 font-mono text-xs">Authorization: Bearer &lt;CRON_SECRET&gt;</code>.
          </p>
          <p className="text-xs text-neutral-500">Secrets are configured as environment variables on the server and are never shown here.</p>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------

function AccountTab({ general }: { general: GeneralInfo }) {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState(general.adminEmail);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function saveEmail(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const result = await api("/api/admin/settings/account/", { method: "PATCH", json: { email: email.trim(), currentPassword: password } });
    setBusy(false);
    if (!result.ok) return toast.error(result.error);
    setPassword("");
    toast.success("Sign-in email updated.");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <Card title="Sign-in email">
        <form onSubmit={saveEmail} className="max-w-xl space-y-4">
          <div>
            <label htmlFor="acct-email" className={label}>
              Admin email
            </label>
            <input id="acct-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={cn(inputClass, "mt-1")} />
            <p className={help}>Used to sign in and to receive password reset links. There is exactly one admin account.</p>
          </div>
          <div>
            <label htmlFor="acct-pw" className={label}>
              Current password
            </label>
            <input id="acct-pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className={cn(inputClass, "mt-1")} />
          </div>
          <button type="submit" disabled={busy || !password || email.trim() === general.adminEmail} className={btn.primary}>
            {busy ? "Saving…" : "Update email"}
          </button>
        </form>
      </Card>
      <Card title="Change password">
        <div className="max-w-xl">
          <ChangePasswordForm />
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------

function GeneralTab({ general }: { general: GeneralInfo }) {
  const rows: [string, string][] = [
    ["Site URL", general.siteUrl],
    ["Admin URL", general.adminUrl],
    ["Timezone", general.timezone],
    ["Environment", general.environment],
    ["File storage", general.storage],
    ["Last sign-in", general.lastLogin ?? "—"],
  ];
  return (
    <Card title="General">
      <dl className="max-w-2xl divide-y divide-neutral-100 text-sm">
        {rows.map(([name, value]) => (
          <div key={name} className="grid gap-1 py-2.5 sm:grid-cols-[10rem_1fr]">
            <dt className="text-neutral-500">{name}</dt>
            <dd className="break-words font-medium text-navy-900">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 max-w-2xl text-xs text-neutral-500">These are deployment settings. Change the site URL with NEXT_PUBLIC_SITE_URL, the timezone with ADMIN_TIMEZONE and file storage with STORAGE_DRIVER, then redeploy.</p>
    </Card>
  );
}
