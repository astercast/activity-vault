# PIPELINE — how the Activity Vault library grows

The Vault is a living archive. This doc defines the contribution format and the refresh process so every wave (human or agent) adds activities the same clean way.

## Contribution format

Every activity is one JSON object in `data/activities.json`. All fields required unless noted:

```json
{
  "id": "paper-airplane-challenge",
  "name": "Paper Airplane Challenge",
  "tagline": "Fold, throw, measure, iterate — the cheapest engineering lesson there is.",
  "categories": ["stem", "crafts"],
  "age_min": 7,
  "age_max": 12,
  "group_min": 4,
  "group_max": 40,
  "time_min": 20,
  "time_max": 45,
  "location": ["indoor"],
  "materials": [{"item": "printer paper (a stack)"}],
  "no_prep": true,
  "setup": "Clear a throwing lane...",
  "steps": ["Show the group one basic dart fold..."],
  "variations": {"easier": "...", "harder": "..."},
  "safety": "Throw only down the lane..." ,
  "tags": ["season:fall"],
  "source": "https://example.com/inspiration-post"
}
```

- `safety`: `null` when nothing beyond ordinary classroom sense applies. Never invent safety or medical claims.
- `tags` (optional): season/occasion tags from the fixed vocabulary in `scripts/build.py`
  (`season:fall`, `holiday:halloween`, `holiday:dia-de-muertos`, `theme:spooky`).
  Powers the "Season / occasion" filter. New tags must be added to the validator,
  `assets/app.js` labels, and the API docs together.
- `source` (optional): URL of the inspiration post when an activity is adapted from
  the RSS review queue. Rendered on the page as an "inspired by" credit.
- `id`: lowercase slug, unique, matches `^[a-z0-9-]+$`.
- `categories`: 1–3 ids from `data/categories.json`.
- `materials`: `[]` means truly nothing needed (then `no_prep` must be `true`).

## Content rules (standing)

1. **Original words only.** Activities must be real, classic, public-domain concepts (folk games, standard crafts, textbook demos) described in our own words. Never copy text from other sites.
2. **No invented claims.** Safety notes = common sense (scissors supervision, allergy checks, clear play space). No medical/therapeutic claims — `calm-breathing-shapes` is a calm-down routine, not therapy.
3. **Teacher-real.** Every activity must be runnable by one adult with a normal classroom budget. If it needs exotic supplies, it doesn't belong.
4. **Age-honest.** Ranges must reflect reality — no "ages 5–12" on something needing fine motor skills a 5-year-old doesn't have.

## Refresh process (per wave)

1. Pick a theme (e.g. "10 more rainy-day games", "summer water play", "5-minute fillers").
2. Draft records in the contribution format above.
3. Run `python3 scripts/build.py` — it validates schema, id uniqueness, category ids, ranges, and renders every page. Fix until `BUILD OK`.
4. Run checks: `node --check` on JS, link check, JSON parse.
5. Update counts in `WAVELOG.md` and commit.

## RSS watch (live intake)

`pipeline/` runs a weekly scan over teaching/activity blogs and queues fresh
activity ideas for **human review** — it never publishes anything on its own.

- `pipeline/feeds.json` — curated feeds (WeAreTeachers, Hands On As We Grow,
  Teach Beside Me). All verified working 2026-10-11.
- `pipeline/scan.py` — stdlib-only RSS scanner. Keyword-filters for
  activity-relevant posts, dedupes via `pipeline/seen.json`, appends candidates
  to `pipeline/review-queue.json` with `status: "pending"`. Exits 0 on feed
  errors (logs and continues). **It never touches `data/activities.json`.**
- `pipeline/refresh.sh` — one-line runner for cron.
- `pipeline/review-queue.json` — the human queue. Each entry: feed, title, link,
  published date, summary, and a note to adapt into original words.

Review workflow: read a pending candidate → adapt the idea into **original
words** per the contribution format above (link the source post as inspiration,
never copy text) → add it in a wave → set its queue entry to `"accepted"` (with
the new `activity_id`), `"rejected"` (with a `decision` reason), or `"deferred"`
(good concept, wrong season — hold for a later wave).

Cron (Mondays 7am, no keys needed):

```
0 7 * * 1  cd ~/workspace/activity-vault && ./pipeline/refresh.sh >> pipeline/scan.log 2>&1
```

## Category balance targets

Keep every category at 8+ activities. Current counts are printed by the build; if a category falls behind, the next wave prioritizes it.

## Quality bar for new activities

- Steps a substitute teacher could follow cold.
- At least one variation in each direction (easier/harder).
- `time_min` = the honest floor, not the optimistic one.
