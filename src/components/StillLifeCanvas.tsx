import type { PursuitId, SettleTempo } from "../animation/beat2Settle";
import {
  GATES,
  PURSUITS,
  SHAPE_LEGEND,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  anchorX,
  pursuitById,
  rowY,
  type PursuitLayout,
  type PursuitShape,
} from "../layout/stillLifeLayout";

interface StillLifeCanvasProps {
  offsets: Record<PursuitId, number>;
  tempo: SettleTempo;
  dimmed: boolean;
  showRestLine: boolean;
  restLine: string;
  viewport: { x: number; y: number; w: number; h: number } | null;
  settling: boolean;
}

function healthColor(health: PursuitLayout["health"]): string {
  return health === "ok" ? "var(--map-health-ok)" : "var(--map-health-tight)";
}

function ReleaseLine({ p, y }: { p: PursuitLayout; y: number }) {
  const h = p.throughLine ? 3 : 2;
  return (
    <line
      x1={p.xStart}
      y1={y}
      x2={p.xEnd}
      y2={y}
      stroke={p.colorVar}
      strokeWidth={h}
      strokeLinecap="round"
    />
  );
}

function VisibilityLine({ p, y }: { p: PursuitLayout; y: number }) {
  return (
    <line
      x1={p.xStart}
      y1={y}
      x2={p.xEnd}
      y2={y}
      stroke={p.colorVar}
      strokeWidth={1}
      strokeDasharray="4 6"
      strokeLinecap="round"
      opacity={0.85}
    />
  );
}

function LiveMultiLine({ p, y }: { p: PursuitLayout; y: number }) {
  const ticks = [0.2, 0.45, 0.7, 0.9];
  const span = p.xEnd - p.xStart;
  return (
    <>
      <line
        x1={p.xStart}
        y1={y}
        x2={p.xEnd}
        y2={y}
        stroke={p.colorVar}
        strokeWidth={p.throughLine ? 3 : 2}
        strokeLinecap="round"
      />
      {ticks.map((t) => (
        <line
          key={t}
          x1={p.xStart + span * t}
          y1={y - 5}
          x2={p.xStart + span * t}
          y2={y + 5}
          stroke={p.colorVar}
          strokeWidth={1}
          opacity={0.7}
        />
      ))}
    </>
  );
}

function ExplorationLoop({ p, y }: { p: PursuitLayout; y: number }) {
  const cx = (p.xStart + p.xEnd) / 2;
  const rx = (p.xEnd - p.xStart) / 2 - 4;
  return (
    <ellipse
      cx={cx}
      cy={y}
      rx={Math.max(rx, 24)}
      ry={14}
      fill="none"
      stroke={p.colorVar}
      strokeWidth={1.5}
      strokeDasharray="6 4"
      opacity={0.8}
    />
  );
}

function PursuitShape({ p, y }: { p: PursuitLayout; y: number }) {
  switch (p.shape) {
    case "release":
      return <ReleaseLine p={p} y={y} />;
    case "visibility":
      return <VisibilityLine p={p} y={y} />;
    case "live_multi":
      return <LiveMultiLine p={p} y={y} />;
    case "exploration":
      return <ExplorationLoop p={p} y={y} />;
    default: {
      const _exhaustive: never = p.shape;
      return _exhaustive;
    }
  }
}

/** Quiet gate threads — endpoints include settle offsets so topology tracks the slip. */
function GateThreads({
  offsets,
  dimmed,
}: {
  offsets: Record<PursuitId, number>;
  dimmed: boolean;
}) {
  return (
    <g className="gate-threads" opacity={dimmed ? 0.28 : 0.45}>
      {GATES.map((gate) => {
        const from = pursuitById(gate.from);
        const to = pursuitById(gate.to);
        const x1 = anchorX(from, gate.fromAnchor) + (offsets[from.id] ?? 0);
        const y1 = rowY(from.row);
        const x2 = anchorX(to, gate.toAnchor) + (offsets[to.id] ?? 0);
        const y2 = rowY(to.row);
        return (
          <line
            key={gate.id}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--map-dim)"
            strokeWidth={1}
            strokeDasharray="3 5"
          />
        );
      })}
    </g>
  );
}

function LegendGlyph({ shape }: { shape: PursuitShape }) {
  const stroke = "var(--map-dim)";
  switch (shape) {
    case "release":
      return (
        <line x1={0} y1={6} x2={22} y2={6} stroke={stroke} strokeWidth={2} strokeLinecap="round" />
      );
    case "live_multi":
      return (
        <g>
          <line x1={0} y1={6} x2={22} y2={6} stroke={stroke} strokeWidth={2} strokeLinecap="round" />
          <line x1={6} y1={2} x2={6} y2={10} stroke={stroke} strokeWidth={1} />
          <line x1={12} y1={2} x2={12} y2={10} stroke={stroke} strokeWidth={1} />
          <line x1={18} y1={2} x2={18} y2={10} stroke={stroke} strokeWidth={1} />
        </g>
      );
    case "exploration":
      return (
        <ellipse
          cx={11}
          cy={6}
          rx={10}
          ry={5}
          fill="none"
          stroke={stroke}
          strokeWidth={1.25}
          strokeDasharray="3 2"
        />
      );
    case "visibility":
      return (
        <line
          x1={0}
          y1={6}
          x2={22}
          y2={6}
          stroke={stroke}
          strokeWidth={1.25}
          strokeDasharray="3 3"
          strokeLinecap="round"
        />
      );
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}

function ShapeLegend() {
  return (
    <g className="shape-legend" transform="translate(780, 20)">
      {SHAPE_LEGEND.map((item, i) => (
        <g key={item.label} transform={`translate(0, ${i * 22})`}>
          <g transform="translate(0, 0)">
            <LegendGlyph shape={item.shape} />
          </g>
          <text
            x={30}
            y={9}
            fill="var(--map-dim)"
            fontSize={9}
            fontWeight={600}
            letterSpacing="0.04em"
          >
            {item.label}
          </text>
        </g>
      ))}
    </g>
  );
}

export function StillLifeCanvas({
  offsets,
  tempo,
  dimmed,
  showRestLine,
  restLine,
  viewport,
  settling,
}: StillLifeCanvasProps) {
  const transition = settling
    ? `transform ${tempo.durationMs}ms var(--settle-ease)`
    : "transform 900ms var(--ezoom)";

  const viewBox = viewport
    ? `${viewport.x} ${viewport.y} ${viewport.w} ${viewport.h}`
    : `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`;

  return (
    <svg
      className={`still-life${dimmed ? " still-life--dimmed" : ""}`}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <rect x={0} y={0} width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="var(--map-bg)" />

      <GateThreads offsets={offsets} dimmed={dimmed} />

      {PURSUITS.map((p) => {
        const y = rowY(p.row);
        const ox = offsets[p.id] ?? 0;
        return (
          <g
            key={p.id}
            className="pursuit-group"
            style={{
              transform: `translateX(${ox}px)`,
              transition,
            }}
          >
            <PursuitShape p={p} y={y} />
            <text
              x={p.xStart}
              y={y - 14}
              fill="var(--map-ink)"
              fontSize={11}
              fontWeight={500}
              opacity={dimmed ? 0.45 : 0.9}
            >
              <tspan fill={healthColor(p.health)} fontSize={8} dx={0} dy={0}>
                ●{" "}
              </tspan>
              {p.name}
            </text>
          </g>
        );
      })}

      {!viewport ? <ShapeLegend /> : null}

      {showRestLine ? (
        <text
          x={VIEW_WIDTH / 2}
          y={VIEW_HEIGHT - 36}
          textAnchor="middle"
          fill="var(--color-muted-ash)"
          fontSize={12}
          fontStyle="italic"
          className="settle-rest-line"
        >
          {restLine}
        </text>
      ) : null}
    </svg>
  );
}
