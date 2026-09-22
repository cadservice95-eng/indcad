import { withAdmin } from "@/lib/server/auth/dal";
import { pollInbox } from "@/lib/server/email/imap";
import { ok } from "@/lib/server/http";

export const runtime = "nodejs";
export const maxDuration = 60;

/** "Check inbox now": reads new customer replies from the configured IMAP mailbox. */
export const POST = withAdmin(async () => {
  const summary = await pollInbox({ minIntervalSeconds: 10 });
  return ok({ summary });
});
