import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { restoreFromTrash } from "@/lib/server/enquiries/mutate";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";

export const POST = withAdmin<{ id: string }>(async (_request, { params }) => {
  await restoreFromTrash(idParam(params.id));
  return ok();
});
