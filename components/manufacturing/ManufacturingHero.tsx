import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InView } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { FactoryCadGraphic } from "@/components/svg/FactoryCadGraphic";
import { ServiceIcon, type ServiceIconName } from "@/components/svg/ServiceIcons";

const cards: { icon: ServiceIconName; title: string; line: string; pos: string; delay: number }[] = [
  { icon: "conversion", title: "Manufacturing Documentation", line: "Drawings, models and BOMs", pos: "left-0 top-16 -translate-x-3 lg:-translate-x-8", delay: 3300 },
  { icon: "mechanical", title: "Reverse Engineering", line: "Legacy and undocumented components", pos: "right-0 top-[44%] translate-x-3 lg:translate-x-6", delay: 3500 },
  { icon: "engineering", title: "CAD Capacity", line: "Support during production and NPI cycles", pos: "bottom-2 left-4 translate-y-4 lg:left-0", delay: 3700 },
];

export function ManufacturingHero({ heading, description }: { heading: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b border-navy-800 bg-ink-950">
      <TechnicalGrid id="mfg-hero-grid" className="text-sky-300/[0.07]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-0 h-[560px] w-[560px] rounded-full bg-sky-400/[0.07] blur-3xl" />
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-8 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-sky-300">
              Manufacturing <span className="text-copper-400">•</span> CAD <span className="text-copper-400">•</span> Engineering Documentation
            </p>
            <h1 style={{ "--d": "100ms" } as React.CSSProperties} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">
              {heading}
            </h1>
            <p style={{ "--d": "220ms" } as React.CSSProperties} className="reveal mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              {description}
            </p>
            <div style={{ "--d": "340ms" } as React.CSSProperties} className="reveal mt-9 flex flex-wrap gap-4">
              <Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button>
              <Button href="#documentation" size="lg" variant="outline-light" arrow>Explore Manufacturing Solutions</Button>
            </div>
            <p style={{ "--d": "460ms" } as React.CSSProperties} className="reveal mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
              <span>3D CAD</span><span aria-hidden className="text-copper-500">•</span>
              <span>Fabrication Drawings</span><span aria-hidden className="text-copper-500">•</span>
              <span>BOMs</span><span aria-hidden className="text-copper-500">•</span>
              <span>Reverse Engineering</span>
            </p>
          </div>

          <div style={{ "--d": "400ms" } as React.CSSProperties} className="reveal relative">
            <div className="border border-steel-300/20 bg-ink-900/60">
              <FactoryCadGraphic className="h-auto w-full" />
            </div>
            {cards.map((c) => (
              <div key={c.title} style={{ "--d": `${c.delay}ms` } as React.CSSProperties} className={`reveal absolute z-10 hidden w-60 md:block ${c.pos}`}>
                <div className="rch-float flex items-start gap-3 border border-steel-300/25 bg-ink-900/90 p-3.5 shadow-lg shadow-black/30 backdrop-blur hover:border-sky-300/50">
                  <ServiceIcon name={c.icon} className="h-8 w-8 shrink-0 text-sky-300" />
                  <div>
                    <p className="text-sm font-semibold text-white">{c.title}</p>
                    <p className="mt-0.5 text-xs leading-snug text-neutral-400">{c.line}</p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ "--d": "900ms" } as React.CSSProperties} className="reveal -mt-5 ml-4 flex w-fit items-center gap-2 border border-steel-300/25 bg-ink-900 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-sky-300 shadow-lg shadow-black/30 md:hidden">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden />
              CAD · BOM · Production
            </div>
          </div>
        </Container>
      </InView>
    </section>
  );
}
