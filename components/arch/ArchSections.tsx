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
import { PlanSvg, ElevSvg, SectionSvg, JoinerySvg, TitleBlock, INK, LINE, SOFT, BLUE, SAND, PAPER } from "./Drawing";
import { mono } from "./model";
import { CoversHub, FloorPlanExplorer, ThreeViews, CoordinationMatrix, OneDoor, ScheduleSync } from "./ArchClient";
import { PracticeStandard, Renovation, RetailJoinery, BuilderAuthority, SubmissionPackage, DeliverablesViewer, RcpSection, SiteSection, MassSection, ArchProcess, RevisionTimeline } from "./ArchClient2";
import { Paper, Char, Head, Sheet, faqOf, sentences } from "./ui";

const a = (c: string) => "font-semibold underline-offset-4 hover:underline " + c;
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function ArchIntro({ service }: { service: Service }) {
  const [p1, p2] = overviewParagraphs(service, "What This Service Covers");
  return (
    <Paper id="covers">
      <Head eyebrow="Scope" heading="From Design Development to Construction Documentation">
        <p>{p1}</p>
        <p>{p2}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><CoversHub /></InView>
    </Paper>
  );
}

export function PlanSection({ service }: { service: Service }) {
  return (
    <Paper id="floor-plan" tint>
      <Head eyebrow="Floor plan" heading="Plans That Stay Coordinated With the Rest of the Set">
        <p>{sentences(overviewParagraphs(service, "Working to Your")[1] ?? "").slice(0, 1).join(" ")}</p>
        <p className="text-sm">Every tag on this plan — rooms, doors, windows — is a reference that appears again in the elevations, sections and schedules. All values are illustrative.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><FloorPlanExplorer /></InView>
    </Paper>
  );
}

export function SignatureViews() {
  return (
    <Char id="views">
      <Head dark eyebrow="Signature view" heading="One Building. Multiple Drawing Views.">
        <p>Select a room on the plan. The same zone is projected into the elevation and the section — because every sheet is drawn from one building, not drawn separately.</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><ThreeViews /></InView>
    </Char>
  );
}

export function CoordSection({ service }: { service: Service }) {
  return (
    <Paper id="coordination">
      <Head eyebrow="Coordination" heading="Consistency Across the Entire Drawing Set">
        <p>{overviewParagraphs(service, "Working to Your")[1]}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><CoordinationMatrix /></InView>
    </Paper>
  );
}

export function DoorSection() {
  return (
    <Char id="one-door">
      <Head dark eyebrow="One element → every reference" heading="One Door. Every Reference.">
        <p>Pick a door. Follow it from the plan, to the elevation, to its row in the schedule and on to the interior detail. When these stay in step, the site has fewer questions.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><OneDoor /></InView>
    </Char>
  );
}

export function PracticeSection({ service }: { service: Service }) {
  return (
    <Paper id="standard" tint>
      <Head eyebrow="Your practice standard" heading="Work Inside Your Existing Drawing Standard">
        <p>{overviewParagraphs(service, "Working to Your")[0]}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you work with our practice")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><PracticeStandard /></InView>
    </Paper>
  );
}

/* ── inputs ── */
const IN = [
  { t: "Hand sketch", art: (
    <g stroke={LINE} strokeWidth="1.4" fill="none" strokeLinecap="round">
      <path d="M22 28c40 -4 110 2 196 -2M218 26c2 30 -2 70 2 96M220 122c-60 3 -120 -2 -198 1M22 124c-3 -30 2 -64 0 -96" />
      <path d="M96 26c-2 30 3 60 1 98M22 78c30 -3 54 2 74 -1M150 124c1 -26 -2 -40 0 -62" opacity="0.7" /><path d="M60 52l12 8m-12 0l12 -8" stroke={SAND} />
    </g>) },
  { t: "Marked-up plan", art: (
    <g fill="none" strokeLinecap="round">
      <path d="M26 28H214V122H26ZM108 28V122M26 78H108" stroke={INK} strokeWidth="2.6" />
      <path d="M118 52c10 -12 26 -8 34 0s8 20 -2 26 -26 6 -34 -2 -6 -16 2 -24z" stroke="#DC2626" strokeWidth="1.4" /><path d="M152 62l32 -22" stroke="#DC2626" strokeWidth="1.2" /><text x="150" y="38" fontSize="8" fill="#DC2626" style={mono}>MOVE WALL</text>
      <path d="M58 100l22 -16" stroke="#DC2626" strokeWidth="1.2" /><circle cx="58" cy="100" r="3" stroke="#DC2626" />
    </g>) },
  { t: "Existing model", art: (
    <g fill="none" stroke={LINE} strokeWidth="1.3" strokeLinejoin="round">
      <path d="M70 100l50 -24 50 24 -50 24z" /><path d="M70 100V62l50 -24 50 24v38" /><path d="M120 76V38M120 124V76" opacity="0.5" /><path d="M70 62l50 24 50 -24" />
      <path d="M96 112l0 -18 18 9v18z" stroke={BLUE} />
    </g>) },
  { t: "Survey / site information", art: (
    <g fill="none" strokeLinecap="round">
      <path d="M30 34L204 26 214 118 24 126Z" stroke={INK} strokeWidth="1.4" strokeDasharray="10 3 2 3" />
      <path d="M40 98c40 -34 90 -24 120 -50M44 110c50 -34 100 -22 142 -52M52 120c60 -30 110 -16 150 -48" stroke={SOFT} strokeWidth="1" />
      {[[60, 56], [120, 70], [180, 50], [150, 100]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="2.4" fill={BLUE} stroke="none" /><text x={x + 5} y={y - 3} fontSize="7" fill={LINE} style={mono}>SP{i + 1}</text></g>)}
    </g>) },
];

export function InputsSection({ service }: { service: Service }) {
  return (
    <Paper id="inputs">
      <Head eyebrow="Inputs" heading="Start From the Information You Already Have">
        <p>{faqOf(service.faqs, "Can you draft from hand sketches")}</p>
        <p className="text-sm">An existing drawing set in another format? See <Link href="/services/cad-conversion/cad-conversion" className={a("text-navy-900")}>CAD conversion</Link>. How complete the set can be depends on how complete the inputs are — gaps are flagged, not assumed.</p>
      </Head>
      <InView threshold={0.15} className="mt-12">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {IN.map((x, i) => (
            <li key={x.t} className="reveal border border-slate-300 bg-white" style={delay(i * 90)}>
              <svg viewBox="0 0 240 150" className="h-auto w-full bg-[#FBFAF7]" role="img" aria-label={x.t}><title>{x.t}</title>{x.art}</svg>
              <p className="border-t border-slate-200 p-3 text-sm font-semibold tracking-tight text-slate-900 sm:p-4">{x.t}</p>
            </li>
          ))}
        </ul>
        <svg viewBox="0 0 800 70" className="mx-auto mt-1 hidden h-auto w-full max-w-4xl lg:block" aria-hidden fill="none">
          {[100, 300, 500, 700].map((x, i) => <path key={x} d={`M${x} 0C${x} 40 400 20 400 60`} stroke={BLUE} strokeWidth="1.4" className="rch-flow" style={delay(i * 200)} />)}
        </svg>
        <p className="mx-auto mt-3 w-fit border border-slate-900 bg-slate-900 px-6 py-3 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white lg:mt-0">Architectural documentation</p>
      </InView>
    </Paper>
  );
}

export function RenoSection({ service }: { service: Service }) {
  return (
    <Paper id="renovation" tint>
      <Head eyebrow="Renovation & extension" heading="Existing Conditions First. Design Decisions Second.">
        <p>{overviewParagraphs(service, "Renovation Work")[0]}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you document existing conditions")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Renovation /></InView>
    </Paper>
  );
}

export function RetailSection({ service }: { service: Service }) {
  return (
    <Paper id="retail">
      <Head eyebrow="Retail & commercial" heading="Documentation for Fast-Moving Fit-Outs">
        <p>{overviewParagraphs(service, "Renovation Work")[1]}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><RetailJoinery /></InView>
    </Paper>
  );
}

export function JoinerySection({ service }: { service: Service }) {
  return (
    <Char id="joinery">
      <Head dark eyebrow="Joinery & interior details" heading="Details That a Workshop Can Actually Use">
        <p>{faqOf(service.faqs, "Can you produce joinery drawings")}</p>
        <p className="text-sm">{faqOf(service.faqs, "How do you decide which junctions")}</p>
      </Head>
      <InView threshold={0.15} className="mt-12 grid items-start gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Sheet label="Detail A · door to fixed panel junction · illustrative"><JoinerySvg stage={3} title="Large-scale joinery detail with dimensions" className="h-auto w-full" /></Sheet>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <Sheet label="Elevation · counter J-01"><JoinerySvg stage={1} title="Joinery elevation" className="h-auto w-full" /></Sheet>
          <Sheet label="Section · panel build-up"><JoinerySvg stage={2} title="Joinery section" className="h-auto w-full" /></Sheet>
        </div>
      </InView>
    </Char>
  );
}

export function AuthoritySection({ service }: { service: Service }) {
  return (
    <Paper id="builder-authority">
      <Head eyebrow="Two audiences" heading="Documentation for Both the Builder and the Authority">
        <p>{overviewParagraphs(service, "Drafting for Both")[0]}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><BuilderAuthority /></InView>
    </Paper>
  );
}

export function SubmissionSection({ service }: { service: Service }) {
  return (
    <Paper id="submission" tint>
      <Head eyebrow="Approval documentation" heading="Drawing Sets Structured for the Submission Stage">
        <p>{overviewParagraphs(service, "Drafting for Both")[1]}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><SubmissionPackage /></InView>
    </Paper>
  );
}

export function DeliverablesSection({ service }: { service: Service }) {
  return (
    <Paper id="deliverables" tint>
      <Reveal><SectionHeading eyebrow="Deliverables" heading="What You Get" description="A drawing-set viewer: pick a sheet type and the matching deliverables light up." /></Reveal>
      <InView threshold={0.08} className="mt-12"><DeliverablesViewer items={service.deliverables} /></InView>
    </Paper>
  );
}

export function ScheduleSection({ service }: { service: Service }) {
  return (
    <Paper id="schedules">
      <Head eyebrow="Schedules" heading="Schedules That Match What's Actually Drawn">
        <p>{faqOf(service.faqs, "Do you check that schedules")}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you produce a door, window and finish")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><ScheduleSync /></InView>
    </Paper>
  );
}

export function RcpBlock() {
  return (
    <Paper id="rcp" tint>
      <Head eyebrow="Reflected ceiling plan" heading="Ceiling Plans That Stay in Step With the Floor Plan">
        <p>A reflected ceiling plan has to line up with the walls on the plan below it. Overlay the two to see the ceiling zones, boundaries and light reference points sit exactly where the plan says.</p>
        <p className="text-sm">This is architectural coordination — it records positions, not an electrical design.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><RcpSection /></InView>
    </Paper>
  );
}

export function SiteBlock({ service }: { service: Service }) {
  return (
    <Paper id="site">
      <Head eyebrow="Site & setback" heading="Site Context Before Building Documentation">
        <p>{faqOf(service.faqs, "Do you draft site and setback plans")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><SiteSection /></InView>
    </Paper>
  );
}

export function MassBlock({ service }: { service: Service }) {
  return (
    <Char id="model-3d">
      <Head dark eyebrow="3D model" heading="When Documentation Needs a 3D View">
        <p>{overviewParagraphs(service, "What This Service Covers")[1]}</p>
        <p className="text-sm">{faqOf(service.faqs, "Do you produce 3D architectural")} Explore <Link href="/services/architectural/3d-rendering" className={a("text-white")}>3D rendering</Link> and <Link href="/services/bim/bim-services" className={a("text-white")}>BIM modelling &amp; coordination</Link>.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><MassSection /></InView>
    </Char>
  );
}

export function ArchWorkflow({ service }: { service: Service }) {
  return (
    <section id="workflow" className="relative scroll-mt-20 border-t border-slate-800 bg-[#111827]">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.04]">
        <defs><pattern id="wf-g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#wf-g)" />
      </svg>
      <Container className="relative pt-20 sm:pt-24">
        <SectionHeading tone="dark" eyebrow="Workflow" heading="How Architectural Documentation Moves From Input to Issue" />
      </Container>
      <Container className="relative"><ArchProcess steps={service.process} /></Container>
    </section>
  );
}

export function RevisionBlock({ service }: { service: Service }) {
  return (
    <Paper id="revisions">
      <Head eyebrow="Revision control" heading="Keep Every Design Change Traceable">
        <p>{service.process[4]?.description}</p>
        <p className="text-sm">{faqOf(service.faqs, "How do you handle a design that changes")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><RevisionTimeline /></InView>
    </Paper>
  );
}

const LIFE = [
  { n: "Concept", layers: { walls: true, openings: false, labels: false, dims: false, furniture: false, tags: false, marks: false, grid: false }, sketch: true, rev: 0, list: "Sketch, plan outline" },
  { n: "Approval", layers: { walls: true, openings: true, labels: true, dims: true, furniture: false, tags: false, marks: true, grid: true }, rev: 0, list: "Site plan, plans, elevations, sections" },
  { n: "Construction", layers: { walls: true, openings: true, labels: true, dims: true, furniture: true, tags: true, marks: true, grid: true }, rev: 0, list: "Details, schedules, coordination" },
  { n: "Revision", layers: { walls: true, openings: true, labels: true, dims: true, furniture: true, tags: true, marks: true, grid: true }, rev: 3, list: "Tracked changes, current issue" },
] as const;

export function LifecycleBlock({ service }: { service: Service }) {
  return (
    <Paper id="lifecycle" tint>
      <Head eyebrow="Drawing set lifecycle" heading="One Building. Multiple Project Stages.">
        <p>The same building gets more detailed as the project moves on — concept, approval, construction, and revision — with the drawing set tracked at each step.</p>
      </Head>
      <InView threshold={0.1} className="mt-12">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LIFE.map((s, i) => (
            <li key={s.n} className="reveal relative border border-slate-300 bg-white p-2" style={delay(i * 120)}>
              <p className="px-1 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{String(i + 1).padStart(2, "0")} · {s.n}</p>
              <PlanSvg layers={s.layers} sketch={"sketch" in s} rev={s.rev} title={`The building at the ${s.n.toLowerCase()} stage`} className="h-auto w-full" />
              <p className="px-1 pt-1.5 text-xs text-slate-600">{s.list}</p>
              {i < LIFE.length - 1 ? <ArrowRight aria-hidden className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 bg-[#F1EFEA] text-copper-500 lg:block" /> : null}
            </li>
          ))}
        </ol>
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Typical applications">
          {service.applications.map((x) => <li key={x} className="border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700">{x}</li>)}
        </ul>
      </InView>
    </Paper>
  );
}

/* ── software ── */
function CadTile() {
  return (
    <svg viewBox="0 0 240 150" fill="none" className="h-full w-full" aria-hidden strokeLinecap="round">
      <rect width="240" height="150" fill="#0F172A" />
      <rect x="6.5" y="6.5" width="227" height="108" stroke="#7DD3FC" strokeOpacity="0.5" />
      <path d="M40 20v84M200 20v84M40 50h46M110 50h90M40 90h60M130 90h70" stroke="#7DD3FC" strokeWidth="1.4" /><circle cx="98" cy="50" r="5" stroke="#7DD3FC" />
      <path d="M150 30v40M130 50h40" stroke="#F8FAFC" strokeOpacity="0.7" strokeWidth="0.8" /><rect x="144" y="44" width="12" height="12" stroke="#F8FAFC" strokeOpacity="0.7" strokeWidth="0.8" />
      <rect x="6.5" y="122.5" width="227" height="20" stroke="#7DD3FC" strokeOpacity="0.4" /><text x="14" y="136" fill="#7DD3FC" fontSize="8" letterSpacing="1" style={mono}>COMMAND: LINE ▮</text>
    </svg>
  );
}
function BimTile({ archi }: { archi?: boolean }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" className="h-full w-full" aria-hidden strokeLinecap="round" strokeLinejoin="round">
      <rect width="240" height="150" fill="#0F172A" />
      <rect x="6.5" y="6.5" width={archi ? 34 : 60} height="136" stroke="#7DD3FC" strokeOpacity="0.4" />
      {archi
        ? [20, 38, 56, 74, 92].map((y) => <rect key={y} x="14" y={y} width="18" height="12" stroke="#7DD3FC" strokeOpacity="0.8" />)
        : [22, 40, 58, 76].map((y) => <g key={y}><rect x="14" y={y} width="7" height="7" stroke="#7DD3FC" /><path d={`M26 ${y + 4}h30`} stroke="#7DD3FC" strokeOpacity="0.5" /></g>)}
      <path d="M96 106l50 -22 50 22 -50 22z" stroke="#7DD3FC" strokeOpacity="0.5" /><path d="M96 106V64l50 -22 50 22v42" stroke="#F8FAFC" strokeOpacity="0.8" /><path d="M146 84V42M96 64l50 22 50 -22" stroke="#7DD3FC" />
      <rect x="130" y="92" width="14" height="22" stroke="#C9A66B" />
    </svg>
  );
}

export function ArchSoftware({ service }: { service: Service }) {
  const tiles = [
    { slug: "autocad", name: "AutoCAD", note: "2D documentation environment", art: <CadTile /> },
    { slug: "revit", name: "Revit", note: "BIM architectural model", art: <BimTile /> },
    { slug: "archicad", name: "ArchiCAD", note: "Architectural BIM / model", art: <BimTile archi /> },
  ].filter((t) => service.software.includes(t.slug));
  return (
    <Paper id="software">
      <Reveal><SectionHeading eyebrow="Software" heading="Architectural Drafting Software" /></Reveal>
      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {tiles.map((t, i) => (
          <li key={t.slug}>
            <Reveal delay={i * 80} className="h-full">
              <Link href={`/software/${t.slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-900">
                <div className="aspect-[8/5] overflow-hidden"><div className="art-zoom h-full w-full">{t.art}</div></div>
                <div className="p-5"><h3 className="text-base font-semibold text-slate-900">{t.name}</h3><p className="mt-1 text-xs uppercase tracking-[0.1em] text-slate-500">{t.note}</p></div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Paper>
  );
}

/* ── industries ── */
const IND: Record<string, { line: string; art: React.ReactNode }> = {
  construction: { line: "Building documentation", art: <g fill="none" stroke={INK} strokeWidth="1.5"><path d="M40 120H200M60 120V50H130V120M130 120V30H180V120" /><path d="M72 66h46M72 84h46M72 102h46M142 48h26M142 66h26M142 84h26M142 102h26" stroke={SOFT} /><path d="M20 120H220" strokeWidth="2.4" /></g> },
  manufacturing: { line: "Industrial building / facility", art: <g fill="none" stroke={INK} strokeWidth="1.5"><path d="M24 120V70l36 -22V70l36 -22V70l36 -22V70l36 -22V70l36 -22V120Z" /><path d="M24 120H220" strokeWidth="2.4" /><rect x="70" y="92" width="34" height="28" stroke={BLUE} /><path d="M170 120V86h24v34" stroke={SOFT} /><path d="M196 36V20h8v18" /></g> },
  energy: { line: "Technical facility architecture", art: <g fill="none" stroke={INK} strokeWidth="1.5"><rect x="30" y="70" width="96" height="50" /><path d="M20 120H220" strokeWidth="2.4" /><path d="M30 70L78 50L126 70" /><circle cx="170" cy="94" r="26" /><path d="M144 94h52M170 68v52" stroke={SOFT} /><path d="M200 120V60M214 120V60M200 60h14" stroke={BLUE} /></g> },
};

export function ArchIndustries({ service }: { service: Service }) {
  return (
    <Paper id="industries" tint>
      <Reveal><SectionHeading eyebrow="Industries" heading="Architectural Documentation Across Industries" /></Reveal>
      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {service.industries.map((slug, i) => {
          const m = IND[slug];
          const name = getIndustryBySlug(slug)?.name ?? slug;
          if (!m) return null;
          return (
            <li key={slug}>
              <Reveal delay={i * 80} className="h-full">
                <Link href={`/industries/${slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-900">
                  <div className="aspect-[8/5] overflow-hidden bg-[#FBFAF7]"><svg viewBox="0 0 240 150" className="art-zoom h-full w-full p-3" role="img" aria-label={`${name}: ${m.line}`}><title>{name}</title>{m.art}</svg></div>
                  <div className="p-5"><h3 className="text-base font-semibold tracking-tight text-slate-900">{name}</h3><p className="mt-0.5 text-xs text-slate-500">{m.line}</p></div>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Paper>
  );
}

/* ── portfolio ── */
const PROJ_ART: Record<string, React.ReactNode> = {
  "residential-renovation-construction-drawings": (
    <PlanSvg rev={3} layers={{ dims: false, marks: false, grid: false }} title="Illustrative renovation floor plan with a revised wall" className="h-full w-full" />
  ),
  "retail-fitout-documentation-and-3d-render": (
    <svg viewBox="0 0 640 380" className="h-full w-full" fill="none" aria-hidden>
      <path d="M60 50H580V330H60Z" stroke={INK} strokeWidth="6.5" />
      {[[110, 110], [110, 170], [110, 230]].map(([x, y], i) => <rect key={i} x={x} y={y} width="90" height="22" fill="#F1F5F9" stroke={LINE} />)}
      {[[250, 160], [330, 160], [250, 220], [330, 220]].map(([x, y], i) => <rect key={i} x={x} y={y} width="60" height="34" fill={PAPER} stroke={LINE} />)}
      <rect x="440" y="250" width="110" height="38" fill="#DBEAFE" stroke={BLUE} strokeWidth="2" /><path d="M440 100V150H580" stroke={INK} strokeWidth="3.4" />
      <rect x="226" y="120" width="170" height="150" stroke={SAND} strokeWidth="1.4" strokeDasharray="6 3" />
    </svg>
  ),
};

export function ArchProjects() {
  const items = projects.filter((p) => p.discipline === "architectural");
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
                <div className="aspect-[16/9] overflow-hidden bg-[#F8F7F4] p-3"><div className="art-zoom h-full w-full">{PROJ_ART[p.slug]}</div></div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">{p.discipline}</span>
                    {p.isPlaceholder ? <span className="border border-slate-500 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-300">Illustrative example</span> : null}
                  </div>
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

/* ── related ── */
export function ArchRelated() {
  const nodes = [
    { label: "Architectural drafting", you: true },
    { label: "3D rendering", href: "/services/architectural/3d-rendering" },
    { label: "BIM modelling & coordination", href: "/services/bim/bim-services" },
    { label: "CAD conversion", href: "/services/cad-conversion/cad-conversion" },
  ];
  return (
    <Paper id="related">
      <Reveal><SectionHeading eyebrow="Related" heading="Connected Architectural & Documentation Services" /></Reveal>
      <InView className="mt-12">
        <ol className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {nodes.map((c, i) => (
            <li key={c.label} className="reveal flex flex-1 items-center gap-3" style={delay(i * 150)}>
              {c.href ? (
                <Link href={c.href} className="group flex flex-1 items-center justify-between gap-2 border border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-900">{c.label}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></Link>
              ) : (
                <span className="flex-1 border border-slate-900 bg-slate-900 px-4 py-4 text-sm font-semibold text-white">{c.label}<span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">You are here</span></span>
              )}
              {i < nodes.length - 1 ? <span aria-hidden className="hidden font-mono text-copper-500 lg:block">↔</span> : null}
            </li>
          ))}
        </ol>
      </InView>
    </Paper>
  );
}

/* ── final CTA ── */
function ScheduleThumb() {
  return (
    <svg viewBox="0 0 200 130" fill="none" className="h-full w-full" aria-hidden>
      {[0, 1, 2, 3, 4, 5].map((i) => <g key={i}><path d={`M10 ${22 + i * 17}H190`} stroke={SOFT} strokeWidth="0.8" /><path d={`M16 ${15 + i * 17}H40M60 ${15 + i * 17}H100M120 ${15 + i * 17}H150`} stroke={LINE} strokeWidth="2" /></g>)}
    </svg>
  );
}

export function ArchCTA() {
  const steps: { t: string; el: React.ReactNode }[] = [
    { t: "Sketch", el: <PlanSvg sketch layers={{ walls: true, openings: false, labels: false, dims: false, furniture: false, tags: false, marks: false, grid: false }} title="Sketch" className="h-full w-full" /> },
    { t: "Plan", el: <PlanSvg layers={{ dims: false, marks: false, grid: false, tags: false }} title="Plan" className="h-full w-full" /> },
    { t: "Elevation", el: <ElevSvg title="Elevation" className="h-full w-full" /> },
    { t: "Section", el: <SectionSvg title="Section" className="h-full w-full" /> },
    { t: "Detail", el: <JoinerySvg stage={3} title="Detail" className="h-full w-full" /> },
    { t: "Schedule", el: <ScheduleThumb /> },
  ];
  return (
    <InView as="section" threshold={0.2} className="relative overflow-hidden border-t border-slate-800 bg-[#111827] py-20 sm:py-28">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.04]">
        <defs><pattern id="cta-g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#cta-g)" />
      </svg>
      <Container className="relative">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Get a Quote for Architectural Drafting</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">Tell us what you need and our team can review the project requirements.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button>
            <Button href="/services/architectural" size="lg" variant="outline-light">Explore Architectural Services</Button>
          </div>
        </div>
        <ol aria-hidden className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {steps.map((s, i) => (
            <li key={s.t} className="reveal" style={delay(300 + i * 140)}>
              <div className="border border-slate-600 bg-white p-1.5"><div className="aspect-[4/3]">{s.el}</div></div>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300">{String(i + 1).padStart(2, "0")} · {s.t}</p>
            </li>
          ))}
          <li className="reveal col-span-2 sm:col-span-3 lg:col-span-1" style={delay(300 + 6 * 140)}>
            <div className="border border-copper-500 bg-white p-1.5"><div className="flex aspect-[4/3] items-center"><TitleBlock className="h-auto w-full" status="ISSUED" /></div></div>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-copper-400">07 · Documentation set</p>
          </li>
        </ol>
      </Container>
    </InView>
  );
}
