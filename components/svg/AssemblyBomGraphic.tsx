"use client";

import { useState } from "react";
import { makeIso, seg, loop, ellipse, cylinder } from "./iso";
import { cn } from "@/lib/utils";

const S = 1.5;
const OX = 215;
const OY = 250;
const p = makeIso(OX, OY, S);
const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

function box(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  return [
    loop(p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1)),
    seg(p(x0, y1, z0), p(x1, y1, z0), p(x1, y0, z0)),
    seg(p(x0, y1, z0), p(x0, y1, z1)),
    seg(p(x1, y1, z0), p(x1, y1, z1)),
    seg(p(x1, y0, z0), p(x1, y0, z1)),
  ].join("");
}

const BOLTS = [[14, 14], [86, 14], [86, 56], [14, 56]] as const;

const items = [
  { n: "01", name: "Base plate", qty: 1 },
  { n: "02", name: "Housing", qty: 1 },
  { n: "03", name: "Cover plate", qty: 1 },
  { n: "04", name: "Fastener", qty: 4 },
];

/**
 * Exploded assembly with numbered balloons and a linked BOM. Hovering or
 * focusing a BOM row (or a balloon) highlights the matching component.
 * Illustrative parts only.
 */
export function AssemblyBomGraphic({ className }: { className?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const part = (i: number) =>
    cn(
      "transition-[opacity,color] duration-300",
      active === null ? "text-sky-300" : active === i ? "text-copper-400" : "text-sky-300 opacity-30",
    );

  const b1 = p(100, 35, 5);
  const b2 = p(74, 35, 53);
  const b3 = p(80, 35, 100);
  const b4 = p(14, 56, 142);

  const balloon = (i: number, from: readonly [number, number], bx: number, by: number) => (
    <g
      className={cn("cursor-pointer transition-opacity duration-300", active !== null && active !== i && "opacity-30")}
      onMouseEnter={() => setActive(i)}
      onMouseLeave={() => setActive(null)}
    >
      <path d={`M${from[0]} ${from[1]}L${bx} ${by}`} stroke="#d68a51" strokeWidth="0.9" />
      <circle cx={bx} cy={by} r="11" className="fill-ink-950" stroke="#d68a51" strokeWidth="1.2" />
      <text x={bx} y={by + 3.8} textAnchor="middle" fill="#d68a51" fontFamily="var(--font-mono)" fontSize="10.5">
        {items[i].n}
      </text>
    </g>
  );

  return (
    <div className={cn("grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]", className)}>
      <svg
        viewBox="0 0 460 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        role="img"
        aria-label="Exploded mechanical assembly with numbered balloons for base plate, housing, cover plate and fasteners"
      >
        {/* explode axis */}
        <path d={seg(p(50, 35, 0), p(50, 35, 150))} stroke="#7dd3fc" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.5" className="fade-in" style={d(1800)} />

        <g className={part(0)}>
          <path d={box(0, 0, 0, 100, 70, 10)} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" pathLength={1} className="draw" style={d(0, "1.2s")} />
          <path d={BOLTS.map(([x, y]) => ellipse(p, x, y, 10, 4.5, S)).join("")} stroke="currentColor" strokeWidth="1.1" className="fade-in" style={d(900)} />
        </g>
        <g className={part(1)}>
          <path d={cylinder(p, 50, 35, 40, 66, 24, S)} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" pathLength={1} className="draw" style={d(500, "1.2s")} />
          <path d={ellipse(p, 50, 35, 66, 12, S)} stroke="currentColor" strokeWidth="1.1" className="fade-in" style={d(1300)} />
        </g>
        <g className={part(2)}>
          <path d={box(20, 5, 96, 80, 65, 104)} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" pathLength={1} className="draw" style={d(1000, "1.2s")} />
          <path d={BOLTS.map(([x, y]) => ellipse(p, x < 50 ? x + 12 : x - 12, y < 35 ? y + 5 : y - 5, 104, 3.5, S)).join("")} stroke="currentColor" strokeWidth="1" className="fade-in" style={d(1700)} />
        </g>
        <g className={part(3)}>
          {BOLTS.map(([x, y], i) => (
            <path
              key={i}
              d={cylinder(p, x < 50 ? x + 12 : x - 12, y < 35 ? y + 5 : y - 5, 118, 140, 3.5, S) + ellipse(p, x < 50 ? x + 12 : x - 12, y < 35 ? y + 5 : y - 5, 146, 6.5, S)}
              stroke="currentColor"
              strokeWidth="1.2"
              className="fade-in"
              style={d(1500 + i * 120)}
            />
          ))}
        </g>

        <g className="fade-in" style={d(2200)}>
          {balloon(0, b1, b1[0] + 56, b1[1] + 14)}
          {balloon(1, b2, b2[0] + 70, b2[1] - 6)}
          {balloon(2, b3, b3[0] + 66, b3[1] - 14)}
          {balloon(3, b4, b4[0] - 52, b4[1] - 18)}
        </g>
      </svg>

      <div className="border border-steel-300/20 bg-ink-900/70">
        <div className="flex items-center justify-between border-b border-steel-300/20 px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Bill of materials</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">Illustrative</p>
        </div>
        <ul>
          {items.map((it, i) => (
            <li key={it.n}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={cn(
                  "grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-steel-300/10 px-4 py-3.5 text-left text-sm transition-colors last:border-b-0",
                  active === i ? "bg-copper-500/10 text-white" : "text-neutral-300 hover:bg-white/5",
                )}
              >
                <span className={cn("font-mono text-xs", active === i ? "text-copper-400" : "text-neutral-500")}>{it.n}</span>
                <span>{it.name}</span>
                <span className="font-mono text-xs text-neutral-400">QTY {it.qty}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
