import { sql } from "drizzle-orm";
import { getDb } from "../db";

export type RateLimitResult = { allowed: boolean; count: number; retryAfterSeconds: number };

export function rowsOf<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[];
  const rows = (result as { rows?: T[] } | null)?.rows;
  return rows ?? [];
}

/**
 * Fixed-window counter stored in Postgres so limits are shared by every
 * serverless instance. Each call counts as one hit.
 */
export async function hitRateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const db = await getDb();
  const result = await db.execute(sql`
    insert into rate_limits (key, count, window_start) values (${key}, 1, now())
    on conflict (key) do update set
      count = case when rate_limits.window_start < now() - make_interval(secs => ${windowSeconds}::double precision) then 1 else rate_limits.count + 1 end,
      window_start = case when rate_limits.window_start < now() - make_interval(secs => ${windowSeconds}::double precision) then now() else rate_limits.window_start end
    returning count, greatest(1, ceil(extract(epoch from (window_start + make_interval(secs => ${windowSeconds}::double precision) - now()))))::int as retry_after
  `);
  const row = rowsOf<{ count: number; retry_after: number }>(result)[0];
  const count = Number(row?.count ?? 1);
  return { allowed: count <= limit, count, retryAfterSeconds: Number(row?.retry_after ?? windowSeconds) };
}

/** Read a counter without incrementing it (used to pre-check login lockouts). */
export async function peekRateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const db = await getDb();
  const result = await db.execute(sql`
    select count, greatest(1, ceil(extract(epoch from (window_start + make_interval(secs => ${windowSeconds}::double precision) - now()))))::int as retry_after
    from rate_limits
    where key = ${key} and window_start >= now() - make_interval(secs => ${windowSeconds}::double precision)
  `);
  const row = rowsOf<{ count: number; retry_after: number }>(result)[0];
  if (!row) return { allowed: true, count: 0, retryAfterSeconds: 0 };
  const count = Number(row.count);
  return { allowed: count < limit, count, retryAfterSeconds: Number(row.retry_after) };
}

export async function resetRateLimit(key: string): Promise<void> {
  const db = await getDb();
  await db.execute(sql`delete from rate_limits where key = ${key}`);
}

/** Housekeeping: drop expired counters. Cheap, safe to call opportunistically. */
export async function pruneRateLimits(): Promise<void> {
  const db = await getDb();
  await db.execute(sql`delete from rate_limits where window_start < now() - interval '2 days'`);
}
