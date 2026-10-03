import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { MechIcon, type MechIconName } from "@/components/svg/MechIcons";
import { Callout } from "./SplitSection";
import { overviewParagraphs } from "./content";

const stages: { label: string; icon: MechIconName }[] = [
  { label: "Rough sketch", icon: "sketch" },
  { label: "2D CAD", icon: "cad2d" },
  { label: "3D model", icon: "model3d" },
  { label: "Assembly", icon: "assembly" },
  { label: "BOM", icon: "bom" },
  { label: "Manufacturing drawings", icon: "drawing" },
  { label: "Final documentation", icon: "folder" },
];

export function MechanicalCapabilities({ service }: { service: Service }) {
  const [first, second] = overviewParagraphs(service, "What This Service Covers");
  return (
    <section id="covers" className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading eyebrow="Scope" heading="What This Service Covers" />
          <div className="space-y-4 text-base leading-relaxed text-neutral-600">
            <p>{first}</p>
            <Callout>{second}</Callout>
          </div>
        </Reveal>

        <InView as="ol" threshold={0.2} className="group relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-7 lg:gap-3">
          <span
            aria-hidden
            className="absolute left-[8%] right-[8%] top-[27px] hidden h-px origin-left scale-x-0 bg-copper-500/70 transition-transform duration-[2200ms] ease-out group-data-[in=true]:scale-x-100 lg:block"
          />
          {stages.map((s, i) => (
            <li key={s.label} className="reveal relative text-center" style={{ "--d": `${i * 140}ms` } as React.CSSProperties}>
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center border border-neutral-300 bg-white text-steel-600">
                <MechIcon name={s.icon} className="h-8 w-8" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-navy-900 font-mono text-[10px] text-white">
                  {i + 1}
                </span>
              </span>
              <p className="mt-3 text-sm font-medium leading-snug text-navy-900">{s.label}</p>
            </li>
          ))}
        </InView>
      </Container>
    </section>
  );
}
