/**
 * First-touch attribution for the public forms. Captured once per browsing
 * session (sessionStorage, no cookies) so a lead can be traced back to the page
 * they first landed on and the campaign that sent them.
 */

const KEY = "rch_attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type Attribution = {
  landing_page: string;
  referrer: string;
} & Partial<Record<(typeof UTM_KEYS)[number], string>>;

function readStored(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

/** Call on every page view; only the first page of the session (or a page carrying UTM tags) is recorded. */
export function captureAttribution(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Partial<Record<(typeof UTM_KEYS)[number], string>> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) utm[key] = value.slice(0, 150);
    }
    const hasUtm = Object.keys(utm).length > 0;
    if (readStored() && !hasUtm) return;

    let referrer = "";
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.host !== window.location.host) referrer = ref.href.slice(0, 500);
    } catch {
      referrer = "";
    }
    const previous = readStored();
    const next: Attribution = previous
      ? { ...previous, ...utm }
      : { landing_page: `${window.location.pathname}${window.location.search}`.slice(0, 500), referrer, ...utm };
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode); attribution is best-effort.
  }
}

/** Adds attribution + anti-spam fields to a form submission. */
export function appendFormMetadata(formData: FormData, renderedAt: number): void {
  formData.set("form_ts", String(renderedAt));
  const stored = readStored();
  const current = stored ?? { landing_page: `${window.location.pathname}${window.location.search}`, referrer: "" };
  for (const [key, value] of Object.entries(current)) {
    if (value) formData.set(key, value);
  }
}
