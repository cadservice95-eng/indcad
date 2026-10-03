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
import { ConvScene, TraceDemo, MiniSheet, ConvIcon, Q, mono } from "./ConvModel";
import { HeroConv, SignatureFlow, TraceCompare, EntityExplorer, DimEdit, LayerPanel, ArchiveFlow, ArchiveStandard, Conflict, Correction, Batch, Conv3DSection, QualityCheck, BeforeAfter, ConvProcess, CtaConv } from "./ConvClient";

const lk = (c: string) => "font-semibold underline-offset-4 hover:underline " + c;
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const H = (s: Service, p: string, n = 0) => overviewParagraphs(s, p)[n] ?? "";

export function ConvHero({ heading, description }: { heading: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-[#0B1220]">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.06]"><defs><pattern id="ch-g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#ch-g)" /></svg>
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-sky-300">CAD Conversion</p>
            <h1 style={delay(100)} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">{heading}</h1>
            <p style={delay(220)} className="reveal mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{description}</p>
            <div style={delay(340)} className="reveal mt-9 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#workflow" size="lg" variant="outline-light" arrow>See How Conversion Works</Button></div>
            <p style={delay(460)} className="reveal mt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">Scan <span className="text-amber-400">→</span> vector CAD · rebuilt, not traced</p>
          </div>
          <div style={delay(300)} className="reveal min-w-0"><HeroConv /></div>
        </Container>
      </InView>
    </section>
  );
}

export function IntroSection({ service }: { service: Service }) {
  const s = sentences(service.problemStatement);
  const cols = [
    { t: "Original scan", k: "Looks like a drawing.", art: <ConvScene stage={0} legend={false} title="A scanned drawing" className="block h-auto w-full" /> },
    { t: "Raster trace", k: "Still behaves like a picture.", art: <TraceDemo mode="trace" sel="frag" className="block h-auto w-full" /> },
    { t: "Proper CAD reconstruction", k: "Editable geometry, text, dimensions and layers.", art: <TraceDemo mode="cad" sel="wall" className="block h-auto w-full" /> },
  ];
  return (
    <Paper id="why">
      <Head eyebrow="Why legacy files get in the way" heading="A Drawing Can Look Fine and Still Be Difficult to Work With">
        <p>{s[0]} {s[1] ?? ""}</p>
        <p className="text-sm">{s.slice(2).join(" ")}</p>
        <ul className="grid gap-1.5 text-sm sm:grid-cols-2">{["Design changes", "Quoting", "Documentation", "Future revisions", "Archive management"].map((x) => <li key={x} className="flex gap-2 border border-slate-300 bg-white px-3 py-2 text-slate-700"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-amber-500" />{x}</li>)}</ul>
      </Head>
      <InView threshold={0.1} className="mt-12">
        <ol className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
          {cols.flatMap((c, i) => [
            <li key={c.t} className="reveal overflow-hidden border border-slate-300 bg-white" style={delay(i * 140)}><div className="bg-[#0B1B33]">{c.art}</div><div className="p-4"><h3 className="text-base font-semibold text-slate-900">{c.t}</h3><p className="mt-0.5 text-sm text-slate-600">{c.k}</p></div></li>,
            i < 2 ? <li key={`a${i}`} aria-hidden className="grid place-items-center font-mono text-2xl text-amber-500 max-md:rotate-90">→</li> : null,
          ])}
        </ol>
      </InView>
    </Paper>
  );
}

export function SignatureSection() {
  return (
    <Char id="signature">
      <Head dark eyebrow="Signature view" heading="From Scanned Source to Editable CAD"><p>Watch one drawing move from a scan to vector geometry, to structured layers and native entities, to an editable DWG — and on to the design, documentation and revision work it&apos;s for.</p></Head>
      <InView threshold={0.08} className="mt-12"><SignatureFlow /></InView>
    </Char>
  );
}

export function TraceSection({ service }: { service: Service }) {
  return (
    <Char id="trace">
      <Head dark eyebrow="Trace vs CAD" heading="A Raster Trace Is Not the Same as Native CAD">
        <p>{H(service, "A Proper Reconstruction", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Is this a raster trace")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><TraceCompare /></InView>
    </Char>
  );
}

export function EntitySection() {
  return (
    <Paper id="entities">
      <Head eyebrow="Native entities" heading="Rebuild the Drawing as Real CAD Data"><p>Lines, polylines, text, dimensions, layers and blocks — rebuilt as the objects they were meant to be. Break the drawing apart to see its entities, then put it back together.</p></Head>
      <InView threshold={0.08} className="mt-12"><EntityExplorer /></InView>
    </Paper>
  );
}

export function DimSection({ service }: { service: Service }) {
  return (
    <Char id="dimensions">
      <Head dark eyebrow="Text & dimensions" heading="Text and Dimensions Should Stay Editable"><p>{H(service, "A Proper Reconstruction", 1)}</p></Head>
      <InView threshold={0.1} className="mt-12 [&_.text-slate-600]:text-slate-300"><DimEdit /></InView>
    </Char>
  );
}

export function LayersSection({ service }: { service: Service }) {
  return (
    <Char id="layers">
      <Head dark eyebrow="Layers" heading="A Converted Archive Should Have Structure">
        <p>{H(service, "Handling Errors", 1)}</p>
        <ol className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center">{["Source drawing", "Layer standard", "Consistent CAD archive"].map((x, i) => <li key={x} className="flex items-center gap-2"><span className="border border-slate-600 px-3 py-2 text-slate-200">{x}</span>{i < 2 ? <span aria-hidden className="text-amber-400">→</span> : null}</li>)}</ol>
      </Head>
      <InView threshold={0.08} className="mt-12"><LayerPanel /></InView>
    </Char>
  );
}

export function ArchiveDigitiseSection() {
  const years = ["1998", "2004", "2010", "2015", "Current"];
  const rows = [["DRG-0142", "R3", "Architectural", "DWG", "A-xxxx", "Converted"], ["DRG-0143", "R1", "Structural", "DWG", "S-xxxx", "Converted"], ["DRG-0207", "R5", "Mechanical", "DGN → DWG", "M-xxxx", "In review"]];
  return (
    <Paper id="archive" tint>
      <Head eyebrow="Archive digitisation" heading="Turn a Drawing Archive Into Something Your Team Can Actually Edit and Maintain">
        <p>From boxes of sheets and mixed formats to a structured CAD archive. A searchable index is a possible downstream use for larger projects — not an automatic deliverable.</p>
      </Head>
      <InView threshold={0.1} className="mt-12 grid items-center gap-5 lg:grid-cols-[auto_auto_1fr]">
        <ul className="grid grid-cols-5 gap-2 lg:grid-cols-1">{years.map((y, i) => <li key={y} className="reveal flex items-center gap-2 border border-slate-300 bg-white px-3 py-2" style={delay(i * 80)}><MiniSheet tone="scan" className="hidden h-6 w-9 sm:block" /><span className="font-mono text-xs text-slate-700">{y}</span></li>)}</ul>
        <div aria-hidden className="grid place-items-center font-mono text-[11px] uppercase tracking-[0.14em] text-copper-600 max-lg:rotate-90">Digitise →</div>
        <div className="overflow-x-auto border border-slate-300 bg-white"><table className="w-full min-w-[520px] border-collapse text-left font-mono text-[11px] text-slate-700"><caption className="border-b border-slate-300 bg-slate-100 px-3 py-2 text-left uppercase tracking-[0.14em]">Structured CAD archive · illustrative</caption><thead><tr className="text-slate-500">{["Drawing no.", "Rev", "Discipline", "File type", "Layer std", "Status"].map((h) => <th key={h} className="px-3 py-1.5 font-normal">{h}</th>)}</tr></thead><tbody>{rows.map((r) => <tr key={r[0]} className="border-t border-slate-100">{r.map((c, i) => <td key={i} className="px-3 py-1.5">{c}</td>)}</tr>)}</tbody></table></div>
      </InView>
    </Paper>
  );
}

export function ArchiveStandardSection({ service }: { service: Service }) {
  return (
    <Paper id="consistency">
      <Head eyebrow="Archive consistency" heading="Individually Converted Files Don't Make a Consistent Archive">
        <p>{H(service, "Handling Errors", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you convert a large archive")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><ArchiveStandard /></InView>
    </Paper>
  );
}

export function ArchiveFlowSection() {
  return (
    <Char id="archive-flow">
      <Head dark eyebrow="Archive workflow" heading="Legacy Archive → Standardise → Convert → Organise"><p>Agree the standard first, convert against it, then organise the result — so the archive that comes back is consistent in naming, layers and output.</p></Head>
      <InView threshold={0.08} className="mt-12"><ArchiveFlow /></InView>
    </Char>
  );
}

export function ConflictSection({ service }: { service: Service }) {
  return (
    <Paper id="conflicts" tint>
      <Head eyebrow="When drawings disagree" heading="What Happens When the Old Drawings Don't Agree?">
        <p>{H(service, "Handling Errors", 2)}</p>
        <p className="text-sm">{faqOf(service.faqs, "What happens if two drawings")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Conflict /></InView>
    </Paper>
  );
}

export function CorrectionSection({ service }: { service: Service }) {
  return (
    <Paper id="corrections">
      <Head eyebrow="Source vs corrections" heading="Should the Conversion Reproduce the Source or Apply Known Corrections?">
        <p>{H(service, "Handling Errors", 0)}</p>
        <p className="text-sm">Conversion does not validate the engineering content of the original drawing, and a converted drawing isn&apos;t automatically approved for construction.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Correction /></InView>
    </Paper>
  );
}

export function BatchSection() {
  return (
    <Char id="batch">
      <Head dark eyebrow="Batch conversion" heading="From One Drawing to an Entire Archive"><p>Single file, small set or large archive — the layers, naming, file structure and output format stay consistent across the whole batch.</p></Head>
      <InView threshold={0.1} className="mt-12"><Batch /></InView>
    </Char>
  );
}

export function ThreeDSection({ service }: { service: Service }) {
  return (
    <Char id="two-to-three">
      <Head dark eyebrow="2D → 3D" heading="When Conversion Needs to Go Beyond 2D">
        <p>{faqOf(service.faqs, "Can you convert a 2D drawing into a 3D model")}</p>
        <p className="text-sm">For mechanical parts and assemblies see <Link href="/services/mechanical/mechanical-drafting" className={lk("text-white")}>mechanical drafting</Link>; for existing buildings captured by laser scan, <Link href="/services/bim/scan-to-bim" className={lk("text-white")}>scan to BIM</Link>.</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><Conv3DSection /></InView>
    </Char>
  );
}

export function MigrationSection({ service }: { service: Service }) {
  const items = ["Geometry", "Layers", "Text", "Dimensions", "Blocks", "References"];
  return (
    <Paper id="migration" tint>
      <Head eyebrow="Platform migration" heading="Move Legacy CAD Data Into the Platform Your Team Uses">
        <p>{faqOf(service.faqs, "Can you migrate files between different CAD platforms")}</p>
        <p className="text-sm">Migration can involve formats and platforms. For dedicated PDF conversion, see <Link href="/services/cad-conversion/pdf-to-cad" className={lk("text-navy-900")}>PDF to CAD</Link>.</p>
      </Head>
      <InView threshold={0.1} className="mt-12 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        {["Legacy platform", "Current CAD platform"].flatMap((t, i) => [
          <div key={t} className={"reveal border p-5 " + (i ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white")} style={delay(i * 200)}><p className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">{i ? "Destination" : "Source"}</p><h3 className="mt-1 text-lg font-semibold">{t}</h3><ul className="mt-3 grid grid-cols-2 gap-1.5 text-sm">{items.map((x) => <li key={x} className={"border px-2 py-1 " + (i ? "border-slate-600 text-slate-200" : "border-slate-200 text-slate-700")}>{x}</li>)}</ul></div>,
          i === 0 ? <div key="m" aria-hidden className="grid place-items-center font-mono text-[11px] uppercase tracking-[0.14em] text-copper-600 max-lg:rotate-90">Migration →</div> : null,
        ])}
      </InView>
      <Reveal className="mt-6">
        <Link href="/software/microstation" className="group flex flex-col gap-3 border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900 sm:flex-row sm:items-center sm:justify-between">
          <span><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">DGN / MicroStation</span><span className="mt-1 block text-base font-semibold text-slate-900">Legacy or platform-specific CAD data → CAD conversion → editable output</span><span className="mt-1 block text-sm text-slate-600">Each file is reviewed first — not every DGN can be assumed to convert identically.</span></span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900">MicroStation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span>
        </Link>
      </Reveal>
    </Paper>
  );
}

export function QualitySection({ service }: { service: Service }) {
  return (
    <Char id="quality">
      <Head dark eyebrow="Quality check" heading="Conversion Is Checked Against the Source"><p>{service.process[3]?.description}</p></Head>
      <InView threshold={0.08} className="mt-12"><QualityCheck /></InView>
    </Char>
  );
}

export function BeforeAfterSection() {
  return (
    <Char id="compare">
      <Head dark eyebrow="Before / after" heading="Drag From the Scan to the Converted Drawing"><p>The same sheet, source on one side and converted CAD on the other.</p></Head>
      <InView threshold={0.1} className="mt-12 mx-auto max-w-4xl"><BeforeAfter /></InView>
    </Char>
  );
}

export function LongevitySection({ service }: { service: Service }) {
  const items = [["File name", "Logical naming"], ["Drawing number", "Consistent structure"], ["Layers", "Predictable conventions"], ["Folders / sheets", "Organised structure"]];
  return (
    <Paper id="longevity">
      <Head eyebrow="Long-term use" heading="Build an Archive That Still Makes Sense Years Later">
        <p>{H(service, "Building an Archive", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Do you think about long-term usability")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {items.map(([k, v], i) => <div key={k} className="reveal border border-slate-300 bg-white p-4" style={delay(i * 100)}><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{k}</p><p className="mt-1 text-sm font-semibold text-slate-900">{v}</p></div>)}
        <div className="reveal border border-slate-900 bg-slate-900 p-4 text-white" style={delay(400)}><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">Future user</p><p className="mt-1 text-sm font-semibold">Opens the archive years later — and it still makes sense</p></div>
      </InView>
    </Paper>
  );
}

const DEL = ["Editable DWG files from PDF or scanned drawings", "DGN / MicroStation format conversion", "2D to 3D model conversion", "Vector conversion of raster / scanned drawings", "CAD platform migration", "Legacy drawing digitisation", "Batch conversion for full drawing archives", "Layer standard and naming convention set-up"];
export function DeliverablesSection() {
  return (
    <Paper id="deliverables" tint>
      <Reveal><SectionHeading eyebrow="Deliverables" heading="What You Get" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DEL.map((d, i) => <li key={d} className="reveal" style={delay((i % 4) * 70)}><div className="group h-full border border-slate-300 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><ConvIcon k={[0, 1, 2, 3, 4, 5, 6, 7][i]} className="h-11 w-11 text-blue-600 transition-transform duration-500 group-hover:scale-110" /><h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">{d}</h3></div></li>)}
      </InView>
    </Paper>
  );
}

export function ApplicationsSection({ service }: { service: Service }) {
  return (
    <Paper id="applications">
      <Reveal><SectionHeading eyebrow="Applications" heading="Where CAD Conversion Is Used" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {service.applications.map((a, i) => <li key={a} className="reveal" style={delay((i % 3) * 80)}><div className="group flex h-full gap-4 border border-slate-300 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><ConvIcon k={[5, 8, 4, 9, 7, 6][i % 6]} className="h-10 w-10 shrink-0 text-blue-600" /><div><h3 className="text-base font-semibold leading-snug tracking-tight text-slate-900">{a}</h3><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{String(i + 1).padStart(2, "0")}</p></div></div></li>)}
      </InView>
    </Paper>
  );
}

export function WorkflowSection({ service }: { service: Service }) {
  const intake = ["PDF", "Scan", "DGN", "Legacy CAD"];
  return (
    <Paper id="workflow" tint>
      <Reveal><SectionHeading eyebrow="Workflow" heading="How It Works" /></Reveal>
      <InView className="mt-8"><div className="mb-10 flex flex-wrap items-center gap-2" aria-label="Source file intake">{intake.map((x, i) => <span key={x} className="reveal border border-slate-300 bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-700" style={delay(i * 80)}>{x}</span>)}<span aria-hidden className="text-copper-500">→</span><span className="border border-amber-500 bg-amber-50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-amber-800">Source review</span><span aria-hidden className="text-copper-500">→</span><span className="border border-slate-900 bg-slate-900 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-white">CAD output</span></div></InView>
      <ConvProcess steps={service.process} />
    </Paper>
  );
}

export function SoftwareSection({ service }: { service: Service }) {
  const tiles = [
    { slug: "autocad", name: "AutoCAD", note: "Primary CAD conversion environment", art: <ConvScene stage={5} legend={false} title="AutoCAD drawing with layers" className="block h-auto w-full" /> },
    { slug: "microstation", name: "MicroStation", note: "DGN / MicroStation workflows", art: <ConvScene stage={4} legend={false} title="MicroStation DGN workflow" className="block h-auto w-full" /> },
  ].filter((t) => service.software.includes(t.slug));
  return (
    <Char id="software">
      <Reveal><SectionHeading tone="dark" eyebrow="Software" heading="Software We Use" /></Reveal>
      <ul className="mt-12 grid gap-4 md:grid-cols-2">{tiles.map((t, i) => <li key={t.slug}><Reveal delay={i * 80} className="h-full"><Link href={`/software/${t.slug}`} className="group flex h-full flex-col border border-slate-700 bg-slate-900/40 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/60"><div className="overflow-hidden"><div className="art-zoom">{t.art}</div></div><div className="p-5"><h3 className="text-base font-semibold text-white">{t.name}</h3><p className="mt-1 text-xs uppercase tracking-[0.1em] text-slate-400">{t.note}</p></div></Link></Reveal></li>)}</ul>
    </Char>
  );
}

const IND: Record<string, React.ReactNode> = {
  construction: <g stroke="#7DD3FC" strokeWidth="1.5" fill="none"><path d="M40 120V30h120v90M40 60h120M40 90h120M80 30v90M120 30v90M20 120h200" /></g>,
  manufacturing: <g stroke="#7DD3FC" strokeWidth="1.5" fill="none"><circle cx="90" cy="80" r="34" /><circle cx="90" cy="80" r="12" /><rect x="140" y="50" width="70" height="60" /><path d="M20 120h200M140 70h70" /></g>,
  mining: <g stroke="#7DD3FC" strokeWidth="1.5" fill="none"><path d="M30 120l40 -70 30 30 30 -50 50 90M20 120h200M160 60V30h30v30" /><rect x="170" y="96" width="30" height="24" /></g>,
  energy: <g stroke="#7DD3FC" strokeWidth="1.5" fill="none"><path d="M120 20l-40 100M120 20l40 100M90 80h60M100 55h40M60 120h120M120 20v-8" /></g>,
};
export function IndustriesSection({ service }: { service: Service }) {
  return (
    <Paper id="industries">
      <Reveal><SectionHeading eyebrow="Industries" heading="Industries We Support" /></Reveal>
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{service.industries.map((slug, i) => <li key={slug}><Reveal delay={i * 80} className="h-full"><Link href={`/industries/${slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><div className="aspect-[8/5] overflow-hidden bg-[#0B1B33]"><svg viewBox="0 0 240 150" className="art-zoom h-full w-full p-3" role="img" aria-label={`${getIndustryBySlug(slug)?.name ?? slug} drawing`}><title>{getIndustryBySlug(slug)?.name ?? slug}</title>{IND[slug]}</svg></div><div className="p-4 sm:p-5"><h3 className="text-base font-semibold tracking-tight text-slate-900">{getIndustryBySlug(slug)?.name ?? slug}</h3></div></Link></Reveal></li>)}</ul>
    </Paper>
  );
}

const PSLUGS = ["sheet-metal-enclosure-fabrication-drawings", "legacy-machine-part-reverse-engineering", "warehouse-structural-steel-shop-drawings"];
export function ProjectsSection() {
  const items = PSLUGS.map((s) => projects.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return (
    <Char id="projects">
      <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading tone="dark" eyebrow="Portfolio" heading="Related Projects" description="Illustrative examples, marked as such. They will give way to verified case studies as client work is cleared for publication." /><Link href="/projects" className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-copper-400 hover:underline">All projects →</Link></Reveal>
      <InView as="ul" className="mt-12 grid gap-5 md:grid-cols-3">{items.map((p, i) => (
        <li key={p.slug}><Reveal delay={i * 90} className="h-full"><Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col overflow-hidden border border-slate-700 bg-slate-900/40 transition-colors duration-300 hover:border-sky-300/60">
          <div className="relative overflow-hidden"><div className="art-zoom grid grid-cols-2 gap-px bg-slate-700"><MiniSheet tone="scan" className="block h-auto w-full" /><MiniSheet tone="std" className="block h-auto w-full" /></div><p className="absolute bottom-1.5 left-2 font-mono text-[9px] uppercase tracking-[0.14em] text-sky-200">Source → CAD</p></div>
          <div className="flex flex-1 flex-col p-5"><div className="flex items-center gap-3"><span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">{p.discipline}</span>{p.isPlaceholder ? <span className="border border-slate-500 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-300">Illustrative example</span> : null}</div><h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-white">{p.title}</h3><p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-300">{p.summary}</p><span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors group-hover:text-copper-400">View project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span></div>
        </Link></Reveal></li>
      ))}</InView>
    </Char>
  );
}

export function RelatedSection() {
  const nodes = [
    { l: "PDF to CAD", d: "Converting PDF drawings into editable layered DWG files.", href: "/services/cad-conversion/pdf-to-cad", rel: "PDF / scan → CAD conversion → editable CAD" },
    { l: "Scan to BIM", d: "Point cloud and laser scan conversion into working Revit BIM models.", href: "/services/bim/scan-to-bim", rel: "Point cloud → scan to BIM" },
    { l: "Mechanical drafting", d: "2D mechanical drafting and 3D CAD modelling for manufacturers, fabricators and product designers.", href: "/services/mechanical/mechanical-drafting", rel: "Editable CAD → mechanical drafting" },
  ];
  return (
    <Paper id="related" tint>
      <Reveal><SectionHeading eyebrow="Related" heading="Connected Conversion & Drafting Services" /></Reveal>
      <InView className="mt-12"><ol className="grid gap-3 lg:grid-cols-3">{nodes.map((n, i) => <li key={n.l} className="reveal" style={delay(i * 120)}><Link href={n.href} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{n.rel}</span><span className="mt-2 flex items-center justify-between text-base font-semibold text-slate-900">{n.l}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span><span className="mt-1 text-sm text-slate-600">{n.d}</span></Link></li>)}</ol></InView>
    </Paper>
  );
}

export function ConvCTA() {
  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-[#0B1220] py-20 sm:py-28">
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Turn Legacy Drawings Into CAD Your Team Can Actually Use</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">Tell us what you have — PDFs, scans, DGN or legacy CAD — and our team can review the conversion requirements.</p>
          <div className="mt-9 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button><Button href="/services/cad-conversion" size="lg" variant="outline-light">Explore Conversion Services</Button></div>
        </div>
        <CtaConv />
      </Container>
    </section>
  );
}

export { Q, mono };
