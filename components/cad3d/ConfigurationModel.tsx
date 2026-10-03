"use client";

import { useState } from "react";
import { ParametricPart } from "@/components/svg/ParametricPart";
import { cn } from "@/lib/utils";

const CONFIGS = [
  { id: "STANDARD", L: 120, boss: 21, holes: 4 as const },
  { id: "PRO", L: 135, boss: 24, holes: 4 as const },
  { id: "XL", L: 150, boss: 27, holes: 6 as const },
  { id: "CUSTOM", L: 110, boss: 18, holes: 2 as const },
];

/** One master model, four variants driven by a design table. Illustrative values. */
export function ConfigurationModel({ className }: { className?: string }) {
  const [i, setI] = useState(0);
  const c = CONFIGS[i];
  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative border border-steel-300/20 bg-ink-950 p-2">
          <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
            <span className="border border-sky-300/40 px-2 py-1 text-sky-300">Master model</span>
            <span key={c.id} className="border border-copper-500/60 px-2 py-1 text-copper-400">Config · {c.id}</span>
          </div>
          <svg viewBox="0 0 600 340" fill="none" className="h-auto w-full" role="img" aria-label={`Master model shown in the ${c.id} configuration`}>
            <ParametricPart L={c.L} bossR={c.boss} holes={c.holes} cx={300} cy={112} s={1.8} />
          </svg>
        </div>

        <div className="flex flex-col gap-4">
          <div role="radiogroup" aria-label="Product configuration" className="grid grid-cols-2 gap-2">
            {CONFIGS.map((cfg, idx) => (
              <button
                key={cfg.id}
                type="button"
                role="radio"
                aria-checked={i === idx}
                onClick={() => setI(idx)}
                className={cn(
                  "border px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.14em] transition-colors",
                  i === idx ? "border-copper-500 bg-copper-500/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60",
                )}
              >
                {cfg.id}
              </button>
            ))}
          </div>
          <div className="border border-steel-300/20 bg-ink-900/70">
            <div className="flex items-center justify-between border-b border-steel-300/20 px-4 py-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Design table</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">Illustrative</p>
            </div>
            <dl className="divide-y divide-steel-300/10 font-mono text-sm">
              {[
                ["Length", `${c.L} mm`],
                ["Boss Ø", `${c.boss * 2} mm`],
                ["Hole pattern", `${c.holes}×`],
                ["Product label", `PART 1047-${c.id.slice(0, 3)}`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-4 py-2.5">
                  <dt className="text-neutral-400">{k}</dt>
                  <dd className="text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* product family */}
      <div className="border border-steel-300/20 bg-ink-900/60 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Master model → product family</p>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {CONFIGS.map((cfg, idx) => (
            <button
              key={cfg.id}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show ${cfg.id} configuration`}
              className={cn(
                "relative border bg-ink-950 p-1 transition-colors",
                i === idx ? "border-copper-500" : "border-steel-300/20 hover:border-sky-300/50",
              )}
            >
              <svg viewBox="170 70 260 200" fill="none" className="h-auto w-full" aria-hidden>
                <ParametricPart L={cfg.L} bossR={cfg.boss} holes={cfg.holes} cx={300} cy={150} s={1.15} />
              </svg>
              <span className="absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">Variant {String.fromCharCode(65 + idx)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
