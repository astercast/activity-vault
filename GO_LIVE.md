# GO_LIVE — Activity Vault ("The Scout")

## 0. One-time deploy note (2026-10-11, corrected)

**This repo is NEVER deployed.** The one-time Vercel deploy uses a CLI deploy
from the full-system release snapshot repo `astercast/activity-vault-live`:
static frontend + the 4 Scout serverless functions + `vercel.json`
(functions + cron config) + `lib/` helpers + `api/v1/` static fallbacks —
the whole system, end to end. No Vercel GitHub integration, ever; build
machine **Standard, never Turbo**. Future work is GitHub-only, in this
working repo. Track rule: `-live` pushes happen only on an explicit
"push"/"ship it" from the user — never from wave-engine automation; before
every push, verify the remote URL matches the intended track.

## 1. Status banner

**LIVE-READY, NOT DEPLOYED. Do not connect Vercel until the user approves.**

Everything below is verified locally (build + function harness + fallback
passes). Nothing here is deployed anywhere yet. The deployment goes live only
when the user says they're happy with everything.

## 2. What deploys

One Vercel project from this repo (`outputDirectory: "."`):

- **Static frontend** — the 455-activity Teacher's Desk site (`index.html`,
  `activity/*.html`, `assets/*`, plus the build-generated `review.html`).
- **4 serverless functions** (zero npm dependencies, `nodejs22.x`, ≤6-function
  budget, ≤12 limit):
  - `api/health.js` → `GET /api/health`
  - `api/review-queue.js` → `GET /api/review-queue`
  - `api/review-decide.js` → `POST /api/review-decide` (operator-only)
  - `api/cron/scout.js` → `GET /api/cron/scout`
- **Shared helpers** — `lib/envelope.js`, `lib/fetchx.js`, `lib/ratelimit.js`,
  `lib/cronauth.js`, `lib/github.js` (never routes; not public paths).
- **Static fallbacks** — `api/v1/review-queue.json` + `api/v1/decided.json`
  (published by `scripts/build.py`; they are both the fallback AND the store).
- **1 daily cron** — `/api/cron/scout` at `0 11 * * *` UTC (RSS scan →
  review queue).

Spec: `~/workspace/server-program/ARCHITECTURE.md` §7.6 ("The Scout").

## 3. Prerequisites

- This repo pushed to GitHub (private is fine — Vercel doesn't care).
- Vercel account access (the user's account).
- Secrets generated, stored only in the Vercel dashboard (never in the repo):
  - `CRON_SECRET` — 32+ random hex chars:
    `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  - `GITHUB_REPO_TOKEN` — fine-grained PAT, **contents:write on this repo
    only**, no other scopes. **PENDING the user's decision** (spec §14.1):
    until it is set, the cron job runs **read-only** (computes honestly,
    returns `degraded:true`, commits nothing) and `POST /api/review-decide`
    validates then returns 500 `REFRESH_FAILED`. The static fallback keeps
    serving the last published data — nothing breaks.

## 4. Hookup steps (exact clicks)

1. **vercel.com/new** → **Import Git Repository** → select the
   `activity-vault` repo.
2. **Framework Preset: Other.** Build Command: `python3 scripts/build.py`
   (timed 0.5–2.5s locally, well under the 60s budget). Output Directory: `.`
   (repo root). Install Command: `echo 'no dependencies'`.
3. **Environment Variables (Production scope):**
   - `CRON_SECRET` = the generated secret (required — cron + decide fail
     closed 401 without it)
   - `GITHUB_REPO_TOKEN` = the fine-grained PAT (pending decision; read-only
     mode until set)
   - `GITHUB_REPO` = `owner/activity-vault` (the repo the cron commits to)
   - `REPO_STATIC_PREFIX` = `` (empty — static JSON lives at `api/v1/` from
     the repo root)
4. **Build machine: Standard.** Project → Settings → Build & Deployment →
   Build Machine → **Standard. Never Turbo** — September 2026 Turbo CPU
   billed **$38.64** (invoice 1ZU1WJJS-0012). Turbo buys nothing on a static
   site with a ~1s build.
5. **Deploy.** Open `/api/health` — assert `status:"ok"` and the `functions`
   list matches the 4 files above.
6. Dashboard → **Cron Jobs** — assert the one cron is listed with schedule
   `0 11 * * *`. Trigger it once manually (Functions → ⋯ → Test); the secret
   is sent automatically when `CRON_SECRET` is set. Check `[cron]` log lines:
   `[cron] scout done changed=… committed=… sources_ok=…`.
7. `curl` the roster and assert the envelope schema:
   ```
   curl -s $URL/api/health | python3 -c "import json,sys; e=json.load(sys.stdin); assert e['ok'] and e['meta']['service']=='vault-scout'"
   curl -s "$URL/api/review-queue" | python3 -c "import json,sys; e=json.load(sys.stdin); assert e['ok'] and 'candidates' in e['data']"
   curl -s -o /dev/null -w '%{http_code}\n' "$URL/api/cron/scout"        # expect 401 (no manual secret)
   curl -s -o /dev/null -w '%{http_code}\n' -X POST "$URL/api/review-decide"  # expect 401
   ```
   Then: `BASE=$URL ./tests/api.test.sh` (sections 1–8 run against preview;
   section 9 does a real-feed cron run, section 10 needs care — it installs a
   clearly-labeled test fixture candidate; use only on preview, never prod).
8. **Disable test:** block `/api/*` (Vercel dashboard → temporarily route
   `/api/(.*)` to 404, or redeploy with `api/` renamed) → reload `review.html`
   → assert the queue renders fully from the pre-rendered static data with
   amber **"cached · updated HH:MM"** badges and zero blank widgets. Restore.
9. Open `review.html` — assert the badges read `live` on the warm
   deployment, and the queue + 90-day decision log render.

## 5. Env var table

| name | required? | where set | rotation notes |
|---|---|---|---|
| `CRON_SECRET` | yes | Vercel → Project → Settings → Environment Variables (Production) | 32+ hex chars; authorizes cron + `POST /api/review-decide`. Rotate in dashboard; no code changes needed. |
| `GITHUB_REPO_TOKEN` | no (read-only mode until set) | same | Fine-grained PAT, contents:write on this repo only. Pending the user's call (spec §14.1). |
| `GITHUB_REPO` | no (cron only) | same | `owner/activity-vault`; the repo cron commits land in. |
| `REPO_STATIC_PREFIX` | no (cron only) | same | Empty for this repo (`api/v1/` at root). |

No other env vars. No secrets in code, `vercel.json`, comments, or test
fixtures — ever.

## 6. Hobby limits table

| resource | Hobby limit | our usage |
|---|---|---|
| Bandwidth | 100 GB/mo | static + small JSON; personal-use sites ≈ MBs |
| Build minutes | 6,000/mo | seconds per deploy; daily cron redeploys ≈ negligible |
| Function invocations | 100k/mo | edge cache absorbs reads (§1.6); ~1 cron + trickle |
| Function duration | 10s default (Hobby) | all functions designed ≤10s; no `maxDuration` overrides |
| Cron jobs | daily minimum cadence, UTC, ±60min window, prod only | 1 job, `0 11 * * *` UTC |
| Overage billing | **none — usage pauses instead of charging** | design stays far under limits; a pause is a visible signal, not a bill |

## 7. Cold-start behavior

- First hit after a deploy (or a long idle) is a **cold start**: typically
  **1–3s** on Hobby, measured locally at **~15ms warm** for `/api/health`
  (local numbers aren't Vercel numbers — record real preview timings in
  WAVELOG on first deploy).
- The client (`assets/js/api-client.js`) waits **7s** for the live function.
  A cold start usually still wins the race; one that doesn't falls back
  cleanly to the static JSON.
- **First paint never waits for `/api/*`.** `review.html` ships pre-rendered
  with the static queue baked in; the badge shows **"waking server…"** while
  the live fetch is in flight, then swaps to **"live"** (or stays honest at
  **"cached · updated HH:MM"**).
- Budget (spec §12.4): first hit <10s or the 7s client timeout always loses —
  investigate before blaming the network.

## 8. Cron behavior

- **Daily, UTC, ±60min window, production deployments only.** Schedule:
  `0 11 * * *` — may fire any time 11:00–12:00 UTC.
- **Best-effort delivery** — missed or duplicate invocations happen. The job
  is idempotent: content-hash commits (no change → no commit), a 60s
  duplicate-delivery cooldown, SHA-retry on GitHub write conflicts.
- **What it does:** parallel RSS fetch (4s each, partial success is normal) →
  KEEP/DROP relevance filter → 4-layer dedupe (seen-uids → queue ids → URL
  match vs archive+queue → title near-dupe vs the full archive) →
  `writeJsonIfChanged` commits `pipeline/seen.json`, `pipeline/review-queue.json`,
  `pipeline/decided.json` → redeploy re-runs `scripts/build.py`, which
  re-publishes the static fallbacks (fallback and store stay the same bytes).
- **Read-only mode** (until `GITHUB_REPO_TOKEN` is set): the job still runs,
  computes real candidates, and returns them in the envelope with
  `degraded:true` + a plain-words note — it just doesn't commit.
- **Alerting is logs-only** — fixed prefixes, reviewed in the Vercel
  dashboard (Functions → Logs):
  `[cron] scout start …`, `[cron] scout done changed=… committed=…`,
  `[cron] scout fail stage=…`, `[upstream] <feed> fail …`,
  `[ratelimit] …` (IP hashed, never raw).
- **A cron job with no `[cron]` log in 48h is itself the alert.**

## 9. Custom domain notes

- Add in Vercel dashboard → Domains; the `/api/*` paths move with the domain
  automatically.
- If a domain is assigned later, update absolute URLs in `llms.txt`/sitemap
  and the envelope schema's `$id` (`api/v1/schema/envelope.json`) — flag as
  a wave task at that time.

## 10. Rollback

`git revert` the offending commit → push → Vercel redeploys the previous good
state. Functions are stateless; the data files are versioned JSON in the
repo — there is no database, no migration, nothing else to unwind.
If a bad cron commit lands, reverting restores the previous static files,
and the next deploy re-publishes them atomically.

## 11. Cost rules

- **Build machine: Standard. Never Turbo.** (Sept 2026 invoice 1ZU1WJJS-0012:
  $38.64 of Turbo build CPU across the user's projects.) These are static
  sites with ~1s builds; Turbo buys nothing. Hobby covers them (100GB
  bandwidth, 6,000 build min, 100k invocations/mo; pauses instead of
  overage billing).
- `installCommand`: `echo 'no dependencies'` — zero npm packages, nothing to
  install, builds stay seconds-long.
- Static builds are the only builds. Function bundling is part of the static
  build (no separate build minutes).
- If any site approaches 80% of any Hobby limit, the wave report flags it and
  the fix is *less* work (longer edge TTL, smaller payloads) — never a plan
  upgrade without the user's explicit word.

---

## Known deviations (Wave A + B)

1. `POST /api/review-decide` does **not** call the endpoint from the browser:
   approve/reject is operator-shell-only with `CRON_SECRET` (the spec's
   §7.6 `?admin=1` + secret-paste UI was not built — the secret never goes in
   a page). `review.html` is the read-only human-in-the-loop surface.
2. Approve records `approved_via:'scout'` on the decision entry instead of
   minting an activity record (PIPELINE.md requires a human to adapt ideas
   into original words; minting steps/materials server-side would be
   fabricated data).
3. Without `GITHUB_REPO_TOKEN`, cron and decide run read-only (honest
   `degraded:true` / 500 `REFRESH_FAILED`) until the user decides (spec §14.1).
