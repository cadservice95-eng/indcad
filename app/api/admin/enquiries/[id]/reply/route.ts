import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { emailSchema, idParam, readAdminFiles } from "@/lib/server/api/shared";
import { ENQUIRY_STATUSES } from "@/lib/server/db";
import { sendAdminReply } from "@/lib/server/enquiries/reply";
import { ApiError, cleanText, ok, validate } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({
  to: emailSchema,
  cc: z.string().max(600).optional(),
  subject: z.string().trim().min(1, "Add a subject.").max(300),
  bodyHtml: z.string().min(1, "Write a message before sending.").max(200_000),
  statusAfter: z.enum(ENQUIRY_STATUSES).optional(),
  draftId: z.uuid().optional(),
  template: z.string().max(60).optional(),
});

function parseCc(value: string | undefined): string | null {
  const list = (value ?? "")
    .split(/[,;]/)
    .map((v) => v.trim())
    .filter(Boolean);
  if (list.length === 0) return null;
  if (list.length > 5) throw new ApiError(400, "Add at most 5 CC recipients.", "VALIDATION");
  for (const address of list) validate(emailSchema, address);
  return list.join(", ");
}

/**
 * Sends a reply to the customer as part of the enquiry's conversation.
 * multipart/form-data so attachments can travel with the message. The enquiry
 * keeps the message even if the mail server rejects it; Retry is then available.
 */
export const POST = withAdmin<{ id: string }>(async (request, { params }) => {
  const enquiryId = idParam(params.id);
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    throw new ApiError(400, "The message could not be read. If you attached large files, try fewer or smaller ones.", "BAD_REQUEST");
  }
  const text = (name: string) => {
    const value = form.get(name);
    return typeof value === "string" && value !== "" ? value : undefined;
  };
  const body = validate(schema, {
    to: text("to"),
    cc: text("cc"),
    subject: text("subject"),
    bodyHtml: text("bodyHtml"),
    statusAfter: text("statusAfter"),
    draftId: text("draftId"),
    template: text("template"),
  });

  const files = await readAdminFiles(form);
  const result = await sendAdminReply({
    enquiryId,
    to: body.to.toLowerCase(),
    cc: parseCc(body.cc),
    subject: cleanText(body.subject, 300),
    bodyHtml: body.bodyHtml,
    statusAfter: body.statusAfter,
    draftId: body.draftId ?? null,
    template: body.template,
    files,
  });
  return ok({ delivery: result.status, deliveryError: result.error ?? null, emailLogId: result.logId, messageId: result.messageRowId });
});
