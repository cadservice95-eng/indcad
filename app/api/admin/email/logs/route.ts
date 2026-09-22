import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { EMAIL_STATUSES } from "@/lib/server/db";
import { listEmailLogs } from "@/lib/server/email/logs";
import { ok, parseQuery } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({
  status: z.enum(EMAIL_STATUSES).optional(),
  q: z.string().trim().max(120).optional(),
  enquiryId: z.uuid().optional(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(25),
});

export const GET = withAdmin(async (request) => {
  const query = parseQuery(request, schema);
  const result = await listEmailLogs({ status: query.status, q: query.q, enquiryId: query.enquiryId, limit: query.pageSize, offset: (query.page - 1) * query.pageSize });
  return ok({ ...result, page: query.page, pageSize: query.pageSize });
});
