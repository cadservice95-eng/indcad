"use client";

import type { ProcessStep } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { SteelFrame } from "@/components/structural/SteelFrame";
import { members } from "@/components/structural/steel";
import { useScrollStage } from "@/components/structural/useScrollStage";
import { cn } from "@/lib/utils";

const mono = { fontFamily: "var(--font-mono)" } as const;
const ids = (f: (id: string, k: string) => boolean) => members.filter((m) => f(m.id, m.kind)).map((m) => m.id);
const NODE_IDS = Array.from({ length: 12 }, (_, i) => `C-${String(i + 1).padStart(2, "0")}`);

// ───────── Signature: one steel frame → every fabricated piece ─────────

const SIG = [
  { label: "Assembled frame", line: "The engineer's structure as one model.", explode: 0, marks: false, hl: [] as string[] },
  { label: "Every member marked", line: "Each piece gets its own mark.", explode: 1, marks: true, hl: [] },
  { label: "Connection details", line: "Each connection gets its own detail.", explode: 0.9, marks: true, hl: NODE_IDS },
  { label: "Shop drawings", line: "Groups of pieces become shop drawings.", explode: 0.8, marks: true, hl: ids((id, k) => k === "beam" && id.startsWith("B-1")) },
  { label: "Material take-off", line: "Quantities follow the same model.", explode: 0.55, marks: true, hl: ids((_, k) => k === "beam") },
  { label: "Erection sequence", line: "Pieces go back together in order.", explode: 0.25, marks: false, hl: ids((_, k) => k === "col") },
  { label: "Fabrication package", line: "One organised, revision-controlled set.", explode: 0, marks: false, hl: [] },
];

export function SteelSignature() {
  const { ref, stage } = useScrollStage(SIG.length);
  const s = SIG[stage];
  return (
    <section id="one-frame" className="relative border-t border-navy-800 bg-ink-950">
      <div ref={ref} style={{ "--p": 0 } as React.CSSProperties} className="relative lg:h-[420vh]">
        <div className="relative overflow-hidden py-20 sm:py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
          <TechnicalGrid id="steel-sig-grid" className="text-sky-300/[0.06]" />
          <Container className="relative">
            <SectionHeading tone="dark" eyebrow="Signature view" heading="One Steel Frame → Every Fabricated Piece" description="Scroll to take the structure apart: each member, connection and group generates its own documentation, then everything returns as one package." />
            <div className="mt-8 grid items-center gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
              <div className="relative border border-steel-300/20 bg-ink-900/60 p-2">
                <SteelFrame explode={s.explode} highlightIds={s.hl} marks={s.marks ? members.map((m) => m.id) : undefined} detail={stage === 2 ? 1 : 0} className="h-auto w-full" viewBox="-40 30 720 480" />
                <div className={cn("pointer-events-none absolute inset-x-4 bottom-4 border border-copper-500/60 bg-ink-950/95 px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.18em] text-copper-400 transition-opacity duration-700", stage === SIG.length - 1 ? "opacity-100" : "opacity-0")}>Fabrication package · for construction</div>
              </div>
              <ol className="relative space-y-1 border-l border-copper-500/40 pl-5">
                {SIG.map((x, i) => (
                  <li key={x.label} className={cn("relative py-2.5 transition-opacity duration-500", i === stage ? "opacity-100" : "opacity-40")}>
                    <span aria-hidden className={cn("absolute -left-[26px] top-4 h-[9px] w-[9px] border bg-ink-950", i <= stage ? "border-copper-500 bg-copper-500" : "border-steel-300/40")} />
                    <p className="font-mono text-[11px] tracking-[0.16em] text-copper-400">{String(i + 1).padStart(2, "0")}</p>
                    <p className="text-base font-semibold text-white">{x.label}</p>
                    <p className="text-sm text-neutral-400">{x.line}</p>
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

// ───────── Process: one member through five stages ─────────

const INPUTS = ["DRAWINGS", "MODEL", "STANDARDS", "BOLT / WELD PREFS", "SITE · CRANE"];

function ProcessScene({ stage }: { stage: number }) {
  const g = (n: number, upTo?: number) => cn("transition-opacity duration-500", stage >= n && (upTo === undefined || stage <= upTo) ? "opacity-100" : "opacity-0");
  return (
    <svg viewBox="0 0 560 340" fill="none" className="h-auto w-full text-sky-300" role="img" aria-label="A steel member moving from design input through model, detailing, checking and a fabrication package" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 22V0h22M538 0h22M560 318v22h-22M22 340H0v-22" stroke="#38bdf8" strokeWidth="2" />
      {/* member */}
      <g style={{ transform: stage >= 4 ? "translate(0px, -34px) scale(0.78)" : "none", transformOrigin: "280px 170px", transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)" }}>
        <rect x="80" y="140" width="400" height="60" stroke="currentColor" strokeWidth="1.8" strokeDasharray={stage === 0 ? "7 5" : undefined} />
        <path d="M80 154h400M80 186h400" stroke="currentColor" strokeOpacity="0.6" />
        <g className={g(2)}>
          <rect x="72" y="132" width="8" height="76" className="fill-sky-400/25" stroke="currentColor" />
          <rect x="480" y="132" width="8" height="76" className="fill-sky-400/25" stroke="currentColor" />
          {[148, 170, 192].map((y) => <g key={y}><circle cx="94" cy={y} r="3" /><circle cx="466" cy={y} r="3" /></g>)}
          <circle cx="280" cy="100" r="15" className="fill-ink-950" /><text x="280" y="104" textAnchor="middle" fill="currentColor" fontSize="9" style={mono}>B-104</text>
        </g>
      </g>
      {/* 0 inputs */}
      <g className={g(0, 0)}>
        {INPUTS.map((t, i) => (
          <g key={t} transform={`translate(${40 + (i % 3) * 170} ${i < 3 ? 40 : 250})`}>
            <rect width={t.length * 7.4 + 18} height="24" className="fill-ink-950" stroke="currentColor" strokeOpacity="0.7" />
            <text x="9" y="16" fill="currentColor" fontSize="9.5" letterSpacing="1" style={mono}>{t}</text>
          </g>
        ))}
      </g>
      {/* 3 check */}
      <g className={g(3, 3)}>
        {["DESIGN INTENT", "CONNECTION", "FABRICATION PRACTICALITY"].map((t, i) => (
          <g key={t} transform={`translate(${40 + i * 180} 250)`}>
            <circle cx="10" cy="10" r="9" fill="#34d399" fillOpacity="0.16" stroke="#34d399" />
            <path d="M5.5 10.5l3 3 6 -7" stroke="#34d399" strokeWidth="1.6" />
            <text x="26" y="14" fill="currentColor" fontSize="8.5" letterSpacing="0.8" style={mono}>{t}</text>
          </g>
        ))}
        <g transform="translate(40 40)">
          <rect width="250" height="26" className="fill-ink-950" stroke="#d68a51" />
          <text x="10" y="17" fill="#d68a51" fontSize="9.5" letterSpacing="1" style={mono}>⚑ FLAG FOR ENGINEER REVIEW</text>
        </g>
      </g>
      {/* 4 package */}
      <g className={g(4)}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${70 + i * 150} 232)`}>
            <rect width="130" height="76" className="fill-ink-950" stroke="currentColor" strokeOpacity="0.7" />
            <path d="M10 18h60M10 30h46M10 62h110" stroke="currentColor" strokeOpacity="0.4" />
            <text x="10" y="50" fill="currentColor" fontSize="8" letterSpacing="1" style={mono}>{["SHOP DRAWING", "TAKE-OFF", "PIECE MARKS"][i]}</text>
          </g>
        ))}
        <text x="70" y="40" fill="#34d399" fontSize="11" letterSpacing="2" style={mono}>FABRICATION PACKAGE · FOR CONSTRUCTION</text>
      </g>
    </svg>
  );
}

export function SteelProcess({ steps }: { steps: ProcessStep[] }) {
  const { ref, stage } = useScrollStage(steps.length);
  return (
    <section id="workflow" className="relative scroll-mt-20 border-t border-navy-800 bg-ink-950">
      <div ref={ref} style={{ "--p": 0 } as React.CSSProperties} className="relative lg:h-[340vh]">
        <div className="relative overflow-hidden py-20 sm:py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
          <TechnicalGrid id="steel-proc-grid" className="text-sky-300/[0.06]" />
          <Container className="relative">
            <SectionHeading tone="dark" eyebrow="Workflow" heading="How Steel Detailing Moves to Fabrication" />
            <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
              <div className="border border-steel-300/20 bg-ink-900/60 p-2"><ProcessScene stage={stage} /></div>
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
