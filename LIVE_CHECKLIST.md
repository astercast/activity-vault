# LIVE CHECKLIST. Activity-vault live track

What is wired into the live release repo `astercast/activity-vault-live`
(one-time CLI deploy; working repo is NEVER connected to Vercel).

## Track

- Working: `astercast/activity-vault` (this repo). Build continuously,
  never deploy.
- Live: `astercast/activity-vault-live`, full-system release snapshot.
- Track rule: push `-live` only on an explicit user "push"/"ship it".
  Verify the remote URL before every push.

## Working-repo state (2026-10-14, rotation 23)

- Rotation 23, "The year's almanac": the year as seasonal issues
  (one colour per season, the day count set huge in Fraunces, real
  photographs as covers), the five emoji cards deleted for ruled,
  numbered Contents lines, body type now Newsreader (self-hosted,
  OFL). Counts stand at **747 activities, 32 collections**; of the
  747, **108 carry a real sourced photograph** (104 rotation-23
  Commons photos with per-photo licence, credit and source page
  recorded in `data/activities.json`, plus the 4 wave-36 photos) and
  **93 carry a source link** presented plainly on the activity page.
  The remainder is counted debt, named in the rotation-23 landing
  record: no honest, rights-clear source was found for those records
  this pass, and no link or photo was fabricated to close the gap.
  Function count, vercel.json, and the free-tier audit below are
  unchanged by this rotation.
- **Rotation-32 addendum (2026-10-15):** counts have moved since
  the rotation-23 block above: **222 activities carry a sourced
  photograph in data (223 rendered)** and **105 carry a source
  link** (the first source-link pass since rotation 23: 12
  Wikipedia concept references admitted under the strict title
  rule, floor in `scripts/test-r23.js` raised 93 → 105 in the
  same commit). Function count and the free-tier audit below are
  unchanged by this rotation.
- **Completeness addendum (2026-10-15, wave 44 + the wave
  engine's completeness run, one commit):** counts stand at
  **778 activities, 34 collections**; **233 carry a sourced
  photograph** and **163 carry a source link**. The day's two
  builds added 31 records (8 thin-cell records + 23 canonical
  games), 11 photographs (batch r30, every frame read against
  its activity before placement), and 58 source links (31 on
  the new records, 27 backfilled onto existing records, each
  verified live at its exact URL). Function count and the
  free-tier audit below are unchanged.

## Working-repo state (2026-10-13, wave 43)

- Working repo (this repo, never deployed): **778 activities, 34
  collections**, 4 Scout functions (unchanged this wave, still
  inside the free-tier budget: 4 of the ≤12 function cap, every
  entry `{"maxDuration": 10}`, no `runtime` key; the Scout's
  7,000ms deadline guard from wave 35 stands). Wave 38 closed the
  age-3/age-4 coverage gap at parity (160 each); wave 39 opened
  the teen band (12 records banded 13–14 only; age-13/14 coverage
  76 → 88 each, the band's primary-category floor 1 → 3); wave 40
  raised that floor (8 more records banded 13–14 only, in seasons,
  outdoor and pe-movement; age-13/14 coverage 88 → 96 each, the
  band's primary-category floor 3 → 6); wave 41 raised that floor
  again (8 more records banded 13–14 only, one for each of the
  band's eight thinnest categories; age-13/14 coverage 96 → 104
  each, the band's primary-category floor 6 → 7); wave 42
  raised that floor again (8 more records banded 13–14 only, one
  for each of the band's eight thinnest categories; age-13/14
  coverage 104 → 112 each, the band's primary-category floor
  7 → 8). Rotation 13 added
  the placement layer: generator-owned OG/Twitter/theme-color/
  favicon/canonical/JSON-LD head meta on all 766 pages, robots.txt
  (allow-all + Sitemap pointer at the live domain), absolute
  sitemap locs, and 4 Commons photos wired with attribution (see
  WAVELOG wave 36). The live snapshot below is still the
  2026-10-11 one. It updates only on an explicit user
  "push"/"ship it" order.

## Free-tier / best-pattern audit (2026-10-13, wave 35)

Real numbers, measured or counted in the working repo; the traffic
assumption is stated, not hidden.

- **Function count: 4 of the ≤12 cap**, `api/health.js` (76 lines),
  `api/review-queue.js` (83), `api/review-decide.js` (216),
  `api/cron/scout.js` (392). Zero npm dependencies anywhere
  (`installCommand: echo 'no dependencies'`). Every function entry
  is an explicit path with `{"maxDuration": 10}` and no `runtime`
  key. One cron: scout daily at `0 11 * * *`.
- **Estimated monthly invocations ≈ 400–700 (<1% of Hobby's
  100k/month).** Assumption: ~1,000 page views/month on the live
  snapshot; `review.html` is the only function-backed page in
  normal use. ~15% Of visits open it, ~2 API calls each ≈ 300
  review-queue calls (the edge `s-maxage=600` collapses most of
  those before they reach a function). Plus ~30 cron Scout runs,
  ~10 operator-only review-decide calls, ~50 health checks.
  Bandwidth is dominated by static CDN traffic, not functions:
  the largest file, `data/v1/activities.json`, is 1,313,623 bytes
  (~1.3MB) at wave 35 and is now SWR-cached at the edge (below).
- **Worst-case duration vs the 10s ceiling.** Measured warm via
  `tests/serve-local.js`: `/api/health` 5–9ms, `/api/review-queue`
  10–43ms (bundled JSON reads, no network). Scout typically runs
  ~4–5s: six feeds fetched in parallel, each capped at 4s by
  `lib/fetchx.js`. Its GitHub write phase was the one real
  worst-case risk: three `writeJsonIfChanged` calls, each chaining
  an 8s-timeout read + PUT (+ one 409 retry), a slow-GitHub day
  could pass 10s and be killed mid-commit, leaving the three
  pipeline files half-updated. **Fixed in wave 35:** a deadline
  guard in `api/cron/scout.js`, if fetch+filter have burned
  >7,000ms, the writes are skipped, `committed:false`, and the
  envelope carries an honest note; nothing is lost because the
  next run re-derives everything from the feeds.
  `review-decide`'s GitHub path (2 reads + up to 2 sequential
  writes) shares the theoretical worst case but is operator-only:
  a timeout there is a visible failed click with a safe manual
  retry, and without the token it already answers an honest
  `500 REFRESH_FAILED` (read-only) instead of pretending.
- **First degradation point:** the by-design per-IP rate limits
  (`lib/ratelimit.js`: public 60/min, compute 20/min → `429` +
  `Retry-After`, IPs hashed in logs). They bite long before any
  platform limit. Next after that: GitHub latency against the 10s
  ceiling on cron/decide writes (guarded above). The static layer
  degrades gracefully throughout: SWR serves stale JSON for up to
  24h while revalidating, and every function has a bundled static
  fallback. Hobby pauses at its limits rather than billing; the
  build machine is Standard, never Turbo.
- **Best-pattern alignment (Live Wire is the model):** static-first
  (all content precomputed by `scripts/build.py` into `data/v1/`
  + rendered HTML; functions never generate content), SWR headers
  (`lib/envelope.js` GET: `s-maxage=600, stale-while-revalidate=
  86400`; **wave 35 added the same policy to the static JSON**
  `vercel.json` now sends `Cache-Control: public, max-age=0,
  s-maxage=600, stale-while-revalidate=86400` for `/data/v1/*` and
  a long-lived `s-maxage=86400, stale-while-revalidate=604800`
  for `/assets/*`. Assets are not fingerprinted, so no
  `immutable`), request coalescing (edge caching + the cron's
  60s duplicate-delivery suppression), honest fallbacks (degraded
  envelopes with reasons, read-only mode surfaced, queue file
  byte-identical after every local Scout cycle), small handlers,
  and health surfacing (`/api/health` publishes the function
  roster + a 24h freshness SLA + degraded status).
- **Audit verdict:** nothing found that would break, throttle
  unexpectedly, or bill. Two fixes shipped (SWR headers on
  statics; Scout write deadline guard). `tests/api.test.sh`:
  33/33 after both fixes.

## Snapshot contents (2026-10-11, commit `484ec0a` + function layer)

- 455 activities → 455 `activity/*.html` pages; 13 top-level pages
- `assets/` (pre-built JS/CSS), `skills/` markdowns
- `data/v1/` static JSON + schemas (fallback store)
- `api/health.js`, `api/review-queue.js`, `api/review-decide.js`,
  `api/cron/scout.js` (4/12 functions, no `runtime` key, Vercel auto-detects Node, zero npm deps)
- Vercel functions entries need ≥1 valid property. Use {"maxDuration": 10} per explicit function path; never set runtime for Node (omit it); never broad globs (2026-10-12: both nodejs22.x and nodejs20.x fail build validation; empty {} also fails; runtime is only for community runtimes like vercel-php@0.5.2)
- No static.js data files under api/ ever, Vercel deploys every.js there as a function (functions map is not an allowlist); basename collisions (x.js + x.json) fail the build (2026-10-12). Audit 2026-10-12: clean. Only the 4 real functions are.js; all static data is.json.
- Vercel never serves static files under api/. All static data lives in data/v1/; only real function handlers under api/ (2026-10-12)
- `lib/` helpers (envelope, fetchx, ratelimit, cronauth, github)
- `vercel.json`: no buildCommand, `outputDirectory: "."`, functions +
  crons config, security headers, Standard build machine

## Functions

| path | method | status |
|---|---|---|
| `/api/health` | GET | syntax-checked; returns `status:"ok"` + roster |
| `/api/review-queue` | GET | falls back to `data/v1/review-queue.json` |
| `/api/review-decide` | POST | operator-only, `CRON_SECRET` bearer |
| `/api/cron/scout` | GET | daily RSS scan → review queue |

## Cron

- `/api/cron/scout`, `0 11 * * *` UTC (daily; Hobby minimum cadence)

## Env vars (Vercel dashboard only, never in repo)

- `CRON_SECRET` (required): missing → cron + decide fail closed 401
- `GITHUB_REPO_TOKEN` (pending user's call): missing → cron read-only,
  returns `degraded:true`; static fallback keeps serving
- `GITHUB_REPO`, `REPO_STATIC_PREFIX`: cron commit targeting

## Verification (2026-10-11)

- `scripts/build.py` BUILD OK: 455 activities / 455 pages, duplicate-id
  validator passed
- `scripts/check_api.py` ALL CHECKS PASSED (0 broken links, 468 pages)
- Spot-check via local server: `index.html` 200, `planner.html` 200,
  `data/v1/index.json` 200 (455 activities), activity page 200
- All 4 functions + 5 lib helpers pass `node --check`
- `vercel.json` valid JSON; no `maxDuration` overrides (Hobby 10s default)
- GitHub remote push **BLOCKED** 2026-10-11: secondary rate limit
  ("temporarily blocked from content creation"), repo creation + both
  pushes pending retry

## Cost rules

- Build machine: Standard, never Turbo (Sept 2026: $38.64 Turbo bill)
- Hobby: 100 GB bandwidth, 6,000 build min, 100k invocations/mo; pauses
  instead of overage billing
