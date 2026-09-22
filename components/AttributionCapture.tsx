"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";

/** Renders nothing. Records the landing page, referrer and UTM tags for lead attribution. */
export function AttributionCapture() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) return;
    captureAttribution();
  }, [pathname]);
  return null;
}
