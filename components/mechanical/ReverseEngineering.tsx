import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { ReverseEngineeringGraphic } from "@/components/svg/ReverseEngineeringGraphic";
import { overviewParagraphs } from "./content";

const steps = [
  ["01", "Physical Part"],
  ["02", "Reference / Scan"],
  ["03", "3D CAD Model"],
  ["04", "Manufacturing Drawing"],
];

export function ReverseEngineering({ service }: { service: Service }) {
  const [text] = overviewParagraphs(service, "Reverse Engineering");
  return (
    <section id="reverse-engineering" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading eyebrow="Legacy parts" heading="Reverse Engineering & Legacy Part Documentation" />
          <p className="text-base leading-relaxed text-neutral-600">{text}</p>
        </Reveal>
        <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
          <ReverseEngineeringGraphic className="h-auto w-full min-w-[620px]" />
        </InView>
        <ol className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {steps.map(([n, t]) => (
            <li key={n} className="border-t border-neutral-300 pt-3">
              <p className="font-mono text-xs tracking-[0.16em] text-copper-600">{n}</p>
              <p className="mt-1 text-sm font-semibold text-navy-900">{t}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
