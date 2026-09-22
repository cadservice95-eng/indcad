import type { Metadata } from "next";
import Link from "next/link";
import { CheckInboxButton } from "@/components/admin/CheckInboxButton";
import { EnquiryListPage } from "@/components/admin/EnquiryListPage";
import { cn } from "@/lib/utils";
import { isImapConfigured } from "@/lib/server/email/imap";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Email inbox" };

const TABS = [
  { label: "Awaiting our reply", href: "/admin/inbox/?awaiting=reply", awaiting: "reply" },
  { label: "Awaiting customer", href: "/admin/inbox/?awaiting=customer", awaiting: "customer" },
  { label: "All conversations", href: "/admin/inbox/", awaiting: undefined },
] as const;

/** Conversation-centred view: every enquiry as a thread, newest activity first. */
export default async function InboxPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const awaiting = typeof params.awaiting === "string" ? params.awaiting : undefined;
  return (
    <EnquiryListPage
      path="/admin/inbox/"
      title="Email inbox"
      description="Conversation threads with customers. Replies sent from here and customer answers stay together on the enquiry."
      searchParams={params}
      defaults={{ sort: "activity" }}
      preview="last"
      showSaved={false}
      actions={<CheckInboxButton imapConfigured={isImapConfigured()} />}
      emptyTitle="No conversations here"
      emptyHint="Threads appear when a customer submits a form or replies to an email."
      above={
        <div role="tablist" aria-label="Conversation filter" className="mb-4 flex flex-wrap border-b border-neutral-300">
          {TABS.map((tab) => (
            <Link key={tab.label} href={tab.href} role="tab" aria-selected={awaiting === tab.awaiting} className={cn("-mb-px border-b-2 px-4 py-2 text-sm", awaiting === tab.awaiting ? "border-copper-500 font-medium text-navy-900" : "border-transparent text-neutral-600 hover:text-navy-900")}>
              {tab.label}
            </Link>
          ))}
        </div>
      }
    />
  );
}
