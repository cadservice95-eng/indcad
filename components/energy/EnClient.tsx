"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { E, T, Fade, ln, SitePlan, SiteSvg, LAYER_NAME, type Layer, type Hot } from "./EnergySite";

const tab = (on: boolean, light?: boolean) =>
  cn("min-h-[40px] shrink-0 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400",
    light ? (on ? "border-[#0B0F1A] bg-[#0B0F1A] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-900")
      : (on ? "border-yellow-400 bg-yellow-400/10 text-white" : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"));
function Tabs({ items, i, set, label, light }: { items: readonly string[]; i: number; set: (k: number) => void; label: string; light?: boolean }) {
  return (
    <div role="tablist" aria-label={label} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      {items.map((x, k) => <button key={x} role="tab" type="button" aria-selected={i === k} onClick={() => set(k)} onKeyDown={(e) => { if (e.key === "ArrowRight") set((k + 1) % items.length); if (e.key === "ArrowLeft") set((k + items.length - 1) % items.length); }} className={tab(i === k, light)}>{x}</button>)}
    </div>
  );
}
function useReduced() {
  const [r, setR] = useState(false);
  useEffect(() => { const m = window.matchMedia("(prefers-reduced-motion: reduce)"); const f = () => setR(m.matches); f(); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  return r;
}
const Frame = ({ children, light }: { children: React.ReactNode; light?: boolean }) => <div className={cn("overflow-hidden border", light ? "border-slate-300 bg-[#F7F7F4]" : "border-slate-700 bg-[#0B0F1A]")}>{children}</div>;
const MAXW = "mx-auto block h-auto w-full max-w-[860px]";

/* ───────── hero site with layers ───────── */
const HL: Layer[] = ["civil", "structural", "electrical", "site", "docs"];
export function HeroSite() {
  const [f, setF] = useState<Layer | null>(null);
  return (
    <div className="border border-slate-700 bg-[#0B0F1A]">
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><span>Site plan · {f ? LAYER_NAME[f] : "All disciplines"}</span><span className="text-yellow-300/80">Illustrative energy site</span></div>
      <SiteSvg label={`Illustrative energy site plan${f ? ` — ${LAYER_NAME[f]} layer` : ""}`}><SitePlan focus={f ? [f] : null} /></SiteSvg>
      <div className="border-t border-slate-800 p-2.5">
        <div role="group" aria-label="Site layer" className="-mx-1 hidden gap-1.5 overflow-x-auto px-1 pb-1 md:flex">
          <button type="button" aria-pressed={f === null} onClick={() => setF(null)} className={tab(f === null)}>All</button>
          {HL.map((l) => <button key={l} type="button" aria-pressed={f === l} onClick={() => setF(f === l ? null : l)} className={tab(f === l)}>{LAYER_NAME[l]}</button>)}
        </div>
        <label className="block md:hidden"><span className="sr-only">Select site layer</span><select value={f ?? ""} onChange={(e) => setF((e.target.value || null) as Layer | null)} className="min-h-[44px] w-full border border-slate-600 bg-[#121829] px-3 font-mono text-[12px] uppercase text-white"><option value="">All disciplines</option>{HL.map((l) => <option key={l} value={l}>{LAYER_NAME[l]}</option>)}</select></label>
      </div>
    </div>
  );
}

/* ───────── three disciplines → coordinated site ───────── */
export function Combined() {
  const [merged, setMerged] = useState(false);
  const P = [{ l: "Civil", s: "Site plan", f: ["site", "civil"] as Layer[], c: "text-[#D6B370]" }, { l: "Structural", s: "Foundation / support", f: ["structural"] as Layer[], c: "text-sky-300" }, { l: "Electrical", s: "Single-line / equipment connection", f: ["electrical"] as Layer[], c: "text-yellow-300" }];
  return (
    <div>
      <div className={cn("grid gap-3 transition-all duration-700", merged ? "md:grid-cols-1" : "md:grid-cols-3")}>
        {merged ? (
          <Frame><SiteSvg label="Coordinated energy site — all three disciplines" className={MAXW}><SitePlan /><T x="20" y="390" c={E.ok} size={10}>COORDINATED ENERGY SITE</T></SiteSvg></Frame>
        ) : P.map((p) => (
          <figure key={p.l} className="overflow-hidden border border-slate-700 bg-[#0B0F1A]">
            <SiteSvg label={`${p.l} documentation layer`}><SitePlan show={p.f} /></SiteSvg>
            <figcaption className="border-t border-slate-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em]"><span className={p.c}>{p.l}</span> <span className="text-slate-400">· {p.s}</span></figcaption>
          </figure>
        ))}
      </div>
      <button type="button" aria-pressed={merged} onClick={() => setMerged(!merged)} className={cn(tab(merged), "mt-4")}>{merged ? "↺ Separate disciplines" : "Merge into coordinated site →"}</button>
    </div>
  );
}

/* ───────── renewable layer explorer (build-up) ───────── */
const BUILD: { s: string; show: Layer[]; phase?: number }[] = [
  { s: "Site boundary", show: ["site"] },
  { s: "Civil layout", show: ["site", "civil"] },
  { s: "Foundations", show: ["site", "civil"], phase: 3 },
  { s: "Solar / wind infrastructure", show: ["site", "civil", "structural"] },
  { s: "Electrical collection", show: ["site", "civil", "structural", "electrical"] },
  { s: "Interconnection", show: ["site", "civil", "structural", "electrical", "docs"] },
];
export function RenewableExplorer() {
  const reduced = useReduced();
  const [i, setI] = useState(0);
  const [run, setRun] = useState(true);
  useEffect(() => { if (reduced || !run) return; const id = setInterval(() => setI((x) => (x + 1) % BUILD.length), 1500); return () => clearInterval(id); }, [reduced, run]);
  const [tog, setTog] = useState<Record<string, boolean>>({ site: true, civil: true, structural: true, electrical: true });
  const manual = !run || reduced;
  const show = manual ? (Object.keys(tog).filter((k) => tog[k]) as Layer[]) : BUILD[i].show;
  return (
    <div>
      <Frame><SiteSvg label={`Renewable site coordination — ${manual ? "selected layers" : BUILD[i].s}`} className={MAXW}><SitePlan show={show} hot={!manual && i === 5 ? "interconnection" : null} /><T x="20" y="24" c={E.ink} size={10}>{manual ? "LAYERS" : `${String(i + 1).padStart(2, "0")} · ${BUILD[i].s.toUpperCase()}`}</T></SiteSvg></Frame>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setRun(!run)} className={tab(run && !reduced)}>{run && !reduced ? "Pause build-up" : "Play build-up"}</button>
        <span aria-hidden className="mx-1 text-slate-600">|</span>
        {(["site", "civil", "structural", "electrical"] as const).map((k) => <button key={k} type="button" aria-pressed={tog[k]} onClick={() => { setRun(false); setTog({ ...tog, [k]: !tog[k] }); }} className={tab(manual && tog[k])}>{manual && tog[k] ? "✓ " : ""}{LAYER_NAME[k]}</button>)}
      </div>
    </div>
  );
}

/* ───────── solar section (cropped view) ───────── */
export function SolarView() {
  const [i, setI] = useState(0);
  const F: Layer[][] = [["civil", "site"], ["structural"], ["electrical"]];
  return (
    <div>
      <Frame><SiteSvg vb="20 30 420 370" label={`Utility-scale solar layout — ${["Civil", "Structural", "Electrical"][i]} focus`} className={MAXW}><SitePlan focus={F[i]} /><T x="30" y="392" c={E.mute} size={9}>ILLUSTRATIVE LAYOUT · NO CAPACITY SHOWN</T></SiteSvg></Frame>
      <div className="mt-3"><Tabs items={["Civil → roads / grading", "Structural → mounting / foundations", "Electrical → collection / interconnection"]} i={i} set={setI} label="Solar documentation focus" /></div>
    </div>
  );
}

/* ───────── substation clearance ───────── */
export function Substation() {
  const [v, setV] = useState(0);
  const reduced = useReduced();
  const [pulse, setPulse] = useState(0);
  useEffect(() => { if (reduced) return; const id = setInterval(() => setPulse((x) => (x + 1) % 3), 1400); return () => clearInterval(id); }, [reduced]);
  const clear = v === 1;
  const bays = [120, 260, 400];
  return (
    <div>
      <Frame><SiteSvg vb="0 0 600 320" label={`Conceptual switchyard — ${clear ? "electrical clearance view" : "structural view"}`} className={MAXW}>
        <path d="M20 280H580" {...ln(E.mute, 1)} />
        {bays.map((x, k) => (
          <g key={x}>
            <rect x={x - 26} y="270" width="52" height="10" fillOpacity="0.2" {...ln(E.civil, 1)} fill={E.civil} />
            <g {...ln(!clear && pulse === k ? "#fff" : E.steel, !clear && pulse === k ? 2.4 : 1.6)}><path d={`M${x - 20} 270V120M${x + 20} 270V120M${x - 20} 120H${x + 20}M${x - 20} 200L${x + 20} 160`} /></g>
            <g {...ln(E.elec, 1.4)}><path d={`M${x} 120V96`} /><circle cx={x} cy="88" r="8" /><path d={`M${x - 10} 230h20v20h-20z`} /></g>
            <Fade on={clear}><circle cx={x} cy="96" r={pulse === k && !reduced ? 44 : 38} fillOpacity="0.06" {...ln(E.elec, 1)} fill={E.elec} strokeDasharray="5 4" style={{ transition: "r .8s ease" }} /><circle cx={x} cy="240" r="30" fillOpacity="0.05" {...ln(E.elec, 0.8)} fill={E.elec} strokeDasharray="4 4" /></Fade>
          </g>
        ))}
        <path d="M60 60H540" {...ln(E.elec, 2.2)} /><T x="60" y="52" c={E.elec} size={8}>BUS</T>
        {bays.map((x) => <path key={x} d={`M${x} 60V80`} {...ln(E.elec, 1.4)} />)}
        <path d="M20 300H580" {...ln(E.civil, 4)} strokeOpacity="0.3" /><T x="20" y="314" c={E.civil} size={8}>ACCESS PATH</T>
        <Fade on={clear}><T x="580" y="30" a="end" c={E.elec} size={9}>PROJECT-SPECIFIC CLEARANCE</T></Fade>
        <Fade on={!clear}><T x="580" y="30" a="end" c={E.steel} size={9}>STEEL STRUCTURES · BUS SUPPORTS · FOUNDATIONS</T></Fade>
        <T x="20" y="24" c={E.ink} size={10}>STRUCTURAL POSITIONING ↔ ELECTRICAL REQUIREMENTS</T>
      </SiteSvg></Frame>
      <div className="mt-3"><Tabs items={["Structural view", "Electrical clearance view"]} i={v} set={setV} label="Switchyard view" /></div>
    </div>
  );
}

/* ───────── single-line ↔ site ───────── */
const SLD: { k: Exclude<Hot, null>; l: string }[] = [{ k: "generation", l: "Generation" }, { k: "collection", l: "Collection" }, { k: "substation", l: "Substation" }, { k: "interconnection", l: "Interconnection" }];
export function SingleLine() {
  const [h, setH] = useState<Exclude<Hot, null>>("collection");
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_1.4fr]">
      <div className="border border-slate-300 bg-white">
        <svg viewBox="0 0 260 360" className="mx-auto block h-auto w-full max-w-[320px]" role="group" aria-label="Conceptual single-line diagram — select a node">
          <rect width="260" height="360" fill="#fff" />
          {SLD.map((n, i) => {
            const y = 40 + i * 90, on = h === n.k;
            const sym = [<g key="g" {...ln(on ? "#B45309" : "#0F172A", 1.6)}><circle cx="70" cy={y} r="16" /><path d={`M60 ${y}q5 -8 10 0t10 0`} /></g>, <g key="c" {...ln(on ? "#B45309" : "#0F172A", 1.6)}><path d={`M50 ${y}H90M60 ${y - 10}l20 20M80 ${y - 10}l-20 20`} /></g>, <g key="s" {...ln(on ? "#B45309" : "#0F172A", 1.6)}><circle cx="70" cy={y - 7} r="11" /><circle cx="70" cy={y + 7} r="11" /></g>, <g key="i" {...ln(on ? "#B45309" : "#0F172A", 1.6)}><path d={`M56 ${y + 14}l14 -28l14 28M70 ${y - 14}V${y + 14}`} /></g>][i];
            return (
              <g key={n.k} role="button" tabIndex={0} aria-pressed={on} aria-label={n.l} onClick={() => setH(n.k)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setH(n.k); } }} style={{ cursor: "pointer", outline: "none" }}>
                <rect x="30" y={y - 30} width="200" height="60" fill={on ? "#FEF3C7" : "#fff"} stroke={on ? "#B45309" : "#CBD5E1"} />
                {sym}
                <text x="110" y={y + 4} fontSize="11" fill="#0F172A" style={{ fontFamily: "var(--font-mono)" }}>{n.l.toUpperCase()}</text>
                {i < 3 ? <path d={`M70 ${y + 22}V${y + 68}`} {...ln("#0F172A", 1.4)} /> : null}
              </g>
            );
          })}
        </svg>
      </div>
      <Frame><SiteSvg label={`Site plan — ${h} highlighted`}><SitePlan hot={h} focus={["structural", "electrical", "site"]} /><T x="20" y="24" c={E.elec} size={10}>{`SINGLE-LINE ↔ SITE · ${h.toUpperCase()}`}</T></SiteSvg></Frame>
    </div>
  );
}

/* ───────── civil layers ───────── */
const CIV: { s: string; show: Layer[]; terrain: "existing" | "proposed" | "none" }[] = [
  { s: "Existing terrain", show: ["site", "civil"], terrain: "existing" },
  { s: "Proposed site", show: ["site", "civil"], terrain: "proposed" },
  { s: "Access", show: ["site", "civil"], terrain: "proposed" },
  { s: "Drainage", show: ["site", "civil"], terrain: "proposed" },
  { s: "Infrastructure", show: ["site", "civil", "structural"], terrain: "proposed" },
];
export function CivilLayers() {
  const [i, setI] = useState(2);
  return (
    <div>
      <Frame><SiteSvg label={`Illustrative civil site model — ${CIV[i].s}`} className={MAXW}><SitePlan show={CIV[i].show} terrain={CIV[i].terrain} focus={i === 2 || i === 3 ? ["civil"] : null} /><T x="20" y="24" c={E.civil} size={10}>{`ILLUSTRATIVE CIVIL SITE MODEL · ${CIV[i].s.toUpperCase()}`}</T></SiteSvg></Frame>
      <div className="mt-3"><Tabs light items={CIV.map((c) => c.s)} i={i} set={setI} label="Civil layer" /></div>
    </div>
  );
}

/* ───────── as-built split ───────── */
export function AsBuilt() {
  const [v, setV] = useState(50);
  const id = useId();
  const x = (v / 100) * 600;
  return (
    <div>
      <Frame><svg viewBox="0 0 600 400" className={MAXW} role="img" aria-label="Design documentation versus as-built documentation (illustrative)">
        <defs><clipPath id={`${id}-l`}><rect width={x} height="400" /></clipPath><clipPath id={`${id}-r`}><rect x={x} width={600 - x} height="400" /></clipPath></defs>
        <rect width="600" height="400" fill={E.bg} />
        <g clipPath={`url(#${id}-l)`}><SitePlan /><T x="20" y="24" c={E.ink} size={10}>DESIGN DOCUMENTATION</T></g>
        <g clipPath={`url(#${id}-r)`}><SitePlan asbuilt /><T x="580" y="24" a="end" c={E.ok} size={10}>AS-BUILT DOCUMENTATION</T>{[[402, 141], [430, 254], [548, 174], [205, 190]].map(([cx, cy], k) => <circle key={k} cx={cx} cy={cy} r="14" {...ln(E.red, 1.2)} strokeDasharray="4 3" />)}</g>
        <path d={`M${x} 0V400`} {...ln("#fff", 1.4)} /><circle cx={x} cy="200" r="11" {...ln("#fff", 1.4)} fill={E.bg} />
      </svg></Frame>
      <label className="mt-4 flex items-center gap-3 font-mono text-[10px] uppercase text-slate-400"><span>Design</span><input type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} aria-label="Split between design and as-built documentation" className="w-full accent-emerald-400" /><span>As-built</span></label>
      <p className="mt-2 text-xs text-slate-400">Illustrative workflow — differences shown: equipment position, cable route, foundation location, structural modification, access road variation.</p>
    </div>
  );
}

/* ───────── asset lifecycle ───────── */
const LIFE: { s: string; show?: Layer[]; ab?: boolean }[] = [
  { s: "Feasibility", show: ["site"] }, { s: "Design", show: ["site", "civil"] }, { s: "Documentation", show: ["site", "civil", "structural", "electrical", "docs"] },
  { s: "Construction" }, { s: "Commissioning" }, { s: "As-built", ab: true }, { s: "Operation", ab: true }, { s: "Maintenance", ab: true }, { s: "Augmentation", ab: true },
];
export function Lifecycle() {
  const [i, setI] = useState(0);
  const id = useId();
  return (
    <div>
      <Frame><SiteSvg label={`Energy asset at the ${LIFE[i].s} stage`} className={MAXW}><SitePlan show={LIFE[i].show} asbuilt={LIFE[i].ab} phase={i === 8 ? 3 : 2} hot={i === 4 ? "interconnection" : null} /><T x="20" y="24" c={E.ink} size={11}>{LIFE[i].s.toUpperCase()}</T></SiteSvg></Frame>
      <label htmlFor={id} className="mt-4 block font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Same asset — every stage adds a documentation layer</label>
      <input id={id} type="range" min={0} max={LIFE.length - 1} value={i} onChange={(e) => setI(Number(e.target.value))} aria-valuetext={LIFE[i].s} className="mt-2 w-full accent-yellow-400" />
      <ol className="mt-2 flex justify-between gap-1 overflow-x-auto font-mono text-[9px] uppercase text-slate-500 sm:text-[10px]">{LIFE.map((x, k) => <li key={x.s}><button type="button" onClick={() => setI(k)} className={k === i ? "text-white" : "hover:text-white"}>{x.s}</button></li>)}</ol>
    </div>
  );
}

/* ───────── phases ───────── */
export function Phases() {
  const [p, setP] = useState(1);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
      <Frame><SiteSvg label={`Phased development — phase ${p}`}>
        <g opacity="0.25"><SitePlan phase={3} focus={["structural"]} /></g>
        <SitePlan phase={p} show={["site", "civil", "structural", "electrical"]} />
        <T x="20" y="24" c={E.ink} size={10}>{`CURRENT PHASE · ${p}`}</T><T x="20" y="40" c={E.mute} size={8}>FAINT · FUTURE PHASES</T>
      </SiteSvg></Frame>
      <div>
        <Tabs items={["Phase 1", "Phase 2", "Phase 3"]} i={p - 1} set={(k) => setP(k + 1)} label="Development phase" />
        <ul className="mt-4 space-y-2 text-sm">
          <li className="border border-yellow-400/60 bg-yellow-400/5 px-4 py-2.5 text-white">Current phase · blocks for phase {p}</li>
          <li className="border border-slate-600 px-4 py-2.5 text-slate-300">Future phase · {p < 3 ? `phase ${p + 1}${p < 2 ? "–3" : ""} areas held in the layout` : "none remaining"}</li>
          <li className="border border-sky-400/50 px-4 py-2.5 text-slate-200">Shared infrastructure · substation, main road, boundary</li>
        </ul>
      </div>
    </div>
  );
}

/* ───────── deliverables stack ───────── */
export function Deliverables({ items }: { items: string[] }) {
  const [i, setI] = useState(0);
  const views: Layer[][] = [["structural"], ["electrical"], ["civil", "site"], [], ["site", "civil", "structural", "electrical", "docs"]];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 md:grid-cols-[1fr_1.1fr]">
      <ul className="space-y-2">{items.map((d, k) => <li key={d}><button type="button" aria-pressed={i === k} onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} className={cn("flex w-full items-center gap-3 border px-4 py-3.5 text-left text-sm transition-all", i === k ? "translate-x-1 border-[#0B0F1A] bg-[#0B0F1A] text-white" : "border-slate-300 bg-white text-slate-800 hover:border-slate-900")}><span className="font-mono text-[10px] opacity-60">{String(k + 1).padStart(2, "0")}</span>{d}</button></li>)}</ul>
      <div key={i} data-in="true" className="overflow-hidden border border-slate-700 bg-[#0B0F1A]"><div className="fade-in"><SiteSvg label={`${items[i]} preview`}><SitePlan focus={views[i]?.length ? views[i] : null} asbuilt={i === 3} />{i === 3 ? <T x="20" y="24" c={E.ok} size={10}>AS-BUILT</T> : null}</SiteSvg></div></div>
    </div>
  );
}

/* ───────── discipline matrix → hero site ───────── */
const MATRIX: { d: string; t: string; f: Layer[]; h?: Hot }[] = [
  { d: "Civil", t: "Site, access, grading, drainage", f: ["civil", "site"] },
  { d: "Structural", t: "Steel, foundations, supports", f: ["structural"] },
  { d: "Electrical", t: "SLDs, schematics, collection / interconnection", f: ["electrical"] },
  { d: "Coordination", t: "Integrated site documentation", f: ["civil", "structural", "electrical", "site"] },
  { d: "Handover", t: "As-built documentation", f: ["docs", "electrical", "structural", "civil", "site"] },
];
export function Matrix() {
  const [i, setI] = useState(0);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1fr_1.3fr]">
      <table className="w-full border-collapse self-start border border-slate-300 bg-white text-left text-sm">
        <caption className="sr-only">Energy disciplines and typical documentation</caption>
        <thead><tr className="border-b border-slate-300 bg-slate-50 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500"><th scope="col" className="px-4 py-3 font-normal">Discipline</th><th scope="col" className="px-4 py-3 font-normal">Typical documentation</th></tr></thead>
        <tbody>{MATRIX.map((m, k) => <tr key={m.d} className={cn("border-b border-slate-100 transition-colors", i === k ? "bg-yellow-50" : "")}><th scope="row" className="px-4 py-3"><button type="button" aria-pressed={i === k} onClick={() => setI(k)} onFocus={() => setI(k)} className="font-semibold text-slate-900 underline-offset-4 hover:underline">{m.d}</button></th><td className="px-4 py-3 text-slate-600">{m.t}</td></tr>)}</tbody>
      </table>
      <Frame><SiteSvg label={`Energy site — ${MATRIX[i].d} highlighted`}><SitePlan focus={MATRIX[i].f} asbuilt={i === 4} /></SiteSvg></Frame>
    </div>
  );
}
