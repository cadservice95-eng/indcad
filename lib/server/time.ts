import { env } from "./env";

/**
 * Time-zone aware helpers (no dependency). The admin timezone drives day
 * boundaries, reference-number years and how dates are displayed.
 */

type Parts = { y: number; m: number; d: number; h: number; mi: number; s: number };

const formatters = new Map<string, Intl.DateTimeFormat>();

function partsOf(at: Date, timeZone: string): Parts {
  let fmt = formatters.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    formatters.set(timeZone, fmt);
  }
  const out: Record<string, number> = {};
  for (const part of fmt.formatToParts(at)) {
    if (part.type !== "literal") out[part.type] = Number(part.value);
  }
  return { y: out.year, m: out.month, d: out.day, h: out.hour, mi: out.minute, s: out.second };
}

function offsetMs(at: Date, timeZone: string): number {
  const p = partsOf(at, timeZone);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - Math.floor(at.getTime() / 1000) * 1000;
}

/** Converts a wall-clock time in `timeZone` to the matching UTC instant. */
export function zonedToUtc(y: number, m: number, d: number, h = 0, mi = 0, timeZone = env.timezone): Date {
  const guess = Date.UTC(y, m - 1, d, h, mi);
  let t = guess - offsetMs(new Date(guess), timeZone);
  t = guess - offsetMs(new Date(t), timeZone);
  return new Date(t);
}

export function startOfDay(at: Date, timeZone = env.timezone): Date {
  const p = partsOf(at, timeZone);
  return zonedToUtc(p.y, p.m, p.d, 0, 0, timeZone);
}

export function addDays(at: Date, days: number, timeZone = env.timezone): Date {
  const p = partsOf(at, timeZone);
  const shifted = new Date(Date.UTC(p.y, p.m - 1, p.d + days));
  return zonedToUtc(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, shifted.getUTCDate(), 0, 0, timeZone);
}

export function yearOf(at: Date, timeZone = env.timezone): number {
  return partsOf(at, timeZone).y;
}

export const RANGE_PRESETS = ["today", "yesterday", "last7", "last30", "month", "all", "custom"] as const;
export type RangePreset = (typeof RANGE_PRESETS)[number];

export type DateRange = { from: Date | null; to: Date | null; preset: RangePreset; label: string };

/** `to` is exclusive. Custom bounds are calendar dates (YYYY-MM-DD) in the admin timezone, inclusive. */
export function resolveRange(preset: RangePreset, fromDate?: string, toDate?: string, now = new Date()): DateRange {
  const today = startOfDay(now);
  switch (preset) {
    case "today":
      return { from: today, to: addDays(today, 1), preset, label: "Today" };
    case "yesterday":
      return { from: addDays(today, -1), to: today, preset, label: "Yesterday" };
    case "last7":
      return { from: addDays(today, -6), to: addDays(today, 1), preset, label: "Last 7 days" };
    case "last30":
      return { from: addDays(today, -29), to: addDays(today, 1), preset, label: "Last 30 days" };
    case "month": {
      const p = partsOf(now, env.timezone);
      const start = zonedToUtc(p.y, p.m, 1);
      const next = zonedToUtc(p.m === 12 ? p.y + 1 : p.y, p.m === 12 ? 1 : p.m + 1, 1);
      return { from: start, to: next, preset, label: "This month" };
    }
    case "custom": {
      const from = parseDateOnly(fromDate);
      const to = parseDateOnly(toDate);
      if (from && to) {
        return { from, to: addDays(to, 1), preset, label: `${fromDate} to ${toDate}` };
      }
      return { from: null, to: null, preset: "all", label: "All time" };
    }
    default:
      return { from: null, to: null, preset: "all", label: "All time" };
  }
}

export function parseDateOnly(value?: string | null): Date | null {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return zonedToUtc(Number(match[1]), Number(match[2]), Number(match[3]));
}

/** Parses `YYYY-MM-DDTHH:mm` (datetime-local input) as a wall-clock time in the admin timezone. */
export function parseLocalDateTime(value: string): Date | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (!match) return null;
  const date = zonedToUtc(Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4]), Number(match[5]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toLocalInputValue(at: Date): string {
  const p = partsOf(at, env.timezone);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p.y}-${pad(p.m)}-${pad(p.d)}T${pad(p.h)}:${pad(p.mi)}`;
}

export function dayKey(at: Date, timeZone = env.timezone): string {
  const p = partsOf(at, timeZone);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
}

export function formatDateTime(at: Date | string | null | undefined): string {
  if (!at) return "—";
  const date = typeof at === "string" ? new Date(at) : at;
  return new Intl.DateTimeFormat("en-IN", { timeZone: env.timezone, day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

export function formatDate(at: Date | string | null | undefined): string {
  if (!at) return "—";
  const date = typeof at === "string" ? new Date(at) : at;
  return new Intl.DateTimeFormat("en-IN", { timeZone: env.timezone, day: "numeric", month: "short", year: "numeric" }).format(date);
}
