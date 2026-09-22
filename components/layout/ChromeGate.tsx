"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public-site chrome (header, footer, structured data, analytics) on
 * the admin area, which has its own layout. Public routes are unaffected.
 */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
