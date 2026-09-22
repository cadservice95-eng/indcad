import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { cache } from "react";
import { ApiError, assertSameOrigin, guard } from "../http";
import { getSession, type AdminSession } from "./session";

const cachedSession = cache(getSession);

/**
 * Data-access-layer check for Server Components / pages.
 * Call it next to the data being read; never rely on a layout alone,
 * because layouts do not re-render on client navigation.
 */
export async function requireAdminPage(nextPath?: string, options?: { allowPasswordChangeRequired?: boolean }): Promise<AdminSession> {
  const session = await cachedSession();
  if (!session) {
    redirect(nextPath ? `/admin/login/?next=${encodeURIComponent(nextPath)}` : "/admin/login/");
  }
  // The bootstrap password is temporary: nothing else is reachable until it has been replaced.
  if (session.admin.mustChangePassword && !options?.allowPasswordChangeRequired) redirect("/admin/change-password/");
  return session;
}

export async function requireAdminApi(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) throw new ApiError(401, "Authentication required.", "UNAUTHENTICATED");
  return session;
}

export type AdminHandlerContext<P> = { admin: AdminSession["admin"]; sessionId: string; params: P };

/**
 * Wraps an admin API handler: authenticates the session, blocks cross-origin
 * state-changing requests, and converts thrown errors into safe JSON.
 * Every /api/admin route must go through this wrapper.
 */
export function withAdmin<P = Record<string, never>>(
  handler: (request: NextRequest, ctx: AdminHandlerContext<P>) => Promise<Response>,
  options?: { allowPasswordChangeRequired?: boolean },
) {
  return (request: NextRequest, routeCtx: { params: Promise<P> }): Promise<Response> =>
    guard(async () => {
      const session = await requireAdminApi();
      if (session.admin.mustChangePassword && !options?.allowPasswordChangeRequired) {
        throw new ApiError(403, "Choose a new password before continuing.", "PASSWORD_CHANGE_REQUIRED");
      }
      if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) assertSameOrigin(request);
      const params = await routeCtx.params;
      return handler(request, { admin: session.admin, sessionId: session.sessionId, params });
    });
}
