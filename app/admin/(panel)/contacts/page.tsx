import type { Metadata } from "next";
import { EnquiryListPage } from "@/components/admin/EnquiryListPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact messages" };

export default async function ContactsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <EnquiryListPage
      path="/admin/contacts/"
      title="Contact messages"
      description="General messages sent through the contact form."
      searchParams={await searchParams}
      lockedType="CONTACT_MESSAGE"
      showSaved={false}
      emptyTitle="No contact messages yet"
      emptyHint="Messages sent from the website contact form will appear here."
    />
  );
}
