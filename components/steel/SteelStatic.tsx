import { SteelFrame } from "@/components/structural/SteelFrame";
import { ShopDiagram } from "@/components/svg/StructDiagrams";
import { makeIso, boxPath, seg } from "@/components/svg/iso";
import { PortalFrame, PlatformStructure, MultiStoreyFrame, MiningStructure } from "@/components/svg/StructScenes";

const d = (ms: number, t?: string) =>
  ({ "--d": `${ms}ms`, ...(t ? { "--t": t } : {}) }) as React.CSSProperties;
const mono = { fontFamily: "var(--font-mono)" } as const;
const S = "#7dd3fc";

/** Steel model at the centre, four documentation outputs around it. */
export function SteelHub({ className }: { className?: string }) {
  const nodes = [
    { label: "MEMBER DRAWINGS", x: 130, y: 70 },
    { label: "CONNECTION DETAILS", x: 510, y: 70 },
    { label: "BOLT DETAILS", x: 130, y: 310 },
    { label: "ERECTION DRAWINGS", x: 510, y: 310 },
  ];
  return (
    <svg viewBox="0 0 640 380" fill="none" className={className} role="img" aria-label="Structural steel model connected to member drawings, connection details, bolt details and erection drawings">
      {nodes.map((n, i) => (
        <g key={n.label} className="text-sky-300">
          <path d={`M320 190L${n.x} ${n.y}`} stroke={S} strokeWidth="1" pathLength={1} className="draw" style={d(300 + i * 200, "1.2s")} />
          <path d={`M320 190L${n.x} ${n.y}`} stroke="#d68a51" strokeWidth="1.2" className="rch-flow fade-in" style={d(1500 + i * 120)} />
          <g className="fade-in" style={d(700 + i * 200)}>
            <rect x={n.x - 80} y={n.y - 18} width="160" height="36" className="fill-ink-950" stroke={S} strokeOpacity="0.7" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fill={S} fontSize="10" letterSpacing="1.2" style={mono}>{n.label}</text>
          </g>
        </g>
      ))}
      <rect x="220" y="110" width="200" height="160" className="fill-ink-950" stroke={S} strokeOpacity="0.5" />
      <svg x="224" y="114" width="192" height="140" viewBox="40 60 600 440"><SteelFrame detail={0} cx={340} /></svg>
      <text x="320" y="264" textAnchor="middle" fill={S} fontSize="9" letterSpacing="1.4" style={mono}>STRUCTURAL STEEL MODEL</text>
    </svg>
  );
}

/** Large shop drawing sheet, drawn in stages, with a simulated cursor. */
export function ShopDrawingSheet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 880 440" fill="none" className={className} role="img" aria-label="Shop drawing sheet for one steel member with outline, dimensions, holes, piece mark, connection callouts, weld symbols and a revision marker" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10.5" y="10.5" width="859" height="419" stroke={S} strokeOpacity="0.45" />
      <g stroke={S} strokeWidth="1.8">
        {/* 1 outline */}
        <path d="M80 170h640v80H80zM80 190h640M80 230h640" pathLength={1} className="draw" style={d(0, "1.4s")} />
        <path d="M66 156v108M66 156h14M66 264h14M734 156v108M734 156h-14M734 264h-14" strokeWidth="1.2" opacity="0.8" pathLength={1} className="draw" style={d(600, "1s")} />
      </g>
      {/* 2 dimensions */}
      <g stroke="#d68a51" strokeWidth="1" className="fade-in" style={d(1500)}>
        <path d="M80 310h640M80 302v16M720 302v16" />
        <text x="372" y="334" fill="#d68a51" stroke="none" fontSize="12" style={mono}>4 800</text>
        <path d="M770 170v80M762 170h16M762 250h16" /><text x="780" y="214" fill="#d68a51" stroke="none" fontSize="11" style={mono}>300</text>
        <path d="M80 130h60M80 124v12M140 124v12" /><text x="92" y="122" fill="#d68a51" stroke="none" fontSize="10" style={mono}>60</text>
      </g>
      {/* 3 holes */}
      <g stroke={S} strokeWidth="1.4" className="fade-in" style={d(2200)}>
        {[[116, 205], [116, 215], [116, 225], [684, 205], [684, 215], [684, 225]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" className="fill-ink-950" />)}
        <path d="M140 160v90M660 160v90" strokeDasharray="6 3 1 3" opacity="0.6" />
      </g>
      {/* 4 piece mark */}
      <g className="fade-in" style={d(2900)} fill={S}>
        <circle cx="650" cy="100" r="26" className="fill-ink-950" stroke={S} strokeWidth="1.5" />
        <text x="650" y="104" textAnchor="middle" fontSize="13" style={mono}>B-104</text>
        <path d="M650 126V170" stroke={S} strokeWidth="1.2" />
        <text x="100" y="60" fontSize="11" letterSpacing="1.2" style={mono}>MATERIAL · UB 305 · S355 · AS SPECIFIED</text>
        <text x="100" y="80" fontSize="10" letterSpacing="1.2" opacity="0.8" style={mono}>MEMBER REF · BEAM · LEVEL 01 · GRID A / 04</text>
      </g>
      {/* 5 connection callouts + weld */}
      <g className="fade-in" style={d(3600)}>
        <circle cx="86" cy="210" r="46" stroke="#d68a51" strokeWidth="1.2" strokeDasharray="4 3" />
        <path d="M130 180L220 120h110" stroke="#d68a51" strokeWidth="1.2" />
        <text x="340" y="122" fill="#d68a51" fontSize="11" letterSpacing="1.2" style={mono}>DETAIL A · END PLATE · 4 BOLTS</text>
        <g stroke="#d68a51" strokeWidth="1.3" fill="none"><path d="M610 250l30 40h60" /><path d="M610 250l-5 -9h10z" fill="#d68a51" /></g>
        <text x="650" y="284" fill="#d68a51" fontSize="10.5" style={mono}>▲ FW 6 · ALL ROUND</text>
      </g>
      {/* 6 revision + title block */}
      <g className="fade-in" style={d(4300)}>
        <path d="M760 70h70v30h-70z" stroke="#d68a51" strokeWidth="1.2" />
        <text x="768" y="90" fill="#d68a51" fontSize="11" style={mono}>REV B ▲</text>
        <rect x="10.5" y="360.5" width="859" height="69" stroke={S} strokeOpacity="0.5" />
        <path d="M300 360v69M520 360v69M700 360v69M10 395h859" stroke={S} strokeOpacity="0.35" />
        <g fill={S} fontSize="10" letterSpacing="1.2" style={mono}>
          <text x="24" y="382">SHOP DRAWING · S-104</text><text x="314" y="382">PIECE B-104</text><text x="534" y="382">STATUS</text><text x="714" y="382">DRAWN · CHECKED</text>
          <text x="24" y="418" opacity="0.7">ILLUSTRATIVE SHEET</text><text x="534" y="418" fill="#d68a51">FOR CONSTRUCTION</text>
        </g>
      </g>
      {/* simulated cursor */}
      <g className="cursor-sim" aria-hidden>
        <path d="M0 0l12 28 4-11 11-4z" fill="#f8fafc" opacity="0.85" />
      </g>
    </svg>
  );
}

function OptionA() {
  return (
    <g stroke={S} strokeWidth="1.5">
      <path d="M40 30h40v200H40z" /><path d="M80 90h120v60H80z" />
      <rect x="80" y="80" width="10" height="80" className="fill-sky-400/25" />
      <path d="M80 150l30 40h60" /><path d="M80 90l30 -40h60" />
      <rect x="110" y="178" width="60" height="12" className="fill-sky-400/20" /><rect x="110" y="50" width="60" height="12" className="fill-sky-400/20" />
      {[[85, 95], [85, 115], [85, 135], [85, 155]].map(([x, y], i) => <circle key={i} cx={x} cy={y - 8} r="2.6" />)}
      <g stroke="#d68a51" fill="#d68a51" fillOpacity="0.3"><path d="M90 80l-8 -7h16zM90 160l-8 7h16zM110 190l-8 7h16zM110 62l-8 -7h16z" /></g>
    </g>
  );
}
function OptionB() {
  return (
    <g stroke={S} strokeWidth="1.5">
      <path d="M40 30h40v200H40z" /><path d="M80 90h120v60H80z" />
      <rect x="80" y="84" width="10" height="72" className="fill-sky-400/25" />
      {[[85, 95], [85, 115], [85, 135], [85, 155]].map(([x, y], i) => <circle key={i} cx={x} cy={y - 8} r="2.6" />)}
      <g stroke="#d68a51" fill="#d68a51" fillOpacity="0.3"><path d="M90 84l-8 -7h16zM90 156l-8 7h16z" /></g>
    </g>
  );
}

const bars: [string, number, number][] = [["CUTS", 4, 2], ["WELDS", 6, 3], ["PLATES", 3, 1], ["BOLTS", 4, 4], ["ASSEMBLY", 5, 3]];

/** Two connection options with a rough fabrication-step comparison. Illustrative; never a general rule. */
export function FabPracticality({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 880 330" fill="none" className={className} role="img" aria-label="Two illustrative connection options compared by cuts, welds, plates, bolts and assembly steps, with an engineer review step">
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${k * 440} 0)`}>
          <rect x="10.5" y="10.5" width="420" height="290" stroke={S} strokeOpacity={k ? 0.5 : 0.3} />
          <text x="26" y="34" fill={k ? "#34d399" : "#a8b8c8"} fontSize="11" letterSpacing="1.6" style={mono}>{k ? "OPTION B · SIMPLIFIED" : "OPTION A · MORE STEPS"}</text>
          <g transform="translate(20 40)" className="text-sky-300">{k ? <OptionB /> : <OptionA />}</g>
          <g transform="translate(240 70)">
            {bars.map(([label, a, b], i) => (
              <g key={label} transform={`translate(0 ${i * 38})`}>
                <text y="10" fill="#a8b8c8" fontSize="9" letterSpacing="1" style={mono}>{label}</text>
                <rect y="16" width={(k ? b : a) * 22} height="8" fill={k ? "#34d399" : "#7dd3fc"} fillOpacity="0.7" className="fade-in" style={d(600 + i * 150)} />
              </g>
            ))}
          </g>
        </g>
      ))}
      <g className="fade-in" style={d(1800)}>
        <rect x="320" y="306" width="240" height="22" className="fill-ink-950" stroke="#d68a51" />
        <text x="440" y="321" textAnchor="middle" fill="#d68a51" fontSize="10" letterSpacing="1.4" style={mono}>⚑ ENGINEER REVIEW</text>
      </g>
    </svg>
  );
}

/** Tekla-style 3D model on the left, AutoCAD-style 2D drawing on the right, a member moving between them. */
export function ToolsWorkflow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 880 340" fill="none" className={className} role="img" aria-label="A steel member moving from a 3D steel model to a 2D shop drawing" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10.5" y="10.5" width="400" height="319" stroke={S} strokeOpacity="0.4" />
      <text x="26" y="34" fill={S} fontSize="10.5" letterSpacing="1.6" style={mono}>3D MODEL · CONNECTIONS · PIECE MARKS</text>
      <svg x="20" y="44" width="380" height="270" viewBox="40 60 600 440" className="text-sky-300"><SteelFrame detail={1} marks={["B-104", "C-01"]} /></svg>
      <rect x="470.5" y="10.5" width="400" height="319" stroke={S} strokeOpacity="0.4" />
      <text x="486" y="34" fill={S} fontSize="10.5" letterSpacing="1.6" style={mono}>2D SHOP DRAWING · DIMENSIONS · DETAILS</text>
      <svg x="480" y="44" width="380" height="270" viewBox="0 0 320 220"><ShopDiagram /></svg>
      <g className="travel" style={{ "--tx": "200px", "--ty": "0px", "--d": "800ms" } as React.CSSProperties}>
        <g transform="translate(330 160)">
          <rect width="60" height="14" className="fill-ink-950" stroke="#d68a51" strokeWidth="1.6" />
          <path d="M0 5h60M0 9h60" stroke="#d68a51" strokeWidth="0.8" />
          <text x="30" y="30" textAnchor="middle" fill="#d68a51" fontSize="9" style={mono}>B-104</text>
        </g>
      </g>
      <g className="fade-in text-copper-400" style={d(600)}>
        <path d="M418 170h44m-6 -4l6 4-6 4" stroke="currentColor" strokeWidth="1.3" className="rch-flow" />
      </g>
    </svg>
  );
}

/** Fabrication shop → site erection, with one member travelling through. */
export function FabToSite({ className }: { className?: string }) {
  const shop = ["CUTTING", "DRILLING", "WELDING", "PIECE MARKING"];
  const site = ["DELIVERY", "POSITIONING", "BOLTING", "ASSEMBLY"];
  const col = (items: string[], x: number, title: string, border: string) => (
    <g>
      <rect x={x + 0.5} y="10.5" width="400" height="279" stroke={border} strokeOpacity="0.5" />
      <text x={x + 16} y="34" fill={S} fontSize="10.5" letterSpacing="1.6" style={mono}>{title}</text>
      {items.map((t, i) => (
        <g key={t} className="fade-in" style={d(i * 250)} transform={`translate(${x + 16} ${56 + i * 56})`}>
          <rect width="368" height="42" className="fill-ink-950" stroke={S} strokeOpacity="0.4" />
          <text x="14" y="18" fill="#d68a51" fontSize="9" style={mono}>{String(i + 1).padStart(2, "0")}</text>
          <text x="14" y="33" fill={S} fontSize="11" letterSpacing="1.2" style={mono}>{t}</text>
          <path d={`M280 21h${60 - i * 12}`} stroke={S} strokeOpacity="0.5" strokeWidth="3" />
        </g>
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 880 300" fill="none" className={className} role="img" aria-label="A steel member passing from cutting, drilling, welding and piece marking in the shop to delivery, positioning, bolting and assembly on site" strokeLinecap="round" strokeLinejoin="round">
      {col(shop, 10, "FABRICATION SHOP", "#83aed3")}
      {col(site, 470, "SITE ERECTION", "#7dd3fc")}
      <g className="travel" style={{ "--tx": "480px", "--ty": "0px", "--d": "400ms" } as React.CSSProperties}>
        <g transform="translate(-4 144)">
          <rect width="66" height="14" className="fill-ink-950" stroke="#d68a51" strokeWidth="1.6" />
          <text x="33" y="30" textAnchor="middle" fill="#d68a51" fontSize="9" style={mono}>B-104</text>
        </g>
      </g>
    </svg>
  );
}

const scene = (k: number) => {
  switch (k) {
    case 0: {
      const p = makeIso(110, 40, 6);
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          {[0, 1, 2].map((i) => <path key={i} d={boxPath(p, 0, i * 5, 0, 18, i * 5 + 2, 1.4)} />)}
          <path d={boxPath(p, 22, 0, 0, 24, 12, 7)} strokeDasharray="3 3" opacity="0.7" />
          <path d={seg(p(0, 0, 3), p(18, 0, 3))} opacity="0.4" />
        </g>
      );
    }
    case 1: return <PortalFrame ox={100} oy={60} s={6.5} />;
    case 2: return <PlatformStructure ox={50} oy={62} s={7.5} />;
    case 3: return <MiningStructure ox={50} oy={80} s={6.8} />;
    case 4: return <MultiStoreyFrame ox={90} oy={52} s={7} />;
    default: return <MultiStoreyFrame ox={92} oy={60} s={6.2} />;
  }
};
export const SCENE_LABELS = ["Fabrication shop", "Warehouse", "Platform & walkway", "Mining / processing", "Commercial building", "Multi-storey frame"];

export function SteelScene({ k, className }: { k: number; className?: string }) {
  return <svg viewBox="0 0 240 150" fill="none" className={className} aria-hidden>{scene(k)}</svg>;
}
