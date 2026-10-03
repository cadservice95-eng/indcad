import { makeIso, seg, boxPath } from "./iso";

type Props = { ox: number; oy: number; s: number; hl?: boolean };

const col = (hl?: boolean) => (hl ? "#d68a51" : "currentColor");

/** Warehouse portal frames with purlins. */
export function PortalFrame({ ox, oy, s, hl }: Props) {
  const p = makeIso(ox, oy, s);
  const ys = [0, 6, 12, 18];
  const frames = ys.map((y) => seg(p(0, y, 0), p(0, y, 6), p(6, y, 8), p(12, y, 6), p(12, y, 0))).join("");
  const purlins = [[0, 6], [3, 7], [9, 7], [12, 6]].map(([x, z]) => seg(p(x, 0, z), p(x, 18, z))).join("") + seg(p(6, 0, 8), p(6, 18, 8));
  const bracing = seg(p(0, 0, 0), p(0, 6, 6)) + seg(p(0, 6, 0), p(0, 0, 6)) + seg(p(12, 12, 0), p(12, 18, 6)) + seg(p(12, 18, 0), p(12, 12, 6));
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" stroke={col(hl)}>
      <path d={frames} strokeWidth="2" />
      <path d={purlins} strokeWidth="1" opacity="0.6" />
      <path d={bracing} strokeWidth="1" opacity="0.5" />
    </g>
  );
}

/** Industrial access platform with handrails and a stair. */
export function PlatformStructure({ ox, oy, s, hl }: Props) {
  const p = makeIso(ox, oy, s);
  const cols = [[0, 0], [10, 0], [10, 6], [0, 6]].map(([x, y]) => seg(p(x, y, 0), p(x, y, 5))).join("");
  const deck = boxPath(p, 0, 0, 5, 10, 6, 5.5);
  const brace = seg(p(0, 6, 0), p(10, 6, 5)) + seg(p(10, 6, 0), p(0, 6, 5));
  const posts = [0, 2.5, 5, 7.5, 10].map((x) => seg(p(x, 6, 5.5), p(x, 6, 7))).join("") + seg(p(0, 6, 7), p(10, 6, 7)) + seg(p(10, 6, 5.5), p(10, 6, 7)) + seg(p(10, 0, 7), p(10, 6, 7)) + seg(p(10, 3, 5.5), p(10, 3, 7));
  const stair = seg(p(10, 0, 5), p(14, 0, 0)) + seg(p(10, 1.2, 5), p(14, 1.2, 0)) + [1, 2, 3].map((i) => seg(p(10 + i, 0, 5 - 1.25 * i), p(10 + i, 1.2, 5 - 1.25 * i))).join("");
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" stroke={col(hl)}>
      <path d={cols} strokeWidth="2" />
      <path d={brace} strokeWidth="1" opacity="0.6" />
      <path d={deck} strokeWidth="1.8" />
      <path d={posts} strokeWidth="1" opacity="0.8" />
      <path d={stair} strokeWidth="1.2" />
    </g>
  );
}

/** Multi-storey frame. */
export function MultiStoreyFrame({ ox, oy, s, hl }: Props) {
  const p = makeIso(ox, oy, s);
  const xs = [0, 6, 12];
  const ys = [0, 6];
  const zs = [3, 6, 9];
  let d = "";
  for (const x of xs) for (const y of ys) d += seg(p(x, y, 0), p(x, y, 9));
  let b = "";
  for (const z of zs) {
    for (const y of ys) b += seg(p(0, y, z), p(12, y, z));
    for (const x of xs) b += seg(p(x, 0, z), p(x, 6, z));
  }
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" stroke={col(hl)}>
      <path d={d} strokeWidth="2.2" />
      <path d={b} strokeWidth="1.5" />
      <path d={seg(p(0, 6, 0), p(6, 6, 3)) + seg(p(6, 6, 0), p(0, 6, 3))} strokeWidth="1" opacity="0.6" />
    </g>
  );
}

/** Mining conveyor gantry: sloping truss on towers with a hopper. */
export function MiningStructure({ ox, oy, s, hl }: Props) {
  const p = makeIso(ox, oy, s);
  const top: [number, number][] = [[0, 2], [4, 3.5], [8, 5], [12, 6.5], [16, 8]];
  let d = seg(...top.map(([x, z]) => p(x, 0, z + 1.6))) + seg(...top.map(([x, z]) => p(x, 0, z)));
  for (let i = 0; i < top.length; i++) d += seg(p(top[i][0], 0, top[i][1]), p(top[i][0], 0, top[i][1] + 1.6));
  for (let i = 0; i < top.length - 1; i++) d += seg(p(top[i][0], 0, top[i][1]), p(top[i + 1][0], 0, top[i + 1][1] + 1.6));
  const towers = [4, 12].map((x) => {
    const z = top.find((t) => t[0] === x)![1];
    return seg(p(x - 1, -1, 0), p(x, 0, z)) + seg(p(x + 1, -1, 0), p(x, 0, z)) + seg(p(x - 1, 1, 0), p(x, 0, z)) + seg(p(x + 1, 1, 0), p(x, 0, z));
  }).join("");
  const hopper = boxPath(p, -4, -2, 0, 0, 2, 2.4);
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" stroke={col(hl)}>
      <path d={d} strokeWidth="1.5" />
      <path d={towers} strokeWidth="1.6" />
      <path d={hopper} strokeWidth="1.6" />
    </g>
  );
}

/** Steel pipe rack with pipes. */
export function PipeRack({ ox, oy, s, hl }: Props) {
  const p = makeIso(ox, oy, s);
  const bents = [0, 6, 12, 18];
  let d = "";
  for (const y of bents) d += seg(p(0, y, 0), p(0, y, 6)) + seg(p(5, y, 0), p(5, y, 6)) + seg(p(0, y, 3), p(5, y, 3)) + seg(p(0, y, 6), p(5, y, 6));
  const pipes = [1, 2.5, 4].map((x) => seg(p(x, 0, 6.3), p(x, 18, 6.3))).join("");
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" stroke={col(hl)}>
      <path d={d} strokeWidth="1.7" />
      <path d={pipes} strokeWidth="2.6" opacity="0.8" />
    </g>
  );
}

/** Existing frame (dashed) with new strengthening members (highlighted). */
export function BrownfieldMod({ ox, oy, s, hl }: Props) {
  const p = makeIso(ox, oy, s);
  let ex = "";
  for (const x of [0, 6, 12]) ex += seg(p(x, 0, 0), p(x, 0, 6)) + seg(p(x, 6, 0), p(x, 6, 6));
  ex += seg(p(0, 0, 6), p(12, 0, 6)) + seg(p(0, 6, 6), p(12, 6, 6)) + seg(p(0, 0, 3), p(12, 0, 3));
  const added = seg(p(0, 0, 0), p(6, 0, 3)) + seg(p(6, 0, 0), p(0, 0, 3)) + seg(p(6, 0, 3), p(12, 0, 6)) + seg(p(12, 0, 3), p(6, 0, 6));
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={ex} stroke="currentColor" strokeWidth="1.3" strokeDasharray="5 3" opacity="0.7" />
      <path d={added} stroke="#d68a51" strokeWidth={hl ? 3 : 2.2} />
    </g>
  );
}
