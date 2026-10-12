#!/usr/bin/env python3
"""Wave 20: append the Halloween 2026 pack (40 activities) + Halloween Week collection.

Run once: dedupes by id, writes data/activities.json and data/collections.json.
Run scripts/build.py afterwards.

All original words per PIPELINE.md. Classic public-domain concepts
(dice-draw monsters, paper marigolds, banana ghosts, broomstick relays,
freeze tag variants, inference riddles, glow-stick science, film-canister
rockets, yarn mazes, leaf-pile digs, chant parades) described in our own
words. Near-duplicate screen against the full 415-activity library:
- shadow-tag EXISTS (generic) -> spooky-shadow-tag skipped
- spooky-story-circle EXISTS (no-prep story circle) -> flashlight-story-circle skipped
- pumpkin-roll-race EXISTS (pool-noodle pumpkin roll) -> pumpkin-roll-rally skipped
- two-truths-and-a-lie EXISTS -> costume-two-truths skipped
- bucket-drumming EXISTS -> witches-brew-drum-circle skipped
- leaf-rubbing-gallery EXISTS -> fall-leaf-ghost-rubbings skipped
- balloon-rockets EXISTS (air-pressure) -> ghost-rocket-fizz kept: chemical-reaction
  fizz rockets are a different mechanic and different science
- temperature-melt-race EXISTS (melting) -> glow-stick-temperature-lab kept:
  light-output-vs-temperature experiment, different mechanic
Tags (all already in the validator vocabulary): holiday:halloween,
theme:spooky, season:fall, holiday:dia-de-muertos.
Safety notes are practical only (allergy checks on every food activity,
adult-only sharp-knife work, choking-hazard notes, no shared food/water,
darkness warnings, glow-stick handling) - no medical claims anywhere.
Spookiness stays age-labeled: everything is silly-spooky or milder.

Research folded in (~/workspace/research_notes/activity-ideas-20261011-2240,
round 11, landed 2026-10-11 22:40 PDT):
- Roll-a-Monster Dice Draw -> roll-a-monster-dice-draw (our own words)
- Halloween Inference Riddles -> halloween-inference-riddles (our own words)
- Halloween-week countdown-calendar format -> halloween-countdown-calendar
- Thumbprint Creatures / Dots & Boxes / Fortune-Teller quiet-focus formats
  -> thumbprint-monsters, halloween-dots-and-boxes
- Analog/unplugged demand (DonorsChoose/EdWeek Sept 2026 survey of 2,501
  teachers; Rising Trends search data) -> why_it_works lines on the
  unplugged picks
- Frontiers 2026 rope-skipping / IJRESS brain-break reviews -> why_it_works
  lines on the movement micro-activities
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')

def A(id, name, tagline, cats, ages, group, time, loc, mats, no_prep, setup,
      steps, easier, harder, safety=None, tags=None, copy_free=None,
      no_elimination=None, why_it_works=None, inclusion=None):
    rec = {
        "id": id, "name": name, "tagline": tagline, "categories": cats,
        "age_min": ages[0], "age_max": ages[1],
        "group_min": group[0], "group_max": group[1],
        "time_min": time[0], "time_max": time[1],
        "location": loc,
        "materials": [{"item": m} for m in mats],
        "no_prep": no_prep, "setup": setup, "steps": steps,
        "variations": {"easier": easier, "harder": harder},
        "safety": safety,
    }
    if tags:
        rec["tags"] = tags
    if copy_free is not None:
        rec["copy_free"] = copy_free
    if no_elimination is not None:
        rec["no_elimination"] = no_elimination
    if why_it_works is not None:
        rec["why_it_works"] = why_it_works
    if inclusion is not None:
        rec["inclusion"] = inclusion
    return rec

H = ["holiday:halloween"]
HS = ["holiday:halloween", "theme:spooky"]
HF = ["season:fall", "holiday:halloween"]
HSF = ["season:fall", "holiday:halloween", "theme:spooky"]

PACK = [
# ---------------- crafts (4) ----------------
A("roll-a-monster-dice-draw", "Roll-a-Monster Dice Draw",
  "Roll the dice, draw the parts: every monster comes out gloriously different.",
  ["crafts", "rainy-day"], (5, 12), (2, 30), (15, 25), ["indoor"],
  ["paper", "pencils or crayons", "one dice per pair"],
  False,
  "Draw a 6-column chart on the board: eyes / horns / mouth / arms / pattern / "
  "extra. Fill each column with 6 options (1 = one big eye, 6 = six tiny eyes...).",
  ["Roll the dice six times - once per column - and write down each result.",
   "Draw your monster exactly as the rolls say. No re-rolls: weird is good.",
   "Give it a name and one silly power (shoots glitter, naps standing up).",
   "Monster meet-and-greet: introduce yours to the table in your monster voice."],
  "Choice-only version: pick parts from the chart instead of rolling.",
  "Two dice per kid - roll for each body part twice and pick the better roll.",
  "Dice are small - keep them on tables, not in mouths.",
  HS, copy_free=True, no_elimination=None,
  why_it_works="Pen-and-paper making beats a screen: a Sept 2026 survey of 2,501 "
  "teachers (DonorsChoose/EdWeek) found more hands-on analog work was the "
  "most-cited classroom change this year.",
  inclusion="Monsters can be described aloud instead of drawn; the choice-only "
  "version skips dice entirely."),

A("marigold-cempasuchil-flowers", "Marigold Paper Flowers",
  "Tissue-paper cempasuchil - learning about Dia de los Muertos through making.",
  ["crafts", "seasons"], (6, 14), (2, 30), (20, 35), ["indoor"],
  ["orange and yellow tissue paper", "green pipe cleaners or sticks",
   "scissors", "tape"],
  False,
  "Cut tissue into 6-inch squares, 8 sheets per flower. One pipe cleaner per "
  "flower for the stem.",
  ["Stack 8 tissue squares and fold them back and forth like a fan.",
   "Pinch the middle and twist a pipe cleaner tightly around it.",
   "Round the fan ends with scissors - these become the petals.",
   "Gently pull each tissue layer up toward the center, fluffing into a bloom.",
   "While you work: marigolds (cempasuchil) guide loved ones home on Dia de "
   "los Muertos, Nov 1-2 - a real Mexican holiday of remembrance."],
  "Use 4 sheets instead of 8 and skip rounding the ends.",
  "Make a full garland: tape finished flowers to a long string for the room.",
  "Scissors stay at the table; younger kids get pre-folded fans.",
  ["holiday:dia-de-muertos", "season:fall"],
  inclusion="Respectful learning framing: we study a real holiday of remembrance; "
  "nobody dresses it up as a costume or invents new rituals."),

A("pumpkin-seed-mosaic", "Pumpkin Seed Mosaics",
  "Roasted seeds become jack-o'-lantern mosaics - zero-waste art from pumpkin guts.",
  ["crafts", "seasons"], (4, 12), (2, 30), (20, 40), ["indoor"],
  ["clean dry pumpkin seeds", "cardboard squares", "glue",
   "orange and black paint or markers"],
  False,
  "Rinse and fully dry pumpkin seeds ahead of time (damp seeds won't glue). "
  "Tint half the seeds orange with paint the day before, or leave natural.",
  ["Draw a big pumpkin outline on your cardboard square.",
   "Glue seeds inside the outline, overlapping like scales - orange outside.",
   "Fill the stem with green-tinted or natural seeds.",
   "Add a black-seed jack-o'-lantern face: triangles for eyes, zigzag mouth.",
   "Set flat to dry. Sign the back - gallery wall ready."],
  "Skip the face - a plain seed-filled pumpkin still looks great.",
  "Sort seeds by size first and work in shaded rows, like a real mosaic artist.",
  "Check the seed supply against the class allergy list - seeds are food. "
  "No tasting the craft seeds; painted seeds are not for eating.",
  HF),

A("witch-hat-decorate", "Decorate-a-Witch-Hat",
  "Plain black hats in, runway-ready witch hats out - the costume station classic.",
  ["crafts", "holidays"], (4, 12), (2, 30), (20, 35), ["indoor"],
  ["black paper party hats or cones", "stickers, ribbon, and paper scraps",
   "glue sticks", "markers"],
  False,
  "Set out the decorating supplies in trays - one tray per table keeps the "
  "line moving.",
  ["Claim a hat and try it on - check the fit before you decorate.",
   "Wrap ribbon or paper strips around the base for the hat band.",
   "Add the spooky-cute: paper bats, stars, a buckle cut from foil.",
   "Write your witch name on the inside brim in marker.",
   "Witch hat runway: strut, pose, and introduce your hat's magic power."],
  "Pre-cut the paper shapes so it's stickers-and-glue only.",
  "Engineer a hat that survives the playground: reinforce the cone seam.",
  "Keep small stickers away from mouths for the youngest kids.",
  HS),

# ---------------- stem (4) ----------------
A("ghost-rocket-fizz", "Ghost Rocket Fizz",
  "Film-canister rockets in ghost costumes - chemistry does the launching.",
  ["stem", "outdoor"], (6, 14), (2, 30), (20, 30), ["outdoor"],
  ["film canisters or small snap-lid tubes", "baking soda", "vinegar",
   "tissue paper", "markers", "safety glasses or sunglasses"],
  False,
  "Work outside with a clear launch zone. Draw ghost faces on tissue squares "
  "and tape one loosely around each canister - decoration only, nothing "
  "blocking the lid.",
  ["Put one spoonful of baking soda in the canister.",
   "Pour in vinegar to about one-third full - then snap the lid on FAST.",
   "Set the canister lid-down on the ground and step back 10 feet.",
   "Watch: fizz builds pressure until POP - the ghost launches.",
   "Try it again: more baking soda or more vinegar - which flies higher?"],
  "The teacher does the snap-and-set while kids watch from the line.",
  "Time the launches and graph height vs. spoonfuls of baking soda.",
  "Safety glasses on for the launcher. Everyone behind the line before the "
  "lid snaps - never point a loaded canister at anyone.",
  HS),

A("glow-stick-temperature-lab", "Glow Stick Temperature Lab",
  "Same glow sticks, three cups of water - temperature changes the light.",
  ["stem", "rainy-day"], (7, 14), (2, 30), (15, 25), ["indoor"],
  ["glow sticks (one per group)", "three clear cups",
   "ice water", "room-temperature water", "warm (not hot) water"],
  False,
  "Fill the three cups: ice water, room-temp water, warm tap water. Label "
  "them COLD, ROOM, WARM. Crack each glow stick to activate right before the "
  "test.",
  ["Drop one activated glow stick in each cup at the same time.",
   "Dim the lights and compare: which cup glows brightest right now?",
   "Wait 5 minutes and compare again - did the order change?",
   "Feel the cups: the warm cup's stick fades fastest. Heat speeds the "
   "chemical reaction up - and uses it up faster.",
   "Write the rule in your own words: warmer = brighter but shorter."],
  "Teacher runs the demo up front while kids call out observations.",
  "Add a fourth cup - freezer-cold vs. fridge-cold - and time the fade with "
  "a stopwatch.",
  "Don't cut glow sticks open; the liquid inside stays inside. Cracked or "
  "leaking sticks go straight in the trash - wash hands after handling.",
  HS),

A("spiderweb-weight-bridge", "Spiderweb Weight Bridge",
  "Weave a yarn web, then load it with pennies - how strong is your silk?",
  ["stem", "crafts"], (7, 14), (2, 24), (25, 45), ["indoor"],
  ["yarn or string", "paper plates with the centers cut out",
   "tape", "pennies or washers", "scissors"],
  False,
  "Cut the center out of each paper plate, leaving a 2-inch rim - the web "
  "frame. Tape one end of yarn to the rim.",
  ["Weave yarn across the plate ring: spokes first, then spiral around them. "
   "Tie off the end.",
   "Set your web across two books with the middle hanging free.",
   "Add pennies one at a time to the center of the web. Count as you go.",
   "Record the breaking point - the number of pennies your web held.",
   "Rebuild round two: tighter spiral or double yarn - beat your record."],
  "Weave a simple 6-spoke web and test with crayons instead of pennies.",
  "Real spiders vary silk thickness - test thin yarn vs. thick yarn webs.",
  "Scissors at the table only. Keep yarn below shoulder height.",
  HS),

A("vampire-teeth-acid-test", "Vampire Teeth Acid Test",
  "Eggshell 'fangs' soak overnight - which liquid is toughest on teeth?",
  ["stem", "quiet-focus"], (7, 14), (2, 30), (15, 20), ["indoor"],
  ["eggshell halves (rinsed)", "clear cups", "vinegar", "water",
   "milk (optional third cup)"],
  False,
  "Rinse eggshell halves and label cups: VINEGAR, WATER, (MILK). One shell "
  "half per cup. Set up the day before you want results.",
  ["Drop one eggshell half in each cup - these are our stand-in 'teeth.'",
   "Predict: which liquid will change its shell the most by tomorrow?",
   "Wait 24 hours. Lift each shell: look, feel, and compare.",
   "The vinegar shell turns soft and bubbly - acid wears the shell down. "
   "Water barely changes it.",
   "Connect it: that's why dentists nag about brushing - acid is the enemy."],
  "Teacher sets up the cups; kids observe and vote on predictions.",
  "Test more liquids: juice, soda, soapy water - rank them toughest to gentlest.",
  "Vinegar is food-safe but stings eyes - no splashing, wash hands after. "
  "This is a model, not a mouth: eggshells stand in for enamel.",
  HS),

# ---------------- pe-movement (4) ----------------
A("witch-broomstick-relay", "Witch Broomstick Relay",
  "Ride a pool-noodle broomstick around the cones - cackling encouraged.",
  ["pe-movement", "outdoor"], (5, 12), (4, 32), (15, 25), ["indoor", "outdoor"],
  ["pool noodles (one per team)", "cones or chairs", "witch hats (optional)"],
  False,
  "Set two cones 30 feet apart per team. Hand each team a pool noodle "
  "'broomstick.'",
  ["First rider straddles the noodle like a broomstick - hands on the front.",
   "Ride to the far cone, circle it, and ride back. Noodle stays between "
   "your legs the whole way.",
   "Hand off the broomstick to the next witch in line.",
   "Fallen off? Pick it up, climb back on, keep riding - no penalty.",
   "Winning team takes a victory lap with their best witch cackles."],
  "Shorten the course and let kids walk the noodle instead of running.",
  "Add a spell-casting stop: freeze at the far cone and shout your spell "
  "before riding back.",
  "Clear the course of anything trippable. Noodles are for riding, not dueling.",
  HS, copy_free=True, no_elimination=True,
  why_it_works="Short active bursts reset focus - reviews of classroom brain-break "
  "research (IJRESS) find under-10-minute movement breaks counter cognitive fatigue.",
  inclusion="Riders set their own speed; walking the course counts fully."),

A("ghost-freeze-tag", "Ghost Freeze Tag",
  "Tagged? Freeze like a ghost. A teammate's 'BOO!' sets you free.",
  ["pe-movement", "outdoor"], (4, 12), (6, 32), (10, 20), ["indoor", "outdoor"],
  [],
  True,
  "Pick 2 ghosts (taggers). Everyone else haunts the play area. No equipment "
  "needed.",
  ["Ghosts chase; a touch turns you into a frozen statue - arms up, spooky face.",
   "Unfreeze a statue by floating past and whispering 'BOO!' - then both "
   "float away.",
   "A frozen player can't be tagged again until they're freed.",
   "Rotate ghosts every 3 minutes so everyone gets to haunt.",
   "Last round: EVERYONE is a ghost and the teacher is the only haunter."],
  "One ghost only, and a smaller play area.",
  "Frozen ghosts must freeze mid-pose from a category: animals, monsters, "
  "dancers.",
  "Tag is touch-only, never push. Play away from walls and furniture.",
  HS, copy_free=True, no_elimination=True,
  why_it_works="Freeze-play mixes sprinting with stillness - short movement breaks "
  "in this format are what brain-break reviews (IJRESS) link to recharged attention.",
  inclusion="A seated 'home base' role: frozen players can also be freed by a "
  "buddy calling their name from base."),

A("monster-movement-dice", "Monster Movement Dice",
  "Roll the die, move like the monster: zombie shuffle, bat flap, ghost glide.",
  ["pe-movement", "icebreakers"], (4, 10), (4, 30), (5, 10), ["indoor", "outdoor"],
  ["one big dice", "monster-move chart (drawn on the board)"],
  True,
  "Draw the chart on the board: 1 = zombie shuffle, 2 = bat flap, 3 = ghost "
  "glide, 4 = witch swoop, 5 = mummy march, 6 = monster's choice.",
  ["Everyone stands in a circle with room to move.",
   "Roll the big dice - the whole group moves like that monster for 30 seconds.",
   "Roll again: new monster, new movement. Keep the energy up.",
   "Monster's choice: the roller picks any move and everyone copies.",
   "Cool-down roll: whatever you roll, do it in slow motion."],
  "Roll once and move like that monster for the whole round.",
  "Kids invent moves 7-12 on a second chart for two-dice chaos.",
  "Clear a wide circle first - flapping bats need elbow room.",
  H, copy_free=True, no_elimination=True),

A("zombie-walk-relay", "Zombie Walk Relay",
  "Each leg is a different monster walk - zombie shuffle to ghost glide.",
  ["pe-movement", "team-community"], (6, 14), (8, 32), (15, 25), ["indoor", "outdoor"],
  ["cones", "monster-walk cards (zombie, witch, bat, ghost)"],
  False,
  "Mark a there-and-back lane with cones. Deal each team four monster-walk "
  "cards in order.",
  ["Leg 1: the zombie shuffles to the cone and back - arms out, groaning.",
   "Leg 2: the witch swoops - bent over, 'flying' low and fast.",
   "Leg 3: the bat flaps - arms as wings, quick little steps.",
   "Leg 4: the ghost glides - slow, silent, arms floating.",
   "Tag the next monster with a high-five. Best monster walk wins the "
   "round - the team votes."],
  "Two legs instead of four; walking pace for every monster.",
  "Add a fifth mystery leg: the team invents a brand-new monster walk.",
  "Monster walks stay in the lane - no wandering zombies near other teams.",
  HS, copy_free=True, no_elimination=True),

# ---------------- quiet-focus (4) ----------------
A("halloween-inference-riddles", "Halloween Inference Riddles",
  "Read the riddle, cite your clue: inference practice in a witch hat.",
  ["quiet-focus", "icebreakers"], (6, 12), (4, 35), (10, 15), ["indoor"],
  [],
  True,
  "None - read from this bank (or make your own): "
  "1) 'I have a face but no eyes, I glow but I'm not a lamp' (jack-o'-lantern) "
  "2) 'I fly at night but I'm not a bird, I sleep upside down' (bat) "
  "3) 'I'm orange, I wear no costume, kids paint my grin' (pumpkin) "
  "4) 'I say boo but I'm not scary, I'm made of an old sheet' (ghost costume).",
  ["Read a riddle aloud - slowly, twice.",
   "Hands up when you think you know it - but answers need a clue citation: "
   "'I know because it says...'",
   "The group decides: did the clue really prove it?",
   "Kids take turns being the riddle-reader for the next round.",
   "Lightning round: everyone writes one riddle of their own for tomorrow."],
  "Give the answer bank up front - kids match riddles to answers.",
  "No answer bank, and riddles must cite TWO clues instead of one.",
  "No materials, no hazards - just voices. Keep the volume neighbor-friendly "
  "during the lightning round.",
  H, copy_free=True, no_elimination=None,
  why_it_works="Inferring from clues is reading comprehension in disguise - and "
  "it's fully unplugged, the direction the Sept 2026 DonorsChoose/EdWeek "
  "teacher survey points.",
  inclusion="Answers can be choral; every riddle is read twice; picture clues "
  "on the board support multilingual learners."),

A("thumbprint-monsters", "Thumbprint Monsters",
  "One ink thumbprint becomes a monster: add eyes, horns, and attitude.",
  ["quiet-focus", "crafts"], (4, 12), (2, 30), (15, 25), ["indoor"],
  ["washable ink pads", "paper", "fine markers", "wet wipes"],
  False,
  "Set out ink pads and paper. Keep wet wipes in the middle of every table.",
  ["Press your thumb on the ink pad, then stamp it on the paper - one print "
   "per monster.",
   "Turn the print: which way looks most like a monster body?",
   "Add the features with fine marker: eyes, horns, fangs, arms, spots.",
   "Give it a name and write one sentence about what it does all day.",
   "Gallery walk: line them up and vote - spookiest, silliest, most likely "
   "to hug."],
  "Use finger-paint dots instead of ink pads for the youngest kids.",
  "Thumbprint monster comic: three prints, three panels, one tiny story.",
  "Washable ink only. Wipe hands before touching anything else.",
  HS, no_elimination=None,
  why_it_works="Low-stakes making with real materials: a Sept 2026 survey of "
  "2,501 teachers (DonorsChoose/EdWeek) found more hands-on analog work was "
  "the most-cited classroom change this year.",
  inclusion="Stamped prints need no drawing skill to start - the monster "
  "emerges from the print, not from a blank page."),

A("halloween-dots-and-boxes", "Halloween Dots & Boxes",
  "The pencil-and-paper classic, Halloween edition: claim boxes, draw the face.",
  ["quiet-focus", "rainy-day"], (6, 14), (2, 30), (10, 20), ["indoor"],
  ["paper", "pencils"],
  True,
  "None - each pair draws their own 5x5 dot grid. No printing needed.",
  ["Draw a 5x5 grid of dots on your paper.",
   "Take turns drawing one line between two dots - horizontal or vertical.",
   "Complete a box and it's yours: initial it AND draw a tiny pumpkin face "
   "inside.",
   "Most boxes wins. Ties broken by silliest pumpkin face - group vote.",
   "Rematch round: 6x6 grid, and every box needs a different face."],
  "4x4 grid, and the teacher plays alongside the youngest kids.",
  "Mystery grid: play on a 7x7 and track your score as a running total.",
  "Pencils stay on paper - no sword fights.",
  H, copy_free=True, no_elimination=True),

A("spiderweb-sketch-study", "Spiderweb Sketch Study",
  "Find a real web, sketch it slow, label the spokes: quiet science.",
  ["quiet-focus", "stem"], (7, 14), (2, 30), (15, 30), ["indoor", "outdoor"],
  ["paper", "pencils", "clipboards (optional)", "magnifiers (optional)"],
  False,
  "Scout the area ahead of time for real webs - fence corners, playground "
  "equipment, bushes. Morning dew makes them easy to spot.",
  ["Find a web and settle in - no touching, just looking.",
   "Sketch what you see: the anchor lines, the spokes, the spiral. Slow "
   "is the whole point.",
   "Label the parts: spokes (the straight lines), spiral (the sticky circle), "
   "anchor (where it ties off).",
   "Watch for 5 quiet minutes: does the spider move? Does anything land?",
   "Back inside: compare sketches - no two real webs match."],
  "Sketch from a printed photo of a web at the table.",
  "Measure your web's diameter and count the spokes - real field data.",
  "Look with eyes and magnifiers only - never poke a web or its spider.",
  HSF, copy_free=None,
  why_it_works="Slow looking is attention training: close observation and "
  "sketching give selective attention a real workout.",
  inclusion="Photo-based version works for anyone who can't get to the webs; "
  "sketching needs no art skill - labels count as success."),

# ---------------- holidays: treats & cooking (5) ----------------
A("ghost-banana-pops", "Ghost Banana Pops",
  "Frozen banana ghosts on sticks - the two-ingredient Halloween treat.",
  ["holidays", "crafts"], (4, 12), (2, 30), (15, 20), ["indoor"],
  ["bananas", "craft sticks or popsicle sticks", "mini chocolate chips",
   "plastic table knives"],
  False,
  "Peel bananas and cut each in half crosswise. Set out chips in small bowls. "
  "Freeze the finished ghosts at least 2 hours before serving.",
  ["Push a craft stick into the cut end of each banana half.",
   "Press two mini chocolate chips in for eyes - and one for the mouth.",
   "Stand the ghosts upright in a cup and freeze until solid.",
   "Serve straight from the freezer: cold, sweet, and not remotely scary."],
  "Skip the sticks - banana ghost bites in a cup with a spoon.",
  "Dip in yogurt before freezing, then add the chip faces.",
  "Check the class allergy list first (chocolate contains milk/soy). Adults "
  "handle any sharp knives; kids use plastic table knives on the soft banana. "
  "Treats are made to take home or eat at the party - not during craft time.",
  H, inclusion="Dairy-free chips swap in with no recipe change; kids who can't "
  "have banana make ghost cups with the same faces."),

A("monster-mix-bags", "Monster Mix Bags",
  "Scoop, mix, bag: every kid builds their own Halloween trail mix.",
  ["holidays", "team-community"], (4, 14), (2, 30), (15, 25), ["indoor"],
  ["pretzels", "cereal squares", "raisins", "candy corn",
   "small paper bags", "scoops or cups", "markers"],
  False,
  "Pour each ingredient into its own bowl with a scoop. Set out one bag per "
  "kid plus a marker for decorating.",
  ["Decorate your bag first: monster face, your name, the works.",
   "Scoop one scoop of each ingredient into your bag - your mix, your rules.",
   "Add the candy corn last - it's the treasure on top.",
   "Seal the bag with a fold and a sticker. Shake it like a maraca.",
   "Monster mix taste test: trade one handful with a neighbor and compare."],
  "Teacher pre-portions the ingredients - kids just decorate and shake.",
  "Write the 'recipe' on the bag: ingredient amounts as a real recipe card.",
  "Check the class allergy list BEFORE buying anything - nuts, gluten, and "
  "dairy are all common in trail mix. Keep ingredient labels out so kids can "
  "read them. No double-dipping scoops.",
  H, inclusion="Allergy-safe kids get the same job with safe ingredients - "
  "nobody sits out the assembly line."),

A("candy-apple-slices", "Candy Apple Slices",
  "All the caramel-apple joy, none of the whole-apple wrestling: slice bar.",
  ["holidays", "seasons"], (5, 14), (2, 30), (20, 30), ["indoor"],
  ["apples", "caramel dip", "toppings: mini chips, sprinkles, crushed pretzels",
   "paper plates", "popsicle sticks (optional)"],
  False,
  "An adult slices the apples into thick wedges just before serving so they "
  "stay crisp. Set toppings in bowls with spoons.",
  ["Skewer a slice on a popsicle stick - instant handle.",
   "Dip or drizzle with caramel - thin coat sticks best.",
   "Roll the caramel side through your pick of toppings.",
   "Stand slices upright on a plate: a whole candy-apple garden.",
   "Vote: which topping combo wins the class taste test?"],
  "Skip the sticks - apple slices with caramel for dipping, fork-style.",
  "Blind taste test: three apple varieties, sliced - graph the class favorite.",
  "Only an adult uses a sharp knife - apples are hard and round. Check the "
  "allergy list (milk in caramel, gluten in pretzels). Slices are eaten at "
  "the party, not saved.",
  HF, inclusion="Topping bowls labeled; kids with dairy/gluten limits build "
  "from the safe bowls - same bar, same fun."),

A("witches-brew-punch", "Witches' Brew Punch",
  "No-cook punch mixing: the class brews a cauldron of something delicious.",
  ["holidays", "team-community"], (4, 14), (4, 30), (15, 20), ["indoor"],
  ["apple cider or juice", "ginger ale", "orange sherbet",
   "large punch bowl or pot", "ladle and cups", "gummy worms"],
  False,
  "Chill everything ahead of time. Set the 'cauldron' (punch bowl) where "
  "everyone can reach with the ladle.",
  ["Pour the cider into the cauldron - two big glugs per kid, taking turns.",
   "Add ginger ale: pour it down the side so it stays fizzy.",
   "Scoop in sherbet - it melts into spooky green-orange swirls.",
   "Stir three times clockwise while everyone chants the magic words.",
   "Ladle into cups, drop in one gummy worm each, and toast the brew."],
  "Teacher mixes; kids do the chanting and the gummy-worm drop.",
  "Potion lab: small cups, three juices, kids invent and name their own brew.",
  "Check the allergy list (milk in sherbet). One ladle, one server - no "
  "hands in the brew, no double-dipping cups.",
  HS, inclusion="Sherbet-free version brews alongside with juice + ginger ale "
  "only - same cauldron ritual."),

A("halloween-countdown-calendar", "Halloween Countdown Calendar",
  "Thirteen doors, thirteen mini-activities: the class counts down to the 31st.",
  ["holidays", "quiet-focus"], (5, 14), (4, 35), (20, 30), ["indoor"],
  ["large paper or poster board", "markers", "sticky notes", "tape"],
  False,
  "Draw a 13-door grid on the poster board (or tape up 13 folded paper "
  "'doors'). Number them 13 down to 1.",
  ["Brainstorm as a class: 13 tiny Halloween activities that fit in 10 "
   "minutes - a riddle, a drawing, a chant, a stretch.",
   "Write one activity per sticky note and hide it behind each door.",
   "Every day from Oct 19 to Oct 31, open the next door together.",
   "Do the mini-activity on the spot - the calendar IS the plan.",
   "Door 1 (Oct 31): the class votes on the grand finale activity."],
  "Teacher pre-fills the doors; the class just opens and does.",
  "Each table designs its own 13-day calendar for a different theme.",
  "Sticky notes only - no cutting doors for little kids; lift the flap.",
  HF, copy_free=True,
  inclusion="Every door's activity has a seated version; the class picks "
  "activities everyone can do."),

# ---------------- icebreakers (3) ----------------
A("monster-name-alliteration-circle", "Monster Name Alliteration",
  "'Marvelous Mummy Maya' - alliterative monster names around the circle.",
  ["icebreakers", "holidays"], (5, 12), (4, 35), (10, 15), ["indoor"],
  [],
  True,
  "None - just a circle and imaginations.",
  ["Go around the circle: each kid invents an alliterative monster name - "
   "'Jolly Jack-o'-lantern Jamal,' 'Silly Spider Sofia.'",
   "Say it with a monster move - a stomp, a flap, a wiggle.",
   "The whole circle repeats each name back WITH the move.",
   "Round two: string them into a monster roll-call chant, faster each time.",
   "Finale: the class votes for the most marvelous monster name."],
  "Kids can pick a monster name instead of using their own name.",
  "Write the names on the board as they go - read the roll call tomorrow.",
  "Keep moves in your own space - no touching other monsters.",
  H, copy_free=True, no_elimination=True,
  inclusion="Passing is always fine - and anyone can borrow a monster name "
  "instead of their own."),

A("costume-guess-who", "Costume Guess Who",
  "Twenty questions, one costume: can the class guess what you are?",
  ["icebreakers", "holidays"], (6, 14), (4, 35), (10, 20), ["indoor"],
  [],
  True,
  "None. Kids with costumes wear them; kids without describe an imaginary one.",
  ["One volunteer stands up front - costume on, or imaginary costume described.",
   "The class asks yes-or-no questions only: 'Are you an animal?' 'Do you "
   "fly?'",
   "The volunteer answers truthfully - yes, no, or 'sort of.'",
   "Twenty questions max: then everyone shouts their guess together.",
   "New volunteer, new costume. Keep a tally of stumpers vs. solvers."],
  "Ten questions max, and the teacher helps phrase the first few.",
  "Mystery guest round: the teacher describes a staff member's costume.",
  "Imaginary costumes count fully - nobody needs a real costume to play.",
  HS, copy_free=True, no_elimination=True,
  inclusion="Kids without costumes describe an imaginary one - imagination "
  "counts the same as fabric."),

A("halloween-this-or-that", "Halloween This-or-That",
  "Candy corn: love it or leave it? Stand on your side - then defend it.",
  ["icebreakers", "pe-movement"], (5, 14), (4, 40), (5, 10), ["indoor", "outdoor"],
  [],
  True,
  "None - just room to stand on two sides.",
  ["Call out a Halloween either-or: 'Candy corn: love it or leave it?' "
   "'Scary movies or funny costumes?'",
   "Kids move to the LOVE IT side or the LEAVE IT side - no middle.",
   "Each side picks a spokesperson for a 10-second defense.",
   "Switch sides if you got convinced - movers get a cheer.",
   "Rapid round: five quick ones, no defenses, just move."],
  "Kids point instead of moving - whole game from their seats.",
  "Kids write the next five questions; the teacher just reads them.",
  "Walking feet between sides - no charging the other team.",
  H, copy_free=True, no_elimination=True),

# ---------------- music-rhythm (3) ----------------
A("monster-stomp-rhythms", "Monster Stomp Rhythms",
  "Stomp-clap patterns for every monster: learn it, layer it, perform it.",
  ["music-rhythm", "pe-movement"], (5, 14), (4, 35), (10, 20), ["indoor", "outdoor"],
  [],
  True,
  "None - bodies are the instruments.",
  ["Teach the zombie pattern: STOMP-stomp-clap, STOMP-stomp-clap.",
   "Add the witch pattern: clap-clap-STOMP-stomp - half the group takes each.",
   "Layer them: zombies and witches perform at the same time. Listen for "
   "the groove.",
   "Monster solo round: one kid invents a 4-beat pattern, everyone copies.",
   "Finale: the class monster orchestra - every pattern at once, big finish."],
  "One pattern only, seated, hands on knees for the stomp.",
  "Compose a full monster symphony: verse, chorus, and a spooky bridge.",
  "Stomp on the floor, not on feet. Keep the volume neighbor-friendly.",
  HS, copy_free=True, no_elimination=True,
  why_it_works="Rhythm plus movement in one: patterned stomping gives the "
  "wiggles a job, in the under-10-minute format brain-break research (IJRESS) "
  "ties to restored focus.",
  inclusion="Every pattern has a seated version - stomps become knee pats."),

A("trick-or-treat-chant-parade", "Trick-or-Treat Chant Parade",
  "A marching chant for the big night: rhythm, rhyme, and doorbell timing.",
  ["music-rhythm", "outdoor"], (4, 12), (6, 40), (10, 20), ["indoor", "outdoor"],
  ["simple rhythm instruments (shakers, sticks) - optional"],
  True,
  "None required - voices and feet carry it.",
  ["Teach the chant, call-and-response style: 'Trick or treat! (Trick or "
   "treat!) Smell my feet! (Smell my feet!)'",
   "Add the march: step-clap-step-clap under the words.",
   "Layer instruments if you have them: shakers on the beat, sticks on the "
   "off-beat.",
   "Parade formation: march the hallway or playground chanting in time.",
   "Grand finale: chant it at double speed, then freeze on the last word."],
  "Chant seated in a circle - marching optional.",
  "The class writes verse two: new rhymes for their own neighborhood.",
  "Marching stays in line - no breaking formation near stairs or doors.",
  H, copy_free=True, no_elimination=True),

A("haunted-house-soundtrack", "Haunted House Soundtrack",
  "Compose the soundscape for a haunted tour: creaks, whispers, and one big scare.",
  ["music-rhythm", "team-community"], (7, 14), (4, 30), (25, 45), ["indoor"],
  ["classroom instruments or found sounds", "paper for storyboarding"],
  False,
  "Gather instruments and found-sound makers: rice in a bottle (rain), "
  "crumpled paper (fire), a ruler on a desk edge (boing).",
  ["Storyboard a 2-minute haunted house tour: the creaky gate, the dark "
   "hallway, the surprise room.",
   "Assign sounds: each group scores one scene with instruments and voices.",
   "Rehearse the order - scenes must flow without talking in between.",
   "Perform it for another class: they walk the 'tour' (a taped path) while "
   "you play.",
   "Audience rates each scene: spooky-fun or needs-more-creak? Revise once."],
  "Score one scene instead of three; teacher narrates the tour.",
  "Record the soundtrack and play it over the real haunted hallway build.",
  "Found sounds stay gentle - no sudden screams near sensitive ears. Agree "
  "on the scare level first.",
  HS, inclusion="Every role has a quiet version - whisperers and shakers "
  "matter as much as drummers."),

# ---------------- team-community (3) ----------------
A("haunted-hallway-build", "Haunted Hallway Build",
  "Teams transform one hallway into a silly-spooky walkthrough - designed by kids.",
  ["team-community", "crafts"], (6, 14), (8, 40), (40, 60), ["indoor"],
  ["black paper or tablecloths", "tape", "flashlights or string lights",
   "cardboard boxes", "craft supplies"],
  False,
  "Get permission for the hallway first. Assign each team one 'scare station' "
  "along the route, with a clear entrance and exit.",
  ["Teams blueprint their station: silly scare, secret passage, marked exit - "
   "nothing actually scary.",
   "Build it: black-paper walls, cardboard tunnels, flashlight spotlights.",
   "Safety walk: every builder walks the whole route checking for trip "
   "hazards and dead ends.",
   "Open the hallway: other classes tour in small groups with a guide.",
   "Deconstruct together - everything sorted for reuse or recycling."],
  "One station per team in the classroom instead of a full hallway.",
  "Add a storyteller guide who narrates the tour with a script.",
  "Nothing blocks fire exits or doors - ever. Tape, never nails. An adult "
  "checks every station before tours open.",
  HS, inclusion="Every station has a lights-on version; tour guides ask each "
  "group's scare comfort level first."),

A("costume-swap-shop", "Costume Swap Shop",
  "Outgrown costumes find new kids: the community swap, run like a real shop.",
  ["team-community", "holidays"], (4, 14), (4, 35), (30, 45), ["indoor"],
  ["tables", "hangers or bins", "paper tags and markers", "mirror (optional)"],
  False,
  "A week ahead: invite families to donate clean, outgrown costumes. Sort "
  "donations by size on tables.",
  ["Tag every costume with its size and a one-line description.",
   "Set up shop zones: trying-on corner, mirror station, checkout table.",
   "Shoppers 'buy' with kindness tokens - everyone gets the same number.",
   "Fitting-room helpers give honest, kind opinions.",
   "Leftovers get bagged for next year or donated onward - nothing wasted."],
  "Classroom-only swap: bring one, take one, no tokens.",
  "Add a repair station: simple fixes (seams, buttons) before costumes go out.",
  "All costumes washed before the swap. Private trying-on space for kids who "
  "want it.",
  H, copy_free=True),

A("kindness-pumpkins", "Kindness Pumpkins",
  "Paint kindness pumpkins for neighbors and staff - trick-or-treat in reverse.",
  ["team-community", "crafts"], (4, 14), (2, 30), (20, 35), ["indoor"],
  ["mini pumpkins (one per recipient)", "acrylic paint pens", "newspaper"],
  False,
  "Cover tables with newspaper. Decide together who gets the pumpkins: "
  "neighbors, custodians, the front office.",
  ["Paint each pumpkin with a kind message or a cheerful face - no scary "
   "faces on these.",
   "Add the giver's first name on the bottom.",
   "Plan the delivery route: pairs, with an adult, during the day.",
   "Deliver with the message: 'Thanks for being part of our neighborhood.'",
   "Back in class: share one reaction story each."],
  "Paint paper pumpkins instead - same messages, zero cost.",
  "Attach a handwritten thank-you note to every pumpkin.",
  "Paint pens, not sharp carving tools - no knives at all. Wash hands after "
  "painting; pumpkins are gifts, not snacks.",
  HF),

# ---------------- rainy-day (3) ----------------
A("pumpkin-bowling", "Pumpkin Bowling",
  "Mini pumpkins vs. bottle pins: the indoor bowling alley builds itself.",
  ["rainy-day", "pe-movement"], (4, 12), (2, 30), (15, 25), ["indoor"],
  ["small round pumpkins or gourds", "empty plastic bottles (10)",
   "water or sand to weight bottles", "tape for the lane"],
  False,
  "Fill bottles one-third with water and cap them tight - these are the "
  "pins. Tape a lane on the floor, pins in a triangle at the end.",
  ["Set the pins: 10 in a triangle, just like real bowling.",
   "Roll (never throw) your pumpkin down the lane - two rolls per turn.",
   "Score it: one point per pin, two turns per frame, five frames.",
   "Reset crew: knocked pins get stood back up by the next bowler.",
   "Championship round: winners bowl left-handed. Or blindfolded. (Not "
   "really blindfolded.)"],
  "Bowl sitting down, shorter lane, bottles unweighted.",
  "Design trick lanes: a curve of tape, a ramp made of books.",
  "Roll, don't throw - pumpkins stay on the floor. Mop up bottle leaks fast "
  "so nobody slips.",
  H, no_elimination=True),

A("spiderweb-yarn-maze", "Spiderweb Yarn Maze",
  "Crawl the yarn maze without touching a strand: the quietest challenge indoors.",
  ["rainy-day", "team-community"], (5, 14), (4, 30), (20, 35), ["indoor"],
  ["balls of yarn or string", "tape", "small prizes or tokens (optional)"],
  False,
  "Pick a hallway or a big room. Tape yarn ends to walls, chairs, and door "
  "frames - crisscross at different heights. Leave one clear path per kid.",
  ["Study the maze first: where's your route? Plan it before you move.",
   "Crawl, duck, and step through - touching a strand means back to start.",
   "Spotters watch and call 'strand!' - honest spotting keeps it fair.",
   "Everyone who finishes gets a token - no racing, it's a challenge.",
   "Rebuild round: the finishers design a harder maze for the next group."],
  "High strands only - duck under, no crawling needed.",
  "Timed runs for the brave: fastest clean run wins.",
  "Yarn stays below shoulder height and off necks - step over or duck under, "
  "never around. Clear path to the door stays open.",
  HS, no_elimination=True),

A("haunted-lantern-tour", "Haunted Lantern Tour",
  "Lights low, lanterns up: a guided tour of the room's 'haunted' corners.",
  ["rainy-day", "quiet-focus"], (6, 14), (4, 30), (15, 25), ["indoor"],
  ["flashlights or paper lanterns", "sticky notes"],
  False,
  "Before the tour, kids hide sticky-note 'haunts' around the room: a "
  "creaky corner, a mysterious stain, a humming vent.",
  ["Dim the lights - lanterns on. Warn the group first: lights going low.",
   "The guide leads the tour, stopping at each sticky-note haunt.",
   "At each stop, the hider tells the haunt's silly backstory - one minute max.",
   "Tourists rate each haunt: spooky-fun or needs-more-story?",
   "Lights up. Vote for the best backstory - the winner guides tomorrow."],
  "Lights stay on; the 'tour' is a walk-and-tell instead.",
  "Tour the whole school after hours (with permission): the ultimate edition.",
  "Warn before dimming - anyone who wants light keeps a buddy lantern. "
  "Walk, don't run, in low light; nothing blocking the path.",
  HS, inclusion="The lights-on version runs first for anyone who prefers it; "
  "passing on any stop is always fine."),

# ---------------- outdoor (4) ----------------
A("pumpkin-patch-scavenger-hunt", "Pumpkin Patch Scavenger Hunt",
  "Something orange, something round like the moon, one real spider web: go.",
  ["outdoor", "seasons"], (4, 12), (4, 30), (20, 30), ["outdoor"],
  ["scavenger cards (one per pair)", "pencils", "bags for finds"],
  False,
  "Write the hunt list on cards: something orange, something round like the "
  "moon, a real spider web (look, don't touch), a leaf bigger than your hand, "
  "something that crunches, the smallest pumpkin you can find.",
  ["Pairs get a card, a pencil, and a bag - and the boundaries.",
   "Find each item: check it off, or collect it if it's loose and allowed.",
   "The spider web is look-only - sketch it instead of taking it.",
   "Back at base: pairs show their finds and tell the story of the hardest one.",
   "Bonus round: who found the funniest-shaped leaf? Group vote."],
  "Picture cards instead of word cards for the youngest hunters.",
  "Make it a photo hunt: one photo per find, compiled into a class slideshow.",
  "Set clear boundaries before anyone moves. Look-don't-touch for webs, "
  "mushrooms, and anything unknown.",
  HF),

A("leaf-pile-monster-dig", "Leaf Pile Monster Dig",
  "Bury treasure in the leaf pile, dig like a monster: the fall sensory classic.",
  ["outdoor", "seasons"], (3, 10), (2, 25), (20, 35), ["outdoor"],
  ["a big leaf pile", "small treasures (painted rocks, plastic bugs)",
   "buckets", "gloves (optional)"],
  False,
  "Rake a big leaf pile (or visit the park's). Hide 20-30 small treasures "
  "inside while kids look away.",
  ["Monster hands on: dig, toss, and burrow through the leaves.",
   "Found treasure goes in your bucket - count as you go.",
   "No guarding: if you see someone else's treasure spot, digging there is "
   "fair game.",
   "Re-hide round: kids bury the treasures for the next group.",
   "Final jump: everyone leaps in together for the group photo."],
  "Shallow pile, treasures half-buried and visible.",
  "Treasure map round: draw a map of where you hid yours, trade maps.",
  "Check the pile for sticks and sharp bits before digging starts. Gloves "
  "for sensitive hands; no throwing leaves at faces.",
  HF),

A("ghost-balloon-stomp", "Ghost Balloon Stomp",
  "Ghost faces on ankles: stomp others' ghosts while guarding your own.",
  ["outdoor", "pe-movement"], (5, 12), (6, 30), (10, 20), ["outdoor"],
  ["balloons (2 per kid)", "string", "markers"],
  False,
  "Draw ghost faces on inflated balloons. Tie one to each kid's ankle with "
  "a foot of string - two per kid for a second life.",
  ["Spread out - stomping needs space.",
   "On GO: try to pop others' ankle ghosts by stomping them.",
   "Guard your own: hop, dodge, hide behind friends.",
   "Popped both? Grab a 'ghost buddy' role - you call out incoming stompers.",
   "Last ghost floating wins the round. New balloons, new round."],
  "One balloon each, and stomping is walking-speed only.",
  "Team version: protect your team's ghosts, hunt the other team's.",
  "Pop means pieces: keep balloons away from mouths, and pick up EVERY "
  "popped piece right away - balloon pieces are a choking hazard.",
  HS),

A("graveyard-number-dash", "Graveyard Number Dash",
  "Paper tombstones, called-out math: dash to the right answer.",
  ["outdoor", "stem"], (6, 12), (6, 32), (15, 25), ["outdoor"],
  ["paper tombstones (numbered 1-20)", "tape or stakes", "chalk"],
  False,
  "Number paper tombstones 1-20 and stake them around the field, numbers "
  "facing in. Mark a start line with chalk.",
  ["Everyone lines up at the start line - tombstones all around.",
   "The caller shouts a math problem: '7 + 5!'",
   "Dash to the tombstone with the answer and tap it - first tap wins "
   "the point.",
   "Wrong tombstone? Back to the line, no point - but no elimination.",
   "Caller rotates every 5 problems so everyone gets to call."],
  "Tombstones 1-10 only, and walk-dash instead of run-dash.",
  "Two-step problems: 'double 6, minus 2' - dash to 10.",
  "Dash in your own lane - no cutting across other runners. Tombstones "
  "staked flat so nobody trips.",
  HS, no_elimination=True),

# ---------------- seasons (3) ----------------
A("harvest-moon-journal", "Harvest Moon Journal",
  "Watch the October moon change night by night: a real sky journal.",
  ["seasons", "quiet-focus"], (7, 14), (2, 30), (10, 15), ["indoor", "outdoor"],
  ["paper", "pencils", "moon-phase chart (drawn on the board)"],
  False,
  "Draw the 8 moon phases on the board as reference. Each kid gets a journal "
  "page: one circle per night for two weeks.",
  ["Each night (or each class day), sketch the moon's shape in the next circle.",
   "Note the date and one word about the sky: clear, cloudy, hiding.",
   "After a week, line up your circles: can you see the pattern growing?",
   "Compare with the board chart: which phase are we in today?",
   "Harvest moon night: the class watches together and sketches the big one."],
  "Track just 5 nights instead of 14.",
  "Predict the next full moon's date from your journal - then check.",
  "Moon-watching happens with families at home; in class, sketch from "
  "memory or photos. Never stare at the sun looking for the moon.",
  HF, copy_free=True),

A("pumpkin-life-cycle-wheel", "Pumpkin Life Cycle Wheel",
  "Spin the paper-plate wheel: seed, sprout, vine, flower, pumpkin.",
  ["seasons", "stem"], (5, 12), (2, 30), (20, 35), ["indoor"],
  ["paper plates (2 per kid)", "brass fasteners", "crayons or markers",
   "scissors"],
  False,
  "Cut a wedge window out of the top plate. Kids will draw the 5 stages "
  "around the bottom plate.",
  ["Draw the life cycle around the bottom plate: seed, sprout, vine, "
   "flower, green pumpkin, orange pumpkin.",
   "Label each stage in your own words.",
   "Fasten the plates together in the center - spin to reveal each stage "
   "through the window.",
   "Quiz a partner: spin to a random stage, name what comes next.",
   "Hang the wheels up: the whole class life cycle, spinning."],
  "Three stages instead of five: seed, vine, pumpkin.",
  "Add the real timeline: how many days does each stage take?",
  "Brass fasteners are pointy - teacher pokes the center holes.",
  HF),

A("acorn-cap-witches", "Acorn Cap Witches",
  "Acorn caps, paint, and pipe cleaners: the tiniest witches in the Vault.",
  ["seasons", "crafts"], (4, 10), (2, 25), (20, 30), ["indoor"],
  ["acorn caps", "small wooden beads or air-dry clay", "paint pens",
   "black paper triangles", "glue"],
  False,
  "Collect acorn caps ahead of time (or buy craft ones). Set out beads for "
  "heads and paper triangles for hats.",
  ["Glue a bead into an acorn cap - the cap becomes the witch's dress.",
   "Paint a tiny face on the bead: eyes, smile, maybe a wart.",
   "Glue on the black paper triangle hat - every witch needs a hat.",
   "Add a pipe-cleaner broomstick if you're feeling fancy.",
   "Line up the coven: a whole shelf of tiny witches, none taller than "
   "your thumb."],
  "Skip the broomstick; hat and face is plenty.",
  "Build the whole scene: a matchbox house for your witch to haunt.",
  "Acorn caps are small - keep them out of mouths for the youngest kids.",
  HF),
]

HALLOWEEN_WEEK = {
    "id": "halloween-week",
    "title": "Halloween week",
    "glyph": "\U0001f383",
    "when_to_use": "October 31 is coming and the class can feel it. Twelve picks "
    "that run as a countdown to Halloween - one a day, or a full party-week plan.",
    "picks": [
        {"id": "halloween-countdown-calendar",
         "note": "The spine of the week: thirteen doors, thirteen mini-activities, one opened daily until the 31st."},
        {"id": "roll-a-monster-dice-draw",
         "note": "Every monster comes out different - the dice-draw craft that starts every Halloween week right."},
        {"id": "halloween-inference-riddles",
         "note": "Zero-prep inference practice in a witch hat - cite your clue or it doesn't count."},
        {"id": "glow-stick-temperature-lab",
         "note": "The not-too-spooky science anchor: same glow sticks, three temperatures, real data."},
        {"id": "witch-broomstick-relay",
         "note": "Pool-noodle broomsticks, full-speed relay - the wiggles-burner of the pack."},
        {"id": "pumpkin-bowling",
         "note": "Mini pumpkins vs. bottle pins: the rainy-day insurance policy."},
        {"id": "ghost-banana-pops",
         "note": "Two-ingredient frozen ghosts - the treat activity that needs no oven."},
        {"id": "costume-swap-shop",
         "note": "Outgrown costumes find new kids - the community-minded centerpiece."},
        {"id": "kindness-pumpkins",
         "note": "Paint them kind, deliver them in pairs - trick-or-treating in reverse."},
        {"id": "teal-pumpkin-project",
         "note": "The Vault's allergy-aware must-do - teal pumpkin, non-food treat box, Halloween for every kid."},
        {"id": "monster-mash-dance",
         "note": "Freeze in your spookiest pose when the music stops - the party classic."},
        {"id": "marigold-cempasuchil-flowers",
         "note": "A respectful Dia de los Muertos craft about remembrance - learning, not dressing up."},
    ],
}

def main():
    acts_path = os.path.join(DATA, 'activities.json')
    acts = json.load(open(acts_path))
    have = {a['id'] for a in acts}
    dupes = [a['id'] for a in PACK if a['id'] in have]
    in_dupes = len({a['id'] for a in PACK}) != len(PACK)
    if dupes or in_dupes:
        print("DUPLICATE IDS:", dupes, "internal-dupes:", in_dupes)
        sys.exit(1)
    acts.extend(PACK)
    json.dump(acts, open(acts_path, 'w'), ensure_ascii=False, indent=1)
    print(f"activities: {len(acts) - len(PACK)} -> {len(acts)} (+{len(PACK)})")

    cols_path = os.path.join(DATA, 'collections.json')
    cols = json.load(open(cols_path))['collections']
    if any(c['id'] == HALLOWEEN_WEEK['id'] for c in cols):
        print("collection halloween-week already present - skipping")
    else:
        cols.append(HALLOWEEN_WEEK)
        json.dump({"collections": cols}, open(cols_path, 'w'),
                  ensure_ascii=False, indent=1)
        print(f"collections: {len(cols) - 1} -> {len(cols)} (+halloween-week)")
    # tagline length guard (build.py renders taglines into meta descriptions)
    bad = [(a['id'], len(a['tagline'])) for a in PACK if len(a['tagline']) > 160]
    if bad:
        print("TAGLINES OVER 160:", bad)
        sys.exit(1)
    print("taglines all <= 160 chars")

if __name__ == '__main__':
    main()
