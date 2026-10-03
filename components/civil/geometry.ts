/**
 * Code-generated civil geometry shared by every visual on the civil drafting
 * page: a synthetic terrain (real marching-squares contours), a road
 * alignment, subdivision lots, a drainage network and survey points.
 * Everything is deterministic and decorative — not project data.
 */

export const W = 640;
export const H = 420;

type Hill = { x: number; y: number; s: number; a: number };
const HILLS: Hill[] = [
  { x: 140, y: 100, s: 110, a: 15 },
  { x: 500, y: 320, s: 140, a: 16 },
  { x: 330, y: 215, s: 80, a: -7 },
  { x: 570, y: 80, s: 95, a: 9 },
];

/** Existing ground level (metres, decorative). */
export function existing(x: number, y: number) {
  let h = 100 + (W - x) * 0.012;
  for (const k of HILLS) h += k.a * Math.exp(-((x - k.x) ** 2 + (y - k.y) ** 2) / (2 * k.s * k.s));
  return h;
}

/** Proposed (graded) ground: the existing surface flattened toward a gently falling plane. */
export function proposed(x: number, y: number) {
  const plane = 104 + (W - x) * 0.01 - y * 0.004;
  return 0.3 * existing(x, y) + 0.7 * plane;
}

type Fn = (x: number, y: number) => number;
type Pt = [number, number];

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Marching squares → chained polylines (one SVG path string per contour level). */
export function contourPaths(fn: Fn, levels: number[], step = 10): Record<number, string> {
  const cols = Math.ceil(W / step);
  const rows = Math.ceil(H / step);
  const grid: number[][] = [];
  for (let j = 0; j <= rows; j++) {
    const row: number[] = [];
    for (let i = 0; i <= cols; i++) row.push(fn(i * step, j * step));
    grid.push(row);
  }
  const out: Record<number, string> = {};
  for (const lv of levels) {
    const segs: [Pt, Pt][] = [];
    const interp = (x0: number, y0: number, v0: number, x1: number, y1: number, v1: number): Pt => {
      const t = (lv - v0) / (v1 - v0);
      return [r1(x0 + (x1 - x0) * t), r1(y0 + (y1 - y0) * t)];
    };
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = i * step;
        const y = j * step;
        const a = grid[j][i];
        const b = grid[j][i + 1];
        const c = grid[j + 1][i + 1];
        const d = grid[j + 1][i];
        const idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const top = () => interp(x, y, a, x + step, y, b);
        const right = () => interp(x + step, y, b, x + step, y + step, c);
        const bottom = () => interp(x, y + step, d, x + step, y + step, c);
        const left = () => interp(x, y, a, x, y + step, d);
        const add = (p: Pt, q: Pt) => segs.push([p, q]);
        switch (idx) {
          case 1: case 14: add(left(), bottom()); break;
          case 2: case 13: add(bottom(), right()); break;
          case 3: case 12: add(left(), right()); break;
          case 4: case 11: add(top(), right()); break;
          case 5: add(left(), top()); add(bottom(), right()); break;
          case 6: case 9: add(top(), bottom()); break;
          case 7: case 8: add(left(), top()); break;
          case 10: add(top(), right()); add(left(), bottom()); break;
        }
      }
    }
    out[lv] = chain(segs);
  }
  return out;
}

function chain(segs: [Pt, Pt][]): string {
  const key = (p: Pt) => `${p[0]},${p[1]}`;
  const ends = new Map<string, number[]>();
  segs.forEach((s, i) => {
    for (const p of s) {
      const k = key(p);
      const arr = ends.get(k);
      if (arr) arr.push(i);
      else ends.set(k, [i]);
    }
  });
  const used = new Array(segs.length).fill(false);
  const parts: string[] = [];
  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    const pts: Pt[] = [segs[i][0], segs[i][1]];
    for (const dir of [1, 0]) {
      let guard = 0;
      for (;;) {
        const tip = dir ? pts[pts.length - 1] : pts[0];
        const next = (ends.get(key(tip)) ?? []).find((n) => !used[n]);
        if (next === undefined || guard++ > 4000) break;
        used[next] = true;
        const [p, q] = segs[next];
        const other = key(p) === key(tip) ? q : p;
        if (dir) pts.push(other);
        else pts.unshift(other);
      }
    }
    parts.push(`M${pts.map((p) => `${p[0]} ${p[1]}`).join("L")}`);
  }
  return parts.join("");
}

export const LEVELS = (() => {
  const l: number[] = [];
  for (let v = 105; v <= 121; v += 1.5) l.push(v);
  return l;
})();

const cache: { ex?: Record<number, string>; pr?: Record<number, string> } = {};
export function existingContours() {
  return (cache.ex ??= contourPaths(existing, LEVELS, 10));
}
export function proposedContours() {
  return (cache.pr ??= contourPaths(proposed, LEVELS, 10));
}

// ───────── road, lots, drainage ─────────

const P0: Pt = [30, 232];
const P1: Pt = [220, 140];
const P2: Pt = [420, 310];
const P3: Pt = [625, 215];

export function road(t: number): Pt {
  const u = 1 - t;
  return [
    u * u * u * P0[0] + 3 * u * u * t * P1[0] + 3 * u * t * t * P2[0] + t * t * t * P3[0],
    u * u * u * P0[1] + 3 * u * u * t * P1[1] + 3 * u * t * t * P2[1] + t * t * t * P3[1],
  ];
}

function normal(t: number): Pt {
  const a = road(Math.max(0, t - 0.01));
  const b = road(Math.min(1, t + 0.01));
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [-dy / len, dx / len];
}

export const offsetPt = (t: number, d: number): Pt => {
  const p = road(t);
  const n = normal(t);
  return [r1(p[0] + n[0] * d), r1(p[1] + n[1] * d)];
};

export function offsetLine(t0: number, t1: number, d: number, n = 40) {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) pts.push(offsetPt(t0 + ((t1 - t0) * i) / n, d));
  return `M${pts.map((p) => `${p[0]} ${p[1]}`).join("L")}`;
}

export const roadCentre = offsetLine(0, 1, 0, 60);
export const roadEdgeA = offsetLine(0, 1, 13, 60);
export const roadEdgeB = offsetLine(0, 1, -13, 60);

export const LOT_COUNT = 7;
export function lots(side: 1 | -1) {
  const out: { d: string; label: Pt }[] = [];
  const t0 = 0.1;
  const t1 = 0.9;
  for (let i = 0; i < LOT_COUNT; i++) {
    const a = t0 + ((t1 - t0) * i) / LOT_COUNT;
    const b = t0 + ((t1 - t0) * (i + 1)) / LOT_COUNT;
    const q = [offsetPt(a, side * 24), offsetPt(b, side * 24), offsetPt(b, side * 84), offsetPt(a, side * 84)];
    const c: Pt = [r1((q[0][0] + q[2][0]) / 2), r1((q[0][1] + q[2][1]) / 2)];
    out.push({ d: `M${q.map((p) => `${p[0]} ${p[1]}`).join("L")}Z`, label: c });
  }
  return out;
}

export const lotsA = lots(1);
export const lotsB = lots(-1);

// cul-de-sac branch
const bs = road(0.5);
export const branch = `M${r1(bs[0])} ${r1(bs[1])}L${r1(bs[0] - 24)} ${r1(bs[1] + 96)}`;
export const bulb: Pt = [r1(bs[0] - 28), r1(bs[1] + 112)];

// site boundary
export const boundary = "M62 62L560 40L596 330L424 384L96 362Z";

// drainage: pits along an offset line, falling toward the outfall on the right
export const pits: Pt[] = [0.14, 0.3, 0.46, 0.62, 0.78].map((t) => offsetPt(t, 18));
export const outfall: Pt = [r1(offsetPt(0.95, 18)[0]), r1(offsetPt(0.95, 18)[1])];
export const pipe = `M${[...pits, outfall].map((p) => `${p[0]} ${p[1]}`).join("L")}`;
export const catchments = [
  `M${offsetPt(0.08, 24)[0]} ${offsetPt(0.08, 24)[1]}L${offsetPt(0.4, 24)[0]} ${offsetPt(0.4, 24)[1]}L${offsetPt(0.4, 84)[0]} ${offsetPt(0.4, 84)[1]}L${offsetPt(0.08, 84)[0]} ${offsetPt(0.08, 84)[1]}Z`,
  `M${offsetPt(0.5, 24)[0]} ${offsetPt(0.5, 24)[1]}L${offsetPt(0.9, 24)[0]} ${offsetPt(0.9, 24)[1]}L${offsetPt(0.9, 84)[0]} ${offsetPt(0.9, 84)[1]}L${offsetPt(0.5, 84)[0]} ${offsetPt(0.5, 84)[1]}Z`,
];

export const servicesLine = offsetLine(0.06, 0.94, -19, 50);
export const easement = (() => {
  const a = offsetLine(0.1, 0.9, 84, 40);
  const b = offsetLine(0.1, 0.9, 98, 40);
  const bpts = b.slice(1).split("L").reverse().join("L");
  return `${a}L${bpts}Z`;
})();

// survey points (deterministic jitter)
function prng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}
export const surveyPoints: Pt[] = (() => {
  const rnd = prng(42);
  const pts: Pt[] = [];
  for (let j = 0; j < 9; j++) {
    for (let i = 0; i < 14; i++) {
      pts.push([r1(40 + i * 44 + (rnd() - 0.5) * 22), r1(30 + j * 42 + (rnd() - 0.5) * 20)]);
    }
  }
  return pts;
})();
export const surveyPath = surveyPoints.map(([x, y]) => `M${x - 2.2} ${y - 2.2}l4.4 4.4M${r1(x + 2.2)} ${r1(y - 2.2)}l-4.4 4.4`).join("");

// grading arrows (downslope on proposed surface)
export const gradingArrows: { x: number; y: number; ang: number }[] = (() => {
  const pts: [number, number][] = [[130, 120], [250, 80], [400, 90], [520, 140], [180, 300], [330, 340], [500, 280], [90, 210]];
  return pts.map(([x, y]) => {
    const gx = proposed(x + 2, y) - proposed(x - 2, y);
    const gy = proposed(x, y + 2) - proposed(x, y - 2);
    return { x, y, ang: (Math.atan2(-gy, -gx) * 180) / Math.PI };
  });
})();

export const spotLevels: { x: number; y: number }[] = [
  { x: 120, y: 90 },
  { x: 330, y: 215 },
  { x: 520, y: 330 },
];

/** Surface mesh (TIN) with vertical exaggeration so it reads as a 3D surface. */
export function tinPath(cols: number, rows: number, w: number, h: number, ex = 1.6, yoff = 0) {
  const rnd = prng(7);
  const pts: Pt[][] = [];
  for (let j = 0; j <= rows; j++) {
    const row: Pt[] = [];
    for (let i = 0; i <= cols; i++) {
      const bx = (i / cols) * w + (rnd() - 0.5) * (w / cols) * 0.4;
      const by = (j / rows) * h + (rnd() - 0.5) * (h / rows) * 0.4;
      const hh = existing((i / cols) * W, (j / rows) * H);
      row.push([r1(bx), r1(by - (hh - 100) * ex + yoff)]);
    }
    pts.push(row);
  }
  let d = "";
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      const p = pts[j][i];
      if (i < cols) d += `M${p[0]} ${p[1]}L${pts[j][i + 1][0]} ${pts[j][i + 1][1]}`;
      if (j < rows) d += `M${p[0]} ${p[1]}L${pts[j + 1][i][0]} ${pts[j + 1][i][1]}`;
      if (i < cols && j < rows) d += `M${p[0]} ${p[1]}L${pts[j + 1][i + 1][0]} ${pts[j + 1][i + 1][1]}`;
    }
  }
  return d;
}

/** Sample points for the survey → TIN → contour triptych. */
export function pointCloud(cols: number, rows: number, w: number, h: number) {
  const rnd = prng(7);
  const pts: Pt[] = [];
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      pts.push([r1((i / cols) * w + (rnd() - 0.5) * (w / cols) * 0.4), r1((j / rows) * h + (rnd() - 0.5) * (h / rows) * 0.4)]);
    }
  }
  return pts;
}

export const fmtRL = (x: number, y: number) => existing(x, y).toFixed(2);
