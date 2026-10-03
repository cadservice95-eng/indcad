import type { ReactNode } from "react";

/**
 * One generic legacy equipment bracket (front view, 220 × 140 units) drives every drawing on the page.
 * Deliberately asymmetric: offset hole, stepped edge, relief notch. Illustrative geometry only.
 */
export const C = {
  bg: "#07111F", panel: "#0B1728", raise: "#122033", blue: "#1D4ED8", sky: "#38BDF8", ink: "#E5E7EB", paper: "#F8FAFC", mute: "#64748B",
  amber: "#D6A84F", green: "#4ADE80", red: "#F87171", aged: "#A8977A",
};
export const mono = { fontFamily: "var(--font-mono)" } as const;
export const ln = (c: string, w = 1.3) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;
export function T({ x, y, c = C.ink, size = 9, a = "start", children, w }: { x: number | string; y: number | string; c?: string; size?: number; a?: "start" | "middle" | "end"; children: ReactNode; w?: number }) {
  return <text x={x} y={y} fill={c} fontSize={size} textAnchor={a} fontWeight={w} style={mono}>{children}</text>;
}
export function Fade({ on, children }: { on: boolean; children: ReactNode }) {
  return <g style={{ opacity: on ? 1 : 0, transition: "opacity .5s ease" }}>{children}</g>;
}
export function Grid({ w, h, step = 20, c = "#38BDF8", o = 0.06 }: { w: number; h: number; step?: number; c?: string; o?: number }) {
  return <g stroke={c} strokeOpacity={o}>{Array.from({ length: Math.ceil(w / step) + 1 }, (_, i) => <path key={i} d={`M${i * step} 0V${h}`} />)}{Array.from({ length: Math.ceil(h / step) + 1 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * step}H${w}`} />)}</g>;
}

/* ───────── geometry ───────── */
export const PROFILE: [number, number][] = [[0, 20], [150, 20], [150, 0], [220, 0], [220, 100], [190, 100], [190, 140], [80, 140], [80, 128], [60, 128], [60, 140], [30, 140], [30, 112], [0, 112]];
export const HOLES = [{ id: "bore", x: 110, y: 70, r: 22 }, { id: "offset", x: 196, y: 30, r: 8 }, { id: "h1", x: 18, y: 66, r: 6 }, { id: "h2", x: 170, y: 122, r: 6 }];

/** Place the part: origin (ox, oy) and scale k. */
export function xf(ox: number, oy: number, k: number) {
  const P = (x: number, y: number) => [ox + x * k, oy + y * k] as const;
  const path = (pts: [number, number][], jit = 0) => "M" + pts.map(([x, y], i) => { const j = jit ? Math.sin(i * 2.3) * jit : 0; const [a, b] = P(x + j, y - j * 0.6); return `${a.toFixed(1)} ${b.toFixed(1)}`; }).join("L") + "Z";
  return { P, path, k };
}

/** The part outline + holes, in one of three renderings. */
export function Part({ ox, oy, k, style, hot }: { ox: number; oy: number; k: number; style: "aged" | "drawing" | "solid"; hot?: string | null }) {
  const { P, path } = xf(ox, oy, k);
  const off = [26, -18];
  if (style === "solid") {
    const back = PROFILE.map(([x, y]) => [x + off[0] / k, y + off[1] / k] as [number, number]);
    return (
      <g>
        <path d={path(back)} fillOpacity="0.5" {...ln(C.sky, 1)} fill="#1E3A5F" strokeOpacity="0.6" />
        {PROFILE.map(([x, y], i) => { const [a, b] = P(x, y); return <path key={i} d={`M${a} ${b}l${off[0]} ${off[1]}`} {...ln(C.sky, 0.9)} strokeOpacity="0.7" />; })}
        <path d={path(PROFILE)} fillOpacity="0.35" {...ln(C.sky, 1.6)} fill="#2563EB" />
        {HOLES.map((h) => { const [a, b] = P(h.x, h.y); return <g key={h.id}><circle cx={a + off[0]} cy={b + off[1]} r={h.r * k} {...ln(C.sky, 0.7)} strokeOpacity="0.5" /><circle cx={a} cy={b} r={h.r * k} {...ln(hot === h.id ? "#fff" : C.sky, hot === h.id ? 2.4 : 1.4)} fill={C.bg} /></g>; })}
      </g>
    );
  }
  const aged = style === "aged";
  const stroke = aged ? C.aged : C.ink;
  return (
    <g>
      <path d={path(PROFILE, aged ? 1.4 : 0)} fillOpacity={aged ? 0.55 : 0} {...ln(stroke, aged ? 1.8 : 1.5)} fill={aged ? "#3B3427" : "none"} />
      {HOLES.map((h) => { const [a, b] = P(h.x, h.y); return <ellipse key={h.id} cx={a + (aged && h.id === "bore" ? 1.5 : 0)} cy={b} rx={h.r * k * (aged && h.id === "bore" ? 1.08 : 1)} ry={h.r * k} {...ln(hot === h.id ? C.sky : stroke, hot === h.id ? 2.4 : 1.3)} fill={aged ? C.bg : "none"} />; })}
      {aged ? (
        <g>
          {[[40, 40, 14], [120, 110, 10], [200, 70, 9]].map(([x, y, r], i) => { const [a, b] = P(x, y); return <circle key={i} cx={a} cy={b} r={r * k} fill="#6B5B3E" fillOpacity="0.35" />; })}
          {(() => { const [a, b] = P(36, 92); return <T x={a} y={b} c="#8C7B5E" size={8 * k * 1.4}>P/N ▒▒-▒▒</T>; })()}
          <path d={`M${P(150, 0)[0]} ${P(150, 0)[1]}l${-4 * k} ${3 * k}`} {...ln("#8C7B5E", 1)} />
        </g>
      ) : null}
      {!aged ? <path d={`M${P(110, 40)[0]} ${P(110, 40)[1]}V${P(110, 100)[1]}M${P(80, 70)[0]} ${P(80, 70)[1]}H${P(140, 70)[0]}`} {...ln(C.red, 0.7)} strokeDasharray="8 3 2 3" /> : null}
    </g>
  );
}

/* ───────── features (reproduce, not improve) ───────── */
export type Feat = { id: string; label: string; at: [number, number]; source: string; why: string };
export const FEATURES: Feat[] = [
  { id: "offset", label: "Offset hole", at: [196, 30], source: "Measured / existing reference", why: "Off the pattern you'd expect — and possibly deliberate. Documented exactly where it is." },
  { id: "step", label: "Asymmetric step", at: [150, 10], source: "Measured", why: "The top edge isn't symmetrical. The drawing records the step rather than squaring it off." },
  { id: "notch", label: "Relief notch", at: [70, 134], source: "Measured · wear reviewed", why: "Could look like damage; captured as a feature, with worn edges noted separately." },
  { id: "edge", label: "Stepped edge", at: [190, 120], source: "Existing reference", why: "The lower right step is preserved in documentation — not 'tidied up'." },
  { id: "bore", label: "Main bore", at: [110, 70], source: "Specified (legacy record)", why: "Diameter from the original record where it survives; position measured." },
];

/* ───────── traceability (dimensions with a basis) ───────── */
export type Basis = "MEASURED" | "SPECIFIED" | "INFERRED" | "REVIEW";
export const BASIS_C: Record<Basis, string> = { MEASURED: C.sky, SPECIFIED: C.green, INFERRED: C.amber, REVIEW: C.red };
export const BASIS_TXT: Record<Basis, string> = {
  MEASURED: "Based on direct measurement of the physical part.",
  SPECIFIED: "Taken from an original specification or surviving document.",
  INFERRED: "Engineering interpretation — identified as such on the drawing.",
  REVIEW: "Unresolved — needs confirmation before it can be relied on.",
};
export type Dim = { id: string; kind: "Dimension" | "Tolerance" | "Material" | "Feature"; label: string; basis: Basis; confidence: string };
export const DIMS: Dim[] = [
  { id: "w", kind: "Dimension", label: "Overall width · d₁", basis: "MEASURED", confidence: "Reference-based" },
  { id: "bore", kind: "Dimension", label: "Bore Ø · d₂", basis: "SPECIFIED", confidence: "Legacy record" },
  { id: "tol", kind: "Tolerance", label: "Bore tolerance · t₁", basis: "SPECIFIED", confidence: "Legacy record" },
  { id: "off", kind: "Dimension", label: "Offset hole position · d₃", basis: "MEASURED", confidence: "Reference-based" },
  { id: "notch", kind: "Feature", label: "Notch depth · d₄", basis: "INFERRED", confidence: "Worn — interpreted" },
  { id: "mat", kind: "Material", label: "Material call-out", basis: "REVIEW", confidence: "Original grade unconfirmed" },
];

/** Engineering drawing of the part with clickable, source-marked dimensions. */
export function TraceDrawing({ active, onPick, interactive = true }: { active?: string | null; onPick?: (id: string) => void; interactive?: boolean }) {
  const k = 1.3, ox = 60, oy = 70;
  const { P } = xf(ox, oy, k);
  const d = DIMS.reduce<Record<string, Dim>>((m, x) => ({ ...m, [x.id]: x }), {});
  const mark = (id: string, x: number, y: number) => {
    const dim = d[id], on = active === id, col = BASIS_C[dim.basis];
    const props = interactive ? { role: "button", tabIndex: 0, "aria-pressed": on, "aria-label": `${dim.label}: basis ${dim.basis}`, onClick: () => onPick?.(id), onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick?.(id); } }, style: { cursor: "pointer", outline: "none" } } : {};
    return (
      <g {...props}>
        <rect x={x - 2} y={y - 11} width={dim.basis.length * 6.2 + 18} height="16" fill={on ? col : C.bg} fillOpacity={on ? 0.25 : 1} stroke={col} strokeWidth={on ? 1.8 : 1} />
        <circle cx={x + 6} cy={y - 3} r="3" fill={col} /><T x={x + 13} y={y + 1} c={col} size={8.5}>{dim.basis}</T>
      </g>
    );
  };
  const [x0, y0] = P(0, 0), [x1] = P(220, 0), [, y1] = P(0, 140);
  const [bx, by] = P(110, 70), [hx, hy] = P(196, 30), [nx, ny] = P(70, 128);
  const hl = (id: string) => (active === id ? C.sky : C.green);
  return (
    <g>
      <Part ox={ox} oy={oy} k={k} style="drawing" hot={active === "off" ? "offset" : active === "bore" || active === "tol" ? "bore" : null} />
      {/* dimensions */}
      <g {...ln(hl("w"), active === "w" ? 1.6 : 0.9)}><path d={`M${x0} ${y0 - 6}V${y0 - 26}M${x1} ${y0 - 6}V${y0 - 26}M${x0} ${y0 - 20}H${x1}`} /></g>
      <T x={(x0 + x1) / 2} y={y0 - 24} a="middle" c={hl("w")} size={10}>d₁</T>
      {mark("w", (x0 + x1) / 2 + 30, y0 - 22)}
      <g {...ln(hl("bore"), active === "bore" ? 1.6 : 0.9)}><path d={`M${bx - 22 * k * 0.7} ${by - 22 * k * 0.7}L${x0 + 70} ${y0 - 42}H${x0 + 6}`} /></g>
      <T x={x0 + 4} y={y0 - 46} c={hl("bore")} size={10}>Ø d₂</T>
      <T x={x0 + 40} y={y0 - 46} c={active === "tol" ? C.sky : C.amber} size={10}>± t₁</T>
      {mark("bore", x0 + 76, y0 - 48)}{mark("tol", x0 + 156, y0 - 48)}
      <g {...ln(hl("off"), active === "off" ? 1.6 : 0.9)}><path d={`M${hx} ${hy}H${x1 + 30}M${x1 + 24} ${y0}V${hy}`} strokeDasharray="0" /></g>
      <T x={x1 + 30} y={(y0 + hy) / 2 + 3} c={hl("off")} size={10}>d₃</T>
      {mark("off", x1 + 26, hy + 26)}
      <g {...ln(hl("notch"), active === "notch" ? 1.6 : 0.9)}><path d={`M${nx - 30 * 0.5} ${ny}H${nx - 42}M${nx - 42 + 6} ${y1}V${ny}`} /></g>
      <T x={nx - 62} y={(ny + y1) / 2 + 3} c={hl("notch")} size={10}>d₄</T>
      {mark("notch", nx - 140, y1 + 28)}
      <g><rect x={x1 - 120} y={y1 + 18} width="150" height="20" {...ln(C.mute, 0.8)} fill={C.bg} /><T x={x1 - 114} y={y1 + 32} c={C.ink} size={9}>MATERIAL: ▢ — see note</T></g>
      {mark("mat", x1 - 120, y1 + 56)}
    </g>
  );
}

/* ───────── confidence states over the part ───────── */
export const STATES = [
  { k: "CONFIRMED", sub: "Measured", c: C.sky, feats: ["w", "h1", "h2", "step"] },
  { k: "DOCUMENTED", sub: "Original specification", c: C.green, feats: ["bore"] },
  { k: "INFERRED", sub: "Engineering interpretation", c: C.amber, feats: ["notch", "edge"] },
  { k: "REQUIRES REVIEW", sub: "Unresolved", c: C.red, feats: ["mat", "offset"] },
] as const;
export const FEAT_AT: Record<string, [number, number]> = { w: [185, 6], h1: [18, 66], h2: [170, 122], step: [150, 10], bore: [110, 70], notch: [70, 134], edge: [190, 120], mat: [60, 50], offset: [196, 30] };
