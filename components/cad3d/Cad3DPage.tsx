import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import { MechanicalSoftware } from "@/components/mechanical/MechanicalSoftware";
import { MechanicalIndustries } from "@/components/mechanical/MechanicalIndustries";
import { MechanicalProjects } from "@/components/mechanical/MechanicalProjects";
import { RelatedMechanicalServices } from "@/components/mechanical/RelatedMechanicalServices";
import { Cad3DHero } from "./Cad3DHero";
import {
  WhySection,
  SourceSection,
  ScopeSection,
  PartModellingSection,
  ParametricUpdateSection,
  NewVsExistingSection,
  AssemblySection,
  SimulationSection,
  HygieneSection,
  ConfigSection,
  Cad3DDeliverables,
  Cad3DApplications,
  Cad3DCTA,
} from "./Cad3DSections";
import { Cad3DWorkflow } from "./Cad3DWorkflow";

/** Bespoke layout for /services/mechanical/3d-cad-modelling; all copy comes from the service data. */
export function Cad3DPage({ service }: { service: Service }) {
  return (
    <>
      <Cad3DHero heading={service.heroHeading} description={service.heroDescription} />
      <WhySection service={service} />
      <SourceSection service={service} />
      <ScopeSection service={service} />
      <PartModellingSection service={service} />
      <ParametricUpdateSection service={service} />
      <NewVsExistingSection service={service} />
      <AssemblySection service={service} />
      <SimulationSection service={service} />
      <HygieneSection service={service} />
      <ConfigSection service={service} />
      <Cad3DDeliverables service={service} />
      <Cad3DApplications service={service} />
      <Cad3DWorkflow steps={service.process} />
      <MechanicalSoftware service={service} />
      <MechanicalIndustries service={service} />
      <MechanicalProjects heading="Related 3D CAD Projects" />
      <RelatedMechanicalServices slugs={service.relatedServices} heading="Related Engineering Services" />
      <FAQ items={service.faqs} heading="3D CAD Modelling FAQs" />
      <Cad3DCTA />
    </>
  );
}
