"use client";

import { useState } from "react";
import { makeIso, boxPath, cylinder, ellipse } from "./iso";
import { cn } from "@/lib/utils";

const S = 3.2;
const p = makeIso(142, 104, S);
const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

const items = [
  { n: "01", name: "Base plate", ref: "VIEW A · BASE", qty: 1 },
  { n: "02", name: "Housing", ref: "VIEW A · CENTRE", qty: 1 },
  { n: "03", name: "Side bracket", ref: "VIEW A · RIGHT", qty: 1 },
];

/**
 * Linked 3D model → drawing → BOM. Hovering or focusing any item highlights
 * the part in the model, its call-out in the drawing and its BOM row.
 * Illustrative parts only.
 */
export function BomVisualization({ className }: { className?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const cls = (i: number) =>
    cn(
      "transition-[opacity,color] duration-300",
      active === null ? "text-sky-300" : active === i ? "text-copper-400" : "text-sky-300 opacity-25",
    );
  const on = (i: number) => ({
    onMouseEnter: () => setActive(i),
    onMouseLeave: () => setActive(null),
  });

  // drawing (front elevation), scale 4.2
  const K = 4.2;
  const bx = 44;
  const by = 190;

  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1fr_1fr]", className)}>
      {/* model */}
      <div className="relative border border-steel-300/20 bg-ink-950 p-2">
        <p className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">3D model</p>
        <svg viewBox="0 0 340 290" fill="none" className="h-auto w-full" role="img" aria-label="3D model of a base plate, housing and side bracket">
          <g className={cls(0)} {...on(0)}>
            <path d={boxPath(p, 0, 0, 0, 60, 40, 6)} className="fill-sky-400/10 draw" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" pathLength={1} style={d(0, "1.2s")} />
          </g>
          <g className={cls(1)} {...on(1)}>
            <path d={cylinder(p, 28, 20, 6, 26, 10, S)} className="fill-sky-400/10 draw" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" pathLength={1} style={d(500, "1.2s")} />
            <path d={ellipse(p, 28, 20, 26, 5, S)} stroke="currentColor" strokeWidth="1.1" className="fade-in" style={d(1200)} />
          </g>
          <g className={cls(2)} {...on(2)}>
            <path d={boxPath(p, 44, 8, 6, 54, 32, 22)} className="fill-sky-400/10 draw" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" pathLength={1} style={d(900, "1.2s")} />
          </g>
          {active !== null ? (
            <g className="text-copper-400">
              <circle cx="300" cy="40" r="11" className="fill-ink-950" stroke="currentColor" />
              <text x="300" y="44" textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5">{items[active].n}</text>
            </g>
          ) : null}
        </svg>
      </div>

      {/* drawing */}
      <div className="relative border border-steel-300/20 bg-ink-950 p-2">
        <p className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">Drawing</p>
        <svg viewBox="0 0 340 290" fill="none" className="h-auto w-full" role="img" aria-label="Front view drawing of the same assembly with numbered call-outs">
          <rect x="8.5" y="8.5" width="323" height="273" stroke="#83aed3" strokeOpacity="0.3" />
          <g className={cls(0)} {...on(0)}>
            <path d={`M${bx} ${by}h${60 * K}v${-6 * K}h${-60 * K}z`} stroke="currentColor" strokeWidth="1.6" pathLength={1} className="draw" style={d(200, "1s")} />
            <g className="fade-in" style={d(1600)}>
              <path d={`M${bx + 12} ${by + 12}l-6 22`} stroke="#d68a51" strokeWidth="0.9" />
              <circle cx={bx + 4} cy={by + 44} r="10" className="fill-ink-950" stroke="#d68a51" />
              <text x={bx + 4} y={by + 47.6} textAnchor="middle" fill="#d68a51" fontFamily="var(--font-mono)" fontSize="10">1</text>
            </g>
          </g>
          <g className={cls(1)} {...on(1)}>
            <path d={`M${bx + 18 * K} ${by - 6 * K}V${by - 26 * K}h${20 * K}V${by - 6 * K}`} stroke="currentColor" strokeWidth="1.6" pathLength={1} className="draw" style={d(500, "1s")} />
            <path d={`M${bx + 23 * K} ${by - 26 * K}V${by - 6 * K}M${bx + 33 * K} ${by - 26 * K}V${by - 6 * K}`} stroke="currentColor" strokeDasharray="4 3" opacity="0.7" className="fade-in" style={d(1200)} />
            <g className="fade-in" style={d(1700)}>
              <path d={`M${bx + 28 * K} ${by - 26 * K}v-22`} stroke="#d68a51" strokeWidth="0.9" />
              <circle cx={bx + 28 * K} cy={by - 26 * K - 32} r="10" className="fill-ink-950" stroke="#d68a51" />
              <text x={bx + 28 * K} y={by - 26 * K - 28.4} textAnchor="middle" fill="#d68a51" fontFamily="var(--font-mono)" fontSize="10">2</text>
            </g>
          </g>
          <g className={cls(2)} {...on(2)}>
            <path d={`M${bx + 44 * K} ${by - 6 * K}V${by - 22 * K}h${10 * K}V${by - 6 * K}`} stroke="currentColor" strokeWidth="1.6" pathLength={1} className="draw" style={d(800, "1s")} />
            <g className="fade-in" style={d(1800)}>
              <path d={`M${bx + 49 * K} ${by - 22 * K}l14 -20`} stroke="#d68a51" strokeWidth="0.9" />
              <circle cx={bx + 49 * K + 20} cy={by - 22 * K - 30} r="10" className="fill-ink-950" stroke="#d68a51" />
              <text x={bx + 49 * K + 20} y={by - 22 * K - 26.4} textAnchor="middle" fill="#d68a51" fontFamily="var(--font-mono)" fontSize="10">3</text>
            </g>
          </g>
          {/* dim */}
          <g className="fade-in text-sky-300" style={d(2000)}>
            <path d={`M${bx} ${by + 24}h${60 * K}M${bx} ${by + 18}v12M${bx + 60 * K} ${by + 18}v12`} stroke="currentColor" strokeWidth="0.9" />
            <text x={bx + 30 * K} y={by + 38} textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10">600</text>
          </g>
          <text x="22" y="270" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.4">
            {active === null ? "SEE BOM FOR ITEM REFERENCES" : `REF · ${items[active].ref}`}
          </text>
        </svg>
      </div>

      {/* BOM */}
      <div className="border border-steel-300/20 bg-ink-900/70 lg:col-span-2">
        <div className="flex items-center justify-between border-b border-steel-300/20 px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Bill of materials</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">Illustrative · hover a row</p>
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
                  "grid w-full grid-cols-[2.5rem_1fr_auto_auto] items-center gap-4 border-b border-steel-300/10 px-4 py-3.5 text-left text-sm transition-colors last:border-b-0",
                  active === i ? "bg-copper-500/10 text-white" : "text-neutral-300 hover:bg-white/5",
                )}
              >
                <span className={cn("font-mono text-xs", active === i ? "text-copper-400" : "text-neutral-500")}>{it.n}</span>
                <span>{it.name}</span>
                <span className="hidden font-mono text-[11px] text-neutral-500 sm:block">{it.ref}</span>
                <span className="font-mono text-xs text-neutral-400">QTY {it.qty}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
