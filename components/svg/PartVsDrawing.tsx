import { DimensionLine } from "./DimensionLines";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

// Plate with two holes; the "as-found" part has drifted: slot, extra hole, shifted edge
const ORIGINAL = "M0 0h150v90H0z";
const FOUND = "M0 0h150v76l-12 14H0z";

const labels = ["01 · ORIGINAL DRAWING", "02 · PHYSICAL PART", "03 · DOCUMENTED MODIFICATIONS", "04 · REQUALIFIED CAD MODEL"];

/** Drawing vs. as-found part: discrepancies are flagged, then reconciled into a clean model. */
export function PartVsDrawing({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 880 270"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="A part is compared with its original drawing, the undocumented modifications are flagged, and a reconciled CAD model is produced"
    >
      {[0, 1, 2].map((i) => (
        <g key={i} className="fade-in text-copper-400" style={d(900 + i * 1000)}>
          <path d={`M${200 + i * 220} 100h30`} stroke="currentColor" strokeWidth="1.2" className="rch-flow" />
          <path d={`M${232 + i * 220} 100l-6 -3.5v7z`} fill="currentColor" />
        </g>
      ))}

      {/* 01 original drawing */}
      <g transform="translate(26 56)" className="text-sky-200">
        <path d={ORIGINAL} stroke="currentColor" strokeWidth="1.6" pathLength={1} className="draw" style={d(0, "1.2s")} />
        <circle cx="34" cy="45" r="10" stroke="currentColor" strokeWidth="1.4" className="fade-in" style={d(600)} />
        <circle cx="116" cy="45" r="10" stroke="currentColor" strokeWidth="1.4" className="fade-in" style={d(700)} />
        <DimensionLine x1={0} y1={90} x2={150} y2={90} offset={20} label="150" delay={800} />
      </g>

      {/* 02 physical part (as found) */}
      <g transform="translate(246 56)" className="text-steel-300">
        <g className="fade-in" style={d(1000)}>
          <path d={FOUND} className="fill-steel-500/30" stroke="#a8b8c8" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="34" cy="45" r="10" className="fill-ink-950" stroke="#a8b8c8" strokeWidth="1.4" />
          <rect x="102" y="35" width="28" height="20" rx="10" className="fill-ink-950" stroke="#a8b8c8" strokeWidth="1.4" />
          <circle cx="76" cy="20" r="5" className="fill-ink-950" stroke="#a8b8c8" strokeWidth="1.4" />
        </g>
      </g>

      {/* 03 documented modifications */}
      <g transform="translate(466 56)" className="text-sky-200">
        <path d={FOUND} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} className="draw" style={d(2000, "1.2s")} />
        <circle cx="34" cy="45" r="10" stroke="currentColor" strokeWidth="1.4" />
        <rect x="102" y="35" width="28" height="20" rx="10" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="76" cy="20" r="5" stroke="currentColor" strokeWidth="1.4" />
        <g className="fade-in text-copper-400" style={d(2800)}>
          {[
            [76, 20, "A"],
            [116, 45, "B"],
            [144, 82, "C"],
          ].map(([x, y, t]) => (
            <g key={String(t)} transform={`translate(${x} ${y})`}>
              <circle r="13" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
              <circle r="2.4" fill="currentColor" className="rch-pulse" />
              <text x="18" y="-12" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10">{String(t)}</text>
            </g>
          ))}
        </g>
      </g>

      {/* 04 requalified model */}
      <g transform="translate(686 56)" className="text-sky-300">
        <path d={FOUND} className="fill-sky-400/15" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} style={d(3000, "1.2s")} />
        <g className="fade-in" style={d(3800)}>
          <circle cx="34" cy="45" r="10" stroke="currentColor" strokeWidth="1.4" />
          <rect x="102" y="35" width="28" height="20" rx="10" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="76" cy="20" r="5" stroke="currentColor" strokeWidth="1.4" />
        </g>
        <DimensionLine x1={0} y1={90} x2={138} y2={90} offset={20} label="138" delay={4000} className="text-copper-400" />
        <g className="fade-in" style={d(4200)}>
          <circle cx="160" cy="-10" r="10" fill="#34d399" fillOpacity="0.18" stroke="#34d399" strokeWidth="1.2" />
          <path d="M155 -9.5l3.4 3.6 6.2 -7.6" stroke="#34d399" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      <g fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.1">
        {labels.map((t, i) => (
          <text key={t} x={26 + i * 220} y="244" className="fade-in" style={d(i * 1000)}>{t}</text>
        ))}
      </g>
    </svg>
  );
}
