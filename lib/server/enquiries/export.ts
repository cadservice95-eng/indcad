import { desc, sql } from "drizzle-orm";
import { enquiries, getDb } from "../db";
import { formatDateTime } from "../time";
import { logActivity } from "./activity";
import { buildOrder, buildWhere, type EnquiryFilters } from "./filters";

export const EXPORT_ROW_LIMIT = 20_000;

/**
 * Escapes one CSV cell. Values that start with a formula character are prefixed
 * with an apostrophe so spreadsheet software shows them as text instead of
 * executing them (CSV / formula injection).
 */
export function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let text = value instanceof Date ? value.toISOString() : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(header: string[], rows: unknown[][]): string {
  const lines = [header.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))];
  // BOM so Excel opens UTF-8 (₹, accented names) correctly.
  return `﻿${lines.join("\r\n")}\r\n`;
}

const HEADER = [
  "Reference",
  "Type",
  "Status",
  "Priority",
  "Name",
  "Company",
  "Email",
  "Phone",
  "Country",
  "City",
  "Service",
  "Project type",
  "Timeline",
  "Budget",
  "Currency",
  "Preferred contact",
  "Source",
  "Landing page",
  "Referrer",
  "UTM source",
  "UTM medium",
  "UTM campaign",
  "Subject",
  "Message",
  "Messages",
  "Attachments",
  "Read",
  "Created",
  "Last contacted",
  "Last customer reply",
  "Next follow-up",
  "Closed",
  "Archived",
];

/** Exports whatever the enquiry list is currently showing (same filters). Never includes login/session data. */
export async function exportEnquiriesCsv(filters: EnquiryFilters): Promise<{ csv: string; count: number; truncated: boolean }> {
  const db = await getDb();
  const rows = await db
    .select({
      enquiry: enquiries,
      // Written with an explicit qualifier: drizzle unqualifies columns in single-table select lists.
      attachmentCount: sql<number>`(select count(*)::int from attachments a where a.enquiry_id = "enquiries"."id" and a.draft_id is null)`,
    })
    .from(enquiries)
    .where(buildWhere(filters))
    .orderBy(...(filters.sort ? buildOrder(filters.sort) : [desc(enquiries.createdAt)]))
    .limit(EXPORT_ROW_LIMIT + 1);

  const truncated = rows.length > EXPORT_ROW_LIMIT;
  const kept = truncated ? rows.slice(0, EXPORT_ROW_LIMIT) : rows;
  const csv = toCsv(
    HEADER,
    kept.map(({ enquiry: e, attachmentCount }) => [
      e.referenceNumber,
      e.type,
      e.status,
      e.priority,
      e.name,
      e.company,
      e.email,
      e.phone,
      e.country,
      e.city,
      e.service,
      e.projectType,
      e.timeline,
      e.budget,
      e.currency,
      e.preferredContactMethod,
      e.source,
      e.landingPage,
      e.referrer,
      e.utmSource,
      e.utmMedium,
      e.utmCampaign,
      e.subject,
      e.projectDescription,
      e.messageCount,
      attachmentCount,
      e.isRead ? "yes" : "no",
      formatDateTime(e.createdAt),
      formatDateTime(e.lastContactedAt),
      formatDateTime(e.lastCustomerReplyAt),
      formatDateTime(e.nextFollowUpAt),
      formatDateTime(e.closedAt),
      formatDateTime(e.archivedAt),
    ]),
  );
  await logActivity(db, {
    action: "EXPORT_DOWNLOADED",
    description: `Exported ${kept.length} enquir${kept.length === 1 ? "y" : "ies"} to CSV`,
    actor: "ADMIN",
    metadata: { count: kept.length, truncated },
  });
  return { csv, count: kept.length, truncated };
}
