import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { deleteNote, editNote } from "@/lib/server/enquiries/mutate";
import { ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({ body: z.string().trim().min(1, "A note cannot be empty.").max(5000) });

type Params = { id: string; noteId: string };

export const PATCH = withAdmin<Params>(async (request, { params }) => {
  const { body } = await parseJson(request, schema);
  await editNote(idParam(params.id), idParam(params.noteId, "Note"), body);
  return ok();
});

export const DELETE = withAdmin<Params>(async (_request, { params }) => {
  await deleteNote(idParam(params.id), idParam(params.noteId, "Note"));
  return ok();
});
