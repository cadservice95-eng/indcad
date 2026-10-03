"use client";

import { useEffect, useRef, useState, useId } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollStage } from "@/components/structural/useScrollStage";
import { PlanSvg } from "@/components/arch/Drawing";
import { useRise } from "@/components/arch/ArchClient";
import { Sheet, chip } from "@/components/arch/ui";
import { mono } from "@/components/arch/model";
import {
  BuildingScene, InteriorView, AerialView, CameraPlan, ContextSvg, FloorPlan3D, StageIcon, TextureDefs, TEXTURES,
  PALETTES, TIMES, STAGES, type Stage, type Zone, type PaletteId, type TimeId, type Cam,
} from "./Scene";

const css = (o: Record<string, string | number>) => o as React.CSSProperties;
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FRAME = { x: 150, y: 96, w: 380, h: 250, label: "CAM 01 · EXTERIOR · EYE LEVEL" };

/* ───────── hero: visualisation workspace ───────── */

const TAGS = ["Model", "Materials", "Lighting", "Camera", "Output"];

export function HeroWorkspace() {
  const [stage, setStage] = useState<Stage>(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    if (reduced()) { const t = setTimeout(() => setStage(4), 0); return () => clearTimeout(t); }
    if (stage >= 4) return;
    const t = setTimeout(() => setStage((s) => Math.min(4, s + 1) as Stage), stage === 0 ? 3600 : 2300);
    return () => clearTimeout(t);
  }, [stage, auto]);
  const pick = (s: number) => { setAuto(false); setStage(s as Stage); };
  const lit = [1, 2, 3, 4, 4];
  return (
    <div>
      <div className="relative overflow-hidden border border-sky-300/25 bg-[#0B1B33] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
        <BuildingScene stage={stage} animate title="One illustrative building shown as drawing, model, materials, lighting and final render" frame={stage >= 4 ? FRAME : null} className="block h-auto w-full" />
        <ul className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1 sm:left-3 sm:top-3" aria-hidden>
          {TAGS.map((t, i) => (
            <li key={t} className={cn("border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors duration-700 sm:text-[10px]", stage >= lit[i] ? "border-sky-300 bg-sky-300/20 text-sky-100" : "border-slate-500/50 text-slate-400")}>{t}</li>
          ))}
        </ul>
        <svg viewBox="0 0 90 60" className="pointer-events-none absolute right-2 top-2 hidden w-20 border border-sky-300/40 bg-[#0B1B33]/80 sm:block" fill="none" stroke="#7DD3FC" strokeWidth="1" aria-hidden>
          <path d="M8 8H82V52H8ZM44 8V52M8 30H44" /><path d="M60 52v-8h8v8" strokeOpacity="0.6" /><text x="8" y="58" fontSize="5" fill="#7DD3FC" stroke="none" style={mono}>PLAN</text>
        </svg>
        <div className={cn("pointer-events-none absolute bottom-2 left-2 flex gap-1 transition-opacity duration-700 sm:bottom-3 sm:left-3", stage >= 2 ? "opacity-100" : "opacity-0")} aria-hidden>
          {Object.values(PALETTES.A).slice(1, 5).map((c, i) => <span key={i} className="h-4 w-4 border border-white/60 sm:h-5 sm:w-5" style={{ background: c }} />)}
        </div>
        <p className="pointer-events-none absolute bottom-2 right-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/70 sm:bottom-3 sm:right-3 sm:text-[10px]">{STAGES[stage]} · illustrative</p>
      </div>
      <div className="mt-3">
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-300">Visualisation stage</p>
        <div role="group" aria-label="Visualisation stage" className="flex gap-2 overflow-x-auto pb-1">
          {STAGES.map((s, i) => <button key={s} type="button" aria-pressed={stage === i} onClick={() => pick(i)} className={cn(chip(stage === i, true), "shrink-0")}>{s}</button>)}
        </div>
      </div>
    </div>
  );
}

/* ───────── pipeline ───────── */

const PIPE = [
  { t: "2D drawings", d: "Plans, elevations and sections — or an existing BIM model — are the starting point." },
  { t: "3D architectural model", d: "A clean visualisation model is built or prepared from the supplied documentation." },
  { t: "Materials & finishes", d: "Materials follow your references and finish information." },
  { t: "Lighting", d: "Lighting is set to read the design honestly." },
  { t: "Camera composition", d: "Views are chosen to show how the space will actually be experienced." },
  { t: "Final render / image set / walkthrough", d: "Stills, image sets or walkthroughs are produced from the same model." },
];

export function Pipeline() {
  const [i, setI] = useState(0);
  const stage = Math.min(4, i) as Stage;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-center">
      <ol className="space-y-2">
        {PIPE.map((p, k) => (
          <li key={p.t}>
            <button type="button" aria-pressed={i === k} onClick={() => setI(k)} onPointerEnter={() => setI(k)} onFocus={() => setI(k)}
              className={cn("flex w-full items-start gap-4 border p-4 text-left transition-colors", i === k ? "border-blue-600 bg-white shadow-[0_10px_26px_-18px_rgba(37,99,235,0.8)]" : "border-slate-300 bg-transparent hover:border-slate-900")}>
              <StageIcon i={k} className={cn("h-11 w-11 shrink-0 transition-colors", i === k ? "text-blue-600" : "text-slate-500")} />
              <span><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{String(k + 1).padStart(2, "0")}</span><span className="block text-sm font-semibold tracking-tight text-slate-900">{p.t}</span>
                <span className={cn("mt-1 block text-xs leading-relaxed text-slate-600 transition-[max-height,opacity] duration-500 lg:overflow-hidden", i === k ? "max-h-24 opacity-100" : "max-h-0 opacity-0 lg:max-h-0")}>{p.d}</span></span>
            </button>
          </li>
        ))}
      </ol>
      <Sheet label={`${PIPE[i].t} · same building at every step`}>
        <BuildingScene stage={stage} frame={i >= 4 ? FRAME : null} title={`The building at the "${PIPE[i].t}" step`} className="block h-auto w-full" />
      </Sheet>
    </div>
  );
}

/* ───────── one model, many outputs ───────── */

type OutKind = "exterior" | "interior" | "floor3d" | "day" | "night" | "season" | "matA" | "matB" | "walk" | "planning";
const OUTS: { k: OutKind; l: string; zone: Zone | null }[] = [
  { k: "exterior", l: "Exterior render", zone: "timber" }, { k: "interior", l: "Interior render", zone: "glass" }, { k: "floor3d", l: "3D floor plan", zone: "stone" },
  { k: "day", l: "Day view", zone: null }, { k: "night", l: "Night view", zone: "glass" }, { k: "season", l: "Seasonal variation", zone: null },
  { k: "matA", l: "Material option A", zone: "timber" }, { k: "matB", l: "Material option B", zone: "concrete" }, { k: "walk", l: "Walkthrough sequence", zone: "glass" }, { k: "planning", l: "Planning context visual", zone: null },
];

function OutThumb({ k }: { k: OutKind }) {
  const c = "block h-full w-full object-cover";
  if (k === "interior") return <InteriorView room="living" title="Interior render" className={c} />;
  if (k === "floor3d") return <div className="h-full bg-white"><FloorPlan3D stage={4} rise={1} className="h-full w-full" /></div>;
  if (k === "night") return <BuildingScene stage={4} time="night" title="Night view" className={c} />;
  if (k === "season") return <BuildingScene stage={4} time="golden" season="autumn" title="Seasonal variation" className={c} />;
  if (k === "matA") return <BuildingScene stage={4} palette="A" title="Material option A" className={c} />;
  if (k === "matB") return <BuildingScene stage={4} palette="B" title="Material option B" className={c} />;
  if (k === "planning") return <ContextSvg step={2} className={c} />;
  if (k === "walk") return (
    <svg viewBox="0 0 160 100" className={c} fill="none" aria-label="Walkthrough sequence"><rect width="160" height="100" fill="#F1F5F9" /><path d="M20 80C50 80 40 40 80 40S110 70 140 24" stroke="#2563EB" strokeWidth="2" strokeDasharray="5 4" className="rch-flow" /><circle cx="20" cy="80" r="4" fill="#2563EB" /><circle cx="140" cy="24" r="4" fill="#111827" /><path d="M72 36l16 4-12 8z" fill="#2563EB" opacity="0.4" /></svg>
  );
  return <BuildingScene stage={4} time={k === "day" ? "day" : "day"} title={k === "day" ? "Day view" : "Exterior render"} className={c} />;
}

export function OutputsHub() {
  const [a, setA] = useState<OutKind>("exterior");
  const cur = OUTS.find((o) => o.k === a)!;
  const card = (o: (typeof OUTS)[number]) => (
    <li key={o.k}>
      <button type="button" aria-pressed={a === o.k} onClick={() => setA(o.k)} onPointerEnter={() => setA(o.k)} onFocus={() => setA(o.k)}
        className={cn("group flex w-full items-center gap-3 border p-2 text-left transition-colors", a === o.k ? "border-blue-600 bg-white" : "border-slate-300 bg-white/60 hover:border-slate-900")}>
        <span className="block aspect-[16/10] w-20 shrink-0 overflow-hidden border border-slate-200 sm:w-24"><OutThumb k={o.k} /></span>
        <span className="text-sm font-semibold tracking-tight text-slate-900">{o.l}</span>
      </button>
    </li>
  );
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.35fr_1fr] lg:items-center">
      <ul className="order-2 space-y-2 lg:order-1">{OUTS.slice(0, 5).map(card)}</ul>
      <div className="order-1 lg:order-2">
        <Sheet label={`One model · highlighting the part behind “${cur.l}”`}><BuildingScene stage={4} hi={cur.zone} title="The single 3D model behind every output" className="block h-auto w-full" /></Sheet>
      </div>
      <ul className="order-3 space-y-2">{OUTS.slice(5).map(card)}</ul>
    </div>
  );
}

/* ───────── honest renders: design reference ↔ presentation ───────── */

export function HonestSlider() {
  const [pos, setPos] = useState(50);
  return (
    <div>
      <Sheet label="Design reference ↔ presentation render · same geometry, same proportions">
        <div className="relative">
          <BuildingScene stage={4} title="Presentation render" className="block h-auto w-full" />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><BuildingScene stage={1} title="Design reference model" className="block h-auto w-full" /></div>
          <div className="pointer-events-none absolute inset-y-0 w-px bg-blue-600" style={{ left: `${pos}%` }} />
          <span className="pointer-events-none absolute left-2 top-2 border border-slate-400 bg-white/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-700">Design reference</span>
          <span className="pointer-events-none absolute right-2 top-2 border border-slate-400 bg-white/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-700">Presentation render</span>
        </div>
        <label className="mt-2 flex items-center gap-3 px-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-600">Reference</span>
          <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Compare design reference and presentation render" className="h-8 flex-1 accent-blue-600" />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-600">Render</span>
        </label>
      </Sheet>
    </div>
  );
}

/* ───────── design options ───────── */

const OPTS: { id: string; p: PaletteId; time: TimeId; season: "summer" | "autumn"; cam: string; frame: { x: number; y: number; w: number; h: number; label: string }; light: string }[] = [
  { id: "A", p: "A", time: "day", season: "summer", cam: "Eye level", light: "Day", frame: { x: 150, y: 96, w: 380, h: 250, label: "CAM 01 · EYE LEVEL" } },
  { id: "B", p: "B", time: "golden", season: "summer", cam: "Wide street view", light: "Golden hour", frame: { x: 40, y: 70, w: 560, h: 290, label: "CAM 02 · STREET" } },
  { id: "C", p: "C", time: "dusk", season: "autumn", cam: "Close entry view", light: "Dusk · autumn", frame: { x: 200, y: 150, w: 300, h: 190, label: "CAM 03 · ENTRY" } },
];

export function OptionCompare() {
  const [i, setI] = useState(0);
  const o = OPTS[i];
  const P = PALETTES[o.p];
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Sheet label={`Option ${o.id} · ${P.name}`}><BuildingScene stage={4} palette={o.p} time={o.time} season={o.season} frame={o.frame} title={`Design option ${o.id}`} className="block h-auto w-full" /></Sheet>
      <div className="space-y-4">
        <div role="tablist" aria-label="Design options" className="flex gap-2">
          {OPTS.map((x, k) => <button key={x.id} role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} className={chip(i === k)}>Option {x.id}</button>)}
        </div>
        <dl className="border border-slate-300 bg-white text-sm">
          {[["Material palette", P.name], ["Camera angle", o.cam], ["Lighting condition", o.light]].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 border-b border-slate-200 px-4 py-3 last:border-0"><dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{k}</dt><dd className="font-semibold text-slate-900">{v}</dd></div>
          ))}
        </dl>
        <ul className="flex gap-2" aria-label="Palette swatches">
          {(["timber", "stone", "concrete", "metal", "glass"] as const).map((m) => (
            <li key={m} className="flex-1"><span className="block h-10 border border-slate-300 transition-colors duration-500" style={{ background: P[m] }} /><span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.1em] text-slate-500">{m}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ───────── materials board ───────── */

const MAT_ZONE: Record<string, Zone | null> = { stone: "stone", concrete: "concrete", timber: "timber", glass: "glass", metal: "metal", paint: null, flooring: null, joinery: null, exterior: "stone" };

export function MaterialsBoard() {
  const uid = useId().replace(/:/g, "");
  const [m, setM] = useState("timber");
  const t = TEXTURES[m];
  const z = MAT_ZONE[m];
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <ul className="flex flex-wrap gap-2" aria-label="Materials">
          {Object.entries(TEXTURES).map(([k, v]) => <li key={k}><button type="button" aria-pressed={m === k} onClick={() => setM(k)} className={chip(m === k, true)}>{v.label}</button></li>)}
        </ul>
        <figure className="mt-5 border border-slate-600 bg-white p-2">
          <svg viewBox="0 0 320 190" className="block h-auto w-full" role="img" aria-label={`${t.label} texture sample`}><title>{`${t.label} texture sample`}</title><TextureDefs id={uid} />{t.draw(uid)}</svg>
          <figcaption className="px-1 pt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-600">{t.label} · visual sample only</figcaption>
        </figure>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{z ? "Highlighted on the building: where this material is read." : "Interior or finish material — shown in interior and detail views rather than on this elevation."} Samples support visual comparison; they don&apos;t describe physical performance.</p>
      </div>
      <Sheet label="Material zone on the model"><BuildingScene stage={2} hi={z} title={`The ${t.label} zones highlighted on the building model`} className="block h-auto w-full" /></Sheet>
    </div>
  );
}

/* ───────── lighting ───────── */

const SUN_T: Record<TimeId, number> = { morning: 0.12, day: 0.5, golden: 0.82, dusk: 0.94, night: 0.5 };

export function LightingStudio() {
  const [t, setT] = useState<TimeId>("day");
  const [season, setSeason] = useState(false);
  const x = 20 + SUN_T[t] * 280;
  const y = t === "night" ? 70 : 100 - Math.sin(SUN_T[t] * Math.PI) * 78;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Sheet label={`${TIMES[t].label}${season ? " · autumn" : ""} · same model, different light`}>
        <BuildingScene stage={4} time={t} season={season ? "autumn" : "summer"} title={`The building at ${TIMES[t].label}`} className="block h-auto w-full" />
      </Sheet>
      <div className="space-y-5">
        <div role="group" aria-label="Time of day" className="flex flex-wrap gap-2">
          {(Object.keys(TIMES) as TimeId[]).map((k) => <button key={k} type="button" aria-pressed={t === k} onClick={() => setT(k)} className={chip(t === k)}>{TIMES[k].label}</button>)}
          <button type="button" role="switch" aria-checked={season} onClick={() => setSeason((s) => !s)} className={chip(season)}>Seasonal</button>
        </div>
        <figure className="border border-slate-300 bg-white p-3">
          <svg viewBox="0 0 320 130" className="block h-auto w-full" role="img" aria-label="Sun path diagram: sun, building and shadow" fill="none"><title>Sun path</title>
            <path d="M20 100A140 90 0 0 1 300 100" stroke="#94A3B8" strokeDasharray="4 4" /><path d="M10 100H310" stroke="#111827" strokeWidth="1.5" />
            <rect x="130" y="76" width="44" height="24" fill="#E2E8F0" stroke="#111827" /><rect x="120" y="68" width="64" height="8" fill="#3B4350" />
            <path d={`M${152} 100L${152 + (x < 160 ? 1 : -1) * 60} 100`} stroke="#0B1220" strokeWidth="5" opacity="0.3" />
            <g style={{ transform: `translate(${x}px, ${y}px)`, transition: "transform 0.9s ease" }}><circle r="9" fill={t === "night" ? "#CBD5E1" : "#F5B544"} /><path d="M0 9L0 40" stroke="#F5B544" strokeDasharray="2 3" opacity={t === "night" ? 0 : 0.8} /></g>
          </svg>
          <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Sun → building → shadow</p>
        </figure>
        <p className="text-sm leading-relaxed text-slate-300">Light changes how materials, openings, depth and shadow read. It is an illustration of intent, not a prediction of exact real-world conditions.</p>
      </div>
    </div>
  );
}

/* ───────── camera ───────── */

const CAMS: { id: Cam; l: string; frame: { x: number; y: number; w: number; h: number; label: string } }[] = [
  { id: "street", l: "Street level", frame: { x: 40, y: 80, w: 560, h: 290, label: "CAMERA 01 · EXTERIOR · STREET LEVEL" } },
  { id: "eye", l: "Human eye level", frame: { x: 150, y: 110, w: 380, h: 240, label: "CAMERA 01 · EXTERIOR · EYE LEVEL" } },
  { id: "aerial", l: "Aerial / overview", frame: { x: 12, y: 12, w: 616, h: 376, label: "CAMERA 01 · AERIAL OVERVIEW" } },
];

export function CameraStudio() {
  const [c, setC] = useState<Cam>("eye");
  const cur = CAMS.find((x) => x.id === c)!;
  return (
    <div>
      <div role="group" aria-label="Camera" className="mb-4 flex flex-wrap gap-2">{CAMS.map((x) => <button key={x.id} type="button" aria-pressed={c === x.id} onClick={() => setC(x.id)} className={chip(c === x.id, true)}>{x.l}</button>)}</div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Sheet label="Camera position · field of view"><CameraPlan cam={c} className="block h-auto w-full" /></Sheet>
        <Sheet label="Framing">
          <div className="relative">
            {c === "aerial" ? <AerialView title="Aerial overview of the site" className="block h-auto w-full" /> : <BuildingScene stage={4} frame={cur.frame} title={`Framing for the ${cur.l.toLowerCase()} camera`} className="block h-auto w-full" />}
            {c === "aerial" ? <p className="absolute bottom-2 left-2 border border-sky-300 bg-[#0B1B33]/85 px-1.5 py-0.5 font-mono text-[10px] text-sky-200">{cur.frame.label}</p> : null}
          </div>
        </Sheet>
      </div>
    </div>
  );
}

/* ───────── walkthrough ───────── */

const WALK = [
  { t: "00:00", l: "Entry", at: [340, 352], room: "entry" as const },
  { t: "00:05", l: "Living Space", at: [200, 150], room: "living" as const },
  { t: "00:10", l: "Kitchen", at: [430, 130], room: "kitchen" as const },
  { t: "00:15", l: "Exterior", at: [340, 396], room: null },
];

export function Walkthrough() {
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) return;
    const t = setTimeout(() => { if (i >= WALK.length - 1) setPlay(false); else setI(i + 1); }, 2200);
    return () => clearTimeout(t);
  }, [play, i]);
  const w = WALK[i];
  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Sheet label="Plan → camera path">
          <div className="relative">
            <PlanSvg layers={{ dims: false, marks: false, tags: false, grid: false }} title="Floor plan with a camera path" className="block h-auto w-full" />
            <svg viewBox="0 0 640 420" className="pointer-events-none absolute inset-0 h-full w-full" fill="none" aria-hidden>
              <path d="M340 352V262L320 215L215 160L320 215L337 195L430 130L337 195L340 352V396" stroke="#2563EB" strokeWidth="2" strokeDasharray="6 5" className="rch-flow" />
              <g style={{ transform: `translate(${w.at[0]}px, ${w.at[1]}px)`, transition: "transform 1.4s ease" }}><circle r="9" fill="#2563EB" /><path d="M0 0L-18 -36L18 -36Z" fill="#2563EB" opacity="0.25" /></g>
            </svg>
          </div>
        </Sheet>
        <Sheet label={`${w.t} · ${w.l}`}>
          {w.room ? <InteriorView room={w.room} title={`Walkthrough frame: ${w.l}`} className="block h-auto w-full" /> : <BuildingScene stage={4} title="Walkthrough frame: exterior" className="block h-auto w-full" />}
        </Sheet>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => { setI(0); setPlay(true); }} className={chip(play, true)}>{play ? "Playing…" : "Play example"}</button>
        {WALK.map((x, k) => <button key={x.t} type="button" aria-pressed={i === k} onClick={() => { setPlay(false); setI(k); }} className={chip(i === k, true)}>{x.t} · {x.l}</button>)}
      </div>
      <p className="mt-3 text-xs text-slate-400">A visual example of the stages only — not a statement about production time.</p>
    </div>
  );
}

/* ───────── planning context ───────── */

export function PlanningContext() {
  const [s, setS] = useState<0 | 1 | 2>(2);
  const names = ["Existing context", "Proposed design", "Contextual visualisation"];
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Sheet label={names[s]}><ContextSvg step={s} className="block h-auto w-full" /></Sheet>
      <div className="space-y-4">
        <ol className="space-y-2">{names.map((n, k) => (
          <li key={n}><button type="button" aria-pressed={s === k} onClick={() => setS(k as 0 | 1 | 2)} className={cn("flex w-full items-center justify-between gap-3 border px-4 py-3 text-left text-sm font-semibold transition-colors", s === k ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-900 hover:border-slate-900")}><span><span className="mr-2 font-mono text-xs opacity-70">{k + 1}</span>{n}</span>{k < 2 ? <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" aria-hidden /> : null}</button></li>
        ))}</ol>
        <ul className="space-y-1.5 border border-slate-300 bg-white p-4 text-sm text-slate-700">
          {["Surrounding buildings", "Streetscape", "Existing context", "Proposed building", "Shadow information where required", "Relevant site context"].map((x) => <li key={x} className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-blue-600" />{x}</li>)}
        </ul>
      </div>
    </div>
  );
}

/* ───────── 3D floor plan ───────── */

const FP = ["2D floor plan", "Wall extrusion", "Furniture & components", "Materials", "3D floor plan"];
export function FloorPlan3DSection() {
  const [s, setS] = useState<0 | 1 | 2 | 3 | 4>(4);
  const rise = useRise(s >= 1, 1200);
  return (
    <div>
      <div role="tablist" aria-label="Floor plan to 3D floor plan" className="mb-3 flex gap-2 overflow-x-auto pb-1">{FP.map((n, k) => <button key={n} role="tab" type="button" aria-selected={s === k} onClick={() => setS(k as 0 | 1 | 2 | 3 | 4)} className={cn(chip(s === k), "shrink-0")}>{k + 1} · {n}</button>)}</div>
      <Sheet className="mx-auto max-w-3xl" label={FP[s]}><FloorPlan3D stage={s} rise={rise} className="block h-auto w-full" /></Sheet>
    </div>
  );
}

/* ───────── process timeline ───────── */

const PSTAGE: Stage[] = [0, 0, 1, 3, 4];
export function ProcessTimeline({ steps }: { steps: { title: string; description: string }[] }) {
  const { ref, stage } = useScrollStage(steps.length, false);
  return (
    <div ref={ref} style={css({ "--p": 0 })} className="relative">
      <span aria-hidden className="absolute left-[15px] top-0 h-full w-px origin-top bg-slate-300 lg:hidden"><span className="block h-full w-full origin-top bg-copper-500" style={{ transform: "scaleY(var(--p))" }} /></span>
      <span aria-hidden className="absolute left-0 right-0 top-[15px] hidden h-px bg-slate-300 lg:block"><span className="block h-full w-full origin-left bg-copper-500" style={{ transform: "scaleX(var(--p))" }} /></span>
      <ol className="grid gap-8 lg:grid-cols-5 lg:gap-5">
        {steps.map((s, i) => (
          <li key={s.title} className={cn("relative pl-12 transition-opacity duration-500 lg:pl-0 lg:pt-12", i <= stage ? "opacity-100" : "opacity-50")}>
            <span aria-hidden className={cn("absolute left-2 top-1 h-[14px] w-[14px] border-2 bg-[#F8F7F4] lg:left-0 lg:top-2", i <= stage ? "border-copper-500" : "border-slate-400")} />
            <p className="font-mono text-xs tracking-[0.16em] text-copper-600">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 text-base font-semibold tracking-tight text-slate-900">{s.title}</h3>
            <div className="mt-3 hidden overflow-hidden border border-slate-300 bg-white sm:block"><BuildingScene stage={i <= stage ? PSTAGE[i] : 0} title={`Step ${i + 1} of the workflow`} className="block h-auto w-full" /></div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────── final CTA visual: wireframe → finished ───────── */

export function CtaScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver((e) => {
      if (!e.some((x) => x.isIntersecting)) return;
      ob.disconnect();
      if (reduced()) { setStage(4); return; }
      [1, 2, 3, 4].forEach((s, k) => setTimeout(() => setStage(s as Stage), 500 + k * 1100));
    }, { threshold: 0.3 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div ref={ref} className="overflow-hidden border border-sky-300/25 bg-[#0B1B33]">
      <BuildingScene stage={stage} title="A wireframe building becoming a finished architectural visual" className="block h-auto w-full" />
    </div>
  );
}
