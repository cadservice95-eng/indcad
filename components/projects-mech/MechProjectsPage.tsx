import Link from "next/link";
import { Check, X } from "lucide-react";
import type { Project } from "@/lib/types";
import type { projectCategories } from "@/data/project-categories";

type ProjectCategory = (typeof projectCategories)[number];
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/InView";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { MechCaseStudy } from "./MechCaseStudy";

/* ───────── layout primitives ───────── */
function Sec({ id, tint, dark, children }: { id: string; tint?: boolean; dark?: boolean; children: React.ReactNode }) {
  return <section id={id} className={cn("scroll-mt-20 border-t py-16 sm:py-24", dark ? "border-slate-800 bg-[#0F172A] text-white" : tint ? "border-slate-200 bg-[#F4F3EF]" : "border-slate-200 bg-white")}><Container>{children}</Container></section>;
}
function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      {children ? <div className={cn("space-y-4 text-[15px] leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div> : null}
    </Reveal>
  );
}
function Card({ title, children, tone = "light" }: { title: string; children: React.ReactNode; tone?: "light" | "dark" }) {
  return <div className={cn("h-full border p-5", tone === "dark" ? "border-slate-700 bg-slate-900/60" : "border-slate-300 bg-white")}><h3 className={cn("text-base font-semibold", tone === "dark" ? "text-white" : "text-slate-900")}>{title}</h3><div className={cn("mt-2 space-y-3 text-sm leading-relaxed", tone === "dark" ? "text-slate-300" : "text-slate-600")}>{children}</div></div>;
}
const ln = (c: string, w = 1.4) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;
const mono = { fontFamily: "var(--font-mono)" } as const;

/* ───────── small technical SVGs (no SEO text inside) ───────── */
function EnclosureVisual() {
  return (
    <svg viewBox="0 0 480 300" className="block h-auto w-full" role="img" aria-label="Illustrative sheet metal enclosure: folded model beside its flat pattern with bend lines">
      <rect width="480" height="300" fill="#0F172A" />
      <g stroke="#7DD3FC" strokeOpacity="0.06">{Array.from({ length: 25 }, (_, i) => <path key={i} d={`M${i * 20} 0V300`} />)}{Array.from({ length: 16 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 20}H480`} />)}</g>
      <g {...ln("#7DD3FC", 1.6)}><path d="M60 110L130 80L210 115L140 145Z" fill="#7DD3FC" fillOpacity="0.15" /><path d="M60 110V210L140 245V145" fill="#7DD3FC" fillOpacity="0.08" /><path d="M140 245L210 215V115" fill="#7DD3FC" fillOpacity="0.12" />{[0, 1, 2].map((k) => <path key={k} d={`M${152 + k * 16} ${150 - k * 7}v26`} />)}<path d="M76 140l44 20v40l-44 -20z" stroke="#FBBF24" /></g>
      <g {...ln("#E2E8F0", 1.3)}><path d="M270 90h60v-30h60v30h60v120h-60v30h-60v-30h-60z" /></g>
      <g {...ln("#F87171", 0.9)} strokeDasharray="6 3 1 3"><path d="M330 90v120M390 90v120M270 90h180M270 210h180" /></g>
      {[[300, 150], [420, 150], [360, 75], [360, 225]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" {...ln("#E2E8F0", 1)} />)}
      <text x="270" y="270" fill="#94A3B8" fontSize="10" style={mono}>FLAT PATTERN · BEND LINES</text>
      <text x="60" y="270" fill="#94A3B8" fontSize="10" style={mono}>FOLDED MODEL</text>
    </svg>
  );
}
function ReverseVisual() {
  return (
    <svg viewBox="0 0 480 300" className="block h-auto w-full" role="img" aria-label="Illustrative reverse engineering: worn legacy part beside its reconstructed nominal profile">
      <rect width="480" height="300" fill="#0F172A" />
      <g stroke="#7DD3FC" strokeOpacity="0.06">{Array.from({ length: 25 }, (_, i) => <path key={i} d={`M${i * 20} 0V300`} />)}{Array.from({ length: 16 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 20}H480`} />)}</g>
      <path d="M40 120L44 102L190 98L196 118L194 210L44 214Z" fillOpacity="0.7" {...ln("#B8A47E", 1.6)} fill="#3A3322" />
      <ellipse cx="118" cy="156" rx="26" ry="23" {...ln("#B8A47E", 1.4)} fill="#0F172A" />
      <path d="M170 196q8 -6 16 0" {...ln("#F59E0B", 2.4)} /><circle cx="186" cy="104" r="12" {...ln("#F87171", 1)} strokeDasharray="3 2" />
      {[[44, 102], [190, 98], [194, 210], [44, 214], [118, 133], [92, 156]].map(([x, y], i) => <path key={i} d={`M${x - 4} ${y}h8M${x} ${y - 4}v8`} {...ln("#2DD4BF", 1.2)} />)}
      <path d="M220 156h30M244 150l8 6l-8 6" {...ln("#F59E0B", 1.6)} />
      <path d="M280 100H430V212H280Z" fillOpacity="0.1" {...ln("#7DD3FC", 1.8)} fill="#7DD3FC" />
      <circle cx="355" cy="156" r="24" {...ln("#7DD3FC", 1.6)} fill="#0F172A" />
      <path d="M325 156h60M355 126v60" {...ln("#F87171", 0.7)} strokeDasharray="7 2 1 2" />
      <path d="M280 236h150M280 230v12M430 230v12" {...ln("#4ADE80", 1)} />
      <text x="40" y="270" fill="#94A3B8" fontSize="10" style={mono}>MEASURED · WORN · REPAIRED</text>
      <text x="280" y="270" fill="#94A3B8" fontSize="10" style={mono}>NOMINAL RECONSTRUCTION</text>
    </svg>
  );
}
function StartVisual({ k }: { k: number }) {
  return (
    <svg viewBox="0 0 200 110" className="block h-auto w-full" aria-hidden>
      <rect width="200" height="110" fill="#F8FAFC" />
      {k === 0 ? <g><path d="M30 80c10 -40 40 -50 70 -40s40 30 70 10" {...ln("#64748B", 1.4)} strokeDasharray="3 3" /><path d="M120 30h40v40h-40z" {...ln("#0F172A", 1.4)} /></g> : null}
      {k === 1 ? <g><path d="M40 40L44 32L110 30L114 40L112 84L44 86Z" {...ln("#8C7B5E", 1.4)} fill="#E7DFCF" /><path d="M126 58h14M136 54l5 4l-5 4" {...ln("#B45309", 1.4)} /><path d="M150 32h32v52h-32z" {...ln("#0369A1", 1.4)} /></g> : null}
      {k === 2 ? <g><path d="M30 26h70v60H30z" {...ln("#94A3B8", 1.2)} /><path d="M44 40h40M44 52h30M44 64h40" {...ln("#94A3B8", 1)} /><path d="M100 70h70V26h-40" {...ln("#0F172A", 1.4)} /><path d="M140 20l12 0l-6 -10z" {...ln("#DC2626", 1)} /></g> : null}
    </svg>
  );
}

/* ───────── page ───────── */
const LIFECYCLE = ["Concept", "CAD modelling", "Engineering documentation", "Manufacturing", "Inspection", "Revision / change", "Production support"];
const COVERS = [
  ["Reverse-engineering an undocumented component", "Keeps legacy equipment running when the only reference is the part itself."],
  ["Turning concept sketches into manufacturable designs", "Resolves the details a sketch leaves open before anything gets cut or welded."],
  ["Updating an existing CAD model", "Lets a proven design evolve without losing track of what changed."],
  ["Producing manufacturing drawings", "Gives a workshop dimensions, tolerances, material and notes it can build from."],
  ["Creating assembly documentation", "Shows how parts go together — BOM, sequence and mating relationships."],
  ["Supporting custom equipment", "Documents one-off machines so they can be built, maintained and repaired."],
  ["Preparing documentation for production", "Turns a design that worked once into one that repeats reliably."],
];
const STARTS = [
  { t: "Concept / sketch", d: "A concept needs to become a manufacturable design.", w: ["Resolve open details", "Model", "Check fit & manufacturability", "Document"] },
  { t: "Existing physical part", d: "A component with no usable digital record needs to be reverse-engineered.", w: ["Measure", "Separate wear from intent", "Model", "Document with basis"] },
  { t: "Existing CAD / drawing", d: "A design needs modification, revision or a documentation update.", w: ["Confirm current revision", "Change", "Update downstream docs", "Re-issue"] },
];
const RIPPLE = ["Part & assembly drawings", "Bill of materials", "Purchasing specifications", "Inspection documentation", "Parts already in production / stock"];
const SUPPLIER = [["Understand the design", "Views, sections and notes that explain intent, not just geometry."], ["Quote the work", "Material, finish, quantities and processes stated up front."], ["Manufacture the part", "Dimensions and tolerances on the features that matter."], ["Inspect the result", "Critical characteristics identifiable and checkable."]];
const PROTO = [["Tolerances", "Loose or implied — fitted by hand", "Defined for repeatable fit"], ["Manufacturing assumptions", "Whatever the prototype shop did", "Stated process and material"], ["Fixturing", "Not needed for one part", "Considered for repeat location"], ["Inspection", "Visual / functional check", "Critical dimensions identified"], ["Documentation", "Enough to build one", "Enough to build the hundredth"]];
const MASS = ["Structural analysis", "Dynamic analysis", "Handling & lifting", "Transport", "Weight-sensitive product design"];
const OUTSOURCE = ["Self-contained drawings — no reliance on tribal knowledge", "Clear material and finish specifications", "Manufacturing notes where the process matters", "Revision information on every sheet", "Wording that leaves little room for supplier interpretation"];

export function MechProjectsPage({ category, projects }: { category: ProjectCategory; projects: Project[] }) {
  const s = (h: string) => category.intro.find((x) => x.heading?.startsWith(h))?.paragraphs ?? [];
  const [covers, starts, deadlines, tolMat, asm, dfmSup, protoInsp, massOut, stdSpares, finishGdt] = ["What This", "Where", "Deadlines", "Getting", "Assembly", "Design", "From Prototype", "Weight", "Standard", "Cosmetic"].map(s);
  const visuals: Record<string, React.ReactNode> = { "sheet-metal-enclosure-fabrication-drawings": <EnclosureVisual />, "legacy-machine-part-reverse-engineering": <ReverseVisual /> };
  const collection = {
    "@context": "https://schema.org", "@type": "CollectionPage", name: `${category.name} Project Examples`, description: category.description, url: absoluteUrl(`/projects/${category.slug}`),
    mainEntity: { "@type": "ItemList", itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/projects/${p.discipline}/${p.slug}`), name: p.title })) },
  };
  const a = (href: string, t: string) => <Link href={href} className="font-medium text-slate-900 underline underline-offset-4 hover:text-copper-600">{t}</Link>;

  return (
    <>
      <JsonLd data={collection} />
      {/* hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-[#F4F3EF] pb-14 pt-12 sm:pb-20 sm:pt-16">
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-slate-900/[0.05]"><defs><pattern id="mp-g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#mp-g)" /></svg>
        <Container className="relative grid gap-10 [&>*]:min-w-0 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-copper-600">Project category · Mechanical</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">{category.name} Project Examples</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">From a single reverse-engineered part to fabrication drawings, 3D CAD models, sheet metal documentation, assemblies, design revisions and full manufacturing-ready drawing packages — produced so a workshop or supplier can actually build from them.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#examples" size="lg" variant="ghost">See project examples</Button></div>
          </div>
          <Reveal>
            <ol className="border border-slate-300 bg-white p-5 sm:p-6" aria-label="Mechanical project lifecycle">
              <li className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">The lifecycle these projects cover</li>
              {LIFECYCLE.map((x, k) => <li key={x} className="flex items-center gap-3 border-l-2 border-slate-200 py-1.5 pl-4 text-sm text-slate-800 first:border-copper-500"><span className="font-mono text-[10px] text-copper-600">{String(k + 1).padStart(2, "0")}</span>{x}</li>)}
            </ol>
          </Reveal>
        </Container>
      </section>

      <Sec id="covers">
        <Head eyebrow="What this category covers" heading="Documentation a Workshop Can Build From">{covers.map((p) => <p key={p}>{p}</p>)}</Head>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COVERS.map(([t, d], k) => <li key={t}><Reveal delay={k * 40} className="h-full"><div className="h-full border border-slate-300 bg-white p-4"><span className="font-mono text-[10px] text-slate-400">{String(k + 1).padStart(2, "0")}</span><h3 className="mt-1 text-sm font-semibold text-slate-900">{t}</h3><p className="mt-1.5 text-sm text-slate-600">{d}</p></div></Reveal></li>)}
        </ul>
        <p className="mt-6 text-sm text-slate-600">The services behind these projects: {a("/services/mechanical/mechanical-drafting", "mechanical drafting")}, {a("/services/mechanical/3d-cad-modelling", "3D CAD modelling")} and {a("/services/engineering-design/engineering-design", "engineering design")}.</p>
      </Sec>

      <Sec id="starting-points" tint>
        <Head eyebrow="Starting points" heading="Where a Mechanical Project Typically Starts">{starts.map((p) => <p key={p}>{p}</p>)}</Head>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {STARTS.map((x, k) => <li key={x.t}><Reveal delay={k * 80} className="h-full"><div className="flex h-full flex-col border border-slate-300 bg-white"><StartVisual k={k} /><div className="flex flex-1 flex-col p-5"><span className="font-mono text-[10px] text-copper-600">{String(k + 1).padStart(2, "0")}</span><h3 className="mt-1 text-lg font-semibold text-slate-900">{x.t}</h3><p className="mt-1.5 text-sm text-slate-600">{x.d}</p><ol className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10px] uppercase">{x.w.map((w, i) => <li key={w} className="flex items-center gap-1.5">{i ? <span aria-hidden className="text-copper-500">→</span> : null}<span className="border border-slate-300 px-2 py-1 text-slate-700">{w}</span></li>)}</ol></div></div></Reveal></li>)}
        </ul>
        <p className="mt-6 text-sm text-slate-600">Working from paper or PDF drawings? {a("/services/cad-conversion/cad-conversion", "CAD conversion")} brings them into native CAD first.</p>
      </Sec>

      <Sec id="deadlines">
        <Head eyebrow="Schedule & configuration" heading="Deadlines, Configuration and Traceability">{deadlines.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-10"><div className="border border-slate-300 bg-white p-5 sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Drafting sequenced against the production schedule — illustrative</p>
          <div className="mt-4 space-y-2 text-xs">
            {[["Locked dimensions released", 0, 30, "bg-slate-900"], ["Material ordered", 28, 22, "bg-copper-500"], ["Full drawing set", 20, 45, "bg-slate-500"], ["First article", 64, 14, "bg-sky-600"], ["Production / customer delivery", 78, 22, "bg-emerald-600"]].map(([l, x, w, c]) => (
              <div key={l as string} className="grid grid-cols-[150px_1fr] items-center gap-3 sm:grid-cols-[200px_1fr]"><span className="text-slate-700">{l as string}</span><div className="relative h-5 bg-slate-100"><div className={cn("absolute inset-y-0", c as string)} style={{ left: `${x}%`, width: `${w}%` }} /></div></div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">Mechanical drafting is connected to the broader production schedule — not an isolated drawing exercise.</p>
        </div></Reveal>
      </Sec>

      <Sec id="tolerancing" tint>
        <SectionHeading eyebrow="Engineering judgement" heading="Getting Tolerancing and Material Selection Right" />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Reveal className="h-full"><Card title="Tolerancing"><p>{tolMat[0]}</p><ul className="grid grid-cols-2 gap-1.5 pt-1 font-mono text-[10px] uppercase text-slate-700">{["Functional fit", "Manufacturing cost", "Assembly", "Inspection"].map((x) => <li key={x} className="border border-slate-200 px-2 py-1.5">{x}</li>)}</ul></Card></Reveal>
          <Reveal delay={100} className="h-full"><Card title="Material selection"><p>{tolMat[1]}</p><ul className="grid grid-cols-2 gap-1.5 pt-1 font-mono text-[10px] uppercase text-slate-700 sm:grid-cols-3">{["Process", "Machining", "Welding", "Forming", "Durability", "Practicality"].map((x) => <li key={x} className="border border-slate-200 px-2 py-1.5">{x}</li>)}</ul></Card></Reveal>
        </div>
        <Reveal className="mt-4"><p className="border-l-2 border-copper-500 bg-white px-4 py-3 text-sm text-slate-700">A tolerance tighter than the function needs adds manufacturing cost without adding value. One that&apos;s too loose shows up as a fit problem on the shop floor.</p></Reveal>
      </Sec>

      <Sec id="assembly">
        <Head eyebrow="Assemblies & revisions" heading="Assembly Documentation and Managing Change"><p>{asm[0]}</p></Head>
        <div className="mt-10 grid gap-6 [&>*]:min-w-0 lg:grid-cols-2">
          <Reveal><Card title="Part vs assembly documentation"><p>A part drawing defines one component. Assembly documentation defines how components relate:</p><ul className="grid grid-cols-2 gap-1.5 font-mono text-[10px] uppercase text-slate-700">{["Bill of materials", "Assembly sequence", "Mating components", "Interference checks", "Part relationships", "Revision control"].map((x) => <li key={x} className="border border-slate-200 px-2 py-1.5">{x}</li>)}</ul></Card></Reveal>
          <Reveal delay={100}><div className="h-full border border-slate-300 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">One design change, several documents</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{asm[1]}</p>
            <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-3">
              <span className="border border-red-300 bg-red-50 px-3 py-2 font-mono text-[10px] uppercase text-red-700">Rev B → C</span>
              <ul className="space-y-1">{RIPPLE.map((r) => <li key={r} className="flex items-center gap-2 text-sm text-slate-700"><span aria-hidden className="text-copper-500">→</span>{r}</li>)}</ul>
            </div>
          </div></Reveal>
        </div>
      </Sec>

      <Sec id="dfm" dark>
        <Head dark eyebrow="Design for manufacture" heading="A Good CAD Model Accounts for How the Part Will Be Made"><p>{dfmSup[0]}</p></Head>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[["Machining", "Tool access, internal corners, setups"], ["Welding", "Joint access, distortion, sequence"], ["Sheet metal", "Bend radii, relief, the press brake you actually have"], ["Assembly", "Fastener access, alignment, order of build"], ["Supplier capability", "What the chosen shop can realistically hold"], ["Tooling", "Standard tools before special ones"], ["Process", "Cast, machined, fabricated or printed — each changes the drawing"], ["Inspection", "Can the feature actually be measured?"]].map(([t, d], k) => <li key={t}><Reveal delay={k * 40} className="h-full"><Card tone="dark" title={t}><p>{d}</p></Card></Reveal></li>)}
        </ul>
      </Sec>

      <Sec id="suppliers">
        <Head eyebrow="Supplier coordination" heading="Drawings That Work Without the Design Team in the Room"><p>{dfmSup[1]}</p></Head>
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPLIER.map(([t, d], k) => <li key={t}><Reveal delay={k * 60} className="h-full"><div className="h-full border-t-2 border-copper-500 bg-[#F4F3EF] p-5"><span className="font-mono text-[10px] text-slate-500">A supplier needs to</span><h3 className="mt-1 text-base font-semibold text-slate-900">{t}</h3><p className="mt-1.5 text-sm text-slate-600">{d}</p></div></Reveal></li>)}
        </ol>
      </Sec>

      <Sec id="prototype" tint>
        <Head eyebrow="Prototype to production" heading="A Prototype That Works Once Isn't Production-Ready"><p>{protoInsp[0]}</p></Head>
        <Reveal className="mt-10"><div className="overflow-x-auto border border-slate-300 bg-white">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <caption className="sr-only">How documentation changes from prototype to production</caption>
            <thead><tr className="border-b border-slate-300 bg-slate-50 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500"><th scope="col" className="px-4 py-3 font-normal">Topic</th><th scope="col" className="px-4 py-3 font-normal">Prototype</th><th scope="col" className="px-4 py-3 font-normal">Production</th></tr></thead>
            <tbody>{PROTO.map(([t, p, q]) => <tr key={t} className="border-b border-slate-100"><th scope="row" className="px-4 py-3 font-semibold text-slate-900">{t}</th><td className="px-4 py-3 text-slate-500"><X className="mr-1.5 inline h-3.5 w-3.5 text-slate-400" aria-hidden />{p}</td><td className="px-4 py-3 text-slate-800"><Check className="mr-1.5 inline h-3.5 w-3.5 text-emerald-600" aria-hidden />{q}</td></tr>)}</tbody>
          </table>
        </div></Reveal>
      </Sec>

      <Sec id="inspection">
        <Head eyebrow="Inspection & quality" heading="Drawings Structured for the Quality Team"><p>{protoInsp[1]}</p></Head>
        <div className="mt-10 grid gap-6 [&>*]:min-w-0 md:grid-cols-[1fr_1fr] md:items-center">
          <Reveal><svg viewBox="0 0 360 220" className="block h-auto w-full border border-slate-300 bg-white" role="img" aria-label="Illustrative drawing with numbered inspection characteristics">
            <rect width="360" height="220" fill="#fff" /><path d="M60 60H260V160H60Z" {...ln("#0F172A", 1.4)} /><circle cx="160" cy="110" r="26" {...ln("#0F172A", 1.4)} />
            {[[160, 84, 1], [60, 60, 2], [260, 110, 3], [160, 160, 4]].map(([x, y, n]) => <g key={n}><path d={`M${x} ${y}L${x + 30} ${y - 26}`} {...ln("#7C3AED", 0.9)} /><circle cx={x + 38} cy={y - 32} r="10" {...ln("#7C3AED", 1.3)} fill="#fff" /><text x={x + 38} y={y - 28.5} textAnchor="middle" fontSize="10" fill="#7C3AED" fontWeight="700" style={mono}>{n}</text></g>)}
          </svg></Reveal>
          <Reveal delay={100}><ul className="space-y-2">{["First article inspection", "Dimensional inspection plans", "Characteristic identification", "Quality checks against one reference", "Inspection planning from the drawing"].map((x) => <li key={x} className="flex items-center gap-3 border border-slate-200 px-4 py-2.5 text-sm text-slate-800"><Check className="h-4 w-4 text-violet-600" aria-hidden />{x}</li>)}</ul></Reveal>
        </div>
      </Sec>

      <Sec id="mass" tint>
        <div className="grid gap-10 [&>*]:min-w-0 lg:grid-cols-2">
          <Reveal><SectionHeading eyebrow="Mass properties" heading="When Weight Accuracy Matters" /><p className="mt-5 text-[15px] leading-relaxed text-slate-600">{massOut[0]}</p><p className="mt-3 text-sm text-slate-500">Not every project needs it — but where it does, material assignment, volume and density have to be right, not just the visible geometry.</p><ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10px] uppercase text-slate-700">{MASS.map((x) => <li key={x} className="border border-slate-300 bg-white px-2 py-1">{x}</li>)}</ul></Reveal>
          <Reveal delay={100}><SectionHeading eyebrow="Outsourced manufacture" heading="Documentation for Multi-Vendor Production" /><p className="mt-5 text-[15px] leading-relaxed text-slate-600">{massOut[1]}</p><ul className="mt-4 space-y-1.5">{OUTSOURCE.map((x) => <li key={x} className="flex gap-2 text-sm text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-copper-600" aria-hidden />{x}</li>)}</ul></Reveal>
        </div>
      </Sec>

      <Sec id="standard-parts">
        <Head eyebrow="Standard parts & spares" heading="Standard Parts, Spares and the Underlying Test"><p>{stdSpares[0]}</p><p>{stdSpares[1]}</p></Head>
        <ul className="mt-8 flex flex-wrap gap-2 font-mono text-[11px] uppercase">{["Standard fasteners", "Bearings", "Catalogue components", "Purchased parts", "Spare parts", "Wear components"].map((x) => <li key={x} className="border border-slate-300 bg-[#F4F3EF] px-3 py-1.5 text-slate-700">{x}</li>)}</ul>
        <Reveal className="mt-10"><blockquote className="border-l-4 border-copper-500 bg-[#0F172A] px-6 py-6 text-lg leading-relaxed text-white sm:px-8 sm:text-xl">{stdSpares[2]}</blockquote></Reveal>
      </Sec>

      <Sec id="finish-gdt" tint>
        <SectionHeading eyebrow="Finish & GD&T" heading="Cosmetic Finish and When GD&T Is Warranted" />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Reveal className="h-full"><Card title="Surface finish"><p>{finishGdt[0]}</p><ul className="grid grid-cols-2 gap-1.5 font-mono text-[10px] uppercase text-slate-700">{["Surface texture", "Grain direction", "Visible weld grinding", "Cosmetic surfaces"].map((x) => <li key={x} className="border border-slate-200 px-2 py-1.5">{x}</li>)}</ul></Card></Reveal>
          <Reveal delay={100} className="h-full"><Card title="GD&T — where it earns its place"><p>{finishGdt[1]}</p><div className="grid grid-cols-2 gap-2 pt-1 text-xs"><div className="border border-emerald-200 bg-emerald-50 p-2.5 text-emerald-900"><b className="block font-mono text-[10px] uppercase">Adds value</b>Mating interfaces, locating features, form and position that ± can&apos;t express</div><div className="border border-slate-200 bg-slate-50 p-2.5 text-slate-700"><b className="block font-mono text-[10px] uppercase">Simpler is fine</b>Non-critical features well controlled by ± tolerancing</div></div></Card></Reveal>
        </div>
      </Sec>

      <section id="examples" className="scroll-mt-20 border-t border-slate-200 bg-white py-16 sm:py-24">
        <Container>
          <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="Project examples" heading="Illustrative Mechanical Case Studies" description="Placeholder case studies structured the way a real project is documented — challenge, scope, process, deliverables, key considerations and outcome. They are not records of specific past clients." /><Link href="/projects" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">All projects →</Link></Reveal>
          <div className="mt-10 space-y-6">{projects.map((p) => <Reveal key={p.slug}><MechCaseStudy project={p} visual={visuals[p.slug] ?? <EnclosureVisual />} /></Reveal>)}</div>
          <p className="mt-6 text-sm text-slate-600">Related industries: {a("/industries/manufacturing", "Manufacturing")} · {a("/industries/automotive", "Automotive")} · {a("/industries/aerospace", "Aerospace")} · {a("/industries/defence", "Defence")}</p>
        </Container>
      </section>

      <FAQ items={category.faqs} heading="Frequently Asked Questions" />

      <section className="border-t border-slate-800 bg-[#0F172A] py-16 text-white sm:py-20">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div><h2 className="text-3xl font-semibold tracking-tight">Have a part, sketch or drawing set to document?</h2><p className="mt-3 max-w-xl text-slate-300">Tell us where the project starts and what the workshop needs — we&apos;ll review the requirements and scope the documentation.</p></div>
          <div className="flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="/services/mechanical/mechanical-drafting" size="lg" variant="outline-light" arrow>Mechanical drafting</Button></div>
        </Container>
      </section>
    </>
  );
}
