# BodyForge — React / Next.js build

The same six pages as `site/`, rebuilt as a Next.js App Router application. It builds to
a folder of static HTML, so it deploys exactly the way `site/` does.

`site/` and `tools/` are untouched and still work. Nothing is removed until you have
reviewed this.

```
web/
  app/
    layout.tsx                  header, mobile nav, footer, dock — shared by every route
    page.tsx                    /
    physical-therapy/page.tsx
    strength-and-conditioning/page.tsx
    sport-specific-rehabilitation/page.tsx
    pilates/page.tsx
    weekend-recovery/page.tsx
    not-found.tsx               404
    sitemap.ts                  → /sitemap.xml
    globals.css                 site/assets/css/styles.css, verbatim
  components/
    chrome/                     SiteHeader, SiteFooter, Dock, Brand, HashLink
    interactive/                Tabs, Disclosure, RevealController, ScrollSpy, ClinicStatus
    sections/                   one component per section of the page
    Picture.tsx                 <picture> with the pre-generated webp/jpg srcset
    JsonLd.tsx
  content/                      typed copy: services, conditions, testimonials, schema
  lib/hours.ts                  CLINIC / RECOVERY tables and the open-closed logic
  public/media/                 copy of site/assets/media
```

## Run it

```bash
npm install
npm run dev            # http://localhost:4174
npm run build          # → out/
```

If the dev page loads but comes up dead — no styling, nothing interactive — it is
`allowedDevOrigins`. `next dev` serves the HTML to any host but 403s every `/_next/*`
chunk unless the host is on that list, and only `localhost` is allowed by default. On WSL
a browser on the Windows side arrives by IP and hits exactly this. `next.config.ts` reads
the machine's own IPv4 addresses at startup and allows them, which survives the WSL
address changing between reboots. Add anything else you browse from to that list.

`next dev` also writes `AGENTS.md` and `CLAUDE.md` into this directory. They are its own,
not part of the port.

`out/` is a plain folder of HTML, CSS, JS and images. Netlify, Cloudflare Pages, S3,
nginx, or dropped into the WordPress theme — same as `site/`.

```bash
cd out && python3 -m http.server 4173
```

## What changed, and what did not

The stylesheet is `site/assets/css/styles.css` copied verbatim, so the design system,
the OKLCH palette and the WCAG-AA contrast audit are unchanged. Class names carry over,
which is why the section components read as the same markup with React wiring.

**`tools/build-pages.py` is retired.** The chrome it injected into each service page is
now `app/layout.tsx`, and the `PAGES` list is `content/`. `build-assets.py` still owns
the images and is unchanged.

Four deliberate differences from the static build:

| | Why |
|---|---|
| Clinic hours read `America/New_York` | The old build used the visitor's clock, so someone in California was told the Miami clinic was open against Pacific hours. `lib/hours.ts` |
| `browserslist` pins OKLCH-capable browsers | Without it the CSS minifier downlevels the whole palette to sRGB hex and the ember clamps out of wide gamut. `package.json` |
| Same-page `#anchors` go through `next/link` | A plain `<a>` pushes a history entry the router does not own; navigating on and pressing Back then restored the URL without re-rendering, leaving the previous page on screen. `components/chrome/HashLink.tsx` |
| Structured-data breadcrumb says `Strength & conditioning` | The generator emitted the HTML entity `&amp;` into JSON-LD, where it is literal text rather than markup. |

### Changes made after the first review

| | |
|---|---|
| Reveals, scrollspy and dock re-run per route | They lived in the layout with an empty dependency list, so they wired themselves to the first page only. Returning home after a client-side navigation left the hero at `opacity: 0`. |
| Reveals fire for everything at or above the fold | Previously only what overlapped the viewport. An element already scrolled past never intersects again, so navigating and flicking down before the effect ran left it invisible for good. |
| The `.split` sections gained reveal targets | "02" on strength, sports rehab and Pilates had no motion at all — no selector in the list matched a plain text column. So did the tagline band on the home page. |
| The announcement banner has a moving ember sheen | One pass every 9s, sitting under the text rather than over it. Worst-case contrast across the cycle is 7.30:1 against the 4.5:1 requirement. Removed entirely under `prefers-reduced-motion`. |
| Weekend Recovery standard rates step down a level | They were set at the same weight as the founding launch, so the two competed instead of ranking. Smaller numerals, muted ink, tighter rows. This makes the page 61–80px shorter than the static build — the only structural difference between them. |

### Changes made after the second review

| | |
|---|---|
| The hero photograph is now the mark | Enlarged, held to 55% and screened onto the ink ground so the dark parts of the artwork dissolve into the section. It fades up from a blur behind an expanding ember bloom, takes one specular pass masked to its own silhouette, then drifts slowly. All CSS — no animation library. Removed under `prefers-reduced-motion`. |
| The emblem is sized per breakpoint and comes after the copy on phones | At full size in the mobile slot it pushed both calls to action below the fold. The photograph earned that position by being proof; a logo does not. |
| "Weekend Recovery" reads "Recovery Program" | Everywhere it is shown, including page title, metadata and structured data. **The URL is still `/weekend-recovery/`** — changing it would break the links the old site accumulated. Section 05's headline keeps the phrase "Weekend recovery" as requested. |
| The gym partner section is gone | With it went the partner rates, the four partner benefits and the three-phase roadmap. Sections renumbered; the old "06 / When" is now "05 / When". `test-flow.py` asserted `#partners` existed — that assertion now checks it is absent, so the section cannot return unnoticed. |
| Section 05 is a headline and the hours | Its lead paragraph and the note about weekday availability are gone. The note referenced "phase two" of the roadmap, so it could not have stayed anyway. |
| The hero review caption is gone, the emblem is larger | The same review is unchanged in "Three patients, unedited", so only the duplicate went. The mark takes the whole right column at up to 540px and is centred against the copy. The `.plate` rules, the `.partner` reveal target and the print rules for both went with the markup they styled. |

Weekend Recovery pricing in `site/` still carries the gym partner program; only the React
build drops it. The two pages differ in content now, not just in framework.

The banner was left in the document flow rather than made sticky. The header is already
sticky and the mobile dock is already fixed; a third persistent band would take about
15% of a 390×844 viewport before any content. Say the word if you want it stuck under
the header anyway.

Fonts still come from the Google Fonts CDN rather than `next/font`. Self-hosting is the
more idiomatic choice and drops two preconnects, but it registers a different
`@font-face` set and Chromium resolves the `ch` unit against it differently: `22ch` came
out 22px wider, which changed every pull quote's wrap and shifted the page below it. The
note in `app/layout.tsx` records this.

## Deployment

GitHub Pages serves the **`gh-pages`** branch, which holds only the compiled export.
`main` holds the source. To publish a change:

```bash
cd web && npm run build
git checkout gh-pages
rm -rf ./*            # keep .git
cp -r web/out/. .
git add -A && git commit -m "Publish static export" && git push
git checkout main
```

`public/CNAME` carries the custom domain into every build, and `public/.nojekyll` stops
Pages stripping `_next/` for its leading underscore — without it every stylesheet and
script 404s.

**This is manual.** `.github/workflows/deploy.yml` automates it — build, type-check,
lint, assert every page is present, deploy — but pushing a workflow file needs a token
with `workflow` scope, which the current one lacks:

```bash
gh auth refresh -h github.com -s workflow      # then the workflow can be pushed
```

Once that lands, set the Pages source to "GitHub Actions" and every push to `main` that
touches `web/` deploys itself.

### DNS

The apex domain needs GitHub's four A records **and** four AAAA records. Leaving the
old AAAA records in place sends every IPv6 visitor to the previous host while IPv4
visitors get the new site, which looks like an intermittent fault.

```
A     @    185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
AAAA  @    2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
CNAME www  brandonmtorres.github.io
```

Leave MX records alone — the clinic's mail is on this domain.

## Verification

The Python gates in `tools/` take `BF_SITE` and `BF_BASE`, defaulting to `site/` and
port 4173, so they check either build.

```bash
cd site     && python3 -m http.server 4172 &
cd web/out  && python3 -m http.server 4173 &

BF_SITE=web/out BF_BASE=http://127.0.0.1:4173 python3 tools/check-site.py
BF_BASE=http://127.0.0.1:4173 python3 tools/test-flow.py
python3 tools/compare-builds.py        # old vs new, pixel by pixel
```

`compare-builds.py` is new: it walks all six pages at four viewports and reports where
the two builds differ. Current state: page dimensions identical everywhere, and 0.0243%
of pixels differ — antialiasing on glyph edges, no content or layout difference.

```bash
npm run typecheck
npm run lint
```

## Notes for whoever edits this next

`RevealController` is a whole port of the reveal logic from `main.js` rather than a
per-component wrapper, because the stagger is computed per section in document order.
The hiding rule is `.js .rv`, so `.rv` in the markup does nothing until the inline
script in `layout.tsx` sets `.js` on `<html>` — a blocked script leaves the page fully
visible, which is the property the static build had.

Anything that depends on "now" renders its neutral state on the server and fills in
after mount: `#open-now` ships `hidden`, `#call-now` ships the static hours line. Static
export has no runtime to compute them in, and computing them during render would make
the prerendered HTML disagree with the first client render.

Weekend Recovery prices are transcribed from the clinic's launch sheets in
`site/assets/img/promo/` and appear both in the visible markup and as `Offer` nodes in
`content/weekend-recovery-schema.ts`. A price change has to be made in both. Physical
therapy pricing is still unpublished and must stay off the page — see `PRODUCT.md`.
