import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Inbox } from "lucide-react";
import { BarList, EnquiriesOverTime, StatusDonut } from "@/components/admin/charts";
import { RangeSelector } from "@/components/admin/RangeSelector";
import { Card, EmptyState, PageHeader, PriorityBadge, StatCard, StatusBadge, TypeBadge } from "@/components/admin/ui";
import { SOURCE_LABELS } from "@/lib/enquiry-meta";
import { requireAdminPage } from "@/lib/server/auth/dal";
import { getDashboard } from "@/lib/server/enquiries/analytics";
import { syncFollowUpNotifications } from "@/lib/server/enquiries/notifications";
import { formatDateTime, RANGE_PRESETS, type RangePreset } from "@/lib/server/time";
import { timeAgo } from "@/lib/admin-format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

type SearchParams = Promise<{ range?: string; from?: string; to?: string }>;

function change(current: number, previous: number | null) {
  if (previous === null) return null;
  if (previous === 0) return current === 0 ? "No change" : `${current} new (none before)`;
  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}% vs previous period`;
}

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminPage("/admin/dashboard/");
  const params = await searchParams;
  const preset = (RANGE_PRESETS as readonly string[]).includes(params.range ?? "") ? (params.range as RangePreset) : "last30";
  await syncFollowUpNotifications();
  const data = await getDashboard({ preset, from: params.from, to: params.to });
  const { cards } = data;
  const activeRange = data.range.preset;

  return (
    <>
      <PageHeader title="Dashboard" description={`Enquiry activity — ${data.range.label}`} />
      <div className="mb-6">
        <RangeSelector basePath="/admin/dashboard/" active={activeRange} from={params.from} to={params.to} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total enquiries" value={cards.total} hint={change(cards.total, cards.previousTotal)} href="/admin/enquiries/" />
        <StatCard label="Unread" value={cards.unread} tone={cards.unread ? "accent" : "default"} hint="Right now, all time" href="/admin/enquiries/?unread=1" />
        <StatCard label="Quote requests" value={cards.quotes} href="/admin/enquiries/?type=QUOTE_REQUEST" />
        <StatCard label="Contact messages" value={cards.contacts} href="/admin/contacts/" />
        <StatCard label="Awaiting our reply" value={cards.awaitingReply} tone={cards.awaitingReply ? "warn" : "default"} hint="Customer wrote last" href="/admin/inbox/?awaiting=reply" />
        <StatCard label="Replied" value={cards.replied} tone="good" hint="We wrote last" href="/admin/inbox/?awaiting=customer" />
        <StatCard label="Follow-ups due" value={cards.followUpsDue} tone={cards.followUpsDue ? "danger" : "default"} hint="Due or overdue now" href="/admin/follow-ups/" />
        <StatCard label="Failed emails" value={cards.failedEmails} tone={cards.failedEmails ? "danger" : "default"} hint="Needs a retry" href="/admin/email-logs/?status=FAILED" />
        <StatCard label="Won" value={cards.won} tone="good" href="/admin/enquiries/?status=WON" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card title={`Enquiries over time (${data.series.bucket === "day" ? "daily" : "monthly"})`} className="lg:col-span-2">
          <EnquiriesOverTime points={data.series.points} />
        </Card>
        <Card title="By status">
          <StatusDonut rows={data.byStatus} />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Service interest">
          <BarList rows={data.byService} />
        </Card>
        <Card title="Lead source (form)">
          <BarList rows={data.bySource} color="bg-steel-500" format={(name) => SOURCE_LABELS[name] ?? name} />
        </Card>
        <Card title="Channel / referrer">
          <BarList rows={data.byChannel} color="bg-navy-600" />
        </Card>
        <Card title="Campaigns (UTM)">
          <BarList rows={data.byCampaign} color="bg-copper-400" empty="No campaign-tagged leads yet. Add utm_campaign to your ad links." />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Recent enquiries" actions={<Link href="/admin/enquiries/" className="text-xs font-medium text-copper-600 hover:underline">View all</Link>} bodyClassName="p-0">
          {data.recent.length === 0 ? (
            <EmptyState title="No enquiries yet" description="New quote requests and contact messages appear here as soon as someone submits a form." icon={<Inbox className="h-8 w-8" />} />
          ) : (
            <ul className="divide-y divide-neutral-100">
              {data.recent.map((row) => (
                <li key={row.id}>
                  <Link href={`/admin/enquiries/${row.id}/`} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${row.isRead ? "bg-transparent" : "bg-copper-500"}`} aria-label={row.isRead ? undefined : "Unread"} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={`truncate text-sm ${row.isRead ? "text-neutral-700" : "font-semibold text-navy-900"}`}>{row.name}</span>
                        <TypeBadge type={row.type} />
                      </span>
                      <span className="block truncate text-xs text-neutral-500">
                        <span className="font-mono">{row.referenceNumber}</span> · {row.service ?? "General"} · {timeAgo(row.createdAt)}
                      </span>
                    </span>
                    <span className="hidden shrink-0 gap-1.5 sm:flex">
                      <PriorityBadge priority={row.priority} />
                      <StatusBadge status={row.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Follow-ups needing attention" actions={<Link href="/admin/follow-ups/" className="text-xs font-medium text-copper-600 hover:underline">All follow-ups</Link>} bodyClassName="p-0">
          {data.followUps.length === 0 ? (
            <EmptyState title="Nothing due today" description="Scheduled reminders that are due or overdue are listed here." icon={<CalendarClock className="h-8 w-8" />} />
          ) : (
            <ul className="divide-y divide-neutral-100">
              {data.followUps.map((f) => (
                <li key={f.id}>
                  <Link href={`/admin/enquiries/${f.enquiryId}/`} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-navy-900">{f.name}</span>
                      <span className="block truncate text-xs text-neutral-500">
                        <span className="font-mono">{f.referenceNumber}</span>
                        {f.note ? ` · ${f.note}` : ""}
                      </span>
                    </span>
                    <span className={`shrink-0 text-xs font-medium ${f.overdue ? "text-red-600" : "text-amber-700"}`}>
                      {f.overdue ? "Overdue · " : "Today · "}
                      {formatDateTime(new Date(f.dueAt))}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
