import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import {
  ConvHero, IntroSection, SignatureSection, TraceSection, EntitySection, DimSection, LayersSection, ArchiveDigitiseSection, ArchiveStandardSection,
  ArchiveFlowSection, ConflictSection, CorrectionSection, BatchSection, ThreeDSection, MigrationSection, QualitySection, BeforeAfterSection, LongevitySection,
  DeliverablesSection, ApplicationsSection, WorkflowSection, SoftwareSection, IndustriesSection, ProjectsSection, RelatedSection, ConvCTA,
} from "./ConvSections";

/** Bespoke layout for /services/cad-conversion/cad-conversion; all copy comes from the service data. */
export function ConvPage({ service }: { service: Service }) {
  return (
    <>
      <ConvHero heading={service.heroHeading} description={service.heroDescription} />
      <IntroSection service={service} />
      <SignatureSection />
      <TraceSection service={service} />
      <EntitySection />
      <DimSection service={service} />
      <LayersSection service={service} />
      <ArchiveDigitiseSection />
      <ArchiveStandardSection service={service} />
      <ArchiveFlowSection />
      <ConflictSection service={service} />
      <CorrectionSection service={service} />
      <BatchSection />
      <ThreeDSection service={service} />
      <MigrationSection service={service} />
      <QualitySection service={service} />
      <BeforeAfterSection />
      <LongevitySection service={service} />
      <DeliverablesSection />
      <ApplicationsSection service={service} />
      <WorkflowSection service={service} />
      <SoftwareSection service={service} />
      <IndustriesSection service={service} />
      <ProjectsSection />
      <RelatedSection />
      <FAQ items={service.faqs} heading="CAD Conversion FAQs" />
      <ConvCTA />
    </>
  );
}
