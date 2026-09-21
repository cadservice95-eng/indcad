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

const homeOverview = [
  {
    heading: "One Capability Across Every Discipline",
    paragraphs: [
      "Render CAD Hub provides CAD design, drafting, BIM and engineering support to engineers, architects, builders, manufacturers and contractors across India. Rather than being built around a single discipline, our capability spans mechanical, structural, architectural, civil and electrical drafting, alongside BIM modelling, CAD conversion and engineering design support — so a team with a mix of drawing needs across a project doesn't need to coordinate several separate specialist vendors for work that can be handled as one consistent capability.",
      "This kind of flexible, cross-disciplinary drafting capacity tends to matter most for teams whose workload doesn't sit neatly within a single, predictable category — a manufacturing business that occasionally needs a structural mezzanine detailed alongside its usual mechanical part drawings, or a construction contractor whose civil site drawings need to be coordinated against an architectural set produced by a different consultant. Working across disciplines under one point of contact removes a layer of coordination overhead that otherwise falls back on the client to manage themselves.",
    ],
  },
  {
    heading: "Fixed Scope, Flexible Overflow Capacity",
    paragraphs: [
      "Every engagement starts the same way regardless of discipline: a clear scope and fixed quote agreed before any drafting work begins, so there are no surprises partway through a project. We work in the CAD and BIM platforms already in use across Indian engineering and construction practice, and we're able to work from whatever reference material a project actually has available — clean CAD files, PDFs, scanned drawings, photographs of physical parts, or a written description of requirements where no drawing exists yet.",
      "A meaningful share of the work we take on is overflow and flexible capacity for teams that already have their own in-house drafting resource but need extra hands during a busy period, or need a specific discipline they don't maintain in-house for an occasional project. This arrangement works well precisely because it doesn't require a client to restructure their own team — we slot into an existing workflow rather than asking a client's workflow to adapt to ours.",
    ],
  },
  {
    heading: "BIM, CAD Conversion and Reverse Engineering",
    paragraphs: [
      "For projects that call for coordinated 3D modelling rather than 2D drawing production, our BIM capability covers architectural, structural and MEP modelling with clash detection and quantity extraction, built to whatever Level of Development a project stage actually requires rather than over-modelling ahead of when that detail is needed. For projects starting from an existing but undocumented design — a legacy part, an old scanned drawing set, a piece of imported equipment with no accompanying files — our CAD conversion and reverse engineering capability turns that physical or scanned reference into a genuinely usable, editable digital file.",
      "Across every discipline, our approach stays the same: understand what the deliverable actually needs to support — fabrication, construction, regulatory submission, internal engineering reference — and produce drawings and models that are accurate, properly organised and genuinely fit for that specific purpose, rather than a generically competent drawing that happens to look right.",
    ],
  },
  {
    heading: "Where Drafting Support Ends and Certification Begins",
    paragraphs: [
      "We also try to be realistic about what a drafting and design service can responsibly claim. We don't provide engineering certification or replace the sign-off of a licensed engineer or architect of record — our role is producing accurate, well-organised drawings and models to whatever standard your project's engineer or architect specifies, and being direct about the boundary between drafting support and professional engineering certification wherever that distinction actually matters for a specific project.",
    ],
  },
];

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
  {
    question: "Do you work on a single drawing, or only larger projects?",
    answer:
      "Both. Some engagements are a single drawing or model; others are an ongoing arrangement spanning many sheets over months. Scope and pricing scale to whatever the actual project needs.",
  },
  {
    question: "What if we don't have clean source files to start from?",
    answer:
      "That's a common starting point, not an obstacle — we regularly work from scanned drawings, PDFs, photographs of a physical part, or a written description of requirements where no formal drawing exists yet.",
  },
  {
    question: "Can you match our existing drawing standards and templates?",
    answer:
      "Yes. Share your title block, layer standard or naming convention and we'll deliver drawings consistent with your existing drawing set, rather than introducing a mismatched format.",
  },
  {
    question: "How are revisions handled once a drawing is delivered?",
    answer:
      "Revisions are handled through a clear markup and review round rather than open-ended back and forth — mark up exactly what needs to change, and we return an updated, correctly versioned drawing.",
  },
  {
    question: "Is our design and drawing information kept confidential?",
    answer:
      "Yes. Drawings and design information shared with us are treated as confidential, and we're glad to work under your own confidentiality agreement where a project calls for one.",
  },
  {
    question: "Do you provide ongoing support, or only one-off projects?",
    answer:
      "Both models are common. Some clients engage us for a single defined project; others maintain an ongoing arrangement where we function as flexible drafting capacity across multiple projects over time.",
  },
  {
    question: "What industries do you typically work with?",
    answer:
      "Manufacturing, construction, mining, energy, automotive and defence-adjacent engineering are among the industries we regularly support — see our industries page for the full list and industry-specific detail.",
  },
  {
    question: "How quickly can a project typically start?",
    answer:
      "Once scope and reference material are confirmed and a quote is agreed, most projects can begin promptly. Turnaround for the work itself depends on scope, complexity and current capacity.",
  },
  {
    question: "Can we speak to someone before committing to a project?",
    answer:
      "Yes — for a larger or more complex enquiry, we're happy to have a call to work through scope before any quote is finalised.",
  },
  {
    question: "Do you work with both individual clients and larger organisations?",
    answer:
      "Yes — from an individual engineer or architect needing a single drawing to a large manufacturing or construction business needing ongoing capacity across many projects.",
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
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="About Render CAD Hub"
            heading="CAD, Drafting and BIM Support for Indian Engineering & Construction Teams"
          />
          <div className="mt-8 space-y-8">
            {homeOverview.map((section, i) => (
              <div key={i}>
                <h3 className="text-base font-semibold text-navy-900">{section.heading}</h3>
                <div className="mt-2 space-y-4">
                  {section.paragraphs.map((paragraph, j) => (
                    <p key={j} className="text-base leading-relaxed text-neutral-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

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
