import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { withAdmin } from "@/lib/server/auth/dal";
import { emailLogs, getDb } from "@/lib/server/db";
import { retryEmail } from "@/lib/server/email/send";
import { ApiError, ok, parseJson } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.union([z.object({ logId: z.uuid() }), z.object({ allFailed: z.literal(true) })]);

const RETRY_ALL_LIMIT = 25;

/**
 * Re-sends failed emails. Each send atomically claims its log row first, so
 * clicking Retry twice (or two tabs) can never deliver the same email twice.
 */
export const POST = withAdmin(async (request) => {
  const body = await parseJson(request, schema);
  if ("logId" in body) {
    const result = await retryEmail(body.logId);
    if (result.error === "Email log not found.") throw new ApiError(404, "Email log not found.", "NOT_FOUND");
    return ok({ status: result.status, error: result.error ?? null });
  }

  const db = await getDb();
  const failed = await db.select({ id: emailLogs.id }).from(emailLogs).where(eq(emailLogs.status, "FAILED")).orderBy(desc(emailLogs.createdAt)).limit(RETRY_ALL_LIMIT);
  let sent = 0;
  let stillFailing = 0;
  for (const row of failed) {
    const result = await retryEmail(row.id);
    if (result.status === "SENT") sent += 1;
    else stillFailing += 1;
  }
  return ok({ attempted: failed.length, sent, stillFailing });
});
