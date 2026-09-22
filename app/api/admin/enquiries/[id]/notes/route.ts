import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { addNote } from "@/lib/server/enquiries/mutate";
import { ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({ body: z.string().trim().min(1, "Write a note first.").max(5000) });

/** Internal notes are private to the admin and are never emailed. */
export const POST = withAdmin<{ id: string }>(async (request, { params }) => {
  const { body } = await parseJson(request, schema);
  const note = await addNote(idParam(params.id), body);
  return ok({ note });
});
