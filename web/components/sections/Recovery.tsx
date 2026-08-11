import Link from "next/link";
import { SITE, telHref } from "@/content/site";
import { ArrowIcon, PhoneIcon } from "@/components/icons";

/* Deliberately light. The rates, the first responder program and the partner roadmap
   all live on /weekend-recovery/; this section explains what the service is and
   hands off. */

const MODALITIES = [
  ["Manual massage", "Soft-tissue work through the muscle and fascia that has tightened up."],
  [
    "Assisted stretching",
    "Someone else holds the position, so the stretch reaches range you cannot hold alone.",
  ],
  [
    "Joint mobilization",
    "Graded pressure at the joint to restore glide where it has stopped moving fully.",
  ],
  ["Cupping", "Suction that lifts the tissue rather than pressing into it."],
  ["Theragun", "Percussive therapy, used to take the edge off a muscle quickly."],
  [
    "Normatec compression",
    "Boots that inflate from the foot up to flush the legs after a heavy week.",
  ],
];

const WHY = [
  {
    h: "Licensed clinicians",
    p: "The people who run your recovery session are the people who run the rehab floor. They know when to press and when to stop.",
  },
  {
    h: "Thirty minutes",
    p: "Long enough to change how you feel, short enough to fit a Saturday morning around everything else.",
  },
  {
    h: "No lock-in",
    p: "Start with a single session. Membership exists because people ask for it, not because you have to sign anything to walk in.",
  },
];

export function Recovery() {
  return (
    <section className="sec rec" id="recovery" aria-labelledby="rec-h">
      <div className="sec__grain" aria-hidden="true" />
      <div className="wrap">
        <p className="kicker kicker--on-ink">
          04 <i>/</i> New at BodyForge
        </p>
        <div className="rec__top">
          <h2 className="h2" id="rec-h">
            <span className="ln">Professional recovery.</span>
            <span className="ln">Thirty minutes.</span>
          </h2>
          <p className="lead">
            A weekend recovery session at BodyForge is thirty minutes of hands-on work run by the
            same clinical team that handles the rehab. Recovery with a clinical edge, not a spa. In,
            reset, and back to your day.
          </p>
        </div>

        <div className="rec__body">
          <div className="rec__left">
            <figure className="rec__fig">
              <picture>
                <source
                  type="image/webp"
                  media="(max-width: 700px)"
                  srcSet="/media/hands-knee-tall-520.webp 520w, /media/hands-knee-tall-800.webp 800w"
                  sizes="100vw"
                />
                <source
                  type="image/webp"
                  media="(min-width: 900px)"
                  srcSet="/media/hands-knee-tall-520.webp 520w, /media/hands-knee-tall-800.webp 800w, /media/hands-knee-tall-1100.webp 1100w"
                  sizes="46vw"
                />
                <source
                  type="image/webp"
                  srcSet="/media/hands-knee-640.webp 640w, /media/hands-knee-1000.webp 1000w, /media/hands-knee-1500.webp 1500w"
                  sizes="100vw"
                />
                <img
                  src="/media/hands-knee-1500.jpg"
                  width={1500}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  alt="A clinician's hands working along the side of a patient's knee during a recovery session."
                />
              </picture>
            </figure>
          </div>

          <div className="rec__offer">
            <p className="rec__k mono">What a session is built from</p>
            <dl className="modal">
              {MODALITIES.map(([dt, dd]) => (
                <div key={dt}>
                  <dt>{dt}</dt>
                  <dd>{dd}</dd>
                </div>
              ))}
            </dl>

            <p className="rec__fine">
              Saturdays 7:00&nbsp;am to 2:00&nbsp;pm and Sundays 1:00&nbsp;pm to 7:00&nbsp;pm, by
              appointment. Single sessions from $85, and $49 for a first session while founding
              places last.
            </p>

            <div className="rec__act">
              <Link className="btn btn--primary btn--lg" href="/weekend-recovery/">
                More Info
                <ArrowIcon />
              </Link>
              <a className="btn btn--ghost btn--lg" href={telHref}>
                <PhoneIcon />
                Call {SITE.phoneLabel}
              </a>
            </div>
          </div>
        </div>

        <ol className="rec__why">
          {WHY.map((w) => (
            <li key={w.h}>
              <h3>{w.h}</h3>
              <p>{w.p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
