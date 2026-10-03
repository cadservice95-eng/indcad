import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { PlanToModel } from "@/components/svg/PlanToModel";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";

export function AboutSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Eyebrow>Engineering support</Eyebrow>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-navy-900 sm:text-4xl">
            Technical expertise that turns ideas into accurate documentation
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-600">
            <p>
              Render CAD Hub supports engineers, architects, contractors and manufacturers across India with CAD
              drafting, BIM modelling, CAD conversion and engineering design — delivered remotely, so location is
              never a constraint.
            </p>
            <p>
              We start from whatever you have: clean CAD files, PDFs, scanned drawings, photographs of a part or a
              written brief. The output is built for its purpose — fabrication, construction, approval or reference.
            </p>
            <p>
              Scope and price are agreed before drafting begins. We work as capacity alongside your team, to your
              standards, and our drawings support the sign-off of your licensed engineer or architect rather than
              replacing it.
            </p>
          </div>
          <Link
            href="/about"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy-900 transition-colors hover:text-copper-600"
          >
            More about how we work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Reveal>

        <InView className="relative overflow-hidden border border-navy-800 bg-ink-950" threshold={0.35}>
          <TechnicalGrid id="about-grid" className="text-sky-300/[0.08]" minor={20} major={100} />
          <PlanToModel className="relative h-auto w-full" />
        </InView>
      </Container>
    </section>
  );
}
