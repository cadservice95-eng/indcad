import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { requireEnquiry } from "@/lib/server/enquiries/queries";
import { ApiError } from "@/lib/server/http";
import { getAttachmentWithData } from "@/lib/server/uploads/attachments";
import { sanitizeFilename } from "@/lib/server/uploads/validate";

export const runtime = "nodejs";

/** Types the browser may render inline for preview. Everything else is always a forced download. */
const PREVIEWABLE = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

export const GET = withAdmin<{ id: string }>(async (request, { params }) => {
  const id = idParam(params.id, "Attachment");
  const found = await getAttachmentWithData(id);
  if (!found) throw new ApiError(404, "Attachment not found.", "NOT_FOUND");
  await requireEnquiry(found.meta.enquiryId);

  const wantsInline = request.nextUrl.searchParams.get("inline") === "1";
  const inline = wantsInline && PREVIEWABLE.has(found.meta.mimeType);
  const display = sanitizeFilename(found.meta.originalFilename).display || "attachment";
  const ascii = display.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");

  return new Response(new Uint8Array(found.data), {
    headers: {
      "Content-Type": inline ? found.meta.mimeType : "application/octet-stream",
      "Content-Length": String(found.data.length),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(display)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; frame-ancestors 'self'",
    },
  });
});
