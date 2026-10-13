#!/usr/bin/env python3
"""Wave 28: First Years, Third Shelf — the age-3 gap, aimed at its holes.

Wave 27's honest assessment: age-3 coverage stood at 34 against 136 at
age 4 — "still the thinnest age on the books... it closes in about two
more waves" at this rate of honest building. This is the next one of
those waves. The pack does not just raise the headline; it aims at the
holes INSIDE age-3 coverage measured before this wave (primary category
= categories[0], records covering age 3):

  holidays       0 primary at age 3  (the last category with none)
  seasons        1 primary
  rainy-day      1 primary
  stem           2 primary
  team-community 2 primary
  icebreakers    2 primary
  outdoor        3 primary
  music-rhythm   3 primary
  pe-movement    5 primary (one added for the landing skill no
                 age-3 record teaches)

So: two each for holidays, seasons and rainy-day, one each for stem,
team-community, icebreakers, outdoor, music-rhythm and pe-movement.
Crafts (6) and quiet-focus (9) get none — they are not the hole.

Same design rules as waves 26/27: age_min 3, age_max <= 6, runs
<= 25 minutes, big pieces, ONE rule per game, the adult as a player.

Deltas this wave: total 577 -> 589; age-3 coverage 34 -> 46;
early-years-only (age_max <= 6) 27 -> 39; age 4 136 -> 148.
Enrichment: copy_free 197 -> 209 (the whole pack needs zero printing),
no_elimination 57 -> 63, inclusion 75 -> 81.

Fresh Scout cycle (run live before this script): 0 new candidates —
all 65 feed items already in seen.json or filtered out; queue stays
60 decided (22 accepted / 38 rejected / 0 pending). Reported as empty.

Near-duplicate screen: token Jaccard >= 0.55 against every existing
name+tagline is asserted below and fails the run. Closest deliberate
neighbours, kept on purpose:
- soft-ball-new-year-drop vs midnight-countdown-rehearsal (4-12,
  icebreakers: spoken countdown games) and countdown-number-line-hop
  (5-9, number-line hopping): here the count is only five-to-one, on
  fingers, and the point is watching one big soft ball drop.
- big-egg-roll-slope vs egg-hunt-design (a search) and easter-egg-relay
  (a relay race): egg rolling down a slope is its own real tradition —
  the White House Easter Egg Roll, run since 1878 — and nobody races
  or hunts here; you roll, you walk down, you roll again.
- cup-of-snow-melting-watch vs instant-snow-polymers (a powder you
  make) and winter-snow-slime (a dough you knead): real snow, melting
  on its own, watched — the change is the activity, hands stay out.
- cushion-train-all-aboard vs cardboard-tunnel-crawl (crawling through
  boxes): the train is sat on, not crawled through; the job is stops,
  tickets and taking turns driving.
- box-boat-row-along vs fan-boat-races (fans moving paper boats) and
  paper-boat-race (paper boats on water): a kid sits IN this boat and
  rows it with their own arms; no water, no race, no fan.
- wide-plank-bridge-crossing vs paper-bridges / gumdrop-bridge-build
  (6-12 load-tested engineering): a wide flat plank on two low stacks,
  a soft toy walks across — the first bridge, with no load test and
  nothing that can fall far.
- blanket-ball-bounce-together vs parachute-popcorn (5-10, pe-movement,
  many balls bouncing high on a parachute): one ball, one smaller
  blanket, kept LOW and rolling — the team job is keeping it on
  together, not launching it.
- animal-sound-find-your-pair vs animal-parade-march (a marching line
  copying a leader): pairs find each other by sound across the room;
  nobody marches and nobody leads.
- chalk-arrow-trail vs chalk-maze (a puzzle to solve) and
  chalk-obstacle-course (a course to complete): big arrows are simply
  followed, one at a time — following a trail is the whole skill.
- loud-quiet-song-switch vs rhythm-echo-clap (copying patterns) and
  knee-drum-copycat (wave 27, tapped patterns): one known song sung
  whole, and the only change is volume, cued by hands up / hands down.
- two-foot-landing-pads vs jump-the-river-ropes (wave 27, distance
  over a widening gap): the river teaches distance; the pads teach
  LANDING — two feet, bent knees, hold for a count of three.
- first-puddle-walk vs puddle-hopscotch (jumping a chalk grid in
  puddles): boots walk through shallow puddles slowly, first round
  no jumping at all — the splash is earned in the last round.

Safety notes are practical only — no medical claims anywhere.

Run once: dedupes by id, writes data/activities.json + collections.json.
Run scripts/build.py afterwards.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_winter import A, DATA

NY = ["holiday:new-year", "season:winter"]
EA = ["holiday:easter", "season:spring"]
SP = ["season:spring"]
WN = ["season:winter"]

PACK = [
    # ---------------- Holidays, designed for 3 (first holiday primaries at age 3) ----------------
    A("soft-ball-new-year-drop", "Soft Ball New Year Drop",
      "Count five down to one on your fingers, and the grown-up drops one big soft ball into the basket. That is the whole New Year party at three.",
      ["holidays"], (3, 5), (4, 20), (10, 15), ["indoor"],
      ["one big soft ball (beach-ball size or a soft playground ball)", "a wide basket, laundry basket, or big open box"],
      True, "Put the basket in the middle of the circle and test the drop yourself first: standing, ball held high, dropped straight down — it should land in the basket and stay there. If it bounces out, use a softer ball or a deeper basket; a runaway ball ends the count, not starts a chase.",
      ["Teach the count on fingers first, no ball: hold up five fingers, fold one down at a time — five, four, three, two, one — and everybody shouts the last one together. Practise twice; the shout is the payoff the count is building to.",
       "Now the drop. You hold the ball high over the basket. The group counts down on fingers, and on 'one' — not before — the ball drops. The rule the kids police for you: the ball only falls on one.",
       "Round two, a kid is the dropper, standing on a taped spot beside the basket with the ball held high in two hands. Dropping is a two-hand job at three; nobody throws, nobody aims from across the room.",
       "Make the wait longer, never the count: hold at 'two' for a long silly pause while the room holds its breath, then fold the last finger. The pause is where the laughing lives.",
       "Finish with the group drop: everyone counts, the dropper drops, and the whole circle does the cheer with both arms up — then the ball goes in the basket and stays there while you say plainly that the party game is done."],
      "Count down from three instead of five, and the adult drops every round — a shorter wait is still a real drop.",
      "Two baskets and two droppers, counting together: both balls have to land on the same 'one', which takes three or four honest tries.",
      safety="Soft ball only, dropped straight down from a standing hold — never thrown, never dropped off furniture, and nobody stands or sits in the basket. The dropper stands on the taped spot; reaching into the basket waits until the ball has stopped moving.",
      tags=NY, copy_free=True, no_elimination=True),

    A("big-egg-roll-slope", "Big Egg Roll on the Slope",
      "The old Easter egg roll, sized for three: one big egg, one gentle grass slope, roll it down, walk down, roll it again.",
      ["holidays", "outdoor"], (3, 6), (2, 16), (15, 25), ["outdoor"],
      ["big plastic eggs (the large fillable kind, one per kid, taped shut by an adult)", "a gentle grass slope or a low grassy bank", "a starting line: a scarf, rope, or chalk line"],
      False, "Walk the slope first and pick out anything sharp, and choose the gentlest bank you have — a slope a three-year-old can walk down without leaning is the right one; a slope they slide down is not. Tape every egg shut yourself and shake each one: if it rattles open, it does not go out.",
      ["Name the tradition in one sentence, because it is a good one: 'People have rolled eggs down a hill at Easter for a very long time — there is a famous one on the White House lawn, every year since 1878.' Then state the one rule: 'Eggs roll. Hands let go. Feet walk.'",
       "One kid at a time at the starting line: crouch, set the egg on the grass, let go. No pushing contests — a let-go roll is the game, and it stops where it stops.",
       "Everyone walks down together to fetch the eggs. The walk down and back is half the activity at three and none of it is wasted time; the next roller starts when the group is back at the line.",
       "Add the call: before each roll, the roller points at where they think their egg will stop — a bush, a patch of daisies, the bottom. Pointing is the prediction; there is no score and nobody is wrong, eggs have their own ideas.",
       "Last round is the parade roll: the whole group rolls at once, one egg each, and walks down together through the scattered eggs to collect them into the basket — count them back in out loud, every egg home."],
      "A nearly flat patch and eggs rolled from a crouch two steps away — the roll is short and the fetching is shorter.",
      "A slightly longer slope, or the roller calls their stopping point out loud before letting go and the group checks it together at the bottom.",
      safety="Plastic eggs only, taped shut by an adult, and nothing goes in mouths — these are rollers, not snacks. One roller at a time on the line, walking down only: running down a slope carrying eggs is how three-year-olds fall, so the fetch is a walk, every time.",
      tags=EA, copy_free=True,
      inclusion="The roll works from a seated position at the top of the slope or from a chair placed at the line — letting go of an egg needs a hand, not legs. A kid who would rather carry an egg down and roll it on the flat at the bottom is rolling an egg; the slope is the setting, not the test."),

    # ---------------- Seasons, designed for 3 (seasons primary at age 3: 1 -> 3) ----------------
    A("first-puddle-walk", "First Puddle Walk",
      "Boots on, and a slow walk through the shallow puddles after rain — first round walking only, and the splash is saved for last.",
      ["seasons", "outdoor"], (3, 5), (2, 14), (10, 20), ["outdoor"],
      ["rain boots for every kid (their own, or the program's spares)", "shallow puddles on flat ground", "a towel by the door for the walk back in"],
      True, "Walk the route yourself after the rain and choose it honestly: puddles no deeper than a boot's foot part, on flat ground with no slope to them, away from the road and away from drains. If you cannot see the bottom of a puddle, it is not on the route — depth you cannot see is a different outing.",
      ["Boots on, and the one rule said out loud where everyone can hear it: 'First we walk. Puddles are for walking through.' Model it: walk the first puddle yourself, slowly, both feet flat, like the water is something you are visiting.",
       "One kid at a time through the first puddle, the group watching from the dry edge. Watching a puddle get walked through — the rings, the small sound — is a real part of this, not waiting.",
       "Chain round: the group walks the whole route together, puddle to puddle, holding the pace of the slowest boots. Between puddles is dry-ground walking; the contrast is the lesson the feet learn.",
       "Stop at the biggest puddle and stand in it together, still. Count the rings when one kid lifts one foot slowly and sets it back down: one lift, one ring spreading. Quiet water, noticed properly.",
       "Last round earns the splash: at the final puddle only, kids may stomp — two feet, in the puddle, three stomps each — then boots off at the door and the towel does its job."],
      "One puddle, an adult hand for every crossing, and skip the stomp round entirely — the walk is the activity.",
      "Add the leaf test: float one fallen leaf in a puddle and watch where the stomp-rings push it — rings move things, and kids can see it happen.",
      safety="Shallow puddles on flat ground only, boots on every foot, and the walk stays a walk until the stated stomp round — running in wet boots on wet ground is the fall this activity is built to avoid. Puddle water is for boots, never for hands-to-mouths or drinking, and hands wash when the group goes in.",
      tags=SP, copy_free=True,
      inclusion="Watching from the dry edge counts in full for the first rounds — a kid in shoes that must stay dry, or one who is not sure about water yet, is the group's ring-counter and stomp-caller from the edge, and the last-round stomp happens close enough to the edge that they can join it in boots borrowed for three stomps or call it for everyone else."),

    A("cup-of-snow-melting-watch", "Cup of Snow Melting Watch",
      "One clear cup of real snow, brought inside and watched: it goes down, the water comes up, and nobody touches it. Waiting is the activity.",
      ["seasons"], (3, 6), (2, 16), (15, 25), ["indoor", "outdoor"],
      ["a clear cup or jar", "clean fresh snow (collected by an adult)", "a marker (for the level line)", "a spoon (adult's, for the collecting)"],
      False, "Collect the snow yourself from a clean patch away from paths, roads and anywhere salt or grit has been spread — if you would not trust it near a kid's mittens, do not scoop it. Fill the clear cup heaped, set it where the whole group can see it, and draw the marker line at the snow's top edge where everyone watches you draw it.",
      ["Start with hands behind backs and eyes only: 'What do we think will happen to the snow inside?' Take every answer — smaller, water, gone — and say the plan plainly: 'We are going to watch it happen. Nobody touches the cup. The watching is the job.'",
       "While it melts, go and look at where the snow came from: the same snow, still outside, still white. Coming back to a changed cup after seeing the unchanged patch is what makes the change land at three.",
       "First check after a few minutes: the level has dropped below the marker line. Draw the new line together — the kid with the steadiest hand holds the cup still with two hands while you draw, or you hold and they point at the exact height.",
       "Patience round: name what the water at the bottom used to be. 'That water was the top of the cup.' Say it a few ways; the idea that snow and water are the same thing in two states is the whole science here, and it arrives by looking, not by worksheet.",
       "When the cup is all water, hold it beside a second cup you fill with water to the same mark: same thing, two roads in. The snow cup goes outside to be tipped onto the garden — the water goes home — and the group picks where."],
      "A smaller cup (it melts faster) and just two checks: the first line, and the all-water moment.",
      "Two cups side by side — one by the window in the sun, one in the shade — and the group checks both: same snow, different speeds, and the race needs no winner announced, the lines say it.",
      safety="Snow is collected by an adult from a clean patch away from roads and salt, and melt water is never drunk — it is looked at, marked, and poured out. Cold hands are part of holding the cup; if a kid says their hands are too cold, the cup goes down and that answer is final.",
      tags=WN, copy_free=True,
      inclusion="A kid can do this whole activity by feel as well as sight: the cup is cold at the start and less cold as it melts, and holding it with two hands at each check tells the same story the marker lines tell. Reports can be a word, a point, or a hand raised or lowered to show the level — the melting does not care how it is reported."),

    # ---------------- Rainy-day, designed for 3 (rainy-day primary at age 3: 1 -> 3) ----------------
    A("cushion-train-all-aboard", "Cushion Train All Aboard",
      "A row of cushions and chairs becomes a train: a ticket block to hand the driver, stops the kids name, and everyone rides.",
      ["rainy-day", "team-community"], (3, 5), (4, 18), (10, 20), ["indoor"],
      ["cushions, mats, or sturdy chairs in a row (one seat per rider)", "one big soft block or a beanbag (the ticket)", "floor space for a route around the room"],
      True, "Build the train before the group boards: seats in a row close enough that a seated kid can pass the ticket block to the seat behind without standing. The front seat is the driver's and it stays empty until the first driver climbs in — walk the row and sit in every seat yourself; a seat that tips gets swapped now.",
      ["Board in order, back seat first, and state the one rule as they sit: 'The train moves when the driver says go — and the train is pretend, so our feet stay still and the moving is in our voices.' The first sound the train makes, the group invents together and keeps.",
       "Tickets: the last rider holds the big block. On 'all aboard', the block travels hand to hand up the row to the driver — a ticket collected is the train's permission to leave. Dropped tickets are picked up by the nearest hands; the train waits.",
       "Stops are named by the riders: the driver calls 'Next stop…' and a rider names somewhere real to them — grandma's house, the shop with the good bread, the moon — and the whole train says it back as they 'arrive', with a gentle lean-and-stop sway.",
       "Swap the driver every two stops: drivers climb out on the outside of the row, walk up, and the new driver takes the front seat while everyone shuffles one seat back. Shuffling seats without a fuss is a skill this game practises on purpose.",
       "Last stop is the station — your carpet or rug — and the group 'arrives' with the train sound one final time, then helps return the seats to the walls, one cushion carried by two riders."],
      "Four seats, the adult as permanent driver, and stops you name — the ticket still travels and the riders still ride.",
      "A second carriage: a second short row behind, with its own ticket, and the driver has to collect both before the train can go.",
      safety="Seats are sat on, never stood on, and climbing in and out happens on the outside of the row at a walk. The ticket is soft and travels hand to hand at lap height — nothing is thrown up the train.",
      copy_free=True, no_elimination=True),

    A("box-boat-row-along", "Box Boat Row Along",
      "One big cardboard box is the boat: sit inside, row with your arms to a slow song, and dock at the cushion island when the song ends.",
      ["rainy-day"], (3, 5), (2, 10), (10, 20), ["indoor"],
      ["one very large sturdy cardboard box (appliance-size, flaps taped down by an adult)", "two cushions (the island)", "floor space around the box"],
      False, "The adult builds the boat: flaps taped flat inside and out, edges checked for staples and sharp folds — run your hand around every rim before a kid gets in. Set the cushions as the island a short 'row' away, and sit in the box yourself once; a boat that folds under you gets a second box nested inside it or does not sail.",
      ["One sailor at a time climbs in (adult hand offered, every time) and sits in the middle of the boat. State the one rule: 'Boats are for sitting in. The rowing is arms, the moving is pretend.'",
       "Teach the row on dry land first, outside the boat: arms reach forward together, pull back together, in time with the slow song you are going to sing. Three practice pulls; the song's pace is the rowing pace.",
       "Sail: you sing the slow song, the sailor rows in the boat, and the boat 'crosses' while the group on the shore counts the pulls out loud — counting rows is the shore crew's whole job and they take it seriously.",
       "Docking: when the song ends, rowing stops wherever the boat is, and the sailor names the island they reached — the cushions are whatever the sailor says they are. The next sailor's crossing starts from there.",
       "Final crossing is the ferry round: one sailor rows, one passenger sits behind with hands in lap, and the shore crew counts a slower song. Then the boat is 'tied up' — turned on its side by the adult with the group's help — until next time."],
      "No passenger round and a shorter song: one sailor, six counted pulls, docked.",
      "Two boats side by side (if you have two big boxes), rowing the same song together and docking on the same last note.",
      safety="One or two seated kids in the boat, never standing, and climbing in and out is always with an adult hand — box edges fold under a climbing foot. The adult tapes and checks the box; torn or softening cardboard retires the boat that day.",
      copy_free=True,
      inclusion="A chair boat counts in full: a kid who rows from a sturdy chair or from their own wheelchair, arms pulling in time with the song while the shore crew counts, is sailing the same crossing — the boat is the rowing and the song, and the cardboard was only ever the costume."),

    # ---------------- STEM, designed for 3 (stem primary at age 3: 2 -> 3) ----------------
    A("wide-plank-bridge-crossing", "Wide Plank Bridge Crossing",
      "Two low stacks of big blocks, one wide plank across, and a soft toy that walks the bridge — the first bridge a three-year-old can build.",
      ["stem"], (3, 6), (2, 12), (15, 25), ["indoor", "outdoor"],
      ["one wide flat plank or board (about a metre long, edges smooth)", "big blocks or sturdy boxes (for two low stacks)", "a soft toy (the crosser)", "beanbags (extra travellers)"],
      False, "Build the first bridge yourself where the group can watch: two stacks two blocks high, the plank laid flat across with a hand's width of plank resting on each stack. Walk the soft toy across, then press the middle of the plank with your whole hand — if it tips or slides, shorten the span before any kid builds. Check the plank's edges with your palm; splinters retire it.",
      ["Name the parts in plain words as you point: 'Two stacks hold it up. The flat part is the bridge. Bridges are for crossing.' Then take it apart — the group rebuilds what they just saw, which is the building lesson at three.",
       "Kids rebuild in pairs: one stack each, then the plank laid across together, two hands each end. A stack that wobbles gets one block taken off or a wider base — say the fix out loud as it happens, so fixing sounds like building, not failing.",
       "First crossing: the soft toy walks the bridge held by its owner, one slow step at a time, while the group holds its breath theatrically. If the toy 'falls', it falls on carpet, gets picked up, and crosses again — falling toys are the rehearsal, not the disaster.",
       "Change one thing: move the stacks a little further apart and cross again. The plank sags or feels different — kids can see the toy dip in the middle. Say what they are seeing: 'Longer bridge, more bend.' That sentence is real engineering at three.",
       "Traveller round: beanbags cross one at a time and stay on the far side, counted as they arrive. Finish by counting the travellers, then the whole bridge comes down block by block — taking down carefully is the last building job."],
      "Stacks one block high and close together, adult lays the plank — the crossing is the activity, the building is watched.",
      "Stacks at two different heights so the bridge slopes, and the toy 'walks uphill' — then swap the stacks and walk it down.",
      safety="Plank stays low — stacks no higher than two big blocks — and bridges are for toys, never for feet: nobody stands, sits, or crawls on the plank, and that rule is said before the first crossing. Kids' hands stay off the plank while a toy is crossing; a bridge being held is a bridge that cannot be tested.",
      copy_free=True,
      inclusion="The crosser's job can be done entirely by voice: a kid who directs — 'my turn to cross, walk him slow' — while a friend's hand walks their toy across is the bridge's engineer that round, and the group counts their traveller in with the rest. Directing is building, said so out loud."),

    # ---------------- Team & community, designed for 3 (team primary at age 3: 2 -> 3) ----------------
    A("blanket-ball-bounce-together", "Blanket Ball Bounce Together",
      "Everyone holds the edge of one blanket, one soft ball rolls in the middle, and the whole group's job is the same: keep it on, keep it low.",
      ["team-community"], (3, 5), (6, 16), (10, 20), ["indoor", "outdoor"],
      ["one sturdy blanket or large sheet", "one big soft ball"],
      True, "Spread the blanket and walk around it testing edges: every kid needs a piece of edge they can hold with two hands standing still — too many kids on one side means a smaller group per round, not a stretch. The ball goes in the middle only when every hand is holding on; test the lift yourself: blanket up to knee height, flat and steady.",
      ["State the one rule before the ball exists: 'The ball stays on the blanket. We keep it low and slow — a ball that flies off means we all went too fast together.' Practise one lift and lower with no ball until the blanket rises as one piece.",
       "Ball in. First job is stillness: hold the blanket flat and watch the ball sit in the middle. A group of three-year-olds holding one thing still together has already done the hard part — say so.",
       "Rolling round: on your call, one side lifts a little and the ball rolls slowly toward the low side; then that side lifts and it rolls back. Name the kid the ball is visiting each time: 'It's going to see Maya…' — the rolling has a destination, and the destination is a person.",
       "Small bounce round: tiny lifts together, the ball hopping no higher than the kids' knees. Count the hops out loud as a group; when the ball leaves the blanket (it will), it goes back to the middle and the count starts fresh — leaving is part of the game, never the end of it.",
       "Finish with the carry: ball resting in the middle, the group carries the blanket together — slow walking, all hands on — to the box or basket and tips the ball in as one team. Blanket folded by its holders, two to an edge."],
      "Fewer holders and a lighter ball, adult on the edge as a permanent holder — the lift is smaller and slower.",
      "Two soft balls, and the group tries to keep both on through the rolling round — visits get called for both.",
      safety="Soft ball only, bounced low — knee height at most — and the blanket never goes higher than the shortest holder's waist. Nobody gets under the blanket, nobody lets go suddenly on purpose, and a dropped edge just gets picked back up; the game pauses, it does not scold.",
      copy_free=True, no_elimination=True),

    # ---------------- Icebreakers, designed for 3 (icebreaker primary at age 3: 2 -> 3) ----------------
    A("animal-sound-find-your-pair", "Animal Sound Find Your Pair",
      "Deal a big animal card to every kid — somebody else has your same animal. Make the sound, wander, and find them.",
      ["icebreakers"], (3, 6), (6, 20), (10, 20), ["indoor", "outdoor"],
      ["big animal picture cards, in pairs (adult-drawn or from a chunky picture book set — one pair per two kids, big and clear)"],
      False, "Make the pairs ahead: big simple animal pictures a three-year-old can name on sight — dog, cow, duck, cat, frog, sheep. Keep the set small (five or six pairs) and leave out anything the room will argue about; a clear duck beats a clever animal every time. Test each card on the youngest kid you know, in your head, honestly.",
      ["Show every animal first, whole group, with its sound made together — dog: woof, cow: moo, duck: quack. Making every sound in a crowd first is what makes making yours alone in a minute feel safe.",
       "Deal one card to each kid, face up — at three the card is held and shown, not kept secret. State the one rule: 'Somebody else has your animal. Make your sound and find them.'",
       "Finding round: kids wander slowly, making their sound and listening, holding their card high. When two matching animals find each other they stand together and do their sound once as a pair — the pair call — so the room can hear pairs forming.",
       "Found pairs sit together at the edge as animal couples and keep answering the wandering calls with their pair call — a found pair becomes a landmark the still-searching kids can navigate by.",
       "Regather by animals: call the animals one at a time and each pair comes up, shows both cards, and does their sound for the group. Cards collected by animal, pairs sitting together for whatever comes next — new neighbours, chosen by a cow."],
      "Three pairs only, cards held by adults at first and handed over once the sounds are loud — a smaller field to search.",
      "Add the movement: each animal also has its walk (duck waddle, frog hop in place) and pairs must find each other by sound AND walk.",
      safety="Wandering is walking — the sounds get loud, the feet do not, and that is said before the deal. Cards are big and stiff; chewed or torn cards retire, and nothing about this game needs running to work.",
      copy_free=True, no_elimination=True),

    # ---------------- Outdoor, designed for 3 (outdoor primary at age 3: 3 -> 4) ----------------
    A("chalk-arrow-trail", "Chalk Arrow Trail",
      "Big chalk arrows on the ground, one after another, and a whole trail to follow — point where each arrow points, then walk that way.",
      ["outdoor"], (3, 6), (2, 16), (15, 25), ["outdoor"],
      ["thick sidewalk chalk (the fat kind)", "a scarf or flag (the finish marker)"],
      False, "Draw the trail yourself before the group comes out: eight to twelve BIG arrows — each one as long as a kid is tall is not too big — along a safe route with no road crossings, ending at the flag. Walk it back and check every arrow still reads clearly from standing height; a smudged arrow gets redrawn now, not explained later.",
      ["Start at the first arrow and teach the one move: stand on the arrow, point the way it points, say 'that way', then walk that way. Pointing before walking is the whole game — the arrow is read first, followed second.",
       "Follow the trail one kid in front, the group behind as the expedition. The leader changes at every arrow: whoever reaches it first stands on it, points, calls 'that way', and the group answers before anyone moves.",
       "Where the trail turns, it turns honestly — around the bench, along the fence, never across planted beds or anywhere the group is not allowed. Following arrows into the wrong place is a trail-drawing fault, not a kid fault, and you redraw on the spot if it happens.",
       "At the flag: the group plants itself around the finish marker and looks back along the whole trail. Name three things the arrows took them past — remembering the route backwards is the quiet hard part, done as a group.",
       "Walk back along the trail in reverse, following the arrows backwards — they all point the wrong way now, which the group will find hilarious and which teaches more about arrows than the trip out did."],
      "Five arrows in a nearly straight line with the flag in sight the whole way — the trail is followed, the searching is minimal.",
      "Add one fork drawn by you: two arrows side by side pointing different ways, and the leader chooses, with the group following the choice to a second small flag.",
      safety="The trail stays inside the group's usual safe ground — no road crossings, no car park, and an adult walks the route first that day. Arrows are followed at a walk; a trail is not a race, and the kid standing on an arrow is never hurried off it.",
      copy_free=True, no_elimination=True),

    # ---------------- Music & rhythm, designed for 3 (music primary at age 3: 3 -> 4) ----------------
    A("loud-quiet-song-switch", "Loud Quiet Song Switch",
      "One song everyone knows, sung whole — but when the grown-up's hands go up it is loud, and when they come down it is quiet.",
      ["music-rhythm"], (3, 5), (4, 24), (10, 15), ["indoor", "outdoor"],
      ["no materials — one short song the whole group already knows"],
      True, "Pick the song with the room, not for it: the one every kid can already sing without being taught — a counting rhyme or the song this group sings at tidying time. Practise the switch signal yourself once: hands high means loud, hands low means quiet, hands halfway means the in-between nobody has to hit exactly.",
      ["Sing the song once through plainly, all together, no switching — the group needs one clean run in their ears before the game starts changing it.",
       "Teach the switch on a single line: start the line quiet with hands low, raise your hands mid-line and let the line get loud, bring them down for the end. Then state the one rule: 'My hands tell the song how big to be. Eyes on the hands.'",
       "Full song with switches: two or three changes per verse, never more — a switch every line is a shouting contest, a switch every few lines is listening. Sing with them at their volume, not over them.",
       "Swap the hands job: a kid stands beside you and raises and lowers the hands while the group watches them. The switch-keeper keeps switches slow and clear — coaching that, kindly, in the moment, is the group's first conducting lesson and nobody calls it that.",
       "Finish with the shrinking song: sing it once more and let your hands sink lower with every line until the last line is a whisper the whole room has to lean in to hear. End quiet on purpose — the next thing the room does starts calmer."],
      "Two switches in the whole song, telegraphed slowly — hands rising over a full line so everyone sees it coming.",
      "Add the middle: hands halfway, middle voice — the group tries to land the in-between volume on purpose, which is much harder than loud or quiet.",
      safety="Loud means big singing voices, not screaming — say the difference once, plainly, and keep loud rounds short: 'Loud like singing to the back of the hall, not loud like hurting ears.' If it tips into screaming, hands come down and the song goes quiet mid-line; the switch fixes it without a lecture.",
      copy_free=True, no_elimination=True),

    # ---------------- PE & movement, designed for 3 (pe primary at age 3: 5 -> 6) ----------------
    A("two-foot-landing-pads", "Two Foot Landing Pads",
      "Foam pads on the floor and one job: jump with two feet, land with two feet, and stick it for a count of three.",
      ["pe-movement"], (3, 5), (2, 14), (10, 20), ["indoor", "outdoor"],
      ["flat foam mats, carpet squares, or big rubber pads (4-6, non-slip)", "floor or grass space"],
      True, "Lay the pads a small hop apart — one short two-foot jump for a three-year-old leg, tested with your own smallest hop, not your comfortable one — and press each pad flat: a pad that slides when you push it with your foot does not go down; on hard floors, carpet squares with grippy backs or pads on a big rug are the honest setup.",
      ["Teach the landing before any jumping, standing still: feet apart, knees bent a little, arms out — 'land like a cat, soft and stuck'. Practise the shape on the spot: small bend, hold, and the group counts one-two-three out loud while everyone holds it.",
       "First hops are step-offs, not jumps: stand on one pad, step off with two feet onto the floor and land in the cat shape, held for the count. Stepping down teaches the landing with nothing to be brave about.",
       "Pad to pad: one kid on the course at a time, two-foot jump, two-foot landing, hold for the group's count of three before the next hop. The count is done by the watchers — holding a landing while your friends count is the game, and skipping the hold is noticed kindly and redone.",
       "A stuck landing earns the arms-up finish: after the count, arms rise and the pad is 'claimed'. A landing that travels — a step, a hop-forward, hands down — is just information: 'That one rolled. Again?' and the kid tries the same hop once more.",
       "Finish by gathering the pads into one big landing island and taking the final small jump onto it together, one at a time, each landing held while the whole group counts to three — then pads stacked by the course crew, two hands per pad."],
      "Pads touching each other, so the 'jump' is a two-foot step across a seam — landing shape only, no air at all.",
      "One pad a little further, or the landing held for a count of five — longer hold, same hop.",
      safety="Flat non-slip pads only, spaced for a small hop — never for a leap — and only one kid jumps at a time, with the landing pad clear before they go. If a pad slides in testing, it does not go down; a moving pad is a fall wearing a game costume.",
      copy_free=True,
      inclusion="Stepping across counts as a crossing in full: a kid who moves pad to pad by stepping, or wheels across the pads laid as a flat path, is doing the course — the landing hold becomes a stop-and-hold at each pad, counted by the group exactly the same way. The skill is stopping on purpose, and every body in the room can practise that."),
]

COLLECTION = {
    "id": "little-hands-third-shelf",
    "title": "Little Hands, Third Shelf",
    "glyph": "\U0001F9FA",
    "when_to_use": "The third shelf for the youngest kids in the building: twelve more activities designed for three-year-olds first — the first holiday records ever written for that room, a second and third seasons and rainy-day shelf, and the landing, crossing and trail-following skills a three-year-old day actually runs on. Grab it when Next Steps has been through the rotation and the little-kid group is still yours next week.",
    "picks": [
        {"id": "soft-ball-new-year-drop", "note": "Five fingers fold down to one, and only then does the ball fall. The long pause at 'two' is where the laughing lives."},
        {"id": "big-egg-roll-slope", "note": "Roll, walk down, roll again — the White House has run this since 1878, and the fetching is half the activity."},
        {"id": "first-puddle-walk", "note": "Walking first, stomping last, and only at the final puddle. Boots learn the difference before the splash is earned."},
        {"id": "cup-of-snow-melting-watch", "note": "Nobody touches the cup. The marker lines tell the whole story — that water was the top of the cup."},
        {"id": "cushion-train-all-aboard", "note": "The ticket block travels hand to hand before the train may leave. Drivers swap every two stops, without a fuss."},
        {"id": "box-boat-row-along", "note": "A chair boat counts in full — the boat is the rowing and the song, the cardboard was only the costume."},
        {"id": "wide-plank-bridge-crossing", "note": "Two stacks, one plank, a toy that walks it. 'Longer bridge, more bend' is real engineering at three."},
        {"id": "blanket-ball-bounce-together", "note": "One ball, kept low, visited person to person. Holding one thing still together is the hard part — and they do it first."},
        {"id": "animal-sound-find-your-pair", "note": "Make your sound and find your match. Found pairs become landmarks the still-searching kids navigate by."},
        {"id": "chalk-arrow-trail", "note": "Stand on the arrow, point, say 'that way' — then walk. Reading comes before following, every single arrow."},
        {"id": "loud-quiet-song-switch", "note": "Hands up, song gets big; hands down, it shrinks. End on a whisper the whole room has to lean in for."},
        {"id": "two-foot-landing-pads", "note": "Land like a cat and hold for the count of three. Stepping across counts — the skill is stopping on purpose."},
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
