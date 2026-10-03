import { ArrowRight } from "lucide-react";
import type { Industry } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { MechIcon, type MechIconName } from "@/components/svg/MechIcons";

const caseIcons: MechIconName[] = ["product", "drawings", "spare", "sheet", "documentation", "change", "proto"];

export function ProjectTypes({ industry }: { industry: Industry }) {
  return (
    <section id="project-types" className="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Use cases" heading="Typical Manufacturing Projects" />
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industry.useCases.map((item, i) => (
            <li key={item}>
              <Reveal delay={(i % 4) * 70} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40 hover:shadow-[0_12px_30px_-12px_rgba(11,18,32,0.25)]">
                  <span aria-hidden className="bg-blueprint-grid-light pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [mask-image:linear-gradient(to_bottom_left,black,transparent_65%)] group-hover:opacity-100" />
                  <div className="relative flex items-start justify-between">
                    <MechIcon name={caseIcons[i % caseIcons.length]} className="text-steel-600 transition-colors group-hover:text-copper-600" />
                    <span className="font-mono text-xs tracking-[0.14em] text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="relative mt-6 flex-1 text-base font-semibold leading-snug tracking-tight text-navy-900">{item}</h3>
                  <ArrowRight className="relative mt-5 h-4 w-4 text-navy-900 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-copper-600" aria-hidden />
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

const tags = ["CAD", "Fabrication", "Production", "Sheet Metal", "Reverse Engineering", "Standardisation"];
const deliverableIcons: MechIconName[] = ["models", "drawings", "bom", "sheet", "spare", "documentation"];

export function ManufacturingDeliverables({ industry }: { industry: Industry }) {
  return (
    <section id="deliverables" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Deliverables" heading="Typical Manufacturing Deliverables" />
        </Reveal>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {industry.deliverables.map((item, i) => (
            <li key={item}>
              <Reveal delay={(i % 3) * 80} className="h-full">
                <div className="group flex h-full gap-5 border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40">
                  <MechIcon name={deliverableIcons[i % deliverableIcons.length]} className="h-12 w-12 shrink-0 text-steel-600 transition-colors group-hover:text-copper-600" />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-copper-600">{tags[i % tags.length]}</p>
                    <h3 className="mt-1.5 text-base font-semibold leading-snug tracking-tight text-navy-900">{item}</h3>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
