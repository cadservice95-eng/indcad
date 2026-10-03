import { makeIso, boxFaces, loop, seg } from "@/components/svg/iso";
import { B, OPENINGS, mono } from "@/components/arch/model";

/* A light-themed "Revit workspace" scene built on the same illustrative house as the architectural page.
   Plan / elevation / section come from components/arch/Drawing so every view stays consistent. */

export const C = { line: "#334155", arch: "#64748B", struct: "#2563EB", mep: "#0891B2", pipe: "#0D9488", level: "#94A3B8", ok: "#16A34A", warn: "#EA580C", blue: "#2563EB" };
const P = makeIso(245, 100, 0.72);
const ST = 90;

export type SceneLayers = { levels?: boolean; arch?: boolean; struct?: boolean; mep?: boolean };
export type SceneHi = "wall" | "door" | "level" | null;

type Fl = { stroke: string; fill: string; fo: number; sw?: number };
function bx(k: string, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, f: Fl) {
  const [l, r, t] = boxFaces(P, x0, y0, z0, x1, y1, z1);
  return (
    <g key={k} stroke={f.stroke} strokeWidth={f.sw ?? 0.8} fill={f.fill} fillOpacity={f.fo}>
      <path d={l} /><path d={r} fillOpacity={f.fo * 0.7} /><path d={t} fillOpacity={f.fo * 1.4} />
    </g>
  );
}

const gx = [B.x0, 300, B.x1];
const gy = [B.y0, 200, B.y1];

export function RevitScene({ layers, hi = null, gridOnly, className, title }: { layers: SceneLayers; hi?: SceneHi; gridOnly?: boolean; className?: string; title: string }) {
  const g = (on?: boolean) => ({ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(8px)", transition: "opacity 0.7s ease, transform 0.7s ease" }) as React.CSSProperties;
  const levels = [0, ST, ST * 2];
  const south = OPENINGS.filter((o) => o.wall === "S");
  const east = OPENINGS.filter((o) => o.wall === "E");
  return (
    <svg viewBox="0 0 640 440" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <rect width="640" height="440" fill="#FFFFFF" />
      <path d={loop(P(B.x0 - 50, B.y0 - 50, 0), P(B.x1 + 50, B.y0 - 50, 0), P(B.x1 + 50, B.y1 + 50, 0), P(B.x0 - 50, B.y1 + 50, 0))} fill="#F1F5F9" stroke="#E2E8F0" />
      {/* grid lines */}
      <g stroke="#CBD5E1" strokeWidth="0.8" strokeDasharray="8 3 2 3">
        {gx.map((x) => <path key={`x${x}`} d={seg(P(x, B.y0 - 40, 0), P(x, B.y1 + 40, 0))} />)}
        {gy.map((y) => <path key={`y${y}`} d={seg(P(B.x0 - 40, y, 0), P(B.x1 + 40, y, 0))} />)}
      </g>
      {["A", "B", "C"].map((t, i) => { const q = P(gx[i], B.y1 + 56, 0); return <g key={t}><circle cx={q[0]} cy={q[1]} r="9" fill="#fff" stroke={C.line} /><text x={q[0]} y={q[1] + 3.5} textAnchor="middle" fontSize="10" fill={C.line} style={mono}>{t}</text></g>; })}
      {["1", "2", "3"].map((t, i) => { const q = P(B.x1 + 56, gy[i], 0); return <g key={t}><circle cx={q[0]} cy={q[1]} r="9" fill="#fff" stroke={C.line} /><text x={q[0]} y={q[1] + 3.5} textAnchor="middle" fontSize="10" fill={C.line} style={mono}>{t}</text></g>; })}
      {!gridOnly ? null : null}

      {/* levels */}
      <g style={g(layers.levels)}>
        {levels.map((z, i) => (
          <g key={z}>
            <path d={loop(P(B.x0 - 14, B.y0 - 14, z), P(B.x1 + 14, B.y0 - 14, z), P(B.x1 + 14, B.y1 + 14, z), P(B.x0 - 14, B.y1 + 14, z))} fill={C.level} fillOpacity={hi === "level" && i === 1 ? 0.3 : 0.07} stroke={hi === "level" && i === 1 ? C.blue : C.level} strokeWidth={hi === "level" && i === 1 ? 2 : 0.9} strokeDasharray="6 4" />
            <text x={P(B.x0 - 20, B.y1 + 14, z)[0] - 8} y={P(B.x0 - 20, B.y1 + 14, z)[1] + 3} textAnchor="end" fontSize="9" fill={C.arch} style={mono}>{["LEVEL 01", "LEVEL 02", "ROOF"][i]}</text>
          </g>
        ))}
      </g>

      {/* structure */}
      <g style={g(layers.struct)}>
        {[ST, ST * 2].map((z) => gy.map((y) => bx(`bx${z}${y}`, B.x0, y - 5, z - 12, B.x1, y + 5, z - 4, { stroke: C.struct, fill: C.struct, fo: 0.12 })))}
        {[ST, ST * 2].map((z) => gx.map((x) => bx(`by${z}${x}`, x - 5, B.y0, z - 12, x + 5, B.y1, z - 4, { stroke: C.struct, fill: C.struct, fo: 0.12 })))}
        {gx.flatMap((x) => gy.map((y) => bx(`c${x}${y}`, x - 7, y - 7, 0, x + 7, y + 7, ST * 2, { stroke: C.struct, fill: C.struct, fo: 0.2, sw: 1 })))}
      </g>

      {/* architecture */}
      <g style={g(layers.arch)}>
        <path d={loop(P(B.x0, B.y1, 0), P(B.x1, B.y1, 0), P(B.x1, B.y1, ST * 2), P(B.x0, B.y1, ST * 2))} fill="#fff" fillOpacity="0.6" stroke={C.arch} strokeWidth="1.3" />
        <path d={loop(P(B.x1, B.y1, 0), P(B.x1, B.y0, 0), P(B.x1, B.y0, ST * 2), P(B.x1, B.y1, ST * 2))} fill="#EEF2F7" fillOpacity="0.7" stroke={C.arch} strokeWidth="1.3" />
        <path d={seg(P(B.x0, B.y1, ST), P(B.x1, B.y1, ST), P(B.x1, B.y0, ST))} stroke={C.arch} strokeWidth="0.7" />
        {south.map((o) => <path key={o.id} d={loop(P(o.x, B.y1, 28), P(o.x + o.w, B.y1, 28), P(o.x + o.w, B.y1, 68), P(o.x, B.y1, 68))} fill="#BFDBFE" fillOpacity="0.6" stroke={C.arch} />)}
        {south.map((o) => <path key={`u${o.id}`} d={loop(P(o.x, B.y1, ST + 28), P(o.x + o.w, B.y1, ST + 28), P(o.x + o.w, B.y1, ST + 68), P(o.x, B.y1, ST + 68))} fill="#BFDBFE" fillOpacity="0.6" stroke={C.arch} />)}
        {east.map((o) => <path key={o.id} d={loop(P(B.x1, o.y, 28), P(B.x1, o.y + o.w, 28), P(B.x1, o.y + o.w, 68), P(B.x1, o.y, 68))} fill="#BFDBFE" fillOpacity="0.6" stroke={C.arch} />)}
        <path d={loop(P(325, B.y1, 0), P(355, B.y1, 0), P(355, B.y1, 70), P(325, B.y1, 70))} fill={hi === "door" ? "#2563EB" : "#fff"} fillOpacity={hi === "door" ? 0.35 : 0.8} stroke={hi === "door" ? C.blue : C.arch} strokeWidth={hi === "door" ? 2.4 : 1} />
        {hi === "wall" ? <path d={loop(P(300, B.y0, 0), P(300, B.y1, 0), P(300, B.y1, ST), P(300, B.y0, ST))} fill={C.blue} fillOpacity="0.28" stroke={C.blue} strokeWidth="2" /> : <path d={loop(P(300, B.y0, 0), P(300, B.y1, 0), P(300, B.y1, ST), P(300, B.y0, ST))} fill="#fff" fillOpacity="0.15" stroke={C.arch} strokeWidth="0.7" strokeDasharray="3 3" />}
        <path d={loop(P(B.x0 - 12, B.y1 + 12, ST * 2), P(B.x1 + 12, B.y1 + 12, ST * 2), P(B.x1 + 12, B.y0 - 12, ST * 2), P(B.x0 - 12, B.y0 - 12, ST * 2))} fill="#CBD5E1" fillOpacity="0.35" stroke={C.arch} strokeWidth="1" />
      </g>

      {/* MEP */}
      <g style={g(layers.mep)}>
        {bx("d1", B.x0 + 10, 120, 62, B.x1 - 10, 144, 76, { stroke: C.mep, fill: C.mep, fo: 0.25 })}
        {bx("d2", B.x0 + 10, 120, ST + 62, B.x1 - 10, 144, ST + 76, { stroke: C.mep, fill: C.mep, fo: 0.25 })}
        {bx("d3", 380, 130, 62, 396, 330, 76, { stroke: C.mep, fill: C.mep, fo: 0.25 })}
        <path d={seg(P(520, 90, 0), P(520, 90, ST * 2 + 6))} stroke={C.pipe} strokeWidth="3" /><path d={seg(P(520, 90, 40), P(420, 90, 40), P(420, 200, 40))} stroke={C.pipe} strokeWidth="2.2" />
        {bx("eq", 440, 230, 0, 500, 290, 34, { stroke: C.mep, fill: C.mep, fo: 0.2 })}
      </g>
    </svg>
  );
}

/* ───────── single element in isometric (door / window / equipment) ───────── */

export function ElementIso({ kind, lod = 3, className, title, glow }: { kind: "door" | "window" | "equipment"; lod?: 0 | 1 | 2 | 3; className?: string; title: string; glow?: boolean }) {
  const p = makeIso(170, 190, 1.5);
  const b = (k: string, a: number, bb: number, c: number, d: number, e: number, f: number, fl: Fl) => {
    const [l, r, t] = boxFaces(p, a, bb, c, d, e, f);
    return <g key={k} stroke={fl.stroke} strokeWidth={fl.sw ?? 1} fill={fl.fill} fillOpacity={fl.fo}><path d={l} /><path d={r} fillOpacity={fl.fo * 0.7} /><path d={t} fillOpacity={fl.fo * 1.4} /></g>;
  };
  const s = glow ? C.blue : C.line;
  return (
    <svg viewBox="0 0 360 300" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <rect width="360" height="300" fill="#FFFFFF" />
      <path d={loop(p(-30, -30, 0), p(110, -30, 0), p(110, 40, 0), p(-30, 40, 0))} fill="#F1F5F9" stroke="#E2E8F0" />
      {lod === 0 ? b("m", 0, 0, 0, kind === "equipment" ? 70 : 40, 8, kind === "door" ? 70 : kind === "window" ? 40 : 40, { stroke: s, fill: "#CBD5E1", fo: 0.25 }) : null}
      {lod >= 1 && kind === "door" ? <>
        {b("w", -20, -2, 0, 60, 10, 90, { stroke: C.arch, fill: "#E2E8F0", fo: 0.35 })}
        {b("o", 8, -3, 0, 32, 11, 72, { stroke: "#fff", fill: "#fff", fo: 1, sw: 0 })}
        {b("f", 6, -3, 0, 34, 11, 74, { stroke: s, fill: "#fff", fo: 0.1, sw: 1.2 })}
        {b("l", 10, 1, 0, 30, 5, 70, { stroke: s, fill: "#94A3B8", fo: 0.25 })}
      </> : null}
      {lod >= 1 && kind === "window" ? <>
        {b("w", -20, -2, 0, 70, 10, 90, { stroke: C.arch, fill: "#E2E8F0", fo: 0.35 })}
        {b("o", 5, -3, 26, 45, 11, 70, { stroke: "#fff", fill: "#fff", fo: 1, sw: 0 })}
        {b("f", 4, -3, 25, 46, 11, 71, { stroke: s, fill: "#BFDBFE", fo: 0.2, sw: 1.2 })}
      </> : null}
      {lod >= 1 && kind === "equipment" ? <>
        {b("e", 0, 0, 8, 80, 50, 50, { stroke: s, fill: C.mep, fo: 0.2 })}
        {b("i", -20, 16, 20, 0, 34, 38, { stroke: C.mep, fill: C.mep, fo: 0.25 })}{b("o", 80, 16, 20, 100, 34, 38, { stroke: C.mep, fill: C.mep, fo: 0.25 })}
        {lod >= 2 ? [[4, 4], [66, 4], [4, 38], [66, 38]].map(([a, c], i) => b(`l${i}`, a, c, 0, a + 10, c + 8, 8, { stroke: C.arch, fill: C.arch, fo: 0.3 })) : null}
      </> : null}
      {lod >= 2 && kind === "door" ? <><circle cx={p(28, -4, 34)[0]} cy={p(28, -4, 34)[1]} r="3" fill={s} />{(() => { const q = p(20, -4, 76); return <g><path d={`M${q[0]} ${q[1]}L${q[0] + 30} ${q[1] - 36}`} stroke={s} /><rect x={q[0] + 26} y={q[1] - 58} width="62" height="22" fill="#fff" stroke={s} /><text x={q[0] + 57} y={q[1] - 43} textAnchor="middle" fontSize="10" fill={s} style={mono}>D-02</text></g>; })()}</> : null}
      {lod >= 2 && kind === "window" ? (() => { const q = p(25, -4, 70); return <g><path d={`M${q[0]} ${q[1]}L${q[0] + 30} ${q[1] - 30}`} stroke={s} /><rect x={q[0] + 26} y={q[1] - 52} width="62" height="22" fill="#fff" stroke={s} /><text x={q[0] + 57} y={q[1] - 37} textAnchor="middle" fontSize="10" fill={s} style={mono}>W-05</text></g>; })() : null}
      {lod >= 2 && kind === "equipment" ? (() => { const q = p(40, 0, 50); return <g><path d={`M${q[0]} ${q[1]}L${q[0] + 30} ${q[1] - 30}`} stroke={s} /><rect x={q[0] + 26} y={q[1] - 52} width="66" height="22" fill="#fff" stroke={s} /><text x={q[0] + 59} y={q[1] - 37} textAnchor="middle" fontSize="10" fill={s} style={mono}>AHU-01</text></g>; })() : null}
      {lod >= 3 ? <g fontSize="9" fill={C.arch} style={mono}><path d="M10 270H350" stroke="#E2E8F0" /><text x="12" y="286">TYPE · SIZE · LEVEL · SYSTEM → SCHEDULE</text></g> : null}
    </svg>
  );
}

/* ───────── custom icons ───────── */

export function RvtIcon({ k, className }: { k: number; className?: string }) {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden {...c}>
      {k === 0 ? <><path d="M10 50V22h36v28" /><path d="M10 22l10 -8h36l-10 8M46 22V14" /><path d="M20 50V36h10v14M36 30h6v8h-6z" /></> : null}
      {k === 1 ? <><path d="M12 12v40M32 12v40M52 12v40M8 22h48M8 40h48" /><rect x="29" y="19" width="6" height="6" /></> : null}
      {k === 2 ? <><path d="M8 24h48v8H8zM8 42h30" /><circle cx="48" cy="44" r="6" /></> : null}
      {k === 3 ? <><rect x="14" y="22" width="26" height="22" /><path d="M40 28h10M40 38h10M20 22v-8h14v8" /><circle cx="27" cy="33" r="4" /></> : null}
      {k === 4 ? <><rect x="8" y="10" width="48" height="44" /><path d="M8 40h48M30 40v14M14 16h18v14H14z" /></> : null}
      {k === 5 ? <><rect x="8" y="14" width="22" height="22" /><rect x="26" y="26" width="22" height="22" strokeDasharray="4 3" /><path d="M44 14l8 -6M52 8v8h-8" /></> : null}
      {k === 6 ? <><rect x="10" y="10" width="44" height="44" /><path d="M10 22h44M22 22v32M10 36h44" /></> : null}
      {k === 7 ? <><rect x="10" y="12" width="16" height="16" /><rect x="34" y="12" width="16" height="16" /><rect x="10" y="36" width="16" height="16" /><rect x="34" y="36" width="16" height="16" /></> : null}
    </svg>
  );
}
