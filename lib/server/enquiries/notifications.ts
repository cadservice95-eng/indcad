import { and, desc, eq, isNull, lt, lte, sql } from "drizzle-orm";
import { enquiries, followUps, getDb, notifications, type DbOrTx } from "../db";
import { startOfDay } from "../time";

export type NotificationType = "NEW_ENQUIRY" | "NEW_CONTACT" | "CUSTOMER_REPLIED" | "EMAIL_FAILED" | "FOLLOW_UP_DUE" | "FOLLOW_UP_OVERDUE";

export type NotificationInput = {
  type: NotificationType;
  title: string;
  body?: string | null;
  enquiryId?: string | null;
  referenceNumber?: string | null;
  dedupeKey?: string;
};

export async function createNotification(db: DbOrTx, input: NotificationInput) {
  await db
    .insert(notifications)
    .values({
      type: input.type,
      title: input.title.slice(0, 200),
      body: input.body?.slice(0, 500) ?? null,
      enquiryId: input.enquiryId ?? null,
      referenceNumber: input.referenceNumber ?? null,
      dedupeKey: input.dedupeKey ?? null,
    })
    .onConflictDoNothing();
}

export async function listNotifications(options: { unreadOnly?: boolean; limit: number; offset?: number }) {
  const db = await getDb();
  const where = options.unreadOnly ? eq(notifications.isRead, false) : undefined;
  const rows = await db
    .select()
    .from(notifications)
    .where(where)
    .orderBy(desc(notifications.createdAt))
    .limit(options.limit)
    .offset(options.offset ?? 0);
  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(notifications).where(where);
  return { rows, total };
}

export async function unreadNotificationCount(): Promise<number> {
  const db = await getDb();
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(notifications).where(eq(notifications.isRead, false));
  return n;
}

export async function markNotificationRead(id: string) {
  const db = await getDb();
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

export async function markAllNotificationsRead() {
  const db = await getDb();
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.isRead, false));
}

/**
 * Creates "due" and "overdue" notifications for open follow-ups. Idempotent via
 * dedupe keys, so it is safe to call on every dashboard load and from cron.
 */
export async function syncFollowUpNotifications(now = new Date()) {
  const db = await getDb();
  const dayStart = startOfDay(now);
  const open = await db
    .select({
      id: followUps.id,
      dueAt: followUps.dueAt,
      enquiryId: followUps.enquiryId,
      reference: enquiries.referenceNumber,
      name: enquiries.name,
    })
    .from(followUps)
    .innerJoin(enquiries, eq(followUps.enquiryId, enquiries.id))
    .where(and(isNull(followUps.completedAt), lte(followUps.dueAt, now), isNull(enquiries.deletedAt), isNull(enquiries.archivedAt)));

  for (const item of open) {
    const overdue = item.dueAt < dayStart;
    await createNotification(db, {
      type: overdue ? "FOLLOW_UP_OVERDUE" : "FOLLOW_UP_DUE",
      title: overdue ? `Follow-up overdue — ${item.reference}` : `Follow-up due — ${item.reference}`,
      body: `${item.name}`,
      enquiryId: item.enquiryId,
      referenceNumber: item.reference,
      dedupeKey: `fu:${item.id}:${item.dueAt.getTime()}:${overdue ? "overdue" : "due"}`,
    });
  }
}

export async function pruneNotifications(olderThanDays = 90) {
  const db = await getDb();
  await db.delete(notifications).where(and(eq(notifications.isRead, true), lt(notifications.createdAt, new Date(Date.now() - olderThanDays * 86_400_000))));
}
