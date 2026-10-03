import { Sld } from "@/components/svg/Sld";
import { ElecSchematic } from "@/components/svg/ElecSchematic";
import { PanelLayout } from "@/components/svg/PanelLayout";
import { AsBuilt } from "@/components/svg/AsBuilt";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const mono = { fontFamily: "var(--font-mono)" } as const;

const arts = {
  switchboard: (
    <>
      <rect x="20" y="20" width="130" height="110" />
      <path d="M30 40h110" strokeWidth="4" opacity="0.6" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={32 + i * 28} y="56" width="20" height="46" />)}
      <path d="M170 40v90M170 60h50M170 90h50M170 120h50" opacity="0.8" /><circle cx="228" cy="60" r="6" /><circle cx="228" cy="90" r="6" /><circle cx="228" cy="120" r="6" />
    </>
  ),
  control: (
    <>
      <path d="M40 20v110M200 20v110" strokeWidth="2" />
      <path d="M40 50h40M96 50h30M142 50h20M180 50h20M40 100h50M116 100h30" /><rect x="162" y="40" width="18" height="20" />
      <circle cx="88" cy="50" r="2.5" /><circle cx="98" cy="50" r="2.5" /><path d="M88 50l9 -9" /><circle cx="128" cy="100" r="14" /><path d="M118 90l20 20M138 90l-20 20" opacity="0.7" />
    </>
  ),
  commercial: (
    <>
      <path d="M120 14v26M40 50H200M40 50v30M120 50v30M200 50v30" strokeWidth="2.4" />
      {[40, 120, 200].map((x) => <g key={x}><rect x={x - 22} y="80" width="44" height="22" /><path d={`M${x - 12} 102v26M${x + 12} 102v26`} /><circle cx={x - 12} cy="136" r="6" /><circle cx={x + 12} cy="136" r="6" /></g>)}
    </>
  ),
  asbuilt: (
    <>
      <rect x="14" y="30" width="86" height="90" strokeDasharray="5 3" /><path d="M24 50h50M24 70h66M24 90h34" opacity="0.6" /><path d="M30 112l16 -18 10 8 22 -26" stroke="#f59e0b" />
      <path d="M108 75h28m-6 -5l6 5-6 5" className="ico-shift" />
      <rect x="144" y="30" width="86" height="90" /><path d="M154 50h50M154 70h66M154 90h34" opacity="0.6" /><circle cx="212" cy="104" r="8" stroke="#22c55e" />
    </>
  ),
  bim: (
    <>
      <path d="M30 100l60 -26 60 26 -60 26z" opacity="0.5" /><path d="M30 70l60 -26 60 26 -60 26z" opacity="0.7" /><path d="M30 40l60 -26 60 26 -60 26z" />
      <path d="M60 90l60 26" stroke="#22c55e" strokeWidth="2.2" /><path d="M170 20v110" strokeDasharray="3 3" opacity="0.5" /><circle cx="120" cy="70" r="10" stroke="#ef4444" strokeDasharray="3 2" />
    </>
  ),
  upgrade: (
    <>
      <path d="M120 14v22M50 46H190M50 46v36M120 46v36M190 46v36" strokeDasharray="5 3" opacity="0.7" />
      {[50, 120, 190].map((x) => <rect key={x} x={x - 18} y="82" width="36" height="18" strokeDasharray="5 3" opacity="0.7" />)}
      <path d="M190 100v28M190 128h36" stroke="#f59e0b" strokeWidth="2.2" /><circle cx="234" cy="128" r="5" stroke="#f59e0b" />
    </>
  ),
  mining: (
    <>
      <rect x="20" y="20" width="70" height="46" /><path d="M30 30h50M30 44h50" opacity="0.6" />
      <path d="M55 66v26M20 92H220" strokeWidth="2" />{[40, 100, 160, 210].map((x) => <g key={x}><path d={`M${x} 92v22`} /><circle cx={x} cy="124" r="10" /><text x={x} y="128" textAnchor="middle" fill="currentColor" stroke="none" fontSize="10" style={mono}>M</text></g>)}
      <path d="M110 40h110" opacity="0.5" strokeDasharray="4 3" />
    </>
  ),
  energy: (
    <>
      <path d="M120 10v24M120 34l-14 -4M120 34l14 -4" /><circle cx="120" cy="52" r="16" /><circle cx="120" cy="70" r="16" />
      <path d="M120 86v14M40 100H200M40 100v28M120 100v28M200 100v28" strokeWidth="2.2" />{[40, 120, 200].map((x) => <rect key={x} x={x - 12} y="116" width="24" height="16" />)}
    </>
  ),
} as const;
export type ElecArtName = keyof typeof arts;

export function ElecArt({ name, className }: { name: ElecArtName; className?: string }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className ?? "h-full w-full"}>
      {arts[name]}
    </svg>
  );
}

/** AutoCAD-style 2D environment (vector stand-in, not a screenshot). */
export function AutoCadTile() {
  return (
    <svg viewBox="0 0 240 150" fill="none" className="h-full w-full" aria-hidden strokeLinecap="round">
      <rect x="6.5" y="6.5" width="227" height="110" stroke="#7dd3fc" strokeOpacity="0.5" />
      <path d="M40 20v84M200 20v84M40 50h46M110 50h90M40 90h60M130 90h70" stroke="#7dd3fc" strokeWidth="1.4" /><circle cx="98" cy="50" r="5" stroke="#7dd3fc" />
      <path d="M150 30v40M130 50h40" stroke="#f8fafc" strokeOpacity="0.7" strokeWidth="0.8" /><rect x="144" y="44" width="12" height="12" stroke="#f8fafc" strokeOpacity="0.7" strokeWidth="0.8" />
      <rect x="6.5" y="124.5" width="227" height="18" stroke="#7dd3fc" strokeOpacity="0.4" /><text x="14" y="136" fill="#7dd3fc" fontSize="8" letterSpacing="1" style={mono}>COMMAND: LINE ▮</text>
    </svg>
  );
}

/** Revit-style BIM coordination environment (vector stand-in). */
export function RevitTile() {
  return (
    <svg viewBox="0 0 240 150" fill="none" className="h-full w-full" aria-hidden strokeLinecap="round" strokeLinejoin="round">
      <rect x="6.5" y="6.5" width="60" height="136" stroke="#7dd3fc" strokeOpacity="0.4" />
      {[22, 40, 58, 76].map((y) => <g key={y}><rect x="14" y={y} width="7" height="7" stroke="#7dd3fc" /><path d={`M26 ${y + 4}h30`} stroke="#7dd3fc" strokeOpacity="0.5" /></g>)}
      <path d="M90 108l50 -22 50 22 -50 22z" stroke="#7dd3fc" strokeOpacity="0.5" /><path d="M90 78l50 -22 50 22 -50 22z" stroke="#a8b8c8" strokeOpacity="0.8" /><path d="M90 48l50 -22 50 22 -50 22z" stroke="#7dd3fc" />
      <path d="M110 100l60 26" stroke="#22c55e" strokeWidth="2" />
    </svg>
  );
}

/** Final package: documents fly into one organised set. */
export function ElecPackage({ className }: { className?: string }) {
  const items = [
    { x: 14, y: 20, fx: "-170px", fy: "-60px", n: <Sld showLabels={false} />, label: "SLD" },
    { x: 184, y: 20, fx: "0px", fy: "-90px", n: <ElecSchematic />, label: "SCHEMATIC" },
    { x: 354, y: 20, fx: "170px", fy: "-60px", n: <PanelLayout />, label: "PANEL" },
    { x: 99, y: 150, fx: "-110px", fy: "90px", n: <AsBuilt split={0.5} showMarkers={false} />, label: "AS-BUILT" },
    { x: 269, y: 150, fx: "110px", fy: "90px", n: <Sld revision={2} showLabels={false} />, label: "SCHEDULE / REV" },
  ];
  return (
    <svg viewBox="0 0 540 330" fill="none" className={className} role="img" aria-label="A single-line diagram, schematic, panel layout, as-built and schedule gathered into one document package">
      <rect x="0.5" y="0.5" width="539" height="329" stroke="#83aed3" strokeOpacity="0.25" />
      {items.map((it, i) => (
        <g key={it.label} transform={`translate(${it.x + 6} ${it.y + 14})`}>
          <g className="fly" style={{ "--fx": it.fx, "--fy": it.fy, "--d": `${i * 160}ms` } as React.CSSProperties}>
            <rect width="156" height="104" className="fill-ink-950" stroke="#7dd3fc" strokeOpacity="0.6" />
            <svg x="2" y="2" width="152" height="100" viewBox="0 0 640 420" preserveAspectRatio="xMidYMid meet">{it.n}</svg>
            <text x="6" y="118" fill="#7dd3fc" fontSize="8" letterSpacing="1" style={mono}>{it.label}</text>
          </g>
        </g>
      ))}
      <g className="fade-in" style={d(1600)}>
        <rect x="20" y="306" width="500" height="1" fill="#d68a51" opacity="0.4" />
        <text x="270" y="322" textAnchor="middle" fill="#d68a51" fontSize="9" letterSpacing="1.6" style={mono}>ORGANISED DOCUMENT PACKAGE · REVISION CONTROLLED</text>
      </g>
    </svg>
  );
}
