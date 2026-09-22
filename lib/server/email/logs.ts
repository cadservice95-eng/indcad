import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { emailLogs, enquiries, getDb, type EmailStatus } from "../db";

const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

export async function listEmailLogs(options: { status?: EmailStatus; q?: string; enquiryId?: string; limit: number; offset: number }) {
  const db = await getDb();
  const like = options.q ? `%${escapeLike(options.q)}%` : null;
  const where = and(
    options.status ? eq(emailLogs.status, options.status) : undefined,
    options.enquiryId ? eq(emailLogs.enquiryId, options.enquiryId) : undefined,
    like ? or(ilike(emailLogs.recipient, like), ilike(emailLogs.subject, like), ilike(enquiries.referenceNumber, like)) : undefined,
  );
  const rows = await db
    .select({
      id: emailLogs.id,
      recipient: emailLogs.recipient,
      subject: emailLogs.subject,
      template: emailLogs.template,
      status: emailLogs.status,
      attemptCount: emailLogs.attemptCount,
      lastAttemptAt: emailLogs.lastAttemptAt,
      sentAt: emailLogs.sentAt,
      createdAt: emailLogs.createdAt,
      errorMessage: emailLogs.errorMessage,
      enquiryId: emailLogs.enquiryId,
      referenceNumber: enquiries.referenceNumber,
      // Only tells the UI whether Retry can work; the stored body itself is never listed.
      canRetry: sql<boolean>`${emailLogs.payload} is not null`,
    })
    .from(emailLogs)
    .leftJoin(enquiries, eq(emailLogs.enquiryId, enquiries.id))
    .where(where)
    .orderBy(desc(emailLogs.createdAt))
    .limit(options.limit)
    .offset(options.offset);
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(emailLogs)
    .leftJoin(enquiries, eq(emailLogs.enquiryId, enquiries.id))
    .where(where);
  const [counts] = await db
    .select({
      failed: sql<number>`count(*) filter (where ${emailLogs.status} = 'FAILED')::int`,
      sent: sql<number>`count(*) filter (where ${emailLogs.status} = 'SENT')::int`,
      queued: sql<number>`count(*) filter (where ${emailLogs.status} in ('QUEUED','SENDING'))::int`,
    })
    .from(emailLogs);
  return { rows, total, counts };
}

/** Full log entry for the detail dialog. Reset-link emails have no stored body by design. */
export async function getEmailLog(id: string) {
  const db = await getDb();
  const [row] = await db
    .select({
      id: emailLogs.id,
      enquiryId: emailLogs.enquiryId,
      referenceNumber: enquiries.referenceNumber,
      recipient: emailLogs.recipient,
      cc: emailLogs.cc,
      sender: emailLogs.sender,
      subject: emailLogs.subject,
      template: emailLogs.template,
      messageId: emailLogs.messageId,
      status: emailLogs.status,
      providerResponse: emailLogs.providerResponse,
      errorMessage: emailLogs.errorMessage,
      attemptCount: emailLogs.attemptCount,
      lastAttemptAt: emailLogs.lastAttemptAt,
      sentAt: emailLogs.sentAt,
      createdAt: emailLogs.createdAt,
      payload: emailLogs.payload,
    })
    .from(emailLogs)
    .leftJoin(enquiries, eq(emailLogs.enquiryId, enquiries.id))
    .where(eq(emailLogs.id, id))
    .limit(1);
  if (!row) return null;
  const { payload, ...rest } = row;
  return { ...rest, bodyText: payload?.text ?? null, canRetry: Boolean(payload) };
}
