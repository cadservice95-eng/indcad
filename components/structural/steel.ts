/** Code-generated steel frame used by the structural page (illustrative geometry, not project data). */

export type V3 = readonly [number, number, number];
export type MemberKind = "col" | "beam" | "brace";

export interface Member {
  id: string;
  kind: MemberKind;
  a: V3;
  b: V3;
  /** first issue (0 = A) in which the member exists */
  since: number;
  /** issue at which the member is removed (exclusive) */
  until?: number;
}

export const XS = [0, 8, 16];
export const YS = [0, 6];
export const ZS = [0, 4, 8];

let colN = 0;
export const members: Member[] = [];

for (const y of YS) for (const x of XS) members.push({ id: `C-0${++colN}`, kind: "col", a: [x, y, 0], b: [x, y, 8], since: 0 });

for (const [li, z] of [4, 8].entries()) {
  const base = (li + 1) * 100;
  const since = li === 0 ? 0 : 1;
  let n = 0;
  for (const y of YS) for (let i = 0; i < 2; i++) members.push({ id: `B-${base + ++n}`, kind: "beam", a: [XS[i], y, z], b: [XS[i + 1], y, z], since });
  for (const x of XS) members.push({ id: `B-${base + ++n}`, kind: "beam", a: [x, 0, z], b: [x, 6, z], since, until: li === 1 && x === 16 ? 3 : undefined });
}

members.push({ id: "BR-01", kind: "brace", a: [0, 6, 0], b: [8, 6, 4], since: 2 });
members.push({ id: "BR-02", kind: "brace", a: [8, 6, 0], b: [0, 6, 4], since: 2 });
members.push({ id: "BR-03", kind: "brace", a: [0, 6, 4], b: [8, 6, 8], since: 3 });
members.push({ id: "BR-04", kind: "brace", a: [8, 6, 4], b: [0, 6, 8], since: 3 });

export const nodes: { id: string; p: V3 }[] = [];
let nn = 0;
for (const z of [4, 8]) for (const y of YS) for (const x of XS) nodes.push({ id: `C-${String(++nn).padStart(2, "0")}`, p: [x, y, z] });

export const REVISIONS = [
  { code: "ISSUE A", stage: "Tender", status: "Issued", note: "Primary frame and first-level beams for pricing.", changed: [] as string[] },
  { code: "ISSUE B", stage: "Design Development", status: "Issued", note: "Second-level beams added as the design develops.", changed: ["B-201", "B-202", "B-203", "B-204", "B-205", "B-206", "B-207"] },
  { code: "ISSUE C", stage: "For Coordination", status: "Issued", note: "Bracing added to the front bay; connection reviewed.", changed: ["BR-01", "BR-02"] },
  { code: "ISSUE D", stage: "For Construction", status: "Current", note: "Upper bracing added; one edge beam removed.", changed: ["BR-03", "BR-04", "B-207"] },
];

export const memberInfo = (m: Member) => ({
  title: `${m.kind === "col" ? "COLUMN" : m.kind === "beam" ? "BEAM" : "BRACE"} ${m.id}`,
  section: m.kind === "col" ? "UC / H-SECTION" : m.kind === "beam" ? "UB / I-BEAM" : "ANGLE / TUBE",
});

/** Which members belong to each take-off row (illustrative schedule). */
export const SCHEDULE = [
  { mark: "C-01", member: "Column", qty: 6, material: "S355", length: "8 000", ids: members.filter((m) => m.kind === "col").map((m) => m.id) },
  { mark: "B-101", member: "Beam", qty: 7, material: "S355", length: "8 000", ids: members.filter((m) => m.kind === "beam" && m.id.startsWith("B-1")).map((m) => m.id) },
  { mark: "B-201", member: "Beam", qty: 7, material: "S355", length: "8 000", ids: members.filter((m) => m.kind === "beam" && m.id.startsWith("B-2")).map((m) => m.id) },
  { mark: "BR-01", member: "Brace", qty: 4, material: "S275", length: "—", ids: members.filter((m) => m.kind === "brace").map((m) => m.id) },
];

export const BOLTS = [
  { mark: "M20", size: "M20 8.8", qty: 48, connection: "Beam to column" },
  { mark: "M16", size: "M16 8.8", qty: 16, connection: "Bracing gusset" },
  { mark: "M24", size: "M24 8.8", qty: 24, connection: "Base plate" },
];
