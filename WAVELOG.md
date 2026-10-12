# Activity Vault — WAVELOG

Running record of build waves. Newest first.

## Wave 10 — 2026-10-11 — Smart Weekly Planner 2.0 (flagship interactive tool)

**What shipped:**
- **Auto-built balanced weeks** (`assets/planner-core.js` — pure, UMD, works in browser + Node): pick program type (`after-school` / `camp` / `classroom` presets with slots, minutes, indoor rules, `.ics` start hours), age band (`prek-k` → `all`), days (Mon–Sun), slots/day (1–4), minutes/activity, and the core deals a no-repeat week from the real 238 via balance-aware scoring (`day_bucket_count × 3 + week_bucket_count + 2 × used_category`, ties shuffled, seeded PRNG for reproducibility).
- **Balance meter**: 5 energy buckets from new `data/balance-buckets.json` (⚡ movement, 🧘 calm, 🎨 creative, 🌳 outdoor, 🔀 all-rounder — every one of the 11 categories maps to exactly one; an activity's bucket = its primary category). Per-day + whole-week visual meters (segmented bars, `role="img"` + text legend) with human warnings: non-`mixed` bucket > 50% of a day's slots (movement → "lands softly", calm → "sleepy", creative → "cleanup", outdoor → "indoor backup", 3+ slots zero calm → "quiet landing"), plus week checks (no movement across 4+ slots, no calm across 6+).
- **No-repeat logic + prep caps**: configurable max prep-heavy activities/week (0–5, default 2); repeats only when explicitly allowed; gaps stay visible as open slots instead of silent repeats.
- **Day shaping tools**: drag-and-drop reorder within days (HTML5 DnD; ↑/↓ buttons as the keyboard path, moves announced via `aria-live`), per-slot 🔀 swap (balance-friendly fresh pick, never repeats, respects prep cap), 🎲 "Surprise me" gap fill.
- **Saved plans + exports**: multiple named plans in `localStorage` (`activityvault.plans.v1`, browser-only — the honesty copy says so), client-side **`.ics` download** (floating local times from the program start hour on the next matching weekday, `DURATION = min(time_max, maxTime)`), print week plan (wave-7 card deck + per-day energy-balance header), 📋 Copy my week (wave-7 pattern incl. your ratings/reflections), 🔗 Copy plan link (`planner.html?plan=<base64url>`, validated on import — unknown ids dropped with a visible note).
- **Deep links**: `planner.html?from=collection:<id>` pre-seeds from any of the 8 collections (picks filtered by constraints, skips reported); every collection now has a "🗓️ Plan a week from this" button back to the planner.
- **API/agentic**: `api/v1/balance-buckets.json` (manifest-registered, records=11, stability stable) with enriched mapping (`category_name`, `bucket_label`, `bucket_glyph`); new draft-07 schemas `balance-bucket.schema.json` (record) + `balance-buckets.schema.json` (envelope) following the collection two-file convention; `scripts/build.py` asserts all 11 categories map exactly once. AGENT.md: week-planner input shape rewritten for 2.0 + new **Workflow 4** (programmatic week build, plan payload shape, `?plan=` link, `.ics` recipe); API.md: `GET api/v1/balance-buckets.json` + schema sections, planner deep links; `llms.txt`/`llms-full.txt` regenerated (no stale links). New skill **`skills/balanced-week-builder.md`** (11 skills registered) in the standard format.
- **Guardrails kept**: all picks resolve to real activity ids (asserted by build + headless tests); original descriptions untouched; only your own ratings shown; semantic HTML + ARIA + keyboard + `prefers-reduced-motion` (existing global rule covers the new bits); mobile-first, existing design system untouched.

**Validation (wave 10):**
- `scripts/build.py`: BUILD OK — 238 activities, 238 pages rendered, 11 categories, 8 collections, **11 balance-bucket mappings**, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — 40 checks incl. new endpoint schema validation, count 11 vs 11, 11 mappings / every category mapped once / fixed bucket vocab / 5 bucket defs / mapping labels match defs; link check 244 pages 0 broken; llms.txt links resolve
- `node --check`: planner-core.js, planner.js, collections.js, test-planner-core.js — clean
- `scripts/test-planner-core.js` (headless, new): 39 assertions pass — pool filter semantics, week respects constraints/no-repeats/prep cap, seeded determinism, collection seed placement + bogus-id drop, balance math, bucket coverage of all 238, warnings (movement/calm-heavy warn, balanced day quiet, no-calm 3-slot warns), swap (fresh id, null when exhausted), fillGaps, `.ics` (VEVENT count, DTSTART format, Monday lands on the right date, CRLF), plan encode/decode round-trip, import drops unknown ids + bad day names
- `planner.js` UI smoke test (fake-DOM, headless): 15 checks pass — generate renders 5 day cards + week balance + 10 slots + 6 meters, swap buttons present, surprise-fill no-op message, save→localStorage round-trip with real ids, copy plan link, `.ics` download anchor, `?plan=` import (dropped id noted), `?from=collection:rainy-day-rescue` seeding
- DOM id cross-check: all 28 `getElementById` ids in planner.js exist in planner.html

**Wave 10 push resolution:** _pending — filled after push._

## Wave 9 — 2026-10-11 — Curated collections (content + browse feature wave)

**What shipped:**
- **8 launch collections** (`data/collections.json`, hand-curated from the 238 — 93 picks total, every id real): 🌧️ **Rainy-day rescue** (12), 👋 **First day of the program** (12), ⏱️ **Last 10 minutes** (10), 🚌 **Field-trip bus ride** (12), 🆘 **Sub Tub essentials** (11 — ties to the Sub Tub kit), ❄️ **Winter party night** (12 — ties to the winter pack / Party Planner winter theme), ⚡ **No-prep lifesavers** (12, all no-prep), 🧘 **Calm-down corner** (12). Each pick carries a curator's one-line "why this one" note; each collection a "when to reach for it" blurb.
- **Collections browse surface** (`collections.html` + new `assets/collections.js`, mobile-first): collection card grid with counts + age/time spans; each collection renders as a section with pick cards (curator note + **your own rating badges** — "⭐ 4★ — your rating", `localStorage` only, never aggregates), a "pairs with" tie-link for the Sub Tub / Winter Party collections, per-collection **🖨️ Print this collection** (print-one via `@media print` + `afterprint` cleanup) and **📋 Copy this collection** (wave-7 text pattern + curator notes + your ratings). Hash deep links (`collections.html#winter-party-night`) open a single-collection view with an "← All collections" back link.
- **API**: `api/v1/collections.json` (manifest-registered, records=8, stability stable) — records carry `id`, `title`, `glyph`, `when_to_use`, `picks[]` (`activity_id` + `curator_note`), computed `age_span`/`time_span`, and `page` deep link. New draft-07 schemas: `api/v1/schema/collections.schema.json` (envelope) + `api/v1/schema/collection.schema.json` (record), following the activity/category two-file convention.
- **Cross-links**: planner → "📚 Start from a curated collection"; sub.html → Sub Tub essentials collection; party.html → Winter Party Night collection; collections page → back to sub.html / party.html for the two tied collections. Nav gains "Collections 📚" on all 6 page shells (incl. the 238 generated activity pages).
- **Docs**: AGENT.md key-endpoints table row + "Curated collections (wave 9)" section; API.md `GET api/v1/collections.json` section + record/envelope schema mentions; `llms.txt` tools line; `sitemap.xml` gains `collections.html`.
- **Guardrails**: `scripts/build.py` asserts 8 collections and that every pick resolves to a real activity id (build fails otherwise); `scripts/check_api.py` re-checks counts, 8–12 picks, pick resolution, and a curator note on every pick.

**Validation (wave 9):**
- `scripts/build.py`: BUILD OK — 238 activities, 238 pages rendered, 11 categories, **8 collections**, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — new endpoint validates against `collections.schema.json`, count 8 vs 8; collections: 8 collections / unique ids / 8–12 picks each / **all 93 picks resolve to a real activity id** / curator note on every pick; link check 244 pages 0 broken; llms.txt links resolve
- `node --check`: assets/collections.js + all 5 existing assets — clean
- Logic test (node): computed age_span/time_span in the API match the picks; no-prep-lifesavers is 100% no_prep; last-10-minutes all run cold at ≤15 min floors; winter-party-night picks all winter-tagged except winter-gingerbread-build (name is the tag — Paper Gingerbread Houses, holidays/crafts, wave-6 winter pack)
- Curator-note honesty check: every note is a one-line "why this one", no invented activities, original descriptions untouched

**Wave 9 push resolution:** local commit `77cca42` pushed via `gh-push.py` (260 files, first attempt, exit 0, ~5 min) — remote commit `6d675939d84d03636590438982cc7de9044129f1`. Verified via GitHub API: recursive remote tree (313 files, not truncated) contains `collections.html`, `data/collections.json`, `api/v1/collections.json`, `api/v1/schema/collections.schema.json`, `api/v1/schema/collection.schema.json`, `assets/collections.js`, `scripts/write_collections.py`, `WAVELOG.md`, and `AGENT.md`.

## Wave 8 — 2026-10-11 — Ratings + "top rated" (interactive tools wave)

**What shipped:**
- **Per-activity rating widget** — every `activity/<id>.html` page now has a "⭐ Tried this? Rate it" section (generated by `scripts/build.py`): a native 5-star radio group (fieldset + legend, arrow keys move / Enter/Space selects — no custom key handling), an optional one-line note, a "Save rating" button and "Clear my rating", plus an `aria-live="polite"` confirmation ("Saved — you rated this 4 of 5 stars"). All storage is `localStorage` only; the widget is `no-print`.
- **Reflection prompts** — after a rating is saved, 2–3 quick reflection questions appear ("What would you change next time?", "Which age band shone the most?", "Would you run it again?"), debounced autosave with the rating, exported by the planner's "📋 Copy my week".
- **Shared library `assets/ratings.js`** — `window.VaultRatings` (`getRating`/`setRating`/`clearRating`/`topRated(limit)`/`countRated`/`starsText`), key `activityvault.ratings.v1`, entry shape `{stars, note, reflections:{change,age_band,again}, ratedAt}`; sanitizes malformed entries, survives corrupt storage. Loaded (defer, before page scripts) on `index.html`, `planner.html`, `party.html`, and every activity page.
- **"Top rated" browse** — new "Your ratings" filter group on the browse page: "⭐ Sort by my rating" (rated first, best stars first; unrated sink to the bottom clearly marked "Not rated yet") and "⭐ My top 10" (rated-only top-10 view with a true deep link `index.html?view=top-rated`, which the browse page pre-selects). A banner states the honesty rule on every view: "These are *your* ratings, stored only in this browser. Activity Vault has no community ratings." Browse cards show "⭐ 4★ — your rating" badges; empty top-10 state explains how to rate. "📋 Copy collection" describes the rating view in its header.
- **Planner integration** — week planner slots show "⭐ You rated this 4★" (plus the note) on scheduled activities; "📋 Copy my week" exports each rated activity's stars, note, and all three reflections.
- **Party planner integration** — `pickStations` now orders by the user's own ratings first (unrated sink below every rated pick; no-prep/longest/id order kept within a rating); rated stations carry a "⭐ 4★ — your rating (picked first)" badge, the run sheet's copy line carries "(your rating: 4/5 stars)", and the status line says "Your top-rated stations went in first (ratings live only in your browser)".
- **Docs** — AGENT.md gains a "Personal ratings (client-side only)" section: the exact `localStorage` key and JSON shape, the `window.VaultRatings` API, the standing rule (only the user's own ratings, never aggregates — never invent an endpoint), and how each tool consumes ratings. No new API endpoint by design; `api/` untouched.

**Validation (wave 8):**
- `scripts/build.py`: BUILD OK — 238 activities, 238 pages rendered, 11 categories, 0 dupes, no warnings
- `scripts/check_api.py`: ALL CHECKS PASSED (schema, counts, vocabulary, 3 workflows, link check 243 pages 0 broken incl. the new `assets/ratings.js` src on 241 pages, llms.txt links resolve)
- `node --check`: assets/ratings.js, app.js, planner.js, party.js, sub.js + both inline activity-page scripts (copy-link + rating widget) — clean
- `ratings.js` logic test (node, stubbed localStorage): 12 assertions pass — round-trip, rejects stars=9/bad ids, topRated ordering + limit, clearRating, corrupt-storage recovery, hostile-entry sanitization
- Rating widget keyboard test (structural, no headless browser on this VM): 5 native `<input type="radio" name="av-rate">` in a `<fieldset>` with legend "Your rating (1 to 5 stars)" — native radio group semantics guarantee arrow-key movement and Enter/Space selection; no `role="radiogroup"` fakery; 2 `aria-live="polite"` status regions (rating + reflection)
- Honesty-copy check: activity pages state "this browser only … no community ratings … every star on this card is yours"; browse banner states no community ratings / no averages

**Wave 8 push resolution:** local commit `b7d7ca1` pushed via `gh-push.py` (250 files, 250 blob uploads, ~4.5 min) — remote commit `56680976fd43d74be6a570cfe05b713103c9c443`. Verified via GitHub API: remote tree contains `assets/ratings.js`, the three wired HTML pages, `AGENT.md`, `WAVELOG.md`, and regenerated activity pages (306 files in tree).

## Wave 7 — 2026-10-11 — Print + share (interactive tools wave)

**What shipped:**
- **Printable cards, polished:** every `activity/<id>.html` now prints with a print-only deep-link footer ("Full activity card — <URL>"), a "🔗 Copy card link" button (clipboard + fallback, `Copied ✓` status), and the existing "🖨️ Print this card" affordance. `.print-only` utility added; `break-inside: avoid` kept.
- **"Print my week" card deck:** planner generates a print-only deck — one card per scheduled activity (day/slot, title, ages/group/time/prep/materials/steps facts, materials list, safety, deep-link URL), one per printed page (`break-before: page`). The compact on-screen grid is screen-only in print.
- **"📋 Copy my week":** shareable text export — day/slot, name, facts, deep-link URL per activity, for pasting into email/newsletters (clipboard + textarea fallback).
- **"📋 Copy this collection":** browse page copies the current filtered collection (filter description + name/facts/deep link per card). Single-tag views get a true deep link (`index.html?tag=<tag>`); richer mixes link `index.html` with the filter description.
- **"📋 Copy party plan":** full text run sheet — stations with card links, timed rotation, setup checklist, closing.

**Validation (wave 7):**
- `scripts/build.py`: BUILD OK — 238 activities, 238 pages rendered, 11 categories, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED (schema, counts, vocabulary, 3 workflows, link check 243 pages 0 broken, llms.txt links resolve)
- `node --check` assets/app.js, planner.js, party.js, sub.js: pass
- Print CSS reviewed by hand (no headless browser on this VM): `.print-only` hidden on screen / block in print, deck pagination, print URL footers; no animations in print styles
- `data/activities.json` untouched — validator vocabulary untouched

**Wave 6 push resolution:** wave 6 local commit `06daa8b` pushed via `gh-push.py` on retry (connection flapping: `RemoteDisconnected` on tree GET + blob POSTs across 3 attempts) — remote commit `72c8e163d1656bfdb4cdf2e4f42c9b1190af095f`, 53 files. Verified via GitHub API: remote tree contains all 10 `activity/*winter*.html` files.

## Wave 6 — 2026-10-11 — Winter/holiday seasonal pack (+25 → 238)

**What shipped:**
- **Winter seasonal pack** — 25 new original activities (`scripts/add_wave6.py`):
  winter crafts (homemade-christmas-ornaments, snowflake-paper-patterns,
  suet-cage-winter-feeder, ice-ornaments, winter-wreath-collage, cotton-ball-penguin,
  paper-mitten-match, gingerbread-shape-build), cozy indoor PE/movement
  (snowball-toss-math, animal-walk-relay, freeze-dance-winter), New Year reflection
  (year-in-review-quilt, resolution-ladder, midnight-countdown-rehearsal), winter
  nature walks (track-prints-detective, frost-observation, bark-and-branch-study),
  warm-drink science (dissolving-warm-drink-lab, temperature-melt-race), an arctic
  research jigsaw, and respectful Hanukkah/Kwanzaa learning crafts
  (hanukkah-counting-chain, kwanzaa-unity-garland — flagged as cultural,
  "classroom craft *about* the holiday, not a ceremony", no invented rituals).
  Two name collisions with earlier waves (pinecone-bird-feeders, new-year-time-capsule)
  were replaced with genuinely new activities, not merged over.
- **Tag vocabulary grown** — `season:winter`, `holiday:christmas`, `holiday:hanukkah`,
  `holiday:kwanzaa`, `holiday:new-year` added to the validator (`scripts/build.py`
  `TAG_IDS`/`TAG_LABELS`), the browse filter (`assets/app.js`), `api/v1/filters.json`,
  and the docs (`API.md`, `AGENT.md`). `scripts/check_api.py` now imports `TAG_IDS`
  from `build.py` (single source of truth) and derives expected counts from the
  payload instead of hardcoding "213".
- **RSS pipeline** — scan re-run: 0 new candidates, 0 pending. The wave-4 deferred
  item ("Homemade Christmas Ornaments for Kids to Make", Hands On As We Grow) is
  **accepted**: adapted into original words as `homemade-christmas-ornaments` with
  the source URL credited. Queue is empty (no pending/deferred).
- **Party planner winter preset** — `party.html` gains a theme picker (Halloween /
  Winter). Winter uses the `holiday:christmas`/`holiday:new-year`/`season:winter`
  pool, winter group names (Snowflakes, Penguins, Reindeer, Mittens, Icicles,
  Cocoa Bears), cozy-timed rotations (a 5-min ☕ warm-up break midway, so
  `round_min = floor((minutes − 15) / stations)`), and winter closings. Hero copy,
  run-sheet kicker/title, and plan meta all switch with the theme; Halloween
  behavior is byte-for-byte unchanged. AGENT.md party-planner section updated.
- **Sub Tub winter band** — 3 zero-prep, zero-material winter emergencies
  (`snowflake-mirror`, `winter-tall-tale`, `warm-up-countdown`) that flow
  automatically into the Sub Tub "nothing at all" tier across the PreK–K
  through grades 6–8 bands.
- **Week planner seasonal suggestions** — month-driven "This season in the Vault"
  strip on `planner.html` linking to `index.html?tag=<tag>` with live activity
  counts; `assets/app.js` now pre-selects a valid `?tag=` on load (new deep link).
- **Skills**: no new skill — merged into `skills/halloween-party-planner.md`
  (winter preset section, theme inputs, respectful Hanukkah/Kwanzaa framing rule)
  rather than duplicating.
- Docs: `API.md` counts 213→238 + tag lists, `AGENT.md` counts/tags/party-planner/
  week-planner sections, `README.md` 213→238; `llms.txt`/`llms-full.txt`/`sitemap.xml`
  regenerated (party tool line now theme-generic).

**Validation (wave 6):**
- `scripts/build.py`: BUILD OK — 238 activities, 238 pages, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — 238/238 records validate against
  schema; tags in vocabulary; workflow1: 29 matches; workflow2 (Halloween):
  pool 4 → 3 stations; **new** winter preset: pool 13 → 3 stations picked
  (resolution-ladder, snowball-toss-math, snowflake-paper-patterns); workflow3:
  10 distinct slots, 11 categories; link check 0 broken (243 pages);
  llms.txt links resolve (22)
- `node --check` clean on app.js, party.js, planner.js, sub.js; runtime smoke
  test of `party.js` render for both themes (DOM stub): Halloween 3 blocks, no
  break; winter 3 rounds + warm-up break, correct clock math

## Wave 5 — 2026-10-11 — Agent API excellence pass

**What shipped:**
- **`api/v1/index.json`** — new self-describing manifest, generated by `scripts/build.py`:
  every endpoint with title, description, schema URL, `updated` timestamp, record counts
  (213 activities, 11 categories, 10 skills), `stability` (`stable` / `internal`), and
  deprecation notes. `meta.version` `1.0.0` semver, `meta.generated` ISO-8601 UTC,
  `meta.source_snapshot` naming the exact source data.
- **`api/v1/skills.json`** — new skills registry generated from `skills/` frontmatter
  (id, description, file); 10 skills.
- **JSON Schema draft-07 for every endpoint** — new: `activities.schema.json`,
  `categories.schema.json` (payload envelopes), `filters.schema.json`, `index.schema.json`;
  kept `activity.schema.json` / `category.schema.json` (record types). All generated by
  build.py; all validating.
- **`AGENT.md`** — "how an agent uses this archive": base URL, endpoint table, activity
  record shape, exact filter semantics, planner input shapes (Sub Tub band→age mapping,
  party planner round/per-group math, week-planner dealing rules), and 3 end-to-end
  example workflows (rainy-day for 8-year-olds; Halloween party 24 kids/60 min; 4th-grade
  week plan). No auth/keys/rate limits; freshness notes.
- **`api.html`** — API docs page with shared conventions block, endpoint table, and a
  **Try-the-API console**: endpoint picker populated live from `api/v1/index.json`,
  fetch, pretty-printed JSON (200k-char display cap), graceful failure messages.
  Client-side, keyboard accessible (`aria-live` status), no animations.
- **Shared conventions block** added verbatim to `API.md` (same across all seven sites);
  API.md also documents the new endpoints + AGENT.md + console.
- **Skills gap-fill** — 2 new skills in standard format: `no-prep-rescue` (zero-prep,
  zero-material grab-and-go) and `outdoor-play-picker` (space/weather/energy matching);
  `halloween-party-planner` gained the missing `name`/`description` frontmatter.
  Registry now 10 skills; `llms.txt` Skills/API sections are generated from the live
  endpoint + frontmatter lists so they can't go stale.
- **New validator `scripts/check_api.py`** — validates every manifest-listed payload
  against its schema, checks counts/timestamps, validates all 213 records, asserts 0
  duplicate ids and tag-vocabulary compliance, executes the 3 AGENT.md workflows
  against the real local `api/v1` JSON, link-checks all pages, resolves all
  `llms.txt` links.
- No payload shape changes — `activities.json` / `categories.json` / `filters.json`
  byte-compatible with the site JS that reads them.

**Validation (wave 5):**
- `scripts/build.py`: BUILD OK — 213 activities, 213 pages, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — schemas pass on every endpoint,
  213/213 records validate; workflow1: 28 matches (rainy-day/8yo/indoor/≤30min);
  workflow2: pool 4 → 3 stations picked (costume-category-vote, halloween-bingo,
  handprint-bat-garland), full 60-min timetable; workflow3: 10 distinct slots,
  11 categories covered; link check 0 broken (218 pages); llms.txt links resolve (22)
- Console inline JS: `node --check` pass

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
