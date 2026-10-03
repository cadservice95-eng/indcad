"use client";

import { useEffect, useRef, useState } from "react";
import { CivilSite, type Layers } from "@/components/svg/CivilSite";
import { cn } from "@/lib/utils";

const TABS: { id: string; label: string; note: string; layers: Layers }[] = [
  { id: "site", label: "Site plan", note: "Boundary, lot layout and road reserve on the surveyed terrain.", layers: { boundary: 1, lots: 1, roads: 1, terrain: 0.3, labels: 1 } },
  { id: "grading", label: "Grading plan", note: "Proposed contours and fall directions across the same site.", layers: { terrain: 1, grading: 1, boundary: 1, roads: 0.5, labels: 1 } },
  { id: "storm", label: "Stormwater plan", note: "Catchments, pits, pipes and outfall referenced to the same surface.", layers: { drainage: 1, roads: 1, boundary: 1, terrain: 0.25, lots: 0.3, labels: 1 } },
  { id: "road", label: "Road plan", note: "Alignment and services corridor coordinated with lots and ground.", layers: { roads: 1, services: 1, boundary: 0.6, terrain: 0.4, lots: 0.25, labels: 1 } },
];

type Toggle = { id: string; label: string; layers: (keyof Layers)[] };
const SIGNATURE: Toggle[] = [
  { id: "survey", label: "Survey", layers: ["survey"] },
  { id: "terrain", label: "Terrain", layers: ["terrain"] },
  { id: "lots", label: "Lots", layers: ["lots", "boundary"] },
  { id: "roads", label: "Roads", layers: ["roads"] },
  { id: "grading", label: "Grading", layers: ["grading"] },
  { id: "drainage", label: "Drainage", layers: ["drainage"] },
  { id: "services", label: "Services", layers: ["services", "easements"] },
];
const SUBDIVISION: Toggle[] = [
  { id: "lots", label: "Lots", layers: ["lots"] },
  { id: "roads", label: "Roads", layers: ["roads"] },
  { id: "easements", label: "Easements", layers: ["easements"] },
  { id: "services", label: "Services", layers: ["services"] },
  { id: "drainage", label: "Drainage", layers: ["drainage"] },
];

/**
 * Layer-driven view of one synthetic civil model.
 * kind="tabs": four drawing views of the same site. kind="signature": build the
 * project up layer by layer. kind="subdivision": toggle lot-level layers.
 */
export function CivilLayerExplorer({ kind, className }: { kind: "tabs" | "signature" | "subdivision"; className?: string }) {
  const toggles = kind === "subdivision" ? SUBDIVISION : SIGNATURE;
  const [tab, setTab] = useState(0);
  const [on, setOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(toggles.map((t) => [t.id, kind === "subdivision" ? true : t.id === "survey" || t.id === "terrain"])),
  );
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  function build() {
    if (timer.current) clearInterval(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(Object.fromEntries(toggles.map((t) => [t.id, true])));
      return;
    }
    setOn(Object.fromEntries(toggles.map((t) => [t.id, false])));
    let i = 0;
    timer.current = setInterval(() => {
      const t = toggles[i];
      if (!t) {
        if (timer.current) clearInterval(timer.current);
        return;
      }
      setOn((prev) => ({ ...prev, [t.id]: true }));
      i++;
    }, 650);
  }

  let layers: Layers = {};
  if (kind === "tabs") layers = TABS[tab].layers;
  else {
    for (const t of toggles) if (on[t.id]) for (const l of t.layers) layers[l] = 1;
    layers.labels = 1;
    if (kind === "subdivision") {
      layers.boundary = 1;
      layers.terrain = 0.3;
    }
  }
  const count = toggles.filter((t) => on[t.id]).length;

  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1fr_250px]", className)}>
      <div className="relative border border-steel-300/25 bg-ink-950 p-2">
        <CivilSite layers={layers} className="h-auto w-full" title={kind === "tabs" ? `${TABS[tab].label} of one civil model` : "Civil model with switchable layers"} />
        <span className="pointer-events-none absolute left-4 top-4 border border-sky-300/40 bg-ink-950/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">
          {kind === "tabs" ? TABS[tab].label : `${count} of ${toggles.length} layers`}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {kind === "tabs" ? (
          <>
            <div role="tablist" aria-label="Drawing views" className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === i}
                  onClick={() => setTab(i)}
                  className={cn("border px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.14em] transition-colors", tab === i ? "border-copper-500 bg-copper-500/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="border border-steel-300/20 bg-ink-900/60 p-4 text-sm leading-relaxed text-neutral-300" aria-live="polite">{TABS[tab].note}</p>
          </>
        ) : (
          <>
            <ul className="border border-steel-300/20 bg-ink-900/60">
              {toggles.map((t) => (
                <li key={t.id} className="border-b border-steel-300/10 last:border-b-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={!!on[t.id]}
                    onClick={() => setOn((p) => ({ ...p, [t.id]: !p[t.id] }))}
                    className="flex w-full items-center justify-between px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-neutral-200 transition-colors hover:bg-white/5"
                  >
                    {t.label}
                    <span className={cn("rounded-sm px-2 py-0.5 text-[10px]", on[t.id] ? "bg-emerald-400/15 text-emerald-400" : "bg-white/5 text-neutral-500")}>{on[t.id] ? "ON" : "OFF"}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button type="button" onClick={build} className="flex-1 border border-copper-500 px-3 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-copper-400 transition-colors hover:bg-copper-500/10">
                Build up
              </button>
              <button type="button" onClick={() => setOn(Object.fromEntries(toggles.map((t) => [t.id, true])))} className="flex-1 border border-steel-300/30 px-3 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-neutral-300 transition-colors hover:border-sky-300/60">
                All on
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
