/** Tiny isometric projection helpers shared by the CAD/BIM illustrations. */
export type P = readonly [number, number];

const C30 = Math.cos(Math.PI / 6);
const r = (n: number) => Math.round(n * 10) / 10;

export function makeIso(ox: number, oy: number, s: number) {
  return (x: number, y: number, z: number): P => [
    r(ox + (x - y) * C30 * s),
    r(oy + (x + y) * 0.5 * s - z * s),
  ];
}

const pt = (p: P) => `${p[0]} ${p[1]}`;
export const seg = (...pts: P[]) => `M${pts.map(pt).join("L")}`;
export const loop = (...pts: P[]) => `${seg(...pts)}Z`;

/** Isometric circle (in a horizontal plane) → ellipse semi-axes. */
export const isoRx = (r: number, s: number) => 1.2247 * r * s;
export const isoRy = (r: number, s: number) => 0.7071 * r * s;

type IsoFn = (x: number, y: number, z: number) => P;

export function ellipse(p: IsoFn, cx: number, cy: number, z: number, r: number, s: number) {
  const c = p(cx, cy, z);
  const rx = isoRx(r, s);
  const ry = isoRy(r, s);
  return `M${(c[0] - rx).toFixed(1)} ${c[1]}a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(2 * rx).toFixed(1)} 0a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(-2 * rx).toFixed(1)} 0`;
}

export function lowerArc(p: IsoFn, cx: number, cy: number, z: number, r: number, s: number) {
  const c = p(cx, cy, z);
  const rx = isoRx(r, s);
  const ry = isoRy(r, s);
  return `M${(c[0] - rx).toFixed(1)} ${c[1]}a${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 0 ${(2 * rx).toFixed(1)} 0`;
}

/** Vertical cylinder: silhouette sides, lower base arc and top ellipse. */
export function cylinder(p: IsoFn, cx: number, cy: number, z0: number, z1: number, r: number, s: number) {
  const a = p(cx, cy, z0);
  const b = p(cx, cy, z1);
  const rx = isoRx(r, s);
  return (
    `M${(a[0] - rx).toFixed(1)} ${a[1]}L${(b[0] - rx).toFixed(1)} ${b[1]}` +
    `M${(a[0] + rx).toFixed(1)} ${a[1]}L${(b[0] + rx).toFixed(1)} ${b[1]}` +
    lowerArc(p, cx, cy, z0, r, s) +
    ellipse(p, cx, cy, z1, r, s)
  );
}

/** Visible outline of an axis-aligned box (top face, near vertical edges, near base edges). */
export function boxPath(p: IsoFn, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  return [
    loop(p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1)),
    seg(p(x0, y1, z0), p(x1, y1, z0), p(x1, y0, z0)),
    seg(p(x0, y1, z0), p(x0, y1, z1)),
    seg(p(x1, y1, z0), p(x1, y1, z1)),
    seg(p(x1, y0, z0), p(x1, y0, z1)),
  ].join("");
}

/** The three visible faces of a box as closed polygons: [left(front), right, top]. */
export function boxFaces(p: IsoFn, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  return [
    loop(p(x0, y1, z0), p(x1, y1, z0), p(x1, y1, z1), p(x0, y1, z1)),
    loop(p(x1, y1, z0), p(x1, y0, z0), p(x1, y0, z1), p(x1, y1, z1)),
    loop(p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1)),
  ] as const;
}
