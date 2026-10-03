"use client";

const mono = { fontFamily: "var(--font-mono)" } as const;
const BASE = "#7dd3fc";
const ACTIVE = "#22c55e";

/**
 * Illustrative physical panel layout: enclosure, busbar, breaker, contactor,
 * relay, terminal strip and cable entry, using the same reference tags as the
 * schematic. `variant="switchboard"` shows a row of outgoing breakers.
 */
export function PanelLayout({
  className,
  activeRef = null,
  onRef,
  variant = "control",
}: {
  className?: string;
  activeRef?: string | null;
  onRef?: (ref: string | null) => void;
  variant?: "control" | "switchboard";
}) {
  const on = (id: string) => activeRef === id;
  const col = (id: string) => (on(id) ? ACTIVE : BASE);
  const op = (id: string) => (activeRef && !on(id) ? 0.3 : 1);
  const hv = (id: string) =>
    onRef ? ({ onMouseEnter: () => onRef(id), onMouseLeave: () => onRef(null), onFocus: () => onRef(id), onBlur: () => onRef(null), tabIndex: 0, style: { cursor: "pointer", opacity: op(id), transition: "opacity .3s" } } as const) : ({ style: { opacity: op(id), transition: "opacity .3s" } } as const);

  return (
    <svg viewBox="0 0 640 380" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Illustrative panel layout with busbar, breaker, contactor, relay, terminals and cable entry" strokeLinecap="round" strokeLinejoin="round">
      <rect x="40" y="30" width="560" height="310" stroke="#83aed3" strokeOpacity="0.6" strokeWidth="1.6" />
      <rect x="52" y="42" width="536" height="286" stroke="#83aed3" strokeOpacity="0.25" strokeDasharray="4 4" />
      {/* din rails */}
      <g stroke="#83aed3" strokeOpacity="0.35">
        <path d="M70 136H570M70 226H570M70 300H570" strokeWidth="5" />
      </g>
      {/* busbar */}
      <g {...hv("BUS")} stroke={col("BUS")}>
        <rect x="70" y="58" width="500" height="12" className="fill-ink-950" strokeWidth="1.6" />
        <text x="76" y="52" fill={on("BUS") ? ACTIVE : "#94a3b8"} fontSize="9" letterSpacing="1" style={mono}>BUSBAR</text>
      </g>

      {variant === "switchboard" ? (
        <g {...hv("Q-01")} stroke={col("Q-01")}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <rect x={80 + i * 80} y="84" width="52" height="96" className="fill-ink-950" strokeWidth="1.6" />
              <rect x={96 + i * 80} y="96" width="20" height="30" strokeWidth="1.2" />
              <text x={106 + i * 80} y="160" textAnchor="middle" fill={on("Q-01") ? ACTIVE : "#94a3b8"} fontSize="8.5" stroke="none" style={mono}>Q-0{i + 1}</text>
            </g>
          ))}
        </g>
      ) : (
        <>
          <g {...hv("Q-01")} stroke={col("Q-01")}>
            <rect x="84" y="84" width="48" height="96" className="fill-ink-950" strokeWidth="1.6" />
            <rect x="98" y="96" width="20" height="30" strokeWidth="1.2" />
            <text x="108" y="160" textAnchor="middle" fill={on("Q-01") ? ACTIVE : "#94a3b8"} fontSize="9" stroke="none" style={mono}>Q-01</text>
          </g>
          <g {...hv("K-01")} stroke={col("K-01")}>
            <rect x="160" y="84" width="76" height="110" className="fill-ink-950" strokeWidth="1.6" />
            <rect x="172" y="96" width="52" height="24" strokeWidth="1.2" />
            <text x="198" y="160" textAnchor="middle" fill={on("K-01") ? ACTIVE : "#94a3b8"} fontSize="9" stroke="none" style={mono}>K-01</text>
          </g>
          <g {...hv("K-02")} stroke={col("K-02")}>
            <rect x="264" y="92" width="44" height="64" className="fill-ink-950" strokeWidth="1.6" />
            <circle cx="286" cy="112" r="8" strokeWidth="1.2" />
            <text x="286" y="146" textAnchor="middle" fill={on("K-02") ? ACTIVE : "#94a3b8"} fontSize="9" stroke="none" style={mono}>K-02</text>
          </g>
        </>
      )}

      {/* terminal strip */}
      <g {...hv("X1")} stroke={col("X1")}>
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={84 + i * 34} y="240" width="26" height="40" className="fill-ink-950" strokeWidth="1.4" />)}
        <text x="84" y="236" fill={on("X1") ? ACTIVE : "#94a3b8"} fontSize="9" letterSpacing="1" stroke="none" style={mono}>X1 · TERMINALS</text>
      </g>

      {/* cable entry */}
      <g {...hv("GLAND")} stroke={col("GLAND")}>
        {[460, 500, 540].map((x) => <g key={x}><path d={`M${x} 340v22`} strokeWidth="2.4" /><circle cx={x} cy="340" r="8" className="fill-ink-950" strokeWidth="1.5" /></g>)}
        <text x="440" y="378" fill={on("GLAND") ? ACTIVE : "#94a3b8"} fontSize="9" letterSpacing="1" stroke="none" style={mono}>CABLE ENTRY</text>
      </g>

      {/* wiring ducts */}
      <g stroke="#83aed3" strokeOpacity="0.25" strokeDasharray="3 3"><path d="M70 196H570M70 216H570" /></g>
      <text x="48" y="22" fill="#64748b" fontSize="8.5" letterSpacing="1.2" style={mono}>PANEL A · LAYOUT-01 · ILLUSTRATIVE</text>
    </svg>
  );
}
