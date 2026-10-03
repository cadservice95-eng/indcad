"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { cn } from "@/lib/utils";

const stages = [
  "Physical component",
  "Measurement / reference",
  "3D CAD model",
  "Assembly",
  "BOM",
  "Fabrication drawing",
  "Production",
];

const LINES = [["PHYSICAL", "COMPONENT"], ["MEASUREMENT /", "REFERENCE"], ["3D CAD", "MODEL"], ["ASSEMBLY"], ["BOM"], ["FABRICATION", "DRAWING"], ["PRODUCTION"]];
const COUNT = stages.length;
const slotX = (i: number) => 76 + i * 121;

/** Stage visibility/draw values are driven by the CSS variable --p (0…1) set on scroll. */
const showAt = (i: number) =>
  (i === 0 ? { opacity: 1 } : { opacity: `clamp(0, calc((var(--p) - ${(i / COUNT) * 0.92}) * 14), 1)` }) as React.CSSProperties;
const lineAt = (i: number) =>
  ({ strokeDasharray: 1, strokeDashoffset: `calc(1 - clamp(0, calc((var(--p) - ${((i + 0.4) / COUNT) * 0.92}) * 9), 1))` }) as React.CSSProperties;

const stroke = { stroke: "currentColor", strokeWidth: 1.5, strokeLinejoin: "round", strokeLinecap: "round", fill: "none" } as const;

function Slot({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(${slotX(i)} 150)`} style={showAt(i)} className="text-sky-300">
      <rect x="-48" y="-62" width="96" height="124" className="fill-ink-950" stroke="currentColor" strokeOpacity="0.45" />
      <g {...stroke}>{children}</g>
      <text x="-40" y="-48" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1">
        {String(i + 1).padStart(2, "0")}
      </text>
    </g>
  );
}

/**
 * Signature scroll animation: seven stages from a physical component to
 * production, revealed as the section scrolls (sticky on desktop, a vertical
 * list on small screens). Conceptual illustration, not a project claim.
 */
export function CadProductionFlow() {
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
      const raw = sticky ? -r.top / Math.max(r.height - vh, 1) : (vh * 0.7 - r.top) / Math.max(r.height * 0.9, 1);
      const p = Math.min(1, Math.max(0, raw));
      el.style.setProperty("--p", p.toFixed(3));
      const s = Math.min(COUNT, Math.floor(p * 0.92 * COUNT * 1.08) + (p > 0.01 ? 1 : 0));
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
    <section id="part-to-production" className="relative border-t border-navy-800 bg-ink-950">
      <div ref={ref} style={{ "--p": 0 } as React.CSSProperties} className="relative lg:h-[300vh]">
        <div className="relative overflow-hidden py-20 sm:py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
          <TechnicalGrid id="flow-grid" className="text-sky-300/[0.06]" />
          <Container className="relative">
            <SectionHeading
              tone="dark"
              eyebrow="Signature workflow"
              heading="From Physical Part to Production Documentation"
              description="Every requirement follows the same path: understand the part, build the model, document the assembly and release drawings the workshop can build from."
            />

            {/* desktop scene */}
            <div className="mt-10 hidden lg:block">
              <svg viewBox="0 0 880 262" fill="none" className="h-auto w-full" aria-hidden>
                {/* connectors */}
                <g className="text-copper-400">
                  {stages.slice(0, -1).map((_, i) => (
                    <g key={i}>
                      <path d={`M${slotX(i) + 50} 150H${slotX(i + 1) - 50}`} stroke="currentColor" strokeWidth="1.4" pathLength={1} style={lineAt(i)} />
                      <path d={`M${slotX(i + 1) - 49} 150l-6 -3.4v6.8z`} fill="currentColor" style={showAt(i + 1)} />
                    </g>
                  ))}
                </g>

                <Slot i={0}>
                  <path d="M-30 20V-24h20v14h40v34z" className="fill-steel-500/30" stroke="#a8b8c8" />
                  <circle cx="10" cy="8" r="6" className="fill-ink-950" stroke="#a8b8c8" />
                </Slot>
                <Slot i={1}>
                  <path d="M-30 20V-24h20v14h40v34z" strokeDasharray="2 4" />
                  <path d="M-30 34h60M-30 28v12M30 28v12M-40 -24v44M-46 -24h12M-46 20h12" stroke="#d68a51" strokeWidth="1" />
                </Slot>
                <Slot i={2}>
                  <path d="M0 -30l30 16v32L0 34l-30 -16v-32zM-30 -14l30 16 30 -16M0 2v32" className="fill-sky-400/10" />
                </Slot>
                <Slot i={3}>
                  <path d="M-28 28h56l8 -10h-56zM-24 8h48l8 -9h-48zM-18 -12h36l6 -8h-36z" />
                  <path d="M0 -20v-12M0 -1v-6" strokeDasharray="2 2" opacity="0.6" />
                </Slot>
                <Slot i={4}>
                  <path d="M-34 -30h68v60h-68zM-34 -14h68M-34 2h68M-34 18h68M-14 -30v60" />
                  <path d="M-8 -22h18M-8 -6h14M-8 10h18" opacity="0.5" />
                </Slot>
                <Slot i={5}>
                  <path d="M-34 -34h68v68h-68z" />
                  <path d="M-22 -20h28v22h-28zM12 -20h12v22H12z" opacity="0.8" />
                  <path d="M-22 14h44M-22 22h26" stroke="#38bdf8" strokeWidth="1" />
                </Slot>
                <Slot i={6}>
                  <path d="M-38 18h76v10h-76z" />
                  <path d="M-30 18v-14h16V18zM-2 18V0h14v18zM20 18v-10h14v10z" className="fill-sky-400/10" />
                  <circle cx="-30" cy="38" r="3" fill="currentColor" stroke="none" />
                  <circle cx="30" cy="38" r="3" fill="currentColor" stroke="none" />
                </Slot>

                {stages.map((label, i) => {
                  const lines = LINES[i];
                  return (
                    <text
                      key={label}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize="9"
                      letterSpacing="0.6"
                      fill={stage === i + 1 ? "#d68a51" : "#7dd3fc"}
                      style={showAt(i)}
                    >
                      {lines.map((ln, k) => (
                        <tspan key={ln} x={slotX(i)} y={236 + k * 13}>
                          {ln}
                        </tspan>
                      ))}
                    </text>
                  );
                })}
              </svg>
              <div className="mt-6 h-px w-full bg-steel-300/20">
                <div className="h-full origin-left bg-copper-500" style={{ transform: "scaleX(var(--p))" }} />
              </div>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">
                {stage === 0 ? "Scroll to begin" : `Stage ${stage} of ${COUNT} · ${stages[stage - 1]}`}
              </p>
            </div>

            {/* mobile / SEO list */}
            <ol className="relative mt-10 space-y-7 pl-10 lg:sr-only">
              <span aria-hidden className="absolute bottom-2 left-[11px] top-2 w-px bg-steel-300/20 lg:hidden">
                <span className="block h-full origin-top bg-copper-500" style={{ transform: "scaleY(var(--p))" }} />
              </span>
              {stages.map((label, i) => (
                <li key={label} className="relative">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -left-10 top-0 flex h-6 w-6 items-center justify-center border font-mono text-[10px] transition-colors duration-500 lg:hidden",
                      i < stage ? "border-copper-500 bg-ink-950 text-copper-400" : "border-steel-300/30 bg-ink-950 text-neutral-500",
                    )}
                  >
                    {i + 1}
                  </span>
                  <p className={cn("text-base font-medium transition-colors duration-500", i < stage ? "text-white" : "text-neutral-500")}>{label}</p>
                </li>
              ))}
            </ol>
          </Container>
        </div>
      </div>
    </section>
  );
}
