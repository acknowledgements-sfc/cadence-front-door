# Dispatch 24 — Build report

**Date:** 2026-07-06 · **Status:** Build complete, awaiting migration + live verify

## Vercel preview URL

https://cadence-front-door.vercel.app

## Migration (held — for Claude on cadence-app)

[`held-migrations/0011_waitlist.sql`](held-migrations/0011_waitlist.sql)

## Copy gate

`npm test` — 4/4 passing (`copyGuardrailCheck` + settle tempo assertions)

## BUILD-COND compliance

1. **Rest frame** — autoplay ends on dimmed Beat 3 + Trajectory copy (not bright Beat 1 snap-back)
2. **Mobile tempo** — `1800ms / 1530ms` fast; desktop `2400ms / 2040ms` slow (`COPIED-FROM-APP.md`)
3. **Gate threads** — pursuit `<g>` group transforms; gate stubs ride parent `translateX` (no per-frame `d`)

## Stills

[`docs/screenshots/`](docs/screenshots/) — beat1-floor, beat2-settle, beat3-dimmed-rest, beat4-form-fullpage

## Live check

See [`LIVE-CHECK.md`](LIVE-CHECK.md). Waitlist write blocked until `0011` applied and Vercel env vars set.

## Performance note

Beat 2 uses CSS `transform` on grouped SVG `<g>` elements (`will-change: transform`) for compositor-friendly settle. Verify ~60fps on a physical mid-range phone after deploy.
