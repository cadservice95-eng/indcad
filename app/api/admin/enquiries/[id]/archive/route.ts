import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { setArchived } from "@/lib/server/enquiries/mutate";
import { ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({ archived: z.boolean().default(true) });

export const POST = withAdmin<{ id: string }>(async (request, { params }) => {
  const { archived } = await parseJson(request, schema);
  await setArchived(idParam(params.id), archived);
  return ok({ archived });
});
