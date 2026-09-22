import type { Metadata } from "next";
import Link from "next/link";
import { Activity as ActivityIcon, Search } from "lucide-react";
import { EmptyState, PageHeader, Pagination, btn, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { requireAdminPage } from "@/lib/server/auth/dal";
import { ACTIVITY_ACTIONS, listActivity } from "@/lib/server/enquiries/activity";
import { formatDateTime } from "@/lib/server/time";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Activity" };

const PAGE_SIZE = 50;
const ACTOR_STYLES: Record<string, string> = {
  ADMIN: "bg-navy-900 text-white",
  CUSTOMER: "bg-copper-100 text-copper-700",
  SYSTEM: "bg-neutral-200 text-neutral-700",
};

const label = (action: string) => action.toLowerCase().replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ action?: string; q?: string; page?: string }> }) {
  await requireAdminPage("/admin/activity/");
  const params = await searchParams;
  const action = (ACTIVITY_ACTIONS as readonly string[]).includes(params.action ?? "") ? params.action : undefined;
  const q = params.q?.trim().slice(0, 120) || undefined;
  const page = Math.max(1, Math.min(10_000, Number.parseInt(params.page ?? "1", 10) || 1));
  const { rows, total } = await listActivity({ action, q, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });

  return (
    <>
      <PageHeader title="Activity" description="A permanent audit trail of everything that happens: enquiries received, replies, status changes, sign-ins, exports and settings changes." />

      <form method="get" className="mb-4 flex flex-wrap gap-2">
        <label className="relative">
          <span className="sr-only">Search activity</span>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
          <input type="search" name="q" defaultValue={q} placeholder="Search descriptions" className={`${inputClass} w-64 py-1.5 pl-8`} />
        </label>
        <select name="action" defaultValue={action ?? ""} aria-label="Event type" className={`${inputClass} w-auto py-1.5`}>
          <option value="">All events</option>
          {ACTIVITY_ACTIONS.map((a) => (
            <option key={a} value={a}>
              {label(a)}
            </option>
          ))}
        </select>
        <button type="submit" className={btn.outline}>
          Filter
        </button>
      </form>

      <div className="border border-neutral-200 bg-white">
        {rows.length === 0 ? (
          <EmptyState title="No activity found" description="Try clearing the filters." icon={<ActivityIcon className="h-8 w-8" />} />
        ) : (
          <ul className="divide-y divide-neutral-100">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-start gap-x-4 gap-y-1 px-4 py-2.5 text-sm">
                <span className={cn("mt-0.5 inline-block w-[4.5rem] rounded-sm px-1.5 py-0.5 text-center text-[11px] font-semibold uppercase", ACTOR_STYLES[row.actor] ?? ACTOR_STYLES.SYSTEM)}>{row.actor.toLowerCase()}</span>
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-navy-900">{row.description}</span>
                  <span className="block text-xs text-neutral-500">
                    {label(row.action)}
                    {row.enquiryId ? (
                      <>
                        {" · "}
                        <Link href={`/admin/enquiries/${row.enquiryId}/`} className="font-mono text-steel-600 hover:underline">
                          {row.referenceNumber ?? "Open enquiry"}
                        </Link>
                      </>
                    ) : row.referenceNumber ? (
                      <span className="font-mono"> · {row.referenceNumber}</span>
                    ) : null}
                  </span>
                </span>
                <time dateTime={row.createdAt.toISOString()} className="whitespace-nowrap text-xs text-neutral-500">
                  {formatDateTime(row.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Pagination page={page} pages={Math.max(1, Math.ceil(total / PAGE_SIZE))} total={total} pageSize={PAGE_SIZE} basePath="/admin/activity/" params={{ action, q }} />
    </>
  );
}
