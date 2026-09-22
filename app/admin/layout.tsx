import type { Metadata } from "next";
import { AdminProviders } from "@/components/admin/feedback";
import { env } from "@/lib/server/env";

// Private area: never indexed, never cached, never shown in search results.
export const metadata: Metadata = {
  title: { default: "Admin — Render CAD Hub", template: "%s · Admin" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminProviders timezone={env.timezone}>{children}</AdminProviders>;
}
