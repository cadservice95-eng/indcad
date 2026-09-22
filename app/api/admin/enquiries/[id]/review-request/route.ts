import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { sendReviewRequest } from "@/lib/server/enquiries/reply";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";

/** Manual, one-off: the admin decides when a project is done enough to ask for a review. */
export const POST = withAdmin<{ id: string }>(async (_request, { params }) => {
  const result = await sendReviewRequest(idParam(params.id));
  return ok({ delivery: result.status, deliveryError: result.error ?? null });
});
