#!/usr/bin/env python3
"""Wave 22: the Winter Holidays pack (30 activities) + gap fills (12) + the
Winter Lights collection (14th collection).

The user caught it plainly: Halloween and Thanksgiving tabs, no winter
holidays section — "like what thats weird." This fixes it: Christmas,
Hanukkah, Kwanzaa, New Year's, and winter break, all at the archive's
quality bar.

Run once: dedupes by id, writes data/activities.json and data/collections.json.
Run scripts/build.py afterwards.

All original words per PIPELINE.md. Classic public-domain concepts
(paper stars, dreidel physics, kente weaving, countdown math, snowflake
symmetry, ice excavations) described in our own words. Near-duplicate
screen against the full 455-activity library:
- dreidel-spin-math EXISTS (arithmetic) -> dreidel-spin-physics kept: spin
  duration vs surface friction is a different mechanic and different science
- kwanzaa-unity-garland EXISTS (paper chain) -> ujima-unity-mural kept:
  collaborative mural, different format and purpose
- kwanzaa-principle-cards EXISTS -> renamed seven-principles-talk-tokens:
  discussion tokens, different format
- hanukkah-counting-chain EXISTS (counting) -> hanukkah-story-circle kept:
  storytelling circle, different format
- homemade-christmas-ornaments EXISTS (general) -> ornament-geometry-stars
  kept: 5-point geometry stars, specific technique
- winter-gingerbread-build EXISTS -> gumdrop-bridge-build: gumdrop +
  toothpick bridge engineering, different build
- paper-chain-countdown EXISTS -> advent-kindness-envelopes: kindness notes
  in envelopes, different mechanic
- midnight-countdown-rehearsal EXISTS -> countdown-number-line-hop: movement
  math on a floor number line, different
- new-year-time-capsule EXISTS -> resolution-seed-packets: plantable seed
  resolutions, different
- paper-snowflakes / snowflake-paper-patterns EXIST (cutting) ->
  snowflake-symmetry-lab kept: observation + symmetry identification, no
  cutting, different activity
- solstice-lantern-stroll EXISTS (evening walk) -> winter-solstice-shadow-track
  kept: daytime shadow tracking, different science
Tags (all already in the validator vocabulary): holiday:christmas,
holiday:hanukkah, holiday:kwanzaa, holiday:new-year, season:winter.
Safety notes are practical only (allergy checks on every food activity,
no shared food, choking-hazard notes, ice/cold handling) - no medical
claims anywhere. Hanukkah and Kwanzaa activities use respectful learning
framing: real traditions, no invented rituals (per the wave-20 marigold
precedent for Dia de los Muertos).

Gap fills (completeness audit 2026-10-12): music-rhythm was the smallest
category (17), rainy-day thin (17), age 3 nearly uncovered (4 activities).
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

C = ["holiday:christmas", "season:winter"]
H = ["holiday:hanukkah", "season:winter"]
K = ["holiday:kwanzaa", "season:winter"]
N = ["holiday:new-year", "season:winter"]
W = ["season:winter"]

PACK = [
# ---------------- Christmas (8) ----------------
A("ornament-geometry-stars", "Ornament Geometry Stars",
  "Fold perfect five-point stars from paper strips — geometry you can hang on a tree.",
  ["crafts"], (6, 12), (2, 30), (20, 40), ["indoor"],
  ["paper strips (2cm x 30cm)", "glue sticks", "string"],
  False, "Cut paper into 2cm-wide strips, one per kid plus a few spares. Put glue sticks in the middle of each table.",
  ["Show the group the finished star first — one strip becomes five points, no cutting.",
   "Fold the strip into a loose pentagon: five equal folds, creasing firmly each time.",
   "Tuck the last fold through the first to close the ring, then pinch each of the five edges outward to pop the points.",
   "Thread a short string through one point and knot it for hanging.",
   "Gallery walk: line the stars up and spot which folds came out most even."],
  "Pre-fold the first pentagon so kids copy the pinching step only.",
  "Try seven-point stars (heptagons) or weave two strips for a double star.",
  safety="Paper strips only — no scissors needed, which is the point.",
  tags=C, copy_free=True),

A("jingle-bell-rhythm-band", "Jingle Bell Rhythm Band",
  "Wristfuls of jingle bells + a call-and-response beat — the loudest quiet-focus breaker there is.",
  ["music-rhythm"], (4, 10), (4, 30), (10, 25), ["indoor"],
  ["jingle bells", "pipe cleaners or elastic cord", "a drum or box to keep time"],
  False, "Thread 3-4 bells onto a pipe cleaner per kid and twist into a bracelet. Keep one drum (or overturned box) for yourself.",
  ["Everyone shakes their bells freely for 30 seconds — get the wiggles' worth out first.",
   "Teach the core pattern: shake-shake-PAUSE-shake. You drum it, they echo it back.",
   "Split the room: half keeps the pattern, half improvises an answer on the pause.",
   "Build a 4-bar piece: pattern twice, answers twice, everyone together on the last bar.",
   "Final performance for the hallway — one take, no stopping."],
  "Skip the split; whole group echoes you in unison.",
  "Add foot stomps as the bass line, or notate the pattern with symbols on the board.",
  safety="Bells are a choking hazard for under-3s — this one starts at 4 for a reason.",
  tags=C),

A("christmas-light-circuit-cards", "Christmas Light Circuit Cards",
  "Paper circuits that actually light up — a greeting card with a working bulb.",
  ["stem", "crafts"], (8, 12), (2, 24), (30, 60), ["indoor"],
  ["copper tape", "coin-cell batteries (CR2032)", "small LED bulbs", "cardstock", "markers"],
  False, "Pre-cut copper tape into 15cm lengths. Test every LED + battery pair yourself first — dead bulbs sink the lesson.",
  ["Fold a card and draw the front design, leaving the inside blank for the circuit.",
   "Lay two parallel copper-tape tracks inside the card — these are the wires. Leave a small gap in one track.",
   "Bridge the gap with the LED: long leg to the track leading to the battery's + side.",
   "Tape the coin cell at the track ends (+ side up) and press — the bulb should glow.",
   "If it doesn't: flip the battery, then check the LED legs. Debugging IS the lesson.",
   "Sign the card and deliver it — a working circuit beats any store-bought card."],
  "Build the circuit on an open card (no folding) with the tracks pre-laid.",
  "Add a paper-clip switch or wire two LEDs in parallel.",
  safety="Coin cells are a serious choking/swallowing hazard — count batteries in and out, and keep spares with the adult.",
  tags=C),

A("candy-cane-olympics", "Candy Cane Olympics",
  "Four ridiculous relay events, one box of candy canes as the equipment.",
  ["pe-movement"], (5, 12), (6, 30), (20, 35), ["indoor"],
  ["candy canes (at least 2 per kid)", "spoons", "two buckets", "masking tape"],
  False, "Lay out four stations with tape lines: hook-and-carry lane, spoon relay lane, fishing hook line, cane-stack table.",
  ["Event 1 — Hook and carry: hook a cane through another cane's crook and carry it down the lane without hands touching it.",
   "Event 2 — Spoon relay: balance a cane on a spoon, relay-style, down and back.",
   "Event 3 — Fishing: dangle a cane on a string and hook a paper fish (or another cane) off the table edge.",
   "Event 4 — Stack: how many canes can your team lean into a teepee before it falls?",
   "Score 3-2-1 per event. The canes are the medals — everyone keeps what they carried."],
  "Run two events instead of four, teams of three.",
  "Blindfold the carrier (with a sighted guide) or run the whole thing as a timed bracket.",
  safety="Check for food allergies before anyone eats the equipment — peppermint is the usual suspect. No eating until the events are done.",
  tags=C, no_elimination=True),

A("gumdrop-bridge-build", "Gumdrop Bridge Build",
  "Toothpicks and gumdrops, one span to cross — the tastiest engineering constraint there is.",
  ["stem"], (6, 12), (2, 24), (25, 45), ["indoor"],
  ["gumdrops (about 30 per team)", "toothpicks (about 40 per team)", "two stacks of books", "pennies for load testing"],
  False, "Set two book stacks 20cm apart as the gorge. Bag 30 gumdrops + 40 toothpicks per team.",
  ["The challenge: span the 20cm gorge with only gumdrops and toothpicks. No taping to the books.",
   "Build in triangles — show one triangle joint, then let them discover why it holds.",
   "Test with pennies, one at a time, placed in the middle. Count the load before collapse.",
   "Redesign round: 10 minutes to rebuild using what the collapse taught you.",
   "Weigh the bridges too — strongest per gram wins the engineering prize."],
  "Shorten the gorge to 12cm and build flat trusses only.",
  "Widen to 30cm, or ban triangles and see what happens.",
  safety="Check for food allergies (gelatin, food dyes) before building — and the bridge is load-tested, not lunch.",
  tags=C),

A("holiday-card-print-shop", "Holiday Card Print Shop",
  "Foam-plate printing: carve once, print a whole stack of cards.",
  ["crafts"], (6, 12), (2, 30), (25, 45), ["indoor"],
  ["foam plates or foam sheets", "washable block-print ink or thick tempera", "rollers or foam brushes", "cardstock", "pencils"],
  False, "Cut foam into card-sized plates. Pour ink onto trays with rollers ready — ink management is the whole setup.",
  ["Draw the design on the foam with a pencil, pressing hard — the dent is the printing plate.",
   "Roll a thin, even layer of ink onto the foam. Thin beats thick; puddles blur the lines.",
   "Press cardstock onto the inked foam, rub the back firmly, and peel — first print done.",
   "Re-ink and repeat: one plate makes the whole class set. Sign each print in pencil.",
   "Hang the edition to dry and compare: which prints came out cleanest, and why?"],
  "Use pre-cut foam shapes (trees, stars) and print single-color.",
  "Carve two plates and overprint in two colors, or print on folded cards with messages inside.",
  safety="Washable ink only — block-print ink stains clothes permanently. Smocks or old shirts.",
  tags=C, copy_free=True),

A("reindeer-relay-race", "Reindeer Relay Race",
  "Antler headbands, a red nose, and a relay that rewards silliness over speed.",
  ["pe-movement"], (4, 10), (6, 30), (15, 25), ["indoor", "outdoor"],
  ["brown paper bags or headbands", "red pom-poms or stickers", "cones or tape for lanes"],
  False, "Make simple antler headbands (or skip them — arms work). Mark two relay lanes with cones.",
  ["Each team lines up; the first runner dons the antlers and the red nose.",
   "Gallop (yes, gallop) down the lane, circle the cone, and gallop back.",
   "Pass the antlers and nose to the next runner — the handoff is the whole game.",
   "Run it twice: once straight, once with a silly rule (sideways gallop, freeze at the cone).",
   "Winning team leads the victory lap; every team gets a cheer."],
  "Shorten the lane and let kids walk-trot instead of gallop.",
  "Add obstacles (crawl under a table = the stable door) or run it as a full bracket.",
  tags=C, no_elimination=True),

A("advent-kindness-envelopes", "Advent Kindness Envelopes",
  "Twenty-five sealed envelopes, each hiding one small kindness to do that day.",
  ["quiet-focus", "team-community"], (5, 12), (2, 30), (20, 30), ["indoor"],
  ["25 small envelopes", "paper slips", "a wall or string to hang them"],
  False, "Number 25 envelopes 1–25 and hang them on a string. Cut paper slips to fit.",
  ["As a group, brainstorm 25 tiny kindnesses that fit a school day: hold a door, thank the custodian, share a pencil.",
   "Write one per slip, seal each in its numbered envelope, and hang them in order.",
   "Each day, the class opens that day's envelope together and commits to the kindness.",
   "Keep a running list on the board of which ones got done — checkmarks are the advent calendar.",
   "On the last day, open them all and vote for the kindness the class wants to keep year-round."],
  "Do 12 envelopes instead of 25, or let the teacher pre-write the kindnesses.",
  "Each kid makes a personal 7-day set to take home for the break.",
  safety="Keep kindnesses school-appropriate and opt-in — nobody is assigned someone else's kindness.",
  tags=C, copy_free=True),
]
