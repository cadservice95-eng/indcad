"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Pause, Play, Folder, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformVisual } from "@/components/software-hub/visuals";
import { C, T, Fade, Grid, ln, Part, xf, FEATURES, TraceDrawing, DIMS, BASIS_C, BASIS_TXT, STATES, FEAT_AT, HOLES } from "./DefModel";

const tab = (on: boolean, light?: boolean) =>
  cn("min-h-[40px] shrink-0 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400",
    light ? (on ? "border-[#0B1728] bg-[#0B1728] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-900")
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

/* ───────── hero: legacy component → drawing ───────── */
const HERO = ["Legacy component", "Reference", "Measured features", "CAD model", "Engineering drawing"] as const;
const GEOM = ["Physical only", "Partial record", "Captured", "Captured / reviewed", "Captured / reviewed"];
const DOC = ["None", "Legacy fragment", "Measurement notes", "CAD", "CAD + drawing"];
export function HeroViewer() {
  const reduced = useReduced();
  const [s, setS] = useState(0);
  const [run, setRun] = useState(true);
  const live = run && !reduced;
  useEffect(() => { if (!live) return; const id = setInterval(() => setS((x) => (x + 1) % HERO.length), 2200); return () => clearInterval(id); }, [live]);
  const ox = 70, oy = 80, k = 1.45;
  const { P } = xf(ox, oy, k);
  return (
    <div className="border border-slate-700 bg-[#07111F]">
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><span>Sustainment record · component</span><button type="button" onClick={() => setRun(!run)} aria-label={run ? "Pause workflow preview" : "Play workflow preview"} className="inline-flex min-h-[28px] items-center gap-1 border border-slate-700 px-2 text-slate-300 hover:border-sky-300 hover:text-white">{run ? <Pause className="h-3 w-3" aria-hidden /> : <Play className="h-3 w-3" aria-hidden />}{run ? "Pause" : "Play"}</button></div>
      <div className="grid md:grid-cols-[1fr_190px]">
        <svg viewBox="0 0 480 340" className="block h-auto w-full" role="img" aria-label={`Illustrative legacy component workflow — ${HERO[s]}`}>
          <title>{`Illustrative workflow: ${HERO[s]}`}</title>
          <rect width="480" height="340" fill={s >= 4 ? "#0E1A2C" : C.bg} style={{ transition: "fill .6s" }} /><Grid w={480} h={340} />
          <g style={{ opacity: s <= 2 ? 1 : 0, transition: "opacity .6s" }}><Part ox={ox} oy={oy} k={k} style="aged" /></g>
          <Fade on={s === 1}>
            <g transform="rotate(-4 380 90)"><rect x="300" y="40" width="150" height="100" fill="#D9CDB4" fillOpacity="0.85" /><path d="M312 60h90M312 72h70M312 84h100M312 110h60" stroke="#7C6A4B" strokeWidth="1" /><rect x="380" y="96" width="56" height="34" fill="none" stroke="#7C6A4B" /><T x="306" y="152" c={C.amber} size={8}>LEGACY DRAWING FRAGMENT · PARTIAL</T></g>
          </Fade>
          <Fade on={s === 2}>
            {[[0, 20], [220, 0], [220, 100], [190, 140], [30, 140], [0, 112], [150, 0]].map(([x, y], i) => { const [a, b] = P(x, y); return <g key={i}><circle cx={a} cy={b} r="4" fill="none" stroke={C.sky} /><path d={`M${a - 7} ${b}h14M${a} ${b - 7}v14`} {...ln(C.sky, 0.8)} /></g>; })}
            {HOLES.map((h) => { const [a, b] = P(h.x, h.y); return <circle key={h.id} cx={a} cy={b} r={h.r * k + 4} {...ln(C.sky, 0.9)} strokeDasharray="3 3" />; })}
            <T x="300" y="300" c={C.sky} size={9}>MEASURED POINTS · FEATURES</T>
          </Fade>
          <Fade on={s === 3}><Part ox={ox} oy={oy + 14} k={k} style="solid" /><T x="300" y="300" c={C.sky} size={9}>CAD MODEL · CLEAN GEOMETRY</T></Fade>
          <Fade on={s === 4}>
            <g transform="translate(14 22) scale(0.86)"><TraceDrawing interactive={false} /></g>
            <rect x="8" y="8" width="464" height="324" {...ln(C.mute, 0.8)} /><path d="M310 300H472M310 300V332M400 300V332" {...ln(C.mute, 0.8)} />
            <T x="316" y="320" size={8}>SUSTAINMENT DWG</T><T x="406" y="320" size={8} c={C.mute}>ILLUSTRATIVE</T>
          </Fade>
        </svg>
        <dl aria-live="polite" className="grid grid-cols-2 border-t border-slate-800 font-mono text-[10px] uppercase tracking-[0.1em] md:block md:border-l md:border-t-0">
          {[["Document type", "Legacy component"], ["Source", s >= 1 ? "Physical reference" : "Physical part"], ["Geometry", GEOM[s]], ["Documentation", DOC[s]], ["Status", "Illustrative workflow"]].map(([a, b]) => <div key={a} className="border-b border-slate-800 px-3 py-2.5"><dt className="text-slate-500">{a}</dt><dd className={cn("mt-0.5", a === "Status" ? "text-amber-300" : "text-sky-200")}>{b}</dd></div>)}
        </dl>
      </div>
      <div className="border-t border-slate-800 p-2.5"><Tabs items={HERO} i={s} set={(k2) => { setS(k2); setRun(false); }} label="Workflow stage" /></div>
    </div>
  );
}

/* ───────── archive: legacy → digital ───────── */
const ARCH = [
  { n: "DRAWING A", legacy: "Paper · faded · partial title block", digital: "CAD drawing · rev recorded" },
  { n: "DRAWING B", legacy: "Copy of a copy · scale unknown", digital: "Redrawn · basis noted" },
  { n: "COMPONENT REF", legacy: "Physical part only", digital: "3D model · measured features" },
  { n: "MATERIAL NOTE", legacy: "Handwritten grade · obsolete", digital: "Call-out · flagged for review" },
  { n: "REVISION RECORD", legacy: "Incomplete", digital: "Revision table · traceable" },
];
export function Archive() {
  const [dig, setDig] = useState(false);
  return (
    <div>
      <div role="group" aria-label="Archive state" className="flex gap-2"><button type="button" aria-pressed={!dig} onClick={() => setDig(false)} className={tab(!dig, true)}>Legacy state</button><button type="button" aria-pressed={dig} onClick={() => setDig(true)} className={tab(dig, true)}>Documentation recovery → Digital state</button></div>
      <div className="mt-5 grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_1fr]">
        <div className={cn("border p-5 font-mono text-[12px] transition-colors duration-500", dig ? "border-slate-300 bg-white" : "border-[#C9B994] bg-[#F1EBDD]")}>
          <p className="flex items-center gap-2 font-semibold text-slate-900"><Folder className="h-4 w-4" aria-hidden />ARCHIVE/</p>
          <ul className="mt-2 space-y-1.5">
            {ARCH.map((a, k) => (
              <li key={a.n} className="flex flex-wrap items-baseline gap-x-3 transition-all duration-500" style={{ transitionDelay: `${k * 90}ms` }}>
                <span aria-hidden className="text-slate-400">{k === ARCH.length - 1 ? "└──" : "├──"}</span>
                <span className={cn("transition-colors duration-500", dig ? "font-semibold text-slate-900" : "text-[#8C7B5E]")}>{a.n}</span>
                <span className={cn("text-[11px] transition-colors duration-500", dig ? "text-blue-700" : "italic text-[#9C8A69]")}>{dig ? a.digital : a.legacy}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {(dig ? ["3D model", "Drawing", "Dimensions", "Traceability"] : ["Physical component", "Old drawing", "Faded marking", "Incomplete record"]).map((x, k) => (
            <div key={x + dig} className={cn("fade-in flex items-center border px-4 py-5 font-semibold", dig ? "border-[#1D4ED8] bg-blue-50 text-slate-900" : "border-[#C9B994] bg-[#F7F2E7] text-[#5C4E36]")} data-in="true" style={{ animationDelay: `${k * 80}ms` }}>
              <span className="mr-2 font-mono text-[10px] opacity-60">{String(k + 1).padStart(2, "0")}</span>{x}
            </div>
          ))}
          <p className="col-span-2 text-xs text-slate-500">A visual metaphor for documentation recovery — not an archive-management product.</p>
        </div>
      </div>
    </div>
  );
}

/* ───────── reproduce, not improve ───────── */
const VIEWS = ["Observed", "Documented", "Modelled"] as const;
export function Reproduce() {
  const [v, setV] = useState(0);
  const [f, setF] = useState("offset");
  const feat = FEATURES.find((x) => x.id === f)!;
  const ox = 60, oy = 50, k = 1.6;
  const { P } = xf(ox, oy, k);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="overflow-hidden border border-slate-700 bg-[#07111F]">
          <svg viewBox="0 0 480 320" className="block h-auto w-full" role="group" aria-label={`Component — ${VIEWS[v]} view; select a feature`}>
            <rect width="480" height="320" fill={C.bg} /><Grid w={480} h={320} />
            <Part ox={ox} oy={oy} k={k} style={v === 0 ? "aged" : v === 1 ? "drawing" : "solid"} hot={f === "offset" || f === "bore" ? f : null} />
            {FEATURES.map((x, i) => {
              const [a, b] = P(...x.at), on = f === x.id;
              return (
                <g key={x.id} role="button" tabIndex={0} aria-pressed={on} aria-label={x.label} onClick={() => setF(x.id)} onFocus={() => setF(x.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setF(x.id); } }} style={{ cursor: "pointer", outline: "none" }}>
                  <circle cx={a} cy={b} r={on ? 15 : 11} fillOpacity={on ? 0.2 : 0.7} {...ln(on ? C.sky : C.amber, on ? 2 : 1.3)} fill={on ? C.sky : C.bg} />
                  <T x={a} y={b + 4} a="middle" c={on ? "#fff" : C.amber} size={10} w={700}>{i + 1}</T>
                </g>
              );
            })}
            <T x="20" y="300" c={C.mute} size={9}>{`${VIEWS[v].toUpperCase()} · NO REDESIGN SHOWN — ILLUSTRATIVE`}</T>
          </svg>
        </div>
        <div className="mt-3"><Tabs items={VIEWS} i={v} set={setV} label="Representation" /></div>
      </div>
      <div>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">{FEATURES.map((x, i) => <li key={x.id}><button type="button" aria-pressed={f === x.id} onClick={() => setF(x.id)} className={cn(tab(f === x.id), "w-full text-left")}>{i + 1} · {x.label}</button></li>)}</ul>
        <dl key={f} data-in="true" className="mt-4 border border-slate-700 bg-[#0B1728] font-mono text-[11px] uppercase tracking-[0.08em]">
          {[["Feature", feat.label], ["Source", feat.source], ["Action", "Preserve in documentation"], ["Status", "Illustrative"]].map(([a, b]) => <div key={a} className="fade-in grid grid-cols-[90px_1fr] border-b border-slate-800 px-4 py-2.5"><dt className="text-slate-500">{a}</dt><dd className={a === "Action" ? "text-sky-300" : a === "Status" ? "text-amber-300" : "text-slate-100"}>{b}</dd></div>)}
          <div className="fade-in px-4 py-3 font-sans text-sm normal-case tracking-normal text-slate-300">{feat.why}</div>
        </dl>
      </div>
    </div>
  );
}

/* ───────── traceability drawing ───────── */
export function Traceability() {
  const [a, setA] = useState("w");
  const d = DIMS.find((x) => x.id === a)!;
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <div className="overflow-hidden border border-slate-300 bg-[#07111F]">
        <svg viewBox="0 0 520 380" className="block h-auto w-full" role="group" aria-label="Illustrative engineering drawing — select a dimension to see its basis">
          <rect width="520" height="380" fill={C.bg} /><Grid w={520} h={380} />
          <g transform="translate(10 30)"><TraceDrawing active={a} onPick={setA} /></g>
          <T x="20" y="366" c={C.mute} size={9}>ILLUSTRATIVE · SYMBOLIC VALUES · NOT A REAL COMPONENT</T>
        </svg>
      </div>
      <div>
        <ul className="space-y-1.5">{DIMS.map((x) => <li key={x.id}><button type="button" aria-pressed={a === x.id} onClick={() => setA(x.id)} className={cn("flex w-full items-center justify-between gap-3 border px-3 py-2.5 text-left text-sm transition-colors", a === x.id ? "border-[#0B1728] bg-[#0B1728] text-white" : "border-slate-300 bg-white text-slate-800 hover:border-slate-900")}><span>{x.label}</span><span className="font-mono text-[10px]" style={{ color: a === x.id ? BASIS_C[x.basis] : undefined }}>{x.basis}</span></button></li>)}</ul>
        <dl key={a} data-in="true" className="mt-4 border border-slate-800 bg-[#0B1728] font-mono text-[11px] uppercase tracking-[0.08em]">
          {[[d.kind, d.label], ["Value", "Illustrative"], ["Basis", d.basis], ["Confidence", d.confidence], ["Status", "Illustrative"]].map(([k, v]) => <div key={k} className="fade-in grid grid-cols-[100px_1fr] border-b border-slate-800 px-4 py-2.5"><dt className="text-slate-500">{k}</dt><dd style={{ color: k === "Basis" ? BASIS_C[d.basis] : undefined }} className={k === "Basis" ? "" : "text-slate-100"}>{v}</dd></div>)}
          <div className="fade-in px-4 py-3 font-sans text-sm normal-case tracking-normal text-slate-300">{BASIS_TXT[d.basis]}</div>
        </dl>
      </div>
    </div>
  );
}

/* ───────── confidence map ───────── */
export function ConfidenceMap() {
  const [s, setS] = useState<number | null>(null);
  const ox = 70, oy = 46, k = 1.5;
  const { P } = xf(ox, oy, k);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <div className="overflow-hidden border border-slate-700 bg-[#07111F]" data-in="true">
        <svg viewBox="0 0 480 300" className="block h-auto w-full" role="img" aria-label="Illustrative confidence map over a generic component">
          <title>Illustrative confidence states on a generic component</title>
          <rect width="480" height="300" fill={C.bg} /><Grid w={480} h={300} />
          <Part ox={ox} oy={oy} k={k} style="drawing" />
          {STATES.flatMap((st, si) => st.feats.map((fid, j) => {
            const [a, b] = P(...FEAT_AT[fid]), on = s === null || s === si;
            return <g key={fid} style={{ opacity: on ? 1 : 0.15, transition: "opacity .3s" }}><g className="fade-in" style={{ animationDelay: `${(si * 3 + j) * 140}ms` }}><rect x={a - 9} y={b - 9} width="18" height="18" fill={st.c} fillOpacity="0.2" stroke={st.c} strokeWidth="1.4" transform={`rotate(45 ${a} ${b})`} /><T x={a} y={b + 3.5} a="middle" c="#fff" size={9} w={700}>{st.k[0]}</T></g></g>;
          }))}
        </svg>
      </div>
      <ul className="space-y-2">
        {STATES.map((st, i) => (
          <li key={st.k}><button type="button" aria-pressed={s === i} onClick={() => setS(s === i ? null : i)} className={cn("flex w-full items-center gap-3 border px-4 py-3 text-left transition-colors", s === i ? "border-white/60 bg-white/5" : "border-slate-700 hover:border-slate-500")}>
            <span aria-hidden className="grid h-6 w-6 shrink-0 rotate-45 place-items-center border" style={{ borderColor: st.c, background: `${st.c}33` }}><span className="-rotate-45 font-mono text-[10px] font-bold text-white">{st.k[0]}</span></span>
            <span><span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-white">{st.k}</span><span className="block text-xs text-slate-400">{st.sub}</span></span>
          </button></li>
        ))}
        <li className="pt-1 text-xs text-slate-500">Inferred information is labelled as inferred — never presented as certain. No percentages; states only.</li>
      </ul>
    </div>
  );
}

/* ───────── project types ───────── */
export function ProjectTypes({ items }: { items: { title: string; short: string; flow: string[] }[] }) {
  const [i, setI] = useState(0);
  const p = items[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[300px_1fr]">
      <div role="tablist" aria-label="Project type" aria-orientation="vertical" className="space-y-1.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Project type</p>
        {items.map((x, k) => <button key={x.short} role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} onKeyDown={(e) => { if (e.key === "ArrowDown") setI((k + 1) % items.length); if (e.key === "ArrowUp") setI((k + items.length - 1) % items.length); }} className={cn(tab(i === k, true), "flex w-full gap-3 text-left normal-case tracking-normal")}><span className="font-mono text-[10px] opacity-60">{String(k + 1).padStart(2, "0")}</span>{x.short}</button>)}
      </div>
      <div key={p.short} data-in="true" role="tabpanel" className="border border-slate-300 bg-white p-6">
        <h3 className="fade-in text-xl font-semibold text-slate-900">{p.title}</h3>
        <ol className="mt-6 grid gap-2 sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
          {p.flow.map((s, k) => <li key={s} className="fade-in relative" style={{ animationDelay: `${k * 110}ms` }}><div className={cn("h-full border px-3 py-4 text-sm font-semibold", k === p.flow.length - 1 ? "border-[#1D4ED8] bg-blue-50 text-slate-900" : "border-slate-300 text-slate-800")}><span className="block font-mono text-[10px] text-slate-400">{String(k + 1).padStart(2, "0")}</span>{s}</div></li>)}
        </ol>
      </div>
    </div>
  );
}

/* ───────── deliverables package ───────── */
export function Package({ items }: { items: { file: string; label: string }[] }) {
  const [i, setI] = useState(0);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 md:grid-cols-[1fr_1fr]">
      <div className="border border-slate-700 bg-[#0B1728] p-4 font-mono text-[12px]">
        <p className="flex items-center gap-2 font-semibold text-white"><Folder className="h-4 w-4 text-sky-300" aria-hidden />SUSTAINMENT_PACKAGE/</p>
        <ul className="mt-2">{items.map((d, k) => <li key={d.file}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("flex w-full items-center gap-2 py-1.5 pl-2 text-left transition-colors", i === k ? "bg-sky-400/15 text-white" : "text-slate-300 hover:bg-white/5")}><span aria-hidden className="text-slate-600">{k === items.length - 1 ? "└──" : "├──"}</span><FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />{d.file}</button></li>)}</ul>
      </div>
      <div key={items[i].file} data-in="true" className="border border-slate-700 bg-[#07111F] p-5">
        <div className="fade-in">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">{items[i].file}</p>
          <p className="mt-2 text-lg font-semibold text-white">{items[i].label}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase text-slate-400">{["Rev", "Basis", "Ref"].map((x) => <div key={x} className="border border-slate-700 px-2 py-2">{x}<span className="mt-1 block text-slate-200">recorded</span></div>)}</div>
        </div>
      </div>
    </div>
  );
}

/* ───────── traceability matrix ───────── */
const MATRIX = [["Dimension", "Measured", "Confirmed"], ["Material", "Specification", "Documented"], ["Feature", "Physical reference", "Confirmed"], ["Missing detail", "Engineering interpretation", "Flagged"]];
export function TraceMatrix() {
  const [o, setO] = useState<number | null>(null);
  const col = (s: string) => (s === "Flagged" ? "text-amber-700 border-amber-500" : "text-blue-700 border-blue-600");
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Illustrative traceability example</p>
      <table className="mt-3 hidden w-full border-collapse border border-slate-300 bg-white text-left text-sm md:table">
        <thead><tr className="border-b border-slate-300 bg-slate-50 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500"><th scope="col" className="px-4 py-3 font-normal">Drawing element</th><th scope="col" className="px-4 py-3 font-normal">Basis</th><th scope="col" className="px-4 py-3 font-normal">Status</th></tr></thead>
        <tbody>{MATRIX.map(([e, b, s]) => <tr key={e} className="border-b border-slate-100 transition-colors hover:bg-blue-50/40"><th scope="row" className="px-4 py-3 font-semibold text-slate-900">{e}</th><td className="px-4 py-3 text-slate-700">{b}</td><td className="px-4 py-3"><span className={cn("border px-2 py-0.5 font-mono text-[10px] uppercase", col(s))}>{s}</span></td></tr>)}</tbody>
      </table>
      <ul className="mt-3 space-y-2 md:hidden">{MATRIX.map(([e, b, s], k) => <li key={e} className="border border-slate-300 bg-white"><button type="button" aria-expanded={o === k} onClick={() => setO(o === k ? null : k)} className="flex min-h-[48px] w-full items-center justify-between px-4 text-left text-sm font-semibold text-slate-900">{e}<span aria-hidden className="font-mono text-slate-500">{o === k ? "−" : "+"}</span></button>{o === k ? <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-700">Basis: {b}<span className={cn("ml-2 border px-2 py-0.5 font-mono text-[10px] uppercase", col(s))}>{s}</span></div> : null}</li>)}</ul>
    </div>
  );
}

/* ───────── software switch ───────── */
export function SoftwareSwitch({ items }: { items: { slug: string; name: string; category: string; workflow: string; output: string }[] }) {
  const [i, setI] = useState(0);
  const s = items[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.3fr_1fr]">
      <div key={s.slug} data-in="true" className="overflow-hidden border border-slate-700"><div className="fade-in"><PlatformVisual slug={s.slug} label={`${s.name}: illustrative documentation workflow`} /></div></div>
      <div>
        <Tabs items={items.map((x) => x.name)} i={i} set={setI} label="Platform" />
        <dl className="mt-4 grid grid-cols-2 border border-slate-700 font-mono text-[10px] uppercase tracking-[0.1em]">
          {[["Platform", s.name], ["Category", s.category], ["Workflow", s.workflow], ["Output", s.output]].map(([a, b]) => <div key={a} className="border-b border-r border-slate-700 p-3"><dt className="text-slate-500">{a}</dt><dd className="mt-1 text-slate-100">{b}</dd></div>)}
        </dl>
        <p className="mt-2 text-xs text-slate-500">Illustrative metadata — not live project information.</p>
        <Link href={`/software/${s.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:text-sky-300 hover:underline">Explore {s.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </div>
  );
}
