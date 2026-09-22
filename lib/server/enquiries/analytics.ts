import { and, desc, eq, gte, isNull, lt, notInArray, sql, type SQL } from "drizzle-orm";
import { CLOSED_STATUSES } from "@/lib/enquiry-meta";
import { emailLogs, enquiries, ENQUIRY_STATUSES, getDb } from "../db";
import { env } from "../env";
import { addDays, dayKey, resolveRange, startOfDay, type RangePreset } from "../time";
import { listFollowUps } from "./queries";

export type SeriesPoint = { key: string; label: string; quotes: number; contacts: number; total: number };
export type CountRow = { name: string; count: number };

export type DashboardData = {
  range: { preset: RangePreset; label: string; from: string | null; to: string | null };
  cards: {
    total: number;
    previousTotal: number | null;
    quotes: number;
    contacts: number;
    replied: number;
    awaitingReply: number;
    won: number;
    /** Current-state cards ignore the date range. */
    unread: number;
    followUpsDue: number;
    failedEmails: number;
  };
  series: { bucket: "day" | "month"; points: SeriesPoint[] };
  byStatus: { status: string; count: number }[];
  byService: CountRow[];
  bySource: CountRow[];
  byChannel: CountRow[];
  byCampaign: CountRow[];
  recent: {
    id: string;
    referenceNumber: string;
    name: string;
    service: string | null;
    status: string;
    priority: string;
    type: string;
    isRead: boolean;
    createdAt: string;
  }[];
  followUps: { id: string; enquiryId: string; referenceNumber: string; name: string; dueAt: string; overdue: boolean; note: string | null }[];
};

const MAX_DAILY_POINTS = 92;

function monthKey(at: Date): string {
  return dayKey(at).slice(0, 7);
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", { month: "short", year: "2-digit", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, 1)));
}

function dayLabel(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Every bucket key between two instants, so days with zero enquiries still appear on the chart. */
function bucketKeys(from: Date, to: Date, bucket: "day" | "month"): string[] {
  const keys: string[] = [];
  if (bucket === "day") {
    for (let cursor = startOfDay(from); cursor < to && keys.length <= 400; cursor = addDays(cursor, 1)) keys.push(dayKey(cursor));
    return keys;
  }
  const [startY, startM] = monthKey(from).split("-").map(Number);
  const [endY, endM] = monthKey(new Date(to.getTime() - 1)).split("-").map(Number);
  for (let y = startY, m = startM; y < endY || (y === endY && m <= endM); m === 12 ? ((m = 1), (y += 1)) : (m += 1)) {
    keys.push(`${y}-${String(m).padStart(2, "0")}`);
  }
  return keys;
}

const num = (value: unknown) => Number(value ?? 0);

export async function getDashboard(options: { preset?: RangePreset; from?: string; to?: string; now?: Date } = {}): Promise<DashboardData> {
  const db = await getDb();
  const now = options.now ?? new Date();
  const range = resolveRange(options.preset ?? "last30", options.from, options.to, now);
  const tz = env.timezone;

  const notDeleted = isNull(enquiries.deletedAt);
  const inRange: SQL[] = [notDeleted];
  if (range.from) inRange.push(gte(enquiries.createdAt, range.from));
  if (range.to) inRange.push(lt(enquiries.createdAt, range.to));
  const rangeWhere = and(...inRange);

  // Work-in-progress cards only look at enquiries that are still open and not archived.
  const openWork = and(isNull(enquiries.archivedAt), notInArray(enquiries.status, [...CLOSED_STATUSES]));

  const [cards] = await db
    .select({
      total: sql<number>`count(*)::int`,
      quotes: sql<number>`count(*) filter (where ${enquiries.type} = 'QUOTE_REQUEST')::int`,
      contacts: sql<number>`count(*) filter (where ${enquiries.type} = 'CONTACT_MESSAGE')::int`,
      replied: sql<number>`count(*) filter (where ${enquiries.lastMessageDirection} = 'OUTBOUND' and ${openWork})::int`,
      awaitingReply: sql<number>`count(*) filter (where ${enquiries.lastMessageDirection} = 'INBOUND' and ${openWork})::int`,
      won: sql<number>`count(*) filter (where ${enquiries.status} = 'WON')::int`,
    })
    .from(enquiries)
    .where(rangeWhere);

  let previousTotal: number | null = null;
  if (range.from && range.to) {
    const span = range.to.getTime() - range.from.getTime();
    const [previous] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(enquiries)
      .where(and(notDeleted, gte(enquiries.createdAt, new Date(range.from.getTime() - span)), lt(enquiries.createdAt, range.from)));
    previousTotal = num(previous?.n);
  }

  const [unreadRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(enquiries)
    .where(and(notDeleted, isNull(enquiries.archivedAt), eq(enquiries.isRead, false)));
  const [dueRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(enquiries)
    .where(and(notDeleted, isNull(enquiries.archivedAt), sql`${enquiries.nextFollowUpAt} is not null and ${enquiries.nextFollowUpAt} <= ${now}`));
  const [failedRow] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(emailLogs)
    .where(eq(emailLogs.status, "FAILED"));

  // --- chart: enquiries over time ---
  let seriesFrom = range.from;
  if (!seriesFrom) {
    const [first] = await db.select({ at: sql<Date | null>`min(${enquiries.createdAt})` }).from(enquiries).where(notDeleted);
    seriesFrom = first?.at ? new Date(first.at) : addDays(startOfDay(now), -29);
  }
  const seriesTo = range.to ?? addDays(startOfDay(now), 1);
  const days = Math.ceil((seriesTo.getTime() - seriesFrom.getTime()) / 86_400_000);
  const bucket: "day" | "month" = days > MAX_DAILY_POINTS ? "month" : "day";
  const format = bucket === "day" ? "YYYY-MM-DD" : "YYYY-MM";

  const bucketExpr = sql<string>`to_char(${enquiries.createdAt} at time zone ${tz}, ${format}::text)`;
  const seriesRows = await db
    .select({
      key: bucketExpr,
      type: enquiries.type,
      n: sql<number>`count(*)::int`,
    })
    .from(enquiries)
    .where(and(notDeleted, gte(enquiries.createdAt, seriesFrom), lt(enquiries.createdAt, seriesTo)))
    .groupBy(sql`1`, sql`2`);

  const byKey = new Map<string, SeriesPoint>();
  for (const key of bucketKeys(seriesFrom, seriesTo, bucket)) {
    byKey.set(key, { key, label: bucket === "day" ? dayLabel(key) : monthLabel(key), quotes: 0, contacts: 0, total: 0 });
  }
  for (const row of seriesRows) {
    const point = byKey.get(row.key);
    if (!point) continue;
    if (row.type === "QUOTE_REQUEST") point.quotes += num(row.n);
    else point.contacts += num(row.n);
    point.total += num(row.n);
  }

  // --- distributions (date-range scoped) ---
  const statusRows = await db
    .select({ status: enquiries.status, n: sql<number>`count(*)::int` })
    .from(enquiries)
    .where(rangeWhere)
    .groupBy(enquiries.status);
  const statusCounts = new Map(statusRows.map((r) => [r.status as string, num(r.n)]));

  const topRows = async (expression: SQL<string>, extra?: SQL, limit = 8): Promise<CountRow[]> => {
    const rows = await db
      .select({ name: expression, n: sql<number>`count(*)::int` })
      .from(enquiries)
      .where(extra ? and(rangeWhere, extra) : rangeWhere)
      .groupBy(sql`1`)
      .orderBy(desc(sql`2`), sql`1`)
      .limit(limit);
    return rows.map((r) => ({ name: r.name, count: num(r.n) }));
  };

  const byService = await topRows(sql<string>`coalesce(nullif(trim(${enquiries.service}), ''), 'Not specified')`);
  const bySourceRows = await topRows(sql<string>`${enquiries.source}::text`, undefined, 10);
  const byChannel = await topRows(
    sql<string>`coalesce(nullif(trim(${enquiries.utmSource}), ''), nullif(regexp_replace(substring(${enquiries.referrer} from '^https?://([^/:?#]+)'), '^www[.]', ''), ''), 'Direct / unknown')`,
  );
  const byCampaign = await topRows(sql<string>`trim(${enquiries.utmCampaign})`, sql`nullif(trim(${enquiries.utmCampaign}), '') is not null`);

  const recent = await db
    .select({
      id: enquiries.id,
      referenceNumber: enquiries.referenceNumber,
      name: enquiries.name,
      service: enquiries.service,
      status: enquiries.status,
      priority: enquiries.priority,
      type: enquiries.type,
      isRead: enquiries.isRead,
      createdAt: enquiries.createdAt,
    })
    .from(enquiries)
    .where(and(notDeleted, isNull(enquiries.archivedAt)))
    .orderBy(desc(enquiries.createdAt))
    .limit(8);

  const [overdue, today] = await Promise.all([listFollowUps("overdue", now), listFollowUps("today", now)]);
  const dayStart = startOfDay(now);
  const followUps = [...overdue, ...today].slice(0, 8).map((f) => ({
    id: f.id,
    enquiryId: f.enquiryId,
    referenceNumber: f.referenceNumber,
    name: f.name,
    dueAt: f.dueAt.toISOString(),
    overdue: f.dueAt < dayStart,
    note: f.note,
  }));

  return {
    range: { preset: range.preset, label: range.label, from: range.from?.toISOString() ?? null, to: range.to?.toISOString() ?? null },
    cards: {
      total: num(cards?.total),
      previousTotal,
      quotes: num(cards?.quotes),
      contacts: num(cards?.contacts),
      replied: num(cards?.replied),
      awaitingReply: num(cards?.awaitingReply),
      won: num(cards?.won),
      unread: num(unreadRow?.n),
      followUpsDue: num(dueRow?.n),
      failedEmails: num(failedRow?.n),
    },
    series: { bucket, points: [...byKey.values()] },
    byStatus: ENQUIRY_STATUSES.map((status) => ({ status, count: statusCounts.get(status) ?? 0 })).filter((s) => s.count > 0),
    byService,
    bySource: bySourceRows,
    byChannel,
    byCampaign,
    recent: recent.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    followUps,
  };
}
