import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { deleteSavedFilter } from "@/lib/server/enquiries/queries";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";

export const DELETE = withAdmin<{ id: string }>(async (_request, { params }) => {
  await deleteSavedFilter(idParam(params.id, "Filter"));
  return ok();
});
