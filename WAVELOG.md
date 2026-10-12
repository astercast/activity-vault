# Activity Vault — WAVELOG

Running record of build waves. Newest first.

## Wave 4 — 2026-10-11 — Fall/Halloween seasonal pack (+37 → 213) + Party Planner + RSS review

**What shipped:**
- **Fall/Halloween seasonal pack** — 25 new original activities (pumpkin science, spooky-not-scary
  crafts, costume parade games, fall nature walks, party stations, Día de los Muertos respectful
  crafts): measure-the-pumpkin, pumpkin-seed-sprout-baggies, apple-browning-lab,
  fall-leaf-chromatography, leaf-animal-collage, paper-bag-ghost-puppets, handprint-bat-garland,
  spiderweb-plate-weave, papel-picado-banners, egg-carton-spider-craft, corn-husk-dolls,
  apple-print-painting, ghost-footprint-keepsake, fall-scavenger-bingo, build-a-scarecrow,
  leaf-collect-sort-science, scarecrow-dress-up-relay, costume-parade-pose-freeze,
  pin-the-hat-on-witch, glow-stick-ring-toss, pumpkin-roll-race, halloween-bingo,
  candy-corn-estimation-jar, costume-category-vote, ofrenda-memory-circle.
  Skipped 8 near-duplicate concepts already in the library (mummy-wrap-relay, spooky-story-circle,
  mini-pumpkin-bowling, sink-or-float, pinecone-bird-feeders, paper-plate-masks, leaf-rubbing,
  leaf-boat-races, baking-soda-volcano variants).
- **Season/occasion tags** — new optional `tags` field (`season:fall`, `holiday:halloween`,
  `holiday:dia-de-muertos`, `theme:spooky`), validated against a fixed vocabulary in
  `scripts/build.py`. New "Season / occasion" filter group in the browser (chips: 🎃 Fall,
  👻 Halloween, 💀 Día de los Muertos, 🕸️ Spooky), tag chips on cards + detail pages,
  `tags` multiselect in `api/v1/filters.json`, documented in API.md/PIPELINE.md.
  5 existing fall/Halloween activities retro-tagged.
- **Halloween class-party planner** (`party.html` + `assets/party.js`) — inputs (class size,
  minutes, stations, budget) → timed station-rotation plan from the seasonal pool, with
  rotation timetable, merged setup checklist, station cards, and a print-ready run sheet
  (`@media print`). Graceful warnings when stations outrun the time/budget. New nav link
  everywhere; sitemap + llms.txt updated.
- **RSS review queue cleared** — all 23 candidates reviewed: 12 accepted into the library
  (coping-strategy-cards, kindness-poster-campaign, winter-joke-slam, gratitude-door-decor,
  take-a-stand-debate, poetry-share-circle, pumpkin-letter-hunt, secret-code-decoder-wheels,
  expressionism-scream-art, dinosaur-pattern-blocks, masterpiece-coloring-gallery,
  continents-map-puzzle), each adapted in original words with an optional `source` credit link;
  10 rejected with reasons (contest announcement, book list, listicles, duplicates,
  near-duplicates of new items, state-specific pack, novel-unit tie-in); 1 deferred
  (Christmas ornaments → winter pack). Decisions logged in `pipeline/review-queue.json`.
- 8th skill: `skills/halloween-party-planner.md`. README/API.md counts → 213.

**Validation (wave 4):**
- `scripts/build.py`: BUILD OK — 213 activities, 213 pages, 0 dupes, tags/source schema pass
- `node --check` on app.js/party.js/planner.js/sub.js: pass
- Link check: 217 pages, 0 broken
- api/v1/activities.json: 213, all ids unique; tag counts: fall 18, halloween 15, spooky 6, día-de-muertos 2
- Party-pool simulation: default config (24 kids / 60 min / 3 stations / shoestring) → 6 candidates, OK; tight configs degrade to a helpful warning, not a broken plan
- Fixed a latent build bug: the render assertion used the raw name, failing on `&` (Leaf Collect & Sort); now checks the escaped name

## Wave 2d — 2026-10-11 — Final chunk7c merge (+10 → 176) + Sub Tub tool

Merged the last of the parallel `data/chunk7c.json` batch: 10/12 new (0 dupes).
`birthday-lineup` + `balloon-tennis` skipped — near-identical activities already exist
from the Wave 2 batch (same classic concepts); kept the existing pages, no near-duplicate
clutter. Total: **176 activities**.

New tool — **Sub Tub** (`sub.html` + `assets/sub.js`): the substitute-teacher rescue kit.
Inputs: grade band (PreK–K / 1–2 / 3–5 / 6–8), minutes to fill (15–90), materials on hand
(nothing / paper & pencils / basic art supplies / full classroom), location (indoors / outdoors OK).
Generates a sequenced print-ready emergency plan (opener → mains → calm closer, exact-minute
fill with a filler block for gaps) plus an editable "Dear sub" note template with copy button.
Screenshot-friendly one-pager via `@media print`.

Also: 7th skill `skills/sub-tub-rescue.md`; nav links (Browse / Plan my week / Sub Tub) on
index, planner, sub, and all activity pages; `sub.html` added to sitemap.xml and llms.txt
(new Tools section); README counts → 176.

## Wave 3 — 2026-10-11 — Sub Tub feature + chunk7c merge (166 → 176)

**What shipped:**
- **Sub Tub 🆘** — substitute-teacher rescue kit: `sub.html` emergency plan generator
  (grade band, minutes to fill, materials on hand, location → sequenced print-ready plan
  + "Dear sub" note template), new `skills/sub-tub-rescue.md`, nav links, sitemap entry
- Merged `data/chunk7c.json` (10 new, 2 id-collisions with wave-2 content skipped in favor
  of existing entries): human-bingo, desert-island-picks, paper-plate-skating,
  cup-song-circle, shadow-puppet-theatre, sock-puppet-studio, fortune-teller-folding,
  nature-weaving-looms, rock-cairn-balance, string-figure-games
- Total: **176 activities**, 11 categories

**Validation (wave 3):**
- `scripts/build.py`: BUILD OK — 176 activities, 176 pages, schema/ids/categories/ranges
- `node --check assets/app.js assets/planner.js`: pass
- Link check: 179 pages, 0 broken
- api/v1/activities.json: 176, all ids unique

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
