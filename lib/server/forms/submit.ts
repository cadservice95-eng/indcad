import { after } from "next/server";
import { hitRateLimit } from "../auth/rate-limit";
import { createEnquiry, dispatchNewEnquiryEmails, type NewEnquiryInput } from "../enquiries/create";
import { env } from "../env";
import { ApiError, assertSameOrigin, cleanText, clientIp, guard, ok, stripControl, userAgent } from "../http";
import { log } from "../log";
import { validateUpload, type ValidatedFile } from "../uploads/validate";

export type FormKind = "quote" | "contact";

const MAX_FILES = 5;
/** Multipart overhead allowance on top of the file budget (text fields, boundaries). */
const BODY_OVERHEAD_BYTES = 256 * 1024;
const MIN_FILL_MS = 2_500;

const EMAIL_PATTERN = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;
const PHONE_PATTERN = /^[+()\d\s\-.]{5,30}$/;
const CONTACT_METHODS = ["Email", "Phone", "WhatsApp"] as const;

const busy = () => new ApiError(429, "We're receiving a lot of requests right now. Please try again in a few minutes.", "RATE_LIMITED", undefined, { "Retry-After": "300" });

function field(form: FormData, name: string, max: number): string {
  return cleanText(form.get(name), max);
}

function requireLength(value: string, min: number, label: string) {
  if (value.length < min) throw new ApiError(400, `${label} is required.`, "VALIDATION");
}

/** Spam that should look like a success to the sender, so bots get no signal to adapt to. */
function spamReason(form: FormData, startedAt: number, text: string): string | null {
  if (cleanText(form.get("hp_field"), 200)) return "honeypot";
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS) return "submitted-too-fast";
  const links = text.match(/https?:\/\/|www\./gi)?.length ?? 0;
  if (links > 4) return "too-many-links";
  if (/\[url=|<a\s+href=/i.test(text)) return "link-markup";
  return null;
}

async function readFiles(form: FormData): Promise<ValidatedFile[]> {
  const raw = [...form.getAll("files"), ...form.getAll("file")].filter((v): v is File => typeof v !== "string" && v.size > 0);
  if (raw.length === 0) return [];
  if (raw.length > MAX_FILES) throw new ApiError(400, `You can attach up to ${MAX_FILES} files.`, "TOO_MANY_FILES");

  const total = raw.reduce((sum, f) => sum + f.size, 0);
  if (total > env.maxPublicUploadBytes) {
    throw new ApiError(413, `Attachments are limited to ${Math.floor(env.maxPublicUploadBytes / 1024 / 1024)}MB in total. Send larger files by replying to our confirmation email.`, "FILES_TOO_LARGE");
  }

  const files: ValidatedFile[] = [];
  for (const file of raw) {
    const result = validateUpload({ name: file.name, data: Buffer.from(await file.arrayBuffer()), declaredType: file.type }, { maxBytes: env.maxPublicUploadBytes });
    if (!result.ok) throw new ApiError(400, `“${stripControl(file.name).slice(0, 80)}” was not accepted: ${result.reason}`, "FILE_REJECTED");
    files.push(result.file);
  }
  return files;
}

/** Only same-site paths/URLs are kept as the landing page; anything else could be attacker-supplied noise. */
function cleanLanding(value: string): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return value.slice(0, 500);
  try {
    const url = new URL(value);
    return `${url.pathname}${url.search}`.slice(0, 500);
  } catch {
    return null;
  }
}

async function enforceLimits(request: Request, ip: string) {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > env.maxPublicUploadBytes + BODY_OVERHEAD_BYTES) {
    throw new ApiError(413, `The submission is too large. Attachments are limited to ${Math.floor(env.maxPublicUploadBytes / 1024 / 1024)}MB in total.`, "TOO_LARGE");
  }
  const [perIp, perDay, global] = await Promise.all([
    hitRateLimit(`form:ip:${ip}`, 8, 600),
    hitRateLimit(`form:ip-day:${ip}`, 40, 86_400),
    hitRateLimit("form:global", 600, 3600),
  ]);
  if (!perIp.allowed) throw new ApiError(429, "Too many submissions. Please wait a few minutes and try again.", "RATE_LIMITED", undefined, { "Retry-After": String(perIp.retryAfterSeconds) });
  if (!perDay.allowed || !global.allowed) throw busy();
}

export function handleFormSubmission(request: Request, kind: FormKind): Promise<Response> {
  return guard(async () => {
    assertSameOrigin(request);
    const ip = clientIp(request.headers);
    await enforceLimits(request, ip);

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      throw new ApiError(400, "We couldn't read your submission. Please reload the page and try again.", "BAD_REQUEST");
    }

    const name = field(form, "name", 120);
    const email = field(form, "email", 254).toLowerCase();
    const phone = field(form, "phone", 30);
    const company = field(form, "company", 160);
    const service = field(form, "service", 120);
    const projectType = field(form, "projectType", 120);
    const description = kind === "quote" ? field(form, "description", 8000) : field(form, "message", 8000);
    const notes = field(form, "notes", 4000);

    requireLength(name, 2, "Your name");
    if (!EMAIL_PATTERN.test(email)) throw new ApiError(400, "Enter a valid email address.", "VALIDATION");
    if (phone && !PHONE_PATTERN.test(phone)) throw new ApiError(400, "Enter a valid phone number.", "VALIDATION");
    if (kind === "quote") requireLength(service, 1, "Service");
    if (description.length < (kind === "quote" ? 10 : 5)) {
      throw new ApiError(400, kind === "quote" ? "Please describe your project in a little more detail." : "Please write a message.", "VALIDATION");
    }

    const deadline = field(form, "deadline", 20);
    if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) throw new ApiError(400, "Enter a valid deadline date.", "VALIDATION");
    const contactMethod = field(form, "preferredContactMethod", 20);
    const preferredContactMethod = CONTACT_METHODS.find((m) => m.toLowerCase() === contactMethod.toLowerCase()) ?? null;

    const startedAt = Number(cleanText(form.get("form_ts"), 20));
    const silent = spamReason(form, startedAt, `${description}\n${notes}`);
    if (silent) {
      log.warn("form.spam_dropped", { kind, reason: silent });
      return ok();
    }
    // Real visitors always send the render timestamp; direct posts without it are treated as automated.
    if (!Number.isFinite(startedAt) || startedAt <= 0) throw new ApiError(400, "Please reload the page and try again.", "BAD_REQUEST");

    // One address must not be able to trigger unlimited confirmation emails to a third party.
    const perEmail = await hitRateLimit(`form:email:${email}`, 4, 3600);
    if (!perEmail.allowed) throw new ApiError(429, "We've already received several messages from this email address. We'll be in touch shortly.", "RATE_LIMITED", undefined, { "Retry-After": String(perEmail.retryAfterSeconds) });

    const files = await readFiles(form);

    const country = cleanText(request.headers.get("x-vercel-ip-country"), 8) || null;
    let city: string | null = null;
    try {
      city = cleanText(decodeURIComponent(request.headers.get("x-vercel-ip-city") ?? ""), 80) || null;
    } catch {
      city = null;
    }

    const input: NewEnquiryInput = {
      type: kind === "quote" ? "QUOTE_REQUEST" : "CONTACT_MESSAGE",
      source: kind === "quote" ? "QUOTE_FORM" : "CONTACT_FORM",
      name,
      email,
      company: company || null,
      phone: phone || null,
      country,
      city,
      service: service || null,
      projectType: projectType || null,
      description,
      notes: notes || null,
      timeline: deadline || null,
      budget: field(form, "budget", 60) || null,
      currency: field(form, "currency", 8).toUpperCase() || null,
      preferredContactMethod,
      landingPage: cleanLanding(field(form, "landing_page", 500)),
      referrer: field(form, "referrer", 500) || null,
      utmSource: field(form, "utm_source", 150) || null,
      utmMedium: field(form, "utm_medium", 150) || null,
      utmCampaign: field(form, "utm_campaign", 150) || null,
      utmTerm: field(form, "utm_term", 150) || null,
      utmContent: field(form, "utm_content", 150) || null,
      ipAddress: ip === "unknown" ? null : ip,
      userAgent: userAgent(request.headers),
      files,
    };

    const created = await createEnquiry(input);
    if (!created.duplicate) {
      // The enquiry is already saved; email problems are logged and can be retried from the admin.
      after(() => dispatchNewEnquiryEmails(created.id));
    }
    return ok({ reference: created.referenceNumber });
  });
}
