import { JsonLd } from "@/components/JsonLd";
import { serviceMetadata, serviceSchema } from "@/content/services-meta";
import { WEEKEND_RECOVERY_EXTRA_SCHEMA } from "@/content/weekend-recovery-schema";
import { SITE, telHref } from "@/content/site";
import { PhoneIcon } from "@/components/icons";
import { Picture } from "@/components/Picture";
import {
  CtaBand,
  FourWay,
  PageHero,
  RelatedPages,
} from "@/components/sections/ServicePage";
import { RateList, RatesBlock, type Rate } from "@/components/sections/Rates";

const SLUG = "weekend-recovery";
export const metadata = serviceMetadata(SLUG);

const MODALITIES = [
  {
    h: "Manual massage",
    p: "Hands-on soft-tissue work through the muscle and fascia that has tightened up since the last time you trained, sat, or slept badly.",
  },
  {
    h: "Assisted stretching",
    p: "Someone else holds the position and takes the guesswork out of it, so the stretch reaches range you cannot hold on your own.",
  },
  {
    h: "Joint mobilization",
    p: "Graded pressure applied at the joint itself to restore glide where a knee, hip, shoulder or ankle has stopped moving through its full arc.",
  },
  {
    h: "Cupping",
    p: "Suction cups lift the tissue rather than pressing into it, used across backs, calves and shoulders where dense tissue has stopped sliding.",
  },
  {
    h: "Theragun",
    p: "Percussive therapy at speed, used to take the edge off a muscle quickly before the hands-on work, or to finish a session.",
  },
  {
    h: "Normatec compression",
    p: "Compression boots that inflate in sequence from the foot up, flushing the legs after a long run, a long shift, or a heavy week.",
  },
];

const WHY = [
  {
    h: "Licensed clinicians",
    p: "The people who run your recovery session are the people who run the rehab floor. They know when to press and when to stop, and they will tell you if what you are describing needs a proper evaluation instead.",
  },
  {
    h: "Thirty minutes",
    p: "Long enough to change how you feel, short enough to fit a Saturday morning around everything else you have to do.",
  },
  {
    h: "No lock-in",
    p: "Start with a single session. Membership exists because people asked for it, not because you have to sign anything to walk in the door.",
  },
];

const LAUNCH_RATES: Rate[] = [
  {
    label: "First session",
    sub: "New clients, any weekend",
    price: "$49",
    save: "Save $36",
  },
  {
    label: "Founding membership",
    sub: "Four sessions a month, about $42 a visit",
    was: "$199",
    price: "$169",
    per: "/mo",
    save: "Save $30/mo",
  },
];

const STANDARD_RATES: Rate[] = [
  { label: "Single session", sub: "Drop in any weekend", price: "$85" },
  {
    label: "Eight-session pack",
    sub: "$75 a session, against $85 for a drop-in",
    price: "$600",
    save: "Save $80",
  },
  {
    label: "Membership",
    sub: "Four sessions a month, about $50 a visit",
    price: "$199",
    per: "/mo",
  },
  {
    label: "Performance membership",
    sub: "Eight sessions a month, about $44 a visit",
    price: "$349",
    per: "/mo",
  },
];

const RESPONDER_RATES: Rate[] = [
  { label: "Single visit", sub: "Drop in anytime", was: "$85", price: "$70", save: "Save $15" },
  {
    label: "Four-visit pack",
    sub: "$60 a visit, use within 120 days",
    price: "$240",
    save: "Save $100",
  },
  {
    label: "Monthly membership",
    tag: "Most popular",
    sub: "Four sessions a month, $40 a visit",
    was: "$199",
    price: "$160",
    per: "/mo",
    save: "Save $39/mo",
    hero: true,
  },
  {
    label: "Performance membership",
    sub: "Eight sessions a month, $35 a visit",
    was: "$349",
    price: "$280",
    per: "/mo",
    save: "Save $69/mo",
  },
];




export default function WeekendRecoveryPage() {
  return (
    <>
      <JsonLd data={serviceSchema(SLUG, [...WEEKEND_RECOVERY_EXTRA_SCHEMA])} />

      <PageHero
        nav="Recovery Program"
        eyebrow="Recovery Program · now open in Miami"
        h1={["Professional recovery", "in thirty minutes"]}
        lead="Manual massage, assisted stretching, joint mobilization, cupping, Theragun and Normatec compression boots, delivered by the clinical team at BodyForge. In, reset, and back to your day."
        cta="the Recovery Program"
        cta2="See the rates"
        cta2Href="#rates"
        image={{
          stem: "warm-knee",
          widths: [640, 1000, 1500],
          fallback: "warm-knee-1500.jpg",
          width: 1500,
          height: 1000,
          alt: "A BodyForge clinician working a patient's knee during a weekend recovery session.",
        }}
      />

      <section className="sec sec--bone" aria-labelledby="wr-s">
        <div className="wrap">
          <p className="kicker">
            01 <i>/</i> What a session is
          </p>
          <div className="cond__top">
            <h2 className="h2" id="wr-s">
              Six things, thirty minutes, one table
            </h2>
            <p className="lead">
              A session is built from whichever of these your body actually needs that day. You are
              not handed a fixed menu, and nothing is added to fill the time.
            </p>
          </div>
          <FourWay>
            {MODALITIES.map((m) => (
              <article key={m.h}>
                <h3>{m.h}</h3>
                <p>{m.p}</p>
              </article>
            ))}
          </FourWay>
          <p className="cond__note">
            Not sure which of these you need?{" "}
            <a href={telHref}>Call and describe the week you have had</a>, and the session gets
            built around the answer.
          </p>
        </div>
      </section>

      <section className="sec sec--ink" aria-labelledby="wr-w">
        <div className="sec__grain" aria-hidden="true" />
        <div className="wrap">
          <p className="kicker kicker--on-ink">
            02 <i>/</i> Why a clinic, not a spa
          </p>
          <div className="split">
            <div>
              <h2 className="h2" id="wr-w">
                Recovery with a clinical edge
              </h2>
              <p className="lead">
                The same people who rebuild knees after surgery run these sessions. That is the
                entire difference, and it shows up in what they will and will not do to you.
              </p>
              <ol className="incl incl--ink" style={{ marginTop: "1.8rem" }}>
                {WHY.map((w) => (
                  <li key={w.h}>
                    <h3>{w.h}</h3>
                    <p>{w.p}</p>
                  </li>
                ))}
              </ol>
            </div>
            <figure className="split__fig split__fig--stick">
              <picture>
                <source
                  type="image/webp"
                  media="(min-width: 900px)"
                  srcSet="/media/hands-knee-tall-520.webp 520w, /media/hands-knee-tall-800.webp 800w, /media/hands-knee-tall-1100.webp 1100w"
                  sizes="42vw"
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
          <p className="note note--ink">
            Recovery sessions are wellness services. They are not a substitute for diagnosed
            physical therapy care, and if what you have needs treating rather than easing, you will
            be told so.
          </p>
        </div>
      </section>

      <section className="sec sec--bone2" id="rates" aria-labelledby="wr-r">
        <div className="wrap">
          <p className="kicker">
            03 <i>/</i> Rates
          </p>
          <div className="cond__top">
            <h2 className="h2" id="wr-r">
              What it costs
            </h2>
            <p className="lead">
              Every figure below is what you pay at the desk. There is no joining fee, no contract,
              and no charge for the first conversation on the phone.
            </p>
          </div>

          <ul className="incl-strip">
            <li>Thirty minutes, one to one</li>
            <li>All six modalities available in every session</li>
            <li>Run by a licensed clinician</li>
            <li>Booked by phone, held by name</li>
          </ul>

          <RatesBlock
            launch
            kicker={
              <>
                <span className="rates__star" aria-hidden="true">
                  &#9733;
                </span>{" "}
                Founding member launch
              </>
            }
            caption="Open to the first 25 members. After that the founding rate closes and standard pricing applies."
          >
            <RateList rows={LAUNCH_RATES} variant="feature" />
          </RatesBlock>

          <RatesBlock
            standard
            kicker="Standard rates"
            caption="What everything costs once the founding places are gone."
          >
            <RateList rows={STANDARD_RATES} />
          </RatesBlock>
        </div>
      </section>

      <section className="sec sec--ink" id="first-responders" aria-labelledby="wr-fr">
        <div className="sec__grain" aria-hidden="true" />
        <div className="wrap">
          <p className="kicker kicker--on-ink">
            04 <i>/</i> First responder program
          </p>
          <div className="cond__top">
            <h2 className="h2" id="wr-fr">
              You take care of Miami. <span className="ln">Let us take care of you.</span>
            </h2>
            <p className="lead">
              Every first responder gets our partner pricing on professional recovery, and
              scheduling that works around a rotation rather than against it.
            </p>
          </div>

          <ul className="chips chips--ink" style={{ marginBottom: "2.2rem" }}>
            <li>Police</li>
            <li>Fire</li>
            <li>EMS and paramedics</li>
            <li>911 dispatch</li>
            <li>Corrections</li>
          </ul>

          <RateList rows={RESPONDER_RATES} variant="ink" />

          <div className="claim">
            <h3>How to claim it</h3>
            <p>
              Show a valid first-responder ID when you book or check in. That is the whole process.
              Tell us your rotation when you call and we will work around it.
            </p>
            <a className="btn btn--primary" href={telHref}>
              <PhoneIcon />
              Call {SITE.phoneLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="sec sec--ink" aria-labelledby="wr-h">
        <div className="sec__grain" aria-hidden="true" />
        <div className="wrap">
          <p className="kicker kicker--on-ink">
            05 <i>/</i> When
          </p>
          <div className="split split--hours">
            <div>
              <h2 className="h2" id="wr-h">
                Weekend recovery by appointment only
              </h2>
            </div>
            <RateList
              rows={[
                { label: "Saturday", price: "7:00 am – 2:00 pm" },
                { label: "Sunday", price: "1:00 pm – 7:00 pm" },
              ]}
            />
          </div>
        </div>
      </section>

      <RelatedPages slug={SLUG} />
      <CtaBand
        heading="Book a weekend slot"
        hours={
          <>
            Sat 7am&ndash;2pm <i>&middot;</i> Sun 1pm&ndash;7pm <i>&middot;</i> by appointment
          </>
        }
      />
    </>
  );
}
