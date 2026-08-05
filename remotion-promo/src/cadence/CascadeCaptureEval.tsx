import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { MapStillLife, MapStage, useStaggeredSettle } from "./MapStillLife";
import {
  colors,
  EZOOM,
  SETTLE_SLOW_DURATION_MS,
  SETTLE_SLOW_STAGGER_MS,
  msToFrames,
} from "./tokens";

const ezoom = Easing.bezier(...EZOOM);

/**
 * Isolated cascade loop for evaluating Remotion vs live MapView settle.
 * ~10s: rest → settle (slow tempo) → hold → snap back.
 */
export const CASCADE_LOOP_FRAMES =
  msToFrames(2000) +
  msToFrames(SETTLE_SLOW_DURATION_MS) +
  msToFrames(SETTLE_SLOW_STAGGER_MS) +
  msToFrames(2500);

export const CascadeCaptureEval: React.FC = () => {
  const frame = useCurrentFrame();
  const rest = msToFrames(2000);
  const durationFrames = msToFrames(SETTLE_SLOW_DURATION_MS);
  const staggerFrames = msToFrames(SETTLE_SLOW_STAGGER_MS);
  const settleEnd = rest + durationFrames + staggerFrames;

  const { getLineT } = useStaggeredSettle({
    startFrame: rest,
    durationFrames,
    staggerFrames,
  });

  const afterHold = frame >= settleEnd;
  const resetFlash = interpolate(frame, [settleEnd + msToFrames(2200), settleEnd + msToFrames(2500)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ezoom,
  });

  const progressOverride = afterHold ? resetFlash : undefined;

  const badge = frame < rest ? "rest" : frame < settleEnd ? "settling (slow tempo)" : "settled";

  return (
    <MapStage>
      <AbsoluteFill style={{ padding: "40px 56px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.accent,
                marginBottom: 8,
              }}
            >
              Remotion · cascade capture eval
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 500,
                color: colors.parchment,
              }}
            >
              Frame-driven settle (not CSS, not live MapView)
            </h2>
          </div>
          <div
            style={{
              fontSize: 13,
              color: colors.mutedAsh,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {badge} · f{frame}
          </div>
        </div>

        <MapStillLife
          progress={progressOverride ?? 0}
          getLineT={progressOverride != null ? undefined : getLineT}
        />

        <ul
          style={{
            marginTop: 28,
            paddingLeft: 18,
            color: colors.mutedAsh,
            fontSize: 14,
            lineHeight: 1.55,
            maxWidth: 720,
          }}
        >
          <li>Ease = Cadence --ezoom (0.32, 0.72, 0, 1) via Easing.bezier</li>
          <li>
            Tempo = slow settle {SETTLE_SLOW_DURATION_MS}ms / stagger {SETTLE_SLOW_STAGGER_MS}ms
          </li>
          <li>CSS transitions cannot render in Remotion — this is the capture path</li>
        </ul>
      </AbsoluteFill>
    </MapStage>
  );
};
