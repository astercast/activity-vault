---
name: week-planner
description: Build a no-repeat week of activities from days, slots, and constraints.
---

# Build a no-repeat week

## Use when

A teacher wants Monday–Friday planned in one go: "give me two activities a day, 30 minutes each, no repeats."

## Inputs

- Days to fill (default Mon–Fri)
- Slots per day (1–4)
- Max minutes per activity
- Category mix wanted (or "surprise me")
- Hard constraints: no-prep only, indoor only, allow repeats

## Procedure

1. Pull the matching pool from `api/v1/activities.json` using the constraints (same filter logic as `activity-finder`).
2. Check the pool is big enough: `pool_size >= days × slots` when repeats are off. If not, say so up front and offer to allow repeats or loosen a constraint.
3. Deal activities round-robin across days, spreading categories — never put two high-energy PE activities back-to-back; alternate energy levels (move → make → calm → play).
4. For each pick, write one line on *why it fits* (time, prep, category).
5. Output a printable plan: day, slot, activity name, page link. Point the teacher at `planner.html` for the interactive version.

## Worked example

Mon–Fri, 2 slots/day, ≤30 min, no-prep, indoor → 10 picks from the 45-activity no-prep pool. Alternate: Monday slot 1 `simon-says` (burn energy), slot 2 `comic-strip-creations` (calm make)…

## API references

- `api/v1/activities.json`
- `api/v1/categories.json`

## Pitfalls

- Scheduling three quiet-focus activities in a row on a rainy Friday — alternate energy or the room falls asleep (or riots).
- Repeating a category-heavy week: if the pool is thin, repeats are better than forcing bad fits — say which slots repeat.
