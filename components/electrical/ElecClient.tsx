"use client";

import { useState } from "react";
import type { Service } from "@/lib/types";
import { Sld } from "@/components/svg/Sld";
import { ElecSchematic } from "@/components/svg/ElecSchematic";
import { PanelLayout } from "@/components/svg/PanelLayout";
import { AsBuilt, STATES } from "@/components/svg/AsBuilt";
import { ElecBim } from "@/components/svg/ElecBim";
import { useScrollStage } from "@/components/structural/useScrollStage";
import { CIRCUITS, PANELS, REVISIONS, scheduleRows, type PanelId } from "./model";
import { cn } from "@/lib/utils";

const mono = { fontFamily: "var(--font-mono)" } as const;
const Kv = ({ k, v, accent }: { k: string; v: string; accent?: boolean }) => (
  <div className="bg-ink-900 px-4 py-3">
    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">{k}</dt>
    <dd className={cn("mt-1 font-mono text-sm", accent ? "text-emerald-400" : "text-white")}>{v}</dd>
  </div>
);

// ───────── Interactive single-line diagram ─────────

export function SldExplorer({ className }: { className?: string }) {
  const [circuit, setCircuit] = useState<string | null>(null);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [pinned, setPinned] = useState<{ c?: string; p?: PanelId } | null>(null);
  const aC = pinned?.c ?? circuit;
  const aP = pinned?.p ?? panel;
  const c = CIRCUITS.find((x) => x.id === aC);
  const downstream = aP ? CIRCUITS.filter((x) => x.panel === aP).map((x) => x.id).join(" · ") : null;
  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1.5fr_1fr]", className)}>
      <div className="border border-steel-300/25 bg-ink-950 p-2">
        <Sld
          animate
          flow
          activeCircuit={aC}
          activePanel={aP}
          onCircuit={(id, commit) => (commit ? setPinned((p) => (p?.c === id ? null : { c: id! })) : setCircuit(id))}
          onPanel={(id, commit) => (commit ? setPinned((p) => (p?.p === id ? null : { p: id! })) : setPanel(id))}
          className="h-auto w-full"
        />
      </div>
      <div className="space-y-3">
        <dl className="grid grid-cols-2 gap-px border border-steel-300/20 bg-steel-300/20" aria-live="polite">
          <Kv k={c ? "Circuit" : "Panel"} v={c ? c.id : aP ?? "—"} />
          <Kv k="Source" v={c ? c.panel : aP ? "MSB" : "—"} />
          <Kv k="Load" v={c ? c.load : downstream ?? "—"} />
          <Kv k="Status" v={aC || aP ? "Documented" : "Select"} accent={!!(aC || aP)} />
        </dl>
        <p className="border border-steel-300/20 bg-ink-900/60 p-4 text-sm leading-relaxed text-neutral-300">
          Hover to preview, click to pin. Choosing a panel highlights every downstream circuit; choosing a circuit traces its path back to the main supply. Illustrative values.
        </p>
        <div className="flex flex-wrap gap-2">
          {PANELS.map((p) => (
            <button key={p.id} type="button" onClick={() => setPinned((s) => (s?.p === p.id ? null : { p: p.id }))} aria-pressed={pinned?.p === p.id} className={cn("border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors", pinned?.p === p.id ? "border-emerald-400 bg-emerald-400/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}>{p.id}</button>
          ))}
          {pinned ? <button type="button" onClick={() => setPinned(null)} className="border border-steel-300/25 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400 hover:border-sky-300/60">Clear</button> : null}
        </div>
      </div>
    </div>
  );
}

// ───────── Schematic with a trace ─────────

const TRACE = [
  { label: "Control input", ids: ["S-02"] },
  { label: "Relay coil", ids: ["S-02", "w-ctrl", "K-01"] },
  { label: "Contact", ids: ["S-02", "w-ctrl", "K-01", "w-pwr", "Q-01", "X1"] },
  { label: "Motor", ids: ["S-02", "w-ctrl", "K-01", "w-pwr", "Q-01", "X1", "M-01"] },
];

export function SchematicTrace({ className }: { className?: string }) {
  const [step, setStep] = useState<number | null>(null);
  return (
    <div className={className}>
      <div className="border border-steel-300/25 bg-ink-950 p-2">
        <ElecSchematic traceSet={step === null ? undefined : TRACE[step].ids} className="h-auto w-full" />
      </div>
      <ol className="mt-4 flex flex-wrap items-center gap-2" aria-label="Trace the circuit">
        {TRACE.map((t, i) => (
          <li key={t.label} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden className="font-mono text-copper-400">→</span> : null}
            <button type="button" onClick={() => setStep((s) => (s === i ? null : i))} onMouseEnter={() => setStep(i)} aria-pressed={step === i} className={cn("border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors", step !== null && i <= step ? "border-emerald-400 bg-emerald-400/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}>{t.label}</button>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-neutral-500">Select a step to trace the path from control input to motor. Illustrative circuit.</p>
    </div>
  );
}

// ───────── Schematic ↔ physical panel ─────────

const REF_INFO: Record<string, { name: string; where: string }> = {
  "Q-01": { name: "Breaker", where: "Panel A" },
  "K-01": { name: "Contactor", where: "Panel A" },
  "K-02": { name: "Relay", where: "Panel A" },
  X1: { name: "Terminal strip", where: "Panel A" },
};

export function SchematicToPanel({ className }: { className?: string }) {
  const [ref, setRef] = useState<string | null>(null);
  const info = ref ? REF_INFO[ref] : undefined;
  return (
    <div className={className}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border border-steel-300/25 bg-ink-950 p-2">
          <p className="px-2 pt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">Electrical schematic</p>
          <ElecSchematic activeRef={ref} onRef={setRef} className="h-auto w-full" />
        </div>
        <div className="border border-steel-300/25 bg-ink-950 p-2">
          <p className="px-2 pt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">Physical panel layout</p>
          <PanelLayout activeRef={ref} onRef={setRef} className="h-auto w-full" />
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-px border border-steel-300/20 bg-steel-300/20 sm:grid-cols-4" aria-live="polite">
        <Kv k="Panel component" v={info ? `${ref} · ${info.name}` : "Hover a part"} />
        <Kv k="Schematic ref" v={ref ?? "—"} />
        <Kv k="Location" v={info?.where ?? "—"} />
        <Kv k="Values" v="Illustrative" />
      </dl>
    </div>
  );
}

// ───────── SLD ↔ schedule ─────────

export function SldSchedule({ className }: { className?: string }) {
  const [id, setId] = useState<string | null>(null);
  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1.1fr_1fr]", className)}>
      <div className="min-w-0 border border-steel-300/25 bg-ink-950 p-2">
        <Sld activeCircuit={id} onCircuit={(c) => setId(c)} flow className="h-auto w-full" />
      </div>
      <div className="min-w-0 border border-steel-300/20 bg-ink-900/70">
        <div className="flex items-center justify-between border-b border-steel-300/20 px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Cable schedule</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">Illustrative</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left font-mono text-xs">
            <thead className="text-neutral-500">
              <tr>{["Circuit", "From", "To", "Cable", "Conductor", "Reference"].map((h) => <th key={h} className="px-3 py-2 font-normal uppercase tracking-[0.08em]">{h}</th>)}</tr>
            </thead>
            <tbody>
              {scheduleRows.map((r) => (
                <tr key={r.circuit} tabIndex={0} onMouseEnter={() => setId(r.circuit)} onMouseLeave={() => setId(null)} onFocus={() => setId(r.circuit)} onBlur={() => setId(null)} className={cn("border-t border-steel-300/10 outline-none transition-colors", id === r.circuit ? "bg-emerald-400/10 text-white" : "text-neutral-300 hover:bg-white/5")}>
                  <td className="px-3 py-2.5 text-sky-300">{r.circuit}</td><td className="px-3 py-2.5">{r.from}</td><td className="px-3 py-2.5">{r.to}</td><td className="px-3 py-2.5">{r.cable}</td><td className="px-3 py-2.5">{r.conductor}</td><td className="px-3 py-2.5">{r.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ───────── As-built compare ─────────

export function AsBuiltCompare({ className }: { className?: string }) {
  const [v, setV] = useState(65);
  return (
    <div className={className}>
      <div className="border border-steel-300/25 bg-ink-950 p-2">
        <AsBuilt split={v / 100} className="h-auto w-full" />
      </div>
      <div className="mt-4 flex items-center gap-4">
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-300">As-built</span>
        <input type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} aria-label="Compare as-built with design" className="w-full accent-sky-400" />
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-300">Design</span>
      </div>
      <ul className="mt-4 flex flex-wrap gap-4">
        {Object.values(STATES).map((s) => (
          <li key={s.label} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-300">
            <span aria-hidden className="h-3 w-3 rounded-full border" style={{ borderColor: s.color, background: `${s.color}33` }} />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ───────── Reference trace (signature + commissioning) ─────────

function LabelPlate({ id }: { id: string }) {
  const c = CIRCUITS.find((x) => x.id === id) ?? CIRCUITS[0];
  return (
    <svg viewBox="0 0 320 150" fill="none" className="h-full w-full" role="img" aria-label={`Physical label for circuit ${c.id}`}>
      <rect x="20" y="30" width="280" height="90" rx="4" className="fill-ink-950" stroke="#22c55e" strokeWidth="1.6" />
      <circle cx="36" cy="46" r="3" fill="#64748b" /><circle cx="284" cy="46" r="3" fill="#64748b" /><circle cx="36" cy="104" r="3" fill="#64748b" /><circle cx="284" cy="104" r="3" fill="#64748b" />
      <text x="160" y="72" textAnchor="middle" fill="#f8fafc" fontSize="22" letterSpacing="2" style={mono}>{c.id}</text>
      <text x="160" y="96" textAnchor="middle" fill="#94a3b8" fontSize="10" letterSpacing="1.4" style={mono}>{c.panel} · {c.cable}</text>
    </svg>
  );
}

export function ReferenceTrace({ mode = "all", className }: { mode?: "all" | "commissioning"; className?: string }) {
  const [id, setId] = useState("C-04");
  const c = CIRCUITS.find((x) => x.id === id)!;
  const row = scheduleRows.find((r) => r.circuit === id)!;
  const pane = "border border-emerald-400/40 bg-ink-950 p-2";
  const head = (t: string) => <p className="px-2 pt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">{t}</p>;
  const schedule = (
    <div className={pane}>
      {head("Schedule")}
      <dl className="mt-2 grid grid-cols-2 gap-px bg-steel-300/20">
        {[["Circuit", row.circuit], ["From", row.from], ["To", row.to], ["Cable", row.cable], ["Conductor", row.conductor], ["Reference", row.reference]].map(([k, v]) => <Kv key={k} k={k} v={v} accent={k === "Circuit"} />)}
      </dl>
    </div>
  );
  return (
    <div className={className}>
      <div role="radiogroup" aria-label="Circuit reference" className="flex flex-wrap gap-2">
        {CIRCUITS.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={id === x.id} onClick={() => setId(x.id)} className={cn("border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors", id === x.id ? "border-emerald-400 bg-emerald-400/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}>{x.id}</button>
        ))}
      </div>
      {mode === "commissioning" ? (
        <div className="mt-4 grid items-stretch gap-3 md:grid-cols-[1.3fr_auto_1fr_auto_0.8fr]">
          <div className={pane}>{head("Schematic")}<ElecSchematic traceSet={["w-pwr", "Q-01", "K-01", "X1", "M-01"]} className="h-auto w-full" /></div>
          <span aria-hidden className="hidden self-center font-mono text-xl text-copper-400 md:block">↔</span>
          {schedule}
          <span aria-hidden className="hidden self-center font-mono text-xl text-copper-400 md:block">↔</span>
          <div className={pane}>{head("Physical label")}<LabelPlate id={id} /></div>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-6">
          <div className={cn(pane, "md:col-span-3")}>{head("Single-line")}<Sld activeCircuit={id} flow className="h-auto w-full" showLabels={false} /></div>
          <div className={cn(pane, "md:col-span-3")}>{head("Schematic")}<ElecSchematic traceSet={["w-pwr", "Q-01", "K-01", "X1", "M-01"]} className="h-auto w-full" /></div>
          <div className="md:col-span-2">{schedule}</div>
          <div className={cn(pane, "md:col-span-2")}>{head("Panel")}<PanelLayout activeRef="X1" className="h-auto w-full" /><p className="px-2 pb-1 font-mono text-[10px] text-emerald-400">{c.id} · {c.cable} → X1</p></div>
          <div className={cn(pane, "md:col-span-2")}>
            {head("As-built")}
            <div className="mt-2 space-y-2 p-2 font-mono text-[11px]">
              <p className="text-white">{c.id} · {c.load}</p>
              <p className="flex items-center gap-2 text-emerald-400"><span aria-hidden className="h-2.5 w-2.5 rounded-full bg-emerald-400" />Confirmed</p>
              <p className="text-neutral-500">Illustrative record</p>
            </div>
          </div>
        </div>
      )}
      <p className="mt-3 text-xs text-neutral-500">Select a circuit: the same reference appears in every document. Values are illustrative.</p>
    </div>
  );
}

// ───────── Revision viewer ─────────

export function ElecRevision({ className }: { className?: string }) {
  const [rev, setRev] = useState(1);
  return (
    <div className={cn("grid gap-4 lg:grid-cols-[240px_1fr]", className)}>
      <div role="tablist" aria-label="Drawing issues" className="grid auto-rows-min grid-cols-2 content-start gap-2 lg:grid-cols-1">
        {REVISIONS.map((r, i) => (
          <button key={r.code} type="button" role="tab" aria-selected={rev === i} onClick={() => setRev(i)} className={cn("border px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.14em] transition-colors", rev === i ? "border-copper-500 bg-copper-500/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}>{r.code}</button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="border border-steel-300/25 bg-ink-950 p-2"><Sld revision={rev} className="mx-auto h-auto w-full max-w-3xl" /></div>
        <div className="border border-steel-300/20 bg-ink-900/70">
          <table className="w-full text-left font-mono text-xs">
            <thead className="text-neutral-500"><tr>{["Rev", "Description", "Status"].map((h) => <th key={h} className="px-4 py-2 font-normal uppercase tracking-[0.1em]">{h}</th>)}</tr></thead>
            <tbody>
              {REVISIONS.map((r, i) => (
                <tr key={r.code} className={cn("border-t border-steel-300/10 transition-colors", rev === i ? "bg-copper-500/10 text-white" : "text-neutral-400")}>
                  <td className="px-4 py-2.5 text-sky-300">{r.code.replace("ISSUE ", "")}</td><td className="px-4 py-2.5 font-sans text-[13px]">{r.note}</td><td className="px-4 py-2.5">{i === rev ? "Viewing" : r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ───────── Document sheets: deliverables package + drawing viewer ─────────

function TableSheet({ cols, rows, title }: { cols: string[]; rows: string[][]; title: string }) {
  return (
    <svg viewBox="0 0 640 360" fill="none" className="h-full w-full" role="img" aria-label={title}>
      <rect x="20.5" y="30.5" width="599" height="290" stroke="#7dd3fc" strokeOpacity="0.5" />
      <path d={`M20 62H620${cols.map((_, i) => (i ? `M${20 + (599 / cols.length) * i} 30V320` : "")).join("")}`} stroke="#7dd3fc" strokeOpacity="0.3" />
      <g fill="#7dd3fc" fontSize="9.5" letterSpacing="1" style={mono}>
        {cols.map((c, i) => <text key={c} x={30 + (599 / cols.length) * i} y="51">{c}</text>)}
        {rows.map((r, j) => r.map((t, i) => <text key={`${j}-${i}`} x={30 + (599 / cols.length) * i} y={90 + j * 38} fill={i === 0 ? "#7dd3fc" : "#cbd5e1"}>{t}</text>))}
      </g>
      <text x="22" y="346" fill="#64748b" fontSize="9" letterSpacing="1.2" style={mono}>{title.toUpperCase()} · ILLUSTRATIVE</text>
    </svg>
  );
}

export function ElecSheet({ id }: { id: string }) {
  switch (id) {
    case "sld": return <Sld animate className="h-full w-full" />;
    case "schematic": return <ElecSchematic className="h-full w-full" />;
    case "switchboard": return <PanelLayout variant="switchboard" className="h-full w-full" />;
    case "panel": case "control": return <PanelLayout className="h-full w-full" />;
    case "cable": return <TableSheet title="Cable schedule" cols={["CIRCUIT", "FROM", "TO", "CABLE", "REF"]} rows={scheduleRows.slice(0, 6).map((r) => [r.circuit, r.from, r.to, r.cable, r.reference.split(" / ")[1]])} />;
    case "xref": return <TableSheet title="Conductor and cable sizing cross-reference" cols={["CIRCUIT", "LOAD", "CABLE", "CONDUCTOR", "CHECK"]} rows={CIRCUITS.map((c) => [c.id, c.load, c.cable, "AS SCHEDULED", "SCHEMATIC ✓"])} />;
    case "asbuilt": return <AsBuilt split={0.5} className="h-full w-full" />;
    case "bim": return <ElecBim run={false} className="h-full w-full" />;
    default: return <Sld revision={2} className="h-full w-full" />;
  }
}

const DELIV: { id: string; label: string; match: string }[] = [
  { id: "sld", label: "SLD", match: "^Single-line" },
  { id: "schematic", label: "Schematic", match: "^Electrical schematics" },
  { id: "switchboard", label: "Switchboard", match: "^Switchboard" },
  { id: "control", label: "Control panel", match: "^Control panel" },
  { id: "cable", label: "Cable schedule", match: "^Cable schedules" },
  { id: "asbuilt", label: "As-built", match: "^As-built" },
  { id: "bim", label: "BIM", match: "BIM coordination" },
  { id: "xref", label: "Cross-reference", match: "Conductor and cable" },
];

export function ElecDeliverables({ service, className }: { service: Service; className?: string }) {
  const [tab, setTab] = useState("sld");
  const cur = DELIV.find((t) => t.id === tab)!;
  const items = service.deliverables.filter((x) => new RegExp(cur.match, "i").test(x));
  return (
    <div className={className}>
      <div role="tablist" aria-label="Document package" className="flex flex-wrap gap-2">
        {DELIV.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={cn("border px-3.5 py-2.5 font-mono text-xs uppercase tracking-[0.12em] transition-colors", tab === t.id ? "border-copper-500 bg-copper-500/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}>{t.label}</button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div key={tab} data-in="true" className="relative aspect-[640/380] border border-steel-300/25 bg-ink-950 p-2"><ElecSheet id={tab} /></div>
        <div className="border border-steel-300/20 bg-ink-900/70 p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Included</p>
          <ul className="mt-4 space-y-3" aria-live="polite">
            {items.map((i) => <li key={i} className="flex gap-2.5 text-sm leading-snug text-neutral-200"><span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-copper-500" />{i}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

const VIEW_DOCS = [
  { id: "sld", label: "Single-line" },
  { id: "schematic", label: "Schematic" },
  { id: "panel", label: "Panel layout" },
  { id: "cable", label: "Cable schedule" },
  { id: "asbuilt", label: "As-built" },
  { id: "revision", label: "Revision" },
];

export function ElecViewer({ className }: { className?: string }) {
  const [doc, setDoc] = useState("sld");
  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1.6fr_1fr]", className)}>
      <div key={doc} data-in="true" className="relative aspect-[640/380] border border-steel-300/25 bg-ink-950 p-2">
        <ElecSheet id={doc} />
        <span className="absolute right-3 top-3 border border-steel-300/30 bg-ink-950/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-400">E-101 · REV B · FOR REVIEW</span>
      </div>
      <ol className="grid content-start gap-2" aria-label="Documents">
        {VIEW_DOCS.map((d, i) => (
          <li key={d.id}>
            <button type="button" onClick={() => setDoc(d.id)} aria-current={doc === d.id} className={cn("flex w-full items-center gap-4 border px-4 py-3 text-left transition-colors", doc === d.id ? "border-copper-500 bg-copper-500/10" : "border-steel-300/25 hover:border-sky-300/60")}>
              <span className="font-mono text-xs text-copper-400">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-sm font-semibold text-white">{d.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ───────── BIM layers ─────────

export function ElecBimLayers({ className }: { className?: string }) {
  const [l, setL] = useState({ structural: true, architectural: true, electrical: true });
  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Model layers">
        {(Object.keys(l) as (keyof typeof l)[]).map((k) => (
          <button key={k} type="button" aria-pressed={l[k]} onClick={() => setL((s) => ({ ...s, [k]: !s[k] }))} className={cn("border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors", l[k] ? "border-emerald-400 bg-emerald-400/10 text-white" : "border-steel-300/25 text-neutral-400 hover:border-sky-300/60")}>{k}</button>
        ))}
      </div>
      <div className="border border-steel-300/20 bg-ink-900/60 p-2"><ElecBim layers={l} className="mx-auto h-auto w-full max-w-3xl" /></div>
      <p className="mt-3 text-xs text-neutral-500">Conceptual route conflict and re-route; no clash statistics are implied.</p>
    </div>
  );
}

// ───────── Scroll: second life of drawings + system evolution ─────────

const LIFE = [
  { label: "Design", sheet: "DESIGN DOCUMENT" },
  { label: "Construction", sheet: "FOR CONSTRUCTION · MARKUPS" },
  { label: "Commissioning", sheet: "COMMISSIONING REFERENCE" },
  { label: "Operations", sheet: "MAINTENANCE REFERENCE" },
  { label: "Future upgrade", sheet: "UPGRADE REFERENCE" },
];

export function SecondLife({ className }: { className?: string }) {
  const { ref, stage } = useScrollStage(LIFE.length, false);
  const s = LIFE[stage];
  return (
    <div ref={ref} className={cn("grid items-start gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12", className)}>
      <ol className="relative space-y-1 border-l border-neutral-300 pl-6">
        {LIFE.map((l, i) => (
          <li key={l.label} className="relative">
            <span aria-hidden className={cn("absolute -left-[31px] top-6 h-[10px] w-[10px] border bg-white transition-colors duration-500", i <= stage ? "border-copper-500 bg-copper-500" : "border-neutral-400")} />
            <div className={cn("py-4 transition-opacity duration-500", i === stage ? "opacity-100" : "opacity-45")}>
              <p className="font-mono text-xs tracking-[0.16em] text-copper-600">{String(i + 1).padStart(2, "0")}</p>
              <p className="text-base font-semibold tracking-tight text-navy-900">{l.label}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500">{l.sheet}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="relative border border-navy-800 bg-ink-950 p-2 lg:sticky lg:top-28">
        <Sld activeCircuit={stage === 3 ? "C-02" : null} revision={stage === 1 ? 2 : stage >= 2 ? 3 : 0} flow={stage === 3} className="h-auto w-full" showLabels />
        <span className="pointer-events-none absolute left-4 top-4 border border-sky-300/40 bg-ink-950/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">{s.sheet}</span>
        {stage === 4 ? (
          <svg viewBox="0 0 640 420" className="pointer-events-none absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]" fill="none" aria-hidden>
            <path d="M606 212V322" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="6 4" /><circle cx="606" cy="336" r="13" stroke="#f59e0b" strokeDasharray="4 3" />
            <text x="540" y="372" fill="#f59e0b" fontSize="9" letterSpacing="1" style={mono}>NEW · FUTURE CIRCUIT</text>
          </svg>
        ) : null}
        {stage === 3 ? <span className="pointer-events-none absolute bottom-4 left-4 border border-emerald-400/50 bg-ink-950/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-400">Fault-finding · tracing C-02</span> : null}
      </div>
    </div>
  );
}

const EVOLVE = [
  { label: "Design input", view: "input" },
  { label: "Schematic", view: "schematic" },
  { label: "Single-line", view: "sld" },
  { label: "Panel layout", view: "panel" },
  { label: "Schedule", view: "cable" },
  { label: "Coordination", view: "bim" },
  { label: "As-built", view: "asbuilt" },
  { label: "Commissioning", view: "label" },
];

export function SystemEvolve({ className }: { className?: string }) {
  const { ref, stage } = useScrollStage(EVOLVE.length, false);
  const v = EVOLVE[stage].view;
  return (
    <div ref={ref} className={cn("grid items-start gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12", className)}>
      <ol className="relative space-y-1 border-l border-steel-300/20 pl-6">
        {EVOLVE.map((e, i) => (
          <li key={e.label} className="relative">
            <span aria-hidden className={cn("absolute -left-[31px] top-5 h-[10px] w-[10px] border bg-ink-950 transition-colors duration-500", i <= stage ? "border-copper-500 bg-copper-500" : "border-steel-300/40")} />
            <p className={cn("py-3 text-sm transition-opacity duration-500", i === stage ? "font-semibold text-white opacity-100" : "text-neutral-400 opacity-60")}><span className="mr-3 font-mono text-xs text-copper-400">{String(i + 1).padStart(2, "0")}</span>{e.label}</p>
          </li>
        ))}
      </ol>
      <div key={v} data-in="true" className="relative aspect-[640/380] border border-steel-300/25 bg-ink-950 p-2 lg:sticky lg:top-28">
        {v === "input" ? (
          <div className="grid h-full content-center gap-3 p-6" aria-live="polite">
            {["Existing drawings", "Equipment schedules", "Site information · known changes"].map((t) => <p key={t} className="border border-steel-300/25 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-sky-300">{t}</p>)}
          </div>
        ) : v === "label" ? (
          <div className="grid h-full grid-cols-2 gap-3 p-2"><Sld activeCircuit="C-04" showLabels={false} className="h-auto w-full self-center" /><div className="self-center"><LabelPlate id="C-04" /></div></div>
        ) : (
          <ElecSheet id={v} />
        )}
        <span className="pointer-events-none absolute left-4 top-4 border border-sky-300/40 bg-ink-950/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">{EVOLVE[stage].label}</span>
      </div>
    </div>
  );
}
