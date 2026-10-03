import type { ReactNode } from "react";
import { makeIso, seg, loop, type P } from "@/components/svg/iso";

/**
 * One illustrative mineral-processing plant (isometric) drives the hero, discipline viewer,
 * evidence board and software views. Layers: site, civil, structure, equipment, access, docs.
 */
export const M = {
  bg: "#08111D", panel: "#0D1826", raise: "#142235", blue: "#1D4ED8", sky: "#38BDF8", ink: "#E5E7EB", paper: "#F8FAFC", mute: "#64748B",
  amber: "#D6A84F", steel: "#7DD3FC", equip: "#A5B4FC", civil: "#86EFAC", red: "#F87171",
};
export const mono = { fontFamily: "var(--font-mono)" } as const;
export const ln = (c: string, w = 1.3) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;
export function T({ x, y, c = M.ink, size = 9, a = "start", children, w }: { x: number | string; y: number | string; c?: string; size?: number; a?: "start" | "middle" | "end"; children: ReactNode; w?: number }) {
  return <text x={x} y={y} fill={c} fontSize={size} textAnchor={a} fontWeight={w} style={mono}>{children}</text>;
}
export function Fade({ on, children, dim = 0 }: { on: boolean; children: ReactNode; dim?: number }) {
  return <g style={{ opacity: on ? 1 : dim, transition: "opacity .5s ease" }}>{children}</g>;
}
export function Grid({ w, h, step = 20 }: { w: number; h: number; step?: number }) {
  return <g stroke="#38BDF8" strokeOpacity="0.06">{Array.from({ length: Math.ceil(w / step) + 1 }, (_, i) => <path key={i} d={`M${i * step} 0V${h}`} />)}{Array.from({ length: Math.ceil(h / step) + 1 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * step}H${w}`} />)}</g>;
}

function LG({ o, children }: { o: number; children: ReactNode }) {
  return <g style={{ opacity: o, transition: "opacity .55s ease" }}>{children}</g>;
}

export type Layer = "site" | "civil" | "structure" | "equipment" | "access" | "docs";
export const LAYERS: Layer[] = ["site", "structure", "equipment", "access", "civil", "docs"];
export const LAYER_NAME: Record<Layer, string> = { site: "Site", structure: "Structure", equipment: "Equipment", access: "Access", civil: "Civil", docs: "Documentation" };

type Iso = (x: number, y: number, z: number) => P;
export const plantIso = (): Iso => makeIso(236, 104, 1.38);

function cyl(p: Iso, cx: number, cy: number, z0: number, z1: number, r: number) {
  const at = (t: number, z: number) => p(cx + Math.cos(t) * r, cy + Math.sin(t) * r, z);
  const arc = (z: number, from: number, to: number) => Array.from({ length: 25 }, (_, k) => at(from + ((to - from) * k) / 24, z));
  const front = arc(z0, -Math.PI / 4, (3 * Math.PI) / 4), b1 = at((3 * Math.PI) / 4, z1), a1 = at(-Math.PI / 4, z1);
  return { top: seg(...arc(z1, 0, Math.PI * 2)) + "Z", body: seg(a1, ...front, b1) + "Z" };
}

/**
 * Plant model. `focus` isolates layers (others dim); `show` hides layers entirely (for build-up);
 * `overlay` adds evidence-board overlays.
 */
export function Plant({ focus, show, overlay }: { focus?: Layer[] | null; show?: Layer[]; overlay?: "photo" | "survey" | "drawing" | null }) {
  const p = plantIso();
  const vis = (l: Layer) => !show || show.includes(l);
  const op = (l: Layer) => (!vis(l) ? 0 : focus && focus.length && !focus.includes(l) ? 0.18 : 1);
  const hot = (l: Layer) => !!focus && focus.includes(l);
  const cols: [number, number][] = [[60, 30], [100, 30], [140, 30], [60, 90], [100, 90], [140, 90]];
  const v = cyl(p, 100, 60, 35, 66, 13);
  const conv = [p(196, 128, 0), p(140, 60, 70)];
  const convW = [p(204, 122, 0), p(148, 54, 70)];
  return (
    <g>
      {/* site */}
      <LG o={op("site")}>
        <path d={loop(p(0, 0, 0), p(210, 0, 0), p(210, 140, 0), p(0, 140, 0))} fillOpacity="0.04" {...ln(hot("site") ? "#fff" : M.mute, hot("site") ? 1.6 : 1)} fill={M.sky} strokeDasharray="6 4" />
        <T x={p(210, 0, 0)[0] + 6} y={p(210, 0, 0)[1] + 4} c={M.mute} size={8}>SITE BOUNDARY</T>
      </LG>
      {/* civil */}
      <LG o={op("civil")}>
        <path d={loop(p(0, 108, 0), p(210, 108, 0), p(210, 124, 0), p(0, 124, 0))} fillOpacity={hot("civil") ? 0.22 : 0.1} {...ln(M.civil, hot("civil") ? 1.6 : 1)} fill={M.civil} />
        <path d={seg(p(0, 116, 0), p(210, 116, 0))} {...ln(M.civil, 0.8)} strokeDasharray="8 6" />
        <path d={seg(p(0, 134, 0), p(210, 134, 0))} {...ln(M.sky, 1.4)} strokeDasharray="3 4" className="rch-flow" />
        <path d={loop(p(52, 22, 0), p(148, 22, 0), p(148, 98, 0), p(52, 98, 0))} {...ln(M.civil, 0.9)} strokeDasharray="2 3" />
        <T x={p(90, 134, 0)[0] - 20} y={p(90, 134, 0)[1] + 16} c={M.civil} size={8}>ACCESS ROAD · DRAINAGE</T>
      </LG>
      {/* equipment under platform */}
      <LG o={op("equipment")}>
        {(() => { const b = (x: number, y: number, z: number, w: number, d: number, h: number) => { const A = p(x, y, z + h), B = p(x + w, y, z + h), C = p(x + w, y + d, z + h), D = p(x, y + d, z + h), E = p(x + w, y, z), F = p(x + w, y + d, z), Gp = p(x, y + d, z); return [loop(A, B, C, D), loop(B, E, F, C), loop(D, C, F, Gp)]; }; return b(76, 42, 0, 46, 36, 22).map((d, i) => <path key={i} d={d} fillOpacity={[0.4, 0.2, 0.3][i]} {...ln(hot("equipment") ? "#fff" : M.equip, hot("equipment") ? 1.6 : 1.1)} fill={M.equip} />); })()}
        <T x={p(122, 78, 10)[0] + 6} y={p(122, 78, 10)[1] + 4} c={M.equip} size={8}>FEEDER</T>
      </LG>
      {/* structure */}
      <LG o={op("structure")}>
        <g {...ln(hot("structure") ? "#fff" : M.steel, hot("structure") ? 2.2 : 1.6)}>
          {cols.map(([x, y]) => <path key={`${x}${y}`} d={seg(p(x, y, 0), p(x, y, 70))} />)}
          {[35, 70].map((z) => <path key={z} d={seg(p(60, 30, z), p(140, 30, z), p(140, 90, z), p(60, 90, z), p(60, 30, z))} />)}
          <path d={seg(p(100, 30, 70), p(100, 90, 70))} /><path d={seg(p(60, 30, 0), p(100, 30, 35))} strokeWidth="1" /><path d={seg(p(140, 90, 0), p(100, 90, 35))} strokeWidth="1" />
        </g>
        <path d={loop(p(60, 30, 35), p(140, 30, 35), p(140, 90, 35), p(60, 90, 35))} fillOpacity={hot("structure") ? 0.2 : 0.1} {...ln(M.steel, 0.6)} fill={M.steel} />
      </LG>
      {/* equipment on platform + conveyor */}
      <LG o={op("equipment")}>
        <path d={v.body} fillOpacity="0.28" {...ln(hot("equipment") ? "#fff" : M.equip, hot("equipment") ? 1.8 : 1.2)} fill={M.equip} />
        <path d={v.top} fillOpacity="0.4" {...ln(hot("equipment") ? "#fff" : M.equip, 1.2)} fill={M.equip} />
        <path d={`M${conv[0][0]} ${conv[0][1]}L${conv[1][0]} ${conv[1][1]}L${convW[1][0]} ${convW[1][1]}L${convW[0][0]} ${convW[0][1]}Z`} fillOpacity="0.25" {...ln(hot("equipment") ? "#fff" : M.equip, 1.3)} fill={M.equip} />
        {[0.25, 0.5, 0.75].map((t) => { const a = [conv[0][0] + (conv[1][0] - conv[0][0]) * t, conv[0][1] + (conv[1][1] - conv[0][1]) * t]; return <path key={t} d={`M${a[0]} ${a[1]}v${36 * (1 - t) + 6}`} {...ln(M.steel, 1)} />; })}
        <T x={convW[1][0] + 10} y={convW[1][1] + 4} c={M.equip} size={8}>CONVEYOR</T>
      </LG>
      {/* access */}
      <LG o={op("access")}>
        <g {...ln(hot("access") ? "#fff" : M.amber, hot("access") ? 1.8 : 1.3)}>
          <path d={seg(...Array.from({ length: 8 }, (_, k) => [p(30 + k * 4, 90, k * 5), p(34 + k * 4, 90, k * 5)]).flat(), p(60, 90, 35))} />
          <path d={seg(p(28, 90, 10), p(60, 90, 45))} strokeWidth="0.9" />
          <path d={seg(p(60, 90, 45), p(140, 90, 45), p(140, 30, 45))} strokeWidth="1" />
          {[60, 80, 100, 120, 140].map((x) => <path key={x} d={seg(p(x, 90, 35), p(x, 90, 45))} strokeWidth="0.8" />)}
          <path d={loop(p(140, 52, 35), p(168, 52, 35), p(168, 68, 35), p(140, 68, 35))} fill={M.amber} fillOpacity="0.15" />
        </g>
        <T x={p(30, 90, 30)[0] - 92} y={p(30, 90, 30)[1]} c={M.amber} size={8}>STAIR · HANDRAIL</T>
      </LG>
      {/* documentation callouts */}
      <LG o={op("docs")}>
        {([[p(60, 30, 70), -70, -18, "GA · STRUCTURE"], [p(100, 60, 66), 60, -40, "EQUIPMENT TAG"], [p(140, 90, 35), 70, 26, "PLATFORM EL."], [p(196, 128, 0), 30, -60, "SITE / CIVIL DWG"]] as const).map(([at, dx, dy, l]) => <g key={l}><circle cx={at[0]} cy={at[1]} r="2.6" fill={M.sky} /><path d={`M${at[0]} ${at[1]}l${dx} ${dy}`} {...ln(M.sky, 0.8)} /><rect x={dx > 0 ? at[0] + dx : at[0] + dx - l.length * 5.6 - 10} y={at[1] + dy - 8} width={l.length * 5.6 + 10} height="15" fill={M.bg} stroke={M.sky} strokeWidth="0.7" /><T x={dx > 0 ? at[0] + dx + 5 : at[0] + dx - l.length * 5.6 - 5} y={at[1] + dy + 3} c={M.sky} size={8}>{l}</T></g>)}
      </LG>
      {/* evidence overlays */}
      {overlay === "photo" ? <g className="fade-in" data-in="true"><path d={`M${p(150, 150, 0)[0] + 70} ${p(150, 150, 0)[1] + 10}L${p(140, 30, 70)[0]} ${p(140, 30, 70)[1]}M${p(150, 150, 0)[0] + 70} ${p(150, 150, 0)[1] + 10}L${p(60, 90, 0)[0]} ${p(60, 90, 0)[1]}`} {...ln(M.amber, 1)} strokeDasharray="4 3" /><rect x={p(150, 150, 0)[0] + 58} y={p(150, 150, 0)[1]} width="24" height="18" fill={M.bg} stroke={M.amber} /><circle cx={p(150, 150, 0)[0] + 70} cy={p(150, 150, 0)[1] + 9} r="5" {...ln(M.amber, 1)} /><path d={loop(p(60, 30, 70), p(140, 30, 70), p(140, 90, 0), p(60, 90, 0))} fill={M.amber} fillOpacity="0.07" /></g> : null}
      {overlay === "survey" ? <g className="fade-in" data-in="true">{[...cols.map(([x, y]) => p(x, y, 0)), p(0, 0, 0), p(210, 0, 0), p(210, 140, 0), p(0, 140, 0), p(196, 128, 0)].map((q, i) => <g key={i}><path d={`M${q[0] - 6} ${q[1]}h12M${q[0]} ${q[1] - 6}v12`} {...ln(M.civil, 1.2)} /><circle cx={q[0]} cy={q[1]} r="3.5" {...ln(M.civil, 0.8)} /></g>)}</g> : null}
      {overlay === "drawing" ? <g className="fade-in" data-in="true"><path d={loop(p(56, 26, 0), p(144, 26, 0), p(144, 94, 0), p(56, 94, 0))} {...ln("#fff", 1.2)} strokeDasharray="8 3 2 3" /><path d={seg(p(100, 20, 0), p(100, 100, 0))} {...ln(M.red, 0.8)} strokeDasharray="8 3 2 3" /><path d={seg(p(50, 60, 0), p(150, 60, 0))} {...ln(M.red, 0.8)} strokeDasharray="8 3 2 3" /></g> : null}
    </g>
  );
}

/* ───────── brownfield plan overlay (original vs current) ───────── */
export function PlanOverlay({ t }: { t: number }) {
  const o = 1 - Math.min(1, t * 1.6), c = Math.min(1, Math.max(0, (t - 0.25) * 1.6)), diff = t > 0.35;
  const O = ln("#CBD5E1", 1.4), N = ln(M.sky, 1.6);
  return (
    <svg viewBox="0 0 520 320" className="mx-auto block h-auto w-full max-w-[860px]" role="img" aria-label={`Brownfield plan overlay — ${t < 0.35 ? "original drawing" : t < 0.75 ? "reconciliation" : "current condition"}`}>
      <title>Illustrative brownfield overlay: original drawing versus current site condition</title>
      <rect width="520" height="320" fill={M.bg} /><Grid w={520} h={320} />
      <g style={{ opacity: o, transition: "opacity .2s" }}>
        <rect x="120" y="70" width="200" height="140" {...O} strokeDasharray="0" /><rect x="170" y="110" width="70" height="60" {...O} /><path d="M90 200h30M90 190h30M90 180h30" {...O} /><path d="M320 140H440" {...O} strokeWidth="5" strokeOpacity="0.6" /><rect x="250" y="80" width="40" height="22" {...O} />
        <T x="120" y="62" c="#CBD5E1" size={9}>ORIGINAL</T>
      </g>
      <g style={{ opacity: c, transition: "opacity .2s" }}>
        <rect x="120" y="70" width="230" height="140" {...N} /><rect x="160" y="104" width="86" height="70" {...N} /><path d="M330 220h20M330 230h20M330 240h20" {...N} /><path d="M350 120H460" {...N} strokeWidth="5" strokeOpacity="0.6" /><rect x="250" y="40" width="80" height="30" {...N} strokeDasharray="4 2" /><rect x="296" y="80" width="40" height="22" {...N} />
        <T x="352" y="62" c={M.sky} size={9}>CURRENT / AS-BUILT</T>
      </g>
      <g style={{ opacity: diff ? 1 : 0, transition: "opacity .35s" }}>
        {([[335, 140, "PLATFORM EXTENDED"], [203, 139, "EQUIPMENT FOOTPRINT"], [340, 230, "STAIR RELOCATED"], [290, 55, "ADDED ACCESS PLATFORM"], [405, 130, "CONVEYOR / PIPE REROUTED"], [316, 91, "OPENING MOVED"]] as const).map(([x, y, l], i) => (
          <g key={l}><circle cx={x} cy={y} r="11" {...ln(M.amber, 1.4)} /><T x={x} y={y + 3.5} a="middle" c={M.amber} size={9} w={700}>{i + 1}</T></g>
        ))}
        <T x="20" y="300" c={M.amber} size={9}>DIFFERENCE IDENTIFIED · NOT ASSESSED AS ERRORS</T>
      </g>
      <T x="500" y="300" a="end" c={M.mute} size={9}>ILLUSTRATIVE PLAN</T>
    </svg>
  );
}
export const DIFFS = ["Platform extended", "Equipment footprint changed", "Stair relocated", "Access platform added", "Conveyor / pipe rerouted", "Opening moved"];
