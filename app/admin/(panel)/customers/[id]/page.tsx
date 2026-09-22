import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Card, PageHeader, PriorityBadge, StatusBadge, TypeBadge } from "@/components/admin/ui";
import { requireAdminPage } from "@/lib/server/auth/dal";
import { customers, enquiries, getDb } from "@/lib/server/db";
import { formatDate, formatDateTime } from "@/lib/server/time";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Customer" };

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdminPage(`/admin/customers/${id}/`);
  if (!z.uuid().safeParse(id).success) notFound();

  const db = await getDb();
  const [customer] = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  if (!customer) notFound();
  const list = await db
    .select({
      id: enquiries.id,
      referenceNumber: enquiries.referenceNumber,
      type: enquiries.type,
      status: enquiries.status,
      priority: enquiries.priority,
      service: enquiries.service,
      subject: enquiries.subject,
      messageCount: enquiries.messageCount,
      createdAt: enquiries.createdAt,
    })
    .from(enquiries)
    .where(and(eq(enquiries.customerId, id), isNull(enquiries.deletedAt)))
    .orderBy(desc(enquiries.createdAt));

  const won = list.filter((e) => e.status === "WON").length;
  const open = list.filter((e) => !["WON", "LOST", "CLOSED"].includes(e.status)).length;
  const details: [string, string | null][] = [
    ["Email", customer.email],
    ["Company", customer.company],
    ["Phone", customer.phone],
    ["Location", [customer.city, customer.country].filter(Boolean).join(", ") || null],
    ["Website", customer.website],
    ["Customer since", formatDate(customer.createdAt)],
  ];

  return (
    <>
      <div className="mb-4">
        <Link href="/admin/enquiries/" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-navy-900">
          <ArrowLeft className="h-4 w-4" aria-hidden /> All enquiries
        </Link>
      </div>
      <PageHeader title={customer.name} description={`${list.length} enquir${list.length === 1 ? "y" : "ies"} · ${open} open · ${won} won`} />

      <div className="grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <Card title="Contact details">
          <dl className="-my-1.5 divide-y divide-neutral-100">
            {details.map(([label, value]) =>
              value ? (
                <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-2 py-1.5 text-sm">
                  <dt className="text-neutral-500">{label}</dt>
                  <dd className="min-w-0 break-words text-navy-900">{label === "Email" ? <a href={`mailto:${value}`} className="text-steel-600 hover:underline">{value}</a> : value}</dd>
                </div>
              ) : null,
            )}
          </dl>
          <p className="mt-3 text-xs text-neutral-500">Customers are identified by email address only. Two people with the same name are never merged.</p>
        </Card>

        <Card title="Enquiries" bodyClassName="p-0">
          <ul className="divide-y divide-neutral-100">
            {list.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/enquiries/${e.id}/`} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 hover:bg-neutral-50">
                  <span className="font-mono text-xs font-semibold text-navy-900">{e.referenceNumber}</span>
                  <TypeBadge type={e.type} />
                  <StatusBadge status={e.status} />
                  <PriorityBadge priority={e.priority} />
                  <span className="min-w-0 flex-1 truncate text-sm text-neutral-600">{e.service ?? e.subject}</span>
                  <span className="text-xs text-neutral-500">
                    {e.messageCount} msg{e.messageCount === 1 ? "" : "s"} · {formatDateTime(e.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
