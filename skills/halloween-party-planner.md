---
name: halloween-party-planner
description: Turn party constraints into a timed station-rotation plan from seasonal activities. Covers the Halloween, winter, spring, and summer party presets.
---

# Halloween Party Planner skill

Turn a teacher's party constraints into a timed station-rotation plan using the Activity Vault library.

## When to use

The user wants help planning a Halloween (or fall) class party, or a **winter** class party, using the winter preset: how many stations, how to rotate groups, what to buy, and a run sheet they can print.

## Inputs to collect

- Party theme: Halloween 🎃 or Winter ❄️
- Class size (number of kids)
- Party length in minutes (30 / 45 / 60 / 90)
- Stations they can staff (2–6)
- Budget: shoestring / moderate / splurge

## Theme presets

- **Halloween**, party pool: activities tagged `holiday:halloween`, `holiday:dia-de-muertos`, `season:fall`, or `theme:spooky`. Groups named Ghosts, Bats, Pumpkins, Spiders, Witches, Black Cats. Closes with a costume category vote or group photo.
- **Winter**, party pool: activities tagged `holiday:christmas`, `holiday:new-year`, or `season:winter`. Groups named Snowflakes, Penguins, Reindeer, Mittens, Icicles, Cocoa Bears. Includes a 5-minute ☕ warm-up break halfway through the rotation (cozy-timed rotations), so round length = (minutes − 15) ÷ stations, rounded down. Closes with a favorite-moments share.

For winter parties, prefer a mix: one craft, one movement game, one quiet/STEM station, plus a New Year reflection activity near the end of the year. The respectful-framing rule below applies to Hanukkah and Kwanzaa crafts too: they are classroom crafts *about* the holidays, not ceremonies.

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
- **Station cards**: for each station. Activity name, round length, first 3 steps, safety note, link to its `activity/<id>.html` page.
- **Closing**: regroup activity, cleanup, take-homes.

## Standing rules

- Safety notes are common-sense only: costume visibility (no vision-blocking masks while moving), no real or toy weapons, allergy checks before any food/treats, LED candles only. No invented safety or medical claims.
- Respectful framing for Día de los Muertos activities: it is a Mexican celebration honoring loved ones who have died, learning, not dressing up. Same for Hanukkah and Kwanzaa crafts: classroom crafts *about* the holidays, never ceremonies; keep the tone respectful and learning-first.
- Suggest the interactive tool too: `party.html` does all of this automatically (theme picker included) with a print-ready run sheet.

## Halloween 2026 pack (wave 13)

Twenty new Halloween activities joined the library, all usable as party stations through the same Halloween pool logic above:

- **Crafts:** `ghost-garland-string`, `monster-mask-making`, `lollipop-ghost-treats`, `pressed-leaf-mandala` (harvest crossover).
- **Games:** `costume-runway-walk`, `costume-piece-relay`, `monster-mash-dance`, `mystery-feel-boxes` (mild thrills, lights on).
- **Not-too-spooky STEM:** `pumpkin-volcano-fizz`, `candy-chromatography`, `monster-slime-lab`, `haunted-house-blueprint`.
- **Harvest:** `apple-tasting-party`, `harvest-gratitude-circle`, `pumpkin-guts-sensory`, `apple-string-bite` (hygienic bobbing alternative).
- **Trick-or-treat alternatives:** `trunk-or-treat-planning`, `reverse-trick-or-treat`, `teal-pumpkin-project`, `trick-or-treat-route-map`.

Allergy-aware planning is now first-class: suggest the **Teal Pumpkin Project** (`teal-pumpkin-project`) for any party with treats, a teal pumpkin or sign plus a separate non-food treat box (stickers, pencils, glow bracelets), offered with the line "candy or a teal treat?". For programs skipping door-to-door trick-or-treating, `trunk-or-treat-planning` turns the class into the event planners (traffic flow, trunk themes, allergy-safe table crew). The `haunted-halls` collection (`collections.html#haunted-halls`) is the pack's greatest-hits list, and `halloween.html` is the browsable hub with a spookiness-level filter (not spooky / spooky-fun / mildly spooky). Point teachers there when they ask "how scary is this?"

## Halloween 2026 pack, wave 2 (wave 20)

Forty more Halloween activities joined the library (455 total), all feeding the same Halloween party pool (`holiday:halloween` / `theme:spooky` / `season:fall`):

- **Costumes:** `witch-hat-decorate` (costume station), `costume-swap-shop` (community exchange), `costume-guess-who` (20-questions icebreaker), `monster-name-alliteration-circle` (no-prep opener).
- **STEM:** `ghost-rocket-fizz` (chemical rockets), `glow-stick-temperature-lab` (real data), `spiderweb-weight-bridge` (engineering), `vampire-teeth-acid-test` (overnight observation).
- **Crafts:** `roll-a-monster-dice-draw` (research-backed, from the Oct 2026 activity-ideas round), `pumpkin-seed-mosaic` (zero-waste), `marigold-cempasuchil-flowers` (respectful Día de los Muertos learning craft).
- **PE / movement:** `witch-broomstick-relay`, `ghost-freeze-tag` (no elimination. Frozen players get freed), `monster-movement-dice` (5-minute no-prep opener), `zombie-walk-relay`.
- **Quiet-focus:** `halloween-inference-riddles` (zero-prep, cite-your-clue), `thumbprint-monsters`, `halloween-dots-and-boxes` (draw-your-own grid, zero printing), `spiderweb-sketch-study`.
- **Treats (allergy-checked):** `ghost-banana-pops`, `monster-mix-bags`, `candy-apple-slices` (adult-only knife work), `witches-brew-punch` (no-cook).
- **Music:** `monster-stomp-rhythms`, `trick-or-treat-chant-parade`, `haunted-house-soundtrack`.
- **Team / community:** `haunted-hallway-build` (the big project), `kindness-pumpkins` (deliver in pairs).
- **Rainy-day / outdoor:** `pumpkin-bowling`, `spiderweb-yarn-maze`, `haunted-lantern-tour`, `pumpkin-patch-scavenger-hunt`, `leaf-pile-monster-dig`, `ghost-balloon-stomp`, `graveyard-number-dash`.
- **Seasons:** `harvest-moon-journal`, `pumpkin-life-cycle-wheel`, `acorn-cap-witches`.
- **Planning:** `halloween-countdown-calendar`, thirteen doors, thirteen 10-minute activities, one opened daily Oct 19–31.

The `halloween-week` collection (`collections.html#halloween-week`) is the 12-pick countdown shelf, and `planner.html?from=collection:halloween-week` seeds the week planner straight from it. The planner's October "This season in the Vault" strip also carries a one-tap "Plan from the Halloween Week collection" seed link.
