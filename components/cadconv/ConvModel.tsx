import { useId } from "react";
import { makeIso, boxFaces, loop, seg } from "@/components/svg/iso";

export const mono = { fontFamily: "var(--font-mono)" } as const;
export const Q = { navy: "#0B1B33", paper: "#E8E0CC", ink: "#111827", amber: "#F59E0B", green: "#22C55E", cyan: "#7DD3FC", blue: "#60A5FA" };

export type LayerId = "A-WALL" | "A-DOOR" | "A-WIND" | "A-DIMS" | "A-TEXT" | "S-COLS" | "M-EQUIP";
export const LAYERS: { id: LayerId; label: string; color: string; weight: number }[] = [
  { id: "A-WALL", label: "Walls", color: "#E2E8F0", weight: 2.6 }, { id: "A-DOOR", label: "Doors", color: "#38BDF8", weight: 1.2 }, { id: "A-WIND", label: "Windows", color: "#60A5FA", weight: 1.2 },
  { id: "A-DIMS", label: "Dimensions", color: "#4ADE80", weight: 0.9 }, { id: "A-TEXT", label: "Text", color: "#C4B5FD", weight: 0.9 }, { id: "S-COLS", label: "Columns", color: "#2DD4BF", weight: 1.4 }, { id: "M-EQUIP", label: "Equipment", color: "#F472B6", weight: 1.2 },
];

export type Ent = { id: string; layer: LayerId; kind: "line" | "poly" | "arc" | "dim" | "text" | "block"; d?: string; t?: string; x?: number; y?: number; size?: number };
export const ENTS: Ent[] = [
  { id: "w-top", layer: "A-WALL", kind: "line", d: "M80 90H520" }, { id: "w-right", layer: "A-WALL", kind: "line", d: "M520 90V330" }, { id: "w-left", layer: "A-WALL", kind: "line", d: "M80 90V330" },
  { id: "w-bot1", layer: "A-WALL", kind: "line", d: "M80 330H150" }, { id: "w-bot2", layer: "A-WALL", kind: "line", d: "M180 330H520" },
  { id: "w-p1", layer: "A-WALL", kind: "line", d: "M300 90V250" }, { id: "w-p2", layer: "A-WALL", kind: "line", d: "M300 290V330" }, { id: "w-p3", layer: "A-WALL", kind: "line", d: "M80 210H300" }, { id: "w-p4", layer: "A-WALL", kind: "line", d: "M300 200H520" },
  { id: "d1", layer: "A-DOOR", kind: "arc", d: "M150 330V300M150 300A30 30 0 0 1 180 330" }, { id: "d2", layer: "A-DOOR", kind: "arc", d: "M300 250H330M330 250A30 30 0 0 1 300 280" },
  { id: "win1", layer: "A-WIND", kind: "line", d: "M130 86H220M130 94H220M130 86V94M220 86V94" }, { id: "win2", layer: "A-WIND", kind: "line", d: "M390 86H470M390 94H470M390 86V94M470 86V94" },
  { id: "c1", layer: "S-COLS", kind: "block", d: "M75 85h10v10h-10zM295 85h10v10h-10zM515 85h10v10h-10zM75 325h10v10h-10zM515 325h10v10h-10z" },
  { id: "eq", layer: "M-EQUIP", kind: "block", d: "M380 240h80v60h-80zM380 240l80 60M460 240l-80 60" },
  { id: "dim1", layer: "A-DIMS", kind: "dim", d: "M80 62H300M80 55V69M300 55V69M75 67l10 -10M295 67l10 -10" }, { id: "dim2", layer: "A-DIMS", kind: "dim", d: "M300 62H520M520 55V69M515 67l10 -10" },
  { id: "dim3", layer: "A-DIMS", kind: "dim", d: "M80 44H520M80 38V50M520 38V50M75 49l10 -10M515 49l10 -10" }, { id: "dim4", layer: "A-DIMS", kind: "dim", d: "M556 90V330M550 90H562M550 330H562M551 95l10 -10M551 335l10 -10" },
  { id: "t-dim1", layer: "A-DIMS", kind: "text", t: "3500", x: 190, y: 57, size: 10 }, { id: "t-dim2", layer: "A-DIMS", kind: "text", t: "3500", x: 410, y: 57, size: 10 }, { id: "t-dim3", layer: "A-DIMS", kind: "text", t: "7000", x: 300, y: 39, size: 10 }, { id: "t-dim4", layer: "A-DIMS", kind: "text", t: "4100", x: 582, y: 214, size: 10 },
  { id: "t-off", layer: "A-TEXT", kind: "text", t: "OFFICE", x: 160, y: 156, size: 13 }, { id: "t-work", layer: "A-TEXT", kind: "text", t: "WORKSHOP", x: 372, y: 150, size: 13 }, { id: "t-store", layer: "A-TEXT", kind: "text", t: "STORE", x: 160, y: 276, size: 13 },
  { id: "t-eq", layer: "A-TEXT", kind: "text", t: "PRESS", x: 400, y: 320, size: 10 }, { id: "t-note", layer: "A-TEXT", kind: "text", t: "ALL DIMENSIONS IN MM", x: 80, y: 362, size: 9 }, { id: "t-title", layer: "A-TEXT", kind: "text", t: "GROUND FLOOR PLAN", x: 80, y: 392, size: 12 },
];
const SHAPES = ENTS.filter((e) => e.kind !== "text");
const TEXTS = ENTS.filter((e) => e.kind === "text");
const lay = (id: LayerId) => LAYERS.find((l) => l.id === id)!;

export type ConvView = "source" | "vector" | "layers" | "native" | "final";
export const VIEW_STAGE: Record<ConvView, number> = { source: 0, vector: 2, layers: 5, native: 4, final: 6 };
export const STAGE_NAME = ["Raster source", "Source analysis", "Vector reconstruction", "Editable text", "Native dimensions", "Layers assigned", "Final DWG"];

export function ConvScene({ stage, hidden = [], selected = null, className, title, legend = true }: { stage: number; hidden?: LayerId[]; selected?: string | null; className?: string; title: string; legend?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const vis = (e: Ent) => !hidden.includes(e.layer);
  const draw = (on: boolean) => ({ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: "stroke-dashoffset 1.1s ease" }) as React.CSSProperties;
  const o = (on: boolean) => ({ opacity: on ? 1 : 0, transition: "opacity 0.8s ease" }) as React.CSSProperties;
  const final = stage >= 6;
  const colorBy = stage >= 5 && !final;
  const strokeFor = (e: Ent) => (final ? Q.ink : colorBy ? lay(e.layer).color : "#E2E8F0");
  const widthFor = (e: Ent) => (final ? (e.layer === "A-WALL" ? 2.4 : e.layer === "S-COLS" ? 1.6 : 1) : stage >= 5 ? lay(e.layer).weight : 1.3);
  const sel = selected ? ENTS.find((e) => e.id === selected) : null;
  return (
    <svg viewBox="0 0 640 440" className={className} role="img" aria-label={title} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      <defs>
        <filter id={`${uid}-n`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="t" /><feColorMatrix in="t" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.35 0" /></filter>
        <filter id={`${uid}-s`}><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="2" result="w" /><feDisplacementMap in="SourceGraphic" in2="w" scale="3.2" /><feGaussianBlur stdDeviation="0.5" /></filter>
      </defs>
      <rect width="640" height="440" fill={Q.navy} />
      {/* source paper */}
      <g style={o(stage <= 1)}><rect width="640" height="440" fill={Q.paper} /><rect width="640" height="440" filter={`url(#${uid}-n)`} />
        <g filter={`url(#${uid}-s)`} stroke="#4A4436" strokeOpacity="0.62" strokeWidth="1.7">
          {SHAPES.map((e) => <path key={e.id} d={e.d} />)}
          {TEXTS.map((e) => <text key={e.id} x={e.x} y={e.y} fontSize={e.size} fill="#4A4436" fillOpacity="0.6" stroke="none" textAnchor="middle" style={mono}>{e.t}</text>)}
          <path d="M60 300l20 -6l8 -26" stroke="#7A5A2B" strokeWidth="1.2" />
        </g>
      </g>
      {/* analysis boxes */}
      <g style={o(stage === 1)} stroke={Q.amber} strokeDasharray="5 3" strokeWidth="1.2"><rect x="70" y="80" width="460" height="260" /><rect x="70" y="32" width="460" height="44" /><rect x="150" y="136" width="80" height="26" /><rect x="360" y="134" width="90" height="22" /><rect x="372" y="232" width="96" height="76" /><text x="76" y="24" fill={Q.amber} stroke="none" fontSize="10" style={mono}>SOURCE ANALYSIS · GEOMETRY · TEXT · DIMENSIONS · LAYERS</text></g>
      {/* ghost source under vector */}
      <g style={{ opacity: stage === 2 ? 0.2 : 0, transition: "opacity 0.8s" }} stroke="#C8BFA8" strokeWidth="2">{SHAPES.map((e) => <path key={e.id} d={e.d} />)}</g>
      {/* final sheet */}
      <g style={o(final)}><rect width="640" height="440" fill="#FFFFFF" /><rect x="14" y="14" width="612" height="412" stroke={Q.ink} strokeWidth="1.6" />
        <g><rect x="410" y="372" width="216" height="54" stroke={Q.ink} /><path d="M410 392H626M520 372V426" stroke={Q.ink} strokeWidth="0.8" /><text x="418" y="386" fontSize="9" fill={Q.ink} style={mono}>CONVERTED · DWG</text><text x="418" y="412" fontSize="8" fill="#475569" style={mono}>SCALE: ILLUSTRATIVE</text><text x="528" y="386" fontSize="9" fill={Q.ink} style={mono}>REV —</text><text x="528" y="412" fontSize="8" fill="#475569" style={mono}>SHEET 01</text></g></g>
      {/* vector geometry */}
      {SHAPES.filter(vis).map((e) => e.kind === "dim" ? null : (
        <path key={e.id} d={e.d} pathLength={1} stroke={strokeFor(e)} strokeWidth={widthFor(e)} style={{ ...draw(stage >= 2), transition: "stroke-dashoffset 1.1s ease, stroke 0.8s ease" }} />
      ))}
      {SHAPES.filter((e) => e.kind === "dim" && vis(e)).map((e) => <path key={e.id} d={e.d} pathLength={1} stroke={strokeFor(e)} strokeWidth={widthFor(e)} style={{ ...draw(stage >= 4), transition: "stroke-dashoffset 1s ease, stroke 0.8s ease" }} />)}
      {/* text */}
      {TEXTS.filter((e) => vis(e) && (e.layer === "A-TEXT" || stage >= 4)).map((e) => (
        <text key={e.id} x={e.x} y={e.y} fontSize={e.size} textAnchor="middle" fill={strokeFor(e)} stroke="none" style={{ ...mono, opacity: stage >= (e.layer === "A-TEXT" ? 3 : 4) ? 1 : 0, transition: "opacity 0.8s, fill 0.8s" }}>{e.t}</text>
      ))}
      {stage === 3 ? <g stroke={Q.cyan} strokeWidth="1" strokeDasharray="3 2"><rect x="124" y="144" width="72" height="16" /><rect x="324" y="138" width="96" height="16" /><path d="M200 144v16" stroke={Q.cyan} strokeWidth="1.6" /></g> : null}
      {stage === 4 || selected ? <g fill={Q.cyan}>{sel && sel.d ? <path d={sel.d} stroke={Q.cyan} strokeWidth="3.2" opacity="0.8" /> : null}{!selected ? [[80, 62], [300, 62], [190, 62]].map(([x, y], i) => <rect key={i} x={x - 3} y={y - 3} width="6" height="6" stroke="#fff" strokeWidth="0.8" />) : null}</g> : null}
      {/* legend */}
      {stage === 5 && legend ? <g fontSize="9" style={mono}>{LAYERS.map((l, i) => <g key={l.id} transform={`translate(574 ${96 + i * 18})`} opacity={hidden.includes(l.id) ? 0.3 : 1}><rect x="-80" y="-9" width="10" height="10" fill={l.color} /><text x="-66" y="0" fill="#CBD5E1">{l.id}</text></g>)}</g> : null}
    </svg>
  );
}

/* ───────── trace vs native CAD ───────── */

function bres(x0: number, y0: number, x1: number, y1: number, g: number) {
  const pts: [number, number][] = [];
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / g;
  for (let i = 0; i <= n; i++) pts.push([Math.round((x0 + ((x1 - x0) * i) / n) / g) * g, Math.round((y0 + ((y1 - y0) * i) / n) / g) * g]);
  return pts;
}
const PIX = (() => {
  const segs: [number, number, number, number][] = [[40, 120, 480, 120], [40, 124, 480, 124], [260, 124, 260, 260], [264, 124, 264, 260], [40, 80, 260, 80], [40, 72, 40, 88], [260, 72, 260, 88]];
  const set = new Set<string>(); const out: [number, number][] = [];
  for (const s of segs) for (const p of bres(s[0], s[1], s[2], s[3], 4)) { const k = p.join(","); if (!set.has(k)) { set.add(k); out.push(p); } }
  let seed = 3; const r = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let x = 90; x < 150; x += 4) for (let y = 190; y < 206; y += 4) if (r() > 0.45) out.push([x, y]);
  for (let x = 130; x < 170; x += 4) for (let y = 66; y < 78; y += 4) if (r() > 0.4) out.push([x, y]);
  return out;
})();

export type TraceSel = "all" | "frag" | "wall" | "dim" | "text" | "door" | null;
export function TraceDemo({ mode, sel, className }: { mode: "raster" | "trace" | "cad"; sel: TraceSel; className?: string }) {
  const hl = (k: TraceSel) => (sel === k ? Q.amber : null);
  return (
    <svg viewBox="0 0 520 300" className={className} role="img" aria-label={`The same wall, dimension and text as ${mode === "cad" ? "native CAD" : mode}`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <title>Raster, trace and native CAD compared</title>
      <rect width="520" height="300" fill={mode === "cad" ? Q.navy : "#EDE6D3"} />
      {mode === "raster" ? <g fill="#4A4436" fillOpacity="0.8">{PIX.map(([x, y], i) => <rect key={i} x={x} y={y} width="4" height="4" />)}</g> : null}
      {mode === "raster" && sel === "all" ? <g stroke={Q.amber} strokeWidth="1.6" strokeDasharray="5 3"><rect x="30" y="60" width="460" height="215" />{[[30, 60], [260, 60], [490, 60], [30, 168], [490, 168], [30, 275], [260, 275], [490, 275]].map(([x, y], i) => <rect key={i} x={x - 4} y={y - 4} width="8" height="8" fill="#fff" />)}<text x="36" y="52" fill={Q.amber} stroke="none" fontSize="10" style={mono}>1 OBJECT · IMAGE</text></g> : null}
      {mode === "trace" ? (
        <g stroke="#475569" strokeWidth="1.8">
          {[[40, 120, 118, 119], [124, 121, 210, 120], [216, 120, 300, 122], [304, 119, 380, 120], [386, 121, 480, 120], [260, 124, 261, 190], [262, 196, 263, 260], [40, 80, 112, 81], [118, 79, 190, 80], [196, 80, 260, 79]].map((s, i) => <path key={i} d={`M${s[0]} ${s[1]}L${s[2]} ${s[3]}`} stroke={sel === "frag" && i === 2 ? Q.amber : "#475569"} strokeWidth={sel === "frag" && i === 2 ? 3 : 1.8} />)}
          {[[40, 120], [118, 119], [124, 121], [210, 120], [216, 120], [300, 122], [260, 190], [262, 196]].map(([x, y], i) => <rect key={i} x={x - 2.5} y={y - 2.5} width="5" height="5" fill="#94A3B8" stroke="none" />)}
          <path d="M96 196l8 -12 6 14 8 -12 6 14 8 -12M138 70l6 -8 5 10 6 -8" stroke="#475569" strokeWidth="1.4" />
        </g>
      ) : null}
      {mode === "cad" ? (
        <g>
          <path d="M40 120H480" stroke={hl("wall") ?? "#E2E8F0"} strokeWidth={sel === "wall" ? 4 : 2.6} /><path d="M260 120V260" stroke="#E2E8F0" strokeWidth="2.6" />
          <path d="M260 180H290M290 180A30 30 0 0 1 260 210" stroke={hl("door") ?? "#38BDF8"} strokeWidth={sel === "door" ? 3.4 : 1.4} />
          <path d="M40 80H260M40 72V88M260 72V88M35 85l10 -10M255 85l10 -10" stroke={hl("dim") ?? "#4ADE80"} strokeWidth={sel === "dim" ? 3 : 1} />
          <text x="150" y="74" fontSize="11" textAnchor="middle" fill={hl("dim") ?? "#4ADE80"} stroke="none" style={mono}>3500</text>
          <text x="125" y="196" fontSize="14" textAnchor="middle" fill={hl("text") ?? "#C4B5FD"} stroke="none" style={mono}>OFFICE</text>
          {sel === "text" ? <rect x="86" y="182" width="78" height="18" stroke={Q.amber} strokeDasharray="3 2" /> : null}
        </g>
      ) : null}
    </svg>
  );
}

/* ───────── mini sheet (archive visuals) ───────── */

export function MiniSheet({ tone = "vector", weight = 1.2, className }: { tone?: "scan" | "vector" | "std"; weight?: number; className?: string }) {
  const c = tone === "scan" ? "#6B6252" : tone === "std" ? "#38BDF8" : "#CBD5E1";
  return (
    <svg viewBox="0 0 120 84" className={className} fill="none" strokeLinecap="round" aria-hidden>
      <rect width="120" height="84" fill={tone === "scan" ? "#E8E0CC" : "#0F2442"} />
      <g stroke={c} strokeWidth={weight} strokeOpacity={tone === "scan" ? 0.7 : 1}><path d="M14 14H106V70H14ZM60 14V70M14 42H60M60 36H106" /><path d="M30 70v-8a8 8 0 0 1 8 8" /></g>
      <path d="M14 8H60" stroke={tone === "std" ? "#4ADE80" : c} strokeWidth="0.7" />
    </svg>
  );
}

/* ───────── 2D → 3D ───────── */

export function Conv3D({ step, rise, className }: { step: 0 | 1 | 2; rise: number; className?: string }) {
  const p = makeIso(250, 215, 0.85);
  const h = 70 * rise;
  const walls: [number, number, number, number][] = [[0, 0, 300, 0], [300, 0, 300, 190], [0, 190, 300, 190], [0, 0, 0, 190], [150, 0, 150, 190], [0, 100, 150, 100]];
  const sorted = [...walls].sort((a, b) => a[0] + a[1] + a[2] + a[3] - (b[0] + b[1] + b[2] + b[3]));
  const box = (w: [number, number, number, number]) => {
    const t = 3, ax = Math.min(w[0], w[2]) - (w[1] === w[3] ? 0 : t), bx = Math.max(w[0], w[2]) + (w[1] === w[3] ? 0 : t), ay = Math.min(w[1], w[3]) - (w[0] === w[2] ? 0 : t), by = Math.max(w[1], w[3]) + (w[0] === w[2] ? 0 : t);
    return boxFaces(p, ax, ay, 0, bx, by, h);
  };
  return (
    <svg viewBox="0 0 640 400" className={className} role="img" aria-label="A 2D plan interpreted into walls and extruded into a 3D model" fill="none" strokeLinejoin="round">
      <title>2D to 3D conversion</title>
      <rect width="640" height="400" fill={Q.navy} />
      <path d={loop(p(-20, -20, 0), p(320, -20, 0), p(320, 210, 0), p(-20, 210, 0))} fill="#0F2442" stroke="#1D3A63" />
      {step < 2 ? <g stroke={step === 1 ? Q.amber : "#E2E8F0"} strokeWidth={step === 1 ? 3 : 1.6}>{walls.map((w, i) => <path key={i} d={seg(p(w[0], w[1], 0), p(w[2], w[3], 0))} />)}</g> : null}
      {step === 1 ? <g fontSize="9" fill={Q.amber} style={mono}>{([["WALL", p(150, 0, 0)], ["OPENING", p(150, 150, 0)], ["LEVEL +0", p(300, 190, 0)]] as [string, readonly [number, number]][]).map(([t, q]) => <text key={t} x={q[0] + 8} y={q[1] - 6}>{t}</text>)}</g> : null}
      {step === 2 ? sorted.map((w, i) => { const [a, b, c] = box(w); return <g key={i} stroke="#7DD3FC" strokeWidth="1" fill="#7DD3FC"><path d={a} fillOpacity="0.1" /><path d={b} fillOpacity="0.07" /><path d={c} fillOpacity="0.18" /></g>; }) : null}
      <text x="18" y="28" fontSize="11" fill="#CBD5E1" style={mono}>{["2D DRAWING", "GEOMETRY INTERPRETATION", "3D MODEL"][step]}</text>
    </svg>
  );
}

/* ───────── icons ───────── */

export function ConvIcon({ k, className }: { k: number; className?: string }) {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden {...c}>
      {k === 0 ? <><path d="M14 8h26l10 10v38H14z" /><path d="M40 8v10h10M22 34h20M22 42h20M22 50h12" /></> : null}
      {k === 1 ? <><rect x="8" y="12" width="48" height="40" /><path d="M8 24h48M20 12v40M36 38h20" /></> : null}
      {k === 2 ? <><path d="M8 44l22 -10 22 10 -22 12z" /><path d="M8 44V28l22 -10 22 10v16M30 34v22" /></> : null}
      {k === 3 ? <><path d="M10 44q10 -24 22 -10t22 -20" /><circle cx="10" cy="44" r="3" /><circle cx="54" cy="14" r="3" /></> : null}
      {k === 4 ? <><rect x="8" y="14" width="20" height="36" /><rect x="36" y="14" width="20" height="36" strokeDasharray="4 3" /><path d="M28 32h8m-4 -4l4 4-4 4" /></> : null}
      {k === 5 ? <><path d="M10 52V16l12 -6 12 6v36M34 52V28l20 -4v28M6 52h52" /></> : null}
      {k === 6 ? <><rect x="8" y="12" width="14" height="14" /><rect x="26" y="12" width="14" height="14" /><rect x="44" y="12" width="12" height="14" /><rect x="8" y="30" width="14" height="14" /><rect x="26" y="30" width="14" height="14" /><rect x="44" y="30" width="12" height="14" /><path d="M8 52h48" /></> : null}
      {k === 7 ? <><path d="M10 14h44M10 28h44M10 42h44" /><circle cx="18" cy="14" r="3" /><circle cx="30" cy="28" r="3" /><circle cx="42" cy="42" r="3" /></> : null}
      {k === 8 ? <><path d="M10 52V12h30l14 14v26z" /><path d="M20 38l8 -8 6 6 10 -12" /></> : null}
      {k === 9 ? <><rect x="10" y="10" width="44" height="44" /><path d="M10 26h44M26 26v28" /></> : null}
    </svg>
  );
}
