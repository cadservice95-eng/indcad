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
import { DrawingSvg, PdfIcon, layerColor, layersOf, mono } from "./PdfModel";
import { HeroWorkspace, RasterCompare, EditableEntities, DimConsistency, TextAmbiguity, Standards, BatchCheck, DisciplineSelector, ProcessViewer, QualitySlider, CtaVisual, Win } from "./PdfClient";

const lk = (c: string) => "font-semibold underline-offset-4 hover:underline " + c;
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const H = (s: Service, p: string, n = 0) => overviewParagraphs(s, p)[n] ?? "";

export function PdfHero({ heading, description }: { heading: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-[#0B1220]">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.06]"><defs><pattern id="pg-g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#pg-g)" /></svg>
      <InView immediate>
        <Container className="relative pb-16 pt-12 lg:pb-20 lg:pt-16">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12">
            <div>
              <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-sky-300">CAD Conversion</p>
              <h1 style={delay(100)} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.2rem]">{heading}</h1>
              <p style={delay(220)} className="reveal mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">{description}</p>
            </div>
            <div style={delay(320)} className="reveal flex flex-wrap gap-4 lg:justify-end"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#workflow" size="lg" variant="outline-light" arrow>See How Conversion Works</Button></div>
          </div>
          <div style={delay(420)} className="reveal mt-10"><HeroWorkspace /></div>
          <p style={delay(520)} className="reveal mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">A PDF is a reference document · native CAD makes it usable again</p>
        </Container>
      </InView>
    </section>
  );
}

export function ProblemSection({ service }: { service: Service }) {
  const s = sentences(service.problemStatement);
  const pdf = ["Fixed document", "Reference only", "Difficult to edit", "Raster or vector source", "Drawing information locked into the document format"];
  const cad = ["Editable geometry", "Editable text", "Editable dimensions", "Structured layers", "Reusable drawing data", "Design-ready workflow"];
  return (
    <Paper id="problem">
      <Head eyebrow="The problem" heading="A PDF Can Show the Drawing. CAD Lets You Work With It.">
        <p>{s[0]} {s[1] ?? ""}</p>
        <p className="text-sm">{s.slice(2).join(" ")}</p>
        <ul className="flex flex-wrap gap-1.5 text-xs">{["Edit geometry", "Redline drawings", "Revise dimensions", "Change layouts", "Reuse geometry", "Prepare design changes", "Update documentation", "Maintain drawing standards"].map((x) => <li key={x} className="border border-slate-300 bg-white px-2.5 py-1.5 text-slate-700">{x}</li>)}</ul>
      </Head>
      <InView threshold={0.1} className="mt-12 grid gap-5 lg:grid-cols-2">
        {[{ t: "PDF", mode: "pdf" as const, pts: pdf, tone: "border-amber-400" }, { t: "Native CAD", mode: "cad" as const, pts: cad, tone: "border-green-600" }].map((c, i) => (
          <div key={c.t} className={`reveal border bg-white ${c.tone}`} style={delay(i * 120)}>
            <DrawingSvg mode={c.mode} title={`${c.t} version of the drawing`} className="block h-auto w-full" />
            <div className="p-5"><h3 className="text-base font-semibold text-slate-900">{c.t}</h3><ul className="mt-2 grid gap-1.5 text-sm text-slate-700 sm:grid-cols-2">{c.pts.map((p) => <li key={p} className="flex gap-2"><span aria-hidden className={"mt-2 h-1.5 w-1.5 shrink-0 " + (i ? "bg-green-600" : "bg-amber-500")} />{p}</li>)}</ul></div>
          </div>
        ))}
      </InView>
      <p className="mt-4 text-sm text-slate-500">This doesn&apos;t mean a PDF can never be edited in any tool — only that it isn&apos;t the same as a clean native CAD source file.</p>
    </Paper>
  );
}

export function TraceSection({ service }: { service: Service }) {
  return (
    <Paper id="trace" tint>
      <Head eyebrow="Signature view" heading="Raster Trace vs Native CAD Reconstruction">
        <p>{H(service, "What This Service Covers", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Will the converted file be fully editable")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><RasterCompare /></InView>
    </Paper>
  );
}

export function EntitiesSection() {
  return (
    <Paper id="entities">
      <Head eyebrow="Editable, specifically" heading="What Makes the Converted DWG Actually Editable?"><p>Not just a word on a page: lines, polylines, arcs, circles, hatches, text, dimensions, blocks and layers — real CAD entities. Select any element to see what it is.</p></Head>
      <InView threshold={0.08} className="mt-12"><EditableEntities /></InView>
    </Paper>
  );
}

export function SourceSection({ service }: { service: Service }) {
  const cols = [
    { t: "Vector PDF", flow: ["CAD", "PDF", "Recoverable line and text data", "CAD reconstruction"], mode: "pdf" as const, state: "Generally easier to reconstruct", d: H(service, "Vector vs Scanned", 0), pts: ["Crisp geometry", "Selectable vectors", "Clean text", "Recoverable line structure"] },
    { t: "Scanned PDF", flow: ["Paper drawing", "Scanner", "Raster image", "CAD reconstruction"], mode: "scan" as const, state: "Requires additional interpretation", d: faqOf(service.faqs, "Can you convert scanned PDFs"), pts: ["Pixels", "Paper texture and scan noise", "Faded text", "Geometry and text rebuilt from an image"] },
  ];
  return (
    <Char id="source">
      <Head dark eyebrow="Source quality" heading="Not Every PDF Starts From the Same Place"><p>Where the file came from changes how much is recoverable and how much has to be reconstructed — which is why vector and scanned PDFs are quoted differently.</p></Head>
      <InView threshold={0.08} className="mt-12 grid gap-5 lg:grid-cols-2">
        {cols.map((c, i) => (
          <div key={c.t} className="reveal border border-slate-600 bg-slate-900/40" style={delay(i * 120)}>
            <div className="bg-white"><DrawingSvg mode={c.mode} titleBlock={false} title={`${c.t}: how the source looks`} className="block h-auto w-full" /></div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white">{c.t}</h3>
              <ol className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-slate-300">{c.flow.map((f, k) => <li key={f} className="flex items-center gap-1.5"><span className="border border-slate-600 px-2 py-1">{f}</span>{k < 3 ? <span aria-hidden className="text-amber-400">→</span> : null}</li>)}</ol>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{c.d}</p>
              <ul className="mt-3 grid gap-1 text-sm text-slate-300 sm:grid-cols-2">{c.pts.map((p) => <li key={p}>• {p}</li>)}</ul>
              <p className={"mt-4 inline-block border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] " + (i ? "border-amber-400 text-amber-300" : "border-green-500 text-green-400")}>{c.state}</p>
            </div>
          </div>
        ))}
      </InView>
    </Char>
  );
}

export function DimSection({ service }: { service: Service }) {
  return (
    <Paper id="dimensions">
      <Head eyebrow="Dimensions" heading="Geometry and Dimensions Should Agree">
        <p>{H(service, "Vector vs Scanned", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "What if a dimension in the PDF")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><DimConsistency /></InView>
    </Paper>
  );
}

export function TextSection({ service }: { service: Service }) {
  return (
    <Paper id="ambiguity" tint>
      <Head eyebrow="Unclear source" heading="When the Source Isn't Clear, We Don't Guess">
        <p>{H(service, "Matching Your Office", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "What happens if text on a scanned PDF")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><TextAmbiguity /></InView>
    </Paper>
  );
}

export function StandardsSection({ service }: { service: Service }) {
  return (
    <Paper id="standards">
      <Head eyebrow="Office standard" heading="Your CAD Standard Should Survive the Conversion">
        <p>{H(service, "Matching Your Office", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you match our layer standard")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Standards /></InView>
    </Paper>
  );
}

export function BatchSection({ service }: { service: Service }) {
  return (
    <Char id="batch">
      <Head dark eyebrow="Batch conversion" heading="A Set Should Be Consistent, Not Just Converted Sheet by Sheet">
        <p>{H(service, "Consistency Checks", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "How do you keep formatting consistent")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12 [&_.text-slate-900]:text-slate-900"><BatchCheck /></InView>
    </Char>
  );
}

export function DisciplineSection() {
  return (
    <Paper id="disciplines" tint>
      <Head eyebrow="Disciplines" heading="One Conversion Workflow Across Multiple Drawing Disciplines"><p>Architectural, structural, mechanical, civil and electrical drawings — as single drawings or larger sets. This illustrates scope; not every project includes every discipline. See also <Link href="/services/mechanical/mechanical-drafting" className={lk("text-navy-900")}>mechanical drafting</Link> for work that continues after conversion.</p></Head>
      <InView threshold={0.08} className="mt-12"><DisciplineSelector /></InView>
    </Paper>
  );
}

const DEL = [
  { t: "Editable DWG files", d: "PDF source converted into native editable CAD data.", k: 0 }, { t: "Layered CAD output", d: "Drawing structure organised to the agreed standard where supplied.", k: 1 },
  { t: "Native text & dimensions", d: "Reproduced as CAD entities rather than as part of an image.", k: 2 }, { t: "Batch conversion", d: "Suitable for larger drawing sets.", k: 3 }, { t: "Dimension consistency checks", d: "Dimensions checked against visible drawing geometry during conversion.", k: 4 },
];
export function DeliverablesSection() {
  return (
    <Paper id="deliverables">
      <Reveal><SectionHeading eyebrow="Deliverables" heading="What You Receive" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {DEL.map((d, i) => <li key={d.t} className="reveal" style={delay(i * 70)}><div className="group h-full border border-slate-300 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><PdfIcon k={d.k} className="h-11 w-11 text-blue-600 transition-transform duration-500 group-hover:scale-110" /><h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">{d.t}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{d.d}</p></div></li>)}
      </InView>
    </Paper>
  );
}

const APPS = [["Legacy drawing sets", "When original CAD source files no longer exist."], ["Tender & as-built documentation", "Existing drawing documentation that needs to become usable CAD data."], ["Design changes", "Existing drawings prepared for modifications and future design work."], ["Drawing register digitisation", "Archived drawing collections turned into structured CAD documentation."], ["Multi-discipline drawing sets", "Architectural, structural, mechanical, civil and electrical documents."]];
export function ApplicationsSection({ service }: { service: Service }) {
  return (
    <Paper id="applications" tint>
      <Reveal><SectionHeading eyebrow="Applications" heading="Where PDF to CAD Conversion Is Used" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {service.applications.map((a, i) => <li key={a} className={"reveal " + (i % 2 ? "lg:translate-y-4" : "")} style={delay(i * 80)}><div className="flex h-full gap-4 border border-slate-300 bg-white p-5"><div className="grid h-14 w-14 shrink-0 place-items-center border border-slate-200 bg-[#0B1220]"><DrawingSvg disc={(["arch", "struct", "mech", "civil", "elec"] as const)[i % 5]} mode="cad" titleBlock={false} title="" className="h-10 w-10" /></div><div><h3 className="text-base font-semibold leading-snug tracking-tight text-slate-900">{APPS[i]?.[0] ?? a}</h3><p className="mt-1 text-sm text-slate-600">{APPS[i]?.[1]}</p></div></div></li>)}
      </InView>
    </Paper>
  );
}

export function WorkflowSection({ service }: { service: Service }) {
  return (
    <Paper id="workflow">
      <Reveal><SectionHeading eyebrow="Workflow" heading="From PDF Reference to Working CAD" /></Reveal>
      <InView threshold={0.08} className="mt-12"><ProcessViewer steps={service.process} /></InView>
    </Paper>
  );
}

export function QualitySection() {
  return (
    <Char id="quality">
      <Head dark eyebrow="Quality check" heading="Checked Against the Supplied Source Before Delivery"><p>Drag between the source PDF and the converted DWG, and highlight what is checked: geometry, dimensions, text and layers. No universal accuracy figure is claimed.</p></Head>
      <InView threshold={0.08} className="mx-auto mt-12 max-w-4xl"><QualitySlider /></InView>
    </Char>
  );
}

export function SoftwareSection({ service }: { service: Service }) {
  if (!service.software.includes("autocad")) return null;
  return (
    <Paper id="software" tint>
      <Reveal><SectionHeading eyebrow="Software" heading="Software" /></Reveal>
      <Reveal className="mt-12">
        <Link href="/software/autocad" className="group block border border-slate-300 bg-white transition-colors hover:border-slate-900">
          <div className="grid lg:grid-cols-[170px_1fr_170px]">
            <div className="hidden border-r border-slate-200 bg-slate-50 p-3 lg:block"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Layer manager</p><ul className="mt-2 space-y-1">{layersOf("arch").map((l) => <li key={l} className="flex items-center gap-2 font-mono text-[10px] text-slate-700"><span className="h-2.5 w-2.5" style={{ background: layerColor(l) }} />{l}</li>)}</ul></div>
            <div className="bg-[#0B1220]"><DrawingSvg mode="cad" title="CAD canvas with layers and dimensions (not a real AutoCAD screenshot)" className="block h-auto w-full" /></div>
            <div className="hidden border-l border-slate-200 bg-slate-50 p-3 lg:block"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Properties</p><dl className="mt-2 space-y-1.5 font-mono text-[10px] text-slate-700">{[["Entity", "DIMENSION"], ["Layer", "A-DIMS"], ["File", "DWG"]].map(([k, v]) => <div key={k}><dt className="text-slate-400">{k}</dt><dd>{v}</dd></div>)}</dl></div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 p-5"><div><h3 className="text-base font-semibold text-slate-900">AutoCAD</h3><p className="text-xs uppercase tracking-[0.1em] text-slate-500">DWG output · layers · dimensions</p></div><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></div>
        </Link>
      </Reveal>
    </Paper>
  );
}

export function IndustriesSection({ service }: { service: Service }) {
  const art: Record<string, { d: "arch" | "mech" | "civil"; n: string }> = { construction: { d: "arch", n: "Architectural and construction documentation" }, manufacturing: { d: "mech", n: "Mechanical and production drawings" }, mining: { d: "civil", n: "Engineering and industrial documentation" } };
  return (
    <Paper id="industries">
      <Reveal><SectionHeading eyebrow="Industries" heading="Industries We Support" /></Reveal>
      <ul className="mt-12 grid gap-4 sm:grid-cols-3">{service.industries.map((slug, i) => { const a = art[slug]; return (
        <li key={slug}><Reveal delay={i * 80} className="h-full"><Link href={`/industries/${slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><div className="aspect-[16/10] overflow-hidden bg-[#0B1220]"><div className="art-zoom h-full w-full"><DrawingSvg disc={a?.d ?? "arch"} mode="cad" titleBlock={false} title={`${getIndustryBySlug(slug)?.name ?? slug} drawing`} className="block h-full w-full object-cover" /></div></div><div className="p-5"><h3 className="text-base font-semibold tracking-tight text-slate-900">{getIndustryBySlug(slug)?.name ?? slug}</h3><p className="mt-0.5 text-sm text-slate-600">{a?.n}</p></div></Link></Reveal></li>
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
          <div className="overflow-hidden"><div className="art-zoom"><DrawingSvg disc={d} mode="cad" titleBlock={false} title={`${p.title}: illustrative drawing`} className="block h-auto w-full" /></div></div>
          <div className="flex flex-1 flex-col p-5"><div className="flex items-center gap-3"><span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">{p.discipline}</span>{p.isPlaceholder ? <span className="border border-slate-500 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-300">Illustrative example</span> : null}</div><h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-white">{p.title}</h3><p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-300">{p.summary}</p><span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors group-hover:text-copper-400">View project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span></div>
        </Link></Reveal></li>
      ))}</InView>
    </Char>
  );
}

export function RelatedSection() {
  const nodes = [
    { l: "CAD Conversion", d: "PDF, scanned and legacy drawing conversion into editable native CAD files.", href: "/services/cad-conversion/cad-conversion" },
    { l: "Scan to BIM", d: "Point cloud and laser scan conversion into working Revit BIM models.", href: "/services/bim/scan-to-bim" },
    { l: "Mechanical Drafting", d: "2D mechanical drafting and 3D CAD modelling.", href: "/services/mechanical/mechanical-drafting" },
  ];
  return (
    <Paper id="related" tint>
      <Reveal><SectionHeading eyebrow="Related" heading="Where Converted CAD Goes Next" description="PDF → CAD → BIM → engineering documentation — not a sequence every project follows." /></Reveal>
      <InView className="mt-12"><ol className="grid gap-3 lg:grid-cols-3">{nodes.map((n, i) => <li key={n.l} className="reveal" style={delay(i * 120)}><Link href={n.href} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><span className="flex items-center justify-between text-base font-semibold text-slate-900">{n.l}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span><span className="mt-1 text-sm text-slate-600">{n.d}</span></Link></li>)}</ol></InView>
    </Paper>
  );
}

export function PdfCTA() {
  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-[#0B1220] py-20 sm:py-28">
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Get Your PDF Drawings Back Into CAD</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">Tell us what you need and our team can review the project requirements.</p>
          <div className="mt-9 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button><Button href="/contact" size="lg" variant="outline-light">Discuss Your Drawing Set</Button></div>
        </div>
        <CtaVisual />
      </Container>
    </section>
  );
}

export { mono, Win };
