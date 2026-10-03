"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollStage } from "@/components/structural/useScrollStage";
import { PlanSvg, ElevSvg, SectionSvg, TitleBlock } from "@/components/arch/Drawing";
import { DOORS, WINDOWS, OPENINGS, mono, openingOf, roomOf } from "@/components/arch/model";
import { RevitScene, ElementIso, C, type SceneLayers, type SceneHi } from "./RvtScene";

const css = (o: Record<string, string | number>) => o as React.CSSProperties;
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Chip styled for a light UI (blue = selected). */
export const rchip = (on: boolean, dark?: boolean) =>
  cn("min-h-[40px] border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
    on ? "border-blue-600 bg-blue-600 text-white" : dark ? "border-slate-600 text-slate-300 hover:border-slate-300 hover:text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-900");

export function Frame({ children, label, className }: { children: React.ReactNode; label?: string; className?: string }) {
  return (
    <figure className={cn("overflow-hidden border border-slate-300 bg-white shadow-[0_18px_40px_-26px_rgba(15,23,42,0.45)]", className)}>
      {children}
      {label ? <figcaption className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</figcaption> : null}
    </figure>
  );
}

/* ───────── views ───────── */

export type ViewId = "3d" | "plan" | "section" | "elev" | "sheet" | "schedule";
const VIEW_LABEL: Record<ViewId, string> = { "3d": "3D", plan: "Plan", section: "Section", elev: "Elevation", sheet: "Sheet", schedule: "Schedule" };

function DoorTable({ hot, className }: { hot?: string | null; className?: string }) {
  return (
    <table className={cn("w-full table-fixed border-collapse text-left font-mono text-[11px] text-slate-700", className)}>
      <caption className="border-b border-slate-300 bg-slate-100 px-3 py-2 text-left uppercase tracking-[0.14em] text-slate-600">Door schedule · example</caption>
      <thead><tr className="border-b border-slate-200 text-slate-500"><th className="w-[16%] px-3 py-1.5 font-normal">Mark</th><th className="w-[24%] font-normal">Type</th><th className="w-[28%] font-normal">Size</th><th className="font-normal">Level</th></tr></thead>
      <tbody>{DOORS.map((d) => <tr key={d.id} className={cn("border-b border-slate-100 transition-colors", hot === d.id ? "bg-blue-100 font-semibold text-blue-800" : "")}><td className="px-3 py-1.5">{d.id}</td><td>{d.type}</td><td>{d.size}</td><td>{d.id === "D-01" ? "Level 01" : roomOf(d.room).y0 < 230 ? "Level 01" : "Level 01"}</td></tr>)}</tbody>
    </table>
  );
}

export function ViewCanvas({ view, layers, rev = 0, hotDoor = null, hi3d = null, title }: { view: ViewId; layers: SceneLayers; rev?: number; hotDoor?: string | null; hi3d?: SceneHi; title: string }) {
  if (view === "3d") return <RevitScene layers={layers} hi={hi3d} title={title} className="block h-auto w-full" />;
  if (view === "plan") return <div className="bg-white"><PlanSvg rev={rev} interact={{ hi: hotDoor ? [hotDoor] : [] }} layers={{ marks: false }} title={title} className="block h-auto w-full" /></div>;
  if (view === "section") return <div className="bg-white p-3"><SectionSvg title={title} className="mx-auto block h-auto w-full max-w-xl" /></div>;
  if (view === "elev") return <div className="bg-white p-3"><ElevSvg hi={hotDoor && ["D-01", "W-05", "W-06"].includes(hotDoor) ? [hotDoor] : []} title={title} className="block h-auto w-full" /></div>;
  if (view === "schedule") return <div className="bg-white p-4"><DoorTable hot={hotDoor} /></div>;
  return <SheetView rev={rev} hotDoor={hotDoor} />;
}

export function SheetView({ rev = 0, hotDoor = null }: { rev?: number; hotDoor?: string | null }) {
  return (
    <div className="bg-slate-100 p-2 sm:p-3">
      <div className="grid grid-cols-[1.5fr_1fr] gap-1.5 border-2 border-slate-800 bg-white p-1.5 sm:gap-2 sm:p-2">
        <div className="border border-slate-300"><PlanSvg rev={rev} interact={{ hi: hotDoor ? [hotDoor] : [] }} layers={{ marks: false, dims: false, furniture: false }} title="Plan viewport on the sheet" className="block h-auto w-full" /></div>
        <div className="grid gap-1.5 sm:gap-2">
          <div className="border border-slate-300"><ElevSvg title="Elevation viewport on the sheet" className="block h-auto w-full" /></div>
          <div className="border border-slate-300"><SectionSvg title="Section viewport on the sheet" className="block h-auto w-full" /></div>
        </div>
        <div className="col-span-2 grid grid-cols-[1fr_auto] items-end gap-2"><div className="space-y-0.5 border border-slate-300 p-1" aria-hidden>{["D-01", "D-02", "D-03"].map((d) => <div key={d} style={{ fontSize: 8, lineHeight: "11px" }} className={"flex gap-1 px-1 font-mono " + (hotDoor === d ? "bg-blue-200 text-blue-900" : "text-slate-500")}><span>{d}</span><span className="h-1 flex-1 self-center bg-slate-200" /></div>)}</div><TitleBlock className="h-auto w-28 sm:w-44" status={rev ? "REV D" : "FOR REVIEW"} /></div>
      </div>
    </div>
  );
}

/* ───────── hero ───────── */

const HSTEPS = ["Empty project", "Levels", "Architectural elements", "Structural elements", "MEP elements", "Families & parameters", "Drawing sheet", "Schedule", "Revision changes an element", "Related views update"];
const HVIEW: ViewId[] = ["3d", "3d", "3d", "3d", "3d", "3d", "sheet", "schedule", "plan", "sheet"];

export function HeroRevit() {
  const [s, setS] = useState(0);
  const [auto, setAuto] = useState(true);
  const [manual, setManual] = useState<ViewId | null>(null);
  useEffect(() => {
    if (!auto) return;
    if (reduced()) { const t = setTimeout(() => setS(9), 0); return () => clearTimeout(t); }
    if (s >= 9) return;
    const t = setTimeout(() => setS((v) => v + 1), s === 0 ? 2200 : 1900);
    return () => clearTimeout(t);
  }, [s, auto]);
  const view = manual ?? HVIEW[s];
  const layers: SceneLayers = { levels: s >= 1, arch: s >= 2, struct: s >= 3, mep: s >= 4 };
  const rev = s >= 8 ? 3 : 0;
  const tree = [
    ["Views", s >= 1 ? "3D · Plans · Sections · Elevations" : "—"], ["Sheets", s >= 6 ? "A-101 · Ground floor" : "—"], ["Schedules", s >= 7 ? "Door schedule" : "—"], ["Families", s >= 5 ? "Doors · Windows · Equipment" : "—"],
  ];
  const props = s >= 5 ? [["Family", "Single-Flush"], ["Type", "Internal"], ["Level", "Level 01"], ["Mark", "D-02"], ["Size", "820 × 2040"]] : [["Element", s >= 4 ? "Duct" : s >= 3 ? "Structural column" : s >= 2 ? "Wall" : "—"], ["Level", s >= 1 ? "Level 01" : "—"]];
  const status = [["Architecture", s >= 2], ["Structure", s >= 3], ["MEP", s >= 4]] as const;
  return (
    <div>
      <div className="overflow-hidden border border-slate-300 bg-slate-200 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]">
        <div className="flex items-center gap-4 overflow-hidden border-b border-slate-300 bg-slate-100 px-3 py-1.5 font-mono text-[10px] text-slate-600" aria-hidden>
          <span className="flex gap-1"><i className="h-2 w-2 rounded-full bg-slate-400" /><i className="h-2 w-2 rounded-full bg-slate-300" /><i className="h-2 w-2 rounded-full bg-slate-300" /></span>
          {["Architecture", "Structure", "Systems", "Annotate", "View", "Manage"].map((t, i) => <span key={t} className={cn("hidden sm:inline", i === 0 && "border-b-2 border-blue-600 font-semibold text-slate-900")}>{t}</span>)}
          <span className="ml-auto truncate text-slate-500">Illustrative Revit-style workspace</span>
        </div>
        <div className="grid lg:grid-cols-[140px_1fr_150px]">
          <aside className="hidden border-r border-slate-300 bg-slate-100 p-2 lg:block" aria-label="Project browser (illustrative)">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Project browser</p>
            <ul className="mt-1 space-y-1.5">{tree.map(([k, v]) => <li key={k} className={cn("transition-opacity duration-500", v === "—" ? "opacity-40" : "opacity-100")}><p className="text-[11px] font-semibold text-slate-800">▸ {k}</p><p className="pl-3 text-[10px] leading-snug text-slate-500">{v}</p></li>)}</ul>
          </aside>
          <div className="min-w-0 bg-white"><div key={view} data-in="true" className="fade-in"><ViewCanvas view={view} layers={layers} rev={rev} hotDoor={s >= 5 && view !== "3d" ? "D-02" : null} title={`Revit-style ${VIEW_LABEL[view]} view of the illustrative model, step ${s + 1}`} /></div></div>
          <aside className="hidden border-l border-slate-300 bg-slate-100 p-2 lg:block" aria-label="Properties (illustrative)">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Properties</p>
            <dl className="mt-1 space-y-1">{props.map(([k, v]) => <div key={k}><dt className="font-mono text-[9px] uppercase text-slate-500">{k}</dt><dd className="text-[11px] font-medium text-slate-800">{v}</dd></div>)}</dl>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Model status</p>
            <ul className="mt-1 space-y-1">{status.map(([k, on]) => <li key={k} className="text-[10px] text-slate-600"><span>{k}</span><span className="mt-0.5 block h-1 bg-slate-300"><span className="block h-full bg-blue-600 transition-all duration-700" style={{ width: on ? "100%" : "0%" }} /></span></li>)}</ul>
          </aside>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-300 bg-slate-100 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-600"><span>{String(s + 1).padStart(2, "0")} · {HSTEPS[s]}</span><span className="hidden sm:inline">Model · {VIEW_LABEL[view]} · Level 01 · {s >= 5 ? "All disciplines" : "Building"}</span></div>
      </div>
      <div className="mt-3">
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-300">Model view</p>
        <div role="group" aria-label="Model view" className="flex gap-2 overflow-x-auto pb-1">
          {(Object.keys(VIEW_LABEL) as ViewId[]).map((v) => <button key={v} type="button" aria-pressed={view === v} onClick={() => { setAuto(false); setManual(v); }} className={cn(rchip(view === v, true), "shrink-0")}>{VIEW_LABEL[v]}</button>)}
        </div>
      </div>
    </div>
  );
}

/* ───────── bottleneck chain ───────── */

const CHAIN = ["Model update", "Drawings", "Schedules", "Coordination", "Project delivery"];
export function Bottleneck() {
  const [late, setLate] = useState(false);
  return (
    <div>
      <button type="button" role="switch" aria-checked={late} onClick={() => setLate((v) => !v)} className={rchip(late)}>{late ? "Model is out of date" : "Model is current"}</button>
      <ol className="mt-5 grid gap-2 md:grid-cols-5 md:gap-0">
        {CHAIN.map((c, i) => (
          <li key={c} className="relative md:pr-5">
            <div className={cn("h-full border p-4 transition-colors duration-500", late && i > 0 ? "border-orange-400 bg-orange-50" : late ? "border-orange-500 bg-white" : "border-slate-300 bg-white")} style={{ transitionDelay: late ? `${i * 160}ms` : "0ms" }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{c}</p>
              <p className={cn("mt-1 text-xs transition-opacity duration-500", late && i > 0 ? "text-orange-700 opacity-100" : "opacity-0")} style={{ transitionDelay: `${i * 160}ms` }}>Waiting on the model</p>
            </div>
            {i < 4 ? <span aria-hidden className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 bg-[#F8F7F4] px-1 text-copper-500 md:-right-0 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0">→</span> : null}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-slate-600">{late ? "One outdated model can create several downstream effects." : "When the model is current, drawings, schedules and coordination can keep moving."}</p>
    </div>
  );
}

/* ───────── looks right vs works right ───────── */

const DATA = ["Parameters", "Families", "Schedules", "Tags", "Views", "Sheets", "Project standards"];
export function LooksVsWorks() {
  const [works, setWorks] = useState(true);
  return (
    <div>
      <div role="group" aria-label="Model quality" className="mb-3 flex gap-2"><button type="button" aria-pressed={!works} onClick={() => setWorks(false)} className={rchip(!works)}>Looks correct</button><button type="button" aria-pressed={works} onClick={() => setWorks(true)} className={rchip(works)}>Works correctly</button></div>
      <div className="grid gap-4 [&>*]:min-w-0 lg:grid-cols-[1.2fr_1fr]">
        <Frame label={works ? "Geometry + data + documentation + standards" : "Geometry only"}><RevitScene layers={{ levels: true, arch: true, struct: works, mep: works }} title={works ? "Model with its data and documentation connected" : "Geometry only"} className="block h-auto w-full" /></Frame>
        <ul className="grid grid-cols-2 gap-2 self-start">
          <li className="col-span-2 border border-slate-900 bg-slate-900 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white">Geometry</li>
          {DATA.map((d, i) => <li key={d} className={cn("flex items-center gap-2 border px-3 py-2.5 text-sm transition-all duration-500", works ? "border-blue-600 bg-white text-slate-900" : "border-slate-200 bg-transparent text-slate-400")} style={{ transitionDelay: `${i * 70}ms` }}><span aria-hidden className={cn("h-2 w-2 shrink-0", works ? "bg-green-600" : "bg-slate-300")} />{d}</li>)}
        </ul>
      </div>
    </div>
  );
}

/* ───────── disciplines ───────── */

const DISC = [
  { id: "arch", t: "Architectural Revit", layers: { levels: true, arch: true } as SceneLayers, items: ["Walls", "Floors", "Roofs", "Doors", "Windows", "Rooms", "Ceilings", "Documentation"] },
  { id: "struct", t: "Structural Revit", layers: { levels: true, struct: true } as SceneLayers, items: ["Columns", "Beams", "Slabs", "Foundations", "Structural framing", "Documentation"] },
  { id: "mep", t: "MEP Revit", layers: { levels: true, mep: true } as SceneLayers, items: ["Ductwork", "Pipework", "Equipment", "Cable-related elements where applicable", "Systems", "Documentation"] },
];
export function DisciplineTabs() {
  const [i, setI] = useState(0);
  const d = DISC[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Frame label={d.t}><RevitScene layers={d.layers} title={`${d.t} model`} className="block h-auto w-full" /></Frame>
      <div className="space-y-4">
        <div role="tablist" aria-label="Discipline" className="flex gap-2 overflow-x-auto pb-1">{DISC.map((x, k) => <button key={x.id} role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} className={cn(rchip(i === k), "shrink-0")}>{x.t}</button>)}</div>
        <ul className="grid gap-1.5 sm:grid-cols-2">{d.items.map((x) => <li key={x} className="flex gap-2 border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-blue-600" />{x}</li>)}</ul>
        <p className="text-sm text-slate-600">Modelling and documentation support — design responsibility stays with the project&apos;s responsible professionals.</p>
      </div>
    </div>
  );
}

/* ───────── BEP ───────── */

const BEP = [["Naming", "File, view, sheet and element naming follow the plan."], ["Parameters", "Required parameters are set up as specified."], ["Worksets", "Workset structure follows the agreed approach."], ["LOD", "Modelling depth targets come from the plan."], ["Templates", "Project template and view templates are used."], ["Families", "Family conventions are followed."], ["Model structure", "Linked files and model division follow the plan."]];
export function BepDiagram() {
  const [i, setI] = useState(0);
  return (
    <div className="grid items-center gap-5 [&>*]:min-w-0 lg:grid-cols-[200px_1fr_180px]">
      <div className="border border-slate-900 bg-white p-4"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Document</p><p className="mt-1 text-base font-semibold text-slate-900">BIM execution plan</p>{[80, 60, 70, 50].map((w, k) => <span key={k} className="mt-2 block h-1.5 bg-slate-200" style={{ width: `${w}%` }} />)}</div>
      <div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">{BEP.map((b, k) => <li key={b[0]}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} onPointerEnter={() => setI(k)} onFocus={() => setI(k)} className={cn(rchip(i === k), "w-full normal-case")}>{b[0]}</button></li>)}</ul>
        <p aria-live="polite" className="mt-3 border-l-2 border-blue-600 bg-white px-4 py-3 text-sm text-slate-700">{BEP[i][1]} Where a plan exists, it governs modelling decisions.</p>
      </div>
      <div className="border border-blue-600 bg-blue-600 p-4 text-white"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue-100">Result</p><p className="mt-1 text-base font-semibold">Revit model</p></div>
    </div>
  );
}

/* ───────── project standard applied ───────── */

const STD_LIST = ["Title block", "Naming conventions", "BIM execution plan", "Templates", "Existing project standards", "Family conventions"];
const TREE_GENERIC = [["Level", "Level 1 · Level 2"], ["Floor plan", "Floor Plan 1"], ["Sheet", "Sheet 01"], ["Family", "Door 1"], ["Parameter", "Mark"]];
const TREE_STD = [["Level", "L01_GF · L02_FF"], ["Floor plan", "ARCH_Plan_L01"], ["Sheet", "A-101 · Ground floor"], ["Family", "ARCH_Door_Single_Internal"], ["Parameter", "Project_Door_Mark"]];
export function StandardApply() {
  const [on, setOn] = useState(true);
  return (
    <div className="grid items-start gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_auto_1.3fr]">
      <div className="border border-slate-300 bg-white p-4"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Project standard · supplied</p><ul className="mt-2 space-y-1.5 text-sm text-slate-800">{STD_LIST.map((x) => <li key={x} className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-blue-600" />{x}</li>)}</ul></div>
      <div className="flex items-center justify-center lg:flex-col"><button type="button" role="switch" aria-checked={on} onClick={() => setOn((v) => !v)} className={rchip(on)}>{on ? "Standard applied" : "Apply standard"}</button><span aria-hidden className="mx-3 text-copper-500 lg:mx-0 lg:my-2 lg:rotate-90">→</span></div>
      <div className="border border-slate-300 bg-white"><p className="border-b border-slate-200 bg-slate-50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Revit model · {on ? "follows the project standard" : "unstructured"}</p>
        <ul className="divide-y divide-slate-100 text-sm">{(on ? TREE_STD : TREE_GENERIC).map(([k, v], i) => <li key={k} className="flex justify-between gap-3 px-4 py-2.5"><span className="font-mono text-[11px] uppercase text-slate-500">{k}</span><span className={cn("font-medium transition-colors", on ? "text-slate-900" : "text-slate-400")} key={String(on) + i}>{v}</span></li>)}</ul>
        <p className="border-t border-slate-200 px-4 py-2 text-[11px] text-slate-500">Example names only — the project&apos;s own conventions are used.</p></div>
    </div>
  );
}

/* ───────── LOD (door example) ───────── */

const LOD = [
  { t: "Early design", use: "Massing and basic coordination", d: "A generic opening is enough." },
  { t: "Design development", use: "Coordination of sizes and positions", d: "Frame, leaf and type." },
  { t: "Documentation", use: "Drawings, tags and schedules", d: "Type data, hardware, tag." },
  { t: "Construction", use: "Detailed documentation", d: "Information the build needs." },
];
export function LodDoor() {
  const [i, setI] = useState(2);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.1fr_1fr]">
      <Frame label={`${LOD[i].t} · the same door`}><ElementIso kind="door" lod={i as 0 | 1 | 2 | 3} title={`Door modelled for ${LOD[i].t}`} className="mx-auto block h-auto w-full max-w-lg" /></Frame>
      <div className="space-y-4">
        <ol className="grid grid-cols-2 gap-2">{LOD.map((l, k) => <li key={l.t}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn(rchip(i === k), "w-full text-left")}>{String(k + 1).padStart(2, "0")} {l.t}</button></li>)}</ol>
        <dl className="border border-slate-300 bg-white text-sm">{[["LOD target", "Agreed per project"], ["Project stage", LOD[i].t], ["Downstream use", LOD[i].use]].map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-b border-slate-200 px-4 py-3 last:border-0"><dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{k}</dt><dd className="text-right font-medium text-slate-900">{v}</dd></div>)}</dl>
        <p className="text-sm text-slate-600">{LOD[i].d} The right depth depends on stage and downstream use — no fixed LOD number is assumed.</p>
      </div>
    </div>
  );
}

/* ───────── new model workflow ───────── */

const NEW = [
  { t: "Project brief", v: "3d" as ViewId, l: {} }, { t: "Template / standards", v: "3d" as ViewId, l: {} }, { t: "Levels & grids", v: "3d" as ViewId, l: { levels: true } },
  { t: "Core model", v: "3d" as ViewId, l: { levels: true, arch: true, struct: true } }, { t: "Families", v: "3d" as ViewId, l: { levels: true, arch: true, struct: true, mep: true } },
  { t: "Parameters", v: "3d" as ViewId, l: { levels: true, arch: true, struct: true, mep: true } }, { t: "Views", v: "plan" as ViewId, l: {} }, { t: "Sheets", v: "sheet" as ViewId, l: {} }, { t: "Schedules", v: "schedule" as ViewId, l: {} },
];
export function NewModel() {
  const [i, setI] = useState(3);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) return;
    const t = setTimeout(() => { if (i >= NEW.length - 1) setPlay(false); else setI(i + 1); }, 1500);
    return () => clearTimeout(t);
  }, [play, i]);
  const s = NEW[i];
  return (
    <div>
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Workflow step">
        <button type="button" onClick={() => { setI(0); setPlay(true); }} className={cn(rchip(play), "shrink-0")}>{play ? "Playing…" : "Play"}</button>
        {NEW.map((x, k) => <button key={x.t} type="button" aria-pressed={i === k} onClick={() => { setPlay(false); setI(k); }} className={cn(rchip(i === k), "shrink-0")}>{k + 1} · {x.t}</button>)}
      </div>
      <Frame label={`${i + 1} · ${s.t} — illustrative workflow, not every project follows these exact steps`}>
        <div key={i} data-in="true" className="fade-in"><ViewCanvas view={s.v} layers={s.l} hotDoor={i >= 4 ? "D-02" : null} hi3d={i === 4 ? "door" : null} title={`Model at the "${s.t}" step`} /></div>
      </Frame>
    </div>
  );
}

/* ───────── one change, multiple outputs ───────── */

export function ChangeDemo() {
  const [mode, setMode] = useState<"wall" | "level">("wall");
  const [moved, setMoved] = useState(false);
  const p = moved ? 3600 : 3000;
  const lvl = moved ? 3200 : 3000;
  const x = (mm: number) => 50 + mm * 0.05;
  const area = (w: number) => ((w / 1000) * 4).toFixed(1);
  const ly = 170 - lvl * 0.03;
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <div role="tablist" aria-label="Change type" className="flex gap-2">{(["wall", "level"] as const).map((m) => <button key={m} role="tab" type="button" aria-selected={mode === m} onClick={() => { setMode(m); setMoved(false); }} className={rchip(mode === m)}>{m === "wall" ? "Wall moved" : "Level changed"}</button>)}</div>
        <button type="button" role="switch" aria-checked={moved} onClick={() => setMoved((v) => !v)} className={rchip(moved)}>{moved ? "Revert change" : mode === "wall" ? "Move wall" : "Raise Level 02"}</button>
      </div>
      <div className="grid gap-3 [&>*]:min-w-0 md:grid-cols-2 lg:grid-cols-4">
        <Frame label={mode === "wall" ? "Floor plan" : "Floor plan · Level 02"}>
          <svg viewBox="0 0 400 260" className="block h-auto w-full" role="img" aria-label="Plan view" fill="none"><rect width="400" height="260" fill="#fff" />
            <rect x="50" y="40" width="300" height="200" stroke={C.line} strokeWidth="5" />
            {mode === "wall" ? <><path d={`M${x(p)} 42V238`} stroke={moved ? C.blue : C.line} strokeWidth="4" style={{ transition: "all .6s" }} />{moved ? <path d="M155 40 C 170 30 200 32 215 40 S 235 56 225 70" stroke={C.blue} strokeWidth="1.4" opacity="0" /> : null}
              <text x={(50 + x(p)) / 2} y="145" textAnchor="middle" fontSize="12" fill={C.line} style={mono}>ROOM A</text><text x={(x(p) + 350) / 2} y="145" textAnchor="middle" fontSize="12" fill={C.line} style={mono}>ROOM B</text></> : <text x="200" y="145" textAnchor="middle" fontSize="12" fill={C.line} style={mono}>LEVEL 02 · +{(lvl / 1000).toFixed(1)}</text>}
          </svg></Frame>
        <Frame label="Section">
          <svg viewBox="0 0 400 200" className="block h-auto w-full" role="img" aria-label="Section view" fill="none"><rect width="400" height="200" fill="#fff" />
            <path d="M30 170H370" stroke={C.line} strokeWidth="2.4" /><rect x="50" y={ly - 6} width="300" height="8" fill="#CBD5E1" stroke={C.line} style={{ transition: "all .6s" }} /><rect x="50" y="170" width="300" height="0" />
            {mode === "wall" ? <rect x={x(p) - 4} y="40" width="8" height="130" fill="#94A3B8" stroke={moved ? C.blue : C.line} style={{ transition: "all .6s" }} /> : <path d={`M50 ${ly - 6}H350`} stroke={C.blue} strokeDasharray="5 3" />}
            <rect x="46" y="40" width="8" height="130" fill="#94A3B8" stroke={C.line} /><rect x="346" y="40" width="8" height="130" fill="#94A3B8" stroke={C.line} /><path d="M46 40H354" stroke={C.line} strokeWidth="2" />
            <text x="60" y="24" fontSize="10" fill={C.arch} style={mono}>LEVEL 02 +{(lvl / 1000).toFixed(1)}</text></svg></Frame>
        <Frame label={mode === "wall" ? "Room information" : "Elevation"}>
          {mode === "wall" ? (
            <div className="grid min-h-[150px] content-center gap-2 bg-white p-4 text-sm">{[["Room A", area(p)], ["Room B", area(6000 - p)]].map(([k, v]) => <div key={k} className="flex justify-between border border-slate-200 px-3 py-2"><span className="font-mono text-[11px] uppercase text-slate-500">{k}</span><span className="font-semibold text-slate-900">{v} m²</span></div>)}<p className="text-[11px] text-slate-500">Boundaries follow the wall.</p></div>
          ) : (
            <svg viewBox="0 0 400 200" className="block h-auto w-full" role="img" aria-label="Elevation view" fill="none"><rect width="400" height="200" fill="#fff" /><path d="M30 170H370" stroke={C.line} strokeWidth="2.4" /><rect x="60" y="40" width="240" height="130" stroke={C.line} /><path d={`M300 ${ly}H340`} stroke={C.blue} strokeWidth="1.6" style={{ transition: "all .6s" }} /><text x="344" y={ly + 4} fontSize="10" fill={C.blue} style={mono}>+{(lvl / 1000).toFixed(1)}</text></svg>
          )}
        </Frame>
        <Frame label={mode === "wall" ? "Schedule" : "Related views"}>
          <div className="min-h-[150px] bg-white p-4 text-sm">
            {mode === "wall" ? <table className="w-full font-mono text-[11px]"><thead className="text-slate-500"><tr><th className="text-left font-normal">Room</th><th className="text-right font-normal">Area</th></tr></thead><tbody><tr className={moved ? "bg-blue-100" : ""}><td>A</td><td className="text-right">{area(p)} m²</td></tr><tr className={moved ? "bg-blue-100" : ""}><td>B</td><td className="text-right">{area(6000 - p)} m²</td></tr></tbody></table>
              : <ul className="space-y-1.5 text-[12px]">{["Section A-A", "South elevation", "Floor plan · Level 02", "Level label on every view"].map((v) => <li key={v} className={cn("flex items-center justify-between border px-3 py-1.5", moved ? "border-blue-600 bg-blue-50" : "border-slate-200")}>{v}<span className="font-mono text-[10px] text-blue-700">{moved ? "updated" : "current"}</span></li>)}</ul>}
          </div>
        </Frame>
      </div>
      <p className="mt-3 text-xs text-slate-500">Illustrative. Not every element updates every output — the point is that changes are tracked through the views and schedules that depend on them.</p>
    </div>
  );
}

/* ───────── worksets & linked models ───────── */

const WS = [
  { k: "arch", t: "Architecture", l: { levels: true, arch: true } as SceneLayers, d: "Architectural model — its own file or workset." },
  { k: "struct", t: "Structure", l: { levels: true, struct: true } as SceneLayers, d: "Structural model, often linked into the others." },
  { k: "mep", t: "MEP", l: { levels: true, mep: true } as SceneLayers, d: "Services model linked for coordination." },
  { k: "link", t: "Linked model", l: { levels: true, arch: true, struct: true, mep: true } as SceneLayers, d: "Separate files brought together by links." },
  { k: "ws", t: "Worksets", l: { levels: true, arch: true, struct: true, mep: true } as SceneLayers, d: "Division inside one file, based on how the team works." },
];
export function WorksetViewer() {
  const [i, setI] = useState(3);
  const w = WS[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Frame label={w.t}><RevitScene layers={w.l} title={`${w.t} view of the model division`} className="block h-auto w-full" /></Frame>
      <div className="space-y-4">
        <div role="group" aria-label="Model division" className="flex flex-wrap gap-2">{WS.map((x, k) => <button key={x.k} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={rchip(i === k)}>{x.t}</button>)}</div>
        <p aria-live="polite" className="border-l-2 border-blue-600 bg-white px-4 py-3 text-sm text-slate-700">{w.d}</p>
        <p className="text-sm text-slate-600">The actual division depends on how the project team collaborates — no single structure fits every project.</p>
      </div>
    </div>
  );
}

/* ───────── family + parameters ───────── */

const FAM: Record<string, { title: string; kind: "door" | "window" | "equipment"; rows: [string, string][] }> = {
  door: { title: "Door", kind: "door", rows: [["Category", "Doors"], ["Family", "Single-Flush"], ["Type", "Internal"], ["Level", "Level 01"], ["Dimensions", "820 × 2040"], ["Parameters", "Type mark · fire rating · finish"]] },
  window: { title: "Window", kind: "window", rows: [["Category", "Windows"], ["Family", "Awning"], ["Type", "2100 × 1200"], ["Level", "Level 01"], ["Dimensions", "2100 × 1200"], ["Parameters", "Type mark · glazing · sill height"]] },
  equipment: { title: "Equipment", kind: "equipment", rows: [["Category", "Mechanical Equipment"], ["Family", "Custom AHU"], ["Type", "AHU-01"], ["Level", "Level 01"], ["Dimensions", "Per family"], ["Parameters", "System · connection · reference"]] },
};
export function FamilyParams() {
  const [k, setK] = useState("door");
  const [hot, setHot] = useState<string | null>(null);
  const f = FAM[k];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.1fr_1fr]">
      <Frame label="Family · 3D component"><ElementIso kind={f.kind} lod={hot ? 3 : 2} glow={!!hot} title={`${f.title} family component`} className="mx-auto block h-auto w-full max-w-lg" /></Frame>
      <div className="space-y-4">
        <div role="group" aria-label="Example family" className="flex gap-2">{Object.entries(FAM).map(([id, v]) => <button key={id} type="button" aria-pressed={k === id} onClick={() => setK(id)} className={rchip(k === id)}>{v.title}</button>)}</div>
        <dl className="border border-slate-300 bg-white text-sm">{f.rows.map(([a, b]) => <div key={a} tabIndex={0} onPointerEnter={() => setHot(a)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(a)} onBlur={() => setHot(null)} className={cn("flex justify-between gap-3 border-b border-slate-200 px-4 py-2.5 outline-none transition-colors last:border-0", hot === a ? "bg-blue-50" : "")}><dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{a}</dt><dd className="text-right font-medium text-slate-900">{b}</dd></div>)}</dl>
        <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-600"><li className="border border-slate-900 bg-slate-900 px-2 py-1 text-white">Model</li><li aria-hidden>→</li><li className="border border-slate-300 bg-white px-2 py-1">Tag</li><li aria-hidden>→</li><li className="border border-slate-300 bg-white px-2 py-1">Schedule</li></ol>
        <p className="text-sm text-slate-600">Families need to behave correctly inside the project. Parameters here are examples — not every family carries every parameter.</p>
      </div>
    </div>
  );
}

/* ───────── signature: one element → many outputs ───────── */

const ONE = ["D-01", "D-02", "W-05"];
export function OneElement() {
  const [id, setId] = useState("D-02");
  const o = openingOf(id)!;
  const kind = o.kind === "door" ? "door" : "window";
  const cells = ["3D model", "Plan", "Elevation", "Tag", "Schedule", "Sheet"];
  return (
    <div>
      <div role="group" aria-label="Element" className="mb-4 flex gap-2">{ONE.map((x) => <button key={x} type="button" aria-pressed={id === x} onClick={() => setId(x)} className={rchip(id === x, true)}>{x}</button>)}</div>
      <ol key={id} data-in="true" className="grid gap-3 [&>*]:min-w-0 sm:grid-cols-2 lg:grid-cols-3">
        {cells.map((c, i) => (
          <li key={c} className="fade-in" style={css({ "--d": `${i * 220}ms` })}>
            <div className="h-full overflow-hidden border border-slate-600 bg-white">
              <p className="flex justify-between border-b border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600"><span>{String(i + 1).padStart(2, "0")} · {c}</span><span className="text-blue-700">{id}</span></p>
              {i === 0 ? <ElementIso kind={kind} lod={2} glow title={`${id} as a 3D component`} className="block h-auto w-full" /> : null}
              {i === 1 ? <PlanSvg interact={{ hi: [id] }} layers={{ dims: false, marks: false, furniture: false, grid: false }} title={`${id} on the plan`} className="block h-auto w-full" /> : null}
              {i === 2 ? (["D-01", "W-05"].includes(id) ? <ElevSvg hi={[id]} title={`${id} on the elevation`} className="block h-auto w-full" /> : <svg viewBox="0 0 360 200" className="block h-auto w-full" role="img" aria-label={`Interior elevation showing ${id}`} fill="none"><rect width="360" height="200" fill="#fff" /><path d="M20 170H340" stroke={C.line} strokeWidth="2.4" /><rect x="40" y="30" width="280" height="140" fill="#F8FAFC" stroke={C.line} /><rect x="150" y="62" width="58" height="108" fill="#DBEAFE" stroke={C.blue} strokeWidth="2.4" /><circle cx="198" cy="120" r="3" fill={C.line} /><text x="179" y="54" textAnchor="middle" fontSize="11" fill={C.blue} style={mono}>{id}</text></svg>) : null}
              {i === 3 ? <div className="grid h-[150px] place-items-center bg-white"><span className="border-2 border-blue-600 bg-blue-50 px-4 py-3 text-center font-mono text-sm text-blue-800">{id}<br /><span className="text-[11px]">{o.type} · {o.size}</span></span></div> : null}
              {i === 4 ? <div className="bg-white p-3"><DoorTable hot={id} className="text-[10px]" /></div> : null}
              {i === 5 ? <div className="bg-white"><SheetView hotDoor={id} /></div> : null}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">One element in the model → plan, elevation, tag, schedule and sheet · illustrative</p>
    </div>
  );
}

/* ───────── model ↔ tag ↔ schedule ───────── */

export function ModelTagSchedule() {
  const [hot, setHot] = useState<string | null>("D-04");
  const [wrong, setWrong] = useState(false);
  const o = openingOf(hot ?? "D-04")!;
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.3fr_1fr]">
      <Frame label="Model · hover a door"><PlanSvg interact={{ mode: "openings", hi: hot ? [hot] : [], onHover: (x) => x && setHot(x), onPick: setHot }} layers={{ dims: false, marks: false }} title="Plan with door tags linked to a schedule" className="block h-auto w-full touch-manipulation" /></Frame>
      <div className="space-y-4">
        <div className="flex items-center gap-3"><span className="border-2 border-blue-600 bg-blue-50 px-3 py-2 font-mono text-sm text-blue-800">{o.id} · {o.type}</span><span className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">Tag</span></div>
        <div className="border border-slate-300 bg-white">
          <table className="w-full table-fixed border-collapse font-mono text-[11px] text-slate-700"><caption className="border-b border-slate-300 bg-slate-100 px-3 py-2 text-left uppercase tracking-[0.14em]">Door schedule</caption>
            <thead><tr className="text-slate-500"><th className="w-[18%] px-3 py-1.5 text-left font-normal">Mark</th><th className="text-left font-normal">Type</th><th className="text-left font-normal">Size</th></tr></thead>
            <tbody>{DOORS.map((d) => { const bad = wrong && d.id === hot; return <tr key={d.id} onPointerEnter={() => setHot(d.id)} className={cn("border-b border-slate-100 transition-colors", hot === d.id ? (bad ? "bg-orange-100" : "bg-blue-100 font-semibold text-blue-800") : "")}><td className="px-3 py-1.5">{d.id}</td><td>{bad ? d.id : d.type}</td><td>{d.size}</td></tr>; })}</tbody></table>
        </div>
        <button type="button" role="switch" aria-checked={wrong} onClick={() => setWrong((v) => !v)} className={cn(rchip(wrong), wrong && "!border-orange-600 !bg-orange-600")}>{wrong ? "Schedule pulls the wrong parameter" : "Schedule pulls the right parameter"}</button>
        <p aria-live="polite" className="text-sm text-slate-600">{wrong ? "The geometry is fine, but the Type column shows the mark. A schedule wired to the wrong parameter undermines confidence in the model's data." : "Tag and schedule read the same parameters, so they agree with each other and with the model."}</p>
      </div>
    </div>
  );
}

/* ───────── documentation matrix ───────── */

const MATRIX: [string, boolean[], string][] = [
  [("Window type A"), [true, true, true, true], "W-05"], [("Door type B"), [true, false, true, true], "D-02"], [("Wall type 1"), [true, true, true, false], "D-04"], [("Room · Kitchen"), [true, true, false, true], "D-04"],
];
export function DocMatrix() {
  const [i, setI] = useState(0);
  const heads = ["Plan", "Section", "Elevation", "Schedule"];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.3fr_1fr]">
      <Frame label="Drawing sheet generated from the model"><SheetView hotDoor={MATRIX[i][2]} /></Frame>
      <div>
        <div className="border border-slate-300 bg-white text-sm">
          <div className="grid grid-cols-[1.3fr_repeat(4,1fr)] border-b border-slate-300 bg-slate-100 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-600"><span>Element</span>{heads.map((h) => <span key={h} className="text-center">{h}</span>)}</div>
          {MATRIX.map(([n, c], k) => (
            <button key={n} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("grid w-full grid-cols-[1.3fr_repeat(4,1fr)] items-center border-b border-slate-200 px-3 py-3 text-left text-sm last:border-0", i === k ? "bg-blue-50 font-semibold text-blue-900" : "hover:bg-slate-50")}>
              <span>{n}</span>{c.map((v, j) => <span key={j} className="text-center" aria-label={`${heads[j]}: ${v ? "yes" : "not shown"}`}>{v ? "●" : "–"}</span>)}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600">The model is the central source — an element appears where its views and schedules call for it.</p>
      </div>
    </div>
  );
}

/* ───────── audit ───────── */

const AUDIT = [
  { t: "Inherited model", d: "A model arrives. What is inside it isn't yet clear." },
  { t: "Model review", d: "Structure, families, parameters, views, sheets, documentation consistency and project standards are reviewed." },
  { t: "Handover / continued management", d: "Findings are walked through so the team can take over with confidence." },
];
const TREE = [["Model structure", "w"], ["Families", "w"], ["Parameters", "o"], ["Views", "w"], ["Sheets", "w"], ["Documentation consistency", "o"], ["Project standards", "w"]];
export function Audit() {
  const [i, setI] = useState(1);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_1fr]">
      <div>
        <ol className="space-y-2">{AUDIT.map((a, k) => <li key={a.t}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("w-full border p-4 text-left transition-colors", i === k ? "border-blue-600 bg-white" : "border-slate-300 hover:border-slate-900")}><span className="font-mono text-[10px] text-slate-500">{String(k + 1).padStart(2, "0")}</span><span className="block text-base font-semibold text-slate-900">{a.t}</span><span className="mt-1 block text-sm text-slate-600">{a.d}</span></button></li>)}</ol>
      </div>
      <div className="border border-slate-300 bg-white"><p className="border-b border-slate-200 bg-slate-50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Model contents · illustrative</p>
        <ul className="divide-y divide-slate-100">{TREE.map(([k, s]) => (
          <li key={k} className="flex items-center justify-between px-4 py-2.5 text-sm"><span className="text-slate-800">{k}</span>
            <span className={cn("font-mono text-[10px] uppercase tracking-[0.12em] transition-colors", i === 0 ? "text-slate-400" : i === 1 ? (s === "o" ? "text-orange-600" : "text-slate-500") : "text-green-700")}>{i === 0 ? "unknown" : i === 1 ? (s === "o" ? "needs attention" : "reviewed") : "documented"}</span></li>))}</ul></div>
    </div>
  );
}

/* ───────── handover table ───────── */

const HST = [
  { t: "Design", cols: ["Mark", "Type", "Level"] }, { t: "Construction", cols: ["Mark", "Type", "Level", "Size", "Sheet ref"] }, { t: "Handover", cols: ["Mark", "Type", "Level", "Size", "Asset ref", "Warranty ref", "Maintenance access"] },
];
export function HandoverTable() {
  const [i, setI] = useState(2);
  return (
    <div>
      <ol className="grid gap-2 sm:grid-cols-3">{HST.map((h, k) => <li key={h.t}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn(rchip(i === k), "w-full text-left")}>{String(k + 1).padStart(2, "0")} {h.t}</button></li>)}</ol>
      <div className="mt-4 overflow-x-auto border border-slate-300 bg-white">
        <table className="w-full min-w-[420px] border-collapse text-left font-mono text-[11px] text-slate-700"><thead><tr className="bg-slate-100 text-slate-600">{HST[i].cols.map((c) => <th key={c} className="px-3 py-2 font-normal uppercase tracking-[0.1em]">{c}</th>)}</tr></thead>
          <tbody>{[0, 1].map((r) => <tr key={r} className="border-t border-slate-100">{HST[i].cols.map((c, k) => <td key={c} className="px-3 py-2">{["AHU-0" + (r + 1), "Custom AHU", "Level 01", "Per family", "Per brief", "Per brief", "Per brief"][k] ?? "—"}</td>)}</tr>)}</tbody></table>
      </div>
      <p className="mt-3 text-sm text-slate-600">Information needs grow through the project. Handover data is scoped around the project&apos;s intended handover requirements — where included in the brief.</p>
    </div>
  );
}

/* ───────── revision control ───────── */

const ISS = [
  { t: "Issue 01", ch: "Initial issue", rev: 0, status: "Issued" }, { t: "Issue 02", ch: "Wall moved · door relocated", rev: 3, status: "Revised" }, { t: "Issue 03", ch: "Change reviewed and carried through", rev: 3, status: "Current" },
];
export function Revisions() {
  const [i, setI] = useState(1);
  const s = ISS[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Frame label={`${s.t} · ${s.status}`}><div className="bg-white"><PlanSvg rev={s.rev} layers={{ marks: false }} title={`Plan at ${s.t}`} className="block h-auto w-full" /></div></Frame>
      <div className="space-y-4">
        <ol className="flex flex-wrap gap-2" aria-label="Issues">{ISS.map((x, k) => <li key={x.t}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={rchip(i === k)}>{x.t}</button></li>)}</ol>
        <dl className="border border-slate-300 bg-white text-sm">{[["Previous", i > 0 ? ISS[i - 1].t : "—"], ["Current", s.t], ["Change", s.ch]].map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-b border-slate-200 px-4 py-3 last:border-0"><dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{k}</dt><dd className="text-right font-medium text-slate-900">{v}</dd></div>)}</dl>
        <p className="text-sm text-slate-600">Revisions are tracked against the previous issue, so it&apos;s always clear which version of the model a sheet reflects.</p>
      </div>
    </div>
  );
}

/* ───────── process ───────── */

const PL: { l: SceneLayers; v: ViewId }[] = [{ l: {}, v: "3d" }, { l: {}, v: "3d" }, { l: { levels: true, arch: true, struct: true, mep: true }, v: "3d" }, { l: { levels: true, arch: true, struct: true, mep: true }, v: "plan" }, { l: { levels: true, arch: true, struct: true, mep: true }, v: "sheet" }];
export function RevitProcess({ steps }: { steps: { title: string; description: string }[] }) {
  const { ref, stage } = useScrollStage(steps.length, false);
  return (
    <div ref={ref} style={css({ "--p": 0 })} className="relative">
      <span aria-hidden className="absolute left-[15px] top-0 h-full w-px bg-slate-300 lg:hidden"><span className="block h-full w-full origin-top bg-copper-500" style={{ transform: "scaleY(var(--p))" }} /></span>
      <span aria-hidden className="absolute left-0 right-0 top-[15px] hidden h-px bg-slate-300 lg:block"><span className="block h-full w-full origin-left bg-copper-500" style={{ transform: "scaleX(var(--p))" }} /></span>
      <ol className="grid gap-8 lg:grid-cols-5 lg:gap-5">
        {steps.map((s, i) => (
          <li key={s.title} className={cn("relative min-w-0 pl-12 transition-opacity duration-500 lg:pl-0 lg:pt-12", i <= stage ? "opacity-100" : "opacity-50")}>
            <span aria-hidden className={cn("absolute left-2 top-1 h-[14px] w-[14px] border-2 bg-[#F8F7F4] lg:left-0 lg:top-2", i <= stage ? "border-copper-500" : "border-slate-400")} />
            <p className="font-mono text-xs tracking-[0.16em] text-copper-600">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 text-base font-semibold tracking-tight text-slate-900">{s.title}</h3>
            <div className="mt-3 hidden overflow-hidden border border-slate-300 sm:block"><ViewCanvas view={PL[i].v} layers={PL[i].l} title={`Step ${i + 1} of the workflow`} /></div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────── CTA: model → plan → section → schedule → sheet ───────── */

const CV: ViewId[] = ["3d", "plan", "section", "schedule", "sheet"];
export function CtaRevit() {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { setSeen(true); ob.disconnect(); } }, { threshold: 0.3 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  useEffect(() => {
    if (!seen || reduced()) return;
    const t = setTimeout(() => setI((v) => (v + 1) % CV.length), 2200);
    return () => clearTimeout(t);
  }, [seen, i]);
  return (
    <div ref={ref} className="overflow-hidden border border-slate-500 bg-white">
      <div key={CV[i]} data-in="true" className="fade-in"><ViewCanvas view={CV[i]} layers={{ levels: true, arch: true, struct: true, mep: true }} title={`The model shown as ${VIEW_LABEL[CV[i]]}`} /></div>
      <p className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">{CV.map((v, k) => <span key={v} className={k === i ? "text-blue-700" : ""}>{k > 0 ? " → " : ""}{VIEW_LABEL[v]}</span>)}</p>
    </div>
  );
}

export { OPENINGS, WINDOWS };
