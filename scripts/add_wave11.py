#!/usr/bin/env python3
"""Wave 11: append the spring seasonal pack (25 activities).

Run once: dedupes by id, writes data/activities.json.
Run scripts/build.py afterwards.

All original words per PIPELINE.md. Classic public-domain concepts
(cherry-blossom crafts, egg relays, puddle science, seed balls) described
in our own words. New tags: season:spring, holiday:easter, holiday:earth-day.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')

def A(id, name, tagline, cats, ages, group, time, loc, mats, no_prep, setup,
      steps, easier, harder, safety=None, tags=None, source=None):
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
    if source:
        rec["source"] = source
    return rec

S = ["season:spring"]
SE = ["season:spring", "holiday:easter"]
SD = ["season:spring", "holiday:earth-day"]

SPRING_PACK = [
A("tissue-paper-cherry-blossoms", "Tissue Paper Cherry Blossoms",
  "Twisted paper branches covered in pink tissue blooms — spring on a branch.",
  ["crafts"], (4, 12), (2, 30), (20, 40), ["indoor"],
  ["brown paper strips or twisted newspaper", "pink and white tissue paper",
   "glue sticks", "scissors", "blue construction paper for mounting"],
  False,
  "Set out one brown paper strip per kid and piles of pre-cut tissue squares "
  "(about 2 inches). Put a dab station of glue at each table.",
  ["Twist each brown strip tightly into a branch — thicker at the bottom, "
   "forked at the top.",
   "Take one tissue square, pinch it in the center, and twist the pinched "
   "end. That is one blossom.",
   "Glue 8 to 12 blossoms along each branch, clustering 2 or 3 together for "
   "fullness. Mix pink and white.",
   "Glue the finished branch onto blue construction paper so the blossoms pop.",
   "Gallery walk: line the branches up and spot whose tree looks windiest."],
  "Pre-cut the tissue squares and let little ones just pinch and stick.",
  "Shade the blossoms: layer a small white twist inside a larger pink one.",
  "Scissors supervision; remind kids to cut away from fingers.",
  S),

A("coffee-filter-butterflies", "Coffee Filter Butterflies",
  "Markers plus a spritz of water turn a coffee filter into butterfly wings.",
  ["crafts"], (4, 12), (2, 30), (15, 30), ["indoor"],
  ["round basket coffee filters (2 per kid)", "washable markers",
   "spray bottles with water", "clothespins", "pipe cleaners"],
  False,
  "Give each kid two coffee filters and markers. Fill spray bottles with "
  "plain water — one per table.",
  ["Color a coffee filter all over with washable markers — the brighter the "
   "better. Patterns beat solid color.",
   "Lay the filter flat and spritz it lightly: two pumps, not a soak. Watch "
   "the colors bleed together.",
   "Let it dry for 5 minutes (wave it gently to speed things up).",
   "Pinch the dry filter in the middle and clip it with a clothespin — that "
   "is the butterfly body.",
   "Wrap a pipe cleaner around the clothespin top and curl the ends into "
   "antennae. Two filters make a four-wing butterfly."],
  "The teacher does the spritzing; kids only color and pinch.",
  "Design challenge: make both wings symmetrical, then make a pair that is "
  "deliberately mismatched.",
  "Washable markers only; spray bottles pointed at the paper, never at faces.",
  S),

A("painted-rock-ladybugs", "Painted Rock Ladybugs",
  "Smooth rocks from the yard become ladybugs — then hide them for others to find.",
  ["crafts", "outdoor"], (5, 12), (2, 30), (20, 40), ["indoor", "outdoor"],
  ["smooth flat rocks (collected ahead)", "red and black paint or paint pens",
   "white paint for eyes", "brushes", "newspaper to cover tables"],
  False,
  "Collect smooth, flat rocks ahead of time — about the size of a cookie. "
  "Wash and dry them. Cover tables with newspaper.",
  ["Paint each rock red all over and let it dry completely.",
   "Paint a black half-circle at one end for the head.",
   "Add black dots down the back — no two ladybugs need the same pattern.",
   "Dot two tiny white eyes on the head.",
   "Optional: hide the finished ladybugs around the schoolyard for other "
   "classes to discover."],
  "The teacher paints the red base coat ahead; kids add dots and faces.",
  "Make a 'habitat card' for each ladybug: where the rock was found and what "
  "real ladybugs eat there.",
  "Wash hands after handling rocks and paint. Smocks or old shirts — the "
  "paint does not wash out.",
  S),

A("pressed-flower-bookmarks", "Pressed Flower Bookmarks",
  "Real pressed flowers sealed into a bookmark — a spring keepsake that lasts.",
  ["crafts", "quiet-focus"], (6, 12), (2, 30), (25, 45), ["indoor"],
  ["small fresh flowers and leaves (picked with permission)",
   "heavy books for pressing", "cardstock strips", "clear packing tape or "
   "contact paper", "hole punch", "yarn"],
  False,
  "Pressing takes days, so start a class pressing book at least 3 days ahead "
  "(or keep one going all spring). Cut cardstock into bookmark strips and "
  "set out tape.",
  ["Open the pressing book and let each kid choose 3 to 5 flat, dry flowers "
   "or leaves.",
   "Arrange them on a cardstock strip — leave a border all around.",
   "Cover the whole strip with a smooth layer of clear packing tape, pressing "
   "out bubbles.",
   "Trim the tape edges, punch a hole at the top, and tie a yarn tassel.",
   "Write your name and the date on the back — a real keepsake."],
  "Use a pre-pressed class set so little ones only arrange and tape.",
  "Label each flower on the back with its name — turn it into a botany card.",
  "Pick only flowers you are allowed to pick, and never taste any plant. "
  "Wash hands after.",
  S),

A("egg-carton-tulip-garden", "Egg Carton Tulip Garden",
  "Cut-up egg cartons bloom into a whole tray of painted tulips.",
  ["crafts"], (4, 12), (2, 30), (20, 35), ["indoor"],
  ["cardboard egg cartons", "green pipe cleaners", "paint and brushes",
   "pom-poms or scrunched tissue", "glue", "a tray per group"],
  False,
  "Cut the egg cartons into individual cups ahead of time (one per kid, plus "
  "spares). Poke a small hole in the bottom of each cup.",
  ["Paint the outside of your cup a bright petal color and let it dry.",
   "Push a green pipe cleaner up through the hole — that is the stem. Bend "
   "the top so the cup does not slide off.",
   "Glue a pom-pom or tissue ball inside the cup for the flower center.",
   "Cut two leaf shapes from green paper and glue them to the stem.",
   "Plant all the tulips upright in the group tray — a full spring garden by "
   "the end of class."],
  "Pre-cut the cups and pre-poke the holes; little ones just paint and assemble.",
  "Painting challenge: make a bud (cup pinched shut), a bloom, and a fading "
   "flower — the three stages of spring.",
  "Scissors are for the teacher's prep step only; remind kids to keep paint "
  "off clothes.",
  S),

A("paper-plate-sunflower", "Paper Plate Sunflower",
  "A paper plate, some yellow paint, and a seed-mosaic center — instant sunflower.",
  ["crafts"], (4, 12), (2, 30), (15, 30), ["indoor"],
  ["paper plates (one per kid)", "yellow paint or crayons",
   "brown tissue paper or real sunflower seeds (for gluing)",
   "green paper strips", "glue sticks"],
  True,
  "Hand out one paper plate per kid and put the yellow paint or crayons in "
  "the middle of each table.",
  ["Color the whole plate yellow — paint is brightest, crayons work too.",
   "Cut slits all around the plate edge (about an inch deep) and bend every "
   "other flap slightly down: those are the petals.",
   "Glue brown tissue scraps or real seeds in a circle in the middle for the "
   "flower head.",
   "Glue a green paper strip to the back as the stem.",
   "Hold them up together — a field of sunflowers, zero watering needed."],
  "Use crayons instead of paint for zero drying time.",
  "Two-tone challenge: paint the petal tips a darker yellow-orange gradient.",
  None,
  S),

A("worm-weather-watch", "Worm Weather Watch",
  "After rain, the worms come out — count them, log the weather, find the pattern.",
  ["stem", "outdoor"], (5, 12), (2, 30), (20, 40), ["outdoor"],
  ["clipboards and paper", "pencils", "magnifying glasses (optional)",
   "a spray bottle of water"],
  True,
  "Best the morning after rain. Mark one observation square per pair with "
  "chalk or string — about a beach-towel size patch of grass or pavement edge.",
  ["Spend 5 quiet minutes just watching your square. Count every worm you see.",
   "Log the weather: temperature guess, cloudy or sunny, ground wet or dry.",
   "Watch one worm for 2 full minutes. Which way does it move? How?",
   "Gently return any handled worms to the soil where you found them.",
   "Back inside, chart the class counts against the weather log. Do rainy "
   "mornings really mean more worms?"],
  "One big class square that everyone watches together.",
  "Keep the log for two weeks and graph worm counts against actual rainfall.",
  "Wash hands after. Handle worms gently and put them back — never take them "
  "inside, and do not dig up garden beds.",
  S),

A("puddle-depth-gauge", "Puddle Depth Gauge",
  "Mark a stick, measure the puddle, come back later — where did the water go?",
  ["stem", "outdoor"], (6, 12), (2, 30), (20, 35), ["outdoor"],
  ["paint stir sticks or dowels (one per pair)", "rulers",
   "permanent markers", "paper for data charts"],
  True,
  "Needs a real puddle — right after rain is perfect. Give each pair a stick, "
  "a ruler, and a marker.",
  ["Mark centimeter lines up one side of your stick with the ruler and marker.",
   "Pick a puddle. Measure the depth at the center and at two edges — write "
   "all three numbers down.",
   "Predict: in one hour, will the puddle be deeper, shallower, or gone?",
   "Come back in an hour and measure the same three spots.",
   "Compare: which spot shrank fastest? Sunny puddles vs. shady ones — who "
   "wins the evaporation race?"],
  "One class puddle, one class stick, group predictions.",
  "Calculate the depth lost per hour and predict when the puddle vanishes — "
  "then check tomorrow.",
  "Measure from the puddle's edge — no wading into deep water, and stay out "
  "of streets and parking lots.",
  S),

A("flower-part-dissect", "Flower Part Dissect",
  "Take a flower apart piece by piece and find the machinery inside.",
  ["stem"], (7, 12), (2, 30), (25, 40), ["indoor"],
  ["one large flower per pair (tulip or lily from the grocery store)",
   "tweezers", "paper plates", "hand lenses", "tape and labels"],
  False,
  "Buy the flowers the same day — tulips and lilies have big, easy-to-find "
  "parts. Give each pair one flower, a plate, and tweezers.",
  ["Draw your flower whole first — you will want the 'before' picture.",
   "Pull off the petals one by one and lay them in a row. Count them.",
   "Find the stamens (the stalks with powdery tips) — touch the pollen with "
   "a fingertip. That powder is the point of the whole flower.",
   "Find the pistil in the center — the sticky-tipped stalk. That is where "
   "seeds begin.",
   "Tape each part onto a labeled diagram: petal, sepal, stamen, pistil."],
  "The teacher dissects one flower up front while kids label along.",
  "Compare two different flowers side by side — which parts match, which do not?",
  "Check for pollen or flower allergies before starting. No tasting any part. "
  "Wash hands when done.",
  S),

A("nest-material-challenge", "Nest Material Challenge",
  "Build a bird nest from yard scraps — then test it with a marble egg.",
  ["stem", "outdoor"], (6, 12), (2, 30), (25, 45), ["outdoor"],
  ["paper bags for collecting", "a marble or small ball per team as the 'egg'",
   "twine (optional)"],
  True,
  "Set a 10-minute collection window and clear boundaries for gathering: "
  "twigs, grass, leaves, and mud only — nothing from living plants.",
  ["Teams of 3 get 10 minutes to gather nest materials — no raiding real nests.",
   "Build time: 15 minutes to weave a nest that can hold the marble egg.",
   "Test 1: set the marble in and count to 10. Still in? Pass.",
   "Test 2: the gentle shake — lift the nest 6 inches and wobble it. Egg "
   "stays? Sturdy nest.",
   "Test 3 (optional): the drop — knee height onto grass. Survivors get "
   "bragging rights.",
   "Debrief: which materials gripped best? Real birds figured this out "
   "without hands."],
  "Build on a paper plate base so the nest has a head start.",
  "Blind materials round: each team draws 3 material cards and may only use "
  "those.",
  "Build nests only — never touch a real nest or egg. Watch for thorns and "
  "wash hands after handling mud.",
  S),

A("seed-dispersal-design", "Seed Dispersal Design",
  "Maple seeds spin — design a paper seed that stays airborne even longer.",
  ["stem"], (7, 12), (2, 30), (20, 40), ["indoor", "outdoor"],
  ["paper", "tape", "paper clips", "scissors", "a stopwatch",
   "maple seeds if you can find them"],
  False,
  "If maple seeds are around, start by dropping a few and watching them spin. "
  "Set a drop zone: same chair or stair height for every test, floor clear below.",
  ["Fold the classic paper helicopter: cut a strip, slit the top, fold the "
   "blades opposite ways.",
   "Drop it from the test height three times. Time each fall — average it.",
   "Now redesign: longer blades? Heavier bottom? Wider wings? Change ONE "
   "thing at a time.",
   "Test each design three times and record. Longest average flight wins.",
   "Final round: tape a paper clip 'seed' to your design as payload. Does it "
   "still fly?"],
  "Everyone builds the same basic helicopter and just races flight times.",
  "Constraint cards: must spin clockwise, must land within a hula hoop, must "
  "carry two paper clips.",
  "Keep the drop zone clear — nobody walks under the testing chair.",
  S),

A("sprout-growth-race", "Sprout Growth Race",
  "Two cups, one seed each, different light — place your bets on the sprout.",
  ["stem"], (5, 12), (2, 30), (15, 25), ["indoor"],
  ["clear plastic cups (2 per kid)", "potting soil", "bean seeds", "water",
   "labels and markers"],
  False,
  "Set up a soil station with scoops. Pre-label cups 'SUN' and 'DARK' for "
  "younger kids to save time.",
  ["Fill two cups with soil, poke one bean an inch deep in each, water both.",
   "Label them and place one on a sunny windowsill, one in a dark cupboard.",
   "Everyone predicts: which sprouts first? Write it down — no changing bets.",
   "Water lightly every other day and measure any growth with a ruler.",
   "After a week, compare. The dark cup usually sprouts first — but which one "
   "looks healthier? Discuss why."],
  "One class pair of cups that everyone watches together.",
  "Add a third cup: watered vs. never watered — which variable matters more?",
  "Wash hands after handling soil. Soil stays in the cups, not on faces.",
  S),

A("bubble-snake-blower", "Bubble Snake Blower",
  "A sock, a bottle, and some soapy water — blow a bubble snake a foot long.",
  ["stem", "outdoor"], (4, 12), (2, 30), (15, 25), ["outdoor"],
  ["plastic bottles with the bottoms cut off (teacher preps)",
   "old socks (one per bottle)", "rubber bands", "dish soap and water in "
   "shallow trays"],
  False,
  "Cut the bottoms off the bottles ahead of time — no kid cutting plastic. "
  "Mix a good squirt of dish soap into each tray of water.",
  ["Stretch a sock tightly over the cut end of the bottle and rubber-band it on.",
   "Dip the sock end into the soapy tray — soak it well.",
   "Blow gently through the mouthpiece. Out comes a long, wiggly bubble snake.",
   "Experiment: fast blow vs. slow blow — which makes the longer snake?",
   "Longest-snake contest: measure the winner with a ruler."],
  "The teacher does the dipping; kids only blow.",
  "Two-sock challenge: does a double layer make bigger or smaller bubbles? "
  "Hypothesize first.",
  "Blow, do not suck — and keep the soapy water out of eyes. Wash hands after.",
  S),

A("evaporation-chalk-lines", "Evaporation Chalk Lines",
  "Trace the puddle with chalk, wait an hour, and watch the water lose.",
  ["stem", "outdoor"], (5, 12), (2, 30), (15, 30), ["outdoor"],
  ["sidewalk chalk", "clipboards and paper", "a watch or timer"],
  True,
  "Needs puddles and pavement — right after rain on the blacktop is ideal. "
  "Give each pair a piece of chalk.",
  ["Pick a puddle and trace its exact edge with chalk. Write the time next "
   "to your line.",
   "Predict: in 30 minutes, will your line be inside or outside the water?",
   "Come back in 30 minutes and trace the new edge in a different color.",
   "Repeat at 60 minutes if you have time.",
   "Compare lines: sunny-side puddles vs. shady ones. Where did the water "
   "go? (Up! Into the air.)"],
  "One class puddle, two tracings, group discussion.",
  "Copy your puddle outlines onto graph paper and estimate the area lost.",
  "Chalk on pavement only — not walls or cars. Stay on dry edges, out of "
  "the street.",
  S),

A("sponge-bucket-relay", "Sponge Bucket Relay",
  "Soak, sprint, squeeze — the relay where the water does the traveling.",
  ["pe-movement", "outdoor"], (5, 12), (4, 30), (15, 30), ["outdoor"],
  ["2 buckets of water", "2 large sponges", "2 empty buckets", "cones for lanes"],
  False,
  "Set two lanes: a full water bucket at the start of each, an empty bucket "
  "about 30 feet away. One sponge per team.",
  ["Teams line up behind their water bucket.",
   "First runner soaks the sponge, runs to the far bucket, squeezes it in, "
   "runs back, and hands off.",
   "Next runner goes. No wringing the sponge out early — it has to travel wet.",
   "First team to fill their far bucket to the marked line wins.",
   "Losers' consolation: everyone gets to dump the leftover water on the grass."],
  "Shorten the lane to 15 feet for little legs.",
  "Overhead carry: the sponge must travel above your head — drips count "
  "against you.",
  "Wet pavement is slippery — walk the turn at the far bucket, no diving "
  "stops. Shoes stay on.",
  S),

A("puddle-stomp-parade", "Puddle Stomp Parade",
  "Line up, chant, and stomp every puddle on the route — rhythm required.",
  ["pe-movement", "outdoor"], (4, 10), (2, 30), (10, 20), ["outdoor"],
  [],
  True,
  "No setup — just rain boots or old shoes and a route with puddles. Scout "
  "the route first for anything deeper than a shoe.",
  ["Line up single file behind the leader.",
   "March to a chant: 'Stomp, stomp, puddle stomp!' — leader calls, group answers.",
   "Every puddle on the route gets stomped in rhythm as the line passes through.",
   "Rotate the leader every two puddles — new leaders invent new verses.",
   "Grand finale: everyone finds the biggest puddle and does one giant "
   "synchronized stomp. Then shake off and head in."],
  "Skip the chant — just stomp freely through the puddles.",
  "Kids compose the verses: each puddle gets its own rhyming couplet.",
  "Rain boots or shoes you do not mind soaking. Splash-zone rule: no stomping "
  "right next to someone's face.",
  S),

A("spring-sound-map", "Spring Sound Map",
  "Sit still for two minutes, then draw every sound you heard — and where it lived.",
  ["quiet-focus", "outdoor"], (5, 12), (2, 30), (15, 25), ["outdoor"],
  [],
  True,
  "No materials — this one runs on ears. Set clear sit-spot boundaries first, "
  "spaced so nobody distracts a neighbor.",
  ["Everyone finds a sit spot and gets comfortable.",
   "Eyes closed, two full minutes of just listening. No talking, no peeking.",
   "Open eyes. On paper (or in the air with a finger), draw an X for yourself.",
   "Mark every sound you heard around the X: bird up-left, wind overhead, "
   "car far right — closer sounds closer to the X.",
   "Share: who heard the most sounds? Who heard something nobody else did?",
   "Optional: come back tomorrow at the same time and compare maps."],
  "Skip the drawing — just list the sounds out loud after.",
  "Layer it: mark human sounds with circles and nature sounds with stars.",
  None,
  S),

A("puddle-hopscotch", "Puddle Hopscotch",
  "Classic hopscotch with a twist: the blue squares are puddles — jump them.",
  ["pe-movement", "outdoor"], (4, 12), (2, 30), (15, 30), ["outdoor"],
  ["sidewalk chalk (including blue)", "a small stone per kid as a marker"],
  True,
  "Draw a standard hopscotch court on pavement. Color 2 or 3 squares solid "
  "blue — those are the puddles.",
  ["Toss your marker onto square one and hop the court as usual.",
   "Rule: you may never land in a blue puddle square — jump clean over it.",
   "Land in a puddle and you lose your turn (and get pretend-soaked).",
   "Finish the court, then toss to square two. First to complete all throws wins.",
   "Remix round: players take turns adding a new blue puddle square."],
  "Let little ones step around the puddles instead of jumping them.",
  "Double-puddle jump: two blue squares in a row — only for confident hoppers.",
  "Chalk on pavement only. Keep the court clear of bikes and foot traffic.",
  S),

A("egg-roll-race", "Egg Roll Race",
  "The egg-and-spoon classic, spring edition — plastic eggs, real competition.",
  ["pe-movement", "outdoor"], (4, 12), (4, 30), (15, 25), ["indoor", "outdoor"],
  ["plastic Easter eggs (one per kid)", "tablespoons", "cones for start and "
   "turnaround"],
  True,
  "Set two lanes with a turnaround cone about 20 feet out. One spoon and one "
  "plastic egg per racer.",
  ["Racers balance the egg on the spoon — one hand on the spoon, other hand "
   "behind your back.",
   "On 'go', walk (then run, for older kids) to the cone, circle it, and come back.",
   "Drop the egg? Stop, pick it up, put it back on the spoon, keep going.",
   "Tag the next teammate's hand for the relay handoff.",
   "Winning team picks the victory chant. Losing team picks it too — everyone "
   "chants it."],
  "Carry the egg in your hand instead of on the spoon.",
  "Spoon-in-mouth round for older kids — no hands allowed at all.",
  "Clear the lane of tripping hazards. No running with the spoon in the mouth "
  "for the youngest racers.",
  SE),

A("jellybean-sort-graph", "Jellybean Sort Graph",
  "Sort the jellybeans, count the colors, graph it — then check your prediction.",
  ["stem"], (5, 12), (2, 30), (20, 35), ["indoor"],
  ["jellybeans or colored counters (one small cup per pair)",
   "muffin tins or sorting trays", "graph paper", "crayons"],
  False,
  "Portion one small cup of jellybeans per pair — mixed colors. Hand out "
  "graph paper with the color labels pre-written for younger kids.",
  ["Before opening: predict which color you will have the most of. Write it down.",
   "Sort your cup by color into the muffin tin.",
   "Count each color and write the numbers down.",
   "Build a bar graph: one bar per color, one square per bean.",
   "Compare: did your prediction win? Combine the class data — does the big "
   "graph match anyone's small one?"],
  "Sort and count only — skip the graph.",
  "Fractions: what fraction of your cup is red? Convert the graph to percentages.",
  "Allergy check before any tasting, and set the eat-or-not rule before the "
  "cups open — not halfway through.",
  SE),

A("easter-egg-catapult", "Easter Egg Catapult",
  "Popsicle sticks, rubber bands, one plastic spoon — launch the egg at the target.",
  ["stem"], (7, 12), (2, 30), (25, 45), ["indoor", "outdoor"],
  ["popsicle sticks", "rubber bands", "plastic spoons", "plastic Easter eggs",
   "tape", "a measuring tape", "a bucket as a target"],
  False,
  "Pre-bundle the building supplies per pair: 8 sticks, 4 rubber bands, 1 "
  "spoon, tape. Set a clear firing range with the target bucket 6 feet out.",
  ["Build the base: stack 5 sticks and rubber-band both ends tight.",
   "Lay 2 sticks in a V across the stack and band the crossing point — that "
   "is the arm base.",
   "Tape the spoon to the end of the top stick. Arm complete.",
   "Load a plastic egg, pull back, release. Measure how far it flew.",
   "Iterate: move the fulcrum, tighten the bands, change the angle. Best of "
   "5 launches counts.",
   "Final: accuracy round — 3 points for the bucket, 1 for within a hula hoop."],
  "The teacher pre-builds the base; kids attach the spoon and launch.",
  "Distance-plus-accuracy combined score, or a moving target (a rolling hoop).",
  "Launch away from people, one launcher firing at a time. Plastic eggs only — "
  "nothing hard or heavy.",
  SE),

A("earth-day-trash-audit", "Earth Day Trash Audit",
  "Sort one day of classroom trash, weigh the truth, and set one reduction goal.",
  ["stem", "team-community"], (7, 12), (4, 30), (30, 50), ["indoor"],
  ["disposable gloves (one pair per kid)", "trash bags", "a tarp or old sheet",
   "a scale (optional)", "chart paper and markers"],
  False,
  "Save one full day of classroom trash in tied bags. Lay the tarp, set out "
  "gloves, and pre-screen the bags for anything sharp — the teacher does "
  "this part, not the kids.",
  ["Gloves on. Dump one bag onto the tarp.",
   "Sort into three piles: recycle, trash, could-have-been-avoided.",
   "Count or weigh each pile and record the numbers on chart paper.",
   "Find the biggest avoidable item. As a class, set ONE reduction goal for "
   "next week.",
   "Re-audit in a week and compare. Post the before-and-after chart by the door."],
  "Audit just paper vs. everything else — two piles, same lesson.",
  "Run the audit for a full week and present the results to another class.",
  "Gloves stay on the whole time. The teacher pre-screens every bag — no "
  "sharp or unknown items, ever. Wash hands thoroughly after.",
  SD),

A("seed-ball-wildflowers", "Seed Ball Wildflowers",
  "Clay, compost, native seeds — roll them, dry them, toss them where flowers belong.",
  ["crafts", "outdoor"], (5, 12), (2, 30), (20, 35), ["indoor", "outdoor"],
  ["air-dry clay or clay-rich soil", "compost", "native wildflower seed mix",
   "water", "trays for drying"],
  False,
  "Mix the dry ingredients ahead: roughly 3 parts clay to 2 parts compost. "
  "Set out the seed mix separately so kids see what goes in.",
  ["Grab a plum-size lump of the clay-compost mix.",
   "Press a pinch of wildflower seeds into the center and fold the clay over.",
   "Roll it into a firm marble-size ball. Make 4 or 5 each.",
   "Set the balls on trays to dry for a day or two.",
   "Toss them onto bare soil patches — garden edges, planters, the nature "
   "corner. Rain does the rest.",
   "Mark your toss spots on a map. Check back in 3 weeks for sprouts."],
  "The teacher mixes; kids only roll the balls.",
  "Experiment: toss half in sun and half in shade — which patch sprouts first?",
  "Native seed mix only — never toss non-native or invasive seeds. Wash hands "
  "after handling compost.",
  SD),

A("recycled-paper-making", "Recycled Paper Making",
  "Yesterday's scrap paper becomes tomorrow's paper — blended, scooped, and pressed.",
  ["stem", "crafts"], (7, 12), (2, 30), (30, 50), ["indoor"],
  ["shredded scrap paper", "a blender (teacher-operated)", "water",
   "a basin", "a window screen in a frame or fine mesh", "sponges", "towels"],
  False,
  "Soak the shredded paper in water for at least an hour ahead of time. Set "
  "up the blender station where only the teacher stands. This is a two-day "
  "project: make today, use tomorrow.",
  ["Tear the soaked paper into small bits and blend it with plenty of water "
   "into a smooth pulp — the teacher runs the blender.",
   "Pour the pulp into the basin and stir in more water until it looks like "
   "thin oatmeal.",
   "Slide the screen frame under the pulp and lift straight up — a thin "
   "layer stays on the mesh.",
   "Sponge the water out through the screen, then flip the sheet onto a towel.",
   "Let the sheets dry overnight. Tomorrow: write on the paper you made.",
   "Optional: press flower petals into the wet pulp for decorated paper."],
  "Make one big class sheet together instead of individual ones.",
  "Experiment: which scrap makes the strongest sheet — newspaper, printer "
  "paper, or construction paper?",
  "The teacher operates the blender — no exceptions. Wipe up water spills "
  "right away; wet floors are the real hazard here.",
  SD),

A("thunderstorm-clap-along", "Thunderstorm Clap Along",
  "Become the storm with your hands and feet — then conduct it back to calm.",
  ["music-rhythm"], (4, 12), (2, 40), (10, 20), ["indoor"],
  [],
  True,
  "No setup. Arrange the group in a circle or at their desks — everyone needs "
  "elbow room for stomping.",
  ["The leader is the conductor. Start with silence — 'the air before the storm.'",
   "Wind: everyone rubs their palms together softly, then louder.",
   "First drops: finger snaps, scattered, then faster.",
   "Rain: full clapping, building louder and louder.",
   "Thunder: foot stomps on the conductor's cue — big ones.",
   "Peak storm: everything at once for 10 seconds.",
   "Then reverse it: thunder fades, rain slows, drops stop, wind dies. Silence. "
   "The storm has passed.",
   "Rotate the conductor and let a kid run the next storm."],
  "Follow-the-leader only — the teacher conducts the whole storm.",
  "Split into four groups, each owning one storm layer, and layer them like "
  "an orchestra.",
  None,
  S),
]

def main():
    path = os.path.join(DATA, 'activities.json')
    acts = json.load(open(path))
    have = {a['id'] for a in acts}
    new = [a for a in SPRING_PACK if a['id'] not in have]
    skipped = [a['id'] for a in SPRING_PACK if a['id'] in have]
    acts.extend(new)
    json.dump(acts, open(path, 'w'), indent=1, ensure_ascii=False)
    open(path, 'a').write('\n')
    print(f"added {len(new)}, skipped {len(skipped)}: {skipped}")
    print(f"total {len(acts)}")

if __name__ == '__main__':
    main()
