import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { hitRateLimit } from "@/lib/server/auth/rate-limit";
import { emailSchema } from "@/lib/server/api/shared";
import { getDb } from "@/lib/server/db";
import { verifyConnection } from "@/lib/server/email/mailer";
import { sendTestEmail } from "@/lib/server/email/send";
import { logActivity } from "@/lib/server/enquiries/activity";
import { ApiError, ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({
  /** "connection" only checks the SMTP login; "send" also delivers a test message. */
  mode: z.enum(["connection", "send"]).default("send"),
  to: emailSchema.optional(),
});

export const POST = withAdmin(async (request, { admin }) => {
  const body = await parseJson(request, schema);
  const limit = await hitRateLimit(`smtp-test:${admin.id}`, 8, 600);
  if (!limit.allowed) throw new ApiError(429, "Too many tests. Wait a few minutes and try again.", "RATE_LIMITED", undefined, { "Retry-After": String(limit.retryAfterSeconds) });

  const connection = await verifyConnection();
  if (body.mode === "connection" || !connection.ok) return ok({ connection, delivery: null });

  const to = body.to ?? admin.email;
  const delivery = await sendTestEmail(to);
  const db = await getDb();
  await logActivity(db, { action: "EMAIL_TEST_SENT", description: `SMTP test email ${delivery.status === "SENT" ? "sent" : "failed"}`, actor: "ADMIN" });
  return ok({ connection, delivery: { status: delivery.status, error: delivery.error ?? null, to } });
});
