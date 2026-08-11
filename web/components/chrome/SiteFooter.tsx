import Link from "next/link";
import { SERVICES, SITE, mailHref, telHref } from "@/content/site";
import { Brand } from "./Brand";
import { HashLink } from "./HashLink";

/* The year is stamped at build time. Static export has no runtime to compute it in,
   and resolving it on the client would mean shipping HTML that disagrees with what
   React renders on mount. */
const YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="ft">
      <div className="wrap ft__in">
        <div className="ft__brand">
          <Brand size={44} />
          <p className="ft__tag">Build stronger. Live better.</p>
        </div>

        <nav className="ft__nav" aria-label="Footer">
          <div>
            <h2>Care</h2>
            {SERVICES.map((s) => (
              <Link key={s.slug} href={`/${s.slug}/`}>
                {s.menuLabel}
              </Link>
            ))}
          </div>
          <div>
            <h2>Clinic</h2>
            <HashLink hash="approach">Approach</HashLink>
            <HashLink hash="conditions">What we treat</HashLink>
            <HashLink hash="recovery">Recovery at a glance</HashLink>
            <HashLink hash="doctor">The team</HashLink>
            <HashLink hash="results">Reviews</HashLink>
          </div>
          <div>
            <h2>Contact</h2>
            <a href={telHref}>{SITE.phoneLabel}</a>
            <a href={mailHref}>{SITE.email}</a>
            <HashLink hash="visit">{SITE.address.streetShort}</HashLink>
            <a href={SITE.instagram} target="_blank" rel="noopener">
              Instagram
            </a>
          </div>
        </nav>
      </div>

      <div className="wrap ft__base">
        <p>
          &copy; <span id="yr">{YEAR}</span> {SITE.name}. All rights reserved.
        </p>
        <p className="ft__note">
          Dr. David Perez-Espinosa, PT, DPT <i>&middot;</i> Miami, Florida
        </p>
      </div>
    </footer>
  );
}
