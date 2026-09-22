import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { FAQ } from "@/components/FAQ";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE, SERVICE_AREAS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

const quoteContext = [
  {
    heading: "What makes a quote request faster and more accurate",
    paragraphs: [
      "A quote is only as accurate as the information it's based on, so the fastest way to get a genuinely useful number back is to be specific about scope. Tell us the discipline (mechanical, structural, architectural, civil, electrical or BIM), roughly how many drawings or sheets are involved, what format you need the output delivered in, and any deadline you're working to. Attaching whatever reference material you already have — existing drawings, sketches, PDFs, photos of a physical part, or a written brief — lets us scope accurately on the first pass rather than needing a follow-up round of questions.",
      "If you don't yet know some of these details — a final sheet count, for instance, before a design is finalised — that's fine to leave approximate. We'll ask directly if something material to the price still needs clarifying, rather than guessing and risking an inaccurate quote.",
    ],
  },
  {
    heading: "How we arrive at a fixed price",
    paragraphs: [
      "Once we understand scope, discipline and complexity, we put together a fixed price and turnaround rather than an open-ended hourly estimate. This means you know the full cost before committing to anything, and it removes the risk of a project running over budget purely because it took longer than expected on our side — that risk sits with us, not with you, once a quote is agreed.",
      "For larger or less clearly defined projects, we may propose a staged approach — quoting an initial phase firmly, with later phases quoted once the project has progressed enough to scope them accurately. This is more honest than quoting an entire large, uncertain project as a single fixed number based on assumptions that might not hold.",
    ],
  },
  {
    heading: "Turnaround expectations",
    paragraphs: [
      "Turnaround depends on the scope and complexity of what's being requested, and on current capacity at the time of your enquiry. A quote will always include a specific turnaround estimate for your project rather than a generic range, so you can plan around it with confidence.",
    ],
  },
  {
    heading: "No obligation attached to a quote request",
    paragraphs: [
      "Requesting a quote doesn't commit you to proceeding. We'd rather provide an honest, accurate quote — including telling you if a project isn't a good fit for us, or if we think a simpler approach than what's been requested would serve you better — than push every enquiry toward a sale regardless of fit.",
    ],
  },
  {
    heading: "Working from incomplete or rough reference material",
    paragraphs: [
      "Not every quote request starts with a clean, complete brief, and that's genuinely fine — a rough sketch, a verbal description relayed in writing, or a partially complete set of existing drawings are all workable starting points. Where reference material is incomplete, we'll flag exactly what's missing and how it affects the quote, rather than quoting confidently against assumptions that might not hold once the full picture becomes clear.",
    ],
  },
  {
    heading: "Comparing our quote against another provider's",
    paragraphs: [
      "If you're comparing quotes across more than one drafting provider, it's worth checking that both quotes cover the same scope, deliverable format and revision allowance before comparing the headline price alone — a lower quote that excludes revisions, or delivers in a less useful format, isn't necessarily the better value once those gaps are accounted for. We're glad to clarify exactly what's included in our quote if that makes a like-for-like comparison easier.",
      "We'd also rather lose a project to a genuinely better-suited provider than win one by quoting a scope we don't think will actually serve the project well — if something about your requirements suggests a different approach than what's been requested, we'll say so as part of the quote rather than silently quoting exactly what was asked even where we think it's not quite the right fit.",
    ],
  },
  {
    heading: "Quotes for projects that are still evolving",
    paragraphs: [
      "For a project where the design itself is still being finalised — a building still in schematic design, a product still being iterated — it's often more useful to quote an initial phase of drafting work firmly, with later phases quoted once the design has stabilised enough to scope accurately. This avoids either an inflated early quote padded for uncertainty, or a low early quote that ends up needing significant revision once the real scope becomes clear.",
    ],
  },
  {
    heading: "What a quote does and doesn't include",
    paragraphs: [
      "A quote covers the drafting or design deliverable itself — the agreed drawings, models or documentation, produced to the agreed standard and format, including the agreed number of revision rounds. It doesn't include engineering certification, professional sign-off, or site-based services unless these are explicitly discussed and included as part of the scope, since those typically sit with a licensed engineer or architect of record rather than a drafting service.",
    ],
  },
  {
    heading: "Requesting a quote for recurring or overflow work",
    paragraphs: [
      "If you're looking for ongoing capacity rather than a single project, mention that in your request — the pricing structure for recurring or overflow work is usually different from a one-off project quote, often reflecting a standing arrangement rather than a per-drawing price agreed fresh each time. Describing your expected typical volume and cadence helps us propose a structure that actually fits an ongoing relationship rather than forcing a recurring need through a one-off quote process every time.",
    ],
  },
  {
    heading: "What we need from you to keep a quote valid",
    paragraphs: [
      "A quote is based on the scope as described at the time it's issued — if requirements change meaningfully before work begins, it's worth confirming the quote still applies rather than assuming it automatically covers a revised scope. This is a quick check that avoids a mismatch being discovered only once work is already underway.",
    ],
  },
];

const quoteFaqs = [
  {
    question: "Is the quote form the only way to request a price?",
    answer: "No — you're welcome to request a quote by email or phone as well. The form is simply structured to capture the details we need a little faster.",
  },
  {
    question: "How long does it take to receive a quote?",
    answer: "Straightforward requests are often quoted within a business day or two. More complex or ambiguous scopes may take a little longer to review properly.",
  },
  {
    question: "Do you charge for providing a quote?",
    answer: "No, quotes are provided free of charge with no obligation to proceed.",
  },
  {
    question: "Can the price change after work has started?",
    answer: "Not for the agreed scope. If the scope genuinely changes partway through — additional drawings, a discipline not originally included — we'll discuss and agree any adjustment before proceeding, not after the fact.",
  },
  {
    question: "What if I only have a rough idea of what I need, not a full brief?",
    answer: "That's a completely normal starting point. Describe what you're trying to achieve and we'll help translate that into a specific, quotable scope.",
  },
  {
    question: "Can I get a quote for an ongoing arrangement, not just a single project?",
    answer: "Yes — let us know you're looking for ongoing or overflow capacity rather than a one-off project, and we'll structure a quote around that arrangement instead.",
  },
  {
    question: "Do you need the final files before quoting, or is a description enough?",
    answer: "A description is often enough for an initial estimate, though attaching any available reference material — even incomplete or rough — helps sharpen the accuracy of the number we come back with.",
  },
  {
    question: "Is there a cost difference between disciplines?",
    answer: "Pricing reflects the specific scope and complexity of each project rather than a flat per-discipline rate, so it's best assessed per request rather than assumed from a general price list.",
  },
  {
    question: "Can I request a quote for a project based outside the city we're headquartered in?",
    answer: "Yes — work is delivered remotely from the reference material you provide, so location within India isn't a barrier to a quote or the work itself.",
  },
  {
    question: "What happens if I don't respond to a quote right away?",
    answer: "Nothing — a quote simply remains available for you to accept when you're ready, within the timeframe noted in the quote itself.",
  },
  {
    question: "Can I request a quote for work that hasn't been scoped by an engineer yet?",
    answer: "Yes — we can quote based on your description of requirements, and flag anywhere the scope may need engineering input before drafting can proceed.",
  },
  {
    question: "Do you provide itemised quotes for multi-part projects?",
    answer: "Yes, for a project spanning several distinct deliverables we're happy to itemise the quote by deliverable rather than providing only a single bundled figure.",
  },
  {
    question: "Is a deposit required before work begins?",
    answer: "Payment terms are agreed as part of the quote and vary by project size and relationship — this will be made clear before any work starts.",
  },
  {
    question: "Can a quote be revised if I change the scope after receiving it?",
    answer: "Yes — send us the updated requirements and we'll issue a revised quote reflecting the new scope before any additional work begins.",
  },
  {
    question: "Do you quote projects that combine several disciplines into one package?",
    answer: "Yes — a project spanning, for example, structural and architectural drafting together can be quoted as a single combined package rather than two separate ones.",
  },
  {
    question: "Will I get the same quote if I submit the same request twice?",
    answer: "Generally yes, provided scope and timing haven't changed — pricing is based on the work itself rather than varying by who happens to review the request.",
  },
  {
    question: "Can I request a quote comparing two different delivery formats?",
    answer: "Yes — if you're deciding between two output formats or standards, ask for both to be quoted so you can compare cost and turnaround before deciding.",
  },
  {
    question: "Is there a faster, expedited quote option for urgent requests?",
    answer: "Mention the urgency and deadline in your request — we'll flag whether an expedited turnaround is feasible and reflect that in the quote and pricing.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "Get a Free Quote | Render CAD Hub",
  description: "Request a CAD drafting, BIM or engineering design quote. Tell us what you need and our team will review the project requirements.",
  path: "/get-a-quote",
});

export default function GetAQuotePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Get a Quote", href: "/get-a-quote" }]} />
      <PageHero
        eyebrow="Get a quote"
        heading="Get a Free Quote"
        description="Tell us what you need and our team can review the project requirements."
        primaryHref="#quote-form"
        primaryLabel="Jump to form"
      />

      <section id="quote-form" className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <QuoteForm />
          <aside className="space-y-8">
            <div className="border border-neutral-200 bg-neutral-50 p-6">
              <h2 className="text-sm font-semibold text-navy-900">What happens next</h2>
              <ol className="mt-4 space-y-3 text-sm text-neutral-600">
                <li>1. We review your brief and any files you&apos;ve attached.</li>
                <li>2. We confirm scope, format and turnaround.</li>
                <li>3. You receive a fixed-price quote before any work starts.</li>
              </ol>
            </div>
            <div className="border border-neutral-200 p-6">
              <h2 className="text-sm font-semibold text-navy-900">Service areas</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{SERVICE_AREAS.join(", ")}.</p>
            </div>
            <div className="border border-neutral-200 p-6">
              <h2 className="text-sm font-semibold text-navy-900">{SITE.phone ? "Prefer email or phone?" : "Prefer email?"}</h2>
              <p className="mt-3 text-sm text-neutral-600">Email: {SITE.email}</p>
              {SITE.phone ? <p className="mt-1 text-sm text-neutral-600">Phone: {SITE.phone}</p> : null}
            </div>
          </aside>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Before you submit" heading="Getting an Accurate Quote" />
          <div className="mt-8 space-y-8">
            {quoteContext.map((block) => (
              <div key={block.heading}>
                <h3 className="text-base font-semibold text-navy-900">{block.heading}</h3>
                <div className="mt-3 space-y-4">
                  {block.paragraphs.map((paragraph, i) => (
                    <p key={i} className="text-base leading-relaxed text-neutral-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <FAQ items={quoteFaqs} />
    </>
  );
}
