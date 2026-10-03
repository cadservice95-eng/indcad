import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CapabilityStrip } from "@/components/home/CapabilityStrip";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { CadBimTransformation } from "@/components/home/CadBimTransformation";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { SoftwareSection } from "@/components/home/SoftwareSection";
import { WorkflowSection } from "@/components/home/WorkflowSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { IndiaCoverage } from "@/components/home/IndiaCoverage";
import { FinalCTA } from "@/components/home/FinalCTA";
import { FAQ } from "@/components/FAQ";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

const homeFaqs = [
  {
    question: "What CAD drafting services do you provide?",
    answer:
      "Mechanical, structural, architectural, civil and electrical drafting, plus 3D CAD modelling, steel detailing and shop drawings. Each engagement is scoped to your project's standards and deliverables.",
  },
  {
    question: "Do you provide BIM modelling services?",
    answer:
      "Yes. We provide Revit-based architectural, structural and MEP modelling, coordination and clash detection, and Scan to BIM from point cloud data — built to the Level of Development your project stage actually needs.",
  },
  {
    question: "Which CAD and BIM software do you work with?",
    answer:
      "AutoCAD, Revit, SolidWorks, Inventor, Tekla Structures, MicroStation, Civil 3D, Navisworks, ArchiCAD and Fusion 360. Tell us the platform your team or consultant uses and we will deliver in it.",
  },
  {
    question: "Do you provide services across India?",
    answer:
      "Yes. Work is delivered remotely from the drawings, models or reference material you share, so your location is not a barrier.",
  },
  {
    question: "Can you work from existing drawings?",
    answer:
      "Yes. We work from CAD files, PDFs, scanned drawings, photographs of a physical part, or a written description where no drawing exists yet.",
  },
  {
    question: "Can you convert PDF drawings to CAD?",
    answer:
      "Yes — PDF to CAD conversion into editable, layered DWG files. Vector PDFs generally convert with higher fidelity than scanned raster PDFs, and we will tell you upfront what to expect from your source files.",
  },
  {
    question: "What file formats can you deliver?",
    answer:
      "Typically DWG, DXF and PDF for drawings, STEP, IGES and STL for 3D exports, and native Revit models for BIM work. Confirm the formats you need when requesting a quote.",
  },
  {
    question: "How can I request a quotation?",
    answer:
      "Use the quote form to send drawings, sketches, models or a description of what you need. We review the scope and reply with a fixed price and turnaround before any work begins.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: `${SITE.name} — CAD Design & Drafting Services India`,
  description: SITE.shortDescription,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <CapabilityStrip />
      <AboutSection />
      <ServicesSection />
      <CadBimTransformation />
      <WhyChooseUs />
      <IndustriesSection />
      <SoftwareSection />
      <WorkflowSection />
      <ProjectsSection />
      <IndiaCoverage />
      <FAQ items={homeFaqs} heading="Questions, answered" />
      <FinalCTA />
    </>
  );
}
