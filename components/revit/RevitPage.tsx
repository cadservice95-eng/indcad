import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import {
  RevitHero, BottleneckSection, WorksSection, OneElementSection, DisciplineSection, BepSection, StandardSection, LodSection, OverbuildSection, NewModelSection,
  UpdateSection, WorksetSection, FamilySection, SchedulesTagsSection, TemplateSection, AuditSection, DocsSection, HandoverSection, DeliverablesSection,
  ApplicationsSection, WorkflowSection, RevisionSection, SoftwareSection, IndustriesSection, ProjectsSection, RelatedSection, RevitCTA,
} from "./RevitSections";

/** Bespoke layout for /services/bim/revit-modelling; all copy comes from the service data. */
export function RevitPage({ service }: { service: Service }) {
  return (
    <>
      <RevitHero heading={service.heroHeading} description={service.heroDescription} />
      <BottleneckSection service={service} />
      <WorksSection service={service} />
      <OneElementSection />
      <DisciplineSection service={service} />
      <BepSection service={service} />
      <StandardSection service={service} />
      <LodSection service={service} />
      <OverbuildSection />
      <NewModelSection />
      <UpdateSection service={service} />
      <WorksetSection service={service} />
      <FamilySection service={service} />
      <SchedulesTagsSection service={service} />
      <TemplateSection service={service} />
      <AuditSection service={service} />
      <DocsSection service={service} />
      <HandoverSection />
      <DeliverablesSection />
      <ApplicationsSection service={service} />
      <WorkflowSection service={service} />
      <RevisionSection service={service} />
      <SoftwareSection service={service} />
      <IndustriesSection service={service} />
      <ProjectsSection />
      <RelatedSection />
      <FAQ items={service.faqs} heading="Revit Modelling FAQs" />
      <RevitCTA />
    </>
  );
}
