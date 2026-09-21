import type { Metadata } from "next";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { FAQ } from "@/components/FAQ";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SITE, SERVICE_AREAS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

const contactContext = [
  {
    heading: "What to include in your message",
    paragraphs: [
      "The more specific your initial message is, the faster we can come back with a useful, accurate response rather than a round of clarifying questions. A short description of the discipline involved (mechanical, structural, architectural, civil, electrical or BIM), the rough scope (a single drawing, a full documentation package, or ongoing capacity), and any reference material you can attach — existing drawings, PDFs, photos of a physical part — gives us enough to respond meaningfully on the first reply.",
      "If you're not yet sure exactly what you need, that's a fine place to start too — describe the problem you're trying to solve rather than a specific deliverable, and we'll help work out what that actually translates to in terms of drawings or models required.",
    ],
  },
  {
    heading: "What happens after you send a message",
    paragraphs: [
      "We review what's been shared and respond with either an answer to your question directly, or a request for the small amount of additional detail needed to scope the work properly. For anything that looks like a defined project rather than a general question, the next step is usually a fixed quote and turnaround estimate, provided through our quote form or directly by email depending on how the conversation started.",
      "There's no obligation attached to an initial enquiry — asking a question or requesting a quote doesn't commit you to proceeding, and we'd rather answer a question honestly, including telling you if something isn't a good fit for us, than push every enquiry toward a sale.",
    ],
  },
  {
    heading: "Response times",
    paragraphs: [
      "We aim to respond to enquiries within our stated business hours below. A straightforward question can often be answered same-day; a request that needs scoping against attached drawings may take a little longer, since we'd rather give an accurate quote than a fast but unreliable one.",
    ],
  },
  {
    heading: "Contacting us about an existing project",
    paragraphs: [
      "If you're already an active client with a question about a current project, referencing your project or drawing number in your message helps us route it to the right person faster than a general enquiry would. For anything urgent on an active project, phone is usually faster than email or the contact form.",
    ],
  },
  {
    heading: "Enquiries we're not the right fit for",
    paragraphs: [
      "We're a CAD drafting, BIM and engineering design support service — we don't provide structural, mechanical or other professional engineering certification, and we're not a substitute for a licensed engineer or architect of record signing off on a design. If your enquiry is specifically about needing that kind of professional sign-off rather than drafting or design support, it's worth knowing upfront so we can point you in the right direction rather than taking on an enquiry we're not positioned to help with.",
    ],
  },
  {
    heading: "Contacting us for a large or ongoing capacity arrangement",
    paragraphs: [
      "If you're reaching out about ongoing or overflow drafting capacity rather than a single defined project, it helps to describe the rough shape of that ongoing need in your first message — expected volume, which disciplines are typically involved, and whether the arrangement would run alongside an existing in-house team. This lets us respond with a structure suited to an ongoing relationship rather than a one-off project quote that doesn't quite fit what you're actually asking for.",
      "These conversations often benefit from a short call rather than pure email back-and-forth, since an ongoing arrangement usually has more nuance — internal approval workflows, varying monthly volume, specific software or standards requirements — than a single project brief. Mentioning that you're open to a call in your first message speeds this up.",
    ],
  },
  {
    heading: "If you've contacted us before",
    paragraphs: [
      "Returning clients don't need to re-explain background context that's already on file — referencing a previous project, quote reference or point of contact lets us pick up quickly without asking you to repeat information we should already have. If your usual point of contact isn't available, mentioning the previous project reference in your message still gets a new response routed correctly.",
    ],
  },
  {
    heading: "A note on how we use the information you send",
    paragraphs: [
      "Information shared through this form or by email is used only to respond to your enquiry and, where relevant, to scope and deliver the work you've requested — it isn't shared with third parties or used for purposes unrelated to your enquiry. Any drawings or design files you attach are treated with the same confidentiality as material shared during an active project, regardless of whether an engagement has actually started yet.",
    ],
  },
  {
    heading: "Choosing between the contact form and the quote form",
    paragraphs: [
      "This page is the right starting point for a general question, a query about an existing project, or anything that doesn't yet amount to a specific, scoped request — think of it as the place to reach us when you're not sure exactly what you need yet. Once you know roughly what you're after — a discipline, a rough scope, a deadline — the dedicated quote form is structured to capture those details a little more efficiently and get a priced response back to you faster.",
      "Neither path is the 'wrong' one to start with — a quote request submitted through this contact form will still be reviewed and responded to properly, and a general question submitted through the quote form will still get a genuine answer rather than being forced into a formal quote it doesn't need.",
    ],
  },
  {
    heading: "Reaching us about a technical or drawing standard question",
    paragraphs: [
      "If your question is about a specific drawing convention, a Level of Development definition, an Indian Standard reference, or another technical topic rather than a request for work, our resources section — covering guides, blog articles and standards overviews — may already have a useful answer. Where it doesn't, or where you'd like something more specific to your project, reaching out directly through this page is a good next step.",
    ],
  },
];

const contactFaqs = [
  {
    question: "Do I need to have a fully scoped project before contacting you?",
    answer: "No. A general question, a rough idea of what you need, or a fully scoped project brief are all fine starting points — we'll help clarify scope where it isn't fully defined yet.",
  },
  {
    question: "Is there a minimum project size to work with you?",
    answer: "No formal minimum. We take on everything from a single drawing to a large, ongoing multi-discipline engagement.",
  },
  {
    question: "Can I call instead of using the contact form?",
    answer: "Yes, phone contact is available during business hours — see the phone number listed alongside this form.",
  },
  {
    question: "Will contacting you commit me to paying for anything?",
    answer: "No. An enquiry or quote request carries no obligation. Nothing is billed until a scope and price are explicitly agreed.",
  },
  {
    question: "What file types can I attach when I get in touch?",
    answer: "Common CAD formats (DWG, DXF, RVT), PDFs, images and scanned drawings are all fine. If a file is too large to attach directly, mention it and we'll arrange an alternative way to share it.",
  },
  {
    question: "Do you respond to enquiries outside business hours?",
    answer: "Messages sent outside business hours are received and reviewed as soon as the next business period begins.",
  },
  {
    question: "Can I request a quote through this page, or only through the dedicated quote form?",
    answer: "Either works. This contact form is fine for a quote request, though the dedicated quote form is structured to capture scope details a little faster.",
  },
  {
    question: "I'm not sure which discipline my project falls under — can I still ask?",
    answer: "Yes — describe what you're trying to achieve rather than the discipline, and we'll help identify what kind of drafting or design work it actually calls for.",
  },
  {
    question: "Can I reach you for a follow-up question about a quote already provided?",
    answer: "Yes, referencing the original quote or enquiry helps us pick the conversation back up quickly.",
  },
  {
    question: "Do you handle enquiries from outside India?",
    answer: "Our core service focus is Indian clients and Indian engineering, drafting and construction standards, but international enquiries related to Indian-standard work are welcome to reach out.",
  },
  {
    question: "Can I send a large batch of drawings for review before formally requesting a quote?",
    answer: "Yes — for a larger batch, mention roughly how many drawings and files are involved and we'll arrange a practical way to share them if attaching directly to the form isn't suitable.",
  },
  {
    question: "Who will actually respond to my message?",
    answer: "Enquiries are reviewed by our team and routed to whoever has the relevant discipline background, rather than a generic first-response queue disconnected from the actual work.",
  },
  {
    question: "Can I ask a general question about CAD or BIM without it turning into a sales conversation?",
    answer: "Yes — we're happy to answer general questions directly, and we won't push an unrelated sales conversation onto an enquiry that's genuinely just a question.",
  },
  {
    question: "Can I request that a specific person on your team handle my enquiry?",
    answer: "Yes, if you've worked with someone specific before, mention their name and we'll route your message to them where possible.",
  },
  {
    question: "Is there a way to track the status of an enquiry I've already sent?",
    answer: "Reply directly to our response email and reference your original message — this keeps everything in one thread that's easy for us to track.",
  },
  {
    question: "Can I attach more than one file to my message?",
    answer: "Yes — attach as many relevant files as needed, and mention in your message if a batch is too large to attach directly so we can arrange another way to share it.",
  },
  {
    question: "What's the best way to reach you for an urgent, time-sensitive request?",
    answer: "Phone during business hours is the fastest route for anything urgent — mention the urgency clearly if you're following up by email or the contact form instead.",
  },
  {
    question: "Do you provide updates if a response is going to take longer than usual?",
    answer: "Yes — if a request needs more time than our usual response window, we'll send a short note letting you know rather than leaving you without any update.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "Contact Us | Render CAD Hub",
  description: "Get in touch with Render CAD Hub for CAD drafting, BIM and engineering design enquiries across India.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      <PageHero
        eyebrow="Contact"
        heading="Contact Us"
        description="Have a question before requesting a quote? Send us a message and we'll get back to you."
        primaryLabel="Get a Free Quote"
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <ContactForm />
          <aside className="space-y-6">
            <ContactDetail icon={Mail} label="Email" value={SITE.email} />
            <ContactDetail icon={Phone} label="Phone" value={SITE.phone} />
            <ContactDetail icon={Clock} label="Business hours" value={SITE.hours} />
            <ContactDetail icon={MapPin} label="Service areas" value={SERVICE_AREAS.join(", ")} />
            <div className="border-t border-neutral-200 pt-6">
              <Button href="/get-a-quote" className="w-full">
                Get a Free Quote
              </Button>
            </div>
          </aside>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Before you reach out" heading="Getting the Most Out of Your Enquiry" />
          <div className="mt-8 space-y-8">
            {contactContext.map((block) => (
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

      <FAQ items={contactFaqs} />
    </>
  );
}

function ContactDetail({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border border-neutral-200 p-5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-copper-500" aria-hidden />
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-neutral-500">{label}</p>
        <p className="mt-1 text-sm text-navy-900">{value}</p>
      </div>
    </div>
  );
}
