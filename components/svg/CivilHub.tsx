import { CivilSite } from "./CivilSite";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

const CX = 320;
const CY = 205;
const nodes = [
  { label: "SITE PLAN", a: -150 },
  { label: "GRADING", a: -90 },
  { label: "DRAINAGE", a: -30 },
  { label: "ROAD DESIGN", a: 30 },
  { label: "SERVICES", a: 90 },
];

/** One civil design (terrain model) feeding site plan, grading, drainage, road design and services. */
export function CivilHub({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 410" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="A single civil design connected to site plan, grading, drainage, road design and services">
      <circle cx={CX} cy={CY} r="112" stroke="#7dd3fc" strokeOpacity="0.2" strokeDasharray="3 5" />
      {nodes.map((n, i) => {
        const r = (n.a * Math.PI) / 180;
        const x = CX + Math.cos(r) * 235;
        const y = CY + Math.sin(r) * 150;
        const sx = CX + Math.cos(r) * 100;
        const sy = CY + Math.sin(r) * 80;
        const ex = CX + Math.cos(r) * 172;
        const ey = CY + Math.sin(r) * 135;
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
      <rect x={CX - 100} y={CY - 70} width="200" height="140" className="fill-ink-950" stroke="#7dd3fc" strokeOpacity="0.5" />
      <svg x={CX - 98} y={CY - 68} width="196" height="120" viewBox="0 0 640 420">
        <CivilSite layers={{ terrain: 1, roads: 1, boundary: 1 }} title="" />
      </svg>
      <text x={CX} y={CY + 62} textAnchor="middle" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1.4">CIVIL DESIGN</text>
    </svg>
  );
}
