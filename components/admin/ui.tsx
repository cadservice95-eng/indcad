import Link from "next/link";
import { cn } from "@/lib/utils";
import { EMAIL_STATUS_STYLES, PRIORITY_LABELS, PRIORITY_STYLES, SOURCE_LABELS, STATUS_LABELS, STATUS_STYLES, TYPE_LABELS } from "@/lib/enquiry-meta";

/** Server-safe presentational primitives for the admin (no hooks, no client JS). */

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-navy-900">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-neutral-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({ title, actions, children, className, bodyClassName }: { title?: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <section className={cn("border border-neutral-200 bg-white", className)}>
      {title || actions ? (
        <header className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3">
          {title ? <h2 className="text-sm font-semibold text-navy-900">{title}</h2> : <span />}
          {actions}
        </header>
      ) : null}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

const pill = "inline-flex items-center whitespace-nowrap rounded-sm px-2 py-0.5 text-xs font-medium ring-1 ring-inset";

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn(pill, STATUS_STYLES[status] ?? "bg-neutral-100 text-neutral-600 ring-neutral-200")}>{STATUS_LABELS[status] ?? status}</span>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  return <span className={cn(pill, PRIORITY_STYLES[priority] ?? "bg-neutral-100 text-neutral-600 ring-neutral-200")}>{PRIORITY_LABELS[priority] ?? priority}</span>;
}

export function EmailStatusBadge({ status }: { status: string }) {
  return <span className={cn(pill, EMAIL_STATUS_STYLES[status] ?? "bg-neutral-100 text-neutral-600 ring-neutral-200")}>{status.charAt(0) + status.slice(1).toLowerCase()}</span>;
}

export function TypeBadge({ type }: { type: string }) {
  return (
    <span className={cn(pill, type === "QUOTE_REQUEST" ? "bg-copper-50 text-copper-700 ring-copper-200" : "bg-steel-50 text-steel-700 ring-steel-100")}>{TYPE_LABELS[type] ?? type}</span>
  );
}

export function SourceLabel({ source }: { source: string }) {
  return <>{SOURCE_LABELS[source] ?? source}</>;
}

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
      {icon ? <div className="text-neutral-400">{icon}</div> : null}
      <p className="text-sm font-semibold text-navy-900">{title}</p>
      {description ? <p className="max-w-sm text-sm text-neutral-500">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

const TONES = {
  default: "text-navy-900",
  warn: "text-amber-700",
  danger: "text-red-700",
  good: "text-emerald-700",
  accent: "text-copper-600",
};

export function StatCard({ label, value, hint, tone = "default", href }: { label: string; value: React.ReactNode; hint?: React.ReactNode; tone?: keyof typeof TONES; href?: string }) {
  const body = (
    <div className={cn("h-full border border-neutral-200 bg-white p-4", href && "transition-colors hover:border-copper-400")}>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className={cn("mt-1.5 text-3xl font-semibold tabular-nums", TONES[tone])}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
  return href ? (
    <Link href={href} className="block focus-visible:outline-2 focus-visible:outline-copper-500">
      {body}
    </Link>
  ) : (
    body
  );
}

export function Pagination({ page, pages, total, pageSize, basePath, params }: { page: number; pages: number; total: number; pageSize: number; basePath: string; params: Record<string, string | undefined> }) {
  if (total === 0) return null;
  const href = (target: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
    if (target > 1) search.set("page", String(target));
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const link = "border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-navy-900 hover:border-navy-900";
  const disabled = "border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-400";
  return (
    <nav className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600" aria-label="Pagination">
      <p>
        {from}–{to} of {total.toLocaleString("en-IN")}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={link} rel="prev">
            Previous
          </Link>
        ) : (
          <span className={disabled}>Previous</span>
        )}
        <span className="px-2 py-1.5 tabular-nums">
          Page {page} / {pages}
        </span>
        {page < pages ? (
          <Link href={href(page + 1)} className={link} rel="next">
            Next
          </Link>
        ) : (
          <span className={disabled}>Next</span>
        )}
      </div>
    </nav>
  );
}

export const inputClass =
  "w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-neutral-400 focus:border-copper-500 focus:outline-none focus:ring-1 focus:ring-copper-500 disabled:bg-neutral-50 disabled:text-neutral-500";

export const btn = {
  primary: "inline-flex items-center justify-center gap-2 whitespace-nowrap bg-copper-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-copper-600 disabled:pointer-events-none disabled:opacity-50",
  secondary: "inline-flex items-center justify-center gap-2 whitespace-nowrap bg-navy-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-800 disabled:pointer-events-none disabled:opacity-50",
  outline: "inline-flex items-center justify-center gap-2 whitespace-nowrap border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:border-navy-900 disabled:pointer-events-none disabled:opacity-50",
  danger: "inline-flex items-center justify-center gap-2 whitespace-nowrap bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:pointer-events-none disabled:opacity-50",
  small: "inline-flex items-center justify-center gap-1.5 whitespace-nowrap border border-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-navy-900 transition-colors hover:border-navy-900 disabled:pointer-events-none disabled:opacity-50",
};

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-neutral-200/70", className)} aria-hidden />;
}
