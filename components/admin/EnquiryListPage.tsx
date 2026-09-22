import { requireAdminPage } from "@/lib/server/auth/dal";
import { listEnquiries, listSavedFilters } from "@/lib/server/enquiries/queries";
import { parsePageFilters, type RawSearchParams } from "@/lib/server/enquiries/page-filters";
import type { EnquiryFilters } from "@/lib/server/enquiries/filters";
import { EnquiryFilters as FilterBar } from "./EnquiryFilters";
import { EnquiryList } from "./EnquiryList";
import { PageHeader, Pagination } from "./ui";

/** Shared server-rendered shell for the Enquiries, Contact Messages and Email Inbox lists. */
export async function EnquiryListPage({
  path,
  title,
  description,
  searchParams,
  defaults,
  lockedType,
  preview,
  actions,
  above,
  showSaved = true,
  emptyTitle,
  emptyHint,
}: {
  path: string;
  title: string;
  description: string;
  searchParams: RawSearchParams;
  defaults?: Partial<EnquiryFilters>;
  lockedType?: "QUOTE_REQUEST" | "CONTACT_MESSAGE";
  preview?: "description" | "last";
  actions?: React.ReactNode;
  above?: React.ReactNode;
  showSaved?: boolean;
  emptyTitle?: string;
  emptyHint?: string;
}) {
  await requireAdminPage(path);
  const { filters, values } = parsePageFilters(searchParams, defaults);
  if (lockedType) {
    filters.type = lockedType;
    delete values.type;
  }
  const [result, saved] = await Promise.all([listEnquiries(filters), showSaved ? listSavedFilters() : Promise.resolve([])]);

  const qs = new URLSearchParams(values).toString();
  const exportQs = new URLSearchParams({ ...values, ...(lockedType ? { type: lockedType } : {}) }).toString();
  const view = filters.view ?? "active";

  return (
    <>
      <PageHeader title={title} description={description} actions={actions} />
      {above}
      <FilterBar key={qs} basePath={path} initial={values} savedFilters={saved.map((f) => ({ id: f.id, name: f.name, query: f.query }))} lockedType={lockedType} showSaved={showSaved} />
      <EnquiryList rows={result.rows.map((r) => ({ ...r, attachmentCount: Number(r.attachmentCount) }))} view={view} exportQuery={exportQs} preview={preview} emptyTitle={emptyTitle} emptyHint={emptyHint} />
      <Pagination page={result.page} pages={result.pages} total={result.total} pageSize={result.pageSize} basePath={path} params={values} />
    </>
  );
}
