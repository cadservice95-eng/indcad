import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { defaultReplySubject, renderReplyTemplate } from "@/lib/server/enquiries/reply";
import { requireEnquiry } from "@/lib/server/enquiries/queries";
import { QUICK_REPLIES, TEMPLATE_KEYS } from "@/lib/server/email/templates";
import { ok, parseQuery } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({ key: z.enum(TEMPLATE_KEYS).optional() });

/** Without `key`: the default reply subject and the quick replies. With `key`: a template filled in for this enquiry. */
export const GET = withAdmin<{ id: string }>(async (request, { params }) => {
  const id = idParam(params.id);
  const { key } = parseQuery(request, schema);
  const enquiry = await requireEnquiry(id);
  if (key) return ok({ ...(await renderReplyTemplate(id, key)) });
  return ok({ subject: defaultReplySubject(enquiry.subject, enquiry.referenceNumber), quickReplies: QUICK_REPLIES });
});
