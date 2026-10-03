import { makeIso, seg, boxPath } from "./iso";
import { SteelFrame } from "@/components/structural/SteelFrame";
import { members } from "@/components/structural/steel";
import { GaDiagram, ConnectionDiagram, ShopDiagram, ErectionDiagram } from "./StructDiagrams";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;
const life = (ms: number) => ({ "--life": `${ms}ms` }) as React.CSSProperties;
const mono = { fontFamily: "var(--font-mono)" } as const;

/** Design intent (abstract) vs fabrication reality (plate, bolt access, weld access, assembly direction). */
export function ConstructabilityGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 880 320" fill="none" className={className} role="img" aria-label="Design intent on the left, fabrication reality with bolt access, weld access and assembly direction on the right" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10.5" y="10.5" width="380" height="298" stroke="#83aed3" strokeOpacity="0.3" />
      <text x="26" y="36" fill="#a8b8c8" fontSize="11" letterSpacing="1.8" style={mono}>DESIGN INTENT</text>
      <g stroke="#7dd3fc" strokeWidth="1.4" strokeDasharray="6 4" className="text-sky-300">
        <path d="M120 70v200M120 170h220" pathLength={1} className="draw" style={d(0, "1.2s")} />
        <circle cx="120" cy="170" r="14" className="fade-in" style={d(900)} />
      </g>
      <text x="140" y="150" fill="#7dd3fc" fontSize="9.5" letterSpacing="1" className="fade-in" style={{ ...mono, ...d(1100) }}>CONNECTION · CAPACITY PER ENGINEER</text>

      <g className="fade-in text-copper-400" style={d(1300)}>
        <path d="M396 160h86" stroke="currentColor" strokeWidth="1.4" className="rch-flow" />
        <path d="M484 160l-7 -4v8z" fill="currentColor" />
        <text x="398" y="194" fill="currentColor" fontSize="8.5" letterSpacing="0.6" style={mono}>DESIGN → DETAIL</text>
        <text x="398" y="207" fill="currentColor" fontSize="8.5" letterSpacing="0.6" style={mono}>→ FABRICATE → ERECT</text>
      </g>

      <rect x="490.5" y="10.5" width="380" height="298" stroke="#7dd3fc" strokeOpacity="0.5" />
      <text x="506" y="36" fill="#7dd3fc" fontSize="11" letterSpacing="1.8" style={mono}>FABRICATION REALITY</text>
      <g stroke="#7dd3fc" strokeWidth="1.5" className="text-sky-300">
        <rect x="560" y="60" width="44" height="220" pathLength={1} className="draw" style={d(1500, "1s")} />
        <rect x="604" y="138" width="12" height="64" className="fill-sky-400/20" pathLength={1} />
        <rect x="616" y="148" width="190" height="44" pathLength={1} className="draw" style={d(1900, "1s")} />
        {[150, 190].map((y) => <circle key={y} cx="610" cy={y - 6} r="3" className="fade-in" style={d(2600)} />)}
      </g>
      <g className="fade-in" style={d(2800)} stroke="#d68a51" strokeWidth="1.1">
        <path d="M610 140l-40 -34" /><text x="520" y="100" fill="#d68a51" stroke="none" fontSize="8.5" letterSpacing="0.8" style={mono}>WELD ACCESS</text>
        <path d="M610 200l-30 40" /><text x="500" y="256" fill="#d68a51" stroke="none" fontSize="8.5" letterSpacing="0.8" style={mono}>BOLT ACCESS</text>
        <path d="M770 120h-100m6 -5l-6 5 6 5" stroke="#34d399" /><text x="690" y="112" fill="#34d399" stroke="none" fontSize="8.5" letterSpacing="0.8" style={mono}>ASSEMBLY DIRECTION</text>
      </g>
    </svg>
  );
}

/** Structural + services + architecture, a clash, then a coordinated model. */
export function BimCoordinationGraphic({ className }: { className?: string }) {
  const p = makeIso(274, 196, 13);
  const envelope = boxPath(p, -2, -2, 0, 18, 8, 9.4);
  const duct = boxPath(p, -3, 2.2, 3.3, 19, 3.8, 5);
  const clash = p(8, 3, 4.2);
  const frame = members
    .filter((m) => m.kind !== "brace" || m.since < 3)
    .map((m) => ({ id: m.id, kind: m.kind, d: seg(p(...m.a), p(...m.b)) }));
  const tag = (t: string, x: number, y: number, c: string, delay: number, lifeMs?: number) => (
    <g className={lifeMs ? "fade-pass" : "fade-in"} style={{ ...d(delay), ...(lifeMs ? life(lifeMs) : {}) }}>
      <rect x={x} y={y} width={t.length * 8 + 16} height="22" className="fill-ink-950" stroke={c} strokeWidth="0.9" />
      <text x={x + 8} y={y + 15} fill={c} fontSize="10" letterSpacing="1.2" style={mono}>{t}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 640 380" fill="none" className={className} role="img" aria-label="Structural, architectural and services models coordinated: a clash is detected and resolved" strokeLinecap="round" strokeLinejoin="round">
      <rect x="0.5" y="0.5" width="639" height="379" stroke="#83aed3" strokeOpacity="0.25" />
      <path d={envelope} stroke="#a8b8c8" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
      <g stroke="#7dd3fc">
        {frame.map((m) => (
          <path key={m.id} d={m.d} strokeWidth={m.kind === "col" ? 3 : m.kind === "beam" ? 2 : 1.2} pathLength={1} className="draw" style={d(m.kind === "col" ? 0 : 500, "1s")} />
        ))}
      </g>
      <g className="duct" style={{ ...d(0), "--dy": "-30px" } as React.CSSProperties}>
        <path d={duct} stroke="#34d399" strokeWidth="1.6" fill="rgba(52,211,153,0.12)" />
      </g>
      <g className="fade-pass" style={{ ...d(1200), ...life(2800) }}>
        <circle cx={clash[0]} cy={clash[1]} r="24" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={`M${clash[0] - 8} ${clash[1] - 8}l16 16M${clash[0] + 8} ${clash[1] - 8}l-16 16`} stroke="#f87171" strokeWidth="2.2" />
      </g>
      {tag("STRUCTURAL MODEL", 24, 24, "#7dd3fc", 0)}
      {tag("SERVICES MODEL", 24, 52, "#34d399", 200)}
      {tag("ARCHITECTURAL ENVELOPE", 24, 80, "#a8b8c8", 400)}
      {tag("CLASH DETECTED", 24, 336, "#f87171", 1200, 2900)}
      {tag("COORDINATION", 24, 336, "#d68a51", 4000, 1400)}
      {tag("RESOLVED MODEL", 24, 336, "#34d399", 5400)}
    </svg>
  );
}

/** Fabrication drawing vs site erection reference, with pulsing highlights on what the reader needs. */
export function PressureGraphic({ className }: { className?: string }) {
  const pulse = (x: number, y: number, r: number, delay: number) => (
    <circle cx={x} cy={y} r={r} stroke="#d68a51" strokeWidth="1.4" className="rch-pulse" style={d(delay)} />
  );
  return (
    <svg viewBox="0 0 880 358" fill="none" className={className} role="img" aria-label="A fabrication shop drawing sheet beside a site erection view, with the key reference points highlighted" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10.5" y="10.5" width="420" height="318" stroke="#83aed3" strokeOpacity="0.3" />
      <text x="26" y="34" fill="#7dd3fc" fontSize="10.5" letterSpacing="1.6" style={mono}>FABRICATION SHOP</text>
      <g transform="translate(26 50)" stroke="#7dd3fc" strokeWidth="1.2">
        <rect width="388" height="262" strokeOpacity="0.5" />
        <path d="M20 90h260v50H20zM20 102h260M20 128h260" strokeWidth="1.6" pathLength={1} className="draw" style={d(0, "1.2s")} />
        <path d="M0 210h388M262 210v52" strokeOpacity="0.5" />
        <g fill="#7dd3fc" stroke="none" fontSize="9" letterSpacing="1" className="fade-in" style={{ ...mono, ...d(800) }}>
          <text x="20" y="30">PIECE MARK B-104</text>
          <text x="20" y="48">MEMBER REF  UB 305 · S355</text>
          <text x="270" y="232">REV A</text><text x="10" y="232">SHOP DRAWING</text>
          <text x="300" y="82">DETAIL A</text>
        </g>
        <g stroke="#d68a51" strokeWidth="0.9" className="fade-in" style={d(1100)}>
          <path d="M20 168h260M20 162v12M280 162v12" /><text x="124" y="184" fill="#d68a51" stroke="none" fontSize="9" style={mono}>4 800</text>
        </g>
        <circle cx="300" cy="115" r="22" strokeDasharray="3 3" className="fade-in" style={d(1300)} />
      </g>
      <g className="text-copper-400">{pulse(64, 82, 14, 1400)}{pulse(326, 165, 18, 1900)}{pulse(144, 250, 12, 2400)}</g>

      <rect x="450.5" y="10.5" width="420" height="318" stroke="#83aed3" strokeOpacity="0.3" />
      <text x="466" y="34" fill="#7dd3fc" fontSize="10.5" letterSpacing="1.6" style={mono}>SITE ERECTION</text>
      <g transform="translate(466 50)" stroke="#7dd3fc" strokeWidth="1.6">
        <path d="M60 240V40M200 240V40M340 240V40" strokeWidth="3.2" pathLength={1} className="draw" style={d(300, "1.2s")} />
        <path d="M60 110H340M60 40H200" strokeWidth="2.2" pathLength={1} className="draw" style={d(900, "1.2s")} />
        <g strokeWidth="0.8" strokeDasharray="6 2 1 2" opacity="0.7"><path d="M60 258V250M200 258V250M340 258V250" /></g>
        {["A", "B", "C"].map((t, i) => (
          <g key={t} className="fade-in" style={d(1200)}>
            <circle cx={60 + i * 140} cy="270" r="10" className="fill-ink-950" /><text x={60 + i * 140} y="274" textAnchor="middle" fill="#7dd3fc" stroke="none" fontSize="10" style={mono}>{t}</text>
          </g>
        ))}
        <g fill="#7dd3fc" stroke="none" fontSize="9" letterSpacing="1" className="fade-in" style={{ ...mono, ...d(1500) }}>
          <text x="210" y="104">B-104 · ERECT FROM GRID B</text>
          <text x="210" y="60">ERECTION REF E-02</text>
        </g>
      </g>
      <g className="text-copper-400">{pulse(666, 160, 14, 2000)}{pulse(526, 270, 14, 2500)}</g>
      <g className="fade-in" style={d(2800)} fill="#94a3b8" fontSize="9.5" letterSpacing="1.4">
        {["CLEAR", "STRUCTURED", "TRACEABLE", "PRACTICAL"].map((t, i) => <text key={t} x={30 + i * 200} y="350" style={mono}>{t}</text>)}
      </g>
    </svg>
  );
}

/** Closing visual: five documents fly into one organised package. */
export function PackageGraphic({ className }: { className?: string }) {
  const items = [
    { x: 20, y: 30, fx: "-180px", fy: "-60px", node: <svg x="0" y="0" width="150" height="104" viewBox="60 60 520 440"><SteelFrame detail={0} cx={320} cy={270} /></svg>, label: "3D FRAME" },
    { x: 190, y: 30, fx: "0px", fy: "-90px", node: <svg x="0" y="0" width="150" height="104" viewBox="0 0 320 220"><ShopDiagram /></svg>, label: "SHOP DRAWING" },
    { x: 360, y: 30, fx: "180px", fy: "-60px", node: <svg x="0" y="0" width="150" height="104" viewBox="0 0 320 220"><ConnectionDiagram /></svg>, label: "CONNECTION" },
    { x: 105, y: 170, fx: "-120px", fy: "90px", node: <svg x="0" y="0" width="150" height="104" viewBox="0 0 320 220"><GaDiagram /></svg>, label: "GA" },
    { x: 275, y: 170, fx: "120px", fy: "90px", node: <svg x="0" y="0" width="150" height="104" viewBox="0 0 320 220"><ErectionDiagram /></svg>, label: "ERECTION" },
  ];
  return (
    <svg viewBox="0 0 540 330" fill="none" className={className} role="img" aria-label="A 3D frame, shop drawing, connection detail, GA and erection drawing assembled into one documentation package">
      <rect x="0.5" y="0.5" width="539" height="329" stroke="#83aed3" strokeOpacity="0.25" />
      {items.map((it, i) => (
        <g key={it.label} transform={`translate(${it.x + 20} ${it.y + 20})`}>
          <g className="fly" style={{ "--fx": it.fx, "--fy": it.fy, "--d": `${i * 160}ms` } as React.CSSProperties}>
            <rect width="150" height="104" className="fill-ink-950" stroke="#7dd3fc" strokeOpacity="0.6" />
            <g className="text-sky-300">{it.node}</g>
            <text x="6" y="116" fill="#7dd3fc" fontSize="8" letterSpacing="1" style={mono}>{it.label}</text>
          </g>
        </g>
      ))}
      <g className="fade-in text-copper-400" style={d(1600)}>
        <rect x="20" y="306" width="500" height="1" fill="currentColor" opacity="0.4" />
        <text x="270" y="322" textAnchor="middle" fill="#d68a51" fontSize="9" letterSpacing="1.6" style={mono}>ORGANISED DRAWING PACKAGE · FOR CONSTRUCTION</text>
      </g>
    </svg>
  );
}

export { seg };
