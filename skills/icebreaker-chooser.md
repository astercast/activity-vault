---
name: icebreaker-chooser
description: Pick first-day and new-group icebreakers matched to group size and shyness level.
---

# Choose the right icebreaker

## Use when

New group, first day, or new kids joining: "half my group doesn't know each other's names yet."

## Inputs

- Group size
- How well they know each other (strangers / some know each other)
- Shyness level (bold group vs. quiet group)
- Minutes available

## Procedure

1. Filter `data/v1/activities.json` for `categories` containing `icebreakers`, then by group size fit.
2. For shy groups, start **low-exposure**: `name-chain` or `would-you-rather-circle` (everyone participates, nobody is singled out). Save `two-truths-and-a-lie` for round two.
3. For bold groups, go straight to **high-energy**: `human-knot`, `duck-duck-goose`, `simon-says`.
4. Sequence: names first (10 min), then laughter (10–15 min), then teamwork (15+ min). Never open with a game that puts one kid on stage alone.

## Worked example

20 strangers, age 9, shy, 30 min → `name-chain` (10) → `would-you-rather-circle` (10) → `human-knot` (10). Names learned, laughs had, nobody singled out.

## API references

- `data/v1/activities.json`

## Pitfalls

- Opening with `two-truths-and-a-lie` in a brand-new shy group — being the center of attention on day one is a lot. Warm up first.
- Icebreakers that eliminate players (`simon-says` with outs) on day one — use the no-elimination variants until the group gels.
