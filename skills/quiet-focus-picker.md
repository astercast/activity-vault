---
name: quiet-focus-picker
description: Pick wind-down and calm-focus activities to land a loud group or fill a calm slot.
---

# Pick the wind-down

## Use when

The group needs to come down: after lunch, after PE, end of day, or a dedicated calm slot in the plan.

## Inputs

- Minutes available
- Energy level right now (bouncing off walls vs. already mellow)
- Individual vs. whole-group
- Room setup (desks, floor, circle)

## Procedure

1. Filter `data/v1/activities.json` for `categories` containing `quiet-focus`.
2. If the group is still loud, start with a **bridge** activity that has structure but no frenzy: `story-dice`, `exquisite-corpse-draw`. Then move to truly calm (`mandala-drawing`, `calm-breathing-shapes`).
3. If already mellow, go straight to deep-calm: `mandala-drawing`, `comic-strip-creations`, `listening-walk`.
4. Keep the lights low and the voice low. The activity is half the calm; the atmosphere is the other half.

## Worked example

15 minutes after PE, 25 kids, bouncing → `story-dice` quick-draw round (10) → `calm-breathing-shapes` (5). Structured enough to hold them, calm enough to land them.

## API references

- `data/v1/activities.json`

## Pitfalls

- Jumping straight from tag to silent mandalas, the whiplash fails. Always bridge down.
- Treating `calm-breathing-shapes` as a medical or therapeutic exercise. It's a classroom calm-down routine, nothing more. Keep it light and optional.
