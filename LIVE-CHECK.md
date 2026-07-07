# Slice 24 — Live verification steps

## Prerequisites

1. Claude applies `held-migrations/0011_waitlist.sql` on `cadence-app` (`bfpslkhwupgahgwyyzha`).
2. Vercel project has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set (same publishable anon key as the app).

## Waitlist write check

1. Open the front-door preview URL.
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

## Beat 2 performance (mobile)

1. Open preview on a mid-range phone or Chrome DevTools mobile emulation (390px width).
2. Reload — Beat 2 settle should run (skip Beat 0 close-up on mobile).
3. Confirm animation feels smooth (~60fps); transforms only, no path `d` animation.

## Stills checklist

- Beat 0: close-up on Single line (desktop only)
- Beat 1: bright wide six-line floor + Scope copy
- Beat 2: mid-settle + rest line *Settled — the rest moved with it*
- Beat 3: **dimmed rest frame** (animation end state — not bright Beat 1)
- Beat 4: waitlist form with dashed ghost line
