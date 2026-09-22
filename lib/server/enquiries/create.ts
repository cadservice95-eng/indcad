import { createHash } from "node:crypto";
import { and, eq, gte, isNull } from "drizzle-orm";
import { enquiries, getDb, messages, type EnquirySource, type EnquiryType } from "../db";
import { textToHtml } from "../email/html";
import { sendAdminNotification, sendCustomerConfirmation } from "../email/send";
import { errorMessage, log } from "../log";
import { getMailConfig } from "../settings";
import { saveAttachment } from "../uploads/attachments";
import type { ValidatedFile } from "../uploads/validate";
import { logActivity } from "./activity";
import { getSoleAdminId, normalizeEmail, upsertCustomer } from "./customers";
import { createNotification } from "./notifications";
import { nextReferenceNumber } from "./reference";

export type NewEnquiryInput = {
  type: EnquiryType;
  source: EnquirySource;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  website?: string | null;
  service?: string | null;
  projectType?: string | null;
  description: string;
  notes?: string | null;
  timeline?: string | null;
  budget?: string | null;
  currency?: string | null;
  preferredContactMethod?: string | null;
  landingPage?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  files: ValidatedFile[];
  /** For enquiries that arrive as email rather than a web form: the real first message. */
  firstMessage?: {
    subject: string;
    bodyText: string;
    bodyHtml: string;
    messageId?: string | null;
    inReplyTo?: string | null;
    messageReferences?: string | null;
    receivedAt?: Date;
  };
};

export type CreateEnquiryResult = { duplicate: boolean; id: string; referenceNumber: string };

function subjectFor(input: NewEnquiryInput): string {
  if (input.type === "QUOTE_REQUEST") return `Quote request: ${input.service || "General enquiry"}`;
  const firstLine = input.description.split("\n")[0].trim().slice(0, 70);
  return `Website message: ${firstLine || `from ${input.name}`}`;
}

function bodyFor(input: NewEnquiryInput): string {
  const lines: string[] = [];
  if (input.type === "QUOTE_REQUEST") {
    if (input.service) lines.push(`Service: ${input.service}`);
    if (input.projectType) lines.push(`Project type: ${input.projectType}`);
    if (input.timeline) lines.push(`Preferred deadline: ${input.timeline}`);
    if (input.budget) lines.push(`Budget: ${input.budget}`);
    if (lines.length) lines.push("");
  }
  lines.push(input.description);
  if (input.notes) lines.push("", "Additional notes:", input.notes);
  return lines.join("\n");
}

function hashSubmission(input: NewEnquiryInput): string {
  const normalized = `${normalizeEmail(input.email)}|${input.type}|${input.description.toLowerCase().replace(/\s+/g, " ").trim()}|${(input.notes ?? "").toLowerCase().trim()}`;
  return createHash("sha256").update(normalized).digest("hex");
}

/**
 * Creates customer + enquiry + first message + activity (+ attachments) in ONE
 * transaction. Emails are sent afterwards and can never roll the enquiry back.
 */
export async function createEnquiry(input: NewEnquiryInput): Promise<CreateEnquiryResult> {
  const db = await getDb();
  const config = await getMailConfig();
  const email = normalizeEmail(input.email);
  const submissionHash = hashSubmission(input);
  const now = new Date();

  const existing = await db
    .select({ id: enquiries.id, referenceNumber: enquiries.referenceNumber })
    .from(enquiries)
    .where(and(eq(enquiries.submissionHash, submissionHash), gte(enquiries.createdAt, new Date(now.getTime() - 24 * 3_600_000)), isNull(enquiries.deletedAt)))
    .limit(1);
  if (existing[0]) {
    await logActivity(db, {
      enquiryId: existing[0].id,
      referenceNumber: existing[0].referenceNumber,
      action: "DUPLICATE_SUBMISSION",
      description: "An identical submission from the same email was ignored.",
      actor: "SYSTEM",
    });
    return { duplicate: true, ...existing[0] };
  }

  const body = input.firstMessage?.bodyText ?? bodyFor(input);
  const subject = input.firstMessage
    ? input.firstMessage.subject.replace(/^((re|fwd?):\s*)+/i, "").trim().slice(0, 200) || "Email enquiry"
    : subjectFor(input);

  const created = await db.transaction(async (tx) => {
    const customer = await upsertCustomer(tx, {
      email,
      name: input.name,
      company: input.company,
      phone: input.phone,
      country: input.country,
      city: input.city,
      website: input.website,
    });
    const referenceNumber = await nextReferenceNumber(tx, now);
    const adminId = await getSoleAdminId(tx);

    const [enquiry] = await tx
      .insert(enquiries)
      .values({
        referenceNumber,
        type: input.type,
        customerId: customer.id,
        name: input.name,
        company: input.company || null,
        email,
        phone: input.phone || null,
        country: input.country || null,
        city: input.city || null,
        website: input.website || null,
        subject,
        service: input.service || null,
        projectType: input.projectType || null,
        projectDescription: input.firstMessage
          ? body.slice(0, 20000)
          : [input.description, input.notes ? `Additional notes:\n${input.notes}` : ""].filter(Boolean).join("\n\n"),
        timeline: input.timeline || null,
        budget: input.budget || null,
        currency: input.currency || null,
        preferredContactMethod: input.preferredContactMethod || null,
        source: input.source,
        landingPage: input.landingPage || null,
        referrer: input.referrer || null,
        utmSource: input.utmSource || null,
        utmMedium: input.utmMedium || null,
        utmCampaign: input.utmCampaign || null,
        utmTerm: input.utmTerm || null,
        utmContent: input.utmContent || null,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
        submissionHash,
        assignedAdminId: adminId,
        isRead: false,
        lastMessageAt: now,
        lastMessageDirection: "INBOUND",
        messageCount: 1,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: enquiries.id });

    const [message] = await tx
      .insert(messages)
      .values({
        enquiryId: enquiry.id,
        direction: "INBOUND",
        senderName: input.name,
        senderEmail: email,
        recipientEmail: config.businessEmail,
        subject: input.firstMessage?.subject.slice(0, 300) ?? subject,
        bodyText: body,
        bodyHtml: input.firstMessage?.bodyHtml ?? textToHtml(body),
        messageId: input.firstMessage?.messageId ?? null,
        inReplyTo: input.firstMessage?.inReplyTo ?? null,
        messageReferences: input.firstMessage?.messageReferences ?? null,
        status: "RECEIVED",
        receivedAt: input.firstMessage?.receivedAt ?? now,
      })
      .returning({ id: messages.id });

    await logActivity(tx, {
      enquiryId: enquiry.id,
      referenceNumber,
      action: "ENQUIRY_CREATED",
      description: input.firstMessage ? "Enquiry created from an incoming email" : input.type === "QUOTE_REQUEST" ? "Quote request received" : "Contact message received",
      actor: "CUSTOMER",
      metadata: { source: input.source },
    });

    for (const file of input.files) {
      await saveAttachment(tx, { enquiryId: enquiry.id, messageId: message.id, uploadedBy: "CUSTOMER" }, file);
    }
    if (input.files.length) {
      await logActivity(tx, {
        enquiryId: enquiry.id,
        referenceNumber,
        action: "ATTACHMENT_UPLOADED",
        description: `${input.files.length} attachment${input.files.length === 1 ? "" : "s"} uploaded with the submission: ${input.files.map((f) => f.originalName).join(", ")}`,
        actor: "CUSTOMER",
      });
    }

    await createNotification(tx, {
      type: input.type === "QUOTE_REQUEST" ? "NEW_ENQUIRY" : "NEW_CONTACT",
      title: `${input.type === "QUOTE_REQUEST" ? "New quote request" : "New contact message"} — ${referenceNumber}`,
      body: `${input.name}${input.service ? ` · ${input.service}` : ""}`,
      enquiryId: enquiry.id,
      referenceNumber,
    });

    return { id: enquiry.id, referenceNumber };
  });

  log.info("enquiry.created", { reference: created.referenceNumber, type: input.type, source: input.source, files: input.files.length });
  return { duplicate: false, ...created };
}

/** Sends the admin notification and customer confirmation. Failures are logged, never thrown. */
export async function dispatchNewEnquiryEmails(enquiryId: string): Promise<void> {
  for (const send of [sendAdminNotification, sendCustomerConfirmation]) {
    try {
      await send(enquiryId);
    } catch (error) {
      log.error("enquiry.email_dispatch_failed", { enquiryId, error: errorMessage(error) });
    }
  }
}
