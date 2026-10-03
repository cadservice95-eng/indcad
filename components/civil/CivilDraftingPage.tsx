import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import { MechanicalSoftware } from "@/components/mechanical/MechanicalSoftware";
import { RelatedMechanicalServices } from "@/components/mechanical/RelatedMechanicalServices";
import { CivilHero } from "./CivilHero";
import {
  IntroSection,
  CoordinationSection,
  ScopeSection,
  TerrainSection,
  SurveyTerrainSection,
  SignatureSection,
  StormwaterSection,
  RoadSection,
  SubdivisionSection,
  DiscrepancySection,
  EarthworksSection,
  SequencingSection,
  CivilDeliverables,
  CivilApplications,
  Civil3DSection,
  CivilIndustries,
  CivilProjects,
  CivilCTA,
} from "./CivilSections";
import { CivilWorkflow } from "./CivilWorkflow";

/** Bespoke layout for /services/civil/civil-drafting; all copy comes from the service data. */
export function CivilDraftingPage({ service }: { service: Service }) {
  return (
    <>
      <CivilHero heading={service.heroHeading} description={service.heroDescription} />
      <IntroSection service={service} />
      <CoordinationSection />
      <ScopeSection service={service} />
      <TerrainSection service={service} />
      <SurveyTerrainSection service={service} />
      <SignatureSection />
      <StormwaterSection service={service} />
      <RoadSection service={service} />
      <SubdivisionSection service={service} />
      <DiscrepancySection service={service} />
      <EarthworksSection service={service} />
      <SequencingSection service={service} />
      <CivilDeliverables service={service} />
      <CivilApplications service={service} />
      <CivilWorkflow steps={service.process} />
      <Civil3DSection service={service} />
      <MechanicalSoftware service={service} />
      <CivilIndustries />
      <CivilProjects />
      <RelatedMechanicalServices slugs={service.relatedServices} heading="Related Engineering Services" />
      <FAQ items={service.faqs} heading="Civil Drafting FAQs" />
      <CivilCTA />
    </>
  );
}
