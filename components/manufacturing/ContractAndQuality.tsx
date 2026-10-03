import type { Industry } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { ContractHandover } from "@/components/svg/ContractHandover";
import { QualityTraceability } from "@/components/svg/QualityTraceability";
import { Chips } from "@/components/mechanical/SplitSection";
import { descriptionParagraphs } from "./content";

export function ContractSection({ industry }: { industry: Industry }) {
  const text = descriptionParagraphs(industry, "Reverse Engineering and Contract")[1];
  return (
    <section id="contract-manufacturing" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading eyebrow="Contract manufacturing" heading="Documentation Built for Contract Manufacturing Handover" />
          <div>
            <p className="text-base leading-relaxed text-neutral-600">{text}</p>
            <div className="mt-5">
              <Chips items={["Drawing", "BOM", "Revision", "Material", "Finish", "Assembly information"]} />
            </div>
          </div>
        </Reveal>
        <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
          <ContractHandover className="h-auto w-full min-w-[620px]" />
        </InView>
      </Container>
    </section>
  );
}

export function QualitySection({ industry }: { industry: Industry }) {
  const [text] = descriptionParagraphs(industry, "Rising Quality");
  return (
    <section id="quality" className="relative overflow-hidden border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <TechnicalGrid id="mfg-q-grid" className="text-sky-300/[0.06]" />
      <Container className="relative">
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading tone="dark" eyebrow="Quality & traceability" heading="Manufacturing Documentation for Quality & Traceability" />
          <p className="text-base leading-relaxed text-neutral-300">{text}</p>
        </Reveal>
        <InView threshold={0.3} className="mt-12 overflow-x-auto border border-steel-300/20 bg-ink-900/60 p-3 sm:p-6">
          <QualityTraceability className="h-auto w-full min-w-[620px]" />
        </InView>
      </Container>
    </section>
  );
}
