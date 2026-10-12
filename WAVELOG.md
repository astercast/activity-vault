# Activity Vault — WAVELOG

Running record of build waves. Newest first.

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
