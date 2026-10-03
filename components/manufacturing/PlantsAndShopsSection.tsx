import type { Industry } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { LargePlantGraphic, JobShopGraphic } from "@/components/svg/PlantsAndShops";
import { descriptionParagraphs } from "./content";

const panels = [
  {
    title: "Established Manufacturing Operations",
    Graphic: LargePlantGraphic,
    points: ["Existing drawing standards", "Overflow capacity", "Busy production periods", "New product introductions"],
  },
  {
    title: "Small & Mid-Sized Job Shops",
    Graphic: JobShopGraphic,
    points: ["Drawing standard setup", "Custom equipment", "Fabrication documentation", "Ongoing drafting support"],
  },
];

export function PlantsAndShopsSection({ industry }: { industry: Industry }) {
  const text = descriptionParagraphs(industry, "Bridging Legacy")[1];
  return (
    <section id="plants-and-shops" className="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading eyebrow="Across the spectrum" heading="From Large Plants to Job Shops" />
          <p className="text-base leading-relaxed text-neutral-600">{text}</p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {panels.map(({ title, Graphic, points }, i) => (
            <Reveal key={title} delay={i * 100} className="h-full">
              <InView threshold={0.3} className="h-full border border-neutral-200 bg-white">
                <div className="relative overflow-hidden bg-ink-950">
                  <TechnicalGrid id={`plant-${i}`} className="text-sky-300/[0.08]" minor={20} major={100} />
                  <Graphic className="relative mx-auto h-auto w-full max-w-sm" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-navy-900">{title}</h3>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-sm text-neutral-600">
                        <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-copper-500" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </InView>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
