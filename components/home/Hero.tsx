import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InView } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { HeroCadGraphic } from "@/components/svg/HeroCadGraphic";
import { ServiceIcon, type ServiceIconName } from "@/components/svg/ServiceIcons";
import { cn } from "@/lib/utils";

const floatingCards: {
  icon: ServiceIconName;
  title: string;
  line: string;
  className: string;
  delay: number;
}[] = [
  {
    icon: "architectural",
    title: "CAD Drafting",
    line: "2D / 3D technical documentation",
    className: "left-0 top-6 -translate-x-3 lg:-translate-x-8",
    delay: 900,
  },
  {
    icon: "bim",
    title: "BIM Modelling",
    line: "Coordinated digital building models",
    className: "right-0 top-[42%] translate-x-3 lg:translate-x-6",
    delay: 1050,
  },
  {
    icon: "engineering",
    title: "Engineering",
    line: "Production-ready technical drawings",
    className: "bottom-2 left-4 translate-y-4 lg:left-0",
    delay: 1200,
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-navy-800 bg-ink-950">
      <TechnicalGrid id="hero-grid" className="text-sky-300/[0.07]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[560px] w-[560px] rounded-full bg-sky-400/[0.07] blur-3xl"
      />
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-8 lg:pb-24 lg:pt-20">
          <div>
            <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
              CAD <span className="text-copper-400">•</span> BIM <span className="text-copper-400">•</span>{" "}
              Engineering <span className="text-copper-400">•</span> Drafting
            </p>
            <h1
              style={{ "--d": "100ms" } as React.CSSProperties}
              className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.15rem]"
            >
              Precision CAD &amp; BIM Solutions Built for Modern Engineering
            </h1>
            <p
              style={{ "--d": "220ms" } as React.CSSProperties}
              className="reveal mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg"
            >
              Professional CAD drafting, BIM modelling, engineering design and technical documentation for
              architects, engineers, contractors and businesses across India.
            </p>
            <div style={{ "--d": "340ms" } as React.CSSProperties} className="reveal mt-9 flex flex-wrap gap-4">
              <Button href="/get-a-quote" size="lg" arrow>
                Request a Quote
              </Button>
              <Button href="/services" size="lg" variant="outline-light" arrow>
                Explore Services
              </Button>
            </div>
            <p
              style={{ "--d": "460ms" } as React.CSSProperties}
              className="reveal mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400"
            >
              <span>India-wide engineering support</span>
              <span aria-hidden className="text-copper-500">•</span>
              <span>Detailed documentation</span>
              <span aria-hidden className="text-copper-500">•</span>
              <span>Professional workflows</span>
            </p>
          </div>

          <div style={{ "--d": "400ms" } as React.CSSProperties} className="reveal relative">
            <div className="relative border border-steel-300/20 bg-ink-900/60">
              <HeroCadGraphic className="h-auto w-full" />
            </div>

            {floatingCards.map((card) => (
              <div
                key={card.title}
                style={{ "--d": `${card.delay}ms` } as React.CSSProperties}
                className={cn(
                  "reveal absolute z-10 hidden w-56 md:block",
                  card.className,
                )}
              >
                <div className="rch-float flex items-start gap-3 border border-steel-300/25 bg-ink-900/90 p-3.5 shadow-lg shadow-black/30 backdrop-blur hover:border-sky-300/50">
                  <ServiceIcon name={card.icon} className="h-8 w-8 shrink-0 text-sky-300" />
                  <div>
                    <p className="text-sm font-semibold text-white">{card.title}</p>
                    <p className="mt-0.5 text-xs leading-snug text-neutral-400">{card.line}</p>
                  </div>
                </div>
              </div>
            ))}

            <div
              style={{ "--d": "900ms" } as React.CSSProperties}
              className="reveal -mt-5 ml-4 flex w-fit items-center gap-2 border border-steel-300/25 bg-ink-900 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-sky-300 shadow-lg shadow-black/30 md:hidden"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden />
              BIM · DWG · 3D model
            </div>
          </div>
        </Container>
      </InView>
    </section>
  );
}
