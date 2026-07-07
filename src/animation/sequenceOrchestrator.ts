import { useEffect, useRef, useState } from "react";
import type { PursuitId, SettleTempo } from "../animation/beat2Settle";
import {
  BEAT0_HOLD_MS,
  isMobileViewport,
  prefersReducedMotion,
  resolveSettleTempo,
  runSettleSequence,
  ZOOM_DURATION_MS,
  type SettlePhase,
} from "../animation/beat2Settle";

export type SequenceBeat = "floor" | "beat0" | "beat1" | "beat2" | "beat3Rest";

export interface SequenceState {
  beat: SequenceBeat;
  settlePhase: SettlePhase | null;
  offsets: Record<PursuitId, number>;
  showRestLine: boolean;
  viewport: { x: number; y: number; w: number; h: number } | null;
  dimmed: boolean;
}

function zeroOffsets(): Record<PursuitId, number> {
  return {
    album: 0,
    albumPush: 0,
    tour: 0,
    loop: 0,
    single: 0,
    singlePush: 0,
  };
}

export function useSequenceOrchestrator(beat0Viewport: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const hasPlayedRef = useRef(false);
  const [state, setState] = useState<SequenceState>({
    beat: "floor",
    settlePhase: null,
    offsets: zeroOffsets(),
    showRestLine: false,
    viewport: null,
    dimmed: false,
  });

  useEffect(() => {
    if (hasPlayedRef.current) return;
    if (prefersReducedMotion()) return;

    let cancelled = false;

    const mobile = isMobileViewport();
    const slowTempo = !mobile;
    const tempo = resolveSettleTempo(slowTempo);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelSettle: (() => void) | undefined;

    const schedule = (fn: () => void, ms: number) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) fn();
        }, ms),
      );
    };

    schedule(() => {
      if (mobile) {
        setState((s) => ({ ...s, beat: "beat1", viewport: null }));
      } else {
        setState((s) => ({
          ...s,
          beat: "beat0",
          viewport: beat0Viewport,
        }));
      }
    }, 400);

    const beat1Start = mobile ? 400 : 400 + BEAT0_HOLD_MS;
    schedule(() => {
      setState((s) => ({
        ...s,
        beat: "beat1",
        viewport: null,
      }));
    }, beat1Start);

    const beat2Start = beat1Start + ZOOM_DURATION_MS + 600;
    schedule(() => {
      setState((s) => ({
        ...s,
        beat: "beat2",
        settlePhase: null,
        offsets: zeroOffsets(),
        showRestLine: false,
      }));

      timers.push(
        setTimeout(() => {
          cancelSettle = runSettleSequence(
            tempo,
            (phase, offsets) => {
              setState((s) => ({
                ...s,
                settlePhase: phase,
                offsets,
                showRestLine: phase === "rest",
              }));
            },
            () => {
              schedule(() => {
                hasPlayedRef.current = true;
                setState((s) => ({
                  ...s,
                  beat: "beat3Rest",
                  dimmed: true,
                }));
              }, 800);
            },
          );
        }, 50),
      );
    }, beat2Start);

    return () => {
      cancelled = true;
      for (const t of timers) clearTimeout(t);
      cancelSettle?.();
    };
  }, [beat0Viewport]);

  return state;
}

export function useSettleTempo(): SettleTempo {
  const [tempo, setTempo] = useState(() => resolveSettleTempo(!isMobileViewport()));

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setTempo(resolveSettleTempo(!mq.matches));
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return tempo;
}
