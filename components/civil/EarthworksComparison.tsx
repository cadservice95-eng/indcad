"use client";

import { useMemo, useState } from "react";
import { W, H, LEVELS, existing, proposed, existingContours, proposedContours, gradingArrows } from "@/components/civil/geometry";
import { cn } from "@/lib/utils";

const CELL = 20;
const bandColor = (lv: number) => (lv < 109 ? "#5eead4" : lv < 114 ? "#38bdf8" : "#7dd3fc");

/** Existing → proposed surface slider with cut/fill shading. Purely visual: no volumes are computed or shown. */
export function EarthworksComparison({ className }: { className?: string }) {
  const [t, setT] = useState(0);
  const cells = useMemo(() => {
    const out: { x: number; y: number; cut: boolean; a: number }[] = [];
    for (let y = 0; y < H; y += CELL) {
      for (let x = 0; x < W; x += CELL) {
        const dz = proposed(x + CELL / 2, y + CELL / 2) - existing(x + CELL / 2, y + CELL / 2);
        if (Math.abs(dz) > 0.9) out.push({ x, y, cut: dz < 0, a: Math.min(0.5, Math.abs(dz) / 14) });
      }
    }
    return out;
  }, []);
  const ex = existingContours();
  const pr = proposedContours();

  return (
    <div className={className}>
      <div className="relative border border-steel-300/25 bg-ink-950 p-2">
        <svg viewBox={`0 0 ${W} ${H}`} fill="none" className="h-auto w-full" role="img" aria-label="Terrain comparison between existing and proposed surfaces with cut and fill shading">
          <g style={{ opacity: t * 0.9 }}>
            {cells.map((c, i) => (
              <rect key={i} x={c.x} y={c.y} width={CELL} height={CELL} fill={c.cut ? "#d68a51" : "#38bdf8"} fillOpacity={c.a} />
            ))}
          </g>
          <g style={{ opacity: 1 - t }}>
            {LEVELS.map((lv, i) => ex[lv] ? <path key={lv} d={ex[lv]} stroke={bandColor(lv)} strokeWidth={i % 4 === 0 ? 1.3 : 0.7} opacity={i % 4 === 0 ? 0.9 : 0.55} /> : null)}
          </g>
          <g style={{ opacity: t }}>
            {LEVELS.map((lv, i) => pr[lv] ? <path key={lv} d={pr[lv]} stroke={bandColor(lv)} strokeWidth={i % 4 === 0 ? 1.3 : 0.7} opacity={i % 4 === 0 ? 0.9 : 0.55} /> : null)}
            {gradingArrows.map((a, i) => (
              <g key={i} transform={`translate(${a.x} ${a.y}) rotate(${a.ang.toFixed(0)})`}>
                <path d="M-12 0H10M4 -4l6 4-6 4" stroke="#e2e8f0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ))}
          </g>
        </svg>
        <div className="pointer-events-none absolute left-4 top-4 flex gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
          <span className={cn("border px-2 py-1 transition-colors", t < 0.5 ? "border-sky-300/50 text-sky-300" : "border-transparent text-neutral-500")}>Existing surface</span>
          <span className={cn("border px-2 py-1 transition-colors", t >= 0.5 ? "border-copper-500/60 text-copper-400" : "border-transparent text-neutral-500")}>Proposed surface</span>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-300 transition-opacity" style={{ opacity: t }}>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-copper-500/70" aria-hidden />Cut</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-sky-400/70" aria-hidden />Fill</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <label htmlFor="eg" className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-sky-300">Existing</label>
        <input id="eg" type="range" min={0} max={100} value={t * 100} onChange={(e) => setT(Number(e.target.value) / 100)} aria-label="Blend from existing to proposed surface" className="w-full accent-sky-400" />
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-copper-400">Proposed</span>
      </div>
    </div>
  );
}
