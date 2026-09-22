import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { FollowUpRow } from "@/components/admin/FollowUpRow";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { requireAdminPage } from "@/lib/server/auth/dal";
import { followUpCounts, listFollowUps } from "@/lib/server/enquiries/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Follow-ups" };

const BUCKETS = ["overdue", "today", "upcoming", "completed"] as const;
type Bucket = (typeof BUCKETS)[number];
const LABELS: Record<Bucket, string> = { overdue: "Overdue", today: "Today", upcoming: "Upcoming", completed: "Completed" };

export default async function FollowUpsPage({ searchParams }: { searchParams: Promise<{ bucket?: string }> }) {
  await requireAdminPage("/admin/follow-ups/");
  const { bucket: raw } = await searchParams;
  const counts = await followUpCounts();
  const bucket: Bucket = (BUCKETS as readonly string[]).includes(raw ?? "") ? (raw as Bucket) : counts.overdue > 0 ? "overdue" : "today";
  const rows = await listFollowUps(bucket);

  return (
    <>
      <PageHeader title="Follow-ups" description="Internal reminders to get back to customers. Nothing is ever emailed to the customer automatically." />
      <div role="tablist" aria-label="Follow-up filter" className="mb-4 flex flex-wrap border-b border-neutral-300">
        {BUCKETS.map((b) => (
          <Link key={b} href={`/admin/follow-ups/?bucket=${b}`} role="tab" aria-selected={bucket === b} className={cn("-mb-px flex items-center gap-2 border-b-2 px-4 py-2 text-sm", bucket === b ? "border-copper-500 font-medium text-navy-900" : "border-transparent text-neutral-600 hover:text-navy-900")}>
            {LABELS[b]}
            {b !== "completed" ? <span className={cn("rounded-full px-1.5 py-0.5 text-[11px] font-semibold", b === "overdue" && counts.overdue ? "bg-red-600 text-white" : "bg-neutral-200 text-neutral-700")}>{counts[b]}</span> : null}
          </Link>
        ))}
      </div>

      <div className="border border-neutral-200 bg-white">
        {rows.length === 0 ? (
          <EmptyState title={bucket === "completed" ? "No completed follow-ups yet" : `Nothing ${bucket === "upcoming" ? "upcoming" : bucket === "overdue" ? "overdue" : "due today"}`} description="Schedule a follow-up from any enquiry to be reminded here." icon={<CalendarCheck className="h-8 w-8" />} />
        ) : (
          <ul className="divide-y divide-neutral-100">
            {rows.map((row) => (
              <FollowUpRow
                key={row.id}
                overdue={bucket === "overdue"}
                item={{
                  id: row.id,
                  enquiryId: row.enquiryId,
                  referenceNumber: row.referenceNumber,
                  name: row.name,
                  email: row.email,
                  status: row.status,
                  priority: row.priority,
                  dueAt: row.dueAt.toISOString(),
                  note: row.note,
                  completedAt: row.completedAt?.toISOString() ?? null,
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
