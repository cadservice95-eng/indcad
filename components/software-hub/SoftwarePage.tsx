import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/InView";
import { FAQ } from "@/components/FAQ";
import { Paper, Char, Head } from "@/components/arch/ui";
import { PlatformVisual } from "./visuals";
import { Workspace, Ecosystem, Explorer, Grid, Matrix, NativeFlow } from "./SwClient";
import { PLATFORMS, STEPS, SCENARIOS, FAQS } from "./config";

const name = (s: string) => PLATFORMS.find((p) => p.slug === s)!;

export function SoftwarePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#0B1220] pb-16 pt-14 text-white sm:pb-24 sm:pt-20">
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.05]"><defs><pattern id="sw-hero-g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#sw-hero-g)" /></svg>
        <Container className="relative grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sky-300">CAD / BIM software ecosystem</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">CAD &amp; BIM Platforms We Work In</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">We work in the platform your team already uses, and deliver native files ready to drop back into your workflow.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Get a Free Quote</Button><Button href="#explorer" size="lg" variant="outline-light">Explore Platforms</Button></div>
          </div>
          <div>
            <Workspace />
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">Your workflow stays familiar. The deliverables stay usable.</p>
          </div>
        </Container>
      </section>

      <Char id="ecosystem">
        <Head dark eyebrow="Platform ecosystem" heading="One Technical Workflow. Multiple Platforms.">
          <p>The platforms aren&apos;t isolated products. Each one sits inside a drafting, modelling, detailing or coordination workflow — select a platform to see where it fits.</p>
        </Head>
        <Reveal className="mt-10"><Ecosystem /></Reveal>
      </Char>

      <Paper id="explorer">
        <Head eyebrow="Software explorer" heading="Choose the Platform Behind Your Project">
          <p>Step through each platform&apos;s workflow, then open its page for the detail.</p>
        </Head>
        <Reveal className="mt-10"><Explorer /></Reveal>
      </Paper>

      <Paper id="platforms" tint>
        <Head eyebrow="All platforms" heading="Every Platform at a Glance" />
        <div className="mt-10"><Grid /></div>
      </Paper>

      <Paper id="capability">
        <Head eyebrow="Platform → service" heading="The Platform Is Only Part of the Workflow">
          <p>Software isn&apos;t the service. We use the relevant platform inside real project work — drafting, modelling, detailing, conversion and coordination. Each platform links to the services and industries it supports.</p>
        </Head>
        <Reveal className="mt-10"><Matrix /></Reveal>
      </Paper>

      <Char id="native">
        <Head dark eyebrow="Native files" heading="Keep Your Project in Its Native Environment">
          <p>Render CAD Hub works within the platform your project already uses and delivers files intended to fit back into the relevant project workflow. Share the platform and version up front so the set-up can be confirmed.</p>
        </Head>
        <Reveal className="mt-10"><NativeFlow /></Reveal>
      </Char>

      <Paper id="workflow" tint>
        <Head eyebrow="Process" heading="From Existing Platform to Finished Deliverable" />
        <ol className="mt-10 grid gap-3 md:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.t}><Reveal delay={i * 70} className="h-full"><div className="h-full border-t-2 border-blue-600 bg-white p-5"><span className="font-mono text-[11px] text-slate-400">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-2 text-base font-semibold text-slate-900">{s.t}</h3><p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.d}</p></div></Reveal></li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-slate-500">The steps flex with the service — review and output depend on the agreed scope.</p>
      </Paper>

      <Char id="scenarios">
        <Head dark eyebrow="Illustrative workflow examples" heading="Different Projects. Different Platforms.">
          <p>Three examples of how platforms combine on a project type. They illustrate workflows — they aren&apos;t client case studies.</p>
        </Head>
        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {SCENARIOS.map((c, i) => (
            <li key={c.k}><Reveal delay={i * 90} className="h-full"><article className="flex h-full flex-col border border-slate-700 bg-[#101A2E]">
              <PlatformVisual slug={c.visual} label={`${c.title}: illustrative workflow`} />
              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">Scenario {c.k}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{c.title}</h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.06em] text-slate-300">{c.flow.join(" → ")}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Platforms</p>
                <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">{c.platforms.map((s) => <li key={s}><Link href={`/software/${s}`} className="text-slate-100 underline-offset-4 hover:underline">{name(s).name}</Link></li>)}</ul>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Services</p>
                <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">{c.services.map((s) => <li key={s.href}><Link href={s.href} className="text-sky-300 underline-offset-4 hover:underline">{s.name}</Link></li>)}</ul>
              </div>
            </article></Reveal></li>
          ))}
        </ul>
      </Char>

      <FAQ items={FAQS} heading="Frequently Asked Questions" />

      <section className="border-t border-slate-800 bg-[#0B1220] py-20 text-white sm:py-24">
        <Container className="grid items-center gap-10 [&>*]:min-w-0 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Working in a Specific CAD or BIM Platform?</h2>
            <p className="mt-4 text-lg text-slate-300">Tell us what platform your project uses, what you need produced, and what files you already have.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Button href="/get-a-quote" size="lg" arrow>Request a Quote</Button><Button href="/services" size="lg" variant="outline-light">Explore Our Services</Button></div>
          </div>
          <ol className="mx-auto w-full max-w-xs font-mono text-[11px] uppercase tracking-[0.1em]" aria-label="How a project moves">
            {["Project file", "Platform", "Technical work", "Deliverable"].map((s, i, a) => <li key={s}><div className={i === a.length - 1 ? "border border-sky-300 bg-sky-300/10 px-4 py-3 text-white" : "border border-slate-600 px-4 py-3 text-slate-200"}>{s}</div>{i < a.length - 1 ? <span aria-hidden className="block py-1 text-center text-copper-400">↓</span> : null}</li>)}
          </ol>
        </Container>
      </section>
    </>
  );
}
