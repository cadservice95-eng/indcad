import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/admin/AuthLayout";
import { ChangePasswordForm } from "@/components/admin/AuthForms";
import { requireAdminPage } from "@/lib/server/auth/dal";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Set a new password" };

/** Reached right after the first sign-in with the temporary password. */
export default async function ForcedChangePasswordPage() {
  const session = await requireAdminPage("/admin/change-password/", { allowPasswordChangeRequired: true });
  if (!session.admin.mustChangePassword) redirect("/admin/dashboard/");
  return (
    <AuthLayout title="Set a new password" subtitle="You signed in with a temporary password. Choose your own before continuing.">
      <ChangePasswordForm forced />
    </AuthLayout>
  );
}
