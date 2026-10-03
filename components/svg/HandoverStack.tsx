const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const revs = [
  { label: "REV A", x: 24, y: 70, note: "ISSUED FOR REVIEW" },
  { label: "REV B", x: 64, y: 40, note: "MARKUP INCORPORATED" },
  { label: "REV C", x: 104, y: 10, note: "ISSUED FOR MANUFACTURE" },
];

/** Stack of revision-labelled drawing sheets with a revision timeline. Illustrative only. */
export function HandoverStack({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Stack of drawing sheets labelled revision A, B and C above a revision timeline"
    >
      {revs.map((r, i) => (
        <g key={r.label} className="fade-in text-sky-200" style={d(i * 600)} transform={`translate(${r.x} ${r.y})`}>
          <rect width="250" height="190" className="fill-ink-900" stroke="currentColor" strokeOpacity="0.55" />
          <path d="M14 14h96v70H14z" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          <path d="M26 66V38h30v28zM70 66V46h28v20z" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <path d="M126 22h110M126 34h90M126 46h100M126 58h60" stroke="currentColor" strokeOpacity="0.35" />
          <path d="M0 150h250M170 150v40" stroke="currentColor" strokeOpacity="0.5" />
          <g fill="currentColor" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1">
            <text x="12" y="168">MATERIAL · FINISH</text>
            <text x="12" y="182" opacity="0.7">{r.note}</text>
            <text x="186" y="174" fill="#38bdf8" fontSize="12">{r.label}</text>
          </g>
        </g>
      ))}

      {/* timeline */}
      <g className="fade-in text-sky-300" style={d(2000)}>
        <path d="M30 300h400" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
        {revs.map((r, i) => (
          <g key={r.label} transform={`translate(${70 + i * 150} 300)`}>
            <circle r="6" className="fill-ink-950" stroke="currentColor" strokeWidth="1.4" />
            <circle r="2.4" fill="#38bdf8" className="rch-pulse" style={d(i * 400)} />
            <text y="26" textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2">{r.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
