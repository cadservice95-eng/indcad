import { and, eq, gt, ne } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb, admins, sessions } from "../db";
import { env } from "../env";
import { newToken, sha256Hex } from "./tokens";

export const SESSION_COOKIE = "rch_admin_session";

export type AdminUser = { id: string; email: string; name: string; mustChangePassword: boolean };
export type AdminSession = { admin: AdminUser; sessionId: string };

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

export async function createSession(adminId: string, meta: { ip: string; userAgent: string | null }) {
  const db = await getDb();
  const token = newToken(32);
  const expiresAt = new Date(Date.now() + env.sessionMaxDays * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({
    adminId,
    tokenHash: sha256Hex(token),
    expiresAt,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, cookieOptions(expiresAt));
}

/** Resolves a raw session token to an admin. Only a SHA-256 of the token is stored. */
export async function readSession(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null;
  const db = await getDb();
  const now = new Date();
  const [row] = await db
    .select({
      sessionId: sessions.id,
      lastSeenAt: sessions.lastSeenAt,
      id: admins.id,
      email: admins.email,
      name: admins.name,
      mustChangePassword: admins.mustChangePassword,
    })
    .from(sessions)
    .innerJoin(admins, eq(sessions.adminId, admins.id))
    .where(and(eq(sessions.tokenHash, sha256Hex(token)), gt(sessions.expiresAt, now)))
    .limit(1);
  if (!row) return null;

  const idleMs = env.sessionIdleMinutes * 60 * 1000;
  if (now.getTime() - row.lastSeenAt.getTime() > idleMs) {
    await db.delete(sessions).where(eq(sessions.id, row.sessionId));
    return null;
  }
  if (now.getTime() - row.lastSeenAt.getTime() > 60_000) {
    await db.update(sessions).set({ lastSeenAt: now }).where(eq(sessions.id, row.sessionId));
  }
  return {
    sessionId: row.sessionId,
    admin: { id: row.id, email: row.email, name: row.name, mustChangePassword: row.mustChangePassword },
  };
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return readSession(store.get(SESSION_COOKIE)?.value);
}

export async function destroyCurrentSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await getDb();
    await db.delete(sessions).where(eq(sessions.tokenHash, sha256Hex(token)));
  }
  store.set(SESSION_COOKIE, "", { ...cookieOptions(new Date(0)), maxAge: 0 });
}

export async function destroyOtherSessions(adminId: string, keepSessionId?: string) {
  const db = await getDb();
  await db
    .delete(sessions)
    .where(keepSessionId ? and(eq(sessions.adminId, adminId), ne(sessions.id, keepSessionId)) : eq(sessions.adminId, adminId));
}
