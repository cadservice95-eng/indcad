import { enquiryFilterSchema, type EnquiryFilters } from "./filters";

export type RawSearchParams = Record<string, string | string[] | undefined>;

/**
 * Turns Next.js searchParams into validated enquiry filters. Invalid values are
 * dropped (rather than erroring) so a stale bookmark still opens the page.
 */
export function parsePageFilters(raw: RawSearchParams, defaults: Partial<EnquiryFilters> = {}): { filters: EnquiryFilters; values: Record<string, string> } {
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    const text = Array.isArray(value) ? value.join(",") : value;
    if (text) flat[key] = text;
  }
  // Drop keys one at a time until the rest validates.
  let candidate = { ...flat };
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const result = enquiryFilterSchema.safeParse(candidate);
    if (result.success) return { filters: { ...defaults, ...result.data }, values: candidate };
    const bad = new Set(result.error.issues.map((issue) => String(issue.path[0])));
    candidate = Object.fromEntries(Object.entries(candidate).filter(([key]) => !bad.has(key)));
  }
  return { filters: { ...defaults }, values: {} };
}
