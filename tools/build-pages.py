#!/usr/bin/env python3
"""Generate the service pages.

Shared chrome (header, mobile nav, footer, dock) is extracted from site/index.html at build
time, so there is exactly one copy of it to maintain. Run after editing index.html:

    python3 tools/build-pages.py

URLs match the original WordPress site so existing links and any accumulated ranking carry over.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
INDEX = (SITE / "index.html").read_text()

# ── pull the shared chrome out of the home page ────────────────────────────
header = INDEX[INDEX.index('<a class="skip"'): INDEX.index('<main id="main">')]
footer = INDEX[INDEX.index('<footer class="ft">'): INDEX.index('</body>')]


def absolutise(html):
    """Sub-pages live one level down, so relative asset paths and same-page hashes
    have to become root-relative."""
    html = re.sub(r'(src|href)="assets/', r'\1="/assets/', html)
    html = re.sub(r'(srcset|imagesrcset)="([^"]+)"',
                  lambda m: f'{m.group(1)}="' + m.group(2).replace("assets/", "/assets/") + '"', html)
    html = re.sub(r'href="#([a-z0-9-]+)"', r'href="/#\1"', html)
    html = html.replace('href="/#main"', 'href="#main"')          # skip link stays local
    html = html.replace('href="/#top"', 'href="/"')               # brand goes home
    html = html.replace('href="/#book"', 'href="/#book"')
    return html


HEADER = absolutise(header)
FOOTER = absolutise(footer)

CTA = """      <div class="hero__cta">
        <a class="btn btn--primary btn--lg" href="tel:+13054561004">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/></svg>
          Call about {cta}
        </a>
        <a class="btn btn--ghost btn--lg" href="{cta2_href}">
          {cta2}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m0 0-6-6m6 6-6 6"/></svg>
        </a>
      </div>"""


def lines(text):
    """Turn 'a<br>b' into spans, so assistive tech reads a word gap not 'ab'."""
    return "".join(f'<span class="ln">{part}</span>' for part in text.split("<br>"))


WORDS = {1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six"}


def shell(p):
    """Assemble one page."""
    h1 = lines(p['h1'])
    rel_h = f"The other {WORDS.get(len(PAGES) - 1, len(PAGES) - 1)}"
    others = "".join(
        f'<a class="rel__i" href="/{o["slug"]}/">'
        f'<span class="rel__t">{o["nav"]}</span>'
        f'<span class="rel__d">{o["rel_blurb"]}</span>'
        f'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m0 0-6-6m6 6-6 6"/></svg></a>'
        for o in PAGES if o["slug"] != p["slug"]
    )

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{p['title']}</title>
<meta name="description" content="{p['desc']}">
<link rel="canonical" href="https://bodyforgept.com/{p['slug']}/">
<meta name="theme-color" content="#150e0a">

<meta property="og:type" content="article">
<meta property="og:site_name" content="BodyForge Physical Therapy">
<meta property="og:title" content="{p['title']}">
<meta property="og:description" content="{p['desc']}">
<meta property="og:url" content="https://bodyforgept.com/{p['slug']}/">
<meta property="og:image" content="https://bodyforgept.com/assets/media/og.jpg">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="/assets/media/icon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/assets/media/icon-180.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Martian+Mono:wdth,wght@75..112.5,100..800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/styles.css">
<script>document.documentElement.classList.add("js");</script>

<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@graph": [
    {{
      "@type": "Service",
      "@id": "https://bodyforgept.com/{p['slug']}/#service",
      "name": "{p['schema_name']}",
      "serviceType": "{p['schema_type']}",
      "description": "{p['desc']}",
      "url": "https://bodyforgept.com/{p['slug']}/",
      "provider": {{
        "@type": ["MedicalBusiness", "PhysicalTherapy"],
        "name": "BodyForge Physical Therapy",
        "@id": "https://bodyforgept.com/#clinic",
        "telephone": "+1-305-456-1004",
        "address": {{
          "@type": "PostalAddress",
          "streetAddress": "3600 West Flagler Street",
          "addressLocality": "Miami",
          "addressRegion": "FL",
          "postalCode": "33135",
          "addressCountry": "US"
        }}
      }},
      "areaServed": {{ "@type": "City", "name": "Miami" }},
      "availableChannel": {{
        "@type": "ServiceChannel",
        "serviceUrl": "https://bodyforgept.com/#book",
        "servicePhone": "+1-305-456-1004"
      }}
    }},
    {{
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bodyforgept.com/" }},
        {{ "@type": "ListItem", "position": 2, "name": "{p['nav']}", "item": "https://bodyforgept.com/{p['slug']}/" }}
      ]
    }}{p.get('extra_schema', '')}
  ]
}}
</script>
</head>

<body>
{HEADER}
<main id="main">

<section class="phero">
  <div class="sec__grain" aria-hidden="true"></div>
  <div class="wrap phero__in">
    <nav class="crumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{p['nav']}</span>
    </nav>
    <div class="phero__copy">
      <p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>{p['eyebrow']}</p>
      <h1 class="phero__h">{h1}</h1>
      <p class="lead">{p['lead']}</p>
{CTA.format(key=p['key'], cta=p['cta'], cta2=p.get('cta2', 'Other ways to reach us'), cta2_href=p.get('cta2_href', '/#book'))}
    </div>
    <figure class="phero__fig">
      {p['hero_img']}
    </figure>
  </div>
</section>

{p['body']}

<section class="sec sec--bone rel" aria-labelledby="rel-h">
  <div class="wrap">
    <p class="kicker">Also at BodyForge</p>
    <h2 class="h2 rel__h" id="rel-h">{rel_h}</h2>
    <div class="rel__grid">{others}</div>
  </div>
</section>

<section class="sec cta" aria-labelledby="cta-h">
  <div class="wrap cta__in">
    <div>
      <h2 class="h2" id="cta-h">{p['cta_h']}</h2>
      <p class="lead">Appointments are arranged on the phone. Two minutes of hearing what happened tells us more than a form does, and you will know before you hang up whether this is the right place for it.</p>
    </div>
    <div class="cta__act">
      <a class="btn btn--primary btn--lg" href="tel:+13054561004">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/></svg>
        Call (305) 456-1004
      </a>
      <a class="btn btn--ghost btn--lg" href="mailto:info@bodyforgept.com">Email the clinic</a>
      <p class="cta__addr">3600 W Flagler St, Miami FL 33135 <i>·</i> {p.get('cta_hours', 'Mon, Wed, Fri 7am&ndash;4pm <i>·</i> Tue, Thu 10am&ndash;7pm')}</p>
    </div>
  </div>
</section>

</main>
{FOOTER}</body>
</html>
"""


def img(stem, widths, w, h, alt, sizes="(max-width: 900px) 100vw, 52vw", fallback=None):
    srcset = ", ".join(f"/assets/media/{stem}-{x}.webp {x}w" for x in widths)
    return (f'<picture><source type="image/webp" srcset="{srcset}" sizes="{sizes}">'
            f'<img src="/assets/media/{fallback or f"{stem}-{max(widths)}.jpg"}" width="{w}" height="{h}" '
            f'loading="eager" decoding="async" alt="{alt}"></picture>')


# ══════════════════════════════════════════════════════════════════ pages ══
PAGES = [
{
 "slug": "weekend-recovery", "key": "recovery", "nav": "Weekend Recovery",
 "cta": "Weekend Recovery", "cta_h": "Book a weekend slot",
 "cta2": "See the rates", "cta2_href": "#rates",
 "cta_hours": "Sat 7am&ndash;2pm <i>·</i> Sun 1pm&ndash;7pm <i>·</i> by appointment",
 "rel_blurb": "Thirty-minute recovery sessions, Saturdays and Sundays",
 "title": "Weekend Recovery in Miami | BodyForge Physical Therapy",
 "desc": "Thirty-minute recovery sessions in Miami: massage, assisted stretching, joint mobilization, cupping, Theragun and Normatec compression, run by a licensed PT clinic. Saturdays and Sundays. From $49.",
 "schema_name": "Weekend Recovery", "schema_type": "Recovery and manual therapy session",
 "eyebrow": "Weekend Recovery \u00b7 now open in Miami",
 "h1": "Professional recovery<br>in thirty minutes",
 "lead": "Manual massage, assisted stretching, joint mobilization, cupping, Theragun and Normatec compression boots, delivered by the clinical team at BodyForge. In, reset, and back to your day.",
 "hero_img": img("warm-knee", [640, 1000, 1500], 1500, 1000, "A BodyForge clinician working a patient's knee during a weekend recovery session."),
 "body": """
<section class="sec sec--bone" aria-labelledby="wr-s">
  <div class="wrap">
    <p class="kicker">01 <i>/</i> What a session is</p>
    <div class="cond__top">
      <h2 class="h2" id="wr-s">Six things, thirty minutes, one table</h2>
      <p class="lead">A session is built from whichever of these your body actually needs that day. You are not handed a fixed menu, and nothing is added to fill the time.</p>
    </div>
    <div class="fourway fourway--3">
      <article>
        <h3>Manual massage</h3>
        <p>Hands-on soft-tissue work through the muscle and fascia that has tightened up since the last time you trained, sat, or slept badly.</p>
      </article>
      <article>
        <h3>Assisted stretching</h3>
        <p>Someone else holds the position and takes the guesswork out of it, so the stretch reaches range you cannot hold on your own.</p>
      </article>
      <article>
        <h3>Joint mobilization</h3>
        <p>Graded pressure applied at the joint itself to restore glide where a knee, hip, shoulder or ankle has stopped moving through its full arc.</p>
      </article>
      <article>
        <h3>Cupping</h3>
        <p>Suction cups lift the tissue rather than pressing into it, used across backs, calves and shoulders where dense tissue has stopped sliding.</p>
      </article>
      <article>
        <h3>Theragun</h3>
        <p>Percussive therapy at speed, used to take the edge off a muscle quickly before the hands-on work, or to finish a session.</p>
      </article>
      <article>
        <h3>Normatec compression</h3>
        <p>Compression boots that inflate in sequence from the foot up, flushing the legs after a long run, a long shift, or a heavy week.</p>
      </article>
    </div>
    <p class="cond__note">Not sure which of these you need? <a href="tel:+13054561004">Call and describe the week you have had</a>, and the session gets built around the answer.</p>
  </div>
</section>

<section class="sec sec--ink" aria-labelledby="wr-w">
  <div class="sec__grain" aria-hidden="true"></div>
  <div class="wrap">
    <p class="kicker kicker--on-ink">02 <i>/</i> Why a clinic, not a spa</p>
    <div class="split">
      <div>
        <h2 class="h2" id="wr-w">Recovery with a clinical edge</h2>
        <p class="lead">The same people who rebuild knees after surgery run these sessions. That is the entire difference, and it shows up in what they will and will not do to you.</p>
        <ol class="incl incl--ink" style="margin-top:1.8rem">
          <li><h3>Licensed clinicians</h3><p>The people who run your recovery session are the people who run the rehab floor. They know when to press and when to stop, and they will tell you if what you are describing needs a proper evaluation instead.</p></li>
          <li><h3>Thirty minutes</h3><p>Long enough to change how you feel, short enough to fit a Saturday morning around everything else you have to do.</p></li>
          <li><h3>No lock-in</h3><p>Start with a single session. Membership exists because people asked for it, not because you have to sign anything to walk in the door.</p></li>
        </ol>
      </div>
      <figure class="split__fig split__fig--stick">
        <picture><source type="image/webp" media="(min-width: 900px)" srcset="/assets/media/hands-knee-tall-520.webp 520w, /assets/media/hands-knee-tall-800.webp 800w, /assets/media/hands-knee-tall-1100.webp 1100w" sizes="42vw"><source type="image/webp" srcset="/assets/media/hands-knee-640.webp 640w, /assets/media/hands-knee-1000.webp 1000w, /assets/media/hands-knee-1500.webp 1500w" sizes="100vw"><img src="/assets/media/hands-knee-1500.jpg" width="1500" height="1000" loading="lazy" decoding="async" alt="A clinician's hands working along the side of a patient's knee during a recovery session."></picture>
      </figure>
    </div>
    <p class="note note--ink">Recovery sessions are wellness services. They are not a substitute for diagnosed physical therapy care, and if what you have needs treating rather than easing, you will be told so.</p>
  </div>
</section>

<section class="sec sec--bone2" id="rates" aria-labelledby="wr-r">
  <div class="wrap">
    <p class="kicker">03 <i>/</i> Rates</p>
    <div class="cond__top">
      <h2 class="h2" id="wr-r">What it costs</h2>
      <p class="lead">Every figure below is what you pay at the desk. There is no joining fee, no contract, and no charge for the first conversation on the phone.</p>
    </div>

    <ul class="incl-strip">
      <li>Thirty minutes, one to one</li>
      <li>All six modalities available in every session</li>
      <li>Run by a licensed clinician</li>
      <li>Booked by phone, held by name</li>
    </ul>

    <div class="rates rates--launch">
      <div class="rates__lead">
        <p class="rates__k mono"><span class="rates__star" aria-hidden="true">&#9733;</span> Founding member launch</p>
        <p class="rates__cap">Open to the first 25 members. After that the founding rate closes and standard pricing applies.</p>
      </div>
      <dl class="rate rate--feature">
        <div class="rate__r">
          <dt><b>First session</b><span>New clients, any weekend</span></dt>
          <dd><span class="rate__n mono">$49</span><em class="rate__save">Save $36</em></dd>
        </div>
        <div class="rate__r">
          <dt><b>Founding membership</b><span>Four sessions a month, about $42 a visit</span></dt>
          <dd><s class="mono">$199</s><span class="rate__n mono">$169<i>/mo</i></span><em class="rate__save">Save $30/mo</em></dd>
        </div>
      </dl>
    </div>

    <div class="rates">
      <div class="rates__lead">
        <p class="rates__k mono">Standard rates</p>
        <p class="rates__cap">What everything costs once the founding places are gone.</p>
      </div>
      <dl class="rate">
        <div class="rate__r">
          <dt><b>Single session</b><span>Drop in any weekend</span></dt>
          <dd><span class="rate__n mono">$85</span></dd>
        </div>
        <div class="rate__r">
          <dt><b>Eight-session pack</b><span>$75 a session, against $85 for a drop-in</span></dt>
          <dd><span class="rate__n mono">$600</span><em class="rate__save">Save $80</em></dd>
        </div>
        <div class="rate__r">
          <dt><b>Membership</b><span>Four sessions a month, about $50 a visit</span></dt>
          <dd><span class="rate__n mono">$199<i>/mo</i></span></dd>
        </div>
        <div class="rate__r">
          <dt><b>Performance membership</b><span>Eight sessions a month, about $44 a visit</span></dt>
          <dd><span class="rate__n mono">$349<i>/mo</i></span></dd>
        </div>
      </dl>
    </div>
  </div>
</section>

<section class="sec sec--ink" id="first-responders" aria-labelledby="wr-fr">
  <div class="sec__grain" aria-hidden="true"></div>
  <div class="wrap">
    <p class="kicker kicker--on-ink">04 <i>/</i> First responder program</p>
    <div class="cond__top">
      <h2 class="h2" id="wr-fr">You take care of Miami. <span class="ln">Let us take care of you.</span></h2>
      <p class="lead">Every first responder gets our partner pricing on professional recovery, and scheduling that works around a rotation rather than against it.</p>
    </div>

    <ul class="chips chips--ink" style="margin-bottom:2.2rem">
      <li>Police</li><li>Fire</li><li>EMS and paramedics</li><li>911 dispatch</li><li>Corrections</li>
    </ul>

    <dl class="rate rate--ink">
      <div class="rate__r">
        <dt><b>Single visit</b><span>Drop in anytime</span></dt>
        <dd><s class="mono">$85</s><span class="rate__n mono">$70</span><em class="rate__save">Save $15</em></dd>
      </div>
      <div class="rate__r">
        <dt><b>Four-visit pack</b><span>$60 a visit, use within 120 days</span></dt>
        <dd><span class="rate__n mono">$240</span><em class="rate__save">Save $100</em></dd>
      </div>
      <div class="rate__r rate__r--hero">
        <dt><b>Monthly membership</b> <i class="rate__tag">Most popular</i><span>Four sessions a month, $40 a visit</span></dt>
        <dd><s class="mono">$199</s><span class="rate__n mono">$160<i>/mo</i></span><em class="rate__save">Save $39/mo</em></dd>
      </div>
      <div class="rate__r">
        <dt><b>Performance membership</b><span>Eight sessions a month, $35 a visit</span></dt>
        <dd><s class="mono">$349</s><span class="rate__n mono">$280<i>/mo</i></span><em class="rate__save">Save $69/mo</em></dd>
      </div>
    </dl>

    <div class="claim">
      <h3>How to claim it</h3>
      <p>Show a valid first-responder ID when you book or check in. That is the whole process. Tell us your rotation when you call and we will work around it.</p>
      <a class="btn btn--primary" href="tel:+13054561004">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/></svg>
        Call (305) 456-1004
      </a>
    </div>
  </div>
</section>

<section class="sec sec--bone" id="partners" aria-labelledby="wr-p">
  <div class="wrap">
    <p class="kicker">05 <i>/</i> For gyms and studios</p>
    <div class="cond__top">
      <h2 class="h2" id="wr-p">Become a founding partner</h2>
      <p class="lead">Bring professional recovery to your members at zero cost to you. We handle the booking, the payment and the sessions. You give your members a premium perk and earn on every visit.</p>
    </div>

    <div class="split">
      <div>
        <ol class="incl">
          <li><h3>Partner pricing for your members</h3><p>An exclusive $70 rate on weekend recovery sessions, below our retail menu, and $60 a visit on a four-visit pack.</p></li>
          <li><h3>15% referral on every visit</h3><p>You earn on every session your members book. Nothing out of pocket, ever.</p></li>
          <li><h3>Free advertising</h3><p>Your gym promoted inside our clinic and across our social channels.</p></li>
          <li><h3>Founding partner status</h3><p>First access to everything we launch next, including the BodyForge+ app.</p></li>
        </ol>
      </div>
      <div>
        <p class="rates__k mono">What your members pay</p>
        <dl class="rate">
          <div class="rate__r">
            <dt><b>Single visit</b></dt>
            <dd><s class="mono">$85</s><span class="rate__n mono">$70</span><em class="rate__save">Save $15</em></dd>
          </div>
          <div class="rate__r">
            <dt><b>Four-visit pack</b><span>$60 a visit</span></dt>
            <dd><span class="rate__n mono">$240</span><em class="rate__save">Save $100</em></dd>
          </div>
        </dl>
        <p class="note">$240 for the pack, which is $100 less than four visits at retail. Founding partner places are limited.</p>
      </div>
    </div>

    <h3 class="road__h" id="wr-road">How the partnership grows</h3>
    <ol class="road" data-road aria-labelledby="wr-road">
      <li>
        <p class="road__p mono">Phase 1 <i>&middot;</i> now</p>
        <h4>Launch</h4>
        <ul>
          <li>Individual appointments and packages for your members at partner pricing</li>
          <li>Free advertising for your gym at our clinic and on our social pages</li>
          <li>Founding partner status in the BodyForge community</li>
        </ul>
      </li>
      <li>
        <p class="road__p mono">Phase 2 <i>&middot;</i> later 2026</p>
        <h4>Expansion</h4>
        <ul>
          <li>Monthly membership deals for your members, recurring recovery at better value</li>
          <li>Expanded hours and days, including new weekday availability</li>
          <li>Deeper co-marketing and member perks as the community grows</li>
        </ul>
      </li>
      <li>
        <p class="road__p mono">Phase 3 <i>&middot;</i> early 2027</p>
        <h4>BodyForge+</h4>
        <ul>
          <li>One month free access to the BodyForge+ app for your members</li>
          <li>Fitness tracking, guided learning and community engagement</li>
          <li>Unlocks on app release at the start of 2027</li>
        </ul>
      </li>
    </ol>
  </div>
</section>

<section class="sec sec--ink" aria-labelledby="wr-h">
  <div class="sec__grain" aria-hidden="true"></div>
  <div class="wrap">
    <p class="kicker kicker--on-ink">06 <i>/</i> When</p>
    <div class="split">
      <div>
        <h2 class="h2" id="wr-h">Weekends, by appointment</h2>
        <p class="lead">Recovery runs Saturday and Sunday only. Physical therapy runs Monday to Friday, and the two are booked on the same number.</p>
        <p class="note note--plain" style="margin-top:1.4rem">More days are coming: weekday availability is part of phase two, later in 2026.</p>
      </div>
      <dl class="rate">
        <div class="rate__r">
          <dt><b>Saturday</b></dt>
          <dd><span class="rate__n mono">7:00 am &ndash; 2:00 pm</span></dd>
        </div>
        <div class="rate__r">
          <dt><b>Sunday</b></dt>
          <dd><span class="rate__n mono">1:00 pm &ndash; 7:00 pm</span></dd>
        </div>
      </dl>
    </div>
  </div>
</section>
""",
 "extra_schema": """,
    {
      "@type": "Service",
      "@id": "https://bodyforgept.com/weekend-recovery/#offers",
      "name": "Weekend Recovery",
      "serviceType": "Recovery and manual therapy session",
      "provider": { "@id": "https://bodyforgept.com/#clinic" },
      "areaServed": { "@type": "City", "name": "Miami" },
      "hoursAvailable": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "07:00", "closes": "14:00" },
        { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "13:00", "closes": "19:00" }
      ],
      "offers": [
        { "@type": "Offer", "name": "Founding member first session", "price": "49", "priceCurrency": "USD", "description": "First session for new clients during the founding member launch. Limited to the first 25 members." },
        { "@type": "Offer", "name": "Founding membership", "price": "169", "priceCurrency": "USD", "description": "Founding monthly rate, locked for 12 months." },
        { "@type": "Offer", "name": "Single session", "price": "85", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "Eight session pack", "price": "600", "priceCurrency": "USD" },
        { "@type": "Offer", "name": "Membership", "price": "199", "priceCurrency": "USD", "description": "Four sessions a month." },
        { "@type": "Offer", "name": "Performance membership", "price": "349", "priceCurrency": "USD", "description": "Eight sessions a month." },
        { "@type": "Offer", "name": "First responder single visit", "price": "70", "priceCurrency": "USD", "eligibleCustomerType": "First responders" },
        { "@type": "Offer", "name": "First responder four-visit pack", "price": "240", "priceCurrency": "USD", "eligibleCustomerType": "First responders" },
        { "@type": "Offer", "name": "First responder monthly membership", "price": "160", "priceCurrency": "USD", "eligibleCustomerType": "First responders" },
        { "@type": "Offer", "name": "First responder performance membership", "price": "280", "priceCurrency": "USD", "eligibleCustomerType": "First responders" }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://bodyforgept.com/weekend-recovery/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What happens in a BodyForge recovery session?",
          "acceptedAnswer": { "@type": "Answer", "text": "A thirty-minute session built from manual massage, assisted stretching, joint mobilization, cupping, Theragun percussive therapy and Normatec compression boots, using whichever of those your body needs that day." }
        },
        {
          "@type": "Question",
          "name": "How much does Weekend Recovery cost?",
          "acceptedAnswer": { "@type": "Answer", "text": "A single session is $85, an eight-session pack is $600, membership is $199 a month for four sessions and performance membership is $349 a month for eight. During the founding member launch the first session is $49 for new clients and founding membership is $169 a month locked for twelve months, limited to the first 25 members." }
        },
        {
          "@type": "Question",
          "name": "Is there a first responder discount?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Police, fire, EMS and paramedics, 911 dispatch and corrections all qualify. A single visit is $70, a four-visit pack is $240, monthly membership is $160 and performance membership is $280. Show a valid first-responder ID when you book or check in." }
        },
        {
          "@type": "Question",
          "name": "When is Weekend Recovery open?",
          "acceptedAnswer": { "@type": "Answer", "text": "Saturday 7am to 2pm and Sunday 1pm to 7pm, by appointment. Physical therapy runs Monday to Friday." }
        }
      ]
    }"""
},
{
 "slug": "physical-therapy", "key": "physical-therapy", "nav": "Physical therapy",
 "cta": "physical therapy", "cta_h": "Ready when you are",
 "rel_blurb": "After surgery, joint and muscle pain, balance, neurological",
 "title": "Physical Therapy in Miami | BodyForge Physical Therapy",
 "desc": "One-on-one physical therapy in Miami. Recovery after surgery, joint and muscle pain, balance problems and neurological conditions, treated by a licensed clinician. 3600 W Flagler St.",
 "schema_name": "Personalized Physical Therapy", "schema_type": "Physical therapy",
 "eyebrow": "Service 01",
 "h1": "Physical therapy,<br>one patient at a time",
 "lead": "You get your clinician for the whole visit, every visit. We work out what is actually causing the problem, treat it by hand, give you the exercises that hold the change, and measure it again so you can see it working.",
 "hero_img": img("mat", [640, 1000], 1000, 667, "Hands-on knee and hip treatment on the mat at BodyForge.", fallback="mat-1000.jpg"),
 "body": """
<section class="sec sec--bone" aria-labelledby="pt-w">
  <div class="wrap">
    <p class="kicker">01 <i>/</i> What we help with</p>
    <div class="cond__top">
      <h2 class="h2" id="pt-w">Most people arrive one of four ways</h2>
      <p class="lead">Something was operated on, something wore out, something gave way, or something started hurting and never stopped.</p>
    </div>
    <div class="fourway fourway--3">
      <article>
        <h3>After surgery</h3>
        <p>Knee, hip and shoulder replacements. ACL, MCL and LCL surgery. Rotator cuff and labral repairs. Spinal fusion. Broken bones. Muscle and tendon repairs.</p>
      </article>
      <article>
        <h3>Joint and muscle pain</h3>
        <p>Arthritis, bursitis, thinning bones, low back pain, neck pain, SI joint pain, plantar fasciitis, sciatica, and the sprains and strains that never quite settled.</p>
      </article>
      <article>
        <h3>Balance and dizziness</h3>
        <p>Vertigo and spinning sensations, inner-ear balance problems, unsteadiness on your feet, and balance after a stroke or a head injury.</p>
      </article>
      <article>
        <h3>Sports injuries</h3>
        <p>Rotator cuff pain, tennis and golfer's elbow, achilles tendonitis, runner's knee, and the backs and knees that only complain when you train.</p>
      </article>
      <article>
        <h3>Neurological</h3>
        <p>Parkinson's disease, foot drop and Ehlers-Danlos syndrome. Work on gait, balance, joint control and the strength to keep moving safely day to day.</p>
      </article>
    </div>
    <p class="cond__note">Do not see yours here? <a href="/#conditions">The full list is on the home page</a>, or just describe it when you call.</p>
  </div>
</section>

<section class="sec sec--ink" aria-labelledby="pt-s">
  <div class="sec__grain" aria-hidden="true"></div>
  <div class="wrap">
    <p class="kicker kicker--on-ink">02 <i>/</i> What a visit looks like</p>
    <div class="cond__top">
      <h2 class="h2" id="pt-s">A visit that is actually yours</h2>
      <p class="lead">No waiting on a table. No being handed to an assistant while your clinician runs three other people. The same person, start to finish.</p>
    </div>
    <div class="split">
      <ol class="incl incl--ink">
        <li><h3>We measure before we guess</h3><p>How far the joint moves, how strong it is, how much load it can take, and how the areas above and below it are coping. The sore spot is often not the cause.</p></li>
        <li><h3>Hands-on treatment</h3><p>Massage, joint mobilisation, manipulation and soft-tissue release, used to get the movement back before we ask you to hold it.</p></li>
        <li><h3>Exercises on day one</h3><p>You leave the first visit knowing what to do at home and why it helps. Not a photocopied handout.</p></li>
        <li><h3>Machines where they earn it</h3><p>Electrical stimulation, TENS, hot and cold. Useful alongside treatment, never instead of it.</p></li>
        <li><h3>Progress written down</h3><p>Goals are specific and measurable. Progress is tracked and logged every session, so you are not relying on memory or optimism.</p></li>
      </ol>
      <figure class="split__fig">
        <picture><source type="image/webp" srcset="/assets/media/handson-wide-760.webp 760w, /assets/media/handson-wide-1200.webp 1200w, /assets/media/handson-wide-1600.webp 1600w" sizes="(max-width: 900px) 100vw, 44vw"><img src="/assets/media/handson-wide-1600.jpg" width="1600" height="1067" loading="lazy" decoding="async" alt="A hand placed on the shoulder blade to guide a patient through a banded exercise."></picture>
      </figure>
    </div>
  </div>
</section>

""",
},
{
 "slug": "strength-and-conditioning", "key": "strength", "nav": "Strength &amp; conditioning",
 "cta": "strength &amp; conditioning", "cta_h": "Let's get you stronger",
 "rel_blurb": "Training with someone who knows what your joints can take",
 "title": "Strength &amp; Conditioning in Miami | BodyForge Physical Therapy",
 "desc": "Strength and conditioning in Miami with a doctor of physical therapy. One-on-one training, a plan for your own gym, or a prehab screening to stop injuries before they start.",
 "schema_name": "Strength and Conditioning", "schema_type": "Strength and conditioning training",
 "eyebrow": "Service 02",
 "h1": "Getting stronger,<br>without getting hurt",
 "lead": "Most trainers can make you tired. Fewer can tell you what your knee will tolerate next week. This is strength work run by someone who spends the rest of his day rebuilding the joints that got it wrong.",
 "hero_img": img("load", [640, 1000, 1500], 1500, 1000, "A patient hinging under a kettlebell in the BodyForge training room."),
 "body": """
<section class="sec sec--bone" aria-labelledby="sc-w">
  <div class="wrap">
    <p class="kicker">01 <i>/</i> Three ways to do it</p>
    <h2 class="h2 svc__h" id="sc-w">Pick the one that fits your life</h2>
    <div class="fourway fourway--3">
      <article>
        <h3>Training in the clinic</h3>
        <p>In the clinic, with a plan written for you and access to the recovery equipment here. Best if you want eyes on your technique, or you are coming straight out of rehab and would rather not guess.</p>
      </article>
      <article>
        <h3>Train on your own schedule</h3>
        <p>A plan written for you that you follow at your own gym, in your own time, with text access to ask questions as they come up. Pay as you go. No subscription, no lock-in.</p>
      </article>
      <article>
        <h3>Prehab: staying out of trouble</h3>
        <p>A screening by a doctor of physical therapy to spot what is most likely to injure you, and the work to shore it up before it does. Cheaper than the rehab that follows the injury.</p>
      </article>
    </div>
  </div>
</section>

<section class="sec sec--ink" aria-labelledby="sc-y">
  <div class="sec__grain" aria-hidden="true"></div>
  <div class="wrap">
    <p class="kicker kicker--on-ink">02 <i>/</i> Why here</p>
    <div class="split">
      <div>
        <h2 class="h2" id="sc-y">A trainer who reads your imaging</h2>
        <p class="lead">The programme is built around your goals, and built to become a habit rather than a six-week burst you abandon in March.</p>
        <ul class="doc__facts" style="margin-top:1.6rem">
          <li><span class="mono">01</span> Goals you actually named, not a template block</li>
          <li><span class="mono">02</span> Loads that respect what the joint has been through</li>
          <li><span class="mono">03</span> Progress tracked and logged, session by session</li>
          <li><span class="mono">04</span> Habits that outlast the programme</li>
        </ul>
      </div>
      <figure class="split__fig">
        <picture><source type="image/webp" srcset="/assets/media/kettlebells-640.webp 640w, /assets/media/kettlebells-1000.webp 1000w, /assets/media/kettlebells-1500.webp 1500w" sizes="(max-width: 900px) 100vw, 44vw"><img src="/assets/media/kettlebells-1500.jpg" width="1500" height="1000" loading="lazy" decoding="async" alt="Kettlebells racked along the wall of the BodyForge training floor."></picture>
      </figure>
    </div>
  </div>
</section>
""",
},
{
 "slug": "sport-specific-rehabilitation", "key": "sport", "nav": "Sports injury rehab",
 "cta": "sports rehabilitation", "cta_h": "Get back to your sport",
 "rel_blurb": "Getting back to competing, on test results rather than the calendar",
 "title": "Sports Injury Rehab in Miami | BodyForge Physical Therapy",
 "desc": "Sports injury rehabilitation in Miami. Return-to-sport testing for field, court, water and combat athletes, so you go back when you are ready rather than when the pain stops.",
 "schema_name": "Sport-Specific Rehabilitation", "schema_type": "Sports injury rehabilitation",
 "eyebrow": "Service 03",
 "h1": "Back to competing,<br>with something to show for it",
 "lead": "Ordinary rehab stops when the pain stops. That is the point at which most people get hurt again. Here it carries on until you can prove the body part handles what your sport is about to ask of it.",
 "hero_img": img("assess", [640, 1000, 1500], 1500, 1000, "An athlete drawing a cable across the body while a clinician steadies the shoulder blade."),
 "body": """
<section class="sec sec--bone" aria-labelledby="sp-t">
  <div class="wrap">
    <p class="kicker">01 <i>/</i> The testing</p>
    <div class="cond__top">
      <h2 class="h2" id="sp-t">"It feels fine" is not a test result</h2>
      <p class="lead">You go through rigorous, evidence-based testing that measures what your body and your head can actually handle, so you can be confident you are ready when you get there.</p>
    </div>
    <div class="fourway fourway--3">
      <article><h3>Strength, side to side</h3><p>The injured side gets compared with the healthy one. Numbers, not impressions. A leg that is 20% weaker will find out on the pitch if it does not find out here.</p></article>
      <article><h3>Power and landing</h3><p>Hopping, cutting, decelerating. Most non-contact injuries happen while slowing down or changing direction, so that is what gets tested.</p></article>
      <article><h3>Confidence in the movement</h3><p>Plenty of athletes are physically ready and still guarding. That shows up in testing too, and it is worth knowing before a match rather than during one.</p></article>
    </div>
  </div>
</section>

<section class="sec sec--ink" aria-labelledby="sp-s">
  <div class="sec__grain" aria-hidden="true"></div>
  <div class="wrap">
    <p class="kicker kicker--on-ink">02 <i>/</i> Who this is for</p>
    <div class="split">
      <div>
        <h2 class="h2" id="sp-s">Four kinds of sport, one method</h2>
        <p class="lead">Rehab carries on until you can handle what your sport actually asks of you, and we train the rest of you while the injured part catches up, so you do not lose the fitness you worked for.</p>
        <ul class="chips chips--ink" style="margin-top:1.6rem">
          <li>Field sports</li><li>Court sports</li><li>Water sports</li><li>Combat sports</li>
        </ul>
      </div>
      <figure class="split__fig">
        <picture><source type="image/webp" srcset="/assets/media/load-640.webp 640w, /assets/media/load-1000.webp 1000w" sizes="(max-width: 900px) 100vw, 44vw"><img src="/assets/media/load-1500.jpg" width="1500" height="1000" loading="lazy" decoding="async" alt="A patient hinging under a kettlebell during loaded rehabilitation."></picture>
      </figure>
    </div>
  </div>
</section>

<section class="sec sec--bone" aria-labelledby="sp-q">
  <div class="wrap">
    <p class="kicker">03 <i>/</i> A patient</p>
    <article class="tst tst--solo">
      <div class="tst__stars" role="img" aria-label="5 out of 5 stars"><span></span><span></span><span></span><span></span><span></span></div>
      <blockquote>
        <p class="tst__pull" id="sp-q">"He played a crucial role in getting me back to running."</p>
        <p>David is truly exceptional! I was recovering from a knee injury, and he played a crucial role in getting me back to running. He went above and beyond in every session, from the first meeting to the end of treatment. He set me up with the tools and knowledge to continue improving my physical form and avoid injuries. He was always responsive to my questions and feedback. His knowledge, experience, and great attitude set him apart.</p>
      </blockquote>
      <footer class="tst__by">
        <img src="/assets/media/p-maria-160.webp" srcset="/assets/media/p-maria-160.webp 160w, /assets/media/p-maria-320.webp 320w" sizes="56px" width="160" height="160" loading="lazy" decoding="async" alt="">
        <div><p class="tst__name">Maria Rossi</p><p class="tst__ctx">Knee injury, returned to running</p></div>
      </footer>
    </article>
  </div>
</section>
""",
},
{
 "slug": "pilates", "key": "pilates", "nav": "Pilates",
 "cta": "a Pilates session", "cta_h": "Come and try a session",
 "rel_blurb": "Private Pilates taught by a Polestar-educated instructor",
 "title": "One-on-One Pilates in Miami | BodyForge Physical Therapy",
 "desc": "Private one-on-one Pilates in Miami on mat, reformer, trapeze and spine corrector, taught by a Polestar-trained instructor who is also a doctor of physical therapy. All levels.",
 "schema_name": "One-on-One Pilates", "schema_type": "Pilates instruction",
 "eyebrow": "Service 04",
 "h1": "Pilates, taught<br>by a physical therapist",
 "lead": "Not a room of twenty people following along at the front. One-to-one, with someone who knows the difference between a movement that looks right and a movement that is doing you good.",
 "hero_img": img("cue", [640, 895], 895, 597, "A hand placed flat on the back to cue breath and alignment during a controlled movement.", fallback="cue-895.jpg"),
 "body": """
<section class="sec sec--bone" aria-labelledby="pl-w">
  <div class="wrap">
    <p class="kicker">01 <i>/</i> What it is here</p>
    <div class="cond__top">
      <h2 class="h2" id="pl-w">Move well, not just prettily</h2>
      <p class="lead">Pilates is not just the routine. It is learning to move efficiently and with purpose, which is why it works so well for people whose backs have been complaining for years.</p>
    </div>
    <div class="fourway fourway--3">
      <article><h3>Built for posture and control</h3><p>Strength through the middle, better flexibility, and joints that stack up the way they are supposed to. It shows up in how you stand long before it shows up in a mirror.</p></article>
      <article><h3>Adapted, not watered down</h3><p>Sessions are adapted for long-standing low back pain and for thinning bones, which rules some movements out and makes others considerably more valuable.</p></article>
      <article><h3>Any level, including none</h3><p>All skill levels, including people who have never seen a reformer and are slightly suspicious of it. Nobody is behind here, because there is nobody to be behind.</p></article>
    </div>
  </div>
</section>

<section class="sec sec--ink" aria-labelledby="pl-e">
  <div class="sec__grain" aria-hidden="true"></div>
  <div class="wrap">
    <p class="kicker kicker--on-ink">02 <i>/</i> The studio</p>
    <div class="split">
      <div>
        <h2 class="h2" id="pl-e">What is in the room</h2>
        <p class="lead">Taught by a Polestar-trained instructor who is also a doctor of physical therapy, which is a rarer combination than it sounds.</p>
        <ul class="chips chips--ink" style="margin-top:1.6rem">
          <li>Mat</li><li>Reformer</li><li>Trapeze</li><li>Spine corrector</li>
          <li class="is-soon">Chair <i>soon</i></li><li class="is-soon">Ladder barrel <i>soon</i></li>
        </ul>
      </div>
      <figure class="split__fig">
        <picture><source type="image/webp" srcset="/assets/media/mat-640.webp 640w, /assets/media/mat-1000.webp 1000w" sizes="(max-width: 900px) 100vw, 44vw"><img src="/assets/media/mat-1000.jpg" width="1000" height="667" loading="lazy" decoding="async" alt="Controlled mat work guided by hand at BodyForge."></picture>
      </figure>
    </div>
  </div>
</section>
""",
},
]

for p in PAGES:
    out = SITE / p["slug"] / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(shell(p))
    print(f"  /{p['slug']}/  {out.stat().st_size // 1024} KB")

# ── sitemap ────────────────────────────────────────────────────────────────
urls = ["", *[p["slug"] + "/" for p in PAGES]]
(SITE / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join(
        f"  <url>\n    <loc>https://bodyforgept.com/{u}</loc>\n"
        f"    <changefreq>monthly</changefreq>\n"
        f"    <priority>{'1.0' if u == '' else '0.8'}</priority>\n  </url>\n"
        for u in urls)
    + "</urlset>\n")
print(f"  sitemap.xml  {len(urls)} urls")
