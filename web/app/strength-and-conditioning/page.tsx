import { JsonLd } from "@/components/JsonLd";
import { serviceMetadata, serviceSchema } from "@/content/services-meta";
import {
  CtaBand,
  FourWay,
  PageHero,
  RelatedPages,
  SplitFigure,
} from "@/components/sections/ServicePage";

const SLUG = "strength-and-conditioning";
export const metadata = serviceMetadata(SLUG);

const WAYS = [
  {
    h: "Training in the clinic",
    p: "In the clinic, with a plan written for you and access to the recovery equipment here. Best if you want eyes on your technique, or you are coming straight out of rehab and would rather not guess.",
  },
  {
    h: "Train on your own schedule",
    p: "A plan written for you that you follow at your own gym, in your own time, with text access to ask questions as they come up. Pay as you go. No subscription, no lock-in.",
  },
  {
    h: "Prehab: staying out of trouble",
    p: "A screening by a doctor of physical therapy to spot what is most likely to injure you, and the work to shore it up before it does. Cheaper than the rehab that follows the injury.",
  },
];

const FACTS = [
  ["01", "Goals you actually named, not a template block"],
  ["02", "Loads that respect what the joint has been through"],
  ["03", "Progress tracked and logged, session by session"],
  ["04", "Habits that outlast the programme"],
];

export default function StrengthPage() {
  return (
    <>
      <JsonLd data={serviceSchema(SLUG)} />

      <PageHero
        nav="Strength & conditioning"
        eyebrow="Service 02"
        h1={["Getting stronger,", "without getting hurt"]}
        lead="Most trainers can make you tired. Fewer can tell you what your knee will tolerate next week. This is strength work run by someone who spends the rest of his day rebuilding the joints that got it wrong."
        cta="strength & conditioning"
        image={{
          stem: "load",
          widths: [640, 1000, 1500],
          fallback: "load-1500.jpg",
          width: 1500,
          height: 1000,
          alt: "A patient hinging under a kettlebell in the BodyForge training room.",
        }}
      />

      <section className="sec sec--bone" aria-labelledby="sc-w">
        <div className="wrap">
          <p className="kicker">
            01 <i>/</i> Three ways to do it
          </p>
          <h2 className="h2 svc__h" id="sc-w">
            Pick the one that fits your life
          </h2>
          <FourWay>
            {WAYS.map((w) => (
              <article key={w.h}>
                <h3>{w.h}</h3>
                <p>{w.p}</p>
              </article>
            ))}
          </FourWay>
        </div>
      </section>

      <section className="sec sec--ink" aria-labelledby="sc-y">
        <div className="sec__grain" aria-hidden="true" />
        <div className="wrap">
          <p className="kicker kicker--on-ink">
            02 <i>/</i> Why here
          </p>
          <div className="split">
            <div>
              <h2 className="h2" id="sc-y">
                A trainer who reads your imaging
              </h2>
              <p className="lead">
                The programme is built around your goals, and built to become a habit rather than a
                six-week burst you abandon in March.
              </p>
              <ul className="doc__facts" style={{ marginTop: "1.6rem" }}>
                {FACTS.map(([n, t]) => (
                  <li key={n}>
                    <span className="mono">{n}</span> {t}
                  </li>
                ))}
              </ul>
            </div>
            <SplitFigure
              image={{
                stem: "kettlebells",
                widths: [640, 1000, 1500],
                fallback: "kettlebells-1500.jpg",
                width: 1500,
                height: 1000,
                alt: "Kettlebells racked along the wall of the BodyForge training floor.",
              }}
            />
          </div>
        </div>
      </section>

      <RelatedPages slug={SLUG} />
      <CtaBand heading="Let's get you stronger" />
    </>
  );
}
