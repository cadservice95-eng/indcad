import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { TechnicalHeroArt } from "@/components/ui/TechnicalHeroArt";
import { TechnicalFrame } from "@/components/ui/TechnicalFrame";
import { Eyebrow } from "@/components/ui/SectionHeading";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-navy-800 bg-navy-950">
      <div className="absolute inset-0 bg-blueprint-grid opacity-60" aria-hidden />
      <Container className="relative grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <Eyebrow className="text-copper-400">CAD, drafting &amp; BIM — India-wide</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
            CAD Design &amp; Drafting Services Across India
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-300">
            Professional CAD, BIM, drafting and engineering design support for Indian engineers,
            architects, builders, manufacturers and contractors.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/get-a-quote" size="lg">
              Get a Free Quote
            </Button>
            <Button href="/projects" size="lg" variant="outline-light">
              View Our Projects
            </Button>
          </div>
        </div>

        <div className="hidden lg:block">
          <TechnicalFrame dark>
            <TechnicalHeroArt className="h-auto w-full" />
          </TechnicalFrame>
        </div>
      </Container>
    </section>
  );
}
