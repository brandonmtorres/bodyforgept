import type { ReactNode } from "react";

/* Every figure on /weekend-recovery/ is transcribed from the clinic's own launch
   sheets in site/assets/img/promo/, and quoted exactly. The only derived number on
   the page is "$75 a session", which is $600 ÷ 8. Physical therapy pricing is still
   unpublished and must not be invented. */

export type Rate = {
  label: string;
  /* "Most popular" and the like, rendered inside the term */
  tag?: string;
  sub?: string;
  /* struck-through retail price, where the row shows a saving against it */
  was?: string;
  price: string;
  /* "/mo" — set small alongside the figure */
  per?: string;
  save?: string;
  hero?: boolean;
};

export function RateList({
  rows,
  variant,
}: {
  rows: Rate[];
  variant?: "feature" | "ink";
}) {
  const cls = ["rate", variant ? `rate--${variant}` : ""].filter(Boolean).join(" ");
  return (
    <dl className={cls}>
      {rows.map((r) => (
        <div className={`rate__r${r.hero ? " rate__r--hero" : ""}`} key={r.label}>
          <dt>
            <b>{r.label}</b>
            {r.tag ? (
              <>
                {" "}
                <i className="rate__tag">{r.tag}</i>
              </>
            ) : null}
            {r.sub ? <span>{r.sub}</span> : null}
          </dt>
          <dd>
            {r.was ? <s className="mono">{r.was}</s> : null}
            <span className="rate__n mono">
              {r.price}
              {r.per ? <i>{r.per}</i> : null}
            </span>
            {r.save ? <em className="rate__save">{r.save}</em> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function RatesBlock({
  launch,
  standard,
  kicker,
  caption,
  children,
}: {
  launch?: boolean;
  /* the reference menu, set a level below the launch block rather than beside it */
  standard?: boolean;
  kicker: ReactNode;
  caption: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rates${launch ? " rates--launch" : ""}${standard ? " rates--standard" : ""}`}
    >
      <div className="rates__lead">
        <p className="rates__k mono">{kicker}</p>
        <p className="rates__cap">{caption}</p>
      </div>
      {children}
    </div>
  );
}
