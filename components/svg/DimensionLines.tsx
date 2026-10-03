/**
 * A CAD-style dimension: extension lines, an arrowed dimension line and a
 * label, laid out along an arbitrary direction. Decorative; used inside
 * larger <svg> illustrations (inherits colour from currentColor).
 */
export function DimensionLine({
  x1,
  y1,
  x2,
  y2,
  offset = 16,
  label,
  delay = 0,
  className = "text-copper-400",
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  offset?: number;
  label?: string;
  delay?: number;
  className?: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const labelY = offset > 0 ? offset + 11 : offset - 5;
  const a = 6;
  return (
    <g
      transform={`translate(${x1} ${y1}) rotate(${angle.toFixed(2)})`}
      className={`fade-in ${className}`}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      <path
        d={`M0 0V${offset + Math.sign(offset) * 4}M${len} 0V${offset + Math.sign(offset) * 4}`}
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.55"
      />
      <path
        d={`M0 ${offset}H${len}`}
        stroke="currentColor"
        strokeWidth="1"
        className="draw"
        pathLength={1}
        style={{ "--d": `${delay}ms`, "--t": "1s" } as React.CSSProperties}
      />
      <path d={`M0 ${offset}l${a} -2.2v4.4zM${len} ${offset}l-${a} -2.2v4.4z`} fill="currentColor" />
      {label ? (
        <text
          x={len / 2}
          y={labelY}
          textAnchor="middle"
          fill="currentColor"
          fontFamily="var(--font-mono)"
          fontSize="11"
          letterSpacing="0.6"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}
