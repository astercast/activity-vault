#!/usr/bin/env python3
"""Wave 6: append the winter seasonal pack (24 activities).

Run once: dedupes by id, writes data/activities.json.
Run scripts/build.py afterwards.

Includes the deferred RSS item "Homemade Christmas Ornaments for Kids to Make"
(Hands On As We Grow) adapted into original words with source credit.
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

W = ["season:winter"]
WC = ["season:winter", "holiday:christmas"]
WN = ["season:winter", "holiday:new-year"]
WH = ["season:winter", "holiday:hanukkah"]
WK = ["season:winter", "holiday:kwanzaa"]

WINTER_PACK = [
A("homemade-christmas-ornaments", "Homemade Christmas Ornaments",
  "Classic kid-made ornaments — keep some for your tree, gift the rest.",
  ["crafts", "holidays"], (4, 12), (2, 30), (20, 45), ["indoor"],
  ["clear plastic ornament balls or cardstock circles (one per kid)",
   "glitter, sequins, and stickers", "paint pens or markers", "ribbon or yarn"],
  False,
  "Set up a decorating station with one ornament blank per kid and the decorations "
  "in shared bowls. Loop a ribbon hanger through each ornament first.",
  ["Each kid picks an ornament blank and decorates it any way they like — glitter, "
   "stickers, painted dots, initials.",
   "Let paint dry flat on a tray so it doesn't smudge.",
   "Tie on the ribbon hanger and do a 'gallery walk' of everyone's tree.",
   "Kids wrap one ornament to gift to someone and keep one for the classroom or "
   "family tree."],
  "Pre-fill ornament balls with glitter so the littlest ones just shake and admire.",
  "Try salt-dough cutouts (baked ahead) as the ornament base for a two-day project.",
  "Glitter travels — cover the table and keep it out of eyes and mouths.",
  WC,
  "https://handsonaswegrow.com/homemade-christmas-ornaments-kids/"),

A("snowflake-paper-patterns", "Snowflake Paper Patterns",
  "Fold, snip, unfold — the six-fold surprise that never gets old.",
  ["crafts"], (6, 12), (2, 30), (15, 30), ["indoor"],
  ["white printer paper or coffee filters (3 per kid)", "scissors"],
  True,
  "Cut the paper into circles (or use coffee filters — they're already round and easy to fold).",
  ["Fold each circle in half, then into thirds, so you get a six-fold wedge.",
   "Snip triangles and curves out of the folded edges — not too close to the fold line.",
   "Unfold and gasp. Hang the snowflakes on string across the windows.",
   "Optional: tape two kids' snowflakes together back-to-back and notice no two match."],
  "Pre-fold the wedges so little ones just cut the easy outer edges.",
  "Challenge: try one cut too many and see what happens — then repair it with tape.",
  "Scissors supervision; remind kids to cut away from fingers.",
  W),

A("suet-cage-winter-feeder", "Suet Cage Winter Feeder",
  "Pack a wire suet cage with winter bird food — a high-energy feast for cold days.",
  ["crafts", "outdoor"], (6, 12), (2, 30), (15, 25), ["indoor", "outdoor"],
  ["wire suet cages (one per small group)", "solid vegetable shortening",
   "oats, cornmeal, and birdseed", "mixing bowls and spoons", "string"],
  False,
  "Set out bowls of shortening and dry ingredients. Put one suet cage and a length "
  "of string in front of each group.",
  ["Mix two parts dry ingredients with one part softened shortening into a crumbly dough.",
   "Pack the dough firmly into the suet cage — press it into every corner.",
   "Thread string through the cage top and tie a strong hanger loop.",
   "Hang the cages where birds can reach them but cats can't, and keep a visitor log."],
  "Teacher mixes and packs; kids press the dough in with spoons.",
  "Make two cages with different mixes (more oats vs. more seed) and compare visitors.",
  "Shortening only — no peanut butter unless allergies are cleared. Wash hands after.",
  W),

A("ice-ornaments", "Ice Ornaments",
  "Freeze water, leaves, and berries into hanging winter sun-catchers.",
  ["stem", "crafts"], (5, 12), (2, 30), (15, 30), ["indoor", "outdoor"],
  ["muffin tins or silicone molds", "water", "natural bits: leaves, berries, pine sprigs",
   "string or yarn", "a freezer"],
  False,
  "Lay out molds, a pitcher of water, and the natural bits. Cut string loops "
  "about 20 cm long, one per mold.",
  ["Lay a string loop into each mold with the loop end hanging over the edge.",
   "Arrange leaves, berries, and sprigs in the molds — flat is prettiest.",
   "Fill each mold with water and set in the freezer overnight.",
   "Pop the ornaments out and hang them outside. Watch what happens as they melt."],
  "Teacher fills the molds; kids just arrange the nature bits.",
  "Test variables: which ornaments melt fastest — sunny fence vs. shady porch?",
  "No tasting the 'ingredients'; melt water goes on the garden, not in mouths.",
  W),

A("hanukkah-counting-chain", "Hanukkah Counting Chain",
  "A paper chain of eight links plus a leader — a craft for learning how "
  "Hanukkah counts its eight nights.",
  ["crafts", "holidays"], (6, 12), (2, 30), (20, 30), ["indoor"],
  ["blue and white paper strips", "glue sticks or tape", "a marker"],
  False,
  "Cut paper into strips (about 3 × 20 cm), eight of one color and one of another "
  "for the leader link. Frame the activity as learning about a holiday other "
  "families celebrate — this is a counting craft, not a ceremony.",
  ["Chain the eight links together, one for each night of Hanukkah.",
   "Add the leader link at the front of the chain.",
   "On each link, write something the group has learned about the holiday.",
   "Hang the chain and add one fact per day as a class countdown."],
  "Teacher assembles the chain; kids decorate the links with drawings.",
  "Research one more true fact per night from a reliable source and add it.",
  "Cultural note: this craft is for learning about Hanukkah, not performing it. "
  "Treat the holiday with respect — ask, don't assume, about anyone's traditions.",
  WH),

A("kwanzaa-unity-garland", "Kwanzaa Unity Garland",
  "A red, black, and green garland made while learning about Kwanzaa's seven "
  "principles — a values craft, not a ceremony.",
  ["crafts", "holidays"], (7, 12), (2, 30), (20, 35), ["indoor"],
  ["red, black, and green construction paper", "scissors", "glue sticks or tape",
   "markers"],
  False,
  "Cut paper into strips. Frame the activity as learning about Kwanzaa — a week-long "
  "celebration of family, community, and culture — and its seven principles "
  "(the Nguzo Saba). This is a classroom craft about its values, not a ceremony.",
  ["Cut strips of red, black, and green paper.",
   "On each strip, write one of the seven principles (unity, self-determination, "
   "collective work, cooperative economics, purpose, creativity, faith).",
   "Link the strips into a garland, alternating the three colors.",
   "Read the garland together and discuss: what does each principle look like "
   "in our classroom?"],
  "Use fewer strips (three colors, one word each: unity, creativity, faith).",
  "Research what each principle means in practice and add an example to each strip.",
  "Cultural note: this craft is for learning about Kwanzaa, not performing it. "
  "Present it as a values celebration some families observe; keep the tone respectful.",
  WK),

A("snowball-toss-math", "Snowball Toss Math",
  "Toss indoor snowballs into point buckets — arithmetic with your whole body.",
  ["pe-movement", "stem"], (6, 12), (4, 40), (15, 30), ["indoor"],
  ["soft indoor snowballs (crumpled paper or yarn balls, 2 per kid)",
   "buckets or boxes labeled 1, 5, 10, 25"],
  True,
  "Line up the point buckets along one wall, a few feet from the throw line. Give "
  "every kid two snowballs. Post a score chart.",
  ["Each kid throws both snowballs into the buckets and adds their points.",
   "After everyone has thrown, kids compute their running totals.",
   "Round two: teams throw and pool their points — first team to 100 wins.",
   "Close with the 'blizzard round': everyone throws at once, then the class "
   "sorts and counts every bucket together."],
  "Use buckets labeled 1 and 2 only; count together on fingers.",
  "Add a multiplier bucket: a snowball in the star bucket doubles your round.",
  "Throw underhand only, and only toward the buckets — no aiming at people.",
  W),

A("animal-walk-relay", "Animal Walk Relay",
  "Waddle like a penguin, stomp like a polar bear — a relay across the gym floor.",
  ["pe-movement"], (4, 12), (6, 40), (10, 20), ["indoor"],
  ["cones or tape to mark the relay line"],
  True,
  "Split the group into equal teams behind the start line. Name three winter animal "
  "walks and demo each one.",
  ["Leg 1: penguin waddle (heels together, arms at sides, wobble to the cone and back).",
   "Leg 2: polar-bear prowl (bear crawl — hands and feet, knees off the floor).",
   "Leg 3: arctic-hare hop (two-footed hops all the way).",
   "Leg 4: snowy-owl swoop (arms out, slow flapping glide). First team sitting "
   "in a line when their last runner returns wins."],
  "One animal walk per round instead of four legs; everyone does the same one.",
  "Add a 'blizzard obstacle': teammates crawl under a held-up blanket halfway.",
  "Clear the floor of anything slippery first; no running full speed on tile.",
  W),

A("freeze-dance-winter", "Winter Freeze Dance",
  "Freeze dance with a twist: when the music stops, the caller shouts a winter animal.",
  ["music-rhythm", "pe-movement"], (4, 12), (4, 40), (10, 20), ["indoor"],
  ["music to play and pause"],
  True,
  "You need nothing but music and space to move. Assign a caller (rotate the job).",
  ["Everyone dances while the music plays.",
   "Music stops — everyone freezes, and the caller shouts a winter animal: "
   "'penguin!', 'polar bear!', 'snowy owl!'",
   "Everyone holds the pose of that animal until the music restarts.",
   "Rotate callers every few rounds; the silliest-held pose wins applause."],
  "Caller gives extra time to find the pose; no one sits out for a wrong guess.",
  "Add 'migrating goose': kids link up in a V and glide to a new spot in the room.",
  "Keep dance space clear of furniture corners; freeze means stop, not crash.",
  W),

A("year-in-review-quilt", "Year-in-Review Quilt",
  "Every kid decorates one paper square with their year's highlight — together "
  "they become a class quilt.",
  ["team-community", "quiet-focus"], (5, 12), (2, 40), (25, 45), ["indoor"],
  ["paper squares (one per kid, same size)", "crayons, markers, and collage scraps",
   "glue sticks", "a large backing sheet or bulletin board"],
  False,
  "Cut identical paper squares (about 20 cm). Set out art supplies in shared caddies "
  "and lay the backing sheet flat.",
  ["Each kid fills one square with their year's highlight — a drawing, a word, a "
   "photo corner, a tiny collage.",
   "Kids share their square with the table and explain what it means.",
   "Assemble the squares edge-to-edge on the backing sheet, alternating light "
   "and dark colors for a real quilt feel.",
   "Hang the quilt where families can see it at the New Year event or open house."],
  "Draw the highlight; teacher writes the caption the child dictates.",
  "Leave one blank square per kid to fill in June — the quilt grows all year.",
  "Highlights are self-chosen — nobody has to explain anything they'd rather keep private.",
  WN),

A("resolution-ladder", "Resolution Ladder",
  "New Year goals as a ladder — one small, doable rung per month.",
  ["quiet-focus", "team-community"], (7, 12), (2, 40), (15, 30), ["indoor"],
  ["paper strips (12 per kid)", "a large ladder drawn on butcher paper",
   "markers", "tape"],
  True,
  "Draw a big ladder on butcher paper with 12 rungs. Give each kid 12 strips.",
  ["Each kid writes one small, doable goal on each strip — one per month.",
   "Goals must be concrete: 'read 10 minutes daily' beats 'read more'.",
   "Tape the strips onto the rungs, grouped by month, and hang the ladder up.",
   "Revisit monthly: flip over the rungs you hit and set the next month's."],
  "Do 4 seasons instead of 12 months; draw the goal instead of writing it.",
  "Add a 'stretch rung' at the top: one big dream goal for the whole year.",
  "Goals are private to share — kids post only what they want to post.",
  WN),

A("midnight-countdown-rehearsal", "Midnight Countdown Rehearsal",
  "A practice New Year's Eve: chant the 10-to-0 countdown and cheer in a "
  "brand-new pretend year.",
  ["icebreakers", "team-community"], (4, 12), (4, 40), (10, 20), ["indoor"],
  [],
  True,
  "No setup needed. This works great as the last 15 minutes before a winter "
  "break dismissal.",
  ["Everyone stands in a circle. The leader announces what 'year' we're cheering in.",
   "Count down from 10 together, getting louder each number.",
   "At zero: cheer, clap, and do a group jump — the new 'year' has arrived.",
   "Go around the circle: each kid names one thing they're glad happened this year.",
   "Optional finale: countdown in a whisper, then a tiny silent cheer."],
  "Count down from 5 instead of 10; skip the go-around for big groups.",
  "Let kids run the countdown in another language the class is learning.",
  "Mind the volume if another class is next door — schedule accordingly.",
  WN),

A("track-prints-detective", "Track Prints Detective",
  "Find animal prints in snow or mud, match them to a chart, solve the mystery.",
  ["outdoor"], (5, 12), (2, 30), (20, 40), ["outdoor"],
  ["a printed animal-track ID chart", "a camera or phone for photos",
   "a notebook"],
  True,
  "After fresh snow or rain, scout a route with visible prints. Print one track "
  "chart per pair.",
  ["Walk the route quietly and look for prints — snow and mud both work.",
   "Photograph each set of prints and note where you found them.",
   "Match them against the ID chart: how many toes, claw marks or not, size?",
   "Log the 'case file': what animal, how many, which direction, and the evidence "
   "that convinced you."],
  "Teacher pre-prints photo cards of three local tracks; kids match at the site.",
  "Measure stride length between prints and estimate the animal's speed.",
  "Stay on paths; don't follow prints into streets or private yards.",
  W),

A("frost-observation", "Frost Observation",
  "Magnify the ice crystals on windows and leaves and sketch their patterns.",
  ["stem", "outdoor"], (6, 12), (2, 30), (15, 30), ["indoor", "outdoor"],
  ["magnifying glasses (one per pair)", "paper and pencils", "a thermometer (optional)"],
  True,
  "On a frosty morning, find windows, car hoods (with the owner's okay), or leaves "
  "with visible frost. Hand out magnifiers and sketch paper.",
  ["Look at the frost through the magnifier — find the six-pointed crystals.",
   "Sketch three different crystals you actually see, not what you imagine.",
   "Compare sketches: does everyone's frost look the same? Different?",
   "Discuss: what did the night have to be like for this frost to form?"],
  "One shared magnifier, teacher narrates; kids draw one big crystal together.",
  "Check the overnight low online and connect it to how feathery the frost is.",
  "Don't lick frosty metal, and don't touch anyone's car without permission.",
  W),

A("bark-and-branch-study", "Bark and Branch Study",
  "Identify winter trees with no leaves — bark patterns and buds are the clues.",
  ["outdoor"], (7, 12), (2, 30), (25, 45), ["outdoor"],
  ["a winter tree ID key (printed or one shared book)", "paper and crayons for bark rubbings"],
  True,
  "Pick a park or schoolyard with a few different trees. Print one ID key per pair.",
  ["Do bark rubbings: press paper against the trunk, rub sideways with a crayon.",
   "Study the buds at branch tips with the ID key — shape, size, arrangement.",
   "Match each tree to the key and label your rubbings with the tree's name.",
   "Back inside: line up the rubbings and see if the class agrees on each ID."],
  "Focus on just two trees; teacher does the ID, kids do the rubbings.",
  "Keep a winter tree log through the season and watch the buds swell in spring.",
  "Don't pull bark off trees or break branches — rubbings only.",
  W),

A("dissolving-warm-drink-lab", "Dissolving Warm-Drink Lab",
  "Hot cocoa science: does powder dissolve faster in hot water or cold?",
  ["stem"], (6, 12), (2, 30), (20, 35), ["indoor"],
  ["cocoa mix", "sugar cubes", "clear cups", "warm and cold water",
   "spoons", "a stopwatch or timer"],
  False,
  "Set up two stations: warm water and cold water. Give each pair two clear cups, "
  "one spoon of cocoa mix, and a sugar cube.",
  ["Predict: which cup dissolves the cocoa faster — warm or cold? Write it down.",
   "Add the cocoa to both cups at the same time. Time how long each takes to "
   "fully dissolve with the same stirring.",
   "Repeat with the sugar cubes — but this time, one cup stirred, one not.",
   "Chart the class results. Discuss: why did the warm water win?"],
  "Teacher runs the demo up front; kids just predict and watch.",
  "Try milk vs. water, or test whether crushed vs. whole sugar cube matters.",
  "Water should be warm, not hot — an adult handles the kettle. Check for "
  "dairy allergies if tasting.",
  W),

A("temperature-melt-race", "Temperature Melt Race",
  "Three cups of water, three ice cubes — predict which melts first, then watch.",
  ["stem"], (5, 12), (2, 30), (15, 25), ["indoor"],
  ["ice cubes (3 per pair)", "clear cups", "warm, room-temperature, and cold water",
   "timers"],
  False,
  "Set out the three water temperatures labeled A, B, C (don't reveal which is "
  "which yet). Give each pair three cups and three ice cubes.",
  ["Each pair predicts the melt order and writes it down — no changing it.",
   "Drop one ice cube in each cup at the same time and start the timer.",
   "Record the exact melt time for each cube.",
   "Reveal the temperatures. Who predicted right? Discuss what heat does to ice."],
  "Run it as a teacher demo; kids predict by holding up fingers (1, 2, 3).",
  "Add a fourth cup with salt in the ice water — does salt change the melt?",
  "An adult pours the warm water. Dry spills immediately so nobody slips.",
  W),

# ---- Sub Tub winter band: zero-prep, zero-material winter emergencies ----
A("snowflake-mirror", "Snowflake Mirror",
  "Pairs mirror each other's snowflake arm poses — then try to catch the change.",
  ["team-community", "pe-movement"], (4, 9), (4, 40), (10, 20), ["indoor"],
  [],
  True,
  "No setup at all. Pair the kids up, facing each other, arms' length apart.",
  ["One partner is the 'snowflake', the other is the 'mirror'.",
   "The snowflake slowly moves arms and body into a new pose; the mirror copies "
   "in real time.",
   "After a minute, swap roles.",
   "Round two: the mirror has to spot three deliberate changes the snowflake sneaks in.",
   "Close: each pair shows their best snowflake pose to the group."],
  "Whole group mirrors the teacher instead of pairing up.",
  "Three-person teams: one caller shouts pose words ('branch!', 'crystal!').",
  None,
  W),

A("winter-tall-tale", "Winter Tall Tale",
  "A circle story where every kid adds one wild winter sentence.",
  ["team-community", "icebreakers"], (4, 12), (4, 40), (10, 20), ["indoor"],
  [],
  True,
  "Nothing needed — just a circle. The teacher starts the story with one sentence.",
  ["Teacher: 'On the coldest morning of the year, I opened my door and saw...'",
   "Each kid adds exactly one sentence, building on the last one.",
   "Encourage wild but connected additions — the yeti borrowed the bus, "
   "the snow spoke back.",
   "After one full circle, the teacher closes the tale in three sentences.",
   "Optional: vote on the best sentence and start a new tale with it."],
  "Kids can pass, or just add a sound effect instead of a sentence.",
  "Two circles compete for the best ending, then swap and judge.",
  None,
  W),

A("warm-up-countdown", "Warm-Up Countdown",
  "Call-and-response counting with jumping jacks — math that warms the room.",
  ["icebreakers", "pe-movement"], (5, 12), (4, 40), (10, 15), ["indoor"],
  [],
  True,
  "Push desks back so everyone has arm room. Teacher leads the first round.",
  ["Teacher calls a number and a move: 'Ten jumping jacks — go!' The group counts "
   "aloud together while doing it.",
   "Rotate the caller: each kid picks the next number and move (high knees, "
   "arm circles, toe touches).",
   "Add math: 'Seven minus two jumping jacks — how many?' Solve, then do them.",
   "Final round: count down from 20 to 1 together, getting quieter each number, "
   "ending seated."],
  "Just counting with claps, no big moves; teacher picks every number.",
  "Add multiplication: 'Three sets of four arm circles — how many total?'",
  "Moves stay low-impact near furniture; anyone can march in place instead.",
  W),

A("paper-mitten-match", "Paper Mitten Match",
  "Decorate mitten pairs, mix them up, and play memory across the room.",
  ["crafts", "rainy-day"], (4, 10), (2, 24), (15, 25), ["indoor"],
  ["paper mitten cutouts (2 per kid)", "crayons and markers", "a paper bag"],
  False,
  "Cut out pairs of paper mittens ahead of time (trace one hand shape and flip it). "
  "Give each kid two matching mittens.",
  ["Each kid decorates their two mittens identically — same pattern, same colors.",
   "Collect one mitten from every kid into the paper bag and hide the other halves.",
   "Scatter the hidden mittens face-down on the rug; kids draw a mitten from the bag.",
   "One at a time, each kid flips a rug mitten trying to find their pair's match. "
   "Matched pairs hang on the 'clothesline' to dry."],
  "Teacher matches for them: hold up two mittens, 'same or different?'",
  "Three-mitten sets: decorate a trio and match all three.",
  "No running while searching — walk to the rug.",
  W),

A("winter-wreath-collage", "Winter Wreath Collage",
  "A paper-plate wreath layered with cut-paper greens — a winter door classic.",
  ["crafts"], (5, 12), (2, 30), (20, 30), ["indoor"],
  ["paper plates (one per kid)", "green construction paper",
   "scissors", "glue sticks", "ribbon"],
  False,
  "Cut the centers out of the paper plates ahead of time so they're rings. Put "
  "green paper scraps in shared bowls.",
  ["Glue torn or cut green paper pieces all around the ring, overlapping like leaves.",
   "Add red paper berries (tiny circles) and a ribbon bow at the top.",
   "Write the child's name and the year on the back.",
   "Hang the wreaths on the classroom door for the season."],
  "Teacher pre-cuts leaf shapes; kids just glue them around the ring.",
  "Weave in real pressed leaves between the paper layers for texture.",
  "Scissors supervision; glue sticks, not bottles, for the little ones.",
  WC),

A("cotton-ball-penguin", "Cotton-Ball Penguin",
  "A fluffy cotton-ball penguin puppet with real googly attitude.",
  ["crafts"], (4, 10), (2, 30), (15, 25), ["indoor"],
  ["black and white paper ovals (one set per kid)", "cotton balls",
   "glue", "googly eyes", "orange paper beaks"],
  False,
  "Pre-cut the black body ovals and white belly ovals. Put cotton balls, eyes, "
  "and beaks in shared bowls.",
  ["Glue the white belly oval onto the black body oval.",
   "Glue cotton balls all around the edge for a fluffy outline.",
   "Add googly eyes and the orange beak.",
   "Give your penguin a name and introduce it to a neighbor's penguin."],
  "Teacher glues the body together; kids stick on cotton balls and eyes.",
  "Add flippers (small black paper wings) and a paper ice floe to stand on.",
  "Googly eyes are small — keep them out of mouths; supervision for under-5s.",
  W),

A("arctic-animal-research-jigsaw", "Arctic Animal Research Jigsaw",
  "Small expert teams research one arctic animal each, then teach the class.",
  ["team-community", "stem"], (8, 12), (4, 40), (30, 45), ["indoor"],
  ["arctic animal fact sheets (one animal per team: polar bear, arctic fox, "
   "snowy owl, narwhal, penguin, seal)", "poster paper", "markers"],
  False,
  "Prepare one simple fact sheet per animal (diet, habitat, one superpower "
  "adaptation). Split the class into expert teams of 3–4.",
  ["Each team studies its animal's sheet and picks the three coolest facts.",
   "Teams make a poster: drawing, the three facts, and one question for the class.",
   "New mixed groups form with one expert from each animal — each expert teaches "
   "their animal in two minutes.",
   "Back together: the class votes on the most surprising adaptation learned."],
  "Teacher reads the fact sheet aloud; teams draw the animal and dictate one fact.",
  "Add a 'myth vs. fact' round: teams invent one plausible-sounding fake fact and "
  "the class guesses which is fake.",
  None,
  W),

A("gingerbread-shape-build", "Gingerbread Shape Build",
  "Engineer the tallest tower you can from graham crackers and icing 'mortar'.",
  ["stem", "crafts"], (6, 12), (4, 30), (25, 40), ["indoor"],
  ["graham crackers", "thick icing in squeeze bottles", "paper plates",
   "candy for decoration (optional)"],
  False,
  "Give each pair a plate, a stack of graham crackers, and a squeeze bottle of "
  "icing. Set a 20-minute build timer.",
  ["Plan first: sketch the tower on the plate's edge before touching food.",
   "Build with icing as mortar — let each layer set a minute before adding more.",
   "Measure the finished tower; the tallest standing tower wins.",
   "Decorate, photograph, and then — the best part — eat the engineering."],
  "Build flat houses (walls only) instead of tall towers.",
  "Test shapes: which holds more weight, a cube tower or a pyramid?",
  "Check for wheat, dairy, and egg allergies before anyone eats. Icing is sticky — "
  "wash hands and wipe tables after.",
  WC),
]

def main():
    acts = json.load(open(os.path.join(DATA, 'activities.json')))
    seen = {a['id'] for a in acts}
    dupes = [a['id'] for a in WINTER_PACK if a['id'] in seen]
    if dupes:
        print("DUPLICATE IDS:", dupes, file=sys.stderr)
        sys.exit(1)
    acts.extend(WINTER_PACK)
    json.dump(acts, open(os.path.join(DATA, 'activities.json'), 'w'),
              indent=1, ensure_ascii=False)
    open(os.path.join(DATA, 'activities.json'), 'a').write('\n')
    print(f"added {len(WINTER_PACK)} activities; total {len(acts)}")

if __name__ == '__main__':
    main()
