import type { Metadata } from "next";
import Link from "next/link";
import { MailWarning, Search } from "lucide-react";
import { EmailLogsTable } from "@/components/admin/EmailLogsTable";
import { EmptyState, PageHeader, Pagination, btn, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { requireAdminPage } from "@/lib/server/auth/dal";
import { EMAIL_STATUSES, type EmailStatus } from "@/lib/server/db";
import { listEmailLogs } from "@/lib/server/email/logs";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Email logs" };

const PAGE_SIZE = 25;

export default async function EmailLogsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; page?: string }> }) {
  await requireAdminPage("/admin/email-logs/");
  const params = await searchParams;
  const status = (EMAIL_STATUSES as readonly string[]).includes(params.status ?? "") ? (params.status as EmailStatus) : undefined;
  const q = params.q?.trim().slice(0, 120) || undefined;
  const page = Math.max(1, Math.min(10_000, Number.parseInt(params.page ?? "1", 10) || 1));
  const { rows, total, counts } = await listEmailLogs({ status, q, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });

  const tabs: { label: string; value?: EmailStatus; count?: number }[] = [
    { label: "All" },
    { label: "Sent", value: "SENT", count: counts.sent },
    { label: "Failed", value: "FAILED", count: counts.failed },
    { label: "Queued", value: "QUEUED", count: counts.queued },
  ];

  return (
    <>
      <PageHeader title="Email logs" description="Every email the system sends — confirmations, notifications and your replies — with delivery status and retry." />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div role="tablist" aria-label="Status" className="flex border border-neutral-300 bg-white">
          {tabs.map((tab) => {
            const active = tab.value === status;
            const href = `/admin/email-logs/?${new URLSearchParams({ ...(tab.value ? { status: tab.value } : {}), ...(q ? { q } : {}) }).toString()}`;
            return (
              <Link key={tab.label} href={href} role="tab" aria-selected={active} className={cn("flex items-center gap-1.5 border-r border-neutral-200 px-3 py-1.5 text-sm last:border-r-0", active ? "bg-navy-900 font-medium text-white" : "text-neutral-700 hover:bg-neutral-50")}>
                {tab.label}
                {tab.count !== undefined ? <span className={cn("text-xs", active ? "text-neutral-300" : tab.value === "FAILED" && tab.count ? "font-semibold text-red-600" : "text-neutral-400")}>{tab.count}</span> : null}
              </Link>
            );
          })}
        </div>
        <form method="get" className="flex gap-2">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <label className="relative">
            <span className="sr-only">Search email logs</span>
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
            <input type="search" name="q" defaultValue={q} placeholder="Recipient, subject or reference" className={`${inputClass} w-64 py-1.5 pl-8`} />
          </label>
          <button type="submit" className={btn.outline}>
            Search
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <div className="border border-neutral-200 bg-white">
          <EmptyState title="No emails found" description={status || q ? "Try a different filter." : "Emails appear here as soon as the system sends its first message."} icon={<MailWarning className="h-8 w-8" />} />
        </div>
      ) : (
        <EmailLogsTable
          failedCount={counts.failed}
          rows={rows.map((r) => ({
            id: r.id,
            recipient: r.recipient,
            subject: r.subject,
            template: r.template,
            status: r.status,
            attemptCount: r.attemptCount,
            errorMessage: r.errorMessage,
            lastAttemptAt: r.lastAttemptAt?.toISOString() ?? null,
            sentAt: r.sentAt?.toISOString() ?? null,
            createdAt: r.createdAt.toISOString(),
            enquiryId: r.enquiryId,
            referenceNumber: r.referenceNumber,
            canRetry: Boolean(r.canRetry),
          }))}
        />
      )}
      <Pagination page={page} pages={Math.max(1, Math.ceil(total / PAGE_SIZE))} total={total} pageSize={PAGE_SIZE} basePath="/admin/email-logs/" params={{ status, q }} />
    </>
  );
}
