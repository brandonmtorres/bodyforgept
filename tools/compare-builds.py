#!/usr/bin/env python3
"""Visual parity between the two builds, page by page and viewport by viewport.

    cd site && python3 -m http.server 4172 &
    cd web/out && python3 -m http.server 4173 &
    python3 tools/compare-builds.py

Reports differing pixels per page. Page dimensions matching everywhere is the strong
signal; the residual is antialiasing on glyph edges.

Three things this controls for, each of which produced large false differences while
it was uncontrolled:

  * lazy images, flipped to eager symmetrically, so neither capture wins a loading
    race the other loses;
  * Chromium's 16384px full-page screenshot limit — the home page is 17728px tall at
    390px wide, and everything past the limit came back blank, so captures are taken
    as viewport-sized frames rather than one tall image;
  * scroll-behavior: smooth, which made scrollTo animate, so frames were captured
    mid-flight at different offsets in the two builds.

Subpixel text antialiasing is disabled. It differs between two documents with provably
identical geometry and is invisible at normal viewing.
"""
import asyncio
import io
import os
import numpy as np
from PIL import Image
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(os.environ.get("BF_SHOTS", "/tmp/bf-parity"))
OUT.mkdir(exist_ok=True)
OLD = os.environ.get("BF_OLD", "http://127.0.0.1:4172").rstrip("/")
NEW = os.environ.get("BF_NEW", "http://127.0.0.1:4173").rstrip("/")
PAGES = ["/", "/physical-therapy/", "/strength-and-conditioning/",
         "/sport-specific-rehabilitation/", "/pilates/", "/weekend-recovery/"]
VIEWPORTS = [("mobile", 390, 844), ("tablet", 834, 1112), ("desktop", 1440, 900), ("wide", 1920, 1080)]
THRESH = 12

EAGER = "() => [...document.querySelectorAll('img')].forEach(i => i.loading = 'eager')"
SETTLE = """() => {
  document.querySelectorAll('.rv').forEach(e => e.classList.add('is-in'));
  document.querySelectorAll('[data-road]').forEach(e => e.classList.add('is-in'));
  // the stylesheet sets scroll-behavior: smooth, so scrollTo animates; frames were
  // being captured mid-flight at different offsets in the two builds
  const s = document.createElement('style');
  s.textContent = 'html{scroll-behavior:auto!important}'
    + '*,*::before,*::after{transition:none!important;animation:none!important}';
  document.head.appendChild(s);
}"""
DONE = "() => [...document.querySelectorAll('img')].every(i => i.complete && i.naturalWidth > 0)"


async def capture(browser, base, path, w, h):
    pg = await browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
    await pg.goto(base + path, wait_until="networkidle")
    await pg.evaluate("document.fonts.ready")
    await pg.evaluate(EAGER)
    await pg.evaluate(SETTLE)
    for _ in range(60):
        if await pg.evaluate(DONE):
            break
        await pg.wait_for_timeout(200)
    await pg.wait_for_timeout(600)
    height = await pg.evaluate("document.documentElement.scrollHeight")
    width = await pg.evaluate("document.documentElement.scrollWidth")
    # viewport-sized frames, scrolled into place: always inside Chromium's limits, and
    # both builds are driven through exactly the same scroll positions
    chunks = []
    for y in range(0, max(height - h, 0) + h, h):
        y = min(y, max(height - h, 0))
        await pg.evaluate(f"window.scrollTo(0, {y})")
        await pg.wait_for_function("y => Math.abs(window.scrollY - y) < 2", arg=y, timeout=5000)
        await pg.wait_for_timeout(220)
        chunks.append(await pg.screenshot())
        if y >= height - h:
            break
    await pg.close()
    return (width, height), chunks


def compare(a_chunks, b_chunks, tag):
    diff = total = 0
    worst = 0
    for i, (pa, pb) in enumerate(zip(a_chunks, b_chunks)):
        a = np.asarray(Image.open(io.BytesIO(pa)).convert("RGB")).astype(np.int16)
        b = np.asarray(Image.open(io.BytesIO(pb)).convert("RGB")).astype(np.int16)
        if a.shape != b.shape:
            return None, f"chunk {i} shape {a.shape} vs {b.shape}"
        d = np.abs(a - b).max(axis=2)
        n = int((d > THRESH).sum())
        diff += n
        total += d.size
        worst = max(worst, int(d.max()))
        if n:
            Image.fromarray(((d > THRESH) * 255).astype(np.uint8)).save(OUT / f"diff-{tag}-{i}.png")
    return (diff, total, worst), None


async def main():
    rows = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=[
            "--force-color-profile=srgb", "--font-render-hinting=none", "--disable-lcd-text"])
        for path in PAGES:
            for name, w, h in VIEWPORTS:
                tag = f"{path.strip('/').replace('/', '-') or 'home'}-{name}"
                (ow, oh), old = await capture(browser, OLD, path, w, h)
                (nw, nh), new = await capture(browser, NEW, path, w, h)
                if (ow, oh) != (nw, nh):
                    rows.append((tag, None, f"page size {ow}x{oh} vs {nw}x{nh}"))
                    continue
                res, err = compare(old, new, tag)
                rows.append((tag, res, err))
        await browser.close()

    print(f"{'page':38} {'differing':>10} {'of':>12} {'pct':>9} {'max':>5}")
    tot = totpx = 0
    clean = True
    for tag, res, err in rows:
        if err or res is None:
            print(f"{tag:38} MISMATCH: {err}")
            clean = False
            continue
        n, size, mx = res
        tot += n
        totpx += size
        print(f"{tag:38} {n:>10,} {size:>12,} {100*n/size:>8.4f}% {mx:>5}")
    print(f"\nTOTAL {tot:,} / {totpx:,} = {100*tot/totpx:.4f}% differing")
    print("page dimensions identical on every page and viewport" if clean else "SIZE MISMATCHES ABOVE")


asyncio.run(main())
