# Dispatch 24 — Build report (Spec B verify, 2026-07-11)

**Status:** Build complete + Spec B acceptance verified. Waitlist live write confirmed via production UI.

## Commits

| SHA | What |
|-----|------|
| `5e12dc3` | Original animated front door + waitlist + held migration |
| `a33a72c` | Spec C Part 1 aux pages (also carried gate threads / legend / success copy from concurrent Spec B edit) |
| `f016cfe` | Spec B copy/settle test extensions |
| *(verify commit)* | Screenshots + LIVE-CHECK refresh |

## Vercel

https://cadence-front-door.vercel.app

Env present: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (Production + Preview).

## Migration

`0011_waitlist` is **live** on `cadence-app`. App-repo source of truth:
`cadence-cursor-build/supabase/migrations/0011_waitlist.sql`.
Front-door `held-migrations/0011_waitlist.sql` is historical — do not re-apply.

## Copy gate

`npm test` — 11/11 passing (`copyGuardrailCheck` + locked beat strings + settle tempo + aux copy).

## Acceptance verified

1. **Rest frame** — autoplay ends on dimmed Beat 3 + Trajectory copy
2. **Mobile tempo** — skips Beat 0; fast settle (1800/1530)
3. **Gate threads** — quiet dashed connectors from locked `GATES` cast; endpoints include settle offsets
4. **Shape legend** — mini glyphs + labels top-right
5. **Reduced motion** — static Beat-1 Scope floor (headline held after 4s+)
6. **Waitlist** — production submit → success status *"You are on the list. We will be in touch."* (RPC `waitlist_submit` via anon key). SQL row confirm deferred to Cowork (Cursor Supabase connector cannot SELECT).

## Stills

[`docs/screenshots/`](docs/screenshots/) — desktop beats 0/1/3/4, reduced-motion floor, mobile 390 Beat 1 + Beat 2.
