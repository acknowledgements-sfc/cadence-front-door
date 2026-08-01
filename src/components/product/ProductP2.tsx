import { useCallback, useEffect, useRef, useState } from "react";
import { COPY } from "../../copy";
import { prefersReducedMotion } from "../../animation/beat2Settle";
import {
  ALTITUDE_ORDER,
  DETAIL_FIXTURE,
  LINE_EYEBROW,
  LINE_MOVEMENTS,
  MAP_LINES,
  TAB_HOLD_MS,
  TASK_FIXTURE,
  type AltitudeId,
} from "../../fixtures/productAltitudeFixtures";

function MapFrame() {
  return (
    <div className="altitude-mock altitude-mock--map" data-altitude="map">
      {/* Health dots only — never % handled at Map altitude. */}
      <svg className="altitude-mock__svg" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {MAP_LINES.map((line, i) => {
          const y = 48 + i * 48;
          const x1 = 40 + (i % 3) * 12;
          const x2 = 520 + (i % 2) * 40;
          return (
            <g key={line.id}>
              <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke={i === 2 ? "var(--map-c2)" : i % 2 === 0 ? "var(--map-c1)" : "var(--map-c4)"}
                strokeWidth={i === 2 || i === 0 ? 2.5 : 1.5}
                strokeLinecap="round"
                strokeDasharray={line.id.includes("Push") || line.id === "loop" ? "4 6" : undefined}
                opacity={line.id === "loop" ? 0.75 : 1}
              />
              <circle
                cx={x1 + 8}
                cy={y - 12}
                r={3.5}
                fill={line.health === "ok" ? "var(--map-health-ok)" : "var(--map-health-tight)"}
              />
              <text x={x1 + 18} y={y - 9} fill="var(--map-ink)" fontSize={11} fontWeight={500}>
                {line.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function LineFrame() {
  return (
    <div className="altitude-mock altitude-mock--line" data-altitude="line">
      {/* Movements + handled effort — never task panels at Line altitude. */}
      <p className="altitude-mock__eyebrow">{LINE_EYEBROW}</p>
      <div className="altitude-line">
        <div className="altitude-line__spine" aria-hidden />
        {LINE_MOVEMENTS.map((m) => (
          <div
            key={m.id}
            className={`altitude-line__stop${m.focus ? " altitude-line__stop--focus" : ""}`}
          >
            <span
              className={`altitude-line__pip altitude-line__pip--${m.health}`}
              aria-hidden
            />
            <span className="altitude-line__name">{m.name}</span>
            <span className="altitude-line__meta">
              <span className="altitude-line__handled">{handledLabel(m.handled)}</span>
              <span className="altitude-line__date">{m.date}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function handledLabel(handled: "held" | "open" | "waiting"): string {
  if (handled === "held") return "Held";
  if (handled === "waiting") return "Waiting";
  return "Open";
}

function DetailFrame() {
  return (
    <div className="altitude-mock altitude-mock--detail" data-altitude="detail">
      <p className="altitude-mock__eyebrow">{DETAIL_FIXTURE.crumb}</p>
      <h3 className="altitude-mock__title">{DETAIL_FIXTURE.title}</h3>
      <p className="altitude-mock__meta">{DETAIL_FIXTURE.meta}</p>
      <div className="altitude-detail__block">
        <p className="altitude-detail__label">Blocking</p>
        <p className="altitude-detail__body">{DETAIL_FIXTURE.blocking}</p>
      </div>
      <div className="altitude-detail__block">
        <p className="altitude-detail__label">At risk</p>
        <p className="altitude-detail__body">{DETAIL_FIXTURE.atRisk}</p>
      </div>
    </div>
  );
}

function TaskFrame() {
  return (
    <div className="altitude-mock altitude-mock--task" data-altitude="task">
      <div className="altitude-task__main">
        <h3 className="altitude-mock__title">{TASK_FIXTURE.name}</h3>
        <p className="altitude-mock__meta">{TASK_FIXTURE.date}</p>
        <div className="altitude-task__status">
          <span className="altitude-task__status-label">Status</span>
          <span className="altitude-task__status-value">{TASK_FIXTURE.status}</span>
        </div>
      </div>
      <div className="altitude-task__dep">
        <p className="altitude-detail__label">{TASK_FIXTURE.dep.label}</p>
        <p className="altitude-task__dep-name">{TASK_FIXTURE.dep.name}</p>
        <p className="altitude-mock__meta">{TASK_FIXTURE.dep.state}</p>
      </div>
    </div>
  );
}

function Frame({ id }: { id: AltitudeId }) {
  switch (id) {
    case "map":
      return <MapFrame />;
    case "line":
      return <LineFrame />;
    case "detail":
      return <DetailFrame />;
    case "task":
      return <TaskFrame />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

const TAB_KEYS = ALTITUDE_ORDER;

export function ProductP2() {
  const reduced = prefersReducedMotion();
  const [active, setActive] = useState<AltitudeId>("map");
  const [manual, setManual] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advance = useCallback(() => {
    setActive((prev) => {
      const idx = TAB_KEYS.indexOf(prev);
      return TAB_KEYS[(idx + 1) % TAB_KEYS.length];
    });
  }, []);

  useEffect(() => {
    if (reduced || manual || paused) {
      clearTimer();
      return;
    }
    clearTimer();
    timerRef.current = setTimeout(advance, TAB_HOLD_MS);
    return clearTimer;
  }, [active, reduced, manual, paused, advance, clearTimer]);

  const handleTabClick = (id: AltitudeId) => {
    setManual(true);
    clearTimer();
    setActive(id);
  };

  const tabCopy = COPY.product.p2.tabs;

  if (reduced) {
    return (
      <section className="product-chapter" aria-labelledby="product-p2-headline">
        <div className="product-chapter__copy">
          <h2 id="product-p2-headline" className="product-chapter__headline">
            {COPY.product.p2.headline}
          </h2>
          <p className="product-chapter__sub">{COPY.product.p2.sub}</p>
        </div>
        <div className="product-p2__stacked">
          {TAB_KEYS.map((id) => (
            <div key={id} className="product-p2__stacked-item">
              <div className="product-p2__stacked-header">
                <span className="product-p2__tab-label">{tabCopy[id].label}</span>
                <span className="product-p2__tab-job">{tabCopy[id].job}</span>
              </div>
              <div className="product-p2__stage product-p2__stage--static">
                <Frame id={id} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="product-chapter" aria-labelledby="product-p2-headline">
      <div className="product-chapter__copy">
        <h2 id="product-p2-headline" className="product-chapter__headline">
          {COPY.product.p2.headline}
        </h2>
        <p className="product-chapter__sub">{COPY.product.p2.sub}</p>
      </div>

      <div
        className="product-p2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        <div className="product-p2__tabs" role="tablist" aria-label="Four altitudes">
          {TAB_KEYS.map((id) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`product-tab-${id}`}
                aria-selected={isActive}
                aria-controls={`product-panel-${id}`}
                className={`product-p2__tab${isActive ? " product-p2__tab--active" : ""}`}
                onClick={() => handleTabClick(id)}
              >
                <span className="product-p2__tab-label">{tabCopy[id].label}</span>
                {isActive ? (
                  <span className="product-p2__tab-job">{tabCopy[id].job}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="product-p2__stage">
          {TAB_KEYS.map((id) => (
            <div
              key={id}
              role="tabpanel"
              id={`product-panel-${id}`}
              aria-labelledby={`product-tab-${id}`}
              hidden={active !== id}
              className="product-p2__panel"
            >
              {active === id ? <Frame id={id} /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
