import { Link } from "react-router-dom";
import { APP_URLS, AUX_COPY, COPY } from "../copy";

export function SiteHeader() {
  return (
    <header className="site-header" aria-label="Cadence">
      <nav className="site-header__nav">
        <Link to="/product">{COPY.product.navLink}</Link>
        <span className="site-header__sep" aria-hidden="true">
          ·
        </span>
        <a href={APP_URLS.signIn}>{AUX_COPY.header.signIn}</a>
        <span className="site-header__sep" aria-hidden="true">
          ·
        </span>
        <a href={APP_URLS.start}>{AUX_COPY.header.start}</a>
      </nav>
    </header>
  );
}
