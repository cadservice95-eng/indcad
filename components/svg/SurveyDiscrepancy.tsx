const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;
const life = (ms: number) => ({ "--life": `${ms}ms` }) as React.CSSProperties;

const CONCEPT = "M30 40L250 30L270 190L50 200Z";
const SURVEY = "M38 52L258 38L284 198L60 214Z";

/** Concept boundary vs surveyed boundary: discrepancy is flagged, then goes to engineer review. */
export function SurveyDiscrepancy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 880 270" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Concept boundary compared with survey boundary, a discrepancy flagged and passed to engineer review">
      {/* concept */}
      <g transform="translate(20 20)" className="text-sky-200">
        <rect x="0.5" y="0.5" width="300" height="230" stroke="#83aed3" strokeOpacity="0.3" />
        <path d={CONCEPT} stroke="currentColor" strokeWidth="1.6" pathLength={1} className="draw" style={d(0, "1.2s")} />
        <path d="M60 110h160M60 140h170" stroke="currentColor" strokeOpacity="0.3" />
        <text x="12" y="222" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.4" className="fade-in" style={d(0)}>CONCEPT</text>
      </g>
      {/* survey */}
      <g transform="translate(340 20)" className="text-sky-200">
        <rect x="0.5" y="0.5" width="300" height="230" stroke="#83aed3" strokeOpacity="0.3" />
        <path d={SURVEY} stroke="#e2e8f0" strokeWidth="1.6" pathLength={1} className="draw" style={d(900, "1.2s")} />
        <g stroke="#e2e8f0" strokeWidth="1.5" className="fade-in" style={d(1500)}>
          {[[40, 54], [260, 40], [286, 200], [62, 216], [150, 128]].map(([x, y], i) => (
            <path key={i} d={`M${x - 4} ${y - 4}l8 8M${x + 4} ${y - 4}l-8 8`} />
          ))}
        </g>
        <text x="12" y="222" fill="#e2e8f0" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.4" className="fade-in" style={d(900)}>SURVEY</text>
      </g>
      {/* overlay */}
      <g transform="translate(660 20)" className="text-sky-200">
        <rect x="0.5" y="0.5" width="200" height="230" stroke="#83aed3" strokeOpacity="0.3" />
        <g transform="translate(14 24) scale(0.62)">
          <path d={CONCEPT} stroke="#7dd3fc" strokeWidth="1.6" strokeDasharray="6 4" />
          <path d={SURVEY} stroke="#e2e8f0" strokeWidth="1.6" />
          <g className="fade-pass" style={{ ...d(2300), ...life(2200) }}>
            <path d="M30 40L38 52M250 30L258 38M270 190L284 198M50 200L60 214" stroke="#f87171" strokeWidth="3" />
            <circle cx="150" cy="120" r="150" stroke="#f87171" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.5" />
          </g>
        </g>
        <text x="12" y="212" fill="#f87171" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2" className="fade-pass" style={{ ...d(2300), ...life(2300) }}>DISCREPANCY DETECTED</text>
        <g className="fade-in" style={d(4600)}>
          <rect x="12" y="196" width="168" height="24" className="fill-ink-950" stroke="#d68a51" />
          <text x="22" y="212" fill="#d68a51" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2">ENGINEER REVIEW</text>
        </g>
      </g>
      <g className="fade-in text-copper-400" style={d(1900)}>
        <path d="M330 135h-8M646 135h-8" stroke="currentColor" strokeWidth="1.3" />
      </g>
    </svg>
  );
}
