import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { CLOSED_STATUSES, PRIORITY_LABELS, STATUS_LABELS } from "@/lib/enquiry-meta";
import {
  attachments,
  customers,
  enquiries,
  followUps,
  getDb,
  internalNotes,
  type EnquiryPriority,
  type EnquiryStatus,
  type Tx,
} from "../db";
import { ApiError } from "../http";
import { formatDateTime } from "../time";
import { removeFile } from "../uploads/storage";
import { logActivity } from "./activity";
import { requireEnquiry } from "./queries";

const isClosed = (status: string) => (CLOSED_STATUSES as readonly string[]).includes(status);

export async function setRead(id: string, read: boolean) {
  const db = await getDb();
  await db.update(enquiries).set({ isRead: read }).where(eq(enquiries.id, id));
}

export async function setStatus(id: string, status: EnquiryStatus) {
  const db = await getDb();
  const current = await requireEnquiry(id);
  if (current.status === status) return current;
  await db.transaction(async (tx) => {
    await tx
      .update(enquiries)
      .set({ status, updatedAt: new Date(), isRead: true, closedAt: isClosed(status) ? (current.closedAt ?? new Date()) : null })
      .where(eq(enquiries.id, id));
    await logActivity(tx, {
      enquiryId: id,
      referenceNumber: current.referenceNumber,
      action: "STATUS_CHANGED",
      description: `Status changed: ${STATUS_LABELS[current.status]} → ${STATUS_LABELS[status]}`,
      actor: "ADMIN",
      metadata: { from: current.status, to: status },
    });
    if (status === "CLOSED") {
      await logActivity(tx, { enquiryId: id, referenceNumber: current.referenceNumber, action: "ENQUIRY_CLOSED", description: "Enquiry closed", actor: "ADMIN" });
    } else if (isClosed(current.status) && !isClosed(status)) {
      await logActivity(tx, { enquiryId: id, referenceNumber: current.referenceNumber, action: "ENQUIRY_REOPENED", description: "Enquiry reopened", actor: "ADMIN" });
    }
  });
  return { ...current, status };
}

export async function setPriority(id: string, priority: EnquiryPriority) {
  const db = await getDb();
  const current = await requireEnquiry(id);
  if (current.priority === priority) return current;
  await db.transaction(async (tx) => {
    await tx.update(enquiries).set({ priority, updatedAt: new Date() }).where(eq(enquiries.id, id));
    await logActivity(tx, {
      enquiryId: id,
      referenceNumber: current.referenceNumber,
      action: "PRIORITY_CHANGED",
      description: `Priority changed to ${PRIORITY_LABELS[priority].toUpperCase()}`,
      actor: "ADMIN",
      metadata: { from: current.priority, to: priority },
    });
  });
  return { ...current, priority };
}

export type DetailsPatch = Partial<{
  name: string;
  company: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  service: string | null;
  projectType: string | null;
  timeline: string | null;
  budget: string | null;
  currency: string | null;
  preferredContactMethod: string | null;
}>;

export async function updateDetails(id: string, patch: DetailsPatch) {
  const db = await getDb();
  const current = await requireEnquiry(id);
  const changed = (Object.keys(patch) as (keyof DetailsPatch)[]).filter((key) => key in patch && patch[key] !== (current as Record<string, unknown>)[key]);
  if (changed.length === 0) return;
  await db.transaction(async (tx) => {
    await tx.update(enquiries).set({ ...patch, updatedAt: new Date() }).where(eq(enquiries.id, id));
    const customerPatch: Partial<Pick<typeof customers.$inferInsert, "name" | "company" | "phone" | "country" | "city" | "website">> = {};
    if (patch.name !== undefined) customerPatch.name = patch.name;
    for (const key of ["company", "phone", "country", "city", "website"] as const) {
      if (key in patch) customerPatch[key] = patch[key] ?? null;
    }
    if (Object.keys(customerPatch).length) {
      await tx.update(customers).set({ ...customerPatch, updatedAt: new Date() }).where(eq(customers.id, current.customerId));
    }
    await logActivity(tx, {
      enquiryId: id,
      referenceNumber: current.referenceNumber,
      action: "DETAILS_UPDATED",
      description: `Details updated: ${changed.join(", ")}`,
      actor: "ADMIN",
    });
  });
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

export async function addNote(enquiryId: string, body: string) {
  const db = await getDb();
  const enquiry = await requireEnquiry(enquiryId);
  return db.transaction(async (tx) => {
    const [note] = await tx.insert(internalNotes).values({ enquiryId, body }).returning();
    await logActivity(tx, { enquiryId, referenceNumber: enquiry.referenceNumber, action: "NOTE_ADDED", description: "Internal note added", actor: "ADMIN" });
    return note;
  });
}

async function requireNote(enquiryId: string, noteId: string) {
  const db = await getDb();
  const [note] = await db
    .select()
    .from(internalNotes)
    .where(and(eq(internalNotes.id, noteId), eq(internalNotes.enquiryId, enquiryId)))
    .limit(1);
  if (!note) throw new ApiError(404, "Note not found.", "NOT_FOUND");
  return note;
}

export async function editNote(enquiryId: string, noteId: string, body: string) {
  const db = await getDb();
  const enquiry = await requireEnquiry(enquiryId);
  await requireNote(enquiryId, noteId);
  await db.transaction(async (tx) => {
    await tx.update(internalNotes).set({ body, updatedAt: new Date() }).where(eq(internalNotes.id, noteId));
    await logActivity(tx, { enquiryId, referenceNumber: enquiry.referenceNumber, action: "NOTE_EDITED", description: "Internal note edited", actor: "ADMIN" });
  });
}

export async function deleteNote(enquiryId: string, noteId: string) {
  const db = await getDb();
  const enquiry = await requireEnquiry(enquiryId);
  await requireNote(enquiryId, noteId);
  await db.transaction(async (tx) => {
    await tx.delete(internalNotes).where(eq(internalNotes.id, noteId));
    await logActivity(tx, { enquiryId, referenceNumber: enquiry.referenceNumber, action: "NOTE_DELETED", description: "Internal note deleted", actor: "ADMIN" });
  });
}

// ---------------------------------------------------------------------------
// Follow-ups
// ---------------------------------------------------------------------------

async function syncNextFollowUp(tx: Tx, enquiryId: string) {
  const [next] = await tx
    .select({ dueAt: followUps.dueAt })
    .from(followUps)
    .where(and(eq(followUps.enquiryId, enquiryId), isNull(followUps.completedAt)))
    .orderBy(asc(followUps.dueAt))
    .limit(1);
  await tx.update(enquiries).set({ nextFollowUpAt: next?.dueAt ?? null, updatedAt: new Date() }).where(eq(enquiries.id, enquiryId));
}

export async function scheduleFollowUp(enquiryId: string, input: { dueAt: Date; note?: string | null }) {
  const db = await getDb();
  const enquiry = await requireEnquiry(enquiryId);
  return db.transaction(async (tx) => {
    const [row] = await tx.insert(followUps).values({ enquiryId, dueAt: input.dueAt, note: input.note || null }).returning();
    await syncNextFollowUp(tx, enquiryId);
    await logActivity(tx, {
      enquiryId,
      referenceNumber: enquiry.referenceNumber,
      action: "FOLLOW_UP_SCHEDULED",
      description: `Follow-up scheduled for ${formatDateTime(input.dueAt)}${input.note ? ` — ${input.note}` : ""}`,
      actor: "ADMIN",
      metadata: { dueAt: input.dueAt.toISOString() },
    });
    return row;
  });
}

async function requireFollowUp(id: string) {
  const db = await getDb();
  const [row] = await db.select().from(followUps).where(eq(followUps.id, id)).limit(1);
  if (!row) throw new ApiError(404, "Follow-up not found.", "NOT_FOUND");
  const enquiry = await requireEnquiry(row.enquiryId, { includeDeleted: true });
  return { followUp: row, enquiry };
}

export async function completeFollowUp(id: string) {
  const db = await getDb();
  const { followUp, enquiry } = await requireFollowUp(id);
  await db.transaction(async (tx) => {
    await tx.update(followUps).set({ completedAt: new Date(), updatedAt: new Date() }).where(eq(followUps.id, id));
    await syncNextFollowUp(tx, followUp.enquiryId);
    await logActivity(tx, {
      enquiryId: followUp.enquiryId,
      referenceNumber: enquiry.referenceNumber,
      action: "FOLLOW_UP_COMPLETED",
      description: "Follow-up marked complete",
      actor: "ADMIN",
    });
  });
}

export async function rescheduleFollowUp(id: string, dueAt: Date, note?: string | null) {
  const db = await getDb();
  const { followUp, enquiry } = await requireFollowUp(id);
  await db.transaction(async (tx) => {
    await tx
      .update(followUps)
      .set({ dueAt, note: note === undefined ? followUp.note : note, completedAt: null, updatedAt: new Date() })
      .where(eq(followUps.id, id));
    await syncNextFollowUp(tx, followUp.enquiryId);
    await logActivity(tx, {
      enquiryId: followUp.enquiryId,
      referenceNumber: enquiry.referenceNumber,
      action: "FOLLOW_UP_RESCHEDULED",
      description: `Follow-up rescheduled to ${formatDateTime(dueAt)}`,
      actor: "ADMIN",
      metadata: { dueAt: dueAt.toISOString() },
    });
  });
}

// ---------------------------------------------------------------------------
// Archive / trash / delete
// ---------------------------------------------------------------------------

export async function setArchived(id: string, archived: boolean) {
  const db = await getDb();
  const enquiry = await requireEnquiry(id);
  await db.transaction(async (tx) => {
    await tx.update(enquiries).set({ archivedAt: archived ? new Date() : null, updatedAt: new Date() }).where(eq(enquiries.id, id));
    await logActivity(tx, {
      enquiryId: id,
      referenceNumber: enquiry.referenceNumber,
      action: archived ? "ENQUIRY_ARCHIVED" : "ENQUIRY_UNARCHIVED",
      description: archived ? "Enquiry archived" : "Enquiry restored from archive",
      actor: "ADMIN",
    });
  });
}

export async function moveToTrash(id: string) {
  const db = await getDb();
  const enquiry = await requireEnquiry(id);
  await db.transaction(async (tx) => {
    await tx.update(enquiries).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(enquiries.id, id));
    await logActivity(tx, { enquiryId: id, referenceNumber: enquiry.referenceNumber, action: "ENQUIRY_TRASHED", description: "Enquiry moved to trash", actor: "ADMIN" });
  });
}

export async function restoreFromTrash(id: string) {
  const db = await getDb();
  const enquiry = await requireEnquiry(id, { includeDeleted: true });
  if (!enquiry.deletedAt) return;
  await db.transaction(async (tx) => {
    await tx.update(enquiries).set({ deletedAt: null, updatedAt: new Date() }).where(eq(enquiries.id, id));
    await logActivity(tx, { enquiryId: id, referenceNumber: enquiry.referenceNumber, action: "ENQUIRY_RESTORED", description: "Enquiry restored from trash", actor: "ADMIN" });
  });
}

/** Permanent deletion. Only allowed for enquiries already in the trash. */
export async function purgeEnquiry(id: string) {
  const db = await getDb();
  const enquiry = await requireEnquiry(id, { includeDeleted: true });
  if (!enquiry.deletedAt) throw new ApiError(409, "Move the enquiry to the trash before deleting it permanently.", "NOT_IN_TRASH");
  const files = await db.select({ storageKey: attachments.storageKey }).from(attachments).where(eq(attachments.enquiryId, id));
  await db.transaction(async (tx) => {
    await tx.delete(enquiries).where(eq(enquiries.id, id));
    await logActivity(tx, {
      enquiryId: null,
      referenceNumber: enquiry.referenceNumber,
      action: "ENQUIRY_DELETED",
      description: `Enquiry ${enquiry.referenceNumber} (${enquiry.name}) permanently deleted`,
      actor: "ADMIN",
    });
  });
  for (const file of files) await removeFile(file.storageKey).catch(() => undefined);
}

// ---------------------------------------------------------------------------
// Bulk
// ---------------------------------------------------------------------------

export type BulkAction =
  | { action: "mark_read" }
  | { action: "mark_unread" }
  | { action: "status"; status: EnquiryStatus }
  | { action: "priority"; priority: EnquiryPriority }
  | { action: "follow_up"; dueAt: Date; note?: string | null }
  | { action: "archive" }
  | { action: "unarchive" }
  | { action: "trash" }
  | { action: "restore" }
  | { action: "delete_permanent" };

export async function bulkApply(ids: string[], op: BulkAction) {
  const db = await getDb();
  const existing = await db.select({ id: enquiries.id }).from(enquiries).where(inArray(enquiries.id, ids));
  const valid = existing.map((row) => row.id);
  let done = 0;
  const skipped: string[] = [];

  for (const id of valid) {
    try {
      switch (op.action) {
        case "mark_read":
          await setRead(id, true);
          break;
        case "mark_unread":
          await setRead(id, false);
          break;
        case "status":
          await setStatus(id, op.status);
          break;
        case "priority":
          await setPriority(id, op.priority);
          break;
        case "follow_up":
          await scheduleFollowUp(id, { dueAt: op.dueAt, note: op.note });
          break;
        case "archive":
          await setArchived(id, true);
          break;
        case "unarchive":
          await setArchived(id, false);
          break;
        case "trash":
          await moveToTrash(id);
          break;
        case "restore":
          await restoreFromTrash(id);
          break;
        case "delete_permanent":
          await purgeEnquiry(id);
          break;
      }
      done += 1;
    } catch {
      skipped.push(id);
    }
  }
  await logActivity(db, {
    action: "BULK_ACTION",
    description: `Bulk ${op.action.replace("_", " ")} applied to ${done} of ${ids.length} enquiries`,
    actor: "ADMIN",
    metadata: { action: op.action, requested: ids.length, done },
  });
  return { requested: ids.length, done, skipped: skipped.length + (ids.length - valid.length) };
}
