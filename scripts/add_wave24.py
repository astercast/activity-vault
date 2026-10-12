#!/usr/bin/env python3
"""Wave 24: The Scout in action + the full-calendar completeness fix.

Part 1 — Scout review (the real queue, processed by a human-in-the-loop):
The Scout was run live on 2026-10-12 (pipeline/scan.py). Three new feeds were
added to pipeline/feeds.json first (Little Bins for Little Hands, Kids
Activities Blog, Buggy and Buddy — all verified responding), because the old
three feeds alone only surfaced 4 fresh candidates. The scan queued 36
pending candidates total. Every one was reviewed against the full
521-activity catalog for age-fit, safety, materials sanity, and duplication:

ACCEPTED (8) — adapted into original words, source credited on the record:
- MLK activities roundup -> dream-for-our-community (the roundup is a
  listicle, but the classic at its core — hear Dr. King's dream, state your
  own dream for your community — is one concrete activity, and the Vault had
  ZERO Martin Luther King Jr. Day coverage)
- Floating Ghost Drawing Experiment -> floating-ink-ghost (dry-erase ink
  lifting off a plate in water; no floating-ink mechanic in the catalog)
- Binary Code Keychain -> binary-code-keychain (the catalog's grid coding
  and cipher wheels are different mechanics; binary itself was missing)
- Indigenous Peoples' Day Activities -> indigenous-innovators-spotlight
  (one specific format from the roundup: spotlight cards + gallery walk
  about real Indigenous scientists and artists; zero coverage before)
- Paper Plate Feelings Pumpkins -> feelings-pumpkin-faces (emotion-face
  craft for ages 3-8; the catalog's pumpkin painting is decoration, this
  is feelings practice — different point)
- Christmas Light Chalk Stencil Art -> christmas-light-stencil-art
  (stencil-resist chalk; the circuit cards are electronics, different craft)
- Tissue Paper and Twig Snowflake -> twig-snowflake-craft (built from
  sticks, not cut paper — every existing snowflake activity is paper)
- Rainbow Science CD Light Patterns -> cd-rainbow-light-lab (CD
  diffraction; no light-splitting activity in the catalog)

REJECTED (28) — each with its reason recorded in pipeline/review-queue.json:
word-list printables, sponsored curriculum posts, recipe roundups for home
kitchens, a peanut-candy salad (top allergen, shared food), an edible
sensory bottle aimed at babies (the Vault floor is age 3, and "edible"
invites mouthing a sealed bottle), seven near-identical Christmas ornament
posts (one ornament craft already in the catalog; one was a licensed
character), template-only printables, an explainer article whose science
already lives in fall-leaf-chromatography, and straight duplicates
(paper-boat-race, density-rainbow-jars, spiderweb-plate-weave,
haunted-house-blueprint, reindeer-grid-coding, homemade-christmas-ornaments).

Part 2 — Completeness audit (the standing rule, run hard):
Keyword + tag audit of all 521 records found whole holidays missing:
Martin Luther King Jr. Day 0, Indigenous Peoples' Day 0, St. Patrick's Day 0,
Diwali 0, Lunar New Year 0 tagged (dragon-parade and paper-lantern-festival
existed untagged), Valentine's Day 0 tagged (three valentine activities
existed untagged). Six new tags join the vocabulary (build.py, app.js,
planner.js, API.md, AGENT.md together, per PIPELINE.md): holiday:mlk-day,
holiday:indigenous-peoples-day, holiday:valentines-day,
holiday:lunar-new-year, holiday:st-patricks-day, holiday:diwali.
Gap fills (7, original words): valentine-to-a-favorite-book,
lantern-riddle-walk, leprechaun-trap-build, shamrock-shapes-hunt,
rangoli-pattern-art, paper-diya-lanterns, scarf-dance-patterns (the last
also thickens music-rhythm, still the thinnest category, and ages 3-8).
Five existing activities get their missing holiday tags.
Diwali and Lunar New Year activities use the respectful-learning framing
of the wave-20/22 precedents: real traditions named, no invented rituals,
no costumes, no real flames (LED tealights only).

Part 3 — New collection (15th): "The whole calendar" — twelve picks, one
per holiday across the school year, anchored by this wave's accepts and
gap fills plus the Vault's best older holiday picks.

Near-duplicate screen: token Jaccard >= 0.55 against every existing
name+tagline in the script; per-candidate rationale above.
Safety notes are practical only — no medical claims anywhere.

Run once: dedupes by id, writes data/activities.json,
data/collections.json, pipeline/review-queue.json.
Run scripts/build.py afterwards.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_winter import A, DATA, ROOT

REVIEWED = "2026-10-12"

# Decisions keyed by exact candidate title (queue ids are content hashes).
DECISIONS_BY_TITLE = {
    "180+ Thanksgiving Words for Writing, Vocab, and More (Free  Printable)":
        ("rejected", "Word list / printable roundup — no runnable group activity in it. The Vault's writing games already cover Thanksgiving words in play.", None),
    "45 Meaningful Martin Luther King Jr. Activities for All Ages":
        ("accepted", "Roundup, but the classic at its core is one concrete activity: hear Dr. King's dream, state your own dream for your community. The Vault had zero MLK Day coverage. Adapted in original words.", "dream-for-our-community"),
    "How Genius & Joy Makes Learning Meaningful and Relevant for Students in Grades K–5":
        ("rejected", "Sponsored curriculum product post — no standalone activity concept to adapt.", None),
    "Quick Make & Play Edible Sensory Bottle":
        ("rejected", "Aimed at babies (the Vault floor is age 3), the 'edible' framing invites mouthing a sealed bottle, and it duplicates glitter-calm-jars and blizzard-in-a-bottle.", None),
    "Floating Ghost Drawing Experiment":
        ("accepted", "Real, distinct mechanic — dry-erase ink lifting off a plate in water. No floating-ink activity in the catalog. Adapted in original words.", "floating-ink-ghost"),
    "Halloween Density Experiment for Kids":
        ("rejected", "Near-duplicate of density-rainbow-jars — the same layered-liquids jar with a fizzy tablet added.", None),
    "3D Haunted Castle Craft with Free Printable Template":
        ("rejected", "Template-dependent printable, and the build-a-haunted-house concept is already covered by haunted-house-blueprint and haunted-hallway-build.", None),
    "3D Halloween Papercraft  (Free Printable)":
        ("rejected", "Template-dependent layered paper scene; Halloween crafts are the deepest shelf in the Vault (75 tagged) and this adds no new mechanic.", None),
    "Binary Code Keychain for Kids (Free Printable)":
        ("accepted", "Binary itself was missing — the catalog's cipher wheels and grid coding are different mechanics. Bead keychains spell real initials in 1s and 0s. Adapted in original words.", "binary-code-keychain"),
    "Code Your Name In Binary":
        ("rejected", "Same binary-name concept as the accepted keychain post, in worksheet form. One binary activity is the right count.", None),
    "Pumpkin Coding Activity: Draw a Pumpkin With an Algorithm":
        ("rejected", "Near-duplicate of reindeer-grid-coding — follow the code, draw the picture, same unplugged-coding mechanic in a pumpkin skin.", None),
    "Pumpkin STEM Activities and Projects for Kids":
        ("rejected", "Roundup listicle, and pumpkin STEM is already deep (volcano, bowling, towers, seed science). No single new concept to adapt.", None),
    "Indigenous Peoples’ Day Activities For Kids":
        ("accepted", "One specific format adapted from the roundup: spotlight cards and a gallery walk about real Indigenous scientists, artists, and astronauts. The Vault had zero Indigenous Peoples' Day coverage. Adapted in original words.", "indigenous-innovators-spotlight"),
    "Why Do Leaves Change Color in the Fall?":
        ("rejected", "Explainer article, not an activity — and its science already lives in fall-leaf-chromatography.", None),
    "How To Fold a Paper Boat [Columbus Day Activities]":
        ("rejected", "Duplicate of paper-boat-race — same fold, same boat.", None),
    "Historic Christopher Columbus Facts":
        ("rejected", "Facts-and-coloring roundup — no runnable activity. The October history slot is better served by the accepted Indigenous innovators activity.", None),
    "Celebrating Indigenous Peoples’ Day – Worksheets for Kids":
        ("rejected", "Worksheet pack — printing-dependent, and the same holiday is covered in hands-on form by the accepted innovators spotlight.", None),
    "Deliciously Sweet Apple Cider Recipes":
        ("rejected", "Recipe roundup for home kitchens — shared drinks and allergy surface, not a group activity one adult can run.", None),
    "Colorful Spider Web Craft For Kids":
        ("rejected", "Duplicate of spiderweb-plate-weave — same web craft concept (an earlier queue round rejected a sibling post for the same reason).", None),
    "Bat Outline Templates For Halloween Crafts":
        ("rejected", "Printable outline templates only — no activity. Bat crafts already exist (handprint-bat-garland).", None),
    "Letter M Craft- M Is For Monster Preschool Craft":
        ("rejected", "Single-letter craft — too narrow for the archive, and monster crafts are already a deep shelf.", None),
    "Snickers Salad Recipe":
        ("rejected", "Candy salad recipe built on peanuts — a top allergen in shared food. Not a classroom group activity.", None),
    "Easy Fall Harvest Craft for Kids":
        ("rejected", "Generic paper-corn craft; harvest crafts already cover it (paper-cornucopia-build, harvest-bowl-centerpiece).", None),
    "Easy Paper Plate Feelings Pumpkins Craft":
        ("accepted", "Feelings practice wearing a pumpkin craft — kids name and draw the emotion, which pumpkin-painting-party never does. Fits ages 3-8, the Vault's thinnest band. Adapted in original words.", "feelings-pumpkin-faces"),
    "Santa Hat Homemade Christmas Ornament Using Craft Sticks":
        ("rejected", "One of seven ornament posts in this scan; homemade-christmas-ornaments already covers kid-made ornaments. No new mechanic.", None),
    "Christmas Light Chalk Stencil Art for Kids":
        ("accepted", "Stencil-resist chalk art — a different craft from the circuit cards, cheap, and it works for ages 4-12. Adapted in original words.", "christmas-light-stencil-art"),
    "Christmas Tree Ornament Craft for Kids Using Paper Doilies":
        ("rejected", "Ornament variant (doilies) of homemade-christmas-ornaments. No new mechanic.", None),
    "Tissue Paper and Twig Snowflake Craft for Kids":
        ("accepted", "A snowflake you build from sticks instead of cutting paper — every snowflake already in the Vault is paper. Tissue crumpling also fits age 3. Adapted in original words.", "twig-snowflake-craft"),
    "Rainbow Science: Creating Light Patterns with a CD":
        ("accepted", "CD diffraction rainbows — no light-splitting activity in the catalog, and the materials are one old CD and a flashlight. Adapted in original words.", "cd-rainbow-light-lab"),
    "Paper Strip Angel Ornament Christmas Craft (with Free Template)":
        ("rejected", "Ornament variant of homemade-christmas-ornaments, template-dependent. No new mechanic.", None),
    "The Grinch Christmas Ornament Craft for Kids":
        ("rejected", "Licensed character craft (the Grinch is not public domain), and another ornament variant. The Vault describes public-domain concepts only.", None),
    "Yarn Wrapped Craft Stick Reindeer Ornament Craft for Kids":
        ("rejected", "Ornament variant; reindeer activities already exist (relay, grid coding, shelter build). No new mechanic.", None),
    "Kid-Made Ornaments Using Shrink Film":
        ("rejected", "Shrink film needs an oven and specialty plastic — fails the normal-classroom-budget test, and it is another ornament variant.", None),
    "DIY Silhouette Christmas Ornament for Kids":
        ("rejected", "Keepsake ornament variant of homemade-christmas-ornaments. No new mechanic.", None),
    "Fine Motor Turkey Craft for Thanksgiving":
        ("rejected", "Hammering pointed golf tees is the core mechanic and the audience is preschoolers — wrong tool for the age. Turkey crafts are already deep.", None),
    "Easy Thanksgiving Crafts for Kids: Coffee Filter Turkey Craft":
        ("rejected", "Same coffee-filter technique as coffee-filter-butterflies in a turkey shape; Thanksgiving crafts already run deep.", None),
}


def with_source(rec, url):
    rec["source"] = url
    return rec


PACK = [
    # ---------------- Scout accepts (8) ----------------
    with_source(A("dream-for-our-community", "A Dream for Our Community",
      "Hear Dr. King's dream in his own words, then say yours — one sentence, one drawing, one wall full of them.",
      ["team-community", "holidays"], (7, 12), (4, 30), (25, 40), ["indoor"],
      ["paper (one sheet per kid)", "crayons or markers", "tape for the dream wall"],
      False, "Clear one wall or board as the dream wall. Have a short, age-appropriate picture book or excerpt about Dr. King ready — his 'I Have a Dream' speech, in a kids' edition, is the anchor.",
      ["Read or play the short excerpt together. Keep it brief and real: Dr. King dreamed out loud about fairness, in front of a huge crowd, in 1963.",
       "Ask: what is one thing you wish were fairer or kinder in our school, our street, our town? Quiet thinking time first — a full minute.",
       "Each kid writes or draws their dream in one sentence: 'I have a dream that…' Sentence starters on the board for anyone stuck.",
       "Tape every dream to the wall. Nobody's dream gets skipped or ranked.",
       "Close with a walk along the wall: anyone who wants to reads their sentence aloud. The wall stays up for the week."],
      "Younger kids draw the dream and dictate the sentence to an adult or partner.",
      "Write the dream as a short speech and deliver it standing, King-style — one minute, no notes beyond the sentence.",
      safety="Keep the discussion on fairness and kindness in the kids' own world — school, street, town. Step in kindly if a dream mocks another kid.",
      tags=["season:winter", "holiday:mlk-day"], copy_free=True, no_elimination=True,
      inclusion="Use Dr. King's actual words and a real account of his life — January's holiday is about a specific person and a specific movement, not generic kindness. Every family's dream counts; sharing aloud is always optional."),
     "https://www.weareteachers.com/martin-luther-king-activities/"),

    with_source(A("floating-ink-ghost", "Floating Ink Ghost",
      "Draw a ghost with a dry-erase marker, pour water, and watch it lift off the plate and swim.",
      ["stem"], (5, 12), (2, 30), (15, 30), ["indoor"],
      ["dry-erase markers (dark colors work best)", "a smooth glass or ceramic plate (one per kid or pair)", "a cup of room-temperature water", "paper towels"],
      False, "Test one yourself first — the plate must be smooth and clean, and the ink needs a minute to dry before water touches it. One plate per kid or pair, water cups filled halfway.",
      ["Each kid draws a simple ghost on their plate with dry-erase marker — bold lines, filled in. Stick figures and stars work too.",
       "Wait a full minute. Lifting too early is the number-one way this fails, and finding that out is part of the science.",
       "Pour water slowly at the edge of the plate, not on the drawing. Watch the edges of the ink first.",
       "Tilt the plate gently. The drawing lets go and floats — a ghost you can swirl, chase, and poke (it tears if you poke hard).",
       "Talk it out: dry-erase ink is made to not stick, and the water slips underneath. That is the whole trick, and it is a good one."],
      "Pre-draw the ghosts for the youngest kids; their job is the pour and the tilt.",
      "Race two colors, draw a whole scene and float it, or test which marker brand lifts best and chart the results.",
      safety="Wipe spills right away — wet floors are the real hazard here. Markers stay on plates, not clothes or skin.",
      tags=["season:fall", "holiday:halloween", "theme:spooky"]),
     "https://littlebinsforlittlehands.com/floating-drawing/"),

    with_source(A("binary-code-keychain", "Binary Code Keychain",
      "Spell your initials in 1s and 0s with two colors of beads — the same code computers actually read.",
      ["stem", "crafts"], (8, 14), (2, 30), (25, 40), ["indoor"],
      ["pony beads in two colors (about 20 per kid)", "cord, string, or a split key ring (one per kid)", "paper and pencils"],
      False, "Draw the binary alphabet chart on the board (A = 01000001, and so on) — no printing needed. Cut cords to about 8 inches and knot one end of each.",
      ["Show the idea plainly: computers store every letter as eight 1s and 0s. Dark bead = 1, light bead = 0. Read the chart row for A together.",
       "Each kid picks their initials (two or three letters) and writes the bead pattern for each letter on paper first.",
       "Thread the beads in pattern order. A short spacer bead or a knot between letters keeps them readable.",
       "Tie off, clip to the key ring or cord loop, and trade: can a partner decode your initials from the beads alone?",
       "Fast finishers encode a whole word for someone else to crack."],
      "Encode one letter only, with a partner checking each bead against the chart.",
      "Encode a full first name, or write the decoding rules as a one-page guide for a younger class.",
      safety="Beads are a choking hazard for little siblings — keep them in trays on the table and count them back in at cleanup.",
      copy_free=True),
     "https://littlebinsforlittlehands.com/binary-code-keychain/"),

    with_source(A("indigenous-innovators-spotlight", "Indigenous Innovators Spotlight",
      "Real scientists, artists, and astronauts — research one, make their card, walk the gallery.",
      ["team-community", "stem"], (8, 14), (4, 32), (30, 45), ["indoor"],
      ["index cards or cardstock (one per kid)", "markers", "a teacher-made list of 6-8 Indigenous innovators with one line each"],
      False, "Write the starter list yourself from reliable sources — for example astronaut John Herrington (Chickasaw), scientist and botanist Robin Wall Kimmerer (Potawatomi), engineer Mary Golda Ross (Cherokee), artist Norval Morrisseau (Anishinaabe). Names and nations matter: be specific, never generic.",
      ["Read the list aloud together. Each kid or pair claims one person — no duplicates, so the gallery covers all of them.",
       "Research with the books and sources you have on hand: what did this person make, discover, or change? Find one fact a classmate will not expect.",
       "Make the spotlight card: name, nation, what they did, the surprising fact, and a drawing of their work (never a costume-style portrait).",
       "Tape the cards into a gallery row. Walk it slowly, readers in front of each card.",
       "Close by naming what the gallery adds up to: Indigenous people are scientists, artists, and astronauts right now — not only in history."],
      "Work in pairs with the one-line starter as the research base; the card needs just name, nation, and one fact.",
      "Add a 'questions we still have' card per person and hunt the answers in a second session.",
      safety=None,
      tags=["season:fall", "holiday:indigenous-peoples-day"],
      inclusion="Present-day people, specific nations, real achievements — that is the whole design. No costumes, no dress-up, no invented ceremonies. If a student is Indigenous, never single them out as the expert; the research is everyone's job."),
     "https://littlebinsforlittlehands.com/indigenous-peoples-day-activities/"),

    with_source(A("feelings-pumpkin-faces", "Feelings Pumpkin Faces",
      "Draw the feeling on the pumpkin, name it out loud — a feelings check-in disguised as a fall craft.",
      ["crafts", "quiet-focus"], (3, 8), (2, 25), (15, 25), ["indoor"],
      ["paper plates (one per kid)", "orange paint or crayons", "markers", "green or brown paper scraps for stems", "glue sticks"],
      False, "Pre-color the plates orange for the youngest kids, or leave coloring to them if time allows. Cut stem pieces ahead for under-5s. Have four feeling words ready: happy, sad, angry, worried.",
      ["Show your own pumpkin face first — draw 'worried' and say it plainly. Grown-ups have feelings too, and naming yours gives permission.",
       "Call a feeling; everyone draws that face on their plate: eyebrows and mouth do most of the talking.",
       "New plate or flip it over — run all four feelings, then let each kid pick one more feeling of their own to draw.",
       "Hold-up round: hold your pumpkin where the group can see. 'This face is angry. Angry feels like…' — anyone may pass.",
       "Hang the pumpkins in a row. A wall of feelings, all of them allowed."],
      "Two feelings only (happy, sad), with face parts pre-drawn to trace.",
      "Add mixed feelings — draw a half-and-half face and explain when both show up at once.",
      safety="Feelings talk stays kind: no laughing at anyone's face or example. Passing is always allowed.",
      tags=["season:fall", "holiday:halloween"]),
     "https://kidsactivitiesblog.com/94459/easy-paper-plate-feelings-pumpkins/"),

    with_source(A("christmas-light-stencil-art", "Christmas Light Stencil Art",
      "Tape a bulb stencil to dark paper, chalk all around it, lift — a glowing string of lights on a night-sky page.",
      ["crafts"], (4, 12), (2, 30), (20, 35), ["indoor"],
      ["dark blue or black paper (one sheet per kid)", "cardstock stencils cut in bulb shapes (teacher-cut, 2-3 per table)", "colored chalk", "tape loops", "a damp cloth for hands"],
      False, "Cut the bulb stencils ahead of time. Put one tape loop on the back of each so small hands can hold them still.",
      ["Each kid tapes a bulb stencil to their dark paper and picks a chalk color — the bolder the better.",
       "Color hard all around the stencil's edge, then smudge the chalk outward with a fingertip. The smudge is the glow.",
       "Lift the stencil: a clean dark bulb with a bright halo. Move it, repeat — three to five bulbs per page.",
       "Draw one wavy string line in white chalk connecting every bulb. The page is now a string of lights.",
       "Hang the pages in a row along one wall: the class's own light display, no ladder required."],
      "One big bulb per page, with thick chalk for small hands.",
      "Plan the color pattern first (repeating sequence), or cut an original stencil shape of their own design.",
      safety="Chalk dust drifts — wipe hands on the damp cloth, not clothes, and keep chalk away from faces.",
      tags=["season:winter", "holiday:christmas"]),
     "https://buggyandbuddy.com/christmas-light-chalk-stencil-art-kids/"),

    with_source(A("twig-snowflake-craft", "Twig Snowflake Craft",
      "Six sticks, crumpled tissue, and glue — a snowflake you build instead of cutting.",
      ["crafts", "seasons"], (3, 10), (2, 25), (20, 30), ["indoor", "outdoor"],
      ["twigs or craft sticks (6 per kid)", "white and pale-blue tissue paper", "glue", "string for hanging"],
      False, "Collect or cut twigs to roughly the same length (a hand-span works) and snap off sharp ends. Tear tissue into small squares ahead for the youngest kids.",
      ["Lay three twigs across each other like a star — every snowflake starts with six arms, and the twigs prove it.",
       "Glue the center where they cross and let it set a minute. A wobbly center now means a fallen snowflake later.",
       "Scrunch tissue squares into tiny balls and glue them along the arms — dense at the center, sparse at the tips, like frost creeping out.",
       "Tie on the string and hang the flakes at different heights.",
       "Look up: real snowflakes have six sides too. Twig sixes are sturdier than paper ones — these survive the whole winter."],
      "Use craft sticks instead of twigs and pre-glue the star; the tissue work is the right size for age 3.",
      "Build a second, bigger flake as a pair project and work out how the arms must scale.",
      safety="Check every found twig for sharp ends and splinters before it reaches the table, and wash hands after outdoor collecting.",
      tags=["season:winter"]),
     "https://buggyandbuddy.com/tissue-paper-twig-snowflake-craft-kids/"),

    with_source(A("cd-rainbow-light-lab", "CD Rainbow Light Lab",
      "One old CD, one flashlight, and a white wall — split plain light into a rainbow and bend it around.",
      ["stem"], (6, 12), (2, 30), (15, 25), ["indoor"],
      ["an old CD or DVD (one per pair)", "a flashlight", "white paper or a pale wall", "a sunny window (optional)"],
      False, "Dim the room if you can — rainbows show best against shade. Check each CD for cracked or sharp edges and retire those.",
      ["Shine the flashlight at the CD's shiny side at an angle. Hunt slowly until a rainbow lands on the paper.",
       "Tilt and turn: the rainbow stretches, splits, and slides. Each pair finds the widest rainbow they can make and holds it still for a count of ten.",
       "Try the sunny window next (CD in the light, rainbow on paper — eyes never toward the sun). Compare: which light gives the stronger rainbow?",
       "Draw what you saw: the order of colors, every time, is the same. Red on one edge, violet on the other.",
       "The honest explanation: the CD's tiny grooves act like a fence that sorts light by color. Sorted light is a rainbow."],
      "Work in pairs with the adult holding the CD steady; the hunt is the job.",
      "Test other grooved or shiny surfaces (a phone screen off, a vinyl record) and rank which sorts light best.",
      safety="Never look at the sun or aim a reflection at anyone's eyes. Retire cracked CDs — the edges are sharp.",
      tags=None),
     "https://buggyandbuddy.com/rainbow-science-create-light-patterns-with-a-cd/"),

    # ---------------- Completeness gap fills (7) ----------------
    A("valentine-to-a-favorite-book", "A Valentine to a Favorite Book",
      "Skip the candy hearts — write a valentine to the book you would hand to a friend today.",
      ["quiet-focus", "holidays"], (7, 12), (2, 30), (20, 30), ["indoor"],
      ["paper hearts or folded cards (one per kid)", "markers or pencils", "a stack of well-loved classroom books to choose from"],
      False, "Cut paper hearts ahead, or let older kids cut their own. Spread the book stack where everyone can browse it for two minutes.",
      ["Each kid picks one book they genuinely love. Not the longest, not the hardest — the one they would press on a friend.",
       "Write the valentine to the book itself: 'Dear [title], you made me…' One honest sentence beats five fancy ones.",
       "Add the practical part: who should read this book next, and why them?",
       "Tuck the valentines inside the books or tape them to the covers.",
       "Book matchmaking: pull a book with someone else's valentine in it and read that sentence aloud. New reading lists get built in five minutes."],
      "Draw the valentine and dictate the sentence; a heart with a face from the book counts fully.",
      "Write the valentine as a persuasive paragraph and defend the pick in a one-minute pitch.",
      safety=None,
      tags=["season:winter", "holiday:valentines-day"], copy_free=True),

    A("lantern-riddle-walk", "Lantern Riddle Walk",
      "Write a riddle, hang it on a lantern, walk the row and solve everyone else's — the Lantern Festival way.",
      ["holidays", "team-community"], (6, 12), (4, 30), (25, 40), ["indoor"],
      ["paper lanterns (simple folded-paper ones work)", "markers", "string and tape for hanging", "slips of paper for answers"],
      False, "Make or fold the lanterns first (paper-lantern-festival is the craft if you need one), and string a line across the room at kid height. Write one sample riddle yourself — answer hidden under a flap.",
      ["Teach the tradition plainly: at the Lantern Festival, which closes Lunar New Year celebrations, riddles are written on lanterns for passers-by to solve. That is the game, unchanged.",
       "Each kid writes a riddle on their lantern — about an object in the room, an animal, a classmate's desk item. Answer goes under a taped flap or on the back.",
       "Hang every lantern on the line. Lights low if you can; even ordinary light works.",
       "Walk the row in pairs with an answer slip. Solve quietly, check the flap, move on. No shouting answers — the next pair deserves the puzzle.",
       "Gather and vote: hardest riddle, funniest riddle, fairest riddle. The writers reveal themselves last."],
      "Picture riddles for younger kids — draw the clues, write the answer word together.",
      "Require a rhyming riddle, or a two-step riddle whose first answer feeds the second.",
      safety="String lines stay at kid height and out of walkways; lanterns are paper only, never near a heat source or real flame.",
      tags=["season:winter", "holiday:lunar-new-year"],
      inclusion="Riddles on lanterns are a real Lantern Festival custom — name it, place it (the 15th day of Lunar New Year), and play it as written rather than dressing it up. Guessing is in pairs so nobody is stuck alone."),

    A("leprechaun-trap-build", "Leprechaun Trap Build",
      "Boxes, ramps, and one gold coin of bait — engineer a trap for a creature who has never once been caught.",
      ["stem"], (6, 11), (2, 24), (30, 45), ["indoor"],
      ["cardboard boxes and tubes", "craft sticks and string", "tape", "a gold paper coin (one per trap)", "scissors"],
      False, "Set out the building stock and the bait coins. State the one rule that makes it engineering: the trap must be triggered by the coin being touched — a trap that only works if you push it is a sculpture.",
      ["Plan first, on paper: where does he step, what moves, what falls or closes? Two minutes of drawing saves twenty of rebuilding.",
       "Build the trap around the coin. Ramps, levers, falling lids, swinging doors — any mechanism counts if the coin triggers it.",
       "Test with a finger, not hope. Trigger it three times. A trap that works once in three is a prototype, and prototypes get fixed.",
       "Fix and retest. Then leave every trap set and baited, and do a gallery walk: each builder explains their mechanism in one sentence.",
       "Optional overnight drama: check the traps next session for 'evidence' — a tipped coin, a moved stick. He got away. He always gets away."],
      "Build in pairs with a falling-lid design only, and adult help on the trigger.",
      "Add a second trigger stage, or design the trap to catch without closing at all (a pit, a slide, a one-way ramp).",
      safety="Scissors and craft knives are adult-handled; cut cardboard on the table, never in a lap.",
      tags=["season:spring", "holiday:st-patricks-day"]),

    A("shamrock-shapes-hunt", "Shamrock Shapes Hunt",
      "Green shamrocks are hiding — each one carries a shape. Find them, sort them, count the haul.",
      ["seasons", "outdoor"], (3, 7), (2, 25), (15, 25), ["indoor", "outdoor"],
      ["paper shamrocks (teacher-cut, about 20)", "a marker", "a basket or bag per team"],
      False, "Cut the shamrocks and draw one clear shape on each — circles, triangles, squares, hearts. Hide them at knee height or lower, in sight once you are close: this is a hunt for 3-to-7-year-olds, not a search warrant.",
      ["Show one shamrock and its shape. The job: find a shamrock, name its shape out loud, carry it back. Naming it is what counts it.",
       "Hunt in pairs or small teams, one basket per team. Walk, don't run — the shapes are hiding, not fleeing.",
       "Back at the rug, sort the haul into shape piles together.",
       "Count each pile and line the piles up: which shape hid best? The smallest pile wins the hiding prize.",
       "Re-hide round, if energy allows — this time the kids hide them for another team, same knee-height rule."],
      "Hunt for green only — find any shamrock, shapes come later.",
      "Add shape clues instead of free hunting ('find a triangle hiding near something soft'), or graph the counts on the board.",
      safety="Set the hunt boundary out loud before anyone moves, and keep it where one adult can see the whole field.",
      tags=["season:spring", "holiday:st-patricks-day"]),

    A("rangoli-pattern-art", "Rangoli Pattern Art",
      "Dot grid, chalk colors, mirror the pattern — floor art that welcomes people in, Diwali-style.",
      ["crafts"], (5, 12), (2, 30), (25, 40), ["indoor", "outdoor"],
      ["colored chalk (pavement) or colored paper dots and dark paper (indoor version)", "a ruler or dot-grid drawn in pencil"],
      False, "Draw one small dot grid yourself to demo on. Outdoors needs a swept patch of pavement; indoors, dark paper stands in for the doorstep.",
      ["Say what rangoli is, plainly: during Diwali, families make bright patterns at their doorways to welcome guests and good fortune. Ours follows the same idea — a welcome you can see from the door.",
       "Start every design the rangoli way: a grid of dots. Count them out loud — the grid is the skeleton.",
       "Connect and mirror: draw a petal or diamond in one corner of the grid, then repeat it in all four, turned each time. Symmetry does the heavy lifting.",
       "Color it in chalk or paper dots, brightest in the center.",
       "Leave the finished patterns by the classroom door for a day. A welcome mat you made yourself."],
      "Use a 3x3 dot grid and one shape repeated, with the adult drawing the grid.",
      "Design on a 7x7 grid with two mirrored shapes, or work out the pattern on paper first and scale it up to pavement size.",
      safety="Chalk stays on pavement and paper. Wash hands after — chalk dust and snacks do not mix.",
      tags=["season:fall", "holiday:diwali"],
      inclusion="Rangoli is a living Diwali tradition, not a generic pattern exercise — name the holiday, the doorway, and the welcome. Make patterns, not pictures of deities, and keep the focus on the craft families actually practice."),

    A("paper-diya-lanterns", "Paper Diya Lanterns",
      "Fold a paper diya, add a battery tealight, and line the windowsill with light — no flames, all glow.",
      ["crafts", "holidays"], (5, 12), (2, 30), (20, 35), ["indoor"],
      ["sturdy paper cups or cardstock (one per kid)", "tissue paper in warm colors", "glue sticks", "battery tealights (one per lantern, optional)", "scissors"],
      False, "Pre-cut tissue into small squares. If you have battery tealights, test them all first — dead batteries are a momentum killer.",
      ["Start with the real thing: a diya is a small clay oil lamp, and rows of them light homes and streets through Diwali, the festival of lights. Ours are paper — the row of light is the point, not the flame.",
       "Press or fold the cup into a shallow bowl shape and cover it with warm tissue colors — golds, oranges, reds.",
       "Add a tissue flame: one twisted yellow-orange tuft standing in the center, or place a battery tealight inside instead.",
       "Make the rim fancy — a folded band, dots, a repeating pattern. Diyas are small and decorated like they matter.",
       "Line the finished lanterns along the windowsill or a shelf, lights on, room lights low for one minute. That minute is the festival feeling, honestly earned."],
      "Use a pre-shaped bowl and big tissue pieces; gluing coverage is the whole job at age 5.",
      "Design a matched set of three with a planned color sequence, or engineer a hanging version on string.",
      safety="Battery tealights only — never real candles or oil flames in a classroom version. Button batteries stay inside their tealights; tell an adult if one opens.",
      tags=["season:fall", "holiday:diwali"],
      inclusion="Name the real object and the real festival — a diya, Diwali, light over darkness — and skip costumes and generic 'around the world' framing. The paper version keeps the meaning and drops only the fire."),

    A("scarf-dance-patterns", "Scarf Dance Patterns",
      "High, low, fast, freeze — follow the pattern with a scarf and feel where the music changes.",
      ["music-rhythm", "pe-movement"], (3, 8), (4, 30), (10, 20), ["indoor"],
      ["a scarf, tissue, or streamer per kid", "music with clear changes (fast/slow, loud/quiet)"],
      False, "Clear the floor and hand out scarves last — scarves distributed early are scarves worn as hats. Pick music with obvious changes; two contrasting songs back to back works.",
      ["Free float first: one minute of moving the scarf any way the music suggests. No wrong answers in minute one.",
       "Call the pattern: high on the loud parts, low on the quiet parts. Scarves make the music visible — quiet music should look small.",
       "Add speed: wave fast when the music runs, drift when it walks. Watch a few kids mirror each other without being asked.",
       "Freeze game to close: music stops, scarves and bodies stop mid-shape. The sillier the statue, the better the round.",
       "Sit, breathe, done. Ten honest minutes of listening with your whole body."],
      "Seated version works fully — scarves move, chairs stay. Use one pattern only (high/low).",
      "Kids take turns conducting: their scarf leads, the group's scarves follow the pattern they set.",
      safety="Scarves stay in hands — never around necks, never tied. Clear floor, walking feet when the music is quiet.",
      tags=None, no_elimination=True),
]

RETAGS = {
    "valentine-card-exchange": ["season:winter", "holiday:valentines-day"],
    "valentine-compliment-cards": ["season:winter", "holiday:valentines-day"],
    "valentine-heart-hunt": ["season:winter", "holiday:valentines-day"],
    "dragon-parade": ["season:winter", "holiday:lunar-new-year"],
    "paper-lantern-festival": ["season:winter", "holiday:lunar-new-year"],
}

COLLECTION = {
    "id": "the-whole-calendar",
    "title": "The whole calendar",
    "glyph": "🗓️",
    "when_to_use": "One shelf for the whole school year: twelve holidays, one strong pick each, in calendar order. Plan the year in January or rescue a holiday week the night before — it works both ways.",
    "picks": [
        {"id": "new-year-noise-parade", "note": "January opens loud — shakers and one hallway lap to start the year like you mean it."},
        {"id": "dream-for-our-community", "note": "MLK Day with the real speech at the center: hear his dream, then state yours for your own street."},
        {"id": "paper-lantern-festival", "note": "Lunar New Year lanterns — make them first, then hang the riddle walk on them later in the week."},
        {"id": "valentine-card-exchange", "note": "February's rule is nobody skipped: every kid makes one card and gets one card."},
        {"id": "shamrock-shapes-hunt", "note": "St. Patrick's Day for the youngest kids — shapes, counting, and a hunt set at knee height."},
        {"id": "natural-dye-easter-eggs", "note": "Spring eggs dyed with onion skins and beets — the pantry does the chemistry."},
        {"id": "flag-folding-ceremony", "note": "July 4th handled with care: the real 13-fold ceremony, practiced respectfully."},
        {"id": "indigenous-innovators-spotlight", "note": "October's history slot done right — real Indigenous scientists and artists, researched by the kids."},
        {"id": "teal-pumpkin-project", "note": "Halloween that includes every kid: the allergy-aware anchor of the whole month."},
        {"id": "rangoli-pattern-art", "note": "Diwali's welcome, made in chalk — dot grid, mirrored pattern, hung by the door."},
        {"id": "thankful-turkey-handprints", "note": "Thanksgiving's signature craft: a feather for every thankful thought."},
        {"id": "homemade-christmas-ornaments", "note": "December closes with the take-home gift parents actually keep."},
    ],
}


def tokens(s):
    return set(re.findall(r"[a-z0-9]+", s.lower()))


def main():
    acts = json.load(open(os.path.join(DATA, "activities.json")))
    by_id = {a["id"]: a for a in acts}
    existing_text = {a["id"]: tokens(a["name"] + " " + a["tagline"]) for a in acts}

    # Near-duplicate screen (token Jaccard >= 0.55 on name+tagline)
    for rec in PACK:
        t = tokens(rec["name"] + " " + rec["tagline"])
        for oid, ot in existing_text.items():
            j = len(t & ot) / max(1, len(t | ot))
            if j >= 0.55:
                raise SystemExit(f"near-dupe: {rec['id']} vs {oid} (Jaccard {j:.2f})")

    added = []
    for rec in PACK:
        if rec["id"] in by_id:
            continue
        if len(rec["tagline"]) > 160:
            raise SystemExit(f"tagline too long: {rec['id']}")
        acts.append(rec)
        added.append(rec["id"])
    print(f"activities: +{len(added)} -> {len(acts)}")

    # Re-tag existing activities that were missing their holiday tags
    for aid, tags in RETAGS.items():
        a = by_id[aid]
        cur = a.get("tags") or []
        for t in tags:
            if t not in cur:
                cur.append(t)
        a["tags"] = cur
    print(f"retagged: {sorted(RETAGS)}")

    json.dump(acts, open(os.path.join(DATA, "activities.json"), "w"), indent=1, ensure_ascii=False)

    # Collection
    colls_doc = json.load(open(os.path.join(DATA, "collections.json")))
    colls = colls_doc["collections"]
    if COLLECTION["id"] not in {c["id"] for c in colls}:
        colls.append(COLLECTION)
    json.dump(colls_doc, open(os.path.join(DATA, "collections.json"), "w"), indent=1, ensure_ascii=False)
    print(f"collections: -> {len(colls)}")

    # Queue decisions — every pending entry must be covered by title
    qpath = os.path.join(ROOT, "pipeline", "review-queue.json")
    queue = json.load(open(qpath))
    n_acc = n_rej = 0
    for item in queue:
        if item["status"] != "pending":
            continue
        if item["title"] not in DECISIONS_BY_TITLE:
            raise SystemExit(f"unreviewed pending candidate: {item['title']}")
        status, decision, activity_id = DECISIONS_BY_TITLE[item["title"]]
        item["status"] = "accepted" if status == "accepted" else "rejected"
        item["decision"] = decision
        item["reviewed"] = REVIEWED
        if activity_id:
            item["activity_id"] = activity_id
            n_acc += 1
        else:
            n_rej += 1
    json.dump(queue, open(qpath, "w"), indent=2, ensure_ascii=False)
    print(f"queue: {n_acc} accepted, {n_rej} rejected, "
          f"{sum(1 for q in queue if q['status'] == 'pending')} pending left")


if __name__ == "__main__":
    main()
