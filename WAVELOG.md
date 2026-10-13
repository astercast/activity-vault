# Activity Vault — WAVELOG

Running record of build waves. Newest first.

## Wave 27 — 2026-10-12 — "First Years, Second Shelf + The Scout Wakes Up" 🧦🔦

**Frontier chosen, and why:** wave 26 left two named candidates. (a) The early-years build — its own honest assessment said the age-3 cliff was "halved, not closed" (22 covering age 3 vs 124 at age 4; only 15 early-years-only records). (b) The thin subjects, drama (11) and coding (6) by keyword — which wave 26 explicitly recorded as "neither is a shelf the Vault promises — recorded, not padded." **This wave chose (a) and kept wave 26's call on (b):** a teacher handed the three-year-old room tomorrow is a real user with a real shelf to fill; nobody arrives at this archive asking for a drama shelf. The build stayed inside the wave-26 design rules — age_min 3, age_max ≤ 6, runs ≤ 25 min, big pieces, one rule per game, the adult as a player — and aimed at the holes *inside* age-3 coverage, not just the headline: before this wave, age 3 had **zero primary-category records** in STEM, team-community, and rainy-day.

**What shipped (three parts):**

**Part 1 — Twelve more activities designed for 3-year-olds first (+12 → 576):** `cardboard-ramp-roll-lab` and `hand-lens-look-closer` (the first STEM primaries at age 3 — a low ramp with a "let go, don't push" fair-test rule, and a hand lens whose sun warning is stated in one plain sentence), `pass-it-down-delivery-line` and `ring-around-the-rosie-circle` (the first team-community primaries at age 3 — hand-to-hand deliveries where a seated line counts in full, and the traditional singing circle game, walked never run, with NO plague-origin claim anywhere in the record: that story is disputed history and the record says only what is verifiable, that the words vary from place to place), `pillow-islands` (the first rainy-day primary at age 3 — deliberately NOT the lava game: wave-24's `lava-floor` (4–12) is a timed elimination scramble, this record removes every one of those mechanics and never borrows the framing, Jaccard 0.33 documented in `scripts/add_wave27.py`), plus `show-me-your-move` (icebreakers), `knee-drum-copycat` (music-rhythm — patterns grown one tap at a time, max three), `texture-touch-basket-walk` (outdoor — rough/smooth/soft hunted by hand, so a kid who sees differently is the natural leader), `big-dot-sticker-pictures` (crafts — the pincer practice that comes before scissors), `pool-noodle-rope-threading` (quiet-focus — big soft rings chosen precisely because nothing is small enough to be a choking worry), `jump-the-river-ropes` (pe-movement — the river widens one hand-width at a time, stepping in is practising, never failing), `blanket-fort-book-nook` (quiet-focus/rainy-day — adult-built, opening stays wide, never a hiding place). Deltas: age-3 coverage 22 → **34**, early-years-only 15 → **27**, age 4 124 → 136, ages 13/14 unchanged at 76. Enrichment: copy_free 184 → 196 (the whole pack needs zero printing), no_elimination 51 → 57, inclusion 69 → 74. Near-dupe screen in `scripts/add_wave27.py` — worst token Jaccard 0.33 (`pillow-islands` vs `lava-floor`, kept with the rationale written out in the script header).

**Part 2 — Scout cycle: NOT empty this time (1 new candidate, reviewed and accepted on merits):** `pipeline/scan.py` ran live against all 6 feeds and queued exactly one genuinely new item — the first non-empty cycle since wave 24's harvest: Teach Beside Me's "Morse Code Games for Kids" (published 2026-10-13 UTC on the feed). It got a real human decision, not a rubber stamp: the catalog's two code records are a paper substitution-cipher wheel and beaded binary — Morse is a code sent as *signals* (light, sound, timing) and decoded by eye and ear in real time, a distinct mechanic with no record teaching it. **Accepted** and adapted into original words as `morse-code-signal-post` (7–12 — decoding needs reading fluency, banded honestly below the source's general "for kids"; SOS first, initials by flashlight, a sound post by knuckle-tap vs palm-thump, a station relay where the garble is the lesson; flashlights never at eyes; source credited on the record). Queue now: **60 entries, 22 accepted / 38 rejected / 0 pending**, every decision carrying its reason. This accept is pipeline duty, not a frontier change — it also happens to be a coding-flavoured record for older kids, and it landed because it earned its place on review, not to pad the keyword count wave 26 declined to pad. (Its deltas: total 576 → 577, stem primary 107 → 108, copy_free 196 → 197, inclusion 74 → 75.) (Harness note: this wave's first `tests/api.test.sh` runs hit a sibling worker's trend-wire server squatting the usual local ports and failed against the wrong service; rerun against this repo's own `tests/serve-local.js` on a free port, the suite is 33/33 — see Validation.)

**Part 3 — New collection (17th): "Little Hands, Next Steps"** 🧦 — the second shelf for the same room: the 12 new age-3 activities, each with a curator note in plain teacher voice ("Let go, don't push — a fair test, run at knee height"). `scripts/build.py`'s collection-count assertion moved 16 → 17 with it, as did `scripts/check_api.py` and the llms.txt bundle line (which also quietly fixed its stale "15" → the true count).

**Validation (wave 27):**
- `scripts/build.py`: BUILD OK — **577 activities, 577 pages, 11 categories, 17 collections**, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — 0 broken links across 592 pages, llms.txt 37 links resolve
- New `scripts/test-wave27.js`: **498 assertions pass** (12 + 1 ids, age-3 deltas 22→34 / early-years 15→27, age-3 primary firsts for STEM/team-community/rainy-day, quality bar, framing checks on the records — no plague claim, no lava framing, lens sun warning, fort opening rule, seated-line inclusion — category + enrichment deltas, Next Steps collection anchors, Scout queue health incl. the Morse accept resolving with its source credit)
- All 17 JS suites pass: desk 463, fieldtrip 183, halloween 882, kit 609, micro 1713, planner-core, spring 699, summer 820, thanksgiving 981, wave20 1080, wave23 14073, wave24 318, wave25 415, wave26 514, wave27 498, winter 1253, winterstem 504 (count snapshots refreshed 564 → 577 / collections 16 → 17 / enrichment 184→197, 51→57, 69→75 across the suites with dated wave-27 notes; wave-24's reviewed-batch assertion now excludes the same-day wave-27 Morse review so it still measures the wave-24 batch)
- **Correction, recorded the same day:** the first committed version of this wave's validation carried suite counts from a pre-accept run and an inclusion snapshot of 74 — the Morse record's own inclusion note makes the true wave total **75**, and four suites (thanksgiving, wave25, wave26, wave27) failed on exactly that until the snapshots were corrected and the full suite set re-run end to end. The counts above are from that corrected full re-run (follow-up commit), not from the run the first version of this entry described. The build, the catalog data, and the API suite were unaffected — the error was in test snapshots and in this log, and both are fixed where anyone can see it.
- `tests/api.test.sh`: **33/33 pass** (own harness on :3211, incl. the live cron Scout run against all 6 real feeds; fixture cleanup verified — queue byte-identical after, sha256 be7fbc15… both sides)
- Headless Chromium (`/tmp/av-w27/verify.js`, interception harness, no virtual-time-budget): **15/15 checks pass, zero page errors / failed local resources** — landing hero (focused, one primary CTA, live 577 count), the Next Steps collection renders all 12 picks with its when-to-use line, `pillow-islands` renders steps + Ages 3–5 fact grid with no lava framing anywhere on the page, `morse-code-signal-post` renders the SOS steps + flashlight rule on the page itself, mobile 390px with no horizontal scroll. Screenshots inspected: `/tmp/av-w27/shots/` (landing, collection, activity-age3, morse, collection-mobile).

**Honest assessment:** the cliff is narrower again — 34 against 136 at age 4 — and the shape of age-3 coverage changed more than the count: every primary category a three-year-old's day actually uses now has at least one record written for that room, and STEM/team/rainy-day have their first. It is still the thinnest age on the books and it would be dishonest to call it closed; at this rate of honest building it closes in about two more waves, and padding it shut with aged-down older-kid records would be exactly the filler this archive exists not to be. The Scout headline is the queue itself: three quiet cycles, then one real candidate that survived a real review — the pipeline works because the empty cycles were reported as empty.

## Wave 26 — 2026-10-12 — "First Years: The Age-3 Cliff + The Last Thin Holidays" 🧸

**What shipped (three parts):**

**Part 1 — Scout pipeline health check + a fresh live cycle (0 new candidates, honestly):** `pipeline/scan.py` ran live against all 6 feeds (65 items: WeAreTeachers 16, Hands On As We Grow 7, Teach Beside Me 10, Little Bins 10, Kids Activities Blog 10, Buggy and Buddy 12) and queued **nothing** — every relevant item was already in `pipeline/seen.json` from the wave-24/25 scans, the rest failed the KEEP/DROP filter. `pipeline/review-queue.json` and `pipeline/seen.json` are **byte-identical** before/after (sha256 verified). The pipeline itself was audited, not just run: 59 decided entries (21 accepted / 38 rejected), **every** decided entry carries a recorded reason, all 21 accepted `activity_id`s resolve to real catalog records, 0 pending — nothing is waiting on a human, and nothing was rubber-stamped or manufactured to make the cycle look busy. The JS cron path got the same workout via `tests/api.test.sh` (live cron run against the real feeds, 33/33). The queue is healthy and ready for the next cycle; the next real harvest waits on the feeds publishing something new.

**Part 2 — Completeness audit beyond holidays, and the biggest gap fixed (+14 → 564 activities):** the audit nobody had run past the holiday shelf. **Age is the cliff:** coverage per single age ran 3:**12**, 4:112, 5:279, 6:405 … 13/14:76 — and only **5** activities in the whole archive were early-years-only (age_max ≤ 6); most of the 12 that "cover" age 3 are broad-band records a three-year-old is merely tolerated by. Wave 25 flagged it; this wave fixes it with **10 activities designed for 3-year-olds first** (age_min 3, age_max ≤ 6, runs ≤ 25 min, big pieces, one rule per game, the adult as a player): `tape-path-balance-walk`, `pom-pom-drop-tubes`, `sponge-squeeze-station`, `sound-match-shakers`, `bubble-wrap-stomp-path`, `cardboard-tunnel-crawl`, `hello-ball-greetings`, `pouring-practice-trays`, `nature-color-match-walk`, `torn-paper-collage`. Category firsts at age 3: icebreakers, team-community, and rainy-day had **zero** age-3 coverage before this wave. Deltas: age-3 coverage 12 → **22**, early-years-only 5 → **15**, music-rhythm primary 26 → 27, rainy-day any-category 50 → 53. **The last thin holidays, filled:** Lunar New Year 3 → **5** (`red-envelope-wishes` — the real hongbao custom named, the school money→wishes swap named as an adaptation in the record itself; `zodiac-great-race-sequence` — the folk tale told straight from a published retelling, named as a legend, never costumed) and Valentine's Day 4 → **6** (`kindness-post-office` — a working post office whose delivery-ledger step guarantees every kid a real card; `fold-and-open-hearts` — line symmetry with blunt scissors). **Every holiday tag in the vocabulary now carries at least 5 activities.** Subject audit (keyword pass over name+tagline+steps+setup): literacy 92, writing 100, math 158, nature 85 — healthy; drama (11) and coding (6) are thin by keyword but neither is a shelf the Vault promises — recorded, not padded. Small-group (group_max ≤ 6: zero) is a non-gap in practice: 257 activities run with pairs (group_min 2). Near-dupe screen in `scripts/add_wave26.py` — worst token Jaccard 0.20 vs the full 550.

**Part 3 — New collection (16th): "Little Hands, First Years"** 🧸 — twelve picks, one shelf for the youngest kids in the building: the 10 new age-3 activities + `color-sorting-trays` + `big-brush-painting`, each with a curator note in plain teacher voice ("Tearing is the skill scissors come after"). `scripts/build.py`'s collection-count assertion moved 15 → 16 with it.

**Validation (wave 26):**
- `scripts/build.py`: BUILD OK — **564 activities, 564 pages, 11 categories, 16 collections**, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — 0 broken links, llms.txt 37 links resolve (its hardcoded collection count refreshed 15 → 16 alongside build.py's)
- New `scripts/test-wave26.js`: **512 assertions pass** (14 ids, age-3 deltas 12→22 / early-years 5→15, age-3 category firsts, holiday floor ≥5 on every tag, quality bar, framing checks on the records — hongbao named + adaptation named, folk tale named as legend, ledger guarantee, count-out/count-back pom-poms, sealed-shaker choking note — enrichment deltas, collection anchors, full Scout queue health)
- All 16 JS suites pass: desk 463, fieldtrip 183, halloween 882, kit 609, micro 1713, planner-core, spring 699, summer 820, thanksgiving 981, wave20 1080, wave23 13761, wave24 318, wave25 414, winter 1253, winterstem 504, wave26 512 (count snapshots refreshed 550 → 564 / collections 15 → 16; wave-24/25 holiday + enrichment snapshots updated with dated wave-26 notes)
- `tests/api.test.sh`: **33/33 pass** (local harness on :3100, incl. the live cron Scout run against all 6 real feeds; fixture cleanup verified — queue byte-identical after)
- Headless Chromium (`/tmp/av-w26/verify.js`, interception harness, no virtual-time-budget): **13/13 checks pass, zero page errors / failed local resources** — landing hero (focused, one primary CTA, live 564 count), the Little Hands collection renders all 12 picks with its when-to-use line, `hello-ball-greetings` renders steps + Ages 3–5 fact grid, `red-envelope-wishes` renders the hongbao framing + inclusion note on the page itself, mobile 390px with no horizontal scroll. Screenshots inspected: `/tmp/av-w26/shots/` (landing, collection, activity-age3, collection-mobile).

**Honest assessment:** the age-3 cliff is halved, not closed — 22 against 124 at age 4 is still a cliff, and it stays the thinnest age on the books; the honest difference is that a teacher handed the three-year-olds now gets 15 records written for that room instead of 5 written for somebody else's. The Scout's third straight empty cycle is reported as an empty cycle: the feeds have not published anything new since the wave-24 harvest, and the dedupe memory is the reason we can say that with receipts.

## Wave 25 — 2026-10-12 — "Thin Holidays Deepened + A Quiet Scout Cycle" 🕯️

**What shipped (two parts):**

**Part 1 — The four thin holidays, deepened (+14 → 550 activities):** wave 24 filled the zero-coverage holidays but left MLK Day and Indigenous Peoples' Day at 1 activity each and Diwali and St. Patrick's Day at 2. All four now sit at **5 each**, at the same editorial bar as the rest of the catalog (original words, 5 steps each, easier+harder, practical safety only, near-dupe screen in `scripts/add_wave25.py` — worst token Jaccard 0.23 vs the full 536). **MLK Day (+4):** `mlk-freedom-quilt-squares` (one fairness word + drawing per square, King's vocabulary as the content), `civil-rights-timeline-walk` (six real events, 1955–1968, stations around the room; inclusion note insists King did not act alone — Rosa Parks, the Birmingham children, the Selma marchers are on the cards), `mlk-day-service-sprint` (the holiday as the national day of service it has been since 1994, King's own line as the brief, one real building job finished in the session), `dream-speech-choral-reading` (echo-reading of short real excerpts, his recorded voice first when available; nobody performs an accent or an impression). **Indigenous Peoples' Day (+4):** `three-sisters-garden-plan` (companion-planting engineering, Haudenosaunee named), `indigenous-authors-read-aloud` (the authorship rule: Indigenous authors, nations named — Maillard, Lindstrom, Goade), `tribal-nations-map-study` (tribal-nations maps from tribal sources, nations' own names for themselves, present-day governments not a history exhibit), `seasonal-rounds-phenology-wheel` (the seasonal-rounds method applied to the kids' own place; the inclusion note states plainly that it borrows no nation's ceremonies, moon names, or stories). **Diwali (+3):** `clay-diya-pinch-pots` (real pinched clay, painted, LED tealight only — the safety note says why: air-dry clay is not fireproof), `mehndi-paper-patterns` (paisleys and dot-work practiced on traced paper hands; markers never touch skin), `ramayana-story-sequence` (a published retelling told straight and sequenced on cards; sacred Hindu epic named as such, never costumed). **St. Patrick's Day (+3):** `limerick-writing-circle` (AABBA form taught by clapping, named for Limerick, Ireland; jokes land on invented characters, never classmates), `walking-rainbow-lab` (capillary action walks colored water over paper-towel bridges — the holiday's rainbow as honest STEM), `irish-reel-steps` (real reel steps, quiet upper body, your own clothes and voice — the inclusion note bans costumes and put-on accents outright). Enrichment deltas: copy_free 165 → 173, no_elimination 43 → 47, inclusion 51 → 64; ages 13/14 coverage 70 → 76.

**Part 2 — Scout cycle, run fresh, honest result (0 new candidates):** `pipeline/scan.py` ran live against all 6 feeds (65 items fetched: WeAreTeachers 16, Hands On As We Grow 7, Teach Beside Me 10, Little Bins 10, Kids Activities Blog 10, Buggy and Buddy 12) and queued **nothing** — every relevant post was already in `pipeline/seen.json` from the wave-24 scan, and the rest failed the KEEP/DROP filter. The queue is therefore unchanged and still fully decided: **0 pending / 59 decided (21 accepted, 38 rejected)**, every entry carrying its recorded reason (asserted in `scripts/test-wave25.js`). No candidates were manufactured to make the cycle look busy; a Scout that finds nothing new the day after a 36-item harvest is a Scout working correctly. `pipeline/review-queue.json` is byte-identical after the cycle (the api.test.sh fixture pass also restored it byte-identical, as designed).

**Completeness audit (beyond the four holidays):** the next thin spots, recorded for future waves — `holiday:lunar-new-year` is now the thinnest holiday at **3**, `holiday:valentines-day` next at **4**; age **3** remains the thinnest age by far (12 activities vs 112 at age 4 — the cliff is designed-band activities for 3-year-olds specifically); `rainy-day` is the thinnest primary category (21), `music-rhythm` the thinnest by any-category count (30; this wave added 2 primary, +1 secondary); `holiday:july-4th` (5), `holiday:dia-de-muertos` and `holiday:earth-day` (6 each) are respectable but not deep.

**Validation (wave 25):**
- `scripts/build.py`: BUILD OK — **550 activities, 550 pages, 11 categories, 15 collections**, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — 0 broken links, llms.txt 37 links resolve
- New `scripts/test-wave25.js`: **414 assertions pass** (14 ids, per-holiday counts 1→5 / 1→5 / 2→5 / 2→5, quality bar, respectful-framing checks on the records — LED-only diyas, paper-only mehndi, no-costumes rules, named peoples — enrichment deltas, Scout queue fully decided)
- All 15 JS suites pass: desk 463, fieldtrip 183, halloween 874, kit 606, micro 1713, planner-core, spring 691, summer 812, thanksgiving 973 (enrichment snapshots refreshed 165→173 / 43→47 / 51→64), wave20 1080, wave23 13425 (age 13/14 snapshot 70→76), wave24 318 (tag snapshots refreshed to the deepened counts), winter 1245, winterstem 504
- `tests/api.test.sh`: **33/33 pass** (local harness on :3100, incl. the live cron run against all 6 real feeds)
- AI-ism scan on new content: clean. `node --check` / `py_compile` on new files: clean. Count snapshots refreshed 536 → 550 across the suites, README, and AGENT.md (enrichment counts in sync).

**Honest assessment:** the four holidays now read like the rest of the archive — a teacher planning any of them gets a real shelf, not a token entry. The cultural framing is the part to be proud of: every record names the real people, the real tradition, and the line it will not cross (no flames, no skin, no costumes, no borrowed ceremonies), in the record itself where a substitute teacher will actually see it. The Scout's empty cycle is reported as an empty cycle.

## Wave 24 — 2026-10-12 — "The Scout in Action + The Whole Calendar" 🛰️🗓️

**What shipped (three parts):**

**Part 1 — The Scout, run live, queue processed for real (36 reviewed: 8 accepted, 28 rejected, 0 pending):** the queue on file was fully decided (23 old entries), so the Scout actually scouted. Three verified feeds joined `pipeline/feeds.json` (Little Bins for Little Hands, Kids Activities Blog, Buggy and Buddy — the cron reads the same file, so production gets them too), `pipeline/scan.py` ran live, and 36 fresh candidates queued. Every one was reviewed against the full 521-activity catalog for age-fit, safety, materials sanity, and duplication, with the reason recorded on the queue entry (`scripts/add_wave24.py` holds the full decision table). **Accepted (8, adapted into original words, source credited):** `dream-for-our-community` (the MLK roundup's classic core — the Vault had zero MLK Day coverage), `floating-ink-ghost`, `binary-code-keychain`, `indigenous-innovators-spotlight` (zero Indigenous Peoples' Day coverage before), `feelings-pumpkin-faces`, `christmas-light-stencil-art`, `twig-snowflake-craft`, `cd-rainbow-light-lab`. **Rejected (28) with reasons, samples:** a word-list printable (no runnable activity), a sponsored curriculum post, a peanut-candy salad recipe (top allergen, shared food), an edible sensory bottle aimed at babies (Vault floor is age 3; near-dupe of the calm jars), seven near-identical Christmas ornament posts (one licensed character, one oven-and-shrink-film), template-only printables, an explainer whose science already lives in `fall-leaf-chromatography`, and straight duplicates (`paper-boat-race`, `density-rainbow-jars`, `spiderweb-plate-weave`, `reindeer-grid-coding`). Public queue now reads 0 pending / 59 decided; `review.html` rebuilt from the same data.

**Part 2 — Completeness audit, run hard (+7 gap fills, 5 retags, 6 new tags → 536 activities):** keyword + tag audit found whole holidays at zero — MLK Day, Indigenous Peoples' Day, St. Patrick's Day, Diwali, and Lunar New Year / Valentine's Day present only as untagged activities. Six tags joined the vocabulary everywhere PIPELINE.md requires (build.py validator, `assets/app.js`, `assets/planner.js` labels + month map, API.md, AGENT.md): `holiday:mlk-day`, `holiday:indigenous-peoples-day`, `holiday:valentines-day`, `holiday:lunar-new-year`, `holiday:st-patricks-day`, `holiday:diwali`. Gap fills: `valentine-to-a-favorite-book`, `lantern-riddle-walk` (the real Lantern Festival riddle custom), `leprechaun-trap-build`, `shamrock-shapes-hunt`, `rangoli-pattern-art`, `paper-diya-lanterns` (LED only, no flames), `scarf-dance-patterns` (music-rhythm, still the thinnest category, + ages 3–8). Diwali/Lunar New Year records carry the respectful-learning framing of the wave-20/22 precedents. Retagged: the three valentine activities and `dragon-parade` / `paper-lantern-festival`. Deltas: age-3 coverage 8 → 11, ages 13/14 → 70, valentines-day 4, lunar-new-year 3, st-patricks-day 2, diwali 2.

**Part 3 — New collection (15th): "The whole calendar"** 🗓️ — twelve picks, one per holiday in calendar order (New Year → MLK → Lunar New Year → Valentine's → St. Patrick's → Easter → July 4th → Indigenous Peoples' Day → Halloween → Diwali → Thanksgiving → Christmas), anchored by four wave-24 picks. Plus a drive-by: `tests/api.test.sh` cron assertion updated 3 → 6 feeds; `scripts/test-micro.js` seed-42 deal assertion refreshed with a dated note (pool grew, composition changed, role bounds still asserted per slot); count snapshots refreshed 521 → 536 / 14 → 15 across the suites.

**Validation (wave 24):**
- `scripts/build.py`: BUILD OK — **536 activities, 536 pages, 11 categories, 15 collections**, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — 0 broken links, llms.txt 37 links resolve
- New `scripts/test-wave24.js`: **318 assertions pass** (8+7 ids, quality bar, source credits resolve to real queue links, 36 queue decisions with reasons, tag deltas + vocabulary in all three codebases, respectful-framing and LED-only checks, collection anchors, feed count)
- All 14 JS suites pass: desk 463, fieldtrip 183, halloween 846, kit 594, micro 1713, planner-core, spring 663, summer 784, thanksgiving 945 (copy_free 162→165, no_elimination 41→43, inclusion 46→51 snapshots refreshed), wave20 1080, wave23 13089, winter 1217, winterstem 504
- `tests/api.test.sh`: **33/33 pass** (local harness on :3100, incl. the live cron run against all 6 real feeds)
- AI-ism scan on new content: clean. `node --check` / `py_compile` on every changed file: clean.

**Honest assessment:** the headline is the rejection rate — 28 of 36. A Scout queue cleared by accepting everything would be a pipeline that publishes blog roundups; this one now visibly does the human's job. The calendar shelf is the part a teacher will feel: before this wave, planning MLK Day, Diwali, or St. Patrick's Day in the Vault meant finding nothing and improvising.

## Wave 23 — 2026-10-12 — "Thin Spots + The Desk Wow Layer" 🗄️

**What shipped (two parts):**

**Part 1 — Thin-spot fills (+24 → 521 activities):** the audit's flagged gaps, closed. **12 teen-designed activities** (the real gap: ages 13–14 were covered by 53 broad-band activities each, zero designed FOR teens) — `lightning-debates`, `escape-room-build`, `mini-podcast-studio`, `public-art-proposal`, `survival-rank-challenge`, `board-game-prototype`, `peer-skill-swap`, `improv-scene-showdown`, `event-budget-challenge`, `photo-story-sequence`, `town-hall-simulation`, `water-filter-build` (all age_min ≥ 11; debates, design challenges, strategy, production, civics — genuinely teen, not kid stuff aged up). **12 holiday-tag fills**: july-4th 2→5 (`flag-folding-ceremony` — the real 13-fold tradition, respectful; `parade-route-planners`; `independence-debate`), earth-day 3→6 (`upcycle-invention-challenge`, `classroom-water-audit`, `litter-tally-cleanup`), easter 4→7 (`natural-dye-easter-eggs`, `wax-resist-easter-eggs`, `kindness-egg-missions`), dia-de-muertos 3→6 (`calavera-literaria-poems`, `sugar-skull-decorating`, `marigold-petal-path` — all three with inclusion notes naming the real traditions, no invented rituals, per the wave-20 marigold precedent). All at the archive quality bar: original words, taglines ≤ 160, 3–5 steps, easier+harder, practical safety only (allergy checks on egg/food activities, gloves for litter, "filtered water is NOT drinkable", flag never touches the ground), zero medical claims, AI-ism scan clean. Near-duplicate screen vs the full 497 (token Jaccard ≥ 0.55 gate in `scripts/add_wave23.py` + documented per-candidate rationale in the script header — e.g. `independence-debate` vs `take-a-stand-debate` kept: structured evidence debate for teens vs stand-up agree/disagree for 9–12). Audit deltas: ages 13/14 → 68 each, july-4th 5, earth-day 6, easter 7, dia-de-muertos 6. New `scripts/test-wave23.js` (12,729 assertions: 24 ids, thin-spot deltas, tag correctness, quality bar, teen banding, respectful-framing inclusion notes, allergy/safety notes, near-dupe re-screen).

**Part 2 — The Desk wow layer:** the archive landing IS a desk you can open now. `scripts/build.py` gained a shared `desk_drawers_html()` builder + `inject_landing_desk()`, which splices the generated desk section into `index.html` between `BUILD:DESK` markers every build (hand edits outside the markers survive; drawer markup inside is build-owned — real counts, real cards). The landing: hero → the desk (11 wooden drawers, brass pulls, pencil-count marginalia, PULLED stamps, 6 index cards per tray, kneehole blotter linking the planner) → the filter browser below. Hero CTA "Find an activity ↓" now targets `#desk`. Tray footers deep-link to `index.html?cats=<id>#browse` (chip preselect + scroll to the filter browser — both on `desk.html` and the landing). `assets/desk.js` loads on `index.html` too (page-agnostic; no changes needed). The planner week stays laid out on the leather blotter (`.week-section`, verified dealing 5 day cards). `desk.html` remains the dedicated desk page; both desks share one builder, so they can never drift.
- **Drive-by bug fix (caught by the new deep-link flow):** pressed filter chips were invisible — `.chip-row .chip` (same specificity, later source) overrode the base pressed rule's `background`, and the grunge mask ate what was left: white text on white. The pressed fill (`background`/`border-color`/`color`) is now re-declared on the winning `.chip-row .chip[aria-pressed="true"]` selector and the mask dropped there. Verified teal fill + white stamped "🔬 STEM" in-browser; regression assertion in `test-desk.js`.
- **Drive-by count fixes:** planner lede "497 real activities" → 521; README 455/128/27 → 521/162/41 (wave-22 drift).

**Validation (wave 23):**
- `scripts/build.py`: BUILD OK — **521 activities, 521 pages, 11 categories, 14 collections**, 0 dupes (validator exits 1 on duplicates)
- `scripts/check_api.py`: ALL CHECKS PASSED — **537 pages, 0 broken links**, llms.txt 37 links resolve
- New `scripts/test-wave23.js`: **12,729 assertions pass**; `scripts/test-desk.js`: **463 pass** (extended: landing-desk section — 11 drawers in category order, honest pencil notes, 6 resolving tray cards each in curator-first/no-prep/id order, `#browse` tray-foot deep links, desk.js on index.html, hero CTA → #desk, kneehole blotter → planner, no duplicate ids — plus the pressed-chip fill regression)
- All 12 JS suites pass: halloween 812, thanksgiving 911 (copy_free 153→162, no_elimination 37→41, inclusion 42→46 snapshots refreshed), spring 629, summer 750, winterstem 504, micro 1713, kit 582, fieldtrip 183, planner-core, wave20 1080, winter 1183
- `tests/api.test.sh`: **33/33 pass** (own harness on :3100)
- Headless Chromium (`~/workspace/w23desk/verify.js`, no virtual-time-budget): **24/24 checks pass, zero console/page errors** — 11 landing drawers render, STEM drawer opens (aria-expanded, PULLED stamp opacity 1 at rest), 6 tray cards, tray footer → `?cats=stem#browse` lands with STEM chip preselected and 132 filtered results, open-all/Escape, planner deals 5 day cards on the blotter with stamped week head, mobile 390px (no h-scroll, drawer opens on tap), reduced-motion + calm open drawers with content visible, no-JS shows all 11 trays + 66 cards. Screenshots inspected: `~/workspace/w23desk/shots/` (landing closed/stem-open/all-open/mobile, deep-link filtered view, planner blotter, pressed-chip fix).
- Honest assessment: the landing finally feels like the Teacher's Desk identity instead of wearing it — drawers are the browse, the filter browser is the card catalog underneath. The pressed-chip fix was the kind of bug that only shows once deep links become the main road; good thing the desk made them so.

## Wave 22 — 2026-10-12 — "Winter Holidays + Completeness Audit + Extreme Makeover" ❄️

**What shipped (three parts, in the user's order):**

**Part 1 — Winter holidays fix (FIRST, per the user's "like what thats weird"):** the archive had Halloween + Thanksgiving tabs but no winter section. Now: **30 new winter activities** (Christmas 8, Hanukkah 5, Kwanzaa 5, New Year 6, winter break 6 — all original words per PIPELINE.md, tagline ≤160, 3+ steps, easier/harder, age bands, practical safety notes, no medical claims; Hanukkah/Kwanzaa use respectful learning framing with inclusion notes naming the real traditions), **`winter.html` hub** (5 sections mirroring the halloween/thanksgiving hub pattern, rendered by new `assets/winter.js` from `data/v1/activities.json`, 36 curated picks incl. 6 older winter activities), **"Winter ❄️" nav tab on all 15 shells + generated pages + build.py templates**, **14th collection "Winter Lights"** ❄️ (12 picks with curator notes), **December/January seasonal promo** on the homepage (month-gated in `assets/app.js`), planner Nov→thanksgiving/hanukkah/kwanzaa + Dec→christmas/new-year/hanukkah/kwanzaa (already wired), winter party theme link. Near-duplicate screen vs the 455-activity library renamed 6 candidates (e.g. `kwanzaa-principle-cards`→`seven-principles-talk-tokens`, `new-year-time-capsule`→`resolution-seed-packets`).

**Part 2 — Completeness audit (new standing rule):** programmatic audit found music-rhythm thinnest category (17), rainy-day thin (17), age 3 nearly uncovered (4 activities), Hanukkah/Kwanzaa/New Year at 2–3 each. Filled with **12 gap-fill activities** (4 music-rhythm, 4 rainy-day, 4 age-3) — all at the archive quality bar. Library: **455 → 497 activities**, 14 collections. Remaining thin spots noted for later waves: ages 13–14 (53 each), holiday:july-4th (2), holiday:earth-day (3), holiday:easter (4), holiday:dia-de-muertos (3).

**Part 3 — Extreme makeover (first-visit hierarchy):** the user's verdict was "a lot at once." BEFORE screenshot taken (`winter.html` hub also shot).
- **Two-tier nav** (all 15 shells + build.py's 3 templates + generated pages): 13 equal folder tabs → 5 primary folder tabs (Browse, The Desk, Plan my week, Kit, Collections) + a quiet secondary row (Sub Tub, Party Planner, Field Trips · Halloween, Thanksgiving, Winter, Spring, Summer) styled as index dividers — ruthless hierarchy, progressive disclosure, teacher's-desk grammar kept.
- **Hero**: one primary action ("Find an activity ↓" → #browse) + secondary ("Plan my week"), more whitespace, tighter lede ("No filler, no fluff"), stats receded.
- **Curator's note easter egg**: the sticky note is now a button cycling 4 hand-written notes with genuine opinions ("psst — the sub tub has saved more mondays than coffee." / "hot take: the best STEM demos use trash. fight me.").
- **404 page** (new): a misfiled index card — "This card got misfiled. Somewhere between the drawer and the desk, this page wandered off."
- **Empty state**: "The drawer came up empty… The good stuff is in here somewhere."
- **Human-made rule**: AI-ism scan across the site — zero hits (delve/unlock/game-changer/elevate/fast-paced-world/beginner-or-pro). No purple gradients, no 3-column feature grids, no commented-out code.
- Fixed a stale hardcoded count: planner lede "326 real activities" → 497.
- AFTER screenshots: homepage (desktop + mobile), planner, 404, winter hub.

**Also in this wave (Vercel data/v1 migration — blocking production, user's order):** Vercel never serves static files under `api/` — moved ALL static data `api/v1/` → top-level `data/v1/` (`git mv`, history preserved); only the 4 real function handlers remain under `api/`. Rewrote every `api/v1/` → `data/v1/` reference in build.py, api/health.js, api/review-queue.js, api/cron/scout.js, all frontend JS/HTML, tests, and docs. Two migration bugs caught by tests: `scripts/check_api.py` hardcoded `api/v1` (fixed), `tests/check_envelope.py` hardcoded schema path (fixed); `build.py`'s llms.txt API filter still checked `startswith('api/')` (fixed → `data/`). `LIVE_CHECKLIST.md` carries the canonical rule.

**Validation (wave 22):**
- `scripts/build.py`: BUILD OK — **497 activities, 497 pages, 11 categories, 14 collections**, 0 dupes (validator exits 1 on duplicates)
- `scripts/check_api.py`: ALL CHECKS PASSED — **513 pages, 0 broken links**, llms.txt 36 links resolve
- New `scripts/test-winter.js`: **1171 assertions pass** (30 winter ids + 12 gap fills, tag vocabulary, quality bar, no medical claims, allergy notes, respectful-framing inclusion notes, winter-lights collection, winter.js 36 curated ids resolve, hub structure, nav aria-current on all shells, planner month maps, party winter theme, Dec/Jan promo gating, API manifest/sitemap/llms)
- All 12 JS suites pass: desk 254, halloween 800, thanksgiving 899, spring 617, summer 738, winterstem 504, micro 1713, kit 573, fieldtrip 183, planner-core, wave20 1080
- `tests/api.test.sh`: **33/33 pass** (local harness, functions read from `data/v1/`)
- Headless Chromium: winter hub renders 5 sections (36 picks, status line confirms), homepage AFTER shows two-tier nav + hero CTAs, mobile 390px clean, 404 renders the misfiled card, planner shows new nav. Zero console errors on hub/homepage/404.
- Known harness artifact (not a site bug): scroll-driven `animation-timeline: view()` pick reveals stay at opacity 0 in headless screenshots without scrolling (wave-21 lesson); reduced-motion users get full content.

**Honest assessment:** the nav hierarchy change is the load-bearing fix — the BEFORE/AFTER shows a genuinely calmer first impression. The curator-note easter egg and 404 are real delight moments. Portfolio-proud? Closer than before; the browse section below the hero is untouched by design (it's the tool, not the wall).

## Wave 21 — 2026-10-12 — "The Desk" 🗄️ wow-moment wave 1: the archive as a physical teacher's desk

**What shipped:** the archive as a PHYSICAL TEACHER'S DESK — 11 wooden category drawers that really open, index cards, rubber stamps, pencil marginalia; the planner week laid out on a leather blotter. Teacher's-desk identity (wave 17) kept and built on, not redone.

- **`desk.html`** (NEW, generated by `scripts/build.py::render_desk`) — the flagship: a wooden desk with a brass nameplate, 11 drawers (`DRAWER 01`–`DRAWER 11` in `data/categories.json` order, one per category), each drawer front carrying a brass-framed label holder (category stamp in category ink), a brass cup pull, and a hand-written pencil note with REAL build-computed counts (`<n> cards · <m> no-prep` — research rule 191, grease-pencil marginalia as data). Every drawer opens onto a tray: "ON TOP OF THE PILE" — 6 index cards (curator-picked first, then no-prep, then alphabetical; stable and honest), each a real activity page link with tombstone meta (ages · time · group) + ≤160-char tagline (research rule 194), plus a "PULLED ✓" stamp that slams in on open (research rule 187: the sync cue — ceremony, never a spinner). Tray footers carry honest remaining counts and deep-link to the working filter view (`index.html?cats=<id>`, the wave-14 chip-preselect mechanism) — every drawer is a real doorway. The kneehole holds a leather blotter card linking the Smart Weekly Planner. Open-all / close-all toolbar; Escape closes every drawer.
- **Interaction** (`assets/desk.js`, new) — progressive enhancement: trays render OPEN in the markup (no-JS = full content, verified); JS adds `desk-ready` which collapses them, wires the brass pulls as real buttons (`aria-expanded`/`aria-controls`, `role="region"` trays). Motion is transform/opacity only (card cascade 45ms stagger, stamp slam, pull shift); calm mode + `prefers-reduced-motion` kill all of it via the global rules while content still toggles (verified). Print shows every tray open.
- **Planner blotter** — the week laid out on the desk, pure CSS: `.week-section` becomes a dark-green leather blotter with gold border, the week head a double-border rubber stamp, day cards pinned index cards with washi tape + alternating tilt. All planner logic untouched.
- **Nav/docs** — "The Desk 🗄️" added to all 13 static pages + the build.py activity/review templates; `sitemap.xml` + `llms.txt` (new Tools entry; also fixed two drifts: 12→13 collections, Planner 2.0→3.0); `AGENT.md` + `README.md` document the page.
- **Research folded in** (web-identity round 16, fleet rules): 187 leader grammar → drawer-number gates + PULLED sync stamp; 191 grease-pencil → real-count pencil marginalia; 194 tombstone/chat → card meta + tagline discipline; 197 compactus → closed drawers default, trays open on demand.

**Also in this wave (folded-in urgent fixes):**
- Vercel `functions` map corrected three times per the 2026-10-12 deploy lessons: `nodejs22.x` → `nodejs20.x` → runtime key removed entirely → final: 4 explicit paths (`api/health.js`, `api/review-queue.js`, `api/review-decide.js`, `api/cron/scout.js`) each `{"maxDuration": 10}`, NO `runtime` key (Vercel rejects any Node runtime value; empty `{}` also fails — entries need ≥1 valid property), no broad globs. `tests/api.test.sh` assertion updated; `GO_LIVE.md` + `LIVE_CHECKLIST.md` carry the exact rules.
- `api/` audit: clean — the only `.js` files under `api/` are the 4 real functions; all static data is `.json`, no basename collisions. Checklist line added (functions map is not an allowlist).
- Git identity: removed the repo-local `user.email=mikey@musebook.lol` / `user.name=Mikey` override — commits now use the global `astercast` / `255064122+astercast@users.noreply.github.com` (user's 2026-10-12 hard rule).

**Validation (wave 21):**
- `scripts/build.py`: BUILD OK — 455 activities, 455 pages, 11 categories, 13 collections, 0 dupes (validator rejects duplicates loudly — exits 1)
- `scripts/check_api.py`: ALL CHECKS PASSED — 469 pages, 0 broken links, llms.txt 36 links resolve
- `scripts/test-desk.js` (new): **254 assertions pass** — 11 drawers in category order, pencil notes match independently recomputed counts, 6 tray cards each resolving to real activity pages in curator-first/no-prep/id order, honest tray-foot counts + `?cats=` deep links, aria wiring, open-all/close-all, no duplicate ids, nav on all 13 static pages + review.html + activity pages, sitemap/llms entries, CSS tokens/keyframes/print rule, desk.js aria + no innerHTML
- Existing suites all pass: halloween 735, thanksgiving 834, spring 552, summer 673, winterstem 504, micro 1713, kit 552, fieldtrip 183, planner-core, wave20 1080
- `tests/api.test.sh`: **33/33 pass, 0 fail** (local harness :3100, incl. the new functions-map assertion)
- Headless Chromium (puppeteer-core, interception harness, webfonts aborted — sandbox has no net): 11 drawers render, trays collapse with JS, STEM drawer opens (6 cards, real links, PULLED stamp slams, opacity 1 at rest), Escape closes all, open-all/close-all work, card click lands on the real activity page, `index.html?cats=stem` preselects the STEM chip, planner generates a 5-day week on the blotter (stamped week head, taped day cards), mobile 390px single-column with no h-scroll, calm mode + reduced-motion open drawers with zero animation, no-JS shows all 11 trays + 66 cards, **zero console/page errors**. Screenshots (inspected): `~/workspace/w21desk/shots/` — desk-closed, desk-drawer-open, desk-all-open, desk-mobile-open, planner-blotter-week, activity-from-desk.
- Bug caught by the harness: a `*/` sequence inside a wave-21 CSS comment (`--dur-*/--ease-*`) prematurely closed the comment and swallowed the `:root` token block — desk rendered beige instead of wood. Fixed (reworded comment); tokens verified resolving in-browser (`--wood: #8a5a33`).

**Not in this wave (later wow waves):** three-light card viewer (rule 193), pen-permission collect tool (rule 196), accession-style chronology (rule 198), desk extras (in-tray, date stamps).

## Vercel Wave B — 2026-10-12 — "The Scout" 🛰️ frontend integration + GO_LIVE (live-ready, NOT deployed)

**What shipped:** the §3 fallback contract wired into the frontend, a human-in-the-loop read surface for the Scout, and the §11 GO_LIVE.md runbook.

- **`assets/js/api-client.js`** — the §3.2 `fetchWithFallback` reference implementation, copied verbatim (7s live timeout; `live` / `waking` / `cached` / `none` badge states; honest "cached · updated HH:MM" from the data's own `generated_at`; never rejects). New `assets/js/` dir per the spec path.
- **`review.html`** — NEW page, generated by `scripts/build.py` from the same normalized data that publishes `api/v1/review-queue.json` + `api/v1/decided.json` (pre-rendered per §3.1: fully usable with JS disabled). Two wired widgets, each with its own `<span class="api-badge">`: pending queue (live `/api/review-queue` → static `api/v1/review-queue.json`) and the 90-day decision log (live `?status=decided` → static `api/v1/decided.json`). Client rendering is DOM-built (`textContent`, no innerHTML string escaping). Read-only by design: approve/reject is **never called from the browser** — the page's admin note shows the operator-shell curl with `CRON_SECRET` (the §7.6 secret-paste UI was deliberately not built; the secret never goes in a page or URL). A cron redeploy re-runs the build, so the pre-render stays fresh. Added to sitemap + llms.txt.
- **`assets/style.css`** — Wave B section: `.api-badge` four states (green `live`, pulsing `waking`, amber `cached`, hidden `none`; pulse disabled under `prefers-reduced-motion`), queue cards / tag pills / decided table in Teacher's Desk tokens, reusing the global `:focus-visible` outline.
- **Docs** — `API.md`: new "Live server functions" section (all 4 endpoints, envelope shapes, decide curl, read-only-mode behavior, the `approved_via:'scout'` deviation). `api.html`: new "Live server functions" section with the 4-function table + link to `review.html`. Footer gains a "Scout review queue" link.
- **`GO_LIVE.md`** — rewritten to the §11 template (11 sections): status banner, what deploys (4 functions + 1 cron), prerequisites, exact-click hookup, env var table (`CRON_SECRET` required; `GITHUB_REPO_TOKEN` pending → cron read-only until set), Hobby limits table, cold-start behavior, cron behavior, custom domains, rollback, cost rules (**Standard build machine, never Turbo** — Sept 2026 $38.64 invoice 1ZU1WJJS-0012), plus the known-deviations list. Nothing deployed.

**Documented deviations (preserved/extended):**
1. §7.6 said approve "appends to activities.json" — Wave A instead records `approved_via:'scout'` on the decision entry (PIPELINE.md requires a human to adapt ideas into original words; minting steps/materials server-side would be fabricated data). Kept.
2. The spec's §7.6 `?admin=1` + secret-paste decide UI was NOT built: `POST /api/review-decide` is operator-shell-only (secret-gated, never called from the browser). `review.html` is the read-only surface. Stricter than the spec, documented in GO_LIVE.md §"Known deviations".

**Validation (Vercel Wave B):**
- `scripts/build.py`: BUILD OK (455 activities, 455 pages, 13 collections) — review.html regenerates every build.
- `scripts/check_api.py`: ALL CHECKS PASSED (incl. 0 duplicate ids, 0 broken links across 468 pages, llms.txt 35 links resolve).
- `tests/api.test.sh`: **33/33 pass, 0 fail** (run against the local harness on :3100 — port 3000 was already taken by a sibling worker's trend-wire harness; suite needs `SECRET` matching the harness's `CRON_SECRET`).
- **Functions-disabled pass (§12.3)** — scratch server 404ing `/api/*` (static intact): `review.html` renders fully from pre-rendered content, both badges amber **"cached · updated 06:44 UTC"** with honest tooltips; zero blank widgets; zero console errors from api-client (only Chrome's own 404 resource notices for the deliberately-disabled functions).
- **Timeout-fallback pass** — 9s function delay (> 7s client timeout): client aborts cleanly, falls back to static, badge "cached · updated HH:MM UTC". No spinner-of-death, no error state.
- **Cold-start pass (§12.4)** — local timings: cold (module load) 241ms `/api/health`, warm 13ms; 5s-delayed function: badge shows **"waking server…"** mid-flight with the complete pre-rendered page readable underneath, then live-swaps to **"live"** when the function answers. First paint never waits for `/api/*`.
- **Live pass** — warm functions: both badges green "live" with `title="Fresh from the server · HH:MM UTC"`; 2 TEST-ONLY fixture candidates + 23 decided rows rendered; zero console/page errors.
- **Accessibility** — both badges: `role="status"` + `aria-live="polite"` + `tabindex="0"`; first Tab lands on the badge, `:focus-visible` shows the 3px accent outline (screenshot verified); contrast measured: live 6.05:1, waking 5.38:1, cached 5.37:1 (all ≥ 4.5:1).
- **Mobile** — 390px: no horizontal scroll (scrollWidth = 390), badges wrap cleanly.
- Screenshots (all inspected): `/tmp/av-waveb/shots/` — review-live, review-waking, review-waking-then-live, review-timeout, review-disabled, review-disabled-mobile, review-cached-badge-focus, review-badge-focus-ring3.
- TEST-ONLY fixtures (2 fake candidates) were installed for the render passes and **fully removed afterward**: `pipeline/review-queue.json` verified byte-identical (sha256) to its pre-wave state; `api/v1/review-queue.json` + `review.html` rebuilt fixture-free (0 pending, honest empty-queue state, 23 decided).

**Note on the 06:47 UTC snapshot commit:** the parent snapshotted this wave mid-flight (`59dd442`) while the TEST fixtures were still installed — fixtures were removed and the tree restored byte-identical before this wave's own commit (see below); no fixture content ships.

## Vercel Wave A — 2026-10-11 — "The Scout" 🛰️ serverless backend (live-ready, NOT deployed)

**What shipped:** the §7.6 "Scout" genius system per `~/workspace/server-program/ARCHITECTURE.md` — 4 serverless functions (zero npm deps, `nodejs22.x`), `vercel.json`, `lib/` helpers, envelope schema, and `tests/api.test.sh`. Service name `vault-scout`.

- **`api/health.js`** — §1.4 health: `status` ok/degraded (never 5xx), per-instance `uptime_s`, `functions` roster list, `data_freshness` for `review-queue.json` / `decided.json` / `activities.json` (24h SLA), `checks` (static fallback present, `CRON_SECRET`/`GITHUB_REPO_TOKEN` configured — booleans only, never values). Edge cache `s-maxage=60`.
- **`api/review-queue.js`** — `GET /api/review-queue?status=pending|all|decided` (default pending): candidates shaped as `{id, title, summary, source_url, feed, published, detected_at, suggested_tags[], status, note, decision?, reviewed?, activity_id?}` with counts. Reads the build-published `api/v1/review-queue.json` + `api/v1/decided.json` bundled with the deployment. 60/min/IP token bucket.
- **`api/review-decide.js`** — `POST /api/review-decide` `{id, decision:'approve'|'reject', note?}` gated by `CRON_SECRET` bearer (same mechanism as cron; fail-closed 401). Full body validation (400 + `details.fields`), 404 on unknown id, 400 on already-decided. Approve records `approved_via:'scout'` on the decision and moves the item queue → `decided.json` (90d retention). **Documented deviation from §7.6** ("approve appends to activities.json"): the endpoint cannot mint a valid activity record — PIPELINE.md requires a human to adapt each idea into original words, and inventing steps/materials server-side would be fabricated data (§6). The human's wave adds the real activity via `scripts/build.py`; nothing auto-publishes.
- **`api/cron/scout.js`** — `GET /api/cron/scout`, daily `0 11 * * *` UTC. Bounded parallel RSS/Atom fetch (4000ms each, `Promise.allSettled`), dependency-free feed parser, KEEP/DROP relevance filter ported verbatim from `pipeline/scan.py`, uid scheme identical to `scan.py` (`sha256(feed|link|title)[:16]`, shared seen set), and airtight 4-layer dedupe: seen-uids → queue ids → URL match vs archive+queue → title near-dupe (token Jaccard ≥ 0.6) vs the full 455-activity archive AND the queue. New `pending` candidates get `detected_at` + `suggested_tags[]` (real keyword signal → the fixed TAG_IDS vocabulary). Decided items move to `decided.json` (90d prune). `writeJsonIfChanged` commits `pipeline/seen.json`, `pipeline/review-queue.json`, `pipeline/decided.json`; the redeploy re-runs `build.py`, which publishes `api/v1/review-queue.json` + `api/v1/decided.json` (fallback and store stay the same bytes, §4.6). 60s duplicate-delivery cooldown; `meta.upstream` lists every feed with ok/error (never omitted). Single timed run: 3.4s (10s budget).
- **`lib/`** — `envelope.js`, `fetchx.js`, `ratelimit.js`, `cronauth.js`, `github.js` per §1.11 (first-repo copies; behavior must not fork).
- **`api/v1/schema/envelope.json`** — §1.10 verbatim ($id on the vercel.app placeholder until a domain is assigned).
- **`vercel.json`** — `buildCommand: python3 scripts/build.py` (timed 0.5–2.5s, <60s), `outputDirectory: "."`, `installCommand: echo 'no dependencies'`, one cron (`/api/cron/scout`, `0 11 * * *`), security headers, `cleanUrls`, no Turbo.
- **`scripts/build.py`** — new publish step: `api/v1/review-queue.json` (open candidates only, §5.1) + `api/v1/decided.json` (90d log, derived from `pipeline/decided.json` when the cron has created it, else from decided queue items), plus `review-queue.schema.json` + `decided.schema.json` and manifest entries. `check_api.py` validates both new payloads against their schemas.
- **Commit-back without the token (pending user decision, §14.1):** `lib/github.js` degrades gracefully — `writeJsonIfChanged` returns `{committed:false, reason:'no-github-token'}`; the cron returns real computed candidates with `degraded:true` + an honest human note (read-only mode); `review-decide` validates then returns 500 `REFRESH_FAILED` with a plain-words message instead of committing. Pending-token state is documented in code comments.
- **`tests/api.test.sh` + `tests/serve-local.js` + `tests/check_envelope.py`** — 33 assertions, all green (see Validation). The local harness executes the real function files over real HTTP (this environment's vercel CLI has no `dev` subcommand); cron modules keep instance state across requests like a warm Vercel instance so the 60s cooldown is testable. Section 10 installs one clearly-labeled TEST-ONLY fixture candidate and restores `pipeline/review-queue.json` byte-identical (verified).

**Validation (Vercel Wave A):**
- `tests/api.test.sh`: **33/33 pass, 0 fail** — health 200 + roster match + `s-maxage=60`; roster envelopes `ok:true`; envelope-schema validation vs `api/v1/schema/envelope.json` for health + review-queue; cron 401 no-secret/bad-secret (+envelope shape + `UNAUTHORIZED` code); review-decide 401 gates; 400 `BAD_INPUT` on bad `?status=`, invalid JSON, missing fields (with `details.fields`); 404 `NOT_FOUND` on unknown id; static fallbacks `/api/v1/review-queue.json` + `/api/v1/decided.json` 200; vercel.json lint (one cron, daily-or-slower, `0 11 * * *`, `nodejs22.x`, root output); live cron run against the real feeds (`checked:3`, 3 upstream entries, honest `degraded`+note when a feed fails); duplicate delivery inside 60s → `{duplicate:true}`; review-decide read-only → 500 `REFRESH_FAILED` naming `GITHUB_REPO_TOKEN`; fixture cleanup verified.
- Live-behavior probes (real feeds, read-only): all 4 dedupe layers observed firing on real items — `seen_before`, `url_dupe` (posts already adapted, e.g. `secret-code-decoder-wheels`, `expressionism-scream-art`), `near_dupe` (exact titles already reviewed in the queue, Jaccard 1.00). Full candidate shaping observed end-to-end on real Fun-A-Day items served locally: `{id (16-hex), status:'pending', detected_at, summary ≤300 chars, suggested_tags:['holiday:easter']}` on the Easter post, `[]` where no keyword matched; a same-series sibling correctly screened as near-dupe (Jaccard 0.67).
- `scripts/build.py`: BUILD OK (0.5s) — 455 activities, 455 pages, 13 collections; `scripts/check_api.py`: ALL CHECKS PASSED (incl. the 2 new schema-validated payloads).
- Bugs caught by the tests during the wave: `api/cron/scout.js` required `../lib/` instead of `../../lib/` (500s); `api/review-decide.js` required `../../pipeline/` instead of `../pipeline/` (502 on the 404 path); test-side `curl -sf` suppressing 4xx bodies and `curl -sI` (HEAD) tripping the GET-only method gate — all fixed, suite re-greened.

**Not in this wave (Wave B):** frontend wiring (`assets/js/api-client.js`, badges), `GO_LIVE.md` rewrite, preview-deploy verification, `API.md`/`api.html` docs updates.

## Wave 20 — 2026-10-11 — "The Halloween 2026 Pack" 🎃 seasonal content wave (+40 → 455)

**What shipped:** 40 NEW Halloween activities (`scripts/add_wave20.py`) — the second Halloween seasonal pack. Wave 13's 20-activity pack + hub + Haunted Halls collection already covered the Halloween basics, so wave 20 fills the gaps the first pack left: costumes, movement, quiet-focus, treats, music, and the Kit tool's low-prep pools.

- **The pack** — all 40 in original words per PIPELINE.md: taglines ≤ 160 chars, 3+ steps each, easier+harder variations, clear age bands (3–14 spread) and group ranges, practical-only safety notes (allergy checks on all 5 food activities, adult-only sharp-knife work, choking-hazard notes, no shared food/water, darkness warnings, glow-stick handling — no medical claims anywhere). Spookiness age-labeled: everything silly-spooky or milder. Primary-category split across all 11 categories: crafts 4 / stem 4 / pe-movement 4 / quiet-focus 4 / holidays 5 / icebreakers 3 / music-rhythm 3 / team-community 3 / rainy-day 3 / outdoor 4 / seasons 3. Tag split: 10 halloween-only / 19 halloween+spooky / 9 fall+halloween / 1 fall+halloween+spooky / 1 dia-de-muertos+fall (`marigold-cempasuchil-flowers`, respectful Día de los Muertos learning framing per the wave-16 precedent — a real holiday of remembrance, no invented rituals). Near-duplicate screen against the full 415: skipped `spooky-shadow-tag` (shadow-tag), `flashlight-story-circle` (spooky-story-circle), `pumpkin-roll-rally` (pumpkin-roll-race), `costume-two-truths` (two-truths-and-a-lie), `witches-brew-drum-circle` (bucket-drumming), `fall-leaf-ghost-rubbings` (leaf-rubbing-gallery); kept `ghost-rocket-fizz` (chemical fizz rockets ≠ balloon-rockets' air pressure) and `glow-stick-temperature-lab` (light-output experiment ≠ temperature-melt-race).
- **Research folded in** (activity-ideas round 11, landed 2026-10-11 22:40 PDT — the Halloween-week lane, 20 days out): Roll-a-Monster Dice Draw, Halloween Inference Riddles, and the countdown-calendar format → `halloween-countdown-calendar`, all in our own words; `thumbprint-monsters` + `halloween-dots-and-boxes` from the quiet-focus format notes; `why_it_works` lines cite the DonorsChoose/EdWeek Sept 2026 teacher survey (2,501 teachers, analog demand) and IJRESS brain-break reviews. Research-field coverage now: copy_free 128 (+15), no_elimination 27 (+13), why_it_works 10 (+7), inclusion 39 (+18).
- **Halloween Week collection** — 13th collection (`halloween-week`, 🎃, 12 picks with curator notes): the new pack's greatest hits + the Teal Pumpkin must-do + `monster-mash-dance` + the respectful marigold craft, framed as a countdown to Oct 31.
- **Planner integration** — the October "This season in the Vault" strip now carries a one-tap "🗓️ Plan from the Halloween Week collection" seed link (`planner.html?from=collection:halloween-week`, the same `?from=collection:` mechanism the seasonal hubs use; November gets the `grateful-gathering` equivalent). Hub hero gains "🗓️ Plan Halloween week" + "⚡ The Halloween 2026 pack" buttons; the hub's curated sections grow to 6 with the full 40-pick "Wave 20 · The Halloween 2026 Pack" section (all three spook levels used).
- **Seasonal surfacing** — "HALLOWEEN 2026" rubber-stamp treatment (new `.stamp-season` class: Archivo Black, double border, grunge ink mask, −2.2° rotation — pure Teacher's Desk tokens, identity system intact) stamps the October homepage promo, whose copy now reads "40 brand-new Halloween activities" with links to both collections.
- **Drive-by robustness fix** — `assets/planner.js` `transitionRender()` now swallows aborted view transitions (catches rejections on `finished`/`ready`/`updateCallbackDone` + a sync guard): the planner's collection-seed flow threw an unhandled `AbortError: Transition was skipped` pageerror in headless Chromium; real browsers are unaffected.
- **Docs/agentic** — README.md (455 activities, copy_free 128, no_elimination 27, Halloween hub + planner-strip bullets), API.md (455 snapshot/records), AGENT.md (13 collections incl. halloween-week, 6 hub sections, enrichment counts, seasonal seed links), `skills/halloween-party-planner.md` (new "wave 2" section listing all 40 station-ready activities), kit.html lede (455-activity library), `api/v1/*`, `llms.txt`, `sitemap.xml` regenerated by the build.

**Validation (wave 20):**
- `scripts/build.py`: BUILD OK — 455 activities, 455 pages rendered, 11 categories, 13 collections, 11 balance-bucket mappings, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — 467 pages, 0 broken links; llms.txt 32 links resolve
- `scripts/test-wave20.js` (new): **1080 assertions pass** — 40 ids present/unique, 4/4/4/4/5/3/3/3/3/4/3 primary-category split, tag splits 10/19/9/1/1, 3+ steps + easier/harder + sane age/group/time + tagline ≤160 + safety on all 40, no medical-claim strings, allergy-note coverage on all 5 food activities, knife/carve adult-only, ≥6 no-prep / ≥8 copy-free / ≥6 no-elimination, all 40 pages rendered, halloween-week (12 picks, notes, resolves), hub wave20 section (40 picks, all resolve, all 3 spook levels), hub hero deep links, index stamp promo, `.stamp-season` CSS (font-stamp + grunge), planner SEASON_COLLECTION mapping, manifest/api/sitemap checks
- Existing suites all pass with count snapshots refreshed 415 → 455 / 12 → 13: test-halloween 735, test-thanksgiving 834 (copy_free 113 → 128, no_elimination 14 → 27, inclusion 21 → 39), test-spring 552, test-summer 673, test-winterstem 504, test-micro 1713, test-kit 552, test-fieldtrip 183, test-planner-core
- `node --check`: test-wave20.js, planner.js, halloween.js — clean
- Headless Chromium (puppeteer-core, wave-18 interception harness, `~/workspace/w20halloween/verify.js` — no virtual-time-budget per the 2026-10-12 AGENTS.md lesson): halloween.html renders 6 sections with the 40-pick wave-20 section → spook filter narrows correctly → collections.html#halloween-week renders 12 picks → roll-a-monster-dice-draw page renders with FILED stamp, Kit nav, calm toggle, why-it-works + inclusion sections → planner.html October strip shows "🗓️ Plan from the Halloween Week collection" → clicking it seeds the collection dropdown to halloween-week and generates ("Seeded from 🎃 Halloween week") → index.html October promo shows the HALLOWEEN 2026 stamp (Archivo Black confirmed) → 390px mobile page with no horizontal scroll → **zero console errors/pageerrors**. Screenshots: `~/workspace/w20halloween/shots/` (halloween-hub, collection-halloween-week, activity-roll-a-monster, planner-seeded, index-halloween-stamp, activity-mobile).

**Wave 20 push resolution:** local `7bc8ffe` pushed via `gh-push.py` (125 files, 125 blob uploads, exit 0, ~3.4 min) → remote commit `9a4091f82391593f4295f77392a45a615d2a677e`. Verified via GitHub API: commit exists, `main` HEAD points at it, recursive remote tree (568 files, not truncated) contains `activity/roll-a-monster-dice-draw.html`, `activity/ghost-balloon-stomp.html`, `scripts/test-wave20.js`, `scripts/add_wave20.py`, `halloween.html`, `index.html`, `assets/planner.js`, `WAVELOG.md`, and `api/v1/collections.json`.

## Wave 19 — 2026-10-11 — "The Micro-Activity Pack" ⚡ content wave (+60 → 415)

**What shipped:** 60 NEW genuine 5–10 minute micro-activities (`scripts/add_wave19.py`), closing the gap wave 18's design note flagged — the dataset had only 2 activities with `time_max ≤ 12` (9 with ≤ 15), so the Kit tool's opener/closer role slots leaned on the fallback ladder. Now the opener/closer pools are genuinely stocked.

- **The pack** — all 60 are `no_prep: true`, `time_min ≥ 5` / `time_max ≤ 10`, `copy_free: true`, materials empty or pantry-staple only (every material string word-matches kit.html's 16-staple pantry vocabulary — "one dice", "a ball of yarn or string", "paper cups (two per pair)" all resolve; asserted in-test against the real `VaultKit.itemCovered`). Safety notes practical-only, no medical claims, no food activities (no allergy surface), taglines ≤ 160 chars, 3–4 steps each, easier+harder variations, clear age bands (4–14 spread) and group ranges.
- **All 11 categories covered** (primary category = balance-bucket driver): pe-movement 7 + icebreakers 7 + music-rhythm 5 + quiet-focus 9 + team-community 6 + rainy-day 5 + outdoor 5 + crafts 5 + stem 5 + seasons 3 + holidays 3. Near-duplicate screen against the full 355: skipped `common-three` (common-ground), `rain-on-the-roof` (thunderstorm-clap-along), `star-breathing` (calm-breathing-shapes), `name-echo` (name-chain), `fist-bump-facts` (two-minute-mingle overlap) — every shipped item is a distinct mechanic.
- **Pool impact (measured, not claimed)** — opener hot slot (`time_max≤15` + no-prep + movement-bucket/icebreakers): 18 of the 60 qualify, joining the 7 pre-existing; closer calm slot (`time_max≤20` + calm-bucket/quiet-focus): 13 of the 60 qualify. The old wave-18 "impossible corner" test config (PreK–K, 60 kids, chalk-only pantry) is now genuinely fillable by 7 micros — the test's impossible path was re-pointed at an explicitly empty pool so it stays deterministic.
- **Docs/counts**: README.md 355 → 415 activities (copy-free 53 → 113), API.md source-snapshot/records examples, kit.html hero lede ("355-activity library" → 415), `api/v1/*`, `llms.txt`, `sitemap.xml` regenerated by the build.
- **Identity untouched** — content lane only: data + build, zero hand-edits to generated pages; Teacher's Desk system renders on all 60 new pages (verified in screenshots).

**Validation (wave 19):**
- `scripts/build.py`: BUILD OK — 415 activities, 415 pages rendered, 11 categories, 12 collections, 11 balance-bucket mappings, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — 427 pages, 0 broken links; llms.txt 32 links resolve
- `scripts/test-micro.js` (new): **1713 assertions pass** — 60 ids present/unique, 7/7/5/9/6/5/5/5/5/3/3 category split, all 60 verified 5–10 min + no-prep + copy-free + 3+ steps + easier/harder + sane age/group ranges + pantry-word-matched materials + generated page exists + no medical-claim strings, opener-hot 18 / closer-calm 13 via the REAL `VaultKit.openerCands`/`closerCands`, and an end-to-end `buildKit` deal (g3-5, 20 kids, 5 days, pantry mode) with ≥3 openers and ≥3 closers drawn from the new pool and no repeats across days
- Existing suites all pass with count snapshots refreshed 355 → 415: test-kit 528 (impossible-corner test re-pointed, see above), test-planner-core, test-fieldtrip 183, test-spring 481, test-summer 602, test-halloween 624, test-thanksgiving 763 (copy_free 53 → 113), test-winterstem 504
- `node --check`: test-micro.js, test-kit.js, test-thanksgiving.js, kit-core.js — clean
- Headless Chromium (puppeteer-core, wave-18 interception harness, `~/workspace/w19micro/kit-verify.js` — no virtual-time-budget per the 2026-10-12 AGENTS.md lesson): kit.html status reads "415 activities in the Vault" → generate → 9 slots dealt, **7 from the new micro pool (3 openers + 3 closers + 1 main)** → zip-zap-zop activity page renders with FILED stamp, Kit nav, calm toggle, 5–10 min meta → 390px mobile page with no horizontal scroll → **zero console errors/pageerrors** (only the documented environmental font-tunnel failures + favicon 404, filtered). Screenshots: `~/workspace/w19micro/shots/` (kit-micro-pool, activity-zip-zap-zop, activity-mobile).

**Wave 19 push resolution:** local `1d5a1ed` pushed via `gh-push.py` (212 files, 212 blob uploads, exit 0, ~7.5 min) → remote commit `725694e4f7f577aae9883ba4783adf699c867541`. Verified via GitHub API: commit exists, `main` HEAD points at it, recursive remote tree (526 files, not truncated) contains `activity/zip-zap-zop.html`, `activity/silent-count-twenty.html`, `scripts/test-micro.js`, `scripts/add_wave19.py`, `kit.html`, and updated `WAVELOG.md`/`README.md`/`API.md`. Remote base had moved while pushing (parallel wave activity); gh-push.py pushed onto the live base as designed.

## Wave 18 — 2026-10-11 — "The After-School Kit" 🧰 flagship tool wave

**What shipped:** the flagship experience for running a low-materials after-school program — a guided kit builder that, from the real 355-activity catalog, assembles a week of sessions filtered for low-prep / low-materials / small-group, with a material checklist, print-friendly session plan sheets, and a run-of-show day view. Zero activity-data edits (content lane untouched); all logic on existing fields (`no_prep`, `materials`, `age_*`, `group_*`, `time_*`, `categories` + the balance-bucket mapping).

- **Kit wizard** (`kit.html`): group size (2–60) + age band (5 bands) + days/week (1–5) + minutes/session (30/45/60/90) + session start time + prep strictness + a 16-staple pantry (paper, markers, crayons, pencils, scissors, tape, glue, plates, cups, yarn, balloons, chalk, dice, cards, timer, water — a phone timer and tap water count as on hand, the labels say so).
- **Pantry matching** (`assets/kit-core.js`, pure UMD `window.VaultKit`, require-able in Node): word-boundary matching against real material strings ("cup" matches "paper cups", never "cupcakes"; "card" never matches "cardboard"). Three prep modes: 🧰 use-what-i-have (every material covered by the pantry or none needed), 📦 low-materials (no-prep or ≤3 items), ⚡ no-prep only.
- **Session dealing**: pool = age overlap + group range + `time_min <= minutes` + mode filter; each day deals 🎬 opener (≤15 min, no-prep, movement/icebreaker preferred) → ⭐ main → 🌙 closer (≤20 min, calm/quiet-focus preferred) with a 4-rung fallback ladder (role-fresh → loosened role bound → pool-fresh → repeats flagged `reused:true`, so repeats only happen when the pool is exhausted); no repeats across days; deterministic seeded deal. A relaxation ladder widens pantry→low→hard-filters with plain-language warnings when filters are too tight, and impossible corners return an empty kit + "loosen your filters" instead of a fake plan.
- **Run of show**: per-day clock-time blocks from the session start (opener ~15% / main ~70% / closer ~15%), each slot with a "why it fits" line (prep · time · ages · group · pantry coverage), materials, safety, and a 🔀 per-slot swap.
- **Material checklist**: one aggregated list for the week — ✅ have on hand vs. 🛒 gather before the week, with the days each item is needed; copy-as-text.
- **Session plan sheets**: each day prints on its own printed page (`@media print`); whole-kit print button; copy-kit-as-text.
- **Save/share (URL-synced)**: every generate/swap `history.replaceState`s a `?kit=<base64url>` v1 payload (config + exact picks); opening the link restores the identical kit and wizard answers on any device; last kit also persists in `localStorage` (`activityvault.kit.v1`); 🔗 copy-share-link button.
- **Identity intact**: Teacher's Desk system throughout — Fraunces/Caveat/Courier Prime/Archivo Black, folder-tab nav (new "Kit 🧰" tab on all 12 shells + generated pages via `build.py`), sticker-sheet pantry chips with pressed states, rubber-stamp "SESSION PLAN SHEET" kicker, index-card day sheets with washi tape, sticky-note warnings, `data-calm` kill switch, reduced-motion gates, mobile-first, ARIA live regions + labelled controls, persistent homepage promo banner ("The After-School Kit" flagship entry point).
- **Docs**: `AGENT.md` (new After-School Kit planner paragraph), `README.md` (tool bullet), `API.md` (kit filtering recipe), `llms.txt` (regenerated — kit.html tool line), `sitemap.xml` (kit.html), all 355 activity pages re-rendered with the Kit nav link.

**Validation (wave 18):**
- `scripts/build.py`: BUILD OK — 355 activities, 355 pages, 0 dupes (activity pages re-rendered for the Kit nav link; sitemap + llms.txt regenerated)
- `scripts/check_api.py`: ALL CHECKS PASSED — 367 pages, 0 broken links; llms.txt 32 links resolve
- `scripts/test-kit.js` (new): 363 assertions pass — pantry vocabulary + word-boundary matching on real strings, materialFit, config clamping, all three prep modes on the real dataset (73-activity default pool), buildKit shape/roles/determinism/no-repeats/reused-flag consistency, tight-filter relaxation, impossible-filter graceful empty kit, run-of-show math + clock format, checklist have/gather split, encode/decode round-trip (byte-identical picks) + garbage rejection, kitText, kit.html structure + full kit.js DOM-id cross-check, nav on all 12 shells with exact aria-current, sitemap/llms/CSS/print assertions
- All existing suites still pass: test-fieldtrip 183, test-planner-core, test-spring 481, test-summer 602, test-halloween 624, test-thanksgiving 763, test-winterstem 504 (nav SHELLS lists updated to 12 shells in fieldtrip/thanksgiving/halloween suites)
- `node --check`: kit-core.js, kit.js, test-kit.js + spot-checked existing assets — clean
- Headless Chromium (puppeteer-core, request-interception harness, `~/workspace/w18kit/kit-e2e.js` + `kit-e2e2.js`): wizard renders (16 pantry chips, 9 defaults, 355-activity status) → generate → 3 day cards / 9 slots / checklist / print+copy+share actions → URL synced to `?kit=` → swap changes a slot → fresh page on the share URL restores byte-identical picks + wizard answers + "Shared kit restored" announcement → print emulation shows wizard hidden + 3 plan sheets → mobile 390px generates with no horizontal scroll → calm toggle sets `data-calm` + `aria-pressed` + persists. **Zero console errors** (only the pre-existing site-wide favicon 404 and sandbox font-tunnel failures, both documented in wave 17 as environmental). Screenshots: `~/workspace/w18kit/shots/` (kit-desktop, kit-mobile, kit-mobile-wizard, kit-print).
- Design note for future waves: the dataset has only 2 activities with `time_max ≤ 12` (9 with ≤ 15) — role slots for openers/closers use a fallback ladder rather than hard shortness gates; a future content wave could add genuine 5–10 minute micro-activities to strengthen the opener/closer pools.

**Wave 18 push resolution:** local `b894d64` pushed via `gh-push.py` (383 files, 383 blob uploads, exit 0, ~11 min) → remote commit `97208a156fb776f52b320198259a2ae41b780ae8`. Verified via GitHub API: commit exists, `main` HEAD points at it, recursive remote tree (464 files, not truncated) contains `kit.html`, `assets/kit-core.js`, `assets/kit.js`, `scripts/test-kit.js`, and updated `WAVELOG.md`/`AGENT.md`/`API.md`. Remote base had moved `702d2a1`→ while pushing (parallel wave activity); gh-push.py pushed onto the live base as designed.

## Wave 17 — 2026-10-11 — "The Teacher's Desk" visual identity rework (wave 1)

**What shipped:** full identity overhaul, content untouched (355 activities, 11 categories, planner/Sub Tub/field-trip/API/RSS all intact — CSS + shell chrome only, zero activity-data edits).
- **Typography of its own** — Google Fonts (display=swap, system fallbacks): **Fraunces** (display serif, 800/900 heads), **Caveat** (handwritten marginalia: taglines, desk notes), **Courier Prime** (typewriter: facts, meta, labels, footer colophon), **Archivo Black** (rubber-stamp text: brand, kickers, chips, buttons). Nothing shared with the other sites' stacks.
- **Teacher's-desk texture** — kraft-blotter body (layered radial vignettes on `--desk`), SVG-turbulence paper grain (`--grain` token), all re-skin-friendly tokens (`--desk/--paper/--margin-red/--rule-blue/--sticky/--grain/--grunge/--squiggle` + the existing `--dur-*`/`--ease-*` motion tokens).
- **Index cards** — browse `.act-card`s are ruled cards: blue rule lines, red margin line, washi-tape strip tinted per category (`--cat`, alternating tilt, torn-edge clip-path), alternating ±0.4° rotation, deep paper-lift shadow. Planner day-cards, plan sheets/blocks, and filter panels reuse the card language.
- **Rubber stamps** — brand lockup, hero kicker, category chips (double-border, uppercase, category-inked via `color-mix`, alternating rotation, `--grunge` ink-wear mask), "FILED ✓" stamp on every activity sheet (new decorative span in the build template), safety-box header, primary buttons.
- **Binder rings** — activity sheet gets punched holes + metal rings down the binding edge (pure CSS radial-gradient stacks on `::before`/`::after`); on ≤700px they move to the top edge. Punched-hole strip also runs along the header top.
- **Sticker sheets** — filter chips are white-halo stickers with alternating tilts, hover straighten+scale, `:active` peel-and-stick pop keyframe; pressed state becomes a stamped fill.
- **Manila folders** — collection cards with folder tabs. **Sticky notes** — hero desk-note with push-pin (Caveat, "everything's filed & ready — grab a card ↓"), brain-break/meter-warning extras. **Hand-drawn squiggle** underlines (SVG `--squiggle`) on hero "one vault." + activity section heads. **Folder-tab nav** with raised active tab; typewriter footer colophon.
- **Signature motion** — (1) index-card stagger reveals: `IntersectionObserver` in `site.js` adds `.in` with per-card `--i` stagger delay (app.js sets `--i`; a `MutationObserver` catches late-rendered cards on planner/collections/sub/party/field-trip with zero changes to those files); progressive enhancement via `html.js` gate — no JS/IO = no hiding, ever. (2) stamp/ink-wipe view transitions: the incoming page slams in like a rubber stamp (`vt-stamp-in`: scale 1.22→0.985 + −2.5° rotation, `--dur-slow`/`--ease-decelerate`). (3) sticker press pop. All killed by `data-calm="true"` (verified: toggle → transitions 0s, all cards instantly visible, persists via localStorage) and `prefers-reduced-motion`.
- **Mobile** — header reflows to brand row + scrollable folder-tab strip; binder rings move to card top edge (verified at 390px).

**Validation (wave 17):**
- `scripts/build.py`: BUILD OK — 355 activities, 355 pages, 0 dupes (template changes: font links + file-stamp span regenerated into all pages)
- `scripts/check_api.py`: ALL CHECKS PASSED
- `node --check`: site.js, app.js clean; all 7 JS test suites PASS (planner-core, fieldtrip, spring, summer, halloween, thanksgiving, winterstem)
- Headless Chromium (puppeteer-core, request-interception harness — sandbox blocks localhost via LNA checks and has no internet, so Google Fonts fell back to system stacks in shots): index, collections, activity page, planner, mobile activity — desk identity renders, **zero console errors / zero pageerrors** (only pre-existing favicon 404 + font tunnel failures from the sandbox having no net). Calm toggle verified on/off + persistence.
- Screenshots: `~/workspace/w17cdp/shots/` (index2, activity2, collections, planner, mobile-activity)

**Wave 17 push resolution:** local `3661a13`, remote `66dcbb665ebe9c29e1e37d8408d4b243e9ec2a05` (in `main`'s ancestry — verified via GitHub API commit + recursive tree: 460 files, regenerated activity pages present).

## Wave 16 — 2026-10-11 — Winter Holiday Build Lab pack (+26 → 355, MERGED)

**What shipped:**
- **Winter Holiday Build Lab pack** — 26 new original activities, folded from `MERGE-fragment-w16-pack.json` into `data/activities.json` (all original words per PIPELINE.md; safety notes practical only — allergy checks on both food activities, sealed store-bought ingredients, plastic jars for kids, fan low + fingers clear, string below shoulders, no tasting the instant-snow powder — no medical claims anywhere). Typographic/readability craft on the metadata: taglines under 160 chars, one action per step, short plain sentences.
- 14 winter-holiday STEM/engineering builds (fills the gap the angle-2 research flagged — "Winter STEM is a mature, dense category" — that wave 6's winter crafts pack didn't cover): `holiday-zipline-delivery` (elf zipline, line-angle trials), `sled-and-slope-run` (sled carries 3 gifts down a ramp), `snow-globe-slow-fall` (slowest-fall ingredient test), `reindeer-shelter-storm` (fan blizzard shelter), `stocking-holder-build` (weight-bearing hook/clamp), `gift-conveyor-design` (no-hands delivery line), `cookie-dissolve-race` (which cookie melts first in milk), `instant-snow-polymers` (faux-snow science), `dancing-cranberries` (fizz science), `paper-maze-swap` (design + solve swap), `gift-wrap-measure` (surface-area estimation), `reindeer-grid-coding` (unplugged arrow-card coding), `ornament-pendulum-paint` (jingle-bell pendulum art), `blizzard-in-a-bottle` (storm sensory bottle).
- 12 winter-holiday extras: respectful Hanukkah/Kwanzaa games (`dreidel-spin-math` — real letter rules nun/gimel/hey/shin; `kwanzaa-principle-cards` — the seven Nguzo Saba matched to kid actions, learning-game framing per wave-6 precedent, no invented rituals), `story-gift-pass` (left-right gift exchange), `winter-bird-watch-tally` (pairs with the suet feeder), `northern-lights-pastels`, `snow-paint-spray` (outdoor), `snowman-soup-gift-mix` (cocoa gift jars), `solstice-lantern-stroll` (plan the longest-night walk), `holiday-cleanup-crew-game` (gamified post-party tidy), `snowflake-statue-balance`, `red-nose-green-nose` (holiday red-light-green-light), `winter-hide-and-seek` (jingle-hat seeker).
- Near-duplicate skips (library already covers the mechanic): gumdrop tower (`marshmallow-towers`/`spaghetti-tower`), present launcher catapult (`easter-egg-catapult`), parachute gift drop (`egg-drop-challenge`), candy-cane structures (`cranberry-toothpick-towers`), snowball launcher (catapult family), static snowflakes (`static-butterflies`), ice-melt tests (`temperature-melt-race`), frosty shadow puppets (`shadow-puppet-matinee`), ice excavation (`ice-excavation-dig`), holiday movement circuit (`animal-moves`), mitten match (`paper-mitten-match`), paper-chain countdown (`hanukkah-counting-chain`), ornament crafts (`homemade-christmas-ornaments`), gratitude snowball (`snowball-toss-math`), holiday charades/bingo/i-spy (`charades`, `halloween-bingo`, `mystery-feel-boxes`), estimation jar (`candy-corn-estimation-jar`), cocoa taste test (`apple-tasting-party`), kindness chain (`winter-kindness-chain`), light-up cards (`paper-circuits`).
- **No new tag needed** — reused the wave-6 vocabulary only. Tag split: 13 christmas+winter / 10 winter-only / 1 christmas-only (`gift-wrap-measure`) / 1 hanukkah+winter (`dreidel-spin-math`) / 1 kwanzaa+winter (`kwanzaa-principle-cards`). No retro-tags this wave.
- 6 of the 26 are no-prep emergencies (`story-gift-pass`, `winter-bird-watch-tally`, `holiday-cleanup-crew-game`, `snowflake-statue-balance`, `red-nose-green-nose`, `winter-hide-and-seek`) — Sub Tub candidates. **Merge-worker decision: NOT wired in this wave.** The `sub-tub-essentials` collection is already at the 8–12 pick cap (12 picks; `check_api.py` asserts the cap), and the Sub Tub "nothing at all" tier means *truly-empty materials* by design (`fitsTier(a,'nothing')` requires `mats.length === 0`) — all 6 carry small materials lists. Wiring them in needs a coordinator call: either grow the collection cap or redefine the tier's semantics. Deferred, not dropped.
- Research integrated: `activity-ideas-20261011-2010` angle 1+2 (winter STEM challenge archetypes — zipline, sled, snow globe, shelter, conveyor, snowman stretch variants; quick-challenge 15–45 min format; student-designed rules as capstone step). The `web-craft-20261011-2014` design-craft domain was checked — its report directory was still empty at build time, so no design findings could be applied; recorded as an open follow-up for a future UI wave.

**Merge notes (fold, 2026-10-11 ~21:1x PDT):**
- Pack folded 329 → 355 (the fragment was staged against the 326 baseline as "+26 → 352"; wave 14's scope-up landed 329 first, so the merge is 329+26 = **355**). The staged test's count assertion was corrected 352 → 355 before saving as `scripts/test-winterstem.js`; 504 assertions pass.
- Id uniqueness: 0 duplicates inside the fragment; 0 collisions against the live dataset (incl. the known-taken `shadow-tag` check pattern).
- Staging files `MERGE-fragment-w16-pack.json` + `MERGE-fragment-w16-tests.md` deleted after the fold (staging only, not permanent data).
- Count snapshots refreshed: `test-spring.js`, `test-summer.js`, `test-halloween.js`, `test-thanksgiving.js` 329 → 355 (both the `acts.length` and manifest `records` asserts).
- Docs: README.md (329 → 355 activities), API.md source-snapshot/records examples (326 → 355 — stale since the scope-up), `api/v1/*`, `llms.txt`, `sitemap.xml` regenerated by the build.

**Validation (post-merge):**
- `scripts/build.py`: BUILD OK — 355 activities, 355 pages rendered, 11 categories, 12 collections, 11 balance-bucket mappings, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED
- `scripts/test-winterstem.js` (new): 504 assertions pass — 26 ids present/unique, tag splits 13/10/1/1/1, 3+ steps + easier/harder + sane age/time floors on all 26, no medical-claim strings, allergy-note coverage on the 2 food activities, ≥4 no-prep emergencies, count 355
- `test-spring.js` / `test-summer.js` / `test-halloween.js` / `test-thanksgiving.js` / `test-fieldtrip.js` / `test-planner-core.js`: ALL PASSED (snapshots refreshed)
- `node --check`: test-winterstem.js clean

**Wave 16 push resolution:** (filled after push)

## Wave 15 — 2026-10-11 — Smart Weekly Planner 3.0: multi-week plans, brain breaks, weather backups, supply list, substitute kit + web-craft design pass

**What shipped:**
- **Multi-week planning (1–4 weeks)** — new `weeks` selector in the planner form. `P.buildMultiWeek(activities, opts, catBucket, seed)` deals each week with a shared no-repeat set across all weeks (unless repeats are allowed); `opts.weeks` clamped 1–4 (`P.clampWeeks`); collection seeds go in week 1 only. Each week gets its own landmark section with a fluid-type head, per-week balance meter + warnings, and a sticky "Jump to" nav (week anchors + the 3.0 extras). Saved plans, `?plan=` links, copy-text, and `.ics` all span weeks: the shareable payload is now **v2** (`{version: 2, weeks: [{weekNum, days}]}` — v1 flat-`days` payloads still import as week 1), `.ics` shifts +7 days per extra week with `-w<idx>` UID suffixes (week-0 UIDs byte-stable).
- **⚡ Brain break of the day** — every day card shows a research-backed microbreak idea: `P.brainBreak()` picks a movement-bucket activity that runs cold in ≤10 min, never already scheduled (2026 engagement research: microbreaks under 10 min counter cognitive fatigue; IJRESS review + Ohio State study via `research_notes/activity-ideas-20261011-2010/notes/angle-3-engagement-research.md`).
- **🌦️ Weather-aware backups** — every outdoor-only slot gets an indoor backup picked automatically (`P.needsWeatherBackup` / `P.weatherBackupFor`: indoor, age/time-fit, unscheduled; no-prep first, then high-energy so kids still move), with a one-tap "Swap in backup" button. Outdoor cards in the print deck carry a "🌦️ If it rains: run X instead" line.
- **🛒 Supply-list aggregation** — `P.aggregateSupplies(weeks, byId)` collapses equivalent material strings ("printer paper (a stack)" + "printer paper" → one line via `P.normalizeSupplyItem`), counts scheduled slots per item, lists the days needed — busiest items first. On-page section (top 40 + "…and N more"), 📋 Copy supply list, and a full print page in the deck.
- **🆘 Substitute kit** — per slot, an any-sub-can-run-it backup: `P.subBackupFor()` requires `no_prep` (the 2026 "copy-free" gold standard from `research_notes/.../angle-5-low-prep.md`), prefers indoor + weather-proof picks, shows the first 3 plain-language steps. Renders as native `<details>` week accordions (first week open); prints as its own deck section.
- **Design craft pass (web-craft research domain, mandatory input)** — reports `research_notes/web-craft-20261011-2014/report.md` + `research_notes/web-craft-20261011-2025/report.md` read in full; findings applied, site identity kept (warm-paper tokens untouched): same-document View Transitions on slot actions (gated behind `prefers-reduced-motion` + calm mode); scroll-driven day-card entrance (`animation-timeline: view()`, `@supports`-gated; failure mode "no animation, never invisible content"); container queries on the week grid; motion tokens (`--dur-fast/base/slow`, `--ease-standard/decelerate`) in `:root`; `text-wrap: balance` on week/section heads; `font-variant-numeric: tabular-nums` on slot times and supply counts; fluid `clamp()` week heads; sticky "Jump to" section nav with `scroll-margin-top` anchors; 🍃 **calm mode toggle** (user-controlled sensory envelope beyond the OS binary — kills scroll entrance, view transitions, nav transparency; persisted in `localStorage`); DnD affordances (grab/grabbing cursors, inset drop bar + "Drop here" label; keyboard ↑/↓ parity kept, focus restored via `data-fkey`). Deliberately NOT applied: anchor-positioned tooltips, `content-visibility: auto` on the tool page, MPA cross-document view transitions (site-wide decision, out of lane), variable-font loading. `llms.txt` verified H1 + links + length.
- **Docs/agentic** — AGENT.md week-planner paragraph rewritten for 3.0 (inputs, v2 payload, 3.0 helpers, design-craft notes) + Workflow 4 updated (multi-week procedure, v2 payload shape, `.ics` week offsets, 3.0 extras API); API.md week-plan paragraph; README.md planner line; `llms.txt`/`llms-full.txt` planner + skill lines; `skills/balanced-week-builder.md` → 3.0 (frontmatter + "What's new in 3.0"); `api/v1/skills.json` regenerated from the frontmatter.
- **No activity data touched** — zero new activity ids; `data/activities.json` and all activity pages untouched by this wave (wave-14 lane owns them).

**Validation (wave 15):**
- `scripts/build.py`: BUILD OK
- `scripts/check_api.py`: ALL CHECKS PASSED
- `scripts/test-planner-core.js`: ALL CHECKS PASSED (87 assertions — 48 carried + 39 new: multi-week dealing/no-cross-week-repeats/seeds-week-1-only/clamp/determinism, brainBreak, weatherBackupFor, subBackupFor, aggregateSupplies incl. multi-wording collapse, exportICS weekOffset, planText WEEK headers, v1/v2 share round-trips, DOM id cross-check of all 33 `getElementById` ids in planner.js against planner.html)
- `node --check`: planner-core.js, planner.js — clean

**Parallel-lane incident + stash reconciliation (2026-10-11 ~20:0x–20:3x PDT):** mid-wave, another worker's tree-wide revert wiped all uncommitted wave-15 edits (planner-core.js, planner.js, planner.html, style.css, test-planner-core.js); the work was redone from context and checkpoint-committed as `332abde`. The wave-16 worker's `gh-push.py` run then snapshotted the working tree and pushed uncommitted wave-15 edits to remote main; repaired with revert pushes (no force-push); remote main verified clean (`1067c67` records it). 4 stashes inspected, none popped (all hold other lanes' work or strictly-older snapshots — popping would clobber lanes): `WAVE15-LANE-STASH` (wave-14's data + regenerated shells + build.py), `wave15-inprogress-hold3` (older test-planner-core.js + build.py, nothing newer), `wave15-inprogress-hold2` (wave-14's uncommitted site-wide design CSS — see merge note), `wave15-inprogress-hold` (wave-14's app.js + pre-3.0 planner files). No `<<<<<<<` conflict markers anywhere.

**Merge reconciliation (merge worker, 2026-10-11 ~21:1x PDT):** wave-15 source taken as remote `3f7da1ec` (the push-worktree commit; the local commits' `fieldtrip.html` nav link was a landmine at wave-15 time because fieldtrip.html didn't exist yet — the wave-15 worker removed it in the push worktree only). Verified against the live tree: `assets/planner-core.js` and `scripts/test-planner-core.js` are **byte-identical** to `3f7da1ec`. The remaining deltas in `planner.js` / `planner.html` / `assets/style.css` are all deliberate wave-14 scope-up reconciliations, kept as-is: planner-local calm JS + calm-row markup superseded by the site-wide `site.js` calm toggle (`#site-calm-toggle` in every header, `planner calm wiring unified onto it`); the `Field Trips 🚌` nav link on planner.html is **kept and required** — `test-fieldtrip.js` asserts `href="fieldtrip.html"` on all 11 shells, and the link resolves now that fieldtrip.html exists (landmine defused by the merge). The 4 wave-14 stashes were re-inspected at merge time: every wave-14-owned piece is already in the tree in equal or newer form (design CSS evolved: gated view-transitions per the round-2 Firefox correction, `h1,h2,h3` text-wrap, calm kill-switch; motion tokens already deduped to wave-15's `:root` set `--dur-fast/base/slow` — the stash's `--dur-moderate`/`--ease-accelerate` are unreferenced dead tokens, not restored; `app.js` research filters newer in tree; `data/activities.json` id-identical). Nothing restored from stashes; stashes left in place untouched.

**Wave 15 push resolution:** remote commit `3f7da1ec` (in `main`'s ancestry — verified via GitHub API commit list).

## Wave 14 scope-up — 2026-10-11 — Field Trip Planner 🚌 + research integration + web-craft design pass (329 activities)

**What shipped (scope bar raised mid-wave — "every wave must be a MASSIVE improvement"):**

- **🚌 Field Trip Planner** (`fieldtrip.html` + `assets/fieldtrip-core.js` + `assets/fieldtrip.js`) — the wave's major new tool: destination (museum / nature center / farm / library / community helpers / playground / arts venue) + group size + chaperone ratio + trip length + start time → a timed itinerary with destination-matched on-site activities, chaperone math (1:N, rounds up), buddy-pair assignments (+1 trio for odd counts), budget estimate (admission × kids + flat transport), bus-ride activities drawn from the `field-trip-bus-ride` collection (no-prep first, sized to ride minutes), and printable checklists (permission-slip table, pack list, headcount routine) as native `<details name>` accordions (print CSS forces them open). Copy/print the whole plan as text. Core is a pure UMD module — `require()` it in Node for headless use/tests. 13th collection: `field-trip-bus-ride` (12 picks). "Field Trips 🚌" nav on all 11 shells + 329 generated pages, `aria-current` verified per shell. Asserted by new `scripts/test-fieldtrip.js`: 180 assertions, incl. every destination matching ≥3 activities on the REAL dataset and the full math suite.

- **Research integration** (from `~/workspace/research_notes/activity-ideas-20261011-2010/report.md`, landed 20:14 PDT): 3 Thanksgiving STEM activities adapted in our own words with source attributions — `turkey-code-feathers` (unplugged coding), `cornucopia-catch-game` (target toss w/ scoring), `thanksgiving-table-build` (structures) — all copy-free, all `holiday:thanksgiving`. New dataset fields per the report's explicit recommendations: `copy_free` (53 activities verified zero-printing — new 🖨️ browse filter + page badges), `no_elimination` (14 — new ♾️ browse filter + badges, "nobody sits out"), `why_it_works` (3 research-grounded lines: Deakin/IJRESS brain-breaks, APA Sept 2026), `inclusion` notes (21 activities, incl. all new Thanksgiving picks). Brain-break concepts (5-4-3-2-1, Shadow Tag) noted as future-wave candidates.

- **Navigation audit** (web-craft round 1, mandatory input): every activity page now has breadcrumbs (← All activities + primary-category deep link), build-time 🔗 Related cross-links (same primary category, age-overlap preferred, 3 per page), hub `season-cross` cross-links between seasonal packs, `index.html?cats=` deep links (preselect categories from hub/browse links), and `/` focuses search anywhere. Quick-filter chips for the two new research filters; reset clears them.

- **Design craft applied** (web-craft rounds 1–2, `web-craft-20261011-2014/report.md` + `web-craft-20261011-2025/report.md`): motion token system (`--dur-*`/`--ease-*`, physics: decelerate entrances, transform/opacity only, ≤500ms); cross-document view transitions **gated behind `prefers-reduced-motion: no-preference`** (round-2 correction — Firefox lacks MPA transitions; the unguarded version was fixed); scroll-driven section reveals (`animation-timeline: view()`, `@supports`-gated, finished state = CSS default so the failure mode is "no animation", never invisible content); container queries (hub sections size themselves, replacing the 800px media query); `text-wrap: balance` on headlines; `content-visibility: auto` on long pick lists; native `<details name>` accordions (field-trip checklists + planner sub-kit weeks); **site-wide 🍃 calm-mode toggle** in every header (sensory-envelope beyond the OS setting — kills all motion/transitions/transparency, persists as `activityvault.calm.v1`, wired by new `assets/site.js`, which also prefetches nav links on hover/focus); planner calm wiring unified onto it. Deliberately NOT adopted: dark mode (warm-paper identity), variable-font loading (identity + weight), kinetic type. `llms.txt` already Lighthouse-13.3-agentic-browsing compliant (H1 + links).

- **Docs**: `AGENT.md` (activity record research fields, filter semantics incl. deep links + new booleans, Field Trip Planner workflow, site-wide design-craft note), `README.md` (329 count, research extras, field-trip + calm-mode bullets, new filters), `API.md` count refresh.

**Validation (scope-up):** `build.py` BUILD OK (329/329, 0 dupes, all picks resolve); `check_api.py` ALL CHECKS PASSED; `test-thanksgiving.js` updated to 329/21 + research/nav/calm assertions — 716 pass; `test-fieldtrip.js` (new) — 180 pass; `test-halloween.js` 579, `test-spring.js` 440, `test-summer.js` 561 (count snapshots refreshed), `test-planner-core.js` ALL PASSED; `node --check` clean on all touched JS.

**Design-system notes for the upcoming "Teacher's Desk" identity rework** (do NOT start here): the craft layer added this wave is intentionally token-based and should survive a re-skin — motion tokens (`--dur-*`/`--ease-*`), the calm-mode `data-calm` kill switch, container-query section layout, and `content-visibility` are all identity-agnostic. Points of friction for a paper-craft identity: (1) view-transition crossfades are subtle by design — a stamp/ink-wipe style transition could become the signature; (2) the scroll-reveal is a generic rise — index-card stagger would fit the desk metaphor better; (3) `text-wrap: balance` + Georgia display face is the current voice — a rubber-stamp display treatment would replace it; (4) chips/badges are flat pills — sticker-sheet styling is the obvious mapping; (5) the calm toggle is header-chrome — keep it prominent, teachers asked for control. No structural blockers: all motion is progressive enhancement with "no animation" as the failure mode.

**Wave 14 scope-up push resolution:** pushed 2026-10-11 ~21:05 PDT via `gh-push.py` → remote commit `e0f01240df914ccf2a9f593d95da4ff19ddce60a` (365 files). Push took 3 attempts: attempts 1–2 failed transiently during blob upload (connection reset; then a 400 "malformed request" on an unrelated file — the file itself was valid UTF-8); attempt 3 succeeded. Remote base had moved `792f1c7` → `3f7da1e` while the push was retrying (parallel wave activity); gh-push.py pushed onto the live base as designed. Verified via GitHub Trees API: commit exists, main HEAD = `e0f01240`, recursive tree has 437 files incl. `fieldtrip.html`, `assets/fieldtrip-core.js`, `assets/fieldtrip.js`, `assets/site.js`, the 3 research activity pages, and `scripts/test-fieldtrip.js`.

## Wave 14 — 2026-10-11 — Thanksgiving 2026 pack (+18 → 326) + Thanksgiving hub + Grateful Gathering collection + November promo + Thanksgiving party theme

**What shipped:**
- **Thanksgiving seasonal pack** — 18 new original activities (`scripts/add_wave14.py`, all original words per PIPELINE.md): gratitude crafts (`thankful-turkey-handprints`, `paper-cornucopia-build`, `friendsgiving-place-cards`, `harvest-weave-placemats`), harvest games (`turkey-tag-chase`, `pumpkin-bucket-toss`, `harvest-basket-relay`), Thanksgiving STEM (`cranberry-toothpick-towers`, `turkey-baster-relay`, `shake-jar-butter`), friendsgiving (`friendsgiving-potluck-plan`, `friendsgiving-story-circle`), gratitude practices (`gratitude-alphabet-circle`, `thankful-jar-shares`, `gratitude-all-year`), giving back (`food-drive-planning`, `staff-thank-you-cards`, `blessing-bag-pack`). Skipped as near-duplicates of existing library items: `corn-husk-dolls` (already in the library, seasons/crafts, season:fall) and a mini-pumpkin catapult (`easter-egg-catapult` already covers the popsicle-stick catapult mechanic) — replaced by the original turkey-baster relay. Safety notes are practical only — allergy checks on every food activity, dairy check on the butter shake (dairy-free kids take the timer role), sealed store-bought snacks for blessing bags, toss-toward-targets, toothpick/baster rules — no medical claims anywhere. Inclusive framing: `gratitude-all-year` and the hub copy say plainly that not every family celebrates Thanksgiving, with the harvest-feast alternative named in the potluck planner.
- **Tag vocabulary grown** — NEW `holiday:thanksgiving` added to the `scripts/build.py` validator (TAG_IDS + TAG_LABELS), `assets/app.js` (TAG_LABELS + TAG_ORDER), `assets/planner.js` SEASON_LABELS, `api/v1/filters.json` (options + labels), the activity schema tag enum, and the docs. 5 older Thanksgiving-appropriate activities retro-tagged with tags only (descriptions untouched): `gratitude-tree`, `gratitude-journals`, `harvest-thanksgiving-skits` → `holiday:thanksgiving`; `gratitude-door-decor`, `harvest-gratitude-circle` → `season:fall` + `holiday:thanksgiving`. New pack tag split: 13 thanksgiving-only / 4 fall+thanksgiving / 1 fall-only (`harvest-weave-placemats`). Side effect: the retro-tag moved `harvest-gratitude-circle` out of wave 13's "1 fall-only" bucket — `scripts/test-halloween.js` tag-split assertions updated.
- **Thanksgiving hub** (`thanksgiving.html` + new `assets/thanksgiving.js`) — 5 curated sections with build-validated id lists (25 picks): gratitude crafts, harvest games, Thanksgiving STEM, gratitude & friendsgiving (gratitude-practices / friendsgiving groups with `?tag=` browse chips), giving back. Hero shortcuts: 🗓️ Plan a Thanksgiving week (`planner.html?from=collection:grateful-gathering`), 📚 Grateful Gathering collection, 🎉 Thanksgiving party theme. Client-side render from `api/v1/activities.json`; your-own rating badges (localStorage only); semantic HTML + ARIA + keyboard-native; mobile-first, existing design system.
- **Grateful Gathering collection** — 12th collection in `data/collections.json` (🦃, 12 picks, every pick with a curator note, all ids validated): the Thanksgiving 2026 pack's greatest hits plus the Vault's best older gratitude picks (`gratitude-tree`).
- **Planner + homepage seasonal tie-ins** — planner "This season in the Vault" strip now maps Nov → `holiday:thanksgiving` (pinned by test; Hanukkah/Kwanzaa chips kept). Homepage shows a month-gated (November only, client-side) 🦃 Thanksgiving promo banner linking to `thanksgiving.html` (spring/summer/halloween banners kept). **Party Planner Thanksgiving theme** — fifth theme in `assets/party.js` (`holiday:thanksgiving`/`season:fall` pool; group names Turkeys, Harvesters, Cornucopias, Acorns, Gourds, Sunflowers; gratitude-circle welcome); `party.html` gains the 🦃 Thanksgiving radio chip, updated title/meta, and a Grateful Gathering collection tie-in note. "Thanksgiving 🦃" nav link added to all 10 page shells including the 326 generated activity pages; `aria-current="page"` verified explicitly on every shell (api.html keeps its no-aria-current pattern). Drive-by fix: api.html's stale "Party Planner 🎃" nav label → 🎉.
- **Agentic surface** — `api/v1/index.json` manifest auto-updated (326 activities, 12 collections, v1.0.0); schemas regenerated (tag enum); `llms.txt`/`llms-full.txt`/`sitemap.xml` regenerated (thanksgiving.html tool line, 12 collections, sitemap gains `thanksgiving.html`); `AGENT.md` (counts, tag vocabulary, thanksgiving hub section, thanksgiving party theme + pool, strip month map), `API.md` (counts, tag lists, 12 collections), `README.md` (326 activities, thanksgiving hub, tag chips, November promo) updated by hand.
- **No new skill** — no genuine gap: gratitude crafts/games covered by `activity-finder`/`outdoor-play-picker`, Thanksgiving STEM by `stem-demo-picker`, party stations by the existing Party Planner + thanksgiving theme.

**Validation (wave 14):**
- `scripts/build.py`: BUILD OK — 326 activities, 326 pages rendered, 11 categories, 12 collections, 11 balance-bucket mappings, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — link check 336 pages, 0 broken; llms.txt 30 links resolve
- `scripts/test-thanksgiving.js` (new): 613 assertions pass — 18 wave-14 ids present/unique, tag splits (13/4/1), steps + easier/harder + sane age/time floors on all 18, no medical-claim strings, allergy-note coverage on food activities, inclusive-framing copy asserted, retro-tags exact, collections valid (12 unique, grateful-gathering 12 picks all resolving with notes + deep link + computed spans), every `thanksgiving.js` curated id resolves (unique, group tags in vocabulary), hub markup (live status region, sections host, scripts, skip link), planner November→thanksgiving pin, party thanksgiving theme shape + pool ≥ 6 with ≥ 6 new picks, `app.js` November promo hook + `index.html` promo section, nav on all 10 shells + generated pages with exact aria-current assertions, filters.json/schema/manifest/sitemap/llms.txt checks
- `scripts/test-halloween.js`: 576/576 pass (count snapshots refreshed for the new totals; tag-split updated for the wave-14 retro-tag)
- `scripts/test-spring.js`: 437/437 pass (count snapshots refreshed for the new totals)
- `scripts/test-summer.js`: 558/558 pass (count snapshots refreshed for the new totals)
- `scripts/test-planner-core.js`: ALL CHECKS PASSED (unchanged)
- `node --check`: thanksgiving.js, app.js, planner.js, party.js, test-thanksgiving.js — clean

**Wave 14 push resolution:** (filled after push)

## Wave 13 — 2026-10-11 — Halloween 2026 pack (+20 → 308) + Halloween hub + Haunted Halls collection + October promo

**What shipped:**
- **Halloween seasonal pack** — 20 new original activities (`scripts/add_wave13.py`, all original words per PIPELINE.md): Halloween crafts (`ghost-garland-string`, `monster-mask-making`, `lollipop-ghost-treats`, `pressed-leaf-mandala`), costume & party games (`costume-runway-walk`, `costume-piece-relay`, `mystery-feel-boxes`, `monster-mash-dance`, `apple-string-bite`), not-too-spooky STEM (`pumpkin-volcano-fizz`, `candy-chromatography`, `monster-slime-lab`, `haunted-house-blueprint`), harvest (`apple-tasting-party`, `harvest-gratitude-circle`, `pumpkin-guts-sensory`), trick-or-treat alternatives (`trunk-or-treat-planning`, `reverse-trick-or-treat`, `teal-pumpkin-project`, `trick-or-treat-route-map`). Skipped as near-duplicates of existing library items: a third no-carve pumpkin-decorating concept (`no-carve-pumpkin-decorating` + `pumpkin-painting-party` already cover it) and an eyeball spoon race (`easter-egg-relay` already covers the mechanic). Safety notes are practical only — adult-only knife/carve work (asserted by test), allergy checks on every food/treat activity, choking-hazard notes, no shared food/water (string-bite replaces bobbing), sealed store-bought treats for giveaways — no medical claims anywhere. Spookiness is age-labeled: everything is silly-spooky or milder.
- **Tag vocabulary: no new tag needed** — `holiday:halloween` has been in the validator since wave 4 (now 35+ tagged activities); verified present in `scripts/build.py`, `assets/app.js`, `api/v1/filters.json`, the schema enum, and the docs rather than adding a duplicate. 2 older Halloween-appropriate activities retro-tagged with tags only (descriptions untouched): `halloween-mummy-wrap` → `holiday:halloween`, `pumpkin-letter-hunt` → `season:fall` + `holiday:halloween`. New pack tag split: 8 halloween-only / 7 halloween+spooky / 4 fall+halloween / 1 fall-only (`harvest-gratitude-circle`).
- **Halloween hub** (`halloween.html` + new `assets/halloween.js`) — 5 curated sections with build-validated id lists (32 picks): Halloween crafts, costume & party games, not-too-spooky science, harvest, beyond trick-or-treating (alternatives / allergy-aware / respectful Día de los Muertos groups with `?tag=` browse chips). Hero shortcuts: 🗓️ Plan a Halloween week (`planner.html?from=collection:haunted-halls`), 📚 Haunted Halls collection, 🎉 Halloween party theme. **Spookiness-level filter**: client-side buttons (🎃 Show all / 🍎 Not spooky / 👻 Spooky-fun / 🕷️ Mildly spooky), `aria-pressed` toggling, empty sections/groups hidden, `role="status"` live count announcement; every pick carries a `data-spook` level. Client-side render from `api/v1/activities.json`; your-own rating badges (localStorage only); semantic HTML + ARIA + keyboard-native buttons; mobile-first, existing design system.
- **Haunted Halls collection** — 11th collection in `data/collections.json` (👻, 12 picks, every pick with a curator note, all ids validated): the Halloween 2026 pack's greatest hits plus the Vault's best older not-too-spooky picks, with the Teal Pumpkin Project as the allergy-aware must-do.
- **Planner + homepage seasonal tie-ins** — planner "This season in the Vault" strip already mapped Oct → `holiday:halloween` (pre-existing); pinned by test, no change needed. Party Planner 🎃 Halloween theme pre-exists since wave 6 — the new pack feeds its pool (asserted ≥ 6 new picks in-pool). Homepage shows a month-gated (October only, client-side) 🎃 Halloween promo banner linking to `halloween.html` (spring/summer banners kept). "Halloween 🎃" nav link added to all 9 page shells including the 308 generated activity pages; `aria-current="page"` verified explicitly on every shell (wave-12 lesson — exactly one per shell, pointing at itself; halloween.html's own link is the current one there).
- **Agentic surface** — `api/v1/index.json` manifest auto-updated (308 activities, 11 collections, v1.0.0); schemas regenerated (tag enum unchanged — no new tags); `llms.txt`/`llms-full.txt`/`sitemap.xml` regenerated (halloween.html tool line, 11 collections, sitemap gains `halloween.html`); `AGENT.md` (counts, 11 collections + haunted-halls deep link, Halloween hub section), `API.md` (counts, 11 collections), `README.md` (308 activities, Halloween hub, October promo) updated by hand.
- **No new skill** — merged into `skills/halloween-party-planner.md` (Halloween 2026 pack section: the 20 new station-ready activities, Teal Pumpkin allergy-aware planning, trunk-or-treat planning, haunted-halls collection, hub spookiness filter; frontmatter description corrected to all four presets) rather than duplicating. No genuine gap: crafts/games covered by `activity-finder`/`outdoor-play-picker`, STEM by `stem-demo-picker`, party stations by the existing planner + skill.

**Validation (wave 13):**
- `scripts/build.py`: BUILD OK — 308 activities, 308 pages rendered, 11 categories, 11 collections, 11 balance-bucket mappings, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — link check 317 pages, 0 broken; llms.txt 29 links resolve; workflow2 (Halloween party) picks a new wave-13 station (`ghost-garland-string`)
- `scripts/test-halloween.js` (new): 549 assertions pass — 20 wave-13 ids present/unique, tag splits (8/7/4/1), steps + easier/harder + sane age/time floors on all 20, no medical-claim strings, knife/carve work adult-only on every activity mentioning blades, retro-tags exact, collections valid (11 unique, haunted-halls 12 picks all resolving with notes + deep link + computed spans), every `halloween.js` curated id resolves (32 picks, unique, all three spook levels used, group tags in vocabulary), hub filter markup (4 buttons, aria-pressed, labelled, live status), planner October→halloween pin, party halloween theme shape + pool ≥ 6 with ≥ 6 new picks, `app.js` October promo hook + `index.html` promo section, nav on all 9 shells + generated pages with exact aria-current assertions, filters.json/schema/manifest/sitemap/llms.txt checks
- `scripts/test-spring.js`: 410/410 pass (count snapshots refreshed for the new totals)
- `scripts/test-summer.js`: 531/531 pass (count snapshots refreshed for the new totals)
- `scripts/test-planner-core.js`: ALL CHECKS PASSED (unchanged)
- `node --check`: halloween.js, app.js, planner.js, party.js, test-halloween.js — clean

## Wave 12 — 2026-10-11 — Summer 2027 pack (+25 → 288) + summer hub + Party Planner summer theme

**What shipped:**
- **Summer seasonal pack** — 25 new original activities (`scripts/add_wave12.py`, all original words per PIPELINE.md): water play (`water-balloon-toss`, `drip-drip-drop`, `bucket-brigade-race`, `sponge-launch-bullseye`, `foam-noodle-tag`, `sprinkler-limbo`), outdoor/camp games (`capture-the-flag-basics`, `flashlight-tag`, `chalk-obstacle-course`, `frisbee-golf-nine`, `nature-color-scavenger`), summer crafts (`friendship-bracelet-basics`, `sun-print-cards`, `pinwheel-garden`, `sand-art-bottles`), beat-the-heat indoor backups (`ice-excavation-dig`, `fan-boat-races`, `indoor-campfire-circle`, `shadow-puppet-matinee`), camp program (`camp-week-kickoff`, `talent-showcase-night`), July 4th (`star-spangled-shoebox-parade`, `liberty-quiz-bowl` — quiz facts are real: 1776, 13 colonies, 50 stars, first capital New York), solstice (`longest-day-shadow-track`), plus `giant-bubble-chase`. Sun/heat/water safety notes are practical only (shade, water breaks, clean up balloon pieces) — no medical claims anywhere.
- **Tag vocabulary grown** — `season:summer`, `holiday:july-4th` added to the `scripts/build.py` validator, `assets/app.js` labels/order, `api/v1/filters.json`, the activity schema tag enum, and the docs. 4 older summer activities retro-tagged with tags only (descriptions untouched): `ice-cube-painting`, `water-relay`, `chalk-art`, `water-cycle-in-a-bag` → `season:summer`.
- **Summer hub** (`summer.html` + new `assets/summer.js`) — 5 curated sections with build-validated id lists: water play, outdoor & camp games, summer crafts, beat-the-heat indoor (ties to the rainy-day-rescue collection for storm days), summer holidays & camp (July 4th + camp-week groups with `?tag=` browse chips). Hero shortcuts: 🗓️ Plan a summer week (`planner.html?from=collection:summer-splash`), 📚 Summer Splash collection, 🎉 summer party theme. Client-side render from `api/v1/activities.json`; your-own rating badges (localStorage only); semantic HTML + ARIA + keyboard-native; mobile-first, existing design system.
- **Summer Splash collection** — 10th collection in `data/collections.json` (☀️, 12 picks, every pick with a curator note, all ids validated).
- **Party Planner summer theme** — fourth theme in `assets/party.js` (`holiday:july-4th`/`season:summer` pool — 28 candidates; group names Sharks, Sunbeams, Dolphins, Wave Riders, Sand Dollars, Beach Balls; 5-min shade-and-water break midway); `party.html` gains the ☀️ Summer radio chip, updated title/meta, and a Summer Splash collection tie-in note. Theme switching stays data-driven.
- **Planner + homepage seasonal tie-ins** — planner "This season in the Vault" strip now maps May–Jul → `season:summer`, Jul → `holiday:july-4th`; homepage shows a month-gated (Jun–Aug, client-side) ☀️ Summer promo banner linking to `summer.html` (spring banner kept for Mar–May); "Summer ☀️" nav link added to all page shells including the 288 generated activity pages.
- **Seasonal freshness pass** — scanned all 288 records for year/time-relative staleness: only generic recurring-use phrasing ("until next year", "next year's question cards") in the new Liberty Quiz Bowl; all summer copy clean, no invented details.
- **Agentic surface** — `api/v1/index.json` manifest auto-updated (288 activities, 10 collections, v1.0.0); schemas regenerated (tag enum); `llms.txt`/`llms-full.txt`/`sitemap.xml` regenerated (summer.html tool line, 10 collections, sitemap gains `summer.html`); `AGENT.md` (counts, tag vocabulary, summer hub section, summer party theme + pool + break, strip month map), `API.md` (counts, tag lists, 10 collections), `README.md` (288 activities, summer hub, tag chips, summer promo months) updated by hand.
- **No new skill** — no genuine gap: water/outdoor games covered by `outdoor-play-picker`, summer crafts by `activity-finder`, heat-day indoor backups by `rainy-day-rescue`/`no-prep-rescue`, summer STEM by `stem-demo-picker`, camp weeks by the week planner's camp preset + `balanced-week-builder`.
- **check_api.py + build.py counts** — collection count asserts updated 9 → 10; `scripts/test-spring.js` count snapshots updated to the new totals (288 activities, 10 collections) — it now reports 377 assertions.

**Validation (wave 12):**
- `scripts/build.py`: BUILD OK — 288 activities, 288 pages rendered, 11 categories, 10 collections, 11 balance-bucket mappings, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — link check 296 pages, 0 broken; llms.txt 28 links resolve
- `scripts/test-summer.js` (new): 498 assertions pass — 25 wave-12 ids present/unique, tag splits (23 summer-only / 2 july-4th), steps + easier/harder + sane age/time floors on all 25, no medical-claim strings, retro-tags exact, collections valid (10 unique, summer-splash 12 picks all resolving with notes), every `summer.js` curated id resolves, planner month→summer mapping + labels, party summer theme shape + pool ≥ 6 (28 actual), `app.js` tags + summer promo hook, filters.json tags, manifest records 288/10, schema enum tags, summer.html nav on all 8 shells + generated pages
- `scripts/test-spring.js`: 377/377 pass (count snapshots refreshed for the new totals)
- `scripts/test-planner-core.js`: 39/39 pass (unchanged)
- `node --check`: app.js, planner.js, party.js, summer.js, spring.js, collections.js, ratings.js, sub.js, planner-core.js, test-summer.js — clean

**Wave 12 push resolution:** local commit `b250609` pushed via `gh-push.py` (320 files, 320 blob uploads; first attempt hit a transient 400 on one blob at blob ~250, retry of the whole script succeeded, exit 0) — remote commit `da21fb10ceabdf837b37618b996d8bcfdd9f0b64`. Verified via GitHub API: commit exists, `main` HEAD points at it, recursive remote tree (378 files, not truncated) contains `summer.html`, `assets/summer.js`, `scripts/add_wave12.py`, `scripts/test-summer.js`, `api/v1/collections.json`, the 25 new `activity/*.html` pages, and updated `WAVELOG.md`/`AGENT.md`/`API.md`.

## Wave 11 — 2026-10-11 — Spring 2027 pack (+25 → 263) + spring hub + Party Planner spring theme + RSS sweep

**What shipped:**
- **RSS pipeline sweep** — ran `pipeline/scan.py`: 33 feed items scanned (WeAreTeachers 16, Hands On As We Grow 7, Teach Beside Me 10), 0 new candidates, 0 pending review. The review queue's 23 entries were all decided in earlier waves; nothing to process this wave.
- **Spring seasonal pack** — 25 new original activities (`scripts/add_wave11.py`, all original words per PIPELINE.md): spring crafts (`tissue-paper-cherry-blossoms`, `coffee-filter-butterflies`, `painted-rock-ladybugs`, `pressed-flower-bookmarks`, `egg-carton-tulip-garden`, `paper-plate-sunflower`), spring STEM/nature (`worm-weather-watch`, `puddle-depth-gauge`, `flower-part-dissect`, `nest-material-challenge`, `seed-dispersal-design`, `sprout-growth-race`, `bubble-snake-blower`, `evaporation-chalk-lines`), outdoor games (`sponge-bucket-relay`, `puddle-stomp-parade`, `spring-sound-map`, `puddle-hopscotch`, `egg-roll-race`), spring holidays (`jellybean-sort-graph`, `easter-egg-catapult`, `earth-day-trash-audit`, `seed-ball-wildflowers`, `recycled-paper-making`), rainy-day backup (`thunderstorm-clap-along`). Three zero-material/no-prep emergencies (`puddle-stomp-parade`, `spring-sound-map`, `thunderstorm-clap-along`) flow automatically into the Sub Tub "nothing at all" tier. (Note: `shadow-tag` was drafted then dropped — the id already exists.)
- **Tag vocabulary grown** — `season:spring`, `holiday:easter`, `holiday:earth-day` added to the `scripts/build.py` validator, `assets/app.js` labels/order, `api/v1/filters.json`, the activity schema tag enum, and the docs. 4 older spring activities retro-tagged with tags only (descriptions untouched): `spring-seed-cups`, `spring-bulb-forcing`, `kite-flying-basics` → `season:spring`; `egg-hunt-design` → `season:spring` + `holiday:easter`.
- **Spring hub** (`spring.html` + new `assets/spring.js`) — 5 curated sections with build-validated id lists: spring crafts, outdoor games, spring science, rainy spring days (ties to the rainy-day-rescue collection), spring holidays (Easter + Earth Day groups with `?tag=` browse chips). Hero shortcuts: 🗓️ Plan a spring week (`planner.html?from=collection:spring-burst`), 📚 Spring Burst collection, 🎉 spring party theme. Client-side render from `api/v1/activities.json`; your-own rating badges (localStorage only); semantic HTML + ARIA + keyboard-native; mobile-first, existing design system.
- **Spring Burst collection** — 9th collection in `data/collections.json` (🌷, 12 picks, every pick with a curator note, all ids validated). Sub Tub essentials gains `thunderstorm-clap-along` as its spring emergency (12 picks, within the 8–12 cap).
- **Party Planner spring theme** — third theme in `assets/party.js` (Easter/Earth Day/`season:spring` pool; group names Bunnies, Sprouts, Rainclouds, Ladybugs, Tadpoles, Seedlings; hero/kicker/closing copy); `party.html` gains the 🌷 Spring radio chip, updated title/meta, and a Spring Burst collection tie-in note. Theme switching stays data-driven.
- **Planner + homepage seasonal tie-ins** — planner "This season in the Vault" strip now maps Mar–May → `season:spring`, Mar → `holiday:easter`, Apr → `holiday:easter` + `holiday:earth-day`; homepage shows a month-gated (Mar–May, client-side) 🌷 Spring promo banner linking to `spring.html`; "Spring 🌷" nav link added to all page shells including the 263 generated activity pages.
- **Seasonal freshness pass** — scanned all 263 records for year/time-relative staleness: only intentional "this year" phrasing in the New Year activities; all spring copy clean, no invented details.
- **Agentic surface** — `api/v1/index.json` manifest auto-updated (263 activities, 9 collections, v1.0.0); schemas regenerated (tag enum); `llms.txt`/`llms-full.txt`/`sitemap.xml` regenerated (spring.html tool line, 9 collections, sitemap gains `spring.html`); `AGENT.md` (counts, tag vocabulary, spring hub section, spring party theme + pool, strip month map), `API.md` (counts, tag lists, 9 collections), `README.md` (263 activities, spring hub, tag chips, corrected skills count 11) updated by hand.
- **No new skill** — no genuine gap: spring crafts/games are covered by `activity-finder`, outdoor games by `outdoor-play-picker`, rainy backups by `no-prep-rescue`/`rainy-day-rescue`, spring STEM by `stem-demo-picker`.
- **check_api.py fix** — the link checker now strips `?query` before resolving local paths, so client-side deep links in static HTML (`planner.html?from=collection:spring-burst`) no longer false-positive.

**Validation (wave 11):**
- `scripts/build.py`: BUILD OK — 263 activities, 263 pages rendered, 11 categories, 9 collections, 11 balance-bucket mappings, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — 270 pages, 0 broken; llms.txt 27 links resolve
- `scripts/test-spring.js` (new): 346 assertions pass — 25 wave-11 ids present/unique, tag splits (19 spring-only / 3 easter / 3 earth-day), steps + easier/harder on all 25, retro-tags exact, collections valid (9 unique, spring-burst 12 picks all resolving with notes, sub-tub-essentials spring pick), every `spring.js` curated id resolves, planner month→spring mapping + labels, party spring theme shape + pool ≥ 6 stations-worth, zero-material trio sub-tub-ready, `app.js` tags + promo hook, `filters.json` tags, manifest records 263/9
- `scripts/test-planner-core.js`: 39/39 pass (unchanged)
- `node --check`: app.js, planner.js, party.js, spring.js, collections.js, ratings.js, sub.js, planner-core.js — clean

**Wave 11 push resolution:** local commit `23ca4a4` pushed via `gh-push.py` (296 files, 296 blob uploads, exit 0, ~5 min with an internal retry) — remote commit `08f5ee66cee0186d806c50512627c06a77d41355`. Verified via GitHub API: commit exists, `main` HEAD points at it, recursive remote tree (349 files, not truncated) contains `spring.html`, `assets/spring.js`, `scripts/add_wave11.py`, `scripts/test-spring.js`, `api/v1/collections.json`, the 25 new `activity/*.html` pages, and updated `WAVELOG.md`/`AGENT.md`/`API.md`.

## Wave 10 — 2026-10-11 — Smart Weekly Planner 2.0 (flagship interactive tool)

**What shipped:**
- **Auto-built balanced weeks** (`assets/planner-core.js` — pure, UMD, works in browser + Node): pick program type (`after-school` / `camp` / `classroom` presets with slots, minutes, indoor rules, `.ics` start hours), age band (`prek-k` → `all`), days (Mon–Sun), slots/day (1–4), minutes/activity, and the core deals a no-repeat week from the real 238 via balance-aware scoring (`day_bucket_count × 3 + week_bucket_count + 2 × used_category`, ties shuffled, seeded PRNG for reproducibility).
- **Balance meter**: 5 energy buckets from new `data/balance-buckets.json` (⚡ movement, 🧘 calm, 🎨 creative, 🌳 outdoor, 🔀 all-rounder — every one of the 11 categories maps to exactly one; an activity's bucket = its primary category). Per-day + whole-week visual meters (segmented bars, `role="img"` + text legend) with human warnings: non-`mixed` bucket > 50% of a day's slots (movement → "lands softly", calm → "sleepy", creative → "cleanup", outdoor → "indoor backup", 3+ slots zero calm → "quiet landing"), plus week checks (no movement across 4+ slots, no calm across 6+).
- **No-repeat logic + prep caps**: configurable max prep-heavy activities/week (0–5, default 2); repeats only when explicitly allowed; gaps stay visible as open slots instead of silent repeats.
- **Day shaping tools**: drag-and-drop reorder within days (HTML5 DnD; ↑/↓ buttons as the keyboard path, moves announced via `aria-live`), per-slot 🔀 swap (balance-friendly fresh pick, never repeats, respects prep cap), 🎲 "Surprise me" gap fill.
- **Saved plans + exports**: multiple named plans in `localStorage` (`activityvault.plans.v1`, browser-only — the honesty copy says so), client-side **`.ics` download** (floating local times from the program start hour on the next matching weekday, `DURATION = min(time_max, maxTime)`), print week plan (wave-7 card deck + per-day energy-balance header), 📋 Copy my week (wave-7 pattern incl. your ratings/reflections), 🔗 Copy plan link (`planner.html?plan=<base64url>`, validated on import — unknown ids dropped with a visible note).
- **Deep links**: `planner.html?from=collection:<id>` pre-seeds from any of the 8 collections (picks filtered by constraints, skips reported); every collection now has a "🗓️ Plan a week from this" button back to the planner.
- **API/agentic**: `api/v1/balance-buckets.json` (manifest-registered, records=11, stability stable) with enriched mapping (`category_name`, `bucket_label`, `bucket_glyph`); new draft-07 schemas `balance-bucket.schema.json` (record) + `balance-buckets.schema.json` (envelope) following the collection two-file convention; `scripts/build.py` asserts all 11 categories map exactly once. AGENT.md: week-planner input shape rewritten for 2.0 + new **Workflow 4** (programmatic week build, plan payload shape, `?plan=` link, `.ics` recipe); API.md: `GET api/v1/balance-buckets.json` + schema sections, planner deep links; `llms.txt`/`llms-full.txt` regenerated (no stale links). New skill **`skills/balanced-week-builder.md`** (11 skills registered) in the standard format.
- **Guardrails kept**: all picks resolve to real activity ids (asserted by build + headless tests); original descriptions untouched; only your own ratings shown; semantic HTML + ARIA + keyboard + `prefers-reduced-motion` (existing global rule covers the new bits); mobile-first, existing design system untouched.

**Validation (wave 10):**
- `scripts/build.py`: BUILD OK — 238 activities, 238 pages rendered, 11 categories, 8 collections, **11 balance-bucket mappings**, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — 40 checks incl. new endpoint schema validation, count 11 vs 11, 11 mappings / every category mapped once / fixed bucket vocab / 5 bucket defs / mapping labels match defs; link check 244 pages 0 broken; llms.txt links resolve
- `node --check`: planner-core.js, planner.js, collections.js, test-planner-core.js — clean
- `scripts/test-planner-core.js` (headless, new): 39 assertions pass — pool filter semantics, week respects constraints/no-repeats/prep cap, seeded determinism, collection seed placement + bogus-id drop, balance math, bucket coverage of all 238, warnings (movement/calm-heavy warn, balanced day quiet, no-calm 3-slot warns), swap (fresh id, null when exhausted), fillGaps, `.ics` (VEVENT count, DTSTART format, Monday lands on the right date, CRLF), plan encode/decode round-trip, import drops unknown ids + bad day names
- `planner.js` UI smoke test (fake-DOM, headless): 15 checks pass — generate renders 5 day cards + week balance + 10 slots + 6 meters, swap buttons present, surprise-fill no-op message, save→localStorage round-trip with real ids, copy plan link, `.ics` download anchor, `?plan=` import (dropped id noted), `?from=collection:rainy-day-rescue` seeding
- DOM id cross-check: all 28 `getElementById` ids in planner.js exist in planner.html

**Wave 10 push resolution:** local commit `da736fa` pushed via `gh-push.py` (20 files, 20 blob uploads, first attempt, exit 0, ~26s) — remote commit `60e7f0df277d148dde3d854d4b83bbaa31248cd4`. Verified via GitHub API: commit exists, `main` HEAD points at it, recursive remote tree (320 files, not truncated) contains `assets/planner-core.js`, `data/balance-buckets.json`, `api/v1/balance-buckets.json`, both new schemas, `scripts/test-planner-core.js`, `skills/balanced-week-builder.md`, the rewritten `planner.html`/`assets/planner.js`, and updated `WAVELOG.md`/`AGENT.md`/`API.md`.

## Wave 9 — 2026-10-11 — Curated collections (content + browse feature wave)

**What shipped:**
- **8 launch collections** (`data/collections.json`, hand-curated from the 238 — 93 picks total, every id real): 🌧️ **Rainy-day rescue** (12), 👋 **First day of the program** (12), ⏱️ **Last 10 minutes** (10), 🚌 **Field-trip bus ride** (12), 🆘 **Sub Tub essentials** (11 — ties to the Sub Tub kit), ❄️ **Winter party night** (12 — ties to the winter pack / Party Planner winter theme), ⚡ **No-prep lifesavers** (12, all no-prep), 🧘 **Calm-down corner** (12). Each pick carries a curator's one-line "why this one" note; each collection a "when to reach for it" blurb.
- **Collections browse surface** (`collections.html` + new `assets/collections.js`, mobile-first): collection card grid with counts + age/time spans; each collection renders as a section with pick cards (curator note + **your own rating badges** — "⭐ 4★ — your rating", `localStorage` only, never aggregates), a "pairs with" tie-link for the Sub Tub / Winter Party collections, per-collection **🖨️ Print this collection** (print-one via `@media print` + `afterprint` cleanup) and **📋 Copy this collection** (wave-7 text pattern + curator notes + your ratings). Hash deep links (`collections.html#winter-party-night`) open a single-collection view with an "← All collections" back link.
- **API**: `api/v1/collections.json` (manifest-registered, records=8, stability stable) — records carry `id`, `title`, `glyph`, `when_to_use`, `picks[]` (`activity_id` + `curator_note`), computed `age_span`/`time_span`, and `page` deep link. New draft-07 schemas: `api/v1/schema/collections.schema.json` (envelope) + `api/v1/schema/collection.schema.json` (record), following the activity/category two-file convention.
- **Cross-links**: planner → "📚 Start from a curated collection"; sub.html → Sub Tub essentials collection; party.html → Winter Party Night collection; collections page → back to sub.html / party.html for the two tied collections. Nav gains "Collections 📚" on all 6 page shells (incl. the 238 generated activity pages).
- **Docs**: AGENT.md key-endpoints table row + "Curated collections (wave 9)" section; API.md `GET api/v1/collections.json` section + record/envelope schema mentions; `llms.txt` tools line; `sitemap.xml` gains `collections.html`.
- **Guardrails**: `scripts/build.py` asserts 8 collections and that every pick resolves to a real activity id (build fails otherwise); `scripts/check_api.py` re-checks counts, 8–12 picks, pick resolution, and a curator note on every pick.

**Validation (wave 9):**
- `scripts/build.py`: BUILD OK — 238 activities, 238 pages rendered, 11 categories, **8 collections**, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — new endpoint validates against `collections.schema.json`, count 8 vs 8; collections: 8 collections / unique ids / 8–12 picks each / **all 93 picks resolve to a real activity id** / curator note on every pick; link check 244 pages 0 broken; llms.txt links resolve
- `node --check`: assets/collections.js + all 5 existing assets — clean
- Logic test (node): computed age_span/time_span in the API match the picks; no-prep-lifesavers is 100% no_prep; last-10-minutes all run cold at ≤15 min floors; winter-party-night picks all winter-tagged except winter-gingerbread-build (name is the tag — Paper Gingerbread Houses, holidays/crafts, wave-6 winter pack)
- Curator-note honesty check: every note is a one-line "why this one", no invented activities, original descriptions untouched

**Wave 9 push resolution:** local commit `77cca42` pushed via `gh-push.py` (260 files, first attempt, exit 0, ~5 min) — remote commit `6d675939d84d03636590438982cc7de9044129f1`. Verified via GitHub API: recursive remote tree (313 files, not truncated) contains `collections.html`, `data/collections.json`, `api/v1/collections.json`, `api/v1/schema/collections.schema.json`, `api/v1/schema/collection.schema.json`, `assets/collections.js`, `scripts/write_collections.py`, `WAVELOG.md`, and `AGENT.md`.

## Wave 8 — 2026-10-11 — Ratings + "top rated" (interactive tools wave)

**What shipped:**
- **Per-activity rating widget** — every `activity/<id>.html` page now has a "⭐ Tried this? Rate it" section (generated by `scripts/build.py`): a native 5-star radio group (fieldset + legend, arrow keys move / Enter/Space selects — no custom key handling), an optional one-line note, a "Save rating" button and "Clear my rating", plus an `aria-live="polite"` confirmation ("Saved — you rated this 4 of 5 stars"). All storage is `localStorage` only; the widget is `no-print`.
- **Reflection prompts** — after a rating is saved, 2–3 quick reflection questions appear ("What would you change next time?", "Which age band shone the most?", "Would you run it again?"), debounced autosave with the rating, exported by the planner's "📋 Copy my week".
- **Shared library `assets/ratings.js`** — `window.VaultRatings` (`getRating`/`setRating`/`clearRating`/`topRated(limit)`/`countRated`/`starsText`), key `activityvault.ratings.v1`, entry shape `{stars, note, reflections:{change,age_band,again}, ratedAt}`; sanitizes malformed entries, survives corrupt storage. Loaded (defer, before page scripts) on `index.html`, `planner.html`, `party.html`, and every activity page.
- **"Top rated" browse** — new "Your ratings" filter group on the browse page: "⭐ Sort by my rating" (rated first, best stars first; unrated sink to the bottom clearly marked "Not rated yet") and "⭐ My top 10" (rated-only top-10 view with a true deep link `index.html?view=top-rated`, which the browse page pre-selects). A banner states the honesty rule on every view: "These are *your* ratings, stored only in this browser. Activity Vault has no community ratings." Browse cards show "⭐ 4★ — your rating" badges; empty top-10 state explains how to rate. "📋 Copy collection" describes the rating view in its header.
- **Planner integration** — week planner slots show "⭐ You rated this 4★" (plus the note) on scheduled activities; "📋 Copy my week" exports each rated activity's stars, note, and all three reflections.
- **Party planner integration** — `pickStations` now orders by the user's own ratings first (unrated sink below every rated pick; no-prep/longest/id order kept within a rating); rated stations carry a "⭐ 4★ — your rating (picked first)" badge, the run sheet's copy line carries "(your rating: 4/5 stars)", and the status line says "Your top-rated stations went in first (ratings live only in your browser)".
- **Docs** — AGENT.md gains a "Personal ratings (client-side only)" section: the exact `localStorage` key and JSON shape, the `window.VaultRatings` API, the standing rule (only the user's own ratings, never aggregates — never invent an endpoint), and how each tool consumes ratings. No new API endpoint by design; `api/` untouched.

**Validation (wave 8):**
- `scripts/build.py`: BUILD OK — 238 activities, 238 pages rendered, 11 categories, 0 dupes, no warnings
- `scripts/check_api.py`: ALL CHECKS PASSED (schema, counts, vocabulary, 3 workflows, link check 243 pages 0 broken incl. the new `assets/ratings.js` src on 241 pages, llms.txt links resolve)
- `node --check`: assets/ratings.js, app.js, planner.js, party.js, sub.js + both inline activity-page scripts (copy-link + rating widget) — clean
- `ratings.js` logic test (node, stubbed localStorage): 12 assertions pass — round-trip, rejects stars=9/bad ids, topRated ordering + limit, clearRating, corrupt-storage recovery, hostile-entry sanitization
- Rating widget keyboard test (structural, no headless browser on this VM): 5 native `<input type="radio" name="av-rate">` in a `<fieldset>` with legend "Your rating (1 to 5 stars)" — native radio group semantics guarantee arrow-key movement and Enter/Space selection; no `role="radiogroup"` fakery; 2 `aria-live="polite"` status regions (rating + reflection)
- Honesty-copy check: activity pages state "this browser only … no community ratings … every star on this card is yours"; browse banner states no community ratings / no averages

**Wave 8 push resolution:** local commit `b7d7ca1` pushed via `gh-push.py` (250 files, 250 blob uploads, ~4.5 min) — remote commit `56680976fd43d74be6a570cfe05b713103c9c443`. Verified via GitHub API: remote tree contains `assets/ratings.js`, the three wired HTML pages, `AGENT.md`, `WAVELOG.md`, and regenerated activity pages (306 files in tree).

## Wave 7 — 2026-10-11 — Print + share (interactive tools wave)

**What shipped:**
- **Printable cards, polished:** every `activity/<id>.html` now prints with a print-only deep-link footer ("Full activity card — <URL>"), a "🔗 Copy card link" button (clipboard + fallback, `Copied ✓` status), and the existing "🖨️ Print this card" affordance. `.print-only` utility added; `break-inside: avoid` kept.
- **"Print my week" card deck:** planner generates a print-only deck — one card per scheduled activity (day/slot, title, ages/group/time/prep/materials/steps facts, materials list, safety, deep-link URL), one per printed page (`break-before: page`). The compact on-screen grid is screen-only in print.
- **"📋 Copy my week":** shareable text export — day/slot, name, facts, deep-link URL per activity, for pasting into email/newsletters (clipboard + textarea fallback).
- **"📋 Copy this collection":** browse page copies the current filtered collection (filter description + name/facts/deep link per card). Single-tag views get a true deep link (`index.html?tag=<tag>`); richer mixes link `index.html` with the filter description.
- **"📋 Copy party plan":** full text run sheet — stations with card links, timed rotation, setup checklist, closing.

**Validation (wave 7):**
- `scripts/build.py`: BUILD OK — 238 activities, 238 pages rendered, 11 categories, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED (schema, counts, vocabulary, 3 workflows, link check 243 pages 0 broken, llms.txt links resolve)
- `node --check` assets/app.js, planner.js, party.js, sub.js: pass
- Print CSS reviewed by hand (no headless browser on this VM): `.print-only` hidden on screen / block in print, deck pagination, print URL footers; no animations in print styles
- `data/activities.json` untouched — validator vocabulary untouched

**Wave 6 push resolution:** wave 6 local commit `06daa8b` pushed via `gh-push.py` on retry (connection flapping: `RemoteDisconnected` on tree GET + blob POSTs across 3 attempts) — remote commit `72c8e163d1656bfdb4cdf2e4f42c9b1190af095f`, 53 files. Verified via GitHub API: remote tree contains all 10 `activity/*winter*.html` files.

## Wave 6 — 2026-10-11 — Winter/holiday seasonal pack (+25 → 238)

**What shipped:**
- **Winter seasonal pack** — 25 new original activities (`scripts/add_wave6.py`):
  winter crafts (homemade-christmas-ornaments, snowflake-paper-patterns,
  suet-cage-winter-feeder, ice-ornaments, winter-wreath-collage, cotton-ball-penguin,
  paper-mitten-match, gingerbread-shape-build), cozy indoor PE/movement
  (snowball-toss-math, animal-walk-relay, freeze-dance-winter), New Year reflection
  (year-in-review-quilt, resolution-ladder, midnight-countdown-rehearsal), winter
  nature walks (track-prints-detective, frost-observation, bark-and-branch-study),
  warm-drink science (dissolving-warm-drink-lab, temperature-melt-race), an arctic
  research jigsaw, and respectful Hanukkah/Kwanzaa learning crafts
  (hanukkah-counting-chain, kwanzaa-unity-garland — flagged as cultural,
  "classroom craft *about* the holiday, not a ceremony", no invented rituals).
  Two name collisions with earlier waves (pinecone-bird-feeders, new-year-time-capsule)
  were replaced with genuinely new activities, not merged over.
- **Tag vocabulary grown** — `season:winter`, `holiday:christmas`, `holiday:hanukkah`,
  `holiday:kwanzaa`, `holiday:new-year` added to the validator (`scripts/build.py`
  `TAG_IDS`/`TAG_LABELS`), the browse filter (`assets/app.js`), `api/v1/filters.json`,
  and the docs (`API.md`, `AGENT.md`). `scripts/check_api.py` now imports `TAG_IDS`
  from `build.py` (single source of truth) and derives expected counts from the
  payload instead of hardcoding "213".
- **RSS pipeline** — scan re-run: 0 new candidates, 0 pending. The wave-4 deferred
  item ("Homemade Christmas Ornaments for Kids to Make", Hands On As We Grow) is
  **accepted**: adapted into original words as `homemade-christmas-ornaments` with
  the source URL credited. Queue is empty (no pending/deferred).
- **Party planner winter preset** — `party.html` gains a theme picker (Halloween /
  Winter). Winter uses the `holiday:christmas`/`holiday:new-year`/`season:winter`
  pool, winter group names (Snowflakes, Penguins, Reindeer, Mittens, Icicles,
  Cocoa Bears), cozy-timed rotations (a 5-min ☕ warm-up break midway, so
  `round_min = floor((minutes − 15) / stations)`), and winter closings. Hero copy,
  run-sheet kicker/title, and plan meta all switch with the theme; Halloween
  behavior is byte-for-byte unchanged. AGENT.md party-planner section updated.
- **Sub Tub winter band** — 3 zero-prep, zero-material winter emergencies
  (`snowflake-mirror`, `winter-tall-tale`, `warm-up-countdown`) that flow
  automatically into the Sub Tub "nothing at all" tier across the PreK–K
  through grades 6–8 bands.
- **Week planner seasonal suggestions** — month-driven "This season in the Vault"
  strip on `planner.html` linking to `index.html?tag=<tag>` with live activity
  counts; `assets/app.js` now pre-selects a valid `?tag=` on load (new deep link).
- **Skills**: no new skill — merged into `skills/halloween-party-planner.md`
  (winter preset section, theme inputs, respectful Hanukkah/Kwanzaa framing rule)
  rather than duplicating.
- Docs: `API.md` counts 213→238 + tag lists, `AGENT.md` counts/tags/party-planner/
  week-planner sections, `README.md` 213→238; `llms.txt`/`llms-full.txt`/`sitemap.xml`
  regenerated (party tool line now theme-generic).

**Validation (wave 6):**
- `scripts/build.py`: BUILD OK — 238 activities, 238 pages, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — 238/238 records validate against
  schema; tags in vocabulary; workflow1: 29 matches; workflow2 (Halloween):
  pool 4 → 3 stations; **new** winter preset: pool 13 → 3 stations picked
  (resolution-ladder, snowball-toss-math, snowflake-paper-patterns); workflow3:
  10 distinct slots, 11 categories; link check 0 broken (243 pages);
  llms.txt links resolve (22)
- `node --check` clean on app.js, party.js, planner.js, sub.js; runtime smoke
  test of `party.js` render for both themes (DOM stub): Halloween 3 blocks, no
  break; winter 3 rounds + warm-up break, correct clock math

## Wave 5 — 2026-10-11 — Agent API excellence pass

**What shipped:**
- **`api/v1/index.json`** — new self-describing manifest, generated by `scripts/build.py`:
  every endpoint with title, description, schema URL, `updated` timestamp, record counts
  (213 activities, 11 categories, 10 skills), `stability` (`stable` / `internal`), and
  deprecation notes. `meta.version` `1.0.0` semver, `meta.generated` ISO-8601 UTC,
  `meta.source_snapshot` naming the exact source data.
- **`api/v1/skills.json`** — new skills registry generated from `skills/` frontmatter
  (id, description, file); 10 skills.
- **JSON Schema draft-07 for every endpoint** — new: `activities.schema.json`,
  `categories.schema.json` (payload envelopes), `filters.schema.json`, `index.schema.json`;
  kept `activity.schema.json` / `category.schema.json` (record types). All generated by
  build.py; all validating.
- **`AGENT.md`** — "how an agent uses this archive": base URL, endpoint table, activity
  record shape, exact filter semantics, planner input shapes (Sub Tub band→age mapping,
  party planner round/per-group math, week-planner dealing rules), and 3 end-to-end
  example workflows (rainy-day for 8-year-olds; Halloween party 24 kids/60 min; 4th-grade
  week plan). No auth/keys/rate limits; freshness notes.
- **`api.html`** — API docs page with shared conventions block, endpoint table, and a
  **Try-the-API console**: endpoint picker populated live from `api/v1/index.json`,
  fetch, pretty-printed JSON (200k-char display cap), graceful failure messages.
  Client-side, keyboard accessible (`aria-live` status), no animations.
- **Shared conventions block** added verbatim to `API.md` (same across all seven sites);
  API.md also documents the new endpoints + AGENT.md + console.
- **Skills gap-fill** — 2 new skills in standard format: `no-prep-rescue` (zero-prep,
  zero-material grab-and-go) and `outdoor-play-picker` (space/weather/energy matching);
  `halloween-party-planner` gained the missing `name`/`description` frontmatter.
  Registry now 10 skills; `llms.txt` Skills/API sections are generated from the live
  endpoint + frontmatter lists so they can't go stale.
- **New validator `scripts/check_api.py`** — validates every manifest-listed payload
  against its schema, checks counts/timestamps, validates all 213 records, asserts 0
  duplicate ids and tag-vocabulary compliance, executes the 3 AGENT.md workflows
  against the real local `api/v1` JSON, link-checks all pages, resolves all
  `llms.txt` links.
- No payload shape changes — `activities.json` / `categories.json` / `filters.json`
  byte-compatible with the site JS that reads them.

**Validation (wave 5):**
- `scripts/build.py`: BUILD OK — 213 activities, 213 pages, 0 dupes
- `scripts/check_api.py`: ALL CHECKS PASSED — schemas pass on every endpoint,
  213/213 records validate; workflow1: 28 matches (rainy-day/8yo/indoor/≤30min);
  workflow2: pool 4 → 3 stations picked (costume-category-vote, halloween-bingo,
  handprint-bat-garland), full 60-min timetable; workflow3: 10 distinct slots,
  11 categories covered; link check 0 broken (218 pages); llms.txt links resolve (22)
- Console inline JS: `node --check` pass

## Wave 4 — 2026-10-11 — Fall/Halloween seasonal pack (+37 → 213) + Party Planner + RSS review

**What shipped:**
- **Fall/Halloween seasonal pack** — 25 new original activities (pumpkin science, spooky-not-scary
  crafts, costume parade games, fall nature walks, party stations, Día de los Muertos respectful
  crafts): measure-the-pumpkin, pumpkin-seed-sprout-baggies, apple-browning-lab,
  fall-leaf-chromatography, leaf-animal-collage, paper-bag-ghost-puppets, handprint-bat-garland,
  spiderweb-plate-weave, papel-picado-banners, egg-carton-spider-craft, corn-husk-dolls,
  apple-print-painting, ghost-footprint-keepsake, fall-scavenger-bingo, build-a-scarecrow,
  leaf-collect-sort-science, scarecrow-dress-up-relay, costume-parade-pose-freeze,
  pin-the-hat-on-witch, glow-stick-ring-toss, pumpkin-roll-race, halloween-bingo,
  candy-corn-estimation-jar, costume-category-vote, ofrenda-memory-circle.
  Skipped 8 near-duplicate concepts already in the library (mummy-wrap-relay, spooky-story-circle,
  mini-pumpkin-bowling, sink-or-float, pinecone-bird-feeders, paper-plate-masks, leaf-rubbing,
  leaf-boat-races, baking-soda-volcano variants).
- **Season/occasion tags** — new optional `tags` field (`season:fall`, `holiday:halloween`,
  `holiday:dia-de-muertos`, `theme:spooky`), validated against a fixed vocabulary in
  `scripts/build.py`. New "Season / occasion" filter group in the browser (chips: 🎃 Fall,
  👻 Halloween, 💀 Día de los Muertos, 🕸️ Spooky), tag chips on cards + detail pages,
  `tags` multiselect in `api/v1/filters.json`, documented in API.md/PIPELINE.md.
  5 existing fall/Halloween activities retro-tagged.
- **Halloween class-party planner** (`party.html` + `assets/party.js`) — inputs (class size,
  minutes, stations, budget) → timed station-rotation plan from the seasonal pool, with
  rotation timetable, merged setup checklist, station cards, and a print-ready run sheet
  (`@media print`). Graceful warnings when stations outrun the time/budget. New nav link
  everywhere; sitemap + llms.txt updated.
- **RSS review queue cleared** — all 23 candidates reviewed: 12 accepted into the library
  (coping-strategy-cards, kindness-poster-campaign, winter-joke-slam, gratitude-door-decor,
  take-a-stand-debate, poetry-share-circle, pumpkin-letter-hunt, secret-code-decoder-wheels,
  expressionism-scream-art, dinosaur-pattern-blocks, masterpiece-coloring-gallery,
  continents-map-puzzle), each adapted in original words with an optional `source` credit link;
  10 rejected with reasons (contest announcement, book list, listicles, duplicates,
  near-duplicates of new items, state-specific pack, novel-unit tie-in); 1 deferred
  (Christmas ornaments → winter pack). Decisions logged in `pipeline/review-queue.json`.
- 8th skill: `skills/halloween-party-planner.md`. README/API.md counts → 213.

**Validation (wave 4):**
- `scripts/build.py`: BUILD OK — 213 activities, 213 pages, 0 dupes, tags/source schema pass
- `node --check` on app.js/party.js/planner.js/sub.js: pass
- Link check: 217 pages, 0 broken
- api/v1/activities.json: 213, all ids unique; tag counts: fall 18, halloween 15, spooky 6, día-de-muertos 2
- Party-pool simulation: default config (24 kids / 60 min / 3 stations / shoestring) → 6 candidates, OK; tight configs degrade to a helpful warning, not a broken plan
- Fixed a latent build bug: the render assertion used the raw name, failing on `&` (Leaf Collect & Sort); now checks the escaped name

## Wave 2d — 2026-10-11 — Final chunk7c merge (+10 → 176) + Sub Tub tool

Merged the last of the parallel `data/chunk7c.json` batch: 10/12 new (0 dupes).
`birthday-lineup` + `balloon-tennis` skipped — near-identical activities already exist
from the Wave 2 batch (same classic concepts); kept the existing pages, no near-duplicate
clutter. Total: **176 activities**.

New tool — **Sub Tub** (`sub.html` + `assets/sub.js`): the substitute-teacher rescue kit.
Inputs: grade band (PreK–K / 1–2 / 3–5 / 6–8), minutes to fill (15–90), materials on hand
(nothing / paper & pencils / basic art supplies / full classroom), location (indoors / outdoors OK).
Generates a sequenced print-ready emergency plan (opener → mains → calm closer, exact-minute
fill with a filler block for gaps) plus an editable "Dear sub" note template with copy button.
Screenshot-friendly one-pager via `@media print`.

Also: 7th skill `skills/sub-tub-rescue.md`; nav links (Browse / Plan my week / Sub Tub) on
index, planner, sub, and all activity pages; `sub.html` added to sitemap.xml and llms.txt
(new Tools section); README counts → 176.

## Wave 3 — 2026-10-11 — Sub Tub feature + chunk7c merge (166 → 176)

**What shipped:**
- **Sub Tub 🆘** — substitute-teacher rescue kit: `sub.html` emergency plan generator
  (grade band, minutes to fill, materials on hand, location → sequenced print-ready plan
  + "Dear sub" note template), new `skills/sub-tub-rescue.md`, nav links, sitemap entry
- Merged `data/chunk7c.json` (10 new, 2 id-collisions with wave-2 content skipped in favor
  of existing entries): human-bingo, desert-island-picks, paper-plate-skating,
  cup-song-circle, shadow-puppet-theatre, sock-puppet-studio, fortune-teller-folding,
  nature-weaving-looms, rock-cairn-balance, string-figure-games
- Total: **176 activities**, 11 categories

**Validation (wave 3):**
- `scripts/build.py`: BUILD OK — 176 activities, 176 pages, schema/ids/categories/ranges
- `node --check assets/app.js assets/planner.js`: pass
- Link check: 179 pages, 0 broken
- api/v1/activities.json: 176, all ids unique


## Wave 2c — 2026-10-11 — Merged parallel chunk7b (+12 → 166)

Merged the sibling's `data/chunk7b.json` (12 activities, same schema, 0 dupes).
Total: **166 activities**. Rebuilt + revalidated.

## Wave 2b — 2026-10-11 — Merged parallel chunk7 (+16 → 154)

A parallel builder was adding `data/chunk7.json` (16 activities, same schema) concurrently.
Merged with id-dedupe (16/16 new, 0 dupes), rebuilt, revalidated. Total: **154 activities**.
`data/chunk7.json` retained for provenance; the validator rejects duplicate ids, so any
re-merge would fail loudly rather than corrupt.

## Wave 2 — 2026-10-11 — Content expansion: 66 → 138 activities

**What shipped:**
- Merged 72 new original activities (researched from teaching blogs, described in our own words) into `data/activities.json` via `scripts/convert_wave2.py` (schema-converted from staged drafts; 17 near-duplicates of wave-1 activities skipped)
- New **Music & Rhythm** category (7 activities: cup rhythms, bucket drumming, rhythm name game, sound story, parody songs, dance tutorial, shaker instruments)
- Every new activity carries the full schema: safety note, setup, steps, easier/harder variations
- Regenerated: 138 activity pages, api/v1, llms.txt/llms-full.txt, sitemap.xml
- README counts updated (66 → 138, 10 → 11 categories)

**Validation (wave 2):**
- `scripts/build.py`: BUILD OK — schema, id uniqueness, category ids, ranges, all 138 pages rendered
- `node --check assets/app.js assets/planner.js`: pass
- Link check: 140 pages, 0 broken
- api/v1/activities.json count: 138


## Wave 1 — 2026-10-11 — Foundation build

**Commit:** `3590dd45edd9dad681f1c6bf0ede212b5aa20b17` (content) + WAVELOG commit below.

**What shipped:**
- Full site scaffold: `index.html` (filter browser), `planner.html` (plan-my-week), `assets/` (style.css, app.js, planner.js)
- `data/activities.json` source of truth — **66 activities**, all original descriptions of classic public-domain concepts
- `scripts/build.py` — schema validator + static generator (activity pages, api/v1, llms.txt, llms-full.txt, sitemap.xml)
- 66 generated `activity/<id>.html` detail pages, each print-ready as a one-page card
- `api/v1/`: activities.json, categories.json, filters.json, schema/activity.schema.json, schema/category.schema.json
- `llms.txt` + `llms-full.txt` (generated)
- 6 skills: activity-finder, week-planner, rainy-day-rescue, stem-demo-picker, icebreaker-chooser, quiet-focus-picker
- Docs: README.md, API.md, GO_LIVE.md, PIPELINE.md

**Activity count by category** (activities can carry multiple tags):

| Category | Count |
|---|---|
| Seasons 🍂 | 8 |
| Holidays 🎉 | 6 |
| Crafts ✂️ | 21 |
| STEM 🔬 | 11 |
| PE & Movement ⚽ | 14 |
| Team & Community 🤝 | 11 |
| Icebreakers 👋 | 11 |
| Outdoor 🌳 | 18 |
| Rainy Day 🌧️ | 12 |
| Quiet & Focus 🧘 | 19 |

45 of 66 activities are no-prep. 53 indoor-capable, 32 outdoor-capable.

**Validation (wave 1):**
- `scripts/build.py`: BUILD OK — schema, id uniqueness, category ids, ranges, all 66 pages rendered
- `node --check assets/app.js assets/planner.js`: pass
- Link check: 411 local links, 0 broken
- JSON parse: all api + data files parse
- Every activity renders: 66/66 pages contain their activity name

**Notes:** One build failure caught and fixed in-wave (`jump-rope-countdown` missing `setup` field) — validator did its job. Repo is private; GitHub Pages go-live deferred to user's call per GO_LIVE.md.
