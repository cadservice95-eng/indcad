import type { ReactNode } from "react";
import { makeIso, seg, loop, type P } from "@/components/svg/iso";

/**
 * One illustrative process plant (isometric) with three numbered lines. The same line routes
 * drive the plant model, the piping isometric and the line list. Illustrative only.
 */
export const O = {
  bg: "#0B1215", panel: "#111B1F", raise: "#17242A", pipe: "#34D399", equip: "#C4B5FD", steel: "#93C5FD", sup: "#FBBF24", civil: "#94A3B8",
  ink: "#E5E7EB", mute: "#64748B", paper: "#F7F8F6", red: "#F87171", hot: "#FDE047",
};
export const mono = { fontFamily: "var(--font-mono)" } as const;
export const ln = (c: string, w = 1.3) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;
export function T({ x, y, c = O.ink, size = 9, a = "start", children, w }: { x: number | string; y: number | string; c?: string; size?: number; a?: "start" | "middle" | "end"; children: ReactNode; w?: number }) {
  return <text x={x} y={y} fill={c} fontSize={size} textAnchor={a} fontWeight={w} style={mono}>{children}</text>;
}
export function Fade({ on, children, dim = 0 }: { on: boolean; children: ReactNode; dim?: number }) {
  return <g style={{ opacity: on ? 1 : dim, transition: "opacity .5s ease" }}>{children}</g>;
}
export function Grid({ w, h, step = 20, light }: { w: number; h: number; step?: number; light?: boolean }) {
  return <g stroke={light ? "#0F766E" : "#34D399"} strokeOpacity={light ? 0.07 : 0.05}>{Array.from({ length: Math.ceil(w / step) + 1 }, (_, i) => <path key={i} d={`M${i * step} 0V${h}`} />)}{Array.from({ length: Math.ceil(h / step) + 1 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * step}H${w}`} />)}</g>;
}

export type Layer = "piping" | "equipment" | "structural" | "supports" | "civil" | "docs";
export const LAYER_NAME: Record<Layer, string> = { piping: "Piping", equipment: "Equipment", structural: "Structural", supports: "Supports", civil: "Civil", docs: "Documentation" };
type V3 = [number, number, number];
export type LineId = "L-001" | "L-002" | "L-003";
export const LINES: Record<LineId, V3[]> = {
  "L-001": [[52, 40, 50], [52, 64, 50], [52, 64, 37], [170, 64, 37], [170, 88, 37], [170, 88, 44], [170, 104, 44]],
  "L-002": [[40, 95, 8], [40, 72, 8], [40, 72, 37], [150, 72, 37], [150, 48, 37], [150, 48, 18]],
  "L-003": [[148, 110, 4], [60, 110, 4], [60, 95, 4], [60, 95, 8]],
};
export const LINE_IDS = Object.keys(LINES) as LineId[];
const VALVES: Record<LineId, V3> = { "L-001": [110, 64, 37], "L-002": [40, 72, 22], "L-003": [104, 110, 4] };

type Iso = (x: number, y: number, z: number) => P;
export const ogIso = (ox = 230, oy = 120, s = 1.3): Iso => makeIso(ox, oy, s);
function cyl(p: Iso, cx: number, cy: number, z0: number, z1: number, r: number) {
  const at = (t: number, z: number) => p(cx + Math.cos(t) * r, cy + Math.sin(t) * r, z);
  const arc = (z: number, a: number, b: number) => Array.from({ length: 25 }, (_, k) => at(a + ((b - a) * k) / 24, z));
  return { top: seg(...arc(z1, 0, Math.PI * 2)) + "Z", body: seg(at(-Math.PI / 4, z1), ...arc(z0, -Math.PI / 4, (3 * Math.PI) / 4), at((3 * Math.PI) / 4, z1)) + "Z" };
}
function box(p: Iso, x: number, y: number, z: number, W: number, D: number, H: number) {
  return [loop(p(x, y + D, z + H), p(x + W, y + D, z + H), p(x + W, y + D, z), p(x, y + D, z)), loop(p(x + W, y, z + H), p(x + W, y, z), p(x + W, y + D, z), p(x + W, y + D, z + H)), loop(p(x, y, z + H), p(x + W, y, z + H), p(x + W, y + D, z + H), p(x, y + D, z + H))];
}
function Valve({ q, c }: { q: P; c: string }) {
  return <path d={`M${q[0] - 6} ${q[1] - 4}L${q[0] + 6} ${q[1] + 4}L${q[0] + 6} ${q[1] - 4}L${q[0] - 6} ${q[1] + 4}Z`} {...ln(c, 1.2)} fill={O.bg} />;
}
function LG({ o, children }: { o: number; children: ReactNode }) {
  return <g style={{ opacity: o, transition: "opacity .5s ease" }}>{children}</g>;
}

export type PlantProps = { focus?: Layer[] | null; show?: Layer[]; line?: LineId | null; onLine?: (l: LineId) => void; mod?: number; flow?: boolean; clearance?: boolean; ox?: number; oy?: number; s?: number };
/** mod: 0 existing · 1 +new equipment · 2 +modified piping · 3 +additional steel · 4 +updated documentation */
export function Plant({ focus, show, line, onLine, mod = 0, flow, clearance, ox, oy, s }: PlantProps) {
  const p = ogIso(ox, oy, s);
  const op = (l: Layer) => (show && !show.includes(l) ? 0 : focus && focus.length && !focus.includes(l) ? 0.15 : 1);
  const hot = (l: Layer) => !!focus && focus.includes(l);
  const cols = [20, 60, 100, 140, 180];
  const v = cyl(p, 40, 40, 0, 70, 12), tk = cyl(p, 170, 110, 0, 40, 22);
  const route = (id: LineId) => seg(...LINES[id].map((q) => p(...q)));
  return (
    <g>
      {/* civil: foundations */}
      <LG o={op("civil")}>
        <g {...ln(hot("civil") ? "#fff" : O.civil, 1)}>
          {[[26, 26, 28, 28], [146, 86, 48, 48], [32, 88, 36, 16], [140, 22, 34, 26]].map(([x, y, w, d], i) => <path key={i} d={loop(p(x, y, 0), p(x + w, y, 0), p(x + w, y + d, 0), p(x, y + d, 0))} fill={O.civil} fillOpacity={hot("civil") ? 0.25 : 0.08} />)}
          {cols.flatMap((x) => [60, 76].map((y) => <path key={`${x}${y}`} d={loop(p(x - 3, y - 3, 0), p(x + 3, y - 3, 0), p(x + 3, y + 3, 0), p(x - 3, y + 3, 0))} fill={O.civil} fillOpacity="0.3" />))}
        </g>
      </LG>
      {/* structural: pipe rack + platform */}
      <LG o={op("structural")}>
        <g {...ln(hot("structural") ? "#fff" : O.steel, hot("structural") ? 2 : 1.5)}>
          {cols.flatMap((x) => [60, 76].map((y) => <path key={`${x}${y}`} d={seg(p(x, y, 0), p(x, y, 36))} />))}
          {[24, 36].map((z) => <g key={z}><path d={seg(p(20, 60, z), p(180, 60, z))} /><path d={seg(p(20, 76, z), p(180, 76, z))} />{cols.map((x) => <path key={x} d={seg(p(x, 60, z), p(x, 76, z))} />)}</g>)}
          <path d={seg(p(20, 60, 0), p(60, 60, 24))} strokeWidth="0.8" /><path d={seg(p(140, 76, 0), p(180, 76, 24))} strokeWidth="0.8" />
          <path d={loop(p(24, 24, 44), p(58, 24, 44), p(58, 58, 44), p(24, 58, 44))} fill={O.steel} fillOpacity="0.08" />
          {[[24, 24], [58, 24], [58, 58], [24, 58]].map(([x, y]) => <path key={`${x}${y}`} d={seg(p(x, y, 0), p(x, y, 44))} strokeWidth="1" />)}
        </g>
        {mod >= 3 ? <g className="fade-in" data-in="true" {...ln(O.sup, 1.8)}>{[200, 216].map((x) => <path key={x} d={seg(p(x, 60, 0), p(x, 60, 36), p(x, 76, 36), p(x, 76, 0))} />)}<path d={seg(p(180, 60, 36), p(216, 60, 36))} /><path d={seg(p(180, 76, 36), p(216, 76, 36))} /></g> : null}
      </LG>
      {/* equipment */}
      <LG o={op("equipment")}>
        <g {...ln(hot("equipment") ? "#fff" : O.equip, hot("equipment") ? 1.8 : 1.2)}>
          <path d={v.body} fill={O.equip} fillOpacity="0.2" /><path d={v.top} fill={O.equip} fillOpacity="0.3" />
          <path d={tk.body} fill={O.equip} fillOpacity="0.16" /><path d={tk.top} fill={O.equip} fillOpacity="0.26" />
          {[[34, 90], [54, 90]].map(([x, y]) => <g key={x}>{box(p, x, y, 0, 12, 10, 8).map((d, i) => <path key={i} d={d} fill={O.equip} fillOpacity={0.2 + i * 0.05} />)}</g>)}
          {box(p, 140, 22, 0, 30, 22, 18).map((d, i) => <path key={i} d={d} fill={O.equip} fillOpacity={0.15 + i * 0.06} />)}
        </g>
        {mod >= 1 ? <g className="fade-in" data-in="true" {...ln(O.sup, 1.6)}>{(() => { const c = cyl(p, 205, 20, 0, 34, 9); return <><path d={c.body} fill={O.sup} fillOpacity="0.2" /><path d={c.top} fill={O.sup} fillOpacity="0.3" /></>; })()}</g> : null}
      </LG>
      {/* supports */}
      <LG o={op("supports")}>
        <g {...ln(hot("supports") ? "#fff" : O.sup, hot("supports") ? 1.8 : 1.2)}>
          {[40, 80, 120, 160].flatMap((x) => [64, 72].map((y) => <path key={`${x}${y}`} d={seg(p(x - 2, y, 36), p(x - 2, y, 37), p(x + 2, y, 37), p(x + 2, y, 36))} />))}
          {[80, 120].map((x) => <path key={x} d={`${seg(p(x, 110, 0), p(x, 110, 4))}${seg(p(x - 3, 110, 0), p(x + 3, 110, 0))}`} />)}
        </g>
      </LG>
      {/* piping */}
      <LG o={op("piping")}>
        {LINE_IDS.map((id) => {
          const on = line === id;
          const c = on ? O.hot : hot("piping") ? "#fff" : O.pipe;
          return (
            <g key={id} {...(onLine ? { role: "button", tabIndex: 0, "aria-pressed": on, "aria-label": `Line ${id}`, onClick: () => onLine(id), onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onLine(id); } }, style: { cursor: "pointer", outline: "none" } } : {})}>
              <path d={route(id)} {...ln("transparent", 10)} />
              <path d={route(id)} {...ln(c, on ? 3.2 : 2.2)} />
              {flow ? <path d={route(id)} {...ln(O.bg, 1)} strokeDasharray="3 9" className="rch-flow" /> : null}
              <Valve q={p(...VALVES[id])} c={c} />
            </g>
          );
        })}
        {mod >= 2 ? <g className="fade-in" data-in="true"><path d={seg(p(190, 64, 37), p(205, 64, 37), p(205, 30, 37), p(205, 20, 34))} {...ln(O.sup, 2.4)} /><path d={seg(p(170, 64, 37), p(190, 64, 37))} {...ln(O.sup, 2.4)} /></g> : null}
      </LG>
      {/* documentation */}
      <LG o={op("docs")}>
        {([[p(40, 40, 72), "V-101", -14, -14], [p(170, 110, 42), "T-201", 20, -16], [p(40, 95, 10), "P-101A/B", -78, 14], [p(155, 30, 20), "K-301", 26, -20], [p(100, 64, 38), "L-001", 6, -18], [p(100, 72, 38), "L-002", 6, 22], [p(100, 110, 5), "L-003", 6, 18]] as const).map(([q, l, dx, dy]) => (
          <g key={l}><path d={`M${q[0]} ${q[1]}l${dx} ${dy}`} {...ln(O.ink, 0.6)} /><rect x={q[0] + dx - (dx < 0 ? l.length * 5.6 + 8 : 0)} y={q[1] + dy - 8} width={l.length * 5.6 + 8} height="14" fill={O.bg} stroke={l.startsWith("L") ? O.pipe : O.equip} strokeWidth="0.8" /><T x={q[0] + dx - (dx < 0 ? l.length * 5.6 + 4 : -4)} y={q[1] + dy + 2.5} c={l.startsWith("L") ? O.pipe : O.equip} size={8}>{l}</T></g>
        ))}
        <g><path d={`M${p(150, 72, 50)[0] - 8} ${p(150, 72, 50)[1] + 6}h16l-8 -13z`} {...ln(O.red, 1.2)} fill="none" /><T x={p(150, 72, 50)[0]} y={p(150, 72, 50)[1] + 3} a="middle" c={O.red} size={7}>{mod >= 4 ? "C" : "B"}</T></g>
      </LG>
      {clearance ? <g className="fade-in" data-in="true">{[p(60, 72, 30), p(150, 50, 30), p(60, 100, 6)].map((q, i) => <g key={i}><circle cx={q[0]} cy={q[1]} r="16" {...ln(O.sup, 1.2)} strokeDasharray="4 3" className="rch-pulse" style={{ "--d": `${i * 400}ms` } as React.CSSProperties} /><T x={q[0] + 18} y={q[1] - 12} c={O.sup} size={8}>CLOSE APPROACH</T></g>)}</g> : null}
    </g>
  );
}

/* ───────── piping isometric (drawing view of one line) ───────── */
export function IsoDrawing({ id, light = true }: { id: LineId; light?: boolean }) {
  // Isometrics are schematic (not to scale): each straight run is drawn at a fixed length along its axis.
  const p0 = makeIso(0, 0, 1);
  const pts = LINES[id];
  const raw: [number, number, number][] = [[0, 0, 0]];
  pts.slice(1).forEach((b, k) => { const a = pts[k]; const d = [Math.sign(b[0] - a[0]), Math.sign(b[1] - a[1]), Math.sign(b[2] - a[2])]; const len = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]) + Math.abs(b[2] - a[2]); const L = Math.max(26, len * 0.85); const last = raw[raw.length - 1]; raw.push([last[0] + d[0] * L, last[1] + d[1] * L, last[2] + d[2] * L]); });
  const r2 = raw.map((v) => p0(...v));
  const xs = r2.map((v) => v[0]), ys = r2.map((v) => v[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const q = r2.map(([x, y]) => [x - cx + 175, y - cy + 140] as P);
  const ink = light ? "#0F172A" : O.ink;
  const mid = (a: P, b: P) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as const;
  return (
    <g>
      <path d={seg(...q)} {...ln(ink, 2.2)} />
      {q.slice(1, -1).map((pt, i) => <circle key={i} cx={pt[0]} cy={pt[1]} r="3" {...ln(ink, 1)} fill={light ? O.paper : O.bg} />)}
      <circle cx={q[0][0]} cy={q[0][1]} r="4" fill={ink} /><circle cx={q[q.length - 1][0]} cy={q[q.length - 1][1]} r="4" fill={ink} />
      {q.slice(0, -1).map((a, i) => { const b = q[i + 1], m = mid(a, b); return <g key={i}><T x={m[0] + 6} y={m[1] - 6} c={light ? "#0369A1" : O.steel} size={8}>{`d${i + 1}`}</T></g>; })}
      {(() => { const a = q[1], b = q[2], m = mid(a, b); return <path d={`M${m[0] - 5} ${m[1] - 4}l10 4l-10 4z`} fill={light ? "#059669" : O.pipe} />; })()}
      <rect x="10" y="10" width="86" height="20" {...ln(ink, 1)} fill="none" /><T x="16" y="24" c={ink} size={10} w={700}>{id}</T>
      <g transform="translate(300 34)"><path d="M0 0l12 7M0 0l-12 7M0 0V-14" {...ln(ink, 0.9)} /><T x="0" y="-18" a="middle" c={ink} size={7}>N</T></g>
    </g>
  );
}

/* ───────── plan views for brownfield + revisions ───────── */
export function PlanView({ variant, light }: { variant: "existing" | "current" | "A" | "B" | "C" | "D"; light?: boolean }) {
  const ink = light ? "#0F172A" : O.ink;
  const cur = variant === "current" || variant === "C" || variant === "D";
  const b = variant !== "A";
  return (
    <g>
      <g {...ln(ink, 1)}><rect x="60" y="150" width="360" height="40" strokeDasharray="0" />{[60, 150, 240, 330, 420].map((x) => <path key={x} d={`M${x} 150v40`} />)}</g>
      <circle cx="110" cy="80" r="26" {...ln(ink, 1.4)} />
      {cur ? <rect x="292" y="58" width="72" height="50" {...ln(ink, 1.4)} /> : <rect x="300" y="64" width="56" height="40" {...ln(ink, 1.4)} />}
      <circle cx="380" cy="250" r="40" {...ln(ink, 1.4)} />
      <path d="M110 106V160H380V210" {...ln(light ? "#059669" : O.pipe, 2.2)} />
      {variant === "existing" || variant === "A" ? <path d="M136 80H230V160" {...ln(light ? "#059669" : O.pipe, 2.2)} /> : null}
      {b ? <path d="M90 250V180H200" {...ln(light ? "#059669" : O.pipe, 2.2)} /> : <path d="M90 250V200H200V180" {...ln(light ? "#059669" : O.pipe, 2.2)} />}
      {cur ? <rect x="196" y="40" width="80" height="34" {...ln(light ? "#B45309" : O.sup, 1.4)} strokeDasharray="5 3" /> : null}
      {variant === "D" ? <g><circle cx="460" cy="90" r="18" {...ln(light ? "#B45309" : O.sup, 1.6)} /><path d="M420 160H460V108" {...ln(light ? "#B45309" : O.sup, 2.2)} /></g> : null}
      {cur ? <path d="M230 150v-20h40v20" {...ln(ink, 1.2)} /> : null}
    </g>
  );
}
