import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import {
  EdHero, ProblemSection, WorkspaceSection, ConceptsSection, TradeOffSection, DfmSection, RationaleSection, ValueSection, DetailedSection, DraftingSection,
  HandoverSection, DeliverablesSection, ApplicationsSection, ProcessSection, StorySection, SoftwareSection, IndustriesSection, ProjectsSection, RelatedSection, EdCTA,
} from "./EdSections";

/** Bespoke layout for /services/engineering-design/engineering-design; all copy comes from the service data. */
export function EdPage({ service }: { service: Service }) {
  return (
    <>
      <EdHero heading={service.heroHeading} description={service.heroDescription} />
      <ProblemSection service={service} />
      <WorkspaceSection />
      <ConceptsSection service={service} />
      <TradeOffSection />
      <DfmSection service={service} />
      <RationaleSection service={service} />
      <ValueSection service={service} />
      <DetailedSection />
      <StorySection />
      <DraftingSection service={service} />
      <HandoverSection service={service} />
      <DeliverablesSection />
      <ApplicationsSection service={service} />
      <ProcessSection service={service} />
      <SoftwareSection service={service} />
      <IndustriesSection service={service} />
      <ProjectsSection />
      <RelatedSection />
      <FAQ items={service.faqs} heading="Frequently Asked Questions" />
      <EdCTA />
    </>
  );
}
