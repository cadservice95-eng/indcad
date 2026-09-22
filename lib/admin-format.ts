/**
 * Client-safe date formatting for the admin. Every function takes the admin
 * timezone explicitly (it comes from the server's ADMIN_TIMEZONE setting) so
 * server- and client-rendered dates always agree.
 */

export const DEFAULT_TIMEZONE = "Asia/Kolkata";

type DateInput = Date | string | number | null | undefined;

function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(value: DateInput, timeZone = DEFAULT_TIMEZONE): string {
  const date = toDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", { timeZone, day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

export function formatDate(value: DateInput, timeZone = DEFAULT_TIMEZONE): string {
  const date = toDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", { timeZone, day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function timeAgo(value: DateInput, now = Date.now()): string {
  const date = toDate(value);
  if (!date) return "—";
  const seconds = Math.round((now - date.getTime()) / 1000);
  const abs = Math.abs(seconds);
  const suffix = seconds >= 0 ? "ago" : "from now";
  if (abs < 45) return seconds >= 0 ? "just now" : "in a moment";
  if (abs < 3600) return `${Math.round(abs / 60)} min ${suffix}`;
  if (abs < 86_400) return `${Math.round(abs / 3600)} h ${suffix}`;
  if (abs < 30 * 86_400) return `${Math.round(abs / 86_400)} d ${suffix}`;
  return formatDate(date);
}

function parts(date: Date, timeZone: string) {
  const map: Record<string, number> = {};
  for (const p of new Intl.DateTimeFormat("en-GB", { timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(date)) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  return map as { year: number; month: number; day: number; hour: number; minute: number };
}

/** `YYYY-MM-DDTHH:mm` in the given timezone, the format a datetime-local input expects. */
export function toLocalInput(date: Date, timeZone = DEFAULT_TIMEZONE): string {
  const p = parts(date, timeZone);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

/** A datetime-local default such as "tomorrow at 10:00" in the admin timezone. */
export function defaultFollowUp(daysAhead: number, hour = 10, timeZone = DEFAULT_TIMEZONE, now = new Date()): string {
  const target = new Date(now.getTime() + daysAhead * 86_400_000);
  const p = parts(target, timeZone);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(hour)}:00`;
}

export function initials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "");
  return letters.join("") || "?";
}
