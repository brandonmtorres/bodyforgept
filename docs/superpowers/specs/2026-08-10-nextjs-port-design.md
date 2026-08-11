# React / Next.js port — design

**Date:** 2026-08-10
**Status:** implemented. See "What the build changed" at the end for where the plan was
wrong.

## Goal

Rebuild bodyforgept.com's six pages as a React / Next.js application in a new `web/` directory,
rendering identically to the current static site. The existing `site/` and `tools/` trees stay
untouched and keep working, so the two can be compared side by side before anything is removed.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| CSS | `styles.css` ported verbatim to `app/globals.css` | Guarantees pixel parity. Preserves the OKLCH token system and the WCAG-AA contrast audit. Class names (`.hero__h`, `.ctab`, `.rv`) carry over unchanged. |
| Build target | Static export (`output: 'export'`) | Same hosting story as today: any file host, or dropped into the WordPress theme. No Node process. The Python gates keep working against the built folder. |
| Content | Typed TS modules in `content/` | Retires `tools/build-pages.py`. Copy edits never touch JSX. |
| Router | App Router, `trailingSlash: true` | Emits `out/<slug>/index.html`, matching current URLs exactly so legacy links and ranking carry over. |
| Images | Plain `<picture>` / `<img>` with existing `srcset` | `build-assets.py` already generates every derivative at four widths; export mode disables the `next/image` optimizer anyway. Crops stay reviewable in one place. |
| Fonts | `next/font/google`, self-hosted | Drops two preconnects and a render-blocking stylesheet. Falls back to the CDN `<link>` if the `wdth` variable axes misbehave. |

## Structure

```
web/
  app/
    layout.tsx              chrome: header, mobile nav, footer, dock
    page.tsx                /
    physical-therapy/page.tsx
    strength-and-conditioning/page.tsx
    sport-specific-rehabilitation/page.tsx
    pilates/page.tsx
    weekend-recovery/page.tsx
    globals.css             styles.css, verbatim
    not-found.tsx
  components/
    chrome/                 Header, MobileNav, Footer, Dock
    interactive/            Tabs, Disclosure, Reveal, ScrollSpy, Roadmap, ClinicStatus
    sections/               Hero, Approach, Conditions, ServiceRow, Recovery, Doctor,
                            Results, CallCard, Visit, PageHero, Rates, Partners,
                            RelatedPages, CtaBand
  content/                  conditions, services, rates, roadmap, testimonials, schema
  lib/hours.ts              CLINIC / RECOVERY tables and the open/closed computation
  public/media/             copy of site/assets/media
```

## Component tiers

**Chrome** (`app/layout.tsx`) — one copy of header, mobile nav, footer and dock, shared by every
route. This is the native equivalent of what `build-pages.py` injects today; the generator retires
here.

**Client islands** — `main.js` decomposed by behavior, not by page:

| Island | Replaces |
|---|---|
| `Header` | stuck-on-scroll, services dropdown, burger, escape-to-close |
| `Tabs` | roving tabindex, Arrow/Home/End, ARIA wiring |
| `Disclosure` | `aria-expanded` + the "Read the full review" / "Hide the full review" label swap |
| `Reveal` | IntersectionObserver with per-section stagger |
| `ScrollSpy` | nav `.is-here` |
| `Dock` | past-hero / at-book visibility |
| `Roadmap` | ember line trigger |
| `ClinicStatus` | `#open-now`, `#call-now`, `is-today` row |

Each island no-ops on pages that don't use it by simply not being rendered, replacing today's
`if (dock && heroSec)` guards.

**Sections** are server components. Repeated structured data (conditions by tab, service rows, rate
tables, roadmap phases, testimonials, JSON-LD) lives in `content/`; bespoke section layout stays in
JSX. `/weekend-recovery/` is not forced through the same template as the four service pages — they
share components, not a shape.

## Data flow

Content modules → server components render markup at build time → client islands attach behavior on
mount. No fetching. No state beyond UI-local.

## Hydration

Four things depend on "now": `#open-now`, `#call-now`, the `is-today` hours row, and `#yr`. Static
export renders HTML at build time, so computing these during render produces a hydration mismatch.

The server emits the neutral state — `#open-now` ships `hidden`, `#call-now` shows the static hours
line — and a `useEffect` fills in live state after mount. `#yr` is a build-time constant. This
mirrors what the current markup already does and degrades to correct static copy without JS.

The clock is pinned to `America/New_York`. The current build reads the visitor's local time, so a
California visitor is told the Miami clinic is open against Pacific hours. Fixed during the port.

## Progressive enhancement

`main.js` deliberately adds `.rv` from JavaScript so the page is fully visible if the script never
runs. Emitting `.rv` directly into JSX would leave every section invisible on script failure. The
`Reveal` component adds the class on mount, preserving the property exactly.

The `prefers-reduced-motion` path must still resolve to final state — an existing gate requirement.

## Verification

The existing Python gate is the test suite. `tools/check-site.py`, `test-flow.py`, `shoot.py` and
`audit.py` gain `BF_SITE` / `BF_BASE` environment variables, defaulting to the current paths so
`site/` still checks green.

| Check | Command |
|---|---|
| Whole-site gate | `BF_SITE=web/out BF_BASE=http://127.0.0.1:4173 python3 tools/check-site.py` |
| Interaction paths | `BF_BASE=http://127.0.0.1:4173 python3 tools/test-flow.py` |
| Types | `npm run typecheck` |
| Build | `npm run build` |
| Visual parity | `shoot.py` at four viewports against old and new, compared |

**Acceptance is the screenshot diff.** A clean gate proves the port isn't broken; matching
screenshots prove it is the same site.

## Sequencing

Scaffold → `globals.css` + fonts → home hero only → verify pixel parity **before** porting the
remaining ~5,000 lines. A type or color regression must surface at line 200, not line 5,000.

## What the build changed

Four things the plan got wrong, each found by measurement rather than review.

**Fonts went back to the CDN.** The plan self-hosted Archivo and Martian Mono through
`next/font`, with the CDN as a stated fallback "if the variable axes misbehave". The axes
were fine — both binaries are byte-for-byte equivalent at `wdth 108 / wght 620`. What broke
was the `ch` unit: Chromium resolved `22ch` against `next/font`'s `@font-face` set as 440px
where the CDN gave 418px, so every `.tst__pull` wrapped differently and the page below
shifted 12px. The CDN stylesheet is what the design was measured against, so it ships.

**`browserslist` had to be pinned.** Lightning CSS downlevelled the entire OKLCH palette to
sRGB hex on the default target, clamping the ember out of wide gamut — the one colour
DESIGN.md calls the identity. `package.json` now names OKLCH-capable browsers, which the
stylesheet already required.

**Same-page anchors could not stay plain `<a>`.** The plan kept them native so the CSS
smooth scroll would run. But a native hash navigation pushes a history entry the App Router
does not own: going home → `#conditions` → `/pilates/` → Back restored the URL without
re-rendering, leaving Pilates on screen under a home URL. Every in-page anchor now goes
through `next/link`.

**The verification harness needed more care than the app.** Three separate measurement
artifacts each produced double-digit false difference percentages before being controlled:
lazy images racing the screenshot, Chromium's 16384px full-page capture limit against a
17728px mobile page, and `scroll-behavior: smooth` putting the two builds at different
offsets. `tools/compare-builds.py` controls for all three and is checked in.

## Result

- `check-site.py` clean on all six pages of the Next build
- `test-flow.py` clean, output matching the static build line for line
- Page dimensions identical on all six pages at all four viewports
- 0.0243% of 212M pixels differ, max delta 60–70, all on glyph edges
- `tsc --noEmit`, `eslint`, `next build` all clean

## Out of scope

- Deleting or modifying `site/`, `tools/` content, or the existing docs
- Any visual redesign
- Booking forms or API routes — the clinic books by phone, `tel:+13054561004`
- Publishing physical therapy pricing, insurance status or session length (see PRODUCT.md)
