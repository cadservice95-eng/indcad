"use client";

import { useState } from "react";
import { SteelFrame } from "@/components/structural/SteelFrame";
import { members } from "@/components/structural/steel";
import { MemberExploded } from "@/components/svg/MemberExploded";
import { ShopDiagram } from "@/components/svg/StructDiagrams";
import { useScrollStage } from "@/components/structural/useScrollStage";
import { cn } from "@/lib/utils";

const mono = { fontFamily: "var(--font-mono)" } as const;

const idsOf = (pred: (id: string, kind: string) => boolean) => members.filter((m) => pred(m.id, m.kind)).map((m) => m.id);
const COLS = idsOf((_, k) => k === "col");
const L1 = idsOf((id, k) => k === "beam" && id.startsWith("B-1"));
const L2 = idsOf((id, k) => k === "beam" && id.startsWith("B-2"));
const BRACES = idsOf((_, k) => k === "brace");
const NODE_IDS = Array.from({ length: 12 }, (_, i) => `C-${String(i + 1).padStart(2, "0")}`);

// ───────── Design → piece: one element evolving through five stages ─────────

const STAGES = [
  { label: "Structural design", text: "The engineer's drawings, calculations or model define the structure." },
  { label: "Steel model", text: "The design becomes a coordinated 3D steel model." },
  { label: "Detailing", text: "Each member gets plates, bolts, stiffeners and welds." },
  { label: "Fabrication documentation", text: "Shop drawings, piece marks and schedules for the workshop." },
  { label: "Erection", text: "The piece goes up in sequence with its neighbours." },
];

function PieceStages({ stage }: { stage: number }) {
  const g = (n: number) => cn("transition-opacity duration-700", stage === n ? "opacity-100" : "opacity-0");
  return (
    <svg viewBox="0 0 560 340" fill="none" className="h-auto w-full text-sky-300" role="img" aria-label="One steel member shown as design line, 3D model, detailed member, shop drawing and erected piece" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 22V0h22M538 0h22M560 318v22h-22M22 340H0v-22" stroke="#38bdf8" strokeWidth="2" />
      {/* 0 design */}
      <g className={g(0)}>
        <path d="M60 170H500" stroke="currentColor" strokeWidth="1.6" strokeDasharray="8 5" />
        {[110, 190, 270, 350, 430].map((x) => <path key={x} d={`M${x} 120v40m-5 -8l5 8 5 -8`} stroke="#d68a51" strokeWidth="1.2" />)}
        <path d="M60 180v30M500 180v30" stroke="currentColor" />
        <text x="60" y="240" fill="currentColor" fontSize="10" letterSpacing="1.2" style={mono}>ENGINEER&apos;S DESIGN · LINE DIAGRAM</text>
      </g>
      {/* 1 model */}
      <g className={g(1)}>
        <path d="M80 190l40 -22h300l-40 22zM80 190v36h300v-36M380 190v36l40 -22v-36" stroke="currentColor" strokeWidth="1.6" className="fill-sky-400/10" />
        <path d="M80 190h300" stroke="currentColor" strokeOpacity="0.5" />
        <text x="80" y="262" fill="currentColor" fontSize="10" letterSpacing="1.2" style={mono}>3D STEEL MODEL</text>
      </g>
      {/* 2 detail */}
      <g className={g(2)}>
        <rect x="90" y="140" width="380" height="66" stroke="currentColor" strokeWidth="1.8" />
        <path d="M90 154h380M90 192h380" stroke="currentColor" strokeOpacity="0.6" />
        <rect x="82" y="132" width="8" height="82" className="fill-sky-400/25" stroke="currentColor" />
        <rect x="470" y="132" width="8" height="82" className="fill-sky-400/25" stroke="currentColor" />
        {[148, 173, 198].map((y) => <g key={y}><circle cx="104" cy={y} r="3.2" /><circle cx="456" cy={y} r="3.2" /></g>)}
        <path d="M230 154v38M234 154v38M330 154v38M334 154v38" stroke="currentColor" strokeWidth="1.1" />
        <path d="M86 128l-8 -8h16z" fill="#d68a51" fillOpacity="0.4" stroke="#d68a51" />
        <circle cx="280" cy="104" r="16" className="fill-ink-950" /><text x="280" y="108" textAnchor="middle" fill="currentColor" fontSize="9.5" style={mono}>B-104</text>
        <text x="90" y="262" fill="currentColor" fontSize="10" letterSpacing="1.2" style={mono}>DETAILED MEMBER</text>
      </g>
      {/* 3 documentation */}
      <g className={g(3)}>
        <rect x="40" y="30" width="480" height="280" stroke="currentColor" strokeOpacity="0.6" />
        <rect x="120" y="120" width="320" height="46" stroke="currentColor" strokeWidth="1.5" />
        <path d="M120 132h320M120 154h320" stroke="currentColor" strokeOpacity="0.5" />
        <path d="M40 270h480M360 270v40" stroke="currentColor" strokeOpacity="0.5" />
        <g stroke="#d68a51" strokeWidth="0.9"><path d="M120 196h320M120 190v12M440 190v12" /><text x="260" y="214" fill="#d68a51" stroke="none" fontSize="9.5" style={mono}>4 800</text></g>
        <g fill="currentColor" fontSize="9" letterSpacing="1" style={mono}><text x="50" y="288">SHOP DRAWING</text><text x="50" y="302" opacity="0.7">PIECE MARK B-104</text><text x="370" y="288">REV A</text><text x="370" y="302" opacity="0.7">FOR CONSTRUCTION</text></g>
      </g>
      {/* 4 erection */}
      <g className={g(4)}>
        <path d="M120 270V120M280 270V120M440 270V120M120 120H440M120 195H440" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
        <path d="M120 120H280" stroke="#d68a51" strokeWidth="4" />
        <path d="M200 60v50m-6 -8l6 8 6 -8" stroke="#d68a51" strokeWidth="1.2" />
        <text x="214" y="70" fill="#d68a51" fontSize="9.5" letterSpacing="1" style={mono}>ERECTION STEP 03 · B-104</text>
        <text x="120" y="300" fill="currentColor" fontSize="10" letterSpacing="1.2" style={mono}>ERECTED IN SEQUENCE</text>
      </g>
    </svg>
  );
}

export function DesignToPiece() {
  const { ref, stage } = useScrollStage(STAGES.length, false);
  return (
    <div ref={ref} className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <ol className="relative space-y-1 border-l border-neutral-300 pl-6">
        {STAGES.map((s, i) => (
          <li key={s.label} className="relative">
            <span aria-hidden className={cn("absolute -left-[31px] top-6 h-[10px] w-[10px] border bg-white transition-colors duration-500", i <= stage ? "border-copper-500 bg-copper-500" : "border-neutral-400")} />
            <div className={cn("py-4 transition-opacity duration-500", i === stage ? "opacity-100" : "opacity-45")}>
              <p className="font-mono text-xs tracking-[0.16em] text-copper-600">{String(i + 1).padStart(2, "0")}</p>
              <p className="text-base font-semibold tracking-tight text-navy-900">{s.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="border border-navy-800 bg-ink-950 p-2 lg:sticky lg:top-28">
        <PieceStages stage={stage} />
      </div>
    </div>
  );
}

// ───────── Why detailing matters: conceptual chain ─────────

const BAD = ["Missed connection detail", "Drawing issue", "Fabrication issue", "Rework", "Erection delay"];
const GOOD = ["Clear detailing", "Fabrication", "Delivery", "Erection"];

export function ErrorPropagation({ className }: { className?: string }) {
  const [mode, setMode] = useState<"bad" | "good">("bad");
  const chain = mode === "bad" ? BAD : GOOD;
  return (
    <div className={className}>
      <div role="tablist" aria-label="Scenario" className="flex gap-2">
        {([["bad", "Missed detail"], ["good", "Clear detailing"]] as const).map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={mode === k} onClick={() => setMode(k)} className={cn("border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors", mode === k ? (k === "bad" ? "border-copper-500 bg-copper-500/10 text-white" : "border-emerald-400 bg-emerald-400/10 text-white") : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}>{l}</button>
        ))}
      </div>
      <ol key={mode} data-in="true" className="mt-5 flex flex-col gap-3 md:flex-row md:items-stretch">
        {chain.map((c, i) => (
          <li key={c} className="reveal flex flex-1 items-center gap-3 md:flex-col md:items-stretch" style={{ "--d": `${i * 380}ms` } as React.CSSProperties}>
            <div className={cn("flex-1 border p-4", mode === "bad" ? (i === 0 ? "border-copper-500/70 bg-copper-500/10" : "border-steel-300/20 bg-ink-900/70") : i === 0 ? "border-emerald-400/60 bg-emerald-400/10" : "border-steel-300/20 bg-ink-900/70")}>
              <p className="font-mono text-[10px] tracking-[0.16em] text-neutral-500">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-sm font-semibold text-white">{c}</p>
            </div>
            {i < chain.length - 1 ? <span aria-hidden className="shrink-0 text-center font-mono text-copper-400 md:hidden">↓</span> : null}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-neutral-500">Conceptual sequence, not a measured outcome.</p>
    </div>
  );
}

// ───────── Member by member ─────────

export function MemberDetailing({ className }: { className?: string }) {
  const [sel, setSel] = useState<string>("B-104");
  const m = members.find((x) => x.id === sel) ?? members[0];
  const num = sel.replace(/\D/g, "");
  const kindLabel = m.kind === "col" ? "COLUMN" : m.kind === "beam" ? "BEAM" : "BRACE";
  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1.2fr_1fr]", className)}>
      <div className="border border-steel-300/25 bg-ink-950 p-2">
        <SteelFrame interactive detail={1} selectedId={sel} onPick={setSel} className="h-auto w-full" viewBox="40 60 600 440" />
        <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">Click a column, beam or brace</p>
      </div>
      <div className="space-y-4">
        <dl className="grid grid-cols-2 gap-px border border-steel-300/20 bg-steel-300/20">
          {[["Piece mark", sel], ["Member", kindLabel], ["Drawing", `S-${num}`], ["Status", "For construction"]].map(([k, v]) => (
            <div key={k} className="bg-ink-900 px-4 py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">{k}</dt>
              <dd className={cn("mt-1 font-mono text-sm", k === "Status" ? "text-copper-400" : "text-white")}>{v}</dd>
            </div>
          ))}
        </dl>
        <div key={sel} data-in="true" className="border border-steel-300/20 bg-ink-950 p-3">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">Exploded · illustrative</p>
          <MemberExploded kind={m.kind} className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}

// ───────── Piece marking ─────────

const MARKS = ["B-101", "B-102", "B-103", "C-01", "C-02", "BR-01"];

export function PieceMarking({ className }: { className?: string }) {
  const [hov, setHov] = useState<string | null>(null);
  const shown = hov ?? "B-102";
  const num = shown.replace(/\D/g, "");
  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="border border-steel-300/25 bg-ink-950 p-2">
          <SteelFrame interactive detail={0} marks={MARKS} onHover={setHov} className="h-auto w-full" viewBox="40 60 600 440" />
        </div>
        <div className="space-y-4">
          <dl className="grid grid-cols-3 gap-px border border-steel-300/20 bg-steel-300/20">
            {[["Piece mark", shown], ["Drawing", `S-${num}`], ["Fabrication", "Ready"]].map(([k, v]) => (
              <div key={k} className="bg-ink-900 px-3 py-3"><dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500">{k}</dt><dd className="mt-1 font-mono text-sm text-white">{v}</dd></div>
            ))}
          </dl>
          <div className="aspect-[320/220] border border-steel-300/20 bg-ink-950 p-2" aria-hidden><div data-in="true" className="h-full w-full" key={shown}><ShopDiagram /></div></div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[["Job A", "A", "text-sky-300 border-sky-300/40"], ["Job B", "B", "text-copper-400 border-copper-500/40"]].map(([job, p, cls]) => (
          <div key={job} className={cn("border bg-ink-900/60 p-4", cls.split(" ").slice(1).join(" "))}>
            <p className={cn("font-mono text-[11px] uppercase tracking-[0.16em]", cls.split(" ")[0])}>{job} · separate numbering</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {["001", "002", "003", "004"].map((n) => <li key={n} className={cn("border px-3 py-1.5 font-mono text-xs", cls)}>{p}-{n}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-xs text-neutral-500">Distinct mark schemes keep concurrent jobs on one shop floor from being mixed up. Marks shown are illustrative.</p>
    </div>
  );
}

// ───────── Erection sequence ─────────

const ERECT = [
  { label: "Columns", ids: COLS },
  { label: "Primary beams", ids: L1 },
  { label: "Secondary steel", ids: L2 },
  { label: "Bracing", ids: BRACES },
  { label: "Connections", ids: [...NODE_IDS] },
];

export function ErectionSequence({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  const built = ERECT.slice(0, step + 1).flatMap((e, i) => (i === 4 ? [] : e.ids));
  const visible = step === 4 ? members.map((m) => m.id) : built;
  return (
    <div className={className}>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="border border-steel-300/25 bg-ink-950 p-2">
          <SteelFrame visibleIds={visible} highlightIds={ERECT[step].ids} erectionOverlay detail={step >= 4 ? 1 : 0} className="h-auto w-full" viewBox="-20 40 700 470" />
        </div>
        <div className="space-y-3">
          <ol className="grid gap-2" aria-label="Erection stages">
            {ERECT.map((e, i) => (
              <li key={e.label}>
                <button type="button" onClick={() => setStep(i)} aria-current={step === i} className={cn("flex w-full items-center gap-4 border px-4 py-3 text-left transition-colors", step === i ? "border-copper-500 bg-copper-500/10 text-white" : "border-steel-300/25 text-neutral-300 hover:border-sky-300/60")}>
                  <span className="font-mono text-xs text-copper-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-medium">{e.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <ul className="grid grid-cols-2 gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-400">
            {["Erection zone", "Crane window", "Member delivery", "Assembly sequence"].map((t) => <li key={t} className="border border-steel-300/20 px-3 py-2">{t}</li>)}
          </ul>
          <p className="text-xs text-neutral-500">The zone and crane window are conceptual markers, not crane engineering.</p>
        </div>
      </div>
    </div>
  );
}

// ───────── Fabrication package viewer ─────────

const DOCS = [
  { label: "Shop drawing", line: "Individual member detail", ids: ["B-101", "B-102", "B-103"] },
  { label: "Connection detail", line: "Plates, bolts and welds", ids: ["C-07", "C-08", "C-09", "C-10"] },
  { label: "Bolt list", line: "Bolt sizes and counts", ids: [...NODE_IDS] },
  { label: "Piece mark schedule", line: "Every member identified", ids: members.map((m) => m.id) },
  { label: "Erection drawing", line: "Sequence and references", ids: [...COLS, ...BRACES] },
  { label: "Take-off", line: "Quantities from the model", ids: [...L1, ...L2] },
];

export function PackageViewer({ className }: { className?: string }) {
  const [i, setI] = useState(0);
  return (
    <div className={cn("grid gap-4 lg:grid-cols-[1.2fr_1fr]", className)}>
      <div className="border border-steel-300/25 bg-ink-950 p-2">
        <SteelFrame highlightIds={DOCS[i].ids} marks={i === 3 ? members.map((m) => m.id) : undefined} detail={1} className="h-auto w-full" viewBox="40 60 600 440" />
      </div>
      <ol className="grid gap-2" aria-label="Document package">
        {DOCS.map((d, idx) => (
          <li key={d.label}>
            <button type="button" onClick={() => setI(idx)} onMouseEnter={() => setI(idx)} aria-current={i === idx} className={cn("flex w-full items-center gap-4 border px-4 py-3 text-left transition-colors", i === idx ? "border-copper-500 bg-copper-500/10" : "border-steel-300/25 hover:border-sky-300/60")}>
              <span className={cn("font-mono text-xs", i === idx ? "text-copper-400" : "text-neutral-500")}>{String(idx + 1).padStart(2, "0")}</span>
              <span><span className="block text-sm font-semibold text-white">{d.label}</span><span className="block text-xs text-neutral-400">{d.line}</span></span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
