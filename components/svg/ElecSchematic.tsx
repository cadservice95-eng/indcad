"use client";

const mono = { fontFamily: "var(--font-mono)" } as const;
const BASE = "#7dd3fc";
const ACTIVE = "#22c55e";

type Props = {
  className?: string;
  activeRef?: string | null;
  traceSet?: string[];
  onRef?: (ref: string | null) => void;
  title?: string;
};

/**
 * Illustrative schematic: a three-phase motor power circuit (breaker, contactor,
 * terminals, motor) beside a control ladder (stop, start with seal-in, contactor
 * coil, relay, lamp). Components share reference tags (Q-01, K-01 …) with the
 * panel layout. Decorative; not a certified drawing.
 */
export function ElecSchematic({ className, activeRef = null, traceSet, onRef, title = "Illustrative motor schematic with a power circuit and a control ladder" }: Props) {
  const on = (...ids: string[]) => ids.some((i) => activeRef === i || traceSet?.includes(i));
  const anyOn = !!activeRef || (traceSet?.length ?? 0) > 0;
  const col = (...ids: string[]) => (on(...ids) ? ACTIVE : BASE);
  const op = (...ids: string[]) => (anyOn && !on(...ids) ? 0.3 : 1);
  const hv = (id: string) =>
    onRef ? ({ onMouseEnter: () => onRef(id), onMouseLeave: () => onRef(null), onFocus: () => onRef(id), onBlur: () => onRef(null), style: { cursor: "pointer" } } as const) : {};
  const T = (x: number, y: number, t: string, ids: string[]) => (
    <text x={x} y={y} fill={on(...ids) ? ACTIVE : "#94a3b8"} fontSize="9" letterSpacing="1" style={mono}>{t}</text>
  );

  return (
    <svg viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label={title} strokeLinecap="round" strokeLinejoin="round">
      <rect x="0.5" y="0.5" width="639" height="359" stroke="#83aed3" strokeOpacity="0.25" />
      <path d="M320 20V340" stroke="#83aed3" strokeOpacity="0.2" strokeDasharray="4 4" />
      <text x="20" y="22" fill="#64748b" fontSize="9" letterSpacing="1.4" style={mono}>POWER CIRCUIT</text>
      <text x="340" y="22" fill="#64748b" fontSize="9" letterSpacing="1.4" style={mono}>CONTROL CIRCUIT</text>

      {/* power lines */}
      <g stroke={col("w-pwr", "Q-01", "K-01", "M-01")} strokeWidth="1.8" style={{ opacity: op("w-pwr"), transition: "opacity .3s, stroke .3s" }}>
        {[100, 130, 160].map((x) => <path key={x} d={`M${x} 30V250`} />)}
      </g>
      {/* Q-01 */}
      <g {...hv("Q-01")} tabIndex={onRef ? 0 : undefined} stroke={col("Q-01")} style={{ opacity: op("Q-01"), transition: "opacity .3s", cursor: onRef ? "pointer" : undefined }}>
        <rect x="82" y="54" width="96" height="34" className="fill-ink-950" strokeWidth="1.6" />
        {[100, 130, 160].map((x) => <path key={x} d={`M${x - 6} 82L${x + 6} 60`} strokeWidth="1.2" />)}
        {T(188, 74, "Q-01", ["Q-01"])}
      </g>
      {/* K-01 contacts */}
      <g {...hv("K-01")} tabIndex={onRef ? 0 : undefined} stroke={col("K-01")} style={{ opacity: op("K-01"), transition: "opacity .3s", cursor: onRef ? "pointer" : undefined }}>
        <rect x="82" y="118" width="96" height="40" className="fill-ink-950" strokeWidth="1.6" strokeDasharray="5 3" />
        {[100, 130, 160].map((x) => <g key={x}><circle cx={x} cy="124" r="2.2" /><circle cx={x} cy="152" r="2.2" /><path d={`M${x} 124l8 22`} strokeWidth="1.2" /></g>)}
        {T(188, 142, "K-01", ["K-01"])}
      </g>
      {/* X1 terminals */}
      <g {...hv("X1")} tabIndex={onRef ? 0 : undefined} stroke={col("X1")} style={{ opacity: op("X1"), transition: "opacity .3s", cursor: onRef ? "pointer" : undefined }}>
        {[92, 122, 152].map((x) => <rect key={x} x={x} y="192" width="16" height="14" className="fill-ink-950" strokeWidth="1.5" />)}
        {T(188, 204, "X1", ["X1"])}
      </g>
      {/* motor */}
      <g {...hv("M-01")} tabIndex={onRef ? 0 : undefined} stroke={col("M-01")} style={{ opacity: op("M-01"), transition: "opacity .3s", cursor: onRef ? "pointer" : undefined }}>
        <circle cx="130" cy="290" r="26" className="fill-ink-950" strokeWidth="1.8" />
        <text x="130" y="296" textAnchor="middle" fill="currentColor" stroke="none" fontSize="16" style={mono}>M</text>
        {T(166, 296, "M-01", ["M-01"])}
      </g>

      {/* control rails */}
      <g stroke="#7dd3fc" strokeWidth="1.8" opacity="0.9"><path d="M360 40V320M600 40V320" /></g>
      <text x="350" y="34" fill="#64748b" fontSize="9" style={mono}>L</text>
      <text x="596" y="34" fill="#64748b" fontSize="9" style={mono}>N</text>

      {/* rung 1: stop, start (+ seal-in), K-01 coil */}
      <g stroke={col("w-ctrl")} strokeWidth="1.6" style={{ opacity: op("w-ctrl"), transition: "opacity .3s, stroke .3s" }}>
        <path d="M360 90H390M416 90H446M472 90H520M550 90H600M446 90V120H472V90" />
      </g>
      <g {...hv("S-01")} tabIndex={onRef ? 0 : undefined} stroke={col("S-01")} style={{ opacity: op("S-01"), transition: "opacity .3s", cursor: onRef ? "pointer" : undefined }}>
        <path d="M390 90h26" stroke="transparent" />
        <circle cx="390" cy="90" r="2.4" className="fill-ink-950" /><circle cx="416" cy="90" r="2.4" className="fill-ink-950" /><path d="M390 90l24 -14M400 70v10" strokeWidth="1.4" />
        {T(386, 62, "S-01", ["S-01"])}
      </g>
      <g {...hv("S-02")} tabIndex={onRef ? 0 : undefined} stroke={col("S-02")} style={{ opacity: op("S-02"), transition: "opacity .3s", cursor: onRef ? "pointer" : undefined }}>
        <circle cx="446" cy="90" r="2.4" className="fill-ink-950" /><circle cx="472" cy="90" r="2.4" className="fill-ink-950" /><path d="M446 90l22 -14" strokeWidth="1.4" />
        {T(442, 62, "S-02", ["S-02"])}
      </g>
      <g {...hv("K-01")} tabIndex={onRef ? 0 : undefined} stroke={col("K-01")} style={{ opacity: op("K-01"), transition: "opacity .3s", cursor: onRef ? "pointer" : undefined }}>
        <rect x="520" y="78" width="30" height="24" className="fill-ink-950" strokeWidth="1.6" />
        {T(516, 70, "K-01", ["K-01"])}
        <path d="M446 112l26 0" strokeWidth="1.2" /><text x="400" y="132" fill="#64748b" fontSize="8" stroke="none" style={mono}>SEAL-IN K-01</text>
      </g>

      {/* rung 2: K-01 contact → K-02 relay */}
      <g stroke={col("K-02")} strokeWidth="1.6" style={{ opacity: op("K-02"), transition: "opacity .3s, stroke .3s" }}>
        <path d="M360 200H430M456 200H520M550 200H600" />
        <circle cx="430" cy="200" r="2.4" className="fill-ink-950" /><circle cx="456" cy="200" r="2.4" className="fill-ink-950" /><path d="M430 200l24 -14" strokeWidth="1.4" />
        <rect x="520" y="188" width="30" height="24" className="fill-ink-950" />
      </g>
      <g {...hv("K-02")} tabIndex={onRef ? 0 : undefined} style={{ cursor: onRef ? "pointer" : undefined }}>
        <rect x="408" y="170" width="170" height="50" fill="transparent" />
        {T(516, 180, "K-02", ["K-02"])}
      </g>

      {/* rung 3: lamp */}
      <g stroke={col("H-01")} strokeWidth="1.6" style={{ opacity: op("H-01"), transition: "opacity .3s" }}>
        <path d="M360 290H520M550 290H600" />
        <circle cx="535" cy="290" r="14" className="fill-ink-950" /><path d="M525 280l20 20M545 280l-20 20" strokeWidth="1.2" />
        {T(512, 268, "H-01", ["H-01"])}
      </g>

      <text x="20" y="348" fill="#64748b" fontSize="8.5" letterSpacing="1.2" style={mono}>SCH-01 · REV B · ILLUSTRATIVE</text>
    </svg>
  );
}
