import { AUX_COPY } from "../copy";
import { AuxPageLayout } from "./AuxPageLayout";

export function ContactPage() {
  const c = AUX_COPY.contact;
  return (
    <AuxPageLayout title={c.title}>
      <p className="aux-page__intro">{c.intro}</p>
      <p className="aux-page__body">{c.body}</p>
      <p className="aux-page__label">{c.emailLabel}</p>
      {/* STRATEGIST-FLAG: confirm support@cadencemgmt.site + Resend inbox routing. */}
      <a className="aux-page__email" href={`mailto:${c.email}`}>
        {c.email}
      </a>
    </AuxPageLayout>
  );
}
