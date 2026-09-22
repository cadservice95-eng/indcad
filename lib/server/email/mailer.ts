import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import { errorMessage } from "../log";
import { getMailConfig, type MailConfig } from "../settings";

export function formatAddress(name: string, email: string) {
  return { name: name.replace(/[\r\n"]/g, " "), address: email };
}

export function createTransporter(config: MailConfig) {
  const { smtp } = config;
  return nodemailer.createTransport({
    host: smtp.host ?? undefined,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.user && smtp.password ? { user: smtp.user, pass: smtp.password } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 25_000,
    tls: { minVersion: "TLSv1.2" },
  });
}

/** Removes the SMTP password from any provider error text before it is stored or shown. */
export function safeError(error: unknown, config: MailConfig): string {
  let message = errorMessage(error);
  const password = config.smtp.password;
  if (password && password.length >= 4) message = message.split(password).join("[redacted]");
  return message.slice(0, 500);
}

export async function sendRaw(config: MailConfig, options: Mail.Options) {
  const transporter = createTransporter(config);
  try {
    return await transporter.sendMail(options);
  } finally {
    transporter.close();
  }
}

export async function verifyConnection(): Promise<{ ok: boolean; configured: boolean; error?: string; host?: string | null; port?: number }> {
  const config = await getMailConfig();
  if (!config.smtp.configured) return { ok: false, configured: false, error: "SMTP is not configured." };
  const transporter = createTransporter(config);
  try {
    await transporter.verify();
    return { ok: true, configured: true, host: config.smtp.host, port: config.smtp.port };
  } catch (error) {
    return { ok: false, configured: true, error: safeError(error, config), host: config.smtp.host, port: config.smtp.port };
  } finally {
    transporter.close();
  }
}
