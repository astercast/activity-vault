# Activity Vault — Agent Guide

This archive is built to be driven by agents, no browser needed. Everything is static JSON: fetch it, filter it client-side, done.

## Basics

- **Base:** `api/v1/` relative to the site root. No auth, no keys, no rate limits — it's files on a static host.
- **Start here:** `api/v1/index.json` — the self-describing manifest. It lists every endpoint with a description, its JSON Schema URL, an `updated` timestamp, record counts, and stability notes. `meta.version` is semver (`1.0.0`); breaking changes get a new `v2/` path, never a silent shape change.
- **Freshness:** every payload carries `updated` (date-only, `YYYY-MM-DD`) and the manifest carries `meta.generated` (ISO-8601 UTC) plus `meta.source_snapshot` describing exactly what data the payloads were built from. Treat undated numbers as stale.
- **Empty results are `[]`, never `null`.** A missing endpoint means a wrong path — re-read `index.json`.

## Key endpoints

| Endpoint | What it is | Schema |
|---|---|---|
| `api/v1/activities.json` | All 238 activity records with full details | `api/v1/schema/activities.schema.json` |
| `api/v1/categories.json` | The 11 categories (`id`, `name`, `blurb`, `color`, `glyph`) | `api/v1/schema/categories.schema.json` |
| `api/v1/filters.json` | Machine-readable filter config — the same matching logic the browser UI uses | `api/v1/schema/filters.schema.json` |
| `api/v1/skills.json` | Registry of the 10 reusable skill recipes in `skills/` | (self-describing) |
| `api/v1/collections.json` | 8 curated collections (rainy-day, first day, sub tub, winter party…): activity ids + curator notes | `api/v1/schema/collections.schema.json` |
| `api/v1/index.json` | The manifest itself | `api/v1/schema/index.schema.json` |
| `pipeline/review-queue.json` | RSS-pipeline working queue (accepted/rejected/deferred candidates) — **internal, not a stable public API** | — |

Record-level schemas also exist: `api/v1/schema/activity.schema.json`, `api/v1/schema/category.schema.json`, and `api/v1/schema/collection.schema.json`.

## Curated collections (wave 9)

`api/v1/collections.json` — 8 teacher-ready bundles, each with `id`, `title`, `glyph`, `when_to_use` (the moment to reach for it), `picks[]` (`activity_id` + `curator_note` — the curator's one-line "why this one"), `age_span`/`time_span` (min/max across picks), and `page` (deep link, e.g. `collections.html#rainy-day-rescue`). The eight: `rainy-day-rescue`, `first-day-of-program`, `last-10-minutes`, `field-trip-bus-ride`, `sub-tub-essentials` (pairs with the Sub Tub kit, `sub.html`), `winter-party-night` (pairs with the Party Planner's ❄️ Winter theme, `party.html`), `no-prep-lifesavers`, `calm-down-corner`. Every `activity_id` resolves to a record in `activities.json` — asserted by `scripts/build.py` and re-checked by `scripts/check_api.py`. Browse surface: `collections.html` (printable per collection; "📋 Copy this collection" text export carries the curator notes; activities you've rated show your own rating badges on their picks — your ratings only, never aggregates).

## The activity record

Each record in `activities.json` has: `id` (slug; detail page at `activity/<id>.html`), `name`, `tagline`, `categories[]` (1+ of the 11 ids), `age_min`/`age_max`, `group_min`/`group_max`, `time_min`/`time_max` (minutes; `time_min` is the realistic floor), `location[]` (`indoor`/`outdoor`), `materials[]` (`{item, note?}`; empty array = nothing needed), `no_prep` (bool), `setup`, `steps[]`, `variations` (`{easier, harder}`), `safety` (string or null — common-sense notes), optional `tags[]` (season/occasion vocabulary: `season:fall`, `season:winter`, `holiday:halloween`, `holiday:dia-de-muertos`, `holiday:christmas`, `holiday:hanukkah`, `holiday:kwanzaa`, `holiday:new-year`, `theme:spooky` — validated against a fixed list), optional `source` (URL credit for RSS-pipeline adaptations).

## Filter semantics (same as the UI — copy these exactly)

- **age:** activity fits if `age_min <= kid_age <= age_max` (overlap, not containment).
- **time_available:** activity fits if `time_min <= minutes`.
- **group_size:** activity fits if `group_min <= size <= group_max` (overlap).
- **categories:** activity fits if ANY of its categories is selected.
- **tags:** activity fits if it carries ANY selected tag.
- **no_prep_only / indoor_only / outdoor_only:** straightforward booleans.
- **search:** case-insensitive substring match across `name`, `tagline`, `materials[].item`, `steps`.

If a filter returns nothing, loosen in this order: group size, age, time, materials.

## Planners: input shapes (drive them programmatically)

The three tools (`sub.html`, `party.html`, `planner.html`) are thin clients over the JSON above. Reproduce their logic with these inputs:

**Sub Tub** (`sub.html`) — inputs: `band` ∈ {`prek-k` (ages 3–6), `g1-2` (6–8), `g3-5` (8–11), `g6-8` (11–14)}, `minutes` (15–90), `tier` ∈ {`nothing`, `paper`, `art`, `any`} (materials on hand), `loc` ∈ {`indoor`, `either`}. Logic: age overlap with the band, indoor must include `indoor`, materials tier = substring match on material names (`paper` tier = only paper/pencil/pen/crayon/marker/cardstock/notebook/sticky-note/index-card/envelope/worksheet/clipboard words). Sequences opener → mains → calm closer, fills gaps with a filler block. Reproduce in full: `assets/sub.js` `filterPool`/`buildPlan`.

**Party planner** (`party.html`) — inputs: `theme` ∈ {`halloween`, `winter`}, `class_size` (4–60), `minutes`, `stations`, `budget` ∈ {`shoestring`, `moderate`, `splurge`}. Logic: `round_min = floor((minutes - 10) / stations)` (5 min intro + 5 min wrap); winter theme also reserves a 5-min ☕ warm-up break midway, so `round_min = floor((minutes - 15) / stations)`; `per_group = ceil(class_size / stations)`. Pool by theme: Halloween = activity carries ANY of [`holiday:halloween`, `holiday:dia-de-muertos`, `season:fall`, `theme:spooky`]; Winter = ANY of [`holiday:christmas`, `holiday:new-year`, `season:winter`] — and ANY of [`crafts`, `pe-movement`, `rainy-day`, `quiet-focus`, `team-community`, `icebreakers`]; `time_min <= round_min + 5`; group range must include `per_group`; `shoestring` budget keeps only activities with no materials or all-cheap materials (paper, crayon, marker, pencil, pen, glue, scissors, tape, balloon, bag, plate, cup, string, yarn, dice, card, chalk, sticker, ribbon, towel, tissue, newspaper, box, sock, button, cotton, pipe cleaner, toothpick). Stations picked by: no-prep first, then longest `time_max`, preferring categories not yet used. Full logic: `assets/party.js`.

**Week planner** (`planner.html`) — inputs: `days[]`, `slots` per day (1–4), optional `cats` set, `maxTime`, `noPrepOnly`, `indoorOnly`, `allowRepeats`. Logic: pool = filter above; shuffle; deal round-robin across days × slots; prefer activities whose categories haven't appeared yet that week (`usedCats`), skip already-used ids unless `allowRepeats`. Seasonal suggestions strip (top of page, month-driven): links to `index.html?tag=<tag>` with live counts — the browse page pre-selects a `?tag=` value from the tag vocabulary. Full logic: `assets/planner.js`.

---

## Personal ratings (client-side only — wave 8)

Ratings are **never sent anywhere**: there is no API endpoint for them, no account, no server. They live in the visitor's browser under:

```
localStorage["activityvault.ratings.v1"]
```

Shape — a JSON object keyed by activity `id`:

```json
{
  "<activity-id>": {
    "stars": 4,
    "note": "one-line note (≤140 chars, may be empty)",
    "reflections": {
      "change": "what they would change next time (≤280 chars)",
      "age_band": "which age band shone (≤280 chars)",
      "again": "would they run it again? (≤280 chars)"
    },
    "ratedAt": "2026-10-11T18:30:00.000Z"
  }
}
```

Shared helper: `assets/ratings.js` exposes `window.VaultRatings` (`getRating`, `setRating`, `clearRating`, `topRated(limit)`, `countRated`, `starsText`, `KEY`, `REFLECTIONS`). Loaded on `index.html`, `planner.html`, `party.html`, and every `activity/<id>.html` page.

Rules for agents and for the UI copy (standing):
- **Only the user's own ratings, never aggregates.** Activity Vault has no community ratings; never invent an average, a "most loved" ranking from other users, or a star total from the server. Copy must say "your ratings", "stored only in this browser".
- Browse: "⭐ Sort by my rating" toggle (rated first, best stars first; unrated activities sit at the bottom marked "Not rated yet") and "⭐ My top 10" (rated-only top 10, deep link `index.html?view=top-rated`).
- Week planner: scheduled activities show "⭐ You rated this 4★" (plus the note); "📋 Copy my week" exports the rating, note, and reflections per rated activity.
- Party planner: picks top-rated party stations first (unrated sink below every rated pick); the status line and run sheet say so honestly ("Your top-rated stations went in first — ratings live only in your browser").
- Do not add an endpoint for ratings — the library stays client-side by design. If an agent workflow needs ratings, read `localStorage` in a browser context; the JSON files carry no rating data.

---

## Workflow 1 — Find a rainy-day activity for 8-year-olds

**Situation:** 8-year-olds, stuck indoors, ~30 minutes.

1. `GET api/v1/activities.json` (one fetch; 238 records, ~300 KB).
2. Filter:
   - `'rainy-day'` in `categories`
   - `'indoor'` in `location`
   - `age_min <= 8 <= age_max`
   - `time_min <= 30`
3. Present the top few: name, `activity/<id>.html` page link, `time_min`–`time_max`, why it fits.

**Expected result (run against the real data):** ≥ 10 matches; e.g. `silent-ball` (ages 7–12, 10–25 min, no-prep, indoor, rainy-day).

## Workflow 2 — Plan a Halloween party for 24 kids, 60 minutes

**Situation:** 24 kids, 60 minutes, 3 stations, shoestring budget — the party planner's exact logic, run by an agent.

1. `GET api/v1/activities.json`.
2. Inputs: `class_size=24`, `minutes=60`, `stations=3`, `budget='shoestring'`.
3. `round_min = floor((60 - 10) / 3) = 16`; `per_group = ceil(24 / 3) = 8`.
4. Pool = activities where:
   - `tags` contains ANY of `holiday:halloween`, `holiday:dia-de-muertos`, `season:fall`, `theme:spooky`
   - `categories` contains ANY of `crafts`, `pe-movement`, `rainy-day`, `quiet-focus`, `team-community`, `icebreakers`
   - `time_min <= round_min + 5` (21)
   - `group_min <= 8 <= group_max`
   - every material is cheap (paper, crayon, marker, pencil, pen, glue, scissors, tape, balloon, bag, plate, cup, string, yarn, dice, card, chalk, sticker, ribbon, towel, tissue, newspaper, box, sock, button, cotton, pipe cleaner, toothpick) or materials are empty
5. Pick 3 stations: sort no-prep first, then longest `time_max`; prefer a category not already picked.
6. Output: 5-min welcome, three 16-min station rotations (groups of 8), 5-min regroup — with setup lists merged from each activity's `materials` + `setup`.

**Expected result:** ≥ 3 stations picked (e.g. `paper-bag-ghost-puppets`, `pin-the-hat-on-witch`, `halloween-bingo`) and a full timetable.

## Workflow 3 — Build a week plan for a 4th-grade after-school program

**Situation:** 4th grade (~ages 9–10), 5 days, 2 slots per day, 45 minutes per slot, no repeats, prefer variety.

1. `GET api/v1/activities.json` and `api/v1/categories.json`.
2. Pool: `age_min <= 10 and age_max >= 9` (overlap), `time_min <= 45`.
3. Shuffle the pool. For each of the 5 days × 2 slots: pick the first activity not yet used this week, preferring ones whose categories haven't appeared yet.
4. If the pool runs dry before 10 slots, report honestly ("pool exhausted — loosen a filter") rather than repeating silently.

**Expected result:** 10 distinct activities across 5 days, covering ≥ 5 different categories.

---

## Skills

Ten reusable recipes live in `skills/` (registry at `api/v1/skills.json`): `activity-finder`, `week-planner`, `rainy-day-rescue`, `stem-demo-picker`, `icebreaker-chooser`, `quiet-focus-picker`, `sub-tub-rescue`, `halloween-party-planner`, `no-prep-rescue`, `outdoor-play-picker`. Each has "Use when", inputs, a step-by-step procedure, a worked example, API references, and pitfalls.

## Rate / expectation notes

- **No rate limits, no keys, no auth.** Fetch aggressively if you want; it's static files.
- **Payloads are complete snapshots** sized for client-side filtering — no pagination.
- **Freshness:** check `updated` / `meta.generated` before quoting numbers. The library grows via the RSS pipeline (see `PIPELINE.md`); regenerate counts after a rebuild.
- **llms.txt** is the short brief (categories, API, skills, tools); **llms-full.txt** is the whole catalog with one-line summaries and page links.
- **Try the API console** on `api.html` — endpoint picker, fetch, pretty-printed JSON, works from a browser with zero setup.
