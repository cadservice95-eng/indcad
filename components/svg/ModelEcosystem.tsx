import { ParametricPart } from "./ParametricPart";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

const CX = 320;
const CY = 215;
const nodes = [
  { label: "DESIGN", a: -150 },
  { label: "MANUFACTURING", a: -90 },
  { label: "FEA", a: -30 },
  { label: "VISUALISATION", a: 30 },
  { label: "CNC", a: 90 },
  { label: "DOCUMENTATION", a: 150 },
];

/** The 3D model as the hub that design, manufacturing, FEA, visualisation, CNC and documentation draw from. */
export function ModelEcosystem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 430"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="A central 3D CAD model connected to design, manufacturing, FEA, visualisation, CNC and documentation"
    >
      <circle cx={CX} cy={CY} r="104" stroke="#7dd3fc" strokeOpacity="0.25" strokeDasharray="3 5" />
      {nodes.map((n, i) => {
        const r = (n.a * Math.PI) / 180;
        const x = CX + Math.cos(r) * 235;
        const y = CY + Math.sin(r) * 158;
        const sx = CX + Math.cos(r) * 108;
        const sy = CY + Math.sin(r) * 92;
        const ex = CX + Math.cos(r) * (235 - 70);
        const ey = CY + Math.sin(r) * (158 - 17);
        return (
          <g key={n.label} className="text-sky-300">
            <path d={`M${sx} ${sy}L${ex} ${ey}`} stroke="currentColor" strokeWidth="1" pathLength={1} className="draw" style={d(400 + i * 200, "1.2s")} />
            <path d={`M${sx} ${sy}L${ex} ${ey}`} stroke="#d68a51" strokeWidth="1.2" className="rch-flow fade-in" style={d(1600 + i * 120)} />
            <g className="fade-in" style={d(900 + i * 200)}>
              <rect x={x - 70} y={y - 17} width="140" height="34" className="fill-ink-950" stroke="currentColor" strokeOpacity="0.7" />
              <text x={x} y={y + 4} textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.4">{n.label}</text>
            </g>
          </g>
        );
      })}
      <g className="text-sky-300">
        <rect x={CX - 78} y={CY - 66} width="156" height="132" className="fill-ink-950" stroke="currentColor" strokeOpacity="0.5" />
        <ParametricPart cx={CX} cy={CY - 8} s={0.95} L={125} />
        <text x={CX} y={CY - 56} textAnchor="middle" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.4">3D CAD MODEL</text>
      </g>
    </svg>
  );
}
