import { makeIso, seg, loop } from "./iso";

const css = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

/**
 * Parametric isometric building (wireframe or BIM-style). Everything is
 * generated from dimensions so the same geometry serves the hero, the
 * 2D → 3D → BIM story and the project art. Returns a <g>; place it inside
 * any <svg>. Stroke colour is controlled by the surrounding text-* class.
 */
export function IsometricBuilding({
  ox,
  oy,
  s,
  W = 24.8,
  D = 12,
  H = 8.4,
  floors = 3,
  bays = 6,
  detail = "wire",
  roofPlant = true,
  delay = 0,
}: {
  ox: number;
  oy: number;
  s: number;
  W?: number;
  D?: number;
  H?: number;
  floors?: number;
  bays?: number;
  detail?: "wire" | "bim";
  roofPlant?: boolean;
  delay?: number;
}) {
  const p = makeIso(ox, oy, s);
  const fh = H / floors;
  const bw = W / bays;
  const sideBays = Math.max(2, Math.round(bays / 2));

  const outline = [
    loop(p(0, 0, H), p(W, 0, H), p(W, D, H), p(0, D, H)),
    seg(p(0, D, 0), p(W, D, 0), p(W, 0, 0)),
    seg(p(0, D, 0), p(0, D, H)),
    seg(p(W, D, 0), p(W, D, H)),
    seg(p(W, 0, 0), p(W, 0, H)),
  ].join("");

  const hidden = [seg(p(0, 0, 0), p(0, 0, H)), seg(p(0, 0, 0), p(W, 0, 0)), seg(p(0, 0, 0), p(0, D, 0))].join("");

  const levels: string[] = [];
  for (let k = 1; k < floors; k++) levels.push(seg(p(0, D, k * fh), p(W, D, k * fh), p(W, 0, k * fh)));

  const mullions: string[] = [];
  for (let b = 1; b < bays; b++) mullions.push(seg(p(b * bw, D, 0), p(b * bw, D, H)));
  for (let b = 1; b < sideBays; b++) mullions.push(seg(p(W, (D / sideBays) * b, 0), p(W, (D / sideBays) * b, H)));

  const windows: string[] = [];
  if (detail === "bim") {
    for (let f = 0; f < floors; f++) {
      const z0 = f * fh + fh * 0.3;
      const z1 = f * fh + fh * 0.78;
      for (let b = 0; b < bays; b++) {
        const x0 = b * bw + bw * 0.18;
        const x1 = (b + 1) * bw - bw * 0.18;
        windows.push(loop(p(x0, D, z0), p(x1, D, z0), p(x1, D, z1), p(x0, D, z1)));
      }
      for (let b = 0; b < sideBays; b++) {
        const y0 = (D / sideBays) * b + (D / sideBays) * 0.2;
        const y1 = (D / sideBays) * (b + 1) - (D / sideBays) * 0.2;
        windows.push(loop(p(W, y0, z0), p(W, y1, z0), p(W, y1, z1), p(W, y0, z1)));
      }
    }
  }

  const bx0 = W * 0.58;
  const bx1 = W * 0.84;
  const by0 = D * 0.25;
  const by1 = D * 0.7;
  const bz = H + 1.5;
  const plant = [
    loop(p(bx0, by0, bz), p(bx1, by0, bz), p(bx1, by1, bz), p(bx0, by1, bz)),
    seg(p(bx0, by1, H), p(bx1, by1, H), p(bx1, by0, H)),
    seg(p(bx0, by1, H), p(bx0, by1, bz)),
    seg(p(bx1, by1, H), p(bx1, by1, bz)),
    seg(p(bx1, by0, H), p(bx1, by0, bz)),
  ].join("");

  const faceLeft = loop(p(0, D, 0), p(W, D, 0), p(W, D, H), p(0, D, H));
  const faceRight = loop(p(W, D, 0), p(W, 0, 0), p(W, 0, H), p(W, D, H));
  const top = loop(p(0, 0, H), p(W, 0, H), p(W, D, H), p(0, D, H));

  return (
    <g strokeLinejoin="round" strokeLinecap="round" fill="none">
      {detail === "bim" ? (
        <g className="fade-in" style={css(delay + 1500)}>
          <path d={faceLeft} className="fill-sky-400/10" stroke="none" />
          <path d={faceRight} className="fill-sky-400/20" stroke="none" />
          <path d={top} className="fill-sky-300/10" stroke="none" />
        </g>
      ) : null}
      <path d={hidden} stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 4" opacity="0.35" className="fade-in" style={css(delay + 900)} />
      <path d={outline} stroke="currentColor" strokeWidth="1.5" pathLength={1} className="draw" style={css(delay, "2s")} />
      <path d={levels.join("")} stroke="currentColor" strokeWidth="1" opacity="0.7" pathLength={1} className="draw" style={css(delay + 800, "1.4s")} />
      <path d={mullions.join("")} stroke="currentColor" strokeWidth="0.8" opacity="0.5" pathLength={1} className="draw" style={css(delay + 1100, "1.4s")} />
      {detail === "bim" ? (
        <path d={windows.join("")} stroke="currentColor" strokeWidth="0.9" className="fade-in" fill="rgba(11,18,32,0.35)" style={css(delay + 1700)} />
      ) : null}
      {roofPlant ? (
        <path d={plant} stroke="currentColor" strokeWidth="1.2" pathLength={1} className="draw" style={css(delay + 1500, "1.2s")} />
      ) : null}
    </g>
  );
}
