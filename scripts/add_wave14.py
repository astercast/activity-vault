#!/usr/bin/env python3
"""Wave 14: append the Thanksgiving 2026 pack (18 activities).

Run once: dedupes by id, applies 5 retro-tags, writes data/activities.json.
Run scripts/build.py afterwards.

All original words per PIPELINE.md. Classic public-domain concepts
(handprint turkeys, cornucopias, turkey tag, cranberry building, jar-shaken
butter, food drives, thank-you cards, gratitude circles) described in
our own words.

Tag vocabulary: holiday:thanksgiving is NEW in this wave (added to the
validator in scripts/build.py, assets/app.js, data/v1/filters.json, the
schema enum, and the docs). season:fall already existed.

Retro-tags (tags only — descriptions untouched): gratitude-tree,
gratitude-journals, gratitude-door-decor, harvest-thanksgiving-skits,
harvest-gratitude-circle gain holiday:thanksgiving.

Skipped as near-duplicates of existing library items: corn-husk-dolls
(already in the library, seasons/crafts, season:fall) and a mini-pumpkin
catapult (easter-egg-catapult already covers the popsicle-stick catapult
mechanic) — replaced by the turkey-baster relay, which is original.

Inclusive framing: not every family celebrates Thanksgiving. The pack
notes alternatives (harvest feast naming, gratitude-all-year for everyone)
in the relevant activities and the hub. Safety notes are practical only —
allergy checks on food activities, dairy check on the butter shake, sealed
store-bought snacks for blessing bags, toss-toward-targets rules — no
medical claims anywhere.
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

T = ["holiday:thanksgiving"]
TF = ["season:fall", "holiday:thanksgiving"]
F = ["season:fall"]

THANKSGIVING_PACK = [
# ---------------- gratitude crafts (4) ----------------
A("thankful-turkey-handprints", "Thankful Turkey Handprints",
  "A handprint turkey with a feather for every thankful thought.",
  ["crafts", "holidays"], (4, 10), (2, 30), (25, 40), ["indoor"],
  ["brown construction paper", "colored paper", "scissors",
   "glue sticks", "markers", "googly eyes (optional)"],
  False,
  "Trace a hand template on brown paper — one body per kid. Cut colored "
  "paper into feather strips, about 8 inches long.",
  ["Trace your hand on brown paper and cut it out — the fingers are the "
   "turkey's tail feathers.",
   "Cut a round body and a smaller head from brown paper; glue the head "
   "on top.",
   "Add googly eyes or marker eyes, an orange triangle beak, and a red "
   "wattle.",
   "Write one thankful thought on each paper feather, then glue the "
   "feathers in a fan behind the body.",
   "Line the turkeys up on the wall — a whole flock of gratitude."],
  "Use a pre-traced hand and write the thankful thoughts for the youngest "
  "kids.",
  "Make the feathers 3D — fold each one down the middle — and write a "
  "whole paragraph of thanks on the back of the body.",
  "Scissors stay at the table; little kids get pre-cut bodies and feathers.",
  T),

A("paper-cornucopia-build", "Paper Cornucopia",
  "A rolled-paper horn of plenty, stuffed with a paper harvest.",
  ["crafts", "holidays", "seasons"], (6, 12), (2, 30), (30, 45), ["indoor"],
  ["large brown paper or grocery bags", "tape", "scissors",
   "colored paper", "crayons or markers"],
  False,
  "Cut brown paper into 18-inch squares. Set out colored paper for the "
  "fruit and vegetables.",
  ["Roll a paper square into a cone — overlap the edges and tape the seam. "
   "This is the horn.",
   "Curl the narrow end slightly to one side, the way a real cornucopia "
   "curves.",
   "Draw, color, and cut out paper apples, pumpkins, grapes, and corn — "
   "big and bold.",
   "Stuff the harvest into the wide end so it spills over the rim.",
   "Set the cornucopias down the center of the table as the feast "
   "centerpiece."],
  "Make mini horns from half-sheets and fill them with three paper fruits "
  "only.",
  "Weave thin paper strips over the cone in a basket pattern before "
  "stuffing it.",
  "Scissors stay at the table. Big cones get a tape ring on the seam so "
  "they hold their shape.",
  TF),

A("friendsgiving-place-cards", "Friendsgiving Place Cards",
  "Hand-drawn place cards with one reason each guest is loved.",
  ["crafts", "holidays"], (5, 12), (2, 30), (20, 30), ["indoor"],
  ["cardstock or index cards", "markers or crayons", "stickers (optional)"],
  False,
  "Fold cards in half so they stand like tents. Write every guest's name "
  "on a slip of paper for the draw.",
  ["Draw a name from the pile — that's the guest you're honoring.",
   "Write their name big on the front of the tent card.",
   "Inside, finish the sentence: 'I'm glad you're at this table because...'",
   "Decorate the card with their favorite things — ask around if you're "
   "not sure.",
   "Set the cards at the friendsgiving table before anyone sits down."],
  "Write the name and one word ('funny', 'kind') instead of a sentence.",
  "Add a tiny portrait of your guest on the back of the card.",
  None,
  T),

A("harvest-weave-placemats", "Harvest Weave Placemats",
  "Paper-strip weaving in harvest colors — the table sets itself.",
  ["crafts", "seasons"], (5, 12), (2, 30), (25, 40), ["indoor"],
  ["construction paper in harvest colors", "scissors", "glue sticks",
   "clear contact paper (optional)"],
  False,
  "Cut one sheet per kid into a 9x12 frame (leave the middle open) for "
  "the warp, and cut 1-inch strips in harvest colors for the weft.",
  ["Lay the frame flat — these are your straight-up-and-down strips.",
   "Weave a colored strip over, under, over, under across the frame.",
   "Push each strip snug against the last and keep going to the bottom.",
   "Glue the strip ends to the frame edges so nothing slides loose.",
   "Optional: cover both sides with clear contact paper so the placemat "
   "survives the feast."],
  "Use wide 2-inch strips — fewer weaves, same harvest look.",
  "Weave a pattern: two orange, one brown, repeating — or spell initials "
  "with strip colors.",
  "Scissors stay at the table; pre-cut strips for the youngest weavers.",
  F),

# ---------------- harvest games (3) ----------------
A("turkey-tag-chase", "Turkey Tag",
  "The farmers are coming — gobble, dodge, and don't get caught.",
  ["pe-movement", "outdoor"], (5, 12), (6, 30), (15, 25), ["outdoor"],
  ["pool noodles or flag belts (one per farmer)", "cones for boundaries"],
  False,
  "Set boundaries with cones. Pick 2 farmers to start; everyone else is a "
  "turkey. Farmers hold pool noodles; turkeys tuck nothing — just run.",
  ["Turkeys scatter inside the boundaries when you shout 'Gobble!'",
   "Farmers chase and tag turkeys with a gentle noodle tap.",
   "Tagged turkeys freeze and flap their wings until a free turkey "
   "high-fives them back in.",
   "After three minutes, switch farmers so everyone gets to chase.",
   "Last round: one farmer, and the turkeys who survive get to pick the "
   "next game."],
  "Play with walking only and shrink the boundaries for little legs.",
  "Add a safe 'barn' zone — turkeys inside are safe but can only stay "
  "five seconds.",
  "Noodle taps stay gentle and below the shoulders. Clear the field of "
  "holes and sticks first.",
  T),

A("pumpkin-bucket-toss", "Pumpkin Bucket Toss",
  "Toss mini pumpkins into harvest buckets from the line.",
  ["pe-movement", "outdoor"], (4, 12), (2, 30), (15, 25), ["outdoor"],
  ["mini pumpkins or orange beanbags (6 per team)", "buckets or baskets",
   "chalk or tape for the throw line"],
  False,
  "Set buckets 6 feet from the throw line for little kids, 10 for older "
  "ones. Split pumpkins evenly between teams.",
  ["Teams line up behind the throw line, pumpkins in hand.",
   "One at a time, toss a pumpkin toward your team's bucket.",
   "Count only the pumpkins that land IN the bucket — rim bounces don't "
   "count.",
   "Move the line back two feet every round the whole team scores.",
   "Winning team picks the harvest song for cleanup."],
  "Use big laundry baskets close up, and let little kids step over the "
  "line.",
  "Score it: far bucket 3 points, middle 2, near 1 — teams aim for the "
  "big total.",
  "Real mini pumpkins only — nothing heavy enough to hurt. Toss toward "
  "the buckets, never at people.",
  TF),

A("harvest-basket-relay", "Harvest Basket Relay",
  "Teams fill their harvest basket one armload at a time.",
  ["pe-movement", "team-community"], (5, 12), (8, 30), (15, 25),
  ["indoor", "outdoor"],
  ["one basket or box per team", "soft balls or beanbags as 'crops'",
   "cones for the turn-around point"],
  False,
  "Pile the 'crops' at the far cone. Give each team a basket at the "
  "start line.",
  ["First runner sprints to the pile and grabs ONE crop.",
   "Carry it back — no throwing the crop to a teammate.",
   "Drop it in the team basket and tag the next runner.",
   "Keep going until the pile is empty, then count the baskets.",
   "Fullest basket wins — then everybody helps carry the harvest inside."],
  "Walk instead of run, and let kids carry two crops at a time.",
  "Each runner must name something they're thankful for before they can "
  "grab a crop.",
  "Keep the running lanes separated so nobody collides at the pile.",
  TF),

# ---------------- thanksgiving STEM (3) ----------------
A("cranberry-toothpick-towers", "Cranberry Structures",
  "Toothpicks and cranberries: who builds the tallest harvest tower?",
  ["stem", "quiet-focus"], (6, 12), (2, 30), (25, 40), ["indoor"],
  ["fresh cranberries (about 30 per kid)", "round toothpicks",
   "rulers", "paper for sketching"],
  False,
  "Rinse the cranberries and pat dry — wet ones slide off the toothpicks. "
  "Hand out 30 cranberries and a pile of toothpicks per kid.",
  ["Sketch your tower first: triangles hold weight, squares wobble.",
   "Push a toothpick into a cranberry — that's your first joint.",
   "Build a triangle base, then stack triangles upward.",
   "Test as you go: does it stand on its own? Wobble means rebuild the "
   "base wider.",
   "Measure the finished towers — tallest freestanding tower wins the "
   "harvest crown."],
  "Build flat shapes on the table — stars, snowflakes, letters — instead "
  "of towers.",
  "Add a weight test: how many pennies can the top hold before it tips?",
  "Toothpicks are pointy — build on the table, never sword-fight. Check "
  "the class allergy list before using real cranberries; pom-poms build "
  "exactly the same.",
  T),

A("turkey-baster-relay", "Turkey Baster Relay",
  "Move the 'cranberries' with nothing but a turkey baster and air.",
  ["stem", "pe-movement", "team-community"], (6, 12), (8, 30),
  (20, 30), ["indoor", "outdoor"],
  ["turkey basters (one per team)", "red pom-poms as 'cranberries'",
   "bowls or buckets", "cones for start and finish lines"],
  False,
  "Set a bowl of pom-poms at the start line and an empty bucket at the "
  "finish line, about 10 feet apart, per team.",
  ["Squeeze the baster bulb, press the tip against a pom-pom, and let go "
   "— suction grabs it.",
   "Carry the pom-pom to the finish bucket without touching it with your "
   "hands.",
   "Drop it in, run the baster back, and hand it to the next runner.",
   "Dropped it? Pick it up with the baster only — fingers don't count.",
   "First team to move all their cranberries wins. Then talk: what made "
   "the grip work — air pressure pushing back in."],
  "Use big pom-poms and a short carry distance; let little kids use two "
  "hands on the baster.",
  "Blow-only round: no suction allowed — push the pom-pom across the "
  "table with baster air.",
  "Basters point at pom-poms, never at faces. Wash basters before and "
  "after if they were ever near real food.",
  T),

A("shake-jar-butter", "Shake-a-Jar Butter",
  "Cream, a jar, and ten minutes of shaking: that's butter.",
  ["stem", "team-community"], (5, 12), (2, 30), (20, 30), ["indoor"],
  ["small jars with tight lids (one per pair)", "heavy cream",
   "a pinch of salt (optional)", "crackers for tasting (optional)"],
  False,
  "Pour cream into each jar — fill only halfway. Screw the lids on tight. "
  "Check the class allergy list before you start.",
  ["Shake the jar hard — the cream sloshes, then thickens into whipped "
   "cream. Keep going.",
   "Keep shaking past the whipped stage: suddenly a yellow lump separates "
   "from thin liquid. That's butter and buttermilk.",
   "Pour off the liquid, add a pinch of salt, and give it five more "
   "shakes.",
   "Spread it on a cracker and taste the science — you made that.",
   "Talk it through: shaking smashed the fat droplets together until "
   "they stuck."],
  "One big jar for the whole group — everyone takes a 30-second shake "
  "turn.",
  "Run a race: salted jar vs. unsalted — does one turn to butter first?",
  "Dairy check first: kids with dairy allergies take the official timer "
  "role and observe the science — no tasting without an adult's say-so. "
  "Jars stay closed while shaking.",
  T),

# ---------------- friendsgiving (2) ----------------
A("friendsgiving-potluck-plan", "Friendsgiving Potluck Plan",
  "The class plans its own friendsgiving feast — sign-up sheet and all.",
  ["team-community", "holidays"], (7, 12), (4, 30), (30, 45), ["indoor"],
  ["big paper or whiteboard", "markers",
   "sign-up sheet printouts", "ingredient card blanks"],
  False,
  "Draw the feast table on the big paper: drinks, mains, sides, desserts. "
  "Some families say 'harvest feast' instead of 'friendsgiving' — both "
  "names are welcome here.",
  ["Brainstorm the menu together — every kid names one dish they'd love "
   "to see.",
   "Sort the dishes into drinks, mains, sides, and desserts on the table "
   "map.",
   "Families sign up for ONE dish each — nobody cooks the whole feast.",
   "Every signed-up dish gets an ingredient card: list everything in it.",
   "Assign jobs for the day: greeters, table setters, drink pourers, "
   "cleanup crew."],
  "Teacher picks a simple fixed menu (three dishes) and kids only do the "
  "sign-up and jobs.",
  "Kids cost out the feast: price each dish and build the shopping list "
  "on a budget.",
  "Check the class allergy list BEFORE the sign-up goes home — every "
  "dish needs its ingredient card, and keep one table nut-free.",
  T),

A("friendsgiving-story-circle", "Friendsgiving Story Circle",
  "Pair up, trade a favorite memory, introduce your partner's story.",
  ["icebreakers", "team-community"], (6, 12), (4, 30), (20, 30), ["indoor"],
  [],
  True,
  "No setup — just a circle of chairs and two minutes of quiet to think "
  "of a favorite memory with a friend.",
  ["Pair up with someone you don't know well.",
   "Each person tells their partner one favorite memory — two minutes "
   "each.",
   "Come back to the circle. Now INTRODUCE your partner and retell THEIR "
   "story.",
   "The partner gives a thumbs-up if the retelling got it right.",
   "Close: one word each about what makes a good friend."],
  "Skip the retelling — partners just share one thing they're thankful "
  "the other person taught them.",
  "Make it a story chain: each pair's memory has to connect to the last "
  "pair's somehow.",
  None,
  T),

# ---------------- gratitude practices (3) ----------------
A("gratitude-alphabet-circle", "Gratitude Alphabet Circle",
  "A to Z around the circle: one thankful word per letter.",
  ["icebreakers", "team-community"], (6, 12), (4, 30), (15, 25), ["indoor"],
  [],
  True,
  "No setup — circle up and pick who starts with A.",
  ["First kid says something they're thankful for that starts with A — "
   "'apples', 'Aunt May'.",
   "Next kid takes B, then C, all the way around.",
   "Stuck on a letter? The group gets ten seconds to shout suggestions.",
   "Letters like Q, X, and Z allow 'thankful for' plus any word — no "
   "shame in 'xylophones'.",
   "Finish at Z with a group cheer for the alphabet of thanks."],
  "Do it in teams — each team takes every other letter.",
  "Hard mode: no repeats from last week's circle, and X must be a real "
  "word.",
  None,
  T),

A("thankful-jar-shares", "Thankful Jar Shares",
  "Slips of gratitude in a jar, drawn and read aloud.",
  ["quiet-focus", "team-community"], (5, 12), (2, 30), (20, 30), ["indoor"],
  ["a jar or box", "slips of paper", "pencils"],
  False,
  "Set the jar where everyone can reach it all week — it fills up before "
  "the share day.",
  ["All week, kids drop in slips: 'I'm thankful for...' — names optional.",
   "On share day, circle up and shake the jar.",
   "Draw slips one at a time and read each aloud.",
   "After each one, the group guesses who wrote it — or the writer "
   "claims it.",
   "Save the week's slips in an envelope: the year's gratitude archive."],
  "Do it in one sitting — five minutes of writing, then read them all.",
  "Sort the slips into categories (people, places, things, moments) and "
  "graph which wins.",
  None,
  T),

A("gratitude-all-year", "Gratitude All Year",
  "A gratitude practice for everyone — no holiday required.",
  ["quiet-focus", "team-community"], (6, 12), (2, 30), (20, 30), ["indoor"],
  ["notebooks or stapled paper booklets", "pencils", "stickers (optional)"],
  False,
  "Give every kid a small booklet — this is their all-year gratitude "
  "log. Say it plainly: not every family celebrates Thanksgiving, and "
  "gratitude doesn't need a holiday.",
  ["Decorate the cover: 'My Gratitude Log' and your name.",
   "Write or draw three good things from TODAY — tiny counts: warm "
   "socks, a joke, lunch.",
   "Share one with a partner if you want to — sharing is optional, "
   "always.",
   "Set the rhythm: one page a week, every week, all year.",
   "Check back monthly: flip through and notice how the good things "
   "stack up."],
  "Draw instead of write — three pictures of good things per page.",
  "Add a monthly 'gratitude letter': write one real thank-you note to "
  "someone outside the program.",
  None,
  TF),

# ---------------- giving back (3) ----------------
A("food-drive-planning", "Food Drive Planning",
  "Kids plan the whole canned-food drive: goal, posters, collection crew.",
  ["team-community", "holidays"], (7, 12), (4, 30), (30, 45), ["indoor"],
  ["big paper", "markers", "empty boxes for collection bins",
   "tape for posters"],
  False,
  "Call the local food bank or pantry first (teacher job) to confirm "
  "what they accept and when to deliver.",
  ["Set the goal together: 100 cans? One can per kid per week?",
   "Make posters: what to bring, where the bins are, the deadline.",
   "Build the collection bins from boxes — decorate them loud.",
   "Assign the crew: bin monitors, counters, delivery team.",
   "Count day: tally everything, celebrate the total, deliver together."],
  "Run a one-day mini drive: goal of one bag per kid, counted the same "
  "afternoon.",
  "Kids write the thank-you notes to every family that donated.",
  "Cans only — no open or homemade food in the bins. Heavy boxes get "
  "carried by adults.",
  T),

A("staff-thank-you-cards", "Thank-You Cards for School Staff",
  "Cards for the custodians, cafeteria crew, and bus drivers — the holiday heroes.",
  ["crafts", "team-community"], (5, 12), (2, 30), (25, 35), ["indoor"],
  ["cardstock", "markers, crayons", "stickers", "envelopes (optional)"],
  False,
  "List the staff the kids actually see: custodians, cafeteria crew, bus "
  "drivers, office staff, crossing guards.",
  ["Each kid picks one staff member — no doubles until everyone is "
   "covered.",
   "Write what that person DOES that helps you: 'You keep our halls "
   "clean.'",
   "Add a drawing of them doing that job — capes optional.",
   "Sign every card from the whole class.",
   "Deliver them in person as a group — the delivery is the best part."],
  "Make one giant class card per staff member instead of individual ones.",
  "Kids interview their staff member first: 'What's the hardest part of "
  "your day?' — then write the card.",
  None,
  T),

A("blessing-bag-pack", "Blessings Bags",
  "Pack snack-and-supply bags for neighbors who need them.",
  ["team-community"], (6, 12), (4, 30), (30, 45), ["indoor"],
  ["paper lunch bags", "sealed store-bought snacks (granola bars, fruit cups)",
   "socks, hand warmers, or travel toiletries", "markers for decorating"],
  False,
  "Confirm the drop-off spot first (teacher job): a shelter, pantry, or "
  "community fridge. Buy sealed snacks only.",
  ["Decorate each bag with markers — bright and kind.",
   "Assembly line: one snack, one drink box, one pair of socks, one "
   "toiletry per bag.",
   "Tuck in a handwritten note: 'Someone in your neighborhood packed "
   "this for you.'",
   "Count and stack the finished bags.",
   "Deliver together to the drop-off spot the same week."],
  "Pack two bags as a whole group — one bag, everybody adds one item.",
  "Kids plan the next round: what would YOU want in a bag on a cold "
  "night?",
  "Sealed store-bought snacks only — nothing homemade or opened. Check "
  "snack labels against the class allergy list if any bags stay in the "
  "room.",
  T),
]

RETRO_TAGS = {
    "gratitude-tree": ["holiday:thanksgiving"],
    "gratitude-journals": ["holiday:thanksgiving"],
    "gratitude-door-decor": ["season:fall", "holiday:thanksgiving"],
    "harvest-thanksgiving-skits": ["holiday:thanksgiving"],
    "harvest-gratitude-circle": ["season:fall", "holiday:thanksgiving"],
}

def main():
    acts = json.load(open(os.path.join(DATA, 'activities.json')))
    by_id = {a['id']: a for a in acts}
    new_ids = [a['id'] for a in THANKSGIVING_PACK]
    assert len(new_ids) == 18, f"expected 18, got {len(new_ids)}"
    assert len(set(new_ids)) == 18, "duplicate ids inside the pack"
    clashes = [i for i in new_ids if i in by_id]
    if clashes:
        print("ID CLASHES:", clashes); sys.exit(1)
    acts.extend(THANKSGIVING_PACK)
    for rid, tags in RETRO_TAGS.items():
        assert rid in by_id, f"retro-tag target missing: {rid}"
        by_id[rid]['tags'] = tags
    json.dump(acts, open(os.path.join(DATA, 'activities.json'), 'w'),
              indent=1, ensure_ascii=False)
    print(f"WROTE {os.path.join(DATA, 'activities.json')} — "
          f"{len(acts)} activities ({len(new_ids)} new), {len(RETRO_TAGS)} retro-tagged.")

if __name__ == '__main__':
    main()
