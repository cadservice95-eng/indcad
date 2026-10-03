import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import {
  BimHero, IntroSection, DisciplinesSection, FederatedSection, LodSection, ClashSection, HardSoftSection, ReportSection, CycleSection, OwnershipSection,
  FamilySection, InfoSection, LegacySection, ScanSection, HealthSection, HandoverSection, DerivedSection, StatementSection, DeliverablesSection,
  ApplicationsSection, WorkflowSection, SoftwareSection, IndustriesSection, ProjectsSection, RelatedSection, BimCTA,
} from "./BimSections";

/** Bespoke layout for /services/bim/bim-services; all copy comes from the service data. */
export function BimPage({ service }: { service: Service }) {
  return (
    <>
      <BimHero heading={service.heroHeading} description={service.heroDescription} />
      <IntroSection service={service} />
      <DisciplinesSection />
      <FederatedSection service={service} />
      <LodSection service={service} />
      <ClashSection service={service} />
      <HardSoftSection service={service} />
      <ReportSection />
      <CycleSection service={service} />
      <OwnershipSection service={service} />
      <FamilySection service={service} />
      <InfoSection />
      <LegacySection service={service} />
      <ScanSection service={service} />
      <HealthSection />
      <HandoverSection service={service} />
      <DerivedSection />
      <StatementSection />
      <DeliverablesSection />
      <ApplicationsSection service={service} />
      <WorkflowSection service={service} />
      <SoftwareSection service={service} />
      <IndustriesSection service={service} />
      <ProjectsSection />
      <RelatedSection />
      <FAQ items={service.faqs} heading="BIM Modelling & Coordination FAQs" />
      <BimCTA />
    </>
  );
}
