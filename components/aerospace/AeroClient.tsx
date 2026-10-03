"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { makeIso } from "@/components/svg/iso";
import { A, T, Fade, Grid, ln, Lug3D, isoAt, Ortho, fv, tv, Datum, FCF, FEATS, type Feat } from "./AeroModel";

const tab = (on: boolean, light?: boolean) =>
  cn("min-h-[40px] shrink-0 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400",
    light ? (on ? "border-[#0A0E15] bg-[#0A0E15] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-900")
      : (on ? "border-cyan-400 bg-cyan-400/10 text-white" : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"));
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
function useTick(ms: number, n: number, on = true) {
  const reduced = useReduced();
  const [k, setK] = useState(0);
  useEffect(() => { if (reduced || !on) return; const id = setInterval(() => setK((x) => (x + 1) % n), ms); return () => clearInterval(id); }, [reduced, on, ms, n]);
  return [k, setK, reduced] as const;
}
const Svg = ({ vb = "0 0 520 380", label, children, light, className }: { vb?: string; label: string; children: React.ReactNode; light?: boolean; className?: string }) => {
  const [, , w, h] = vb.split(" ").map(Number);
  return <svg viewBox={vb} className={className ?? "block h-auto w-full"} role="img" aria-label={label}><title>{label}</title><rect width={w} height={h} fill={light ? A.paper : A.bg} /><Grid w={w} h={h} light={light} />{children}</svg>;
};

/* ───────── hero viewer ───────── */
const MODES = ["3D model", "Section view", "Drawing", "Inspection"] as const;
const BUILD = ["Wireframe", "Solid CAD", "Feature details", "Dimensions", "Tolerances", "Inspection points"];
export function HeroViewer() {
  const reduced = useReduced();
  const [b, setB] = useState(0);
  const [m, setM] = useState(0);
  useEffect(() => { if (reduced) return; const id = setInterval(() => setB((x) => (x >= BUILD.length - 1 ? x : x + 1)), 900); return () => clearInterval(id); }, [reduced]);
  const st = reduced ? BUILD.length - 1 : b;
  const p = isoAt(250, 190, 1.75);
  const tag = (at: readonly [number, number], dx: number, dy: number, l: string, c: string) => <g><circle cx={at[0]} cy={at[1]} r="2.6" fill={c} /><path d={`M${at[0]} ${at[1]}l${dx} ${dy}`} {...ln(c, 0.8)} /><T x={at[0] + dx + (dx > 0 ? 4 : -4)} y={at[1] + dy + 3} a={dx > 0 ? "start" : "end"} c={c} size={9}>{l}</T></g>;
  return (
    <div className="border border-slate-700 bg-[#0A0E15]">
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"><span>Lug fitting · {m === 0 ? BUILD[st] : MODES[m]}</span><span className="text-cyan-300/80">Illustrative</span></div>
      <Svg label={`Illustrative precision lug fitting — ${MODES[m]}`}>
        <Fade on={m === 0}>
          <Lug3D solid={st >= 1} />
          <Fade on={st >= 2}>{tag(p(60, 62, 58), 90, -70, "FEATURE · BEARING SEAT", A.cyan)}{tag(p(12, 68, 10), 30, 70, "FEATURE · MOUNTING HOLE", A.cyan)}</Fade>
          <Fade on={st >= 3}><g {...ln(A.green, 0.9)}><path d={`M${p(0, 80, 0)[0]} ${p(0, 80, 0)[1] + 8}l${p(120, 80, 0)[0] - p(0, 80, 0)[0]} ${p(120, 80, 0)[1] - p(0, 80, 0)[1]}`} /></g><T x={(p(0, 80, 0)[0] + p(120, 80, 0)[0]) / 2} y={(p(0, 80, 0)[1] + p(120, 80, 0)[1]) / 2 + 24} c={A.green} size={9}>REF</T></Fade>
          <Fade on={st >= 4}>{tag(p(120, 40, 0), 40, 30, "DATUM A", A.amber)}{tag(p(60, 50, 78), -60, -40, "Ø ± TOL", A.red)}{tag(p(80, 56, 30), 90, 10, "POSITION", A.red)}</Fade>
          <Fade on={st >= 5}>{[p(60, 62, 58), p(12, 12, 10), p(108, 68, 10), p(120, 0, 5)].map((q, i) => <g key={i}><circle cx={q[0]} cy={q[1]} r="9" {...ln(A.violet, 1.3)} className="rch-pulse" style={{ "--d": `${i * 300}ms` } as React.CSSProperties} /><T x={q[0] + 12} y={q[1] - 8} c={A.violet} size={8}>{`I${i + 1}`}</T></g>)}<T x="20" y="366" c={A.violet} size={9}>INSPECTION POINTS</T></Fade>
        </Fade>
        <Fade on={m === 1}><Ortho section dims={false} /><T x="300" y="60" c={A.mute} size={9}>SECTION A–A THROUGH LUG</T><T x="300" y="76" c={A.mute} size={9}>BEARING SEAT · BASE · DATUM A</T></Fade>
        <Fade on={m === 2}><Ortho /><Datum x={fv(-6, 0)[0] + 16} y={150} l="A" /><FCF x={300} y={40} cells={["⌖", "Ø ± t", "A", "B"]} /><path d={`M300 48L${fv(60, 58)[0] + 16} ${fv(60, 58)[1] - 10}`} {...ln(A.red, 0.7)} /><T x="300" y="30" c={A.mute} size={8}>TOLERANCE — PROJECT SPECIFIC</T></Fade>
        <Fade on={m === 3}><Ortho dims={false} />{([[fv(60, 58), "1"], [tv(12, 12), "2"], [tv(108, 68), "3"], [fv(120, 5), "4"]] as const).map(([q, n]) => <g key={n}><circle cx={q[0] + 22} cy={q[1] - 18} r="9" {...ln(A.violet, 1.3)} fill={A.bg} /><T x={q[0] + 22} y={q[1] - 14.5} a="middle" c={A.violet} size={9} w={700}>{n}</T><path d={`M${q[0] + 15} ${q[1] - 12}L${q[0]} ${q[1]}`} {...ln(A.violet, 0.8)} /></g>)}<g>{["BEARING SEAT", "MOUNTING HOLE", "FASTENER PATTERN", "LOCATING FACE"].map((x, i) => <T key={x} x="300" y={60 + i * 18} c={A.violet} size={9}>{`${i + 1} · ${x}`}</T>)}</g></Fade>
      </Svg>
      <div className="border-t border-slate-800 p-2.5"><Tabs items={MODES} i={m} set={setM} label="Representation" /></div>
    </div>
  );
}

/* ───────── single feature through the workflow ───────── */
const FLOW = ["Component geometry", "Engineering drawing", "Manufacturing", "Inspection"];
export function FeatureFlow() {
  const [k] = useTick(1500, 4);
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {FLOW.map((f, i) => (
        <li key={f} className={cn("border bg-[#0A0E15] transition-colors duration-500", k === i ? "border-cyan-400" : "border-slate-700")}>
          <svg viewBox="0 0 200 140" className="block h-auto w-full" role="img" aria-label={`${f}: bearing seat`}>
            <rect width="200" height="140" fill={A.bg} /><Grid w={200} h={140} />
            {i === 0 ? <g transform="translate(20 20)"><Lug3D solid hot="bore" ox={80} oy={70} s={0.62} /></g> : null}
            {i === 1 ? <g transform="translate(8 -2) scale(0.42)"><Ortho hot="bore" dims={false} /></g> : null}
            {i === 2 ? <g><circle cx="100" cy="72" r="26" {...ln(A.amber, 2)} /><path d="M100 10V46M92 10h16" {...ln(A.ink, 1.4)} /><path d="M100 46l-6 -10h12z" fill={A.ink} /><path d="M130 72a30 30 0 1 1 -2 -12" {...ln(A.cyan, 0.9)} strokeDasharray="3 3" className="rch-flow" /><T x="10" y="130" c={A.mute} size={8}>BORE MACHINED</T></g> : null}
            {i === 3 ? <g><circle cx="100" cy="72" r="26" {...ln(A.ink, 1.4)} />{[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={100 + Math.cos((a * Math.PI) / 180) * 26} cy={72 + Math.sin((a * Math.PI) / 180) * 26} r="3" fill={A.violet} />)}<path d="M150 20L118 56" {...ln(A.violet, 1.4)} /><circle cx="118" cy="56" r="3" fill={A.violet} /><T x="10" y="130" c={A.mute} size={8}>PROBE POINTS</T></g> : null}
          </svg>
          <p className="border-t border-slate-800 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-200"><span className="text-cyan-300">{String(i + 1).padStart(2, "0")}</span> {f}</p>
        </li>
      ))}
    </ol>
  );
}

/* ───────── feature-specific tolerancing ───────── */
const TSTEP = ["Blanket tolerance", "Feature analysis", "Functional tolerance definition", "Inspection reference"];
export function Tolerancing() {
  const [f, setF] = useState<Feat>("bore");
  const [s, setS] = useState(2);
  const ft = FEATS.find((x) => x.id === f)!;
  return (
    <div>
      <Tabs items={TSTEP} i={s} set={setS} label="Tolerancing step" light />
      <div className="mt-4 grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden border border-slate-300">
          <Svg light label={`Technical drawing — ${TSTEP[s]}${s >= 1 ? `, ${ft.name} selected` : ""}`}>
            <Ortho light hot={s >= 1 ? f : null} />
            <Fade on={s === 0}><rect x="290" y="300" width="214" height="40" {...ln(A.red, 1)} fill="#FEF2F2" /><T x="298" y="316" c="#B91C1C" size={9}>UNLESS OTHERWISE STATED:</T><T x="298" y="332" c="#B91C1C" size={9}>ONE TOLERANCE FOR EVERY FEATURE</T></Fade>
            <Fade on={s >= 2}><FCF light x={300} y={44} cells={["⌖", "TOL — PROJECT SPECIFIC", "A"]} /><path d={`M300 52L${fv(60, 58)[0] + 16} ${fv(60, 58)[1] - 8}`} {...ln(A.red, 0.8)} /><Datum light x={fv(-6, 0)[0] + 16} y={150} l="A" /></Fade>
            <Fade on={s >= 3}><circle cx="470" cy="110" r="11" {...ln(A.violet, 1.4)} fill={A.paper} /><T x="470" y="114" a="middle" c={A.violet} size={10} w={700}>1</T><T x="300" y="114" c="#6D28D9" size={9}>INSPECTION REF →</T></Fade>
            {FEATS.map((x) => { const at = { hole: tv(12, 12), bore: fv(60, 58), locate: fv(100, 0), pattern: tv(108, 68), edge: fv(78, 74) }[x.id]; const on = f === x.id; return (
              <g key={x.id} role="button" tabIndex={0} aria-pressed={on} aria-label={x.name} onClick={() => setF(x.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setF(x.id); } }} style={{ cursor: "pointer", outline: "none" }}>
                <circle cx={at[0]} cy={at[1]} r={on ? 14 : 10} fillOpacity={on ? 0.25 : 0.9} {...ln(on ? A.amber : "#1D4ED8", on ? 2 : 1.2)} fill={on ? A.amber : A.paper} />
              </g>
            ); })}
          </Svg>
        </div>
        <div>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">{FEATS.map((x) => <li key={x.id}><button type="button" aria-pressed={f === x.id} onClick={() => setF(x.id)} className={cn(tab(f === x.id, true), "w-full text-left")}>{x.name}</button></li>)}</ul>
          <dl key={f + s} data-in="true" className="mt-4 border border-slate-300 bg-white font-mono text-[11px] uppercase tracking-[0.06em]">
            {[["Feature", ft.name], ["Functional role", s >= 1 ? ft.role : "—"], ["Tolerance", s === 0 ? "Blanket (whole part)" : s >= 2 ? "Project specific" : "Under review"], ["Inspection reference", s >= 3 ? ft.insp : "—"]].map(([a, b]) => <div key={a} className="fade-in grid grid-cols-[130px_1fr] border-b border-slate-100 px-4 py-2.5"><dt className="text-slate-500">{a}</dt><dd className={cn("normal-case tracking-normal", a === "Tolerance" && s === 0 ? "text-red-700" : "text-slate-900")}>{b}</dd></div>)}
          </dl>
          <p className="mt-2 text-xs text-slate-500">No tolerance values are shown — they are set by the project specification.</p>
        </div>
      </div>
    </div>
  );
}

/* ───────── repeatable fixture ───────── */
export function Fixture() {
  const reduced = useReduced();
  const [{ down, cyc }, set] = useState({ down: true, cyc: 1 });
  useEffect(() => { if (reduced) return; const id = setInterval(() => set((v) => ({ down: !v.down, cyc: v.down ? v.cyc : (v.cyc % 99) + 1 })), 1300); return () => clearInterval(id); }, [reduced]);
  const p = makeIso(260, 200, 1.5);
  const lift = down || reduced ? 0 : -60;
  const box = (x: number, y: number, z: number, W: number, D: number, H: number, c: string, o = 0.15) => <g {...ln(c, 1.3)}><path d={`M${p(x, y + D, z + H).join(" ")}L${p(x + W, y + D, z + H).join(" ")}L${p(x + W, y + D, z).join(" ")}L${p(x, y + D, z).join(" ")}Z`} fill={c} fillOpacity={o * 1.4} /><path d={`M${p(x + W, y, z + H).join(" ")}L${p(x + W, y, z).join(" ")}L${p(x + W, y + D, z).join(" ")}L${p(x + W, y + D, z + H).join(" ")}Z`} fill={c} fillOpacity={o} /><path d={`M${p(x, y, z + H).join(" ")}L${p(x + W, y, z + H).join(" ")}L${p(x + W, y + D, z + H).join(" ")}L${p(x, y + D, z + H).join(" ")}Z`} fill={c} fillOpacity={o * 2} /></g>;
  return (
    <Svg label="Illustrative fixture repeatedly locating a workpiece">
      {box(0, 0, 0, 150, 100, 12, A.mute)}
      {[[30, 50], [120, 50]].map(([x, y]) => <g key={x} {...ln(A.amber, 1.6)}><path d={`M${p(x, y, 12).join(" ")}L${p(x, y, 34).join(" ")}`} /></g>)}
      {[[20, 20], [130, 20], [75, 85]].map(([x, y]) => <g key={`${x}${y}`}>{box(x - 5, y - 5, 12, 10, 10, 5, A.amber, 0.3)}</g>)}
      <g style={{ transform: `translateY(${lift}px)`, transition: "transform .9s cubic-bezier(.45,0,.2,1)" }}>{box(15, 15, 17, 120, 70, 8, A.cyan, 0.18)}</g>
      <g style={{ transform: down || reduced ? "rotate(0deg)" : "rotate(-25deg)", transformOrigin: `${p(-6, 50, 40)[0]}px ${p(-6, 50, 40)[1]}px`, transition: "transform .6s ease" }}>{box(-10, 44, 12, 10, 12, 32, A.green, 0.2)}{box(-2, 46, 38, 30, 8, 6, A.green, 0.3)}</g>
      {([[p(30, 50, 34), -60, -30, "LOCATING"], [p(-2, 50, 44), -50, 40, "CLAMPING"], [p(150, 50, 0), 40, 20, "DATUM"], [p(135, 15, 25), 40, -40, "INSPECTION"]] as const).map(([q, dx, dy, l]) => <g key={l}><circle cx={q[0]} cy={q[1]} r="2.5" fill={A.ink} /><path d={`M${q[0]} ${q[1]}l${dx} ${dy}`} {...ln(A.ink, 0.7)} /><T x={q[0] + dx + (dx > 0 ? 4 : -4)} y={q[1] + dy + 3} a={dx > 0 ? "start" : "end"} c={A.ink} size={9}>{l}</T></g>)}
      <rect x="360" y="20" width="140" height="40" {...ln(A.cyan, 0.8)} fill={A.panel} /><T x="370" y="36" c={A.mute} size={8}>REPEATABILITY</T><T x="370" y="52" c={A.cyan} size={10}>{`PART ${String(cyc).padStart(3, "0")} · SAME DATUMS`}</T>
      <T x="20" y="366" c={A.mute} size={8}>ILLUSTRATIVE · NO ACCURACY CLAIM</T>
    </Svg>
  );
}

/* ───────── reverse engineering evidence ───────── */
const EVID: Record<Feat, { e: string; s: "ok" | "warn" | "rev" }[]> = {
  hole: [{ e: "Measured", s: "ok" }, { e: "Existing drawing — partial", s: "ok" }, { e: "Wear suspected — elongated", s: "warn" }, { e: "Requires engineering review", s: "rev" }],
  bore: [{ e: "Measured", s: "ok" }, { e: "Previous repair suspected — bushed", s: "warn" }, { e: "Requires engineering review", s: "rev" }],
  locate: [{ e: "Measured", s: "ok" }, { e: "Existing drawing", s: "ok" }],
  pattern: [{ e: "Measured", s: "ok" }, { e: "Mating part reference", s: "ok" }],
  edge: [{ e: "Measured", s: "ok" }, { e: "Manufacturing variation possible", s: "warn" }, { e: "Requires engineering review", s: "rev" }],
};
export function ReverseEvidence() {
  const [f, setF] = useState<Feat>("hole");
  const [k] = useTick(1300, 5);
  const ev = EVID[f];
  return (
    <div>
      <ol className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.08em]">{["Physical / legacy component", "Measurement evidence", "Feature analysis", "CAD reconstruction", "Manufacturing drawing"].map((s, i) => <li key={s} className="flex items-center gap-2">{i ? <span aria-hidden className="text-cyan-400">→</span> : null}<span className={cn("border px-3 py-2 transition-colors duration-500", k === i ? "border-cyan-400 bg-cyan-400/10 text-white" : "border-slate-600 text-slate-300")}>{s}</span></li>)}</ol>
      <div className="mt-6 grid gap-5 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden border border-slate-700">
          <Svg vb="0 0 520 300" label={`Legacy component evidence — ${FEATS.find((x) => x.id === f)!.name}`}>
            <g transform="translate(-10 -40)"><Ortho hot={f} dims={false} /></g>
            <g transform="translate(-10 -40)">{[tv(12, 12), tv(108, 12), tv(12, 68), tv(108, 68)].map((q, i) => <ellipse key={i} cx={q[0] + (i === 0 ? 2 : 0)} cy={q[1]} rx={i === 0 ? 11 : 8.5} ry="8.5" {...ln("#B8A47E", 0.9)} strokeDasharray="2 2" />)}</g>
            {Array.from({ length: 16 }, (_, i) => { const x = 40 + ((i * 37) % 200), y = 60 + ((i * 53) % 220); return <path key={i} d={`M${x - 3} ${y}h6M${x} ${y - 3}v6`} {...ln(A.cyan, 0.9)} />; })}
            <T x="300" y="40" c={A.mute} size={9}>MEASUREMENT EVIDENCE OVERLAY</T><T x="300" y="56" c="#B8A47E" size={9}>- - SAMPLE CONDITION</T>
          </Svg>
        </div>
        <div>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">{FEATS.map((x, i) => <li key={x.id}><button type="button" aria-pressed={f === x.id} onClick={() => setF(x.id)} className={cn(tab(f === x.id), "w-full text-left")}>Feature {String.fromCharCode(65 + i)} · {x.name}</button></li>)}</ul>
          <ul key={f} data-in="true" className="mt-4 space-y-1.5">{ev.map((x) => <li key={x.e} className={cn("fade-in flex items-center gap-3 border px-3 py-2 text-sm", x.s === "ok" ? "border-slate-600 text-slate-200" : x.s === "warn" ? "border-amber-400/60 text-amber-100" : "border-red-400/60 text-red-100")}><span className="font-mono text-[10px] uppercase">{x.s === "ok" ? "Evidence" : x.s === "warn" ? "Caution" : "Review"}</span>{x.e}</li>)}</ul>
          <p className="mt-3 text-xs text-slate-400">The workflow tracks evidence — it doesn&apos;t decide which value is the original design intent.</p>
        </div>
      </div>
    </div>
  );
}

/* ───────── design intent vs physical (split slider) ───────── */
export function IntentSplit() {
  const [v, setV] = useState(50);
  const [layers, setLayers] = useState({ wear: true, review: true });
  const W = 520, x = (v / 100) * W;
  return (
    <div>
      <div className="relative overflow-hidden border border-slate-700 bg-[#0A0E15]">
        <Svg vb="0 0 520 330" label="Measured condition versus reconstructed design intent" className="mx-auto block h-auto w-full max-w-[860px]">
          <defs><clipPath id="ae-left"><rect x="0" y="0" width={x} height="330" /></clipPath><clipPath id="ae-right"><rect x={x} y="0" width={W - x} height="330" /></clipPath></defs>
          <g clipPath="url(#ae-left)"><g transform="translate(60 40) scale(1.4)"><path d="M40 160 L42 151 L244 152 L246 166 L242 168 L40 168 Z" fillOpacity="0.6" {...ln("#B8A47E", 1.4)} fill="#3A3322" />
            <path d="M108 151V75 a34 34 0 0 1 68 0V151" {...ln("#B8A47E", 1.4)} fill="#3A3322" fillOpacity="0.6" />
            <ellipse cx="143" cy="75" rx="17" ry="15" {...ln("#B8A47E", 1.4)} fill={A.bg} />
            {layers.wear ? <g><circle cx="143" cy="75" r="23" {...ln(A.amber, 1)} strokeDasharray="3 2" /><T x="30" y="44" c={A.amber} size={9}>WEAR / REPAIR?</T><path d="M44 152l14 -4l14 6" {...ln(A.amber, 1.2)} /><T x="30" y="142" c={A.amber} size={8}>EDGE DAMAGE</T></g> : null}
          </g><T x="16" y="22" c="#B8A47E" size={10}>MEASURED CONDITION</T></g>
          <g clipPath="url(#ae-right)"><g transform="translate(60 40) scale(1.4)"><path d="M40 168H246V152H40Z" fillOpacity="0.12" {...ln(A.cyan, 1.6)} fill={A.cyan} /><path d="M108 152V75 a34 34 0 0 1 68 0V152" {...ln(A.cyan, 1.6)} fill={A.cyan} fillOpacity="0.12" /><circle cx="143" cy="75" r="15" {...ln(A.cyan, 1.6)} fill={A.bg} /><path d="M120 75h46M143 52v46" {...ln(A.red, 0.6)} strokeDasharray="6 2 1 2" />
            {layers.review ? <g><rect x="186" y="96" width="130" height="34" {...ln(A.violet, 1)} fill={A.panel} /><T x="192" y="110" c={A.violet} size={8}>ENGINEERING REVIEW</T><T x="192" y="123" c={A.ink} size={8}>Nominal reconstruction</T></g> : null}
          </g><T x="504" y="22" a="end" c={A.cyan} size={10}>RECONSTRUCTED DESIGN INTENT</T></g>
          <path d={`M${x} 0V330`} {...ln("#fff", 1.4)} /><circle cx={x} cy="165" r="12" {...ln("#fff", 1.4)} fill={A.bg} /><path d={`M${x - 5} 165h10`} {...ln("#fff", 1.2)} />
        </Svg>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <label className="flex flex-1 items-center gap-3 font-mono text-[10px] uppercase text-slate-400"><span>Measured</span><input type="range" min={0} max={100} value={v} onChange={(e) => setV(Number(e.target.value))} aria-label="Split between measured condition and reconstructed design intent" className="w-full min-w-[160px] accent-cyan-400" /><span>Reconstructed</span></label>
        <div className="flex gap-1.5">{([["wear", "Wear / repair layer"], ["review", "Engineering review layer"]] as const).map(([k, l]) => <button key={k} type="button" aria-pressed={layers[k]} onClick={() => setLayers({ ...layers, [k]: !layers[k] })} className={tab(layers[k])}>{layers[k] ? "✓ " : ""}{l}</button>)}</div>
      </div>
    </div>
  );
}

/* ───────── traceability graph ───────── */
const TRACE: Record<Feat, string[]> = {
  hole: ["Mounting hole", "Hole size + position", "Project-specific", "Interface drawing", "Drilled / reamed", "Position check"],
  bore: ["Bearing seat", "Bore Ø + position", "Project-specific (tight)", "Engineering specification", "Machined bore", "Bore size & position"],
  locate: ["Locating surface", "Datum A flatness", "Project-specific", "Datum scheme", "Faced surface", "Flatness reference"],
  pattern: ["Fastener interface", "Pattern position", "Project-specific", "Mating-part drawing", "Drilled pattern", "Pattern position check"],
  edge: ["Structural edge", "Edge distance / profile", "Project-specific", "Engineering specification", "Profiled edge", "Profile check"],
};
const TN = ["Feature", "Dimension", "Tolerance", "Basis", "Manufacturing", "Inspection"];
export function TraceGraph() {
  const [f, setF] = useState<Feat>("bore");
  const v = TRACE[f];
  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-[260px_1fr]">
      <ul className="space-y-1.5">{FEATS.map((x) => <li key={x.id}><button type="button" aria-pressed={f === x.id} onClick={() => setF(x.id)} className={cn(tab(f === x.id, true), "w-full text-left")}>{x.name}</button></li>)}</ul>
      <ol key={f} data-in="true" className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TN.map((n, i) => (
          <li key={n} className="fade-in relative border border-slate-300 bg-white p-4" style={{ animationDelay: `${i * 90}ms` }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue-700">{String(i + 1).padStart(2, "0")} · {n}</p>
            <p className={cn("mt-1.5 text-sm font-semibold", i === 2 ? "text-amber-700" : "text-slate-900")}>{v[i]}</p>
            {i % 3 !== 2 ? <span aria-hidden className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-blue-600 lg:block">→</span> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────── drawing ↔ inspection ───────── */
const DI: { f: string; dim: string; method: string }[] = [
  { f: "Bearing seat", dim: "Ø + position · datum A, B", method: "Bore gauge / CMM probing" },
  { f: "Mounting hole", dim: "Size + position · datum A", method: "Pin / CMM position" },
  { f: "Locating surface", dim: "Flatness · datum A", method: "Surface reference" },
  { f: "Structural edge", dim: "Profile / edge distance", method: "Profile check" },
];
export function DrawInspect() {
  const [i, setI] = useState(0);
  const [k] = useTick(1200, 3);
  return (
    <div>
      <div className="grid gap-4 [&>*]:min-w-0 md:grid-cols-[1fr_auto_1fr]">
        <div className="border border-slate-300 bg-white">
          <p className="border-b border-slate-200 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-blue-700">Drawing</p>
          <ul>{DI.map((d, j) => <li key={d.f}><button type="button" aria-pressed={i === j} onClick={() => setI(j)} className={cn("grid w-full grid-cols-[1fr_1.4fr] gap-3 border-b border-slate-100 px-4 py-3 text-left text-sm transition-colors", i === j ? "bg-blue-50" : "hover:bg-slate-50")}><span className="font-semibold text-slate-900">{d.f}</span><span className="font-mono text-[11px] text-slate-600">{d.dim}</span></button></li>)}</ul>
        </div>
        <div aria-hidden className="hidden flex-col items-center justify-center gap-1 font-mono text-[10px] uppercase text-blue-600 md:flex"><span className="h-px w-16 bg-blue-600" /><span>same feature</span><span className="h-px w-16 bg-blue-600" /></div>
        <div className="border border-slate-300 bg-white">
          <p className="border-b border-slate-200 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-violet-700">Inspection</p>
          <ul>{DI.map((d, j) => <li key={d.f} className={cn("grid grid-cols-[1fr_1.4fr] gap-3 border-b border-slate-100 px-4 py-3 text-sm transition-colors", i === j ? "bg-violet-50" : "")}><span className="font-semibold text-slate-900">{d.f}</span><span className="font-mono text-[11px] text-slate-600">{d.method}</span></li>)}</ul>
        </div>
      </div>
      <ol className="mt-5 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.08em]">{["Drawing requirement", "Inspection method", "Verification"].map((s, j) => <li key={s} className="flex items-center gap-2">{j ? <span aria-hidden className="text-blue-600">→</span> : null}<span className={cn("border px-3 py-2 transition-colors", k === j ? "border-blue-600 bg-blue-50 text-slate-900" : "border-slate-300 bg-white text-slate-600")}>{s}</span></li>)}</ol>
      <p className="mt-2 text-xs text-slate-500">Methods shown are examples — the actual method depends on your inspection equipment. A tolerance that can&apos;t be verified with confidence is flagged during drafting.</p>
    </div>
  );
}

/* ───────── deliverable stack with previews ───────── */
export function DeliverableStack({ items }: { items: string[] }) {
  const [i, setI] = useState(0);
  return (
    <div className="grid gap-5 [&>*]:min-w-0 md:grid-cols-[1fr_1.1fr]">
      <ul className="space-y-2">{items.map((d, k) => <li key={d}><button type="button" aria-pressed={i === k} onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} className={cn("flex w-full items-center gap-3 border px-4 py-3.5 text-left text-sm transition-all", i === k ? "translate-x-1 border-[#0A0E15] bg-[#0A0E15] text-white" : "border-slate-300 bg-white text-slate-800 hover:border-slate-900")}><span className="font-mono text-[10px] opacity-60">{String(k + 1).padStart(2, "0")}</span>{d}</button></li>)}</ul>
      <div key={i} data-in="true" className="overflow-hidden border border-slate-700">
        <div className="fade-in">
          <Svg vb="0 0 520 300" label={`${items[i]} preview`}>
            {i === 0 ? <g><g opacity="0.35"><Lug3D solid={false} ox={170} oy={160} s={1.3} /></g><Lug3D solid ox={340} oy={160} s={1.3} /><T x="20" y="286" c={A.mute} size={9}>WIREFRAME → SOLID MODEL</T></g> : null}
            {i === 1 ? <g transform="translate(20 -10) scale(0.82)"><Ortho /></g> : null}
            {i === 2 ? <g transform="translate(20 -30) scale(0.8)"><Fixture /></g> : null}
            {i === 3 ? <g><g transform="translate(10 -20) scale(0.6)"><Ortho dims={false} /></g><path d="M220 140h40M252 134l8 6l-8 6" {...ln(A.amber, 1.4)} /><g transform="translate(250 -20) scale(0.8)"><Lug3D solid ox={150} oy={190} s={1.1} /></g><T x="20" y="286" c={A.mute} size={9}>PHYSICAL REFERENCE → CAD</T></g> : null}
            {i === 4 ? <g>{["FEATURE", "FUNCTIONAL ROLE", "TOLERANCE BASIS", "DOCUMENTATION"].map((s, k) => <g key={s}><rect x={40 + k * 118} y="120" width="106" height="44" {...ln(k === 2 ? A.amber : A.cyan, 1)} fill={A.panel} /><T x={93 + k * 118} y="146" a="middle" c={A.ink} size={8.5}>{s}</T>{k < 3 ? <path d={`M${146 + k * 118} 142h12`} {...ln(A.cyan, 1)} /> : null}</g>)}<T x="20" y="286" c={A.mute} size={9}>FEATURE-BY-FEATURE RATIONALE</T></g> : null}
          </Svg>
        </div>
      </div>
    </div>
  );
}

/* ───────── capability map ───────── */
const CAPS = ["3D CAD", "Mechanical drafting", "Tolerancing", "Reverse engineering", "Tooling", "Fixtures", "Manufacturing drawings", "Traceability", "Inspection coordination"];
const REL: Record<string, string[]> = {
  "3D CAD": ["Mechanical drafting", "Reverse engineering", "Tooling"],
  "Mechanical drafting": ["3D CAD", "Tolerancing", "Manufacturing drawings"],
  Tolerancing: ["Mechanical drafting", "Traceability", "Inspection coordination"],
  "Reverse engineering": ["3D CAD", "Tolerancing", "Manufacturing drawings", "Inspection coordination"],
  Tooling: ["Fixtures", "3D CAD", "Manufacturing drawings"],
  Fixtures: ["Tooling", "Inspection coordination"],
  "Manufacturing drawings": ["Mechanical drafting", "Tolerancing", "Inspection coordination"],
  Traceability: ["Tolerancing", "Manufacturing drawings", "Inspection coordination"],
  "Inspection coordination": ["Tolerancing", "Traceability", "Manufacturing drawings"],
};
export function CapMap() {
  const [a, setA] = useState("Reverse engineering");
  const pos = CAPS.map((_, i) => { const t = ((-90 + i * 40) * Math.PI) / 180; return [380 + Math.cos(t) * 280, 220 + Math.sin(t) * 170] as const; });
  const rel = REL[a] ?? [];
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.6fr_1fr]">
      <svg viewBox="0 0 760 440" className="hidden h-auto w-full md:block" role="group" aria-label="Aerospace CAD capability map">
        {CAPS.map((c, i) => { const on = c === a || rel.includes(c); return <path key={c} d={`M380 220L${pos[i][0]} ${pos[i][1]}`} {...ln(on ? A.cyan : "#334155", on ? 1.8 : 1)} strokeDasharray={on ? undefined : "3 4"} />; })}
        {rel.map((r) => { const i = CAPS.indexOf(a), j = CAPS.indexOf(r); return <path key={r} d={`M${pos[i][0]} ${pos[i][1]}Q380 220 ${pos[j][0]} ${pos[j][1]}`} {...ln(A.amber, 1.2)} className="rch-flow" />; })}
        <circle cx="380" cy="220" r="48" {...ln(A.cyan, 1.6)} fill={A.panel} /><T x="380" y="216" a="middle" size={11}>AEROSPACE</T><T x="380" y="232" a="middle" size={11}>CAD</T>
        {CAPS.map((c, i) => { const on = c === a, near = rel.includes(c), w = c.length * 7 + 22; return (
          <g key={c} role="button" tabIndex={0} aria-pressed={on} aria-label={`${c}; connects to ${(REL[c] ?? []).join(", ")}`} onClick={() => setA(c)} onPointerEnter={() => setA(c)} onFocus={() => setA(c)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setA(c); } }} style={{ cursor: "pointer", outline: "none" }}>
            <rect x={pos[i][0] - w / 2} y={pos[i][1] - 15} width={w} height="30" fill={on ? "#0E3A4A" : A.panel} stroke={on ? A.cyan : near ? A.amber : "#334155"} strokeWidth={on ? 2 : 1} />
            <T x={pos[i][0]} y={pos[i][1] + 4} a="middle" size={10.5} c={on ? "#fff" : near ? "#FDE68A" : A.ink}>{c.toUpperCase()}</T>
          </g>
        ); })}
      </svg>
      <ul className="grid grid-cols-2 gap-2 md:hidden">{CAPS.map((c) => <li key={c}><button type="button" aria-pressed={a === c} onClick={() => setA(c)} className={cn(tab(a === c), "w-full text-left")}>{c}</button></li>)}</ul>
      <div key={a} data-in="true" className="self-center border border-slate-700 bg-[#111722] p-5">
        <p className="fade-in font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">{a}</p>
        <p className="fade-in mt-2 text-sm text-slate-300">Connects to:</p>
        <ul className="fade-in mt-2 flex flex-wrap gap-1.5">{rel.map((r) => <li key={r} className="border border-amber-400/60 px-2 py-0.5 font-mono text-[10px] uppercase text-amber-100">{r}</li>)}</ul>
      </div>
    </div>
  );
}

export function SoftwareLink({ slug, name }: { slug: string; name: string }) {
  return <Link href={`/software/${slug}`} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-white underline-offset-4 hover:text-cyan-300 hover:underline">Explore {name} <ArrowRight className="h-4 w-4" aria-hidden /></Link>;
}
