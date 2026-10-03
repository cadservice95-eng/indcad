import type { Service } from "@/lib/types";
import { SplitSection, Chips, Callout } from "./SplitSection";
import { HandoverStack } from "@/components/svg/HandoverStack";
import { overviewParagraphs } from "./content";

export function HandoverDocumentation({ service }: { service: Service }) {
  const [handover, ambiguity] = overviewParagraphs(service, "Handover Documentation");
  return (
    <SplitSection
      id="handover"
      eyebrow="Supplier handover"
      heading="Documentation That Makes Supplier Handover Easier"
      visual={<HandoverStack className="h-auto w-full" />}
    >
      <p>{handover}</p>
      <Chips items={["Revision history", "Material call-outs", "Finish call-outs", "Clear drawings", "Reduced ambiguity"]} />
      <Callout>{ambiguity}</Callout>
    </SplitSection>
  );
}
