#!/usr/bin/env python3
"""Wave 5 validation: schemas, AGENT.md example workflows, link checks.

Usage: python3 scripts/check_api.py
Exits non-zero on any failure.
"""
import json, os, re, sys, math, random
import jsonschema

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import TAG_IDS  # noqa: E402 — single source of truth for the tag vocabulary

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# 2026-10-12: static data lives in data/v1/ (Vercel never serves static files
# from under api/ — only real function handlers live there).
API = os.path.join(ROOT, 'data', 'v1')
failures = []

def check(name, cond, detail=""):
    print(("PASS" if cond else "FAIL"), name, detail)
    if not cond:
        failures.append(name)

# ---------- 1. index.json manifest sanity ----------
manifest = json.load(open(os.path.join(API, 'index.json')))
check("manifest version semver", re.match(r'^\d+\.\d+\.\d+$', manifest['meta']['version']) is not None)
check("manifest generated ISO-8601 UTC",
      re.match(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$', manifest['meta']['generated']) is not None,
      manifest['meta']['generated'])
_snap_acts = json.load(open(os.path.join(API, 'activities.json')))['activities']
check("manifest snapshot names counts",
      f"{len(_snap_acts)} activities" in manifest['meta']['source_snapshot'])

# ---------- 2. schema validation of every endpoint payload ----------
for ep in manifest['endpoints']:
    spath = ep.get('schema')
    if not spath:
        print("SKIP", ep['path'], "(no schema)")
        continue
    payload_path = os.path.join(ROOT, ep['path'])
    schema = json.load(open(os.path.join(ROOT, spath)))
    payload = json.load(open(payload_path))
    try:
        jsonschema.validate(payload, schema)
        check("schema: " + ep['path'], True)
    except jsonschema.ValidationError as e:
        check("schema: " + ep['path'], False, str(e)[:200])
    # record counts agree
    if 'records' in ep and ep['records'] is not None:
        n = len(payload.get('activities') or payload.get('categories')
                or payload.get('skills') or payload.get('collections')
                or payload.get('mapping') or [])
        check("count matches: " + ep['path'], n == ep['records'], f"{n} vs {ep['records']}")
    if 'updated' in ep and ep['updated'] and 'updated' in payload:
        check("updated date-only: " + ep['path'],
              re.match(r'^\d{4}-\d{2}-\d{2}$', payload.get('updated', '')) is not None)

# activity record schema on every record (strict per-record check)
act_schema = json.load(open(os.path.join(API, 'schema', 'activity.schema.json')))
acts = json.load(open(os.path.join(API, 'activities.json')))['activities']
bad = 0
for a in acts:
    try:
        jsonschema.validate(a, act_schema)
    except jsonschema.ValidationError:
        bad += 1
check(f"all {len(acts)} activity records validate against activity.schema.json", bad == 0, f"bad={bad}")
check("0 duplicate ids", len({a['id'] for a in acts}) == len(acts))
check("tags use fixed vocabulary",
      all(t in TAG_IDS for a in acts for t in a.get('tags', [])))

# ---------- 2b. Wave 9: collections — every pick resolves to a real activity id ----------
coll_payload = json.load(open(os.path.join(API, 'collections.json')))
colls = coll_payload['collections']
act_ids = {a['id'] for a in acts}
check("collections: 32 collections", len(colls) == 32, f"{len(colls)} found")
check("collections: unique ids", len({c['id'] for c in colls}) == len(colls))
check("collections: 8-12 picks each",
      all(8 <= len(c['picks']) <= 12 for c in colls))
unresolved = [(c['id'], p['activity_id']) for c in colls for p in c['picks']
              if p['activity_id'] not in act_ids]
check("collections: every pick resolves to a real activity id",
      not unresolved, str(unresolved[:5]) if unresolved else
      f"{sum(len(c['picks']) for c in colls)} picks resolve")
check("collections: curator note on every pick",
      all((p.get('curator_note') or '').strip() for c in colls for p in c['picks']))

# ---------- 2c. Wave 10: balance-buckets — every category maps to one bucket ----------
bb_payload = json.load(open(os.path.join(API, 'balance-buckets.json')))
bb_map = bb_payload['mapping']
bb_buckets = bb_payload['buckets']
cat_ids = {c['id'] for c in json.load(open(os.path.join(API, 'categories.json')))['categories']}
check("balance-buckets: 11 mappings", len(bb_map) == 11, f"{len(bb_map)} found")
check("balance-buckets: every category mapped once",
      {r['category'] for r in bb_map} == cat_ids)
check("balance-buckets: bucket vocab fixed",
      all(r['bucket'] in ('movement', 'calm', 'creative', 'outdoor', 'mixed') for r in bb_map))
check("balance-buckets: 5 bucket definitions", len(bb_buckets) == 5,
      str([b['id'] for b in bb_buckets]))
check("balance-buckets: mapping labels match defs",
      all(any(b['id'] == r['bucket'] and b['label'] == r['bucket_label']
                and b['glyph'] == r['bucket_glyph'] for b in bb_buckets) for r in bb_map))

# ---------- 3. AGENT.md workflow 1: rainy-day for 8-year-olds ----------
w1 = [a for a in acts
      if 'rainy-day' in a['categories'] and 'indoor' in a['location']
      and a['age_min'] <= 8 <= a['age_max'] and a['time_min'] <= 30]
check("workflow1: rainy-day/8yo/indoor/30min matches", len(w1) >= 10, f"{len(w1)} matches")
print("   sample:", ", ".join(a['id'] for a in w1[:5]))

# ---------- 4. AGENT.md workflow 2: Halloween party 24 kids / 60 min / 3 stations ----------
PARTY_TAGS = ['holiday:halloween', 'holiday:dia-de-muertos', 'season:fall', 'theme:spooky']
PARTY_CATS = ['crafts', 'pe-movement', 'rainy-day', 'quiet-focus', 'team-community', 'icebreakers']
CHEAP = ['paper', 'crayon', 'marker', 'pencil', 'pen', 'glue', 'scissors',
         'tape', 'balloon', 'bag', 'plate', 'cup', 'string', 'yarn', 'dice', 'card',
         'chalk', 'sticker', 'ribbon', 'towel', 'tissue', 'newspaper',
         'box', 'sock', 'button', 'cotton', 'pipe cleaner', 'toothpick']
class_size, minutes, stations = 24, 60, 3
round_min = math.floor((minutes - 10) / stations)
per_group = math.ceil(class_size / stations)
pool = [a for a in acts
        if any(t in (a.get('tags') or []) for t in PARTY_TAGS)
        and any(c in PARTY_CATS for c in a['categories'])
        and a['time_min'] <= round_min + 5
        and a['group_min'] <= per_group <= a['group_max']
        and (not a['materials'] or all(any(w in m['item'].lower() for w in CHEAP)
                                      for m in a['materials']))]
check("workflow2: party pool non-empty", len(pool) >= 3, f"{len(pool)} candidates")
order = sorted(pool, key=lambda a: ((not a['no_prep']), -a['time_max'], a['id']))
picks, used_cats, remaining = [], set(), order[:]
while len(picks) < stations and remaining:
    idx = next((i for i, a in enumerate(remaining) if a['categories'][0] not in used_cats), 0)
    picks.append(remaining.pop(idx))
    used_cats.add(picks[-1]['categories'][0])
check("workflow2: 3 stations picked", len(picks) == 3, str([a['id'] for a in picks]))
print("   plan: 0:00-0:05 welcome |",
      " | ".join(f"{a['id']} ({round_min} min, group of {per_group})" for a in picks),
      "| regroup")

# ---------- 4b. Winter party preset: same shape, winter tags, 5-min warm-up break ----------
WINTER_TAGS = ['holiday:christmas', 'holiday:new-year', 'season:winter']
w_round_min = math.floor((minutes - 10 - 5) / stations)  # minus the cozy warm-up break
wpool = [a for a in acts
         if any(t in (a.get('tags') or []) for t in WINTER_TAGS)
         and any(c in PARTY_CATS for c in a['categories'])
         and a['time_min'] <= w_round_min + 5
         and a['group_min'] <= per_group <= a['group_max']
         and (not a['materials'] or all(any(w in m['item'].lower() for w in CHEAP)
                                       for m in a['materials']))]
check("winter preset: party pool non-empty", len(wpool) >= 3, f"{len(wpool)} candidates")
worder = sorted(wpool, key=lambda a: ((not a['no_prep']), -a['time_max'], a['id']))
wpicks, wused_cats, wremaining = [], set(), worder[:]
while len(wpicks) < stations and wremaining:
    widx = next((i for i, a in enumerate(wremaining) if a['categories'][0] not in wused_cats), 0)
    wpicks.append(wremaining.pop(widx))
    wused_cats.add(wpicks[-1]['categories'][0])
check("winter preset: 3 stations picked", len(wpicks) == 3, str([a['id'] for a in wpicks]))

# ---------- 5. AGENT.md workflow 3: week plan, 4th grade (ages 9-10), 5x2, 45 min ----------
random.seed(7)
pool3 = [a for a in acts if a['age_min'] <= 10 and a['age_max'] >= 9 and a['time_min'] <= 45]
plan, used_ids, used_cats3 = [], set(), set()
random.shuffle(pool3)
for day in range(5):
    for slot in range(2):
        cands = [a for a in pool3 if a['id'] not in used_ids]
        if not cands:
            break
        cands.sort(key=lambda a: (0 if any(c not in used_cats3 for c in a['categories']) else 1,
                                  a['id']))
        plan.append(cands[0])
        used_ids.add(cands[0]['id'])
        used_cats3.update(cands[0]['categories'])
check("workflow3: 10 distinct slots", len(plan) == 10, f"{len(plan)} slots")
check("workflow3: >= 5 distinct categories", len(used_cats3) >= 5, str(sorted(used_cats3)))

# ---------- 6. link check: HTML href/src resolve; llms.txt links resolve ----------
html_files = []
for dirpath, _, fns in os.walk(ROOT):
    if '.git' in dirpath:
        continue
    for fn in fns:
        if fn.endswith('.html'):
            html_files.append(os.path.join(dirpath, fn))
url_re = re.compile(r'''(?:href|src)="([^"#]+?)(?:#[^"]*)?"''')
broken = []
for f in html_files:
    base = os.path.dirname(f)
    for m in url_re.finditer(open(f, encoding='utf-8').read()):
        u = m.group(1)
        if u.startswith(('http', 'mailto:', 'data:', 'javascript:')) or u == '':
            continue
        u = u.split('?')[0]  # query strings (?tag=, ?from=collection:) are client-side deep links
        if u == '':
            continue
        target = os.path.normpath(os.path.join(base, u))
        if not os.path.exists(target):
            broken.append(f"{os.path.relpath(f, ROOT)} -> {u}")
check("link check: 0 broken", not broken, str(broken[:5]) if broken else f"{len(html_files)} pages")

llms = open(os.path.join(ROOT, 'llms.txt')).read()
path_re = re.compile(r'^- (api/|data/|skills/|pipeline/|[a-zA-Z0-9_.-]+\.(html|md|txt))')
# Rotation 21: llms.txt entry lines are dash-free now (comma / colon /
# parenthetical separators), so the link is the first whitespace-delimited
# token after the bullet, with any trailing separator punctuation removed.
llms_links = [l[2:].split()[0].rstrip('.,')
              for l in llms.splitlines() if path_re.match(l)]
missing = [l for l in llms_links
           if not l.startswith('http') and not os.path.exists(os.path.join(ROOT, l))]
check("llms.txt links resolve", not missing, str(missing[:5]) if missing else f"{len(llms_links)} links")

print()
if failures:
    print("FAILURES:", failures)
    sys.exit(1)
print("ALL CHECKS PASSED")
