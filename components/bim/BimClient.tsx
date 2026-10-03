"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollStage } from "@/components/structural/useScrollStage";
import { chip } from "@/components/arch/ui";
import {
  BimModel, Equipment, PointCloud, LAYER_META, ISSUES, COL, mono, ALL_LAYERS, type Layers, type LayerKey, type EqHl,
} from "./Model";

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

/* ───────── hero: live coordination workspace ───────── */

const HSTAGES = [
  { n: "01", t: "Architectural model", layers: { arch: true } as Layers },
  { n: "02", t: "Structural model", layers: { arch: true, struct: true } as Layers },
  { n: "03", t: "MEP systems", layers: ALL_LAYERS },
  { n: "04", t: "Federated model", layers: ALL_LAYERS },
  { n: "05", t: "Clash detected", layers: ALL_LAYERS },
  { n: "06", t: "Issue assigned", layers: ALL_LAYERS },
  { n: "07", t: "Resolved · coordinated model", layers: ALL_LAYERS },
];

export function HeroBim() {
  const [s, setS] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    if (reduced()) { const t = setTimeout(() => setS(6), 0); return () => clearTimeout(t); }
    if (s >= 6) return;
    const t = setTimeout(() => setS((v) => v + 1), s === 0 ? 2600 : 2100);
    return () => clearTimeout(t);
  }, [s, auto]);
  const st = HSTAGES[s];
  const clash = s >= 6 ? "resolved" : s >= 4 ? "open" : "off";
  const open = s >= 6 ? 0 : ISSUES.filter((i) => i.status !== "Resolved").length;
  const res = s >= 6 ? ISSUES.length : ISSUES.length - open;
  return (
    <div>
      <div className="relative overflow-hidden border border-sky-300/25 bg-[#0B1B33] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
        <BimModel layers={st.layers} clash={clash} focus={s >= 4 && s < 6 ? "BIM-001" : null} title="Illustrative multi-storey BIM model: architectural, structural and MEP layers federated, a clash found and resolved" className="block h-auto w-full" />
        <div className="pointer-events-none absolute left-2 top-2 w-36 border border-sky-300/25 bg-[#0B1B33]/85 p-2 sm:left-3 sm:top-3 sm:w-40" aria-hidden>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-sky-300">Model layers</p>
          <ul className="mt-1 space-y-0.5">
            {LAYER_META.map((l) => (
              <li key={l.k} className="flex items-center gap-1.5 font-mono text-[10px] text-slate-300" style={{ opacity: st.layers[l.k] ? 1 : 0.35, transition: "opacity .6s" }}>
                <span className="grid h-2.5 w-2.5 place-items-center border" style={{ borderColor: l.color }}>{st.layers[l.k] ? <span className="h-1.5 w-1.5" style={{ background: l.color }} /> : null}</span>{l.label}
              </li>
            ))}
          </ul>
        </div>
        <div className={cn("pointer-events-none absolute right-2 top-2 w-36 border border-sky-300/25 bg-[#0B1B33]/85 p-2 transition-opacity duration-700 sm:right-3 sm:top-3 sm:w-40", s >= 4 ? "opacity-100" : "opacity-0")} aria-hidden>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-sky-300">Coordination</p>
          <dl className="mt-1 font-mono text-[10px] text-slate-300">
            {[["Clashes", ISSUES.length, COL.clash], ["Open", open, COL.clash], ["Resolved", res, COL.ok]].map(([k, v, c]) => <div key={k as string} className="flex justify-between"><dt>{k as string}</dt><dd style={{ color: c as string }}>{String(v).padStart(2, "0")}</dd></div>)}
          </dl>
          <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-slate-500">Illustrative view</p>
        </div>
        {s >= 5 ? <div className="pointer-events-none absolute bottom-10 right-2 w-44 border bg-[#0B1B33]/90 p-2 font-mono text-[10px] sm:bottom-12 sm:right-3" style={{ borderColor: s >= 6 ? COL.ok : COL.clash }} aria-hidden><p style={{ color: s >= 6 ? COL.ok : COL.clash }}>{s >= 6 ? "RESOLVED · VERIFIED" : "ISSUE ASSIGNED · MEP"}</p><p className="text-slate-300">BIM-001 · Beam vs Duct</p></div> : null}
        <p className="pointer-events-none absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300">{st.n} · {st.t}</p>
      </div>
      <div className="mt-3">
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-300">Coordination stage</p>
        <div role="group" aria-label="Coordination stage" className="flex gap-2 overflow-x-auto pb-1">
          {HSTAGES.map((x, i) => <button key={x.n} type="button" aria-pressed={s === i} aria-label={`${x.n} ${x.t}`} onClick={() => { setAuto(false); setS(i); }} className={cn(chip(s === i, true), "shrink-0")}>{x.n}</button>)}
        </div>
      </div>
    </div>
  );
}

/* ───────── three disciplines ───────── */

const DISC = [
  { id: "arch", t: "Architectural", layers: { arch: true } as Layers, items: ["Walls", "Doors", "Windows", "Rooms", "Ceilings"], color: COL.arch },
  { id: "struct", t: "Structural", layers: { struct: true } as Layers, items: ["Columns", "Beams", "Slabs", "Structural framing"], color: COL.struct },
  { id: "mep", t: "MEP", layers: { mech: true, elec: true, plumb: true } as Layers, items: ["Ductwork", "Pipework", "Cable trays", "Equipment"], color: COL.mech },
  { id: "fed", t: "Federate models", layers: ALL_LAYERS, items: ["All three together", "One coordination view", "Aligned to the same grid"], color: "#fff" },
];

export function DisciplineTabs() {
  const [i, setI] = useState(0);
  const d = DISC[i];
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label={`${d.t} · ${i === 3 ? "all disciplines on one grid" : "single-discipline model"}`}><BimModel layers={d.layers} faint={i < 3} labels title={`${d.t} layer of the BIM model`} className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <div role="tablist" aria-label="Discipline" className="flex gap-2 overflow-x-auto pb-1">{DISC.map((x, k) => <button key={x.id} role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} className={cn(chip(i === k, true), "shrink-0")}>{x.t}</button>)}</div>
        <ul className="space-y-1.5 border border-slate-600 p-4 text-sm text-slate-200">
          {d.items.map((x) => <li key={x} className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0" style={{ background: d.color }} />{x}</li>)}
        </ul>
        <p className="text-sm leading-relaxed text-slate-300">{i === 3 ? "Federating places each discipline's model in the same coordinated environment so the interfaces between them can be checked." : "Each discipline models its own scope. On its own, nothing shows how it meets the other two."}</p>
      </div>
    </div>
  );
}

/* ───────── federated viewer ───────── */

const ELEMS = [
  { id: "E1", model: "STR-Model", disc: "Structural", level: "Level 01", el: "Column C-B2", status: "Coordinated", pin: [120, 120, 35] as [number, number, number], layer: "struct" as LayerKey },
  { id: "E2", model: "STR-Model", disc: "Structural", level: "Level 02", el: "Beam (grid 2)", status: "Open issue", pin: [180, 120, 132] as [number, number, number], layer: "struct" as LayerKey },
  { id: "E3", model: "MEP-Model", disc: "Mechanical", level: "Level 02", el: "Main duct", status: "Coordinated", pin: [100, 60, 113] as [number, number, number], layer: "mech" as LayerKey },
  { id: "E4", model: "MEP-Model", disc: "Electrical", level: "Level 02", el: "Cable tray", status: "Coordinated", pin: [180, 30, 96] as [number, number, number], layer: "elec" as LayerKey },
  { id: "E5", model: "MEP-Model", disc: "Plumbing", level: "Levels 01–03", el: "Riser", status: "Coordinated", pin: [300, 180, 100] as [number, number, number], layer: "plumb" as LayerKey },
  { id: "E6", model: "ARCH-Model", disc: "Architectural", level: "Level 01", el: "Partition wall", status: "Open issue", pin: [120, 120, 32] as [number, number, number], layer: "arch" as LayerKey },
];

export function FederatedViewer() {
  const [on, setOn] = useState<Layers>(ALL_LAYERS);
  const [lvl, setLvl] = useState<number | null>(null);
  const [sel, setSel] = useState("E2");
  const e = ELEMS.find((x) => x.id === sel)!;
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <Panel label="Lightweight viewer · illustrative"><BimModel layers={on} level={lvl} pin={on[e.layer] ? e.pin : null} title="Federated BIM model with discipline layer toggles" className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <div role="group" aria-label="Layers" className="flex flex-wrap gap-2">
          {LAYER_META.map((l) => <button key={l.k} type="button" aria-pressed={!!on[l.k]} onClick={() => setOn((s) => ({ ...s, [l.k]: !s[l.k] }))} className={chip(!!on[l.k], true)}><span aria-hidden className="mr-1.5 inline-block h-2 w-2 align-middle" style={{ background: l.color }} />{l.label}</button>)}
        </div>
        <div role="group" aria-label="Level" className="flex gap-2">
          {[null, 1, 2, 3].map((l) => <button key={String(l)} type="button" aria-pressed={lvl === l} onClick={() => setLvl(l)} className={chip(lvl === l, true)}>{l ? `L${l}` : "All"}</button>)}
        </div>
        <ul className="grid grid-cols-2 gap-1.5" aria-label="Elements">{ELEMS.map((x) => <li key={x.id}><button type="button" aria-pressed={sel === x.id} onClick={() => setSel(x.id)} className={cn(chip(sel === x.id, true), "w-full text-left normal-case")}>{x.el}</button></li>)}</ul>
        <dl aria-live="polite" className="border border-slate-600 text-sm">
          {[["Model", e.model], ["Discipline", e.disc], ["Level", e.level], ["Element", e.el], ["Status", e.status]].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 border-b border-slate-700 px-4 py-2 last:border-0"><dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">{k}</dt><dd className={cn("font-medium text-white", k === "Status" && v === "Open issue" && "text-orange-400")}>{v}</dd></div>
          ))}
        </dl>
        <p className="text-xs text-slate-400">Metadata is illustrative — it shows what a coordination view carries, not project data.</p>
      </div>
    </div>
  );
}

/* ───────── LOD ───────── */

const LODS = [
  { t: "Concept", note: "Geometry and design intent.", req: "Overall form and extents" },
  { t: "Design development", note: "More information, as needed for coordination.", req: "Sizes, connections and clearances" },
  { t: "Construction", note: "Detailed coordination and documentation.", req: "Supports, access, tags and schedule-ready data" },
  { t: "Handover", note: "What the agreed handover brief asks for.", req: "Asset, warranty and maintenance information" },
];

export function LodStages() {
  const [i, setI] = useState(2);
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label={`${LODS[i].t} · the same element, more information`}><Equipment lod={i as 0 | 1 | 2 | 3} title={`Example equipment at ${LODS[i].t} stage`} className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <ol className="grid grid-cols-2 gap-2">{LODS.map((l, k) => <li key={l.t}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn(chip(i === k), "w-full text-left")}><span className="opacity-70">{String(k + 1).padStart(2, "0")}</span> {l.t}</button></li>)}</ol>
        <dl className="border border-slate-300 bg-white text-sm">
          {[["LOD target", "Agreed per project"], ["Project stage", LODS[i].t], ["Information requirement", LODS[i].req]].map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-b border-slate-200 px-4 py-3 last:border-0"><dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{k}</dt><dd className="text-right font-medium text-slate-900">{v}</dd></div>)}
        </dl>
        <p className="text-sm leading-relaxed text-slate-600">{LODS[i].note} The right level is project-specific — not the highest level by default.</p>
      </div>
    </div>
  );
}

/* ───────── clash signature ───────── */

const FLOW = ["Clash detected", "Issue assigned", "Design review", "Resolution", "Recheck", "Resolved"];
const FLOW_STATUS = ["Open", "Assigned", "In review", "Resolution proposed", "Rechecking", "Resolved"];

export function ClashSignature() {
  const [i, setI] = useState(0);
  const res = i >= 4;
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <Panel label={`${FLOW[i]} · BIM-001`}><BimModel layers={{ struct: true, mech: true, arch: false, elec: false, plumb: false }} faint clash={res ? "resolved" : "open"} focus={res ? null : "BIM-001"} title={res ? "The duct rerouted below the beam and rechecked" : "A structural beam intersecting an HVAC duct, highlighted as a clash"} className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <ol className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1" aria-label="Clash workflow">
          {FLOW.map((f, k) => <li key={f}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("flex w-full items-center gap-3 border px-3 py-2.5 text-left text-sm transition-colors", i === k ? "border-sky-300 bg-sky-300/10 text-white" : k < i ? "border-slate-600 text-slate-300" : "border-slate-700 text-slate-500")}><span className="font-mono text-[10px] opacity-70">{String(k + 1).padStart(2, "0")}</span>{f}{k < i ? <span aria-hidden className="ml-auto" style={{ color: COL.ok }}>✓</span> : null}</button></li>)}
        </ol>
        <dl aria-live="polite" className="border bg-[#0B1B33] text-sm" style={{ borderColor: res ? COL.ok : COL.clash }}>
          <div className="border-b border-slate-700 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: res ? COL.ok : COL.clash }}>{res && i === 5 ? "Resolved" : "Clash detected"}</div>
          {[["Type", "Hard clash"], ["Elements", "Structural beam · HVAC duct"], ["Status", FLOW_STATUS[i]]].map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-b border-slate-700 px-4 py-2 last:border-0"><dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">{k}</dt><dd className="text-right text-white">{v}</dd></div>)}
        </dl>
        <p className="text-xs text-slate-400">The clash is detected by the check; the design team decides how it is resolved.</p>
      </div>
    </div>
  );
}

/* ───────── clash report ↔ model ───────── */

export function ClashReport() {
  const [sel, setSel] = useState("BIM-001");
  return (
    <div>
      <Panel className="mb-4" label="Click an issue — or a marker — to locate it in the model"><BimModel layers={{ struct: true, mech: true, plumb: true, arch: true, elec: false }} clash="open" focus={sel} onIssue={setSel} title="BIM model with clash markers linked to the report" className="mx-auto block h-auto w-full max-w-3xl" /></Panel>
      <div className="border border-slate-300 bg-white text-sm">
        <div aria-hidden className="hidden grid-cols-[90px_1.2fr_1.2fr_80px_80px_110px_110px] gap-3 border-b border-slate-300 bg-slate-50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 lg:grid">
          {["ID", "Discipline", "Issue", "Location", "Priority", "Owner", "Status"].map((h) => <span key={h}>{h}</span>)}
        </div>
        {ISSUES.map((it) => (
          <button key={it.id} type="button" aria-pressed={sel === it.id} aria-label={`${it.id}, ${it.issue}, level ${it.level}, priority ${it.priority}, owner ${it.owner}, status ${it.status}`} onClick={() => setSel(it.id)}
            className={cn("grid w-full gap-x-3 gap-y-0.5 border-b border-slate-200 px-4 py-3 text-left transition-colors last:border-0 max-lg:grid-cols-2 lg:grid-cols-[90px_1.2fr_1.2fr_80px_80px_110px_110px] lg:items-center", sel === it.id ? "bg-blue-50" : "hover:bg-slate-50")}>
            <span className="font-mono font-semibold text-slate-900">{it.id}</span>
            <span className="text-slate-600">{it.disc}</span>
            <span className="font-medium text-slate-900">{it.issue}</span>
            <span className="text-slate-600">Level {String(it.level).padStart(2, "0")}</span>
            <span className={it.priority === "High" ? "font-semibold text-orange-700" : "text-slate-600"}>{it.priority}</span>
            <span className="text-slate-600">{it.owner}</span>
            <span className={it.status === "Resolved" ? "font-semibold text-green-700" : "text-slate-800"}>{it.status}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">Illustrative values only. Priorities follow each project&apos;s requirements.</p>
    </div>
  );
}

/* ───────── coordination cycle ───────── */

const CYCLE = [
  ["Federate", "Models combined into one view."], ["Check", "Clash checks run."], ["Identify", "Issues located in the model."], ["Prioritise", "Important issues sorted from noise."],
  ["Assign", "Each issue gets an owner."], ["Resolve", "The responsible team acts."], ["Recheck", "The fix is verified."], ["Update model", "Models updated, then repeat."],
];

export function CoordinationCycle() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (hold || reduced()) return;
    const t = setTimeout(() => setI((v) => (v + 1) % CYCLE.length), 1700);
    return () => clearTimeout(t);
  }, [i, hold]);
  const R = 150;
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
      <svg viewBox="-50 0 500 400" className="mx-auto block h-auto w-full max-w-lg" role="img" aria-label="Coordination cycle: federate, check, identify, prioritise, assign, resolve, recheck, update model, repeat" fill="none">
        <title>Coordination cycle</title>
        <circle cx="200" cy="200" r={R} stroke="#94A3B8" strokeDasharray="4 5" />
        <circle cx="200" cy="200" r={R} stroke="#2563EB" strokeWidth="2.4" pathLength="1" strokeDasharray="0.125 0.875" strokeDashoffset={-i * 0.125 + 0.0} style={{ transition: "stroke-dashoffset 0.7s ease", transform: "rotate(-112.5deg)", transformOrigin: "200px 200px" }} />
        {CYCLE.map(([t], k) => {
          const a = (k / CYCLE.length) * Math.PI * 2 - Math.PI / 2;
          const x = 200 + Math.cos(a) * R, y = 200 + Math.sin(a) * R;
          const on = k === i;
          return (
            <g key={t} role="button" tabIndex={0} aria-label={t} style={{ cursor: "pointer", outline: "none" }} onClick={() => setI(k)} onFocus={() => setI(k)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setI(k); } }}>
              <circle cx={x} cy={y} r={on ? 20 : 15} fill={on ? "#2563EB" : "#fff"} stroke={on ? "#2563EB" : "#475569"} strokeWidth="1.5" style={{ transition: "r .3s" }} />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill={on ? "#fff" : "#0F172A"} style={mono}>{k + 1}</text>
              <text x={200 + Math.cos(a) * (R + 38)} y={200 + Math.sin(a) * (R + 38) + 4} textAnchor="middle" fontSize="11" fill={on ? "#1D4ED8" : "#475569"} fontWeight={on ? 700 : 400}>{t}</text>
            </g>
          );
        })}
        <text x="200" y="196" textAnchor="middle" fontSize="12" fill="#0F172A" style={mono}>REPEAT</text><text x="200" y="214" textAnchor="middle" fontSize="9" fill="#64748B" style={mono}>NOT A ONE-OFF REPORT</text>
      </svg>
      <div aria-live="polite" className="border border-slate-300 bg-white p-6">
        <p className="font-mono text-xs tracking-[0.16em] text-blue-700">{String(i + 1).padStart(2, "0")} / 08</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{CYCLE[i][0]}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{CYCLE[i][1]}</p>
        <ol className="mt-4 flex flex-wrap gap-1.5 text-xs text-slate-500">{CYCLE.map(([t], k) => <li key={t} className={cn("border px-2 py-1", k === i ? "border-blue-600 text-blue-700" : "border-slate-200")}>{t}</li>)}</ol>
      </div>
    </div>
  );
}

/* ───────── issue ownership ───────── */

const OWN = [
  { issue: "Structural / MEP clash", disc: "MEP coordination", owner: "MEP lead", action: "Modify duct route", status: "Recheck" },
  { issue: "Column vs pipe", disc: "Plumbing", owner: "Plumbing designer", action: "Offset pipe run", status: "Assigned" },
  { issue: "Access zone clearance", disc: "Mechanical", owner: "Mechanical lead", action: "Review equipment position", status: "In review" },
];
const OWN_HEAD = ["Issue", "Discipline", "Owner", "Action", "Status"];

export function IssueOwnership() {
  const [i, setI] = useState(0);
  const o = OWN[i];
  const vals = [o.issue, o.disc, o.owner, o.action, o.status];
  return (
    <div>
      <div role="group" aria-label="Example issue" className="mb-5 flex flex-wrap gap-2">{OWN.map((x, k) => <button key={x.issue} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={chip(i === k, true)}>{x.issue}</button>)}</div>
      <ol key={i} data-in="true" className="grid gap-2 md:grid-cols-5 md:gap-0">
        {OWN_HEAD.map((h, k) => (
          <li key={h} className="fade-in relative md:pr-5" style={css({ "--d": `${k * 130}ms` })}>
            <div className={cn("h-full border p-4", k === 0 ? "border-orange-400/70" : k === 4 ? "border-sky-300/70" : "border-slate-600")}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">{h}</p>
              <p className="mt-1 text-sm font-semibold text-white">{vals[k]}</p>
            </div>
            {k < 4 ? <span aria-hidden className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 bg-[#111827] px-1 text-sky-300 md:-right-0 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0">→</span> : null}
          </li>
        ))}
      </ol>
      <p className="mt-5 text-sm text-slate-400">Illustrative example. Context and ownership are what stop a clash report being ignored under deadline pressure.</p>
    </div>
  );
}

/* ───────── Revit family + information ───────── */

const PARAMS: { k: string; v: string; hl: EqHl }[] = [
  { k: "Family name", v: "Example_AHU_Family", hl: "type" }, { k: "Category", v: "Mechanical Equipment", hl: "type" }, { k: "Dimensions", v: "1300 × 900 × 600", hl: "size" },
  { k: "Manufacturer / reference", v: "Per project specification", hl: "ref" }, { k: "System", v: "Supply air", hl: "system" }, { k: "Level", v: "Level 03", hl: "level" }, { k: "Quantity", v: "1", hl: "qty" },
];

export function FamilyViewer() {
  const [tab, setTab] = useState<"3d" | "tag" | "schedule">("3d");
  const [hl, setHl] = useState<EqHl>(null);
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div role="tablist" aria-label="Family views" className="mb-2 flex gap-2">{([["3d", "3D model"], ["tag", "Tag"], ["schedule", "Schedule"]] as const).map(([k, l]) => <button key={k} role="tab" type="button" aria-selected={tab === k} onClick={() => setTab(k)} className={chip(tab === k, true)}>{l}</button>)}</div>
        <Panel label="3D model ↔ tag ↔ schedule · one family, consistent data">
          {tab === "schedule" ? (
            <div className="grid min-h-[260px] place-items-center bg-[#0B1B33] p-6">
              <table className="w-full max-w-md border border-sky-300/30 text-left font-mono text-xs text-slate-200">
                <caption className="border-b border-sky-300/30 px-3 py-2 text-left uppercase tracking-[0.14em] text-sky-300">Mechanical equipment schedule · example</caption>
                <thead><tr className="text-slate-400"><th className="px-3 py-2 font-normal">Mark</th><th className="font-normal">Family</th><th className="font-normal">Size</th><th className="font-normal">Qty</th></tr></thead>
                <tbody><tr className="bg-sky-300/10 text-white"><td className="px-3 py-2">AHU-01</td><td>Example_AHU_Family</td><td>1300×900×600</td><td>1</td></tr><tr className="text-slate-500"><td className="px-3 py-2">—</td><td>…</td><td>…</td><td>…</td></tr></tbody>
              </table>
            </div>
          ) : <Equipment lod={tab === "tag" ? 2 : 3} hl={hl ?? (tab === "tag" ? "ref" : null)} title="Example custom equipment family" className="block h-auto w-full" />}
        </Panel>
      </div>
      <div>
        <dl className="border border-slate-600 text-sm">
          {PARAMS.map((p) => (
            <div key={p.k} tabIndex={0} onPointerEnter={() => setHl(p.hl)} onPointerLeave={() => setHl(null)} onFocus={() => setHl(p.hl)} onBlur={() => setHl(null)} className="flex justify-between gap-3 border-b border-slate-700 px-4 py-2.5 outline-none transition-colors last:border-0 hover:bg-sky-300/10 focus-visible:bg-sky-300/10">
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">{p.k}</dt><dd className="text-right font-medium text-white">{p.v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">A family that looks right in 3D but reports the wrong quantity or parameter in a schedule undermines the point of BIM. Parameters shown are examples, not a fixed list.</p>
      </div>
    </div>
  );
}

export function InfoToggle() {
  const [info, setInfo] = useState(true);
  const fields = ["Type", "Size", "Manufacturer / reference", "Quantity", "System", "Level", "Parameters"];
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <div>
        <div role="group" aria-label="Model content" className="mb-2 flex gap-2"><button type="button" aria-pressed={!info} onClick={() => setInfo(false)} className={chip(!info)}>3D model only</button><button type="button" aria-pressed={info} onClick={() => setInfo(true)} className={chip(info)}>Information-rich BIM</button></div>
        <Panel label={info ? "Geometry + information" : "Geometry only"}><Equipment lod={info ? 3 : 1} title={info ? "Equipment with its information" : "Equipment geometry only"} className="block h-auto w-full" /></Panel>
      </div>
      <ul className="space-y-1.5">
        {fields.map((f, k) => <li key={f} className={cn("flex items-center justify-between border px-4 py-2.5 text-sm transition-all duration-500", info ? "border-blue-600 bg-white text-slate-900" : "border-slate-200 text-slate-400")} style={{ transitionDelay: `${k * 40}ms` }}>{f}<span aria-hidden className="font-mono text-[10px]">{info ? "→ schedule" : "—"}</span></li>)}
      </ul>
    </div>
  );
}

/* ───────── legacy model ───────── */

const LEG = [
  { t: "Existing model", d: "Inconsistent or messy areas are marked on the inherited model.", mess: 1 as const },
  { t: "Model audit", d: "Problem geometry, coordination issues, family problems, structural inconsistencies and missing information are identified.", mess: 2 as const },
  { t: "Targeted rebuild", d: "Where practical, problem areas are rebuilt rather than restarting the whole project.", mess: 3 as const },
  { t: "Cleaner coordination model", d: "The result is a model that can support coordination again.", mess: 0 as const },
];

export function LegacyFlow() {
  const [i, setI] = useState(1);
  const s = LEG[i];
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label={s.t}><BimModel layers={{ struct: true, mech: true, arch: true, elec: false, plumb: true }} mess={s.mess} title={`Inherited model at the "${s.t}" step`} className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <ol className="space-y-1.5">{LEG.map((l, k) => <li key={l.t}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn(chip(i === k), "flex w-full items-center gap-3 text-left normal-case")}><span className="font-mono text-[10px] opacity-70">{k + 1}</span>{l.t}</button></li>)}</ol>
        <p className="border border-slate-300 bg-white p-4 text-sm leading-relaxed text-slate-700">{s.d}</p>
        {i === 1 ? <ul className="grid grid-cols-2 gap-1.5 text-xs text-slate-700">{["Problem geometry", "Coordination issues", "Family problems", "Structural inconsistencies", "Missing information"].map((x, k) => <li key={x} className="flex gap-2 border border-slate-200 bg-white px-2 py-1.5"><span className="font-mono text-orange-600">{k + 1}</span>{x}</li>)}</ul> : null}
      </div>
    </div>
  );
}

/* ───────── scan to BIM ───────── */

const SCAN = ["Laser scan / point cloud", "Point cloud clean-up", "Model elements", "Revit BIM model", "Existing building documentation"];
export function ScanFlow() {
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(true);
  useEffect(() => {
    if (!play) return;
    if (reduced()) { const t = setTimeout(() => setI(4), 0); return () => clearTimeout(t); }
    const t = setTimeout(() => setI((v) => (v + 1) % SCAN.length), i === 4 ? 3200 : 2200);
    return () => clearTimeout(t);
  }, [i, play]);
  return (
    <div>
      <div role="group" aria-label="Scan to BIM stage" className="mb-3 flex gap-2 overflow-x-auto pb-1">{SCAN.map((s, k) => <button key={s} type="button" aria-pressed={i === k} onClick={() => { setPlay(false); setI(k); }} className={cn(chip(i === k, true), "shrink-0")}>{k + 1} · {s}</button>)}</div>
      <div className="grid items-center gap-3 [&>*]:min-w-0 lg:grid-cols-[1fr_auto_1fr]">
        <Panel label="Existing condition · point cloud"><PointCloud stage={i as 0 | 1 | 2 | 3 | 4} title="Point cloud of an existing building" className="block h-auto w-full" /></Panel>
        <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-sky-300">Scan <span className="text-copper-400">→</span> BIM</p>
        <Panel label="Working Revit model"><div style={{ opacity: i >= 3 ? 1 : i === 2 ? 0.35 : 0.08, transition: "opacity 0.8s" }}><BimModel layers={{ arch: true, struct: true }} labels={false} title="Revit BIM model built from the scan" className="block h-auto w-full" /></div></Panel>
      </div>
    </div>
  );
}

/* ───────── handover ───────── */

const HAND = [
  { t: "Design team", items: ["Geometry", "Design information"] },
  { t: "Construction team", items: ["Coordination", "Documentation", "Construction information"] },
  { t: "Facilities team", items: ["Equipment data", "Warranty references", "Maintenance access information"] },
];
export function Handover() {
  const [i, setI] = useState(2);
  return (
    <div>
      <ol className="grid gap-3 md:grid-cols-3">
        {HAND.map((h, k) => (
          <li key={h.t}>
            <button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("relative h-full w-full border p-5 text-left transition-colors", i === k ? "border-blue-600 bg-white shadow-[0_12px_28px_-18px_rgba(37,99,235,0.8)]" : "border-slate-300 bg-transparent hover:border-slate-900")}>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{String(k + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{h.t}</h3>
              <ul className="mt-3 space-y-1 text-sm text-slate-600">{h.items.map((x) => <li key={x} className="flex gap-2"><span aria-hidden className={cn("mt-2 h-1.5 w-1.5 shrink-0", i >= k ? "bg-blue-600" : "bg-slate-300")} />{x}</li>)}</ul>
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-4"><Panel label="Information needs grow through the project — where included in the project brief"><Equipment lod={(i + 1) as 1 | 2 | 3} title="Equipment information growing from design to facilities handover" className="mx-auto block h-auto w-full max-w-3xl" /></Panel></div>
    </div>
  );
}

/* ───────── model → drawings ───────── */

const DER = [
  { k: "Column C-B2", pin: [120, 120, 35] as [number, number, number], lvl: 1, sheets: ["S-101 Plan · Level 01", "S-201 Section", "S-601 Column schedule"] },
  { k: "Main duct L2", pin: [100, 60, 113] as [number, number, number], lvl: 2, sheets: ["M-102 Plan · Level 02", "M-201 Section", "M-601 Equipment schedule"] },
  { k: "Partition wall", pin: [120, 120, 32] as [number, number, number], lvl: 1, sheets: ["A-101 Plan · Level 01", "A-301 Elevation", "A-601 Wall schedule"] },
  { k: "Level 03 slab", pin: [180, 120, 210] as [number, number, number], lvl: 3, sheets: ["S-103 Plan · Level 03", "S-201 Section"] },
];
export function DerivedDrawings() {
  const [i, setI] = useState(0);
  const d = DER[i];
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label="Select an element — see where it appears on the sheets"><BimModel pin={d.pin} level={d.lvl} title={`BIM model with ${d.k} highlighted`} className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <div role="group" aria-label="Element" className="flex flex-wrap gap-2">{DER.map((x, k) => <button key={x.k} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={chip(i === k)}>{x.k}</button>)}</div>
        <ul key={i} data-in="true" className="space-y-2" aria-live="polite">
          {d.sheets.map((s, k) => <li key={s} className="fade-in flex items-center gap-3 border border-blue-600 bg-white px-4 py-3 text-sm font-medium text-slate-900" style={css({ "--d": `${k * 110}ms` })}><span aria-hidden className="h-6 w-5 border border-slate-400 bg-slate-50" />{s}</li>)}
        </ul>
        <p className="text-sm text-slate-600">Floor plans, sections, elevations, schedules and sheets are derived from the same coordinated model, so a change is made once.</p>
      </div>
    </div>
  );
}

/* ───────── process timeline ───────── */

const PSTEP: { layers: Layers; clash: "off" | "open" | "resolved"; faint?: boolean }[] = [
  { layers: { arch: true }, clash: "off", faint: true }, { layers: { arch: true }, clash: "off", faint: true },
  { layers: { arch: true, struct: true, mech: true }, clash: "off" }, { layers: ALL_LAYERS, clash: "open" }, { layers: ALL_LAYERS, clash: "resolved" },
];
export function BimProcess({ steps }: { steps: { title: string; description: string }[] }) {
  const { ref, stage } = useScrollStage(steps.length, false);
  return (
    <div ref={ref} style={css({ "--p": 0 })} className="relative">
      <span aria-hidden className="absolute left-[15px] top-0 h-full w-px bg-slate-300 lg:hidden"><span className="block h-full w-full origin-top bg-copper-500" style={{ transform: "scaleY(var(--p))" }} /></span>
      <span aria-hidden className="absolute left-0 right-0 top-[15px] hidden h-px bg-slate-300 lg:block"><span className="block h-full w-full origin-left bg-copper-500" style={{ transform: "scaleX(var(--p))" }} /></span>
      <ol className="grid gap-8 lg:grid-cols-5 lg:gap-5">
        {steps.map((s, i) => (
          <li key={s.title} className={cn("relative pl-12 transition-opacity duration-500 lg:pl-0 lg:pt-12", i <= stage ? "opacity-100" : "opacity-50")}>
            <span aria-hidden className={cn("absolute left-2 top-1 h-[14px] w-[14px] border-2 bg-[#F8F7F4] lg:left-0 lg:top-2", i <= stage ? "border-copper-500" : "border-slate-400")} />
            <p className="font-mono text-xs tracking-[0.16em] text-copper-600">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 text-base font-semibold tracking-tight text-slate-900">{s.title}</h3>
            <div className="mt-3 hidden overflow-hidden border border-slate-300 sm:block"><BimModel layers={i <= stage ? PSTEP[i].layers : { arch: true }} faint={PSTEP[i].faint} clash={i <= stage ? PSTEP[i].clash : "off"} labels={false} title={`Step ${i + 1} of the BIM workflow`} className="block h-auto w-full" /></div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────── final CTA ───────── */

export function CtaBim() {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver((e) => {
      if (!e.some((x) => x.isIntersecting)) return;
      ob.disconnect();
      if (reduced()) { setS(5); return; }
      [1, 2, 3, 4, 5].forEach((v, k) => setTimeout(() => setS(v), 500 + k * 1300));
    }, { threshold: 0.3 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  const L: Layers[] = [{ arch: true }, { arch: true, struct: true }, ALL_LAYERS, ALL_LAYERS, ALL_LAYERS, ALL_LAYERS];
  return (
    <div ref={ref} className="relative overflow-hidden border border-sky-300/25 bg-[#0B1B33]">
      <BimModel layers={L[s]} clash={s === 3 ? "open" : s >= 4 ? "resolved" : "off"} focus={s === 3 ? "BIM-001" : null} labels={false} title="Architectural, structural and MEP models becoming one coordinated model" className="block h-auto w-full" />
      <p className={cn("absolute inset-x-0 bottom-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-sky-200 transition-opacity duration-700 sm:text-xs", s >= 5 ? "opacity-100" : "opacity-0")}>Architectural + Structural + MEP → Coordinated model</p>
    </div>
  );
}
