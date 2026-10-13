#!/usr/bin/env python3
"""Rotation-19 capture: local HTTP (ThreadingHTTPServer) + headless
Chromium, font domains fulfilled EMPTY (the rotation-17 fix: an
aborted font stylesheet left document.fonts unsettled and the
screenshot hung; fulfilling an empty stylesheet settles font
loading instantly and fallback fonts render). Fresh browser per
shot. Resume-safe: shots already on disk are skipped."""
import http.server, threading, functools, os
from playwright.sync_api import sync_playwright

ROOT = os.path.expanduser("~/workspace/activity-vault")
OUT = os.path.expanduser("~/workspace/progress-archive/activity-vault/rotation-019")
os.makedirs(OUT, exist_ok=True)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8934), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()

shots = [
    ("homepage-desktop", "http://127.0.0.1:8934/index.html", 1440, 900, False),
    ("homepage-mobile", "http://127.0.0.1:8934/index.html", 390, 844, False),
    ("collections-desktop", "http://127.0.0.1:8934/collections.html", 1440, 900, False),
    ("collection-fourth-time-desktop", "http://127.0.0.1:8934/collections.html#just-teens-fourth-time", 1440, 900, True),
    ("activity-garlic-desktop", "http://127.0.0.1:8934/activity/overwintering-garlic-planting-crew.html", 1440, 900, True),
    ("activity-documentary-mobile", "http://127.0.0.1:8934/activity/one-room-documentary-crew.html", 390, 844, True),
    ("kitbag-desktop", "http://127.0.0.1:8934/kitbag.html", 1440, 900, False),
    ("collection-fourth-time-detail-desktop", "http://127.0.0.1:8934/collections.html#just-teens-fourth-time", 1440, 900, "detail"),
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
        if "collections.html" in url:
            # Rotation-19 improvement: the grid + detail panel are
            # rendered async from data/v1 JSON — the rotation-18
            # scroll-through raced that load and the later-inserted
            # cards never revealed (ghosted Little Hands rows).
            # Wait for the loaded status line before scrolling.
            try:
                pg.wait_for_function(
                    "() => { const el = document.getElementById('coll-status'); return el && /curated collections loaded/.test(el.textContent); }",
                    timeout=15000)
            except Exception as e:
                print("collections wait note:", e)
            pg.wait_for_timeout(500)
        if full == "detail":
            pg.evaluate("() => { const el = document.getElementById('collection-sections'); if (el) el.scrollIntoView(); }")
            pg.wait_for_timeout(900)
        elif full:
            # Reveal-on-scroll cards never trigger in a bare full-page
            # capture and render ghosted (found on this rotation's
            # first collection shot) — scroll through first.
            pg.evaluate("""async () => { const H=document.body.scrollHeight; for(let y=0;y<=H;y+=600){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,120));} window.scrollTo(0,0); }""")
            pg.wait_for_timeout(600)
            # Second pass at the (possibly re-laid-out) full height.
            pg.evaluate("""async () => { const H=document.body.scrollHeight; for(let y=0;y<=H;y+=600){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,80));} window.scrollTo(0,0); }""")
            pg.wait_for_timeout(600)
        pg.screenshot(path=dest, timeout=60000, full_page=(full is True))
        print("shot", name, "title:", pg.title())
        b.close()
print("page errors:", errors if errors else "none")
srv.shutdown()
