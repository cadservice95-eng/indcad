import type { Industry } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { PartVsDrawing } from "@/components/svg/PartVsDrawing";
import { ReverseEngineeringGraphic } from "@/components/svg/ReverseEngineeringGraphic";
import { SheetMetalGraphic } from "@/components/svg/SheetMetalGraphic";
import { LegacyVsCurrent } from "@/components/svg/LegacyVsCurrent";
import { SplitSection, Chips } from "@/components/mechanical/SplitSection";
import { descriptionParagraphs } from "./content";

/** "When a part isn't what the drawing says" — full-width four-stage reconciliation diagram. */
export function PartVsDrawingSection({ industry }: { industry: Industry }) {
  const [text] = descriptionParagraphs(industry, "When a Part");
  return (
    <section id="part-vs-drawing" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading eyebrow="Reconciliation" heading="When a Part Isn't What the Drawing Says" />
          <p className="text-base leading-relaxed text-neutral-600">{text}</p>
        </Reveal>
        <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
          <PartVsDrawing className="h-auto w-full min-w-[620px]" />
        </InView>
        <p className="mt-4 text-sm text-neutral-500">
          Orange markers flag where the physical part differs from its drawing; the final model reflects what was
          actually measured.
        </p>
      </Container>
    </section>
  );
}

const reverseFor = [
  "Legacy machinery",
  "Discontinued supplier relationships",
  "Undocumented custom modifications",
  "Spare parts",
  "Design changes",
  "Requalification",
];

export function ManufacturingReverse({ industry }: { industry: Industry }) {
  const [text] = descriptionParagraphs(industry, "Reverse Engineering and Contract");
  return (
    <section id="reverse-engineering" className="relative overflow-hidden border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <TechnicalGrid id="mfg-re-grid" className="text-sky-300/[0.06]" />
      <Container className="relative">
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading tone="dark" eyebrow="Reverse engineering" heading="Reverse Engineering for Legacy & Undocumented Equipment" />
          <div>
            <p className="text-base leading-relaxed text-neutral-300">{text}</p>
            <div className="mt-5">
              <Chips dark items={reverseFor} />
            </div>
          </div>
        </Reveal>
        <InView threshold={0.25} className="mt-12 overflow-x-auto border border-steel-300/20 bg-ink-900/60 p-3 sm:p-5">
          <ReverseEngineeringGraphic className="h-auto w-full min-w-[620px]" />
        </InView>
      </Container>
    </section>
  );
}

export function ManufacturingSheetMetal({ industry }: { industry: Industry }) {
  const text = descriptionParagraphs(industry, "When a Part")[1];
  return (
    <SplitSection
      id="sheet-metal"
      tone="tint"
      eyebrow="Fabrication"
      heading="Sheet Metal & Fabrication Documentation"
      visual={<SheetMetalGraphic className="h-auto w-full" />}
    >
      <p>{text}</p>
      <Chips items={["Flat pattern", "Bend", "DXF", "BOM"]} />
    </SplitSection>
  );
}

export function LegacyBridge({ industry }: { industry: Industry }) {
  const [text] = descriptionParagraphs(industry, "Bridging Legacy");
  return (
    <section id="legacy-current" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading eyebrow="Mixed fleets" heading="Bridging Legacy and Current-Generation Equipment" />
          <p className="text-base leading-relaxed text-neutral-600">{text}</p>
        </Reveal>
        <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
          <LegacyVsCurrent className="h-auto w-full min-w-[620px]" />
        </InView>
      </Container>
    </section>
  );
}
