"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { chip } from "@/components/arch/ui";
import { CAP_ROWS, IndustryArt, artShapes, type CapKey } from "./config";

export type IndRow = {
  slug: string; name: string; desc: string; tags: string[]; caps: CapKey[]; build: string; finalStage: string;
  useCases: string[]; docReq: string; deliverables: string[]; software: { slug: string; name: string }[]; services: { name: string; href: string }[];
};
const mono = { fontFamily: "var(--font-mono)" } as const;
const href = (r: IndRow) => `/industries/${r.slug}`;

/* ───────── hero network ───────── */

const CX = 380, CY = 255, RX = 285, RY = 190;
export function Network({ rows }: { rows: IndRow[] }) {
  const [act, setAct] = useState<string | null>(null);
  const a = rows.find((r) => r.slug === act) ?? null;
  const pos = rows.map((_, k) => { const t = ((-90 + k * 45) * Math.PI) / 180; return [CX + Math.cos(t) * RX, CY + Math.sin(t) * RY] as const; });
  return (
    <div data-in="true">
      <div className="hidden md:block">
        <svg viewBox="0 0 760 510" className="block h-auto w-full" fill="none" role="group" aria-label="Industry capability map: eight industries connected to Render CAD Hub">
          <defs><pattern id="nw-g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" stroke="#7DD3FC" strokeOpacity="0.07" /></pattern></defs>
          <rect width="760" height="510" fill="url(#nw-g)" />
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY} stroke="#38BDF8" strokeOpacity="0.12" strokeDasharray="2 6" />
          {rows.map((r, k) => {
            const [x, y] = pos[k];
            const on = act === r.slug;
            return <path key={r.slug} d={`M${CX} ${CY}L${x} ${y}`} pathLength={1} stroke="#38BDF8" strokeWidth={on ? 2.2 : 1} strokeOpacity={act ? (on ? 1 : 0.18) : 0.5} className="draw" style={{ "--d": `${600 + k * 120}ms`, "--t": "0.9s" } as React.CSSProperties} />;
          })}
          <g className="fade-in" style={{ "--d": "300ms" } as React.CSSProperties}>
            <circle cx={CX} cy={CY} r="52" fill="#2563EB" fillOpacity="0.18" stroke="#60A5FA" strokeWidth="2" /><text x={CX} y={CY - 4} textAnchor="middle" fontSize="12" fill="#fff" style={mono}>RENDER</text><text x={CX} y={CY + 12} textAnchor="middle" fontSize="12" fill="#fff" style={mono}>CAD HUB</text>
          </g>
          {rows.map((r, k) => {
            const [x, y] = pos[k];
            const on = act === r.slug;
            return (
              <g key={r.slug} className="fade-in" style={{ "--d": `${500 + k * 120}ms`, cursor: "pointer", outline: "none" } as React.CSSProperties} role="button" tabIndex={0} aria-label={`${r.name}: ${r.tags.join(", ")}`} aria-pressed={on} onPointerEnter={() => setAct(r.slug)} onFocus={() => setAct(r.slug)} onClick={() => setAct(r.slug)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setAct(r.slug); } }}>
                <g opacity={act && !on ? 0.45 : 1} style={{ transition: "opacity .3s" }}>
                  <rect x={x - 72} y={y - 38} width="144" height="76" fill="#0B1B33" stroke={on ? "#7DD3FC" : "#38BDF8"} strokeOpacity={on ? 1 : 0.5} strokeWidth={on ? 2 : 1} />
                  <svg x={x - 38} y={y - 36} width="76" height="48" viewBox="0 0 240 150" aria-hidden>{artShapes(r.slug)}</svg>
                  <text x={x} y={y + 28} textAnchor="middle" fontSize="11" fill="#E2E8F0" style={mono}>{r.name.toUpperCase()}</text>
                </g>
              </g>
            );
          })}
        </svg>
        <div aria-live="polite" className="mt-3 min-h-[76px] border border-sky-300/25 bg-[#0B1B33] px-4 py-3">
          {a ? (
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">{a.name}</p><ul className="mt-1 flex flex-wrap gap-1.5">{a.tags.map((t) => <li key={t} className="border border-slate-600 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-slate-200">{t}</li>)}</ul></div><Link href={href(a)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:text-copper-400 hover:underline">View {a.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link></div>
          ) : <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">Hover or select an industry to see its capabilities</p>}
        </div>
      </div>
      <ul className="space-y-2 md:hidden">
        {rows.map((r) => (
          <li key={r.slug} className="border border-sky-300/25 bg-[#0B1B33]">
            <button type="button" aria-expanded={act === r.slug} onClick={() => setAct(act === r.slug ? null : r.slug)} className="flex min-h-[48px] w-full items-center justify-between px-4 py-3 text-left"><span className="text-sm font-semibold text-white">{r.name}</span><span aria-hidden className="font-mono text-slate-400">{act === r.slug ? "−" : "+"}</span></button>
            {act === r.slug ? <div className="border-t border-slate-700 px-4 py-3"><ul className="flex flex-wrap gap-1.5">{r.tags.map((t) => <li key={t} className="border border-slate-600 px-2 py-0.5 font-mono text-[10px] uppercase text-slate-200">{t}</li>)}</ul><Link href={href(r)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline underline-offset-4">View {r.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link></div> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────── selector ───────── */

export function Selector({ rows }: { rows: IndRow[] }) {
  const [i, setI] = useState(0);
  const r = rows[i];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[240px_1fr]">
      <div role="tablist" aria-label="Industry" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {rows.map((x, k) => <button key={x.slug} role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "ArrowRight") setI((k + 1) % rows.length); if (e.key === "ArrowUp" || e.key === "ArrowLeft") setI((k + rows.length - 1) % rows.length); }} className={cn(chip(i === k), "shrink-0 text-left")}>{String(k + 1).padStart(2, "0")} · {x.name}</button>)}
      </div>
      <div key={r.slug} data-in="true" className="fade-in grid overflow-hidden border border-slate-300 bg-white md:grid-cols-[1.2fr_1fr]">
        <IndustryArt slug={r.slug} name={r.name} className="block h-full w-full object-cover" />
        <div className="flex flex-col p-6">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{r.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.desc}</p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Capabilities</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">{r.tags.map((t) => <li key={t} className="border border-slate-300 px-2 py-1 text-xs text-slate-700">{t}</li>)}</ul>
          <Link href={href(r)} className="mt-6 inline-flex items-center gap-1.5 self-start bg-copper-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-copper-600">View {r.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </div>
    </div>
  );
}

/* ───────── matrix ───────── */

export function Matrix({ rows }: { rows: IndRow[] }) {
  const [hot, setHot] = useState<CapKey | null>(null);
  const [col, setCol] = useState<string | null>(null);
  return (
    <div>
      <div className="overflow-x-auto border border-slate-300 bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left text-xs">
          <caption className="sr-only">Selected capabilities by industry</caption>
          <thead><tr className="border-b border-slate-300 bg-slate-50"><th scope="col" className="px-3 py-3 font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-slate-500">Selected capabilities</th>{rows.map((r) => <th key={r.slug} scope="col" onPointerEnter={() => setCol(r.slug)} onPointerLeave={() => setCol(null)} className={cn("px-2 py-3 text-center font-semibold transition-colors", col === r.slug ? "bg-blue-50 text-blue-800" : "text-slate-800")}><Link href={href(r)} className="underline-offset-4 hover:underline">{r.name}</Link></th>)}</tr></thead>
          <tbody>
            {CAP_ROWS.map((c) => (
              <tr key={c.k} tabIndex={0} onPointerEnter={() => setHot(c.k)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(c.k)} onBlur={() => setHot(null)} className={cn("border-b border-slate-100 outline-none transition-colors", hot === c.k ? "bg-blue-50" : "")}>
                <th scope="row" className="px-3 py-3 text-sm font-medium text-slate-900">{c.label}</th>
                {rows.map((r) => { const on = r.caps.includes(c.k); return <td key={r.slug} className={cn("px-2 py-3 text-center transition-colors", col === r.slug && "bg-blue-50/60")}>{on ? <span aria-label="Supported by the industry description" className={cn("inline-grid h-6 w-6 place-items-center border text-[11px] transition-colors", hot === c.k ? "border-blue-600 bg-blue-600 text-white" : "border-blue-600 text-blue-700")}>✓</span> : <span aria-label="Not stated" className="text-slate-300">–</span>}</td>; })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-500">Selected capabilities by industry — based on each industry&apos;s description. Not an exhaustive list; a dash means not stated here, not unsupported.</p>
    </div>
  );
}

/* ───────── discovery ───────── */

export function Discovery({ rows }: { rows: IndRow[] }) {
  const [i, setI] = useState<number | null>(null);
  const r = i === null ? null : rows[i];
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">What are you building?</p>
      <ul className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">{rows.map((x, k) => <li key={x.slug}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("block min-h-[56px] w-full border px-4 py-3 text-left text-sm font-semibold transition-colors", i === k ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-900 hover:border-slate-900")}>{x.build}</button></li>)}</ul>
      <div aria-live="polite" className="mt-4 min-h-[64px] border border-slate-300 bg-white px-5 py-4">
        {r ? <Link href={href(r)} className="flex flex-wrap items-center justify-between gap-3"><span className="text-base font-semibold text-slate-900">→ {r.name}</span><span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">Explore {r.name} <ArrowRight className="h-4 w-4" aria-hidden /></span></Link> : <p className="text-sm text-slate-500">Choose what you&apos;re building — it points you to a page; it isn&apos;t an automatic classifier.</p>}
      </div>
    </div>
  );
}

/* ───────── preview ───────── */

export function Preview({ rows }: { rows: IndRow[] }) {
  const [i, setI] = useState(0);
  const r = rows[i];
  return (
    <div>
      <div role="tablist" aria-label="Industry preview" className="flex gap-2 overflow-x-auto pb-1">{rows.map((x, k) => <button key={x.slug} role="tab" type="button" aria-selected={i === k} onClick={() => setI(k)} className={cn(chip(i === k, true), "shrink-0")}>{x.name}</button>)}</div>
      <div key={r.slug} data-in="true" className="fade-in mt-4 grid gap-px border border-slate-600 bg-slate-600 md:grid-cols-2 lg:grid-cols-5">
        {[["Typical projects", r.useCases.slice(0, 3)], ["Documentation requirements", [r.docReq]], ["Software", r.software.map((s) => s.name)], ["Deliverables", r.deliverables.slice(0, 3)], ["Related services", r.services.map((s) => s.name)]].map(([t, l]) => (
          <div key={t as string} className="bg-[#0F1B30] p-4"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">{t as string}</p><ul className="mt-2 space-y-1.5 text-xs leading-snug text-slate-200">{(l as string[]).map((x) => <li key={x}>• {x}</li>)}</ul></div>
        ))}
      </div>
      <Link href={href(r)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:text-copper-400 hover:underline">Explore {r.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
    </div>
  );
}

/* ───────── workflow ───────── */

export function Workflow({ rows }: { rows: IndRow[] }) {
  const [i, setI] = useState(0);
  const r = rows[i];
  const base = ["Project requirement", "Engineering / design input", "CAD / BIM", "Documentation"];
  return (
    <div>
      <div role="group" aria-label="Industry" className="mb-4 flex gap-2 overflow-x-auto pb-1">{rows.map((x, k) => <button key={x.slug} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn(chip(i === k), "shrink-0")}>{x.name}</button>)}</div>
      <ol className="grid gap-2 md:grid-cols-5 md:gap-0">
        {[...base, r.finalStage].map((s, k) => (
          <li key={k === 4 ? r.slug : s} className="relative md:pr-4">
            <div className={cn("h-full border px-4 py-5 text-sm font-semibold transition-colors", k === 4 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-900")}><span className="mb-1 block font-mono text-[10px] opacity-60">{String(k + 1).padStart(2, "0")}</span>{k === 4 ? <span className="fade-in" data-in="true">{s}</span> : s}</div>
            {k < 4 ? <span aria-hidden className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 bg-[#F8F7F4] px-1 text-copper-500 md:-right-0 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0">→</span> : null}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-slate-500">The final stage is a descriptive label, not an exhaustive service claim.</p>
    </div>
  );
}

/* ───────── software ecosystem ───────── */

export function SoftwareEco({ rows, software }: { rows: IndRow[]; software: { slug: string; name: string }[] }) {
  const [sw, setSw] = useState<string | null>(null);
  const has = (r: IndRow, s: string) => r.software.some((x) => x.slug === s);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_1fr]">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">{software.map((s) => <li key={s.slug}><button type="button" aria-pressed={sw === s.slug} onPointerEnter={() => setSw(s.slug)} onPointerLeave={() => setSw(null)} onFocus={() => setSw(s.slug)} onBlur={() => setSw(null)} onClick={() => setSw(sw === s.slug ? null : s.slug)} className={cn(chip(sw === s.slug, true), "w-full")}>{s.name}</button></li>)}</ul>
      <ul className="grid grid-cols-2 gap-2">{rows.map((r) => { const on = sw ? has(r, sw) : false; return <li key={r.slug} className={cn("border px-3 py-2.5 text-sm transition-colors", sw ? (on ? "border-sky-300 bg-sky-300/10 text-white" : "border-slate-700 text-slate-500") : "border-slate-600 text-slate-200")}>{r.name}</li>; })}</ul>
      <p className="text-xs text-slate-400 lg:col-span-2">Highlights follow the software listed on each industry page — it&apos;s a capability view, not a software directory.</p>
    </div>
  );
}
