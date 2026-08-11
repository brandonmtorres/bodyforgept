import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { serviceMetadata, serviceSchema } from "@/content/services-meta";
import {
  CtaBand,
  FourWay,
  PageHero,
  RelatedPages,
  SplitFigure,
} from "@/components/sections/ServicePage";

const SLUG = "physical-therapy";
export const metadata = serviceMetadata(SLUG);

const ARRIVALS = [
  {
    h: "After surgery",
    p: "Knee, hip and shoulder replacements. ACL, MCL and LCL surgery. Rotator cuff and labral repairs. Spinal fusion. Broken bones. Muscle and tendon repairs.",
  },
  {
    h: "Joint and muscle pain",
    p: "Arthritis, bursitis, thinning bones, low back pain, neck pain, SI joint pain, plantar fasciitis, sciatica, and the sprains and strains that never quite settled.",
  },
  {
    h: "Balance and dizziness",
    p: "Vertigo and spinning sensations, inner-ear balance problems, unsteadiness on your feet, and balance after a stroke or a head injury.",
  },
  {
    h: "Sports injuries",
    p: "Rotator cuff pain, tennis and golfer's elbow, achilles tendonitis, runner's knee, and the backs and knees that only complain when you train.",
  },
  {
    h: "Neurological",
    p: "Parkinson's disease, foot drop and Ehlers-Danlos syndrome. Work on gait, balance, joint control and the strength to keep moving safely day to day.",
  },
];

const VISIT = [
  {
    h: "We measure before we guess",
    p: "How far the joint moves, how strong it is, how much load it can take, and how the areas above and below it are coping. The sore spot is often not the cause.",
  },
  {
    h: "Hands-on treatment",
    p: "Massage, joint mobilisation, manipulation and soft-tissue release, used to get the movement back before we ask you to hold it.",
  },
  {
    h: "Exercises on day one",
    p: "You leave the first visit knowing what to do at home and why it helps. Not a photocopied handout.",
  },
  {
    h: "Machines where they earn it",
    p: "Electrical stimulation, TENS, hot and cold. Useful alongside treatment, never instead of it.",
  },
  {
    h: "Progress written down",
    p: "Goals are specific and measurable. Progress is tracked and logged every session, so you are not relying on memory or optimism.",
  },
];

export default function PhysicalTherapyPage() {
  return (
    <>
      <JsonLd data={serviceSchema(SLUG)} />

      <PageHero
        nav="Physical therapy"
        eyebrow="Service 01"
        h1={["Physical therapy,", "one patient at a time"]}
        lead="You get your clinician for the whole visit, every visit. We work out what is actually causing the problem, treat it by hand, give you the exercises that hold the change, and measure it again so you can see it working."
        cta="physical therapy"
        image={{
          stem: "mat",
          widths: [640, 1000],
          fallback: "mat-1000.jpg",
          width: 1000,
          height: 667,
          alt: "Hands-on knee and hip treatment on the mat at BodyForge.",
        }}
      />

      <section className="sec sec--bone" aria-labelledby="pt-w">
        <div className="wrap">
          <p className="kicker">
            01 <i>/</i> What we help with
          </p>
          <div className="cond__top">
            <h2 className="h2" id="pt-w">
              Most people arrive one of four ways
            </h2>
            <p className="lead">
              Something was operated on, something wore out, something gave way, or something
              started hurting and never stopped.
            </p>
          </div>
          <FourWay>
            {ARRIVALS.map((a) => (
              <article key={a.h}>
                <h3>{a.h}</h3>
                <p>{a.p}</p>
              </article>
            ))}
          </FourWay>
          <p className="cond__note">
            Do not see yours here? <Link href="/#conditions">The full list is on the home page</Link>, or
            just describe it when you call.
          </p>
        </div>
      </section>

      <section className="sec sec--ink" aria-labelledby="pt-s">
        <div className="sec__grain" aria-hidden="true" />
        <div className="wrap">
          <p className="kicker kicker--on-ink">
            02 <i>/</i> What a visit looks like
          </p>
          <div className="cond__top">
            <h2 className="h2" id="pt-s">
              A visit that is actually yours
            </h2>
            <p className="lead">
              No waiting on a table. No being handed to an assistant while your clinician runs three
              other people. The same person, start to finish.
            </p>
          </div>
          <div className="split">
            <ol className="incl incl--ink">
              {VISIT.map((v) => (
                <li key={v.h}>
                  <h3>{v.h}</h3>
                  <p>{v.p}</p>
                </li>
              ))}
            </ol>
            <SplitFigure
              image={{
                stem: "handson-wide",
                widths: [760, 1200, 1600],
                fallback: "handson-wide-1600.jpg",
                width: 1600,
                height: 1067,
                alt: "A hand placed on the shoulder blade to guide a patient through a banded exercise.",
              }}
            />
          </div>
        </div>
      </section>

      <RelatedPages slug={SLUG} />
      <CtaBand heading="Ready when you are" />
    </>
  );
}
