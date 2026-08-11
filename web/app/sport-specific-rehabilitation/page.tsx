import { JsonLd } from "@/components/JsonLd";
import { serviceMetadata, serviceSchema } from "@/content/services-meta";
import {
  CtaBand,
  FourWay,
  PageHero,
  RelatedPages,
  SplitFigure,
} from "@/components/sections/ServicePage";

const SLUG = "sport-specific-rehabilitation";
export const metadata = serviceMetadata(SLUG);

const TESTS = [
  {
    h: "Strength, side to side",
    p: "The injured side gets compared with the healthy one. Numbers, not impressions. A leg that is 20% weaker will find out on the pitch if it does not find out here.",
  },
  {
    h: "Power and landing",
    p: "Hopping, cutting, decelerating. Most non-contact injuries happen while slowing down or changing direction, so that is what gets tested.",
  },
  {
    h: "Confidence in the movement",
    p: "Plenty of athletes are physically ready and still guarding. That shows up in testing too, and it is worth knowing before a match rather than during one.",
  },
];

export default function SportRehabPage() {
  return (
    <>
      <JsonLd data={serviceSchema(SLUG)} />

      <PageHero
        nav="Sports injury rehab"
        eyebrow="Service 03"
        h1={["Back to competing,", "with something to show for it"]}
        lead="Ordinary rehab stops when the pain stops. That is the point at which most people get hurt again. Here it carries on until you can prove the body part handles what your sport is about to ask of it."
        cta="sports rehabilitation"
        image={{
          stem: "assess",
          widths: [640, 1000, 1500],
          fallback: "assess-1500.jpg",
          width: 1500,
          height: 1000,
          alt: "An athlete drawing a cable across the body while a clinician steadies the shoulder blade.",
        }}
      />

      <section className="sec sec--bone" aria-labelledby="sp-t">
        <div className="wrap">
          <p className="kicker">
            01 <i>/</i> The testing
          </p>
          <div className="cond__top">
            <h2 className="h2" id="sp-t">
              &quot;It feels fine&quot; is not a test result
            </h2>
            <p className="lead">
              You go through rigorous, evidence-based testing that measures what your body and your
              head can actually handle, so you can be confident you are ready when you get there.
            </p>
          </div>
          <FourWay>
            {TESTS.map((t) => (
              <article key={t.h}>
                <h3>{t.h}</h3>
                <p>{t.p}</p>
              </article>
            ))}
          </FourWay>
        </div>
      </section>

      <section className="sec sec--ink" aria-labelledby="sp-s">
        <div className="sec__grain" aria-hidden="true" />
        <div className="wrap">
          <p className="kicker kicker--on-ink">
            02 <i>/</i> Who this is for
          </p>
          <div className="split">
            <div>
              <h2 className="h2" id="sp-s">
                Four kinds of sport, one method
              </h2>
              <p className="lead">
                Rehab carries on until you can handle what your sport actually asks of you, and we
                train the rest of you while the injured part catches up, so you do not lose the
                fitness you worked for.
              </p>
              <ul className="chips chips--ink" style={{ marginTop: "1.6rem" }}>
                <li>Field sports</li>
                <li>Court sports</li>
                <li>Water sports</li>
                <li>Combat sports</li>
              </ul>
            </div>
            <SplitFigure
              image={{
                stem: "load",
                widths: [640, 1000],
                fallback: "load-1500.jpg",
                width: 1500,
                height: 1000,
                alt: "A patient hinging under a kettlebell during loaded rehabilitation.",
              }}
            />
          </div>
        </div>
      </section>

      <section className="sec sec--bone" aria-labelledby="sp-q">
        <div className="wrap">
          <p className="kicker">
            03 <i>/</i> A patient
          </p>
          <article className="tst tst--solo">
            <div className="tst__stars" role="img" aria-label="5 out of 5 stars">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <blockquote>
              <p className="tst__pull" id="sp-q">
                &quot;He played a crucial role in getting me back to running.&quot;
              </p>
              <p>
                David is truly exceptional! I was recovering from a knee injury, and he played a
                crucial role in getting me back to running. He went above and beyond in every
                session, from the first meeting to the end of treatment. He set me up with the tools
                and knowledge to continue improving my physical form and avoid injuries. He was
                always responsive to my questions and feedback. His knowledge, experience, and great
                attitude set him apart.
              </p>
            </blockquote>
            <footer className="tst__by">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/p-maria-160.webp"
                srcSet="/media/p-maria-160.webp 160w, /media/p-maria-320.webp 320w"
                sizes="56px"
                width={160}
                height={160}
                loading="lazy"
                decoding="async"
                alt=""
              />
              <div>
                <p className="tst__name">Maria Rossi</p>
                <p className="tst__ctx">Knee injury, returned to running</p>
              </div>
            </footer>
          </article>
        </div>
      </section>

      <RelatedPages slug={SLUG} />
      <CtaBand heading="Get back to your sport" />
    </>
  );
}
