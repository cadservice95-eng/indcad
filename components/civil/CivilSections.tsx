import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { CivilHub } from "@/components/svg/CivilHub";
import { CivilSite } from "@/components/svg/CivilSite";
import { TerrainBuild, SurveyToTerrain } from "@/components/svg/TerrainPanels";
import { StormwaterNetwork } from "@/components/svg/StormwaterNetwork";
import { SurveyDiscrepancy } from "@/components/svg/SurveyDiscrepancy";
import { Civil3DVisualization } from "@/components/svg/Civil3DVisualization";
import { CivilIcon, CivilArt, type CivilIconName, type CivilArtName } from "@/components/svg/CivilIcons";
import { Chips, Callout } from "@/components/mechanical/SplitSection";
import { overviewParagraphs } from "@/components/mechanical/content";
import { projects } from "@/data/projects";
import { CivilLayerExplorer } from "./CivilLayerExplorer";
import { DrainageChange } from "./DrainageChange";
import { RoadDesign } from "./RoadDesign";
import { EarthworksComparison } from "./EarthworksComparison";
import { ConstructionSequence } from "./ConstructionSequence";

const sentences = (text: string) => text.split(/(?<=\.) /);
const faq = (s: Service, start: string) => s.faqs.find((f) => f.question.startsWith(start))?.answer ?? "";

function DarkSection({ id, tone = "950", children }: { id: string; tone?: "950" | "900"; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative overflow-hidden border-t border-navy-800 py-20 sm:py-28 ${tone === "950" ? "bg-ink-950" : "bg-ink-900"}`}>
      <TechnicalGrid id={`${id}-grid`} className="text-sky-300/[0.06]" />
      <Container className="relative">{children}</Container>
    </section>
  );
}

function LightSection({ id, tint, children }: { id: string; tint?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={`border-t border-neutral-200 py-20 sm:py-28 ${tint ? "bg-neutral-50" : ""}`}>
      <Container>{children}</Container>
    </section>
  );
}

function Head({ eyebrow, heading, dark, children }: { eyebrow: string; heading: string; dark?: boolean; children?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      <SectionHeading eyebrow={eyebrow} heading={heading} tone={dark ? "dark" : "light"} />
      <div className={`space-y-4 text-base leading-relaxed ${dark ? "text-neutral-300" : "text-neutral-600"}`}>{children}</div>
    </Reveal>
  );
}

export function IntroSection({ service }: { service: Service }) {
  const [first, ...rest] = sentences(service.problemStatement);
  return (
    <section id="civil-documentation" className="py-20 sm:py-28">
      <Container>
        <Head eyebrow="Civil documentation" heading="Keep Every Drawing Connected to the Same Civil Design">
          <p>{first}</p>
          <p>{rest.join(" ")}</p>
        </Head>
        <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-6">
          <CivilHub className="mx-auto h-auto w-full min-w-[560px] max-w-3xl" />
        </InView>
      </Container>
    </section>
  );
}

export function CoordinationSection() {
  return (
    <DarkSection id="coordination">
      <Head dark eyebrow="Coordinated views" heading="Site, Grading, Stormwater and Road Plans from One Design">
        <p>Switch between drawing views: the terrain and alignment stay the same, only the layers shown change. That shared base is what keeps the drawing set consistent.</p>
      </Head>
      <InView threshold={0.15} className="mt-12">
        <CivilLayerExplorer kind="tabs" />
      </InView>
    </DarkSection>
  );
}

const scopeFlow: { label: string; icon: CivilIconName }[] = [
  { label: "Land", icon: "land" },
  { label: "Site", icon: "site" },
  { label: "Grading", icon: "grading" },
  { label: "Drainage", icon: "drainage" },
  { label: "Roads", icon: "road" },
  { label: "Construction", icon: "construction" },
];

export function ScopeSection({ service }: { service: Service }) {
  const [first, second] = overviewParagraphs(service, "What This Service Covers");
  return (
    <section id="covers" className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Head eyebrow="Scope" heading="What This Service Covers">
          <p>{first}</p>
          <Chips items={["Land development documentation", "Site plans", "Subdivision plans", "Stormwater design drawings", "Road design drawings", "Civil 3D models", "Civil surfaces", "Construction documentation"]} />
          <p>{second}</p>
        </Head>
        <InView as="ol" threshold={0.2} className="group relative mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
          <span aria-hidden className="absolute left-[8%] right-[8%] top-[27px] hidden h-px origin-left scale-x-0 bg-copper-500/70 transition-transform duration-[2200ms] ease-out group-data-[in=true]:scale-x-100 lg:block" />
          {scopeFlow.map((s, i) => (
            <li key={s.label} className="reveal relative text-center" style={{ "--d": `${i * 140}ms` } as React.CSSProperties}>
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center border border-neutral-300 bg-white text-steel-600">
                <CivilIcon name={s.icon} className="h-8 w-8" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-navy-900 font-mono text-[10px] text-white">{i + 1}</span>
              </span>
              <p className="mt-3 text-sm font-medium text-navy-900">{s.label}</p>
            </li>
          ))}
        </InView>
      </Container>
    </section>
  );
}

export function TerrainSection({ service }: { service: Service }) {
  const text = sentences(overviewParagraphs(service, "What This Service Covers")[1]).slice(-1)[0];
  return (
    <LightSection id="terrain">
      <Head eyebrow="Surface modelling" heading="Build the Surface Once. Use It Across the Project.">
        <p>{text}</p>
        <p>From survey points to a triangulated surface, contours and grading — every later sheet refers back to the same ground model.</p>
      </Head>
      <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
        <TerrainBuild className="h-auto w-full min-w-[640px]" />
      </InView>
    </LightSection>
  );
}

export function SurveyTerrainSection({ service }: { service: Service }) {
  const input = service.process[0]?.description ?? "";
  return (
    <DarkSection id="survey-to-terrain" tone="900">
      <Head dark eyebrow="Survey data" heading="From Survey Points to a Contoured Terrain Model">
        <p>{input}</p>
        <p>Points are triangulated into a surface and contoured, so levels and falls can be read — and reused — everywhere the design needs them.</p>
      </Head>
      <InView threshold={0.25} className="mt-12 overflow-x-auto border border-steel-300/20 bg-ink-950 p-3 sm:p-5">
        <SurveyToTerrain className="h-auto w-full min-w-[640px]" />
      </InView>
    </DarkSection>
  );
}

export function SignatureSection() {
  return (
    <DarkSection id="layers">
      <Head dark eyebrow="Signature view" heading="One Civil Model. Multiple Coordinated Drawing Sets.">
        <p>Civil drafting is about coordination, not isolated drawings. Switch layers on and off, or build the project up step by step, and see how every output stays tied to the same terrain and design.</p>
      </Head>
      <InView threshold={0.15} className="mt-12">
        <CivilLayerExplorer kind="signature" />
      </InView>
    </DarkSection>
  );
}

export function StormwaterSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Stormwater Coordination")[0];
  return (
    <DarkSection id="stormwater" tone="900">
      <Head dark eyebrow="Stormwater & drainage" heading="Stormwater Coordination That Stays Connected to the Site Design">
        <p>{text}</p>
      </Head>
      <InView threshold={0.2} className="mt-12 border border-steel-300/20 bg-ink-950 p-2">
        <StormwaterNetwork className="h-auto w-full" />
      </InView>
      <div className="mt-16">
        <Head dark eyebrow="Change propagation" heading="One Design Change Can Affect Multiple Drawing Sets">
          <p>Pick a change and see which drawings it reaches. This is a visual walkthrough of the coordination idea, not a calculation.</p>
        </Head>
        <InView threshold={0.2} className="mt-10">
          <DrainageChange />
        </InView>
      </div>
    </DarkSection>
  );
}

export function RoadSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Stormwater Coordination")[1];
  return (
    <LightSection id="roads" tint>
      <Head eyebrow="Road design" heading="Road Design Drawings Built for Construction">
        <p>{text}</p>
        <p>Plan, longitudinal profile and cross-section describe the same road from three directions.</p>
      </Head>
      <div className="mt-12 border border-navy-800 bg-ink-900 p-4 sm:p-6">
        <RoadDesign />
      </div>
    </LightSection>
  );
}

export function SubdivisionSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Subdivision Coordination")[0];
  return (
    <DarkSection id="subdivision">
      <Head dark eyebrow="Subdivision" heading="Subdivision Documentation That Keeps Lots, Easements & Services Aligned">
        <p>{text}</p>
      </Head>
      <InView threshold={0.15} className="mt-12">
        <CivilLayerExplorer kind="subdivision" />
      </InView>
    </DarkSection>
  );
}

export function DiscrepancySection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Subdivision Coordination")[1];
  return (
    <LightSection id="survey-discrepancy">
      <Head eyebrow="Real survey data" heading="When Survey Data Doesn't Match the Concept Design">
        <p>{text}</p>
      </Head>
      <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
        <SurveyDiscrepancy className="h-auto w-full min-w-[640px]" />
      </InView>
    </LightSection>
  );
}

export function EarthworksSection({ service }: { service: Service }) {
  return (
    <DarkSection id="earthworks" tone="900">
      <Head dark eyebrow="Earthworks" heading="Grading & Earthworks Documentation">
        <p>{faq(service, "Can you produce a staged earthworks")}</p>
        <p>{faq(service, "Can you produce a cut-and-fill")}</p>
        <Callout dark>The slider below is a visual comparison only; it does not calculate volumes.</Callout>
      </Head>
      <InView threshold={0.15} className="mt-12">
        <EarthworksComparison />
      </InView>
    </DarkSection>
  );
}

export function SequencingSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Drafting for the Contractor")[0];
  return (
    <LightSection id="sequencing">
      <Head eyebrow="Construction sequence" heading="Drafting for the Contractor's Actual Construction Sequence">
        <p>{text}</p>
      </Head>
      <div className="mt-12">
        <ConstructionSequence />
      </div>
    </LightSection>
  );
}

const groups: { title: string; icon: CivilIconName; match: RegExp }[] = [
  { title: "Site", icon: "site", match: /Site plans|Easement/i },
  { title: "Terrain", icon: "grading", match: /Earthworks|Civil 3D/i },
  { title: "Infrastructure", icon: "road", match: /Road|Stormwater|Infrastructure/i },
  { title: "Construction", icon: "plan", match: /Construction documentation|Erosion/i },
];

export function CivilDeliverables({ service }: { service: Service }) {
  const buckets = groups.map(() => [] as string[]);
  for (const item of service.deliverables) {
    const i = groups.findIndex((g) => g.match.test(item));
    buckets[i === -1 ? 3 : i].push(item);
  }
  return (
    <LightSection id="deliverables" tint>
      <Reveal>
        <SectionHeading eyebrow="Deliverables" heading="What You Get" />
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g, i) => (
          <Reveal key={g.title} delay={i * 80} className="h-full">
            <div className="group h-full border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40 hover:shadow-[0_12px_30px_-12px_rgba(11,18,32,0.25)]">
              <CivilIcon name={g.icon} className="text-steel-600 transition-colors group-hover:text-copper-600" />
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-navy-900">{g.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {buckets[i].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-snug text-neutral-600">
                    <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-copper-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </LightSection>
  );
}

const appArt: CivilArtName[] = ["subdivision", "development", "road", "drainage", "siteworks", "infrastructure"];

export function CivilApplications({ service }: { service: Service }) {
  return (
    <LightSection id="applications">
      <Reveal>
        <SectionHeading eyebrow="Applications" heading="Where Civil Drafting Is Used" />
      </Reveal>
      <InView as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {service.applications.map((app, i) => (
          <li key={app}>
            <Reveal delay={(i % 3) * 70} className="h-full">
              <div className="group h-full border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40">
                <div className="relative aspect-[8/5] overflow-hidden bg-ink-950 text-sky-300">
                  <TechnicalGrid id={`app-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                  <div className="art-zoom relative h-full w-full p-3"><CivilArt name={appArt[i % appArt.length]} /></div>
                </div>
                <p className="p-5 text-base font-semibold leading-snug tracking-tight text-navy-900">{app}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </InView>
    </LightSection>
  );
}

export function Civil3DSection({ service }: { service: Service }) {
  const [, second] = overviewParagraphs(service, "What This Service Covers");
  return (
    <DarkSection id="civil-3d">
      <Head dark eyebrow="Software" heading="Civil 3D for Coordinated Civil Documentation">
        <p>{sentences(second)[0]}</p>
        <p>{faq(service, "Can you produce longitudinal")}</p>
        <p>
          <Link href="/software/civil-3d" className="text-sm font-semibold text-white underline-offset-4 hover:text-copper-400 hover:underline">How we use Civil 3D →</Link>
        </p>
      </Head>
      <InView threshold={0.2} className="mt-12 overflow-x-auto border border-steel-300/20 bg-ink-950 p-2">
        <Civil3DVisualization className="h-auto w-full min-w-[640px]" />
      </InView>
    </DarkSection>
  );
}

const industryCards: { slug: string; name: string; art: CivilArtName; line: string }[] = [
  { slug: "construction", name: "Construction", art: "siteworks", line: "Site development, grading and infrastructure" },
  { slug: "energy", name: "Energy", art: "infrastructure", line: "Infrastructure sites, access roads and drainage" },
  { slug: "mining", name: "Mining", art: "terrain", line: "Terrain, infrastructure, access and civil documentation" },
];

export function CivilIndustries() {
  return (
    <LightSection id="industries" tint>
      <Reveal>
        <SectionHeading eyebrow="Industries" heading="Industries We Support" />
      </Reveal>
      <InView as="ul" className="mt-12 grid gap-4 md:grid-cols-3">
        {industryCards.map((c, i) => (
          <li key={c.slug}>
            <Reveal delay={i * 80} className="h-full">
              <Link href={`/industries/${c.slug}`} className="group flex h-full flex-col border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40">
                <div className="relative aspect-[8/5] overflow-hidden bg-ink-950 text-sky-300">
                  <TechnicalGrid id={`ci-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                  <div className="relative h-full w-full p-3"><CivilArt name={c.art} /></div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold tracking-tight text-navy-900">{c.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">{c.line}</p>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </InView>
    </LightSection>
  );
}

const projectArt: Record<string, CivilArtName> = {
  "residential-subdivision-civil-documentation": "subdivision",
  "site-access-road-and-drainage-design": "accessroad",
};

export function CivilProjects() {
  const items = projects.filter((p) => p.discipline === "civil");
  if (items.length === 0) return null;
  return (
    <DarkSection id="projects">
      <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading tone="dark" eyebrow="Portfolio" heading="Related Civil Projects" description="Illustrative examples, marked as such. They will give way to verified case studies as client work is cleared for publication." />
        <Link href="/projects/civil" className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-copper-400 hover:underline">All civil projects →</Link>
      </Reveal>
      <InView as="ul" className="mt-12 grid gap-5 md:grid-cols-2">
        {items.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 90} className="h-full">
              <Link href={`/projects/${p.discipline}/${p.slug}`} className="group flex h-full flex-col overflow-hidden border border-steel-300/20 bg-ink-900 transition-colors duration-300 hover:border-sky-300/50">
                <div className="relative aspect-[16/9] overflow-hidden bg-ink-950 text-sky-300">
                  <TechnicalGrid id={`cp-${i}`} className="text-sky-300/[0.08]" minor={16} major={80} />
                  <div className="art-zoom relative h-full w-full p-5"><CivilArt name={projectArt[p.slug] ?? "development"} /></div>
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/90 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-200">Civil · {p.industry}</p>
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

export function CivilCTA() {
  return (
    <InView as="section" threshold={0.25} className="relative overflow-hidden border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <TechnicalGrid id="civil-cta-grid" className="text-sky-300/[0.07]" minor={28} major={140} />
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Get a Quote for Civil Drafting</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">Tell us what you need and our team can review the project requirements.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button>
            <Button href="/services/civil" size="lg" variant="outline-light">Explore Civil Services</Button>
          </div>
        </div>
        <div aria-hidden className="border border-steel-300/20 bg-ink-900/50 p-2">
          <CivilSite layers={{ terrain: 1, roads: 1, boundary: 1, lots: 1, drainage: 1, labels: 1 }} animate title="" className="h-auto w-full" />
        </div>
      </Container>
    </InView>
  );
}
