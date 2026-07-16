/**
 * Verbatim user-facing strings from docs/08-front-door.md
 * plus Spec C Part 1 auxiliary page copy (translated-outward register).
 */

export const APP_URLS = {
  signIn: "https://app.cadencemgmt.site/",
  start: "https://app.cadencemgmt.site/start",
} as const;

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
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    button: "Join the waitlist",
    undertext: "Early access for independent artists. No spam, leave whenever.",
    success: "You are on the list. We will be in touch.",
    successCta: "Start in Cadence",
    sending: "Sending…",
  },
} as const;

/**
 * Spec C Part 1 — cold-reader legal/info pages.
 * STRATEGIST-FLAG: all aux copy is provisional (no locked design doc).
 * STRATEGIST-FLAG: About/manifesto-lite skipped — not trivial narrative.
 */
export const AUX_COPY = {
  footer: {
    signIn: "Sign in",
    start: "Start",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    home: "Cadence",
  },
  header: {
    signIn: "Sign in",
    start: "Start",
  },
  privacy: {
    title: "Privacy",
    intro:
      "Cadence is early access software for independent artists. This page says what is stored and how it is used — plainly.",
    sections: [
      {
        heading: "What is stored",
        body: "Waitlist submissions include the answer text you write and the email address you share so Cadence can invite you. Inside the product, plan data for your pursuits and movements is stored so the map can hold your work. Product analytics use PostHog events without attaching personal identifiers to those events.",
      },
      {
        heading: "Email",
        body: "Transactional email is sent through Resend — for example a weekly settled summary or a quiet-season note, and the magic-link used to sign in. Cadence does not sell contact information or answer text to advertisers.",
      },
      {
        heading: "Leaving",
        body: "You can leave whenever. To ask that account data be removed, write to the contact address on the Contact page.",
      },
    ],
  },
  terms: {
    title: "Terms",
    intro:
      "Cadence is an early-access preview. These terms are short on purpose while the product is still finding its shape.",
    sections: [
      {
        heading: "Early access",
        body: "Features may change. Data you enter may be used to improve the product. Nothing here is a promise of uptime, feature permanence, or a finished contract.",
      },
      {
        heading: "Leave whenever",
        body: "Early access for independent artists. No spam, leave whenever. Leaving the waitlist or the product is always available — write contact if something is stuck.",
      },
      {
        heading: "Your work",
        body: "You keep ownership of the creative work and plans you enter. Cadence stores them to run the product for you, not to claim them.",
      },
    ],
  },
  contact: {
    title: "Contact",
    intro:
      "Email is the support path for early access. There is no live chat and no promised response window beyond what a small team can manage.",
    // Reachable inbox until cadencemgmt.site has inbound mail (outbound Resend only today).
    email: "yo@rcawhatsgood.com",
    emailLabel: "Write to",
    body: "Use this address for account questions, data removal requests, or anything the product cannot answer on its own.",
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

function scanCopyBlob(all: string, errors: string[], label: string): void {
  for (const word of FORBIDDEN) {
    if (all.toLowerCase().includes(word)) {
      errors.push(`${label}: Forbidden word: ${word}`);
    }
  }

  if (all.includes("!")) {
    errors.push(`${label}: Exclamation point found`);
  }
}

/** Self-check guardrails from docs/08 + Spec C aux pages */
export function copyGuardrailCheck(): string[] {
  const errors: string[] = [];
  const landing = JSON.stringify(COPY);
  const aux = JSON.stringify(AUX_COPY);

  scanCopyBlob(landing, errors, "landing");
  scanCopyBlob(aux, errors, "aux");

  if (/\bI\b/.test(COPY.beat2.restLine) || landing.includes('"I ')) {
    errors.push("First-person system voice detected");
  }

  // Aux pages: ban system-voice "I " in quoted strings (artists may see "you/your").
  if (/"I /.test(aux) || aux.includes('"I ')) {
    errors.push("aux: First-person system voice detected");
  }

  if (!landing.includes("second nature")) {
    errors.push('Missing "second nature"');
  }

  if (!landing.includes("You don't just have releases")) {
    errors.push("Scope headline missing");
  }

  if (!landing.includes("whole way through")) {
    errors.push("Trajectory headline missing");
  }

  if (!aux.includes("leave whenever")) {
    errors.push('aux: Terms must echo "leave whenever"');
  }

  if (!aux.includes(AUX_COPY.contact.email)) {
    errors.push("aux: Contact email missing");
  }

  return errors;
}
