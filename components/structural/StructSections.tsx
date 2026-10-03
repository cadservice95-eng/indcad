import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { StructIcon, type StructIconName } from "@/components/svg/StructIcons";
import { GaDiagram, ConnectionDiagram, ShopDiagram, ErectionDiagram } from "@/components/svg/StructDiagrams";
import { ConstructabilityGraphic, BimCoordinationGraphic, PressureGraphic, PackageGraphic } from "@/components/svg/StructVisuals";
import { PortalFrame, PlatformStructure, MultiStoreyFrame, PipeRack } from "@/components/svg/StructScenes";
import { CivilArt } from "@/components/svg/CivilIcons";
import { Callout } from "@/components/mechanical/SplitSection";
import { overviewParagraphs } from "@/components/mechanical/content";
import { getSoftwareBySlug } from "@/data/software";
import { getServiceBySlug } from "@/data/services";
import { getIndustryBySlug } from "@/data/industries";
import { projects } from "@/data/projects";
import { DarkSection, LightSection, Head, sentences } from "./ui";
import { SteelFrame } from "./SteelFrame";
import { ConnectionViewer } from "./ConnectionViewer";
import { TakeoffLinked, RevisionViewer } from "./TakeoffAndRevision";
import { DeliverablesPackage } from "./DeliverablesPackage";
import { ApplicationsScene } from "./ApplicationsScene";
import { LifecycleScroll } from "./ScrollScenes";

const faq = (s: Service, start: string) => s.faqs.find((f) => f.question.startsWith(start))?.answer ?? "";

const handoff: { label: string; icon: StructIconName }[] = [
  { label: "Engineer design", icon: "blueprint" },
  { label: "Model", icon: "frame" },
  { label: "Detail", icon: "connection" },
  { label: "Shop drawing", icon: "sheet" },
  { label: "Fabrication", icon: "member" },
  { label: "Erection", icon: "erected" },
];

export function HandoffSection({ service }: { service: Service }) {
  const [first, ...rest] = sentences(service.problemStatement);
  return (
    <section id="handoff" className="py-20 sm:py-28">
      <Container>
        <Head eyebrow="The engineering handoff" heading="From Structural Design Intent to Fabrication-Ready Documentation">
          <p>{first}</p>
          <p>{rest.join(" ")}</p>
        </Head>
        <InView as="ol" threshold={0.2} className="group relative mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
          <span aria-hidden className="absolute left-[8%] right-[8%] top-[27px] hidden h-px origin-left scale-x-0 bg-copper-500/70 transition-transform duration-[2400ms] ease-out group-data-[in=true]:scale-x-100 lg:block" />
          {handoff.map((h, i) => (
            <li key={h.label} className="reveal relative text-center" style={{ "--d": `${i * 160}ms` } as React.CSSProperties}>
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center border border-neutral-300 bg-white text-steel-600">
                <StructIcon name={h.icon} className="h-8 w-8" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-navy-900 font-mono text-[10px] text-white">{i + 1}</span>
              </span>
              <p className="mt-3 text-sm font-medium text-navy-900">{h.label}</p>
            </li>
          ))}
        </InView>
      </Container>
    </section>
  );
}

const coverCards = [
  { n: "01", title: "General arrangement drawings", Art: GaDiagram },
  { n: "02", title: "Connection details", Art: ConnectionDiagram },
  { n: "03", title: "Shop & fabrication drawings", Art: ShopDiagram },
  { n: "04", title: "Erection drawings", Art: ErectionDiagram },
];

export function CoversSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "What This Service Covers")[0];
  return (
    <section id="covers" className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Head eyebrow="Scope" heading="Structural Documentation Built for Fabrication and Erection">
          <p>{text}</p>
        </Head>
        <InView as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coverCards.map(({ n, title, Art }, i) => (
            <li key={n}>
              <Reveal delay={i * 90} className="h-full">
                <div className="group h-full border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40">
                  <div className="relative aspect-[320/220] overflow-hidden bg-ink-950 p-2">
                    <TechnicalGrid id={`cv-${i}`} className="text-sky-300/[0.07]" minor={16} major={80} />
                    <div className="relative h-full w-full"><Art /></div>
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-xs tracking-[0.16em] text-copper-600">{n}</p>
                    <h3 className="mt-1 text-base font-semibold leading-snug tracking-tight text-navy-900">{title}</h3>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </InView>
      </Container>
    </section>
  );
}

export function ConstructabilitySection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "What This Service Covers")[1];
  return (
    <LightSection id="constructability">
      <Head eyebrow="Constructability" heading="Technically Correct Is Not Enough. It Has to Be Buildable.">
        <p>{text}</p>
        <Callout>{faq(service, "Do you design structural connections")}</Callout>
      </Head>
      <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
        <ConstructabilityGraphic className="h-auto w-full min-w-[640px]" />
      </InView>
    </LightSection>
  );
}

export function ConnectionSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "BIM Coordination and Connection Detailing")[1];
  return (
    <DarkSection id="connections" tone="900">
      <Head dark eyebrow="Connections" heading="Connection Detailing Where Design Meets Fabrication">
        <p>{text}</p>
      </Head>
      <InView threshold={0.15} className="mt-12">
        <ConnectionViewer />
      </InView>
    </DarkSection>
  );
}

export function BimSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "BIM Coordination and Connection Detailing")[0];
  return (
    <DarkSection id="bim">
      <Head dark eyebrow="Structural BIM" heading="Structural BIM Coordination Before Fabrication">
        <p>{text}</p>
        <p>
          <Link href="/services/bim/bim-services" className="text-sm font-semibold text-white underline-offset-4 hover:text-copper-400 hover:underline">BIM modelling & coordination →</Link>
        </p>
      </Head>
      <InView threshold={0.3} className="mt-12 overflow-hidden border border-steel-300/20 bg-ink-900/60 p-2">
        <BimCoordinationGraphic className="mx-auto h-auto w-full max-w-3xl" />
      </InView>
    </DarkSection>
  );
}

export function TakeoffSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Take-Offs")[0];
  return (
    <DarkSection id="take-offs" tone="900">
      <Head dark eyebrow="Quantities" heading="Quantities That Follow the Detailed Model">
        <p>{text}</p>
      </Head>
      <InView threshold={0.15} className="mt-12">
        <TakeoffLinked />
      </InView>
    </DarkSection>
  );
}

export function RevisionSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Take-Offs")[1];
  return (
    <DarkSection id="revisions">
      <Head dark eyebrow="Revision control" heading="Every Structural Revision Should Be Traceable">
        <p>{text}</p>
      </Head>
      <InView threshold={0.15} className="mt-12">
        <RevisionViewer />
      </InView>
    </DarkSection>
  );
}

export function PressureSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Take-Offs")[2];
  return (
    <LightSection id="read-under-pressure" tint>
      <Head eyebrow="On the shop floor and on site" heading="Drawings Designed to Be Read Under Pressure">
        <p>{text}</p>
      </Head>
      <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
        <PressureGraphic className="h-auto w-full min-w-[640px]" />
      </InView>
    </LightSection>
  );
}

export function LifecycleSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "How a Drawing Set Ages")[0];
  return (
    <LightSection id="lifecycle">
      <Head eyebrow="Project lifecycle" heading="A Drawing Set Changes With the Project">
        <p>{text}</p>
      </Head>
      <div className="mt-12"><LifecycleScroll /></div>
    </LightSection>
  );
}

export function StructDeliverables({ service }: { service: Service }) {
  return (
    <DarkSection id="deliverables" tone="900">
      <Reveal>
        <SectionHeading tone="dark" eyebrow="Deliverables" heading="What You Get" description="Pick a sheet type to see what it looks like and which deliverables it covers." />
      </Reveal>
      <InView threshold={0.15} className="mt-12">
        <DeliverablesPackage service={service} />
      </InView>
    </DarkSection>
  );
}

export function StructApplications({ service }: { service: Service }) {
  return (
    <DarkSection id="applications">
      <Reveal>
        <SectionHeading tone="dark" eyebrow="Applications" heading="Where Structural Drafting Is Used" />
      </Reveal>
      <InView threshold={0.15} className="mt-12">
        <ApplicationsScene applications={service.applications} />
      </InView>
    </DarkSection>
  );
}

function SoftwareArt({ slug }: { slug: string }) {
  if (slug === "tekla") return <SteelFrame detail={0} className="h-full w-full" viewBox="60 70 520 420" />;
  if (slug === "revit")
    return (
      <svg viewBox="0 0 240 150" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-full w-full" aria-hidden>
        <path d="M40 120V60l50-24 50 24v60M90 36v84M40 60l50 24 50-24" />
        <path d="M70 130l50-24 50 24" opacity="0.5" strokeDasharray="4 3" />
        <path d="M150 90h60M150 100h40" opacity="0.6" />
      </svg>
    );
  if (slug === "autocad") return <ShopDiagram />;
  return <CivilArt name="development" />;
}

export function StructSoftware({ service }: { service: Service }) {
  const tools = service.software.map(getSoftwareBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const blurb: Record<string, string> = { tekla: "Steel frame and fabrication model", revit: "BIM coordination model", autocad: "2D structural drawings", "civil-3d": "Site and civil coordination" };
  return (
    <LightSection id="software">
      <Reveal>
        <SectionHeading eyebrow="Software" heading="Structural Detailing Software" />
      </Reveal>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((t, i) => (
          <li key={t.slug}>
            <Reveal delay={i * 70} className="h-full">
              <Link href={`/software/${t.slug}`} className="group flex h-full flex-col border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40">
                <div className="relative aspect-[8/5] overflow-hidden bg-ink-950 p-3 text-sky-300">
                  <TechnicalGrid id={`ss-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                  <div className="relative h-full w-full"><SoftwareArt slug={t.slug} /></div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold tracking-tight text-navy-900">{t.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.1em] text-neutral-500">{blurb[t.slug] ?? t.category}</p>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </LightSection>
  );
}

const sceneFor: Record<string, React.ReactNode> = {
  construction: <MultiStoreyFrame ox={105} oy={50} s={7.5} />,
  mining: <PlatformStructure ox={90} oy={64} s={8} />,
  manufacturing: <PortalFrame ox={110} oy={55} s={7} />,
  energy: <PipeRack ox={90} oy={54} s={7} />,
};
const sceneLabel: Record<string, string> = { construction: "Multi-storey frame", mining: "Industrial platform", manufacturing: "Factory structure", energy: "Industrial steel framework" };

export function StructIndustries({ service }: { service: Service }) {
  const items = service.industries.map(getIndustryBySlug).filter((i): i is NonNullable<typeof i> => Boolean(i));
  return (
    <LightSection id="industries" tint>
      <Reveal>
        <SectionHeading eyebrow="Industries" heading="Structural Documentation Across Multiple Industries" />
      </Reveal>
      <InView as="ul" className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((ind, i) => (
          <li key={ind.slug}>
            <Reveal delay={i * 80} className="h-full">
              <Link href={`/industries/${ind.slug}`} className="group flex h-full flex-col border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40">
                <div className="relative aspect-[8/5] overflow-hidden bg-ink-950 text-sky-300">
                  <TechnicalGrid id={`si-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                  <svg viewBox="0 0 240 150" fill="none" className="art-zoom relative h-full w-full" aria-hidden>{sceneFor[ind.slug]}</svg>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-base font-semibold tracking-tight text-navy-900">{ind.name}</h3>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.1em] text-neutral-500">{sceneLabel[ind.slug] ?? ""}</p>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </InView>
    </LightSection>
  );
}

const projectArt: Record<string, React.ReactNode> = {
  "warehouse-structural-steel-shop-drawings": <PortalFrame ox={110} oy={58} s={7.5} />,
  "processing-plant-platform-structural-detailing": <PlatformStructure ox={90} oy={64} s={9} />,
};

export function StructProjects() {
  const items = projects.filter((p) => p.discipline === "structural");
  if (items.length === 0) return null;
  return (
    <DarkSection id="projects" tone="900">
      <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading tone="dark" eyebrow="Portfolio" heading="Related Structural Projects" description="Illustrative examples, marked as such. They will give way to verified case studies as client work is cleared for publication." />
        <Link href="/projects/structural" className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-copper-400 hover:underline">All structural projects →</Link>
      </Reveal>
      <InView as="ul" className="mt-12 grid gap-5 md:grid-cols-2">
        {items.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 90} className="h-full">
              <Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col overflow-hidden border border-steel-300/20 bg-ink-950 transition-colors duration-300 hover:border-sky-300/50">
                <div className="relative aspect-[16/9] overflow-hidden text-sky-300">
                  <TechnicalGrid id={`sp-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                  <svg viewBox="0 0 240 150" fill="none" className="art-zoom relative h-full w-full p-3" aria-hidden>{projectArt[p.slug]}</svg>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/90 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-200">Structural · {p.industry}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-copper-400">{p.discipline}</span>
                    {p.isPlaceholder ? <span className="border border-steel-300/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-neutral-400">Illustrative example</span> : null}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-white">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-400">{p.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-colors group-hover:text-copper-400">
                    View project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </InView>
    </DarkSection>
  );
}

export function StructRelated({ service }: { service: Service }) {
  const items = service.relatedServices.map(getServiceBySlug).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const pos = ["left-[14%] top-[20%]", "left-[86%] top-[20%]", "left-[14%] top-[80%]", "left-[86%] top-[80%]"];
  return (
    <LightSection id="related">
      <Reveal>
        <SectionHeading eyebrow="Related" heading="Continue From Structural Detailing Into the Wider Engineering Workflow" />
      </Reveal>
      <InView threshold={0.25} className="relative mt-12 hidden h-[380px] lg:block">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden fill="none">
          {[[14, 20], [86, 20], [14, 80], [86, 80]].map(([x, y], i) => (
            <path key={i} d={`M50 50L${x} ${y}`} stroke="#d68a51" strokeWidth="0.35" vectorEffect="non-scaling-stroke" strokeDasharray="5 5" pathLength={1} className="draw" style={{ "--d": `${i * 200}ms`, "--t": "1.2s" } as React.CSSProperties} />
          ))}
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-navy-900 bg-navy-900 px-6 py-5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">You are here</p>
          <p className="mt-1 text-base font-semibold text-white">Structural drafting</p>
        </div>
        {items.map((s, i) => (
          <Link key={s.slug} href={`/services/${s.category}/${s.slug}`} className={`group absolute w-64 -translate-x-1/2 -translate-y-1/2 border border-neutral-200 bg-white p-4 transition-all duration-300 hover:-translate-y-[calc(50%+3px)] hover:border-navy-900/40 ${pos[i]}`}>
            <h3 className="flex items-center justify-between text-base font-semibold tracking-tight text-navy-900">{s.name}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-600">{s.shortDescription}</p>
          </Link>
        ))}
      </InView>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:hidden">
        {items.map((s) => (
          <li key={s.slug}>
            <Link href={`/services/${s.category}/${s.slug}`} className="block border border-neutral-200 bg-white p-4">
              <h3 className="text-base font-semibold text-navy-900">{s.name}</h3>
              <p className="mt-1 text-xs text-neutral-600">{s.shortDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    </LightSection>
  );
}

export function StructCTA() {
  return (
    <InView as="section" threshold={0.25} className="relative overflow-hidden border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <TechnicalGrid id="struct-cta-grid" className="text-sky-300/[0.07]" minor={28} major={140} />
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Get a Quote for Structural Drafting</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">Tell us what you need and our team can review the project requirements.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button>
            <Button href="/services/structural" size="lg" variant="outline-light">Explore Structural Services</Button>
          </div>
        </div>
        <div aria-hidden className="border border-steel-300/20 bg-ink-900/50 p-2">
          <PackageGraphic className="h-auto w-full" />
        </div>
      </Container>
    </InView>
  );
}
