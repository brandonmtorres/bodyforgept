#!/usr/bin/env python3
"""Drive the real interactive paths: call paths, tabs, disclosures, menu, keyboard."""
import os, asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parent.parent / ".shots"
OUT.mkdir(parents=True, exist_ok=True)
# BF_BASE / BF_SITE let this run against either build: the static site in
# site/ (the default) or the Next export in web/out/.
BASE = os.environ.get("BF_BASE", "http://127.0.0.1:4173").rstrip("/")
URL = BASE + "/"


async def arrive(pg, path, anchor=".hdr__call"):
    """Wait for a navigation to actually land.

    The static build navigates by document load; the Next build may do it as a client
    transition, where wait_for_load_state("networkidle") returns before React has
    swapped the page in. Waiting on the URL and a real element covers both.
    """
    want = "/" + path.strip("/")
    try:
        await pg.wait_for_function(
            "want => (new URL(location.href).pathname.replace(/\\/+$/, '') || '/') === want",
            arg=want,
            timeout=10000)
        await pg.wait_for_selector(anchor, state="attached", timeout=10000)
    except Exception:
        state = await pg.evaluate(
            "() => ({url: location.href, h1: (document.querySelector('h1')||{}).textContent,"
            " ids: [...document.querySelectorAll('section[id]')].map(s => s.id)})")
        raise AssertionError(
            f"never arrived at {want} with {anchor}: {state}") from None
    await pg.wait_for_load_state("networkidle")


async def settle(pg, tries=40):
    """Wait for smooth scrolling to actually stop. Fixed timeouts race it."""
    last = None
    for _ in range(tries):
        y = await pg.evaluate("Math.round(scrollY)")
        if y == last:
            return y
        last = y
        await pg.wait_for_timeout(100)
    return last


async def main():
    log, errs = [], []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1440, "height": 950}, device_scale_factor=2)
        pg.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
        pg.on("console", lambda m: errs.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)
        await pg.goto(URL, wait_until="networkidle")
        await pg.wait_for_timeout(800)

        # ── conversion paths. The booking form was removed at the clinic's
        # request: every primary action is now the phone number, so the test is
        # that every one of them is a real tel: link and nothing dangles.
        tels = await pg.eval_on_selector_all(
            'a[href^="tel:"]', "els => els.map(e => e.getAttribute('href'))")
        log.append(f"tel: links on the page: {len(tels)}, all to one number = {len(set(tels)) == 1} ({set(tels)})")

        mails = await pg.eval_on_selector_all(
            'a[href^="mailto:"]', "els => els.map(e => e.getAttribute('href').split('?')[0])")
        log.append(f"mailto links: {sorted(set(mails))}")

        hdr_cta = await pg.eval_on_selector(".hdr__call", "e => e.getAttribute('href')")
        log.append(f"header primary action: {hdr_cta}")

        # the announcement banner is the entry point to the new service page
        ann = await pg.eval_on_selector(".ann__in", "e => e.getAttribute('href')")
        log.append(f"announcement banner routes to: {ann}")
        await pg.click(".ann__in")
        await arrive(pg, "/weekend-recovery", "#rates")
        log.append(f"banner navigates: {pg.url.replace(BASE, '')}")

        # every figure on the recovery page comes from the clinic's own promo sheets
        figs = await pg.eval_on_selector_all(
            ".rate__n, .rate s", "els => els.map(e => e.textContent.trim())")
        log.append(f"recovery page figures ({len(figs)}): {figs}")
        anchors = await pg.eval_on_selector_all(
            "#rates, #first-responders", "els => els.map(e => e.id)")
        log.append(f"deep-link anchors present: {anchors}")
        gone = await pg.eval_on_selector_all("#partners, [data-road]", "els => els.length")
        log.append(f"gym partner section removed: {not gone}")
        await pg.go_back()
        await arrive(pg, "/", ".call__n")

        # the call card is the panel now; the number must be one tap
        num = await pg.eval_on_selector(".call__n", "e => e.getAttribute('href')")
        box = await pg.eval_on_selector(".call__n", "e => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }")
        log.append(f"call card: {num} at {box[0]}x{box[1]}px")
        log.append(f"call card states current hours: {(await pg.inner_text('#call-now')).strip()!r}")

        # /#book still resolves: the service pages and the old site both link to it
        await pg.goto(URL + "#book", wait_until="networkidle")
        await settle(pg)
        landed = await pg.evaluate(
            '() => Math.abs(document.querySelector("#book").getBoundingClientRect().top) < 200')
        log.append(f"legacy /#book anchor still lands on the contact section: {landed}")
        await pg.screenshot(path=OUT / "flow-contact.png", clip={"x": 700, "y": 60, "width": 720, "height": 700})

        # ── condition tabs, including keyboard
        await pg.click('a[href="#conditions"] >> nth=0')
        await pg.wait_for_timeout(700)
        await pg.click("#t-neuro")
        await pg.wait_for_timeout(400)
        log.append(f"neurological tab -> panel {await pg.is_visible('#p-neuro')}, knee hidden {not await pg.is_visible('#p-knee')}")
        neuro = await pg.eval_on_selector_all("#p-neuro .clist span", "els => els.map(e => e.textContent.trim())")
        log.append(f"neurological scope: {neuro}")
        await pg.focus("#t-neuro")
        await pg.keyboard.press("ArrowRight")
        await pg.wait_for_timeout(300)
        log.append(f"arrow-right wraps to first tab: {await pg.eval_on_selector(':focus', 'e => e.id')}")
        await pg.screenshot(path=OUT / "flow-tabs.png")

        # ── services dropdown: the only nav route to the service pages
        await pg.click("#svcbtn")
        await pg.wait_for_timeout(350)
        opened = await pg.is_visible("#svcmenu")
        items = await pg.eval_on_selector_all("#svcmenu a[href^='/']", "els => els.map(e => e.getAttribute('href'))")
        log.append(f"services dropdown opens: {opened}, routes: {items}")
        await pg.keyboard.press("Escape")
        await pg.wait_for_timeout(250)
        log.append(f"escape closes dropdown: {not await pg.is_visible('#svcmenu')}")
        await pg.click("#svcbtn")
        await pg.wait_for_timeout(300)
        await pg.click('#svcmenu a[href="/pilates/"]')
        await arrive(pg, "/pilates", ".phero__h")
        log.append(f"dropdown navigates: {pg.url.replace(BASE, '')}")
        await pg.go_back()
        await arrive(pg, "/", "#services")

        # ── disclosure
        await pg.evaluate("document.querySelector('#services').scrollIntoView()")
        await pg.wait_for_timeout(700)
        await pg.click("#svc-sc .disc__btn")
        await pg.wait_for_timeout(600)
        h = await pg.eval_on_selector("#d2", "e => e.getBoundingClientRect().height")
        log.append(f"disclosure opens: height {round(h)}px, aria-expanded {await pg.get_attribute('#svc-sc .disc__btn', 'aria-expanded')}")

        # ── focus ring visibility on the primary CTA
        await pg.keyboard.press("Tab")
        ring = await pg.evaluate("() => { const e = document.activeElement; const s = getComputedStyle(e); return s.outlineStyle + ' ' + s.outlineWidth; }")
        log.append(f"focus ring on tab target: {ring}")
        await pg.close()

        # ── mobile menu
        pg = await b.new_page(viewport={"width": 390, "height": 844})
        await pg.goto(URL, wait_until="networkidle")
        await pg.click("#burger")
        await pg.wait_for_timeout(400)
        log.append(f"mobile menu opens: {await pg.is_visible('#mobnav')}, body locked = {await pg.eval_on_selector('body', 'e => e.style.overflow')}")
        await pg.screenshot(path=OUT / "flow-mobnav.png")
        await pg.keyboard.press("Escape")
        await pg.wait_for_timeout(400)
        log.append(f"escape closes: {not await pg.is_visible('#mobnav')}")

        # dock appears past the hero
        await pg.evaluate("document.querySelector('#services').scrollIntoView()")
        await settle(pg)
        await pg.wait_for_timeout(300)
        log.append(f"mobile dock up over services: {await pg.eval_on_selector('#dock', 'e => e.classList.contains(\"is-up\")')}")
        await pg.evaluate("document.querySelector('#book').scrollIntoView()")
        await settle(pg)
        await pg.wait_for_timeout(300)
        log.append(f"mobile dock hides over booking: {not await pg.eval_on_selector('#dock', 'e => e.classList.contains(\"is-up\")')}")
        await pg.close()
        await b.close()

    print("\n".join(f"  {l}" for l in log))
    print("\nERRORS:", "\n".join(dict.fromkeys(errs)) or "none")


asyncio.run(main())
