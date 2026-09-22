import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminPage } from "@/lib/server/auth/dal";
import { unreadNotificationCount } from "@/lib/server/enquiries/notifications";
import { getNavCounts } from "@/lib/server/enquiries/queries";

export const dynamic = "force-dynamic";

/**
 * Chrome for every signed-in admin page. The layout also verifies the session,
 * but layouts do not re-run on client navigation, so each page repeats the check
 * (see requireAdminPage in every page.tsx).
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminPage();
  const [counts, unreadNotifications] = await Promise.all([getNavCounts(), unreadNotificationCount()]);
  return (
    <AdminShell counts={counts} adminEmail={session.admin.email} unreadNotifications={unreadNotifications}>
      {children}
    </AdminShell>
  );
}
