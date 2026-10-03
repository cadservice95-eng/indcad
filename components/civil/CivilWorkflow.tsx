"use client";

import { useEffect, useRef, useState } from "react";
import type { ProcessStep } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { CivilSite, type Layers } from "@/components/svg/CivilSite";
import { cn } from "@/lib/utils";

const SCENES: Layers[] = [
  { survey: 1, boundary: 0.6 },
  { survey: 0.5, terrain: 1, boundary: 1 },
  { terrain: 0.6, boundary: 1, roads: 1, drainage: 1, lots: 0.6 },
  { terrain: 0.6, boundary: 1, roads: 1, drainage: 1, lots: 1, services: 1, grading: 1, easements: 1 },
  { terrain: 0.3, boundary: 1, roads: 1, drainage: 1, lots: 1, services: 1, easements: 1, labels: 1 },
];
const CAPTIONS = ["SURVEY POINTS", "TERRAIN SURFACE", "ROAD + DRAINAGE ADDED", "PLANS SYNCHRONISED", "CONSTRUCTION DOCUMENTATION"];
const SHEETS = ["C-001 SITE PLAN", "C-101 GRADING", "C-201 STORMWATER", "C-301 ROAD DESIGN"];

/** Sticky scroll workflow: the model grows from survey points to a documented set as each step is reached. */
export function CivilWorkflow({ steps }: { steps: ProcessStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const sticky = window.matchMedia("(min-width: 1024px)").matches;
      const raw = sticky ? -r.top / Math.max(r.height - vh, 1) : (vh * 0.65 - r.top) / Math.max(r.height * 0.85, 1);
      const p = Math.min(0.999, Math.max(0, raw));
      el.style.setProperty("--p", p.toFixed(3));
      const s = Math.min(steps.length - 1, Math.floor(p * steps.length));
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
  }, [steps.length]);

  return (
    <section id="workflow" className="relative scroll-mt-20 border-t border-navy-800 bg-ink-950">
      <div ref={ref} style={{ "--p": 0 } as React.CSSProperties} className="relative lg:h-[320vh]">
        <div className="relative overflow-hidden py-20 sm:py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
          <TechnicalGrid id="civil-flow-grid" className="text-sky-300/[0.06]" />
          <Container className="relative">
            <SectionHeading tone="dark" eyebrow="Process" heading="How Civil Drafting Works" />
            <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
              <div className="relative border border-steel-300/20 bg-ink-900/60 p-2">
                <CivilSite layers={SCENES[stage] ?? SCENES[0]} className="h-auto w-full" title="Site model growing from survey points to documented civil design" />
                <span className="pointer-events-none absolute left-4 top-4 border border-sky-300/40 bg-ink-950/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">{CAPTIONS[stage]}</span>
                <ul className={cn("absolute bottom-4 right-4 hidden border border-steel-300/30 bg-ink-950/90 p-3 font-mono text-[9.5px] uppercase tracking-[0.12em] text-neutral-300 transition-opacity duration-500 sm:block", stage === 4 ? "opacity-100" : "opacity-0")}>
                  {SHEETS.map((s) => <li key={s} className="py-0.5">{s}</li>)}
                </ul>
              </div>
              <ol className="relative space-y-1 border-l border-steel-300/20 pl-6">
                <span aria-hidden className="absolute -left-px top-0 w-px origin-top bg-copper-500" style={{ height: "100%", transform: "scaleY(var(--p))" }} />
                {steps.map((s, i) => (
                  <li key={s.title} className={cn("relative py-3 transition-opacity duration-500", i === stage ? "opacity-100" : "opacity-45")}>
                    <span aria-hidden className={cn("absolute -left-[31px] top-4 flex h-[10px] w-[10px] items-center justify-center border bg-ink-950 transition-colors duration-500", i <= stage ? "border-copper-500" : "border-steel-300/40")}>
                      <span className={cn("h-1 w-1", i <= stage ? "bg-copper-500" : "bg-transparent")} />
                    </span>
                    <p className="font-mono text-xs tracking-[0.16em] text-copper-400">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-0.5 text-base font-semibold tracking-tight text-white">{s.title}</h3>
                    <p className={cn("mt-1 text-sm leading-relaxed text-neutral-400 transition-[max-height,opacity] duration-500 lg:overflow-hidden", i === stage ? "lg:max-h-44 lg:opacity-100" : "lg:max-h-0 lg:opacity-0")}>{s.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
