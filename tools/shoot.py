#!/usr/bin/env python3
"""Screenshot the page at review viewports. Usage: shoot.py <tag> [--full]"""
import os, sys, asyncio
from pathlib import Path
from playwright.async_api import async_playwright

TAG = sys.argv[1] if len(sys.argv) > 1 else "pass"
FULL = "--full" in sys.argv
OUT = Path("/tmp/claude-0/-root-bodyforgept/e374128a-cce7-4f71-94f3-4e8a8c390cb9/scratchpad/shots")
OUT.mkdir(parents=True, exist_ok=True)
# BF_BASE / BF_SITE let this run against either build: the static site in
# site/ (the default) or the Next export in web/out/.
URL = os.environ.get("BF_BASE", "http://127.0.0.1:4173").rstrip("/") + "/"

VIEWPORTS = [("mobile", 390, 844, 3), ("tablet", 834, 1112, 2), ("desktop", 1440, 900, 2), ("wide", 1920, 1080, 1)]
# section anchors captured at desktop so each fold can be judged on its own
SECTIONS = ["approach", "conditions", "protocol", "services", "doctor", "results", "book", "visit"]


async def main():
    errors = []
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--force-color-profile=srgb", "--font-render-hinting=none"])
        for name, w, h, dpr in VIEWPORTS:
            pg = await b.new_page(viewport={"width": w, "height": h}, device_scale_factor=dpr)
            pg.on("console", lambda m: errors.append(f"[{name}] console.{m.type}: {m.text}") if m.type in ("error", "warning") else None)
            pg.on("pageerror", lambda e: errors.append(f"[{name}] pageerror: {e}"))
            await pg.goto(URL, wait_until="networkidle")
            await pg.wait_for_timeout(1400)
            await pg.screenshot(path=OUT / f"{TAG}-{name}-hero.png")
            if FULL:
                # settle every reveal before the full-page grab
                await pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await pg.wait_for_timeout(1600)
                await pg.evaluate("window.scrollTo(0, 0)")
                await pg.wait_for_timeout(700)
                await pg.screenshot(path=OUT / f"{TAG}-{name}-full.png", full_page=True)
            await pg.close()

        # per-section desktop frames
        pg = await b.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
        await pg.goto(URL, wait_until="networkidle")
        await pg.wait_for_timeout(900)
        for s in SECTIONS:
            await pg.evaluate(f"document.querySelector('#{s}').scrollIntoView()")
            await pg.wait_for_timeout(1800)
            await pg.screenshot(path=OUT / f"{TAG}-sec-{s}.png")
        await pg.close()
        await b.close()

    print("\n".join(dict.fromkeys(errors)) or "no console errors")
    print(f"shots -> {OUT}")


asyncio.run(main())
