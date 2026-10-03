import { ParametricPart } from "./ParametricPart";
import { ExplodedParts } from "./ExplodedParts";
import { makeIso, boxPath, cylinder } from "./iso";

const m = makeIso(150, 96, 2.4);

/** Single component. */
export function PartLayer() {
  return (
    <svg viewBox="0 0 300 210" fill="none" className="aspect-[300/210] h-auto w-full" aria-hidden>
      <ParametricPart cx={150} cy={80} s={1.15} />
    </svg>
  );
}

/** Multi-part assembly (exploded). */
export function AssemblyLayer() {
  return (
    <svg viewBox="30 -10 280 360" fill="none" className="aspect-[300/210] h-full w-full" aria-hidden preserveAspectRatio="xMidYMid meet">
      <g>
        <ExplodedParts balloons={false} />
      </g>
    </svg>
  );
}

/** Complete machine: frame, process units, conveyor and tank. */
export function MachineLayer() {
  return (
    <svg viewBox="0 0 300 210" fill="none" className="aspect-[300/210] h-auto w-full text-sky-300" aria-hidden strokeLinejoin="round">
      <g stroke="currentColor" strokeWidth="1.3">
        <path d={boxPath(m, 0, 0, 0, 40, 18, 3)} className="fill-sky-400/10" />
        <path d={cylinder(m, 6, 6, 3, 18, 3.6, 2.4)} className="fill-ink-950" />
        <path d={boxPath(m, 14, 2, 3, 28, 14, 14)} className="fill-sky-400/15" />
        <path d={boxPath(m, 31, 3, 3, 38, 12, 11)} className="fill-sky-400/15" />
        <path d={boxPath(m, 2, 20, 2, 38, 26, 5)} className="fill-ink-950" />
        <path d={boxPath(m, 8, 21, 5, 13, 25, 9)} className="fill-sky-400/15" />
        <path d={boxPath(m, 24, 21, 5, 29, 25, 9)} className="fill-sky-400/15" />
      </g>
    </svg>
  );
}
