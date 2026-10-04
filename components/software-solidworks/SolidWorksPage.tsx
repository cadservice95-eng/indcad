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
import { makeIso, seg } from "@/components/svg/iso";
import { FeatureTreeModel } from "@/components/cad3d/FeatureTreeModel";
import { AssemblyExploded } from "@/components/cad3d/AssemblyExploded";
import { ConfigurationModel } from "@/components/cad3d/ConfigurationModel";
import { SheetMetalGraphic } from "@/components/svg/SheetMetalGraphic";
import { ReverseEngineeringGraphic } from "@/components/svg/ReverseEngineeringGraphic";
import { SimulationPrep } from "@/components/svg/SimulationPrep";
import { S, ln, T, dl, Frame, Bracket, IsoBox } from "./parts";
import { TopDownView, StackView, ExportView } from "./SolidWorksClient";

/* ───────── visuals ───────── */
function HeroVisual() {
  const p = makeIso(340, 150, 1.85);
  const tree = ["Sketch1 · base profile", "Boss-Extrude1", "Boss-Extrude2 · upright", "Cut-Extrude1 · holes", "Fillet1"];
  return (
    <Frame w={560} h={380} label="Illustrative SolidWorks part: a feature tree on the left builds an L-bracket driven by a length parameter" className="block h-auto w-full">
      <g className="fade-in" style={dl(100)}>
        <rect x="18" y="22" width="170" height="168" {...ln(S.mute, 0.8)} fill={S.panel} />
        <T x={30} y={42} c={S.sky}>FEATURE TREE</T>
        {tree.map((f, k) => <g key={f} className="fade-in" style={dl(300 + k * 260)}><rect x="30" y={56 + k * 24} width="9" height="9" {...ln(S.cu, 1)} /><T x={46} y={64 + k * 24} s={8.5}>{f}</T></g>)}
      </g>
      <g className="fade-in" style={dl(500)}><Bracket ox={340} oy={150} s={1.85} /></g>
      <g className="fade-in" style={dl(1700)}>
        <path d={`${seg(p(0, 63, 0), p(0, 80, 0))}${seg(p(110, 63, 0), p(110, 80, 0))}`} {...ln(S.grn, 0.7)} />
        <path d={seg(p(0, 76, 0), p(110, 76, 0))} {...ln(S.grn, 1)} />
        <T x={p(55, 76, 0)[0] - 24} y={p(55, 76, 0)[1] + 34} c={S.grn}>L = 110</T>
      </g>
      <g className="fade-in" style={dl(2000)}>
        <rect x="18" y="214" width="170" height="74" {...ln(S.mute, 0.8)} fill={S.panel} />
        <T x={30} y={234} c={S.sky}>CONFIGURATIONS</T>
        {["BR-110 · default", "BR-150", "BR-200"].map((c, k) => <T key={c} x={30} y={252 + k * 14} s={8.5} c={k ? S.mute : S.w}>{c}</T>)}
      </g>
      <g className="fade-in" style={dl(2300)}>
        <T x={18} y={318} c={S.mute}>PART → ASSEMBLY → DRAWING → BOM → STEP</T>
        <T x={18} y={360} c={S.mute} s={8}>ILLUSTRATIVE EXAMPLE</T>
      </g>
    </Frame>
  );
}

function DrawingVisual() {
  const hatch = Array.from({ length: 9 }, (_, k) => <path key={k} d={`M${392 + k * 10} 196l-14 30`} {...ln(S.line, 0.6)} />);
  return (
    <Frame w={680} h={380} label="Illustrative manufacturing drawing: front and top views, section A-A, dimensions with tolerances, a geometric tolerance frame, notes and a title block">
      <rect x="14" y="14" width="652" height="352" {...ln(S.w, 0.9)} />
      {/* front view */}
      <path d="M60 230H260V214H80V120H60Z" {...ln(S.w, 1.3)} />
      <path d="M210 214V230M232 214V230" {...ln(S.line, 0.8)} strokeDasharray="4 3" />
      <path d="M60 254H260M60 248v12M260 248v12" {...ln(S.grn, 0.8)} /><T x={160} y={250} a="middle" c={S.grn}>110 ±0.2</T>
      <path d="M40 120V230M34 120h12M34 230h12" {...ln(S.grn, 0.8)} /><T x={30} y={180} a="end" c={S.grn}>64</T>
      <T x={60} y={286} c={S.mute}>FRONT</T>
      {/* top view */}
      <rect x="60" y="40" width="200" height="56" {...ln(S.w, 1.1)} transform="translate(0 0)" />
      <path d="M80 40V96" {...ln(S.w, 0.9)} />
      <circle cx="221" cy="56" r="7" {...ln(S.w, 1)} /><circle cx="221" cy="80" r="7" {...ln(S.w, 1)} />
      <path d="M210 56h22M221 45v22M210 80h22M221 69v22" {...ln(S.red, 0.6)} strokeDasharray="6 2 1 2" />
      <path d="M240 56H300" {...ln(S.grn, 0.7)} /><T x={304} y={59} c={S.grn}>2× Ø7 THRU</T>
      <path d="M150 30V106" {...ln(S.cu, 0.9)} strokeDasharray="10 3 2 3" /><T x={150} y={26} a="middle" c={S.cu}>A</T><T x={150} y={118} a="middle" c={S.cu}>A</T>
      {/* section */}
      <path d="M380 196H480V226H380Z" {...ln(S.w, 1.2)} />
      <g>{hatch}</g>
      <path d="M380 120H396V196" {...ln(S.w, 1.2)} /><path d="M380 120V196" {...ln(S.w, 1.2)} />
      <T x={380} y={250} c={S.mute}>SECTION A–A</T>
      {/* GD&T */}
      <g transform="translate(380 70)"><rect width="150" height="22" {...ln(S.sky, 1)} /><path d="M30 0V22M96 0V22M122 0V22" {...ln(S.sky, 1)} /><path d="M9 6h12v10H9z" {...ln(S.sky, 1)} /><T x={63} y={15} a="middle" c={S.sky}>0.1</T><T x={109} y={15} a="middle" c={S.sky}>A</T><T x={136} y={15} a="middle" c={S.sky}>B</T></g>
      <T x={380} y={110} c={S.mute} s={8}>FLATNESS / DATUM REFERENCES</T>
      {/* notes + title block */}
      <T x={34} y={316} c={S.mute} s={8}>NOTES: 1. REMOVE ALL SHARP EDGES  2. FINISH: ZINC PLATE</T>
      <path d="M440 290H666M440 316H666M440 290V366M540 316V366M610 316V366" {...ln(S.w, 0.8)} />
      <T x={448} y={307}>BRACKET · BR-110</T>
      <T x={448} y={334} c={S.mute} s={8}>MATL S275</T><T x={548} y={334} c={S.mute} s={8}>SCALE 1:2</T><T x={618} y={334} c={S.mute} s={8}>REV B</T>
      <T x={448} y={354} c={S.mute} s={8}>ILLUSTRATIVE</T>
    </Frame>
  );
}

function WeldmentVisual() {
  const p = makeIso(240, 178, 1.7);
  const t = 5;
  const H = 70;
  const parts: [number, number, number, number, number, number][] = [
    [0, 0, 0, t, t, H], [0, t, H - t, t, 60 - t, H], [t, 0, H - t, 100 - t, t, H], [100 - t, 0, 0, 100, t, H],
    [0, 60 - t, 0, t, 60, H], [t, 60 - t, H - t, 100 - t, 60, H], [100 - t, t, H - t, 100, 60 - t, H], [100 - t, 60 - t, 0, 100, 60, H],
    [t, 60 - t, 14, 100 - t, 60, 14 + t],
  ];
  const tag = (n: number, x: number, y: number, z: number) => { const c = p(x, y, z); return <g key={n}><circle cx={c[0] + 18} cy={c[1] - 14} r="8" {...ln(S.cu, 1)} fill={S.bg} /><T x={c[0] + 18} y={c[1] - 11} a="middle" c={S.cu} s={8}>{n}</T><path d={`M${c[0]} ${c[1]}L${c[0] + 12} ${c[1] - 9}`} {...ln(S.cu, 0.8)} /></g>; };
  return (
    <Frame w={520} h={330} label="Illustrative welded frame built from square hollow section members, with balloons matching a cut list" className="block h-auto w-full">
      {parts.map((b, k) => <IsoBox key={k} p={p} b={b} sw={0.9} />)}
      {tag(1, 100, 60, 35)}{tag(2, 50, 0, H)}{tag(3, 100, 30, H)}{tag(4, 50, 60, 16)}
      <T x={16} y={316} c={S.mute} s={8}>ILLUSTRATIVE EXAMPLE · SHS FRAME</T>
    </Frame>
  );
}
const CUT = [["1", "SHS 40×40×3", "700", "4"], ["2", "SHS 40×40×3", "1000 · mitred", "2"], ["3", "SHS 40×40×3", "600 · mitred", "2"], ["4", "SHS 40×40×3", "900", "1"]];

function SurfaceVisual() {
  const shell = (ox: number, c: string, fill?: boolean) => (
    <g transform={`translate(${ox} 0)`}>
      <path d="M20 170C20 110 60 70 120 70C180 70 220 110 220 170Z" {...ln(c, 1.4)} fill={fill ? "#1E3350" : "none"} />
      {!fill ? [0.25, 0.5, 0.75].map((f) => <path key={f} d={`M${20 + 200 * f} 170C${20 + 200 * f} ${150 - 60 * Math.sin(Math.PI * f)} ${20 + 200 * f} ${120 - 40 * Math.sin(Math.PI * f)} ${20 + 200 * f} ${170 - 100 * Math.sin(Math.PI * f) + 4}`} {...ln(c, 0.6)} />) : null}
      {!fill ? [0.35, 0.65].map((f) => <path key={f} d={`M${20 + 30 * f} ${170 - 60 * f}C80 ${150 - 70 * f} 160 ${150 - 70 * f} ${220 - 30 * f} ${170 - 60 * f}`} {...ln(c, 0.6)} />) : null}
      {fill ? <path d="M30 170C30 116 66 80 120 80C174 80 210 116 210 170" {...ln(S.line, 0.8)} strokeDasharray="4 3" /> : null}
    </g>
  );
  return (
    <Frame w={820} h={250} label="Surface modelling: boundary surfaces define a curved enclosure, are knitted together, then thickened into a solid">
      {shell(10, S.sky)}{shell(290, S.cu)}{shell(570, S.line, true)}
      {[260, 540].map((x) => <path key={x} d={`M${x} 130h20M${x + 14} 124l6 6-6 6`} {...ln(S.mute, 1.2)} />)}
      <T x={130} y={210} a="middle" c={S.sky}>1 · BOUNDARY SURFACES</T>
      <T x={410} y={210} a="middle" c={S.cu}>2 · TRIM &amp; KNIT</T>
      <T x={690} y={210} a="middle" c={S.line}>3 · THICKEN → SOLID</T>
      <T x={16} y={238} c={S.mute} s={8}>ILLUSTRATIVE EXAMPLE</T>
    </Frame>
  );
}

/* ───────── layout ───────── */
function Sec({ id, tint, dark, children }: { id: string; tint?: boolean; dark?: boolean; children: React.ReactNode }) {
  return <section id={id} className={cn("scroll-mt-20 border-t py-16 sm:py-24", dark ? "border-slate-800 bg-ink-950 text-white" : tint ? "border-slate-200 bg-[#F3F5F8]" : "border-slate-200 bg-white")}><Container>{children}</Container></section>;
}
function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      {children ? <div className={cn("space-y-4 text-[15px] leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div> : null}
    </Reveal>
  );
}
function Chips({ items, dark }: { items: string[]; dark?: boolean }) {
  return <ul className="flex flex-wrap gap-1.5 font-mono text-[10.5px] uppercase">{items.map((x) => <li key={x} className={cn("border px-2 py-1", dark ? "border-slate-600 text-slate-200" : "border-slate-300 bg-white text-slate-700")}>{x}</li>)}</ul>;
}
const Fig = ({ children, className }: { children: React.ReactNode; className?: string }) => <Reveal className={cn("overflow-hidden border border-slate-700 bg-ink-950", className)}>{children}</Reveal>;
const Note = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => <div className={cn("border-l-4 border-copper-500 px-5 py-4 text-sm leading-relaxed", dark ? "bg-slate-900/60 text-slate-300" : "bg-white text-slate-600")}>{children}</div>;
function Cards({ items, cols = 4, dark }: { items: [string, React.ReactNode][]; cols?: 3 | 4; dark?: boolean }) {
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
      {items.map(([t, d], k) => <li key={t}><Reveal delay={k * 40} className="h-full"><div className={cn("h-full border p-5", dark ? "border-slate-700 bg-slate-900/50" : "border-slate-300 bg-white")}><h3 className={cn("text-base font-semibold", dark ? "text-white" : "text-slate-900")}>{t}</h3><p className={cn("mt-1.5 text-sm leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{d}</p></div></Reveal></li>)}
    </ul>
  );
}

const FLOW = [["Sketch", "Fully defined profiles with relations and dimensions."], ["Features", "Extrudes, cuts, patterns and fillets in a stable order."], ["Part", "Material, properties and configurations set."], ["Assembly", "Components located with robust mates."], ["Drawing", "Views, dimensions, tolerances and notes."], ["BOM", "Driven by custom properties."], ["Export", "STEP / IGES / DXF / PDF, checked after export."]];
const DELIVER = [
  ["Parametric 3D part models", "Feature-based SolidWorks parts with clear design intent and editable history."],
  ["Assemblies", "Structured assemblies with deliberate mates, sub-assemblies and standard hardware."],
  ["Manufacturing drawings", "Dimensioned and toleranced part, assembly and fabrication drawings."],
  ["Sheet metal flat patterns", "Flat patterns and DXFs set to the bend data you supply."],
  ["Weldment cut lists", "Structural member frames with cut lists and fabrication drawings."],
  ["Configurations & design tables", "Part families driven from one master model where it fits."],
  ["BOMs & custom properties", "Property-driven BOMs matched to your numbering and procurement fields."],
  ["Neutral exports", "STEP, IGES, Parasolid, DXF and PDF — validated after export."],
];
const IND: Record<string, string> = {
  manufacturing: "Production parts, fixtures, sheet metal and assembly documentation for manufacturing teams.",
  automotive: "Components, brackets, tooling and fixture models with manufacturing drawings.",
  defence: "Mechanical parts and assemblies documented to the controlled standard supplied by the project.",
  aerospace: "Ground support equipment, tooling and component models with drawing packages.",
};
const VS: [string, string, string, string][] = [
  ["Parametric 3D part modelling", "Core strength", "Basic 3D; mainly 2D", "Building elements & families"],
  ["Mechanical assemblies & mates", "Core strength", "Not its focus", "Not its focus"],
  ["Sheet metal & flat patterns", "Built-in tools", "Drawn manually in 2D", "Not its focus"],
  ["Manufacturing drawings from the model", "Associative to the model", "Drawn directly in 2D", "Construction documentation"],
  ["2D drafting & DWG exchange", "Possible; exports DWG/DXF", "Native strength", "Exports DWG"],
  ["Building / BIM coordination", "Not its focus", "Limited", "Core strength"],
];

export function SolidWorksPage({ item }: { item: Software }) {
  const o = (h: string) => item.overview.find((s) => s.heading?.startsWith(h))?.paragraphs ?? [];
  const [plat, asm, cfg, pdm, surf, td, rend] = ["A Primary", "Assembly", "Configuration", "PDM", "Surface", "Top-Down", "Rendering"].map(o);
  const svcs = item.relatedServices.flatMap((s) => { const v = getServiceBySlug(s); return v ? [v] : []; });
  const href = (slug: string) => { const v = svcs.find((x) => x.slug === slug); return v ? `/services/${v.category}/${v.slug}` : "/services"; };
  const lk = (to: string, t: string, dark?: boolean) => <Link href={to} className={cn("font-medium underline underline-offset-4", dark ? "text-white hover:text-sky-300" : "text-slate-900 hover:text-copper-600")}>{t}</Link>;
  const a = (slug: string, t: string, dark?: boolean) => lk(href(slug), t, dark);
  const inds = item.relatedIndustries.flatMap((s) => { const v = getIndustryBySlug(s); return v ? [v] : []; });

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: "SolidWorks 3D CAD modelling and drafting", description: item.seoDescription, path: `/software/${item.slug}` })} />

      <section className="relative overflow-hidden bg-ink-950 pb-14 pt-12 text-white sm:pb-20 sm:pt-16">
        <Container className="relative grid gap-10 [&>*]:min-w-0 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sky-300">{item.category} · Software we work in</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">{item.name}</h1>
            <p className="mt-5 text-xl leading-snug text-slate-100">Parametric 3D CAD modelling, assemblies and manufacturing drawings in SolidWorks.</p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">SolidWorks is a feature-based, parametric mechanical CAD platform. We use it to build part models that stay editable as a design changes, assemblies that move the way the product does, sheet metal and weldments ready for fabrication review, and drawings, BOMs and neutral exports derived from the same model — for manufacturers, fabricators and product teams.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#deliverables" size="lg" variant="outline-light">What we deliver</Button></div>
            <p className="mt-6 text-xs text-slate-500">SolidWorks is a product of Dassault Systèmes. Render CAD Hub is an independent modelling and drafting service that uses SolidWorks and is not affiliated with Dassault Systèmes.</p>
          </div>
          <div data-in="true" className="border border-slate-700"><HeroVisual /></div>
        </Container>
      </section>

      <Sec id="parametric">
        <Head eyebrow="Parametric modelling" heading="Parametric, Feature-Based Modelling"><p>{plat[0]}</p><p>Each part is built from sketches and features in a deliberate order, with dimensions and relations that capture what should change and what should stay fixed. Change a driving dimension and dependent features follow. Try it on the illustrative part below.</p></Head>
        <Reveal className="mt-10"><FeatureTreeModel mode="param" /></Reveal>
      </Sec>

      <Sec id="design-intent" tint>
        <Head eyebrow="Design intent" heading="Design Intent: Models Built to Be Changed"><p>A model that looks right but breaks the first time someone edits it isn&apos;t much use. Design intent is decided before modelling: which dimensions drive the part, which features depend on which, and what references are stable enough to build on.</p></Head>
        <div className="mt-10"><Cards items={[["Fully defined sketches", "Every sketch constrained by dimensions and relations, so nothing moves by accident."], ["Stable references", "Features built from planes, axes and origin — not faces likely to disappear."], ["Meaningful feature order", "Base form first, then functional features, then cosmetic details like fillets."], ["Driving dimensions & equations", "Key sizes linked so a change propagates predictably through the part."]]} /></div>
      </Sec>

      <Sec id="assemblies" dark>
        <Head dark eyebrow="Assemblies & mates" heading="Assemblies With Robust Mate Logic"><p>{asm[0]}</p><p>Standard hardware comes from Toolbox or your own library, sub-assemblies follow how the product is built, and the assembly is tested by changing key dimensions to check it rebuilds cleanly.</p></Head>
        <Reveal className="mt-10"><AssemblyExploded /></Reveal>
        <Reveal className="mt-6"><Chips dark items={["Concentric", "Coincident", "Distance / angle", "Mechanical mates", "Sub-assemblies", "Interference check", "Exploded views", "Large-assembly structure"]} /></Reveal>
      </Sec>

      <Sec id="sheet-metal">
        <Head eyebrow="Sheet metal" heading="Sheet Metal and Flat Patterns"><p>{plat[1]}</p><p>Bend allowance, K-factor or bend tables, radii and reliefs are set from the tooling and material data you provide. We check flat patterns against that process, but a first-article bend on your brake is still the final confirmation — flat patterns aren&apos;t assumed to be correct for every machine.</p></Head>
        <div className="mt-10 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <Fig><div data-in="true"><SheetMetalGraphic className="block h-auto w-full" /></div></Fig>
          <Reveal>
            <ul className="space-y-2">{[["Your bend data", "K-factor, bend allowance or bend tables from your tooling and material."], ["Reliefs & radii", "Bend reliefs, corner treatments and radii set to what your brake can form."], ["Flat pattern checks", "Hole-to-bend distances, overlaps and flat size reviewed before export."], ["DXF for your workflow", "Flat patterns exported for your nesting or cutting process, with bend lines on a separate layer."]].map(([t, d]) => <li key={t} className="border border-slate-300 bg-white px-4 py-3"><h3 className="text-sm font-semibold text-slate-900">{t}</h3><p className="mt-0.5 text-sm text-slate-600">{d}</p></li>)}</ul>
            <div className="mt-4"><Chips items={["Base flange", "Edge flange", "Hems & jogs", "Bend reliefs", "Flat pattern", "DXF export", "Bend notes"]} /></div>
          </Reveal>
        </div>
      </Sec>

      <Sec id="drawings" tint>
        <Head eyebrow="Manufacturing drawings" heading="Manufacturing Drawings From the Model"><p>{asm[1]}</p><p>Associativity keeps geometry consistent, but a drawing still needs judgement: which dimensions the machinist or fabricator needs, the tolerances that matter for function, datums and GD&amp;T where specified, and notes on material and finish. For drawing packages see {a("mechanical-drafting", "mechanical drafting")}.</p></Head>
        <Fig className="mt-10"><DrawingVisual /></Fig>
        <Reveal className="mt-6"><Chips items={["Orthographic views", "Sections & details", "Dimensions & tolerances", "GD&T", "Weld symbols", "Notes & finishes", "Revision tables", "Exploded assembly views"]} /></Reveal>
      </Sec>

      <Sec id="configurations" dark>
        <Head dark eyebrow="Configurations, design tables & BOM" heading="Configurations and Design Tables for Part Families"><p>{cfg[0]}</p><p>Configurations work when variants genuinely share a structure. When they don&apos;t, separate parts are simpler — the choice depends on the family. Each configuration can carry its own part number and properties, so the BOM reports the right variant.</p></Head>
        <Reveal className="mt-10"><ConfigurationModel /></Reveal>
      </Sec>

      <Sec id="workflow">
        <Head eyebrow="Workflow" heading="From Sketch to Released Files"><p>One model drives everything downstream, so the order of work matters. Each step has a check before the next one builds on it.</p></Head>
        <ol className="mt-10 grid gap-px overflow-hidden border border-slate-300 bg-slate-300 sm:grid-cols-2 lg:grid-cols-7">
          {FLOW.map(([t, d], k) => <li key={t} className="bg-white"><Reveal delay={k * 60} className="h-full p-4"><span className="font-mono text-[10px] text-copper-600">{String(k + 1).padStart(2, "0")}</span><h3 className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-900">{t}{k < FLOW.length - 1 ? <ArrowRight className="hidden h-3.5 w-3.5 text-slate-400 lg:inline" aria-hidden /> : null}</h3><p className="mt-1 text-xs leading-relaxed text-slate-600">{d}</p></Reveal></li>)}
        </ol>
      </Sec>

      <Sec id="weldments" tint>
        <Head eyebrow="Weldments" heading="Weldments and Structural Frames"><p>{pdm[1]}</p><p>Members are placed on layout sketches using structural profiles, trimmed and end-treated, and a cut list is generated from the model. Profiles, lengths and end conditions are checked before fabrication drawings are issued.</p></Head>
        <div className="mt-10 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Fig><WeldmentVisual /></Fig>
          <Reveal>
            <div className="overflow-x-auto border border-slate-300 bg-white">
              <table className="w-full min-w-[340px] border-collapse text-left text-sm">
                <caption className="px-4 pt-3 text-left font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Cut list · Illustrative example</caption>
                <thead><tr className="border-b border-slate-300 font-mono text-[10px] uppercase text-slate-500"><th scope="col" className="px-4 py-2 font-normal">Item</th><th scope="col" className="px-4 py-2 font-normal">Profile</th><th scope="col" className="px-4 py-2 font-normal">Length</th><th scope="col" className="px-4 py-2 font-normal">Qty</th></tr></thead>
                <tbody>{CUT.map((r) => <tr key={r[0]} className="border-b border-slate-100">{r.map((c, k) => <td key={k} className="px-4 py-2 text-slate-700">{c}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </Sec>

      <Sec id="surfaces">
        <Head eyebrow="Surface modelling" heading="Surface Modelling for Complex Shapes"><p>{surf[0]}</p></Head>
        <Fig className="mt-10"><SurfaceVisual /></Fig>
      </Sec>

      <Sec id="top-down" dark>
        <Head dark eyebrow="Assembly approach" heading="Top-Down vs Bottom-Up Assembly Design"><p>{td[0]}</p><p>Bottom-up suits assemblies of largely independent or standard parts. Either way, in-context references are kept deliberate and limited — too many external references make an assembly fragile and slow.</p></Head>
        <Reveal className="mt-10"><TopDownView /></Reveal>
      </Sec>

      <Sec id="tolerance">
        <Head eyebrow="Tolerance stack-up" heading="Tolerance Stack-Up Support"><p>{td[1]}</p><p>We can identify the dimension chain, pull nominal sizes and tolerances from the model and drawings, and set out worst-case or statistical stacks for review.</p></Head>
        <Reveal className="mt-10"><StackView /></Reveal>
        <Reveal className="mt-6"><Note>Stack-up support is not a substitute for specialist tolerance analysis. For critical, safety-related or regulated assemblies, results should be reviewed and signed off by a qualified engineer.</Note></Reveal>
      </Sec>

      <Sec id="reverse-engineering" tint>
        <Head eyebrow="Reverse engineering" heading="Reverse Engineering Into Parametric Models"><p>A parametric SolidWorks model can be rebuilt from a physical sample with measurements, legacy drawings, photographs with reference dimensions, or scan data. Accuracy depends on the input — worn, damaged or incomplete information means some dimensions are interpreted, and those are flagged for confirmation rather than presented as measured. See {a("3d-cad-modelling", "3D CAD modelling")}.</p></Head>
        <Fig className="mt-10"><div data-in="true"><ReverseEngineeringGraphic className="mx-auto block h-auto w-full max-w-[880px]" /></div></Fig>
      </Sec>

      <Sec id="simulation" dark>
        <Head dark eyebrow="Simulation-ready preparation" heading="Simulation-Ready Model Preparation"><p>{cfg[1]}</p><p>That means simplified configurations with cosmetic features and fasteners removed or represented appropriately, clean bodies, and splits where loads or contacts need them.</p></Head>
        <Fig className="mt-10"><div data-in="true"><SimulationPrep className="mx-auto block h-auto w-full max-w-[880px]" /></div></Fig>
        <Reveal className="mt-6"><Note dark>We prepare geometry for simulation; we don&apos;t perform or certify the analysis. Loads, boundary conditions, results and engineering conclusions remain with your analyst or engineer.</Note></Reveal>
      </Sec>

      <Sec id="pdm">
        <Head eyebrow="PDM & file organisation" heading="PDM Practice and File Organisation"><p>{pdm[0]}</p><p>We work within your vault or file system and its conventions. Vault configuration, workflows and permissions remain with your team or reseller.</p></Head>
        <div className="mt-10 grid gap-6 [&>*]:min-w-0 lg:grid-cols-2 lg:items-start">
          <Reveal><pre className="overflow-x-auto border border-slate-700 bg-ink-950 p-5 font-mono text-[12px] leading-relaxed text-slate-300" aria-label="Illustrative project folder structure">{`PRJ-0420_Conveyor-Frame/
├─ 01_Parts/
│  ├─ 420-101_Side-Rail.SLDPRT      REV B
│  └─ 420-102_Cross-Member.SLDPRT   REV A
├─ 02_Assemblies/
│  └─ 420-100_Frame-Assy.SLDASM     REV B
├─ 03_Drawings/
│  └─ 420-100_Frame-Assy.SLDDRW
└─ 04_Exports/  STEP · PDF · DXF
`}<span className="text-slate-500"># Illustrative example</span></pre></Reveal>
          <Reveal><Cards cols={3} items={[["Naming", "File names follow your part-numbering scheme."], ["Revisions", "Revision stored as a property, shown on drawings."], ["References", "No broken or absolute-path references on delivery."]]} /></Reveal>
        </div>
      </Sec>

      <Sec id="exchange" tint>
        <Head eyebrow="STEP / IGES & data exchange" heading="Neutral Exports That Are Checked, Not Assumed"><p>{rend[1]}</p><p>STEP and IGES carry geometry, not feature history — the recipient gets a solid they can measure and machine from, but not the parametric tree. Every export is re-opened and checked before it&apos;s sent.</p></Head>
        <Reveal className="mt-10"><ExportView /></Reveal>
        <Reveal className="mt-6"><Chips items={["STEP AP214 / AP242", "IGES", "Parasolid", "DXF / DWG", "PDF drawings", "eDrawings", "Units check", "Structure check"]} /></Reveal>
      </Sec>

      <Sec id="dfm">
        <Head eyebrow="Manufacturing-aware design" heading="Modelling With the Manufacturing Process in Mind"><p>Geometry is modelled for the way it will be made. Final manufacturability is confirmed with your machinist, fabricator, toolmaker or foundry, who know the specific process limits.</p></Head>
        <div className="mt-10"><Cards cols={3} items={[["Machined parts", "Tool access, standard hole sizes, sensible internal radii and datums matched to fixturing."], ["Sheet metal", "Bend radii, reliefs and hole-to-bend distances matched to your tooling."], ["Moulded & cast parts", "Draft, wall thickness, ribs and parting lines considered during modelling."], ["Welded fabrications", "Standard profiles, accessible weld joints and clear cut lists."], ["Standard hardware", "Catalogue fasteners and components rather than custom parts where possible."], ["Material use", "Part count and material reviewed where a design-for-manufacture review is in scope."]]} /></div>
      </Sec>

      <Sec id="templates" tint>
        <Head eyebrow="Templates, BOM standards & custom properties" heading="Templates, BOM Standards and Custom Properties"><p>{surf[1]}</p><p>Custom properties are the link between model, drawing and BOM. Set once in the part template, they fill the title block and BOM columns automatically.</p></Head>
        <Reveal className="mt-10">
          <div className="overflow-x-auto border border-slate-300 bg-white">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <caption className="px-4 pt-3 text-left font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Custom properties → where they appear · Illustrative example</caption>
              <thead><tr className="border-b border-slate-300 font-mono text-[10px] uppercase text-slate-500"><th scope="col" className="px-4 py-2 font-normal">Property</th><th scope="col" className="px-4 py-2 font-normal">Example value</th><th scope="col" className="px-4 py-2 font-normal">Title block</th><th scope="col" className="px-4 py-2 font-normal">BOM</th></tr></thead>
              <tbody>{[["PartNo", "420-101", true, true], ["Description", "Side rail", true, true], ["Material", "S275 (from model)", true, true], ["Finish", "Zinc plate", true, false], ["Mass", "4.2 kg (from model)", false, true], ["Revision", "B", true, false], ["Vendor", "—", false, true]].map(([p, v, tb, bom]) => <tr key={String(p)} className="border-b border-slate-100"><th scope="row" className="px-4 py-2 font-mono text-[12px] font-normal text-slate-900">{p}</th><td className="px-4 py-2 text-slate-700">{v}</td><td className="px-4 py-2">{tb ? <Check className="h-4 w-4 text-copper-600" aria-label="Yes" /> : <span className="text-slate-400" aria-label="No">—</span>}</td><td className="px-4 py-2">{bom ? <Check className="h-4 w-4 text-copper-600" aria-label="Yes" /> : <span className="text-slate-400" aria-label="No">—</span>}</td></tr>)}</tbody>
            </table>
          </div>
        </Reveal>
      </Sec>

      <Sec id="rendering">
        <Head eyebrow="Rendering" heading="Rendering From the Engineering Model"><p>{rend[0]}</p><p>For higher-end marketing visuals, see our {lk("/services/architectural/3d-rendering", "3D rendering service")}.</p></Head>
      </Sec>

      <Sec id="compare" tint>
        <Head eyebrow="Choosing the tool" heading="SolidWorks vs AutoCAD vs Revit"><p>Each is built for a different kind of deliverable. Here is roughly where each one fits. For the others, see {lk("/software/autocad", "AutoCAD drafting and documentation")} and {lk("/software/revit", "Revit BIM modelling and coordination")}.</p></Head>
        <Reveal className="mt-10"><div className="overflow-x-auto border border-slate-300 bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">SolidWorks compared with AutoCAD and Revit by requirement</caption>
            <thead><tr className="border-b border-slate-300 bg-slate-50 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500"><th scope="col" className="px-4 py-3 font-normal">Requirement</th><th scope="col" className="px-4 py-3 font-normal">SolidWorks</th><th scope="col" className="px-4 py-3 font-normal">AutoCAD</th><th scope="col" className="px-4 py-3 font-normal">Revit</th></tr></thead>
            <tbody>{VS.map(([r, x, y, z]) => <tr key={r} className="border-b border-slate-100"><th scope="row" className="px-4 py-3 font-medium text-slate-900">{r}</th><td className="px-4 py-3 text-slate-700">{x}</td><td className="px-4 py-3 text-slate-700">{y}</td><td className="px-4 py-3 text-slate-700">{z}</td></tr>)}</tbody>
          </table>
        </div></Reveal>
      </Sec>

      <Sec id="deliverables">
        <div className="grid gap-10 [&>*]:min-w-0 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal><SectionHeading eyebrow="Used for" heading="What SolidWorks Is Used For Here" /><ul className="mt-6 space-y-2">{item.usedFor.map((u) => <li key={u} className="flex gap-2 text-sm text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-copper-600" aria-hidden />{u}</li>)}</ul></Reveal>
          <div>
            <Reveal><SectionHeading eyebrow="Deliverables" heading="What We Can Deliver" /></Reveal>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">{DELIVER.map(([t, d], k) => <li key={t}><Reveal delay={k * 40} className="h-full"><div className="h-full border border-slate-300 bg-white p-5"><span className="font-mono text-[10px] text-copper-600">{String(k + 1).padStart(2, "0")}</span><h3 className="mt-1 text-base font-semibold text-slate-900">{t}</h3><p className="mt-1.5 text-sm text-slate-600">{d}</p></div></Reveal></li>)}</ul>
          </div>
        </div>
      </Sec>

      <Sec id="industries" tint>
        <Head eyebrow="Industries" heading="Where SolidWorks Modelling Is Used" />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {inds.map((i, k) => <li key={i.slug}><Reveal delay={k * 50} className="h-full"><Link href={`/industries/${i.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><h3 className="flex items-center justify-between text-base font-semibold text-slate-900">{i.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></h3><p className="mt-1.5 text-sm text-slate-600">{IND[i.slug] ?? i.heroDescription}</p></Link></Reveal></li>)}
        </ul>
      </Sec>

      <Sec id="services">
        <Head eyebrow="Related services" heading="Services Delivered in SolidWorks"><p>SolidWorks work usually sits within {a("3d-cad-modelling", "3D CAD modelling")}, {a("mechanical-drafting", "mechanical drafting")} or {a("engineering-design", "engineering design")}.</p></Head>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {svcs.map((s, k) => <li key={s.slug}><Reveal delay={k * 40} className="h-full"><Link href={`/services/${s.category}/${s.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><h3 className="flex items-center justify-between text-base font-semibold text-slate-900">{s.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></h3><p className="mt-1.5 text-sm text-slate-600">{s.shortDescription}</p></Link></Reveal></li>)}
        </ul>
      </Sec>

      <FAQ items={item.faqs} heading="SolidWorks Modelling FAQs" />

      <section className="border-t border-slate-800 bg-ink-950 py-16 text-white sm:py-20">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div><h2 className="text-3xl font-semibold tracking-tight">Get a Quote for SolidWorks Work</h2><p className="mt-3 max-w-xl text-slate-300">Send sketches, drawings, existing models or photos of the part, your templates and properties if you have them, and the SolidWorks version you use. We&apos;ll review it and come back with a scope.</p></div>
          <Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button>
        </Container>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700 bg-ink-950/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/get-a-quote" className="flex min-h-[44px] items-center justify-center bg-copper-500 text-sm font-semibold text-white">Get a Free Quote</Link>
      </div>
      <div aria-hidden className="h-[68px] md:hidden" />
    </>
  );
}
