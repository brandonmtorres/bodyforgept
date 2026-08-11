import { JsonLd } from "@/components/JsonLd";
import { serviceMetadata, serviceSchema } from "@/content/services-meta";
import {
  CtaBand,
  FourWay,
  PageHero,
  RelatedPages,
  SplitFigure,
} from "@/components/sections/ServicePage";

const SLUG = "pilates";
export const metadata = serviceMetadata(SLUG);

const WHAT = [
  {
    h: "Built for posture and control",
    p: "Strength through the middle, better flexibility, and joints that stack up the way they are supposed to. It shows up in how you stand long before it shows up in a mirror.",
  },
  {
    h: "Adapted, not watered down",
    p: "Sessions are adapted for long-standing low back pain and for thinning bones, which rules some movements out and makes others considerably more valuable.",
  },
  {
    h: "Any level, including none",
    p: "All skill levels, including people who have never seen a reformer and are slightly suspicious of it. Nobody is behind here, because there is nobody to be behind.",
  },
];

export default function PilatesPage() {
  return (
    <>
      <JsonLd data={serviceSchema(SLUG)} />

      <PageHero
        nav="Pilates"
        eyebrow="Service 04"
        h1={["Pilates, taught", "by a physical therapist"]}
        lead="Not a room of twenty people following along at the front. One-to-one, with someone who knows the difference between a movement that looks right and a movement that is doing you good."
        cta="a Pilates session"
        image={{
          stem: "cue",
          widths: [640, 895],
          fallback: "cue-895.jpg",
          width: 895,
          height: 597,
          alt: "A hand placed flat on the back to cue breath and alignment during a controlled movement.",
        }}
      />

      <section className="sec sec--bone" aria-labelledby="pl-w">
        <div className="wrap">
          <p className="kicker">
            01 <i>/</i> What it is here
          </p>
          <div className="cond__top">
            <h2 className="h2" id="pl-w">
              Move well, not just prettily
            </h2>
            <p className="lead">
              Pilates is not just the routine. It is learning to move efficiently and with purpose,
              which is why it works so well for people whose backs have been complaining for years.
            </p>
          </div>
          <FourWay>
            {WHAT.map((w) => (
              <article key={w.h}>
                <h3>{w.h}</h3>
                <p>{w.p}</p>
              </article>
            ))}
          </FourWay>
        </div>
      </section>

      <section className="sec sec--ink" aria-labelledby="pl-e">
        <div className="sec__grain" aria-hidden="true" />
        <div className="wrap">
          <p className="kicker kicker--on-ink">
            02 <i>/</i> The studio
          </p>
          <div className="split">
            <div>
              <h2 className="h2" id="pl-e">
                What is in the room
              </h2>
              <p className="lead">
                Taught by a Polestar-trained instructor who is also a doctor of physical therapy,
                which is a rarer combination than it sounds.
              </p>
              <ul className="chips chips--ink" style={{ marginTop: "1.6rem" }}>
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
            </div>
            <SplitFigure
              image={{
                stem: "mat",
                widths: [640, 1000],
                fallback: "mat-1000.jpg",
                width: 1000,
                height: 667,
                alt: "Controlled mat work guided by hand at BodyForge.",
              }}
            />
          </div>
        </div>
      </section>

      <RelatedPages slug={SLUG} />
      <CtaBand heading="Come and try a session" />
    </>
  );
}
