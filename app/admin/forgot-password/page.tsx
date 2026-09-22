import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/admin/AuthLayout";
import { ForgotPasswordForm } from "@/components/admin/AuthForms";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset your password" subtitle="Enter the admin email address and we'll send you a reset link.">
      <ForgotPasswordForm />
      <p className="mt-5 text-center text-sm">
        <Link href="/admin/login/" className="text-copper-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
