---
name: activity-finder
description: Find the right activity fast using age, time, group size, and materials-on-hand filters.
---

# Find the right activity fast

## Use when

A teacher needs an activity for a specific situation: "I have 25 minutes, 18 nine-year-olds, and zero prep time."

## Inputs

- Age range of the kids (e.g. 9–10)
- Minutes available
- Group size
- Materials on hand (or "no-prep only", "indoor only")
- Desired category or vibe (burn energy, calm down, make something)

## Procedure

1. Start from the constraint that bites hardest, usually time or materials. Filter `data/v1/activities.json` on `time_min <= minutes` and `no_prep == true` first.
2. Narrow by age overlap: keep activities where `age_min <= kid_age <= age_max`.
3. Narrow by group: keep where `group_min <= size <= group_max`.
4. If nothing survives, loosen in this order: group size, then age, then time, then materials.
5. Present 3 options, not 30: one safe classic, one creative stretch, one backup. Link each to its `activity/<id>.html` page.

## Worked example

18 kids, age 9, 20 minutes, indoors, no prep → `silent-ball` (10–25 min, ages 7–12, 8–30 kids, no-prep, indoor) is the safe pick; `twenty-questions` is the calm backup.

## API references

- `data/v1/activities.json`
- `data/v1/filters.json`

## Pitfalls

- Filtering on `time_max` instead of `time_min`. An activity that *can* run 45 minutes still fits a 20-minute slot if its `time_min` is 15.
- Forgetting the indoor/outdoor flag on a rainy day, check `location` before promising a field game.
