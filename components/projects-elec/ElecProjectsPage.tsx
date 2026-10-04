import Link from "next/link";
import { Check } from "lucide-react";
import type { Project } from "@/lib/types";
import type { projectCategories } from "@/data/project-categories";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { MechCaseStudy } from "@/components/projects-mech/MechCaseStudy";

type ProjectCategory = (typeof projectCategories)[number];

/* ───────── primitives ───────── */
function Sec({ id, tint, dark, children }: { id: string; tint?: boolean; dark?: boolean; children: React.ReactNode }) {
  return <section id={id} className={cn("scroll-mt-20 border-t py-16 sm:py-24", dark ? "border-slate-800 bg-[#0B1120] text-white" : tint ? "border-slate-200 bg-[#F5F5F0]" : "border-slate-200 bg-white")}><Container>{children}</Container></section>;
}
function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      {children ? <div className={cn("space-y-4 text-[15px] leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div> : null}
    </Reveal>
  );
}
function Card({ title, eyebrow, children, dark }: { title: string; eyebrow?: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={cn("h-full border p-5", dark ? "border-slate-700 bg-slate-900/60" : "border-slate-300 bg-white")}>
      {eyebrow ? <p className={cn("font-mono text-[10px] uppercase tracking-[0.14em]", dark ? "text-amber-300" : "text-amber-700")}>{eyebrow}</p> : null}
      <h3 className={cn("text-base font-semibold", eyebrow && "mt-1", dark ? "text-white" : "text-slate-900")}>{title}</h3>
      <div className={cn("mt-2 space-y-3 text-sm leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div>
    </div>
  );
}
function Chips({ items, dark }: { items: string[]; dark?: boolean }) {
  return <ul className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px] uppercase">{items.map((x) => <li key={x} className={cn("border px-2 py-1", dark ? "border-slate-600 text-slate-200" : "border-slate-300 bg-white text-slate-700")}>{x}</li>)}</ul>;
}
const ln = (c: string, w = 1.4) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;
const mono = { fontFamily: "var(--font-mono)" } as const;
const A = "#F59E0B", N = "#0F172A", B = "#0369A1";
function Grid({ w, h, dark }: { w: number; h: number; dark?: boolean }) {
  return <g stroke={dark ? "#7DD3FC" : "#0F172A"} strokeOpacity={dark ? 0.06 : 0.05}>{Array.from({ length: Math.ceil(w / 20) + 1 }, (_, i) => <path key={i} d={`M${i * 20} 0V${h}`} />)}{Array.from({ length: Math.ceil(h / 20) + 1 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 20}H${w}`} />)}</g>;
}

/* ───────── SVG diagrams (decorative labels only) ───────── */
function ConsistencyVisual() {
  return (
    <svg viewBox="0 0 420 300" className="block h-auto w-full" role="img" aria-label="One tag shared by the schematic, the physical panel layout and the cable schedule">
      <rect width="420" height="300" fill="#fff" /><Grid w={420} h={300} />
      <g><rect x="20" y="20" width="160" height="110" {...ln(N, 1)} /><path d="M40 60h30M70 50v20M70 60h20M90 50h20v20H90zM110 60h40" {...ln(N, 1.3)} /><text x="96" y="44" fontSize="9" fill={A} style={mono}>K1</text></g>
      <g><rect x="240" y="20" width="160" height="110" {...ln(N, 1)} />{[0, 1, 2].map((k) => <rect key={k} x={258 + k * 40} y="50" width="28" height="44" {...ln(k === 1 ? A : N, k === 1 ? 2 : 1.1)} />)}<text x="300" y="110" fontSize="9" fill={A} style={mono}>K1</text></g>
      <g><rect x="110" y="170" width="200" height="110" {...ln(N, 1)} />{[0, 1, 2, 3].map((r) => <path key={r} d={`M110 ${194 + r * 22}H310`} {...ln("#CBD5E1", 1)} />)}<path d="M170 170V280M240 170V280" {...ln("#CBD5E1", 1)} /><rect x="111" y="217" width="198" height="21" fill={A} fillOpacity="0.15" /><text x="120" y="232" fontSize="9" fill={N} style={mono}>C-14</text><text x="180" y="232" fontSize="9" fill={A} style={mono}>K1</text><text x="248" y="232" fontSize="9" fill={N} style={mono}>X2:7</text></g>
      <path d="M180 75H240M100 130L160 170M320 130L260 170" {...ln(A, 1.2)} strokeDasharray="4 3" />
    </svg>
  );
}
function PanelVisual() {
  return (
    <svg viewBox="0 0 420 300" className="block h-auto w-full" role="img" aria-label="Illustrative control panel layout with DIN rails, cable ducts, clearance zones and gland plate">
      <rect width="420" height="300" fill="#0B1120" /><Grid w={420} h={300} dark />
      <rect x="90" y="20" width="240" height="250" {...ln("#E2E8F0", 1.6)} />
      {[60, 130, 200].map((y) => <g key={y}><rect x="104" y={y} width="212" height="10" fill="#334155" /><path d={`M104 ${y + 40}H316`} {...ln("#64748B", 6)} />{[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={110 + k * 34} y={y - 28} width="24" height="28" {...ln(k === 2 && y === 60 ? A : "#7DD3FC", 1.2)} />)}</g>)}
      <rect x="104" y="28" width="212" height="18" fillOpacity="0.08" {...ln(A, 0.8)} fill={A} strokeDasharray="3 3" />
      <rect x="104" y="250" width="212" height="14" {...ln("#E2E8F0", 1)} />{[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={130 + k * 40} cy="257" r="4" {...ln("#E2E8F0", 1)} />)}
      <path d="M340 60h40M340 260h40" {...ln("#64748B", 1)} />
    </svg>
  );
}
function RoutingVisual() {
  return (
    <svg viewBox="0 0 420 240" className="block h-auto w-full" role="img" aria-label="A schematic connection drawn straight, beside the physical route it has to take around obstacles">
      <rect width="420" height="240" fill="#fff" /><Grid w={420} h={240} />
      <rect x="20" y="40" width="40" height="40" {...ln(N, 1.4)} /><rect x="360" y="40" width="40" height="40" {...ln(N, 1.4)} />
      <path d="M60 60H360" {...ln("#94A3B8", 1.2)} strokeDasharray="6 4" />
      <rect x="150" y="100" width="70" height="70" {...ln("#64748B", 1)} fill="#E2E8F0" /><rect x="260" y="20" width="30" height="120" {...ln("#64748B", 1)} fill="#E2E8F0" />
      <path d="M40 80V200H240V180H330V100H380V80" {...ln(B, 2.2)} />
      <circle cx="240" cy="200" r="5" {...ln(A, 1.4)} /><circle cx="330" cy="180" r="5" {...ln(A, 1.4)} />
    </svg>
  );
}
function SegregationVisual() {
  return (
    <svg viewBox="0 0 420 200" className="block h-auto w-full" role="img" aria-label="Separate cable tray tiers for power, control and instrumentation cabling">
      <rect width="420" height="200" fill="#0B1120" /><Grid w={420} h={200} dark />
      {[[40, "#F87171"], [95, A], [150, "#7DD3FC"]].map(([y, c]) => <g key={y as number}><path d={`M30 ${y}H390`} {...ln("#64748B", 2)} /><path d={`M30 ${(y as number) - 12}V${y}M390 ${(y as number) - 12}V${y}`} {...ln("#64748B", 1.4)} />{[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={60 + k * 14} cy={(y as number) - 6} r="5" {...ln(c as string, 1.4)} />)}</g>)}
      <path d="M400 40V150" {...ln("#94A3B8", 0.8)} strokeDasharray="3 3" />
    </svg>
  );
}
function RenewableVisual() {
  return (
    <svg viewBox="0 0 420 220" className="block h-auto w-full" role="img" aria-label="Concept single-line with grid supply, rooftop solar and battery storage feeding a main switchboard">
      <rect width="420" height="220" fill="#fff" /><Grid w={420} h={220} />
      <path d="M60 110H360" {...ln(N, 3)} />
      <g {...ln(N, 1.4)}><path d="M80 110V60" /><path d="M70 60l10 -20l10 20" /></g>
      <g {...ln(A, 1.4)}><path d="M200 110V150" /><rect x="180" y="150" width="40" height="30" /><path d="M186 168h28M190 160l8 -6 8 6" /></g>
      <g {...ln(B, 1.4)}><path d="M300 110V150" /><rect x="282" y="150" width="36" height="40" /><path d="M292 160h16M300 156v8M292 180h16" /></g>
      <g {...ln(N, 1.4)}><path d="M140 110V140" /><rect x="128" y="140" width="24" height="18" /></g>
      <circle cx="250" cy="110" r="6" {...ln("#DC2626", 1.4)} /><circle cx="110" cy="110" r="6" {...ln("#DC2626", 1.4)} />
    </svg>
  );
}
function ProjectPanelVisual() {
  return <div className="w-full p-6"><PanelVisual /></div>;
}
function AsBuiltVisual() {
  return (
    <svg viewBox="0 0 420 300" className="block h-auto w-full" role="img" aria-label="Illustrative as-built reconciliation: existing drawing overlaid with field-verified and unverified items">
      <rect width="420" height="300" fill="#0B1120" /><Grid w={420} h={300} dark />
      <path d="M60 60H360V240H60Z" {...ln("#64748B", 1.2)} strokeDasharray="6 4" />
      <path d="M80 100H200V200H320" {...ln("#64748B", 1.4)} strokeDasharray="6 4" />
      <path d="M80 100H220V180H320" {...ln("#4ADE80", 2)} />
      <circle cx="220" cy="100" r="6" {...ln("#4ADE80", 1.4)} fill="#0B1120" /><circle cx="320" cy="180" r="6" {...ln("#4ADE80", 1.4)} fill="#0B1120" />
      <rect x="250" y="80" width="40" height="30" {...ln(A, 1.4)} strokeDasharray="3 3" /><text x="270" y="100" textAnchor="middle" fontSize="12" fill={A} style={mono}>?</text>
      <path d="M100 260h16M140 260h16" {...ln("#64748B", 1.4)} strokeDasharray="4 3" /><path d="M200 260h16" {...ln("#4ADE80", 2)} /><rect x="260" y="254" width="14" height="12" {...ln(A, 1.2)} strokeDasharray="3 3" />
    </svg>
  );
}

/* ───────── page ───────── */
const FLOW = ["Schematic", "Panel / switchboard", "Installation", "Testing & commissioning", "Handover", "Maintenance"];
const COVERS = ["Single-line diagrams", "Electrical schematics", "Switchboard drawings", "Control panel drawings", "Cable schedules", "As-built documentation", "Electrical layouts", "Installation documentation", "Commissioning support documentation"];
const USERS = ["Panel builder", "Site electrician", "Electrical contractor", "Commissioning engineer", "Facilities team"];
const TRIAD = [["Schematic", "What the electrical logic is intended to do."], ["Physical layout", "Where components and equipment actually sit."], ["Cable schedule", "How every connection is identified and traced."]];
const MISMATCH = ["Installation confusion", "Commissioning delays", "Troubleshooting problems", "Maintenance errors", "Rework"];

export function ElecProjectsPage({ category, projects }: { category: ProjectCategory; projects: Project[] }) {
  const p = (h: string) => category.intro.find((x) => x.heading?.startsWith(h))?.paragraphs ?? [];
  const covers = p("What This"), consLeg = p("Consistency"), lasts = p("Documentation That Lasts"), coord = p("Discipline"), test = p("Testing"), haz = p("Hazardous"), earth = p("Earthing"), env = p("Environmental"), hand = p("Handover"), seg = p("Cable Segregation"), route = p("Physical Routing"), mlr = p("Metering");
  const visuals: Record<string, React.ReactNode> = { "switchboard-and-control-panel-drawings": <ProjectPanelVisual />, "as-built-electrical-documentation": <AsBuiltVisual /> };
  const a = (href: string, t: string, dark?: boolean) => <Link href={href} className={cn("font-medium underline underline-offset-4", dark ? "text-white hover:text-amber-300" : "text-slate-900 hover:text-amber-700")}>{t}</Link>;
  const collection = {
    "@context": "https://schema.org", "@type": "CollectionPage", name: `${category.name} Project Examples`, description: category.description, url: absoluteUrl(`/projects/${category.slug}`),
    mainEntity: { "@type": "ItemList", itemListElement: projects.map((x, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/projects/${x.discipline}/${x.slug}`), name: x.title })) },
  };

  return (
    <>
      <JsonLd data={collection} />
      <section className="relative overflow-hidden border-b border-slate-800 bg-[#0B1120] pb-14 pt-12 text-white sm:pb-20 sm:pt-16">
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-200/[0.05]"><defs><pattern id="ep-g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#ep-g)" /></svg>
        <Container className="relative grid gap-10 [&>*]:min-w-0 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-300">Project category · Electrical</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{category.name} Project Examples</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">Schematics, single-line diagrams, switchboard and control panel drawings and as-built records — documentation for the people who build, install, commission and maintain electrical systems.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#examples" size="lg" variant="outline-light">See project examples</Button></div>
          </div>
          <Reveal>
            <ol className="border border-slate-700 bg-slate-900/60 p-5 sm:p-6" aria-label="Where electrical documentation is used">
              <li className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Where the documentation gets used</li>
              {FLOW.map((x, k) => <li key={x} className="flex items-center gap-3 border-l-2 border-slate-700 py-1.5 pl-4 text-sm text-slate-100 first:border-amber-400"><span className="font-mono text-[10px] text-amber-300">{String(k + 1).padStart(2, "0")}</span>{x}</li>)}
            </ol>
          </Reveal>
        </Container>
      </section>

      <Sec id="covers">
        <Head eyebrow="What this category covers" heading="Documentation People Can Build and Work From">{covers.map((x) => <p key={x}>{x}</p>)}</Head>
        <div className="mt-10 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <Reveal><Card eyebrow="Documentation types" title="What electrical projects can include"><Chips items={COVERS} /></Card></Reveal>
          <Reveal delay={100}><Card eyebrow="Who works from it" title="Drawn to a level they can rely on"><ul className="space-y-1.5">{USERS.map((u) => <li key={u} className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-600" aria-hidden />{u}</li>)}</ul></Card></Reveal>
        </div>
        <p className="mt-6 text-sm text-slate-600">The service behind these projects is {a("/services/electrical/electrical-drafting", "electrical drafting")}; older paper or PDF drawings can be brought into native CAD through {a("/services/cad-conversion/cad-conversion", "CAD conversion")}.</p>
      </Sec>

      <Sec id="consistency" tint>
        <Head eyebrow="Consistency" heading="Schematic, Layout and Cable Schedule Have to Agree"><p>{consLeg[0]}</p></Head>
        <div className="mt-10 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal><div className="border border-slate-300"><ConsistencyVisual /></div></Reveal>
          <Reveal delay={100}>
            <ul className="space-y-2">{TRIAD.map(([t, d]) => <li key={t} className="border border-slate-300 bg-white px-4 py-3"><h3 className="text-sm font-semibold text-slate-900">{t}</h3><p className="mt-0.5 text-sm text-slate-600">{d}</p></li>)}</ul>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">A mismatch between them shows up as</p>
            <Chips items={MISMATCH} />
          </Reveal>
        </div>
      </Sec>

      <Sec id="legacy">
        <div className="grid gap-10 [&>*]:min-w-0 lg:grid-cols-2">
          <Reveal><SectionHeading eyebrow="Legacy systems" heading="Connecting New Work to Existing Installations" /><p className="mt-5 text-[15px] leading-relaxed text-slate-600">{consLeg[1]}</p><Chips items={["Legacy control systems", "Existing panels", "Existing field wiring", "Older equipment", "Interface requirements"]} /><p className="mt-3 text-sm text-slate-500">Interface compatibility is checked before the new design is finalised — not discovered at connection.</p></Reveal>
          <Reveal delay={100}><SectionHeading eyebrow="Beyond installation" heading="Documentation That Lasts Beyond Installation" /><p className="mt-5 text-[15px] leading-relaxed text-slate-600">{lasts[0]}</p><div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase"><div className="border border-emerald-300 bg-emerald-50 p-2 text-emerald-800">Known</div><div className="border border-sky-300 bg-sky-50 p-2 text-sky-800">Field-verified</div><div className="border border-amber-300 bg-amber-50 p-2 text-amber-800">Unverified legacy</div></div><p className="mt-2 text-xs text-slate-500">Uncertain site information is marked as such, never presented as confirmed.</p></Reveal>
        </div>
      </Sec>

      <Sec id="panel-layout" dark>
        <Head dark eyebrow="Switchboards & control panels" heading="Schematic Logic Alone Doesn't Make a Buildable Panel"><p>{lasts[1]}</p></Head>
        <div className="mt-10 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal><div className="border border-slate-700"><PanelVisual /></div></Reveal>
          <Reveal delay={100}><ul className="grid grid-cols-2 gap-2">{["Component clearance", "Heat dissipation", "Cable entry", "Cable routing / ducting", "Maintenance access", "Physical placement", "Enclosure constraints", "Panel buildability"].map((x) => <li key={x} className="border border-slate-700 px-3 py-2.5 text-sm text-slate-200">{x}</li>)}</ul><p className="mt-4 text-sm text-slate-400">The panel drawing has to fit the physical reality of the enclosure as well as the circuit logic.</p></Reveal>
        </div>
      </Sec>

      <Sec id="coordination">
        <div className="grid gap-10 [&>*]:min-w-0 lg:grid-cols-2">
          <Reveal><SectionHeading eyebrow="Discipline coordination" heading="Coordinating With Mechanical and Structural Work" /><p className="mt-5 text-[15px] leading-relaxed text-slate-600">{coord[0]}</p><Chips items={["Switchboard location", "Cable tray paths", "Penetrations", "Equipment interfaces", "Physical access"]} /></Reveal>
          <Reveal delay={100}><SectionHeading eyebrow="Labelling" heading="One Tag, Everywhere It Appears" /><p className="mt-5 text-[15px] leading-relaxed text-slate-600">{coord[1]}</p><ol className="mt-4 flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase">{["Schematic tag", "Panel label", "Equipment ID", "Cable schedule", "Layout", "Maintenance docs"].map((x, k) => <li key={x} className="flex items-center gap-1.5">{k ? <span aria-hidden className="text-amber-600">=</span> : null}<span className="border border-slate-300 px-2 py-1 text-slate-700">{x}</span></li>)}</ol></Reveal>
        </div>
      </Sec>

      <Sec id="calculations" tint>
        <Head eyebrow="Electrical basis" heading="Load Calculation, Cable Sizing and Load Balancing"><p>{test[1]}</p><p>{hand[1]}</p></Head>
        <Reveal className="mt-8"><div className="grid gap-3 sm:grid-cols-3">{[["Looks complete", "Every circuit drawn, every tag in place."], ["Isn't verified", "Loads, cable sizes and protective devices not checked against the design basis."], ["Is unreliable", "The drawing can't be trusted for installation until its basis is confirmed."]].map(([t, d], k) => <div key={t} className={cn("border p-4", k === 2 ? "border-red-300 bg-red-50" : "border-slate-300 bg-white")}><p className="font-mono text-[10px] uppercase text-slate-500">{String(k + 1).padStart(2, "0")}</p><h3 className="mt-1 text-sm font-semibold text-slate-900">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p></div>)}</div><p className="mt-3 text-xs text-slate-500">No calculation results are shown here — values come from the project&apos;s electrical design.</p></Reveal>
      </Sec>

      <Sec id="commissioning">
        <Head eyebrow="Testing & commissioning" heading="Commissioning Is Planned During Drafting"><p>{test[0]}</p><p>{env[1]}</p></Head>
        <Reveal className="mt-8"><Chips items={["Test schedules", "Functional test records", "Circuit references", "Equipment references", "Schematic references", "Commissioning checklists"]} /></Reveal>
      </Sec>

      <Sec id="environment" tint>
        <Head eyebrow="Where applicable" heading="Hazardous Areas and Environmental Conditions"><p>{haz[0]}</p><p>{env[0]}</p></Head>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Reveal className="h-full"><Card eyebrow="Conditions" title="What the site may involve"><Chips items={["Hazardous areas", "Dust", "Moisture", "Temperature", "Vibration", "Outdoor exposure"]} /></Card></Reveal>
          <Reveal delay={100} className="h-full"><Card eyebrow="Affects" title="What the documentation has to reflect"><Chips items={["Equipment selection", "Enclosure rating", "Protection requirements", "Installation details"]} /></Card></Reveal>
        </div>
      </Sec>

      <Sec id="capacity">
        <div className="grid gap-10 [&>*]:min-w-0 lg:grid-cols-2">
          <Reveal><SectionHeading eyebrow="Future capacity" heading="Sensible Spare Capacity — Not Over-Engineering" /><p className="mt-5 text-[15px] leading-relaxed text-slate-600">{haz[1]}</p><Chips items={["Spare ways", "Future circuits", "Physical space", "Cable capacity"]} /></Reveal>
          <Reveal delay={100}><SectionHeading eyebrow="Earthing & protection" heading="Documented, Not Assumed" /><p className="mt-5 text-[15px] leading-relaxed text-slate-600">{earth[0]}</p><Chips items={["Earthing arrangements", "Protective devices", "Protection coordination", "Electrical interfaces"]} /></Reveal>
        </div>
      </Sec>

      <Sec id="interfaces" dark>
        <Head dark eyebrow="System interfaces" heading="Making Signals Between Systems Understandable"><p>{earth[1]}</p></Head>
        <Reveal className="mt-8"><Chips dark items={["Building management systems", "PLCs", "Process control", "Fire system interlocks", "Other building / process systems"]} /></Reveal>
      </Sec>

      <Sec id="routing">
        <Head eyebrow="Cable & conduit routing" heading="Electrically Valid Isn't the Same as Physically Feasible"><p>{route[0]}</p></Head>
        <div className="mt-10 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal><div className="border border-slate-300"><RoutingVisual /></div></Reveal>
          <Reveal delay={100}><div className="grid gap-3"><Card eyebrow="Schematic" title="Electrical validity"><p>The circuit works logically — a straight line between two terminals.</p></Card><Card eyebrow="Site" title="Physical feasibility"><p>The cable needs a practical route through ceiling spaces, floor penetrations, trays, conduit and underground services, with access to equipment.</p></Card></div></Reveal>
        </div>
      </Sec>

      <Sec id="emergency" tint>
        <Head eyebrow="Emergency & backup" heading="Power, Emergency and Backup Systems"><p>{route[1]}</p></Head>
        <Reveal className="mt-8"><Chips items={["Emergency power", "Backup power", "Changeover logic", "Load prioritisation", "Critical circuits"]} /></Reveal>
      </Sec>

      <Sec id="metering-lighting-renewable">
        <SectionHeading eyebrow="Further documentation types" heading="Metering, Lighting and Renewable Integration" />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <Reveal className="h-full"><Card eyebrow="Metering & sub-metering" title="Documented for how the meter is used"><p>{mlr[0]}</p></Card></Reveal>
          <Reveal delay={80} className="h-full"><Card eyebrow="Where in scope" title="Lighting documentation"><p>{mlr[1]}</p></Card></Reveal>
          <Reveal delay={160} className="h-full"><Card eyebrow="Distributed generation" title="Rooftop solar and battery storage"><p>{mlr[2]}</p><div className="border border-slate-200"><RenewableVisual /></div></Card></Reveal>
        </div>
      </Sec>

      <Sec id="handover" tint>
        <Head eyebrow="Handover & maintenance" heading="Handover Documentation Isn't an Afterthought"><p>{hand[0]}</p></Head>
        <Reveal className="mt-8"><Chips items={["Facilities management", "Maintenance", "Fault finding", "Future modifications", "Asset understanding", "Replacement parts"]} /></Reveal>
      </Sec>

      <Sec id="segregation" dark>
        <Head dark eyebrow="Cable segregation" heading="Power, Control and Instrumentation Kept Apart"><p>{seg[0]}</p></Head>
        <div className="mt-10 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal><div className="border border-slate-700"><SegregationVisual /></div></Reveal>
          <Reveal delay={100}><ul className="space-y-2 text-sm">{[["Power", "border-red-400/60"], ["Control", "border-amber-400/60"], ["Instrumentation", "border-sky-400/60"]].map(([t, c]) => <li key={t} className={cn("border-l-4 bg-slate-900/60 px-4 py-2.5 text-slate-100", c)}>{t}</li>)}</ul><p className="mt-4 text-sm text-slate-400">Carried through cable schedules, routing drawings and the physical installation — following the project&apos;s engineering requirements.</p></Reveal>
        </div>
      </Sec>

      <section className="border-t border-amber-300 bg-amber-50 py-14 sm:py-20">
        <Container className="max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-800">The underlying test</p>
          <h2 className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-slate-900 sm:text-3xl">Can a panel shop, site electrician or facilities maintenance team work confidently and safely from the documentation without having to guess at design intent?</h2>
          <p className="mt-5 text-[15px] leading-relaxed text-slate-700">{seg[1]}</p>
        </Container>
      </section>

      <section id="examples" className="scroll-mt-20 border-t border-slate-200 bg-white py-16 sm:py-24">
        <Container>
          <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="Project examples" heading="Illustrative Electrical Case Studies" description="Placeholder case studies structured the way a real project is documented — challenge, scope, process, deliverables, key considerations and outcome. They are not records of specific past clients." /><Link href="/projects" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">All projects →</Link></Reveal>
          <div className="mt-10 space-y-6">{projects.map((x) => <Reveal key={x.slug}><MechCaseStudy project={x} visual={visuals[x.slug] ?? <AsBuiltVisual />} /></Reveal>)}</div>
          <p className="mt-6 text-sm text-slate-600">Related industries: {a("/industries/construction", "Construction")} · {a("/industries/manufacturing", "Manufacturing")} · {a("/industries/energy", "Energy")} · {a("/industries/mining", "Mining")}</p>
        </Container>
      </section>

      <FAQ items={category.faqs} heading="Frequently Asked Questions" />

      <section className="border-t border-slate-800 bg-[#0B1120] py-16 text-white sm:py-20">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div><h2 className="text-3xl font-semibold tracking-tight">Need schematics, panel drawings or an as-built record?</h2><p className="mt-3 max-w-xl text-slate-300">Tell us what exists today and who needs to work from the documentation — we&apos;ll review the requirements and scope it.</p></div>
          <div className="flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="/services/electrical/electrical-drafting" size="lg" variant="outline-light">Electrical drafting</Button></div>
        </Container>
      </section>
    </>
  );
}
