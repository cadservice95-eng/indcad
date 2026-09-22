import { desc, eq, ilike, sql } from "drizzle-orm";
import { activityLogs, getDb, type DbOrTx } from "../db";

export type ActivityActor = "ADMIN" | "CUSTOMER" | "SYSTEM";

export const ACTIVITY_ACTIONS = [
  "ENQUIRY_CREATED",
  "STATUS_CHANGED",
  "PRIORITY_CHANGED",
  "DETAILS_UPDATED",
  "ADMIN_REPLY_SENT",
  "CUSTOMER_REPLY_RECEIVED",
  "CONFIRMATION_SENT",
  "ATTACHMENT_UPLOADED",
  "ATTACHMENT_DELETED",
  "ATTACHMENT_REJECTED",
  "NOTE_ADDED",
  "NOTE_EDITED",
  "NOTE_DELETED",
  "DRAFT_SAVED",
  "DRAFT_DISCARDED",
  "FOLLOW_UP_SCHEDULED",
  "FOLLOW_UP_COMPLETED",
  "FOLLOW_UP_RESCHEDULED",
  "EMAIL_FAILED",
  "EMAIL_RETRIED",
  "ENQUIRY_CLOSED",
  "ENQUIRY_REOPENED",
  "ENQUIRY_ARCHIVED",
  "ENQUIRY_UNARCHIVED",
  "ENQUIRY_TRASHED",
  "ENQUIRY_RESTORED",
  "ENQUIRY_DELETED",
  "DUPLICATE_SUBMISSION",
  "BULK_ACTION",
  "EXPORT_DOWNLOADED",
  "ADMIN_LOGIN",
  "ADMIN_LOGOUT",
  "LOGIN_FAILED",
  "PASSWORD_RESET_REQUESTED",
  "ADMIN_EMAIL_CHANGED",
  "EMAIL_TEST_SENT",
  "PASSWORD_CHANGED",
  "PASSWORD_RESET",
  "SETTINGS_UPDATED",
  "INBOX_CHECKED",
] as const;

export type ActivityAction = (typeof ACTIVITY_ACTIONS)[number];

export type ActivityInput = {
  enquiryId?: string | null;
  referenceNumber?: string | null;
  action: ActivityAction;
  description: string;
  actor?: ActivityActor;
  metadata?: Record<string, unknown>;
};

export async function logActivity(db: DbOrTx, entry: ActivityInput) {
  await db.insert(activityLogs).values({
    enquiryId: entry.enquiryId ?? null,
    referenceNumber: entry.referenceNumber ?? null,
    action: entry.action,
    description: entry.description.slice(0, 1000),
    actor: entry.actor ?? "SYSTEM",
    metadata: entry.metadata ?? null,
  });
}

export async function listActivity(options: { enquiryId?: string; action?: string; q?: string; limit: number; offset: number }) {
  const db = await getDb();
  const conditions = [
    options.enquiryId ? eq(activityLogs.enquiryId, options.enquiryId) : undefined,
    options.action ? eq(activityLogs.action, options.action) : undefined,
    options.q ? ilike(activityLogs.description, `%${options.q.replace(/[%_\\]/g, "\\$&")}%`) : undefined,
  ].filter((c): c is NonNullable<typeof c> => Boolean(c));
  const where = conditions.length ? sql.join(conditions, sql` and `) : undefined;
  const rows = await db
    .select()
    .from(activityLogs)
    .where(where)
    .orderBy(desc(activityLogs.createdAt), desc(activityLogs.id))
    .limit(options.limit)
    .offset(options.offset);
  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(activityLogs).where(where);
  return { rows, total };
}
