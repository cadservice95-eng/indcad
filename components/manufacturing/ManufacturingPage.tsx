import type { Industry } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import { MechanicalProjects } from "@/components/mechanical/MechanicalProjects";
import { RelatedMechanicalServices } from "@/components/mechanical/RelatedMechanicalServices";
import { ManufacturingHero } from "./ManufacturingHero";
import { ManufacturingIntro } from "./ManufacturingIntro";
import { ManufacturingChallenges } from "./ManufacturingChallenges";
import { PartVsDrawingSection, ManufacturingReverse, ManufacturingSheetMetal, LegacyBridge } from "./ManufacturingStory";
import { CadProductionFlow } from "./CadProductionFlow";
import { PlantsAndShopsSection } from "./PlantsAndShopsSection";
import { NpiTimeline } from "./NpiTimeline";
import { ContractSection, QualitySection } from "./ContractAndQuality";
import { ProjectTypes, ManufacturingDeliverables } from "./ProjectTypesAndDeliverables";
import { DocRequirements } from "./DocRequirements";
import { ManufacturingSoftware, ManufacturingCTA } from "./ManufacturingEnd";

/** Bespoke layout for /industries/manufacturing; all copy comes from the industry data. */
export function ManufacturingPage({ industry }: { industry: Industry }) {
  return (
    <>
      <ManufacturingHero heading={industry.heroHeading} description={industry.heroDescription} />
      <ManufacturingIntro industry={industry} />
      <ManufacturingChallenges />
      <PartVsDrawingSection industry={industry} />
      <ManufacturingReverse industry={industry} />
      <CadProductionFlow />
      <ManufacturingSheetMetal industry={industry} />
      <LegacyBridge industry={industry} />
      <PlantsAndShopsSection industry={industry} />
      <NpiTimeline />
      <ContractSection industry={industry} />
      <QualitySection industry={industry} />
      <ProjectTypes industry={industry} />
      <ManufacturingDeliverables industry={industry} />
      <DocRequirements industry={industry} />
      <ManufacturingSoftware industry={industry} />
      <MechanicalProjects heading="Related Manufacturing Projects" />
      <RelatedMechanicalServices slugs={industry.services} heading="Related CAD & Engineering Services" />
      <FAQ items={industry.faqs} heading="Manufacturing FAQs" />
      <ManufacturingCTA />
    </>
  );
}
