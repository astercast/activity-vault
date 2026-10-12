# Halloween Party Planner skill

Turn a teacher's party constraints into a timed station-rotation plan using the Activity Vault library.

## When to use

The user wants help planning a Halloween (or fall) class party: how many stations, how to rotate groups, what to buy, and a run sheet they can print.

## Inputs to collect

- Class size (number of kids)
- Party length in minutes (30 / 45 / 60 / 90)
- Stations they can staff (2–6)
- Budget: shoestring / moderate / splurge

## How to build the plan

1. Load `data/activities.json`. The party pool is activities tagged `holiday:halloween`, `holiday:dia-de-muertos`, `season:fall`, or `theme:spooky`, in a party-friendly category (crafts, pe-movement, rainy-day, quiet-focus, team-community, icebreakers).
2. Round length = (minutes − 10) ÷ stations, rounded down. The 10 spare minutes are the welcome (5) and regroup/cleanup (5). If a round would be under 10 minutes, say so and ask for more time or fewer stations.
3. Each station's activity must fit the round: `time_min ≤ round length + 5` (stations run a party-paced cut of the activity), and the per-group size (`ceil(classSize / stations)`) must fall inside the activity's group range.
4. Shoestring budget: prefer `no_prep` activities and ones whose materials are cheap basics (paper, crayons, markers, glue, scissors, tape, bags, plates, cups, string, balloons).
5. Pick one activity per station, varying the categories (a craft, a movement game, a quiet station…) so the party has rhythm.
6. Split the class into named groups (Ghosts, Bats, Pumpkins, Spiders, Witches, Black Cats). Rotation: in round R, group G goes to station `(G + R) mod stations`.
7. Merge all station materials into one setup checklist, deduplicated.

## Output format

- **Rotation timetable**: rounds with clock times and which group goes where each round.
- **Setup checklist**: everything to gather, grouped by station.
- **Station cards**: for each station — activity name, round length, first 3 steps, safety note, link to its `activity/<id>.html` page.
- **Closing**: regroup activity, cleanup, take-homes.

## Standing rules

- Safety notes are common-sense only: costume visibility (no vision-blocking masks while moving), no real or toy weapons, allergy checks before any food/treats, LED candles only. No invented safety or medical claims.
- Respectful framing for Día de los Muertos activities: it is a Mexican celebration honoring loved ones who have died — learning, not dressing up.
- Suggest the interactive tool too: `party.html` does all of this automatically with a print-ready run sheet.
