---
name: stem-demo-picker
description: Pick the right STEM demo or engineering challenge for the age group and time available.
---

# Pick the right STEM demo

## Use when

A teacher wants science with a wow factor: "I need a 30-minute STEM activity for 4th graders, minimal mess."

## Inputs

- Age group
- Minutes available
- Mess tolerance (low / medium / glorious)
- Concept to hit, if any (density, engineering, reaction, observation)

## Procedure

1. Filter `data/v1/activities.json` for `categories` containing `stem`, then by age overlap and `time_min`.
2. Match mess tolerance to the activity: `density-rainbow-jars` and `marshmallow-constellations` are low-mess; `baking-soda-volcano` and `paper-mache-bowls` are glorious, warn accordingly.
3. Prefer activities with an **iterate** loop (paper airplanes, egg drop, card towers): the redo is where the learning lives.
4. Give the teacher the one-sentence explanation from the activity's steps so they can answer "why did that happen?" on the spot.

## Worked example

4th grade, 30 min, low mess → `paper-airplane-challenge` (fold, throw, measure, redesign. The iterate loop does the teaching).

## API references

- `data/v1/activities.json`

## Pitfalls

- Running `egg-drop-challenge` in 20 minutes. The build needs the full 30–60 or teams can't finish.
- Skipping the debrief question ("why did the wide base win?"). The demo without the debrief is just entertainment.
