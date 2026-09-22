/**
 * Structured server-side logging (JSON lines).
 * Sensitive keys are redacted so passwords, tokens and SMTP credentials
 * can never reach the logs even if a caller passes them by mistake.
 */

const SENSITIVE_KEY = /pass(word)?|secret|token|authorization|cookie|smtp_?pass|api[-_]?key|credential/i;

type Fields = Record<string, unknown>;

function redact(value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Error) return { name: value.name, message: value.message };
  if (typeof value !== "object") return typeof value === "string" && value.length > 500 ? `${value.slice(0, 500)}…` : value;
  if (depth > 4) return "[truncated]";
  if (Array.isArray(value)) return value.slice(0, 20).map((v) => redact(v, depth + 1));
  const out: Fields = {};
  for (const [key, val] of Object.entries(value as Fields)) {
    out[key] = SENSITIVE_KEY.test(key) ? "[redacted]" : redact(val, depth + 1);
  }
  return out;
}

function write(level: "info" | "warn" | "error", event: string, fields?: Fields) {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, event, ...((redact(fields) as Fields) ?? {}) });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info: (event: string, fields?: Fields) => write("info", event, fields),
  warn: (event: string, fields?: Fields) => write("warn", event, fields),
  error: (event: string, fields?: Fields) => write("error", event, fields),
};

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === "string" ? error : "Unknown error";
}
