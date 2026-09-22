import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { idParam } from "@/lib/server/api/shared";
import { moveToTrash, purgeEnquiry, updateDetails, type DetailsPatch } from "@/lib/server/enquiries/mutate";
import { getEnquiryDetail } from "@/lib/server/enquiries/queries";
import { ApiError, cleanText, ok, parseJson, validate } from "@/lib/server/http";

export const runtime = "nodejs";

type Params = { id: string };

export const GET = withAdmin<Params>(async (_request, { params }) => {
  const detail = await getEnquiryDetail(idParam(params.id));
  if (!detail || detail.enquiry.deletedAt) throw new ApiError(404, "Enquiry not found.", "NOT_FOUND");
  return ok({ ...detail });
});

const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .nullable()
    .transform((value) => (value === null ? null : cleanText(value, max) || null));

const patchSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    company: optionalText(160),
    phone: optionalText(30),
    country: optionalText(80),
    city: optionalText(80),
    website: optionalText(200),
    service: optionalText(120),
    projectType: optionalText(120),
    timeline: optionalText(60),
    budget: optionalText(60),
    currency: optionalText(8),
    preferredContactMethod: optionalText(20),
  })
  .partial()
  .strict();

export const PATCH = withAdmin<Params>(async (request, { params }) => {
  const id = idParam(params.id);
  const patch: DetailsPatch = await parseJson(request, patchSchema);
  await updateDetails(id, patch);
  return ok();
});

const deleteSchema = z.object({ permanent: z.boolean().optional(), confirm: z.boolean().optional() });

/** DELETE moves to the trash; permanent deletion needs `permanent` + `confirm` and an enquiry already in the trash. */
export const DELETE = withAdmin<Params>(async (request, { params }) => {
  const id = idParam(params.id);
  const raw: unknown = await request.json().catch(() => ({}));
  const options = validate(deleteSchema, raw ?? {});
  if (options.permanent) {
    if (!options.confirm) throw new ApiError(400, "Permanent deletion must be confirmed.", "CONFIRM_REQUIRED");
    await purgeEnquiry(id);
  } else {
    await moveToTrash(id);
  }
  return ok();
});
