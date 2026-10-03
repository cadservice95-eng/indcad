const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const mono = { fontFamily: "var(--font-mono)" } as const;
const S = "#7dd3fc";

type Kind = "col" | "beam" | "brace";

/**
 * Exploded elevation of one member with its components. Needs an InView
 * ancestor (or data-in) for the fly-in. Illustrative detail only.
 */
export function MemberExploded({ kind = "beam", className }: { kind?: Kind; className?: string }) {
  const parts =
    kind === "beam"
      ? ["BEAM", "END PLATE", "BOLTS", "STIFFENER", "WELD"]
      : kind === "col"
        ? ["COLUMN", "BASE PLATE", "BOLTS", "STIFFENER", "WELD"]
        : ["BRACE", "GUSSET PLATE", "BOLTS", "—", "WELD"];
  return (
    <svg viewBox="0 0 520 220" fill="none" className={className} role="img" aria-label={`Exploded view of a ${kind === "col" ? "column" : kind === "beam" ? "beam" : "brace"} showing its plate, bolts, stiffener and weld`} strokeLinecap="round" strokeLinejoin="round">
      <g stroke={S} strokeWidth="1.6">
        {/* member */}
        <g className="fly" style={{ "--fx": "60px", "--fy": "0px", ...d(0) } as React.CSSProperties}>
          {kind === "col" ? (
            <path d="M210 30h60v160h-60zM224 30v160M256 30v160" />
          ) : kind === "beam" ? (
            <>
              <rect x="190" y="84" width="270" height="52" />
              <path d="M190 96h270M190 124h270" strokeWidth="0.9" opacity="0.6" />
            </>
          ) : (
            <path d="M190 150L430 70M190 164L430 84M190 150v14M430 70v14" />
          )}
        </g>
        {/* plate */}
        <g className="fly" style={{ "--fx": "30px", "--fy": "0px", ...d(150) } as React.CSSProperties}>
          {kind === "col" ? <rect x="190" y="190" width="100" height="10" className="fill-sky-400/20" /> : <rect x="170" y="68" width="10" height="84" className="fill-sky-400/20" />}
        </g>
        {/* stiffener */}
        {kind !== "brace" ? (
          <g className="fly" style={{ "--fx": "20px", "--fy": "-24px", ...d(300) } as React.CSSProperties}>
            {kind === "col" ? <path d="M200 178l-12 12h12zM280 178l12 12h-12z" strokeWidth="1.3" /> : <path d="M280 86v48M284 86v48" strokeWidth="1.3" />}
          </g>
        ) : null}
        {/* bolts */}
        <g className="fly" style={{ "--fx": "-10px", "--fy": "0px", ...d(450) } as React.CSSProperties}>
          {(kind === "col" ? [[210, 196], [270, 196]] : [[168, 80], [168, 100], [168, 120], [168, 140]]).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3.6" className="fill-ink-950" />
          ))}
        </g>
      </g>
      {/* weld */}
      <g className="fly text-copper-400" style={{ "--fx": "0px", "--fy": "-16px", ...d(600) } as React.CSSProperties} stroke="#d68a51" strokeWidth="1.3">
        <path d="M182 64l-10 -8h20zM182 156l-10 8h20z" fill="#d68a51" fillOpacity="0.3" />
      </g>
      {/* labels */}
      <g fill={S} fontSize="9" letterSpacing="1" style={mono} className="fade-in">
        {parts.map((t, i) => (
          <g key={t + i}>
            <text x="16" y={34 + i * 18} fill={i === 4 ? "#d68a51" : S}>{t}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
