import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { setRead } from "@/lib/server/enquiries/mutate";
import { requireEnquiry } from "@/lib/server/enquiries/queries";
import { ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({ read: z.boolean() });

export const POST = withAdmin<{ id: string }>(async (request, { params }) => {
  const id = idParam(params.id);
  await requireEnquiry(id);
  const { read } = await parseJson(request, schema);
  await setRead(id, read);
  return ok({ read });
});
