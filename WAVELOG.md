# Activity Vault — WAVELOG

Running record of build waves. Newest first.

## Wave 2c — 2026-10-11 — Merged parallel chunk7b (+12 → 166)

Merged the sibling's `data/chunk7b.json` (12 activities, same schema, 0 dupes).
Total: **166 activities**. Rebuilt + revalidated.

## Wave 2b — 2026-10-11 — Merged parallel chunk7 (+16 → 154)

A parallel builder was adding `data/chunk7.json` (16 activities, same schema) concurrently.
Merged with id-dedupe (16/16 new, 0 dupes), rebuilt, revalidated. Total: **154 activities**.
`data/chunk7.json` retained for provenance; the validator rejects duplicate ids, so any
re-merge would fail loudly rather than corrupt.

## Wave 2 — 2026-10-11 — Content expansion: 66 → 138 activities

**What shipped:**
- Merged 72 new original activities (researched from teaching blogs, described in our own words) into `data/activities.json` via `scripts/convert_wave2.py` (schema-converted from staged drafts; 17 near-duplicates of wave-1 activities skipped)
- New **Music & Rhythm** category (7 activities: cup rhythms, bucket drumming, rhythm name game, sound story, parody songs, dance tutorial, shaker instruments)
- Every new activity carries the full schema: safety note, setup, steps, easier/harder variations
- Regenerated: 138 activity pages, api/v1, llms.txt/llms-full.txt, sitemap.xml
- README counts updated (66 → 138, 10 → 11 categories)

**Validation (wave 2):**
- `scripts/build.py`: BUILD OK — schema, id uniqueness, category ids, ranges, all 138 pages rendered
- `node --check assets/app.js assets/planner.js`: pass
- Link check: 140 pages, 0 broken
- api/v1/activities.json count: 138


## Wave 1 — 2026-10-11 — Foundation build

**Commit:** `3590dd45edd9dad681f1c6bf0ede212b5aa20b17` (content) + WAVELOG commit below.

**What shipped:**
- Full site scaffold: `index.html` (filter browser), `planner.html` (plan-my-week), `assets/` (style.css, app.js, planner.js)
- `data/activities.json` source of truth — **66 activities**, all original descriptions of classic public-domain concepts
- `scripts/build.py` — schema validator + static generator (activity pages, api/v1, llms.txt, llms-full.txt, sitemap.xml)
- 66 generated `activity/<id>.html` detail pages, each print-ready as a one-page card
- `api/v1/`: activities.json, categories.json, filters.json, schema/activity.schema.json, schema/category.schema.json
- `llms.txt` + `llms-full.txt` (generated)
- 6 skills: activity-finder, week-planner, rainy-day-rescue, stem-demo-picker, icebreaker-chooser, quiet-focus-picker
- Docs: README.md, API.md, GO_LIVE.md, PIPELINE.md

**Activity count by category** (activities can carry multiple tags):

| Category | Count |
|---|---|
| Seasons 🍂 | 8 |
| Holidays 🎉 | 6 |
| Crafts ✂️ | 21 |
| STEM 🔬 | 11 |
| PE & Movement ⚽ | 14 |
| Team & Community 🤝 | 11 |
| Icebreakers 👋 | 11 |
| Outdoor 🌳 | 18 |
| Rainy Day 🌧️ | 12 |
| Quiet & Focus 🧘 | 19 |

45 of 66 activities are no-prep. 53 indoor-capable, 32 outdoor-capable.

**Validation (wave 1):**
- `scripts/build.py`: BUILD OK — schema, id uniqueness, category ids, ranges, all 66 pages rendered
- `node --check assets/app.js assets/planner.js`: pass
- Link check: 411 local links, 0 broken
- JSON parse: all api + data files parse
- Every activity renders: 66/66 pages contain their activity name

**Notes:** One build failure caught and fixed in-wave (`jump-rope-countdown` missing `setup` field) — validator did its job. Repo is private; GitHub Pages go-live deferred to user's call per GO_LIVE.md.
