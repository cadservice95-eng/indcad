"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { chip } from "@/components/arch/ui";
import { ServiceVisual, STAGES, Hub } from "./visuals";
import { FAMILIES, ALL, CHOICES, INPUTS, OUTPUTS, outputsOf, type Family } from "./config";

const mono = { fontFamily: "var(--font-mono)" } as const;
const CX = 380, CY = 255, RX = 290, RY = 190;

/* ───────── hero network ───────── */
export function ServiceNetwork() {
  const [act, setAct] = useState<string | null>(null);
  const a = FAMILIES.find((f) => f.slug === act) ?? null;
  const pos = FAMILIES.map((_, k) => { const t = ((-90 + k * 45) * Math.PI) / 180; return [CX + Math.cos(t) * RX, CY + Math.sin(t) * RY] as const; });
  const ai = a ? FAMILIES.indexOf(a) : -1;
  return (
    <div data-in="true">
      <div className="hidden md:block">
        <svg viewBox="0 0 760 510" className="block h-auto w-full" fill="none" role="group" aria-label="Service network: eight service families connected to Render CAD Hub">
          <defs><pattern id="sn-g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" stroke="#7DD3FC" strokeOpacity="0.07" /></pattern></defs>
          <rect width="760" height="510" fill="url(#sn-g)" />
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY} stroke="#38BDF8" strokeOpacity="0.12" strokeDasharray="2 6" />
          {FAMILIES.map((f, k) => <path key={f.slug} d={`M${CX} ${CY}L${pos[k][0]} ${pos[k][1]}`} pathLength={1} stroke="#38BDF8" strokeWidth={act === f.slug ? 2.2 : 1} strokeOpacity={act ? (act === f.slug ? 1 : 0.16) : 0.5} className="draw" style={{ "--d": `${900 + k * 110}ms`, "--t": "0.9s" } as React.CSSProperties} />)}
          <g className="fade-in" style={{ "--d": "250ms" } as React.CSSProperties}>
            <rect x={CX - 66} y={CY - 46} width="132" height="92" fill="#0B1B33" stroke="#60A5FA" strokeWidth="2" />
            <g transform={`translate(${CX} ${CY - 12})`} className="draw"><Hub /></g>
            <text x={CX} y={CY + 30} textAnchor="middle" fontSize="11" fill="#fff" style={mono}>RENDER CAD HUB</text>
          </g>
          {FAMILIES.map((f, k) => {
            const [x, y] = pos[k], on = act === f.slug;
            return (
              <g key={f.slug} className="fade-in" style={{ "--d": `${1000 + k * 110}ms`, cursor: "pointer", outline: "none" } as React.CSSProperties} role="button" tabIndex={0} aria-pressed={on} aria-label={`${f.name}: ${f.services.map((s) => s.name).join(", ")}`} onPointerEnter={() => setAct(f.slug)} onFocus={() => setAct(f.slug)} onClick={() => setAct(f.slug)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setAct(f.slug); } }}>
                <g opacity={act && !on ? 0.4 : 1} style={{ transition: "opacity .3s" }}>
                  <rect x={x - 70} y={y - 25} width="140" height="50" fill="#0B1B33" stroke={on ? "#7DD3FC" : "#38BDF8"} strokeOpacity={on ? 1 : 0.5} strokeWidth={on ? 2 : 1} />
                  <text x={x} y={y - 3} textAnchor="middle" fontSize="11" fill="#fff" style={mono}>{f.name.toUpperCase()}</text>
                  <text x={x} y={y + 13} textAnchor="middle" fontSize="9" fill="#94A3B8" style={mono}>{f.services.length} {f.services.length > 1 ? "SERVICES" : "SERVICE"}</text>
                </g>
              </g>
            );
          })}
          {a ? a.services.map((s, j) => {
            const [x, y] = pos[ai];
            const t = 0.56, bx = CX + (x - CX) * t, by = CY + (y - CY) * t;
            const off = (j - (a.services.length - 1) / 2) * 30;
            return (
              <g key={s.slug} className="fade-in" data-in="true">
                <circle cx={bx} cy={by + off} r="3.5" fill="#F59E0B" />
                <rect x={bx + 8} y={by + off - 10} width={s.name.length * 6.4 + 12} height="20" fill="#0B1B33" stroke="#F59E0B" strokeOpacity="0.7" />
                <text x={bx + 14} y={by + off + 4} fontSize="10" fill="#FDE68A" style={mono}>{s.name}</text>
              </g>
            );
          }) : null}
        </svg>
        <div aria-live="polite" className="mt-3 min-h-[76px] border border-sky-300/25 bg-[#0B1B33] px-4 py-3">
          {a ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">{a.name}</p><ul className="mt-1 flex flex-wrap gap-2">{a.services.map((s) => <li key={s.slug}><Link href={s.href} className="border border-slate-600 px-2 py-0.5 font-mono text-[11px] text-slate-100 hover:border-sky-300 hover:text-white">{s.name}</Link></li>)}</ul></div>
              <Link href={a.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:text-copper-400 hover:underline">All {a.name} services <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          ) : <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">Hover or select a service family to see its services</p>}
        </div>
      </div>
      <ul className="space-y-2 md:hidden">
        {FAMILIES.map((f) => (
          <li key={f.slug} className="border border-sky-300/25 bg-[#0B1B33]">
            <button type="button" aria-expanded={act === f.slug} onClick={() => setAct(act === f.slug ? null : f.slug)} className="flex min-h-[48px] w-full items-center justify-between px-4 py-3 text-left"><span className="text-sm font-semibold text-white">{f.name}</span><span aria-hidden className="font-mono text-slate-400">{act === f.slug ? "−" : "+"}</span></button>
            {act === f.slug ? <ul className="space-y-1 border-t border-slate-700 px-4 py-3">{f.services.map((s) => <li key={s.slug}><Link href={s.href} className="block py-1.5 text-sm text-slate-100 underline-offset-4 hover:underline">{s.name} →</Link></li>)}</ul> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────── explorer ───────── */
export function Explorer() {
  const [fi, setFi] = useState(0);
  const [stage, setStage] = useState(0);
  const [play, setPlay] = useState(false);
  const f: Family = FAMILIES[fi];
  const stages = STAGES[f.slug];
  const pick = (k: number) => { setFi(k); setStage(0); setPlay(false); };
  useEffect(() => {
    if (!play) return;
    const n = STAGES[FAMILIES[fi].slug].length;
    const id = setInterval(() => setStage((s) => { if (s >= n - 1) { setPlay(false); return s; } return s + 1; }), 1700);
    return () => clearInterval(id);
  }, [play, fi]);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[230px_1fr]">
      <div role="tablist" aria-label="Service family" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {FAMILIES.map((x, k) => <button key={x.slug} role="tab" type="button" aria-selected={fi === k} aria-controls="svc-panel" onClick={() => pick(k)} onKeyDown={(e) => { const n = FAMILIES.length; if (e.key === "ArrowDown" || e.key === "ArrowRight") pick((k + 1) % n); if (e.key === "ArrowUp" || e.key === "ArrowLeft") pick((k + n - 1) % n); }} className={cn(chip(fi === k), "shrink-0 text-left")}>{String(k + 1).padStart(2, "0")} · {x.name}</button>)}
      </div>
      <div id="svc-panel" role="tabpanel" key={f.slug} data-in="true" className="fade-in grid gap-px overflow-hidden border border-slate-300 bg-slate-300 xl:grid-cols-[1.25fr_1fr]">
        <div className="bg-[#0B1B33]">
          <ServiceVisual cat={f.slug} stage={stage} label={`${f.name} technical workflow, stage ${stage + 1}: ${stages[stage]}`} />
          <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-700 p-3">
            <button type="button" onClick={() => { if (!play && stage >= stages.length - 1) setStage(0); setPlay(!play); }} className="inline-flex min-h-[36px] items-center gap-1.5 border border-slate-600 px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-white hover:border-sky-300">{play ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}{play ? "Pause" : "Play"}</button>
            {stages.map((s, k) => <button key={s} type="button" aria-pressed={stage === k} onClick={() => { setStage(k); setPlay(false); }} className={cn("min-h-[36px] border px-2.5 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors", stage === k ? "border-sky-300 bg-sky-300/15 text-white" : "border-slate-700 text-slate-400 hover:text-white")}>{k + 1}. {s}</button>)}
          </div>
        </div>
        <div className="bg-white p-6">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{f.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
          <ul className="mt-5 space-y-3">
            {f.services.map((s) => (
              <li key={s.slug} className="border border-slate-200 p-4">
                <h4 className="text-base font-semibold text-slate-900">{s.name}</h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                <Link href={s.href} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 underline-offset-4 hover:underline">Explore {s.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              </li>
            ))}
          </ul>
          <Link href={f.href} className="mt-4 inline-block text-sm font-medium text-slate-600 underline underline-offset-4 hover:text-slate-900">All {f.name} services</Link>
        </div>
      </div>
    </div>
  );
}

/* ───────── which service ───────── */
export function Decide() {
  const [i, setI] = useState<number | null>(null);
  const c = i === null ? null : CHOICES[i];
  return (
    <div>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {CHOICES.map((x, k) => <li key={x.q}><button type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn("block min-h-[56px] w-full border px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.02em] transition-colors", i === k ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-900 hover:border-slate-900")}>{x.q}</button></li>)}
      </ul>
      <div aria-live="polite" className="mt-4 min-h-[72px] border border-slate-300 bg-white px-5 py-4">
        {c ? (
          <div>
            <ul className="flex flex-wrap gap-3">{c.to.map((s) => { const v = ALL.find((x) => x.slug === s)!; return <li key={s}><Link href={v.href} className="inline-flex items-center gap-1.5 text-base font-semibold text-blue-700 underline-offset-4 hover:underline">→ {v.name}<ArrowRight className="h-4 w-4" aria-hidden /></Link></li>; })}</ul>
            {c.note ? <p className="mt-2 text-sm text-slate-500">{c.note}</p> : null}
          </div>
        ) : <p className="text-sm text-slate-500">Choose what describes your project. This points you to a page — it doesn&apos;t diagnose the project.</p>}
      </div>
    </div>
  );
}

/* ───────── input → output ───────── */
export function InputOutput() {
  const [i, setI] = useState(0);
  const inp = INPUTS[i];
  const outs = outputsOf(inp.to);
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[200px_1fr_230px]">
      <div role="group" aria-label="What you have" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">{INPUTS.map((x, k) => <button key={x.l} type="button" aria-pressed={i === k} onClick={() => setI(k)} className={cn(chip(i === k, true), "shrink-0 text-left")}>{x.l}</button>)}</div>
      <div key={inp.l} data-in="true" className="fade-in border border-slate-600 bg-[#0F1B30] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sky-300">Possible service paths from “{inp.l}”</p>
        <ul className="mt-3 space-y-2">{inp.to.map((s) => { const v = ALL.find((x) => x.slug === s)!; return <li key={s} className="flex items-center justify-between gap-3 border border-sky-300/40 bg-sky-300/5 px-4 py-3"><Link href={v.href} className="text-sm font-semibold text-white underline-offset-4 hover:underline">{v.name}</Link><span aria-hidden className="text-copper-400">→</span></li>; })}</ul>
        <p className="mt-3 text-xs text-slate-400">Illustrative paths — a project may need only one of these.</p>
      </div>
      <ul className="space-y-1.5" aria-label="Possible outputs">{OUTPUTS.map((o) => { const on = outs.includes(o); return <li key={o} className={cn("border px-3 py-2 text-sm transition-colors duration-300", on ? "border-amber-300 bg-amber-300/10 text-white" : "border-slate-700 text-slate-500")}>{o}</li>; })}</ul>
    </div>
  );
}
