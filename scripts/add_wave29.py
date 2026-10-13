#!/usr/bin/env python3
"""Wave 29: First Years, Fourth Shelf — the age-3 build, floor-raising.

Wave 28's honest assessment: age-3 coverage 46 against 148 at age 4 —
"still the thinnest age on the books... at this wave's honest rate the
headline closes in roughly one more wave." Measured before this wave
(primary category = categories[0], records covering age 3), the shape
inside the headline is:

  holidays       2 primary at age 3  (the floor, one wave after its
                 first-ever age-3 records landed)
  seasons        3 primary
  rainy-day      3 primary
  stem           3 primary (and only 5 by any-category count)
  team-community 3 primary (5 any-category)
  icebreakers    3 primary (3 any-category — thinnest shelf by that
                 measure too)
  outdoor        4 primary
  music-rhythm   4 primary
  crafts         6 primary (not the hole)
  pe-movement    6 primary (not the hole)
  quiet-focus    9 primary (not the hole)

So this pack is a floor-raiser, not a headline-chaser: two each for
holidays, seasons, stem and icebreakers, one each for rainy-day,
team-community, outdoor and music-rhythm — and nothing for crafts,
pe-movement or quiet-focus. After this wave every one of the 11
primary categories carries at least 4 records written for the
three-year-old room.

Same design rules as waves 26/27/28: age_min 3, age_max <= 6, runs
<= 25 minutes, big pieces, ONE rule per game, the adult as a player.

An honest note on the headline, written into the wave log as well:
every record in this pack also covers age 4 (bands are 3-5 / 3-6),
so age 4 rises by the same 12. The 46-vs-148 gap does not shrink by
building more broad early-years records — it never has, in four
waves. What this wave closes is the floor: the thinnest shelves a
teacher of three-year-olds actually reaches for. The headline gap
itself is structural (the archive's centre of gravity is 5-12) and
this log will keep saying so until a wave is designed to move it.

Near-duplicate screen: token Jaccard >= 0.55 against every existing
name+tagline is asserted below and fails the run. Closest deliberate
neighbours, kept on purpose:
- lantern-carry-parade vs lantern-riddle-walk (6-12, riddles read
  along a route) and paper-lantern-festival (8-12, making lanterns):
  here the lantern is already made, the job is carrying it with two
  hands at a slow walk — carrying is the skill, not solving or making.
- eight-lights-line-up vs hanukkah-counting-chain (6-12, a paper
  counting chain) and kinara-candle-counting (5-10, stem): LED lights
  are placed one at a time in a row and counted as they go on — the
  placing is the counting, with no chain to make and no flames.
- wind-ribbon-watch vs pinwheel-garden (4-12, making pinwheels):
  ribbons are already tied up by an adult; the activity is watching
  which way the wind pushes them and calling the gusts.
- boot-print-snow-trail vs track-prints-detective (5-12, identifying
  animal tracks): these prints are the kids' OWN boots, made fresh
  and followed back — nobody identifies anything.
- paper-puddle-stepping vs first-puddle-walk (wave 28, real puddles
  outdoors) and puddle-hopscotch (4-12, jumping a chalk grid): paper
  puddles indoors, and stepping IN them is the goal — the opposite
  rule from the lava game and from hopscotch.
- big-tongs-ice-move vs ice-excavation-dig (freeing toys frozen in
  ice) and ice-melt-rescue-race (a race): big loose cubes moved one
  at a time with big tongs, counted — grip and carry, no digging,
  no race, nothing frozen in.
- pan-balance-heavy-light vs rock-cairn-balance (stacking rocks
  until they balance): a two-pan scale, one big object per side —
  the side that goes down is heavier, said in those words.
- toy-wagon-pull-together vs pass-it-down-delivery-line (wave 27,
  hand-to-hand down a line) and cushion-train-all-aboard (wave 28,
  a pretend seated train): a real small wagon, really loaded and
  really pulled by two kids together to a real blanket.
- teddy-says-my-name vs hello-ball-greetings (wave 26, a ball rolled
  with greetings): a soft toy does the introducing — the kid holds
  it, whispers to the adult if they want, and the toy 'says' the
  name and one favourite thing.
- find-a-friend-wearing vs human-bingo (7-12, a read bingo card)
  and animal-sound-find-your-pair (wave 28, matching by sound):
  the match here is a colour you can SEE — find someone wearing
  the colour on the big card and stand with them.
- watering-can-plant-round vs pouring-practice-trays (wave 26,
  pouring tray to tray indoors): a real small can, carried with two
  hands to real plants outside — the pour waters something alive.
- lullaby-rock-and-sway vs knee-drum-copycat (wave 27, tapped
  patterns) and loud-quiet-song-switch (wave 28, volume cued by
  hands): a soft doll rocked side to side in time with one slow
  song — rocking in time is the musicianship, and the song ending
  is the doll falling asleep.

Safety notes are practical only — no medical claims anywhere.

Run once: dedupes by id, writes data/activities.json + collections.json.
Run scripts/build.py afterwards.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_winter import A, DATA

LNY = ["holiday:lunar-new-year", "season:winter"]
HAN = ["holiday:hanukkah", "season:winter"]
SPR = ["season:spring"]
WN = ["season:winter"]

PACK = [
    # ---------------- Holidays, designed for 3 (holidays primary at age 3: 2 -> 4) ----------------
    A("lantern-carry-parade", "Lantern Carry Parade",
      "A made lantern with a safe light inside, carried with two hands on a slow walk around the room — the Lantern Festival, sized for three.",
      ["holidays"], (3, 5), (4, 18), (10, 20), ["indoor"],
      ["paper or fabric lanterns with an LED tealight inside (one per kid, adult-assembled)", "a rug or blanket (the parade's end)"],
      False, "Assemble every lantern yourself before the group arrives: LED tealight inside, top handle taped or tied so it holds a gentle swing, and carry each one across the room yourself — a lantern that tips its light out in your hands gets fixed now, not in a three-year-old's. Set the rug at the far end as the place the parade is walking to.",
      ["Name the real custom in one sentence, plainly: 'At the Lantern Festival, at the end of the Lunar New Year celebrations, people carry lanterns outside together — we are doing our small indoor one.' Then state the one rule: 'Two hands on the handle, walking feet. The lantern stays up.'",
       "Hand out lanterns one at a time, lit, and let each kid practise the carry standing still: two hands, lantern held in front, a small sway is fine and a swing is not. Practising still is what makes the walk slow.",
       "The parade walks: one slow line around the room, you at the front setting a pace a lantern can keep up with, the group naming what the lights look like as they go — that naming is the looking this festival is for.",
       "Halfway stop: everyone raises their lantern slowly to shoulder height and holds it while the group counts to five out loud, then lowers it just as slowly. Lifting and lowering a light without swinging it is harder than it looks, and the counting gives it time.",
       "Arrive at the rug: lanterns are set down in a row on the rug, still lit, and the group sits behind them and just looks for a moment — a row of lights you carried yourself is the ending. Lights off one by one as each lantern is collected."],
      "A shorter route — across the room and back — and the adult carries a lantern in the line too, so the pace is set from inside the parade.",
      "A second lap where each carrier chooses one thing in the room to stop and hold their lantern up to, and names it to the group.",
      safety="LED tealights only — no real flames, no sparklers, nothing that burns. Carrying is walking, always: a lantern that gets run with comes back to the line's end for one lap carried by the adult, kindly and without a speech. Handles are checked before the walk; a torn handle retires that lantern.",
      tags=LNY, copy_free=True, no_elimination=True,
      inclusion="A lantern carried on a lap tray, or set on the front of a wheelchair and pushed along the same route, is in the parade in full — the parade is the line, the lights and the slow pace, and every carrier in it is carrying. A kid who would rather be the rug-keeper, holding the row straight as lanterns arrive, has the job the whole parade is walking toward."),

    A("eight-lights-line-up", "Eight Lights Line Up",
      "Eight LED lights in a row, put on one at a time and counted as they go — the Hanukkah lights, at a three-year-old's pace.",
      ["holidays"], (3, 6), (2, 16), (10, 20), ["indoor"],
      ["nine LED tealights or LED candles (eight plus one helper light)", "a long tray, board, or taped line on the table (the row)"],
      False, "Set the row first: a long tray or a taped line on a low table, with eight marked spots along it — tape crosses work — and count the spots out loud yourself as you mark them. Test every LED light before the group sits down; a light that will not switch on gets swapped now, not discovered by a kid mid-count.",
      ["Set the scene in two plain sentences: 'On Hanukkah, families light candles on a holder called a menorah — one more light each night, for eight nights. We are putting our eight lights in a row, all in one go, and counting them as they light.' Put the helper light at the start of the row and switch it on: 'This one is the helper — it is not counted in the eight.'",
       "State the one rule: 'One light at a time. We count it, then the next one.' The first kid places the first light on the first spot, switches it on, and the whole group counts 'one' together — the counting is done by everyone, every time.",
       "Work down the row the same way, a different kid placing each light where they can: place, switch, count up from one together. Recounting from one every time is not inefficiency at three — it is the counting practice this activity is built around.",
       "When all eight are lit, sit back and count the whole row once more, pointing at each light in turn, then name the helper again so the eight stays honest: eight counted lights, one helper, nine lights shining.",
       "Lights-out round, in reverse: the last light placed is the first switched off, counted down — eight, seven, six — by the group, each light carried back to the basket by its placer. The count works both ways and the row ends empty."],
      "Four lights instead of eight, with the same one-at-a-time rule and a full recount after each — a shorter row is still a real row.",
      "No marked spots: the placer has to judge the spacing so eight lights fit the tray, and the group helps with 'a bit more room' calls.",
      safety="LED lights only, never real candles or matches — the record says why in plain words if a kid asks: real flames are a grown-up job away from this table. LED tealights with screw-closed battery covers only; a light with a loose cover is retired on the spot, because button batteries are a serious hazard for this age.",
      tags=HAN, copy_free=True, no_elimination=True),

    # ---------------- Seasons, designed for 3 (seasons primary at age 3: 3 -> 5) ----------------
    A("wind-ribbon-watch", "Wind Ribbon Watch",
      "Ribbons tied along a fence by a grown-up, and one job: watch them, point when a gust comes, and say which way the wind is pushing.",
      ["seasons", "outdoor"], (3, 6), (2, 16), (10, 20), ["outdoor"],
      ["six to ten long fabric ribbons or strips (adult-tied along a fence, rail, or low branch)", "a rug or blanket to sit on"],
      False, "Tie the ribbons up yourself before the group comes out: along one fence or rail, spaced out, each tied short enough that it cannot wrap around anything and long enough to stream properly — waist-height on an adult is about right for a seated group to watch. Tug every knot once; a ribbon that comes away in your hand gets retied now.",
      ["Sit the group on the rug facing the ribbons and state the one job: 'The ribbons tell us what the wind is doing. When a gust comes, point at the ribbons and call it.' Model the first call yourself, big and pleased: 'Gust!' — pointing is the participation, and it starts with you.",
       "Quiet watching round: everyone watches and nobody calls for the first minute. Ribbons hanging still, then stirring, then streaming — noticing the in-between states is the observation skill here, and it needs a quiet minute to show up.",
       "Calling round: gusts get pointed at and called by whoever spots the movement first, and the group answers the call by looking where the finger points. There is no score; a call everyone checks is a call that worked.",
       "Direction round: when a good gust streams all the ribbons one way, say the plain fact together: 'The wind is pushing them THAT way' — and everyone points the way the ribbons lean. Same wind, same direction, said as one group.",
       "Finish with the still test: the group watches for the moment every ribbon hangs completely still, and the kid who calls 'still!' first is believed only when the whole group agrees it is true — then one last gust usually ruins it, which is the correct ending and everyone knows it."],
      "Three ribbons only, tied close together, and the adult calls the first three gusts — a smaller picture to watch.",
      "Two ribbon spots in different places (fence and branch): the group watches one, then the other, and says which spot has more wind today.",
      safety="Ribbons are tied by an adult, out of reach of necks and climbing — nobody pulls ribbons down, ties them on themselves, or winds them around hands or wrists. The group stays seated on the rug during watching rounds; gusts are called with voices and fingers, not chased.",
      tags=SPR, copy_free=True),

    A("boot-print-snow-trail", "Boot Print Snow Trail",
      "Fresh snow, one short walk, and your own boot prints behind you: walk out, turn around, count your steps back along your own trail.",
      ["seasons", "outdoor"], (3, 5), (2, 12), (10, 20), ["outdoor"],
      ["fresh untrodden snow on flat ground", "boots for every kid", "one scarf or flag (the turnaround point)"],
      False, "Pick the patch honestly before the group comes out: flat, shallow fresh snow nobody has walked on yet, well inside the usual safe ground. Push the flag in at the far end yourself, walking around the patch's edge to get there so the middle stays clean — the untrodden snow is the whole point, and your own boots can spoil it before it starts.",
      ["Stand the group at the edge and look at the clean snow together first: 'Nobody has walked here. The first prints will be ours.' State the one rule: 'Walk in a line, in my steps or your own — and we all stop at the flag.'",
       "Walk out one kid at a time — or you first, then each kid in your prints or beside them — at a slow walk, all the way to the flag. Fresh prints appearing behind a walker is the sight this activity exists for, and the watchers at the edge get to see it happen.",
       "At the flag, turn around together and look back: a whole line of prints where there was nothing. Say the plain fact out loud: 'We made that. Those are our steps, saved in the snow.'",
       "Walk back in the prints: each kid tries to step in their own prints coming back — some will fit, some will land beside, and both are fine and funny. Nobody is corrected; prints in snow are allowed to be approximate.",
       "Edge count to finish: from the edge, count the prints you can see in one kid's trail out loud together, pointing at each one. However many it is, that is that kid's number of steps to the flag today — write nothing down, the snow keeps the record."],
      "A shorter patch and the adult's prints only: kids walk in the grown-up's big prints, which is its own game and needs no trail of their own.",
      "Two trails side by side — a kid and the adult walk out together — and at the flag the group compares: whose prints are bigger, whose are closer together.",
      safety="Flat snow only, a short route, boots on every foot, and the walk stays a walk — running in snow over unseen ground is how ankles turn. Cold is the limit: when hands or faces say they have had enough, the trail is done, finished or not, and going in is never a punishment.",
      tags=WN, copy_free=True,
      inclusion="Prints are prints: wheelchair tracks, a walker frame's marks, or the paired lines of a kid walking with support all write in snow exactly as boots do, and the trail count at the edge counts every track the group made. A kid who watches from the edge is the group's print-spotter — the first to call out when a new set of prints reaches the flag."),

    # ---------------- Rainy-day, designed for 3 (rainy-day primary at age 3: 3 -> 4) ----------------
    A("paper-puddle-stepping", "Paper Puddle Stepping",
      "Big blue paper puddles on the floor indoors, and the rule is the good one: step IN every puddle. Dry feet, wet pretend.",
      ["rainy-day", "pe-movement"], (3, 5), (2, 14), (10, 20), ["indoor"],
      ["eight to ten big blue paper or card ovals (adult-cut, each bigger than two kid feet)", "tape (to fix the puddles down)"],
      False, "Cut and tape the puddles down before the group arrives: a wandering route around the room, each puddle flat and taped at the edges — walk the route yourself and stamp on every puddle once; a puddle that slides or curls under your foot gets more tape now, because a skating puddle ends the game early. Leave honest gaps of floor between puddles: the dry parts are part of the route.",
      ["Show the route and state the one rule, which is the joy of it: 'Step IN the puddles. Both feet in, every time. The floor between is dry land — the puddles are the part we WANT.' Model one crossing yourself, landing two-footed in a puddle and standing in it proudly.",
       "One kid on the route at a time: step in, stand a moment, step out to dry land, step in the next. The standing-in is not a pause in the game — standing in a puddle you are allowed to stand in IS the game.",
       "Counting pass: the watchers count the puddles out loud as the walker stands in each one. The walker who hears their biggest number yet has done a longer route, and the group will say so.",
       "Heavy-rain round: the same route, but now each puddle gets two small stomps in it before moving on — indoor rain, paper water, real stomping, and the taped edges are why it works.",
       "Last pass is the flood: everyone walks the route together in a line, puddle to puddle, and the final puddle holds the whole group's feet at once if it can — count the feet in it together, then puddles are peeled up by their owners and stacked for the next rainy day."],
      "Five puddles in a straight line, close together, with an adult hand available the whole way.",
      "One fork in the route: two puddles side by side, and the walker chooses which one — the route is theirs from the fork on.",
      safety="Puddles are taped flat and tested by an adult first — a sliding paper oval on a hard floor is a fall, and any puddle that tears or lifts gets re-taped or removed on the spot. Stepping and stomping happen on the spot; nobody jumps puddle to puddle.",
      copy_free=True, no_elimination=True,
      inclusion="Wheeling across a paper puddle counts as stepping in it in full: a route wide enough for wheels is the setup, not an adaptation, and the counting pass counts those crossings with the rest. A kid can also be the rain — the one who calls 'heavy rain!' to start the stomp round and 'drizzle' to end it — a job with real weather authority."),

    # ---------------- STEM, designed for 3 (stem primary at age 3: 3 -> 5) ----------------
    A("big-tongs-ice-move", "Big Tongs Ice Move",
      "Big serving tongs, big ice cubes, one tray to another: grip one, carry it, drop it in, count it. Cold hands, careful work.",
      ["stem"], (3, 6), (2, 10), (15, 25), ["indoor", "outdoor"],
      ["big easy-squeeze serving tongs (one pair per kid working)", "big ice cubes (large moulds or bought big cubes)", "two trays or wide bowls per kid (one full, one empty)", "a towel (for drips and cold hands)"],
      False, "Freeze big cubes ahead — the biggest moulds you have; a cube that cannot be gripped by the tongs at all will teach nothing but frustration, so test your own pair of tongs on one cube before the group sits down. Set each working spot with a full tray, an empty tray a short carry apart, and the towel in reach: melting is guaranteed, so plan for the drips instead of minding them.",
      ["Start with tongs in the air, no ice: open, shut, open, shut — then pick up a soft thing (a big pom-pom or a sponge) and carry it across. The grip has to exist before the slippery version of it is fair to ask for.",
       "State the one rule: 'One cube at a time. The tongs carry it — hands do not help.' First cube together: grip low on the cube, lift a little, move slowly. A dropped cube goes back on the full tray and gets tried again; dropped is a normal result with ice, say so plainly.",
       "Moving round: each kid moves cubes at their own pace, and every cube that lands in the empty tray gets counted out loud by the mover — or by a counting partner — as it lands. The count is the record of the work.",
       "Melting check, halfway: stop and look at the full tray. The cubes are smaller and the tray has water in it. Say the plain fact: 'The ice is turning into water while we work. The last cubes will be the slipperiest.' They will be, and now the group knows why.",
       "Finish when the full tray holds only water: count the moved cubes one last time in the receiving tray, tip the melt water onto plants or the garden together, and dry the tongs with the towel — tools get put away dry, even at three."],
      "Bigger cubes, tongs with a shorter reach, and the two trays touching edge to edge — the carry is one small lift across a seam.",
      "Smaller cubes in the last round, or the receiving tray moved a step further away so the carry is longer and slower.",
      safety="Ice is for tonging and looking at, not for mouths — cubes big enough to grip are still a choking hazard if sucked small, so this is a watched table activity and cubes stay on trays. Cold hands get the towel and a break whenever a kid asks; numb fingers drop things, and that is information, not failure.",
      copy_free=True),

    A("pan-balance-heavy-light", "Pan Balance Heavy Light",
      "A two-pan balance and big things to test: one thing per side, watch which side goes down — that side is carrying the heavier one.",
      ["stem"], (3, 6), (2, 12), (15, 25), ["indoor"],
      ["a simple two-pan balance scale (sturdy classroom kind)", "pairs of big objects to compare (a big stone and a big sponge, a wooden block and a foam block, a full and an empty small bottle)"],
      False, "Set the balance on a table the group can see over and test it empty first: both pans level, beam swinging free — a balance that sticks or leans on its own gets fixed or swapped now, because a rigged result teaches the wrong lesson. Lay the object pairs out in a row where everyone can see them; every object must be big enough that no mouth is a plausible destination.",
      ["Start with the empty balance and the one idea, in plain words: 'Two sides. Put one thing on each side. The side that goes DOWN is carrying the heavier thing.' Do the first test yourself with the most obvious pair you have — stone versus sponge — and let the beam say it.",
       "State the one rule for the testers: 'One thing per side, hands off while it settles.' A kid chooses the next pair, places one object in each pan — with help lifting where needed — and everyone waits with hands behind backs while the beam decides.",
       "Call the result together, every time, in the same sentence shape: 'The stone went down. The stone is heavier.' The sentence is the science report at three, and the repetition is what builds it.",
       "Prediction round: before each new pair is placed, hands go on heads for 'this one will go down' — point at the object you back — then the balance settles it. Being wrong is data: 'We thought sponge. The beam says stone. The beam wins.'",
       "Finish with the equal test: the same object on both sides — two matching blocks — and the beam stays level. Say why, plainly: 'Same thing, same heaviness, nobody goes down.' Then objects go back in their row, in pairs, by the testers."],
      "The adult places every object and the kids only call the result — watching and naming is a full turn at this.",
      "Three-object line-up: test pairs until the group can lay three tested objects in a row from heaviest to lightest, using only the beam's results.",
      safety="Objects are big, blunt and unbreakable — nothing glass, nothing with edges, nothing small enough to mouth. Hands stay off the balance while it settles: fingers under a dropping pan get pinched, so the hands-off rule is said before the first object and kept kindly. The scale stays on the table; nobody carries it loaded.",
      copy_free=True,
      inclusion="The chooser's job is a full turn done entirely by pointing: a kid who picks the pair, points their prediction, and calls — or signs, or shows — 'down!' when the beam moves has run the test; a partner's hands do the placing to their direction. Directing the test is doing the test, and the group hears it said."),

    # ---------------- Team & community, designed for 3 (team primary at age 3: 3 -> 4) ----------------
    A("toy-wagon-pull-together", "Toy Wagon Pull Together",
      "A small wagon, a load of soft toys, and a blanket across the room: two pullers, one slow trip, every toy delivered together.",
      ["team-community"], (3, 5), (2, 12), (10, 20), ["indoor", "outdoor"],
      ["a small sturdy wagon with a pull handle (child-size)", "soft toys or beanbags (the cargo — six to ten pieces)", "a blanket (the delivery station)"],
      True, "Set the station first: the blanket laid flat across the room or yard, the wagon at the loading end with the cargo in a pile beside it. Test the route yourself with the empty wagon — a route the wagon tips on gets shortened or moved now; the pullers' job is pulling, not rescuing a tipped wagon. Check the handle and wheels roll freely.",
      ["Load together: the whole group puts the cargo in the wagon, one piece each in turn, counting the pieces in out loud. State the one rule before anyone pulls: 'The wagon goes slow, and it only goes when BOTH pullers are holding on.'",
       "Two pullers on the handle, side by side, hands on — and the trip is a walk, at the pace of the slower puller, with the rest of the group as the road crew walking alongside, never in front of the wheels.",
       "Halfway stop, on your call: pullers swap sides, road crew checks the cargo — a toy riding near the edge gets tucked back in by its loader. Checking the load is part of delivering it, said out loud.",
       "Arrive at the blanket: the group unloads together, one piece each in turn, laying the toys out on the blanket in a row — and counts them back out. The count in and the count out must match, and finding a missing one in the wagon is the group's detective moment.",
       "Return trip: two new pullers take the empty wagon back the same slow way, road crew alongside — then new loaders start the next delivery if there is time. Everyone who wants a turn pulling gets one before anyone gets a second."],
      "A shorter trip — blanket ten steps away — and one puller plus the adult's hand on the handle beside theirs.",
      "Two deliveries to two blankets: the loaders call which station each load is for, and the road crew has to remember it on arrival.",
      safety="Walking only, ever — a wagon pulled at a run tips, and tipping wagons land on feet. Hands on the handle only while pulling; nobody rides in the wagon, nobody sits on its edges, and fingers stay out of the wheels. The route keeps clear of slopes the wagon could roll down on its own.",
      copy_free=True, no_elimination=True,
      inclusion="Pulling is one job on a crew with several: the loader who counts the cargo in, the road-crew checker who tucks it safe, and the unloader who lays the row at the station all deliver the same toys. A kid can pull from a seated position alongside the handle's low end with the wagon moving at their pace — the wagon goes at the crew's pace, and the crew is everybody."),

    # ---------------- Icebreakers, designed for 3 (icebreakers primary at age 3: 3 -> 5) ----------------
    A("teddy-says-my-name", "Teddy Says My Name",
      "Every kid holds a soft toy, and the toy does the introducing: its name, your name, and one thing you love. Shy voices welcome — teddies are brave.",
      ["icebreakers"], (3, 6), (4, 20), (10, 20), ["indoor", "outdoor"],
      ["one soft toy or doll per kid (the program's, or their own from home)"],
      True, "Gather the toys in a basket in the middle before anyone sits: a mix of bears, dolls and whatever soft things the program owns, enough for a real choice — choosing your toy is the first minute of this activity and it is not wasted time. Sit the circle first, toys second, so the choosing does not happen over laps.",
      ["Each kid picks a toy from the basket and holds it in their lap. Model the whole thing first with your own toy, held up where the circle can see it: 'This is Bruno. Bruno says: my friend's name is Sam, and Sam loves puddles.' Short, plain, a bit silly — your turn sets the size of theirs.",
       "State the one rule: 'The toy does the talking.' The kid holds the toy up; the toy 'says' the kid's name and one thing they love — in the kid's own voice, a whisper to you that you relay in the toy's voice, or a point at the thing if it is in the room. All three are the toy talking.",
       "Go around the circle with no skipping-pressure: a kid who passes gets a 'teddy will wait' and the circle comes back to them once at the end, by which time they have heard ten examples and the toy has usually found its voice.",
       "Favourites echo: after each introduction, the whole circle says the love back to the toy — 'Puddles! Sam loves puddles!' — so every kid hears their thing said gladly by the whole room, once.",
       "Finish with the toys introduced to each other: two neighbouring teddies 'shake hands' (paws touched together by their holders) and the holders say each other's names across the handshake. Toys go back to the basket by name — 'Back you go, Bruno' — which the group will insist on doing properly."],
      "Names only, no favourite thing — the toy says the name, the circle echoes the name, done.",
      "Add the toy's own favourite: each toy also 'says' what IT loves (honey, naps, being squeezed), invented entirely by its holder.",
      safety="Toys are held, never thrown — a thrown teddy sits with the adult until its turn, kindly. Program toys go back in the basket at the end; a kid's own toy from home stays in their own hands throughout if that is what they need, and introducing from inside a hug counts in full.",
      copy_free=True, no_elimination=True),

    A("find-a-friend-wearing", "Find a Friend Wearing",
      "The grown-up holds up one big colour card. Somewhere in the circle, somebody is wearing that colour — go and stand with them, and wave.",
      ["icebreakers"], (3, 6), (6, 24), (10, 20), ["indoor", "outdoor"],
      ["five or six big colour cards (adult-made from coloured paper or card — big, plain, one colour each)"],
      False, "Make the cards ahead from the colours actually in the room: look at what the group wears on a normal day — red tops, blue shoes, yellow hair clips — and cut cards for those colours, big enough to read across the room. A colour nobody is wearing makes a dead round, so the deck is built from the room's real clothes, honestly.",
      ["Sit the circle and show every card first, with its colour named by the whole group out loud each time — the naming is the rehearsal, and a kid who can name the colour can play the whole game.",
       "State the one rule: 'I hold up a colour. If YOU are wearing it, stand up. Everyone else: find a friend who is wearing it, go and stand with them, and wave.' Nobody is out; the watchers have the finding job, which is the bigger one.",
       "First rounds are slow on purpose: hold the card high, let the wearing kids stand, then let the finders walk — walking, always — and gather. When every finder has landed, the whole gathered group waves at the circle and the colour gets named once more, together.",
       "Swap the job: the seated kids become the checkers — 'Is everyone standing with the right colour?' — and the group checks the gatherings honestly, kindly fixing a wrong-colour landing by walking the finder to the right group together.",
       "Finish with the rainbow round: hold the cards up one after another, fast enough to be funny, and each kid stands when their colour shows and sits when it changes — ending with every card fanned in your hands and the whole circle standing and waving at once."],
      "Two colours only, and finders walk with an adult to the first gathering — the route is learned before it is trusted.",
      "Two-colour cards: find a friend wearing BOTH colours, somewhere on them — a much harder hunt, and the checkers earn their job.",
      safety="Finding is walking — the colours get exciting, the feet do not, and that is said before the first card. Standing groups leave room around them; nobody pulls a friend to a gathering by the arm — you go and stand WITH them, which is the whole social point stated as a safety rule too.",
      copy_free=True, no_elimination=True,
      inclusion="Standing with the group is the landing however you get there — wheeling in, walking with support, or being the friend everyone gathers at all count exactly the same, and a bright colour on a wheelchair, a frame or a brace is a colour being worn, full stop. A kid who would rather hold the cards with the adult and choose the next colour has the job that runs the game."),

    # ---------------- Outdoor, designed for 3 (outdoor primary at age 3: 4 -> 5) ----------------
    A("watering-can-plant-round", "Watering Can Plant Round",
      "One small watering can, half full, carried with two hands to the real plants: pour slowly, empty it, and the plants have been watered by you.",
      ["outdoor", "seasons"], (3, 6), (2, 10), (15, 25), ["outdoor"],
      ["a small watering can (child-size, with a rose head if you have one)", "plants in pots or a garden bed that actually need water", "a tap, butt, or bucket of water (for refills, adult-managed)"],
      False, "Check the round yourself first with the can half full: walk it — a can that drips down your leg at a walk is too full, and a plant route crossing steps or slopes with a carried can is a route to shorten now. Half full is the working amount at three: heavy enough to feel like a job, light enough to arrive. Know which plants actually need water today; watering plants that do not is rehearsal, and kids can tell the difference by the soil — show them dry soil before you start.",
      ["At the first plant, teach the pour yourself: two hands on the can, tip slowly, water landing on the soil at the bottom of the plant, not on its leaves from a height. Say the one rule while you do it: 'Two hands, walking feet, water on the soil.'",
       "First carrier: fill the can half full together, and the kid carries it — two hands, at a walk — to the next plant, with you alongside and the group following as the watering crew. A spill on the way is water landing early, nothing more; it gets named as such and the round continues.",
       "The pour is the carrier's own: they tip, they watch the soil change colour as it drinks, they stop when the can is empty or you call 'that plant has had its drink'. Empty-can shake at the end is traditional and required.",
       "Crew jobs rotate with the can: the next kid refills with the adult, the next carries, and the kid who just poured becomes the soil-checker — finger touched gently to the soil, 'wet now' reported to the group. Every kid on the round has a job on every plant.",
       "Finish at the last plant with the empty can held up: the crew names every plant they watered, in order, pointing back along the round — then the can is emptied of its last drops onto the driest soil anyone can find, and hung up by its final carrier."],
      "Two plants, close to the water source, and the adult carries the can back empty — the pour and one short carry are the round.",
      "A longer round with a halfway refill, and the soil-checker reports 'still dry' or 'wet now' before each pour so the crew decides where the water goes.",
      safety="Half-full cans only, two hands, walking feet — a swinging can of water is heavy enough to pull a small kid off balance. Water goes on soil, never at faces or over other kids, and wet paths get walked around, not through: the round's own spills make the ground slippery behind it. Hands wash after garden work, every time.",
      tags=SPR, copy_free=True),

    # ---------------- Music & rhythm, designed for 3 (music primary at age 3: 4 -> 5) ----------------
    A("lullaby-rock-and-sway", "Lullaby Rock and Sway",
      "A soft doll in your arms and one slow song from the whole group: rock side to side in time, and when the song ends, the baby is asleep.",
      ["music-rhythm"], (3, 5), (4, 20), (10, 15), ["indoor"],
      ["one soft doll or toy per kid (the program's babies and teddies)", "no other materials — one slow song the adult can sing"],
      True, "Pick the song first and keep it slow and known: a lullaby the group has heard at rest time, or any gentle song you can sing without hurrying — the tempo of the song IS the tempo of the rocking, so a rushed song makes rushed rocking. Clear a sitting space where every kid can sit with legs out or crossed and a doll in their arms without an elbow in a neighbour.",
      ["Hand out the dolls and let everyone settle theirs in their arms their own way first — cradled, upright, over a shoulder. Then model the rock: side to side, slow, in time with your own humming of the song's first line. State the one rule: 'Rock with the song. When the song stops, the rocking stops — the baby is asleep.'",
       "First verse together: you sing, the group rocks their dolls in time, and you keep your own rock big and visible — your sway is the metronome the room is following, so make it steady and a little exaggerated.",
       "Quiet verse: the singing drops to a hum and the rocking gets smaller with it — not because anyone said to, but because the room can feel it. Name it afterwards, plainly: 'The humming made the rocking smaller. You did that by listening.'",
       "Swap the singer: a kid who wants to leads the next verse — singing, humming, or la-la-ing it — and the whole group's rocking follows THEIR speed. Following a friend's tempo instead of yours is the musicianship this activity is quietly teaching.",
       "Final verse, the sleep verse: sing it slower and quieter each line, the rocking shrinking with it, until the last line is nearly a whisper and the dolls are still. Hold the stillness for a count of five before anyone moves — a room full of sleeping dolls, rocked to sleep by their people, is the ending and it lands every time."],
      "One verse only, adult singing throughout, and rocking in laps while seated on the floor — the sway can be tiny and still be in time.",
      "Standing rock for the last verse: everyone stands, swaying with their doll, and has to keep the sway as slow standing as it was sitting.",
      safety="Dolls are rocked, never swung or thrown — a doll that leaves someone's arms sits the next verse out in the middle, kindly. Sitting spots get elbow room before the music starts; rocking into a neighbour is a spacing problem the adult fixes by moving spots, not a behaviour problem. Quiet voices are kept genuinely quiet — a lullaby at shouting volume is just shouting with a doll.",
      copy_free=True, no_elimination=True),
]

COLLECTION = {
    "id": "little-hands-fourth-shelf",
    "title": "Little Hands, Fourth Shelf",
    "glyph": "\U0001FA81",
    "when_to_use": "The fourth shelf for the youngest kids in the building: twelve more activities designed for three-year-olds first — a lantern carried with two hands, eight lights counted as they go on, paper puddles you are supposed to step in, and the carrying, pouring, rocking and delivering jobs a three-year-old day actually runs on. Grab it when the first three shelves have been through the rotation and the little-kid group is still yours next month.",
    "picks": [
        {"id": "lantern-carry-parade", "note": "Two hands on the handle, walking feet, lantern stays up. The row of lights on the rug at the end was carried there by them."},
        {"id": "eight-lights-line-up", "note": "Place one, switch it on, count from one together. Recounting every time is not slow — it is the practice."},
        {"id": "wind-ribbon-watch", "note": "Pointing is the participation. The kid who calls 'still!' has to convince the whole group — then a gust ruins it, correctly."},
        {"id": "boot-print-snow-trail", "note": "Walk out, turn around: a line of prints where there was nothing. The snow keeps the record; nothing gets written down."},
        {"id": "paper-puddle-stepping", "note": "Step IN every puddle, both feet, every time. Standing in a puddle you are allowed to stand in is the whole game."},
        {"id": "big-tongs-ice-move", "note": "One cube at a time, tongs only. The last cubes are the slipperiest, and by then the group knows why — melting."},
        {"id": "pan-balance-heavy-light", "note": "'The stone went down. The stone is heavier.' That sentence, said together, is a science report at three."},
        {"id": "toy-wagon-pull-together", "note": "The wagon only goes when both pullers are holding on. Count the cargo in, count it out — they must match."},
        {"id": "teddy-says-my-name", "note": "The toy does the talking, so shy voices get a brave front. A whisper relayed by the adult counts in full."},
        {"id": "find-a-friend-wearing", "note": "Find a friend wearing the colour and stand WITH them — nobody is out, and the finding job is the bigger one."},
        {"id": "watering-can-plant-round", "note": "Half full, two hands, water on the soil. The soil-checker reports 'wet now' — a real job, really done."},
        {"id": "lullaby-rock-and-sway", "note": "The humming makes the rocking smaller, and nobody had to be told. End on stillness, held for a count of five."},
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
