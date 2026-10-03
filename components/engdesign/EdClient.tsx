"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollStage } from "@/components/structural/useScrollStage";
import { chip } from "@/components/arch/ui";
import { DrawingSvg } from "@/components/pdfcad/PdfModel";
import { ConceptSvg, DfmPart, ProjectionSvg, CONCEPTS, DFM_INFO, E, mono, type ConceptId, type DfmHot, type ViewMode } from "./EdModel";

const css = (o: Record<string, string | number>) => o as React.CSSProperties;
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CONSTRAINTS = ["Function", "Envelope", "Weight", "Cost", "Manufacturing", "Lead time"];
const ROWS: { k: string; v: Record<ConceptId, string> }[] = [
  { k: "Cost", v: { A: "Moderate", B: "Higher", C: "Moderate" } }, { k: "Manufacturability", v: { A: "Moderate", B: "Moderate", C: "Easier" } },
  { k: "Lead time", v: { A: "Moderate", B: "Longer", C: "Shorter" } }, { k: "Performance", v: { A: "Solid", B: "Most rigid", C: "Adequate" } },
];

/** One stage of the design story, shared by the hero, the workspace, the process viewer and the scroll story. */
export function DesignStage({ stage, className }: { stage: number; className?: string }) {
  const grid = (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full text-sky-300/[0.07]"><defs><pattern id="ds-g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" /></pattern></defs><rect width="100%" height="100%" fill="url(#ds-g)" /></svg>
  );
  const tag = (t: string) => <p className="absolute left-3 top-3 z-10 border border-sky-300/50 bg-[#0B1220]/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-100">{t}</p>;
  const one = (c: ConceptId, mode: ViewMode, label: string, extra?: React.ReactNode) => (
    <>{tag(label)}<ConceptSvg c={c} mode={mode} title={`${CONCEPTS[c].name}: ${CONCEPTS[c].arch}`} className="relative block h-full w-full object-contain" />{extra}</>
  );
  let body: React.ReactNode = null;
  if (stage === 0) body = (
    <>{tag("Design brief")}
      <ul className="relative grid h-full grid-cols-2 content-center gap-2 p-6 sm:grid-cols-3 sm:p-10">{CONSTRAINTS.map((c, i) => <li key={c} className="fade-in border border-sky-300/40 bg-[#0B1B33]/80 px-3 py-3 font-mono text-xs uppercase tracking-[0.12em] text-sky-100" style={css({ "--d": `${i * 120}ms` })}>{c}</li>)}<li className="col-span-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400 sm:col-span-3">Illustrative constraints — every brief is different</li></ul></>
  );
  else if (stage === 1) body = one("A", "wire", "Concept A · sketch");
  else if (stage === 2) body = one("B", "wire", "Concept B");
  else if (stage === 3) body = one("C", "wire", "Concept C");
  else if (stage === 4) body = (
    <>{tag("Concepts compared")}
      <div className="relative grid h-full grid-rows-[1fr_auto] gap-2 p-3 pt-12">
        <div className="grid grid-cols-3 gap-2">{(["A", "B", "C"] as ConceptId[]).map((c) => <div key={c} className="border border-slate-600 bg-[#0B1B33]/70"><ConceptSvg c={c} title={CONCEPTS[c].name} className="block h-auto w-full" /><p className="px-2 pb-1 font-mono text-[9px] uppercase text-slate-300 sm:text-[10px]">{CONCEPTS[c].name}</p></div>)}</div>
        <table className="w-full border-collapse font-mono text-[9px] text-slate-200 sm:text-[10px]"><thead><tr className="text-slate-400"><th className="py-1 text-left font-normal">Illustrative</th>{["A", "B", "C"].map((c) => <th key={c} className="font-normal">{c}</th>)}</tr></thead><tbody>{ROWS.map((r) => <tr key={r.k} className="border-t border-slate-700"><td className="py-1">{r.k}</td>{(["A", "B", "C"] as ConceptId[]).map((c) => <td key={c} className="text-center">{r.v[c]}</td>)}</tr>)}</tbody></table>
      </div></>
  );
  else if (stage === 5) body = one("A", "shaded", "Selected concept", <p className="absolute bottom-3 right-3 border border-green-500/70 bg-[#0B1220]/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-green-400">● Direction selected (example)</p>);
  else if (stage === 6) body = one("A", "exploded", "Detailed design · assembly", <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 font-mono text-[9px] uppercase text-slate-200">{["Components", "Interfaces", "Mounting features", "Material callouts"].map((x) => <span key={x} className="border border-slate-500 bg-[#0B1220]/90 px-1.5 py-0.5">{x}</span>)}</div>);
  else if (stage === 7) body = (<>{tag("DFM review")}<DfmPart rev={false} hot={null} onHot={undefined} className="relative block h-full w-full object-contain" /><p className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.12em] text-amber-300">Issues flagged early, before production</p></>);
  else if (stage === 8) body = (
    <>{tag("Engineering documentation")}
      <div className="relative grid h-full grid-cols-3 gap-2 p-3 pt-12">
        {[["3D model", <ConceptSvg key="m" c="A" title="3D model" className="block h-auto w-full" />], ["Drawing", <ProjectionSvg key="d" className="block h-auto w-full" />], ["Specification", <div key="s" className="h-full space-y-1.5 bg-white p-3">{[90, 70, 85, 60, 80, 50].map((w, i) => <span key={i} className="block h-1.5 bg-slate-300" style={{ width: `${w}%` }} />)}</div>]].map(([t, el]) => <div key={t as string} className="overflow-hidden border border-slate-600 bg-[#0B1B33]/70">{el as React.ReactNode}<p className="px-2 py-1 font-mono text-[9px] uppercase text-slate-300 sm:text-[10px]">{t as string}</p></div>)}
      </div></>
  );
  else if (stage === 9) body = (
    <>{tag("Manufacturing handover package")}
      <ul className="relative grid h-full content-center gap-2 p-6 sm:grid-cols-2 sm:p-10">{["3D model", "Drawings", "Specification", "Revision log", "Manufacturing notes"].map((f, i) => <li key={f} className="fade-in flex items-center gap-3 border border-sky-300/40 bg-[#0B1B33]/80 px-3 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-sky-100" style={css({ "--d": `${i * 120}ms` })}><span aria-hidden className="text-green-400">✓</span>{f}</li>)}</ul></>
  );
  else if (stage === 10) body = one("A", "shaded", "Concept A · developed");
  else if (stage === 11) body = one("B", "shaded", "Concept B · developed");
  else body = one("C", "shaded", "Concept C · developed");
  return (
    <div key={stage} data-in="true" className={cn("relative overflow-hidden border border-sky-300/25 bg-[#0B1220]", className)}>
      {grid}<div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">{body}</div>
    </div>
  );
}

/* ───────── hero ───────── */

const HCH: [string, number][] = [["Brief", 0], ["Concepts", 3], ["Compare", 4], ["Selected", 5], ["Detail", 6], ["DFM", 7], ["Docs", 8]];
export function HeroEd() {
  const [s, setS] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    if (reduced()) { const t = setTimeout(() => setS(8), 0); return () => clearTimeout(t); }
    const t = setTimeout(() => setS((v) => (v >= 8 ? 0 : v + 1)), s === 8 ? 3600 : s === 0 ? 2400 : 2100);
    return () => clearTimeout(t);
  }, [s, auto]);
  const cur = s >= 1 && s <= 3 ? 3 : s;
  return (
    <div>
      <DesignStage stage={s} className="shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]" />
      <div className="mt-3">
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-300">Design stage</p>
        <div role="group" aria-label="Design stage" className="flex gap-2 overflow-x-auto pb-1">{HCH.map(([l, v]) => <button key={l} type="button" aria-pressed={cur === v} onClick={() => { setAuto(false); setS(v === 3 ? 1 : v); }} className={cn(chip(cur === v, true), "shrink-0")}>{l}</button>)}</div>
      </div>
    </div>
  );
}

/* ───────── workspace ───────── */

const WS: [string, number, string][] = [["Brief", 0, "Constraints and requirements are written down first."], ["Concepts", 4, "Genuinely different directions, compared on honest trade-offs."], ["Detailed design", 6, "The selected concept becomes a detailed, modelled assembly."], ["DFM", 7, "Manufacturing issues are reviewed while they're still cheap to change."], ["Documentation", 8, "Model, drawing and specification are issued together."]];
export function Workspace() {
  const [i, setI] = useState(1);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[220px_1fr]">
      <div className="space-y-3">
        <div role="tablist" aria-label="Design stage" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">{WS.map(([l], k) => <button key={l} role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} className={cn(chip(i === k), "shrink-0 text-left")}>{String(k + 1).padStart(2, "0")} · {l}</button>)}</div>
        <p aria-live="polite" className="border-l-2 border-blue-600 bg-white px-4 py-3 text-sm text-slate-700">{WS[i][2]}</p>
      </div>
      <DesignStage stage={WS[i][1]} />
    </div>
  );
}

/* ───────── trade-off matrix ───────── */

const EXPL: Record<ConceptId, string> = { A: "A fabricated frame uses familiar processes and is straightforward to adjust, at the cost of more joined parts.", B: "A machined block gives a stiff, single-piece structure, with more material and machining time.", C: "A modular sheet-metal build suits repeat production and quick assembly, with more care needed on stiffness." };
export function TradeOff() {
  const [c, setC] = useState<ConceptId>("A");
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.2fr_1fr]">
      <div className="overflow-hidden border border-slate-300 bg-white">
        <div className="grid grid-cols-[1.1fr_repeat(3,1fr)] border-b border-slate-300 bg-slate-50 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-600">
          <span className="px-3 py-2">Illustrative</span>
          {(["A", "B", "C"] as ConceptId[]).map((k) => <button key={k} type="button" aria-pressed={c === k} onClick={() => setC(k)} onPointerEnter={() => setC(k)} onFocus={() => setC(k)} className={cn("border-l border-slate-200 px-2 py-2 transition-colors", c === k ? "bg-blue-600 text-white" : "hover:bg-slate-100")}>{CONCEPTS[k].name}</button>)}
        </div>
        {ROWS.map((r) => (
          <div key={r.k} className="grid grid-cols-[1.1fr_repeat(3,1fr)] border-b border-slate-100 text-sm last:border-0">
            <span className="px-3 py-3 font-medium text-slate-900">{r.k}</span>
            {(["A", "B", "C"] as ConceptId[]).map((k) => <span key={k} className={cn("border-l border-slate-100 px-2 py-3 text-center transition-colors", c === k ? "bg-blue-50 font-semibold text-blue-900" : "text-slate-600")}>{r.v[k]}</span>)}
          </div>
        ))}
        <p className="px-3 py-2 text-[11px] text-slate-500">Example values to show how options are compared — not data, and there is no winner score.</p>
      </div>
      <div className="space-y-3">
        <div className="border border-slate-600 bg-[#0B1220]"><ConceptSvg c={c} title={`${CONCEPTS[c].name}: ${CONCEPTS[c].arch}`} className="block h-auto w-full" /></div>
        <p aria-live="polite" className="text-sm leading-relaxed text-slate-700"><strong className="text-slate-900">{CONCEPTS[c].name} · {CONCEPTS[c].arch}.</strong> {EXPL[c]}</p>
      </div>
    </div>
  );
}

/* ───────── DFM ───────── */

export function Dfm() {
  const [rev, setRev] = useState(false);
  const [hot, setHot] = useState<DfmHot | null>("access");
  const h = hot ? DFM_INFO[hot] : null;
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <div className="overflow-hidden border border-sky-300/25 bg-[#0B1220]"><DfmPart rev={rev} hot={rev ? null : hot} onHot={rev ? undefined : setHot} className="block h-auto w-full" /></div>
      <div className="space-y-4">
        <div role="group" aria-label="Design version" className="flex gap-2"><button type="button" aria-pressed={!rev} onClick={() => setRev(false)} className={chip(!rev, true)}>Design model</button><button type="button" aria-pressed={rev} onClick={() => setRev(true)} className={chip(rev, true)}>Revised design</button></div>
        {!rev ? (
          <>
            <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">{(Object.keys(DFM_INFO) as DfmHot[]).map((k, i) => <li key={k}><button type="button" aria-pressed={hot === k} onClick={() => setHot(k)} className={cn("flex w-full items-center gap-3 border px-3 py-2 text-left text-sm transition-colors", hot === k ? "border-amber-400 bg-amber-400/10 text-white" : "border-slate-700 text-slate-300")}><span className="grid h-5 w-5 place-items-center border border-amber-400 font-mono text-[10px] text-amber-300">{i + 1}</span>{DFM_INFO[k].t}</button></li>)}</ul>
            {h ? <p aria-live="polite" className="border-l-2 border-amber-400 px-4 py-2 text-sm text-slate-200"><strong className="block text-white">{h.t}</strong>{h.before}</p> : null}
          </>
        ) : <p aria-live="polite" className="border-l-2 border-green-500 px-4 py-2 text-sm text-slate-200"><strong className="block text-white">Revised</strong>{h ? h.after : "Access, features, assembly, wall thickness and corners are reworked to suit manufacture."}</p>}
        <p className="text-xs text-slate-400">DFM review helps identify manufacturing issues early. It doesn&apos;t promise a particular cost saving.</p>
      </div>
    </div>
  );
}

/* ───────── rationale timeline ───────── */

const RAT = [
  ["Requirement", "Why does the product need this feature?"], ["Constraint", "What limited the available options?"], ["Concept", "Which directions were explored?"], ["Review", "How were they compared?"],
  ["Decision", "Why was this direction selected?"], ["Detail", "Which choices shaped the detailed design?"], ["Documentation", "What is recorded alongside the drawings?"],
];
export function Rationale() {
  const [i, setI] = useState(4);
  return (
    <div>
      <ol className="grid gap-1.5 sm:grid-cols-4 lg:grid-cols-7">{RAT.map(([t], k) => <li key={t}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("relative w-full border px-2 py-3 text-left text-sm transition-colors", i === k ? "border-blue-600 bg-blue-600 text-white" : k < i ? "border-slate-400 bg-white text-slate-700" : "border-slate-300 bg-white text-slate-500")}><span className="font-mono text-[10px] opacity-70">{String(k + 1).padStart(2, "0")}</span><span className="block font-semibold">{t}</span></button></li>)}</ol>
      <div key={i} data-in="true" className="fade-in mt-4 grid gap-4 [&>*]:min-w-0 md:grid-cols-[1fr_1.3fr]">
        <div className="overflow-hidden border border-slate-600 bg-[#0B1220]">{i <= 1 ? <div className="grid aspect-[4/3] place-items-center p-6 font-mono text-xs uppercase tracking-[0.12em] text-sky-100">{i === 0 ? "Requirement → feature" : "Constraint → options narrow"}</div> : i === 2 || i === 3 ? <DesignStage stage={4} className="border-0" /> : i === 4 ? <ConceptSvg c="A" title="Selected direction" className="block h-auto w-full" /> : i === 5 ? <ConceptSvg c="A" mode="exploded" title="Detailed design" className="block h-auto w-full" /> : <div className="bg-white p-3"><ProjectionSvg className="block h-auto w-full" /></div>}</div>
        <div className="border border-slate-300 bg-white p-5"><p className="font-mono text-xs tracking-[0.16em] text-blue-700">{String(i + 1).padStart(2, "0")} / 07</p><h3 className="mt-1 text-xl font-semibold text-slate-900">{RAT[i][0]}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{RAT[i][1]} Where it&apos;s genuinely useful, this reasoning is captured alongside the drawings so it doesn&apos;t disappear when the project moves to production.</p></div>
      </div>
    </div>
  );
}

/* ───────── value engineering ───────── */

const PRI = ["Function", "Performance", "Manufacturability", "Cost", "Lead time"];
const ADJ: Record<string, string> = { Function: "Keep: the design must still do the job.", Performance: "Keep: don't quietly degrade it.", Manufacturability: "Review: simplify features that are hard to make.", Cost: "Review: where can cost change without touching the priorities?", "Lead time": "Review: materials and processes that shorten supply." };
export function ValueEng() {
  const [crit, setCrit] = useState<string[]>(["Function", "Performance"]);
  const tog = (p: string) => setCrit((c) => (c.includes(p) ? c.filter((x) => x !== p) : [...c, p]));
  return (
    <div className="grid gap-5 [&>*]:min-w-0 md:grid-cols-2">
      <div><p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-300">Mark what is critical to this design</p>
        <ul className="space-y-1.5">{PRI.map((p) => <li key={p}><button type="button" role="switch" aria-checked={crit.includes(p)} onClick={() => tog(p)} className={cn("flex w-full items-center justify-between border px-4 py-3 text-left text-sm transition-colors", crit.includes(p) ? "border-sky-300 bg-sky-300/10 text-white" : "border-slate-600 text-slate-300")}>{p}<span className="font-mono text-[10px] uppercase">{crit.includes(p) ? "Critical" : "Flexible"}</span></button></li>)}</ul></div>
      <div><p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-300">What that means for the review</p>
        <ul aria-live="polite" className="space-y-1.5">{PRI.map((p) => <li key={p} className={cn("border px-4 py-3 text-sm transition-colors", crit.includes(p) ? "border-green-500/60 text-slate-100" : "border-amber-400/60 text-slate-200")}>{crit.includes(p) ? `Protect · ${p}` : `Evaluate · ${p}`}<span className="mt-0.5 block text-xs text-slate-400">{ADJ[p]}</span></li>)}</ul>
        <p className="mt-3 text-xs text-slate-400">The goal is to evaluate where cost can change without compromising what matters — no saving is promised.</p></div>
    </div>
  );
}

/* ───────── detailed design / CAD viewer ───────── */

const DSTEP = ["Concept geometry", "Major components", "Assembly relationships", "Detailed features", "Manufacturing considerations", "Engineering documentation"];
const DMODE: [ViewMode, string][] = [["shaded", "Isometric"], ["wire", "Wireframe"], ["exploded", "Exploded"], ["section", "Section"]];
export function Detailed() {
  const [i, setI] = useState(2);
  const [m, setM] = useState<ViewMode | null>(null);
  const [c, setC] = useState<ConceptId>("A");
  const mode: ViewMode = m ?? (i === 0 ? "wire" : i === 2 ? "exploded" : "shaded");
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <div role="group" aria-label="View mode" className="mb-2 flex gap-2 overflow-x-auto pb-1">{DMODE.map(([k, l]) => <button key={k} type="button" aria-pressed={mode === k} onClick={() => setM(k)} className={cn(chip(mode === k, true), "shrink-0")}>{l}</button>)}</div>
        <div className="relative overflow-hidden border border-sky-300/25 bg-[#0B1220]"><ConceptSvg c={c} mode={mode} title={`${CONCEPTS[c].name} shown as ${mode}`} className="block h-auto w-full" />
          {i === 3 ? <p className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-[0.12em] text-sky-200">Dimensions · interfaces · mounting features</p> : null}
          {i === 4 ? <p className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-[0.12em] text-amber-300">Manufacturing considered throughout</p> : null}
          {i === 5 ? <div className="absolute bottom-2 right-2 w-32 border border-slate-400 bg-white p-1"><ProjectionSvg className="block h-auto w-full" /></div> : null}
        </div>
        <div role="group" aria-label="Concept" className="mt-2 flex gap-2">{(["A", "B", "C"] as ConceptId[]).map((k) => <button key={k} type="button" aria-pressed={c === k} onClick={() => setC(k)} className={chip(c === k, true)}>{CONCEPTS[k].name}</button>)}</div>
      </div>
      <div className="space-y-3">
        <ol className="space-y-1.5">{DSTEP.map((s, k) => <li key={s}><button type="button" aria-pressed={i === k} onClick={() => { setI(k); setM(null); }} className={cn("flex w-full items-center gap-3 border px-3 py-2.5 text-left text-sm transition-colors", i === k ? "border-sky-300 bg-sky-300/10 text-white" : k < i ? "border-slate-600 text-slate-300" : "border-slate-700 text-slate-500")}><span className="font-mono text-[10px] opacity-70">{String(k + 1).padStart(2, "0")}</span>{s}</button></li>)}</ol>
        <p className="text-xs text-slate-400">Illustrative models. No engineering calculations are implied unless they are part of the agreed scope.</p>
      </div>
    </div>
  );
}

/* ───────── design → drafting ───────── */

const DISC = [["mech", "Mechanical", "Fabrication drawings for the selected design."], ["struct", "Structural", "Framing and detailing documentation."], ["civil", "Civil", "Site and infrastructure documentation."], ["elec", "Electrical", "Panel and circuit documentation."]] as const;
export function DraftFlow() {
  const [i, setI] = useState(0);
  const d = DISC[i];
  return (
    <div>
      <ol className="mb-5 grid gap-2 sm:grid-cols-4">{["Engineering design", "3D model", "Discipline documentation", "Manufacturing / construction handover"].map((t, k) => <li key={t} className={cn("flex items-center gap-2 border px-3 py-2.5 text-sm font-semibold", k === 2 ? "border-blue-600 bg-white text-slate-900" : "border-slate-300 bg-white text-slate-700")}><span className="font-mono text-[10px] text-slate-400">{k + 1}</span>{t}</li>)}</ol>
      <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden border border-slate-600 bg-[#0B1220]"><div key={d[0]} data-in="true" className="fade-in"><DrawingSvg disc={d[0]} mode="cad" title={`Illustrative ${d[1].toLowerCase()} documentation`} className="block h-auto w-full" /></div></div>
        <div className="space-y-4">
          <div role="tablist" aria-label="Discipline" className="flex gap-2 overflow-x-auto pb-1">{DISC.map(([k, l], j) => <button key={k} role="tab" type="button" aria-selected={i === j} onClick={() => setI(j)} className={cn(chip(i === j), "shrink-0")}>{l}</button>)}</div>
          <p className="border-l-2 border-blue-600 bg-white px-4 py-3 text-sm text-slate-700"><strong className="block text-slate-900">{d[1]}</strong>{d[2]} Design can move into fabrication-ready documentation without a handover gap.</p>
          <p className="text-xs text-slate-500">Not every engineering design project needs every discipline.</p>
        </div>
      </div>
    </div>
  );
}

/* ───────── documentation handover ───────── */

const DOCS = ["3D model", "Drawing", "Specification"];
export function DocHandover() {
  const [i, setI] = useState(1);
  return (
    <div>
      <ol className="mb-5 grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
        {[["Engineering team", ["Design intent"]], ["Documentation", ["Drawings", "Models", "Specifications"]], ["Production", ["Build"]]].flatMap(([t, p], k) => [
          <li key={t as string} className={cn("border p-4", k === 1 ? "border-blue-600 bg-white" : "border-slate-300 bg-white")}><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{t as string}</p><ul className="mt-1 text-sm font-semibold text-slate-900">{(p as string[]).map((x) => <li key={x}>{x}</li>)}</ul></li>,
          k < 2 ? <li key={`a${k}`} aria-hidden className="grid place-items-center font-mono text-xl text-copper-500 max-md:rotate-90">→</li> : null,
        ])}
      </ol>
      <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden border border-slate-600 bg-[#0B1220]"><div key={i} data-in="true" className="fade-in">{i === 0 ? <ConceptSvg c="A" title="3D model" className="block h-auto w-full" /> : i === 1 ? <div className="bg-white p-4"><ProjectionSvg className="mx-auto block h-auto w-full max-w-lg" /></div> : <div className="space-y-2 bg-white p-6">{["Scope and purpose", "Materials and finishes", "Fabrication notes", "Revision: A — issued for production", "Manufacturing notes"].map((l) => <p key={l} className="border-b border-slate-200 pb-2 font-mono text-xs text-slate-700">{l}</p>)}</div>}</div></div>
        <div className="space-y-4"><div role="tablist" aria-label="Document" className="flex gap-2 overflow-x-auto pb-1">{DOCS.map((d, k) => <button key={d} role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} className={cn(chip(i === k), "shrink-0")}>{d}</button>)}</div>
          <p className="text-sm text-slate-600">Documentation is written for the production team that will use it — revision, manufacturing notes and specification included — so builders don&apos;t need constant clarification calls back to engineering.</p></div>
      </div>
    </div>
  );
}

/* ───────── process viewer ───────── */

const PST = [0, 99, 4, 6, 8];
export function ProcessEd({ steps }: { steps: { title: string; description: string }[] }) {
  const [i, setI] = useState(2);
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1fr_1.4fr]">
      <ol className="space-y-1.5">{steps.map((s, k) => <li key={s.title}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("block w-full border p-4 text-left transition-colors", i === k ? "border-blue-600 bg-white" : "border-slate-300 hover:border-slate-900")}><span className="font-mono text-[10px] text-slate-500">{String(k + 1).padStart(2, "0")}</span><span className="block text-base font-semibold uppercase tracking-tight text-slate-900">{s.title}</span><span className={cn("mt-1 block text-sm text-slate-600 transition-[max-height,opacity] duration-500 lg:overflow-hidden", i === k ? "max-h-40 opacity-100" : "max-h-0 opacity-0 lg:max-h-0")}>{s.description}</span></button></li>)}</ol>
      {PST[i] === 99 ? (
        <div className="grid content-center gap-3 border border-slate-600 bg-[#0B1220] p-6 sm:grid-cols-2">{[["Concept only", ["Concept options", "Trade-offs", "Review"]], ["Concept to documentation", ["Concept options", "Detailed design", "DFM review", "Engineering documentation"]]].map(([t, l]) => <div key={t as string} className="border border-sky-300/40 p-4"><p className="font-mono text-[11px] uppercase tracking-[0.12em] text-sky-200">{t as string}</p><ul className="mt-2 space-y-1 text-sm text-slate-200">{(l as string[]).map((x) => <li key={x}>• {x}</li>)}</ul></div>)}<p className="text-xs text-slate-400 sm:col-span-2">Very different scopes — agreed before starting.</p></div>
      ) : <DesignStage stage={PST[i]} />}
    </div>
  );
}

/* ───────── scroll story ───────── */

const SMAP = [0, 1, 10, 11, 12, 4, 6, 7, 8, 9];
const SCAP = ["A problem exists", "Requirements become a first sketch", "Concept A develops", "Concept B takes a different direction", "Concept C takes a third", "Trade-offs are compared", "The selected concept gets detailed", "DFM review highlights features", "Documentation emerges", "A manufacturing handover package is issued"];
export function ScrollStory() {
  const { ref, stage } = useScrollStage(SMAP.length);
  return (
    <div ref={ref} style={css({ "--p": 0 })} className="relative lg:h-[420vh]">
      <div className="relative py-16 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
        <div className="grid w-full items-center gap-6 [&>*]:min-w-0 lg:grid-cols-[1fr_1.4fr] lg:gap-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Watch a design mature</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">From a Problem to a Production-Ready Package</h2>
            <ol className="relative mt-6 space-y-1 border-l border-slate-600 pl-5" aria-label="Story steps">
              <span aria-hidden className="absolute -left-px top-0 w-px origin-top bg-copper-500" style={{ height: "100%", transform: "scaleY(var(--p))" }} />
              {SCAP.map((c, k) => <li key={c} className={cn("text-sm transition-opacity duration-500", k === stage ? "text-white opacity-100" : "text-slate-400 opacity-50")}><span className="mr-2 font-mono text-[10px]">{String(k + 1).padStart(2, "0")}</span>{c}</li>)}
            </ol>
          </div>
          <DesignStage stage={SMAP[stage]} />
        </div>
      </div>
    </div>
  );
}

/* ───────── CTA ───────── */

export function CtaEd() {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver((e) => {
      if (!e.some((x) => x.isIntersecting)) return;
      ob.disconnect();
      if (reduced()) { setS(8); return; }
      [10, 6, 8].forEach((v, k) => setTimeout(() => setS(v), 900 + k * 1500));
    }, { threshold: 0.3 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return <div ref={ref}><DesignStage stage={s} /></div>;
}

export { E, mono };
