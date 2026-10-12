#!/usr/bin/env python3
"""Wave 23: thin-spot fills — 12 teen-designed activities (ages 11-14) + 12
holiday-tag fills (3 each: july-4th, earth-day, easter, dia-de-muertos).

Completeness audit 2026-10-12: ages 13-14 covered by only 53 activities each,
all broad-band (5-14 etc.) — nothing designed FOR teens. Holiday tags thin:
july-4th (2), earth-day (3), easter (4), dia-de-muertos (3).

All original words per PIPELINE.md. Classic public-domain concepts described
in our own words. Near-duplicate screen against the full 497-activity library:
- lightning-debates vs take-a-stand-debate (9-12, stand-up agree/disagree):
  timed evidence debates, different format and age band — kept.
- escape-room-build: no escape-room concept in the library — kept.
- mini-podcast-studio: no podcast/audio-production concept — kept.
- public-art-proposal vs group-mural/class-mural-project (making murals):
  proposal + budget + pitch, different mechanic — kept.
- survival-rank-challenge: no survival-ranking concept — kept.
- board-game-prototype: no game-design concept — kept.
- peer-skill-swap vs dance-tutorial (teach a dance move): any-skill rotation,
  different scope — kept.
- improv-scene-showdown: no improv concept — kept.
- event-budget-challenge: no budgeting concept — kept.
- photo-story-sequence vs scavenger-sprint (photo scavenger list): narrative
  5-photo story arc, different mechanic — kept.
- town-hall-simulation vs community-helper-interviews (interview helpers):
  civics role-play hearing, different format — kept.
- water-filter-build: no water-filtration build — kept.
- flag-folding-ceremony: no flag-folding concept; the 13-fold ceremony is a
  real military tradition, presented respectfully — kept.
- parade-route-planners vs star-spangled-shoebox-parade (craft floats):
  route mapping + scale math, different mechanic — kept.
- independence-debate vs take-a-stand-debate: structured historical debate
  for teens, different format — kept.
- upcycle-invention-challenge vs recycled-paper-making (make paper):
  invention from recyclables, different mechanic — kept.
- classroom-water-audit vs earth-day-trash-audit (trash audit): water audit,
  different resource — kept.
- litter-tally-cleanup vs holiday-cleanup-crew-game (indoor party tidy):
  outdoor cleanup + data tally, different setting — kept.
- natural-dye-easter-eggs: no natural-dye concept — kept.
- wax-resist-easter-eggs vs natural-dye-easter-eggs (same pack): crayon-resist
  technique vs simmered pantry dyes, different technique — kept.
- kindness-egg-missions vs kindness-scavenger-hunt (find kind acts):
  egg hunt where eggs hold missions, different mechanic — kept.
- calavera-literaria-poems vs poetry-share-circle (share poems): the specific
  satirical-epitaph tradition of Dia de los Muertos, different form — kept.
- sugar-skull-decorating: no sugar-skull concept — kept.
- marigold-petal-path vs marigold-cempasuchil-flowers (make paper flowers)
  and ofrenda-memory-circle: laying the traditional petal path, different
  practice — kept.
Safety notes are practical only (allergy checks on food/egg activities, gloves
for litter, no locked rooms, filtered water not drinkable) — no medical claims
anywhere. Dia de los Muertos activities use respectful learning framing: real
traditions, no invented rituals (per the wave-20 marigold precedent).

Run once: dedupes by id, writes data/activities.json.
Run scripts/build.py afterwards.
"""
import json, os

from add_winter import A, DATA, ROOT


PACK = [
# ---------------- Teen-designed (12): ages 11-14 ----------------
A("lightning-debates", "Lightning Debates",
  "Two minutes a side, one judge's rubric — debate club energy with zero prep.",
  ["team-community"], (11, 14), (6, 30), (25, 45), ["indoor"],
  ["paper and pencils", "a timer (a phone works)"],
  False, "Write 6-8 debatable statements on slips — silly and serious mixed. Pick three judges.",
  ["Draw the first statement and assign sides by coin flip — you argue what you draw, not what you believe.",
   "Each side gets 3 minutes to prep: one claim, two reasons, one example. Write it tight.",
   "Debate: 2 minutes per side, alternating, no interrupting. The timer is the law.",
   "Judges score on the rubric: strongest reason, best rebuttal, clearest speaking. No score for loudest.",
   "New statement, new sides, new debaters. Everyone argues at least once before anyone goes twice."],
  "Use 1-minute rounds, or let teams prep together instead of solo.",
  "Add a cross-examination round, or require one cited fact per argument.",
  safety="Argue the point, never the person — the judge docks points for personal shots.",
  copy_free=True, no_elimination=True),

A("escape-room-build", "Escape Room Build",
  "Design the locks, hide the clues, then watch another team break out.",
  ["stem", "team-community"], (11, 14), (6, 30), (45, 90), ["indoor"],
  ["paper", "markers", "tape", "envelopes", "any classroom props", "combination locks (if available)"],
  False, "Split the group into 2-3 build teams. Each team gets a corner of the room and the prop box.",
  ["Each team invents a story: the room is 'locked' and the other team must earn the way out.",
   "Design 4-5 puzzles in a chain — each solved puzzle gives the clue to the next. Write the clue trail down.",
   "Build it: hide clues, set 'locks' (taped-shut boxes, guarded envelopes, combination locks if you have them).",
   "Playtest with your own team first — if you can't solve it, nobody can. Fix the unfair puzzles.",
   "Swap rooms: each team attempts another team's escape room while the builders watch silently and take notes."],
  "Build 3 puzzles instead of 5, or give every team the same starter puzzle.",
  "Add a red-herring clue, or require one puzzle that needs two people solving together.",
  safety="No locking anyone in a real room — 'locked' means a taped box or a guarded door, never a real lock."),

A("mini-podcast-studio", "Mini Podcast Studio",
  "Plan it, record it, play it back — a three-minute episode with a real audience.",
  ["quiet-focus", "team-community"], (12, 14), (3, 24), (40, 60), ["indoor"],
  ["a phone or tablet for recording", "paper for scripting"],
  False, "Charge the recording device. Find the quietest corner — closets and corners record best.",
  ["Pick a topic worth three minutes: a review, an interview, a debate, a story. One topic per group.",
   "Script the skeleton, not the sentences: hook, three beats, closer. Nobody reads a script word-for-word.",
   "Record in one take if you can — mistakes are part of the charm. Re-record only the truly broken bits.",
   "Play it back for the group. Everyone notes one thing that worked and one thing to fix.",
   "Final recordings play for the whole room. Vote on best hook, best interview question, funniest moment."],
  "Record a 60-second episode instead of three minutes, or interview a partner instead of scripting.",
  "Add theme music (hummed counts), or produce a two-episode series with a cliffhanger.",
  safety="First names only on recordings, and get permission before any recording leaves the room."),

A("public-art-proposal", "Public Art Proposal",
  "Design the mural, budget the paint, pitch it to the panel — real-world art, start to finish.",
  ["crafts", "team-community"], (12, 14), (3, 24), (45, 75), ["indoor"],
  ["large paper or poster board", "markers", "rulers"],
  False, "Pick a real wall or space in the building (even an imaginary commission works). Set a fake budget: $300.",
  ["Walk the space together — light, size, who passes it daily. Real proposals start with the site, not the sketch.",
   "Sketch the design to scale on the poster board. Every element needs a reason — color, subject, placement.",
   "Budget it: price the paint, brushes, and hours. The $300 cap is real — cut what doesn't earn its place.",
   "Pitch to the panel (the rest of the room): 3 minutes, design first, budget second, why-it-matters last.",
   "The panel votes with fake dollars — most-funded proposal wins. Discuss what the winners did differently."],
  "Skip the budget and pitch on design alone, or propose for a paper 'wall' instead of a real space.",
  "Require a community-input step (survey 10 people), or add a maintenance plan for year two.",
  safety="This is a proposal exercise — no painting any real wall without actual permission."),

A("survival-rank-challenge", "Survival Rank Challenge",
  "Ten items, one desert island — rank them, then see how the experts scored it.",
  ["team-community"], (12, 14), (4, 30), (20, 35), ["indoor"],
  [],
  True, "No setup — read the item list aloud or write it on the board. Split into teams of 3-4.",
  ["Set the scene: your boat sank, you're on a desert island, rescue comes in 30 days. Ten salvaged items.",
   "Read the ten items. Each team ranks them 1-10 by survival value — and must agree on every rank.",
   "Reveal the expert ranking one item at a time. Teams score the gap: 0 points for a match, up to 9 per miss.",
   "Lowest total gap wins. Then the real discussion: which item did everyone underrate, and why?",
   "Replay with a new scenario (arctic, desert) using the same ranking discipline."],
  "Use 6 items instead of 10, or let teams rank individually then compare.",
  "Teams defend their #1 pick in 60 seconds before the reveal, or design their own 10-item list.",
  copy_free=True),

A("board-game-prototype", "Board Game Prototype",
  "Design it, build it, playtest it — your game, someone else's table.",
  ["quiet-focus"], (11, 14), (2, 24), (45, 90), ["indoor"],
  ["cardboard or card stock", "markers", "a dice", "game pieces (buttons, beads, dried beans)"],
  False, "Set out the build supplies. Each pair or trio claims a table.",
  ["Pick the core tension first: race, battle, build, or bluff. Every game needs one.",
   "Write the rules on one page — if it doesn't fit, it's too complicated. Include how the game ENDS.",
   "Build the prototype ugly and fast: hand-drawn board, borrowed pieces. Pretty comes later.",
   "Swap tables: play someone else's game cold, using only their written rules. Note every confusion.",
   "Return with notes. Designers change exactly one rule based on playtest feedback, then play again."],
  "Design a card game instead of a board game, or playtest with the designer explaining.",
  "Add a second win condition, or require the game to teach something real.",
  safety="Small game pieces are a choking hazard for younger siblings — bag them at cleanup."),

A("peer-skill-swap", "Peer Skill Swap",
  "Everyone teaches a five-minute skill — you leave knowing twelve new things.",
  ["team-community"], (12, 14), (6, 30), (30, 60), ["indoor"],
  [],
  True, "No setup. Everyone needs one teachable 5-minute skill — give them a minute to think of theirs.",
  ["Go around: each person names a skill they can teach in 5 minutes. Juggling, knots, a card trick, a phrase in another language.",
   "Pair up. Teacher teaches, learner learns — 5 minutes, then switch roles.",
   "Rotate: find a new partner and teach YOUR skill again. Teaching twice makes it stick.",
   "After three rotations, everyone demos one skill they LEARNED (not their own) for the group.",
   "Vote: most surprising skill, best teacher, skill most likely to get used again."],
  "Do two rotations instead of three, or let pairs teach the whole group instead of rotating.",
  "Chain the skills (each learner must use a learned skill in their next lesson), or film 60-second tutorials.",
  safety="Skills must be classroom-safe — no fire, no sharp tools, nothing that would need a permission slip.",
  no_elimination=True),

A("improv-scene-showdown", "Improv Scene Showdown",
  "Suggestions in, scenes out — a bracket of improv games with the room as judge.",
  ["icebreakers", "team-community"], (11, 14), (6, 30), (25, 45), ["indoor"],
  ["slips of paper", "a hat or bowl"],
  False, "Collect suggestions on slips: locations, occupations, weird objects. Split into teams of 3-4.",
  ["Teach the three games: freeze (two actors, someone yells freeze and swaps in), yes-and story (build one sentence each), and prop switch (one object, ten uses).",
   "Round one: each team draws a suggestion and plays one game, 2 minutes. The room is the audience.",
   "Audience votes by applause after each round — loudest wins the round. Losing teams become the judges' panel.",
   "Semifinal and final: winners play a mashup — start with one game, the judges call the switch mid-scene.",
   "Champions get the golden prop (any silly object). Everyone plays every round — judges perform too."],
  "Play single rounds with no bracket, or let the teacher call all the switches.",
  "Add audience-thrown curveballs mid-scene, or require every scene to end with a moral.",
  no_elimination=True),

A("event-budget-challenge", "Event Budget Challenge",
  "Two hundred dollars, one party, zero excuses — plan the whole event on paper and defend every dollar.",
  ["stem"], (12, 14), (4, 24), (35, 60), ["indoor"],
  ["paper", "pencils", "calculators (optional)"],
  False, "Set the event: an end-of-term party for 30. The budget is $200 — write it big on the board.",
  ["List everything the party needs: food, drinks, decorations, music, games. No idea is too small to price.",
   "Price it with real numbers — look up actual store prices if you have a device, estimate honestly if not.",
   "Build the budget sheet. If you're over $200, cut — and every cut needs a reason the party still works.",
   "The twist: cut 20% more. What's the first thing to go? What's untouchable? Defend both.",
   "Each team pitches their final budget in 2 minutes. The room votes: best party per dollar wins."],
  "Raise the budget to $500, or plan for 10 guests instead of 30.",
  "Add a surprise mid-plan (it rains — move it indoors, reprice), or require a donation/sponsor line.",
  copy_free=True),

A("photo-story-sequence", "Photo Story Sequence",
  "Five photos, one story — no captions allowed until the reveal.",
  ["quiet-focus", "outdoor"], (11, 14), (2, 20), (30, 50), ["indoor", "outdoor"],
  ["a phone or tablet camera per group"],
  False, "Split into groups of 2-3, one camera each. Set the boundaries for where groups may roam.",
  ["Pick a story shape first: a chase, a mystery, a transformation, a day in the life. Five shots, in order.",
   "Plan all five shots before touching the camera — what's in frame, what's the turning point (shot 3 or 4)?",
   "Shoot in order, no reordering later. People, objects, shadows — everything is a prop.",
   "Swap cameras with another group. They arrange your five photos and guess the story — no hints.",
   "Reveal: the photographers tell the real story, then everyone votes on the best plot twist."],
  "Shoot three photos instead of five, or let groups add one caption per photo.",
  "Tell the story backwards (shot 5 first), or require the whole story to use no people.",
  safety="Stay in bounds and in pairs. No photos of strangers without permission."),

A("town-hall-simulation", "Town Hall Simulation",
  "A real local issue, assigned roles, one gavel — civics with the gloves off (respectfully).",
  ["team-community"], (12, 14), (8, 32), (40, 60), ["indoor"],
  ["role cards (or assigned roles)", "a gavel, real or improvised"],
  False, "Pick a real local issue (park hours, bike lanes, a school rule). Write role cards: residents, business owners, council members, press.",
  ["Assign roles — everyone gets one, including the press corps and the council. Read your role's stake in the issue.",
   "Ten minutes of prep: what does your character want, and what's their strongest argument? Write two points.",
   "The hearing opens: each side presents for 2 minutes, then open comment — one speaker at a time, gavel rules.",
   "Press corps asks the hard questions. Council members may interrupt (politely) for clarification.",
   "Council deliberates out loud, then votes. Debrief out of character: did the best argument win, or the loudest?"],
  "Use a silly issue (school mascot change) instead of a real one, or skip the press corps.",
  "Require written position statements, or hold a second session where everyone switches roles.",
  copy_free=True),

A("water-filter-build", "Water Filter Build",
  "Muddy water in, clear water out — engineer a filter from bottles and gravel.",
  ["stem"], (11, 14), (2, 24), (30, 50), ["indoor"],
  ["clear plastic bottles (tops cut off)", "gravel", "sand", "cotton balls or coffee filters", "muddy water (dirt stirred into water)"],
  False, "Cut the bottle tops off (adult job) and flip them neck-down into the bottle bottoms. Mix the muddy water.",
  ["Predict first: which layer catches the most dirt — gravel, sand, or cotton? Write it down.",
   "Build the filter: cotton at the neck, then sand, then gravel. Pour slowly — flooding ruins the layers.",
   "Catch the filtered water in a clear cup. Compare it to the muddy original, side by side.",
   "Redesign one layer — more sand? tighter cotton? — and run the same muddy water through again.",
   "Score clarity 1-5 each round. The winning design gets drawn on the board with its layer order labeled."],
  "Build one class filter together instead of per-group, or test with plain dusty water.",
  "Test three different layer orders head-to-head, or time how clarity changes over three pours.",
  safety="Filtered water is NOT drinkable — this is a clarity demo only. Everyone washes hands after."),

# ---------------- July 4th (3) ----------------
A("flag-folding-ceremony", "Flag Folding Ceremony",
  "Thirteen folds, each with a meaning — learn the ceremony the honor guard uses.",
  ["team-community", "holidays"], (10, 14), (4, 30), (20, 30), ["indoor"],
  ["a large flag or flag-sized cloth"],
  False, "Clear floor space. You'll need room for pairs to work with the full cloth spread out.",
  ["Learn the triangle fold first: lengthwise twice, then triangle-fold from the striped end, tucking the last bit in.",
   "Practice in pairs until every team can fold a clean triangle with no loose ends.",
   "Learn what the thirteen folds traditionally represent — each fold carries a meaning in the ceremony.",
   "Perform it: two folders, one reader. The reader names each fold's meaning as the folders work.",
   "Close with a moment of quiet. Discuss: why do ceremonies like this use such precise movements?"],
  "Fold a paper flag first to learn the pattern, or watch one clean fold demonstrated slowly.",
  "Research the fold meanings' history, or teach the ceremony to a younger group.",
  safety="Handle the flag with care — it never touches the ground.",
  tags=["holiday:july-4th"],
  inclusion="The 13-fold ceremony is a real military tradition. Present the fold meanings as tradition, not trivia."),

A("parade-route-planners", "Parade Route Planners",
  "Map the parade: scale the route, time the march, beat the road closures.",
  ["stem", "holidays"], (8, 12), (4, 24), (30, 45), ["indoor"],
  ["grid paper", "rulers", "pencils"],
  False, "Draw a simple town grid on the board (10x10 blocks) as the shared starting map.",
  ["Copy the town grid. Mark the start (the park) and the finish (the town square) — the parade must connect them.",
   "Plot the route: it must pass at least 3 'crowd zones' (mark them) and avoid 2 'closed streets' (mark those too).",
   "Measure the route in blocks, then scale it: 1 block = 200 meters. How long is the parade route, really?",
   "Time it: the parade moves at 3 km/h with a 10-minute stop at each crowd zone. When does it reach the square?",
   "Each team presents its route. Vote: shortest legal route, most crowd zones, best backup for a rained-out street."],
  "Use a pre-drawn route and just do the measuring and timing math.",
  "Add a second parade that must not cross the first, or price the barricades per block.",
  tags=["holiday:july-4th"], copy_free=True),

A("independence-debate", "Independence Debate",
  "1776, argued fresh — was independence the right call? You decide, with evidence.",
  ["team-community", "holidays"], (12, 14), (6, 30), (35, 55), ["indoor"],
  ["paper", "pencils"],
  False, "Write the question on the board: 'Was declaring independence in 1776 the right decision?' Assign sides.",
  ["Ten minutes of prep: each side lists its three strongest reasons. One must be about ordinary people, not just leaders.",
   "Opening statements: 2 minutes per side, no interrupting. State your case like you mean it.",
   "Rebuttal round: each side gets 3 minutes to answer the other side's best point directly.",
   "Judges (or the audience) vote — not on which side they agree with, but on which side argued better.",
   "Debrief: what fact surprised you most? Did arguing the other side change how you see it?"],
  "Debate a simpler question ('Should the colonies have paid the taxes?'), or prep as teams of four.",
  "Require one primary-source quote per side, or restage it as a Continental Congress vote.",
  tags=["holiday:july-4th"], copy_free=True),

# ---------------- Earth Day (3) ----------------
A("upcycle-invention-challenge", "Upcycle Invention Challenge",
  "Trash in, invention out — build something useful from the recycling bin.",
  ["stem", "crafts"], (8, 12), (2, 28), (35, 60), ["indoor"],
  ["clean recyclables (bottles, boxes, cans)", "tape", "scissors", "string"],
  False, "Rinse and dry the recyclables the day before. Sort them into material piles.",
  ["Pick a real problem first: desk clutter, a wobbly table, carrying supplies. Inventions need jobs.",
   "Sketch the invention before touching materials — what does each part do?",
   "Build it: 20 minutes, tape and string only for joining (no glue guns unless an adult runs them).",
   "Demo day: each team shows the problem, the build, and the one thing that broke during testing.",
   "Vote on most useful, most creative, and most likely to actually get used. Winners get displayed."],
  "Build from a pre-sorted kit of 5 items, or invent as a whole class with the teacher building.",
  "Require the invention to have a moving part, or ban tape and allow only folding and slotting.",
  safety="Clean everything first. No sharp metal edges — tape over any cut edges.",
  tags=["holiday:earth-day"]),

A("classroom-water-audit", "Classroom Water Audit",
  "Where does the water go? Measure it, map it, cut it.",
  ["stem", "team-community"], (9, 12), (4, 30), (30, 50), ["indoor"],
  ["paper", "pencils", "a measuring cup or marked bottle"],
  False, "List the room's water uses on the board to start: sink, water bottles, plants, cleaning.",
  ["Brainstorm every water use in the room and the building — drinking, washing, plants, mopping.",
   "Measure what you can: time the sink flow into the cup for 10 seconds, count bottle refills in a day.",
   "Estimate the rest honestly and total it: how many liters does this room use in a week?",
   "Find the biggest use. That's your target — one change that cuts it (shorter hand-washing, a plant-watering rota).",
   "Post the audit by the sink. Re-measure in a week: did the number move?"],
  "Audit just the sink, or use the teacher's estimates instead of measuring.",
  "Audit the whole school floor, or track a full month and graph the trend.",
  tags=["holiday:earth-day"], copy_free=True),

A("litter-tally-cleanup", "Litter Tally Cleanup",
  "Pick it up, tally it up — a cleanup that ends with real data.",
  ["outdoor", "team-community"], (6, 12), (4, 30), (30, 45), ["outdoor"],
  ["gloves (one pair per kid)", "trash bags", "pencils", "paper for tally sheets"],
  False, "Divide the grounds into zones, one per team. Hand out gloves and bags — gloves go on first.",
  ["Each team takes a zone and 15 minutes: pick up every piece of litter, big or small.",
   "Sort as you go: plastic, paper, wrappers, mystery items. Tally each category on the sheet.",
   "Weigh or count the bags. Total it up: which category won the ugly prize?",
   "Chart it on the board — a bar chart of what the grounds actually collect.",
   "Propose one fix for the worst category (more bins? a wrapper-free lunch day?) and pitch it."],
  "Clean one small zone as a class, or tally by team instead of by category.",
  "Repeat monthly and track the trend, or map litter hotspots on a grounds diagram.",
  safety="Gloves on the whole time. Never pick up anything sharp, rusty, or unidentifiable — flag it for an adult.",
  tags=["holiday:earth-day"], copy_free=True),

# ---------------- Easter (3) ----------------
A("natural-dye-easter-eggs", "Natural Dye Easter Eggs",
  "Onion skins, turmeric, red cabbage — the pantry dyes eggs better than the kit.",
  ["stem", "crafts"], (6, 12), (2, 24), (40, 60), ["indoor"],
  ["hard-boiled eggs", "onion skins", "turmeric", "red cabbage", "vinegar", "pots"],
  False, "Simmer each dye material in water for 20 minutes (adult job), strain, and add a spoonful of vinegar per cup.",
  ["Line up the dye baths and predict: which pantry item makes the strongest color? Write guesses down.",
   "Dip one egg per bath for 5 minutes. Pull, dry, compare — whose prediction held up?",
   "Experiment: dip half as long, twice as long, or dip in two baths in a row. Record every recipe.",
   "Try pattern tricks: wrap an egg in a rubber band or a leaf before dipping for resist designs.",
   "Line up the full spectrum and vote: most surprising color source wins."],
  "Dye with one bath as a class demo, or use pre-made dye baths and just do the dipping.",
  "Test pH with the red cabbage dye (it shifts color), or dye onion-skin patterns on paper first.",
  safety="Adults handle the hot dye pots. Check egg allergies before anyone handles or tastes the eggs.",
  tags=["holiday:easter"]),

A("wax-resist-easter-eggs", "Wax-Resist Easter Eggs",
  "White crayon, bright dye, big reveal — draw in secret, dye in color.",
  ["crafts"], (7, 12), (2, 24), (30, 45), ["indoor"],
  ["hard-boiled or blown eggs", "white crayons", "food-color dye baths in cups", "drying rack or egg carton"],
  False, "Mix the dye baths (food coloring + water + a splash of vinegar). Set out white crayons and drying space.",
  ["Draw on the egg with white crayon — invisible on the shell, which is the whole trick. Patterns, names, zigzags.",
   "Dip the egg in the lightest dye first. Count to 30, lift, and watch the white drawing appear.",
   "Add more crayon on the dyed egg, then dip in a darker color — the wax resists every layer.",
   "Dry each egg in the carton between dips so the colors don't smudge.",
   "Display the dozen: everyone guesses which egg used the most layers."],
  "Draw and dip in one color only, or decorate paper egg cutouts the same way.",
  "Try two-color resists with rubber bands, or dye a full ombre set from light to dark.",
  safety="Check egg allergies. Dye stains hands and clothes — smocks or old shirts.",
  tags=["holiday:easter"]),

A("kindness-egg-missions", "Kindness Egg Missions",
  "Every egg hides a secret mission — all kindness, zero pranks.",
  ["team-community", "holidays"], (5, 10), (4, 30), (20, 35), ["indoor", "outdoor"],
  ["plastic eggs", "paper slips", "pencils"],
  False, "Cut paper slips to fit the eggs. The teacher vets every mission slip before it goes in an egg.",
  ["Everyone writes one secret kindness mission on a slip: 'compliment someone's shoes,' 'help carry something heavy.'",
   "Fold each slip into a plastic egg. Mix them up — nobody hunts their own egg.",
   "Hide the eggs around the room or yard. Hunt! One egg per kid to start.",
   "Open your egg and read the mission. Complete it before the timer runs out — quietly, like a secret agent.",
   "Circle up: share what your mission was and how it landed. The best missions go on the board."],
  "The teacher pre-writes all the missions, or hunt in pairs.",
  "Run it as a week-long game (one mission egg per day), or let kids design missions for another class.",
  safety="Missions must be kind and safe — the teacher vets every slip before it goes in an egg.",
  tags=["holiday:easter"], no_elimination=True),

# ---------------- Dia de los Muertos (3): respectful learning framing ----------------
A("calavera-literaria-poems", "Calavera Literaria Poems",
  "Witty verses about the living, written for the dead — Mexico's playful poetic tradition.",
  ["quiet-focus", "team-community"], (9, 14), (2, 30), (30, 50), ["indoor"],
  [],
  True, "No setup. Explain the tradition first: calaveras literarias are satirical epitaph poems, written about the living with humor and affection.",
  ["Read one classic calavera aloud (translated) — notice the tone: teasing, never cruel; the subject is always in on the joke.",
   "Each writer picks a willing subject — a classmate who agrees, a teacher, a famous figure. No unwilling subjects, ever.",
   "Draft 4-8 rhyming lines: the 'skeleton' comes for the subject in a funny, specific way (late for everything, steals the erasers).",
   "Trade drafts with a partner: does it tease with affection? Cut any line that punches down.",
   "Read them aloud in a circle. The subject gets the final bow — and keeps the poem."],
  "Write 4 lines instead of 8, or write about a fictional character instead of a real person.",
  "Illustrate the calavera, or perform it as a two-voice reading.",
  tags=["holiday:dia-de-muertos"], copy_free=True,
  inclusion="Calaveras literarias are a real Mexican literary tradition — playful epitaphs for the living that celebrate life. The humor is affectionate; the dead are honored, never mocked."),

A("sugar-skull-decorating", "Sugar Skull Decorating",
  "Bright icing, bold patterns — decorate calaveras de azucar the traditional way.",
  ["crafts"], (7, 12), (2, 24), (30, 50), ["indoor"],
  ["sugar skull shapes (store-bought or salt-dough)", "icing tubes or paint pens", "sequins (optional)"],
  False, "Set out the skull shapes and decorating supplies. Cover tables — icing travels.",
  ["Learn first: sugar skulls are cheerful offerings for Dia de los Muertos, honoring real loved ones — bright, never spooky.",
   "Plan the pattern on paper: symmetric designs work best — flowers around the eyes, hearts on the forehead.",
   "Decorate: outline first, then fill. Bright colors, bold shapes — traditional skulls are joyful, not scary.",
   "Add the name across the forehead if you like — traditionally the name of someone being remembered.",
   "Display them together as a class ofrenda-style shelf. Share: who would you dedicate yours to, and why?"],
  "Decorate paper skull cutouts instead of 3D shapes, or work in pairs on one skull.",
  "Research regional skull styles, or make salt-dough skulls from scratch a day ahead.",
  safety="Decorated sugar skulls are for looking, not eating, unless they're food-safe — check before tasting.",
  tags=["holiday:dia-de-muertos"],
  inclusion="Sugar skulls (calaveras de azucar) are a real Dia de los Muertos tradition — cheerful remembrances of loved ones. Frame the craft as honoring, not Halloween-spooky."),

A("marigold-petal-path", "Marigold Petal Path",
  "Lay a path of marigold petals — the traditional welcome for returning spirits.",
  ["team-community", "outdoor"], (6, 12), (4, 30), (20, 30), ["outdoor"],
  ["marigold petals (real or tissue-paper)"],
  False, "Gather petals into baskets, one per small group. Choose the path: a hallway, a garden bed edge, a classroom aisle.",
  ["Learn the tradition: on Dia de los Muertos, cempasuchil petal paths guide loved ones' spirits home — a real practice of remembrance.",
   "Lay the path together, petal by petal, in a winding line. No rushing — the laying is the activity.",
   "Walk the finished path quietly, single file. Notice the color, the scent, the shape you made together.",
   "At the end, each person shares one happy memory of someone they miss — one sentence is plenty.",
   "Gather the petals gently afterward for compost or the art bin. The path was temporary; the memory isn't."],
  "Lay a short tabletop path instead of a walking one, or use paper petals indoors.",
  "Pair with the class ofrenda, or map the path as a drawn design first.",
  tags=["holiday:dia-de-muertos"],
  inclusion="Petal paths of cempasuchil are a real Dia de los Muertos practice — marigolds guide spirits home. Present it as remembrance, calm and respectful."),
]


def main():
    acts = json.load(open(os.path.join(DATA, 'activities.json')))
    have = {a['id'] for a in acts}
    new = [a for a in PACK if a['id'] not in have]
    skipped = [a['id'] for a in PACK if a['id'] in have]
    for a in new:
        assert len(a['tagline']) <= 160, f"tagline too long ({len(a['tagline'])}): {a['id']}"
        assert len(a['steps']) >= 3, f"fewer than 3 steps: {a['id']}"
        assert a['variations']['easier'] and a['variations']['harder'], f"missing variation: {a['id']}"
        assert a['age_min'] <= a['age_max'], f"bad age range: {a['id']}"
    # near-duplicate screen: token Jaccard on name+tagline+first step vs library
    import re
    def toks(a):
        s = (a['name'] + ' ' + a['tagline'] + ' ' + a['steps'][0]).lower()
        return set(re.findall(r'[a-z]{4,}', s))
    for a in new:
        ta = toks(a)
        for b in acts:
            tb = toks(b)
            j = len(ta & tb) / max(1, len(ta | tb))
            if j >= 0.55:
                raise SystemExit(f"NEAR-DUPE: {a['id']} vs {b['id']} (jaccard {j:.2f})")
    acts.extend(new)
    json.dump(acts, open(os.path.join(DATA, 'activities.json'), 'w'), indent=1, ensure_ascii=False)
    print(f"wave 23: +{len(new)} activities ({len(acts)} total), skipped dupes: {skipped}")


if __name__ == '__main__':
    main()
