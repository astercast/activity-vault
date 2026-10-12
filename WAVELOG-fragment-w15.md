# WAVELOG fragment — Wave 15 — 2026-10-11 — Smart Weekly Planner 3.0 (flagship interactive tool)

## Wave 15 — 2026-10-11 — Smart Weekly Planner 3.0: multi-week plans, brain breaks, weather backups, supply list, substitute kit + web-craft design pass

**What shipped:**
- **Multi-week planning (1–4 weeks)** — new `weeks` selector in the planner form. `P.buildMultiWeek(activities, opts, catBucket, seed)` deals each week with a shared no-repeat set across all weeks (unless repeats are allowed); `opts.weeks` clamped 1–4 (`P.clampWeeks`); collection seeds go in week 1 only. Each week gets its own landmark section with a fluid-type head, per-week balance meter + warnings, and a sticky "Jump to" nav (week anchors + the 3.0 extras). Saved plans, `?plan=` links, copy-text, and `.ics` all span weeks: the shareable payload is now **v2** (`{version: 2, weeks: [{weekNum, days}]}` — v1 flat-`days` payloads still import as week 1), `.ics` shifts +7 days per extra week with `-w<idx>` UID suffixes (week-0 UIDs byte-stable).
- **⚡ Brain break of the day** — every day card shows a research-backed microbreak idea: `P.brainBreak()` picks a movement-bucket activity that runs cold in ≤10 min, never already scheduled (2026 engagement research: microbreaks under 10 min counter cognitive fatigue; IJRESS review + Ohio State study via `research_notes/activity-ideas-20261011-2010/notes/angle-3-engagement-research.md`).
- **🌦️ Weather-aware backups** — every outdoor-only slot gets an indoor backup picked automatically (`P.needsWeatherBackup` / `P.weatherBackupFor`: indoor, age/time-fit, unscheduled; no-prep first, then high-energy so kids still move), with a one-tap "Swap in backup" button. Outdoor cards in the print deck carry a "🌦️ If it rains: run X instead" line.
- **🛒 Supply-list aggregation** — `P.aggregateSupplies(weeks, byId)` collapses equivalent material strings ("printer paper (a stack)" + "printer paper" → one line via `P.normalizeSupplyItem`), counts scheduled slots per item, lists the days needed — busiest items first. On-page section (top 40 + "…and N more"), 📋 Copy supply list, and a full print page in the deck.
- **🆘 Substitute kit** — per slot, an any-sub-can-run-it backup: `P.subBackupFor()` requires `no_prep` (the 2026 "copy-free" gold standard from `research_notes/.../angle-5-low-prep.md`), prefers indoor + weather-proof picks, shows the first 3 plain-language steps. Renders as native `<details>` week accordions (first week open); prints as its own deck section.
- **Design craft pass (web-craft research domain, mandatory input)** — reports `research_notes/web-craft-20261011-2014/report.md` + `research_notes/web-craft-20261011-2025/report.md` read in full; findings applied, site identity kept (warm-paper tokens untouched):
  - Same-document View Transitions on slot actions — Baseline per report, shipped with the reduced-motion + calm-mode guard (report: "ship unguarded for in-page transitions", always gate behind `prefers-reduced-motion`).
  - Scroll-driven day-card entrance (`animation-timeline: view()`, `@supports`-gated) — progressive enhancement only (~83%, Firefox still flagged per round-2); failure mode is "no animation, never invisible content" (finished state is the CSS default) per the round-2 craft rule.
  - Container queries on the week grid (`container-type: inline-size`) — "page layout = media queries, component layout = container queries."
  - Motion tokens (`--dur-fast/base/slow`, `--ease-standard/decelerate`) in `:root`; entrances decelerate, transform + opacity only, ≤500ms (report §3 physics/choreography rules).
  - `text-wrap: balance` on week/section heads (Baseline 2024, cheap); `font-variant-numeric: tabular-nums` on slot times and supply counts; fluid `clamp()` week heads.
  - Sticky "Jump to" section nav with `scroll-margin-top` anchors (WCAG 2.4.11 focus-not-obscured).
  - 🍃 **Calm mode toggle** (report idea #12/#13 → Teacher flagship): user-controlled sensory envelope beyond the `prefers-reduced-motion` binary — kills the scroll entrance, view transitions, and nav transparency; persisted in `localStorage`; backed by the TetraLogical Anxiety Framework ("ensure people are in control").
  - DnD affordances: grab/grabbing cursors, inset drop bar + "Drop here" label (was a bare dashed outline); keyboard ↑/↓ parity kept, focus restored to the triggering button after re-render via `data-fkey`.
  - Deliberately NOT applied: anchor-positioned tooltips (no genuine tooltip need — meter legend already spells out every bucket; restraint wins), `content-visibility: auto` (marginal benefit, real CLS/fragment-navigation risk on a tool page), MPA cross-document view transitions (site-wide decision, out of lane), variable-font loading (site uses system stacks — no font files to optimize). `llms.txt` verified H1 + links + length — passes the Lighthouse 13.3 Agentic Browsing audit shape.
- **Docs/agentic** — AGENT.md week-planner paragraph rewritten for 3.0 (inputs, v2 payload, 3.0 helpers, design-craft notes) + Workflow 4 updated (multi-week procedure, v2 payload shape, `.ics` week offsets, 3.0 extras API); API.md week-plan paragraph; README.md planner line; `llms.txt`/`llms-full.txt` planner + skill lines; `skills/balanced-week-builder.md` → 3.0 (frontmatter + "What's new in 3.0" section; `api/v1/skills.json` regenerated from the frontmatter).
- **No activity data touched** — zero new activity ids, `data/activities.json` and all activity pages untouched by this wave (wave-14 lane owns them).

**Validation (wave 15):**
- `scripts/build.py`: BUILD OK
- `scripts/check_api.py`: ALL CHECKS PASSED
- `scripts/test-planner-core.js`: ALL CHECKS PASSED (87 assertions — 48 carried + 39 new: multi-week dealing/no-cross-week-repeats/seeds-week-1-only/clamp/determinism, brainBreak, weatherBackupFor, subBackupFor, aggregateSupplies incl. multi-wording collapse, exportICS weekOffset, planText WEEK headers, v1/v2 share round-trips, DOM id cross-check of all 33 `getElementById` ids in planner.js against planner.html)
- `node --check`: planner-core.js, planner.js — clean

**Wave 15 push resolution:** (filled after push)

**Parallel-lane incident + stash reconciliation (2026-10-11 ~20:0x–20:3x PDT):**
- Mid-wave, another worker's tree-wide revert wiped all uncommitted wave-15 edits (planner-core.js, planner.js, planner.html, style.css, test-planner-core.js); the work was redone from context and checkpoint-committed as `332abde`.
- The wave-16 worker's `gh-push.py` run then snapshotted the working tree and pushed uncommitted wave-15 edits to remote main; they repaired with revert pushes (no force-push); remote main verified clean. New commit `1067c67` records the incident.
- 4 stashes inspected, none popped (all hold other lanes' work or strictly-older snapshots — popping would clobber lanes):
  - `stash@{0}` `WAVE15-LANE-STASH`: wave-14's `data/activities.json` + regenerated HTML shells + `scripts/build.py` — wave-14 lane, left for them.
  - `stash@{1}` `wave15-inprogress-hold3`: older test-planner-core.js (pre-dynSet fix; my committed version is newer) + build.py with wave-14's why/related blocks (already in the working tree) — nothing newer than `332abde`.
  - `stash@{2}` `wave15-inprogress-hold2`: older style.css/planner.html. NOTE: this snapshot contains wave-14's uncommitted site-wide design-craft CSS (motion tokens `--dur-fast/base/moderate` + `--ease-accelerate`, `@view-transition { navigation: auto; }`, `h1, h2 { text-wrap: balance; }`) that is NOT in the working tree (lost in the tree wipe) — wave-14 worker should restore it; my `:root` motion tokens (`--dur-slow`, no `--dur-moderate`) are a separate set, no duplication in the tree today, but the two sets should be deduped when wave-14 restores theirs.
  - `stash@{3}` `wave15-inprogress-hold`: wave-14's `assets/app.js` browse work (copy-free + no-elimination filters) + pre-wave-15 planner files — left for wave-14.
- No `<<<<<<<` conflict markers found in the tree or any stash; the test-planner-core.js "concurrent edit" was a strictly-older snapshot, resolved by keeping the committed version. My wave-15 commit contains only wave-15 files (verified via `git show --stat`).

**Merge attention:**
- `assets/style.css`, `planner.html`, `assets/planner.js`, `assets/planner-core.js`, `scripts/test-planner-core.js`, docs — wave-15 lane; committed.
- `scripts/build.py`, `data/activities.json`, `activity/*.html`, `api.html`, `collections.html`, `halloween.html`, `index.html`, `party.html`, `spring.html`, `sub.html`, `summer.html`, `thanksgiving.html`, `assets/thanksgiving.js`, `assets/app.js`, `api/v1/*` (except `skills.json`), `sitemap.xml` — other lanes' active work; wave-15 did not touch them (except reading). The 4 stashes above belong to those lanes.
- `api/v1/skills.json` — regenerated from wave-15's skill frontmatter change; safe to take.
