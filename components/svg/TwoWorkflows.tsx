import { ParametricPart } from "./ParametricPart";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

function Arrow({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <g className="fade-in text-copper-400" style={d(delay)}>
      <path d={`M${x} ${y}h40`} stroke="currentColor" strokeWidth="1.3" className="rch-flow" />
      <path d={`M${x + 42} ${y}l-7 -4v8z`} fill="currentColor" />
    </g>
  );
}

/** Concept sketch → 3D CAD (new design). */
export function NewDesignGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 220" fill="none" className={className} role="img" aria-label="A loose concept sketch becomes an editable 3D CAD model">
      {/* hand sketch */}
      <g className="text-sky-200" transform="translate(30 50)">
        <path
          d="M2 8C30 4 70 10 110 6 112 30 108 54 112 80 80 84 40 78 4 84 8 56 0 34 2 8Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeDasharray="5 3"
          pathLength={1}
          className="draw"
          style={d(0, "1.4s")}
        />
        <path d="M30 40c0-12 20-12 20 0s-20 12-20 0Z M70 30l24 10" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" className="fade-in" style={d(700)} />
        <text x="0" y="116" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2">CONCEPT SKETCH</text>
      </g>
      <Arrow x={172} y={92} delay={1000} />
      <g className="fade-in text-sky-300" style={d(1400)}>
        <svg x="230" y="0" width="320" height="200" viewBox="170 40 260 170" overflow="visible">
          <ParametricPart cx={300} cy={110} s={1.25} />
        </svg>
        <text x="236" y="206" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2">EDITABLE 3D CAD</text>
      </g>
    </svg>
  );
}

/** Physical component → reference/scan → 3D CAD (existing equipment). */
export function ExistingGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 220" fill="none" className={className} role="img" aria-label="A physical component is captured as reference and scan data and rebuilt as a 3D CAD model">
      <g transform="translate(24 50)">
        <g className="fade-in" style={d(0)}>
          <path d="M0 80V0h46v34h66v46z" className="fill-steel-500/30" stroke="#a8b8c8" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="86" cy="58" r="8" className="fill-ink-950" stroke="#a8b8c8" strokeWidth="1.3" />
        </g>
        <text x="0" y="116" fill="#a8b8c8" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2">PHYSICAL COMPONENT</text>
      </g>
      <Arrow x={146} y={92} delay={600} />
      <g transform="translate(200 50)" className="text-sky-300">
        <path d="M0 80V0h46v34h66v46z" stroke="currentColor" strokeWidth="2.6" strokeDasharray="0.1 6" strokeLinecap="round" className="fade-in" style={d(900)} />
        <path d="M0 34h46M46 0L112 34M0 80L46 34M112 34l-26 24" stroke="currentColor" strokeWidth="0.6" opacity="0.5" className="fade-in" style={d(1400)} />
        <text x="0" y="116" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2">REFERENCE / SCAN</text>
      </g>
      <Arrow x={332} y={92} delay={1600} />
      <g className="fade-in text-sky-300" style={d(2000)}>
        <svg x="390" y="14" width="170" height="170" viewBox="190 60 220 150" overflow="visible">
          <ParametricPart cx={300} cy={110} s={1.0} L={120} />
        </svg>
        <text x="396" y="206" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2">3D CAD</text>
      </g>
    </svg>
  );
}
