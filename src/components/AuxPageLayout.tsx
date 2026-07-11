import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { AUX_COPY } from "../copy";

type AuxPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export function AuxPageLayout({ title, children }: AuxPageLayoutProps) {
  return (
    <div className="aux-page">
      <header className="aux-page__header">
        <Link to="/" className="aux-page__home">
          {AUX_COPY.footer.home}
        </Link>
      </header>
      <article className="aux-page__frame">
        <h1 className="aux-page__title">{title}</h1>
        {children}
      </article>
    </div>
  );
}
