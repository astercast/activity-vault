#!/usr/bin/env python3
"""Rotation-17 capture: local HTTP + headless Chromium, font domains
fulfilled EMPTY (improved from the wave-38 abort method in this very
run: an aborted font stylesheet left document.fonts unsettled and
Playwright's screenshot hung 30s+ on the mobile homepage — fulfilling
an empty stylesheet settles font loading instantly and the fallback
fonts render, as they did under the abort method). Resume-safe:
shots already on disk are skipped."""
import http.server, threading, functools, os, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.expanduser("~/workspace/activity-vault")
OUT = os.path.expanduser("~/workspace/progress-archive/activity-vault/rotation-017")
os.makedirs(OUT, exist_ok=True)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8932), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()

shots = [
    ("homepage-desktop", "http://127.0.0.1:8932/index.html", 1440, 900),
    ("homepage-mobile", "http://127.0.0.1:8932/index.html", 390, 844),
    ("collections-desktop", "http://127.0.0.1:8932/collections.html", 1440, 900),
    ("floor-compost-desktop", "http://127.0.0.1:8932/activity/compost-heap-temperature-ledger.html", 1440, 900),
    ("floor-star-party-mobile", "http://127.0.0.1:8932/activity/star-party-hosts.html", 390, 844),
    ("kitbag-desktop", "http://127.0.0.1:8932/kitbag.html", 1440, 900),
]
errors = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, url, w, h in shots:
        dest = os.path.join(OUT, name + ".png")
        if os.path.exists(dest) and os.path.getsize(dest) > 10000:
            print("skip (exists)", name)
            continue
        pg = b.new_page(viewport={"width": w, "height": h})
        pg.on("pageerror", lambda e, n=name: errors.append(f"{n}: {e}"))
        pg.route("**fonts.googleapis.com**", lambda r: r.fulfill(status=200, content_type="text/css", body=""))
        pg.route("**fonts.gstatic.com**", lambda r: r.fulfill(status=200, body=""))
        pg.goto(url, wait_until="load", timeout=30000)
        pg.wait_for_timeout(700)
        pg.screenshot(path=dest, timeout=60000)
        print("shot", name, "title:", pg.title())
        pg.close()
    b.close()
print("page errors:", errors if errors else "none")
srv.shutdown()
