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
import { HeroSite, Combined, RenewableExplorer, SolarView, Substation, SingleLine, CivilLayers, AsBuilt, Lifecycle, Phases, Deliverables, Matrix } from "./EnClient";
import { E, T, ln, SitePlan, SiteSvg, type Layer } from "./EnergySite";

function Dark({ id, children, deep }: { id: string; children: React.ReactNode; deep?: boolean }) {
  return (
    <section id={id} className={cn("relative scroll-mt-20 overflow-hidden border-t border-slate-800 py-20 text-white sm:py-28", deep ? "bg-[#080B14]" : "bg-[#0B0F1A]")}>
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-yellow-200/[0.03]"><defs><pattern id={`${id}-g`} width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill={`url(#${id}-g)`} /></svg>
      <Container className="relative">{children}</Container>
    </section>
  );
}
function Light({ id, tint, children }: { id: string; tint?: boolean; children: React.ReactNode }) {
  return <section id={id} className={cn("relative scroll-mt-20 border-t border-slate-200 py-20 sm:py-28", tint ? "bg-[#EFEEE8]" : "bg-[#F7F7F4]")}><Container>{children}</Container></section>;
}
function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      {children ? <div className={cn("space-y-4 text-base leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div> : null}
    </Reveal>
  );
}
function Chain({ steps, dark, vertical }: { steps: string[]; dark?: boolean; vertical?: boolean }) {
  return (
    <ol className={cn("font-mono text-[11px] uppercase tracking-[0.08em]", vertical ? "" : "flex flex-wrap items-center gap-2")}>
      {steps.map((s, i) => { const last = i === steps.length - 1; const box = cn("border px-3 py-2", last ? (dark ? "border-yellow-400 bg-yellow-400/10 text-white" : "border-yellow-600 bg-yellow-50 text-slate-900") : dark ? "border-slate-600 text-slate-200" : "border-slate-300 bg-white text-slate-700");
        return vertical ? <li key={s}><div className={box}>{s}</div>{!last ? <span aria-hidden className={cn("block py-0.5 pl-4", dark ? "text-yellow-400" : "text-yellow-700")}>↓</span> : null}</li> : <li key={s} className="flex items-center gap-2">{i ? <span aria-hidden className={dark ? "text-yellow-400" : "text-yellow-700"}>→</span> : null}<span className={box}>{s}</span></li>; })}
    </ol>
  );
}
const para = (i: Industry, h: string) => i.description.find((d) => d.heading?.startsWith(h))?.paragraphs ?? [];

const CATS: [string, string[]][] = [
  ["Solar & renewable", ["Can you produce foundation and mounting structure drawings for solar", "Do you draft electrical collection system", "Do you support documentation for a hybrid", "Can you support documentation for a battery energy storage", "Can you provide civil drafting for internal site roads", "Can you support documentation across a large portfolio", "Can you support documentation across a portfolio of similar sites", "Can you support a project where site layout", "Do you support both AC and DC"]],
  ["Substations & grid", ["Can you produce electrical single-line diagrams for substation", "Can you produce documentation for a substation augmentation", "Do you follow a specific utility's grid", "Can you produce documentation for a transmission line route", "Do you provide electrical single-line diagrams for a distribution network", "Do you provide documentation for microgrid"]],
  ["Civil", ["Do you provide civil drafting for site access", "Do you draft cable trench", "Do you provide documentation for site security", "Can you support documentation for a hydro"]],
  ["Structural", ["How do you coordinate structural detailing", "Can you produce structural documentation for wind turbine", "Do you provide structural documentation for battery storage container"]],
  ["Asset lifecycle", ["Do you provide as-built documentation for older", "Do you provide handover documentation", "Can you support an energy asset owner's ongoing", "Can you support a renewable energy developer across a portfolio spanning", "Can you support a renewable energy developer through both", "Do you support an EPC contractor delivering"]],
];
function groupFaqs(faqs: FAQItem[]) {
  const used = new Set<string>();
  const g = CATS.map(([cat, keys]) => ({ cat, items: keys.flatMap((k) => { const f = faqs.find((q) => q.question.startsWith(k) && !used.has(q.question)); if (f) used.add(f.question); return f ? [f] : []; }) }));
  const rest = faqs.filter((f) => !used.has(f.question));
  if (rest.length) g[4].items.push(...rest);
  return g.filter((x) => x.items.length);
}
const SW_ROLE: Record<string, string> = {
  autocad: "2D CAD documentation — single-line diagrams, schematics, structural and site drawings.",
  revit: "Building and BIM documentation with coordinated modelling, where a project uses it.",
  "civil-3d": "Civil and site documentation — terrain, grading, access roads and drainage.",
};

function Glyph({ k }: { k: number }) {
  const s = [
    <g key="0" {...ln(E.steel, 1.4)}><path d="M30 85V35M60 85V35M30 35H60M100 85V35M130 85V35M100 35H130M20 22H140" /><path d="M30 60L60 45M100 60L130 45" strokeWidth="0.9" /></g>,
    <g key="1" {...ln(E.elec, 1.4)}><circle cx="40" cy="30" r="10" /><path d="M40 40V55M30 55H130M60 55V75M100 55V75" /><path d="M54 75h12v10h-12zM94 75h12v10h-12z" /></g>,
    <g key="2">{[0, 1, 2].map((k) => <path key={k} d={`M10 ${30 + k * 22}C50 ${20 + k * 24} 100 ${40 + k * 20} 150 ${28 + k * 22}`} {...ln(E.civil, 1)} />)}<path d="M10 80H150" {...ln(E.civil, 6)} strokeOpacity="0.4" /></g>,
    <g key="3">{[0, 1, 2, 3].map((r) => <path key={r} d={`M20 ${24 + r * 14}H100`} {...ln(E.steel, 2)} />)}<rect x="110" y="40" width="12" height="12" {...ln(E.steel, 1)} /><path d="M100 46h10M122 46h20" {...ln(E.elec, 1.4)} /></g>,
    <g key="4"><path d="M20 30H100V80H20Z" {...ln(E.mute, 1)} strokeDasharray="4 3" /><path d="M30 30H110V80H30Z" {...ln(E.ok, 1.4)} /><path d="M126 34l14 0" {...ln(E.red, 1)} /></g>,
    <g key="5"><path d="M60 85V30M100 85V30M60 30H100" {...ln(E.steel, 1.6)} /><circle cx="80" cy="40" r="22" fillOpacity="0.06" {...ln(E.elec, 1)} fill={E.elec} strokeDasharray="4 3" /></g>,
    <g key="6">{[[30, 30], [120, 28], [34, 74], [124, 72]].map(([x, y], k) => <rect key={k} x={x - 12} y={y - 10} width="24" height="20" {...ln(k === 2 ? E.ok : E.steel, 1)} />)}<rect x="68" y="42" width="24" height="18" {...ln(E.elec, 1.4)} />{[[42, 36], [108, 34], [46, 70], [112, 70]].map(([x, y], k) => <path key={k} d={`M${x} ${y}L80 51`} {...ln(E.elec, 0.8)} strokeDasharray="3 2" />)}</g>,
  ][k];
  return <svg viewBox="0 0 160 100" className="block h-auto w-full" aria-hidden><rect width="160" height="100" fill={E.bg} />{s}</svg>;
}

export function EnergyPage({ industry: i }: { industry: Industry }) {
  const svcs = i.services.flatMap((s) => { const v = getServiceBySlug(s); return v ? [v] : []; });
  const sw = i.software.flatMap((s) => { const v = getSoftwareBySlug(s); return v ? [{ slug: v.slug, name: v.name, category: v.category }] : []; });
  const projs = ["warehouse-structural-steel-shop-drawings", "processing-plant-platform-structural-detailing", "switchboard-and-control-panel-drawings"].flatMap((s) => { const p = projects.find((x) => x.slug === s); return p ? [p] : []; });
  const [comb, renew, asb, grid, hand] = ["Structural, Electrical", "Coordinating", "As-Built", "Grid", "Why Handover"].map((h) => para(i, h));
  const req = i.documentationRequirements;
  const link = (href: string, t: string, dark?: boolean) => <Link href={href} className={cn("font-medium underline underline-offset-4", dark ? "text-white" : "text-slate-900")}>{t}</Link>;

  return (
    <>
      <section className="relative overflow-hidden bg-[#0B0F1A] pb-16 pt-14 text-white sm:pb-24 sm:pt-20">
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-yellow-200/[0.04]"><defs><pattern id="en-hero-g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#en-hero-g)" /></svg>
        <Container className="relative grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-yellow-300">Energy infrastructure documentation</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{i.heroHeading}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">{i.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#disciplines" size="lg" variant="outline-light">Explore Energy Services</Button></div>
            <ul className="mt-8 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.12em]"><li className="border border-[#D6B370]/60 px-2 py-1 text-[#E9D5A6]">Civil</li><li className="border border-sky-300/60 px-2 py-1 text-sky-200">Structural</li><li className="border border-yellow-300/60 px-2 py-1 text-yellow-200">Electrical</li><li className="px-1 py-1 text-slate-400">→ one coordinated site</li></ul>
          </div>
          <HeroSite />
        </Container>
      </section>

      <Dark id="disciplines" deep>
        <Head dark eyebrow="Three disciplines" heading="Structural, Electrical and Civil, Combined">{comb.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-12"><Combined /></Reveal>
      </Dark>

      <Dark id="renewable">
        <Head dark eyebrow="Renewable coordination" heading="Coordinating Renewable Site Documentation"><p>{renew[0]}</p></Head>
        <Reveal className="mt-12"><RenewableExplorer /></Reveal>
      </Dark>

      <Light id="solar">
        <Head eyebrow="Solar" heading="Utility-Scale Solar Documentation"><p>Array blocks, access roads, inverter areas, foundations, collection routes and drainage — each discipline&apos;s view of the same layout.</p></Head>
        <Reveal className="mt-12"><SolarView /></Reveal>
      </Light>

      <Light id="wind" tint>
        <Head eyebrow="Wind" heading="Wind Infrastructure Documentation"><p>Access road, turbine foundation and cable route in plan, with the foundation–structure interface in elevation. Conceptual and documentation-focused.</p></Head>
        <Reveal className="mt-12"><div className="grid gap-4 [&>*]:min-w-0 md:grid-cols-[1.3fr_1fr]">
          <figure className="border border-slate-700 bg-[#0B0F1A]"><SiteSvg vb="0 0 480 300" label="Conceptual wind site plan: access road, turbine foundation and cable route">
            <path d="M20 40L460 30L470 270L30 280Z" {...ln(E.mute, 1)} strokeDasharray="8 5" />
            <path d="M30 240C140 220 220 150 300 130S420 90 460 80" {...ln(E.civil, 8)} strokeOpacity="0.4" />
            {[[150, 190], [300, 120], [420, 84]].map(([x, y], k) => <g key={k}><circle cx={x} cy={y - 34} r="16" fillOpacity="0.08" {...ln(E.steel, 1.4)} fill={E.steel} /><circle cx={x} cy={y - 34} r="5" {...ln(E.steel, 1.2)} /><T x={x + 20} y={y - 40} c={E.steel} size={8}>{`WTG-0${k + 1} FDN`}</T></g>)}
            <path d="M150 156V170H300V86H420V50" {...ln(E.elec, 1.4)} strokeDasharray="6 4" className="rch-flow" />
            <rect x="380" y="200" width="70" height="50" fillOpacity="0.06" {...ln(E.elec, 1.2)} fill={E.elec} /><path d="M420 86V200" {...ln(E.elec, 1.2)} strokeDasharray="6 4" /><T x="384" y="194" c={E.elec} size={8}>SUBSTATION</T>
            <T x="24" y="296" c={E.mute} size={8}>PLAN · ACCESS ROAD → FOUNDATION → CABLE ROUTE</T>
          </SiteSvg></figure>
          <figure className="border border-slate-300 bg-white"><SiteSvg light vb="0 0 300 300" label="Conceptual turbine foundation elevation and structural interface">
            <path d="M20 200H280" stroke="#64748B" /><path d="M60 200L80 250H220L240 200" fill="#E2E8F0" stroke="#0F172A" /><path d="M120 200V150H180V200" fill="#F1F5F9" stroke="#0F172A" />
            <path d="M135 150V40M165 150V40" stroke="#0F172A" strokeWidth="1.4" /><path d="M120 150H180" stroke="#B45309" strokeWidth="2" /><T x="186" y="154" c="#B45309" size={8}>STRUCTURAL INTERFACE</T>
            <path d="M40 250H260" stroke="#2563EB" strokeDasharray="4 3" /><T x="40" y="270" c="#2563EB" size={8}>FOUNDATION — PROJECT DESIGN</T><T x="20" y="292" c="#64748B" size={8}>ELEVATION · CONCEPTUAL</T>
          </SiteSvg></figure>
        </div></Reveal>
      </Light>

      <Dark id="substation" deep>
        <Head dark eyebrow="Substations & switchyards" heading="Substation Documentation Is a Coordination Exercise"><p>{renew[1]}</p><p className="text-sm text-slate-400">{req[1]}</p></Head>
        <Reveal className="mt-12"><Substation /></Reveal>
      </Dark>

      <Light id="single-line">
        <Head eyebrow="Electrical" heading="Electrical Documentation from Site to Single-Line"><p>Select a node on the single-line diagram to find it on the site. Single-line diagrams and schematics are part of our {link("/services/electrical/electrical-drafting", "electrical drafting")} service.</p></Head>
        <Reveal className="mt-12"><SingleLine /></Reveal>
      </Light>

      <Light id="civil" tint>
        <Head eyebrow="Civil" heading="Civil Documentation for Distributed Energy Sites"><p>Site boundary, access roads, grading, drainage, foundations, cable trench routes and equipment areas — see {link("/services/civil/civil-drafting", "civil drafting")}. Not survey data.</p></Head>
        <Reveal className="mt-12"><CivilLayers /></Reveal>
      </Light>

      <Dark id="as-built">
        <Head dark eyebrow="As-built" heading="As-Built Records for Decades-Long Assets"><p>{asb[0]}</p><p className="text-sm">Older infrastructure with incomplete records can be rebuilt via {link("/services/cad-conversion/cad-conversion", "CAD conversion", true)}.</p></Head>
        <Reveal className="mt-12"><AsBuilt /></Reveal>
      </Dark>

      <Dark id="three-states" deep>
        <Head dark eyebrow="Documentation states" heading="One Asset — Three Documentation States" />
        <ul className="mt-12 grid gap-3 md:grid-cols-3">
          {([{ t: "Design", d: "Planned site", show: ["site", "civil", "structural"] as Layer[], ab: false }, { t: "Construction", d: "Documentation used to build", show: undefined, ab: false }, { t: "As-built", d: "Recorded final condition", show: undefined, ab: true }]).map((x, k) => (
            <li key={x.t}><Reveal delay={k * 100}><figure className="border border-slate-700 bg-[#0B0F1A]"><SiteSvg label={`${x.t}: ${x.d}`}><SitePlan show={x.show} asbuilt={x.ab} /></SiteSvg><figcaption className="border-t border-slate-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em]"><span className={k === 2 ? "text-emerald-300" : "text-yellow-300"}>{x.t}</span> <span className="text-slate-400">· {x.d}</span></figcaption></figure></Reveal></li>
          ))}
        </ul>
      </Dark>

      <Dark id="lifecycle">
        <Head dark eyebrow="Asset lifecycle" heading="Documentation Across the Asset Lifecycle"><p>{req[2]}</p></Head>
        <Reveal className="mt-12"><Lifecycle /></Reveal>
      </Dark>

      <Light id="portfolio">
        <Head eyebrow="Portfolio documentation" heading="One Documentation Discipline Across Many Sites"><p>{asb[1]}</p></Head>
        <Reveal className="mt-12"><div className="relative mx-auto max-w-[900px]">
          <svg viewBox="0 0 700 380" className="block h-auto w-full" role="img" aria-label="Four illustrative sites connected to one documentation standard">
            <title>Illustrative sites sharing one documentation standard</title>
            {[[120, 80, "Solar"], [580, 80, "Solar"], [120, 300, "Wind"], [580, 300, "Solar + storage"]].map(([x, y, t], k) => (
              <g key={k}>
                <path d={`M${x} ${y}L350 190`} pathLength={1} className="draw" style={{ "--d": `${k * 200}ms` } as React.CSSProperties} {...ln("#B45309", 1.4)} strokeDasharray="1" />
                <rect x={(x as number) - 90} y={(y as number) - 45} width="180" height="90" fill="#0B0F1A" stroke="#334155" />
                <g transform={`translate(${(x as number) - 64} ${(y as number) - 43}) scale(0.215)`}><SitePlan focus={t === "Wind" ? ["civil", "site"] : null} /></g>
                <T x={(x as number) - 84} y={(y as number) + 58} c="#0F172A" size={10} w={600}>{`SITE 0${k + 1} · ${t}`}</T>
                <T x={(x as number) - 90} y={(y as number) - 52} c="#92400E" size={8}>ILLUSTRATIVE SITE</T>
              </g>
            ))}
            <rect x="260" y="160" width="180" height="60" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.6" /><T x="350" y="186" a="middle" c="#0F172A" size={11} w={700}>DOCUMENTATION</T><T x="350" y="204" a="middle" c="#0F172A" size={11} w={700}>STANDARD</T>
          </svg>
        </div></Reveal>
        <p className="mt-3 text-xs text-slate-500">No real locations, project names or site counts.</p>
      </Light>

      <Dark id="grid" deep>
        <Head dark eyebrow="Grid interconnection" heading="Documentation That Follows the Network Requirement"><p>{grid[0]}</p></Head>
        <Reveal className="mt-10"><div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr_auto_1.2fr]">
          {["Energy site", "→", "Substation", "→"].map((s, k) => s === "→" ? <span key={k} aria-hidden className="hidden text-center text-yellow-400 md:block">→</span> : <div key={k} className="border border-slate-600 px-4 py-4 font-mono text-[11px] uppercase text-slate-200">{s}</div>)}
          <div className="relative border-2 border-dashed border-yellow-400/70 p-3"><span className="absolute -top-3 left-3 bg-[#080B14] px-2 font-mono text-[9px] uppercase text-yellow-300">Project / network standard</span><div className="border border-yellow-400 bg-yellow-400/10 px-4 py-3 font-mono text-[11px] uppercase text-white">Transmission / distribution network</div></div>
        </div></Reveal>
        <p className="mt-6 text-sm text-slate-400">Where supplied, documentation follows the relevant project or network operator standard. {req[0]}</p>
      </Dark>

      <Dark id="phases">
        <Head dark eyebrow="Phased development" heading="Documentation for Projects That Evolve in Phases"><p>{grid[1]}</p></Head>
        <Reveal className="mt-12"><Phases /></Reveal>
      </Dark>

      <Light id="handover">
        <Head eyebrow="Handover" heading="Why Handover Quality Matters So Much Here">{hand.map((p) => <p key={p}>{p}</p>)}</Head>
        <div className="mt-12 grid gap-6 [&>*]:min-w-0 md:grid-cols-[1fr_1.2fr]">
          <Reveal><Chain vertical steps={["Engineering team", "Construction team", "Commissioning", "Asset owner", "Operations & maintenance"]} /></Reveal>
          <Reveal delay={120}><div className="border border-slate-300 bg-white p-5"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">The asset owner receives</p><ul className="mt-3 space-y-2">{["As-built drawings", "Electrical documentation", "Civil / site documentation", "Structural documentation", "Revision information"].map((x) => <li key={x} className="flex items-center gap-3 border border-slate-200 px-3 py-2.5 text-sm text-slate-900"><Check className="h-4 w-4 text-yellow-700" aria-hidden />{x}</li>)}</ul><p className="mt-3 text-xs text-slate-500">Contents follow the project&apos;s handover requirements — no specific handover standard is implied.</p></div></Reveal>
        </div>
      </Light>

      <Light id="types" tint>
        <Head eyebrow="Project types" heading="Typical Project Types" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {i.useCases.map((u, k) => <li key={u} className={k === 6 ? "sm:col-span-2" : undefined}><Reveal delay={k * 50} className="h-full"><div className="group h-full overflow-hidden border border-slate-300 bg-white transition-colors hover:border-slate-900"><div className="transition-transform duration-500 group-hover:scale-[1.03]"><Glyph k={k} /></div><div className="p-4"><span className="font-mono text-[10px] text-slate-400">{String(k + 1).padStart(2, "0")}</span><h3 className="mt-1 text-base font-semibold text-slate-900">{u}</h3></div></div></Reveal></li>)}
        </ul>
      </Light>

      <Light id="deliverables">
        <Head eyebrow="Deliverables" heading="Typical Deliverables" />
        <Reveal className="mt-12"><Deliverables items={i.deliverables} /></Reveal>
      </Light>

      <Light id="matrix" tint>
        <Head eyebrow="Discipline matrix" heading="Energy Disciplines and Their Documentation"><p>Select a discipline to see where it sits on the site.</p></Head>
        <Reveal className="mt-12"><Matrix /></Reveal>
      </Light>

      <Light id="requirements">
        <Head eyebrow="Documentation requirements" heading="Documentation Built Around the Project Standard"><p>{req[3]}</p></Head>
        <ul className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {["Project-specific drawing standard", "Network / operator requirements where supplied", "Structural / electrical coordination", "As-built accuracy", "Site documentation consistency", "Revision control"].map((c, k) => <li key={c}><Reveal delay={k * 50}><div className="flex items-center gap-3 border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-slate-900"><Check className="h-4 w-4 shrink-0 text-yellow-700" aria-hidden />{c}</div></Reveal></li>)}
        </ul>
        <p className="mt-4 border-l-2 border-yellow-600 pl-4 text-sm text-slate-600">Documentation is developed against the project information, specifications and standards supplied by the responsible project or engineering team.</p>
      </Light>

      <Dark id="software" deep>
        <Head dark eyebrow="Software" heading="Software Used in This Industry" />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {sw.map((s, k) => <li key={s.slug}><Reveal delay={k * 80} className="h-full"><div className="flex h-full flex-col border border-slate-700 bg-[#0B0F1A]"><PlatformVisual slug={s.slug} label={`${s.name}: illustrative documentation workflow`} /><div className="flex flex-1 flex-col p-5"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-yellow-300">{s.category}</p><h3 className="mt-1 text-lg font-semibold text-white">{s.name}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{SW_ROLE[s.slug]}</p><Link href={`/software/${s.slug}`} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-white underline-offset-4 hover:text-yellow-300 hover:underline">Explore {s.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link></div></div></Reveal></li>)}
        </ul>
      </Dark>

      <Light id="projects">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="Portfolio" heading="Illustrative Related Projects" description="Illustrative examples — not energy-sector client projects." /><Link href="/projects" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">All projects →</Link></Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {projs.map((p, k) => (
            <li key={p.slug}><Reveal delay={k * 90} className="h-full"><Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-colors hover:border-slate-900">
              <Glyph k={[0, 5, 1][k]} />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-3"><span className="font-mono text-xs uppercase tracking-[0.16em] text-yellow-800">{p.discipline}</span>{p.isPlaceholder ? <span className="border border-amber-500 bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] uppercase text-amber-800">Illustrative example</span> : null}</div>
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
        <p className="mt-6 border-l-2 border-amber-500 pl-4 text-sm text-slate-600">CAD, drafting, documentation and coordination support — engineering design approval, certification, utility approval and regulatory responsibility remain with the responsible project or engineering team.</p>
        <p className="mt-4 text-sm text-slate-600">See also: {link("/industries", "All industries")} · {link("/services", "All services")}</p>
      </Light>

      <section id="faq" className="border-t border-slate-200 bg-white py-20 sm:py-28">
        <JsonLd data={faqJsonLd(i.faqs)} />
        <Container>
          <Reveal><SectionHeading eyebrow="FAQs" heading="Frequently Asked Questions" /></Reveal>
          <div className="mt-10"><FaqBrowser groups={groupFaqs(i.faqs)} /></div>
        </Container>
      </section>

      <section className="border-t border-slate-800 bg-[#0B0F1A] py-20 text-white sm:py-24">
        <Container className="grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Get a Quote for Your Energy Project</h2>
            <p className="mt-4 text-lg text-slate-300">Tell us what you need and our team can review the project requirements.</p>
            <div className="mt-8"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button></div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <svg aria-hidden viewBox="0 0 20 400" className="absolute left-4 top-0 h-full w-5"><path d="M10 10V390" stroke={E.elec} strokeWidth="1.5" className="rch-flow" /></svg>
            <ol className="relative space-y-2.5 pl-12 font-mono text-[11px] uppercase tracking-[0.1em]">{["Site", "Civil", "Structural", "Electrical", "Coordinated documentation", "As-built", "Asset handover"].map((s, k, a) => <li key={s} className={cn("border px-4 py-2.5", k === a.length - 1 ? "border-yellow-400 bg-yellow-400/10 text-white" : "border-slate-600 text-slate-200")}>{s}</li>)}</ol>
          </div>
        </Container>
      </section>
    </>
  );
}
