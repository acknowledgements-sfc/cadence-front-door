/**
 * Product-page held-anchor composition of the shared six-line cast.
 * Tour is the quiet load-bearing line (not the visual hero): denser
 * downstream hang-offs, first Movement nearer "now", poised stillness.
 * Homepage PURSUITS stay untouched.
 */

import { GATES, PURSUITS, type GateLink, type PursuitLayout } from "./stillLifeLayout";

function withId(
  id: PursuitLayout["id"],
  patch: Partial<PursuitLayout>,
): PursuitLayout {
  const base = PURSUITS.find((p) => p.id === id);
  if (!base) throw new Error(`Unknown pursuit: ${id}`);
  return { ...base, ...patch };
}

/** Same cast identity; Tour pulled nearer and downstream lines hang tighter. */
export const PRODUCT_PURSUITS: PursuitLayout[] = [
  withId("album", {}),
  withId("albumPush", {}),
  withId("tour", {
    // Near-term: first Movement closer to the left/"now" band.
    xStart: 250,
    xEnd: 490,
    ticks: [0.12, 0.38, 0.62, 0.88],
  }),
  withId("loop", {
    // Hang closer off Tour's end — dependency density, not hero framing.
    xStart: 510,
    xEnd: 650,
  }),
  withId("single", {
    xStart: 590,
    xEnd: 750,
  }),
  withId("singlePush", {
    xStart: 610,
    xEnd: 730,
  }),
];

/** Same gate topology — convergence on Tour is already the structure. */
export const PRODUCT_GATES: GateLink[] = GATES;
