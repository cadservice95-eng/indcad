/** Illustrative electrical system shared by every visual on the electrical page. Not project data. */

export type PanelId = "DB-01" | "DB-02" | "MCC";

export interface Circuit {
  id: string;
  panel: PanelId;
  load: string;
  motor?: boolean;
  cable: string;
  /** first issue (0 = A) in which the circuit exists */
  since: number;
  /** issue at which it is removed (exclusive) */
  until?: number;
  /** x position (viewBox units) of the circuit's vertical run */
  x: number;
}

export const PANELS: { id: PanelId; x: number }[] = [
  { id: "DB-01", x: 130 },
  { id: "DB-02", x: 320 },
  { id: "MCC", x: 510 },
];

export const CIRCUITS: Circuit[] = [
  { id: "C-01", panel: "DB-01", load: "LOAD 01", cable: "W-101", since: 0, x: 98 },
  { id: "C-02", panel: "DB-01", load: "LOAD 02", cable: "W-102", since: 0, x: 162 },
  { id: "C-03", panel: "DB-02", load: "LOAD 03", cable: "W-103", since: 0, x: 288 },
  { id: "C-04", panel: "DB-02", load: "LOAD 04", cable: "W-104", since: 0, x: 352 },
  { id: "C-05", panel: "MCC", load: "MOTOR 01", motor: true, cable: "W-105", since: 1, x: 478 },
  { id: "C-06", panel: "MCC", load: "MOTOR 02", motor: true, cable: "W-106", since: 0, until: 3, x: 542 },
];

export const REVISIONS = [
  { code: "ISSUE A", note: "First issue of the single-line diagram.", status: "Issued", changed: [] as string[] },
  { code: "ISSUE B", note: "Motor circuit C-05 added at the MCC.", status: "Issued", changed: ["C-05"] },
  { code: "ISSUE C", note: "Circuit C-04 modified; DB-02 updated.", status: "Issued", changed: ["C-04", "DB-02"] },
  { code: "ISSUE D", note: "Circuit C-06 removed.", status: "Current", changed: ["C-06"] },
];

export const scheduleRows = CIRCUITS.map((c) => ({
  circuit: c.id,
  from: c.panel,
  to: c.load,
  cable: c.cable,
  conductor: "As scheduled",
  reference: `SLD-01 / E-10${c.id.slice(-1)}`,
}));
