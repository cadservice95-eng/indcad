import { cn } from "@/lib/utils";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;
const mono = { fontFamily: "var(--font-mono)" } as const;
const S = "#7dd3fc";

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" className={cn("h-full w-full", className)} aria-hidden strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

/** General arrangement: frame elevation with grids, levels, tags, dimensions and a section marker. */
export function GaDiagram({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <g stroke={S} strokeWidth="1.4">
        {[50, 160, 270].map((x, i) => (
          <path key={x} d={`M${x} 184V44`} strokeWidth="3.4" pathLength={1} className="draw" style={d(i * 150, "0.9s")} />
        ))}
        <path d="M50 114H270M50 44H270" strokeWidth="2.4" pathLength={1} className="draw" style={d(600, "1s")} />
        <path d="M50 184L160 114M160 184L50 114M50 114L160 44M160 114L50 44" strokeWidth="1.2" opacity="0.7" pathLength={1} className="draw" style={d(1000, "1s")} />
      </g>
      <g stroke={S} strokeWidth="0.7" strokeDasharray="6 2 1 2" opacity="0.7" className="fade-in" style={d(1400)}>
        {[50, 160, 270].map((x) => <path key={x} d={`M${x} 196V30`} />)}
      </g>
      <g className="fade-in" style={d(1400)} fill={S} fontSize="9" letterSpacing="1">
        {["A", "B", "C"].map((t, i) => (
          <g key={t}>
            <circle cx={50 + i * 110} cy="18" r="8" className="fill-ink-950" stroke={S} />
            <text x={50 + i * 110} y="21.5" textAnchor="middle" style={mono}>{t}</text>
          </g>
        ))}
        <text x="272" y="48" style={mono} fill="#d68a51" fontSize="7.5">LEVEL 02</text>
        <text x="272" y="118" style={mono} fill="#d68a51" fontSize="7.5">LEVEL 01</text>
        <text x="86" y="108" style={mono}>B-104</text>
      </g>
      <g stroke="#d68a51" strokeWidth="0.9" className="fade-in" style={d(1700)}>
        <path d="M50 208H160M160 208H270M50 202v12M160 202v12M270 202v12" />
        <text x="100" y="205" fill="#d68a51" stroke="none" fontSize="8.5" style={mono}>8 000</text>
        <path d="M30 154l14 0M30 154v-30" strokeDasharray="3 3" />
        <text x="14" y="168" fill="#d68a51" stroke="none" fontSize="8.5" style={mono}>A</text>
      </g>
    </Frame>
  );
}

/** Beam-to-column connection with end plate, bolts and weld indicators. */
export function ConnectionDiagram({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <g stroke={S} strokeWidth="1.5">
        <path d="M70 20h50v180H70zM84 20v180M106 20v180" pathLength={1} className="draw" style={d(0, "1.1s")} opacity="0.9" />
        <path d="M128 70h150v70H128zM128 82h150M128 128h150" pathLength={1} className="draw" style={d(500, "1.1s")} />
        <path d="M120 60h8v90h-8z" className="fill-sky-400/20" pathLength={1} style={d(900)} />
      </g>
      <g className="fade-in" style={d(1300)} stroke={S}>
        {[78, 98, 120, 142].map((y, i) => (
          <circle key={i} cx={124} cy={y - 12} r="3.4" className="fill-ink-950" />
        ))}
      </g>
      <g className="fade-in" style={d(1700)} stroke="#d68a51" strokeWidth="1.3">
        <path d="M120 60l-8 -8h16zM120 150l-8 8h16z" fill="#d68a51" fillOpacity="0.25" />
        <path d="M112 52l-24 -22h40M112 158l-24 22h40" />
        <text x="130" y="28" fill="#d68a51" stroke="none" fontSize="8.5" style={mono}>WELD</text>
      </g>
      <g className="fade-in" fill={S} fontSize="8.5" style={mono} stroke="none">
        <text x="140" y="62" style={mono}>PLATE P-04</text>
        <text x="196" y="160" style={mono}>BEAM B-104</text>
        <text x="130" y="210" style={mono}>DETAIL A</text>
      </g>
    </Frame>
  );
}

/** Shop drawing: part outline, dimensions, holes, piece mark, material and weld symbol. */
export function ShopDiagram({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <rect x="6.5" y="6.5" width="307" height="207" stroke={S} strokeOpacity="0.4" />
      <g stroke={S} strokeWidth="1.5">
        <path d="M30 80h260v54H30zM30 92h260M30 122h260" pathLength={1} className="draw" style={d(0, "1.2s")} />
        <path d="M30 70v74M38 70v74M282 70v74M290 70v74" strokeWidth="1" opacity="0.7" />
      </g>
      <g className="fade-in" style={d(900)} stroke={S}>
        {[[50, 100], [50, 114], [270, 100], [270, 114]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" className="fill-ink-950" />)}
      </g>
      <g stroke="#d68a51" strokeWidth="0.9" className="fade-in" style={d(1300)}>
        <path d="M30 160H290M30 154v12M290 154v12" />
        <text x="140" y="178" fill="#d68a51" stroke="none" fontSize="9" style={mono}>4 800</text>
        <path d="M296 80v54M290 80h12M290 134h12" />
        <text x="302" y="112" fill="#d68a51" stroke="none" fontSize="8" style={mono}>300</text>
      </g>
      <g className="fade-in" style={d(1700)} fill={S} fontSize="8.5" stroke="none">
        <circle cx="160" cy="42" r="15" className="fill-ink-950" stroke={S} />
        <text x="160" y="45" textAnchor="middle" style={mono}>B-104</text>
        <path d="M160 57V80" stroke={S} />
        <text x="30" y="30" style={mono}>UB 305 · S355</text>
        <path d="M60 134l14 24h24" stroke="#d68a51" fill="none" strokeWidth="1" />
        <path d="M60 134l-4 -7h8z" fill="#d68a51" />
        <text x="100" y="170" style={mono} fill="#d68a51">▲ FW 6</text>
        <text x="30" y="204" style={mono}>SHOP DRAWING · REV A</text>
      </g>
    </Frame>
  );
}

/** Erection sequence: member A → member B → connection → frame assembly. */
export function ErectionDiagram({ className }: { className?: string }) {
  const steps = ["A", "B", "CONN", "FRAME"];
  return (
    <Frame className={className}>
      {steps.map((t, i) => (
        <g key={t} transform={`translate(${12 + i * 78} 50)`} className="fade-in" style={d(i * 500)}>
          <rect width="68" height="110" stroke={S} strokeOpacity="0.4" />
          <g stroke={S} strokeWidth="1.8">
            <path d="M16 96V18" strokeWidth="3" />
            {i >= 1 ? <path d="M16 36H54" /> : null}
            {i >= 2 ? <circle cx="16" cy="36" r="5" className="fill-ink-950" stroke="#d68a51" /> : null}
            {i >= 3 ? <path d="M54 96V36M16 96H54M16 66H54" strokeWidth="1.5" /> : null}
          </g>
          <text x="34" y="128" textAnchor="middle" fill={S} fontSize="8.5" letterSpacing="1" style={mono}>{t}</text>
          <text x="6" y="12" fill="#d68a51" fontSize="8" style={mono}>0{i + 1}</text>
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${82 + i * 78} 105h8m-3 -3l3 3-3 3`} stroke="#d68a51" strokeWidth="1.2" className="fade-in" style={d(300 + i * 500)} />
      ))}
      <text x="12" y="30" fill={S} fontSize="9" letterSpacing="1.4" style={mono}>ERECTION SEQUENCE</text>
    </Frame>
  );
}
