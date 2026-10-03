"use client";

import { useState } from "react";
import { ExplodedParts, PART_ITEMS } from "@/components/svg/ExplodedParts";
import { cn } from "@/lib/utils";

/** Interactive exploded assembly with a parts list and an illustrative status panel. */
export function AssemblyExploded({ className }: { className?: string }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className={cn("grid items-stretch gap-4 lg:grid-cols-[1.35fr_1fr]", className)}>
      <div className="border border-steel-300/20 bg-ink-950 p-2">
        <svg viewBox="0 0 460 330" fill="none" className="h-auto w-full" role="img" aria-label="Exploded assembly of base plate, housing, shaft, bearing, cover and fasteners with numbered balloons">
          <ExplodedParts active={active} animate onSelect={setActive} />
        </svg>
      </div>
      <div className="flex flex-col gap-4">
        <div className="border border-steel-300/20 bg-ink-900/70">
          <p className="border-b border-steel-300/20 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Components</p>
          <ul>
            {PART_ITEMS.map((name, i) => (
              <li key={name}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    "grid w-full grid-cols-[2rem_1fr] items-center gap-3 border-b border-steel-300/10 px-4 py-3 text-left text-sm transition-colors last:border-b-0",
                    active === i ? "bg-copper-500/10 text-white" : "text-neutral-300 hover:bg-white/5",
                  )}
                >
                  <span className={cn("font-mono text-xs", active === i ? "text-copper-400" : "text-neutral-500")}>{String(i + 1).padStart(2, "0")}</span>
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-steel-300/20 bg-ink-900/70 p-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Assembly status</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">Illustrative UI</p>
          </div>
          <dl className="mt-3 space-y-2 font-mono text-sm">
            {[["Components", "24"], ["Mates", "31"], ["Constraints", "Stable"]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-steel-300/10 pb-2 last:border-b-0">
                <dt className="text-neutral-400">{k}</dt>
                <dd className={v === "Stable" ? "text-emerald-400" : "text-white"}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
