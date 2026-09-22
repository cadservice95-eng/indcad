import { z } from "zod";
import { ingestInboundEmail, extractMessageIds, type InboundEmail } from "@/lib/server/email/inbound";
import { parseRawEmail } from "@/lib/server/email/parse";
import { env } from "@/lib/server/env";
import { ApiError, fail, guard, ok, validate } from "@/lib/server/http";
import { safeEqual } from "@/lib/server/auth/tokens";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BODY_BYTES = 30 * 1024 * 1024;

const jsonSchema = z.union([
  z.object({ raw: z.string().min(1) }),
  z.object({
    from: z.string().min(3).max(320),
    fromName: z.string().max(200).optional(),
    to: z.union([z.string(), z.array(z.string())]).optional(),
    cc: z.union([z.string(), z.array(z.string())]).optional(),
    subject: z.string().max(998).default(""),
    text: z.string().max(500_000).default(""),
    html: z.string().max(2_000_000).nullish(),
    messageId: z.string().max(998).nullish(),
    inReplyTo: z.string().max(998).nullish(),
    references: z.union([z.string(), z.array(z.string())]).optional(),
    date: z.string().optional(),
    headers: z.record(z.string(), z.string()).optional(),
    attachments: z
      .array(z.object({ filename: z.string().max(255), contentType: z.string().max(200).default("application/octet-stream"), contentBase64: z.string() }))
      .max(10)
      .optional(),
  }),
]);

const list = (value: string | string[] | undefined) => (Array.isArray(value) ? value : value ? [value] : []).map((v) => v.trim().toLowerCase()).filter(Boolean);

function fromJson(body: z.infer<typeof jsonSchema>): Promise<InboundEmail | null> | InboundEmail | null {
  if ("raw" in body) {
    // Accept base64 or the plain RFC 822 text.
    const looksBase64 = /^[A-Za-z0-9+/=\r\n]+$/.test(body.raw) && !body.raw.includes(":");
    return parseRawEmail(Buffer.from(body.raw, looksBase64 ? "base64" : "utf8"));
  }
  const match = body.from.match(/^\s*(?:"?([^"<]*)"?\s*)?<?([^<>\s]+@[^<>\s]+)>?\s*$/);
  if (!match) return null;
  const date = body.date ? new Date(body.date) : null;
  return {
    messageId: body.messageId?.trim() || null,
    inReplyTo: extractMessageIds(body.inReplyTo)[0] ?? null,
    references: extractMessageIds(Array.isArray(body.references) ? body.references.join(" ") : body.references),
    fromEmail: match[2].toLowerCase(),
    fromName: (body.fromName ?? match[1] ?? "").trim(),
    to: list(body.to),
    cc: list(body.cc),
    subject: body.subject,
    text: body.text,
    html: body.html ?? null,
    date: date && !Number.isNaN(date.getTime()) ? date : null,
    headers: Object.fromEntries(Object.entries(body.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v])),
    attachments: (body.attachments ?? []).map((a) => ({ filename: a.filename, contentType: a.contentType, content: Buffer.from(a.contentBase64, "base64") })),
  };
}

/**
 * Provider webhook for inbound mail (any provider that can POST either the raw
 * RFC 822 message or the JSON shape above). Protected by INBOUND_EMAIL_SECRET.
 * Ingest is idempotent on Message-ID, so provider retries are safe.
 */
export function POST(request: Request) {
  return guard(async () => {
    const secret = env.inboundSecret;
    // Not configured: behave as if the route does not exist.
    if (!secret) return fail(404, "Not found.", { code: "NOT_FOUND" });

    const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const provided = request.headers.get("x-inbound-secret") ?? bearer ?? "";
    if (!provided || !safeEqual(provided, secret)) return fail(401, "Unauthorized.", { code: "UNAUTHENTICATED" });

    if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) throw new ApiError(413, "Message too large.", "TOO_LARGE");

    const type = (request.headers.get("content-type") ?? "").toLowerCase();
    let mail: InboundEmail | null;
    if (type.includes("application/json")) {
      let raw: unknown;
      try {
        raw = await request.json();
      } catch {
        throw new ApiError(400, "Body must be valid JSON.", "BAD_JSON");
      }
      mail = await fromJson(validate(jsonSchema, raw));
    } else {
      const bytes = Buffer.from(await request.arrayBuffer());
      if (bytes.length === 0) throw new ApiError(400, "Empty body.", "VALIDATION");
      if (bytes.length > MAX_BODY_BYTES) throw new ApiError(413, "Message too large.", "TOO_LARGE");
      mail = await parseRawEmail(bytes);
    }
    if (!mail) throw new ApiError(400, "The message has no valid sender.", "VALIDATION");

    const result = await ingestInboundEmail(mail);
    return ok({ outcome: result.outcome, ...(result.outcome === "ignored" ? { reason: result.reason } : {}) });
  });
}
