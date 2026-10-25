#!/usr/bin/env python3
"""Plate image variants (Claude bundle 2026-10-24, item 6 / step 1).

DEVIATION, recorded: the brief asks for AVIF at 480 + 960 widths.
This environment's Pillow (10.2.0) has no AVIF encoder
(PIL.features.check('avif') is False and Image.save('x.avif')
fails with "unknown file extension"), so the variants are written
as resized WebP with exactly the same srcset shape
(<stem>-480.webp 480w, <stem>-960.webp 960w). The markup contract
is unchanged; if an AVIF encoder lands, only this script's FORMAT
line changes. The original .webp stays as the fallback `src`.

Maintainer tool, not part of the deploy build: Vercel builds run
`python3 scripts/build.py` with no dependencies installed, so the
variants are generated here and committed as files. Idempotent:
a variant newer than its source is left alone.

Usage: python3 scripts/plate_images.py [--force]
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHOTOS = os.path.join(ROOT, "assets", "photos")
WIDTHS = (480, 960)
QUALITY = 78


def main():
    force = "--force" in sys.argv
    try:
        from PIL import Image
    except ImportError:
        print("Pillow is required (pip install Pillow)")
        return 1
    made = skipped = 0
    for dirpath, _dirs, files in os.walk(PHOTOS):
        for fn in sorted(files):
            if not fn.endswith(".webp"):
                continue
            stem = fn[: -len(".webp")]
            if stem.endswith("-480") or stem.endswith("-960"):
                continue
            src = os.path.join(dirpath, fn)
            with Image.open(src) as im:
                im.load()
                for w in WIDTHS:
                    dst = os.path.join(dirpath, f"{stem}-{w}.webp")
                    if (not force and os.path.exists(dst)
                            and os.path.getmtime(dst) >= os.path.getmtime(src)):
                        skipped += 1
                        continue
                    target_w = min(w, im.width)
                    if target_w == im.width:
                        out = im.copy()
                    else:
                        target_h = round(im.height * target_w / im.width)
                        out = im.resize((target_w, target_h), Image.LANCZOS)
                    out.save(dst, "WEBP", quality=QUALITY, method=6)
                    made += 1
    print(f"plate variants: {made} written, {skipped} already current")
    return 0


if __name__ == "__main__":
    sys.exit(main())
