import type { ReactNode } from "react";

/**
 * One illustrative energy site in plan view (600 × 400): array blocks, inverter stations, roads,
 * drainage, collection cables, substation/switchyard and grid exit. Illustrative only — no capacities.
 */
export const E = {
  bg: "#0B0F1A", panel: "#121829", raise: "#18203A", civil: "#D6B370", steel: "#7DD3FC", elec: "#FACC15", ink: "#E5E7EB", mute: "#64748B",
  paper: "#F7F7F4", water: "#60A5FA", red: "#F87171", ok: "#4ADE80",
};
export const mono = { fontFamily: "var(--font-mono)" } as const;
export const ln = (c: string, w = 1.3) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;
export function T({ x, y, c = E.ink, size = 9, a = "start", children, w }: { x: number | string; y: number | string; c?: string; size?: number; a?: "start" | "middle" | "end"; children: ReactNode; w?: number }) {
  return <text x={x} y={y} fill={c} fontSize={size} textAnchor={a} fontWeight={w} style={mono}>{children}</text>;
}
export function Fade({ on, children, dim = 0 }: { on: boolean; children: ReactNode; dim?: number }) {
  return <g style={{ opacity: on ? 1 : dim, transition: "opacity .5s ease" }}>{children}</g>;
}
export function Grid({ w, h, step = 20, light }: { w: number; h: number; step?: number; light?: boolean }) {
  return <g stroke={light ? "#1E293B" : "#7DD3FC"} strokeOpacity={light ? 0.05 : 0.045}>{Array.from({ length: Math.ceil(w / step) + 1 }, (_, i) => <path key={i} d={`M${i * step} 0V${h}`} />)}{Array.from({ length: Math.ceil(h / step) + 1 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * step}H${w}`} />)}</g>;
}

export type Layer = "site" | "civil" | "structural" | "electrical" | "docs";
export const LAYER_NAME: Record<Layer, string> = { site: "Site layout", civil: "Civil", structural: "Structural", electrical: "Electrical", docs: "Documentation" };
export type Hot = "generation" | "collection" | "substation" | "interconnection" | null;

export const BLOCKS = [
  { x: 60, y: 70, w: 130, h: 100, ph: 1 }, { x: 210, y: 70, w: 130, h: 100, ph: 1 },
  { x: 60, y: 200, w: 130, h: 100, ph: 2 }, { x: 210, y: 200, w: 130, h: 100, ph: 2 },
  { x: 60, y: 315, w: 130, h: 60, ph: 3 }, { x: 210, y: 315, w: 130, h: 60, ph: 3 },
];
const BOUNDARY = "M30 40L380 30L420 60L570 70L585 360L380 390L30 385Z";
const SS = { x: 430, y: 150, w: 120, h: 110 };

/**
 * focus: dim other layers · show: hide layers entirely · phase: show blocks up to phase (shared infra always)
 * asbuilt: as-built variant · hot: single-line ↔ site highlight
 */
export function SitePlan({ focus, show, phase = 3, asbuilt, hot, terrain = "proposed" }: { focus?: Layer[] | null; show?: Layer[]; phase?: number; asbuilt?: boolean; hot?: Hot; terrain?: "existing" | "proposed" | "none" }) {
  const op = (l: Layer) => (show && !show.includes(l) ? 0 : focus && focus.length && !focus.includes(l) ? 0.14 : 1);
  const on = (l: Layer) => !!focus && focus.includes(l);
  const G = (l: Layer, children: ReactNode) => <g style={{ opacity: op(l), transition: "opacity .5s ease" }}>{children}</g>;
  const blocks = BLOCKS.filter((b) => b.ph <= phase);
  const inv = (b: (typeof BLOCKS)[number], i: number) => ({ x: b.x + b.w + (asbuilt && i === 1 ? 4 : 6), y: b.y + b.h / 2 + (asbuilt && i === 1 ? 14 : 0) });
  const hl = (h: Hot) => hot === h;
  return (
    <g>
      {G("site", <g>
        <path d={BOUNDARY} fillOpacity="0.03" {...ln(on("site") ? "#fff" : E.mute, on("site") ? 1.8 : 1.2)} fill={E.civil} strokeDasharray="8 5" />
        <T x="36" y="56" c={E.mute} size={8}>SITE BOUNDARY</T>
      </g>)}
      {G("civil", <g>
        {terrain !== "none" ? <g {...ln(E.civil, 0.8)} strokeOpacity={terrain === "existing" ? 0.7 : 0.35}>{[0, 1, 2, 3].map((k) => <path key={k} d={terrain === "existing" ? `M30 ${110 + k * 70}C150 ${80 + k * 75} 260 ${140 + k * 60} 380 ${100 + k * 70}S520 ${120 + k * 66} 585 ${110 + k * 70}` : `M30 ${110 + k * 70}C150 ${100 + k * 72} 260 ${118 + k * 66} 380 ${108 + k * 70}S520 ${116 + k * 68} 585 ${112 + k * 70}`} />)}</g> : null}
        {terrain !== "existing" ? <g>
          <path d={`M30 190H${asbuilt ? 205 : 200}V190H420`} {...ln(E.civil, 9)} strokeOpacity={on("civil") ? 0.6 : 0.35} />
          <path d="M200 45V385" {...ln(E.civil, 6)} strokeOpacity={on("civil") ? 0.5 : 0.28} />
          <path d={asbuilt ? "M420 190H436" : "M420 190H430"} {...ln(E.civil, 9)} strokeOpacity="0.35" />
          <path d="M40 380C200 372 380 382 575 352" {...ln(E.water, 1.4)} strokeDasharray="6 4" />
          <T x="40" y="184" c={E.civil} size={8}>ACCESS ROAD</T><T x="470" y="370" c={E.water} size={8}>DRAINAGE</T>
        </g> : null}
      </g>)}
      {G("structural", <g>
        {blocks.map((b, i) => (
          <g key={i} {...ln(on("structural") ? "#fff" : E.steel, on("structural") ? 1.1 : 0.8)} style={{ opacity: hl("generation") || !hot ? 1 : 0.35, transition: "opacity .4s" }}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} strokeOpacity="0.5" />
            {Array.from({ length: Math.floor(b.h / 12) }, (_, r) => <path key={r} d={`M${b.x + 6} ${b.y + 8 + r * 12}H${b.x + b.w - 6}`} strokeWidth={hl("generation") ? 2.4 : 1.6} stroke={hl("generation") ? E.elec : undefined} />)}
          </g>
        ))}
        <g {...ln(on("structural") ? "#fff" : E.steel, 1.4)}>{[0, 1, 2].map((k) => <path key={k} d={`M${SS.x + 14 + k * 34} ${SS.y + 14}V${SS.y + 60}M${SS.x + 6 + k * 34} ${SS.y + 14}H${SS.x + 22 + k * 34}`} />)}{asbuilt ? <path d={`M${SS.x + 108} ${SS.y + 14}V${SS.y + 60}`} stroke={E.civil} /> : null}</g>
        {blocks.map((b, i) => { const v = inv(b, i); return <rect key={i} x={v.x - 6} y={v.y - 6} width="12" height="12" {...ln(E.steel, 1)} fill={E.bg} />; })}
      </g>)}
      {G("electrical", <g>
        {blocks.map((b, i) => { const v = inv(b, i); const route = asbuilt && i === 3 ? `M${v.x} ${v.y}H${v.x + 22}V${SS.y + 80}H${SS.x}` : `M${v.x} ${v.y}H${v.x + 14}V${SS.y + 60 + i * 6}H${SS.x}`; return <path key={i} d={route} {...ln(hl("collection") ? "#fff" : E.elec, hl("collection") ? 2.2 : 1.3)} strokeDasharray={on("electrical") || hl("collection") ? undefined : "1 0"} className={hl("collection") ? "rch-flow" : undefined} />; })}
        <rect x={SS.x} y={SS.y} width={SS.w} height={SS.h} fillOpacity={hl("substation") ? 0.16 : 0.05} {...ln(hl("substation") ? "#fff" : E.elec, hl("substation") ? 2.2 : 1.3)} fill={E.elec} />
        {[0, 1].map((k) => <g key={k} {...ln(E.elec, 1.2)}><circle cx={SS.x + 40 + k * 40} cy={SS.y + 86} r="9" /><circle cx={SS.x + 40 + k * 40} cy={SS.y + 96} r="9" /></g>)}
        <path d={`M${SS.x + SS.w} ${SS.y + 40}H592`} {...ln(hl("interconnection") ? "#fff" : E.elec, hl("interconnection") ? 3 : 2)} />
        <g {...ln(hl("interconnection") ? "#fff" : E.elec, 1.2)}><path d="M588 172l6 -12l6 12M594 160V200" /></g>
        <T x={SS.x + 4} y={SS.y - 6} c={E.elec} size={8}>SUBSTATION / SWITCHYARD</T>
        <T x="560" y={SS.y + 32} c={E.elec} size={8} a="end">TO GRID</T>
      </g>)}
      {G("docs", <g>
        {blocks.map((b, i) => <g key={i}><rect x={b.x + 4} y={b.y - 14} width="46" height="12" {...ln(E.steel, 0.7)} fill={E.bg} /><T x={b.x + 8} y={b.y - 5} c={E.steel} size={7}>{`BLK-0${i + 1}`}</T></g>)}
        {([[SS.x + 30, SS.y + 126, "SS-01 · SLD-001"], [SS.x + 160 - 140, SS.y + 64, "CR-01"]] as const).map(([x, y, l]) => <g key={l}><rect x={x - 4} y={y - 10} width={l.length * 5.6 + 8} height="13" {...ln(E.elec, 0.7)} fill={E.bg} /><T x={x} y={y} c={E.elec} size={7}>{l}</T></g>)}
        <g><path d="M548 60h16l-8 -13z" {...ln(E.red, 1.2)} /><T x="556" y="58" a="middle" c={E.red} size={7}>{asbuilt ? "AB" : "B"}</T></g>
      </g>)}
    </g>
  );
}
export function SiteSvg({ label, children, light, className, vb = "0 0 600 400" }: { label: string; children: ReactNode; light?: boolean; className?: string; vb?: string }) {
  const [, , w, h] = vb.split(" ").map(Number);
  return <svg viewBox={vb} className={className ?? "block h-auto w-full"} role="img" aria-label={label}><title>{label}</title><rect width={w} height={h} fill={light ? E.paper : E.bg} /><Grid w={w} h={h} light={light} />{children}</svg>;
}
