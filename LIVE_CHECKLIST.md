# LIVE CHECKLIST — activity-vault live track

What is wired into the live release repo `astercast/activity-vault-live`
(one-time CLI deploy; working repo is NEVER connected to Vercel).

## Track

- Working: `astercast/activity-vault` (this repo) — build continuously,
  never deploy.
- Live: `astercast/activity-vault-live` — full-system release snapshot.
- Track rule: push `-live` only on an explicit user "push"/"ship it".
  Verify the remote URL before every push.

## Working-repo state (2026-10-12, wave 31)

- Working repo (this repo, never deployed): **625 activities, 21
  collections**, 4 Scout functions unchanged this wave. The live
  snapshot below is still the 2026-10-11 one — it updates only on an
  explicit user "push"/"ship it" order.

## Snapshot contents (2026-10-11, commit `484ec0a` + function layer)

- 455 activities → 455 `activity/*.html` pages; 13 top-level pages
- `assets/` (pre-built JS/CSS), `skills/` markdowns
- `data/v1/` static JSON + schemas (fallback store)
- `api/health.js`, `api/review-queue.js`, `api/review-decide.js`,
  `api/cron/scout.js` (4/12 functions, no `runtime` key — Vercel auto-detects Node, zero npm deps)
- Vercel functions entries need ≥1 valid property — use {"maxDuration": 10} per explicit function path; never set runtime for Node (omit it); never broad globs (2026-10-12: both nodejs22.x and nodejs20.x fail build validation; empty {} also fails; runtime is only for community runtimes like vercel-php@0.5.2)
- No static .js data files under api/ ever — Vercel deploys every .js there as a function (functions map is not an allowlist); basename collisions (x.js + x.json) fail the build (2026-10-12). Audit 2026-10-12: clean — only the 4 real functions are .js; all static data is .json.
- Vercel never serves static files under api/ — all static data lives in data/v1/; only real function handlers under api/ (2026-10-12)
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

- `/api/cron/scout` — `0 11 * * *` UTC (daily; Hobby minimum cadence)

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
  ("temporarily blocked from content creation") — repo creation + both
  pushes pending retry

## Cost rules

- Build machine: Standard, never Turbo (Sept 2026: $38.64 Turbo bill)
- Hobby: 100 GB bandwidth, 6,000 build min, 100k invocations/mo; pauses
  instead of overage billing
