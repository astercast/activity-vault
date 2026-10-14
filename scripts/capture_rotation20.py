#!/usr/bin/env python3
"""Rotation-20 capture (minimal pass before/after + wave 43):
local HTTP (ThreadingHTTPServer) + headless Chromium, font domains
fulfilled EMPTY (rotation-17 fix). Fresh browser per shot.
Countermeasure from rotation 19, kept and extended: async grids
(collections AND the homepage browse grid) are waited for BEFORE
any scroll-through — the r18/r19 lesson was that scrolling before
the async render races it and cards render ghosted/blank.
Usage: capture_rotation20.py before|after
Resume-safe: shots already on disk are skipped."""
import http.server, threading, functools, os, sys

MODE = sys.argv[1] if len(sys.argv) > 1 else "after"
assert MODE in ("before", "after")
ROOT = os.path.expanduser("~/workspace/activity-vault")
OUT = os.path.expanduser(f"~/workspace/progress-archive/activity-vault/rotation-020/{MODE}")
os.makedirs(OUT, exist_ok=True)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8935), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
B = "http://127.0.0.1:8935"

shots = [
    ("homepage-desktop", B + "/index.html", 1440, 900, False),
    ("homepage-mobile", B + "/index.html", 390, 844, False),
    ("collections-desktop", B + "/collections.html", 1440, 900, False),
    ("activity-garlic-desktop", B + "/activity/overwintering-garlic-planting-crew.html", 1440, 900, True),
    ("kitbag-desktop", B + "/kitbag.html", 1440, 900, False),
]
if MODE == "after":
    shots += [
        ("collection-fifth-time-desktop", B + "/collections.html#just-teens-fifth-time", 1440, 900, True),
        ("collection-fifth-time-detail-desktop", B + "/collections.html#just-teens-fifth-time", 1440, 900, "detail"),
        ("activity-degree-day-desktop", B + "/activity/growing-degree-day-ledger.html", 1440, 900, True),
        ("activity-kin-ball-mobile", B + "/activity/kin-ball-first-session.html", 390, 844, True),
        ("planner-desktop", B + "/planner.html", 1440, 900, False),
    ]

errors = []
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    for name, url, w, h, full in shots:
        dest = os.path.join(OUT, name + ".png")
        if os.path.exists(dest) and os.path.getsize(dest) > 10000:
            print("skip (exists)", name); continue
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": w, "height": h})
        pg.on("pageerror", lambda e, n=name: errors.append(f"{n}: {e}"))
        pg.route("**fonts.googleapis.com**", lambda r: r.fulfill(status=200, content_type="text/css", body=""))
        pg.route("**fonts.gstatic.com**", lambda r: r.fulfill(status=200, body=""))
        pg.goto(url, wait_until="load", timeout=30000)
        pg.wait_for_timeout(700)
        if "collections.html" in url:
            try:
                pg.wait_for_function(
                    "() => { const el = document.getElementById('coll-status'); return el && /curated collections loaded/.test(el.textContent); }",
                    timeout=15000)
            except Exception as e:
                print("collections wait note:", e)
            pg.wait_for_timeout(500)
        if url.endswith("/index.html"):
            try:
                pg.wait_for_function(
                    "() => { const el = document.getElementById('result-count'); return el && /activities/.test(el.textContent); }",
                    timeout=15000)
            except Exception as e:
                print("homepage grid wait note:", e)
            pg.wait_for_timeout(400)
        if full == "detail":
            pg.evaluate("() => { const el = document.getElementById('collection-sections'); if (el) el.scrollIntoView(); }")
            pg.wait_for_timeout(900)
        elif full:
            pg.evaluate("""async () => { const H=document.body.scrollHeight; for(let y=0;y<=H;y+=600){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,120));} window.scrollTo(0,0); }""")
            pg.wait_for_timeout(600)
            pg.evaluate("""async () => { const H=document.body.scrollHeight; for(let y=0;y<=H;y+=600){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,80));} window.scrollTo(0,0); }""")
            pg.wait_for_timeout(600)
        pg.screenshot(path=dest, timeout=60000, full_page=(full is True))
        print("shot", name, "title:", pg.title())
        b.close()
print("page errors:", errors if errors else "none")
srv.shutdown()
