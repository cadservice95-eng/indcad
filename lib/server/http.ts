import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { DatabaseNotConfiguredError } from "./db";
import { errorMessage, log } from "./log";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: unknown,
    public headers?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: { "Cache-Control": "no-store", ...(init?.headers ?? {}) },
  });
}

export function ok<T extends Record<string, unknown>>(data?: T, init?: ResponseInit) {
  return json({ ok: true, ...(data ?? {}) }, init);
}

export function fail(status: number, message: string, extra?: { code?: string; details?: unknown; headers?: Record<string, string> }) {
  return json(
    { ok: false, error: message, ...(extra?.code ? { code: extra.code } : {}), ...(extra?.details ? { details: extra.details } : {}) },
    { status, headers: extra?.headers },
  );
}

/** Runs a handler and maps thrown errors to safe JSON responses. */
export async function guard(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError) {
      return fail(error.status, error.message, { code: error.code, details: error.details, headers: error.headers });
    }
    if (error instanceof DatabaseNotConfiguredError) {
      log.error("api.database_not_configured");
      return fail(503, "This service is temporarily unavailable. Please try again shortly.", { code: "UNAVAILABLE" });
    }
    log.error("api.unhandled_error", { error: errorMessage(error) });
    return fail(500, "Something went wrong. Please try again.", { code: "INTERNAL" });
  }
}

export function validate<S extends z.ZodType>(schema: S, value: unknown): z.infer<S> {
  const result = schema.safeParse(value);
  if (!result.success) {
    const first = result.error.issues[0];
    const path = first?.path.join(".");
    throw new ApiError(
      400,
      path ? `${path}: ${first.message}` : (first?.message ?? "Invalid request."),
      "VALIDATION",
      z.flattenError(result.error).fieldErrors,
    );
  }
  return result.data;
}

export async function parseJson<S extends z.ZodType>(request: Request, schema: S): Promise<z.infer<S>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON.", "BAD_JSON");
  }
  return validate(schema, body);
}

export function parseQuery<S extends z.ZodType>(request: NextRequest, schema: S): z.infer<S> {
  const raw: Record<string, string | string[]> = {};
  for (const key of new Set(request.nextUrl.searchParams.keys())) {
    const all = request.nextUrl.searchParams.getAll(key);
    raw[key] = all.length > 1 ? all : all[0];
  }
  return validate(schema, raw);
}

const UUID = z.uuid();

/** Rejects malformed ids before they reach the database. */
export function assertUuid(value: string, label = "Item"): string {
  if (!UUID.safeParse(value).success) throw new ApiError(404, `${label} not found.`, "NOT_FOUND");
  return value;
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}

export function userAgent(headers: Headers): string | null {
  return headers.get("user-agent")?.slice(0, 300) ?? null;
}

/**
 * CSRF guard for cookie-authenticated, state-changing requests.
 * Browsers always send Origin on these; a mismatch is rejected.
 */
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin) {
    let originHost: string;
    try {
      originHost = new URL(origin).host;
    } catch {
      throw new ApiError(403, "Cross-origin request blocked.", "CSRF");
    }
    if (host && originHost !== host) throw new ApiError(403, "Cross-origin request blocked.", "CSRF");
    return;
  }
  if (request.headers.get("sec-fetch-site") === "cross-site") throw new ApiError(403, "Cross-origin request blocked.", "CSRF");
}

/** Removes control characters (keeps tab, newline, carriage return). */
export function stripControl(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return stripControl(value).trim().slice(0, max);
}
