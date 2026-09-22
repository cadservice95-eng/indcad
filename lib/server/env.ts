/**
 * Central, typed access to server environment variables.
 * Everything here is read lazily so `next build` never requires secrets.
 * None of these values may ever be prefixed NEXT_PUBLIC_.
 */

function str(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function int(name: string, fallback: number): number {
  const raw = str(name);
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function bool(name: string, fallback: boolean): boolean {
  const raw = str(name);
  if (raw === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(raw.toLowerCase());
}

export const env = {
  get isProduction() {
    return process.env.NODE_ENV === "production";
  },

  // Database
  get databaseUrl() {
    return str("DATABASE_URL");
  },
  get databaseSsl() {
    return str("DATABASE_SSL");
  },
  get databasePoolMax() {
    return int("DATABASE_POOL_MAX", 5);
  },
  get autoMigrate() {
    return bool("AUTO_MIGRATE", false);
  },
  /** Explicit opt-in to the embedded (PGlite) database outside development. Tests only. */
  get allowEmbeddedDb() {
    return bool("ALLOW_EMBEDDED_DB", false);
  },
  get embeddedDbDir() {
    return str("PGLITE_DIR") ?? ".data/pglite";
  },

  // Security
  get appSecret() {
    return str("APP_SECRET");
  },
  get adminEmail() {
    return str("ADMIN_EMAIL");
  },
  get adminInitialPassword() {
    return str("ADMIN_INITIAL_PASSWORD");
  },
  get timezone() {
    return str("ADMIN_TIMEZONE") ?? "Asia/Kolkata";
  },
  get sessionMaxDays() {
    return int("ADMIN_SESSION_MAX_DAYS", 7);
  },
  get sessionIdleMinutes() {
    return int("ADMIN_SESSION_IDLE_MINUTES", 480);
  },

  // Outbound email (SMTP)
  get smtpHost() {
    return str("SMTP_HOST");
  },
  get smtpPort() {
    return int("SMTP_PORT", 587);
  },
  get smtpSecure() {
    return bool("SMTP_SECURE", false);
  },
  get smtpUser() {
    return str("SMTP_USER");
  },
  get smtpPassword() {
    return str("SMTP_PASSWORD");
  },
  get smtpFromEmail() {
    return str("SMTP_FROM_EMAIL");
  },
  get smtpFromName() {
    return str("SMTP_FROM_NAME");
  },

  // Review requests — BCC address for Trustpilot's automatic invite-by-email
  // feature. Optional: the "Request a review" button is hidden without it.
  get trustpilotBccEmail() {
    return str("TRUSTPILOT_BCC_EMAIL");
  },

  // Inbound email
  get inboundSecret() {
    return str("INBOUND_EMAIL_SECRET");
  },
  get cronSecret() {
    return str("CRON_SECRET");
  },
  get imapHost() {
    return str("IMAP_HOST");
  },
  get imapPort() {
    return int("IMAP_PORT", 993);
  },
  get imapSecure() {
    return bool("IMAP_SECURE", true);
  },
  get imapUser() {
    return str("IMAP_USER") ?? str("SMTP_USER");
  },
  get imapPassword() {
    return str("IMAP_PASSWORD") ?? str("SMTP_PASSWORD");
  },
  get imapMailbox() {
    return str("IMAP_MAILBOX") ?? "INBOX";
  },

  // Storage / uploads
  get storageDriver(): "database" | "local" {
    return str("STORAGE_DRIVER") === "local" ? "local" : "database";
  },
  get uploadDir() {
    return str("UPLOAD_DIR") ?? ".data/uploads";
  },
  /** Total bytes accepted per public submission. Vercel rejects request bodies above ~4.5MB. */
  get maxPublicUploadBytes() {
    return int("MAX_UPLOAD_TOTAL_MB", 4) * 1024 * 1024;
  },
  /** Per-file cap for files the admin attaches or that arrive by email. */
  get maxInternalFileBytes() {
    return int("MAX_ATTACHMENT_MB", 20) * 1024 * 1024;
  },
};
