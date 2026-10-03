import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import { StructHero } from "./StructHero";
import {
  HandoffSection,
  CoversSection,
  ConstructabilitySection,
  ConnectionSection,
  BimSection,
  TakeoffSection,
  RevisionSection,
  PressureSection,
  LifecycleSection,
  StructDeliverables,
  StructApplications,
  StructSoftware,
  StructIndustries,
  StructProjects,
  StructRelated,
  StructCTA,
} from "./StructSections";
import { SignatureExplode, StructWorkflow } from "./ScrollScenes";

/** Bespoke layout for /services/structural/structural-drafting; all copy comes from the service data. */
export function StructuralDraftingPage({ service }: { service: Service }) {
  return (
    <>
      <StructHero heading={service.heroHeading} description={service.heroDescription} />
      <HandoffSection service={service} />
      <CoversSection service={service} />
      <SignatureExplode />
      <ConstructabilitySection service={service} />
      <ConnectionSection service={service} />
      <BimSection service={service} />
      <TakeoffSection service={service} />
      <RevisionSection service={service} />
      <PressureSection service={service} />
      <LifecycleSection service={service} />
      <StructDeliverables service={service} />
      <StructApplications service={service} />
      <StructWorkflow steps={service.process} />
      <StructSoftware service={service} />
      <StructIndustries service={service} />
      <StructProjects />
      <StructRelated service={service} />
      <FAQ items={service.faqs} heading="Structural Drafting FAQs" />
      <StructCTA />
    </>
  );
}
