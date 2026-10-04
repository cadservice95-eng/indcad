import { makeIso, loop, type P } from "@/components/svg/iso";

/* shared palette for the SolidWorks page visuals */
export const S = { bg: "#0B1220", panel: "#101A2E", line: "#83AED3", sky: "#7DD3FC", cu: "#D68A51", w: "#E5E7EB", mute: "#64748B", grn: "#34D399", red: "#F87171", grid: "#1A2740" };
export const ln = (c: string, w = 1.3) => ({ fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }) as const;
export const mono = { fontFamily: "var(--font-mono)" } as const;
export const dl = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function T({ x, y, c = S.w, s = 9, a = "start", children }: { x: number; y: number; c?: string; s?: number; a?: "start" | "middle" | "end"; children: React.ReactNode }) {
  return <text x={x} y={y} fill={c} fontSize={s} textAnchor={a} style={mono} letterSpacing="0.6">{children}</text>;
}

type Iso = (x: number, y: number, z: number) => P;
/** Visible faces of an axis-aligned box (top, +x face, +y face) as filled shaded polygons. */
export function IsoBox({ p, b, stroke = S.line, tone = 0, sw = 1.1 }: { p: Iso; b: [number, number, number, number, number, number]; stroke?: string; tone?: number; sw?: number }) {
  const [x0, y0, z0, x1, y1, z1] = b;
  const f = ["#1E3350", "#16263E", "#122036"].map((c, k) => (tone ? ["#3A2A1E", "#2E2118", "#241A13"][k] : c));
  return (
    <g stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
      <path d={loop(p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1))} fill={f[0]} />
      <path d={loop(p(x1, y0, z0), p(x1, y1, z0), p(x1, y1, z1), p(x1, y0, z1))} fill={f[1]} />
      <path d={loop(p(x0, y1, z0), p(x1, y1, z0), p(x1, y1, z1), p(x0, y1, z1))} fill={f[2]} />
    </g>
  );
}

/** Simple L-bracket: base plate + upright, with two holes on the base. */
export function Bracket({ ox, oy, s, len = 110, stroke }: { ox: number; oy: number; s: number; len?: number; stroke?: string }) {
  const p = makeIso(ox, oy, s);
  const hole = (x: number, y: number) => { const c = p(x, y, 10); return <ellipse key={`${x}-${y}`} cx={c[0]} cy={c[1]} rx={6.1 * s} ry={3.5 * s} fill={S.bg} stroke={stroke ?? S.line} strokeWidth="1" />; };
  return (
    <g>
      <IsoBox p={p} b={[0, 0, 0, len, 60, 10]} stroke={stroke} />
      {hole(len - 22, 18)}{hole(len - 22, 42)}
      <IsoBox p={p} b={[0, 0, 10, 12, 60, 64]} stroke={stroke} />
    </g>
  );
}

/** Dark technical frame with a faint grid. */
export function Frame({ w, h, label, className, children }: { w: number; h: number; label: string; className?: string; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className ?? "mx-auto block h-auto w-full max-w-[880px]"} role="img" aria-label={label}>
      <title>{label}</title>
      <rect width={w} height={h} fill={S.bg} />
      <g stroke={S.grid} strokeWidth="0.5">{Array.from({ length: Math.ceil(w / 24) + 1 }, (_, i) => <path key={i} d={`M${i * 24} 0V${h}`} />)}{Array.from({ length: Math.ceil(h / 24) + 1 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 24}H${w}`} />)}</g>
      {children}
    </svg>
  );
}
