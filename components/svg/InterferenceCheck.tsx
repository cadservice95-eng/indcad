import { makeIso, boxPath, loop } from "./iso";

const S = 3.4;
const C30 = 0.866;
const p = makeIso(290, 150, S);
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const life = (ms: number) => ({ "--life": `${ms}ms` }) as React.CSSProperties;

const mv = (dx: number) => ({ x: Math.round(dx * C30 * S), y: Math.round(dx * 0.5 * S) });

/** Two components approach, interfere, then are adjusted to a verified clearance. Visual explanation only. */
export function InterferenceCheck({ className }: { className?: string }) {
  const c = mv(-14);
  const r = mv(-6);
  const style = { "--cx": `${c.x}px`, "--cy": `${c.y}px`, "--rx": `${r.x}px`, "--ry": `${r.y}px` } as React.CSSProperties;
  const cap = (text: string, color: string, at: number, lifeMs?: number) => (
    <text
      x="26"
      y="292"
      fill={color}
      fontFamily="var(--font-mono)"
      fontSize="12"
      letterSpacing="1.8"
      className={lifeMs ? "fade-pass" : "fade-in"}
      style={{ ...d(at), ...(lifeMs ? life(lifeMs) : {}) }}
    >
      {text}
    </text>
  );
  return (
    <svg
      viewBox="0 0 640 310"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Two assembly components approach each other, interfere, then are adjusted until clearance is verified"
    >
      <rect x="0.5" y="0.5" width="639" height="309" stroke="#83aed3" strokeOpacity="0.25" />
      <g className="text-sky-300" strokeLinejoin="round">
        {/* fixed component */}
        <path d={boxPath(p, 0, 0, 0, 24, 24, 22)} className="fill-sky-400/10" stroke="currentColor" strokeWidth="1.5" />
        {/* moving component */}
        <g className="collide" style={style}>
          <path d={boxPath(p, 34, 2, 0, 58, 22, 22)} className="fill-sky-400/20" stroke="currentColor" strokeWidth="1.5" />
        </g>
        {/* interference zone */}
        <path
          d={loop(p(20, 2, 0), p(24, 2, 0), p(24, 22, 0), p(20, 22, 0)) + loop(p(20, 2, 22), p(24, 2, 22), p(24, 22, 22), p(20, 22, 22))}
          className="fade-pass"
          fill="rgba(248,113,113,0.35)"
          stroke="#f87171"
          strokeWidth="1.2"
          style={{ ...d(3100), ...life(2000) }}
        />
      </g>
      {cap("CLEARANCE OK", "#34d399", 100, 3100)}
      {cap("INTERFERENCE DETECTED", "#f87171", 3200, 2300)}
      {cap("CLEARANCE VERIFIED", "#34d399", 5600)}
      <g className="fade-in" style={d(5600)}>
        <circle cx="590" cy="42" r="14" fill="#34d399" fillOpacity="0.16" stroke="#34d399" strokeWidth="1.3" />
        <path d="M583 42l5 5 10-12" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
