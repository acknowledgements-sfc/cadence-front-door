/**
 * Hand-authored six-line still life — docs/08 §Beat 1
 * Coordinates in SVG viewBox units (0–1000 × 0–520).
 */

export type PursuitShape = "release" | "live_multi" | "exploration" | "visibility";

export interface PursuitLayout {
  id: "album" | "albumPush" | "tour" | "loop" | "single" | "singlePush";
  name: string;
  shape: PursuitShape;
  row: number;
  xStart: number;
  xEnd: number;
  colorVar: string;
  health: "ok" | "tight";
  throughLine?: boolean;
  /** Beat 0 close-up target */
  focusTarget?: boolean;
}

export const VIEW_WIDTH = 1000;
export const VIEW_HEIGHT = 520;
export const ROW_HEIGHT = 56;
export const ROW_TOP = 72;

export const PURSUITS: PursuitLayout[] = [
  {
    id: "album",
    name: "Album",
    shape: "release",
    row: 0,
    xStart: 40,
    xEnd: 220,
    colorVar: "var(--map-c1)",
    health: "ok",
    throughLine: true,
  },
  {
    id: "albumPush",
    name: "Album push",
    shape: "visibility",
    row: 1,
    xStart: 50,
    xEnd: 200,
    colorVar: "var(--map-c4)",
    health: "ok",
  },
  {
    id: "tour",
    name: "Tour",
    shape: "live_multi",
    row: 2,
    xStart: 280,
    xEnd: 520,
    colorVar: "var(--map-c2)",
    health: "tight",
    throughLine: true,
  },
  {
    id: "loop",
    name: "Live-show ideas",
    shape: "exploration",
    row: 3,
    xStart: 540,
    xEnd: 680,
    colorVar: "var(--map-c3)",
    health: "ok",
  },
  {
    id: "single",
    name: "Single",
    shape: "release",
    row: 4,
    xStart: 620,
    xEnd: 780,
    colorVar: "var(--map-c1)",
    health: "ok",
    focusTarget: true,
  },
  {
    id: "singlePush",
    name: "Single push",
    shape: "visibility",
    row: 5,
    xStart: 640,
    xEnd: 760,
    colorVar: "var(--map-c4)",
    health: "ok",
  },
];

export interface GateLink {
  id: string;
  from: PursuitLayout["id"];
  to: PursuitLayout["id"];
  fromAnchor: "end" | "mid";
  toAnchor: "start" | "mid";
}

export const GATES: GateLink[] = [
  { id: "album-albumPush", from: "album", to: "albumPush", fromAnchor: "mid", toAnchor: "mid" },
  { id: "album-tour", from: "album", to: "tour", fromAnchor: "end", toAnchor: "start" },
  { id: "tour-loop", from: "tour", to: "loop", fromAnchor: "end", toAnchor: "start" },
  { id: "tour-single", from: "tour", to: "single", fromAnchor: "end", toAnchor: "start" },
  { id: "single-singlePush", from: "single", to: "singlePush", fromAnchor: "mid", toAnchor: "mid" },
];

export function rowY(row: number): number {
  return ROW_TOP + row * ROW_HEIGHT;
}

export function anchorX(p: PursuitLayout, anchor: "start" | "mid" | "end"): number {
  if (anchor === "start") return p.xStart;
  if (anchor === "end") return p.xEnd;
  return (p.xStart + p.xEnd) / 2;
}

export function pursuitById(id: PursuitLayout["id"]): PursuitLayout {
  const p = PURSUITS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown pursuit: ${id}`);
  return p;
}

/** Beat 0 viewport — crop to single line */
export function beat0Viewport(): { x: number; y: number; w: number; h: number } {
  const single = pursuitById("single");
  const y = rowY(single.row) - 24;
  return { x: single.xStart - 40, y, w: single.xEnd - single.xStart + 80, h: 88 };
}

export const SHAPE_LEGEND = [
  { label: "Release", shape: "release" as const },
  { label: "Live · multi", shape: "live_multi" as const },
  { label: "Exploration", shape: "exploration" as const },
  { label: "Visibility", shape: "visibility" as const },
];
