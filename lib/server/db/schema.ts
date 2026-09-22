import { sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer | Uint8Array }>({
  dataType() {
    return "bytea";
  },
  toDriver(value) {
    return value;
  },
  fromDriver(value) {
    return Buffer.isBuffer(value) ? value : Buffer.from(value);
  },
});

const ts = (name: string) => timestamp(name, { withTimezone: true });

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const ENQUIRY_TYPES = ["QUOTE_REQUEST", "CONTACT_MESSAGE"] as const;
export const ENQUIRY_STATUSES = [
  "NEW",
  "IN_REVIEW",
  "CONTACTED",
  "AWAITING_CUSTOMER",
  "QUOTED",
  "FOLLOW_UP",
  "WON",
  "LOST",
  "CLOSED",
] as const;
export const ENQUIRY_PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
export const ENQUIRY_SOURCES = ["QUOTE_FORM", "CONTACT_FORM", "WEBSITE", "DIRECT"] as const;
export const MESSAGE_DIRECTIONS = ["INBOUND", "OUTBOUND"] as const;
export const EMAIL_STATUSES = ["QUEUED", "SENDING", "SENT", "FAILED"] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
export type EnquiryPriority = (typeof ENQUIRY_PRIORITIES)[number];
export type EnquirySource = (typeof ENQUIRY_SOURCES)[number];
export type MessageDirection = (typeof MESSAGE_DIRECTIONS)[number];
export type EmailStatus = (typeof EMAIL_STATUSES)[number];

export const enquiryTypeEnum = pgEnum("enquiry_type", ENQUIRY_TYPES);
export const enquiryStatusEnum = pgEnum("enquiry_status", ENQUIRY_STATUSES);
export const enquiryPriorityEnum = pgEnum("enquiry_priority", ENQUIRY_PRIORITIES);
export const enquirySourceEnum = pgEnum("enquiry_source", ENQUIRY_SOURCES);
export const messageDirectionEnum = pgEnum("message_direction", MESSAGE_DIRECTIONS);
export const emailStatusEnum = pgEnum("email_status", EMAIL_STATUSES);

// ---------------------------------------------------------------------------
// Admin auth (single admin account, no roles)
// ---------------------------------------------------------------------------

export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default("Admin"),
  passwordHash: text("password_hash").notNull(),
  mustChangePassword: boolean("must_change_password").notNull().default(false),
  lastLoginAt: ts("last_login_at"),
  passwordChangedAt: ts("password_changed_at"),
  createdAt: ts("created_at").notNull().defaultNow(),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => admins.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: ts("expires_at").notNull(),
    lastSeenAt: ts("last_seen_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: ts("created_at").notNull().defaultNow(),
  },
  (t) => [index("sessions_admin_idx").on(t.adminId), index("sessions_expires_idx").on(t.expiresAt)],
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => admins.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: ts("expires_at").notNull(),
    usedAt: ts("used_at"),
    requestedIp: text("requested_ip"),
    createdAt: ts("created_at").notNull().defaultNow(),
  },
  (t) => [index("prt_admin_idx").on(t.adminId)],
);

/** DB-backed fixed-window counters so limits hold across serverless instances. */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: ts("window_start").notNull().defaultNow(),
  blockedUntil: ts("blocked_until"),
});

// ---------------------------------------------------------------------------
// Customers & enquiries
// ---------------------------------------------------------------------------

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    company: text("company"),
    phone: text("phone"),
    country: text("country"),
    city: text("city"),
    website: text("website"),
    createdAt: ts("created_at").notNull().defaultNow(),
    updatedAt: ts("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("customers_email_uq").on(t.email)],
);

export const enquiryCounters = pgTable("enquiry_counters", {
  year: integer("year").primaryKey(),
  value: integer("value").notNull().default(0),
});

export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    referenceNumber: text("reference_number").notNull(),
    type: enquiryTypeEnum("type").notNull(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),

    name: text("name").notNull(),
    company: text("company"),
    email: text("email").notNull(),
    phone: text("phone"),
    country: text("country"),
    city: text("city"),
    website: text("website"),
    subject: text("subject").notNull(),
    service: text("service"),
    projectType: text("project_type"),
    projectDescription: text("project_description").notNull(),
    timeline: text("timeline"),
    budget: text("budget"),
    currency: text("currency"),
    preferredContactMethod: text("preferred_contact_method"),

    status: enquiryStatusEnum("status").notNull().default("NEW"),
    priority: enquiryPriorityEnum("priority").notNull().default("NORMAL"),

    source: enquirySourceEnum("source").notNull(),
    landingPage: text("landing_page"),
    referrer: text("referrer"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    submissionHash: text("submission_hash"),

    assignedAdminId: uuid("assigned_admin_id").references(() => admins.id, { onDelete: "set null" }),
    isRead: boolean("is_read").notNull().default(false),

    lastMessageAt: ts("last_message_at"),
    lastMessageDirection: messageDirectionEnum("last_message_direction"),
    messageCount: integer("message_count").notNull().default(0),
    lastContactedAt: ts("last_contacted_at"),
    lastCustomerReplyAt: ts("last_customer_reply_at"),
    nextFollowUpAt: ts("next_follow_up_at"),

    archivedAt: ts("archived_at"),
    deletedAt: ts("deleted_at"),
    closedAt: ts("closed_at"),
    createdAt: ts("created_at").notNull().defaultNow(),
    updatedAt: ts("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("enquiries_reference_uq").on(t.referenceNumber),
    index("enquiries_email_idx").on(t.email),
    index("enquiries_status_idx").on(t.status),
    index("enquiries_priority_idx").on(t.priority),
    index("enquiries_created_idx").on(t.createdAt),
    index("enquiries_follow_up_idx").on(t.nextFollowUpAt),
    index("enquiries_customer_idx").on(t.customerId),
    index("enquiries_submission_hash_idx").on(t.submissionHash),
  ],
);

// ---------------------------------------------------------------------------
// Conversation
// ---------------------------------------------------------------------------

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    direction: messageDirectionEnum("direction").notNull(),
    senderName: text("sender_name"),
    senderEmail: text("sender_email").notNull(),
    recipientEmail: text("recipient_email").notNull(),
    cc: text("cc"),
    subject: text("subject").notNull(),
    bodyHtml: text("body_html"),
    bodyText: text("body_text").notNull(),
    /** RFC 5322 Message-ID including angle brackets. */
    messageId: text("message_id"),
    inReplyTo: text("in_reply_to"),
    messageReferences: text("message_references"),
    /** RECEIVED | QUEUED | SENT | FAILED */
    status: text("status").notNull().default("RECEIVED"),
    sentAt: ts("sent_at"),
    receivedAt: ts("received_at"),
    createdAt: ts("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("messages_enquiry_idx").on(t.enquiryId, t.createdAt),
    uniqueIndex("messages_message_id_uq").on(t.messageId).where(sql`${t.messageId} is not null`),
  ],
);

export const emailDrafts = pgTable(
  "email_drafts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    toEmail: text("to_email"),
    cc: text("cc"),
    subject: text("subject").notNull().default(""),
    bodyHtml: text("body_html").notNull().default(""),
    createdAt: ts("created_at").notNull().defaultNow(),
    updatedAt: ts("updated_at").notNull().defaultNow(),
  },
  (t) => [index("drafts_enquiry_idx").on(t.enquiryId)],
);

export const attachments = pgTable(
  "attachments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    messageId: uuid("message_id").references(() => messages.id, { onDelete: "set null" }),
    draftId: uuid("draft_id").references(() => emailDrafts.id, { onDelete: "cascade" }),
    filename: text("filename").notNull(),
    originalFilename: text("original_filename").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    storageKey: text("storage_key").notNull(),
    url: text("url").notNull(),
    /** CUSTOMER | ADMIN */
    uploadedBy: text("uploaded_by").notNull(),
    createdAt: ts("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("attachments_enquiry_idx").on(t.enquiryId),
    index("attachments_message_idx").on(t.messageId),
    index("attachments_draft_idx").on(t.draftId),
  ],
);

/** Binary payloads kept out of `attachments` so listing never loads file data. */
export const attachmentBlobs = pgTable("attachment_blobs", {
  attachmentId: uuid("attachment_id")
    .primaryKey()
    .references(() => attachments.id, { onDelete: "cascade" }),
  data: bytea("data").notNull(),
});

// ---------------------------------------------------------------------------
// Admin working data
// ---------------------------------------------------------------------------

export const internalNotes = pgTable(
  "internal_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: ts("created_at").notNull().defaultNow(),
    updatedAt: ts("updated_at").notNull().defaultNow(),
  },
  (t) => [index("notes_enquiry_idx").on(t.enquiryId)],
);

export const followUps = pgTable(
  "follow_ups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enquiryId: uuid("enquiry_id")
      .notNull()
      .references(() => enquiries.id, { onDelete: "cascade" }),
    dueAt: ts("due_at").notNull(),
    note: text("note"),
    completedAt: ts("completed_at"),
    createdAt: ts("created_at").notNull().defaultNow(),
    updatedAt: ts("updated_at").notNull().defaultNow(),
  },
  (t) => [index("follow_ups_enquiry_idx").on(t.enquiryId), index("follow_ups_due_idx").on(t.dueAt)],
);

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    enquiryId: uuid("enquiry_id").references(() => enquiries.id, { onDelete: "set null" }),
    /** Kept so the audit trail stays readable after an enquiry is purged. */
    referenceNumber: text("reference_number"),
    action: text("action").notNull(),
    description: text("description").notNull(),
    /** ADMIN | CUSTOMER | SYSTEM */
    actor: text("actor").notNull().default("SYSTEM"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: ts("created_at").notNull().defaultNow(),
  },
  (t) => [index("activity_enquiry_idx").on(t.enquiryId, t.createdAt), index("activity_created_idx").on(t.createdAt)],
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    enquiryId: uuid("enquiry_id").references(() => enquiries.id, { onDelete: "cascade" }),
    referenceNumber: text("reference_number"),
    dedupeKey: text("dedupe_key"),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: ts("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("notifications_read_idx").on(t.isRead, t.createdAt),
    uniqueIndex("notifications_dedupe_uq").on(t.dedupeKey).where(sql`${t.dedupeKey} is not null`),
  ],
);

export const savedFilters = pgTable("saved_filters", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  /** Serialised query string, e.g. "status=NEW&priority=HIGH". */
  query: text("query").notNull().default(""),
  createdAt: ts("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

export type EmailPayload = {
  html: string;
  text: string;
  replyTo?: string;
  inReplyTo?: string;
  references?: string;
  attachmentIds?: string[];
  /** Status to apply to the enquiry once this reply is actually sent. */
  statusAfter?: string;
};

export const emailLogs = pgTable(
  "email_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enquiryId: uuid("enquiry_id").references(() => enquiries.id, { onDelete: "set null" }),
    messageRowId: uuid("message_row_id").references(() => messages.id, { onDelete: "set null" }),
    recipient: text("recipient").notNull(),
    cc: text("cc"),
    bcc: text("bcc"),
    sender: text("sender").notNull(),
    subject: text("subject").notNull(),
    template: text("template"),
    /** RFC 5322 Message-ID used for this send. */
    messageId: text("message_id"),
    status: emailStatusEnum("status").notNull().default("QUEUED"),
    providerResponse: text("provider_response"),
    errorMessage: text("error_message"),
    attemptCount: integer("attempt_count").notNull().default(0),
    lastAttemptAt: ts("last_attempt_at"),
    sentAt: ts("sent_at"),
    /** Null for emails that must not be replayed (e.g. password resets). */
    payload: jsonb("payload").$type<EmailPayload>(),
    createdAt: ts("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("email_logs_enquiry_idx").on(t.enquiryId),
    index("email_logs_status_idx").on(t.status, t.createdAt),
    index("email_logs_message_id_idx").on(t.messageId),
  ],
);

export const emailTemplates = pgTable("email_templates", {
  key: text("key").primaryKey(),
  subject: text("subject").notNull(),
  bodyHtml: text("body_html").notNull(),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

/** Single-row settings table (id is always 1). */
export const siteEmailSettings = pgTable("site_email_settings", {
  id: integer("id").primaryKey().default(1),
  businessEmail: text("business_email"),
  fromName: text("from_name"),
  smtpHost: text("smtp_host"),
  smtpPort: integer("smtp_port"),
  smtpSecure: boolean("smtp_secure"),
  smtpUser: text("smtp_user"),
  /** AES-256-GCM ciphertext, never returned to the browser. */
  smtpPasswordEnc: text("smtp_password_enc"),
  notifyNewEnquiry: boolean("notify_new_enquiry").notNull().default(true),
  notifyCustomerConfirmation: boolean("notify_customer_confirmation").notNull().default(true),
  notifyEmailFailure: boolean("notify_email_failure").notNull().default(true),
  savedFiltersSeeded: boolean("saved_filters_seeded").notNull().default(false),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

export const schema = {
  admins,
  sessions,
  passwordResetTokens,
  rateLimits,
  customers,
  enquiryCounters,
  enquiries,
  messages,
  emailDrafts,
  attachments,
  attachmentBlobs,
  internalNotes,
  followUps,
  activityLogs,
  notifications,
  savedFilters,
  emailLogs,
  emailTemplates,
  siteEmailSettings,
};
