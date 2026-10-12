#!/usr/bin/env python3
"""Wave 12: append the summer seasonal pack (25 activities).

Run once: dedupes by id, writes data/activities.json.
Run scripts/build.py afterwards.

All original words per PIPELINE.md. Classic public-domain concepts
(water balloon toss, capture the flag, friendship bracelets, sun prints,
ice excavations, parade floats) described in our own words.
New tags: season:summer, holiday:july-4th.
Retro-tags: ice-cube-painting, water-relay, chalk-art, water-cycle-in-a-bag
gain season:summer (tags only — descriptions untouched).

Sun/heat/water safety notes are practical (shade, water breaks, clean up
balloon pieces) — no medical claims anywhere.
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

S = ["season:summer"]
SJ = ["season:summer", "holiday:july-4th"]

SUMMER_PACK = [
# ---------------- water play (6) ----------------
A("water-balloon-toss", "Water Balloon Toss",
  "Partners toss a water balloon back and forth, stepping back after every catch.",
  ["outdoor", "pe-movement", "seasons"], (5, 12), (4, 30), (15, 30), ["outdoor"],
  ["water balloons (fill 3 per pair)", "a hose or bucket for filling",
   "a trash bag for the pieces"],
  False,
  "Fill balloons ahead — about 3 per pair — and keep them in a bucket or "
  "cooler. Mark two facing lines on the grass and hand out the trash bag.",
  ["Pair everyone up and line the pairs up facing each other, one big step "
   "apart.",
   "One partner tosses the balloon to the other. Catch it, don't spike it.",
   "Every successful catch: both partners take one big step back.",
   "Dropped or popped balloon? That pair is out — they become the cheering "
   "section.",
   "Last dry pair wins. Cleanup first: everyone hunts balloon pieces before "
   "the next game."],
  "Partners stay at arm's length the whole game — no stepping back.",
  "Bonus round: the final two pairs keep going until there is one balloon left.",
  "Pick up every balloon piece — they are a choking hazard for small kids "
  "and litter for the yard. Toss underhand only, never at faces.",
  S),

A("drip-drip-drop", "Drip Drip Drop",
  "Duck-duck-goose with a wet sponge — the 'goose' gets a squeeze overhead.",
  ["outdoor", "pe-movement", "seasons"], (4, 10), (6, 30), (15, 25), ["outdoor"],
  ["one big soft sponge", "a bucket of water"],
  False,
  "Fill the bucket, soak the sponge, and wring it once so it drips but "
  "doesn't pour. Kids sit in a circle on the grass.",
  ["One kid is it and walks the circle with the dripping sponge, tapping "
   "heads: 'drip, drip, drip…'",
   "On 'DROP!' they squeeze the sponge over that kid's head and run.",
   "The dropped-on kid chases them around the circle for the empty spot.",
   "Caught? The chaser stays it. Made it around? The chaser sits and the "
   "runner picks the next it.",
   "Re-soak the sponge every few rounds — a dry sponge is just a head tap."],
  "The teacher is always it; kids only run the chase.",
  "Two sponges, two runners — twice the sprints, half the waiting.",
  "Squeeze gently, never hard. Barefoot-friendly grass only — no running "
  "on wet concrete.",
  S),

A("bucket-brigade-race", "Bucket Brigade Race",
  "Teams pass water down a line — over heads, under legs — to fill the far bucket.",
  ["outdoor", "team-community", "seasons"], (5, 12), (8, 30), (15, 25), ["outdoor"],
  ["2 buckets per team", "1 cup or small pitcher per kid", "a hose or "
   "water source for refills"],
  False,
  "Set a full bucket at each team's start and an empty one at the far end, "
  "about 15 feet away. Line teams up between them.",
  ["On 'go', the first kid dips their cup, lifts it overhead, and pours "
   "it into the cup of the kid behind them — no looking back.",
   "The water travels down the line, cup to cup, to the last kid, who dumps "
   "it in the far bucket and runs the empty cup back to the front.",
   "Rotate the line order every round so everyone gets the anchor spot.",
   "First team to fill their far bucket to the tape line wins.",
   "Losers' prize: everyone gets to dump their own bucket over their own "
   "head."],
  "Short lines of 4, and kids pour hand-to-hand at chest height instead of "
  "overhead.",
  "Backwards round: the line faces the other way and passes under their legs.",
  "Wet ground gets slippery — run it on grass, not pavement. Water breaks "
  "for the runners, not just the buckets.",
  S),

A("sponge-launch-bullseye", "Sponge Launch Bullseye",
  "Soaked sponges fly at chalk targets — points for the bullseye, splash for style.",
  ["outdoor", "pe-movement", "seasons"], (5, 12), (4, 30), (15, 30), ["outdoor"],
  ["big soft sponges (2 per kid)", "buckets of water", "sidewalk chalk",
   "masking tape for the throw line"],
  False,
  "Draw 3 or 4 big bullseye targets on pavement with chalk, numbered 10-25-50. "
  "Tape a throw line 10 feet back. Soak the sponges.",
  ["Each kid gets two throws per round at any target they choose.",
   "Points are where the sponge's wet splat mark lands — argue the line "
   "calls like pros.",
   "Re-soak between rounds; a dry sponge doesn't count.",
   "After 5 rounds, the top two scorers face off in a sudden-death bullseye "
   "round.",
   "Rinse-off finale: leftover sponges get launched at the teacher's feet "
   "(permission granted, aim low)."],
  "Bigger targets, closer line, one throw per round.",
  "Moving bonus: a volunteer walks a sponge-bucket slowly across the back — "
   "hit it mid-walk for double points.",
  "Throw sponges, never at faces. Re-chalk targets when they wash away — "
  "slippery chalk dust underfoot gets swept.",
  S),

A("foam-noodle-tag", "Foam Noodle Tag",
  "Tag with foam pool noodles — everyone is armed, nobody gets hurt.",
  ["outdoor", "pe-movement", "seasons"], (5, 12), (6, 30), (15, 25), ["outdoor"],
  ["foam pool noodles (1 per kid, cut in half)", "cones or chalk for "
   "boundaries"],
  False,
  "Cut full noodles in half — short noodles, less whipping. Mark clear "
  "boundaries with cones. Everyone gets a noodle, including it.",
  ["One kid is it. A noodle tap — arm or leg only — makes you it.",
   "New it must drop their noodle for 3 seconds (the 'cooldown') before "
   "chasing — no instant revenge tags.",
   "Tag-backs are banned for 30 seconds: count it out loud together.",
   "Every 3 minutes, freeze and rotate: the last three its become safe-zone "
   "guards for one round.",
   "End with the noodle salute: everyone taps noodles overhead at once."],
  "Walk, don't run — and noodles stay at waist height or below.",
  "Shadow tag round: its tag by stepping on shadows; noodles become "
  "victory flags.",
  "Foam only, never wood or plastic bats. Head and face are off-limits — "
  "a head tap resets the game, not the tag.",
  S),

A("sprinkler-limbo", "Sprinkler Limbo",
  "Limbo under the sprinkler stream — how low can you go before you're soaked?",
  ["outdoor", "pe-movement", "seasons"], (4, 12), (4, 30), (15, 25), ["outdoor"],
  ["an oscillating or fan sprinkler", "a hose", "towels"],
  False,
  "Set the sprinkler on grass with room to approach and exit. Mark the "
  "limbo lane with chalk — straight at the stream.",
  ["The sprinkler arcs overhead; kids limbo-walk under the stream one at a time.",
   "Touch the water? You're 'soaked out' — grab a towel and join the "
   "cheering line.",
   "Each round, lower the sprinkler arc (or the bar-pole beside it) one notch.",
   "Last kid still dry-ish wins the Golden Towel.",
   "Everyone finishes with a full run through the sprinkler — no dry "
   "witnesses."],
  "No limbo: just run through the stream and strike a pose at the end.",
  "Team edition: pairs limbo together holding hands — coordination beats "
  "flexibility.",
  "Grass only — wet pavement plus limbo is a fall waiting to happen. "
  "Shade and water breaks between rounds on hot days.",
  S),

# ---------------- outdoor / camp games (5) ----------------
A("capture-the-flag-basics", "Capture the Flag Basics",
  "Two teams, two flags, one field — the summer-camp classic, simplified.",
  ["outdoor", "team-community", "seasons"], (7, 12), (8, 30), (25, 45), ["outdoor"],
  ["2 bandanas or flags", "cones for the center line and jail zones",
   "whistle"],
  False,
  "Split the field with cones, mark a jail box on each side, and plant each "
  "flag where it is visible but not trivial. Two even teams.",
  ["Each team hides nothing — flags stay visible from the center line at "
   "all times.",
   "Cross into enemy territory to grab their flag; get tagged and you sit "
   "in jail.",
   "A teammate can free you with a hand-tag — both of you get a free walk "
   "back to your side.",
   "First team to carry the enemy flag across the center line wins the round.",
   "Best of three rounds, then the MVPs pick the next game's teams."],
  "Smaller field, flags on poles (no hiding), and jail is a 30-second "
  "time-out instead of waiting.",
  "Night-vision round at dusk with glow bracelets for team colors.",
  "Set hard boundaries before starting — roads and parking lots are "
  "out of bounds, no exceptions. Sunscreen, shade, and water breaks; "
  "call the game at the first sign of heat exhaustion.",
  S),

A("flashlight-tag", "Flashlight Tag",
  "Tag by flashlight beam on a summer evening — freeze when the light finds you.",
  ["outdoor", "pe-movement", "seasons"], (6, 12), (6, 24), (20, 35), ["outdoor"],
  ["one flashlight per 4 kids (it holds one)", "glow bracelet for it",
   "cones for boundaries"],
  False,
  "Play at dusk in a familiar, enclosed yard — no woods, no streets. Bound "
  "it tight with cones. One flashlight for it, glow bracelet so everyone "
  "can see them.",
  ["It counts to 30 with eyes closed while everyone hides within bounds.",
   "It sweeps the flashlight beam — anyone the beam touches freezes in place.",
   "Frozen players can be unfrozen by a free player tagging their shadow "
   "(no beam needed, just a hand tag).",
   "Round ends when everyone is frozen or the whistle blows at 10 minutes.",
   "New it: the first player frozen becomes it next round."],
  "Daylight version: tag by pointing, no hiding — just the beam-freeze rule.",
  "Two flashlights, two its, and frozen players become 'lighthouses' who "
   "can freeze others with finger-beams.",
  "Stay inside the coned boundary — no hiding near roads, water, or "
  "parking lots. An adult holds the boundary line the whole game.",
  S),

A("chalk-obstacle-course", "Chalk Obstacle Course",
  "Draw the course, then run it: hop, spin, crab-walk, and freeze between stations.",
  ["outdoor", "pe-movement", "crafts", "seasons"], (4, 12), (2, 30), (20, 40), ["outdoor"],
  ["sidewalk chalk (lots)", "a stopwatch or phone timer"],
  False,
  "Find a stretch of pavement and sketch the course first: stations every "
  "10 feet or so, arrows between them.",
  ["Station ideas: hopscotch squares, a spin circle ('spin 3 times'), "
   "crab-walk lane, balance line, jumping jacks box, freeze square.",
   "Kids run the course in order, doing each station's move before advancing.",
   "Time the runs — then let kids redesign one station and run it again.",
   "Team relay: each runner does two stations, then tags the next.",
   "Championship: the course design contest — best new station gets added "
   "permanently."],
  "Four stations max, all walking-speed, with picture labels.",
  "Blindfold-guide round: one partner calls directions through the course "
  "while the other (eyes open, promise) follows exactly.",
  "Chalk dust is slippery when thick — sweep the lane between runs. Hats "
  "and water on hot pavement days.",
  S),

A("frisbee-golf-nine", "Frisbee Golf Nine",
  "Nine chalk-and-cone 'holes' around the field — fewest throws wins.",
  ["outdoor", "pe-movement", "seasons"], (6, 12), (2, 24), (25, 45), ["outdoor"],
  ["frisbees or foam discs (1 per 2 kids)", "9 cones or buckets as holes",
   "chalk for tee markers", "scorecards and pencils"],
  False,
  "Set 9 holes around the field — cones, buckets, or chalk circles — each "
  "with a tee marker 20 to 40 feet back. Number them with chalk.",
  ["Groups of 2 to 4 start at different holes to avoid traffic jams.",
   "Throw from the tee; wherever the disc lands, that's your next lie.",
   "Hole is finished when the disc lands inside the target circle.",
   "Count every throw. Lowest total after 9 holes wins.",
   "Award ceremony: longest throw, best recovery, most creative throwing "
   "style."],
  "Five holes, closer tees, and buckets instead of circles — bigger targets.",
  "Trick-shot hole: one hole must be played between the legs or behind "
  "the back.",
  "Foam discs only near groups — never throw toward another hole's players. "
  "Call 'fore!' (or just 'heads up!') on wild throws.",
  S),

A("nature-color-scavenger", "Nature Color Scavenger",
  "Find something in nature for every color of the rainbow — no picking allowed.",
  ["outdoor", "seasons", "quiet-focus"], (4, 12), (2, 30), (20, 35), ["outdoor"],
  ["paper color cards or a printed rainbow strip per team", "bags for "
   "fallen items only"],
  False,
  "Make color cards (red, orange, yellow, green, blue, purple, brown, gray). "
  "Set the search boundary — the yard, the garden beds, the nature strip.",
  ["Teams get a color card set and 15 minutes on the clock.",
   "Find something in nature matching each color — a fallen leaf, a pebble, "
   "a petal already on the ground.",
   "Nothing gets picked, pulled, or dug up: fallen and found only.",
   "Back at base, each team lays out its rainbow and tells the story of "
   "the hardest color.",
   "Bonus point for the weirdest natural object that still counts as a color.",
  ],
  "Four colors instead of eight, and the teacher pre-hides painted rocks "
  "as guaranteed finds.",
  "Texture round: find something smooth, rough, bumpy, and soft — then "
  "rank them by touch alone, blindfolded.",
  "Look with eyes first near bushes and logs — check for bees and thorns "
  "before reaching. Wash hands after handling soil and found objects.",
  S),

# ---------------- summer crafts (4) ----------------
A("friendship-bracelet-basics", "Friendship Bracelet Basics",
  "The camp classic: knotted embroidery floss bracelets, learned in one sitting.",
  ["crafts", "quiet-focus", "seasons"], (7, 12), (2, 30), (25, 45), ["indoor"],
  ["embroidery floss in many colors", "safety pins or tape", "scissors",
   "pillows or clipboards to pin to"],
  False,
  "Cut floss into arm-length strands (3 per bracelet). Knot the tops "
  "together and pin them to pillows — one workstation per kid.",
  ["Pick 3 colors and knot them together at the top.",
   "Learn the only knot that matters: the forward knot — make a '4' with "
   "the working thread, pull the tail through, slide it up. Twice per knot.",
   "Work left to right, one color at a time, until the bracelet fits "
   "around a wrist.",
   "Tie the end in a knot, braid the tails, and gift it — bracelets are "
   "for giving.",
   "Trade-up round: everyone makes one for the person on their left."],
  "Two colors, chunky yarn instead of floss, and the teacher ties the "
  "starting knot.",
  "Pattern challenge: stripes, chevrons, then the diamond — photograph "
  "each stage for the camp board.",
  "Safety pins pin to pillows or denim, never to skin. Scissors cut away "
  "from fingers.",
  S),

A("sun-print-cards", "Sun Print Cards",
  "Lay objects on sun-sensitive paper, let the sun do the printing.",
  ["crafts", "stem", "seasons"], (5, 12), (2, 30), (20, 35), ["outdoor", "indoor"],
  ["sunprint (cyanotype) paper", "flat interesting objects: leaves, keys, "
   "lace, coins", "a shallow tray of water", "cardstock for mounting"],
  False,
  "Keep the sunprint paper in its black bag until the last second — it "
  "exposes fast. Set up a water rinse tray in the shade.",
  ["In the shade, arrange flat objects on the blue side of the paper.",
   "Carry it into full sun and wait 3 to 5 minutes — the paper darkens "
   "around the objects.",
   "Rinse the paper in the water tray for one minute: the background turns "
   "deep blue, the shapes stay white.",
   "Lay flat to dry, then mount on cardstock for a finished card.",
   "Experiment round: half the exposure time, double it — compare the three "
   "blues."],
  "The teacher handles the paper; kids only arrange objects and carry "
  "with two hands.",
  "Negative-space art: spell a name in objects and print the whole word "
  "in one exposure.",
  "Don't stare at the sun while timing exposures — use a timer and look "
  "away. Rinse water only, no chemicals to handle.",
  S),

A("pinwheel-garden", "Pinwheel Garden",
  "Paper pinwheels on sticks — then plant the whole spinning garden.",
  ["crafts", "seasons"], (4, 12), (2, 30), (20, 35), ["indoor", "outdoor"],
  ["square paper (6 inch)", "pencils with erasers", "pushpins",
   "scissors", "straws or dowels", "tape"],
  False,
  "Pre-cut 6-inch squares for little ones. Push the pins through pencil "
  "erasers ahead of time so no one is forcing them.",
  ["Fold the square corner to corner both ways and unfold — find the center.",
   "Cut along each fold from the corner toward the center, stopping a "
   "thumb's width short.",
   "Fold every other point into the center and pin through all layers into "
   "the pencil eraser.",
   "Tape the pencil to a straw for height.",
   "Plant the garden: stick them in the ground along the walkway and watch "
   "the wind do the work."],
  "The teacher does all cutting and pinning; kids decorate and plant.",
  "Two-tone pinwheels: glue two contrasting squares back to back before "
  "cutting.",
  "Pushpins are teacher-handled — pinched fingers, not pierced ones. "
  "Blow, don't run with the pinwheel.",
  S),

A("sand-art-bottles", "Sand Art Bottles",
  "Layered colored sand in clear bottles — desert landscapes you can shake.",
  ["crafts", "seasons"], (4, 12), (2, 30), (20, 35), ["indoor"],
  ["clear plastic bottles with caps", "colored craft sand", "paper funnels "
   "or rolled paper", "trays to catch spills", "corks or caps"],
  False,
  "Pour each sand color into its own tray with a funnel. One bottle per "
  "kid, caps off, trays under everything — sand travels.",
  ["Pick your first color and funnel in one inch of sand.",
   "Tilt the bottle and pour the next color against the side — layers stay "
   "cleaner on a tilt.",
   "Alternate colors and thicknesses: thin stripes, thick bands, a "
   "mountain layer.",
   "Top it off to the very brim so the layers can't shift, then cap it tight.",
   "Name your landscape and shelve it where the light hits — do not shake "
   "(or do, once, to learn why not)."],
  "Three colors max, wide-mouth bottles, and the teacher pours while the "
   "kid picks colors.",
  "Pattern challenge: symmetrical layers mirrored top to bottom.",
  "Sand stays in the trays — no throwing, no rubbing eyes. Shake hands "
  "clean before touching faces.",
  S),

# ---------------- beat-the-heat indoor backups (4) ----------------
A("ice-excavation-dig", "Ice Excavation Dig",
  "Tiny toys frozen in a block of ice — excavate them with salt and droppers.",
  ["stem", "quiet-focus", "rainy-day", "seasons"], (4, 12), (2, 30), (25, 45), ["indoor"],
  ["small plastic toys or figures", "freezer containers", "salt in shakers",
   "water droppers or spray bottles", "trays and towels"],
  False,
  "Freeze the night before: toys in water-filled containers, frozen solid. "
  "One block per pair, each on a tray with towels underneath.",
  ["Pop each block out and set the excavation challenge: free every toy.",
   "Tools allowed: salt shakers, water droppers, and patience. No hammers, "
   "no teeth.",
   "Sprinkle salt on the ice, wait 30 seconds, then drip warm water on the "
   "salty spots — watch the tunnels form.",
   "First pair to free all their toys calls 'excavation complete'.",
   "Science talk: why did the salt spots melt first? Test it — one cube "
   "with salt, one without, race them."],
  "Crushed-ice cups instead of solid blocks: toys half-buried, dig with "
  "spoons.",
  "Timed paleontology: photograph each freed toy like a museum specimen "
  "and label the 'strata' it came from.",
  "Meltwater goes in trays, not on the floor — wet floors, wet socks, "
  "slipped kids. Towels down before blocks come out.",
  S),

A("fan-boat-races", "Fan Boat Races",
  "Paper boats race across a tub — powered by nothing but fanned air.",
  ["stem", "rainy-day", "seasons"], (5, 12), (2, 30), (25, 45), ["indoor"],
  ["paper for folding boats", "a long shallow tub or storage bin",
   "hand fans or stiff paper fans", "towels", "tape for lane lines"],
  False,
  "Fill the tub a few inches deep and tape two lane lines. Fold one demo "
  "boat slowly so everyone sees the steps; stack paper for the fleet.",
  ["Everyone folds a classic paper boat — teacher demos, kids follow.",
   "Float-test: set boats in the tub. Leakers get 2 minutes of repairs.",
   "Racers stand at one end with fans. On 'go', fan your boat down the lane "
   "— no touching the boat, no blowing with mouths.",
   "First boat to cross the far tape wins the heat; winners race winners.",
   "Redesign round: fold a wider, narrower, or double-hull boat and re-race.",
  ],
  "Pre-folded boats; kids decorate and fan only.",
  "Storm round: everyone fans at once from both ends — last boat floating "
  "upright wins.",
  "Towels around the tub before racing starts — splashes happen. Paper "
  "cuts: fold slowly, crease with a ruler edge.",
  S),

A("indoor-campfire-circle", "Indoor Campfire Circle",
  "Build a paper campfire, kill the lights, and tell stories around it.",
  ["rainy-day", "quiet-focus", "team-community", "seasons"], (4, 12), (4, 30), (20, 35), ["indoor"],
  ["brown paper bags or construction paper", "red, orange, yellow tissue "
   "paper", "a battery tea light or flashlight", "stones or gray paper "
   "for the ring"],
  False,
  "Tear or cut brown paper into log shapes. Cut tissue into flame shapes. "
  "Arrange seating in a tight circle before building.",
  ["Build the fire ring: gray paper stones in a circle on the floor.",
   "Crisscross the paper logs teepee-style inside the ring.",
   "Tuck tissue flames up through the logs — red outside, yellow inside.",
   "Set the battery light in the middle, dim the room lights, and gather "
   "around.",
   "Story rounds: each kid adds one sentence to the campfire tale. The "
   "flames 'grow' (add tissue) when the story gets exciting."],
  "The teacher builds the fire; kids add flames and tell the story.",
  "Shadow round: one flashlight behind the fire throws giant story "
  "shadows on the wall — act out the tale.",
  "Battery lights only — no real flames, ever, indoors. Keep the circle "
  "wide enough that no one trips into the 'fire'.",
  S),

A("shadow-puppet-matinee", "Shadow Puppet Matinee",
  "Cardboard puppets, one flashlight, a dark room — the hottest-hour show.",
  ["crafts", "quiet-focus", "rainy-day", "seasons"], (5, 12), (2, 30), (30, 50), ["indoor"],
  ["black cardstock", "scissors", "tape", "sticks, straws, or pencils",
   "a flashlight", "a white sheet or blank wall"],
  False,
  "Hang the sheet or clear a blank wall. Test the flashlight distance — "
  "about 6 feet back gives big, sharp shadows. Pre-cut puppet blanks for "
  "little ones.",
  ["Draw a character on black cardstock — animals read best in shadow — "
   "and cut it out.",
   "Tape it to a stick. That's your actor.",
   "Rehearse behind the sheet: figure out which way is up in shadow-land "
   "(it's backwards the first time, every time).",
   "Groups of 3 get 5 minutes to stage a one-minute scene.",
   "Matinee: lights down, audience seated, each troupe performs. Applause "
   "is mandatory.",
   "Encore: the whole cast does a shadow dance finale behind the sheet."],
  "Pre-cut animal shapes; kids tape and perform only.",
  "Multi-light show: two flashlights at angles make double shadows — "
  "choreograph them.",
  "Scissors safety as always. Flashlights never pointed at eyes — the "
  "beam aims at the sheet, period.",
  S),

# ---------------- summer camp program (2) ----------------
A("camp-week-kickoff", "Camp Week Kickoff",
  "The opening assembly that turns 30 strangers into one camp: cheer, map, first mission.",
  ["team-community", "icebreakers", "outdoor", "seasons"], (5, 12), (10, 60), (30, 50), ["outdoor", "indoor"],
  ["a big paper week-map or whiteboard", "markers", "a camp cheer (made up "
   "on the spot)", "name tags and markers"],
  False,
  "Draw the week-map: five big boxes labeled with each day's theme. Set "
  "chairs in a wide circle. Have name tags ready.",
  ["Everyone writes a name tag with their name plus one summer thing they "
   "love.",
   "Name game lightning round: each kid says their name with a move; the "
   "whole circle repeats it.",
   "Invent the camp cheer together — three words, one stomp, one clap. "
   "Practice it twice.",
   "Unveil the week-map: walk through each day's headline so the week has "
   "a shape.",
   "First mission: mixed teams get one 15-minute challenge (chalk the camp "
   "motto on the walkway) and report back.",
   "Close with the cheer. Camp has officially started."],
  "Shorter circle, teacher-led cheer, and the mission is a group drawing "
  "instead of a challenge.",
  "Legacy round: each week adds one box to a season-long map — by August "
  "the wall tells the whole summer.",
  "Keep the circle in shade if outdoors — opening assemblies run long "
  "and kids wilt. Water within reach.",
  S),

A("talent-showcase-night", "Talent Showcase Night",
  "A low-pressure camp talent night format: every act gets 90 seconds and a roaring crowd.",
  ["team-community", "music-rhythm", "seasons"], (5, 12), (8, 60), (40, 60), ["indoor", "outdoor"],
  ["a sign-up sheet", "a timer", "a simple 'stage' area with seating",
   "paper programs (kids make them)", "a flashlight 'spotlight'"],
  True,
  "Tape the sign-up sheet up at lunch — acts sign themselves up, no "
  "auditions. Mark the stage area and set out seating.",
  ["Acts sign up in pairs or solos — every act gets exactly 90 seconds, "
   "timed kindly.",
   "Emcees (two volunteers) introduce each act with a made-up fancy title.",
   "The audience rule, stated up front: every act gets cheers, no act gets "
   "booed — that's the whole contract.",
   "Between acts, the emcees run 30-second crowd games (stand up if you "
   "love pizza).",
   "Finale: the counselors do a deliberately terrible act. The kids judge "
   "them, loudly.",
   "Programs get signed like yearbooks afterward."],
  "Group acts only, 60 seconds, and the teacher emcees.",
  "Theme night: every act must involve water, or shadows, or things found "
  "outside — watch creativity spike.",
  "No live flames, no throwing acts, no rooftop anything — the emcees "
  "check each act's plan at sign-up. Keep volume neighbor-friendly "
  "after dark.",
  S),

# ---------------- holidays: july 4th (2) + solstice (1) + extra water fun (1) ----------------
A("star-spangled-shoebox-parade", "Star-Spangled Shoebox Parade",
  "Decorate shoebox floats in red, white, and blue — then parade the whole route.",
  ["crafts", "holidays", "seasons"], (4, 12), (2, 30), (30, 50), ["indoor", "outdoor"],
  ["shoeboxes (1 per kid)", "red, white, and blue paper, streamers, and "
   "stickers", "glue sticks and tape", "scissors", "string for pulling"],
  False,
  "Collect shoeboxes ahead — one per kid. Cut streamer lengths and sort "
  "the red/white/blue supplies into trays by color.",
  ["Flip each shoebox upside down: that's the float base.",
   "Cover it in paper — stripes, stars, or solid colors with sticker "
   "constellations.",
   "Add streamers to the back so it flies while parading. Tie on a pull "
   "string.",
   "Line up by height, count down from ten, and parade the route: around "
   "the building, past the office, back to the room.",
   "Judging categories: most stars, best streamers, loudest cheers from "
   "the audience.",
   "Floats go home the same day — parade glory is perishable."],
  "Pre-covered boxes; kids add stickers and streamers only.",
  "Night parade: tape glow bracelets to the floats and parade at dusk.",
  "Scissors supervision. Parade route checked ahead for tripping hazards "
  "and traffic — sidewalks and fields only, never streets.",
  SJ),

A("liberty-quiz-bowl", "Liberty Quiz Bowl",
  "Team trivia on July 4th basics — the Declaration, the 13 colonies, the 50 stars.",
  ["team-community", "quiet-focus", "holidays", "seasons"], (7, 12), (6, 40), (20, 35), ["indoor"],
  ["question cards (teacher-made)", "buzzers or bells (or just hands)",
   "a scoreboard", "small prizes or stickers"],
  False,
  "Write 20 to 30 questions on cards, easy to hard. Split the room into "
  "3 or 4 teams. Set the scoreboard where everyone sees it.",
  ["Sample rounds, all real facts: What year was the Declaration of "
   "Independence signed? (1776.) How many colonies became the first "
   "states? (13.) How many stars on the flag? (50 — one per state.) What "
   "city was the first capital under the Constitution? (New York.)",
   "Teams huddle 15 seconds, then the captain answers.",
   "Steal rule: a wrong answer bounces to the next team for half points.",
   "Halftime show: each team performs its answer to 'what does freedom "
   "mean at camp?' in 30 seconds.",
   "Winners get the Golden Bell until next year; everyone gets a sticker.",
   "Fact-check any disputed answer together — the atlas and the encyclopedia "
   "outrank the loudest team."],
  "True-or-false only, teams answer together with thumbs up or down.",
  "Kids write the next year's question cards — the question-writers learn "
  "twice as much.",
  "Keep rivalry friendly: the emcee calls a reset the moment anyone's "
  "feelings get louder than the game.",
  SJ),

A("longest-day-shadow-track", "Longest Day Shadow Track",
  "Track one shadow from morning to afternoon on the solstice — the sun draws the graph.",
  ["stem", "outdoor", "seasons"], (6, 12), (2, 30), (30, 60), ["outdoor"],
  ["a tall stick or pole", "sidewalk chalk in several colors",
   "a measuring tape", "a clipboard log sheet"],
  False,
  "Plant the stick upright in a sunny paved spot first thing in the "
  "morning. Draw the first shadow outline in chalk and label it with the "
  "time.",
  ["Every hour, on the hour, trace the shadow's new position in a new "
   "chalk color and log the time and length.",
   "Predict at lunch: where will the 2 p.m. shadow fall? Mark guesses "
   "with initials.",
   "At day's end, connect the dots: the shadow drew an arc across the "
   "pavement.",
   "Read the arc together: shortest shadow = the sun at its highest = "
   "solar noon, near the longest day of the year.",
   "Photo the finished arc for the camp board — the sun signed its work."],
  "Three tracings only (morning, noon, afternoon) with the teacher "
  "handling the chalk.",
  "Week-long edition: trace the noon shadow every day for a week and "
  "watch the arc creep.",
  "Never look directly at the sun while tracking — watch the shadow, "
  "not the source. Shade, hats, and water for the trackers; rotate "
  "the job so nobody bakes.",
  S),

A("giant-bubble-chase", "Giant Bubble Chase",
  "Blow the biggest bubbles you can — then chase and pop them before they land.",
  ["outdoor", "pe-movement", "seasons"], (4, 12), (2, 30), (15, 25), ["outdoor"],
  ["bubble wands (big loops work best)", "bubble solution (dish soap + "
   "water + a spoon of sugar)", "shallow trays"],
  False,
  "Mix the solution ahead: roughly 6 cups water, 1 cup dish soap, 1 "
  "tablespoon sugar — stir gently, no foam. Pour into shallow trays, one "
  "per 4 kids.",
  ["Demo the slow pull: dip the big loop, lift it dripping, and walk "
   "backward — the bubble grows behind you.",
   "Chasers line up downwind. Blowers launch; chasers pop before landing.",
   "Rules of the chase: pop with a fingertip, not a face; one pop per "
   "bubble (no hogging).",
   "Switch roles every 5 minutes — everyone blows, everyone chases.",
   "Grand finale: the whole group launches at once and the field fills "
   "with bubbles."],
  "Small wands, seated blowing, and the teacher does the chasing demo.",
  "Bubble snake pit: everyone blows at once into one corner and counts "
   "how many bubbles fit in a hula hoop.",
  "Bubble solution stings eyes — keep a water bottle handy for rinses "
  "and remind kids to pop with fingers, not faces. Slippery when spilled: "
  "trays on grass, not pavement.",
  S),
]

# Older summer-appropriate activities: tags only, descriptions untouched.
RETRO_SUMMER = ["ice-cube-painting", "water-relay", "chalk-art",
                "water-cycle-in-a-bag"]

def main():
    path = os.path.join(DATA, 'activities.json')
    acts = json.load(open(path))
    have = {a['id'] for a in acts}
    new = [a for a in SUMMER_PACK if a['id'] not in have]
    skipped = [a['id'] for a in SUMMER_PACK if a['id'] in have]
    acts.extend(new)
    by_id = {a['id']: a for a in acts}
    retro = []
    for rid in RETRO_SUMMER:
        a = by_id.get(rid)
        if not a:
            print(f"WARN: retro id missing: {rid}", file=sys.stderr)
            continue
        tags = a.get('tags') or []
        if 'season:summer' not in tags:
            tags.append('season:summer')
            a['tags'] = tags
            retro.append(rid)
    json.dump(acts, open(path, 'w'), indent=1, ensure_ascii=False)
    open(path, 'a').write('\n')
    print(f"added {len(new)}, skipped {len(skipped)}: {skipped}")
    print(f"retro-tagged: {retro}")
    print(f"total {len(acts)}")

if __name__ == '__main__':
    main()
