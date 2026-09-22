import { lt } from "drizzle-orm";
import { pruneRateLimits } from "@/lib/server/auth/rate-limit";
import { safeEqual } from "@/lib/server/auth/tokens";
import { getDb, sessions } from "@/lib/server/db";
import { pollInbox } from "@/lib/server/email/imap";
import { pruneNotifications, syncFollowUpNotifications } from "@/lib/server/enquiries/notifications";
import { env } from "@/lib/server/env";
import { fail, guard, ok } from "@/lib/server/http";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Scheduled job: reads new customer replies over IMAP, raises follow-up
 * reminders and prunes old housekeeping rows. Call it every few minutes from any
 * scheduler with `Authorization: Bearer $CRON_SECRET` (Vercel Cron sends this
 * header automatically when CRON_SECRET is set).
 */
export function GET(request: Request) {
  return guard(async () => {
    const secret = env.cronSecret;
    if (!secret) return fail(404, "Not found.", { code: "NOT_FOUND" });
    const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    if (!provided || !safeEqual(provided, secret)) return fail(401, "Unauthorized.", { code: "UNAUTHENTICATED" });

    const inbox = await pollInbox({ minIntervalSeconds: 20 });
    await syncFollowUpNotifications();
    const db = await getDb();
    await Promise.all([pruneRateLimits(), pruneNotifications(), db.delete(sessions).where(lt(sessions.expiresAt, new Date()))]);
    return ok({ inbox });
  });
}
