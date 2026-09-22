import { ImapFlow } from "imapflow";
import { getDb } from "../db";
import { hitRateLimit } from "../auth/rate-limit";
import { env } from "../env";
import { logActivity } from "../enquiries/activity";
import { errorMessage, log } from "../log";
import { ingestInboundEmail, type IngestResult } from "./inbound";
import { parseRawEmail } from "./parse";

const MAX_MESSAGES_PER_RUN = 25;
const MAX_MESSAGE_BYTES = 45 * 1024 * 1024;

export function isImapConfigured(): boolean {
  return Boolean(env.imapHost && env.imapUser && env.imapPassword);
}

export type PollSummary = {
  configured: boolean;
  checked: number;
  matched: number;
  created: number;
  duplicates: number;
  ignored: number;
  failed: number;
  skipped?: string;
  error?: string;
};

const EMPTY: PollSummary = { configured: true, checked: 0, matched: 0, created: 0, duplicates: 0, ignored: 0, failed: 0 };

/**
 * Reads UNSEEN messages from the configured mailbox, ingests them and marks them
 * read. A message that fails to ingest stays unread so the next run retries it
 * (ingest is idempotent on Message-ID, so a retry can never duplicate).
 */
export async function pollInbox(options: { minIntervalSeconds?: number } = {}): Promise<PollSummary> {
  if (!isImapConfigured()) return { ...EMPTY, configured: false };

  // Lease so overlapping cron runs / manual clicks don't read the same mailbox at once.
  const lease = await hitRateLimit("imap:poll", 1, options.minIntervalSeconds ?? 20);
  if (!lease.allowed) return { ...EMPTY, skipped: `The inbox was checked moments ago. Try again in ${lease.retryAfterSeconds}s.` };

  const summary: PollSummary = { ...EMPTY };
  const client = new ImapFlow({
    host: env.imapHost!,
    port: env.imapPort,
    secure: env.imapSecure,
    auth: { user: env.imapUser!, pass: env.imapPassword! },
    logger: false,
    socketTimeout: 45_000,
  });
  // imapflow emits 'error' on socket problems; without a listener that would crash the process.
  client.on("error", (error: unknown) => log.warn("imap.connection_error", { error: errorMessage(error) }));

  try {
    await client.connect();
    const lock = await client.getMailboxLock(env.imapMailbox);
    try {
      const uids = (await client.search({ seen: false }, { uid: true })) || [];
      for (const uid of uids.slice(0, MAX_MESSAGES_PER_RUN)) {
        summary.checked += 1;
        try {
          const message = await client.fetchOne(String(uid), { source: true, size: true }, { uid: true });
          if (!message || !message.source) throw new Error("Message source was empty");
          if ((message.size ?? message.source.length) > MAX_MESSAGE_BYTES) {
            log.warn("imap.message_too_large", { uid, size: message.size });
            summary.ignored += 1;
            await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true });
            continue;
          }
          const mail = await parseRawEmail(message.source);
          const result: IngestResult = mail ? await ingestInboundEmail(mail) : { outcome: "ignored", reason: "no sender" };
          tally(summary, result);
          await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true });
        } catch (error) {
          summary.failed += 1;
          log.error("imap.message_failed", { uid, error: errorMessage(error) });
        }
      }
    } finally {
      lock.release();
    }
    await client.logout();
  } catch (error) {
    summary.error = "Could not read the mailbox. Check the IMAP host, port, username and password.";
    log.error("imap.poll_failed", { error: errorMessage(error) });
    try {
      client.close();
    } catch {
      // already closed
    }
  }

  if (summary.checked > 0) {
    const db = await getDb();
    await logActivity(db, {
      action: "INBOX_CHECKED",
      description: `Inbox checked: ${summary.matched} repl${summary.matched === 1 ? "y" : "ies"}, ${summary.created} new, ${summary.duplicates} duplicate, ${summary.ignored} ignored${summary.failed ? `, ${summary.failed} failed` : ""}`,
      actor: "SYSTEM",
    });
  }
  return summary;
}

function tally(summary: PollSummary, result: IngestResult) {
  if (result.outcome === "matched") summary.matched += 1;
  else if (result.outcome === "created") summary.created += 1;
  else if (result.outcome === "duplicate") summary.duplicates += 1;
  else summary.ignored += 1;
}

