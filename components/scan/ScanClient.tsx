"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollStage } from "@/components/structural/useScrollStage";
import { chip } from "@/components/arch/ui";
import { ScanScene, FloorsStack, WallFidelity, HeritageSvg, ColumnMeasure, PlantScene, stageLayers, K, mono, type ScanLayers, type ScanFocus } from "./ScanModel";

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

/* ───────── hero ───────── */

const HST = ["Existing", "Point cloud", "Registered", "Model", "As-built"];
const TAGS = [["Scan", 1], ["Registered", 2], ["Reference", 2], ["Model", 3], ["As-built", 4]] as const;

export function HeroScan() {
  const [s, setS] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    if (reduced()) { const t = setTimeout(() => setS(4), 0); return () => clearTimeout(t); }
    if (s >= 4) return;
    const t = setTimeout(() => setS((v) => v + 1), s === 0 ? 2400 : 2300);
    return () => clearTimeout(t);
  }, [s, auto]);
  return (
    <div>
      <div className="relative overflow-hidden border border-sky-300/25 bg-[#0B1B33] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
        <ScanScene L={stageLayers(s)} title="An existing building shown as the building, a point cloud, a registered scan, a BIM model and an as-built model" className="block h-auto w-full" />
        <ul className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1 sm:left-3 sm:top-3" aria-hidden>
          {TAGS.map(([t, n]) => <li key={t} className={cn("border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors duration-700 sm:text-[10px]", s >= n ? "border-sky-300 bg-sky-300/20 text-sky-100" : "border-slate-500/50 text-slate-400")}>{t}</li>)}
        </ul>
        <p className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300">{HST[s]} · illustrative</p>
      </div>
      <div className="mt-3">
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-300">Scan stage</p>
        <div role="group" aria-label="Scan stage" className="flex gap-2 overflow-x-auto pb-1">{HST.map((h, i) => <button key={h} type="button" aria-pressed={s === i} onClick={() => { setAuto(false); setS(i); }} className={cn(chip(s === i, true), "shrink-0")}>{h}</button>)}</div>
      </div>
    </div>
  );
}

/* ───────── signature: reality → use ───────── */

const SIG: { t: string; d: string; L: ScanLayers; f?: ScanFocus }[] = [
  { t: "Reality", d: "The existing building, as it stands.", L: { existing: true } },
  { t: "Capture", d: "A laser scan records it from scan positions.", L: { existing: true, cloud: "raw", scanner: true } },
  { t: "Data", d: "The result is a point cloud — a record of what exists.", L: { cloud: "raw" } },
  { t: "Alignment", d: "Scans are registered to a shared reference.", L: { cloud: "clean", markers: true } },
  { t: "Interpretation", d: "Points are read as walls, floors, columns and openings.", L: { cloud: "faint", model: true, parts: { arch: true } }, f: "wall" },
  { t: "BIM", d: "The result is a working Revit model.", L: { cloud: "off", model: true, parts: { arch: true, struct: true, mep: true } } },
  { t: "Use", d: "Renovation, retrofit and asset documentation start from it.", L: { cloud: "off", model: true, proposed: true, labels: true, parts: { arch: true, struct: true, mep: true } } },
];
export function SignatureFlow() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || reduced()) return;
    const t = setTimeout(() => setI((v) => (v + 1) % SIG.length), 2400);
    return () => clearTimeout(t);
  }, [i, auto]);
  const s = SIG[i];
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <Panel label={`${String(i + 1).padStart(2, "0")} · ${s.t}`}><ScanScene L={s.L} focus={s.f ?? null} title={`The building at the "${s.t}" step`} className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <ol className="space-y-1.5">{SIG.map((x, k) => <li key={x.t}><button type="button" aria-pressed={i === k} onClick={() => { setAuto(false); setI(k); }} className={cn("flex w-full items-center gap-3 border px-3 py-2.5 text-left text-sm transition-colors", i === k ? "border-sky-300 bg-sky-300/10 text-white" : k < i ? "border-slate-600 text-slate-300" : "border-slate-700 text-slate-500")}><span className="font-mono text-[10px] opacity-70">{String(k + 1).padStart(2, "0")}</span>{x.t}{k < i ? <span aria-hidden className="ml-auto text-green-400">✓</span> : null}</button></li>)}</ol>
        <p aria-live="polite" className="border-l-2 border-sky-300 px-4 py-2 text-sm text-slate-200">{s.d}</p>
      </div>
    </div>
  );
}

/* ───────── point cloud ↔ BIM ───────── */

const CT = [
  { k: "cloud", l: "Point cloud", L: { cloud: "clean" } as ScanLayers }, { k: "overlay", l: "Overlay", L: { cloud: "faint", model: true, parts: { arch: true, struct: true, mep: true } } as ScanLayers }, { k: "model", l: "BIM model", L: { model: true, parts: { arch: true, struct: true, mep: true } } as ScanLayers },
];
export function CloudToggle() {
  const [i, setI] = useState(0);
  return (
    <div>
      <div role="group" aria-label="View" className="mb-3 flex gap-2 overflow-x-auto pb-1">{CT.map((c, k) => <button key={c.k} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn(chip(i === k, true), "shrink-0")}>{c.l}</button>)}</div>
      <Panel label={`${CT[i].l} · same building, same geometry`}><ScanScene L={CT[i].L} title={`The building as ${CT[i].l}`} className="mx-auto block h-auto w-full max-w-3xl" /></Panel>
    </div>
  );
}

/* ───────── points → elements ───────── */

const MAP: { f: Exclude<ScanFocus, null>; from: string; to: string }[] = [
  { f: "wall", from: "Wall surface", to: "Wall" }, { f: "floor", from: "Points clustered at floor level", to: "Floor" }, { f: "column", from: "Vertical point structure", to: "Column" },
  { f: "opening", from: "Opening in the scan", to: "Door / window" }, { f: "mep", from: "Visible pipe or duct", to: "MEP element" },
];
export function ElementMap() {
  const [i, setI] = useState(0);
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label={`${MAP[i].from} → ${MAP[i].to}`}><ScanScene L={{ cloud: "faint" }} focus={MAP[i].f} title={`Points forming a ${MAP[i].to.toLowerCase()} highlighted in the point cloud`} className="block h-auto w-full" /></Panel>
      <div className="space-y-3">
        <ul className="space-y-1.5">{MAP.map((m, k) => <li key={m.f}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} onPointerEnter={() => setI(k)} onFocus={() => setI(k)} className={cn("grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 border px-3 py-2.5 text-left text-sm transition-colors", i === k ? "border-sky-300 bg-sky-300/10 text-white" : "border-slate-700 text-slate-400")}><span>{m.from}</span><span aria-hidden className="text-amber-400">→</span><span className="font-semibold">{m.to}</span></button></li>)}</ul>
        <p className="text-xs text-slate-400">Not every visible object becomes a BIM element — the final scope depends on project requirements.</p>
      </div>
    </div>
  );
}

/* ───────── registration ───────── */

export function RegistrationSlider({ n = 3 }: { n?: number }) {
  const [v, setV] = useState(0);
  const off = 1 - v / 100;
  return (
    <div>
      <Panel label={`Registration check · floor alignment · ${v > 90 ? "aligned" : v < 10 ? "before" : "registering"}`}><FloorsStack n={n} off={off} title={n === 3 ? "Three floors scanned in separate sessions, shown before and after registration" : "Four floors shown unaligned and then tied to a shared reference"} className="mx-auto block h-auto w-full max-w-3xl" /></Panel>
      <div className="mx-auto mt-3 flex max-w-3xl items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">Before</span>
        <input type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} aria-label="Compare before and after registration" className="h-8 flex-1 accent-sky-400" />
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">After</span>
        <button type="button" onClick={() => setV(v > 50 ? 0 : 100)} className={chip(false, true)}>{v > 50 ? "Reset" : "Register"}</button>
      </div>
    </div>
  );
}

/* ───────── fidelity ───────── */

const NEED = [
  ["Existing-condition documentation", "Often favours keeping measured irregularity."], ["Renovation design", "May favour a simplified model designers can draw on."], ["Retrofit coordination", "Usually balances fidelity where new work meets old."],
  ["Heritage documentation", "May call for higher fidelity."], ["Asset model", "Depends on how the model will be used."],
];
export function FidelitySlider() {
  const [v, setV] = useState(0.5);
  const [n, setN] = useState(0);
  return (
    <div>
      <Panel label="Project-specific modelling decision"><WallFidelity v={v} className="block h-auto w-full" /></Panel>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 sm:flex-nowrap">
        <span className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-600">More idealised</span>
        <input type="range" min={0} max={100} value={Math.round(v * 100)} onChange={(e) => setV(Number(e.target.value) / 100)} aria-label="As-built fidelity versus design idealisation" className="order-last h-8 w-full accent-blue-600 sm:order-none sm:w-auto sm:flex-1" />
        <span className="w-28 shrink-0 text-right font-mono text-[10px] uppercase tracking-[0.1em] text-slate-600">More as-built fidelity</span>
      </div>
      <div className="mt-5 grid gap-4 [&>*]:min-w-0 md:grid-cols-[1fr_1fr]">
        <ul className="flex flex-wrap gap-2" aria-label="What does the project need?">{NEED.map(([t], k) => <li key={t}><button type="button" aria-pressed={n === k} onClick={() => setN(k)} className={cn("min-h-[40px] border px-3 py-2 text-xs transition-colors", n === k ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-900")}>{t}</button></li>)}</ul>
        <p aria-live="polite" className="border-l-2 border-blue-600 bg-white px-4 py-3 text-sm text-slate-700"><strong className="block text-slate-900">What does the project need?</strong>{NEED[n][1]} Neither end is automatically right — the choice is agreed per project.</p>
      </div>
    </div>
  );
}

/* ───────── heritage ───────── */

const HV = [["building", "Building"], ["scan", "Scan"], ["cloud", "Point cloud"], ["model", "BIM element"]] as const;
export function Heritage() {
  const [v, setV] = useState<(typeof HV)[number][0]>("model");
  const [f, setF] = useState<0 | 1>(1);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.3fr_1fr]">
      <Panel label={v === "building" ? "Facade · zoom into one element" : `${HV.find((x) => x[0] === v)![1]} · ${f ? "higher fidelity" : "standard as-built"}`}><HeritageSvg view={v} fid={f} title={`Heritage facade element: ${v}`} className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <div role="group" aria-label="Stage" className="flex gap-2 overflow-x-auto pb-1">{HV.map(([k, l]) => <button key={k} type="button" aria-pressed={v === k} onClick={() => setV(k)} className={cn(chip(v === k, true), "shrink-0")}>{l}</button>)}</div>
        <div role="group" aria-label="Fidelity" className="flex gap-2"><button type="button" aria-pressed={f === 0} onClick={() => setF(0)} className={chip(f === 0, true)}>Standard as-built</button><button type="button" aria-pressed={f === 1} onClick={() => setF(1)} className={chip(f === 1, true)}>Higher fidelity</button></div>
        <ul className="grid grid-cols-2 gap-1.5 text-sm text-slate-200">{["Decorative moulding", "Irregular opening", "Ornamental element", "Non-standard geometry"].map((x) => <li key={x} className="border border-slate-700 px-3 py-2">{x}</li>)}</ul>
        <p className="text-xs text-slate-400">Required fidelity is project-specific. No heritage certification or conservation approval is implied.</p>
      </div>
    </div>
  );
}

/* ───────── structural measurement ───────── */

const SM = ["Existing structure", "Point cloud", "Measurements", "Structural review"];
export function StructMeasure() {
  const [i, setI] = useState(2);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_1fr]">
      <Panel label={`${SM[i]} · illustrative geometry`}><ColumnMeasure step={i as 0 | 1 | 2 | 3} className="mx-auto block h-auto w-full max-w-md" /></Panel>
      <div className="space-y-4">
        <ol className="space-y-1.5">{SM.map((s, k) => <li key={s}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn(chip(i === k), "flex w-full items-center gap-3 text-left normal-case")}><span className="font-mono text-[10px] opacity-70">{k + 1}</span>{s}</button></li>)}</ol>
        <ul className="grid grid-cols-2 gap-1.5 text-sm text-slate-700">{["Out-of-plumb column", "Deflection", "Alignment", "Existing geometry"].map((x) => <li key={x} className="border border-slate-300 bg-white px-3 py-2">{x}</li>)}</ul>
        <p className="border-l-2 border-blue-600 bg-white px-4 py-3 text-sm text-slate-700">Where the scan informs structural assessment, the required measurements are coordinated with the responsible structural engineer, who decides what they mean.</p>
      </div>
    </div>
  );
}

/* ───────── disciplines ───────── */

const DISC = [
  { t: "Architectural", parts: { arch: true }, items: ["Walls", "Floors", "Doors", "Windows", "Roofs", "Spaces"] },
  { t: "Structural", parts: { struct: true }, items: ["Columns", "Beams", "Slabs", "Foundations where identifiable / scoped"] },
  { t: "MEP", parts: { mep: true }, items: ["Visible existing services", "Ductwork", "Pipework", "Equipment"] },
];
export function Disciplines() {
  const [i, setI] = useState(0);
  const d = DISC[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label={`${d.t} as-built model`}><ScanScene L={{ model: true, parts: d.parts }} title={`${d.t} elements modelled from the scan`} className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <div role="tablist" aria-label="Discipline" className="flex gap-2 overflow-x-auto pb-1">{DISC.map((x, k) => <button key={x.t} role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} className={cn(chip(i === k), "shrink-0")}>{x.t}</button>)}</div>
        <ul className="grid gap-1.5 sm:grid-cols-2">{d.items.map((x) => <li key={x} className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">{x}</li>)}</ul>
        <p className="text-sm text-slate-600">Scope depends on project requirements and on what the scan data actually captured.</p>
      </div>
    </div>
  );
}

/* ───────── renovation / retrofit / facilities ───────── */

const REN = [
  { t: "Existing building", L: { existing: true } as ScanLayers }, { t: "Scan", L: { cloud: "clean", markers: true } as ScanLayers }, { t: "BIM model", L: { model: true, parts: { arch: true, struct: true, mep: true } } as ScanLayers },
  { t: "Renovation design", L: { model: true, proposed: true, parts: { arch: true, struct: true } } as ScanLayers }, { t: "Updated documentation", L: { model: true, proposed: true, labels: true, parts: { arch: true, struct: true } } as ScanLayers },
];
export function RenoFlow() {
  const [i, setI] = useState(3);
  return (
    <div>
      <div role="group" aria-label="Step" className="mb-3 flex gap-2 overflow-x-auto pb-1">{REN.map((r, k) => <button key={r.t} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn(chip(i === k), "shrink-0")}>{k + 1} · {r.t}</button>)}</div>
      <Panel label={`${REN[i].t}${i === 3 ? " · the scan doesn't design the renovation — it gives designers the existing condition" : ""}`}><ScanScene L={REN[i].L} title={`Renovation workflow: ${REN[i].t}`} className="mx-auto block h-auto w-full max-w-3xl" /></Panel>
    </div>
  );
}

export function RetrofitView() {
  const [v, setV] = useState<"existing" | "proposed" | "both">("both");
  const L: ScanLayers = { model: v !== "proposed", parts: { arch: true, struct: true, mep: true }, proposed: v !== "existing" };
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label="Existing frame, services and walls · proposed intervention"><ScanScene L={L} title="Existing as-built model with a proposed intervention overlaid" className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <div role="group" aria-label="Show" className="flex gap-2">{(["existing", "proposed", "both"] as const).map((k) => <button key={k} type="button" aria-pressed={v === k} onClick={() => setV(k)} className={chip(v === k, true)}>{k}</button>)}</div>
        <ul className="space-y-1.5 text-sm text-slate-200"><li className="flex items-center gap-3"><svg width="30" height="8" aria-hidden><path d="M0 4H30" stroke={K.model} strokeWidth="2" /></svg>Existing — solid line</li><li className="flex items-center gap-3"><svg width="30" height="8" aria-hidden><path d="M0 4H30" stroke={K.blue} strokeWidth="2" strokeDasharray="6 4" /></svg>Proposed — dashed line</li></ul>
        <p className="text-sm text-slate-300">Retrofit starts with knowing the existing condition; the as-built model is the foundation the intervention is designed against.</p>
      </div>
    </div>
  );
}

const FAC = [["Building elements", "wall" as ScanFocus], ["Equipment", "mep" as ScanFocus], ["Services", "mep" as ScanFocus], ["Spaces", "floor" as ScanFocus], ["Existing conditions", "column" as ScanFocus]] as const;
export function Facilities() {
  const [i, setI] = useState(0);
  const flow = ["Existing facility", "Scan", "BIM model", "Asset documentation"];
  return (
    <div>
      <ol className="mb-5 grid gap-2 md:grid-cols-4">{flow.map((f, k) => <li key={f} className={cn("border px-4 py-3 text-sm font-semibold", k === 3 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-900")}><span className="mr-2 font-mono text-[10px] opacity-60">{k + 1}</span>{f}</li>)}</ol>
      <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.3fr_1fr]">
        <Panel label={FAC[i][0]}><ScanScene L={{ cloud: "faint", model: true, parts: { arch: true, struct: true, mep: true } }} focus={FAC[i][1]} title={`${FAC[i][0]} highlighted in the as-built model`} className="block h-auto w-full" /></Panel>
        <div className="space-y-3"><div role="group" aria-label="Categories" className="flex flex-wrap gap-2">{FAC.map(([t], k) => <button key={t} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={chip(i === k)}>{t}</button>)}</div><p className="text-sm text-slate-600">A working digital record of existing assets. Full facilities-management functionality is not assumed unless separately scoped.</p></div>
      </div>
    </div>
  );
}

export function PlantSection() {
  const [m, setM] = useState<"cloud" | "model" | "both">("cloud");
  return (
    <div>
      <div role="group" aria-label="View" className="mb-3 flex gap-2">{([["cloud", "Point cloud"], ["both", "Overlay"], ["model", "Model"]] as const).map(([k, l]) => <button key={k} type="button" aria-pressed={m === k} onClick={() => setM(k)} className={chip(m === k, true)}>{l}</button>)}</div>
      <Panel label="Structural frame · pipes · equipment · platforms"><PlantScene mode={m} title="Dense industrial plant shown as point cloud, overlay and model" className="mx-auto block h-auto w-full max-w-3xl" /></Panel>
    </div>
  );
}

/* ───────── validation ───────── */

export function Validation() {
  const [v, setV] = useState<"scan" | "model" | "overlay">("overlay");
  const L: ScanLayers = v === "scan" ? { cloud: "clean" } : v === "model" ? { model: true, parts: { arch: true, struct: true, mep: true } } : { cloud: "faint", model: true, parts: { arch: true, struct: true, mep: true } };
  return (
    <div>
      <div role="group" aria-label="View" className="mb-3 flex gap-2">{([["scan", "Scan view"], ["model", "Model view"], ["overlay", "Overlay view"]] as const).map(([k, l]) => <button key={k} type="button" aria-pressed={v === k} onClick={() => setV(k)} className={chip(v === k, true)}>{l}</button>)}</div>
      <Panel label="Scan ↔ model"><ScanScene L={L} title={`The model checked against the scan: ${v} view`} className="mx-auto block h-auto w-full max-w-3xl" /></Panel>
    </div>
  );
}

/* ───────── process timeline ───────── */

const PS: ScanLayers[] = [{ cloud: "clean" }, { cloud: "clean", markers: true }, { cloud: "faint", model: true, parts: { arch: true } }, { cloud: "faint", model: true, parts: { arch: true, struct: true, mep: true } }, { model: true, labels: true, parts: { arch: true, struct: true, mep: true } }];
export function ScanProcess({ steps }: { steps: { title: string; description: string }[] }) {
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
            <div className="mt-3 hidden overflow-hidden border border-slate-300 sm:block"><ScanScene L={i <= stage ? PS[i] : { cloud: "clean" }} title={`Step ${i + 1} of the scan-to-BIM workflow`} className="block h-auto w-full" /></div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────── final CTA ───────── */

export function CtaScan() {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver((e) => {
      if (!e.some((x) => x.isIntersecting)) return;
      ob.disconnect();
      if (reduced()) { setS(4); return; }
      [2, 3, 4].forEach((v, k) => setTimeout(() => setS(v), 900 + k * 1500));
    }, { threshold: 0.3 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div ref={ref} className="overflow-hidden border border-sky-300/25 bg-[#0B1B33]">
      <ScanScene L={stageLayers(s)} title="A point cloud resolving into a Revit model" className="block h-auto w-full" />
    </div>
  );
}

export { mono };
