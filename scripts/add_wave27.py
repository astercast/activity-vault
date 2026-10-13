#!/usr/bin/env python3
"""Wave 27: First Years, Second Shelf — the age-3 cliff, continued.

Choice of frontier (stated here and in WAVELOG.md): wave 26's own honest
assessment said the age-3 cliff was "halved, not closed" — 22 activities
cover age 3 against 124 at age 4, and only 15 records in the whole archive
are early-years-only. The other candidate frontier, the thin subjects
(drama 11 / coding 6 by keyword), was recorded in wave 26 as "neither is
a shelf the Vault promises — recorded, not padded." That call stands:
teachers do not come to this archive asking for a coding shelf, but a
teacher handed the three-year-old room tomorrow morning is a real user
with a real shelf to fill. So this wave stays on the early-years build.

The 12 new records follow the wave-26 design rules exactly: age_min 3,
age_max <= 6, runs <= 25 minutes, big pieces, ONE rule per game, the
adult as a player rather than a referee. They also aim at the holes
inside age-3 coverage, not just the headline number — before this wave,
age 3 had ZERO primary-category coverage in stem, team-community and
rainy-day (those needs were met, if at all, by second-category tags on
records designed for somebody else):
- stem primary at age 3: cardboard-ramp-roll-lab, hand-lens-look-closer
- team-community primary: pass-it-down-delivery-line,
  ring-around-the-rosie-circle
- rainy-day primary: pillow-islands
Plus one new primary each for icebreakers, music-rhythm, outdoor,
crafts, quiet-focus and pe-movement at age 3.

Deltas this wave: total 564 -> 576; age-3 coverage 22 -> 34;
early-years-only (age_max <= 6) 15 -> 27; age 4 124 -> 136.
Enrichment: copy_free 184 -> 196 (all 12 need zero printing),
no_elimination 51 -> 57, inclusion 69 -> 74.

Near-duplicate screen: token Jaccard >= 0.55 against every existing
name+tagline is asserted in this script and fails the run. Closest
deliberate neighbours, kept on purpose:
- cardboard-ramp-roll-lab vs ball-drop-physics (8-12, timed drop on a
  built tower): here a low ramp, a soft ball, and "let go, don't push"
  is a three-year-old's first fair test — no timing, no tower.
- hand-lens-look-closer vs leaf-collect-sort-science (sorting finds):
  the lens is the whole activity here; nothing is collected or sorted.
- pass-it-down-delivery-line vs bucket-brigade-race (older, timed,
  water): hand-to-hand, seated-or-standing, no race and nothing spills —
  the job is that every hand touches every delivery.
- ring-around-the-rosie-circle vs freeze-dance / costume-parade-pose-
  freeze: a traditional singing circle game, hundreds of years old,
  played at walking pace with a sit-down ending — no elimination, no
  freezing contest. (The record does NOT repeat the plague-origin
  story; historians dispute it and a three-year-old needs neither
  version — it is introduced as what it verifiably is: a very old game
  whose words change from place to place.)
- pillow-islands vs lava-floor (4-12, cushions as islands — the closest
  neighbour in the archive, Jaccard 0.33): lava-floor is a timed
  scramble with elimination ("melted" players sit out or do jumping
  jacks) and islands that disappear each round. Pillow-islands removes
  every one of those mechanics for age 3: no countdown, no elimination,
  islands never disappear, one crosser at a time at walking pace on an
  adult-set route. Same furniture, opposite game — kept deliberately,
  and the record never borrows the lava framing.
- pillow-islands vs obstacle-course (design-your-own, older): five
  flat cushions an adult lays a step apart; the only rule is feet on
  islands. No course design, no timing.
- show-me-your-move vs mirror-march (5-12 partner march-copying) and
  animal-parade-march: one kid, one move, whole circle copies — the
  move can be a clap or a face, which is what makes it work at three.
- knee-drum-copycat vs rhythm-echo-clap (4-12, longer patterns) and
  bucket-drumming (instruments): one to three taps on your own knees,
  echoed back. No equipment, no pattern longer than three.
- texture-touch-basket-walk vs nature-color-match-walk (wave 26, match
  by EYE against color cards): this one matches by HAND — rough,
  smooth, soft — eyes are the backup, not the tool.
- big-dot-sticker-pictures vs torn-paper-collage (wave 26): tearing
  builds hand strength for scissors; peeling a big sticker is the
  pincer practice that comes before both. Different skill, same shelf.
- pool-noodle-rope-threading vs nesting-cup-towers / color-sorting-
  trays: threading big soft rings onto a rope is a two-hand job those
  stacking/sorting stations never ask for. Pool-noodle pieces are used
  precisely because they are too big and too soft to be a choking risk.
- jump-the-river-ropes vs jump-rope-countdown (skipping with a turning
  rope): two ropes lying still on the ground, one two-foot jump. The
  rope never moves; the river just gets a little wider.
- blanket-fort-book-nook vs cardboard-tunnel-crawl (wave 26): kids
  crawl THROUGH the tunnel; the fort is for sitting still in, with a
  book, in a small group — the quiet version of the same cardboard-and-
  blanket impulse.

Safety notes are practical only — no medical claims anywhere.

Run once: dedupes by id, writes data/activities.json + collections.json.
Run scripts/build.py afterwards.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_winter import A, DATA

PACK = [
    # ---------------- STEM, designed for 3 (first stem primaries at age 3) ----------------
    A("cardboard-ramp-roll-lab", "Cardboard Ramp Roll Lab",
      "One low ramp, three rollers, and the only rule a fair test needs at three: let go — don't push.",
      ["stem"], (3, 5), (2, 12), (15, 25), ["indoor"],
      ["a stiff piece of cardboard or a wide board (about a metre long)", "two or three books to prop one end", "a soft ball", "a chunky toy car", "a wooden block", "painter's tape (for distance lines)"],
      False, "Prop one end of the cardboard on two books — knee height on a three-year-old, no higher. Stick three tape lines on the floor out from the ramp's foot: near, middle, far. Roll everything yourself once first; a ramp that throws the ball sideways gets its books adjusted before any kid touches it.",
      ["Start with the ball. One kid kneels at the top, sets the ball on the ramp, and lets go — hands off the moment it moves. 'Let go, don't push' is the whole rule, and it is what makes the roll honest.",
       "Everyone calls where it stopped against the tape lines: near, middle, or past far. Move a pebble or a sticky note to mark the ball's best roll.",
       "Now the car. Same ramp, same let-go rule. Cars usually beat balls, and the group will have opinions about why — wheels is the answer most of them land on, in their own words.",
       "Now the block. It slides, thumps, or stops halfway, and that small failure teaches more than the two successes: not everything rolls, and shape is the reason.",
       "Last round is dealer's choice: each kid picks their favourite roller for one final go, and the group calls the landing line together before it stops rolling."],
      "One book instead of two (a gentler ramp) and only the ball — one roller, one rule, done.",
      "Raise the ramp by one book and predict first: point at the tape line you think it will reach, then roll and check.",
      safety="Ramp stays low — propped on books, never on chairs or shelves. Waiting kids sit behind the top of the ramp, never at the bottom where the rollers land, and the soft ball is the only ball: hard balls and ramps do not mix at this age.",
      copy_free=True),

    A("hand-lens-look-closer", "Hand Lens Look-Closer",
      "A big magnifying lens turns one leaf, one shell, one scrap of bark into a whole expedition — no collecting, just looking.",
      ["stem", "outdoor"], (3, 6), (2, 16), (15, 25), ["outdoor", "indoor"],
      ["chunky hand lenses / magnifying glasses (one per kid if you have them, one per pair if not)", "a tray of look-at things: leaves, shells, bark, pinecones, a feather, fabric scraps"],
      False, "Set the tray out and test every lens yourself — a scratched or cloudy lens is just a frustration with a handle. Outdoors, pick a small patch of ground with plenty in it (the edge of a garden bed beats the middle of a field) and walk it first for anything sharp or unpleasant.",
      ["Hand out the lenses and show the one move that matters: lens close to the thing, then move the lens — not your head — slowly away until it goes big and clear. Every kid practises on their own hand first; the lines on a palm are the first discovery.",
       "Tray round: each kid picks one thing and looks properly — a full minute on one leaf is not slow, it is the activity. Veins, edges, the tiny hairs nobody sees with plain eyes.",
       "Swap-and-tell: trade objects with a neighbour and say one thing the lens showed you that your eyes alone missed. One thing is the whole report at three.",
       "Take the lenses outside to the chosen patch. Leaves still on the plant, bark still on the tree, bugs looked at and left exactly where they were found.",
       "Finish back at the tray: hold up the plain leaf and the lensed leaf side by side in words — 'What did the lens know that we didn't?' Collect the answers; they are better than any worksheet."],
      "One shared lens and the tray only — the adult holds each object, kids take turns looking.",
      "Draw what the lens showed: one leaf, drawn big, with the veins the lens found. Drawing from the lens, not from memory.",
      safety="Lenses are for looking, never for aiming at the sun — say it once, plainly, before they go out: never point a lens at the sun or look through it at the sun. Living things get looked at where they live and left there; hands wash when the group comes back in.",
      copy_free=True,
      inclusion="A kid with low vision is this activity's natural expert-by-feel: pair the lens with touch — the same leaf's edge, bark's roughness — and let them report what fingers find that lenses can't. Every find can be told, pointed at, or held up; nobody has to describe in sentences to have found something."),

    # ---------------- Team & community, designed for 3 (first team primaries at age 3) ----------------
    A("pass-it-down-delivery-line", "Pass-It-Down Delivery Line",
      "A line of hands moves soft picnic things, one at a time, into the basket — every hand touches every delivery.",
      ["team-community"], (3, 5), (4, 20), (10, 20), ["indoor", "outdoor"],
      ["a basket or box", "soft things to deliver: plush fruit, beanbags, rolled socks, a soft toy loaf (8-12 items)"],
      True, "Stand the basket at one end of the room and the pile of soft things at the other. The line stands (or sits) between them, close enough that a small arm can hand to the next small arm without a stretch — move the kids, not the standard: if a handoff needs a lunge, the gap is too wide.",
      ["Show the one rule with the first item, walking it down the line yourself hand to hand: 'Hands only, no throwing — the next hands have to be ready.' Ready hands are held out, palms up.",
       "Start the deliveries one at a time. The caller (you, at first) names the item as it sets off — 'The apple is travelling!' — and the line watches it travel.",
       "When the basket end receives an item, it goes in the basket with a small ceremony: held up, named, dropped in. The line applauds its own delivery.",
       "Speed comes by itself and needs no help. When the line is smooth, send two items at once, a few hands apart, so every kid is both receiving and passing.",
       "Finish by tipping the basket out together and counting the deliveries back onto the pile — every item made the trip, and every kid can be asked which one their hands carried best."],
      "A shorter line (four kids), a bigger basket opening, and the adult as the permanent middle hand.",
      "Add the quiet round: the whole line delivers in silence, listening to the small sounds soft things make — then a backwards round, basket to pile.",
      safety="Soft things only — if it would hurt dropped on a bare foot, it does not travel. Nothing goes over heads; a dropped item is picked up by the nearest hands, never dived for.",
      copy_free=True, no_elimination=True,
      inclusion="The line works seated, standing, or mixed — chairs in the line are part of the line, not a special arrangement. A kid who passes with one hand, with two, or by sliding the item along a tray table is passing, full stop; the rule is hands ready, and ready looks different on different bodies."),

    A("ring-around-the-rosie-circle", "Ring Around the Rosie Circle",
      "The very old singing circle game: hold hands, walk the ring, sing the short song, and all sit down together on the last line.",
      ["team-community", "music-rhythm"], (3, 5), (6, 24), (10, 15), ["indoor", "outdoor"],
      ["no materials — just a clear patch of floor or grass"],
      True, "Clear a circle big enough for the whole group to stand in holding hands with elbows bent — if arms are pulled straight and tight, the circle is too big or the group needs two rings. Practise the ending once before the song: on 'all fall down' everyone sits, nobody drops.",
      ["Join hands and walk the circle slowly while you sing the short song — 'Ring around the rosie, a pocket full of posies, ashes, ashes, we all fall down.' Slow walking is the correct speed; the game falls apart fast and works at a stroll.",
       "On 'fall down' everyone sits where they stand, still holding hands if they can. The sitting-together is the joke and the point — give it a beat, then stand back up holding on.",
       "Second round, the group picks the direction: circles that only ever go one way are a missed trick. Walk it the other way and sing it again.",
       "Change one thing per round, never more: a tiptoe round, a round with a very quiet song, a round where the song gets slower and slower until the sit-down takes forever.",
       "Finish with the slowest round the group can manage — a song stretched so long that the fall, when it finally comes, gets the biggest laugh of the session."],
      "A smaller circle, a hand on an adult's arm instead of a neighbour's hand, and a chair placed at the circle for any kid whose sitting down is easier with one.",
      "Add a second verse the group invents — one new action line ('we all jump up!') sung to the same tune, agreed before the round starts.",
      safety="The fall is a sit, never a drop or a pull: hands let go rather than drag a neighbour down, and the pace stays at a walk — a running ring of three-year-olds holding hands is a pile-up waiting for its moment. Check the ground for anything hard before the first round.",
      copy_free=True, no_elimination=True,
      inclusion="The circle seats as happily as it stands: a kid in a chair or a wheelchair is a full part of the ring, hands held on both sides, and on 'fall down' the whole circle sits to their level — the game adapts to its players, the way it has for a very long time. The words vary from place to place and family to family; sing the version your room knows and say so — that variation is the game's real history."),

    # ---------------- Rainy-day primary at age 3 ----------------
    A("pillow-islands", "Pillow Islands",
      "Flat cushions become islands in a pretend sea — step from island to island, and the floor is the water.",
      ["rainy-day", "pe-movement"], (3, 5), (2, 14), (10, 20), ["indoor"],
      ["flat cushions, pillows, or foam mats (5-8, the flatter the better)", "a soft toy (the island visitor)"],
      True, "Lay the islands a short step apart — one small stride for a three-year-old leg, tested with your own shortest step, not your longest. Flat cushions only: a fat squashy pillow wobbles, and wobbling is a different, harder game. Push each island firmly and make sure it does not skate on the floor; on hard floors, foam mats or cushions with grippy bottoms are the right call.",
      ["Walk the route yourself first, slowly, naming it: 'Island… island… island.' Then state the one rule: 'Feet on islands. The floor is the sea.'",
       "One kid crosses at a time, any speed they like. Everyone else is the shore crew, watching from the carpet edge — watching crossings is where the route gets memorised.",
       "When the whole group has crossed, carry the soft toy across: the visitor travels in two hands, which means no hands free for balance, which is the quiet hard version wearing a friendly face.",
       "Move one island — just one, a little further or off to the side — and cross the new route. Same sea, new map.",
       "Finish by gathering the islands into one big island pile-up: everyone who wants to stands or sits on the joined islands together for the group portrait moment, then islands get stacked away by the shore crew."],
      "Three islands, close enough to step without stretching, with an adult hand crossing alongside.",
      "A wider gap on one hop (a step becomes a small jump), or a beanbag carried on the head for the visitor round.",
      safety="Flat, non-skid islands only, spaced for stepping — never for leaping — and one kid on the route at a time. If an island slides when you test it, it does not go down; a moving island is a fall, not a game.",
      copy_free=True, no_elimination=True),

    # ---------------- Icebreaker at age 3 ----------------
    A("show-me-your-move", "Show Me Your Move",
      "One kid shows one move — a stomp, a wiggle, a face — and the whole circle does it back. That is the entire game.",
      ["icebreakers", "pe-movement"], (3, 6), (4, 24), (10, 15), ["indoor", "outdoor"],
      ["no materials"],
      True, "Stand or sit the group in a circle where everyone can see everyone. You are in the circle and you go first — the adult's move sets the size of move that counts, so make yours small and silly rather than athletic.",
      ["Show your move once, plainly: two stomps, or a big slow nod, or your best fish face. Say only: 'This is my move. Show me your move' — and the whole circle does it back to you.",
       "Go around the circle one kid at a time. Each kid shows one move; the circle copies it exactly once, all together. Copying is the compliment — say that out loud early, because at three, being copied can read as being laughed at until an adult names it as the good part.",
       "A kid who cannot think of a move gets the menu, offered quietly: stomp, clap, wiggle, freeze face. Or they can pass the turn and take the next one — the circle comes back around, and second turns are often braver.",
       "When a move is a hit, the circle will ask for it again — allow exactly one encore per kid, so the game keeps moving and every mover gets the same-sized moment.",
       "Finish with a mash-up: you call back three favourite moves in a row and the circle does the sequence — the group's own dance, built out of their own moves, none of yours."],
      "Adult and one neighbour model every move together, and the menu stays visible: four picture-less choices, named the same way each round.",
      "Two moves in a row from the same kid, copied as a pair — the first real sequence work, and the bridge to copying patterns.",
      safety="Moves stay in your own space — no touching moves, no running moves, nothing that ends on the floor. A move that needs the whole room gets admired and shrunk together, not banned.",
      copy_free=True, no_elimination=True,
      inclusion="A move is anything a body can offer: a blink pattern, a sound, a head tilt, a hand wave, a face. A kid who moves differently moves differently — the circle copies the move as it was given, exactly, which is the rule for everyone and the reason the game belongs to the whole room."),

    # ---------------- Music & rhythm at age 3 ----------------
    A("knee-drum-copycat", "Knee Drum Copycat",
      "Tap a tiny pattern on your knees — one, two, or three taps — and the circle taps it straight back.",
      ["music-rhythm"], (3, 5), (2, 20), (10, 15), ["indoor"],
      ["no materials — knees are the drums"],
      True, "Sit the group on the floor or on chairs, knees reachable, hands free. Sit where every kid can see your hands. That is the whole setup; the game lives or dies on patterns staying short.",
      ["Tap once on your knees and hold your hands up, palms out — 'your turn.' The circle taps once back. That single tap, answered by twenty small drummers, is a bigger moment than it sounds.",
       "Build by ones only: two taps, answered; three taps, answered. Never jump from one to three — the pattern grows one tap at a time, and the group should feel it grow.",
       "Add one shape, not more taps: tap-tap-PAUSE-tap. The pause is a sound too — hold your hands up through it so the circle sees the silence.",
       "Hand the drum over: a kid leads a pattern of up to three taps and the circle answers. Leaders will invent pauses before you teach them; let them.",
       "Close with the quietest pattern the room can do — fingertips on knees, three taps, answered at the same whisper volume. Ending quiet is a skill, and this is how it gets practised."],
      "One tap only, echoed several times, with the adult tapping along with the circle so nobody drums alone.",
      "Four taps, or a pattern split between knees and one clap — knees for low sounds, clap for the high one.",
      safety="Hands on your own knees only. A pattern that turns into slapping gets slowed down, not scolded — speed is what turns tapping into hitting, and the leader sets the speed.",
      copy_free=True, no_elimination=True),

    # ---------------- Outdoor at age 3 ----------------
    A("texture-touch-basket-walk", "Texture Touch Basket Walk",
      "A short walk with empty baskets and one job for small hands: find something rough, something smooth, something soft.",
      ["outdoor", "seasons"], (3, 6), (2, 20), (15, 25), ["outdoor"],
      ["a small basket, bucket, or bag per kid (or one per pair)", "your own three starter finds: a rough stone, a smooth stone, a soft leaf or petal"],
      False, "Walk the route alone first with your hands, not just your eyes: you need to know the rough bark, the smooth stone, and the soft leaf are actually out there, and that nothing on the route is sharp, spiky at face height, or best left alone. Set the turnaround point where the group can be kept in sight of one adult the whole way.",
      ["Start at base with your three finds. Pass them around slowly, hand to hand, and name them with the group: rough, smooth, soft. Three words is the whole vocabulary of the walk.",
       "Set off slowly. The first call is rough: kids hunt with their hands — bark, stones, a fence post — and a find only counts when it has been touched and agreed. Finds that can be carried go in the basket; finds that are part of the place (bark on a tree) get touched, named, and left.",
       "Second call: smooth. Stones and worn wood are the usual winners, and the hunt slows down, which is exactly right — smooth things hide better than rough ones.",
       "Third call: soft, the hardest of the three. Leaves, petals already fallen, grass, moss where it grows. Nothing gets picked off a living plant for softness; fallen things only, and if soft is not out there today, the group says so and the basket tells the truth.",
       "Back at base, empty the baskets into three piles — rough, smooth, soft — and run a hand over each pile once more. The piles are the report: the walk, sorted by touch."],
      "Two textures only (rough and smooth), finds made right around base, and a shared group basket.",
      "Add a fourth word — hard/soft is a different question from rough/smooth, and cold is the winter version nobody expects.",
      safety="Touch with hands, never with faces or mouths, and the adult names the no-touch list before setting off: anything sharp, anything spiky, anything that belongs to an animal. Hands get washed when the group comes back in.",
      copy_free=True,
      inclusion="This is the rare hunt where eyes are the backup tool: a kid who sees differently leads this one by hand, literally — their rough/smooth/soft calls get checked by everyone else's fingers, and the checking is the game. Finds can be carried back or just touched and reported; the basket is not the score."),

    # ---------------- Crafts at age 3 ----------------
    A("big-dot-sticker-pictures", "Big Dot Sticker Pictures",
      "Peel a big dot sticker, place it where you want it — the pincer practice that comes before scissors, pens, and everything else.",
      ["crafts"], (3, 5), (2, 24), (15, 25), ["indoor"],
      ["large dot stickers (2cm across or bigger, a few sheets per kid)", "sturdy paper or card (one sheet per kid)", "crayons (for drawing around the dots, optional)"],
      False, "Bend each sticker sheet back slightly along the rows before handing it out — a sheet that has been loosened peels kindly, and a sheet that hasn't is ten minutes of an adult peeling dots while twenty kids wait. Put out two or three colours only; the whole rainbow turns the session into choosing, not sticking.",
      ["Show the peel once, slowly, with your fingertips at the edge of one big dot: pinch, lift, carry it over, press it down flat and pat it. Then do the hard part out loud: 'It stuck to my finger. That happens. Peel it off the finger, stick it on the paper.'",
       "Everyone peels and sticks freely for the first minutes. Dots anywhere — in rows, in piles, in one glorious corner stack. There is no picture to copy and no wrong place for a dot.",
       "When sheets are warming up, offer the first gentle shape: 'Can your dots walk across the page?' A line of dots travelling edge to edge is the first sticker picture most kids make, and it is enough.",
       "Offer crayons for anyone who wants them: draw around the dots, join dots together, give a dot a face. The sticker starts the picture; the kid finishes the sentence.",
       "Close with the flat-pat round: everyone pats every one of their dots down one last time — a dot half-peeled at pickup time is a picture that loses pieces in the backpack — then names go on the back, as dictated, in adult handwriting."],
      "The adult pre-peels the first row and leaves the dots hanging half-off the sheet edge, ready to pinch; smaller sheet of paper, fewer dots.",
      "Stick to a plan: an outline shape to fill with dots (a big circle, a first initial), or a dot pattern — red, blue, red, blue — read off a finished example.",
      safety="Big dots only at this age, and stickers live on paper, skin, and clothes by agreement — never over eyes, never in mouths, and a dot found heading for a mouth gets swapped for a crayon job, quietly. Sheets and stray dots get collected at the end; a loose sticker on the floor is a slipping spot.",
      copy_free=True),

    # ---------------- Quiet focus at age 3 ----------------
    A("pool-noodle-rope-threading", "Pool Noodle Rope Threading",
      "Big soft rings of pool noodle, one thick rope — thread them on, slide them down, pull them off, start again.",
      ["quiet-focus"], (3, 5), (1, 8), (10, 20), ["indoor"],
      ["pool noodles cut into rings about 5cm thick (10-14 rings, adult-cut ahead of time)", "a thick soft rope or a length of webbing strap (about a metre per station)", "a tray or basket for the rings"],
      False, "Cut the noodle rings ahead of time, adult-only, with a serrated knife, and check every ring's hole is clean through. Tie one end of the rope to a chair leg or table leg at toddler height and knot a finished ring onto the other end as a stopper — that stopper is what keeps the whole string from sliding off and undoing a small kid's work.",
      ["Show the thread once, slowly, with the biggest ring: rope tip through the hole, pull until the ring slides down and bumps the stopper. Then take it off again — on and off are both the game, and showing the off first means nobody is afraid of a mistake.",
       "Kids thread at their own pace. Some will fill the rope end to end; some will put three rings on and take them off for twenty minutes. Both are doing the station correctly.",
       "When a rope is full, carry it — two hands, adult walking alongside — to show one person, then slide every ring off into the basket and count them back out loud. The count is the reset, not a test.",
       "Add one quiet challenge at a time: thread only the blue rings, or make the rope wear a pattern — big ring, little ring — by choosing from two sizes.",
       "Close the station properly: rings counted into the basket, rope untied and coiled by the adult with a helper holding the end, tray back on the shelf ready for the next small hands."],
      "Fewer, fatter rings and a shorter, stiffer strap (webbing threads more kindly than floppy rope); the adult holds the far end up so the hole stays findable.",
      "A two-colour pattern read off a finished example rope, or threading against a gentle sand-timer for kids who ask for the race version.",
      safety="Rings are big and soft on purpose — nothing here is small enough to be a choking worry, and the rope is only ever out at the station, with an adult in the room: a loose rope and a climbing three-year-old never share a space. Cut edges get checked once for crumbly bits before the station opens.",
      copy_free=True),

    # ---------------- PE & movement at age 3 ----------------
    A("jump-the-river-ropes", "Jump the River Ropes",
      "Two ropes on the ground make a river. Stand at the bank, jump with two feet, land on the other side.",
      ["pe-movement"], (3, 5), (2, 16), (10, 20), ["indoor", "outdoor"],
      ["two ropes, tape lines, or long scarves (the riverbanks)", "a mat or grass for the landing side if the floor is hard"],
      False, "Lay the two ropes parallel, about a foot apart — a three-year-old's honest two-foot jump, tested against the smallest jumper you know, not the biggest. Anchor the ends so the ropes lie still; a riverbank that slides when stepped on ends the game early. Put the landing on carpet, mats, or grass.",
      ["Stand at the bank yourself and show the whole jump slowly: feet together, knees bend, swing arms, jump, land on two feet and freeze like a statue for one count. Landing still is part of the jump — say so, and show the wobble too.",
       "One jumper at a time. Everyone else stands on the far bank as the welcoming side — the cheer when a jumper lands is half the equipment of this game.",
       "A jumper who steps in the river has not failed anything: the current got them, they climb out, and they jump again from the bank. Rivers at three are for practising on.",
       "When the whole group has crossed twice, move the far rope out by one hand-width. One hand-width is the correct amount of harder, and the group should watch you measure it.",
       "Last crossings are dealer's choice: jump it, or take the stepping-stone version — one big step across — and the group finishes by rolling the river up together."],
      "Narrow the river to a hand-width, or drop the jump entirely: a big step across a tape line is the same game at an earlier page.",
      "Widen the river another hand-width, or cross it backwards — turn around on the bank, jump, and land facing where you came from.",
      safety="Ropes lie flat and still, the landing is soft, and only one kid jumps at a time with the landing clear before the next jump starts. Bare feet or grippy shoes — socks on hard floors turn landings into slides.",
      copy_free=True, no_elimination=True),

    # ---------------- Quiet / rainy-day corner at age 3 ----------------
    A("blanket-fort-book-nook", "Blanket Fort Book Nook",
      "An adult-built blanket fort, a small pile of picture books, and room inside for three readers at a time.",
      ["quiet-focus", "rainy-day"], (3, 5), (2, 6), (15, 25), ["indoor"],
      ["two or three large blankets or sheets", "chairs or a low table to drape them over", "cushions for the floor inside", "a small pile of sturdy picture books", "clothespins or clamps (adult-handled)"],
      False, "The adult builds the fort, start to finish, before any kid goes in: blankets draped over chairs or a low table, edges clamped, one wide opening that stays open. Test it the way it will be tested — lean on nothing, but tug every edge once; a fort that sags during building gets rebuilt now, not during reading. Line the floor inside with cushions and put the book pile just inside the opening.",
      ["Show the fort from outside first and name what it is: a reading nook, a quiet place, three readers at a time. Walk the opening rule: 'In through the door, out through the door — the walls are blankets, and blankets are not doors.'",
       "First readers go in with the adult sitting at the opening — inside the fort's world, able to see every reader, close enough to hand over books. Pick the first book together and read it at fort volume: the soft voice a small roof asks for.",
       "Between books, readers may swap with the waiting pair at the door — the door swap is part of the ritual, done slowly, book handed over with the swap. Nobody queues long: three short reads inside beat one long sit.",
       "Leave a looking-book round in every visit: one book with no reading at all, just pages turned and pictures pointed at, fort-quiet. Pointing at a picture and naming it is reading at three, and the fort is where it gets taken seriously.",
       "Close the nook properly: books carried out two at a time and stacked, cushions shaken and piled, then the group helps the adult fold the blankets — the fort comes down together, which is the last small job of the session."],
      "A bigger opening, an adult reader inside for the whole round, and only two readers at a time.",
      "A torch-free 'night reading' round: blankets doubled for dimness (opening still wide and uncovered), and readers retell the book they just heard to the next pair at the door.",
      safety="Adults build and clamp; kids never do, and nothing heavy ever goes on top of the blankets. The opening stays wide and uncovered the whole session, an adult can see inside at all times, and the fort is never a hiding place — if a reader cannot be seen, the fort gets rebuilt smaller.",
      copy_free=True),
]

COLLECTION = {
    "id": "little-hands-next-steps",
    "title": "Little Hands, Next Steps",
    "glyph": "\U0001F9E6",
    "when_to_use": "The second shelf for the youngest kids in the building: twelve more activities designed for three-year-olds first — the first-ever STEM, team, and rainy-day records written for that room, plus the copying games and quiet stations a three-year-old day actually runs on. Grab it when First Years has been through the rotation and the little-kid group is still yours next week.",
    "picks": [
        {"id": "cardboard-ramp-roll-lab", "note": "Let go, don't push — a fair test, run at knee height, with a block that refuses to roll and teaches the most."},
        {"id": "hand-lens-look-closer", "note": "One leaf, one lens, one full minute of looking. The palm-print practice round is the discovery that hooks them."},
        {"id": "pass-it-down-delivery-line", "note": "Every hand touches every delivery. Seated lines count in full — ready hands are the only rule."},
        {"id": "ring-around-the-rosie-circle", "note": "Walked, never run, with a sit-down ending. The slowest final round gets the biggest laugh in the building."},
        {"id": "pillow-islands", "note": "Feet on islands, floor is the sea. Flat cushions only — a wobbling island is a different game."},
        {"id": "show-me-your-move", "note": "One kid, one move, the whole circle copies it back. Copying is the compliment — name it out loud."},
        {"id": "knee-drum-copycat", "note": "Patterns of one, two, three taps, grown one tap at a time. Needs nothing but knees."},
        {"id": "texture-touch-basket-walk", "note": "Rough, smooth, soft — a hunt run by hand, where a kid who sees differently is the natural leader."},
        {"id": "big-dot-sticker-pictures", "note": "Peel, carry, pat flat. Loosen the sheets first or you will spend the session peeling for twenty kids."},
        {"id": "pool-noodle-rope-threading", "note": "Big soft rings on a tied-down rope — threading practice with nothing small enough to worry about."},
        {"id": "jump-the-river-ropes", "note": "The river widens one hand-width at a time, and stepping in it is never failing — it is practising."},
        {"id": "blanket-fort-book-nook", "note": "Adult-built, door always open, three readers at a time. Fort volume is the soft voice a small roof asks for."},
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
