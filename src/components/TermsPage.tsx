import { AUX_COPY } from "../copy";
import { AuxPageLayout } from "./AuxPageLayout";

export function TermsPage() {
  const c = AUX_COPY.terms;
  return (
    <AuxPageLayout title={c.title}>
      <p className="aux-page__intro">{c.intro}</p>
      {c.sections.map((s) => (
        <section key={s.heading} className="aux-page__section">
          <h2 className="aux-page__heading">{s.heading}</h2>
          <p className="aux-page__body">{s.body}</p>
        </section>
      ))}
    </AuxPageLayout>
  );
}
