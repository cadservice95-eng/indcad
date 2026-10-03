import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { overviewParagraphs } from "@/components/mechanical/content";
import { projects } from "@/data/projects";
import { getIndustryBySlug } from "@/data/industries";
import { Paper, Char, Head, Sheet, faqOf, sentences } from "@/components/arch/ui";
import { BuildingScene, InteriorView, FloorPlan3D, ContextSvg, StageIcon, AerialView } from "./Scene";
import { HeroWorkspace, Pipeline, OutputsHub, HonestSlider, OptionCompare, MaterialsBoard, LightingStudio, CameraStudio, Walkthrough, PlanningContext, FloorPlan3DSection, ProcessTimeline, CtaScene } from "./RenderClient";

const lk = (c: string) => "font-semibold underline-offset-4 hover:underline " + c;
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const H = (s: Service, p: string, n = 0) => overviewParagraphs(s, p)[n] ?? "";

export function RenderHero({ heading, description }: { heading: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-[#0B1220]">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.07]">
        <defs><pattern id="rh-g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#rh-g)" />
      </svg>
      <div aria-hidden className="pointer-events-none absolute -left-32 top-10 h-[480px] w-[480px] rounded-full bg-blue-500/10 blur-3xl" />
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Architectural</p>
            <h1 style={delay(100)} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">{heading}</h1>
            <p style={delay(220)} className="reveal mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{description}</p>
            <div style={delay(340)} className="reveal mt-9 flex flex-wrap gap-4">
              <Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button>
              <Button href="#workflow" size="lg" variant="outline-light" arrow>Explore Our Process</Button>
            </div>
            <p style={delay(460)} className="reveal mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">See the design before it is built</p>
          </div>
          <div style={delay(300)} className="reveal min-w-0"><HeroWorkspace /></div>
        </Container>
      </InView>
    </section>
  );
}

export function WhySection({ service }: { service: Service }) {
  const s = sentences(service.problemStatement);
  const cmp = [
    { t: "2D documentation", p: ["Technical", "Precise", "Information-heavy"], note: "Communicates what needs to be built." },
    { t: "3D visualisation", p: ["Spatial", "Visual", "Presentation-oriented"], note: "Communicates how the design is intended to look and be experienced." },
  ];
  return (
    <Paper id="why">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <InView threshold={0.15}><Sheet label="The same design, seen rather than read"><BuildingScene stage={4} time="golden" title="A finished visualisation of the illustrative building" className="block h-auto w-full" /></Sheet></InView>
        <Reveal>
          <SectionHeading eyebrow="Why visualisation" heading="A Design Is Easier to Understand When You Can See It" />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600">
            <p>{s[0]} {s[1]}</p>
            <p>{s.slice(2).join(" ")}</p>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {cmp.map((c) => (
              <li key={c.t} className="border border-slate-300 bg-white p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-700">{c.t}</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-800">{c.p.map((x) => <li key={x}>→ {x}</li>)}</ul>
                <p className="mt-2 text-xs text-slate-500">{c.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-slate-500">They serve different purposes — one does not replace the other.</p>
        </Reveal>
      </div>
    </Paper>
  );
}

export function CoversSection({ service }: { service: Service }) {
  return (
    <Paper id="covers" tint>
      <Head eyebrow="Scope" heading="From Drawings to a Complete Visual Story">
        <p>{H(service, "What This Service Covers", 0)}</p>
        <p className="text-sm">Starting points can be 2D drawings, an existing BIM model (<Link href="/software/revit" className={lk("text-navy-900")}>Revit</Link> or <Link href="/software/archicad" className={lk("text-navy-900")}>ArchiCAD</Link>), reference material, finish information and any project-specific camera requirements.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Pipeline /></InView>
    </Paper>
  );
}

export function OutputsSection() {
  return (
    <Paper id="outputs">
      <Head eyebrow="Signature view" heading="One Model. Multiple Ways to See the Design.">
        <p>Everything here comes from the same 3D model. Hover an output to see which part of the model it reads from — a coherent model, not a pile of disconnected images.</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><OutputsHub /></InView>
    </Paper>
  );
}

export function HonestSection({ service }: { service: Service }) {
  return (
    <Char id="honest">
      <Head dark eyebrow="Keeping renders honest" heading="Visualisation Without Losing Design Intent">
        <p>{H(service, "Keeping Renders Honest", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Do renders reflect")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="text-slate-900"><HonestSlider /></div>
        <div className="space-y-4">
          {[
            { t: "Design model", p: ["Actual geometry", "Actual design intent", "Defined materials", "Realistic proportions"] },
            { t: "Presentation visual", p: ["Camera composition", "Lighting", "Materials", "Context and atmosphere"] },
          ].map((b, i) => (
            <div key={b.t}>
              <div className="border border-slate-600 p-4"><p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">{b.t}</p><ul className="mt-2 space-y-1 text-sm text-slate-300">{b.p.map((x) => <li key={x}>• {x}</li>)}</ul></div>
              {i === 0 ? <p aria-hidden className="py-1 text-center text-sky-300">↓</p> : null}
            </div>
          ))}
          <p className="text-sm leading-relaxed text-slate-300">The goal is not to make the project look unrealistically different. It is to communicate the intended design clearly. A render is a presentation of intent — not a construction guarantee.</p>
        </div>
      </InView>
    </Char>
  );
}

export function OptionsSection({ service }: { service: Service }) {
  return (
    <Paper id="options">
      <Head eyebrow="Design development" heading="Explore Design Options Before Finishes Are Locked In">
        <p>{H(service, "Keeping Renders Honest", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you produce multiple material")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><OptionCompare /></InView>
    </Paper>
  );
}

export function MaterialsSection() {
  return (
    <Char id="materials">
      <Head dark eyebrow="Materials" heading="Materials Are Part of the Design Story">
        <p>Stone, concrete, timber, glass, metal, paint, flooring, joinery and exterior finishes — chosen to represent the design, and compared side by side before they are locked in.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><MaterialsBoard /></InView>
    </Char>
  );
}

export function LightingSection() {
  return (
    <Char id="lighting">
      <Head dark eyebrow="Lighting" heading="Same Building. Different Light.">
        <p>Lighting can change how materials, openings, depth, shadows and the overall composition are perceived — so the same model is often shown in more than one condition.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><LightingStudio /></InView>
    </Char>
  );
}

export function CameraSection({ service }: { service: Service }) {
  return (
    <Char id="camera">
      <Head dark eyebrow="Camera" heading="The Right Camera Changes How a Space Is Read">
        <p>{H(service, "Scoping Animations", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Do you provide renders showing a building at street level")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><CameraStudio /></InView>
    </Char>
  );
}

export function WalkSection({ service }: { service: Service }) {
  return (
    <Char id="walkthrough">
      <Head dark eyebrow="Walkthroughs" heading="From a Single Image to a Moving Experience">
        <p>{H(service, "Scoping Animations", 0)}</p>
        <ul className="grid grid-cols-2 gap-2 text-sm">{["Camera path planning", "Animation timing", "Scene preparation", "Render duration", "Output planning"].map((x) => <li key={x} className="border border-slate-600 px-3 py-2 text-slate-300">{x}</li>)}</ul>
      </Head>
      <InView threshold={0.08} className="mt-12"><Walkthrough /></InView>
    </Char>
  );
}

export function PlanningSection({ service }: { service: Service }) {
  return (
    <Paper id="planning" tint>
      <Head eyebrow="Planning & approval" heading="Visualisations for Planning and Approval Context">
        <p>{H(service, "Renders for Formal", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Do renders for planning submissions")} Where required, we work from the stated expectations of the relevant authority or submission process — approval itself is the authority&apos;s decision.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><PlanningContext /></InView>
    </Paper>
  );
}

export function InteriorExterior({ service }: { service: Service }) {
  const cols = [
    { t: "Exterior", art: <BuildingScene stage={4} time="dusk" title="Exterior visualisation at dusk" className="block h-auto w-full" />, p: ["Building massing", "Facade", "Landscaping context", "Streetscape", "Day / night conditions", "Material finishes"] },
    { t: "Interior", art: <InteriorView room="living" title="Interior visualisation" className="block h-auto w-full" />, p: ["Spatial proportions", "Furniture / styling where required", "Joinery", "Flooring", "Walls and ceiling", "Lighting and material palette"] },
  ];
  return (
    <Paper id="interior-exterior">
      <Head eyebrow="Interior & exterior" heading="Interior and Exterior Visualisation">
        <p>{faqOf(service.faqs, "Can you produce interior as well")}</p>
        <p className="text-sm">{faqOf(service.faqs, "Do you provide furnished")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12 grid gap-5 lg:grid-cols-2">
        {cols.map((c, i) => (
          <div key={c.t} className="reveal border border-slate-300 bg-white" style={delay(i * 100)}>
            <div className="overflow-hidden border-b border-slate-200"><div className="art-zoom">{c.art}</div></div>
            <div className="p-5"><h3 className="text-lg font-semibold tracking-tight text-slate-900">{c.t}</h3><ul className="mt-3 grid gap-1.5 text-sm text-slate-600 sm:grid-cols-2">{c.p.map((x) => <li key={x} className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-blue-600" />{x}</li>)}</ul></div>
          </div>
        ))}
      </InView>
    </Paper>
  );
}

export function Floor3DSection() {
  return (
    <Paper id="floor-3d" tint>
      <Head eyebrow="3D floor plans" heading="From a Flat Plan to a Visual 3D Floor Plan">
        <p>A conventional plan becomes a cutaway, isometric view: walls rise, components appear and materials are applied — connecting technical documentation with visual communication.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><FloorPlan3DSection /></InView>
    </Paper>
  );
}

export function BimSection({ service }: { service: Service }) {
  const flow = ["Geometry", "Materials", "Views", "Visualisation"];
  return (
    <Char id="bim">
      <Head dark eyebrow="BIM to render" heading="Already Have a Revit or ArchiCAD Model? Start There.">
        <p>{faqOf(service.faqs, "Can you render from our existing Revit")}</p>
        <p className="text-sm">An existing model avoids unnecessary rebuilding and keeps the visualisation aligned with the documentation. Model preparation may still be needed depending on its condition. See <Link href="/services/bim/bim-services" className={lk("text-white")}>BIM modelling &amp; coordination</Link> and <Link href="/services/architectural/architectural-drafting" className={lk("text-white")}>architectural drafting</Link>.</p>
      </Head>
      <InView threshold={0.1} className="mt-12 grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr]">
        <Sheet label="Revit / ArchiCAD model"><FloorPlan3D stage={2} rise={1} className="block h-auto w-full" /></Sheet>
        <ol className="flex flex-row flex-wrap justify-center gap-2 lg:flex-col" aria-label="Data flow">
          {flow.map((f, i) => (
            <li key={f} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-sky-200"><span className="border border-sky-300/50 px-2.5 py-1.5">{f}</span>{i < flow.length - 1 ? <ArrowRight aria-hidden className="h-4 w-4 text-sky-300 lg:rotate-90" /> : null}</li>
          ))}
        </ol>
        <Sheet label="Final visualisation"><BuildingScene stage={4} title="Final render produced from the model" className="block h-auto w-full" /></Sheet>
      </InView>
    </Char>
  );
}

const DELIV = [
  { t: "3D architectural models", a: <BuildingScene stage={1} title="3D model" className="block h-full w-full object-cover" /> },
  { t: "Interior renders", a: <InteriorView room="living" title="Interior render" className="block h-full w-full object-cover" /> },
  { t: "Exterior renders", a: <BuildingScene stage={4} title="Exterior render" className="block h-full w-full object-cover" /> },
  { t: "3D floor plans", a: <div className="h-full bg-white"><FloorPlan3D stage={4} rise={1} className="h-full w-full" /></div> },
  { t: "Walkthrough animations", a: <InteriorView room="kitchen" title="Walkthrough frame" className="block h-full w-full object-cover" /> },
  { t: "Marketing / approval image sets", a: <ContextSvg step={2} className="block h-full w-full object-cover" /> },
  { t: "Day / night variations", a: <BuildingScene stage={4} time="night" title="Night variation" className="block h-full w-full object-cover" /> },
  { t: "Seasonal lighting variations", a: <BuildingScene stage={4} time="golden" season="autumn" title="Seasonal variation" className="block h-full w-full object-cover" /> },
  { t: "Material & finish comparisons", a: <BuildingScene stage={2} palette="B" title="Material comparison" className="block h-full w-full object-cover" /> },
];

export function DeliverablesSection({ service }: { service: Service }) {
  return (
    <Paper id="deliverables" tint>
      <Reveal><SectionHeading eyebrow="Deliverables" heading="What You Get" description={service.deliverables.join(" · ")} /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {DELIV.map((d, i) => (
          <li key={d.t} className="reveal" style={delay((i % 3) * 80)}>
            <div className="group h-full border border-slate-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-900">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100"><div className="art-zoom h-full w-full">{d.a}</div><span className="absolute left-2 top-2 border border-slate-900 bg-white/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100">Illustrative</span></div>
              <p className="p-3 text-sm font-semibold leading-snug tracking-tight text-slate-900 sm:p-4 sm:text-base">{d.t}</p>
            </div>
          </li>
        ))}
      </InView>
    </Paper>
  );
}

const APP_TEXT = [
  "Help clients understand the proposed design spatially.", "Produce contextual visuals where required for a submission.", "Show material, spatial and finish decisions.",
  "Create visual material for presenting a proposed project.", "Compare options before final finishes are locked in.", "Communicate the intended project visually.",
];

export function ApplicationsSection({ service }: { service: Service }) {
  return (
    <Paper id="applications">
      <Reveal><SectionHeading eyebrow="Applications" heading="Where 3D Visualisation Fits Into the Project" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {service.applications.map((a, i) => (
          <li key={a} className="reveal" style={delay((i % 3) * 80)}>
            <div className="group h-full border border-slate-300 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900">
              <StageIcon i={i} className="h-12 w-12 text-blue-600 transition-transform duration-500 group-hover:scale-110" />
              <h3 className="mt-4 text-base font-semibold tracking-tight text-slate-900">{a}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{APP_TEXT[i] ?? ""}</p>
            </div>
          </li>
        ))}
      </InView>
    </Paper>
  );
}

export function WorkflowSection({ service }: { service: Service }) {
  return (
    <Paper id="workflow" tint>
      <Reveal><SectionHeading eyebrow="Workflow" heading="A Clear Visualisation Workflow" /></Reveal>
      <div className="mt-12"><ProcessTimeline steps={service.process} /></div>
    </Paper>
  );
}

export function ScopeSection({ service }: { service: Service }) {
  const rows = [
    ["Still render", "Camera + materials + lighting"], ["Image set", "Multiple cameras / views"],
    ["Walkthrough", "Camera path + timing + animation"], ["Option comparison", "Materials + finishes + variants"],
  ];
  return (
    <Paper id="scope">
      <Head eyebrow="Scope control" heading="Clear Scope Before Render Time Is Spent">
        <p>Different outputs have different production requirements, so stills, image sets and walkthroughs are scoped separately — camera planning, animation timing, render duration and the number of views all change the work involved.</p>
        <p className="text-sm">{faqOf(service.faqs, "How many revision rounds")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12">
        <dl className="divide-y divide-slate-200 border border-slate-300 bg-white">
          <div className="hidden bg-slate-50 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 sm:grid sm:grid-cols-[220px_1fr]"><span>Output</span><span>Main planning considerations</span></div>
          {rows.map(([a, b], i) => (
            <div key={a} className="reveal grid gap-1 px-5 py-4 sm:grid-cols-[220px_1fr] sm:items-center" style={delay(i * 80)}>
              <dt className="text-base font-semibold tracking-tight text-slate-900">{a}</dt><dd className="text-sm text-slate-600">{b}</dd>
            </div>
          ))}
        </dl>
      </InView>
    </Paper>
  );
}

export function SoftwareSection({ service }: { service: Service }) {
  const tiles = [
    { slug: "revit", name: "Revit", note: "BIM architectural model" },
    { slug: "archicad", name: "ArchiCAD", note: "Architectural BIM / model" },
    { slug: "autocad", name: "AutoCAD", note: "2D drawing environment" },
  ].filter((t) => service.software.includes(t.slug));
  return (
    <Paper id="software" tint>
      <Reveal><SectionHeading eyebrow="Software" heading="Software We Use" /></Reveal>
      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {tiles.map((t, i) => (
          <li key={t.slug}>
            <Reveal delay={i * 80} className="h-full">
              <Link href={`/software/${t.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-900">
                <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 border-b border-slate-200 bg-slate-50 p-3">
                  <span className="border border-slate-900 bg-slate-900 py-2 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-white">{t.name}</span><ArrowRight aria-hidden className="h-3 w-3 text-slate-400" />
                  <span className="block overflow-hidden border border-slate-300"><BuildingScene stage={1} title={`${t.name} model`} className="block h-auto w-full" /></span><ArrowRight aria-hidden className="h-3 w-3 text-slate-400" />
                  <span className="block overflow-hidden border border-slate-300"><BuildingScene stage={4} title={`${t.name} render output`} className="block h-auto w-full" /></span>
                </div>
                <div className="p-5"><h3 className="text-base font-semibold text-slate-900">{t.name}</h3><p className="mt-1 text-xs uppercase tracking-[0.1em] text-slate-500">{t.note}</p></div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Paper>
  );
}

export function IndustriesSection({ service }: { service: Service }) {
  const art: Record<string, React.ReactNode> = {
    construction: <BuildingScene stage={3} time="morning" title="Construction visualisation" className="block h-auto w-full" />,
    manufacturing: (
      <svg viewBox="0 0 640 400" className="block h-auto w-full" role="img" aria-label="Industrial building visualisation" fill="none"><rect width="640" height="400" fill="#DDE7F1" /><rect y="320" width="640" height="80" fill="#B9C2CC" />
        <path d="M80 320V200l90 -50v50l90 -50v50l90 -50v50l90 -50v50l90 -50V320Z" fill="#E6EAEF" stroke="#1F2937" strokeWidth="2" /><rect x="150" y="250" width="110" height="70" fill="#94A3B8" stroke="#1F2937" strokeWidth="2" /><rect x="380" y="230" width="150" height="30" fill="#A9CBE6" stroke="#1F2937" strokeWidth="2" /><path d="M560 320V120h24v200" fill="#CBD5E1" stroke="#1F2937" strokeWidth="2" /></svg>
    ),
  };
  return (
    <Paper id="industries">
      <Reveal><SectionHeading eyebrow="Industries" heading="Industries We Support" /></Reveal>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {service.industries.map((slug, i) => (
          <li key={slug}>
            <Reveal delay={i * 80} className="h-full">
              <Link href={`/industries/${slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-900">
                <div className="aspect-[16/9] overflow-hidden"><div className="art-zoom h-full w-full [&>svg]:h-full [&>svg]:w-full [&>svg]:object-cover">{art[slug]}</div></div>
                <div className="p-5"><h3 className="text-base font-semibold tracking-tight text-slate-900">{getIndustryBySlug(slug)?.name ?? slug}</h3></div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Paper>
  );
}

export function ProjectsSection() {
  const items = projects.filter((p) => p.relatedServices?.includes("3d-rendering"));
  if (items.length === 0) return null;
  return (
    <Char id="projects">
      <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading tone="dark" eyebrow="Portfolio" heading="Related Architectural Projects" description="Illustrative examples, marked as such. They will give way to verified case studies as client work is cleared for publication." />
        <Link href="/projects/architectural" className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-copper-400 hover:underline">All architectural projects →</Link>
      </Reveal>
      <InView as="ul" className="mt-12 grid gap-5 md:grid-cols-2">
        {items.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 90} className="h-full">
              <Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col overflow-hidden border border-slate-700 bg-slate-900/40 transition-colors duration-300 hover:border-sky-300/60">
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <div className="art-zoom h-full w-full">{i === 0 ? <BuildingScene stage={4} palette="C" title="Illustrative renovation visualisation" className="block h-full w-full object-cover" /> : <InteriorView room="kitchen" title="Illustrative retail fit-out visualisation" className="block h-full w-full object-cover" />}</div>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0B1220]/85 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-200">View project</p></div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3"><span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">{p.discipline}</span>{p.isPlaceholder ? <span className="border border-slate-500 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-300">Illustrative example</span> : null}</div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-white">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-300">{p.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors group-hover:text-copper-400">View project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </InView>
    </Char>
  );
}

export function RelatedSection() {
  const nodes = [
    { l: "Architectural drafting", d: "Architectural drawing sets, floor plans and building documentation.", href: "/services/architectural/architectural-drafting", tag: "Documentation" },
    { l: "BIM modelling & coordination", d: "Revit BIM modelling, coordination and clash detection across disciplines.", href: "/services/bim/bim-services", tag: "BIM" },
    { l: "3D rendering", d: "You are here.", tag: "Visualisation" },
  ];
  return (
    <Paper id="related">
      <Reveal><SectionHeading eyebrow="Related" heading="Connected Architectural & Documentation Services" description="Different services for different stages of the same project workflow." /></Reveal>
      <InView className="mt-12"><ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
        {nodes.map((n, i) => (
          <li key={n.l} className="reveal flex flex-1 items-center gap-3" style={delay(i * 150)}>
            {n.href ? (
              <Link href={n.href} className="group flex h-full flex-1 flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-700">{n.tag}</span><span className="mt-1 flex items-center justify-between text-base font-semibold text-slate-900">{n.l}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span><span className="mt-1 text-sm text-slate-600">{n.d}</span></Link>
            ) : (
              <span className="flex h-full flex-1 flex-col border border-slate-900 bg-slate-900 p-5 text-white"><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">{n.tag}</span><span className="mt-1 text-base font-semibold">{n.l}</span><span className="mt-1 text-sm text-slate-300">{n.d}</span></span>
            )}
            {i < nodes.length - 1 ? <span aria-hidden className="hidden font-mono text-copper-500 lg:block">→</span> : null}
          </li>
        ))}
      </ol></InView>
    </Paper>
  );
}

export function RenderCTA() {
  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-[#0B1220] py-20 sm:py-28">
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">See Your Design Before It Is Built</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">Tell us what you need and our team can review the project requirements.</p>
          <div className="mt-9 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button><Button href="/services/architectural" size="lg" variant="outline-light">Explore Architectural Services</Button></div>
        </div>
        <CtaScene />
      </Container>
    </section>
  );
}

export { AerialView };
