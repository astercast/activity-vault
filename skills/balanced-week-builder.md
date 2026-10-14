---
name: balanced-week-builder
description: Build auto-balanced multi-week activity plans with an energy balance meter, prep caps, and no repeats, the Smart Weekly Planner 3.0 recipe (brain breaks, weather backups, supply lists, substitute kits).
---

# Build a balanced week (Smart Weekly Planner 3.0)

## Use when

A teacher wants a full week planned in one go **and** wants the energy balanced, "plan my week, no two sleepy days in a row" or "I need 3 days of camp for 8-year-olds, keep the prep light." Also for multi-week stretches: "plan the next three weeks, no repeats."

## Inputs

- Program type: `after-school` (2 slots/day, ≤30 min, starts 3pm), `camp` (3 slots/day, ≤45 min, starts 9am), `classroom` (2 slots/day, ≤20 min, indoor, starts 1pm)
- Age band: `prek-k` (3–6), `g1-2` (6–8), `g3-5` (8–11), `g6-8` (11–14), `all` (3–14)
- Days to fill (default Mon–Fri; Sat/Sun supported), **weeks to plan (1–4)**, slots per day (1–4), minutes per activity
- Optional category subset; hard constraints: no-prep only, indoor only, allow repeats
- Prep cap: max prep-heavy (non-`no_prep`) activities per week (default 2, 0 = no prep at all)
- Optional seed: a collection id. Curator picks go in first (week 1 only), gaps fill automatically

## Procedure

1. Pull the pool from `data/v1/activities.json` with the filter semantics from `AGENT.md`: age overlap, `time_min <= minutes`, category ANY-match, `no_prep` / indoor gates.
2. Pull `data/v1/balance-buckets.json`. An activity's **energy bucket** is the bucket of its **primary (first) category**: `movement` ⚡, `calm` 🧘, `creative` 🎨, `outdoor` 🌳, `mixed` 🔀 (all-rounder).
3. If seeded, place collection picks first (in order), skipping any that fail the filters.
4. Deal round-robin across days × slots. Score each candidate: `day_bucket_count × 3 + week_bucket_count + 2 × (each category already used this week)`. Shuffle ties; take the lowest score. Skip used ids unless repeats are allowed; skip prep-heavy picks once the weekly cap is hit (relax the cap only if repeats are allowed and nothing else fits).
5. For each day, count buckets across filled slots. **Warn** when a non-`mixed` bucket holds more than half the day's slots:
   - movement-heavy → "add a calm or creative slot so the room lands softly"
   - calm-heavy → "the room may get sleepy; mix in some movement"
   - creative-heavy → "budget extra cleanup time"
   - outdoor-heavy → "keep an indoor backup ready"
   - 3+ slots with zero calm → "add a quiet landing"
6. Week-level checks: 4+ filled slots with zero movement → "kids need to move"; 6+ with zero calm → "plan a calm landing".
7. Output: day → slot → activity name + page link (`activity/<id>.html`) + one-line why-it-fits. Point the teacher at `planner.html` for the interactive version (drag-and-drop, per-slot swap, 🎲 surprise gap-fill, named saved plans, 📥 `.ics` export, 🔗 shareable `?plan=` link).

## What's new in 3.0

- **Multi-week plans (1–4 weeks):** one shared no-repeat set across all weeks (unless repeats are allowed), `P.buildMultiWeek(activities, opts, catBucket, seed)`; `opts.weeks` is clamped to 1–4; collection seeds go in week 1 only. The `?plan=` payload is now v2 (`{version: 2, weeks: [{weekNum, days}]}`), v1 payloads (flat `days`) still import as week 1. `.ics` shifts +7 days per extra week.
- **⚡ Brain break of the day:** `brainBreak(pool, usedIds, byId, catBucket, seed)`, movement-bucket, `time_min <= 10`, unscheduled. Research-backed: microbreaks under 10 minutes counter cognitive fatigue (2026 engagement research).
- **🌦️ Weather backups:** `needsWeatherBackup(a)` flags outdoor-only slots; `weatherBackupFor(...)` returns an indoor pick (no-prep first, then high-energy so kids still move). The UI offers a one-tap "Swap in backup".
- **🛒 Supply list:** `aggregateSupplies(weeks, byId)` groups equivalent material strings ("printer paper (a stack)" + "printer paper" → one line), counts scheduled slots per item, lists the days, busiest items first. Copyable as text, rides along in the print deck.
- **🆘 Substitute kit:** `subBackupFor(...)`, `no_prep` required (the 2026 "copy-free" gold standard), indoor + weather-proof preferred; the UI shows the first 3 steps so any adult can run it cold. Prints as its own section.

## Worked example

Camp, grades 3–5, Mon–Wed, 3 slots/day, ≤45 min, prep cap 2 → 9 slots from the ~220-activity pool. Day 1 might land `freeze-dance` (⚡ movement, burns the wiggles), `comic-strip-creations` (🎨 creative), `silent-ball` (🧘 calm landing). The meter shows 1-1-1 per day; a day that lands 3× ⚡ gets the "lands softly" warning.

## API references

- `data/v1/activities.json`
- `data/v1/balance-buckets.json` (buckets + category→bucket mapping)
- `data/v1/collections.json` (seeding: `planner.html?from=collection:<id>`)
- Shareable plans: `planner.html?plan=<base64url>` (see `AGENT.md` Workflow 4 for the payload shape)

## Pitfalls

- The bucket comes from the **primary** category only. A `crafts`+`pe-movement` activity counts as 🎨 creative, not ⚡ movement.
- `mixed` (all-rounder) never triggers a dominance warning. It's the neutral filler by design.
- The prep cap counts non-`no_prep` activities week-wide; a seeded collection pick can eat the cap early.
- Seeded picks that fail the filters are silently skipped (the planner says how many), don't assume all 12 curator picks landed.
- `.ics` export uses floating local times (no timezone) starting at the program's start hour on the next matching weekday.
