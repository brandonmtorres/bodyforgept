"use client";

import { useSyncExternalStore } from "react";
import { callNowLabel, clinicClock, openNowLabel, type ClinicClock } from "@/lib/hours";

/* Everything here depends on "now", which a static export cannot know at build time.
   Each piece renders its neutral state on the server — the same neutral state the
   static build shipped — and fills in after mount. That keeps the first client render
   identical to the prerendered HTML, so there is no hydration mismatch, and it leaves
   correct static copy on screen if the script never runs. */

/* The wall clock is an external system as far as React is concerned, so it is read
   through useSyncExternalStore: the server snapshot is null (the neutral markup) and
   the client snapshot is the real time. The value has to stay referentially stable
   between renders or the store re-reads forever, so it is cached and refreshed at
   most once a minute — fine for a reading that changes on the hour. */
const STALE_AFTER_MS = 60_000;
let cached: { at: number; value: ClinicClock } | null = null;

function getSnapshot(): ClinicClock {
  const t = Date.now();
  if (!cached || t - cached.at > STALE_AFTER_MS) cached = { at: t, value: clinicClock() };
  return cached.value;
}

/* nothing pushes updates; the clock is read once per mount */
const subscribe = () => () => {};
const getServerSnapshot = (): ClinicClock | null => null;

function useClinicClock(): ClinicClock | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* The line under the hours table. Hidden until it has something true to say. */
export function OpenNow() {
  const now = useClinicClock();

  if (!now) return <p className="visit__now" id="open-now" hidden />;

  const { text, isOpen } = openNowLabel(now);
  return (
    <p className={`visit__now${isOpen ? " is-open" : ""}`} id="open-now">
      {text}
    </p>
  );
}

/* The call card echoes the same state, so the number is never offered with stale
   hours sitting under it. */
export function CallNow() {
  const now = useClinicClock();

  if (!now) {
    return (
      <p className="call__sub" id="call-now">
        Mon, Wed, Fri 7am&ndash;4pm <i>&middot;</i> Tue, Thu 10am&ndash;7pm
      </p>
    );
  }

  const { lead, rest, isOpen } = callNowLabel(now);
  return (
    <p className="call__sub" id="call-now">
      {isOpen ? <b>{lead}</b> : lead} <i>&middot;</i> {rest}
    </p>
  );
}

const ROWS: { day: number; label: string; recovery?: boolean; time: string }[] = [
  { day: 1, label: "Monday", time: "7:00 am – 4:00 pm" },
  { day: 2, label: "Tuesday", time: "10:00 am – 7:00 pm" },
  { day: 3, label: "Wednesday", time: "7:00 am – 4:00 pm" },
  { day: 4, label: "Thursday", time: "10:00 am – 7:00 pm" },
  { day: 5, label: "Friday", time: "7:00 am – 4:00 pm" },
  { day: 6, label: "Saturday", recovery: true, time: "7:00 am – 2:00 pm" },
  { day: 0, label: "Sunday", recovery: true, time: "1:00 pm – 7:00 pm" },
];

export function HoursTable() {
  const now = useClinicClock();

  return (
    <table className="hours">
      <caption className="sr">Opening hours by day</caption>
      <tbody>
        {ROWS.map((r) => (
          <tr key={r.day} data-day={r.day} className={now?.day === r.day ? "is-today" : undefined}>
            <th scope="row">
              {r.label}
              {r.recovery ? (
                <>
                  {" "}
                  <i className="hours__tag">Recovery</i>
                </>
              ) : null}
            </th>
            <td className="mono">{r.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
