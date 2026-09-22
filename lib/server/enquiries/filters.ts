import { and, asc, desc, eq, exists, gte, ilike, inArray, isNotNull, isNull, lt, lte, or, sql, type SQL } from "drizzle-orm";
import { z } from "zod";
import { emailLogs, enquiries, ENQUIRY_PRIORITIES, ENQUIRY_SOURCES, ENQUIRY_STATUSES, ENQUIRY_TYPES, messages } from "../db";
import { addDays, RANGE_PRESETS, resolveRange, startOfDay } from "../time";

const csv = <T extends z.ZodType<string, string>>(item: T) =>
  z
    .union([z.string(), z.array(z.string())])
    .transform((value) => (Array.isArray(value) ? value : value.split(",")).map((v) => v.trim()).filter(Boolean))
    .pipe(z.array(item));

const flag = z.union([z.literal("1"), z.literal("true"), z.literal("0"), z.literal("false")]).transform((v) => v === "1" || v === "true");

export const VIEWS = ["active", "archived", "trash"] as const;
export const SORTS = ["newest", "oldest", "priority", "follow_up", "activity"] as const;
export const FOLLOW_UP_FILTERS = ["due", "overdue", "today", "upcoming", "any"] as const;

export const enquiryFilterSchema = z.object({
  q: z.string().trim().max(200).optional(),
  type: z.enum(ENQUIRY_TYPES).optional(),
  status: csv(z.enum(ENQUIRY_STATUSES)).optional(),
  priority: csv(z.enum(ENQUIRY_PRIORITIES)).optional(),
  source: z.enum(ENQUIRY_SOURCES).optional(),
  service: z.string().trim().max(120).optional(),
  country: z.string().trim().max(120).optional(),
  range: z.enum(RANGE_PRESETS).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  followUp: z.enum(FOLLOW_UP_FILTERS).optional(),
  unread: flag.optional(),
  emailFailed: flag.optional(),
  /** "reply" = customer is waiting for us; "customer" = we are waiting for the customer. */
  awaiting: z.enum(["reply", "customer"]).optional(),
  view: z.enum(VIEWS).optional(),
  ids: csv(z.uuid()).optional(),
  sort: z.enum(SORTS).optional(),
  page: z.coerce.number().int().min(1).max(10_000).optional(),
  pageSize: z.coerce.number().int().min(5).max(100).optional(),
});

export type EnquiryFilters = z.infer<typeof enquiryFilterSchema>;

const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

export function buildWhere(filters: EnquiryFilters, now = new Date()): SQL | undefined {
  const conditions: (SQL | undefined)[] = [];

  const view = filters.view ?? "active";
  if (view === "trash") conditions.push(isNotNull(enquiries.deletedAt));
  else {
    conditions.push(isNull(enquiries.deletedAt));
    conditions.push(view === "archived" ? isNotNull(enquiries.archivedAt) : isNull(enquiries.archivedAt));
  }

  if (filters.type) conditions.push(eq(enquiries.type, filters.type));
  if (filters.status?.length) conditions.push(inArray(enquiries.status, filters.status));
  if (filters.priority?.length) conditions.push(inArray(enquiries.priority, filters.priority));
  if (filters.source) conditions.push(eq(enquiries.source, filters.source));
  if (filters.service) conditions.push(ilike(enquiries.service, `%${escapeLike(filters.service)}%`));
  if (filters.country) conditions.push(ilike(enquiries.country, `%${escapeLike(filters.country)}%`));
  if (filters.ids?.length) conditions.push(inArray(enquiries.id, filters.ids));
  if (filters.unread) conditions.push(eq(enquiries.isRead, false));

  if (filters.range) {
    const range = resolveRange(filters.range, filters.from, filters.to, now);
    if (range.from) conditions.push(gte(enquiries.createdAt, range.from));
    if (range.to) conditions.push(lt(enquiries.createdAt, range.to));
  }

  if (filters.awaiting === "reply") conditions.push(eq(enquiries.lastMessageDirection, "INBOUND"));
  if (filters.awaiting === "customer") conditions.push(eq(enquiries.lastMessageDirection, "OUTBOUND"));

  if (filters.followUp) {
    const today = startOfDay(now);
    const tomorrow = addDays(today, 1);
    if (filters.followUp === "any") conditions.push(isNotNull(enquiries.nextFollowUpAt));
    if (filters.followUp === "due") conditions.push(lte(enquiries.nextFollowUpAt, now));
    if (filters.followUp === "overdue") conditions.push(lt(enquiries.nextFollowUpAt, today));
    if (filters.followUp === "today") conditions.push(and(gte(enquiries.nextFollowUpAt, today), lt(enquiries.nextFollowUpAt, tomorrow)));
    if (filters.followUp === "upcoming") conditions.push(gte(enquiries.nextFollowUpAt, tomorrow));
  }

  if (filters.emailFailed) {
    conditions.push(exists(sql`(select 1 from ${emailLogs} where ${emailLogs.enquiryId} = ${enquiries.id} and ${emailLogs.status} = 'FAILED')`));
  }

  if (filters.q) {
    const like = `%${escapeLike(filters.q)}%`;
    conditions.push(
      or(
        ilike(enquiries.referenceNumber, like),
        ilike(enquiries.name, like),
        ilike(enquiries.email, like),
        ilike(enquiries.phone, like),
        ilike(enquiries.company, like),
        ilike(enquiries.service, like),
        ilike(enquiries.subject, like),
        ilike(enquiries.projectDescription, like),
        exists(sql`(select 1 from ${messages} where ${messages.enquiryId} = ${enquiries.id} and ${messages.bodyText} ilike ${like})`),
      ),
    );
  }

  const defined = conditions.filter((c): c is SQL => c !== undefined);
  return defined.length ? and(...defined) : undefined;
}

export function buildOrder(sort: EnquiryFilters["sort"]) {
  switch (sort) {
    case "oldest":
      return [asc(enquiries.createdAt)];
    case "priority":
      return [desc(enquiries.priority), desc(enquiries.createdAt)];
    case "follow_up":
      return [sql`${enquiries.nextFollowUpAt} asc nulls last`, desc(enquiries.createdAt)];
    case "activity":
      return [desc(sql`coalesce(${enquiries.lastMessageAt}, ${enquiries.createdAt})`)];
    default:
      return [desc(enquiries.createdAt)];
  }
}
