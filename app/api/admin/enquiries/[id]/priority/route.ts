import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { ENQUIRY_PRIORITIES } from "@/lib/server/db";
import { setPriority } from "@/lib/server/enquiries/mutate";
import { ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({ priority: z.enum(ENQUIRY_PRIORITIES) });

export const POST = withAdmin<{ id: string }>(async (request, { params }) => {
  const { priority } = await parseJson(request, schema);
  await setPriority(idParam(params.id), priority);
  return ok({ priority });
});
