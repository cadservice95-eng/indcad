import { cn } from "@/lib/utils";

/**
 * Full-bleed engineering grid (fine + major lines) as a single SVG pattern.
 * Colour comes from currentColor, so tone it with a text-* class. Sits
 * behind content: pointer-events none, hidden from assistive tech.
 */
export function TechnicalGrid({
  id,
  className,
  minor = 24,
  major = 120,
}: {
  id: string;
  className?: string;
  minor?: number;
  major?: number;
}) {
  return (
    <svg className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden>
      <defs>
        <pattern id={`${id}-minor`} width={minor} height={minor} patternUnits="userSpaceOnUse">
          <path d={`M${minor} 0H0V${minor}`} fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
        </pattern>
        <pattern id={`${id}-major`} width={major} height={major} patternUnits="userSpaceOnUse">
          <rect width={major} height={major} fill={`url(#${id}-minor)`} />
          <path d={`M${major} 0H0V${major}`} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-major)`} />
    </svg>
  );
}
