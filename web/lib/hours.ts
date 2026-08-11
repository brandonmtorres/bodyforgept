/* Weekends are open, but only for Weekend Recovery, so the indicator has to say
   which. Keeping the two sets separate is what makes that possible.

   Change these and the page follows; also update the openingHoursSpecification block
   in content/schema.ts so the structured data does not drift. */

export const CLINIC: Record<number, [number, number]> = {
  1: [7, 16],
  2: [10, 19],
  3: [7, 16],
  4: [10, 19],
  5: [7, 16],
};

export const RECOVERY: Record<number, [number, number]> = {
  6: [7, 14],
  0: [13, 19],
};

export const HOURS: Record<number, [number, number]> = { ...CLINIC, ...RECOVERY };

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/* The clinic is in Miami. Reading the visitor's own clock told someone in California
   the doors were open against Pacific hours, so the wall clock is pinned to the
   clinic's timezone rather than the browser's. */
const TZ = "America/New_York";

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export type ClinicClock = { day: number; minutes: number };

export function clinicClock(now: Date = new Date()): ClinicClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const day = WEEKDAY_INDEX[part("weekday")] ?? now.getDay();
  const hour = Number(part("hour")) % 24; // hour12:false renders midnight as 24
  const minute = Number(part("minute"));

  return { day, minutes: hour * 60 + minute };
}

export const clock = (h: number) => `${((h + 11) % 12) + 1}${h < 12 ? "am" : "pm"}`;

/* ── the hours line under the address ─────────────────────────────────────── */

export function openNowLabel({ day, minutes }: ClinicClock): {
  text: string;
  isOpen: boolean;
} {
  const span = HOURS[day];
  const isOpen = Boolean(span && minutes >= span[0] * 60 && minutes < span[1] * 60);
  const recoveryToday = day in RECOVERY;

  if (isOpen && span) {
    return {
      isOpen,
      text: recoveryToday
        ? `Recovery open now · until ${clock(span[1])}`
        : `Open now · until ${clock(span[1])}`,
    };
  }

  const next = nextOpenDay(day, HOURS);
  const sameDayLater = Boolean(span && minutes < span[0] * 60);
  const what = (d: number) => (d in RECOVERY ? "recovery opens" : "opens");

  if (sameDayLater && span) {
    return { isOpen, text: `Closed · ${what(day)} today at ${clock(span[0])}` };
  }
  return {
    isOpen,
    text: `Closed · ${what(next.day)} ${
      next.add === 1 ? "tomorrow" : DAYS[next.day]
    } at ${clock(HOURS[next.day][0])}`,
  };
}

/* ── the line under the phone number, which only tracks the clinic itself ──── */

export function callNowLabel({ day, minutes }: ClinicClock): {
  lead: string;
  rest: string;
  isOpen: boolean;
} {
  const span = CLINIC[day];

  if (span && minutes >= span[0] * 60 && minutes < span[1] * 60) {
    return {
      isOpen: true,
      lead: "Open now",
      rest: `the clinic answers until ${clock(span[1])} today`,
    };
  }

  const next = nextOpenDay(day, CLINIC);
  const sameDayLater = Boolean(span && minutes < span[0] * 60);

  if (sameDayLater && span) {
    return {
      isOpen: false,
      lead: "Leave a message",
      rest: `the clinic answers from ${clock(span[0])} today`,
    };
  }
  return {
    isOpen: false,
    lead: "Leave a message",
    rest: `the clinic answers ${
      next.add === 1 ? "tomorrow" : DAYS[next.day]
    } from ${clock(CLINIC[next.day][0])}`,
  };
}

function nextOpenDay(from: number, table: Record<number, [number, number]>) {
  let day = from;
  let add = 0;
  do {
    day = (day + 1) % 7;
    add++;
  } while (!table[day] && add < 8);
  return { day, add };
}
