import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { SettingsView } from "@/components/admin/SettingsView";
import { SITE } from "@/lib/constants";
import { requireAdminPage } from "@/lib/server/auth/dal";
import { getAdminProfile } from "@/lib/server/auth/flows";
import { listTemplates } from "@/lib/server/email/templates";
import { env } from "@/lib/server/env";
import { getSettingsForAdmin } from "@/lib/server/settings";
import { formatDateTime } from "@/lib/server/time";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await requireAdminPage("/admin/settings/");
  const [settings, templates, profile] = await Promise.all([getSettingsForAdmin(), listTemplates(), getAdminProfile(session.admin.id)]);
  const base = SITE.url.replace(/\/$/, "");

  return (
    <>
      <PageHeader title="Settings" description="Email delivery, notifications, templates and your admin account." />
      <SettingsView
        settings={settings}
        templates={templates.map((t) => ({ key: t.key, label: t.label, description: t.description, automatic: t.automatic, subject: t.subject, bodyHtml: t.bodyHtml, variables: t.variables, customised: t.customised }))}
        general={{
          siteUrl: base,
          adminUrl: `${base}/admin/`,
          timezone: env.timezone,
          environment: env.isProduction ? "Production" : "Development",
          storage: env.storageDriver === "local" ? "Local disk" : "Database",
          inboundUrl: `${base}/api/inbound/email/`,
          cronUrl: `${base}/api/cron/inbound-email/`,
          adminEmail: profile?.email ?? session.admin.email,
          lastLogin: profile?.lastLoginAt ? formatDateTime(profile.lastLoginAt) : null,
        }}
      />
    </>
  );
}
