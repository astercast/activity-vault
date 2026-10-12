#!/usr/bin/env python3
"""Wave 9 authoring helper: write data/collections.json, asserting every pick id is real."""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
acts = json.load(open(os.path.join(ROOT, 'data', 'activities.json')))
act_ids = {a['id'] for a in acts}

COLL = [
 {
  "id": "rainy-day-rescue",
  "title": "Rainy-day rescue",
  "glyph": "🌧️",
  "when_to_use": "Recess just got cancelled and 25 kids are stuck inside. Pick any three — they run back-to-back with no setup between them.",
  "picks": [
   ("freeze-dance", "Ten minutes of full-body movement — the fastest way to burn off rain-stuck wiggles."),
   ("silent-ball", "Competitive but silent: the only indoor game that calms the room while it plays."),
   ("telephone-game", "Zero materials, huge laughs — works while you quietly re-arrange the room."),
   ("would-you-rather-circle", "Everyone participates; nobody needs any skill, supplies, or setup."),
   ("charades", "Scales from silly to clever — pairs perfectly with a restless afternoon."),
   ("mad-libs-live", "Reads like pure mischief, practices language — they'll never notice the learning."),
   ("card-tower-challenge", "Steady hands after chaos: a calm-down disguised as a building challenge."),
   ("story-dice", "A full story in twenty minutes with nothing but imagination and dice."),
   ("indoor-scavenger-hunt", "Rediscovers your own classroom — pair up kids who never talk."),
   ("musical-chairs", "The old reliable: when energy peaks, chair count beats any fancy game."),
   ("balloon-tennis", "Big rallies, zero breakage risk — hallway-safe and endlessly replayable."),
   ("paper-mitten-match", "Matching plus fine motor: quietly absorbs twenty minutes of indoor time."),
  ],
 },
 {
  "id": "first-day-of-program",
  "title": "First day of the program",
  "glyph": "👋",
  "when_to_use": "New faces, new room, first impressions. Run these in order on day one — names first, kindness last.",
  "picks": [
   ("name-chain", "Names stick fast when every kid says them out loud twice in one game."),
   ("name-memory-chain", "The day-two sequel — run it and watch last week's strangers light up."),
   ("bingo-mingle", "Gets every kid talking to five kids they don't know yet."),
   ("human-bingo", "Same magic, written down — a lifeline for the shy joiners."),
   ("rhythm-name-game", "Names with a beat — the wigglers remember this one all year."),
   ("birthday-lineup", "Silent sorting means nobody needs words to belong on day one."),
   ("compliment-circle", "Sets the tone immediately: this room is a kind place."),
   ("compliment-chain", "Passes warmth around the circle, literally hand to hand."),
   ("two-truths-and-a-lie", "The classic first-day reveal — strangers become interesting fast."),
   ("common-ground", "Finds the surprising thing three kids all share."),
   ("story-chain", "One word each: by the end, the whole room owns the same story."),
   ("duck-duck-goose", "Ends the first day on a giggle for the younger half of the group."),
  ],
 },
 {
  "id": "last-10-minutes",
  "title": "Last 10 minutes",
  "glyph": "⏱️",
  "when_to_use": "The clock is dying and dismissal is ten minutes of chaos. These run cold — no setup, and every one ends with a settled room.",
  "picks": [
   ("calm-breathing-shapes", "Five shapes, five breaths — the reset button you can run daily."),
   ("listening-bell", "Ten near-silent minutes that feel like magic to a loud room."),
   ("breathing-buddies", "Belly breathing with a stuffed buddy riding on top — little ones leave settled."),
   ("warm-up-countdown", "Counts down to dismissal with movement instead of fidgeting."),
   ("name-chain", "One fast round while coats go on — names and laughter to close the day."),
   ("animal-walk-relay", "Silly movement that eats ten minutes and leaves everyone smiling."),
   ("freeze-dance", "One song, freeze on cue — energy out, coats on, done."),
   ("red-light-green-light", "Ten minutes, one voice, total focus: the classic closer."),
   ("would-you-rather-circle", "Zero setup — just one question the whole group can argue about."),
   ("compliment-circle", "Fifteen minutes of kindness on the way out the door."),
  ],
 },
 {
  "id": "field-trip-bus-ride",
  "title": "Field-trip bus ride",
  "glyph": "🚌",
  "when_to_use": "Thirty seats, one long road, no chaos allowed. Seated, quiet-ish, and everything fits on a tray table.",
  "picks": [
   ("twenty-questions", "The perfect bus game — one voice at a time, whole bus listening."),
   ("telephone-game", "Works beautifully down a bus aisle, seat row to seat row."),
   ("would-you-rather-circle", "Debate fuel for mile forty — no materials required."),
   ("story-chain-writing", "Pass-the-paper storytelling: the bus writes a novel by arrival."),
   ("mad-libs-live", "Mad Libs at full volume — check with the driver first."),
   ("mandala-drawing", "Quiet, absorbing coloring for the long middle stretch."),
   ("mandala-coloring", "Print-and-go calm — pack a stack of copies before you board."),
   ("story-dice", "Tiny dice, endless plots — fits on a seatback tray."),
   ("cloud-spotting-guide", "Every window becomes a science lab; bring the sky along."),
   ("sound-story", "The bus provides the sound effects — the kids build the story."),
   ("two-truths-and-a-lie", "Learn the one thing nobody knew about the kid in seat 12B."),
   ("appreciation-postcards", "Write one kind postcard before you arrive — hand them out at pickup."),
  ],
 },
 {
  "id": "sub-tub-essentials",
  "title": "Sub Tub essentials",
  "glyph": "🆘",
  "when_to_use": "The ten cards every sub folder needs — pairs with the Sub Tub kit (sub.html). Every pick runs from its card alone: no hidden setup, no weird supplies.",
  "picks": [
   ("freeze-dance", "Foolproof energy burner — the sub just presses play."),
   ("simon-says", "Every sub knows it, every kid obeys it, zero explanation needed."),
   ("telephone-game", "No materials, no mess, nothing to follow up on."),
   ("silent-ball", "Quiet competition — the room practically manages itself."),
   ("mad-libs-live", "Reading practice that feels like mischief."),
   ("story-dice", "A full language block from a cup of dice."),
   ("would-you-rather-circle", "Discussion for any age — fills any gap in the day."),
   ("comic-strip-creations", "Quiet seat work a sub can stretch to forty-five minutes."),
   ("exquisite-corpse-draw", "Guaranteed weird results — no drawing skill needed to run it."),
   ("compliment-chain", "Kindness-based: leaves the room better than the sub found it."),
   ("paper-airplane-challenge", "Paper only — the classic that has never once failed."),
  ],
 },
 {
  "id": "winter-party-night",
  "title": "Winter party night",
  "glyph": "❄️",
  "when_to_use": "The winter pack's greatest hits — pairs with the Party Planner's ❄️ Winter theme (party.html). Rotate these through three stations and close with the countdown.",
  "picks": [
   ("snowflake-paper-patterns", "Every kid leaves with a window-worthy snowflake — and it needs zero prep."),
   ("homemade-christmas-ornaments", "The take-home gift parents actually keep."),
   ("winter-gingerbread-build", "Build with paper shapes — no royal-icing disasters."),
   ("snowball-toss-math", "Snowball fight plus math facts: this is your movement station."),
   ("freeze-dance-winter", "The dance break between stations — one playlist, done."),
   ("midnight-countdown-rehearsal", "Practice the big countdown — pure party energy to close the night."),
   ("cotton-ball-penguin", "Irresistible craft that doubles as a party favor."),
   ("winter-wreath-collage", "A collaborative wreath for the classroom door."),
   ("resolution-ladder", "The quiet reflection corner while glue dries."),
   ("year-in-review-quilt", "Everyone contributes one square — hang it in January."),
   ("ice-ornaments", "Hang them outside and catch the morning light."),
   ("winter-tall-tale", "One outrageous winter story, told by the whole party at once."),
  ],
 },
 {
  "id": "no-prep-lifesavers",
  "title": "No-prep lifesavers",
  "glyph": "⚡",
  "when_to_use": "Grab-and-go, zero setup, any time the plan falls apart. If you only memorize one collection, make it this one.",
  "picks": [
   ("two-truths-and-a-lie", "The opener that has never missed — run it with total strangers."),
   ("twenty-questions", "Any topic, any group, instantly running in under a minute."),
   ("story-chain", "One word each — the story surprises everyone, including you."),
   ("compliment-chain", "Five minutes to a measurably warmer room."),
   ("human-knot", "The team-builder that needs nothing but hands."),
   ("birthday-lineup", "Silent sorting by birthdays — no words, no materials, full focus."),
   ("secret-kindness-missions", "Kids will sneak kindness all week after this one."),
   ("appreciation-postcards", "Gratitude in ten minutes — send them home at pickup."),
   ("storytelling-circle", "One story passed around the circle; everybody owns the ending."),
   ("duck-duck-goose", "The littles' favorite — zero setup, maximum joy."),
   ("red-light-green-light", "Ten minutes, one voice, total focus."),
   ("shadow-tag", "Tag without touching — perfect for mixed ages outdoors."),
  ],
 },
 {
  "id": "calm-down-corner",
  "title": "Calm-down corner",
  "glyph": "🧘",
  "when_to_use": "For the wired, the wobbly, and the overstimulated. Keep these on a ring by the quiet corner — any kid can self-select.",
  "picks": [
   ("calm-breathing-shapes", "Five shapes, five breaths — the reset button."),
   ("listening-bell", "Follow the bell until the sound disappears — instant quiet."),
   ("breathing-buddies", "Belly breathing with a buddy riding on top."),
   ("glitter-calm-jars", "Shake it, watch it settle — the metaphor does the teaching."),
   ("coping-strategy-cards", "Name your tools before the big feelings arrive."),
   ("mandala-drawing", "Repetitive and absorbing — minds quiet down on their own."),
   ("mandala-coloring", "Simple patterns, no decisions, pure calm."),
   ("gratitude-journals", "Three good things — the fastest perspective shift there is."),
   ("storytelling-dice", "Gentle storytelling with zero pressure to perform."),
   ("listening-walk", "The outdoor reset: five sounds, four textures, one calmer kid."),
   ("rock-cairn-balance", "Stacking stones forces slow, careful focus."),
   ("gratitude-tree", "Pin a leaf for something good — the corner grows its own forest."),
  ],
 },
]

def main():
    bad = []
    seen = set()
    for c in COLL:
        if c["id"] in seen:
            bad.append(f"dup collection id {c['id']}")
        seen.add(c["id"])
        n = len(c["picks"])
        if not (8 <= n <= 12):
            bad.append(f"{c['id']}: {n} picks (need 8-12)")
        for pid, note in c["picks"]:
            if pid not in act_ids:
                bad.append(f"{c['id']}: unknown activity id '{pid}'")
            if not note or not note.strip():
                bad.append(f"{c['id']}/{pid}: empty curator note")
    if bad:
        print("AUTHORING ERRORS:")
        for b in bad:
            print(" -", b)
        sys.exit(1)
    out = {"collections": [
        {"id": c["id"], "title": c["title"], "glyph": c["glyph"],
         "when_to_use": c["when_to_use"],
         "picks": [{"id": pid, "note": note} for pid, note in c["picks"]]}
        for c in COLL
    ]}
    path = os.path.join(ROOT, 'data', 'collections.json')
    json.dump(out, open(path, 'w'), indent=1, ensure_ascii=False)
    print(f"WROTE {path} — {len(COLL)} collections, "
          f"{sum(len(c['picks']) for c in COLL)} picks, 0 bad ids.")

if __name__ == '__main__':
    main()
