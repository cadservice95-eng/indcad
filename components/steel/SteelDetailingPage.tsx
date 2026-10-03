import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import { StructIndustries, StructProjects } from "@/components/structural/StructSections";
import { SteelHero } from "./SteelHero";
import {
  DesignToPieceSection,
  ErrorSection,
  SteelCovers,
  MemberSection,
  ShopSection,
  SteelConnectionSection,
  PracticalitySection,
  ToolsSection,
  SteelTakeoff,
  PieceMarkingSection,
  ErectionSection,
  HandoffFabSite,
  SteelDeliverables,
  SteelApplications,
  CheckingSection,
  SteelRevision,
  PackageSection,
  SteelRelated,
  SteelCTA,
} from "./SteelSections";
import { SteelSignature, SteelProcess } from "./SteelScroll";

/** Bespoke layout for /services/structural/steel-detailing; all copy comes from the service data. */
export function SteelDetailingPage({ service }: { service: Service }) {
  return (
    <>
      <SteelHero heading={service.heroHeading} description={service.heroDescription} />
      <DesignToPieceSection service={service} />
      <ErrorSection service={service} />
      <SteelCovers service={service} />
      <MemberSection />
      <ShopSection service={service} />
      <SteelConnectionSection service={service} />
      <PracticalitySection service={service} />
      <ToolsSection service={service} />
      <SteelTakeoff service={service} />
      <PieceMarkingSection service={service} />
      <SteelSignature />
      <ErectionSection service={service} />
      <HandoffFabSite service={service} />
      <SteelDeliverables service={service} />
      <SteelApplications service={service} />
      <SteelProcess steps={service.process} />
      <CheckingSection service={service} />
      <SteelRevision service={service} />
      <PackageSection />
      <StructIndustries service={service} heading="Steel Detailing Across Industrial Environments" />
      <StructProjects heading="Related Steel Detailing Projects" />
      <SteelRelated />
      <FAQ items={service.faqs} heading="Steel Detailing FAQs" />
      <SteelCTA />
    </>
  );
}
