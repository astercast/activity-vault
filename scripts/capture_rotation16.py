#!/usr/bin/env python3
"""Rotation-16 capture: local HTTP + headless Chromium, font domains aborted
(the wave-38 method — sandbox tunnel hangs on Google Fonts)."""
import http.server, threading, functools, os, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.expanduser("~/workspace/activity-vault")
OUT = os.path.expanduser("~/workspace/progress-archive/activity-vault/rotation-016")
os.makedirs(OUT, exist_ok=True)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8931), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()

shots = [
    ("homepage-desktop", "http://127.0.0.1:8931/index.html", 1440, 900),
    ("homepage-mobile", "http://127.0.0.1:8931/index.html", 390, 844),
    ("collections-desktop", "http://127.0.0.1:8931/collections.html", 1440, 900),
    ("teen-compass-desktop", "http://127.0.0.1:8931/activity/compass-course-three-flags.html", 1440, 900),
    ("teen-repair-cafe-mobile", "http://127.0.0.1:8931/activity/repair-cafe-first-session.html", 390, 844),
    ("kitbag-desktop", "http://127.0.0.1:8931/kitbag.html", 1440, 900),
]
errors = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, url, w, h in shots:
        pg = b.new_page(viewport={"width": w, "height": h})
        pg.on("pageerror", lambda e, n=name: errors.append(f"{n}: {e}"))
        pg.route("**fonts.googleapis.com**", lambda r: r.abort())
        pg.route("**fonts.gstatic.com**", lambda r: r.abort())
        pg.goto(url, wait_until="load", timeout=30000)
        pg.wait_for_timeout(700)
        pg.screenshot(path=os.path.join(OUT, name + ".png"))
        print("shot", name, "title:", pg.title())
        pg.close()
    b.close()
print("page errors:", errors if errors else "none")
srv.shutdown()
