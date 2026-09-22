import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { enquiryFilterSchema } from "@/lib/server/enquiries/filters";
import { createSavedFilter, listSavedFilters } from "@/lib/server/enquiries/queries";
import { ApiError, ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

export const GET = withAdmin(async () => ok({ filters: await listSavedFilters() }));

const schema = z.object({
  name: z.string().trim().min(1, "Give the filter a name.").max(80),
  /** A query string such as `status=NEW&priority=URGENT`. Validated against the real filter schema. */
  query: z.string().trim().max(1000),
});

export const POST = withAdmin(async (request) => {
  const body = await parseJson(request, schema);
  const params = new URLSearchParams(body.query.replace(/^\?/, ""));
  // Never store paging/selection state, and reject anything the list would not accept.
  for (const key of ["page", "pageSize", "ids", "view"]) params.delete(key);
  const raw: Record<string, string> = {};
  params.forEach((value, key) => {
    raw[key] = value;
  });
  if (!enquiryFilterSchema.safeParse(raw).success) throw new ApiError(400, "That filter is not valid.", "VALIDATION");
  if (Object.keys(raw).length === 0) throw new ApiError(400, "Choose at least one filter before saving.", "VALIDATION");
  const filter = await createSavedFilter(body.name, params.toString());
  return ok({ filter });
});
