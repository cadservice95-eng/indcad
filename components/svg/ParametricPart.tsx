import { makeIso, seg, loop, ellipse, lowerArc, cylinder } from "./iso";

export const FEATURES = [
  { id: "sketch", label: "Sketch 01" },
  { id: "extrude", label: "Extrude 01" },
  { id: "fillet", label: "Fillet 01" },
  { id: "hole", label: "Hole 01" },
  { id: "chamfer", label: "Chamfer 01" },
  { id: "pattern", label: "Pattern 01" },
] as const;

export type FeatureId = (typeof FEATURES)[number]["id"];

const C30 = 0.866;

/** Hole centres for a given hole count, relative to the plate centre. */
function holeCentres(L: number, count: 2 | 4 | 6) {
  const hx = L / 2 - 18;
  const hy = 26;
  if (count === 2) return [[-hx, 0], [hx, 0]];
  const base = [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]];
  return count === 6 ? [...base, [0, -hy], [0, hy]] : base;
}

/**
 * Static, parameter-driven isometric part (plate + boss + bore + holes) used
 * across the 3D CAD page. Geometry is recomputed from its parameters, so the
 * same component renders the feature tree demo, the parametric update, the
 * product-family variants and the workflow stages. `highlight` emphasises one
 * feature and dims the rest.
 */
export function ParametricPart({
  L = 125,
  W = 80,
  T = 12,
  bossR = 21,
  bossH = 30,
  holes = 4,
  s = 1.9,
  cx = 300,
  cy = 190,
  highlight = null,
  mesh = false,
}: {
  L?: number;
  W?: number;
  T?: number;
  bossR?: number;
  bossH?: number;
  holes?: 2 | 4 | 6;
  s?: number;
  cx?: number;
  cy?: number;
  highlight?: FeatureId | null;
  mesh?: boolean;
}) {
  const ox = cx - ((L - W) / 2) * C30 * s;
  const p = makeIso(ox, cy, s);
  const top = T + bossH;
  const ccx = L / 2;
  const ccy = W / 2;
  const bore = bossR * 0.48;

  const cls = (id: FeatureId) =>
    highlight === null ? "text-sky-300" : highlight === id ? "text-copper-400" : "text-sky-300 opacity-30";
  const sw = (id: FeatureId, base: number) => (highlight === id ? base + 0.9 : base);

  // Fillet arcs on the top-face corners (radius 8 in model units)
  const R = 8;
  const arc = (x: number, y: number, a0: number) =>
    seg(...Array.from({ length: 9 }, (_, i) => {
      const a = a0 + (i / 8) * (Math.PI / 2);
      return p(x + R * Math.cos(a), y + R * Math.sin(a), T);
    }));
  const fillets = [
    arc(R, R, Math.PI),
    arc(L - R, R, -Math.PI / 2),
    arc(L - R, W - R, 0),
    arc(R, W - R, Math.PI / 2),
  ].join("");

  const holePts = holeCentres(L, holes).map(([dx, dy]) => ellipse(p, ccx + dx, ccy + dy, T, 4.5, s)).join("");


  return (
    <g fill="none" strokeLinejoin="round" strokeLinecap="round">
      {/* extrude: plate body + boss */}
      <g className={cls("extrude")}>
        <path d={loop(p(0, W, 0), p(L, W, 0), p(L, W, T), p(0, W, T))} className="fill-sky-400/15" stroke="none" />
        <path d={loop(p(L, W, 0), p(L, 0, 0), p(L, 0, T), p(L, W, T))} className="fill-sky-400/25" stroke="none" />
        <path d={loop(p(0, 0, T), p(L, 0, T), p(L, W, T), p(0, W, T))} className="fill-sky-300/10" stroke="none" />
        <path
          d={[loop(p(0, 0, T), p(L, 0, T), p(L, W, T), p(0, W, T)), seg(p(0, W, 0), p(L, W, 0), p(L, 0, 0)), seg(p(0, W, 0), p(0, W, T)), seg(p(L, W, 0), p(L, W, T)), seg(p(L, 0, 0), p(L, 0, T))].join("")}
          stroke="currentColor"
          strokeWidth={sw("extrude", 1.5)}
        />
        <path d={cylinder(p, ccx, ccy, T, top, bossR, s)} className="fill-ink-950/60" stroke="currentColor" strokeWidth={sw("extrude", 1.5)} />
      </g>

      {/* sketch: top-face profile with origin marker */}
      <g className={cls("sketch")}>
        <path d={loop(p(0, 0, T), p(L, 0, T), p(L, W, T), p(0, W, T))} stroke="currentColor" strokeWidth={sw("sketch", 1)} strokeDasharray="4 3" opacity={highlight === "sketch" ? 1 : 0.5} />
        <path d={seg(p(ccx - 6, ccy, T), p(ccx + 6, ccy, T)) + seg(p(ccx, ccy - 6, T), p(ccx, ccy + 6, T))} stroke="currentColor" strokeWidth="1" opacity={highlight === "sketch" ? 1 : 0.4} />
      </g>

      {/* fillets */}
      <g className={cls("fillet")}>
        <path d={fillets} stroke="currentColor" strokeWidth={sw("fillet", 1.2)} />
      </g>

      {/* hole (bore) */}
      <g className={cls("hole")}>
        <path d={ellipse(p, ccx, ccy, top, bore, s)} stroke="currentColor" strokeWidth={sw("hole", 1.3)} />
        <path d={lowerArc(p, ccx, ccy, top - 10, bore, s)} stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
      </g>

      {/* chamfer ring on boss */}
      <g className={cls("chamfer")}>
        <path d={ellipse(p, ccx, ccy, top, bossR * 0.84, s)} stroke="currentColor" strokeWidth={sw("chamfer", 1)} />
      </g>

      {/* hole pattern */}
      <g className={cls("pattern")}>
        <path d={holePts} stroke="currentColor" strokeWidth={sw("pattern", 1.3)} />
      </g>

      {mesh ? (
        <path
          d={Array.from({ length: Math.floor(L / 12.5) }, (_, i) => seg(p((i + 1) * 12.5, 0, T), p((i + 1) * 12.5, W, T))).join("")}
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 3"
          opacity="0.35"
          className="text-sky-300"
        />
      ) : null}
    </g>
  );
}

/** Screen position of key points, for placing dimension lines next to the part. */
export function partAnchors(L: number, W: number, T: number, bossH: number, s: number, cx = 300, cy = 190) {
  const ox = cx - ((L - W) / 2) * C30 * s;
  const p = makeIso(ox, cy, s);
  return {
    frontA: p(0, W, 0),
    frontB: p(L, W, 0),
    sideA: p(L, W, 0),
    sideB: p(L, 0, 0),
    topCentre: p(L / 2, W / 2, T + bossH),
  };
}
