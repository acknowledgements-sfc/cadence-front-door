import { useState, type FormEvent } from "react";
import { COPY } from "../copy";
import { submitWaitlist } from "../lib/waitlistSubmit";

export function WaitlistForm() {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = answer.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMsg("");

    const result = await submitWaitlist(trimmed);
    if (result.ok) {
      setStatus("success");
      setAnswer("");
    } else {
      setStatus("error");
      setErrorMsg(result.error);
    }
  }

  return (
    <section className="ask-section" aria-labelledby="ask-heading">
      <div className="ask-section__frame">
        <svg className="ask-section__ghost-line" viewBox="0 0 400 40" aria-hidden>
          <line
            x1={20}
            y1={20}
            x2={380}
            y2={20}
            stroke="var(--map-dim)"
            strokeWidth={1.5}
            strokeDasharray="8 8"
            opacity={0.35}
          />
        </svg>

        <h2 id="ask-heading" className="ask-section__question">
          {COPY.beat4.question}
        </h2>

        {status === "success" ? (
          <p className="ask-section__success" role="status">
            {COPY.beat4.success}
          </p>
        ) : (
          <form className="ask-section__form" onSubmit={handleSubmit}>
            <label htmlFor="waitlist-answer" className="sr-only">
              {COPY.beat4.question}
            </label>
            <textarea
              id="waitlist-answer"
              className="ask-section__input"
              placeholder={COPY.beat4.placeholder}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={3}
              maxLength={2000}
              disabled={status === "loading"}
              required
            />
            <button type="submit" className="ask-section__button" disabled={status === "loading"}>
              {status === "loading" ? COPY.beat4.sending : COPY.beat4.button}
            </button>
            {status === "error" ? (
              <p className="ask-section__error" role="alert">
                {errorMsg}
              </p>
            ) : null}
          </form>
        )}

        <p className="ask-section__undertext">{COPY.beat4.undertext}</p>
      </div>
    </section>
  );
}
