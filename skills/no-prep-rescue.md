---
name: no-prep-rescue
description: Grab-and-go activities that need zero prep and zero (or near-zero) materials.
---

# No-prep rescue

## Use when

The supply closet is empty, the bell rings in five minutes, and the plan just fell apart: "I need something now, with nothing."

## Inputs

- Ages of the kids
- Minutes to fill
- Group size
- Indoors or outdoors

## Procedure

1. Filter `data/v1/activities.json` for `no_prep == true`. These need zero advance setup.
2. If materials matter too, keep only activities where `materials` is empty (`[]`), genuinely nothing needed.
3. Narrow by age overlap (`age_min <= kid_age <= age_max`), group overlap, and `time_min <= minutes`.
4. If the pool is thin, relax to "materials on hand": keep activities whose every `materials[].item` mentions paper, pencil, pen, crayon, marker, glue, or scissors, the classroom-basics test.
5. For a time block, sequence 2–3 short ones back to back rather than stretching one thin.

## Worked example

25 minutes, 20 kids, ages 8–10, indoors, nothing on hand → `silent-ball` (no-prep, 8–30 kids, 10–25 min) then `twenty-questions` (no-prep, whole group, 10–20 min). Both need zero materials.

## API references

- `data/v1/activities.json`
- `data/v1/filters.json` (`no_prep_only`, `indoor_only`)

## Pitfalls

- Assuming `no_prep` means no materials, check the `materials` array too; some grab-and-go activities still need everyday items.
- Running one long no-prep game for the whole block. Two shorter ones keep attention alive.
