import Link from "next/link";
import type { ReactNode } from "react";
import { Picture } from "@/components/Picture";
import { ArrowIcon } from "@/components/icons";
import { Disclosure } from "@/components/interactive/Disclosure";

/* The four rows share a shell; what sits inside each disclosure does not — one is a
   tick list, one a definition list, two are chips with copy either side. That stays
   as markup rather than being forced into a common shape. */

type RowProps = {
  id: string;
  flip?: boolean;
  n: string;
  slug: string;
  heading: ReactNode;
  body: ReactNode;
  linkText: ReactNode;
  discId: string;
  discLabel: string;
  image: {
    stem: string;
    widths: number[];
    fallback: string;
    width: number;
    height: number;
    alt: string;
  };
  children: ReactNode;
};

function Row({
  id,
  flip,
  n,
  slug,
  heading,
  body,
  linkText,
  discId,
  discLabel,
  image,
  children,
}: RowProps) {
  return (
    <article className={`row${flip ? " row--flip" : ""}`} id={id}>
      <figure className="row__fig">
        <Picture {...image} sizes="(max-width: 900px) 100vw, 44vw" />
      </figure>
      <div className="row__body">
        <p className="row__n mono">{n}</p>
        <h3 className="row__h">
          <Link href={`/${slug}/`}>{heading}</Link>
        </h3>
        <p className="row__p">{body}</p>
        <Disclosure id={discId} label={discLabel}>
          {children}
        </Disclosure>
        <Link className="lnk" href={`/${slug}/`}>
          {linkText}
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

export function Services() {
  return (
    <section className="sec sec--bone2 svc" id="services" aria-labelledby="svc-h">
      <div className="wrap">
        <p className="kicker">
          03 <i>/</i> What you can book
        </p>
        <h2 className="h2 svc__h" id="svc-h">
          <span className="ln">Four ways in.</span>
          <span className="ln">One clinician throughout.</span>
        </h2>

        <Row
          id="svc-pt"
          n="Service 01"
          slug="physical-therapy"
          heading="Personalized physical therapy"
          body="The heart of the practice. One-to-one sessions built around your problem and your goal, so you get back to the things you actually want to do. Not a room full of people on machines."
          linkText="More on physical therapy"
          discId="d1"
          discLabel="What you get"
          image={{
            stem: "warm-knee",
            widths: [640, 1000, 1500],
            fallback: "warm-knee-1500.jpg",
            width: 1500,
            height: 1000,
            alt: "A clinician talking a patient through a knee movement, one hand supporting the joint.",
          }}
        >
          <ul className="ticks">
            <li>A full one-to-one visit with your clinician, every time</li>
            <li>Your exercise plan on the first day, not weeks later</li>
            <li>Hands-on treatment: massage, joint work and soft-tissue release</li>
            <li>Clear goals, tracked and logged every session</li>
            <li>Electrical stimulation, TENS and hot or cold therapy when they help</li>
            <li>What to keep doing once you finish, so it does not come back</li>
          </ul>
        </Row>

        <Row
          id="svc-sc"
          flip
          n="Service 02"
          slug="strength-and-conditioning"
          heading={<>Strength &amp; conditioning</>}
          body="Getting stronger, safely, with someone who knows what your joints can take. Built around your goals, and built to become a habit rather than a six-week burst."
          linkText={<>More on strength &amp; conditioning</>}
          discId="d2"
          discLabel="Three ways to do it"
          image={{
            stem: "band-demo",
            widths: [640, 1000, 1500],
            fallback: "band-demo-1500.jpg",
            width: 1500,
            height: 1000,
            alt: "A clinician demonstrating a banded row, elbows tucked, before handing the band over.",
          }}
        >
          <dl className="pkg">
            <div>
              <dt>Training in the clinic</dt>
              <dd>
                In the clinic, with a plan written for you and access to the recovery equipment here.
              </dd>
            </div>
            <div>
              <dt>Train on your own schedule</dt>
              <dd>
                A plan written for you that you follow at your own gym, in your own time, with text
                access to ask questions. Pay as you go, no subscription.
              </dd>
            </div>
            <div>
              <dt>Prehab: staying out of trouble</dt>
              <dd>
                A screening to spot what is most likely to injure you, and the work to shore it up
                before it does.
              </dd>
            </div>
          </dl>
        </Row>

        <Row
          id="svc-sport"
          n="Service 03"
          slug="sport-specific-rehabilitation"
          heading="Sport-specific rehabilitation"
          body="Get back to competing with confidence. Proper testing tells us when you are actually ready, and we train the rest of you while the injured part catches up, so you do not lose the fitness you worked for."
          linkText="More on sports injury rehab"
          discId="d3"
          discLabel="Which sports, and what testing means"
          image={{
            stem: "dowel",
            widths: [640, 1000, 1500],
            fallback: "dowel-1500.jpg",
            width: 1500,
            height: 1000,
            alt: "A clinician holding a dowel against an athlete's spine to read overhead position during a movement screen.",
          }}
        >
          <p className="disc__p">
            Rehab carries on until you can handle what your sport actually asks of you:
          </p>
          <ul className="chips">
            <li>Field sports</li>
            <li>Court sports</li>
            <li>Water sports</li>
            <li>Combat sports</li>
          </ul>
          <p className="disc__p">
            Going back to play is a decision based on test results, not on the calendar or on how
            long it has been. Ordinary therapy stops when the pain stops. This stops when you can
            prove the body part can take the load again.
          </p>
        </Row>

        <Row
          id="svc-pilates"
          flip
          n="Service 04"
          slug="pilates"
          heading="One-on-one Pilates"
          body="Pilates is not just the routine. It is learning to move well and without wasted effort, taught one-to-one by a Polestar-educated instructor who is also a doctor of physical therapy, at whatever level you walk in with."
          linkText="More on Pilates"
          discId="d4"
          discLabel="Equipment, and who it suits"
          image={{
            stem: "spine-ball",
            widths: [640, 1000, 1500],
            fallback: "spine-ball-1500.jpg",
            width: 1500,
            height: 1000,
            alt: "A patient articulating the spine forward over a stability ball, arms reaching long, guided by hand.",
          }}
        >
          <p className="disc__p">Currently in the studio:</p>
          <ul className="chips">
            <li>Mat</li>
            <li>Reformer</li>
            <li>Trapeze</li>
            <li>Spine corrector</li>
            <li className="is-soon">
              Chair <i>soon</i>
            </li>
            <li className="is-soon">
              Ladder barrel <i>soon</i>
            </li>
          </ul>
          <p className="disc__p">
            Built for posture, flexibility and control, and adapted for long-standing back pain or
            thinning bones. All levels welcome, including people who have never seen a reformer
            before.
          </p>
        </Row>
      </div>
    </section>
  );
}
