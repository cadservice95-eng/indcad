import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/sections/CTA";
import { FAQ } from "@/components/FAQ";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckList } from "@/components/ui/CheckList";
import { serviceCategories } from "@/data/service-categories";
import { industries } from "@/data/industries";
import { software } from "@/data/software";
import { buildMetadata } from "@/lib/seo";

const aboutFaqs = [
  {
    question: "Is Render CAD Hub a single freelancer or a team?",
    answer:
      "Render CAD Hub operates as a team capability spanning multiple drafting and design disciplines, rather than a single individual — different disciplines are handled by whoever on the team has the right background for that specific work.",
  },
  {
    question: "Do you work directly with our engineers, or only through a project manager?",
    answer:
      "Both models work. Some clients prefer a single point of contact coordinating scope and delivery; others prefer their own engineers communicating directly with whoever is drafting their work. We adapt to whichever fits your project.",
  },
  {
    question: "How do you ensure drawing accuracy?",
    answer:
      "Every drawing goes through an internal check against source material and dimensional accuracy before delivery, and revisions are handled through a structured markup process rather than open-ended back and forth.",
  },
  {
    question: "Can you sign a non-disclosure agreement before we share drawings?",
    answer:
      "Yes. We're glad to work under a client's own confidentiality agreement, and treat all shared design information as confidential as standard practice regardless of whether a formal NDA is in place.",
  },
  {
    question: "Do you only work with large companies, or also individual engineers and small practices?",
    answer:
      "We work with organisations of every size — from an individual engineer or architect needing a single drawing, to a large manufacturing or construction business needing ongoing capacity across many projects.",
  },
  {
    question: "What happens if we're not satisfied with a delivered drawing?",
    answer:
      "Mark up exactly what needs to change and we'll revise it. Our process is built around structured revision rounds precisely so that an initial draft isn't expected to be the final, unchangeable word.",
  },
  {
    question: "Do you offer a trial or sample project before a larger engagement?",
    answer:
      "Yes — for a new client relationship, starting with a smaller, real but non-urgent project is a sensible way to confirm fit before committing to a larger, ongoing arrangement.",
  },
  {
    question: "How is pricing determined?",
    answer:
      "Pricing is based on the specific scope, discipline and complexity of a project, agreed as a fixed quote before work begins, rather than an open-ended hourly arrangement with no upfront cost clarity.",
  },
  {
    question: "Can you work to our internal drawing standards and templates?",
    answer:
      "Yes. Share your title block, layer standard, numbering convention or CAD template and we'll deliver drawings consistent with your existing set rather than introducing a mismatched format.",
  },
  {
    question: "Do you handle both 2D drafting and 3D BIM modelling?",
    answer:
      "Yes, across the same team capability — 2D drawing production in AutoCAD-class tools and coordinated 3D BIM modelling in Revit and Civil 3D are both part of our core service range.",
  },
  {
    question: "How do you keep quality consistent when work is spread across several team members?",
    answer:
      "Every drawing goes through the same internal checking process regardless of who produced it, and drawings are always issued against the same agreed standard and scope, which keeps output consistent across the team.",
  },
  {
    question: "How do you decide who on the team works on a specific project?",
    answer:
      "Projects are assigned based on discipline-specific background and current capacity, so a structural detailing project and a mechanical conversion project are handled by people with the relevant experience for each.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "About Us | Render CAD Hub",
  description: "Render CAD Hub provides CAD design, drafting, BIM and engineering design support to Indian engineers, architects, builders and manufacturers.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
      <PageHero
        eyebrow="About Render CAD Hub"
        heading="About Render CAD Hub"
        description="CAD design, drafting, BIM and engineering design support for Indian engineers, architects, builders, manufacturers and contractors."
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-10">
          <div>
            <h2 className="text-xl font-semibold text-navy-900">Who We Are</h2>
            <div className="mt-3 space-y-4">
              <p className="text-base leading-relaxed text-neutral-700">
                Render CAD Hub is [COMPANY NAME], a CAD design, drafting, BIM and engineering documentation service working with
                Indian engineers, architects, builders, manufacturers and contractors. [YEARS EXPERIENCE] years of
                combined team experience across mechanical, structural, architectural, civil and electrical disciplines.
              </p>
              <p className="text-base leading-relaxed text-neutral-700">
                We work as flexible, on-demand drafting and design capacity — engaged for a single drawing, a full
                documentation package, or ongoing overflow support alongside an in-house engineering or design team.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy-900">Why We're Structured This Way</h2>
            <div className="mt-3 space-y-4">
              <p className="text-base leading-relaxed text-neutral-700">
                The reasoning behind how Render CAD Hub is structured is straightforward: most engineering, manufacturing and
                construction teams in India don't have a purely single-discipline drafting need. A manufacturing business
                might need mechanical part drawings one month and a structural mezzanine detail the next; a construction
                contractor might need civil site drawings coordinated against an architectural set produced by a separate
                consultant. Building our capability around covering that realistic mix of disciplines under one point of
                contact, rather than specialising narrowly in a single drawing type, reflects how drafting demand actually
                shows up for most of the clients we work with.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy-900">No Fabricated Claims</h2>
            <div className="mt-3 space-y-4">
              <p className="text-base leading-relaxed text-neutral-700">
                We deliberately don't present fabricated client logos, invented testimonials or unverifiable claims about
                scale on this page. Where a specific figure — years of experience, team size, project count — belongs
                here, it's marked as a placeholder until it can be confirmed and stated accurately, rather than filled
                with a plausible-sounding but unverified number. We'd rather a prospective client trust the specific
                claims we do make than pad this page with generic assurances that could describe any drafting business.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy-900">Clear, Upfront Scoping</h2>
            <div className="mt-3 space-y-4">
              <p className="text-base leading-relaxed text-neutral-700">
                Our working model is built around clear, upfront scoping. Before any drawing work begins, we confirm
                exactly what's being delivered, in what format, to what standard, and on what timeline — and that scope is
                reflected in a fixed quote rather than an open-ended hourly arrangement. This matters most for clients
                engaging outsourced drafting support for the first time, since it removes the ambiguity that otherwise
                makes a first outsourcing engagement feel riskier than it needs to.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy-900">Being Honest About What We Claim</h2>
            <div className="mt-3 space-y-4">
              <p className="text-base leading-relaxed text-neutral-700">
                We also try to be honest about the limits of what a drafting service can responsibly claim. We don't
                certify engineering compliance, sign off on structural adequacy, or replace the judgement of a licensed
                engineer or architect of record — our role is to translate design intent into accurate, well-organised,
                genuinely usable drawings and models, produced to whatever standard a project's engineer or architect
                specifies. Where a claim about compliance or certification would need to come from a licensed professional
                rather than a drafting service, we say so plainly rather than implying otherwise.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy-900">Discipline-Specific Assignment</h2>
            <div className="mt-3 space-y-4">
              <p className="text-base leading-relaxed text-neutral-700">
                Because our work spans several disciplines, we structure engagements around whoever on the team has the
                right background for a specific piece of work, rather than routing every project through a single
                generalist. A structural steel detailing project is handled by someone with structural detailing
                background; a mechanical part conversion is handled by someone with mechanical drafting background. This
                matters for quality in a way that's easy to overlook when comparing drafting services purely on price —
                discipline-specific experience shows up directly in how practical and constructable a finished drawing
                actually is.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy-900">Our Goal</h2>
            <div className="mt-3 space-y-4">
              <p className="text-base leading-relaxed text-neutral-700">
                Ultimately, the goal behind Render CAD Hub is simple: give Indian engineering, architecture, construction and
                manufacturing teams a single, reliable place to send drafting and design work that needs to be accurate,
                well-organised and delivered on a clear timeline, regardless of which specific discipline that work falls
                under.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="How we work" heading="Our Working Model" />
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-base font-semibold text-navy-900">Scope and quote before work begins</h3>
              <p className="mt-3 text-base leading-relaxed text-neutral-700">
                Every engagement starts with a clear review of what's being requested — the drawings, models or
                reference material provided, the required output format and standard, and the discipline involved.
                From that review we return a fixed price and turnaround, so a client knows exactly what to expect
                before committing to the work, rather than discovering scope creep partway through a project.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-navy-900">Working in your standard, not just ours</h3>
              <p className="mt-3 text-base leading-relaxed text-neutral-700">
                Where a client has an existing title block, layer convention or drawing numbering system, we work to
                that standard rather than defaulting to a generic one and asking the client to adapt. This matters
                most for clients who need a delivered drawing to sit consistently inside an existing, larger drawing
                set produced by their own team or other consultants.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-navy-900">Structured revision, not open-ended back and forth</h3>
              <p className="mt-3 text-base leading-relaxed text-neutral-700">
                Revisions are handled through clearly marked-up rounds rather than an unstructured stream of small
                requests. This keeps a project moving toward a genuine sign-off point rather than drifting indefinitely,
                and gives both sides a clear, shared record of exactly what changed between one revision and the next.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-navy-900">Confidentiality by default</h3>
              <p className="mt-3 text-base leading-relaxed text-neutral-700">
                Design and drawing information shared with us is treated as confidential as a matter of standard
                practice, not only when a formal agreement is in place. Where a client's own confidentiality
                agreement or NDA is required for a project, we're glad to work under it — but the underlying
                expectation of discretion applies to every engagement regardless of whether that paperwork exists.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-navy-900">Flexible engagement, not a rigid package</h3>
              <p className="mt-3 text-base leading-relaxed text-neutral-700">
                We don't force every client into the same fixed engagement model. A single drawing, a defined project
                with a clear end point, and an open-ended overflow arrangement running alongside an in-house team are
                all handled through the same underlying process, scaled to whatever the actual need is rather than
                requiring a client to commit to more than the project genuinely calls for.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 py-16 sm:py-20">
        <Container className="max-w-3xl space-y-5">
          <SectionHeading eyebrow="Why it's structured this way" heading="Why We Work Across Disciplines Rather Than Specialising Narrowly" />
          <p className="mt-6 text-base leading-relaxed text-neutral-700">
            A drafting service that only handles one discipline forces a client with a mixed drawing need to manage
            several vendors and coordinate between them directly — reconciling different drawing standards, different
            turnaround expectations, and different points of contact for what is, from the client's side, a single
            project. We built Render CAD Hub to remove that coordination burden rather than add to it, by covering the realistic
            range of disciplines an Indian engineering, construction or manufacturing team is likely to need across
            its actual project mix.
          </p>
          <p className="text-base leading-relaxed text-neutral-700">
            This doesn't mean treating every discipline as interchangeable — a structural steel detailer and a
            mechanical part drafter bring genuinely different, specific expertise, and we route work to whoever on
            the team has the relevant background rather than assigning it to whoever happens to be available. What it
            does mean is that a client with, say, both a structural mezzanine and a set of mechanical part drawings
            needed for the same project doesn't need to manage two separate vendor relationships to get both done
            consistently and to the same standard.
          </p>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="What we do" heading="Disciplines We Cover" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((category) => (
              <div key={category.slug} className="border border-neutral-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-navy-900">{category.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">{category.shortDescription}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Industries" heading="Industries We Work With" />
          <div className="mt-6 flex flex-wrap gap-2">
            {industries.map((industry) => (
              <span key={industry.slug} className="border border-neutral-300 px-3 py-1.5 text-sm text-navy-800">
                {industry.name}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Technology" heading="Software We Work In" />
            <div className="mt-6">
              <CheckList items={software.map((s) => s.name)} />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Quality" heading="Our Quality Process" />
            <div className="mt-6">
              <CheckList
                items={[
                  "Scope and drawing standard confirmed before work begins",
                  "Internal checking against source material and dimensional accuracy",
                  "Revision-controlled delivery with clear file naming",
                  "Structured markup and revision rounds through to sign-off",
                ]}
                columns={1}
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Coverage" heading="India-Wide Capability" />
          <p className="mt-6 text-base leading-relaxed text-neutral-700">
            All work is delivered remotely from the drawings, models or reference material you provide, so we work
            with clients across every Indian state and union territory without requiring a site visit.
          </p>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Team" heading="Our Team" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {["[TEAM MEMBER NAME]", "[TEAM MEMBER NAME]", "[TEAM MEMBER NAME]"].map((placeholder, i) => (
              <div key={i} className="border border-dashed border-neutral-300 bg-white p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center border border-neutral-300 bg-neutral-50 font-mono text-xs text-neutral-400">
                  Photo
                </div>
                <p className="mt-4 text-sm font-semibold text-navy-900">{placeholder}</p>
                <p className="mt-1 text-xs text-neutral-500">[ROLE / TITLE]</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <FAQ items={aboutFaqs} />

      <CTA />
    </>
  );
}
