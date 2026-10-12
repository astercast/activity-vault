---
name: outdoor-play-picker
description: Pick the right outdoor activity for the space, weather, and energy level you have.
---

# Outdoor play picker

## Use when

The group gets the field, playground, or a patch of nature: "we have 40 minutes outside — what actually works out there?"

## Inputs

- Ages of the kids
- Minutes available
- Group size
- Space available (field, playground, nature spot, blacktop)
- Energy goal (burn energy vs. observe and explore)
- Weather reality (hot sun, cold, wind — affects water and running games)

## Procedure

1. Filter `api/v1/activities.json` for `categories` containing `outdoor` and `'outdoor'` in `location`.
2. Split by energy: for wiggly groups prefer `pe-movement` crossovers (chase and tag games, relay formats); for calmer blocks prefer `seasons` / `stem` crossovers (nature walks, scavenger hunts, leaf and rock science).
3. Narrow by age overlap, group overlap, and `time_min <= minutes`.
4. Match the space: check `setup` for what the activity actually needs (cones and open field vs. a tree to sit under). Blacktop-only groups should avoid anything whose steps mention grass, mud, or digging.
5. Hot sun → avoid sustained sprint games; cold → avoid standing-around observation. Pick from `variations.easier` to adjust.

## Worked example

40 minutes, 25 kids, ages 7–9, big field, burn energy → `capture-the-flag-lite` or `flag-tag`, then cool down with `nature-scavenger-hunt`.

## API references

- `api/v1/activities.json`
- `api/v1/categories.json`

## Pitfalls

- Tag games with a wide age spread — the oldest kids dominate; use the `variations.harder` twist or split into age-matched teams.
- Forgetting water and shade on hot days — a common-sense check, not in the record.
- Observation activities with a wired group — burn first, then explore.
