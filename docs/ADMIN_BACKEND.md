# Render CAD Hub — Admin backend

A single-admin lead and enquiry management system behind the public site:
**Forms → Leads → Conversations → Email → Follow-ups → Admin.** It is not a CMS, CRM
suite or accounting tool — see [What is deliberately not included](#what-is-deliberately-not-included).

The public website (pages, URLs, metadata, canonical tags, structured data, sitemap) is unchanged.
Only the Quote and Contact forms were connected to the backend.

---

## 1. What you get

| Area | Where |
|---|---|
| Sign in / sign out / forgot & reset / change password | `/admin/login/` … |
| Dashboard (cards, date ranges, charts, sources, UTM) | `/admin/dashboard/` |
| Enquiries: search, filters, saved filters, bulk actions, export, archive, trash | `/admin/enquiries/` |
| Enquiry workspace: conversation, reply composer, drafts, templates, notes, follow-ups, attachments, timeline, customer history | `/admin/enquiries/<id>/` |
| Contact messages | `/admin/contacts/` |
| Follow-ups (overdue / today / upcoming / completed) | `/admin/follow-ups/` |
| Email inbox (conversation threads) | `/admin/inbox/` |
| Attachments (preview / download / delete) | `/admin/attachments/` |
| Email logs (status, attempts, error, retry) | `/admin/email-logs/` |
| Activity / audit trail | `/admin/activity/` |
| CSV export | `/admin/export/` |
| Settings: business email, SMTP (+test), notifications, templates, inbound email, admin account | `/admin/settings/` |
| Health: database, SMTP, storage, app | `/admin/health/` |
| Customer profile | `/admin/customers/<id>/` |
| Notification centre (bell) | every admin page |

## 2. Architecture

```
Browser ── /get-a-quote/, /contact/ ──► POST /api/forms/{quote,contact}/
                                          │  validate · honeypot · timing · rate-limit · file checks
                                          ▼
                             ┌─ one DB transaction ─────────────────────────────┐
                             │ customer (by email) · enquiry (RCH-YYYY-NNNNNN)  │
                             │ first message · attachments · activity · alert   │
                             └──────────────────────────────────────────────────┘
                                          │ after the response (never rolls the enquiry back)
                                          ▼
                    admin notification  +  customer confirmation  (email_logs: QUEUED→SENDING→SENT/FAILED)

Customer reply ──► IMAP mailbox poll  or  provider webhook ──► ingest ──► matched to the enquiry
                   (In-Reply-To / References → Message-ID, else reference number + same sender)

Admin ── /admin/* pages (server-rendered, session checked in every page and API) ──► /api/admin/*
```

* **Framework:** Next.js 16 App Router (Node runtime), TypeScript strict, Tailwind v4.
* **Database:** PostgreSQL via Drizzle ORM. Migrations are plain SQL in `drizzle/`.
  Without `DATABASE_URL`, *development* uses an embedded PGlite database in `.data/pglite`;
  production refuses to start the admin without a real database.
* **Email out:** Nodemailer over SMTP (`lib/server/email/`). Message-ID / In-Reply-To / References are set so replies thread in every mail client.
* **Email in:** IMAP polling (`imapflow` + `mailparser`) **or** a provider webhook. SMTP cannot receive mail.
* **Files:** validated, then stored in Postgres (`STORAGE_DRIVER=database`, default) or on disk (`local`, self-hosted only).
* **Auth:** one admin account, scrypt password hashes, opaque session tokens (only a SHA-256 is stored), HttpOnly cookie.

## 3. Production setup (step by step)

### 3.1 Database
Create any PostgreSQL 14+ database (Neon, Supabase, Vercel Postgres, RDS, your own server) and set `DATABASE_URL`.
Apply the schema once per deploy:

```bash
npm run db:migrate
```

On Vercel set the build command to `npm run db:migrate && npm run build`.

### 3.2 Required environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `APP_SECRET` | 32+ random characters. Encrypts an SMTP password if you save it in the admin. `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `ADMIN_EMAIL` | The admin's sign-in email |
| `ADMIN_INITIAL_PASSWORD` | Temporary password (12+ chars, letters + numbers). You are forced to replace it at first sign-in. Remove it afterwards. |
| `NEXT_PUBLIC_SITE_URL` | `https://www.rendercadhub.com` — used for links in emails |

Everything is listed and explained in [`.env.example`](../.env.example). **No secret ever uses the `NEXT_PUBLIC_` prefix.**

### 3.3 Create the admin
Automatic: set `ADMIN_EMAIL` + `ADMIN_INITIAL_PASSWORD`, open `/admin/login/` and sign in.
Or explicitly: `npm run admin:create`. Both refuse to create a second admin.

### 3.4 Sending email (SMTP) — support@rendercadhub.com
Use the SMTP details from **the provider that hosts the `support@rendercadhub.com` mailbox** (Google Workspace, Zoho, Microsoft 365, cPanel hosting, an email API's SMTP relay, …). No provider is assumed.

```
SMTP_HOST=<your provider's SMTP host>
SMTP_PORT=465            # 465 + SMTP_SECURE=true, or 587 + SMTP_SECURE=false (STARTTLS)
SMTP_SECURE=true
SMTP_USER=support@rendercadhub.com
SMTP_PASSWORD=<mailbox or app password>     # server-side only
SMTP_FROM_EMAIL=support@rendercadhub.com
SMTP_FROM_NAME=Render CAD Hub
```

You can instead enter host/port/user/password in **Settings → SMTP** (the password is encrypted with `APP_SECRET`, never displayed again and never sent to the browser). Then use **Test connection** and **Send test email**.

For deliverability, publish **SPF, DKIM and DMARC** DNS records for `rendercadhub.com` as your provider documents. Without them customer confirmations are likely to land in spam.

### 3.5 Receiving customer replies (choose one or both)
1. **IMAP** — set `IMAP_HOST`, `IMAP_USER`, `IMAP_PASSWORD` (port 993/TLS by default). New mail is read when you press **Check inbox now**, and by a scheduler (below).
2. **Provider webhook** — set `INBOUND_EMAIL_SECRET` and point your provider's inbound routing (or a forwarding rule / worker) at
   `POST https://www.rendercadhub.com/api/inbound/email/` with header `x-inbound-secret: <secret>`.
   Body: the raw RFC 822 message (`Content-Type: message/rfc822`), or JSON:
   `{ "from": "Name <a@b.com>", "subject": "...", "text": "...", "html": "...", "messageId": "<id@host>", "inReplyTo": "<id@host>", "references": ["<id@host>"], "attachments": [{ "filename": "x.pdf", "contentType": "application/pdf", "contentBase64": "..." }] }`.

Matching order: `In-Reply-To`/`References` → a Message-ID we sent (unguessable, so trusted) → the `RCH-…` reference number in the subject **only if the sender is the enquiry's own customer**. Anything else becomes a new "Direct email" enquiry. Auto-replies, bounces, mailing-list mail and mail from our own address are ignored. Bounces that reference one of our emails raise an "email failed" alert.

### 3.6 Scheduler (IMAP + follow-up reminders)
Set `CRON_SECRET` and call `GET /api/cron/inbound-email/` with `Authorization: Bearer <CRON_SECRET>` every few minutes from any scheduler.
On Vercel Hobby, cron is limited to once a day, so `vercel.json` was intentionally **not** added; use a Pro plan cron, an external scheduler, or rely on the **Check inbox now** button and the webhook.

### 3.7 Vercel-specific notes
* Request bodies are limited to ~4.5 MB. The public forms therefore accept **4 MB of attachments in total** (`MAX_UPLOAD_TOTAL_MB`). Customers can send bigger files by replying to the confirmation email (received via IMAP/webhook, up to `MAX_ATTACHMENT_MB` per file).
* The file system is read-only/ephemeral, so keep `STORAGE_DRIVER=database`.
* Keep `DATABASE_POOL_MAX` small (default 5) with serverless.
* The client IP for rate limiting comes from `x-forwarded-for`, which Vercel sets. If you self-host behind a proxy, make sure it overwrites that header.

## 4. How the main flows behave

* **Reference numbers** `RCH-YYYY-NNNNNN`: a per-year atomic counter (single upsert) plus a unique index, so concurrent submissions can never collide. Immutable.
* **Customers** are matched by email only — two people with the same name are never merged.
* **Duplicate submissions** (same email + same message within 24 h) return the original reference and create nothing.
* **Email failure never loses an enquiry.** The enquiry is committed first; emails are sent afterwards, logged, and can be retried. A reply that fails to send stays in the conversation flagged "Not delivered" with a **Retry** button. Retries claim the log row atomically, so a double click cannot send twice.
* **Replies** only change the enquiry (status → Contacted, last-contacted date) once the email is actually sent. A reply can also set the next status (e.g. Quoted, Awaiting customer).
* **Follow-ups** are internal reminders. They never email the customer. Due/overdue items appear on the dashboard, the Follow-ups page and the bell.
* **Notes** are private and never emailed. **Drafts** are private until you press Send.
* **Archive** hides from the active list; **Trash** is a soft delete (restorable); permanent delete is only possible from Trash and needs confirmation.
* **A customer reply to a closed/archived/trashed enquiry** re-opens it (and is logged) so it is never silently lost.

## 5. Security summary

* Every `/api/admin/*` route goes through `withAdmin()`: server-side session check, same-origin (CSRF) check on state-changing requests, safe error mapping. Every admin **page** also verifies the session (`requireAdminPage`) because layouts do not re-run on navigation. `proxy.ts` is only an optimistic redirect, not the security boundary.
* Passwords: scrypt (N=2¹⁵), min 12 chars with letters + numbers. Login is throttled per account (6 failures / 15 min) and per IP (20 / 15 min) using a database-backed limiter that is shared across serverless instances. Unknown accounts take the same time as wrong passwords and get the same message.
* Sessions: 7-day maximum, 8-hour idle timeout, HttpOnly + SameSite=Lax + Secure (production) cookie, revoked on logout, on password reset and on password change (other sessions).
* Password reset: single-use, 60-minute token; only its SHA-256 is stored; the reset email body is never stored in the email log; the link is built from `NEXT_PUBLIC_SITE_URL`, never from the request `Host` header; the endpoint never reveals whether an address exists.
* Public forms: server-side validation, honeypot, minimum-fill-time check, link-spam heuristic, per-IP / per-day / global / per-email rate limits (the per-email limit stops the form being used to spam a third party with confirmation emails), body-size cap, generic error messages.
* Uploads: extension allow-list **and** content-signature check; executable/script signatures, dangerous double extensions and archives containing them are rejected; filenames are sanitised; storage keys are random (no path traversal); downloads are forced-attachment with `nosniff` (only PNG/JPEG/WebP/PDF can be previewed inline).
* HTML: everything shown or sent goes through an allow-list sanitiser (scripts, event handlers, `javascript:` URLs, iframes, images removed). Template values are escaped; subjects are stripped of newlines (no header injection).
* CSV export escapes formula-injection (`= + - @`), never contains auth data, and is capped at 20,000 rows.
* Secrets: nothing secret is `NEXT_PUBLIC_`; the SMTP password is never returned by any API or rendered in any page; logs redact passwords, tokens and secrets; the SMTP password is stripped from provider error messages before they are stored.
* Admin pages send `noindex`, `no-store`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: no-referrer`.

## 6. API reference (all under `/api/`, JSON unless noted)

**Public:** `POST forms/quote/`, `POST forms/contact/` (multipart).
**Provider/cron (secret-protected):** `POST inbound/email/`, `GET cron/inbound-email/`.
**Admin (session required):**
`admin/auth/{login,logout,me,forgot-password,reset-password,change-password}/` ·
`admin/dashboard/` · `admin/enquiries/` (+`bulk/`, `[id]/`, `[id]/{status,priority,read,notes,notes/[noteId],follow-up,archive,restore,reply,drafts,drafts/[draftId],template}/`) ·
`admin/contacts/` · `admin/follow-ups/` (+`[id]/`) · `admin/messages/[id]/` ·
`admin/attachments/` (+`[id]/`, `[id]/download/`) ·
`admin/email/{test,logs,logs/[id],retry,inbox}/` · `admin/notifications/` · `admin/export/enquiries/` ·
`admin/activity/` · `admin/saved-filters/` (+`[id]/`) · `admin/settings/` (+`account/`, `templates/`, `templates/[key]/`) · `admin/health/`.

Errors are `{ "ok": false, "error": "…", "code": "…" }` with a proper status (400/401/403/404/409/413/429/500).

## 7. Testing

```bash
npm run typecheck
npm test                 # unit + database-backed tests (embedded PGlite, local SMTP sink)
npm run build && npm run test:e2e   # real production server: 57 end-to-end checks
npm run dev:smtp         # local SMTP sink for manual testing (.data/mail)
```

Results at hand-over (2026-09-21):

| Suite | Result |
|---|---|
| Unit (passwords, uploads, sanitising, CSV, references, date ranges, inbound helpers) | 19 / 19 |
| Database-backed (references under concurrency, dedupe, transactions, email failure & concurrent retry, threading, inbound matching, follow-ups, trash, bulk, search, analytics, export, rate limits) | 24 / 24 |
| End-to-end against `next start` | 57 / 57 |
| Real-browser pass (Chromium): sign-in, forced password change, dashboard, list, search, bulk, reply with template + quick reply, note, follow-up, SMTP test, mobile drawer, public quote & contact forms incl. UTM/landing-page capture | no console/page errors, no horizontal overflow on mobile |

The end-to-end suite covers: authentication (wrong password, forced change, cookie flags, lockout, forgot/reset single-use, session revocation, CSRF), unauthorised access to every admin endpoint and page, forged cookies, quote & contact submission, honeypot / too-fast / link-spam / missing-timestamp handling, validation, dangerous / disguised / oversized / too-many attachments, per-IP and per-email rate limits, XSS payloads, SQL-injection strings, malformed and unknown ids (IDOR probing), threading headers, inbound matching (including a stranger quoting a reference number), duplicate inbound, auto-replies, failed email → alert → retry-once, drafts, attachment download headers, export, saved filters, bulk / archive / trash / restore, settings never exposing the SMTP password, templates, health, cron, every admin page, and logout invalidation.

**Not verifiable in the build environment (please test once against your real accounts):** delivery through your actual SMTP provider, reading a real IMAP mailbox, and your provider's inbound-webhook format. The parsing, matching and ingestion are tested with realistic raw messages; the network legs are exercised only against local stand-ins.

## 8. What is deliberately not included

Roles/permissions, multiple admins, any CMS (blog, services, industries, projects, locations, testimonials, FAQs, products), external sales CRM, accounting, invoicing. There is exactly one admin account.

## 9. Known limits

* Public form attachments: 4 MB total (hosting request-body limit). Larger files arrive by email reply.
* The "Preferred contact method", "Budget" and "Currency" fields exist in the data model and API, but the existing public forms do not show them (to leave the frontend design untouched). They can be added to the forms without backend changes.
* Rich-text composer uses the browser's `contentEditable`; content is sanitised on the server before storing or sending.
* Email delivery is "accepted by your mail server" (SENT). Bounces that arrive later are only detected when they reach the mailbox that IMAP/webhook reads.

## 10. Troubleshooting

| Symptom | Check |
|---|---|
| Admin shows "temporarily unavailable" | `DATABASE_URL` missing/wrong → **Health** page, server log `api.database_not_configured` |
| Emails fail | **Settings → SMTP → Test connection**; **Email logs** shows the provider's error; then **Retry all failed** |
| Customer replies don't appear | Health → "Inbound email"; run **Check inbox now**; confirm IMAP credentials or webhook secret |
| Locked out | Wait 15 minutes, or use **Forgot password** (needs working SMTP) |
| Forgot password and SMTP is down | Set a new `ADMIN_INITIAL_PASSWORD`, remove the admin row in the database, and sign in again — or run `npm run admin:create` against an empty `admins` table |
