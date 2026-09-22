/** Serialisable shapes passed from the enquiry page (server) to its client components. Dates are ISO strings. */

export type EnquiryView = {
  id: string;
  customerId: string;
  referenceNumber: string;
  type: string;
  status: string;
  priority: string;
  source: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  subject: string;
  service: string | null;
  projectType: string | null;
  projectDescription: string;
  timeline: string | null;
  budget: string | null;
  currency: string | null;
  preferredContactMethod: string | null;
  landingPage: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  isRead: boolean;
  lastContactedAt: string | null;
  lastCustomerReplyAt: string | null;
  nextFollowUpAt: string | null;
  createdAt: string;
  closedAt: string | null;
  archivedAt: string | null;
  deletedAt: string | null;
};

export type AttachmentView = {
  id: string;
  messageId: string | null;
  draftId: string | null;
  originalFilename: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
};

export type MessageView = {
  id: string;
  direction: "INBOUND" | "OUTBOUND";
  senderName: string | null;
  senderEmail: string;
  recipientEmail: string;
  cc: string | null;
  subject: string;
  /** Already sanitised on the server. */
  bodyHtml: string;
  status: string;
  at: string;
  attachments: AttachmentView[];
  /** Email log id when this outbound message failed and can be retried. */
  failedLogId: string | null;
  failedReason: string | null;
};

export type NoteView = { id: string; body: string; createdAt: string; updatedAt: string };
export type FollowUpView = { id: string; dueAt: string; note: string | null; completedAt: string | null };
export type ActivityView = { id: number; action: string; description: string; actor: string; createdAt: string };
export type DraftView = { id: string; toEmail: string | null; cc: string | null; subject: string; bodyHtml: string; updatedAt: string; attachments: AttachmentView[] };
export type EmailLogView = { id: string; recipient: string; subject: string; template: string | null; status: string; attemptCount: number; errorMessage: string | null; createdAt: string; canRetry: boolean };
export type HistoryView = { id: string; referenceNumber: string; type: string; status: string; service: string | null; subject: string; createdAt: string };

export type TemplateOption = { key: string; label: string };
export type QuickReply = { id: string; label: string; html: string };
