# Activity Vault — Agent Guide

This archive is built to be driven by agents, no browser needed. Everything is static JSON: fetch it, filter it client-side, done.

## Basics

- **Base:** `data/v1/` relative to the site root. No auth, no keys, no rate limits — it's files on a static host.
- **Start here:** `data/v1/index.json` — the self-describing manifest. It lists every endpoint with a description, its JSON Schema URL, an `updated` timestamp, record counts, and stability notes. `meta.version` is semver (`1.0.0`); breaking changes get a new `v2/` path, never a silent shape change.
- **Freshness:** every payload carries `updated` (date-only, `YYYY-MM-DD`) and the manifest carries `meta.generated` (ISO-8601 UTC) plus `meta.source_snapshot` describing exactly what data the payloads were built from. Treat undated numbers as stale.
- **Empty results are `[]`, never `null`.** A missing endpoint means a wrong path — re-read `index.json`.
- **Design craft (web-craft research, 2026-10-11, rounds 1–2):** motion tokens (`--dur-*`/`--ease-*`) in `:root`; cross-document view transitions gated behind `prefers-reduced-motion: no-preference` (round-2 correction — Firefox lacks MPA transitions); scroll-driven section reveals (`animation-timeline: view()`, `@supports`-gated, finished state is the CSS default so the failure mode is "no animation", never invisible content); container queries on hub sections (layout follows the component, not the viewport); `text-wrap: balance` on headlines; `content-visibility: auto` on long pick lists; native `<details name>` accordions for checklists; a site-wide 🍃 calm-mode toggle in every header (sensory envelope — kills all motion + transitions + transparency, persisted as `activityvault.calm.v1`, wired by `assets/site.js` which also prefetches nav links on hover/focus); semantic HTML first (no ARIA is better than bad ARIA).

## Key endpoints

| Endpoint | What it is | Schema |
|---|---|---|
| `data/v1/activities.json` | All 625 activity records with full details | `data/v1/schema/activities.schema.json` |
| `data/v1/categories.json` | The 11 categories (`id`, `name`, `blurb`, `color`, `glyph`) | `data/v1/schema/categories.schema.json` |
| `data/v1/filters.json` | Machine-readable filter config — the same matching logic the browser UI uses | `data/v1/schema/filters.schema.json` |
| `data/v1/skills.json` | Registry of the 10 reusable skill recipes in `skills/` | (self-describing) |
| `data/v1/collections.json` | 17 curated collections (rainy-day, first day, sub tub, winter party…): activity ids + curator notes | `data/v1/schema/collections.schema.json` |
| `data/v1/index.json` | The manifest itself | `data/v1/schema/index.schema.json` |
| `data/v1/balance-buckets.json` | The 5 energy buckets + the category→bucket mapping the Smart Weekly Planner's balance meter uses | `data/v1/schema/balance-buckets.schema.json` |
| `pipeline/review-queue.json` | RSS-pipeline working queue (accepted/rejected/deferred candidates) — **internal, not a stable public API** | — |

Record-level schemas also exist: `data/v1/schema/activity.schema.json`, `data/v1/schema/category.schema.json`, `data/v1/schema/collection.schema.json`, and `data/v1/schema/balance-bucket.schema.json`.

## Curated collections (wave 9)

`data/v1/collections.json` — 26 teacher-ready bundles, each with `id`, `title`, `glyph`, `when_to_use` (the moment to reach for it), `picks[]` (`activity_id` + `curator_note` — the curator's one-line "why this one"), `age_span`/`time_span` (min/max across picks), and `page` (deep link, e.g. `collections.html#rainy-day-rescue`). The twenty-six: `rainy-day-rescue`, `first-day-of-program`, `last-10-minutes`, `field-trip-bus-ride`, `sub-tub-essentials` (pairs with the Sub Tub kit, `sub.html`), `winter-party-night` (pairs with the Party Planner's ❄️ Winter theme, `party.html`), `no-prep-lifesavers`, `calm-down-corner`, `spring-burst` (the spring 2027 pack's greatest hits; deep link `planner.html?from=collection:spring-burst` seeds the week planner from it), `summer-splash` (the summer 2027 pack's greatest hits; deep link `planner.html?from=collection:summer-splash` seeds the week planner from it), `haunted-halls` (the Halloween 2026 pack's greatest hits; deep link `planner.html?from=collection:haunted-halls` seeds the week planner from it), `grateful-gathering` (the Thanksgiving 2026 pack's greatest hits plus the Vault's best older gratitude picks; deep link `planner.html?from=collection:grateful-gathering` seeds the week planner from it), `halloween-week` (wave 20's 12-pick Halloween countdown shelf; deep link `planner.html?from=collection:halloween-week` seeds the week planner from it), `winter-lights` (wave 22's 12-pick winter-holidays shelf), `the-whole-calendar` (wave 24's 12-pick full-year holiday shelf — one strong pick per holiday, calendar order, anchored by the Scout accepts and the wave-24 gap fills), `little-hands-first-years` (wave 26's 12-pick shelf for the youngest kids — every pick designed for age 3 first), `little-hands-next-steps` (wave 27's 12-pick second shelf for the same room — the first STEM, team, and rainy-day records designed for age 3, plus one Scout-accepted Morse record for older kids filed under STEM). The early-years shelves continued: `little-hands-third-shelf` (wave 28), `little-hands-fourth-shelf` (wave 29), then the banded-3-only campaign — `little-hands-just-three` (wave 30), `-more` (31), `-again` (32), `-once-more` (33), `-fifth-time` (34), `-sixth-time` (35), `-seventh-time` (36) — each 12 picks, every pick banded ages 3–3. Every `activity_id` resolves to a record in `activities.json` — asserted by `scripts/build.py` and re-checked by `scripts/check_api.py`. Browse surface: `collections.html` (printable per collection; "📋 Copy this collection" text export carries the curator notes; activities you've rated show your own rating badges on their picks — your ratings only, never aggregates).
**Spring hub** (`spring.html`, wave 11) — the spring 2027 pack's browse surface: 5 curated sections (spring crafts, outdoor games, spring science, rainy spring days, spring holidays with Easter/Earth Day groups), each pick rendered from the real records with your own rating badges; hero shortcuts to `planner.html?from=collection:spring-burst`, `collections.html#spring-burst`, and the Party Planner's 🌷 Spring theme. Section pick ids are asserted by `scripts/test-spring.js`.
**Thanksgiving hub** (`thanksgiving.html`, wave 14) — the Thanksgiving 2026 pack's browse surface: 5 curated sections (gratitude crafts, harvest games, Thanksgiving STEM, gratitude & friendsgiving with practices/friendsgiving groups, giving back), each pick rendered from the real records with your own rating badges; hero shortcuts to `planner.html?from=collection:grateful-gathering`, `collections.html#grateful-gathering`, and the Party Planner's 🦃 Thanksgiving theme. Inclusive by design: the hub and the `gratitude-all-year` activity say plainly that not every family celebrates Thanksgiving. Section pick ids are asserted by `scripts/test-thanksgiving.js`.
**Halloween hub** (`halloween.html`, wave 13 + wave 20) — the Halloween 2026 pack's browse surface: 6 curated sections (Wave 20 · The Halloween 2026 Pack — all 40 new activities — plus Halloween crafts, costume & party games, not-too-spooky science, harvest, beyond trick-or-treating with alternatives/allergy-aware/respectful groups), each pick rendered from the real records with your own rating badges plus a client-side spookiness filter (🍎 Not spooky / 👻 Spooky-fun / 🕷️ Mildly spooky); hero shortcuts to `planner.html?from=collection:halloween-week`, `collections.html#halloween-week`, `planner.html?from=collection:haunted-halls`, `collections.html#haunted-halls`, and the Party Planner's 🎃 Halloween theme. Section pick ids are asserted by `scripts/test-halloween.js` + `scripts/test-wave20.js`.
**Summer hub** (`summer.html`, wave 12) — the summer 2027 pack's browse surface: 5 curated sections (water play, outdoor & camp games, summer crafts, beat-the-heat indoor, summer holidays & camp with July 4th/camp-week groups), each pick rendered from the real records with your own rating badges; hero shortcuts to `planner.html?from=collection:summer-splash`, `collections.html#summer-splash`, and the Party Planner's ☀️ Summer theme. Section pick ids are asserted by `scripts/test-summer.js`.
**The Teacher's Desk** (`index.html#desk` + `desk.html`, waves 21/23) — the archive as a physical teacher's desk: 11 wooden category drawers (brass label holders + cup pulls, `DRAWER 01`–`DRAWER 11` in `data/categories.json` order), each opening onto a tray of 6 index cards ("on top of the pile": curator-picked first, then no-prep, then alphabetical — asserted by `scripts/test-desk.js`) plus a pencil note with real per-drawer counts (`<n> cards · <m> no-prep`). Wave 23 made the desk the archive LANDING: `scripts/build.py::inject_landing_desk` splices the generated desk section into `index.html` between `BUILD:DESK` markers (shared `desk_drawers_html` builder with `desk.html`; hand edits outside the markers survive builds). Tray footers deep-link to `index.html?cats=<id>#browse` (the wave-14 chip-preselect mechanism, now landing on the filter browser below the desk); the kneehole blotter links `planner.html`. The hero CTA "Find an activity ↓" targets `#desk`. Interaction in `assets/desk.js` (loaded on both pages; progressive enhancement: trays render open without JS; `desk-ready` collapses them; `aria-expanded`/`aria-controls`; Escape closes all; open-all/close-all toolbar; calm + prefers-reduced-motion kill the card-cascade/stamp-slam animations, content still toggles). The planner week renders on a leather blotter (`.week-section`): stamped week head, washi-taped day cards.

## The activity record

Each record in `activities.json` has: `id` (slug; detail page at `activity/<id>.html`), `name`, `tagline`, `categories[]` (1+ of the 11 ids), `age_min`/`age_max`, `group_min`/`group_max`, `time_min`/`time_max` (minutes; `time_min` is the realistic floor), `location[]` (`indoor`/`outdoor`), `materials[]` (`{item, note?}`; empty array = nothing needed), `no_prep` (bool), `setup`, `steps[]`, `variations` (`{easier, harder}`), `safety` (string or null — common-sense notes), optional `tags[]` (season/occasion vocabulary: `season:fall`, `season:winter`, `season:spring`, `season:summer`, `holiday:halloween`, `holiday:thanksgiving`, `holiday:dia-de-muertos`, `holiday:christmas`, `holiday:hanukkah`, `holiday:kwanzaa`, `holiday:new-year`, `holiday:easter`, `holiday:earth-day`, `holiday:july-4th`, `holiday:mlk-day`, `holiday:valentines-day`, `holiday:lunar-new-year`, `holiday:st-patricks-day`, `holiday:diwali`, `holiday:indigenous-peoples-day`, `theme:spooky` — validated against a fixed list), optional `source` (URL credit for RSS-pipeline adaptations). Research-backed enrichment fields (wave 14 scope-up, from the 2026-10-11 activity-ideas research mission): optional `copy_free` (bool — verified zero-printing; 184 activities), optional `no_elimination` (bool — nobody sits out; 51), optional `why_it_works` (one-line research grounding; 10), optional `inclusion` (adaptation notes; 69). Detail pages render badges for `copy_free`/`no_elimination`, a 🔬 "Why it works" section, a 🤝 "Inclusion notes" section, a source-attribution line, breadcrumb links (`← All activities` + the primary category via `index.html?cats=<id>`), and a 🔗 "Related" cross-link block (same primary category, age overlap preferred — build-time, asserted by `scripts/test-thanksgiving.js`).

## Filter semantics (same as the UI — copy these exactly)

- **age:** activity fits if `age_min <= kid_age <= age_max` (overlap, not containment).
- **time_available:** activity fits if `time_min <= minutes`.
- **group_size:** activity fits if `group_min <= size <= group_max` (overlap).
- **categories:** activity fits if ANY of its categories is selected.
- **tags:** activity fits if it carries ANY selected tag.
- **no_prep_only / indoor_only / outdoor_only / copy_free_only / no_elimination_only:** straightforward booleans (the last two are wave-14 research filters: verified zero-printing, nobody-sits-out).
- **search:** case-insensitive substring match across `name`, `tagline`, `materials[].item`, `steps`. Press `/` anywhere to focus search.
- **deep links:** `index.html?tag=<tag>` pre-selects one tag; `index.html?cats=<id1,id2>` pre-selects categories (used by hub "browse the shelf" links and activity-page breadcrumbs); `index.html?view=top-rated` opens your top-10.

If a filter returns nothing, loosen in this order: group size, age, time, materials.

## Planners: input shapes (drive them programmatically)

The three tools (`sub.html`, `party.html`, `planner.html`) are thin clients over the JSON above. Reproduce their logic with these inputs:

**Sub Tub** (`sub.html`) — inputs: `band` ∈ {`prek-k` (ages 3–6), `g1-2` (6–8), `g3-5` (8–11), `g6-8` (11–14)}, `minutes` (15–90), `tier` ∈ {`nothing`, `paper`, `art`, `any`} (materials on hand), `loc` ∈ {`indoor`, `either`}. Logic: age overlap with the band, indoor must include `indoor`, materials tier = substring match on material names (`paper` tier = only paper/pencil/pen/crayon/marker/cardstock/notebook/sticky-note/index-card/envelope/worksheet/clipboard words). Sequences opener → mains → calm closer, fills gaps with a filler block. Reproduce in full: `assets/sub.js` `filterPool`/`buildPlan`.

**Party planner** (`party.html`) — inputs: `theme` ∈ {`halloween`, `thanksgiving`, `winter`, `spring`, `summer`}, `class_size` (4–60), `minutes`, `stations`, `budget` ∈ {`shoestring`, `moderate`, `splurge`}. Logic: `round_min = floor((minutes - 10) / stations)` (5 min intro + 5 min wrap); winter theme also reserves a 5-min ☕ warm-up break midway, so `round_min = floor((minutes - 15) / stations)`; `per_group = ceil(class_size / stations)`. Pool by theme: Halloween = activity carries ANY of [`holiday:halloween`, `holiday:dia-de-muertos`, `season:fall`, `theme:spooky`]; Winter = ANY of [`holiday:christmas`, `holiday:new-year`, `season:winter`]; Spring = ANY of [`holiday:easter`, `holiday:earth-day`, `season:spring`] — and ANY of [`crafts`, `pe-movement`, `rainy-day`, `quiet-focus`, `team-community`, `icebreakers`]; Summer = ANY of [`holiday:july-4th`, `season:summer`] — and ANY of the same categories; summer also reserves a 5-min shade-and-water break midway, so `round_min = floor((minutes - 15) / stations)`; Thanksgiving = ANY of [`holiday:thanksgiving`, `season:fall`] — and ANY of the same categories; `time_min <= round_min + 5`; group range must include `per_group`; `shoestring` budget keeps only activities with no materials or all-cheap materials (paper, crayon, marker, pencil, pen, glue, scissors, tape, balloon, bag, plate, cup, string, yarn, dice, card, chalk, sticker, ribbon, towel, tissue, newspaper, box, sock, button, cotton, pipe cleaner, toothpick). Stations picked by: no-prep first, then longest `time_max`, preferring categories not yet used. Full logic: `assets/party.js`.

**Week planner** (`planner.html` — Smart Weekly Planner 3.0) — inputs: `programType` ∈ {`after-school`, `camp`, `classroom`} (presets: slots/day 2/3/2, minutes 30/45/20, indoor-only for classroom; slot start hours 15:00/9:00/13:00 for `.ics`), `ageBand` ∈ {`prek-k`, `g1-2`, `g3-5`, `g6-8`, `all`}, `days[]` (Mon–Sun), `weeks` (1–4), `slots` per day (1–4), `maxTime`, optional `cats` set, `noPrepOnly`, `indoorOnly`, `allowRepeats`, `maxPrepHeavy` (default 2), optional `seedIds` from a collection. Logic: pool = filter above; seed picks first (skipped if they fail filters, week 1 only); deal round-robin per week with a shared no-repeat set across all weeks, scoring candidates by `day_bucket_count × 3 + week_bucket_count + 2 × used_category` (shuffle ties, lowest wins), skip used ids unless `allowRepeats`, skip prep-heavy picks past the weekly cap. 3.0 extras: ⚡ brain-break idea per day (movement-bucket, `time_min` ≤ 10, unscheduled); 🌦️ weather backup per outdoor-only slot (indoor, no-prep-first, one-tap swap); 🛒 supply-list aggregation across all weeks (equivalent material strings grouped, busiest first); 🆘 substitute kit per slot (no-prep, zero materials, indoor-preferred, first 3 steps shown). **Balance meter** (`data/v1/balance-buckets.json`): an activity's bucket = its primary (first) category's bucket; warn when a non-`mixed` bucket holds > 50% of a day's filled slots (movement-heavy → "lands softly"; calm-heavy → "sleepy"; creative-heavy → "cleanup"; outdoor-heavy → "indoor backup"; 3+ slots with zero calm → "quiet landing"), plus week checks (4+ slots, zero movement → "kids need to move"; 6+, zero calm → "plan a calm landing"). Deep links: `planner.html?from=collection:<id>` seeds from a curated collection; `planner.html?plan=<base64url>` opens a shared plan (v2 payload with `weeks[]` — v1 links still import; shape in Workflow 4). The `.ics` export (client-side) uses floating local times from the program's start hour on the next matching weekday, shifted +7 days per week for multi-week plans. Saved plans live in `localStorage` key `activityvault.plans.v1` (v2 records; never uploaded). Design craft (web-craft research, 2026-10-11): motion tokens (`--dur-*`/`--ease-*`) in `:root`; same-document view transitions on slot actions (reduced-motion + calm-mode aware); scroll-driven day-card entrance (`animation-timeline: view()`, `@supports`-gated, finished state is the CSS default); container queries on the week grid; `text-wrap: balance` on week/section heads; `tabular-nums` on slot times; sticky section nav with `scroll-margin-top` anchors; a user-controlled 🍃 calm mode toggle (sensory envelope — kills motion + nav transparency, persisted in `localStorage`); substitute-kit weeks as native `<details>` accordions. Full logic: `assets/planner-core.js` (pure, UMD — require it in Node for headless builds/tests) + `assets/planner.js` (DOM). Seasonal suggestions strip (top of page, month-driven): links to `index.html?tag=<tag>` with live counts — the browse page pre-selects a `?tag=` value from the tag vocabulary. Months: Aug–Oct → `season:fall`; Nov–Jan → `season:winter`; Feb–Apr → `season:spring`; May–Jul → `season:summer`; plus holiday chips (Mar → `holiday:easter`; Apr → `holiday:easter` + `holiday:earth-day`; Jul → `holiday:july-4th`; Oct → Halloween/Día de los Muertos; Nov → `holiday:thanksgiving` + Hanukkah/Kwanzaa; Dec–Jan → Christmas/Hanukkah/Kwanzaa/New Year). Wave 20: holiday months also get a "🗓️ Plan from the … collection" seed link (`planner.html?from=collection:<id>` — October → `halloween-week`, November → `grateful-gathering`), using the same `?from=collection:` seeding the seasonal hubs use.)
**Field Trip Planner** (`fieldtrip.html`, wave 14 scope-up) — inputs: `destination` ∈ {museum, nature, farm, library, helpers, playground, arts}, `kids` (group size), `chaperone_ratio` (1:N), `trip_length` ∈ {half-day, full-day}, `start_time`, `age_band`, `admission_per_kid`, `transport_flat`, `ride_minutes`. Logic: chaperones = ceil(kids / ratio); buddy pairs (+1 trio for odd counts); timeline = travel + welcome + destination-matched on-site activities (`matchOnSite`: destination keyword pool, age overlap, no-prep preferred) + lunch + travel back, with a ⚠️ warning when the day overruns; budget = kids × admission + transport flat; bus-ride activities drawn from the `field-trip-bus-ride` collection (`pickBusActivities`: no-prep first, sized to ride minutes); checklists = permission-slip table (printable) + pack list + headcount routine as native `<details name>` accordions (print CSS forces them open). Copy/print the whole plan as text. Full logic: `assets/fieldtrip-core.js` (pure, UMD — require it in Node for headless builds/tests, asserted by `scripts/test-fieldtrip.js`: 180 assertions incl. every destination matching ≥3 real activities) + `assets/fieldtrip.js` (DOM).

**After-School Kit** (`kit.html`, wave 18 — the flagship low-materials experience) — inputs: `groupSize` (2–60), `ageBand` ∈ {`prek-k`, `g1-2`, `g3-5`, `g6-8`, `all`}, `days` (1–5), `minutes` per session (20–120), `startTime`, `mode` ∈ {`pantry` (only activities whose materials are all in the pantry, or need none), `low` (no-prep or ≤3 materials), `noprep` (no_prep only)}, `pantry` (subset of the 16 staples in `PANTRY`: paper, markers, crayons, pencils, scissors, tape, glue, plates, cups, yarn, balloons, chalk, dice, cards, timer, water — matched word-boundary against real material strings, so "cup" never matches "cupcakes"). Logic: pool = age overlap + group range includes groupSize + `time_min <= minutes` + mode filter; each day deals opener (≤15 min, no-prep, movement/icebreaker preferred) → main → closer (≤20 min, calm/quiet-focus preferred) with a 4-rung fallback ladder (role-fresh → loosened role bound → pool-fresh → flagged repeats, so repeats only happen when the pool is exhausted); no-repeat across days; deterministic seeded deal. Outputs: run-of-show clock times per day (`runOfShow`: opener ~15% / main ~70% / closer ~15% from `startTime`), per-slot 🔀 swap, one aggregated material checklist split ✅ have / 🛒 gather (with the days each item is needed), session plan sheets (each day prints on its own page), copy-as-text, and shareable `kit.html?kit=<base64url>` links (v1 payload: config + exact picks; the address bar URL-syncs on every generate/swap; last kit persists in `localStorage` `activityvault.kit.v1`). Full logic: `assets/kit-core.js` (pure, UMD — require it in Node, asserted by `scripts/test-kit.js`: 363 assertions) + `assets/kit.js` (DOM).

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

1. `GET data/v1/activities.json` (one fetch; 326 records, ~370 KB).
2. Filter:
   - `'rainy-day'` in `categories`
   - `'indoor'` in `location`
   - `age_min <= 8 <= age_max`
   - `time_min <= 30`
3. Present the top few: name, `activity/<id>.html` page link, `time_min`–`time_max`, why it fits.

**Expected result (run against the real data):** ≥ 10 matches; e.g. `silent-ball` (ages 7–12, 10–25 min, no-prep, indoor, rainy-day).

## Workflow 2 — Plan a Halloween party for 24 kids, 60 minutes

**Situation:** 24 kids, 60 minutes, 3 stations, shoestring budget — the party planner's exact logic, run by an agent.

1. `GET data/v1/activities.json`.
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

1. `GET data/v1/activities.json` and `data/v1/categories.json`.
2. Pool: `age_min <= 10 and age_max >= 9` (overlap), `time_min <= 45`.
3. Shuffle the pool. For each of the 5 days × 2 slots: pick the first activity not yet used this week, preferring ones whose categories haven't appeared yet.
4. If the pool runs dry before 10 slots, report honestly ("pool exhausted — loosen a filter") rather than repeating silently.

**Expected result:** 10 distinct activities across 5 days, covering ≥ 5 different categories.

## Workflow 4 — Build a balanced week programmatically (planner 3.0, no browser)

**Situation:** after-school program, grades 3–5, Mon–Fri, 2 slots/day, ≤30 min, max 2 prep-heavy activities, seeded from the `rainy-day-rescue` collection — and the teacher wants a shareable link they can open in `planner.html`. 3.0 also supports `weeks: 1–4` (no repeats across weeks) plus the brain-break / weather-backup / sub-kit / supply-list helpers below.

1. `GET data/v1/activities.json`, `data/v1/balance-buckets.json`, `data/v1/collections.json`. Build `catBucket`: `mapping` → `{category: bucket}`. An activity's bucket is `catBucket[activity.categories[0]]` (primary category only).
2. Pool: `age_min <= 11 and age_max >= 8` (overlap), `time_min <= 30`. (No category filter, no no-prep gate here.)
3. Seeds: the `rainy-day-rescue` collection's 12 `activity_id`s in order; place each if it's in the pool and unused (week 1 only in multi-week builds).
4. For each week (1–4, shared no-repeat set across weeks unless repeats allowed), for each of the 5 days × 2 slots: shuffle the remaining pool; score each candidate `day_bucket_count × 3 + week_bucket_count + 2 × (categories already used this week)`; take the lowest; skip used ids (repeats off); skip `no_prep == false` picks once 2 are placed. (In code: `P.buildMultiWeek(activities, opts, catBucket, seed)`.)
5. Balance check per day: bucket counts across filled slots; if a non-`mixed` bucket holds > 50% of the day's slots, attach the warning (movement → "add a calm or creative slot so the room lands softly"; calm → "the room may get sleepy; mix in some movement"; creative → "budget extra cleanup time"; outdoor → "keep an indoor backup ready"). 3+ slots with zero calm → "consider a quiet landing". Week check: 4+ filled slots, zero movement → "No high-energy slot all week — kids need to move."
6. Assemble the shareable plan payload (v2) and base64url-encode it (`+`→`-`, `/`→`_`, strip `=`):
   ```json
   { "version": 2, "name": "Rainy-week backup", "programType": "after-school",
     "maxTime": 30, "ageBand": "g3-5",
     "weeks": [ { "weekNum": 1, "days": [ {"day": "Monday",
       "slots": [ {"slot": 1, "activityId": "freeze-dance"},
                  {"slot": 2, "activityId": "silent-ball"} ]} ] } ] }
   ```
   Deep link: `planner.html?plan=<base64url>`. The planner validates every `activityId` against the real library and drops unknown ids with a visible note — never invent an id. v1 payloads (flat `days`, no `weeks`) still import as week 1.
7. Optional `.ics`: one `VEVENT` per filled slot, `DTSTART` floating local time at the program start hour (after-school 15:00) on the next matching weekday (+7 days per extra week), `DURATION` = `min(time_max, maxTime)` minutes, `UID` `av-<id>-<date>-<slot>@activityvault` (`-w<weekIdx>` suffix from week 2 on).
8. 3.0 extras (all in `assets/planner-core.js`, all headless-friendly): `brainBreak(pool, usedIds, byId, catBucket, seed)` — movement-bucket, `time_min <= 10`, unscheduled; `weatherBackupFor(activity, pool, usedIds, byId, catBucket, opts, seed)` — only for outdoor-only slots, returns an indoor pick (no-prep first, then high-energy); `subBackupFor(...)` — `no_prep` required, indoor + weather-proof preferred; `aggregateSupplies(weeks, byId)` — groups equivalent material strings, returns `[{display, count, dayLabels[]}]` sorted busiest-first.

**Expected result:** 10 distinct real activity ids across 5 days, ≤ 2 prep-heavy, a per-day bucket breakdown with any dominance warnings, and a `?plan=` link the teacher can open, print, or `.ics`-export.

---

## Skills

Eleven reusable recipes live in `skills/` (registry at `data/v1/skills.json`): `activity-finder`, `balanced-week-builder`, `week-planner`, `rainy-day-rescue`, `stem-demo-picker`, `icebreaker-chooser`, `quiet-focus-picker`, `sub-tub-rescue`, `halloween-party-planner`, `no-prep-rescue`, `outdoor-play-picker`. Each has "Use when", inputs, a step-by-step procedure, a worked example, API references, and pitfalls.

## Rate / expectation notes

- **No rate limits, no keys, no auth.** Fetch aggressively if you want; it's static files.
- **Payloads are complete snapshots** sized for client-side filtering — no pagination.
- **Freshness:** check `updated` / `meta.generated` before quoting numbers. The library grows via the RSS pipeline (see `PIPELINE.md`); regenerate counts after a rebuild.
- **llms.txt** is the short brief (categories, API, skills, tools); **llms-full.txt** is the whole catalog with one-line summaries and page links.
- **Try the API console** on `api.html` — endpoint picker, fetch, pretty-printed JSON, works from a browser with zero setup.
