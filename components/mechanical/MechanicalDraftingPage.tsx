import type { Service } from "@/lib/types";
import { MechanicalHero } from "./MechanicalHero";
import { MechanicalIntro } from "./MechanicalIntro";
import { MechanicalCapabilities } from "./MechanicalCapabilities";
import { Mechanical2DDrafting } from "./Mechanical2DDrafting";
import { Mechanical3DModeling } from "./Mechanical3DModeling";
import { ManufacturingDocumentation } from "./ManufacturingDocumentation";
import { ReverseEngineering } from "./ReverseEngineering";
import { SheetMetal } from "./SheetMetal";
import { AssemblyDocumentation } from "./AssemblyDocumentation";
import { HandoverDocumentation } from "./HandoverDocumentation";
import { DrawingChecking } from "./DrawingChecking";
import { MechanicalDeliverables } from "./MechanicalDeliverables";
import { MechanicalApplications } from "./MechanicalApplications";
import { MechanicalWorkflow } from "./MechanicalWorkflow";
import { MechanicalSoftware } from "./MechanicalSoftware";
import { MechanicalIndustries } from "./MechanicalIndustries";
import { MechanicalProjects } from "./MechanicalProjects";
import { RelatedMechanicalServices } from "./RelatedMechanicalServices";
import { MechanicalFAQ } from "./MechanicalFAQ";
import { MechanicalCTA } from "./MechanicalCTA";

/** Bespoke layout for /services/mechanical/mechanical-drafting; all copy comes from the service data. */
export function MechanicalDraftingPage({ service }: { service: Service }) {
  return (
    <>
      <MechanicalHero heading={service.heroHeading} description={service.heroDescription} />
      <MechanicalIntro />
      <MechanicalCapabilities service={service} />
      <Mechanical2DDrafting />
      <Mechanical3DModeling />
      <ManufacturingDocumentation />
      <ReverseEngineering service={service} />
      <SheetMetal service={service} />
      <AssemblyDocumentation service={service} />
      <HandoverDocumentation service={service} />
      <DrawingChecking service={service} />
      <MechanicalDeliverables service={service} />
      <MechanicalApplications service={service} />
      <MechanicalWorkflow steps={service.process} />
      <MechanicalSoftware service={service} />
      <MechanicalIndustries service={service} />
      <MechanicalProjects />
      <RelatedMechanicalServices service={service} />
      <MechanicalFAQ service={service} />
      <MechanicalCTA />
    </>
  );
}
