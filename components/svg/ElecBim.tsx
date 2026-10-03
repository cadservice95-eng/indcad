"use client";

import { makeIso, seg, boxPath } from "./iso";
import { members } from "@/components/structural/steel";

const mono = { fontFamily: "var(--font-mono)" } as const;
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/**
 * Structural, architectural and electrical layers. The cable tray first crosses
 * a beam (conceptual clash), then is re-routed. `layers` toggles each layer.
 */
export function ElecBim({ className, layers = { structural: true, architectural: true, electrical: true }, run = true }: { className?: string; layers?: { structural: boolean; architectural: boolean; electrical: boolean }; run?: boolean }) {
  const p = makeIso(274, 200, 13);
  const env = boxPath(p, -2, -2, 0, 18, 8, 9.4);
  const frame = members.filter((m) => m.kind !== "brace").map((m) => ({ id: m.id, kind: m.kind, d: seg(p(...m.a), p(...m.b)) }));
  const tray = [boxPath(p, -3, 2.4, 3.3, 19, 3.6, 4.1)].join("");
  const clash = p(8, 3, 4);
  const cls = (on: boolean) => ({ opacity: on ? 1 : 0.06, transition: "opacity 0.4s" }) as React.CSSProperties;
  const tag = (t: string, y: number, c: string, delay: number) => (
    <g className={run ? "fade-in" : ""} style={run ? d(delay) : undefined}>
      <rect x="24" y={y} width={t.length * 8 + 16} height="22" className="fill-ink-950" stroke={c} strokeWidth="0.9" />
      <text x="32" y={y + 15} fill={c} fontSize="10" letterSpacing="1.2" style={mono}>{t}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 640 380" fill="none" className={className} role="img" aria-label="Structural, architectural and electrical layers with a cable tray that crosses a beam and is re-routed" strokeLinecap="round" strokeLinejoin="round">
      <rect x="0.5" y="0.5" width="639" height="379" stroke="#83aed3" strokeOpacity="0.25" />
      <path d={env} stroke="#a8b8c8" strokeWidth="1" strokeDasharray="3 4" style={cls(layers.architectural)} />
      <g stroke="#7dd3fc" style={cls(layers.structural)}>
        {frame.map((m) => <path key={m.id} d={m.d} strokeWidth={m.kind === "col" ? 3 : 2} />)}
      </g>
      <g style={cls(layers.electrical)}>
        <g className={run ? "duct" : ""} style={{ ...d(0), "--dy": "-30px" } as React.CSSProperties}>
          <path d={tray} stroke="#22c55e" strokeWidth="1.6" fill="rgba(34,197,94,0.12)" />
          <path d={seg(p(-3, 3, 3.3), p(19, 3, 3.3))} stroke="#22c55e" strokeWidth="0.8" strokeDasharray="3 3" />
        </g>
        <g className={run ? "fade-pass" : ""} style={run ? ({ ...d(1200), "--life": "2800ms" } as React.CSSProperties) : { opacity: 0 }}>
          <circle cx={clash[0]} cy={clash[1]} r="24" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
          <path d={`M${clash[0] - 8} ${clash[1] - 8}l16 16M${clash[0] + 8} ${clash[1] - 8}l-16 16`} stroke="#ef4444" strokeWidth="2.2" />
        </g>
      </g>
      {tag("STRUCTURAL", 24, "#7dd3fc", 0)}
      {tag("ARCHITECTURAL", 52, "#a8b8c8", 150)}
      {tag("ELECTRICAL", 80, "#22c55e", 300)}
      {run ? (
        <>
          <g className="fade-pass" style={{ ...d(1200), "--life": "2900ms" } as React.CSSProperties}>{tag("CLASH IDENTIFIED", 336, "#ef4444", 0)}</g>
          <g className="fade-pass" style={{ ...d(4000), "--life": "1400ms" } as React.CSSProperties}>{tag("COORDINATION", 336, "#f59e0b", 0)}</g>
          <g className="fade-in" style={d(5400)}>{tag("UPDATED ROUTE", 336, "#22c55e", 0)}</g>
        </>
      ) : null}
    </svg>
  );
}
