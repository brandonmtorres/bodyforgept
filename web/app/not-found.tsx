import type { Metadata } from "next";
import Link from "next/link";
import { SITE, telHref } from "@/content/site";
import { PhoneIcon } from "@/components/icons";
import { CtaBand } from "@/components/sections/ServicePage";

export const metadata: Metadata = {
  title: "Page not found | BodyForge Physical Therapy",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <section className="phero">
        <div className="sec__grain" aria-hidden="true" />
        <div className="wrap phero__in">
          <div className="phero__copy">
            <p className="eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />
              404
            </p>
            <h1 className="phero__h">
              <span className="ln">That page</span>
              <span className="ln">is not here</span>
            </h1>
            <p className="lead">
              The link may be old, or the address slightly off. Everything the clinic offers is one
              click away on the home page, and the phone is always the fastest route.
            </p>
            <div className="hero__cta">
              <a className="btn btn--primary btn--lg" href={telHref}>
                <PhoneIcon />
                Call {SITE.phoneLabel}
              </a>
              <Link className="btn btn--ghost btn--lg" href="/">
                Back to the home page
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand heading="Tell us what you were looking for" />
    </>
  );
}
