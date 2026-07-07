# Values copied from cadence-cursor-build (no shared package)

Documented for drift visibility. Source paths are relative to the app repo.

| Value | Copied value | Source |
|-------|--------------|--------|
| Iris palette CSS vars | `--color-accent`, surfaces, parchment, etc. | `docs/03-design-system.md`, `src/index.css` |
| Map track colors | `--map-c1`–`c4` | `src/index.css` |
| Settle ease | `cubic-bezier(0.32, 0.72, 0, 1)` as `--ezoom` | `docs/03-design-system.md`, `docs/05-canvas-and-four-views.md` |
| Desktop settle tempo | `SETTLE_SLOW_DURATION_MS = 2400`, `SETTLE_SLOW_STAGGER_MS = 2040` | `src/features/settle/settleOrchestrator.ts` |
| Mobile settle tempo | `SETTLE_DURATION_MS = 1800`, `SETTLE_STAGGER_MS = 1530` | `src/features/settle/settleOrchestrator.ts` |
| Inter type scale | display / headline / body / label | `docs/03-design-system.md` |
| Zoom transition | 900ms, `--ezoom` | `docs/05-canvas-and-four-views.md` |
