import { describe, expect, it } from "vitest";
import { COPY, copyGuardrailCheck } from "./copy";
import { offsetsForPhase, SETTLE_DURATION_MS, SETTLE_STAGGER_MS } from "./animation/beat2Settle";

describe("copy guardrails", () => {
  it("passes docs/08 guardrail check", () => {
    expect(copyGuardrailCheck()).toEqual([]);
  });

  it("has verbatim beat4 placeholder", () => {
    expect(COPY.beat4.placeholder).toBe("a single, an album, a tour, a year…");
  });
});

describe("beat2 settle", () => {
  it("uses app fast stagger ratio", () => {
    expect(SETTLE_STAGGER_MS).toBe(Math.round(SETTLE_DURATION_MS * 0.85));
  });

  it("accumulates offsets through phases", () => {
    const rest = offsetsForPhase("rest");
    expect(rest.tour).toBeGreaterThan(0);
    expect(rest.single).toBeGreaterThan(0);
    expect(rest.single).toBeLessThan(rest.tour);
    expect(rest.album).toBe(0);
  });
});
