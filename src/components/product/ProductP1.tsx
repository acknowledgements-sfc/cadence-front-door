import { useCallback, useEffect, useRef, useState } from "react";
import { COPY } from "../../copy";
import {
  offsetsForPhase,
  prefersReducedMotion,
  resolveSettleTempo,
  runSettleSequence,
  type PursuitId,
} from "../../animation/beat2Settle";
import { useSettleTempo } from "../../animation/sequenceOrchestrator";
import { useCenteredInViewOnce } from "../../hooks/useCenteredInViewOnce";
import { PRODUCT_GATES, PRODUCT_PURSUITS } from "../../layout/productStillLifeLayout";
import { StillLifeCanvas } from "../StillLifeCanvas";
import { BEFORE_OFFSETS, STATIC_TEMPO } from "./ProductP0";

type PlayState = "idle" | "playing" | "rest";

export function ProductP1() {
  const reduced = prefersReducedMotion();
  const tempo = useSettleTempo();
  const { ref, hasEntered } = useCenteredInViewOnce<HTMLElement>();
  const [offsets, setOffsets] = useState<Record<PursuitId, number>>(BEFORE_OFFSETS);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [showRestLine, setShowRestLine] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);
  const autoPlayedRef = useRef(false);

  const runSettle = useCallback(() => {
    cancelRef.current?.();
    setShowRestLine(false);
    setPlayState("idle");
    setOffsets(BEFORE_OFFSETS);

    // Paint the before frame without transition, then run the settle.
    const startTimer = window.setTimeout(() => {
      setPlayState("playing");
      const cancel = runSettleSequence(
        tempo,
        (phase, next) => {
          setOffsets(next);
          if (phase === "rest") {
            setShowRestLine(true);
          }
        },
        () => {
          setPlayState("rest");
        },
      );
      cancelRef.current = cancel;
    }, 80);

    cancelRef.current = () => {
      window.clearTimeout(startTimer);
    };
  }, [tempo]);

  // Entrance-triggered autoplay-once (not on page load).
  useEffect(() => {
    if (reduced) return;
    if (!hasEntered) return;
    if (autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    runSettle();
  }, [hasEntered, reduced, runSettle]);

  useEffect(() => {
    return () => {
      cancelRef.current?.();
    };
  }, []);

  const handleWatchAgain = () => {
    if (playState === "playing") return;
    runSettle();
  };

  if (reduced) {
    const after = offsetsForPhase("rest");
    const slow = resolveSettleTempo(true);
    return (
      <section className="product-chapter" aria-labelledby="product-p1-headline">
        <div className="product-chapter__copy">
          <h2 id="product-p1-headline" className="product-chapter__headline">
            {COPY.beat2.headline}
          </h2>
          <p className="product-chapter__sub">{COPY.product.p1.sub}</p>
        </div>
        <div className="product-p1__reduced" aria-label="Before and after">
          <div className="product-p1__frame">
            <p className="product-p1__frame-label">Before</p>
            <div className="product-chapter__canvas product-chapter__canvas--compact">
              <StillLifeCanvas
                offsets={BEFORE_OFFSETS}
                tempo={STATIC_TEMPO}
                dimmed={false}
                showRestLine={false}
                restLine=""
                viewport={null}
                settling={false}
                pursuits={PRODUCT_PURSUITS}
                gates={PRODUCT_GATES}
                gateOpacity={0.55}
              />
            </div>
          </div>
          <div className="product-p1__frame">
            <p className="product-p1__frame-label">After</p>
            <div className="product-chapter__canvas product-chapter__canvas--compact">
              <StillLifeCanvas
                offsets={after}
                tempo={slow}
                dimmed={false}
                showRestLine
                restLine={COPY.beat2.restLine}
                viewport={null}
                settling={false}
                pursuits={PRODUCT_PURSUITS}
                gates={PRODUCT_GATES}
                gateOpacity={0.55}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="product-chapter"
      aria-labelledby="product-p1-headline"
    >
      <div className="product-chapter__copy">
        <h2 id="product-p1-headline" className="product-chapter__headline">
          {COPY.beat2.headline}
        </h2>
        <p className="product-chapter__sub">{COPY.product.p1.sub}</p>
      </div>
      <div className="product-chapter__canvas">
        <StillLifeCanvas
          offsets={offsets}
          tempo={tempo}
          dimmed={false}
          showRestLine={showRestLine}
          restLine={COPY.beat2.restLine}
          viewport={null}
          settling={playState === "playing"}
          pursuits={PRODUCT_PURSUITS}
          gates={PRODUCT_GATES}
          gateOpacity={0.55}
        />
      </div>
      {playState === "rest" ? (
        <div className="product-p1__replay">
          <button
            type="button"
            className="product-p1__watch-again"
            onClick={handleWatchAgain}
          >
            {COPY.product.p1.watchAgain}
          </button>
        </div>
      ) : null}
    </section>
  );
}
