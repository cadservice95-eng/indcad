import { makeIso, seg, loop, ellipse, cylinder, lowerArc } from "./iso";

export const PART = { L: 125, W: 80, T: 12, boss: 21, bossH: 30, bore: 10, hole: 4.5, hx: 45, hy: 26 };

const css = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

export type PartDelays = { base: number; rise: number; boss: number; holes: number; mesh: number };

export const HERO_DELAYS: PartDelays = { base: 200, rise: 900, boss: 1500, holes: 2000, mesh: 2400 };

/**
 * Isometric flanged bracket (plate + boss + bore + 4 holes), the "hero part"
 * reused across the mechanical page. Each feature draws on in sequence;
 * timings are passed in so the same geometry can tell a slower story.
 */
export function IsoPart({
  ox,
  oy,
  s,
  delays = HERO_DELAYS,
  solid = false,
  mesh = true,
}: {
  ox: number;
  oy: number;
  s: number;
  delays?: PartDelays;
  solid?: boolean;
  mesh?: boolean;
}) {
  const { L, W, T, boss, bossH, bore, hole, hx, hy } = PART;
  const p = makeIso(ox, oy, s);
  const cx = L / 2;
  const cy = W / 2;
  const top = T + bossH;

  const footprint = loop(p(0, 0, 0), p(L, 0, 0), p(L, W, 0), p(0, W, 0));
  const risers = [seg(p(0, W, 0), p(0, W, T)), seg(p(L, W, 0), p(L, W, T)), seg(p(L, 0, 0), p(L, 0, T))].join("");
  const plateTop = loop(p(0, 0, T), p(L, 0, T), p(L, W, T), p(0, W, T));
  const holes = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    .map(([a, b]) => ellipse(p, cx + a * hx, cy + b * hy, T, hole, s))
    .join("");

  const grid: string[] = [];
  for (let x = 12.5; x < L; x += 12.5) grid.push(seg(p(x, 0, T), p(x, W, T)));
  for (let y = 10; y < W; y += 10) grid.push(seg(p(0, y, T), p(L, y, T)));
  const rings = [0.33, 0.66].map((f) => lowerArc(p, cx, cy, T + bossH * f, boss, s)).join("");

  return (
    <g fill="none" strokeLinejoin="round" strokeLinecap="round">
      {solid ? (
        <g className="fade-in" style={css(delays.rise + 800)}>
          <path d={loop(p(0, W, 0), p(L, W, 0), p(L, W, T), p(0, W, T))} className="fill-sky-400/15" stroke="none" />
          <path d={loop(p(L, W, 0), p(L, 0, 0), p(L, 0, T), p(L, W, T))} className="fill-sky-400/25" stroke="none" />
          <path d={plateTop} className="fill-sky-300/10" stroke="none" />
        </g>
      ) : null}
      <path d={footprint} stroke="currentColor" strokeWidth="1.3" pathLength={1} className="draw" style={css(delays.base, "1.2s")} />
      <path d={risers} stroke="currentColor" strokeWidth="1.3" pathLength={1} className="draw" style={css(delays.rise, "0.8s")} />
      <path d={plateTop} stroke="currentColor" strokeWidth="1.5" pathLength={1} className="draw" style={css(delays.rise + 500, "1.2s")} />
      <path d={cylinder(p, cx, cy, T, top, boss, s)} stroke="currentColor" strokeWidth="1.5" pathLength={1} className="draw" style={css(delays.boss, "1.4s")} />
      <path d={ellipse(p, cx, cy, top, bore, s)} stroke="currentColor" strokeWidth="1.2" pathLength={1} className="draw" style={css(delays.boss + 600, "1s")} />
      <path d={lowerArc(p, cx, cy, top - 9, bore, s)} stroke="currentColor" strokeWidth="0.9" opacity="0.6" className="fade-in" style={css(delays.boss + 1200)} />
      <path d={holes} stroke="currentColor" strokeWidth="1.2" pathLength={1} className="draw" style={css(delays.holes, "1.2s")} />
      {mesh ? (
        <g className="fade-in" style={css(delays.mesh)}>
          <path d={grid.join("")} stroke="currentColor" strokeWidth="0.5" opacity="0.35" strokeDasharray="2 3" />
          <path d={rings} stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        </g>
      ) : null}
    </g>
  );
}
