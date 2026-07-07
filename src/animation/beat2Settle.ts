/**
 * Settle timing — copied from cadence-cursor-build settleOrchestrator.ts
 */

export const SETTLE_DURATION_MS = 1800;
export const SETTLE_STAGGER_MS = 1530;
export const SETTLE_SLOW_DURATION_MS = 2400;
export const SETTLE_SLOW_STAGGER_MS = 2040;

export const ZOOM_DURATION_MS = 900;
export const BEAT0_HOLD_MS = 1500;
export const BEAT_HOLD_MS = 1200;

export interface SettleTempo {
  durationMs: number;
  staggerMs: number;
}

export function resolveSettleTempo(slow: boolean): SettleTempo {
  if (slow) {
    return { durationMs: SETTLE_SLOW_DURATION_MS, staggerMs: SETTLE_SLOW_STAGGER_MS };
  }
  return { durationMs: SETTLE_DURATION_MS, staggerMs: SETTLE_STAGGER_MS };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

export type SettlePhase = 0 | 1 | 2 | 3 | "rest";

export type PursuitId =
  | "album"
  | "albumPush"
  | "tour"
  | "loop"
  | "single"
  | "singlePush";

/** Slip deltas in SVG units — source largest, downstream diminishing (slack absorbs). */
export const SLIP_DELTAS: Record<PursuitId, number> = {
  album: 0,
  albumPush: 0,
  tour: 48,
  loop: 18,
  single: 28,
  singlePush: 14,
};

export function phaseDelay(phase: SettlePhase, tempo: SettleTempo): number {
  if (phase === "rest") return tempo.staggerMs * 3 + tempo.durationMs;
  return phase * tempo.staggerMs;
}

export function offsetsForPhase(phase: SettlePhase): Record<PursuitId, number> {
  const base: Record<PursuitId, number> = {
    album: 0,
    albumPush: 0,
    tour: 0,
    loop: 0,
    single: 0,
    singlePush: 0,
  };

  if (phase === "rest" || phase >= 3) {
    base.tour = SLIP_DELTAS.tour;
    base.single = SLIP_DELTAS.single;
    base.singlePush = SLIP_DELTAS.singlePush;
    base.loop = SLIP_DELTAS.loop;
    return base;
  }
  if (phase >= 2) {
    base.tour = SLIP_DELTAS.tour;
    base.single = SLIP_DELTAS.single;
    base.singlePush = SLIP_DELTAS.singlePush;
    return base;
  }
  if (phase >= 1) {
    base.tour = SLIP_DELTAS.tour;
    base.single = SLIP_DELTAS.single;
    return base;
  }

  base.tour = SLIP_DELTAS.tour;
  return base;
}

export function runSettleSequence(
  tempo: SettleTempo,
  onPhase: (phase: SettlePhase, offsets: Record<PursuitId, number>) => void,
  onComplete: () => void,
): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const phases: SettlePhase[] = [0, 1, 2, 3, "rest"];

  for (const phase of phases) {
    const delay = phase === "rest" ? phaseDelay(3, tempo) + tempo.durationMs : phaseDelay(phase, tempo);
    timers.push(
      setTimeout(() => {
        onPhase(phase, offsetsForPhase(phase));
        if (phase === "rest") onComplete();
      }, delay),
    );
  }

  onPhase(0, offsetsForPhase(0));

  return () => {
    for (const t of timers) clearTimeout(t);
  };
}
