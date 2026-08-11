#!/usr/bin/env python3
"""Whole-site check: every page's links, assets, schema, headings and contrast."""
import asyncio, json, os, re, sys
from pathlib import Path
from playwright.async_api import async_playwright

# BF_BASE / BF_SITE let this run against either build: the static site in
# site/ (the default) or the Next export in web/out/.
SITE = Path(os.environ.get("BF_SITE",
                           Path(__file__).resolve().parent.parent / "site")).resolve()
BASE = os.environ.get("BF_BASE", "http://127.0.0.1:4173").rstrip("/")
PAGES = ["/", "/physical-therapy/", "/strength-and-conditioning/",
         "/sport-specific-rehabilitation/", "/pilates/", "/weekend-recovery/"]

AUDIT_JS = Path(__file__).resolve().parent / "audit.py"
# reuse the contrast/target probe from audit.py so there is one implementation
JS = re.search(r'JS = r"""(.*?)"""', AUDIT_JS.read_text(), re.S).group(1)


def static_checks():
    problems = []
    for page in PAGES:
        f = SITE / (page.strip("/") or ".") / "index.html"
        h = f.read_text()
        label = page

        for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
            try:
                json.loads(m.group(1))
            except json.JSONDecodeError as e:
                problems.append(f"{label} invalid JSON-LD: {e}")

        heads = re.findall(r"<(h[1-6])[^>]*>", h)
        if heads.count("h1") != 1:
            problems.append(f"{label} has {heads.count('h1')} h1 elements")

        ids = re.findall(r'\sid="([^"]+)"', h)
        dup = {i for i in ids if ids.count(i) > 1}
        if dup:
            problems.append(f"{label} duplicate ids: {dup}")

        for a in re.findall(r'href="#([^"]+)"', h):
            if a not in ids:
                problems.append(f"{label} broken same-page anchor #{a}")

        # every local asset and page link resolves on disk
        for ref in set(re.findall(r'(?:src|href)="(/[^"#?]+)"', h)):
            target = SITE / ref.lstrip("/")
            if target.is_dir():
                target = target / "index.html"
            if not target.exists():
                problems.append(f"{label} dead link/asset: {ref}")
        for m in re.finditer(r'(?:srcset|imagesrcset)="([^"]+)"', h):
            for part in m.group(1).split(","):
                u = part.strip().split(" ")[0]
                if u.startswith("/") and not (SITE / u.lstrip("/")).exists():
                    problems.append(f"{label} dead srcset entry: {u}")

        for img in re.findall(r"<img [^>]*>", h):
            if "alt=" not in img:
                problems.append(f"{label} img without alt: {img[:60]}")

        canon = re.search(r'rel="canonical" href="([^"]+)"', h)
        want = f"https://bodyforgept.com{page}"
        if not canon or canon.group(1) != want:
            problems.append(f"{label} canonical is {canon and canon.group(1)}, expected {want}")
    return problems


async def runtime_checks():
    problems = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for page in PAGES:
            for name, w, h in [("mobile", 390, 844), ("desktop", 1440, 900)]:
                pg = await b.new_page(viewport={"width": w, "height": h})
                errs = []
                pg.on("pageerror", lambda e: errs.append(str(e)))
                pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
                await pg.goto(BASE + page, wait_until="networkidle")
                await pg.wait_for_timeout(1000)
                r = await pg.evaluate(JS)
                tag = f"{page} @{name}"
                if r["docW"] > r["winW"] + 1:
                    problems.append(f"{tag} horizontal overflow {r['docW']}>{r['winW']}")
                for c in r["contrast"]:
                    problems.append(f"{tag} contrast {c['r']}<{c['need']} — {c['t']!r}")
                for s in r["smallTargets"]:
                    problems.append(f"{tag} target {s['w']}x{s['h']} — {s['t']!r}")
                for e in dict.fromkeys(errs):
                    problems.append(f"{tag} console: {e}")
                await pg.close()
        await b.close()
    return problems


issues = static_checks() + asyncio.run(runtime_checks())
if issues:
    print(f"{len(issues)} issue(s):")
    for i in issues:
        print("  !", i)
    sys.exit(1)
print(f"all clean across {len(PAGES)} pages "
      "(schema, headings, anchors, assets, alt text, canonicals, contrast, targets, overflow, console)")
