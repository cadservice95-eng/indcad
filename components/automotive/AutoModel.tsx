import type { ReactNode } from "react";
import { makeIso, seg, loop, type P } from "@/components/svg/iso";

/**
 * One generic automotive bracket assembly drives every view on the page:
 * C = mounting plate (mating structure), A = sheet-metal bracket, B = housing, plus fasteners.
 * Illustrative geometry — not a real component or specification.
 */
export const G = {
  bg: "#0F1216", panel: "#161B22", line: "#334155", geo: "#93C5FD", hi: "#E2E8F0", mute: "#64748B",
  datum: "#FBBF24", tol: "#F87171", fast: "#2DD4BF", ok: "#4ADE80",
};
export const mono = { fontFamily: "var(--font-mono)" } as const;
export const ln = (c: string, w = 1.3) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;

export function T({ x, y, c = G.hi, size = 9, a = "start", children, w }: { x: number | string; y: number | string; c?: string; size?: number; a?: "start" | "middle" | "end"; children: ReactNode; w?: number }) {
  return <text x={x} y={y} fill={c} fontSize={size} textAnchor={a} fontWeight={w} style={mono}>{children}</text>;
}
export function Fade({ on, children, d = 0 }: { on: boolean; children: ReactNode; d?: number }) {
  return <g style={{ opacity: on ? 1 : 0, transition: `opacity .5s ease ${on ? d : 0}ms` }}>{children}</g>;
}
export function Grid({ w, h, step = 20 }: { w: number; h: number; step?: number }) {
  return <g stroke="#94A3B8" strokeOpacity="0.07">{Array.from({ length: Math.ceil(w / step) + 1 }, (_, i) => <path key={i} d={`M${i * step} 0V${h}`} />)}{Array.from({ length: Math.ceil(h / step) + 1 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * step}H${w}`} />)}</g>;
}

type Iso = (x: number, y: number, z: number) => P;
export function boxFaces(p: Iso, x: number, y: number, z: number, w: number, d: number, h: number) {
  const A = p(x, y, z + h), B = p(x + w, y, z + h), C = p(x + w, y + d, z + h), D = p(x, y + d, z + h);
  const E = p(x + w, y, z), F = p(x + w, y + d, z), Gp = p(x, y + d, z);
  return { top: loop(A, B, C, D), right: loop(B, E, F, C), left: loop(D, C, F, Gp) };
}
/** Polyline circle in a plane: "xy" (horizontal), "xz" (y = const face). */
export function circ(p: Iso, plane: "xy" | "xz", cx: number, cy: number, cz: number, r: number, n = 28) {
  const pts: P[] = [];
  for (let k = 0; k <= n; k++) {
    const t = (k / n) * Math.PI * 2;
    pts.push(plane === "xy" ? p(cx + Math.cos(t) * r, cy + Math.sin(t) * r, cz) : p(cx + Math.cos(t) * r, cy, cz + Math.sin(t) * r));
  }
  return seg(...pts) + "Z";
}
export function Box({ p, b, c, solid, w = 1.3, hot }: { p: Iso; b: [number, number, number, number, number, number]; c: string; solid: boolean; w?: number; hot?: boolean }) {
  const f = boxFaces(p, ...b);
  const fo = (o: number) => ({ fill: c, fillOpacity: solid ? o : 0, style: { transition: "fill-opacity .6s" } });
  return <g {...ln(hot ? "#fff" : c, hot ? w + 0.8 : w)}><path d={f.left} {...fo(0.32)} /><path d={f.right} {...fo(0.2)} /><path d={f.top} {...fo(0.5)} /></g>;
}

export type Part = "A" | "B" | "C" | "F";
export const PART_NAME: Record<Part, string> = { A: "Bracket", B: "Housing", C: "Mounting plate", F: "Fasteners" };

/* ───────── isometric assembly ───────── */
export function Assembly({ solid = true, explode = 0, focus, callouts, ox = 222, oy = 150, s = 1.55 }: { solid?: boolean; explode?: number; focus?: Part | null; callouts?: boolean; ox?: number; oy?: number; s?: number }) {
  const p = makeIso(ox, oy, s);
  const dz = (z: number, k: number) => z + explode * k;
  const pa = (x: number, y: number, z: number) => p(x, y, dz(z, 34));
  const pb = (x: number, y: number, z: number) => p(x, y + explode * 34, dz(z, 34));
  const pf = (x: number, y: number, z: number) => p(x, y, dz(z, 78));
  const dim = (k: Part) => (focus && focus !== k ? 0.28 : 1);
  const col: Record<Part, string> = { A: G.geo, B: "#C4B5FD", C: G.mute, F: G.fast };
  return (
    <g>
      <g style={{ opacity: dim("C"), transition: "opacity .3s" }}>
        <Box p={p} b={[0, 0, 0, 120, 80, 8]} c={col.C} solid={solid} hot={focus === "C"} />
        {[30, 90].map((x) => <path key={x} d={circ(p, "xy", x, 50, 8, 4)} {...ln(col.C, 1)} />)}
      </g>
      <g style={{ opacity: dim("A"), transition: "opacity .3s" }}>
        <Box p={pa} b={[20, 10, 8, 80, 60, 6]} c={col.A} solid={solid} hot={focus === "A"} />
        <Box p={pa} b={[20, 10, 14, 80, 6, 56]} c={col.A} solid={solid} hot={focus === "A"} />
        <path d={loop(pa(60, 16, 14), pa(60, 16, 30), pa(60, 56, 14))} {...ln(focus === "A" ? "#fff" : col.A, 1.2)} fill={col.A} fillOpacity={solid ? 0.35 : 0} />
        {[30, 90].map((x) => <path key={x} d={circ(pa, "xy", x, 50, 14, 4.5)} {...ln(col.A, 1)} fill={G.bg} fillOpacity={solid ? 1 : 0} />)}
      </g>
      <g style={{ opacity: dim("B"), transition: "opacity .3s" }}>
        <Box p={pb} b={[35, 16, 30, 50, 24, 32]} c={col.B} solid={solid} hot={focus === "B"} />
        <path d={circ(pb, "xz", 60, 40, 46, 10)} {...ln(focus === "B" ? "#fff" : col.B, 1.3)} fill={G.bg} fillOpacity={solid ? 1 : 0} />
        <path d={circ(pb, "xz", 60, 40, 46, 5)} {...ln(col.B, 0.9)} />
      </g>
      <g style={{ opacity: dim("F"), transition: "opacity .3s" }}>
        {[30, 90].map((x) => (
          <g key={x} {...ln(focus === "F" ? "#fff" : col.F, 1.6)}>
            <path d={seg(pf(x - 3, 50, 2), pf(x - 3, 50, 22))} /><path d={seg(pf(x + 3, 50, 2), pf(x + 3, 50, 22))} />
            <path d={circ(pf, "xy", x, 50, 22, 6)} fill={col.F} fillOpacity={solid ? 0.4 : 0} /><path d={circ(pf, "xy", x, 50, 26, 6)} />
          </g>
        ))}
      </g>
      {callouts && focus ? <Callouts p={p} pa={pa} pb={pb} pf={pf} focus={focus} /> : null}
    </g>
  );
}

function Tag({ at, dx, dy, label, c }: { at: P; dx: number; dy: number; label: string; c: string }) {
  const [x, y] = at, tx = x + dx, ty = y + dy, w = label.length * 6 + 12;
  return (
    <g className="fade-in" data-in="true">
      <circle cx={x} cy={y} r="3" fill={c} /><path d={`M${x} ${y}L${tx} ${ty}`} {...ln(c, 0.9)} />
      <rect x={dx > 0 ? tx : tx - w} y={ty - 9} width={w} height="17" fill={G.bg} stroke={c} strokeWidth="0.8" />
      <T x={dx > 0 ? tx + 6 : tx - w + 6} y={ty + 3} c={c} size={8.5}>{label}</T>
    </g>
  );
}
function Callouts({ p, pa, pb, pf, focus }: { p: Iso; pa: Iso; pb: Iso; pf: Iso; focus: Part }) {
  const items: Record<Part, { at: P; dx: number; dy: number; label: string; c: string }[]> = {
    A: [{ at: pa(60, 70, 8), dx: -70, dy: 50, label: "MATING SURFACE", c: G.datum }, { at: pa(90, 50, 14), dx: 80, dy: 24, label: "MOUNTING FEATURE", c: G.fast }, { at: pa(20, 13, 50), dx: -70, dy: -30, label: "REFERENCE DATUM", c: G.datum }],
    B: [{ at: pb(60, 40, 56), dx: 80, dy: -40, label: "BORE · FIT FEATURE", c: G.fast }, { at: pb(85, 28, 30), dx: 80, dy: 30, label: "MATING SURFACE", c: G.datum }, { at: pb(35, 40, 62), dx: -80, dy: -30, label: "CLEARANCE", c: G.tol }],
    C: [{ at: p(120, 40, 8), dx: 70, dy: 30, label: "MATING SURFACE", c: G.datum }, { at: p(30, 50, 8), dx: -80, dy: 40, label: "MOUNTING HOLE", c: G.fast }],
    F: [{ at: pf(90, 50, 26), dx: 70, dy: -30, label: "FASTENER", c: G.fast }, { at: pf(30, 50, 10), dx: -80, dy: 20, label: "CLEARANCE HOLE", c: G.tol }],
  };
  return <g>{items[focus].map((t) => <Tag key={t.label} {...t} />)}</g>;
}

/* ───────── 2D orthographic views (front + side) ───────── */
const S = 1.6;
const FX = 50, FY = 262, SX = 320, SY = 262;
const fv = (x: number, z: number) => [FX + x * S, FY - z * S] as const;
const sv = (y: number, z: number) => [SX + y * S, SY - z * S] as const;
const rectF = (x0: number, z0: number, x1: number, z1: number) => { const [a, b] = fv(x0, z1), [c, d] = fv(x1, z0); return { x: a, y: b, width: c - a, height: d - b }; };
const rectS = (y0: number, z0: number, y1: number, z1: number) => { const [a, b] = sv(y0, z1), [c, d] = sv(y1, z0); return { x: a, y: b, width: c - a, height: d - b }; };

export function Ortho({ section, tol, dims = true }: { section?: boolean; tol?: boolean; dims?: boolean }) {
  const L = ln(G.hi, 1.4), H = { ...ln(G.mute, 0.9), strokeDasharray: "4 3" }, CL = { ...ln(G.tol, 0.7), strokeDasharray: "9 3 2 3" };
  return (
    <g>
      <defs><pattern id="au-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke={G.geo} strokeWidth="0.8" /></pattern></defs>
      {/* front view */}
      <rect {...rectF(0, 0, 120, 8)} {...L} /><rect {...rectF(20, 8, 100, 70)} {...L} /><rect {...rectF(35, 30, 85, 62)} {...L} />
      <circle cx={fv(60, 46)[0]} cy={fv(60, 46)[1]} r={10 * S} {...L} /><circle cx={fv(60, 46)[0]} cy={fv(60, 46)[1]} r={5 * S} {...ln(G.hi, 1)} />
      {[30, 90].map((x) => <path key={x} d={`M${fv(x - 4, 0)[0]} ${fv(0, 0)[1]}V${fv(0, 14)[1]}M${fv(x + 4, 0)[0]} ${fv(0, 0)[1]}V${fv(0, 14)[1]}`} {...H} />)}
      <path d={`M${fv(60, 0)[0]} ${fv(0, -8)[1]}V${fv(0, 76)[1]}M${fv(28, 46)[0]} ${fv(0, 46)[1]}H${fv(92, 46)[0]}`} {...CL} />
      <T x={fv(60, 0)[0]} y={FY + 34} a="middle" c={G.mute} size={8}>FRONT VIEW</T>
      {/* side view or section A-A */}
      {section ? (
        <g>
          <rect {...rectS(0, 0, 80, 8)} {...ln(G.hi, 1.4)} fill="url(#au-hatch)" />
          <path d={`M${sv(10, 8).join(" ")}H${sv(70, 8)[0]}V${sv(0, 14)[1]}H${sv(16, 0)[0]}V${sv(0, 70)[1]}H${sv(10, 0)[0]}Z`} {...ln(G.hi, 1.4)} fill="url(#au-hatch)" />
          <path d={`M${sv(16, 14).join(" ")}L${sv(16, 30).join(" ")}L${sv(56, 14).join(" ")}Z`} {...ln(G.hi, 1.2)} fill="url(#au-hatch)" />
          <path d={`M${sv(16, 30).join(" ")}H${sv(40, 0)[0]}V${sv(0, 36)[1]}H${sv(16, 0)[0]}ZM${sv(16, 56).join(" ")}H${sv(40, 0)[0]}V${sv(0, 62)[1]}H${sv(16, 0)[0]}Z`} {...ln(G.hi, 1.4)} fill="url(#au-hatch)" />
          <path d={`M${sv(16, 46).join(" ")}H${sv(40, 0)[0]}`} {...CL} />
          <T x={sv(40, 0)[0]} y={SY + 34} a="middle" c={G.datum} size={8}>SECTION A–A</T>
          <T x={sv(46, 0)[0]} y={sv(0, 46)[1] + 3} c={G.mute} size={7.5}>BORE</T>
        </g>
      ) : (
        <g>
          <rect {...rectS(0, 0, 80, 8)} {...L} /><rect {...rectS(10, 8, 70, 14)} {...L} /><rect {...rectS(10, 14, 16, 70)} {...L} /><rect {...rectS(16, 30, 40, 62)} {...L} />
          <path d={`M${sv(16, 14).join(" ")}L${sv(56, 14).join(" ")}L${sv(16, 30).join(" ")}`} {...ln(G.hi, 1.1)} />
          <path d={`M${sv(16, 36).join(" ")}H${sv(40, 0)[0]}M${sv(16, 56).join(" ")}H${sv(40, 0)[0]}`} {...H} />
          <T x={sv(40, 0)[0]} y={SY + 34} a="middle" c={G.mute} size={8}>SIDE VIEW</T>
        </g>
      )}
      {!section ? <g {...ln(G.datum, 0.8)} strokeDasharray="3 3"><path d={`M${fv(60, 0)[0] - 8} ${fv(0, 76)[1] - 6}h16M${fv(60, 0)[0] - 8} ${fv(0, -8)[1] + 6}h16`} /></g> : null}
      {!section ? <><T x={fv(60, 0)[0] - 18} y={fv(0, 76)[1] - 8} c={G.datum} size={8}>A</T><T x={fv(60, 0)[0] - 18} y={fv(0, -8)[1] + 14} c={G.datum} size={8}>A</T></> : null}
      {dims ? (
        <g {...ln(G.ok, 0.8)}>
          <path d={`M${fv(20, 0)[0]} ${fv(0, 70)[1] - 4}V${fv(0, 70)[1] - 22}M${fv(100, 0)[0]} ${fv(0, 70)[1] - 4}V${fv(0, 70)[1] - 22}M${fv(20, 0)[0]} ${fv(0, 70)[1] - 16}H${fv(100, 0)[0]}`} />
          <path d={`M${sv(80, 0)[0] + 6} ${sv(0, 0)[1]}H${sv(80, 0)[0] + 24}M${sv(80, 0)[0] + 6} ${sv(0, 70)[1]}H${sv(80, 0)[0] + 24}M${sv(80, 0)[0] + 18} ${sv(0, 0)[1]}V${sv(0, 70)[1]}`} />
        </g>
      ) : null}
      {dims ? <><T x={fv(60, 0)[0]} y={fv(0, 70)[1] - 20} a="middle" c={G.ok} size={8}>W</T><T x={sv(80, 0)[0] + 22} y={sv(0, 35)[1]} c={G.ok} size={8}>H</T></> : null}
      {tol ? <TolLayer /> : null}
    </g>
  );
}

/** Symbolic datum + feature-control frames — deliberately without numeric values. */
function Datum({ x, y, l, dir = "down" }: { x: number; y: number; l: string; dir?: "down" | "left" }) {
  const tri = dir === "down" ? `M${x - 6} ${y}h12l-6 9z` : `M${x} ${y - 6}v12l-9 -6z`;
  const bx = dir === "down" ? [x - 8, y + 18] : [x - 34, y - 8];
  return <g><path d={tri} fill={G.datum} /><path d={dir === "down" ? `M${x} ${y + 9}v9` : `M${x - 9} ${y}h-9`} {...ln(G.datum, 1)} /><rect x={bx[0]} y={bx[1]} width="16" height="16" {...ln(G.datum, 1)} fill={G.bg} /><T x={bx[0] + 8} y={bx[1] + 12} a="middle" c={G.datum} size={10} w={600}>{l}</T></g>;
}
function FCF({ x, y, cells }: { x: number; y: number; cells: string[] }) {
  const w = [20, 30, ...cells.slice(2).map(() => 18)];
  const xs = w.map((_, i) => x + w.slice(0, i).reduce((a, b) => a + b, 0));
  return <g className="fade-in" data-in="true">{cells.map((c, i) => { const cx = xs[i]; return <g key={i}><rect x={cx} y={y} width={w[i]} height="16" {...ln(G.tol, 1)} fill={G.bg} /><T x={cx + w[i] / 2} y={y + 12} a="middle" c={G.tol} size={9}>{c}</T></g>; })}</g>;
}
function TolLayer() {
  return (
    <g>
      <Datum x={fv(10, 0)[0]} y={FY + 1} l="A" />
      <Datum x={sv(10, 0)[0] - 2} y={sv(0, 50)[1]} l="B" dir="left" />
      <Datum x={fv(30, 0)[0]} y={FY + 1} l="C" />
      <path d={`M${fv(60, 46)[0] + 14} ${fv(60, 46)[1] - 12}L${fv(60, 46)[0] + 44} ${fv(60, 46)[1] - 50}`} {...ln(G.tol, 0.8)} />
      <FCF x={fv(60, 46)[0] + 44} y={fv(60, 46)[1] - 66} cells={["⌖", "⌀ t₁", "A", "B", "C"]} />
      <FCF x={sv(16, 0)[0] + 30} y={sv(0, 70)[1] - 34} cells={["⏥", "t₂", "A"]} />
      <T x="500" y="24" a="end" c={G.tol} size={8}>ILLUSTRATIVE CALLOUTS · NO VALUES</T>
    </g>
  );
}

export function Sheet({ children, title = "BRACKET ASSY", label = "ILLUSTRATIVE" }: { children?: ReactNode; title?: string; label?: string }) {
  return (
    <g>
      <rect x="10" y="10" width="500" height="340" {...ln(G.mute, 1)} />
      <rect x="16" y="16" width="488" height="328" {...ln(G.line, 0.6)} />
      {children}
      <g {...ln(G.mute, 0.8)}><path d="M330 300H504M330 322H504M330 300V344M420 300V344M470 322V344" /></g>
      <T x="336" y="314" size={8}>{title}</T><T x="426" y="314" size={8} c={G.mute}>{label}</T>
      <T x="336" y="337" size={8} c={G.mute}>DWG · SHEET 1</T><T x="426" y="337" size={8} c={G.mute}>THIRD ANGLE</T><T x="476" y="337" size={8} c={G.mute}>REV A</T>
    </g>
  );
}
