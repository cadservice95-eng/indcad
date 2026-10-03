import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import {
  RenderHero, WhySection, CoversSection, OutputsSection, HonestSection, OptionsSection, MaterialsSection, LightingSection, CameraSection, WalkSection,
  PlanningSection, InteriorExterior, Floor3DSection, BimSection, DeliverablesSection, ApplicationsSection, WorkflowSection, ScopeSection,
  SoftwareSection, IndustriesSection, ProjectsSection, RelatedSection, RenderCTA,
} from "./RenderSections";

/** Bespoke layout for /services/architectural/3d-rendering; all copy comes from the service data. */
export function RenderPage({ service }: { service: Service }) {
  return (
    <>
      <RenderHero heading={service.heroHeading} description={service.heroDescription} />
      <WhySection service={service} />
      <CoversSection service={service} />
      <OutputsSection />
      <HonestSection service={service} />
      <OptionsSection service={service} />
      <MaterialsSection />
      <LightingSection />
      <CameraSection service={service} />
      <WalkSection service={service} />
      <PlanningSection service={service} />
      <InteriorExterior service={service} />
      <Floor3DSection />
      <BimSection service={service} />
      <DeliverablesSection service={service} />
      <ApplicationsSection service={service} />
      <WorkflowSection service={service} />
      <ScopeSection service={service} />
      <SoftwareSection service={service} />
      <IndustriesSection service={service} />
      <ProjectsSection />
      <RelatedSection />
      <FAQ items={service.faqs} heading="3D Rendering FAQs" />
      <RenderCTA />
    </>
  );
}
