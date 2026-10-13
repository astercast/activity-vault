#!/usr/bin/env python3
"""Wave 33: Little Hands, Just Three, Once More — the fourth 3-only wave.

Wave 32's honest assessment named this wave the same way waves
29-31 named theirs: the age-3 gap (94 against 160 at age 4, gap
66) "closes only by more waves of this kind, at honest quality,
or not at all." Three consecutive 3-only waves have narrowed it
102 -> 90 -> 78 -> 66. This is the fourth: twelve more records
banded 3-3, built to the rules waves 30-32 proved — short
(<= 20 minutes), adult-led, big pieces, one rule per game, the
adult as a player — because the band is honest for the same
reason: these are three-year-old moments (a pretend gold coin
carried in two hands, a firefly counted by its blink and never
caught, a beanbag balanced on a head for the length of a line),
and age 4, holding 160 records, does not miss them.

Measured before this wave (primary category = categories[0],
records covering age 3): holidays and team-community were the
floor at 7 each; seasons / stem / icebreakers / outdoor /
music-rhythm 8 each; crafts 9, pe-movement 9, rainy-day 10,
quiet-focus 12. Rainy-day (31) is still the thinnest primary
category on the whole shelf, then music-rhythm (33) and seasons
(35). So the pack repeats the proven shape exactly: one record
for every one of the 11 categories — the floor rises 7 -> 8
everywhere — plus a second rainy-day record. Result, asserted
in the wave log: age 3 94 -> 106, age 4 unchanged at 160, the
headline gap 66 -> 54, narrowed for the fourth wave running.

Near-duplicate screen: token Jaccard >= 0.55 against every
existing name+tagline is asserted below and fails the run.
Closest deliberate neighbours, kept on purpose:
- big-gold-coin-pot-carry vs paper-diya-welcome-row (wave 32,
  Diwali lamps carried in two hands along a floor path): a
  different festival, named as itself, and a different cargo —
  the diyas are placed and lit where they land and never picked
  up again; the coins are dropped INTO a pot with a clink, one
  by one, until the pot holds the whole group's carrying.
- first-firefly-blink-count vs after-rain-worm-count (wave 32,
  residents on a path counted with eyes and touched by nobody):
  nothing here is on a path or under feet — the counted things
  fly, blink, and vanish between counts, at dusk, and the rule
  is not "do not touch" but "catch nothing, jar nothing".
- big-pillow-mountain-climb vs pillow-islands (wave 27, pillows
  stepped BETWEEN as islands, never landed on): the islands
  forbid landing; the mountain is built to be climbed OVER —
  hands and knees up, a sit at the top, hands and knees down.
- blanket-sled-slow-pull vs blanket-carry-teddy-to-bed (wave
  30, four corners carrying a teddy passenger): the cargo there
  is a toy held by four carriers walking; here the blanket is
  a sled, the rider is a child seated on it, and the only
  puller is the adult, on a floor, at walking pace.
- big-smell-jar-sniff-and-say vs mystery-feel-boxes (touch
  guessed blind): nothing is hidden and nothing is guessed for
  points — the jar is opened, sniffed, and NAMED, and "I don't
  know" with a second sniff is a complete turn.
- big-felt-quilt-wall-build vs mlk-freedom-quilt-squares
  (older kids' paper squares carrying drawn dreams): these
  squares are felt, hand-sized-plus, pattern-only, and the
  quilt is built standing at a wall board by pressing each
  square edge to edge with its neighbours — the building is
  the teamwork, not the decorating.
- big-hat-pass-and-say vs pass-the-face (an expression copied
  round a circle): no face is copied — a hat travels hand to
  hand while the adult sings, and when the song stops the
  holder wears it and says their name and one favourite thing.
- big-texture-feet-path-walk vs texture-touch-basket-walk
  (wave 27, rough/smooth/soft hunted by HAND from baskets):
  the same sense, the other end of the body — textures here
  are walked on, slowly, one panel at a time, and the report
  is given in foot words ("tickly", "cold-smooth").
- big-pot-lid-cymbal-band vs loud-quiet-song-switch (wave 28,
  one known song, volume cued by hands): no song is sung here —
  the instrument is a pot lid, the score is the conductor's
  two hands, and the skill is starting and STOPPING together.
- big-finger-paint-sky-sheet vs big-brush-painting (wave 26,
  big brushes on big paper): the tool is the painter's own
  fingers — no brush exists in the room — and the picture is
  one shared sky whose clouds are dabbed with fingertips.
- big-beanbag-balance-walk vs two-foot-landing-pads (wave 28,
  the landing skill): nothing lands or jumps — a beanbag rides
  a head down a short line at the slowest possible walk, and a
  fall is picked up and carried on from, never a turn ended.
- big-peg-clip-card-row vs big-zip-up-down-board (wave 32, a
  zip's two-handed patience): nothing slides — a chunky peg is
  SQUEEZED open and clipped onto a card's edge, squeeze is the
  whole skill, and the pinch rule is taught before the first
  peg, on the adult's own finger, as a demonstration.

Safety notes are practical only — no medical claims anywhere.

Run once: dedupes by id, writes data/activities.json + collections.json.
Run scripts/build.py afterwards.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_winter import A, DATA

STP = ["holiday:st-patricks-day"]
SUM = ["season:summer"]

PACK = [
    # ---------------- Holidays, just 3 once more (holidays age-3 primary 7 -> 8; floor) ----------------
    A("big-gold-coin-pot-carry", "Big Gold Coin Pot Carry",
      "Palm-sized pretend gold coins carried in two hands, one at a time, and dropped into the big pot with a clink — the whole group's carrying, collected.",
      ["holidays"], (3, 3), (4, 16), (10, 20), ["indoor"],
      ["big pretend gold coins (adult-made: stiff gold card discs, wider than a kid's palm, edges smooth, one per kid plus spares)", "one big pot (a sturdy bucket or plastic cauldron) at the path's end", "a short clear carrying path from the coin basket to the pot"],
      False, "Make the coins yourself beforehand — big, stiff, and honestly pretend: gold card, palm-and-a-half wide, no foil small enough to peel. Say the framing plainly in your own head before the group hears it: St. Patrick's Day is a real celebration, and the pot of gold at the rainbow's end is a pretend story people tell with it — the record keeps those two things separate and so does the session. Test the pot's clink yourself: the coin landing must be HEARD, because the sound is the receipt each carrier is carrying toward.",
      ["Name the day and the story in two plain sentences: 'Today is for St. Patrick's Day. People tell a pretend story about a pot of gold at the end of a rainbow — it is a story, not a real thing, and stories are for playing. We are playing it big.' State the one rule: 'Two hands carry the coin. Walking feet. The coin goes in the pot, and only in the pot.'",
       "First coin together, yours: carry a coin in two hands down the path at walking pace, hold it over the pot, and let it drop — CLINK — while the group listens. Say what just happened in the smallest words: 'One coin, carried all the way, in the pot.' Then look in together: one coin looks lonely in a big pot, which is exactly the problem this group is about to solve together.",
       "Carrying round: one carrier at a time, coin in two hands, walking feet, the drop done by the carrier's own hands over the pot. Carriers walk back empty-handed along the path's edge. A dropped coin on the way is picked up by its own carrier and the carry simply continues — the path forgives, the pot waits, and nobody's carry is ever re-done by anyone else.",
       "Halfway listen: stop the carrying, gather round the pot, and have the last carrier drop a coin in while everyone stays quiet for the clink and the rattle of the coins already there. Name the change out loud: 'The pot sounds different already — fuller.' Three-year-olds who can HEAR the job half done will finish it like savers.",
       "Finish when every coin is in: the final carrier drops theirs, the group counts the pot's coins by lifting them out one at a time back into the basket — the count is the second game hiding inside the first — and the tell-back is plain: 'Every coin in this pot got here in two hands, at walking pace, one carrier at a time.' Coins away, pot away, story closed as a story."],
      "A four-coin pot only and a path of six steps, the adult walking each carry beside the carrier with a hand hovering under the coin without touching it.",
      "Two pots and a sorted carry: gold coins to the big pot, plain card coins to the small one — carriers must read their coin before they set out and walk to the right pot.",
      safety="Coins are big stiff card, far too wide for a mouth and with nothing peelable or detachable on them — a coin that gets chewed or starts to delaminate retires on the spot. The pot is sturdy and stays where the adult put it; nobody climbs in, sits in, or reaches deep inside it while others are dropping — drops happen over the rim, at arm's length, one carrier at a time. Carrying is walking, always: a running carrier holding a coin at face height with both hands has no hand free to fall on, and the rule exists for exactly that reason.",
      tags=STP, copy_free=True, no_elimination=True,
      inclusion="A coin's carry counts however it travels: on a lap tray wheeled along the path's edge, held against a chest in two hands from a seated carry-position at the pot's side, or directed — 'carry it... drop it NOW' — while the adult's hands do exactly what the director's words say. The pot-side listener job, calling 'CLINK — one more in!' at every landing, belongs to whoever holds it and is the pot's official scorekeeper."),

    # ---------------- Seasons, just 3 once more (seasons age-3 primary 8 -> 9) ----------------
    A("first-firefly-blink-count", "First Firefly Blink Count",
      "Out at dusk on a summer evening: fireflies blink over the grass and the group counts the blinks together — catching nothing, just counting light.",
      ["seasons"], (3, 3), (3, 14), (15, 20), ["outdoor"],
      ["a grassy spot the group knows, at dusk in firefly season (the adult has checked the same week that fireflies are actually out there)", "a blanket or mat to sit on together", "no other materials — eyes only, and staying together is the equipment"],
      True, "The set-up is season, hour, and honesty, and all three are the adult's: fireflies come out at dusk in the warm months, so this is an evening activity taken when the summer offers it, not scheduled against it. Check the spot yourself the same week — fireflies actually blinking over that grass — because a firefly count with no fireflies is just sitting outside, and the record refuses to promise insects it has not met. The blanket goes where the group can see open grass and sky without wandering: the fireflies come to the counters, never the other way round.",
      ["Settle on the blanket while there is still a little light and say the plain true framing: 'When summer nights come, tiny beetles called fireflies fly over the grass and blink a light from their tails — on, off, on, off. Tonight we are counting the blinks.' State the one rule whole: 'We count with our eyes. We catch nothing and we jar nothing — the fireflies stay free, and so does their light.'",
       "First blink together: everyone watches the grass quietly, and the first blink anyone sees gets called — 'THERE!' — and counted out loud by the whole group: 'One.' A blink argued over ('that was a plane') is settled kindly by waiting for the next one: fireflies blink again, planes do not blink like that, and the grass itself provides the evidence within the minute.",
       "Counting stretch: the group counts blinks as they come, in chorus, at firefly pace — which means long quiet watches between numbers, and the quiet is not a gap in the activity, it IS the activity. The adult keeps the running total on fingers where counters can see it grow, and recounts it at every tenth blink: 'Ten blinks over our grass.' Nobody has to count past what they can — hearing the count grow is counting, at three.",
       "Blink-pattern moment, if the evening offers it: two fireflies blinking near each other — 'That one answered that one!' — and the group watches whether the pattern repeats. Say only what eyes can check: sometimes they do seem to answer, and watching for it is the oldest firefly science there is. A firefly that lands on the blanket's edge is looked at, not touched, and takes off on its own schedule to general respect.",
       "Finish as the dark settles and the blinking thickens: one last minute of counting, the total told back whole — 'Twenty-three blinks we counted, and hundreds we didn't' — and the plain cycle said out loud: 'The fireflies will blink all night without us. Tomorrow night they will be here again.' The group leaves the grass to its owners, blanket carried between them, at walking pace, in the near-dark they have all just practised seeing in."],
      "A porch or window version: counters watch from behind a screen door or window, the blinking grass beyond it, the count kept in whispers as a bedtime game.",
      "Blink-map round: the adult sketches the grass patch on a big sheet as blinks land — a dot per blink where it appeared — so the group can see WHERE the fireflies gathered by the end of the evening.",
      safety="The group stays on the blanket, together, for the whole count — dusk is not the hour for a three-year-old to wander toward something interesting, and the counting works precisely because the counters stay still and the fireflies come past. Catch nothing, jar nothing, touch nothing that lands: a firefly's light is its own business, and hands stay on laps or the blanket. The adult checks the grass spot in daylight first — no holes, no nests, no surprises — and everybody is up and moving back inside while there is still light enough to walk by.",
      tags=SUM, copy_free=True, no_elimination=True,
      inclusion="Counting light is already everybody's game: a counter stationed at the blanket's edge in any seat they use has the same grass, the same sky, and the same vote on whether that blink counted. Calls can be a word, a point, or a hand raised fast — every call is checked by the group the same way, and a blink only one counter saw still enters the count on their word, because at dusk, on a blanket, everybody's eyes are instruments."),

    # ---------------- Rainy-day x2, just 3 once more (rainy-day age-3 primary 10 -> 12; floor + thinnest category) ----------------
    A("big-pillow-mountain-climb", "Big Pillow Mountain Climb",
      "A mountain of big soft pillows built by the grown-up: hands and knees up one side, a sit at the top, hands and knees down the other — one climber at a time.",
      ["rainy-day"], (3, 3), (3, 10), (10, 20), ["indoor"],
      ["big pillows and cushions (the biggest and firmest the room has — sofa cushions are perfect)", "a mat or rug under the whole mountain (the mountain's ground)", "a clear floor space the adult has fenced with the room itself: mountain in the middle, waiting line at its foot"],
      False, "Build the mountain yourself before the climbers arrive, and build it like it will be climbed on, because it will: biggest, firmest cushions at the bottom, each layer pressed down by your own knees and weight first — a mountain that shifts under the adult will shift under a child, and a shifting mountain is retired and rebuilt, not apologised for. Test the whole route yourself on hands and knees: up, the top flat enough to sit on for a real moment, down the far side to the mat. One route, obvious, with the way down as built as the way up.",
      ["Show the mountain and climb it yourself first, slowly, narrating nothing but the plain job: 'This is our mountain. Mountains are climbed UP one side, and DOWN the other. Watch my hands — hands and knees, the whole way.' State the one rule: 'One climber on the mountain. Everybody else waits at the bottom, and the next climber starts when the mountain is empty.'",
       "First climbs, close up: the first climbers go with you right beside the mountain, a hand hovering — not holding — near each climber, ready for a wobble that mostly does not come. Hands and knees up, and coach the top out loud: 'You are nearly there... hands on the top pillow...' The summit sit gets its full moment: every climber sits at the top, looks at the room from the mountain's height, and is seen by the whole waiting line. Being beheld from above is half the climb's pay.",
       "Climbing round: climbers rotate in line order, known in advance, the descent finished and feet on the mat before the next climber's hands touch the first pillow. A climber who wants the summit twice waits for a second turn like everyone — the mountain keeps, and its queue is fair. Cheering from the line is the line's whole job and they will invent its forms themselves; all forms are traditional from the first climb onward.",
       "Wobble moment, planned for kindly: a pillow will shift mid-climb for someone, sooner or later. The climber stops, you steady the mountain with your hands, the climber backs down or climbs on — their call, made from stillness, never from a slide. Then the mountain gets its repair in front of everyone: pressed down, tested, declared rebuilt. A mountain that gets mended openly teaches more trust than one that pretends to be rock.",
       "Finish with a full-group summit photo that exists only in memory if need be: the last climber sits at the top, the line gathers at the foot, and the tell-back counts something true: 'Every climber in this room went up one side and down the other, on their own hands and knees.' Then the mountain comes down the builders' way — cushions carried back one at a time, in two arms, by the climbers themselves: unbuilding is mountaineering too."],
      "A foothill version: one layer of cushions only, a climb of two steps up and over, summited and descended in under a minute per climber.",
      "A flag for the summit: each climber carries a big soft flag up in one hand (three points of contact becoming the honest challenge) and plants it beside them for the length of their summit sit.",
      safety="One climber on the mountain at a time, ever — the rule is the activity's whole safety system, and the waiting line stands at the foot, behind the descent side, where no descending climber can land on a watcher. The mountain is adult-built, adult-tested, and adult-rebuilt the moment it shifts; jumping off the top is not a descent, ever — down is hands and knees, like up, said first and held kindly. Climbers climb in bare feet or grippy socks on a mat that does not slide: a mountain on a skating rug is a fairground ride, and this is mountaineering.",
      copy_free=True,
      inclusion="The mountain has a route at every height: a low summit annex — one wide cushion at the mountain's side, same up-and-over shape at a tenth of the height — belongs to the same climb and earns the same summit sit and the same cheering. A climber can also serve as the mountain's official tester: seated at the top by the adult's lift for the summit moment alone, having directed the whole inspection — 'press that one... that one wobbles... rebuild it' — which is the mountaineer's oldest job, reading the mountain."),

    A("blanket-sled-slow-pull", "Blanket Sled Slow Pull",
      "One big blanket on a smooth floor, one seated rider holding its edges, and the grown-up pulling slow and straight — an indoor sled ride at walking pace.",
      ["rainy-day"], (3, 3), (2, 8), (10, 15), ["indoor"],
      ["one big sturdy blanket (thick, no fringe or tassels, big enough for a seated kid plus a pulling flap at the front)", "a smooth floor run (the adult has walked it: long, straight, clear at both ends)", "no other materials — the rider's two hands on the blanket's edges are the harness"],
      False, "Choose the blanket and the run like equipment, because they are: the blanket must be sturdy enough to take a seated rider's weight sliding, with a front flap long enough for your two hands and no fringe a finger could wind into. The run is walked first by you — smooth floor, no thresholds, no rug edges to catch, a clear stopping space at each end, and nothing at rider height along the sides. Test-pull it yourself with a cushion rider: the blanket should glide, not lurch, and the start must be a creep, not a jerk — you will practise the start until it is boring, because the riders deserve boring starts.",
      ["Lay the blanket at the run's start and say the plain framing: 'This blanket is a sled, and this floor is its snow. A sled rider sits in the middle, holds the edges, and the sled goes SLOW — I am the pulling horse, and horses in this room walk.' State the one rule: 'The rider sits and holds on. Only the grown-up pulls. Nobody stands on the sled, ever.'",
       "First ride together, shortest version: the first rider sits cross-legged in the blanket's middle, hands gripping the edges beside their hips, and you pull the run at half length and walking pace while the waiting group watches the method — start slow, pull straight, stop slower. The rider's review is taken seriously and out loud: 'Too fast? Too wobbly?' — and the pulling adjusts to the review, in front of everyone, so every rider knows their review will steer their ride too.",
       "Riding round: riders take turns in line order, full run, there and back counting as one ride. The turn-around at the far end is done stopped: rider stays seated, you walk the blanket round in a wide slow arc, and the return begins only when the rider calls 'Ready!' A rider who never calls ready simply waits, enjoying the far end, for exactly as long as they like — the sled departs on the rider's word, and that is written on the activity, not improvised.",
       "Cargo variant once the riders are seasoned: a rider may carry one big soft passenger — a teddy or cushion — held in their lap with both arms, which changes the ride honestly: hands busy with cargo cannot hold edges, so this version goes at half pace again and half length. The first cargo ride gets the first-rider review treatment all over again, because a new version deserves new consent.",
       "Finish with the blanket's own ceremony: the last rider rides to the middle of the run, stops there, and the whole group gathers on and around the blanket for the tell-back — 'Every rider sat, held on, and was pulled slow.' Then riders help fold the blanket in half, and half again, hand over hand along its edges: the sled becomes a blanket again by the hands that rode it, which is the right way for a magic floor to end."],
      "A half-length run at creep pace with the adult pulling on knees beside the blanket's front corner, one hand on the blanket and one near the rider, for the newest riders in the room.",
      "A two-stop route: the run passes a marked 'station' (a taped line), where the sled stops, the rider names a place they are travelling to, and only then does the pull continue — a journey with geography.",
      safety="The blanket is pulled by the grown-up only, at walking pace or slower, in a straight line — no swings, no spins, no sudden stops: a sled that lurches pitches its rider, and the start and stop are both creeps for that reason. Riders sit, always — a standing rider on a moving blanket is a fall already happening — and hands hold the blanket's edges, never a wrist, rope, or another person. The run is walked and cleared by the adult first and kept clear during rides: a loose toy on a sled run is a brake made of surprise, and there are no surprises on this floor.",
      copy_free=True,
      inclusion="The sled comes to every rider: a rider can be seated on the blanket in the position that suits their body — cross-legged, side-seated, or reclined against a cushion backrest the adult wedges safely behind them — and the pull stays the same slow pull, because the ride is the glide, not the posture. A rider who prefers to direct can stand with the adult as co-horse in name: they call 'walk on... and... stop' and the sled obeys their voice exactly, which is driving in full by the oldest method on any farm."),

    # ---------------- STEM, just 3 once more (stem age-3 primary 8 -> 9) ----------------
    A("big-smell-jar-sniff-and-say", "Big Smell Jar: Sniff and Say",
      "Big jars with one honest smell each — orange peel, cinnamon, fresh mint: lid off, one sniff, and say what your nose found. Nothing to guess, nothing to win.",
      ["stem"], (3, 3), (2, 8), (10, 15), ["indoor"],
      ["big wide-mouth jars with lids (adult-prepared, one smell per jar: orange peel, a cinnamon stick, fresh mint leaves, a piece of vanilla pod or a few coffee beans — foods and plant things only)", "a tray the jars travel on", "big picture cards of each smell's source (adult-drawn or printed BIG — the matching is by nose first, card second)"],
      False, "Prepare the jars yourself and check every one with your own nose first: each smell must be findable in one honest sniff — too faint teaches nothing, and anything sharp, perfumed, or chemical has no place in these jars at all, ever. Foods and plant things only, and you have checked the group's allergy list against every jar before the tray comes out: a jar whose smell belongs to a food a child in the room is allergic to simply does not exist today. Labels live on the lids' undersides for your eyes only; the jars themselves stay mystery jars until a nose reports.",
      ["Bring the tray in covered and say the plain framing: 'Your nose knows things your eyes cannot see. In these jars are smells — real smells of real things. We are going to sniff, and say what our noses find.' State the one rule: 'One sniff at a time, jar held by the grown-up, and nothing in a jar is ever tasted or touched. Noses only.' Demonstrate on yourself: lid off, jar below your chin — never pressed to a face — one sniff, and your own report said like a scientist: 'That smells warm and spicy. I think it is cinnamon.'",
       "Sniffing round: the first jar travels the group on its tray, each sniffer in turn — jar held by you at chin height, one good sniff, a second if wanted — and the report is theirs to phrase: a name, a description ('like oranges!'), a feeling ('smells like Grandma's kitchen'), or an honest 'I don't know,' which gets the picture cards brought out and the smell matched to its source by looking and sniffing together. Every report is written into the air the same way: 'Orange peel — found by Maya's nose.'",
       "Compare round, once all jars have travelled: two jars side by side, sniffed in turn by volunteers — 'Which one is the mint?' — noses voting by pointing at the jar, the lids flipped to show the labels as the verdict. Getting it wrong here is data, said that way: 'Your nose said orange for the mint — mint can trick a nose. Sniff again.' A nose learning its own tricks is the science, and it only arrives through the misses.",
       "Favourite-smell vote, the quiet middle: each sniffer names the jar they'd take home, and the adult stacks those jars at the tray's front in vote order — the group's official ranking, built by noses. Expect the orange to win and the coffee to start arguments; both outcomes get reported in the tell-back as the findings they are.",
       "Finish with the sources revealed properly: each jar opened beside its real source — the actual orange, the actual mint sprig — and one last sniff of jar and source together, so noses leave knowing the smell has an address. Jars are lidded, tray carried out by you, and the last plain sentence is the method itself: 'We found out what was in the jars without looking. The nose did that.'"],
      "Two jars only, with smells a world apart (orange and mint), and every sniffer guaranteed a findable difference inside ten minutes.",
      "A mystery fifth jar joins, unknown even in ranking — prepared by another adult — and the group must place it by sniffing: a new smell, or one of today's four wearing a different jar? Noses argue, then the lid decides.",
      safety="Foods and plant things only — nothing perfumed, chemical, or sharp ever goes in a smell jar, and essential oils are banned from this activity outright: concentrated is the opposite of what a three-year-old's nose is for. The group's allergy list is checked against every jar before the tray comes out, and jars are held by the adult at chin height, never pressed to a face or passed hand to hand. Nothing is tasted and nothing is touched: a sniffer who feels sneezy or done turns their head away and their turn is complete, because a nose's 'enough' is a full scientific report.",
      copy_free=True,
      inclusion="A report arrives in any form a nose can file it: a word, a point at the matching picture card, a thumbs-up or a screwed-up face that the adult translates faithfully and checks — 'Sour face means the coffee? Then coffee it is, found by your nose.' The jar is brought to each sniffer's chin at the height and distance the sniffer directs, and a sniffer who directs the jar's tour for the whole group — choosing the order, calling each nose forward — has run the laboratory in full."),

    # ---------------- Team & community, just 3 once more (team age-3 primary 7 -> 8; floor) ----------------
    A("big-felt-quilt-wall-build", "Big Felt Quilt Wall Build",
      "Hand-sized felt squares carried one at a time to a big wall board and pressed edge to edge — a quilt the whole crew builds standing up, square by square.",
      ["team-community"], (3, 3), (4, 14), (15, 20), ["indoor"],
      ["big felt squares (adult-cut: a hand-and-a-half across, in four or five colours, one per builder plus spares)", "a big flannel or felt wall board at kid height (felt sticks to felt — test yours)", "a basket of squares at the room's other end (the quilt's supply depot)"],
      False, "Test the sticking before the builders arrive, because the whole activity stands on it: a felt square pressed flat with a whole palm onto your board must STAY — ones that curl or slide get retired now, not mid-build, and the board itself is fixed to the wall or a stand so it cannot rock under a pressing hand. Mark nothing on the board: no grid, no outline. The quilt's pattern belongs to the crew, and a builder arriving at a blank board with a square in hand is facing the real job quilters face — where does MY piece belong?",
      ["Show the empty board and one square and say the plain job: 'Quilters sew quilts out of squares. Ours sticks instead of sewing. Every square in that basket has to travel here and find its place on the board — edge touching edge, no gaps where we can help it. When the board is full, the quilt is built.' State the one rule: 'One square carried at a time, two hands, and you press your own square on yourself.' Press yours on first, alone in the board's middle-top, with a full flat palm: 'The first square is the hardest to place. It has no neighbours yet.'",
       "Building round: builders travel one at a time — square chosen from the basket by its own builder, carried in two hands, placed where that builder decides — with the single craft taught as it is needed: 'Press the corners. A square sticks by its corners.' Neighbours get named as they arrive: 'You put the red one beside the blue one — they are touching all along that edge. That is a quilt seam.' Placing is never corrected; a square placed crooked is placed, and the next builder's square negotiates with it, which is how real quilts and real crews both work.",
       "Gap watch, the build's middle: when the board is half covered, stop the carrying and look together. Gaps show themselves — felt-board showing through in quilt-shaped holes. 'The quilt has windows. Who is carrying a square that could close a window?' Builders choose squares FOR the gaps now, judging size and fit with their eyes before they travel, and a square that fills a window exactly gets the crew's full appreciation, because fitting is the builder's highest skill and everyone just saw it.",
       "Last-square ceremony: when one space remains, the crew chooses its final builder by the fairest method the room owns — the builder who has carried fewest squares carries the last. It is pressed on with the whole crew watching and the count done aloud: 'Square number twenty-four... ON.' A board covered edge to edge, built by a line of two-handed carries, is looked at in silence for one breath before anyone speaks. Quilts deserve the breath.",
       "Finish with the quilt's story told back along its rows: who carried the corner squares, where the window was, which two colours kept ending up neighbours. The quilt stays up for the day — it is the room's now — and comes down at tidy time square by square into the basket, peeled slowly by their own builders, which every builder will tell you is somehow the best part."],
      "A half board: twelve squares fill a smaller board completely, so a small crew gets the whole arc — first square, gap watch, last square — inside fifteen minutes.",
      "A pattern promise: the crew agrees a pattern first (red in every corner, say) and builds to keep it — corners claimed and defended by planning, the quilt's first design meeting.",
      safety="Felt squares are big, single-piece, and plain — no buttons, pins, beads, or sewn-on anything exists on a square at this age, because a quilt square at three is a thing that will be carried against chests and occasionally faces. The board is fixed so it cannot tip or rock under pressing hands, and builders press with flat palms, not body weight leaned through the board into a wall fixings' mercy. Carrying happens one builder at a time along a clear lane: a roomful of square-carriers crossing paths at once is a quilting bee held in a corridor, and the lane exists so nobody has to dodge with both hands full.",
      copy_free=True, no_elimination=True,
      inclusion="Every square travels however its builder travels: on a lap tray to the board's edge, pressed on from a seated position at the board's low side — the board's lowest row is reserved, by the crew's own law, for builders who place from sitting height — or placed high by a builder directing the adult's hands as their stepladder: 'there... left a bit... PRESS.' The gap-watcher job, stationed at the board calling windows as they appear, is the build's chief engineer and never touches a square at all."),
]
PACK += [
    # ---------------- Icebreakers, just 3 once more (icebreakers age-3 primary 8 -> 9) ----------------
    A("big-hat-pass-and-say", "Big Hat Pass and Say",
      "One big soft hat travels hand to hand while the grown-up sings; when the song stops, whoever holds it puts it on and says their name and one favourite thing.",
      ["icebreakers"], (3, 3), (5, 18), (10, 15), ["indoor"],
      ["one big soft hat (floppy, clean, big enough to sit loosely on any head in the room — the sillier the better, and it belongs to the group, not to a costume box's depths)", "no other materials — the grown-up's singing voice is the music"],
      True, "Know your hat before the circle does: it must be soft all through (no stiff brim edge at face height), clean enough to pass head to head — it gets a wash before its first circle and between groups as a matter of course — and big enough that wearing it is never a squeeze. Rehearse your stopping song too: any song the group knows, sung by you, that you can end mid-line without apology, because the stop is the mechanism and it must be allowed to arrive anywhere.",
      ["Hold the hat up and say the plain bargain: 'This is the talking hat. While I sing, the hat travels — hand to hand, round the circle. When my song STOPS, the hands holding the hat keep it, and that person puts it on and tells us two things: their name, and one favourite thing. Then the singing starts again.' State the one rule: 'The hat travels hand to hand. It is never thrown, and it only goes on a head when the song stops.'",
       "First stop together, rigged kindly: sing, pass the hat hand to hand yourself with the first holders, and stop the song with the hat in YOUR hands. On it goes, and you model the whole introduction at full size: 'My name is Teacher Sam, and my favourite thing is puddles.' Two sentences, said proudly, by a person wearing a ridiculous hat — the room now knows exactly what courage is required, and exactly how small it is.",
       "Passing rounds: the song restarts, the hat travels — sometimes three hands, sometimes right round the circle — and every stop produces one wearer and one introduction, received by the circle with the group's own growing ceremony (a clap, a cheer, the name said back: all traditional by the third stop). A wearer may pass on the favourite and give only their name; the hat accepts, the circle accepts, and the record notes that a name alone, said aloud in a big hat, is a complete introduction at three.",
       "Hat-respect moment, arriving on schedule: the hat will be grabbed for, worn mid-song, or worn by three heads at once in a pile-up of enthusiasm, usually by week two of knowing it. The rule is restated as hat law, kindly: 'The hat is one person's at a time, and its person is chosen by the song stopping. The hat is patient. We are learning to be patient like the hat.' It lands, because by then the hat has a personality and the room is fond of it.",
       "Finish when the hat has been worn by everyone who wants a turn — want being the operative word, checked honestly round the circle — with a final all-group photograph taken in memory: every introduced name said back in order round the circle by the group, as the hat makes one last slow lap held high. Then the hat goes to its hook, where it lives between circles: furniture now, not a prop, and rooms treat it accordingly."],
      "A small circle of five and a short song: the hat completes the whole circle inside ten minutes and every intro gets its full ceremony.",
      "Favourite-thing themes: today's hat asks for a favourite FOOD, tomorrow's a favourite ANIMAL — the introduction grows a category, and returning wearers must reach for a new answer.",
      safety="The hat is soft, group-owned, and washed before its first circle and between groups — a hat that travels head to head is laundry with a job, and it is treated that way. It is passed hand to hand, never thrown: a thrown hat at three is followed by thrown everything, and the hat's dignity is the circle's. Wearing is always by the wearer's own hands at the song's stop; nobody places the hat on another person's head, and a holder who does not want to wear it may hold it on their lap and introduce themselves to the hat instead, which counts completely.",
      copy_free=True, no_elimination=True,
      inclusion="The hat's circle includes every seat as it stands: it travels lap to lap and tray to tray as faithfully as hand to hand, and its stopping-place is wherever it stops, honoured identically. An introduction arrives by voice, by sign, by a picture card held up for the favourite thing, or by the adult voicing what the wearer indicates — the hat's two questions answered in any language the circle can receive. The song-keeper job, choosing which song the hat travels to, belongs to whoever holds it and programs the whole session."),

    # ---------------- Outdoor, just 3 once more (outdoor age-3 primary 8 -> 9) ----------------
    A("big-texture-feet-path-walk", "Big Texture Feet Path Walk",
      "A short path of big panels — grass, a smooth mat, sand in a tray, a soft towel: walked slowly, one panel at a time, and every panel reported in foot words.",
      ["outdoor"], (3, 3), (2, 10), (10, 20), ["outdoor"],
      ["big texture panels laid as a path (a patch of real grass, one smooth mat, one wide shallow tray of clean play sand, one thick soft towel — each at least two kid-feet wide)", "a bucket of water and a towel at the path's end (the foot-washing station)", "the path laid somewhere flat and familiar (the adult has walked every panel in bare feet first)"],
      True, "Walk the whole path yourself in bare feet before any small foot touches it — every panel, at a three-year-old's pace, feeling for the stone, the stick, the tray edge, the one rough corner: your feet are the inspection, and anything they find that argues gets removed, not explained. Panels are wide and their joins are flush, because a path is walked looking AHEAD at the next texture, not down at the joins. Sand is clean play sand, fresh-checked; grass is a patch you know — untreated, unhurried by dogs, and said so in the set-up because bare feet trust what they are told.",
      ["Gather at the path's start, shoes off together, and say the plain framing: 'Your feet can feel things your hands never touch the ground with. This path has four feelings in it. We are going to walk it SLOWLY, and after each one, your feet will tell us what it was like.' State the one rule: 'One walker on the path. Feet walk — nobody runs a feeling.' Walk it yourself first, narrating honestly in foot words: 'Grass: tickly and cool. Mat: smooth, nothing to say. Sand: soft and it moves. Towel: warm and squishy.'",
       "Walking round: one walker at a time, at the slowest honest walk, stopping ON each panel for its report before stepping to the next. Reports are taken in whatever words feet produce — 'cold-smooth', 'scratchy-soft', 'like the beach', a wince and a giggle that the adult translates and checks: 'Tickly AND a bit sharp? Then tickly-sharp goes in the record.' Interpreters at each panel's end (the previous walkers, now experts) receive each new report like weather news.",
       "Eyes-up challenge, the path's real skill: on a second walk, volunteers walk looking at the adult at the path's end — not at their feet — and must call each panel's name from feeling alone as they cross it. Misses are celebrated precisely: 'Your feet said SAND on the towel — the towel fooled your feet!' A path that can fool a foot is a path worth walking a third time, and the queue for thirds forms by itself.",
       "Favourite-panel vote: each walker stands at the end beside the panel they'd walk all day, and the panels' standings get told back in body words: 'Grass wins. Six feet out of eight would live on the grass.' Disagreement is data — the sand's two loyalists defend it in foot words and the defence is recorded with the result.",
       "Finish at the washing station, which is ceremony, not hygiene-afterthought: every walker rinses and dries their own feet, panel by remembered panel — 'off comes the sand, off comes the grass' — and shoes go back on over feet that have been somewhere. The tell-back is the path itself: 'Tickly-cool, smooth, soft-moving, warm-squishy. Four feelings, one path, walked by every foot here.'"],
      "Two panels only (grass and towel — the world's most different neighbours) and a path of six steps, walked three times each by a very small group.",
      "A fifth panel joins mid-path — a tray of smooth pebbles, adult-sorted for size — and walkers must find where the path changed with eyes up, from feeling alone.",
      safety="The path is walked first, barefoot, by the adult, every session — feet find what eyes miss, and a panel with a sharp surprise in it is removed whole, never walked around. One walker at a time, walking only: the panels include a sand tray with edges, and a running foot meeting a tray rim is the path's one real hazard, designed out by pace. Feet are washed at the end without exception — the grass patch is chosen untreated and dog-free, and the washing is still total, because paths hold more than textures and clean feet are how this activity closes its books.",
      copy_free=True,
      inclusion="The path is walked at every height it is met: a walker whose feet travel by wheel is offered the same four textures under HANDS on a parallel table path — grass in a tray, smooth mat, sand, towel — reported in hand words with identical ceremony, because the sense is the activity, not the limb. A walker can also serve as the path's announcer, stationed at its end, receiving each walker's reports and declaring them to the group in full voice — the path's official record-keeper, through whom every feeling enters the record."),

    # ---------------- Music & rhythm, just 3 once more (music age-3 primary 8 -> 9) ----------------
    A("big-pot-lid-cymbal-band", "Big Pot Lid Cymbal Band",
      "Two big pot lids per musician, crashed together only when the conductor's hands go UP — and the band's real skill is the silence when they come DOWN.",
      ["music-rhythm"], (3, 3), (4, 12), (10, 15), ["indoor", "outdoor"],
      ["big pot lids, two per musician (adult-checked: handles firm, edges smooth, lids matched for size — the biggest and lightest the kitchen can spare)", "one conductor (the grown-up first, later a kid) with two free hands and a visible spot", "a rug or grass space where the band sits in a half-circle facing the conductor"],
      False, "Check every lid like an instrument, because it is one: handles screwed firm (a lid whose handle spins is retired), edges run with your own thumb all the way round hunting for the one sharp spot kitchens hide, and pairs matched so no musician is wrestling a lid bigger than their spread. Sound-check the volume yourself in the actual space — two big lids crashed at full three-year-old enthusiasm are LOUD, and the band's contract (below) depends on the adult knowing exactly how loud before the first crash is ever cued.",
      ["Hold your two empty hands up where the whole band can see them and say the plain contract: 'This band has one instrument — pot lids — and one rule of music: when my hands go UP, you crash. When my hands come DOWN, the music stops, and stopping is music too.' Demonstrate the vocabulary empty-handed first: hands up, the band shouts 'CRASH' (a rehearsal at voice volume); hands down, silence. The band learns the score before it holds the instruments, and the silence is practised FIRST, on purpose.",
       "Instruments out, one pair at a time, named as they are handed over: 'These are yours. They live pointing DOWN at the floor until my hands go up — lids at rest look like this.' The resting position is taught as a physical place — lids face-down on the floor in front of each musician — so that 'not crashing' has something for hands to DO, which at three is the entire secret of silence.",
       "First pieces, conducted: a slow score to begin — UP (crash), hold the ring a breath, DOWN (rest). Then doubles: UP UP (two crashes, counted by the conductor's hands). The band watches the hands, not each other, and the adult names what is genuinely happening when it happens: 'Everybody stopped TOGETHER. That is the hardest thing a band can do, and you just did it.' Crash quality is never critiqued; togetherness is the only review the band ever gets.",
       "Kid conductor round: a musician trades lids for the spot, and the band — adult included, lids in hand, obeying like a first-day player — follows the new hands exactly: crashes cued early, late, in bunches, all honoured as composed. A conductor who keeps hands down for a long delicious silence while the band holds its breath has understood conducting at its root, and the adult says so when the crash finally comes.",
       "Finish with the band's signature piece, conducted by you: three crashes — one, one, ONE — with real silences between, and then hands down for good, lids to the floor in one movement, and the ring of the last crash allowed to die completely before anybody speaks. 'That quiet at the end? The band made that too.' Lids are collected pair by pair, counted back into the kitchen's keeping, still instruments until the door closes behind them."],
      "A two-musician duo and a four-crash score (up, up, hold, down), the whole piece inside a minute and repeatable on demand.",
      "Sections: half the band crashes only on the LEFT hand, half only on the RIGHT — the conductor plays the room like two instruments, and musicians must watch which hand owns them.",
      safety="Lids are checked before every session — firm handles, smooth edges — and a lid is crashed face to face at chest height, never beside anybody's ears, including the crasher's own: volume at three is governed by distance, so lids are held forward and down, and the band sits spaced a full arm apart. Lids at rest are on the floor, face down, by the rule taught before the first crash — a waved lid is a metal disc at face height, and resting is a place, not a request. Any musician who finds the crashes too much sets their lids down and conducts the silences with both hands on their own ears, a full and honoured seat in the band.",
      copy_free=True, no_elimination=True,
      inclusion="Every seat in the band plays: a musician can crash one lid against a lid the adult holds steady at exactly their reach, or against a big metal tray fixed at their station — the crash, the timing, and the silence are identical, because the music lives in the cue, not the grip. The conductor's spot is open to a conductor who cues by raised card, by head-nod toward the sky, or by an adult's hands shadow-following theirs — the band obeys the signal, whoever authors it."),

    # ---------------- Crafts, just 3 once more (crafts age-3 primary 9 -> 10) ----------------
    A("big-finger-paint-sky-sheet", "Big Finger Paint Sky Sheet",
      "One very long sheet, two blues, and nothing but fingers: the whole group paints one shared sky, then dabs the clouds in white with their fingertips.",
      ["crafts"], (3, 3), (4, 14), (15, 20), ["indoor", "outdoor"],
      ["one very long sheet of paper, taped down flat along a table's or the floor's edge (the sky)", "washable finger paint in wide shallow trays: two blues (a deep one, a pale one)", "white finger paint in a second set of trays (held back for the clouds)", "a washing bowl and towels at the sheet's end (the painters' station)"],
      False, "Tape the sky down like weather is coming: every corner and along both long edges, because a sheet that slides under painting fingers teaches chasing, not painting. Trays are shallow and wide — a fingertip dips, a whole hand cannot slop — and the two blues go out first with the white deliberately HELD BACK: the lesson's shape (sky first, clouds after) only exists if the cloud paint arrives as an event. Test your own finger's line on a scrap: washable finger paint should glide and cover in one pass; paint that drags gets a teaspoon of water worked in by you, now, not negotiated with mid-sky.",
      ["Show the empty sheet and your own two bare hands and say the plain job: 'We are painting the sky — the whole sky, this whole long paper — and our brushes are our fingers. There ARE no other brushes today.' Paint the first stretch yourself, slowly, two fingers gliding: 'Fingers spread the blue out. Long moves, like the wind does it.' State the one rule: 'Paint goes on the paper and on fingers. Nowhere else exists, paint-wise.'",
       "Sky round, deep blue first: painters work along the sheet at their own stations, two or three fingers per hand gliding long strokes, the deep blue laid down as the sky's far layer. Gaps of white paper are not errors — 'that is sky we have not reached yet' — and a painter who finishes their stretch moves to an unreached one by walking round the sheet, never by leaning across wet sky, because a sleeve through a painted sky redraws it by accident and sleeves are not brushes today.",
       "Pale blue round: the second blue goes OVER and BETWEEN the deep — 'the near sky, the daytime part' — and the two blues meeting is where the picture actually happens: painters watch their pale strokes lighten the deep ones and the adult names the event in the plainest words: 'Your fingers just made the sky change time.' A section kept all-deep by its painter's choice stays all-deep: night ends of the sky are a style, and the sky takes every style its painters give it.",
       "Cloud event: the white trays arrive with ceremony — 'Clouds!' — and the technique changes on the spot, taught by doing: fingertips only now, dab-dab-dab, short and bouncy where the sky strokes were long. Clouds are dabbed in clusters, counted as they land by their makers if counting is wanted, and a cloud dabbed onto another painter's stretch is a cloud visiting, received as weather, not trespass. The sky's last white gap may be left deliberately by group vote: 'one window with no cloud, so the birds can see out.'",
       "Finish at the washing station, painter by painter, hands washed with the respect due to instruments: 'These fingers painted a sky today.' Then the whole group walks the sky's length slowly, reading it end to end — where night stayed, where the clouds crowded, where the window is — and the sheet dries flat where it lies before it goes up whole: one sky, every painter in it, signed by its weather."],
      "A short sheet, one blue only, three painters: the whole sky in ten minutes, clouds dabbed by the same three fingers that laid the blue.",
      "Weather report round: after the clouds, painters add rain — fingertip dots falling from one chosen cloud, in straight drippy lines — while the group calls which cloud is raining and which streets below it (the sheet's far edge) are getting wet.",
      safety="Washable finger paint only, skin-safe and labelled for this age — the ingredient list is read by the adult before the trays are filled, not after a hand is in them. Paint lives on paper and fingers; a painter who paints an arm gets their art admired and then washed off with the same cloth as everyone, no fuss either way, because arms happen at three. Nothing painted goes near a mouth: painters with fingers heading mouthward are redirected to the sheet with a fresh dip — 'the sky is thirsty, not you' — and washing before any snack is total, under nails included, as the activity's closing routine rather than a reaction.",
      copy_free=True,
      inclusion="The sky is painted from wherever a painter sits: the sheet runs along a low table edge and the floor alike, and a gliding finger, a whole palm pressed for a broad pale wash, or a fingertip dabbing clouds from a tray-side seat all lay real sky. The cloud-caller job — deciding where the clouds gather and calling 'dab here... and here' while a partner's fingertips land them — composes the sky's weather in full, and the caller's clouds are signed by the calling as surely as by the dab."),

    # ---------------- PE & movement, just 3 once more (pe age-3 primary 9 -> 10) ----------------
    A("big-beanbag-balance-walk", "Big Beanbag Balance Walk",
      "A big soft beanbag balanced on your head, a short line to walk, and the slowest feet in the room: if it falls, you pick it up, put it back, and walk on.",
      ["pe-movement"], (3, 3), (3, 12), (10, 15), ["indoor", "outdoor"],
      ["big soft beanbags (adult-checked: palm-and-a-half across, softly filled so they mould to a head and stay — one per walker plus spares)", "a short straight line on the floor (tape or a rope laid flat — the walk)", "a clear space at the line's end (the arrival, marked with a mat)"],
      False, "Test the beanbags on your own head first, walking the line yourself: a beanbag that is too full rolls off a statue, and one too flat slides — the keepers are the softly-filled ones that settle into a head's shape and forgive a wobble. Retire sliders now. The line is SHORT — a handful of three-year-old steps — because the achievement at this age is not distance, it is the new and solemn discovery that your head can carry something your hands must not touch. Arrival mat at the end, waiting space behind the start, and the whole lane walked by you for trips before the first walker is called.",
      ["Balance a beanbag on your own head and say the plain framing: 'Watch — my head is carrying this, and my hands are doing NOTHING.' Walk the line yourself at ceremony pace, hands visibly free, and let it wobble once honestly if it wobbles. State the one rule: 'Hands never hold the beanbag while you walk. If it falls, you stop, pick it up, put it back on, and walk on. Falling is part of walking.'",
       "First walks, shortest version: walkers take the line one at a time with you walking beside — not touching — close enough that a beanbag heading for the floor meets your raised hand's neighbourhood and the walker learns the lane is supervised, not judged. Hands position is the walker's own discovery: arms out like a tightrope walker, arms down like a soldier — both traditional, both allowed, and the group will develop strong opinions about which is proper, which is the line's first folklore.",
       "Walking round: one walker on the line at a time, the waiting line watching in the hush this activity generates by itself — a room of three-year-olds goes quiet for a beanbag on a head the way theatres go quiet. Arrivals are received: beanbag lifted off with both hands at the mat, held up for the group's inspection — 'It rode the whole way' — and carried back to the start by its walker for the next head in line.",
       "Falls, handled as the record promises: a fallen beanbag stops its walker, who picks it up, re-seats it, and walks on from THAT spot — not from the start, never from the start. The adult says the sentence every time, because repetition is how rules become culture: 'It fell, you fixed it, you are walking.' A walker with three falls finishes with the same ceremony as a walker with none, and the group's applause has never once been observed to grade the difference.",
       "Finish with the grand procession: every walker takes one final walk in line order, beanbags riding, the lane hushed, and the tell-back counts the only statistic this activity keeps: 'Every head in this room carried a beanbag down that line today — and every fall got picked up by its own walker.' Beanbags are gathered into their basket by the walkers themselves, carried in hands at last, which by then feels faintly improper and gets said out loud to general agreement."],
      "A three-step line and the biggest, flattest beanbag in the basket, the adult walking the whole way at the walker's shoulder.",
      "Cargo grows: the beanbag rides to the mat, and a SECOND beanbag is added there for the return walk — two stacked, walked back at half pace, the line's master's degree.",
      safety="Beanbags are big, soft, and head-sized by design — nothing hard, beaded-heavy, or small enough to be a mouth interest goes on a head in this room. One walker on the line at a time, walking only: a running balance-walk is a fall rehearsing itself, and the lane's whole teaching is that slow is the skill. Falls of the beanbag are expected and free; falls of walkers are designed against — clear lane, flat line, bare feet or grippy shoes, and an adult walking beside new walkers — and a walker who feels wobbly stops and takes the beanbag off with both hands, which is always allowed and never a surrender: it is the expert's emergency exit, named as such.",
      copy_free=True, no_elimination=True,
      inclusion="The walk belongs to every walker: the line can be crossed seated-tall in a pushed chair with the beanbag riding its walker's head the whole way — pushed at exactly walking pace by the adult while the walker's hands stay free and the group's hush holds identically. A walker may also serve as the lane's beanbag steward: stationed at the mat, receiving each arrival, inspecting the beanbag, and re-seating it on the next head — the ceremony's keeper, through whose hands every single walk begins."),

    # ---------------- Quiet focus, just 3 once more (quiet-focus age-3 primary 12 -> 13) ----------------
    A("big-peg-clip-card-row", "Big Peg Clip Card Row",
      "Chunky pegs squeezed open and clipped along one thick card's edge, one by one: squeeze, clip, let go — a whole row of pegs standing at attention.",
      ["quiet-focus"], (3, 3), (1, 6), (10, 20), ["indoor"],
      ["chunky pegs (the biggest spring pegs or clips you can find — fist-sized grips, checked: springs strong but not fierce)", "thick stiff cards (adult-cut: card or thin board an edge thick enough for a peg to grip and hold — one long card per worker)", "a bowl the pegs start in (the peg depot)"],
      False, "Vet every peg with your own hand before a small hand meets it: the spring must open under a firm adult squeeze without fighting, and close with a click, not a snap — a fierce peg retires now, because the activity's whole lesson is that squeezing works, and a peg that beats its squeezer teaches the opposite. Cards get the same audit: thick enough that a clipped peg grips and STANDS, long enough for a row of six to ten. Your own demonstration row gets built first and then unbuilt: ten pegs standing along a card is the picture every worker is aiming at, and it has to be seen standing before hands believe it.",
      ["Show your card with its row standing and say the plain job: 'Pegs are little hands. They hold on by SQUEEZING — squeeze, they open; let go, they grip.' Work one peg slowly in front of the group: squeeze it open on your own finger first, gently, and say what every worker must know before touching one: 'A peg can pinch. It pinches fingers that are in its mouth. So our fingers hold the peg's BACK, and the mouth only ever bites the card.' State the one rule: 'Squeeze, clip on the card, let go. Mouth bites card only — never skin, never clothes, never a friend.'",
       "First clips together: each worker takes one peg from the depot and one card, and the group's first clips happen in chorus with you — squeeze (a whole fist's work at three), mouth over the card's edge, let go — and the peg STANDS. A peg that pops off was not squeezed onto enough card: the fix is named as a fix, not a failure — 'More card in the mouth. The peg was hungry.' First standing pegs get the gallery moment they deserve: cards held up, one peg each, a row of one being a complete row at first asking.",
       "Row-building stretch, the quiet middle: workers build their rows peg by peg at their own pace, depot trips included — choosing each next peg is part of the work, and a worker who selects by colour is composing, which gets named: 'You are making a pattern out of pegs.' The adult's hands stay off workers' pegs entirely during this stretch; help is given in words and in demonstrations on the adult's own card, because a row built by the wrong hands is a picture of help, not of skill.",
       "Full-row moment: when a card's edge is full, its worker carries it — flat, two hands, at a walk — to the display ledge and sets it with the finished rows, then stands back with the group to read the ledge: rows of pegs like washing on lines, each one squeezed into standing by one pair of hands. A peg that lets go on the journey is re-clipped at the ledge by its own worker, in front of the portrait it rejoins, without comment from anyone including fate.",
       "Finish with the great unclipping, which workers will inform you is a second activity hiding inside the first: rows come down peg by peg — squeeze, lift off, into the depot — the reverse skill at the reverse pace, counted if counting is wanted. Cards go back in their box, pegs in their bowl, and the ledge stands empty and ready, which the group will regard the way you regard a made bed: with the quiet satisfaction of a thing done completely, twice, once in each direction."],
      "A short card and four pegs, the adult's card beside the worker's being built in parallel, clip for clip, at the worker's pace.",
      "Pattern rows: the worker calls the pattern first — 'red, blue, red, blue' — then must hunt the depot and clip to keep the promise, the row judged at the ledge by its own maker's reading of it.",
      safety="Pegs pinch — the rule is taught before the first peg is touched, demonstrated on the adult's own finger, and held absolutely: a peg's mouth bites card only, never skin, hair, clothes, or another person, in play or in jest. Pegs are the biggest and gentlest-sprung available, vetted one by one; a peg with a fierce spring, a cracked body, or a sharp edge retires on sight, no repairs attempted in session. Clipping happens seated with the card held flat on the table or lap — a card waved about sheds pegs at eye height, and standing rows travel flat, at a walk, in two hands, for exactly that reason.",
      copy_free=True,
      inclusion="The row builds at any station: the card can rest on a table edge, a lap board, or be held upright by the adult at the exact angle its worker directs, while the squeezing — the skill — stays the worker's. A peg can be worked two-handed (one hand steadying, one squeezing), squeezed against the table's edge as a third hand, or directed — 'that one... on the end... SQUEEZE' — while a partner's hand clips at the director's word and pace: the row stands identically, and its pattern was composed by its director in full."),
]

COLLECTION = {
    "id": "little-hands-just-three-once-more",
    "title": "Little Hands, Just Three, Once More",
    "glyph": "\U0001F9F8",
    "when_to_use": "The fourth shelf banded for three-year-olds ONLY — a pretend pot of gold collected coin by clinking coin, fireflies counted by their blinks and never caught, a beanbag that falls and gets picked up by its own walker. Four waves of this kind have now cut the threes' gap by nearly half without one record a three-year-old is merely tolerated by. Reach for it in a young-threes room, a first month of program, or any group whose oldest kid just turned three.",
    "picks": [
        {"id": "big-gold-coin-pot-carry", "note": "The pot sounds fuller as the coins land — a job half done you can HEAR. The story stays a story, said out loud."},
        {"id": "first-firefly-blink-count", "note": "Catch nothing, jar nothing: the count is kept in chorus through long quiet watches, and the quiet is the activity."},
        {"id": "big-pillow-mountain-climb", "note": "Up one side, a sit at the top, down the other — the summit sit gets its full moment, beheld by the whole line."},
        {"id": "blanket-sled-slow-pull", "note": "The sled departs on the rider's word — 'Ready!' — and the pulling adjusts to every rider's review, out loud."},
        {"id": "big-smell-jar-sniff-and-say", "note": "Found by Maya's nose: a name, a description, or an honest 'I don't know' — every report is a complete turn."},
        {"id": "big-felt-quilt-wall-build", "note": "No grid, no outline: where does MY piece belong is the real quilter's job, and crooked squares stay placed."},
        {"id": "big-hat-pass-and-say", "note": "The song chooses the wearer. Two sentences in a ridiculous hat is exactly how much courage an introduction takes."},
        {"id": "big-texture-feet-path-walk", "note": "Tickly-cool, smooth, soft-moving, warm-squishy — four feelings reported in foot words, wince and giggle included."},
        {"id": "big-pot-lid-cymbal-band", "note": "Stopping together is the hardest thing a band can do. The silence is practised first, before any lids come out."},
        {"id": "big-finger-paint-sky-sheet", "note": "Sky first, clouds after — the white arrives as an event. A sleeve is not a brush; the sky takes every style."},
        {"id": "big-beanbag-balance-walk", "note": "It fell, you fixed it, you are walking — from THAT spot, never from the start. Falls are part of walking."},
        {"id": "big-peg-clip-card-row", "note": "The peg was hungry: more card in the mouth. A row built by the right hands, then unbuilt — the second skill."},
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
