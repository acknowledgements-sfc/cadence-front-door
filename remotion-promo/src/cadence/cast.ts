/**
 * Six-line still-life cast from locked /product outline (P-0 / P-1).
 * Geometry is stylized demo composition — not live MapView layout.
 *
 * Positions are % of map width (left edge → right = later in time).
 * `before` = at rest; `after` = post-slip settle (Album slipped +3d feel).
 */

export type Health = "ok" | "tight" | "slipping";

export type PursuitLine = {
  id: string;
  label: string;
  color: string;
  /** Vertical slot 0..5 */
  row: number;
  /** Line span before cascade [start%, end%] */
  before: [number, number];
  /** Line span after cascade [start%, end%] */
  after: [number, number];
  /** How much this line participates in settle (0 = anchor source, 1 = farthest) */
  settleRank: number;
  health: Health;
  /** Exploration = dashed loop, no terminus */
  kind: "pursuit" | "exploration";
};

export const CAST: PursuitLine[] = [
  {
    id: "album",
    label: "Album",
    color: "#6fb3c9",
    row: 0,
    before: [8, 52],
    after: [8, 58],
    settleRank: 0,
    health: "tight",
    kind: "pursuit",
  },
  {
    id: "album-push",
    label: "Album push",
    color: "#6fb3c9",
    row: 1,
    before: [48, 72],
    after: [54, 78],
    settleRank: 1,
    health: "ok",
    kind: "pursuit",
  },
  {
    id: "tour",
    label: "Tour",
    color: "#c97a6f",
    row: 2,
    before: [58, 88],
    after: [64, 92],
    settleRank: 2,
    health: "ok",
    kind: "pursuit",
  },
  {
    id: "live-ideas",
    label: "Live-show ideas",
    color: "#8fa76f",
    row: 3,
    before: [22, 38],
    after: [22, 38],
    settleRank: -1,
    health: "ok",
    kind: "exploration",
  },
  {
    id: "single",
    label: "Single",
    color: "#a78fc9",
    row: 4,
    before: [12, 36],
    after: [14, 40],
    settleRank: 1,
    health: "ok",
    kind: "pursuit",
  },
  {
    id: "single-push",
    label: "Single push",
    color: "#a78fc9",
    row: 5,
    before: [34, 48],
    after: [38, 54],
    settleRank: 2,
    health: "ok",
    kind: "pursuit",
  },
];

/** Vertical gate threads: x% and which rows they span */
export const GATES: { xBefore: number; xAfter: number; fromRow: number; toRow: number }[] = [
  { xBefore: 52, xAfter: 58, fromRow: 0, toRow: 1 },
  { xBefore: 72, xAfter: 78, fromRow: 1, toRow: 2 },
  { xBefore: 36, xAfter: 40, fromRow: 4, toRow: 5 },
];
