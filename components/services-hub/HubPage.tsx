import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/InView";
import { cn } from "@/lib/utils";
import { Paper, Char, Head } from "@/components/arch/ui";
import { ServiceVisual, STAGES, type Cat } from "./visuals";
import { ServiceNetwork, Explorer, Decide, InputOutput } from "./HubClient";
import { FAMILIES, PATHWAYS, LIFECYCLE, ENTRIES, ECO, FORMAT_LIST, FORMATS_BY_SERVICE, INDUSTRY_LINKS, ALL, type Family } from "./config";

const fam = (c: Cat) => FAMILIES.find((f) => f.slug === c)!;
const Vis = ({ c, s }: { c: Cat; s?: number }) => <div className="bg-[#0B1B33]"><ServiceVisual cat={c} stage={s ?? STAGES[c].length - 1} label={`${fam(c).name} technical illustration`} /></div>;

function Links({ f, dark }: { f: Family; dark?: boolean }) {
  return (
    <ul className="space-y-3">
      {f.services.map((s) => (
        <li key={s.slug}>
          <h4 className={cn("text-base font-semibold", dark ? "text-white" : "text-slate-900")}>{s.name}</h4>
          <p className={cn("mt-0.5 text-sm leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{s.desc}</p>
          <Link href={s.href} className={cn("mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline", dark ? "text-sky-300" : "text-blue-700")}>Explore {s.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </li>
      ))}
    </ul>
  );
}
const Title = ({ f, dark }: { f: Family; dark?: boolean }) => (
  <>
    <h3 className={cn("text-2xl font-semibold tracking-tight", dark ? "text-white" : "text-slate-900")}>{f.name}</h3>
    <p className={cn("mb-4 mt-1.5 text-sm", dark ? "text-slate-300" : "text-slate-600")}>{f.desc} <Link href={f.href} className="underline underline-offset-4">All {f.name} services</Link></p>
  </>
);

export function AllServices() {
  const [mech, struct, arch, civil, elec, bim, conv, eng] = ["mechanical", "structural", "architectural", "civil", "electrical", "bim", "cad-conversion", "engineering-design"].map((c) => fam(c as Cat));
  return (
    <div className="mt-12 space-y-10">
      <Reveal><div className="grid items-center gap-px overflow-hidden border border-slate-300 bg-slate-300 lg:grid-cols-[1.3fr_1fr]"><Vis c="mechanical" s={2} /><div className="h-full bg-white p-6"><Title f={mech} /><Links f={mech} /></div></div></Reveal>
      <Reveal><div className="relative overflow-hidden border border-slate-800 bg-[#0B1B33]"><Vis c="structural" s={0} /><div className="border-t border-slate-700 bg-[#0B1B33]/95 p-6 lg:absolute lg:bottom-5 lg:right-5 lg:w-[360px] lg:border"><Title f={struct} dark /><Links f={struct} dark /></div></div></Reveal>
      <Reveal><div className="border border-slate-300 bg-white"><div className="grid gap-px bg-slate-300 sm:grid-cols-2"><Vis c="architectural" s={1} /><Vis c="architectural" s={3} /></div><div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.4fr]"><Title f={arch} /><Links f={arch} /></div></div></Reveal>
      <Reveal><div className="border border-slate-300 bg-white"><Vis c="civil" s={5} /><div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.4fr]"><Title f={civil} /><Links f={civil} /></div></div></Reveal>
      <Reveal><div className="grid gap-6 border border-slate-700 bg-[#0F1B30] p-6 lg:grid-cols-[1fr_1.3fr] lg:items-center"><div><Title f={elec} dark /><Links f={elec} dark /></div><div className="border border-slate-600"><Vis c="electrical" /></div></div></Reveal>
      <Reveal><div className="border border-slate-300 bg-white"><div className="grid gap-px bg-slate-700 lg:grid-cols-[1.6fr_1fr]"><Vis c="bim" s={1} /><div className="grid gap-px bg-slate-700"><Vis c="bim" s={4} /><Vis c="bim" s={5} /></div></div><div className="grid gap-6 p-6 lg:grid-cols-[1fr_2fr]"><Title f={bim} /><Links f={bim} /></div></div></Reveal>
      <Reveal><div className="border border-slate-300 bg-white"><div className="grid items-center bg-[#0B1B33] sm:grid-cols-[1fr_auto_1fr]"><Vis c="cad-conversion" s={0} /><span aria-hidden className="hidden px-3 text-2xl text-copper-400 sm:block">→</span><Vis c="cad-conversion" s={4} /></div><div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.4fr]"><Title f={conv} /><Links f={conv} /></div></div></Reveal>
      <Reveal><div className="border border-slate-300 bg-white"><Vis c="engineering-design" /><div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.4fr]"><Title f={eng} /><Links f={eng} /></div></div></Reveal>
    </div>
  );
}

export function Pathways() {
  return (
    <div className="mt-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">Example project pathways</p>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {PATHWAYS.map((p, k) => (
          <li key={p.title}><Reveal delay={k * 80} className="h-full"><div className="h-full border border-slate-300 bg-white p-5">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper-600">{p.title}</h3>
            <ol className="mt-3 space-y-1">
              {p.steps.map((s, j) => { const v = s.slug ? ALL.find((x) => x.slug === s.slug) : undefined; return (
                <li key={s.l}><div className={cn("border px-3 py-2 text-sm font-semibold", v ? "border-slate-300 text-slate-900" : "border-dashed border-slate-300 text-slate-600")}>{v ? <Link href={v.href} className="underline-offset-4 hover:underline">{s.l}</Link> : s.l}</div>{j < p.steps.length - 1 ? <span aria-hidden className="block py-0.5 text-center text-copper-500">↓</span> : null}</li>
              ); })}
            </ol>
          </div></Reveal></li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500">Illustrative combinations, not mandatory workflows. Many projects need a single service.</p>
    </div>
  );
}

export function Lifecycle() {
  return (
    <div className="mt-12">
      <ol className="grid gap-2 md:grid-cols-7 md:gap-0">
        {LIFECYCLE.map((s, k) => (
          <li key={s} className="relative md:pr-3">
            <div className="h-full border border-slate-300 bg-white px-3 py-4 text-sm font-semibold text-slate-900"><span className="mb-1 block font-mono text-[10px] text-slate-400">{String(k + 1).padStart(2, "0")}</span>{s}</div>
            {k < LIFECYCLE.length - 1 ? <span aria-hidden className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 bg-[#F1EFEA] px-1 text-copper-500 md:-right-0 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0">→</span> : null}
            <div className="mt-2 flex min-h-[28px] flex-wrap gap-1.5">{ENTRIES.filter((e) => e.at === k).map((e) => <span key={e.l} className="inline-flex items-center gap-1 border border-amber-500 bg-amber-50 px-2 py-0.5 font-mono text-[10px] uppercase text-amber-800">↑ Start: {e.l}</span>)}</div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-slate-500">Not every project needs every stage. Projects enter at the point that matches what they already have — a concept, existing CAD, a PDF or a point cloud.</p>
    </div>
  );
}

export function Software() {
  return (
    <div className="mt-10">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {ECO.map((s) => (
          <li key={s.slug}><Link href={`/software/${s.slug}`} className="block h-full border border-slate-600 bg-[#0F1B30] p-4 transition-colors hover:border-sky-300"><p className="text-sm font-semibold text-white">{s.name}</p><p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-sky-300">{s.category}</p><p className="mt-2 text-xs leading-snug text-slate-400">{s.services.length ? s.services.join(" · ") : "—"}</p></Link></li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-400">Software is matched to the service — not every service uses every platform.</p>
    </div>
  );
}

export function Formats() {
  return (
    <div className="mt-10">
      <ul className="flex flex-wrap gap-2">{FORMAT_LIST.map((f) => <li key={f} className="border border-slate-300 bg-white px-4 py-3 font-mono text-lg font-semibold text-slate-900">{f}</li>)}</ul>
      <ul className="mt-5 grid gap-2 md:grid-cols-2">
        {FORMATS_BY_SERVICE.map((x) => <li key={x.name} className="flex flex-wrap items-center justify-between gap-2 border border-slate-200 bg-white px-4 py-2.5 text-sm"><Link href={x.href} className="font-semibold text-slate-900 underline-offset-4 hover:underline">{x.name}</Link><span className="font-mono text-[11px] text-slate-500">{x.formats.join(" · ")}</span></li>)}
      </ul>
      <p className="mt-3 text-xs text-slate-500">Formats shown are those named on each service page. Confirm the files you need when you request a quote.</p>
    </div>
  );
}

export function Industries() {
  return (
    <div className="mt-10">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {INDUSTRY_LINKS.map((i) => (
          <li key={i.slug} className="border border-slate-600 bg-[#0F1B30] p-4">
            <h3 className="text-base font-semibold text-white"><Link href={`/industries/${i.slug}`} className="underline-offset-4 hover:underline">{i.name}</Link></h3>
            <ul className="mt-2 space-y-1">{i.services.map((s) => <li key={s.slug}><Link href={s.href} className="text-xs text-slate-300 hover:text-white">→ {s.name}</Link></li>)}</ul>
          </li>
        ))}
      </ul>
      <div className="mt-6"><Button href="/industries" variant="outline-light" arrow>Explore Industries</Button></div>
    </div>
  );
}

export function ServicesHubPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#0A1426] pb-16 pt-14 text-white sm:pb-24 sm:pt-20">
        <Container className="relative grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sky-300">Services</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">CAD &amp; Engineering Services</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">Mechanical, structural, architectural, civil and electrical drafting, plus BIM, CAD conversion and engineering design — scoped to your project and delivered in your native CAD format.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#explorer" size="lg" variant="outline-light">Explore Services</Button></div>
          </div>
          <ServiceNetwork />
        </Container>
      </section>

      <Paper id="intro">
        <Head eyebrow="Project lifecycle" heading="Technical Support Across the Project Lifecycle">
          <p>Render CAD Hub&apos;s services cover different stages and technical requirements — concept development, 3D modelling, drafting and documentation, BIM coordination, reality-to-BIM conversion, CAD conversion, manufacturing documentation, engineering design and visualisation.</p>
          <p>Not every project uses every service. Start from the discipline or the files you already have and pick the service that fits.</p>
        </Head>
      </Paper>

      <Paper id="explorer" tint>
        <Head eyebrow="Service explorer" heading="Explore Our Services" />
        <Reveal className="mt-10"><Explorer /></Reveal>
      </Paper>

      <Paper id="all">
        <Head eyebrow="All services" heading="Eight Disciplines, Every Service Linked" />
        <AllServices />
      </Paper>

      <Paper id="pathways" tint>
        <Head eyebrow="Connected services" heading="Services Connect When Projects Require More Than One Discipline" />
        <Pathways />
      </Paper>

      <Paper id="decide">
        <Head eyebrow="Find your service" heading="Not Sure Which Service Fits Your Project?" />
        <Reveal className="mt-10"><Decide /></Reveal>
        <div className="mt-6 flex flex-wrap items-center gap-4"><p className="text-sm text-slate-600">If you&apos;re unsure, send us the project requirements and we can review the scope.</p><Button href="/get-a-quote" arrow>Get a Free Quote</Button></div>
      </Paper>

      <Paper id="lifecycle" tint>
        <Head eyebrow="Lifecycle" heading="From Concept to Documentation" />
        <Lifecycle />
      </Paper>

      <Char id="io">
        <Head dark eyebrow="Inputs and outputs" heading="Start With What You Have" />
        <Reveal className="mt-10"><InputOutput /></Reveal>
      </Char>

      <Char id="software">
        <Head dark eyebrow="Software ecosystem" heading="Delivered in the Right Native Environment" />
        <Software />
      </Char>

      <Paper id="formats">
        <Head eyebrow="Native formats" heading="Delivered in the Format Your Project Requires" />
        <Formats />
      </Paper>

      <Char id="industries">
        <Head dark eyebrow="Industries" heading="Services Built Around Real Industry Workflows" />
        <Industries />
      </Char>

      <section className="border-t border-slate-800 bg-[#0A1426] py-20 text-white sm:py-24">
        <Container className="max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Have a Project in Mind?</h2>
          <p className="mt-4 text-lg text-slate-300">Tell us what you need and our team can review the project requirements.</p>
          <ol className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-sky-200">{["Brief", "CAD / BIM", "Documentation", "Delivery"].flatMap((s, k) => [k ? <li key={`a${s}`} aria-hidden className="text-copper-400">→</li> : null, <li key={s} className="border border-sky-300/40 px-3 py-1.5">{s}</li>])}</ol>
          <div className="mt-8 flex flex-wrap justify-center gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="/contact" size="lg" variant="outline-light">Discuss Your Project</Button></div>
        </Container>
      </section>
    </>
  );
}
