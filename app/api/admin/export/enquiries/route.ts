import { withAdmin } from "@/lib/server/auth/dal";
import { exportEnquiriesCsv } from "@/lib/server/enquiries/export";
import { enquiryFilterSchema } from "@/lib/server/enquiries/filters";
import { parseQuery } from "@/lib/server/http";
import { dayKey } from "@/lib/server/time";

export const runtime = "nodejs";

/** Exports the enquiries matching the same filters as the list. No login or session data is ever included. */
export const GET = withAdmin(async (request) => {
  const filters = parseQuery(request, enquiryFilterSchema);
  const { csv, count, truncated } = await exportEnquiriesCsv(filters);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="render-cad-hub-enquiries-${dayKey(new Date())}.csv"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Export-Count": String(count),
      "X-Export-Truncated": truncated ? "1" : "0",
    },
  });
});
