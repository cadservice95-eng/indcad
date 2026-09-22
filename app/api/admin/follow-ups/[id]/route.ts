import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { dueSchema, idParam, parseDue } from "@/lib/server/api/shared";
import { completeFollowUp, rescheduleFollowUp } from "@/lib/server/enquiries/mutate";
import { ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("complete") }),
  z.object({ action: z.literal("reschedule"), dueAt: dueSchema, note: z.string().trim().max(500).optional() }),
]);

export const PATCH = withAdmin<{ id: string }>(async (request, { params }) => {
  const id = idParam(params.id, "Follow-up");
  const body = await parseJson(request, schema);
  if (body.action === "complete") await completeFollowUp(id);
  else await rescheduleFollowUp(id, parseDue(body.dueAt), body.note);
  return ok();
});
