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

/* ───────── CAD palette: dark model space with classic layer colours ───────── */
const C = { bg: "#15181D", grid: "#2A2F37", w: "#E5E7EB", red: "#F87171", yel: "#FACC15", grn: "#4ADE80", cyn: "#22D3EE", blu: "#60A5FA", mag: "#E879F9", mute: "#6B7280" };
const ln = (c: string, w = 1.3) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;
const mono = { fontFamily: "var(--font-mono)" } as const;
function T({ x, y, c = C.w, s = 9, a = "start", children }: { x: number; y: number; c?: string; s?: number; a?: "start" | "middle" | "end"; children: React.ReactNode }) {
  return <text x={x} y={y} fill={c} fontSize={s} textAnchor={a} style={mono}>{children}</text>;
}
function Space({ w, h, label, children }: { w: number; h: number; label: string; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto block h-auto w-full max-w-[860px]" role="img" aria-label={label}>
      <title>{label}</title>
      <rect width={w} height={h} fill={C.bg} />
      <g stroke={C.grid} strokeOpacity="0.6">{Array.from({ length: Math.ceil(w / 20) + 1 }, (_, i) => <path key={i} d={`M${i * 20} 0V${h}`} strokeWidth={i % 5 ? 0.4 : 0.8} />)}{Array.from({ length: Math.ceil(h / 20) + 1 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 20}H${w}`} strokeWidth={i % 5 ? 0.4 : 0.8} />)}</g>
      {children}
    </svg>
  );
}
const D = ({ d }: { d: number; i?: number }) => ({ "--d": `${d}ms` }) as React.CSSProperties;

/* hero: DWG → layers → dimensions → final drawing (draws in on load) */
function HeroDrawing() {
  return (
    <Space w={520} h={360} label="A drawing building up in AutoCAD: geometry, layers, dimensions, then a title block">
      <g className="draw" style={D({ d: 100, i: 0 })}>
        <path pathLength={1} d="M70 90H290V250H70Z" {...ln(C.w, 1.6)} />
        <path pathLength={1} d="M70 150H170V90M210 250V190H290" {...ln(C.w, 1.2)} />
      </g>
      <g className="fade-in" style={D({ d: 700, i: 0 })}><path d="M120 150a26 26 0 0 1 26-26M210 190a22 22 0 0 0 22-22" {...ln(C.yel, 1)} /><path d="M70 120H50M70 220H50" {...ln(C.cyn, 1)} /><rect x="230" y="110" width="40" height="24" {...ln(C.mag, 1)} /><path d="M180 90V250" {...ln(C.red, 0.8)} strokeDasharray="10 3 2 3" /></g>
      <g className="fade-in" style={D({ d: 1200, i: 0 })}>
        <path d="M70 280H290M70 274v12M290 274v12M310 90H324M310 250H324M318 90V250" {...ln(C.grn, 0.9)} />
        <T x={180} y={276} c={C.grn} a="middle">5400</T><T x={330} y={174} c={C.grn}>3600</T>
      </g>
      <g className="fade-in" style={D({ d: 1700, i: 0 })}>
        <rect x="16" y="16" width="488" height="328" {...ln(C.w, 0.8)} />
        <path d="M360 270H504M360 296H504M360 270V344M440 296V344" {...ln(C.w, 0.8)} />
        <T x={366} y={287}>GA PLAN · LEVEL 1</T><T x={366} y={316} c={C.mute}>DWG A-101</T><T x={446} y={316} c={C.mute}>REV C</T><T x={366} y={334} c={C.mute}>1:100 @ A3</T>
      </g>
      <g className="fade-in" style={D({ d: 400, i: 0 })}>
        <rect x="360" y="40" width="130" height="102" {...ln(C.grid, 1)} fill="#0F1115" />
        <T x={368} y={56} c={C.mute} s={8}>LAYERS</T>
        {[["A-WALL", C.w], ["A-DOOR", C.yel], ["A-GRID", C.red], ["A-DIMS", C.grn], ["A-FURN", C.mag]].map(([n, c], k) => <g key={n}><rect x={368} y={64 + k * 15} width="8" height="8" fill={c} /><T x={382} y={71 + k * 15} s={8}>{n}</T></g>)}
      </g>
    </Space>
  );
}
function StandardsVisual() {
  const steps = [["Layer", C.cyn], ["Lineweight", C.yel], ["Annotation", C.grn], ["Title block", C.w]] as const;
  return (
    <Space w={520} h={170} label="Standards chain: layer, lineweight, annotation, title block">
      {steps.map(([t, c], k) => {
        const x = 20 + k * 126;
        return (
          <g key={t}>
            <rect x={x} y="30" width="108" height="100" {...ln(c, 1)} fill="#0F1115" />
            {k === 0 ? [0, 1, 2].map((r) => <rect key={r} x={x + 14} y={50 + r * 22} width="10" height="10" fill={[C.cyn, C.yel, C.red][r]} />) : null}
            {k === 1 ? [0.3, 0.7, 1.4].map((w, r) => <path key={r} d={`M${x + 14} ${56 + r * 22}H${x + 94}`} stroke={C.w} strokeWidth={w * 2} />) : null}
            {k === 2 ? <g><path d={`M${x + 14} 90H${x + 94}M${x + 14} 84v12M${x + 94} 84v12`} {...ln(C.grn, 1)} /><T x={x + 54} y={80} c={C.grn} a="middle">2400</T></g> : null}
            {k === 3 ? <g><rect x={x + 14} y="48" width="80" height="64" {...ln(C.w, 0.8)} /><path d={`M${x + 14} 96H${x + 94}M${x + 54} 96V112`} {...ln(C.w, 0.8)} /></g> : null}
            {k < 3 ? <path d={`M${x + 110} 80h12M${x + 118} 76l4 4-4 4`} {...ln(C.mute, 1.2)} /> : null}
          </g>
        );
      })}
    </Space>
  );
}
function BlocksVisual() {
  return (
    <Space w={520} h={220} label="A library of reusable blocks — door, equipment, valve, grid bubble and title block attributes — inserted repeatedly into a plan">
      <rect x="20" y="20" width="170" height="180" {...ln(C.grid, 1)} fill="#0F1115" />
      <T x={30} y={38} c={C.mute} s={8}>BLOCK LIBRARY</T>
      <g {...ln(C.yel, 1.3)}><path d="M36 70h20M36 70a20 20 0 0 1 20 -20" /></g>
      <g {...ln(C.mag, 1.3)}><rect x="96" y="52" width="26" height="20" /><circle cx="109" cy="62" r="5" /></g>
      <g {...ln(C.cyn, 1.3)}><path d="M140 52l20 20M140 72l20 -20M140 62h20" /></g>
      <g {...ln(C.red, 1.3)}><circle cx="46" cy="118" r="11" /></g><T x={46} y={121} c={C.red} a="middle" s={8}>A</T>
      <g {...ln(C.w, 1)}><rect x="86" y="104" width="86" height="34" /><path d="M86 121h86" /></g><T x={92} y={117} s={7} c={C.grn}>{"<DWG_NO>"}</T><T x={92} y={133} s={7} c={C.grn}>{"<REV>"}</T>
      <T x={30} y={186} c={C.mute} s={8}>ATTRIBUTES · DYNAMIC</T>
      <rect x="220" y="20" width="280" height="180" {...ln(C.w, 1.2)} />
      {[[250, 60], [330, 60], [410, 60], [250, 150], [410, 150]].map(([x, y], k) => <g key={k} {...ln(C.yel, 1.2)}><path d={`M${x} ${y}h20M${x} ${y}a20 20 0 0 1 20 -20`} /></g>)}
      {[[300, 110], [370, 110]].map(([x, y], k) => <g key={k} {...ln(C.mag, 1.2)}><rect x={x} y={y} width="26" height="20" /><circle cx={x + 13} cy={y + 10} r="5" /></g>)}
      <path d="M190 100H220" {...ln(C.mute, 1)} strokeDasharray="4 3" />
    </Space>
  );
}
function XrefVisual() {
  const files = [["ARCH-BASE.dwg", 60, C.w], ["STR-GRID.dwg", 200, C.red], ["MEP-ROUTE.dwg", 340, C.cyn]] as const;
  return (
    <Space w={520} h={230} label="Three discipline drawings attached as external references to one sheet drawing using relative paths">
      {files.map(([n, x, c]) => <g key={n}><rect x={x} y="20" width="120" height="56" {...ln(c, 1.2)} fill="#0F1115" /><T x={x + 8} y={40} c={c} s={9}>{n}</T><T x={x + 8} y={60} c={C.mute} s={8}>..\xref\</T><path d={`M${x + 60} 76L260 140`} {...ln(c, 1)} strokeDasharray="5 3" /></g>)}
      <rect x="170" y="140" width="180" height="70" {...ln(C.grn, 1.4)} fill="#0F1115" /><T x={180} y={160} c={C.grn}>SHEET A-201.dwg</T><T x={180} y={180} c={C.mute} s={8}>3 xrefs · relative paths</T><T x={180} y={196} c={C.mute} s={8}>status: loaded</T>
      <g {...ln(C.red, 1.4)}><path d="M440 150l14 14M454 150l-14 14" /></g><T x={428} y={184} c={C.red} s={8}>NOT FOUND</T><T x={420} y={198} c={C.mute} s={8}>(absolute path)</T>
    </Space>
  );
}
function PlotVisual() {
  const st = ["Model space", "Layout", "Viewport", "PDF"];
  return (
    <Space w={520} h={190} label="Plot workflow: model space, layout, viewport at a set scale, published PDF">
      {st.map((t, k) => {
        const x = 16 + k * 126;
        return (
          <g key={t}>
            <rect x={x} y="24" width="110" height="120" {...ln(k === 3 ? C.mute : C.grid, 1)} fill={k === 3 ? "#F8FAFC" : "#0F1115"} />
            {k === 0 ? <path d={`M${x + 20} 60h70v50h-70zM${x + 20} 85h35V60`} {...ln(C.w, 1)} /> : null}
            {k === 1 ? <g><rect x={x + 10} y="34" width="90" height="100" {...ln(C.w, 0.8)} /><path d={`M${x + 60} 120h40M${x + 60} 112v22`} {...ln(C.w, 0.6)} /></g> : null}
            {k === 2 ? <g><rect x={x + 10} y="34" width="90" height="100" {...ln(C.w, 0.8)} /><rect x={x + 18} y="42" width="70" height="60" {...ln(C.cyn, 1.2)} /><path d={`M${x + 28} 58h44v32h-44zM${x + 28} 74h22V58`} {...ln(C.w, 0.9)} /><T x={x + 20} y={118} c={C.cyn} s={8}>1:100</T></g> : null}
            {k === 3 ? <g><rect x={x + 10} y="34" width="90" height="100" stroke="#334155" fill="none" /><path d={`M${x + 28} 58h44v32h-44zM${x + 28} 74h22V58`} stroke="#0F172A" fill="none" strokeWidth="1.2" /><path d={`M${x + 60} 120h40`} stroke="#0F172A" /></g> : null}
            <T x={x + 55} y={164} a="middle" c={C.w} s={9}>{t.toUpperCase()}</T>
            {k < 3 ? <path d={`M${x + 112} 84h10M${x + 118} 80l4 4-4 4`} {...ln(C.mute, 1.2)} /> : null}
          </g>
        );
      })}
    </Space>
  );
}
function BimVisual() {
  return (
    <Space w={520} h={200} label="2D AutoCAD drawing used as a reference underlay while a BIM model is built">
      <rect x="20" y="40" width="130" height="110" {...ln(C.w, 1)} fill="#0F1115" /><path d="M40 60h90v70H40zM40 95h45V60" {...ln(C.w, 1.1)} /><T x={30} y={170} c={C.w} s={9}>2D CAD</T>
      <path d="M160 95h40M194 90l6 5-6 5" {...ln(C.mute, 1.2)} />
      <rect x="210" y="40" width="110" height="110" {...ln(C.yel, 1)} fill="#0F1115" strokeDasharray="5 3" /><path d="M228 60h74v70h-74z" {...ln(C.yel, 0.8)} strokeDasharray="4 3" /><T x={214} y={170} c={C.yel} s={9}>REFERENCE / UNDERLAY</T>
      <path d="M330 95h40M364 90l6 5-6 5" {...ln(C.mute, 1.2)} />
      <g {...ln(C.blu, 1.2)}><path d="M400 120l40 -22l60 22l-40 22z" fill={C.blu} fillOpacity="0.12" /><path d="M400 120v-50l40 -22v50M440 48l60 22v50M500 70l-40 22v50M400 70l60 22" /></g><T x={404} y={170} c={C.blu} s={9}>BIM MODEL (REBUILT)</T>
    </Space>
  );
}
function ConvVisual() {
  return (
    <Space w={520} h={200} label="Scanned or PDF drawing converted into a clean, layered, editable DWG">
      <rect x="20" y="30" width="140" height="130" fill="#EDE7DA" /><path d="M36 50h108v90H36zM36 95h55V50" stroke="#8C7B5E" strokeWidth="1.6" fill="none" /><path d="M40 130c20 -3 40 4 60 0" stroke="#8C7B5E" strokeOpacity="0.4" /><T x={22} y={180} c={C.mute} s={9}>PDF / SCAN</T>
      <path d="M170 95h40M204 90l6 5-6 5" {...ln(C.mute, 1.2)} />
      <rect x="220" y="30" width="140" height="130" {...ln(C.grid, 1)} fill="#0F1115" />{[[236, 50], [344, 50], [344, 140], [236, 140], [291, 95]].map(([x, y], k) => <rect key={k} x={x - 3} y={y - 3} width="6" height="6" {...ln(C.cyn, 1)} />)}<path d="M236 50h108v90H236zM236 95h55V50" {...ln(C.cyn, 1)} strokeDasharray="3 2" /><T x={222} y={180} c={C.cyn} s={9}>REDRAWN GEOMETRY</T>
      <path d="M370 95h40M404 90l6 5-6 5" {...ln(C.mute, 1.2)} />
      <rect x="420" y="30" width="84" height="130" {...ln(C.grn, 1.4)} fill="#0F1115" /><T x={462} y={100} a="middle" c={C.grn} s={18}>DWG</T><T x={430} y={124} c={C.mute} s={8}>layered</T><T x={430} y={138} c={C.mute} s={8}>editable</T><T x={422} y={180} c={C.grn} s={9}>NATIVE CAD</T>
    </Space>
  );
}

/* ───────── layout ───────── */
function Sec({ id, tint, dark, children }: { id: string; tint?: boolean; dark?: boolean; children: React.ReactNode }) {
  return <section id={id} className={cn("scroll-mt-20 border-t py-16 sm:py-24", dark ? "border-slate-800 bg-[#15181D] text-white" : tint ? "border-slate-200 bg-[#F4F4F1]" : "border-slate-200 bg-white")}><Container>{children}</Container></section>;
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
const Fig = ({ children, className }: { children: React.ReactNode; className?: string }) => <Reveal className={cn("overflow-hidden border border-slate-700 bg-[#15181D]", className)}>{children}</Reveal>;

const DELIVER = [
  ["2D DWG drawing sets", "Production-ready technical drawing packages prepared to the supplied project or client standard."],
  ["Drawing templates", "Project-specific title blocks, layers, annotation styles and plot configuration."],
  ["CAD cleanup", "Cleaning and standardising existing drawings — layers, blocks, references and title blocks."],
  ["Block & attribute libraries", "Reusable components for repeated equipment, symbols, details and drawing data."],
  ["Standardised drawing registers", "Consistent numbering, revisions and title block content across an archive."],
  ["CAD conversion", "PDF, scanned or legacy drawings converted into editable, layered DWG."],
];
const IND: Record<string, string> = {
  manufacturing: "Mechanical drawings, fabrication documentation, layouts and production drawings.",
  construction: "General arrangements, construction documentation and coordinated drawing packages.",
  mining: "Plant layouts, structural and equipment drawings, and legacy drawing conversion.",
  energy: "Electrical schematics, structural and civil documentation for energy facilities.",
};
const VS: [string, string, string][] = [
  ["2D drafting & details", "Efficient and direct", "Possible; often heavier for simple details"],
  ["DWG documentation & exchange", "Native format", "Exported from the model"],
  ["Coordinated multi-discipline 3D model", "Limited", "Core strength"],
  ["Building / system information (schedules, parameters)", "Limited — via attributes", "Core strength"],
  ["Editing legacy 2D drawings", "Strong", "Depends on source; usually referenced"],
  ["Small or one-off packages", "Usually the lighter route", "May be more than the job needs"],
];

export function AutoCadPage({ item }: { item: Software }) {
  const o = (h: string) => item.overview.find((s) => s.heading?.startsWith(h))?.paragraphs ?? [];
  const [why, std, blocks, bim, xref, tmpl, issue] = ["Why", "Standardising", "Block", "Moving", "Managing", "Templates", "Issuing"].map(o);
  const svcs = item.relatedServices.flatMap((s) => { const v = getServiceBySlug(s); return v ? [v] : []; });
  const href = (slug: string) => { const v = svcs.find((x) => x.slug === slug); return v ? `/services/${v.category}/${v.slug}` : "/services"; };
  const a = (slug: string, t: string, dark?: boolean) => <Link href={href(slug)} className={cn("font-medium underline underline-offset-4", dark ? "text-white hover:text-yellow-300" : "text-slate-900 hover:text-copper-600")}>{t}</Link>;
  const inds = item.relatedIndustries.flatMap((s) => { const v = getIndustryBySlug(s); return v ? [v] : []; });

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: "AutoCAD drafting and documentation", description: item.seoDescription, path: `/software/${item.slug}` })} />

      <section className="relative overflow-hidden bg-[#15181D] pb-14 pt-12 text-white sm:pb-20 sm:pt-16">
        <Container className="relative grid gap-10 [&>*]:min-w-0 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-yellow-300">{item.category} · Software we work in</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">{item.name}</h1>
            <p className="mt-5 text-xl leading-snug text-slate-100">AutoCAD drafting and documentation for engineering, construction, manufacturing, architecture and related disciplines.</p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">AutoCAD is a long-established 2D CAD platform, and DWG is one of the most common formats for exchanging technical drawings. We use it to produce dimensioned drawing sets to your standard, clean up and standardise existing registers, and convert PDF, scanned or legacy drawings into editable DWG — for consultants, fabricators, contractors and in-house teams that need reliable drawings without adding headcount.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#deliverables" size="lg" variant="outline-light">What we deliver</Button></div>
            <p className="mt-6 text-xs text-slate-500">AutoCAD is a product of Autodesk, Inc. Render CAD Hub is an independent drafting service that uses AutoCAD and is not affiliated with Autodesk.</p>
          </div>
          <div data-in="true" className="border border-slate-700"><HeroDrawing /></div>
        </Container>
      </section>

      <Sec id="drafting">
        <Head eyebrow="AutoCAD drafting & documentation" heading="What We Produce in AutoCAD"><p>{why[1]}</p></Head>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[["General arrangements & layouts", <>Plans, elevations and plant layouts — see {a("architectural-drafting", "architectural drafting")} and {a("civil-drafting", "civil drafting")}.</>], ["Mechanical & fabrication drawings", <>For manufacturing and product work, see {a("mechanical-drafting", "mechanical drafting")}.</>], ["Structural details", <>Smaller steel packages and construction details through {a("structural-drafting", "structural drafting")}.</>], ["Schematics & single-lines", <>Electrical schematics and SLDs via {a("electrical-drafting", "electrical drafting")}.</>]].map(([t, d], k) => <li key={k}><Reveal delay={k * 50} className="h-full"><div className="h-full border border-slate-300 bg-white p-5"><h3 className="text-base font-semibold text-slate-900">{t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p></div></Reveal></li>)}
        </ul>
      </Sec>

      <Sec id="why" tint>
        <Head eyebrow="Why it still matters" heading="Why AutoCAD Remains Important for Technical Drawing"><p>{why[0]}</p><p>It isn&apos;t a replacement for BIM — it&apos;s the right tool when the deliverable is a clear, dimensioned 2D drawing, when DWG is the exchange format the project runs on, or when full BIM would be more than the job needs.</p></Head>
        <Reveal className="mt-8"><Chips items={["DWG exchange", "2D deliverables", "Consultants", "Fabricators", "Contractors", "Approval drawings", "Legacy project information", "Projects that don't need full BIM"]} /></Reveal>
      </Sec>

      <Sec id="standards">
        <Head eyebrow="Standards & layers" heading="AutoCAD Drawing Standards and Layer Management"><p>{std[0]}</p><p>{std[1]}</p></Head>
        <div className="mt-10 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <Fig><StandardsVisual /></Fig>
          <Reveal><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">What a standard pins down</p><div className="mt-2"><Chips items={["Layer names", "Layer colours", "Lineweights", "Linetypes", "Title blocks", "Drawing numbering", "Annotation styles", "Plot settings", "Client standards"]} /></div><p className="mt-4 text-sm text-slate-600">When several people contribute to one register, the standard is what keeps sheet 40 looking like sheet 4.</p></Reveal>
        </div>
      </Sec>

      <Sec id="blocks" dark>
        <Head dark eyebrow="Blocks & attributes" heading="AutoCAD Blocks, Attributes and Libraries"><p>{blocks[0]}</p><p>Attributed blocks also carry data — drawing numbers, revisions, equipment tags — that can be extracted to schedules instead of retyped. Dynamic blocks let one symbol cover several sizes or configurations.</p></Head>
        <div className="mt-10"><Fig><BlocksVisual /></Fig></div>
        <Reveal className="mt-6"><Chips dark items={["Reusable blocks", "Attributed blocks", "Dynamic blocks", "Equipment symbols", "Doors / windows", "Structural details", "Title block attributes", "Drawing metadata"]} /></Reveal>
      </Sec>

      <Sec id="xrefs">
        <Head eyebrow="External references" heading="AutoCAD Xrefs and Multi-Drawing Coordination"><p>{xref[0]}</p></Head>
        <div className="mt-10 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <Fig><XrefVisual /></Fig>
          <Reveal><ul className="space-y-2">{[["Discipline backgrounds", "Architectural, structural and MEP drawings referenced, not copied in."], ["Relative paths", "The package still resolves when it's moved, zipped or shared."], ["Naming & locations", "Agreed up front so a rename doesn't break every sheet."], ["Broken references", "Found and fixed before issue — or bound where a frozen copy is needed."]].map(([t, d]) => <li key={t} className="border border-slate-300 bg-white px-4 py-3"><h3 className="text-sm font-semibold text-slate-900">{t}</h3><p className="mt-0.5 text-sm text-slate-600">{d}</p></li>)}</ul></Reveal>
        </div>
      </Sec>

      <Sec id="plotting" tint>
        <Head eyebrow="Layouts & plotting" heading="Layouts, Paper Space, Annotation and Plotting"><p>{blocks[1]}</p><p>{xref[1]}</p><p>{tmpl[1]}</p></Head>
        <div className="mt-10"><Fig><PlotVisual /></Fig></div>
        <Reveal className="mt-6"><Chips items={["Model space", "Paper space", "Layouts", "Viewports", "Annotation scales", "Dimension styles", "Page setups", "CTB / STB plot styles", "PDF publishing", "Drawing scale"]} /></Reveal>
        <Reveal className="mt-8"><div className="border-l-4 border-copper-500 bg-white px-5 py-4"><h3 className="text-base font-semibold text-slate-900">Issuing to several parties from one master set</h3><p className="mt-1.5 text-sm leading-relaxed text-slate-600">{issue[0]}</p></div></Reveal>
      </Sec>

      <Sec id="templates">
        <Head eyebrow="Templates" heading="AutoCAD Templates for Different Projects"><p>{tmpl[0]}</p></Head>
        <Reveal className="mt-8"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">What changes between project templates</p><div className="mt-2"><Chips items={["Layer standards", "Title blocks", "Units", "Annotation styles", "Plot settings", "Block sets", "Drawing numbering", "Client requirements"]} /></div></Reveal>
      </Sec>

      <Sec id="bim" dark>
        <Head dark eyebrow="AutoCAD & BIM" heading="AutoCAD and BIM Workflows"><p>{bim[0]}</p><p>AutoCAD itself isn&apos;t a BIM platform, and 2D linework doesn&apos;t convert automatically into intelligent model elements — the drawings serve as reference while the model is built. See {<Link href="/services/bim/revit-modelling" className="text-white underline underline-offset-4 hover:text-yellow-300">Revit modelling</Link>} and {<Link href="/software/revit" className="text-white underline underline-offset-4 hover:text-yellow-300">Revit</Link>}.</p></Head>
        <div className="mt-10"><Fig><BimVisual /></Fig></div>
        <Reveal className="mt-6"><div className="border border-slate-700 bg-slate-900/60 px-5 py-4"><h3 className="text-sm font-semibold text-white">Version compatibility</h3><p className="mt-1 text-sm leading-relaxed text-slate-300">{bim[1]}</p></div></Reveal>
      </Sec>

      <Sec id="conversion">
        <Head eyebrow="Conversion & legacy drawings" heading="CAD Conversion and Legacy AutoCAD Drawings"><p>Scanned drawings, PDFs and old DWG files often hold the only record of an existing asset. Converting them means redrawing geometry accurately, rebuilding layers to a current standard, and checking text and dimensions — not just tracing an image. For that work see {a("cad-conversion", "CAD conversion")}; for PDF drawings specifically, {a("pdf-to-cad", "PDF to CAD")}.</p></Head>
        <div className="mt-10"><Fig><ConvVisual /></Fig></div>
        <Reveal className="mt-6"><Chips items={["Scanned drawings", "PDFs", "Old DWG releases", "Outdated layer structures", "Drawing cleanup", "Digitisation", "Editable DWG", "Standardisation"]} /></Reveal>
      </Sec>

      <Sec id="deliverables" tint>
        <div className="grid gap-10 [&>*]:min-w-0 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal><SectionHeading eyebrow="Used for" heading="What AutoCAD Is Used For Here" /><ul className="mt-6 space-y-2">{item.usedFor.map((u) => <li key={u} className="flex gap-2 text-sm text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-copper-600" aria-hidden />{u}</li>)}</ul></Reveal>
          <div>
            <Reveal><SectionHeading eyebrow="Deliverables" heading="What We Can Deliver" /></Reveal>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">{DELIVER.map(([t, d], k) => <li key={t}><Reveal delay={k * 50} className="h-full"><div className="h-full border border-slate-300 bg-white p-5"><span className="font-mono text-[10px] text-copper-600">{String(k + 1).padStart(2, "0")}</span><h3 className="mt-1 text-base font-semibold text-slate-900">{t}</h3><p className="mt-1.5 text-sm text-slate-600">{d}</p></div></Reveal></li>)}</ul>
          </div>
        </div>
      </Sec>

      <Sec id="industries">
        <Head eyebrow="Industries" heading="Where AutoCAD Drafting Is Used" />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {inds.map((i, k) => <li key={i.slug}><Reveal delay={k * 50} className="h-full"><Link href={`/industries/${i.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><h3 className="flex items-center justify-between text-base font-semibold text-slate-900">{i.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></h3><p className="mt-1.5 text-sm text-slate-600">{IND[i.slug] ?? i.heroDescription}</p></Link></Reveal></li>)}
        </ul>
      </Sec>

      <Sec id="vs-bim" tint>
        <Head eyebrow="Choosing the tool" heading="AutoCAD vs BIM: Use the Right Tool for the Deliverable"><p>Neither replaces the other. A short comparison of where each tends to fit:</p></Head>
        <Reveal className="mt-10"><div className="overflow-x-auto border border-slate-300 bg-white">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <caption className="sr-only">AutoCAD compared with BIM platforms by requirement</caption>
            <thead><tr className="border-b border-slate-300 bg-slate-50 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500"><th scope="col" className="px-4 py-3 font-normal">Requirement</th><th scope="col" className="px-4 py-3 font-normal">AutoCAD</th><th scope="col" className="px-4 py-3 font-normal">BIM (e.g. Revit)</th></tr></thead>
            <tbody>{VS.map(([r, x, y]) => <tr key={r} className="border-b border-slate-100"><th scope="row" className="px-4 py-3 font-medium text-slate-900">{r}</th><td className="px-4 py-3 text-slate-700">{x}</td><td className="px-4 py-3 text-slate-700">{y}</td></tr>)}</tbody>
          </table>
        </div></Reveal>
      </Sec>

      <Sec id="services">
        <Head eyebrow="Related services" heading="Drafting Services Delivered in AutoCAD" />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {svcs.map((s, k) => <li key={s.slug}><Reveal delay={k * 40} className="h-full"><Link href={`/services/${s.category}/${s.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><h3 className="flex items-center justify-between text-base font-semibold text-slate-900">{s.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></h3><p className="mt-1.5 text-sm text-slate-600">{s.shortDescription}</p></Link></Reveal></li>)}
        </ul>
      </Sec>

      <FAQ items={item.faqs} heading="AutoCAD Drafting FAQs" />

      <section className="border-t border-slate-800 bg-[#15181D] py-16 text-white sm:py-20">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div><h2 className="text-3xl font-semibold tracking-tight">Get a Quote for AutoCAD Work</h2><p className="mt-3 max-w-xl text-slate-300">Send the drawings, markups or PDFs you have, your standard if there is one, and the AutoCAD release you need — we&apos;ll review the requirements and come back with a scope.</p></div>
          <Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button>
        </Container>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700 bg-[#15181D]/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/get-a-quote" className="flex min-h-[44px] items-center justify-center bg-copper-500 text-sm font-semibold text-white">Get a Free Quote</Link>
      </div>
      <div aria-hidden className="h-[68px] md:hidden" />
    </>
  );
}
