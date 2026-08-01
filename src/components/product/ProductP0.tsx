import { COPY } from "../../copy";
import { type PursuitId, type SettleTempo } from "../../animation/beat2Settle";
import { PRODUCT_GATES, PRODUCT_PURSUITS } from "../../layout/productStillLifeLayout";
import { StillLifeCanvas } from "../StillLifeCanvas";

/** True rest — before any slip. (offsetsForPhase(0) already includes tour slip.) */
const BEFORE_OFFSETS: Record<PursuitId, number> = {
  album: 0,
  albumPush: 0,
  tour: 0,
  loop: 0,
  single: 0,
  singlePush: 0,
};

const STATIC_TEMPO: SettleTempo = { durationMs: 0, staggerMs: 0 };

export function ProductP0() {
  return (
    <section className="product-chapter" aria-labelledby="product-p0-headline">
      <div className="product-chapter__copy">
        <h2 id="product-p0-headline" className="product-chapter__headline">
          {COPY.product.p0.headline}
        </h2>
        <p className="product-chapter__sub">{COPY.product.p0.sub}</p>
      </div>
      <div className="product-chapter__canvas">
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
          showHoverShapeLabels
          gateOpacity={0.55}
        />
      </div>
    </section>
  );
}

/** Exported for P-1 reduced-motion before frame — same zero offsets. */
export { BEFORE_OFFSETS, STATIC_TEMPO };
