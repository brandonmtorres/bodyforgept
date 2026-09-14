import Link from "next/link";
import { SITE, mailHref, telHref } from "@/content/site";
import { ArrowIcon, PhoneIcon } from "@/components/icons";
import { CallNow } from "@/components/interactive/ClinicStatus";

/* The #book anchor is kept: the four service pages and the old WordPress site both
   link to /#book. There is no form — Dr. Perez-Espinosa asked for appointments to be
   arranged by phone. */

export function Book() {
  return (
    <section className="sec book" id="book" aria-labelledby="book-h">
      <div className="wrap book__in">
        <div className="book__aside">
          <p className="kicker kicker--on-ember">
            07 <i>/</i> Take the first step
          </p>
          <h2 className="h2" id="book-h">
            <span className="ln">Call the clinic.</span>
            <span className="ln">Talk to a person.</span>
          </h2>
          <p className="lead">
            Appointments here are arranged on the phone, not through a form. Two minutes of hearing
            what happened and what you are trying to get back to tells us more than any set of
            boxes, and you will know before you hang up whether this is the right place for it.
          </p>
          <ul className="book__alt">
            <li>
              <span className="mono">Email</span>
              <a href={mailHref}>{SITE.email}</a>
            </li>
            <li>
              <span className="mono">Visit</span>
              <Link href="#visit">3600 W Flagler St, Miami FL 33135</Link>
            </li>
            <li>
              <span className="mono">Social</span>
              <a href={SITE.instagram} target="_blank" rel="noopener">
                {SITE.instagramHandle}
              </a>
            </li>
          </ul>
        </div>

        <div className="book__panel">
          <p className="call__k mono">Speak to the clinic</p>
          <a className="call__n" href={telHref}>
            <PhoneIcon />
            <span>{SITE.phoneLabel}</span>
          </a>
          <CallNow />

          <div className="call__ready">
            <p className="call__rk">Worth having to hand</p>
            <ul className="ticks">
              <li>What is going on, and roughly how long it has been</li>
              <li>Any surgery, and the date it happened</li>
              <li>A referral or imaging report, if a doctor gave you one</li>
              <li>What you are trying to get back to doing</li>
            </ul>
          </div>

          <div className="call__alt">
            <a
              className="btn btn--ghost"
              href={`${mailHref}?subject=Appointment%20enquiry`}
            >
              Rather write? Email us
              <ArrowIcon />
            </a>
            <p className="call__fine">
              The Recovery Program runs Saturday and Sunday and is booked on the same number. Ask
              for the founding member launch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
