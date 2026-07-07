import { useMemo } from "react";
import { COPY } from "../copy";
import { useSequenceOrchestrator, useSettleTempo } from "../animation/sequenceOrchestrator";
import { prefersReducedMotion } from "../animation/beat2Settle";
import { beat0Viewport } from "../layout/stillLifeLayout";
import { BeatCopy } from "./BeatCopy";
import { StillLifeCanvas } from "./StillLifeCanvas";

function resolveCopyBeat(
  beat: ReturnType<typeof useSequenceOrchestrator>["beat"],
): "beat1" | "beat2" | "beat3" {
  if (beat === "beat2") return "beat2";
  if (beat === "beat3Rest") return "beat3";
  return "beat1";
}

export function HeroSection() {
  const b0 = useMemo(() => beat0Viewport(), []);
  const reduced = prefersReducedMotion();
  const sequence = useSequenceOrchestrator(b0);
  const tempo = useSettleTempo();

  const beat = reduced ? "floor" : sequence.beat;
  const copyBeat = resolveCopyBeat(beat);
  const dimmed = beat === "beat3Rest" || sequence.dimmed;
  const settling = beat === "beat2";

  return (
    <section className="hero" aria-label="Cadence">
      <div className="hero__copy">
        <BeatCopy beat={copyBeat} dimmed={dimmed && copyBeat === "beat3"} />
      </div>

      <div className={`hero__canvas${dimmed ? " hero__canvas--dimmed" : ""}`}>
        <StillLifeCanvas
          offsets={sequence.offsets}
          tempo={tempo}
          dimmed={dimmed}
          showRestLine={sequence.showRestLine}
          restLine={COPY.beat2.restLine}
          viewport={sequence.viewport}
          settling={settling}
        />
      </div>
    </section>
  );
}
