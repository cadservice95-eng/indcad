import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { ACTIVITY_ACTIONS, listActivity } from "@/lib/server/enquiries/activity";
import { ok, parseQuery } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({
  enquiryId: z.uuid().optional(),
  action: z.enum(ACTIVITY_ACTIONS).optional(),
  q: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(50),
});

export const GET = withAdmin(async (request) => {
  const query = parseQuery(request, schema);
  const result = await listActivity({ enquiryId: query.enquiryId, action: query.action, q: query.q, limit: query.pageSize, offset: (query.page - 1) * query.pageSize });
  return ok({ ...result, page: query.page, pageSize: query.pageSize });
});
