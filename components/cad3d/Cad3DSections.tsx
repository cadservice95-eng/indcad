import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InView, Reveal } from "@/components/motion/InView";
import { TechnicalGrid } from "@/components/svg/TechnicalGrid";
import { ModelEcosystem } from "@/components/svg/ModelEcosystem";
import { PartLayer, AssemblyLayer, MachineLayer } from "@/components/svg/ScopeLayers";
import { NewDesignGraphic, ExistingGraphic } from "@/components/svg/TwoWorkflows";
import { MateConstraint } from "@/components/svg/MateConstraint";
import { SimulationPrep } from "@/components/svg/SimulationPrep";
import { InterferenceCheck } from "@/components/svg/InterferenceCheck";
import { ParametricPart } from "@/components/svg/ParametricPart";
import { MechIcon, type MechIconName } from "@/components/svg/MechIcons";
import { Chips, Callout } from "@/components/mechanical/SplitSection";
import { overviewParagraphs } from "@/components/mechanical/content";
import { FeatureTreeModel } from "./FeatureTreeModel";
import { SourceOfTruth } from "./SourceOfTruth";
import { AssemblyExploded } from "./AssemblyExploded";
import { ModelCleanup } from "./ModelCleanup";
import { ConfigurationModel } from "./ConfigurationModel";

const sentences = (text: string) => text.split(/(?<=\.) /);

function DarkSection({ id, tone = "950", children }: { id: string; tone?: "950" | "900"; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative overflow-hidden border-t border-navy-800 py-20 sm:py-28 ${tone === "950" ? "bg-ink-950" : "bg-ink-900"}`}>
      <TechnicalGrid id={`${id}-grid`} className="text-sky-300/[0.06]" />
      <Container className="relative">{children}</Container>
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

export function WhySection({ service }: { service: Service }) {
  const [first, ...rest] = sentences(service.problemStatement);
  return (
    <section id="why-3d" className="py-20 sm:py-28">
      <Container>
        <Head eyebrow="Why 3D CAD" heading="A 3D Model Should Do More Than Look Right">
          <p>{first}</p>
          <p>{rest.join(" ")}</p>
        </Head>
        <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-6">
          <ModelEcosystem className="mx-auto h-auto w-full min-w-[560px] max-w-3xl" />
        </InView>
      </Container>
    </section>
  );
}

export function SourceSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "What This Service Covers")[2];
  return (
    <DarkSection id="source-of-truth">
      <Head dark eyebrow="Single source of truth" heading="One Model. Multiple Engineering Outputs.">
        <p>{text}</p>
      </Head>
      <InView threshold={0.2} className="mt-12">
        <SourceOfTruth />
      </InView>
    </DarkSection>
  );
}

const scopeItems = [
  "Parametric 3D CAD models",
  "Individual parts",
  "Multi-part assemblies",
  "Full machines",
  "Native CAD platforms",
  "New design modelling",
  "Existing equipment documentation",
  "Physical parts",
  "Legacy 2D drawings",
  "Point-cloud scan data",
];

export function ScopeSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "What This Service Covers")[0];
  const layers = [
    { n: "01", title: "Part", text: "A single component", Visual: PartLayer },
    { n: "02", title: "Assembly", text: "Multiple components", Visual: AssemblyLayer },
    { n: "03", title: "Machine", text: "Complete equipment", Visual: MachineLayer },
  ];
  return (
    <section id="covers" className="scroll-mt-24 border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Head eyebrow="Scope" heading="What This Service Covers">
          <p>{text}</p>
          <Chips items={scopeItems} />
        </Head>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {layers.map(({ n, title, text: t, Visual }, i) => (
            <li key={n}>
              <Reveal delay={i * 100} className="h-full">
                <div className="group h-full border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40">
                  <div className="bg-ink-950 p-3 text-sky-300"><Visual /></div>
                  <div className="p-5">
                    <p className="font-mono text-xs tracking-[0.16em] text-copper-600">{n}</p>
                    <h3 className="mt-1 text-lg font-semibold tracking-tight text-navy-900">{title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{t}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function PartModellingSection({ service }: { service: Service }) {
  const s = sentences(overviewParagraphs(service, "What This Service Covers")[0]);
  return (
    <DarkSection id="part-modelling" tone="900">
      <Head dark eyebrow="Parts" heading="Parametric Part Modelling">
        <p>{s[1]}</p>
        <p>Each feature in the tree controls a specific piece of geometry — which is what makes a model editable, logical and useful beyond its first revision.</p>
      </Head>
      <InView threshold={0.2} className="mt-12">
        <FeatureTreeModel mode="hover" />
      </InView>
    </DarkSection>
  );
}

export function ParametricUpdateSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Feature-Tree Structure")[0];
  return (
    <DarkSection id="editable">
      <Head dark eyebrow="Model structure" heading="Built to Be Edited — Not Just Viewed">
        <p>{text}</p>
        <Callout dark>Change the length below: dimensions and dependent features rebuild predictably. This is a visual simulation of that behaviour.</Callout>
      </Head>
      <InView threshold={0.2} className="mt-12">
        <FeatureTreeModel mode="param" />
      </InView>
    </DarkSection>
  );
}

export function NewVsExistingSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "What This Service Covers")[1];
  const cards = [
    { tag: "New design", title: "Concept sketch → 3D CAD", Visual: NewDesignGraphic, points: ["Design intent", "Iteration", "Editable features", "Future changes"] },
    { tag: "Existing equipment", title: "Physical component → reference → 3D CAD", Visual: ExistingGraphic, points: ["Accurate capture", "Legacy drawings", "Scan data", "Real-world geometry"] },
  ];
  return (
    <section id="new-vs-existing" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Head eyebrow="Two use cases" heading="Two Modelling Challenges. One Engineering Workflow.">
          <p>{text}</p>
        </Head>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {cards.map(({ tag, title, Visual, points }, i) => (
            <Reveal key={tag} delay={i * 100} className="h-full">
              <InView threshold={0.3} className="h-full border border-navy-800 bg-ink-950">
                <div className="relative p-4">
                  <TechnicalGrid id={`nve-${i}`} className="text-sky-300/[0.07]" minor={20} major={100} />
                  <div className="relative">
                    <Visual className="h-auto w-full" />
                  </div>
                </div>
                <div className="border-t border-steel-300/20 p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-copper-400">{tag}</p>
                  <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-white">{title}</h3>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-sm text-neutral-300">
                        <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-copper-500" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </InView>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function AssemblySection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Feature-Tree Structure")[1];
  return (
    <DarkSection id="assemblies" tone="900">
      <Head dark eyebrow="Assemblies" heading="Assemblies Built Around Stable Mating Logic">
        <p>{text}</p>
      </Head>
      <InView threshold={0.2} className="mt-12">
        <AssemblyExploded />
      </InView>

      <div className="mt-20">
        <Head dark eyebrow="Mates" heading="Mate & Constraint Logic">
          <p>
            Mates define how components relate: concentric for shared axes, coincident for touching faces, distance for
            controlled offsets. A fully defined set behaves predictably when a dimension changes.
          </p>
        </Head>
        <InView threshold={0.35} className="mt-10 overflow-hidden border border-steel-300/20 bg-ink-950 p-2">
          <MateConstraint className="h-auto w-full" />
        </InView>
      </div>
    </DarkSection>
  );
}

export function SimulationSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Preparing Models")[0];
  return (
    <section id="simulation" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Head eyebrow="FEA · CFD" heading="Models Prepared for Downstream Simulation">
          <p>{text}</p>
        </Head>
        <InView threshold={0.25} className="mt-12 overflow-x-auto border border-navy-800 bg-ink-950 p-3 sm:p-5">
          <SimulationPrep className="h-auto w-full min-w-[640px]" />
        </InView>
        <p className="mt-4 text-sm text-neutral-500">Shown as a workflow concept: which simplifications are acceptable is confirmed with whoever runs the analysis.</p>
      </Container>
    </section>
  );
}

export function HygieneSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Preparing Models")[1];
  return (
    <section id="model-health" className="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
      <Container>
        <Head eyebrow="Model health" heading="Model Health Matters Over the Life of a Project">
          <p>{text}</p>
        </Head>
        <div className="mt-12">
          <ModelCleanup />
        </div>
      </Container>
    </section>
  );
}

export function ConfigSection({ service }: { service: Service }) {
  const text = overviewParagraphs(service, "Configuration Management")[0];
  return (
    <DarkSection id="configurations">
      <Head dark eyebrow="Product families" heading="One Master Model. Multiple Product Variants.">
        <p>{text}</p>
      </Head>
      <InView threshold={0.15} className="mt-12">
        <ConfigurationModel />
      </InView>
    </DarkSection>
  );
}

const groups: { title: string; icon: MechIconName; match: RegExp }[] = [
  { title: "Modelling", icon: "models", match: /Parametric part|Assembly models|Surface models|Sheet metal/i },
  { title: "Engineering", icon: "fea", match: /Configuration-driven|Simplified/i },
  { title: "Output", icon: "folder", match: /STEP/i },
  { title: "Documentation", icon: "documentation", match: /Exploded|2D drawings/i },
  { title: "Model maintenance", icon: "change", match: /health|clean-up/i },
];

export function Cad3DDeliverables({ service }: { service: Service }) {
  const buckets = groups.map(() => [] as string[]);
  for (const item of service.deliverables) {
    const i = groups.findIndex((g) => g.match.test(item));
    buckets[i === -1 ? 0 : i].push(item);
  }
  return (
    <section id="deliverables" className="border-t border-neutral-200 py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Deliverables" heading="What You Get" />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={(i % 3) * 80} className="h-full">
              <div className="group h-full border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/40 hover:shadow-[0_12px_30px_-12px_rgba(11,18,32,0.25)]">
                <MechIcon name={g.icon} className="text-steel-600 transition-colors group-hover:text-copper-600" />
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
      </Container>
    </section>
  );
}

const appIcons: MechIconName[] = ["product", "machine", "dfm", "fea", "viz", "spare", "family", "interference"];

export function Cad3DApplications({ service }: { service: Service }) {
  return (
    <>
      <section id="applications" className="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Applications" heading="Where 3D CAD Modelling Is Used" />
          </Reveal>
          <ul className="mt-12 grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
            {service.applications.map((app, i) => (
              <li key={app} className="bg-white">
                <Reveal delay={(i % 4) * 60} className="h-full">
                  <div className="group flex h-full flex-col gap-5 p-5 transition-colors duration-300 hover:bg-steel-50">
                    <MechIcon name={appIcons[i % appIcons.length]} className="text-steel-600 transition-colors group-hover:text-copper-600" />
                    <p className="text-sm font-medium leading-snug text-navy-900">{app}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <DarkSection id="interference" tone="900">
        <Head dark eyebrow="Clearance checking" heading="Interference Checking on Complex Assemblies">
          <p>
            With the assembly modelled, components can be checked against each other for clearance before anything is
            built. The sequence below is a visual explanation of the idea, not a live analysis.
          </p>
        </Head>
        <InView threshold={0.4} className="mt-10 overflow-hidden border border-steel-300/20 bg-ink-950 p-2">
          <InterferenceCheck className="h-auto w-full" />
        </InView>
      </DarkSection>
    </>
  );
}

export function Cad3DCTA() {
  const tree = ["Sketch 01", "Extrude 01", "Fillet 01", "Hole 01", "Chamfer 01", "Pattern 01"];
  return (
    <InView as="section" threshold={0.25} className="relative overflow-hidden border-t border-navy-800 bg-ink-950 py-20 sm:py-28">
      <TechnicalGrid id="cad3d-cta-grid" className="text-sky-300/[0.07]" minor={28} major={140} />
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Start a project</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Get a Quote for 3D CAD Modelling</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">Tell us what you need and our team can review the project requirements.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button>
            <Button href="/services/mechanical" size="lg" variant="outline-light">Explore Mechanical Services</Button>
          </div>
        </div>
        <div aria-hidden className="grid grid-cols-[130px_1fr] items-center gap-2 border border-steel-300/20 bg-ink-900/50 p-3">
          <ul className="font-mono text-[11px] text-neutral-300">
            {tree.map((t, i) => (
              <li key={t} className="reveal flex items-center gap-2 py-1.5" style={{ "--d": `${300 + i * 120}ms` } as React.CSSProperties}>
                <span className="text-neutral-600">{i === tree.length - 1 ? "└─" : "├─"}</span>
                <span className="h-1.5 w-1.5 bg-sky-400" />
                {t}
              </li>
            ))}
          </ul>
          <svg viewBox="0 0 600 340" fill="none" className="h-auto w-full">
            <path d="M0 24V0h24M576 0h24v24M600 316v24h-24M24 340H0v-24" stroke="#38bdf8" strokeWidth="2" />
            <ParametricPart cx={300} cy={165} s={1.8} mesh />
            <circle cx="300" cy="120" r="4" fill="#d68a51" className="rch-pulse" />
          </svg>
        </div>
      </Container>
    </InView>
  );
}
