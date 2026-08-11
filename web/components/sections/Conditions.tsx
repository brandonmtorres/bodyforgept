import Link from "next/link";
import { CONDITION_TABS, TAGS } from "@/content/conditions";
import { Tabs, type TabItem } from "@/components/interactive/Tabs";

export function Conditions() {
  const items: TabItem[] = CONDITION_TABS.map((tab) => ({
    id: tab.id,
    label: tab.label,
    panel: (
      <>
        <ul className="clist">
          {tab.items.map((cond) => (
            <li key={cond.name}>
              <span>{cond.name}</span>
              <em data-t={cond.tag}>{TAGS[cond.tag]}</em>
            </li>
          ))}
        </ul>
        {tab.note ? <p className="cpan__note">{tab.note}</p> : null}
      </>
    ),
  }));

  return (
    <section className="sec sec--ink cond" id="conditions" aria-labelledby="cond-h">
      <div className="sec__grain" aria-hidden="true" />
      <div className="wrap">
        <p className="kicker kicker--on-ink">
          02 <i>/</i> Scope of practice
        </p>
        <div className="cond__top">
          <h2 className="h2" id="cond-h">
            What we treat
          </h2>
          <p className="lead">
            Pick where it hurts. Everything listed here is treated at the clinic, whether it started
            with surgery, years of wear, a fall, or a weekend that got out of hand.
          </p>
        </div>

        <Tabs items={items} label="Body region" />

        <p className="cond__note">
          Do not see yours, or not sure what it is called?{" "}
          <Link href="#book">Describe it when you call</Link> and you will get a straight answer about
          whether this is the right place for it.
        </p>
      </div>
    </section>
  );
}
