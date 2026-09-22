import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { changeAdminEmail } from "@/lib/server/auth/flows";
import { emailSchema } from "@/lib/server/api/shared";
import { ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({ email: emailSchema, currentPassword: z.string().min(1).max(200) });

/** Changing the login email requires the current password. */
export const PATCH = withAdmin(async (request, { admin }) => {
  const body = await parseJson(request, schema);
  const result = await changeAdminEmail(admin.id, body.email, body.currentPassword);
  return ok({ email: result.email });
});
