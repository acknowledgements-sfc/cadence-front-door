import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { CAST, GATES, type Health, type PursuitLine } from "./cast";
import { colors, EZOOM } from "./tokens";

const ROW_H = 72;
const TOP = 48;
const LABEL_W = 148;

const healthColor = (h: Health) => {
  if (h === "slipping") return colors.warning;
  if (h === "tight") return colors.caution;
  return colors.success;
};

const ezoom = Easing.bezier(...EZOOM);

export type MapProgress = {
  /** 0 = before, 1 = fully settled */
  t: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lineSpan(line: PursuitLine, t: number): [number, number] {
  return [lerp(line.before[0], line.after[0], t), lerp(line.before[1], line.after[1], t)];
}

type MapStillLifeProps = {
  /** Global settle progress 0–1 (already eased), or per-line via getLineT */
  progress?: number;
  getLineT?: (line: PursuitLine) => number;
  showLabels?: boolean;
  dimNonMoving?: boolean;
};

export const MapStillLife: React.FC<MapStillLifeProps> = ({
  progress = 0,
  getLineT,
  showLabels = true,
  dimNonMoving = false,
}) => {
  const mapH = TOP + CAST.length * ROW_H;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: mapH,
        background: colors.mapBg,
        borderRadius: 12,
        border: `1px solid color-mix(in srgb, ${colors.mapInk} 10%, transparent)`,
        overflow: "hidden",
      }}
    >
      {/* faint time grid */}
      {[20, 40, 60, 80].map((x) => (
        <div
          key={x}
          style={{
            position: "absolute",
            left: `${LABEL_W + ((100 - LABEL_W / 10) * x) / 100}%`,
            top: 0,
            bottom: 0,
            width: 1,
            background: `color-mix(in srgb, ${colors.mapDim} 35%, transparent)`,
          }}
        />
      ))}

      {GATES.map((g, i) => {
        const t = progress;
        const x = lerp(g.xBefore, g.xAfter, t);
        const y1 = TOP + g.fromRow * ROW_H + 28;
        const y2 = TOP + g.toRow * ROW_H + 28;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(${LABEL_W}px + (100% - ${LABEL_W}px) * ${x / 100})`,
              top: y1,
              height: y2 - y1,
              width: 1,
              background: colors.mapDim,
              opacity: 0.45,
            }}
          />
        );
      })}

      {CAST.map((line) => {
        const t = getLineT ? getLineT(line) : progress;
        const [start, end] = lineSpan(line, t);
        const y = TOP + line.row * ROW_H;
        const widthPct = Math.max(end - start, 2);
        const leftExpr = `calc(${LABEL_W}px + (100% - ${LABEL_W}px) * ${start / 100})`;
        const widthExpr = `calc((100% - ${LABEL_W}px) * ${widthPct / 100})`;
        const isExploration = line.kind === "exploration";
        const opacity =
          dimNonMoving && line.settleRank < 0 ? 0.45 : dimNonMoving && t < 0.02 ? 0.85 : 1;

        return (
          <div key={line.id} style={{ position: "absolute", left: 0, right: 0, top: y, height: 56, opacity }}>
            {showLabels ? (
              <div
                style={{
                  position: "absolute",
                  left: 16,
                  top: 14,
                  width: LABEL_W - 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 13,
                  letterSpacing: "0.02em",
                  color: colors.mapInk,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: healthColor(line.health),
                    flexShrink: 0,
                  }}
                />
                <span style={{ opacity: 0.88, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {line.label}
                </span>
              </div>
            ) : null}

            {isExploration ? (
              <div
                style={{
                  position: "absolute",
                  left: leftExpr,
                  top: 12,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: `1.5px dashed ${line.color}`,
                  opacity: 0.85,
                }}
              />
            ) : (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: leftExpr,
                    top: 26,
                    width: widthExpr,
                    height: 3,
                    borderRadius: 2,
                    background: line.color,
                    opacity: 0.92,
                  }}
                />
                {/* terminus stop */}
                <div
                  style={{
                    position: "absolute",
                    left: `calc(${LABEL_W}px + (100% - ${LABEL_W}px) * ${end / 100} - 5px)`,
                    top: 21,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    border: `1.5px solid ${line.color}`,
                    background: colors.mapBg,
                  }}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Per-line staggered settle using Cadence slow tempo.
 * Source (rank 0) moves first; higher ranks delay by stagger × rank fraction.
 */
export function useStaggeredSettle(opts: {
  startFrame: number;
  durationFrames: number;
  staggerFrames: number;
}): { getLineT: (line: PursuitLine) => number; globalT: number } {
  const frame = useCurrentFrame();
  const { startFrame, durationFrames, staggerFrames } = opts;

  const getLineT = (line: PursuitLine) => {
    if (line.settleRank < 0) return 0;
    const delay = Math.round(staggerFrames * (line.settleRank / 2));
    const local = frame - startFrame - delay;
    return interpolate(local, [0, durationFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ezoom,
    });
  };

  const globalT = interpolate(frame - startFrame, [0, durationFrames + staggerFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ezoom,
  });

  return { getLineT, globalT };
}

export const MapStage: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <AbsoluteFill
    style={{
      background: colors.deepVoid,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);
