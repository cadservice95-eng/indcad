"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InView } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { Sld } from "@/components/svg/Sld";
import { CIRCUITS } from "./model";

/** Hero: an electrical single-line diagram drafted in real time; hover a circuit to trace it. */
export function ElecHero({ heading, description }: { heading: string; description: string }) {
  const [id, setId] = useState<string | null>(null);
  const c = CIRCUITS.find((x) => x.id === id);
  return (
    <section className="relative overflow-hidden border-b border-navy-800 bg-ink-950">
      <TechnicalGrid id="elec-hero-grid" className="text-sky-300/[0.07]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-0 h-[560px] w-[560px] rounded-full bg-sky-400/[0.07] blur-3xl" />
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-8 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-sky-300">
              Single-line <span className="text-copper-400">•</span> Schematic <span className="text-copper-400">•</span> Panel <span className="text-copper-400">•</span> As-built
            </p>
            <h1 style={{ "--d": "100ms" } as React.CSSProperties} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">{heading}</h1>
            <p style={{ "--d": "220ms" } as React.CSSProperties} className="reveal mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">{description}</p>
            <div style={{ "--d": "340ms" } as React.CSSProperties} className="reveal mt-9 flex flex-wrap gap-4">
              <Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button>
              <Button href="#covers" size="lg" variant="outline-light" arrow>Explore Electrical Documentation</Button>
            </div>
            <p style={{ "--d": "460ms" } as React.CSSProperties} className="reveal mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
              {["Switchboards", "Control panels", "Cable schedules", "BIM coordination"].map((t, i) => (
                <span key={t} className="flex items-center gap-3">{i > 0 ? <span aria-hidden className="text-copper-500">•</span> : null}{t}</span>
              ))}
            </p>
          </div>
          <div style={{ "--d": "400ms" } as React.CSSProperties} className="reveal relative">
            <div className="border border-steel-300/20 bg-ink-900/60 p-2">
              <Sld animate flow activeCircuit={id} onCircuit={(x) => setId(x)} className="h-auto w-full" />
            </div>
            <dl className="mt-3 grid grid-cols-4 gap-px border border-steel-300/20 bg-steel-300/20" aria-live="polite">
              {[["Circuit", c?.id ?? "—"], ["Source", c?.panel ?? "—"], ["Load", c?.load ?? "—"], ["Status", c ? "Documented" : "Hover"]].map(([k, v]) => (
                <div key={k} className="bg-ink-900 px-3 py-2.5">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-500">{k}</dt>
                  <dd className={`mt-0.5 font-mono text-xs ${k === "Status" && c ? "text-emerald-400" : "text-white"}`}>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">Illustrative diagram · hover a circuit</p>
          </div>
        </Container>
      </InView>
    </section>
  );
}
