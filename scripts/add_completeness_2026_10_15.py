#!/usr/bin/env python3
"""Completeness run 2026-10-15: the audit's sized build.

The landing record (~/workspace/fleet-ops/wave-engine/
landing-activity-completeness-2026-10-15.md) filed the research
BEFORE this script was written. Measured at base 01fa354:
747 activities / 222 photos / 105 with a source link.

Two builds, both sized from that matrix:

1. EIGHT NEW RECORDS aimed at the thinnest measured cells:
   music-rhythm is the thinnest drawer in the vault (50
   memberships, 44 primaries, source rate 8 percent) and takes
   three; rainy-day holds the thinnest in-band primary cells
   (21 in both the 6-8 and 9-11 bands) and takes two; the
   almanac cycle ahead reaches Spring (44 tags) and Summer
   (39) after a saturated Winter (120), one each; Diwali
   stands on the floor holiday shelf at 6 and takes one,
   lifting it to 7. Every new record carries its source from
   day one: the record-level promise kept at birth, not
   backfilled later. The eight form one collection at the
   validator's 8-pick minimum, no padding.

2. SOURCE BACKFILL on twenty existing records. Each mapping
   was verified live on 2026-10-15: the reference article
   exists, at the exact URL used, in the same source class
   the vault already cites (Wikipedia topic articles; one
   ThoughtCo how-to where no Wikipedia article exists, the
   same edu class as the vault's WeAreTeachers sources).
   Candidates that could not be verified were dropped, not
   guessed. No record that already carries a source is
   touched.

Deliberate neighbours, named on the wave discipline:
- first-rounds-singing-circle vs seasonal-rounds-phenology-
  wheel: that record is a phenology wheel of seasonal rounds
  (nature's cycle); this one is rounds in the musical sense,
  voices entering in canon. Different word, different room.
- ostinato-layer-band vs conducting-patterns-studio and
  part-singing-choir: those teach the conductor's hands and
  held vocal lines; this one builds a song from stacked
  repeating patterns, each layer owned by a small crew.
- tempo-parade vs loud-quiet-song-switch (volume, not speed)
  and silent-beat-march (keeping one beat in silence): the
  parade teaches tempo itself, bodies moving at the drum's
  speed, turtle to cheetah.
- domino-rally-design-studio vs rube-goldberg (a chain of
  different machines) and card-tower-challenge (building
  up): the rally is one repeated element, spacing and
  patience, engineered to fall.
- sock-bocce-indoor-league vs pumpkin-bowling and every
  relay: bocce is a precision roll toward a target ball,
  closest wins, played seated-friendly on a hallway court
  with soft sock balls that cannot hurt a wall.
- cup-anemometer-wind-lab vs wind-turbine-blade-trials
  (blades that do work) and wind-ribbon-watch (toddlers
  watching ribbons): the anemometer is a measuring
  instrument; the lab calibrates counts against the
  Beaufort scale and logs a summer week's wind.
- rainbow-flower-capillary-lab vs walking-rainbow-lab:
  that lab moves coloured water along paper towel bridges
  between cups; this one moves it up a living stem, and
  the flower itself keeps the record.
- floating-lights-diya-bowl vs clay-diya-pinch-pots (clay
  lamps pinched and dried) and paper-diya-lanterns (paper):
  the bowl is a finished festival display, LED lights
  floated on water among petals, no flame anywhere.

Photos: none added. The Commons download route was blocked
in this run's environment (shell egress proxy-times out);
the landing record states the gap honestly at G3 rather
than shipping file-less photo claims the validator would
reject. Text is original throughout; sources are cited as
links, never copied. No em dashes anywhere in this run's
writing.

Run once: dedupes by id, writes data/activities.json and
data/collections.json. Run scripts/build.py afterwards.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_winter import A, DATA

W = "https://en.wikipedia.org/wiki/"

PACK = [
    # ---------------- Music & Rhythm, ages 7-11 (drawer 50, source rate 8%) ----------------
    A("first-rounds-singing-circle", "First Rounds: Singing in Canon",
      "One song, many starting lines: the group learns to sing the same tune at different times and hears it turn into harmony.",
      ["music-rhythm", "team-community"], (7, 11), (8, 30), (20, 30), ["indoor"],
      ["no materials at all: voices only",
       "a set of three short rounds the leader knows cold (public-domain staples such as Row, Row, Row Your Boat and Frere Jacques work; pick ones your group already half-knows)",
       "floor markers or chairs in a circle, one spot per singer, so each entry group can see its own corner of the room"],
      False,
      "Arrange the circle and split it into three or four arcs before anyone sings; each arc is one entry group and will start the song at a different time. Choose the round with the group, not for them: offer two and let them vote, because a round only locks in when every singer owns the tune. Agree the entry signal now (the leader holds up one finger per group, in order) and the stopping rule (the leader shows a flat palm; everyone finishes the line they are on and stops together). Set the room's one law: nobody sings louder to fix a wobble; you fix a round by listening harder, not by shouting.",
      ["Sing the chosen round all together, in unison, twice through, until the tune sits in the room without the leader carrying it. Slow is fine. Boring is fine. This is the foundation pour and it cannot be rushed.",
       "Teach the entry map with hands before voices: the leader points to arc one, which hums the first line; points to arc two, which hums the first line while arc one hums the second. Walk the whole map humming, so the shape is understood before a single word is sung.",
       "First true entry: arc one sings line one alone. On the leader's signal, arc two enters at line one while arc one moves to line two. Let it wobble; wobbling is the sound of a group learning to hold its own line while another line happens beside it.",
       "Add the third arc on the next run. When all arcs are in, the room is singing one song in three places at once. Name what just happened, plainly: the same melody, started at different times, fitting together. That is a round, and musicians have built them this way for centuries.",
       "Run the full round three times through and end on the flat-palm signal. Ask each arc to describe what it heard from the arcs beside it; the answers teach more than another run would.",
       "Swap the arcs' entry order and run it again. The group that entered last now leads, and everyone learns the round is a structure, not a ladder: there is no best seat in a canon.",
       "Close by teaching the room one new round to take away, the simplest the leader knows, sung once in unison and once in two parts. The takeaway is the point: a round needs no instruments, no copies and no kit, only people who can hold a line."],
      "Two arcs only, and a four-line round the group already knows from younger years; enter on a drum tap instead of a finger signal if watching and singing at once is too much.",
      "Four arcs, a round in a minor key, and a student conductor: the conductor owns the entries, the tempo and the cut-off, and the room reviews the conducting the way it reviewed its own singing.",
      "Nobody sings alone at any point; every voice is always inside a group of voices. A singer who goes quiet mid-round simply rejoins at the next line: the structure holds them.",
      None, copy_free=True, no_elimination=True,
      why_it_works="Part-singing is the oldest documented form of group harmony teaching: a round asks for one melody learned once, then layers it against itself, so the harmony is built into the material rather than added by arrangement.",
      inclusion="Singers who do not use their voice can keep an arc's entry on a shaker or a tapped knee pattern that follows the same entry map; the canon works with any steady sound source. Keep arcs small enough that no singer is ever the only voice on a line."),
    # ---------------- Music & Rhythm, ages 11-14 (band primary 23, the thinnest in 12-14) ----------------
    A("ostinato-layer-band", "Ostinato Layer Band",
      "Build a whole song out of stubborn little patterns: each crew owns one repeating layer, and the layers stack into music.",
      ["music-rhythm"], (11, 14), (6, 24), (30, 45), ["indoor"],
      ["buckets, bins or sturdy boxes for low drums (one per low-layer player)",
       "shakers: sealed tubs with rice or beans inside (one per high-layer player)",
       "a set of pitched odds and ends if you have them: chime bars, a xylophone, or bottles filled to different water levels",
       "one phone or tablet per crew for a first listen-back recording (optional, and the crew's own device stays in the crew's hands)",
       "index cards and a marker per crew, for writing their pattern down in their own notation"],
      False,
      "Split the room into three or four layer crews before touching an instrument: lows (buckets), highs (shakers), mids (body percussion), and pitched (chimes or bottles) if the kit allows. Give each crew one job and one limit: invent a pattern of no more than eight beats that repeats exactly, and can be played for two minutes without stopping. Exact repetition is the whole discipline here: an ostinato is a pattern that refuses to change, and the music comes from what the other layers do around it. Agree the stack order now: lows enter first, one layer added every eight cycles, and the band ends by removing layers in reverse until only the lows remain.",
      ["Each crew builds its pattern in its own corner, quietly, testing the only question that matters: can we play this fifty times in a row without it drifting? A pattern that cannot survive repetition is not an ostinato yet; shorten it until it can.",
       "Notation round: each crew writes its pattern on a card in whatever symbols make sense to them (dots, slashes, words like tap tap rest). Crews swap cards and try to play each other's pattern from the card alone. Where the reading fails, the writing gets fixed. This is real composition paperwork, done in pencil.",
       "The stack: lows begin. Count eight cycles aloud, then the mids enter on the leader's nod, then highs, then pitched. Nobody speeds up. The leader's only job in the first full stack is to hold the tempo with a foot tap everyone can see.",
       "Hold the full stack for two minutes. It will feel long. That length is where the music lives: small accidents, a layer leaning on another, the room settling into the groove the patterns make together.",
       "The teardown: remove layers in reverse order, one every eight cycles, until the lows play alone and stop together on a counted final hit. A band that can end together has actually played together.",
       "Listen back to the recording if you made one, and let each crew name one thing another crew's layer did that made their own layer easier or harder to hold. Then run the stack once more with one change only: a new stack order, chosen by the crews.",
       "File the cards. A returning session starts from the filed patterns and adds a fifth layer or a bridge section where every layer drops out for four beats and re-enters, which is the oldest trick in this music and still works every time."],
      "Two layers only (lows and highs), four-beat patterns, and the leader counts every cycle out loud for the whole stack.",
      "Crews compose in different cycle lengths (a five-beat layer against the fours) so the stack drifts in and out of alignment; the band must hold it without a conductor, listening only.",
      "Turn every drum hit soft and close on a shared downbeat if the room gets loud; volume is a dial the band controls together, and blowing out the pitched layer helps nobody.",
      None, copy_free=True, no_elimination=True,
      why_it_works="Layered repetition is how a great deal of the world's music is actually built, from ground-bass traditions to modern loop-based production; learning it by stacking owned patterns teaches structure by doing, with no notation prerequisite.",
      inclusion="Every layer is a real musical job at every ability level: a player who can only strike on beat one of eight is the anchor the lows are built on. Offer seated positions and table-top drums freely; the stack does not care where a sound comes from, only that it repeats."),
    # ---------------- Music & Rhythm, ages 3-5 (band source rate 9%, photo rate 21%) ----------------
    A("tempo-parade-turtle-cheetah", "Tempo Parade: Turtle Slow, Cheetah Fast",
      "A drum sets the speed and little bodies learn it: creep like a turtle, scurry like a cheetah, and stop when the beat stops.",
      ["music-rhythm", "pe-movement"], (3, 5), (6, 20), (15, 20), ["indoor", "outdoor"],
      ["one hand drum, bucket or pot lid the leader can play at a steady speed",
       "a clear loop path around the room or yard, wide enough for slow giants and fast cheetahs to share",
       "two picture cards if you have them (a turtle and a cheetah) or two hand signs the group invents on the spot"],
      True,
      "Walk the loop path once with the whole group at an ordinary pace so every child knows the route before speed enters the game. Teach the two animal speeds standing still: turtle steps (tiny, heavy, slow, arms swinging low) and cheetah steps (light, quick, on the toes, quiet feet). Set the law of the drum before the first beat: feet follow the drum, and when the drum stops, bodies freeze. Practise the freeze twice with big praise; for this age the stopping is the skill, and the speed is the fun that teaches it.",
      ["Drum slow. The parade creeps the loop as turtles, and the leader names the speed out loud while it happens: this slow beat has a name musicians use, and the name is tempo. Slow tempo, turtle steps.",
       "Drum a little faster, walking pace. The parade walks as people, ordinary speed, and the leader changes the card or the hand sign so the room can see the speed change before they feel it in their feet.",
       "Drum fast. Cheetahs. Keep the fast stretch short (twenty seconds is plenty at this age) and end it with a drum stop and a freeze, every time, so fast never means out of control.",
       "Now the drum changes without warning: slow, fast, medium, stop. The leader watches feet, not faces: the win is a whole parade changing speed together within a few beats.",
       "Hand the drum to a child leader for one loop. The parade follows their tempo, including the stops. The child with the drum learns the other half of the lesson: a tempo is something you give a group, and a group is trusting you to give it clearly.",
       "Finish slow. One last turtle loop, slower and slower, until the drum fades to single taps and the parade melts down to sitting. Name the day in one line: we moved at the drum's tempo, slow like turtles and fast like cheetahs, and we stopped together."],
      "One speed change only (turtle and freeze), a shorter loop, and the leader drums beside the group rather than ahead of it.",
      "Add a third animal with its own in-between speed (a trotting horse works), and let children call the changes with the picture cards while the leader drums what they show.",
      "Feet stay on the floor at every speed: cheetahs run in place or along the path with walking feet if the room is excited or the floor is slick. Fast is a tempo, not a race.",
      None, copy_free=True, no_elimination=True,
      why_it_works="Tempo is the first element of music young children can control with their whole bodies; matching movement speed to a heard beat builds the steady-beat foundation every later music skill stands on.",
      inclusion="A child who moves by wheelchair or walker sets their own turtle and cheetah speeds on the same drum; the parade matches the drum, never each other. A child who finds drumming sounds hard can hold the picture cards and be the signal-keeper instead."),
]

PACK[0]["source"] = W + "Round_(music)"
PACK[1]["source"] = W + "Ostinato"
PACK[2]["source"] = W + "Tempo"

PACK += [
    # ---------------- Rainy Day, ages 6-9 (band primary 21, thinnest in 6-8) ----------------
    A("domino-rally-design-studio", "Domino Rally Design Studio",
      "One tile falls and tells the next: design a run with curves, splits and a finale, then earn the single push that sets it off.",
      ["rainy-day", "stem"], (6, 9), (2, 20), (30, 45), ["indoor"],
      ["a class set of dominoes or uniform blocks (books and wooden cubes work if they stand reliably; test one before promising forty)",
       "a hard, flat floor space per builder or pair, marked with tape so runs do not grow into each other's territory",
       "rulers or craft sticks for measuring gaps between tiles",
       "paper and pencil per builder for the run map: every design gets drawn before it gets built"],
      False,
      "Test the tiles before the session: stand ten in a row at one-finger gaps on your actual floor and push the first. If the chain stalls, the gaps shrink; the studio's first engineering fact is that spacing is a measurement, not a guess, and builders will discover their own floor's number. Mark each builder's territory with tape and set the studio law: hands in your own territory, and a fallen run is information, never a disaster. Every builder draws their run on paper first (a line, a curve, one split or climb if they are ambitious) because domino builders work from plans, and the plan is what gets graded when the floor disagrees.",
      ["Free building, ten minutes: stand tiles, push, watch, adjust. Builders find their floor's spacing number by experiment and write it on their map (my gaps are one finger, or two centimetres). Numbers found by falling tiles are remembered.",
       "Teach the two reliability tricks the professionals use: firebreaks (leave a removable tile every so often, so an accident only eats one section) and the test push (topple just the first section before building the rest). Builders add both to their maps.",
       "Design round: each builder or pair draws a run with one named feature: a curve, a split that falls two ways, a bridge of two books the chain climbs, or a finale (a tile that knocks a ball, rings a bell, or drops a flag). Features must be drawn to be claimed.",
       "Build to the map. When a section falls early, the builder rebuilds only that section (the firebreaks earn their keep) and notes on the map what changed: tighter gap, straighter line, slower hands.",
       "The gallery push: builders take turns. One push per run, given by its builder, and the room watches in silence until the last tile falls or stops. A run that stops gets one question from the room, answered from the map: where, and what will you change?",
       "Finale runs: anyone whose run fell entire may rebuild it joined to a neighbour's run, making the room's first two-builder chain. End the studio with every map filed; a returning studio starts from filed maps, not from memory."],
      "Straight lines only, ten tiles, gaps measured with a craft stick laid flat between tiles so spacing is a tool, not a judgement.",
      "Scoring by reliability: builders predict their run's fall count in writing before the push (all 60, or 45 of 60), then compare. Add a timed element only for builders who ask for it: longest run standing in fifteen minutes.",
      "Tiles and blocks stay on the floor; nothing is thrown, ever, and a builder who is frustrated steps back to their map rather than sweeping a run. Crawling and kneeling space is part of the territory marking.",
      None, copy_free=True, no_elimination=True,
      why_it_works="Domino toppling is applied physics a child can see: spacing, friction and energy transfer decide whether the chain lives, and the plan-build-test loop is the engineering cycle at tabletop scale.",
      inclusion="Builders can work seated at a low table with tiles on a tray rimmed to catch falls; a partner can stand tiles to a builder's map and measurements, with the design and the push belonging to the map's owner."),
    # ---------------- Rainy Day, ages 9-12 (band primary 21, thinnest in 9-11) ----------------
    A("sock-bocce-indoor-league", "Sock Bocce: Indoor Court League",
      "The ancient lawn game moves indoors: soft sock balls, a hallway court, and points for whoever rests closest to the little ball.",
      ["rainy-day", "pe-movement"], (9, 12), (4, 16), (25, 40), ["indoor"],
      ["eight sock balls: clean socks rolled tight and tied or taped into balls, four in each of two colours or patterns",
       "one small target ball (a foam ball, a balled pair of socks in a bright colour): the pallino",
       "masking tape for the court: a foul line at each end of a hallway or cleared floor lane, roughly six to ten metres long",
       "a tape measure or a length of string for the close calls, and a score card and pencil"],
      False,
      "Roll the sock balls before the session and throw out any that come undone; a league ball must survive a wall bounce. Tape the court: two foul lines, and a centre line. Explain the shape of the game in one breath before dividing teams: we roll toward the little ball, closest ball scores, and the team that scored throws the little ball next round. Set the indoor law now: every roll is underarm, along the floor, at a speed a library would allow. Bocce is a game of touch, not power, and the sock balls enforce it kindly.",
      ["Teams of two to four. One player tosses the pallino down the court; it must cross the centre line to count. If it does not, the other team tosses it. Wherever it stops is the target for the round.",
       "The team that tossed the pallino rolls the first ball, trying to rest it as close to the pallino as possible. Then the other team rolls, and keeps rolling until one of its balls sits closer than the first team's best, or it runs out of balls. Closest team always waits; the team that is behind does the rolling. This rule is the game's whole tactics lesson.",
       "Rolls may nudge: a rolling ball can move the pallino or knock an opponent's ball away, and all of it counts. Court surfaces make sock balls wobble and stop short; players learn their lane the way lawn players learn a green.",
       "When all eight balls are rolled, score the round: the team with the closest ball scores one point for every ball of theirs that sits closer than the other team's best ball. Measure the close ones with the string; arguing about a measurement is a sign the game is working, and the string settles it.",
       "Play rounds to a league target (first to eight works in a session) rotating who tosses the pallino: the scoring team tosses it, so a comeback always starts with the target in your hand.",
       "Close with the captains' challenge: each captain picks their team's single best resting position from the whole match and the room votes on the finest roll of the day, judged on touch, not luck. File the score card; a league that keeps its card can run a season."],
      "Shorten the court to four metres, use three balls per team, and let every roll be a practice roll until a player asks for the real thing.",
      "Add the bank shot: one round per match must be scored off the wall (the roll must touch the side wall before resting). Captains may also call a declared target: name the exact spot, double points if the ball rests within a hand-span of it.",
      "Rolls stay on the floor and underarm; no throwing at any height. Players retrieve balls only when the round is scored and the court is called clear.",
      None, copy_free=True, no_elimination=True,
      why_it_works="Bocce has been played for centuries because its core skill, judging distance and touch under mild pressure, is learnable in one round and deepens for years; the behind-team-rolls rule keeps every player in the game until the last ball.",
      inclusion="The game plays identically seated: a chair at the foul line is a legal and classic position, and rolling ramps (a stiff card channel) are welcome equipment. Sock balls are silent and soft, suiting sound-sensitive rooms."),
    # ---------------- Summer STEM, ages 9-13 (season:summer shelf 39, thinnest season) ----------------
    A("cup-anemometer-wind-lab", "Cup Anemometer Wind Lab",
      "Build the weather station's spinning cups, count the turns, and turn a summer week of breezes into numbers you can argue with.",
      ["stem", "outdoor"], (9, 13), (3, 24), (40, 60), ["indoor", "outdoor"],
      ["four small paper or plastic cups per instrument, plus one coloured with a marker (the counting cup)",
       "two stiff straws or thin dowels per instrument, crossed and taped at the centre",
       "a push pin or nail, a pencil with an eraser top, and a bead, per instrument (the axle: pin through the straw cross, into the eraser, bead as spacer)",
       "a stopwatch or phone timer, and a wind log: date, time, place, turns in 30 seconds, and what the air felt like",
       "the Beaufort scale card: the class-agreed version, copied from a trusted weather source onto the log's cover (calm under 1, up to storm)"],
      False,
      "Build one instrument yourself before the session and spin it outdoors; a cup anemometer that wobbles or stalls teaches the lab's first lesson early, which is that axle friction is the enemy and the bead spacer is the fix. Agree the counting law now, in writing on the log's cover: count only the coloured cup passing one fixed point, count for exactly thirty seconds, count in pairs (one watches, one counts aloud), and log the place and the hour with every reading, because wind numbers without a place and an hour are rumours. Choose the lab's three stations (an open field corner, a sheltered wall, a doorway or gap between buildings) and mark them on a sketch map in the log.",
      ["Build: cups stapled or taped to the four straw ends, all openings facing the same way around the cross. That sameness is the entire invention: wind pushes the hollow side harder than the round side, so the cross turns, and the turning can be counted. Spin each finished instrument by blowing gently; fix wobbles before going out.",
       "Calibration by feel: at station one, take a reading and immediately write what the air did to your clothes, hair and the nearest leaves or grass. Then read the Beaufort card and find the row that matches what you felt. The instrument gives a number; the scale gives the number a meaning; the body checks both.",
       "Station rounds: every crew reads all three stations inside one fifteen-minute window, so the comparison is honest. Log turns per thirty seconds at each station, twice, and keep the lower-friction reading (the higher count) with a note if the two disagreed wildly.",
       "The map: crews transfer their numbers onto the sketch map and the room argues the pattern. Where was the wind fastest, and why there? Gaps between buildings squeeze air; open corners catch it; walls make eddies. A good lab ends with a claim the map supports and a claim it refuses to support.",
       "The week: the log stays open for five days of readings at the agreed hour. Crews predict tomorrow's ranking of the three stations each day, in writing, before reading. The week grades the predictions, and the final session names the room's most reliable station and its most surprising one.",
       "Close by retiring the instruments properly: repair one, file the log with the map, and write the lab's one-sentence finding on the cover (for example: the doorway beat the field four days out of five). Findings written on covers get read next summer."],
      "Build from a pre-made cross, count for a full minute (easier arithmetic), and read one station only, calibrating by feel and the Beaufort card.",
      "Convert counts to estimated wind speeds with a researched conversion the crew derives themselves: time a known walk, compare with a trusted weather reading for the same hour, and build the lab's own counts-to-speed table, errors and all.",
      "Pins and nails are handled at the build table only, points down in a cork when idle; instruments are carried by the pencil shaft, never swung. Outdoor rounds follow the site's weather rules: no lab in thunder weather, ever.",
      ["season:summer"], copy_free=False, no_elimination=True,
      why_it_works="The cup anemometer has measured wind since 1846 because it turns an invisible force into a countable rotation; calibrating counts against felt experience and a standard scale teaches what measurement is for.",
      inclusion="Counting, timing, logging and mapping are full lab roles for anyone who does not build; the coloured-cup counting method works by watching, listening for a partner's count, or tallying on a clicker."),
    # ---------------- Spring STEM, ages 6-10 (season:spring shelf 44) ----------------
    A("rainbow-flower-capillary-lab", "Rainbow Flower Capillary Lab",
      "White flowers drink coloured water and keep the receipt: watch a stem pull colour up into the petals, hour by hour.",
      ["stem", "seasons"], (6, 10), (3, 24), (25, 40), ["indoor"],
      ["white flowers with fresh, pale stems (carnations are the classic; white daisies or celery stalks with leaves also show the effect)",
       "clear cups or jars, one per colour, plus water and food colouring in strong colours",
       "a knife for the leader only, for fresh stem cuts and one split-stem demonstration",
       "a lab sheet per crew: flower drawing outlines to colour in at each check, with the hour written beside each one",
       "a camera if you have one: a photo at each check is the lab's cleanest record"],
      False,
      "Buy or pick the flowers the day before so stems can be cut fresh at setup; a stem cut hours early seals itself and drinks slowly, which is the lab's first honest variable. Set out one jar per colour with strong colouring (pale water gives pale results and disappointed scientists). Agree the checking rhythm before the first flower is cut: drawings or photos at the start, at one hour, at the end of the session, and first thing tomorrow. The lab's finding arrives overnight, so the promise to check in the morning is part of the experiment, and the lab sheets stay with the jars, not in bags.",
      ["Predict first, in drawing: each crew colours their lab sheet's flower the way they think it will look tomorrow, and signs it. A signed prediction is what turns looking into science.",
       "The leader cuts each stem fresh, at a slant, under water if possible, and each crew places their flower in its colour jar. One flower goes in plain water: the control, the lab's quiet hero, the one that proves the colour did something.",
       "The split-stem demonstration (leader-built): one stem split lengthways, half in red, half in blue. Its petals will show both colours, and crews draw their prediction for it too, because it looks like a trick and is not one.",
       "First checks: at one hour, crews look for the earliest signs (colour creeping up the stem's edges, the faintest petal blush) and record exactly what they see, including 'nothing yet', which is a real result and gets written down like one.",
       "The explanation, once the colour is visible: the stem is a bundle of narrow tubes, and water climbs narrow tubes and carries the colour with it, the same pull that lets a paper towel soak up a spill and a plant drink from its roots. Crews add the word to their sheets: capillary action, the climb of water in narrow spaces.",
       "Tomorrow's reveal: compare flowers to the signed predictions and the control. Crews grade their own predictions kindly and precisely (right colour, wrong pattern counts as half right and says why), and the split-stem flower gets the room's verdict: trick, or tubes?"],
      "Use celery stalks in coloured water (the tubes show as bright lines within the hour) and one check only, with the drawing done while the colour climbs.",
      "Run a race with variables: one flower in warm water, one in cold, one with a longer stem, one with a shorter; crews design the comparison, keep everything else the same, and report which variable mattered and how they know.",
      "Food colouring stains hands and clothes; aprons on, jars stay on trays, and nobody drinks from a lab jar, ever. The leader does all knife work, and flowers are looked at, not eaten.",
      ["season:spring"], copy_free=False, no_elimination=True,
      why_it_works="Capillary action is one of the few invisible forces that leaves a visible, timed trail; the colour arriving in the petals is direct evidence a child can check against a prediction they signed.",
      inclusion="Drawing the checks, mixing the colours to strength and reading the lab sheet aloud are full crew roles; the reveal works at any distance, and a magnifier at the stem makes the climbing colour lines visible to anyone who wants the close view."),
    # ---------------- Holidays / Diwali, ages 7-12 (holiday:diwali shelf 6, the floor) ----------------
    A("floating-lights-diya-bowl", "Floating Lights: A Diwali Diya Bowl",
      "For the festival of lights, a bowl of water carries the lights: LED diyas floated among petals, glowing without a single flame.",
      ["holidays", "crafts"], (7, 12), (4, 24), (25, 35), ["indoor"],
      ["a wide, shallow bowl or basin, glass or ceramic, one per table",
       "battery LED tea lights, one or two per maker (these are the diyas: all of the glow, none of the flame)",
       "fresh flower petals and a few whole small flowers for floating (marigolds are the festival's own flower where you can get them)",
       "water, a jug for filling, and a towel under every bowl",
       "optional: small floating decorations makers bring from the craft shelf: foil stars, paper petals, sequins that will be fished out and kept, never poured away"],
      False,
      "Learn before you light: this activity is taught the way the vault teaches every festival, by learning the real tradition first (see the steps) and inventing nothing. Traditional diyas are small clay oil lamps, lit for Diwali so that rows of light welcome good into the home and mark light standing against darkness; families place them at doors, windows and courtyards. Our bowls float the lights on water instead, a display many families also make, and every light in the room is battery LED: the festival's glow is welcome in a classroom precisely because the flame stays out of it. Fill bowls three-quarters full and set them on towels before any petals go in.",
      ["The story first, told plainly by the leader: Diwali is a festival of lights celebrated by Hindu, Jain, Sikh and some Buddhist families around the world. Its best-known story tells of a prince's long-awaited homecoming, when the people of his city lit rows of small lamps to light his way home. That is why the lamps matter: they are a welcome, made of light.",
       "Petal laying: makers scatter petals on the water a few at a time, learning the water's rules as they go (petals drift, cluster at edges, and spin slowly if the bowl is nudged). A crowded bowl looks poorer than a spaced one; makers edit their own bowls, removing as well as adding.",
       "Floating the lights: switch on each LED diya and set it on the water gently, base down. Some lights sit high, some low; makers arrange until their bowl carries its lights the way a doorstep carries lamps: in a row, a ring, or a path. All three patterns are traditional answers, and the maker chooses.",
       "Lights down: dim the room if you safely can, and walk the gallery of bowls in quiet. The reflections double every light, which is the floating display's own gift, and makers will point it out to each other without being asked.",
       "The maker's card: each maker writes a small card to stand by their bowl for the gallery: who or what their light is a welcome for. Cards are offered, never required, and a card that says only 'for everyone coming home' is complete.",
       "Closing law, kept kindly: bowls are emptied by straining the water through a sieve into the sink, so petals and decorations are kept or binned, never poured into drains or gardens. Lights are dried, switched off, and counted back into their box, ready to welcome again at the next festival."],
      "One shared bowl for the whole group, with makers taking turns to place a petal or a light; the gallery walk becomes a circle around a single glowing centre.",
      "Design brief: makers plan their bowl on paper first as a pattern (ring, path, cluster) with a reason, then build to the plan, and the gallery pairs bowls by pattern so makers can compare how different hands read the same brief.",
      "Water and batteries are kept apart except for the sealed LED units, which are checked before floating and retired if a seal is broken. No real candles or oil lamps are used at any point. Wet floors are towelled at once.",
      ["holiday:diwali"], copy_free=True, no_elimination=True,
      why_it_works="Festival learning lands when hands do what the tradition does: arranging lights as a welcome, after hearing why the welcome is lit, teaches the festival's meaning as an action rather than a fact.",
      inclusion="Placing petals and lights is gentle, seated, fine-motor work at one's own pace; a maker who prefers not to handle water can direct a partner's hands as the bowl's designer, and the gallery walk is step-free around table-height bowls."),
]

PACK[3]["source"] = W + "Domino_toppling"
PACK[4]["source"] = W + "Bocce"
PACK[5]["source"] = W + "Anemometer"
PACK[6]["source"] = W + "Capillary_action"
PACK[7]["source"] = W + "Diya_(lamp)"

COLLECTION = {
    "id": "filling-the-thin-drawers",
    "title": "Filling the Thin Drawers",
    "glyph": "\U0001F5C2\uFE0F",
    "when_to_use": "The completeness shelf, built from the vault's own census: rounds sung in canon and a band stacked from stubborn repeating patterns for the music drawer, the thinnest in the vault; a domino rally and an indoor sock-bocce league for the rainy-day cells that measured thinnest in two age bands at once; a cup anemometer logging a summer week's wind and a capillary flower lab for spring, the two thin shelves the almanac cycle reaches next; and a flame-free floating diya bowl that lifts Diwali off the floor shelf. Reach for it when a drawer feels thin because it is thin, measured, and now filled on purpose.",
    "picks": [
        {"id": "first-rounds-singing-circle", "note": "One tune, three starting lines: the same melody entered at different times turns into harmony with no instruments at all."},
        {"id": "ostinato-layer-band", "note": "A pattern that refuses to change, stacked four layers deep, is a whole song: each crew owns one layer and the band is the stack."},
        {"id": "tempo-parade-turtle-cheetah", "note": "The drum sets the speed and little bodies learn it: turtle slow, cheetah fast, and a freeze every time the beat stops."},
        {"id": "domino-rally-design-studio", "note": "Spacing is a measurement, not a guess: runs drawn first, built with firebreaks, and earned with a single push."},
        {"id": "sock-bocce-indoor-league", "note": "Closest to the little ball scores, and the team that is behind does the rolling: the ancient lawn game, hallway-legal."},
        {"id": "cup-anemometer-wind-lab", "note": "Four cups turn an invisible force into a countable number, and three stations on one map start an honest argument."},
        {"id": "rainbow-flower-capillary-lab", "note": "The flower drinks the colour and keeps the receipt: signed predictions graded against petals, with a plain-water control."},
        {"id": "floating-lights-diya-bowl", "note": "A welcome made of light, floated on water among petals: the festival's glow with no flame in the room."},
    ],
}

# Verified live 2026-10-15 (see landing record Part 1.2). Key: activity
# id gaining a source. Value: the exact verified URL.
BACKFILL = {
    "twenty-questions": W + "Twenty_questions",
    "two-truths-and-a-lie": "https://www.thoughtco.com/2-truths-lie-idea-list-1-31144",
    "paper-cup-telephone": W + "Tin-can_telephone",
    "friendship-bracelets": W + "Friendship_bracelet",
    "friendship-bracelet-basics": W + "Friendship_bracelet",
    "dream-catchers": W + "Dreamcatcher",
    "paper-mache-bowls": W + "Papier-m%C3%A2ch%C3%A9",
    "sun-print-art": W + "Sun_printing",
    "shadow-puppet-theatre": W + "Shadow_play",
    "shadow-puppet-matinee": W + "Shadow_play",
    "fortune-teller-folding": W + "Paper_fortune_teller",
    "cup-stacking": W + "Sport_stacking",
    "cup-stack-relay": W + "Sport_stacking",
    "sashiko-stitch-sampler-studio": W + "Sashiko",
    "rainstick-rhythm-circle": W + "Rainstick",
    "dreidel-spin-math": W + "Dreidel",
    "dreidel-spin-physics": W + "Dreidel",
    "kente-pattern-strips": W + "Kente_cloth",
    "celtic-knot-drawing-studio": W + "Celtic_knot",
    "kin-ball-first-session": W + "Kin-Ball",
}


def tokens(s):
    return set(re.findall(r"[a-z0-9]+", s.lower()))


def main():
    path = os.path.join(DATA, "activities.json")
    acts = json.load(open(path))
    by_id = {a["id"]: a for a in acts}
    before = len(acts)
    before_src = sum(1 for a in acts if a.get("source"))

    corpus = [(a["id"], tokens(a["name"] + " " + a["tagline"])) for a in acts]
    for rec in PACK:
        t = tokens(rec["name"] + " " + rec["tagline"])
        worst, wid = 0.0, None
        for oid, ot in corpus:
            j = len(t & ot) / max(1, len(t | ot))
            if j > worst:
                worst, wid = j, oid
        print(f"jaccard {rec['id']}: worst {worst:.2f} vs {wid}")
        assert worst < 0.55, f"near-duplicate: {rec['id']} vs {wid} ({worst:.2f})"
        assert len(rec["tagline"]) <= 160, f"tagline too long: {rec['id']}"
        assert rec.get("source", "").startswith("http"), f"no source: {rec['id']}"
        blob = json.dumps(rec)
        assert "\u2014" not in blob and "\u2013" not in blob, f"dash in {rec['id']}"
        print(f"words {rec['id']}: {len(blob.split())}")

    added = 0
    for rec in PACK:
        if rec["id"] in by_id:
            print("skip (exists):", rec["id"])
            continue
        acts.append(rec)
        by_id[rec["id"]] = rec
        added += 1

    filled = 0
    for aid, url in BACKFILL.items():
        rec = by_id.get(aid)
        assert rec is not None, f"backfill target missing: {aid}"
        if rec.get("source"):
            print("skip (already sourced):", aid)
            continue
        rec["source"] = url
        filled += 1
    print(f"backfilled sources: {filled}")

    json.dump(acts, open(path, "w"), indent=1, ensure_ascii=False)
    after_src = sum(1 for a in acts if a.get("source"))
    print(f"activities {before} -> {len(acts)} (added {added}); sourced {before_src} -> {after_src}")

    cpath = os.path.join(DATA, "collections.json")
    cdata = json.load(open(cpath))
    colls = cdata["collections"]
    if COLLECTION["id"] not in {c["id"] for c in colls}:
        colls.append(COLLECTION)
        cdata["collections"] = colls
        json.dump(cdata, open(cpath, "w"), indent=1, ensure_ascii=False)
        print(f"collection added: {COLLECTION['id']} ({len(COLLECTION['picks'])} picks); collections now {len(colls)}")
    else:
        print("collection exists, skipped; collections:", len(colls))


if __name__ == "__main__":
    main()
