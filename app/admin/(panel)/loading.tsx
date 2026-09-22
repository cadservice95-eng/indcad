import { Skeleton } from "@/components/admin/ui";

/** Shown while any admin page is loading its data. */
export default function Loading() {
  return (
    <div role="status" aria-label="Loading">
      <Skeleton className="mb-2 h-8 w-56" />
      <Skeleton className="mb-6 h-4 w-96 max-w-full" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="mt-6 h-72" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
