import { cn } from "@/lib/utils";

/**
 * Line icons (48×48) for the mechanical page: pipeline stages, applications
 * and deliverable groups. Animated bits use .ico-* classes (hover on `group`).
 */
const icons = {
  // pipeline
  sketch: (
    <>
      <path d="M8 40l4-12L34 6l8 8-22 22z" />
      <path d="M30 10l8 8M12 28l8 8" />
      <path d="M6 42h10" className="ico-shift" />
    </>
  ),
  cad2d: (
    <>
      <path d="M10 10h28v28H10z" />
      <path d="M10 24h28M24 10v28" opacity="0.5" strokeDasharray="3 3" />
      <path d="M10 43h28M10 40v6M38 40v6" className="ico-shift" />
    </>
  ),
  model3d: (
    <>
      <path d="M24 5l16 9v20L24 43 8 34V14z" />
      <path d="M8 14l16 9 16-9M24 23v20" />
      <circle cx="24" cy="23" r="2" fill="currentColor" stroke="none" className="ico-lift" />
    </>
  ),
  assembly: (
    <>
      <path d="M12 38h24l4-6H8z" />
      <path d="M14 26h20l3-5H11z" className="ico-lift" />
      <path d="M16 14h16l3-4H13z" className="ico-lift" opacity="0.7" />
      <path d="M24 10v-5M24 26v6" opacity="0.5" strokeDasharray="2 2" />
    </>
  ),
  bom: (
    <>
      <path d="M9 8h30v32H9z" />
      <path d="M9 16h30M20 8v32" />
      <path d="M24 23h11M24 29h11M24 35h7" className="ico-shift" opacity="0.7" />
      <circle cx="14.5" cy="23" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="29" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="35" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  drawing: (
    <>
      <path d="M7 7h34v34H7z" />
      <path d="M13 13h14v12H13zM31 13h4v12h-4z" opacity="0.7" />
      <path d="M13 31h22M13 35h12" className="ico-shift" />
      <path d="M26 31v8" opacity="0.5" />
    </>
  ),
  folder: (
    <>
      <path d="M6 12h14l4 5h18v23H6z" />
      <path d="M6 22h36" opacity="0.5" />
      <path d="M16 31l5 5 11-11" className="ico-lift" />
    </>
  ),
  // applications
  machine: (
    <>
      <path d="M6 40h36M10 40V26h28v14" />
      <path d="M16 26V14h16v12" />
      <circle cx="24" cy="20" r="3.5" className="ico-spin" />
      <path d="M34 20h8M42 16v8" />
    </>
  ),
  product: (
    <>
      <circle cx="24" cy="24" r="14" />
      <circle cx="24" cy="24" r="5" className="ico-spin" />
      <path d="M24 10v5M24 33v5M10 24h5M33 24h5" />
    </>
  ),
  sheet: (
    <>
      <path d="M8 18l16-8 16 8v18l-16 8-16-8z" />
      <path d="M8 18l16 8 16-8M24 26v18" />
      <path d="M13 31l5 2.5" className="ico-shift" opacity="0.6" />
    </>
  ),
  fixture: (
    <>
      <path d="M8 40V10h32v30" />
      <path d="M8 24h32M8 10l8 8M40 10l-8 8" opacity="0.6" />
      <path d="M18 40V28h12v12" className="ico-lift" />
    </>
  ),
  spare: (
    <>
      <path d="M12 8h24v8l-4 4v10l4 4v6H12v-6l4-4V20l-4-4z" />
      <path d="M18 24h12M18 30h12" opacity="0.5" />
      <path d="M24 8v6" className="ico-lift" />
    </>
  ),
  line: (
    <>
      <path d="M4 32h40v6H4z" />
      <circle cx="10" cy="35" r="1.6" fill="currentColor" stroke="none" className="ico-spin" />
      <circle cx="38" cy="35" r="1.6" fill="currentColor" stroke="none" className="ico-spin" />
      <path d="M10 26h8V18h-8zM24 26h8v-8h-8z" className="ico-shift" />
      <path d="M36 26h6" opacity="0.5" />
    </>
  ),
  custom: (
    <>
      <path d="M8 10h32v28H8z" />
      <path d="M8 24h32M24 10v28" opacity="0.5" />
      <path d="M14 10v28M34 10v28" opacity="0.3" />
      <path d="M36 6l-4 4 4 4 4-4z" className="ico-lift" />
    </>
  ),
  handover: (
    <>
      <path d="M10 6h20l8 8v28H10z" />
      <path d="M30 6v8h8" />
      <path d="M16 24h16M16 30h10" opacity="0.6" />
      <path d="M26 38l4 4 8-9" className="ico-shift" />
    </>
  ),
  change: (
    <>
      <path d="M10 14h20a8 8 0 0 1 0 16H14" />
      <path d="M18 8l-8 6 8 6" className="ico-shift" />
      <path d="M14 36h22" opacity="0.5" />
    </>
  ),
  proto: (
    <>
      <path d="M6 38h10V28h10V18h10V8h6" />
      <path d="M6 38h36" opacity="0.4" />
      <circle cx="42" cy="8" r="2" fill="currentColor" stroke="none" className="ico-lift" />
    </>
  ),
  // deliverable groups
  drawings: (
    <>
      <path d="M8 8h32v32H8z" />
      <path d="M14 14h12v10H14zM30 14h6v10h-6z" opacity="0.7" />
      <path d="M14 30h20M14 35h10" className="ico-shift" />
    </>
  ),
  models: (
    <>
      <path d="M24 5l16 9v20L24 43 8 34V14z" />
      <path d="M8 14l16 9 16-9M24 23v20" opacity="0.6" />
      <path d="M15 19l17 9.5" className="ico-lift" opacity="0.5" />
    </>
  ),
  manufacturing: (
    <>
      <circle cx="20" cy="22" r="8" className="ico-spin" />
      <circle cx="20" cy="22" r="3" />
      <path d="M30 34h12M36 28v12" />
      <path d="M6 42h24" opacity="0.5" />
    </>
  ),
  documentation: (
    <>
      <path d="M10 6h20l8 8v28H10z" />
      <path d="M30 6v8h8" />
      <path d="M16 22h16M16 28h16M16 34h9" opacity="0.7" className="ico-shift" />
    </>
  ),
} as const;

export type MechIconName = keyof typeof icons;

export function MechIcon({ name, className }: { name: MechIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("h-11 w-11", className)}
    >
      {icons[name]}
    </svg>
  );
}
