import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { ShopDiagram } from "@/components/svg/StructDiagrams";
import { PackageGraphic } from "@/components/svg/StructVisuals";
import { Callout } from "@/components/mechanical/SplitSection";
import { overviewParagraphs } from "@/components/mechanical/content";
import { DarkSection, LightSection, Head, sentences } from "@/components/structural/ui";
import { ConnectionViewer } from "@/components/structural/ConnectionViewer";
import { TakeoffLinked, RevisionViewer } from "@/components/structural/TakeoffAndRevision";
import { DeliverablesPackage, type PackageTab } from "@/components/structural/DeliverablesPackage";
import { DesignToPiece, ErrorPropagation, MemberDetailing, PieceMarking, ErectionSequence, PackageViewer } from "./SteelClient";
import { SteelHub, ShopDrawingSheet, FabPracticality, ToolsWorkflow, FabToSite, SteelScene, SCENE_LABELS } from "./SteelStatic";

const faq = (s: Service, start: string) => s.faqs.find((f) => f.question.startsWith(start))?.answer ?? "";

export function DesignToPieceSection({ service }: { service: Service }) {
  const [first] = sentences(service.problemStatement);
  return (
    <LightSection id="design-to-piece">
      <Head eyebrow="Design to piece" heading="From Structural Design to Every Fabricated Piece">
        <p>{first}</p>
        <p>One element, followed from the engineer&apos;s design to its place on site. Scroll to watch it change.</p>
      </Head>
      <div className="mt-12"><DesignToPiece /></div>
    </LightSection>
  );
}

export function ErrorSection({ service }: { service: Service }) {
  const rest = sentences(service.problemStatement).slice(1).join(" ");
  return (
    <DarkSection id="detail-quality">
      <Head dark eyebrow="Why detailing quality matters" heading="Every Detail Has to Work Beyond the Drawing">
        <p>{rest}</p>
      </Head>
      <InView threshold={0.2} className="mt-12"><ErrorPropagation /></InView>
    </DarkSection>
  );
}

export function SteelCovers({ service }: { service: Service }) {
  const [a, b] = overviewParagraphs(service, "What This Service Covers");
  return (
    <section id="covers" className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Head eyebrow="Scope" heading="Piece-by-Piece Steel Detailing">
          <p>{a}</p>
          <p>{b}</p>
          <p className="text-sm">
            This is the fabrication-level specialisation of{" "}
            <Link href="/services/structural/structural-drafting" className="font-semibold text-navy-900 underline-offset-4 hover:text-copper-600 hover:underline">structural drafting</Link>.
          </p>
        </Head>
        <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
          <SteelHub className="mx-auto h-auto w-full min-w-[560px] max-w-3xl" />
        </InView>
      </Container>
    </section>
  );
}

export function MemberSection() {
  return (
    <DarkSection id="members" tone="900">
      <Head dark eyebrow="Member by member" heading="Every Member Gets Its Own Detail">
        <p>Select any column, beam or brace to see its piece mark, drawing reference and the parts detailed with it. Values are illustrative.</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><MemberDetailing /></InView>
    </DarkSection>
  );
}

export function ShopSection({ service }: { service: Service }) {
  const step = service.process.find((p) => p.title.toLowerCase().startsWith("detailing"))?.description ?? "";
  return (
    <LightSection id="shop-drawings" tint>
      <Head eyebrow="Shop drawings" heading="Shop Drawings Built for the Fabrication Floor">
        <p>{step}</p>
        <p>The sheet below is drawn in stages: outline, dimensions, hole locations, piece mark, connection callouts, then revision information.</p>
      </Head>
      <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
        <ShopDrawingSheet className="h-auto w-full min-w-[640px]" />
      </InView>
    </LightSection>
  );
}

export function SteelConnectionSection({ service }: { service: Service }) {
  return (
    <DarkSection id="connections">
      <Head dark eyebrow="Connections & bolts" heading="Where Steel Actually Comes Together">
        <p>{faq(service, "Do you detail moment connections")}</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><ConnectionViewer /></InView>
    </DarkSection>
  );
}

export function PracticalitySection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Erection Sequencing")[1];
  return (
    <LightSection id="practicality">
      <Head eyebrow="Fabrication practicality" heading="Detailing With Fabrication in Mind">
        <p>{text}</p>
        <Callout>{faq(service, "Can you suggest a simpler connection detail")}</Callout>
      </Head>
      <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
        <FabPracticality className="h-auto w-full min-w-[640px]" />
      </InView>
      <p className="mt-4 text-sm text-neutral-500">Illustrative comparison. Detailing weighs fabrication practicality alongside the engineer&apos;s specified requirements, and simplifications go to the engineer for review.</p>
    </LightSection>
  );
}

export function ToolsSection({ service }: { service: Service }) {
  const b = overviewParagraphs(service, "What This Service Covers")[1];
  return (
    <DarkSection id="software" tone="900">
      <Head dark eyebrow="Software" heading="Detailing Software That Matches the Steel Package">
        <p>{b}</p>
        <p className="text-sm">
          <Link href="/software/tekla" className="font-semibold text-white underline-offset-4 hover:text-copper-400 hover:underline">Tekla Structures</Link>
          <span className="mx-2 text-neutral-500">·</span>
          <Link href="/software/autocad" className="font-semibold text-white underline-offset-4 hover:text-copper-400 hover:underline">AutoCAD</Link>
        </p>
      </Head>
      <InView threshold={0.25} className="mt-12 overflow-x-auto border border-steel-300/20 bg-ink-950 p-3">
        <ToolsWorkflow className="h-auto w-full min-w-[640px]" />
      </InView>
    </DarkSection>
  );
}

export function SteelTakeoff({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Take-Offs and Piece Marking")[0];
  return (
    <DarkSection id="take-offs">
      <Head dark eyebrow="Quantities" heading="The Drawing Set Carries the Quantities">
        <p>{text}</p>
        <p className="text-sm">Hover a member or a schedule row: each highlights the other.</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><TakeoffLinked /></InView>
    </DarkSection>
  );
}

export function PieceMarkingSection({ service }: { service: Service }) {
  const [, text] = overviewParagraphs(service, "Take-Offs and Piece Marking");
  const jobs = overviewParagraphs(service, "Consistency Across Concurrent Jobs")[0];
  return (
    <DarkSection id="piece-marking" tone="900">
      <Head dark eyebrow="Piece marking" heading="Piece Marking That Keeps the Fabrication Floor Organized">
        <p>{text}</p>
        <p>{jobs}</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><PieceMarking /></InView>
    </DarkSection>
  );
}

export function ErectionSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Erection Sequencing")[0];
  return (
    <DarkSection id="erection">
      <Head dark eyebrow="Erection" heading="Detailing That Follows the Erection Sequence">
        <p>{text}</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><ErectionSequence /></InView>
    </DarkSection>
  );
}

export function HandoffFabSite({ service }: { service: Service }) {
  return (
    <LightSection id="shop-to-site">
      <Head eyebrow="Handoff" heading="From Shop Floor to Site">
        <p>{faq(service, "Can you provide a shop drawing set that reflects")}</p>
      </Head>
      <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
        <FabToSite className="h-auto w-full min-w-[640px]" />
      </InView>
    </LightSection>
  );
}

const TABS: PackageTab[] = [
  { id: "shop", label: "Shop drawings", match: "^Shop drawings|Revision-controlled" },
  { id: "erection", label: "Erection", match: "^Erection" },
  { id: "connections", label: "Connections", match: "Connection and bolt" },
  { id: "takeoff", label: "Take-off", match: "Material take-offs" },
  { id: "tekla", label: "Tekla model", match: "Tekla" },
  { id: "pieces", label: "Piece marks", match: "Piece mark" },
  { id: "coating", label: "Coating", match: "Paint" },
];

export function SteelDeliverables({ service }: { service: Service }) {
  return (
    <DarkSection id="deliverables" tone="900">
      <Reveal>
        <SectionHeading tone="dark" eyebrow="Deliverables" heading="What You Get" description="A fabrication package, one sheet type at a time." />
      </Reveal>
      <InView threshold={0.15} className="mt-12"><DeliverablesPackage service={service} tabs={TABS} /></InView>
    </DarkSection>
  );
}

export function SteelApplications({ service }: { service: Service }) {
  return (
    <LightSection id="applications">
      <Reveal><SectionHeading eyebrow="Applications" heading="Where Steel Detailing Fits" /></Reveal>
      <InView as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {service.applications.map((a, i) => (
          <li key={a}>
            <Reveal delay={(i % 3) * 70} className="h-full">
              <div className="group h-full border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40">
                <div className="relative aspect-[8/5] overflow-hidden bg-ink-950 text-sky-300">
                  <TechnicalGrid id={`sa-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                  <SteelScene k={i} className="art-zoom relative h-full w-full p-2" />
                </div>
                <div className="p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-copper-600">{SCENE_LABELS[i]}</p>
                  <p className="mt-1 text-base font-semibold leading-snug tracking-tight text-navy-900">{a}</p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </InView>
    </LightSection>
  );
}

const checks = ["Design intent", "Member detail", "Connection", "Fabrication practicality", "Piece mark", "Revision"];

export function CheckingSection({ service }: { service: Service }) {
  const step = service.process.find((p) => p.title.toLowerCase().startsWith("checking"))?.description ?? "";
  return (
    <LightSection id="checking" tint>
      <Head eyebrow="Checking" heading="Detailing Checks Before It Reaches the Shop Floor">
        <p>{step}</p>
      </Head>
      <InView threshold={0.3} className="mt-12 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="aspect-[320/220] border border-navy-800 bg-ink-950 p-3" aria-hidden><ShopDiagram /></div>
        <ul className="space-y-2 border border-navy-800 bg-ink-900 p-5">
          <li className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Inspection checklist</li>
          {checks.map((c, i) => (
            <li key={c} className="reveal flex items-center gap-3 text-sm text-neutral-200" style={{ "--d": `${i * 260}ms` } as React.CSSProperties}>
              <span aria-hidden className="flex h-5 w-5 items-center justify-center border border-emerald-400/60 bg-emerald-400/10 text-emerald-400">
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6.5l2.5 2.5L10 3.5" /></svg>
              </span>
              {c}
            </li>
          ))}
          <li className="reveal flex items-center gap-3 border-t border-steel-300/20 pt-3 text-sm text-copper-400" style={{ "--d": "1700ms" } as React.CSSProperties}>
            <span aria-hidden>⚑</span> Flag for engineer review where the source design is unclear
          </li>
        </ul>
      </InView>
    </LightSection>
  );
}

export function SteelRevision({ service }: { service: Service }) {
  return (
    <DarkSection id="revisions">
      <Head dark eyebrow="Revision control" heading="Built for Projects That Change">
        <p>{faq(service, "Can you detail steel for a fast-track project")}</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><RevisionViewer /></InView>
    </DarkSection>
  );
}

export function PackageSection() {
  return (
    <DarkSection id="package" tone="900">
      <Head dark eyebrow="Fabrication package" heading="Every Document Traces Back to the Model">
        <p>Choose a document to see which members of the model it describes.</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><PackageViewer /></InView>
    </DarkSection>
  );
}

export function SteelRelated() {
  const chain: { label: string; href?: string }[] = [
    { label: "Engineering design", href: "/services/engineering-design/engineering-design" },
    { label: "Structural drafting", href: "/services/structural/structural-drafting" },
    { label: "Steel detailing" },
    { label: "BIM coordination", href: "/services/bim/bim-services" },
    { label: "Fabrication" },
  ];
  return (
    <LightSection id="related">
      <Reveal><SectionHeading eyebrow="Related" heading="Related Engineering Services" /></Reveal>
      <InView as="ol" className="mt-12 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        {chain.map((c, i) => (
          <li key={c.label} className="reveal flex flex-1 items-center gap-3" style={{ "--d": `${i * 150}ms` } as React.CSSProperties}>
            {c.href ? (
              <Link href={c.href} className="group flex flex-1 items-center justify-between gap-2 border border-neutral-200 bg-white px-4 py-4 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-900/40">
                {c.label}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            ) : (
              <span className={`flex-1 border px-4 py-4 text-sm font-semibold ${c.label === "Steel detailing" ? "border-navy-900 bg-navy-900 text-white" : "border-neutral-200 bg-neutral-50 text-neutral-600"}`}>{c.label}{c.label === "Steel detailing" ? <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">You are here</span> : null}</span>
            )}
            {i < chain.length - 1 ? <span aria-hidden className="hidden font-mono text-copper-500 lg:block">→</span> : null}
          </li>
        ))}
      </InView>
    </LightSection>
  );
}

export function SteelCTA() {
  return (
    <InView as="section" threshold={0.25} className="relative overflow-hidden border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <TechnicalGrid id="steel-cta-grid" className="text-sky-300/[0.07]" minor={28} major={140} />
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Get a Quote for Steel Detailing</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">Tell us what you need and our team can review the project requirements.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button>
            <Button href="/services/structural" size="lg" variant="outline-light">Explore Structural Services</Button>
          </div>
        </div>
        <div aria-hidden className="border border-steel-300/20 bg-ink-900/50 p-2"><PackageGraphic className="h-auto w-full" /></div>
      </Container>
    </InView>
  );
}
