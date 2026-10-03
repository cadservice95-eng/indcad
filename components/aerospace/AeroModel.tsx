import type { ReactNode } from "react";
import { makeIso, seg, loop, type P } from "@/components/svg/iso";

/**
 * One generic machined lug fitting drives every view: base flange (4-hole pattern, pocket),
 * upright lug with bearing bore, centre gusset. Illustrative geometry, no real values.
 */
export const A = {
  bg: "#0A0E15", panel: "#111722", raise: "#18202E", blue: "#2563EB", cyan: "#22D3EE", ink: "#E5E7EB", paper: "#FFFFFF", mute: "#64748B",
  amber: "#F5B544", green: "#4ADE80", red: "#F87171", violet: "#A78BFA",
};
export const mono = { fontFamily: "var(--font-mono)" } as const;
export const ln = (c: string, w = 1.3) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;
export function T({ x, y, c = A.ink, size = 9, a = "start", children, w }: { x: number | string; y: number | string; c?: string; size?: number; a?: "start" | "middle" | "end"; children: ReactNode; w?: number }) {
  return <text x={x} y={y} fill={c} fontSize={size} textAnchor={a} fontWeight={w} style={mono}>{children}</text>;
}
export function Fade({ on, children }: { on: boolean; children: ReactNode }) {
  return <g style={{ opacity: on ? 1 : 0, transition: "opacity .5s ease" }}>{children}</g>;
}
export function Grid({ w, h, step = 16, light }: { w: number; h: number; step?: number; light?: boolean }) {
  return <g stroke={light ? "#1E3A8A" : "#22D3EE"} strokeOpacity={light ? 0.06 : 0.05}>{Array.from({ length: Math.ceil(w / step) + 1 }, (_, i) => <path key={i} d={`M${i * step} 0V${h}`} />)}{Array.from({ length: Math.ceil(h / step) + 1 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * step}H${w}`} />)}</g>;
}

export type Feat = "hole" | "bore" | "locate" | "pattern" | "edge";
export const FEATS: { id: Feat; name: string; role: string; insp: string; basis: string }[] = [
  { id: "hole", name: "Mounting hole", role: "Clearance for the attachment fastener", insp: "Position / size check", basis: "Interface drawing" },
  { id: "bore", name: "Bearing seat", role: "Fit and rotation — tight functional control", insp: "Bore size & position", basis: "Engineering specification" },
  { id: "locate", name: "Locating surface", role: "Primary datum — seats the part in its assembly", insp: "Flatness reference", basis: "Datum scheme" },
  { id: "pattern", name: "Fastener interface", role: "Hole pattern relative to the mating part", insp: "Pattern position", basis: "Mating-part drawing" },
  { id: "edge", name: "Structural edge", role: "Lug edge distance carrying the load path", insp: "Profile / edge distance", basis: "Engineering specification" },
];

/* ───────── isometric lug ───────── */
type Iso = (x: number, y: number, z: number) => P;
const LUG_R = 20, LX = 60, LZ = 58;
function lugProfile(): [number, number][] {
  const pts: [number, number][] = [[40, 10], [80, 10], [80, LZ]];
  for (let k = 0; k <= 16; k++) { const t = (k / 16) * Math.PI; pts.push([LX + Math.cos(t) * LUG_R, LZ + Math.sin(t) * LUG_R]); }
  pts.push([40, LZ]);
  return pts;
}
const ring = (p: Iso, plane: "xy" | "xz", cx: number, c2: number, c3: number, r: number) => seg(...Array.from({ length: 29 }, (_, k) => { const t = (k / 28) * Math.PI * 2; return plane === "xy" ? p(cx + Math.cos(t) * r, c2 + Math.sin(t) * r, c3) : p(cx + Math.cos(t) * r, c2, c3 + Math.sin(t) * r); })) + "Z";

export function Lug3D({ solid, hot, ox = 250, oy = 180, s = 1.75 }: { solid: boolean; hot?: Feat | null; ox?: number; oy?: number; s?: number }) {
  const p = makeIso(ox, oy, s);
  const c = (f?: Feat) => (f && hot === f ? A.amber : A.cyan);
  const w = (f?: Feat) => (f && hot === f ? 2.4 : 1.3);
  const fo = (o: number) => (solid ? o : 0);
  const prof = lugProfile();
  const back = prof.map(([x, z]) => p(x, 50, z)), front = prof.map(([x, z]) => p(x, 62, z));
  const box = (x: number, y: number, z: number, W: number, D: number, H: number) => [
    loop(p(x, y, z + H), p(x + W, y, z + H), p(x + W, y + D, z + H), p(x, y + D, z + H)),
    loop(p(x + W, y, z + H), p(x + W, y, z), p(x + W, y + D, z), p(x + W, y + D, z + H)),
    loop(p(x, y + D, z + H), p(x + W, y + D, z + H), p(x + W, y + D, z), p(x, y + D, z)),
  ];
  const base = box(0, 0, 0, 120, 80, 10);
  return (
    <g>
      <g {...ln(hot === "locate" ? A.amber : A.cyan, hot === "locate" ? 2.2 : 1.3)}>
        <path d={base[0]} fill={A.cyan} fillOpacity={fo(0.16)} style={{ transition: "fill-opacity .7s" }} />
        <path d={base[1]} fill={A.cyan} fillOpacity={fo(0.08)} style={{ transition: "fill-opacity .7s" }} />
        <path d={base[2]} fill={A.cyan} fillOpacity={fo(0.12)} style={{ transition: "fill-opacity .7s" }} />
      </g>
      <path d={loop(p(20, 18, 10), p(52, 18, 10), p(52, 40, 10), p(20, 40, 10))} {...ln(A.cyan, 0.9)} strokeDasharray="3 2" />
      {[[12, 12], [108, 12], [12, 68], [108, 68]].map(([x, y], i) => <path key={i} d={ring(p, "xy", x, y, 10, 5)} {...ln(i === 0 ? c("hole") : c("pattern"), i === 0 ? w("hole") : w("pattern"))} fill={A.bg} fillOpacity={solid ? 1 : 0} />)}
      <path d={loop(p(60, 62, 10), p(60, 80, 10), p(60, 62, 40))} {...ln(A.cyan, 1.1)} fill={A.cyan} fillOpacity={fo(0.14)} />
      <path d={seg(...back) + "Z"} {...ln(A.cyan, 1)} strokeOpacity="0.6" />
      {[0, 1, 2, prof.length - 1].map((i) => <path key={i} d={seg(back[i], front[i])} {...ln(A.cyan, 1)} />)}
      <path d={seg(p(LX + LUG_R * Math.cos(Math.PI / 4), 50, LZ + LUG_R * Math.sin(Math.PI / 4)), p(LX + LUG_R * Math.cos(Math.PI / 4), 62, LZ + LUG_R * Math.sin(Math.PI / 4)))} {...ln(A.cyan, 1)} />
      <path d={seg(...front) + "Z"} {...ln(c("edge"), w("edge"))} fill={A.cyan} fillOpacity={fo(0.22)} style={{ transition: "fill-opacity .7s" }} />
      <path d={ring(p, "xz", LX, 62, LZ, 9)} {...ln(c("bore"), w("bore"))} fill={A.bg} fillOpacity={solid ? 1 : 0} />
      <path d={ring(p, "xz", LX, 50, LZ, 9)} {...ln(A.cyan, 0.7)} strokeOpacity="0.5" />
    </g>
  );
}
export const isoAt = (ox = 250, oy = 180, s = 1.75) => makeIso(ox, oy, s);

/* ───────── orthographic drawing (front: x/z, top: x/y) ───────── */
const K = 1.7, FX = 40, FY = 150, TX = 40, TY = 186;
export const fv = (x: number, z: number) => [FX + x * K, FY - z * K] as const;
export const tv = (x: number, y: number) => [TX + x * K, TY + y * K] as const;
export function Ortho({ hot, light, section, dims = true }: { hot?: Feat | null; light?: boolean; section?: boolean; dims?: boolean }) {
  const ink = light ? "#0F172A" : A.ink, dim = light ? "#1D4ED8" : A.green;
  const c = (f: Feat) => (hot === f ? A.amber : ink), w = (f: Feat) => (hot === f ? 2.4 : 1.3);
  const prof = lugProfile().map(([x, z]) => fv(x, z).join(" ")).join("L");
  const [bx, by] = fv(LX, LZ);
  return (
    <g>
      <defs><pattern id={`ae-h-${light ? "l" : "d"}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5" stroke={light ? "#1D4ED8" : A.cyan} strokeWidth="0.7" /></pattern></defs>
      {/* front view */}
      <path d={`M${fv(0, 0).join(" ")}H${fv(120, 0)[0]}V${fv(0, 10)[1]}H${fv(0, 0)[0]}Z`} {...ln(c("locate"), w("locate"))} fill={section ? `url(#ae-h-${light ? "l" : "d"})` : "none"} />
      <path d={"M" + prof + "Z"} {...ln(c("edge"), w("edge"))} fill={section ? `url(#ae-h-${light ? "l" : "d"})` : "none"} />
      <circle cx={bx} cy={by} r={9 * K} {...ln(c("bore"), w("bore"))} fill={light ? A.paper : A.bg} />
      <path d={`M${bx} ${by - 14 * K}V${by + 14 * K}M${bx - 14 * K} ${by}H${bx + 14 * K}`} {...ln(A.red, 0.6)} strokeDasharray="7 2 1.5 2" />
      {[12, 108].map((x) => <path key={x} d={`M${fv(x - 5, 0)[0]} ${fv(0, 0)[1]}V${fv(0, 10)[1]}M${fv(x + 5, 0)[0]} ${fv(0, 0)[1]}V${fv(0, 10)[1]}`} {...ln(x === 12 ? c("hole") : c("pattern"), 0.9)} strokeDasharray="3 2" />)}
      {section ? <T x={fv(60, 0)[0]} y={FY + 18} a="middle" c={A.amber} size={9}>SECTION A–A</T> : <T x={fv(0, 0)[0]} y={FY - 92 * K + 50} c={light ? "#64748B" : A.mute} size={8}>FRONT</T>}
      {/* top view */}
      {!section ? (
        <g>
          <rect x={tv(0, 0)[0]} y={tv(0, 0)[1]} width={120 * K} height={80 * K} {...ln(c("locate"), 1.2)} />
          <rect x={tv(40, 50)[0]} y={tv(40, 50)[1]} width={40 * K} height={12 * K} {...ln(c("edge"), w("edge"))} />
          <rect x={tv(20, 18)[0]} y={tv(20, 18)[1]} width={32 * K} height={22 * K} {...ln(ink, 0.8)} strokeDasharray="3 2" />
          {[[12, 12], [108, 12], [12, 68], [108, 68]].map(([x, y], i) => <circle key={i} cx={tv(x, y)[0]} cy={tv(x, y)[1]} r={5 * K} {...ln(i === 0 ? c("hole") : c("pattern"), i === 0 ? w("hole") : w("pattern"))} />)}
        </g>
      ) : (
        <g>
          <path d={`M${tv(-4, 56)[0]} ${tv(0, 56)[1]}h-14M${tv(124, 56)[0]} ${tv(0, 56)[1]}h14`} {...ln(A.amber, 1.4)} />
          <T x={tv(-4, 56)[0] - 18} y={tv(0, 56)[1] - 4} c={A.amber} size={9}>A</T><T x={tv(124, 56)[0] + 10} y={tv(0, 56)[1] - 4} c={A.amber} size={9}>A</T>
          <rect x={tv(0, 0)[0]} y={tv(0, 0)[1]} width={120 * K} height={80 * K} {...ln(ink, 0.8)} strokeOpacity="0.4" />
        </g>
      )}
      {dims ? (
        <g {...ln(dim, 0.8)}>
          <path d={`M${fv(0, 0)[0]} ${fv(0, 0)[1] + 4}v12M${fv(120, 0)[0]} ${fv(0, 0)[1] + 4}v12`} strokeOpacity="0" />
          <path d={`M${tv(0, 80)[0]} ${tv(0, 80)[1] + 6}v14M${tv(120, 80)[0]} ${tv(0, 80)[1] + 6}v14M${tv(0, 80)[0]} ${tv(0, 80)[1] + 16}H${tv(120, 0)[0]}`} />
          <path d={`M${fv(120, 0)[0] + 8} ${fv(0, LZ)[1]}h18M${fv(120, 0)[0] + 8} ${fv(0, 0)[1]}h18M${fv(120, 0)[0] + 20} ${fv(0, 0)[1]}V${fv(0, LZ)[1]}`} />
        </g>
      ) : null}
      {dims ? <><T x={tv(60, 0)[0]} y={tv(0, 80)[1] + 30} a="middle" c={dim} size={9}>L</T><T x={fv(120, 0)[0] + 26} y={(fv(0, 0)[1] + fv(0, LZ)[1]) / 2} c={dim} size={9}>H</T></> : null}
    </g>
  );
}

/** Datum triangle + label box. */
export function Datum({ x, y, l, light }: { x: number; y: number; l: string; light?: boolean }) {
  return <g><path d={`M${x - 6} ${y}h12l-6 9z`} fill={A.amber} /><path d={`M${x} ${y + 9}v8`} {...ln(A.amber, 1)} /><rect x={x - 9} y={y + 17} width="18" height="16" {...ln(A.amber, 1)} fill={light ? A.paper : A.bg} /><T x={x} y={y + 29} a="middle" c={A.amber} size={10} w={700}>{l}</T></g>;
}
/** Symbolic feature-control frame (no numbers). */
export function FCF({ x, y, cells, light }: { x: number; y: number; cells: string[]; light?: boolean }) {
  const ws = cells.map((c, i) => (i === 1 ? Math.max(40, c.length * 6.4 + 10) : 20));
  const xs = ws.map((_, i) => x + ws.slice(0, i).reduce((a, b) => a + b, 0));
  return <g>{cells.map((c, i) => <g key={i}><rect x={xs[i]} y={y} width={ws[i]} height="16" {...ln(A.red, 1)} fill={light ? A.paper : A.bg} /><T x={xs[i] + ws[i] / 2} y={y + 12} a="middle" c={A.red} size={9}>{c}</T></g>)}</g>;
}
