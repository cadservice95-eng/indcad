import { CivilSite } from "./CivilSite";
import { pits, outfall, offsetPt } from "@/components/civil/geometry";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** Labelled drainage network: catchment, inlet, pit, pipe, outfall and flow direction. */
export function StormwaterNetwork({ className }: { className?: string }) {
  const cat = offsetPt(0.22, 60);
  const labels: { x: number; y: number; lx: number; ly: number; t: string; c?: string }[] = [
    { x: cat[0], y: cat[1], lx: cat[0] - 60, ly: cat[1] - 46, t: "CATCHMENT" },
    { x: pits[0][0], y: pits[0][1], lx: pits[0][0] - 40, ly: pits[0][1] + 56, t: "INLET" },
    { x: pits[2][0], y: pits[2][1], lx: pits[2][0] - 20, ly: pits[2][1] + 70, t: "PIT" },
    { x: (pits[3][0] + pits[4][0]) / 2, y: (pits[3][1] + pits[4][1]) / 2, lx: pits[4][0] - 30, ly: pits[4][1] - 70, t: "PIPE · FLOW →", c: "#e0f2fe" },
    { x: outfall[0], y: outfall[1], lx: outfall[0] - 78, ly: outfall[1] + 52, t: "OUTFALL" },
  ];
  return (
    <svg viewBox="0 0 640 420" fill="none" className={className} role="img" aria-label="Stormwater network with catchments, inlet, pits, pipe, outfall and flow direction">
      <CivilSite layers={{ drainage: 1, roads: 1, boundary: 0.7, terrain: 0.35, lots: 0.25 }} title="" />
      <g className="max-sm:hidden">
        {labels.map((l, i) => (
          <g key={l.t} className="fade-in" style={d(500 + i * 250)}>
            <path d={`M${l.x} ${l.y}L${l.lx + 40} ${l.ly}`} stroke="#38bdf8" strokeWidth="0.9" />
            <rect x={l.lx} y={l.ly - 12} width={l.t.length * 7.2 + 14} height="20" className="fill-ink-950" stroke={l.c ?? "#38bdf8"} strokeWidth="0.8" />
            <text x={l.lx + 7} y={l.ly + 2} fill={l.c ?? "#38bdf8"} fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1">{l.t}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
