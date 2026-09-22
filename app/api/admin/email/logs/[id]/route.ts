import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { getEmailLog } from "@/lib/server/email/logs";
import { ApiError, ok } from "@/lib/server/http";

export const runtime = "nodejs";

export const GET = withAdmin<{ id: string }>(async (_request, { params }) => {
  const entry = await getEmailLog(idParam(params.id, "Email log"));
  if (!entry) throw new ApiError(404, "Email log not found.", "NOT_FOUND");
  return ok({ entry });
});
