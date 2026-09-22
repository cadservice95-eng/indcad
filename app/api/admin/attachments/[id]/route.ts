import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { getDb } from "@/lib/server/db";
import { logActivity } from "@/lib/server/enquiries/activity";
import { requireEnquiry } from "@/lib/server/enquiries/queries";
import { ApiError, ok } from "@/lib/server/http";
import { deleteAttachment, getAttachmentWithData } from "@/lib/server/uploads/attachments";

export const runtime = "nodejs";

export const DELETE = withAdmin<{ id: string }>(async (_request, { params }) => {
  const id = idParam(params.id, "Attachment");
  const found = await getAttachmentWithData(id);
  // The parent enquiry must exist and not be in the trash; this also stops orphan/IDOR probing.
  if (!found) throw new ApiError(404, "Attachment not found.", "NOT_FOUND");
  const enquiry = await requireEnquiry(found.meta.enquiryId);
  await deleteAttachment(id);
  const db = await getDb();
  await logActivity(db, {
    enquiryId: enquiry.id,
    referenceNumber: enquiry.referenceNumber,
    action: "ATTACHMENT_DELETED",
    description: `Attachment deleted: ${found.meta.originalFilename}`,
    actor: "ADMIN",
  });
  return ok();
});
