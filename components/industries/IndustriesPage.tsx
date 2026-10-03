import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { industries } from "@/data/industries";
import { software as allSoftware } from "@/data/software";
import { getServiceBySlug } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/InView";
import { Paper, Char, Head } from "@/components/arch/ui";
import { IND_CONFIG, IndustryArt } from "./config";
import { Network, Selector, Matrix, Discovery, Preview, Workflow, SoftwareEco, type IndRow } from "./IndustriesClient";

const ECO = ["autocad", "revit", "tekla", "navisworks", "civil-3d", "solidworks", "inventor", "fusion-360"];

/** One structured list powers every component on the page. */
function buildRows(): IndRow[] {
  return industries.map((i) => {
    const c = IND_CONFIG[i.slug];
    return {
      slug: i.slug, name: i.name, desc: i.heroDescription, tags: c.tags, caps: c.caps, build: c.build, finalStage: c.finalStage,
      useCases: i.useCases, docReq: i.documentationRequirements[0] ?? "", deliverables: i.deliverables,
      software: i.software.map((s) => ({ slug: s, name: allSoftware.find((x) => x.slug === s)?.name ?? s })),
      services: i.services.flatMap((s) => { const v = getServiceBySlug(s); return v ? [{ name: v.name, href: `/services/${v.category}/${v.slug}` }] : []; }),
    };
  });
}

export function IndustriesPage() {
  const rows = buildRows();
  const eco = ECO.flatMap((s) => { const v = allSoftware.find((x) => x.slug === s); return v ? [{ slug: v.slug, name: v.name }] : []; });
  return (
    <>
      <section className="relative overflow-hidden bg-[#0A1426] pb-16 pt-14 text-white sm:pb-24 sm:pt-20">
        <Container className="relative grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sky-300">Industries</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">Industries We Support</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">Drafting, BIM and engineering design capability tailored to how each industry actually documents and delivers its projects.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="#selector" size="lg" arrow>Explore Industries</Button><Button href="/get-a-quote" size="lg" variant="outline-light">Get a Free Quote</Button></div>
          </div>
          <Network rows={rows} />
        </Container>
      </section>

      <Paper id="intro">
        <Head eyebrow="Why industry context" heading="Different Industries. Different Documentation Needs.">
          <p>A construction team needs coordinated drawings and models. A manufacturer needs fabrication-ready detail. An energy project needs structural, civil and electrical documentation to line up.</p>
          <p>Pick an industry below to see the drafting, BIM and engineering design capability shaped around how that sector works.</p>
        </Head>
      </Paper>

      <Paper id="selector" tint>
        <Head eyebrow="Industry selector" heading="Choose an Industry" />
        <Reveal className="mt-10"><Selector rows={rows} /></Reveal>
      </Paper>

      <Paper id="grid">
        <Head eyebrow="All industries" heading="Eight Industries, One Engineering Workflow" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((r, k) => (
            <li key={r.slug}><Reveal delay={k * 60} className="h-full">
              <Link href={`/industries/${r.slug}`} className="group flex h-full flex-col overflow-hidden border border-slate-300 bg-white transition-colors hover:border-slate-900">
                <IndustryArt slug={r.slug} name={r.name} className="block w-full" />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{r.name}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{r.desc}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">{r.tags.map((t) => <li key={t} className="border border-slate-300 px-2 py-0.5 text-[11px] text-slate-700">{t}</li>)}</ul>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-blue-700">View Industry <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span>
                </div>
              </Link>
            </Reveal></li>
          ))}
        </ul>
      </Paper>

      <Paper id="matrix" tint>
        <Head eyebrow="Capability map" heading="Selected Capabilities by Industry" />
        <Reveal className="mt-10"><Matrix rows={rows} /></Reveal>
      </Paper>

      <Paper id="discover">
        <Head eyebrow="Find your industry" heading="Explore the Industry That Matches Your Project" />
        <Reveal className="mt-10"><Discovery rows={rows} /></Reveal>
      </Paper>

      <Char id="preview">
        <Head dark eyebrow="Industry preview" heading="What Each Industry Typically Needs" />
        <Reveal className="mt-10"><Preview rows={rows} /></Reveal>
      </Char>

      <Paper id="workflow">
        <Head eyebrow="Why industry-specific" heading="The Same CAD Skill Doesn't Solve Every Industry Problem">
          <p>The route from requirement to documentation is shared. What changes is the final stage — the documentation each industry actually needs to build, fabricate or operate.</p>
        </Head>
        <Reveal className="mt-10"><Workflow rows={rows} /></Reveal>
      </Paper>

      <Char id="software">
        <Head dark eyebrow="Technical software ecosystem" heading="Tools Matched to the Industry" />
        <Reveal className="mt-10"><SoftwareEco rows={rows} software={eco} /></Reveal>
      </Char>

      <Paper id="others">
        <Head eyebrow="Directory" heading="Explore Other Industries" />
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {rows.map((r) => <li key={r.slug}><Link href={`/industries/${r.slug}`} className="flex min-h-[56px] items-center justify-between border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-900">{r.name}<ArrowRight className="h-4 w-4 text-copper-500" aria-hidden /></Link></li>)}
        </ul>
      </Paper>

      <section className="border-t border-slate-800 bg-[#0A1426] py-20 text-white sm:py-24">
        <Container className="max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Have a Project That Doesn&apos;t Fit Neatly Into One Industry?</h2>
          <p className="mt-4 text-lg text-slate-300">Tell us what you need and our team can review the project requirements.</p>
          <div className="mt-8 flex justify-center"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button></div>
        </Container>
      </section>
    </>
  );
}
