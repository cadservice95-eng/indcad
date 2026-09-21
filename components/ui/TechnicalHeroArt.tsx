/**
 * Original inline-SVG line art evoking a CAD/technical drawing sheet —
 * used in place of stock photography in the hero and other feature panels.
 */
export function TechnicalHeroArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 760 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Isometric line drawing of a fabricated bracket assembly with dimension annotations, representing mechanical CAD drafting"
    >
      <rect x="0.5" y="0.5" width="759" height="619" rx="2" stroke="#4a86bb" strokeOpacity="0.35" />

      {/* isometric bracket assembly */}
      <g stroke="#dbe7f2" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M180 360 L340 270 L500 360 L500 460 L340 550 L180 460 Z" />
        <path d="M180 360 L340 450 L500 360" />
        <path d="M340 450 L340 550" />
        <path d="M340 270 L340 370" opacity="0.5" />
        <path d="M240 325 L240 425 L300 460" opacity="0.7" />
        <path d="M420 325 L420 425 L360 460" opacity="0.7" />
        <circle cx="340" cy="410" r="26" opacity="0.85" />
        <circle cx="340" cy="410" r="10" opacity="0.85" />
      </g>

      {/* dimension lines */}
      <g stroke="#c16a2f" strokeWidth="1" strokeLinecap="round">
        <path d="M180 480 L180 500" />
        <path d="M500 480 L500 500" />
        <path d="M180 495 L500 495" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
        <path d="M120 360 L100 360" />
        <path d="M120 460 L100 460" />
        <path d="M105 360 L105 460" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
      </g>
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#c16a2f" />
        </marker>
      </defs>

      <g fill="#83aed3" fontFamily="ui-monospace, monospace" fontSize="13" letterSpacing="0.5">
        <text x="300" y="518">320</text>
        <text x="70" y="415" transform="rotate(-90 70 415)">240</text>
        <text x="358" y="416">⌀20</text>
        <text x="358" y="436">R13</text>
      </g>

      {/* faint blueprint grid */}
      <g stroke="#dbe7f2" strokeOpacity="0.12">
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 42} y1={0} x2={i * 42} y2={620} />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={`h-${i}`} x1={0} y1={i * 42} x2={760} y2={i * 42} />
        ))}
      </g>

      {/* title-block strip */}
      <g stroke="#4a86bb" strokeOpacity="0.5">
        <line x1="0" y1="560" x2="760" y2="560" />
        <line x1="560" y1="560" x2="560" y2="620" />
        <line x1="660" y1="560" x2="660" y2="620" />
      </g>
      <g fill="#83aed3" fontFamily="ui-monospace, monospace" fontSize="11">
        <text x="24" y="595">DRG NO. RC-4471-B</text>
        <text x="580" y="583">SCALE</text>
        <text x="580" y="602">1:5</text>
        <text x="676" y="583">REV</text>
        <text x="676" y="602">C</text>
      </g>
    </svg>
  );
}
