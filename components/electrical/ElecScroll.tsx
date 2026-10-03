"use client";

import type { ProcessStep } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { Sld } from "@/components/svg/Sld";
import { useScrollStage } from "@/components/structural/useScrollStage";
import { cn } from "@/lib/utils";

const mono = { fontFamily: "var(--font-mono)" } as const;
const NAMES = ["INPUT", "DRAFT", "CHECK", "REVISE", "ISSUE"];

function Scene({ stage }: { stage: number }) {
  return (
    <div key={stage} data-in="true" className="relative aspect-[640/420] border border-steel-300/20 bg-ink-900/60 p-2">
      {stage === 0 ? (
        <div className="grid h-full content-center gap-3 p-6">
          {["Existing drawings", "Equipment schedules", "Site information · known changes"].map((t) => <p key={t} className="border border-steel-300/25 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-sky-300">{t}</p>)}
        </div>
      ) : (
        <Sld animate={stage === 1} revision={stage === 3 ? 2 : undefined} className="h-full w-full" />
      )}
      {stage === 2 ? (
        <>
          {[[98, 336], [162, 336], [288, 336], [352, 336], [478, 336], [542, 336]].map(([x, y], i) => (
            <svg key={i} viewBox="0 0 640 420" className="pointer-events-none absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]" fill="none" aria-hidden>
              <g transform={`translate(${x + 18} ${y - 22})`} className="fade-in" style={{ "--d": `${i * 220}ms` } as React.CSSProperties}>
                <circle r="9" fill="#22c55e" fillOpacity="0.18" stroke="#22c55e" /><path d="M-4 0.5l3 3 5.5-6.5" stroke="#22c55e" strokeWidth="1.6" />
              </g>
            </svg>
          ))}
          <p className="absolute bottom-3 left-4 border border-amber-400/50 bg-ink-950/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-400">Cross-check vs equipment schedule</p>
        </>
      ) : null}
      {stage === 3 ? <p className="absolute bottom-3 left-4 border border-copper-500/60 bg-ink-950/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-copper-400">Revision B · changes highlighted</p> : null}
      {stage === 4 ? (
        <svg viewBox="0 0 640 420" className="pointer-events-none absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]" fill="none" aria-hidden>
          <g transform="rotate(-8 480 60)" className="fade-in"><rect x="380" y="40" width="190" height="38" stroke="#22c55e" strokeWidth="2" /><text x="475" y="65" textAnchor="middle" fill="#22c55e" fontSize="13" letterSpacing="2" style={mono}>ISSUED · REV B</text></g>
        </svg>
      ) : null}
      <span className="pointer-events-none absolute left-4 top-4 border border-sky-300/40 bg-ink-950/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">{NAMES[stage]}</span>
    </div>
  );
}

export function ElecProcess({ steps }: { steps: ProcessStep[] }) {
  const { ref, stage } = useScrollStage(steps.length);
  return (
    <section id="workflow" className="relative scroll-mt-20 border-t border-navy-800 bg-ink-950">
      <div ref={ref} style={{ "--p": 0 } as React.CSSProperties} className="relative lg:h-[340vh]">
        <div className="relative overflow-hidden py-20 sm:py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
          <TechnicalGrid id="elec-proc-grid" className="text-sky-300/[0.06]" />
          <Container className="relative">
            <SectionHeading tone="dark" eyebrow="Workflow" heading="How Electrical Documentation Moves From Input to Issue" />
            <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
              <Scene stage={stage} />
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
