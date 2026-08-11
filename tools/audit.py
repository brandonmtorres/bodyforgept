#!/usr/bin/env python3
"""Runtime audit: font axes, contrast, tap targets, overflow, form flow."""
import os, asyncio, json
from playwright.async_api import async_playwright

# BF_BASE / BF_SITE let this run against either build: the static site in
# site/ (the default) or the Next export in web/out/.
URL = os.environ.get("BF_BASE", "http://127.0.0.1:4173").rstrip("/") + "/"

JS = r"""
() => {
  const out = {};

  // ── fonts actually resolved, and whether the wdth axis is real
  const probe = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { font: cs.fontFamily.split(",")[0], vs: cs.fontVariationSettings, size: cs.fontSize, w: el.getBoundingClientRect().width };
  };
  out.type = { h1: probe(".hero__h span"), h2: probe(".h2"), mono: probe(".kicker") };
  out.fontsLoaded = Array.from(document.fonts).map(f => `${f.family} ${f.weight} ${f.stretch||""} ${f.status}`);

  // measure the wdth axis by rendering the same string at 62 vs 125
  const t = document.createElement("span");
  t.textContent = "Measured";
  t.style.cssText = "position:absolute;visibility:hidden;font-family:Archivo;font-size:100px;white-space:nowrap";
  document.body.appendChild(t);
  t.style.fontVariationSettings = '"wdth" 62';
  const narrow = t.getBoundingClientRect().width;
  t.style.fontVariationSettings = '"wdth" 125';
  const wide = t.getBoundingClientRect().width;
  t.remove();
  out.wdthAxisWorks = { narrow: Math.round(narrow), wide: Math.round(wide), delta: Math.round(wide - narrow) };

  // ── contrast
  // computed colours come back as oklch()/color-mix(), so resolve them through
  // a canvas rather than regexing numbers out of the string.
  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const memo = new Map();
  const rgba = (s) => {
    if (memo.has(s)) return memo.get(s);
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = s;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    const v = [d[0], d[1], d[2], d[3] / 255];
    memo.set(s, v);
    return v;
  };
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const over = (fg, bg) => fg.slice(0, 3).map((c, i) => c * fg[3] + bg[i] * (1 - fg[3]));
  // collect every painted layer up to the first opaque one, then composite from
  // the bottom up. compositing top-down over white inverts translucent tints.
  const bgOf = (el) => {
    const stack = [];
    let n = el;
    while (n && n !== document.documentElement) {
      const c = rgba(getComputedStyle(n).backgroundColor);
      if (c[3] > 0.004) { stack.push(c); if (c[3] > 0.996) break; }
      n = n.parentElement;
    }
    let base = [255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return base;
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

  out.contrast = [];
  document.querySelectorAll("p,a,span,li,h1,h2,h3,dd,dt,label,button,td,th,em,b,i,legend,figcaption").forEach((el) => {
    if (!el.offsetParent && el.tagName !== "BODY") return;
    const txt = el.textContent.trim();
    // only skip when a child carries its own TEXT; an inline <svg> icon must not
    // exempt a button from the contrast check
    if (!txt) return;
    if ([...el.children].some((c) => c.tagName !== 'svg' && c.textContent.trim())) return;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    const wt = parseInt(cs.fontWeight) || 400;
    const large = fs >= 24 || (fs >= 18.66 && wt >= 700);
    const fg = rgba(cs.color);
    const bg = bgOf(el);
    const r = ratio(over(fg, bg), bg);
    const need = large ? 3 : 4.5;
    if (r < need) out.contrast.push({ t: txt.slice(0, 44), r: +r.toFixed(2), need, fs: Math.round(fs), cls: el.className.toString().slice(0, 40) });
  });

  // ── tap targets under 44px
  out.smallTargets = [];
  document.querySelectorAll("a,button,input,label.opt,label.day,label.slot").forEach((el) => {
    if (!el.offsetParent) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    if (r.height < 40 || r.width < 26) {
      out.smallTargets.push({ t: (el.textContent || el.name || "").trim().slice(0, 34), w: Math.round(r.width), h: Math.round(r.height), cls: el.className.toString().slice(0, 34) });
    }
  });

  // ── horizontal overflow
  out.docW = document.documentElement.scrollWidth;
  out.winW = window.innerWidth;
  out.overflowing = [];
  document.querySelectorAll("*").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > window.innerWidth + 1.5 || r.left < -1.5)) {
      const p = el.parentElement;
      if (p && p.getBoundingClientRect().right > window.innerWidth + 1.5) return; // report outermost only
      out.overflowing.push({ tag: el.tagName, cls: el.className.toString().slice(0, 40), right: Math.round(r.right), left: Math.round(r.left) });
    }
  });
  out.overflowing = out.overflowing.slice(0, 12);

  return out;
}
"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, w, h in [("mobile", 390, 844), ("desktop", 1440, 900)]:
            pg = await b.new_page(viewport={"width": w, "height": h})
            await pg.goto(URL, wait_until="networkidle")
            await pg.wait_for_timeout(1200)
            r = await pg.evaluate(JS)
            print(f"\n{'='*66}\n{name.upper()}  ({w}x{h})\n{'='*66}")
            print("type      :", json.dumps(r["type"], indent=None))
            print("wdth axis :", r["wdthAxisWorks"], "→", "WORKS" if r["wdthAxisWorks"]["delta"] > 20 else "*** NOT APPLIED ***")
            print("loaded    :", ", ".join(sorted(set(r["fontsLoaded"]))) or "none")
            print(f"overflow  : doc {r['docW']} vs win {r['winW']}")
            for o in r["overflowing"]:
                print("            !", o)
            print(f"contrast  : {len(r['contrast'])} failures")
            for c in r["contrast"][:14]:
                print("            !", c)
            print(f"targets   : {len(r['smallTargets'])} under size")
            for s in r["smallTargets"][:10]:
                print("            !", s)
            await pg.close()
        await b.close()


asyncio.run(main())
