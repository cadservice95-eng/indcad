"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Folder, FolderOpen, FileText, Camera, Ruler, FileStack, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { Plant, PlanOverlay, DIFFS, M, Grid, LAYERS, LAYER_NAME, type Layer } from "./PlantModel";
import { ShutdownVisual, SD, AccessVisual, type AccessMode, HarshVisual, HARSH, LogisticsMap, ROUTE, Glyph } from "./MiningVisuals";

const tab = (on: boolean, light?: boolean) =>
  cn("min-h-[40px] shrink-0 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400",
    light ? (on ? "border-[#0D1826] bg-[#0D1826] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-900")
      : (on ? "border-sky-400 bg-sky-400/10 text-white" : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"));
function Tabs({ items, i, set, label, light }: { items: readonly string[]; i: number; set: (k: number) => void; label: string; light?: boolean }) {
  return (
    <div role="tablist" aria-label={label} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      {items.map((x, k) => <button key={x} role="tab" type="button" aria-selected={i === k} onClick={() => set(k)} onKeyDown={(e) => { if (e.key === "ArrowRight") set((k + 1) % items.length); if (e.key === "ArrowLeft") set((k + items.length - 1) % items.length); }} className={tab(i === k, light)}>{x}</button>)}
    </div>
  );
}
function useReduced() {
  const [r, setR] = useState(false);
  useEffect(() => { const m = window.matchMedia("(prefers-reduced-motion: reduce)"); const f = () => setR(m.matches); f(); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  return r;
}
function PlantSvg({ label, children }: { label: string; children: React.ReactNode }) {
  return <svg viewBox="0 0 480 360" className="block h-auto w-full" role="img" aria-label={label}><title>{label}</title><rect width="480" height="360" fill={M.bg} /><Grid w={480} h={360} />{children}</svg>;
}

/* ───────── hero plant: build-up + layer controls ───────── */
export function HeroPlant() {
  const reduced = useReduced();
  const [n, setN] = useState(0);
  const [focus, setFocus] = useState<Layer | null>(null);
  useEffect(() => { if (reduced) return; const id = setInterval(() => setN((x) => (x >= LAYERS.length ? x : x + 1)), 650); return () => clearInterval(id); }, [reduced]);
  const built = reduced ? LAYERS.length : n;
  const show = LAYERS.slice(0, built);
  return (
    <div className="border border-slate-700 bg-[#08111D]">
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><span>Plant model · layers</span><span className="text-amber-300/80">Illustrative plant model</span></div>
      <PlantSvg label={`Illustrative processing plant model${focus ? ` — ${LAYER_NAME[focus]} highlighted` : ""}`}><Plant show={show.length === LAYERS.length ? undefined : show} focus={focus ? [focus] : null} /></PlantSvg>
      <div className="border-t border-slate-800 p-2.5">
        <div role="group" aria-label="Plant layer" className="-mx-1 hidden gap-1.5 overflow-x-auto px-1 pb-1 sm:flex">
          <button type="button" aria-pressed={focus === null} onClick={() => setFocus(null)} className={tab(focus === null)}>All</button>
          {LAYERS.map((l) => <button key={l} type="button" aria-pressed={focus === l} onClick={() => setFocus(focus === l ? null : l)} className={tab(focus === l)}>{LAYER_NAME[l]}</button>)}
        </div>
        <label className="block sm:hidden"><span className="sr-only">Select layer</span>
          <select value={focus ?? ""} onChange={(e) => setFocus((e.target.value || null) as Layer | null)} className="min-h-[44px] w-full border border-slate-600 bg-[#0D1826] px-3 font-mono text-[12px] uppercase text-white">
            <option value="">All layers</option>{LAYERS.map((l) => <option key={l} value={l}>{LAYER_NAME[l]}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}

/* ───────── shutdown slider ───────── */
export function Shutdown() {
  const [s, setS] = useState(0);
  const id = useId();
  return (
    <div>
      <div className="overflow-hidden border border-slate-700 bg-[#08111D]"><ShutdownVisual s={s} /></div>
      <label htmlFor={id} className="mt-4 block font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Before shutdown → During shutdown → Commissioning</label>
      <input id={id} type="range" min={0} max={2} step={1} value={s} onChange={(e) => setS(Number(e.target.value))} aria-valuetext={SD[s]} className="mt-2 w-full accent-amber-400" />
      <div className="mt-1 flex justify-between font-mono text-[10px] uppercase text-slate-500">{SD.map((l, k) => <button key={l} type="button" onClick={() => setS(k)} className={s === k ? "text-white" : "hover:text-white"}>{l}</button>)}</div>
    </div>
  );
}

/* ───────── brownfield overlay ───────── */
export function Brownfield() {
  const [t, setT] = useState(0);
  const id = useId();
  const phase = t < 0.35 ? "Original" : t < 0.75 ? "Reconciliation" : "Current";
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <div className="overflow-hidden border border-slate-700 bg-[#08111D]"><PlanOverlay t={t} /></div>
        <label htmlFor={id} className="mt-4 block font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Original drawing ↔ Current / as-built condition</label>
        <input id={id} type="range" min={0} max={1} step={0.01} value={t} onChange={(e) => setT(Number(e.target.value))} aria-valuetext={phase} className="mt-2 w-full accent-sky-400" />
        <div className="mt-1 flex justify-between font-mono text-[10px] uppercase text-slate-500">{[["Original", 0], ["Reconciliation", 0.55], ["Current", 1]].map(([l, v]) => <button key={l} type="button" onClick={() => setT(v as number)} className={phase === l ? "text-white" : "hover:text-white"}>{l}</button>)}</div>
      </div>
      <div className="border border-slate-700 bg-[#0D1826] p-5">
        <ul className="flex flex-wrap gap-2 font-mono text-[10px] uppercase">{[["Original", "border-slate-300 text-slate-200"], ["Current", "border-sky-400 text-sky-200"], ["Difference", "border-amber-400 text-amber-200"]].map(([l, c]) => <li key={l} className={cn("border px-2 py-1", c)}>{l}</li>)}</ul>
        <ol className="mt-4 space-y-1.5 text-sm">{DIFFS.map((d, k) => <li key={d} className={cn("flex gap-3 transition-opacity", t > 0.35 ? "opacity-100" : "opacity-40")}><span className="font-mono text-amber-300">{k + 1}</span><span className="text-slate-200">{d}</span></li>)}</ol>
        <p className="mt-4 text-xs text-slate-400">Differences are identified and recorded — not judged as errors. Illustrative geometry.</p>
      </div>
    </div>
  );
}

/* ───────── remote evidence board ───────── */
const EV = [
  { k: "photo", l: "Photos", d: "Site condition reference", i: Camera },
  { k: "survey", l: "Survey", d: "Geometric reference", i: Ruler },
  { k: "drawing", l: "Existing drawings", d: "Historical documentation", i: FileStack },
  { k: "markup", l: "Markups", d: "Current site observations", i: PenLine },
] as const;
export function EvidenceBoard() {
  const [e, setE] = useState<(typeof EV)[number]["k"]>("photo");
  const overlay = e === "markup" ? null : e;
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <ul className="grid grid-cols-2 gap-2">
          {EV.map((x) => { const I = x.i; return <li key={x.k}><button type="button" aria-pressed={e === x.k} onClick={() => setE(x.k)} className={cn("flex h-full w-full flex-col items-start gap-2 border p-4 text-left transition-colors", e === x.k ? "border-sky-400 bg-sky-400/10" : "border-slate-700 hover:border-slate-500")}><I className="h-5 w-5 text-sky-300" aria-hidden /><span className="text-sm font-semibold text-white">{x.l}</span><span className="text-xs text-slate-400">{x.d}</span></button></li>; })}
        </ul>
        <p className="mt-4 text-xs text-slate-400">Inputs combine — whatever mix is available. Not every project can be scoped from remote inputs alone.</p>
      </div>
      <div className="overflow-hidden border border-slate-700">
        <PlantSvg label={`Plant model with ${e} overlay`}>
          <Plant overlay={overlay} focus={e === "markup" ? ["access", "docs"] : null} />
        </PlantSvg>
      </div>
    </div>
  );
}

/* ───────── three-discipline viewer ───────── */
const DISC: { l: string; f: Layer[]; items: string[] }[] = [
  { l: "Structural", f: ["structure", "access"], items: ["Steel frames", "Platforms", "Walkways", "Support structures"] },
  { l: "Mechanical", f: ["equipment"], items: ["Fixed equipment", "Plant equipment", "Fabrication drawings", "Harsh-environment components"] },
  { l: "Civil", f: ["site", "civil"], items: ["Site works", "Earthworks", "Drainage", "Access"] },
];
export function DisciplineViewer() {
  const [i, setI] = useState(0);
  const d = DISC[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <div className="overflow-hidden border border-slate-700"><PlantSvg label={`Plant viewer — ${d.l}`}><Plant focus={d.f} /></PlantSvg></div>
      <div>
        <Tabs items={DISC.map((x) => x.l)} i={i} set={setI} label="Discipline" />
        <ul key={d.l} data-in="true" className="mt-4 space-y-2">{d.items.map((x, k) => <li key={x} className="fade-in border border-slate-700 bg-[#0D1826] px-4 py-3 text-sm text-slate-100" style={{ animationDelay: `${k * 70}ms` }}><span className="mr-2 font-mono text-[10px] text-sky-300">{String(k + 1).padStart(2, "0")}</span>{x}</li>)}</ul>
      </div>
    </div>
  );
}

/* ───────── access visuals ───────── */
export function AccessSwitch({ modes }: { modes: { m: AccessMode; l: string }[] }) {
  const [i, setI] = useState(0);
  return <div><div className="overflow-hidden border border-slate-700 bg-[#08111D]"><AccessVisual mode={modes[i].m} /></div><div className="mt-3"><Tabs items={modes.map((x) => x.l)} i={i} set={setI} label="View" /></div></div>;
}

/* ───────── harsh environment ───────── */
export function Harsh() {
  const [k, setK] = useState(0);
  const [env, setEnv] = useState({ dust: true, vib: true, abr: true });
  return (
    <div>
      <div className="overflow-hidden border border-slate-700 bg-[#08111D]"><HarshVisual k={k} env={env} /></div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <Tabs items={HARSH} i={k} set={setK} label="Maintenance view" />
        <div role="group" aria-label="Environment layers" className="flex gap-1.5">{([["dust", "Dust"], ["vib", "Vibration"], ["abr", "Abrasive"]] as const).map(([key, l]) => <button key={key} type="button" aria-pressed={env[key]} onClick={() => setEnv({ ...env, [key]: !env[key] })} className={tab(env[key])}>{env[key] ? "✓ " : ""}{l}</button>)}</div>
      </div>
    </div>
  );
}

/* ───────── logistics ───────── */
export function Logistics() {
  const reduced = useReduced();
  const [k, setK] = useState(0);
  const [run, setRun] = useState(true);
  useEffect(() => { if (reduced || !run) return; const id = setInterval(() => setK((x) => (x + 1) % ROUTE.length), 1600); return () => clearInterval(id); }, [reduced, run]);
  return (
    <div>
      <div className="overflow-hidden border border-slate-700 bg-[#08111D]"><LogisticsMap k={k} /></div>
      <div className="mt-3"><Tabs items={ROUTE} i={k} set={(x) => { setK(x); setRun(false); }} label="Route stage" /></div>
    </div>
  );
}

/* ───────── project types ───────── */
const GL = ["frame", "equip", "platform", "terrain", "legacy", "overlay", "harsh"];
export function ProjectTypes({ items }: { items: string[] }) {
  const [i, setI] = useState(0);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_1.2fr]">
      <ul role="tablist" aria-label="Project type" className="space-y-1.5">
        {items.map((x, k) => <li key={x}><button role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} className={cn("flex w-full items-center gap-3 border px-3 py-2.5 text-left text-sm transition-colors", i === k ? "border-[#0D1826] bg-[#0D1826] text-white" : "border-slate-300 bg-white text-slate-800 hover:border-slate-900")}><span className="w-14 shrink-0 overflow-hidden border border-slate-700"><Glyph k={GL[k] ?? "frame"} /></span><span><span className="mr-2 font-mono text-[10px] opacity-60">{String(k + 1).padStart(2, "0")}</span>{x}</span></button></li>)}
      </ul>
      <div key={i} data-in="true" role="tabpanel" className="self-start border border-slate-300 bg-white">
        <div className="fade-in border-b border-slate-200"><Glyph k={GL[i] ?? "frame"} /></div>
        <p className="fade-in p-5 text-lg font-semibold text-slate-900">{items[i]}</p>
      </div>
    </div>
  );
}

/* ───────── deliverables tree ───────── */
export function DeliverablesTree({ groups }: { groups: { dir: string; files: string[]; label: string }[] }) {
  const [open, setOpen] = useState<string[]>(groups.map((g) => g.dir));
  const flip = (d: string) => setOpen(open.includes(d) ? open.filter((x) => x !== d) : [...open, d]);
  return (
    <div className="border border-slate-300 bg-white p-5 font-mono text-[12px]">
      <p className="flex items-center gap-2 font-semibold text-slate-900"><FolderOpen className="h-4 w-4 text-amber-600" aria-hidden />MINING_PROJECT/</p>
      <ul className="mt-2 space-y-1">
        {groups.map((g, gi) => { const on = open.includes(g.dir); return (
          <li key={g.dir}>
            <button type="button" aria-expanded={on} onClick={() => flip(g.dir)} className="flex w-full items-center gap-2 py-1 text-left text-slate-900 hover:bg-slate-50"><span aria-hidden className="text-slate-400">{gi === groups.length - 1 ? "└──" : "├──"}</span>{on ? <FolderOpen className="h-3.5 w-3.5 text-amber-600" aria-hidden /> : <Folder className="h-3.5 w-3.5 text-amber-600" aria-hidden />}<span className="font-semibold">{g.dir}/</span><span className="ml-2 hidden font-sans text-[11px] text-slate-500 sm:inline">{g.label}</span></button>
            <div className={cn("grid transition-[grid-template-rows] duration-300", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}><ul className="overflow-hidden pl-10">{g.files.map((f, k) => <li key={f} className="flex items-center gap-2 py-0.5 text-slate-700"><span aria-hidden className="text-slate-300">{k === g.files.length - 1 ? "└──" : "├──"}</span><FileText className="h-3.5 w-3.5" aria-hidden />{f}</li>)}</ul></div>
          </li>
        ); })}
      </ul>
    </div>
  );
}

/* ───────── software → plant focus ───────── */
export function SoftwarePlant({ items }: { items: { slug: string; name: string; category: string; focus: Layer[]; note: string }[] }) {
  const [i, setI] = useState(0);
  const s = items[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <div className="overflow-hidden border border-slate-700"><PlantSvg label={`Plant model — ${s.name} focus`}><Plant focus={s.focus} /></PlantSvg></div>
      <div>
        <Tabs items={items.map((x) => x.name)} i={i} set={setI} label="Platform" />
        <div key={s.slug} data-in="true" className="mt-4 border border-slate-700 bg-[#0D1826] p-5">
          <p className="fade-in font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">{s.category}</p>
          <p className="fade-in mt-2 text-sm leading-relaxed text-slate-300">{s.note}</p>
          <Link href={`/software/${s.slug}`} className="fade-in mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:text-sky-300 hover:underline">Explore {s.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </div>
    </div>
  );
}
