import { randomUUID } from "node:crypto";
import { and, desc, eq, inArray } from "drizzle-orm";
import { attachments, getDb, type DbOrTx } from "../db";
import { getFile, putFile, removeFile } from "./storage";
import type { ValidatedFile } from "./validate";

export type AttachmentOwner = {
  enquiryId: string;
  messageId?: string | null;
  draftId?: string | null;
  uploadedBy: "CUSTOMER" | "ADMIN";
};

export function attachmentDownloadUrl(id: string) {
  return `/api/admin/attachments/${id}/download/`;
}

/** Persists a validated file (row + bytes). Call inside the caller's transaction where possible. */
export async function saveAttachment(db: DbOrTx, owner: AttachmentOwner, file: ValidatedFile) {
  const id = randomUUID();
  // Row first so the database driver's blob FK is satisfied; the stored name is random, never user-controlled.
  await db.insert(attachments).values({
    id,
    enquiryId: owner.enquiryId,
    messageId: owner.messageId ?? null,
    draftId: owner.draftId ?? null,
    filename: `${id}.${file.extension}`,
    originalFilename: file.originalName,
    mimeType: file.mimeType,
    size: file.size,
    storageKey: "pending",
    url: attachmentDownloadUrl(id),
    uploadedBy: owner.uploadedBy,
  });
  const stored = await putFile(db, id, file.data);
  await db.update(attachments).set({ storageKey: stored.key }).where(eq(attachments.id, id));
  return { id, ...stored };
}

export async function getAttachmentWithData(id: string) {
  const db = await getDb();
  const [meta] = await db.select().from(attachments).where(eq(attachments.id, id)).limit(1);
  if (!meta) return null;
  const data = await getFile(meta.storageKey);
  return data ? { meta, data } : null;
}

export async function listAttachmentsForEnquiry(enquiryId: string) {
  const db = await getDb();
  return db.select().from(attachments).where(eq(attachments.enquiryId, enquiryId)).orderBy(desc(attachments.createdAt));
}

export async function attachmentsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const db = await getDb();
  return db.select().from(attachments).where(inArray(attachments.id, ids));
}

export async function deleteAttachment(id: string) {
  const db = await getDb();
  const [meta] = await db.select().from(attachments).where(eq(attachments.id, id)).limit(1);
  if (!meta) return null;
  await db.delete(attachments).where(eq(attachments.id, id));
  await removeFile(meta.storageKey);
  return meta;
}

export async function attachmentsForDraft(draftId: string, enquiryId: string) {
  const db = await getDb();
  return db
    .select()
    .from(attachments)
    .where(and(eq(attachments.draftId, draftId), eq(attachments.enquiryId, enquiryId)));
}
