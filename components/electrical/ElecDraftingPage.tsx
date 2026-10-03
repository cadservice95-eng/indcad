import type { Service } from "@/lib/types";
import { FAQ } from "@/components/FAQ";
import { ElecHero } from "./ElecHero";
import {
  ElecIntro,
  ElecCovers,
  SldSection,
  SignatureSection,
  SchematicSection,
  PanelSection,
  ScheduleSection,
  AsBuiltSection,
  SecondLifeSection,
  CommissioningSection,
  ElecDeliverablesSection,
  ElecApplications,
  ElecBimSection,
  ElecRevisionSection,
  ElecViewerSection,
  ElecSoftware,
  ElecIndustries,
  ElecProjects,
  ElecRelated,
  ElecCTA,
} from "./ElecSections";
import { ElecProcess } from "./ElecScroll";

/** Bespoke layout for /services/electrical/electrical-drafting; all copy comes from the service data. */
export function ElecDraftingPage({ service }: { service: Service }) {
  return (
    <>
      <ElecHero heading={service.heroHeading} description={service.heroDescription} />
      <ElecIntro service={service} />
      <ElecCovers service={service} />
      <SldSection service={service} />
      <SignatureSection />
      <SchematicSection service={service} />
      <PanelSection service={service} />
      <ScheduleSection service={service} />
      <AsBuiltSection service={service} />
      <SecondLifeSection service={service} />
      <CommissioningSection service={service} />
      <ElecDeliverablesSection service={service} />
      <ElecApplications service={service} />
      <ElecBimSection service={service} />
      <ElecProcess steps={service.process} />
      <ElecRevisionSection service={service} />
      <ElecViewerSection />
      <ElecSoftware service={service} />
      <ElecIndustries service={service} />
      <ElecProjects />
      <ElecRelated />
      <FAQ items={service.faqs} heading="Electrical Drafting FAQs" />
      <ElecCTA />
    </>
  );
}
