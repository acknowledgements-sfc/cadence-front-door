# Slice 24 — Live verification steps

## Prerequisites

1. Migration `0011_waitlist` is **already live** on `cadence-app` (`bfpslkhwupgahgwyyzha`).
   Source of truth: app repo `supabase/migrations/0011_waitlist.sql` (backfilled session 31).
   The front-door `held-migrations/0011_waitlist.sql` is historical only — do **not** re-apply.
2. Vercel project has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set (same publishable anon key as the app). Never use the service_role key.

## Waitlist write check

1. Open the front-door preview URL (`https://cadence-front-door.vercel.app` or local with `.env`).
2. Scroll to **What do you want to make real?**
3. Enter answer text, e.g. `An EP and a small tour this fall`.
4. Click **Join the waitlist**.
5. In Supabase SQL editor on `cadence-app`:

```sql
select id, answer_text, email, source, created_at
from waitlist
order by created_at desc
limit 5;
```

6. Confirm a row exists with:
   - `answer_text` = submitted text (trimmed)
   - `email` = `NULL` (v1 answer-only)
   - `source` = `front-door`

## Beat sequence checklist

- Beat 0: close-up on Single line (desktop only; mobile skips)
- Beat 1: bright wide six-line floor + Scope copy (scroll-past / slow-load floor)
- Beat 2: tour slips → wide settle; coral stays tight (never red); rest line *Settled — the rest moved with it*
- Beat 3: **dimmed rest frame** (animation end state — Trajectory copy)
- Beat 4: waitlist form with dashed ghost line
- `prefers-reduced-motion: reduce` → static Beat-1 floor + Scope copy (no autoplay)

## Stills (Spec B verify, 2026-07-11)

See [`docs/screenshots/`](docs/screenshots/):

- `desktop-beat0-closeup.png` / `desktop-beat1-floor.png` / `desktop-beat3-dimmed-rest.png` / `desktop-beat4-form.png`
- `desktop-reduced-motion-floor.png`
- `mobile-390-beat1-floor.png` / `mobile-390-beat2-settle.png`
