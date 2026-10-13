#!/usr/bin/env python3
"""Rotation-18 capture: local HTTP (ThreadingHTTPServer) + headless
Chromium, font domains fulfilled EMPTY (the rotation-17 fix: an
aborted font stylesheet left document.fonts unsettled and the
screenshot hung; fulfilling an empty stylesheet settles font
loading instantly and fallback fonts render). Fresh browser per
shot. Resume-safe: shots already on disk are skipped."""
import http.server, threading, functools, os
from playwright.sync_api import sync_playwright

ROOT = os.path.expanduser("~/workspace/activity-vault")
OUT = os.path.expanduser("~/workspace/progress-archive/activity-vault/rotation-018")
os.makedirs(OUT, exist_ok=True)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8933), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()

shots = [
    ("homepage-desktop", "http://127.0.0.1:8933/index.html", 1440, 900, False),
    ("homepage-mobile", "http://127.0.0.1:8933/index.html", 390, 844, False),
    ("collections-desktop", "http://127.0.0.1:8933/collections.html", 1440, 900, False),
    ("collection-third-time-desktop", "http://127.0.0.1:8933/collections.html#just-teens-third-time", 1440, 900, True),
    ("activity-transect-desktop", "http://127.0.0.1:8933/activity/transect-line-field-survey.html", 1440, 900, True),
    ("activity-dumpling-mobile", "http://127.0.0.1:8933/activity/lunar-new-year-dumpling-folding-night.html", 390, 844, True),
    ("kitbag-desktop", "http://127.0.0.1:8933/kitbag.html", 1440, 900, False),
]
errors = []
with sync_playwright() as p:
    for name, url, w, h, full in shots:
        dest = os.path.join(OUT, name + ".png")
        if os.path.exists(dest) and os.path.getsize(dest) > 10000:
            print("skip (exists)", name)
            continue
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": w, "height": h})
        pg.on("pageerror", lambda e, n=name: errors.append(f"{n}: {e}"))
        pg.route("**fonts.googleapis.com**", lambda r: r.fulfill(status=200, content_type="text/css", body=""))
        pg.route("**fonts.gstatic.com**", lambda r: r.fulfill(status=200, body=""))
        pg.goto(url, wait_until="load", timeout=30000)
        pg.wait_for_timeout(700)
        if full:
            # Reveal-on-scroll cards never trigger in a bare full-page
            # capture and render ghosted (found on this rotation's
            # first collection shot) — scroll through first.
            pg.evaluate("""async () => { const H=document.body.scrollHeight; for(let y=0;y<=H;y+=600){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,120));} window.scrollTo(0,0); }""")
            pg.wait_for_timeout(600)
        pg.screenshot(path=dest, timeout=60000, full_page=full)
        print("shot", name, "title:", pg.title())
        b.close()
print("page errors:", errors if errors else "none")
srv.shutdown()
