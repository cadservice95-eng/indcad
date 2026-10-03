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
