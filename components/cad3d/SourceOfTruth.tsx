"use client";

import { useState } from "react";
import { ParametricPart, type FeatureId } from "@/components/svg/ParametricPart";
import { MechIcon, type MechIconName } from "@/components/svg/MechIcons";
import { cn } from "@/lib/utils";

const branches: { label: string; icon: MechIconName; tip: string; feature: FeatureId | null }[] = [
  { label: "2D Drawings", icon: "drawing", tip: "Dimensioned views derived from the model, so drawing and geometry stay in step.", feature: "sketch" },
  { label: "BOM", icon: "bom", tip: "Bill of materials built from the model structure rather than a parallel spreadsheet.", feature: "extrude" },
  { label: "Exploded View", icon: "assembly", tip: "Exploded assembly views produced from the same assembly model.", feature: "pattern" },
  { label: "STEP / IGES", icon: "folder", tip: "Neutral-format exports for suppliers and other CAD systems.", feature: null },
  { label: "Simulation Model", icon: "fea", tip: "A simplified, defeatured copy for FEA or CFD where needed.", feature: "hole" },
  { label: "Visualisation", icon: "viz", tip: "Technical and marketing visuals generated from the same geometry.", feature: "chamfer" },
];

/** One model, six outputs. Hover or focus an output to highlight the geometry it draws on. */
export function SourceOfTruth({ className }: { className?: string }) {
  const [i, setI] = useState<number | null>(null);
  const active = i === null ? null : branches[i];
  return (
    <div className={cn("grid items-stretch gap-4 lg:grid-cols-[1.2fr_1fr]", className)}>
      <div className="relative border border-steel-300/20 bg-ink-950 p-2">
        <span className="absolute left-4 top-4 border border-sky-300/40 bg-ink-950/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">3D model</span>
        <svg viewBox="0 0 600 340" fill="none" className="h-auto w-full" role="img" aria-label="Single 3D model that feeds drawings, BOMs, exploded views, neutral exports, simulation models and visualisation">
          <ParametricPart cx={300} cy={110} s={1.6} highlight={active?.feature ?? null} />
        </svg>
        <p className="absolute bottom-4 left-4 right-4 min-h-[2.5rem] border-t border-steel-300/20 pt-3 text-sm text-neutral-300" aria-live="polite">
          {active ? active.tip : "One model. Multiple engineering outputs — hover an output to see what it draws on."}
        </p>
      </div>

      <ul className="relative flex flex-col gap-2 border-l border-copper-500/40 pl-5">
        {branches.map((b, idx) => (
          <li key={b.label} className="relative flex-1">
            <span aria-hidden className="absolute -left-5 top-1/2 h-px w-5 bg-copper-500/60" />
            <button
              type="button"
              onMouseEnter={() => setI(idx)}
              onMouseLeave={() => setI(null)}
              onFocus={() => setI(idx)}
              onBlur={() => setI(null)}
              className={cn(
                "flex h-full w-full items-center gap-4 border px-4 py-3 text-left transition-colors",
                i === idx ? "border-copper-500 bg-copper-500/10 text-white" : "border-steel-300/20 bg-ink-900/60 text-neutral-300 hover:border-sky-300/50",
              )}
            >
              <MechIcon name={b.icon} className={cn("h-8 w-8 shrink-0", i === idx ? "text-copper-400" : "text-sky-300")} />
              <span className="text-sm font-medium">{b.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
