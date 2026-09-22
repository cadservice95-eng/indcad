import sanitizeHtml from "sanitize-html";

export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

const SAFE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li", "blockquote", "h3", "h4", "div", "span", "hr", "pre", "code", "table", "thead", "tbody", "tr", "td", "th"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
  transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }) },
};

/** Strict allow-list sanitiser for anything shown in the admin or sent by email. */
export function sanitizeEmailHtml(html: string): string {
  return sanitizeHtml(html, SAFE_OPTIONS);
}

/**
 * Sanitiser for inbound customer email. Quoted history (blockquotes, Gmail/Outlook
 * quote wrappers) is removed first, then the strict allow-list is applied.
 */
export function sanitizeInboundHtml(html: string): string {
  const withoutQuotes = sanitizeHtml(html, {
    ...SAFE_OPTIONS,
    allowedAttributes: { ...SAFE_OPTIONS.allowedAttributes, div: ["class", "id"], blockquote: ["class", "type"] },
    exclusiveFilter: (frame) => {
      const cls = frame.attribs?.class ?? "";
      return frame.tag === "blockquote" || /(gmail_quote|yahoo_quoted|moz-cite-prefix)/.test(cls) || (frame.tag === "div" && frame.attribs?.id === "appendonsend");
    },
  });
  return sanitizeEmailHtml(withoutQuotes);
}

export function htmlToText(html: string): string {
  const withBreaks = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|tr|blockquote|pre)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_match, href: string, text: string) => `${text.replace(/<[^>]+>/g, "")} (${href})`);
  const stripped = sanitizeHtml(withBreaks, { allowedTags: [], allowedAttributes: {} });
  return decodeEntities(stripped).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** Escapes plain text into paragraph HTML (used for form-submitted messages). */
export function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function isEmptyHtml(html: string): boolean {
  return htmlToText(html).replace(/\s/g, "").length === 0;
}

export function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function emailLayout(options: { heading?: string; bodyHtml: string; button?: { label: string; url: string }; footerNote?: string; siteName: string; supportEmail: string }): string {
  const { heading, bodyHtml, button, footerNote, siteName, supportEmail } = options;
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b121c;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e7eb;">
<tr><td style="background:#0b121c;padding:18px 28px;color:#ffffff;font-size:18px;font-weight:600;letter-spacing:-0.2px;">${escapeHtml(siteName)}</td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.6;">
${heading ? `<h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;">${escapeHtml(heading)}</h1>` : ""}
${bodyHtml}
${button ? `<p style="margin:24px 0 0;"><a href="${escapeHtml(button.url)}" style="display:inline-block;background:#c16a2f;color:#ffffff;text-decoration:none;padding:11px 20px;font-weight:600;font-size:14px;">${escapeHtml(button.label)}</a></p>` : ""}
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;line-height:1.5;">
${footerNote ? `${escapeHtml(footerNote)}<br>` : ""}${escapeHtml(siteName)} · <a href="mailto:${escapeHtml(supportEmail)}" style="color:#6b7280;">${escapeHtml(supportEmail)}</a>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}
