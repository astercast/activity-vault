#!/usr/bin/env python3
"""Wave 26: First Years (the age-3 cliff) + the last two thin holidays.

Part 1 — Scout cycle (run live 2026-10-12, before this script):
`python3 pipeline/scan.py` fetched all 6 feeds (WeAreTeachers 16 items,
Hands On As We Grow 7, Teach Beside Me 10, Little Bins 10, Kids Activities
Blog 10, Buggy and Buddy 12 = 65 items) and queued 0 new candidates —
every relevant item was already in pipeline/seen.json from the wave-24/25
scans and the rest failed the KEEP/DROP relevance filter. Queue files
byte-identical before/after (sha256 checked). Pipeline health verified by
hand: 59 decided entries (21 accepted / 38 rejected), every decided entry
carries a recorded reason, all 21 accepted activity_ids resolve in the
catalog, 0 pending. Nothing was manufactured to make the cycle look busy.

Part 2 — Completeness audit beyond holidays (this wave's real work):
- AGE is the cliff: coverage per single age runs 3:12, 4:112, 5:279,
  6:405 ... 13:76, 14:76. Only 5 activities in the whole archive are
  early-years-only (age_max <= 6) and only 12 even include age 3, most
  of them broad-band activities a 3-year-old is merely tolerated by.
  Wave 25 flagged it ("designed-band activities for 3-year-olds
  specifically"); this wave fixes it with 10 activities whose
  age_min is 3 and whose mechanics are sized for 3-year-olds first:
  short runs, big pieces, one rule per game, adult as player not referee.
  Category firsts at age 3: icebreakers, team-community and rainy-day
  had ZERO age-3 coverage before this wave.
- HOLIDAYS: wave 25 left lunar-new-year thinnest (3) and valentines-day
  next (4). Both filled here (+2 each -> 5 and 6), so every holiday tag
  in the vocabulary now carries at least 5 activities.
- SUBJECTS (keyword audit over name+tagline+steps+setup): literacy 92,
  writing 100, math 158, nature 85 — healthy. Drama/theatre (11) and
  coding (6) are thin by keyword but neither is a category the Vault
  promises; recorded, not padded. Small-group (group_max <= 6: zero)
  is a non-gap in practice: 257 activities run with pairs (group_min 2).
- CATEGORIES: music-rhythm primary 26 -> 27, any-category 30 -> 31;
  rainy-day stays thinnest primary (21) but its any-category count
  rises 50 -> 53 (three age-3 picks carry it as second category).
  Enrichment deltas: copy_free 173 -> 184, no_elimination 47 -> 51,
  inclusion 64 -> 69.

Part 3 — New collection (16th): "Little Hands, First Years" — the 10 new
age-3 activities + color-sorting-trays + big-brush-painting.

Near-duplicate screen: token Jaccard >= 0.55 against every existing
name+tagline is asserted in this script and fails the run. Closest
deliberate neighbours, kept on purpose:
- tape-path-balance-walk vs tape-maze-challenge (5-12 puzzle maze) and
  rock-cairn-balance (stacking stones): a taped floor path walked slowly
  is a different mechanic from both.
- sponge-squeeze-station vs sponge-bucket-relay / sponge-launch-bullseye
  (older-kid relay and target games): this is a calm fine-motor station
  about moving water squeeze by squeeze, not a race.
- sound-match-shakers vs shaker-craft (making shakers, 4-10): here the
  adult makes sealed pairs ahead; the game is matching by ear.
- cardboard-tunnel-crawl vs cardboard-city (building a model city,
  6-12): crawling through boxes vs building with them.
- hello-ball-greetings vs name-chain (5-11 memory chain): no memory
  load at all — one greeting, one roll, built for first icebreaking.
- torn-paper-collage vs collage-dreams / collage-self-portrait (older,
  themed): tearing IS the skill here; it replaces scissors at age 3.
- red-envelope-wishes vs advent-kindness-envelopes (Christmas kindness
  notes): the hongbao custom is the content here, named and framed.
- kindness-post-office vs kindness-scavenger-hunt (kind acts as found
  items, 7-12): a working classroom post office with a delivery ledger.
- fold-and-open-hearts vs valentine-heart-hunt (a search game): folded
  paper, a cut, and line symmetry you can hold up to the light.

Safety notes are practical only — no medical claims anywhere. Choking
notes appear where they are real (pom-poms, shaker fillings) with the
count-out/count-back and sealed-lid routines a real room actually uses.

Run once: dedupes by id, writes data/activities.json + collections.json.
Run scripts/build.py afterwards.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_winter import A, DATA, ROOT

LNY = ["season:winter", "holiday:lunar-new-year"]
VAL = ["season:winter", "holiday:valentines-day"]

PACK = [
    # ---------------- Designed for 3-year-olds (+10) ----------------
    A("tape-path-balance-walk", "Tape Path Balance Walk",
      "Painter's tape on the floor becomes a balance path — straight, zigzag, and curvy lines walked one slow step at a time.",
      ["pe-movement", "rainy-day"], (3, 5), (2, 20), (10, 20), ["indoor"],
      ["painter's tape (one roll)", "a soft toy or beanbag (one per kid, optional)"],
      False, "Lay three tape lines on a clear stretch of floor before the group arrives: one straight, one zigzag, one slow curve, each about eight feet long with space between them. Press every inch down flat — a lifted corner is a trip waiting to happen. Put a soft chair or cushion at the end of each line as the home base to walk toward.",
      ["Show one walk yourself, slowly: heel down, arms out like airplane wings, eyes on the line. Say the whole rule once: 'Feet on the tape, slow wins.'",
       "One kid per line. Everyone else waits behind the start — this is a watching game too, and the watching is where the cheering happens.",
       "First pass plain: walk the line, touch home base, then walk back along the floor, not the line, so the next kid can start.",
       "Second pass with a job: carry a soft toy on two hands like a tray of juice you do not want to spill.",
       "Finish on the curvy line, then sit in a circle and ask who found the zigzag hardest — most hands go up for the zigzag every time."],
      "Make the lines shorter and twice as wide (two strips of tape side by side); a grown-up hand to hold is always on offer.",
      "Walk the zigzag backwards, or carry the soft toy on one flat palm.",
      safety="Tape every line flat and check for lifted corners between groups. Bare feet or grippy socks — smooth socks on hard floors slide.",
      copy_free=True, no_elimination=True),

    A("pom-pom-drop-tubes", "Pom-Pom Drop Tubes",
      "Cardboard tubes taped to a wall, big pom-poms dropped in the top — where did it go? There it is, in the cup.",
      ["quiet-focus", "rainy-day"], (3, 5), (1, 8), (10, 20), ["indoor"],
      ["cardboard tubes (paper-towel tubes, 3-4)", "painter's tape", "large pom-poms (2 inches across, mixed colors)", "small cups or bowls (one per color)"],
      False, "Tape the tubes to a wall, the side of a box, or a chair back at toddler height — one straight down, one on a slant, one made of two tubes joined at an angle. Put a cup under each tube's mouth. Count the pom-poms out loud as you put them in the basket: the same number comes back at clean-up, every time.",
      ["Start with one pom-pom and one tube: drop it in the top, wait, watch it land in the cup. That small wait — where did it go? there it is — is the whole game at three.",
       "Let kids take turns feeding the tubes. The biggest pom-poms only fit some tubes; figuring out which is the quiet puzzle inside the game.",
       "Swap in the slanted tube and ask which comes out faster, a big pom-pom or a small one. Test it three times — three-year-old scientists repeat everything.",
       "Add the sorting job: call a color, and that color travels down any tube into the matching cup below.",
       "Empty all the cups back into the basket and count together out loud — every pom-pom home before the basket closes."],
      "One wide tube (an oatmeal canister with the bottom cut out by an adult ahead of time) and pom-poms as big as their fists.",
      "Name a two-color pattern — red, blue, red, blue — and drop the pom-poms in that order.",
      safety="Use the big 2-inch pom-poms, count them out and count them back in, and put the basket away the moment the game ends — small parts and three-year-olds do not mix without an adult right there.",
      copy_free=True),

    A("sponge-squeeze-station", "Sponge Squeeze Station",
      "Two tubs, one sponge, and a fill line to reach — moving water one squeeze at a time is the whole job, and it's enough.",
      ["quiet-focus", "stem"], (3, 5), (1, 6), (10, 20), ["indoor"],
      ["two shallow tubs or bowls", "big soft sponges (one per kid)", "water", "a towel (for the spills that are part of it)", "tape (for a fill line)"],
      False, "Put a strip of tape on the inside of the empty tub to mark a fill line. Fill the other tub halfway with water and set both on a tray or a towel. This is a small-group station — two or three kids at a time while the rest of the room does something else.",
      ["Show the squeeze once, slowly: sponge in the water, lift it dripping, hold it over the empty tub, squeeze until it stops. The squeeze is the skill; everything else is watching water move.",
       "Kids take turns moving water sponge by sponge. Nobody hurries — a sponge squeezed over the wrong tub just gets squeezed again.",
       "Watch the empty tub climb toward the tape line. Ask the only question that matters: 'Is it there yet? How can you tell?'",
       "When the line is reached, reverse it: all the water goes home, squeeze by squeeze, back where it started.",
       "Wring the sponges one last time, carry the water out together (an adult carries the tub), and the towel squad pats the tray dry."],
      "Smaller tubs and a lower fill line; a sponge cut in half fits small hands better.",
      "Two fill lines and a prediction first — 'How many squeezes to the first line?' — then count the squeezes for real.",
      safety="Water stays in the tubs and spills get toweled straight away — wet floors are slippery. Hands get washed when the station closes."),

    A("sound-match-shakers", "Sound-Match Shakers",
      "Pairs of sealed shakers that sound the same — shake by your ear, walk the rug, and find the one that matches yours.",
      ["music-rhythm", "quiet-focus"], (3, 6), (2, 12), (10, 20), ["indoor"],
      ["small containers with tight lids (6 pairs)", "fillings: dry rice, dry beans, sand, bells, paper clips, cotton balls", "colored dot stickers (one color per pair)"],
      False, "Make the pairs ahead of time, adult-only: fill two containers with the same thing, the same amount. Seal every lid with tape or a line of glue and test each one with a hard shake. Put one colored dot on the bottom of each container — both members of a pair share a color, so a match can always be checked by eye.",
      ["Pass one shaker around the circle. Everyone shakes it once and listens. It is somebody's whole turn just to listen — say that out loud; it helps.",
       "Scatter the set on a rug. Each kid picks one shaker, shakes it near their ear, and walks the rug shaking and listening for the one that sounds the same.",
       "When a kid thinks they have a match, the pair sits down together and shakes both, one after the other, for the group to judge.",
       "Check the dots: same color on the bottom means a match. Different dots? The pair goes back on the rug, no fuss — ears are still learning.",
       "Finish loud: everybody shakes their matched pair together on the count of three, then freezes. The silence right after the shaking is the best sound in the game."],
      "Three pairs only, with very different fillings — bells, sand, and cotton balls are easy to tell apart.",
      "Five or six pairs with closer sounds (rice against sand against dry beans), or match with eyes closed.",
      safety="Lids are sealed by an adult and checked before every use — a shaker that splits or opens gets binned on the spot, because the fillings are choking hazards. Kids never open the shakers.",
      copy_free=True,
      inclusion="Every pair carries a colored dot, so a kid who hears differently can match by checking colors with a partner — the listening game stays open to them, with the dots as the honest second path in."),

    A("bubble-wrap-stomp-path", "Bubble Wrap Stomp Path",
      "A taped-down strip of bubble wrap and three ways to cross it: stomp it loud, tiptoe it silent, crawl it popping.",
      ["pe-movement", "rainy-day"], (3, 5), (2, 16), (10, 15), ["indoor"],
      ["a roll of large-bubble bubble wrap", "painter's tape"],
      False, "Cut the bubble wrap into one long strip (or two or three squares joined) and tape every edge flat to a clear stretch of floor. Walk it yourself first — if an edge lifts under your foot, tape it again. The pops are the point, so use fresh wrap with life left in it.",
      ["One kid on the path at a time. First crossing: stomp, as loud as your feet can make it. That is the whole instruction, and three-year-olds need no second one.",
       "Second crossing: tiptoe. The challenge nobody expects — can you cross without a single pop? Almost nobody can, and the near-misses are the funny part.",
       "Third crossing: crawl it, hands and knees, popping with palms as you go.",
       "While one kid crosses, the rest of the group is the audience: count the pops out loud together on the stomp round.",
       "End with a free minute — anyone who wants another stomp crossing takes it — then peel the wrap up together and bin it. Flat, popped wrap is rubbish, not a toy to keep."],
      "A short path of two big squares, an adult hand to hold, and no tiptoe round.",
      "Jump the path two-footed, or cross it backwards on the stomp round.",
      safety="Every edge taped flat, bare feet or grippy socks only, and one kid on the wrap at a time — bubble wrap on a hard floor turns into a slide if two kids crowd it.",
      copy_free=True, no_elimination=True),

    A("cardboard-tunnel-crawl", "Cardboard Tunnel Crawl",
      "Big boxes taped into a crawl-through tunnel with peek windows — greeters wave from outside, crawlers travel through.",
      ["pe-movement"], (3, 5), (2, 16), (15, 25), ["indoor", "outdoor"],
      ["large cardboard boxes (appliance or moving boxes, 2-4)", "strong tape", "a blanket (to drape over one section)"],
      False, "An adult builds it, start to finish: open both ends of each box, tape the boxes end to end into one tunnel, and cut two or three peek windows in the sides — adults only, before kids arrive. Run a hand along every inside edge feeling for staples and pull any you find. Wedge chairs against the outside if the tunnel wants to wander.",
      ["Walk the group around the outside first and look in through the windows. A tunnel you have inspected from outside is a lot less mysterious from inside.",
       "One kid crawls through at a time, one direction only — in the wide end, out the far end, walk back around the outside.",
       "Post greeters at the windows: wave at each crawler as they pass, call their name, send them on their way.",
       "Drape the blanket over the middle box for the last rounds — the night tunnel. Any kid who would rather not crawl it takes a greeter post instead; same game, outside job.",
       "Finish with a parade round: everyone who wants a last crawl takes one, then the group helps an adult fold the boxes flat for next time."],
      "One box only, both ends wide open, an adult face visible at the far end for the whole crawl.",
      "Carry a beanbag through and deliver it to the greeter at the far end — a postal tunnel.",
      safety="Adults build and cut; kids never do. Check for staples and tape down rough edges, and never let anyone climb or sit on top — a tunnel that folds with a kid inside stops being a toy. Both ends stay open and unblocked at all times.",
      copy_free=True),

    A("hello-ball-greetings", "Hello Ball Greetings",
      "Sit in a circle, roll a soft ball to a friend, and say their name out loud — the first icebreaker that works at three.",
      ["icebreakers", "team-community"], (3, 5), (4, 20), (10, 15), ["indoor", "outdoor"],
      ["a soft, easy-grip ball (foam or playground ball, not a hard ball)"],
      True, "Sit in a circle close enough that a rolled ball reaches the kid across without a chase. Sit in the circle yourself — at three, the adult is a player, not a referee.",
      ["Start every round yourself: roll the ball slowly to one kid and say it the way you want to hear it back — 'Hello, Sam.' Sam catches or stops the ball.",
       "Sam rolls it to someone new and greets them by name. A name that won't come gets a whisper from a neighbor or from you — nobody sits stuck holding the ball.",
       "Keep it moving: the greeter becomes the roller, and the game walks itself around the circle two or three times.",
       "Change the greeting, not the game: round two adds a wave, round three is a hello in your silliest quiet voice.",
       "Finish when every kid has been greeted at least twice — say so out loud as the last roll lands, so the shy kids hear their count too."],
      "A smaller circle and a bigger ball; if rolling is still too much, the adult passes every ball hand to hand.",
      "Add the return greeting — the catcher says 'Hello back' and the roller's name before rolling on. That is the first real name-memory game.",
      safety="The ball rolls on the floor, never throws — a foam ball at three is a rolling toy, full stop.",
      copy_free=True, no_elimination=True,
      inclusion="A greeting is any clear hello — a wave, a sign, a word tapped out on the floor. A kid who doesn't talk yet greets with the ball and a wave, and gets greeted back in full, by name, like everyone else."),

    A("pouring-practice-trays", "Pouring Practice Trays",
      "A small pitcher, two cups, and a tray to catch the evidence — pouring water without flooding the table is a real skill.",
      ["quiet-focus"], (3, 5), (1, 6), (10, 20), ["indoor"],
      ["a small unbreakable pitcher or jug (kid-sized)", "two unbreakable cups", "water", "a tray with raised edges (one per kid)", "a small towel (one per tray)"],
      False, "One tray per kid, set out like a place setting: pitcher half full of water, one empty cup, one waiting cup. Half full is on purpose — a full pitcher is too heavy for small wrists, and most of it ends up on the tray. Keep a spare towel nearby; refills are adult work.",
      ["Show one pour on your own tray, slowly: two hands on the pitcher, tip gently, watch the cup, stop before the top. Name the stop out loud: 'I stop when the water gets near the rim.'",
       "Kids pour from the pitcher into the empty cup on their own trays. Whatever lands on the tray stays on the tray — that is what it is for.",
       "Pour it back. Cup to pitcher is the harder direction and everybody spills a little; the towel is part of the job, not a punishment. Wipe, reset, go again.",
       "When a kid can fill the cup cleanly twice running, give them the second cup: fill one, pour it into the other, pour it home.",
       "Close the station properly: last pour back into the pitcher, towel folded, tray carried with two hands to the drying spot, an adult walking alongside."],
      "A lighter pitcher with less water and a big, wide cup — success first, precision later.",
      "Pour to a line marked on the cup, or carry a half-full cup the length of the tray without a spill.",
      safety="Water only — no dry beans or rice for pouring practice at this age. Spilled water gets wiped up straight away so the floor stays grippy, and everything on the tray is unbreakable, always."),

    A("nature-color-match-walk", "Nature Color Match Walk",
      "Three colors on a ring, one short walk — hold your card against the leaf, the bark, the flower, and call the match.",
      ["outdoor", "seasons"], (3, 6), (2, 20), (15, 25), ["outdoor"],
      ["color cards (paint swatches or colored paper squares on a ring, 3-4 colors per kid)"],
      False, "Walk your route first and check it the way a three-year-old will meet it: nothing at grabbing height you will have to police all walk, no broken glass, a clear turnaround point. Pick colors the route actually has — brown and green always, plus one flower color in season.",
      ["Hand out the color rings and make the first match together, right where you stand: hold the green card against a leaf. 'Match.' That one word runs the whole walk.",
       "Walk slowly. When a kid spots a match they stop, hold the card next to the thing, and show a neighbor. Touch gently or just point — living things stay where they live.",
       "Regroup at the turnaround point and hold up each color: who found the hardest one? Brown gets found first and argued about most.",
       "Walk back looking for the one color nobody matched. If it truly isn't out there, say so honestly and swap in a color that is — the route sets the game, not the cards.",
       "Finish on the steps or under a tree: lay the rings in a row and tell the walk back by its colors — green leaf, brown bark, yellow flower — once through, in order."],
      "Two colors only, both of them everywhere (green and brown), and a shorter route.",
      "Four or five colors with one hard one (purple, white), or count shades: light green and dark green are two different finds.",
      safety="Stay where the adult can see every kid, nothing goes in mouths on a nature walk, and hands get washed when you come back in. Look and point; pick nothing living.",
      copy_free=True),

    A("torn-paper-collage", "Torn Paper Collage",
      "No scissors, no lines to follow — tear colored paper with your hands and glue the pieces into a picture only you planned.",
      ["crafts"], (3, 5), (2, 24), (15, 25), ["indoor"],
      ["colored paper (construction paper or old magazine pages)", "glue sticks", "one sturdy backing sheet per kid (card stock holds up best)"],
      False, "Tear a starter pile yourself so the table begins with success on it: some strips, some chunks. Put out paper in two or three colors only — a whole rainbow at three means twenty minutes of choosing and two minutes of gluing.",
      ["Show the tear: pinch the paper with both hands, thumbs together, pull apart slowly. The rip sound is half the fun — do it once near your ear and watch every kid try it.",
       "Everyone tears for a few minutes with no picture in mind. Big pieces, small pieces, long snakes of paper — the pile is the project at this stage.",
       "Glue time: glue stick on the backing sheet, not on the little pieces — small fingers, big stick, less wrestling. Press each piece down flat and pat it with a palm.",
       "Fill the sheet edge to edge or leave it sparse — both are finished when the kid says so. Ask 'Is it done?' and believe the answer.",
       "Walk-around to close: collages flat on the table, kids circle and point to one piece in someone else's work whose color they like. Then names go on the back in an adult's handwriting, exactly as dictated."],
      "Pre-torn pieces and a smaller backing sheet; hand-over-hand gluing help for anyone who asks.",
      "Tear to a plan: only round pieces, or a torn-shape picture — a house, a fish, a face.",
      safety="Paper and glue sticks only — tearing replaces scissors at this age on purpose. A glue stick heading toward a mouth gets swapped for a fresh job, not a lecture.",
      copy_free=True),

    # ---------------- Lunar New Year (+2 -> 5) ----------------
    A("red-envelope-wishes", "Red Envelope Wishes",
      "The real hongbao carries money and luck from elders — the classroom version carries the other half of the custom: a wish.",
      ["holidays", "crafts"], (5, 11), (2, 30), (20, 35), ["indoor"],
      ["red paper or ready-made red envelopes (one per kid)", "gold markers or gel pens", "small cards or slips of paper", "stickers (optional, for sealing)"],
      False, "If you are folding envelopes from red paper, fold one in front of the group first and keep your sample on the table. If you can, have one real hongbao from a stationery shop to pass around, so kids handle the real object before making the classroom version.",
      ["Start with the real custom, plainly: for Lunar New Year, elders give children red envelopes called hongbao, with money inside, for luck in the new year. Red is the color of luck and celebration.",
       "Say the school rule out loud before anyone makes anything: we never swap money at school, so our envelopes carry the other half of the custom — the wish. Each kid writes or draws one good wish for a classmate on a card.",
       "Make the envelope: fold one or take a ready-made envelope, and decorate the front in gold — dots, suns, waves, round coins. Gold on red is the New Year pairing.",
       "Wish cards in, envelopes sealed with a sticker, the receiver's name written big on the front.",
       "Deliver them the way the holiday delivers them: with both hands and a proper 'Happy New Year.' Envelopes go home unopened, or open together at the end — your call, but announce it before delivery, not after."],
      "Ready-made envelopes and drawn wishes; the adult writes the wish words the kid dictates.",
      "Find one traditional New Year greeting, write it in your own words inside the card, and say where it comes from.",
      tags=LNY, copy_free=True,
      inclusion="This is a classroom version and it says so: a real hongbao carries money from elders, and swapping in wishes is a school adaptation, named as one — never presented as the tradition itself. Families who celebrate are the experts in the room; a kid may add or correct, but no child gets put on the spot to perform their own holiday."),

    A("zodiac-great-race-sequence", "Zodiac Great Race — Story Sequence",
      "The folk tale of the Jade Emperor's river race, told straight — then twelve animal cards to put back in finishing order.",
      ["holidays", "quiet-focus"], (5, 10), (2, 24), (20, 30), ["indoor"],
      ["a published retelling of the Great Race (picture book), or the teacher's own told version", "twelve animal cards — rat, ox, tiger, rabbit, dragon, snake, horse, goat, monkey, rooster, dog, pig (one set per small group)"],
      False, "Read the story once yourself before the session — the finishing order is the whole game and you need it cold: rat first (he rode in the ox's ear), pig last. Shuffle each group's twelve cards into one face-up pile.",
      ["Tell it as what it is: a folk tale told for a very long time to explain how the twelve animals of the Chinese zodiac got their order — the Jade Emperor's race across a river. A told story, not a history lesson; say that difference once, clearly.",
       "Read or tell the race in full, slowly, naming each animal as it finishes. Kids hold up a finger for each finisher and count along.",
       "Groups get their shuffled cards: put the race back in order on the table, start line to finish line. The story is the answer key — retell the tricky middle as they sort (the dragon stopped to make rain; the snake hitched a ride on the horse).",
       "Check against the real order together, card by card. A group that disagrees defends its order from the story — 'the rat jumped off the ox's ear at the finish' is a complete argument.",
       "Close by finding your own year: count the twelve-year cycle around the cards from a year you know, and let every kid point to their animal. No ranking and no best animal — the race already did the ranking, and the pig came last by napping, which the group will agree is fair."],
      "Six animals only — the first six finishers — with picture clues from the story on the board.",
      "Retell the race as a six-panel comic, one panel per turning point, in the group's own words.",
      tags=LNY, copy_free=True,
      inclusion="The Great Race is a living folk tradition, told straight from a published retelling and named as a legend — nobody dresses up as the animals and the zodiac is never a costume. Kids whose families follow the zodiac usually know their animals already; let them be the ones who knew first."),

    # ---------------- Valentine's Day (+2 -> 6) ----------------
    A("kindness-post-office", "Kindness Post Office",
      "A working classroom post office for Valentine's Day — named mailboxes, stamped cards, and a ledger that guarantees nobody gets nothing.",
      ["holidays", "team-community"], (4, 9), (6, 32), (25, 40), ["indoor"],
      ["one paper bag or shoebox mailbox per kid", "cards and paper for valentines", "crayons and markers", "stickers", "a stamp sticker or hand-drawn stamp for each finished card"],
      False, "Line the mailboxes up where everyone can reach them — delivery is the game, so no mailbox on a high shelf. Keep the class list beside you as a private delivery ledger: note who has received cards as the session goes, because the fourth step depends on it.",
      ["Open the post office properly: every kid decorates a mailbox with their own name, big and readable. A mailbox nobody can read delivers nothing.",
       "Set the one rule that makes it Valentine's and not just mail: every card says or shows one true, specific kind thing. 'You always save me a swing' beats 'You are nice' every time. Give two examples and one non-example.",
       "Writing and drawing round: each kid makes at least two cards, for two different classmates. Finished cards get stamped, and the postal workers — you, plus any fast finishers — deliver as they go.",
       "Mid-session, check the ledger. Any mailbox still empty gets a card from you, written and specific, plus a quiet word to a kind-hearted fast finisher: 'The post office needs one more for this box.' Nobody sits watching a full box next to their empty one.",
       "Closing delivery: everyone collects their mail at once and opens it at their seat. The sound the room makes then is the entire reason for the activity."],
      "Drawn cards with dictated words; one card required, more welcome.",
      "Run a real sorting round — cards bundled by mailbox row and delivered by a rotating postal crew with a set route.",
      tags=VAL, no_elimination=True,
      inclusion="The ledger step is this activity's conscience: the adult tracks deliveries privately and guarantees every kid a real, specific card. A Valentine's activity where one child gets nothing has failed at its only job."),

    A("fold-and-open-hearts", "Fold-and-Open Symmetry Hearts",
      "Fold, draw half a heart on the fold, cut, open — the fold did the matching. Symmetry you can hold up to the light.",
      ["holidays", "stem"], (4, 8), (2, 28), (15, 25), ["indoor"],
      ["colored paper (reds and pinks, plus any color a kid insists on)", "blunt scissors", "pencils", "string and tape (for a garland, optional)"],
      False, "Fold and cut one heart yourself first, and keep the folded half — the before — next to the opened heart. That pair of papers teaches the whole lesson before you say a word.",
      ["Show the trick plainly: folded paper, a half-heart drawn along the fold, one cut, opened up — a whole heart with both sides matching. 'The fold did the matching' is the sentence of the day.",
       "Kids fold their own paper in half, crease it hard with a fingernail, and draw half a heart against the fold: bump at the top, point at the bottom.",
       "Cut on the line — an adult cuts for anyone whose scissors are still new — then open slowly and check the match: hold it to the light, fold it back shut, do the two halves sit on each other?",
       "Make three more and sort them: biggest, smallest, best match. A lopsided heart gets talked through out loud — was the drawing off the fold, or the cut? — and remade. Paper is cheap, and the fix is the learning.",
       "String the best-matching hearts into a garland for the window, fold lines vertical, so the symmetry is the decoration."],
      "The adult pre-draws the half-heart on the fold; the kid only cuts and opens.",
      "Cut a small pattern into the folded edge — notches, a tiny window — and predict what the opened heart will show before opening it.",
      safety="Blunt scissors and seated cutting; an adult does the cutting for any kid who asks or whose hands aren't there yet. Nobody bleeds for a valentine.",
      tags=VAL, copy_free=True),
]

COLLECTION = {
    "id": "little-hands-first-years",
    "title": "Little Hands, First Years",
    "glyph": "\U0001F9F8",
    "when_to_use": "Built for the youngest kids in the building: every pick here was designed for three-year-olds first — short runs, big pieces, one rule per game, and honest about what small hands can actually do. The shelf to grab when the little-kid group lands on you at the last minute.",
    "picks": [
        {"id": "tape-path-balance-walk", "note": "The first balance beam is a line of tape — slow feet, airplane arms, and nobody falls off a line."},
        {"id": "pom-pom-drop-tubes", "note": "Drop, wait, there it is — cause and effect at exactly the speed a three-year-old runs it."},
        {"id": "sponge-squeeze-station", "note": "Moving water one squeeze at a time, with the towel counted as part of the job."},
        {"id": "sound-match-shakers", "note": "Find the shaker that sounds like yours — sealed tight by an adult, matched by ear or by colored dot."},
        {"id": "bubble-wrap-stomp-path", "note": "Stomp round, tiptoe round, crawl round. The tiptoe round is harder than it looks."},
        {"id": "cardboard-tunnel-crawl", "note": "Adult-built and staple-checked, both ends open. The window greeters have the best job in the room."},
        {"id": "hello-ball-greetings", "note": "The first icebreaker that works at three: roll, catch, 'Hello, Sam.'"},
        {"id": "pouring-practice-trays", "note": "A half-full pitcher and a tray underneath — spills are expected, and wiping them is part of the work."},
        {"id": "nature-color-match-walk", "note": "Three colors on a ring, a short route, and the rule that living things stay where they live."},
        {"id": "torn-paper-collage", "note": "Tearing is the skill scissors come after. Glue on the sheet, palm-pat, done when they say so."},
        {"id": "color-sorting-trays", "note": "The shelf's old faithful — sorting by color with big pieces and no way to be wrong."},
        {"id": "big-brush-painting", "note": "Big brushes, big paper, whole-arm strokes — painting at the scale a three-year-old's shoulder actually works at."},
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
