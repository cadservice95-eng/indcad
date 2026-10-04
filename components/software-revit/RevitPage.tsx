import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Software } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceJsonLd } from "@/lib/jsonld";
import { getServiceBySlug } from "@/data/services";
import { getIndustryBySlug } from "@/data/industries";
import { cn } from "@/lib/utils";
import { RevitScene } from "@/components/revit/RvtScene";
import { HeroModel, ClashView, LodView, DataView, ScanView, PhasingView } from "./RevitClient";

/* ───────── small diagrams (labels decorative; meaning stays in HTML) ───────── */
const ln = (c: string, w = 1.4) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;
const mono = { fontFamily: "var(--font-mono)" } as const;
function Box({ x, y, w, h, c, label, sub, fill = "#fff" }: { x: number; y: number; w: number; h: number; c: string; label: string; sub?: string; fill?: string }) {
  return <g><rect x={x} y={y} width={w} height={h} {...ln(c, 1.4)} fill={fill} /><text x={x + w / 2} y={y + h / 2 + (sub ? -2 : 4)} textAnchor="middle" fontSize="11" fill="#0F172A" style={mono}>{label}</text>{sub ? <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize="9" fill="#64748B" style={mono}>{sub}</text> : null}</g>;
}
function WorkshareVisual() {
  return (
    <svg viewBox="0 0 520 240" className="mx-auto block h-auto w-full max-w-[760px]" role="img" aria-label="Discipline teams working in separate linked models, each divided into worksets, combined for coordination">
      <rect width="520" height="240" fill="#F8FAFC" />
      {[["ARCH.rvt", "#64748B", 30], ["STR.rvt", "#2563EB", 190], ["MEP.rvt", "#0891B2", 350]].map(([n, c, x]) => (
        <g key={n as string}><Box x={x as number} y={20} w={140} h={44} c={c as string} label={n as string} sub="linked model" />
          {[0, 1, 2].map((k) => <rect key={k} x={(x as number) + 8 + k * 44} y="72" width="36" height="20" {...ln(c as string, 0.8)} fill="#fff" />)}
          <text x={(x as number) + 70} y="108" textAnchor="middle" fontSize="8" fill="#64748B" style={mono}>worksets</text>
          <path d={`M${(x as number) + 70} 116L260 160`} {...ln(c as string, 1)} strokeDasharray="4 3" />
        </g>
      ))}
      <Box x={170} y={160} w={180} h={50} c="#1E3A8A" label="Federated / coordination" sub="shared coordinates" fill="#EFF6FF" />
    </svg>
  );
}
function HandoverVisual() {
  return (
    <svg viewBox="0 0 520 170" className="mx-auto block h-auto w-full max-w-[760px]" role="img" aria-label="Revit model passes selected asset information to the facilities team">
      <rect width="520" height="170" fill="#F8FAFC" />
      <Box x={20} y={50} w={130} h={60} c="#1E3A8A" label="Revit model" sub="as-built" />
      <path d="M156 80h40M190 75l6 5-6 5" {...ln("#64748B", 1.4)} />
      <rect x="206" y="30" width="150" height="100" {...ln("#0891B2", 1.2)} fill="#fff" />
      {["Asset ID", "Manufacturer", "Warranty ref", "Maintenance", "Access"].map((t, k) => <text key={t} x="216" y={50 + k * 17} fontSize="9" fill="#0F172A" style={mono}>{`□ ${t}`}</text>)}
      <path d="M362 80h40M396 75l6 5-6 5" {...ln("#64748B", 1.4)} />
      <Box x={412} y={50} w={90} h={60} c="#16A34A" label="FM team" sub="operations" />
    </svg>
  );
}
function IfcVisual() {
  return (
    <svg viewBox="0 0 520 150" className="mx-auto block h-auto w-full max-w-[760px]" role="img" aria-label="Revit exports IFC to another platform and back, with a check after each exchange">
      <rect width="520" height="150" fill="#F8FAFC" />
      <Box x={20} y={45} w={110} h={56} c="#1E3A8A" label="Revit" />
      <Box x={205} y={45} w={110} h={56} c="#D97706" label="IFC" sub="agreed settings" />
      <Box x={390} y={45} w={110} h={56} c="#0891B2" label="Other platform" sub="structural / MEP" />
      <path d="M134 66h66M194 61l6 5-6 5M320 66h66M380 61l6 5-6 5" {...ln("#64748B", 1.3)} />
      <path d="M386 84h-66M326 79l-6 5 6 5M200 84h-66M140 79l-6 5 6 5" {...ln("#94A3B8", 1.1)} strokeDasharray="4 3" />
      {[167, 353].map((x) => <g key={x}><circle cx={x} cy="122" r="9" {...ln("#16A34A", 1.3)} fill="#fff" /><path d={`M${x - 4} 122l3 3 5 -6`} {...ln("#16A34A", 1.4)} /></g>)}
      <text x="260" y="140" textAnchor="middle" fontSize="9" fill="#64748B" style={mono}>geometry + parameters checked after each exchange</text>
    </svg>
  );
}

/* ───────── layout ───────── */
function Sec({ id, tint, dark, children }: { id: string; tint?: boolean; dark?: boolean; children: React.ReactNode }) {
  return <section id={id} className={cn("scroll-mt-20 border-t py-16 sm:py-24", dark ? "border-slate-800 bg-[#0B1B33] text-white" : tint ? "border-slate-200 bg-[#F1F4F9]" : "border-slate-200 bg-white")}><Container>{children}</Container></section>;
}
function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      {children ? <div className={cn("space-y-4 text-[15px] leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div> : null}
    </Reveal>
  );
}
function Chips({ items, dark }: { items: string[]; dark?: boolean }) {
  return <ul className="flex flex-wrap gap-1.5 font-mono text-[10.5px] uppercase">{items.map((x) => <li key={x} className={cn("border px-2 py-1", dark ? "border-slate-600 text-slate-200" : "border-slate-300 bg-white text-slate-700")}>{x}</li>)}</ul>;
}
function Card({ title, children, dark }: { title: string; children: React.ReactNode; dark?: boolean }) {
  return <div className={cn("h-full border p-5", dark ? "border-slate-700 bg-slate-900/50" : "border-slate-300 bg-white")}><h3 className={cn("text-base font-semibold", dark ? "text-white" : "text-slate-900")}>{title}</h3><div className={cn("mt-2 space-y-2 text-sm leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div></div>;
}

const VS: [string, string, string][] = [
  ["2D drafting", "Strong", "Supported"],
  ["3D building model", "General CAD only", "Core capability"],
  ["BIM data (parameters, categories)", "Limited", "Core capability"],
  ["Architectural / structural / MEP modelling", "Possible as linework", "Strong — discipline tools"],
  ["Multidisciplinary coordination", "Limited", "Strong — linked & federated models"],
  ["Model-derived schedules", "Limited", "Strong"],
  ["Clash coordination", "External / limited workflow", "Strong BIM workflow (often with Navisworks)"],
  ["Parametric components", "Blocks / dynamic blocks", "Revit families"],
  ["Model-based documentation", "Limited", "Core workflow"],
];
const DELIVER = [
  ["Coordinated Revit models", "Discipline-specific or coordinated models structured to the project's agreed requirements."],
  ["Model-derived drawing sets", "Plans, sections, elevations, details and schedules generated from the coordinated model."],
  ["Revit families", "Custom components for project-specific equipment, fittings and other non-standard objects."],
  ["Federated models", "Combined discipline models used for multidisciplinary coordination and clash review."],
  ["Scan-to-BIM models", "Existing-condition Revit models developed from point-cloud or laser-scan data."],
];
const IND: Record<string, string> = {
  construction: "Commercial, residential and institutional buildings — architectural, structural and MEP models with coordinated documentation.",
  manufacturing: "Industrial facilities and factory buildings, where structure, services and equipment space need to be coordinated.",
  energy: "Buildings and structures on energy sites — substation buildings, control rooms and plant facilities.",
};

export function RevitPage({ item }: { item: Software }) {
  const o = (h: string) => item.overview.find((s) => s.heading?.startsWith(h))?.paragraphs ?? [];
  const [plat, clashFam, work, hand, phase, down, rend] = ["A Common", "Clash", "Worksharing", "Planning", "Phasing", "Downstream", "Rendering"].map(o);
  const svc = (slug: string) => { const v = getServiceBySlug(slug); return v ? `/services/${v.category}/${v.slug}` : "/services"; };
  const a = (href: string, t: string, dark?: boolean) => <Link href={href} className={cn("font-medium underline underline-offset-4", dark ? "text-white hover:text-sky-300" : "text-slate-900 hover:text-blue-700")}>{t}</Link>;
  const svcs = item.relatedServices.flatMap((s) => { const v = getServiceBySlug(s); return v ? [v] : []; });
  const inds = item.relatedIndustries.flatMap((s) => { const v = getIndustryBySlug(s); return v ? [v] : []; });

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: "Revit modelling and BIM coordination", description: item.seoDescription, path: `/software/${item.slug}` })} />

      <section className="relative overflow-hidden bg-[#0B1B33] pb-14 pt-12 text-white sm:pb-20 sm:pt-16">
        <Container className="relative grid gap-10 [&>*]:min-w-0 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sky-300">{item.category} · Software we work in</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">{item.name}</h1>
            <p className="mt-5 text-xl leading-snug text-slate-100">BIM modelling and coordinated documentation for architecture, structure and MEP projects.</p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">We model in Revit to your project&apos;s standard — discipline models, BIM coordination and clash review, custom families, model-derived drawings and schedules, Scan-to-BIM, and support for models already in progress.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#deliverables" size="lg" variant="outline-light">What we deliver</Button></div>
            <p className="mt-6 text-xs text-slate-500">Revit is a product of Autodesk, Inc. Render CAD Hub is an independent BIM service that uses Revit and is not affiliated with Autodesk.</p>
          </div>
          <Reveal><HeroModel /></Reveal>
        </Container>
      </section>

      <Sec id="bim">
        <Head eyebrow="Revit & BIM" heading="What Revit Is — and Why Coordinated BIM Matters"><p>{plat[0]}</p><p>{plat[1]}</p></Head>
        <Reveal className="mt-8"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">The value grows as disciplines share one environment</p><div className="mt-2"><Chips items={["Architecture", "Structure", "Mechanical", "Electrical", "Plumbing", "Linked models", "Shared coordinates", "Federated review", "Issue tracking"]} /></div><p className="mt-3 text-sm text-slate-500">Not every project needs BIM — for simpler 2D packages, {a("/software/autocad", "AutoCAD drafting and documentation")} is often the lighter route.</p></Reveal>
      </Sec>

      <Sec id="vs-autocad" tint>
        <Head eyebrow="Choosing the tool" heading="Revit vs AutoCAD: When BIM Adds Value"><p>AutoCAD is primarily drawing- and documentation-oriented; Revit is model-, data- and coordination-oriented. Each is the right tool for different deliverables.</p></Head>
        <Reveal className="mt-10"><div className="overflow-x-auto border border-slate-300 bg-white">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <caption className="sr-only">AutoCAD compared with Revit by requirement</caption>
            <thead><tr className="border-b border-slate-300 bg-slate-50 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500"><th scope="col" className="px-4 py-3 font-normal">Requirement</th><th scope="col" className="px-4 py-3 font-normal">AutoCAD</th><th scope="col" className="px-4 py-3 font-normal">Revit</th></tr></thead>
            <tbody>{VS.map(([r, x, y]) => <tr key={r} className="border-b border-slate-100"><th scope="row" className="px-4 py-3 font-medium text-slate-900">{r}</th><td className="px-4 py-3 text-slate-700">{x}</td><td className="px-4 py-3 text-slate-700">{y}</td></tr>)}</tbody>
          </table>
        </div></Reveal>
      </Sec>

      <Sec id="disciplines">
        <Head eyebrow="By discipline" heading="Revit Modelling by Discipline"><p>Architectural, structural and MEP models are produced individually or as a coordinated set — see {a(svc("revit-modelling"), "Revit modelling")} for the full service.</p></Head>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {[["Architectural", { levels: true, arch: true }, "Walls, floors, roofs, openings, rooms and finishes."], ["Structural", { levels: true, struct: true }, "Grids, columns, beams, slabs and foundations."], ["MEP", { levels: true, mep: true }, "Ductwork, pipework, equipment and cable containment."]].map(([t, L, d]) => <li key={t as string}><Reveal className="h-full"><div className="h-full border border-slate-300 bg-white"><RevitScene layers={L as { levels?: boolean; arch?: boolean; struct?: boolean; mep?: boolean }} className="block h-auto w-full" title={`${t as string} Revit model`} /><div className="border-t border-slate-200 p-4"><h3 className="text-base font-semibold text-slate-900">{t as string}</h3><p className="mt-1 text-sm text-slate-600">{d as string}</p></div></div></Reveal></li>)}
        </ul>
      </Sec>

      <Sec id="lod" tint>
        <Head eyebrow="Level of development" heading="Revit Modelling to an Agreed Level of Development"><p>Level of development describes how far an element has been developed — and how reliable its information is — not simply how detailed it looks. The right level depends on project stage, intended use, discipline, coordination and documentation needs, and handover requirements.</p><p>Over-modelling too early spends effort on decisions that will change; under-modelling leaves gaps that surface in coordination.</p></Head>
        <Reveal className="mt-10"><LodView /></Reveal>
      </Sec>

      <Sec id="bep">
        <Head eyebrow="BIM execution plan" heading="Working Within an Existing BIM Execution Plan"><p>Where a project already has a BEP, we work inside it rather than substituting an internal convention — swapping standards mid-project undermines the coordination the plan exists to protect.</p></Head>
        <Reveal className="mt-8"><Chips items={["Naming conventions", "Model structure", "Coordinates", "File exchange", "Model division", "Worksets", "Shared parameters", "Deliverable requirements", "Coordination procedures"]} /></Reveal>
      </Sec>

      <Sec id="clash" dark>
        <Head dark eyebrow="Coordination" heading="Revit Clash Detection and Multidisciplinary Coordination"><p>{clashFam[0]}</p><p>Clash detection is a coordination aid — it finds conflicts in what has been modelled, but resolving them is a design decision for the responsible team. For multidisciplinary coordination and clash review, see {a(svc("bim-services"), "BIM modelling & coordination", true)}.</p></Head>
        <div className="mt-10 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
          <Reveal><ClashView /></Reveal>
          <Reveal delay={100}><div className="space-y-4"><Card dark title="Typical conflicts"><ul className="space-y-1">{["Structural beam vs duct", "Pipe vs structural member", "Cable tray vs ceiling", "Equipment vs architectural clearance", "Plumbing vs structural opening", "Services competing for ceiling space"].map((x) => <li key={x} className="flex gap-2"><span aria-hidden className="text-orange-400">●</span>{x}</li>)}</ul></Card>
            <ol className="flex flex-wrap gap-1.5 font-mono text-[10px] uppercase">{["Discipline models", "Federation", "Clash review", "Resolution", "Updated models", "Documentation"].map((s, k) => <li key={s} className="flex items-center gap-1.5">{k ? <span aria-hidden className="text-sky-400">→</span> : null}<span className="border border-slate-600 px-2 py-1 text-slate-200">{s}</span></li>)}</ol></div></Reveal>
        </div>
      </Sec>

      <Sec id="families">
        <Head eyebrow="Families" heading="Custom Revit Family Creation"><p>{clashFam[1]}</p><p>A family that looks correct in 3D but reports the wrong category, type or parameter breaks schedules and tags. Complexity is kept proportionate — more parametric behaviour than the project needs only makes a family harder to maintain.</p></Head>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Reveal className="h-full"><Card title="Typical custom families"><Chips items={["Equipment", "Fixtures", "Façade components", "Furniture", "Mechanical equipment", "Electrical equipment", "Manufacturer-specific objects", "Non-standard components"]} /></Card></Reveal>
          <Reveal delay={100} className="h-full"><Card title="What a family has to get right"><Chips items={["Category", "Types", "Parameters", "Schedules", "Tags", "Visibility / detail levels", "Geometry", "Connectors (MEP)"]} /></Card></Reveal>
        </div>
      </Sec>

      <Sec id="worksharing" tint>
        <Head eyebrow="Worksharing" heading="Revit Worksharing and Model Organisation"><p>{work[0]}</p><p>Model organisation should follow the actual project and team workflow — more worksets than people and zones need only add overhead.</p></Head>
        <Reveal className="mt-10"><div className="border border-slate-300"><WorkshareVisual /></div></Reveal>
      </Sec>

      <Sec id="data" dark>
        <Head dark eyebrow="Model information" heading="Revit Schedules, Tags and Model Data"><p>{work[1]}</p><p>BIM isn&apos;t just geometry. Schedules, tags, quantities, room data, door and window schedules, equipment information and materials all come from parameters — and a visually correct model can still carry poor or inconsistent information.</p></Head>
        <Reveal className="mt-10"><DataView /></Reveal>
      </Sec>

      <Sec id="parameters">
        <Head eyebrow="Data standards" heading="Shared Parameters and Consistent BIM Data"><p>{down[1]}</p></Head>
        <Reveal className="mt-8"><Chips items={["Project parameters", "Shared parameters", "Naming conventions", "Parameter consistency", "Schedules", "Tags", "Downstream data requirements"]} /></Reveal>
      </Sec>

      <Sec id="phasing" tint>
        <Head eyebrow="Renovation & retrofit" heading="Revit Phasing for Existing, Demolition and New Work"><p>{phase[0]}</p></Head>
        <Reveal className="mt-10"><PhasingView /></Reveal>
      </Sec>

      <Sec id="sheets">
        <Head eyebrow="Documentation" heading="Revit Sheets, Views and Documentation"><p>{phase[1]}</p><p>{a(svc("architectural-drafting"), "Architectural drafting")} covers 2D documentation where a full model isn&apos;t required.</p></Head>
        <Reveal className="mt-8"><Chips items={["Views", "View templates", "Sheets", "Sheet numbering", "View naming", "Annotation", "Schedules on sheets", "Model-derived drawing sets"]} /></Reveal>
      </Sec>

      <Sec id="scan" dark>
        <Head dark eyebrow="Existing buildings" heading="Scan-to-BIM with Revit"><p>Laser scans and point clouds become existing-condition Revit models for renovation, retrofit and as-built documentation. The model detail that&apos;s achievable depends on the project&apos;s requirements and the quality and coverage of the scan — it isn&apos;t perfect by default. See {a(svc("scan-to-bim"), "Scan to BIM", true)}.</p></Head>
        <Reveal className="mt-10"><ScanView /></Reveal>
      </Sec>

      <Sec id="handover">
        <Head eyebrow="Handover" heading="Revit Models for Handover and Asset Information"><p>{hand[0]}</p><p>A design or construction model doesn&apos;t automatically become an asset database — only the information the project actually requires is planned in.</p></Head>
        <Reveal className="mt-10"><div className="border border-slate-300"><HandoverVisual /></div></Reveal>
        <Reveal className="mt-6"><div className="border-l-4 border-blue-700 bg-[#F1F4F9] px-5 py-4"><h3 className="text-base font-semibold text-slate-900">Setting up a team&apos;s first Revit project</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{hand[1]}</p></div></Reveal>
      </Sec>

      <Sec id="downstream" tint>
        <Head eyebrow="Downstream uses" heading="Preparing Revit Models for Downstream Uses"><p>{down[0]}</p></Head>
        <Reveal className="mt-8"><Chips items={["Quantity take-off", "Energy analysis", "Facilities management", "Asset information", "Construction planning / 4D", "Model-based documentation"]} /><p className="mt-3 text-sm text-slate-500">None of these come automatically — the information each needs has to be planned into the model.</p></Reveal>
      </Sec>

      <Sec id="ifc">
        <Head eyebrow="Interoperability" heading="Revit and BIM Interoperability"><p>{rend[1]}</p></Head>
        <Reveal className="mt-10"><div className="border border-slate-300"><IfcVisual /></div></Reveal>
      </Sec>

      <Sec id="rendering" tint>
        <Head eyebrow="Visualisation" heading="Rendering From the Same Model"><p>{rend[0]}</p><p>Revit&apos;s primary value is BIM modelling and documentation. Where presentation visuals are needed, the coordinated model can also support our {a(svc("3d-rendering"), "3D rendering")} workflow.</p></Head>
      </Sec>

      <Sec id="deliverables">
        <div className="grid gap-10 [&>*]:min-w-0 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal><SectionHeading eyebrow="Used for" heading="What Revit Is Used For Here" /><ul className="mt-6 space-y-2">{[...item.usedFor, "Existing-condition modelling", "Renovation and phasing", "As-built BIM and handover", "Federated model coordination"].map((u) => <li key={u} className="flex gap-2 text-sm text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" aria-hidden />{u}</li>)}</ul></Reveal>
          <div>
            <Reveal><SectionHeading eyebrow="Deliverables" heading="Typical Deliverables" /></Reveal>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">{DELIVER.map(([t, d], k) => <li key={t}><Reveal delay={k * 50} className="h-full"><div className="h-full border border-slate-300 bg-white p-5"><span className="font-mono text-[10px] text-blue-700">{String(k + 1).padStart(2, "0")}</span><h3 className="mt-1 text-base font-semibold text-slate-900">{t}</h3><p className="mt-1.5 text-sm text-slate-600">{d}</p></div></Reveal></li>)}</ul>
          </div>
        </div>
      </Sec>

      <Sec id="industries" tint>
        <Head eyebrow="Industries" heading="Where Revit Modelling Is Used" />
        <ul className="mt-10 grid gap-3 md:grid-cols-3">
          {inds.map((i, k) => <li key={i.slug}><Reveal delay={k * 50} className="h-full"><Link href={`/industries/${i.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><h3 className="flex items-center justify-between text-base font-semibold text-slate-900">{i.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></h3><p className="mt-1.5 text-sm text-slate-600">{IND[i.slug] ?? i.heroDescription}</p></Link></Reveal></li>)}
        </ul>
      </Sec>

      <Sec id="services">
        <Head eyebrow="Related services" heading="BIM Services Delivered in Revit" />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {svcs.map((s, k) => <li key={s.slug}><Reveal delay={k * 40} className="h-full"><Link href={`/services/${s.category}/${s.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><h3 className="flex items-center justify-between text-base font-semibold text-slate-900">{s.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></h3><p className="mt-1.5 text-sm text-slate-600">{s.shortDescription}</p></Link></Reveal></li>)}
        </ul>
      </Sec>

      <FAQ items={item.faqs} heading="Revit & BIM FAQs" />

      <section className="border-t border-slate-800 bg-[#0B1B33] py-16 text-white sm:py-20">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div><h2 className="text-3xl font-semibold tracking-tight">Get a Quote for Revit Work</h2><p className="mt-3 max-w-xl text-slate-300">Share your BEP or standards, the disciplines involved, the stage and what the model needs to support — we&apos;ll review the requirements and scope it.</p></div>
          <Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button>
        </Container>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700 bg-[#0B1B33]/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/get-a-quote" className="flex min-h-[44px] items-center justify-center bg-copper-500 text-sm font-semibold text-white">Get a Free Quote</Link>
      </div>
      <div aria-hidden className="h-[68px] md:hidden" />
    </>
  );
}
