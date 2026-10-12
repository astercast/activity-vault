#!/usr/bin/env python3
"""Wave 13: append the Halloween 2026 pack (20 activities).

Run once: dedupes by id, writes data/activities.json.
Run scripts/build.py afterwards.

All original words per PIPELINE.md. Classic public-domain concepts
(ghost garlands, costume parades, pumpkin volcanoes, candy chromatography,
slime, apple tasting, trunk-or-treat, teal pumpkin awareness) described in
our own words.
Tags used (all already in the validator vocabulary since wave 4):
holiday:halloween, theme:spooky, season:fall.
Retro-tags: halloween-mummy-wrap and pumpkin-letter-hunt gain
holiday:halloween (tags only — descriptions untouched).
Skipped as near-duplicates of existing library items: a third no-carve
pumpkin-decorating concept (no-carve-pumpkin-decorating and
pumpkin-painting-party already cover it) and an eyeball spoon race
(easter-egg-relay already covers the spoon-race mechanic).

Safety notes are practical only (adult knife work, allergy checks,
choking hazards, no shared food/water) — no medical claims anywhere.
Spookiness stays age-labeled: everything is silly-spooky or milder.
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

H = ["holiday:halloween"]
HS = ["holiday:halloween", "theme:spooky"]
HF = ["season:fall", "holiday:halloween"]
F = ["season:fall"]

HALLOWEEN_PACK = [
# ---------------- halloween crafts (4) ----------------
A("ghost-garland-string", "Ghost Garland String",
  "Tissue ghosts, strung on yarn — the fastest room transformation in the Vault.",
  ["crafts", "seasons"], (4, 10), (2, 30), (20, 35), ["indoor"],
  ["white tissue paper or napkins", "cotton balls or crumpled paper",
   "yarn or string", "markers", "tape"],
  False,
  "Cut tissue into 8-inch squares — one per ghost. Cut yarn into 4-foot "
  "lengths and tie a loop at one end for hanging.",
  ["Wrap a tissue square over a cotton ball and pinch it under the 'head'.",
   "Tie a short piece of yarn snugly under the head to make the neck.",
   "Draw two eyes and a surprised mouth with marker — every ghost gets a "
   "personality.",
   "Tie each ghost to the long yarn, spacing them a hand-width apart.",
   "Hang the garlands across the room and stand back: instant haunted hallway."],
  "Use paper napkins instead of tissue and skip the cotton balls — flat "
  "ghosts tape straight to the yarn.",
  "Add tiny paper hats or capes, and alternate ghosts with orange paper "
  "pumpkins on the string.",
  "Scissors stay at the table; little kids get pre-cut squares. Keep "
  "garlands above head height in walkways so nobody gets tangled.",
  HS),

A("monster-mask-making", "Monster Masks",
  "Cardstock monsters with 3D horns, fangs, and warts — built for the costume station.",
  ["crafts", "holidays"], (5, 12), (2, 30), (25, 45), ["indoor"],
  ["cardstock or paper plates", "scissors", "glue sticks",
   "elastic cord or craft sticks", "crayons or markers",
   "extras: paper scraps, cotton balls, foil"],
  False,
  "Pre-cut a mask oval for the youngest kids; older kids trace and cut "
  "their own. Punch side holes for elastic, or tape a craft stick handle.",
  ["Hold the oval to your face and mark where your eyes are — cut the eye "
   "holes wide.",
   "Build the monster: glue on horns (folded paper triangles), fangs "
   "(white triangles along the mouth), warts (cotton balls or crumpled foil).",
   "Color the whole face — green, purple, spotted, whatever your monster is.",
   "Attach elastic through the side holes, or tape a craft stick as a handle.",
   "Monster meet-and-greet: introduce your monster with a name and one "
   "silly power."],
  "Use pre-cut masks and stick-on features only — no cutting at all.",
  "Design a two-faced mask: hero on the outside, monster on the inside.",
  "Eye holes must stay big enough to see through clearly — no peeking "
  "through slits. Masks come off for running games.",
  HS),

A("lollipop-ghost-treats", "Lollipop Ghost Treats",
  "A tissue, a lollipop, a ribbon — the classic Halloween handout, made by the kids.",
  ["crafts", "holidays"], (4, 10), (2, 30), (15, 25), ["indoor"],
  ["lollipops (one per ghost)", "white tissues or napkins",
   "thin ribbon or yarn", "markers"],
  False,
  "Count lollipops — one per ghost, plus a few extras. Cut ribbon into "
  "6-inch pieces.",
  ["Drape a tissue over a lollipop so it hangs like a little ghost.",
   "Pinch the tissue under the candy and tie it snugly with ribbon.",
   "Draw two eyes and a tiny mouth on the front.",
   "Line the ghosts up on the table — a whole haunted chorus.",
   "Bag them up: instant Halloween handouts or party favors."],
  "Skip the ribbon — a twist of the tissue under the candy holds fine for "
  "table display.",
  "Write one kind note on the back of each ghost before bagging.",
  "Check the candy against the class allergy list first — offer stickers "
  "or pencils as the alternative for kids who can't have it. No unwrapping "
  "and eating during craft time; treats go home.",
  H),

A("pressed-leaf-mandala", "Pressed-Leaf Mandalas",
  "Fall leaves arranged into perfect symmetrical circles — harvest math you can hang up.",
  ["crafts", "seasons", "stem"], (5, 12), (2, 30), (20, 40), ["indoor"],
  ["pressed or freshly fallen leaves in different colors",
   "cardstock circles or paper plates", "glue sticks"],
  False,
  "Collect fallen leaves ahead — or send kids out with a bag first. Press "
  "them under books for a day if you want them flat.",
  ["Sort your leaves by color and size — this is the planning step.",
   "Find the center of your circle and place one special leaf there.",
   "Build rings outward, repeating the same leaf in the same spots all the "
   "way around — symmetry is the game.",
   "Glue each ring before starting the next so nothing slides.",
   "Gallery walk: which mandala has the most rings? Which is the most "
   "symmetrical?"],
  "Use a paper plate with the ridges as ring guides, and only two leaf colors.",
  "Photograph the mandala, then rebuild it from memory — or design one "
  "with 180-degree rotational symmetry only.",
  "Collect fallen leaves only — don't strip branches. Wash hands after "
  "handling outdoor leaves.",
  HF),

# ---------------- costume & party games (5) ----------------
A("costume-runway-walk", "Costume Runway Walk",
  "Every costume gets its strut: a runway, a narrator, and one big pose at the end.",
  ["pe-movement", "holidays", "team-community"], (4, 12), (4, 30), (20, 30),
  ["indoor", "outdoor"],
  ["a long rug, tape line, or chalk path for the runway",
   "a pretend microphone"],
  True,
  "Lay the runway down the middle of the room. Line chairs along both "
  "sides for the audience. Pick your first narrator — or be it yourself.",
  ["One kid at a time walks the runway in costume while the narrator "
   "announces them: 'And here comes… the bravest pirate in Room 4!'",
   "At the end of the runway, strike one big pose and hold it for three "
   "seconds.",
   "The audience gives a silent cheer — jazz hands only, so the next "
   "walker can hear their intro.",
   "Walk back along the side and take a seat; the next walker goes.",
   "Finale: everyone walks the runway together for the group photo."],
  "Walk in pairs so shy kids have company.",
  "Walkers invent a signature move and the audience votes on categories — "
  "silliest, spookiest, most creative.",
  "Costumes must let kids see and walk — nothing over the eyes on the "
  "runway, and long capes get held up or pinned. Clear the runway of bags "
  "and shoes first.",
  H),

A("costume-piece-relay", "Costume Piece Relay",
  "Each runner adds one costume piece before sprinting — by the anchor leg, everyone's a monster.",
  ["pe-movement", "team-community", "holidays"], (5, 12), (8, 30), (15, 25),
  ["indoor", "outdoor"],
  ["a box of oversized costume pieces per team (hats, capes, glasses, "
   "gloves — thrift-store stuff)"],
  False,
  "Split the costume box evenly between teams — same number of pieces "
  "each. Mark start and turn-around lines.",
  ["Teams line up; the costume box sits at the start line.",
   "On 'go,' the first runner puts on ONE piece, runs to the turn-around "
   "and back, and tags the next runner.",
   "The next runner adds a second piece on top of the first — everyone "
   "keeps everything on.",
   "Keep going until the last runner is wearing the whole team's collection.",
   "Best-dressed team wins the style points; fastest team wins the race. "
   "Then swap boxes and go again."],
  "Walk, don't run — and pieces go on over regular clothes, not instead "
  "of them.",
  "Each runner must do their lap in character — the witch cackles, the "
  "robot clanks.",
  "Nothing that covers eyes or mouths while running, and no long trailing "
  "capes near feet. Pieces come off before anyone climbs or jumps.",
  H),

A("mystery-feel-boxes", "Mystery Feel Boxes",
  "Reach in and guess: peeled grapes, cold spaghetti — spooky-feeling, zero scares, lights on.",
  ["stem", "quiet-focus", "holidays"], (5, 12), (2, 30), (20, 30), ["indoor"],
  ["shoeboxes with hand-holes cut in the lids", "peeled grapes ('eyeballs')",
   "cooked cold spaghetti ('brains')", "a damp sponge ('tongue')",
   "dried apricots ('ears')"],
  False,
  "Cut a hand-hole in each box lid and tape the lids on so nobody peeks. "
  "Fill each box with one mystery item and label it with a silly spooky "
  "name ('Witch's Eyeballs').",
  ["Line the boxes up and read the spooky labels out loud — dramatic voice "
   "encouraged.",
   "One at a time, reach in (no peeking!) and feel for ten seconds.",
   "Whisper your guess to the teacher or write it on a slip — no shouting "
   "it out.",
   "Rotate through every box, then reveal the real items one by one.",
   "Vote: which one felt the spookiest? Which one fooled the most people?"],
  "Let kids look at the items first, then feel them blind — matching, not "
  "guessing.",
  "Kids design their own feel-box items from the classroom and stump the "
  "next group.",
  "Check every food item against the class allergy list before it goes in "
  "a box. Hands get washed before and after — nothing from the boxes goes "
  "in mouths.",
  HS),

A("monster-mash-dance", "Monster Mash Dance Party",
  "Freeze dance with monster moves called out — freeze in your spookiest pose.",
  ["pe-movement", "music-rhythm", "holidays"], (4, 12), (4, 40), (15, 25),
  ["indoor"],
  ["a speaker and a silly-spooky playlist (teacher's pick)"],
  True,
  "Clear a dance floor. Make the playlist — spooky-but-silly songs, "
  "nothing actually scary for the little ones.",
  ["Everyone dances. When the caller shouts a monster — 'ZOMBIE!' 'WITCH!' "
   "'MUMMY!' — dance like it.",
   "Music stops: freeze in your spookiest pose. Movers become the judges "
   "for one round.",
   "Judges pick the three best freezes — those kids become callers for the "
   "next round.",
   "New round, new caller, new monsters. Keep the poses coming.",
   "Last song: everybody's-monster freestyle, then a group freeze for the "
   "photo."],
  "No judging — everyone just freezes and unfreezes together.",
  "Callers string two monsters together ('zombie-witch!') and dancers have "
  "to blend them.",
  "Dance floor stays clear of bags, chairs, and costume pieces that trip. "
  "Keep the volume at conversation-over-it level.",
  HS),

A("apple-string-bite", "Apples on a String",
  "Bite the hanging apple with no hands — all the bobbing fun, none of the shared water.",
  ["outdoor", "pe-movement", "seasons"], (6, 12), (4, 30), (15, 25), ["outdoor"],
  ["small apples (one per kid)", "string or yarn",
   "a horizontal pole, branch, or clothesline to hang them from"],
  False,
  "Tie a string around each apple stem — or through a cored hole — and "
  "hang them at chin height from the line. Space them an arm's length apart.",
  ["Each kid stands in front of their own apple, hands behind their back.",
   "On 'go,' bite the apple — no hands, no holding the string.",
   "First bite counts as a point; most bites in two minutes wins the round.",
   "Eat your apple when the round ends — you earned it.",
   "Championship: the winners face off with the strings raised one notch "
   "higher."],
  "Let kids steady the apple with one finger on the string.",
  "Gently swing the apples before starting — moving targets.",
  "One apple per kid — no sharing bites. Check apple allergies first "
  "(rare, but ask). Watch for kids biting off more than they can chew; cut "
  "apples into wedges for anyone who struggles.",
  HF),

# ---------------- not-too-spooky science (4) ----------------
A("pumpkin-volcano-fizz", "Pumpkin Volcano",
  "A jack-o'-lantern that erupts: baking soda, vinegar, and dish soap, straight out of the grin.",
  ["stem", "seasons", "holidays"], (5, 12), (2, 30), (20, 30),
  ["indoor", "outdoor"],
  ["a small pumpkin", "baking soda", "white vinegar", "dish soap",
   "food coloring (orange)", "a tray", "cups for measuring"],
  False,
  "An adult cuts the top off the pumpkin and scoops it clean — kids do NOT "
  "do the knife work. Set the pumpkin on a tray (this gets messy). "
  "Pre-measure the baking soda into cups.",
  ["Carve or draw the jack-o'-lantern face — keep the mouth wide for the "
   "eruption.",
   "Spoon 3 tablespoons of baking soda into the pumpkin's hollow.",
   "Add a squirt of dish soap and a few drops of orange food coloring.",
   "Pour in half a cup of vinegar and step back — the volcano erupts out "
   "of the grin.",
   "Ask the science question: what made it foam? (The acid and the base "
   "react and release gas.) Repeat with more vinegar."],
  "Skip the carving — draw the face with marker and use an uncut pumpkin "
  "with the top off.",
  "Test variables: does warm vinegar erupt more than cold? Does more soap "
  "make taller foam? Run it like an experiment.",
  "Adults do ALL knife work — scooping and carving are grown-up jobs, full "
  "stop. Vinegar stings eyes, so pour slowly and keep faces back from the "
  "eruption.",
  HS),

A("candy-chromatography", "Candy Chromatography",
  "Candy dyes split into rainbow rings on a coffee filter — real separation science, Halloween edition.",
  ["stem", "quiet-focus", "holidays"], (7, 12), (2, 30), (25, 40), ["indoor"],
  ["colored-shell candies (the hard-shell kind)", "coffee filters",
   "small cups of water", "droppers or spoons", "paper plates"],
  False,
  "Sort candies by color — one color per filter. Cut coffee filters into "
  "strips and draw a pencil dot (not pen!) near the bottom of each.",
  ["Place one candy on the pencil dot and add a single drop of water on "
   "top of it.",
   "Watch: the color bleeds out and creeps up the filter in a ring.",
   "Wait two minutes, then lift the candy off — look at the rings left behind.",
   "Compare colors: which candy's dye split into two colors? Which stayed one?",
   "The reveal: one 'single' color is often a mix of dyes — the filter "
   "pulled them apart."],
  "Use brown and green candies only — they show the clearest splits.",
  "Predict first, then test: write down which candies you think hide two "
  "dyes, and check your predictions.",
  "Check the candy against the class allergy list. This is a look-don't-lick "
  "experiment — no tasting during the science.",
  H),

A("monster-slime-lab", "Monster Slime Lab",
  "Classic slime, monster-fied: googly eyes, glitter 'fur,' and stretch tests.",
  ["stem", "crafts", "holidays"], (5, 12), (2, 30), (25, 40), ["indoor"],
  ["white school glue", "baking soda", "contact lens solution (saline)",
   "water", "bowls and spoons for mixing", "googly eyes", "glitter",
   "food coloring"],
  False,
  "Cover tables — slime finds everything. Pre-measure: half a cup of glue "
  "and half a cup of water per batch, mixed in each bowl.",
  ["Stir half a teaspoon of baking soda into the glue-water mix.",
   "Add food coloring and glitter — this is the monster's skin and fur.",
   "Add one tablespoon of saline solution and stir; add a second if it's "
   "still sticky.",
   "Knead it with your hands for two minutes — the stickiness works itself out.",
   "Press in the googly eyes: your monster is alive. Stretch-test: how far "
   "before it snaps?"],
  "The teacher mixes the base; kids only do the coloring, glitter, and eyes.",
  "Run the stretch test like an experiment: does more saline make it "
  "stretchier or snappier? Chart three batches.",
  "Slime is for hands, not mouths — no tasting, and wash hands when you're "
  "done. Skip this one for kids who still mouth everything, and check for "
  "skin sensitivities to glue or saline.",
  HS),

A("haunted-house-blueprint", "Haunted House Blueprints",
  "Design a not-scary haunted house on paper: silly scares, secret passages, and a marked exit.",
  ["stem", "quiet-focus", "holidays"], (7, 12), (2, 30), (30, 45), ["indoor"],
  ["graph paper", "rulers", "pencils", "colored pencils"],
  False,
  "Hand out graph paper and rulers — one set per designer or pair. Set the "
  "design rule up front: silly-spooky only, nothing that would scare a "
  "kindergartner.",
  ["Draw the floor plan: entrance, three scare rooms, and a clearly marked "
   "EXIT.",
   "Design one silly scare per room — a tickle tunnel, a room where the "
   "'ghosts' compliment you, a floor that squeaks on purpose.",
   "Add one secret passage and label how it works.",
   "Trade blueprints with a neighbor: can they find the exit? Would a "
   "little kid laugh or cry at your scares?",
   "Revise once based on the feedback, then post the blueprints as the "
   "Haunted Hallway gallery."],
  "Design just one room instead of three, with a big EXIT arrow.",
  "Add a materials list and a budget: what would your haunted house "
  "actually cost to build?",
  None,
  HS),

# ---------------- harvest (3) ----------------
A("apple-tasting-party", "Apple Tasting Party",
  "Taste-test apple varieties blind, vote for the class favorite, and graph the results.",
  ["seasons", "stem", "team-community"], (4, 12), (4, 30), (20, 30), ["indoor"],
  ["3-4 apple varieties", "a knife and cutting board (adult only)",
   "small cups or plates", "voting stickers or slips", "chart paper"],
  False,
  "An adult slices the apples into tasting wedges — kids don't do the "
  "cutting. Label the varieties A, B, C so the tasting is blind.",
  ["Taste variety A: crunchy or soft? Sweet or tart? Everyone gives a "
   "thumbs up, sideways, or down.",
   "Repeat for B, C, and D — cleanse the palate with a sip of water between.",
   "Vote: one sticker per kid on the chart for your favorite.",
   "Reveal the names — did the class favorite surprise anyone?",
   "Graph it: bar chart of the votes, and one sentence about what the "
   "winning apple tasted like."],
  "Two varieties only, and vote with a show of hands.",
  "Add descriptive words to the chart — have tasters invent the vocabulary "
  "(snappy, honeyed, zippy).",
  "Adults do all the cutting. Check for apple and fruit allergies before "
  "tasting day, and keep the slices separate from other snacks.",
  HF),

A("harvest-gratitude-circle", "Harvest Gratitude Circle",
  "One thankful thought each, added to a paper harvest wreath — the season's quiet anchor.",
  ["team-community", "quiet-focus", "seasons"], (5, 12), (4, 40), (15, 25),
  ["indoor"],
  ["a large paper wreath cutout or paper-plate ring", "paper leaves",
   "markers", "tape or glue"],
  False,
  "Cut a big wreath ring from butcher paper, or tape paper-plate rings "
  "together. Cut paper leaves — one per kid plus extras.",
  ["Sit in a circle. Each person names one thing from this season they're "
   "thankful for — a person, a food, a moment.",
   "Write it on a paper leaf (or dictate it for young writers).",
   "One by one, tape your leaf to the wreath and say the word out loud.",
   "When the wreath is full, hang it where the whole program can see it.",
   "Closing: one thing you're looking forward to before winter."],
  "Draw the thankful thing instead of writing it.",
  "Write the why, not just the what — one sentence about why it matters.",
  None,
  F),

A("pumpkin-guts-sensory", "Pumpkin Guts Sensory Bin",
  "Scoop, squish, and sort: pumpkin pulp and seeds in the bin, tweezers for the scientists.",
  ["quiet-focus", "stem", "seasons"], (3, 8), (2, 20), (20, 30), ["indoor"],
  ["a scooped pumpkin's pulp and seeds", "a wide shallow bin", "scoops",
   "cups", "tweezers", "smocks or old shirts"],
  False,
  "An adult scoops the pumpkin ahead of time — kids get the pulp, not the "
  "knife. Spread a sheet under the bin; this is gloriously messy.",
  ["Tip the whole pumpkin's insides into the bin — pulp, seeds, strings, "
   "all of it.",
   "Free explore: squish it, smell it, describe it. Slimy? Stringy? Cold?",
   "The sort challenge: tweezers only — seeds in one cup, pulp in another.",
   "Count the seeds in teams of ten. Which team harvested the most?",
   "Save the seeds for roasting or planting; compost the pulp."],
  "Hands only, no tweezers — just explore and describe.",
  "Weigh the seed cups: does the biggest pile always weigh the most?",
  "Pumpkin seeds are a choking hazard for the littlest kids — close "
  "supervision, and seeds stay in the bin, not in mouths. Wash hands before "
  "and after.",
  HF),

# ---------------- trick-or-treat alternatives (4) ----------------
A("trunk-or-treat-planning", "Trunk-or-Treat Planning",
  "Kids design the parking-lot Halloween: trunk themes, a traffic map, and the allergy-safe table.",
  ["team-community", "holidays", "stem"], (6, 12), (6, 30), (30, 45), ["indoor"],
  ["big paper for the parking-lot map", "markers", "sign-up sheet", "stickers"],
  False,
  "Sketch the real parking lot outline on the big paper — or walk it first "
  "and pace it off. Make the volunteer sign-up sheet.",
  ["Map it: draw every parking space on the lot map and number the trunks.",
   "Theme brainstorm: each team pitches a trunk theme — under-the-sea, mad "
   "scientist, book characters — and claims a space.",
   "Plan the traffic flow: one-way walking lanes, an entrance and an exit, "
   "so nobody bottlenecks.",
   "Assign jobs: greeters, the allergy-safe treat table crew, the cleanup crew.",
   "Send the sign-up sheet home: which family brings which trunk, and who "
   "staffs the allergy-safe table."],
  "The teacher maps the lot; kids only pitch themes and vote.",
  "Kids write the family letter themselves — date, time, what to bring, "
  "where to park.",
  "Cars stay parked with engines off for the whole event, and adults "
  "monitor the lot entrance. Plan the route so kids never walk behind "
  "reversing cars.",
  H),

A("reverse-trick-or-treat", "Reverse Trick-or-Treat",
  "Flip the script: kids pack treat bags and deliver them to seniors and neighbors.",
  ["team-community", "holidays"], (5, 12), (4, 30), (30, 60), ["outdoor"],
  ["paper bags", "decorating supplies",
   "store-bought sealed treats (allergy-aware picks)", "thank-you cards"],
  False,
  "Line up the delivery route ahead — a nearby senior center, or neighbors "
  "who've said yes. Buy sealed treats; check the allergy-safe options.",
  ["Decorate the bags — Halloween on the outside, kindness on the inside.",
   "Pack each bag: two or three sealed treats and one handmade thank-you card.",
   "Walk the route in small groups, each with an adult.",
   "Knock, smile, hand over the bag: 'Happy Halloween — this one's for you!'",
   "Back at home base: share one reaction each. Who lit up the most?"],
  "Deliver within the building — the front office, the custodians, the "
  "younger classrooms.",
  "Kids plan the route and write the ask-note to the senior center themselves.",
  "Small groups, an adult with every group, daylight or well-lit routes "
  "only. Sealed, store-bought treats only — nothing homemade for giving "
  "away. Check the allergy-safe options before packing.",
  H),

A("teal-pumpkin-project", "Teal Pumpkin Project",
  "Paint a pumpkin teal and run the allergy-safe treat table — Halloween for every kid.",
  ["crafts", "team-community", "holidays"], (4, 12), (2, 30), (20, 30), ["indoor"],
  ["a pumpkin (real or craft-foam)", "teal paint or a teal pumpkin sign",
   "a separate treat box",
   "non-food treats (stickers, pencils, glow bracelets)"],
  False,
  "Paint the pumpkin teal ahead of time, or let the kids do it as the "
  "craft. Set up TWO treat containers: candy, and the teal non-food box.",
  ["The meaning: a teal pumpkin on a porch means 'we have allergy-safe, "
   "non-food treats here.'",
   "Paint your teal pumpkin — or make a teal pumpkin sign for the door.",
   "Stock the teal box: stickers, pencils, glow bracelets, bouncy balls — "
   "nothing edible.",
   "Practice the line: 'Would you like candy or a teal treat?' Every kid "
   "gets asked, every kid gets a choice.",
   "Put the teal pumpkin where trick-or-treaters can see it, with the teal "
   "box right beside the candy."],
  "Print a teal pumpkin sign instead of painting — same meaning, zero dry time.",
  "Kids survey the neighborhood: how many teal pumpkins can they spot on "
  "Halloween night?",
  "Keep the non-food treats truly separate from the candy — different box, "
  "different scoop, no mix-ups. Check that small non-food items aren't "
  "choking hazards for the youngest visitors.",
  H),

A("trick-or-treat-route-map", "Trick-or-Treat Route Map",
  "Map the safe route before the big night: lit streets, buddy pairs, and crossing points.",
  ["team-community", "quiet-focus", "holidays"], (5, 12), (2, 30), (20, 30),
  ["indoor"],
  ["printed neighborhood maps or big paper", "markers",
   "stickers for 'safe stops'"],
  False,
  "Print simple street maps of the neighborhood around the school or "
  "program — or draw the main streets on big paper together.",
  ["Mark home base on the map — that's where the route starts and ends.",
   "Trace the route: stick to well-lit streets and sidewalks, and mark "
   "every street crossing with an X.",
   "Pair up: every kid gets a buddy, and buddies never separate — draw the "
   "pairs on the map's corner.",
   "Mark the safe stops: houses of people you know, the teal pumpkin "
   "houses, the well-lit corners.",
   "Walk the rules out loud: stay on sidewalks, cross at corners, one "
   "adult per group, home by the agreed time."],
  "The teacher pre-marks the route; kids add the buddy pairs and safe-stop "
  "stickers.",
  "Kids plan a second route for a different start point and compare which "
  "is safer.",
  "This is the safety activity: daylight planning for a nighttime event. "
  "The standing rules — reflective gear or glow sticks, an adult with every "
  "group, no entering homes — get said out loud and written on the map.",
  H),
]

# Older Halloween-appropriate activities: tags only, descriptions untouched.
RETRO_HALLOWEEN = {
    "halloween-mummy-wrap": ["holiday:halloween"],
    "pumpkin-letter-hunt": ["season:fall", "holiday:halloween"],
}

HAUNTED_HALLS = {
    "id": "haunted-halls",
    "title": "Haunted halls",
    "glyph": "👻",
    "when_to_use": "October is here and the program needs its Halloween spine: the Halloween 2026 pack's greatest hits plus the Vault's best older not-too-spooky picks — crafts, costume games, mild-thrill science, harvest anchors, trick-or-treat alternatives, and the allergy-aware must-dos.",
    "picks": [
        {"id": "no-carve-pumpkin-decorating",
         "note": "All the pumpkin fun, zero knives — the young-kid classic that starts every October."},
        {"id": "ghost-garland-string",
         "note": "Tissue ghosts on a string: the fastest room transformation in the Vault."},
        {"id": "monster-mask-making",
         "note": "Cardstock monsters with real 3D horns and fangs — costume-station ready."},
        {"id": "costume-runway-walk",
         "note": "Every costume gets its strut and its narrator moment."},
        {"id": "monster-mash-dance",
         "note": "Freeze when the music stops — in your spookiest pose."},
        {"id": "mystery-feel-boxes",
         "note": "Peeled grapes, cold spaghetti: mild thrills, lights on, zero scares."},
        {"id": "pumpkin-volcano-fizz",
         "note": "The jack-o'-lantern erupts — baking soda, vinegar, dish soap."},
        {"id": "candy-chromatography",
         "note": "Candy dyes split into rainbows on coffee filters — real separation science."},
        {"id": "apple-tasting-party",
         "note": "The harvest anchor: blind taste-test, vote, graph the results."},
        {"id": "teal-pumpkin-project",
         "note": "The allergy-aware must-do: teal pumpkin, non-food treat box, every kid included."},
        {"id": "trunk-or-treat-planning",
         "note": "The parking-lot alternative, planned by the kids themselves."},
        {"id": "reverse-trick-or-treat",
         "note": "Deliver treats instead of collecting them — the kindness flip."},
    ],
}

def main():
    path = os.path.join(DATA, 'activities.json')
    acts = json.load(open(path))
    have = {a['id'] for a in acts}
    new = [a for a in HALLOWEEN_PACK if a['id'] not in have]
    skipped = [a['id'] for a in HALLOWEEN_PACK if a['id'] in have]
    acts.extend(new)
    by_id = {a['id']: a for a in acts}
    retro = []
    for rid, tags in RETRO_HALLOWEEN.items():
        a = by_id.get(rid)
        if not a:
            print(f"WARN: retro id missing: {rid}", file=sys.stderr)
            continue
        old = a.get('tags') or []
        merged = old + [t for t in tags if t not in old]
        if merged != old:
            a['tags'] = merged
            retro.append(rid)
    json.dump(acts, open(path, 'w'), indent=1, ensure_ascii=False)
    open(path, 'a').write('\n')
    # Haunted Halls collection (11th)
    cpath = os.path.join(DATA, 'collections.json')
    cdata = json.load(open(cpath))
    cids = {c['id'] for c in cdata['collections']}
    if HAUNTED_HALLS['id'] in cids:
        print("collection haunted-halls already present — skipped")
    else:
        missing = [p['id'] for p in HAUNTED_HALLS['picks'] if p['id'] not in by_id]
        if missing:
            print(f"ERROR: collection picks missing: {missing}", file=sys.stderr)
            sys.exit(1)
        cdata['collections'].append(HAUNTED_HALLS)
        json.dump(cdata, open(cpath, 'w'), indent=1, ensure_ascii=False)
        open(cpath, 'a').write('\n')
        print("added collection haunted-halls")
    print(f"added {len(new)}, skipped {len(skipped)}: {skipped}")
    print(f"retro-tagged: {retro}")
    print(f"total {len(acts)}")

if __name__ == '__main__':
    main()
