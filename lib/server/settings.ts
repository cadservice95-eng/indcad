import { eq } from "drizzle-orm";
import { SITE } from "@/lib/constants";
import { getDb, siteEmailSettings } from "./db";
import { canEncrypt, decryptSecret, encryptSecret } from "./email/crypto";
import { env } from "./env";

export type MailConfig = {
  businessEmail: string;
  fromEmail: string;
  fromName: string;
  smtp: { host: string | null; port: number; secure: boolean; user: string | null; password: string | null; configured: boolean };
  notify: { newEnquiry: boolean; customerConfirmation: boolean; emailFailure: boolean };
  /** Where each value comes from, for the settings UI. */
  sources: { smtp: "database" | "environment" | "none" };
};

type SettingsRow = typeof siteEmailSettings.$inferSelect;

export async function getSettingsRow(): Promise<SettingsRow | null> {
  const db = await getDb();
  const [row] = await db.select().from(siteEmailSettings).where(eq(siteEmailSettings.id, 1)).limit(1);
  return row ?? null;
}

/** Database settings override environment variables, which override built-in defaults. */
export async function getMailConfig(): Promise<MailConfig> {
  const row = await getSettingsRow();
  const dbSmtp = Boolean(row?.smtpHost);

  const host = row?.smtpHost ?? env.smtpHost ?? null;
  const user = row?.smtpUser ?? env.smtpUser ?? null;
  const dbPassword = row?.smtpPasswordEnc ? decryptSecret(row.smtpPasswordEnc) : null;
  const password = dbSmtp ? (dbPassword ?? env.smtpPassword ?? null) : (env.smtpPassword ?? dbPassword);
  const businessEmail = row?.businessEmail ?? env.smtpFromEmail ?? SITE.email;

  return {
    businessEmail,
    fromEmail: env.smtpFromEmail ?? row?.businessEmail ?? businessEmail,
    fromName: row?.fromName ?? env.smtpFromName ?? SITE.name,
    smtp: {
      host,
      port: row?.smtpPort ?? env.smtpPort,
      secure: row?.smtpSecure ?? env.smtpSecure,
      user,
      password,
      configured: Boolean(host && (user ? password : true)),
    },
    notify: {
      newEnquiry: row?.notifyNewEnquiry ?? true,
      customerConfirmation: row?.notifyCustomerConfirmation ?? true,
      emailFailure: row?.notifyEmailFailure ?? true,
    },
    sources: { smtp: dbSmtp ? "database" : host ? "environment" : "none" },
  };
}

export type SettingsPatch = Partial<{
  businessEmail: string | null;
  fromName: string | null;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpSecure: boolean | null;
  smtpUser: string | null;
  /** undefined = leave untouched, "" = clear, otherwise replace. */
  smtpPassword: string;
  notifyNewEnquiry: boolean;
  notifyCustomerConfirmation: boolean;
  notifyEmailFailure: boolean;
}>;

export async function updateSettings(patch: SettingsPatch) {
  const db = await getDb();
  const values: Partial<typeof siteEmailSettings.$inferInsert> = { updatedAt: new Date() };
  if ("businessEmail" in patch) values.businessEmail = patch.businessEmail ?? null;
  if ("fromName" in patch) values.fromName = patch.fromName ?? null;
  if ("smtpHost" in patch) values.smtpHost = patch.smtpHost ?? null;
  if ("smtpPort" in patch) values.smtpPort = patch.smtpPort ?? null;
  if ("smtpSecure" in patch) values.smtpSecure = patch.smtpSecure ?? null;
  if ("smtpUser" in patch) values.smtpUser = patch.smtpUser ?? null;
  if (patch.smtpPassword !== undefined) {
    if (patch.smtpPassword === "") values.smtpPasswordEnc = null;
    else if (!canEncrypt()) throw new Error("Set APP_SECRET (16+ characters) on the server to store an SMTP password from this page, or use the SMTP_PASSWORD environment variable.");
    else values.smtpPasswordEnc = encryptSecret(patch.smtpPassword);
  }
  if (patch.notifyNewEnquiry !== undefined) values.notifyNewEnquiry = patch.notifyNewEnquiry;
  if (patch.notifyCustomerConfirmation !== undefined) values.notifyCustomerConfirmation = patch.notifyCustomerConfirmation;
  if (patch.notifyEmailFailure !== undefined) values.notifyEmailFailure = patch.notifyEmailFailure;

  await db
    .insert(siteEmailSettings)
    .values({ id: 1, ...values })
    .onConflictDoUpdate({ target: siteEmailSettings.id, set: values });
}

/** Safe view for the browser: the SMTP password is never included, only whether one exists. */
export async function getSettingsForAdmin() {
  const [row, config] = await Promise.all([getSettingsRow(), getMailConfig()]);
  return {
    businessEmail: config.businessEmail,
    fromName: config.fromName,
    fromEmail: config.fromEmail,
    smtp: {
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      user: config.smtp.user,
      passwordSet: Boolean(config.smtp.password),
      configured: config.smtp.configured,
      source: config.sources.smtp,
    },
    notify: config.notify,
    canStoreSecrets: canEncrypt(),
    savedFiltersSeeded: row?.savedFiltersSeeded ?? false,
    imapConfigured: Boolean(env.imapHost && env.imapUser && env.imapPassword),
    inboundWebhookConfigured: Boolean(env.inboundSecret),
  };
}

export async function markSavedFiltersSeeded() {
  const db = await getDb();
  await db
    .insert(siteEmailSettings)
    .values({ id: 1, savedFiltersSeeded: true })
    .onConflictDoUpdate({ target: siteEmailSettings.id, set: { savedFiltersSeeded: true } });
}
