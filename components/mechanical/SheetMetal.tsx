import type { Service } from "@/lib/types";
import { SplitSection, Chips } from "./SplitSection";
import { SheetMetalGraphic } from "@/components/svg/SheetMetalGraphic";
import { overviewParagraphs } from "./content";

export function SheetMetal({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Reverse Engineering")[1];
  return (
    <SplitSection
      id="sheet-metal"
      tone="tint"
      flip
      eyebrow="Sheet metal"
      heading="Sheet Metal Drafting & Flat Pattern Development"
      visual={<SheetMetalGraphic className="h-auto w-full" />}
    >
      <p>{text}</p>
      <Chips items={["Flat pattern development", "Bend allowance", "Nesting-ready DXFs", "K-factor", "Press-brake & tooling"]} />
    </SplitSection>
  );
}
