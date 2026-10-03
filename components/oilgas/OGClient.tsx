"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { makeIso, seg } from "@/components/svg/iso";
import { O, T, Fade, Grid, ln, Plant, IsoDrawing, PlanView, LINE_IDS, LAYER_NAME, type Layer, type LineId } from "./PlantOG";

const tab = (on: boolean, light?: boolean) =>
  cn("min-h-[40px] shrink-0 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400",
    light ? (on ? "border-[#0B1215] bg-[#0B1215] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-900")
      : (on ? "border-emerald-400 bg-emerald-400/10 text-white" : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"));
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
function useTick(ms: number, n: number) {
  const reduced = useReduced();
  const [k, setK] = useState(0);
  useEffect(() => { if (reduced) return; const id = setInterval(() => setK((x) => (x + 1) % n), ms); return () => clearInterval(id); }, [reduced, ms, n]);
  return k;
}
export function PSvg({ vb = "0 0 480 360", label, children, light, className }: { vb?: string; label: string; children: React.ReactNode; light?: boolean; className?: string }) {
  const [, , w, h] = vb.split(" ").map(Number);
  return <svg viewBox={vb} className={className ?? "block h-auto w-full"} role="img" aria-label={label}><title>{label}</title><rect width={w} height={h} fill={light ? O.paper : O.bg} /><Grid w={w} h={h} light={light} />{children}</svg>;
}

/* ───────── hero plant viewer ───────── */
const HL: Layer[] = ["piping", "equipment", "structural", "supports", "docs"];
export function HeroPlant() {
  const [f, setF] = useState<Layer | null>(null);
  return (
    <div className="border border-slate-700 bg-[#0B1215]">
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><span>Plant model · {f ? LAYER_NAME[f] : "All layers"}</span><span className="text-emerald-300/80">Illustrative plant model</span></div>
      <div data-in="true"><PSvg label={`Illustrative process plant model${f ? ` — ${LAYER_NAME[f]} layer` : ""}`}><g className="fade-in"><Plant focus={f ? [f] : null} flow /></g></PSvg></div>
      <div className="border-t border-slate-800 p-2.5">
        <div role="group" aria-label="Plant layer" className="-mx-1 hidden gap-1.5 overflow-x-auto px-1 pb-1 md:flex">
          <button type="button" aria-pressed={f === null} onClick={() => setF(null)} className={tab(f === null)}>All</button>
          {HL.map((l) => <button key={l} type="button" aria-pressed={f === l} onClick={() => setF(f === l ? null : l)} className={tab(f === l)}>{LAYER_NAME[l]}</button>)}
        </div>
        <label className="block md:hidden"><span className="sr-only">Select plant layer</span>
          <select value={f ?? ""} onChange={(e) => setF((e.target.value || null) as Layer | null)} className="min-h-[44px] w-full border border-slate-600 bg-[#111B1F] px-3 font-mono text-[12px] uppercase text-white"><option value="">All layers</option>{HL.map((l) => <option key={l} value={l}>{LAYER_NAME[l]}</option>)}</select>
        </label>
      </div>
    </div>
  );
}

/* ───────── facility lifecycle ───────── */
const LIFE: { s: string; show?: Layer[]; focus?: Layer[]; mod?: number; flow?: boolean; note: string }[] = [
  { s: "Design", show: ["civil", "docs"], note: "Layout and documentation framework" },
  { s: "Engineering", show: ["civil", "structural", "equipment", "piping", "docs"], focus: ["piping", "docs"], note: "Plant model, isometrics, line list" },
  { s: "Fabrication", focus: ["structural", "supports"], note: "Shop drawings and spools" },
  { s: "Construction", note: "All disciplines installed" },
  { s: "Commissioning", flow: true, focus: ["piping"], note: "Lines checked against documentation" },
  { s: "Operation", flow: true, note: "Records in daily use" },
  { s: "Modification", mod: 2, flow: true, note: "New equipment and piping added" },
  { s: "Maintenance", focus: ["equipment", "docs"], mod: 2, note: "Equipment tags and history" },
  { s: "Expansion", mod: 4, focus: ["structural", "piping", "equipment", "docs"], note: "Additional steel, updated revision" },
];
export function Lifecycle() {
  const [i, setI] = useState(0);
  const id = useId();
  const L = LIFE[i];
  return (
    <div>
      <div className="overflow-hidden border border-slate-700 bg-[#0B1215]"><PSvg label={`One facility at the ${L.s} stage`} className="mx-auto block h-auto w-full max-w-[760px]"><Plant show={L.show} focus={L.focus ?? null} mod={L.mod ?? 0} flow={L.flow} /><T x="20" y="30" c={O.ink} size={11}>{L.s.toUpperCase()}</T><T x="20" y="46" c={O.mute} size={9}>{L.note}</T></PSvg></div>
      <label htmlFor={id} className="mt-4 block font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">One facility — many documentation stages</label>
      <input id={id} type="range" min={0} max={LIFE.length - 1} step={1} value={i} onChange={(e) => setI(Number(e.target.value))} aria-valuetext={L.s} className="mt-2 w-full accent-emerald-400" />
      <ol className="mt-2 flex justify-between gap-1 overflow-x-auto font-mono text-[9px] uppercase text-slate-500 sm:text-[10px]">{LIFE.map((x, k) => <li key={x.s}><button type="button" onClick={() => setI(k)} className={k === i ? "text-white" : "hover:text-white"}>{x.s}</button></li>)}</ol>
    </div>
  );
}

/* ───────── isometric ↔ plant model ↔ line list ───────── */
const STEPS = ["3D pipe route", "Isometric drawing", "Line list", "Plant model"];
export function IsoTriad() {
  const [l, setL] = useState<LineId>("L-001");
  const k = useTick(1600, 4);
  const lit = (n: number) => k === n;
  return (
    <div>
      <ol className="mb-4 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.08em]">{STEPS.map((s, n) => <li key={s} className="flex items-center gap-2">{n ? <span aria-hidden className="text-emerald-600">→</span> : null}<span className={cn("border px-3 py-1.5 transition-colors duration-500", lit(n) ? "border-emerald-600 bg-emerald-50 text-slate-900" : "border-slate-300 bg-white text-slate-600")}>{s}</span></li>)}</ol>
      <div className="grid gap-4 [&>*]:min-w-0 lg:grid-cols-3">
        <figure className={cn("border bg-white transition-colors", lit(1) ? "border-emerald-600" : "border-slate-300")}>
          <figcaption className="border-b border-slate-200 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">01 · Piping isometric</figcaption>
          <PSvg light vb="0 0 340 260" label={`Piping isometric for line ${l}`}><IsoDrawing id={l} /></PSvg>
        </figure>
        <figure className={cn("border bg-[#0B1215] transition-colors", lit(0) || lit(3) ? "border-emerald-500" : "border-slate-700")}>
          <figcaption className="border-b border-slate-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">02 · Plant model — select a line</figcaption>
          <svg viewBox="0 0 480 360" className="block h-auto w-full" role="group" aria-label="Plant model — select a pipeline"><rect width="480" height="360" fill={O.bg} /><Grid w={480} h={360} /><Plant line={l} onLine={setL} focus={["piping"]} /></svg>
        </figure>
        <figure className={cn("border bg-white transition-colors", lit(2) ? "border-emerald-600" : "border-slate-300")}>
          <figcaption className="border-b border-slate-200 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">03 · Line list</figcaption>
          <table className="w-full border-collapse text-left font-mono text-[10.5px]">
            <caption className="sr-only">Illustrative line list</caption>
            <thead><tr className="border-b border-slate-200 text-slate-500">{["Line", "Size", "Service", "Spec", "Status"].map((h) => <th key={h} scope="col" className="px-2 py-2 font-normal uppercase">{h}</th>)}</tr></thead>
            <tbody>{LINE_IDS.map((id) => <tr key={id} className={cn("cursor-pointer border-b border-slate-100 transition-colors", l === id ? "bg-yellow-100" : "hover:bg-slate-50")} onClick={() => setL(id)}><th scope="row" className="px-2 py-2.5 text-left"><button type="button" aria-pressed={l === id} onClick={() => setL(id)} className="font-semibold text-slate-900 underline-offset-2 hover:underline">{id}</button></th>{["Project data", "Project data", "Project data"].map((x, n) => <td key={n} className="px-2 py-2.5 text-slate-500">{x}</td>)}<td className="px-2 py-2.5 text-emerald-700">{l === id ? "✓ Matched" : "—"}</td></tr>)}</tbody>
          </table>
          <p className="px-3 py-3 text-xs text-slate-500">Selecting a line on any panel highlights it on all three. Values are placeholders.</p>
        </figure>
      </div>
    </div>
  );
}

/* ───────── discipline selector ───────── */
const DISC: { l: string; f: Layer[]; d: string }[] = [
  { l: "Piping", f: ["piping"], d: "Process lines, valves and branches." },
  { l: "Mechanical", f: ["equipment"], d: "Pumps, vessels, tanks, compressors and equipment envelopes." },
  { l: "Structural", f: ["structural", "supports"], d: "Pipe racks, platforms, supports and steelwork." },
  { l: "Civil", f: ["civil"], d: "Foundations, equipment bases and site-related elements." },
  { l: "Documentation", f: ["docs"], d: "Drawings, tags, revisions and references." },
];
export function Disciplines() {
  const [i, setI] = useState(0);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <div className="overflow-hidden border border-slate-700"><PSvg label={`Plant — ${DISC[i].l} discipline`}><Plant focus={DISC[i].f} /></PSvg></div>
      <div><Tabs items={DISC.map((d) => d.l)} i={i} set={setI} label="Discipline" /><div key={i} data-in="true" className="mt-4 border border-slate-700 bg-[#111B1F] p-5"><p className="fade-in font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">{DISC[i].l}</p><p className="fade-in mt-2 text-sm text-slate-300">{DISC[i].d}</p></div><p className="mt-3 text-xs text-slate-400">Not every project includes every discipline — scope is confirmed per project.</p></div>
    </div>
  );
}

/* ───────── pipe rack structure ───────── */
const RACK = ["Structural member", "Pipe support", "Equipment support", "Access platform", "Connection"];
export function PipeRack() {
  const [k, setK] = useState(0);
  const p = makeIso(200, 130, 1.5);
  const on = (n: number) => k === n;
  const c = (n: number, base: string) => (on(n) ? O.hot : base);
  return (
    <div>
      <div className="overflow-hidden border border-slate-700 bg-[#0B1215]" data-in="true">
        <PSvg vb="0 0 520 320" label={`Pipe rack — ${RACK[k]} highlighted`} className="mx-auto block h-auto w-full max-w-[860px]">
          <g {...ln(c(0, O.steel), on(0) ? 2.4 : 1.6)}>{[0, 50, 100, 150].flatMap((x) => [0, 24].map((y) => <path key={`${x}${y}`} d={seg(p(x, y, 0), p(x, y, 48))} pathLength={1} className="draw" style={{ "--d": `${x * 4}ms` } as React.CSSProperties} />))}{[30, 48].map((z) => <g key={z}><path d={seg(p(0, 0, z), p(150, 0, z))} /><path d={seg(p(0, 24, z), p(150, 24, z))} />{[0, 50, 100, 150].map((x) => <path key={x} d={seg(p(x, 0, z), p(x, 24, z))} />)}</g>)}<path d={seg(p(0, 0, 0), p(50, 0, 30))} strokeWidth="1" /><path d={seg(p(100, 24, 0), p(150, 24, 30))} strokeWidth="1" /></g>
          {[6, 12, 18].map((y) => <path key={y} d={seg(p(-20, y, 50), p(170, y, 50))} {...ln(O.pipe, 3)} strokeOpacity="0.7" />)}
          <g {...ln(c(1, O.sup), on(1) ? 2.2 : 1.3)}>{[25, 75, 125].flatMap((x) => [6, 12, 18].map((y) => <path key={`${x}${y}`} d={seg(p(x - 3, y, 48), p(x - 3, y, 50), p(x + 3, y, 50), p(x + 3, y, 48))} />))}</g>
          <g {...ln(c(2, O.equip), on(2) ? 2.2 : 1.3)}><path d={seg(p(110, 0, 30), p(140, 0, 30), p(140, 24, 30))} /><path d={seg(p(115, 12, 30), p(115, 12, 40), p(135, 12, 40), p(135, 12, 30))} fill={O.equip} fillOpacity="0.2" /></g>
          <g {...ln(c(3, O.steel), on(3) ? 2.2 : 1.1)}><path d={seg(p(0, 24, 30), p(0, 44, 30), p(50, 44, 30), p(50, 24, 30))} />{[0, 25, 50].map((x) => <path key={x} d={seg(p(x, 44, 30), p(x, 44, 40))} />)}<path d={seg(p(0, 44, 40), p(50, 44, 40))} /></g>
          <g>{[[50, 0, 30], [100, 24, 48]].map((q, n) => { const s = p(...(q as [number, number, number])); return <circle key={n} cx={s[0]} cy={s[1]} r={on(4) ? 9 : 5} {...ln(c(4, O.ink), on(4) ? 2 : 1)} />; })}</g>
          <T x="20" y="300" c={O.mute} size={9}>ILLUSTRATIVE · NO CALCULATIONS OR FIRE RATINGS SHOWN</T>
          <T x="500" y="30" a="end" c={O.hot} size={10}>{RACK[k].toUpperCase()}</T>
        </PSvg>
      </div>
      <div className="mt-3"><Tabs items={RACK} i={k} set={setK} label="Rack component" /></div>
    </div>
  );
}

/* ───────── legacy archive reconciliation ───────── */
export function Archive() {
  const [done, setDone] = useState(false);
  const sheets = ["Legacy drawing 01", "Legacy drawing 02", "Old revision", "Current drawing"];
  return (
    <div>
      <div className="relative h-[300px] overflow-hidden border border-slate-300 bg-[#EEF0EC] sm:h-[340px]">
        {sheets.map((s, k) => {
          const pos = done ? { left: "50%", top: "50%", transform: `translate(-50%, -50%) rotate(0deg)`, opacity: k === 3 ? 1 : 0 } : { left: `${8 + k * 21}%`, top: `${14 + (k % 2) * 10}%`, transform: `rotate(${[-6, 4, -3, 2][k]}deg)`, opacity: 1 };
          return (
            <div key={s} className="absolute w-[46%] max-w-[260px] border bg-white p-3 shadow-md transition-all duration-700 sm:w-[30%]" style={{ ...pos, borderColor: k === 3 ? "#059669" : "#CBD5E1", background: k < 2 ? "#F4EFE3" : "#fff" }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{s}</p>
              <svg viewBox="0 0 200 110" className="mt-2 block h-auto w-full" aria-hidden><rect width="200" height="110" fill="none" stroke="#94A3B8" /><circle cx="50" cy="45" r="16" fill="none" stroke={k < 2 ? "#8C7B5E" : "#0F172A"} /><path d={k === 1 ? "M50 61V80H150V95" : "M50 61V85H150"} fill="none" stroke={k < 2 ? "#8C7B5E" : "#059669"} strokeWidth="2" /><rect x="120" y="30" width="44" height="30" fill="none" stroke={k < 2 ? "#8C7B5E" : "#0F172A"} />{k === 2 ? <path d="M110 22h66v46h-66z" fill="none" stroke="#DC2626" strokeDasharray="3 2" /> : null}<path d="M140 92h56M140 100h56" stroke="#94A3B8" /></svg>
              <p className="mt-1 font-mono text-[9px] uppercase text-slate-400">{["Standard: unknown", "Standard: differs", "Rev history: partial", done ? "Current-state record" : "Standard: project"][k]}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" onClick={() => setDone(!done)} aria-pressed={done} className={tab(done, true)}>{done ? "↺ Show archive" : "Reconcile archive →"}</button><p className="font-mono text-[11px] uppercase text-slate-500">Archive → reconciliation → current-state documentation</p></div>
      <p className="mt-2 text-xs text-slate-500">Stylised sheets — not historical company documents.</p>
    </div>
  );
}

/* ───────── brownfield slider ───────── */
const DIFFS = ["Piping relocated", "Equipment replaced", "Structural modification", "Line removed", "Platform added"];
export function Brownfield() {
  const [t, setT] = useState(0);
  const id = useId();
  const c = Math.min(1, Math.max(0, (t - 0.3) * 1.8)), o = 1 - Math.min(1, t * 1.6);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <div className="overflow-hidden border border-slate-700 bg-[#0B1215]">
          <PSvg vb="0 0 520 320" label="Existing documentation versus reconciled current condition (illustrative)" className="mx-auto block h-auto w-full max-w-[860px]">
            <g style={{ opacity: o }}><PlanView variant="existing" /></g>
            <g style={{ opacity: c }}><PlanView variant="current" /></g>
            <g style={{ opacity: t > 0.35 ? 1 : 0, transition: "opacity .3s" }}>{([[183, 110, 1], [328, 82, 2], [250, 135, 3], [230, 100, 4], [236, 56, 5]] as const).map(([x, y, n]) => <g key={n}><circle cx={x} cy={y} r="10" {...ln(O.sup, 1.4)} fill={O.bg} /><T x={x} y={y + 3.5} a="middle" c={O.sup} size={9} w={700}>{n}</T></g>)}</g>
            <T x="20" y="24" c={t < 0.5 ? O.ink : O.pipe} size={10}>{t < 0.35 ? "EXISTING DOCUMENTATION" : t < 0.75 ? "RECONCILIATION" : "RECONCILED CURRENT CONDITION"}</T>
            <T x="500" y="306" a="end" c={O.mute} size={8}>ILLUSTRATIVE</T>
          </PSvg>
        </div>
        <label htmlFor={id} className="mt-4 block font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Existing documentation ↔ reconciled current condition</label>
        <input id={id} type="range" min={0} max={1} step={0.01} value={t} onChange={(e) => setT(Number(e.target.value))} className="mt-2 w-full accent-emerald-400" />
      </div>
      <ol className="space-y-2 self-center">{DIFFS.map((d, k) => <li key={d} className={cn("flex gap-3 border px-4 py-2.5 text-sm transition-opacity", t > 0.35 ? "border-amber-400/50 text-slate-100 opacity-100" : "border-slate-700 text-slate-400 opacity-60")}><span className="font-mono text-amber-300">{k + 1}</span>{d}</li>)}</ol>
    </div>
  );
}

/* ───────── value chain ───────── */
const VC = ["Upstream", "Midstream", "Downstream"] as const;
export function ValueChain() {
  const [i, setI] = useState(0);
  const focus = [["Facility documentation", "Mechanical equipment", "Structural documentation", "Piping"], ["Pipeline infrastructure", "Metering station", "Pipe support structures"], ["Process unit", "Tanks", "Equipment", "Piping", "Structural steel"]][i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <div className="overflow-hidden border border-slate-700 bg-[#0B1215]">
        <PSvg vb="0 0 520 280" label={`${VC[i]} facility abstraction`} className="mx-auto block h-auto w-full max-w-[860px]">
          <path d="M0 230H520" {...ln(O.mute, 1)} />
          <Fade on={i === 0}><g {...ln(O.equip, 1.4)}><rect x="80" y="140" width="110" height="44" rx="22" fill={O.equip} fillOpacity="0.15" /><rect x="230" y="110" width="30" height="120" rx="12" fill={O.equip} fillOpacity="0.15" /></g><g {...ln(O.pipe, 2)}><path d="M40 230V200H80M190 160H230M260 140H330V230M330 180H420" /></g><g {...ln(O.steel, 1.4)}><path d="M300 230V150M360 230V150M300 150H360M300 190H360" /></g><T x="40" y="40" c={O.mute} size={9}>ABSTRACT PRODUCTION FACILITY · SEPARATION & MANIFOLD</T></Fade>
          <Fade on={i === 1}><path d="M0 200C120 196 200 180 320 186S460 196 520 192" {...ln(O.pipe, 3)} />{[60, 140, 220, 400].map((x) => <path key={x} d={`M${x} 230V${x < 300 ? 197 - (x / 30) : 192}`} {...ln(O.sup, 1.4)} />)}<rect x="270" y="120" width="100" height="50" fillOpacity="0.12" {...ln(O.equip, 1.4)} fill={O.equip} /><path d="M290 170V186M350 170V188" {...ln(O.pipe, 2)} /><T x="276" y="112" c={O.equip} size={9}>METERING STATION</T><T x="40" y="40" c={O.mute} size={9}>PIPELINE INFRASTRUCTURE · SUPPORTS</T></Fade>
          <Fade on={i === 2}><g {...ln(O.equip, 1.4)}>{[90, 140].map((x) => <rect key={x} x={x} y="60" width="28" height="170" rx="12" fill={O.equip} fillOpacity="0.14" />)}<ellipse cx="380" cy="190" rx="60" ry="14" fill={O.equip} fillOpacity="0.12" /><path d="M320 190V230M440 190V230" /></g><g {...ln(O.steel, 1.4)}><path d="M180 230V120M240 230V120M180 120H240M180 170H240" /></g><g {...ln(O.pipe, 2)}><path d="M118 90H210V140H320V200M168 120H180" /></g><T x="40" y="40" c={O.mute} size={9}>PROCESS UNIT · COLUMNS · TANKS · STEEL</T></Fade>
          <T x="500" y="266" a="end" c={O.mute} size={8}>ILLUSTRATIVE · NO CLIENT PROJECTS</T>
        </PSvg>
      </div>
      <div><Tabs items={VC} i={i} set={setI} label="Value chain segment" /><ul key={i} data-in="true" className="mt-4 space-y-1.5">{focus.map((x, k) => <li key={x} className="fade-in border border-slate-700 bg-[#111B1F] px-4 py-2.5 text-sm text-slate-200" style={{ animationDelay: `${k * 70}ms` }}>{x}</li>)}</ul></div>
    </div>
  );
}

/* ───────── tight process unit ───────── */
const TIGHT: { s: string; show: Layer[]; clear?: boolean }[] = [
  { s: "Equipment", show: ["civil", "equipment"] },
  { s: "Piping", show: ["civil", "equipment", "piping"] },
  { s: "Structural steel", show: ["civil", "equipment", "piping", "structural", "supports"] },
  { s: "Access", show: ["civil", "equipment", "piping", "structural", "supports"] },
  { s: "Maintenance clearance", show: ["civil", "equipment", "piping", "structural", "supports"], clear: true },
];
export function TightUnit() {
  const [i, setI] = useState(4);
  const S = TIGHT[i];
  return (
    <div>
      <div className="overflow-hidden border border-slate-700 bg-[#0B1215]"><PSvg label={`Tightly packed process unit — ${S.s}`} className="mx-auto block h-auto w-full max-w-[760px]"><Plant show={S.show} clearance={S.clear} focus={i === 3 ? ["structural"] : null} /><T x="20" y="30" c={O.ink} size={11}>{S.s.toUpperCase()}</T>{S.clear ? <T x="20" y="46" c={O.sup} size={9}>CLOSE APPROACHES FLAGGED FOR REVIEW · NOT A CLASH GUARANTEE</T> : null}</PSvg></div>
      <div className="mt-3"><Tabs items={TIGHT.map((x) => x.s)} i={i} set={setI} label="Build-up step" /></div>
    </div>
  );
}

/* ───────── documentation lineage ───────── */
const LINEAGE = ["Original design", "Revision", "Construction", "As-built", "Modification", "Maintenance", "Future review"];
export function Lineage() {
  const k = useTick(1100, LINEAGE.length);
  return (
    <ol className="grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
      {LINEAGE.map((s, i) => (
        <li key={s} className={cn("relative border px-3 py-4 transition-colors duration-500", i <= k ? "border-emerald-500/60 bg-emerald-400/5" : "border-slate-700 bg-[#0B1215]")}>
          <span className="font-mono text-[10px] text-slate-500">{String(i + 1).padStart(2, "0")}</span>
          <p className={cn("mt-1 text-sm font-semibold", i <= k ? "text-white" : "text-slate-400")}>{s}</p>
          {i === k ? <span aria-hidden className="absolute right-2 top-2 inline-grid h-5 w-5 place-items-center border border-red-400 font-mono text-[9px] text-red-300">{String.fromCharCode(65 + Math.min(i, 4))}</span> : null}
        </li>
      ))}
    </ol>
  );
}

/* ───────── revision comparison ───────── */
const REVS = [{ r: "A", l: "Original design", v: "A" as const }, { r: "B", l: "Construction modification", v: "B" as const }, { r: "C", l: "As-built", v: "C" as const }, { r: "D", l: "Facility modification", v: "D" as const }];
const REV_NOTE = ["Issued for construction.", "Line rerouted during construction.", "Equipment footprint and platform recorded as built.", "New vessel and branch line added."];
export function Revisions() {
  const [i, setI] = useState(0);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.6fr_1fr]">
      <div className="overflow-hidden border border-slate-300 bg-white">
        <PSvg light vb="0 0 520 320" label={`Drawing revision ${REVS[i].r}: ${REVS[i].l}`} className="mx-auto block h-auto w-full max-w-[860px]">
          {i > 0 ? <g opacity="0.22"><PlanView light variant={REVS[i - 1].v} /></g> : null}
          <PlanView light variant={REVS[i].v} />
          <rect x="10" y="10" width="130" height="40" {...ln("#0F172A", 0.8)} fill="#fff" /><T x="18" y="26" c="#0F172A" size={8}>PIPING PLAN</T><T x="18" y="42" c="#DC2626" size={9} w={700}>{`REV ${REVS[i].r}`}</T>
          {i > 0 ? <path d={["", "M80 240q-10 -30 20 -50q40 -10 60 10q10 30 -20 50q-40 10 -60 -10z", "M282 50q-10 -24 30 -26q60 0 70 30q4 30 -40 34q-56 4 -60 -38z", "M436 60q30 -14 46 14q10 40 -20 56q-40 10 -40 -30z"][i]} {...ln("#DC2626", 1.2)} strokeDasharray="4 3" /> : null}
        </PSvg>
      </div>
      <div><Tabs light items={REVS.map((r) => `Rev ${r.r}`)} i={i} set={setI} label="Revision" /><div key={i} data-in="true" className="mt-4 border border-slate-300 bg-white p-5"><p className="fade-in font-mono text-[10px] uppercase tracking-[0.16em] text-red-700">Revision {REVS[i].r} · {REVS[i].l}</p><p className="fade-in mt-2 text-sm text-slate-600">{REV_NOTE[i]}</p></div><p className="mt-3 text-xs text-slate-500">Illustrative overlay — the previous revision shows faintly beneath. Revision control follows your project&apos;s system.</p></div>
    </div>
  );
}

/* ───────── expansion stepper ───────── */
const EXP = ["Existing facility", "New equipment", "Modified piping", "Additional structural steel", "Updated documentation"];
export function Expansion() {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="overflow-hidden border border-slate-700 bg-[#0B1215]"><PSvg label={`Facility expansion — ${EXP[i]}`} className="mx-auto block h-auto w-full max-w-[760px]"><Plant mod={i} ox={210} focus={i === 4 ? ["docs", "piping", "equipment", "structural"] : null} /><T x="20" y="30" c={i ? O.sup : O.ink} size={11}>{EXP[i].toUpperCase()}</T></PSvg></div>
      <div className="mt-3"><Tabs items={EXP} i={i} set={setI} label="Expansion step" /></div>
    </div>
  );
}

/* ───────── deliverables stack ───────── */
export function DeliverableStack({ items }: { items: string[] }) {
  const [i, setI] = useState(0);
  const views = [
    <PSvg key="0" light vb="0 0 340 260" label="Piping isometric preview"><IsoDrawing id="L-002" /></PSvg>,
    <div key="1" className="bg-[#0B1215]"><PSvg label="Pipe rack detailing preview"><Plant focus={["structural", "supports"]} /></PSvg></div>,
    <div key="2" className="bg-[#0B1215]"><PSvg label="Equipment documentation preview"><Plant focus={["equipment", "docs"]} /></PSvg></div>,
    <div key="3" className="bg-[#0B1215]"><PSvg label="Coordinated plant model preview"><Plant /></PSvg></div>,
    <PSvg key="4" light vb="0 0 520 320" label="Existing versus current comparison"><g opacity="0.25"><PlanView light variant="existing" /></g><PlanView light variant="current" /></PSvg>,
    <PSvg key="5" light vb="0 0 340 260" label="Line list linked to isometric"><IsoDrawing id="L-001" /><rect x="200" y="190" width="130" height="60" {...ln("#0F172A", 0.8)} fill="#fff" /><T x="208" y="206" c="#0F172A" size={8}>LINE LIST · L-001</T><T x="208" y="222" c="#059669" size={8}>✓ ISO · MODEL · LIST</T></PSvg>,
  ];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 md:grid-cols-[1fr_1.1fr]">
      <ul className="space-y-2">{items.map((d, k) => <li key={d}><button type="button" aria-pressed={i === k} onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} className={cn("flex w-full items-center gap-3 border px-4 py-3.5 text-left text-sm transition-all", i === k ? "translate-x-1 border-[#0B1215] bg-[#0B1215] text-white" : "border-slate-300 bg-white text-slate-800 hover:border-slate-900")}><span className="font-mono text-[10px] opacity-60">{String(k + 1).padStart(2, "0")}</span>{d}</button></li>)}</ul>
      <div key={i} data-in="true" className="overflow-hidden border border-slate-300"><div className="fade-in">{views[i] ?? views[0]}</div></div>
    </div>
  );
}

/* ───────── mini glyphs ───────── */
export function Glyph({ k }: { k: number }) {
  const g = [
    <g key="0" {...ln(O.pipe, 2)}><path d="M20 80L60 57L60 30L110 1" transform="translate(0 10)" /><circle cx="60" cy="67" r="3" fill={O.bg} /></g>,
    <g key="1" {...ln(O.steel, 1.4)}><path d="M30 85V35M70 85V35M110 85V35M30 35H130M30 55H130M130 85V35" /><path d="M30 85L70 55" /></g>,
    <g key="2" {...ln(O.equip, 1.4)}><rect x="40" y="20" width="26" height="66" rx="12" fill={O.equip} fillOpacity="0.15" /><rect x="86" y="58" width="34" height="22" fill={O.equip} fillOpacity="0.15" /><circle cx="103" cy="69" r="7" /></g>,
    <g key="3"><g {...ln(O.steel, 1.2)}><path d="M30 85V40H130V85" /></g><g {...ln(O.pipe, 2)}><path d="M20 50H140" /></g><g {...ln(O.equip, 1.2)}><circle cx="80" cy="70" r="12" /></g></g>,
    <g key="4"><rect x="16" y="22" width="56" height="58" fill="#D9CDB4" /><path d="M24 38h36M24 50h28M24 62h40" stroke="#7C6A4B" /><path d="M80 52h12M88 48l5 4-5 4" {...ln(O.sup, 1.4)} /><rect x="100" y="22" width="44" height="58" {...ln(O.pipe, 1.2)} /><path d="M108 40h28M108 54h20" {...ln(O.pipe, 1)} /></g>,
    <g key="5"><path d="M20 80L50 62V36L80 20" {...ln(O.pipe, 2)} /><rect x="92" y="24" width="56" height="56" {...ln(O.ink, 0.8)} />{[38, 50, 62].map((y) => <path key={y} d={`M96 ${y}h48`} {...ln(O.mute, 0.8)} />)}<path d="M80 20l14 18" {...ln(O.hot, 1)} strokeDasharray="3 2" /></g>,
    <g key="6" {...ln(O.ink, 1.1)}><rect x="18" y="40" width="34" height="40" fill={O.equip} fillOpacity="0.15" /><path d="M52 60H108" {...ln(O.pipe, 2)} /><rect x="108" y="30" width="34" height="50" fill={O.equip} fillOpacity="0.15" /><T x="20" y="96" c={O.mute} size={7}>UP · MID · DOWN</T></g>,
  ][k];
  return <svg viewBox="0 0 160 100" className="block h-auto w-full" aria-hidden><rect width="160" height="100" fill={O.bg} />{g}</svg>;
}
