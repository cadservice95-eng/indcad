import type { Service } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { AssemblyBomGraphic } from "@/components/svg/AssemblyBomGraphic";
import { Chips } from "./SplitSection";
import { overviewParagraphs } from "./content";

export function AssemblyDocumentation({ service }: { service: Service }) {
  const [text] = overviewParagraphs(service, "Assembly Documentation");
  return (
    <section id="assembly" className="relative overflow-hidden border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <TechnicalGrid id="asm-grid" className="text-sky-300/[0.06]" />
      <Container className="relative">
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading tone="dark" eyebrow="Assemblies & BOMs" heading="Assembly Documentation That Stays Synchronized" />
          <div>
            <p className="text-base leading-relaxed text-neutral-300">{text}</p>
            <div className="mt-4">
              <Chips dark items={["Assembly drawings", "BOMs", "Fasteners", "Hardware", "Component references", "Model-linked documentation"]} />
            </div>
          </div>
        </Reveal>
        <InView threshold={0.25} className="mt-12">
          <AssemblyBomGraphic />
        </InView>
        <p className="mt-4 text-xs text-neutral-500">Hover or focus a BOM row to highlight its component. Illustrative parts only.</p>
      </Container>
    </section>
  );
}
