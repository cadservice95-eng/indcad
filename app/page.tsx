import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhyUs } from "@/components/sections/WhyUs";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { SoftwareSection } from "@/components/sections/SoftwareSection";
import { CTA } from "@/components/sections/CTA";
import { FAQ } from "@/components/FAQ";
import { ServiceGrid } from "@/components/ServiceGrid";
import { IndustryCard } from "@/components/IndustryCard";
import { ProjectCard } from "@/components/ProjectCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { industries } from "@/data/industries";
import { projects } from "@/data/projects";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

const featuredIndustries = industries.filter((i) =>
  ["construction", "manufacturing", "mining", "energy", "automotive", "defence"].includes(i.slug),
);

const featuredProjects = projects.slice(0, 3);

const homeFaqs = [
  {
    question: "Do you work with clients India-wide, or only in one city?",
    answer:
      "We work with clients across India. Drafting and design work is delivered remotely from the drawings, models or reference material you provide, so location isn't a barrier.",
  },
  {
    question: "What CAD and BIM software do you work in?",
    answer:
      "We work across the major CAD and BIM platforms used in Indian engineering, architecture and construction — see our software page for the full list, and let us know which platform your project needs.",
  },
  {
    question: "How do you quote a project?",
    answer:
      "Send us your drawings, sketches, models or a description of what you need through our quote form. We review the scope and come back with a fixed price and turnaround before any work starts.",
  },
  {
    question: "Can you take on overflow work from our in-house team?",
    answer:
      "Yes, a large part of our work is exactly this — flexible drafting and design capacity alongside an existing in-house team during busy periods or specific projects.",
  },
];

const process = [
  { title: "Send Your Project Brief", description: "Share drawings, sketches, a model or a description of what you need." },
  { title: "Project Review", description: "We review scope, discipline and any reference material you've provided." },
  { title: "Scope & Quote", description: "You receive a fixed price and turnaround before any work begins." },
  { title: "Drafting / Design", description: "Work is carried out in your required CAD or BIM platform." },
  { title: "Review & Delivery", description: "Files are delivered with revisions handled through markup rounds." },
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
      <TrustStrip />

      <section className="border-t border-neutral-200 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="What we do"
            heading="CAD & Engineering Services"
            description="Mechanical, structural, architectural, civil and electrical drafting, plus BIM, CAD conversion and engineering design — as one flexible capability."
          />
          <div className="mt-10">
            <ServiceGrid />
          </div>
        </Container>
      </section>

      <WhyUs />

      <section className="border-t border-neutral-200 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Industries" heading="Industries We Support" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredIndustries.map((industry) => (
              <IndustryCard key={industry.slug} industry={industry} />
            ))}
          </div>
          <div className="mt-8">
            <Button href="/industries" variant="ghost">
              View all industries
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Portfolio" heading="Project Examples" description="Illustrative project examples across our core disciplines. Marked placeholders will be replaced with verified project case studies as they become available." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <div className="mt-8">
            <Button href="/projects" variant="ghost">
              View all projects
            </Button>
          </div>
        </Container>
      </section>

      <SoftwareSection />

      <ProcessSection steps={process} description="A consistent process from brief to delivery, whether the job is a single drawing or an ongoing capacity arrangement." />

      <FAQ items={homeFaqs} />

      <CTA />
    </>
  );
}
