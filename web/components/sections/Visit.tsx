import Link from "next/link";
import { SITE, mailHref, telHref } from "@/content/site";
import { Picture } from "@/components/Picture";
import { HoursTable, OpenNow } from "@/components/interactive/ClinicStatus";

export function Visit() {
  return (
    <section className="sec sec--ink visit" id="visit" aria-labelledby="visit-h">
      <div className="sec__grain" aria-hidden="true" />
      <div className="wrap visit__in">
        <div className="visit__col">
          <p className="kicker kicker--on-ink">
            08 <i>/</i> Finding us
          </p>
          <h2 className="h2" id="visit-h">
            Visit the clinic
          </h2>

          <address className="visit__addr">
            <a
              href="https://maps.google.com/?q=3600+West+Flagler+Street,+Miami,+FL+33135"
              target="_blank"
              rel="noopener"
            >
              3600 West Flagler Street
              <br />
              Miami, FL 33135
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17 17 7m0 0h-7m7 0v7" />
              </svg>
            </a>
          </address>

          <div className="visit__park">
            <h3>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.6" />
              </svg>{" "}
              Parking
            </h3>
            <p>Park inside the gated building area. Take the elevator to the second floor.</p>
          </div>

          <ul className="visit__ct">
            <li>
              <a href={telHref}>
                <span className="mono">Tel</span>
                {SITE.phoneLabel}
              </a>
            </li>
            <li>
              <a href={mailHref}>
                <span className="mono">Email</span>
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={SITE.instagram} target="_blank" rel="noopener">
                <span className="mono">IG</span>{SITE.instagramHandle}
              </a>
            </li>
          </ul>
        </div>

        <div className="visit__col">
          <h3 className="visit__hh">Hours</h3>
          <HoursTable />
          <p className="hours__note">
            Weekends are <Link href="#recovery">Recovery Program</Link> sessions only, by appointment.
            Physical therapy runs Monday to Friday.
          </p>
          <OpenNow />

          <figure className="visit__fig">
            <Picture
              stem="recovery"
              widths={[640, 1000, 1500]}
              fallback="recovery-1500.jpg"
              width={1500}
              height={1000}
              sizes="(max-width: 900px) 100vw, 40vw"
              alt="A patient resting on the treatment table mid-session while a clinician works at the side of the plinth."
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
