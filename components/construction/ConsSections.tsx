import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Industry } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { projects } from "@/data/projects";
import { getServiceBySlug } from "@/data/services";
import { Paper, Char, Head, sentences } from "@/components/arch/ui";
import { PlanSvg } from "@/components/arch/Drawing";
import { BimModel, mono } from "@/components/bim/Model";
import { HeroCons, ProjectModel, CoordTabs, ClashVisual, HardSoft, ChangeRevision, DeliveryModels, Subcontractors, AsBuilt, Tower, SoftwareTabs, DocFlow, CtaCons } from "./ConsClient";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const D = (i: Industry, p: string, n = 0) => i.description.find((s) => s.heading?.startsWith(p))?.paragraphs[n] ?? "";
const faq = (i: Industry, start: string) => i.faqs.find((f) => f.question.startsWith(start))?.answer ?? "";

export function ConsHero({ i }: { i: Industry }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-[#0B1220]">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.06]"><defs><pattern id="ch2-g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#ch2-g)" /></svg>
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Industry · Construction</p>
            <h1 style={delay(100)} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">{i.heroHeading}</h1>
            <p style={delay(220)} className="reveal mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{i.heroDescription}</p>
            <div style={delay(340)} className="reveal mt-9 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#project-types" size="lg" variant="outline-light" arrow>Explore Construction Capabilities</Button></div>
            <p style={delay(460)} className="reveal mt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">Tender → coordination → construction → variations → as-built</p>
          </div>
          <div style={delay(300)} className="reveal min-w-0"><HeroCons /></div>
        </Container>
      </InView>
    </section>
  );
}

export function WhySection({ i }: { i: Industry }) {
  const docs = ["Architectural drawing sets", "Structural drawings", "Coordinated services models", "Shop drawings", "Subcontractor documentation", "As-built records"];
  return (
    <Paper id="why">
      <Head eyebrow="Documentation on site" heading="Why Documentation Matters on a Construction Site">
        <p>{D(i, "Why Documentation", 0)}</p>
        <p className="text-sm">{D(i, "Why Documentation", 1)}</p>
      </Head>
      <InView threshold={0.1} className="mt-12 grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div className="reveal border border-slate-300 bg-white p-3"><PlanSvg layers={{ dims: true, furniture: false, marks: false, tags: false }} title="A drawing with a dimension missing" className="block h-auto w-full" /><p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Drawing · a dimension is missing</p></div>
        <span aria-hidden className="text-center font-mono text-2xl text-copper-500 max-lg:rotate-90">→</span>
        <div className="reveal border border-slate-300 bg-white p-5" style={delay(150)}><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Site</p><ul className="mt-2 grid gap-1.5 text-sm text-slate-700">{docs.map((d) => <li key={d} className="border border-slate-200 px-3 py-1.5">{d}</li>)}</ul></div>
        <span aria-hidden className="text-center font-mono text-2xl text-copper-500 max-lg:rotate-90">→</span>
        <div className="reveal border border-orange-500 bg-orange-50 p-5 text-orange-950" style={delay(300)}><p className="font-mono text-[10px] uppercase tracking-[0.14em]">Problem</p><p className="mt-1 text-lg font-semibold">Site clarification required</p><p className="mt-2 text-sm">Errors or missing information can affect site work, programme, cost and subcontractor coordination.</p></div>
      </InView>
    </Paper>
  );
}

export function ModelSection() {
  return (
    <Char id="project-model">
      <Head dark eyebrow="Signature view" heading="One Project, Many Documents"><p>Pick a package — architectural, structural, MEP, steel, precast, shop drawings, tender or as-built — and see which part of the same building it describes.</p></Head>
      <InView threshold={0.08} className="mt-12"><ProjectModel /></InView>
    </Char>
  );
}

export function CapacitySection({ i }: { i: Industry }) {
  const stages: [string, number, string][] = [["Early design", 28, "Lower activity"], ["Tender", 72, "Rising demand"], ["Construction", 100, "Peak documentation"], ["Close-out", 62, "Close-out workload"]];
  return (
    <Paper id="capacity" tint>
      <Head eyebrow="Capacity" heading="Documentation Capacity That Scales With the Project">
        <p>{D(i, "Why Documentation", 1)}</p>
        <p className="text-sm">Demand spikes around tender, issue-for-construction and close-out. The bars show the idea only — they are not data.</p>
      </Head>
      <InView threshold={0.1} className="mt-12">
        <ol className="grid grid-cols-2 items-end gap-3 lg:grid-cols-4">{stages.map(([t, h, d], k) => (
          <li key={t} className="reveal" style={delay(k * 120)}>
            <div className="flex h-44 items-end border-b border-slate-400 bg-white px-4"><span className="block w-full bg-blue-600/80" style={{ height: `${h}%` }} /></div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{t}</p><p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">{d}</p>
          </li>
        ))}</ol>
      </InView>
    </Paper>
  );
}

export function ConsultantsSection({ i }: { i: Industry }) {
  const nodes = ["Architect", "Structural engineer", "MEP consultants", "Steel detailer", "Precast specialist", "Head contractor"];
  return (
    <Char id="consultants">
      <Head dark eyebrow="Consultants" heading="One Building. Multiple Consultants. One Coordinated Documentation Flow.">
        <p>{D(i, "Coordinating Multiple", 0)}</p>
        <p className="text-sm">{faq(i, "Can you coordinate structural, architectural")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12">
        <div className="relative mx-auto max-w-4xl">
          <svg viewBox="0 0 640 260" className="block h-auto w-full" fill="none" role="img" aria-label="Six project parties connected through a central coordination node"><title>Consultant coordination</title>
            {nodes.map((n, k) => { const x = 60 + k * 104; const y = k % 2 ? 30 : 230; return <g key={n}><path d={`M${x} ${y}C${x} 130 ${320} 130 ${320} 130`} stroke="#38BDF8" strokeWidth="1.4" strokeDasharray="4 6" className="rch-flow" style={delay(k * 150)} /><rect x={x - 48} y={y - 14} width="96" height="28" fill="#0B1B33" stroke="#38BDF8" strokeOpacity="0.7" /><text x={x} y={y + 4} textAnchor="middle" fontSize="9" fill="#E2E8F0" style={mono}>{n.toUpperCase()}</text></g>; })}
            <circle cx="320" cy="130" r="40" fill="#2563EB" fillOpacity="0.2" stroke="#60A5FA" strokeWidth="2" /><text x="320" y="127" textAnchor="middle" fontSize="10" fill="#fff" style={mono}>COORDI-</text><text x="320" y="140" textAnchor="middle" fontSize="10" fill="#fff" style={mono}>NATION</text>
          </svg>
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">Coordination is a deliverable in its own right, not a by-product of the other packages.</p>
      </InView>
    </Char>
  );
}

export function CoordSection() {
  return (
    <Char id="coordination">
      <Head dark eyebrow="Coordination as a deliverable" heading="Packages Meet at Interfaces"><p>Switch between packages to see what each has to coordinate with — and walk an issue from identification through review to updated documentation.</p></Head>
      <InView threshold={0.08} className="mt-12"><CoordTabs /></InView>
    </Char>
  );
}

export function ClashSection() {
  return (
    <Char id="clash">
      <Head dark eyebrow="Clash detection" heading="Find Coordination Problems Before They Reach the Site"><p>Multi-disciplinary BIM coordination catches issues on screen rather than on site. See <Link href="/services/bim/bim-services" className="font-semibold text-white underline underline-offset-4 hover:text-copper-400">BIM modelling &amp; coordination</Link>.</p></Head>
      <InView threshold={0.08} className="mt-12 space-y-10"><ClashVisual /><HardSoft /></InView>
    </Char>
  );
}

export function ChangeSection({ i }: { i: Industry }) {
  return (
    <Paper id="change">
      <Head eyebrow="Change" heading="Construction Doesn't Stop Changing When Drawings Are Issued">
        <p>{D(i, "Coordinating Multiple", 1)}</p>
        <p className="text-sm">{faq(i, "How do you handle design changes")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><ChangeRevision /></InView>
    </Paper>
  );
}

export function OutdatedSection() {
  return (
    <Paper id="outdated" tint>
      <Head eyebrow="Revision control" heading="Which Drawing Is Current?"><p>Two almost identical sheets, one changed area. On a live site, a crew working from the superseded sheet is a costly and avoidable mistake — so what is current has to be unmistakable.</p></Head>
      <InView threshold={0.1} className="mt-12 grid gap-4 md:grid-cols-2">
        {[["Current issue", 3, "Use current revision", "border-green-600"], ["Superseded", 0, "Do not build from", "border-slate-400"]].map(([t, rev, n, b], k) => (
          <div key={t as string} className={`reveal border bg-white ${b}`} style={delay(k * 120)}>
            <div className={"flex justify-between px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] " + (k ? "bg-slate-100 text-slate-500" : "bg-green-50 text-green-800")}><span>{t as string}</span><span>{n as string}</span></div>
            <div className={k ? "opacity-70 grayscale" : ""}><PlanSvg rev={rev as number} layers={{ marks: false, furniture: false }} title={`${t as string} drawing sheet`} className="block h-auto w-full" /></div>
          </div>
        ))}
      </InView>
    </Paper>
  );
}

export function DeliverySection({ i }: { i: Industry }) {
  return (
    <Paper id="delivery">
      <Head eyebrow="Delivery models" heading="Documentation Built Around the Project Delivery Model">
        <p>{D(i, "Delivery Models", 0)}</p>
        <p className="text-sm">{faq(i, "Do you support design-and-construct")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><DeliveryModels /></InView>
    </Paper>
  );
}

export function SubSection({ i }: { i: Industry }) {
  return (
    <Char id="subcontractors">
      <Head dark eyebrow="Specialist packages" heading="Separate Specialist Packages Still Need to Work as One Building">
        <p>{D(i, "Delivery Models", 1)}</p>
        <p className="text-sm">{faq(i, "Can you coordinate documentation across multiple subcontractor")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><Subcontractors /></InView>
    </Char>
  );
}

export function TenderSection({ i }: { i: Industry }) {
  const docs = ["Drawing set", "Schedules", "Details", "Specifications", "Revision status"];
  return (
    <Paper id="tender" tint>
      <Head eyebrow="Tender" heading="Tender Documentation Should Reduce Ambiguity">
        <p>{D(i, "As-Built Records", 1)}</p>
        <p className="text-sm">{faq(i, "Can you produce tender-stage drawings")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12 grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr]">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">{docs.map((d, k) => <li key={d} className="reveal flex items-center gap-3 border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900" style={delay(k * 80)}><span aria-hidden className="h-5 w-4 border border-slate-400 bg-slate-50" />{d}</li>)}</ul>
        <span aria-hidden className="text-center font-mono text-2xl text-copper-500 max-lg:rotate-90">→</span>
        <div className="space-y-2">{["Subcontractor A", "Subcontractor B", "Subcontractor C"].map((s, k) => <div key={s} className="reveal border border-slate-900 bg-slate-900 px-4 py-3 text-white" style={delay(300 + k * 100)}><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">{s} · quote</p><p className="text-sm">Scope read from the documents</p></div>)}<p className="text-xs text-slate-500">More complete documentation → clearer scope interpretation. No pricing outcome is promised.</p></div>
      </InView>
    </Paper>
  );
}

export function AsBuiltSection({ i }: { i: Industry }) {
  return (
    <Paper id="as-built">
      <Head eyebrow="Close-out" heading="The Project Doesn't End When Construction Ends">
        <p>{D(i, "As-Built Records", 0)}</p>
        <p className="text-sm">{faq(i, "Do you produce as-built documentation")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12 [&_.text-slate-300]:text-slate-600"><AsBuilt /></InView>
    </Paper>
  );
}

export function TowerSection({ i }: { i: Industry }) {
  return (
    <Paper id="tower" tint>
      <Head eyebrow="High-density residential" heading="Coordination Gets Harder as Buildings Repeat">
        <p>{D(i, "Coordination on High-Density", 0)}</p>
        <p className="text-sm">{faq(i, "Do you coordinate services risers")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Tower /></InView>
    </Paper>
  );
}

export function FlowSection() {
  return (
    <Char id="flow">
      <Head dark eyebrow="Project lifecycle" heading="From Design to As-Built: One Document Flow"><p>Design, discipline packages, coordination, shop drawings, subcontractor packages, construction, variations and as-built — scroll to follow the flow.</p></Head>
      <div className="mt-12"><DocFlow /></div>
    </Char>
  );
}

const TYPE_ICONS = ["▤", "⌗", "◫", "▣", "⟲", "△", "▦"];
export function TypesSection({ i }: { i: Industry }) {
  const d = ["Tender and build drawing sets.", "Shop and erection drawings.", "Multi-disciplinary coordination and clash detection.", "Project close-out documentation.", "Bring superseded drawings into a live project workflow.", "Manage documentation through construction.", "Steel, precast and services packages."];
  return (
    <Paper id="project-types">
      <Reveal><SectionHeading eyebrow="Project support" heading="Typical Construction Project Support" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{i.useCases.map((u, k) => <li key={u} className="reveal" style={delay((k % 4) * 70)}><div className="h-full border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><span aria-hidden className="grid h-9 w-9 place-items-center border border-blue-600 font-mono text-blue-700">{TYPE_ICONS[k % 7]}</span><h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-slate-900">{u}</h3><p className="mt-1 text-sm text-slate-600">{d[k]}</p></div></li>)}</InView>
    </Paper>
  );
}

export function DeliverablesSection({ i }: { i: Industry }) {
  return (
    <Paper id="deliverables" tint>
      <Reveal><SectionHeading eyebrow="Deliverables" heading="Typical Construction Deliverables" /></Reveal>
      <InView threshold={0.08} className="mt-12">
        <ul className="grid gap-x-6 gap-y-3 md:grid-cols-2">{i.deliverables.map((d, k) => (
          <li key={d} className="reveal relative" style={delay(k * 70)}>
            <div className="absolute inset-x-1.5 -bottom-1 h-full border border-slate-300 bg-white" aria-hidden /><div className="absolute inset-x-0.5 -bottom-0.5 h-full border border-slate-300 bg-slate-50" aria-hidden />
            <div className="relative flex items-center gap-4 border border-slate-400 bg-white px-4 py-4"><svg viewBox="0 0 24 32" className="h-8 w-6 shrink-0 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M3 2h13l5 5v23H3z" /><path d="M16 2v5h5M7 15h10M7 20h10M7 25h6" /></svg><span className="text-sm font-semibold text-slate-900">{d}</span></div>
          </li>
        ))}</ul>
      </InView>
    </Paper>
  );
}

export function RequirementsSection({ i }: { i: Industry }) {
  const lod = ["Early design", "Developed model", "Construction documentation", "Detailed coordination"];
  const blocks = [["Building certifier / project requirements", "Documentation alignment"], ["Indian Standards", "Discipline-specific reference"], ["Revision control", "Current · superseded"], ["Audit requirements", "Document history"]];
  return (
    <Paper id="requirements">
      <Head eyebrow="Standards" heading="Construction Documentation Has to Follow the Project's Rules">
        <ul className="space-y-2 text-sm">{i.documentationRequirements.map((r) => <li key={r} className="flex gap-3 border border-slate-300 bg-white px-4 py-3 text-slate-700"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-blue-600" />{r}</li>)}</ul>
      </Head>
      <InView threshold={0.1} className="mt-12 grid gap-5 lg:grid-cols-2">
        <ul className="grid gap-2 sm:grid-cols-2">{blocks.map(([t, d], k) => <li key={t} className="reveal border border-slate-300 bg-white p-4" style={delay(k * 80)}><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{d}</p><p className="mt-1 text-sm font-semibold text-slate-900">{t}</p></li>)}</ul>
        <div className="border border-slate-900 bg-slate-900 p-5 text-white"><p className="font-mono text-[11px] uppercase tracking-[0.14em] text-sky-300">Project LOD — agreed per project</p><ol className="mt-3 grid gap-px bg-slate-700 sm:grid-cols-4">{lod.map((l, k) => <li key={l} className="bg-slate-900 px-3 py-3 text-xs"><span className="font-mono text-[10px] text-slate-400">{k + 1}</span><span className="block font-semibold">{l}</span></li>)}</ol><p className="mt-3 text-xs text-slate-400">No LOD numbers are assumed — they come from the project&apos;s agreed requirements.</p></div>
      </InView>
    </Paper>
  );
}

export function SoftwareSection({ i }: { i: Industry }) {
  return (
    <Char id="software">
      <Reveal><SectionHeading tone="dark" eyebrow="Software" heading="Software Used in Construction Projects" /></Reveal>
      <InView threshold={0.1} className="mt-12"><SoftwareTabs avail={i.software} /></InView>
    </Char>
  );
}

const PS = [["warehouse-structural-steel-shop-drawings", "steel"], ["processing-plant-platform-structural-detailing", "plat"], ["residential-renovation-construction-drawings", "reno"]] as const;
export function ProjectsSection() {
  const items = PS.map(([s, a]) => ({ p: projects.find((p) => p.slug === s), a })).filter((x): x is { p: NonNullable<typeof x.p>; a: "steel" | "plat" | "reno" } => Boolean(x.p));
  return (
    <Char id="projects">
      <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading tone="dark" eyebrow="Portfolio" heading="Related Projects" description="Illustrative examples, marked as such. They will give way to verified case studies as client work is cleared for publication." /><Link href="/projects" className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-copper-400 hover:underline">All projects →</Link></Reveal>
      <InView as="ul" className="mt-12 grid gap-5 md:grid-cols-3">{items.map(({ p, a }, k) => (
        <li key={p.slug}><Reveal delay={k * 90} className="h-full"><Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col overflow-hidden border border-slate-700 bg-slate-900/40 transition-colors duration-300 hover:border-sky-300/60">
          <div className="overflow-hidden bg-white"><div className="art-zoom">{a === "reno" ? <PlanSvg rev={3} layers={{ marks: false, grid: false }} title={`${p.title}: illustrative plan`} className="block h-auto w-full" /> : <BimModel layers={{ struct: true }} steel={a === "steel"} labels={false} title={`${p.title}: illustrative frame`} className="block h-auto w-full" />}</div></div>
          <div className="flex flex-1 flex-col p-5"><div className="flex items-center gap-3"><span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">{p.discipline}</span>{p.isPlaceholder ? <span className="border border-slate-500 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-300">Illustrative example</span> : null}</div><h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-white">{p.title}</h3><p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-300">{p.summary}</p><span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors group-hover:text-copper-400">View project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span></div>
        </Link></Reveal></li>
      ))}</InView>
    </Char>
  );
}

export function RelatedSection({ i }: { i: Industry }) {
  const svcs = i.services.map((s) => getServiceBySlug(s)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  return (
    <Paper id="related" tint>
      <Reveal><SectionHeading eyebrow="Related services" heading="The Construction Documentation Ecosystem" /></Reveal>
      <InView className="mt-12"><ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{svcs.map((s, k) => <li key={s.slug} className="reveal" style={delay(k * 90)}><Link href={`/services/${s.category}/${s.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><span className="flex items-center justify-between text-base font-semibold text-slate-900">{s.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span><span className="mt-1 text-sm text-slate-600">{s.shortDescription}</span></Link></li>)}</ul></InView>
    </Paper>
  );
}

export function ConsCTA() {
  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-[#0B1220] py-20 sm:py-28">
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Get Construction Documentation Support</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">Tell us what you need and our team can review the project requirements.</p>
          <div className="mt-9 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button><Button href="/contact" size="lg" variant="outline-light">Discuss Your Project</Button></div>
        </div>
        <CtaCons />
      </Container>
    </section>
  );
}

export { sentences };
