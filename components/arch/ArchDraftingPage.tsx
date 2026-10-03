import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import { ArchHero } from "./ArchHero";
import {
  ArchIntro, PlanSection, SignatureViews, CoordSection, DoorSection, PracticeSection, InputsSection, RenoSection, RetailSection,
  JoinerySection, AuthoritySection, SubmissionSection, DeliverablesSection, ScheduleSection, RcpBlock, SiteBlock, MassBlock,
  ArchWorkflow, RevisionBlock, LifecycleBlock, ArchSoftware, ArchIndustries, ArchProjects, ArchRelated, ArchCTA,
} from "./ArchSections";

/** Bespoke layout for /services/architectural/architectural-drafting; all copy comes from the service data. */
export function ArchDraftingPage({ service }: { service: Service }) {
  return (
    <>
      <ArchHero heading={service.heroHeading} description={service.heroDescription} />
      <ArchIntro service={service} />
      <PlanSection service={service} />
      <SignatureViews />
      <CoordSection service={service} />
      <DoorSection />
      <PracticeSection service={service} />
      <InputsSection service={service} />
      <RenoSection service={service} />
      <RetailSection service={service} />
      <JoinerySection service={service} />
      <AuthoritySection service={service} />
      <SubmissionSection service={service} />
      <DeliverablesSection service={service} />
      <ScheduleSection service={service} />
      <RcpBlock />
      <SiteBlock service={service} />
      <MassBlock service={service} />
      <ArchWorkflow service={service} />
      <RevisionBlock service={service} />
      <LifecycleBlock service={service} />
      <ArchSoftware service={service} />
      <ArchIndustries service={service} />
      <ArchProjects />
      <ArchRelated />
      <FAQ items={service.faqs} heading="Architectural Drafting FAQs" />
      <ArchCTA />
    </>
  );
}
