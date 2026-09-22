import { withAdmin } from "@/lib/server/auth/dal";
import { idParam, readAdminFiles } from "@/lib/server/api/shared";
import { saveDraft } from "@/lib/server/enquiries/reply";
import { ApiError, cleanText, ok } from "@/lib/server/http";

export const runtime = "nodejs";

/** Drafts are private: they are stored for the admin only and never emailed. */
export const POST = withAdmin<{ id: string }>(async (request, { params }) => {
  const enquiryId = idParam(params.id);
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    throw new ApiError(400, "The draft could not be read.", "BAD_REQUEST");
  }
  const draftId = form.get("draftId");
  const draft = await saveDraft({
    enquiryId,
    draftId: typeof draftId === "string" && draftId ? idParam(draftId, "Draft") : null,
    to: cleanText(form.get("to"), 254) || null,
    cc: cleanText(form.get("cc"), 600) || null,
    subject: cleanText(form.get("subject"), 300),
    bodyHtml: typeof form.get("bodyHtml") === "string" ? String(form.get("bodyHtml")).slice(0, 200_000) : "",
    files: await readAdminFiles(form),
  });
  return ok({ draftId: draft.id });
});
