CREATE TYPE "public"."email_status" AS ENUM('QUEUED', 'SENDING', 'SENT', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."enquiry_priority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');--> statement-breakpoint
CREATE TYPE "public"."enquiry_source" AS ENUM('QUOTE_FORM', 'CONTACT_FORM', 'WEBSITE', 'DIRECT');--> statement-breakpoint
CREATE TYPE "public"."enquiry_status" AS ENUM('NEW', 'IN_REVIEW', 'CONTACTED', 'AWAITING_CUSTOMER', 'QUOTED', 'FOLLOW_UP', 'WON', 'LOST', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."enquiry_type" AS ENUM('QUOTE_REQUEST', 'CONTACT_MESSAGE');--> statement-breakpoint
CREATE TYPE "public"."message_direction" AS ENUM('INBOUND', 'OUTBOUND');--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"enquiry_id" uuid,
	"reference_number" text,
	"action" text NOT NULL,
	"description" text NOT NULL,
	"actor" text DEFAULT 'SYSTEM' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text DEFAULT 'Admin' NOT NULL,
	"password_hash" text NOT NULL,
	"must_change_password" boolean DEFAULT false NOT NULL,
	"last_login_at" timestamp with time zone,
	"password_changed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "attachment_blobs" (
	"attachment_id" uuid PRIMARY KEY NOT NULL,
	"data" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"message_id" uuid,
	"draft_id" uuid,
	"filename" text NOT NULL,
	"original_filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"storage_key" text NOT NULL,
	"url" text NOT NULL,
	"uploaded_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"company" text,
	"phone" text,
	"country" text,
	"city" text,
	"website" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"to_email" text,
	"cc" text,
	"subject" text DEFAULT '' NOT NULL,
	"body_html" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid,
	"message_row_id" uuid,
	"recipient" text NOT NULL,
	"cc" text,
	"bcc" text,
	"sender" text NOT NULL,
	"subject" text NOT NULL,
	"template" text,
	"message_id" text,
	"status" "email_status" DEFAULT 'QUEUED' NOT NULL,
	"provider_response" text,
	"error_message" text,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"last_attempt_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"key" text PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"body_html" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_number" text NOT NULL,
	"type" "enquiry_type" NOT NULL,
	"customer_id" uuid NOT NULL,
	"name" text NOT NULL,
	"company" text,
	"email" text NOT NULL,
	"phone" text,
	"country" text,
	"city" text,
	"website" text,
	"subject" text NOT NULL,
	"service" text,
	"project_type" text,
	"project_description" text NOT NULL,
	"timeline" text,
	"budget" text,
	"currency" text,
	"preferred_contact_method" text,
	"status" "enquiry_status" DEFAULT 'NEW' NOT NULL,
	"priority" "enquiry_priority" DEFAULT 'NORMAL' NOT NULL,
	"source" "enquiry_source" NOT NULL,
	"landing_page" text,
	"referrer" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_term" text,
	"utm_content" text,
	"ip_address" text,
	"user_agent" text,
	"submission_hash" text,
	"assigned_admin_id" uuid,
	"is_read" boolean DEFAULT false NOT NULL,
	"last_message_at" timestamp with time zone,
	"last_message_direction" "message_direction",
	"message_count" integer DEFAULT 0 NOT NULL,
	"last_contacted_at" timestamp with time zone,
	"last_customer_reply_at" timestamp with time zone,
	"next_follow_up_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiry_counters" (
	"year" integer PRIMARY KEY NOT NULL,
	"value" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "follow_ups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"note" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "internal_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enquiry_id" uuid NOT NULL,
	"direction" "message_direction" NOT NULL,
	"sender_name" text,
	"sender_email" text NOT NULL,
	"recipient_email" text NOT NULL,
	"cc" text,
	"subject" text NOT NULL,
	"body_html" text,
	"body_text" text NOT NULL,
	"message_id" text,
	"in_reply_to" text,
	"message_references" text,
	"status" text DEFAULT 'RECEIVED' NOT NULL,
	"sent_at" timestamp with time zone,
	"received_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"enquiry_id" uuid,
	"reference_number" text,
	"dedupe_key" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"requested_ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"window_start" timestamp with time zone DEFAULT now() NOT NULL,
	"blocked_until" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "saved_filters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"query" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "site_email_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"business_email" text,
	"from_name" text,
	"smtp_host" text,
	"smtp_port" integer,
	"smtp_secure" boolean,
	"smtp_user" text,
	"smtp_password_enc" text,
	"notify_new_enquiry" boolean DEFAULT true NOT NULL,
	"notify_customer_confirmation" boolean DEFAULT true NOT NULL,
	"notify_email_failure" boolean DEFAULT true NOT NULL,
	"saved_filters_seeded" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachment_blobs" ADD CONSTRAINT "attachment_blobs_attachment_id_attachments_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_draft_id_email_drafts_id_fk" FOREIGN KEY ("draft_id") REFERENCES "public"."email_drafts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_drafts" ADD CONSTRAINT "email_drafts_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_message_row_id_messages_id_fk" FOREIGN KEY ("message_row_id") REFERENCES "public"."messages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_admin_id_admins_id_fk" FOREIGN KEY ("assigned_admin_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internal_notes" ADD CONSTRAINT "internal_notes_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_enquiry_idx" ON "activity_logs" USING btree ("enquiry_id","created_at");--> statement-breakpoint
CREATE INDEX "activity_created_idx" ON "activity_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "attachments_enquiry_idx" ON "attachments" USING btree ("enquiry_id");--> statement-breakpoint
CREATE INDEX "attachments_message_idx" ON "attachments" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "attachments_draft_idx" ON "attachments" USING btree ("draft_id");--> statement-breakpoint
CREATE UNIQUE INDEX "customers_email_uq" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "drafts_enquiry_idx" ON "email_drafts" USING btree ("enquiry_id");--> statement-breakpoint
CREATE INDEX "email_logs_enquiry_idx" ON "email_logs" USING btree ("enquiry_id");--> statement-breakpoint
CREATE INDEX "email_logs_status_idx" ON "email_logs" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "email_logs_message_id_idx" ON "email_logs" USING btree ("message_id");--> statement-breakpoint
CREATE UNIQUE INDEX "enquiries_reference_uq" ON "enquiries" USING btree ("reference_number");--> statement-breakpoint
CREATE INDEX "enquiries_email_idx" ON "enquiries" USING btree ("email");--> statement-breakpoint
CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "enquiries_priority_idx" ON "enquiries" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "enquiries_created_idx" ON "enquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "enquiries_follow_up_idx" ON "enquiries" USING btree ("next_follow_up_at");--> statement-breakpoint
CREATE INDEX "enquiries_customer_idx" ON "enquiries" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "enquiries_submission_hash_idx" ON "enquiries" USING btree ("submission_hash");--> statement-breakpoint
CREATE INDEX "follow_ups_enquiry_idx" ON "follow_ups" USING btree ("enquiry_id");--> statement-breakpoint
CREATE INDEX "follow_ups_due_idx" ON "follow_ups" USING btree ("due_at");--> statement-breakpoint
CREATE INDEX "notes_enquiry_idx" ON "internal_notes" USING btree ("enquiry_id");--> statement-breakpoint
CREATE INDEX "messages_enquiry_idx" ON "messages" USING btree ("enquiry_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "messages_message_id_uq" ON "messages" USING btree ("message_id") WHERE "messages"."message_id" is not null;--> statement-breakpoint
CREATE INDEX "notifications_read_idx" ON "notifications" USING btree ("is_read","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "notifications_dedupe_uq" ON "notifications" USING btree ("dedupe_key") WHERE "notifications"."dedupe_key" is not null;--> statement-breakpoint
CREATE INDEX "prt_admin_idx" ON "password_reset_tokens" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "sessions_admin_idx" ON "sessions" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_idx" ON "sessions" USING btree ("expires_at");