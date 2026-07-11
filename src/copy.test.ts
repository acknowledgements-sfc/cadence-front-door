import { describe, expect, it } from "vitest";
import { COPY, AUX_COPY, copyGuardrailCheck } from "./copy";
import { offsetsForPhase, SETTLE_DURATION_MS, SETTLE_STAGGER_MS } from "./animation/beat2Settle";

describe("copy guardrails", () => {
  it("passes docs/08 guardrail check", () => {
    expect(copyGuardrailCheck()).toEqual([]);
  });

  it("has verbatim beat4 placeholder", () => {
    expect(COPY.beat4.placeholder).toBe("a single, an album, a tour, a year…");
  });

  it("has locked beat headlines and observational rest line", () => {
    expect(COPY.beat1.headline).toBe("You don't just have releases. You have a career.");
    expect(COPY.beat2.headline).toBe("When one thing slips, the rest moves with it.");
    expect(COPY.beat2.restLine).toBe("Settled — the rest moved with it");
    expect(COPY.beat3.headline).toBe("Not built for one release. Built for the whole way through.");
    expect(COPY.beat4.question).toBe("What do you want to make real?");
  });

  it("keeps waitlist success observational (no first-person system voice)", () => {
    expect(COPY.beat4.success).toBe("You are on the list. We will be in touch.");
    expect(/\bI\b/.test(COPY.beat4.success)).toBe(false);
    expect(COPY.beat4.success.includes("!")).toBe(false);
  });
});

describe("aux page copy", () => {
  it("echoes leave whenever in terms", () => {
    const termsBlob = JSON.stringify(AUX_COPY.terms);
    expect(termsBlob.toLowerCase()).toContain("leave whenever");
  });

  it("exposes the support email", () => {
    expect(AUX_COPY.contact.email).toBe("yo@rcawhatsgood.com");
  });

  it("footer labels cover privacy, terms, contact", () => {
    expect(AUX_COPY.footer.privacy).toBe("Privacy");
    expect(AUX_COPY.footer.terms).toBe("Terms");
    expect(AUX_COPY.footer.contact).toBe("Contact");
  });

  it("has no forbidden words in aux copy", () => {
    const all = JSON.stringify(AUX_COPY).toLowerCase();
    for (const word of [
      "release planner",
      "project",
      "dashboard",
      "timeline",
      "notification",
      "alert",
      "deadline",
      "instinct",
    ]) {
      expect(all).not.toContain(word);
    }
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

  it("leaves album and album push unmoved (gravitational center holds)", () => {
    const rest = offsetsForPhase("rest");
    expect(rest.album).toBe(0);
    expect(rest.albumPush).toBe(0);
    expect(rest.loop).toBeGreaterThan(0);
    expect(rest.singlePush).toBeGreaterThan(0);
  });
});
