#!/usr/bin/env python3
"""The Register: writes the home page of Activity Vault (header, hero, proof bar,
first 24 records) between <!--REGISTER:BEGIN--> and <!--REGISTER:END--> in index.html.

What it will not do: invent a photo, a licence or a source. A record shows
"Photo" proof only when it carries a licence AND a file page link, and "Source"
proof only when it carries a source link. Anything else is printed as "Not yet".
Run after build.py:  python3 scripts/build_register.py
"""
import json, os, re, sys
from html import escape as esc
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, "index.html")
FIRST = 24
CATS = json.load(open(os.path.join(ROOT, "data", "categories.json")))
CAT = {c["id"]: c["name"] for c in CATS}


def load():
    return json.load(open(os.path.join(ROOT, "data", "v1", "activities.json")))["activities"]


def photo_ok(a):
    p = a.get("photo") or {}
    return bool(p.get("file") and p.get("licence") and p.get("source_url"))


def source_url(a):
    s = a.get("source")
    if isinstance(s, str):
        return s
    if isinstance(s, dict):
        return s.get("url") or ""
    return ""


def source_ok(a):
    return source_url(a).startswith("http")


def host(u):
    return urlparse(u).netloc.lower().removeprefix("www.")


def rank(a):
    return (-(photo_ok(a) + source_ok(a)), a["name"].lower())


def facts(a):
    t = a["time_min"] if a["time_min"] == a["time_max"] else "%d to %d" % (a["time_min"], a["time_max"])
    return "Ages %d to %d · %s min · %d to %d kids · %s" % (
        a["age_min"], a["age_max"], t, a["group_min"], a["group_max"],
        CAT.get(a["categories"][0], a["categories"][0]))


def row(a, i=0):
    p = a.get("photo") or {}
    if photo_ok(a):
        img = ('<a class="rg-img" href="activity/%s.html" tabindex="-1"><img src="assets/photos/%s" alt="%s" width="224" height="168" loading="lazy"></a>'
               % (esc(a["id"]), esc(p["file"]), esc(p.get("alt", ""), True)))
        ph = '<div class="ok"><dt>Photo</dt><dd><a href="%s" rel="noopener">%s <span aria-hidden="true">↗</span></a></dd></div>' % (esc(p["source_url"], True), esc(p["licence"]))
    elif p.get("file"):
        img = ('<a class="rg-img" href="activity/%s.html" tabindex="-1"><img src="assets/photos/%s" alt="%s" width="224" height="168" loading="lazy"></a>'
               % (esc(a["id"]), esc(p["file"]), esc(p.get("alt", ""), True)))
        ph = '<div class="gap"><dt>Photo</dt><dd>Rights not recorded</dd></div>'
    else:
        img = '<span class="rg-img none" aria-hidden="true">No photo yet</span>'
        ph = '<div class="gap"><dt>Photo</dt><dd>Not yet</dd></div>'
    if source_ok(a):
        so = '<div class="ok"><dt>Source</dt><dd><a href="%s" rel="noopener">%s <span aria-hidden="true">↗</span></a></dd></div>' % (esc(source_url(a), True), esc(host(source_url(a))))
    else:
        so = '<div class="gap"><dt>Source</dt><dd>Not yet</dd></div>'
    return ('<li class="rg-row" style="--i:%d">%s<div class="rg-main"><h3><a href="activity/%s.html">%s</a></h3>'
            '<p class="rg-line">%s</p><p class="rg-facts">%s</p></div><dl class="rg-proof">%s%s</dl></li>'
            % (i, img, esc(a["id"]), esc(a["name"]), esc(a["tagline"]), esc(facts(a)), ph, so))


HEAD = '''<header class="rg-head">
  <a class="rg-mark" href="index.html" aria-current="page" aria-label="Activity Vault, home"><span>Activity Vault</span></a>
  <nav class="rg-nav" aria-label="Primary">
    <a href="planner.html">Plan my week</a>
    <a href="collections.html">Collections</a>
    <a href="kitbag.html">Kit Bag</a>
    <a href="party.html">Party Planner</a>
    <a href="desk.html">The Desk</a>
    <details class="nav-more"><summary>More</summary><div class="nav-more-panel">
      <p class="nav-more-h">Tools</p><a href="sub.html">Sub Tub</a><a href="fieldtrip.html">Field Trips</a>
      <p class="nav-more-h">Seasons</p><a href="halloween.html">Halloween</a><a href="thanksgiving.html">Thanksgiving</a><a href="winter.html">Winter</a><a href="spring.html">Spring</a><a href="summer.html">Summer</a>
    </div></details>
  </nav>
</header>'''


def build():
    acts = load()
    n = len(acts)
    both = sum(photo_ok(a) and source_ok(a) for a in acts)
    ph = sum(photo_ok(a) for a in acts)
    so = sum(source_ok(a) for a in acts)
    ph_only, so_only = ph - both, so - both
    neither = n - both - ph_only - so_only
    first = sorted(acts, key=rank)[:FIRST]
    cats = "".join('<button type="button" class="rg-chip" data-cat="%s" aria-pressed="false">%s</button>' % (c["id"], esc(c["name"])) for c in CATS)
    seg = lambda k, v, label: '<button type="button" class="seg seg-%s" data-proof="%s" style="--w:%d" aria-pressed="false" title="%s"><span class="vh">%s: %d</span></button>' % (k, k, v, label, label, v)
    body = '''<main class="rg" id="main">
  <h1>Things to do with kids, with the proof shown.</h1>
  <p class="rg-deck">Every record has its steps and materials. Where we have a photo or a source, the credit and the link sit right beside it. Where we do not, it says so.</p>

  <form class="rg-find" role="search" onsubmit="return false">
    <label for="q">Search %d activities</label>
    <input id="q" type="search" placeholder="Try parachute, leaves or paper" autocomplete="off">
  </form>

  <div class="rg-proofbar" aria-label="How much of the register is proven">
    <div class="bar" role="group" aria-label="Filter by proof">%s%s%s%s</div>
    <ul class="legend">
      <li class="k-both"><b>%d</b> have photo and source</li>
      <li class="k-ph"><b>%d</b> photo only</li>
      <li class="k-so"><b>%d</b> source only</li>
      <li class="k-none"><b>%d</b> neither yet</li>
    </ul>
  </div>

  <div class="rg-filters" id="filters">
    <div class="rg-chips" role="group" aria-label="Kind of activity">%s</div>
    <label>Age <select id="age"><option value="">Any</option><option value="4">3 to 4</option><option value="6">5 to 7</option><option value="9">8 to 10</option><option value="12">11 to 14</option></select></label>
    <label>Time <select id="time"><option value="">Any</option><option value="15">15 min or less</option><option value="30">30 min or less</option><option value="60">An hour or less</option></select></label>
    <button type="button" class="rg-clear" id="clear" hidden>Clear</button>
  </div>

  <p class="rg-count" role="status" aria-live="polite" id="count">%d records. Proven ones first.</p>
  <ol class="rg-list" id="list">
%s
  </ol>
  <p class="rg-more"><button type="button" id="more" hidden>Show 40 more</button></p>
  <p class="rg-note">Photos come from Wikimedia Commons and similar open collections. Each licence is the one printed on the photo’s own file page, linked beside the photo. A source is the page that inspired the idea; the steps are written in our own words. <a href="review.html">How new records get in</a></p>
</main>''' % (n, seg("both", both, "Photo and source"), seg("ph", ph_only, "Photo only"), seg("so", so_only, "Source only"), seg("none", neither, "Neither yet"),
              both, ph_only, so_only, neither, cats, n, "\n".join(row(a, i) for i, a in enumerate(first)))
    return HEAD + "\n" + body


def main():
    page = open(PAGE).read()
    pat = re.compile(r"(<!--REGISTER:BEGIN-->).*?(<!--REGISTER:END-->)", re.S)
    if not pat.search(page):
        sys.exit("REGISTER markers missing in index.html")
    open(PAGE, "w").write(pat.sub(lambda m: m.group(1) + "\n" + build() + "\n" + m.group(2), page, count=1))
    print("[register] home written")


if __name__ == "__main__":
    main()
