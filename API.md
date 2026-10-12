# Activity Vault API

Base path: `api/v1/`. All responses are static JSON files. No auth, no rate limits — it's a file.

## Shared API conventions (all sites)
- Base: `api/v1/` relative to the site root. Works on any static host; no auth, no keys, no rate limits.
- Manifest: `api/v1/index.json` lists every endpoint with its schema URL, `updated` timestamp, and notes. Start here.
- Timestamps: ISO-8601 UTC (`2026-10-11T00:00:00Z`). Date-only fields are `YYYY-MM-DD`.
- Versions: `meta.version` semver on the manifest; breaking changes get a new `v2/` path, never a silent shape change.
- Errors: static files can't return error bodies. A missing endpoint means a wrong path — re-read `index.json`. Empty results are `[]`, never `null`. Every record carries its provenance (`source`, `observed`/`updated`).
- Pagination: not needed — payloads are complete snapshots sized for client-side filtering. If a future endpoint paginates, it will use `?page=` and document it here.
- Freshness: every payload states when it was generated and from what snapshot. Treat undated numbers as stale.

## Endpoints

### `GET api/v1/index.json`

Self-describing manifest of the whole API — agents should start here:

```json
{
  "meta": { "site": "Activity Vault", "version": "1.0.0",
            "generated": "2026-10-11T00:40:21Z",
            "source_snapshot": "data/activities.json + data/categories.json — 455 activities, 11 categories" },
  "endpoints": [ { "path": "api/v1/activities.json", "title": "...", "description": "...",
                   "schema": "api/v1/schema/activities.schema.json",
                   "updated": "2026-10-11", "records": 455, "stability": "stable" } ],
  "deprecation_notes": "No endpoints are deprecated as of 1.0.0."
}
```

Each endpoint entry carries `title`, `description`, `schema` (JSON Schema URL or null), `updated` (date-only), optional `records` count, `stability` (`stable` or `internal`), and optional `notes`. Schema: `api/v1/schema/index.schema.json`.

### `GET api/v1/activities.json`

Full activity library.

```json
{
  "activities": [ { "id": "...", "name": "...", ... } ],
  "count": 326,
  "updated": "2026-10-11"
}
```

**Activity record:**

| Field | Type | Notes |
|---|---|---|
| `id` | string | URL-safe slug; page at `activity/<id>.html` |
| `name` | string | Display name |
| `tagline` | string | One-line pitch |
| `categories` | string[] | 1+ of the 11 category ids |
| `age_min` / `age_max` | int | Inclusive age range (years) |
| `group_min` / `group_max` | int | Inclusive group size (kids) |
| `time_min` / `time_max` | int | Minutes; `time_min` is the realistic floor |
| `location` | string[] | Subset of `["indoor", "outdoor"]` |
| `materials` | object[] | `[{"item": "..."}]`; empty array = nothing needed |
| `no_prep` | bool | True = grab-and-go, no advance prep |
| `setup` | string | What to arrange before kids arrive |
| `steps` | string[] | Ordered instructions |
| `variations` | object | `{"easier": "...", "harder": "..."}` |
| `safety` | string\|null | Common-sense safety notes, or null |
| `tags` | string[] (optional) | Season/occasion tags: `season:fall`, `season:winter`, `season:spring`, `holiday:halloween`, `holiday:thanksgiving`, `holiday:dia-de-muertos`, `holiday:christmas`, `holiday:hanukkah`, `holiday:kwanzaa`, `holiday:new-year`, `holiday:easter`, `holiday:earth-day`, `holiday:july-4th`, `theme:spooky` |
| `source` | string\|null (optional) | Inspiration source URL (RSS pipeline adaptations link the original post) |

### `GET api/v1/categories.json`

The 11 categories: `id`, `name`, `blurb`, `color` (hex), `glyph`.

```json
{ "categories": [ {"id": "stem", "name": "STEM", "blurb": "...", "color": "#0d8a96", "glyph": "🔬"} ], "count": 10, "updated": "..." }
```

### `GET api/v1/filters.json`

Machine-readable filter configuration — the same logic the browser UI uses:

```json
{
  "filters": {
    "age":            { "type": "range", "min": 5, "max": 12, "description": "Activity fits if the age range overlaps the selected age." },
    "time_available": { "type": "select", "options": [15, 20, 30, 45, 60], "description": "Activity fits if time_min <= selected minutes." },
    "group_size":     { "type": "range", "min": 2, "max": 40, "description": "Activity fits if the group range overlaps the selected size." },
    "categories":     { "type": "multiselect", "options": ["seasons", "holidays", ...] },
    "tags":           { "type": "multiselect", "options": ["season:fall", "season:winter", "season:spring", "holiday:halloween", "holiday:thanksgiving", "holiday:dia-de-muertos", "holiday:christmas", "holiday:hanukkah", "holiday:kwanzaa", "holiday:new-year", "holiday:easter", "holiday:earth-day", "holiday:july-4th", "theme:spooky"], "description": "Activity fits if it carries ANY selected tag." },
    "no_prep_only":   { "type": "boolean" },
    "indoor_only":    { "type": "boolean" },
    "outdoor_only":   { "type": "boolean" },
    "search":         { "type": "text", "fields": ["name", "tagline", "materials[].item", "steps"] }
  }
}
```

### `GET api/v1/collections.json`

Curated collections — 12 teacher-ready bundles (`rainy-day-rescue`, `first-day-of-program`, `last-10-minutes`, `field-trip-bus-ride`, `sub-tub-essentials`, `winter-party-night`, `no-prep-lifesavers`, `calm-down-corner`, `spring-burst`, `summer-splash`, `haunted-halls`, `grateful-gathering`). Each record: `id`, `title`, `glyph`, `when_to_use`, `picks[]` of `{activity_id, curator_note}`, computed `age_span`/`time_span`, and `page` (deep link). Every `activity_id` is a real record in `activities.json`.

```json
{ "collections": [ {"id": "rainy-day-rescue", "title": "Rainy-day rescue", "glyph": "🌧️",
    "when_to_use": "Recess just got cancelled…",
    "picks": [ {"activity_id": "freeze-dance", "curator_note": "Ten minutes of full-body movement…"} ],
    "age_span": [5, 12], "time_span": [10, 45], "page": "collections.html#rainy-day-rescue"} ],
  "count": 8, "updated": "…" }
```

### `GET api/v1/balance-buckets.json`

Energy balance buckets for the Smart Weekly Planner 2.0's balance meter. `buckets[]`: the 5 fixed buckets (`movement` ⚡, `calm` 🧘, `creative` 🎨, `outdoor` 🌳, `mixed` 🔀) with `id`, `label`, `glyph`, `description`. `mapping[]`: one record per category — `category`, `category_name`, `bucket`, `bucket_label`, `bucket_glyph`. An activity's bucket comes from its **primary (first) category**. Reproduce the meter exactly: count primary-bucket slots per day, flag a day when any non-`mixed` bucket holds more than half the filled slots.

```json
{ "buckets": [ {"id": "movement", "label": "High-energy movement", "glyph": "⚡",
    "description": "Run, jump, dance — the wiggles-burners…"} ],
  "mapping": [ {"category": "pe-movement", "category_name": "PE & Movement",
    "bucket": "movement", "bucket_label": "High-energy movement", "bucket_glyph": "⚡"} ],
  "count": 11, "updated": "…" }
```

### `GET api/v1/schema/balance-bucket.schema.json` / `balance-buckets.schema.json`

JSON Schema (draft-07) for the balance-bucket record and the endpoint envelope, following the same two-file convention as the collection schemas. Generated by `scripts/build.py`, which also asserts all 11 categories map to exactly one bucket.

### `GET api/v1/schema/activity.schema.json` / `category.schema.json` / `collection.schema.json`

JSON Schema (draft-07) for the four record types (`activity`, `category`, `collection`, `balance-bucket`). `scripts/build.py` validates every record against these rules before generating anything.

### `GET api/v1/skills.json`

Registry of the reusable skill recipes in `skills/`: `id`, `description`, `file`. Regenerated by `scripts/build.py` from skill frontmatter.

```json
{ "skills": [ {"id": "activity-finder", "description": "...", "file": "skills/activity-finder.md"} ],
  "count": 10, "updated": "..." }
```

### `GET api/v1/schema/activities.schema.json` / `categories.schema.json` / `filters.schema.json` / `index.schema.json` / `collections.schema.json` / `balance-buckets.schema.json`

JSON Schema (draft-07) for each endpoint's full payload (envelope + records). One schema per endpoint, all validating — see `scripts/check_api.py`.

### `pipeline/review-queue.json` (internal)

The RSS-pipeline working queue: accepted / rejected / deferred activity candidates with decisions and source links. Listed in the manifest with `stability: "internal"` — not a stable public API; shape and statuses change as the pipeline runs.

## Filtering recipes

**"20 minutes, age 9, indoors, no prep":**
```
activities where time_min <= 20
  and age_min <= 9 <= age_max
  and "indoor" in location
  and no_prep == true
```

**Rainy-day plan:** `categories` contains `rainy-day`, then sort by energy: PE first, crafts middle, quiet-focus last.

**Week plan (no repeats, balanced):** filter to pool, then deal round-robin across days × slots (1–4 weeks, shared no-repeat set across weeks unless repeats allowed), scoring candidates by bucket scarcity (day ×3 + week) and unused categories — never two prep-heavy activities past the weekly cap. Balance meter: bucket = primary category's bucket (`api/v1/balance-buckets.json`); warn when a non-`mixed` bucket holds > 50% of a day's filled slots. 3.0 extras: ⚡ brain-break idea per day (movement, ≤10 min), 🌦️ weather backup per outdoor-only slot (indoor, one-tap swap), 🛒 aggregated supply list, 🆘 substitute kit (no-prep, zero-material, plain-language steps). See `skills/balanced-week-builder.md`. Planner deep links: `planner.html?from=collection:<id>` (seed from a curated collection) and `planner.html?plan=<base64url>` (open a shared plan — v2 `weeks[]` payload, v1 still imports; see AGENT.md Workflow 4).

**Kit plan (low-materials week):** filter to the pool (age overlap, group range includes groupSize, `time_min <= minutes`, prep-mode filter: `pantry` = every material string word-boundary-matches a pantry staple, `low` = no_prep or ≤3 materials, `noprep` = no_prep only), then deal each day opener (≤15 min, no-prep, movement/icebreaker preferred) → main → closer (≤20 min, calm/quiet-focus preferred) with a fallback ladder (role-fresh → loosened role bound → pool-fresh → flagged repeats), no repeats across days, seeded for reproducibility. Run-of-show: opener ~15% / main ~70% / closer ~15% of session minutes from the start time. One aggregated material checklist, ✅ have vs. 🛒 gather. Shareable as `kit.html?kit=<base64url>` (v1 payload: config + exact picks).

## llms.txt

- `llms.txt` — short brief: what the Vault is, categories, API + skill index.
- `llms-full.txt` — full activity catalog with one-line summaries and page links.

Both are regenerated by `scripts/build.py`. The API and Skills sections are built from `api/v1/index.json`'s endpoint list and `skills/` frontmatter, so they can't go stale.

## Agent guide

- `AGENT.md` — how an agent uses this archive: base URL, key endpoints with example requests, filter semantics, planner input shapes, and four end-to-end example workflows (rainy-day find, Halloween party plan, week plan, programmatic week-plan build). The workflows are executed against the real `api/v1` JSON by `scripts/check_api.py`.
- `api.html` — API docs page with a Try-the-API console (endpoint picker, fetch, pretty-printed JSON, client-side with graceful failures).
