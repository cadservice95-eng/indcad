"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Folder, FileText } from "lucide-react";
import { makeIso, type P } from "@/components/svg/iso";
import { cn } from "@/lib/utils";
import { PlatformVisual } from "@/components/software-hub/visuals";
import { Assembly, Ortho, Sheet, G, T, Fade, Grid, ln, PART_NAME, type Part } from "./AutoModel";
import { ToleranceStack, TOL_MODES, ReverseVisual, Fixture, FIX_FOCUS, EVEnclosure, EV_PARTS, Redesign, RD_MODES, Glyph } from "./AutoVisuals";
import type { FAQItem } from "@/lib/types";

const tab = (on: boolean, light?: boolean) =>
  cn("min-h-[40px] shrink-0 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400",
    light ? (on ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-900")
      : (on ? "border-amber-400 bg-amber-400/15 text-white" : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"));

function useReduced() {
  const [r, setR] = useState(false);
  useEffect(() => { const m = window.matchMedia("(prefers-reduced-motion: reduce)"); const f = () => setR(m.matches); f(); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  return r;
}
function Tabs({ items, i, set, label, light }: { items: readonly string[]; i: number; set: (k: number) => void; label: string; light?: boolean }) {
  return (
    <div role="tablist" aria-label={label} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      {items.map((x, k) => <button key={x} role="tab" type="button" aria-selected={i === k} onClick={() => set(k)} onKeyDown={(e) => { if (e.key === "ArrowRight") set((k + 1) % items.length); if (e.key === "ArrowLeft") set((k + items.length - 1) % items.length); }} className={tab(i === k, light)}>{i === k ? "■ " : ""}{x}</button>)}
    </div>
  );
}

/* ───────── hero component viewer ───────── */
export const VIEWS = ["Model", "Exploded", "Section", "Drawing", "Tolerance", "Document"] as const;
export function Viewer() {
  const reduced = useReduced();
  const [v, setV] = useState(0);
  const [timer, setTimer] = useState(false);
  useEffect(() => { const id = setTimeout(() => setTimer(true), 1400); return () => clearTimeout(id); }, []);
  const built = reduced || timer;
  const iso = v < 2;
  return (
    <div className="border border-slate-700 bg-[#0F1216]">
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><span>Component · Bracket assy</span><span className="text-amber-300/80">Illustrative</span></div>
      <svg viewBox="0 0 520 360" className="block h-auto w-full" role="img" aria-label={`Automotive bracket assembly — ${VIEWS[v]} view (illustrative)`}>
        <title>{`Illustrative automotive bracket assembly — ${VIEWS[v]}`}</title>
        <rect width="520" height="360" fill={G.bg} /><Grid w={520} h={360} />
        <g style={{ opacity: iso ? 1 : 0, transition: "opacity .45s" }}><Assembly solid={built} explode={v === 1 ? 1 : 0} /></g>
        <g style={{ opacity: v === 2 || v === 3 || v === 4 ? 1 : 0, transition: "opacity .45s" }}><Ortho section={v === 2} tol={v === 4} dims={v !== 2} /></g>
        <g style={{ opacity: v === 5 ? 1 : 0, transition: "opacity .45s" }}><Sheet><g transform="translate(26 34) scale(0.86)"><Ortho tol dims /></g></Sheet></g>
        <Fade on={iso}>
          <T x="20" y="30" c={G.mute} size={9}>{built ? (v === 1 ? "EXPLODED · A / B / C / FASTENERS" : "SOLID MODEL") : "WIREFRAME"}</T>
          {v === 1 ? <><T x="404" y="64" c="#C4B5FD" size={9}>B · HOUSING</T><T x="420" y="150" c={G.geo} size={9}>A · BRACKET</T><T x="440" y="250" c={G.mute} size={9}>C · PLATE</T></> : null}
        </Fade>
      </svg>
      <div className="border-t border-slate-800 p-2.5"><Tabs items={VIEWS} i={v} set={setV} label="Component view" /></div>
    </div>
  );
}

/* ───────── manufacturable model layers ───────── */
const LAYERS = ["Geometry", "Fit", "Tolerance", "Manufacturing context", "Documentation"];
export function ModelLayers() {
  const [k, setK] = useState(0);
  const p = makeIso(222, 150, 1.55);
  const tag = (at: P, dx: number, dy: number, l: string, c: string) => { const [x, y] = at, w = l.length * 6 + 12; return <g key={l}><circle cx={x} cy={y} r="3" fill={c} /><path d={`M${x} ${y}l${dx} ${dy}`} {...ln(c, 0.9)} /><rect x={dx > 0 ? x + dx : x + dx - w} y={y + dy - 9} width={w} height="17" fill={G.bg} stroke={c} strokeWidth="0.8" /><T x={(dx > 0 ? x + dx : x + dx - w) + 6} y={y + dy + 3} c={c} size={8.5}>{l}</T></g>; };
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[230px_1fr]">
      <ol className="space-y-1.5" aria-label="Model layers">
        <li className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">CAD model</li>
        {LAYERS.map((l, i) => <li key={l}><button type="button" aria-pressed={k === i} onClick={() => setK(i)} className={cn("flex w-full items-center gap-2 border px-3 py-2.5 text-left text-sm transition-colors", k === i ? "border-slate-900 bg-slate-900 text-white" : i < k ? "border-slate-400 bg-white text-slate-900" : "border-slate-300 bg-white text-slate-600 hover:border-slate-900")}><span className="font-mono text-[10px] opacity-60">├─</span>{l}{i <= k ? <span className="ml-auto font-mono text-[10px]">✓</span> : null}</button></li>)}
      </ol>
      <div className="overflow-hidden border border-slate-800 bg-[#0F1216]">
        <svg viewBox="0 0 520 360" className="mx-auto block h-auto w-full max-w-[720px]" role="img" aria-label={`CAD model layers — ${LAYERS.slice(0, k + 1).join(", ")}`}>
          <title>{`CAD model layers: ${LAYERS.slice(0, k + 1).join(", ")}`}</title>
          <rect width="520" height="360" fill={G.bg} /><Grid w={520} h={360} />
          <g style={{ opacity: k < 4 ? 1 : 0, transition: "opacity .5s" }}><Assembly solid={k >= 1} /></g>
          <Fade on={k >= 1 && k < 4}>{tag(p(60, 70, 8), -80, 46, "MATING SURFACE", G.datum)}{tag(p(90, 50, 22), 90, 30, "FASTENED JOINT", G.fast)}</Fade>
          <Fade on={k >= 2 && k < 4}>{tag(p(60, 40, 56), 90, -60, "BORE POSITION · ⌖ A B C", G.tol)}{tag(p(20, 13, 60), -60, -40, "DATUM B", G.datum)}</Fade>
          <Fade on={k >= 3 && k < 4}>{tag(p(100, 40, 11), 70, 70, "SHEET METAL · BEND R · t", G.geo)}{tag(p(35, 28, 46), -90, -10, "MACHINED FACE", "#C4B5FD")}</Fade>
          <g style={{ opacity: k === 4 ? 1 : 0, transition: "opacity .5s" }}><Sheet><g transform="translate(26 34) scale(0.86)"><Ortho tol dims /></g></Sheet></g>
          <T x="20" y="30" c={G.mute} size={9}>{`LAYER ${k + 1} / 5 · ${LAYERS[k].toUpperCase()}`}</T>
        </svg>
      </div>
    </div>
  );
}

/* ───────── fit explorer ───────── */
const FIT_TXT: Record<Part, string> = {
  A: "The bracket's lower flange seats on the mounting plate and its web locates the housing — both faces carry the fit.",
  B: "The housing bore and its seating face have to line up with the bracket, with clearance to whatever sits around it.",
  C: "The mating structure defines where everything else lands: its face and holes are the reference the bracket is dimensioned from.",
  F: "Fastener positions and clearance holes tie all three parts together — a hole pattern dimensioned in isolation won't do that.",
};
export function FitExplorer() {
  const [f, setF] = useState<Part>("A");
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <div className="overflow-hidden border border-slate-700 bg-[#0F1216]">
        <svg viewBox="0 0 520 380" className="block h-auto w-full" role="group" aria-label="Exploded assembly — select a component">
          <rect width="520" height="380" fill={G.bg} /><Grid w={520} h={380} />
          <Assembly explode={0.75} focus={f} callouts oy={196} ox={250} />
        </svg>
      </div>
      <div>
        <div role="tablist" aria-label="Component" className="grid grid-cols-2 gap-2">
          {(Object.keys(PART_NAME) as Part[]).map((k) => <button key={k} role="tab" type="button" aria-selected={f === k} onClick={() => setF(k)} onPointerEnter={() => setF(k)} onFocus={() => setF(k)} className={tab(f === k)}>{k === "F" ? "" : `${k} · `}{PART_NAME[k]}</button>)}
        </div>
        <div key={f} data-in="true" className="mt-4 border border-slate-700 bg-[#161B22] p-5">
          <p className="fade-in font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300">{PART_NAME[f]}</p>
          <p className="fade-in mt-2 text-sm leading-relaxed text-slate-300">{FIT_TXT[f]}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-slate-300">{["Mating surface", "Mounting feature", "Clearance", "Reference datum"].map((x) => <li key={x} className="border border-slate-600 px-2 py-1">{x}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

/* ───────── tolerance stack ───────── */
export function TolSwitch() {
  const [m, setM] = useState(0);
  const note = ["Each part at its nominal size — everything fits on paper.", "Every supplied part varies within its own tolerance band.", "Variation accumulates across the parts that touch — this is what the assembly actually sees.", "The drawing captures the dimensions and tolerance callouts that control it."][m];
  return (
    <div>
      <Tabs items={TOL_MODES} i={m} set={setM} label="Tolerance view" />
      <div className="mt-3 overflow-hidden border border-slate-700"><ToleranceStack m={m} /></div>
      <p aria-live="polite" className="mt-3 text-sm text-slate-300"><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-red-300">Illustrative tolerance relationship · </span>{note}</p>
    </div>
  );
}

/* ───────── reverse engineering slider ───────── */
export function ReverseSlider() {
  const [t, setT] = useState(0);
  const id = useId();
  return (
    <div>
      <div className="overflow-hidden border border-slate-700 bg-[#0F1216]"><ReverseVisual t={t} /></div>
      <label htmlFor={id} className="mt-4 block font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Observed → Interpreted → Nominal</label>
      <input id={id} type="range" min={0} max={2} step={0.02} value={t} onChange={(e) => setT(Number(e.target.value))} aria-valuetext={t < 0.66 ? "Observed condition" : t < 1.34 ? "Engineering interpretation" : "Nominal design intent"} className="mt-2 w-full accent-amber-400" />
      <div className="mt-1 flex justify-between font-mono text-[10px] uppercase text-slate-500">{[["Observed", 0], ["Interpreted", 1], ["Nominal", 2]].map(([l, v]) => <button key={l} type="button" onClick={() => setT(v as number)} className="hover:text-white">{l}</button>)}</div>
    </div>
  );
}

/* ───────── fixture / EV / redesign switches ───────── */
export function FixtureSwitch() {
  const [f, setF] = useState(0);
  return <div><div className="overflow-hidden border border-slate-700"><Fixture f={f} /></div><div className="mt-3"><Tabs items={FIX_FOCUS} i={f} set={setF} label="Fixture element" /></div></div>;
}
export function EVSwitch() {
  const [k, setK] = useState(0);
  return <div><div className="overflow-hidden border border-slate-700 bg-[#0F1216]"><EVEnclosure k={k} /></div><div className="mt-3"><Tabs items={EV_PARTS} i={k} set={setK} label="Enclosure documentation" /></div></div>;
}
export function RedesignSwitch() {
  const [m, setM] = useState(0);
  return <div><div className="overflow-hidden border border-slate-300 bg-[#0F1216]"><Redesign m={m} /></div><div className="mt-3"><Tabs items={RD_MODES} i={m} set={setM} label="Review stage" light /></div></div>;
}

/* ───────── deliverables folder ───────── */
export function Deliverables({ items }: { items: { file: string; label: string; glyph: string }[] }) {
  const [i, setI] = useState(0);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 md:grid-cols-[1fr_1fr]">
      <div className="border border-slate-300 bg-white p-4 font-mono text-[12px]">
        <p className="flex items-center gap-2 font-semibold text-slate-900"><Folder className="h-4 w-4 text-amber-500" aria-hidden />AUTOMOTIVE_COMPONENT/</p>
        <ul className="mt-2">
          {items.map((d, k) => (
            <li key={d.file} className="reveal" style={{ "--d": `${k * 80}ms` } as React.CSSProperties}>
              <button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("flex w-full items-center gap-2 py-1.5 pl-2 text-left transition-colors", i === k ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100")}>
                <span aria-hidden className="text-slate-400">{k === items.length - 1 ? "└──" : "├──"}</span><FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />{d.file}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div key={items[i].file} data-in="true" className="border border-slate-800 bg-[#0F1216]">
        <div className="fade-in"><Glyph k={items[i].glyph} /></div>
        <p className="border-t border-slate-800 px-4 py-3 text-sm font-semibold text-white">{items[i].label}</p>
      </div>
    </div>
  );
}

/* ───────── software switch ───────── */
export function SoftwareSwitch({ items }: { items: { slug: string; name: string; workflow: string; output: string }[] }) {
  const [i, setI] = useState(0);
  const s = items[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.3fr_1fr]">
      <div key={s.slug} data-in="true" className="overflow-hidden border border-slate-700"><div className="fade-in"><PlatformVisual slug={s.slug} label={`${s.name}: illustrative component workflow`} /></div></div>
      <div>
        <Tabs items={items.map((x) => x.name)} i={i} set={setI} label="Platform" />
        <dl className="mt-4 grid grid-cols-3 border border-slate-700 font-mono text-[10px] uppercase tracking-[0.1em]">
          {[["Platform", s.name], ["Workflow", s.workflow], ["Output", s.output]].map(([a, b]) => <div key={a} className="border-r border-slate-700 p-3 last:border-r-0"><dt className="text-slate-500">{a}</dt><dd className="mt-1 text-slate-100">{b}</dd></div>)}
        </dl>
        <p className="mt-2 text-xs text-slate-500">Illustrative metadata — not live project information.</p>
        <Link href={`/software/${s.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:text-amber-300 hover:underline">Explore {s.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </div>
  );
}

/* ───────── capability map ───────── */
const NODES: { id: string; l: string; x: number; y: number; d: string }[] = [
  { id: "auto", l: "AUTOMOTIVE", x: 380, y: 40, d: "3D CAD modelling and mechanical drafting for automotive component and equipment design." },
  { id: "comp", l: "COMPONENT", x: 110, y: 130, d: "Brackets, mounts and housings modelled for real fit and function across mating parts." },
  { id: "tool", l: "TOOLING", x: 290, y: 130, d: "Jigs, fixtures and tooling documentation built for repeatable high-volume production." },
  { id: "after", l: "AFTERMARKET", x: 470, y: 130, d: "Replacement and performance parts, often for models where original design files are no longer available." },
  { id: "cad", l: "3D CAD", x: 110, y: 220, d: "Parametric 3D models of components and assemblies." },
  { id: "fix", l: "FIXTURES", x: 290, y: 220, d: "Fixture and gauge documentation with clear locating and clamping references." },
  { id: "rev", l: "REVERSE ENGINEERING", x: 470, y: 220, d: "Physical samples interpreted to separate nominal design intent from wear or variation." },
  { id: "docs", l: "MANUFACTURING DOCS", x: 380, y: 320, d: "Manufacturing and fabrication drawings, flat patterns and tolerance documentation for supplier handover." },
  { id: "ev", l: "EV COMPONENTS", x: 650, y: 130, d: "Battery enclosure, mounting, sheet metal and structural documentation — the mechanical side of EV systems." },
];
const EDGES = [["auto", "comp"], ["auto", "tool"], ["auto", "after"], ["comp", "cad"], ["tool", "fix"], ["after", "rev"], ["cad", "docs"], ["fix", "docs"], ["rev", "docs"], ["auto", "ev"], ["ev", "docs"]];
const EV_LEAVES = ["Enclosure", "Mounting", "Sheet metal", "Structural docs"];
export function CapabilityMap() {
  const [a, setA] = useState("docs");
  const N = (id: string) => NODES.find((n) => n.id === id)!;
  const near = (id: string) => EDGES.some(([x, y]) => (x === a && y === id) || (y === a && x === id));
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.6fr_1fr]">
      <div className="hidden overflow-hidden border border-slate-700 bg-[#0F1216] md:block">
        <svg viewBox="0 0 760 380" className="block h-auto w-full" role="group" aria-label="Automotive capability map">
          <Grid w={760} h={380} />
          {EDGES.map(([x, y]) => { const A = N(x), B = N(y), on = x === a || y === a; return <path key={x + y} d={`M${A.x} ${A.y + 14}C${A.x} ${(A.y + B.y) / 2} ${B.x} ${(A.y + B.y) / 2} ${B.x} ${B.y - 14}`} {...ln(on ? G.datum : G.line, on ? 2 : 1.2)} className={on ? "rch-flow" : undefined} />; })}
          {NODES.map((n) => { const on = a === n.id, w = n.l.length * 7.2 + 24; return (
            <g key={n.id} role="button" tabIndex={0} aria-pressed={on} aria-label={`${n.l}: ${n.d}`} onClick={() => setA(n.id)} onPointerEnter={() => setA(n.id)} onFocus={() => setA(n.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setA(n.id); } }} style={{ cursor: "pointer", outline: "none" }}>
              <rect x={n.x - w / 2} y={n.y - 14} width={w} height="28" fill={on ? "#3B2A07" : G.panel} stroke={on ? G.datum : near(n.id) ? "#94A3B8" : G.line} strokeWidth={on ? 2 : 1} />
              <T x={n.x} y={n.y + 4} a="middle" size={10.5} c={on ? "#FDE68A" : G.hi}>{n.l}</T>
            </g>
          ); })}
        </svg>
      </div>
      <ul className="grid grid-cols-2 gap-2 md:hidden">{NODES.map((n) => <li key={n.id}><button type="button" aria-pressed={a === n.id} onClick={() => setA(n.id)} className={cn(tab(a === n.id), "w-full text-left")}>{n.l}</button></li>)}</ul>
      <div key={a} data-in="true" className="self-center border border-slate-700 bg-[#161B22] p-5">
        <p className="fade-in font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300">{N(a).l}</p>
        <p className="fade-in mt-2 text-sm leading-relaxed text-slate-300">{N(a).d}</p>
        {a === "ev" ? <ul className="mt-3 flex flex-wrap gap-1.5">{EV_LEAVES.map((l) => <li key={l} className="border border-teal-400/50 px-2 py-0.5 font-mono text-[10px] uppercase text-teal-200">{l}</li>)}</ul> : null}
      </div>
    </div>
  );
}

/* ───────── categorised FAQ ───────── */
export function FaqBrowser({ groups }: { groups: { cat: string; items: FAQItem[] }[] }) {
  const [c, setC] = useState(0);
  const [open, setOpen] = useState<string | null>(groups[0]?.items[0]?.question ?? null);
  const uid = useId();
  const g = groups[c];
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[260px_1fr]">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Automotive questions</p>
        <div role="tablist" aria-label="Question category" aria-orientation="vertical" className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {groups.map((x, k) => <button key={x.cat} role="tab" type="button" aria-selected={c === k} onClick={() => { setC(k); setOpen(x.items[0]?.question ?? null); }} className={cn(tab(c === k, true), "flex items-center justify-between gap-3 text-left")}>{x.cat}<span className="opacity-60">{x.items.length}</span></button>)}
        </div>
      </div>
      <div data-in="true"><dl key={g.cat} className="fade-in divide-y divide-slate-200 border-y border-slate-200">
        {g.items.map((it, k) => {
          const on = open === it.question, pid = `${uid}-${c}-${k}`;
          return (
            <div key={it.question}>
              <dt><button type="button" id={`${pid}-b`} aria-expanded={on} aria-controls={pid} onClick={() => setOpen(on ? null : it.question)} className={cn("flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-colors hover:text-amber-700", on ? "text-amber-700" : "text-slate-900")}>{it.question}<Plus className={cn("h-4 w-4 shrink-0 transition-transform", on && "rotate-45")} aria-hidden /></button></dt>
              <dd id={pid} role="region" aria-labelledby={`${pid}-b`} inert={!on} className={cn("grid transition-[grid-template-rows,opacity] duration-300", on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}><div className="overflow-hidden"><p className="pb-4 pr-8 text-sm leading-relaxed text-slate-600">{it.answer}</p></div></dd>
            </div>
          );
        })}
      </dl></div>
    </div>
  );
}
