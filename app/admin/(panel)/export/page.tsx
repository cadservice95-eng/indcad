import type { Metadata } from "next";
import { ExportForm } from "@/components/admin/ExportForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdminPage } from "@/lib/server/auth/dal";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Export" };

export default async function ExportPage() {
  await requireAdminPage("/admin/export/");
  return (
    <>
      <PageHeader title="Export enquiries" description="Download a CSV of your enquiries, filtered the way you need. You can also export straight from the Enquiries list." />
      <ExportForm />
    </>
  );
}
