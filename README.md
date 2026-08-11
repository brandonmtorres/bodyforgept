# BodyForge Physical Therapy — "Measured"

A ground-up redesign of bodyforgept.com. Static HTML, CSS and JavaScript. No build step, no
dependencies, no framework.

> **There is now a second build.** `web/` is the same six pages as a React / Next.js
> application, rendering identically and deploying the same way. It is there to be reviewed
> alongside this one; nothing here has been removed. See `web/README.md`, and
> `python3 tools/compare-builds.py` to diff the two.

```
site/
  index.html                          the landing page
  physical-therapy/index.html         generated
  strength-and-conditioning/index.html
  sport-specific-rehabilitation/index.html
  pilates/index.html
  robots.txt
  sitemap.xml                         generated
  assets/
    css/styles.css        design system + all styles
    js/main.js            tabs, disclosures, credential rail, hours, scrollspy, dock
    media/                generated derivatives (webp + jpg fallbacks)
    img/                  original source photography pulled from the live site
tools/
  build-assets.py         regenerates assets/media from assets/img
  build-pages.py          regenerates the four service pages + sitemap.xml
  check-site.py           whole-site gate: schema, headings, anchors, dead links,
                          alt text, canonicals, contrast, tap targets, overflow, console
  audit.py                single-page contrast / target / font-axis probe
  test-flow.py            drives the call paths, tabs, menu, keyboard paths
  shoot.py                screenshots at mobile / tablet / desktop / wide
  compare-builds.py       pixel diff of site/ against web/out/, six pages, four viewports
web/                      the React / Next.js build of the same six pages
PRODUCT.md                who this is for, brand voice, verified-claims rule
DESIGN.md                 colour, type, motion and component decisions
```

`check-site.py`, `test-flow.py`, `audit.py` and `shoot.py` take `BF_SITE` and `BF_BASE`
environment variables so they can gate either build. Defaults are unchanged: `site/` on
port 4173.

## Pages

| URL | Purpose |
|---|---|
| `/` | The whole story. Approach, conditions, services, Weekend Recovery, the team, reviews, contact, visit. |
| `/physical-therapy/` | Core PT. What we help with, what a visit looks like, a patient review. |
| `/strength-and-conditioning/` | Three ways to train, and why a PT rather than a gym trainer. |
| `/sport-specific-rehabilitation/` | Return-to-sport testing, sports covered, a patient review. |
| `/pilates/` | What one-on-one Pilates is here, the apparatus, who it suits. |
| `/weekend-recovery/` | The recovery service in full: what a session is, rates, first responder pricing, the gym partner program and its roadmap. |

The first four URLs match the original WordPress site exactly, so existing links and any accumulated
ranking carry over rather than 404ing. `/weekend-recovery/` is new and has no legacy counterpart.

**The service pages are generated.** Header, mobile nav, footer and dock are extracted from
`site/index.html` at build time, so there is one copy of the chrome to maintain. Edit the chrome in
`index.html`, then:

```bash
python3 tools/build-pages.py
```

Page copy lives in the `PAGES` list at the bottom of that script.

Each service page's calls to action are `tel:` links. The `#book` anchor still exists on the home
page contact section, because the service pages and the old WordPress site both link to it.

## Run it

```bash
cd site && python3 -m http.server 4173
# http://127.0.0.1:4173/
```

Any static host works: Netlify, Cloudflare Pages, S3, or dropped into the existing WordPress
theme as a page template.

## Regenerating images

`assets/img/` holds the untouched originals. `tools/build-assets.py` produces every responsive
derivative from them, so crops are reproducible and reviewable in one place:

```bash
python3 tools/build-assets.py
```

Two frames are cropped by explicit pixel box rather than by focal point, because the auto-crop
kept the **old** wall logo in frame. Those are marked `BOXED` in the script.

## Contact routing

There is no booking form. Dr. Perez-Espinosa asked for appointments to be arranged by phone, so
every primary action on every page is `tel:+13054561004` and the contact section is a call card.
The clinic address is `info@bodyforgept.com`.

Weekday and weekend hours live in one place, `assets/js/main.js`:

```js
const CLINIC   = { 1: [7, 16], 2: [10, 19], 3: [7, 16], 4: [10, 19], 5: [7, 16] };
const RECOVERY = { 6: [7, 14], 0: [13, 19] };
```

They drive the today-row highlight in the hours table, the open/closed indicator, and the live line
under the phone number in the call card. Weekends are labelled as recovery-only in all three,
because physical therapy does not run then. Change these and the page follows; also update the
`openingHoursSpecification` block in `index.html` so the structured data does not drift.

## Weekend Recovery pricing

Every figure on `/weekend-recovery/` is transcribed from the clinic's own launch sheets in
`assets/img/promo/`. There are four of them and they are the only source:

| Sheet | What it supplies |
|---|---|
| `BodyForge_Client_Promo` | The retail menu and the founding launch: $49 first session, $169/mo founding rate locked 12 months, first 25 members. Standard single $85, eight-pack $600, membership $199/mo. Weekend hours. |
| `BodyForge_First_Responder_Pricing` | The first responder table: $70 single, $240 four-pack, $160/mo, $280/mo, the per-visit rates and the savings. Also the only source for the $349/mo performance tier and the wellness disclaimer. |
| `BodyForge_Gym_Founding_Member_Promo` | Partner rate $70, four-visit pack $60/visit at $240, the 15% referral, free advertising, founding-partner status. |
| `BodyForge_Founding_Partner_Roadmap` | The three phases: Launch (now), Expansion (later 2026), BodyForge+ (early 2027). |

The only derived number on the page is "$75 a session", which is $600 ÷ 8. Everything else is quoted.
The figures also appear as `Offer` nodes in the page's JSON-LD, so a price change has to be made in
both the visible markup and the structured data. Physical therapy pricing is still unpublished and
must not be invented.

## Verification

```bash
python3 tools/check-site.py   # all five pages: the full gate
python3 tools/test-flow.py    # booking, validation, tabs, disclosures, menu, dock
```

`check-site.py` exits non-zero on any failure, so it works as a pre-deploy gate. Run it after
every content edit.

Current state: clean across all five pages. WCAG AA contrast at 390px and 1440px, every
interactive target at least 44px, no horizontal overflow, no console errors, no dead links or
assets, one `h1` per page, correct canonicals, and the full reduced-motion path resolves to
final state.

## Facts on this page

Every claim, credential, testimonial and detail is taken from the live site or the clinic's own
photography, with one labelled exception below.

Deliberately absent, because the business has never published it: session length, pricing,
insurance or cash-pay policy, patient volume, success rates, and any aggregate review score.
See the "Verified claims only" section of PRODUCT.md before adding numbers.

**The goniometer graphics were removed in Aug 2026.** They carried illustrative range-of-motion
figures, and the clinic would rather not show a number it has not measured on a real patient, even a
labelled one. The measurement motif is now a graduated rule (see DESIGN.md), which makes the same
argument without a numeral. The hero slot they occupied now carries a verbatim patient review.

**Weekend Recovery prices are the exception to "no numbers".** They come from the clinic's own
launch sheets in `assets/img/promo/` and are quoted exactly. Physical therapy pricing, insurance
status and session length remain unpublished and must stay off the page.

**The practice is a team now.** Copy promises one-to-one attention with a clinician you keep, not
that the clinician is Dr. Perez-Espinosa. He is the founder and the credentialled face; he is not
the guaranteed provider.

**The Neurological tab lists Ehlers-Danlos syndrome** because the clinic grouped it there. It is a
connective-tissue disorder rather than a strictly neurological one; it was left where the clinic
put it rather than silently re-filed.

One inconsistency carried over from the live site and **not** silently resolved: the old copy
says "South Miami" while the address is 3600 W Flagler St, which is Little Havana. This build
says "Miami" everywhere and uses the real address. Worth deciding deliberately, since it affects
local search.
