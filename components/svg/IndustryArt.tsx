import { IsometricBuilding } from "./IsometricBuilding";
import { cn } from "@/lib/utils";

/**
 * Technical line illustrations (240×150) for the industry and project cards.
 * Drawn in currentColor; copper accents mark dimensions. Parts tagged
 * .ico-* animate on hover of a `group` ancestor.
 */

function gearPath(cx: number, cy: number, r: number, teeth: number, tooth = 6) {
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const w = (Math.PI / teeth) * 0.55;
    const items: [number, number][] = [
      [r, a - w * 1.2],
      [r + tooth, a - w * 0.7],
      [r + tooth, a + w * 0.7],
      [r, a + w * 1.2],
    ];
    for (const [rad, ang] of items) {
      pts.push(`${(cx + Math.cos(ang) * rad).toFixed(1)} ${(cy + Math.sin(ang) * rad).toFixed(1)}`);
    }
  }
  return `M${pts.join("L")}Z`;
}

function latticeTower() {
  const left = (y: number) => 96 + ((135 - y) * 16) / 110;
  const right = (y: number) => 144 - ((135 - y) * 16) / 110;
  const levels = [135, 115, 95, 75, 55, 35];
  let d = "";
  for (let i = 0; i < levels.length - 1; i++) {
    const a = levels[i];
    const b = levels[i + 1];
    d += `M${left(a).toFixed(1)} ${a}L${right(b).toFixed(1)} ${b}M${right(a).toFixed(1)} ${a}L${left(b).toFixed(1)} ${b}`;
    d += `M${left(b).toFixed(1)} ${b}H${right(b).toFixed(1)}`;
  }
  return d;
}

const arts = {
  construction: (
    <>
      <path d="M0 132H240" opacity="0.4" />
      <g className="art-zoom">
        <IsometricBuilding ox={104} oy={58} s={6} W={14} D={8} H={8} floors={4} bays={4} roofPlant={false} />
      </g>
      <path d="M200 132V40h26M200 40l-18 8M226 40v16" className="ico-lift" opacity="0.8" />
      <path d="M0 140H240" stroke="#c16a2f" opacity="0.7" strokeWidth="1" />
    </>
  ),
  manufacturing: (
    <>
      <path d={gearPath(92, 74, 30, 12, 7)} className="ico-spin" />
      <circle cx="92" cy="74" r="10" />
      <circle cx="92" cy="74" r="3" fill="currentColor" stroke="none" />
      <path d={gearPath(162, 100, 17, 8, 5)} className="ico-spin" opacity="0.8" />
      <circle cx="162" cy="100" r="5" />
      <path d="M32 134H152" stroke="#c16a2f" strokeWidth="1" />
      <path d="M32 129v10M152 129v10" stroke="#c16a2f" strokeWidth="1" />
      <path d="M192 40h32v22h-32z" opacity="0.55" />
      <path d="M198 46h20M198 52h14" opacity="0.5" />
    </>
  ),
  structural: (
    <>
      <path d="M24 60H216M24 100H216" />
      <path d="M24 100L48 60L72 100L96 60L120 100L144 60L168 100L192 60L216 100" />
      <path d="M24 60v40M216 60v40" />
      <path d="M24 100l-10 18h20zM216 100l-10 18h20z" opacity="0.8" />
      <path d="M0 118H240" opacity="0.4" />
      <path d="M24 40H216M24 34v12M216 34v12" stroke="#c16a2f" strokeWidth="1" />
      <path d="M120 100V60" className="ico-lift" opacity="0.5" />
    </>
  ),
  automotive: (
    <>
      <path d="M20 100V90Q20 80 36 77L70 72L90 52Q94 48 102 48H148Q156 48 162 54L184 74L208 80Q220 84 220 94V100" />
      <path d="M20 100H52M80 100H162M190 100H220" />
      <path d="M97 54L83 72H128V54ZM136 54V72H171L155 54Z" opacity="0.7" />
      <g className="ico-spin">
        <circle cx="66" cy="102" r="14" />
        <circle cx="66" cy="102" r="5" />
      </g>
      <g className="ico-spin">
        <circle cx="176" cy="102" r="14" />
        <circle cx="176" cy="102" r="5" />
      </g>
      <path d="M20 128H220M20 123v10M220 123v10" stroke="#c16a2f" strokeWidth="1" />
    </>
  ),
  mining: (
    <>
      <path d="M44 132L76 34M108 132L76 34" />
      <path d="M62 80H90M54 106H98M68 60H84" />
      <path d="M62 80L98 106M90 80L54 106" opacity="0.55" />
      <circle cx="76" cy="30" r="8" className="ico-spin" />
      <path d="M76 38V132" strokeDasharray="3 3" className="ico-lift" opacity="0.7" />
      <path d="M108 100L206 62" />
      <path d="M130 92v40M160 80v52M190 68v64" opacity="0.5" />
      <path d="M186 132L208 108L232 132" opacity="0.8" />
      <path d="M0 132H240" opacity="0.4" />
    </>
  ),
  energy: (
    <>
      <path d={latticeTower()} />
      <path d="M96 135L112 25M144 135L128 25M112 25L120 12L128 25" />
      <path d="M82 45H158M92 75H148" />
      <path d="M82 45v10M158 45v10M92 75v10M148 75v10" />
      <g className="ico-lift">
        <path d="M82 55Q40 66 0 62M158 55Q200 66 240 62M92 85Q50 94 0 90M148 85Q190 94 240 90" opacity="0.6" />
      </g>
      <path d="M0 135H240" opacity="0.4" />
    </>
  ),
  infrastructure: (
    <>
      <path d="M0 92H240M0 100H240" />
      <path d="M60 100V138M180 100V138" />
      <path d="M120 92V18" />
      <path d="M120 24L48 92M120 24L72 92M120 24L96 92M120 24L144 92M120 24L168 92M120 24L192 92" opacity="0.7" className="ico-lift" />
      <path d="M0 138H240" opacity="0.4" />
      <path d="M0 146Q30 142 60 146T120 146T180 146T240 146" opacity="0.4" />
    </>
  ),
  bim: (
    <>
      <path d="M0 132H240" opacity="0.4" />
      <g className="art-zoom">
        <IsometricBuilding ox={104} oy={58} s={6} W={14} D={8} H={8} floors={4} bays={4} detail="bim" roofPlant={false} />
      </g>
      <path d="M196 40h30v24h-30zM202 48h18M202 55h12" opacity="0.7" />
      <path d="M196 52L170 70" stroke="#c16a2f" strokeWidth="1" />
    </>
  ),
  industrial: (
    <>
      <path d="M30 50V108M90 50V108" />
      <ellipse cx="60" cy="50" rx="30" ry="8" />
      <path d="M30 108A30 8 0 0 0 90 108" />
      <path d="M44 66V96M60 68V98M76 66V96" opacity="0.4" />
      <path d="M90 90H150V58H200" />
      <path d="M142 70l16 14M142 84l16-14" className="ico-lift" />
      <circle cx="150" cy="77" r="2.5" />
      <circle cx="204" cy="58" r="14" className="ico-spin" />
      <path d="M204 44v28M190 58h28" opacity="0.5" className="ico-spin" />
      <path d="M0 122H240" opacity="0.4" />
    </>
  ),
} as const;

export type IndustryArtName = keyof typeof arts;

export function IndustryArt({ name, className }: { name: IndustryArtName; className?: string }) {
  return (
    <svg
      viewBox="0 0 240 150"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("h-full w-full", className)}
    >
      {arts[name]}
    </svg>
  );
}
