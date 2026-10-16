#!/usr/bin/env python3
"""Completeness-run capture: heights + horizontal overflow (jumble)
on the measured surfaces, before|after. Local HTTP + headless
Chromium, font domains fulfilled empty (house pattern)."""
import http.server, threading, functools, os, sys, json

MODE = sys.argv[1]
assert MODE in ("before", "after")
ROOT = os.path.expanduser("~/workspace/activity-vault")
OUT = os.path.expanduser(f"~/workspace/progress-archive/activity-vault/2026-10-15-completeness/{MODE}")
os.makedirs(OUT, exist_ok=True)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8941), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
B = "http://127.0.0.1:8941"

SURFACES = [
    ("index", "/index.html"),
    ("collections", "/collections.html"),
    ("desk", "/desk.html"),
    ("planner", "/planner.html"),
    ("activity-kin-ball", "/activity/kin-ball-first-session.html"),
    ("activity-rounds", "/activity/first-rounds-singing-circle.html"),
]
WIDTHS = [320, 390, 1440]

from playwright.sync_api import sync_playwright
metrics = {}
with sync_playwright() as p:
    for name, path in SURFACES:
        for w in WIDTHS:
            key = f"{name}@{w}"
            dest = os.path.join(OUT, key.replace("@", "-") + ".png")
            b = p.chromium.launch()
            pg = b.new_page(viewport={"width": w, "height": 900})
            pg.route("**fonts.googleapis.com**", lambda r: r.fulfill(status=200, content_type="text/css", body=""))
            pg.route("**fonts.gstatic.com**", lambda r: r.fulfill(status=200, body=""))
            try:
                pg.goto(B + path, wait_until="load", timeout=30000)
            except Exception as e:
                metrics[key] = {"error": str(e)[:120]}
                b.close()
                continue
            pg.wait_for_timeout(900)
            m = pg.evaluate("""() => ({
                scrollHeight: document.documentElement.scrollHeight,
                scrollWidth: document.documentElement.scrollWidth,
                innerWidth: window.innerWidth,
                title: document.title
            })""")
            m["jumble_px"] = max(0, m["scrollWidth"] - m["innerWidth"])
            metrics[key] = m
            pg.screenshot(path=dest, full_page=False)
            print(key, m)
            b.close()
json.dump(metrics, open(os.path.join(OUT, "metrics.json"), "w"), indent=1)
print("wrote", os.path.join(OUT, "metrics.json"))
