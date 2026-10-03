import { cn } from "@/lib/utils";

const icons = {
  blueprint: (
    <>
      <path d="M8 8h32v32H8z" />
      <path d="M8 18h32M18 8v32" opacity="0.5" />
      <path d="M24 28h10M24 33h6" />
    </>
  ),
  frame: (
    <>
      <path d="M10 42V8M38 42V8M10 16h28M10 30h28" />
      <path d="M10 42l28-12M38 42L10 30" opacity="0.55" className="ico-lift" />
    </>
  ),
  connection: (
    <>
      <path d="M8 6h12v36H8zM20 18h22v12H20z" />
      <circle cx="16" cy="20" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="16" cy="28" r="1.6" fill="currentColor" stroke="none" />
      <path d="M22 36l6 6" className="ico-shift" opacity="0.7" />
    </>
  ),
  sheet: (
    <>
      <path d="M8 6h32v36H8z" />
      <path d="M14 14h12v10H14zM30 14h6v10h-6z" opacity="0.8" />
      <path d="M14 32h20M14 37h12" className="ico-shift" />
    </>
  ),
  member: (
    <>
      <path d="M4 18h40v12H4z" />
      <path d="M4 22h40M4 26h40" opacity="0.4" />
      <circle cx="10" cy="24" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="38" cy="24" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  erected: (
    <>
      <path d="M8 42V10l16 8 16-8v32" />
      <path d="M8 26l16 8 16-8M24 18v24" opacity="0.6" />
      <path d="M24 6v6" className="ico-lift" />
    </>
  ),
} as const;

export type StructIconName = keyof typeof icons;

export function StructIcon({ name, className }: { name: StructIconName; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("h-11 w-11", className)}>
      {icons[name]}
    </svg>
  );
}
