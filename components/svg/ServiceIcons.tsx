import { cn } from "@/lib/utils";

/**
 * Custom technical line icons (48×48) for the eight service lines.
 * Moving parts carry .ico-* classes, which animate when an ancestor
 * has the Tailwind `group` class and is hovered.
 */
const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function Gear({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const teeth = 8;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const w = Math.PI / teeth / 2.2;
    const ro = r + 4;
    for (const [rad, ang] of [
      [r, a - w * 1.6],
      [ro, a - w],
      [ro, a + w],
      [r, a + w * 1.6],
    ] as const) {
      pts.push(`${(cx + Math.cos(ang) * rad).toFixed(1)} ${(cy + Math.sin(ang) * rad).toFixed(1)}`);
    }
  }
  return (
    <g className="ico-spin">
      <path d={`M${pts.join("L")}Z`} />
      <circle cx={cx} cy={cy} r={r * 0.4} />
    </g>
  );
}

const icons = {
  mechanical: (
    <>
      <Gear cx={22} cy={20} r={9} />
      <path d="M6 40h36M6 37v6M42 37v6" />
      <path d="M10 40l3-1.6v3.2zM38 40l-3-1.6v3.2z" fill="currentColor" stroke="none" />
    </>
  ),
  structural: (
    <>
      <path d="M8 42V8h32v34" />
      <path d="M8 8l32 34M40 8L8 42" opacity="0.55" />
      <path d="M8 25h32" />
      <path d="M4 42h40" />
      <path d="M14 8v34M34 8v34" className="ico-lift" opacity="0.4" />
    </>
  ),
  architectural: (
    <>
      <path d="M6 42V10h36v32z" />
      <path d="M6 24h16M30 24h12M22 10v14M22 42V30M30 42V24" />
      <path d="M22 30a6 6 0 0 1 6-6" className="ico-shift" opacity="0.6" />
      <path d="M30 14h6" />
    </>
  ),
  civil: (
    <>
      <path d="M4 38c8-2 12-10 20-12s14-8 20-14" />
      <path d="M4 44c8-2 12-10 20-12s14-8 20-14" opacity="0.55" />
      <path d="M10 10h10v8H10z" className="ico-lift" />
      <path d="M32 40l6-6M36 42l6-6" opacity="0.5" />
      <circle cx="40" cy="12" r="2" fill="currentColor" stroke="none" className="ico-shift" />
    </>
  ),
  electrical: (
    <>
      <path d="M4 24h10M34 24h10" />
      <circle cx="24" cy="24" r="10" />
      <path d="M26 15l-6 11h6l-4 8" className="ico-shift" />
      <path d="M24 4v10M24 34v10" opacity="0.45" />
      <circle cx="4" cy="24" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="44" cy="24" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  bim: (
    <>
      <path d="M24 5l17 9.5v19L24 43 7 33.5v-19z" />
      <path d="M24 24l17-9.5M24 24L7 14.5M24 24v19" opacity="0.6" />
      <path d="M15.5 19.2l17 9.6" className="ico-lift" opacity="0.45" />
      <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  conversion: (
    <>
      <path d="M8 6h14l6 6v14H8z" />
      <path d="M22 6v6h6" />
      <path d="M12 18h10M12 22h6" opacity="0.6" />
      <path d="M26 33h14M35 28l5 5-5 5" className="ico-shift" />
      <rect x="28" y="38" width="14" height="6" opacity="0.55" />
    </>
  ),
  engineering: (
    <>
      <circle cx="24" cy="24" r="6" />
      <circle cx="24" cy="24" r="14" strokeDasharray="3 4" className="ico-spin" />
      <path d="M24 6v6M24 36v6M6 24h6M36 24h6" />
      <path d="M34 34l6 6" opacity="0.6" />
    </>
  ),
} as const;

export type ServiceIconName = keyof typeof icons;

export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  return (
    <svg {...base} className={cn("h-11 w-11", className)}>
      {icons[name]}
    </svg>
  );
}
