import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { Card, PageHeader, btn } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { requireAdminPage } from "@/lib/server/auth/dal";
import { dbKind } from "@/lib/server/db";
import { env } from "@/lib/server/env";
import { getHealth } from "@/lib/server/health";
import { formatDateTime } from "@/lib/server/time";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "System health" };

const STYLE = {
  ok: { icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />, box: "border-emerald-200", label: "Healthy" },
  warning: { icon: <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden />, box: "border-amber-300", label: "Needs attention" },
  error: { icon: <XCircle className="h-5 w-5 text-red-600" aria-hidden />, box: "border-red-300", label: "Failing" },
} as const;

export default async function HealthPage() {
  await requireAdminPage("/admin/health/");
  const report = await getHealth();
  const kind = await dbKind().catch(() => "unavailable");

  const info: [string, string][] = [
    ["Environment", env.isProduction ? "Production" : "Development"],
    ["Database", kind === "postgres" ? "PostgreSQL" : kind === "embedded" ? "Embedded (development only)" : "Unavailable"],
    ["File storage", env.storageDriver === "local" ? "Local disk" : "Database"],
    ["Timezone", env.timezone],
    ["Site URL", SITE.url],
    ["Admin URL", `${SITE.url.replace(/\/$/, "")}/admin/`],
    ["Node.js", process.version],
    ["Checked", formatDateTime(new Date(report.checkedAt))],
  ];

  return (
    <>
      <PageHeader
        title="System health"
        description="Live checks of the database, mail server, file storage and app configuration."
        actions={
          <Link href="/admin/health/" className={btn.outline} prefetch={false}>
            <RefreshCw className="h-4 w-4" aria-hidden /> Re-run checks
          </Link>
        }
      />

      <div className={cn("mb-5 flex items-center gap-3 border px-4 py-3", report.ok ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-300 bg-red-50 text-red-900")} role="status">
        {report.ok ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : <XCircle className="h-5 w-5" aria-hidden />}
        <p className="text-sm font-medium">{report.ok ? "All critical systems are working." : "One or more critical systems are failing — see below."}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {report.checks.map((check) => {
          const style = STYLE[check.status];
          return (
            <div key={check.name} className={cn("flex gap-3 border bg-white p-4", style.box)}>
              <span className="mt-0.5 shrink-0">{style.icon}</span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-2 text-sm font-semibold text-navy-900">
                  {check.name} <span className="text-xs font-normal text-neutral-500">{style.label}</span>
                </p>
                <p className="mt-0.5 break-words text-sm text-neutral-600">{check.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Card title="Environment" className="mt-5">
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {info.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3 border-b border-neutral-100 py-1.5">
              <dt className="text-neutral-500">{label}</dt>
              <dd className="min-w-0 break-words text-right font-medium text-navy-900">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-neutral-500">Secrets (passwords, keys, connection strings) are never displayed anywhere in the admin.</p>
      </Card>
    </>
  );
}
