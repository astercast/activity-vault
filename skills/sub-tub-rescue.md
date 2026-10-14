---
name: sub-tub-rescue
description: Build a print-ready substitute-teacher emergency plan for any grade band and time gap.
---

# Sub Tub rescue

## Use when

No plans were left, the sub is already in the building, and someone needs a fill-the-exact-time emergency plan: "I need 45 minutes for 4th grade, I have nothing but paper."

## Inputs

- Grade band (PreK–K, 1–2, 3–5, 6–8)
- Minutes to fill (15/30/45/60/90)
- Materials on hand: nothing / paper & pencils / basic art supplies / full classroom
- Location: indoors only / outdoors OK

## Procedure

1. Open `sub.html` in the Vault (or do it by hand): filter `data/v1/activities.json` by grade band (activity age range overlaps the band), materials tier, and location.
2. Sequence the plan: **opener** (short, high-energy or an icebreaker), **mains** (the longest blocks), **closer** (always something calm, a `quiet-focus` or `rainy-day` activity).
3. Fill the exact minutes. If a gap under ~10 minutes remains, add buffer to the last block; if 10+ remain, append a generic closer: read-aloud + free draw (paper tier) or share circle & cleanup (nothing tier).
4. Generate the "Dear sub" note: teacher name, class, date, schedule quirks, pickup/dismissal, behavior plan, reliable helpers, where supplies live, early-finisher backup. The sub should be able to run it cold.
5. Print one copy for the sub folder, one for the sub. The plan sheet is the screenshot-friendly artifact.

## Material tiers (what counts)

- **nothing**: empty `materials` list only. Truly empty-handed (note: `no_prep` alone is not enough; 52 no-prep activities still list paper etc.).
- **paper & pencils**: no-prep, plus activities whose every material mentions paper/pencil/pen/crayon/marker/cardstock/notebook.
- **basic art supplies**: no-prep, plus activities built from the standard shelf (glue, scissors, tape, paint, string, cups, plates, stickers, chalk).
- **full classroom**: everything matching grade band and location.

## Worked example

45 minutes, grades 3–5, nothing at all, indoors → `simon-says` (10) → `twenty-questions` (15) → `two-truths-and-a-lie` (10) → `calm-breathing-shapes` (10). Sub note pre-filled with the sequenced blocks.

## API references

- `data/v1/activities.json`
- `sub.html` (interactive builder)

## Pitfalls

- Ending on a high-energy game, the sub inherits the chaos. Always land calm.
- Assuming the sub knows your routines. The note template exists because nothing is obvious to a stranger.
- Over-stuffing: a plan with zero slack breaks on the first transition. Leave the filler block in.
