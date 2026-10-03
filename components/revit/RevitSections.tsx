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
import { RevitScene, ElementIso, RvtIcon, C } from "./RvtScene";
import {
  HeroRevit, Bottleneck, LooksVsWorks, DisciplineTabs, BepDiagram, StandardApply, LodDoor, NewModel, ChangeDemo, WorksetViewer, FamilyParams, OneElement,
  ModelTagSchedule, DocMatrix, Audit, HandoverTable, Revisions, RevitProcess, CtaRevit, Frame,
} from "./RevitClient";

const lk = (c: string) => "font-semibold underline-offset-4 hover:underline " + c;
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const H = (s: Service, p: string, n = 0) => overviewParagraphs(s, p)[n] ?? "";

export function RevitHero({ heading, description }: { heading: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-[#0B1220]">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.06]"><defs><pattern id="rv-g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#rv-g)" /></svg>
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-sky-300">BIM</p>
            <h1 style={delay(100)} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">{heading}</h1>
            <p style={delay(220)} className="reveal mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{description}</p>
            <div style={delay(340)} className="reveal mt-9 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#workflow" size="lg" variant="outline-light" arrow>Explore Our Workflow</Button></div>
            <p style={delay(460)} className="reveal mt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">A model that looks right · a model that works right</p>
          </div>
          <div style={delay(300)} className="reveal min-w-0"><HeroRevit /></div>
        </Container>
      </InView>
    </section>
  );
}

export function BottleneckSection({ service }: { service: Service }) {
  const s = sentences(service.problemStatement);
  return (
    <Paper id="bottleneck">
      <Head eyebrow="The bottleneck" heading="When the Revit Model Falls Behind, the Project Can Feel It">
        <p>{s[0]} {s[1] ?? ""}</p>
        <p className="text-sm">{s.slice(2).join(" ")}</p>
        <ul className="grid gap-1.5 text-sm sm:grid-cols-2">{["Building a model from scratch", "Design revisions that keep arriving", "Existing models that need updating", "Documentation teams with overflow"].map((x) => <li key={x} className="flex gap-2 border border-slate-300 bg-white px-3 py-2 text-slate-700"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-orange-500" />{x}</li>)}</ul>
      </Head>
      <InView threshold={0.1} className="mt-12"><Bottleneck /></InView>
    </Paper>
  );
}

export function WorksSection({ service }: { service: Service }) {
  return (
    <Paper id="works" tint>
      <Head eyebrow="The idea" heading="A Revit Model Should Do More Than Look Correct">
        <p>{H(service, "Schedules and Tags", 0)}</p>
        <p className="text-sm">A model that looks right is geometry. A model that works right connects geometry, data, documentation and the project&apos;s standards.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><LooksVsWorks /></InView>
    </Paper>
  );
}

export function OneElementSection() {
  return (
    <Char id="one-element">
      <Head dark eyebrow="Signature view" heading="One Element. Many Project Outputs.">
        <p>Pick a door or a window. The same element appears as a 3D component, on the plan and elevation, as a tag, as a row in a schedule and on a drawing sheet — because they all come from one model.</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><OneElement /></InView>
    </Char>
  );
}

export function DisciplineSection({ service }: { service: Service }) {
  return (
    <Paper id="disciplines">
      <Head eyebrow="Disciplines" heading="Architectural, Structural and MEP — Individually or as a Set">
        <p>{H(service, "What This Service Covers", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Do you produce structural and MEP")} For multi-discipline coordination and clash detection, see <Link href="/services/bim/bim-services" className={lk("text-navy-900")}>BIM modelling &amp; coordination</Link>.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><DisciplineTabs /></InView>
    </Paper>
  );
}

export function BepSection({ service }: { service: Service }) {
  return (
    <Paper id="bep" tint>
      <Head eyebrow="BIM execution plan" heading="Your BIM Execution Plan Comes First">
        <p>{H(service, "Following an Established", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "How do you handle a project where the BIM execution plan changes")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><BepDiagram /></InView>
    </Paper>
  );
}

export function StandardSection({ service }: { service: Service }) {
  return (
    <Paper id="standard">
      <Head eyebrow="Project standards" heading="Model to the Project Standard — Not Ours">
        <p>{faqOf(service.faqs, "Can you work within our BIM execution plan")}</p>
        <p className="text-sm">The project&apos;s title block, naming conventions, templates and family conventions are followed rather than replaced with our own.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><StandardApply /></InView>
    </Paper>
  );
}

export function LodSection({ service }: { service: Service }) {
  return (
    <Paper id="lod" tint>
      <Head eyebrow="Level of development" heading="Model to the Level of Development the Project Actually Needs">
        <p>{service.heroDescription}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you build a Revit model for a warehouse")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><LodDoor /></InView>
    </Paper>
  );
}

export function OverbuildSection() {
  const cols = [
    { t: "Overbuilt model", lod: 3 as const, flow: ["Too much detail too early", "More modelling effort", "Unnecessary complexity"], tone: "border-orange-400" },
    { t: "Project-appropriate model", lod: 1 as const, flow: ["Right detail for the current stage", "Useful coordination", "Useful documentation"], tone: "border-blue-600" },
  ];
  return (
    <Char id="overbuild">
      <Head dark eyebrow="Right-sized" heading="Don't Overbuild the Model — or Underbuild It">
        <p>A model overloaded with detail nobody needs yet wastes effort; one too thin cannot support the coordination the project needs to do. The aim is the depth that the current stage and its downstream use call for.</p>
      </Head>
      <InView threshold={0.1} className="mt-12 grid gap-5 md:grid-cols-2">
        {cols.map((c, i) => (
          <div key={c.t} className={`reveal border bg-white ${c.tone}`} style={delay(i * 100)}>
            <ElementIso kind="equipment" lod={c.lod} title={c.t} className="block h-auto w-full" />
            <div className="border-t border-slate-200 p-5"><h3 className="text-base font-semibold text-slate-900">{c.t}</h3>
              <ol className="mt-3 space-y-1.5 text-sm text-slate-700">{c.flow.map((f, k) => <li key={f} className="flex gap-2"><span className="font-mono text-slate-400">{k > 0 ? "↓" : "•"}</span>{f}</li>)}</ol></div>
          </div>
        ))}
      </InView>
    </Char>
  );
}

export function NewModelSection() {
  return (
    <Paper id="new-model">
      <Head eyebrow="From scratch" heading="Starting a New Revit Model">
        <p>From brief to schedules — an illustrative sequence showing how a model is built up. Not every project follows exactly these steps.</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><NewModel /></InView>
    </Paper>
  );
}

export function UpdateSection({ service }: { service: Service }) {
  return (
    <Paper id="updates" tint>
      <Head eyebrow="Existing models" heading="Keeping an Existing Model Current Through Design Changes">
        <p>{H(service, "Following an Established", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you update an existing Revit model")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><ChangeDemo /></InView>
    </Paper>
  );
}

export function WorksetSection({ service }: { service: Service }) {
  const flow = ["Single project", "Collaboration strategy", "Architecture · Structure · MEP · Linked files · Worksets", "Coordinated workflow"];
  return (
    <Paper id="worksets">
      <Head eyebrow="Model division" heading="Plan Model Division Before the Project Becomes Too Large">
        <p>{H(service, "Setting Up a Workflow", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "How do you plan model division")}</p>
      </Head>
      <InView threshold={0.1} className="mt-10">
        <ol className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-center">{flow.map((f, i) => <li key={f} className="reveal flex flex-1 items-center gap-2" style={delay(i * 120)}><span className={"flex-1 border px-4 py-3 text-sm font-semibold " + (i === 3 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-900")}>{f}</span>{i < 3 ? <ArrowRight aria-hidden className="h-4 w-4 shrink-0 rotate-90 text-copper-500 lg:rotate-0" /> : null}</li>)}</ol>
        <WorksetViewer />
      </InView>
    </Paper>
  );
}

export function FamilySection({ service }: { service: Service }) {
  return (
    <Paper id="families" tint>
      <Head eyebrow="Families & parameters" heading="Families That Work With the Model — and Geometry Is Only Part of It">
        <p>{faqOf(service.faqs, "Can you set up shared parameters")}</p>
        <p className="text-sm">Custom equipment is a typical case — see <Link href="/services/bim/bim-services" className={lk("text-navy-900")}>custom family work in BIM coordination</Link>.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><FamilyParams /></InView>
    </Paper>
  );
}

export function SchedulesTagsSection({ service }: { service: Service }) {
  return (
    <Char id="schedules-tags">
      <Head dark eyebrow="Schedules & tags" heading="Schedules and Tags Are Part of the Model — Not an Afterthought">
        <p>{H(service, "Schedules and Tags", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you make sure schedules pull")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12 [&_.text-slate-600]:text-slate-300"><ModelTagSchedule /></InView>
    </Char>
  );
}

export function TemplateSection({ service }: { service: Service }) {
  return (
    <Paper id="template">
      <Head eyebrow="First BIM workflow" heading="Starting a BIM Workflow From Scratch? Build the Foundation First.">
        <p>{H(service, "Setting Up a Workflow", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you help us set up a Revit workflow")} A template is a foundation, not a cure-all.</p>
      </Head>
      <InView threshold={0.1} className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {[
          { t: "Project template", p: ["Views", "Sheets", "Standards"], k: 6 },
          { t: "Family library", p: ["Components", "Parameters", "Naming"], k: 7 },
          { t: "Repeatable BIM workflow", p: ["Later projects start stronger"], k: 4 },
        ].flatMap((b, i) => [
          <div key={b.t} className={"reveal border p-5 " + (i === 2 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white")} style={delay(i * 140)}>
            <RvtIcon k={b.k} className={"h-10 w-10 " + (i === 2 ? "text-sky-300" : "text-blue-600")} /><h3 className="mt-3 text-base font-semibold">{b.t}</h3>
            <ul className={"mt-2 space-y-1 text-sm " + (i === 2 ? "text-slate-300" : "text-slate-600")}>{b.p.map((x) => <li key={x}>• {x}</li>)}</ul>
          </div>,
          i < 2 ? <span key={`o${i}`} aria-hidden className="grid place-items-center font-mono text-2xl text-copper-500">{i === 0 ? "+" : "="}</span> : null,
        ])}
      </InView>
    </Paper>
  );
}

export function AuditSection({ service }: { service: Service }) {
  return (
    <Paper id="audit" tint>
      <Head eyebrow="Model audit" heading="Before You Take Over a Model, Understand What Is Inside It">
        <p>{faqOf(service.faqs, "Do you provide model auditing")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Audit /></InView>
    </Paper>
  );
}

export function DocsSection({ service }: { service: Service }) {
  return (
    <Paper id="documentation">
      <Head eyebrow="Documentation" heading="From Revit Model to Drawing Set">
        <p>{H(service, "What This Service Covers", 1)}</p>
        <p className="text-sm">For 2D documentation, see <Link href="/services/architectural/architectural-drafting" className={lk("text-navy-900")}>architectural drafting</Link>. Floor plans, sections, elevations, sheets and schedules all come from the model.</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><DocMatrix /></InView>
    </Paper>
  );
}

export function HandoverSection() {
  return (
    <Paper id="handover" tint>
      <Head eyebrow="Handover" heading="Build the Model With Its Future Use in Mind">
        <p>Facilities and asset model handover is one of the uses a Revit model can be scoped around. Not every model is automatically suitable for facilities management — it depends on the project&apos;s handover requirements.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><HandoverTable /></InView>
    </Paper>
  );
}

const DEL = [
  { t: "Architectural Revit models", d: "Walls, floors, doors, windows, rooms and documentation." }, { t: "Structural Revit models", d: "Columns, beams, slabs and framing." }, { t: "MEP Revit models", d: "Ductwork, pipework, equipment and systems." },
  { t: "Custom Revit families", d: "Components that behave correctly in the project." }, { t: "Model-derived drawing sheets", d: "Plans, sections, elevations and schedules from the model." }, { t: "Model updates through design revisions", d: "Changes tracked through dependent views." },
  { t: "Revit templates", d: "A structured starting project for teams new to BIM." }, { t: "Family libraries", d: "A repeatable set of components and parameters." },
];
export function DeliverablesSection() {
  return (
    <Paper id="deliverables">
      <Reveal><SectionHeading eyebrow="Deliverables" heading="What You Get" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DEL.map((d, i) => (
          <li key={d.t} className="reveal" style={delay((i % 4) * 70)}>
            <div className="group h-full border border-slate-300 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><RvtIcon k={i} className="h-11 w-11 text-blue-600 transition-transform duration-500 group-hover:scale-110" /><h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">{d.t}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{d.d}</p></div>
          </li>
        ))}
      </InView>
    </Paper>
  );
}

export function ApplicationsSection({ service }: { service: Service }) {
  return (
    <Paper id="applications" tint>
      <Reveal><SectionHeading eyebrow="Applications" heading="Where Revit Modelling Fits" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {service.applications.map((a, i) => (
          <li key={a} className="reveal" style={delay((i % 3) * 80)}>
            <div className="group flex h-full gap-4 border border-slate-300 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><RvtIcon k={[0, 1, 4, 5, 3][i % 5]} className="h-10 w-10 shrink-0 text-blue-600" /><div><h3 className="text-base font-semibold leading-snug tracking-tight text-slate-900">{a}</h3><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{String(i + 1).padStart(2, "0")}</p></div></div>
          </li>
        ))}
      </InView>
    </Paper>
  );
}

export function WorkflowSection({ service }: { service: Service }) {
  return (
    <Paper id="workflow">
      <Reveal><SectionHeading eyebrow="Workflow" heading="How It Works" /></Reveal>
      <div className="mt-12"><RevitProcess steps={service.process} /></div>
    </Paper>
  );
}

export function RevisionSection({ service }: { service: Service }) {
  return (
    <Paper id="revisions" tint>
      <Head eyebrow="Revision control" heading="Design Changes Without Losing the Model History">
        <p>{service.process[4]?.description}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Revisions /></InView>
    </Paper>
  );
}

export function SoftwareSection({ service }: { service: Service }) {
  const tiles = [
    { slug: "revit", name: "Revit", note: "Primary modelling platform", art: <RevitScene layers={{ levels: true, arch: true, struct: true, mep: true }} title="Revit model" className="block h-auto w-full" /> },
    { slug: "navisworks", name: "Navisworks", note: "Coordination support", art: <RevitScene layers={{ arch: true, struct: true, mep: true }} hi="wall" title="Navisworks coordination view" className="block h-auto w-full" /> },
  ].filter((t) => service.software.includes(t.slug));
  return (
    <Char id="software">
      <Reveal><SectionHeading tone="dark" eyebrow="Software" heading="Software We Use" /></Reveal>
      <ul className="mt-12 grid gap-4 md:grid-cols-2">{tiles.map((t, i) => (
        <li key={t.slug}><Reveal delay={i * 80} className="h-full"><Link href={`/software/${t.slug}`} className="group flex h-full flex-col border border-slate-700 bg-slate-900/40 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/60"><div className="overflow-hidden bg-white"><div className="art-zoom">{t.art}</div></div><div className="p-5"><h3 className="text-base font-semibold text-white">{t.name}</h3><p className="mt-1 text-xs uppercase tracking-[0.1em] text-slate-400">{t.note}</p></div></Link></Reveal></li>
      ))}</ul>
    </Char>
  );
}

const IND: Record<string, React.ReactNode> = {
  construction: <RevitScene layers={{ levels: true, arch: true, struct: true }} title="Building model" className="block h-full w-full object-cover" />,
  manufacturing: <svg viewBox="0 0 640 400" className="block h-full w-full object-cover" fill="none" role="img" aria-label="Industrial facility"><rect width="640" height="400" fill="#fff" /><rect y="320" width="640" height="80" fill="#E2E8F0" /><path d="M80 320V190l100 -50v50l100 -50v50l100 -50v50l100 -50V320Z" fill="#F1F5F9" stroke={C.line} strokeWidth="2" /><rect x="150" y="240" width="110" height="80" fill="#BFDBFE" stroke={C.line} strokeWidth="2" /><circle cx="470" cy="270" r="44" stroke={C.mep} strokeWidth="3" /><path d="M426 270h88M470 226v88" stroke={C.mep} /></svg>,
  energy: <svg viewBox="0 0 640 400" className="block h-full w-full object-cover" fill="none" role="img" aria-label="Infrastructure"><rect width="640" height="400" fill="#fff" /><rect y="320" width="640" height="80" fill="#E2E8F0" /><path d="M120 320V120h30v200M170 320V160h30v160M80 120h110" stroke={C.struct} strokeWidth="3" /><circle cx="360" cy="230" r="70" stroke={C.pipe} strokeWidth="3" /><path d="M290 230h140M360 160v140M430 320V100M520 320V100M420 100h110" stroke={C.line} strokeWidth="2.4" /></svg>,
};
export function IndustriesSection({ service }: { service: Service }) {
  return (
    <Paper id="industries">
      <Reveal><SectionHeading eyebrow="Industries" heading="Industries We Support" /></Reveal>
      <ul className="mt-12 grid gap-4 sm:grid-cols-3">{service.industries.map((slug, i) => (
        <li key={slug}><Reveal delay={i * 80} className="h-full"><Link href={`/industries/${slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><div className="aspect-[16/10] overflow-hidden"><div className="art-zoom h-full w-full">{IND[slug]}</div></div><div className="p-5"><h3 className="text-base font-semibold tracking-tight text-slate-900">{getIndustryBySlug(slug)?.name ?? slug}</h3></div></Link></Reveal></li>
      ))}</ul>
    </Paper>
  );
}

export function ProjectsSection() {
  const items = projects.filter((p) => p.discipline === "bim");
  if (items.length === 0) return null;
  return (
    <Char id="projects">
      <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading tone="dark" eyebrow="Portfolio" heading="Related BIM Projects" description="Illustrative examples, marked as such. They will give way to verified case studies as client work is cleared for publication." /><Link href="/projects/bim" className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-copper-400 hover:underline">All BIM projects →</Link></Reveal>
      <InView as="ul" className="mt-12 grid gap-5 md:grid-cols-2">{items.map((p, i) => (
        <li key={p.slug}><Reveal delay={i * 90} className="h-full"><Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col overflow-hidden border border-slate-700 bg-slate-900/40 transition-colors duration-300 hover:border-sky-300/60">
          <div className="relative aspect-[16/9] overflow-hidden bg-white"><div className="art-zoom h-full w-full"><RevitScene layers={i === 0 ? { levels: true, arch: true, struct: true, mep: true } : { levels: true, arch: true }} hi={i === 0 ? "wall" : null} title={p.title} className="block h-full w-full object-cover" /></div><div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0B1220]/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-100">View project</p></div></div>
          <div className="flex flex-1 flex-col p-6"><div className="flex items-center gap-3"><span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">Project</span>{p.isPlaceholder ? <span className="border border-slate-500 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-300">Illustrative example</span> : null}</div>
            <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-white">{p.title}</h3><p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-300"><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">Scope · </span>{p.summary}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors group-hover:text-copper-400">View project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span></div>
        </Link></Reveal></li>
      ))}</InView>
    </Char>
  );
}

export function RelatedSection() {
  const nodes = [
    { l: "Revit modelling", d: "You are here.", you: true },
    { l: "BIM modelling & coordination", d: "Revit BIM modelling, coordination and clash detection across disciplines.", href: "/services/bim/bim-services" },
    { l: "Scan to BIM", d: "Point cloud and laser scan conversion into working Revit BIM models.", href: "/services/bim/scan-to-bim" },
    { l: "Architectural drafting", d: "Architectural drawing sets, floor plans and building documentation.", href: "/services/architectural/architectural-drafting" },
  ];
  return (
    <Paper id="related" tint>
      <Reveal><SectionHeading eyebrow="Related" heading="Connected BIM & Documentation Services" /></Reveal>
      <InView className="mt-12"><ol className="grid gap-3 lg:grid-cols-4">{nodes.map((n, i) => (
        <li key={n.l} className="reveal relative" style={delay(i * 120)}>
          {n.href ? <Link href={n.href} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><span className="flex items-center justify-between text-base font-semibold text-slate-900">{n.l}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span><span className="mt-1 text-sm text-slate-600">{n.d}</span></Link>
            : <span className="flex h-full flex-col border border-slate-900 bg-slate-900 p-5 text-white"><span className="text-base font-semibold">{n.l}</span><span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">{n.d}</span></span>}
          {i < 3 ? <span aria-hidden className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 bg-[#F1EFEA] font-mono text-copper-500 lg:block">↔</span> : null}
        </li>))}</ol></InView>
    </Paper>
  );
}

export function RevitCTA() {
  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-[#0B1220] py-20 sm:py-28">
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Build a Revit Model That Keeps the Project Moving</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">Tell us what you need and our team can review the project requirements.</p>
          <div className="mt-9 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button><Button href="/services/bim" size="lg" variant="outline-light">Explore BIM Services</Button></div>
        </div>
        <CtaRevit />
      </Container>
    </section>
  );
}

export { Frame };
