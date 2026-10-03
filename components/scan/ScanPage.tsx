import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import {
  ScanHero, IntroSection, SignatureSection, CloudSection, ElementSection, RegistrationSection, MultiStoreySection, FidelitySection, HeritageSection,
  StructuralSection, DisciplineSection, RenoSection, RetrofitSection, FacilitiesSection, PlantSectionBlock, ValidationSection, DeliverablesSection,
  ApplicationsSection, WorkflowSection, SoftwareSection, IndustriesSection, ProjectsSection, RelatedSection, ScanCTA,
} from "./ScanSections";

/** Bespoke layout for /services/bim/scan-to-bim; all copy comes from the service data. */
export function ScanPage({ service }: { service: Service }) {
  return (
    <>
      <ScanHero heading={service.heroHeading} description={service.heroDescription} />
      <IntroSection service={service} />
      <SignatureSection />
      <CloudSection />
      <ElementSection />
      <RegistrationSection service={service} />
      <MultiStoreySection service={service} />
      <FidelitySection service={service} />
      <HeritageSection service={service} />
      <StructuralSection service={service} />
      <DisciplineSection service={service} />
      <RenoSection service={service} />
      <RetrofitSection />
      <FacilitiesSection service={service} />
      <PlantSectionBlock service={service} />
      <ValidationSection service={service} />
      <DeliverablesSection />
      <ApplicationsSection service={service} />
      <WorkflowSection service={service} />
      <SoftwareSection service={service} />
      <IndustriesSection service={service} />
      <ProjectsSection />
      <RelatedSection />
      <FAQ items={service.faqs} heading="Scan to BIM FAQs" />
      <ScanCTA />
    </>
  );
}
