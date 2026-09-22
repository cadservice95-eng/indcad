import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { getMessageDetail } from "@/lib/server/enquiries/queries";
import { ApiError, ok } from "@/lib/server/http";

export const runtime = "nodejs";

export const GET = withAdmin<{ id: string }>(async (_request, { params }) => {
  const message = await getMessageDetail(idParam(params.id, "Message"));
  if (!message) throw new ApiError(404, "Message not found.", "NOT_FOUND");
  return ok({ message });
});
