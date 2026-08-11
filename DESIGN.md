# DESIGN.md — BodyForge Physical Therapy

## Color

Strategy: **Committed.** Ember carries the identity; ink and bone carry the reading. All neutrals are
tinted toward the ember hue (~45°). No `#000`, no `#fff`, anywhere.

```
--ink-900   oklch(0.17 0.014 48)   deepest ground, hero + drenched sections
--ink-800   oklch(0.22 0.016 48)   raised ink surfaces
--ink-700   oklch(0.30 0.016 48)   ink borders / hairlines
--ink-500   oklch(0.46 0.012 48)   muted text on bone
--ink-300   oklch(0.68 0.010 55)   muted text on ink

--bone-50   oklch(0.976 0.006 75)  page paper
--bone-100  oklch(0.955 0.009 72)  recessed paper
--bone-200  oklch(0.918 0.011 70)  paper hairline

--ember-600 oklch(0.545 0.170 40)  pressed / text-on-bone accent
--ember-500 oklch(0.645 0.196 42)  PRIMARY. Derived from the logo mark.
--ember-400 oklch(0.735 0.165 50)  hover lift, on-ink accent
--ember-100 oklch(0.930 0.045 62)  ember wash
```

Ember is the only chroma in the system. Nothing is blue. A cool secondary would pull the page toward
the hospital-web reflex the brand is defined against.

## Typography

Two families. Both variable, both self-hosted from Google Fonts CDN with `display=swap`.

**Archivo** (`wght` 100–900, `wdth` 62–125) — the whole voice.
- Display: `wdth` 112–125, `wght` 700–800, tracking −0.03em. Wide and heavy reads as *load-bearing*.
- Body: `wdth` 100, `wght` 400–500. Archivo's grotesque body is sturdy and highly legible at 18px+.

**Martian Mono** (`wght` 300–800) — instrument readout only.
- Degree values, measurement deltas, step numerals, time slots, small technical labels.
- Never body copy. Never a decorative kicker. It appears where a real number appears.

Scale (fluid, ratio ≥ 1.25):

```
--fs-display  clamp(3.2rem, 8.5vw, 7.5rem)
--fs-h1       clamp(2.4rem, 5.2vw, 4.2rem)
--fs-h2       clamp(1.9rem, 3.4vw, 3rem)
--fs-h3       clamp(1.35rem, 2vw, 1.75rem)
--fs-lead     clamp(1.15rem, 1.5vw, 1.4rem)
--fs-body     1.0625rem  (17px floor — the 68-year-old sets it)
--fs-mono     0.78rem
```

Measure capped at 66ch. Light-on-ink gets +0.06 line-height.

## Signature motif — none, deliberately

**The goniometer arc was retired in Aug 2026 at the clinic's request.** It carried illustrative
degree values, and illustrative numbers on a medical page are a liability however carefully they are
labelled. Do not reinstate it unless the clinic supplies real, anonymised, publishable readings.

It was first replaced with a graduated-rule graphic running off every section kicker, plus a
scrolling credential rail under the hero. Both were removed after a design review: eight identical
dashed lines down a page read as wireframe placeholder rather than as a motif, and a marquee reads
as a promo bar on a clinical surface. **Neither should come back.**

The measurement idea is now carried by language and type, not by a graphic device:

- **Martian Mono appears only where a real number or a real label does** — rates, hours, degrees of
  a service, figure captions, credential keys. That restraint is what makes it read as an instrument
  face rather than a decorative mono kicker.
- **Tabular figures and hairline rate rows.** Prices, hours and partner rates all use the same
  label-left / figure-right row with a 1px rule between. One quiet pattern, used three times in the
  recovery section, is worth more than one loud one.
- The copy does the rest: "test, treat, test again", "tracked and logged every session".

If a device is ever wanted again, the bar is that it must carry information. Decoration that merely
signals "technical" is what this brand is defined against.

## The one ember moment

Ember is the only chroma in the system, so **exactly one section may be drenched in it**: the
contact section. Everything else uses ember at accent weight only, and the primary call button is
the single ember fill on any other ground.

This rule was broken once, by giving the Weekend Recovery launch offer an ember-filled plate with
60px figures. It turned the page's most premium moment into a discount ad and left the page with two
competing orange blocks. The offer is now a hairline rate card marked primary by an ember top-rule
and label. **If a new offer needs emphasis, it gets a rule and a label, not a fill.**

## Elevation & material

No drop shadows on flat surfaces. Depth comes from:
- Paper vs. ink ground changes.
- 1px hairlines at `--bone-200` / `--ink-700`.
- Photography treated with a warm duotone floor on ink sections (`mix-blend-mode: luminosity` over
  an ink base at 92% so photos sit *in* the ground rather than on top of it).
- Real shadow only on the mobile action dock and the call panel, where physical lift is the correct
  signal.

## Motion

- Easing: `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)`.
- Durations: 180ms micro, 420ms reveal. Nothing on the page animates for longer.
- Transform and opacity only. `grid-template-rows` for disclosure panels.
- Full `prefers-reduced-motion` path: every reveal resolves to its final state and the pulse dots stop.
  There is nothing left on the page that animates content.

## Components

- **Buttons.** Square-ish 4px radius. Primary = ember fill, ink text. Secondary = 1px hairline,
  transparent. 48px min height, 56px on the primary booking action. Focus = 2px ember ring at 3px
  offset, always visible. The primary button is always the phone number.
- **No card grids.** Services are asymmetric editorial rows with real photography. Conditions are a
  region-filtered list, not four boxes.
- **Disclosure.** Service detail expands inline via `grid-template-rows: 0fr → 1fr`. No modals.
- **No forms.** Appointments are arranged by phone at the clinic's request. The contact panel is a
  call card: the number set as the largest tap target on the page, with a live "open now" line and a
  short list of what to have to hand. If a form is ever reinstated, labels go above the field, never
  placeholder-as-label, and validation runs on blur rather than on keystroke.

## Bans (project-specific, on top of impeccable's)

- No teal, no medical blue, no mint.
- No serif display type. This brand is not editorial.
- No icon-above-heading card grids.
- No stock photography of any kind.
- No invented numbers. Every numeral on the page is a real price, a real time, or a real fact.
- No promo furniture: no marquees, no "NEW" badges, no countdowns, no discount-styled price blocks.
