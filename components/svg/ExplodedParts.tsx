import { makeIso, seg, boxPath, cylinder, ellipse } from "./iso";
import { cn } from "@/lib/utils";

export const PART_ITEMS = ["Base plate", "Housing", "Shaft", "Bearing", "Cover", "Fasteners"] as const;

const S = 1.25;
const p = makeIso(190, 190, S);
const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;

const CORNERS = [[22, 12], [78, 12], [78, 58], [22, 58]] as const;

/**
 * Exploded isometric assembly: base plate, housing, shaft, bearing, cover and
 * fasteners, with numbered balloons. `active` highlights one item and dims the
 * rest. `animate` adds the draw-on entrance (needs an InView ancestor).
 */
export function ExplodedParts({
  active = null,
  animate = false,
  balloons = true,
  onSelect,
}: {
  active?: number | null;
  animate?: boolean;
  balloons?: boolean;
  onSelect?: (i: number | null) => void;
}) {
  const cls = (i: number) =>
    cn(
      "transition-[opacity,color] duration-300",
      active === null ? "text-sky-300" : active === i ? "text-copper-400" : "text-sky-300 opacity-25",
    );
  const dr = animate ? "draw" : "";
  const fi = animate ? "fade-in" : "";
  const hover = (i: number) =>
    onSelect ? { onMouseEnter: () => onSelect(i), onMouseLeave: () => onSelect(null) } : {};
  const w = (i: number) => (active === i ? 2.1 : 1.5);

  const bal = (i: number, at: readonly [number, number], dx: number, dy: number) => (
    <g
      key={i}
      className={cn("transition-opacity duration-300", onSelect && "cursor-pointer", active !== null && active !== i && "opacity-25")}
      {...hover(i)}
    >
      <path d={`M${at[0]} ${at[1]}L${at[0] + dx} ${at[1] + dy}`} stroke="#d68a51" strokeWidth="0.9" />
      <circle cx={at[0] + dx} cy={at[1] + dy} r="10.5" className="fill-ink-950" stroke="#d68a51" strokeWidth="1.2" />
      <text x={at[0] + dx} y={at[1] + dy + 3.6} textAnchor="middle" fill="#d68a51" fontFamily="var(--font-mono)" fontSize="10">
        {i + 1}
      </text>
    </g>
  );

  return (
    <g fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d={seg(p(50, 35, 0), p(50, 35, 132))} stroke="#7dd3fc" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.45" />

      <g className={cls(0)} {...hover(0)}>
        <path d={boxPath(p, 0, 0, 0, 100, 70, 10)} className={cn(dr, "fill-sky-400/10")} stroke="currentColor" strokeWidth={w(0)} pathLength={1} style={d(0, "1.1s")} />
        <path d={CORNERS.map(([x, y]) => ellipse(p, x, y, 10, 4.5, S)).join("")} stroke="currentColor" strokeWidth="1.1" className={fi} style={d(700)} />
      </g>
      <g className={cls(1)} {...hover(1)}>
        <path d={cylinder(p, 50, 35, 36, 58, 23, S)} className={cn(dr, "fill-sky-400/10")} stroke="currentColor" strokeWidth={w(1)} pathLength={1} style={d(400, "1.1s")} />
        <path d={ellipse(p, 50, 35, 58, 12, S)} stroke="currentColor" strokeWidth="1.1" className={fi} style={d(1000)} />
      </g>
      <g className={cls(3)} {...hover(3)}>
        <path d={cylinder(p, 50, 35, 70, 78, 15, S)} className={cn(dr, "fill-sky-400/10")} stroke="currentColor" strokeWidth={w(3)} pathLength={1} style={d(700, "1s")} />
        <path d={ellipse(p, 50, 35, 78, 8.5, S)} stroke="currentColor" strokeWidth="1.1" className={fi} style={d(1200)} />
      </g>
      <g className={cls(2)} {...hover(2)}>
        <path d={cylinder(p, 50, 35, 28, 112, 4.5, S)} className={dr} stroke="currentColor" strokeWidth={w(2)} pathLength={1} style={d(900, "1.2s")} />
      </g>
      <g className={cls(4)} {...hover(4)}>
        <path d={boxPath(p, 20, 5, 90, 80, 65, 98)} className={cn(dr, "fill-sky-400/10")} stroke="currentColor" strokeWidth={w(4)} pathLength={1} style={d(1100, "1.1s")} />
        <path d={ellipse(p, 50, 35, 98, 6, S)} stroke="currentColor" strokeWidth="1" className={fi} style={d(1700)} />
      </g>
      <g className={cls(5)} {...hover(5)}>
        {CORNERS.map(([x, y], i) => (
          <path
            key={i}
            d={cylinder(p, x, y, 108, 124, 3.2, S) + ellipse(p, x, y, 128, 5.8, S)}
            stroke="currentColor"
            strokeWidth={active === 5 ? 1.8 : 1.2}
            className={fi}
            style={d(1500 + i * 120)}
          />
        ))}
      </g>

      {balloons ? (
        <g className={fi} style={d(2200)}>
          {bal(0, p(100, 35, 5), 52, 18)}
          {bal(1, p(73, 35, 47), 66, -4)}
          {bal(2, p(54, 35, 110), 66, -20)}
          {bal(3, p(65, 35, 74), 78, 8)}
          {bal(4, p(80, 35, 94), 64, -14)}
          {bal(5, p(22, 58, 126), -54, -22)}
        </g>
      ) : null}
    </g>
  );
}
