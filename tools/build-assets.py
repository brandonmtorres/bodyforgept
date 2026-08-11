#!/usr/bin/env python3
"""Derive responsive, art-directed image assets from the BodyForge source photography.

Sources are the original full-size uploads pulled from bodyforgept.com. Everything the site
ships is generated from here so crops and quality stay reproducible.
"""
from PIL import Image, ImageOps, ImageChops
from pathlib import Path
import shutil

SRC = Path(__file__).resolve().parent.parent / "site/assets/img"
OUT = Path(__file__).resolve().parent.parent / "site/assets/media"
# Wipe first. Otherwise a derivative from an older widths list survives, the page
# keeps referencing it, and the site only breaks on a clean checkout.
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True, exist_ok=True)

WEBP_Q = 82
JPG_Q = 82


def crop_to(im, ratio, focus=(0.5, 0.5)):
    """Crop to `ratio` (w/h), keeping `focus` (fractional x,y) as centred as the frame allows."""
    w, h = im.size
    target = ratio
    cur = w / h
    if cur > target:                       # too wide -> trim sides
        nw = int(round(h * target))
        nh = h
    else:                                  # too tall -> trim top/bottom
        nw = w
        nh = int(round(w / target))
    fx, fy = focus
    left = int(round(fx * w - nw / 2))
    top = int(round(fy * h - nh / 2))
    left = max(0, min(left, w - nw))
    top = max(0, min(top, h - nh))
    return im.crop((left, top, left + nw, top + nh))


def box(im, rect):
    """Explicit pixel crop, for frames where auto-centring keeps the wrong thing."""
    return im.crop(rect)


def emit(im, stem, widths, jpg_fallback=True):
    """Write webp at every width, plus one jpg fallback at the largest width."""
    written = []
    for wpx in widths:
        if wpx > im.width:
            continue
        scaled = im.resize((wpx, int(round(wpx * im.height / im.width))), Image.LANCZOS)
        p = OUT / f"{stem}-{wpx}.webp"
        scaled.save(p, "WEBP", quality=WEBP_Q, method=6)
        written.append(p)
    if jpg_fallback:
        wpx = min(max(widths), im.width)
        scaled = im.resize((wpx, int(round(wpx * im.height / im.width))), Image.LANCZOS)
        p = OUT / f"{stem}-{wpx}.jpg"
        scaled.convert("RGB").save(p, "JPEG", quality=JPG_Q, optimize=True, progressive=True)
        written.append(p)
    return written


def load(name):
    return ImageOps.exif_transpose(Image.open(SRC / name)).convert("RGB")


# ---------------------------------------------------------------- photography
# focus points chosen by eye against the source frames so faces/hands survive the crop.
# an optional sixth element is a pixel box applied *before* the ratio crop, for frames
# where something has to be cut out of shot entirely (see PRE-BOX notes below).
JOBS = [
    # ── 2025 set (new_img/): all 4000x6000 portrait, the current team and room ──
    # hero: hands set on the knee before a passive range check. face, badge and hands
    # all in frame, which is the whole trust argument in one photograph.
    # PRE-BOX: the clinician sits in the left two thirds. the hero panel is a narrow
    # vertical band, so trim the empty wall or object-fit centres on nothing.
    ("new_img/DSC00289.JPG", "hero-clinic", 3 / 4, (0.5, 0.30), [520, 760, 1000], (0, 0, 2900, 6000)),
    # phones take a square off the top of the same box. 4:3 cut the crown of the
    # head and left barely 100px of photo above the docked review plate; 1:1 keeps
    # the whole head and the badge without pushing the CTA off the first screen.
    ("new_img/DSC00289.JPG", "hero-clinic-mob", 1 / 1, (0.5, 0.24), [560, 860, 1180], (0, 0, 2900, 6000)),
    # the clinical team, plain wall, no props. carries "one-to-one, not necessarily
    # the founder" better than any sentence can.
    ("new_img/DSC00241.JPG", "team", 3 / 2, (0.5, 0.40), [640, 1000, 1400]),
    # coaching a hinge over the stability ball, both arms cueing the reach
    ("new_img/DSC00403.JPG", "coach-ball", 3 / 2, (0.5, 0.33), [760, 1200, 1600]),
    # same frame, tight on the movement itself: spine articulating over the ball,
    # arms reaching long. the Pilates row, where a wide room shot says nothing.
    ("new_img/DSC00403.JPG", "spine-ball", 3 / 2, (0.5, 0.5), [640, 1000, 1500], (200, 1600, 3200, 4600)),
    # tight macro: forearm and both hands set on the knee. the most tactile frame here.
    ("new_img/DSC00282.JPG", "hands-knee", 3 / 2, (0.5, 0.30), [640, 1000, 1500]),
    # the recovery column is a tall stretched panel, so it needs the portrait cut.
    # PRE-BOX above the shoes: stretched full height the untrimmed frame is half sneaker.
    ("new_img/DSC00282.JPG", "hands-knee-tall", 4 / 5, (0.5, 0.5), [520, 800, 1100], (0, 600, 4000, 3400)),
    # patient supine on the table mid-session. reads as recovery rather than rehab,
    # which is exactly what the weekend menu is.
    ("new_img/DSC00272.JPG", "recovery", 3 / 2, (0.5, 0.35), [640, 1000, 1500]),
    # knee held, patient's leg over the ball, clinician mid-sentence
    ("new_img/DSC04971.JPG", "warm-knee", 3 / 2, (0.5, 0.30), [640, 1000, 1500]),
    # dowel held against the spine to read overhead position. a real screening tool.
    ("new_img/DSC05151.JPG", "dowel", 3 / 2, (0.5, 0.30), [640, 1000, 1500]),
    # PRE-BOX: the old wall logo sits in the left sixth of this frame. cut it out
    # first. focus sits low so the band itself is in shot, not just the face.
    ("new_img/DSC05248.JPG", "band-demo", 3 / 2, (0.5, 0.40), [640, 1000, 1500], (640, 0, 4000, 6000)),
    # PRE-BOX: same old wall logo, left edge. wide room shot, clock and plant in frame.
    ("new_img/DSC04894.JPG", "room", 3 / 2, (0.45, 0.40), [640, 1000, 1500, 2000], (820, 0, 4000, 6000)),

    # ── original set: still carrying the four service pages ──
    # hands-on scapular cueing, both faces visible
    ("BodyForge-70-scaled.jpg", "handson-wide", 3 / 2, (0.46, 0.46), [760, 1200, 1600]),
    # cable/band shoulder work, athletic posture
    ("BodyForge-60-scaled.jpg", "assess", 3 / 2, (0.42, 0.46), [640, 1000, 1500]),
    # kettlebell hinge under load
    ("BodyForge-211-scaled.jpg", "load", 3 / 2, (0.5, 0.5), [640, 1000, 1500]),
    # kettlebell rack still life
    ("BodyForge-362-scaled.jpg", "kettlebells", 3 / 2, (0.45, 0.55), [640, 1000, 1500]),
    # founder portrait
    ("IMG_4666.png", "doctor", 4 / 5, (0.5, 0.36), [520, 780, 1040]),
]

# Two frames carry the OLD wall logo high in the shot. Auto-centring keeps it, which
# would put the pre-rebrand mark on the new site. Crop explicitly below it instead.
BOXED = [
    ("BodyForge-201-scaled.jpg", "mat", (290, 415, 1316, 1099), [640, 1000]),
    ("BodyForge-96-scaled.jpg", "cue", (180, 470, 1075, 1067), [640, 895]),
]

# art-directed crops used only inside <source type="image/webp"> media queries. If webp
# is unsupported the browser falls back to the <img src>, so these need no jpg twin.
WEBP_ONLY = {"hero-clinic-mob", "hands-knee-tall"}

for job in JOBS:
    src, stem, ratio, focus, widths = job[:5]
    pre = job[5] if len(job) > 5 else None
    im = load(src)
    if pre:
        im = box(im, pre)
    emit(crop_to(im, ratio, focus), stem, widths, jpg_fallback=stem not in WEBP_ONLY)
    print(f"  {stem:20s} <- {src}{'  (pre-boxed)' if pre else ''}")

for src, stem, rect, widths in BOXED:
    im = box(load(src), rect)
    emit(im, stem, widths)
    print(f"  {stem:20s} <- {src}  (boxed {im.size[0]}x{im.size[1]}, avoids old wall logo)")

# ------------------------------------------------------------------ portraits
for src, stem in [
    ("DH-scaled.jpg", "p-diane"),
    ("2BA87F74-43EB-4479-928C-0FB49D8DBE19.jpg", "p-maria"),
    ("UM-pic.jpg", "p-yiqin"),
]:
    im = load(src)
    focus = (0.55, 0.42) if stem != "p-yiqin" else (0.5, 0.34)
    emit(crop_to(im, 1.0, focus), stem, [160, 320], jpg_fallback=False)
    print(f"  {stem:20s} <- {src}")

# ----------------------------------------------------------------- open graph
og = crop_to(load("new_img/DSC00289.JPG"), 1200 / 630, (0.5, 0.30))
og = og.resize((1200, 630), Image.LANCZOS)
og.save(OUT / "og.jpg", "JPEG", quality=88, optimize=True, progressive=True)
print("  og.jpg")

# ---------------------------------------------------------------- logo marks
# The source mark is orange + near-black on transparency. The black half vanishes on the ink
# ground, so derive a bone-coloured variant for dark surfaces.
mark = ImageOps.exif_transpose(Image.open(SRC / "cropped-bodyforge-physical-therapy-1.png")).convert("RGBA")
bbox = mark.split()[3].getbbox()
if bbox:
    mark = mark.crop(bbox)

mark.resize((512, int(round(512 * mark.height / mark.width))), Image.LANCZOS).save(
    OUT / "mark-dark.png", "PNG", optimize=True
)

px = mark.load()
w, h = mark.size
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a > 8 and max(r, g, b) < 110:          # the near-black wing
            px[x, y] = (244, 238, 232, a)         # bone
mark.resize((512, int(round(512 * h / w))), Image.LANCZOS).save(
    OUT / "mark-light.png", "PNG", optimize=True
)
print("  mark-dark.png / mark-light.png")

# favicon from the orange half of the mark
fav = Image.open(OUT / "mark-dark.png").convert("RGBA")
side = max(fav.size)
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
sq.paste(fav, ((side - fav.width) // 2, (side - fav.height) // 2), fav)
sq.resize((180, 180), Image.LANCZOS).save(OUT / "icon-180.png", "PNG", optimize=True)
sq.resize((32, 32), Image.LANCZOS).save(OUT / "icon-32.png", "PNG", optimize=True)
print("  icons")

total = sum(p.stat().st_size for p in OUT.iterdir())
print(f"\n{len(list(OUT.iterdir()))} files, {total/1024:.0f} KB total")
