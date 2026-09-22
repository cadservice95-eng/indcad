import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { emailSchema } from "@/lib/server/api/shared";
import { getDb } from "@/lib/server/db";
import { canEncrypt } from "@/lib/server/email/crypto";
import { logActivity } from "@/lib/server/enquiries/activity";
import { ApiError, ok, parseJson } from "@/lib/server/http";
import { getSettingsForAdmin, updateSettings, type SettingsPatch } from "@/lib/server/settings";

export const runtime = "nodejs";

const HOST_PATTERN = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/i;

const schema = z
  .object({
    businessEmail: emailSchema.nullable(),
    fromName: z.string().trim().max(80).nullable(),
    smtpHost: z.string().trim().max(253).regex(HOST_PATTERN, "Enter a host name such as smtp.example.com").nullable(),
    smtpPort: z.number().int().min(1).max(65535).nullable(),
    smtpSecure: z.boolean().nullable(),
    smtpUser: z.string().trim().max(254).nullable(),
    /** Omit to keep the stored password, send "" to remove it. It is never returned by the API. */
    smtpPassword: z.string().max(500),
    notifyNewEnquiry: z.boolean(),
    notifyCustomerConfirmation: z.boolean(),
    notifyEmailFailure: z.boolean(),
  })
  .partial()
  .strict();

export const GET = withAdmin(async () => ok({ settings: await getSettingsForAdmin() }));

export const PATCH = withAdmin(async (request, { admin }) => {
  const body = await parseJson(request, schema);
  if (body.smtpPassword && !canEncrypt()) {
    throw new ApiError(400, "Set APP_SECRET (16+ characters) on the server to store an SMTP password here, or provide it through the SMTP_PASSWORD environment variable.", "APP_SECRET_MISSING");
  }
  const patch: SettingsPatch = { ...body, smtpUser: body.smtpUser === undefined ? undefined : body.smtpUser || null, smtpHost: body.smtpHost === undefined ? undefined : body.smtpHost || null };
  // undefined keys are left untouched by updateSettings, so strip them to keep `"key" in patch` semantics correct.
  for (const key of Object.keys(patch) as (keyof SettingsPatch)[]) if (patch[key] === undefined) delete patch[key];
  await updateSettings(patch);

  const db = await getDb();
  await logActivity(db, {
    action: "SETTINGS_UPDATED",
    description: `Settings updated: ${Object.keys(body).join(", ") || "no changes"}`,
    actor: "ADMIN",
    metadata: { adminId: admin.id },
  });
  return ok({ settings: await getSettingsForAdmin() });
});
