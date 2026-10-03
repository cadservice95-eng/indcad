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
import { Paper, Char, Head, faqOf, sentences } from "@/components/arch/ui";
import { BimModel, ALL_LAYERS } from "@/components/bim/Model";
import { ScanScene, PlantScene, ScanIcon, K, mono, stageLayers } from "./ScanModel";
import { HeroScan, SignatureFlow, CloudToggle, ElementMap, RegistrationSlider, FidelitySlider, Heritage, StructMeasure, Disciplines, RenoFlow, RetrofitView, Facilities, PlantSection, Validation, ScanProcess, CtaScan } from "./ScanClient";

const lk = (c: string) => "font-semibold underline-offset-4 hover:underline " + c;
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const H = (s: Service, p: string, n = 0) => overviewParagraphs(s, p)[n] ?? "";

export function ScanHero({ heading, description }: { heading: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-[#0B1220]">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.06]"><defs><pattern id="sh-g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#sh-g)" /></svg>
      <div aria-hidden className="pointer-events-none absolute -left-24 top-16 h-[420px] w-[420px] rounded-full bg-amber-400/[0.05] blur-3xl" />
      <InView immediate>
        <Container className="relative grid gap-12 pb-20 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-16">
          <div>
            <p className="reveal font-mono text-xs uppercase tracking-[0.2em] text-sky-300">BIM</p>
            <h1 style={delay(100)} className="reveal mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">{heading}</h1>
            <p style={delay(220)} className="reveal mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{description}</p>
            <div style={delay(340)} className="reveal mt-9 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#workflow" size="lg" variant="outline-light" arrow>Explore the Scan-to-BIM Workflow</Button></div>
            <p style={delay(460)} className="reveal mt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">Reality <span className="text-amber-400">→</span> data <span className="text-amber-400">→</span> model</p>
          </div>
          <div style={delay(300)} className="reveal min-w-0"><HeroScan /></div>
        </Container>
      </InView>
    </section>
  );
}

export function IntroSection({ service }: { service: Service }) {
  const s = sentences(service.problemStatement);
  const cols = [
    { t: "Point cloud", k: "Measured points", art: <ScanScene L={{ cloud: "clean" }} title="Point cloud of a building" className="block h-auto w-full" /> },
    { t: "BIM model", k: "Walls · floors · columns · doors · windows · MEP · structure", art: <ScanScene L={{ model: true, parts: { arch: true, struct: true, mep: true } }} title="BIM model of the same building" className="block h-auto w-full" /> },
    { t: "Design team", k: "Works with the existing building as a model", art: <ScanScene L={{ model: true, proposed: true, parts: { arch: true } }} title="Design team working on the model with a proposed addition" className="block h-auto w-full" /> },
  ];
  return (
    <Paper id="why">
      <Head eyebrow="Why interpretation matters" heading="A Point Cloud Records the Building. A BIM Model Makes It Usable.">
        <p>{s[0]}</p>
        <p>{s.slice(1).join(" ")}</p>
        <p className="text-sm">{H(service, "What This Service Covers", 0)}</p>
      </Head>
      <InView threshold={0.1} className="mt-12">
        <ol className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
          {cols.flatMap((c, i) => [
            <li key={c.t} className="reveal overflow-hidden border border-slate-300 bg-white" style={delay(i * 140)}><div className="bg-[#0B1B33]">{c.art}</div><div className="p-4"><h3 className="text-base font-semibold text-slate-900">{c.t}</h3><p className="mt-0.5 text-sm text-slate-600">{c.k}</p></div></li>,
            i < 2 ? <li key={`a${i}`} aria-hidden className="grid place-items-center font-mono text-2xl text-amber-500 max-md:rotate-90">→</li> : null,
          ])}
        </ol>
        <p className="mt-4 text-sm text-slate-500">No scan density or measurement accuracy is claimed here — both depend on the scan data and the project.</p>
      </InView>
    </Paper>
  );
}

export function SignatureSection() {
  return (
    <Char id="signature">
      <Head dark eyebrow="Signature view" heading="From Reality to Working BIM Model"><p>Follow one building through the whole transformation: the existing building, the scan, the point cloud, registration, interpretation, the Revit model and what it&apos;s then used for.</p></Head>
      <InView threshold={0.08} className="mt-12"><SignatureFlow /></InView>
    </Char>
  );
}

export function CloudSection() {
  return (
    <Char id="cloud">
      <Head dark eyebrow="Point cloud ↔ BIM" heading="Switch Between the Measured Data and the Model"><p>The point cloud and the model are two stages of the same transformation — same building, same geometry. Switch between them, or overlay one on the other.</p></Head>
      <InView threshold={0.1} className="mt-12"><CloudToggle /></InView>
    </Char>
  );
}

export function ElementSection() {
  return (
    <Char id="elements">
      <Head dark eyebrow="Interpretation" heading="From Measured Points to Building Elements"><p>Reading the data is the modelling work: surfaces become walls, clusters become floors, vertical structures become columns, gaps become openings and visible services become MEP elements.</p></Head>
      <InView threshold={0.1} className="mt-12"><ElementMap /></InView>
    </Char>
  );
}

export function RegistrationSection({ service }: { service: Service }) {
  return (
    <Char id="registration">
      <Head dark eyebrow="Registration" heading="The Model Is Only as Good as the Registered Scan Data It Starts From">
        <p>{H(service, "How Much As-Built", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you combine scan data")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><RegistrationSlider n={3} /></InView>
    </Char>
  );
}

export function MultiStoreySection({ service }: { service: Service }) {
  return (
    <Char id="multi-storey">
      <Head dark eyebrow="Multi-storey" heading="Multi-Storey Buildings Need More Than Floor-by-Floor Modelling">
        <p>{H(service, "Heritage Fidelity", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "What if a multi-storey scan")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><RegistrationSlider n={4} /></InView>
    </Char>
  );
}

export function FidelitySection({ service }: { service: Service }) {
  return (
    <Paper id="fidelity">
      <Head eyebrow="As-built vs idealised" heading="How Much of the Existing Building Should the Model Preserve?">
        <p>{H(service, "How Much As-Built", 0)}</p>
        <p className="text-sm">Real buildings are rarely perfectly plumb, level or square. The decision isn&apos;t always to copy every deviation — it&apos;s a balance between as-built fidelity and design usability, agreed per project.</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><FidelitySlider /></InView>
    </Paper>
  );
}

export function HeritageSection({ service }: { service: Service }) {
  return (
    <Char id="heritage">
      <Head dark eyebrow="Heritage" heading="When Existing Character Matters">
        <p>{H(service, "Heritage Fidelity", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can you model heritage buildings")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><Heritage /></InView>
    </Char>
  );
}

export function StructuralSection({ service }: { service: Service }) {
  return (
    <Paper id="structural" tint>
      <Head eyebrow="Structural assessment" heading="Extract the Measurements the Structural Team Actually Needs">
        <p>{H(service, "Extracting Data", 0)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can a scan-to-BIM model support structural")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12"><StructMeasure /></InView>
    </Paper>
  );
}

export function DisciplineSection({ service }: { service: Service }) {
  return (
    <Paper id="disciplines">
      <Head eyebrow="Disciplines" heading="Architectural, Structural and MEP — From the Same Point Cloud">
        <p>{faqOf(service.faqs, "Can you model MEP as well")}</p>
        <p className="text-sm">For ongoing Revit model creation and updates see <Link href="/services/bim/revit-modelling" className={lk("text-navy-900")}>Revit modelling</Link>; for multi-discipline federation and clash detection, <Link href="/services/bim/bim-services" className={lk("text-navy-900")}>BIM modelling &amp; coordination</Link>.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Disciplines /></InView>
    </Paper>
  );
}

export function RenoSection({ service }: { service: Service }) {
  return (
    <Paper id="renovation" tint>
      <Head eyebrow="Renovation" heading="Give the Design Team a Model of What Already Exists">
        <p>{H(service, "What This Service Covers", 1)}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can scan-to-BIM support a change-of-use")}</p>
      </Head>
      <InView threshold={0.08} className="mt-12 [&_figure]:max-w-3xl"><RenoFlow /></InView>
    </Paper>
  );
}

export function RetrofitSection() {
  return (
    <Char id="retrofit">
      <Head dark eyebrow="Retrofit" heading="Retrofit Starts With Knowing the Existing Condition"><p>Existing structural frame, services and walls form the base; the proposed intervention is drawn against them. Existing and proposed are shown with different line styles — not bright colours.</p></Head>
      <InView threshold={0.1} className="mt-12"><RetrofitView /></InView>
    </Char>
  );
}

export function FacilitiesSection({ service }: { service: Service }) {
  return (
    <Paper id="facilities">
      <Head eyebrow="Facilities & assets" heading="Turn Existing Assets Into a Working Digital Record">
        <p>{faqOf(service.faqs, "Can scan-to-BIM support facilities")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Facilities /></InView>
    </Paper>
  );
}

export function PlantSectionBlock({ service }: { service: Service }) {
  return (
    <Char id="plant">
      <Head dark eyebrow="Industrial" heading="Dense Industrial Environments Need a Different Kind of Existing-Condition Model">
        <p>{faqOf(service.faqs, "Can you model dense industrial plant")}</p>
        <p className="text-sm">{faqOf(service.faqs, "Can large industrial sites be staged")}</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><PlantSection /></InView>
    </Char>
  );
}

export function ValidationSection({ service }: { service: Service }) {
  return (
    <Char id="validation">
      <Head dark eyebrow="Validation" heading="The Model Goes Back Against the Scan">
        <p>{service.process[3]?.description}</p>
        <p className="text-sm">Overlay is a conceptual view of how measured data and model geometry relate. Automated deviation analysis is only included if a project specifically calls for it.</p>
      </Head>
      <InView threshold={0.1} className="mt-12"><Validation /></InView>
    </Char>
  );
}

const DEL = [
  "Revit models from point cloud / scan data", "As-built architectural models", "As-built structural models", "As-built MEP models",
  "Model-derived 2D drawings", "Coordinated federated models", "Scan registration & accuracy verification notes",
];
export function DeliverablesSection() {
  return (
    <Paper id="deliverables" tint>
      <Reveal><SectionHeading eyebrow="Deliverables" heading="What You Get" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DEL.map((d, i) => (
          <li key={d} className="reveal" style={delay((i % 4) * 70)}>
            <div className="group h-full border border-slate-300 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><ScanIcon k={i} className="h-11 w-11 text-blue-600 transition-transform duration-500 group-hover:scale-110" /><h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900">{d}</h3></div>
          </li>
        ))}
      </InView>
    </Paper>
  );
}

export function ApplicationsSection({ service }: { service: Service }) {
  return (
    <Paper id="applications">
      <Reveal><SectionHeading eyebrow="Applications" heading="Where Scan to BIM Is Used" /></Reveal>
      <InView as="ul" threshold={0.08} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {service.applications.map((a, i) => (
          <li key={a} className="reveal" style={delay((i % 3) * 80)}>
            <div className="group flex h-full gap-4 border border-slate-300 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><ScanIcon k={[7, 9, 8, 2, 3][i % 5]} className="h-10 w-10 shrink-0 text-blue-600" /><div><h3 className="text-base font-semibold leading-snug tracking-tight text-slate-900">{a}</h3><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{String(i + 1).padStart(2, "0")}</p></div></div>
          </li>
        ))}
      </InView>
    </Paper>
  );
}

export function WorkflowSection({ service }: { service: Service }) {
  const seq = ["Scan data", "Registration check", "Modelling scope", "Revit modelling", "Scan comparison", "As-built model", "Drawings / coordinated model"];
  return (
    <Paper id="workflow" tint>
      <Reveal><SectionHeading eyebrow="Workflow" heading="From Scan Data to a Working Revit Model" /></Reveal>
      <InView className="mt-8"><ol className="mb-10 flex flex-wrap gap-2" aria-label="Sequence">{seq.map((s, i) => <li key={s} className="reveal flex items-center gap-2 border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700" style={delay(i * 80)}><span className="font-mono text-[10px] text-slate-400">{i + 1}</span>{s}</li>)}</ol></InView>
      <ScanProcess steps={service.process} />
    </Paper>
  );
}

export function SoftwareSection({ service }: { service: Service }) {
  const tiles = [
    { slug: "revit", name: "Revit", note: "Model", art: <ScanScene L={{ model: true, parts: { arch: true, struct: true, mep: true } }} title="Revit model" className="block h-auto w-full" /> },
    { slug: "navisworks", name: "Navisworks", note: "Coordination / review", art: <ScanScene L={{ cloud: "faint", model: true, parts: { arch: true, struct: true } }} title="Navisworks review view" className="block h-auto w-full" /> },
  ].filter((t) => service.software.includes(t.slug));
  return (
    <Char id="software">
      <Reveal><SectionHeading tone="dark" eyebrow="Software" heading="Software We Use" /></Reveal>
      <ul className="mt-12 grid gap-4 md:grid-cols-2">{tiles.map((t, i) => <li key={t.slug}><Reveal delay={i * 80} className="h-full"><Link href={`/software/${t.slug}`} className="group flex h-full flex-col border border-slate-700 bg-slate-900/40 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/60"><div className="overflow-hidden"><div className="art-zoom">{t.art}</div></div><div className="p-5"><h3 className="text-base font-semibold text-white">{t.name}</h3><p className="mt-1 text-xs uppercase tracking-[0.1em] text-slate-400">{t.note}</p></div></Link></Reveal></li>)}</ul>
    </Char>
  );
}

export function IndustriesSection({ service }: { service: Service }) {
  const art: Record<string, React.ReactNode> = {
    construction: <ScanScene L={stageLayers(2)} title="Existing building scan" className="block h-full w-full object-cover" />,
    energy: <PlantScene mode="both" title="Industrial structure scan and model" className="block h-full w-full object-cover" />,
    manufacturing: <PlantScene mode="cloud" title="Plant and equipment environment as a point cloud" className="block h-full w-full object-cover" />,
  };
  return (
    <Paper id="industries">
      <Reveal><SectionHeading eyebrow="Industries" heading="Industries We Support" /></Reveal>
      <ul className="mt-12 grid gap-4 sm:grid-cols-3">{service.industries.map((slug, i) => <li key={slug}><Reveal delay={i * 80} className="h-full"><Link href={`/industries/${slug}`} className="group flex h-full flex-col border border-slate-300 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-900"><div className="aspect-[16/10] overflow-hidden bg-[#0B1B33]"><div className="art-zoom h-full w-full">{art[slug]}</div></div><div className="p-5"><h3 className="text-base font-semibold tracking-tight text-slate-900">{getIndustryBySlug(slug)?.name ?? slug}</h3></div></Link></Reveal></li>)}</ul>
    </Paper>
  );
}

export function ProjectsSection() {
  const items = projects.filter((p) => p.discipline === "bim");
  if (items.length === 0) return null;
  return (
    <Char id="projects">
      <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading tone="dark" eyebrow="Portfolio" heading="Related BIM Projects" description="Illustrative examples, marked as such. They will give way to verified case studies as client work is cleared for publication." /><Link href="/projects/bim" className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-copper-400 hover:underline">All BIM projects →</Link></Reveal>
      <InView as="ul" className="mt-12 grid gap-5 md:grid-cols-2">{items.map((p) => {
        const isScan = p.slug.includes("point-cloud");
        return (
          <li key={p.slug}><Reveal className="h-full"><Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col overflow-hidden border border-slate-700 bg-slate-900/40 transition-colors duration-300 hover:border-sky-300/60">
            <div className="relative overflow-hidden bg-[#0B1B33]">
              {isScan ? <div className="grid grid-cols-2 gap-px"><ScanScene L={{ cloud: "clean" }} title="Point cloud" className="block h-auto w-full" /><ScanScene L={{ model: true, parts: { arch: true, struct: true } }} title="Revit model" className="block h-auto w-full" /></div>
                : <div className="grid grid-cols-4 gap-px">{[{ arch: true }, { struct: true }, { mech: true, elec: true, plumb: true }, ALL_LAYERS].map((l, k) => <BimModel key={k} layers={l} labels={false} title={["Architecture", "Structure", "MEP", "Federated model"][k]} className="block h-auto w-full" />)}</div>}
              <p className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-200">{isScan ? "Point cloud → Revit model" : "Arch → Structure → MEP → Federated model"}</p>
            </div>
            <div className="flex flex-1 flex-col p-6"><div className="flex items-center gap-3"><span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">{p.discipline}</span>{p.isPlaceholder ? <span className="border border-slate-500 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-300">Illustrative example</span> : null}</div>
              <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-white">{p.title}</h3><p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-300">{p.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors group-hover:text-copper-400">View project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span></div>
          </Link></Reveal></li>
        );
      })}</InView>
    </Char>
  );
}

export function RelatedSection() {
  const nodes = [
    { l: "Scan to BIM", d: "You are here.", you: true },
    { l: "Revit modelling", d: "Architectural, structural and MEP Revit modelling to the project's LOD.", href: "/services/bim/revit-modelling" },
    { l: "BIM modelling & coordination", d: "Revit BIM modelling, coordination and clash detection across disciplines.", href: "/services/bim/bim-services" },
  ];
  return (
    <Paper id="related" tint>
      <Reveal><SectionHeading eyebrow="Related" heading="From Scan Data to a Coordinated Model" /></Reveal>
      <InView className="mt-12">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">Scan data → scan to BIM → Revit modelling → BIM coordination</p>
        <ol className="grid gap-3 lg:grid-cols-3">{nodes.map((n, i) => <li key={n.l} className="reveal relative" style={delay(i * 120)}>{n.href ? <Link href={n.href} className="group flex h-full flex-col border border-slate-300 bg-white p-5 transition-colors hover:border-slate-900"><span className="flex items-center justify-between text-base font-semibold text-slate-900">{n.l}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span><span className="mt-1 text-sm text-slate-600">{n.d}</span></Link> : <span className="flex h-full flex-col border border-slate-900 bg-slate-900 p-5 text-white"><span className="text-base font-semibold">{n.l}</span><span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">{n.d}</span></span>}</li>)}</ol>
        <Link href="/services/cad-conversion/cad-conversion" className="reveal mt-3 flex items-center justify-between border border-dashed border-slate-400 bg-white px-5 py-4 text-sm transition-colors hover:border-slate-900"><span><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Scanned / legacy drawings</span><span className="mt-0.5 block font-semibold text-slate-900">CAD conversion → PDF, scanned and legacy drawings into editable native CAD files</span></span><ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </InView>
    </Paper>
  );
}

export function ScanCTA() {
  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-[#0B1220] py-20 sm:py-28">
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Turn Your Existing Building Into a Working BIM Model</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">Tell us what you need and our team can review the scan data, modelling requirements and project scope.</p>
          <div className="mt-9 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button><Button href="/services/bim" size="lg" variant="outline-light">Explore BIM Services</Button></div>
        </div>
        <CtaScan />
      </Container>
    </section>
  );
}

export { K, mono };
