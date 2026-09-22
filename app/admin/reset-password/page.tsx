import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/admin/AuthLayout";
import { ResetPasswordForm } from "@/components/admin/AuthForms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <AuthLayout title="Choose a new password">
      {token && token.length >= 20 ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="space-y-4 text-sm text-neutral-600">
          <p>This reset link is missing or incomplete. Request a new one and use the link from the email.</p>
          <Link href="/admin/forgot-password/" className="font-medium text-copper-600 hover:underline">
            Request a new link
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
