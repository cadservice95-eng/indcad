import { withAdmin } from "@/lib/server/auth/dal";
import { enquiryFilterSchema } from "@/lib/server/enquiries/filters";
import { listEnquiries } from "@/lib/server/enquiries/queries";
import { ok, parseQuery } from "@/lib/server/http";

export const runtime = "nodejs";

/** Contact-form messages only; same filters as the enquiry list. */
export const GET = withAdmin(async (request) => {
  const filters = parseQuery(request, enquiryFilterSchema);
  return ok(await listEnquiries({ ...filters, type: "CONTACT_MESSAGE" }));
});
