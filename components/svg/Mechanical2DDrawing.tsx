import { DimensionLine } from "./DimensionLines";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

// mm → px
const K = 1.45;
const L = 125 * K;
const W = 80 * K;
const T = 12 * K;
const R = 21 * K;
const H = 30 * K;
const RB = 10 * K;
const RH = 4.5 * K;
const HX = 45 * K;
const HY = 26 * K;

const PCX = 190; // plan view centre
const PCY = 128;
const FY = 250; // front view: plate top
const SCX = 480; // section view centre

/**
 * Three-view mechanical drawing (plan, front, section A-A) with centre
 * lines, dimensions, datum, GD&T frame and title block. Builds up in stages
 * when its <InView> parent enters the viewport.
 */
export function Mechanical2DDrawing({ className }: { className?: string }) {
  const holes = [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const;
  const x0 = PCX - L / 2;
  const x1 = PCX + L / 2;

  const secLeft = `M${SCX - L / 2} ${FY + T}V${FY}H${SCX - R}V${FY - H}H${SCX - RB}V${FY + T}Z`;
  const secRight = `M${SCX + L / 2} ${FY + T}V${FY}H${SCX + R}V${FY - H}H${SCX + RB}V${FY + T}Z`;

  return (
    <svg
      viewBox="0 0 640 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Mechanical CAD drafting technical drawing showing plan view, front view and section A-A of a flanged bracket with dimensions, centre lines and title block"
    >
      <defs>
        <pattern id="mech-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V6" stroke="#7dd3fc" strokeWidth="0.8" opacity="0.7" />
        </pattern>
      </defs>
      <rect x="8.5" y="8.5" width="623" height="403" stroke="#83aed3" strokeOpacity="0.35" />

      {/* PLAN VIEW */}
      <g className="text-sky-200" strokeWidth="1.6" stroke="currentColor">
        <path d={`M${x0} ${PCY - W / 2}h${L}v${W}h${-L}z`} pathLength={1} className="draw" style={d(0, "1.4s")} />
        <circle cx={PCX} cy={PCY} r={R} pathLength={1} className="draw" style={d(300, "1.2s")} />
        <circle cx={PCX} cy={PCY} r={RB} pathLength={1} className="draw" style={d(500, "1s")} />
        {holes.map(([a, b], i) => (
          <circle key={i} cx={PCX + a * HX} cy={PCY + b * HY} r={RH} pathLength={1} className="draw" style={d(700 + i * 100, "0.8s")} />
        ))}
      </g>
      {/* centre lines */}
      <g stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="14 3 2 3" className="fade-in" style={d(1400)}>
        <path d={`M${x0 - 18} ${PCY}H${x1 + 18}M${PCX} ${PCY - W / 2 - 14}V${PCY + W / 2 + 14}`} />
        {holes.map(([a, b], i) => (
          <path key={i} d={`M${PCX + a * HX - 10} ${PCY + b * HY}h20M${PCX + a * HX} ${PCY + b * HY - 10}v20`} strokeDasharray="none" />
        ))}
        <path d={`M${PCX} ${FY - H - 12}V${FY + T + 12}`} />
        <path d={`M${SCX} ${FY - H - 12}V${FY + T + 12}`} />
      </g>

      {/* cutting plane A-A */}
      <g className="fade-in text-copper-400" style={d(1900)}>
        <path d={`M${x0 - 34} ${PCY}h12M${x1 + 22} ${PCY}h12`} stroke="currentColor" strokeWidth="2" />
        <path d={`M${x0 - 34} ${PCY}v-12M${x1 + 34} ${PCY}v-12`} stroke="currentColor" strokeWidth="1.2" />
        <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="11">
          <text x={x0 - 38} y={PCY - 16}>A</text>
          <text x={x1 + 30} y={PCY - 16}>A</text>
        </g>
      </g>

      {/* FRONT VIEW */}
      <g className="text-sky-200" strokeWidth="1.6" stroke="currentColor">
        <path d={`M${x0} ${FY + T}V${FY}H${PCX - R}V${FY - H}H${PCX + R}V${FY}H${x1}V${FY + T}Z`} pathLength={1} className="draw" style={d(900, "1.4s")} />
      </g>
      <g stroke="#7dd3fc" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.8" className="fade-in" style={d(1600)}>
        <path d={`M${PCX - RB} ${FY - H}V${FY + T}M${PCX + RB} ${FY - H}V${FY + T}`} />
        {holes.slice(0, 2).map(([a], i) => (
          <path key={i} d={`M${PCX + a * HX - RH} ${FY}V${FY + T}M${PCX + a * HX + RH} ${FY}V${FY + T}`} />
        ))}
      </g>

      {/* SECTION A-A */}
      <g className="text-sky-200" strokeWidth="1.6" stroke="currentColor">
        <path d={secLeft} pathLength={1} className="draw" style={d(1100, "1.4s")} />
        <path d={secRight} pathLength={1} className="draw" style={d(1100, "1.4s")} />
      </g>
      <g className="fade-in" style={d(2300)}>
        <path d={secLeft} fill="url(#mech-hatch)" />
        <path d={secRight} fill="url(#mech-hatch)" />
      </g>
      <g className="fade-in text-sky-300" style={d(2400)}>
        <text x={SCX} y={FY + T + 40} textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.4">SECTION A-A</text>
        <text x={PCX} y={FY + T + 40} textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.4">FRONT</text>
      </g>

      {/* dimensions */}
      <DimensionLine x1={x0} y1={PCY - W / 2} x2={x1} y2={PCY - W / 2} offset={-22} label="125" delay={2500} />
      <DimensionLine x1={x1} y1={PCY - W / 2} x2={x1} y2={PCY + W / 2} offset={-26} label="80" delay={2650} />
      <DimensionLine x1={x0} y1={FY + T} x2={x0} y2={FY - H} offset={-24} label="42" delay={2800} />
      <DimensionLine x1={PCX - R} y1={FY - H} x2={PCX + R} y2={FY - H} offset={-14} label="Ø42" delay={2950} className="text-copper-400" />

      {/* callouts */}
      <g className="fade-in text-sky-300" style={d(3200)}>
        <path d={`M${PCX + HX + RH * 0.7} ${PCY + HY - RH * 0.7}l22 24h30`} stroke="currentColor" strokeWidth="0.9" />
        <text x={PCX + HX + 54} y={PCY + HY + 24} fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5">4× Ø9 ±0.05</text>
        {/* datum A on front view base */}
        <path d={`M${PCX - 60} ${FY + T}l-6 10h12z`} fill="currentColor" />
        <path d={`M${PCX - 60} ${FY + T + 10}v10`} stroke="currentColor" strokeWidth="0.9" />
        <rect x={PCX - 69} y={FY + T + 20} width="14" height="14" className="fill-ink-950" stroke="currentColor" />
        <text x={PCX - 62} y={FY + T + 31} textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10">A</text>
        {/* GD&T frame */}
        <g transform={`translate(${SCX + 40} ${FY - H - 30})`}>
          <rect width="84" height="16" className="fill-ink-950" stroke="currentColor" />
          <path d="M20 0v16M58 0v16" stroke="currentColor" />
          <circle cx="10" cy="8" r="3.4" stroke="currentColor" />
          <path d="M5 8h10M10 3v10" stroke="currentColor" strokeWidth="0.7" />
          <text x="39" y="12" textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="9.5">0.05</text>
          <text x="71" y="12" textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="9.5">A</text>
        </g>
      </g>

      {/* title block */}
      <g className="fade-in text-steel-300" style={d(3600)}>
        <rect x="380" y="330" width="240" height="72" stroke="currentColor" strokeOpacity="0.6" />
        <path d="M380 354h240M380 378h240M500 330v72" stroke="currentColor" strokeOpacity="0.5" />
        <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
          <text x="388" y="346">FLANGED BRACKET</text>
          <text x="508" y="346">PART NO. 1047</text>
          <text x="388" y="370">UNITS · MM</text>
          <text x="508" y="370">SCALE 1:2</text>
          <text x="388" y="394">SHEET 1 OF 1</text>
          <text x="508" y="394">REV. B</text>
        </g>
      </g>
    </svg>
  );
}
