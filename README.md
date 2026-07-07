# Cadence Front Door

Public waitlist / first-impression page (Dispatch 24). Separate Vite project from the main Cadence app.

## Development

```bash
npm install
cp .env.example .env.local   # add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm run dev
```

## Build

```bash
npm run build
npm test
```

## Database

Migration `held-migrations/0011_waitlist.sql` is **held** for Claude to apply on `cadence-app`. See `LIVE-CHECK.md`.

## Design tokens

Copied values from the app repo are documented in `COPIED-FROM-APP.md`.
