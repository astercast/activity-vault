import json
import os

from add_winter import A, DATA, ROOT


PACK = [
# ---------------- Gap fills: music-rhythm (4) ----------------
A("rainstick-rhythm-circle", "Rainstick Rhythm Circle",
  "Build rainsticks, then play the weather — drizzle, rain, storm, calm.",
  ["music-rhythm"], (5, 11), (4, 24), (20, 35), ["indoor"],
  ["cardboard tubes", "rice or dried beans", "tape", "markers for decorating"],
  False, "Tape one end of each tube shut. Pour a small cup of rice/beans per tube — a little goes a long way.",
  ["Seal the tubes and decorate them — these are instruments, treat them like it.",
   "Learn the four weathers: tilt slowly (drizzle), medium (rain), fast flip (storm), still (calm).",
   "You conduct: hold up 1-4 fingers, the circle plays that weather. Change it without warning.",
   "Compose a weather report: drizzle building to storm, then calm. Play it straight through.",
   "Record it on a phone and play it back — does the recording sound like weather?"],
  "Play free rain sounds with no conducting, or use pre-made shakers.",
  "Add a thunder drum (box) for the storm, or notate the weather score with symbols.",
  safety="Tape both ends well — loose rice on the floor is a slip hazard.",
  tags=["season:winter"], copy_free=True),

A("body-percussion-patterns", "Body Percussion Patterns",
  "Stomp, clap, snap, pat — the instrument you never forget at home.",
  ["music-rhythm"], (6, 12), (2, 30), (15, 25), ["indoor"],
  [],
  True, "No setup. Clear enough floor space that stomping doesn't hit furniture.",
  ["Learn the four sounds: stomp (feet), pat (thighs), clap (hands), snap (fingers).",
   "Build a 4-beat pattern together: stomp-pat-clap-snap. Loop it until it's automatic.",
   "Split into four groups, one sound each — now the pattern plays in layers.",
   "Drop one group out, bring them back in. That's dynamics, and they just learned it.",
   "Each group invents a 4-beat pattern and teaches it. The class votes the trickiest."],
  "Use two sounds only, or echo the leader instead of layering.",
  "Notate patterns with symbols and 'perform' the notation, or add a vocal bass line.",
  tags=["season:winter"], copy_free=True, no_elimination=True),

A("call-and-response-clap", "Call and Response Clap",
  "You clap it, they clap it back — focus training disguised as a game.",
  ["music-rhythm", "icebreakers"], (4, 9), (4, 30), (10, 15), ["indoor"],
  [],
  True, "No setup — works the second the room gets loud.",
  ["Clap a short pattern. The group claps it back exactly. Start dead simple.",
   "Add one beat each round. How long a pattern can the room hold?",
   "Pass the leader role: each kid invents a pattern, the room echoes it.",
   "Speed round: patterns get faster, not longer. Precision under pressure.",
   "End with the group's longest pattern, performed once, perfectly."],
  "Leader does 2-beat patterns only, or the group echoes in pairs.",
  "Add foot stomps to the patterns, or play it as telephone — the pattern travels the circle one kid at a time.",
  tags=["season:winter"], copy_free=True, no_elimination=True),

A("found-sound-orchestra", "Found Sound Orchestra",
  "The classroom is full of instruments — you just have to audition them.",
  ["music-rhythm"], (6, 12), (4, 28), (20, 30), ["indoor"],
  [],
  True, "No setup — but set the rule first: instruments are borrowed, not broken.",
  ["Hunt: each kid finds one classroom object that makes an interesting sound. Audition it for the group.",
   "Sort the sounds: shakers, tappers, scrapers, ringers. Every orchestra needs sections.",
   "Compose: sections play in turn, then layer two, then all four. Conduct with big arm waves.",
   "Perform the piece twice — second time, one section improvises over the rest.",
   "Return everything exactly where it lived. A good orchestra leaves no trace."],
  "Teacher pre-selects safe objects, or run it with just two sections.",
  "Record and layer the sections with a phone, or score a 'soundtrack' for a silent film clip.",
  safety="Nothing glass, nothing sharp, nothing that plugs in. The audition rejects dangerous instruments.",
  copy_free=True),

# ---------------- Gap fills: rainy-day (4) ----------------
A("indoor-camping-day", "Indoor Camping Day",
  "Blanket forts, flashlight stories, trail mix — camping without the weather.",
  ["rainy-day", "team-community"], (5, 11), (4, 28), (30, 60), ["indoor"],
  ["blankets and sheets", "chairs and tables", "flashlights", "trail mix ingredients"],
  False, "Push desks into fort frames. Drape blankets — the room should look like a campsite, not a classroom.",
  ["Build the forts first: every group gets a frame and blankets. Sturdy beats pretty.",
   "Flashlight story round: one kid starts a camping story, flashlight passes, next kid continues.",
   "Trail mix assembly line: each kid adds one ingredient to the group bowl (allergy-checked).",
   "Constellation ceiling: poke holes in dark paper, hold to the light — indoor stars.",
   "Strike camp: everything folded, floor swept, room back to a classroom in 10 minutes."],
  "Build one big class fort instead of group forts.",
  "Add a 'night hike' (hallway walk with flashlights) or campfire songs (real or made up).",
  safety="Check trail mix ingredients for nut allergies — build a nut-free batch first, always.",
  tags=["season:winter"], no_elimination=True),

A("tape-maze-challenge", "Tape Maze Challenge",
  "A laser maze made of masking tape — crawl under, step over, don't touch.",
  ["rainy-day", "pe-movement"], (5, 12), (2, 24), (15, 30), ["indoor"],
  ["masking tape", "small bells (optional)"],
  False, "Crisscross masking tape across a hallway or between desks at different heights — high, low, diagonal.",
  ["Walk the maze once slowly, spotting every strand. Planning beats speed.",
   "Run it: crawl under the low strands, step over the high ones, twist through the diagonals.",
   "Touch a strand? Back to the start. Three touches and you're the maze designer for the next round.",
   "Hang bells on the strands for hard mode — silence is the score.",
   "Teams design mazes for each other and race the clock through the rival maze."],
  "Fewer strands, wider gaps — or walk it instead of racing.",
  "Time trials with a leaderboard, or blindfolded with a partner calling directions.",
  tags=["season:winter"], copy_free=True, no_elimination=True),

A("balloon-volleyball", "Balloon Volleyball",
  "A balloon, a string net, and the longest rallies of your life.",
  ["rainy-day", "pe-movement"], (5, 12), (4, 28), (15, 30), ["indoor"],
  ["balloons", "string or yarn", "two chairs"],
  False, "String a 'net' between two chairs at chest height. Blow up 2-3 balloons — extras for pops.",
  ["Split into two teams, one per side. Serve the balloon over the net — underhand only.",
   "Three hits per side max, like real volleyball. Count the rally out loud.",
   "The balloon floats, so rallies last forever — that's the whole joy of it.",
   "Rotate servers every 5 points. Popped balloon? 30-second pause, new balloon, play on.",
   "Tournament: winners stay, challengers rotate in. Track the longest rally on the board."],
  "No net — just keep-it-up in a circle, or allow catching.",
  "Add a second balloon, or play seated for a completely different game.",
  safety="Latex balloons are a choking hazard — keep uninflated spares with the adult, and no balloon pieces in mouths.",
  tags=["season:winter"], no_elimination=True),

A("story-building-blocks", "Story Building Blocks",
  "Nine picture dice, one story built block by block — nobody knows the ending.",
  ["rainy-day", "quiet-focus"], (6, 12), (2, 24), (20, 30), ["indoor"],
  ["dice or wooden cubes", "stickers or drawn symbols"],
  False, "Stick a simple symbol on each face of 9 dice (tree, key, wave, star, door, etc.). One set per group.",
  ["Roll all nine dice. The group has 2 minutes to agree on what the symbols could mean.",
   "Tell the story together: each kid adds one sentence using one die's symbol.",
   "The symbols must ALL appear by the end — that's the constraint that makes it fun.",
   "Vote: which group's story was funniest? Which was most surprising?",
   "Remix: keep the same dice, tell it as a mystery / a comedy / a tall tale."],
  "Use 4 dice instead of 9, or let kids draw their own symbol sets.",
  "Write the story down as a group book, or roll one die as a daily story starter.",
  tags=["season:winter"], copy_free=True),

# ---------------- Gap fills: age 3 (4) ----------------
A("color-sorting-trays", "Color Sorting Trays",
  "Pom-poms, trays, tiny tongs — sorting practice that feels like play.",
  ["quiet-focus"], (3, 5), (1, 12), (10, 20), ["indoor"],
  ["colored pom-poms", "muffin tins or trays", "large tweezers or tongs"],
  False, "Put mixed pom-poms in a central bowl. Set out one tray per color nearby.",
  ["Show the grab: tongs pick up ONE pom-pom and drop it in the matching tray.",
   "Let them sort freely — color accuracy matters less than the pinching practice.",
   "When the bowl's empty, count each tray together. Which color had the most?",
   "Mix them all back up and sort again — repetition is the lesson at 3.",
   "Free build: make pom-pom patterns in the tray (red-blue-red-blue)."],
  "Skip the tongs — little fingers only.",
  "Sort by size too, or race a partner with identical bowls.",
  safety="Pom-poms are a choking hazard — this is a supervised table activity, pieces counted in and out.",
  tags=["season:winter"], copy_free=True),

A("big-brush-painting", "Big Brush Painting",
  "Huge paper, huge brushes, huge arm movements — painting at full body scale.",
  ["crafts"], (3, 5), (1, 12), (10, 20), ["indoor", "outdoor"],
  ["big paper or butcher roll", "washable tempera", "large brushes", "smocks"],
  False, "Tape big paper to the floor or an easel. Pour paint into shallow trays — smocks on first.",
  ["Start with one color and big arm circles — the whole arm moves, not just the wrist.",
   "Add a second color. Watch what happens where they meet — name the new color together.",
   "Paint to music: fast song = fast strokes, slow song = slow strokes.",
   "Sign it with a handprint in the corner. Artists sign their work.",
   "Hang it at kid height. Gallery rules: look with your eyes, and say one thing you see."],
  "One color only, or finger-paint instead of brushes.",
  "Paint a group mural on the butcher roll, or paint outside on a bigger scale.",
  safety="Washable tempera only — and smocks, because 3-year-olds paint themselves too.",
  tags=["season:winter"]),

A("animal-parade-march", "Animal Parade March",
  "Pick an animal, become the animal, march the parade route.",
  ["pe-movement", "music-rhythm"], (3, 5), (2, 16), (10, 20), ["indoor", "outdoor"],
  ["animal picture cards", "a drum or music player (optional)"],
  False, "Lay out animal cards face-up. Clear a parade loop around the room.",
  ["Each kid picks an animal card and practices its walk: bear stomps, bunny hops, snake slides.",
   "Line up behind the leader. March the loop, everyone doing their own animal walk.",
   "When the drum stops, freeze in your animal pose. Silliest freeze gets the front of the line.",
   "Trade cards and march again — new animal, new walk.",
   "Final lap: everyone does the SAME animal, led by the kid who did it best."],
  "March in place instead of a loop, or do it seated (arms only).",
  "Add animal sounds, or march the parade to visit another classroom.",
  tags=["season:winter"], copy_free=True, no_elimination=True),

A("nesting-cup-towers", "Nesting Cup Towers",
  "Stack them up, knock them down, nest them away — the complete tower lifecycle.",
  ["quiet-focus"], (3, 5), (1, 10), (10, 20), ["indoor"],
  ["nesting/stacking cups"],
  False, "Hand out a set of stacking cups per kid or pair. That's the whole setup.",
  ["Stack the cups biggest to smallest — the tower only stands if the order's right.",
   "Knock it down (the best part). Stack it again, faster this time.",
   "Nest them all into one cup — where did the tower go? It's all still there.",
   "Build sideways: can you make a cup snake? A cup wall?",
   "Clean-up game: who can nest their whole set first? The cups put themselves away."],
  "Stack 4 big cups only, or build with a partner.",
  "Count the cups as you stack (number practice), or build the tallest free-standing tower.",
  safety="Cups only — no throwing them at anyone, no matter how tempting.",
  tags=["season:winter"], copy_free=True),
]

WINTER_COLLECTION = {
    "id": "winter-lights",
    "title": "Winter Lights",
    "glyph": "❄️",
    "when_to_use": "December is coming and the room needs a plan: Christmas crafts that teach, Hanukkah and Kwanzaa activities treated with real respect, New Year countdowns with actual math, and winter-break science that works whether or not it snows.",
    "picks": [
        ("ornament-geometry-stars", "Five-point geometry you can hang — the rare craft that's secretly a math lesson."),
        ("christmas-light-circuit-cards", "A greeting card with a working light bulb. The debugging IS the lesson."),
        ("dreidel-spin-physics", "Whose top spins longest? Friction and surface, tested properly."),
        ("hanukkah-story-circle", "The story behind the holiday, told round-robin — respectful, real, never a costume."),
        ("kente-pattern-strips", "Bold blocks with meanings attached — meaning first, decoration second."),
        ("seven-principles-talk-tokens", "The Nguzo Saba as a discussion game. The winning principle becomes the week's motto."),
        ("countdown-clock-craft", "Build the countdown, then run it — a paper clock that sweeps a real 60 seconds."),
        ("ball-drop-physics", "Time the drop to land at zero. Miss it? That's called iteration."),
        ("new-year-noise-parade", "Shakers, a 2027 sign, one glorious hallway lap. The new year deserves an entrance."),
        ("snowflake-symmetry-lab", "No cutting, just looking — six-fold symmetry in real snowflake photos."),
        ("ice-melt-rescue-race", "Frozen toys, warm hands, salt strategy. The rescue parade at the end is mandatory."),
        ("winter-bird-feeder", "Pinecones and peanut butter, then a week of watching who shows up."),
    ],
}


def main():
    acts = json.load(open(os.path.join(DATA, 'activities.json')))
    colls = json.load(open(os.path.join(DATA, 'collections.json')))
    have = {a['id'] for a in acts}
    new = [a for a in PACK if a['id'] not in have]
    skipped = [a['id'] for a in PACK if a['id'] in have]
    # validate tagline lengths + steps before writing
    for a in new:
        assert len(a['tagline']) <= 160, f"tagline too long: {a['id']}"
        assert len(a['steps']) >= 3, f"fewer than 3 steps: {a['id']}"
        assert a['variations']['easier'] and a['variations']['harder'], f"missing variation: {a['id']}"
    acts.extend(new)
    json.dump(acts, open(os.path.join(DATA, 'activities.json'), 'w'), indent=1, ensure_ascii=False)
    cids = {c['id'] for c in colls['collections']}
    if WINTER_COLLECTION['id'] not in cids:
        # every pick must resolve to a real activity id
        for pid, note in WINTER_COLLECTION['picks']:
            assert pid in {a['id'] for a in acts}, f"collection pick missing: {pid}"
            assert note.strip(), f"empty curator note: {pid}"
        colls['collections'].append({
            "id": WINTER_COLLECTION['id'],
            "title": WINTER_COLLECTION['title'],
            "glyph": WINTER_COLLECTION['glyph'],
            "when_to_use": WINTER_COLLECTION['when_to_use'],
            "picks": [{"id": pid, "note": note} for pid, note in WINTER_COLLECTION['picks']],
        })
    json.dump(colls, open(os.path.join(DATA, 'collections.json'), 'w'), indent=1, ensure_ascii=False)
    print(f"winter wave: +{len(new)} activities ({len(acts)} total), skipped dupes: {skipped}")
    print(f"collections: {len(colls['collections'])} (winter-lights {'added' if WINTER_COLLECTION['id'] not in cids else 'already present'})")


if __name__ == '__main__':
    # PACK is assembled across the chunk files
    import add_winter as _w
    import add_winter_hk as _hk
    import add_winter_ny as _ny
    import add_winter_gaps as _g
    PACK = _w.PACK + _hk.PACK + _ny.PACK + _g.PACK
    main()
