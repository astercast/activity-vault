#!/usr/bin/env python3
"""Wave 30: Little Hands, Just Three — the different kind of wave.

Wave 29's honest assessment named this wave outright: the age-3
headline (58 against 160 at age 4) "is structural — the archive's
centre of gravity is ages 5-12 — and closing it would take a
different kind of wave (records banded 3-only), not another shelf
of this kind." Four waves of broad early-years records (3-5 / 3-6)
raised age 4 by exactly as much as age 3 every single time. This
wave is the different kind: twelve records banded 3-3 — written
for the youngest room only, at the size a three-year-old year
actually is.

Why 3-only is an honest band here, not a trick: these are the
activities whose whole design is a three-year-old moment — one
shake of one tambourine passed hand to hand, a raindrop followed
down a window with one finger, lids big enough for a whole palm.
They are short (<= 20 minutes), adult-led, big-piece, one-rule
records, and the band says so plainly instead of pretending a
four-year-old room needs them. Age 4 has 160 records; it does not
miss these twelve. The result, asserted in the wave log: age 3
58 -> 70, age 4 unchanged at 160, the headline gap 102 -> 90 —
the first wave in five that actually narrows it.

Measured before this wave (primary category = categories[0],
records covering age 3): holidays / rainy-day / team-community
were the floor at 4 each; seasons / stem / icebreakers / outdoor /
music-rhythm 5 each; crafts 6, pe-movement 6, quiet-focus 9.
This pack gives one record to every one of the 11 categories —
so the floor rises 4 -> 5 everywhere — plus a second rainy-day
record, the thinnest primary category on the whole shelf
(25 records total against quiet-focus's 54).

Same design rules as waves 26-29, tightened by the band:
age_min 3 AND age_max 3, runs <= 20 minutes, big pieces, ONE
rule per game, the adult as a player.

Near-duplicate screen: token Jaccard >= 0.55 against every
existing name+tagline is asserted below and fails the run.
Closest deliberate neighbours, kept on purpose:
- felt-tree-one-by-one vs ornament-geometry-stars (6-12, folded
  paper geometry) and christmas-light-stencil-art: big soft felt
  pieces pressed onto a low felt tree by a whole palm — no
  folding, no cutting, the placing IS the decorating.
- big-magnet-wand-sticks vs magnetic-scavenger-hunt (5-10, a
  room hunt with a sort-and-debrief): no hunt, no vocabulary
  lesson — one wand, big lids, "it stuck / it didn't", sorted by
  what happened in your own hand.
- blanket-carry-teddy-to-bed vs blanket-ball-bounce-together
  (wave 28, keeping a ball low on a shared blanket) and
  toy-wagon-pull-together (wave 29, pulling a loaded wagon):
  here the blanket is a stretcher held still and low, the teddy
  is a passenger who must not be woken, and arriving is tucking
  in — carrying, not bouncing or pulling.
- name-echo-two-claps vs rhythm-name-game (5-12, rhythm
  patterns built on names) and hello-ball-greetings (wave 26,
  a rolled ball carries the greeting): no ball, no pattern —
  say the name, hear the whole room say it back, two claps.
- one-shake-pass-around vs jingle-bell-rhythm-band (4-10,
  bracelets + a built 4-bar piece) and knee-drum-copycat
  (wave 27, tapped patterns): ONE instrument for the whole
  circle, one shake per kid — the music is the waiting and
  the passing as much as the shake.
- sticky-window-big-shapes vs big-dot-sticker-pictures
  (wave 27, peeled dot stickers on paper): nothing is used up
  here — big pieces press onto sticky film with a whole palm
  and can be peeled and moved all session; the window is the
  page and it never fills up wrong.
- grass-hill-roll-down vs two-foot-landing-pads (wave 28, the
  landing skill) and big-egg-roll-slope (eggs roll, kids fetch
  at a walk): here the KID is the thing that rolls — arms
  hugged, one at a time, down a checked gentle slope.
- window-raindrop-follow vs cup-of-snow-melting-watch (wave 28,
  snow melting in a cup): that watch is still and slow; this
  one follows movement — a drop that slides, grows by merging,
  and races other drops down real glass on a real rainy day.
- rain-call-to-the-rug vs pillow-islands (wave 27, stepping
  between pillows) and loud-quiet-song-switch (wave 28, volume
  cued by hands): the cue here is weather — umbrella up + rain
  sound means get dry on the rug; the shelter is a place, not
  a volume, and nobody steps anywhere in between rounds.
- sun-patch-shade-patch vs watering-can-plant-round (wave 29)
  and sun-print-art (6-12, prints made by sun exposure): no
  making and no job — stand in the sun patch, feel it on your
  hands, step into the shade, feel the change. Feeling is it.
- dandelion-clock-blow-walk vs frozen-bubble-blowing (4-10)
  and giant-bubble-chase (4-12): nothing is blown through a
  wand and nothing is chased — a ripe seed head found on a
  walk, blown where it stands, counted puff by puff the way
  the old dandelion-clock game always counted.
- big-lid-match-basket vs nesting-cup-towers (cups stacked
  inside each other) and color-sorting-trays (sorting by one
  attribute): the lids must FIT their pots — a wrong lid is
  found by trying, and "not this one" is the information.

Safety notes are practical only — no medical claims anywhere.

Run once: dedupes by id, writes data/activities.json + collections.json.
Run scripts/build.py afterwards.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_winter import A, DATA

XMAS = ["holiday:christmas", "season:winter"]

PACK = [
    # ---------------- Holidays, just 3 (holidays age-3 primary 4 -> 5; floor) ----------------
    A("felt-tree-one-by-one", "Felt Tree, One by One",
      "A big felt tree low on the wall and big soft pieces to press onto it, one kid, one piece, one at a time — a first tree to decorate.",
      ["holidays"], (3, 3), (4, 16), (10, 20), ["indoor"],
      ["a big felt or flannel tree shape (adult-cut, pinned or taped flat at kid height)", "big felt stars, circles and simple shapes (adult-cut, each bigger than a kid's palm)", "a basket (for the pieces)"],
      False, "Fix the tree up yourself before the group arrives: flat against a low wall or board, bottom edge at a seated kid's shoulder height, and press every piece onto it yourself once — a piece that slides off in your hand will slide off in theirs, so rough felt or a dot of repositionable glue on the tree fixes it now. Pieces go in the basket beside the tree, all of them, so choosing is part of the activity.",
      ["Name the real thing in one plain sentence: 'At Christmas, lots of families decorate a tree, putting one thing on at a time until it is full. This is our tree, and we are decorating it our size.' State the one rule: 'One piece at a time. Press it flat with your whole hand.'",
       "First piece together: a kid chooses from the basket, carries it to the tree in two hands, and presses it on with a whole palm while the group counts the press — 'one!' — out loud. The count is the ceremony; a tree decorated one counted piece at a time takes exactly as long as it takes.",
       "Go around the same way, one piece per kid per round, the group counting up after every press: the number the group reaches is the number of pieces on the tree, checked by pointing at each one as it is counted. Counting things you put there yourself is the sturdiest counting there is.",
       "Full-tree moment: when the basket is empty, everyone steps back — or wheels back — and looks. Name what the group can see in plain words: the colours, the star somebody chose for the top, the piece hanging lowest. Looking at finished work together is part of finishing it.",
       "Taking-down is a second activity, not a chore: pieces come off one at a time, counted down by the group, each carried back to the basket by its decorator. The tree ends bare and the basket ends full, ready for the next group to do the whole thing again."],
      "A smaller tree and eight pieces, with the adult's hand over theirs for the press — the choice of WHICH piece is still entirely the kid's.",
      "A pattern round: the adult quietly names a shape — 'the tree needs a star' — and the decorator has to find that shape in the basket before the press.",
      safety="Pieces are palm-size or bigger and plain felt — no pins, no hooks, no small ornaments, nothing glass, and nothing with a button battery goes anywhere near this tree. The tree is fixed flat by an adult and checked daily; a peeling corner gets re-taped before a kid finds it with their fingers.",
      tags=XMAS, copy_free=True, no_elimination=True,
      inclusion="The tree's low half belongs to seated decorators: pieces placed from a chair, a lap tray or the floor reach the tree in full, and the counting counts every press the same. A kid who would rather be the basket-keeper — choosing which pieces are offered next — is running the decorating, not watching it."),

    # ---------------- Seasons, just 3 (seasons age-3 primary 5 -> 6) ----------------
    A("sun-patch-shade-patch", "Sun Patch, Shade Patch",
      "A sunny patch and a shady patch side by side, and one job: stand in each one and feel the difference on your own hands.",
      ["seasons", "outdoor"], (3, 3), (2, 14), (10, 15), ["outdoor"],
      ["a sunny patch of ground with a shady patch right beside it (under a tree, an awning, or a building's shadow)", "a rug or mat (the shade stop)"],
      True, "Scout the patches yourself first, an hour matters: you need sun and shade BESIDE each other at the time the group goes out, with the shade big enough for the whole group to stand in. Stand in both yourself — if your own hands cannot feel the difference today, the weather has not provided this activity and it waits for a better day, honestly.",
      ["Gather the group in the shade first and state the one job: 'We are finding out what the sun does. Hands out, palms up. Feel.' Everyone holds their hands out in the shade and names what they feel in whatever words they have — cool, nothing, wind — all answers are weather reports.",
       "Walk the group into the sun patch together and stand still: hands out, palms up, same as before. Give it a real minute — warmth arrives slowly on skin, and hurrying past it teaches nothing. Then the plain sentence, said together: 'The sun is warm.'",
       "Back to the shade, same still minute, same hands out. The sentence this side: 'The shade is cool.' Two patches, two sentences, felt on the same hands a minute apart — that comparison is the whole science at three, and it is real science.",
       "Choice round: each kid picks their patch — sun or shade — and stands in it while the group calls out where everyone is standing. A kid who keeps swapping patches to feel the change again is doing the activity more, not less.",
       "Finish in the shade with the mat down: sit, hands in laps, and one last call of the two sentences by the whole group, pointing at each patch as it is named. The patches will move by tomorrow — say so; shadows walking is next year's activity."],
      "Two patches only and the adult's hands as the example: hold one hand in sun and one in shade yourself first, and let each kid feel your warm hand and your cool hand.",
      "Add a middle patch — half sun, half shade across the body — and let kids stand astride the line and report which SIDE of them is warm.",
      safety="Sun time is short and this activity is why: a minute or two of standing in a sun patch, in hats where the program uses them, and the shade is always the home base — nobody is left standing in full sun while the group talks. Hot ground is checked with an adult hand first; a patch too hot to stand on in bare legs is a patch for another day.",
      copy_free=True,
      inclusion="Feeling the patches works from any height: a seated kid's hands reach the same sun, and the rug in the shade is placed so wheels and walkers are IN the shade patch, not beside it. A kid who cannot say 'warm' can show it — hand pressed to the adult's cheek from each patch is a weather report the whole group understands."),

    # ---------------- Rainy-day x2, just 3 (rainy-day age-3 primary 4 -> 6; floor + thinnest category) ----------------
    A("rain-call-to-the-rug", "Rain Call: To the Rug",
      "The grown-up raises an umbrella and shakes the rain sound — rain! Everyone walks to the rug and crouches down dry until the sun comes back.",
      ["rainy-day", "pe-movement"], (3, 3), (6, 16), (10, 20), ["indoor"],
      ["one umbrella (adult-held, the rain signal)", "a rain stick or a sealed shaker with rice or beans inside (the rain sound)", "a big rug or mat (the dry place)"],
      False, "Set the room honestly: the rug goes at one end as the dry place, and the walking space between must be clear enough for excited three-year-olds moving at a walk — move the chair that will get bumped now, not after. Test your signals: umbrella up high in one hand, rain sound in the other, and practise the two calls yourself so the group learns one signal, not a muddle.",
      ["Start with everyone on the rug — the dry place — and teach the weather: umbrella DOWN and no rain sound means sun, and in the sun we walk around the room. Umbrella UP with the rain sound means rain, and the one rule: 'When the rain comes, walk to the rug and crouch down dry.' Model both calls once, slowly, yourself.",
       "Sun round: umbrella down, the group walks the room — around, not across the rug — while you name the weather like a forecast: 'Still sunny... still sunny...' Walking in the sun is the waiting part, and the waiting is what makes the call exciting.",
       "Rain call: umbrella up, rain sound shaking, and the whole group walks — walking feet, said every time — to the rug and crouches down dry, hands on knees, while the rain sound lasts. When it stops and the umbrella drops: 'Sun's back!' and everyone stands and walks again.",
       "Long-rain round: once, make the rain last — a full slow count of ten of rain sound while the group stays crouched and dry, making small rain pats on their own knees. Staying dry through a long rain, together, is the game's big moment.",
       "Finish with the weather report: the group sits on the rug and you ask what happened, in order — sun, rain, sun — and they will tell it back like a story, because it was one. Umbrella closed and put away by the adult while they watch: signals get retired properly."],
      "Sun walking in a small circle near the rug and the adult walks the first two rain calls WITH the group, crouching in the middle of the rug like everybody else.",
      "A second signal to tell apart: umbrella up with NO rain sound means drizzle — walk to the rug but stay standing, because drizzle is not worth crouching for.",
      safety="The umbrella is held by an adult only, opened high and away from faces, and its spokes never come down to kid height — it is a signal, not a shelter, and nobody goes under it. Rain calls are walked, never run: a room of three-year-olds converging on one rug is a pile-up at a run and a pleasure at a walk. The shaker stays sealed; a split shaker is retired, not taped and trusted.",
      copy_free=True, no_elimination=True,
      inclusion="Getting to the rug counts however you travel — wheeling, walking with support, or carried steps with an adult all land dry in full, and the rug is big enough that the whole group fits with wheels on it too. A kid who would rather work the weather can hold the rain shaker with the adult and make the rain come — the most powerful job in the room."),

    A("window-raindrop-follow", "Window Raindrop Follow",
      "Real rain on a real window: pick one drop at the top, put your finger beside it on the glass, and follow it all the way down.",
      ["rainy-day", "quiet-focus"], (3, 3), (2, 12), (10, 15), ["indoor"],
      ["a window at kid height with real rain running down the outside", "a stool or step for shorter kids (adult-placed)", "a dry cloth (for wet fingers and fogged spots)"],
      False, "This activity cannot be faked and should not be: it needs a rainy day and a window the rain actually hits, low enough for a three-year-old to reach the top of the glass. Stand there yourself first and watch one drop make the whole trip — if the rain is too light to run today, say so and save the activity; a window of still drops is a different, shorter look, not this.",
      ["Gather the group at the window and watch together for a moment before any fingers go up: drops landing, sitting, then suddenly sliding. Say the plain fact the whole activity hangs on: 'A drop slides when it gets heavy enough. Watch — it will take other drops with it.'",
       "State the one job: 'Pick a drop near the top. Finger BESIDE it, on our side of the glass. Follow your drop down.' Model it once with your own finger riding beside a sliding drop, slow enough for the group to track.",
       "Following round: each kid picks a drop and rides a finger down beside it. Drops will merge mid-slide — when yours joins a bigger drop, say so out loud: 'My drop got bigger!' — because merging is not losing your drop, it is what rain does, and the group will report every merge like news.",
       "Race-that-isn't round: two kids pick two drops side by side and follow both. One will win; nobody chose the weather, so the result belongs to the rain — name that plainly, because this is the rare race where the loser did nothing wrong and everyone can see it.",
       "Finish when the rain eases or the window runs dry of runners: count together how many drops the group followed all the way to the bottom — the number is whatever it is — then the cloth wipes the fingerprints off the glass, because the next rainy day deserves a clean window."],
      "The adult picks the drop and every finger follows the SAME one together — one shared drop, no choosing, still a full follow when it slides.",
      "Follow a drop with your eyes only, hands in laps, and call 'now!' at the exact moment it starts to slide — watching for the start is the harder skill.",
      safety="Fingers stay on the inside glass, flat and gentle — no banging, no leaning body weight on the pane, and stools are placed and held by an adult, never climbed mid-game. The window stays shut whatever the weather is doing; the rain is watched, not let in. If thunder starts, the group leaves the window — storm watching is not this activity.",
      copy_free=True),

    # ---------------- STEM, just 3 (stem age-3 primary 5 -> 6) ----------------
    A("big-magnet-wand-sticks", "Big Magnet Wand: It Sticks",
      "One big magnet wand and a tray of big things: touch each one and find out — it sticks, or it doesn't. Your hand is the lab.",
      ["stem"], (3, 3), (2, 10), (10, 20), ["indoor"],
      ["big encased magnet wands (one per kid — the chunky classroom kind, magnet sealed inside)", "big smooth metal jar lids and lids from big cans (adult-checked, no sharp rims)", "big non-metal things to test (a wooden block, a big plastic lid, a sponge, a fabric scrap)", "two trays per kid (sticks / doesn't)"],
      False, "Check every test object with your own wand before the group sits down: the metal lids must actually stick (some lids are aluminium and will not — an all-fails tray teaches the wrong lesson), and every rim gets a thumb run around it for sharpness; a lid that fails either check does not reach the table. Set each place with a mixed handful — some that stick, some that don't — because a tray that all sticks is a demo, not a test.",
      ["Start with the wand alone in the air: wave it, turn it over, look at it together. Say the one plain fact that frames everything: 'This wand is a magnet. Magnets stick to SOME things. Our job is finding out which.' No more theory than that — the table is the theory now.",
       "State the one rule: 'One thing at a time. Touch it with the wand. If it sticks, it rides to the sticks tray. If it doesn't, it goes to the other tray.' First test together, slowly: touch a big lid, lift — it comes with the wand, and the whole group says it: 'It sticks!'",
       "Testing round: each kid works through their handful at their own pace, touch, lift or not, sort, with the two sentences running constantly — 'It sticks!' / 'It doesn't.' The sentences are the data at three, and the trays filling up are the graph.",
       "Surprise check, halfway: hold up the two trays and look together. The sticks tray is all lids; the other tray is wood, plastic, sponge, cloth. Say the pattern in the plainest words: 'The sticking ones are all metal lids. The magnet is choosing the metal.' That sentence is earned by their own hands by now.",
       "Finish with the wand trick that never fails: a lid stuck UNDER the table, held through it, sliding along as the wand moves on top — do it once yourself, then let each tester try while the group watches the lid travel by itself. Trays tipped back into the basket by their testers; wands collected and counted."],
      "Four objects only, two that stick and two that don't, and the adult does the lifting while the kid points at the right tray — choosing the tray is the test result.",
      "Hide-and-stick round: the adult hides three lids under a cloth and the tester fishes with the wand alone — if it comes up stuck to the wand, it was metal, sight unseen.",
      safety="Encased classroom wands only — the magnet is sealed inside the plastic and can never come out. Loose small magnets of any kind never appear at this table, ever: they are a genuine emergency if swallowed, and this record says so in plain words so no substitute improvises with fridge magnets. Lids are big, smooth-rimmed and adult-checked; wand work stays on the table, and wands are never put in mouths.",
      copy_free=True,
      inclusion="Sorting is a full test done by direction: a kid who points at a tray while a partner lifts has called the result, and calling it is the science. The wand can be worked two-handed, rested on the table edge, or moved along a lap tray — the tray set-up travels to the tester, never the other way round."),

    # ---------------- Team & community, just 3 (team age-3 primary 4 -> 5; floor) ----------------
    A("blanket-carry-teddy-to-bed", "Blanket Carry: Teddy to Bed",
      "Two carriers, one small blanket held low, and a big teddy who is very nearly asleep: walk him to his bed without waking him.",
      ["team-community"], (3, 3), (4, 12), (10, 20), ["indoor"],
      ["a small sturdy blanket (the stretcher)", "one big soft teddy (the passenger)", "a cushion or folded mat across the room (the bed)", "a small pillow (for the tuck-in)"],
      False, "Walk the route yourself first carrying one corner of the blanket: it should be short, flat and clear — a carried blanket hangs low between two small carriers, so anything on the floor is a trip and anything sticking out is a snag. Lay the bed out properly at the far end, pillow on it, so arriving looks like arriving. Teddy starts the activity sitting up by the blanket, wide awake, and the group will fix that.",
      ["Tell the one small story that runs the whole activity: 'Teddy is very nearly asleep. He cannot walk to bed. Two carriers can take him — on the blanket, slowly, without waking him.' State the one rule: 'The blanket stays low and level, and we walk. If Teddy wakes, we have gone too fast.'",
       "Load together: two carriers hold the blanket's near corners, two more — or the adult — hold the far ones, blanket stretched low between them, and Teddy is laid in the middle by the whole group, one hand each where hands are offered. A four-corner carry at three is a crew job, and crewing it is the teamwork.",
       "The carry: walking feet, blanket low, eyes on Teddy. The non-carriers walk alongside as the hush-crew, one finger on lips, making the corridor quiet — their job is real: a woken Teddy is a group result, and so is a sleeping one.",
       "Arrive: at the bed, the carriers lower the blanket slowly together — 'down, down, down' said by the hush-crew as the count — until Teddy rests on the cushion, then the blanket slides out from under him one corner at a time. A carrier does the tuck: pillow under his head, blanket folded over him from the stretcher itself.",
       "Report and rotate: the group gathers round the bed and the hush-crew reports, in whispers, 'He's asleep.' Then new carriers take the blanket, Teddy is 'woken' gently by the adult and carried back the same slow way — everyone who wants a carry gets one before anyone gets a second."],
      "Two carriers only, short route, the adult holding the two far corners — the level blanket is demonstrated by doing it alongside them.",
      "A second passenger joins mid-route: the hush-crew chief stops the carry with a raised hand, a doll is laid beside Teddy without a jiggle, and the carry continues heavier and slower.",
      safety="Walking only, and the blanket stays LOW — a dropped teddy from knee height onto a mat is a story point, a raised blanket is how carriers trip. Nobody rides on the blanket and nobody is carried, ever: Teddy is the only passenger, and the rule is said before the first load, kindly and once. Routes are cleared before loading, not during.",
      copy_free=True, no_elimination=True,
      inclusion="The crew is bigger than the corners: the hush-crew chief who raises the stop hand, the loader who lays Teddy down, and the tucker-in who finishes the job all carry Teddy to bed. A carrier can hold a corner seated at the route's middle station for the blanket's halfway rest — a real stop the carry genuinely needs — so the blanket visits them on its way."),

    # ---------------- Icebreakers, just 3 (icebreakers age-3 primary 5 -> 6) ----------------
    A("name-echo-two-claps", "Name Echo, Two Claps",
      "Say your name. The whole circle says it right back, just like you said it — then two claps, together, like a small drum answering.",
      ["icebreakers"], (3, 3), (6, 20), (5, 10), ["indoor", "outdoor"],
      ["no materials — voices and hands only"],
      True, "No set-up beyond a real circle: everyone seated where they can see the speaker, knees in, hands free. Say the size of the thing before it starts — this takes five minutes and that is its virtue: it is a first-days activity for a room where nobody knows anybody's name yet, adults included, so the adult goes first and goes honestly.",
      ["Model the whole game with your own name, start to finish: stand or sit tall, say 'My name is ___' once, clearly, at a three-year-old's pace. The circle's job — taught now, before anyone is on the spot — is to say the name right back, the same way, then clap twice together: clap, clap.",
       "State the one rule: 'One name at a time, and the echo says it JUST like the speaker.' Go around the circle in order — no volunteering order, no spotlight roulette: the order is the seat order, known in advance, which is what makes it safe to take a turn.",
       "Every echo counts, every way it arrives: a kid who says their name gets it echoed; a kid who whispers it to the adult gets it said by the adult and echoed just the same; a kid who only points at themselves gets their name spoken by the adult with the same ceremony — the circle echoes all three identically, and the claps land the same.",
       "Middle round, once the names are warm: the speaker says their name in a chosen voice — tiny voice, big voice, slow voice — and the echo has to copy the VOICE as well as the name. Copying a friend's tiny voice exactly is the listening this game is quietly training.",
       "Finish with the all-names wave: you point around the circle fast, and the group echoes each name with its two claps in one flowing round — by the last name the room knows itself, which was the entire point, and it took five minutes."],
      "Adult names only for round one — the kids spend a whole round as the echo, which is a full turn, before any kid is a speaker.",
      "Add a favourite sound after the name — 'Sam!' clap clap 'Vroom!' — and the echo copies name, claps and sound in order.",
      safety="Echoes copy names kindly or not at all: a name is said the way its owner said it, never funnier, never louder-then-laughed-at — the rule is stated once, plainly, before the first name, because names are the one thing in the room that belongs entirely to the kid who carries it. Claps stay at talking volume; this is a hello, not a drum line.",
      copy_free=True, no_elimination=True),

    # ---------------- Outdoor, just 3 (outdoor age-3 primary 5 -> 6) ----------------
    A("dandelion-clock-blow-walk", "Dandelion Clock Blow Walk",
      "A slow walk to find a ripe dandelion clock: hold it low, blow, and count your puffs while the seeds float away like tiny parachutes.",
      ["outdoor", "seasons"], (3, 3), (2, 12), (10, 20), ["outdoor"],
      ["ripe dandelion clocks (the fluffy seed heads) growing on untreated grass", "no other materials — lungs and eyes only"],
      True, "Walk the patch yourself before the group comes out — this activity exists only where it honestly can: grass you KNOW is untreated (no sprays, no weed killer, ever — if you do not know, the walk finds something else that day), with ripe clocks actually standing. Count them roughly: a patch with three clocks and twelve kids is a sharing lesson, not a blowing walk, so find the good patch first.",
      ["Tell the group the old game in one plain breath, named as the tradition it is: 'Long ago, people played a game with these: you blow the seeds off and count your blows — that number was your pretend time. They called it a dandelion clock.' Pretend time, said as pretend — the counting is real, the clock is a game people have played for a very long time.",
       "Finding round: walk slowly and spot clocks — a kid who finds one points and calls 'Clock!' and the group gathers. The finder holds the stem low, with an adult hand steadying it if the ground is uneven, because a clock that gets knocked loses its seeds to the wind instead of the game.",
       "State the one rule before the first blow: 'Blow AWAY from faces, and the clock stays on its stem until it is bare.' The finder blows: one puff, seeds lifting off and floating — the group watches where they go before the next puff, because watching the seeds travel is most of the activity.",
       "Count the puffs together, out loud, one number per blow, until the head is bare or only the stubborn seeds are left: 'Seven puffs — seven o'clock!' by the group's pretend clock. The number belongs to the blower and gets said with ceremony; every blower's time is different and that is correct.",
       "Finish down low: get eyes at seed height and look at the bare head and the seeds landed around it, and say the plain true thing: 'Those seeds are trying to grow new dandelions. Some of them will.' Then the walk goes on — there may be one more clock, and everyone knows how to read it now."],
      "One shared clock for the whole group, puffs taken in turns around it — the count still builds blow by blow, and the clock is read together.",
      "Two clocks side by side: two blowers, two counts, and the group compares the pretend times — earlier clock, later clock — with no faster-or-slower judgement attached.",
      safety="Untreated grass only, no exceptions — a lawn whose spray history is unknown is not used, and the adult, not the patch, decides. Blowing is always away from faces and eyes; a kid who wants to watch from a step back is watching in full. Seeds and stems are not eaten, hands get washed back inside, and clocks near pathsides where dogs are walked are looked at, not picked.",
      copy_free=True),

    # ---------------- Music & rhythm, just 3 (music age-3 primary 5 -> 6) ----------------
    A("one-shake-pass-around", "One Shake, Pass It Around",
      "One tambourine for the whole circle. When it reaches you: one shake — a real one — then pass it on. The music is taking turns.",
      ["music-rhythm"], (3, 3), (4, 16), (10, 15), ["indoor", "outdoor"],
      ["one big tambourine (sturdy, adult-checked — no loose jingles)"],
      True, "Check the tambourine yourself first: shake it hard over your own hand and look — every jingle fixed, no cracks, nothing that a determined three-year-old could work loose. Sit the circle close enough that the tambourine passes hand to hand without anyone leaning across a lap: passing distance is the set-up, and a circle that is too wide makes droppers of everyone.",
      ["Start with the tambourine in your own hands and model the whole turn in four beats: receive it in two hands, ONE shake — wrist up, a proper ring — say nothing, pass it two-handed to the next person. State the one rule: 'One shake when it comes to you. Then it travels.'",
       "First round is slow on purpose and that is the music of it: shake, pass, shake, pass — the circle finds the rhythm of the PASSING itself, and you name it when it settles: 'Listen — shake, wait, shake, wait. We are playing the silences too.'",
       "Name round: as the tambourine arrives, the receiver says their name first, then shakes once — name, ring, pass. A name said into a listening circle and answered by an instrument is a performance a three-year-old can actually hold, and each one gets the circle's whole attention.",
       "Growing round: the LAST kid in the circle earns the double — two shakes to close the song — and the group counts them: 'One... two!' Then the tambourine starts a fresh round the other way around the circle, which at three is a genuinely new journey.",
       "Finish by putting the tambourine to sleep in the middle: the final receiver carries it in two hands to the centre, lays it down flat, and the whole circle puts one finger on their lips over it. An instrument resting is an instrument respected — and a quiet circle of three-year-olds, achieved by music, is worth sitting in for a moment."],
      "The adult passes hand-over-hand with each receiver — the shake is still the kid's own, the pass is shared until hands learn it.",
      "Choice round: the receiver may shake once OR tap the skin once — choosing your sound is arranging, and the circle hears two instruments in one.",
      safety="The tambourine is passed, never thrown, and never snatched: a pass that gets grabbed is redone slowly, kindly, because the passing is half the instrument. Jingles are checked before every use — a loose jingle on the floor is picked up by an adult immediately; small metal discs and small hands are a combination this activity simply designs out.",
      copy_free=True, no_elimination=True),

    # ---------------- Crafts, just 3 (crafts age-3 primary 6 -> 7) ----------------
    A("sticky-window-big-shapes", "Sticky Window Big Shapes",
      "Clear sticky film on a low window, sticky side out, and big shapes to press on with a whole palm — a picture you can move all day.",
      ["crafts"], (3, 3), (2, 14), (10, 20), ["indoor"],
      ["clear contact paper / sticky-back film (adult-taped to a low window or smooth board, sticky side OUT)", "big shapes to stick: tissue-paper pieces, fabric scraps, big leaves, felt shapes (all adult-cut, palm-size or bigger)", "a tray or basket for the pieces"],
      False, "Mount the film yourself and take your time over it: sticky side out, edges taped down ALL the way round so no small fingers can peel the film itself up, at a height where a standing kid's palm reaches the middle and a seated kid's palm reaches the bottom third. Test it with the biggest, softest piece you have — tissue that will not hold gets swapped for fabric before the group arrives, because a piece that falls teaches the window is broken.",
      ["Show the window working before anyone is handed a piece: press one big shape on yourself with a flat palm, hold, let go — it stays. Then peel it off and press it somewhere else. Say the plain wonder of it out loud: 'It sticks, and it UN-sticks. You can move your picture all day. Nothing here can be put in the wrong place.'",
       "State the one rule: 'Press with your whole hand, flat.' First pieces go up one kid at a time so everyone sees a palm-press work — a fingertip poke crumples tissue, a palm lays it flat, and the difference is visible across the room.",
       "Making round: pieces travel from basket to window at each kid's own pace, pressed, looked at, peeled, moved. Overlaps are fine and get named kindly — 'Your leaf is sleeping on the red one' — because a shared window is a group picture whether anyone planned it that way or not.",
       "Step-back round, halfway: everyone takes two steps back — or wheels back — and just looks at the window together, light coming through the tissue pieces. Naming what you can see in it (a sun, a fish, nothing at all yet) is looking practice, and the light does half the showing.",
       "Finish open-ended on purpose: the window STAYS UP. Pieces can be moved at any free moment for the rest of the day, and the last job — whenever the film finally comes down — is the group peeling their own pieces off into the basket, because an un-sticking round is as satisfying as the sticking one and the pieces keep for next time."],
      "Three big fabric pieces only, on the lowest third of the film, with the adult holding the basket at elbow height — choosing and pressing is the whole craft.",
      "A loose theme offered, never set: 'The window is hungry for green things today' — and the basket quietly holds mostly leaves and green pieces for kids who want a brief.",
      safety="The film's edges are taped by an adult and checked each session: peeled-up film corners are the one real hazard here (sticky film over a face is no joke) and a lifting edge retires the window until it is re-taped. Pieces are palm-size or bigger — no glitter, no sequins, nothing small and shiny at this table. Pressing is done with hands only; nobody leans their weight or their forehead on the glass behind the film.",
      copy_free=True,
      inclusion="The bottom third of the window is the seated artists' section by design, not by leftovers: it catches the same light, and pieces pressed from a chair or a lap tray are in the picture in full. A kid can also work as the piece-keeper, holding the basket and handing each artist their chosen shape — handing over the right piece, by name, is gallery work."),

    # ---------------- PE & movement, just 3 (pe age-3 primary 6 -> 7) ----------------
    A("grass-hill-roll-down", "Grass Hill Roll Down",
      "A gentle grass slope, arms hugged tight, and the oldest ride there is: lie down sideways at the top and roll, all the way to the bottom.",
      ["pe-movement", "outdoor"], (3, 3), (2, 12), (10, 20), ["outdoor"],
      ["a gentle grass slope (adult-walked and checked)", "a cone, scarf or flag at the bottom (the stop line)", "a clear side path back up the hill"],
      False, "Walk the slope yourself before the group comes out — properly, on foot, top to bottom: you are looking for stones, holes, sticks, bare hard patches and anything the grass is hiding, and you roll it once yourself if the group's adults will allow the dignity hit, because your body finds what your eyes missed. The slope must be GENTLE: a hill a nervous kid walks down without using their hands. If the only slope fails any of this, the activity waits — a roll down a bad hill is not a braver version, it is a different and worse one.",
      ["Gather at the top and teach the roll standing still, on the flat: arms crossed over the chest in a self-hug, chin a little down. Say the plain shape of it: 'Hug yourself, lie on your side, and the hill does the rolling. You just stay hugged.' Practise the hug until every kid can find it without thinking — the hug is the seatbelt.",
       "State the one rule: 'One roller at a time, and the next hug starts only when the bottom is clear.' The bottom-caller — an adult or a kid with the flag — stands at the stop line and calls 'Clear!' The call is a real job and the roller does not start without it.",
       "First rolls: the adult walks the first roller down the side path, lies them on their side at the top with the hug on, and gives the gentlest start. Rolling sideways is strange the first time — some kids unroll flat and stop, some need a second setting of the hug — all of it is learning the skill, at whatever speed knees and grass agree on.",
       "Going round: each roller stands up at the bottom — slowly, the world is wobbly, that is normal and funny — waves at the top, and walks back up the SIDE path, never up the rolling lane. Waiting kids at the top watch the whole roll; watching a friend roll well is how the next hug gets braver.",
       "Finish with a group count of the day's rolls and one last look at the hill: grass flattened in winding lines where the rolling happened. The hill keeps the score for an hour. Then everyone walks down the side path together, upright, like people who have somewhere to be."],
      "Half-hill starts: the roller begins halfway down where the slope is gentlest, with an adult's hands setting the hug and the first turn — the bottom arrives sooner and the skill is the same.",
      "A paired roll for the confident: two rollers side by side at the top, hugs on, starting on the same 'Clear!' — keeping your own line while a friend rolls beside you is the advanced class.",
      safety="Checked, gentle, grass-only slope; one roller at a time; the lane and the walking-back path never cross. Arms stay hugged and chins stay tucked — no head-first rolling, no standing starts, no pushing a roller faster. A dizzy kid sits at the bottom with an adult until the world settles — rolling stops the moment any kid says stop, mid-hill included, and getting up slowly is taught as part of the roll, not an afterthought.",
      copy_free=True,
      inclusion="Rolling takes many shapes at the bottom of the same hill: a seated log-roll across a flat mat with an adult's hands guiding each turn is rolling in full, at the speed that body rolls. The bottom-caller with the flag runs the safety of the whole hill — nothing moves without their 'Clear!' — and a kid who never rolls can hold that job for every single run."),

    # ---------------- Quiet focus, just 3 (quiet-focus age-3 primary 9 -> 10) ----------------
    A("big-lid-match-basket", "Big Lid Match Basket",
      "A basket of big lids and the pots they belong to: try a lid, feel if it fits, twist or press — a covered pot is a finished job.",
      ["quiet-focus"], (3, 3), (2, 8), (10, 20), ["indoor"],
      ["four to six big plastic pots, tubs and containers (adult-checked, all palm-size or bigger)", "their real lids — plus one or two lids that fit NOTHING in the basket (the honest decoys)", "a basket or tray (everything lives on it)"],
      False, "Build the basket yourself and test every pairing with your own hands: each container's lid must genuinely fit — press or twist — firmly enough to pass the gentle shake test in your hand, and the decoy lids must genuinely fit nothing, because a rigged basket teaches that trying is pointless. Everything is big and plastic: lids a whole palm covers, containers too large to be interesting to a mouth, no glass anywhere in the basket.",
      ["Empty the basket onto the tray together and look at the jumble for a moment: pots without lids, lids without pots. Say the plain job: 'Every pot has a lid that fits it. Not every lid fits every pot. Our job is matching them — by trying.'",
       "State the one rule: 'Try it gently. If it doesn't fit, that's the lid telling you something — put it back and try another.' First match together, slowly: a lid tried on a wrong pot wobbles and sits crooked — show the wobble — then on its own pot it sits flat, and a press or twist makes it hold. The difference is felt in the hands before it is understood in words.",
       "Matching round: each kid works their own pot or shares a basket between two, trying, wobbling, rejecting, fitting — quietly, because the work itself is quiet. A finished pot gets the gentle shake test beside an ear: no rattle of a loose lid, a small satisfying nothing. Then it joins the finished row.",
       "Decoy moment: sooner or later someone wrestles a lid that fits nothing. Name it like a discovery, not an error: 'That one is the trick lid — it doesn't belong to any pot today.' Finding the decoy is a result the whole table will want announced, and it proves the trying was real.",
       "Finish with the full row: every pot covered, decoys back in the basket, and the group runs one finger along the row counting covered pots out loud. Then lids come OFF to finish — popped and twisted back into the basket by their matchers — because a basket that resets itself gets used again tomorrow."],
      "Three containers with three lids and no decoys, lids rested ON TOP beside their pots — the fit is found by looking first and confirmed by the press.",
      "Lids only, sorted by sound: matchers close their eyes while the adult taps each lid — find the lid that SOUNDS like the one in your hand. Ears do the matching; the shake test confirms it.",
      safety="Big and plastic only — every lid is palm-size or bigger, every container too large to mouth, and anything cracked or sharp-edged is retired by the adult on sight. Lids are pressed and twisted, never forced with body weight and never pried with teeth; a stuck lid goes to the adult, whose stronger hands are a tool of the room, not a defeat.",
      copy_free=True,
      inclusion="Holding is half the job: a partner who holds a pot steady with both hands while the matcher tries lids has matched that pot — the shake test at the end is done together and the success belongs to both sets of hands. Pots and lids work just as well on a lap tray or a low table edge, and the try-wobble-fit feedback is all in the hands, exactly where this activity lives."),
]

COLLECTION = {
    "id": "little-hands-just-three",
    "title": "Little Hands, Just Three",
    "glyph": "\U0001F388",
    "when_to_use": "The different shelf for the youngest kids in the building: twelve activities banded for three-year-olds ONLY — one shake of one tambourine, a raindrop followed down the glass, lids that fit their pots, a teddy carried to bed without waking him. The four shelves beside this one serve three-to-six; these twelve belong to the threes alone. Grab it for a young-threes room, a first month of program, or any group whose oldest kid just turned three.",
    "picks": [
        {"id": "felt-tree-one-by-one", "note": "One piece, one palm-press, one count. The tree fills at exactly the speed a three-year-old decorates, and taking it down counts backwards."},
        {"id": "sun-patch-shade-patch", "note": "Warm on this hand, cool on that one, a minute apart. The comparison IS the science, and it only works at a stand-still pace."},
        {"id": "rain-call-to-the-rug", "note": "Umbrella up means get dry — walked, never run. The weather-worker with the shaker holds the most powerful job in the room."},
        {"id": "window-raindrop-follow", "note": "Your drop merging into a bigger one is not losing it — it is what rain does, reported like news. Needs a real rainy day; refuse to fake it."},
        {"id": "big-magnet-wand-sticks", "note": "'It sticks! It doesn't.' Those two sentences are the data, and the trays are the graph. Encased wands only — the record says why."},
        {"id": "blanket-carry-teddy-to-bed", "note": "Four corners, one passenger, walking feet. The hush-crew's whisper-report at the bed — 'He's asleep' — is the teamwork certificate."},
        {"id": "name-echo-two-claps", "note": "Five minutes, no materials, a room that knows itself. A whispered name gets the same echo and the same two claps as a shouted one."},
        {"id": "dandelion-clock-blow-walk", "note": "Count the puffs, read the pretend time. Seven o'clock belongs to the blower, and the seeds trying to grow is the true part."},
        {"id": "one-shake-pass-around", "note": "The music is the waiting as much as the shake. One instrument, whole circle, and a tambourine put to sleep properly at the end."},
        {"id": "sticky-window-big-shapes", "note": "It sticks and it un-sticks, so nothing can be put in the wrong place. Leave it up all day — moving the picture IS the craft."},
        {"id": "grass-hill-roll-down", "note": "The hug is the seatbelt and the flag-caller runs the hill. Check the slope with your own body before any kid rolls it."},
        {"id": "big-lid-match-basket", "note": "A wobble is information, not failure — and finding the trick lid that fits nothing is the result the whole table celebrates."},
    ],
}


def tokens(s):
    return set(re.findall(r"[a-z0-9]+", s.lower()))


def main():
    path = os.path.join(DATA, "activities.json")
    acts = json.load(open(path))
    existing = {a["id"] for a in acts}
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
        assert rec["age_min"] == 3 and rec["age_max"] == 3, f"not 3-only: {rec['id']}"
    added = 0
    for rec in PACK:
        if rec["id"] in existing:
            print("skip (exists):", rec["id"])
            continue
        acts.append(rec)
        existing.add(rec["id"])
        added += 1
    json.dump(acts, open(path, "w"), indent=1, ensure_ascii=False)
    print(f"added {added} activities; total now {len(acts)}")

    colls_doc = json.load(open(os.path.join(DATA, "collections.json")))
    colls = colls_doc["collections"]
    if COLLECTION["id"] not in {c["id"] for c in colls}:
        colls.append(COLLECTION)
    json.dump(colls_doc, open(os.path.join(DATA, "collections.json"), "w"), indent=1, ensure_ascii=False)
    print(f"collections: -> {len(colls)}")


if __name__ == "__main__":
    main()
