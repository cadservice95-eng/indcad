"use client";

import { useEffect, useRef, useState } from "react";
import { CivilSite, type Layers } from "@/components/svg/CivilSite";
import { CivilIcon, type CivilIconName } from "@/components/svg/CivilIcons";
import { cn } from "@/lib/utils";

const stages: { label: string; icon: CivilIconName; layers: Layers }[] = [
  { label: "Site preparation", icon: "land", layers: { survey: 1, terrain: 1, boundary: 1 } },
  { label: "Earthworks", icon: "grading", layers: { terrain: 1, boundary: 1, grading: 1 } },
  { label: "Drainage", icon: "drainage", layers: { terrain: 0.5, boundary: 1, grading: 0.4, drainage: 1 } },
  { label: "Roadworks", icon: "road", layers: { terrain: 0.4, boundary: 1, drainage: 0.8, roads: 1, lots: 0.5 } },
  { label: "Services", icon: "services", layers: { terrain: 0.3, boundary: 1, drainage: 0.8, roads: 1, lots: 0.6, services: 1, easements: 1 } },
  { label: "Final site works", icon: "construction", layers: { terrain: 0.3, boundary: 1, drainage: 0.8, roads: 1, lots: 1, services: 1, easements: 1, grading: 0.5, labels: 1 } },
];

/** Scroll-driven construction sequence: the site model fills in stage by stage. */
export function ConstructionSequence({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(0.999, Math.max(0, (window.innerHeight * 0.6 - r.top) / Math.max(r.height, 1)));
      const s = Math.floor(p * stages.length);
      setStage((prev) => (prev === s ? prev : s));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={cn("grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12", className)}>
      <ol className="relative space-y-1 border-l border-neutral-300 pl-6">
        {stages.map((s, i) => (
          <li key={s.label} className="relative">
            <span aria-hidden className={cn("absolute -left-[31px] top-5 h-[10px] w-[10px] border bg-white transition-colors duration-500", i <= stage ? "border-copper-500 bg-copper-500" : "border-neutral-400")} />
            <button
              type="button"
              onClick={() => setStage(i)}
              onFocus={() => setStage(i)}
              className={cn("flex w-full items-center gap-4 py-4 text-left transition-opacity duration-500", i === stage ? "opacity-100" : "opacity-50 hover:opacity-80")}
            >
              <CivilIcon name={s.icon} className={cn("h-9 w-9 shrink-0 transition-colors", i === stage ? "text-copper-600" : "text-steel-600")} />
              <span>
                <span className="block font-mono text-xs tracking-[0.16em] text-copper-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="block text-base font-semibold tracking-tight text-navy-900">{s.label}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="border border-navy-800 bg-ink-950 p-2 lg:sticky lg:top-28">
        <CivilSite layers={stages[stage].layers} className="h-auto w-full" title={`Site model at the ${stages[stage].label.toLowerCase()} stage`} />
      </div>
    </div>
  );
}
