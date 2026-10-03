import { cn } from "@/lib/utils";

/** Civil line icons (48×48). Moving parts use .ico-* classes (hover on a `group` ancestor). */
const icons = {
  survey: (
    <>
      <path d="M24 6v10M24 16l-10 26M24 16l10 26M16 32h16" />
      <circle cx="24" cy="6" r="2.4" />
      <path d="M8 40h6M34 40h6" opacity="0.5" />
    </>
  ),
  land: (
    <>
      <path d="M4 34c8-10 14-14 20-12s12-2 20-10" />
      <path d="M4 42c8-10 14-14 20-12s12-2 20-10" opacity="0.5" />
      <circle cx="24" cy="22" r="2" fill="currentColor" stroke="none" className="ico-lift" />
    </>
  ),
  site: (
    <>
      <path d="M6 10h36v28H6z" strokeDasharray="4 2 1 2" />
      <path d="M12 16h10v8H12zM26 16h10v8H26zM12 28h10v6H12z" />
      <path d="M26 30h10" className="ico-shift" />
    </>
  ),
  grading: (
    <>
      <path d="M4 36l14-12 8 6 18-14" />
      <path d="M4 42h40" opacity="0.5" />
      <path d="M30 12l8 4-4 8" className="ico-shift" />
    </>
  ),
  drainage: (
    <>
      <path d="M6 14h10v8h12v8h14" />
      <rect x="4" y="11" width="6" height="6" />
      <rect x="25" y="19" width="6" height="6" />
      <path d="M38 26l6 4-6 4" className="ico-shift" />
    </>
  ),
  road: (
    <>
      <path d="M16 6C14 18 10 28 4 42M32 6c2 12 6 22 12 36" />
      <path d="M24 8v6M24 20v6M24 32v6" strokeDasharray="1 0" className="ico-lift" />
    </>
  ),
  construction: (
    <>
      <path d="M6 42h36M10 42V24l8-6v24M30 42V12h8M30 12l-12 6" />
      <path d="M38 12v10" className="ico-lift" />
    </>
  ),
  surface: (
    <>
      <path d="M4 30l10-8 10 4 10-10 10 6v10l-10 4-10-4-10 6-10-4z" />
      <path d="M14 22v10M24 26v10M34 16v14" opacity="0.5" />
    </>
  ),
  services: (
    <>
      <path d="M6 14h36M6 24h36M6 34h36" strokeDasharray="2 3" />
      <circle cx="16" cy="14" r="2" /><circle cx="30" cy="24" r="2" /><circle cx="22" cy="34" r="2" />
    </>
  ),
  erosion: (
    <>
      <path d="M6 34c8-4 16-4 36 0" />
      <path d="M10 38v-8M18 38v-8M26 38v-8M34 38v-8" opacity="0.6" />
      <path d="M12 22l6-6 6 6 6-6 6 6" className="ico-shift" />
    </>
  ),
  plan: (
    <>
      <path d="M8 6h32v36H8z" />
      <path d="M14 14h14v10H14zM14 30h20M14 35h12" />
      <path d="M32 14h4" className="ico-shift" />
    </>
  ),
} as const;

export type CivilIconName = keyof typeof icons;

export function CivilIcon({ name, className }: { name: CivilIconName; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("h-11 w-11", className)}>
      {icons[name]}
    </svg>
  );
}

/** 240×150 technical vignettes for application, industry and project cards. */
const arts = {
  subdivision: (
    <>
      <path d="M10 70C60 40 120 100 230 60" opacity="0.9" />
      <path d="M10 84C60 54 120 114 230 74" opacity="0.9" />
      <path d="M26 56l8-14 24 4-6 14M70 66l8-14 26 8-6 14M118 74l12-14 24 6-8 14M166 70l12-14 24 2-6 14" />
      <path d="M22 100l10 18 26-4-6-14M74 94l12 20 26-6-6-16M128 104l12 20 26-8-6-18M180 94l12 20 26-10" />
      <path d="M14 20L226 12 232 130 22 138z" strokeDasharray="6 3 1 3" opacity="0.5" />
    </>
  ),
  development: (
    <>
      <path d="M0 110c40-24 70-34 100-20s70-12 140-34" />
      <path d="M0 126c40-24 70-34 100-20s70-12 140-34" opacity="0.6" />
      <path d="M0 94c40-24 70-34 100-20s70-12 140-34" opacity="0.4" />
      <path d="M40 40h60v38H40z" strokeDasharray="6 3 1 3" />
      <path d="M52 52h16v12H52zM76 52h16v12H76z" opacity="0.8" />
      <circle cx="190" cy="40" r="3" fill="currentColor" stroke="none" />
    </>
  ),
  road: (
    <>
      <path d="M6 120C70 110 80 40 130 50s70 40 108 8" />
      <path d="M6 138C74 128 86 62 130 70s64 40 108 12" />
      <path d="M6 129C72 119 83 51 130 60s67 40 108 10" strokeDasharray="8 7" opacity="0.7" />
      <path d="M60 138v-8M100 134v-8M150 78v-8M200 70v-8" opacity="0.6" />
    </>
  ),
  drainage: (
    <>
      <path d="M20 40h50v30h60v30h80" />
      <rect x="14" y="34" width="12" height="12" />
      <rect x="64" y="64" width="12" height="12" />
      <rect x="124" y="94" width="12" height="12" />
      <path d="M210 90l18 10-18 10z" fill="currentColor" />
      <path d="M20 40v-14M66 66V50" strokeDasharray="3 3" opacity="0.6" />
      <path d="M110 30l30 0M120 24l-10 6 10 6" className="ico-shift" opacity="0.7" />
    </>
  ),
  siteworks: (
    <>
      <path d="M20 30h200v90H20z" strokeDasharray="6 3 1 3" opacity="0.6" />
      <path d="M20 60h200M20 90h200" opacity="0.5" />
      <path d="M60 40l22 8-10 14M140 70l22 8-10 14M100 100l22-6-8-14" />
      <path d="M30 120l60-34 60 14 60-32" className="ico-lift" />
    </>
  ),
  infrastructure: (
    <>
      <path d="M10 112h220" />
      <path d="M40 112V60h40v52M130 112V40h30v72" />
      <path d="M80 70h50M160 56h50" />
      <path d="M200 56l24 56" opacity="0.6" />
      <path d="M10 130c40-8 80 8 120 0s70-8 100 0" opacity="0.5" />
    </>
  ),
  terrain: (
    <>
      <path d="M10 120l50-40 40-6 40-34 60 50 30 30z" />
      <path d="M40 98l30-10M70 88l30-26M110 62l26 18M150 86l30 20" opacity="0.6" />
      <path d="M10 134h220" opacity="0.5" />
    </>
  ),
  accessroad: (
    <>
      <path d="M0 128c50-16 70-50 110-60s90 4 130-22" />
      <path d="M0 144c52-16 72-52 112-62s88 6 128-22" />
      <path d="M30 118c40-30 60-60 100-70" strokeDasharray="3 4" opacity="0.7" />
      <rect x="150" y="30" width="12" height="12" />
      <path d="M156 42v26" strokeDasharray="3 3" opacity="0.7" />
    </>
  ),
} as const;

export type CivilArtName = keyof typeof arts;

export function CivilArt({ name, className }: { name: CivilArtName; className?: string }) {
  return (
    <svg viewBox="0 0 240 150" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("h-full w-full", className)}>
      {arts[name]}
    </svg>
  );
}
