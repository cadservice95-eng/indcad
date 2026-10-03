import { makeIso, boxFaces, loop, seg, ellipse, cylinder } from "@/components/svg/iso";

export const mono = { fontFamily: "var(--font-mono)" } as const;
export const E = { navy: "#0B1220", surf: "#101A2E", blue: "#2563EB", cyan: "#38BDF8", amber: "#F59E0B", green: "#22C55E", ink: "#172033" };

const P = makeIso(289, 200, 1.15);
type V3 = [number, number, number];
type Shape =
  | { t: "box"; a: [number, number, number, number, number, number] }
  | { t: "cyl"; cx: number; cy: number; z0: number; z1: number; r: number }
  | { t: "poly"; pts: V3[] }
  | { t: "hole"; cx: number; cy: number; z: number; r: number };
type Part = { id: string; off: V3; shapes: Shape[]; tone: number };

export type ConceptId = "A" | "B" | "C";
const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): Shape => ({ t: "box", a: [x0, y0, z0, x1, y1, z1] });
const cyl = (cx: number, cy: number, z0: number, z1: number, r: number): Shape => ({ t: "cyl", cx, cy, z0, z1, r });

export const CONCEPTS: Record<ConceptId, { name: string; arch: string; parts: Part[] }> = {
  A: {
    name: "Concept A", arch: "Fabricated frame",
    parts: [
      { id: "base", off: [0, 0, 0], tone: 0, shapes: [box(0, 0, 0, 200, 140, 8)] },
      { id: "sides", off: [0, 0, 14], tone: 1, shapes: [box(16, 12, 8, 26, 128, 92), box(174, 12, 8, 184, 128, 92), { t: "poly", pts: [[26, 12, 8], [26, 12, 46], [52, 12, 8]] }, { t: "poly", pts: [[174, 12, 8], [174, 12, 46], [148, 12, 8]] }] },
      { id: "tube", off: [0, 0, 30], tone: 2, shapes: [box(26, 58, 80, 174, 82, 100)] },
      { id: "motor", off: [0, 0, 52], tone: 3, shapes: [box(66, 36, 100, 134, 104, 106), cyl(100, 70, 106, 150, 30)] },
    ],
  },
  B: {
    name: "Concept B", arch: "Machined block",
    parts: [
      { id: "block", off: [0, 0, 0], tone: 0, shapes: [box(0, 0, 0, 200, 140, 64), { t: "poly", pts: [[30, 30, 64], [170, 30, 64], [170, 110, 64], [30, 110, 64]] }, { t: "hole", cx: 14, cy: 14, z: 64, r: 6 }, { t: "hole", cx: 186, cy: 14, z: 64, r: 6 }, { t: "hole", cx: 14, cy: 126, z: 64, r: 6 }, { t: "hole", cx: 186, cy: 126, z: 64, r: 6 }] },
      { id: "motor", off: [0, 0, 50], tone: 3, shapes: [cyl(100, 70, 28, 80, 26)] },
    ],
  },
  C: {
    name: "Concept C", arch: "Modular sheet-metal",
    parts: [
      { id: "shell", off: [0, 0, 0], tone: 0, shapes: [box(0, 0, 0, 130, 140, 72), box(14, 140, 12, 116, 141, 60), box(20, 60, 72, 34, 80, 86), box(96, 60, 72, 110, 80, 86)] },
      { id: "module", off: [46, 0, 0], tone: 3, shapes: [box(142, 20, 0, 200, 120, 60), cyl(171, 70, 60, 92, 18)] },
    ],
  },
};
const TONES = [["#BFD3EA", "#8FB0D4", "#D7E4F3"], ["#7DA6D1", "#5C86B3", "#A9C6E6"], ["#9DB8D4", "#7396BC", "#C0D4E8"], ["#6B7F99", "#566A86", "#8DA0B9"]];

export type ViewMode = "shaded" | "wire" | "exploded" | "section";

export function ConceptSvg({ c, mode = "shaded", fade, className, title, label }: { c: ConceptId; mode?: ViewMode; fade?: boolean; className?: string; title: string; label?: string }) {
  const wire = mode === "wire";
  const ex = mode === "exploded";
  const ap = (v: V3, o: V3): V3 => (ex ? [v[0] + o[0], v[1] + o[1], v[2] + o[2]] : v);
  const part = CONCEPTS[c].parts;
  return (
    <svg viewBox="0 0 640 420" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: fade ? 0.35 : 1, transition: "opacity .6s" }}>
      <title>{title}</title>
      <path d={loop(P(-30, -30, 0), P(240, -30, 0), P(240, 170, 0), P(-30, 170, 0))} fill="#0F2442" fillOpacity={wire ? 0.4 : 1} stroke="#1D3A63" />
      {part.map((pt) => (
        <g key={pt.id} style={{ transition: "transform 0.9s ease" }}>
          {pt.shapes.map((s, i) => {
            const tone = TONES[pt.tone];
            const st = wire ? E.cyan : "#E2F0FF";
            const fo = wire ? 0 : 0.92;
            if (s.t === "box") {
              const a = s.a;
              const [x0, y0, z0, x1, y1, z1] = [a[0], a[1], a[2], a[3], a[4], a[5]];
              const o = pt.off;
              const [l, r, t] = boxFaces(P, ...(ap([x0, y0, z0], o) as V3), ...(ap([x1, y1, z1], o) as V3));
              return <g key={i} stroke={st} strokeWidth="1" strokeOpacity="0.9"><path d={l} fill={tone[0]} fillOpacity={fo} /><path d={r} fill={tone[1]} fillOpacity={fo} /><path d={t} fill={tone[2]} fillOpacity={fo} /></g>;
            }
            if (s.t === "poly") {
              const pts = s.pts.map((v) => P(...ap(v, pt.off)));
              return <path key={i} d={loop(...pts)} fill={c === "B" ? "#0B1B33" : tone[1]} fillOpacity={wire ? 0 : c === "B" ? 0.55 : 0.9} stroke={st} strokeWidth="1" />;
            }
            if (s.t === "cyl") {
              const o = ap([s.cx, s.cy, s.z0], pt.off), o1 = ap([s.cx, s.cy, s.z1], pt.off);
              const d = cylinder(P, o[0], o[1], o[2], o1[2], s.r, 1.15);
              const top = ellipse(P, o1[0], o1[1], o1[2], s.r, 1.15);
              return <g key={i}><path d={d} stroke={wire ? E.cyan : "#E2F0FF"} strokeWidth="1" fill={tone[1]} fillOpacity={wire ? 0 : 0.5} /><path d={top} fill={tone[2]} fillOpacity={wire ? 0 : 0.9} stroke={wire ? E.cyan : "#E2F0FF"} /></g>;
            }
            const h = ap([s.cx, s.cy, s.z], pt.off);
            return <path key={i} d={ellipse(P, h[0], h[1], h[2], s.r, 1.15)} fill="#0B1B33" stroke={st} strokeWidth="1" />;
          })}
        </g>
      ))}
      {mode === "section" ? (
        <g><path d={loop(P(-10, 70, -4), P(210, 70, -4), P(210, 70, 154), P(-10, 70, 154))} fill={E.amber} fillOpacity="0.14" stroke={E.amber} strokeWidth="1.4" strokeDasharray="6 4" /><text x={P(210, 70, 154)[0] + 6} y={P(210, 70, 154)[1]} fontSize="10" fill={E.amber} style={mono}>SECTION A-A</text></g>
      ) : null}
      {label ? <text x="24" y="34" fontSize="13" fill="#E2E8F0" style={mono} letterSpacing="1.2">{label}</text> : null}
    </svg>
  );
}

/* ───────── DFM part ───────── */

export type DfmHot = "access" | "feature" | "assembly" | "material" | "machining";
export const DFM_INFO: Record<DfmHot, { t: string; before: string; after: string }> = {
  access: { t: "Manufacturing access", before: "A deep, narrow pocket is hard to reach with standard tooling.", after: "A wider, shallower pocket gives tools room to work." },
  feature: { t: "Feature complexity", before: "A small intricate rib adds machining effort for little functional gain.", after: "The rib is removed or merged into a simpler form." },
  assembly: { t: "Assembly", before: "A fastener is hidden where it can't be reached once assembled.", after: "The fastener is moved to an accessible position." },
  material: { t: "Material", before: "A very thin wall invites distortion in manufacture.", after: "Wall thickness is made consistent." },
  machining: { t: "Machining", before: "Sharp internal corners can't be cut cleanly by a rotating tool.", after: "Internal corners are given a radius." },
};
const HOT_POS: Record<DfmHot, V3> = { access: [100, 70, 60], feature: [12, 70, 66], assembly: [186, 126, 66], material: [190, 70, 40], machining: [70, 40, 60] };

export function DfmPart({ rev, hot, onHot, className }: { rev: boolean; hot: DfmHot | null; onHot?: (h: DfmHot) => void; className?: string }) {
  const px0 = rev ? 40 : 72, px1 = rev ? 160 : 128, py0 = 30, py1 = 110, floor = rev ? 38 : 8;
  const c = 8;
  const pocket = rev
    ? [[px0 + c, py0, 66], [px1 - c, py0, 66], [px1, py0 + c, 66], [px1, py1 - c, 66], [px1 - c, py1, 66], [px0 + c, py1, 66], [px0, py1 - c, 66], [px0, py0 + c, 66]] as V3[]
    : ([[px0, py0, 66], [px1, py0, 66], [px1, py1, 66], [px0, py1, 66]] as V3[]);
  const [l, r, t] = boxFaces(P, 0, 0, 0, 200, 140, 66);
  const wallX = loop(P(px0, py0, floor), P(px0, py1, floor), P(px0, py1, 66), P(px0, py0, 66));
  const wallY = loop(P(px0, py0, floor), P(px1, py0, floor), P(px1, py0, 66), P(px0, py0, 66));
  return (
    <svg viewBox="0 0 640 420" className={className} role="img" aria-label={rev ? "Revised, more manufacturable design" : "Original design with manufacturing issues highlighted"} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{rev ? "Revised design" : "Original design"}</title>
      <path d={loop(P(-30, -30, 0), P(240, -30, 0), P(240, 170, 0), P(-30, 170, 0))} fill="#0F2442" stroke="#1D3A63" />
      <g stroke="#E2F0FF" strokeWidth="1"><path d={l} fill="#8FB0D4" /><path d={r} fill="#6F94BE" /><path d={t} fill="#C8DAEE" />
        <path d={loop(...pocket.map((v) => P(...v)))} fill="#0B1B33" fillOpacity="0.85" /><path d={wallX} fill="#4C6E96" /><path d={wallY} fill="#5C7FA8" />
        {!rev ? <path d={loop(P(0, 60, 66), P(0, 80, 66), P(0, 80, 80), P(0, 60, 80))} fill="#D7E4F3" /> : null}
        {[[14, 14], [186, 14], [14, 126], [186, 126]].map(([x, y], i) => <path key={i} d={ellipse(P, x, y, 66, 6, 1.15)} fill="#0B1B33" />)}
      </g>
      {true ? (Object.keys(HOT_POS) as DfmHot[]).map((k, i) => {
        const q = P(...HOT_POS[k]);
        const on = hot === k;
        const show = rev ? false : true;
        return show ? (
          <g key={k} role={onHot ? "button" : undefined} tabIndex={onHot ? 0 : undefined} aria-label={DFM_INFO[k].t} style={{ cursor: onHot ? "pointer" : "default", outline: "none" }} onClick={() => onHot?.(k)} onFocus={() => onHot?.(k)} onPointerEnter={() => onHot?.(k)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onHot?.(k); } }}>
            <circle cx={q[0]} cy={q[1]} r={on ? 16 : 11} fill={E.amber} fillOpacity={on ? 0.35 : 0.18} stroke={E.amber} strokeWidth={on ? 2.4 : 1.6} />
            <text x={q[0]} y={q[1] + 4} textAnchor="middle" fontSize="11" fill="#FDE68A" style={mono}>{i + 1}</text>
          </g>
        ) : null;
      }) : null}
      {rev ? <g><circle cx="560" cy="40" r="10" fill={E.green} fillOpacity="0.2" stroke={E.green} /><text x="540" y="44" textAnchor="end" fontSize="11" fill="#86EFAC" style={mono}>REVISED</text></g> : <text x="616" y="44" textAnchor="end" fontSize="11" fill="#FCD34D" style={mono}>DFM REVIEW</text>}
    </svg>
  );
}

/* ───────── drawing projection (documentation card) ───────── */

export function ProjectionSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="An illustrative drawing sheet with front, top and side views and dimensions" fill="none" strokeLinecap="round">
      <title>Drawing sheet</title>
      <rect width="400" height="280" fill="#fff" /><rect x="10" y="10" width="380" height="260" stroke="#172033" strokeWidth="1.4" />
      <g stroke="#172033" strokeWidth="1.4"><rect x="40" y="120" width="140" height="90" /><rect x="50" y="130" width="120" height="14" /><path d="M110 120V210" strokeDasharray="6 3" strokeWidth="0.8" /><rect x="40" y="40" width="140" height="62" /><circle cx="110" cy="71" r="22" /><rect x="214" y="120" width="70" height="90" /><path d="M214 160H284" strokeDasharray="6 3" strokeWidth="0.8" /></g>
      <g stroke="#64748B" strokeWidth="0.8"><path d="M40 226H180M40 220V232M180 220V232M298 120V210M292 120H304M292 210H304" /></g>
      <g fontSize="9" fill="#475569" style={mono}><text x="110" y="238" textAnchor="middle">200</text><text x="304" y="168">90</text></g>
      <g stroke="#172033" strokeWidth="0.8"><rect x="260" y="226" width="120" height="34" /><path d="M260 243H380" /></g><text x="266" y="238" fontSize="8" fill="#172033" style={mono}>ILLUSTRATIVE · REV A</text>
    </svg>
  );
}

/* ───────── icons ───────── */

export function EdIcon({ k, className }: { k: number; className?: string }) {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden {...c}>
      {k === 0 ? <><rect x="8" y="30" width="16" height="22" /><rect x="26" y="20" width="16" height="32" /><rect x="44" y="12" width="12" height="40" /></> : null}
      {k === 1 ? <><path d="M10 44l22 -10 22 10 -22 12z" /><path d="M10 44V28l22 -10 22 10v16M32 34v22" /></> : null}
      {k === 2 ? <><rect x="10" y="14" width="44" height="36" /><path d="M20 38l8 -8 6 6 10 -12" /><circle cx="46" cy="22" r="4" strokeDasharray="3 2" /></> : null}
      {k === 3 ? <><path d="M14 8h26l10 10v38H14z" /><path d="M22 28h20M22 36h20M22 44h12" /></> : null}
      {k === 4 ? <><path d="M10 50L26 30l10 10 18 -26" /><path d="M42 14h12v12" /></> : null}
      {k === 5 ? <><rect x="8" y="12" width="48" height="12" /><rect x="8" y="30" width="48" height="12" /><path d="M16 52h32" /></> : null}
      {k === 6 ? <><path d="M10 20h44M10 32h44M10 44h44" /><path d="M24 12v40M44 12v40" strokeDasharray="3 3" /></> : null}
      {k === 7 ? <><circle cx="32" cy="32" r="20" /><path d="M32 20v12l8 6" /></> : null}
      {k === 8 ? <><rect x="10" y="10" width="44" height="44" /><path d="M10 28h44M28 28v26" /></> : null}
    </svg>
  );
}

export { seg };
