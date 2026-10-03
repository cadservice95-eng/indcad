"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollStage } from "@/components/structural/useScrollStage";
import { chip } from "@/components/arch/ui";
import { DrawingSvg, DRAW, KIND_LABEL, layersOf, layerColor, Z, mono, type Disc, type DrawMode } from "./PdfModel";

const css = (o: Record<string, string | number>) => o as React.CSSProperties;
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Win({ children, label, meta, className }: { children: React.ReactNode; label: string; meta?: string; className?: string }) {
  return (
    <figure className={cn("overflow-hidden border border-slate-300 bg-white shadow-[0_18px_40px_-26px_rgba(15,23,42,0.5)]", className)}>
      <figcaption className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600"><span>{label}</span>{meta ? <span className="hidden text-slate-400 sm:inline">{meta}</span> : null}</figcaption>
      {children}
    </figure>
  );
}

/* ───────── hero ───────── */

const STEPS = ["PDF source", "Geometry extraction", "Vector reconstruction", "Layer assignment", "Native CAD entities"];
const stepOf = (s: number) => (s <= 0 ? 0 : s === 1 ? 1 : s === 2 ? 2 : s === 3 ? 3 : 4);
const HL = ["A-WALL", "A-DOOR", "A-DIMS", "A-TEXT", "A-HATCH"];

export function HeroWorkspace() {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (reduced()) { const t = setTimeout(() => setS(7), 0); return () => clearTimeout(t); }
    const t = setTimeout(() => setS((v) => (v >= 7 ? 0 : v + 1)), s === 7 ? 4200 : s === 0 ? 1800 : 1600);
    return () => clearTimeout(t);
  }, [s]);
  const step = stepOf(s);
  return (
    <div className="overflow-hidden border border-slate-600 bg-[#101A2E] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-slate-700 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400"><span>Conversion workspace · illustrative</span><span className="text-sky-300">{s >= 7 ? "Editable DWG" : "Reconstructing…"}</span></div>
      <div className="grid gap-3 p-3 [&>*]:min-w-0 lg:grid-cols-[1fr_170px_1fr] lg:items-stretch">
        <div className="relative overflow-hidden border border-slate-500 bg-white">
          <p className="absolute left-2 top-2 z-10 border border-slate-400 bg-white/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-700">PDF source · reference drawing · vector / scanned</p>
          <DrawingSvg mode="pdf" title="A PDF drawing sheet: floor plan with dimensions, text and hatching" className="block h-auto w-full" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 h-0.5 bg-sky-400/80 shadow-[0_0_12px_rgba(56,189,248,0.9)] transition-all duration-1000" style={{ top: s === 1 ? "86%" : "8%", opacity: s === 1 ? 1 : 0 }} />
        </div>
        <ol className="grid grid-cols-5 gap-1 lg:grid-cols-1 lg:content-center lg:gap-2" aria-label="Conversion stages">
          {STEPS.map((t, i) => (
            <li key={t} className={cn("flex flex-col items-center gap-1 border px-1 py-2 text-center font-mono text-[9px] uppercase leading-tight tracking-[0.1em] transition-colors duration-500 lg:flex-row lg:justify-start lg:gap-2 lg:px-2 lg:text-left", i === step ? "border-sky-300 bg-sky-300/10 text-sky-100" : i < step ? "border-slate-600 text-slate-300" : "border-slate-700 text-slate-500")}>
              <span className="grid h-4 w-4 shrink-0 place-items-center border border-current text-[9px]">{i < step ? "✓" : i + 1}</span><span>{t}</span>
            </li>
          ))}
        </ol>
        <div className="relative overflow-hidden border border-sky-300/40 bg-[#0B1220]">
          <p className="absolute left-2 top-2 z-10 border border-sky-300/60 bg-[#0B1220]/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-sky-200">Editable DWG</p>
          <DrawingSvg mode="cad" phase={s} title="The same drawing rebuilt as native CAD with layers, text, dimensions and hatches" className="block h-auto w-full" />
          <ul className="absolute right-2 top-2 hidden w-24 border border-slate-600 bg-[#0B1220]/90 p-1.5 sm:block" aria-label="Layer panel (illustrative)">
            {HL.map((l) => <li key={l} className="flex items-center gap-1.5 font-mono text-[8px] text-slate-300 transition-opacity duration-500" style={{ opacity: s >= 3 ? 1 : 0.25 }}><span className="h-2 w-2" style={{ background: layerColor(l) }} />{l}</li>)}
          </ul>
          <p className={cn("absolute bottom-2 left-2 border border-green-500/70 bg-[#0B1220]/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-green-400 transition-opacity duration-500", s >= 7 ? "opacity-100" : "opacity-0")}>● Editable entities</p>
        </div>
      </div>
    </div>
  );
}

/* ───────── raster trace vs native ───────── */

const RM: { k: "pdf" | "trace" | "cad"; t: string; mode: DrawMode; pts: string[] }[] = [
  { k: "pdf", t: "PDF", mode: "pdf", pts: ["Fixed document", "Reference only", "Geometry locked into the file"] },
  { k: "trace", t: "Trace", mode: "trace", pts: ["Image background", "Tracing lines over pixels", "Weak layer structure · text is not live"] },
  { k: "cad", t: "Native CAD", mode: "cad", pts: ["Clean geometry on separate layers", "Native text and dimensions", "Structured blocks and hatches"] },
];
export function RasterCompare() {
  const [i, setI] = useState(2);
  const m = RM[i];
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <Win label={m.k === "cad" ? "Editable DWG" : m.k === "trace" ? "Raster trace" : "PDF source"} meta="Same drawing, three states"><div key={m.k} data-in="true" className="fade-in"><DrawingSvg mode={m.mode} title={`The same drawing as ${m.t}`} className="block h-auto w-full" /></div></Win>
      <div className="space-y-4">
        <div role="tablist" aria-label="Drawing state" className="flex gap-2 overflow-x-auto pb-1">{RM.map((x, k) => <button key={x.k} role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} className={cn(chip(i === k), "shrink-0")}>{x.t}</button>)}</div>
        <ul className="space-y-1.5 text-sm text-slate-700">{m.pts.map((p) => <li key={p} className="flex gap-2 border border-slate-300 bg-white px-3 py-2"><span aria-hidden className={cn("mt-2 h-1.5 w-1.5 shrink-0", m.k === "cad" ? "bg-green-600" : "bg-amber-500")} />{p}</li>)}</ul>
        <p className="border-l-2 border-blue-600 bg-white px-4 py-3 text-sm text-slate-700">{m.k === "cad" ? "The result: an editable DWG." : "Not a CAD file you can work in — which is why drawings are rebuilt, not placed under a CAD layer and traced."}</p>
      </div>
    </div>
  );
}

/* ───────── editable entities ───────── */

const INFO: Record<string, string> = { line: "Editable", poly: "Editable", arc: "Editable", circle: "Editable", hatch: "Editable hatch object", text: "Editable", dim: "Native CAD entity", block: "Reusable block" };
export function EditableEntities() {
  const [sel, setSel] = useState<string>("w1");
  const e = DRAW.arch.ents.find((x) => x.id === sel) ?? DRAW.arch.ents[0];
  const names: Record<string, string> = { poly: "Wall line", line: "Line", arc: "Door swing", circle: "Column", hatch: "Hatch", text: "Text", dim: "Dimension", block: "Block" };
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <Win label="CAD canvas · hover or tap an element"><DrawingSvg mode="cad" sel={sel} onSel={setSel} title="Interactive CAD drawing: select an element to see its entity type and layer" className="block h-auto w-full touch-manipulation" /></Win>
      <div className="space-y-4">
        <dl aria-live="polite" className="border border-slate-300 bg-white text-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-700">{names[e.kind] ?? e.kind}{e.t ? ` · “${e.t}”` : ""}</div>
          {[["Entity", KIND_LABEL[e.kind]], ["Layer", e.layer], ["Status", INFO[e.kind]]].map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0"><dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{k}</dt><dd className="font-semibold text-slate-900">{v}</dd></div>)}
        </dl>
        <ul className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-slate-600">{["Line", "Polyline", "Arc", "Circle", "Hatch", "Text", "Dimension", "Block", "Layer"].map((x) => <li key={x} className="border border-slate-300 bg-white px-1 py-1.5">{x}</li>)}</ul>
        <p className="text-sm text-slate-600">Rather than just saying “editable”, every element is an actual CAD entity with a type and a layer.</p>
      </div>
    </div>
  );
}

/* ───────── dimension consistency ───────── */

export function DimConsistency() {
  const [chk, setChk] = useState(false);
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Win label={chk ? "After dimension check" : "As supplied"}>
        <svg viewBox="0 0 520 220" className="block h-auto w-full" fill="none" strokeLinecap="round" role="img" aria-label="A wall drawn to 2400 but dimensioned 2350"><title>Geometry and dimension disagree</title>
          <rect width="520" height="220" fill="#fff" />
          <path d="M60 140H300" stroke="#1F2937" strokeWidth="3" /><path d="M60 140V70M300 140V70" stroke="#94A3B8" strokeDasharray="3 3" />
          <path d="M60 90H300M60 82V98M300 82V98M55 95l10 -10M295 95l10 -10" stroke={chk ? Z.amber : "#1F2937"} strokeWidth={chk ? 2 : 1} />
          <text x="180" y="80" textAnchor="middle" fontSize="16" fill={chk ? Z.amber : "#1F2937"} style={mono}>2350</text>
          <text x="180" y="168" textAnchor="middle" fontSize="11" fill="#475569" style={mono}>DRAWN LENGTH ≈ 2400</text>
          {chk ? <g><circle cx="180" cy="50" r="14" stroke={Z.amber} strokeWidth="2" /><text x="180" y="55" textAnchor="middle" fontSize="14" fill={Z.amber} style={mono}>!</text></g> : null}
        </svg>
      </Win>
      <div className="space-y-4">
        <button type="button" role="switch" aria-checked={chk} onClick={() => setChk((v) => !v)} className={chip(chk)}>{chk ? "Check performed" : "Check dimensions against geometry"}</button>
        {chk ? (
          <div data-in="true" className="fade-in border border-orange-500 bg-orange-50 p-4 text-sm text-orange-950">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em]">Source inconsistency detected</p>
            <p className="mt-2 font-mono text-base">Geometry ≠ Dimension</p><p className="mt-1">Requires confirmation — we don&apos;t silently choose which is right.</p>
          </div>
        ) : <p className="border border-slate-300 bg-white p-4 text-sm text-slate-600">A PDF dimension can be out of date relative to the drawn geometry. Run the check to see how it is handled.</p>}
        <p className="text-sm text-slate-600">Dimension values are checked against the visible drawing during conversion, not just copied as text. The team confirms the intent — it isn&apos;t decided automatically.</p>
      </div>
    </div>
  );
}

/* ───────── text ambiguity ───────── */

export function TextAmbiguity() {
  const [v, setV] = useState<"scan" | "conv">("scan");
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.2fr_1fr]">
      <Win label={v === "scan" ? "Scanned title block" : "Converted drawing"}>
        <svg viewBox="0 0 420 180" className="block h-auto w-full" fill="none" role="img" aria-label="A scanned note with an ambiguous character, shown as scanned and as flagged in the converted drawing"><title>Ambiguous scanned character</title>
          <defs><filter id="ta-b"><feGaussianBlur stdDeviation="0.9" /></filter></defs>
          <rect width="420" height="180" fill={v === "scan" ? "#E8E0CC" : "#fff"} /><rect x="14" y="14" width="392" height="152" stroke="#6B6252" />
          <text x="30" y="60" fontSize="14" fill="#4A4436" filter={v === "scan" ? "url(#ta-b)" : undefined} opacity={v === "scan" ? 0.7 : 1} style={mono}>HOLE DIA.</text>
          <text x="200" y="64" fontSize="34" fill="#4A4436" filter={v === "scan" ? "url(#ta-b)" : undefined} opacity={v === "scan" ? 0.65 : 1} style={mono}>{v === "scan" ? "Ø25" : "Ø25 ?"}</text>
          {v === "scan" ? <path d="M200 78l22 -34" stroke="#E8E0CC" strokeWidth="3" /> : null}
          {v === "conv" ? <g><rect x="190" y="30" width="110" height="44" stroke={Z.amber} strokeWidth="2" strokeDasharray="4 3" /><rect x="190" y="84" width="150" height="20" fill={Z.amber} fillOpacity="0.15" stroke={Z.amber} /><text x="196" y="98" fontSize="10" fill="#92400E" style={mono}>REQUIRES REVIEW</text></g> : null}
          <text x="30" y="140" fontSize="11" fill="#475569" style={mono}>MATERIAL: AS NOTED</text>
        </svg>
      </Win>
      <div className="space-y-4">
        <div role="group" aria-label="View" className="flex gap-2"><button type="button" aria-pressed={v === "scan"} onClick={() => setV("scan")} className={chip(v === "scan")}>Scanned source</button><button type="button" aria-pressed={v === "conv"} onClick={() => setV("conv")} className={chip(v === "conv")}>Converted drawing</button></div>
        <ul className="space-y-1.5 text-sm"><li className="flex justify-between border border-slate-300 bg-white px-3 py-2"><span>Reading A</span><span className="font-mono">Ø25</span></li><li className="flex justify-between border border-slate-300 bg-white px-3 py-2"><span>Reading B</span><span className="font-mono">025</span></li><li className="flex justify-between border border-orange-400 bg-orange-50 px-3 py-2 text-orange-900"><span>Character confidence</span><span className="font-mono">Requires review</span></li></ul>
        <p className="text-sm text-slate-600">Poor scan quality or an unusual font can make a character genuinely ambiguous. It is flagged on the drawing — never guessed and presented as confirmed.</p>
      </div>
    </div>
  );
}

/* ───────── office standard ───────── */

const GEN = ["Layer 1", "Layer 2", "Layer 3", "Layer 4", "Layer 5", "Layer 6"];
export function Standards() {
  const [std, setStd] = useState(true);
  const names = layersOf("arch");
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <Win label={std ? "Converted to the office standard" : "Generic conversion"}><DrawingSvg mode={std ? "cad" : "mono"} title={std ? "Drawing with layers named to an office standard" : "Drawing with generic layers"} className="block h-auto w-full" /></Win>
      <div className="space-y-4">
        <div role="group" aria-label="Layer structure" className="flex gap-2"><button type="button" aria-pressed={!std} onClick={() => setStd(false)} className={chip(!std)}>Generic</button><button type="button" aria-pressed={std} onClick={() => setStd(true)} className={chip(std)}>Office standard</button></div>
        <ul className="border border-slate-300 bg-white">{names.map((n, i) => <li key={n} className="flex items-center gap-3 border-b border-slate-100 px-4 py-2 font-mono text-sm last:border-0"><span aria-hidden className="h-3 w-3" style={{ background: std ? layerColor(n) : "#94A3B8" }} /><span className={std ? "text-slate-900" : "text-slate-500"}>{std ? n : GEN[i]}</span></li>)}</ul>
        <p className="text-sm text-slate-600">Layer names are illustrative examples. Supplied layer and naming conventions can be incorporated into the conversion scope.</p>
      </div>
    </div>
  );
}

/* ───────── batch consistency ───────── */

const SHEETS = ["A-101", "A-102", "A-103", "A-104", "A-105"];
const CHECKS = ["Wall hatch", "Symbol convention", "Layer naming"];
export function BatchCheck() {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduced()) { const x = setTimeout(() => setT(15), 0); return () => clearTimeout(x); }
    const x = setTimeout(() => setT((v) => (v >= 17 ? 0 : v + 1)), t >= 15 ? 1400 : 650);
    return () => clearTimeout(x);
  }, [t]);
  const ci = Math.min(2, Math.floor(t / 5)), si = t % 5;
  return (
    <div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {SHEETS.map((s, i) => (
          <li key={s} className={cn("relative overflow-hidden border bg-[#0B1220] transition-colors duration-300", t < 15 && si === i ? "border-sky-300" : "border-slate-600")}>
            <DrawingSvg mode="cad" titleBlock={false} title={`Sheet ${s}`} className="block h-auto w-full" />
            <p className="absolute left-1 top-1 bg-[#0B1220]/90 px-1 font-mono text-[9px] text-slate-200">{s}</p>
            {t < 15 && si === i ? <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.9)]" /> : null}
          </li>
        ))}
      </ul>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">{CHECKS.map((c, k) => { const done = t >= 15 || k < ci; const run = !done && k === ci; return <li key={c} className={cn("border px-4 py-3 text-sm", done ? "border-green-600 bg-white text-slate-900" : run ? "border-blue-600 bg-white text-slate-900" : "border-slate-300 text-slate-400")}><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{c}</p><p className="mt-1">{done ? "Consistent across set ✓" : run ? `Sheet ${String(si + 1).padStart(2, "0")} ${"✓".repeat(0)}…` : "Pending"}</p></li>; })}</ul>
    </div>
  );
}

/* ───────── discipline selector ───────── */

const DISCS: [Disc, string][] = [["arch", "Architectural"], ["struct", "Structural"], ["mech", "Mechanical"], ["civil", "Civil"], ["elec", "Electrical"]];
const DNOTE: Record<Disc, string[]> = { arch: ["Floor plan", "Walls", "Doors", "Windows", "Dimensions"], struct: ["Columns", "Beams", "Steel framing", "Dimensions"], mech: ["Equipment", "Components", "Mechanical geometry"], civil: ["Site boundary", "Alignment", "Grading", "Drainage"], elec: ["Symbols", "Circuits", "Panel references"] };
export function DisciplineSelector() {
  const [d, setD] = useState<Disc>("arch");
  const [pdf, setPdf] = useState(false);
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <Win label={`${DRAW[d].name} · ${pdf ? "PDF" : "DWG"}`}><div key={d + pdf} data-in="true" className="fade-in"><DrawingSvg disc={d} mode={pdf ? "pdf" : "cad"} title={`${DRAW[d].name} as ${pdf ? "PDF" : "DWG"}`} className="block h-auto w-full" /></div></Win>
      <div className="space-y-4">
        <div role="tablist" aria-label="Discipline" className="flex gap-2 overflow-x-auto pb-1">{DISCS.map(([k, l]) => <button key={k} role="tab" type="button" aria-selected={d === k} onClick={() => setD(k)} className={cn(chip(d === k), "shrink-0")}>{l}</button>)}</div>
        <div role="group" aria-label="Format" className="flex gap-2"><button type="button" aria-pressed={pdf} onClick={() => setPdf(true)} className={chip(pdf)}>PDF</button><button type="button" aria-pressed={!pdf} onClick={() => setPdf(false)} className={chip(!pdf)}>DWG</button></div>
        <ul className="grid grid-cols-2 gap-1.5 text-sm text-slate-700">{DNOTE[d].map((x) => <li key={x} className="border border-slate-300 bg-white px-3 py-2">{x}</li>)}</ul>
        <p className="text-sm text-slate-600">Illustrates scope — not every conversion project spans every discipline.</p>
      </div>
    </div>
  );
}

/* ───────── process viewer ───────── */

const PV = ["File intake", "Scope & quote", "Conversion", "Quality check", "Delivery"];
export function ProcessViewer({ steps }: { steps: { title: string; description: string }[] }) {
  const [i, setI] = useState(2);
  const [ph, setPh] = useState(7);
  useEffect(() => {
    if (i !== 2 || reduced()) return;
    const t = setTimeout(() => setPh((v) => (v >= 7 ? 2 : v + 1)), ph >= 7 ? 2600 : 900);
    return () => clearTimeout(t);
  }, [i, ph]);
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1fr_1.4fr]">
      <ol className="space-y-1.5">{steps.map((s, k) => <li key={s.title}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("block w-full border p-4 text-left transition-colors", i === k ? "border-blue-600 bg-white" : "border-slate-300 hover:border-slate-900")}><span className="font-mono text-[10px] text-slate-500">{String(k + 1).padStart(2, "0")}</span><span className="block text-base font-semibold text-slate-900">{PV[k]}</span><span className={cn("mt-1 block text-sm text-slate-600 transition-[max-height,opacity] duration-500 lg:overflow-hidden", i === k ? "max-h-40 opacity-100" : "max-h-0 opacity-0 lg:max-h-0")}>{s.description}</span></button></li>)}</ol>
      <Win label={PV[i]}>
        <div key={i} data-in="true" className="fade-in">
          {i === 0 ? <div className="relative"><DrawingSvg mode="scan" title="A PDF sheet entering the workspace" className="block h-auto w-full" /><ul className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">{["Output format", "Layer standard", "Vector or scanned?"].map((x) => <li key={x} className="border border-slate-500 bg-white/95 px-2 py-1 font-mono text-[10px] uppercase text-slate-700">{x}</li>)}</ul></div> : null}
          {i === 1 ? <div className="grid gap-3 p-4 sm:grid-cols-[1fr_1fr]"><div className="relative h-44">{[0, 1, 2].map((k) => <div key={k} className="absolute w-3/4 border border-slate-400 bg-white shadow-sm" style={{ left: k * 22, top: k * 14, zIndex: k }}><DrawingSvg mode="pdf" titleBlock={false} title="Drawing in the set" className="block h-auto w-full" /></div>)}</div><ul className="space-y-1.5 text-sm">{["Drawing quantity", "Drawing complexity", "Source type: vector or scanned", "Turnaround requirements"].map((x) => <li key={x} className="border border-slate-300 bg-white px-3 py-2">{x}</li>)}</ul></div> : null}
          {i === 2 ? <div className="bg-[#0B1220]"><DrawingSvg mode="cad" phase={ph} title="PDF reconstructed as vector geometry, layers, text and dimensions" className="block h-auto w-full" /></div> : null}
          {i === 3 ? <div className="relative bg-[#0B1220]"><DrawingSvg mode="cad" title="Converted CAD" className="block h-auto w-full" /><div className="absolute inset-0 opacity-40 mix-blend-screen"><DrawingSvg mode="pdf" titleBlock={false} title="Source PDF overlay" className="block h-auto w-full invert" /></div></div> : null}
          {i === 4 ? <div className="p-6"><ul className="grid gap-2 sm:grid-cols-2">{["PROJECT.dwg", "SHEET-001.dwg", "SHEET-002.dwg", "SHEET-003.dwg"].map((f) => <li key={f} className="flex items-center gap-3 border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-800"><span className="grid h-6 w-5 place-items-center border border-blue-600 text-[7px] text-blue-700">DWG</span>{f}</li>)}</ul><p className="mt-4 text-sm font-semibold text-slate-900">Ready for your team to work with.</p></div> : null}
        </div>
      </Win>
    </div>
  );
}

/* ───────── quality check ───────── */

const REGIONS: Record<string, [number, number, number, number]> = { Geometry: [80, 110, 450, 230], Dimensions: [80, 66, 480, 40], Text: [150, 150, 300, 150], Layers: [20, 20, 600, 400] };
export function QualitySlider() {
  const [pos, setPos] = useState(50);
  const [hi, setHi] = useState<string | null>(null);
  const r = hi ? REGIONS[hi] : null;
  return (
    <div>
      <Win label="Source PDF ↔ converted DWG" meta="Checked against the supplied source before delivery">
        <div className="relative bg-[#0B1220]">
          <DrawingSvg mode="cad" title="Converted DWG" className="block h-auto w-full" />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><DrawingSvg mode="pdf" title="Source PDF" className="block h-auto w-full" /></div>
          <div className="pointer-events-none absolute inset-y-0 w-px bg-sky-400" style={{ left: `${pos}%` }} />
          {r ? <svg viewBox="0 0 640 440" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden><rect x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={Z.cyan} fillOpacity="0.12" stroke={Z.cyan} strokeWidth="2" strokeDasharray="6 4" /></svg> : null}
        </div>
      </Win>
      <label className="mt-3 flex items-center gap-3"><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">PDF</span><input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Compare the source PDF and converted DWG" className="h-8 flex-1 accent-sky-400" /><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">DWG</span></label>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Highlight what is checked">{Object.keys(REGIONS).map((k) => <li key={k}><button type="button" onPointerEnter={() => setHi(k)} onPointerLeave={() => setHi(null)} onFocus={() => setHi(k)} onBlur={() => setHi(null)} onClick={() => setHi(hi === k ? null : k)} className={chip(hi === k, true)}>{k}</button></li>)}</ul>
    </div>
  );
}

/* ───────── CTA ───────── */

export function CtaVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver((e) => {
      if (!e.some((x) => x.isIntersecting)) return;
      ob.disconnect();
      if (reduced()) { setS(7); return; }
      [2, 3, 4, 5, 6, 7].forEach((v, k) => setTimeout(() => setS(v), 700 + k * 800));
    }, { threshold: 0.3 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative overflow-hidden border border-sky-300/30 bg-[#0B1220]">
      <DrawingSvg mode="cad" phase={s} title="A PDF sheet becoming an editable DWG with layers, text and dimensions" className="block h-auto w-full" />
      <p className={cn("absolute bottom-2 left-2 border border-sky-300/60 bg-[#0B1220]/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-200 transition-opacity duration-500", s >= 7 ? "opacity-100" : "opacity-0")}>DWG · layers · text · dimensions</p>
    </div>
  );
}

export { css, useScrollStage };
