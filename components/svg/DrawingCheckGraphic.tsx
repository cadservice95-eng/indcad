import { DimensionLine } from "./DimensionLines";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export const CHECKS = [
  { label: "Dimensions checked against source", x: 112, y: 62 },
  { label: "Tolerances checked", x: 440, y: 190 },
  { label: "BOM matches the model", x: 118, y: 292 },
  { label: "Drawing standard applied", x: 392, y: 300 },
  { label: "Revision history confirmed", x: 392, y: 268 },
] as const;

/** Simplified drawing sheet with check markers that confirm one by one. */
export function DrawingCheckGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Mechanical drawing sheet with check markers on dimensions, tolerances, bill of materials, drawing standard and revision"
    >
      <rect x="0.5" y="0.5" width="519" height="339" stroke="#83aed3" strokeOpacity="0.3" />
      <g className="text-sky-200" stroke="currentColor" strokeWidth="1.5">
        <rect x="90" y="86" width="260" height="130" pathLength={1} className="draw" style={{ "--t": "1.2s" } as React.CSSProperties} />
        <circle cx="220" cy="151" r="38" pathLength={1} className="draw" style={{ "--d": "300ms", "--t": "1s" } as React.CSSProperties} />
        <circle cx="220" cy="151" r="16" pathLength={1} className="draw" style={{ "--d": "500ms", "--t": "1s" } as React.CSSProperties} />
        <circle cx="122" cy="118" r="8" />
        <circle cx="318" cy="118" r="8" />
        <circle cx="122" cy="184" r="8" />
        <circle cx="318" cy="184" r="8" />
      </g>
      <DimensionLine x1={90} y1={86} x2={350} y2={86} offset={-22} label="125" delay={800} />
      <g className="fade-in text-sky-300" style={d(1100)}>
        <path d="M326 126l30 30h40" stroke="currentColor" strokeWidth="0.9" />
        <text x="360" y="150" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5">4× Ø9 ±0.05</text>
      </g>
      <g className="fade-in text-steel-300" style={d(1200)}>
        <rect x="40" y="256" width="150" height="56" stroke="currentColor" strokeOpacity="0.6" />
        <path d="M40 274h150M40 292h150M84 256v56" stroke="currentColor" strokeOpacity="0.4" />
        <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
          <text x="46" y="268">ITEM</text><text x="90" y="268">DESC.</text>
          <text x="46" y="286">01</text><text x="90" y="286">BRACKET</text>
        </g>
        <rect x="330" y="248" width="150" height="64" stroke="currentColor" strokeOpacity="0.6" />
        <path d="M330 268h150M330 290h150" stroke="currentColor" strokeOpacity="0.4" />
        <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
          <text x="338" y="262">TITLE BLOCK</text>
          <text x="338" y="282">REV. B</text>
        </g>
      </g>

      {CHECKS.map((c, i) => (
        <g key={c.label} transform={`translate(${c.x} ${c.y})`} className="fade-in" style={d(1800 + i * 700)}>
          <circle r="11" fill="#34d399" fillOpacity="0.18" stroke="#34d399" strokeWidth="1.3" />
          <path d="M-5 0.5l3.6 3.8 6.6 -8" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle r="11" stroke="#34d399" strokeWidth="0.8" className="rch-pulse" style={d(i * 400)} />
        </g>
      ))}
    </svg>
  );
}
