import type { Metadata } from "next";
import Link from "next/link";
import { Paperclip, Search } from "lucide-react";
import { AttachmentActions } from "@/components/admin/AttachmentRow";
import { EmptyState, PageHeader, Pagination, btn, inputClass } from "@/components/admin/ui";
import { formatBytes } from "@/lib/enquiry-meta";
import { requireAdminPage } from "@/lib/server/auth/dal";
import { listAllAttachments } from "@/lib/server/enquiries/queries";
import { formatDateTime } from "@/lib/server/time";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Attachments" };

const PAGE_SIZE = 25;

export default async function AttachmentsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  await requireAdminPage("/admin/attachments/");
  const { q, page: rawPage } = await searchParams;
  const page = Math.max(1, Math.min(10_000, Number.parseInt(rawPage ?? "1", 10) || 1));
  const query = q?.trim().slice(0, 120) || undefined;
  const { rows, total } = await listAllAttachments({ q: query, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });

  return (
    <>
      <PageHeader title="Attachments" description="Every file received from customers or sent in replies. Files are validated on upload and served only to you." />
      <form method="get" className="mb-4 flex max-w-xl gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Search attachments</span>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden />
          <input type="search" name="q" defaultValue={query} placeholder="File name, reference or customer" className={`${inputClass} pl-8`} />
        </label>
        <button type="submit" className={btn.outline}>
          Search
        </button>
      </form>

      <div className="border border-neutral-200 bg-white">
        {rows.length === 0 ? (
          <EmptyState title={query ? "No files match your search" : "No attachments yet"} description="Files uploaded through the quote form or attached to email replies are listed here." icon={<Paperclip className="h-8 w-8" />} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">File</th>
                  <th className="px-4 py-2.5 font-medium">Enquiry</th>
                  <th className="px-4 py-2.5 font-medium">From</th>
                  <th className="px-4 py-2.5 font-medium">Added</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((file) => (
                  <tr key={file.id} className="hover:bg-neutral-50">
                    <td className="max-w-[16rem] px-4 py-2.5">
                      <p className="truncate font-medium text-navy-900" title={file.originalFilename}>
                        {file.originalFilename}
                      </p>
                      <p className="text-xs text-neutral-500">{formatBytes(file.size)}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <Link href={`/admin/enquiries/${file.enquiryId}/`} className="font-mono text-xs text-steel-600 hover:underline">
                        {file.referenceNumber}
                      </Link>
                      <p className="max-w-[10rem] truncate text-xs text-neutral-500">{file.customerName}</p>
                    </td>
                    <td className="px-4 py-2.5 text-neutral-600">{file.uploadedBy === "CUSTOMER" ? "Customer" : "You"}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-neutral-600">{formatDateTime(file.createdAt)}</td>
                    <td className="px-4 py-2.5">
                      <AttachmentActions id={file.id} name={file.originalFilename} mimeType={file.mimeType} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination page={page} pages={Math.max(1, Math.ceil(total / PAGE_SIZE))} total={total} pageSize={PAGE_SIZE} basePath="/admin/attachments/" params={{ q: query }} />
    </>
  );
}
