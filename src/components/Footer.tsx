import { Link } from "react-router-dom";
import { AUX_COPY } from "../copy";

export function Footer() {
  return (
    <footer className="site-footer" aria-label="Site">
      <nav className="site-footer__nav">
        <Link to="/privacy">{AUX_COPY.footer.privacy}</Link>
        <span className="site-footer__sep" aria-hidden="true">
          ·
        </span>
        <Link to="/terms">{AUX_COPY.footer.terms}</Link>
        <span className="site-footer__sep" aria-hidden="true">
          ·
        </span>
        <Link to="/contact">{AUX_COPY.footer.contact}</Link>
      </nav>
    </footer>
  );
}
