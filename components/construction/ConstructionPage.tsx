import type { Industry } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import {
  ConsHero, WhySection, ModelSection, CapacitySection, ConsultantsSection, CoordSection, ClashSection, ChangeSection, OutdatedSection, DeliverySection,
  SubSection, TenderSection, AsBuiltSection, TowerSection, FlowSection, TypesSection, DeliverablesSection, RequirementsSection, SoftwareSection, ProjectsSection,
  RelatedSection, ConsCTA,
} from "./ConsSections";

/** Bespoke layout for /industries/construction; all copy comes from the industry data. */
export function ConstructionPage({ industry }: { industry: Industry }) {
  return (
    <>
      <ConsHero i={industry} />
      <WhySection i={industry} />
      <ModelSection />
      <CapacitySection i={industry} />
      <ConsultantsSection i={industry} />
      <CoordSection />
      <ClashSection />
      <ChangeSection i={industry} />
      <OutdatedSection />
      <DeliverySection i={industry} />
      <SubSection i={industry} />
      <TenderSection i={industry} />
      <AsBuiltSection i={industry} />
      <TowerSection i={industry} />
      <FlowSection />
      <TypesSection i={industry} />
      <DeliverablesSection i={industry} />
      <RequirementsSection i={industry} />
      <SoftwareSection i={industry} />
      <ProjectsSection />
      <RelatedSection i={industry} />
      <FAQ items={industry.faqs} heading="Frequently Asked Questions" />
      <ConsCTA />
    </>
  );
}
