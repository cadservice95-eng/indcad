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
import { HeroPlant, Shutdown, Brownfield, EvidenceBoard, DisciplineViewer, AccessSwitch, Harsh, Logistics, ProjectTypes, DeliverablesTree, SoftwarePlant } from "./MiningClient";
import { Glyph } from "./MiningVisuals";
import { M, type Layer } from "./PlantModel";

function Dark({ id, children, deep }: { id: string; children: React.ReactNode; deep?: boolean }) {
  return (
    <section id={id} className={cn("relative scroll-mt-20 overflow-hidden border-t border-slate-800 py-20 text-white sm:py-28", deep ? "bg-[#08111D]" : "bg-[#0D1826]")}>
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.04]"><defs><pattern id={`${id}-g`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill={`url(#${id}-g)`} /></svg>
      <Container className="relative">{children}</Container>
    </section>
  );
}
function Light({ id, tint, children }: { id: string; tint?: boolean; children: React.ReactNode }) {
  return <section id={id} className={cn("relative scroll-mt-20 border-t border-slate-200 py-20 sm:py-28", tint ? "bg-[#EDF0F4]" : "bg-[#F8FAFC]")}><Container>{children}</Container></section>;
}
function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      {children ? <div className={cn("space-y-4 text-base leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div> : null}
    </Reveal>
  );
}
function Chain({ steps, dark, hi }: { steps: string[]; dark?: boolean; hi?: number[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em]">
      {steps.map((s, i) => { const on = hi ? hi.includes(i) : i === steps.length - 1; return (
        <li key={s} className="flex items-center gap-2">{i ? <span aria-hidden className={dark ? "text-sky-400" : "text-blue-600"}>→</span> : null}<span className={cn("border px-3 py-2", on ? (dark ? "border-amber-400 bg-amber-400/10 text-white" : "border-[#1D4ED8] bg-blue-50 text-slate-900") : dark ? "border-slate-600 text-slate-200" : "border-slate-300 bg-white text-slate-700")}>{s}</span></li>
      ); })}
    </ol>
  );
}
const para = (i: Industry, h: string) => i.description.find((d) => d.heading?.startsWith(h))?.paragraphs ?? [];

const CATS: [string, string[]][] = [
  ["Brownfield", ["Do you work on brownfield", "Can you help reconcile drawings", "Can you reconcile drawing archives", "Can you support a mine site expansion"]],
  ["Shutdown & commissioning", ["Can you support tight shutdown", "Do you provide as-built documentation at the end"]],
  ["Processing plant", ["Can you produce documentation for processing plant", "Do you draft fixed plant structural", "Do you provide structural documentation for conveyor", "Do you draft fixed conveyor gantry", "Can you produce structural documentation for ore stockpile", "Do you provide documentation for slurry", "Do you draft for different mineral", "Can you support a feasibility-stage"]],
  ["Civil", ["Do you produce civil documentation for haul", "Do you provide civil drafting for site drainage", "Do you provide documentation for tailings", "Can you support documentation for a mine site's water", "Do you provide documentation for site accommodation"]],
  ["Remote sites", ["Can you support remote site projects with limited", "Do you support remote mine site projects delivered", "Can you support a mining project across both", "Can you support a mining services contractor"]],
  ["Operating environment", ["Can you document mechanical equipment operating in harsh", "Can you incorporate access, egress", "Can you produce documentation for mobile plant maintenance", "Do you support documentation for dust suppression"]],
];
function groupFaqs(faqs: FAQItem[]) {
  const used = new Set<string>();
  const g = CATS.map(([cat, keys]) => ({ cat, items: keys.flatMap((k) => { const f = faqs.find((q) => q.question.startsWith(k) && !used.has(q.question)); if (f) used.add(f.question); return f ? [f] : []; }) }));
  const rest = faqs.filter((f) => !used.has(f.question));
  if (rest.length) g[2].items.push(...rest);
  return g.filter((x) => x.items.length);
}

const SW: Record<string, { focus: Layer[]; note: string }> = {
  tekla: { focus: ["structure", "access"], note: "Structural steel and structural BIM — frames, platforms and access structures, with shop and erection drawings." },
  autocad: { focus: ["docs"], note: "2D drawing layers — general arrangements, civil site drawings and legacy drawing conversion." },
  solidworks: { focus: ["equipment"], note: "Mechanical equipment and fabrication drawings for fixed plant." },
  "civil-3d": { focus: ["site", "civil"], note: "Terrain, access roads, earthworks and drainage." },
};

function ControlMap() {
  const mono = { fontFamily: "var(--font-mono)" } as const;
  const top = [["STRUCTURAL", "STEEL", 150], ["MECHANICAL", "EQUIPMENT", 380], ["CIVIL", "SITE", 610]] as const;
  const box = (x: number, y: number, w: number, l: string, c = "#334155", t = "#E5E7EB") => <g><rect x={x - w / 2} y={y - 15} width={w} height="30" fill={M.panel} stroke={c} /><text x={x} y={y + 5} textAnchor="middle" fontSize="11" fill={t} style={mono}>{l}</text></g>;
  const line = (d: string, k: number, c = M.sky) => <path d={d} pathLength={1} fill="none" stroke={c} strokeWidth="1.4" className="draw" style={{ "--d": `${k * 160}ms`, "--t": ".7s" } as React.CSSProperties} />;
  return (
    <>
      <svg viewBox="0 0 760 470" className="mx-auto hidden h-auto w-full max-w-[920px] md:block" role="img" aria-label="Mining project documentation map: structural, mechanical and civil branches converge into coordination, documentation and shutdown or site delivery, with brownfield, remote logistics, access and as-built cross-links">
        <title>Mining project documentation map</title>
        {box(380, 30, 280, "MINING PROJECT DOCUMENTATION", M.sky, "#fff")}
        {top.map(([a, b, x], k) => <g key={a}>{line(`M380 45C380 70 ${x} 70 ${x} 95`, k)}{box(x, 110, 170, a)}{line(`M${x} 125V170`, k + 3)}{box(x, 185, 150, b)}{line(`M${x} 200C${x} 240 380 230 380 255`, k + 6)}</g>)}
        {box(380, 270, 200, "COORDINATION")}{line("M380 285V315", 9)}{box(380, 330, 200, "DOCUMENTATION")}{line("M380 345V375", 10)}{box(380, 390, 220, "SHUTDOWN / SITE", M.amber, "#FDE68A")}
        {[["BROWNFIELD", 95, 300], ["REMOTE LOGISTICS", 95, 380], ["ACCESS", 665, 300], ["AS-BUILT", 665, 380]].map(([l, x, y], k) => <g key={l as string}>{line(`M${(x as number) < 380 ? (x as number) + 75 : (x as number) - 75} ${y}H${(x as number) < 380 ? 270 : 490}`, 11 + k, M.amber)}{box(x as number, y as number, 150, l as string, M.amber, "#FDE68A")}</g>)}
      </svg>
      <ol className="space-y-2 font-mono text-[11px] uppercase md:hidden">{["Mining project documentation", "Structural · Mechanical · Civil", "Steel · Equipment · Site", "Coordination", "Documentation", "Shutdown / site", "+ Brownfield · Remote logistics · Access · As-built"].map((s, k) => <li key={s} className={cn("border px-3 py-2", k === 0 ? "border-sky-400 text-white" : k === 6 ? "border-amber-400 text-amber-200" : "border-slate-600 text-slate-200")}>{s}</li>)}</ol>
    </>
  );
}

export function MiningPage({ industry: i }: { industry: Industry }) {
  const svcs = i.services.flatMap((s) => { const v = getServiceBySlug(s); return v ? [v] : []; });
  const sw = i.software.flatMap((s) => { const v = getSoftwareBySlug(s); return v ? [{ slug: v.slug, name: v.name, category: v.category, ...SW[v.slug] }] : []; });
  const projs = ["warehouse-structural-steel-shop-drawings", "processing-plant-platform-structural-detailing", "sheet-metal-enclosure-fabrication-drawings"].flatMap((s) => { const p = projects.find((x) => x.slug === s); return p ? [p] : []; });
  const [shut, brown, logi, harsh, remote] = ["Why Accuracy", "Brownfield", "Remote Logistics", "Harsh", "Working Remotely"].map((h) => para(i, h));
  const req = i.documentationRequirements;
  const d = i.deliverables;

  return (
    <>
      <section className="relative overflow-hidden bg-[#08111D] pb-16 pt-14 text-white sm:pb-24 sm:pt-20">
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.05]"><defs><pattern id="mn-hero-g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#mn-hero-g)" /></svg>
        <Container className="relative grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sky-300">Mining &amp; mineral processing</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{i.heroHeading}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">{i.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#disciplines" size="lg" variant="outline-light">Explore Mining Capabilities</Button></div>
            <p className="mt-8 border-l-2 border-amber-400 pl-4 text-sm leading-relaxed text-slate-300">Built around the reality of operating plants, brownfield conditions and fixed shutdown windows.</p>
          </div>
          <HeroPlant />
        </Container>
      </section>

      <Dark id="shutdown">
        <Head dark eyebrow="Shutdown window" heading="Why Accuracy Matters on a Shutdown Window">{shut.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-12"><ol className="grid gap-2 md:grid-cols-[1fr_1.3fr_1fr]">
          <li className="border border-slate-700 bg-[#08111D] p-5"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Pre-shutdown</p><ul className="mt-3 space-y-1.5 text-sm text-slate-200">{["Design", "Review", "Fabrication", "Preparation"].map((x) => <li key={x}>— {x}</li>)}</ul></li>
          <li className="border-2 border-amber-400 bg-amber-400/[0.07] p-5"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300">Shutdown window · fixed</p><ul className="mt-3 grid grid-cols-2 gap-1.5 text-sm text-white">{["Remove", "Install", "Inspect", "Commission"].map((x) => <li key={x} className="border border-amber-400/40 px-3 py-2">{x}</li>)}</ul></li>
          <li className="border border-slate-700 bg-[#08111D] p-5"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Return to operation</p><p className="mt-3 text-sm text-slate-200">Plant back online · as-built updated</p></li>
        </ol></Reveal>
        <Reveal className="mt-10"><Shutdown /></Reveal>
        <Reveal className="mt-8"><div className="border border-slate-700 bg-[#08111D] p-5 font-mono text-[12px]"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Illustrative documentation package</p><p className="mt-2 font-semibold text-white">SHUTDOWN_PACKAGE/</p><ul className="mt-1 grid gap-x-6 gap-y-1 text-slate-300 sm:grid-cols-2">{["FABRICATION_DRAWINGS", "STRUCTURAL_DRAWINGS", "EQUIPMENT_DOCUMENTATION", "SITE_CIVIL_DRAWINGS", "INSTALLATION_REFERENCES", "AS_BUILT_UPDATES"].map((f, k, a) => <li key={f}><span aria-hidden className="text-slate-600">{k === a.length - 1 ? "└── " : "├── "}</span>{f}</li>)}</ul><p className="mt-2 font-sans text-xs text-slate-500">Contents depend on project scope — not every project needs every item.</p></div></Reveal>
      </Dark>

      <Light id="brownfield">
        <Head eyebrow="Brownfield reconciliation" heading="When the Drawings Don't Match the Plant"><p>{brown[0]}</p><p>{req[0]}</p></Head>
        <div className="mt-12 bg-[#08111D] p-4 sm:p-6"><Brownfield /></div>
        <div className="mt-8 grid gap-6 [&>*]:min-w-0 lg:grid-cols-2">
          <Reveal><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Reconciliation workflow</p><div className="mt-3"><Chain steps={["Existing drawing + photos / survey / site data", "Reconciliation", "Current condition", "New design / documentation"]} /></div></Reveal>
          <Reveal delay={100}><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Reconciliation record</p><div className="mt-3"><Chain steps={["Original design", "Site observation", "Difference identified", "Reconciliation record"]} hi={[2, 3]} /></div></Reveal>
        </div>
      </Light>

      <Dark id="remote" deep>
        <Head dark eyebrow="Remote site documentation" heading="Working Remotely From Site Information">{remote.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-10"><Chain dark steps={["Photos + survey + existing drawings + markups", "Remote engineering workflow", "CAD / BIM / documentation"]} /></Reveal>
        <Reveal className="mt-10"><EvidenceBoard /></Reveal>
      </Dark>

      <Dark id="disciplines">
        <Head dark eyebrow="Multi-discipline" heading="Structural, Mechanical and Civil — One Operating Environment"><p>{shut[1]}</p></Head>
        <Reveal className="mt-12"><DisciplineViewer /></Reveal>
      </Dark>

      <Light id="access" tint>
        <Head eyebrow="Operational constraints" heading="Design Documentation Around the Way the Plant Is Maintained"><p>{brown[1]}</p></Head>
        <div className="mt-12 bg-[#08111D] p-3 sm:p-4"><AccessSwitch modes={[{ m: "access", l: "Access" }, { m: "maintenance", l: "Maintenance" }, { m: "removal", l: "Removal path" }, { m: "mobile", l: "Mobile plant" }]} /></div>
        <Reveal className="mt-8"><Chain steps={["Equipment", "Access route", "Removal clearance", "Service area"]} /></Reveal>
        <p className="mt-3 text-xs text-slate-500">Conceptual only — no lifting capacities, crane capacities or structural loads are shown or calculated.</p>
      </Light>

      <Dark id="harsh" deep>
        <Head dark eyebrow="Operating environment" heading="Documentation for Harsh Processing Environments"><p>{harsh[0]}</p><p>{req[3]}</p></Head>
        <Reveal className="mt-12"><Harsh /></Reveal>
      </Dark>

      <Light id="safety">
        <Head eyebrow="Safety in the detailing" heading="Access, Egress and Fall Protection Start in the Detailing"><p>{harsh[1]}</p></Head>
        <div className="mt-12 bg-[#08111D] p-3 sm:p-4"><AccessSwitch modes={[{ m: "access", l: "Access" }, { m: "egress", l: "Egress" }, { m: "fall", l: "Fall protection" }]} /></div>
        <p className="mt-3 text-xs text-slate-500">No compliance with a particular regulation is claimed — detailing follows the standards specified for your project.</p>
      </Light>

      <Dark id="logistics">
        <Head dark eyebrow="Remote logistics" heading="When the Site Is Remote, the Drawing Has to Travel Before the Steel Does"><p>{logi[0]}</p><p className="text-sm text-slate-400">{logi[1]}</p></Head>
        <Reveal className="mt-12"><Logistics /></Reveal>
        <p className="mt-4 border-l-2 border-amber-400 pl-4 text-sm text-slate-300">Fabrication decisions happen before the component reaches site.</p>
      </Dark>

      <Light id="types">
        <Head eyebrow="Project types" heading="Typical Mining & Mineral Processing Projects" />
        <Reveal className="mt-12"><ProjectTypes items={i.useCases} /></Reveal>
      </Light>

      <Light id="deliverables" tint>
        <Head eyebrow="Deliverables" heading="Typical Mining Project Deliverables"><p>Depending on project scope, the package can include:</p></Head>
        <Reveal className="mt-12"><DeliverablesTree groups={[
          { dir: "STRUCTURAL", files: ["SHOP_DRAWINGS", "ERECTION_DRAWINGS"], label: d[0] },
          { dir: "MECHANICAL", files: ["FABRICATION_DRAWINGS"], label: d[1] },
          { dir: "BIM", files: ["STRUCTURAL_MODEL"], label: d[2] },
          { dir: "CIVIL", files: ["SITE_DRAWINGS"], label: d[3] },
          { dir: "AS_BUILT", files: ["CURRENT_CONDITION"], label: d[4] },
          { dir: "RECONCILIATION", files: ["DRAWING_COMPARISON"], label: d[5] },
        ]} /></Reveal>
      </Light>

      <Light id="requirements">
        <Head eyebrow="Documentation requirements" heading="Documentation Built Around Operating Reality" />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {["Brownfield", "Shutdown", "Access", "Environment"].map((t, k) => (
            <li key={t}><Reveal delay={k * 70} className="h-full"><div className={cn("h-full border-t-2 bg-white p-5", k === 1 ? "border-amber-500" : "border-[#1D4ED8]")}><span className="font-mono text-[11px] text-slate-400">{String(k + 1).padStart(2, "0")}</span><h3 className="mt-2 text-base font-semibold text-slate-900">{t}</h3><p className="mt-1.5 text-sm leading-relaxed text-slate-600">{req[k]}</p></div></Reveal></li>
          ))}
        </ul>
      </Light>

      <Dark id="software" deep>
        <Head dark eyebrow="Software" heading="Software Used in Mining Projects" />
        <Reveal className="mt-12"><SoftwarePlant items={sw} /></Reveal>
      </Dark>

      <Dark id="map">
        <Head dark eyebrow="Project control map" heading="Mining Project Documentation Map" />
        <Reveal className="mt-12"><ControlMap /></Reveal>
      </Dark>

      <Light id="projects">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="Portfolio" heading="Related Projects" description="Illustrative examples, marked as such — not mining client projects." /><Link href="/projects" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">All projects →</Link></Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {projs.map((p, k) => (
            <li key={p.slug}><Reveal delay={k * 90} className="h-full"><Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-colors hover:border-slate-900">
              <Glyph k={["frame", "platform", "equip"][k]} />
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
        <Head eyebrow="Related services" heading="Related Services" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {svcs.map((s, k) => (
            <li key={s.slug}><Reveal delay={k * 60} className="h-full"><Link href={`/services/${s.category}/${s.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900">
              <h3 className="flex items-center justify-between text-base font-semibold text-slate-900">{s.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></h3>
              <p className="mt-1.5 text-sm text-slate-600">{s.shortDescription}</p>
            </Link></Reveal></li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-slate-600">Related industries: {[["construction", "Construction"], ["manufacturing", "Manufacturing"], ["energy", "Energy"], ["oil-gas", "Oil & Gas"]].map(([s, n], k) => <span key={s}>{k ? " · " : ""}<Link href={`/industries/${s}`} className="font-medium text-slate-900 underline underline-offset-4">{n}</Link></span>)}</p>
      </Light>

      <section id="faq" className="border-t border-slate-200 bg-white py-20 sm:py-28">
        <JsonLd data={faqJsonLd(i.faqs)} />
        <Container>
          <Reveal><SectionHeading eyebrow="FAQs" heading="Frequently Asked Questions" /></Reveal>
          <div className="mt-10"><FaqBrowser groups={groupFaqs(i.faqs)} /></div>
        </Container>
      </section>

      <section className="border-t border-slate-800 bg-[#08111D] py-20 text-white sm:py-24">
        <Container className="grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Get a Quote for Your Mining Project</h2>
            <p className="mt-4 text-lg text-slate-300">Tell us what you need and our team can review the project requirements.</p>
            <div className="mt-8"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button></div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <svg aria-hidden viewBox="0 0 20 360" className="absolute left-4 top-0 h-full w-5"><path d="M10 10V350" stroke="#D6A84F" strokeWidth="1.5" className="rch-flow" /></svg>
            <ol className="relative space-y-3 pl-12 font-mono text-[11px] uppercase tracking-[0.1em]">{["Site input", "Brownfield reconciliation", "CAD / BIM", "Fabrication", "Remote site", "Shutdown / commissioning"].map((s, k, a) => <li key={s} className={cn("border px-4 py-2.5", k === a.length - 1 ? "border-amber-400 bg-amber-400/10 text-white" : "border-slate-600 text-slate-200")}>{s}</li>)}</ol>
          </div>
        </Container>
      </section>
    </>
  );
}
