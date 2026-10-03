import type { Industry } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { BomVisualization } from "@/components/svg/BomVisualization";
import { MechIcon, type MechIconName } from "@/components/svg/MechIcons";
import { descriptionParagraphs } from "./content";

const parts: { n: string; title: string; text: string; icon: MechIconName }[] = [
  { n: "01", title: "CAD Model", text: "Accurate digital representation.", icon: "model3d" },
  { n: "02", title: "Production Documentation", text: "Fabrication drawings, assemblies and BOMs.", icon: "drawing" },
  { n: "03", title: "Workshop Output", text: "Documentation that supports actual production.", icon: "manufacturing" },
];

export function ManufacturingIntro({ industry }: { industry: Industry }) {
  const [first, second] = descriptionParagraphs(industry, "Documentation That Matches");
  return (
    <>
      <section id="documentation" className="scroll-mt-24 py-20 sm:py-28">
        <Container>
          <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <SectionHeading eyebrow="Manufacturing documentation" heading="Documentation That Matches Real Workshop Needs" />
            <div className="space-y-4 text-base leading-relaxed text-neutral-600">
              <p>{first}</p>
              <p>{second}</p>
            </div>
          </Reveal>

          <InView as="ol" className="group relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
            <span
              aria-hidden
              className="absolute left-0 right-0 top-[22px] hidden h-px origin-left scale-x-0 bg-gradient-to-r from-copper-500 via-sky-400 to-copper-500 transition-transform duration-[1800ms] ease-out group-data-[in=true]:scale-x-100 md:block"
            />
            {parts.map((b, i) => (
              <li key={b.n} className="reveal relative md:pt-14" style={{ "--d": `${i * 160}ms` } as React.CSSProperties}>
                <span className="absolute left-0 top-0 hidden h-11 w-11 items-center justify-center border border-neutral-300 bg-white text-steel-600 md:flex">
                  <MechIcon name={b.icon} className="h-7 w-7" />
                </span>
                <p className="font-mono text-xs tracking-[0.16em] text-copper-600">{b.n}</p>
                <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-navy-900">{b.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-600">{b.text}</p>
              </li>
            ))}
          </InView>
        </Container>
      </section>

      <section className="relative overflow-hidden border-t border-navy-800 bg-ink-900 py-16 sm:py-24">
        <TechnicalGrid id="mfg-bom-grid" className="text-sky-300/[0.06]" />
        <Container className="relative">
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Model → drawing → BOM"
              heading="One model, three connected outputs"
              description="Hover a BOM row to see the same part highlighted in the model and called out on the drawing."
            />
          </Reveal>
          <InView threshold={0.2} className="mt-10">
            <BomVisualization />
          </InView>
        </Container>
      </section>
    </>
  );
}
