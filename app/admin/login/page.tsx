import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/admin/AuthLayout";
import { LoginForm } from "@/components/admin/AuthForms";
import { getSession } from "@/lib/server/auth/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in" };

/** Only same-site admin paths are honoured, so the `next` parameter can't be used as an open redirect. */
function safeNext(value: string | undefined): string {
  if (!value || !value.startsWith("/admin/") || value.startsWith("//") || value.includes("\\") || value.startsWith("/admin/login")) return "/admin/dashboard/";
  return value;
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const target = safeNext(next);
  const session = await getSession();
  if (session) redirect(session.admin.mustChangePassword ? "/admin/change-password/" : target);

  return (
    <AuthLayout title="Admin sign in" subtitle="Sign in to manage enquiries and customer conversations.">
      <LoginForm next={target} />
    </AuthLayout>
  );
}
