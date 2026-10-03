"use client";

import { useEffect, useRef, useState } from "react";
import { ParametricPart, partAnchors, FEATURES, type FeatureId } from "@/components/svg/ParametricPart";
import { DimensionLine } from "@/components/svg/DimensionLines";
import { cn } from "@/lib/utils";

const DETAIL: Record<FeatureId, string> = {
  sketch: "Profile 125 × 80",
  extrude: "Depth 12 · boss 30",
  fillet: "R8 · plate corners",
  hole: "Ø20 · boss bore",
  chamfer: "1.5 × 45° · boss edge",
  pattern: "4× Ø9 · from plate centre",
};

/** Eases a number toward `target` over ~450ms (reduced-motion users get the value straight away). */
function useTween(target: number) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  const raf = useRef(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = target;
      raf.current = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf.current);
    }
    const start = performance.now();
    const a = from.current;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 450);
      const e = 1 - Math.pow(1 - t, 3);
      const v = a + (target - a) * e;
      from.current = v;
      setValue(v);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);
  return value;
}

/**
 * CAD-style feature tree beside a model. mode="hover": feature ↔ geometry
 * highlighting. mode="param": change LENGTH and the model rebuilds.
 * A visual simulation, not a CAD engine.
 */
export function FeatureTreeModel({ mode, className }: { mode: "hover" | "param"; className?: string }) {
  const [active, setActive] = useState<FeatureId | null>(null);
  const [length, setLength] = useState(120);
  const [flash, setFlash] = useState(false);
  const L = useTween(length);

  function update(v: number) {
    setLength(v);
    setFlash(true);
  }
  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(false), 1400);
    return () => clearTimeout(id);
  }, [flash, length]);

  const a = partAnchors(L, 80, 12, 30, 1.9, 300, 128);

  return (
    <div className={cn("grid gap-4 lg:grid-cols-[280px_1fr]", className)}>
      {/* tree */}
      <div className="border border-steel-300/25 bg-ink-950">
        <div className="flex items-center justify-between border-b border-steel-300/20 px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Feature tree</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">Part 1047</p>
        </div>
        <ul className="py-2" role="list">
          {FEATURES.map((f, i) => {
            const rebuilt = mode === "param" && flash && (f.id === "sketch" || f.id === "extrude" || f.id === "pattern" || f.id === "fillet");
            return (
              <li key={f.id}>
                <button
                  type="button"
                  onMouseEnter={() => mode === "hover" && setActive(f.id)}
                  onMouseLeave={() => mode === "hover" && setActive(null)}
                  onFocus={() => mode === "hover" && setActive(f.id)}
                  onBlur={() => mode === "hover" && setActive(null)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left font-mono text-[13px] transition-colors",
                    active === f.id ? "bg-copper-500/10 text-white" : "text-neutral-300 hover:bg-white/5",
                    mode === "param" && "cursor-default",
                  )}
                >
                  <span aria-hidden className={cn("text-neutral-600", i === 0 ? "" : "")}>{i === FEATURES.length - 1 ? "└─" : "├─"}</span>
                  <span className={cn("h-2 w-2 shrink-0", active === f.id ? "bg-copper-500" : "bg-sky-400/70")} aria-hidden />
                  <span className="flex-1">{f.label}</span>
                  {rebuilt ? <span className="text-[10px] uppercase tracking-wider text-emerald-400">rebuilt</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
        {mode === "hover" ? (
          <p className="border-t border-steel-300/20 px-4 py-3 text-xs text-neutral-400">
            {active ? DETAIL[active] : "Hover or focus a feature to see the geometry it controls."}
          </p>
        ) : (
          <div className="border-t border-steel-300/20 p-4">
            <label htmlFor="len" className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-sky-300">
              Length
              <span className="text-white">{Math.round(length)} mm</span>
            </label>
            <input
              id="len"
              type="range"
              min={110}
              max={150}
              step={1}
              value={length}
              onChange={(e) => update(Number(e.target.value))}
              className="mt-3 w-full accent-sky-400"
            />
            <div className="mt-3 flex gap-2">
              {[120, 145].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => update(v)}
                  className={cn(
                    "flex-1 border px-3 py-2 font-mono text-xs transition-colors",
                    length === v ? "border-copper-500 text-copper-400" : "border-steel-300/30 text-neutral-300 hover:border-sky-300/60",
                  )}
                >
                  {v} mm
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* model */}
      <div className="relative border border-steel-300/25 bg-ink-950 p-2">
        <svg viewBox="0 0 600 360" fill="none" className="h-auto w-full" role="img" aria-label="3D model of a flanged part whose geometry responds to its feature tree">
          <path d="M0 22V0h22M578 0h22v22M600 338v22h-22M22 360H0v-22" stroke="#38bdf8" strokeWidth="2" />
          <ParametricPart L={L} cx={300} cy={128} highlight={mode === "hover" ? active : null} />
          <DimensionLine x1={a.frontA[0]} y1={a.frontA[1]} x2={a.frontB[0]} y2={a.frontB[1]} offset={32} label={`L ${L.toFixed(0)}`} className="text-copper-400" />
        </svg>
        <div className="pointer-events-none absolute left-4 top-4 flex gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
          <span className="border border-sky-300/40 bg-ink-950/90 px-2 py-1 text-sky-300">3D model</span>
          {mode === "param" ? (
            <span className={cn("border px-2 py-1 transition-opacity duration-300", flash ? "border-emerald-400/60 text-emerald-400 opacity-100" : "border-transparent opacity-0")}>
              Parametric update
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
