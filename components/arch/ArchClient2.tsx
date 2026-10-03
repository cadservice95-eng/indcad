"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollStage } from "@/components/structural/useScrollStage";
import {
  PlanSvg, ElevSvg, SectionSvg, MassSvg, SiteSvg, RcpSvg, JoinerySvg, TitleBlock, SETBACKS, sx,
  INK, LINE, SOFT, BLUE, SAND, FAINT, PAPER, Bubble, HDim, type PlanLayers, type SetbackId,
} from "./Drawing";
import { ROOMS, DOORS, ceilingFixtures, mono, B } from "./model";
import { Sheet, chip, META } from "./ui";
import { useRise } from "./ArchClient";

const css = (o: Record<string, string | number>) => o as React.CSSProperties;

/* ───────── your practice standard, applied consistently ───────── */

const LAYER_DEFS: { id: string; name: string; weight: string; key: keyof PlanLayers }[] = [
  { id: "A-WALL", name: "Walls", weight: "0.50 mm", key: "walls" },
  { id: "A-DOOR", name: "Doors & windows", weight: "0.25 mm", key: "openings" },
  { id: "A-FURN", name: "Furniture", weight: "0.13 mm", key: "furniture" },
  { id: "A-ANNO", name: "Room labels & tags", weight: "0.18 mm", key: "labels" },
  { id: "A-DIMS", name: "Dimensions", weight: "0.13 mm", key: "dims" },
];

export function PracticeStandard() {
  const [on, setOn] = useState<Record<string, boolean>>({ walls: true, openings: true, furniture: true, labels: true, dims: true });
  const [applied, setApplied] = useState(true);
  const layers: PlanLayers = { ...on, tags: on.openings, grid: true, marks: false };
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_auto_1.2fr] lg:items-stretch">
      <div className="border border-slate-300 bg-white p-4 sm:p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Client / practice standard</p>
        <TitleBlock className="mt-3 h-auto w-full" />
        <ul className="mt-4 divide-y divide-slate-200 border border-slate-200">
          {LAYER_DEFS.map((l) => (
            <li key={l.id}>
              <button type="button" role="switch" aria-checked={on[l.key as string]} onClick={() => setOn((s) => ({ ...s, [l.key as string]: !s[l.key as string] }))}
                className="flex min-h-[44px] w-full items-center gap-3 px-3 py-2 text-left text-xs transition-colors hover:bg-slate-50">
                <span aria-hidden className={cn("h-3 w-3 border", on[l.key as string] ? "border-blue-600 bg-blue-600" : "border-slate-400")} />
                <span className="font-mono font-semibold text-slate-900">{l.id}</span>
                <span className="flex-1 text-slate-600">{l.name}</span>
                <span className="hidden items-center gap-2 font-mono text-[10px] text-slate-500 sm:flex"><span style={{ height: Math.max(1, parseFloat(l.weight) * 6), width: 28 }} className="bg-slate-900" aria-hidden />{l.weight}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">Drawing numbering, annotation style and line weights follow the supplied template. Layer names and weights above are illustrative.</p>
      </div>

      <div className="flex items-center justify-center lg:flex-col">
        <button type="button" onClick={() => setApplied((a) => !a)} className={cn(chip(applied), "whitespace-nowrap")} aria-pressed={applied}>{applied ? "Template applied" : "Apply template"}</button>
        <svg aria-hidden width="60" height="24" viewBox="0 0 60 24" className="mx-3 lg:mx-0 lg:my-3 lg:rotate-90"><path d="M2 12H54m-8 -6l8 6-8 6" fill="none" stroke={BLUE} strokeWidth="1.6" className="rch-flow" /></svg>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Documentation set · same standard on every sheet</p>
        <div className={cn("mt-3 grid gap-3 transition-opacity duration-500 sm:grid-cols-2", applied ? "opacity-100" : "opacity-30")}>
          <Sheet className="sm:col-span-2" label="A-101 · Floor plan"><PlanSvg layers={layers} title="Floor plan drafted to the practice layer standard" className="h-auto w-full" /></Sheet>
          <Sheet label="A-201 · Elevation"><ElevSvg title="Elevation drafted to the same standard" className="h-auto w-full" /></Sheet>
          <Sheet label="A-301 · Section"><SectionSvg title="Section drafted to the same standard" className="h-auto w-full" /></Sheet>
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-copper-600">Your standard. Applied consistently.</p>
      </div>
    </div>
  );
}

/* ───────── renovation: existing → proposed, with verification flags ───────── */

const RV = "0 0 720 420";
function RenoBase({ show }: { show: "existing" | "proposed" }) {
  const w = (d: string, sw = 3.6, st: string = INK, dash?: string) => <path d={d} stroke={st} strokeWidth={sw} strokeDasharray={dash} fill="none" strokeLinecap="round" />;
  const prop = show === "proposed";
  return (
    <g>
      <rect width="720" height="420" fill={PAPER} />
      {/* existing shell */}
      {w(`M${B.x0} ${B.y0}H560V340H${B.x0}Z`, 6.5)}
      {w("M300 60V340M80 230H300M300 200H560M380 200V340M450 200V340")}
      {/* living ↔ kitchen partition: demolished in proposed */}
      {!prop ? null : <rect x="296" y="76" width="9" height="118" fill={PAPER} />}
      {prop ? w("M300 76V194", 1.4, SAND, "5 4") : null}
      {!prop ? <><rect x="294" y="140" width="12" height="30" fill={PAPER} />{w("M300 140V170", 0, INK)}</> : null}
      {/* extension (proposed only) */}
      {prop ? <>
        <rect x="554" y="64" width="14" height="132" fill={PAPER} />
        {w("M560 60H650V200H560", 6.5, BLUE)}
        <rect x="562" y="62" width="86" height="136" fill={BLUE} fillOpacity="0.07" />
        <text x="605" y="136" textAnchor="middle" fontSize="9" fontWeight="600" fill={BLUE}>KITCHEN</text><text x="605" y="148" textAnchor="middle" fontSize="7.5" fill={BLUE} style={mono}>EXTENDED</text>
        {w("M560 95V165", 1.2, BLUE, "4 3")}
      </> : <>
        {w("M560 95V165", 0, INK)}<path d="M560 95V165" stroke={SOFT} strokeWidth="1" strokeDasharray="3 3" />
      </>}
      {/* existing door to be closed / new opening */}
      {!prop ? <path d="M300 205H320" stroke={SOFT} strokeWidth="0" /> : null}
      <g fill={INK} textAnchor="middle" fontSize="10" fontWeight="600" letterSpacing="0.6">
        <text x="190" y="150">LIVING</text><text x="430" y="150">KITCHEN</text><text x="190" y="290">BEDROOM 1</text><text x="505" y="275">STUDY</text><text x="415" y="275" fontSize="8">BATH</text><text x="340" y="320" fontSize="8">HALL</text>
      </g>
    </g>
  );
}

export function Renovation() {
  const [pos, setPos] = useState(50);
  const [verify, setVerify] = useState(true);
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <Sheet label={`Existing ← ${pos}% → Proposed`}>
          <div className="relative">
            <svg viewBox={RV} className="block h-auto w-full" role="img" aria-label="Existing and proposed plan overlaid. Drag the slider to compare." fill="none">
              <title>Existing floor plan on the left of the slider and the proposed plan on the right</title>
              <RenoBase show="existing" />
              <defs><clipPath id="reno-clip"><rect x={(pos / 100) * 720} y="0" width={720 - (pos / 100) * 720} height="420" /></clipPath></defs>
              <g clipPath="url(#reno-clip)"><RenoBase show="proposed" /></g>
              {/* demolition marks (existing side) */}
              <g stroke="#B45309" strokeWidth="1.4" fill="none"><path d="M296 76L304 84M304 76L296 84M296 120L304 128M304 120L296 128M296 164L304 172M304 164L296 172" /><path d="M300 76V194" strokeDasharray="4 3" strokeWidth="1" /></g>
              <text x="316" y="72" fontSize="8" fill="#B45309" style={mono}>DEMOLISH</text>
              <text x="574" y="52" fontSize="8" fill={BLUE} style={mono}>NEW WALL</text>
              <text x="574" y="90" fontSize="8" fill={BLUE} style={mono}>NEW OPENING</text>
              {verify ? (
                <g>
                  <rect x="80" y="230" width="220" height="110" fill="#F59E0B" fillOpacity="0.1" stroke="#B45309" strokeWidth="1" strokeDasharray="4 3" />
                  <rect x="86" y="236" width="140" height="16" fill={PAPER} stroke="#B45309" strokeWidth="0.8" /><text x="94" y="248" fontSize="8" fontWeight="700" fill="#B45309" style={mono}>REQUIRES VERIFICATION</text>
                  <rect x="306" y="206" width="70" height="16" fill={PAPER} stroke="#15803D" strokeWidth="0.8" /><text x="312" y="218" fontSize="8" fontWeight="700" fill="#15803D" style={mono}>CONFIRMED</text>
                  <rect x="86" y="68" width="140" height="16" fill={PAPER} stroke="#15803D" strokeWidth="0.8" /><text x="94" y="80" fontSize="8" fontWeight="700" fill="#15803D" style={mono}>CONFIRMED</text>
                </g>
              ) : null}
              <path d={`M${(pos / 100) * 720} 0V420`} stroke={BLUE} strokeWidth="1.4" />
            </svg>
          </div>
          <label className="mt-2 flex items-center gap-3 px-1 text-xs text-slate-600">
            <span className="font-mono uppercase tracking-[0.12em]">Existing</span>
            <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Compare existing and proposed plans" className="h-8 flex-1 accent-blue-600" />
            <span className="font-mono uppercase tracking-[0.12em]">Proposed</span>
          </label>
        </Sheet>
      </div>
      <div className="space-y-4">
        <button type="button" role="switch" aria-checked={verify} onClick={() => setVerify((v) => !v)} className={cn(chip(verify), "w-full text-left")}>Survey status flags · {verify ? "on" : "off"}</button>
        <ul className="space-y-3 border border-slate-300 bg-white p-4 text-sm text-slate-700">
          <li className="flex gap-3"><span aria-hidden className="mt-1 h-3 w-3 shrink-0 border border-green-700 bg-green-100" /><span><strong className="text-slate-900">Confirmed.</strong> Measured or surveyed information that can be drawn as existing.</span></li>
          <li className="flex gap-3"><span aria-hidden className="mt-1 h-3 w-3 shrink-0 border border-amber-700 bg-amber-100" /><span><strong className="text-slate-900">Requires verification.</strong> Gaps are flagged on the drawing, not quietly filled with assumptions.</span></li>
          <li className="flex gap-3"><span aria-hidden className="mt-1 h-[3px] w-3 shrink-0 translate-y-1.5 bg-[#B45309]" /><span><strong className="text-slate-900">Demolition.</strong> Existing wall marked for removal before the new work is shown.</span></li>
          <li className="flex gap-3"><span aria-hidden className="mt-1 h-[3px] w-3 shrink-0 translate-y-1.5 bg-blue-600" /><span><strong className="text-slate-900">New work.</strong> Proposed wall, opening and extended room.</span></li>
        </ul>
      </div>
    </div>
  );
}

/* ───────── retail fit-out ───────── */

function RetailPlan({ layers, joinery, onJoinery }: { layers: Record<string, boolean>; joinery: boolean; onJoinery: () => void }) {
  return (
    <svg viewBox="0 0 640 380" className="h-auto w-full" role="img" aria-label="Retail fit-out plan with counter, display units, partitions, ceiling and lighting reference zones" fill="none" strokeLinecap="round">
      <title>Retail fit-out plan</title>
      <path d="M60 50H580V330H60Z" stroke={INK} strokeWidth="6.5" />
      <rect x="236" y="322" width="168" height="16" fill={PAPER} /><path d="M236 330H404" stroke={BLUE} strokeWidth="1.4" strokeDasharray="2 3" />
      <text x="320" y="360" textAnchor="middle" fontSize="8" fill={LINE} style={mono}>SHOPFRONT · FIXED OPENING</text>
      <rect x="60" y="50" width="26" height="26" fill="#E2E8F0" stroke={LINE} /><rect x="554" y="50" width="26" height="26" fill="#E2E8F0" stroke={LINE} />
      <text x="73" y="67" textAnchor="middle" fontSize="7" fill={LINE} style={mono}>COL</text><text x="567" y="67" textAnchor="middle" fontSize="7" fill={LINE} style={mono}>COL</text>
      {layers.partitions ? <g stroke={INK} strokeWidth="3.4"><path d="M440 50V150H580" /><path d="M440 100H580" strokeWidth="1.4" /><path d="M500 100V150" strokeWidth="1.4" /></g> : null}
      {layers.partitions ? <g fontSize="8" fill={LINE} textAnchor="middle" style={mono}><text x="470" y="128">FIT 1</text><text x="540" y="128">FIT 2</text><text x="510" y="82">STORE</text></g> : null}
      {layers.joinery ? (
        <g>
          {[[110, 110, 90, 22], [110, 170, 90, 22], [110, 230, 90, 22]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#F1F5F9" stroke={LINE} strokeWidth="1.2" />)}
          {[[250, 160], [330, 160], [250, 220], [330, 220]].map(([x, y], i) => <rect key={i} x={x} y={y} width={60} height={34} fill="#FFFFFF" stroke={LINE} strokeWidth="1.2" />)}
          <g role="button" tabIndex={0} aria-label="Counter J-01: open joinery detail" style={{ cursor: "pointer", outline: "none" }} onClick={onJoinery} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onJoinery(); } }}>
            <rect x="440" y="250" width="110" height="38" fill={joinery ? "#DBEAFE" : "#F8FAFC"} stroke={BLUE} strokeWidth={joinery ? 2.4 : 1.6} />
            <path d="M440 250L550 288M550 250L440 288" stroke={BLUE} strokeWidth="0.7" strokeOpacity="0.6" />
            <text x="495" y="243" textAnchor="middle" fontSize="9" fontWeight="700" fill={BLUE} style={mono}>J-01 COUNTER</text>
          </g>
          <text x="155" y="104" textAnchor="middle" fontSize="7.5" fill={LINE} style={mono}>WALL DISPLAY</text><text x="320" y="152" textAnchor="middle" fontSize="7.5" fill={LINE} style={mono}>DISPLAY UNITS</text>
        </g>
      ) : null}
      {layers.ceiling ? (
        <g>
          <rect x="226" y="120" width="170" height="150" stroke={SAND} strokeWidth="1.2" strokeDasharray="6 3" fill={SAND} fillOpacity="0.08" />
          <text x="311" y="112" textAnchor="middle" fontSize="8" fill="#9A7B43" style={mono}>LIGHTING ZONE LZ-1</text>
          {[[256, 140], [316, 140], [376, 140], [256, 250], [316, 250], [376, 250]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="5" stroke={SAND} strokeWidth="1" fill={PAPER} /><path d={`M${x - 3} ${y}H${x + 3}M${x} ${y - 3}V${y + 3}`} stroke={SAND} strokeWidth="0.7" /></g>)}
          <rect x="430" y="236" width="130" height="66" stroke={SAND} strokeWidth="1.2" strokeDasharray="6 3" fill="none" /><text x="495" y="316" textAnchor="middle" fontSize="8" fill="#9A7B43" style={mono}>LZ-2 · COUNTER</text>
        </g>
      ) : null}
      <g fontSize="8" fill={LINE} style={mono}><HDim x1={60} x2={580} y={28} label="BASE BUILDING · LANDLORD CONSTRAINTS FIXED" up /></g>
    </svg>
  );
}

export function RetailJoinery() {
  const [layers, setLayers] = useState<Record<string, boolean>>({ joinery: true, partitions: true, ceiling: false });
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const names = ["Plan", "Elevation", "Detail"];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="mb-2 flex flex-wrap gap-2">
          {[["joinery", "Joinery & display"], ["partitions", "Partitions"], ["ceiling", "Ceiling · lighting zones"]].map(([k, l]) => (
            <button key={k} type="button" aria-pressed={layers[k]} onClick={() => setLayers((s) => ({ ...s, [k]: !s[k] }))} className={chip(layers[k])}>{l}</button>
          ))}
        </div>
        <Sheet label="Retail fit-out · select counter J-01 for its detail"><RetailPlan layers={layers} joinery={true} onJoinery={() => setStage(1)} /></Sheet>
      </div>
      <div>
        <div role="tablist" aria-label="Joinery drawing stage" className="mb-2 flex flex-wrap gap-2">
          {names.map((n, i) => <button key={n} role="tab" type="button" aria-selected={stage === i} onClick={() => setStage(i as 0 | 1 | 2)} className={chip(stage === i)}>{n}</button>)}
        </div>
        <Sheet label={`J-01 · ${names[stage]} · illustrative`}>
          <div key={stage} data-in="true"><JoinerySvg stage={stage} title={`Counter unit J-01 drawn as ${names[stage].toLowerCase()}`} className="h-auto w-full" /></div>
        </Sheet>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">Material and hardware references (M1, H1) are placeholders for the designer&apos;s own specification — no material is specified here.</p>
      </div>
    </div>
  );
}

/* ───────── builder vs authority ───────── */

export function BuilderAuthority() {
  const [m, setM] = useState<"builder" | "authority" | "both">("both");
  const showB = m !== "authority", showA = m !== "builder";
  return (
    <div>
      <div role="group" aria-label="Documentation audience" className="mb-4 flex flex-wrap gap-2">
        {([["builder", "Builder"], ["authority", "Authority"], ["both", "Coordinated set"]] as const).map(([k, l]) => <button key={k} type="button" aria-pressed={m === k} onClick={() => setM(k)} className={chip(m === k)}>{l}</button>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className={cn("space-y-3 border border-slate-300 bg-white p-3 transition-opacity duration-500 sm:p-4", showB ? "opacity-100" : "opacity-25")}>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-700">Builder · construction use</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Sheet label="Section"><SectionSvg title="Section for construction use" className="h-auto w-full" /></Sheet>
            <Sheet label="Detail A"><JoinerySvg stage={3} title="Large-scale construction detail" className="h-auto w-full" /></Sheet>
          </div>
          <p className="text-xs text-slate-600">Large-scale details, dimensions, material references and sections that answer the questions a builder will ask.</p>
        </div>
        <div className={cn("space-y-3 border border-slate-300 bg-white p-3 transition-opacity duration-500 sm:p-4", showA ? "opacity-100" : "opacity-25")}>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-700">Authority · approval submission</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Sheet label="Site plan"><SiteSvg title="Site plan for submission" className="h-auto w-full" /></Sheet>
            <Sheet label="Notes & plan"><PlanSvg layers={{ furniture: false, tags: false, marks: false }} title="Plan with submission notes" className="h-auto w-full" /></Sheet>
          </div>
          <p className="text-xs text-slate-600">Site plan, setbacks, notes and the submission drawing set, in the format the authority supplies.</p>
        </div>
      </div>
      <div className={cn("mt-4 border border-blue-600 bg-blue-50 px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-blue-700 transition-opacity duration-500", m === "both" ? "opacity-100" : "opacity-0")} aria-hidden={m !== "both"}>
        Coordinated documentation set · one design, two audiences
      </div>
    </div>
  );
}

/* ───────── submission package ───────── */

const PKG = [
  { id: "site", t: "Site plan" }, { id: "plan", t: "Floor plan" }, { id: "elev", t: "Elevation" },
  { id: "sect", t: "Section" }, { id: "set", t: "Setback plan" }, { id: "sched", t: "Schedules" },
];
const POS = [[3, 4], [36, 4], [69, 4], [3, 52], [36, 52], [69, 52]];

function Thumb({ id }: { id: string }) {
  const c = "h-full w-full";
  if (id === "site") return <SiteSvg title="Site plan" className={c} />;
  if (id === "plan") return <PlanSvg layers={{ furniture: false, tags: false, marks: false, dims: false }} title="Floor plan" className={c} />;
  if (id === "elev") return <ElevSvg title="Elevation" className={c} />;
  if (id === "sect") return <SectionSvg title="Section" className={c} />;
  if (id === "set") return <SiteSvg active="front" title="Setback plan" className={c} />;
  return (
    <svg viewBox="0 0 200 130" className={c} fill="none" role="img" aria-label="Schedules"><title>Schedules</title>
      {[0, 1, 2, 3, 4, 5].map((i) => <g key={i}><path d={`M10 ${20 + i * 17}H190`} stroke={SOFT} strokeWidth="0.8" /><path d={`M16 ${14 + i * 17}H40M60 ${14 + i * 17}H100M120 ${14 + i * 17}H150`} stroke={LINE} strokeWidth="2" /></g>)}
    </svg>
  );
}

export function SubmissionPackage() {
  const [on, setOn] = useState(false);
  return (
    <div>
      <button type="button" aria-pressed={on} onClick={() => setOn((v) => !v)} className={chip(on)}>{on ? "Spread documents" : "Assemble submission package"}</button>
      <div className="relative mt-4 hidden aspect-[16/8] overflow-hidden border border-slate-300 bg-white sm:block">
        {PKG.map((p, i) => (
          <div key={p.id} className="absolute aspect-[4/3] w-[28%] border border-slate-300 bg-white p-1.5 shadow-md transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ left: `${on ? 36 + i * 1.2 : POS[i][0]}%`, top: `${on ? 22 + i * 2.6 : POS[i][1]}%`, transform: on ? `rotate(${(i - 2.5) * 1.2}deg)` : "none", zIndex: i }}>
            <div className="h-[calc(100%-1.1rem)]"><Thumb id={p.id} /></div>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-slate-600">{p.t}</p>
          </div>
        ))}
        <p className={cn("absolute bottom-3 left-1/2 -translate-x-1/2 border border-slate-900 bg-slate-900 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-opacity duration-700", on ? "opacity-100" : "opacity-0")}>Submission package</p>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:hidden">
        {PKG.map((p) => <li key={p.id} className="border border-slate-300 bg-white p-2"><div className="aspect-[4/3]"><Thumb id={p.id} /></div><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-600">{p.t}</p></li>)}
      </ul>
      <p className="mt-3 text-xs text-slate-500">Documentation for approval submission — formatted to the authority&apos;s requirements where those are supplied. Approval itself is a decision for the authority.</p>
    </div>
  );
}

/* ───────── deliverables viewer ───────── */

const DTABS = [
  { id: "plan", label: "Plan", match: ["Floor plans", "Renovation"] },
  { id: "elev", label: "Elevation", match: ["Elevations"] },
  { id: "section", label: "Section", match: ["Elevations", "Construction documentation"] },
  { id: "detail", label: "Detail", match: ["Joinery", "Retail"] },
  { id: "schedule", label: "Schedule", match: ["Door, window"] },
  { id: "rcp", label: "RCP", match: ["Reflected"] },
  { id: "site", label: "Site", match: ["Site and setback"] },
  { id: "3d", label: "3D", match: ["3D architectural"] },
] as const;

export function DeliverablesViewer({ items }: { items: string[] }) {
  const [tab, setTab] = useState<(typeof DTABS)[number]["id"]>("plan");
  const cur = DTABS.find((t) => t.id === tab)!;
  const rise = useRise(tab === "3d");
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <div role="tablist" aria-label="Drawing set sheet types" className="mb-2 flex flex-wrap gap-2">
          {DTABS.map((t) => <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={chip(tab === t.id)}>{t.label}</button>)}
        </div>
        <Sheet label={`${cur.label} · illustrative sheet`}>
          <div key={tab} role="tabpanel" data-in="true" className="fade-in">
            {tab === "plan" ? <PlanSvg title="Floor plan sheet" className="h-auto w-full" /> : null}
            {tab === "elev" ? <ElevSvg title="Elevation sheet" className="h-auto w-full" /> : null}
            {tab === "section" ? <SectionSvg title="Section sheet" className="mx-auto h-auto w-full max-w-xl" /> : null}
            {tab === "detail" ? <JoinerySvg stage={3} title="Detail sheet" className="h-auto w-full" /> : null}
            {tab === "rcp" ? <RcpSvg title="Reflected ceiling plan sheet" className="h-auto w-full" /> : null}
            {tab === "site" ? <SiteSvg title="Site and setback plan sheet" className="h-auto w-full" /> : null}
            {tab === "3d" ? <MassSvg rise={rise} title="3D model sheet" className="h-auto w-full" /> : null}
            {tab === "schedule" ? (
              <div className="grid gap-3 p-2 sm:grid-cols-2">
                {[["Door schedule", DOORS.slice(0, 4).map((d) => [d.id, d.type, d.size])], ["Finish schedule", [["F1", "Floor", "Living"], ["F2", "Floor", "Kitchen"], ["F3", "Floor", "Hall"], ["F4", "Floor", "Bedroom"]]]].map(([t, rows]) => (
                  <table key={t as string} className="w-full border border-slate-300 text-left font-mono text-[10px]"><caption className="border-b border-slate-300 bg-slate-50 px-2 py-1.5 text-left uppercase tracking-[0.14em]">{t as string}</caption>
                    <tbody>{(rows as string[][]).map((r) => <tr key={r[0]} className="border-b border-slate-100">{r.map((c, i) => <td key={i} className="px-2 py-1.5">{c}</td>)}</tr>)}</tbody></table>
                ))}
              </div>
            ) : null}
          </div>
        </Sheet>
      </div>
      <ul className="space-y-2 self-start">
        {items.map((it) => {
          const hit = cur.match.some((m) => it.startsWith(m));
          return (
            <li key={it} className={cn("flex items-start gap-3 border px-4 py-3 text-sm transition-colors", hit ? "border-blue-600 bg-white text-slate-900" : "border-slate-200 text-slate-600")}>
              <span aria-hidden className={cn("mt-1.5 h-2 w-2 shrink-0", hit ? "bg-blue-600" : "bg-slate-300")} />{it}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ───────── RCP coordination ───────── */

export function RcpSection() {
  const [mode, setMode] = useState<"plan" | "rcp" | "both">("both");
  const [hi, setHi] = useState<string | null>(null);
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <div role="group" aria-label="Show" className="mb-2 flex flex-wrap gap-2">
          {([["plan", "Floor plan"], ["rcp", "Ceiling plan"], ["both", "Overlay"]] as const).map(([k, l]) => <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)} className={chip(mode === k)}>{l}</button>)}
        </div>
        <Sheet label="Reflected ceiling plan · A-111">
          <div className="relative">
            <div className={cn("transition-opacity duration-500", mode === "rcp" ? "opacity-0" : "opacity-100")}><PlanSvg layers={{ furniture: false, tags: false, marks: false, dims: false, labels: mode === "plan" }} title="Floor plan" className="block h-auto w-full" /></div>
            <div className={cn("absolute inset-0 transition-opacity duration-500", mode === "plan" ? "opacity-0" : "opacity-100")}><RcpSvg hi={hi ? [hi] : []} title="Reflected ceiling plan with ceiling zones, boundaries and light reference points" className="block h-auto w-full" /></div>
          </div>
        </Sheet>
      </div>
      <div className="space-y-4">
        <ul className="grid grid-cols-3 gap-2" aria-label="Light reference points">
          {ceilingFixtures.map((f) => <li key={f.id}><button type="button" onPointerEnter={() => setHi(f.id)} onPointerLeave={() => setHi(null)} onFocus={() => setHi(f.id)} onBlur={() => setHi(null)} onClick={() => setHi(f.id)} className={cn(chip(hi === f.id), "w-full")}>{f.id}</button></li>)}
        </ul>
        <ul className="space-y-2 border border-slate-300 bg-white p-4 text-sm text-slate-700">
          <li><strong className="text-slate-900">Ceiling zones</strong> and boundaries stay aligned with the walls drawn on the plan.</li>
          <li><strong className="text-slate-900">Light reference points</strong> show position only, for coordination with whoever designs the lighting.</li>
          <li><strong className="text-slate-900">Services zone</strong> marks where other trades&apos; ceiling-mounted items are expected.</li>
        </ul>
      </div>
    </div>
  );
}

/* ───────── site & setback ───────── */

export function SiteSection() {
  const [a, setA] = useState<SetbackId | null>(null);
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Sheet label="Site plan · hover or focus a setback line"><SiteSvg active={a} onActive={setA} title="Site plan with boundary, building footprint, access, north point and setback lines" className="h-auto w-full touch-manipulation" /></Sheet>
      <div className="space-y-4">
        <ul className="grid grid-cols-2 gap-2" aria-label="Setback lines">
          {SETBACKS.map((s) => <li key={s.id}><button type="button" aria-pressed={a === s.id} onClick={() => setA(a === s.id ? null : s.id)} onPointerEnter={() => setA(s.id)} onPointerLeave={() => setA(null)} className={cn(chip(a === s.id), "w-full text-left")}>{s.id === "left" || s.id === "right" ? `${s.id} side` : s.id}</button></li>)}
        </ul>
        <p className="border border-slate-300 bg-white p-4 text-sm leading-relaxed text-slate-700">Setback distances come from the relevant authority&apos;s requirements and differ between jurisdictions. This sheet shows how they are drawn — no numbers are assumed here.</p>
      </div>
    </div>
  );
}

/* ───────── plan → 3D ───────── */

export function MassSection() {
  const [v, setV] = useState(1);
  const [hi, setHi] = useState<string[]>([]);
  const [cut, setCut] = useState(false);
  const [playing, setPlaying] = useState(false);
  const auto = useRise(playing, 2000);
  const rise = playing ? auto : v;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => { setV(1); setPlaying(false); }, 2100);
    return () => clearTimeout(t);
  }, [playing]);
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Sheet label={`Plan → 3D · ${Math.round(rise * 100)}%`}><MassSvg rise={rise} hi={hi} cut={cut} title="Simplified isometric massing of the house rising from its floor plan" className="h-auto w-full" /></Sheet>
      <div className="space-y-5">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-300">Plan ←→ 3D</span>
          <input type="range" min={0} max={100} value={Math.round(rise * 100)} onChange={(e) => { setPlaying(false); setV(Number(e.target.value) / 100); }} aria-label="Raise the plan into a 3D model" className="mt-2 h-8 w-full accent-blue-500" />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { setV(0); setPlaying(true); }} className={chip(false, true)}>Raise from plan</button>
          <button type="button" aria-pressed={cut} onClick={() => setCut((c) => !c)} className={chip(cut, true)}>Section B-B plane</button>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="Highlight a room in 3D">
          {ROOMS.map((r) => <li key={r.id}><button type="button" aria-pressed={hi.includes(r.id)} onClick={() => setHi((h) => (h.includes(r.id) ? [] : [r.id]))} className={chip(hi.includes(r.id), true)}>{r.name}</button></li>)}
        </ul>
        <p className="text-sm leading-relaxed text-slate-300">The same footprint, grid and openings as the floor plan — so a render or model never drifts from the documentation set.</p>
      </div>
    </div>
  );
}

/* ───────── scroll process: one drawing evolving ───────── */

const NO: PlanLayers = { walls: true, openings: false, labels: false, dims: false, furniture: false, tags: false, marks: false, grid: false };
const PSTAGES: { name: string; layers: PlanLayers; sketch?: boolean; note: string }[] = [
  { name: "INPUT", layers: NO, sketch: true, note: "Hand sketch, marked-up plan, survey or model" },
  { name: "SCOPE", layers: { ...NO, labels: true, grid: true }, note: "Drawing set, stage and turnaround confirmed" },
  { name: "DRAFT · COORDINATE", layers: { walls: true, openings: true, labels: true, dims: false, furniture: true, tags: true, marks: true, grid: true }, note: "Plans, elevations, sections and details with cross-sheet references" },
  { name: "REVIEW", layers: { walls: true, openings: true, labels: true, dims: true, furniture: true, tags: true, marks: true, grid: true }, note: "Dimensions and schedules checked against the plan" },
  { name: "ISSUE", layers: { walls: true, openings: true, labels: true, dims: true, furniture: true, tags: true, marks: true, grid: true }, note: "Drawing set issued with revision tracking" },
];

export function ArchProcess({ steps }: { steps: { title: string; description: string }[] }) {
  const { ref, stage } = useScrollStage(steps.length);
  const st = PSTAGES[stage];
  return (
    <div ref={ref} style={css({ "--p": 0 })} className="relative lg:h-[340vh]">
      <div className="relative py-20 sm:py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
        <div className="w-full">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
            <div key={stage} data-in="true" className="relative">
              <Sheet label={`${st.name} · ${st.note}`}>
                <PlanSvg layers={st.layers} sketch={st.sketch} title={`The same plan at the ${st.name.toLowerCase()} stage`} className="h-auto w-full" />
              </Sheet>
              {stage === 3 ? <p className="fade-in absolute right-4 top-3 border border-green-700 bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-green-700">✓ Schedules match plan</p> : null}
              {stage === 4 ? <div className="fade-in absolute bottom-10 right-5 w-48 bg-white sm:w-56"><TitleBlock className="h-auto w-full" status="ISSUED" /></div> : null}
            </div>
            <ol className="relative space-y-1 border-l border-slate-600 pl-6">
              <span aria-hidden className="absolute -left-px top-0 w-px origin-top bg-copper-500" style={{ height: "100%", transform: "scaleY(var(--p))" }} />
              {steps.map((s, i) => (
                <li key={s.title} className={cn("relative py-3 transition-opacity duration-500", i === stage ? "opacity-100" : "opacity-45")}>
                  <span aria-hidden className={cn("absolute -left-[31px] top-4 h-[10px] w-[10px] border bg-[#111827]", i <= stage ? "border-copper-500" : "border-slate-500")} />
                  <p className="font-mono text-xs tracking-[0.16em] text-copper-400">{String(i + 1).padStart(2, "0")} · {PSTAGES[i].name}</p>
                  <h3 className="mt-0.5 text-base font-semibold tracking-tight text-white">{s.title}</h3>
                  <p className={cn("mt-1 text-sm leading-relaxed text-slate-300 transition-[max-height,opacity] duration-500 lg:overflow-hidden", i === stage ? "lg:max-h-44 lg:opacity-100" : "lg:max-h-0 lg:opacity-0")}>{s.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── revision control ───────── */

const REVS = [
  { rev: "A", name: "Sketch", desc: "Concept sketch received as design input", status: "For discussion", rv: 0 },
  { rev: "B", name: "Design development", desc: "Plan documented from design drawings", status: "For review", rv: 1 },
  { rev: "C", name: "Approval", desc: "Approval set with dimensions and tags", status: "For submission", rv: 2 },
  { rev: "D", name: "Revision", desc: "Bath enlarged · D-06 relocated · schedule and detail updated", status: "Revised", rv: 3 },
  { rev: "E", name: "Construction documentation", desc: "Full set re-issued with current design", status: "For construction", rv: 4 },
];

export function RevisionTimeline() {
  const [i, setI] = useState(3);
  const r = REVS[i];
  const rv = r.rv >= 3 ? 3 : 0;
  const layers: PlanLayers = i === 0 ? { walls: true, openings: false, labels: false, dims: false, furniture: false, tags: false, marks: false, grid: false } : { dims: i >= 2, tags: i >= 2, marks: i >= 2, furniture: i >= 1, labels: true };
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <ol className="mb-2 flex flex-wrap gap-2" aria-label="Revision history">
          {REVS.map((x, k) => <li key={x.rev}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={chip(i === k)}>Rev {x.rev} · {x.name}</button></li>)}
        </ol>
        <Sheet label={`REV ${r.rev} · ${r.status.toUpperCase()} · illustrative`}>
          <div key={i} data-in="true"><PlanSvg layers={layers} sketch={i === 0} rev={rv} title={`Floor plan at revision ${r.rev}, ${r.name}`} className="h-auto w-full fade-in" /></div>
        </Sheet>
      </div>
      <div className="space-y-4">
        <table className="w-full border border-slate-300 bg-white text-left text-xs">
          <thead><tr className="border-b border-slate-300 bg-slate-50 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-600"><th className="px-3 py-2 font-normal">Rev</th><th className="font-normal">Description</th><th className="pr-3 font-normal">Status</th></tr></thead>
          <tbody>{REVS.map((x, k) => (
            <tr key={x.rev} className={cn("border-b border-slate-100 last:border-0", k === i ? "bg-blue-50 font-medium text-slate-900" : k < i ? "text-slate-600" : "text-slate-400")}>
              <td className="px-3 py-2 font-mono">{x.rev}</td><td className="py-2 pr-2">{x.desc}</td><td className="pr-3 font-mono text-[10px] uppercase">{x.status}</td>
            </tr>))}</tbody>
        </table>
        {i >= 3 ? (
          <ul key={`c${i}`} data-in="true" className="space-y-1.5 border border-blue-600 bg-white p-4 text-sm text-slate-700">
            {["Wall moved — bath enlarged", "Door D-06 relocated", "Room area changed", "Door schedule row D-06 updated", "Detail 03/A-501 revised"].map((c, k) => (
              <li key={c} className="fade-in flex gap-2" style={css({ "--d": `${k * 120}ms` })}><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-blue-600" />{c}</li>
            ))}
          </ul>
        ) : <p className="border border-slate-300 bg-white p-4 text-sm text-slate-600">Step to Rev D to see a design change cascade through plan, schedule and detail — each marked with a revision cloud.</p>}
      </div>
    </div>
  );
}

export { META, LINE, FAINT, SAND, INK, BLUE, Bubble, sx, ElevSvg };
