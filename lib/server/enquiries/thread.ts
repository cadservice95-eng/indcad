import { eq, sql } from "drizzle-orm";
import { CLOSED_STATUSES, STATUS_LABELS } from "@/lib/enquiry-meta";
import { enquiries, getDb, messages, type DbOrTx, type EnquiryStatus } from "../db";
import { logActivity } from "./activity";

/** Recomputes the denormalised conversation counters from the messages table. */
export async function refreshThreadCounters(db: DbOrTx, enquiryId: string) {
  await db
    .update(enquiries)
    .set({
      messageCount: sql`(select count(*)::int from ${messages} where ${messages.enquiryId} = ${enquiryId})`,
      lastMessageAt: sql`(select max(coalesce(${messages.sentAt}, ${messages.createdAt})) from ${messages} where ${messages.enquiryId} = ${enquiryId} and ${messages.status} in ('RECEIVED','SENT'))`,
      lastMessageDirection: sql`(select ${messages.direction} from ${messages} where ${messages.enquiryId} = ${enquiryId} and ${messages.status} in ('RECEIVED','SENT') order by coalesce(${messages.sentAt}, ${messages.createdAt}) desc, ${messages.createdAt} desc limit 1)`,
      updatedAt: new Date(),
    })
    .where(eq(enquiries.id, enquiryId));
}

/**
 * Effects of an admin reply that was actually delivered: the thread now ends with
 * our message, the customer was contacted, and the enquiry moves forward.
 */
export async function applyOutboundSent(enquiryId: string, recipient: string, statusAfter?: string) {
  const db = await getDb();
  const [enquiry] = await db.select().from(enquiries).where(eq(enquiries.id, enquiryId)).limit(1);
  if (!enquiry) return;

  const requested = statusAfter as EnquiryStatus | undefined;
  const next: EnquiryStatus = requested ?? (enquiry.status === "NEW" || enquiry.status === "IN_REVIEW" ? "CONTACTED" : enquiry.status);
  const closed = (CLOSED_STATUSES as readonly string[]).includes(next);

  await db.transaction(async (tx) => {
    await refreshThreadCounters(tx, enquiryId);
    await tx
      .update(enquiries)
      .set({ lastContactedAt: new Date(), isRead: true, status: next, closedAt: closed ? (enquiry.closedAt ?? new Date()) : null })
      .where(eq(enquiries.id, enquiryId));
    await logActivity(tx, {
      enquiryId,
      referenceNumber: enquiry.referenceNumber,
      action: "ADMIN_REPLY_SENT",
      description: `Reply sent to ${recipient}`,
      actor: "ADMIN",
    });
    if (next !== enquiry.status) {
      await logActivity(tx, {
        enquiryId,
        referenceNumber: enquiry.referenceNumber,
        action: "STATUS_CHANGED",
        description: `Status changed: ${STATUS_LABELS[enquiry.status]} → ${STATUS_LABELS[next]}`,
        actor: "ADMIN",
        metadata: { from: enquiry.status, to: next },
      });
    }
  });
}
