import { APP_URLS, AUX_COPY } from "../copy";

export function SiteHeader() {
  return (
    <header className="site-header" aria-label="Cadence">
      <nav className="site-header__nav">
        <a href={APP_URLS.signIn}>{AUX_COPY.header.signIn}</a>
        <span className="site-header__sep" aria-hidden="true">
          ·
        </span>
        <a href={APP_URLS.start}>{AUX_COPY.header.start}</a>
      </nav>
    </header>
  );
}
