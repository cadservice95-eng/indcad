"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InView } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { MemberExploded } from "@/components/svg/MemberExploded";
import { ShopDiagram } from "@/components/svg/StructDiagrams";
import { SteelFrame } from "@/components/structural/SteelFrame";
import { cn } from "@/lib/utils";

/** Hero: staged steel frame; hover a member for its piece mark, or isolate one member with its connection and drawing. */
export function SteelHero({ heading, description }: { heading: string; description: string }) {
  const [lifted, setLifted] = useState(false);
  return (
    <section className="relative overflow-hidden border-b border-navy-800 bg-ink-950">
      <TechnicalGrid id="steel-hero-grid" className="text-sky-300/[0.07]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-0 h-[560px] w-[560px] rounded-full bg-slate-400/[0.07] blur-3xl" />
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-8 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-sky-300">
              Steel Detailing <span className="text-copper-400">•</span> Piece Marking <span className="text-copper-400">•</span> Fabrication
            </p>
            <h1 style={{ "--d": "100ms" } as React.CSSProperties} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">
              {heading}
            </h1>
            <p style={{ "--d": "220ms" } as React.CSSProperties} className="reveal mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              {description}
            </p>
            <div style={{ "--d": "340ms" } as React.CSSProperties} className="reveal mt-9 flex flex-wrap gap-4">
              <Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button>
              <Button href="#workflow" size="lg" variant="outline-light" arrow>View Detailing Workflow</Button>
            </div>
            <p style={{ "--d": "460ms" } as React.CSSProperties} className="reveal mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
              {["Shop drawings", "Connections", "Piece marks", "Erection"].map((t, i) => (
                <span key={t} className="flex items-center gap-3">{i > 0 ? <span aria-hidden className="text-copper-500">•</span> : null}{t}</span>
              ))}
            </p>
          </div>

          <div style={{ "--d": "400ms" } as React.CSSProperties} className="reveal relative">
            <div className="relative border border-steel-300/20 bg-ink-900/60">
              <SteelFrame animate interactive showInfoCard infoStyle="piece" liftId={lifted ? "B-104" : null} className="h-auto w-full" />
              <div className={cn("pointer-events-none absolute bottom-3 left-3 right-3 hidden grid-cols-2 gap-2 transition-opacity duration-500 md:grid", lifted ? "opacity-100" : "opacity-0")} aria-hidden={!lifted}>
                <div className="border border-steel-300/30 bg-ink-950/95 p-1" data-in="true"><p className="px-1 font-mono text-[9px] uppercase tracking-[0.14em] text-sky-300">Member + connection</p><MemberExploded kind="beam" className="h-auto w-full" /></div>
                <div className="border border-steel-300/30 bg-ink-950/95 p-1"><p className="px-1 font-mono text-[9px] uppercase tracking-[0.14em] text-sky-300">Shop drawing</p><div className="aspect-[320/160] overflow-hidden"><ShopDiagram /></div></div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <button type="button" onClick={() => setLifted((l) => !l)} aria-pressed={lifted} className="border border-copper-500 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-copper-400 transition-colors hover:bg-copper-500/10">
                {lifted ? "Show structure" : "Isolate member B-104"}
              </button>
              <p className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500 sm:block">Hover a member · illustrative values</p>
            </div>
          </div>
        </Container>
      </InView>
    </section>
  );
}
