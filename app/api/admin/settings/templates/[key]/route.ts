import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { getDb } from "@/lib/server/db";
import { isEmptyHtml } from "@/lib/server/email/html";
import { getTemplate, resetTemplate, saveTemplate, TEMPLATE_KEYS, type TemplateKey } from "@/lib/server/email/templates";
import { logActivity } from "@/lib/server/enquiries/activity";
import { ApiError, ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

type Params = { key: string };

function templateKey(value: string): TemplateKey {
  const key = TEMPLATE_KEYS.find((k) => k === value);
  if (!key) throw new ApiError(404, "Template not found.", "NOT_FOUND");
  return key;
}

const schema = z.object({
  subject: z.string().trim().min(1, "Add a subject.").max(200),
  bodyHtml: z.string().min(1, "The template body can't be empty.").max(50_000),
});

export const PUT = withAdmin<Params>(async (request, { params }) => {
  const key = templateKey(params.key);
  const body = await parseJson(request, schema);
  if (isEmptyHtml(body.bodyHtml)) throw new ApiError(400, "The template body can't be empty.", "VALIDATION");
  // A reset email without its link would lock the admin out.
  if (key === "password_reset" && !body.bodyHtml.includes("{{reset_link}}") && !body.bodyHtml.includes("{{ reset_link }}")) {
    throw new ApiError(400, "The password reset template must keep the {{reset_link}} placeholder.", "VALIDATION");
  }
  await saveTemplate(key, body);
  const db = await getDb();
  await logActivity(db, { action: "SETTINGS_UPDATED", description: `Email template updated: ${key}`, actor: "ADMIN" });
  return ok({ template: await getTemplate(key) });
});

/** Restores the built-in default text. */
export const DELETE = withAdmin<Params>(async (_request, { params }) => {
  const key = templateKey(params.key);
  await resetTemplate(key);
  const db = await getDb();
  await logActivity(db, { action: "SETTINGS_UPDATED", description: `Email template reset to default: ${key}`, actor: "ADMIN" });
  return ok({ template: await getTemplate(key) });
});
