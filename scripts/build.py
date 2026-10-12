#!/usr/bin/env python3
"""Activity Vault build script.

Source of truth: data/activities.json + data/categories.json
Generates: activity/*.html, api/v1/*.json, api/v1/schema/*.schema.json,
           llms.txt, llms-full.txt, sitemap.xml
Validates: schema, ids, categories, required fields, render check for every activity.
"""
import json, os, re, sys, html
from datetime import date, datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')
SITE = ROOT  # site root (GitHub Pages-style static)

REQUIRED = ['id','name','tagline','categories','age_min','age_max','group_min','group_max',
            'time_min','time_max','location','materials','no_prep','setup','steps','variations']
ID_RE = re.compile(r'^[a-z0-9-]+$')

# Optional tag vocabulary. Tags drive the "Season / occasion" filter.
# New tags must be added here AND to assets/app.js (TAG_LABELS) AND api docs.
TAG_IDS = ["season:fall", "season:winter", "season:spring", "season:summer", "holiday:halloween", "holiday:dia-de-muertos",
           "holiday:christmas", "holiday:hanukkah", "holiday:kwanzaa", "holiday:new-year",
           "holiday:easter", "holiday:earth-day", "holiday:july-4th",
           "theme:spooky"]
TAG_LABELS = {
    "season:fall": "🎃 Fall",
    "season:winter": "❄️ Winter",
    "season:spring": "🌷 Spring",
    "season:summer": "☀️ Summer",
    "holiday:halloween": "👻 Halloween",
    "holiday:dia-de-muertos": "💀 Día de los Muertos",
    "holiday:christmas": "🎄 Christmas",
    "holiday:hanukkah": "🕎 Hanukkah",
    "holiday:kwanzaa": "🖤 Kwanzaa",
    "holiday:new-year": "🎆 New Year",
    "holiday:easter": "🐣 Easter",
    "holiday:earth-day": "🌎 Earth Day",
    "holiday:july-4th": "🇺🇸 July 4th",
    "theme:spooky": "🕸️ Spooky (not scary)",
}

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
      <a href="../collections.html">Collections 📚</a>
      <a href="../spring.html">Spring 🌷</a>
      <a href="../summer.html">Summer ☀️</a>
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
    <section class="rate-box no-print" aria-labelledby="h-rate">
      <h2 id="h-rate">⭐ Tried this? Rate it</h2>
      <p class="rate-privacy">Your ratings live in <strong>this browser only</strong> — nobody else can see them. There are no community ratings here; every star on this card is yours.</p>
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
        <h3>✏️ Quick reflection</h3>
        <p class="rate-privacy">Optional — saved with your rating, and exported with "📋 Copy my week".</p>
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
    </section>
    <div class="print-actions no-print">
      <button type="button" class="btn" onclick="window.print()">🖨️ Print this card</button>
      <button type="button" class="btn btn-ghost" id="copy-card-link">🔗 Copy card link</button>
      <span class="copy-status" id="copy-card-status" role="status" aria-live="polite"></span>
      <a class="btn btn-ghost" href="../planner.html">Add to my week →</a>
    </div>
    <p class="print-only print-url">Full activity card — <span class="print-url-here"></span></p>
  </article>
</main>
<footer class="site-footer no-print">
  <div class="wrap"><p>Activity Vault — the all-in-one activity archive for teachers &amp; after-school programs.</p></div>
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
try{{document.execCommand('copy');flash('Copied ✓');}}catch(e){{flash('Copy failed — copy the URL manually.');}}
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
<script>
(function(){{'use strict';
/* Personal rating widget — stars + note + reflection, localStorage only. */
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
  else{{flash('Could not save — is private browsing blocking storage?');}}
}}
form.addEventListener('submit',function(ev){{
  ev.preventDefault();
  var e=currentEntry();
  if(!e.stars){{flash('Pick 1\u20135 stars first.');return;}}
  persist(e,'Saved \u2014 you rated this '+e.stars+' of 5 stars. Your ratings stay in this browser.');
}});
Array.prototype.forEach.call(form.querySelectorAll('input[name="av-rate"]'),function(r){{
  /* Native radio group: arrow keys move, Enter/Space selects — no custom key handling. */
  r.addEventListener('change',function(){{
    var e=currentEntry();
    persist(e,'Saved \u2014 '+e.stars+' of 5 stars. Ratings stay in this browser.');
  }});
}});
document.getElementById('rate-note').addEventListener('change',function(){{
  var e=currentEntry();
  if(!e.stars&&!R.getRating(ACT_ID)){{flash('Pick 1\u20135 stars first \u2014 the note saves with your rating.');return;}}
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
    assert len(colls) == 10, f"expected 10 collections, got {len(colls)}"
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
    endpoints = [
        {"path": "api/v1/index.json",
         "title": "API manifest",
         "description": "Self-describing manifest of every API endpoint: title, description, schema URL, "
                        "updated timestamp, record counts, stability, and deprecation notes. Start here.",
         "schema": "api/v1/schema/index.schema.json",
         "updated": today, "stability": "stable"},
        {"path": "api/v1/activities.json",
         "title": "Full activity library",
         "description": "Every activity record: filters (age, time, group, location, materials, no_prep), "
                        "setup, steps, variations, safety, optional season/occasion tags, optional source URL.",
         "schema": "api/v1/schema/activities.schema.json",
         "updated": today, "records": len(acts), "stability": "stable"},
        {"path": "api/v1/categories.json",
         "title": "Category definitions",
         "description": "The 11 categories: id, name, blurb, color, glyph.",
         "schema": "api/v1/schema/categories.schema.json",
         "updated": today, "records": len(cats), "stability": "stable"},
        {"path": "api/v1/filters.json",
         "title": "Filter configuration",
         "description": "Machine-readable filter configuration — the same matching logic the browser UI uses "
                        "(range, select, multiselect, boolean, text search across name/tagline/materials/steps).",
         "schema": "api/v1/schema/filters.schema.json",
         "updated": today, "stability": "stable"},
        {"path": "api/v1/skills.json",
         "title": "Skills registry",
         "description": "Registry of the reusable skill recipes in skills/: id, description, and file path.",
         "schema": None,
         "updated": today, "records": len(skills), "stability": "stable"},
        {"path": "api/v1/collections.json",
         "title": "Curated collections",
         "description": "Teacher-ready activity bundles for specific moments (rainy days, first "
                        "days, last 10 minutes, bus rides, sub coverage, winter parties, no-prep "
                        "gaps, calm-down needs). Each collection lists activity ids with a "
                        "curator's one-line note on why each was picked, plus age/time spans.",
         "schema": "api/v1/schema/collections.schema.json",
         "updated": today, "records": len(coll_records), "stability": "stable"},
        {"path": "api/v1/balance-buckets.json",
         "title": "Energy balance buckets",
         "description": "The 5 energy buckets (movement, calm, creative, outdoor, all-rounder) "
                      "and the category-to-bucket mapping the Smart Weekly Planner's balance "
                      "meter uses. An activity's bucket comes from its primary category.",
         "schema": "api/v1/schema/balance-buckets.schema.json",
         "updated": today, "records": len(bucket_records), "stability": "stable"},
        {"path": "pipeline/review-queue.json",
         "title": "RSS review queue",
         "description": "RSS-pipeline working queue: accepted / rejected / deferred activity candidates "
                        "under review, with decisions and source links.",
         "schema": None, "updated": None, "stability": "internal",
         "notes": "Not a stable public API — statuses and shape change as the pipeline runs. "
                  "Treat undated numbers as stale."},
    ]
    manifest = {
        "meta": {
            "site": "Activity Vault",
            "version": "1.0.0",
            "generated": datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
            "source_snapshot": ("data/activities.json + data/categories.json — "
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
             "Hundreds of real, classic, public-domain activity concepts — filterable by age, time,",
             "group size, materials, and category. Plan-my-week planner. Printable one-page cards.", "",
             "## Categories"]
    for c in cats:
        n = sum(1 for a in acts if c['id'] in a['categories'])
        lines.append(f"- {c['name']}: {n} activities — {c['blurb']}")
    lines += ["", "## API — start at api/v1/index.json (self-describing manifest)"]
    for ep in endpoints:
        if ep['path'].startswith('api/'):
            lines.append(f"- {ep['path']} — {ep['title'].lower()}")
    lines += ["", "## Skills"]
    for s in skills:
        lines.append(f"- {s['file']} — {s['description']}")
    lines += ["", "## Tools",
              "- sub.html — Sub Tub: the substitute-teacher rescue kit.",
              "  Pick grade band, minutes to fill, materials on hand, location —",
              "  generates a sequenced print-ready emergency plan plus a 'Dear sub' note template.",
              "- party.html — Party Planner (Halloween, winter, spring, and summer presets).",
              "  Pick a theme, class size, minutes, stations, and budget — generates a timed",
              "  station-rotation plan from seasonal activities, plus a setup list and a",
              "  print-ready run sheet.",
              "- spring.html — Spring hub: the spring 2027 pack's crafts, outdoor games,",
              "  spring science, rainy-day backups, and spring-holiday activities, plus the",
              "  Spring Burst collection and a spring party-theme shortcut.",
              "- summer.html — Summer hub: the summer 2027 pack's water play, outdoor games,",
              "  summer crafts, beat-the-heat indoor backups, and camp + July 4th activities,",
              "  plus the Summer Splash collection and a summer party-theme shortcut.",
              "- planner.html — Smart Weekly Planner 2.0: program presets (after-school / camp /",
              "  classroom), age bands, auto-built no-repeat weeks with a per-day energy balance meter,",
              "  drag-and-drop reorder, per-slot swap, surprise gap-fill, prep-level caps, collection",
              "  seeding (?from=collection:<id>), named saved plans, .ics calendar export, shareable",
              "  ?plan= links, and a print-ready card deck.",
              "- collections.html — Curated collections: 10 teacher-ready bundles (rainy-day",
              "  rescue, first day, sub tub, winter party, spring burst, summer splash…)",
              "  each with a curator's note per pick; printable and copy-able per collection.",
              "- api.html — API docs with a Try-the-API console (endpoint picker, fetch, pretty JSON).",
              "", "## Docs", "- API.md — full API reference", "- PIPELINE.md — how the library grows",
              "- AGENT.md — how an agent uses this archive: endpoints, example requests,",
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
    urls = ["", "planner.html", "sub.html", "party.html", "collections.html", "api.html", "spring.html", "summer.html"] + [f"activity/{a['id']}.html" for a in acts]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        sm.append(f'  <url><loc>/{u}</loc><lastmod>{today}</lastmod></url>')
    sm.append('</urlset>')
    open(os.path.join(SITE, 'sitemap.xml'), 'w').write('\n'.join(sm) + '\n')

    print(f"BUILD OK — {len(acts)} activities, {rendered} pages rendered, "
          f"{len(cats)} categories, {len(coll_records)} collections, "
          f"{len(bucket_records)} balance-bucket mappings, "
          f"api + llms + sitemap written.")

if __name__ == '__main__':
    main()
