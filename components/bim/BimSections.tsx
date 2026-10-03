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
import { BimModel, ClashPair, BimIcon, COL, mono, ALL_LAYERS } from "./Model";
import { HeroBim, DisciplineTabs, FederatedViewer, LodStages, ClashSignature, ClashReport, CoordinationCycle, IssueOwnership, FamilyViewer, InfoToggle, LegacyFlow, ScanFlow, Handover, DerivedDrawings, BimProcess, CtaBim, Panel } from "./BimClient";

const lk = (c: string) => "font-semibold underline-offset-4 hover:underline " + c;
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const H = (s: Service, p: string, n = 0) => overviewParagraphs(s, p)[n] ?? "";

export function BimHero({ heading, description }: { heading: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-[#0B1220]">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.07]">
        <defs><pattern id="bh-g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#bh-g)" />
      </svg>
      <div aria-hidden className="pointer-events-none absolute -right-32 top-0 h-[480px] w-[480px] rounded-full bg-cyan-400/10 blur-3xl" />
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-sky-300">BIM</p>
            <h1 style={delay(100)} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3rem]">{heading}</h1>
            <p style={delay(220)} className="reveal mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{description}</p>
            <div style={delay(340)} className="reveal mt-9 flex flex-wrap gap-4">
              <Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button>
              <Button href="#workflow" size="lg" variant="outline-light" arrow>Explore BIM Workflow</Button>
            </div>
            <p style={delay(460)} className="reveal mt-8 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">{["Architectural", "Structural", "MEP", "Clash detection"].map((t, i) => <span key={t}>{i > 0 ? <span className="mr-3 text-copper-500">•</span> : null}{t}</span>)}</p>
          </div>
          <div style={delay(300)} className="reveal min-w-0"><HeroBim /></div>
        </Container>
      </InView>
    </section>
  );
}

function Converge() {
  const rows = [["Architecture", COL.arch, 40], ["Structure", COL.struct, 100], ["MEP", COL.mech, 160]] as const;
  return (
    <svg viewBox="0 0 520 200" className="block h-auto w-full" role="img" aria-label="Architecture, structure and MEP models converging into one coordinated project model" fill="none">
      <title>Three discipline models converge into one coordinated model</title>
      {rows.map(([t, c, y], i) => (
        <g key={t}>
          <rect x="6" y={y - 14} width="120" height="28" stroke={c} fill={c} fillOpacity="0.1" /><text x="66" y={y + 4} textAnchor="middle" fontSize="11" fill={c} style={mono}>{t.toUpperCase()}</text>
          <path d={`M126 ${y}C260 ${y} 280 100 370 100`} stroke={c} strokeWidth="1.6" strokeDasharray="5 5" className="rch-flow" style={delay(i * 300)} />
        </g>
      ))}
      <rect x="370" y="70" width="144" height="60" stroke="#2563EB" strokeWidth="1.6" fill="#2563EB" fillOpacity="0.12" /><text x="442" y="97" textAnchor="middle" fontSize="11" fill="#93C5FD" style={mono}>COORDINATED</text><text x="442" y="113" textAnchor="middle" fontSize="11" fill="#93C5FD" style={mono}>PROJECT MODEL</text>
    </svg>
  );
}

export function IntroSection({ service }: { service: Service }) {
  const s = sentences(service.problemStatement);
  const probs = ["Each discipline can model independently", "Conflicts can stay hidden", "Coordination may happen too late", "Detail can be added before it is needed", "Issues can get buried in unstructured clash reports"];
  return (
    <Paper id="why">
      <div className="grid gap-10 [&>*]:min-w-0 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <SectionHeading eyebrow="Why coordination" heading="A BIM Model Is Only Useful When the Disciplines Actually Align" />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600"><p>{s[0]}</p><p>{s.slice(1).join(" ")}</p></div>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">{probs.map((p) => <li key={p} className="flex gap-2 border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-orange-500" />{p}</li>)}</ul>
          <p className="mt-4 text-sm text-slate-500">The point isn&apos;t that BIM falls short — it&apos;s that coordination has to be treated as an active process.</p>
        </Reveal>
        <InView threshold={0.15}><div className="border border-sky-300/25 bg-[#0B1B33] p-4"><Converge /></div></InView>
      </div>
    </Paper>
  );
}

export function DisciplinesSection() {
  return (
    <Char id="disciplines">
      <Head dark eyebrow="Disciplines" heading="Three Disciplines. One Coordinated Environment."><p>Pick a discipline to see its model on its own, then federate them. Seeing the three together is the first step of coordination.</p></Head>
      <InView threshold={0.1} className="mt-12"><DisciplineTabs /></InView>
    </Char>
  );
}

export function FederatedSection({ service }: { service: Service }) {
  return (
    <Char id="federated">
      <Head dark eyebrow="Federated model" heading="Bring Every Discipline Into the Same Coordination View">
        <p>{faqOf(service.faqs, "Can you coordinate a model across consultants")}</p>
        <p className="text-sm">Toggle layers and levels, then pick an element to see the metadata a coordination view carries. See <Link href="/software/navisworks" className={lk("text-white")}>Navisworks</Link>-based federation.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><FederatedViewer /></InView>
    </Char>
  );
}

export function LodSection({ service }: { service: Service }) {
  return (
    <Paper id="lod">
      <Head eyebrow="LOD" heading="The Right Level of Development for the Right Project Stage">
        <p>{H(service, "What This Service Covers", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "What LOD do you model to")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><LodStages /></InView>
    </Paper>
  );
}

export function ClashSection({ service }: { service: Service }) {
  return (
    <Char id="clash">
      <Head dark eyebrow="Clash detection" heading="Find the Problem Before It Reaches Site">
        <p>{faqOf(service.faqs, "What does clash detection involve")}</p>
        <p className="text-sm">Clash detection identifies coordination issues. It does not decide the engineering solution — that remains with the responsible design team.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><ClashSignature /></InView>
    </Char>
  );
}

export function HardSoftSection({ service }: { service: Service }) {
  const t = H(service, "Clash Detection and Custom", 0);
  return (
    <Paper id="hard-soft" tint>
      <Head eyebrow="Prioritisation" heading="Hard Clashes and Clearance Issues Are Not the Same Thing">
        <p>{t.split("—")[1] ? "A hard clash between a structural beam and a duct matters far more than a soft clearance clash that is easily resolved on site — so reports are structured to make the important issues easy to find and action." : t}</p>
        <p className="text-sm">There is no universal severity standard: priorities follow the project&apos;s own requirements.</p>
      </Head>
      <InView threshold={0.1} className="mt-12 grid gap-5 md:grid-cols-2">
        {([["hard", "High"], ["soft", "Review"]] as const).map(([k, p], i) => (
          <div key={k} className="reveal border border-slate-300 bg-white" style={delay(i * 100)}>
            <ClashPair kind={k} title={k === "hard" ? "Hard clash: structural beam intersects a duct" : "Clearance issue: equipment access zone approaches another element"} className="block h-auto w-full" />
            <div className="flex items-center justify-between p-4 text-sm"><span className="font-semibold text-slate-900">{k === "hard" ? "Hard clash" : "Clearance issue"}</span><span className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">Priority: {p}</span></div>
          </div>
        ))}
      </InView>
    </Paper>
  );
}

export function ReportSection() {
  return (
    <Paper id="report">
      <Head eyebrow="Clash report" heading="A Clash Report That Points at the Model">
        <p>Instead of a disconnected PDF, each issue is linked to its location. Select an issue and the model shows where it is; select a marker and the issue is highlighted.</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><ClashReport /></InView>
    </Paper>
  );
}

export function CycleSection({ service }: { service: Service }) {
  return (
    <Paper id="cycle" tint>
      <Head eyebrow="Process" heading="Coordination Is a Process, Not a One-Time Clash Report">
        <p>{H(service, "Inherited Models", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "How often should clash detection")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><CoordinationCycle /></InView>
    </Paper>
  );
}

export function OwnershipSection({ service }: { service: Service }) {
  return (
    <Char id="ownership">
      <Head dark eyebrow="Ownership" heading="Every Open Issue Needs Context">
        <p>{faqOf(service.faqs, "How do you keep clash resolution")}</p>
        <p className="text-sm">{faqOf(service.faqs, "Do you produce coordination meeting minutes")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><IssueOwnership /></InView>
    </Char>
  );
}

export function FamilySection({ service }: { service: Service }) {
  return (
    <Char id="families">
      <Head dark eyebrow="Revit families" heading="Revit Families That Behave Correctly — Not Just Look Correct">
        <p>{H(service, "Clash Detection and Custom", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Do you check that Revit families")} Related: <Link href="/services/bim/revit-modelling" className={lk("text-white")}>Revit modelling</Link>.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><FamilyViewer /></InView>
    </Char>
  );
}

export function InfoSection() {
  return (
    <Paper id="information">
      <Head eyebrow="Information" heading="BIM Is More Than Geometry">
        <p>A 3D model shows what something looks like. An information-rich BIM model also carries what it is — type, size, reference, quantity, system, level — and can feed a schedule.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><InfoToggle /></InView>
    </Paper>
  );
}

export function LegacySection({ service }: { service: Service }) {
  return (
    <Paper id="legacy" tint>
      <Head eyebrow="Inherited models" heading="You Don't Always Need to Start Again">
        <p>{H(service, "Inherited Models", 0)}</p>
        <p className="text-sm">Where practical, problem areas can be assessed and rebuilt instead of assuming a complete restart is required. Not every legacy model can be fixed without significant work.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><LegacyFlow /></InView>
    </Paper>
  );
}

export function ScanSection({ service }: { service: Service }) {
  return (
    <Char id="scan">
      <Head dark eyebrow="Scan to BIM" heading="From Point Cloud to Working BIM Model">
        <p>{faqOf(service.faqs, "Can you convert a point cloud")}</p>
        <p className="text-sm">Scan-to-BIM supports existing building documentation, renovation, retrofit and facilities information. See the <Link href="/services/bim/scan-to-bim" className={lk("text-white")}>Scan to BIM service</Link> and the <Link href="/projects/bim/point-cloud-to-bim-existing-building" className={lk("text-white")}>point cloud project</Link>.</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><ScanFlow /></InView>
    </Char>
  );
}

export function HealthSection() {
  const cats = ["Model structure", "Family consistency", "Parameters", "Coordination", "View / sheet structure"];
  const flow = ["Inherited model", "Audit", "Targeted fixes", "Coordinated model"];
  return (
    <Paper id="health">
      <Head eyebrow="Model health" heading="When the Model Itself Needs Attention">
        <p>Model health checks are part of the deliverables: a review of how the model is built, not just how it looks. The categories below are illustrative — not company performance figures.</p>
      </Head>
      <InView threshold={0.1} className="mt-12">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{cats.map((c, i) => <li key={c} className="reveal border border-slate-300 bg-white p-4" style={delay(i * 70)}><span aria-hidden className="grid h-7 w-7 place-items-center border border-green-600 text-green-700">✓</span><p className="mt-3 text-sm font-semibold tracking-tight text-slate-900">{c}</p><p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Checked</p></li>)}</ul>
        <ol className="mt-6 flex flex-col gap-2 lg:flex-row lg:items-center">{flow.map((f, i) => <li key={f} className="reveal flex flex-1 items-center gap-2" style={delay(300 + i * 120)}><span className={"flex-1 border px-4 py-3 text-sm font-semibold " + (i === 3 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-900")}>{f}</span>{i < 3 ? <ArrowRight aria-hidden className="h-4 w-4 shrink-0 rotate-90 text-copper-500 lg:rotate-0" /> : null}</li>)}</ol>
      </InView>
    </Paper>
  );
}

export function HandoverSection({ service }: { service: Service }) {
  return (
    <Paper id="handover" tint>
      <Head eyebrow="Handover" heading="Plan the Model Handover Before Project Close-Out">
        <p>{H(service, "Planning for Model Handover", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you prepare a model specifically for facilities")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Handover /></InView>
    </Paper>
  );
}

export function DerivedSection() {
  return (
    <Paper id="drawings">
      <Head eyebrow="Model-derived drawings" heading="One Coordinated Model Can Support More Than the 3D View">
        <p>Floor plans, sections, elevations, schedules and drawing sheets come from the same coordinated model. See how an element connects to its drawing references.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><DerivedDrawings /></InView>
    </Paper>
  );
}

export function StatementSection() {
  const parts = ["Geometry", "Information", "Coordination", "Process"];
  return (
    <section id="statement" className="relative overflow-hidden border-t border-slate-800 bg-[#0B1220] py-24 sm:py-32">
      <Container className="relative">
        <InView threshold={0.25}>
          <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-sky-300">The principle</p>
          <h2 style={delay(100)} className="reveal mt-4 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">BIM is not just 3D geometry.</h2>
          <ol className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4" aria-label="Geometry plus information plus coordination plus process equals useful BIM">
            {parts.map((p, i) => (
              <li key={p} className="reveal flex items-center gap-3 sm:gap-4" style={delay(300 + i * 160)}>
                <span className="border border-sky-300/40 px-4 py-3 font-mono text-sm uppercase tracking-[0.14em] text-sky-100 sm:text-base">{p}</span>
                <span aria-hidden className="font-mono text-2xl text-copper-400">{i < 3 ? "+" : "="}</span>
              </li>
            ))}
            <li className="reveal bg-white px-5 py-3 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-slate-900 sm:text-base" style={delay(1000)}>Useful BIM</li>
          </ol>
        </InView>
      </Container>
    </section>
  );
}

const DEL: { t: string; d: string }[] = [
  { t: "Architectural BIM models", d: "Architectural modelling to the agreed project requirements." },
  { t: "Structural BIM models", d: "Structural modelling for coordinated project workflows." },
  { t: "MEP BIM models", d: "Mechanical, electrical and plumbing model coordination." },
  { t: "Revit models to agreed LOD", d: "Modelled to the stage the project needs." },
  { t: "Clash detection reports", d: "Prioritised coordination issues, not a raw list." },
  { t: "Custom Revit families", d: "Non-standard equipment and fittings that schedule correctly." },
  { t: "Scan-to-BIM", d: "Point cloud / laser scan conversion to a working model." },
  { t: "Coordinated federated models", d: "Combined multi-discipline coordination environment." },
  { t: "Model-derived drawing sheets", d: "Documentation generated from the coordinated model." },
  { t: "BIM execution plan input & model health checks", d: "Support for project BIM requirements and model review." },
];

export function DeliverablesSection() {
  return (
    <Paper id="deliverables" tint>
      <Reveal><SectionHeading eyebrow="Deliverables" heading="What You Get" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DEL.map((d, i) => (
          <li key={d.t} className="reveal" style={delay((i % 3) * 80)}>
            <div className="group h-full border border-slate-300 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900">
              <BimIcon k={i} className="h-11 w-11 text-blue-600 transition-transform duration-500 group-hover:scale-110" />
              <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">{d.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{d.d}</p>
            </div>
          </li>
        ))}
      </InView>
    </Paper>
  );
}

const APPS = ["Multi-disciplinary design coordination", "Construction documentation", "Existing building / structure documentation from scan data", "Renovation and retrofit projects", "Facilities and asset documentation", "Model auditing and rebuild for legacy projects"];

export function ApplicationsSection({ service }: { service: Service }) {
  return (
    <Paper id="applications">
      <Reveal><SectionHeading eyebrow="Applications" heading="Where BIM Modelling & Coordination Is Used" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {service.applications.map((a, i) => (
          <li key={a} className="reveal" style={delay((i % 3) * 80)}>
            <div className="group flex h-full gap-4 border border-slate-300 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900">
              <BimIcon k={[0, 8, 6, 3, 5, 9][i % 6]} className="h-10 w-10 shrink-0 text-blue-600" />
              <div><h3 className="text-base font-semibold leading-snug tracking-tight text-slate-900">{a}</h3><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{String(i + 1).padStart(2, "0")}</p></div>
            </div>
          </li>
        ))}
      </InView>
      <span className="sr-only">{APPS.join(", ")}</span>
    </Paper>
  );
}

export function WorkflowSection({ service }: { service: Service }) {
  return (
    <Paper id="workflow" tint>
      <Reveal><SectionHeading eyebrow="Workflow" heading="How It Works" /></Reveal>
      <div className="mt-12"><BimProcess steps={service.process} /></div>
    </Paper>
  );
}

export function SoftwareSection({ service }: { service: Service }) {
  const tiles = [
    { slug: "revit", name: "Revit", note: "Architectural, structural and MEP BIM modelling", art: <BimModel layers={ALL_LAYERS} labels={false} title="Revit model" className="block h-auto w-full" /> },
    { slug: "navisworks", name: "Navisworks", note: "Coordination and clash detection", art: <BimModel layers={ALL_LAYERS} clash="open" labels={false} title="Navisworks clash view" className="block h-auto w-full" /> },
    { slug: "tekla", name: "Tekla Structures", note: "Structural / BIM workflows", art: <BimModel layers={{ struct: true }} labels={false} title="Tekla structural model" className="block h-auto w-full" /> },
  ].filter((t) => service.software.includes(t.slug));
  return (
    <Char id="software">
      <Reveal><SectionHeading tone="dark" eyebrow="Software" heading="BIM Software We Use" /></Reveal>
      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {tiles.map((t, i) => (
          <li key={t.slug}>
            <Reveal delay={i * 80} className="h-full">
              <Link href={`/software/${t.slug}`} className="group flex h-full flex-col border border-slate-700 bg-slate-900/40 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/60">
                <div className="overflow-hidden"><div className="art-zoom">{t.art}</div></div>
                <div className="p-5"><h3 className="text-base font-semibold text-white">{t.name}</h3><p className="mt-1 text-xs uppercase tracking-[0.1em] text-slate-400">{t.note}</p></div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Char>
  );
}

const IND: Record<string, React.ReactNode> = {
  construction: <g stroke="#7DD3FC" strokeWidth="1.5" fill="none"><path d="M40 120V30h120v90M40 60h120M40 90h120M80 30v90M120 30v90" /><path d="M20 120h200" strokeWidth="2.4" /></g>,
  manufacturing: <g stroke="#7DD3FC" strokeWidth="1.5" fill="none"><rect x="30" y="60" width="90" height="60" /><circle cx="160" cy="90" r="22" /><path d="M60 60V30h20v30M20 120h200M120 90h18" /></g>,
  energy: <g stroke="#7DD3FC" strokeWidth="1.5" fill="none"><path d="M120 20v30M120 50l-12 -4M120 50l12 -4" /><circle cx="120" cy="66" r="14" /><path d="M120 80v40M50 100h140M50 100v20M190 100v20M20 120h200" /><rect x="40" y="86" width="20" height="14" /></g>,
  mining: <g stroke="#7DD3FC" strokeWidth="1.5" fill="none"><path d="M30 120l40 -60 30 30 30 -50 50 80" /><path d="M20 120h200M150 70V40h30v30" /><rect x="168" y="96" width="30" height="24" /></g>,
};

export function IndustriesSection({ service }: { service: Service }) {
  return (
    <Paper id="industries">
      <Reveal><SectionHeading eyebrow="Industries" heading="Industries We Support" /></Reveal>
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {service.industries.map((slug, i) => (
          <li key={slug}>
            <Reveal delay={i * 80} className="h-full">
              <Link href={`/industries/${slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-900">
                <div className="aspect-[8/5] overflow-hidden bg-[#0B1B33]"><svg viewBox="0 0 240 150" className="art-zoom h-full w-full p-3" role="img" aria-label={`${getIndustryBySlug(slug)?.name ?? slug} visual`}><title>{getIndustryBySlug(slug)?.name ?? slug}</title>{IND[slug]}</svg></div>
                <div className="p-4 sm:p-5"><h3 className="text-base font-semibold tracking-tight text-slate-900">{getIndustryBySlug(slug)?.name ?? slug}</h3></div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Paper>
  );
}

export function ProjectsSection() {
  const items = projects.filter((p) => p.discipline === "bim");
  if (items.length === 0) return null;
  return (
    <Char id="projects">
      <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading tone="dark" eyebrow="Portfolio" heading="Related BIM Projects" description="Illustrative examples, marked as such. They will give way to verified case studies as client work is cleared for publication." />
        <Link href="/projects/bim" className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-copper-400 hover:underline">All BIM projects →</Link>
      </Reveal>
      <InView as="ul" className="mt-12 grid gap-5 md:grid-cols-2">
        {items.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 90} className="h-full">
              <Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col overflow-hidden border border-slate-700 bg-slate-900/40 transition-colors duration-300 hover:border-sky-300/60">
                <div className="relative aspect-[16/9] overflow-hidden"><div className="art-zoom h-full w-full">{i === 0 ? <BimModel layers={ALL_LAYERS} clash="open" focus="BIM-001" labels={false} title="Illustrative multi-discipline clash detection view" className="block h-full w-full object-cover" /> : <BimModel layers={{ arch: true, struct: true }} mess={0} labels={false} title="Illustrative point-cloud-based existing building model" className="block h-full w-full object-cover" />}</div>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0B1220]/85 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-200">View project</p></div></div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3"><span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">{p.discipline}</span>{p.isPlaceholder ? <span className="border border-slate-500 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-300">Illustrative example</span> : null}</div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-white">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-300">{p.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors group-hover:text-copper-400">View project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </InView>
    </Char>
  );
}

export function RelatedSection() {
  const nodes = [
    { l: "Revit modelling", d: "Architectural, structural and MEP Revit modelling to the project's LOD.", href: "/services/bim/revit-modelling" },
    { l: "BIM coordination", d: "You are here.", you: true },
    { l: "Scan to BIM", d: "Point cloud and laser scan conversion into working Revit BIM models.", href: "/services/bim/scan-to-bim" },
    { l: "Structural drafting", d: "Structural drafting, steel detailing and shop drawings.", href: "/services/structural/structural-drafting" },
  ];
  return (
    <Paper id="related" tint>
      <Reveal><SectionHeading eyebrow="Related" heading="Connected BIM & Structural Services" /></Reveal>
      <InView className="mt-12"><ol className="grid gap-3 lg:grid-cols-4">
        {nodes.map((n, i) => (
          <li key={n.l} className="reveal relative" style={delay(i * 120)}>
            {n.href ? (
              <Link href={n.href} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><span className="flex items-center justify-between text-base font-semibold text-slate-900">{n.l}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span><span className="mt-1 text-sm text-slate-600">{n.d}</span></Link>
            ) : (
              <span className="flex h-full flex-col border border-slate-900 bg-slate-900 p-5 text-white"><span className="text-base font-semibold">{n.l}</span><span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">{n.d}</span></span>
            )}
            {i < 3 ? <span aria-hidden className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 bg-[#F1EFEA] font-mono text-copper-500 lg:block">↔</span> : null}
          </li>
        ))}
      </ol></InView>
    </Paper>
  );
}

export function BimCTA() {
  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-[#0B1220] py-20 sm:py-28">
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Coordinate the Model Before the Problem Reaches Site</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">Tell us what you need and our team can review the project requirements.</p>
          <div className="mt-9 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button><Button href="/services/bim" size="lg" variant="outline-light">Explore BIM Services</Button></div>
        </div>
        <CtaBim />
      </Container>
    </section>
  );
}

export { Panel };
