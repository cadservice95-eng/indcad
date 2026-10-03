"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollStage } from "@/components/structural/useScrollStage";
import { useRise } from "@/components/arch/ArchClient";
import { chip } from "@/components/arch/ui";
import { ConvScene, TraceDemo, MiniSheet, Conv3D, LAYERS, ENTS, VIEW_STAGE, STAGE_NAME, Q, mono, type ConvView, type LayerId, type TraceSel } from "./ConvModel";

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

const VIEWS: [ConvView, string][] = [["source", "Source"], ["vector", "Vector"], ["layers", "Layers"], ["native", "Native CAD"], ["final", "Final"]];
const nearest = (s: number): ConvView => (s <= 1 ? "source" : s === 2 ? "vector" : s === 3 || s === 4 ? "native" : s === 5 ? "layers" : "final");

export function HeroConv() {
  const [s, setS] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    if (reduced()) { const t = setTimeout(() => setS(6), 0); return () => clearTimeout(t); }
    if (s >= 6) return;
    const t = setTimeout(() => setS((v) => v + 1), s === 0 ? 2400 : 2100);
    return () => clearTimeout(t);
  }, [s, auto]);
  const v = nearest(s);
  return (
    <div>
      <div className="relative overflow-hidden border border-sky-300/25 bg-[#0B1B33] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
        <ConvScene stage={s} title="A scanned floor plan reconstructed as vector CAD with native text, dimensions and layers" className="block h-auto w-full" />
        <p className="pointer-events-none absolute bottom-2 left-3 border border-slate-500/60 bg-[#0B1B33]/85 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-100">{String(s + 1).padStart(2, "0")} · {STAGE_NAME[s]}</p>
      </div>
      <div className="mt-3">
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-300">View</p>
        <div role="group" aria-label="View" className="flex gap-2 overflow-x-auto pb-1">{VIEWS.map(([k, l]) => <button key={k} type="button" aria-pressed={v === k} onClick={() => { setAuto(false); setS(VIEW_STAGE[k]); }} className={cn(chip(v === k, true), "shrink-0")}>{l}</button>)}</div>
      </div>
    </div>
  );
}

/* ───────── signature flow ───────── */

const SIG = [
  { t: "Source", d: "A scanned drawing.", s: 0 }, { t: "Reconstruction", d: "Vector geometry is rebuilt.", s: 2 }, { t: "Structure", d: "Layers and lineweights are applied.", s: 5 },
  { t: "Native entities", d: "Text and dimensions are real CAD entities.", s: 4 }, { t: "CAD", d: "Editable DWG / DGN in your format.", s: 6 }, { t: "Future use", d: "Design, documentation, revision, archive.", s: 6 },
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
      <Panel label={`${String(i + 1).padStart(2, "0")} · ${s.t}`}><ConvScene stage={s.s} legend={false} title={`The drawing at the "${s.t}" step`} className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <ol className="space-y-1.5">{SIG.map((x, k) => <li key={x.t}><button type="button" aria-pressed={i === k} onClick={() => { setAuto(false); setI(k); }} className={cn("flex w-full items-center gap-3 border px-3 py-2.5 text-left text-sm transition-colors", i === k ? "border-sky-300 bg-sky-300/10 text-white" : k < i ? "border-slate-600 text-slate-300" : "border-slate-700 text-slate-500")}><span className="font-mono text-[10px] opacity-70">{String(k + 1).padStart(2, "0")}</span>{x.t}{k < i ? <span aria-hidden className="ml-auto text-green-400">✓</span> : null}</button></li>)}</ol>
        <p aria-live="polite" className="border-l-2 border-sky-300 px-4 py-2 text-sm text-slate-200">{s.d}</p>
        {i === 5 ? <ul className="grid grid-cols-2 gap-1.5 text-sm text-slate-200">{["Design", "Documentation", "Revision", "Archive"].map((x) => <li key={x} className="border border-slate-600 px-3 py-2">{x}</li>)}</ul> : null}
      </div>
    </div>
  );
}

/* ───────── raster vs trace vs native ───────── */

const TC: { m: "raster" | "trace" | "cad"; t: string; pts: string[] }[] = [
  { m: "raster", t: "Raster image", pts: ["Pixels", "One object", "Cannot be edited as geometry"] },
  { m: "trace", t: "Raster trace", pts: ["Fragmented geometry", "Weak structure", "Looks similar — hard to edit"] },
  { m: "cad", t: "Native CAD", pts: ["Lines, polylines, arcs", "Text and dimensions", "Layers"] },
];
const PROPS: Record<string, [string, string][]> = {
  wall: [["Type", "LINE"], ["Layer", "A-WALL"], ["Lineweight", "Heavy"]], dim: [["Type", "DIMENSION"], ["Layer", "A-DIMS"], ["Value", "3500"]],
  text: [["Type", "TEXT"], ["Layer", "A-TEXT"], ["Content", "OFFICE"]], door: [["Type", "ARC + LINE"], ["Layer", "A-DOOR"], ["Use", "Block where applicable"]],
};
export function TraceCompare() {
  const [mi, setMi] = useState(2);
  const [sel, setSel] = useState<TraceSel>("wall");
  const m = TC[mi];
  const pick = (k: number) => { setMi(k); setSel(k === 0 ? "all" : k === 1 ? "frag" : "wall"); };
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label={`${m.t} · same drawing · select to see what you actually get`}><TraceDemo mode={m.m} sel={sel} className="block h-auto w-full" /></Panel>
      <div className="space-y-4">
        <div role="tablist" aria-label="Representation" className="flex gap-2 overflow-x-auto pb-1">{TC.map((x, k) => <button key={x.m} role="tab" type="button" aria-selected={mi === k} onClick={() => pick(k)} className={cn(chip(mi === k, true), "shrink-0")}>{x.t}</button>)}</div>
        <ul className="space-y-1.5 text-sm text-slate-200">{m.pts.map((p) => <li key={p} className="flex gap-2 border border-slate-700 px-3 py-2"><span aria-hidden className={cn("mt-2 h-1.5 w-1.5 shrink-0", m.m === "cad" ? "bg-green-400" : "bg-amber-400")} />{p}</li>)}</ul>
        {m.m === "cad" ? (
          <>
            <div role="group" aria-label="Select an entity" className="flex flex-wrap gap-2">{([["wall", "Wall line"], ["dim", "Dimension"], ["text", "Text"], ["door", "Door"]] as const).map(([k, l]) => <button key={k} type="button" aria-pressed={sel === k} onClick={() => setSel(k)} className={chip(sel === k, true)}>{l}</button>)}</div>
            <dl aria-live="polite" className="border border-slate-600 text-sm">{(PROPS[sel as string] ?? PROPS.wall).map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-b border-slate-700 px-4 py-2 last:border-0"><dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">{k}</dt><dd className="text-white">{v}</dd></div>)}</dl>
          </>
        ) : <p className="border-l-2 border-amber-400 px-4 py-2 text-sm text-slate-300">{m.m === "raster" ? "Selecting it selects the whole image — one object." : "Selecting it selects one small fragment among many."}</p>}
      </div>
    </div>
  );
}

/* ───────── entity explorer & explode ───────── */

const ENT = [
  { k: "Line", d: "Editable line", art: <path d="M20 60L180 20" />, rows: [["Type", "LINE"], ["Layer", "A-WALL"], ["Editable", "Endpoints, length"]] },
  { k: "Polyline", d: "Editable geometry", art: <path d="M20 70L70 30L120 60L180 20" />, rows: [["Type", "POLYLINE"], ["Layer", "A-WALL"], ["Editable", "Vertices"]] },
  { k: "Text", d: "Editable text", art: <text x="30" y="55" fontSize="28" fill="currentColor" stroke="none" style={mono}>OFFICE</text>, rows: [["Type", "TEXT"], ["Layer", "A-TEXT"], ["Editable", "Content, height"]] },
  { k: "Dimension", d: "Native dimension", art: <><path d="M20 50H180M20 40V60M180 40V60" /><text x="100" y="40" fontSize="14" fill="currentColor" stroke="none" textAnchor="middle" style={mono}>3500</text></>, rows: [["Type", "DIMENSION"], ["Layer", "A-DIMS"], ["Editable", "Value, style"]] },
  { k: "Layer", d: "Structured CAD layer", art: <><rect x="30" y="20" width="140" height="14" /><rect x="40" y="40" width="140" height="14" /><rect x="50" y="60" width="140" height="14" /></>, rows: [["Type", "LAYER"], ["Name", "A-WALL"], ["Controls", "Colour, weight, visibility"]] },
  { k: "Block", d: "Reusable component where applicable", art: <><rect x="70" y="20" width="60" height="50" /><path d="M70 20l60 50M130 20l-60 50" /></>, rows: [["Type", "BLOCK"], ["Layer", "S-COLS"], ["Editable", "Definition, instances"]] },
];
export function EntityExplorer() {
  const [i, setI] = useState(3);
  const [ex, setEx] = useState(false);
  const e = ENT[i];
  return (
    <div className="space-y-6">
      <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">{ENT.map((x, k) => <li key={x.k}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn(chip(i === k), "w-full")}>{x.k}</button></li>)}</ul>
          <div className="border border-slate-300 bg-white"><svg viewBox="0 0 200 90" className="block h-auto w-full text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" role="img" aria-label={`${e.k} entity`}><title>{e.k}</title>{e.art}</svg>
            <dl className="border-t border-slate-200 text-sm">{e.rows.map(([a, b]) => <div key={a} className="flex justify-between gap-3 border-b border-slate-100 px-4 py-2 last:border-0"><dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{a}</dt><dd className="font-medium text-slate-900">{b}</dd></div>)}</dl></div>
          <p className="text-xs text-slate-500">Illustrative — not every drawing contains every entity.</p>
        </div>
        <div>
          <button type="button" role="switch" aria-checked={ex} onClick={() => setEx((v) => !v)} className={chip(ex)}>{ex ? "Reassemble drawing" : "Break drawing into entities"}</button>
          <div className="mt-3 border border-slate-300 bg-[#0B1B33] p-2">
            <svg viewBox="0 0 640 440" className="block h-auto w-full" role="img" aria-label="A drawing separated into lines, arcs, blocks, text and dimensions, then reassembled" fill="none" strokeLinecap="round">
              <title>Drawing entities</title>
              {(["A-WALL", "A-DOOR", "A-WIND", "S-COLS", "M-EQUIP", "A-DIMS", "A-TEXT"] as LayerId[]).map((L, gi) => {
                const lc = LAYERS.find((l) => l.id === L)!.color;
                return (
                  <g key={L} style={{ transform: ex ? `translate(${((gi % 2) * 2 - 1) * 14}px, ${(gi - 3) * 22}px)` : "none", transition: "transform 0.9s ease" }}>
                    {ENTS.filter((x) => x.layer === L).map((x) => x.kind === "text" ? <text key={x.id} x={x.x} y={x.y} fontSize={x.size} textAnchor="middle" fill={lc} stroke="none" style={mono}>{x.t}</text> : <path key={x.id} d={x.d} stroke={lc} strokeWidth={ex ? 2 : 1.4} />)}
                    {ex ? <text x="600" y={(ENTS.find((x) => x.layer === L && x.kind !== "text")?.d ? 100 : 100) + gi * 0} fontSize="9" fill={lc} stroke="none" textAnchor="end" style={mono} transform={`translate(0 ${gi * 44})`}>{L}</text> : null}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── editable dimension ───────── */

export function DimEdit() {
  const [val, setVal] = useState(3500);
  const [picked, setPicked] = useState(true);
  const x1 = 60 + (val / 3500) * 220;
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label="Native dimension · select it, then edit the value">
        <svg viewBox="0 0 460 200" className="block h-auto w-full" fill="none" strokeLinecap="round" role="img" aria-label="A native CAD dimension whose value can be changed" >
          <title>Editable dimension</title>
          <rect width="460" height="200" fill={Q.navy} />
          <path d={`M60 130H${x1}`} stroke="#E2E8F0" strokeWidth="3" style={{ transition: "d .5s" }} /><path d={`M60 130V90M${x1} 130V90`} stroke="#64748B" strokeDasharray="3 3" style={{ transition: "d .5s" }} />
          <g role="button" tabIndex={0} aria-label="Select the dimension" style={{ cursor: "pointer", outline: "none" }} onClick={() => setPicked(true)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPicked(true); } }}>
            <path d={`M60 76H${x1}M60 68V84M${x1} 68V84M55 81l10 -10M${x1 - 5} 81l10 -10`} stroke={picked ? Q.cyan : "#4ADE80"} strokeWidth={picked ? 2.2 : 1.2} />
            <text x={(60 + x1) / 2} y="66" textAnchor="middle" fontSize="14" fill={picked ? Q.cyan : "#4ADE80"} style={mono}>{val}</text>
            {picked ? [60, x1, (60 + x1) / 2].map((x, i) => <rect key={i} x={x - 3} y={73} width="6" height="6" fill="#fff" stroke={Q.cyan} />) : null}
          </g>
        </svg>
      </Panel>
      <div className="space-y-4">
        <dl aria-live="polite" className="border border-slate-300 bg-white text-sm">{[["Value", String(val)], ["Style", "Project dimension style"], ["Layer", "A-DIMS"], ["Text", "Associative"]].map(([a, b]) => <div key={a} className="flex justify-between gap-3 border-b border-slate-200 px-4 py-2.5 last:border-0"><dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{a}</dt><dd className="font-medium text-slate-900">{b}</dd></div>)}</dl>
        <div className="flex gap-2"><button type="button" onClick={() => setVal(3600)} className={chip(val === 3600)}>Change 3500 → 3600</button><button type="button" onClick={() => setVal(3500)} className={chip(val === 3500)}>Reset</button></div>
        <p className="text-sm text-slate-600">Because the dimension is a real CAD entity, a design change means updating one value — not redrawing the sheet. Conceptual demonstration only.</p>
      </div>
    </div>
  );
}

/* ───────── layer panel ───────── */

export function LayerPanel() {
  const [hidden, setHidden] = useState<LayerId[]>([]);
  const toggle = (id: LayerId) => setHidden((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]));
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label="Layer manager · toggle a layer"><ConvScene stage={5} hidden={hidden} legend={false} title="The converted drawing with CAD layers that can be switched on and off" className="block h-auto w-full" /></Panel>
      <div className="space-y-3">
        <ul className="border border-slate-600">{LAYERS.map((l) => (
          <li key={l.id}><button type="button" role="switch" aria-checked={!hidden.includes(l.id)} onClick={() => toggle(l.id)} className="flex min-h-[44px] w-full items-center gap-3 border-b border-slate-700 px-3 py-2 text-left text-sm transition-colors last:border-0 hover:bg-white/5"><span aria-hidden className="h-3 w-3" style={{ background: hidden.includes(l.id) ? "transparent" : l.color, border: `1px solid ${l.color}` }} /><span className="font-mono text-white">{l.id}</span><span className="flex-1 text-slate-400">{l.label}</span><span className="font-mono text-[10px] text-slate-400">{hidden.includes(l.id) ? "OFF" : "ON"}</span></button></li>
        ))}</ul>
        <p className="text-xs text-slate-400">Layer names are illustrative examples — not a mandatory Render CAD Hub naming convention. A standard is agreed per archive.</p>
      </div>
    </div>
  );
}

/* ───────── archive flow ───────── */

const AF = ["Legacy archive", "Standardise", "Convert", "Organise", "CAD archive"];
export function ArchiveFlow() {
  const [s, setS] = useState(0);
  const [play, setPlay] = useState(true);
  useEffect(() => {
    if (!play) return;
    if (reduced()) { const t = setTimeout(() => setS(4), 0); return () => clearTimeout(t); }
    const t = setTimeout(() => setS((v) => (v + 1) % AF.length), s === 4 ? 3200 : 2000);
    return () => clearTimeout(t);
  }, [s, play]);
  const rot = [-4, 3, -2, 5, -3, 2, 4, -5, 2, -3, 3, -2];
  return (
    <div>
      <div role="group" aria-label="Archive stage" className="mb-3 flex gap-2 overflow-x-auto pb-1">{AF.map((a, k) => <button key={a} type="button" aria-pressed={s === k} onClick={() => { setPlay(false); setS(k); }} className={cn(chip(s === k, true), "shrink-0")}>{k + 1} · {a}</button>)}</div>
      <div className="border border-sky-300/25 bg-[#0B1B33] p-4">
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {rot.map((r, i) => (
            <li key={i} className="transition-all duration-700" style={{ transform: s < 3 ? `rotate(${r}deg) translateY(${(i % 3) * 3}px)` : "none" }}>
              <div className="overflow-hidden border" style={{ borderColor: s >= 4 ? "#22C55E" : s >= 2 ? "#38BDF8" : "#8A7F66" }}><MiniSheet tone={s < 2 ? "scan" : s === 2 ? "vector" : "std"} weight={s < 1 ? 1.2 + (i % 3) * 0.5 : 1.2} className="block h-auto w-full" /></div>
              <p className="mt-1 truncate font-mono text-[9px] text-slate-300">{s < 1 ? ["scan_old.pdf", "DWG_final2", "plan(1).dgn", "sheet-3.tif"][i % 4] : s < 3 ? `ARC-${String(i + 1).padStart(3, "0")}` : `ARC-${String(i + 1).padStart(3, "0")}_R0_A-WALL`}</p>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-300">{["Mixed names, formats and line weights", "One layer standard and naming convention agreed", "Each drawing rebuilt as vector CAD", "Consistent structure and numbering", "Consistent naming · consistent layers · consistent output"][s]}</p>
    </div>
  );
}

export function ArchiveStandard() {
  const [on, setOn] = useState(false);
  const rows = [["Layers", ["WALLS_1", "wall", "A-W"], "A-WALL"], ["Naming", ["plan final2", "Drg_07", "FLR-plan"], "ARC-001_R0"], ["Lineweight", ["0.13", "0.5", "0.25"], "Per standard"]] as const;
  return (
    <div>
      <button type="button" role="switch" aria-checked={on} onClick={() => setOn((v) => !v)} className={chip(on)}>{on ? "Common standard applied" : "Apply a common standard"}</button>
      <ul className="mt-4 grid gap-3 [&>*]:min-w-0 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <li key={i} className="overflow-hidden border border-slate-300 bg-white">
            <MiniSheet tone={on ? "std" : "vector"} weight={on ? 1.3 : [0.6, 2, 1][i]} className="block h-auto w-full" />
            <dl className="divide-y divide-slate-100 text-xs">{rows.map(([k, v, std]) => <div key={k} className="flex justify-between gap-2 px-3 py-1.5"><dt className="font-mono text-[10px] uppercase text-slate-500">{k}</dt><dd className={cn("font-mono transition-colors duration-500", on ? "text-green-700" : "text-orange-700")}>{on ? std : v[i]}</dd></div>)}</dl>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-slate-600">{on ? "All three drawings now share layers, naming and line weights." : "Converted file by file, each drawing ends up with its own layers, names and weights."}</p>
    </div>
  );
}

/* ───────── conflict + correction ───────── */

export function Conflict() {
  const [dec, setDec] = useState<string | null>(null);
  const dr = [["Drawing A", "Revision 03", "Wall at 3500"], ["Drawing B", "Revision 05", "Wall at 3600"], ["Drawing C", "Revision —", "Different geometry"]];
  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-3">{dr.map(([t, r, g], i) => <li key={t} className="overflow-hidden border border-slate-300 bg-white"><MiniSheet tone="scan" weight={1 + i * 0.2} className="block h-auto w-full" /><div className="p-3 text-sm"><p className="font-semibold text-slate-900">{t}</p><p className="font-mono text-[11px] text-slate-500">{r}</p><p className="text-slate-600">{g}</p></div></li>)}</ul>
      <div className="my-4 flex items-center gap-3 border border-orange-500 bg-orange-50 px-4 py-3 text-sm text-orange-900"><span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center border border-orange-600 font-mono">!</span><span><strong>Conflict identified.</strong> The drawings don&apos;t agree — none is silently picked as correct.</span></div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">Client / project team decides</p>
      <div role="group" aria-label="Decision" className="flex flex-wrap gap-2">{["Use latest revision", "Use a named drawing", "Reproduce all, flag differences"].map((d) => <button key={d} type="button" aria-pressed={dec === d} onClick={() => setDec(d)} className={chip(dec === d)}>{d}</button>)}</div>
      <p aria-live="polite" className="mt-3 text-sm text-slate-600">{dec ? `Recorded: “${dec}” — the project team's decision, noted with the conversion.` : "Pick an option to see how the decision is recorded. Examples only."}</p>
    </div>
  );
}

export function Correction() {
  const [m, setM] = useState<"faithful" | "corrected">("faithful");
  const c = m === "corrected";
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-3">
        {([["faithful", "Faithful conversion", "Reproduce the supplied drawing as provided."], ["corrected", "Corrected conversion", "Incorporate agreed known corrections."]] as const).map(([k, t, d]) => <button key={k} type="button" aria-pressed={m === k} onClick={() => setM(k)} className={cn("block w-full border p-4 text-left transition-colors", m === k ? "border-blue-600 bg-white" : "border-slate-300 hover:border-slate-900")}><span className="text-base font-semibold text-slate-900">{t}</span><span className="mt-1 block text-sm text-slate-600">{d}</span></button>)}
        <p className="border-l-2 border-blue-600 bg-white px-4 py-3 text-sm text-slate-700"><strong className="block text-slate-900">Document the approach.</strong>Where errors or outdated information are known, the project team decides; the choice is recorded. Nothing is corrected automatically.</p>
      </div>
      <Panel label={c ? "Corrected conversion · agreed correction applied" : "Faithful conversion · source reproduced"}>
        <svg viewBox="0 0 400 180" className="block h-auto w-full" fill="none" strokeLinecap="round" role="img" aria-label={c ? "Dimension corrected with a revision cloud" : "Dimension reproduced as in the source"}><title>Faithful versus corrected</title>
          <rect width="400" height="180" fill={Q.navy} /><path d="M60 120H340M60 40V120M340 40V120" stroke="#E2E8F0" strokeWidth="2.4" /><path d="M60 70H340M60 62V78M340 62V78" stroke="#4ADE80" />
          <text x="200" y="60" textAnchor="middle" fontSize="14" fill="#4ADE80" style={mono}>{c ? "3600" : "3500"}</text>
          {c ? <><path d="M150 40c10 -12 30 -12 40 0s30 12 40 0 20 -10 24 4v18c-12 8 -24 8 -36 0s-26 8 -38 0 -22 -4 -30 -4z" stroke={Q.amber} strokeWidth="1.4" /><text x="200" y="22" textAnchor="middle" fontSize="9" fill={Q.amber} style={mono}>AGREED CORRECTION</text></> : <text x="200" y="22" textAnchor="middle" fontSize="9" fill="#94A3B8" style={mono}>AS SUPPLIED</text>}
        </svg>
      </Panel>
    </div>
  );
}

/* ───────── batch ───────── */

const BT = [{ t: "Single file", n: 1 }, { t: "Small set", n: 6 }, { t: "Large archive", n: 24 }];
export function Batch() {
  const [i, setI] = useState(1);
  return (
    <div>
      <div role="group" aria-label="Scale" className="mb-3 flex gap-2">{BT.map((b, k) => <button key={b.t} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={chip(i === k, true)}>{b.t}</button>)}</div>
      <div className="border border-sky-300/25 bg-[#0B1B33] p-4"><ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">{Array.from({ length: BT[i].n }, (_, k) => <li key={k} className="overflow-hidden border border-sky-300/40"><MiniSheet tone="std" className="block h-auto w-full" /></li>)}</ul></div>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{["Consistent layers", "Consistent naming", "Consistent file structure", "One output format"].map((x) => <li key={x} className="border border-slate-600 px-3 py-2 text-sm text-slate-200">✓ {x}</li>)}</ul>
    </div>
  );
}

/* ───────── 2D → 3D ───────── */

export function Conv3DSection() {
  const [s, setS] = useState<0 | 1 | 2>(2);
  const rise = useRise(s === 2, 1300);
  const names = ["2D drawing", "Geometry interpretation", "3D model"];
  return (
    <div>
      <div role="group" aria-label="Step" className="mb-3 flex gap-2 overflow-x-auto pb-1">{names.map((n, k) => <button key={n} type="button" aria-pressed={s === k} onClick={() => setS(k as 0 | 1 | 2)} className={cn(chip(s === k), "shrink-0")}>{k + 1} · {n}</button>)}</div>
      <Panel label={names[s]}><Conv3D step={s} rise={s === 2 ? rise : 0} className="mx-auto block h-auto w-full max-w-3xl" /></Panel>
    </div>
  );
}

/* ───────── QC + before/after ───────── */

export function QualityCheck() {
  const [v, setV] = useState<"source" | "converted" | "overlay">("overlay");
  const checks = ["Geometry", "Dimensions", "Text", "Layers"];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Panel label={`${v} view`}>
        <div className="relative"><ConvScene stage={v === "source" ? 0 : 6} legend={false} title="Source and converted drawing compared" className="block h-auto w-full" />
          {v === "overlay" ? <div className="pointer-events-none absolute inset-0 opacity-45 mix-blend-multiply"><ConvScene stage={0} legend={false} title="Source overlay" className="block h-auto w-full" /></div> : null}</div>
      </Panel>
      <div className="space-y-4">
        <div role="group" aria-label="View" className="flex flex-wrap gap-2">{(["source", "converted", "overlay"] as const).map((k) => <button key={k} type="button" aria-pressed={v === k} onClick={() => setV(k)} className={chip(v === k, true)}>{k}</button>)}</div>
        <ul className="grid grid-cols-2 gap-2">{checks.map((c) => <li key={c} className="flex items-center gap-2 border border-slate-600 px-3 py-2.5 text-sm text-slate-200"><span aria-hidden className="grid h-5 w-5 place-items-center border border-green-500 text-xs text-green-400">✓</span>{c}</li>)}</ul>
        <p className="text-xs text-slate-400">Converted files are checked against the source before delivery. No universal accuracy figure is claimed.</p>
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <div>
      <Panel label="Source ↔ converted">
        <div className="relative">
          <ConvScene stage={6} legend={false} title="Converted CAD drawing" className="block h-auto w-full" />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><ConvScene stage={0} legend={false} title="Scanned source drawing" className="block h-auto w-full" /></div>
          <div className="pointer-events-none absolute inset-y-0 w-px bg-sky-400" style={{ left: `${pos}%` }} />
          <span className="pointer-events-none absolute left-2 top-2 border border-slate-500 bg-white/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-700">Source · scan</span>
          <span className="pointer-events-none absolute right-2 top-2 border border-slate-500 bg-white/90 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-700">Converted · CAD</span>
        </div>
      </Panel>
      <label className="mx-auto mt-3 flex max-w-3xl items-center gap-3"><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">Source</span><input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Compare source and converted drawing" className="h-8 flex-1 accent-sky-400" /><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">Converted</span></label>
    </div>
  );
}

/* ───────── process + CTA ───────── */

const PSG = [0, 0, 5, 6, 6];
export function ConvProcess({ steps }: { steps: { title: string; description: string }[] }) {
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
            <div className="mt-3 hidden overflow-hidden border border-slate-300 sm:block"><ConvScene stage={i <= stage ? PSG[i] : 0} legend={false} title={`Step ${i + 1} of the conversion workflow`} className="block h-auto w-full" /></div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CtaConv() {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver((e) => {
      if (!e.some((x) => x.isIntersecting)) return;
      ob.disconnect();
      if (reduced()) { setS(6); return; }
      [2, 4, 5, 6].forEach((v, k) => setTimeout(() => setS(v), 700 + k * 1300));
    }, { threshold: 0.3 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return <div ref={ref} className="overflow-hidden border border-sky-300/25 bg-[#0B1B33]"><ConvScene stage={s} legend={false} title="An old scanned drawing becoming a clean CAD drawing" className="block h-auto w-full" /></div>;
}
