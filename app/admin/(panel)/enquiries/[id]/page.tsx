import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnquiryWorkspace } from "@/components/admin/enquiry/EnquiryWorkspace";
import type { AttachmentView, EmailLogView, EnquiryView, MessageView } from "@/components/admin/enquiry/types";
import { requireAdminPage } from "@/lib/server/auth/dal";
import { sanitizeEmailHtml, textToHtml } from "@/lib/server/email/html";
import { DEFAULT_TEMPLATES, QUICK_REPLIES, TEMPLATE_KEYS } from "@/lib/server/email/templates";
import { env } from "@/lib/server/env";
import { setRead } from "@/lib/server/enquiries/mutate";
import { getEnquiryDetail } from "@/lib/server/enquiries/queries";
import { defaultReplySubject } from "@/lib/server/enquiries/reply";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Enquiry" };

const iso = (value: Date | null | undefined) => (value ? value.toISOString() : null);

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdminPage(`/admin/enquiries/${id}/`);
  if (!z.uuid().safeParse(id).success) notFound();

  const detail = await getEnquiryDetail(id);
  if (!detail) notFound();
  const { enquiry: e } = detail;

  // Opening an enquiry marks it as read (trashed ones are left alone).
  if (!e.isRead && !e.deletedAt) await setRead(id, true);

  const toAttachment = (a: (typeof detail.attachments)[number]): AttachmentView => ({
    id: a.id,
    messageId: a.messageId,
    draftId: a.draftId,
    originalFilename: a.originalFilename,
    mimeType: a.mimeType,
    size: a.size,
    uploadedBy: a.uploadedBy,
    createdAt: a.createdAt.toISOString(),
  });

  // The most recent failed email log for each outbound message drives its "Retry" control.
  const failedByMessage = new Map<string, (typeof detail.emailLogs)[number]>();
  for (const log of detail.emailLogs) {
    if (log.status === "FAILED" && log.messageRowId && !failedByMessage.has(log.messageRowId)) failedByMessage.set(log.messageRowId, log);
  }

  const messages: MessageView[] = detail.messages.map((m) => {
    const failed = failedByMessage.get(m.id);
    return {
      id: m.id,
      direction: m.direction,
      senderName: m.senderName,
      senderEmail: m.senderEmail,
      recipientEmail: m.recipientEmail,
      cc: m.cc,
      subject: m.subject,
      // Sanitised again at render time as defence in depth; stored HTML is already sanitised.
      bodyHtml: sanitizeEmailHtml(m.bodyHtml ?? textToHtml(m.bodyText)),
      status: m.status,
      at: (m.sentAt ?? m.receivedAt ?? m.createdAt).toISOString(),
      attachments: m.attachments.map(toAttachment),
      failedLogId: failed && m.status === "FAILED" ? failed.id : null,
      failedReason: failed && m.status === "FAILED" ? failed.errorMessage : null,
    };
  });

  const enquiry: EnquiryView = {
    id: e.id,
    customerId: e.customerId,
    referenceNumber: e.referenceNumber,
    type: e.type,
    status: e.status,
    priority: e.priority,
    source: e.source,
    name: e.name,
    company: e.company,
    email: e.email,
    phone: e.phone,
    country: e.country,
    city: e.city,
    website: e.website,
    subject: e.subject,
    service: e.service,
    projectType: e.projectType,
    projectDescription: e.projectDescription,
    timeline: e.timeline,
    budget: e.budget,
    currency: e.currency,
    preferredContactMethod: e.preferredContactMethod,
    landingPage: e.landingPage,
    referrer: e.referrer,
    utmSource: e.utmSource,
    utmMedium: e.utmMedium,
    utmCampaign: e.utmCampaign,
    utmTerm: e.utmTerm,
    utmContent: e.utmContent,
    ipAddress: e.ipAddress,
    userAgent: e.userAgent,
    isRead: true,
    lastContactedAt: iso(e.lastContactedAt),
    lastCustomerReplyAt: iso(e.lastCustomerReplyAt),
    nextFollowUpAt: iso(e.nextFollowUpAt),
    createdAt: e.createdAt.toISOString(),
    closedAt: iso(e.closedAt),
    archivedAt: iso(e.archivedAt),
    deletedAt: iso(e.deletedAt),
  };

  const emailLogs: EmailLogView[] = detail.emailLogs.map((l) => ({
    id: l.id,
    recipient: l.recipient,
    subject: l.subject,
    template: l.template,
    status: l.status,
    attemptCount: l.attemptCount,
    errorMessage: l.errorMessage,
    createdAt: l.createdAt.toISOString(),
    canRetry: l.payload !== null,
  }));

  const draftFiles = detail.attachments.filter((a) => a.draftId);
  const drafts = detail.drafts.map((d) => ({
    id: d.id,
    toEmail: d.toEmail,
    cc: d.cc,
    subject: d.subject,
    bodyHtml: d.bodyHtml,
    updatedAt: d.updatedAt.toISOString(),
    attachments: draftFiles.filter((a) => a.draftId === d.id).map(toAttachment),
  }));

  // Drafts' files belong to the composer, not the sent conversation.
  const conversationFiles = detail.attachments.filter((a) => !a.draftId).map(toAttachment);

  const vercel = Boolean(process.env.VERCEL);
  const uploadLimitBytes = vercel ? 4 * 1024 * 1024 : env.maxInternalFileBytes;

  return (
    <EnquiryWorkspace
      enquiry={enquiry}
      customerSince={detail.customer?.createdAt.toISOString() ?? null}
      messages={messages}
      attachments={conversationFiles}
      notes={detail.notes.map((n) => ({ id: n.id, body: n.body, createdAt: n.createdAt.toISOString(), updatedAt: n.updatedAt.toISOString() }))}
      followUps={detail.followUps.map((f) => ({ id: f.id, dueAt: f.dueAt.toISOString(), note: f.note, completedAt: iso(f.completedAt) }))}
      activity={detail.activity.map((a) => ({ id: a.id, action: a.action, description: a.description, actor: a.actor, createdAt: a.createdAt.toISOString() }))}
      drafts={drafts}
      emailLogs={emailLogs}
      history={detail.history.map((h) => ({ id: h.id, referenceNumber: h.referenceNumber, type: h.type, status: h.status, service: h.service, subject: h.subject, createdAt: h.createdAt.toISOString() }))}
      defaultSubject={defaultReplySubject(e.subject, e.referenceNumber)}
      templates={TEMPLATE_KEYS.filter((key) => !DEFAULT_TEMPLATES[key].automatic).map((key) => ({ key, label: DEFAULT_TEMPLATES[key].label }))}
      quickReplies={QUICK_REPLIES.map((q) => ({ id: q.id, label: q.label, html: q.html }))}
      uploadLimitBytes={uploadLimitBytes}
    />
  );
}
