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
            "source_snapshot": "data/activities.json + data/categories.json — 238 activities, 11 categories" },
  "endpoints": [ { "path": "api/v1/activities.json", "title": "...", "description": "...",
                   "schema": "api/v1/schema/activities.schema.json",
                   "updated": "2026-10-11", "records": 238, "stability": "stable" } ],
  "deprecation_notes": "No endpoints are deprecated as of 1.0.0."
}
```

Each endpoint entry carries `title`, `description`, `schema` (JSON Schema URL or null), `updated` (date-only), optional `records` count, `stability` (`stable` or `internal`), and optional `notes`. Schema: `api/v1/schema/index.schema.json`.

### `GET api/v1/activities.json`

Full activity library.

```json
{
  "activities": [ { "id": "...", "name": "...", ... } ],
  "count": 238,
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
| `tags` | string[] (optional) | Season/occasion tags: `season:fall`, `season:winter`, `holiday:halloween`, `holiday:dia-de-muertos`, `holiday:christmas`, `holiday:hanukkah`, `holiday:kwanzaa`, `holiday:new-year`, `theme:spooky` |
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
    "tags":           { "type": "multiselect", "options": ["season:fall", "season:winter", "holiday:halloween", "holiday:dia-de-muertos", "holiday:christmas", "holiday:hanukkah", "holiday:kwanzaa", "holiday:new-year", "theme:spooky"], "description": "Activity fits if it carries ANY selected tag." },
    "no_prep_only":   { "type": "boolean" },
    "indoor_only":    { "type": "boolean" },
    "outdoor_only":   { "type": "boolean" },
    "search":         { "type": "text", "fields": ["name", "tagline", "materials[].item", "steps"] }
  }
}
```

### `GET api/v1/schema/activity.schema.json` / `category.schema.json`

JSON Schema (draft-07) for the two record types. `scripts/build.py` validates every record against these rules before generating anything.

### `GET api/v1/skills.json`

Registry of the reusable skill recipes in `skills/`: `id`, `description`, `file`. Regenerated by `scripts/build.py` from skill frontmatter.

```json
{ "skills": [ {"id": "activity-finder", "description": "...", "file": "skills/activity-finder.md"} ],
  "count": 10, "updated": "..." }
```

### `GET api/v1/schema/activities.schema.json` / `categories.schema.json` / `filters.schema.json` / `index.schema.json`

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

**Week plan (no repeats):** filter to pool, shuffle, deal round-robin across days × slots, preferring activities whose categories haven't appeared yet that week. See `skills/week-planner.md`.

## llms.txt

- `llms.txt` — short brief: what the Vault is, categories, API + skill index.
- `llms-full.txt` — full activity catalog with one-line summaries and page links.

Both are regenerated by `scripts/build.py`. The API and Skills sections are built from `api/v1/index.json`'s endpoint list and `skills/` frontmatter, so they can't go stale.

## Agent guide

- `AGENT.md` — how an agent uses this archive: base URL, key endpoints with example requests, filter semantics, planner input shapes, and three end-to-end example workflows (rainy-day find, Halloween party plan, week plan). The workflows are executed against the real `api/v1` JSON by `scripts/check_api.py`.
- `api.html` — API docs page with a Try-the-API console (endpoint picker, fetch, pretty-printed JSON, client-side with graceful failures).
