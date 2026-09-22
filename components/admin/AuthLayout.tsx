import { ShieldCheck } from "lucide-react";

/** Centered card used by the sign-in, reset and forced-password-change pages. */
export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 bg-blueprint-grid px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3 text-white">
          <span className="flex h-9 w-9 items-center justify-center bg-copper-500 text-sm font-bold lowercase">rc</span>
          <span className="text-lg font-semibold">Render CAD Hub</span>
        </div>
        <div className="border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8">
          <h1 className="text-xl font-semibold text-navy-900">{title}</h1>
          {subtitle ? <p className="mt-1.5 text-sm text-neutral-600">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-neutral-400">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Private admin area
        </p>
      </div>
    </div>
  );
}
