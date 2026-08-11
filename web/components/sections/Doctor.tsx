import { Picture } from "@/components/Picture";

/* The practice is a team now. The copy promises one-to-one attention with a clinician
   you keep, not that the clinician is Dr. Perez-Espinosa. He is the founder and the
   credentialled face; he is not the guaranteed provider. */

const FACTS = [
  ["DPT", "Doctor of Physical Therapy"],
  ["FPTA", "Program Director, geriatrics group"],
  ["PMA", "Polestar-trained Pilates instructor"],
  ["S&C", "Strength and conditioning specialist"],
];

export function Doctor() {
  return (
    <section className="sec sec--bone doc" id="doctor" aria-labelledby="doc-h">
      <div className="wrap doc__in">
        <figure className="doc__fig">
          <Picture
            stem="doctor"
            widths={[520, 780, 1040]}
            fallback="doctor-1040.jpg"
            width={1040}
            height={1300}
            sizes="(max-width: 900px) 72vw, 34vw"
            alt="Portrait of Dr. David Perez-Espinosa, PT, DPT, founder of BodyForge Physical Therapy."
          />
          <figcaption>
            <span className="mono">Founder</span> Dr. David Perez-Espinosa, PT, DPT
          </figcaption>
        </figure>

        <div className="doc__body">
          <p className="kicker">
            05 <i>/</i> Who treats you
          </p>
          <h2 className="h2" id="doc-h">
            Dr. David Perez-Espinosa
            <span className="doc__pg">
              PT, DPT <i>&middot;</i> Founder
            </span>
          </h2>

          <p className="lead">
            BodyForge started with a simple idea: that you should get a clinician&apos;s full
            attention, and that your care should be about all of you, not rushed through by the
            clock.
          </p>

          <p className="doc__p">
            The range is unusual for one person. He has worked with older patients rebuilding the
            confidence to walk without a stick, weekend athletes trying to keep training through an
            injury, NFL players, and UFC fighters. What they need could not be more different. The
            approach does not change: find the problem, work on it, measure it again.
          </p>

          <p className="doc__p">
            He serves as Program Director of the Geriatrics Special Interest Group of the Florida
            Physical Therapy Association, and is a Polestar-educated Pilates instructor.
          </p>

          <blockquote className="doc__q">
            <p>
              Empower individuals through personalized physical therapy and training that fosters
              wellness, resilience, and a balanced lifestyle.
            </p>
            <footer>The BodyForge mission, in his words</footer>
          </blockquote>

          <ul className="doc__facts">
            {FACTS.map(([k, v]) => (
              <li key={k}>
                <span className="mono">{k}</span> {v}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap">
        <figure className="team">
          <Picture
            stem="team"
            widths={[640, 1000, 1400]}
            fallback="team-1400.jpg"
            width={1400}
            height={933}
            sizes="(max-width: 900px) 100vw, min(1320px, 92vw)"
            alt="The BodyForge clinical team, three clinicians standing together at the clinic on West Flagler Street."
          />
          <figcaption>
            <p className="team__h">The practice has grown. The rule has not.</p>
            <p className="team__p">
              You are matched with the clinician who fits what you are dealing with, and you stay
              with that person from your first visit to your last. It will not always be Dr.
              Perez-Espinosa, and whoever it is, the session is yours alone.
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
