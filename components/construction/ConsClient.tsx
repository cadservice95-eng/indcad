"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollStage } from "@/components/structural/useScrollStage";
import { chip } from "@/components/arch/ui";
import { PlanSvg } from "@/components/arch/Drawing";
import { BimModel, ClashPair, ALL_LAYERS, COL, mono, type Layers } from "@/components/bim/Model";

const css = (o: Record<string, string | number>) => o as React.CSSProperties;
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Panel({ children, label, className }: { children: React.ReactNode; label?: string; className?: string }) {
  return (
    <figure className={cn("overflow-hidden border border-sky-300/25 bg-[#0B1B33] shadow-[0_24px_50px_-28px_rgba(0,0,0,0.8)]", className)}>
      {children}
      {label ? <figcaption className="border-t border-sky-300/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-200/80">{label}</figcaption> : null}
    </figure>
  );
}

/* ───────── hero: control room ───────── */

type Tog = { arch: boolean; struct: boolean; mep: boolean; steel: boolean; services: boolean };
const TOGS: { k: keyof Tog; l: string }[] = [{ k: "arch", l: "ARCH" }, { k: "struct", l: "STRUCT" }, { k: "mep", l: "MEP" }, { k: "steel", l: "STEEL" }, { k: "services", l: "SERVICES" }];
const HS = ["Building grid", "Structural frame", "Architectural envelope", "MEP routes", "Steel package", "Clash marker", "Issue highlighted", "Coordination resolves", "Coordinated model", "Documentation sheets"];
const fromStage = (s: number): Tog => ({ arch: s >= 2, struct: s >= 1, mep: s >= 3, steel: s >= 4, services: s >= 3 });
const toLayers = (t: Tog): Layers => ({ arch: t.arch, struct: t.struct, mech: t.mep, elec: t.mep, plumb: t.services });

export function HeroCons() {
  const [s, setS] = useState(0);
  const [manual, setManual] = useState<Tog | null>(null);
  useEffect(() => {
    if (manual) return;
    if (reduced()) { const t = setTimeout(() => setS(8), 0); return () => clearTimeout(t); }
    const t = setTimeout(() => setS((v) => (v >= 9 ? 0 : v + 1)), s === 9 ? 4000 : s === 0 ? 1800 : 1700);
    return () => clearTimeout(t);
  }, [s, manual]);
  const tog = manual ?? fromStage(s);
  const clash = !manual && s >= 5 && s <= 6 ? "open" : !manual && s >= 7 ? "resolved" : "off";
  return (
    <div className="overflow-hidden border border-sky-300/25 bg-[#101A2E] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-slate-700 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400"><span>Coordination environment · illustrative</span><span className="text-sky-300">{manual ? "Manual layers" : `${String(s + 1).padStart(2, "0")} · ${HS[s]}`}</span></div>
      <div className="grid [&>*]:min-w-0 lg:grid-cols-[1fr_150px]">
        <div className="relative">
          <BimModel layers={toLayers(tog)} steel={tog.steel} clash={clash} focus={clash === "open" && s >= 6 ? "BIM-001" : null} labels={false} title="A multi-storey building in a BIM view with architectural, structural, MEP, steel and services layers" className="block h-auto w-full" />
          {!manual && s === 9 ? <div className="absolute inset-x-3 bottom-3 grid grid-cols-3 gap-2" aria-hidden>{["Drawing set", "Steel package", "MEP package"].map((t) => <div key={t} className="fade-in border border-sky-300/50 bg-[#0B1220]/90 px-2 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-sky-100">{t}<span className="mt-1 block h-1 bg-slate-600" /></div>)}</div> : null}
          {!manual && (s === 5 || s === 6) ? <p className="absolute left-3 top-3 border border-orange-500/70 bg-[#0B1220]/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-orange-300">Coordination issue</p> : null}
          {!manual && s === 7 ? <p className="absolute left-3 top-3 border border-green-500/70 bg-[#0B1220]/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-green-400">Reviewed · resolved</p> : null}
        </div>
        <div className="border-t border-slate-700 p-3 lg:border-l lg:border-t-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-sky-300">Layers</p>
          <div className="mt-2 flex flex-wrap gap-1.5 lg:flex-col" role="group" aria-label="Model layers">
            {TOGS.map((t) => <button key={t.k} type="button" role="switch" aria-checked={tog[t.k]} onClick={() => setManual({ ...tog, [t.k]: !tog[t.k] })} className={cn("flex min-h-[36px] items-center gap-2 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors", tog[t.k] ? "border-sky-300/70 text-sky-100" : "border-slate-600 text-slate-500")}><span aria-hidden className="grid h-3 w-3 place-items-center border border-current text-[8px]">{tog[t.k] ? "✓" : ""}</span>{t.l}</button>)}
          </div>
          {manual ? <button type="button" onClick={() => { setManual(null); setS(0); }} className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300 underline underline-offset-4 hover:text-white">Replay sequence</button> : null}
        </div>
      </div>
    </div>
  );
}

/* ───────── project model (signature) ───────── */

const PM = [
  { k: "Architectural", layers: { arch: true } as Layers, x: {} },
  { k: "Structural", layers: { struct: true } as Layers, x: {} },
  { k: "MEP", layers: { mech: true, elec: true, plumb: true } as Layers, x: {} },
  { k: "Steel", layers: { struct: true } as Layers, x: { steel: true } },
  { k: "Precast", layers: { struct: true, arch: true } as Layers, x: { precast: true } },
  { k: "Shop drawings", layers: { struct: true } as Layers, x: { steel: true } },
  { k: "Tender", layers: { arch: true, struct: true } as Layers, x: {} },
  { k: "As-built", layers: ALL_LAYERS, x: { shift: 1 } },
] as { k: string; layers: Layers; x: { steel?: boolean; precast?: boolean; shift?: number } }[];

export function ProjectModel() {
  const [i, setI] = useState(1);
  const m = PM[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label={`Construction project · ${m.k}`}><BimModel layers={m.layers} faint {...m.x} labels={false} title={`The project model with the ${m.k} layer emphasised`} className="block h-auto w-full" /></Panel>
      <div className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-300">One project · many documents</p>
        <ul className="grid grid-cols-2 gap-2">{PM.map((x, k) => <li key={x.k}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn(chip(i === k, true), "w-full text-left")}>{x.k}</button></li>)}</ul>
        <p className="text-sm text-slate-300">Each package is a view into the same building — which is why a change in one is a question for the others.</p>
      </div>
    </div>
  );
}

/* ───────── coordination as deliverable ───────── */

const CT = [
  ["Architectural", { arch: true, struct: true } as Layers, ["Ceiling zone", "Steel beam", "MEP duct"]],
  ["Structural", { struct: true, mech: true } as Layers, ["Beam depth", "Duct route", "Opening location"]],
  ["MEP", { mech: true, elec: true, plumb: true, struct: true } as Layers, ["Duct", "Pipe", "Beam"]],
  ["Steel", { struct: true, mech: true } as Layers, ["Connection plate", "Service route", "Access zone"]],
  ["Precast", { struct: true, arch: true } as Layers, ["Fixing point", "Structural frame", "Façade line"]],
] as const;
export function CoordTabs() {
  const [i, setI] = useState(0);
  const [stage, setStage] = useState(0);
  const t = CT[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label={`${t[0]} package and its neighbours`}><BimModel layers={t[1]} steel={t[0] === "Steel"} precast={t[0] === "Precast"} clash={stage === 0 ? "open" : stage === 2 ? "resolved" : "off"} focus={stage === 0 ? "BIM-001" : null} labels={false} title={`The ${t[0]} package alongside the packages it must coordinate with`} className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <div role="tablist" aria-label="Package" className="flex gap-2 overflow-x-auto pb-1">{CT.map((x, k) => <button key={x[0]} role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} className={cn(chip(i === k, true), "shrink-0")}>{x[0]}</button>)}</div>
        <p className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-200">{t[2].map((x, k) => <span key={x} className="flex items-center gap-1.5"><span className="border border-slate-600 px-2 py-1">{x}</span>{k < 2 ? <span aria-hidden className="text-amber-400">+</span> : <span aria-hidden className="text-amber-400">=</span>}</span>)}<span className="border border-orange-500/70 px-2 py-1 text-orange-300">Potential issue</span></p>
        <ol className="space-y-1.5">{["Issue identified", "Coordination review", "Updated model / documentation"].map((x, k) => <li key={x}><button type="button" aria-pressed={stage === k} onClick={() => setStage(k)} className={cn("flex w-full items-center gap-3 border px-3 py-2.5 text-left text-sm transition-colors", stage === k ? "border-sky-300 bg-sky-300/10 text-white" : "border-slate-700 text-slate-400")}><span className="font-mono text-[10px]">{k + 1}</span>{x}</button></li>)}</ol>
        <p className="text-xs text-slate-400">Coordination is a review by people — nothing here resolves automatically.</p>
      </div>
    </div>
  );
}

/* ───────── clash + hard/soft ───────── */

export function ClashVisual() {
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <Panel label="Structural beam · duct · pipe · ceiling zone"><BimModel layers={{ struct: true, mech: true, plumb: true, arch: true }} faint clash="open" focus="BIM-001" labels={false} title="A BIM model with one highlighted coordination issue between a beam and a duct" className="block h-auto w-full" /></Panel>
      <dl className="self-start border bg-[#0B1B33] text-sm" style={{ borderColor: COL.clash }}>
        <div className="border-b border-slate-700 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: COL.clash }}>Coordination issue</div>
        {[["Issue", "Beam intersects duct"], ["Location", "Illustrative"], ["Discipline A", "Structure"], ["Discipline B", "MEP"], ["Status", "Open"]].map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-b border-slate-700 px-4 py-2 last:border-0"><dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">{k}</dt><dd className="text-white">{v}</dd></div>)}
        <p className="px-4 py-2 text-[11px] text-slate-400">Illustrative data — not a project record.</p>
      </dl>
    </div>
  );
}

export function HardSoft() {
  const [k, setK] = useState<"hard" | "soft">("hard");
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.2fr_1fr]">
      <Panel label={k === "hard" ? "Hard clash" : "Clearance / coordination issue"}><ClashPair kind={k} title={k === "hard" ? "A beam intersecting a duct" : "A duct occupying a required access or service zone"} className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <div role="group" aria-label="Issue type" className="flex gap-2"><button type="button" aria-pressed={k === "hard"} onClick={() => setK("hard")} className={chip(k === "hard", true)}>Hard clash</button><button type="button" aria-pressed={k === "soft"} onClick={() => setK("soft")} className={chip(k === "soft", true)}>Clearance issue</button></div>
        <p aria-live="polite" className="border-l-2 border-sky-300 px-4 py-2 text-sm text-slate-200">{k === "hard" ? "Geometry literally intersects — a beam through a duct." : "Nothing intersects, but a duct sits in space needed for access or servicing."}</p>
        <p className="text-sm text-slate-400">Coordination isn&apos;t only about geometry touching. Not every issue can be found automatically.</p>
      </div>
    </div>
  );
}

/* ───────── change + revisions ───────── */

const REV = [
  { r: "REV A", n: "Original issue", rev: 0 }, { r: "REV B", n: "Structural opening revised", rev: 3 }, { r: "REV C", n: "Services route updated · client variation incorporated", rev: 3 }, { r: "CURRENT", n: "Latest issue — the one to build from", rev: 3 },
];
export function ChangeRevision() {
  const [i, setI] = useState(1);
  const r = REV[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <div className="overflow-hidden border border-slate-300 bg-white"><div className="flex justify-between border-b border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600"><span>{r.r}</span><span>{i === 3 ? "Current" : i < 3 ? "Superseded by later issue" : ""}</span></div><PlanSvg rev={r.rev} layers={{ marks: false }} title={`Plan at ${r.r}`} className="block h-auto w-full" /></div>
      <div className="space-y-4">
        <ol className="space-y-1.5" aria-label="Revisions">{REV.map((x, k) => <li key={x.r}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn(chip(i === k), "flex w-full items-center justify-between text-left")}><span>{x.r}</span>{k === 3 ? <span className="text-[10px] opacity-80">Use this</span> : null}</button></li>)}</ol>
        <p aria-live="polite" className="border-l-2 border-blue-600 bg-white px-4 py-3 text-sm text-slate-700"><strong className="block text-slate-900">Revision note · illustrative</strong>{r.n}</p>
        <p className="text-sm text-slate-600">Substitutions, site conditions and client variations all change the drawings — the current information has to stay identifiable.</p>
      </div>
    </div>
  );
}

/* ───────── delivery models ───────── */

const DM = [
  ["Design-bid-build", ["Tender documentation", "Construction documentation", "Specialist packages"]],
  ["Design-and-construct", ["Rapid design development", "Documentation that absorbs change", "Construction coordination"]],
  ["BIM-mandated / public infrastructure", ["Formal documentation", "Agreed standards", "Audit requirements", "Structured coordination"]],
] as const;
export function DeliveryModels() {
  const [i, setI] = useState(0);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 md:grid-cols-[1fr_1.4fr]">
      <ul className="space-y-2">{DM.map(([t], k) => <li key={t}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("block w-full border px-4 py-4 text-left text-base font-semibold transition-colors", i === k ? "border-blue-600 bg-white text-slate-900" : "border-slate-300 text-slate-600 hover:border-slate-900")}><span className="mr-2 font-mono text-[10px] text-slate-400">{k + 1}</span>{t}</button></li>)}</ul>
      <div key={i} data-in="true" className="fade-in border border-slate-300 bg-white p-6"><p className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue-700">Focus</p><ul className="mt-3 space-y-2">{DM[i][1].map((x, k) => <li key={x} className="flex items-center gap-3 border border-slate-200 px-3 py-2.5 text-sm text-slate-800"><span aria-hidden className="font-mono text-xs text-slate-400">{k + 1}</span>{x}</li>)}</ul><p className="mt-4 text-xs text-slate-500">Each model carries slightly different documentation demands; not every project follows these exact workflows.</p></div>
    </div>
  );
}

/* ───────── subcontractor packages ───────── */

const SP = [["Structural steel", "Steel frame + connections", "steel"], ["Precast", "Panels + fixing points", "precast"], ["MEP", "Services + routing", "mep"]] as const;
export function Subcontractors() {
  const [on, setOn] = useState<string[]>(["steel", "precast", "mep"]);
  const has = (k: string) => on.includes(k);
  const tg = (k: string) => setOn((o) => (o.includes(k) ? o.filter((x) => x !== k) : [...o, k]));
  return (
    <div>
      <ul className="mb-4 grid gap-3 sm:grid-cols-3">{SP.map(([t, d, k]) => <li key={k}><button type="button" role="switch" aria-checked={has(k)} onClick={() => tg(k)} className={cn("block w-full border p-4 text-left transition-colors", has(k) ? "border-sky-300 bg-sky-300/10 text-white" : "border-slate-600 text-slate-400")}><span className="font-mono text-[10px] uppercase tracking-[0.14em]">{has(k) ? "In model" : "Hidden"}</span><span className="mt-1 block text-base font-semibold">{t}</span><span className="text-sm opacity-80">{d}</span></button></li>)}</ul>
      <Panel label="Coordinated project model"><BimModel layers={{ struct: true, arch: false, mech: has("mep"), elec: has("mep"), plumb: has("mep") }} faint steel={has("steel")} precast={has("precast")} clash={has("steel") && has("mep") ? "open" : "off"} focus={has("steel") && has("mep") ? "BIM-001" : null} labels={false} title="Steel, precast and MEP packages combined into one coordinated model" className="mx-auto block h-auto w-full max-w-3xl" /></Panel>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-300">{has("steel") && has("mep") ? "Steel connection ↔ MEP route" : has("precast") && has("steel") ? "Precast fixing point ↔ structural frame" : "Toggle packages to bring them together"}</p>
    </div>
  );
}

/* ───────── as-built slider ───────── */

export function AsBuilt() {
  const [v, setV] = useState(0.6);
  const flow = ["Design", "Construction", "Built condition", "As-built"];
  return (
    <div>
      <ol className="mb-4 grid gap-2 sm:grid-cols-4">{flow.map((f, k) => <li key={f} className={cn("border px-3 py-2.5 text-sm font-semibold", k === 3 ? "border-green-600 bg-white text-slate-900" : "border-slate-300 bg-white text-slate-700")}><span className="mr-2 font-mono text-[10px] text-slate-400">{k + 1}</span>{f}</li>)}</ol>
      <Panel label={v > 0.5 ? "As-built · field changes recorded" : "Design intent"}><BimModel layers={ALL_LAYERS} shift={v} labels={false} title="The building from design to as-built with field changes" className="mx-auto block h-auto w-full max-w-3xl" /></Panel>
      <label className="mx-auto mt-3 flex max-w-3xl items-center gap-3"><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">Design</span><input type="range" min={0} max={100} value={Math.round(v * 100)} onChange={(e) => setV(Number(e.target.value) / 100)} aria-label="Compare design and as-built" className="h-8 flex-1 accent-sky-400" /><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">As-built</span></label>
      <ul className="mx-auto mt-3 flex max-w-3xl flex-wrap gap-2">{["Field change", "Variation", "Updated condition"].map((x) => <li key={x} className="border border-orange-400/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-orange-300">{x}</li>)}</ul>
    </div>
  );
}

/* ───────── tower ───────── */

const LV = [5, 12, 20, 28];
export function Tower() {
  const [sel, setSel] = useState(12);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 md:grid-cols-[auto_1fr] md:items-center">
      <svg viewBox="0 0 220 420" className="mx-auto h-[420px] w-auto max-w-full" role="img" aria-label="A multi-storey residential tower with a service riser and structural transfer level" fill="none">
        <title>Tower coordination</title>
        <rect x="40" y="20" width="140" height="380" fill="#0B1B33" stroke="#38BDF8" strokeOpacity="0.6" />
        {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M40 ${20 + i * (380 / 30)}H180`} stroke="#38BDF8" strokeOpacity="0.25" />)}
        <rect x="86" y="20" width="10" height="380" fill="#2DD4BF" fillOpacity="0.25" stroke="#2DD4BF" /><rect x="40" y="228" width="140" height="12" fill="#60A5FA" fillOpacity="0.35" stroke="#60A5FA" /><text x="190" y="238" fontSize="8" fill="#93C5FD" style={mono}>TRANSFER</text><text x="102" y="14" fontSize="8" fill="#5EEAD4" style={mono}>RISER</text>
        {LV.map((l) => { const y = 400 - (l / 30) * 380; const on = sel === l; return <g key={l} role="button" tabIndex={0} aria-label={`Level ${l}`} style={{ cursor: "pointer", outline: "none" }} onClick={() => setSel(l)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(l); } }}><rect x="40" y={y - 7} width="140" height="14" fill={COL.clash} fillOpacity={on ? 0.35 : 0.1} stroke={COL.clash} strokeWidth={on ? 2 : 1} /><circle cx="91" cy={y} r="6" fill="#0B1B33" stroke={COL.clash} /><text x="8" y={y + 4} fontSize="10" fill="#E2E8F0" style={mono}>L{String(l).padStart(2, "0")}</text></g>; })}
      </svg>
      <div className="space-y-3">
        <div role="group" aria-label="Level" className="flex flex-wrap gap-2">{LV.map((l) => <button key={l} type="button" aria-pressed={sel === l} onClick={() => setSel(l)} className={chip(sel === l)}>Level {String(l).padStart(2, "0")}</button>)}</div>
        <p aria-live="polite" className="border-l-2 border-blue-600 bg-white px-4 py-3 text-sm text-slate-700"><strong className="block text-slate-900">Level {String(sel).padStart(2, "0")} · illustrative</strong>The same riser-to-structure interface repeats on every floor plate, so one unresolved issue can repeat across many levels.</p>
        <ul className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-slate-600">{["Floor plates", "Transfer levels", "Service risers"].map((x) => <li key={x} className="border border-slate-300 bg-white px-2 py-2">{x}</li>)}</ul>
        <p className="text-xs text-slate-500">Schematic only — no tower height or level count is implied.</p>
      </div>
    </div>
  );
}

/* ───────── software tabs ───────── */

const SW = [["autocad", "AutoCAD", "2D construction documentation."], ["revit", "Revit", "BIM modelling and coordination."], ["tekla", "Tekla Structures", "Structural steel detailing."], ["navisworks", "Navisworks", "Model coordination and clash review."], ["civil-3d", "Civil 3D", "Civil / site documentation."]] as const;
export function SoftwareTabs({ avail }: { avail: string[] }) {
  const list = SW.filter((s) => avail.includes(s[0]));
  const [i, setI] = useState(0);
  const s = list[i] ?? list[0];
  if (!s) return null;
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-3">
        <div role="tablist" aria-label="Software" className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">{list.map((x, k) => <button key={x[0]} role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} className={cn(chip(i === k, true), "shrink-0")}>{x[1]}</button>)}</div>
        <p aria-live="polite" className="border-l-2 border-sky-300 px-4 py-2 text-sm text-slate-200"><strong className="block text-white">{s[1]}</strong>{s[2]} An example of where it fits — not every project uses every platform.</p>
        <a href={`/software/${s[0]}`} className="inline-block text-sm font-semibold text-white underline underline-offset-4 hover:text-copper-400">About {s[1]} →</a>
      </div>
      <Panel label="Illustrative workflow">
        <ol className="grid gap-px bg-slate-700 sm:grid-cols-5">{list.map((x, k) => <li key={x[0]} className={cn("px-3 py-4 text-center font-mono text-[10px] uppercase tracking-[0.1em] transition-colors", k === i ? "bg-sky-300/15 text-sky-100" : "bg-[#0B1B33] text-slate-400")}>{x[1]}</li>)}</ol>
      </Panel>
    </div>
  );
}

/* ───────── document flow ───────── */

const FLOW = [["Design", ""], ["Architectural", "+"], ["Structural", "+"], ["MEP", ""], ["BIM coordination", ""], ["Shop drawings", ""], ["Subcontractor packages", ""], ["Construction", ""], ["Variations", ""], ["As-built", ""]];
export function DocFlow() {
  const { ref, stage } = useScrollStage(FLOW.length, false);
  return (
    <div ref={ref} style={css({ "--p": 0 })} className="relative">
      <span aria-hidden className="absolute left-[15px] top-0 h-full w-px bg-slate-700 lg:hidden"><span className="block h-full w-full origin-top bg-copper-500" style={{ transform: "scaleY(var(--p))" }} /></span>
      <ol className="grid gap-3 pl-10 lg:grid-cols-5 lg:pl-0">
        {FLOW.map(([t], k) => (
          <li key={t} className={cn("relative border px-4 py-4 transition-all duration-500", k <= stage ? "border-sky-300/70 bg-sky-300/10 text-white" : "border-slate-700 text-slate-500")}>
            <span aria-hidden className={cn("absolute -left-[33px] top-5 h-3 w-3 border-2 bg-[#0B1220] lg:hidden", k <= stage ? "border-copper-500" : "border-slate-600")} />
            <span className="font-mono text-[10px] opacity-70">{String(k + 1).padStart(2, "0")}</span><span className="block text-sm font-semibold">{t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────── CTA ───────── */

export function CtaCons() {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(2);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver((e) => {
      if (!e.some((x) => x.isIntersecting)) return;
      ob.disconnect();
      if (reduced()) { setS(9); return; }
      [4, 6, 8, 9].forEach((v, k) => setTimeout(() => setS(v), 700 + k * 1300));
    }, { threshold: 0.3 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  const t = fromStage(s);
  return (
    <div ref={ref} className="relative overflow-hidden border border-sky-300/25 bg-[#0B1B33]">
      <BimModel layers={toLayers(t)} steel={t.steel} clash={s === 6 ? "open" : s >= 8 ? "resolved" : "off"} shift={s >= 9 ? 0.6 : 0} labels={false} title="A coordinated BIM building becoming a drawing set, steel and MEP packages, a revision and an as-built record" className="block h-auto w-full" />
      <ul className="absolute inset-x-2 bottom-2 flex flex-wrap gap-1.5" aria-hidden>{["Drawing set", "Steel package", "MEP package", "Revision", "As-built"].map((x, k) => <li key={x} className="border border-sky-300/50 bg-[#0B1220]/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-sky-100 transition-opacity duration-500" style={{ opacity: s >= 9 ? 1 : 0, transitionDelay: `${k * 120}ms` }}>{x}</li>)}</ul>
    </div>
  );
}

export { ALL_LAYERS };
