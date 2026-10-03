import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import {
  PdfHero, ProblemSection, TraceSection, EntitiesSection, SourceSection, DimSection, TextSection, StandardsSection, BatchSection, DisciplineSection,
  DeliverablesSection, ApplicationsSection, WorkflowSection, QualitySection, SoftwareSection, IndustriesSection, ProjectsSection, RelatedSection, PdfCTA,
} from "./PdfSections";

/** Bespoke layout for /services/cad-conversion/pdf-to-cad; all copy comes from the service data. */
export function PdfPage({ service }: { service: Service }) {
  return (
    <>
      <PdfHero heading={service.heroHeading} description={service.heroDescription} />
      <ProblemSection service={service} />
      <TraceSection service={service} />
      <EntitiesSection />
      <SourceSection service={service} />
      <DimSection service={service} />
      <TextSection service={service} />
      <StandardsSection service={service} />
      <BatchSection service={service} />
      <DisciplineSection />
      <DeliverablesSection />
      <ApplicationsSection service={service} />
      <WorkflowSection service={service} />
      <QualitySection />
      <SoftwareSection service={service} />
      <IndustriesSection service={service} />
      <ProjectsSection />
      <RelatedSection />
      <FAQ items={service.faqs} heading="Frequently Asked Questions" />
      <PdfCTA />
    </>
  );
}
