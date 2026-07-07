/**
 * Verbatim user-facing strings from docs/08-front-door.md
 */

export const COPY = {
  beat1: {
    headline: "You don't just have releases. You have a career.",
    sub: "Singles, the album, the tour, the ideas you're still chasing — Cadence holds all of it in one place, not one drop at a time.",
  },
  beat2: {
    headline: "When one thing slips, the rest moves with it.",
    sub: "No scramble, no pile-up gone red. One line moves and the canvas settles around it — the way a careful team would handle it for you.",
    restLine: "Settled — the rest moved with it",
  },
  beat3: {
    headline: "Not built for one release. Built for the whole way through.",
    sub: "It stays with you between drops, learns how you actually work, and starts to feel less like a tool and more like second nature for your whole career.",
  },
  beat4: {
    question: "What do you want to make real?",
    placeholder: "a single, an album, a tour, a year…",
    button: "Join the waitlist",
    undertext: "Early access for independent artists. No spam, leave whenever.",
  },
} as const;

const FORBIDDEN = [
  "release planner",
  "project",
  "dashboard",
  "timeline",
  "notification",
  "alert",
  "deadline",
  "instinct",
];

/** Self-check guardrails from docs/08 */
export function copyGuardrailCheck(): string[] {
  const errors: string[] = [];
  const all = JSON.stringify(COPY);

  for (const word of FORBIDDEN) {
    if (all.toLowerCase().includes(word)) {
      errors.push(`Forbidden word: ${word}`);
    }
  }

  if (all.includes("!")) {
    errors.push("Exclamation point found");
  }

  if (/\bI\b/.test(COPY.beat2.restLine) || all.includes('"I ')) {
    errors.push("First-person system voice detected");
  }

  if (!all.includes("second nature")) {
    errors.push('Missing "second nature"');
  }

  if (!all.includes("You don't just have releases")) {
    errors.push("Scope headline missing");
  }

  if (!all.includes("whole way through")) {
    errors.push("Trajectory headline missing");
  }

  return errors;
}
