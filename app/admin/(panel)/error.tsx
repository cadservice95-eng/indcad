"use client";

import { AlertTriangle } from "lucide-react";
import { btn } from "@/components/admin/ui";

/** Error boundary for admin pages: a friendly message, never a stack trace. */
export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto mt-16 max-w-md border border-red-200 bg-white p-8 text-center" role="alert">
      <AlertTriangle className="mx-auto h-9 w-9 text-red-500" aria-hidden />
      <h1 className="mt-3 text-lg font-semibold text-navy-900">Something went wrong</h1>
      <p className="mt-1.5 text-sm text-neutral-600">This page couldn&apos;t be loaded. If the problem continues, check the Health page for database or mail server issues.</p>
      <div className="mt-5 flex justify-center gap-2">
        <button type="button" onClick={reset} className={btn.primary}>
          Try again
        </button>
        <a href="/admin/health/" className={btn.outline}>
          Open Health
        </a>
      </div>
    </div>
  );
}
