#!/usr/bin/env python3
"""Wave 31: Little Hands, Just Three More — the second 3-only wave.

Wave 30's honest assessment named this wave the same way wave 29
named wave 30: the age-3 gap (70 against 160 at age 4, gap 90)
"closes only by more waves of this kind, at honest quality, or
not at all." This is the next wave of that kind: twelve more
records banded 3-3, built to the same rules wave 30 proved —
short (<= 20 minutes), adult-led, big pieces, one rule per game,
the adult as a player — because the band is honest for the same
reason: these are three-year-old moments (a bud counted with one
fingertip, a heart carried in two hands, a banner that only
stays up if every hand walks together), and age 4, holding 160
records, does not miss them.

Measured before this wave (primary category = categories[0],
records covering age 3): holidays and team-community were the
floor at 5 each; seasons / stem / icebreakers / outdoor /
music-rhythm / rainy-day 6 each; crafts 7, pe-movement 7,
quiet-focus 10. Rainy-day (27) is still the thinnest primary
category on the whole shelf. So the pack repeats wave 30's
shape exactly: one record for every one of the 11 categories —
the floor rises 5 -> 6 everywhere — plus a second rainy-day
record. Result, asserted in the wave log: age 3 70 -> 82, age 4
unchanged at 160, the headline gap 90 -> 78, narrowed for the
second wave running.

Near-duplicate screen: token Jaccard >= 0.55 against every
existing name+tagline is asserted below and fails the run.
Closest deliberate neighbours, kept on purpose:
- big-heart-hand-delivery vs kindness-post-office (wave 26,
  a working post office with sorting and a delivery ledger
  for older early-years kids): no post office, no ledger, no
  sorting — one big heart, carried in two hands, handed to
  one named friend, and a delivery list the ADULT keeps so
  every kid both gives one and gets one.
- one-branch-bud-count vs nature-color-match-walk (wave 26,
  matching found colours on a walk): nothing is matched and
  nothing is collected — one branch, chosen before the group
  goes out, and its buds counted by fingertip, one touch per
  number, because the buds are still growing on the tree.
- big-pot-stir-together vs witches-brew-punch (a drink mixed
  and served): nothing here is food and nothing is tasted —
  it is pretend soup in an empty pot, and the stirring,
  counting and adding-by-turns is the whole activity.
- rain-drums-on-pots vs bucket-drumming (5-12, built rhythms
  on buckets): no rhythm is built and nothing is performed —
  the pots are rain sounds, patted soft for drizzle and busy
  for a downpour, cued by the weather words, ears first.
- big-funnel-sand-pour vs pouring-practice-trays (wave 26,
  water poured jug to jug as a practical-life skill): the
  funnel is the science here, not the pouring — a narrow
  neck, a falling stream, a cup filling from the bottom up.
- long-banner-carry-together vs blanket-carry-teddy-to-bed
  (wave 30, a blanket stretcher with a passenger): no
  passenger and nothing to wake — the banner itself is the
  cargo, it takes a hand every few steps to stay flat, and
  tearing is what walking out of step actually costs.
- how-i-got-here-moves vs find-a-friend-wearing (wave 29,
  finding a partner by a colour): nothing is found — each
  kid tells one true thing (how they travel) and the whole
  group copies the movement that goes with it.
- big-tree-hug-listen vs listening-walk (a sound hunt on the
  move): the group does not walk at all — one tree, checked
  by an adult first, arms around it or palms flat on it,
  and a full quiet minute of listening in one place.
- sing-it-back-echo-lines vs call-and-response-clap (clapped
  patterns answered) and loud-quiet-song-switch (wave 28,
  volume cued on one known song): the echo here is sung, one
  short line of melody at a time, and copying the tune
  exactly is the skill — no instruments, no volume game.
- paint-the-big-box-house vs big-brush-painting (wave 26,
  big brushes on big paper): the painting surface here is a
  place, not a sheet — a box big enough to stand inside,
  painted outside and in, then played in for the rest of
  the day; the craft and the den are the same object.
- giant-steps-baby-steps vs red-light-green-light (stop/go
  on a colour call, elimination in its classic form): no
  stopping and nobody is ever out — the caller names a step
  SIZE, everybody takes it together, and the whole group
  arrives at the garden gate at the same time.
- sock-pair-match-basket vs paper-mitten-match (printed
  paper mittens matched as a card game) and big-lid-match-
  basket (wave 30, lids that FIT their pots): socks match
  by looking, not by fitting — pattern, colour and size read
  at a glance, and a finished pair is rolled into a ball,
  which is a job real laundry actually needs done.

Safety notes are practical only — no medical claims anywhere.

Run once: dedupes by id, writes data/activities.json + collections.json.
Run scripts/build.py afterwards.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_winter import A, DATA

VAL = ["holiday:valentines-day"]
SPR = ["season:spring"]

PACK = [
    # ---------------- Holidays, just 3 more (holidays age-3 primary 5 -> 6; floor) ----------------
    A("big-heart-hand-delivery", "Big Heart Hand Delivery",
      "One big paper heart, carried in two hands across the room and handed to one named friend — a valentine delivered by hand, at walking pace.",
      ["holidays"], (3, 3), (4, 16), (10, 20), ["indoor"],
      ["big card or foam hearts (adult-cut, each bigger than two kid hands, one per kid plus spares)", "a basket (the hearts start here)", "a tray or mat at each seat (the delivery spots)"],
      False, "Cut the hearts yourself beforehand — palm-and-a-half size, plain card, no glitter, no small stickers — and keep your own delivery list where only you can see it: who hands a heart to whom, arranged so every kid gives exactly one and receives exactly one. That list is the whole fairness system of this activity, and it lives with the adult so no three-year-old has to hold it. Hearts wait in the basket; trays wait at seats.",
      ["Name the real thing in one plain sentence: 'On Valentine's Day, people give cards to people they are glad to know. Ours are big, and we deliver them by hand.' State the one rule: 'Two hands on your heart, walking feet, and you hand it over — never throw it, never drop it in a lap and run.'",
       "First delivery together, yours: take a heart in two hands, walk it slowly to its person, hold it out at their height, and wait until their two hands have it before yours let go. Say the whole sentence out loud — 'This heart is for you' — because the words are the delivery as much as the card is.",
       "Deliveries round: one carrier at a time, name called by you from the list, heart carried in two hands, handed over hand to hand, thank-you said back. One at a time is not slow — it is what makes each delivery an event the whole room watches, and watching a friend receive theirs is half of receiving your own.",
       "Received hearts go flat on the receiver's tray, where they stay visible for the rest of the session: a room slowly filling with one heart at every seat is the picture this activity is making, and kids will keep checking that theirs is still there. Let them.",
       "Finish with the full-room look: everyone seated behind their heart, and you name what the list already knows — every person in this room gave one heart and every person got one. Then hearts go home in bags or stay on trays for pickup time, carrier's choice, because a delivered valentine belongs to its receiver now."],
      "Short route only: the receiver sits two seats away, and the adult walks the first delivery beside the carrier, hands ready underneath the heart without touching it.",
      "A return round: each receiver carries their heart BACK to its giver with a thank-you said in their own words — delivering and returning are two different walks and both count.",
      safety="Hearts are big, plain card — nothing small, shiny or stuck-on goes on them, because a valentine at three gets hugged, waved and occasionally tasted. Deliveries are walked, one carrier moving at a time: a room of three-year-olds all carrying at once is a collision arranged in advance. Names are said kindly and hearts are handed over, never snatched back — a heart given stays given.",
      tags=VAL, copy_free=True, no_elimination=True,
      inclusion="A delivery counts however it travels: a carrier can wheel their heart on a lap tray, carry it seated-to-seated along a row, or hand it to the adult as a co-carrier who walks it the last step with them — the hand-over, hand-to-hand, is the delivery, and it happens in full every way. A kid who would rather not carry can be the name-caller with the adult, reading the room one delivery at a time — the list-keeper runs the valentines."),

    # ---------------- Seasons, just 3 more (seasons age-3 primary 6 -> 7) ----------------
    A("one-branch-bud-count", "One Branch Bud Count",
      "One low branch in spring, and its buds counted one by one with a fingertip — touch a bud, say a number, because the buds are counting on growing.",
      ["seasons"], (3, 3), (2, 12), (10, 15), ["outdoor"],
      ["one low branch on a tree or shrub the adult has checked (buds at kid height, nothing thorny, nothing sprayed)", "no other materials — one finger per counter"],
      True, "Choose the branch yourself before the group comes out, and choose it like it matters: low enough for a standing three-year-old to reach the buds, on a plant you can name, with no thorns, no berries at mouth height, and a bud count a small group can actually finish — eight to fifteen is a morning's honest work. Touch every bud yourself first; a branch that will not hold still for your hand will not hold still for theirs.",
      ["Gather the group at the branch and say the plain spring fact the whole activity hangs on: 'This branch was bare all winter. These bumps are buds — leaves and flowers folded up small, waiting. We are going to count how many are waiting on THIS branch.'",
       "State the one rule: 'One finger, one bud, one number. Touch it soft — the bud stays on the branch.' Model the first three yourself: fingertip lands, number said, finger lifts. The touch is how a three-year-old keeps count — eyes alone lose buds, a finger remembers where it has been.",
       "Counting round: the group counts the branch together, one counter's finger leading while everyone says the numbers — or one kid per stretch of branch, handing the count over: 'You left off at six...' However it is shared, the count goes bud by bud to the end of the branch and stops at the real number.",
       "Look-closer round: with the count done, get eyes near one bud — with permission of the branch, hands behind backs this time — and name what a bud actually looks like up close: the colour, the scales, the tiny point. Counting told the group how many; looking tells them what one is.",
       "Finish with the promise said out loud, because it is checkable: 'When we come back to this branch, some of these buds will be leaves.' Write the number down back inside where the group can see it — a count that gets revisited is data, and this branch now belongs to the room."],
      "A short twiggy offcut or a potted plant with five big buds, counted on a lap tray at the table — the same one-finger-one-number rule, at seated height.",
      "Count a second branch on the same tree and compare the two numbers: which branch is carrying more spring, and can the group say by how much, in handfuls if not in numbers?",
      safety="The adult picks the plant and the branch — nothing thorny, nothing with berries or leaves a three-year-old should be handling, and nothing recently sprayed; if the plant cannot be named, it is looked at, not touched. Buds are touched, never picked or twisted: a picked bud is next month's missing leaf, and the rule is said as care, not as scolding. Hands wash back inside, as after any plant handling.",
      tags=SPR, copy_free=True,
      inclusion="The count comes to every counter: a fallen twig with buds, or a low branch the adult holds gently down at seated height, puts real buds under a seated kid's fingertip, and their numbers join the branch count in full. A kid who counts by pointing while a partner touches has counted — the number said out loud is the count, whichever hand did the touching."),

    # ---------------- Rainy-day x2, just 3 more (rainy-day age-3 primary 6 -> 8; floor + thinnest category) ----------------
    A("big-pot-stir-together", "Big Pot Stir-Together",
      "One big empty pot, one long spoon passed hand to hand: everyone adds one pretend thing and stirs it in — rainy-day soup, made of turns.",
      ["rainy-day"], (3, 3), (4, 14), (10, 20), ["indoor"],
      ["one big sturdy pot or mixing bowl (empty, clean, too big to tip)", "one long-handled spoon (the stirrer)", "nothing else — the ingredients are pretend"],
      True, "Set the pot where the whole group can reach it — middle of a low table or on the floor rug with everyone seated round it — and test it yourself: it must sit dead steady when stirred hard by an enthusiastic cook, because a pot that walks across the table teaches chasing, not stirring. The spoon is long enough that a stirring hand stays clear of the pot's rim. Nothing goes in the pot. That is not a shortage; it is the recipe.",
      ["Tell the group the situation plainly: 'It is raining, we are inside, and we are making soup. Our soup is pretend soup — nothing real goes in the pot, and nobody tastes it. What goes in is ideas, one per cook.' State the one rule: 'The spoon travels hand to hand. Only the cook holding the spoon stirs.'",
       "First stir together, yours: name your ingredient out loud — 'I am putting in... a carrot' — mime dropping it in, then stir five slow circles while the group counts the circles with you: the count is how the room knows a stir is finished, and five is a stir a three-year-old can complete without the pot becoming a drum.",
       "Cooks' round: the spoon passes, each cook names one thing going in — real foods, silly foods, one memorable dinosaur — drops it in by mime, and stirs their five counted circles. A named ingredient is never corrected: dinosaur soup is a legitimate soup in this kitchen, and the group will defend that position.",
       "Halfway taste-check, performed entirely in mime: you lift the spoon, blow on it, pretend-sip, and deliver the verdict — 'Needs one more thing' — and let the group shout suggestions before the next cook chooses. The verdict is always nearly there; a soup that is finished ends the stirring, and nobody wants that.",
       "Finish when every cook has stirred: the last cook gives five final circles, the spoon is laid across the pot like a lid, and the group names the soup by its most famous ingredient — the name gets said with ceremony, because they cooked it. Pot and spoon are washed by the adult where the group can see: pretend kitchens clean up too."],
      "Two cooks at a time sharing the spoon — one holds the pot steady with both hands (a real job the pot genuinely needs) while the other stirs, then they swap.",
      "Counting up: later cooks stir as many circles as their turn number — cook three stirs three, cook six stirs six — with the group counting every circle out loud.",
      safety="Nothing real goes in the pot and nothing is tasted, at any point — the rule is said at the start and holds when a helpful cook offers an actual snack from their pocket. The pot is stirred from a seated position only, spoon moving in circles inside it: a spoon waved standing up is a spoon at face height for the cook beside you. Hot is never part of the pretend — the soup is warm in the story and the pot is cold in the hand, and the record says so in case a substitute asks.",
      copy_free=True, no_elimination=True,
      inclusion="Every cook cooks: the spoon can be stirred two-handed, rested against the pot's edge for leverage, or held with an adult's hand under the cook's — the five circles are still theirs. A cook who names their ingredient by pointing at a picture, a sign, or the adult's offered choices has named it in full, and a pot-holder whose two hands keep the whole kitchen steady is cooking with both of them."),

    A("rain-drums-on-pots", "Rain Drums on Pots",
      "Upturned pots and fingertips: drizzle is a patter, a downpour is a rumble — the rain outside, played on the kitchen shelf.",
      ["rainy-day", "music-rhythm"], (3, 3), (4, 16), (10, 15), ["indoor"],
      ["several sturdy pots, pans or big bowls, upturned (adult-checked: stable, no sharp rims)", "no sticks — hands and fingers only"],
      True, "Set the drums yourself before the group sits: pots upturned on a low table or the floor, each one rocked by your hand first — a pot that wobbles will tip mid-downpour and end the weather. Mix sizes on purpose: the biggest pot is the deep sound, the smallest is the bright one, and the group will hear the difference before you name it. Best on a genuinely rainy day, when the real sound is at the window for comparison.",
      ["Start by listening, not playing: hands in laps, ears on the window if it is really raining. Say the plain framing: 'Rain makes a sound landing on things. Pots make a sound too. We are going to make the rain's sound, our size.' One demonstration pat from you — flat palm, once — so the group hears how quiet a pot can be played.",
       "State the one rule: 'Fingers and soft palms only, and only when your pot is called.' Teach the two weathers with your hands in the air first: DRIZZLE is fingertips, light and slow, pat-pat-pat; DOWNPOUR is flat palms, busy and low. The group practises both in the air before any pot is touched.",
       "Weather round, one pot at a time: you call the weather — 'Drizzle over the garden...' — one drummer plays it on their pot while everyone else listens, then the call moves on. Hearing your own pot do weather, alone, is the listening this activity exists for.",
       "Storm round, the big moment, once: weather builds over the whole shelf — drizzle on the small pots, growing, until you raise both hands and call 'DOWNPOUR!' and every pot plays at once for a slow count of five, then your hands fall: '...and the rain stops.' Silence after a downpour, in a room of three-year-olds, is a sound worth sitting in.",
       "Finish by matching the window: if real rain is still falling, the group plays ALONG with it for a moment, at its volume, whatever that is — then pots are turned right-side up and stacked by their drummers, weather over, kitchen restored."],
      "One big pot for the whole group, drummers taking turns around it, the adult's hand keeping the weather calls slow and far apart.",
      "Add the in-between weather: RAIN (steady palms, medium) between drizzle and downpour — three weathers to tell apart by ear before a hand moves.",
      safety="Hands only, never sticks or utensils — a pot played with fingers cannot be drummed into anyone's fingers beside it, and the volume stays at a level set by palms, not hardware. Pots are adult-checked for sharp rims and dead stability before the group sits; a pot that tips is retired mid-session without discussion. The downpour is five counted seconds, not a free-for-all: ears at three are close to the drums, and the storm ending on the call is part of the weather.",
      copy_free=True,
      inclusion="A pot played in any way that makes its sound counts in full: flat palm, fingertips, the back of a hand, or a pot resting on a lap tray at the drummer's own height. The weather-caller job — holding up the drizzle or downpour picture in your own hands at the right moment — runs the whole storm, and a caller who never drums has still made the rain happen."),

    # ---------------- STEM, just 3 more (stem age-3 primary 6 -> 7) ----------------
    A("big-funnel-sand-pour", "Big Funnel Sand Pour",
      "A big funnel in a bottle, a cup of dry sand, and a stream that pours, narrows and fills — watch the level climb from the bottom up.",
      ["stem"], (3, 3), (2, 8), (10, 20), ["indoor", "outdoor"],
      ["one big wide-mouth funnel per pourer (adult-checked, smooth rim)", "a clear bottle or jar with the funnel seated in it", "dry sand in a big pouring cup", "a deep tray under everything (the sand's whole world)"],
      False, "Build the station on the tray and test it with your own pour first: the funnel must sit steady in the bottle's mouth without being held — a funnel that needs a holding hand leaves the pourer one-handed, so wedge or choose until it stands alone. Sand is dry and clean, the cup is small enough that a pour finishes, and the whole station lives on the tray: sand that reaches the tray has not escaped, it has arrived.",
      ["Show the empty bottle first and say the plain question the whole activity answers: 'The sand is in the cup. The bottle's mouth is little. How does the sand get in? Slowly — through the funnel. Watch where it lands.' Hold the funnel up alone once: wide top, narrow bottom, one hole — the shape is the explanation.",
       "State the one rule: 'Pour slow, over the funnel, and stop when I say the cup is empty — then we LOOK before anyone pours again.' First pour together: sand goes in a thin stream, and the group watches the pile inside the bottle start at the bottom and build — 'The bottle fills from the bottom up. The top fills last.'",
       "Pouring round: each pourer tips their own cup, at their own pace, keeping the stream inside the funnel's wide mouth. A stream that misses teaches aim better than any correction — the tray catches the evidence and the next pour adjusts itself. Between pours, the group checks the level: finger on the glass at the sand line, number of cups counted out loud.",
       "Full-and-finish moment: when the sand reaches the funnel's neck and slows to a stop, leave it there a moment and look — the bottle full, the funnel holding the last of the stream back. Say the earned sentence: 'The funnel let it in a little at a time. That is the funnel's whole job.'",
       "Reset is the second half of the science and the group does it: the adult lifts the bottle, the pourers hold the big cup, sand comes back out — faster upside down than it went in, which somebody will notice, and the noticing is the lesson landing twice. Tray sand is scooped back into the cup by hand, every grain accounted for by small fingers."],
      "A bigger funnel and a measuring jug instead of a bottle, three cups only, with the adult's hand steadying nothing but staying under the funnel as a safety net that never touches.",
      "Two funnels, two bottles, two sands of different colours poured side by side: same cups, and the group judges which bottle's level climbed faster — and argues about why, which is the point.",
      safety="Sand stays on the tray and in the station — never thrown, never blown, and hands that have been in sand stay away from faces until they are washed; sand in an eye is the one real accident this activity can have, and the tray rule is what prevents it. Pouring is done seated or standing still at the tray, never carried around the room. The bottle is plastic or the adult's hands move it, always: glass and sand and small pourers meet only through an adult.",
      copy_free=True,
      inclusion="The pour is the pourer's at any height: the whole tray station works on a lap tray or a low table edge, the cup can be tipped two-handed or with its handle braced on the funnel's rim, and an adult pouring at a kid's direction — 'pour... keep pouring... stop!' — is a full experiment where the director called every variable. The level-checker job, finger on the glass calling the count, is the measurement itself."),

    # ---------------- Team & community, just 3 more (team age-3 primary 5 -> 6; floor) ----------------
    A("long-banner-carry-together", "Long Banner Carry-Together",
      "A long paper banner and a hand every few steps along its edge: the whole crew walks it across the room flat — or it does not arrive at all.",
      ["team-community"], (3, 3), (6, 18), (10, 20), ["indoor"],
      ["one long banner (a roll of paper or joined sheets, adult-made, with a welcome word or the group's own marks on it)", "a clear straight route across the room", "tape or clips at the far wall (adult's, for hanging)"],
      False, "Make the banner before the group gathers — long enough to need at least six hands, light enough that a three-year-old's grip is real, and already decorated or carrying one big word, so what is being carried visibly matters. Walk the route yourself carrying one edge: it must be straight, flat and boring, because the carrying is the event and the route should contribute nothing. Mark the hanging spot at the far end at adult height; the arrival has a destination the crew can see.",
      ["Show the banner laid flat on the floor and say the plain truth of it: 'This banner is too long for two hands. It needs a hand every little while along its edge — that is us. If we all walk together, it stays flat. If one of us hurries, it folds and tears.' State the one rule: 'Two hands or one hand on the edge, walking feet, and we start and stop on the call.'",
       "Crewing round: the group spreads along one side — and the bigger kids of the crew along both sides if numbers allow — each carrier finding their own hand-span of edge and gripping it gently, paper held, not pulled. You call the lift: 'Hands on... lift' — and the banner comes off the floor as one thing, which the group will feel happen in their own hands.",
       "The carry: walking feet, your pace set at the front, the banner travelling flat across the room. Call one stop halfway — 'Stop' — and let the crew feel the banner hang still and level between them: holding a thing still together is harder than moving it together, and three-year-olds can feel that fact without a word of explanation.",
       "Arrive: at the far wall the crew holds the banner up and steady — arms at whatever height their grip reaches — while you tape or clip the top edge. Their holding IS the hanging; a banner that goes up while its crew holds it has been installed by the crew, and everyone present knows it.",
       "Finish with the step-back: whole crew behind you, looking at the banner on the wall, flat because they walked it flat. Name the crew's work in one plain sentence — 'Every hand on that edge is why it is up there whole' — then the banner stays up for the day, and carriers will point their hand-span out to anyone who visits."],
      "A shorter banner and a crew of four, the adult carrying the middle span where the sag lives — the crew still feels the banner need every hand it has.",
      "A corner to turn: the route bends once around a table, and the crew discovers the outside of the bend must walk further than the inside — called, practised, and carried at a shuffle.",
      safety="Walking only, and the pace is the slowest carrier's — a banner carried at a run tears, and the tear is the lesson nobody needs twice. Grips are gentle and edges are never yanked from another carrier's hands; a dropped edge is re-gripped on the stop call, not grabbed at mid-stride. The hanging is the adult's job at adult height: carriers hold, the adult tapes, and nobody climbs to reach the wall.",
      copy_free=True, no_elimination=True,
      inclusion="The banner visits every carrier: a seated carrier's hand-span can be at the route's halfway station, where the banner's edge is carried TO their hands for the stop-and-hold — the halfway hold the carry genuinely needs a crew member stationed to do. A carrier can also walk their span wheeling with one hand on the edge, the paper light enough that the grip is the whole job, and the banner arrives exactly as flat."),
]

PACK += [
    # ---------------- Icebreakers, just 3 more (icebreakers age-3 primary 6 -> 7) ----------------
    A("how-i-got-here-moves", "How I Got Here Moves",
      "Tell the group how you travel — feet, wheels, bus, car — and everyone copies the movement: marching feet, steering hands, a gentle bus bounce.",
      ["icebreakers"], (3, 3), (6, 20), (10, 15), ["indoor", "outdoor"],
      ["no materials — voices and bodies only"],
      True, "No set-up beyond a circle with room to move in place. Think about your own group before you start: you need the travel kinds your kids actually use — walking, car, bus, bike seat, stroller, wheelchair — and every single one gets a movement the whole group can copy with respect and pleasure. Your own travel goes first, told honestly, so the telling is modelled before anyone small is asked to do it.",
      ["Model the whole turn with your own journey: 'I got here in a car. I steered like this' — hands on an invisible wheel, gentle turns — 'Now everybody drive my car with me.' The whole group steers together for a few beats. That copying is the welcome: your way of arriving just got driven by the entire room.",
       "State the one rule: 'One teller at a time, and we copy EVERY way of getting here the same — because every way got somebody here.' Go in seat order, known in advance, so nobody wonders when their turn is coming or whether it is.",
       "Tellers' round: each kid names their travel — in words, by pointing at themselves and miming it, or by choosing between two the adult offers out loud — then shows the movement: marching feet for walking, a bounce in the seat for the bus, pedalling legs for a bike, smooth rolling hands for wheels. The group copies it together, properly, for a real few seconds.",
       "The copying is the point and it is never a joke at the teller's expense: movements are copied the way the teller showed them, at the teller's size. If a movement is big, the room does it big; if it is small and careful, the room does it small. Matching a friend exactly is the friendship being practised.",
       "Finish with the whole journey home: you call the group's travels back in order — 'First we marched with ___, then we steered with ___' — and the room replays every movement once, fast, like a film of the morning. Every way of getting here is in the film, because every kid in the room is."],
      "Adult offers two choices to each teller — 'Did your feet bring you, or did wheels?' — and a point is a complete answer that earns the group's full copy.",
      "Add the middle of the journey: 'What did you see on the way?' — one thing per teller, named or mimed, and the group copies the looking as well as the travelling.",
      safety="Movements are copied kindly and exactly — never bigger-funny, never with sound effects at a teller's expense; the rule is stated once, plainly, before the first turn. All movement happens in place in the circle: marching feet stay on one spot, because twenty three-year-olds actually marching is a parade leaving the activity behind. A teller's real travel is never corrected — if they say the bus and you know it was a car, the bus is what the room copies; this is their telling, not a transport audit.",
      copy_free=True, no_elimination=True,
      inclusion="Every way of arriving is already in the room: wheels are a first-class movement here, shown by the kid who travels that way and copied by everyone, exactly as shown — the teller is the group's expert on their own journey. A teller can show their movement with one hand, with their head, or by choosing the adult's demonstration of it and nodding it correct — directing your own movement's copy is telling in full."),

    # ---------------- Outdoor, just 3 more (outdoor age-3 primary 6 -> 7) ----------------
    A("big-tree-hug-listen", "Big Tree Hug and Listen",
      "One big tree, arms around it or palms flat on the bark, and a whole quiet minute of listening to what a tree's place sounds like.",
      ["outdoor"], (3, 3), (2, 12), (10, 15), ["outdoor"],
      ["one big tree the adult has checked (sound trunk, no hives, no low dead branches, room all round it)", "no other materials — arms and ears only"],
      True, "Choose and check the tree yourself before the group comes out — properly: trunk sound and rough-barked enough to feel, no wasp or bee activity anywhere on it, no ants in a highway up the bark, nothing dead overhead, and space all the way round for the whole group to stand at the trunk together. Put your own arms round it. If the tree fails any of this, another tree gets the hug; the activity is portable and trees are not interchangeable only in the details.",
      ["Gather the group at the trunk and say the plain framing: 'This tree is alive and it is older than everybody here. We are going to say hello the tree way — by holding on and listening.' First contact is palms flat on the bark, all round the trunk at once, feeling it before anyone wraps an arm.",
       "State the one rule: 'Hands on the tree, feet on the ground, and when the listening starts, our voices rest.' Show the hug properly — arms round as far as they reach, cheek nowhere near bark, a hold that can be let go of at any moment by its owner. Nobody has to hug: palms flat is holding on in full.",
       "The listening minute: you say 'Listening...' and the group holds on in quiet for a real minute — at three, a minute of held quiet outdoors is a long, rich time, and sounds will arrive: leaves, birds, wind in the branches overhead, the tree's own creaks. Your job in the minute is only to keep it: one gentle 'listening...' if voices start, nothing more.",
       "Report round, hands still on the tree: each kid names one thing they heard — in words, by pointing at their ear and then at the sound's direction, or by making the sound themselves. Every report is received as a hearing: if two kids heard the same bird, the bird gets named twice, proudly.",
       "Finish with the thank-you and the fact: hands pat the trunk twice, together — pat, pat — 'Thank you, tree.' Then the plain true sentence on the walk back: 'The tree will be making those sounds all day. We just stopped long enough to hear them.' A tree the group has listened at gets greeted on every future walk past it; that is a side effect, not a rule."],
      "A small group and a half-minute: palms flat only, the adult's hands on the trunk too, and the reports taken during the quiet in whispers rather than after it.",
      "A second tree, a second minute, and the comparison: which tree's place was louder, and what was the biggest sound at each — the group votes by walking to stand at the tree they mean.",
      safety="The adult's tree check is the safety: no hives or active nests, no ant highways, no dead branches overhead, and the group never gathers under a tree in wind strong enough to be dropping twigs. Hugging is offered, never assigned — palms flat, one hand, or standing at the trunk with hands in pockets and ears open are all full participation, and bark never goes in mouths. The group stays at the trunk: no climbing, no root-stepping races, and the quiet minute happens where the adult can see every holder-on at once.",
      copy_free=True,
      inclusion="Holding on works from any height and any hand: two palms, one palm, a forearm rested on the bark, or a lap tray's edge against the trunk with the kid's hand over it — the tree does not grade the hold. The listening is the activity's heart and it asks nothing of hands at all: a kid who only listens, and reports their sound by making it, has done the whole thing. The report-by-sound option is stated up front so it is a choice, not a fallback."),

    # ---------------- Music & rhythm, just 3 more (music age-3 primary 6 -> 7) ----------------
    A("sing-it-back-echo-lines", "Sing It Back: Echo Lines",
      "The grown-up sings one short line of a song everybody knows — and the whole group sings it right back, same tune, like the song answering itself.",
      ["music-rhythm"], (3, 3), (4, 18), (10, 15), ["indoor", "outdoor"],
      ["no materials — voices only, and songs the group already knows"],
      True, "No set-up beyond choosing your songs before the group sits — and the choosing is the set-up: two or three songs this group genuinely knows (the ones they already join in on), with lines short enough to hold whole: one line, four to eight words, a tune a three-year-old's ear can keep. Test your lines on your own voice: if you cannot sing it back to yourself exactly, it is too long, and a shorter line from the same song is waiting.",
      ["Start inside a song the group owns: sing the whole first verse together the normal way, so the echo game grows out of real singing and not out of an instruction. Then say the plain shape of the game: 'Now I sing ONE line by myself — and you sing it back to me, just like I sang it. The song, answering.'",
       "State the one rule: 'Wait for my line to finish. Then sing it back — the same words, the same tune.' First echo easy on purpose: the best-known line of the best-known song, sung by you at the group's own pace, and answered by everybody at once. A room singing a line back together is a choir that did not need forming.",
       "Line-by-line round: work through one song a line at a time, you singing each line into the quiet and the group returning it. Lines they stumble on get sung by you twice — hearing it twice is not a failure, it is how the line moves in — and the echo that lands gets named: 'That one came back whole.'",
       "Small-voices round, the heart of it: one singer per line when singers want it — a volunteer or the next seat in a known order, never a spotlight ambush — sings a line alone and the GROUP echoes the small singer, at the small singer's size. Being echoed by the whole room is a three-year-old's first solo, with the room as their instrument.",
       "Finish by singing the whole song straight through, no echoes, all together — and the group will hear it differently now, line by line, because they have held each piece of it separately. End seated, voices down on the last line, the way songs in this room end."],
      "Two-word echoes only: the ends of lines ('...twinkle star' becomes you singing the line and the group answering just 'twinkle star') — holding the tail of a line is a full echo at its smallest honest size.",
      "Echo with a change the group must catch and copy: you sing a known line SLOW, or tiny-voiced, or with one word swapped for a silly one — and the echo has to return it exactly as sung, swap included.",
      safety="Voices only and voices at singing size: an echo game that becomes a shouting match has left the activity, and the adult's own line is always sung at the size the echoes should be — the group will copy the volume they are given. Singers sing by volunteering or by known seat order, never by surprise nomination; a passed turn is passed without comment and the line goes to the group instead. Songs are the group's own known songs — nothing with words a three-year-old should not be carrying around gets introduced by this game.",
      copy_free=True, no_elimination=True,
      inclusion="An echo counts in every voice it comes back in: sung, hummed with the mouth closed, signed along while a neighbour sings, or tapped on knees in the line's rhythm while the group carries the words — the line came back, and coming back is the game. A small singer can also conduct their line: they point at the group at their moment and the room sings it for them, which is a solo performed by direction."),

    # ---------------- Crafts, just 3 more (crafts age-3 primary 7 -> 8) ----------------
    A("paint-the-big-box-house", "Paint the Big Box House",
      "A cardboard box big enough to stand inside, washable paint and brushes as big as your hand: the group paints its house, outside and in, then lives in it.",
      ["crafts"], (3, 3), (4, 14), (15, 20), ["indoor", "outdoor"],
      ["one very large sturdy cardboard box (appliance-size, adult-prepared: door and windows cut by the adult beforehand)", "washable paint in wide pots", "big brushes and sponge dabbers (one per painter)", "a groundsheet or flattened cardboard under the whole house"],
      False, "Build the house before the painters arrive, and build it like a building: door and window holes cut by an adult's hands only, flaps taped down flat inside and out, the box set on its groundsheet where it will stay for the day — a painted house does not get carried. Stand inside it yourself for one second if it fits you, or crouch-test the door: if the doorway snags an adult's shoulder it will snag a painted three-year-old's, and it gets trimmed now, not mid-session.",
      ["Walk the group round their house first, paint still closed: name its parts in plain words — walls, door, windows, roof edge — and say the job straight: 'This is our house and it is made of cardboard and it is BROWN. Houses get painted. Today the painters are us.' State the one rule: 'Paint goes on the house. Brushes stay at the house.'",
       "First strokes together: pots open, each painter chooses a wall section at their own height and makes the first mark — a stripe, a splodge, a whole panel of one colour — and you name what is happening in builder's words: 'The front wall is going red. The door wall is starting blue.' Painting WITH commentary is how a coat of paint becomes a project.",
       "Painting round: painters work their sections at their own pace, pots shared by carrying them two-handed or calling for a colour swap. Overlaps where two sections meet are the house's style, named as such on sight. The inside walls are paintable too, one painter in the house at a time, doorway kept clear — a painted-inside house is a different country and the group will know it.",
       "Step-back inspection, halfway: brushes down, whole group two steps back — or wheeled back — looking at the house like inspectors. What is still brown? Which wall needs a painter? Inspectors assign themselves; an unpainted patch spotted by the group gets a volunteer before you can suggest one.",
       "Finish when the group calls it painted: brushes washed in the bucket by their painters, pots lidded by the adult, and the house left OPEN to dry where it stands — then it is not a craft project any more, it is the room's new building, and it stays in use for days: a house the group painted themselves, entered through a door they watched being a doorway while it was still brown."],
      "One wall only, three painters, the house pre-primed by the adult in one pale colour so every mark shows at full strength from the first stroke.",
      "A second coat day: patterns over the base — handprints along the door wall, stripes on the roof edge — planned by the inspectors from the first session before a pot opens.",
      safety="Washable paint only, and the pots are wide and low so a reached-for colour does not become a tipped one. The box is cut, trimmed and taped by adults before painting starts and never cut during it — no blades at a painting session, at any height, for any touch-up. One painter inside the house at a time with the doorway always clear, and the whole box is checked by an adult before play use: a softened, paint-soaked panel that sags gets retired, because the house's job after today is being a building.",
      copy_free=True,
      inclusion="Every wall has a low country: the bottom panels of all four walls are painters' territory at seated height, catching the same light and the same commentary as any panel, and the groundsheet is laid so wheels roll onto it and up to the wall. A painter can also work the inside from the doorway in a chair placed in the opening — in the house, painting the house. The colour-caller job, choosing which colour goes to which wall and calling the swaps, is art direction, and the house bears the caller's decisions all day."),

    # ---------------- PE & movement, just 3 more (pe age-3 primary 7 -> 8) ----------------
    A("giant-steps-baby-steps", "Giant Steps, Baby Steps",
      "The caller names a step — a GIANT step, a baby step, a marching step — and the whole group takes it together, all the way to the garden gate.",
      ["pe-movement"], (3, 3), (4, 16), (10, 15), ["indoor", "outdoor"],
      ["a start line and a finish line (tape, a rug edge, the garden gate itself)", "no other materials — legs only"],
      True, "Mark the two lines yourself and walk the distance at a baby step before the group lines up: the whole trip should take a mixed bag of calls — eight to twelve steps in total — because a journey of thirty calls loses its travellers and a journey of three never becomes one. Clear the lane as you walk it: at three, looking at your own feet is the game, so the floor owes the group a clear view and nothing to trip over.",
      ["Teach the steps standing on the start line, before any travelling: a GIANT step is the biggest stretch a leg can honestly make; a baby step is heel-to-toe tiny, a foot-length and no more; a marching step is knees up, in the middle, and proud. The group practises all three on the line until the sizes are in their legs — sizes are the vocabulary of this game and the travelling makes no sense without them.",
       "State the one rule, whole: 'The caller calls a step. EVERYBODY takes that step together. Nobody is ever out, nobody is sent back, and we all reach the gate.' That last part is the design, said out loud at the start so the group hears the promise the game keeps.",
       "Travelling round: you call — 'GIANT step!' — and the whole line stretches one giant step together and freezes in the stretch a moment, marvelling at the distance; 'Baby step, baby step' — two tiny ones, heel to toe; 'Marching steps — one, two, three!' The calls vary the sizes on purpose: after two giants, a run of babies makes the gate feel far again, and the group will groan happily, because the distance changing size IS the game.",
       "Last-step ceremony: when the group is one call from the gate, stop and look at the gap together and let the group choose the final step by vote of voices — it will be a giant, and it should be: the whole line takes it together and lands at the gate in one stretched, laughing row, exactly as promised at the start line.",
       "Finish at the gate with the journey told back in sizes: 'Two giants got us started. Then the babies made us wait. Then we MARCHED.' Kids will re-walk the journey in the telling, feet remembering the sizes without a call. Then the whole group turns round — because the gate is also a start line, and the way back is the same game in the other direction, if legs are willing."],
      "Three calls only over a short lane, the adult walking each call INSIDE the line with the group, taking the same size step — a model in the middle is worth ten from the front.",
      "New sizes join the vocabulary: a twirling step (one slow turn as you travel), a sideways crab step, a tiptoe step — each taught on the line first, then callable, and inventors of a step get it called by their name once: 'A ___ step!'",
      safety="Everybody moves on every call and nobody is ever sent back or out — that is not a softening of this game, it is the game, and a caller who suggests sending someone back is gently reminded of the promise made on the start line. Giant steps are stretches, not leaps: feet stay in contact with the ground's story, one foot down before the other leaves, because a line of leaping three-year-olds lands on each other. The lane is adult-cleared, the group travels in a wide line rather than a bunch, and a fallen traveller stops the calls until they are up and brushed off — the gate waits, it always waits.",
      copy_free=True, no_elimination=True,
      inclusion="A step is a step at every size it honestly comes in: a wheel's roll of one big push is a giant step, a short roll is a baby step, and the caller calls the same sizes to the whole line — wheels and feet travelling in one row, arriving in one row. A traveller can also be the caller for a stretch: calling the sizes IS playing the game at full stretch, and a caller who watches the line take their call learns the sizes by eye the way the line learns them by leg."),

    # ---------------- Quiet focus, just 3 more (quiet-focus age-3 primary 10 -> 11) ----------------
    A("sock-pair-match-basket", "Sock Pair Match Basket",
      "A basket of big clean odd socks: find the two that match — same colour, same stripes, same size — and roll each pair into a ball. Real laundry, real quiet.",
      ["quiet-focus"], (3, 3), (2, 8), (10, 20), ["indoor"],
      ["a basket of big clean odd socks (adult socks work best — long, bright, clearly patterned; every sock in the basket has its true pair in there too)", "a finished-pairs tray or second basket"],
      False, "Build the basket yourself and audit it like it matters, because it does: every sock's real pair must genuinely be in the basket — count them in pairs as you load it, since a basket with an unmatchable sock teaches that looking carefully does not pay. Use big socks with bold differences — stripes against spots, long against short, loud against plain — and nothing small or baby-sized: at three, the matching should be hard enough to need looking and easy enough that looking wins.",
      ["Tip the basket out together and look at the muddle for a moment: socks everywhere, no two together. Say the plain job: 'Every sock in this pile has its other half hiding in here. Socks live in pairs. Our job is putting the pairs back together — by looking.' That last phrase is the method and it gets said before a hand moves.",
       "State the one rule: 'Pick up ONE sock. Hold it where you can see it. Find the one that matches it — same colour, same pattern, same size.' First pair together, slowly: a sock held up, the pile searched with eyes first and hands second, its pair lifted out and the two laid side by side and CHECKED — toe to toe, stripe to stripe — because a near-match held up to the light is this activity's favourite discovery.",
       "Matching round: each matcher works their own socks at their own pace — hold, search, check, and when a pair is proven, roll it into a ball (one sock tucked into the other, the way real drawers keep them) and set the ball on the finished tray. Rolling the ball is the period at the end of the pair's sentence, and matchers will not skip it.",
       "Near-match moment: sooner or later two socks that almost agree — same stripes, different size — get held up together. Name what the eyes just did, out loud, as a skill: 'Those two fooled us for a second. Looking closer caught it.' A basket that cannot fool you teaches nothing; this one can, briefly, and being caught by it is the looking getting stronger.",
       "Finish with the empty pile and the full tray: every sock balled with its pair, and the group counts the balls along the tray in a row — the count is the laundry done. Then, if the room wants it, the adult unballs them back into the basket for tomorrow: a job that resets itself to be done again is a job a quiet corner can hold all year."],
      "Six pairs only, all wildly different, socks spread face-up in a single layer so the searching is done with eyes alone before hands are needed.",
      "A memory layer: pairs are matched with half the socks face-down — a sock's pair must be recognised from a cuff and a stripe of heel, and a wrong guess is turned back over and remembered, not regretted.",
      safety="Socks are clean laundry, full stop — this basket is washed, adult-supplied stock, never the group's own worn socks gathered up, and it goes back through the wash when it has been mouthed, as socks at three occasionally are. Socks are matched held in hands, never worn during the activity and never put over faces or heads, even in triumph. Small socks stay out of the basket: everything here is big, soft, and interesting to nobody's mouth for long.",
      copy_free=True,
      inclusion="Matching is done by eyes and announcement as much as by hands: a matcher who spots a pair from where they sit and calls 'Those two!' while a partner gathers them has matched that pair in full — the calling eye is the skill this activity trains. The whole pile works spread on a lap tray in a single layer, and holding a found sock up high for its partner to be spotted gives the holder the room's best job: being searched for."),
]

COLLECTION = {
    "id": "little-hands-just-three-more",
    "title": "Little Hands, Just Three More",
    "glyph": "\U0001F9E6",
    "when_to_use": "The second shelf banded for three-year-olds ONLY — a bud counted with one fingertip, a heart carried in two hands, a banner that only arrives if every hand walks together, a house painted by its own tenants. The first Just Three shelf proved the band works; these twelve keep narrowing the one honest gap left in the archive, the distance between the threes and everybody else. Reach for it in a young-threes room, a first month of program, or any group whose oldest kid just turned three.",
    "picks": [
        {"id": "big-heart-hand-delivery", "note": "One heart, two hands, one named friend — and the adult's list quietly guarantees every kid both gives one and gets one."},
        {"id": "one-branch-bud-count", "note": "One finger, one bud, one number. The touch is how a three-year-old keeps count, and the promised revisit makes it data."},
        {"id": "big-pot-stir-together", "note": "Nothing real goes in and nobody tastes it — dinosaur soup is legitimate in this kitchen, and five counted circles is a finished stir."},
        {"id": "rain-drums-on-pots", "note": "Fingertips for drizzle, palms for the five-second downpour. The silence after the storm is the sound worth sitting in."},
        {"id": "big-funnel-sand-pour", "note": "The bottle fills from the bottom up and the top fills last — said out loud, over a tray that makes missing safe."},
        {"id": "long-banner-carry-together", "note": "A hand every few steps or it folds. The halfway stop, holding it level together, is harder than the walking — they can feel it."},
        {"id": "how-i-got-here-moves", "note": "Every way of arriving gets copied by the whole room, at the teller's size. Wheels are a first-class movement here."},
        {"id": "big-tree-hug-listen", "note": "A real minute of held quiet outdoors. The tree will be making those sounds all day; they stopped long enough to hear them."},
        {"id": "sing-it-back-echo-lines", "note": "One line out, the same line back, whole. A small singer echoed by the entire room is a first solo with the room as instrument."},
        {"id": "paint-the-big-box-house", "note": "Paint goes on the house, brushes stay at the house — then the craft dries and becomes the room's new building for days."},
        {"id": "giant-steps-baby-steps", "note": "Nobody is ever out and nobody is sent back — said as a promise on the start line, and the whole line lands at the gate together."},
        {"id": "sock-pair-match-basket", "note": "A near-match held up to the light is the favourite discovery. Every finished pair gets rolled into a ball — real laundry, done."},
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
