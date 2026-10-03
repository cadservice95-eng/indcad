import { DimensionLine } from "./DimensionLines";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

// Bracket outline in panel-local coordinates (≈ 150 × 100)
const OUT = "M0 100V0h40v50h110v50Z";
const holes = [
  [20, 22, 6],
  [100, 76, 9],
] as const;

const labels = ["01 · PHYSICAL PART", "02 · REFERENCE / SCAN", "03 · 3D CAD MODEL", "04 · MANUFACTURING DRAWING"];

/** Physical part → scan reference → 3D model → manufacturing drawing. */
export function ReverseEngineeringGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 880 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Reverse engineering workflow: a physical part is scanned, rebuilt as a 3D CAD model and documented as a manufacturing drawing"
    >
      {/* connectors */}
      <g className="text-copper-400">
        {[0, 1, 2].map((i) => (
          <g key={i} className="fade-in" style={d(700 + i * 1000)}>
            <path d={`M${200 + i * 220} 110h30`} stroke="currentColor" strokeWidth="1.2" className="rch-flow" />
            <path d={`M${232 + i * 220} 110l-6 -3.5v7z`} fill="currentColor" />
          </g>
        ))}
      </g>

      {/* 01 physical part */}
      <g transform="translate(26 62)" className="text-steel-300">
        <g className="fade-in" style={d(0)}>
          <path d={OUT} className="fill-steel-500/30" stroke="#a8b8c8" strokeWidth="1.6" strokeLinejoin="round" />
          {holes.map(([x, y, r]) => (
            <circle key={x} cx={x} cy={y} r={r} className="fill-ink-950" stroke="#a8b8c8" strokeWidth="1.4" />
          ))}
          <path d="M6 6h26M6 14h18" stroke="#fff" strokeOpacity="0.15" strokeWidth="3" />
        </g>
      </g>

      {/* 02 scan / reference */}
      <g transform="translate(246 62)" className="text-sky-300">
        <path d={OUT} stroke="currentColor" strokeWidth="2.6" strokeDasharray="0.1 6" strokeLinecap="round" className="fade-in" style={d(1000)} />
        {holes.map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} stroke="currentColor" strokeWidth="2.6" strokeDasharray="0.1 5" strokeLinecap="round" className="fade-in" style={d(1100)} />
        ))}
        <path d="M0 50h40M20 0v100M40 50l55 25M95 75l55 25M40 0l110 50M0 100l95-25M40 50L0 100M150 50L95 75" stroke="currentColor" strokeWidth="0.6" opacity="0.4" className="fade-in" style={d(1500)} />
      </g>

      {/* 03 3D model */}
      <g transform="translate(466 76)" className="text-sky-300">
        <g className="fade-in" style={d(2000)}>
          <path d={OUT} transform="translate(16 -14)" stroke="currentColor" strokeWidth="1.2" opacity="0.5" strokeLinejoin="round" />
          <path d="M0 0l16 -14M40 0l16 -14M40 50l16 -14M150 50l16 -14M150 100l16 -14M0 100l16 -14" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
        </g>
        <path d={OUT} className="fill-sky-400/15" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} style={d(1900, "1.2s")} />
        {holes.map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} stroke="currentColor" strokeWidth="1.3" className="fade-in" style={d(2600)} />
        ))}
      </g>

      {/* 04 drawing */}
      <g transform="translate(686 62)" className="text-sky-200">
        <path d={OUT} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} className="draw" style={d(3000, "1.2s")} />
        {holes.map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} stroke="currentColor" strokeWidth="1.3" className="fade-in" style={d(3600)} />
        ))}
        <path d="M-6 50h172M20 -8v116M100 56v40" stroke="#38bdf8" strokeWidth="0.7" strokeDasharray="10 3 2 3" className="fade-in" style={d(3800)} />
        <DimensionLine x1={0} y1={100} x2={150} y2={100} offset={22} label="150" delay={3900} />
        <DimensionLine x1={0} y1={0} x2={0} y2={100} offset={-18} label="100" delay={4000} />
        <DimensionLine x1={91} y1={76} x2={109} y2={76} offset={34} label="Ø18" delay={4100} className="text-copper-400" />
      </g>

      <g fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.2">
        {labels.map((t, i) => (
          <text key={t} x={26 + i * 220} y="226" className="fade-in" style={d(i * 1000)}>
            {t}
          </text>
        ))}
      </g>
    </svg>
  );
}
