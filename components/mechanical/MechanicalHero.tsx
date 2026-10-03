import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InView } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { MechanicalHeroCAD } from "@/components/svg/MechanicalHeroCAD";
import { ServiceIcon, type ServiceIconName } from "@/components/svg/ServiceIcons";

const cards: { icon: ServiceIconName; title: string; line: string; pos: string; delay: number }[] = [
  { icon: "architectural", title: "2D Drafting", line: "Parts, assemblies & manufacturing drawings", pos: "left-0 top-16 -translate-x-3 lg:-translate-x-8", delay: 900 },
  { icon: "bim", title: "3D CAD", line: "Solid & surface modelling", pos: "right-0 top-[40%] translate-x-3 lg:translate-x-6", delay: 1050 },
  { icon: "conversion", title: "Documentation", line: "BOMs, revisions & supplier-ready files", pos: "bottom-2 left-4 translate-y-4 lg:left-0", delay: 1200 },
];

export function MechanicalHero({ heading, description }: { heading: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b border-navy-800 bg-ink-950">
      <TechnicalGrid id="mech-hero-grid" className="text-sky-300/[0.07]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-0 h-[560px] w-[560px] rounded-full bg-sky-400/[0.07] blur-3xl" />
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-8 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-sky-300">
              Mechanical Engineering <span className="text-copper-400">•</span> CAD <span className="text-copper-400">•</span> Manufacturing Documentation
            </p>
            <h1 style={{ "--d": "100ms" } as React.CSSProperties} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              {heading}
            </h1>
            <p style={{ "--d": "220ms" } as React.CSSProperties} className="reveal mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              {description}
            </p>
            <div style={{ "--d": "340ms" } as React.CSSProperties} className="reveal mt-9 flex flex-wrap gap-4">
              <Button href="/get-a-quote" size="lg" arrow>
                Get a Free Quote
              </Button>
              <Button href="#covers" size="lg" variant="outline-light" arrow>
                Explore Services
              </Button>
            </div>
            <p style={{ "--d": "460ms" } as React.CSSProperties} className="reveal mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
              <span>2D CAD</span><span aria-hidden className="text-copper-500">•</span>
              <span>3D Modelling</span><span aria-hidden className="text-copper-500">•</span>
              <span>Manufacturing Drawings</span><span aria-hidden className="text-copper-500">•</span>
              <span>Reverse Engineering</span>
            </p>
          </div>

          <div style={{ "--d": "400ms" } as React.CSSProperties} className="reveal relative">
            <Parallax className="border border-steel-300/20 bg-ink-900/60">
              <MechanicalHeroCAD className="h-auto w-full" />
            </Parallax>
            {cards.map((c) => (
              <div key={c.title} style={{ "--d": `${c.delay}ms` } as React.CSSProperties} className={`reveal absolute z-10 hidden w-56 md:block ${c.pos}`}>
                <div className="rch-float group flex items-start gap-3 border border-steel-300/25 bg-ink-900/90 p-3.5 shadow-lg shadow-black/30 backdrop-blur hover:border-sky-300/50">
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
              2D · 3D · BOM
            </div>
          </div>
        </Container>
      </InView>
    </section>
  );
}
