import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { MapStillLife, MapStage, useStaggeredSettle } from "./MapStillLife";
import {
  colors,
  EZOOM,
  FPS,
  SETTLE_SLOW_DURATION_MS,
  SETTLE_SLOW_STAGGER_MS,
  msToFrames,
} from "./tokens";

const ezoom = Easing.bezier(...EZOOM);

/** Scene lengths (frames @ 30fps) */
export const SCENES = {
  open: msToFrames(3200),
  rest: msToFrames(2800),
  settleHold: msToFrames(600),
  settle: msToFrames(SETTLE_SLOW_DURATION_MS) + msToFrames(SETTLE_SLOW_STAGGER_MS),
  settledCopy: msToFrames(3200),
  ask: msToFrames(4000),
} as const;

export const TOTAL_FRAMES =
  SCENES.open +
  SCENES.rest +
  SCENES.settleHold +
  SCENES.settle +
  SCENES.settledCopy +
  SCENES.ask;

const TitleBlock: React.FC<{
  headline: string;
  sub?: string;
  appear?: boolean;
}> = ({ headline, sub, appear = true }) => {
  const frame = useCurrentFrame();
  const opacity = appear
    ? interpolate(frame, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: ezoom,
      })
    : 1;
  const y = appear
    ? interpolate(frame, [0, 18], [12, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: ezoom,
      })
    : 0;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: "left",
        maxWidth: 820,
      }}
    >
      <div
        style={{
          fontSize: 15,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: colors.accent,
          marginBottom: 14,
          fontWeight: 500,
        }}
      >
        Cadence
      </div>
      <h1
        style={{
          margin: 0,
          fontSize: 48,
          lineHeight: 1.15,
          fontWeight: 500,
          color: colors.parchment,
          letterSpacing: "-0.02em",
        }}
      >
        {headline}
      </h1>
      {sub ? (
        <p
          style={{
            margin: "16px 0 0",
            fontSize: 20,
            lineHeight: 1.45,
            color: colors.mutedAsh,
            maxWidth: 560,
          }}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
};

const OpenScene: React.FC = () => (
  <MapStage>
    <AbsoluteFill
      style={{
        padding: "72px 80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <TitleBlock
        headline="The whole way through"
        sub="What a year of work looks like when it lives in one place — singles, the album, the tour, and the ideas still forming."
      />
    </AbsoluteFill>
  </MapStage>
);

const RestScene: React.FC = () => {
  const frame = useCurrentFrame();
  const mapOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <MapStage>
      <AbsoluteFill style={{ padding: "48px 64px 40px" }}>
        <TitleBlock headline="When one thing slips, the rest moves with it." appear={false} />
        <div style={{ marginTop: 36, opacity: mapOpacity }}>
          <MapStillLife progress={0} />
        </div>
      </AbsoluteFill>
    </MapStage>
  );
};

const SettleScene: React.FC = () => {
  const durationFrames = msToFrames(SETTLE_SLOW_DURATION_MS);
  const staggerFrames = msToFrames(SETTLE_SLOW_STAGGER_MS);
  const { getLineT } = useStaggeredSettle({
    startFrame: 0,
    durationFrames,
    staggerFrames,
  });

  return (
    <MapStage>
      <AbsoluteFill style={{ padding: "48px 64px 40px" }}>
        <TitleBlock headline="When one thing slips, the rest moves with it." appear={false} />
        <div style={{ marginTop: 36 }}>
          <MapStillLife getLineT={getLineT} progress={0} />
        </div>
      </AbsoluteFill>
    </MapStage>
  );
};

const SettledCopyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ezoom,
  });

  return (
    <MapStage>
      <AbsoluteFill style={{ padding: "48px 64px 40px" }}>
        <TitleBlock headline="When one thing slips, the rest moves with it." appear={false} />
        <div style={{ marginTop: 36 }}>
          <MapStillLife progress={1} />
        </div>
        <p
          style={{
            marginTop: 28,
            opacity,
            fontSize: 18,
            color: colors.mapInk,
            letterSpacing: "0.01em",
          }}
        >
          Settled — the rest moved with it
        </p>
      </AbsoluteFill>
    </MapStage>
  );
};

const AskScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ezoom,
  });
  const lineW = interpolate(frame, [12, 40], [0, 280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ezoom,
  });

  return (
    <MapStage>
      <AbsoluteFill
        style={{
          padding: "72px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity,
        }}
      >
        <TitleBlock headline="What do you want to make real?" appear={false} />
        <div
          style={{
            marginTop: 48,
            height: 2,
            width: lineW,
            borderTop: `1.5px dashed color-mix(in srgb, ${colors.mapInk} 35%, transparent)`,
          }}
        />
        <p
          style={{
            marginTop: 20,
            fontSize: 15,
            color: colors.mutedAsh,
          }}
        >
          Join the waitlist
        </p>
      </AbsoluteFill>
    </MapStage>
  );
};

/**
 * Cadence promo spine aligned with locked /product outline:
 * P-0 open → map rest → P-1 cascade (slow tempo) → rest line → P-4 ask
 */
export const CadencePromo: React.FC = () => {
  let from = 0;
  const seq = (len: number) => {
    const start = from;
    from += len;
    return start;
  };

  const openAt = seq(SCENES.open);
  const restAt = seq(SCENES.rest);
  const holdAt = seq(SCENES.settleHold);
  const settleAt = seq(SCENES.settle);
  const copyAt = seq(SCENES.settledCopy);
  const askAt = seq(SCENES.ask);

  return (
    <AbsoluteFill style={{ background: colors.deepVoid }}>
      <Sequence from={openAt} durationInFrames={SCENES.open} premountFor={FPS}>
        <OpenScene />
      </Sequence>
      <Sequence from={restAt} durationInFrames={SCENES.rest} premountFor={FPS}>
        <RestScene />
      </Sequence>
      <Sequence from={holdAt} durationInFrames={SCENES.settleHold} premountFor={FPS}>
        <MapStage>
          <AbsoluteFill style={{ padding: "48px 64px 40px" }}>
            <TitleBlock headline="When one thing slips, the rest moves with it." appear={false} />
            <div style={{ marginTop: 36 }}>
              <MapStillLife progress={0} />
            </div>
          </AbsoluteFill>
        </MapStage>
      </Sequence>
      <Sequence from={settleAt} durationInFrames={SCENES.settle} premountFor={FPS}>
        <SettleScene />
      </Sequence>
      <Sequence from={copyAt} durationInFrames={SCENES.settledCopy} premountFor={FPS}>
        <SettledCopyScene />
      </Sequence>
      <Sequence from={askAt} durationInFrames={SCENES.ask} premountFor={FPS}>
        <AskScene />
      </Sequence>
    </AbsoluteFill>
  );
};
