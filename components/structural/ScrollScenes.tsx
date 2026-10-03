"use client";

import type { ProcessStep } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { StructIcon, type StructIconName } from "@/components/svg/StructIcons";
import { SteelFrame } from "./SteelFrame";
import { useScrollStage } from "./useScrollStage";
import { cn } from "@/lib/utils";

const mono = { fontFamily: "var(--font-mono)" } as const;

function Sticky({ id, children }: { id: string; children: React.ReactNode }) {
  return <section id={id} className="relative scroll-mt-20 border-t border-navy-800 bg-ink-950">{children}</section>;
}

// ───────── Signature: one model → many documents ─────────

const DOCS: { label: string; line: string; icon: StructIconName; ids: string[] }[] = [
  { label: "Piece mark", line: "B-104 tracked through fabrication", icon: "member", ids: ["B-104"] },
  { label: "Shop drawing", line: "Member, holes, welds and material", icon: "sheet", ids: ["B-101", "B-102", "B-103"] },
  { label: "Connection detail", line: "Plates, bolts and weld callouts", icon: "connection", ids: ["C-03", "C-02"] },
  { label: "Bolt information", line: "Sizes and counts per connection", icon: "blueprint", ids: ["C-05", "C-06"] },
  { label: "Material take-off", line: "Quantities from the same model", icon: "frame", ids: ["B-201", "B-202", "B-203", "B-204"] },
  { label: "Erection reference", line: "Grid, level and sequence marks", icon: "erected", ids: ["BR-01", "BR-02"] },
];

/** Signature scroll: the frame's documents emerge one by one into an organised package. */
export function SignatureExplode() {
  const { ref, stage } = useScrollStage(DOCS.length);
  return (
    <Sticky id="one-model">
      <div ref={ref} style={{ "--p": 0 } as React.CSSProperties} className="relative lg:h-[360vh]">
        <div className="relative overflow-hidden py-20 sm:py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
          <TechnicalGrid id="sig-grid" className="text-sky-300/[0.06]" />
          <Container className="relative">
            <SectionHeading tone="dark" eyebrow="Signature view" heading="One Structural Model → Many Fabrication Documents" description="Each member of the model feeds the documents a fabricator and a site team work from. Scroll to follow them out." />
            <div className="mt-8 grid items-center gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
              <div className="border border-steel-300/20 bg-ink-900/60 p-2">
                <SteelFrame highlightIds={DOCS[stage].ids} detail={1} className="h-auto w-full" viewBox="40 60 600 440" />
              </div>
              <ol className="relative grid gap-2 border-l border-copper-500/40 pl-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {DOCS.map((d, i) => (
                  <li
                    key={d.label}
                    style={{ transform: `translateX(calc((1 - clamp(0, calc((var(--p) - ${i * 0.15}) * 7), 1)) * -34px))`, opacity: `calc(0.35 + 0.65 * clamp(0, calc((var(--p) - ${i * 0.15}) * 7), 1))` }}
                    className={cn("flex items-start gap-3 border p-3 transition-colors duration-300", i === stage ? "border-copper-500 bg-copper-500/10" : "border-steel-300/20 bg-ink-900/70")}
                  >
                    <StructIcon name={d.icon} className={cn("h-8 w-8 shrink-0", i === stage ? "text-copper-400" : "text-sky-300")} />
                    <div>
                      <p className="text-sm font-semibold text-white">{d.label}</p>
                      <p className="mt-0.5 text-xs text-neutral-400">{d.line}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </div>
      </div>
    </Sticky>
  );
}

// ───────── Workflow: a beam travelling through five stations ─────────

const STATIONS = ["ENGINEER INPUT", "DETAILING", "COORDINATION", "DOCUMENTATION", "ISSUE"];

function BeamScene({ stage }: { stage: number }) {
  const vis = (n: number) => cn("transition-opacity duration-500", stage >= n ? "opacity-100" : "opacity-0");
  return (
    <svg viewBox="0 0 560 360" fill="none" className="h-auto w-full text-sky-300" role="img" aria-label="A steel beam passing through input, detailing, coordination, documentation and issue" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 22V0h22M538 0h22M560 338v22h-22M22 360H0v-22" stroke="#38bdf8" strokeWidth="2" />
      {/* beam */}
      <g>
        <rect x="60" y="130" width="440" height="80" stroke="currentColor" strokeWidth="1.8" strokeDasharray={stage === 0 ? "7 5" : undefined} className="transition-all duration-500" />
        <path d="M60 148h440M60 192h440" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
      </g>
      {/* 1 detailing */}
      <g className={vis(1)}>
        <rect x="60" y="122" width="10" height="96" className="fill-sky-400/25" stroke="currentColor" />
        <rect x="490" y="122" width="10" height="96" className="fill-sky-400/25" stroke="currentColor" />
        {[142, 170, 198].map((y) => <g key={y}><circle cx="42" cy={y} r="0" /><circle cx="86" cy={y} r="3.4" /><circle cx="474" cy={y} r="3.4" /></g>)}
        <g stroke="#d68a51" strokeWidth="0.9">
          <path d="M60 240H500M60 234v12M500 234v12" />
          <text x="250" y="258" fill="#d68a51" stroke="none" fontSize="10" style={mono}>4 800</text>
        </g>
        <circle cx="280" cy="94" r="14" className="fill-ink-950" />
        <text x="280" y="98" textAnchor="middle" fill="currentColor" fontSize="9.5" style={mono}>B-104</text>
      </g>
      {/* 2 coordination */}
      <g className={vis(2)}>
        <ellipse cx="380" cy="170" rx="30" ry="44" stroke="#f87171" strokeWidth="1.3" strokeDasharray="4 3" className={stage === 2 ? "rch-pulse" : ""} />
        {[[120, 170], [200, 170]].map(([x, y]) => <g key={x} transform={`translate(${x} ${y})`}><circle r="9" fill="#34d399" fillOpacity="0.18" stroke="#34d399" /><path d="M-4 0.5l3 3 5.5-6.5" stroke="#34d399" strokeWidth="1.6" /></g>)}
        <text x="352" y="238" fill="#34d399" fontSize="9.5" style={mono}>CHECKED</text>
      </g>
      {/* 3 documentation */}
      <g className={vis(3)}>
        <rect x="30" y="40" width="500" height="280" stroke="currentColor" strokeOpacity="0.6" />
        <path d="M30 276h500M360 276v44" stroke="currentColor" strokeOpacity="0.5" />
        <g fill="currentColor" fontSize="9" letterSpacing="1" style={mono}>
          <text x="40" y="292">SHOP DRAWING</text><text x="40" y="308" opacity="0.7">PIECE MARK B-104</text>
          <text x="370" y="292">REV</text><text x="370" y="308" opacity="0.7">FOR REVIEW</text>
        </g>
      </g>
      {/* 4 issue */}
      <g className={vis(4)}>
        <g transform="rotate(-8 400 120)">
          <rect x="296" y="96" width="196" height="40" stroke="#34d399" strokeWidth="2" />
          <text x="394" y="122" textAnchor="middle" fill="#34d399" fontSize="13" letterSpacing="2" style={mono}>FOR CONSTRUCTION</text>
        </g>
      </g>
      {/* stations */}
      <g>
        <path d="M60 336H500" stroke="currentColor" strokeOpacity="0.3" />
        {STATIONS.map((t, i) => {
          const x = 60 + i * 110;
          return (
            <g key={t}>
              <circle cx={x} cy="336" r="5" className={i <= stage ? "fill-copper-500" : "fill-ink-950"} stroke={i <= stage ? "#d68a51" : "currentColor"} />
              <text x={x} y="352" textAnchor="middle" fill={i === stage ? "#d68a51" : "#7dd3fc"} fontSize="7.5" letterSpacing="0.6" style={mono}>{t}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function StructWorkflow({ steps }: { steps: ProcessStep[] }) {
  const { ref, stage } = useScrollStage(steps.length);
  return (
    <Sticky id="workflow">
      <div ref={ref} style={{ "--p": 0 } as React.CSSProperties} className="relative lg:h-[340vh]">
        <div className="relative overflow-hidden py-20 sm:py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
          <TechnicalGrid id="sw-grid" className="text-sky-300/[0.06]" />
          <Container className="relative">
            <SectionHeading tone="dark" eyebrow="Workflow" heading="How Structural Detailing Moves From Input to Issue" />
            <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
              <div className="border border-steel-300/20 bg-ink-900/60 p-2"><BeamScene stage={stage} /></div>
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
    </Sticky>
  );
}

// ───────── Lifecycle: the same frame across project stages ─────────

const LIFE = [
  { label: "Tender", rev: 0, detail: 0 },
  { label: "Design development", rev: 1, detail: 1 },
  { label: "Coordination", rev: 2, detail: 2 },
  { label: "Fabrication", rev: 2, detail: 3 },
  { label: "Erection", rev: 2, detail: 4 },
  { label: "For construction", rev: 3, detail: 5 },
];

export function LifecycleScroll() {
  const { ref, stage } = useScrollStage(LIFE.length, false);
  const cur = LIFE[stage];
  return (
    <div ref={ref} className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <ol className="relative space-y-1 border-l border-neutral-300 pl-6">
        {LIFE.map((l, i) => (
          <li key={l.label} className="relative">
            <span aria-hidden className={cn("absolute -left-[31px] top-6 h-[10px] w-[10px] border bg-white transition-colors duration-500", i <= stage ? "border-copper-500 bg-copper-500" : "border-neutral-400")} />
            <div className={cn("flex items-center gap-4 py-3 transition-opacity duration-500", i === stage ? "opacity-100" : "opacity-50")}>
              <svg viewBox="0 0 64 44" className="h-11 w-16 shrink-0 text-steel-600" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                <rect x="1" y="1" width="62" height="42" />
                <path d={["M8 32h48M8 22h26", "M8 32h48M8 22h26M8 12h34", "M8 32h48M8 22h26M8 12h34M44 22l8 -8", "M8 32h48M8 22h26M8 12h34M44 22l8 -8M8 38h20", "M8 32h48M8 22h26M8 12h34M44 22l8 -8M8 38h20M40 38h16", "M8 32h48M8 22h26M8 12h34M44 22l8 -8M8 38h20M40 38h16M4 4l8 6"][i]} />
              </svg>
              <div>
                <p className="font-mono text-xs tracking-[0.16em] text-copper-600">{String(i + 1).padStart(2, "0")}</p>
                <p className="text-base font-semibold tracking-tight text-navy-900">{l.label}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="border border-navy-800 bg-ink-950 p-2 lg:sticky lg:top-28">
        <SteelFrame revision={cur.rev} detail={cur.detail} className="h-auto w-full" viewBox="40 50 600 460" />
        <p className="px-3 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">{cur.label}{stage === 5 ? " · FOR CONSTRUCTION" : ""}</p>
      </div>
    </div>
  );
}
