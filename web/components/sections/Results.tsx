import { LEAD, PAIR, type Testimonial } from "@/content/testimonials";
import { Disclosure } from "@/components/interactive/Disclosure";

function Stars() {
  return (
    <div className="tst__stars" role="img" aria-label="5 out of 5 stars">
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function Byline({ t }: { t: Testimonial }) {
  return (
    <footer className="tst__by">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/media/${t.avatar}-160.webp`}
        srcSet={`/media/${t.avatar}-160.webp 160w, /media/${t.avatar}-320.webp 320w`}
        sizes="56px"
        width={160}
        height={160}
        loading="lazy"
        decoding="async"
        alt=""
      />
      <div>
        <p className="tst__name">
          {t.name}
          {t.nameNote ? (
            <>
              {" "}
              <i>{t.nameNote}</i>
            </>
          ) : null}
          {t.nameRest}
        </p>
        <p className="tst__ctx">{t.context}</p>
      </div>
    </footer>
  );
}

export function Results() {
  return (
    <section className="sec sec--ink res" id="results" aria-labelledby="res-h">
      <div className="sec__grain" aria-hidden="true" />
      <div className="wrap">
        <p className="kicker kicker--on-ink">
          06 <i>/</i> In their words
        </p>
        <h2 className="h2 res__h" id="res-h">
          Three patients, unedited
        </h2>

        <article className="tst tst--lead">
          <Stars />
          <blockquote>
            <p className="tst__pull">{LEAD.pull}</p>
            <p>{LEAD.intro}</p>
            <Disclosure
              id={LEAD.id}
              label="Read the full review"
              openLabel="Hide the full review"
              quiet
            >
              {LEAD.full?.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </Disclosure>
          </blockquote>
          <Byline t={LEAD} />
        </article>

        <div className="tst__pair">
          {PAIR.map((t) => (
            <article className="tst" key={t.id}>
              <Stars />
              <blockquote>
                <p className="tst__pull">{t.pull}</p>
                <p>{t.intro}</p>
              </blockquote>
              <Byline t={t} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
