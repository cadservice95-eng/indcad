import { sql } from "drizzle-orm";
import { emailLogs, getDb, dbKind } from "./db";
import { verifyConnection } from "./email/mailer";
import { isImapConfigured } from "./email/imap";
import { env } from "./env";
import { storageHealth } from "./uploads/storage";
import { errorMessage } from "./log";

export type HealthCheck = { name: string; ok: boolean; status: "ok" | "warning" | "error"; detail: string };

export type HealthReport = {
  ok: boolean;
  checkedAt: string;
  checks: HealthCheck[];
};

/**
 * Health for the admin health page. Details are deliberately generic (no
 * connection strings, hosts with credentials, or stack traces).
 */
export async function getHealth(options: { includeSmtp?: boolean } = {}): Promise<HealthReport> {
  const checks: HealthCheck[] = [];

  try {
    const db = await getDb();
    const started = Date.now();
    await db.execute(sql`select 1`);
    const kind = await dbKind();
    checks.push(
      kind === "embedded"
        ? { name: "Database", ok: true, status: "warning", detail: "Using the embedded development database. Set DATABASE_URL for production." }
        : { name: "Database", ok: true, status: "ok", detail: `Connected (${Date.now() - started} ms)` },
    );
  } catch (error) {
    checks.push({ name: "Database", ok: false, status: "error", detail: `Not reachable: ${errorMessage(error).slice(0, 120)}` });
  }

  if (options.includeSmtp !== false) {
    const smtp = await verifyConnection();
    checks.push(
      smtp.ok
        ? { name: "SMTP", ok: true, status: "ok", detail: `Connected to ${smtp.host}:${smtp.port}` }
        : { name: "SMTP", ok: false, status: smtp.configured ? "error" : "warning", detail: smtp.error ?? "Not configured" },
    );
  }

  const storage = await storageHealth();
  checks.push({
    name: "File storage",
    ok: storage.ok,
    status: storage.ok ? "ok" : "error",
    detail: storage.ok ? `Writable (${storage.driver} storage)` : `Not writable: ${storage.detail ?? "unknown error"}`,
  });

  checks.push({
    name: "Inbound email",
    ok: true,
    status: isImapConfigured() || env.inboundSecret ? "ok" : "warning",
    detail: isImapConfigured()
      ? "IMAP mailbox configured"
      : env.inboundSecret
        ? "Provider webhook configured"
        : "Not configured — customer replies will not appear here automatically",
  });

  checks.push({
    name: "App",
    ok: Boolean(env.appSecret),
    status: env.appSecret ? "ok" : "warning",
    detail: env.appSecret ? `Running (${env.isProduction ? "production" : "development"})` : "APP_SECRET is not set; stored SMTP passwords cannot be encrypted",
  });

  try {
    const db = await getDb();
    const [row] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(emailLogs)
      .where(sql`${emailLogs.status} = 'FAILED' and ${emailLogs.createdAt} > now() - interval '24 hours'`);
    if (row.n > 0) checks.push({ name: "Recent email failures", ok: true, status: "warning", detail: `${row.n} failed email${row.n === 1 ? "" : "s"} in the last 24 hours` });
  } catch {
    // reported by the database check above
  }

  return { ok: checks.every((c) => c.status !== "error"), checkedAt: new Date().toISOString(), checks };
}
