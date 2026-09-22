import { and, asc, eq } from "drizzle-orm";
import { SITE } from "@/lib/constants";
import { attachments, emailDrafts, getDb, messages } from "../db";
import { env } from "../env";
import { emailLayout, htmlToText, isEmptyHtml, sanitizeEmailHtml, singleLine } from "../email/html";
import { deliverEmail, makeMessageId, queueEmail, type DeliveryResult } from "../email/send";
import { fillTemplate, getTemplate, type TemplateKey } from "../email/templates";
import { ApiError } from "../http";
import { getMailConfig } from "../settings";
import { attachmentsForDraft, deleteAttachment, saveAttachment } from "../uploads/attachments";
import type { ValidatedFile } from "../uploads/validate";
import { logActivity } from "./activity";
import { REFERENCE_PATTERN } from "./reference";
import { requireEnquiry } from "./queries";

export type ReplyInput = {
  enquiryId: string;
  to: string;
  cc?: string | null;
  /** Not exposed in the reply composer UI — used internally (e.g. the Trustpilot invite alias). */
  bcc?: string | null;
  subject: string;
  bodyHtml: string;
  statusAfter?: string;
  draftId?: string | null;
  files: ValidatedFile[];
  template?: string;
};

/** Message-ID / In-Reply-To / References so mail clients group the reply into one conversation. */
async function threadingFor(enquiryId: string) {
  const db = await getDb();
  const rows = await db
    .select({ messageId: messages.messageId, direction: messages.direction })
    .from(messages)
    .where(eq(messages.enquiryId, enquiryId))
    .orderBy(asc(messages.createdAt));
  const ids = rows.map((r) => r.messageId).filter((id): id is string => Boolean(id));
  const last = ids.at(-1);
  return { inReplyTo: last, references: ids.slice(-10).join(" ") || undefined };
}

export function subjectWithReference(subject: string, reference: string): string {
  const cleaned = singleLine(subject).slice(0, 250);
  return REFERENCE_PATTERN.test(cleaned) ? cleaned : `${cleaned} [${reference}]`;
}

export function defaultReplySubject(subject: string, reference: string): string {
  const base = /^re:/i.test(subject) ? subject : `Re: ${subject}`;
  return subjectWithReference(base, reference);
}

/**
 * Creates the outbound message + email log in one transaction, then delivers.
 * If delivery fails the message and enquiry are kept and the email can be retried.
 */
export async function sendAdminReply(input: ReplyInput): Promise<DeliveryResult & { messageRowId: string }> {
  const db = await getDb();
  const enquiry = await requireEnquiry(input.enquiryId);
  const config = await getMailConfig();

  const bodyHtml = sanitizeEmailHtml(input.bodyHtml);
  if (isEmptyHtml(bodyHtml)) throw new ApiError(400, "Write a message before sending.", "EMPTY_BODY");
  const subject = subjectWithReference(input.subject || `Re: ${enquiry.subject}`, enquiry.referenceNumber);
  const bodyText = htmlToText(bodyHtml);
  const thread = await threadingFor(enquiry.id);
  const messageId = makeMessageId(config);
  const wrapped = emailLayout({ bodyHtml, siteName: SITE.name, supportEmail: config.businessEmail, footerNote: `Reference ${enquiry.referenceNumber}` });

  const queued = await db.transaction(async (tx) => {
    const [message] = await tx
      .insert(messages)
      .values({
        enquiryId: enquiry.id,
        direction: "OUTBOUND",
        senderName: config.fromName,
        senderEmail: config.fromEmail,
        recipientEmail: input.to,
        cc: input.cc || null,
        subject,
        bodyHtml,
        bodyText,
        messageId,
        inReplyTo: thread.inReplyTo ?? null,
        messageReferences: thread.references ?? null,
        status: "QUEUED",
      })
      .returning({ id: messages.id });

    const attachmentIds: string[] = [];
    if (input.draftId) {
      const draftFiles = await attachmentsForDraft(input.draftId, enquiry.id);
      for (const file of draftFiles) {
        await tx.update(attachments).set({ draftId: null, messageId: message.id }).where(eq(attachments.id, file.id));
        attachmentIds.push(file.id);
      }
    }
    for (const file of input.files) {
      const saved = await saveAttachment(tx, { enquiryId: enquiry.id, messageId: message.id, uploadedBy: "ADMIN" }, file);
      attachmentIds.push(saved.id);
    }

    const { id: logId } = await queueEmail(
      tx,
      {
        to: input.to,
        cc: input.cc,
        bcc: input.bcc,
        subject,
        html: wrapped,
        text: bodyText,
        template: input.template ?? "reply",
        enquiryId: enquiry.id,
        messageRowId: message.id,
        replyTo: config.businessEmail,
        inReplyTo: thread.inReplyTo,
        references: thread.references,
        attachmentIds,
        statusAfter: input.statusAfter,
        messageId,
      },
      config,
    );

    if (input.draftId) await tx.delete(emailDrafts).where(and(eq(emailDrafts.id, input.draftId), eq(emailDrafts.enquiryId, enquiry.id)));
    if (input.files.length) {
      await logActivity(tx, {
        enquiryId: enquiry.id,
        referenceNumber: enquiry.referenceNumber,
        action: "ATTACHMENT_UPLOADED",
        description: `${input.files.length} attachment${input.files.length === 1 ? "" : "s"} added to reply: ${input.files.map((f) => f.originalName).join(", ")}`,
        actor: "ADMIN",
      });
    }
    return { logId, messageRowId: message.id };
  });

  const result = await deliverEmail(queued.logId);
  return { ...result, messageRowId: queued.messageRowId };
}

/** Renders a reply template (with {{placeholders}} filled) for the composer. */
export async function renderReplyTemplate(enquiryId: string, key: TemplateKey) {
  const enquiry = await requireEnquiry(enquiryId);
  const config = await getMailConfig();
  const template = await getTemplate(key);
  const vars = {
    name: enquiry.name,
    reference_number: enquiry.referenceNumber,
    service: enquiry.service ?? "your project",
    company: enquiry.company ?? "",
    support_email: config.businessEmail,
    site_name: SITE.name,
    project_description: enquiry.projectDescription,
    review_url: SITE.trustpilotReviewUrl,
  };
  return {
    subject: subjectWithReference(fillTemplate(template.subject, vars, "text"), enquiry.referenceNumber),
    bodyHtml: fillTemplate(template.bodyHtml, vars, "html"),
  };
}

/** Sends the "quote follow-up" template through the normal reply flow. */
export async function sendFollowUp(enquiryId: string, overrides?: { bodyHtml?: string; subject?: string }) {
  const enquiry = await requireEnquiry(enquiryId);
  const rendered = await renderReplyTemplate(enquiryId, "quote_follow_up");
  return sendAdminReply({
    enquiryId,
    to: enquiry.email,
    subject: overrides?.subject ?? rendered.subject,
    bodyHtml: overrides?.bodyHtml ?? rendered.bodyHtml,
    files: [],
    template: "quote_follow_up",
  });
}

/**
 * Sends a review-request email to the customer. Manual only — the admin
 * decides when a project is far enough along to ask, never automatic.
 * BCCs the Trustpilot invite alias (Settings → General) when configured, so
 * Trustpilot's own automatic invite also fires for the same address.
 */
export async function sendReviewRequest(enquiryId: string) {
  const enquiry = await requireEnquiry(enquiryId);
  const rendered = await renderReplyTemplate(enquiryId, "review_request");
  return sendAdminReply({
    enquiryId,
    to: enquiry.email,
    subject: rendered.subject,
    bodyHtml: rendered.bodyHtml,
    files: [],
    template: "review_request",
    bcc: env.trustpilotBccEmail || null,
  });
}

// ---------------------------------------------------------------------------
// Drafts (private; never sent until "Send" is pressed)
// ---------------------------------------------------------------------------

export async function saveDraft(input: {
  enquiryId: string;
  draftId?: string | null;
  to?: string | null;
  cc?: string | null;
  subject: string;
  bodyHtml: string;
  files: ValidatedFile[];
}) {
  const db = await getDb();
  const enquiry = await requireEnquiry(input.enquiryId);
  const values = {
    toEmail: input.to || null,
    cc: input.cc || null,
    subject: singleLine(input.subject).slice(0, 300),
    bodyHtml: sanitizeEmailHtml(input.bodyHtml),
    updatedAt: new Date(),
  };
  return db.transaction(async (tx) => {
    let draftId = input.draftId ?? null;
    if (draftId) {
      const updated = await tx
        .update(emailDrafts)
        .set(values)
        .where(and(eq(emailDrafts.id, draftId), eq(emailDrafts.enquiryId, enquiry.id)))
        .returning({ id: emailDrafts.id });
      if (!updated[0]) draftId = null;
    }
    if (!draftId) {
      const [row] = await tx.insert(emailDrafts).values({ enquiryId: enquiry.id, ...values }).returning({ id: emailDrafts.id });
      draftId = row.id;
      await logActivity(tx, { enquiryId: enquiry.id, referenceNumber: enquiry.referenceNumber, action: "DRAFT_SAVED", description: "Reply draft saved", actor: "ADMIN" });
    }
    for (const file of input.files) {
      await saveAttachment(tx, { enquiryId: enquiry.id, draftId, uploadedBy: "ADMIN" }, file);
    }
    return { id: draftId };
  });
}

export async function deleteDraft(enquiryId: string, draftId: string) {
  const db = await getDb();
  const enquiry = await requireEnquiry(enquiryId);
  const files = await attachmentsForDraft(draftId, enquiryId);
  for (const file of files) await deleteAttachment(file.id);
  const removed = await db.delete(emailDrafts).where(and(eq(emailDrafts.id, draftId), eq(emailDrafts.enquiryId, enquiryId))).returning({ id: emailDrafts.id });
  if (removed[0]) {
    await logActivity(db, { enquiryId, referenceNumber: enquiry.referenceNumber, action: "DRAFT_DISCARDED", description: "Reply draft discarded", actor: "ADMIN" });
  }
}
