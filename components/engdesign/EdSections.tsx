import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { overviewParagraphs } from "@/components/mechanical/content";
import { projects } from "@/data/projects";
import { getIndustryBySlug } from "@/data/industries";
import { Paper, Char, Head, faqOf, sentences } from "@/components/arch/ui";
import { DrawingSvg } from "@/components/pdfcad/PdfModel";
import { ConceptSvg, EdIcon, CONCEPTS, type ConceptId } from "./EdModel";
import { HeroEd, Workspace, TradeOff, Dfm, Rationale, ValueEng, Detailed, DraftFlow, DocHandover, ProcessEd, ScrollStory, CtaEd } from "./EdClient";

const lk = (c: string) => "font-semibold underline-offset-4 hover:underline " + c;
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const H = (s: Service, p: string, n = 0) => overviewParagraphs(s, p)[n] ?? "";

export function EdHero({ heading, description }: { heading: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-[#0B1220]">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.06]"><defs><pattern id="eh-g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#eh-g)" /></svg>
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Engineering Design</p>
            <h1 style={delay(100)} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">{heading}</h1>
            <p style={delay(220)} className="reveal mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{description}</p>
            <div style={delay(340)} className="reveal mt-9 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#process" size="lg" variant="outline-light" arrow>Explore Our Design Process</Button></div>
            <p style={delay(460)} className="reveal mt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">CAD represents a design · engineering design develops it</p>
          </div>
          <div style={delay(300)} className="reveal min-w-0"><HeroEd /></div>
        </Container>
      </InView>
    </section>
  );
}

export function ProblemSection({ service }: { service: Service }) {
  const s = sentences(service.problemStatement);
  const starts = ["An idea", "A customer requirement", "An existing concept", "A performance requirement", "A manufacturing challenge", "Limited internal design capacity"];
  return (
    <Paper id="problem">
      <Head eyebrow="The starting point" heading="Not Every Project Starts With a Finished Design">
        <p>{s[0]} {s[1] ?? ""}</p>
        <p className="text-sm">{s.slice(2).join(" ")}</p>
        <p className="text-sm">{H(service, "What This Service Covers", 0)}</p>
      </Head>
      <InView threshold={0.1} className="mt-12 grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr]">
        <ul className="grid grid-cols-2 gap-2">{starts.map((x, i) => <li key={x} className="reveal border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800" style={delay(i * 80)}>{x}</li>)}</ul>
        <div aria-hidden className="grid place-items-center font-mono text-2xl text-copper-500 max-lg:rotate-90">→</div>
        <div className="reveal border border-slate-900 bg-slate-900 p-6 text-white" style={delay(300)}><p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Design brief</p><p className="mt-1 text-lg font-semibold">The problem, written down as requirements and trade-offs</p><p className="mt-2 text-sm text-slate-300">Design capacity isn&apos;t needed at a constant level, so outside support adds capacity when a project demands it.</p></div>
      </InView>
    </Paper>
  );
}

export function WorkspaceSection() {
  return (
    <Char id="workspace">
      <Head dark eyebrow="Design workspace" heading="Watch One Design Evolve"><p>Move through the stages — brief, concepts, detailed design, DFM and documentation — and the same product develops in front of you.</p></Head>
      <InView threshold={0.08} className="mt-12 [&_.text-slate-700]:text-slate-700"><Workspace /></InView>
    </Char>
  );
}

export function ConceptsSection({ service }: { service: Service }) {
  const opts: [ConceptId, string][] = [["A", "Different geometry — a fabricated frame of plates and tube."], ["B", "Different architecture — a single machined block."], ["C", "Different manufacturing approach — modular sheet-metal assemblies."]];
  return (
    <Paper id="concepts" tint>
      <Head eyebrow="Concept development" heading="Good Concept Development Should Actually Explore Alternatives">
        <p>{H(service, "Genuinely Divergent", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "How do you present concept options")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12">
        <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {opts.map(([c, d], i) => (
            <li key={c} className="reveal w-[82%] shrink-0 snap-center border border-slate-300 bg-white md:w-auto" style={delay(i * 100)}>
              <div className="bg-[#0B1220]"><ConceptSvg c={c} title={`${CONCEPTS[c].name}: ${CONCEPTS[c].arch}`} className="block h-auto w-full" /></div>
              <div className="p-5"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue-700">{CONCEPTS[c].name}</p><h3 className="mt-1 text-base font-semibold text-slate-900">{CONCEPTS[c].arch}</h3><p className="mt-1 text-sm text-slate-600">{d}</p></div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-slate-500">Different concepts create different trade-offs. None is declared universally better.</p>
      </InView>
    </Paper>
  );
}

export function TradeOffSection() {
  return (
    <Paper id="tradeoffs">
      <Head eyebrow="Trade-offs" heading="Engineering Decisions Have Trade-Offs"><p>Cost, manufacturability, lead time and performance pull in different directions. Select a concept to see its geometry and what it trades.</p></Head>
      <InView threshold={0.1} className="mt-12"><TradeOff /></InView>
    </Paper>
  );
}

export function DfmSection({ service }: { service: Service }) {
  return (
    <Char id="dfm">
      <Head dark eyebrow="Design for manufacturing" heading="Designed to Be Manufactured, Not Just Modelled">
        <p>{H(service, "Genuinely Divergent", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you review an existing design for manufacturability")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><Dfm /></InView>
    </Char>
  );
}

export function RationaleSection({ service }: { service: Service }) {
  return (
    <Paper id="rationale" tint>
      <Head eyebrow="Design rationale" heading="A Design Is More Than the Final Geometry">
        <p>{H(service, "Documentation and Design Rationale", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Do you document why a design decision")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Rationale /></InView>
    </Paper>
  );
}

export function ValueSection({ service }: { service: Service }) {
  return (
    <Char id="value">
      <Head dark eyebrow="Value engineering" heading="Value Engineering Without Losing What Matters">
        <p>{H(service, "Value Engineering", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "How do you approach value engineering")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><ValueEng /></InView>
    </Char>
  );
}

export function DetailedSection() {
  return (
    <Char id="detailed">
      <Head dark eyebrow="Detailed design" heading="From Selected Concept to Detailed Design"><p>Components, assembly relationships, features, interfaces, material callouts and manufacturing considerations are developed together. Switch between isometric, wireframe, exploded and section views of the illustrative model.</p></Head>
      <InView threshold={0.08} className="mt-12"><Detailed /></InView>
    </Char>
  );
}

export function DraftingSection({ service }: { service: Service }) {
  return (
    <Paper id="drafting">
      <Head eyebrow="Design to documentation" heading="Design Shouldn't Stop at the Model">
        <p>{H(service, "What This Service Covers", 2)}</p>
        <p className="text-sm">Continue into <Link href="/services/mechanical/mechanical-drafting" className={lk("text-navy-900")}>mechanical drafting</Link>, <Link href="/services/mechanical/3d-cad-modelling" className={lk("text-navy-900")}>3D CAD modelling</Link> or <Link href="/services/structural/structural-drafting" className={lk("text-navy-900")}>structural drafting</Link>.</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><DraftFlow /></InView>
    </Paper>
  );
}

export function HandoverSection({ service }: { service: Service }) {
  return (
    <Paper id="handover" tint>
      <Head eyebrow="Documentation handover" heading="Documentation Is Part of the Design Deliverable">
        <p>{H(service, "Documentation and Design Rationale", 0)}</p>
        <div className="border border-slate-300 bg-white p-4 text-sm text-slate-700"><strong className="text-slate-900">Scope is agreed, not assumed.</strong> {faqOf(service.faqs, "Do you provide engineering calculations")}</div>
      </Head>
      <InView threshold={0.08} className="mt-12"><DocHandover /></InView>
    </Paper>
  );
}

const DEL = [["Concept design options", "Alternative concepts and their development."], ["Detailed design & 3D models", "The selected concept, developed and modelled."], ["DFM review", "Design-for-manufacturing input."], ["Engineering documentation", "Documentation and specifications."], ["Design optimisation", "Design improvement and value-engineering input."], ["Manufacturing support documentation", "Documentation to support production handover."], ["Trade-off analysis", "Comparison across competing concepts."]];
export function DeliverablesSection() {
  return (
    <Paper id="deliverables">
      <Reveal><SectionHeading eyebrow="Deliverables" heading="What You Get" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DEL.map(([t, d], i) => <li key={t} className="reveal" style={delay((i % 4) * 70)}><div className="group h-full border border-slate-300 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><EdIcon k={i} className="h-11 w-11 text-blue-600 transition-transform duration-500 group-hover:scale-110" /><h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">{t}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p></div></li>)}
      </InView>
    </Paper>
  );
}

const APPS = ["From early concept to detailed design.", "Engineering development of equipment and machinery.", "Review and development of an existing design.", "Identify issues before production.", "Prepare documentation for downstream teams.", "Evaluate design changes with manufacturing in mind."];
export function ApplicationsSection({ service }: { service: Service }) {
  return (
    <Paper id="applications" tint>
      <Reveal><SectionHeading eyebrow="Applications" heading="Where Engineering Design Support Fits" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {service.applications.map((a, i) => <li key={a} className="reveal" style={delay((i % 3) * 80)}><div className="group flex h-full gap-4 border border-slate-300 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><EdIcon k={[1, 8, 2, 4, 3, 5][i % 6]} className="h-10 w-10 shrink-0 text-blue-600" /><div><h3 className="text-base font-semibold leading-snug tracking-tight text-slate-900">{a}</h3><p className="mt-1 text-sm text-slate-600">{APPS[i]}</p></div></div></li>)}
      </InView>
    </Paper>
  );
}

export function ProcessSection({ service }: { service: Service }) {
  return (
    <Paper id="process">
      <Reveal><SectionHeading eyebrow="Process" heading="How Engineering Design Moves From Brief to Handover" /></Reveal>
      <InView threshold={0.08} className="mt-12"><ProcessEd steps={service.process} /></InView>
    </Paper>
  );
}

export function StorySection() {
  return (
    <section id="story" className="relative border-t border-slate-800 bg-[#0B1220]">
      <Container><ScrollStory /></Container>
    </section>
  );
}

export function SoftwareSection({ service }: { service: Service }) {
  const tiles = [
    { slug: "solidworks", name: "SolidWorks", note: "Parametric 3D modelling", art: <ConceptSvg c="A" title="SolidWorks-style model" className="block h-auto w-full" /> },
    { slug: "inventor", name: "Inventor", note: "Mechanical design", art: <ConceptSvg c="B" title="Inventor-style model" className="block h-auto w-full" /> },
    { slug: "fusion-360", name: "Fusion 360", note: "Design and manufacturing workflows", art: <ConceptSvg c="C" title="Fusion 360-style model" className="block h-auto w-full" /> },
    { slug: "autocad", name: "AutoCAD", note: "2D documentation", art: <DrawingSvg disc="mech" mode="cad" titleBlock={false} title="AutoCAD-style drawing" className="block h-auto w-full" /> },
  ].filter((t) => service.software.includes(t.slug));
  return (
    <Char id="software">
      <Reveal><SectionHeading tone="dark" eyebrow="Software" heading="Software We Use" /></Reveal>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{tiles.map((t, i) => <li key={t.slug}><Reveal delay={i * 80} className="h-full"><Link href={`/software/${t.slug}`} className="group flex h-full flex-col border border-slate-700 bg-slate-900/40 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/60"><div className="overflow-hidden"><div className="art-zoom">{t.art}</div></div><div className="p-4"><h3 className="text-base font-semibold text-white">{t.name}</h3><p className="mt-1 text-xs uppercase tracking-[0.1em] text-slate-400">{t.note}</p></div></Link></Reveal></li>)}</ul>
    </Char>
  );
}

const IND: Record<string, [string, React.ReactNode]> = {
  manufacturing: ["Machine and component geometry", <g key="m" stroke="#7DD3FC" strokeWidth="1.5" fill="none"><circle cx="90" cy="80" r="34" /><circle cx="90" cy="80" r="12" /><rect x="140" y="50" width="70" height="60" /><path d="M20 120h200" /></g>],
  mining: ["Industrial equipment", <g key="n" stroke="#7DD3FC" strokeWidth="1.5" fill="none"><path d="M30 120l40 -70 30 30 30 -50 50 90M20 120h200M160 60V30h30v30" /></g>],
  defence: ["Technical equipment concept", <g key="d" stroke="#7DD3FC" strokeWidth="1.5" fill="none"><path d="M40 100h140l20 -20h20M60 100V70h60l20 30" /><circle cx="80" cy="112" r="10" /><circle cx="150" cy="112" r="10" /></g>],
  aerospace: ["Lightweight component geometry", <g key="a" stroke="#7DD3FC" strokeWidth="1.5" fill="none"><path d="M30 100L120 40l90 60-90 -14z" /><path d="M120 40v46" /></g>],
  automotive: ["Vehicle component", <g key="v" stroke="#7DD3FC" strokeWidth="1.5" fill="none"><circle cx="90" cy="90" r="30" /><circle cx="90" cy="90" r="10" /><path d="M120 90h80M150 70v40" /></g>],
  energy: ["Industrial equipment and systems", <g key="e" stroke="#7DD3FC" strokeWidth="1.5" fill="none"><circle cx="120" cy="66" r="24" /><path d="M120 90v30M50 100h140M50 100v20M190 100v20M20 120h200" /></g>],
};
export function IndustriesSection({ service }: { service: Service }) {
  return (
    <Paper id="industries">
      <Reveal><SectionHeading eyebrow="Industries" heading="Industries We Support" /></Reveal>
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">{service.industries.map((slug, i) => { const m = IND[slug]; return (
        <li key={slug}><Reveal delay={i * 70} className="h-full"><Link href={`/industries/${slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><div className="aspect-[8/5] overflow-hidden bg-[#0B1220]"><svg viewBox="0 0 240 150" className="art-zoom h-full w-full p-3" role="img" aria-label={`${getIndustryBySlug(slug)?.name ?? slug}: ${m?.[0]}`}><title>{getIndustryBySlug(slug)?.name ?? slug}</title>{m?.[1]}</svg></div><div className="p-4 sm:p-5"><h3 className="text-base font-semibold tracking-tight text-slate-900">{getIndustryBySlug(slug)?.name ?? slug}</h3><p className="mt-0.5 text-xs text-slate-500">{m?.[0]}</p></div></Link></Reveal></li>
      ); })}</ul>
    </Paper>
  );
}

const PSLUGS = [["sheet-metal-enclosure-fabrication-drawings", "mech"], ["legacy-machine-part-reverse-engineering", "mech"], ["warehouse-structural-steel-shop-drawings", "struct"]] as const;
export function ProjectsSection() {
  const items = PSLUGS.map(([s, d]) => ({ p: projects.find((p) => p.slug === s), d })).filter((x): x is { p: NonNullable<typeof x.p>; d: "mech" | "struct" } => Boolean(x.p));
  return (
    <Char id="projects">
      <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading tone="dark" eyebrow="Portfolio" heading="Related Projects" description="Illustrative examples, marked as such. They will give way to verified case studies as client work is cleared for publication." /><Link href="/projects" className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-copper-400 hover:underline">All projects →</Link></Reveal>
      <InView as="ul" className="mt-12 grid gap-5 md:grid-cols-3">{items.map(({ p, d }, i) => (
        <li key={p.slug}><Reveal delay={i * 90} className="h-full"><Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col overflow-hidden border border-slate-700 bg-slate-900/40 transition-colors duration-300 hover:border-sky-300/60">
          <div className="overflow-hidden"><div className="art-zoom">{i === 1 ? <ConceptSvg c="B" mode="wire" title={`${p.title}: illustrative model`} className="block h-auto w-full" /> : <DrawingSvg disc={d} mode="cad" titleBlock={false} title={`${p.title}: illustrative drawing`} className="block h-auto w-full" />}</div></div>
          <div className="flex flex-1 flex-col p-5"><div className="flex items-center gap-3"><span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">{p.discipline}</span>{p.isPlaceholder ? <span className="border border-slate-500 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-300">Illustrative example</span> : null}</div><h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-white">{p.title}</h3><p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-300">{p.summary}</p><span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors group-hover:text-copper-400">View project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span></div>
        </Link></Reveal></li>
      ))}</InView>
    </Char>
  );
}

export function RelatedSection() {
  const nodes = [
    { l: "Mechanical Drafting", d: "2D mechanical drafting and 3D CAD modelling.", href: "/services/mechanical/mechanical-drafting" },
    { l: "3D CAD Modelling", d: "Parametric 3D CAD modelling for parts, assemblies and product development.", href: "/services/mechanical/3d-cad-modelling" },
    { l: "Structural Drafting", d: "Structural drafting, steel detailing and shop drawings.", href: "/services/structural/structural-drafting" },
  ];
  return (
    <Paper id="related" tint>
      <Reveal><SectionHeading eyebrow="Related" heading="From Design to Detailed Documentation" description="Engineering design → 3D CAD → drafting / detailing → documentation — not a route every project takes." /></Reveal>
      <InView className="mt-12"><ol className="grid gap-3 lg:grid-cols-3">{nodes.map((n, i) => <li key={n.l} className="reveal" style={delay(i * 120)}><Link href={n.href} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><span className="flex items-center justify-between text-base font-semibold text-slate-900">{n.l}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span><span className="mt-1 text-sm text-slate-600">{n.d}</span></Link></li>)}</ol></InView>
    </Paper>
  );
}

export function EdCTA() {
  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-[#0B1220] py-20 sm:py-28">
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Have a Design Problem to Solve?</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">Tell us what you need and our team can review the project requirements.</p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">Problem → concepts → detailed design → documentation</p>
          <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button><Button href="/contact" size="lg" variant="outline-light">Discuss Your Design</Button></div>
        </div>
        <CtaEd />
      </Container>
    </section>
  );
}

export { type ConceptId };
