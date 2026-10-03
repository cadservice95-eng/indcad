"use client";

import { useState } from "react";
import { road, roadCentre, roadEdgeA, roadEdgeB, existing, W, H } from "@/components/civil/geometry";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "plan", label: "Plan" },
  { id: "profile", label: "Profile" },
  { id: "section", label: "Cross-section" },
] as const;

const mono = { fontFamily: "var(--font-mono)" } as const;

function Plan() {
  const ticks = Array.from({ length: 9 }, (_, i) => road((i + 1) / 10));
  return (
    <svg viewBox="0 0 640 360" fill="none" className="h-auto w-full" role="img" aria-label="Road alignment in plan with chainage ticks">
      <svg x="0" y="0" width="640" height="360" viewBox={`0 60 ${W} ${H - 60}`}>
        <path d={roadCentre} stroke="rgba(226,232,240,0.12)" strokeWidth="30" strokeLinecap="round" />
        <path d={roadEdgeA} stroke="#e2e8f0" strokeWidth="1.4" pathLength={1} className="draw" style={{ "--t": "1.6s" } as React.CSSProperties} />
        <path d={roadEdgeB} stroke="#e2e8f0" strokeWidth="1.4" pathLength={1} className="draw" style={{ "--d": "150ms", "--t": "1.6s" } as React.CSSProperties} />
        <path d={roadCentre} stroke="#d68a51" strokeWidth="1" strokeDasharray="12 4 2 4" className="fade-in" style={{ "--d": "1200ms" } as React.CSSProperties} />
        <g className="fade-in" style={{ "--d": "1600ms" } as React.CSSProperties}>
          {ticks.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="3" fill="#d68a51" />
              <text x={x + 6} y={y - 18} fill="#e2e8f0" fontSize="10" letterSpacing="1" style={mono}>{`CH ${(i + 1) * 40 + 0}`}</text>
            </g>
          ))}
        </g>
      </svg>
      <text x="22" y="344" fill="#7dd3fc" fontSize="10.5" letterSpacing="1.6" style={mono}>ROAD ALIGNMENT · PLAN</text>
    </svg>
  );
}

function Profile() {
  const n = 40;
  const ground: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const [x, y] = road(i / n);
    ground.push([40 + (i / n) * 560, 250 - (existing(x, y) - 104) * 10]);
  }
  const gl = `M${ground.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}`;
  const a = ground[0][1] - 6;
  const b = ground[n][1] + 6;
  const grade = `M40 ${a.toFixed(1)}L240 ${(a + (b - a) * 0.3).toFixed(1)}Q320 ${(a + (b - a) * 0.5 - 14).toFixed(1)} 400 ${(a + (b - a) * 0.66).toFixed(1)}L600 ${b.toFixed(1)}`;
  return (
    <svg viewBox="0 0 640 360" fill="none" className="h-auto w-full" role="img" aria-label="Longitudinal profile showing existing ground and proposed vertical alignment">
      <path d="M40 30v250h560" stroke="#83aed3" strokeOpacity="0.5" />
      <path d="M40 80h560M40 130h560M40 180h560M40 230h560" stroke="#83aed3" strokeOpacity="0.12" />
      <path d={gl} stroke="#5eead4" strokeWidth="1.6" strokeDasharray="5 3" pathLength={1} className="draw" style={{ "--t": "1.6s" } as React.CSSProperties} />
      <path d={grade} stroke="#38bdf8" strokeWidth="2.4" pathLength={1} className="draw" style={{ "--d": "800ms", "--t": "1.6s" } as React.CSSProperties} />
      <g className="fade-in" style={{ "--d": "1800ms" } as React.CSSProperties}>
        <g fill="#e2e8f0" fontSize="10" letterSpacing="1" style={mono}>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <path d={`M${40 + i * 140} 280v8`} stroke="#e2e8f0" />
              <text x={40 + i * 140} y="304" textAnchor="middle">{`CH ${i * 100}`}</text>
            </g>
          ))}
        </g>
        <path d="M290 148a40 40 0 0 1 60 0" stroke="#d68a51" strokeWidth="1" strokeDasharray="3 3" />
        <text x="320" y="132" textAnchor="middle" fill="#d68a51" fontSize="10" letterSpacing="1" style={mono}>VERTICAL CURVE</text>
        <text x="560" y={Math.min(ground[n][1] + 24, 270)} textAnchor="end" fill="#5eead4" fontSize="10" letterSpacing="1" style={mono}>EXISTING GROUND</text>
        <text x="60" y={a - 14} fill="#38bdf8" fontSize="10" letterSpacing="1" style={mono}>PROPOSED GRADE</text>
      </g>
      <text x="22" y="344" fill="#7dd3fc" fontSize="10.5" letterSpacing="1.6" style={mono}>LONGITUDINAL PROFILE</text>
    </svg>
  );
}

function Section() {
  const road0 = 175;
  return (
    <svg viewBox="0 0 640 360" fill="none" className="h-auto w-full" role="img" aria-label="Road cross-section with lanes, kerbs, shoulders, drainage, terrain, cut and fill and a superelevation indicator">
      {/* terrain */}
      <path d="M0 150C60 150 120 120 190 150S250 190 270 190L270 330H0z" fill="rgba(94,234,212,0.06)" />
      <path d="M0 150C60 150 120 120 190 150" stroke="#5eead4" strokeWidth="1.4" className="draw" pathLength={1} style={{ "--t": "1.2s" } as React.CSSProperties} />
      <path d="M450 190c40 0 70 30 100 20s60-30 90-30" stroke="#5eead4" strokeWidth="1.4" className="draw" pathLength={1} style={{ "--d": "300ms", "--t": "1.2s" } as React.CSSProperties} />
      {/* cut / fill */}
      <path d="M190 150L250 190H270V150z" fill="rgba(214,138,81,0.25)" stroke="#d68a51" strokeDasharray="3 3" className="fade-in" style={{ "--d": "1600ms" } as React.CSSProperties} />
      <path d="M450 190h20v-20z" fill="rgba(56,189,248,0.25)" stroke="#38bdf8" strokeDasharray="3 3" className="fade-in" style={{ "--d": "1700ms" } as React.CSSProperties} />
      {/* pavement */}
      <g className="text-sky-200" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d={`M270 ${road0 + 14}L320 ${road0 + 10}L450 ${road0 + 18}V${road0 + 30}H270z`} className="fill-sky-400/15 draw" pathLength={1} style={{ "--d": "300ms", "--t": "1.2s" } as React.CSSProperties} />
        <path d={`M270 ${road0 + 14}V${road0 + 2}h14v12M436 ${road0 + 16}V${road0 + 4}h14v14`} className="draw" pathLength={1} style={{ "--d": "800ms", "--t": "0.8s" } as React.CSSProperties} />
        <path d="M360 190v-8M360 200v-4" stroke="#e2e8f0" className="fade-in" style={{ "--d": "1300ms" } as React.CSSProperties} />
        <path d="M262 192h8v8h-8z" className="fade-in" style={{ "--d": "1500ms" } as React.CSSProperties} />
      </g>
      {/* superelevation */}
      <g className="fade-in" style={{ "--d": "2000ms" } as React.CSSProperties}>
        <path d="M500 70l130 22M500 70h130" stroke="#d68a51" strokeWidth="1.3" />
        <path d="M580 70a80 80 0 0 1 8 14" stroke="#d68a51" strokeWidth="1" />
        <text x="500" y="56" fill="#d68a51" fontSize="10" letterSpacing="1" style={mono}>SUPERELEVATION</text>
      </g>
      {/* labels */}
      <g className="fade-in max-sm:hidden" style={{ "--d": "1800ms" } as React.CSSProperties}>
        <g fill="#e2e8f0" fontSize="10" letterSpacing="1" style={mono}>
          <text x="284" y="152" fill="#e2e8f0">LANE</text>
          <text x="388" y="152">LANE</text>
          <text x="252" y="228" textAnchor="middle">KERB</text>
          <text x="458" y="228" textAnchor="middle">SHOULDER</text>
          <text x="70" y="232" fill="#5eead4">TERRAIN</text>
          <text x="196" y="226" fill="#d68a51">CUT</text>
          <text x="440" y="160" fill="#38bdf8">FILL</text>
          <text x="236" y="256" fill="#38bdf8">DRAINAGE</text>
        </g>
      </g>
      <g stroke="#e2e8f0" strokeWidth="0.9" className="fade-in" style={{ "--d": "1900ms" } as React.CSSProperties}>
        <path d="M270 262h180M270 256v12M450 256v12" />
      </g>
      <text x="22" y="344" fill="#7dd3fc" fontSize="10.5" letterSpacing="1.6" style={mono}>CROSS-SECTION · ILLUSTRATIVE</text>
    </svg>
  );
}

/** PLAN / PROFILE / CROSS-SECTION tabs; each view redraws when selected. */
export function RoadDesign({ className }: { className?: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("section");
  return (
    <div className={className}>
      <div role="tablist" aria-label="Road design views" className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn("border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors", tab === t.id ? "border-copper-500 bg-copper-500/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div key={tab} data-in="true" className="mt-4 border border-steel-300/25 bg-ink-950 p-3">
        {tab === "plan" ? <Plan /> : tab === "profile" ? <Profile /> : <Section />}
      </div>
    </div>
  );
}
