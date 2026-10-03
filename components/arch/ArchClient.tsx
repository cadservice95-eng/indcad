"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlanSvg, ElevSvg, SectionSvg, MassSvg, SiteSvg, sx, INK, LINE, SOFT, BLUE, SAND, PAPER, Bubble, type PlanLayers } from "./Drawing";
import { ROOMS, OPENINGS, DOORS, WINDOWS, FINISHES, ease, mono, roomOf, openingOf, type Opening } from "./model";
import { Sheet, chip, META } from "./ui";

const css = (o: Record<string, string | number>) => o as React.CSSProperties;
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** 0 → 1 tween while `on`; snaps to 0 when off. Jumps straight to 1 under reduced motion. */
export function useRise(on: boolean, ms = 1700) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const reduce = reducedMotion();
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      setV(on ? (reduce ? 1 : ease(t)) : 0);
      if (on && t < 1 && !reduce) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, ms]);
  return v;
}

/* ───────── hero / generic drawing viewer ───────── */

type View = "plan" | "elev" | "section" | "3d";
const VIEWS: { id: View; label: string; cap: string }[] = [
  { id: "plan", label: "Plan", cap: "Ground floor plan · A-101" },
  { id: "elev", label: "Elevation", cap: "South elevation · A-201" },
  { id: "section", label: "Section", cap: "Section B-B · A-301" },
  { id: "3d", label: "3D", cap: "Massing model · same footprint" },
];
const ORDER: View[] = ["plan", "elev", "section", "3d"];

export function DrawingViewer({ tour = false, animate = false }: { tour?: boolean; animate?: boolean }) {
  const [view, setView] = useState<View>("plan");
  const [touring, setTouring] = useState(tour);
  const [left, setLeft] = useState(false);
  const rise = useRise(view === "3d");

  useEffect(() => {
    if (!touring || reducedMotion()) return;
    const i = ORDER.indexOf(view);
    if (i === ORDER.length - 1) return;
    const t = setTimeout(() => { setLeft(true); setView(ORDER[i + 1]); }, i === 0 ? (animate ? 8200 : 3600) : 3800);
    return () => clearTimeout(t);
  }, [view, touring, animate]);

  const go = (v: View) => { setTouring(false); setLeft(true); setView(v); };
  const cur = VIEWS.find((v) => v.id === view)!;
  return (
    <div data-in="true">
      <div role="tablist" aria-label="Drawing views of the same building" className="mb-2 flex flex-wrap gap-2">
        {VIEWS.map((v) => (
          <button key={v.id} role="tab" type="button" aria-selected={view === v.id} onClick={() => go(v.id)} className={chip(view === v.id)}>{v.label}</button>
        ))}
      </div>
      <Sheet label={`${cur.cap}`}>
        <div role="tabpanel" aria-label={cur.cap} key={view} className={view === "plan" && animate && !left ? "" : "fade-in"}>
          {view === "plan" ? <PlanSvg animate={animate && !left} title="Ground floor plan of an illustrative two-storey house: walls, doors, windows, stair, rooms and dimensions" className="h-auto w-full" /> : null}
          {view === "elev" ? <ElevSvg title="South elevation of the same house, aligned to plan grid lines A to C" className="h-auto w-full" /> : null}
          {view === "section" ? <SectionSvg title="Section B-B through the kitchen and stair hall of the same house" className="h-auto w-full" /> : null}
          {view === "3d" ? <MassSvg rise={rise} cut title="Simplified 3D massing of the same house rising from its floor plan footprint" className="h-auto w-full" /> : null}
        </div>
        <p className="mt-1 px-1 font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">{META}</p>
      </Sheet>
    </div>
  );
}

/* ───────── what this service covers: building ↔ outputs ───────── */

const OUT = [
  { id: "plans", label: "Floor plans", note: "Existing & proposed", hi: ROOMS.map((r) => r.id), marks: "none" as const },
  { id: "elev", label: "Elevations", note: "Aligned to grid", hi: ["D-01", "W-05", "W-06"], marks: "elev" as const },
  { id: "sect", label: "Sections", note: "Cut through the model", hi: [] as string[], marks: "section" as const },
  { id: "det", label: "Details", note: "Junctions & joinery", hi: ["D-01", "W-05"], marks: "none" as const },
  { id: "sched", label: "Schedules", note: "Door · window · finish", hi: OPENINGS.map((o) => o.id), marks: "none" as const },
  { id: "site", label: "Site plans", note: "Setbacks & access", hi: [] as string[], marks: "none" as const },
];

export function CoversHub() {
  const [sel, setSel] = useState("plans");
  const cur = OUT.find((o) => o.id === sel)!;
  const btn = (o: (typeof OUT)[number]) => (
    <li key={o.id}>
      <button type="button" aria-pressed={sel === o.id} onClick={() => setSel(o.id)} onPointerEnter={() => setSel(o.id)} onFocus={() => setSel(o.id)}
        className={cn("group relative w-full border px-4 py-3.5 text-left transition-colors", sel === o.id ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-900 hover:border-slate-900")}>
        <span className="block text-sm font-semibold tracking-tight">{o.label}</span>
        <span className={cn("block font-mono text-[10px] uppercase tracking-[0.12em]", sel === o.id ? "text-blue-100" : "text-slate-500")}>{o.note}</span>
      </button>
    </li>
  );
  return (
    <div className="grid items-center gap-5 lg:grid-cols-[200px_1fr_200px] lg:gap-8">
      <ul className="order-2 grid grid-cols-2 gap-2 lg:order-1 lg:grid-cols-1">{OUT.slice(0, 3).map(btn)}</ul>
      <div className="order-1 lg:order-2">
        <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Building design</p>
        <Sheet label={`Selected · ${cur.label}`}>
          {sel === "site" ? (
            <SiteSvg title="Site plan showing the building footprint, boundary and setback lines" className="h-auto w-full" />
          ) : (
            <PlanSvg interact={{ hi: cur.hi }} marks={cur.marks === "none" ? "both" : cur.marks} layers={{ marks: cur.marks !== "none", dims: sel === "plans" }} title={`Floor plan with the ${cur.label.toLowerCase()} area highlighted`} className="h-auto w-full" />
          )}
        </Sheet>
      </div>
      <ul className="order-3 grid grid-cols-2 gap-2 lg:grid-cols-1">{OUT.slice(3).map(btn)}</ul>
    </div>
  );
}

/* ───────── floor plan explorer ───────── */

export function describe(id: string | null) {
  if (!id) return null;
  const o = openingOf(id);
  if (o) return { k: o.kind === "door" ? "Door" : "Window", v: o.id, a: o.desc, ref: "A-201" };
  const r = ROOMS.find((x) => x.id === id);
  return r ? { k: "Room", v: r.name, a: "Illustrative", ref: "A-101" } : null;
}

export function FloorPlanExplorer() {
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>("kitchen");
  const active = hover ?? picked;
  const d = describe(active);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <Sheet label="Ground floor plan · hover or tap a room, door or window">
        <PlanSvg interact={{ mode: "both", hi: active ? [active] : [], onHover: setHover, onPick: setPicked }} title="Interactive floor plan. Rooms, doors and windows can be selected." className="h-auto w-full touch-manipulation" />
      </Sheet>
      <div className="space-y-4">
        <dl aria-live="polite" className="border border-slate-300 bg-white">
          {[[d?.k ?? "Select", d?.v ?? "—"], ["Area", d?.k === "Room" ? "Illustrative" : d ? "—" : "—"], ["Reference", d?.ref ?? "—"]].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 border-b border-slate-200 px-4 py-3 last:border-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{k}</dt>
              <dd className="text-sm font-semibold text-slate-900">{v}</dd>
            </div>
          ))}
        </dl>
        <ul className="grid grid-cols-2 gap-2">
          {ROOMS.map((r) => (
            <li key={r.id}><button type="button" aria-pressed={picked === r.id} onClick={() => setPicked(r.id)} className={cn(chip(picked === r.id), "w-full text-left")}>{r.name}</button></li>
          ))}
        </ul>
        <ul className="space-y-1.5 border border-slate-300 bg-white p-4 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-600">
          <li className="flex items-center gap-3"><svg width="26" height="8" aria-hidden><path d="M0 4H26" stroke={INK} strokeWidth="6.5" /></svg>WT1 · External wall</li>
          <li className="flex items-center gap-3"><svg width="26" height="8" aria-hidden><path d="M0 4H26" stroke={INK} strokeWidth="3.6" /></svg>WT2 · Internal partition</li>
          <li className="flex items-center gap-3"><svg width="26" height="10" aria-hidden><path d="M0 5H26" stroke={LINE} strokeWidth="1" /></svg>Dimension string</li>
          <li className="flex items-center gap-3"><svg width="26" height="10" aria-hidden><rect x="1" y="1" width="24" height="8" fill="none" stroke={SOFT} /></svg>Furniture outline</li>
        </ul>
      </div>
    </div>
  );
}

/* ───────── signature: one building → every drawing view ───────── */

export function ThreeViews() {
  const [zone, setZone] = useState("kitchen");
  const r = roomOf(zone);
  const crosses = r.x0 <= 340 && r.x1 >= 340;
  return (
    <div>
      <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_0.85fr] lg:items-start">
        <Sheet label="Plan"><PlanSvg interact={{ mode: "rooms", hi: [zone], onPick: setZone, onHover: (id) => id && setZone(id) }} layers={{ dims: false, tags: false, marks: true }} title="Floor plan with a selectable zone" className="h-auto w-full touch-manipulation" /></Sheet>
        <Sheet label="Elevation"><ElevSvg band={[r.x0, r.x1]} title={`South elevation with the ${r.name} zone projected from the plan`} className="h-auto w-full" /></Sheet>
        <Sheet label="Section B-B"><SectionSvg band={[sx(r.y0), sx(r.y1)]} title={`Section B-B with the ${r.name} zone projected from the plan`} className="h-auto w-full" /></Sheet>
      </div>
      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ul className="flex flex-wrap gap-2" aria-label="Plan zones">
          {ROOMS.map((x) => <li key={x.id}><button type="button" aria-pressed={zone === x.id} onClick={() => setZone(x.id)} className={chip(zone === x.id, true)}>{x.name}</button></li>)}
        </ul>
        <p aria-live="polite" className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-300">
          <span className="text-white">Plan zone</span><ArrowRight className="h-3 w-3 text-sky-300" aria-hidden />
          <span>Elevation · grid band</span><ArrowRight className="h-3 w-3 text-sky-300" aria-hidden />
          <span>{crosses ? "Section B-B · cut through zone" : "Section B-B · beyond the cut"}</span>
        </p>
      </div>
    </div>
  );
}

/* ───────── coordination matrix: one element → every reference ───────── */

const SHEETS = [
  { id: "plan", name: "Floor plan", no: "A-101" },
  { id: "rcp", name: "Reflected ceiling plan", no: "A-111" },
  { id: "elev", name: "Elevations", no: "A-201" },
  { id: "door", name: "Door schedule", no: "A-601" },
  { id: "win", name: "Window schedule", no: "A-602" },
  { id: "fin", name: "Finish schedule", no: "A-603" },
  { id: "det", name: "Details", no: "A-501" },
];
const wallName = { N: "north", S: "south", E: "east", W: "west", h: "interior", v: "interior" } as const;

function carried(id: string): Record<string, string | null> {
  const o = openingOf(id);
  if (o) {
    const where = o.kind === "door" ? (o.id === "D-01" ? "on the south elevation" : "on an interior elevation") : `on the ${wallName[o.wall]} elevation`;
    return {
      plan: `${o.id} tagged in ${roomOf(o.room).name}`, rcp: null, elev: `${o.id} ${where}`,
      door: o.kind === "door" ? `Row ${o.id} · ${o.size}` : null, win: o.kind === "window" ? `Row ${o.id} · ${o.size}` : null, fin: null,
      det: `Detail 03/A-501 · ${o.kind === "door" ? "head & jamb" : "head, sill & jamb"}`,
    };
  }
  const r = roomOf(id);
  return { plan: `${r.tag} · ${r.name}`, rcp: `Ceiling zone for ${r.name}`, elev: null, door: null, win: null, fin: `Floor finish ${r.finish}`, det: null };
}

export function CoordinationMatrix() {
  const [sel, setSel] = useState("D-02");
  const c = carried(sel);
  const groups: [string, string[]][] = [["Doors", DOORS.map((d) => d.id)], ["Windows", WINDOWS.map((w) => w.id)], ["Rooms", ROOMS.map((r) => r.id)]];
  const label = (id: string) => openingOf(id)?.id ?? roomOf(id).tag;
  return (
    <div>
      <div className="space-y-3">
        {groups.map(([g, ids]) => (
          <div key={g} className="flex flex-wrap items-center gap-2">
            <span className="w-16 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{g}</span>
            {ids.map((id) => <button key={id} type="button" aria-pressed={sel === id} onClick={() => setSel(id)} className={chip(sel === id)}>{label(id)}</button>)}
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center">
        <div className="border border-slate-900 bg-slate-900 px-5 py-3 text-center text-white">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">Selected element</p>
          <p className="mt-0.5 text-lg font-semibold tracking-tight">{label(sel)} <span className="text-sm font-normal text-slate-300">· {openingOf(sel)?.desc ?? roomOf(sel).name}</span></p>
        </div>
        <span aria-hidden className="h-6 w-px bg-slate-400" />
      </div>
      <ul key={sel} data-in="true" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SHEETS.map((s, i) => {
          const t = c[s.id];
          return (
            <li key={s.id} className={cn("fade-in border p-4 transition-colors", t ? "border-blue-600 bg-white shadow-[0_10px_24px_-16px_rgba(37,99,235,0.7)]" : "border-slate-200 bg-transparent opacity-50")} style={css({ "--d": `${i * 70}ms` })}>
              <p className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><span>{s.no}</span><span className={t ? "text-blue-600" : ""}>{t ? "Referenced" : "Not carried"}</span></p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-slate-900">{s.name}</p>
              <p className="mt-1 min-h-[2.5rem] text-xs leading-relaxed text-slate-600">{t ?? "No reference to this element on this sheet."}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ───────── one door → every reference ───────── */

function DoorElev({ o }: { o: Opening }) {
  return (
    <svg viewBox="0 0 220 150" className="h-auto w-full" role="img" aria-label={`Interior elevation showing door ${o.id}`} fill="none" strokeLinecap="round">
      <path d="M10 130H210" stroke={INK} strokeWidth="2.4" />
      <rect x="20" y="20" width="180" height="110" fill="#F8FAFC" stroke={LINE} />
      <rect x="85" y="42" width="50" height="88" fill="#DBEAFE" stroke={BLUE} strokeWidth="2.2" />
      <path d="M85 42h50" stroke={BLUE} strokeWidth="3" /><circle cx="128" cy="88" r="2" fill={INK} />
      <text x="110" y="36" textAnchor="middle" fontSize="8" fill={BLUE} fontWeight="700" style={mono}>{o.id}</text>
      <path d="M150 42V130" stroke={LINE} strokeWidth="0.6" /><text x="157" y="90" fontSize="7" fill={LINE} style={mono}>2040</text>
    </svg>
  );
}

function DoorDetail() {
  return (
    <svg viewBox="0 0 220 150" className="h-auto w-full" role="img" aria-label="Illustrative door head and jamb detail" fill="none" strokeLinecap="round">
      <defs><pattern id="od-p" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5" stroke={INK} strokeWidth="1" /></pattern></defs>
      <rect x="30" y="30" width="46" height="90" fill="url(#od-p)" stroke={INK} /><rect x="144" y="30" width="46" height="90" fill="url(#od-p)" stroke={INK} />
      <rect x="76" y="30" width="10" height="90" fill="#F1F5F9" stroke={LINE} /><rect x="134" y="30" width="10" height="90" fill="#F1F5F9" stroke={LINE} />
      <rect x="92" y="34" width="36" height="8" stroke={BLUE} strokeWidth="1.6" fill="#DBEAFE" />
      <Bubble x={110} y={80} t="03" fill="#DBEAFE" /><text x="110" y="136" textAnchor="middle" fontSize="8" fill={INK} style={mono}>03 / A-501</text>
    </svg>
  );
}

export function OneDoor() {
  const [id, setId] = useState("D-01");
  const o = openingOf(id)!;
  const rows = DOORS;
  const steps = ["Door on plan", "Door on elevation", "Door schedule", "Interior detail"];
  return (
    <div>
      <ul className="flex flex-wrap gap-2" aria-label="Choose a door">
        {DOORS.map((d) => <li key={d.id}><button type="button" aria-pressed={id === d.id} onClick={() => setId(d.id)} className={chip(id === d.id, true)}>{d.id}</button></li>)}
      </ul>
      <ol key={id} data-in="true" className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
        {steps.map((s, i) => (
          <li key={s} className="fade-in relative xl:pr-6" style={css({ "--d": `${i * 320}ms` })}>
            <div className="h-full border border-slate-600 bg-white p-2">
              <p className="mb-1 flex items-center justify-between px-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500"><span>{String(i + 1).padStart(2, "0")} · {s}</span></p>
              {i === 0 ? <PlanSvg interact={{ hi: [id] }} layers={{ dims: false, marks: false, furniture: false, labels: false, grid: false }} title={`Plan with door ${id} highlighted`} className="h-auto w-full" /> : null}
              {i === 1 ? (id === "D-01" ? <ElevSvg hi={["D-01"]} title="South elevation with the entry door highlighted" className="h-auto w-full" /> : <DoorElev o={o} />) : null}
              {i === 2 ? (
                <table className="w-full border-collapse text-left font-mono text-[10px]">
                  <thead><tr className="border-b border-slate-300 text-slate-500"><th className="py-1.5 font-normal">REF</th><th className="font-normal">TYPE</th><th className="font-normal">SIZE</th></tr></thead>
                  <tbody>{rows.map((r) => <tr key={r.id} className={cn("border-b border-slate-100", r.id === id ? "bg-blue-100 font-semibold text-blue-700" : "text-slate-400")}><td className="py-1.5 pl-1">{r.id}</td><td>{r.type}</td><td>{r.size}</td></tr>)}</tbody>
                </table>
              ) : null}
              {i === 3 ? <DoorDetail /> : null}
            </div>
            {i < steps.length - 1 ? <ArrowRight aria-hidden className="absolute -bottom-3.5 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rotate-90 bg-[#111827] text-sky-300 sm:hidden xl:-right-2.5 xl:bottom-auto xl:left-auto xl:top-1/2 xl:translate-x-0 xl:rotate-0" /> : null}
          </li>
        ))}
      </ol>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">{o.id} · {o.desc} · {o.size} · illustrative reference only</p>
    </div>
  );
}

/* ───────── schedules synced to the plan ───────── */

type Row = { id: string; type: string; size: string; loc: string; desc: string; rooms: string[] };
const doorRows: Row[] = DOORS.map((d) => ({ id: d.id, type: d.type, size: d.size, loc: roomOf(d.room).name, desc: d.desc, rooms: [d.room] }));
const winRows: Row[] = WINDOWS.map((w) => ({ id: w.id, type: w.type, size: w.size, loc: roomOf(w.room).name, desc: w.desc, rooms: [w.room] }));
const finRows: Row[] = FINISHES.map((f) => ({ id: f.id, type: f.type, size: "—", loc: f.loc, desc: f.desc, rooms: ROOMS.filter((r) => r.finish === f.id).map((r) => r.id) }));

function Schedule({ title, rows, hot, onHot, isFinish }: { title: string; rows: Row[]; hot: string[]; onHot: (ids: string[]) => void; isFinish?: boolean }) {
  return (
    <div className="border border-slate-300 bg-white">
      <p className="border-b border-slate-300 bg-slate-50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-700">{title}</p>
      <table className="w-full table-fixed border-collapse text-left text-[11px]">
        <thead><tr className="border-b border-slate-200 font-mono text-[9px] uppercase tracking-[0.1em] text-slate-500">
          <th className="w-[14%] px-3 py-1.5 font-normal">Ref</th><th className="w-[22%] font-normal">Type</th><th className="hidden w-[20%] font-normal sm:table-cell">Size</th><th className="w-[24%] font-normal">Location</th><th className="hidden font-normal md:table-cell">Description</th>
        </tr></thead>
        <tbody>
          {rows.map((r) => {
            const on = hot.includes(r.id) || (isFinish && r.rooms.some((x) => hot.includes(x)));
            return (
              <tr key={r.id} tabIndex={0} onPointerEnter={() => onHot([r.id, ...r.rooms])} onPointerLeave={() => onHot([])} onFocus={() => onHot([r.id, ...r.rooms])} onBlur={() => onHot([])}
                className={cn("cursor-default border-b border-slate-100 outline-none transition-colors last:border-0 focus-visible:bg-blue-50", on ? "bg-blue-100 text-blue-800" : "text-slate-700")}>
                <td className="px-3 py-1.5 font-mono font-semibold">{r.id}</td><td className="truncate">{r.type}</td><td className="hidden truncate font-mono sm:table-cell">{r.size}</td><td className="truncate">{r.loc}</td><td className="hidden truncate md:table-cell">{r.desc}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ScheduleSync() {
  const [hot, setHot] = useState<string[]>([]);
  // A hovered plan item lights its schedule rows: openings by id, rooms via finish and their doors/windows.
  const planHi = hot;
  const rowHot = (id: string | null) => setHot(id ? (openingOf(id) ? [id] : (() => { const r = ROOMS.find((x) => x.id === id); return r ? [id, r.finish, ...OPENINGS.filter((o) => o.room === id).map((o) => o.id)] : [id]; })()) : []);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      <Sheet label="Hover a room, door or window — the matching schedule rows light up"><PlanSvg interact={{ mode: "both", hi: planHi.filter((x) => !x.startsWith("F")), onHover: rowHot }} layers={{ dims: false, marks: false }} title="Floor plan linked to the door, window and finish schedules" className="h-auto w-full touch-manipulation" /></Sheet>
      <div className="space-y-3">
        <Schedule title="Door schedule" rows={doorRows} hot={hot} onHot={setHot} />
        <Schedule title="Window schedule" rows={winRows} hot={hot} onHot={setHot} />
        <Schedule title="Finish schedule" rows={finRows} hot={hot} onHot={setHot} isFinish />
      </div>
    </div>
  );
}

export { SAND, PAPER, MassSvg };
export type { PlanLayers };
