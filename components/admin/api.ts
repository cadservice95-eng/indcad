"use client";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string; code?: string; status: number };

type Options = { method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"; json?: unknown; form?: FormData };

/**
 * fetch wrapper for the admin API. Always resolves (never throws), turns
 * non-JSON platform errors into readable messages and sends an expired session
 * back to the login page.
 */
export async function api<T = Record<string, unknown>>(url: string, options: Options = {}): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      method: options.method ?? (options.json !== undefined || options.form ? "POST" : "GET"),
      headers: options.json !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: options.form ?? (options.json !== undefined ? JSON.stringify(options.json) : undefined),
      credentials: "same-origin",
    });
    const isJson = response.headers.get("content-type")?.includes("application/json");
    if (!isJson) {
      if (response.status === 413) return { ok: false, status: 413, error: "The upload is too large for the server. Try fewer or smaller attachments." };
      return { ok: false, status: response.status, error: `Unexpected response from the server (${response.status}).` };
    }
    const data = (await response.json()) as T & { ok?: boolean; error?: string; code?: string };
    // A full page load (not a client-side push) on purpose: an expired session must drop all in-memory state.
    if (response.status === 401 && typeof window !== "undefined") {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/admin/login/?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    }
    if (response.status === 403 && data.code === "PASSWORD_CHANGE_REQUIRED" && typeof window !== "undefined") {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/admin/change-password/";
    }
    if (!response.ok || data.ok === false) return { ok: false, status: response.status, error: data.error ?? "Something went wrong.", code: data.code };
    return { ok: true, data };
  } catch {
    return { ok: false, status: 0, error: "Could not reach the server. Check your connection and try again." };
  }
}

/** Serialises filters into a query string, skipping empty values. */
export function toQuery(values: Record<string, string | number | boolean | undefined | null | string[]>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === "" || value === false) continue;
    params.set(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  return params.toString();
}
