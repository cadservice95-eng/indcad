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
import { Viewer, ModelLayers, FitExplorer, TolSwitch, ReverseSlider, FixtureSwitch, EVSwitch, RedesignSwitch, Deliverables, SoftwareSwitch, CapabilityMap, FaqBrowser } from "./AutoClient";
import { Glyph } from "./AutoVisuals";

/* ───────── section shells: graphite lab + light drawing office ───────── */
function Dark({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative scroll-mt-20 overflow-hidden border-t border-slate-800 bg-[#0B0E12] py-20 text-white sm:py-28">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.035]"><defs><pattern id={`${id}-g`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill={`url(#${id}-g)`} /></svg>
      <Container className="relative">{children}</Container>
    </section>
  );
}
function Light({ id, tint, children }: { id: string; tint?: boolean; children: React.ReactNode }) {
  return <section id={id} className={cn("relative scroll-mt-20 border-t border-slate-200 py-20 sm:py-28", tint ? "bg-[#ECEEF1]" : "bg-[#F6F7F9]")}><Container>{children}</Container></section>;
}
function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      {children ? <div className={cn("space-y-4 text-base leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{children}</div> : null}
    </Reveal>
  );
}
function Flow({ steps, dark = true }: { steps: string[]; dark?: boolean }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em]">
      {steps.flatMap((s, i) => [i ? <li key={`a${s}`} aria-hidden className="text-amber-400">→</li> : null, <li key={s} className={cn("border px-3 py-1.5", i === steps.length - 1 ? "border-amber-400 bg-amber-400/10 " + (dark ? "text-white" : "text-slate-900") : dark ? "border-slate-600 text-slate-200" : "border-slate-300 bg-white text-slate-700")}>{s}</li>])}
    </ol>
  );
}
const para = (i: Industry, h: string) => i.description.find((d) => d.heading?.startsWith(h))?.paragraphs ?? [];

/* ───────── FAQ grouping (all questions from the industry data) ───────── */
const CATS: [string, string[]][] = [
  ["Reverse engineering", ["Can you reverse-engineer", "Do you support reverse engineering for older", "Do you provide 3D scanning-based"]],
  ["Tooling & fixtures", ["Can you produce tooling", "Do you support automotive tooling", "Do you draft tooling documentation for automotive stamping", "Do you provide fixture documentation", "Do you provide documentation for automotive tooling maintenance"]],
  ["Components & manufacturing", ["What tolerancing standard", "Can you support component documentation for electric", "Do you draft brackets and mounts", "Do you draft engine or drivetrain", "Do you provide documentation for automotive interior", "Can you support first-article", "Can you support documentation for automotive components produced through additive", "Do you draft documentation for automotive prototype"]],
  ["Supplier documentation", ["Can you draft to more than one OEM", "Can you help document a component change", "Can you produce documentation for a component supplied to more than one", "Can you support both OEM-facing", "Can you support a supplier managing", "Do you provide 3D models suitable for automotive supplier PPAP", "Can you support documentation for a component recall"]],
  ["Aftermarket", ["Do you provide documentation support for automotive aftermarket", "Can you support a two-wheeler", "Can you support documentation for automotive components sold through both"]],
  ["Design & manufacturing review", ["Can you help reduce per-unit", "Can you support a component redesign to reduce weight", "Can you support a component redesign driven by a material"]],
];
function groupFaqs(faqs: FAQItem[]) {
  const used = new Set<string>();
  const groups = CATS.map(([cat, keys]) => ({ cat, items: keys.flatMap((k) => { const f = faqs.find((q) => q.question.startsWith(k) && !used.has(q.question)); if (f) used.add(f.question); return f ? [f] : []; }) }));
  const rest = faqs.filter((f) => !used.has(f.question));
  if (rest.length) groups[2].items.push(...rest);
  return groups.filter((g) => g.items.length);
}

const TYPES: [string, string][] = [["bracket", "Visual: bracket CAD"], ["reverse", "Physical part → CAD"], ["fixture", "Fixture assembly"], ["sheet", "Flat pattern → folded part"], ["drawing", "Model → drawing package"], ["stack", "Multi-part assembly"], ["ev", "Enclosure & mounting"]];
const FILES = [["3D_MODEL", "model"], ["MANUFACTURING_DRAWING", "drawing"], ["REVERSE_ENGINEERED_MODEL", "reverse"], ["SHEET_METAL_FLAT_PATTERN", "sheet"], ["TOOLING_FIXTURE_DRAWING", "fixture"], ["TOLERANCE_DOCUMENTATION", "stack"]];
const SW_META: Record<string, { workflow: string; output: string }> = {
  solidworks: { workflow: "3D CAD · sheet metal", output: "Component + drawing" },
  inventor: { workflow: "Assembly modelling", output: "Assembly + drawing" },
  "fusion-360": { workflow: "Product / component", output: "Model + manufacturing drawing" },
};

export function AutomotivePage({ industry: i }: { industry: Industry }) {
  const svcs = i.services.flatMap((s) => { const v = getServiceBySlug(s); return v ? [v] : []; });
  const sw = i.software.flatMap((s) => { const v = getSoftwareBySlug(s); return v ? [{ slug: v.slug, name: v.name, ...SW_META[v.slug] }] : []; });
  const projs = ["sheet-metal-enclosure-fabrication-drawings", "legacy-machine-part-reverse-engineering"].flatMap((s) => { const p = projects.find((x) => x.slug === s); return p ? [p] : []; });
  const [mm, tol, tool, ev, after] = ["Manufacturable", "Tolerance", "Tooling", "Electric", "The Aftermarket"].map((h) => para(i, h));
  const req = i.documentationRequirements;
  const groups = groupFaqs(i.faqs);

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-[#0B0E12] pb-16 pt-14 text-white sm:pb-24 sm:pt-20">
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.04]"><defs><pattern id="au-hero-g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#au-hero-g)" /></svg>
        <Container className="relative grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-300">Automotive engineering &amp; CAD</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{i.heroHeading}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">{i.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#capabilities" size="lg" variant="outline-light">Explore Automotive Capabilities</Button></div>
            <p className="mt-8 border-l-2 border-amber-400 pl-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-slate-400">Designed for the reality between the CAD model and the production floor.</p>
          </div>
          <Viewer />
        </Container>
      </section>

      <Light id="capabilities">
        <Head eyebrow="Component design" heading="Manufacturable Models for a Real Supply Chain">{mm.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-12"><ModelLayers /></Reveal>
      </Light>

      <Dark id="fit">
        <Head dark eyebrow="Fit, not just shape" heading="A Part Has to Work With the Parts Around It"><p>{tol[0]}</p></Head>
        <Reveal className="mt-12"><FitExplorer /></Reveal>
      </Dark>

      <Dark id="tolerance">
        <Head dark eyebrow="Tolerance sensitivity" heading="Tolerance Sensitivity Starts at the Drawing Stage"><p>{req[0]}</p><p>Toggle the view to see how individual part variation becomes an assembly condition — and what the drawing needs to control.</p></Head>
        <Reveal className="mt-12"><TolSwitch /></Reveal>
      </Dark>

      <Light id="reverse" tint>
        <Head eyebrow="Reverse engineering" heading="Reverse Engineering Without Mistaking Wear for Design Intent"><p>{tol[1]}</p></Head>
        <Reveal className="mt-8"><Flow dark={false} steps={["Physical sample", "Reference / measurement", "Observed geometry", "Engineering interpretation", "Nominal CAD model", "Drawing"]} /></Reveal>
        <div className="mt-8 rounded-none bg-[#0B0E12] p-4 sm:p-6"><ReverseSlider /></div>
        <p className="mt-3 text-xs text-slate-500">Working from legacy drawings rather than a part? See <Link href="/services/cad-conversion/cad-conversion" className="underline underline-offset-4">CAD Conversion</Link>.</p>
      </Light>

      <Dark id="aftermarket">
        <Head dark eyebrow="Aftermarket" heading="Supporting the Automotive Aftermarket">{after.map((p) => <p key={p}>{p}</p>)}</Head>
        <Reveal className="mt-10"><ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {[["Older / existing part", "reverse"], ["Reference", "reverse"], ["Reverse engineering", "stack"], ["3D CAD", "model"], ["Drawing", "drawing"], ["Replacement component", "bracket"]].map(([l, g], k) => (
            <li key={l} className="border border-slate-700 bg-[#11161C]"><Glyph k={g} /><p className="border-t border-slate-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-slate-200"><span className="text-amber-400">{String(k + 1).padStart(2, "0")}</span> {l}</p></li>
          ))}
        </ol></Reveal>
      </Dark>

      <Light id="tooling">
        <Head eyebrow="Tooling & fixtures" heading="Tooling for High-Volume Production"><p>{tool[0]}</p><p>{req[2]}</p></Head>
        <div className="mt-12 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
          <Reveal><div className="bg-[#0B0E12] p-3"><FixtureSwitch /></div></Reveal>
          <Reveal delay={120}><Flow dark={false} steps={["Fixture", "Part location", "Repeatable position", "Production documentation"]} /><p className="mt-5 text-sm leading-relaxed text-slate-600">Base, locators, clamps and workpiece are documented as a set, so the part lands in the same place every cycle. This is documentation of the tooling concept — Render CAD Hub doesn&apos;t manufacture physical tooling.</p></Reveal>
        </div>
      </Light>

      <Dark id="ev">
        <Head dark eyebrow="EV components" heading="CAD Support for Emerging EV Components"><p>{ev[0]}</p><p className="text-sm text-slate-400">Scope is the mechanical and documentation side — enclosure, mounting, sheet metal and structure — not battery, electrical or thermal engineering.</p></Head>
        <Reveal className="mt-12"><EVSwitch /></Reveal>
      </Dark>

      <Light id="redesign" tint>
        <Head eyebrow="Cost-driven redesign" heading="Design Changes With Manufacturing in Mind"><p>Component suppliers under pressure to reduce cost per part often turn to design and drafting support specifically to review manufacturability — a bracket or housing redesigned with production tooling and material usage in mind.</p></Head>
        <Reveal className="mt-12"><RedesignSwitch /></Reveal>
      </Light>

      <Light id="types">
        <Head eyebrow="Project types" heading="Typical Automotive Project Types" />
        <ul className="mt-12 grid gap-px border border-slate-300 bg-slate-300 sm:grid-cols-2 lg:grid-cols-4">
          {i.useCases.map((u, k) => (
            <li key={u} className={cn("group bg-white", k === 0 && "lg:col-span-2 lg:row-span-2")}><Reveal delay={k * 50} className="h-full">
              <div className="overflow-hidden bg-[#0F1216]"><div className="transition-transform duration-500 group-hover:scale-[1.04]"><Glyph k={TYPES[k]?.[0] ?? "model"} /></div></div>
              <div className="p-4"><p className="font-mono text-[10px] text-slate-400">{String(k + 1).padStart(2, "0")} · {TYPES[k]?.[1]}</p><h3 className="mt-1 text-base font-semibold text-slate-900">{u}</h3></div>
            </Reveal></li>
          ))}
        </ul>
      </Light>

      <Light id="deliverables" tint>
        <Head eyebrow="Deliverables" heading="Typical Deliverables" />
        <Reveal className="mt-12"><Deliverables items={i.deliverables.map((d, k) => ({ file: FILES[k]?.[0] ?? d, label: d, glyph: FILES[k]?.[1] ?? "model" }))} /></Reveal>
      </Light>

      <Light id="requirements">
        <Head eyebrow="Documentation requirements" heading="Documentation Built Around the Manufacturing Context"><p>{tool[1]}</p></Head>
        <ol className="mt-12 grid gap-4 md:grid-cols-2">
          {req.map((r, k) => (
            <li key={r}><Reveal delay={k * 80} className="h-full"><div className="flex h-full flex-col border border-slate-300 bg-white">
              <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3"><span className="font-mono text-[11px] text-amber-600">{String(k + 1).padStart(2, "0")}</span><h3 className="text-base font-semibold text-slate-900">{["Dimensioning & tolerancing", "Reverse engineering", "High-volume tooling", "Customer-specific conventions"][k]}</h3></div>
              <div className="flex-1 p-5"><p className="text-sm leading-relaxed text-slate-600">{r}</p>
                <div className="mt-4">{[
                  <Flow key="a" dark={false} steps={["Process", "Supplier requirement", "Toleranced drawing"]} />,
                  <Flow key="b" dark={false} steps={["Observed sample", "Nominal design intent"]} />,
                  <Flow key="c" dark={false} steps={["Prototype", "Repeatable production context"]} />,
                  <div key="d" className="grid grid-cols-2 gap-2 font-mono text-[10px] uppercase">{["A", "B"].map((x) => <div key={x} className="border border-slate-300 p-2 text-slate-700">Supplier ↓<br /><span className="text-slate-900">Customer {x} standard</span></div>)}</div>,
                ][k]}</div>
              </div>
            </div></Reveal></li>
          ))}
        </ol>
      </Light>

      <Dark id="supply">
        <Head dark eyebrow="Supply chain" heading="One Component. Multiple Documentation Touchpoints."><p>Render CAD Hub doesn&apos;t perform every step. The highlighted touchpoints are where CAD and drafting documentation supports the workflow.</p></Head>
        <Reveal className="mt-12"><ol className="grid gap-2 md:grid-cols-7">
          {[["Design", "CAD model"], ["Engineering", "Drawing"], ["Supplier", "Supplier handover"], ["Tooling", "Tooling documentation"], ["Manufacturing", ""], ["Inspection", ""], ["Assembly", ""]].map(([s, t], k) => (
            <li key={s} className="flex flex-col">
              <div className="border border-slate-700 bg-[#11161C] px-3 py-4"><span className="font-mono text-[10px] text-slate-500">{String(k + 1).padStart(2, "0")}</span><p className="mt-1 text-sm font-semibold text-white">{s}</p></div>
              {t ? <span className="mt-2 border border-amber-400 bg-amber-400/10 px-2 py-1 text-center font-mono text-[10px] uppercase text-amber-200 shadow-[0_0_16px_rgba(251,191,36,0.25)]">◆ {t}</span> : <span className="mt-2 hidden h-[26px] md:block" />}
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap items-center gap-3 border border-dashed border-amber-400/60 px-4 py-3 font-mono text-[11px] uppercase text-amber-200">↺ In-service / existing part <span aria-hidden>→</span> <span className="border border-amber-400 bg-amber-400/10 px-2 py-0.5">◆ Reverse engineering</span> <span aria-hidden>→</span> back to design</div></Reveal>
      </Dark>

      <Dark id="software">
        <Head dark eyebrow="Software" heading="Software Used in Automotive Projects" />
        <Reveal className="mt-12"><SoftwareSwitch items={sw} /></Reveal>
      </Dark>

      <Dark id="map">
        <Head dark eyebrow="Capability map" heading="Automotive Capability Map" />
        <Reveal className="mt-12"><CapabilityMap /></Reveal>
      </Dark>

      <Light id="projects">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="Portfolio" heading="Related Projects" description="Illustrative examples, marked as such — not automotive client projects." /><Link href="/projects" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">All projects →</Link></Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {projs.map((p, k) => (
            <li key={p.slug}><Reveal delay={k * 90} className="h-full"><Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-colors hover:border-slate-900">
              <div className="grid grid-cols-4 gap-px bg-slate-800">{(k === 0 ? ["model", "ev", "sheet", "drawing"] : ["reverse", "stack", "model", "drawing"]).map((g) => <Glyph key={g} k={g} />)}</div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-3"><span className="font-mono text-xs uppercase tracking-[0.16em] text-amber-600">{p.discipline}</span>{p.isPlaceholder ? <span className="border border-slate-400 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-600">Illustrative example</span> : null}</div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-slate-500">{k === 0 ? "Concept → 3D enclosure → flat pattern → fabrication drawing" : "Legacy part → reference → 3D model → manufacturing drawing"}</p>
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
          {svcs.map((s, k) => (
            <li key={s.slug}><Reveal delay={k * 80} className="h-full"><Link href={`/services/${s.category}/${s.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-colors hover:border-slate-900">
              <Glyph k={["model", "drawing", "stack"][k] ?? "model"} />
              <div className="flex flex-1 flex-col p-5"><h3 className="flex items-center justify-between text-lg font-semibold text-slate-900">{s.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></h3><p className="mt-1.5 text-sm text-slate-600">{s.shortDescription}</p></div>
            </Link></Reveal></li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-slate-600">Related industries: {[["manufacturing", "Manufacturing"], ["defence", "Defence"], ["aerospace", "Aerospace"], ["energy", "Energy"]].map(([s, n], k) => <span key={s}>{k ? " · " : ""}<Link href={`/industries/${s}`} className="font-medium text-slate-900 underline underline-offset-4">{n}</Link></span>)}</p>
      </Light>

      <section id="faq" className="border-t border-slate-200 bg-white py-20 sm:py-28">
        <JsonLd data={faqJsonLd(i.faqs)} />
        <Container>
          <Reveal><SectionHeading eyebrow="FAQs" heading="Frequently Asked Questions" description="Answers describe drafting and modelling scope. CAD documentation supports — but is not — certification, PPAP approval or crash and durability validation." /></Reveal>
          <div className="mt-10"><FaqBrowser groups={groups} /></div>
        </Container>
      </section>

      <section className="border-t border-slate-800 bg-[#0B0E12] py-20 text-white sm:py-24">
        <Container className="grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Get a Quote for Your Automotive Project</h2>
            <p className="mt-4 text-lg text-slate-300">Tell us what you need and our team can review the project requirements.</p>
            <div className="mt-8"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button></div>
          </div>
          <div className="relative mx-auto w-full max-w-xs">
            <svg aria-hidden viewBox="0 0 20 300" className="absolute left-4 top-0 h-full w-5"><path d="M10 10V290" stroke="#FBBF24" strokeWidth="1.5" className="rch-flow" /></svg>
            <ol className="relative space-y-4 pl-12 font-mono text-[11px] uppercase tracking-[0.1em]">{["Project input", "CAD / component", "Documentation", "Manufacturing workflow"].map((s, k) => <li key={s} className={cn("border px-4 py-3", k === 3 ? "border-amber-400 bg-amber-400/10 text-white" : "border-slate-600 text-slate-200")}>{s}</li>)}</ol>
          </div>
        </Container>
      </section>
    </>
  );
}
