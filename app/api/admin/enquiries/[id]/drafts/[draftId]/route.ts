import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { deleteDraft } from "@/lib/server/enquiries/reply";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";

export const DELETE = withAdmin<{ id: string; draftId: string }>(async (_request, { params }) => {
  await deleteDraft(idParam(params.id), idParam(params.draftId, "Draft"));
  return ok();
});
