import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { dueSchema, idParam, parseDue } from "@/lib/server/api/shared";
import { scheduleFollowUp } from "@/lib/server/enquiries/mutate";
import { ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({ dueAt: dueSchema, note: z.string().trim().max(500).optional() });

/** Schedules an internal reminder. Nothing is ever emailed to the customer automatically. */
export const POST = withAdmin<{ id: string }>(async (request, { params }) => {
  const body = await parseJson(request, schema);
  const followUp = await scheduleFollowUp(idParam(params.id), { dueAt: parseDue(body.dueAt), note: body.note });
  return ok({ followUp });
});
