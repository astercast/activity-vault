#!/usr/bin/env python3
"""Activity Vault build script.

Source of truth: data/activities.json + data/categories.json
Generates: activity/*.html, api/v1/*.json, llms.txt, llms-full.txt, sitemap.xml
Validates: schema, ids, categories, required fields, render check for every activity.
"""
import json, os, re, sys, html
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')
SITE = ROOT  # site root (GitHub Pages-style static)

REQUIRED = ['id','name','tagline','categories','age_min','age_max','group_min','group_max',
            'time_min','time_max','location','materials','no_prep','setup','steps','variations']
ID_RE = re.compile(r'^[a-z0-9-]+$')

# Optional tag vocabulary. Tags drive the "Season / occasion" filter.
# New tags must be added here AND to assets/app.js (TAG_LABELS) AND api docs.
TAG_IDS = ["season:fall", "holiday:halloween", "holiday:dia-de-muertos", "theme:spooky"]
TAG_LABELS = {
    "season:fall": "🎃 Fall",
    "holiday:halloween": "👻 Halloween",
    "holiday:dia-de-muertos": "💀 Día de los Muertos",
    "theme:spooky": "🕸️ Spooky (not scary)",
}

def load():
    acts = json.load(open(os.path.join(DATA, 'activities.json')))
    cats = json.load(open(os.path.join(DATA, 'categories.json')))
    return acts, cats

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
        if src is not None and (not isinstance(src, str) or not src.startswith('http')):
            errs.append(f"{tag}: source must be an http(s) URL")
    return errs

ACTIVITY_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{name} — Activity Vault</title>
<meta name="description" content="{tagline}">
<link rel="stylesheet" href="../assets/style.css">
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
      <a href="../planner.html">Plan my week</a>
      <a href="../sub.html">Sub Tub 🆘</a>
      <a href="../party.html">Party Planner 🎃</a>
    </nav>
  </div>
</header>
<main id="main" class="wrap activity-page">
  <p class="crumbs no-print"><a href="../index.html">← All activities</a></p>
  <article class="activity-card print-card" aria-labelledby="act-title">
    <div class="cat-chips">{chips}</div>
    <h1 id="act-title">{name}</h1>
    <p class="tagline">{tagline}</p>
    <dl class="fact-grid">
      <div><dt>Ages</dt><dd>{age_min}–{age_max}</dd></div>
      <div><dt>Group</dt><dd>{group_min}–{group_max} kids</dd></div>
      <div><dt>Time</dt><dd>{time_min}–{time_max} min</dd></div>
      <div><dt>Where</dt><dd>{location}</dd></div>
      <div><dt>Prep</dt><dd>{prep}</dd></div>
    </dl>
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
    <div class="print-actions no-print">
      <button type="button" class="btn" onclick="window.print()">🖨️ Print this card</button>
      <a class="btn btn-ghost" href="../planner.html">Add to my week →</a>
    </div>
  </article>
</main>
<footer class="site-footer no-print">
  <div class="wrap"><p>Activity Vault — the all-in-one activity archive for teachers &amp; after-school programs.</p></div>
</footer>
</body>
</html>
"""

def esc(s):
    return html.escape(str(s), quote=True)

def render_activity(a, catmap):
    chips = ''.join(
        f'<span class="chip" style="--cat:{catmap[c]["color"]}">{catmap[c]["glyph"]} {esc(catmap[c]["name"])}</span>'
        for c in a['categories'])
    tagchips = ''.join(
        f'<span class="chip tag-chip">{esc(TAG_LABELS.get(t, t))}</span>'
        for t in a.get('tags', []))
    mats = ''.join(f'<li>{esc(m["item"])}</li>' for m in a['materials'])
    if not a['materials']:
        mats = '<li><em>No materials needed.</em></li>'
    steps = ''.join(f'<li>{esc(s)}</li>' for s in a['steps'])
    safety = ''
    if a.get('safety'):
        safety = ('<section class="safety" aria-labelledby="h-safety">'
                  f'<h2 id="h-safety">⚠️ Safety</h2><p>{esc(a["safety"])}</p></section>')
    source = ''
    if a.get('source'):
        source = (f'<p class="source-line">Inspired by an idea from the teaching community — '
                  f'<a href="{esc(a["source"])}" rel="noopener">source post</a> '
                  f'(adapted in our own words).</p>')
    prep = '✅ No prep needed' if a['no_prep'] else 'Some prep needed'
    loc = ' & '.join('Indoors' if l=='indoor' else 'Outdoors' for l in a['location'])
    return ACTIVITY_TEMPLATE.format(
        name=esc(a['name']), tagline=esc(a['tagline']),
        chips=chips + tagchips, age_min=a['age_min'], age_max=a['age_max'],
        group_min=a['group_min'], group_max=a['group_max'],
        time_min=a['time_min'], time_max=a['time_max'],
        location=loc, prep=prep, setup=esc(a['setup']),
        materials=mats, steps=steps,
        easier=esc(a['variations']['easier']), harder=esc(a['variations']['harder']),
        safety_block=safety, source_block=source)

def main():
    acts, cats = load()
    errs = validate(acts, cats)
    if errs:
        print("VALIDATION FAILED:")
        for e in errs: print(" -", e)
        sys.exit(1)
    catmap = {c['id']: c for c in cats}
    today = date.today().isoformat()

    # 1. activity pages
    actdir = os.path.join(SITE, 'activity')
    os.makedirs(actdir, exist_ok=True)
    rendered = 0
    for a in acts:
        page = render_activity(a, catmap)
        assert esc(a['name']) in page and len(page) > 500, f"render check failed: {a['id']}"
        with open(os.path.join(actdir, a['id'] + '.html'), 'w') as f:
            f.write(page)
        rendered += 1

    # 2. API
    api = os.path.join(SITE, 'api', 'v1')
    schemadir = os.path.join(api, 'schema')
    os.makedirs(schemadir, exist_ok=True)
    json.dump({'activities': acts, 'count': len(acts), 'updated': today},
              open(os.path.join(api, 'activities.json'), 'w'), indent=1, ensure_ascii=False)
    json.dump({'categories': cats, 'count': len(cats), 'updated': today},
              open(os.path.join(api, 'categories.json'), 'w'), indent=1, ensure_ascii=False)
    filters = {
        "age": {"type": "range", "min": 5, "max": 12, "unit": "years",
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
        "indoor_only": {"type": "boolean", "description": "Only activities with 'indoor' in location."},
        "outdoor_only": {"type": "boolean", "description": "Only activities with 'outdoor' in location."},
        "search": {"type": "text", "fields": ["name", "tagline", "materials[].item", "steps"],
                "description": "Case-insensitive substring match across name, tagline, materials, steps."}
    }
    json.dump({"filters": filters, "updated": today},
              open(os.path.join(api, 'filters.json'), 'w'), indent=1)
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
            "tags": {"type": "array", "items": {"enum": TAG_IDS},
                     "description": "Optional season/occasion tags for filtering."},
            "source": {"type": ["string", "null"], "format": "uri",
                       "description": "Optional inspiration source URL (RSS pipeline)."}
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

    # 3. llms.txt + llms-full.txt
    lines = ["# Activity Vault", "",
             "The all-in-one activity archive for teachers and after-school program teachers.",
             "Hundreds of real, classic, public-domain activity concepts — filterable by age, time,",
             "group size, materials, and category. Plan-my-week planner. Printable one-page cards.", "",
             "## Categories"]
    for c in cats:
        n = sum(1 for a in acts if c['id'] in a['categories'])
        lines.append(f"- {c['name']}: {n} activities — {c['blurb']}")
    lines += ["", "## API", "- api/v1/activities.json — full activity records",
              "- api/v1/categories.json — category definitions",
              "- api/v1/filters.json — filter configuration",
              "- api/v1/schema/activity.schema.json — JSON schema",
              "", "## Skills", "- skills/activity-finder.md", "- skills/week-planner.md",
              "- skills/rainy-day-rescue.md", "- skills/stem-demo-picker.md",
              "- skills/icebreaker-chooser.md", "- skills/quiet-focus-picker.md",
              "- skills/sub-tub-rescue.md", "- skills/halloween-party-planner.md",
              "", "## Tools", "- sub.html — Sub Tub: the substitute-teacher rescue kit.",
              "  Pick grade band, minutes to fill, materials on hand, location —",
              "  generates a sequenced print-ready emergency plan plus a 'Dear sub' note template.",
              "- party.html — Halloween Class-Party Planner.",
              "  Pick class size, minutes, stations, and budget — generates a timed station-rotation",
              "  plan from seasonal activities, plus a setup list and a print-ready run sheet.",
              "", "## Docs", "- API.md — full API reference", "- PIPELINE.md — how the library grows"]
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
    urls = ["", "planner.html", "sub.html", "party.html"] + [f"activity/{a['id']}.html" for a in acts]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        sm.append(f'  <url><loc>/{u}</loc><lastmod>{today}</lastmod></url>')
    sm.append('</urlset>')
    open(os.path.join(SITE, 'sitemap.xml'), 'w').write('\n'.join(sm) + '\n')

    print(f"BUILD OK — {len(acts)} activities, {rendered} pages rendered, "
          f"{len(cats)} categories, api + llms + sitemap written.")

if __name__ == '__main__':
    main()
