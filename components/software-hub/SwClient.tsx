"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { chip } from "@/components/arch/ui";
import { PlatformVisual, PSTAGES } from "./visuals";
import { PLATFORMS, GROUPS, CATEGORIES, HERO_CYCLE, NATIVE, type Platform } from "./config";

const mono = { fontFamily: "var(--font-mono)" } as const;
const P = (slug: string) => PLATFORMS.find((p) => p.slug === slug)!;

function useReduced() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setR(m.matches);
    f(); m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return r;
}

/* ───────── hero workspace ───────── */
export function Workspace() {
  const reduced = useReduced();
  const [{ k, st }, set] = useState({ k: 0, st: 99 });
  const [run, setRun] = useState(true);
  const p = P(HERO_CYCLE[k]);
  const n = PSTAGES[p.slug].length;
  const live = run && !reduced;
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => set((v) => {
      const len = PSTAGES[HERO_CYCLE[v.k]].length;
      return v.st >= len + 1 ? { k: (v.k + 1) % HERO_CYCLE.length, st: 0 } : { k: v.k, st: v.st + 1 };
    }), 900);
    return () => clearInterval(id);
  }, [live]);
  const stage = Math.min(live ? st : n - 1, n - 1);
  return (
    <div data-in="true" className="border border-slate-700 bg-[#0B1220] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-slate-700 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
        <span>Project / Model / Drawing</span>
        <button type="button" onClick={() => setRun(!run)} aria-label={run ? "Pause platform preview" : "Play platform preview"} className="inline-flex min-h-[28px] items-center gap-1 border border-slate-700 px-2 text-slate-300 hover:border-sky-300 hover:text-white">{run ? <Pause className="h-3 w-3" aria-hidden /> : <Play className="h-3 w-3" aria-hidden />}{run ? "Pause" : "Play"}</button>
      </div>
      <div className="grid sm:grid-cols-[140px_1fr]">
        <ul className="flex overflow-x-auto border-b border-slate-700 sm:block sm:overflow-visible sm:border-b-0 sm:border-r sm:py-2" aria-label="Platform">
          {HERO_CYCLE.map((s, i) => <li key={s}><button type="button" aria-pressed={i === k} onClick={() => set({ k: i, st: 0 })} className={cn("block w-full whitespace-nowrap px-3 py-2 text-left sm:py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors", i === k ? "bg-blue-600/25 text-white" : "text-slate-400 hover:text-white")}>{P(s).name}</button></li>)}
          <li className="hidden px-3 pt-2 font-mono sm:block text-[9px] uppercase text-slate-500">+ {PLATFORMS.length - HERO_CYCLE.length} more</li>
        </ul>
        <div key={p.slug} className="fade-in min-w-0" data-in="true"><PlatformVisual slug={p.slug} stage={stage} label={`${p.name} workspace preview: ${PSTAGES[p.slug][stage]}`} /></div>
      </div>
      <dl aria-live="polite" className="grid grid-cols-3 border-t border-slate-700 font-mono text-[10px] uppercase tracking-[0.1em]">
        {[["Platform", p.name], ["Workflow", p.workflow], ["Output", p.output]].map(([a, b]) => <div key={a} className="border-r border-slate-700 px-3 py-2 last:border-r-0"><dt className="text-slate-500">{a}</dt><dd className="mt-0.5 truncate text-sky-200" title={b}>{b}</dd></div>)}
      </dl>
    </div>
  );
}

/* ───────── ecosystem tree ───────── */
const CX = 360, CYY = 250;
export function Ecosystem() {
  const [act, setAct] = useState("revit");
  const a = P(act);
  const order = GROUPS.flatMap((g) => PLATFORMS.filter((p) => p.group === g));
  const ang = (i: number) => ((-90 + i * 36) * Math.PI) / 180;
  const pos = (i: number, rx: number, ry: number) => [CX + Math.cos(ang(i)) * rx, CYY + Math.sin(ang(i)) * ry] as const;
  const gpos = GROUPS.map((g) => { const idx = order.map((p, i) => (p.group === g ? i : -1)).filter((i) => i >= 0); const m = idx.reduce((x, y) => x + y, 0) / idx.length; return pos(m, 150, 105); });
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
      <div className="hidden md:block">
        <svg viewBox="0 0 720 500" className="block h-auto w-full" role="group" aria-label="Platform ecosystem: ten platforms grouped by capability">
          {GROUPS.map((g, gi) => <path key={g} d={`M${CX} ${CYY}L${gpos[gi][0]} ${gpos[gi][1]}`} stroke="#38BDF8" strokeOpacity={a.group === g ? 0.9 : 0.25} strokeWidth={a.group === g ? 2 : 1} />)}
          {order.map((p, i) => { const gi = GROUPS.indexOf(p.group as (typeof GROUPS)[number]); const [x, y] = pos(i, 290, 205); return <path key={p.slug} d={`M${gpos[gi][0]} ${gpos[gi][1]}L${x} ${y}`} stroke="#38BDF8" strokeOpacity={act === p.slug ? 1 : 0.2} strokeWidth={act === p.slug ? 2 : 1} strokeDasharray={act === p.slug ? undefined : "3 4"} />; })}
          <g><circle cx={CX} cy={CYY} r="46" fill="#101A2E" stroke="#2563EB" strokeWidth="2" /><text x={CX} y={CYY - 3} textAnchor="middle" fontSize="11" fill="#fff" style={mono}>RENDER</text><text x={CX} y={CYY + 12} textAnchor="middle" fontSize="11" fill="#fff" style={mono}>CAD HUB</text></g>
          {GROUPS.map((g, gi) => <g key={g}><circle cx={gpos[gi][0]} cy={gpos[gi][1]} r="5" fill={a.group === g ? "#38BDF8" : "#475569"} /><text x={gpos[gi][0]} y={gpos[gi][1] + (gpos[gi][1] > CYY ? 18 : -10)} textAnchor="middle" fontSize="9" fill={a.group === g ? "#7DD3FC" : "#94A3B8"} style={mono}>{g.toUpperCase()}</text></g>)}
          {order.map((p, i) => {
            const [x, y] = pos(i, 290, 205), on = act === p.slug, w = p.name.length * 7 + 22;
            return (
              <g key={p.slug} role="button" tabIndex={0} aria-pressed={on} aria-label={`${p.name}: ${p.chain.join(", then ")}`} style={{ cursor: "pointer", outline: "none" }} onClick={() => setAct(p.slug)} onPointerEnter={() => setAct(p.slug)} onFocus={() => setAct(p.slug)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setAct(p.slug); } }}>
                <rect x={x - w / 2} y={y - 14} width={w} height="28" fill={on ? "#2563EB" : "#101A2E"} stroke={on ? "#7DD3FC" : "#334155"} />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill="#fff" style={mono}>{p.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="md:hidden">
        {GROUPS.map((g) => <div key={g} className="mb-3"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">{g}</p><div className="mt-1.5 flex flex-wrap gap-2">{PLATFORMS.filter((p) => p.group === g).map((p) => <button key={p.slug} type="button" aria-pressed={act === p.slug} onClick={() => setAct(p.slug)} className={chip(act === p.slug, true)}>{p.name}</button>)}</div></div>)}
      </div>
      <div key={a.slug} data-in="true" className="fade-in self-center border border-slate-700 bg-[#101A2E] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky-300">{a.group === a.category ? a.group : `${a.group} · ${a.category}`}</p>
        <h3 className="mt-1 text-xl font-semibold text-white">{a.name}</h3>
        <ol className="mt-4">
          {a.chain.map((c, i) => <li key={c}><div className={cn("border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.06em]", i === a.chain.length - 1 ? "border-sky-300 bg-sky-300/10 text-white" : "border-slate-600 text-slate-200")}>{c}</div>{i < a.chain.length - 1 ? <span aria-hidden className="block py-0.5 pl-4 text-copper-400">↓</span> : null}</li>)}
        </ol>
        <p className="mt-3 text-xs text-slate-400">A conceptual workflow — not every project follows this exact sequence.</p>
        <Link href={a.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:text-copper-400 hover:underline">Explore {a.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </div>
  );
}

/* ───────── explorer ───────── */
export function Explorer() {
  const [i, setI] = useState(0);
  const [stage, setStage] = useState(99);
  const [play, setPlay] = useState(false);
  const p = PLATFORMS[i];
  const stages = PSTAGES[p.slug];
  const s = Math.min(stage, stages.length - 1);
  const pick = (k: number) => { setI(k); setStage(99); setPlay(false); };
  useEffect(() => {
    if (!play) return;
    const n = PSTAGES[PLATFORMS[i].slug].length;
    const id = setInterval(() => setStage((x) => { if (x >= n - 1) { setPlay(false); return x; } return x + 1; }), 1300);
    return () => clearInterval(id);
  }, [play, i]);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[220px_1fr]">
      <div role="tablist" aria-label="Platform" aria-orientation="vertical" className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-1">
        {PLATFORMS.map((x, k) => <button key={x.slug} role="tab" type="button" aria-selected={i === k} aria-controls="sw-panel" onClick={() => pick(k)} onKeyDown={(e) => { const n = PLATFORMS.length; if (e.key === "ArrowDown" || e.key === "ArrowRight") pick((k + 1) % n); if (e.key === "ArrowUp" || e.key === "ArrowLeft") pick((k + n - 1) % n); }} className={cn(chip(i === k), "text-left")}>{x.name}</button>)}
      </div>
      <div id="sw-panel" role="tabpanel" key={p.slug} data-in="true" className="fade-in grid gap-px overflow-hidden border border-slate-300 bg-slate-300 xl:grid-cols-[1.3fr_1fr]">
        <div className="bg-[#101A2E]">
          <div className="flex flex-wrap gap-x-5 gap-y-1 border-b border-slate-700 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400"><span>Platform: <b className="font-normal text-sky-200">{p.name}</b></span><span>Discipline: <b className="font-normal text-sky-200">{p.category}</b></span><span>Workflow: <b className="font-normal text-sky-200">{p.workflow}</b></span></div>
          <PlatformVisual slug={p.slug} stage={s} label={`${p.name} technical workflow, stage ${s + 1}: ${stages[s]}`} />
          <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-700 p-3">
            <button type="button" onClick={() => { if (!play && s >= stages.length - 1) setStage(0); setPlay(!play); }} className="inline-flex min-h-[36px] items-center gap-1.5 border border-slate-600 px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-white hover:border-sky-300">{play ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}{play ? "Pause" : "Play"}</button>
            {stages.map((x, k) => <button key={x} type="button" aria-pressed={s === k} onClick={() => { setStage(k); setPlay(false); }} className={cn("min-h-[36px] border px-2.5 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors", s === k ? "border-sky-300 bg-sky-300/15 text-white" : "border-slate-700 text-slate-400 hover:text-white")}>{k + 1}. {x}</button>)}
          </div>
        </div>
        <div className="bg-white p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue-700">{p.category}</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{p.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.summary}</p>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Related capabilities</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">{p.services.map((x) => <li key={x.href}><Link href={x.href} className="inline-block border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:border-slate-900 hover:text-slate-900">{x.name}</Link></li>)}</ul>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Typical output</p>
          <p className="mt-1 text-sm text-slate-700">{p.output}</p>
          <Link href={p.href} className="mt-6 inline-flex items-center gap-1.5 bg-copper-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-copper-600">Explore {p.name} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </div>
    </div>
  );
}

/* ───────── filtered card grid ───────── */
const WIDE = new Set(["autocad", "civil-3d"]);
export function Grid() {
  const [cat, setCat] = useState<string | null>(null);
  const list = cat ? PLATFORMS.filter((p) => p.category === cat) : PLATFORMS;
  return (
    <div data-in="true">
      <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <button type="button" aria-pressed={cat === null} onClick={() => setCat(null)} className={cn(chip(cat === null), "shrink-0")}>All platforms</button>
        {CATEGORIES.map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cn(chip(cat === c), "shrink-0")}>{c}</button>)}
      </div>
      <p className="sr-only" aria-live="polite">{list.length} platforms shown</p>
      <ul key={cat ?? "all"} data-in="true" className="fade-in mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => <Card key={p.slug} p={p} wide={!cat && WIDE.has(p.slug)} />)}
      </ul>
    </div>
  );
}
function Card({ p, wide }: { p: Platform; wide: boolean }) {
  const n = PSTAGES[p.slug].length;
  return (
    <li className={cn(wide && "lg:col-span-2")}>
      <Link href={p.href} className={cn("group flex h-full flex-col overflow-hidden border border-slate-300 bg-white transition-colors hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600", wide && "lg:flex-row")}>
        <div className={cn("bg-[#101A2E]", wide && "lg:flex lg:w-[58%] lg:shrink-0 lg:items-center")}><PlatformVisual slug={p.slug} stage={Math.max(0, n - 2)} label={`${p.name} technical illustration`} /></div>
        <div className="flex flex-1 flex-col p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue-700">{p.category}</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">{p.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.summary}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">{p.tags.map((t) => <li key={t} className="border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-slate-600">{t}</li>)}</ul>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-blue-700">Explore {p.name} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></span>
        </div>
      </Link>
    </li>
  );
}

/* ───────── platform → service matrix ───────── */
export function Matrix() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <div className="hidden overflow-hidden border border-slate-300 bg-white md:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Platforms and the Render CAD Hub services they relate to</caption>
          <thead><tr className="border-b border-slate-300 bg-slate-50 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500"><th scope="col" className="px-4 py-3 font-normal">Platform</th><th scope="col" className="px-4 py-3 font-normal">Related services</th><th scope="col" className="px-4 py-3 font-normal">Related industries</th></tr></thead>
          <tbody>
            {PLATFORMS.map((p) => (
              <tr key={p.slug} className="border-b border-slate-100 align-top transition-colors hover:bg-blue-50/50">
                <th scope="row" className="px-4 py-3"><Link href={p.href} className="font-semibold text-slate-900 underline-offset-4 hover:underline">{p.name}</Link><span className="block font-mono text-[10px] font-normal uppercase tracking-[0.08em] text-slate-500">{p.category}</span></th>
                <td className="px-4 py-3"><ul className="flex flex-wrap gap-x-3 gap-y-1">{p.services.map((s) => <li key={s.href}><Link href={s.href} className="text-blue-700 underline-offset-4 hover:underline">{s.name}</Link></li>)}</ul></td>
                <td className="px-4 py-3"><ul className="flex flex-wrap gap-x-3 gap-y-1 text-slate-600">{p.industries.map((s) => <li key={s.href}><Link href={s.href} className="underline-offset-4 hover:text-slate-900 hover:underline">{s.name}</Link></li>)}</ul></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-2 md:hidden">
        {PLATFORMS.map((p) => (
          <li key={p.slug} className="border border-slate-300 bg-white">
            <button type="button" aria-expanded={open === p.slug} onClick={() => setOpen(open === p.slug ? null : p.slug)} className="flex min-h-[52px] w-full items-center justify-between px-4 py-3 text-left"><span><span className="block text-sm font-semibold text-slate-900">{p.name}</span><span className="font-mono text-[10px] uppercase text-slate-500">{p.category}</span></span><span aria-hidden className="font-mono text-slate-500">{open === p.slug ? "−" : "+"}</span></button>
            {open === p.slug ? <div className="border-t border-slate-200 px-4 py-3 text-sm"><p className="font-mono text-[10px] uppercase text-slate-500">Services</p><ul className="mt-1 space-y-1">{p.services.map((s) => <li key={s.href}><Link href={s.href} className="text-blue-700 underline underline-offset-4">{s.name}</Link></li>)}</ul><p className="mt-3 font-mono text-[10px] uppercase text-slate-500">Industries</p><p className="mt-1 text-slate-600">{p.industries.map((s) => s.name).join(" · ")}</p><Link href={p.href} className="mt-3 inline-block font-semibold text-slate-900 underline underline-offset-4">Explore {p.name} →</Link></div> : null}
          </li>
        ))}
      </ul>
    </>
  );
}

/* ───────── native workflow (travelling file) ───────── */
export function NativeFlow() {
  const reduced = useReduced();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setK((x) => (x + 1) % NATIVE.length), 1400);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <ol className="grid gap-2 md:grid-cols-6 md:gap-0">
      {NATIVE.map((s, i) => {
        const on = reduced || i <= k, here = !reduced && i === k;
        return (
          <li key={s} className="relative md:pr-3">
            <div className={cn("relative h-full border px-3 py-5 transition-colors duration-500", here ? "border-sky-300 bg-sky-300/10" : on ? "border-slate-500 bg-[#101A2E]" : "border-slate-700 bg-[#0B1220]")}>
              <span className="block font-mono text-[10px] text-slate-500">{String(i + 1).padStart(2, "0")}</span>
              <span className={cn("mt-1 block text-sm font-semibold", on ? "text-white" : "text-slate-500", i === 2 && "text-sky-300")}>{s}</span>
              {here ? <span aria-hidden className="absolute right-2 top-2 inline-flex h-6 w-5 items-end justify-center border border-sky-300 bg-[#0B1220] pb-0.5 font-mono text-[6px] text-sky-200">FILE</span> : null}
            </div>
            {i < NATIVE.length - 1 ? <span aria-hidden className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 bg-[#111827] px-1 text-copper-400 md:-right-0 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0">→</span> : null}
          </li>
        );
      })}
    </ol>
  );
}
