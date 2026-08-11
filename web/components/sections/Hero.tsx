import Link from "next/link";
import { SITE, telHref } from "@/content/site";
import { ArrowIcon, PhoneIcon } from "@/components/icons";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="hero__grain" aria-hidden="true" />
      <div className="hero__in">
        <div className="hero__head">
          <p className="eyebrow rv" data-rv="1">
            <span className="eyebrow__dot" aria-hidden="true" />
            Doctor of Physical Therapy <i>&middot;</i> Miami
          </p>

          <h1 className="hero__h" id="hero-h">
            <span className="rv" data-rv="2">
              One patient
            </span>
            <span className="rv" data-rv="3">
              at a time.
            </span>
          </h1>
        </div>

        <div className="hero__body">
          <p className="hero__lead rv" data-rv="4">
            Every session at BodyForge is one-to-one with a licensed clinician, start to finish. We
            find out what is actually holding you back, build a plan around it, and measure again so
            you can see it working.
          </p>

          <div className="hero__cta rv" data-rv="5">
            <a className="btn btn--primary btn--lg" href={telHref}>
              <PhoneIcon />
              Call {SITE.phoneLabel}
            </a>
            <Link className="btn btn--ghost btn--lg" href="#conditions">
              See what we treat
              <ArrowIcon />
            </Link>
          </div>
        </div>

        {/* A plain div rather than a figure now: with the review caption gone there is
            nothing here to caption. The review itself is unchanged in "Three patients,
            unedited" further down, so nothing is lost by dropping the duplicate. */}
        <div className="hero__fig rv" data-rv="3">
          {/* The mark stands in for the photograph: enlarged, held back into the ink
              ground and lit from behind, so it reads as the practice's emblem rather
              than a logo pasted into the layout. It carries no information the header
              does not already give, so it is hidden from assistive tech. */}
          <div className="hero__mark" aria-hidden="true">
            <span className="hero__bloom" />
            {/* eslint-disable-next-line @next/next/no-img-element -- a fixed-size brand
                mark with nothing for the optimizer to do, and export mode has no
                optimizer anyway */}
            <img
              className="hero__logo"
              src="/media/mark-light.png"
              alt=""
              width={512}
              height={570}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>

        <dl className="creds rv" data-rv="6">
          <div className="creds__i">
            <dt>Credential</dt>
            <dd>
              PT, DPT <span>Doctor of Physical Therapy on staff</span>
            </dd>
          </div>
          <div className="creds__i">
            <dt>Appointment</dt>
            <dd>
              One&#8209;to&#8209;one <span>Same clinician, first visit to last</span>
            </dd>
          </div>
          <div className="creds__i">
            <dt>Faculty role</dt>
            <dd>
              Program Director{" "}
              <span>Geriatrics group, Florida Physical Therapy Association</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
