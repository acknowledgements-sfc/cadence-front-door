# Remotion × Cadence map/cascade — evaluation

**Date:** 2026-08-04 · **Home:** `cadence-front-door/remotion-promo` (moved from app repo)

## Decision (locked this session)

**Do both:**

1. **Interactive cascade on `/product`** — StillLifeCanvas / P-1 autoplay-once (web, entrance-triggered). Primary proof surface for visitors.
2. **Remotion MP4** — exportable promo for social/ads, using the same locked copy + slow settle tempo. Not a substitute for the interactive chapter.

Do **not** embed live `MapView` in Remotion. Do **not** replace the front-door demo with a video embed as the only cascade experience.

---

## Verdict (capture)

| Goal | Fit | Notes |
|------|-----|--------|
| Stylized promo / demo video | **Strong** | Frame-accurate, editable, matches locked `/product` spine |
| Pixel-faithful capture of live MapView settle | **Poor** | Live settle is CSS `left`/`width`; Remotion ignores CSS transitions |
| Faithful choreography recreate (tempo + ease + stagger) | **Good** | Ports from `settleOrchestrator` + `--ezoom` |
| Embed live MapView in a composition | **Avoid** | CSS settle won’t render; marketing uses scripted mocks only |

---

## Why live capture fails in Remotion

Cadence cascade settle: React phases `MapState` → CSS transitions geometry. Remotion renders independent frames; wall-clock CSS does not advance. Recreate with `interpolate` + `Easing.bezier(0.32, 0.72, 0, 1)`.

## What ports cleanly

| Token | Value |
|-------|-------|
| Slow duration / stagger | 2400ms / 2040ms |
| `--ezoom` | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Copy | locked `/product` strings |

## Comparison

| Approach | Role |
|----------|------|
| Front-door StillLife / P-1 | Interactive product proof |
| Remotion (this package) | Downloadable / social MP4 |
| Screen-record live app | Only if brief requires “real UI” pixels |

## Open (still)

- Screen-record of settle fixture if a stakeholder needs live chrome — optional, not blocking Remotion + interactive dual path.
