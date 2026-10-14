---
name: rainy-day-rescue
description: Instant indoor plan when the weather kills outdoor time.
---

# Rainy-day rescue

## Use when

The forecast just ruined the field plan: "it's pouring, I have 30 kids inside for an hour."

## Inputs

- Minutes to fill
- Group size
- Room type (classroom, gym, multipurpose)
- Energy level to target (burn it off vs. calm it down)

## Procedure

1. Filter `data/v1/activities.json` for `categories` containing `rainy-day` AND `indoor` in `location`.
2. Build a 3-act arc: **burn** (10–15 min: `freeze-dance`, `silent-ball`), **engage** (20–30 min: `pictionary`, `charades`, `indoor-scavenger-hunt`), **land** (10 min: `calm-breathing-shapes`, `story-dice`).
3. Prefer no-prep first. Rainy days are when prep time evaporates too.
4. Always include one calm landing activity. Ending a rainy-day block on a high-energy game releases a room you then have to manage.

## Worked example

60 minutes, 30 kids, classroom, pouring rain → `freeze-dance` (15) → `pictionary` (25) → `calm-breathing-shapes` (10), with `indoor-scavenger-hunt` as the overflow backup.

## API references

- `data/v1/activities.json`

## Pitfalls

- Picking only quiet activities for a cooped-up group. They need to move *first*, then focus.
- `musical-chairs` in a small classroom, check the room fits the game, not just the category.
