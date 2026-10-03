import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { ManufacturingSplit } from "@/components/svg/ManufacturingSplit";
import { Callout, Chips } from "./SplitSection";

export function ManufacturingDocumentation() {
  return (
    <section id="manufacturing-docs" className="relative overflow-hidden border-t border-navy-800 bg-ink-900 py-20 sm:py-28">
      <TechnicalGrid id="mfgdoc-grid" className="text-sky-300/[0.06]" />
      <Container className="relative">
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading tone="dark" eyebrow="Manufacturing documentation" heading="Documentation Built for the Workshop Floor" />
          <div className="space-y-4 text-base leading-relaxed text-neutral-300">
            <p>
              The paperwork is what a workshop or fabricator actually works from when they pick up a job: fabrication
              drawings, assembly drawings, BOMs and revision-controlled drawing sets, with material and finish called
              out where the part needs them.
            </p>
            <Callout dark>
              A beautifully drafted part that arrives in a format your team can&apos;t open or maintain is not useful
              documentation — it&apos;s a liability disguised as a deliverable.
            </Callout>
          </div>
        </Reveal>
        <InView threshold={0.25} className="relative mt-12 overflow-hidden border border-steel-300/20 bg-ink-950 p-3">
          <ManufacturingSplit className="h-auto w-full min-w-[560px] sm:min-w-0" />
        </InView>
        <div className="mt-6">
          <Chips
            dark
            items={[
              "Fabrication drawings",
              "Manufacturing drawings",
              "Assembly drawings",
              "BOMs",
              "GA drawings",
              "Material specifications",
              "Finish specifications",
              "Hardware schedules",
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
