const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const packageItems = ["DRAWING", "BOM", "REVISION", "MATERIAL", "FINISH", "ASSEMBLY INFO"];

function Building({ x, label, delay }: { x: number; label: string; delay: number }) {
  return (
    <g className="fade-in text-sky-300" style={d(delay)} transform={`translate(${x} 70)`}>
      <rect width="170" height="150" className="fill-ink-950" stroke="currentColor" strokeOpacity="0.7" />
      <path d="M0 40h170" stroke="currentColor" strokeOpacity="0.4" />
      <path d="M16 62h40v30H16zM66 62h40v30H66zM116 62h40v30h-40z" stroke="currentColor" strokeWidth="1.1" opacity="0.6" />
      <path d="M16 118h140" stroke="currentColor" strokeOpacity="0.35" />
      <text x="85" y="26" textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="0.8">{label}</text>
    </g>
  );
}

/** Company A → documentation package → contract manufacturer. Illustrative. */
export function ContractHandover({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 880 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Company A hands a documentation package of drawing, BOM, revision, material, finish and assembly information to a contract manufacturer"
    >
      <Building x={20} label="COMPANY A" delay={0} />
      <Building x={690} label="CONTRACT MANUFACTURER" delay={1600} />

      <g className="text-copper-400">
        <g className="fade-in" style={d(700)}>
          <path d="M196 146H284" stroke="currentColor" strokeWidth="1.4" className="rch-flow" />
          <path d="M286 146l-7 -4v8z" fill="currentColor" />
        </g>
        <g className="fade-in" style={d(1400)}>
          <path d="M596 146H684" stroke="currentColor" strokeWidth="1.4" className="rch-flow" />
          <path d="M686 146l-7 -4v8z" fill="currentColor" />
        </g>
      </g>

      {/* package */}
      <g className="fade-in text-sky-200" style={d(900)} transform="translate(292 44)">
        <rect width="296" height="204" className="fill-ink-900" stroke="currentColor" strokeOpacity="0.6" />
        <text x="148" y="28" textAnchor="middle" fill="#7dd3fc" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.6">DOCUMENTATION PACKAGE</text>
        <path d="M0 40h296" stroke="currentColor" strokeOpacity="0.4" />
        {packageItems.map((item, i) => (
          <g key={item} className="fade-in" style={d(1200 + i * 150)} transform={`translate(${16 + (i % 2) * 140} ${58 + Math.floor(i / 2) * 44})`}>
            <rect width="124" height="32" stroke="currentColor" strokeOpacity="0.55" />
            <path d="M10 16l4.5 4.5L22 12" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <text x="32" y="20" fill="currentColor" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="1">{item}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
