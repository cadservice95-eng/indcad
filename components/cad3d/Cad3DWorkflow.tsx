"use client";

import { useEffect, useRef, useState } from "react";
import type { ProcessStep } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { ParametricPart } from "@/components/svg/ParametricPart";
import { ExplodedParts } from "@/components/svg/ExplodedParts";
import { makeIso, loop, seg } from "@/components/svg/iso";
import { cn } from "@/lib/utils";

const OUTPUTS = ["STEP", "IGES", "STL", "DRAWING", "EXPLODED VIEW"];
const sk = makeIso(300, 150, 2);

/** Scene for the active workflow stage (0-based). Stages cross-fade; geometry is static. */
function Scene({ stage }: { stage: number }) {
  const show = (n: number) => cn("transition-opacity duration-500", stage === n ? "opacity-100" : "opacity-0");
  return (
    <svg viewBox="0 0 560 380" fill="none" className="h-auto w-full" role="img" aria-label="CAD model evolving from sketch to part, assembly, validated model and output files">
      <path d="M0 22V0h22M538 0h22M560 358v22h-22M22 380H0v-22" stroke="#38bdf8" strokeWidth="2" />
      {/* 1 sketch */}
      <g className={cn(show(0), "text-copper-400")}>
        <path d={loop(sk(-10, -10, 0), sk(115, -10, 0), sk(115, 70, 0), sk(-10, 70, 0))} stroke="currentColor" strokeWidth="1.4" strokeDasharray="6 4" transform="translate(-10 40)" />
        <path d={seg(sk(40, 25, 0), sk(60, 25, 0)) + seg(sk(50, 15, 0), sk(50, 35, 0))} stroke="currentColor" transform="translate(-10 40)" />
        <text x="40" y="350" fill="currentColor" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.6">01 · SKETCH</text>
      </g>
      {/* 2 part */}
      <g className={show(1)}>
        <g className="text-sky-300"><ParametricPart cx={290} cy={150} s={2} mesh /></g>
        <text x="40" y="350" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.6">02 · 3D PART</text>
      </g>
      {/* 3 assembly */}
      <g className={show(2)}>
        <g transform="translate(60 -10)"><ExplodedParts balloons /></g>
        <text x="40" y="350" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.6">03 · ASSEMBLY</text>
      </g>
      {/* 4 validation */}
      <g className={show(3)}>
        <g className="text-sky-300"><ParametricPart cx={290} cy={150} s={2} /></g>
        {[[200, 120], [380, 150], [300, 230]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="12" fill="#34d399" fillOpacity="0.18" stroke="#34d399" strokeWidth="1.3" />
            <path d="M-5 0.5l3.6 3.8 6.6-8" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
        <text x="40" y="350" fill="#34d399" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.6">04 · VALIDATED</text>
      </g>
      {/* 5 outputs */}
      <g className={show(4)}>
        <g className="text-sky-300"><ParametricPart cx={280} cy={118} s={1.2} /></g>
        {OUTPUTS.map((o, i) => (
          <g key={o} transform={`translate(${34 + i * 104} 270)`}>
            <path d={`M${46 - (34 + i * 104 - 190) / 6} -52V-10`} stroke="#d68a51" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />
            <rect width={o.length > 6 ? 100 : 88} height="30" className="fill-ink-950" stroke="#7dd3fc" strokeOpacity="0.7" />
            <text x={(o.length > 6 ? 100 : 88) / 2} y="19" textAnchor="middle" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1">{o}</text>
          </g>
        ))}
        <text x="40" y="350" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.6">05 · OUTPUTS</text>
      </g>
    </svg>
  );
}

/**
 * Signature scroll workflow: as the section scrolls (sticky on desktop) the
 * model evolves from sketch to outputs while the matching step is highlighted.
 */
export function Cad3DWorkflow({ steps }: { steps: ProcessStep[] }) {
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
          <TechnicalGrid id="cad3d-flow-grid" className="text-sky-300/[0.06]" />
          <Container className="relative">
            <SectionHeading tone="dark" eyebrow="Workflow" heading="How 3D CAD Modelling Works" description="The intended downstream use shapes how the model is built — so it is stated up front and checked before delivery." />
            <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
              <div className="border border-steel-300/20 bg-ink-900/60 p-2">
                <Scene stage={stage} />
              </div>
              <ol className="relative space-y-1 border-l border-steel-300/20 pl-6">
                <span aria-hidden className="absolute -left-px top-0 w-px origin-top bg-copper-500" style={{ height: "100%", transform: "scaleY(var(--p))" }} />
                {steps.map((s, i) => (
                  <li key={s.title} className={cn("relative py-3 transition-opacity duration-500", i === stage ? "opacity-100" : "opacity-45")}>
                    <span
                      aria-hidden
                      className={cn("absolute -left-[31px] top-4 flex h-[10px] w-[10px] items-center justify-center border bg-ink-950 transition-colors duration-500", i <= stage ? "border-copper-500" : "border-steel-300/40")}
                    >
                      <span className={cn("h-1 w-1", i <= stage ? "bg-copper-500" : "bg-transparent")} />
                    </span>
                    <p className="font-mono text-xs tracking-[0.16em] text-copper-400">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-0.5 text-base font-semibold tracking-tight text-white">{s.title}</h3>
                    <p className={cn("mt-1 text-sm leading-relaxed text-neutral-400 transition-[max-height,opacity] duration-500 lg:overflow-hidden", i === stage ? "lg:max-h-40 lg:opacity-100" : "lg:max-h-0 lg:opacity-0")}>
                      {s.description}
                    </p>
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
