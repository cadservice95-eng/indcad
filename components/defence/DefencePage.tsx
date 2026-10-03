import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
import { HeroViewer, Archive, Reproduce, Traceability, ConfidenceMap, ProjectTypes, Package, TraceMatrix, SoftwareSwitch } from "./DefClient";
import { Part, TraceDrawing, C } from "./DefModel";

/* ───────── shells: archive navy + drawing-office paper ───────── */
function Dark({ id, children, deep }: { id: string; children: React.ReactNode; deep?: boolean }) {
  return (
    <section id={id} className={cn("relative scroll-mt-20 overflow-hidden border-t border-slate-800 py-20 text-white sm:py-28", deep ? "bg-[#07111F]" : "bg-[#0B1728]")}>
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.04]"><defs><pattern id={`${id}-g`} width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill={`url(#${id}-g)`} /></svg>
      <Container className="relative">{children}</Container>
    </section>
  );
}
function Light({ id, tint, children }: { id: string; tint?: boolean; children: React.ReactNode }) {
  return <section id={id} className={cn("relative scroll-mt-20 border-t border-slate-200 py-20 sm:py-28", tint ? "bg-[#EEF1F5]" : "bg-[#F8FAFC]")}><Container>{children}</Container></section>;
}
function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      {children ? <div className={cn("space-y-4 text-base leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div> : null}
    </Reveal>
  );
}
function Chain({ steps, dark, vertical, hi }: { steps: string[]; dark?: boolean; vertical?: boolean; hi?: number[] }) {
  return (
    <ol className={cn("font-mono text-[11px] uppercase tracking-[0.08em]", vertical ? "space-y-0" : "flex flex-wrap items-center gap-2")}>
      {steps.map((s, i) => {
        const on = hi ? hi.includes(i) : i === steps.length - 1;
        const box = cn("border px-3 py-2", on ? (dark ? "border-sky-400 bg-sky-400/10 text-white" : "border-[#1D4ED8] bg-blue-50 text-slate-900") : dark ? "border-slate-600 text-slate-200" : "border-slate-300 bg-white text-slate-700");
        return vertical ? (
          <li key={s}><div className={box}>{s}</div>{i < steps.length - 1 ? <span aria-hidden className={cn("block py-0.5 pl-4", dark ? "text-sky-400" : "text-blue-600")}>↓</span> : null}</li>
        ) : (
          <li key={s} className="flex items-center gap-2">{i ? <span aria-hidden className={dark ? "text-sky-400" : "text-blue-600"}>→</span> : null}<span className={box}>{s}</span></li>
        );
      })}
    </ol>
  );
}
const para = (i: Industry, h: string) => i.description.find((d) => d.heading?.startsWith(h))?.paragraphs ?? [];

const CATS: [string, string[]][] = [
  ["Reverse engineering", ["Can you reverse-engineer legacy equipment", "Can you support a structured, multi-part", "Do you provide reverse engineering support for defence equipment with mixed", "Can you reverse-engineer a component made from a material", "Can you support a sustainment programme covering a whole family"]],
  ["Traceability", ["Do you provide documentation review to identify gaps", "Do you provide documentation audits", "Do you produce documentation clear enough", "Can you support a defence supplier's internal configuration", "Can you support a defence supplier's transition to a formal"]],
  ["Information handling", ["How do you handle sensitive", "What should be confirmed before"]],
  ["Sustainment", ["Do you redesign parts", "Do you provide documentation for defence-related vehicle", "Do you provide documentation for defence equipment upgrades", "Do you produce assembly documentation", "Can you support urgent"]],
  ["Manufacturing & suppliers", ["Can you document fixture and tooling", "Can you support fixture documentation for a defence manufacturing quality", "Do you support domestic defence manufacturing suppliers", "Can you work with defence primes", "Can you support a defence supplier managing multiple", "Can you help a defence-adjacent manufacturer scale", "Can you support a defence manufacturer transitioning from paper", "Do you provide mechanical drafting for defence-related test"]],
  ["Structural", ["Do you provide structural documentation for defence facility", "Do you provide structural documentation for defence storage"]],
];
function groupFaqs(faqs: FAQItem[]) {
  const used = new Set<string>();
  const g = CATS.map(([cat, keys]) => ({ cat, items: keys.flatMap((k) => { const f = faqs.find((q) => q.question.startsWith(k) && !used.has(q.question)); if (f) used.add(f.question); return f ? [f] : []; }) }));
  const rest = faqs.filter((f) => !used.has(f.question));
  if (rest.length) g[4].items.push(...rest);
  return g.filter((x) => x.items.length);
}

const TYPES = [
  { short: "Legacy reverse engineering", flow: ["Physical part", "Reference", "Interpretation", "CAD", "Drawing"] },
  { short: "Sustainment documentation", flow: ["Existing part", "Documentation", "Manufacturing drawing", "Spare / sustainment workflow"] },
  { short: "Fixture / tooling", flow: ["Fixture", "Components", "Assembly", "Drawing"] },
  { short: "Structural facilities", flow: ["Existing structural record", "Site condition", "Structural drawings", "Upgrade documentation"] },
  { short: "Traceability", flow: ["Dimension", "Basis", "Source marker", "Traceability note"] },
  { short: "Supplier documentation", flow: ["Customer requirement", "Supplier input", "CAD / drafting", "Manufacturing documentation"] },
];
const FILES = ["3D_MODEL + ENGINEERING_DRAWING", "FABRICATION_DRAWING", "FIXTURE_DOCUMENTATION", "STRUCTURAL_DRAWING", "TRACEABILITY_NOTES"];
const SW: Record<string, { workflow: string; output: string }> = {
  solidworks: { workflow: "3D reconstruction", output: "Part model + drawing" },
  inventor: { workflow: "Assembly documentation", output: "Assembly + engineering drawing" },
  autocad: { workflow: "2D documentation", output: "Engineering drawing" },
};

/** Static capability map — lines draw in when scrolled into view. */
function CapabilityMap() {
  const spine = ["LEGACY EQUIPMENT", "REVERSE ENGINEERING", "TRACEABILITY", "CAD / DRAWINGS"];
  const branches = ["FIXTURES / TOOLING", "SPARES DOCUMENTATION", "STRUCTURAL DOCUMENTATION", "SUPPLIER SUPPORT"];
  return (
    <>
      <svg viewBox="0 0 760 420" className="mx-auto hidden h-auto w-full max-w-[880px] md:block" role="img" aria-label="Defence sustainment capability map: legacy equipment to reverse engineering to traceability to CAD and drawings, branching to fixtures and tooling, spares documentation, structural documentation and supplier support">
        <title>Defence sustainment capability map</title>
        <rect x="40" y="16" width="220" height="36" fill={C.raise} stroke={C.sky} strokeWidth="1.6" /><text x="150" y="39" textAnchor="middle" fontSize="12" fill="#fff" style={{ fontFamily: "var(--font-mono)" }}>DEFENCE SUSTAINMENT</text>
        {spine.map((s, i) => { const y = 92 + i * 80; return (
          <g key={s}>
            <path d={`M150 ${y - 40}V${y - 14}`} pathLength={1} className="draw" style={{ "--d": `${i * 250}ms`, "--t": ".6s" } as React.CSSProperties} stroke={C.sky} strokeWidth="1.6" />
            <rect x="50" y={y - 14} width="200" height="30" fill={C.panel} stroke={i === 2 ? C.amber : "#334155"} /><text x="150" y={y + 6} textAnchor="middle" fontSize="11" fill={i === 2 ? "#FDE68A" : "#E5E7EB"} style={{ fontFamily: "var(--font-mono)" }}>{s}</text>
          </g>
        ); })}
        {branches.map((b, i) => { const y = 120 + i * 70; return (
          <g key={b}>
            <path d={`M250 332C380 332 360 ${y} 470 ${y}`} pathLength={1} fill="none" className="draw" style={{ "--d": `${1100 + i * 200}ms`, "--t": ".8s" } as React.CSSProperties} stroke={C.sky} strokeWidth="1.4" />
            <rect x="470" y={y - 15} width="250" height="30" fill={C.panel} stroke={C.sky} strokeOpacity="0.6" /><text x="595" y={y + 5} textAnchor="middle" fontSize="11" fill="#E5E7EB" style={{ fontFamily: "var(--font-mono)" }}>{b}</text>
          </g>
        ); })}
      </svg>
      <div className="md:hidden"><Chain dark vertical steps={["Defence sustainment", ...spine.map((s) => s.toLowerCase()), ...branches.map((b) => `→ ${b.toLowerCase()}`)]} hi={[0]} /></div>
    </>
  );
}

export function DefencePage({ industry: i }: { industry: Industry }) {
  const svcs = i.services.flatMap((s) => { const v = getServiceBySlug(s); return v ? [v] : []; });
  const sw = i.software.flatMap((s) => { const v = getSoftwareBySlug(s); return v ? [{ slug: v.slug, name: v.name, category: v.category, ...SW[v.slug] }] : []; });
  const projs = ["sheet-metal-enclosure-fabrication-drawings", "legacy-machine-part-reverse-engineering", "warehouse-structural-steel-shop-drawings"].flatMap((s) => { const p = projects.find((x) => x.slug === s); return p ? [p] : []; });
  const [legacy, repro, rev, sec, inst] = ["Legacy", "Reproducing", "Reverse", "Information", "Documentation That"].map((h) => para(i, h));
  const req = i.documentationRequirements;
  const faqs: FAQItem[] = [...i.faqs, { question: "What should be confirmed before restricted material is shared?", answer: req[0] }];
  const types = TYPES.map((t, k) => ({ ...t, title: i.useCases[k] ?? t.short }));

  return (
    <>
      <section className="relative overflow-hidden bg-[#07111F] pb-16 pt-14 text-white sm:pb-24 sm:pt-20">
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.05]"><defs><pattern id="df-hero-g" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#df-hero-g)" /></svg>
        <Container className="relative grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sky-300">Defence engineering documentation</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{i.heroHeading}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">{i.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#legacy" size="lg" variant="outline-light">Explore Sustainment Capabilities</Button></div>
            <p className="mt-8 border-l-2 border-sky-400 pl-4 text-sm leading-relaxed text-slate-300">Document what exists. Preserve what matters. Make the record usable again.</p>
          </div>
          <HeroViewer />
        </Container>
      </section>

      <Light id="legacy">
        <Head eyebrow="Legacy equipment" heading="Legacy Equipment and Strict Traceability">{legacy.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-12"><Archive /></Reveal>
      </Light>

      <Dark id="reproduce" deep>
        <Head dark eyebrow="Sustainment ≠ new design" heading="Reproducing, Not Improving On, a Qualified Part"><p>{repro[0]}</p></Head>
        <Reveal className="mt-12"><Reproduce /></Reveal>
      </Dark>

      <Light id="traceability" tint>
        <Head eyebrow="Traceability" heading="Every Dimension Needs a Basis"><p>{repro[1]}</p></Head>
        <Reveal className="mt-8"><ul className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.1em]">{[["Measured", "#0284C7"], ["Specified", "#16A34A"], ["Inferred", "#B7862F"], ["Review", "#DC2626"]].map(([l, c]) => <li key={l} className="flex items-center gap-2 border border-slate-300 bg-white px-3 py-1.5 text-slate-800"><span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />{l}</li>)}</ul></Reveal>
        <Reveal className="mt-6"><Traceability /></Reveal>
      </Light>

      <Dark id="reverse">
        <Head dark eyebrow="Reverse engineering" heading="Reverse Engineering Without a Digital Record">{rev.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-10"><Chain dark steps={["Physical component", "Measurements", "Markings", "Existing knowledge", "Engineering interpretation", "CAD", "Drawing"]} /></Reveal>
        <Reveal className="mt-10"><ConfidenceMap /></Reveal>
      </Dark>

      <Light id="security">
        <Head eyebrow="Information handling" heading="Information Security Is Part of the Project Scope"><p>{sec[0]}</p></Head>
        <div className="mt-12 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <h3 className="text-lg font-semibold text-slate-900">Confirm Handling Requirements Before Sharing Restricted Material</h3>
            <div className="mt-5"><Chain vertical steps={["Project information", "Scope review", "Handling requirements", "Agreed arrangements", "Document workflow"]} hi={[2, 3]} /></div>
          </Reveal>
          <Reveal delay={120}><div className="border border-slate-300 bg-white">
            <p className="border-b border-slate-200 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Conceptual project workflow</p>
            <dl className="font-mono text-[12px] uppercase tracking-[0.06em]">{[["Project material", "Shared after agreement"], ["Handling requirements", "To be confirmed"], ["Access", "Project-specific"], ["Workflow", "Agreed before transfer"]].map(([a, b]) => <div key={a} className="grid grid-cols-[1fr_1fr] border-b border-slate-100 px-5 py-3"><dt className="text-slate-500">{a}</dt><dd className={b === "To be confirmed" ? "text-amber-700" : "text-slate-900"}>{b}</dd></div>)}</dl>
            <p className="px-5 py-4 text-sm leading-relaxed text-slate-600">{req[0]}</p>
          </div></Reveal>
        </div>
        <p className="mt-6 text-xs text-slate-500">This describes how handling is scoped — it is not a claim of security clearance, accreditation or classified-data capability.</p>
      </Light>

      <Dark id="obsolete" deep>
        <Head dark eyebrow="Obsolete materials" heading="When the Original Material or Process No Longer Exists"><p>{sec[1]}</p></Head>
        <Reveal className="mt-12"><ol className="grid gap-2 md:grid-cols-5">
          {[["Original material", "As specified"], ["No longer available", "Obsolete / superseded"], ["Legacy reference", "What survives"], ["Engineering documentation", "Obsolescence flagged"], ["Requalification / review", "Your engineering team decides"]].map(([a, b], k) => (
            <li key={a} className={cn("border px-4 py-5", k === 1 ? "border-red-400/60 bg-red-400/5" : k === 4 ? "border-amber-400/70 bg-amber-400/5" : "border-slate-700 bg-[#0B1728]")}>
              <span className="font-mono text-[10px] text-slate-500">{String(k + 1).padStart(2, "0")}</span><p className={cn("mt-1 text-sm font-semibold", k === 1 ? "text-red-200 line-through decoration-red-400/60" : "text-white")}>{a}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-slate-400">{b}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-slate-400">We flag an obsolete material explicitly so your engineering team can decide on an approved substitute — Render CAD Hub doesn&apos;t make that substitution or perform requalification.</p></Reveal>
      </Dark>

      <Light id="memory">
        <Head eyebrow="Long-life documentation" heading="Documentation That Outlives Institutional Memory">{inst.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-10"><Chain steps={["Created", "Used", "Maintained", "Reviewed", "Updated", "Used again"]} /></Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Reveal><div className="h-full border border-slate-300 bg-[#F3F1EC] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Institutional-memory dependent</p>
            <svg viewBox="0 0 320 170" className="mt-4 block h-auto w-full" aria-hidden><rect width="320" height="170" fill="#F3F1EC" /><g opacity="0.75"><Part ox={40} oy={20} k={0.9} style="drawing" /></g></svg>
            <p className="mt-3 text-base italic text-slate-700">“Ask the person who worked on it.”</p>
            <p className="mt-1 text-sm text-slate-500">Geometry without basis, material or revision — the meaning lives with the people, not the drawing.</p>
          </div></Reveal>
          <Reveal delay={120}><div className="h-full border border-[#1D4ED8] bg-white p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-700">Self-explanatory documentation</p>
            <svg viewBox="0 0 520 380" className="mt-4 block h-auto w-full" aria-hidden><rect width="520" height="380" fill="#07111F" /><g transform="translate(10 30)"><TraceDrawing interactive={false} /></g></svg>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-slate-700">Drawing + dimensions + material + reference + revision + traceability</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">The drawing should explain itself.</p>
          </div></Reveal>
        </div>
      </Light>

      <Light id="projects-types" tint>
        <Head eyebrow="Project types" heading="Typical Defence & Sustainment Projects" />
        <Reveal className="mt-12"><ProjectTypes items={types} /></Reveal>
      </Light>

      <Dark id="deliverables">
        <Head dark eyebrow="Deliverables" heading="Typical Deliverables" />
        <Reveal className="mt-12"><Package items={i.deliverables.map((d, k) => ({ file: FILES[k] ?? d, label: d }))} /></Reveal>
      </Dark>

      <Light id="requirements">
        <Head eyebrow="Documentation requirements" heading="Traceability Built Into the Drawing"><p>{req[1]}</p></Head>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[["Dimensions", "Every important dimension has a basis — measured, specified, or inferred and flagged."], ["Material", "Material call-outs have a documented source or a clearly identified basis."], ["Tolerance", "Tolerance information is documented rather than silently assumed."], ["Controlled information", "Project-specific handling requirements are agreed before sensitive material is shared."]].map(([t, d], k) => (
            <li key={t}><Reveal delay={k * 70} className="h-full"><div className={cn("h-full border-t-2 bg-white p-5", k === 3 ? "border-amber-500" : "border-[#1D4ED8]")}><span className="font-mono text-[11px] text-slate-400">{String(k + 1).padStart(2, "0")}</span><h3 className="mt-2 text-base font-semibold text-slate-900">{t}</h3><p className="mt-1.5 text-sm leading-relaxed text-slate-600">{d}</p></div></Reveal></li>
          ))}
        </ul>
        <Reveal className="mt-10"><TraceMatrix /></Reveal>
      </Light>

      <Dark id="suppliers" deep>
        <Head dark eyebrow="Defence-adjacent manufacturing" heading="Supporting Defence-Adjacent Manufacturing Suppliers"><p>{rev[1]}</p></Head>
        <div className="mt-12 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1fr_1.3fr]">
          <Reveal><Chain dark vertical steps={["Customer requirement", "Supplier input", "CAD / drafting", "Manufacturing documentation", "Supplier workflow"]} hi={[2, 3]} /></Reveal>
          <Reveal delay={120}>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Structured documentation across concurrent programmes</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">{["A", "B", "C"].map((x) => <li key={x} className="border border-slate-700 bg-[#0B1728] p-4 font-mono text-[11px] uppercase"><p className="text-sky-300">Programme {x}</p><ul className="mt-2 space-y-1 text-slate-300">{["Component", "Drawing", "Revision"].map((y, k) => <li key={y}><span aria-hidden className="text-slate-600">{k === 2 ? "└─ " : "├─ "}</span>{y}</li>)}</ul></li>)}</ul>
            <p className="mt-3 text-xs text-slate-500">Drawings and revisions structured per programme — not a dedicated configuration-management system.</p>
          </Reveal>
        </div>
      </Dark>

      <Dark id="software">
        <Head dark eyebrow="Software" heading="Software Used in This Industry" />
        <Reveal className="mt-12"><SoftwareSwitch items={sw} /></Reveal>
      </Dark>

      <Dark id="map" deep>
        <Head dark eyebrow="Capability map" heading="Defence Sustainment Capability Map" />
        <Reveal className="mt-12"><CapabilityMap /></Reveal>
      </Dark>

      <Light id="projects">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="Portfolio" heading="Related Projects" description="Illustrative examples, marked as such — not defence projects." /><Link href="/projects" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">All projects →</Link></Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {projs.map((p, k) => (
            <li key={p.slug}><Reveal delay={k * 90} className="h-full"><Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-colors hover:border-slate-900">
              <svg viewBox="0 0 320 170" className="block h-auto w-full" aria-hidden><rect width="320" height="170" fill="#07111F" />{k === 1 ? <Part ox={50} oy={18} k={0.95} style="aged" /> : k === 0 ? <Part ox={60} oy={30} k={0.85} style="solid" /> : <g stroke="#38BDF8" strokeWidth="1.6" fill="none">{[60, 130, 200, 260].map((x) => <path key={x} d={`M${x} 140V50`} stroke="#D6A84F" />)}<path d="M60 50H260M60 95H260" /><path d="M60 50L130 95M130 50L200 95M200 50L260 95" strokeWidth="0.8" /></g>}</svg>
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
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {svcs.map((s, k) => (
            <li key={s.slug}><Reveal delay={k * 70} className="h-full"><Link href={`/services/${s.category}/${s.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{["Drafting / documentation", "Drafting / documentation", "Drafting / documentation", "Engineering design"][k]}</span>
              <h3 className="mt-2 flex items-center justify-between text-lg font-semibold text-slate-900">{s.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></h3>
              <p className="mt-1.5 text-sm text-slate-600">{s.shortDescription}</p>
            </Link></Reveal></li>
          ))}
        </ul>
        <p className="mt-6 border-l-2 border-amber-500 pl-4 text-sm text-slate-600">Engineering, certification, approval and security requirements remain project-specific and should be confirmed with the responsible authority or engineering team.</p>
        <p className="mt-6 text-sm text-slate-600">Related industries: {[["manufacturing", "Manufacturing"], ["aerospace", "Aerospace"], ["automotive", "Automotive"], ["mining", "Mining"], ["energy", "Energy"]].map(([s, n], k) => <span key={s}>{k ? " · " : ""}<Link href={`/industries/${s}`} className="font-medium text-slate-900 underline underline-offset-4">{n}</Link></span>)}</p>
      </Light>

      <section id="faq" className="border-t border-slate-200 bg-white py-20 sm:py-28">
        <JsonLd data={faqJsonLd(faqs)} />
        <Container>
          <Reveal><SectionHeading eyebrow="FAQs" heading="Frequently Asked Questions" /></Reveal>
          <div className="mt-10"><FaqBrowser groups={groupFaqs(faqs)} /></div>
        </Container>
      </section>

      <section className="border-t border-slate-800 bg-[#07111F] py-20 text-white sm:py-24">
        <Container className="grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Get a Quote for Your Defence Project</h2>
            <p className="mt-4 text-lg text-slate-300">Tell us what you need and our team can review the project requirements.</p>
            <div className="mt-8"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button></div>
            <p className="mt-6 max-w-xl border-l-2 border-amber-400 pl-4 text-sm text-slate-400">For projects involving controlled or sensitive information, discuss handling requirements with us before sharing restricted material.</p>
          </div>
          <div className="mx-auto w-full max-w-xs"><Chain dark vertical steps={["Legacy input", "Engineering documentation", "Traceability", "Sustainment workflow"]} /></div>
        </Container>
      </section>
    </>
  );
}
