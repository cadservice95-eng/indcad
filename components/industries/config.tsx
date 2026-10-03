import type { ReactNode } from "react";

export type CapKey = "mech" | "struct" | "civil" | "elec" | "cad3d" | "bim" | "docs";
export const CAP_ROWS: { k: CapKey; label: string }[] = [
  { k: "mech", label: "Mechanical Drafting" }, { k: "struct", label: "Structural Drafting" }, { k: "civil", label: "Civil Drafting" }, { k: "elec", label: "Electrical Drafting" },
  { k: "cad3d", label: "3D CAD Modelling" }, { k: "bim", label: "BIM" }, { k: "docs", label: "Documentation" },
];

/** Single source for the directory UI. Names, descriptions and software come from data/industries.ts; this adds the capability map. */
export const IND_CONFIG: Record<string, { label: string; tags: string[]; caps: CapKey[]; build: string; finalStage: string }> = {
  construction: { label: "Construction", tags: ["Drafting", "BIM coordination", "Construction documentation"], caps: ["bim", "docs"], build: "Buildings", finalStage: "Construction Documentation" },
  manufacturing: { label: "Manufacturing", tags: ["Mechanical drafting", "3D CAD modelling", "Manufacturing documentation"], caps: ["mech", "cad3d", "docs"], build: "Industrial equipment", finalStage: "Manufacturing Documentation" },
  mining: { label: "Mining", tags: ["Structural drafting", "Mechanical drafting", "Civil drafting"], caps: ["struct", "mech", "civil"], build: "Mining infrastructure", finalStage: "Project / Site Documentation" },
  "oil-gas": { label: "Oil & Gas", tags: ["Piping", "Mechanical drafting", "Structural drafting"], caps: ["mech", "struct"], build: "Facilities & infrastructure", finalStage: "Facility Documentation" },
  automotive: { label: "Automotive", tags: ["3D CAD modelling", "Mechanical drafting"], caps: ["cad3d", "mech"], build: "Vehicle components", finalStage: "Component Documentation" },
  defence: { label: "Defence", tags: ["Mechanical drafting", "Structural drafting"], caps: ["mech", "struct"], build: "Defence manufacturing", finalStage: "Manufacturing Documentation" },
  aerospace: { label: "Aerospace", tags: ["3D CAD modelling", "Mechanical drafting"], caps: ["cad3d", "mech"], build: "Aerospace components", finalStage: "Component / Tooling Documentation" },
  energy: { label: "Energy", tags: ["Structural drafting", "Electrical drafting", "Civil drafting"], caps: ["struct", "elec", "civil"], build: "Energy infrastructure", finalStage: "Infrastructure Documentation" },
};

const L = "#7DD3FC", Lt = "#E2E8F0", A = "#F59E0B";
/** Simplified technical illustrations (240 × 150). */
export function artShapes(slug: string): ReactNode {
  const p = { fill: "none", stroke: L, strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (slug) {
    case "construction": return (<g {...p}><path d="M60 128V30h120v98M60 128h120M60 54h120M60 80h120M60 104h120M100 30v98M140 30v98" /><path d="M60 54l40 26M140 80l40 24" stroke={A} /><path d="M30 128h180" stroke={Lt} /><path d="M104 106c14 0 22 -10 36 -10" stroke="#2DD4BF" /></g>);
    case "manufacturing": return (<g {...p}><path d="M40 118h160M50 118V70h100v48" /><circle cx="170" cy="86" r="22" /><circle cx="170" cy="86" r="8" /><rect x="64" y="44" width="44" height="26" /><path d="M108 57h20M150 86h-0" /><path d="M64 94h72" stroke={Lt} strokeDasharray="4 3" /></g>);
    case "mining": return (<g {...p}><path d="M30 120l60 -60M90 60h60M150 60l40 60" /><path d="M20 120h200" stroke={Lt} /><path d="M100 120V80h40v40M60 120V92M180 120V96" /><rect x="96" y="44" width="48" height="16" stroke={A} /><path d="M30 90h50" strokeDasharray="5 3" /></g>);
    case "oil-gas": return (<g {...p}><ellipse cx="62" cy="64" rx="26" ry="8" /><path d="M36 64v54h52V64" /><ellipse cx="62" cy="118" rx="26" ry="8" /><path d="M88 80h50v-26h48M138 80v38M186 54v64" stroke="#2DD4BF" strokeWidth="2.4" /><path d="M120 120h90M130 120V96M200 120V96" stroke={Lt} /></g>);
    case "automotive": return (<g {...p}><circle cx="120" cy="76" r="44" /><circle cx="120" cy="76" r="14" /><circle cx="120" cy="76" r="30" strokeDasharray="4 3" />{[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={120 + Math.cos((a * Math.PI) / 180) * 30} cy={76 + Math.sin((a * Math.PI) / 180) * 30} r="3.5" stroke={A} />)}<path d="M60 130h120" stroke={Lt} /></g>);
    case "defence": return (<g {...p}><path d="M50 108V50h60l20 20h60v38z" /><circle cx="84" cy="80" r="10" /><circle cx="150" cy="86" r="8" /><circle cx="180" cy="86" r="8" /><path d="M40 118h160" stroke={Lt} /><path d="M50 40v-0M110 50V36M130 70V36" stroke={A} strokeDasharray="3 3" /></g>);
    case "aerospace": return (<g {...p}><path d="M30 100c30 -50 100 -70 180 -50-10 30 -80 60 -180 50z" /><path d="M60 94c20 -30 70 -44 124 -34M90 104c14 -20 50 -34 90 -30" stroke={Lt} /><path d="M30 120h180" stroke={Lt} strokeDasharray="4 3" /><circle cx="196" cy="56" r="3" stroke={A} /></g>);
    default: return (<g {...p}><path d="M120 18l-40 100M120 18l40 100M92 78h56M102 50h36M60 118h120" /><path d="M20 118h200" stroke={Lt} /><rect x="176" y="92" width="34" height="26" stroke={A} /><path d="M160 118V104h16" stroke="#2DD4BF" /><path d="M30 60q20 -16 40 0" stroke="#2DD4BF" /></g>);
  }
}

export function IndustryArt({ slug, name, className }: { slug: string; name: string; className?: string }) {
  return (
    <svg viewBox="0 0 240 150" className={className} role="img" aria-label={`${name}: simplified technical illustration`}>
      <title>{name}</title>
      <rect width="240" height="150" fill="#0B1B33" />
      <g opacity="0.12" stroke="#7DD3FC">{Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 24} 0V150`} />)}{Array.from({ length: 7 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 25}H240`} />)}</g>
      {artShapes(slug)}
    </svg>
  );
}
