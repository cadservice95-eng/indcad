import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InView } from "@/components/motion/InView";
import { Parallax } from "@/components/motion/Parallax";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { CivilHeroTerrain } from "@/components/svg/CivilHeroTerrain";
import { CivilIcon, type CivilIconName } from "@/components/svg/CivilIcons";

const cards: { icon: CivilIconName; title: string; line: string; pos: string; delay: number }[] = [
  { icon: "site", title: "Site Development", line: "Plans, grading and construction documentation", pos: "left-0 top-16 -translate-x-3 lg:-translate-x-8", delay: 6800 },
  { icon: "surface", title: "Civil 3D", line: "Surfaces, models and coordinated drawings", pos: "right-0 top-[40%] translate-x-3 lg:translate-x-6", delay: 7000 },
  { icon: "road", title: "Infrastructure", line: "Roads, drainage and services documentation", pos: "bottom-2 left-4 translate-y-4 lg:left-0", delay: 7200 },
];

export function CivilHero({ heading, description }: { heading: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b border-navy-800 bg-ink-950">
      <TechnicalGrid id="civil-hero-grid" className="text-sky-300/[0.07]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-0 h-[560px] w-[560px] rounded-full bg-sky-400/[0.07] blur-3xl" />
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-8 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-sky-300">
              Civil Engineering <span className="text-copper-400">•</span> Site Development <span className="text-copper-400">•</span> Infrastructure
            </p>
            <h1 style={{ "--d": "100ms" } as React.CSSProperties} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              {heading}
            </h1>
            <p style={{ "--d": "220ms" } as React.CSSProperties} className="reveal mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              {description}
            </p>
            <div style={{ "--d": "340ms" } as React.CSSProperties} className="reveal mt-9 flex flex-wrap gap-4">
              <Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button>
              <Button href="#covers" size="lg" variant="outline-light" arrow>Explore Civil Services</Button>
            </div>
            <p style={{ "--d": "460ms" } as React.CSSProperties} className="reveal mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
              {["Site Plans", "Grading", "Stormwater", "Roads", "Civil 3D"].map((t, i) => (
                <span key={t} className="flex items-center gap-3">
                  {i > 0 ? <span aria-hidden className="text-copper-500">•</span> : null}
                  {t}
                </span>
              ))}
            </p>
          </div>

          <div style={{ "--d": "400ms" } as React.CSSProperties} className="reveal relative">
            <Parallax className="border border-steel-300/20 bg-ink-900/60">
              <CivilHeroTerrain className="h-auto w-full" />
            </Parallax>
            {cards.map((c) => (
              <div key={c.title} style={{ "--d": `${c.delay}ms` } as React.CSSProperties} className={`reveal absolute z-10 hidden w-60 md:block ${c.pos}`}>
                <div className="rch-float group flex items-start gap-3 border border-steel-300/25 bg-ink-900/90 p-3.5 shadow-lg shadow-black/30 backdrop-blur hover:border-sky-300/50">
                  <CivilIcon name={c.icon} className="h-8 w-8 shrink-0 text-sky-300" />
                  <div>
                    <p className="text-sm font-semibold text-white">{c.title}</p>
                    <p className="mt-0.5 text-xs leading-snug text-neutral-400">{c.line}</p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ "--d": "900ms" } as React.CSSProperties} className="reveal -mt-5 ml-4 flex w-fit items-center gap-2 border border-steel-300/25 bg-ink-900 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-sky-300 shadow-lg shadow-black/30 md:hidden">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden />
              Survey → Terrain → Plans
            </div>
          </div>
        </Container>
      </InView>
    </section>
  );
}
