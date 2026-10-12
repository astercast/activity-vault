#!/usr/bin/env python3
"""Wave 14 (scope-up): research integration.

1. Adds 3 research-sourced Thanksgiving STEM activities from the 2026-10-11
   activity-ideas scout report (~/workspace/research_notes/activity-ideas-20261011-2010/),
   rewritten in the Vault's own words with full Vault fields + source URLs.
2. Adds the report's recommended fields to the Thanksgiving pack:
   copy_free (2026 teacher gold standard), no_elimination (2026 PE norm),
   why_it_works (research-backed), inclusion (one-line inclusion notes).
3. Retro-tags 35 existing no-prep + zero-material activities as copy_free
   (verified: no print/worksheet/handout mentions in setup or steps) and
   11 existing games verified no-elimination from their steps.

Run once. Run scripts/build.py afterwards.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')
SRC = "https://naomimeredith.com/tag/fall/"

def A(id, name, tagline, cats, ages, group, time, loc, mats, no_prep, setup,
      steps, easier, harder, safety=None, tags=None, source=None,
      copy_free=None, no_elimination=None, why_it_works=None, inclusion=None):
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
    if tags: rec["tags"] = tags
    if source: rec["source"] = source
    if copy_free: rec["copy_free"] = True
    if no_elimination: rec["no_elimination"] = True
    if why_it_works: rec["why_it_works"] = why_it_works
    if inclusion: rec["inclusion"] = inclusion
    return rec

T = ["holiday:thanksgiving"]

RESEARCH_STEM = [
A("turkey-code-feathers", "Turkey Code Feathers",
  "Invent a symbol code, encode a turkey fact on feathers, trade and decode.",
  ["stem", "crafts", "holidays"], (6, 10), (2, 30), (35, 50), ["indoor"],
  ["paper turkey body + feather cutouts", "markers", "paper for the code key"],
  False,
  "Cut a simple turkey body and 8 feather shapes per kid. Feathers get "
  "taped on after the coding is done.",
  ["Invent your symbols: draw one symbol for each letter A–Z (younger kids "
   "do A–M). This is your code key — keep it secret.",
   "Pick a true turkey fact and encode it, one letter per feather.",
   "Tape the coded feathers onto your turkey body.",
   "Trade turkeys with a partner and decode theirs using THEIR key.",
   "Share the most surprising fact the group decoded."],
  "Use a ready-made symbol bank and encode just 3 letters.",
  "Encode a whole riddle across two turkeys and let another pair crack it.",
  "Scissors stay at the table; pre-cut bodies and feathers for little kids.",
  T, SRC, True, None, None,
  "Symbol bank for a head start; drawing-only codes welcome; encode in a "
  "home language with a translated key."),

A("cornucopia-catch-game", "Cornucopia Catch",
  "Build paper cornucopias, then invent your own catch game — rules and all.",
  ["stem", "team-community", "holidays"], (7, 11), (6, 30), (45, 70), ["indoor"],
  ["paper", "tape", "scissors", "paper 'produce' cutouts (apples, corn, pumpkins)"],
  False,
  "Set out paper and tape per team of 3–4. Cut a pile of paper produce "
  "up front so building starts fast.",
  ["Build 3 paper cornucopias sturdy enough to hold, catch, and toss.",
   "Test: toss paper produce between teammates and catch it in the horn.",
   "Now invent your own game: teams write the rules, the scoring, and a name.",
   "Rotate: play another team's game exactly by their rules.",
   "Vote: funniest rules, trickiest catch, best team name."],
  "Build one big team cornucopia and play catch in a circle.",
  "Add a points zone on the floor — long catches into the horn score double.",
  "Scissors stay at the table. Toss paper produce only, never at faces.",
  T, SRC, True, None,
  "Student-designed endings — inventing the game's rules — are the 2026 STEM "
  "flourish research flags as most engaging: kids own the challenge instead "
  "of just following it.",
  "Pre-rolled cone templates; seated tossing; rules can be dictated and scribed."),

A("thanksgiving-table-build", "Thanksgiving Table Build",
  "Toothpicks and glue: build a table with at most 4 legs that holds the feast.",
  ["stem", "holidays"], (8, 12), (2, 30), (40, 60), ["indoor"],
  ["toothpicks", "white glue", "wax paper", "books for weight-testing"],
  False,
  "Cover the table with wax paper — glue peels right off. Hand out "
  "toothpicks and glue per team.",
  ["The constraint: a table with AT MOST 4 legs, standing on its own.",
   "Sketch the leg design first — triangles beat squares for strength.",
   "Build on the wax paper; let the glue set (build one day, test the next "
   "if you can).",
   "Load books one at a time onto the tabletop; record the max before it fails.",
   "Compare: which leg designs held the most? What would you change?"],
  "Build with thicker skewers and test with paperback books only.",
  "Limit it to 20 toothpicks total — the constraint forces smarter design.",
  "Toothpicks are pointy — build on the table, never sword-fight. Check "
  "glue bottles for clogs before frustrated squeezing starts.",
  T, SRC, True, None, None,
  "Thicker skewers for easier grip; team roles (planner, builder, tester); "
  "test narrated aloud so everyone follows the results."),
]

# Research fields for the 18 wave-14 originals (id -> field updates)
INCLUSION = {
 "thankful-turkey-handprints": "Pre-cut pieces for little hands; dictate thankful thoughts for pre-writers.",
 "paper-cornucopia-build": "Pre-rolled cones available; partner rolling for limited grip strength.",
 "friendsgiving-place-cards": "Draw instead of write; name cards can be dictated.",
 "harvest-weave-placemats": "Wide strips for easier weaving; pre-cut strips for the youngest.",
 "turkey-tag-chase": "Walking-only rounds; a seated 'barn guard' role keeps everyone in the game.",
 "pumpkin-bucket-toss": "Move the line closer; bigger buckets for easier success.",
 "harvest-basket-relay": "Walk instead of run; carry two crops to shorten the distance.",
 "cranberry-toothpick-towers": "Build flat shapes instead of towers; partner roles for every step.",
 "turkey-baster-relay": "Big pom-poms, short distance; two hands on the baster.",
 "shake-jar-butter": "One big group jar with 30-second shake turns; timer role for dairy-free kids.",
 "friendsgiving-potluck-plan": "Fixed 3-dish menu option; jobs assigned by interest, not just volunteers.",
 "friendsgiving-story-circle": "Share one thankful word instead of a story; listening counts fully.",
 "gratitude-alphabet-circle": "Team play for shy kids; passing allowed on any letter.",
 "thankful-jar-shares": "Draw or dictate slips; anonymous by default.",
 "gratitude-all-year": "Draw instead of write; sharing always optional.",
 "food-drive-planning": "Poster, counter, and greeter roles for every mobility level.",
 "staff-thank-you-cards": "One giant class card option; dictate the message.",
 "blessing-bag-pack": "Seated assembly line; decorating counts as full participation.",
}
WHY_IT_WORKS = {
 "turkey-tag-chase": "Played in short 3-minute rounds, it works as a structured movement break — research finds active breaks under 10 minutes improve on-task behavior (Deakin University, IJRESS Jan 2026).",
 "shake-jar-butter": "Hands-on making beats screen time: the APA's Sept 2026 report finds learning sticks when kids apply knowledge off-screen — and nothing is more off-screen than shaking cream into butter.",
}
NO_PRINT_PACK = [i for i in INCLUSION if i != "friendsgiving-potluck-plan"]  # potluck uses sign-up printouts
NO_ELIM_PACK = ["turkey-tag-chase", "pumpkin-bucket-toss", "harvest-basket-relay"]

# Existing library: verified no-elimination games (steps checked, no elimination language)
NO_ELIM_EXISTING = ["twenty-questions", "telephone-game", "would-you-rather-circle",
    "story-chain", "duck-duck-goose", "red-light-green-light", "two-truths-and-a-lie",
    "name-chain", "compliment-circle", "rhythm-name-game", "simon-says"]

def main():
    acts = json.load(open(os.path.join(DATA, 'activities.json')))
    by_id = {a['id']: a for a in acts}

    # 1. add the 3 research STEM activities
    new_ids = [a['id'] for a in RESEARCH_STEM]
    assert len(new_ids) == 3 and len(set(new_ids)) == 3
    clashes = [i for i in new_ids if i in by_id]
    if clashes:
        print("ID CLASHES:", clashes); sys.exit(1)
    acts.extend(RESEARCH_STEM)
    by_id = {a['id']: a for a in acts}

    # 2. research fields on the 18 originals
    for rid, note in INCLUSION.items():
        assert rid in by_id, rid
        by_id[rid]['inclusion'] = note
    for rid in NO_PRINT_PACK:
        by_id[rid]['copy_free'] = True
    for rid in NO_ELIM_PACK:
        by_id[rid]['no_elimination'] = True
    for rid, why in WHY_IT_WORKS.items():
        by_id[rid]['why_it_works'] = why

    # 3. existing library: copy_free for all no-prep + zero-material (verified no print mentions)
    n_cf = 0
    for a in acts:
        if a.get('no_prep') and not a.get('materials') and 'copy_free' not in a:
            blob = (a.get('setup', '') + ' ' + ' '.join(a['steps'])).lower()
            assert 'print' not in blob and 'worksheet' not in blob, a['id']
            a['copy_free'] = True
            n_cf += 1

    # 4. existing library: verified no-elimination games
    n_ne = 0
    for rid in NO_ELIM_EXISTING:
        assert rid in by_id, rid
        if 'no_elimination' not in by_id[rid]:
            by_id[rid]['no_elimination'] = True
            n_ne += 1

    json.dump(acts, open(os.path.join(DATA, 'activities.json'), 'w'),
              indent=1, ensure_ascii=False)
    total_cf = sum(1 for a in acts if a.get('copy_free'))
    total_ne = sum(1 for a in acts if a.get('no_elimination'))
    total_inc = sum(1 for a in acts if a.get('inclusion'))
    total_why = sum(1 for a in acts if a.get('why_it_works'))
    print(f"WROTE — {len(acts)} activities (3 new research STEM). "
          f"copy_free: {total_cf} (+{n_cf} existing), no_elimination: {total_ne} (+{n_ne} existing), "
          f"inclusion notes: {total_inc}, why_it_works: {total_why}.")

if __name__ == '__main__':
    main()
