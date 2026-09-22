import { sql } from "drizzle-orm";
import { enquiryCounters, type DbOrTx } from "../db";
import { yearOf } from "../time";

export const REFERENCE_PATTERN = /RCH-\d{4}-\d{6}/i;

export function formatReference(year: number, value: number) {
  return `RCH-${year}-${String(value).padStart(6, "0")}`;
}

/**
 * Atomic per-year counter. Two simultaneous submissions can never receive the
 * same number: the increment is a single upsert, and reference_number is also
 * protected by a unique index.
 */
export async function nextReferenceNumber(db: DbOrTx, now = new Date()): Promise<string> {
  const year = yearOf(now);
  const [row] = await db
    .insert(enquiryCounters)
    .values({ year, value: 1 })
    .onConflictDoUpdate({ target: enquiryCounters.year, set: { value: sql`${enquiryCounters.value} + 1` } })
    .returning({ value: enquiryCounters.value });
  return formatReference(year, row.value);
}
