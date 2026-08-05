/**
 * Cadence map / brand tokens — mirrored from app `src/index.css`.
 * Remotion cannot use CSS transitions; ease is applied via Easing.bezier.
 */

export const colors = {
  deepVoid: "#0f0f13",
  mapBg: "#0e0e11",
  mapInk: "#e8e8ea",
  mapDim: "#4a4a52",
  mapAmber: "#e8a547",
  accent: "#7c6cfc",
  parchment: "#f6f4ef",
  mutedAsh: "#9b9b9f",
  success: "#5a9e6f",
  caution: "#c4a035",
  warning: "#c45c4a",
  line: {
    teal: "#6fb3c9",
    terracotta: "#c97a6f",
    sage: "#8fa76f",
    mauve: "#a78fc9",
  },
} as const;

/** Matches `--ezoom: cubic-bezier(0.32, 0.72, 0, 1)` */
export const EZOOM = [0.32, 0.72, 0, 1] as const;

export const FPS = 30;

/** Slow settle tempo (first / big cascade) — `settleOrchestrator.ts` */
export const SETTLE_SLOW_DURATION_MS = 2400;
export const SETTLE_SLOW_STAGGER_MS = 2040;

export const msToFrames = (ms: number, fps = FPS) => Math.round((ms / 1000) * fps);
