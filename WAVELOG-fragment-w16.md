# Activity Vault — WAVELOG fragment — Wave 16 (STAGED, needs merge)

⚠️ Merge-worker note: this entry is NOT yet in WAVELOG.md. When the wave-16
pack lands in `data/activities.json`, copy the entry below into WAVELOG.md
(newest-first, above wave 15), then delete this fragment file.

## Wave 16 — 2026-10-11 — Winter Holiday Build Lab pack (+26 → 352, STAGED)

**What shipped (staged, parallel-safe):**
- **Winter Holiday Build Lab pack** — 26 new original activities, staged as
  `MERGE-fragment-w16-pack.json` (valid JSON array of full records; wave 14 was
  editing `data/activities.json` at build time, so nothing here touches the live
  data file, hub pages, planner, party planner, collections, or the API). All
  original words per PIPELINE.md; safety notes practical only (allergy checks on
  both food activities, sealed store-bought ingredients, plastic jars for kids,
  fan low + fingers clear, string below shoulders, no tasting the instant-snow
  powder) — no medical claims anywhere. Typographic/readability craft applied to
  the metadata: taglines under 160 chars, one action per step, short plain
  sentences — how the generated activity pages render them.
- 14 winter-holiday STEM/engineering builds (fills the gap the angle-2 research
  flagged — "Winter STEM is a mature, dense category" — that wave 6's winter
  crafts pack didn't cover): `holiday-zipline-delivery` (elf zipline, line-angle
  trials), `sled-and-slope-run` (sled carries 3 gifts down a ramp),
  `snow-globe-slow-fall` (slowest-fall ingredient test), `reindeer-shelter-storm`
  (fan blizzard shelter), `stocking-holder-build` (weight-bearing hook/clamp),
  `gift-conveyor-design` (no-hands delivery line), `cookie-dissolve-race`
  (which cookie melts first in milk), `instant-snow-polymers` (faux-snow
  science), `dancing-cranberries` (fizz science), `paper-maze-swap` (design +
  solve swap), `gift-wrap-measure` (surface-area estimation),
  `reindeer-grid-coding` (unplugged arrow-card coding), `ornament-pendulum-paint`
  (jingle-bell pendulum art), `blizzard-in-a-bottle` (storm sensory bottle).
- 12 winter-holiday extras: respectful Hanukkah/Kwanzaa games
  (`dreidel-spin-math` — real letter rules nun/gimel/hey/shin;
  `kwanzaa-principle-cards` — the seven Nguzo Saba matched to kid actions,
  learning-game framing per wave-6 precedent, no invented rituals),
  `story-gift-pass` (left-right gift exchange), `winter-bird-watch-tally`
  (pairs with the suet feeder), `northern-lights-pastels`,
  `snow-paint-spray` (outdoor), `snowman-soup-gift-mix` (cocoa gift jars),
  `solstice-lantern-stroll` (plan the longest-night walk),
  `holiday-cleanup-crew-game` (gamified post-party tidy),
  `snowflake-statue-balance`, `red-nose-green-nose` (holiday
  red-light-green-light), `winter-hide-and-seek` (jingle-hat seeker).
- Near-duplicate skips (library already covers the mechanic): gumdrop tower
  (`marshmallow-towers`/`spaghetti-tower`), present launcher catapult
  (`easter-egg-catapult`), parachute gift drop (`egg-drop-challenge`),
  candy-cane structures (`cranberry-toothpick-towers`), snowball launcher
  (catapult family), static snowflakes (`static-butterflies`), ice-melt tests
  (`temperature-melt-race`), frosty shadow puppets (`shadow-puppet-matinee`),
  ice excavation (`ice-excavation-dig`), holiday movement circuit
  (`animal-moves`), mitten match (`paper-mitten-match`), paper-chain countdown
  (`hanukkah-counting-chain`), ornament crafts (`homemade-christmas-ornaments`),
  gratitude snowball (`snowball-toss-math`), holiday charades/bingo/i-spy
  (`charades`, `halloween-bingo`, `mystery-feel-boxes`), estimation jar
  (`candy-corn-estimation-jar`), cocoa taste test (`apple-tasting-party`),
  kindness chain (`winter-kindness-chain`), light-up cards (`paper-circuits`).
- **No new tag needed** — reused the wave-6 vocabulary only. Tag split:
  13 christmas+winter / 10 winter-only / 1 christmas-only
  (`gift-wrap-measure`) / 1 hanukkah+winter (`dreidel-spin-math`) /
  1 kwanzaa+winter (`kwanzaa-principle-cards`). No retro-tags this wave.
- 6 of the 26 are no-prep, zero-material-adjacent emergencies
  (`story-gift-pass`, `winter-bird-watch-tally`, `holiday-cleanup-crew-game`,
  `snowflake-statue-balance`, `red-nose-green-nose`, `winter-hide-and-seek`)
  — Sub Tub candidates for the merge worker to wire in.
- **Test additions staged** in `MERGE-fragment-w16-tests.md` (ready-to-save
  `scripts/test-winterstem.js`, `node --check` clean): 26 ids present/unique,
  tag splits 13/10/1/1/1, 3+ steps + easier/harder + sane age/time floors on
  all, no medical-claim strings, allergy-note coverage on the 2 food activities,
  ≥4 no-prep emergencies, post-merge count 352.
- Research integrated: `activity-ideas-20261011-2010` angle 1+2 (winter STEM
  challenge archetypes — zipline, sled, snow globe, shelter, conveyor, snowman
  stretch variants; quick-challenge 15–45 min format; student-designed rules as
  capstone step). The `web-craft-20261011-2014` design-craft domain was checked
  — its report directory was still empty at build time (no scout reports landed),
  so no design findings could be applied; recorded as an open follow-up for a
  future UI wave (see Design note below).

**Validation (wave 16, pre-merge):**
- `MERGE-fragment-w16-pack.json`: parses; 26 records; 0 field errors vs the
  `scripts/build.py` shape (required fields, category vocabulary from live
  `data/categories.json`, indoor/outdoor locations, age 3–18, time/group
  ranges, boolean no_prep, material item objects, non-empty tags in
  `TAG_IDS`, steps + easier/harder on all 26, safety on all 26)
- Id uniqueness: 0 duplicates inside the fragment; 0 collisions against a
  fresh read of `data/activities.json` (326 live) — includes the known-taken
  `shadow-tag` check pattern
- Medical-claim scan: 0 hits across 26 records; food-activity allergy notes
  present on both food activities
- `node --check` on the staged test file: clean

**Wave 16 push resolution:** local commit `fd71a46` (3 files, staged only).
Pushed via `gh-push.py` — remote commit `792f1c78f0b0047d35d433bb3d53d4857c99f2fd`
(verified via GitHub API: commit exists, `main` HEAD points at it, base→HEAD
diff is exactly the 3 fragment files plus `scripts/build.py` carrying the
wave-14 lane's uncommitted why/inclusion/related-page features — see incident
note). ⚠️ INCIDENT: `gh-push.py` pushes the working tree's tracked state, not
just the commit — the first push accidentally carried wave-15's uncommitted
edits (`assets/app.js`, `planner-core.js`, `planner.js`, then `style.css`,
`planner.html`, `scripts/test-planner-core.js`) to remote main. Repaired with
two revert pushes (no force-push); final remote verified clean. Full timeline
in the wave-16 worker's parent report — the shared-tree push hazard needs a
coordinator decision (serialize pushes or per-lane worktrees).

**For the merge worker:**
1. Append the 26 records from `MERGE-fragment-w16-pack.json` to
   `data/activities.json` (verify total 352, 0 dupes via `scripts/build.py`).
2. Save `scripts/test-winterstem.js` from `MERGE-fragment-w16-tests.md` and
   run it; refresh count snapshots in the spring/summer/halloween/
   thanksgiving tests if they hardcode totals (they pattern-match 288/308/
   326-style snapshots).
3. Optionally wire the 6 no-prep emergencies into the Sub Tub "nothing at
   all" tier and consider a `winter-holiday-build-lab` collection.
4. Delete `MERGE-fragment-w16-pack.json` and `MERGE-fragment-w16-tests.md`
   after the pack lands (they are staging files, not permanent data).

**Design note (for a future UI wave):** the web-craft research domain is now
permanent and its reports are mandatory input per the 2026-10-11 coordinator
order — but `~/workspace/research_notes/web-craft-20261011-2014/` contained no
reports when this pack was built, so nothing could be applied. When its
reports land, a UI wave should re-read this pack's records against them;
the metadata was written one-action-per-step and scannable for exactly that
kind of pass.
