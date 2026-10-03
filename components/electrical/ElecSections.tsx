import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { Sld } from "@/components/svg/Sld";
import { ElecSchematic } from "@/components/svg/ElecSchematic";
import { PanelLayout } from "@/components/svg/PanelLayout";
import { AsBuilt } from "@/components/svg/AsBuilt";
import { ElecBim } from "@/components/svg/ElecBim";
import { Callout } from "@/components/mechanical/SplitSection";
import { overviewParagraphs } from "@/components/mechanical/content";
import { DarkSection, LightSection, Head, sentences } from "@/components/structural/ui";
import { projects } from "@/data/projects";
import { SldExplorer, SchematicTrace, SchematicToPanel, SldSchedule, AsBuiltCompare, ReferenceTrace, ElecRevision, ElecDeliverables, ElecViewer, ElecBimLayers, SecondLife, SystemEvolve } from "./ElecClient";
import { ElecArt, AutoCadTile, RevitTile, ElecPackage, type ElecArtName } from "./ElecStatic";

const faq = (s: Service, start: string) => s.faqs.find((f) => f.question.startsWith(start))?.answer ?? "";

export function ElecIntro({ service }: { service: Service }) {
  const [first, ...rest] = sentences(service.problemStatement);
  return (
    <DarkSection id="story" tone="900">
      <Head dark eyebrow="One connected system" heading="From Electrical Design Information to Usable Documentation">
        <p>{first}</p>
        <p>{rest.join(" ")}</p>
      </Head>
      <div className="mt-12"><SystemEvolve /></div>
    </DarkSection>
  );
}

const modules: { n: string; title: string; art: React.ReactNode }[] = [
  { n: "01", title: "Single-line diagrams", art: <Sld showLabels={false} /> },
  { n: "02", title: "Electrical schematics", art: <ElecSchematic /> },
  { n: "03", title: "Switchboard drawings", art: <PanelLayout variant="switchboard" /> },
  { n: "04", title: "Control panel drawings", art: <PanelLayout /> },
  { n: "05", title: "As-built documentation", art: <AsBuilt split={0.5} showMarkers={false} /> },
  { n: "06", title: "BIM coordination", art: <ElecBim run={false} /> },
];

export function ElecCovers({ service }: { service: Service }) {
  const [a, b] = overviewParagraphs(service, "What This Service Covers");
  return (
    <section id="covers" className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Head eyebrow="Scope" heading="Electrical Documentation Built for the People Who Use It">
          <p>{a}</p>
          <p>{b}</p>
        </Head>
        <InView as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <li key={m.n}>
              <Reveal delay={(i % 3) * 80} className="h-full">
                <div className="group h-full border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40">
                  <div className="relative aspect-[640/400] overflow-hidden bg-ink-950 p-2">
                    <TechnicalGrid id={`ec-${i}`} className="text-sky-300/[0.06]" minor={20} major={100} />
                    <div className="relative h-full w-full [&>svg]:h-full [&>svg]:w-full">{m.art}</div>
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-xs tracking-[0.16em] text-copper-600">{m.n}</p>
                    <h3 className="mt-1 text-base font-semibold tracking-tight text-navy-900">{m.title}</h3>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </InView>
      </Container>
    </section>
  );
}

export function SldSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "What This Service Covers")[0];
  return (
    <DarkSection id="single-line">
      <Head dark eyebrow="Single-line" heading="A Clear Electrical System at a Glance">
        <p>{text}</p>
        <p className="text-sm">A single-line diagram shows how supply, protection, distribution and loads connect. Click a panel to light up everything downstream.</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><SldExplorer /></InView>
    </DarkSection>
  );
}

export function SignatureSection() {
  return (
    <DarkSection id="connected" tone="900">
      <Head dark eyebrow="Signature view" heading="One Electrical System → Multiple Connected Documents">
        <p>Pick a circuit. The same reference appears in the single-line diagram, the schematic, the schedule, the panel layout and the as-built record — which is what documentation consistency looks like.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><ReferenceTrace /></InView>
    </DarkSection>
  );
}

export function SchematicSection({ service }: { service: Service }) {
  return (
    <DarkSection id="schematics">
      <Head dark eyebrow="Schematics" heading="From System Logic to Detailed Schematics">
        <p>{faq(service, "Do you produce control system schematics")}</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><SchematicTrace /></InView>
    </DarkSection>
  );
}

export function PanelSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Schedule Accuracy")[1];
  return (
    <DarkSection id="panels" tone="900">
      <Head dark eyebrow="Switchboards & control panels" heading="Drawings That Translate Into Physical Panel Layouts">
        <p>{text}</p>
        <p className="text-sm">Hover a component on either side: the same reference lights up on the other.</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><SchematicToPanel /></InView>
    </DarkSection>
  );
}

export function ScheduleSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Schedule Accuracy")[0];
  return (
    <DarkSection id="schedules">
      <Head dark eyebrow="Schedules" heading="Schedules That Stay Connected to the Drawings">
        <p>{text}</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><SldSchedule /></InView>
    </DarkSection>
  );
}

export function AsBuiltSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "As-Built Documentation")[0];
  return (
    <DarkSection id="as-built" tone="900">
      <Head dark eyebrow="As-built" heading="Document What Was Actually Installed">
        <p>{text}</p>
        <Callout dark>{faq(service, "Do you produce as-built cable schedules")}</Callout>
      </Head>
      <InView threshold={0.2} className="mt-12"><AsBuiltCompare /></InView>
    </DarkSection>
  );
}

export function SecondLifeSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "As-Built Documentation")[1];
  return (
    <LightSection id="second-life">
      <Head eyebrow="After handover" heading="Electrical Documentation Has a Long Second Life">
        <p>{text}</p>
      </Head>
      <div className="mt-12"><SecondLife /></div>
    </LightSection>
  );
}

export function CommissioningSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Schedules as a Live")[0];
  return (
    <DarkSection id="commissioning">
      <Head dark eyebrow="Commissioning" heading="Schedules That Work During Commissioning">
        <p>{text}</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><ReferenceTrace mode="commissioning" /></InView>
    </DarkSection>
  );
}

export function ElecDeliverablesSection({ service }: { service: Service }) {
  return (
    <DarkSection id="deliverables" tone="900">
      <Reveal><SectionHeading tone="dark" eyebrow="Deliverables" heading="What You Get" description="A connected document package: pick a sheet type to preview it." /></Reveal>
      <InView threshold={0.15} className="mt-12"><ElecDeliverables service={service} /></InView>
    </DarkSection>
  );
}

const appArt: ElecArtName[] = ["switchboard", "control", "commercial", "asbuilt", "bim", "upgrade"];

export function ElecApplications({ service }: { service: Service }) {
  return (
    <LightSection id="applications">
      <Reveal><SectionHeading eyebrow="Applications" heading="Where Electrical Drafting Is Used" /></Reveal>
      <InView as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {service.applications.map((a, i) => (
          <li key={a}>
            <Reveal delay={(i % 3) * 70} className="h-full">
              <div className="group h-full border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40">
                <div className="relative aspect-[8/5] overflow-hidden bg-ink-950 text-sky-300">
                  <TechnicalGrid id={`ea-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                  <div className="art-zoom relative h-full w-full p-3"><ElecArt name={appArt[i % appArt.length]} /></div>
                </div>
                <p className="p-5 text-base font-semibold leading-snug tracking-tight text-navy-900">{a}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </InView>
    </LightSection>
  );
}

export function ElecBimSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "What This Service Covers")[1];
  return (
    <DarkSection id="bim">
      <Head dark eyebrow="BIM" heading="Electrical Coordination Inside the Wider Building Model">
        <p>{text}</p>
        <p>{faq(service, "Can electrical drawings be coordinated")}</p>
        <p className="text-sm"><Link href="/services/bim/bim-services" className="font-semibold text-white underline-offset-4 hover:text-copper-400 hover:underline">BIM modelling & coordination →</Link></p>
      </Head>
      <InView threshold={0.25} className="mt-12"><ElecBimLayers /></InView>
    </DarkSection>
  );
}

export function ElecRevisionSection({ service }: { service: Service }) {
  const step = service.process[4]?.description ?? "";
  return (
    <DarkSection id="revisions" tone="900">
      <Head dark eyebrow="Revision control" heading="Always Know Which Electrical Drawing Is Current">
        <p>{step}</p>
      </Head>
      <InView threshold={0.15} className="mt-12"><ElecRevision /></InView>
    </DarkSection>
  );
}

export function ElecViewerSection() {
  return (
    <DarkSection id="viewer">
      <Reveal><SectionHeading tone="dark" eyebrow="Drawing viewer" heading="One Document Set, One Place to Look" description="Switch between the documents of the same illustrative electrical system." /></Reveal>
      <InView threshold={0.15} className="mt-12"><ElecViewer /></InView>
    </DarkSection>
  );
}

export function ElecSoftware({ service }: { service: Service }) {
  const tiles = [
    { slug: "autocad", name: "AutoCAD", note: "2D electrical drawing environment", art: <AutoCadTile /> },
    { slug: "revit", name: "Revit", note: "BIM electrical coordination environment", art: <RevitTile /> },
  ].filter((t) => service.software.includes(t.slug));
  return (
    <LightSection id="software">
      <Reveal><SectionHeading eyebrow="Software" heading="Electrical Drafting Software" /></Reveal>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {tiles.map((t, i) => (
          <li key={t.slug}>
            <Reveal delay={i * 80} className="h-full">
              <Link href={`/software/${t.slug}`} className="group flex h-full flex-col border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40">
                <div className="relative aspect-[8/5] overflow-hidden bg-ink-950 p-3">
                  <TechnicalGrid id={`es-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                  <div className="relative h-full w-full">{t.art}</div>
                </div>
                <div className="p-5"><h3 className="text-base font-semibold text-navy-900">{t.name}</h3><p className="mt-1 text-xs uppercase tracking-[0.1em] text-neutral-500">{t.note}</p></div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </LightSection>
  );
}

const indArt: Record<string, { art: ElecArtName; line: string }> = {
  construction: { art: "commercial", line: "Building electrical distribution" },
  manufacturing: { art: "control", line: "Industrial control panels" },
  mining: { art: "mining", line: "Industrial electrical systems" },
  energy: { art: "energy", line: "Power distribution infrastructure" },
};

export function ElecIndustries({ service }: { service: Service }) {
  return (
    <LightSection id="industries" tint>
      <Reveal><SectionHeading eyebrow="Industries" heading="Electrical Documentation Across Industries" /></Reveal>
      <InView as="ul" className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {service.industries.map((slug, i) => {
          const m = indArt[slug];
          if (!m) return null;
          return (
            <li key={slug}>
              <Reveal delay={i * 80} className="h-full">
                <Link href={`/industries/${slug}`} className="group flex h-full flex-col border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40">
                  <div className="relative aspect-[8/5] overflow-hidden bg-ink-950 text-sky-300">
                    <TechnicalGrid id={`ei-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                    <div className="art-zoom relative h-full w-full p-3"><ElecArt name={m.art} /></div>
                  </div>
                  <div className="p-4 sm:p-5"><h3 className="text-base font-semibold capitalize tracking-tight text-navy-900">{slug}</h3><p className="mt-0.5 text-xs text-neutral-500">{m.line}</p></div>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </InView>
    </LightSection>
  );
}

const projArt: Record<string, ElecArtName> = {
  "switchboard-and-control-panel-drawings": "switchboard",
  "as-built-electrical-documentation": "asbuilt",
};

export function ElecProjects() {
  const items = projects.filter((p) => p.discipline === "electrical");
  if (items.length === 0) return null;
  return (
    <DarkSection id="projects" tone="900">
      <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading tone="dark" eyebrow="Portfolio" heading="Related Electrical Projects" description="Illustrative examples, marked as such. They will give way to verified case studies as client work is cleared for publication." />
        <Link href="/projects/electrical" className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-copper-400 hover:underline">All electrical projects →</Link>
      </Reveal>
      <InView as="ul" className="mt-12 grid gap-5 md:grid-cols-2">
        {items.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 90} className="h-full">
              <Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col overflow-hidden border border-steel-300/20 bg-ink-950 transition-colors duration-300 hover:border-sky-300/50">
                <div className="relative aspect-[16/9] overflow-hidden text-sky-300">
                  <TechnicalGrid id={`ep-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                  <div className="art-zoom relative h-full w-full p-5"><ElecArt name={projArt[p.slug] ?? "switchboard"} /></div>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/90 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-200">Electrical · {p.industry}</p></div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">{p.discipline}</span>
                    {p.isPlaceholder ? <span className="border border-steel-300/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-neutral-400">Illustrative example</span> : null}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-white">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-400">{p.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors group-hover:text-copper-400">View project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </InView>
    </DarkSection>
  );
}

type Node = { label: string; href?: string; you?: boolean };
function Chain({ nodes }: { nodes: Node[] }) {
  return (
    <ol className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
      {nodes.map((c, i) => (
        <li key={c.label} className="reveal flex flex-1 items-center gap-3" style={{ "--d": `${i * 150}ms` } as React.CSSProperties}>
          {c.href ? (
            <Link href={c.href} className="group flex flex-1 items-center justify-between gap-2 border border-neutral-200 bg-white px-4 py-4 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-900/40">{c.label}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></Link>
          ) : (
            <span className={`flex-1 border px-4 py-4 text-sm font-semibold ${c.you ? "border-navy-900 bg-navy-900 text-white" : "border-neutral-200 bg-neutral-50 text-neutral-600"}`}>{c.label}{c.you ? <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">You are here</span> : null}</span>
          )}
          {i < nodes.length - 1 ? <span aria-hidden className="hidden font-mono text-copper-500 lg:block">→</span> : null}
        </li>
      ))}
    </ol>
  );
}

export function ElecRelated() {
  return (
    <LightSection id="related">
      <Reveal><SectionHeading eyebrow="Related" heading="Related Engineering Documentation Services" /></Reveal>
      <InView className="mt-12 space-y-4">
        <Chain nodes={[{ label: "Engineering design", href: "/services/engineering-design/engineering-design" }, { label: "Electrical drafting", you: true }, { label: "BIM coordination", href: "/services/bim/bim-services" }]} />
        <Chain nodes={[{ label: "Legacy document" }, { label: "CAD conversion", href: "/services/cad-conversion/cad-conversion" }, { label: "Editable electrical documentation" }]} />
      </InView>
    </LightSection>
  );
}

export function ElecCTA() {
  return (
    <InView as="section" threshold={0.25} className="relative overflow-hidden border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <TechnicalGrid id="elec-cta-grid" className="text-sky-300/[0.07]" minor={28} major={140} />
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Get a Quote for Electrical Drafting</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">Tell us what you need and our team can review the project requirements.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button>
            <Button href="/services/electrical" size="lg" variant="outline-light">Explore Electrical Services</Button>
          </div>
        </div>
        <div aria-hidden className="border border-steel-300/20 bg-ink-900/50 p-2"><ElecPackage className="h-auto w-full" /></div>
      </Container>
    </InView>
  );
}
