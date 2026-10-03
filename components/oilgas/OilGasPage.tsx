import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { Industry, FAQItem } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/jsonld";
import { cn } from "@/lib/utils";
import { getServiceBySlug } from "@/data/services";
import { getSoftwareBySlug } from "@/data/software";
import { projects } from "@/data/projects";
import { FaqBrowser } from "@/components/automotive/AutoClient";
import { PlatformVisual } from "@/components/software-hub/visuals";
import { HeroPlant, Lifecycle, IsoTriad, Disciplines, PipeRack, Archive, Brownfield, ValueChain, TightUnit, Lineage, Revisions, Expansion, DeliverableStack, Glyph } from "./OGClient";

function Dark({ id, children, deep }: { id: string; children: React.ReactNode; deep?: boolean }) {
  return (
    <section id={id} className={cn("relative scroll-mt-20 overflow-hidden border-t border-slate-800 py-20 text-white sm:py-28", deep ? "bg-[#080D0F]" : "bg-[#0B1215]")}>
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-emerald-300/[0.035]"><defs><pattern id={`${id}-g`} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill={`url(#${id}-g)`} /></svg>
      <Container className="relative">{children}</Container>
    </section>
  );
}
function Light({ id, tint, children }: { id: string; tint?: boolean; children: React.ReactNode }) {
  return <section id={id} className={cn("relative scroll-mt-20 border-t border-slate-200 py-20 sm:py-28", tint ? "bg-[#EEF1EE]" : "bg-[#F7F8F6]")}><Container>{children}</Container></section>;
}
function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      {children ? <div className={cn("space-y-4 text-base leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div> : null}
    </Reveal>
  );
}
function Chain({ steps, dark }: { steps: string[]; dark?: boolean }) {
  return <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em]">{steps.map((s, i) => <li key={s} className="flex items-center gap-2">{i ? <span aria-hidden className={dark ? "text-emerald-400" : "text-emerald-700"}>→</span> : null}<span className={cn("border px-3 py-2", i === steps.length - 1 ? (dark ? "border-emerald-400 bg-emerald-400/10 text-white" : "border-emerald-700 bg-emerald-50 text-slate-900") : dark ? "border-slate-600 text-slate-200" : "border-slate-300 bg-white text-slate-700")}>{s}</span></li>)}</ol>;
}
const para = (i: Industry, h: string) => i.description.find((d) => d.heading?.startsWith(h))?.paragraphs ?? [];

const CATS: [string, string[]][] = [
  ["Piping & isometrics", ["Do you produce piping isometrics", "How do you keep isometrics consistent", "Can you reconcile a plant's piping isometrics", "Can you produce piping support and hanger", "Do you draft cable and instrumentation"]],
  ["Facilities & plant types", ["Do you support upstream, midstream", "Do you support documentation for onshore", "Can you support documentation for a gas processing", "Do you provide documentation for tank farm", "Can you support documentation for a pipeline right-of-way", "Do you provide documentation for skid-mounted", "Do you provide civil drafting for pipeline crossing"]],
  ["Brownfield & existing facilities", ["Can you convert legacy facility drawings", "Can you help reconcile a facility's plant model", "Can you support documentation for a facility expansion", "Can you support drafting for a facility decommissioning"]],
  ["Structural & mechanical", ["Can you produce structural documentation for pipe rack", "Do you provide structural documentation for pipe bridges", "Do you draft supports and structural steel for elevated", "Do you provide structural documentation for flare", "Do you provide mechanical equipment documentation for pressure", "Can you support documentation for a compressor", "Do you provide fire and safety system", "Can you support documentation in the tightly packed"]],
  ["Project delivery", ["Do you support turnaround", "Can you support an EPC contractor's drafting overflow", "Can you support a facility's documentation needs across", "Can you work to project-specific drawing standards"]],
];
function groupFaqs(faqs: FAQItem[]) {
  const used = new Set<string>();
  const g = CATS.map(([cat, keys]) => ({ cat, items: keys.flatMap((k) => { const f = faqs.find((q) => q.question.startsWith(k) && !used.has(q.question)); if (f) used.add(f.question); return f ? [f] : []; }) }));
  const rest = faqs.filter((f) => !used.has(f.question));
  if (rest.length) g[4].items.push(...rest);
  return g.filter((x) => x.items.length);
}
const SW_ROLE: Record<string, string> = {
  autocad: "2D CAD drafting and documentation — plans, isometric drawings and legacy drawing conversion.",
  solidworks: "Mechanical equipment and component modelling, with drawings derived from the model.",
  tekla: "Structural steel modelling and detailing — pipe racks, platforms and supports with shop and fabrication drawings.",
};

export function OilGasPage({ industry: i }: { industry: Industry }) {
  const svcs = i.services.flatMap((s) => { const v = getServiceBySlug(s); return v ? [v] : []; });
  const sw = i.software.flatMap((s) => { const v = getSoftwareBySlug(s); return v ? [{ slug: v.slug, name: v.name, category: v.category }] : []; });
  const projs = ["sheet-metal-enclosure-fabrication-drawings", "legacy-machine-part-reverse-engineering", "warehouse-structural-steel-shop-drawings"].flatMap((s) => { const p = projects.find((x) => x.slug === s); return p ? [p] : []; });
  const [life, iso, legacy, trace, exp] = ["Documentation Across", "Isometric", "Legacy", "Traceability", "Facility Expansion"].map((h) => para(i, h));
  const req = i.documentationRequirements;

  return (
    <>
      <section className="relative overflow-hidden bg-[#0B1215] pb-16 pt-14 text-white sm:pb-24 sm:pt-20">
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-emerald-300/[0.045]"><defs><pattern id="og-hero-g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#og-hero-g)" /></svg>
        <Container className="relative grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-300">Plant documentation &amp; coordination</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{i.heroHeading}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">{i.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="/services" size="lg" variant="outline-light">Explore Engineering Services</Button></div>
            <p className="mt-8 border-l-2 border-emerald-400 pl-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-slate-400">Piping ↔ isometrics ↔ line list ↔ equipment ↔ steel ↔ plant model ↔ revisions ↔ as-built</p>
          </div>
          <HeroPlant />
        </Container>
      </section>

      <Dark id="lifecycle" deep>
        <Head dark eyebrow="Facility lifecycle" heading="Documentation Across a Facility's Operating Life">{life.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-12"><Lifecycle /></Reveal>
      </Dark>

      <Light id="isometrics">
        <Head eyebrow="Piping documentation" heading="Isometric Consistency Is Part of the Deliverable"><p>{iso[0]}</p><p className="text-sm">Piping documentation sits within our <Link href="/services/mechanical/mechanical-drafting" className="font-medium text-slate-900 underline underline-offset-4">mechanical drafting</Link> and <Link href="/services/engineering-design/engineering-design" className="font-medium text-slate-900 underline underline-offset-4">engineering design</Link> services.</p></Head>
        <Reveal className="mt-12"><IsoTriad /></Reveal>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500">One piping system — multiple coordinated documentation views</p>
      </Light>

      <Dark id="disciplines">
        <Head dark eyebrow="Plant coordination" heading="One Plant. Multiple Engineering Disciplines."><p>{req[1]}</p></Head>
        <Reveal className="mt-12"><Disciplines /></Reveal>
      </Dark>

      <Dark id="structural" deep>
        <Head dark eyebrow="Structural steel" heading="Structural Detailing Inside a Process Environment"><p>{iso[1]}</p><p className="text-sm text-slate-400">See <Link href="/services/structural/structural-drafting" className="text-white underline underline-offset-4">structural drafting</Link>.</p></Head>
        <Reveal className="mt-12"><PipeRack /></Reveal>
      </Dark>

      <Light id="archives" tint>
        <Head eyebrow="Legacy archives" heading="When the Plant Has Decades of Drawings"><p>{legacy[0]}</p><p className="text-sm">Digitising and consolidating archives is covered by <Link href="/services/cad-conversion/cad-conversion" className="font-medium text-slate-900 underline underline-offset-4">CAD conversion</Link>.</p></Head>
        <Reveal className="mt-12"><Archive /></Reveal>
      </Light>

      <Dark id="brownfield">
        <Head dark eyebrow="Existing facilities" heading="Existing Conditions Before New Design">{exp.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-12"><Brownfield /></Reveal>
        <Reveal className="mt-10"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Brownfield documentation story — conceptual</p><div className="mt-3"><Chain dark steps={["Existing drawings + current plant information", "Reconciliation", "Updated CAD / plant model", "Modification documentation", "As-built record"]} /></div></Reveal>
      </Dark>

      <Dark id="value-chain" deep>
        <Head dark eyebrow="Value chain" heading="Documentation Across the Oil & Gas Value Chain"><p>{legacy[1]}</p></Head>
        <Reveal className="mt-12"><ValueChain /></Reveal>
      </Dark>

      <Dark id="tight">
        <Head dark eyebrow="Dimensional sensitivity" heading="Documentation for Tightly Packed Process Units"><p>{trace[1]}</p></Head>
        <Reveal className="mt-12"><TightUnit /></Reveal>
      </Dark>

      <Dark id="traceability" deep>
        <Head dark eyebrow="Traceability" heading="Documentation That Survives the Project Team"><p>{trace[0]}</p></Head>
        <Reveal className="mt-12"><Lineage /></Reveal>
      </Dark>

      <Light id="revisions">
        <Head eyebrow="Revision control" heading="Revision Control Across a Living Facility"><p>{req[0]}</p></Head>
        <Reveal className="mt-12"><Revisions /></Reveal>
      </Light>

      <Dark id="expansion">
        <Head dark eyebrow="Expansion & modification" heading="Supporting Facility Expansion and Modification"><p>Understanding existing conditions comes first — then new equipment, modified piping and additional steel are documented against the facility as it actually stands.</p></Head>
        <Reveal className="mt-12"><Expansion /></Reveal>
      </Dark>

      <Light id="types">
        <Head eyebrow="Project types" heading="Typical Project Types" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {i.useCases.map((u, k) => <li key={u} className={k === 6 ? "sm:col-span-2" : undefined}><Reveal delay={k * 50} className="h-full"><div className="group h-full overflow-hidden border border-slate-300 bg-white transition-colors hover:border-slate-900"><div className="transition-transform duration-500 group-hover:scale-[1.03]"><Glyph k={k} /></div><div className="p-4"><span className="font-mono text-[10px] text-slate-400">{String(k + 1).padStart(2, "0")}</span><h3 className="mt-1 text-base font-semibold text-slate-900">{u}</h3></div></div></Reveal></li>)}
        </ul>
      </Light>

      <Light id="deliverables" tint>
        <Head eyebrow="Deliverables" heading="Typical Deliverables" />
        <Reveal className="mt-12"><DeliverableStack items={i.deliverables} /></Reveal>
      </Light>

      <Light id="requirements">
        <Head eyebrow="Documentation requirements" heading="Built Around Your Project Documentation Standard"><p>{req[2]}</p><p>{req[3]}</p></Head>
        <ul className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {["Project drawing standard", "Revision control", "Plant model coordination", "Piping consistency", "Line list cross-check", "Long-term document usability"].map((c, k) => <li key={c}><Reveal delay={k * 50}><div className="flex items-center gap-3 border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-slate-900"><Check className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />{c}</div></Reveal></li>)}
        </ul>
        <p className="mt-4 text-xs text-slate-500">We follow the standard supplied for your project — no universal compliance with any particular EPC standard is implied.</p>
      </Light>

      <Dark id="software" deep>
        <Head dark eyebrow="Software" heading="Software Used in This Industry" />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {sw.map((s, k) => <li key={s.slug}><Reveal delay={k * 80} className="h-full"><div className="flex h-full flex-col border border-slate-700 bg-[#0B1215]"><PlatformVisual slug={s.slug} label={`${s.name}: illustrative documentation workflow`} /><div className="flex flex-1 flex-col p-5"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300">{s.category}</p><h3 className="mt-1 text-lg font-semibold text-white">{s.name}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{SW_ROLE[s.slug]}</p><Link href={`/software/${s.slug}`} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-white underline-offset-4 hover:text-emerald-300 hover:underline">Explore {s.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link></div></div></Reveal></li>)}
        </ul>
      </Dark>

      <Light id="projects">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="Portfolio" heading="Illustrative Related Projects" description="Illustrative examples — not oil & gas client projects." /><Link href="/projects" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">All projects →</Link></Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {projs.map((p, k) => (
            <li key={p.slug}><Reveal delay={k * 90} className="h-full"><Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-colors hover:border-slate-900">
              <Glyph k={[2, 4, 1][k]} />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-3"><span className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-800">{p.discipline}</span>{p.isPlaceholder ? <span className="border border-amber-500 bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] uppercase text-amber-800">Illustrative example</span> : null}</div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{p.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900">View project <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span>
              </div>
            </Link></Reveal></li>
          ))}
        </ul>
      </Light>

      <Light id="related" tint>
        <Head eyebrow="Related services" heading="Related CAD & Engineering Services" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {svcs.map((s, k) => <li key={s.slug}><Reveal delay={k * 60} className="h-full"><Link href={`/services/${s.category}/${s.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><h3 className="flex items-center justify-between text-base font-semibold text-slate-900">{s.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></h3><p className="mt-1.5 text-sm text-slate-600">{s.shortDescription}</p></Link></Reveal></li>)}
        </ul>
        <p className="mt-6 border-l-2 border-amber-500 pl-4 text-sm text-slate-600">CAD, drafting, modelling and documentation support — process engineering, pressure-system approval, safety certification and regulatory sign-off remain with the responsible engineering team and authorities.</p>
        <p className="mt-4 text-sm text-slate-600">See also: <Link href="/industries" className="font-medium text-slate-900 underline underline-offset-4">All industries</Link> · <Link href="/services" className="font-medium text-slate-900 underline underline-offset-4">All services</Link> · <Link href="/services/bim/bim-services" className="font-medium text-slate-900 underline underline-offset-4">BIM coordination</Link></p>
      </Light>

      <section id="faq" className="border-t border-slate-200 bg-white py-20 sm:py-28">
        <JsonLd data={faqJsonLd(i.faqs)} />
        <Container>
          <Reveal><SectionHeading eyebrow="FAQs" heading="Frequently Asked Questions" /></Reveal>
          <div className="mt-10"><FaqBrowser groups={groupFaqs(i.faqs)} /></div>
        </Container>
      </section>

      <section className="border-t border-slate-800 bg-[#0B1215] py-20 text-white sm:py-24">
        <Container className="grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Get a Quote for Your Oil &amp; Gas Project</h2>
            <p className="mt-4 text-lg text-slate-300">Tell us what you need and our team can review the project requirements.</p>
            <div className="mt-8"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button></div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <svg aria-hidden viewBox="0 0 20 400" className="absolute left-4 top-0 h-full w-5"><path d="M10 10V390" stroke="#34D399" strokeWidth="1.5" className="rch-flow" /></svg>
            <ol className="relative space-y-2.5 pl-12 font-mono text-[11px] uppercase tracking-[0.1em]">{["Plant", "Piping", "Equipment", "Structure", "Documentation", "As-built", "Future modification"].map((s, k, a) => <li key={s} className={cn("border px-4 py-2.5", k === a.length - 1 ? "border-emerald-400 bg-emerald-400/10 text-white" : "border-slate-600 text-slate-200")}>{s}</li>)}</ol>
          </div>
        </Container>
      </section>
    </>
  );
}
