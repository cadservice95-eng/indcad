import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { ENQUIRY_STATUSES } from "@/lib/server/db";
import { setStatus } from "@/lib/server/enquiries/mutate";
import { ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({ status: z.enum(ENQUIRY_STATUSES) });

export const POST = withAdmin<{ id: string }>(async (request, { params }) => {
  const { status } = await parseJson(request, schema);
  await setStatus(idParam(params.id), status);
  return ok({ status });
});
