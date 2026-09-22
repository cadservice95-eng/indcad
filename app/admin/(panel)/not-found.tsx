import Link from "next/link";
import { btn } from "@/components/admin/ui";

export default function AdminNotFound() {
  return (
    <div className="mx-auto mt-16 max-w-md border border-neutral-200 bg-white p-8 text-center">
      <p className="font-mono text-sm text-neutral-400">404</p>
      <h1 className="mt-1 text-lg font-semibold text-navy-900">Not found</h1>
      <p className="mt-1.5 text-sm text-neutral-600">That enquiry or page doesn&apos;t exist, or it was permanently deleted.</p>
      <Link href="/admin/enquiries/" className={`${btn.primary} mt-5`}>
        Back to enquiries
      </Link>
    </div>
  );
}
