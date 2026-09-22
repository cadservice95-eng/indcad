import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic admin gate. It only checks that a session cookie is present so
 * signed-out visitors are sent to the login page without rendering anything.
 * It is NOT the security boundary: every admin page and every /api/admin route
 * verifies the session against the database (see lib/server/auth/dal.ts).
 */
const SESSION_COOKIE = "rch_admin_session";
const OPEN_PATHS = new Set(["/admin/login", "/admin/forgot-password", "/admin/reset-password"]);

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/\/+$/, "") || "/";
  if (OPEN_PATHS.has(path)) return NextResponse.next();

  if (!request.cookies.has(SESSION_COOKIE)) {
    const login = new URL("/admin/login/", request.url);
    if (path !== "/admin") login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
