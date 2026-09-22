import { simpleParser, type AddressObject, type HeaderValue, type ParsedMail } from "mailparser";
import { extractMessageIds, type InboundEmail } from "./inbound";

const HEADERS_OF_INTEREST = ["auto-submitted", "precedence", "x-autoreply", "x-autorespond", "x-auto-response-suppress", "list-id", "list-unsubscribe"] as const;

function addresses(value: AddressObject | AddressObject[] | undefined): { address: string; name: string }[] {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];
  return list.flatMap((entry) => entry.value.map((v) => ({ address: (v.address ?? "").trim().toLowerCase(), name: (v.name ?? "").trim() }))).filter((v) => v.address);
}

function headerText(value: HeaderValue | undefined): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((v) => (typeof v === "string" ? v : "")).join(" ").trim() || "1";
  if (value instanceof Date) return value.toISOString();
  if ("text" in value && typeof value.text === "string") return value.text;
  if ("value" in value && typeof value.value === "string") return value.value;
  return "1";
}

export function toInboundEmail(parsed: ParsedMail): InboundEmail | null {
  const from = addresses(parsed.from)[0];
  if (!from) return null;

  const headers: Record<string, string> = {};
  for (const key of HEADERS_OF_INTEREST) {
    const text = headerText(parsed.headers.get(key));
    if (text !== null) headers[key] = text;
  }

  const references = extractMessageIds(Array.isArray(parsed.references) ? parsed.references.join(" ") : parsed.references);
  return {
    messageId: parsed.messageId ? parsed.messageId.trim() : null,
    inReplyTo: extractMessageIds(parsed.inReplyTo)[0] ?? null,
    references,
    fromEmail: from.address,
    fromName: from.name,
    to: addresses(parsed.to).map((a) => a.address),
    cc: addresses(parsed.cc).map((a) => a.address),
    subject: parsed.subject ?? "",
    text: parsed.text ?? "",
    html: typeof parsed.html === "string" ? parsed.html : null,
    date: parsed.date ?? null,
    // Inline images embedded in the HTML body (signatures, logos) are not customer files.
    attachments: parsed.attachments
      .filter((a) => !a.related)
      .map((a) => ({ filename: a.filename ?? "attachment", contentType: a.contentType, content: a.content })),
    headers,
  };
}

/** Parses a raw RFC 822 message (from IMAP or a provider webhook). Returns null when there is no usable sender. */
export async function parseRawEmail(source: Buffer | string): Promise<InboundEmail | null> {
  const parsed = await simpleParser(source, { skipTextToHtml: true, skipImageLinks: true });
  return toInboundEmail(parsed);
}
