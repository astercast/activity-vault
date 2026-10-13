#!/usr/bin/env python3
"""Wave 32: Little Hands, Just Three, Again — the third 3-only wave.

Wave 31's honest assessment named this wave the same way waves 29
and 30 named theirs: the age-3 gap (82 against 160 at age 4, gap
78) "closes only by more waves of this kind, at honest quality,
or not at all." This is the third wave of that kind: twelve more
records banded 3-3, built to the rules waves 30-31 proved —
short (<= 20 minutes), adult-led, big pieces, one rule per game,
the adult as a player — because the band is honest for the same
reason: these are three-year-old moments (holding up three
fingers, a snowball that grows because you rolled it, a worm
counted and left exactly where it lives), and age 4, holding 160
records, does not miss them.

Measured before this wave (primary category = categories[0],
records covering age 3): holidays and team-community were the
floor at 6 each; seasons / stem / icebreakers / outdoor /
music-rhythm 7 each; crafts 8, pe-movement 8, rainy-day 8,
quiet-focus 11. Rainy-day (29) is still the thinnest primary
category on the whole shelf, then music-rhythm (32) and seasons
(34). So the pack repeats the proven shape exactly: one record
for every one of the 11 categories — the floor rises 6 -> 7
everywhere — plus a second rainy-day record. Result, asserted
in the wave log: age 3 82 -> 94, age 4 unchanged at 160, the
headline gap 78 -> 66, narrowed for the third wave running.

Near-duplicate screen: token Jaccard >= 0.55 against every
existing name+tagline is asserted below and fails the run.
Closest deliberate neighbours, kept on purpose:
- paper-diya-welcome-row vs eight-lights-line-up (wave 29,
  Hanukkah lights placed on a marked table row and recounted):
  a different festival, named as itself; these lamps are
  carried in two hands and placed along a FLOOR path to welcome
  guests in, and each is lit as it lands — the path growing
  light by light is the activity, not a recount on a row.
- roll-it-bigger-snowball vs boot-print-snow-trail (wave 29,
  your prints walked out and counted back) and cup-of-snow-
  melting-watch (wave 28, snow watched indoors): nothing is
  counted or melted here — a snowball is packed and rolled and
  GROWS, and the growing is felt in the hands doing it.
- big-tape-roads-car-town vs cushion-train-all-aboard (wave 28,
  kids ARE the train, a ticket block passes hand to hand): no
  child is a vehicle here — the roads are taped on the floor
  first, as a building job, and big toy cars do the travelling
  while the builders drive from beside the road.
- fog-window-finger-drawing vs window-raindrop-follow (wave 30,
  a real raindrop followed down real glass): that record refuses
  to fake its rain; this one makes its own weather — an adult
  mists the glass, and the drawing exists only until the fog
  fades, which is why a wrong mark cannot exist in it.
- big-shadow-grow-shrink vs shadow-guess (an older guessing
  game with shadow shapes): nothing is guessed — a shape is
  moved nearer to and further from the light on the group's
  directions and the shadow's size obeys, said in plain words:
  nearer the light, bigger the shadow.
- sponge-pass-fill-the-pot vs pass-it-down-delivery-line (wave
  27, dry goods delivered hand to hand, a seated line counts in
  full) and sponge-squeeze-station (wave 26, a solo quiet-focus
  job: one sponge, two tubs, squeeze to a fill line): the cargo
  here is water held in a sponge, it drips, it travels down a
  whole TEAM line, and the job ends in a counted squeeze over a
  pot at the line's end — nobody squeezes alone at a tub, and
  the delivery is measured in what arrives still wet.
- after-rain-worm-count vs worm-weather-watch (5-12, STEM:
  count worms in a marked square, log the weather, find the
  pattern): no square, no log, no pattern-hunting — that is a
  young scientist's data record; this is a three-year-old's
  careful-feet count along a whole path, where the count is
  the greeting and touching is the one thing nobody does.
- show-me-three-fingers vs finger-count-breath (an older
  calm-down counting breaths on fingers): nobody is calming
  down — this is the three-year-old room showing its own age,
  the hard fine-motor trick of holding three fingers up, copied
  round the circle like every other hello in this archive.
- after-rain-worm-count vs nature-color-match-walk (wave 26,
  colours matched on a walk): nothing is matched and the group
  barely walks — the path is searched, worms are counted where
  they lie, and touching is the one thing nobody does.
- feel-the-beat-heart-tap vs knee-drum-copycat (wave 27, tap
  patterns grown one tap at a time on knees): no pattern is set
  or copied — the beat tapped is the tapper's own heartbeat,
  fast after marching, slower after resting, felt first and
  tapped second.
- big-sponge-stamp-mural vs apple-print-painting (printing with
  cut apples) and big-brush-painting (wave 26, big brushes on
  big paper): the stamp is a sponge shape, pressed and lifted
  straight, and the picture is a mural built print by print
  along one long sheet the whole group shares.
- big-ball-kick-to-wall vs pumpkin-bucket-toss (throwing into a
  bucket, older band): nothing is thrown and nothing is aimed
  into a container — a foot meets a big light ball, the wall
  stops it, and kicking, the one big movement this shelf had
  not taught the threes, is the whole record.
- big-zip-up-down-board vs pool-noodle-rope-threading (wave 27,
  big rings threaded onto a rope): nothing is threaded — one
  chunky zip on a board, pulled up and down slowly, the pull
  tab big enough for a whole fist, a dressing skill practised
  where no coat is waiting on it.

Safety notes are practical only — no medical claims anywhere.

Run once: dedupes by id, writes data/activities.json + collections.json.
Run scripts/build.py afterwards.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_winter import A, DATA

DIW = ["holiday:diwali"]
WIN = ["season:winter"]
SPR = ["season:spring"]

PACK = [
    # ---------------- Holidays, just 3 again (holidays age-3 primary 6 -> 7; floor) ----------------
    A("paper-diya-welcome-row", "Paper Diya Welcome Row",
      "Big paper diya lamps carried in two hands and set along a floor path, each one lit as it lands — a welcome written in light, one lamp at a time.",
      ["holidays"], (3, 3), (4, 16), (10, 20), ["indoor"],
      ["big paper diya lamps (adult-made: stiff card folded into a shallow boat shape, palm-and-a-half wide, one per kid plus spares)", "battery tea lights (adult-handled, screwed-shut battery covers, one per lamp)", "a clear floor path from the door to a rug or reading corner (the welcome route)"],
      False, "Make the diyas yourself beforehand — big, stiff, and plain, with a flat spot in the middle where a tea light sits without wobbling when a lamp is set down by small hands; test-carry each one across the room yourself. Say the real thing plainly in your own head before the group hears it: Diwali is the festival of lights, and clay diya lamps are lit and set out to welcome guests and good fortune into a home. Tea lights are battery ones, screwed shut, and they are switched on by adult hands only, at the moment each lamp is placed — the light arriving is the adult's half of the job; the carrying and placing are the kids'.",
      ["Name the festival in one plain sentence: 'Diwali is a festival of lights. Families light small lamps called diyas and set them where guests come in, to welcome them. We are making a welcome row of lamps along our path.' State the one rule: 'Two hands carry the lamp. Walking feet. You set it down gently where the path is waiting.'",
       "First lamp together, yours: carry a diya in two hands down the path at walking pace, set it down at the path's start with both hands still on it, and switch its light on only once it is placed — then step back with the group and look at one light, alone, doing its job. One lamp is a light; the row is the welcome, and the group should see the difference coming.",
       "Placing round: one carrier at a time, lamp carried in two hands, set down at the next spot along the path — the spots close enough that the lights read as a row, far enough that each placing is its own walk. The carrier walks back empty-handed along the path's edge, never through the lamps. Lit lamps are never picked up again; a lamp that has landed has arrived.",
       "Halfway look: stop the carrying, gather at the door end, and look down the path together — half light, half waiting. Name what is happening in the plainest words: 'The welcome is half built.' Three-year-olds who can SEE the job half done will finish it like builders.",
       "Finish at the last lamp: the final carrier places theirs, the light goes on, and the whole group walks the finished row once, slowly, guest-style, from the door to the rug — arriving the way the lamps were lit to welcome. Then lights off, lamps collected in two hands by their makers, and the row exists in the room's memory at full brightness."],
      "A short path of four lamps to the rug only, the adult walking each carry beside the carrier with a hand under the lamp without touching it.",
      "A second row on the path's other side, placed by the returning carriers — the group judges whether the two rows match lamp for lamp, and a missing lamp is a discovery, not a mistake.",
      safety="Battery tea lights only — no real flame, no oil, nothing hot exists in this activity at any point. Battery covers stay screwed shut and lights are switched and handled by the adult; a tea light is never a toy and never goes in a mouth, and the lamps are carried, never the lights alone. Carriers walk one at a time along a clear path: a room of three-year-olds all carrying lamps at once is a collision arranged in advance, and stepping over a placed lamp is not a route — the path's edge is.",
      tags=DIW, copy_free=True, no_elimination=True,
      inclusion="A lamp's placing counts however it travels: a carrier can carry theirs on a lap tray wheeled along the path's edge, place it seated-to-seated from the row's end, or direct the adult as co-carrier — 'there... down... light it' — with the setting-down and the switching done at their word. The door-end lookout job, calling 'the welcome is growing!' as each light lands, belongs to whoever holds it and runs the whole ceremony."),

    # ---------------- Seasons, just 3 again (seasons age-3 primary 7 -> 8) ----------------
    A("roll-it-bigger-snowball", "Roll It Bigger Snowball",
      "One small snowball, rolled along the snow by many mittens: it picks up snow as it goes and grows — everybody can feel it getting heavier.",
      ["seasons"], (3, 3), (2, 12), (10, 20), ["outdoor"],
      ["real snow on the ground, deep and soft enough to pack (the adult has tested it)", "mittens or gloves for every roller", "one marked rolling lane (a path the adult has walked first: flat, clear, no ice)"],
      True, "The set-up is the snow itself, and the adult checks it like equipment: it must pack — a handful squeezed must hold together — because powder that will not pack teaches only frustration, and a day of wet snow is this activity's whole season. Walk the rolling lane first: flat, clear of ice and sticks, ending somewhere the finished snowball can stay as the group's work. Start the first core ball yourself, fist-sized and packed hard: a soft core falls apart under new rollers and the growing never starts.",
      ["Show the core ball and say the plain snow fact the whole activity hangs on: 'Snow sticks to snow. If we roll this little ball along the ground, it picks up more snow and gets bigger. Watch my hands — we push it, we never throw it.' State the one rule: 'Mittens on, hands push together, and the ball stays on the ground.'",
       "First roll together: everyone who can reach kneels or stands round the ball and pushes it one slow turn along the lane, hands flat on its sides. Stop after a few turns and LOOK: the ball is wearing a new coat of snow and its shape is already less round. That first visible growth is the lesson landing — name it: 'It grew. The rolling did that.'",
       "Rolling round: the ball travels the lane with rollers swapping in as it grows — and it will need swapping, because a bigger ball is a heavier push, and two fresh mittens on each side is how it keeps moving. Rollers who are not pushing walk beside it as the escort, watching for the thin patches where the ball picks up grass instead of snow, and calling the turn-around.",
       "Heavy moment, planned for: somewhere down the lane the ball gets too heavy for its current crew, and that is a ceremony, not a failure — everyone gathers, hands go flat on it together, and the group pushes it its last turns in one shared heave. A three-year-old who has felt a thing outgrow their own strength, safely, with help arriving, has learned the snowball's second lesson.",
       "Finish where the lane ends: hands off, step back, and look at what the lane made — a ball that started in one adult fist. Compare it honestly with body words: 'It is as big as a pumpkin. As big as somebody's tummy.' It stays where it finished for the day, the group's work on display, melting on its own schedule like everything made of snow."],
      "A table-top version at a tray of shaved ice or a short lane of three turns only, the ball finished at handful size and compared with the core the adult kept back.",
      "Two balls, two short lanes, rolled side by side: which grew bigger over the same ground, and can the group say why — wetter snow, more turns, more mittens?",
      safety="Snowballs are rolled, never thrown — at three, the rule is absolute and said first, because a ball this activity grows heavy is a ball nobody lifts at all: if it cannot be rolled by its crew, it is finished, not carried. Mittens stay on for every push; cold hands end a roller's turn without debate. The lane is adult-walked and ice-free, and eyes stay on the ball, not on faces — no snow goes near anyone's face, in play or in triumph, ever.",
      tags=WIN, copy_free=True, no_elimination=True,
      inclusion="Every roller rolls: the ball's lane passes a seated roller stationed at its edge, whose push — with a hand, a forearm, or a tray edge leaned into it — counts in the turning exactly as any push does, and the escort job, riding alongside calling 'grass!' at the thin patches, is the roll's navigation. The final shared heave includes every hand that wants in, at whatever height the ball offers a side."),

    # ---------------- Rainy-day x2, just 3 again (rainy-day age-3 primary 8 -> 10; floor + thinnest category) ----------------
    A("big-tape-roads-car-town", "Big Tape Roads Car Town",
      "Painter's tape roads laid straight across the floor, and big chunky cars to drive them: the town is built first, then driven, stop by stop.",
      ["rainy-day"], (3, 3), (3, 12), (15, 20), ["indoor"],
      ["low-tack painter's tape (adult-torn lengths ready)", "big chunky toy cars and trucks (too big to be a mouth worry, one per driver plus spares)", "a smooth floor space big enough for two or three roads"],
      False, "Build the town's skeleton before the drivers arrive: one long straight tape road across the floor, pressed down by your own palm along its whole length, edges flat — tape that lifts trips feet and stops cars, and neither is the activity. Leave the roll and pre-torn lengths where the group can build with you: the second and third roads are theirs to lay, with your hands smoothing. A road needs a destination a three-year-old can name: the rug is the park, a taped square is the shop, the bookshelf is home.",
      ["Show the first road and say the plain job: 'This is a road. Cars drive ON roads. We are going to build a car town — first the roads, then the driving.' State the one rule: 'Cars stay on the roads, and feet walk around them.' Model one drive yourself, slowly, down the whole first road, stopping at its end and naming the place you have arrived at.",
       "Building round: the group lays the next roads with you — a length of tape carried flat in two hands, set down along a line the adult points, pressed smooth by every palm that reaches it. Roads can join the first road or run beside it; a road that wanders gets named for where it ends up, because at three the town plans itself around the building.",
       "Driving round: one car per driver, driven by a hand on its roof at walking-hand pace. Drivers call their destinations as they set out — 'Going to the shop!' — and the town answers when they arrive. Two cars meeting on one road is traffic, handled the town way: one waits, one passes slowly, nobody lifts a car over another.",
       "Rush moment, once, on purpose: you call 'Lots of cars today!' and every driver drives at the same time, slowly, on their own roads. The town holding a whole group's traffic at once — cars on roads, feet on the paths between them — is the picture this activity was built to reach, and the calm inside it is the skill.",
       "Finish with the town at rest: cars parked in the taped square, drivers standing back to look at the whole map they built and drove. Tape roads can stay down for the day — a town on the floor gets visited again — and peeling them up at tidy time, slowly, in whole lengths, is a job the builders will queue for."],
      "One road only and two big cars, the adult driving the second car as traffic company for the whole session.",
      "Add one taped STOP square mid-road: cars that reach it must stop, count to three with the group, then drive on — the town's first traffic rule, invented by its builders.",
      safety="Tape is low-tack and floor-only — never on skin, hair, or faces, and peeled-up tape is balled by the adult straight into the bin, because a loose tape ball is a mouth-sized curiosity. Cars are big and chunky with no small detachable parts, checked before the town opens. Driving happens crouched or seated at the road's edge; nobody walks ON a road while cars are moving — feet use the paths, which is the town's rule and the room's safety in one sentence.",
      copy_free=True,
      inclusion="A road reaches every driver: one road is laid straight to a seated driver's place and along their tray edge if needed, so their car sets out from home like everyone else's. Driving a car by pushing it with a palm, a fist, or a pusher stick taped chunky at the grip is driving in full. The town planner job — choosing where the next road goes and pointing its line while the layers lay it — builds the town as surely as tape does."),

    A("fog-window-finger-drawing", "Fog Window Finger Drawing",
      "The grown-up mists the window until it fogs, and one finger draws a sun, a face, a wobbly house — then the fog fades and takes every mark with it.",
      ["rainy-day"], (3, 3), (2, 10), (10, 15), ["indoor"],
      ["one big window or glass door the group can reach the bottom half of (adult-checked: sound glass, low sill)", "a spray bottle of plain water (adult's hands only)", "no other materials — one finger per artist"],
      True, "Choose the glass like it matters: a low window the group already gathers at, sound and clean, with the bottom panes at standing three-year-old height. Test your fog before the group arrives — a fine mist, wiped hands, and one test drawing of your own: the fog must hold a finger line long enough to finish a sun, and if the room is too warm and dry for fog to hold, a cold day or a breathed-on pane is the honest version and the session waits for its weather.",
      ["Gather at the window and say the plain wonder of it straight: 'Watch. I am going to make weather on the window.' Mist the pane in front of the group — the fog arriving IS the opening ceremony — 'Now the window is foggy, like a cloud sat on it. And a finger can draw in a cloud.' Draw your own sun first, one finger, slowly, so the line appearing is watched, not just the sun.",
       "State the one rule: 'One finger draws. The fog does the rest — and when it fades, the drawing goes home with it. Nothing in this picture can be wrong, because the window keeps nothing.' That promise is the activity: a first drawing medium with no wrong marks in it, and three-year-olds who have been corrected at paper will test the promise and find it true.",
       "Artists' round: each artist gets a fresh-misted stretch of pane — re-misted by you between artists — and draws whatever one finger draws: suns, faces, spirals, a line that is honestly a line. Drawings are named by their makers if they want naming; a spiral called 'my dog' is a dog, and the window agrees with every artist.",
       "Fading watch, the quiet middle: when several drawings share the glass, stop misting and watch together as the fog thins — edges softening, lines going pale, the window clearing itself. 'The sun is drying our cloud.' A room of three-year-olds watching a picture disappear on purpose, unhurried, is practising something most media never teach: a thing can be finished by ending.",
       "Finish with one group drawing: a fresh mist across the whole pane, every artist adding one mark each in turn — a stripe of sun, a dot, a door — until the window holds the whole group's one picture. Then stand back and let this one fade together too, while everyone is watching, because the fading is the frame this gallery hangs on every piece."],
      "One small pane and three artists, the adult misting smaller and oftener, drawings limited to one shape each: a circle is a complete picture here.",
      "Drawing pairs: one artist draws, and their partner must guess what it is BEFORE it fades — the fading sets an honest clock no timer has to enforce.",
      safety="The spray bottle lives in adult hands, filled with plain water only, and is never pointed at a face — it mists glass, full stop. The glass is adult-checked, sound, and never leaned on: drawing fingers press as lightly as writing on a cloud requires, which the fog itself teaches in one smudged line. Wet drips below the window are wiped as they come — a wet floor under standing artists is the one real hazard in a weather activity, and it is managed with a cloth, not a lecture.",
      copy_free=True,
      inclusion="The window comes down to every artist: a low pane, a glass door's bottom section, or a hand mirror misted on a tray all hold fog and a finger line equally well, and the drawing counts in full whatever glass it clears from. An artist can also direct a drawing — 'a sun... with a face... there' — while the adult's finger draws exactly what is directed, which is authorship by the oldest method there is."),
]
PACK += [
    # ---------------- STEM, just 3 again (stem age-3 primary 7 -> 8) ----------------
    A("big-shadow-grow-shrink", "Big Shadow Grow and Shrink",
      "One big cardboard shape, one lamp, one wall: move the shape nearer the light and its shadow grows — the group directs, the shadow obeys.",
      ["stem"], (3, 3), (3, 12), (10, 15), ["indoor"],
      ["one big cardboard shape (adult-cut: a star, a fish, a hand — bigger than two kid hands, held on a stick or by its edge)", "one lamp or bright torch on a stable stand (adult-positioned, shining at a clear wall)", "a room that can be dimmed a little"],
      False, "Set the stage before the group sits: lamp steady and adult-height-handled, wall clear, shape tested through its whole journey — from right against the wall to right against the light — so you know the shadow stays on the wall and the shape never has to touch anything hot or bright. The shape is plain and bold: a three-year-old reads a shadow by its outline, and a shape with ears, points or a tail gives the group something to watch change size. Nobody carries the lamp but you; that is fixed before the first shadow appears.",
      ["Darken the room a little, switch the lamp on, and make the first shadow yourself without a word of explanation: shape against the wall, a small neat shadow — then walk it slowly toward the light and let the group watch the shadow swell across the wall. Their reaction IS the introduction. Then say the plain sentence it all hangs on: 'The shadow does what the shape does — but bigger, when the shape goes nearer the light.'",
       "State the one rule: 'Only the grown-up holds the light and the shape. Everybody else is a director — you tell it: nearer... further... stop.' Directors' hands stay in laps or pointing; pointing is a director's whole toolkit and it is enough.",
       "Directing round: the group directs the shape's journey in chorus and by turns — 'NEARER!' as it creeps toward the lamp and the shadow climbs the wall, 'further...' as it shrinks back down. Call the sizes as they pass: 'As big as the door! As big as a cat!' — naming a shadow's size against real things is measurement in the only units this room needs.",
       "Freeze moments: on a director's 'STOP!', the shape freezes and everyone looks hard at the shadow's edges — fuzzy when the shape is near the light, sharper when it is near the wall. Say only what eyes can check: 'Near the light, the shadow is big and soft at the edges. Near the wall, small and sharp.' Two facts, both visible, both theirs now.",
       "Finish with the biggest possible shadow: the group directs the shape as near the light as it safely goes, the shadow fills the wall, and every director puts their own hands up into the light's edge from their seats to see their hand-shadows join it — a wall full of shadow, made by the whole room, before the lamp goes off and the ordinary wall comes back."],
      "Two positions only, marked on the floor: BIG (near the light) and SMALL (near the wall) — directors call just the two words and the shape travels between them.",
      "A second shape joins: the group directs two shadows to the same size — one near, one far, matched by eye — and argues about whether they truly match, which is the point.",
      safety="The lamp is the adult's, positioned once and never carried, aimed at a wall and never at eyes — its brightness is respected the way this archive respects every bright thing, by looking at what it lights, not at it. The shape travels in the adult's hands only, so no small body ever crosses between a hot or bright lamp and the wall. Directors direct from their seats; the floor between seats and wall stays empty, because a shadow stage with a toddler wandering it teaches collisions, not optics.",
      copy_free=True, no_elimination=True,
      inclusion="Directing is the activity, and it runs on any signal a director has: a word, a point toward or away from the light, a big-arms gesture for GROW and hands-close for shrink — every director's call moves the shape the same distance. A director can also hold the SECOND shape at the wall end, still, as the size the moving shadow must match — the fixed point the whole experiment leans on, held by its most patient scientist."),

    # ---------------- Team & community, just 3 again (team age-3 primary 6 -> 7; floor) ----------------
    A("sponge-pass-fill-the-pot", "Sponge Pass: Fill the Pot",
      "One soaked sponge passed hand to hand down the whole line, and a squeeze over the pot at the end: the line's job is measured in what arrives still wet.",
      ["team-community"], (3, 3), (5, 14), (10, 20), ["indoor", "outdoor"],
      ["one big soft sponge (adult-sized, the drippier the better)", "a bucket of water at the line's start (adult's station)", "a pot or clear jug at the line's end (the fill target — a mark on its side is the goal)", "a tray or mat under the whole line (the drips' home)"],
      False, "Set the line's country before the team does: tray down the middle of where the line will stand or sit, bucket at one end with you, pot at the other with its goal mark where everyone can see it. Test the sponge yourself — it should be big enough that a squeeze visibly matters and drippy enough that passing it hand to hand is an event, not a formality. The distance matters: the line must be long enough that the pass is a journey, short enough that the sponge arrives still worth squeezing.",
      ["Show the dry pot and its mark and say the plain job: 'This pot needs filling, and the water bucket is way over there. Our water travels in this sponge, hand to hand, down the whole line. The last hands squeeze it into the pot. Then we do it again, until the water reaches the mark.' State the one rule: 'The sponge travels hand to hand. Nobody carries it. Nobody squeezes until the end.'",
       "First pass together, slow: you soak the sponge, it travels down the line hand to hand — every pair of hands holding it a moment, feeling the weight and the drip — to the end hands, who squeeze it over the pot while the whole line counts the squeeze: 'One... two... three.' The first squeeze's water lands visibly short of the mark, which is the best possible news: the line can see exactly how much journey is left.",
       "Passing rounds: the sponge returns UP the line dry-side — carried back by the adult or passed back hand to hand, the group will have opinions — gets re-soaked, and travels again. Round by round the pot climbs: call the level at every squeeze, in handful words first and mark words as it nears: 'Halfway to the mark. One squeeze from the mark...'",
       "Careful-hands discovery, somewhere mid-game: the line will notice on its own that a gentle pass arrives wetter than a hurried one. When it is noticed, name it as the team's own finding: 'Slow hands keep the water.' No adult announced that rule — the sponge taught it, and a rule a team discovers is a rule the team keeps.",
       "Finish at the mark: the squeeze that reaches it gets the full count and the full ceremony — the whole line looks into the pot together, and the number of journeys gets told back: 'Six trips the sponge made. Every hand in this line carried the water.' The pot's water waters a plant or washes the tray down, poured by the end hands: the fill was never the point; it also always has a use."],
      "A short line of four, the pot a small jug with a low mark: two journeys fill it, and the team finishes while the discovery is still fresh.",
      "Two sponges travelling: a second sponge starts when the first is halfway home — the line must keep two journeys straight, and the squeeze count doubles at the pot.",
      safety="Water stays on the tray's country: the line stands or sits on a dry edge of it, and drips that escape are the adult's cloth's job between rounds — a wet floor under a standing line is a slip arranged in advance. The sponge is squeezed only over the pot, never at a neighbour; water play at three stays kind or it stops. Bucket water is clean, changed if it gets grubby, and never drunk — a line thirsty from watching water is offered the drinking kind, from a cup, away from the game.",
      copy_free=True, no_elimination=True,
      inclusion="A seated line counts in full — this archive has said it before and the sponge proves it again: hands at chair height pass a sponge exactly as standing hands do, and a pass that travels palm to palm across a lap tray has travelled. The end-hands job — the squeeze over the pot, counted by the whole line — can be held by any hands the team sends the sponge to, including hands the adult steadies from underneath while the squeezing stays theirs."),

    # ---------------- Icebreakers, just 3 again (icebreakers age-3 primary 7 -> 8) ----------------
    A("show-me-three-fingers", "Show Me Three Fingers",
      "Everybody in this room is three — so everybody learns the hard, proud trick of holding up three fingers, and the whole circle copies yours.",
      ["icebreakers"], (3, 3), (4, 18), (10, 15), ["indoor"],
      ["no materials — hands only, ten fingers per expert"],
      True, "No set-up beyond knowing your room: this is the three-year-old room's own party trick, and it only works because everyone in it shares the number. Practise your own three first with the hand you will model with — thumb holding the little finger down is the classic route, but fingers that arrive at three by any honest road are the point of the session, and your model should be the achievable kind, wobble included.",
      ["Hold your hand up and say the plain boast that starts it: 'I am going to tell you something about this whole room. Every single person here is THREE. And three has a sign. Watch.' Make your three slowly — folding the little finger down, holding it with your thumb — and count the standing fingers out loud: 'One, two, THREE. That is us.'",
       "State the one rule: 'One shower at a time, and the whole circle copies their three — exactly their three, wobbles and all.' Go in seat order, known in advance, so every shower knows their moment is coming and nobody's hand is a surprise.",
       "Showers' round: each kid raises their three any way their hand can manage it — the classic fold, fingers spread wide, a three built with the other hand's help, a three held for one second before the fingers spring back. The circle copies it faithfully: spread for spread, wobble for wobble, and counts the copy together — 'One, two, THREE' — because the count is the room agreeing the sign is real.",
       "Hard-finger honesty: somewhere in the round, a little finger will refuse to stay down, and it gets named kindly as the room's shared enemy: 'That little finger has its own ideas. Everybody's does.' A hand helped by its partner hand is not a failed three — it is the standard three at this age, and the circle copying the helped version says so without a speech.",
       "Finish with the whole room's sign at once: 'Show me three!' — every hand up, every version of three the room owns, held for a count of three, counted by everyone. Photograph it in your memory if not in fact: eighteen different threes, all correct, is the three-year-old room's group portrait."],
      "Two fingers first as a warm-up sign ('show me two — the easy cousin'), then three: the room feels its own hands level up inside one session.",
      "Signs grow: thumbs-up for 'yes', a wave for 'hello', a flat palm for 'stop' — the circle builds its first three-sign language, every sign copied the shower's way.",
      safety="Hands only, at hand height: a showing hand never goes in another kid's face, and copies are made looking at your own hand, not grabbing a neighbour's fingers to arrange them — fingers get folded by their owner or their owner's other hand, nobody else's. A hand that does not want to show rests, and its owner directs a copy from the adult's hand instead; the circle copies that one with the same respect, because directing your sign is showing it.",
      copy_free=True, no_elimination=True,
      inclusion="Three arrives by every road: folded with a thumb, held down by the other hand, spread wide and counted, or shown on a hand resting on a tray with fingers lifted one by one while the circle counts them standing. A shower who directs the adult's hand — 'that one down... that one up... THREE' — has built the sign in full, and the circle copies the directed three exactly as proudly as any other."),

    # ---------------- Outdoor, just 3 again (outdoor age-3 primary 7 -> 8) ----------------
    A("after-rain-worm-count", "After-Rain Worm Count",
      "After rain, the worms come up onto the path: the group counts them where they lie, steps carefully round them, and touches not one.",
      ["outdoor"], (3, 3), (2, 12), (10, 20), ["outdoor"],
      ["a paved path or playground edge on a morning just after rain (the adult has walked it first and found worms to count)", "no other materials — eyes and careful feet only"],
      True, "The set-up is timing and scouting, and both are the adult's: worms come onto hard ground after rain, so this is a morning-after activity, taken when the weather offers it, not scheduled against it. Walk the path yourself first: there must be worms actually there to count — a wormless path is a walk, not a count — and note where they are thickest, so the group's careful feet are planned around real residents, not hoped-for ones. Soft ground beside the path is the stepping-aside place; check it is not a swamp.",
      ["Gather at the path's edge and say the plain true framing: 'Last night it rained. When it rains, worms come up out of the wet ground and onto the path. We are going to count how many came up on OUR path. And the rule that matters most —' state it whole: 'We count with our eyes. Nobody touches a worm. Their skin is their breathing, and hands are too rough and too dry for them.' Said once, plainly, as care rather than warning.",
       "First worm together: walk the group to the first one you scouted, everyone stops a full step back, and the group looks properly — its length against a leaf, its slow way of moving, which end is going where, argued about with real interest. The count starts: 'One.' A worm counted is a worm greeted: 'Hello, worm one.' Three-year-olds who greet a resident do not step on it.",
       "Counting walk: the group moves along the path at worm pace, which is to say barely, stopping at every worm — 'Two... three...' — with pointers counting from a step back and steppers stepping WIDE around every counted resident. A worm lying across the whole path stops the walk entirely: the group watches it cross, or the adult moves it gently on a wet leaf if it is truly stuck in harm's way, and the moving is watched as the skilled, kind exception it is.",
       "Thick-patch moment: where the worms are many, the count slows and the looking deepens — big ones, small ones, one coiled, one stretched to its full surprising length. Compare honestly in body words: 'That one is longer than my finger. That tiny one is a baby-sized worm.' Nobody's measure needs a ruler; the path is the chart.",
       "Finish at the path's end with the number told back whole: 'Eleven worms came up on our path after the rain.' Then the group leaves the path the way it came, stepping round the same residents, and the last word is the plain cycle said out loud: 'When the ground dries, they will go back down where it is safe and wet. The path is theirs until then.' A count that gets retold at lunch is data at this age, and it will be."],
      "A three-worm path and a very small group: the whole count at one crouch, with the step-wide practised once around a worm the adult found first.",
      "Count a second surface — the grass edge as well as the path: which ground had more worms after the same rain, and can the counters say by how many, in fingers if not in words?",
      safety="Nobody touches a worm, ever — the rule is the activity's spine, stated as the worm's need, not the children's fault: worm skin is delicate and dry hands harm it, full stop. Feet step wide and eyes watch the ground; the adult walks the route first so no worm is a surprise under a running foot — and walking, only walking, is the pace, because this path has residents. Hands that never touched a worm still wash back inside, as after any outdoor work; the path after rain holds more than worms, and the washing is routine, not alarm.",
      tags=SPR, copy_free=True,
      inclusion="Counting is done by voice and pointing from wherever a counter is stationed: a counter watching from the path's edge, whose 'there — one more!' is called out and chalked into the group count by the adult, has counted that worm in full. The step-wide is done at every wheel's width too — the route is walked first by the adult precisely so its residents and its careful lines suit every traveller who will take it."),

    # ---------------- Music & rhythm, just 3 again (music age-3 primary 7 -> 8) ----------------
    A("feel-the-beat-heart-tap", "Feel the Beat: Heart Tap",
      "March in place until your heart goes fast, hand flat on your chest to feel it — then tap that beat on your knees, and tap it again slower after the rest.",
      ["music-rhythm"], (3, 3), (4, 14), (10, 15), ["indoor"],
      ["no materials — hands, chests and knees only", "a rug or clear floor space for marching in place"],
      True, "No set-up beyond clear floor and your own rehearsal: put your hand flat on your own chest first and march in place for twenty seconds — you must be able to feel your own beat clearly enough to describe it, because at three the whole activity is 'can you find it on yourself', and a teacher who has just found theirs teaches it in half the words. Plan the rest as carefully as the marching: this activity is a fast half and a slow half, and the slow half is where the music is.",
      ["Start still: everyone standing or seated, one hand flat on their own chest, quiet for a moment. Say the plain body fact: 'Inside you, your heart is beating, all the time, like a drum that never stops. Sometimes it is hard to feel. We are going to make it easy to feel — and then play it.' A few kids will find a beat just from the stillness; let them announce it. Most will need the march, which is coming.",
       "State the one rule: 'Your hand stays on YOUR chest. Your beat is yours — we never feel anybody else's.' Marching round: the whole group marches in place together, twenty honest seconds, knees up, arms swinging — then 'Stop. Hand on your heart. FEEL it.' The room goes still with hands on chests, and the finding happens in faces before it happens in words: there it is, thumping away, fast.",
       "Tapping round, fast: hands move to knees and tap the beat they just felt — tap-tap-tap at marching speed, the group tapping its own hearts' tempo together, roughly and gloriously not in unison. Say the earned sentence over the tapping: 'That is your heart's song right now. It is fast because you marched.'",
       "Resting round, the turn: everyone sits, hands back on chests, and the group breathes and waits while the drum inside slows — give it real time, a slow count of twenty — then hands find the beat again: 'Feel it now? Slower.' Knees tap the second tempo, gentle where the first was busy, and the difference between the two tappings is the whole lesson, played by every musician on their own body.",
       "Finish by naming the instrument properly: 'Your heart is a drum you carry everywhere. Fast when you run, slow when you rest, and it never, ever stops playing.' One last still moment, hands on chests, feeling the resting beat together — the quietest ensemble this room will ever be part of, and every player in it is the instrument."],
      "Seated beats only: stamp feet in place instead of marching, twenty stamps, then feel and tap — the fast beat arrives the same, at table height.",
      "A third tempo joins: after a slow sway to a lullaby the group knows, feel and tap the swaying beat — three speeds of the same drum, told back in order at the end.",
      safety="Hands on your own chest only — the rule is stated before the first march and holds absolutely; nobody feels, taps, or thumps anybody else's chest, in play or in curiosity. Marching is twenty seconds in place and stops on the word; a kid who feels dizzy or done sits straight down and rests with the resting group early — resting is a full part in this activity, never an exit from it. The record makes no health claims and reads no one's beat aloud for comment: every heart in the room is described as doing its job, because that is the whole of what is claimed.",
      copy_free=True,
      inclusion="The drum is found at every position: marching can be feet stamping seated, arms pumping, or wheels rocking — the beat quickens for effort of any kind, and the hand that feels it can rest on a chest directly or over the adult's hand placed there at the feeler's direction. A tapper whose tapping is one finger on a tray plays their tempo as truly as any knees in the room; the beat is the music, never the limb that plays it."),

    # ---------------- Crafts, just 3 again (crafts age-3 primary 8 -> 9) ----------------
    A("big-sponge-stamp-mural", "Big Sponge Stamp Mural",
      "Chunky sponge shapes dipped in paint and pressed straight down on one long shared sheet: print, lift, look — a mural built one honest print at a time.",
      ["crafts"], (3, 3), (4, 14), (15, 20), ["indoor", "outdoor"],
      ["chunky sponge shapes (adult-cut from thick sponges: circles, stars, houses — each bigger than a kid's whole hand)", "one very long sheet of paper, taped down flat (the mural)", "washable paint in wide shallow trays (one per colour)", "a wiping cloth per painter"],
      False, "Build the mural's country before the painters sit: the long sheet taped at every corner and along its edges — a sheet that slides under a pressing hand teaches chasing, not printing — and trays shallow enough that a sponge dips its face, not its whole body. Cut the sponges yourself and test each one: a shape that prints as a blob gets recut now, because the first time a star prints as a star is the moment this activity explains itself to the whole table at once.",
      ["Show the empty mural and the dry sponges and say the plain job: 'This long paper is going to become a picture of everybody's printing. A sponge shape gets paint on its face, presses down on the paper, and lifts straight up — and leaves its shape behind.' Demonstrate the whole move yourself, slowly: dip, press, count one-two, lift straight — 'The lifting is the printing. Pull sideways and it smears; lift straight and it stays a star.'",
       "State the one rule: 'Dip, press, lift straight. One shape, one print, then look at it before you print again.' First prints together: each painter's first print lands on the mural's near end with the group watching each lift — star, circle, house — because a print appearing out of a lift is a small magic trick the whole table needs to see land before the printing spreads out.",
       "Printing round: painters work along the sheet at their own stations, shapes shared by calling for them by name — 'Pass the house!' — and waiting for the pass. Prints can row up in lines, crowd into gardens, or stand one per child with space around; the mural takes every arrangement as its style, and a print that lands pale gets named honestly: 'That one needs more paint on its face' — a fixable fact, not a failed star.",
       "Smear moment, planned for kindly: sooner or later a lift goes sideways and a star becomes a comet. Name it as the mural's first comet, because it is one, and let its maker decide: it stays as the comet it became, or one clean print goes beside it as its star. Both choices stay on the mural; the smear rule was physics, not judgement, and the mural proves it.",
       "Finish when the sheet is printed to its far end: cloths down, hands washed by painters in turn, and the whole group walks the mural's length slowly, reading it like a story — who printed the garden, where the comet lives, whose house stands by whose star. It dries flat where it lies and goes up whole: a wall built of lifts, every print in it the shape it meant to be, or better."],
      "Three painters, three shapes, one short sheet: one print each per colour, and the mural finished inside ten minutes at full quality.",
      "Pattern printing: prints must alternate — star, circle, star, circle — down one whole row, called along the row by the group before each press, so the pattern is planned aloud and printed by hands.",
      safety="Washable paint only, in shallow trays that cannot tip into a lap when a sponge presses them. Sponges are big and single-piece — no small cut-offs anywhere near the table, because a painty sponge piece is a mouth magnet at three. Pressing happens seated or standing still at the sheet's edge; nobody reaches ACROSS wet prints to print further in — the sheet is walked around, because a sleeve dragged through a garden of prints is a mural redrawn by accident.",
      copy_free=True,
      inclusion="A print lands from any height the sheet is met at: the mural runs along a low table edge and the floor alike, and a sponge pressed with a palm, a fist, or two hands stacked prints exactly as boldly. The caller job — naming which shape goes next and where along the sheet it belongs — is the mural's composition done aloud, and a caller who never touches a sponge has still arranged the whole picture."),

    # ---------------- PE & movement, just 3 again (pe age-3 primary 8 -> 9) ----------------
    A("big-ball-kick-to-wall", "Big Ball Kick to the Wall",
      "One big light ball, one kicker at a time, one wall: walk up, plant your feet, swing your leg — and the wall stops it and sends the next turn back.",
      ["pe-movement"], (3, 3), (3, 12), (10, 15), ["indoor", "outdoor"],
      ["one big light ball (beach-ball sized, soft, slow — the adult has tested its roll)", "a clear wall stretch with a taped target patch at kick height", "a start mat a few steps from the wall (the kicking spot)"],
      False, "Set the lane like a promise: ball tested first — big enough that a swinging foot cannot miss it entirely and light enough that a full three-year-old swing sends it rolling, not flying. The wall stretch is bare and hard-wearing, the target patch taped at the height a rolled ball actually arrives, and the kicking spot marked a distance a small kick can honestly cover: success at three is the ball REACHING the wall, so the wall starts close and only ever moves by the group's own growing legs. Waiting space sits behind the kicking spot, out of the lane entirely.",
      ["Show the whole movement yourself, in teacher time: walk to the ball, stop beside it, plant one foot, swing the other — the ball rolls to the wall, bumps it, and rolls gently back. Say the plain framing: 'Kicking is your foot's turn to play the ball. One kicker at a time, everybody watches, and the wall is the goalie — the ball just has to REACH it.' State the one rule: 'Only the kicker is in the lane. Feet kick the ball — nobody dives, nobody throws.'",
       "Kickers' round begins with the group behind the line and the first kicker walking the lane alone. The walk-up matters: arrive, stop, look at the target, plant, swing. A kick that tops the ball and dribbles it halfway is a kick — the kicker fetches it at a walk, brings it back to the spot, and kicks the rest of the journey, because a ball re-kicked is a turn finished honestly, not a turn failed.",
       "Wall arrivals get their due: when a ball bumps the wall — and the bump is audible, which the group will treat as applause — the kicker calls 'Wall!' and the room answers it. The target patch earns its own call when a ball lands on it: not better than the wall, just a different address on it, said that way every time so reaching stays the achievement and the patch stays a decoration on it.",
       "Fetching is part of the turn, at a walk, always: the kicker collects their ball from the wall and carries it back in two arms to the next kicker, handing over the turn with the ball itself. A lane where the worker fetches is a lane that never has two bodies moving toward each other — the safety is built into the ceremony and the ceremony is built into the game.",
       "Finish with a full-room final: every kicker takes one last kick in order, the wall getting bumpier in the group's ears with practice, and the tell-back at the end counts something true: 'Every leg in this line reached the wall today.' The ball gets parked against the wall it worked against, and legs that have kicked walk out slower and taller than legs that waited — which is why the waiting line rotates fast and fair, called by name, in the open."],
      "The wall comes closer: two steps only between spot and wall, and a bigger ball — a turn built so the newest legs in the room reach the wall on their first swing.",
      "Two target patches, high-ankle and knee height on the wall's stretch: kickers call their patch before they swing, and the room calls whether the ball visited the called address or another — both are celebrated, only one is counted as a call landed.",
      safety="One kicker in the lane, ever — the rule is the activity's whole safety system, and the waiting line sits behind the spot where no swing or rolling ball can reach it. The ball is big, light and slow by design: nothing in this game flies, and a ball kicked at a face height is a ball that was too hard or too small, retired by the adult on the spot. Fetching is walking, kicking is from a standstill beside a still ball — no running kicks at three, because a leg swung at speed by a body still learning balance lands its owner as often as its ball.",
      copy_free=True, no_elimination=True,
      inclusion="Kicking is a leg's job at every height it works: a ball struck by a footplate, a swung lower leg from a standing frame's support, or a strong arm-push from the spot — renamed honestly as that kicker's kick, swung at their call — sends the same ball to the same wall and earns the same 'Wall!' from the room. The caller job, naming each kicker and calling the wall arrivals, runs the whole lane and belongs to whoever holds it by voice or by pointing the name card the adult flips."),

    # ---------------- Quiet focus, just 3 again (quiet-focus age-3 primary 11 -> 12) ----------------
    A("big-zip-up-down-board", "Big Zip Up-and-Down Board",
      "One chunky zip on a sturdy board: grip the big pull, slide it up slow, slide it down slow — a coat's hardest job, practised where no coat is waiting.",
      ["quiet-focus"], (3, 3), (1, 6), (10, 20), ["indoor"],
      ["one zip board (adult-made: a chunky jacket zip sewn or firmly fixed on stiff fabric over board, the pull tab big enough for a whole fist — a ribbon loop through the pull helps)", "a lap or low table to rest the board on"],
      False, "Make or check the board like the tool it is: the zip must run SMOOTHLY — a zip that snags teaches yanking, so work it up and down twenty times yourself first, free its teeth of threads, and retire any zip that catches, because the board's whole lesson is that slow and steady is what works. The pull gets a ribbon loop a whole fist can hold. The fabric sits taut on the board so the zip's path never wrinkles under a pull; a slack path is a snag built in advance.",
      ["Show the board closed and say the plain job: 'Coats have zips. Zips are a two-direction job: up joins the two sides together, down lets them apart. This board is where hands practise, so no coat ever has to wait on a zip again.' Work the zip once yourself, both ways, SLOWLY, letting the group hear the teeth join and part: the zip's sound is its own progress report.",
       "State the one rule: 'Slow pulls only. If it stops, your hand stops — a zip is never forced, because a forced zip is a broken zip.' First pull together: a kid's fist through the ribbon loop, your hand under theirs not pulling, just present, and the zip travels up at the pace the teeth allow. The stop-and-back-off moment gets rehearsed on purpose: meet a snag, stop, back half a tooth, go again — named out loud as the expert move it is.",
       "Up-and-down rounds: each worker takes the board on their lap or the low table and runs the zip its whole journey, up — pause at the top, the two sides one side now — and down, the sides parting like a road opening. The full trip is the unit: nobody rushes to finish, because the quiet in this activity is the sound of a job being done at the speed it asks for.",
       "Two-hand discovery, arriving on its own schedule: workers will find that one hand must hold the board's bottom still while the other pulls — the zip pulls the board otherwise. Name it when it lands: 'One hand holds, one hand works. That is every zip, on every coat, for everybody.' A board that teaches its own two-handedness has taught the dressing skill whole.",
       "Finish with the board zipped up and passed hand to hand for one last look at the joined seam — a straight, closed line made by slow hands. Boards live in the quiet corner after today, available at coat time's hardest moments and calm ones alike: a skill practised in quiet gets used in weather, which is the entire reason it exists."],
      "Half-trips only: the adult starts every zip halfway, workers finish the up or the down; the journey is halved and the expert stop-and-back-off still gets its rehearsal.",
      "A second board joins with its zip running the other way, or a bigger-toothed camping zip: workers must read a new zip's pace before pulling — same rule, new teeth, and the comparison is the lesson repeated with interest.",
      safety="Zips pinch: the rule is in the method — fingers live on the pull and its ribbon, never on the teeth's path, and a pull stops the instant anything (fabric, skin, thread) is in the track. The board is the only zip practised on: nobody practises on a worn coat, theirs or anyone's, where a pinch lands on a body instead of a board. Boards are adult-checked before every session — a detached pull or a tooth out of line retires the board until it is repaired, no exceptions negotiated by enthusiasm.",
      copy_free=True,
      inclusion="The zip works at lap height, table height, or held upright by the adult at exactly the angle its worker directs — the board travels, the skill doesn't change. A pull can be gripped by a fist through the ribbon, pushed with a palm heel along its track on a board laid flat, or directed — 'up... stop... down' — while a partner's hand pulls at the director's pace: the pacing, which is the skill's heart, belongs to the director in full."),
]

COLLECTION = {
    "id": "little-hands-just-three-again",
    "title": "Little Hands, Just Three, Again",
    "glyph": "\U0001F9E4",
    "when_to_use": "The third shelf banded for three-year-olds ONLY — a welcome written in lamplight along a floor path, every kid in the room holding up the same hard-won three fingers, a snowball that outgrows its rollers, a heart's own beat tapped on knees. Three waves of this kind have narrowed the threes' gap by a third without one record a three-year-old is merely tolerated by. Reach for it in a young-threes room, a first month of program, or any group whose oldest kid just turned three.",
    "picks": [
        {"id": "paper-diya-welcome-row", "note": "Two hands carry the lamp; the adult's hand brings the light. The welcome is half built — and the group can SEE it is."},
        {"id": "roll-it-bigger-snowball", "note": "Snow sticks to snow, said once and felt for twenty minutes. The ball outgrowing its crew is a ceremony, not a failure."},
        {"id": "big-tape-roads-car-town", "note": "First the roads, then the driving. Two cars meeting is traffic, handled the town way: one waits, one passes slowly."},
        {"id": "fog-window-finger-drawing", "note": "The one drawing medium with no wrong marks in it — the window keeps nothing, and the fading is the frame."},
        {"id": "big-shadow-grow-shrink", "note": "Directors direct, the shadow obeys: nearer the light, bigger the shadow — two facts, both visible, both theirs."},
        {"id": "sponge-pass-fill-the-pot", "note": "Slow hands keep the water — a rule no adult announced. The sponge taught it, and a team keeps what it discovers."},
        {"id": "show-me-three-fingers", "note": "Every version of three in the room is correct, wobbles copied faithfully. Eighteen different threes is the group portrait."},
        {"id": "after-rain-worm-count", "note": "Counted with eyes, greeted by number, touched by nobody — the path belongs to its residents until the ground dries."},
        {"id": "feel-the-beat-heart-tap", "note": "Fast after marching, slower after resting, tapped on knees both times — a drum every musician carries everywhere."},
        {"id": "big-sponge-stamp-mural", "note": "Dip, press, lift straight: the lifting is the printing. A sideways lift makes the mural's first comet, and it stays."},
        {"id": "big-ball-kick-to-wall", "note": "Reaching the wall is the achievement; the patch is a decoration on it. Fetching at a walk is part of the turn."},
        {"id": "big-zip-up-down-board", "note": "One hand holds, one hand works — every zip on every coat, discovered at a board where no coat is waiting."},
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
