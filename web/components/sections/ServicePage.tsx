import Link from "next/link";
import type { ReactNode } from "react";
import { SITE, byRelatedOrder, mailHref, telHref } from "@/content/site";
import { ArrowIcon, PhoneIcon } from "@/components/icons";
import { Picture } from "@/components/Picture";

/* The chrome every service page shares: breadcrumb hero, related-pages grid and the
   closing call band. This is what shell() in tools/build-pages.py assembled. */

export type HeroImage = {
  stem: string;
  widths: number[];
  fallback: string;
  width: number;
  height: number;
  alt: string;
};

type HeroProps = {
  nav: string;
  eyebrow: string;
  /* the static build splits the h1 on <br> into spans so assistive tech reads a word
     gap rather than running the two halves together */
  h1: string[];
  lead: string;
  cta: string;
  cta2?: string;
  cta2Href?: string;
  image: HeroImage;
};

export function PageHero({
  nav,
  eyebrow,
  h1,
  lead,
  cta,
  cta2 = "Other ways to reach us",
  cta2Href = "/#book",
  image,
}: HeroProps) {
  return (
    <section className="phero">
      <div className="sec__grain" aria-hidden="true" />
      <div className="wrap phero__in">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{nav}</span>
        </nav>
        <div className="phero__copy">
          <p className="eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="phero__h">
            {h1.map((line) => (
              <span className="ln" key={line}>
                {line}
              </span>
            ))}
          </h1>
          <p className="lead">{lead}</p>
          <div className="hero__cta">
            <a className="btn btn--primary btn--lg" href={telHref}>
              <PhoneIcon />
              Call about {cta}
            </a>
            <Link className="btn btn--ghost btn--lg" href={cta2Href}>
              {cta2}
              <ArrowIcon />
            </Link>
          </div>
        </div>
        <figure className="phero__fig">
          <Picture {...image} priority />
        </figure>
      </div>
    </section>
  );
}

const WORDS: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
};

export function RelatedPages({ slug }: { slug: string }) {
  const others = byRelatedOrder(slug);
  return (
    <section className="sec sec--bone rel" aria-labelledby="rel-h">
      <div className="wrap">
        <p className="kicker">Also at BodyForge</p>
        <h2 className="h2 rel__h" id="rel-h">
          The other {WORDS[others.length] ?? others.length}
        </h2>
        <div className="rel__grid">
          {others.map((o) => (
            <Link className="rel__i" key={o.slug} href={`/${o.slug}/`}>
              <span className="rel__t">{o.nav}</span>
              <span className="rel__d">{o.relBlurb}</span>
              <ArrowIcon />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ heading, hours }: { heading: string; hours?: ReactNode }) {
  return (
    <section className="sec cta" aria-labelledby="cta-h">
      <div className="wrap cta__in">
        <div>
          <h2 className="h2" id="cta-h">
            {heading}
          </h2>
          <p className="lead">
            Appointments are arranged on the phone. Two minutes of hearing what happened tells us
            more than a form does, and you will know before you hang up whether this is the right
            place for it.
          </p>
        </div>
        <div className="cta__act">
          <a className="btn btn--primary btn--lg" href={telHref}>
            <PhoneIcon />
            Call {SITE.phoneLabel}
          </a>
          <a className="btn btn--ghost btn--lg" href={mailHref}>
            Email the clinic
          </a>
          <p className="cta__addr">
            3600 W Flagler St, Miami FL 33135 <i>&middot;</i>{" "}
            {hours ?? (
              <>
                Mon, Wed, Fri 7am&ndash;4pm <i>&middot;</i> Tue, Thu 10am&ndash;7pm
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── shared section shapes the four service bodies are built from ───────────── */

export function FourWay({ children, cols = 3 }: { children: ReactNode; cols?: number }) {
  return <div className={`fourway fourway--${cols}`}>{children}</div>;
}

export function SplitFigure({ image }: { image: HeroImage & { sizes?: string } }) {
  return (
    <figure className="split__fig">
      <Picture {...image} sizes={image.sizes ?? "(max-width: 900px) 100vw, 44vw"} />
    </figure>
  );
}
