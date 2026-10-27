#!/usr/bin/env python3
"""Activity Vault build script.

Source of truth: data/activities.json + data/categories.json
Generates: activity/*.html, data/v1/*.json, data/v1/schema/*.schema.json,
           llms.txt, llms-full.txt, sitemap.xml
Validates: schema, ids, categories, required fields, render check for every activity.
"""
import json, os, re, shutil, sys, html
from urllib.parse import urlparse, quote as _urlquote
from datetime import date, datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')
SITE = ROOT  # site root (GitHub Pages-style static)

REQUIRED = ['id','name','tagline','categories','age_min','age_max','group_min','group_max',
            'time_min','time_max','location','materials','no_prep','setup','steps','variations']
ID_RE = re.compile(r'^[a-z0-9-]+$')

# Optional tag vocabulary. Tags drive the "Season / occasion" filter.
# New tags must be added here AND to assets/app.js (TAG_LABELS) AND api docs.
TAG_IDS = ["season:fall", "season:winter", "season:spring", "season:summer", "holiday:halloween", "holiday:thanksgiving",
           "holiday:dia-de-muertos",
           "holiday:christmas", "holiday:hanukkah", "holiday:kwanzaa", "holiday:new-year",
           "holiday:easter", "holiday:earth-day", "holiday:july-4th",
           "holiday:mlk-day", "holiday:valentines-day", "holiday:lunar-new-year",
           "holiday:st-patricks-day", "holiday:diwali", "holiday:indigenous-peoples-day",
           "theme:spooky"]
TAG_LABELS = {
    "season:fall": "🎃 Fall",
    "season:winter": "❄️ Winter",
    "season:spring": "🌷 Spring",
    "season:summer": "☀️ Summer",
    "holiday:halloween": "👻 Halloween",
    "holiday:thanksgiving": "🦃 Thanksgiving",
    "holiday:dia-de-muertos": "💀 Día de los Muertos",
    "holiday:christmas": "🎄 Christmas",
    "holiday:hanukkah": "🕎 Hanukkah",
    "holiday:kwanzaa": "🖤 Kwanzaa",
    "holiday:new-year": "🎆 New Year",
    "holiday:easter": "🐣 Easter",
    "holiday:earth-day": "🌎 Earth Day",
    "holiday:july-4th": "🇺🇸 July 4th",
    "holiday:mlk-day": "✊🏾 MLK Day",
    "holiday:valentines-day": "💌 Valentine's Day",
    "holiday:lunar-new-year": "🧧 Lunar New Year",
    "holiday:st-patricks-day": "☘️ St. Patrick's Day",
    "holiday:diwali": "🪔 Diwali",
    "holiday:indigenous-peoples-day": "🌎 Indigenous Peoples' Day",
    "theme:spooky": "🕸️ Spooky (not scary)",
}

# ---------------------------------------------------------------------------
# Rotation 13 placement pass (Foundry placement packet, 2026-10-13):
# the generator owns the <head> meta block on EVERY page, OG/Twitter
# cards (og:image absolutized against the live domain), theme-color,
# favicon links, a self-referential absolute canonical, and honest
# JSON-LD built only from the page's own title/description and, for
# activity pages, the activity record itself. Root pages are static
# files, so the block is (re)injected into every .html on disk at the
# end of main(), between PLACEMENT markers, idempotently, hand edits
# outside the markers are never touched, and the next rebuild keeps
# the placement instead of reverting it. VP-0002's nav is untouched.
# ---------------------------------------------------------------------------
SITE_URL = "https://activity-vault-live.vercel.app"
OG_IMAGE = SITE_URL + "/assets/og-card.png"
THEME_COLOR = "#fffdf7"  # --paper, verbatim from assets/style.css

# Commons photos wired onto activity pages (Foundry batch 1): the
# attribution line travels with the photo, on the page, per the
# manifest. Per-page need calls are recorded in WAVELOG wave 36.
ACTIVITY_PHOTOS = {
    "board-game-prototype": {
        "file": "board-game.webp",
        "alt": "The party game Just One spread out on a table, box, rulebook, cards and pieces",
        "caption": "A finished game, out on a real table: box, rules, cards, pieces. Yours will look different. That is the point of a prototype.",
        "credit": "Photo: Harrison Keely, CC BY 4.0, via Wikimedia Commons",
    },
    # Rotation 27 photo-truth fix (VP-0024/25/27): the origami-cranes,
    # watercolor-set and wooden-blocks placements were pulled — cranes are
    # not a corner bookmark, a finished abstract is not ice-cube painting,
    # and Story Building Blocks is a closed designed-absence record whose
    # leaked cover had to come off. Board Game Prototype's photo was
    # audited MATCH and stays.
}

# R304: consume ALL leading newlines and the trailing one — the old pattern
# left one newline behind per build, so every run added a blank line to
# every page (non-idempotent). This form normalizes the block in place.
_PLACEMENT_RE = re.compile(r"\n*<!-- PLACEMENT:BEGIN -->.*?<!-- PLACEMENT:END -->\n?", re.S)
_TITLE_RE = re.compile(r"<title>(.*?)</title>", re.S)
_DESC_RE = re.compile(r'<meta name="description" content="(.*?)"', re.S)


def _canonical_for(rel):
    if rel == "index.html":
        return SITE_URL + "/"
    return SITE_URL + "/" + rel.replace(os.sep, "/")


def _jsonld_for(rel, title, desc, acts_by_id, n_colls):
    """Honest JSON-LD: real page/activity/collection data only."""
    url = _canonical_for(rel)
    if rel.startswith("activity" + os.sep):
        a = acts_by_id.get(os.path.basename(rel)[:-5])
        if a:
            return {
                "@context": "https://schema.org", "@type": "HowTo",
                "name": a["name"], "description": a["tagline"], "url": url,
                "supply": [m["item"] for m in a["materials"]],
                "step": [{"@type": "HowToStep", "text": s} for s in a["steps"]],
            }
    if rel == "index.html":
        return {"@context": "https://schema.org", "@type": "WebSite",
                "name": "Activity Vault", "url": url, "description": desc}
    if rel == "collections.html":
        return {"@context": "https://schema.org", "@type": "CollectionPage",
                "name": title, "description": desc, "url": url,
                "mainEntity": {"@type": "ItemList", "numberOfItems": n_colls}}
    return {"@context": "https://schema.org", "@type": "WebPage",
            "name": title, "description": desc, "url": url}


def _placement_block(rel, title, desc, acts_by_id, n_colls):
    url = _canonical_for(rel)
    # Icon hrefs are depth-relative (root pages "", activity pages "../")
    # so the repo's own link checker resolves them; canonical/OG stay
    # absolute. (The proposal's root-absolute form is equivalent on the
    # root-served live site but fails check_api.py's link walk.)
    icon_prefix = "../" if rel.startswith("activity" + os.sep) else ""
    ld = json.dumps(_jsonld_for(rel, title, desc, acts_by_id, n_colls),
                    ensure_ascii=False).replace("</", "<\\/")
    lines = [
        "<!-- PLACEMENT:BEGIN -->",
        f'<meta name="theme-color" content="{THEME_COLOR}">',
        f'<link rel="icon" href="{icon_prefix}favicon.ico" sizes="48x48">',
        f'<link rel="icon" href="{icon_prefix}favicon.svg" type="image/svg+xml">',
        f'<link rel="apple-touch-icon" href="{icon_prefix}apple-touch-icon.png">',
        f'<link rel="canonical" href="{esc(url)}">',
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="Activity Vault">',
        f'<meta property="og:title" content="{esc(title)}">',
        f'<meta property="og:description" content="{esc(desc)}">',
        f'<meta property="og:url" content="{esc(url)}">',
        f'<meta property="og:image" content="{OG_IMAGE}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{esc(title)}">',
        f'<meta name="twitter:description" content="{esc(desc)}">',
        f'<meta name="twitter:image" content="{OG_IMAGE}">',
        f'<script type="application/ld+json">{ld}</script>',
        "<!-- PLACEMENT:END -->",
    ]
    return "\n" + "\n".join(lines)


def inject_site_meta(acts, colls):
    """(Re)inject the placement block into every .html page on disk.
    Returns (pages_seen, pages_updated)."""
    acts_by_id = {a["id"]: a for a in acts}
    pages = []
    for name in sorted(os.listdir(SITE)):
        if name.endswith(".html"):
            pages.append(name)
    actdir = os.path.join(SITE, "activity")
    for name in sorted(os.listdir(actdir)):
        if name.endswith(".html"):
            pages.append(os.path.join("activity", name))
    updated = 0
    for rel in pages:
        path = os.path.join(SITE, rel)
        with open(path) as f:
            page = f.read()
        page = _PLACEMENT_RE.sub("", page)
        mt = _TITLE_RE.search(page)
        md = _DESC_RE.search(page)
        assert mt and md, f"placement: title/description missing on {rel}"
        title = html.unescape(mt.group(1)).strip()
        desc = html.unescape(md.group(1)).strip()
        block = _placement_block(rel, title, desc, acts_by_id, len(colls))
        assert "</head>" in page, f"placement: no </head> on {rel}"
        page = page.replace("</head>", block + "\n</head>", 1)
        with open(path, "w") as f:
            f.write(page)
        updated += 1
    return len(pages), updated


# ---------------------------------------------------------------------------
# Rotation 20 minimal pass, the generator owns the site header on EVERY
# page. The old header was the busiest element sitewide: 8 folder-tab
# primary links + 9 secondary links sprawling across three rows. The
# minimal header is ONE primary row (Browse, The Desk, Plan my week,
# Collections, Kit Bag, Party Pack, VP-0002 pair kept in primary) plus
# a single "More" disclosure grouping the remaining tools and all five
# season hubs. Every destination survives; presentation only. Applied
# idempotently to every .html on disk in main(), after placement, so
# hand-written root pages and generated pages converge. aria-current is
# preserved from the page's previous header.
# ---------------------------------------------------------------------------
_HEADER_RE = re.compile(r'<header class="site-header[^"]*">.*?</header>', re.S)
_CURRENT_RE = re.compile(r'href="([^"]+)"[^>]*aria-current="page"|aria-current="page"[^>]*href="([^"]+)"')

def _minimal_header(prefix, current_href, no_print):
    def cur(href):
        return ' aria-current="page"' if current_href and href.endswith(current_href.split('/')[-1]) and current_href == href else ''
    # current_href is stored as the full href found on the page (with prefix)
    def c(href):
        return ' aria-current="page"' if current_href == href else ''
    # Rotation 21 rollout: primary row cut to FOUR visitor-word links +
    # More (was six + More). The Desk and Party Pack move into the More
    # panel's Tools group, every destination survives, reachable in one
    # extra click, and both stay linked from every page (VP-0002 guard).
    # VP-0046 (rotation 30): the wordmark is the one home door in the bar;
    # the old "Browse" primary link duplicated it (both -> index.html) and
    # is removed. Every destination Browse named is the wordmark's own.
    # VP-0016 (rotation 21): the duplicate pairs are DECIDED here, not
    # demoted again. Kit (kit.html, builds a whole week) is labelled
    # "Week Kit"; Kit Bag (kitbag.html, packs one day) keeps its name.
    # Party Planner (party.html, party themes) is labelled "Party Themes";
    # Party Pack (partypack.html, packs a whole party) keeps its name.
    # VP-0046 (rotation 30): each planner-cluster label now carries a
    # one-line gloss saying what its surface does, so the look-alike
    # names (Plan my week / Week Kit / Kit Bag / Day Planner / Sub Tub)
    # can be told apart from the menu alone.
    # R47 (CRITIC-001 fixes 2+5, parent ruling 2026-10-15 ~15:11Z): the
    # three duplicate pairs MERGED into one door each - Plan my week
    # (absorbs Day Planner, #day-planner), Kit Bag (absorbs Week Kit,
    # #week-kit), Party Planner (absorbs Party Pack, #party-pack).
    # Retired pages redirect to the merged anchors; nothing deleted.
    # Primary row is now FIVE plain labels.
    links_primary = [
        ("planner.html", "Plan my week", "a week of activities, day by day"),
        ("collections.html", "Collections", None),
        ("kitbag.html", "Kit Bag", "pack one day's bag"),
        ("party.html", "Party Planner", "themes and the full party pack"),
        ("desk.html", "The Desk", "browse the vault by category drawers"),
    ]
    tools = [("sub.html", "Sub Tub", "a ready day a substitute can run"),
             ("fieldtrip.html", "Field Trips", "plan a trip out")]
    seasons = [("halloween.html", "Halloween"), ("thanksgiving.html", "Thanksgiving"),
               ("winter.html", "Winter"), ("spring.html", "Spring"), ("summer.html", "Summer")]
    def glossed(label, gloss):
        return label + (f' <span class="nav-gloss">{gloss}</span>' if gloss else '')
    prim = "\n      ".join(
        f'<a href="{prefix}{h}"{c(prefix + h)}>{glossed(label, gloss)}</a>'
        for h, label, gloss in links_primary)
    tool_links = "\n          ".join(
        f'<a href="{prefix}{h}"{c(prefix + h)}>{glossed(label, gloss)}</a>'
        for h, label, gloss in tools)
    season_links = "\n          ".join(
        f'<a href="{prefix}{h}"{c(prefix + h)}>{label}</a>' for h, label in seasons)
    cls = 'site-header guide-head no-print' if no_print else 'site-header guide-head'
    # VP-0046 (rotation 30): with "Browse" gone, the wordmark carries
    # home's current-location marking (it is the bar's one home door).
    brand_cur = ' aria-current="page"' if current_href == prefix + "index.html" else ''
    # R137 (Field Guide, Aesthetics Round 368): the header takes the
    # graded extraction's form: guide-mark wordmark with its italic sub,
    # plain guide-nav labels (the glosses retire with the costume), the
    # same five primary destinations and the same More panel contents.
    prim_plain = "\n      ".join(
        f'<a href="{prefix}{h}"{c(prefix + h)}>{label}</a>'
        for h, label, gloss in links_primary)
    tool_plain = "\n          ".join(
        f'<a href="{prefix}{h}"{c(prefix + h)}>{label}</a>'
        for h, label, gloss in tools)
    return f"""<header class="{cls}">
  <a class="guide-mark" href="{prefix}index.html"{brand_cur} aria-label="Activity Vault home">
    <span class="gm-name">Activity Vault</span>
    <span class="gm-sub">A field guide for ages 3 to 14</span>
  </a>
  <nav class="guide-nav" aria-label="Primary">
      {prim_plain}
      <details class="nav-more">
        <summary>More</summary>
        <div class="nav-more-panel">
          <p class="nav-more-h">Tools</p>
          {tool_plain}
          <p class="nav-more-h">Seasons</p>
          {season_links}
        </div>
      </details>
    </nav>
</header>"""

def inject_minimal_headers():
    """Rewrite every page's header to the minimal one-row + More form."""
    pages = [n for n in sorted(os.listdir(SITE)) if n.endswith(".html")]
    actdir = os.path.join(SITE, "activity")
    pages += [os.path.join("activity", n) for n in sorted(os.listdir(actdir)) if n.endswith(".html")]
    done = 0
    for rel in pages:
        path = os.path.join(SITE, rel)
        page = open(path).read()
        if rel == "index.html" and "<!--REGISTER:BEGIN-->" in page:
            continue        # the Register home writes its own header
        m = _HEADER_RE.search(page)
        assert m, f"minimal-header: no site header on {rel}"
        old = m.group(0)
        prefix = "../" if rel.startswith("activity" + os.sep) else ""
        cm = _CURRENT_RE.search(old)
        current = (cm.group(1) or cm.group(2)) if cm else None
        if current is None and rel == "index.html":
            # VP-0046: home's current door is the wordmark itself; if a
            # previous header left no marking to preserve, home is it.
            current = "index.html"
        new = _minimal_header(prefix, current, 'no-print' in old.split('>', 1)[0])
        page = page[:m.start()] + new + page[m.end():]
        open(path, "w").write(page)
        done += 1
    return done


# ---------------------------------------------------------------------------
# QA-013 self-hosted type: the generator owns font delivery on EVERY page.
# All faces ship from assets/fonts/ and are declared once in
# assets/style.css. No page may reference an external font host: this
# pass strips any such line wherever it survives (hand-written root
# pages included) and ensures the one display face, Fraunces, is
# preloaded from the page head at the correct depth. Idempotent, in the
# same spirit as inject_site_meta and inject_minimal_headers above, so a
# rebuild can never regress a page back to a CDN font call.
# ---------------------------------------------------------------------------
_GF_HOSTS = ("fonts." "googleapis.com", "fonts." "gstatic.com")
_FONT_EXTERNAL_RE = re.compile(r"[^\n]*(?:" + "|".join(h.replace(".", r"\.") for h in _GF_HOSTS) + r")[^\n]*\n?")
_FONT_PRELOAD_RE = re.compile(r"[^\n]*rel=\"preload\"[^\n]*(?:fraunces|source-serif-4)-latin-var\.woff2[^\n]*\n?")


def inject_font_delivery():
    """Strip external font links and preload the display face everywhere."""
    pages = [n for n in sorted(os.listdir(SITE)) if n.endswith(".html")]
    actdir = os.path.join(SITE, "activity")
    pages += [os.path.join("activity", n) for n in sorted(os.listdir(actdir)) if n.endswith(".html")]
    done = 0
    for rel in pages:
        path = os.path.join(SITE, rel)
        page = open(path).read()
        prefix = "../" if rel.startswith("activity" + os.sep) else ""
        page = _FONT_EXTERNAL_RE.sub("", page)
        page = _FONT_PRELOAD_RE.sub("", page)
        preload = (f'<link rel="preload" href="{prefix}assets/fonts/source-serif-4-latin-var.woff2" '
                   f'as="font" type="font/woff2" crossorigin>\n')
        anchor = f'href="{prefix}assets/style.css">'
        assert anchor in page, f"font delivery: stylesheet link missing on {rel}"
        page = page.replace(anchor, anchor + "\n" + preload.rstrip("\n"), 1)
        fg_anchor = f'href="{prefix}assets/fieldguide.css">'
        if fg_anchor not in page:
            page = page.replace(anchor, anchor + "\n" + f'<link rel="stylesheet" href="{prefix}assets/fieldguide.css">', 1)
        assert all(h not in page for h in _GF_HOSTS), \
            f"font delivery: external font reference survived on {rel}"
        open(path, "w").write(page)
        done += 1
    return done


def load():
    acts = json.load(open(os.path.join(DATA, 'activities.json')))
    cats = json.load(open(os.path.join(DATA, 'categories.json')))
    colls = json.load(open(os.path.join(DATA, 'collections.json')))['collections']
    buckets = json.load(open(os.path.join(DATA, 'balance-buckets.json')))
    return acts, cats, colls, buckets

BUCKET_IDS = ('movement', 'calm', 'creative', 'outdoor', 'mixed')

def validate_balance_buckets(bdata, cats):
    """Wave 10: every category maps to exactly one fixed-vocabulary bucket."""
    errs = []
    cat_ids = {c['id'] for c in cats}
    bdefs = {b['id'] for b in bdata.get('buckets', [])}
    if bdefs != set(BUCKET_IDS):
        errs.append(f"balance-buckets: bucket defs must be exactly {BUCKET_IDS}, got {sorted(bdefs)}")
    seen = set()
    for row in bdata.get('mapping', []):
        cat, bucket = row.get('category'), row.get('bucket')
        if cat in seen:
            errs.append(f"balance-buckets: category '{cat}' mapped twice")
        seen.add(cat)
        if cat not in cat_ids:
            errs.append(f"balance-buckets: '{cat}' is not a real category id")
        if bucket not in BUCKET_IDS:
            errs.append(f"balance-buckets: '{cat}' -> unknown bucket '{bucket}'")
    missing = cat_ids - seen
    if missing:
        errs.append(f"balance-buckets: categories without a bucket: {sorted(missing)}")
    return errs

def validate_collections(colls, acts):
    errs = []
    act_ids = {a['id'] for a in acts}
    seen = set()
    for c in colls:
        tag = c.get('id', '?')
        if tag in seen:
            errs.append(f"collection {tag}: duplicate id")
        seen.add(tag)
        if not ID_RE.match(tag or ''):
            errs.append(f"collection {tag}: bad id format")
        for f in ('title', 'glyph', 'when_to_use', 'picks'):
            if f not in c:
                errs.append(f"collection {tag}: missing field '{f}'")
        n = len(c.get('picks', []))
        if not (8 <= n <= 12):
            errs.append(f"collection {tag}: needs 8-12 picks, has {n}")
        for p in c.get('picks', []):
            if p.get('id') not in act_ids:
                errs.append(f"collection {tag}: pick '{p.get('id')}' is not a real activity id")
            if not (p.get('note') or '').strip():
                errs.append(f"collection {tag}: pick '{p.get('id')}' needs a curator note")
    return errs

def build_collection_records(colls, actmap):
    """Enrich each collection with computed age/time spans across its picks."""
    out = []
    for c in colls:
        picks = c['picks']
        sel = [actmap[p['id']] for p in picks]  # KeyError impossible: validated above
        out.append({
            "id": c["id"], "title": c["title"], "glyph": c["glyph"],
            "when_to_use": c["when_to_use"],
            "picks": [{"activity_id": p["id"], "curator_note": p["note"]} for p in picks],
            "age_span": [min(a["age_min"] for a in sel), max(a["age_max"] for a in sel)],
            "time_span": [min(a["time_min"] for a in sel), max(a["time_max"] for a in sel)],
            "page": f"collections.html#{c['id']}",
        })
    return out
def load_skills():
    """Parse skills/*.md frontmatter -> [{'id', 'description', 'file'}], sorted by id."""
    out = []
    sdir = os.path.join(ROOT, 'skills')
    for fn in sorted(os.listdir(sdir)):
        if not fn.endswith('.md'):
            continue
        text = open(os.path.join(sdir, fn)).read()
        sid, desc = fn[:-3], ''
        if text.startswith('---'):
            end = text.find('---', 3)
            if end != -1:
                for line in text[3:end].splitlines():
                    if ':' in line:
                        k, v = line.split(':', 1)
                        k, v = k.strip(), v.strip()
                        if k == 'name':
                            sid = v
                        elif k == 'description':
                            desc = v
        if not desc:
            for line in text.splitlines():
                line = line.strip()
                if line and not line.startswith('#') and not line.startswith('---'):
                    desc = line
                    break
        out.append({'id': sid, 'description': desc, 'file': 'skills/' + fn})
    return sorted(out, key=lambda s: s['id'])

def source_url_and_label(src):
    """Normalize an activity's source to (url, label).

    Two shapes live in data/activities.json and both are valid:
    a plain URL string (397 records), and a {label, url} object
    (381 records, Asset Foundry source batches R858-R864), where the
    label is the visible attribution text, e.g. "Wikipedia: Spaghetti
    bridge". Returns (None, None) for any other shape so callers can
    reject it instead of guessing."""
    if isinstance(src, str):
        return src, None
    if isinstance(src, dict):
        url = src.get('url')
        label = src.get('label')
        if not (isinstance(label, str) and label.strip()):
            label = None
        return (url if isinstance(url, str) else None), label
    return None, None

def validate(acts, cats):
    errs = []
    cat_ids = {c['id'] for c in cats}
    seen = set()
    for i, a in enumerate(acts):
        tag = a.get('id', f'#{i}')
        for f in REQUIRED:
            if f not in a:
                errs.append(f"{tag}: missing field '{f}'")
        if a.get('id') in seen:
            errs.append(f"{tag}: duplicate id")
        seen.add(a.get('id'))
        if not ID_RE.match(a.get('id','')):
            errs.append(f"{tag}: bad id format")
        for c in a.get('categories', []):
            if c not in cat_ids:
                errs.append(f"{tag}: unknown category '{c}'")
        for loc in a.get('location', []):
            if loc not in ('indoor','outdoor'):
                errs.append(f"{tag}: bad location '{loc}'")
        if not a.get('steps'):
            errs.append(f"{tag}: empty steps")
        v = a.get('variations', {})
        if 'easier' not in v or 'harder' not in v:
            errs.append(f"{tag}: variations needs easier+harder")
        amn, amx = a.get('age_min',0), a.get('age_max',0)
        if not (3 <= amn <= amx <= 18):
            errs.append(f"{tag}: bad age range {amn}-{amx}")
        if a.get('time_min',0) > a.get('time_max',0) or a.get('time_max',0) <= 0:
            errs.append(f"{tag}: bad time range")
        if a.get('group_min',0) > a.get('group_max',0):
            errs.append(f"{tag}: bad group range")
        tags = a.get('tags')
        if tags is not None:
            if not isinstance(tags, list) or not tags:
                errs.append(f"{tag}: tags must be a non-empty list")
            else:
                for t in tags:
                    if t not in TAG_IDS:
                        errs.append(f"{tag}: unknown tag '{t}'")
        src = a.get('source')
        if src is not None:
            # Both source shapes are valid (see source_url_and_label):
            # a plain URL string, or a {label, url} object whose url
            # member must be an http(s) URL and whose label, when
            # present, must be a non-empty string.
            _src_url, _src_label = source_url_and_label(src)
            if _src_url is None or not (_src_url.startswith('http://')
                                         or _src_url.startswith('https://')):
                errs.append(f"{tag}: source must be an http(s) URL")
            elif isinstance(src, dict) and 'label' in src and _src_label is None:
                errs.append(f"{tag}: source label must be a non-empty string")
        ph = a.get('photo')
        if ph is not None:
            if not isinstance(ph, dict) or not all(isinstance(ph.get(k), str) and ph[k] for k in ('file', 'alt', 'caption', 'credit', 'licence', 'source_url')):
                errs.append(f"{tag}: photo needs file, alt, caption, credit, licence, source_url")
            elif not os.path.exists(os.path.join(ROOT, 'assets', 'photos', ph['file'])):
                errs.append(f"{tag}: photo file missing: assets/photos/{ph['file']}")
            elif not ph['source_url'].startswith('http'):
                errs.append(f"{tag}: photo source_url must be an http(s) URL")
        for bf in ('copy_free', 'no_elimination'):
            if bf in a and not isinstance(a[bf], bool):
                errs.append(f"{tag}: {bf} must be boolean")
        for sf in ('why_it_works', 'inclusion'):
            if sf in a and not isinstance(a[sf], str):
                errs.append(f"{tag}: {sf} must be a string")
    return errs

ACTIVITY_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{name} · Activity Vault</title>
<meta name="description" content="{tagline}">
<link rel="stylesheet" href="../assets/style.css">
<link rel="preload" href="../assets/fonts/fraunces-latin-var.woff2" as="font" type="font/woff2" crossorigin>
</head>
<body>
<a class="skip-link" href="#main">Skip to activity</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="../index.html" aria-label="Activity Vault home">
      <span class="brand-mark" aria-hidden="true">🗂️</span>
      <span class="brand-text">Activity <strong>Vault</strong></span>
    </a>
    <nav aria-label="Primary">
      <a href="../index.html">Browse</a>
      <a href="../desk.html">The Desk</a>
      <a href="../planner.html">Plan my week</a>
      <a href="../planner.html#day-planner">Day Planner 🗓️</a>
      <a href="../kitbag.html#week-kit">Week Kit 🧰</a>
      <a href="../kitbag.html">Kit Bag 🎒</a>
      <a href="../party.html#party-pack">Party Pack 🎉</a>
      <a href="../collections.html">Collections 📚</a>
    </nav>
    <nav aria-label="More tools and seasons" class="nav-secondary">
      <a href="../sub.html">Sub Tub 🆘</a>
      <a href="../party.html">Party Planner 🎉</a>
      <a href="../fieldtrip.html">Field Trips 🚌</a>
      <span class="nav-div" aria-hidden="true">·</span>
      <a href="../halloween.html">Halloween 🎃</a>
      <a href="../thanksgiving.html">Thanksgiving 🦃</a>
      <a href="../winter.html">Winter ❄️</a>
      <a href="../spring.html">Spring 🌷</a>
      <a href="../summer.html">Summer ☀️</a>
    </nav>
  </div>
</header>
<main id="main" class="wrap activity-page">
  <p class="crumbs no-print"><a href="../index.html">← All activities</a> · <a href="../index.html?cats={crumb_cat}">{crumb_cat_name}</a></p>
  <article class="activity-card print-card" style="--cat:{cat_color}" aria-labelledby="act-title">
    <span class="file-stamp" aria-hidden="true">Filed &#10003;</span>
    <div class="cat-chips">{chips}</div>
    {badges}
    <h1 id="act-title">{name}</h1>
    <p class="tagline">{tagline}</p>
    <h2 class="fact-rail-h" id="h-facts">Before you begin</h2>
    <dl class="fact-grid" aria-labelledby="h-facts">
      <div><dt>Ages</dt><dd>{age_min}–{age_max}</dd></div>
      <div><dt>Group</dt><dd>{group_min}–{group_max} kids</dd></div>
      <div><dt>Time</dt><dd>{time_min}–{time_max} min</dd></div>
      <div><dt>Where</dt><dd>{location}</dd></div>
      <div><dt>Prep</dt><dd>{prep}</dd></div>
    </dl>
    {photo_block}
    <section aria-labelledby="h-setup">
      <h2 id="h-setup">Setup</h2>
      <p>{setup}</p>
    </section>
    <section aria-labelledby="h-materials">
      <h2 id="h-materials">Materials</h2>
      <ul>{materials}</ul>
    </section>
    <section aria-labelledby="h-steps">
      <h2 id="h-steps">Steps</h2>
      <ol>{steps}</ol>
    </section>
    <section aria-labelledby="h-var">
      <h2 id="h-var">Variations</h2>
      <p><strong>Easier:</strong> {easier}</p>
      <p><strong>Harder:</strong> {harder}</p>
    </section>
    {safety_block}
    {source_block}
    {why_block}
    {inclusion_block}
    <section class="rate-box no-print" aria-labelledby="h-rate">
      <h2 id="h-rate">Tried this? Rate it</h2>
      <p class="rate-privacy">Your ratings live in <strong>this browser only</strong>. Nobody else can see them. There are no community ratings here; every star on this card is yours.</p>
      <details class="disclosure rate-disclosure">
      <summary>Rate this activity, add a note, or write a reflection</summary>
      <form id="rate-form">
        <fieldset class="star-field">
          <legend>Your rating (1 to 5 stars)</legend>
          <div class="stars">
            <label class="star"><input type="radio" name="av-rate" value="1" aria-label="1 star"><span class="star-glyph" aria-hidden="true">★</span></label>
            <label class="star"><input type="radio" name="av-rate" value="2" aria-label="2 stars"><span class="star-glyph" aria-hidden="true">★</span></label>
            <label class="star"><input type="radio" name="av-rate" value="3" aria-label="3 stars"><span class="star-glyph" aria-hidden="true">★</span></label>
            <label class="star"><input type="radio" name="av-rate" value="4" aria-label="4 stars"><span class="star-glyph" aria-hidden="true">★</span></label>
            <label class="star"><input type="radio" name="av-rate" value="5" aria-label="5 stars"><span class="star-glyph" aria-hidden="true">★</span></label>
          </div>
        </fieldset>
        <div class="rate-note-row">
          <label for="rate-note">One-line note (optional)</label>
          <input type="text" id="rate-note" maxlength="140" placeholder="e.g. Huge hit with the 4th graders">
        </div>
        <p class="rate-btns">
          <button class="btn btn-small" id="rate-save" type="submit">Save rating</button>
          <button class="btn btn-small btn-ghost" id="rate-clear" type="button" hidden>Clear my rating</button>
        </p>
        <p class="copy-status" id="rate-status" role="status" aria-live="polite"></p>
      </form>
      <div id="rate-reflect" hidden>
        <h3>Quick reflection</h3>
        <p class="rate-privacy">Optional, saved with your rating, and exported with "Copy my week".</p>
        <div class="reflect-row">
          <label for="reflect-change">What would you change next time?</label>
          <input type="text" id="reflect-change" maxlength="280">
        </div>
        <div class="reflect-row">
          <label for="reflect-age_band">Which age band shone the most?</label>
          <input type="text" id="reflect-age_band" maxlength="280">
        </div>
        <div class="reflect-row">
          <label for="reflect-again">Would you run it again? <span class="hint">(yes / with tweaks / no)</span></label>
          <input type="text" id="reflect-again" maxlength="280">
        </div>
        <p class="copy-status" id="reflect-status" role="status" aria-live="polite"></p>
      </div>
      </details>
    </section>
    <div class="print-actions no-print">
      <button type="button" class="btn" onclick="window.print()">🖨️ Print this card</button>
      <button type="button" class="btn btn-ghost" id="copy-card-link">🔗 Copy card link</button>
      <span class="copy-status" id="copy-card-status" role="status" aria-live="polite"></span>
      <a class="btn btn-ghost" href="../planner.html">Add to my week →</a>
    </div>
    <p class="print-only print-url">Full activity card, <span class="print-url-here"></span></p>
  </article>
  {related_block}
</main>
<footer class="site-footer no-print">
  <div class="wrap"><p>Activity Vault, the all-in-one activity archive for teachers &amp; after-school programs.</p></div>
</footer>
<script>
(function(){{'use strict';
function absUrl(){{try{{return new URL('.',document.baseURI).href;}}catch(e){{return location.href;}}}}
var here=document.querySelector('.print-url-here');
if(here){{here.textContent=location.href;}}
function flash(msg){{var s=document.getElementById('copy-card-status');s.textContent=msg;
setTimeout(function(){{s.textContent='';}},2500);}}
function fallbackCopy(text){{var ta=document.createElement('textarea');ta.value=text;
ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();
try{{document.execCommand('copy');flash('Copied ✓');}}catch(e){{flash('Copy failed, copy the URL manually.');}}
document.body.removeChild(ta);}}
var btn=document.getElementById('copy-card-link');
if(btn){{btn.addEventListener('click',function(){{
var url=absUrl();
if(navigator.clipboard&&navigator.clipboard.writeText){{navigator.clipboard.writeText(url).then(function(){{flash('Copied ✓');}},function(){{fallbackCopy(url);}});}}
else{{fallbackCopy(url);}}
}});}}
}})();
</script>
<script src="../assets/ratings.js"></script>
<script src="../assets/site.js" defer></script>
<script>
(function(){{'use strict';
/* Personal rating widget, stars + note + reflection, localStorage only. */
var R=window.VaultRatings;
var ACT_ID=(location.pathname.split('/').pop()||'').replace(new RegExp('[.]html$','i'),'');
if(!R||!/^[a-z0-9-]+$/.test(ACT_ID)){{return;}}
var form=document.getElementById('rate-form');
if(!form){{return;}}
var statusEl=document.getElementById('rate-status');
var reflectBox=document.getElementById('rate-reflect');
var reflectStatus=document.getElementById('reflect-status');
var clearBtn=document.getElementById('rate-clear');
function flash(msg){{statusEl.textContent=msg;setTimeout(function(){{if(statusEl.textContent===msg){{statusEl.textContent='';}}}},4000);}}
function val(id){{var e=document.getElementById(id);return e?e.value.trim():'';}}
function paint(entry){{
  var radios=form.querySelectorAll('input[name="av-rate"]');
  Array.prototype.forEach.call(radios,function(r){{
    r.checked=!!entry&&parseInt(r.value,10)===entry.stars;
  }});
  form.querySelector('.stars').setAttribute('data-fill',entry?entry.stars:0);
  document.getElementById('rate-note').value=entry?entry.note:'';
  R.REFLECTIONS.forEach(function(q){{
    var inp=document.getElementById('reflect-'+q.id);
    if(inp){{inp.value=entry&&entry.reflections?entry.reflections[q.id]||'':'';}}
  }});
  reflectBox.hidden=!entry;
  clearBtn.hidden=!entry;
}}
function currentEntry(){{
  var checked=form.querySelector('input[name="av-rate"]:checked');
  var prev=R.getRating(ACT_ID);
  var stars=checked?parseInt(checked.value,10):(prev?prev.stars:null);
  return{{
    stars:stars,
    note:document.getElementById('rate-note').value.trim(),
    reflections:{{change:val('reflect-change'),age_band:val('reflect-age_band'),again:val('reflect-again')}}
  }};
}}
function persist(entry,msg){{
  if(!entry.stars){{return;}}
  if(R.setRating(ACT_ID,entry)){{paint(R.getRating(ACT_ID));flash(msg);}}
  else{{flash('Could not save. Is private browsing blocking storage?');}}
}}
form.addEventListener('submit',function(ev){{
  ev.preventDefault();
  var e=currentEntry();
  if(!e.stars){{flash('Pick 1\u20135 stars first.');return;}}
  persist(e,'Saved. You rated this '+e.stars+' of 5 stars. Your ratings stay in this browser.');
}});
Array.prototype.forEach.call(form.querySelectorAll('input[name="av-rate"]'),function(r){{
  /* Native radio group: arrow keys move, Enter/Space selects, no custom key handling. */
  r.addEventListener('change',function(){{
    var e=currentEntry();
    persist(e,'Saved, '+e.stars+' of 5 stars. Ratings stay in this browser.');
  }});
}});
document.getElementById('rate-note').addEventListener('change',function(){{
  var e=currentEntry();
  if(!e.stars&&!R.getRating(ACT_ID)){{flash('Pick 1\u20135 stars first. The note saves with your rating.');return;}}
  persist(e,'Note saved with your '+e.stars+'-star rating.');
}});
var rt=null;
reflectBox.addEventListener('input',function(){{
  clearTimeout(rt);
  rt=setTimeout(function(){{
    var prev=R.getRating(ACT_ID);
    if(!prev){{return;}}
    var e=currentEntry();
    if(R.setRating(ACT_ID,e)){{reflectStatus.textContent='Reflection saved.';setTimeout(function(){{reflectStatus.textContent='';}},2500);}}
  }},600);
}});
clearBtn.addEventListener('click',function(){{R.clearRating(ACT_ID);paint(null);flash('Rating cleared.');}});
paint(R.getRating(ACT_ID));
}})();
</script>
</body>
</html>
"""

def esc(s):
    return html.escape(str(s), quote=True)

def related_activities(a, acts, n=3):
    """Cross-linking (wave 14 nav audit): same primary category first,
    age overlap preferred, no-prep preferred. Always returns up to n."""
    def overlap(x):
        return x['age_min'] <= a['age_max'] and x['age_max'] >= a['age_min']
    primary = a['categories'][0] if a['categories'] else None
    cands = [x for x in acts
             if x['id'] != a['id'] and x['categories'] and x['categories'][0] == primary]
    scored = sorted(cands, key=lambda x: (
        0 if overlap(x) else 1,
        -len(set(x['categories']) & set(a['categories'])),
        0 if x['no_prep'] else 1,
        x['id']))
    picks = [x for x in scored if overlap(x)][:n]
    for x in scored:
        if len(picks) >= n:
            break
        if x not in picks:
            picks.append(x)
    return picks[:n]

# ---------------------------------------------------------------------------
# Wave B, Scout review queue page (human-in-the-loop READ surface).
# Pre-rendered from the same normalized data that publishes data/v1/review-queue.json
# (spec §3.1: the page ships with static data baked in; fetchWithFallback swaps in
# live data on load). Approve/reject stays server-only: POST /api/review-decide is
# CRON_SECRET-gated and is NEVER called from the browser (secret never in the page).
# ---------------------------------------------------------------------------

REVIEW_CLIENT_JS = """(function () {
  'use strict';
  // DOM-built rendering (textContent throughout, no HTML string escaping issues,
  // and no anchor-markup fragments in the source for the link checker to trip on).
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined && txt !== null) e.textContent = txt;
    return e;
  }
  function disp(s) { return (s || '').replace(/ \u2013 /g, ' \u00b7 '); }
  function fmtDay(iso) {
    try { return new Date(iso).toISOString().slice(0, 10); }
    catch (e) { return iso || '(no date)'; }
  }
  function card(c) {
    var li = el('li', 'queue-card');
    li.appendChild(el('h3', null, disp(c.title) || 'untitled'));
    var meta = el('p', 'qmeta');
    meta.appendChild(el('code', null, c.id || ''));
    var bits = [];
    if (c.feed) bits.push(c.feed);
    if (c.published) bits.push('published ' + c.published);
    if (c.detected_at) bits.push('detected ' + fmtDay(c.detected_at));
    if (bits.length) meta.appendChild(document.createTextNode(' \\u00b7 ' + bits.join(' \\u00b7 ')));
    li.appendChild(meta);
    if (c.summary) li.appendChild(el('p', 'qsummary', disp(c.summary)));
    if (c.note) li.appendChild(el('p', 'qnote', c.note));
    var tg = el('div', null);
    (c.suggested_tags || []).forEach(function (t) { tg.appendChild(el('span', 'tag-pill', t)); });
    li.appendChild(tg);
    if (c.source_url) {
      var p = el('p', 'qactions');
      var a = el('a', null, 'source post \\u2197');
      a.setAttribute('href', c.source_url);
      a.setAttribute('rel', 'noopener');
      p.appendChild(a);
      li.appendChild(p);
    }
    return li;
  }
  function decidedRow(d) {
    var tr = document.createElement('tr');
    tr.appendChild(el('td', null, fmtDay(d.decided_at)));
    tr.appendChild(el('td', null, disp(d.title)));
    var decCell = document.createElement('td');
    decCell.appendChild(el('span', d.decision === 'approve' ? 'dec-approve' : 'dec-reject',
      d.decision === 'approve' ? 'approved' : 'rejected'));
    tr.appendChild(decCell);
    var actCell = document.createElement('td');
    if (d.activity_id) {
      var a = el('a', null, d.activity_id);
      a.setAttribute('href', 'activity/' + d.activity_id + '.html');
      actCell.appendChild(a);
    } else { actCell.textContent = 'none'; }
    tr.appendChild(actCell);
    tr.appendChild(el('td', null, d.note || ''));
    return tr;
  }
  function countsLine(data) {
    var c = data.counts || {};
    return (c.pending || 0) + ' pending \\u00b7 ' + (c.decided_90d || 0) + ' decided (last 90 days)';
  }
  function renderPending(list, container) {
    container.textContent = '';
    if (!list.length) {
      container.appendChild(el('div', 'queue-empty',
        'The queue is clear, nothing awaiting review. \\U0001f33f'));
      return;
    }
    var ul = el('ul', 'queue-list');
    list.forEach(function (c) { ul.appendChild(card(c)); });
    container.appendChild(ul);
  }
  function renderDecided(rows, container) {
    container.textContent = '';
    if (!rows.length) {
      container.appendChild(el('p', 'qmeta', 'No decisions in the last 90 days.'));
      return;
    }
    var wrap = el('div', 'table-wrap');
    var table = el('table', 'decided-table');
    var thead = document.createElement('thead');
    var hr = document.createElement('tr');
    ['Decided', 'Candidate', 'Decision', 'Adapted as', 'Note'].forEach(function (h) {
      var th = document.createElement('th');
      th.setAttribute('scope', 'col');
      th.textContent = h;
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');
    rows.forEach(function (d) { tbody.appendChild(decidedRow(d)); });
    table.appendChild(tbody);
    wrap.appendChild(table);
    container.appendChild(wrap);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var qBadge = document.getElementById('queue-badge');
    var qList = document.getElementById('queue-list');
    var qCounts = document.getElementById('queue-counts');
    var dBadge = document.getElementById('decided-badge');
    var dBody = document.getElementById('decided-list');
    // Round 2 (Claude consult 2026-10-24): a plain static server (the
    // local preview route) has no /api functions, so the two live
    // fetches 404ed before the fallback ran. On a file/localhost
    // origin, go straight to the published static JSON: no 404
    // requests, and the badge honestly says cached. On the deployed
    // site the live-first contract below is unchanged.
    var host = location.hostname || '';
    var staticOnly = location.protocol === 'file:' ||
      host === 'localhost' || host === '127.0.0.1' || host === '::1';
    if (staticOnly) {
      function cached(badge) {
        if (!badge) return;
        badge.dataset.apiState = 'cached';
        badge.textContent = 'cached';
        badge.title = 'Static preview: showing the last published data.';
      }
      fetch('data/v1/review-queue.json').then(function (r) { return r.json(); })
        .then(function (j) {
          cached(qBadge);
          renderPending(j.candidates || [], qList);
          if (qCounts) qCounts.textContent = countsLine(j);
        }).catch(function () { cached(qBadge); });
      fetch('data/v1/decided.json').then(function (r) { return r.json(); })
        .then(function (j) {
          cached(dBadge);
          renderDecided(j.decisions || j.candidates || [], dBody);
        }).catch(function () { cached(dBadge); });
      return;
    }
    if (!window.ApiClient) return; // api-client.js failed to load. Pre-rendered content stays
    window.ApiClient.fetchWithFallback('/api/review-queue', 'data/v1/review-queue.json', { badgeEl: qBadge })
      .then(function (r) {
        if (!r.data) return;
        renderPending(r.data.candidates || [], qList);
        if (qCounts) qCounts.textContent = countsLine(r.data);
      });
    window.ApiClient.fetchWithFallback('/api/review-queue?status=decided', 'data/v1/decided.json', { badgeEl: dBadge })
      .then(function (r) {
        if (!r.data) return;
        renderDecided(r.data.decisions || r.data.candidates || [], dBody);
      });
  });
})();"""

REVIEW_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Scout review queue · Activity Vault</title>
<meta name="description" content="The Scout's human-in-the-loop review queue: activity ideas the RSS watch found, waiting for a human to adapt them into original words.">
<link rel="stylesheet" href="assets/style.css">
<link rel="preload" href="assets/fonts/fraunces-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<script src="assets/site.js" defer></script>
<script src="assets/js/api-client.js" defer></script>
</head>
<body>
<a class="skip-link" href="#queue">Skip to the review queue</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="index.html" aria-label="Activity Vault home">
      <span class="brand-mark" aria-hidden="true">🗂️</span>
      <span class="brand-text">Activity <strong>Vault</strong></span>
    </a>
    <nav aria-label="Primary">
      <a href="index.html">Browse</a>
      <a href="desk.html">The Desk</a>
      <a href="planner.html">Plan my week</a>
      <a href="planner.html#day-planner">Day Planner 🗓️</a>
      <a href="kitbag.html#week-kit">Week Kit 🧰</a>
      <a href="kitbag.html">Kit Bag 🎒</a>
      <a href="party.html#party-pack">Party Pack 🎉</a>
      <a href="collections.html">Collections 📚</a>
    </nav>
    <nav aria-label="More tools and seasons" class="nav-secondary">
      <a href="sub.html">Sub Tub 🆘</a>
      <a href="party.html">Party Planner 🎉</a>
      <a href="fieldtrip.html">Field Trips 🚌</a>
      <span class="nav-div" aria-hidden="true">·</span>
      <a href="halloween.html">Halloween 🎃</a>
      <a href="thanksgiving.html">Thanksgiving 🦃</a>
      <a href="winter.html">Winter ❄️</a>
      <a href="spring.html">Spring 🌷</a>
      <a href="summer.html">Summer ☀️</a>
    </nav>
  </div>
</header>

<main class="wrap docs-page">
  <div class="review-head">
    <div>
      <h1 id="queue">Scout review queue</h1>
      <p class="lede">Ideas the Scout's RSS watch flagged, each waits for a human to adapt it
      into original words before it can enter the Vault (PIPELINE.md).</p>
    </div>
    <span class="api-badge" id="queue-badge" data-api-state="waking"
          role="status" aria-live="polite" tabindex="0">waking server…</span>
  </div>
  <p class="qmeta" id="queue-counts">{pre_counts} · snapshot {gen_at}</p>
  <div id="queue-list">{pre_pending}</div>

  <section aria-labelledby="h-decided">
    <div class="review-head">
      <h2 id="h-decided">Decided (last 90 days)</h2>
      <span class="api-badge" id="decided-badge" data-api-state="waking"
            role="status" aria-live="polite" tabindex="0">waking server…</span>
    </div>
    <div id="decided-list">{pre_decided}</div>
  </section>

  <section aria-labelledby="h-admin" class="no-print">
    <h2 id="h-admin">Approve / reject</h2>
    <div class="review-admin-note">
      <p><strong>Read-only here.</strong> Approve and reject are server-side operations:
      they need the <code>CRON_SECRET</code> bearer token, which never goes in a browser
      page or a URL. To decide, use the secret from the vault operator's shell:</p>
      <p><code>curl -X POST "$SITE/api/review-decide" \\<br>
      -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" \\<br>
      -d '{{"id":"&lt;candidate id&gt;","decision":"approve","note":"&lt;optional&gt;"}}'</code></p>
      <p>Approvals record <code>approved_via:'scout'</code> on the decision; the human's wave
      adds the real activity in original words, nothing auto-publishes.</p>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="wrap">
    <p><strong>Activity Vault</strong>, the all-in-one activity archive for teachers &amp; after-school programs. All activities are classic, public-domain concepts described in our own words.</p>
    <p><a href="data/v1/activities.json">API</a> · <a href="api.html">API docs &amp; console</a> · <a href="review.html">Scout review queue</a> · <a href="llms.txt">llms.txt</a> · <a href="AGENT.md">Agent guide</a></p>
  </div>
</footer>
<script>
{client_js}
</script>
</body>
</html>
"""


def _display_quote(s):
    """Display normalization for QUOTED third-party text (Scout feed
    titles and summaries): storage in pipeline/review-queue.json stays
    byte-true; on the rendered page a spaced en dash used as a title
    separator is shown as a middot. Our own copy never passes through
    here, it was swept at source."""
    return (s or '').replace(' \u2013 ', ' \u00b7 ')


def _review_card(c):
    meta = f'<code>{esc(c["id"])}</code>'
    if c.get('feed'):
        meta += f' · {esc(c["feed"])}'
    if c.get('published'):
        meta += f' · published {esc(c["published"])}'
    if c.get('detected_at'):
        meta += f' · detected {esc(c["detected_at"][:10])}'
    note = f'<p class="qnote">{esc(c["note"])}</p>' if c.get('note') else ''
    src = (f'<p class="qactions"><a href="{esc(c["source_url"])}" rel="noopener">source post ↗</a></p>'
           if c.get('source_url') else '')
    tags = ''.join(f'<span class="tag-pill">{esc(t)}</span>' for t in (c.get('suggested_tags') or []))
    return (f'<li class="queue-card"><h3>{esc(_display_quote(c["title"]))}</h3>'
            f'<p class="qmeta">{meta}</p>'
            f'<p class="qsummary">{esc(_display_quote(c.get("summary") or ""))}</p>'
            f'{note}<div>{tags}</div>{src}</li>')


def _review_decided_rows(decisions):
    rows = []
    for d in decisions:
        dec = ('<span class="dec-approve">approved</span>' if d.get('decision') == 'approve'
               else '<span class="dec-reject">rejected</span>')
        act = (f'<a href="activity/{esc(d["activity_id"])}.html">{esc(d["activity_id"])}</a>'
               if d.get('activity_id') else ', ')
        day = esc((d.get('decided_at') or '')[:10])
        rows.append(
            f'<tr><td>{day}</td><td>{esc(_display_quote(d.get("title") or ""))}</td><td>{dec}</td>'
            f'<td>{act}</td><td>{esc(d.get("note") or "")}</td></tr>')
    return rows


def render_review(open_candidates, decisions, gen_at):
    """Render review.html: pre-rendered queue + decided log + live-swap JS."""
    pending = [c for c in open_candidates if c.get('status') == 'pending']
    counts = (f'{len(pending)} pending · {len(decisions)} decided (last 90 days)')
    if pending:
        pre_pending = '<ul class="queue-list">' + ''.join(_review_card(c) for c in pending) + '</ul>'
    else:
        pre_pending = ('<div class="queue-empty">The queue is clear, nothing awaiting review. 🌿</div>')
    if decisions:
        rows = _review_decided_rows(decisions)
        pre_decided = ('<div class="table-wrap"><table class="decided-table">'
                       '<thead><tr><th scope="col">Decided</th><th scope="col">Candidate</th>'
                       '<th scope="col">Decision</th><th scope="col">Adapted as</th>'
                       '<th scope="col">Note</th></tr></thead>'
                       f'<tbody>{"".join(rows)}</tbody></table></div>')
    else:
        pre_decided = '<p class="qmeta">No decisions in the last 90 days.</p>'
    return REVIEW_TEMPLATE.format(
        pre_counts=esc(counts), gen_at=esc(gen_at),
        pre_pending=pre_pending, pre_decided=pre_decided,
        client_js=REVIEW_CLIENT_JS)


def render_activity(a, catmap, acts):
    chips = ''.join(
        f'<span class="chip" style="--cat:{catmap[c]["color"]}"><span class="chip-dot" aria-hidden="true"></span>{esc(catmap[c]["name"])}</span>'
        for c in a['categories'])
    tagchips = ''.join(
        f'<span class="chip tag-chip">{esc(TAG_LABELS.get(t, t))}</span>'
        for t in a.get('tags', []))
    badges = ''
    if a.get('copy_free'):
        badges += '<span class="chip tag-chip">Copy-free</span>'
    if a.get('no_elimination'):
        badges += '<span class="chip tag-chip">No elimination</span>'
    badges = f'<div class="cat-chips">{badges}</div>' if badges else ''
    mats = ''.join(f'<li>{esc(m["item"])}</li>' for m in a['materials'])
    if not a['materials']:
        mats = '<li><em>No materials needed.</em></li>'
    steps = ''.join(f'<li>{esc(s)}</li>' for s in a['steps'])
    safety = ''
    if a.get('safety'):
        safety = ('<section class="safety" aria-labelledby="h-safety">'
                  f'<h2 id="h-safety">Safety</h2><p>{esc(a["safety"])}</p></section>')
    source = ''
    if a.get('source'):
        # String sources keep the exact rendering they have always had.
        # Object sources ({label, url}) link to the url with the label
        # itself as the visible link text, so the richer attribution
        # the Foundry batches recorded is what the reader sees.
        _src_url, _src_label = source_url_and_label(a['source'])
        _host = urlparse(_src_url).netloc.removeprefix('www.')
        if _src_label:
            _label = f'Source: <a href="{esc(_src_url)}" rel="noopener">{esc(_src_label)}</a>'
        elif 'wikipedia.org' in _host:
            _label = f'Source: <a href="{esc(_src_url)}" rel="noopener">Wikipedia, {_host}</a>'
        else:
            _label = f'Source: <a href="{esc(_src_url)}" rel="noopener">source post at {_host}</a>, adapted in our own words'
        source = f'<p class="source-line">{_label}</p>'
    else:
        # Round 2 (Claude consult 2026-10-24): honest empty state. A page
        # with no source must say so, never look finished when it is not.
        source = '<p class="provenance">Source: not listed yet.</p>'
    prep = 'No prep needed' if a['no_prep'] else 'Some prep needed'
    loc = ' & '.join('Indoors' if l=='indoor' else 'Outdoors' for l in a['location'])
    why_block = ''
    if a.get('why_it_works'):
        why_block = ('<section aria-labelledby="h-why">'
                     f'<h2 id="h-why">Why it works</h2><p>{esc(a["why_it_works"])}</p></section>')
    inclusion_block = ''
    if a.get('inclusion'):
        inclusion_block = ('<section aria-labelledby="h-inclusion">'
                           f'<h2 id="h-inclusion">Inclusion notes</h2><p>{esc(a["inclusion"])}</p></section>')
    related = related_activities(a, acts)
    related_block = ''
    if related:
        items = ''.join(
            f'<li class="pick"><div class="pick-row">'
            f'<a class="pick-name" href="{r["id"]}.html">{esc(r["name"])}</a></div>'
            f'<p class="pick-facts">Ages {r["age_min"]}–{r["age_max"]} · '
            f'{r["time_min"]}–{r["time_max"]} min · '
            f'{len(r["materials"])} materials</p>'
            f'<p class="pick-note">{esc(r["tagline"])}</p></li>'
            for r in related)
        primary_name = esc(catmap[a['categories'][0]]['name']) if a['categories'] else 'activities'
        related_block = (
            '<section class="collection-section no-print" aria-labelledby="h-related">'
            '<div class="collection-head">'
            f'<h2 class="collection-h2" id="h-related">Related {primary_name.lower()}</h2></div>'
            f'<details class="disclosure related-disclosure"><summary>See the related activities</summary>'
            f'<ol class="pick-list">{items}</ol></details></section>')
    crumb_cat = a['categories'][0] if a['categories'] else ''
    crumb_cat_name = esc(catmap[crumb_cat]['name']) if crumb_cat else 'All'
    photo_block = ''
    _ph = _photo_for(a)
    if _ph:
        _credit = esc(_ph["credit"])
        if _ph.get("source_url"):
            _credit += f' <a href="{esc(_ph["source_url"])}" rel="noopener">Photo source</a>'
        photo_block = (
            f'<figure class="activity-photo cover-photo no-print">'
            f'<img src="../assets/photos/{esc(_ph["file"])}"{_plate_srcset(_ph["file"], "../")} alt="{esc(_ph["alt"])}" loading="lazy" style="view-transition-name: plate-{a["id"]}">'
            f'<figcaption>{esc(_ph.get("caption", ""))} '
            f'<span class="photo-credit">{_credit}</span></figcaption></figure>')
    else:
        # Round 2: honest empty state where the photo figure goes.
        # Bundle 2026-10-24 step 3: the empty state asks for help,
        # with a prefilled GitHub issue link.
        photo_block = ('<figure class="activity-photo activity-photo--empty no-print">'
                       '<p>No photo yet. <a href="' + esc(_photo_issue_url(a)) +
                       '" rel="noopener">Help us find one</a></p></figure>')
    mats_fact = (f'{len(a["materials"])} material' + ('s' if len(a["materials"]) != 1 else '')
                 ) if a["materials"] else 'no materials'
    return ACTIVITY_TEMPLATE.format(
        cat_color=catmap[a['categories'][0]]['color'] if a['categories'] else '#b7413c',
        materials_fact=mats_fact,
        photo_block=photo_block,
        name=esc(a['name']), tagline=esc(a['tagline']),
        chips=chips + tagchips, badges=badges,
        crumb_cat=crumb_cat, crumb_cat_name=crumb_cat_name,
        age_min=a['age_min'], age_max=a['age_max'],
        group_min=a['group_min'], group_max=a['group_max'],
        time_min=a['time_min'], time_max=a['time_max'],
        location=loc, prep=prep, setup=esc(a['setup']),
        materials=mats, steps=steps,
        easier=esc(a['variations']['easier']), harder=esc(a['variations']['harder']),
        why_block=why_block, inclusion_block=inclusion_block,
        related_block=related_block,
        safety_block=safety, source_block=source)

# ---------------------------------------------------------------------------
# Wave 21, "The Desk": the archive as a physical teacher's desk.
# desk.html renders 11 wooden drawers (one per category), each with a brass
# label holder, a hand-written pencil note carrying REAL build-computed
# counts (research rule 191: grease-pencil marginalia), and a tray holding
# the 6 cards "on top of the pile", curator-picked first, then no-prep,
# then alphabetical (stable, honest). The tray footer deep-links to the
# working filter page (index.html?cats=<id>, the wave-14 deep-link
# mechanism), so every drawer is a real doorway, not a diorama.
# No-JS: trays render open (full content). desk.js collapses them and
# wires the brass pulls (aria-expanded); calm mode + prefers-reduced-motion
# kill the card cascade/stamp animations via the global rules, content stays.
# ---------------------------------------------------------------------------
def desk_drawers_html(acts, cats, colls):
    """Build the 11 wooden drawer fronts + trays. Shared by desk.html and the
    landing-desk injection into index.html (wave 23: the archive landing
    becomes a desk you can open). Returns (left_html, right_html)."""
    actmap = {a['id']: a for a in acts}
    picked_ids = {p['id'] for c in colls for p in c['picks']}
    by_cat = {}
    for a in acts:
        by_cat.setdefault(a['categories'][0], []).append(a)

    def drawer_picks(cat_id):
        cands = by_cat.get(cat_id, [])
        cands = sorted(cands, key=lambda a: (
            0 if a['id'] in picked_ids else 1,
            0 if a['no_prep'] else 1,
            a['id']))
        return cands[:6]

    drawers = []
    for i, c in enumerate(cats):
        cid = c['id']
        cands = by_cat.get(cid, [])
        assert cands, f"desk: category has no activities: {cid}"
        total = len(cands)
        noprep = sum(1 for a in cands if a['no_prep'])
        picks = drawer_picks(cid)
        assert len(picks) == 6 or total < 6, f"desk: short tray: {cid}"
        assert all(p['id'] in actmap for p in picks), f"desk: pick not in actmap: {cid}"
        cards = []
        for j, a in enumerate(picks):
            meta = (f"Ages {a['age_min']}\u2013{a['age_max']} \u00b7 "
                    f"{a['time_min']}\u2013{a['time_max']} min \u00b7 "
                    f"{a['group_min']}\u2013{a['group_max']} kids")
            cards.append(
                f'<li class="desk-card" style="--i:{j}">'
                f'<a class="desk-card-name" href="activity/{a["id"]}.html">{esc(a["name"])}</a>'
                f'<p class="desk-card-tag">{esc(a["tagline"])}</p>'
                f'<p class="desk-card-meta">{meta}</p></li>')
        rest = total - len(picks)
        foot = (f'\u2026and {rest} more cards in this drawer, '
                f'<a href="index.html?cats={cid}#browse">Open the full drawer \u2192</a>') if rest > 0 else ''
        num = f"DRAWER {i + 1:02d}"
        drawers.append(
            f'<div class="drawer" data-drawer="{cid}">'
            f'<button class="drawer-pull" id="pull-{cid}" aria-expanded="false" aria-controls="tray-{cid}">'
            f'<span class="drawer-num" aria-hidden="true">{num}</span>'
            f'<span class="drawer-label"><span class="drawer-stamp" style="--cat:{c["color"]}">'
            f'<span aria-hidden="true">{c["glyph"]}</span> {esc(c["name"])}</span></span>'
            f'<span class="drawer-handle" aria-hidden="true"><span class="pull-bar"></span></span>'
            f'<span class="pencil-note">{total} cards \u00b7 {noprep} no-prep</span>'
            f'<span class="visually-hidden">Open the {esc(c["name"])} drawer</span>'
            f'</button>'
            f'<div class="drawer-tray" id="tray-{cid}" role="region" aria-labelledby="pull-{cid}">'
            f'<p class="tray-head"><span class="tray-label">On top of the pile</span> '
            f'<span class="pulled-stamp" aria-hidden="true">Pulled \u2713</span></p>'
            f'<ul class="tray-cards">{"".join(cards)}</ul>'
            f'<p class="tray-foot">{foot}</p>'
            f'</div></div>')

    left = '\n'.join(drawers[:6])
    right = '\n'.join(drawers[6:])
    return left, right


# ---------------------------------------------------------------------------
# Rotation 21 identity pass (ACTIVITY-STUDY section 4.1): the home opens
# with the calendar, then the verb doors, then ONE season band. The desk
# grid and the three-stat strip do not survive on the home; counts live
# in prose (the colophon strip in index.html) and in row marginalia.
# Occasion dates are real calendar facts: fixed feasts by month/day,
# movable feasts by rule (Thanksgiving, MLK Day, Easter computus) or by
# a named per-year table (Diwali, Hanukkah, Lunar New Year). Counts are
# computed from the activities' own tags at build time.
# ---------------------------------------------------------------------------
def _nth_weekday(year, month, weekday, n):
    """The nth weekday (Mon=0) of a month, as a date."""
    first = date(year, month, 1)
    delta = (weekday - first.weekday()) % 7
    return date(year, month, 1 + delta + 7 * (n - 1))


def _easter(year):
    """Gregorian computus, anonymous algorithm."""
    a, b, c = year % 19, year // 100, year % 100
    d, e = b // 4, b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i, k = c // 4, c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = ((h + l - 7 * m + 114) % 31) + 1
    return date(year, month, day)


_MOVABLE = {  # (month, day) by year, for feasts with no short rule
    # R137 (AV4, Aesthetics Round 368): the whole table rechecked. The
    # 2026 entries had carried 2025's dates (Diwali Oct 20, Hanukkah
    # Dec 15); corrected values verified 2026-10-23: Diwali (main day)
    # 2026 Nov 8, 2027 Oct 29, 2028 Oct 17, 2029 Nov 5; Hanukkah begins
    # at sunset 2026 Dec 4, 2027 Dec 24, 2028 Dec 12, 2029 Dec 1 (the
    # table stores the sunset-start date). Lunar New Year verified
    # correct as it stood.
    'holiday:diwali': {2026: (11, 8), 2027: (10, 29), 2028: (10, 17), 2029: (11, 5)},
    'holiday:hanukkah': {2026: (12, 4), 2027: (12, 24), 2028: (12, 12), 2029: (12, 1)},
    'holiday:lunar-new-year': {2026: (2, 17), 2027: (2, 6), 2028: (1, 26), 2029: (2, 13)},
}

_OCCASIONS = [  # (name, tag) in the planner's vocabulary
    ("Diwali", "holiday:diwali"),
    ("Halloween", "holiday:halloween"),
    ("Day of the Dead", "holiday:dia-de-muertos"),
    ("Thanksgiving", "holiday:thanksgiving"),
    ("Hanukkah", "holiday:hanukkah"),
    ("Christmas", "holiday:christmas"),
    ("New Year", "holiday:new-year"),
    ("Martin Luther King Jr. Day", "holiday:mlk-day"),
    ("Valentine's Day", "holiday:valentines-day"),
    ("Lunar New Year", "holiday:lunar-new-year"),
    ("St. Patrick's Day", "holiday:st-patricks-day"),
    ("Easter", "holiday:easter"),
    ("Earth Day", "holiday:earth-day"),
    ("July 4th", "holiday:july-4th"),
    ("Indigenous Peoples' Day", "holiday:indigenous-peoples-day"),
]

_FIXED = {
    "holiday:halloween": (10, 31), "holiday:dia-de-muertos": (11, 2),
    "holiday:christmas": (12, 25), "holiday:new-year": (1, 1),
    "holiday:valentines-day": (2, 14), "holiday:st-patricks-day": (3, 17),
    "holiday:earth-day": (4, 22), "holiday:july-4th": (7, 4),
}


def _occasion_date(tag, year):
    if tag in _MOVABLE:
        md = _MOVABLE[tag].get(year)
        return date(year, md[0], md[1]) if md else None
    if tag == "holiday:thanksgiving":
        return _nth_weekday(year, 11, 3, 4)  # fourth Thursday of November
    if tag == "holiday:mlk-day":
        return _nth_weekday(year, 1, 0, 3)  # third Monday of January
    if tag == "holiday:indigenous-peoples-day":
        return _nth_weekday(year, 10, 0, 2)  # second Monday of October
    if tag == "holiday:easter":
        return _easter(year)
    md = _FIXED.get(tag)
    return date(year, md[0], md[1]) if md else None


def _next_occasions(acts, today, n=9):
    counts = {}
    for a in acts:
        for t in a.get('tags', []):
            counts[t] = counts.get(t, 0) + 1
    out = []
    for name, tag in _OCCASIONS:
        for year in (today.year, today.year + 1):
            d = _occasion_date(tag, year)
            if d and d >= today:
                out.append((d, name, tag, counts.get(tag, 0)))
                break
    out.sort(key=lambda r: r[0])
    return out[:n]


_CONTENTS = [  # Rotation 23: the almanac contents. Ruled, numbered lines,
    # one word each, in the season colour only. No glyphs, no cards.
    ("Make", "crafts"), ("Play", "pe-movement"), ("Celebrate", "holidays"),
    ("Learn", "stem"), ("Calm", "quiet-focus"),
]

_SEASON_BANDS = {  # month -> season name (the current issue)
    12: "Winter", 1: "Winter", 2: "Winter",
    3: "Spring", 4: "Spring", 5: "Spring",
    6: "Summer", 7: "Summer", 8: "Summer",
    9: "Fall", 10: "Fall", 11: "Fall",
}

_SEASON_SYSTEM = {  # Rotation 23: one colour per season, and it is the only
    # colour doing work while that season is on screen.
    "Winter": ("#38607c", "winter.html", "season:winter"),
    "Spring": ("#2e7d46", "spring.html", "season:spring"),
    "Summer": ("#a86a08", "summer.html", "season:summer"),
    "Fall": ("#b7413c", "halloween.html", "season:fall"),
}
_SEASON_ORDER = ["Spring", "Summer", "Fall", "Winter"]


def _photo_for(a):
    """An activity's photo record: the data-carried photo (rotation 23)
    first, then the legacy Foundry batch wired in ACTIVITY_PHOTOS."""
    if a.get("photo"):
        return a["photo"]
    legacy = ACTIVITY_PHOTOS.get(a["id"])
    if legacy:
        return {"file": legacy["file"], "alt": legacy["alt"],
                "caption": legacy["caption"], "credit": legacy["credit"],
                "licence": "", "source_url": ""}
    return None


def _plate_srcset(photo_file, prefix):
    """srcset for a plate photo (bundle 2026-10-24 step 1): the
    480/960 WebP variants written by scripts/plate_images.py.
    DEVIATION: the brief asked for AVIF; this environment's Pillow
    has no AVIF encoder, so variants are WebP with the same srcset
    shape and the original .webp stays as the fallback src.
    Only variants that exist on disk are advertised."""
    stem = photo_file[:-len('.webp')] if photo_file.endswith('.webp') else photo_file
    parts = []
    for w in (480, 960):
        rel = f"{stem}-{w}.webp"
        if os.path.exists(os.path.join(ROOT, 'assets', 'photos', rel)):
            parts.append(f"{prefix}assets/photos/{rel} {w}w")
    return ' srcset="' + ', '.join(parts) + '" sizes="(max-width: 40rem) 92vw, 480px"' if parts else ''


def _photo_issue_url(a):
    """Prefilled GitHub issue asking for a photo for a photo-less
    activity (bundle 2026-10-24 step 3)."""
    title = f"Photo needed: {a['name']} ({a['id']})"
    body = (f"Activity: {a['name']} (activity/{a['id']}.html) has no photo yet.\n\n"
            "A usable photo needs: a public-domain or CC0 / CC BY / CC BY-SA "
            "source page (Wikimedia Commons is ideal), the author name and "
            "the exact licence, copied from the source page.")
    return ("https://github.com/astercast/activity-vault/issues/new"
            f"?title={_urlquote(title)}&body={_urlquote(body)}")


def _cover_for(acts, season_tag, occasion_tag):
    """The issue cover: a real, sourced photograph. Prefer a photo whose
    activity is filed under the current season or the next occasion;
    fall back to the first photo-carrying activity, by id, so the
    choice is stable across rebuilds."""
    cands = [a for a in acts if _photo_for(a)]
    if not cands:
        return None
    fresh = [a for a in cands if a.get("photo")]
    if fresh:
        cands = fresh
    # Cover-grade preference, by season: real photographs of the season's
    # own subjects, chosen at this build. (Fall, October 2026: a child
    # bowling with a pumpkin beats every still life in the file.)
    _COVER_PREFS = {
        "season:fall": ["pumpkin-bowling", "papel-picado-banners",
                        "build-a-scarecrow", "corn-husk-dolls"],
        "season:winter": ["winter-bird-feeder", "paper-snowflakes"],
        "season:spring": ["seed-starter-cups", "three-sisters-garden-plan"],
        "season:summer": ["kite-flying", "water-balloon-toss"],
    }
    by_id = {a["id"]: a for a in cands}
    for pid in _COVER_PREFS.get(season_tag, []):
        if pid in by_id:
            return by_id[pid]
    for pref_tags in ((occasion_tag,), (season_tag,)):
        hits = [a for a in cands if any(t in a.get("tags", []) for t in pref_tags)]
        if hits:
            return sorted(hits, key=lambda a: a["id"])[0]
    return sorted(cands, key=lambda a: a["id"])[0]


def render_home_identity(acts, cats, colls):
    """Rotation 23: the year as issues. The current season is the cover:
    its one colour, the day count to the next occasion set huge in
    Fraunces, a real photograph as the cover, the calendar as ruled
    rows with Fraunces day numerals, and Contents as ruled, numbered
    lines (the five emoji cards are deleted). Spliced into index.html
    between the BUILD:DESK markers."""
    today = date.today()
    season = _SEASON_BANDS[today.month]
    season_color, season_hub, season_tag = _SEASON_SYSTEM[season]
    upcoming = _next_occasions(acts, today)
    d0, occ_name, occ_tag, occ_count = upcoming[0]
    days0 = (d0 - today).days
    # VP-0046 (rotation 30): one label, one destination. An occasion that
    # has its own hub page (Halloween, Thanksgiving) is linked to that hub
    # everywhere its name appears, never to a tagged browse view in one
    # place and the hub in another. Occasions without a hub keep the
    # tagged browse view as their only destination.
    _HUB_FOR_TAG = {"holiday:halloween": "halloween.html",
                    "holiday:thanksgiving": "thanksgiving.html"}
    def occasion_href(tag):
        return _HUB_FOR_TAG.get(tag, f"index.html?tag={tag}#browse")
    rows = []
    for d, name, tag, count in upcoming:
        days = (d - today).days
        if days == 0:
            when = '<span class="cal-days">today</span>'
        elif days == 1:
            when = '<span class="cal-days"><span class="cal-num">1</span> day</span>'
        else:
            when = f'<span class="cal-days"><span class="cal-num">{days}</span> days</span>'
        rows.append(
            f'      <li class="cal-row" data-date="{d.isoformat()}">'
            f'<a class="cal-name" href="{occasion_href(tag)}">{esc(name)}</a>'
            f'<span class="cal-date">{d.strftime("%a %b %-d")}</span>'
            f'<span class="cal-count">{count} activities</span>'
            f'{when}</li>')
    cat_counts = {}
    for a in acts:
        for c in a["categories"]:
            cat_counts[c] = cat_counts.get(c, 0) + 1
    contents = []
    for i, (word, cid) in enumerate(_CONTENTS, 1):
        contents.append(
            f'      <li><a class="contents-line" href="index.html?cats={cid}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{cat_counts.get(cid, 0)} activities</span></a></li>')
    tag_counts = {}
    for a in acts:
        for t in a.get("tags", []):
            tag_counts[t] = tag_counts.get(t, 0) + 1
    issues = []
    for i, sname in enumerate(_SEASON_ORDER, 1):
        _, shub, stag = _SEASON_SYSTEM[sname]
        # VP-0046 (rotation 30): Fall has no hub page of its own, and its
        # old entry borrowed Halloween's hub. The Fall issue entry now
        # leads to the Fall surface itself: the directory filtered to
        # the fall filing. Other seasons keep their hub pages.
        if sname == "Fall":
            shub = f"index.html?tag={stag}#browse"
        cur = ' <span class="contents-current">the current issue</span>' if sname == season else ''
        issues.append(
            f'      <li><a class="contents-line" href="{shub}">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{sname}</span>'
            f'<span class="contents-count">{tag_counts.get(stag, 0)} activities filed{cur}</span></a></li>')
    # R115 headline (ruling 10c): the where-led twin of the intent-led
    # grouping. Every activity carries a location list (indoor/outdoor);
    # the home Contents gains a By where pair of shelves whose counts are
    # computed here from the library itself. 153 activities work in both
    # places and sit on both shelves; the note under the shelves says so,
    # and carries one planning line scoped to the where.
    loc_counts = {}
    for a in acts:
        for l in a.get("location", []):
            loc_counts[l] = loc_counts.get(l, 0) + 1
    both_count = sum(1 for a in acts if len(set(a.get("location", []))) > 1)
    indoors_only = loc_counts.get("indoor", 0) - both_count
    wheres = []
    for i, (word, lkey) in enumerate([("Indoors", "indoor"), ("Outdoors", "outdoor")], 1):
        wheres.append(
            f'      <li><a class="contents-line" href="index.html?loc={lkey}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{loc_counts.get(lkey, 0)} activities</span></a></li>')
    where_note = (
        f'    <p class="contents-note">Counted from the library itself. '
        f'{both_count} activities work in both places, so they sit on both '
        f'shelves. The overlap is on purpose. Good to know: {indoors_only} '
        f'never need to go outside, so a rained-out day is still a full day.</p>\n')
    # R116 headline (ruling 10c): the time-led twin of the By where
    # shelves. The browse's own Time available filter matches an
    # activity when its shortest run (time_min) fits the minutes picked,
    # so each shelf's count is exactly what its ?time= link delivers:
    # activities whose time_min is at or under the shelf's minutes.
    time_counts = {}
    for cap in (15, 30):
        time_counts[cap] = sum(1 for a in acts if a.get("time_min", 9999) <= cap)
    between_count = time_counts[30] - time_counts[15]
    times = []
    for i, (word, cap) in enumerate([("15 minutes or less", 15), ("30 minutes or less", 30)], 1):
        times.append(
            f'      <li><a class="contents-line" href="index.html?time={cap}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{time_counts[cap]} activities</span></a></li>')
    time_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'each activity\'s shortest run. Every 15-minute activity also '
        f'sits on the 30-minute shelf, and {between_count} more fit '
        f'between 16 and 30 minutes. Good to know: {time_counts[30]} of '
        f'{len(acts)} activities fit in half an hour, so a short gap in '
        f'the day is still a full choice.</p>\n')
    # R117 headline (ruling 10c): the group-led twin of the By where /
    # By time shelves. The browse's own Group size filter matches an
    # activity when the picked size falls inside its group range
    # (group_min..group_max), so each shelf's count is exactly what its
    # ?group= link delivers: activities whose range covers the size the
    # Group size select names (8 for Small, 25 for Large).
    group_counts = {}
    for size in (8, 25):
        group_counts[size] = sum(
            1 for a in acts
            if a.get("group_min", 9999) <= size <= a.get("group_max", 0))
    both_group = sum(
        1 for a in acts
        if a.get("group_min", 9999) <= 8 and a.get("group_max", 0) >= 25)
    huge_count = sum(
        1 for a in acts
        if a.get("group_min", 9999) <= 40 <= a.get("group_max", 0))
    groups = []
    for i, (word, size) in enumerate(
            [("Small (2–8 kids)", 8), ("Large (17–25 kids)", 25)], 1):
        groups.append(
            f'      <li><a class="contents-line" href="index.html?group={size}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{group_counts[size]} activities</span></a></li>')
    group_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'the group sizes each activity can take. {both_group} activities '
        f'fit both a small group and a large one, so they sit on both '
        f'shelves. Good to know: {huge_count} activities can stretch to '
        f'40 kids, so the whole program in one room still has a '
        f'choice.</p>\n')
    # R118 headline (ruling 10c): the age-led twin of the By where /
    # By time / By group shelves. The browse's own Age filter matches
    # an activity when the picked age falls inside its age range
    # (age_min..age_max), so each shelf's count is exactly what its
    # ?age= link delivers: activities whose range covers the age the
    # shelf names (5 for the little kids, 11 for the older ones).
    age_counts = {}
    for age in (5, 11):
        age_counts[age] = sum(
            1 for a in acts
            if a.get("age_min", 9999) <= age <= a.get("age_max", 0))
    both_age = sum(
        1 for a in acts
        if a.get("age_min", 9999) <= 5 and a.get("age_max", 0) >= 11)
    ages = []
    for i, (word, age) in enumerate(
            [("5-year-olds", 5), ("11-year-olds", 11)], 1):
        ages.append(
            f'      <li><a class="contents-line" href="index.html?age={age}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{age_counts[age]} activities</span></a></li>')
    age_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'the ages each activity is written for. {both_age} activities '
        f'fit both a 5-year-old and an 11-year-old, so they sit on both '
        f'shelves. Good to know: a mixed-age group still has those '
        f'{both_age} to choose from, little kids and big kids in the '
        f'same room.</p>\n')
    # R119 headline (ruling 10c): the first Contents-family GUIDANCE
    # surface — the "Ready to run" shelves. The earlier Contents twins
    # group the library by what the visitor brings (where, time, group,
    # age); these group it by what the activity asks of the visitor
    # before it can start, which is the browse's own three verified
    # "only" toggles: no_prep ("Only no-prep"), copy_free ("Copy-free
    # only", verified zero printing) and no_elimination
    # ("No-elimination only"). Each shelf's count is exactly what its
    # ?ready= link delivers, because the browse matches those toggles
    # on the same three fields.
    ready_counts = {
        "noprep": sum(1 for a in acts if a.get("no_prep")),
        "copyfree": sum(1 for a in acts if a.get("copy_free")),
        "noelim": sum(1 for a in acts if a.get("no_elimination")),
    }
    ready_all = sum(
        1 for a in acts
        if a.get("no_prep") and a.get("copy_free") and a.get("no_elimination"))
    readys = []
    for i, (word, key) in enumerate(
            [("No prep needed", "noprep"), ("Nothing to print", "copyfree"),
             ("No one sits out", "noelim")], 1):
        readys.append(
            f'      <li><a class="contents-line" href="index.html?ready={key}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{ready_counts[key]} activities</span></a></li>')
    ready_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'what each activity asks of you before it starts. Good to know: '
        f'{ready_all} activities need no prep, print nothing, and sit no '
        f'one out, so they are ready the minute you are.</p>\n')
    # R120 headline (ruling 10c): the second Contents-family GUIDANCE
    # surface — the "By kit" shelves, the twin of Ready to run. Ready
    # to run groups the library by what an activity asks of you before
    # it starts; these group it by what you have to gather first,
    # counted from each activity's own materials list. The browse's
    # Kit to gather filter matches an activity when its materials
    # count is at or under the cap picked, so each shelf's count is
    # exactly what its ?kit= link delivers.
    kit_counts = {}
    for cap in (0, 2, 3):
        kit_counts[cap] = sum(1 for a in acts if len(a.get("materials", [])) <= cap)
    kit_five = sum(1 for a in acts if len(a.get("materials", [])) <= 5)
    kits = []
    for i, (word, cap) in enumerate(
            [("Nothing to gather", 0), ("Two things or fewer", 2),
             ("Three things or fewer", 3)], 1):
        kits.append(
            f'      <li><a class="contents-line" href="index.html?kit={cap}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{kit_counts[cap]} activities</span></a></li>')
    kit_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'how much each activity asks you to gather first. Every '
        f'nothing-to-gather activity also sits on the other two shelves. '
        f'Good to know: {kit_counts[0]} activities need nothing gathered '
        f'at all, and {kit_five} need five things or fewer, so an empty '
        f'cupboard is rarely the end of the day.</p>\n')
    # R121 headline (ruling 10c): the third Contents-family GUIDANCE
    # surface — the "By length" shelves, the long-run twin of By time.
    # By time groups the library by each activity's shortest run (what
    # fits the minutes you have); these group it by each activity's
    # longest run (what can fill the stretch you have), counted from
    # time_max. The browse's Can run for filter matches an activity
    # when its longest run is at or over the minutes picked, so each
    # shelf's count is exactly what its ?long= link delivers.
    length_counts = {}
    for cap in (30, 45, 60):
        length_counts[cap] = sum(1 for a in acts if a.get("time_max", 0) >= cap)
    lengths = []
    for i, (word, cap) in enumerate(
            [("Runs 30 minutes or more", 30), ("Runs 45 minutes or more", 45),
             ("Runs an hour or more", 60)], 1):
        lengths.append(
            f'      <li><a class="contents-line" href="index.html?long={cap}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{length_counts[cap]} activities</span></a></li>')
    length_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'each activity\'s longest run. Every hour-long activity also '
        f'sits on the other two shelves. Good to know: {length_counts[60]} '
        f'activities can fill a whole hour, and {length_counts[30]} can '
        f'fill half an hour or more, so a long open stretch in the day '
        f'is covered too.</p>\n')
    # R122 headline (ruling 10c): the fourth Contents-family GUIDANCE
    # surface — the "By stretch" shelves, the window twin of By time
    # and By length. By time groups the library by each activity's
    # shortest run and By length by its longest run; these group it
    # by the window between the two (time_max - time_min), which is
    # what a leader whose timing slips needs: how far the activity
    # itself can stretch or shrink. The browse's Can stretch by
    # filter matches an activity when its window is at or over the
    # minutes picked, so each shelf's count is exactly what its
    # ?stretch= link delivers.
    stretch_counts = {}
    for cap in (10, 15, 20):
        stretch_counts[cap] = sum(
            1 for a in acts
            if a.get("time_max", 0) - a.get("time_min", 0) >= cap)
    stretch_half = sum(
        1 for a in acts
        if a.get("time_max", 0) - a.get("time_min", 0) >= 30)
    stretches = []
    for i, (word, cap) in enumerate(
            [("Stretches 10 minutes or more", 10),
             ("Stretches 15 minutes or more", 15),
             ("Stretches 20 minutes or more", 20)], 1):
        stretches.append(
            f'      <li><a class="contents-line" href="index.html?stretch={cap}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{stretch_counts[cap]} activities</span></a></li>')
    stretch_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'the window between each activity\'s shortest and longest run. '
        f'Every 20-minute stretcher also sits on the other two shelves. '
        f'Good to know: {stretch_counts[15]} activities can stretch by '
        f'15 minutes or more, and {stretch_half} can stretch by a whole '
        f'half hour, so a plan that slips still holds.</p>\n')
    # R123 headline (ruling 10c): the fifth Contents-family GUIDANCE
    # surface — the "By flex" shelves, the group-window twin of By
    # stretch. By group groups the library by the group size you
    # bring; these group it by the window between each activity's
    # smallest and largest group (group_max - group_min), which is
    # what a leader whose group size changes needs: how far the
    # activity itself can flex when half the class is out, or two
    # classes join into one. The browse's Can flex by filter matches
    # an activity when its group window is at or over the count
    # picked, so each shelf's count is exactly what its ?flex=
    # link delivers.
    flex_counts = {}
    for cap in (20, 25, 30):
        flex_counts[cap] = sum(
            1 for a in acts
            if a.get("group_max", 0) - a.get("group_min", 0) >= cap)
    flex_wide = sum(
        1 for a in acts
        if a.get("group_max", 0) - a.get("group_min", 0) >= 35)
    flexes = []
    for i, (word, cap) in enumerate(
            [("Flexes 20 kids or more", 20),
             ("Flexes 25 kids or more", 25),
             ("Flexes 30 kids or more", 30)], 1):
        flexes.append(
            f'      <li><a class="contents-line" href="index.html?flex={cap}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{flex_counts[cap]} activities</span></a></li>')
    flex_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'the window between each activity\'s smallest and largest group. '
        f'Every 30-kid flexer also sits on the other two shelves. '
        f'Good to know: {flex_counts[25]} activities can flex by '
        f'25 kids or more, and {flex_wide} can flex by 35 kids or '
        f'more, so a group that shrinks or doubles still fits.</p>\n')
    # R124 headline (ruling 10c): the sixth Contents-family GUIDANCE
    # surface — the "By span" shelves, the age-window twin of By
    # stretch and By flex. By age groups the library by the age you
    # bring; these group it by the window between each activity's
    # youngest and oldest age (age_max - age_min), which is what a
    # leader with a mixed-age room needs: how wide an age range the
    # activity itself can hold. The browse's Can span by filter
    # matches an activity when its age window is at or over the
    # years picked, so each shelf's count is exactly what its
    # ?span= link delivers.
    span_counts = {}
    for cap in (5, 6, 7):
        span_counts[cap] = sum(
            1 for a in acts
            if a.get("age_max", 0) - a.get("age_min", 0) >= cap)
    span_wide = sum(
        1 for a in acts
        if a.get("age_max", 0) - a.get("age_min", 0) >= 8)
    spans = []
    for i, (word, cap) in enumerate(
            [("Spans 5 years or more", 5),
             ("Spans 6 years or more", 6),
             ("Spans 7 years or more", 7)], 1):
        spans.append(
            f'      <li><a class="contents-line" href="index.html?span={cap}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{span_counts[cap]} activities</span></a></li>')
    span_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'the window between each activity\'s youngest and oldest age. '
        f'Every 7-year spanner also sits on the other two shelves. '
        f'Good to know: {span_counts[6]} activities can span '
        f'6 years or more, and {span_wide} can span 8 years or '
        f'more, so one room of little kids and big kids still fits.</p>\n')
    # R125 headline (ruling 10c): the seventh Contents-family GUIDANCE
    # surface — the "By start" shelves, the start-point twin of By
    # age and By span. By age groups the library by an age inside
    # each activity's window and By span by the window's width;
    # these group it by the window's start (age_min), which is what
    # a leader with a very young group needs first: what can my
    # youngest kids join at all. The browse's Starts at filter
    # matches an activity when its youngest age is at or under the
    # years picked, so each shelf's count is exactly what its
    # ?start= link delivers.
    start_counts = {}
    for cap in (4, 5, 6):
        start_counts[cap] = sum(
            1 for a in acts
            if a.get("age_min", 9999) <= cap)
    start_youngest = sum(
        1 for a in acts
        if a.get("age_min", 9999) <= 3)
    starts = []
    for i, (word, cap) in enumerate(
            [("Starts at 4 or younger", 4),
             ("Starts at 5 or younger", 5),
             ("Starts at 6 or younger", 6)], 1):
        starts.append(
            f'      <li><a class="contents-line" href="index.html?start={cap}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{start_counts[cap]} activities</span></a></li>')
    start_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'the youngest age each activity starts at. Every activity that '
        f'starts at 4 or younger also sits on the other two shelves. '
        f'Good to know: {start_counts[5]} activities start at '
        f'5 or younger, and {start_youngest} start at 3 or '
        f'younger, so even the youngest group in the building has '
        f'a real choice.</p>\n')
    # R126 headline (ruling 10c): the eighth Contents-family GUIDANCE
    # surface — the "By end" shelves, the end-point twin of By start.
    # By start groups the library by where each activity's age window
    # begins (age_min) and By span by the window's width; these group
    # it by the window's end (age_max), which is what a leader with
    # older kids needs first: what still holds my oldest kids. The
    # browse's Ends at filter matches an activity when its oldest age
    # is at or over the years picked, so each shelf's count is exactly
    # what its ?end= link delivers. It is also the age-side twin of
    # By length (R121), which does the same for time_max.
    end_counts = {}
    for cap in (10, 12, 14):
        end_counts[cap] = sum(
            1 for a in acts
            if a.get("age_max", 0) >= cap)
    ends = []
    for i, (word, cap) in enumerate(
            [("Ends at 10 or older", 10),
             ("Ends at 12 or older", 12),
             ("Ends at 14", 14)], 1):
        ends.append(
            f'      <li><a class="contents-line" href="index.html?end={cap}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{end_counts[cap]} activities</span></a></li>')
    end_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'the oldest age each activity ends at. Every activity that ends '
        f'at 14 also sits on the other two shelves. '
        f'Good to know: {end_counts[12]} activities end at '
        f'12 or older, and {end_counts[14]} end at 14, so even '
        f'the oldest group in the building has a real choice.</p>\n')
    # R127 headline (ruling 10c): the ninth Contents-family GUIDANCE
    # surface — the "By floor" shelves, the group-side twin of By
    # start. By start groups the library by the youngest age each
    # activity starts at (age_min); these group it by the smallest
    # group each activity starts with (group_min), which is what a
    # leader with only a few kids in the room asks first: what can
    # start small. The browse's Starts with filter matches an
    # activity when its smallest group is at or under the kids
    # picked, so each shelf's count is exactly what its ?floor=
    # link delivers. It is also the floor twin of By flex (R123),
    # which reads the same group window's width.
    floor_counts = {}
    for cap in (2, 4, 6):
        floor_counts[cap] = sum(
            1 for a in acts
            if a.get("group_min", 9999) <= cap)
    floor_solo = sum(
        1 for a in acts
        if a.get("group_min", 9999) <= 1)
    floors = []
    for i, (word, cap) in enumerate(
            [("Starts with 2 or fewer", 2),
             ("Starts with 4 or fewer", 4),
             ("Starts with 6 or fewer", 6)], 1):
        floors.append(
            f'      <li><a class="contents-line" href="index.html?floor={cap}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{floor_counts[cap]} activities</span></a></li>')
    floor_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'the smallest group each activity starts with. Every activity '
        f'that starts with 2 or fewer also sits on the other two '
        f'shelves. Good to know: {floor_counts[4]} activities start '
        f'with 4 or fewer, and {floor_solo} start with just '
        f'1 kid, so a nearly empty room still has a real choice.</p>\n')
    # R128 headline (ruling 10c): the tenth Contents-family GUIDANCE
    # surface — the "By ceiling" shelves, the group-side twin of By
    # floor. By floor groups the library by the smallest group each
    # activity starts with (group_min); these group it by the largest
    # group each activity can hold (group_max), which is what a
    # leader with a whole class in the room asks first: what still
    # fits everyone. The browse's Fits filter matches an activity
    # when its largest group is at or over the kids picked, so each
    # shelf's count is exactly what its ?ceiling= link delivers. It
    # is also the ceiling twin of By end (R126), which does the same
    # for age_max.
    ceiling_counts = {}
    for cap in (10, 20, 30):
        ceiling_counts[cap] = sum(
            1 for a in acts
            if a.get("group_max", 0) >= cap)
    ceiling_big = sum(
        1 for a in acts
        if a.get("group_max", 0) >= 60)
    ceilings = []
    for i, (word, cap) in enumerate(
            [("Fits 10 or more", 10),
             ("Fits 20 or more", 20),
             ("Fits 30 or more", 30)], 1):
        ceilings.append(
            f'      <li><a class="contents-line" href="index.html?ceiling={cap}#browse">'
            f'<span class="contents-num">{i:02d}</span>'
            f'<span class="contents-word">{word}</span>'
            f'<span class="contents-count">{ceiling_counts[cap]} activities</span></a></li>')
    ceiling_note = (
        f'    <p class="contents-note">Counted from the library itself, by '
        f'the largest group each activity can hold. Every activity '
        f'that fits 30 or more also sits on the other two '
        f'shelves. Good to know: {ceiling_counts[20]} activities fit '
        f'20 or more, and {ceiling_big} fit 60, so even '
        f'the biggest group in the building has a real choice.</p>\n')
    # R137 (Field Guide, Aesthetics Round 368): the five doors become a
    # ruled key list. Door name, one line, the generated count line, and
    # a small credited photo thumbnail. Plate then key, never two
    # plates or two lists back to back.
    _DOORS = [
        ("01", "Plan my week", "planner.html",
         "A week of activities, day by day.",
         f"Dealt from all {len(acts)} activities", "parachute-popcorn"),
        ("02", "Collections", "collections.html",
         "Teacher-ready bundles for the moments that matter.",
         f"{len(colls)} bundles, every pick with a curator's note",
         "seed-library-opening-day"),
        ("03", "Kit Bag", "kitbag.html",
         "Pack one day's bag.",
         "One whole rainy day, indoors, with its kit list",
         "blanket-fort-book-nook"),
        ("04", "Party Planner", "party.html",
         "Themes and the full party pack.",
         "A timed station plan for your class party", "dragon-parade"),
        ("05", "The Desk", "desk.html",
         "Browse the vault by category drawers.",
         f"{len(acts)} activities in {len(cats)} drawers",
         "one-sheet-zine-workshop"),
    ]
    by_id_all = {a["id"]: a for a in acts}
    door_items = []
    for num, dname, href, promise, count_line, pid in _DOORS:
        rec = by_id_all[pid]
        ph = _photo_for(rec)
        credit = esc(ph["credit"])
        if ph.get("source_url"):
            credit += f' <a href="{esc(ph["source_url"])}" rel="noopener">Photo source</a>'
        door_items.append(
            f'      <li class="key-row">'
            f'<a class="key-thumb" href="activity/{pid}.html" tabindex="-1">'
            f'<img src="assets/photos/{esc(ph["file"])}" alt="" loading="lazy"></a>'
            f'<span class="key-main"><a class="key-name" href="{href}">{dname}</a>'
            f'<span class="key-line">{promise}</span>'
            f'<span class="key-count">{count_line}</span>'
            f'<span class="key-credit">Photo from <a href="activity/{pid}.html">{esc(rec["name"])}</a>. {credit}</span></span></li>')
    doors_html = (
        '  <section class="doors-section key-list" aria-labelledby="doors-h">\n'
        '    <h2 id="doors-h">The five doors</h2>\n'
        '    <p class="doors-line">Five ways in. Pick the one that matches the day you have.</p>\n'
        '    <ol class="keys">\n' + '\n'.join(door_items) + '\n    </ol>\n'
        '  </section>\n'
    )
    cover = _cover_for(acts, season_tag, occ_tag)
    cover_html = ''
    if cover:
        ph = _photo_for(cover)
        # Herbarium label pieces: the data credit reads "Photo: X,
        # <licence>, via Wikimedia Commons"; the label states Photo,
        # Licence and Source as its own rows.
        credit_text = ph.get("credit", "")
        photo_who = credit_text
        if photo_who.startswith("Photo: "):
            photo_who = photo_who[len("Photo: "):]
        for suffix in (f', {ph.get("licence", "")}, via Wikimedia Commons',
                       f', {ph.get("licence", "")}', ', via Wikimedia Commons'):
            if suffix and photo_who.endswith(suffix):
                photo_who = photo_who[:-len(suffix)]
                break
        marks = ph.get("marks") or []
        mark_spans = ''.join(
            f'<span class="mark" style="--x:{m["x"]}; --y:{m["y"]}; --i:{i}" aria-hidden="true">{i + 1}</span>'
            for i, m in enumerate(marks))
        key_items = ''.join(
            f'<li style="--x:{m["x"]}; --y:{m["y"]}">{esc(m["label"])}</li>'
            for m in marks)
        marks_html = ''
        if marks:
            marks_html = (f'<div class="specimen-frame">'
                          f'<img src="assets/photos/{esc(ph["file"])}"{_plate_srcset(ph["file"], "")} alt="{esc(ph["alt"])}" width="960" height="1438" fetchpriority="high" style="view-transition-name: plate-{cover["id"]}">'
                          f'{mark_spans}</div>'
                          f'<ol class="marks-key" aria-label="Field marks in the photo">{key_items}</ol>')
        else:
            marks_html = (f'<div class="specimen-frame">'
                          f'<img src="assets/photos/{esc(ph["file"])}"{_plate_srcset(ph["file"], "")} alt="{esc(ph["alt"])}" width="960" height="1438" fetchpriority="high" style="view-transition-name: plate-{cover["id"]}"></div>')
        source_html = esc(ph.get("source_url", ""))
        source_name = "Wikimedia Commons" if "wikimedia.org" in source_html or "commons.wikimedia" in source_html else "Source"
        locs = cover.get("location", [])
        where = " and ".join(w.capitalize() + "s" for w in locs) if locs else ""
        turns_row = ('<div><dt>Turns</dt><dd>Nobody sits out</dd></div>'
                     if cover.get("no_elimination") else '')
        cover_html = (
            f'  <section class="plate" aria-labelledby="plate-h">\n'
            f'    <p class="plate-no">Plate 1 &middot; In season: <span data-season-name>{season}</span></p>\n'
            f'    <h2 class="plate-name" id="plate-h"><a href="activity/{cover["id"]}.html">{esc(cover["name"])}</a></h2>\n'
            f'    <p class="plate-binomial">{esc(cover.get("tagline", ""))}</p>\n'
            f'    <figure class="specimen">\n'
            f'      <div class="specimen-body">\n        {marks_html}\n      </div>\n'
            f'      <figcaption class="herbarium">'
            f'<span class="hb-row"><span class="hb-k">Photo</span><span>{esc(photo_who)}</span></span>'
            f'<span class="hb-row"><span class="hb-k">Licence</span><span>{esc(ph.get("licence", ""))}</span></span>'
            f'<span class="hb-row"><span class="hb-k">Source</span><a href="{source_html}" rel="noopener">{source_name}</a></span>'
            f'</figcaption>\n'
            f'    </figure>\n'
            f'    <dl class="field-marks">'
            f'<div><dt>Ages</dt><dd>{cover["age_min"]} to {cover["age_max"]}</dd></div>'
            f'<div><dt>Group</dt><dd>{cover["group_min"]} to {cover["group_max"]}</dd></div>'
            f'<div><dt>Time</dt><dd>{cover["time_min"]} to {cover["time_max"]} min</dd></div>'
            + (f'<div><dt>Where</dt><dd>{where}</dd></div>' if where else '')
            + turns_row +
            f'</dl>\n'
            f'    <p class="plate-go"><a href="activity/{cover["id"]}.html">Read the full entry <span aria-hidden="true">&rarr;</span></a></p>\n'
            f'  </section>\n'
        )
    season_filed = tag_counts.get(season_tag, 0)
    halloween_count = tag_counts.get("holiday:halloween", 0)
    guide_cover = (
        '  <section class="guide-cover" aria-labelledby="cover-h">\n'
        '    <h1 id="cover-h">A field guide to things kids can do.</h1>\n'
        f'    <p class="cover-promise">{len(acts)} activities for ages 3 to 14. Every one has its steps and materials. {sum(1 for a in acts if a.get("photo"))} have a photo and {sum(1 for a in acts if a.get("source"))} name where the idea came from. We are adding the rest.</p>\n'
        f'    <p class="cover-ways"><a href="#browse">Search by name</a> &middot; <a href="halloween.html">Halloween: {halloween_count} entries</a></p>\n'
        '  </section>\n'
    )
    return (
        f'  <div class="almanac">\n'
        + guide_cover
        + cover_html
        + doors_html +
        '  <section class="calendar-first" aria-labelledby="cal-h">\n'
        '    <h2 id="cal-h">What\'s coming up</h2>\n'
        '    <ol class="cal-rows">\n' + '\n'.join(rows) + '\n    </ol>\n'
        '  </section>\n'
        '  <section class="contents-section" aria-labelledby="contents-h">\n'
        '    <h2 id="contents-h">Contents</h2>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(contents) + '\n    </ol>\n'
        '    <h3 class="contents-sub">The year\'s issues</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(issues) + '\n    </ol>\n'
        '    <h3 class="contents-sub">By where</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(wheres) + '\n    </ol>\n'
        + where_note +
        '    <h3 class="contents-sub">By time</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(times) + '\n    </ol>\n'
        + time_note +
        '    <h3 class="contents-sub">By group</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(groups) + '\n    </ol>\n'
        + group_note +
        '    <h3 class="contents-sub">By age</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(ages) + '\n    </ol>\n'
        + age_note +
        '    <h3 class="contents-sub">Ready to run</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(readys) + '\n    </ol>\n'
        + ready_note +
        '    <h3 class="contents-sub">By kit</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(kits) + '\n    </ol>\n'
        + kit_note +
        '    <h3 class="contents-sub">By length</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(lengths) + '\n    </ol>\n'
        + length_note +
        '    <h3 class="contents-sub">By stretch</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(stretches) + '\n    </ol>\n'
        + stretch_note +
        '    <h3 class="contents-sub">By flex</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(flexes) + '\n    </ol>\n'
        + flex_note +
        '    <h3 class="contents-sub">By span</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(spans) + '\n    </ol>\n'
        + span_note +
        '    <h3 class="contents-sub">By start</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(starts) + '\n    </ol>\n'
        + start_note +
        '    <h3 class="contents-sub">By end</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(ends) + '\n    </ol>\n'
        + end_note +
        '    <h3 class="contents-sub">By floor</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(floors) + '\n    </ol>\n'
        + floor_note +
        '    <h3 class="contents-sub">By ceiling</h3>\n'
        '    <ol class="contents-lines">\n' + '\n'.join(ceilings) + '\n    </ol>\n'
        + ceiling_note +
        '  </section>\n'
        '  </div>\n'
    )


def inject_home_identity(acts, cats, colls):
    """Splice the rotation-21 home composition into index.html between the
    BUILD:DESK markers. Hand edits outside the markers survive the build."""
    path = os.path.join(SITE, 'index.html')
    html_text = open(path).read()
    if '<!--REGISTER:BEGIN-->' in html_text:
        return          # the Register home (scripts/build_register.py) owns index.html now
    start = '<!-- BUILD:DESK -->'
    end = '<!-- /BUILD:DESK -->'
    assert start in html_text and end in html_text, "index.html missing BUILD:DESK markers"
    before, rest = html_text.split(start, 1)
    _, after = rest.split(end, 1)
    section = render_home_identity(acts, cats, colls)
    assert 'cal-row' in section and 'contents-line' in section and 'plate-name' in section and 'herbarium' in section, "home identity render check failed"
    assert 'verb-door' not in section and 'verb-glyph' not in section, "home identity: emoji cards leaked back"
    assert 'desk-card' not in section and 'class="stat"' not in section, "home identity: desk/stat leaked"
    open(path, 'w').write(before + start + '\n' + section + '  ' + end + after)
    print(f"index.html: home identity injected (issue hero + contents, {len(acts)} activities)")


def render_desk(acts, cats, colls):
    left, right = desk_drawers_html(acts, cats, colls)
    stats = (len(acts), len(cats), len(colls))
    return DESK_TEMPLATE.format(
        n_acts=stats[0], n_cats=stats[1], n_colls=stats[2],
        left_drawers=left, right_drawers=right)


DESK_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Teacher's Desk · Activity Vault</title>
<meta name="description" content="The whole activity archive filed like a teacher's desk: 11 wooden drawers, one per category. Pull a drawer, grab an index card, plan your week.">
<link rel="stylesheet" href="assets/style.css">
<link rel="preload" href="assets/fonts/fraunces-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<script src="assets/site.js" defer></script>
<script src="assets/desk.js" defer></script>

</head>
<body>
<a class="skip-link" href="#desk">Skip to the desk</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="index.html" aria-label="Activity Vault home">
      <span class="brand-mark" aria-hidden="true">🗂️</span>
      <span class="brand-text">Activity <strong>Vault</strong></span>
    </a>
    <nav aria-label="Primary">
      <a href="index.html">Browse</a>
      <a href="desk.html" aria-current="page">The Desk</a>
      <a href="planner.html">Plan my week</a>
      <a href="planner.html#day-planner">Day Planner 🗓️</a>
      <a href="kitbag.html#week-kit">Week Kit 🧰</a>
      <a href="kitbag.html">Kit Bag 🎒</a>
      <a href="party.html#party-pack">Party Pack 🎉</a>
      <a href="collections.html">Collections 📚</a>
    </nav>
    <nav aria-label="More tools and seasons" class="nav-secondary">
      <a href="sub.html">Sub Tub 🆘</a>
      <a href="party.html">Party Planner 🎉</a>
      <a href="fieldtrip.html">Field Trips 🚌</a>
      <span class="nav-div" aria-hidden="true">·</span>
      <a href="halloween.html">Halloween 🎃</a>
      <a href="thanksgiving.html">Thanksgiving 🦃</a>
      <a href="winter.html">Winter ❄️</a>
      <a href="spring.html">Spring 🌷</a>
      <a href="summer.html">Summer ☀️</a>
    </nav>
  </div>
</header>

<main class="wrap">
  <section class="hero" aria-labelledby="hero-title">
    <span class="kicker">The teacher's desk</span>
    <h1 id="hero-title">Pull a drawer.<br>Grab a <span class="squiggle">card.</span></h1>
    <p class="lede">The whole Vault, grouped by category: {n_acts} real activities in {n_cats} groups. Each drawer opens to the six activities on top of the pile, and every card is a real activity page.</p>
    <aside class="desk-note no-print" aria-label="A note from the teacher's desk">every drawer opens. pull one ↓</aside>
    <div class="stats" aria-label="Library stats">
      <div class="stat"><b>{n_acts}</b><span>activities</span></div>
      <div class="stat"><b>{n_cats}</b><span>drawers</span></div>
      <div class="stat"><b>{n_colls}</b><span>collections</span></div>
    </div>
  </section>

  <section class="desk-section" id="desk" aria-label="The teacher's desk: eleven category drawers">
    <div class="desk">
      <p class="desk-nameplate" aria-hidden="true"><span>Activity Vault</span></p>
      <div class="desk-toolbar no-print" role="group" aria-label="Drawer controls">
        <button class="btn btn-small" id="drawers-open-all" type="button">Open all drawers</button>
        <button class="btn btn-small btn-ghost" id="drawers-close-all" type="button">Close all</button>
      </div>
      <div class="pedestals">
        <div class="pedestal" aria-label="Left drawers">
{left_drawers}
        </div>
        <div class="kneehole">
          <section class="blotter-card" aria-labelledby="blotter-h">
            <p class="blotter-stamp" aria-hidden="true">The blotter</p>
            <h2 id="blotter-h">Your week, laid out here.</h2>
            <p>The Smart Weekly Planner deals no-repeat weeks from the same {n_acts} cards in these drawers, balanced days, brain breaks, supply lists.</p>
            <p><a class="btn" href="planner.html">Open the planner</a></p>
            <p class="blotter-alt">or browse the <a href="collections.html">{n_colls} curated collections</a></p>
          </section>
        </div>
        <div class="pedestal" aria-label="Right drawers">
{right_drawers}
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer no-print">
  <div class="wrap"><p><strong>Activity Vault</strong>, the all-in-one activity archive for teachers &amp; after-school programs.</p></div>
</footer>
</body>
</html>
"""


def assemble_public_site():
    """Copy only the public files into site/ (the Vercel output
    directory). Returns the number of files copied. See the Round 2
    note at the call site in main() for the copy-list rationale."""
    out = os.path.join(ROOT, 'site')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    copied = [0]

    def cp(rel):
        src = os.path.join(ROOT, rel)
        dst = os.path.join(out, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        copied[0] += 1

    def cptree(rel):
        src_root = os.path.join(ROOT, rel)
        for dirpath, dirnames, filenames in os.walk(src_root):
            dirnames[:] = [d for d in dirnames if d != '__pycache__']
            for fn in filenames:
                if fn.endswith('.pyc'):
                    continue
                cp(os.path.relpath(os.path.join(dirpath, fn), ROOT))

    for name in sorted(os.listdir(ROOT)):
        if name.endswith('.html'):
            cp(name)
    for name in ('llms.txt', 'llms-full.txt', 'sitemap.xml', 'robots.txt',
                 'favicon.ico', 'favicon.svg', 'apple-touch-icon.png',
                 'icon-192.png', 'icon-512.png',
                 'AGENT.md', 'API.md', 'GO_LIVE.md'):
        if os.path.exists(os.path.join(ROOT, name)):
            cp(name)
    cptree('activity')
    cptree('assets')
    cptree('skills')
    for name in ('activities.json', 'categories.json', 'collections.json',
                 'balance-buckets.json'):
        cp(os.path.join('data', name))
    cptree(os.path.join('data', 'v1'))
    return copied[0]


def main():
    acts, cats, colls, buckets = load()
    errs = validate(acts, cats)
    errs.extend(validate_collections(colls, acts))  # wave 9: picks resolve to real ids
    errs.extend(validate_balance_buckets(buckets, cats))  # wave 10: category->bucket map
    if errs:
        print("VALIDATION FAILED:")
        for e in errs: print(" -", e)
        sys.exit(1)
    actmap = {a['id']: a for a in acts}
    # Wave 9 explicit assert: every collection pick resolves to a real activity id.
    assert len(colls) == 34, f"expected 34 collections, got {len(colls)}"
    assert all(p['id'] in actmap for c in colls for p in c['picks']), \
        "collection pick does not resolve to a real activity id"
    # Wave 10 explicit assert: balance-buckets covers all 11 categories.
    assert len(buckets['mapping']) == len(cats) == 11, \
        f"expected 11 bucket mappings, got {len(buckets['mapping'])}"
    catmap = {c['id']: c for c in cats}
    today = date.today().isoformat()

    # 1. activity pages
    actdir = os.path.join(SITE, 'activity')
    os.makedirs(actdir, exist_ok=True)
    rendered = 0
    for a in acts:
        page = render_activity(a, catmap, acts)
        assert esc(a['name']) in page and len(page) > 500, f"render check failed: {a['id']}"
        with open(os.path.join(actdir, a['id'] + '.html'), 'w') as f:
            f.write(page)
        rendered += 1

    # 1b. The Desk (wave 21): the archive as a physical teacher's desk.
    desk_page = render_desk(acts, cats, colls)
    assert 'DRAWER 01' in desk_page and 'DRAWER 11' in desk_page, "desk render check failed"
    with open(os.path.join(SITE, 'desk.html'), 'w') as f:
        f.write(desk_page)

    # 1c. Wave 23: the archive landing (index.html) becomes a desk you can
    # open. The generated desk section is spliced between BUILD:DESK markers.
    inject_home_identity(acts, cats, colls)

    # 2. API
    # 2026-10-12: static data lives in data/v1/, Vercel never serves static
    # files from under api/ (every frontend fetch of api/v1/*.json 404s in
    # production). Only real serverless function handlers stay under api/.
    api = os.path.join(SITE, 'data', 'v1')
    schemadir = os.path.join(api, 'schema')
    os.makedirs(schemadir, exist_ok=True)
    json.dump({'activities': acts, 'count': len(acts), 'updated': today},
              open(os.path.join(api, 'activities.json'), 'w'), indent=1, ensure_ascii=False)
    # Bundle 2026-10-24 step 1 (light first screen): the home page and
    # its filters load this compact index, not the 2.1 MB full file.
    # One entry per activity: id, name, tagline, categories, ages,
    # group, minutes, location, photo flag — plus the few fields the
    # existing filters honestly need (tags, no-prep / copy-free /
    # no-elimination flags, materials count, photo file, source URL).
    # A single activity's full record is its own static page
    # (activity/<id>.html); it is only loaded when that page opens.
    _index_entries = []
    for _a in acts:
        _ph = _photo_for(_a)
        _e = {
            'id': _a['id'], 'name': _a['name'], 'tagline': _a['tagline'],
            'categories': _a['categories'],
            'ages': [_a['age_min'], _a['age_max']],
            'group': [_a['group_min'], _a['group_max']],
            'minutes': [_a['time_min'], _a['time_max']],
            'location': _a['location'],
            'photo': bool(_ph),
            'mats': len(_a.get('materials') or []),
        }
        if _ph:
            _e['pf'] = _ph['file']
        if _a.get('source'):
            # The compact index's src is a URL string by contract
            # (assets/app.js sets it as a link href and derives the
            # host label from it), so an object source contributes
            # its url member here; the full {label, url} record still
            # ships unchanged in data/v1/activities.json.
            _src_url, _src_label = source_url_and_label(_a['source'])
            if _src_url:
                _e['src'] = _src_url
        if _a.get('tags'):
            _e['tags'] = _a['tags']
        if _a.get('no_prep'):
            _e['np'] = 1
        if _a.get('copy_free'):
            _e['cf'] = 1
        if _a.get('no_elimination'):
            _e['ne'] = 1
        _index_entries.append(_e)
    with open(os.path.join(api, 'activity-index.json'), 'w') as _f:
        json.dump({'activities': _index_entries, 'count': len(_index_entries),
                   'updated': today}, _f, separators=(',', ':'), ensure_ascii=False)
    _index_bytes = os.path.getsize(os.path.join(api, 'activity-index.json'))
    print(f"activity-index.json: {_index_bytes} bytes for {len(_index_entries)} activities "
          f"(full activities.json is {os.path.getsize(os.path.join(api, 'activities.json'))} bytes)")
    # Bundle 2026-10-24 step 3: season packs. Source of truth is the
    # hand-authored data/calendar.json; the build validates the pack
    # shape and publishes it at data/v1/calendar.json unchanged, so
    # assets/season.js can switch home/hubs/nav by the visitor's own
    # date with no deploy.
    _cal = json.load(open(os.path.join(DATA, 'calendar.json')))
    _packs = _cal.get('packs') or []
    assert _packs, "calendar.json: no packs"
    for _p in _packs:
        assert all(_p.get(k) for k in ('id', 'name', 'start', 'end', 'hub')), \
            f"calendar pack missing fields: {_p}"
        assert _p['start'] <= _p['end'], f"calendar pack {_p['id']}: start after end"
        assert os.path.exists(os.path.join(ROOT, _p['hub'])), \
            f"calendar pack {_p['id']}: hub page missing: {_p['hub']}"
    json.dump(_cal, open(os.path.join(api, 'calendar.json'), 'w'), indent=1, ensure_ascii=False)
    print(f"calendar.json: {len(_packs)} season packs published")
    json.dump({'categories': cats, 'count': len(cats), 'updated': today},
              open(os.path.join(api, 'categories.json'), 'w'), indent=1, ensure_ascii=False)
    # QA-011: age declaration derives from the catalogue's true span so it
    # can never silently drift from the data again (was a literal 3/14).
    _age_min = min(a['age_min'] for a in acts)
    _age_max = max(a['age_max'] for a in acts)
    filters = {
        "age": {"type": "range", "min": _age_min, "max": _age_max, "unit": "years",
                "description": "Activity fits if the age range overlaps the selected age."},
        "time_available": {"type": "select", "options": [15, 20, 30, 45, 60], "unit": "minutes",
                "description": "Activity fits if time_min <= selected minutes."},
        "group_size": {"type": "range", "min": 2, "max": 40, "unit": "kids",
                "description": "Activity fits if the group range overlaps the selected size."},
        "categories": {"type": "multiselect", "options": [c['id'] for c in cats]},
        "tags": {"type": "multiselect", "options": TAG_IDS,
                "labels": TAG_LABELS,
                "description": "Season/occasion tags. Activity fits if it carries ANY selected tag."},
        "no_prep_only": {"type": "boolean", "description": "Only activities with no_prep=true."},
        "copy_free_only": {"type": "boolean", "description": "Only activities verified copy-free (zero printing)."},
        "no_elimination_only": {"type": "boolean", "description": "Only games verified no-elimination."},
        "indoor_only": {"type": "boolean", "description": "Only activities with 'indoor' in location."},
        "outdoor_only": {"type": "boolean", "description": "Only activities with 'outdoor' in location."},
        "search": {"type": "text", "fields": ["name", "tagline", "materials[].item", "steps"],
                "description": "Case-insensitive substring match across name, tagline, materials, steps."}
    }
    json.dump({"filters": filters, "updated": today},
              open(os.path.join(api, 'filters.json'), 'w'), indent=1)

    # 2b. skills registry + self-describing manifest
    skills = load_skills()
    # 2c. curated collections (wave 9): enriched records, assert-backed in main()
    coll_records = build_collection_records(colls, actmap)
    json.dump({"collections": coll_records, "count": len(coll_records), "updated": today},
              open(os.path.join(api, 'collections.json'), 'w'), indent=1, ensure_ascii=False)
    # 2d. balance buckets (wave 10): enriched mapping records for the planner's energy meter
    bucket_defs = {b['id']: b for b in buckets['buckets']}
    bucket_records = [{
        "category": r["category"],
        "category_name": catmap[r["category"]]["name"],
        "bucket": r["bucket"],
        "bucket_label": bucket_defs[r["bucket"]]["label"],
        "bucket_glyph": bucket_defs[r["bucket"]]["glyph"],
    } for r in buckets['mapping']]
    json.dump({"buckets": buckets['buckets'], "mapping": bucket_records,
               "count": len(bucket_records), "updated": today},
              open(os.path.join(api, 'balance-buckets.json'), 'w'), indent=1, ensure_ascii=False)
    # 2e. Scout review queue + decisions (Vercel wave A): publish the pipeline's
    # review-queue.json at data/v1/review-queue.json (OPEN candidates only, the
    # §5.1 retention shape) and the 90-day decision log at data/v1/decided.json.
    # The cron job and review-decide endpoint own pipeline/*.json (source of
    # truth); this is the read projection the functions and the static fallback
    # serve. A cron commit triggers a redeploy, which re-runs this build, so the
    # fallback updates atomically with the store (§4.6).
    from datetime import timedelta as _td
    from email.utils import parsedate_to_datetime as _p2d
    _rq_raw = json.load(open(os.path.join(ROOT, 'pipeline', 'review-queue.json')))
    _decided_path = os.path.join(ROOT, 'pipeline', 'decided.json')
    _decided_raw = json.load(open(_decided_path)) if os.path.exists(_decided_path) else []
    _gen_at = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    def _parse_dt(s):
        # Robust parse: ISO-8601 (with Z) first, then RFC-2822 feed dates.
        if not s:
            return None
        try:
            return datetime.fromisoformat(s.replace('Z', '+00:00')).astimezone(timezone.utc)
        except Exception:
            pass
        try:
            return _p2d(s).astimezone(timezone.utc)
        except Exception:
            return None

    def _iso_or_none(s):
        dt = _parse_dt(s)
        return dt.strftime('%Y-%m-%dT%H:%M:%SZ') if dt else None

    def _rq_published(raw):
        # Normalize to the API candidate shape (§7.6). detected_at is stamped by
        # the scout cron on new candidates; for legacy items it honestly mirrors
        # `published` (best available, documented in the file's meta note).
        out = []
        for c in raw:
            out.append({
                'id': c['id'],
                'title': c['title'],
                'summary': c.get('summary') or '',
                'source_url': c.get('source_url') or c.get('link') or '',
                'feed': c.get('feed') or '',
                'published': c.get('published') or '',
                'detected_at': c.get('detected_at') or _iso_or_none(c.get('published')),
                'suggested_tags': c.get('suggested_tags') or [],
                'status': c.get('status') or 'pending',
                'note': c.get('note') or '',
                'decision': c.get('decision'),
                'reviewed': c.get('reviewed'),
                'activity_id': c.get('activity_id'),
            })
        return out

    def _decision_record(d):
        rev = d.get('reviewed')
        decided_at = d.get('decided_at') or (_iso_or_none(rev + ' 00:00:00 +0000') if rev else None)
        return {
            'id': d['id'],
            'title': d.get('title'),
            'source_url': d.get('source_url') or d.get('link'),
            'feed': d.get('feed'),
            'decision': d.get('decision'),
            'decided_at': decided_at,
            'decided_by': d.get('decided_by') or 'human',
            'note': d.get('note'),
            'activity_id': d.get('activity_id'),
            'approved_via': d.get('approved_via') or ('scout' if d.get('decision') == 'approve' else None),
            'reviewed': rev,
        }

    _rq_pub = _rq_published(_rq_raw)
    _open = [c for c in _rq_pub if c['status'] == 'pending']
    if _decided_raw:
        _decisions = [_decision_record(d) for d in _decided_raw]
    else:
        # Pre-cron: derive the decision log from already-decided queue items.
        _decisions = []
        for _c in _rq_pub:
            if _c['status'] not in ('accepted', 'rejected'):
                continue
            _d = dict(_c)
            _d['decision'] = 'approve' if _c['status'] == 'accepted' else 'reject'
            _decisions.append(_decision_record(_d))
    _cutoff = datetime.now(timezone.utc) - _td(days=90)
    _kept = []
    for _d in _decisions:
        _dt = _parse_dt(_d.get('decided_at') or _d.get('reviewed'))
        if _dt is None or _dt >= _cutoff:
            _kept.append(_d)  # undated: keep, can't prove age
    _decisions = _kept
    _decisions.sort(key=lambda d: d.get('decided_at') or '', reverse=True)
    json.dump({
        'candidates': _open,
        'counts': {'pending': len(_open), 'open': len(_open), 'decided_90d': len(_decisions)},
        'generated_at': _gen_at,
        'meta': {
            'source': 'pipeline/review-queue.json (open candidates only)',
            'note': 'detected_at for pre-scout items mirrors published (best available). ' +
                    'Decided items live in data/v1/decided.json (90-day retention).',
        },
    }, open(os.path.join(api, 'review-queue.json'), 'w'), indent=1, ensure_ascii=False)
    json.dump({
        'decisions': _decisions,
        'count': len(_decisions),
        'generated_at': _gen_at,
        'retention_days': 90,
    }, open(os.path.join(api, 'decided.json'), 'w'), indent=1, ensure_ascii=False)
    json.dump({
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "ReviewQueueResponse", "type": "object",
        "required": ["candidates", "counts", "generated_at"],
        "properties": {
            "candidates": {"type": "array", "items": {"$ref": "#/definitions/candidate"}},
            "counts": {"type": "object",
                       "required": ["pending", "open", "decided_90d"],
                       "properties": {"pending": {"type": "integer", "minimum": 0},
                                      "open": {"type": "integer", "minimum": 0},
                                      "decided_90d": {"type": "integer", "minimum": 0}}},
            "generated_at": {"type": "string",
                             "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"},
            "meta": {"type": "object"},
        },
        "definitions": {
            "candidate": {
                "type": "object",
                "required": ["id", "title", "summary", "source_url", "feed", "published",
                             "detected_at", "suggested_tags", "status", "note"],
                "properties": {
                    "id": {"type": "string"},
                    "title": {"type": "string"},
                    "summary": {"type": "string"},
                    "source_url": {"type": "string"},
                    "feed": {"type": "string"},
                    "published": {"type": "string"},
                    "detected_at": {"type": ["string", "null"]},
                    "suggested_tags": {"type": "array", "items": {"type": "string"}},
                    "status": {"type": "string",
                               "enum": ["pending", "accepted", "rejected", "deferred"]},
                    "note": {"type": "string"},
                    "decision": {"type": ["string", "null"]},
                    "reviewed": {"type": ["string", "null"]},
                    "activity_id": {"type": ["string", "null"]},
                },
            },
        },
    }, open(os.path.join(schemadir, 'review-queue.schema.json'), 'w'), indent=1)
    json.dump({
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "ScoutDecisionsResponse", "type": "object",
        "required": ["decisions", "count", "generated_at", "retention_days"],
        "properties": {
            "decisions": {"type": "array", "items": {
                "type": "object",
                "required": ["id", "decision", "decided_at"],
                "properties": {
                    "id": {"type": "string"},
                    "title": {"type": ["string", "null"]},
                    "source_url": {"type": ["string", "null"]},
                    "feed": {"type": ["string", "null"]},
                    "decision": {"type": "string", "enum": ["approve", "reject"]},
                    "decided_at": {"type": ["string", "null"]},
                    "decided_by": {"type": ["string", "null"]},
                    "note": {"type": ["string", "null"]},
                    "activity_id": {"type": ["string", "null"]},
                    "approved_via": {"type": ["string", "null"]},
                    "reviewed": {"type": ["string", "null"]},
                }}},
            "count": {"type": "integer", "minimum": 0},
            "generated_at": {"type": "string",
                             "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"},
            "retention_days": {"type": "integer", "minimum": 1},
        },
    }, open(os.path.join(schemadir, 'decided.schema.json'), 'w'), indent=1)

    # 2f. Scout review queue page (Vercel wave B): review.html pre-rendered from the
    # same normalized data as data/v1/review-queue.json + data/v1/decided.json, with
    # the api-client.js fallback wiring (live /api/review-queue first, static JSON
    # fallback). A cron redeploy re-runs this build, so the pre-render stays fresh.
    _review_html = render_review(_open, _decisions, _gen_at)
    open(os.path.join(SITE, 'review.html'), 'w').write(_review_html)

    endpoints = [
        {"path": "data/v1/index.json",
         "title": "API manifest",
         "description": "Self-describing manifest of every API endpoint: title, description, schema URL, "
                        "updated timestamp, record counts, stability, and deprecation notes. Start here.",
         "schema": "data/v1/schema/index.schema.json",
         "updated": today, "stability": "stable"},
        {"path": "data/v1/activities.json",
         "title": "Full activity library",
         "description": "Every activity record: filters (age, time, group, location, materials, no_prep), "
                        "setup, steps, variations, safety, optional season/occasion tags, optional source URL.",
         "schema": "data/v1/schema/activities.schema.json",
         "updated": today, "records": len(acts), "stability": "stable"},
        {"path": "data/v1/activity-index.json",
         "title": "Light activity index",
         "description": "Compact per-activity index (id, name, tagline, categories, age/group/time "
                        "ranges, location, photo flag) that the home page and its filters load. "
                        "Full records live at data/v1/activities.json and on each activity page.",
         "schema": None,
         "updated": today, "records": len(acts), "stability": "stable"},
        {"path": "data/v1/calendar.json",
         "title": "Season packs",
         "description": "Dated season packs (start/end, hub page) that switch the home page, "
                        "hubs and nav by the visitor's own date, with no deploy.",
         "schema": None,
         "updated": today, "records": len(_packs), "stability": "stable"},
        {"path": "data/v1/pulse.json",
         "title": "Heartbeat pulse",
         "description": "Heartbeat health: per-source ok/last-ok/failure counts and recent "
                        "changes, written by scripts/heartbeat/run.py. The health endpoint "
                        "reads this file from the bundle.",
         "schema": None, "stability": "stable"},
        {"path": "data/v1/photo-queue.json",
         "title": "Photo scout queue",
         "description": "Commons photo candidates for photo-less activities (PD/CC0/CC BY/"
                        "CC BY-SA only, author + licence copied exactly), queued for owner "
                        "approval. Nothing here is published by the job.",
         "schema": None, "stability": "stable"},
        {"path": "data/v1/categories.json",
         "title": "Category definitions",
         "description": "The 11 categories: id, name, blurb, color, glyph.",
         "schema": "data/v1/schema/categories.schema.json",
         "updated": today, "records": len(cats), "stability": "stable"},
        {"path": "data/v1/filters.json",
         "title": "Filter configuration",
         "description": "Machine-readable filter configuration, the same matching logic the browser UI uses "
                        "(range, select, multiselect, boolean, text search across name/tagline/materials/steps).",
         "schema": "data/v1/schema/filters.schema.json",
         "updated": today, "stability": "stable"},
        {"path": "data/v1/skills.json",
         "title": "Skills registry",
         "description": "Registry of the reusable skill recipes in skills/: id, description, and file path.",
         "schema": None,
         "updated": today, "records": len(skills), "stability": "stable"},
        {"path": "data/v1/collections.json",
         "title": "Curated collections",
         "description": "Teacher-ready activity bundles for specific moments (rainy days, first "
                        "days, last 10 minutes, bus rides, sub coverage, winter parties, no-prep "
                        "gaps, calm-down needs). Each collection lists activity ids with a "
                        "curator's one-line note on why each was picked, plus age/time spans.",
         "schema": "data/v1/schema/collections.schema.json",
         "updated": today, "records": len(coll_records), "stability": "stable"},
        {"path": "data/v1/balance-buckets.json",
         "title": "Energy balance buckets",
         "description": "The 5 energy buckets (movement, calm, creative, outdoor, all-rounder) "
                      "and the category-to-bucket mapping the Smart Weekly Planner's balance "
                      "meter uses. An activity's bucket comes from its primary category.",
         "schema": "data/v1/schema/balance-buckets.schema.json",
         "updated": today, "records": len(bucket_records), "stability": "stable"},
        {"path": "data/v1/review-queue.json",
         "title": "Scout review queue (open candidates)",
         "description": "Human-in-the-loop review queue for the Scout RSS watch: pending activity "
                        "candidates with source links, suggested season/occasion tags, and detection "
                        "timestamps. Served live by GET /api/review-queue; static fallback for it.",
         "schema": "data/v1/schema/review-queue.schema.json",
         "stability": "stable"},
        {"path": "data/v1/decided.json",
         "title": "Scout decisions (90-day log)",
         "description": "Human approve/reject decisions on Scout candidates, newest first, 90-day "
                        "retention. Approvals carry approved_via:'scout'.",
         "schema": "data/v1/schema/decided.schema.json",
         "stability": "stable"},
        {"path": "pipeline/review-queue.json",
         "title": "RSS review queue",
         "description": "RSS-pipeline working queue: accepted / rejected / deferred activity candidates "
                        "under review, with decisions and source links.",
         "schema": None, "updated": None, "stability": "internal",
         "notes": "Not a stable public API. Statuses and shape change as the pipeline runs. "
                  "Treat undated numbers as stale."},
    ]
    manifest = {
        "meta": {
            "site": "Activity Vault",
            "version": "1.0.0",
            "generated": datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
            "source_snapshot": ("data/activities.json + data/categories.json, "
                                f"{len(acts)} activities, {len(cats)} categories"),
        },
        "endpoints": endpoints,
        "deprecation_notes": "No endpoints are deprecated as of 1.0.0. Breaking changes get a new "
                             "v2/ path, never a silent shape change.",
    }
    json.dump(manifest, open(os.path.join(api, 'index.json'), 'w'), indent=1, ensure_ascii=False)
    json.dump({"skills": skills, "count": len(skills), "updated": today},
              open(os.path.join(api, 'skills.json'), 'w'), indent=1, ensure_ascii=False)

    act_schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Activity", "type": "object",
        "required": REQUIRED,
        "properties": {
            "id": {"type": "string", "pattern": "^[a-z0-9-]+$"},
            "name": {"type": "string"}, "tagline": {"type": "string"},
            "categories": {"type": "array", "items": {"type": "string"}, "minItems": 1},
            "age_min": {"type": "integer"}, "age_max": {"type": "integer"},
            "group_min": {"type": "integer"}, "group_max": {"type": "integer"},
            "time_min": {"type": "integer"}, "time_max": {"type": "integer"},
            "location": {"type": "array", "items": {"enum": ["indoor", "outdoor"]}},
            "materials": {"type": "array", "items": {
                "type": "object", "required": ["item"],
                "properties": {"item": {"type": "string"}, "note": {"type": "string"}}}},
            "no_prep": {"type": "boolean"},
            "setup": {"type": "string"},
            "steps": {"type": "array", "items": {"type": "string"}, "minItems": 1},
            "variations": {"type": "object", "required": ["easier", "harder"],
                           "properties": {"easier": {"type": "string"}, "harder": {"type": "string"}}},
            "safety": {"type": ["string", "null"]},
            "copy_free": {"type": "boolean",
                     "description": "Verified zero-printing (wave 14, per 2026 teacher research)."},
            "no_elimination": {"type": "boolean",
                     "description": "Verified no-elimination game (wave 14, 2026 PE norm)."},
            "why_it_works": {"type": ["string", "null"],
                     "description": "Research-backed one-liner on why the activity works."},
            "inclusion": {"type": ["string", "null"],
                     "description": "One-line inclusion notes (access, language, assessment)."},
            "tags": {"type": "array", "items": {"enum": TAG_IDS},
                     "description": "Optional season/occasion tags for filtering."},
            "source": {"anyOf": [{"type": "string", "format": "uri"},
                                  {"type": "object", "required": ["url"],
                                   "properties": {"url": {"type": "string", "format": "uri"},
                                                  "label": {"type": "string"}}},
                                  {"type": "null"}],
                       "description": "Optional inspiration source (RSS pipeline / Foundry batches): a plain URL string, or a {label, url} object whose label is the visible attribution text."},
            "photo": {"type": ["object", "null"],
                      "description": "Optional real photograph (rotation 23): file under assets/photos/, alt text, caption, credit line, licence, and the photo's own source page URL. Public/CC-licensed sources only; provenance travels with the record.",
                      "required": ["file", "alt", "caption", "credit", "licence", "source_url"],
                      "properties": {
                          "file": {"type": "string"}, "alt": {"type": "string"},
                          "caption": {"type": "string"}, "credit": {"type": "string"},
                          "licence": {"type": "string"}, "source_url": {"type": "string", "format": "uri"}}}
        }
    }
    json.dump(act_schema, open(os.path.join(schemadir, 'activity.schema.json'), 'w'), indent=1)
    json.dump({
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Category", "type": "object",
        "required": ["id", "name", "blurb", "color", "glyph"],
        "properties": {
            "id": {"type": "string"}, "name": {"type": "string"},
            "blurb": {"type": "string"}, "color": {"type": "string"},
            "glyph": {"type": "string"}
        }
    }, open(os.path.join(schemadir, 'category.schema.json'), 'w'), indent=1)

    # Envelope + config schemas (one draft-07 schema per endpoint payload).
    def envelope(title, item_schema, item_key):
        return {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "title": title, "type": "object",
            "required": [item_key, "count", "updated"],
            "properties": {
                item_key: {"type": "array", "items": item_schema},
                "count": {"type": "integer", "minimum": 0},
                "updated": {"type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$"},
            },
        }
    json.dump(envelope("ActivitiesResponse", act_schema, "activities"),
              open(os.path.join(schemadir, 'activities.schema.json'), 'w'), indent=1)
    json.dump(envelope("CategoriesResponse", {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Category", "type": "object",
        "required": ["id", "name", "blurb", "color", "glyph"],
        "properties": {
            "id": {"type": "string"}, "name": {"type": "string"},
            "blurb": {"type": "string"}, "color": {"type": "string"},
            "glyph": {"type": "string"}}}, "categories"),
              open(os.path.join(schemadir, 'categories.schema.json'), 'w'), indent=1)
    json.dump({
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "FiltersResponse", "type": "object",
        "required": ["filters", "updated"],
        "properties": {
            "filters": {
                "type": "object", "minProperties": 1,
                "additionalProperties": {
                    "type": "object",
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string",
                                 "enum": ["range", "select", "multiselect", "boolean", "text"]},
                        "min": {"type": "number"}, "max": {"type": "number"},
                        "unit": {"type": "string"},
                        "options": {"type": "array"},
                        "labels": {"type": "object"},
                        "fields": {"type": "array", "items": {"type": "string"}},
                        "description": {"type": "string"},
                    },
                },
            },
            "updated": {"type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$"},
        },
    }, open(os.path.join(schemadir, 'filters.schema.json'), 'w'), indent=1)
    # Wave 9: collection record schema + envelope (draft-07), same convention as
    # activity.schema.json (standalone record) + activities.schema.json (inline envelope).
    coll_schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Collection", "type": "object",
        "required": ["id", "title", "glyph", "when_to_use", "picks",
                     "age_span", "time_span", "page"],
        "properties": {
            "id": {"type": "string", "pattern": "^[a-z0-9-]+$"},
            "title": {"type": "string"},
            "glyph": {"type": "string"},
            "when_to_use": {"type": "string"},
            "picks": {"type": "array", "minItems": 8, "maxItems": 12,
                      "items": {
                          "type": "object",
                          "required": ["activity_id", "curator_note"],
                          "properties": {
                              "activity_id": {"type": "string",
                                              "pattern": "^[a-z0-9-]+$"},
                              "curator_note": {"type": "string"},
                          }}},
            "age_span": {"type": "array", "items": {"type": "integer"},
                         "minItems": 2, "maxItems": 2,
                         "description": "[min age_min, max age_max] across picks."},
            "time_span": {"type": "array", "items": {"type": "integer"},
                          "minItems": 2, "maxItems": 2,
                          "description": "[min time_min, max time_max] across picks."},
            "page": {"type": "string",
                     "description": "Deep link to the collection page (hash route)."},
        },
    }
    json.dump(coll_schema, open(os.path.join(schemadir, 'collection.schema.json'), 'w'), indent=1)
    json.dump(envelope("CollectionsResponse", coll_schema, "collections"),
              open(os.path.join(schemadir, 'collections.schema.json'), 'w'), indent=1)
    # Wave 10: balance-bucket record schema + envelope (draft-07), same two-file convention.
    bucket_schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "BalanceBucket", "type": "object",
        "required": ["id", "label", "glyph", "description"],
        "properties": {
            "id": {"type": "string",
                   "enum": ["movement", "calm", "creative", "outdoor", "mixed"]},
            "label": {"type": "string"},
            "glyph": {"type": "string"},
            "description": {"type": "string"},
        },
    }
    json.dump(bucket_schema, open(os.path.join(schemadir, 'balance-bucket.schema.json'), 'w'), indent=1)
    json.dump({
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "BalanceBucketsResponse", "type": "object",
        "required": ["buckets", "mapping", "count", "updated"],
        "properties": {
            "buckets": {"type": "array", "items": bucket_schema},
            "mapping": {"type": "array", "minItems": 11, "maxItems": 11,
                      "items": {
                          "type": "object",
                          "required": ["category", "category_name", "bucket",
                                     "bucket_label", "bucket_glyph"],
                          "properties": {
                              "category": {"type": "string"},
                              "category_name": {"type": "string"},
                              "bucket": {"type": "string",
                                       "enum": ["movement", "calm", "creative",
                                              "outdoor", "mixed"]},
                              "bucket_label": {"type": "string"},
                              "bucket_glyph": {"type": "string"},
                          }}},
            "count": {"type": "integer", "minimum": 0},
            "updated": {"type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$"},
        },
    }, open(os.path.join(schemadir, 'balance-buckets.schema.json'), 'w'), indent=1)
    json.dump({
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "ApiManifest", "type": "object",
        "required": ["meta", "endpoints"],
        "properties": {
            "meta": {
                "type": "object",
                "required": ["site", "version", "generated", "source_snapshot"],
                "properties": {
                    "site": {"type": "string"},
                    "version": {"type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$"},
                    "generated": {"type": "string",
                                  "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"},
                    "source_snapshot": {"type": "string"},
                },
            },
            "endpoints": {
                "type": "array", "minItems": 1,
                "items": {
                    "type": "object",
                    "required": ["path", "title", "description", "stability"],
                    "properties": {
                        "path": {"type": "string"},
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "schema": {"type": ["string", "null"]},
                        "updated": {"type": ["string", "null"]},
                        "records": {"type": "integer", "minimum": 0},
                        "stability": {"type": "string", "enum": ["stable", "internal"]},
                        "notes": {"type": "string"},
                    },
                },
            },
            "deprecation_notes": {"type": "string"},
        },
    }, open(os.path.join(schemadir, 'index.schema.json'), 'w'), indent=1)

    # 3. llms.txt + llms-full.txt
    lines = ["# Activity Vault", "",
             "The all-in-one activity archive for teachers and after-school program teachers.",
             "Hundreds of real, classic, public-domain activity concepts, filterable by age, time,",
             "group size, materials, and category. Plan-my-week planner. Printable one-page cards.", "",
             "## Categories"]
    for c in cats:
        n = sum(1 for a in acts if c['id'] in a['categories'])
        lines.append(f"- {c['name']}: {n} activities, {c['blurb']}")
    lines += ["", "## API. Start at data/v1/index.json (self-describing manifest)"]
    for ep in endpoints:
        if ep['path'].startswith('data/'):
            lines.append(f"- {ep['path']}, {ep['title'].lower()}")
    lines += ["", "## Skills"]
    for s in skills:
        lines.append(f"- {s['file']}, {s['description']}")
    lines += ["", "## Tools",
              "- desk.html (The Teacher's Desk): the whole archive as 11 wooden category drawers.",
              "  Every drawer opens (real working drawers, keyboard + reduced-motion friendly) onto",
              "  six index cards on top of the pile, curator picks first, then no-prep, plus a",
              "  pencil note with honest per-drawer counts; each drawer deep-links to the matching",
              "  filtered browse view (index.html?cats=<id>). The kneehole blotter links the planner.",
              "- sub.html, Sub Tub: the substitute-teacher rescue kit.",
              "  Pick grade band, minutes to fill, materials on hand, location, ",
              "  generates a sequenced print-ready emergency plan plus a 'Dear sub' note template.",
              "- party.html, Party Themes (Halloween, Thanksgiving, winter, spring, and summer presets).",
              "  Pick a theme, class size, minutes, stations, and budget, generates a timed",
              "  station-rotation plan from seasonal activities, plus a setup list and a",
              "  print-ready run sheet.",
              "- halloween.html. Halloween hub: the Halloween 2026 pack's crafts, costume and",
              "  party games, not-too-spooky science, harvest activities, and trick-or-treat",
              "  alternatives, plus the Haunted Halls collection, a Halloween party-theme shortcut,",
              "  and a spookiness-level filter.",
              "- spring.html. Spring hub: the spring 2027 pack's crafts, outdoor games,",
              "  spring science, rainy-day backups, and spring-holiday activities, plus the",
              "  Spring Burst collection and a spring party-theme shortcut.",
              "- summer.html. Summer hub: the summer 2027 pack's water play, outdoor games,",
              "  summer crafts, beat-the-heat indoor backups, and camp + July 4th activities,",
              "  plus the Summer Splash collection and a summer party-theme shortcut.",
              "- fieldtrip.html, Field Trip Planner: destination, group size, and trip length",
              "  become a clock-time timeline, chaperone and buddy-pair math, a budget estimate,",
              "  on-site activity ideas matched from the real library, bus-ride activities from the",
              "  field-trip-bus-ride collection, and printable permission-slip + pack checklists.",
              "- thanksgiving.html. Thanksgiving hub: the Thanksgiving 2026 pack's gratitude",
              "  crafts, harvest games, Thanksgiving STEM, gratitude and friendsgiving activities,",
              "  and giving-back projects, plus the Grateful Gathering collection and a",
              "  Thanksgiving party-theme shortcut.",
              "- winter.html. Winter Holidays hub: the Winter 2026 pack's Christmas crafts and",
              "  games, Hanukkah and Kwanzaa activities, New Year countdowns, and winter-break",
              "  science, plus the Winter Lights collection and a winter party-theme shortcut.",
              "- planner.html, Smart Weekly Planner 3.0: program presets (after-school / camp /",
              "  classroom), age bands, auto-built no-repeat weeks with a per-day energy balance meter,",
              "  drag-and-drop reorder, per-slot swap, surprise gap-fill, prep-level caps, collection",
              "  seeding (?from=collection:<id>), named saved plans, .ics calendar export, shareable",
              "  ?plan= links, and a print-ready card deck.",
              "- planner.html#day-planner, The Day Planner (merged into Plan my week in R47): compose a single",
              "  day, five slots (arrival to closing) filled by age from the real catalog, a pre-composed Just Three",
              "  starter day, and a printable day sheet.",
              "- kitbag.html#week-kit, The Week Kit (merged into Kit Bag in R47): the flagship low-materials week builder.",
              "  Group size + age band + days/week + what you have on hand (16-staple pantry,",
              "  low-materials, or no-prep mode) become a week of sessions from the real library,",
              "  each day with a run-of-show timeline, a printable session plan sheet, per-slot",
              "  swap, one aggregated material checklist (have vs. gather), copy-as-text, and",
              "  shareable ?kit= links that restore the exact kit on any device.",
              "- kitbag.html, The Kit Bag: pack one rainy day indoors, five roles filled",
              "  from the real rainy-day shelf by age, and a printable kit list composed",
              "  from the selected activities' real materials fields: deduplicated,",
              "  grouped (consumables / equipment / print-at-desk), every line traced",
              "  to the activity that asked for it. Copy-as-text included.",
              "- party.html#party-pack, The Party Pack (merged into Party Planner in R47): plan a whole group event, pick an",
              "  occasion (birthday, Halloween, Thanksgiving, winter holiday,",
              "  Valentine's, spring, summer, rainy-day), an age band, and a group",
              "  size, and it composes a five-part party arc from real activities",
              "  (welcome, big group opener, making & games, movement break, calm",
              "  close), then packs the party bag from the picks' real materials",
              "  fields through the Kit Bag's aggregation. Honest thin coverage:",
              "  when an occasion holds fewer real activities than the arc has",
              "  parts, the page says so in numbers and offers the nearest real",
              "  options. It never pads a plan. Printable party sheet + copy-as-text.",
              f"- collections.html, Curated collections: {len(colls)} teacher-ready bundles (rainy-day",
              "  rescue, first day, sub tub, winter party, spring burst, summer splash, haunted halls, grateful gathering, winter lights…)",
              "  each with a curator's note per pick; printable and copy-able per collection.",
              "- api.html. API docs with a Try-the-API console (endpoint picker, fetch, pretty JSON).",
              "- review.html, Scout review queue: pending activity ideas plus the 90-day",
              "  decision log. Tries the live /api/review-queue first, falls back to the",
              "  static data/v1 JSON with an honest cached badge when the server is down.",
              "", "## Docs", "- API.md, full API reference", "- PIPELINE.md, how the library grows",
              "- AGENT.md. How an agent uses this archive: endpoints, example requests,",
              "  end-to-end workflows (filtering, party planning, week planning)"]
    open(os.path.join(SITE, 'llms.txt'), 'w').write('\n'.join(lines) + '\n')

    full = lines + ["", "## All activities"]
    for a in sorted(acts, key=lambda x: x['name']):
        catnames = ', '.join(catmap[c]['name'] for c in a['categories'])
        full.append(f"\n### {a['name']}")
        full.append(f"{a['tagline']}")
        full.append(f"Categories: {catnames} | Ages {a['age_min']}-{a['age_max']} | "
                    f"Group {a['group_min']}-{a['group_max']} | {a['time_min']}-{a['time_max']} min | "
                    f"{'No prep' if a['no_prep'] else 'Prep needed'} | {'/'.join(a['location'])}")
        full.append(f"Page: activity/{a['id']}.html")
    open(os.path.join(SITE, 'llms-full.txt'), 'w').write('\n'.join(full) + '\n')

    # 4. sitemap.xml
    urls = ["", "desk.html", "planner.html", "kitbag.html", "sub.html", "party.html", "fieldtrip.html", "collections.html", "api.html", "review.html", "halloween.html", "thanksgiving.html", "winter.html", "spring.html", "summer.html"] + [f"activity/{a['id']}.html" for a in acts]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        loc = SITE_URL + "/" if u == "" else f"{SITE_URL}/{u}"
        sm.append(f'  <url><loc>{loc}</loc><lastmod>{today}</lastmod></url>')
    sm.append('</urlset>')
    open(os.path.join(SITE, 'sitemap.xml'), 'w').write('\n'.join(sm) + '\n')

    # 5. robots.txt (rotation 13 placement): allow-all + Sitemap pointer
    # at the live domain (this repo publishes sitemap.xml).
    open(os.path.join(SITE, 'robots.txt'), 'w').write(
        "User-agent: *\nAllow: /\n\nSitemap: " + SITE_URL + "/sitemap.xml\n")

    # 6. Placement pass: generator-owned <head> meta on every page.
    n_pages, n_updated = inject_site_meta(acts, colls)
    n_fonts = inject_font_delivery()
    print(f"font delivery (QA-013): self-hosted preload on {n_fonts} pages, no external font calls")
    n_headers = inject_minimal_headers()
    print(f"minimal header (rotation 20): one primary row + More on {n_headers} pages")
    print(f"placement: meta block on {n_updated}/{n_pages} pages.")

    # 7. Round 2 (Claude consult 2026-10-24): assemble the public site/
    # output LAST, after every injection pass, so the copies carry the
    # final markup. vercel.json outputDirectory is "site", so only the
    # files copied here are published. Repo-only material (WAVELOG.md,
    # README.md, PIPELINE.md, LIVE_CHECKLIST.md, scripts/, tests/,
    # pipeline/, lib/, the api/ function sources, data chunk files)
    # never leaves the repo. The copy list is the public surface the
    # served pages actually link to or fetch: every root .html page,
    # activity/, assets/, skills/ (the public skill recipes the API
    # registry and llms.txt point at), the four data/*.json files the
    # browser fetches plus all of data/v1/, the llms briefs, and the
    # three .md docs linked from served pages (AGENT.md and API.md from
    # the footers, GO_LIVE.md from api.html). llms-full.txt stays
    # public on purpose: API.md and AGENT.md document it as the public
    # full catalog for agents. site/ is gitignored build output; the
    # Vercel build command regenerates it on every deploy.
    import build_register           # the Register home: proof beside every record
    build_register.main()
    n_site = assemble_public_site()
    print(f"public site assembly (round 2): {n_site} files copied into site/")

    print(f"BUILD OK, {len(acts)} activities, {rendered} pages rendered, "
          f"{len(cats)} categories, {len(coll_records)} collections, "
          f"{len(bucket_records)} balance-bucket mappings, "
          f"api + llms + sitemap written.")

if __name__ == '__main__':
    main()
