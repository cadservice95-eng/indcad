/**
 * One illustrative two-storey house. Every view (plan, elevation, section, 3D,
 * RCP, site, schedules) is derived from these numbers so they stay consistent.
 * Plan units: 1 unit ≈ 3 cm, plan x/y map straight to the plan viewBox (640×420).
 * Elevation x = plan x (south elevation); section x = plan y (cut at x = CUT_X).
 * All values are illustrative only.
 */
export const B = { x0: 80, y0: 60, x1: 560, y1: 340, storey: 90, roof: 42 } as const;
export const CUT_X = 340;

export type Room = { id: string; name: string; tag: string; x0: number; y0: number; x1: number; y1: number; finish: string };

export const ROOMS: Room[] = [
  { id: "living", name: "Living", tag: "R-01", x0: 80, y0: 60, x1: 300, y1: 230, finish: "F1" },
  { id: "kitchen", name: "Kitchen", tag: "R-02", x0: 300, y0: 60, x1: 560, y1: 200, finish: "F2" },
  { id: "hall", name: "Hall / Stair", tag: "R-03", x0: 300, y0: 200, x1: 380, y1: 340, finish: "F3" },
  { id: "bed1", name: "Bedroom 1", tag: "R-04", x0: 80, y0: 230, x1: 300, y1: 340, finish: "F4" },
  { id: "bath", name: "Bath", tag: "R-05", x0: 380, y0: 200, x1: 450, y1: 340, finish: "F5" },
  { id: "study", name: "Study", tag: "R-06", x0: 450, y0: 200, x1: 560, y1: 340, finish: "F4" },
];

export type Opening = { id: string; kind: "door" | "window"; wall: "N" | "S" | "E" | "W" | "h" | "v"; x: number; y: number; w: number; room: string; type: string; size: string; desc: string; swing?: 1 | -1 };

/** For walls N/S/E/W/h/v: (x,y) is the start; w runs along x for N/S/h and along y for E/W/v. */
export const OPENINGS: Opening[] = [
  { id: "D-01", kind: "door", wall: "S", x: 325, y: 340, w: 30, room: "hall", type: "Entry", size: "900 × 2100", desc: "Front entry door", swing: -1 },
  { id: "D-02", kind: "door", wall: "v", x: 300, y: 200, w: 30, room: "living", type: "Internal", size: "820 × 2040", desc: "Living to hall", swing: -1 },
  { id: "D-03", kind: "door", wall: "v", x: 300, y: 300, w: 30, room: "bed1", type: "Internal", size: "820 × 2040", desc: "Bedroom 1 to hall", swing: -1 },
  { id: "D-04", kind: "door", wall: "h", x: 322, y: 200, w: 30, room: "kitchen", type: "Internal", size: "820 × 2040", desc: "Hall to kitchen", swing: -1 },
  { id: "D-05", kind: "door", wall: "v", x: 380, y: 300, w: 30, room: "bath", type: "Internal", size: "720 × 2040", desc: "Hall to bath", swing: 1 },
  { id: "D-06", kind: "door", wall: "h", x: 490, y: 200, w: 30, room: "study", type: "Internal", size: "820 × 2040", desc: "Kitchen to study", swing: 1 },
  { id: "W-01", kind: "window", wall: "W", x: 80, y: 100, w: 70, room: "living", type: "Fixed + sliding", size: "1800 × 1350", desc: "Living west window" },
  { id: "W-02", kind: "window", wall: "N", x: 130, y: 60, w: 80, room: "living", type: "Awning", size: "1800 × 900", desc: "Living north window" },
  { id: "W-03", kind: "window", wall: "N", x: 390, y: 60, w: 100, room: "kitchen", type: "Fixed", size: "2400 × 900", desc: "Kitchen north window" },
  { id: "W-04", kind: "window", wall: "E", x: 560, y: 95, w: 70, room: "kitchen", type: "Sliding", size: "1800 × 1350", desc: "Kitchen east window" },
  { id: "W-05", kind: "window", wall: "S", x: 130, y: 340, w: 90, room: "bed1", type: "Awning", size: "2100 × 1200", desc: "Bedroom 1 south window" },
  { id: "W-06", kind: "window", wall: "S", x: 480, y: 340, w: 50, room: "study", type: "Awning", size: "1200 × 1200", desc: "Study south window" },
];

export const DOORS = OPENINGS.filter((o) => o.kind === "door");
export const WINDOWS = OPENINGS.filter((o) => o.kind === "window");
export const roomOf = (id: string) => ROOMS.find((r) => r.id === id)!;
export const openingOf = (id: string) => OPENINGS.find((o) => o.id === id);

export const FINISHES = [
  { id: "F1", type: "Floor", loc: "Living", desc: "Timber-look board" },
  { id: "F2", type: "Floor", loc: "Kitchen", desc: "Large-format tile" },
  { id: "F3", type: "Floor", loc: "Hall / Stair", desc: "Tile with stair nosing" },
  { id: "F4", type: "Floor", loc: "Bedroom 1 · Study", desc: "Carpet" },
  { id: "F5", type: "Floor", loc: "Bath", desc: "Wet-area tile" },
];

export const ceilingFixtures = [
  { id: "L1", x: 190, y: 145 }, { id: "L2", x: 430, y: 130 }, { id: "L3", x: 340, y: 270 },
  { id: "L4", x: 190, y: 285 }, { id: "L5", x: 415, y: 270 }, { id: "L6", x: 505, y: 270 },
];

/** Which drawings carry a given element (illustrative cross-reference). */
export const REFS = ["Plan", "Elevation", "Schedule", "Detail"] as const;
export type Ref = (typeof REFS)[number];

export const mono = { fontFamily: "var(--font-mono)" } as const;

/** Door/window rect on the plan for a wall + (x,y,w). */
export function openingRect(o: Opening) {
  const t = 6;
  if (o.wall === "N" || o.wall === "S" || o.wall === "h") return { x: o.x, y: o.y - t, w: o.w, h: t * 2 };
  return { x: o.x - t, y: o.y, w: t * 2, h: o.w };
}

/** Illustrative simple tween used by the 3D rise. */
export const ease = (t: number) => 1 - Math.pow(1 - t, 3);
