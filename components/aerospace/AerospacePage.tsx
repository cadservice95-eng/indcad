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
import { HeroViewer, FeatureFlow, Tolerancing, Fixture, ReverseEvidence, IntentSplit, TraceGraph, DrawInspect, DeliverableStack, CapMap, SoftwareLink } from "./AeroClient";

function Dark({ id, children, deep }: { id: string; children: React.ReactNode; deep?: boolean }) {
  return (
    <section id={id} className={cn("relative scroll-mt-20 overflow-hidden border-t border-slate-800 py-20 text-white sm:py-28", deep ? "bg-[#070A10]" : "bg-[#0A0E15]")}>
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-cyan-300/[0.035]"><defs><pattern id={`${id}-g`} width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill={`url(#${id}-g)`} /></svg>
      <Container className="relative">{children}</Container>
    </section>
  );
}
function Light({ id, tint, children }: { id: string; tint?: boolean; children: React.ReactNode }) {
  return <section id={id} className={cn("relative scroll-mt-20 border-t border-slate-200 py-20 sm:py-28", tint ? "bg-[#F1F4F8]" : "bg-white")}><Container>{children}</Container></section>;
}
function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      {children ? <div className={cn("space-y-4 text-base leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div> : null}
    </Reveal>
  );
}
const para = (i: Industry, h: string) => i.description.find((d) => d.heading?.startsWith(h))?.paragraphs ?? [];

const CATS: [string, string[]][] = [
  ["Precision & tolerancing", ["Can you work to tight", "Do you check that a specified tolerance", "Do you provide documentation review to catch tolerances", "Can you support first-article"]],
  ["Tooling & manufacturing", ["Can you produce tooling drawings", "Can you provide fixture documentation for CNC", "Do you draft assembly fixtures", "Can you support a component supplier scaling", "Do you provide documentation for aerospace composite"]],
  ["Reverse engineering", ["Do you support documentation for aerospace MRO", "Do you provide reverse engineering support where original tolerances"]],
  ["Documentation & quality systems", ["Do you provide traceability documentation", "Can you support an aerospace supplier's internal drawing audit", "Can you help a growing aerospace supplier establish", "Can you support a supplier consolidating", "Can you support a supplier working toward"]],
  ["Aerospace supply chain", ["Can you support both established", "Do you support precision component manufacturers new", "Can you help a supplier prepare documentation to meet an international", "Can you support a supplier managing documentation across multiple", "Do you provide drawing sets suitable for export control"]],
  ["Other aerospace work", ["Do you draft assembly documentation", "Can you document components across a full assembly", "Do you provide documentation for aerospace ground support", "Do you provide documentation for ground-based", "Can you support documentation for aerospace interior", "Can you help document a component family"]],
];
function groupFaqs(faqs: FAQItem[]) {
  const used = new Set<string>();
  const g = CATS.map(([cat, keys]) => ({ cat, items: keys.flatMap((k) => { const f = faqs.find((q) => q.question.startsWith(k) && !used.has(q.question)); if (f) used.add(f.question); return f ? [f] : []; }) }));
  const rest = faqs.filter((f) => !used.has(f.question));
  if (rest.length) g[5].items.push(...rest);
  return g.filter((x) => x.items.length);
}

const SW_ROLE: Record<string, string> = {
  solidworks: "Parametric part and assembly modelling, configuration-driven component families and drawings derived from the model.",
  inventor: "Parametric part and assembly modelling with manufacturing drawings, for teams standardised on the Autodesk ecosystem.",
  "fusion-360": "Parametric component modelling and manufacturing drawings, with design that connects into CAM workflows.",
};
const STEPS = [
  ["Project reference", "Drawings, models, physical parts, specifications or supplied documentation."],
  ["CAD development", "Create or reconstruct the 3D model."],
  ["Feature definition", "Identify functional geometry and important interfaces."],
  ["Drafting & tolerancing", "Produce manufacturing documentation."],
  ["Tooling documentation", "Develop fixture and tooling documentation where required."],
  ["Traceability review", "Connect critical features and tolerances to their documented basis."],
  ["Inspection coordination", "Check that requirements can be practically verified."],
  ["Final documentation", "Deliver the agreed CAD and drawing package."],
];
const TYPE_TXT = ["Custom CAD geometry for precision components and brackets.", "Documentation for repeatable positioning and machining support.", "Reconstructing undocumented components while distinguishing design intent from physical variation.", "Detailed drawings for precision-machined components.", "Tolerancing focused on functional features.", "Documentation supporting formal quality-system requirements."];

export function AerospacePage({ industry: i }: { industry: Industry }) {
  const svcs = i.services.flatMap((s) => { const v = getServiceBySlug(s); return v ? [v] : []; });
  const sw = i.software.flatMap((s) => { const v = getSoftwareBySlug(s); return v ? [{ slug: v.slug, name: v.name, category: v.category }] : []; });
  const projs = ["sheet-metal-enclosure-fabrication-drawings", "legacy-machine-part-reverse-engineering"].flatMap((s) => { const p = projects.find((x) => x.slug === s); return p ? [p] : []; });
  const [prec, tol, rev, trace, insp] = ["Precision", "Feature-Specific", "Reverse", "Traceability", "Coordinating"].map((h) => para(i, h));
  const req = i.documentationRequirements;

  return (
    <>
      <section className="relative overflow-hidden bg-[#0A0E15] pb-16 pt-14 text-white sm:pb-24 sm:pt-20">
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-cyan-300/[0.045]"><defs><pattern id="ae-hero-g" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#ae-hero-g)" /></svg>
        <Container className="relative grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300">Aerospace precision documentation</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{i.heroHeading}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">{i.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="/services/mechanical/3d-cad-modelling" size="lg" variant="outline-light">Explore 3D CAD Modelling</Button></div>
            <p className="mt-8 border-l-2 border-cyan-400 pl-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-slate-400">Precision feature → tolerance → tooling → reverse engineering → traceability → inspection</p>
          </div>
          <HeroViewer />
        </Container>
      </section>

      <Light id="precision">
        <Head eyebrow="Precision documentation" heading="Precision Documentation for a Concentrated Industry">{prec.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-12"><div className="bg-[#0A0E15] p-3 sm:p-4"><FeatureFlow /></div></Reveal>
      </Light>

      <Light id="tolerancing" tint>
        <Head eyebrow="Functional tolerancing" heading="Feature-Specific Tolerancing"><p>{tol[0]}</p></Head>
        <Reveal className="mt-12"><Tolerancing /></Reveal>
      </Light>

      <Dark id="tooling">
        <Head dark eyebrow="Tooling & fixtures" heading="Tooling Designed for Repeatable Location"><p>{tol[1]}</p><p>{req[2]}</p></Head>
        <Reveal className="mt-12"><div className="mx-auto max-w-[880px] overflow-hidden border border-slate-700"><Fixture /></div></Reveal>
      </Dark>

      <Dark id="reverse" deep>
        <Head dark eyebrow="Legacy components" heading="Reverse Engineering Legacy Aerospace Components"><p>{rev[0]}</p></Head>
        <Reveal className="mt-12"><ReverseEvidence /></Reveal>
      </Dark>

      <Dark id="intent">
        <Head dark eyebrow="Design intent" heading="Measured Geometry Is Not Always Original Design Intent"><p>A worn, repaired or variant sample is evidence, not the specification. The reconstruction is reviewed against whatever engineering evidence exists.</p></Head>
        <Reveal className="mt-12"><IntentSplit /></Reveal>
        <p className="mt-4 text-xs text-slate-400">Illustrative workflow — final reconstruction depends on available engineering evidence and project requirements.</p>
      </Dark>

      <Light id="traceability">
        <Head eyebrow="Traceability" heading="Traceability from Feature to Documentation"><p>{trace[0]}</p><p>{req[3]}</p></Head>
        <Reveal className="mt-12"><TraceGraph /></Reveal>
        <p className="mt-4 text-xs text-slate-500">Render CAD Hub produces documentation to support your quality system — it doesn&apos;t hold or grant aerospace certification.</p>
      </Light>

      <Light id="inspection" tint>
        <Head eyebrow="Drafting × inspection" heading="Design the Drawing Around What Can Be Verified">{insp.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-12"><DrawInspect /></Reveal>
      </Light>

      <Dark id="workflow" deep>
        <Head dark eyebrow="Workflow" heading="Aerospace Documentation Workflow" />
        <ol className="mt-12 grid gap-px border border-slate-700 bg-slate-700 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, d], k) => <li key={t}><Reveal delay={k * 70} className="h-full"><div className="h-full bg-[#0A0E15] p-5"><span className="font-mono text-[11px] text-cyan-300">{String(k + 1).padStart(2, "0")}</span><h3 className="mt-2 text-base font-semibold text-white">{t}</h3><p className="mt-1.5 text-sm leading-relaxed text-slate-400">{d}</p></div></Reveal></li>)}
        </ol>
      </Dark>

      <Light id="types">
        <Head eyebrow="Project types" heading="Typical Aerospace Project Types" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {i.useCases.map((u, k) => (
            <li key={u}><Reveal delay={k * 60} className="h-full"><div className="group h-full border border-slate-300 bg-white p-5 transition-colors hover:border-[#0A0E15]">
              <div className="flex items-center justify-between"><span className="font-mono text-[11px] text-slate-400">{String(k + 1).padStart(2, "0")}</span><span aria-hidden className="h-2 w-2 rounded-full bg-cyan-500 opacity-0 transition-opacity group-hover:opacity-100" /></div>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{u}</h3>
              <p className="mt-1.5 text-sm text-slate-600">{TYPE_TXT[k]}</p>
            </div></Reveal></li>
          ))}
        </ul>
      </Light>

      <Light id="deliverables" tint>
        <Head eyebrow="Deliverables" heading="Typical Deliverables" />
        <Reveal className="mt-12"><DeliverableStack items={i.deliverables} /></Reveal>
      </Light>

      <Light id="requirements">
        <Head eyebrow="Documentation requirements" heading="Documentation Built Around Project Requirements"><p>{req[0]}</p></Head>
        <ul className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {["Functional feature tolerancing", "Project-specific precision requirements", "Traceability basis", "Repeatable tooling documentation", "Manufacturing documentation", "Inspection coordination"].map((c, k) => <li key={c}><Reveal delay={k * 50}><div className="flex items-center gap-3 border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-slate-900"><Check className="h-4 w-4 shrink-0 text-blue-600" aria-hidden />{c}</div></Reveal></li>)}
        </ul>
        <p className="mt-4 border-l-2 border-cyan-500 pl-4 text-sm text-slate-600">Documentation support is developed according to the project information, specifications and requirements supplied by the client or responsible engineering team.</p>
      </Light>

      <Dark id="suppliers">
        <Head dark eyebrow="Supply chain context" heading="Documentation for Suppliers Entering Export Supply Chains"><p>{trace[1]}</p><p className="text-sm text-slate-400">{rev[1]}</p></Head>
        <Reveal className="mt-10"><ol className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.08em]">{["Component supplier", "Engineering documentation", "Manufacturing", "Inspection", "Customer supply chain"].map((s, k) => <li key={s} className="flex items-center gap-2">{k ? <span aria-hidden className="text-cyan-400">→</span> : null}<span className={cn("border px-3 py-2", k === 1 ? "border-cyan-400 bg-cyan-400/10 text-white" : "border-slate-600 text-slate-200")}>{s}</span></li>)}</ol></Reveal>
      </Dark>

      <Dark id="software" deep>
        <Head dark eyebrow="Software" heading="Software Used in This Industry" />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {sw.map((s, k) => <li key={s.slug}><Reveal delay={k * 80} className="h-full"><div className="flex h-full flex-col border border-slate-700 bg-[#0A0E15]"><PlatformVisual slug={s.slug} label={`${s.name}: illustrative component workflow`} /><div className="flex flex-1 flex-col p-5"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-300">{s.category}</p><h3 className="mt-1 text-lg font-semibold text-white">{s.name}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{SW_ROLE[s.slug]}</p><SoftwareLink slug={s.slug} name={s.name} /></div></div></Reveal></li>)}
        </ul>
      </Dark>

      <Dark id="capabilities">
        <Head dark eyebrow="Capability map" heading="Aerospace CAD Capability Map" />
        <Reveal className="mt-12"><CapMap /></Reveal>
      </Dark>

      <Light id="projects">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="Portfolio" heading="Illustrative Related Projects" description="Illustrative examples — not aerospace client projects." /><Link href="/projects" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">All projects →</Link></Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {projs.map((p, k) => (
            <li key={p.slug}><Reveal delay={k * 90} className="h-full"><Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-colors hover:border-slate-900">
              <div className="bg-[#0A0E15]"><PlatformVisual slug={k === 0 ? "solidworks" : "inventor"} label={`${p.title}: illustrative CAD visual`} /></div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-3"><span className="font-mono text-xs uppercase tracking-[0.16em] text-blue-700">{p.discipline}</span>{p.isPlaceholder ? <span className="border border-amber-500 bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] uppercase text-amber-800">Illustrative example</span> : null}</div>
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
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {svcs.map((s, k) => <li key={s.slug}><Reveal delay={k * 70} className="h-full"><Link href={`/services/${s.category}/${s.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><h3 className="flex items-center justify-between text-lg font-semibold text-slate-900">{s.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></h3><p className="mt-1.5 text-sm text-slate-600">{s.shortDescription}</p></Link></Reveal></li>)}
        </ul>
        <p className="mt-6 border-l-2 border-amber-500 pl-4 text-sm text-slate-600">CAD, drafting and documentation support only — engineering approval, certification and regulatory responsibility remain with your responsible engineering team and authorities.</p>
        <p className="mt-4 text-sm text-slate-600">See also: <Link href="/industries" className="font-medium text-slate-900 underline underline-offset-4">All industries</Link> · <Link href="/industries/defence" className="font-medium text-slate-900 underline underline-offset-4">Defence</Link> · <Link href="/industries/automotive" className="font-medium text-slate-900 underline underline-offset-4">Automotive</Link> · <Link href="/industries/manufacturing" className="font-medium text-slate-900 underline underline-offset-4">Manufacturing</Link></p>
      </Light>

      <section id="faq" className="border-t border-slate-200 bg-white py-20 sm:py-28">
        <JsonLd data={faqJsonLd(i.faqs)} />
        <Container>
          <Reveal><SectionHeading eyebrow="FAQs" heading="Frequently Asked Questions" /></Reveal>
          <div className="mt-10"><FaqBrowser groups={groupFaqs(i.faqs)} /></div>
        </Container>
      </section>

      <section className="border-t border-slate-800 bg-[#0A0E15] py-20 text-white sm:py-24">
        <Container className="grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Get a Quote for Your Aerospace Project</h2>
            <p className="mt-4 text-lg text-slate-300">Tell us what you need and our team can review the project requirements.</p>
            <div className="mt-8"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button></div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <svg aria-hidden viewBox="0 0 20 300" className="absolute left-4 top-0 h-full w-5"><path d="M10 10V290" stroke="#22D3EE" strokeWidth="1.5" className="rch-flow" /></svg>
            <ol className="relative space-y-3 pl-12 font-mono text-[11px] uppercase tracking-[0.1em]">{["Component", "CAD model", "Drawing", "Inspection reference", "Documentation package"].map((s, k, a) => <li key={s} className={cn("border px-4 py-2.5", k === a.length - 1 ? "border-cyan-400 bg-cyan-400/10 text-white" : "border-slate-600 text-slate-200")}>{s}</li>)}</ol>
          </div>
        </Container>
      </section>
    </>
  );
}
