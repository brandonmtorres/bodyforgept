import { Picture } from "@/components/Picture";

const STEPS = [
  {
    h: "A proper first look",
    p: "How far the joint moves, how strong it is, how much it can handle, and how everything around it is working. Not just the spot that hurts.",
  },
  {
    h: "A plan on day one",
    p: "Your exercises start at the first visit, not three appointments later. You leave knowing what to do at home and why it helps.",
  },
  {
    h: "Hands-on treatment",
    p: "Massage, joint work and soft-tissue release to get the movement back. The exercises are what make it stay.",
  },
  {
    h: "Progress you can see",
    p: "Clear goals set on the first day, then checked again later. Progress is tracked and logged every session, so you are not guessing.",
  },
  {
    h: "Machines help. They don't do the work.",
    p: "Electrical stimulation, TENS and hot or cold packs all have their place. Their place is supporting the treatment, not replacing it.",
    neg: true,
  },
];

export function Approach() {
  return (
    <section className="sec sec--bone approach" id="approach" aria-labelledby="approach-h">
      <div className="wrap">
        <p className="kicker">
          01 <i>/</i> The model
        </p>
        <div className="approach__top">
          <h2 className="h2" id="approach-h">
            <span className="ln">Most physical therapy is three patients an hour.</span>
            <span className="ln">This one isn&apos;t.</span>
          </h2>
          <p className="lead">
            You will not be left on a table with a heat pack while somebody else runs the room. From
            your first visit to your last, you work with the same licensed clinician, and your plan
            is built around what your body is actually doing, not printed off a sheet for your
            diagnosis.
          </p>
        </div>

        <div className="approach__body">
          <figure className="approach__fig">
            <Picture
              stem="coach-ball"
              widths={[760, 1200, 1600]}
              fallback="coach-ball-1600.jpg"
              width={1600}
              height={1067}
              sizes="(max-width: 900px) 100vw, 46vw"
              alt="A BodyForge clinician cueing a patient's reach over a stability ball, one hand guiding each arm."
            />
            <figcaption>
              <span className="mono">Fig. 01</span> Cueing a thoracic reach. BodyForge, W Flagler
              Street.
            </figcaption>
          </figure>

          <ol className="incl">
            {STEPS.map((s) => (
              <li key={s.h} className={s.neg ? "incl--neg" : undefined}>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
