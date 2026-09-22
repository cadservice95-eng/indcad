import { and, asc, desc, eq, inArray, isNull, lt, gte, sql } from "drizzle-orm";
import {
  activityLogs,
  attachments,
  customers,
  emailDrafts,
  emailLogs,
  enquiries,
  followUps,
  getDb,
  internalNotes,
  messages,
  savedFilters,
} from "../db";
import { ApiError } from "../http";
import { markSavedFiltersSeeded, getSettingsRow } from "../settings";
import { addDays, startOfDay } from "../time";
import { customerHistory } from "./customers";
import { buildOrder, buildWhere, type EnquiryFilters } from "./filters";

export async function listEnquiries(filters: EnquiryFilters) {
  const db = await getDb();
  const where = buildWhere(filters);
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 25;

  const rows = await db
    .select({
      id: enquiries.id,
      referenceNumber: enquiries.referenceNumber,
      type: enquiries.type,
      name: enquiries.name,
      company: enquiries.company,
      email: enquiries.email,
      phone: enquiries.phone,
      service: enquiries.service,
      subject: enquiries.subject,
      status: enquiries.status,
      priority: enquiries.priority,
      source: enquiries.source,
      isRead: enquiries.isRead,
      createdAt: enquiries.createdAt,
      lastMessageAt: enquiries.lastMessageAt,
      lastMessageDirection: enquiries.lastMessageDirection,
      nextFollowUpAt: enquiries.nextFollowUpAt,
      messageCount: enquiries.messageCount,
      archivedAt: enquiries.archivedAt,
      deletedAt: enquiries.deletedAt,
      preview: sql<string>`left(${enquiries.projectDescription}, 160)`,
      // Drizzle strips the table qualifier from columns used in a single-table select list, which would make
      // `${enquiries.id}` resolve to the subquery's own `id`. The qualified name is written out on purpose.
      lastPreview: sql<string | null>`(select left(m.body_text, 160) from messages m where m.enquiry_id = "enquiries"."id" and m.status in ('RECEIVED','SENT') order by coalesce(m.sent_at, m.created_at) desc, m.created_at desc limit 1)`,
      attachmentCount: sql<number>`(select count(*)::int from attachments a where a.enquiry_id = "enquiries"."id" and a.draft_id is null)`,
    })
    .from(enquiries)
    .where(where)
    .orderBy(...buildOrder(filters.sort))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(enquiries).where(where);
  return { rows, total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) };
}

export type EnquiryListRow = Awaited<ReturnType<typeof listEnquiries>>["rows"][number];

export async function requireEnquiry(id: string, options?: { includeDeleted?: boolean }) {
  const db = await getDb();
  const [row] = await db.select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
  if (!row || (row.deletedAt && !options?.includeDeleted)) throw new ApiError(404, "Enquiry not found.", "NOT_FOUND");
  return row;
}

export async function getEnquiryDetail(id: string) {
  const db = await getDb();
  const [enquiry] = await db.select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
  if (!enquiry) return null;

  const [customer] = await db.select().from(customers).where(eq(customers.id, enquiry.customerId)).limit(1);
  const [messageRows, files, notes, followUpRows, activity, drafts, logs, history] = await Promise.all([
    db.select().from(messages).where(eq(messages.enquiryId, id)).orderBy(asc(messages.createdAt)),
    db.select().from(attachments).where(eq(attachments.enquiryId, id)).orderBy(desc(attachments.createdAt)),
    db.select().from(internalNotes).where(eq(internalNotes.enquiryId, id)).orderBy(desc(internalNotes.createdAt)),
    db.select().from(followUps).where(eq(followUps.enquiryId, id)).orderBy(asc(followUps.dueAt)),
    db.select().from(activityLogs).where(eq(activityLogs.enquiryId, id)).orderBy(desc(activityLogs.createdAt), desc(activityLogs.id)).limit(200),
    db.select().from(emailDrafts).where(eq(emailDrafts.enquiryId, id)).orderBy(desc(emailDrafts.updatedAt)),
    db.select().from(emailLogs).where(eq(emailLogs.enquiryId, id)).orderBy(desc(emailLogs.createdAt)).limit(50),
    customerHistory(enquiry.customerId, enquiry.email, id),
  ]);

  const byMessage = new Map<string, typeof files>();
  for (const file of files) {
    if (!file.messageId) continue;
    byMessage.set(file.messageId, [...(byMessage.get(file.messageId) ?? []), file]);
  }
  return {
    enquiry,
    customer: customer ?? null,
    messages: messageRows.map((m) => ({ ...m, attachments: byMessage.get(m.id) ?? [] })),
    attachments: files,
    notes,
    followUps: followUpRows,
    activity,
    drafts,
    emailLogs: logs,
    history,
  };
}

export type EnquiryDetail = NonNullable<Awaited<ReturnType<typeof getEnquiryDetail>>>;

export async function listFollowUps(bucket: "overdue" | "today" | "upcoming" | "completed", now = new Date()) {
  const db = await getDb();
  const today = startOfDay(now);
  const tomorrow = addDays(today, 1);
  const base = and(isNull(enquiries.deletedAt));
  const filter =
    bucket === "overdue"
      ? and(isNull(followUps.completedAt), lt(followUps.dueAt, today))
      : bucket === "today"
        ? and(isNull(followUps.completedAt), gte(followUps.dueAt, today), lt(followUps.dueAt, tomorrow))
        : bucket === "upcoming"
          ? and(isNull(followUps.completedAt), gte(followUps.dueAt, tomorrow))
          : sql`${followUps.completedAt} is not null`;
  return db
    .select({
      id: followUps.id,
      enquiryId: followUps.enquiryId,
      dueAt: followUps.dueAt,
      note: followUps.note,
      completedAt: followUps.completedAt,
      referenceNumber: enquiries.referenceNumber,
      name: enquiries.name,
      email: enquiries.email,
      status: enquiries.status,
      priority: enquiries.priority,
    })
    .from(followUps)
    .innerJoin(enquiries, eq(followUps.enquiryId, enquiries.id))
    .where(and(base, filter))
    .orderBy(bucket === "completed" ? desc(followUps.completedAt) : asc(followUps.dueAt))
    .limit(200);
}

export async function followUpCounts(now = new Date()) {
  const db = await getDb();
  const today = startOfDay(now);
  const tomorrow = addDays(today, 1);
  const [row] = await db
    .select({
      overdue: sql<number>`count(*) filter (where ${followUps.completedAt} is null and ${followUps.dueAt} < ${today})::int`,
      today: sql<number>`count(*) filter (where ${followUps.completedAt} is null and ${followUps.dueAt} >= ${today} and ${followUps.dueAt} < ${tomorrow})::int`,
      upcoming: sql<number>`count(*) filter (where ${followUps.completedAt} is null and ${followUps.dueAt} >= ${tomorrow})::int`,
    })
    .from(followUps)
    .innerJoin(enquiries, eq(followUps.enquiryId, enquiries.id))
    .where(isNull(enquiries.deletedAt));
  return row;
}

/** Every attachment across all enquiries (Attachments page). */
export async function listAllAttachments(options: { q?: string; limit: number; offset: number }) {
  const db = await getDb();
  const like = options.q ? `%${options.q.replace(/[\\%_]/g, "\\$&")}%` : null;
  const where = and(
    isNull(enquiries.deletedAt),
    like ? sql`(${attachments.originalFilename} ilike ${like} or ${enquiries.referenceNumber} ilike ${like} or ${enquiries.name} ilike ${like})` : undefined,
  );
  const rows = await db
    .select({
      id: attachments.id,
      originalFilename: attachments.originalFilename,
      mimeType: attachments.mimeType,
      size: attachments.size,
      uploadedBy: attachments.uploadedBy,
      createdAt: attachments.createdAt,
      enquiryId: enquiries.id,
      referenceNumber: enquiries.referenceNumber,
      customerName: enquiries.name,
    })
    .from(attachments)
    .innerJoin(enquiries, eq(attachments.enquiryId, enquiries.id))
    .where(where)
    .orderBy(desc(attachments.createdAt))
    .limit(options.limit)
    .offset(options.offset);
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(attachments)
    .innerJoin(enquiries, eq(attachments.enquiryId, enquiries.id))
    .where(where);
  return { rows, total };
}

// ---------------------------------------------------------------------------
// Saved filters
// ---------------------------------------------------------------------------

const DEFAULT_FILTERS = [
  { name: "New Leads", query: "status=NEW" },
  { name: "Urgent Leads", query: "priority=URGENT,HIGH" },
  { name: "Follow-ups Today", query: "followUp=today" },
  { name: "Awaiting Customer", query: "status=AWAITING_CUSTOMER" },
  { name: "Failed Emails", query: "emailFailed=1" },
];

export async function listSavedFilters() {
  const db = await getDb();
  const settings = await getSettingsRow();
  if (!settings?.savedFiltersSeeded) {
    const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(savedFilters);
    if (n === 0) await db.insert(savedFilters).values(DEFAULT_FILTERS);
    await markSavedFiltersSeeded();
  }
  return db.select().from(savedFilters).orderBy(asc(savedFilters.createdAt));
}

export async function createSavedFilter(name: string, query: string) {
  const db = await getDb();
  const [row] = await db.insert(savedFilters).values({ name: name.slice(0, 80), query: query.slice(0, 1000) }).returning();
  return row;
}

export async function deleteSavedFilter(id: string) {
  const db = await getDb();
  await db.delete(savedFilters).where(eq(savedFilters.id, id));
}

export async function enquiryIdsByReference(references: string[]) {
  if (references.length === 0) return [];
  const db = await getDb();
  return db.select({ id: enquiries.id, referenceNumber: enquiries.referenceNumber }).from(enquiries).where(inArray(enquiries.referenceNumber, references));
}

export async function getMessageDetail(id: string) {
  const db = await getDb();
  const [row] = await db
    .select({ message: messages, referenceNumber: enquiries.referenceNumber, deletedAt: enquiries.deletedAt })
    .from(messages)
    .innerJoin(enquiries, eq(messages.enquiryId, enquiries.id))
    .where(eq(messages.id, id))
    .limit(1);
  if (!row || row.deletedAt) return null;
  const files = await db.select().from(attachments).where(eq(attachments.messageId, id));
  return { ...row.message, referenceNumber: row.referenceNumber, attachments: files };
}

/** Small counters for the sidebar badges. */
export async function getNavCounts(now = new Date()) {
  const db = await getDb();
  const [unread] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(enquiries)
    .where(and(isNull(enquiries.deletedAt), isNull(enquiries.archivedAt), sql`${enquiries.isRead} = false`));
  const [due] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(followUps)
    .innerJoin(enquiries, eq(followUps.enquiryId, enquiries.id))
    .where(and(isNull(followUps.completedAt), sql`${followUps.dueAt} <= ${now}`, isNull(enquiries.deletedAt), isNull(enquiries.archivedAt)));
  const [failed] = await db.select({ n: sql<number>`count(*)::int` }).from(emailLogs).where(eq(emailLogs.status, "FAILED"));
  const [awaiting] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(enquiries)
    .where(and(isNull(enquiries.deletedAt), isNull(enquiries.archivedAt), sql`${enquiries.lastMessageDirection} = 'INBOUND' and ${enquiries.status} not in ('WON','LOST','CLOSED')`));
  return { unread: unread.n, followUpsDue: due.n, failedEmails: failed.n, awaitingReply: awaiting.n };
}
