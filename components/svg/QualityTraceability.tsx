const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const nodes = [
  { label: "PART", icon: <path d="M-12 8V-8l12 -7 12 7V8L0 15zM-12 -8l12 7 12 -7M0 -1V15" /> },
  { label: "DRAWING", icon: <path d="M-12 -14h24v28h-24zM-6 -6h12v8H-6zM-6 8h12" /> },
  { label: "REVISION", icon: <path d="M-12 -4a12 12 0 0 1 22 -6M12 4a12 12 0 0 1 -22 6M8 -14l3 4 -5 2M-8 14l-3 -4 5 -2" /> },
  { label: "INSPECTION", icon: <path d="M-5 -5a9 9 0 1 0 0.1 0zM2 2l12 12" /> },
  { label: "TRACEABILITY", icon: <path d="M-14 0h8M6 0h8M-6 -6h12v12H-6zM-14 -8v16" /> },
];

/** Documentation trail: part → drawing → revision → inspection → traceability. Conceptual. */
export function QualityTraceability({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 880 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Documentation trail from part to drawing, revision, inspection and traceability"
    >
      <path d="M80 90H800" stroke="#7dd3fc" strokeOpacity="0.5" strokeWidth="1.2" pathLength={1} className="draw" style={{ "--t": "2.4s" } as React.CSSProperties} />
      <path d="M80 90H800" stroke="#d68a51" strokeWidth="1.4" className="rch-flow" opacity="0.7" />
      {nodes.map((n, i) => (
        <g key={n.label} className="fade-in text-sky-300" style={d(300 + i * 450)} transform={`translate(${80 + i * 180} 90)`}>
          <rect x="-34" y="-34" width="68" height="68" className="fill-ink-950" stroke="currentColor" strokeOpacity="0.8" />
          <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{n.icon}</g>
          <circle cx="34" cy="-34" r="3" fill="#38bdf8" className="rch-pulse" style={d(i * 300)} />
          <text y="62" textAnchor="middle" fill="currentColor" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.4">{n.label}</text>
          <text y="-46" textAnchor="middle" fill="#a8b8c8" fontFamily="var(--font-mono)" fontSize="9.5">{String(i + 1).padStart(2, "0")}</text>
        </g>
      ))}
    </svg>
  );
}
