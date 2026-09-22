import { and, eq, gt, isNull, lt, or, sql } from "drizzle-orm";
import { SITE } from "@/lib/constants";
import { admins, getDb, passwordResetTokens, sessions } from "../db";
import { sendPasswordReset } from "../email/send";
import { logActivity } from "../enquiries/activity";
import { env } from "../env";
import { ApiError } from "../http";
import { errorMessage, log } from "../log";
import { hashPassword, passwordProblem, verifyAgainstDummy, verifyPassword } from "./password";
import { hitRateLimit, peekRateLimit, resetRateLimit } from "./rate-limit";
import { createSession, destroyCurrentSession, destroyOtherSessions } from "./session";
import { newToken, sha256Hex } from "./tokens";

const LOGIN_WINDOW_SECONDS = 15 * 60;
const LOGIN_LIMIT_PER_ACCOUNT = 6;
const LOGIN_LIMIT_PER_IP = 20;
const RESET_TOKEN_MINUTES = 60;

const normalizeAdminEmail = (email: string) => email.trim().toLowerCase();

export type LoginMeta = { ip: string; userAgent: string | null };

/**
 * There is exactly one admin. On a brand-new database the account is created
 * from ADMIN_EMAIL / ADMIN_INITIAL_PASSWORD and must choose a new password on
 * first sign-in. The insert is conditional, so it can never create a second admin.
 */
export async function ensureBootstrapAdmin(): Promise<void> {
  const email = env.adminEmail;
  const password = env.adminInitialPassword;
  if (!email || !password) return;
  const db = await getDb();
  const [existing] = await db.select({ id: admins.id }).from(admins).limit(1);
  if (existing) return;
  const hash = await hashPassword(password);
  await db.execute(sql`
    insert into admins (email, name, password_hash, must_change_password)
    select ${normalizeAdminEmail(email)}, 'Admin', ${hash}, true
    where not exists (select 1 from admins)
    on conflict do nothing
  `);
  log.info("auth.bootstrap_admin_created");
}

function throttled(seconds: number): ApiError {
  return new ApiError(429, `Too many attempts. Try again in ${Math.max(1, Math.ceil(seconds / 60))} minute(s).`, "RATE_LIMITED", undefined, { "Retry-After": String(seconds) });
}

export async function login(emailInput: string, password: string, meta: LoginMeta) {
  const db = await getDb();
  const email = normalizeAdminEmail(emailInput);
  const accountKey = `login:acct:${email}`;
  const ipKey = `login:ip:${meta.ip}`;

  const [account, ip] = await Promise.all([
    peekRateLimit(accountKey, LOGIN_LIMIT_PER_ACCOUNT, LOGIN_WINDOW_SECONDS),
    peekRateLimit(ipKey, LOGIN_LIMIT_PER_IP, LOGIN_WINDOW_SECONDS),
  ]);
  if (!account.allowed) throw throttled(account.retryAfterSeconds);
  if (!ip.allowed) throw throttled(ip.retryAfterSeconds);

  await ensureBootstrapAdmin();
  const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  // Always spend the same hashing time so response timing does not reveal whether the account exists.
  const valid = admin ? await verifyPassword(password, admin.passwordHash) : await verifyAgainstDummy(password);

  if (!admin || !valid) {
    await Promise.all([hitRateLimit(accountKey, LOGIN_LIMIT_PER_ACCOUNT, LOGIN_WINDOW_SECONDS), hitRateLimit(ipKey, LOGIN_LIMIT_PER_IP, LOGIN_WINDOW_SECONDS)]);
    await logActivity(db, { action: "LOGIN_FAILED", description: "Failed admin sign-in attempt", actor: "SYSTEM", metadata: { ip: meta.ip } });
    log.warn("auth.login_failed", { ip: meta.ip });
    throw new ApiError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
  }

  await resetRateLimit(accountKey);
  await createSession(admin.id, meta);
  await db.update(admins).set({ lastLoginAt: new Date() }).where(eq(admins.id, admin.id));
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
  await logActivity(db, { action: "ADMIN_LOGIN", description: "Admin signed in", actor: "ADMIN", metadata: { ip: meta.ip } });
  return { mustChangePassword: admin.mustChangePassword };
}

export async function logout(adminId: string) {
  const db = await getDb();
  await destroyCurrentSession();
  await logActivity(db, { action: "ADMIN_LOGOUT", description: "Admin signed out", actor: "ADMIN", metadata: { adminId } });
}

/**
 * Always resolves the same way whether or not the address belongs to the admin,
 * so the form cannot be used to discover which email is registered.
 */
export async function requestPasswordReset(emailInput: string, meta: LoginMeta): Promise<void> {
  const email = normalizeAdminEmail(emailInput);
  const ipLimit = await hitRateLimit(`reset:ip:${meta.ip}`, 5, 3600);
  const mailLimit = await hitRateLimit(`reset:email:${email}`, 3, 3600);
  if (!ipLimit.allowed || !mailLimit.allowed) return;

  const db = await getDb();
  const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  if (!admin) return;

  const token = newToken(32);
  await db.transaction(async (tx) => {
    await tx.delete(passwordResetTokens).where(and(eq(passwordResetTokens.adminId, admin.id), isNull(passwordResetTokens.usedAt)));
    await tx.insert(passwordResetTokens).values({
      adminId: admin.id,
      tokenHash: sha256Hex(token),
      expiresAt: new Date(Date.now() + RESET_TOKEN_MINUTES * 60_000),
      requestedIp: meta.ip,
    });
    await logActivity(tx, { action: "PASSWORD_RESET_REQUESTED", description: "Password reset link requested", actor: "SYSTEM", metadata: { ip: meta.ip } });
  });

  // The link is built from configuration, never from the request Host header (host-header poisoning).
  const link = `${SITE.url.replace(/\/$/, "")}/admin/reset-password/?token=${token}`;
  try {
    await sendPasswordReset({ email: admin.email, name: admin.name }, link);
  } catch (error) {
    log.error("auth.reset_email_failed", { error: errorMessage(error) });
  }
}

export async function resetPassword(token: string, newPassword: string, meta: LoginMeta) {
  const limit = await hitRateLimit(`reset-confirm:ip:${meta.ip}`, 10, 3600);
  if (!limit.allowed) throw throttled(limit.retryAfterSeconds);

  const db = await getDb();
  const [row] = await db
    .select({ id: passwordResetTokens.id, adminId: passwordResetTokens.adminId, email: admins.email })
    .from(passwordResetTokens)
    .innerJoin(admins, eq(passwordResetTokens.adminId, admins.id))
    .where(and(eq(passwordResetTokens.tokenHash, sha256Hex(token)), isNull(passwordResetTokens.usedAt), gt(passwordResetTokens.expiresAt, new Date())))
    .limit(1);
  if (!row) throw new ApiError(400, "This reset link is invalid or has expired. Request a new one.", "INVALID_TOKEN");

  const problem = passwordProblem(newPassword, row.email);
  if (problem) throw new ApiError(400, problem, "WEAK_PASSWORD");

  const hash = await hashPassword(newPassword);
  await db.transaction(async (tx) => {
    // Single-use: the conditional update fails if the link was consumed by a parallel request.
    const used = await tx
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(and(eq(passwordResetTokens.id, row.id), isNull(passwordResetTokens.usedAt)))
      .returning({ id: passwordResetTokens.id });
    if (!used[0]) throw new ApiError(400, "This reset link is invalid or has expired. Request a new one.", "INVALID_TOKEN");
    await tx.update(admins).set({ passwordHash: hash, mustChangePassword: false, passwordChangedAt: new Date(), updatedAt: new Date() }).where(eq(admins.id, row.adminId));
    await tx.delete(sessions).where(eq(sessions.adminId, row.adminId));
    await tx.delete(passwordResetTokens).where(and(eq(passwordResetTokens.adminId, row.adminId), or(isNull(passwordResetTokens.usedAt), lt(passwordResetTokens.expiresAt, new Date()))));
    await logActivity(tx, { action: "PASSWORD_RESET", description: "Password was reset with an emailed link", actor: "ADMIN", metadata: { ip: meta.ip } });
  });
  await resetRateLimit(`login:acct:${row.email}`);
}

async function verifyCurrentPassword(adminId: string, current: string) {
  const db = await getDb();
  const key = `pwcheck:${adminId}`;
  const status = await peekRateLimit(key, 6, LOGIN_WINDOW_SECONDS);
  if (!status.allowed) throw throttled(status.retryAfterSeconds);
  const [admin] = await db.select().from(admins).where(eq(admins.id, adminId)).limit(1);
  if (!admin || !(await verifyPassword(current, admin.passwordHash))) {
    await hitRateLimit(key, 6, LOGIN_WINDOW_SECONDS);
    throw new ApiError(400, "Your current password is incorrect.", "WRONG_PASSWORD");
  }
  await resetRateLimit(key);
  return admin;
}

export async function changePassword(adminId: string, sessionId: string, current: string, next: string) {
  const db = await getDb();
  const admin = await verifyCurrentPassword(adminId, current);
  const problem = passwordProblem(next, admin.email);
  if (problem) throw new ApiError(400, problem, "WEAK_PASSWORD");
  if (await verifyPassword(next, admin.passwordHash)) throw new ApiError(400, "Choose a password different from the current one.", "SAME_PASSWORD");

  const hash = await hashPassword(next);
  await db.update(admins).set({ passwordHash: hash, mustChangePassword: false, passwordChangedAt: new Date(), updatedAt: new Date() }).where(eq(admins.id, adminId));
  await destroyOtherSessions(adminId, sessionId);
  await logActivity(db, { action: "PASSWORD_CHANGED", description: "Admin password changed", actor: "ADMIN" });
}

export async function changeAdminEmail(adminId: string, newEmail: string, currentPassword: string) {
  const db = await getDb();
  await verifyCurrentPassword(adminId, currentPassword);
  const email = normalizeAdminEmail(newEmail);
  try {
    await db.update(admins).set({ email, updatedAt: new Date() }).where(eq(admins.id, adminId));
  } catch {
    throw new ApiError(400, "That email address can't be used.", "EMAIL_UNAVAILABLE");
  }
  await logActivity(db, { action: "ADMIN_EMAIL_CHANGED", description: "Admin login email changed", actor: "ADMIN" });
  return { email };
}

export async function getAdminProfile(adminId: string) {
  const db = await getDb();
  const [admin] = await db
    .select({ id: admins.id, email: admins.email, name: admins.name, lastLoginAt: admins.lastLoginAt, passwordChangedAt: admins.passwordChangedAt })
    .from(admins)
    .where(eq(admins.id, adminId))
    .limit(1);
  return admin ?? null;
}
