import type { Metadata } from "next";
import { EnquiryListPage } from "@/components/admin/EnquiryListPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Enquiries" };

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <EnquiryListPage
      path="/admin/enquiries/"
      title="Enquiries"
      description="Every quote request and contact message, with status, priority and follow-ups."
      searchParams={await searchParams}
    />
  );
}
