#!/usr/bin/env python3
"""Wave 27 Scout decision: the first non-empty cycle since wave 24.

`python3 pipeline/scan.py` ran live 2026-10-12 against all 6 feeds and
queued exactly ONE new candidate — the first genuinely new item in
three cycles:

  Teach Beside Me — "Morse Code Games for Kids: 6 Fun Secret Signal
  Challenges" (published 2026-10-13 UTC on the feed; new to seen.json).

Human review, against the full 576-activity catalog:
- Duplication check: the Vault has secret-code-decoder-wheels
  (paper substitution-cipher wheels, 8-12) and binary-code-keychain
  (beaded 1s and 0s, 8-14). Morse is neither: it is a code sent as
  SIGNALS — light, sound, timing — and decoded by eye and ear in real
  time. No record in the catalog teaches or uses Morse. Distinct
  mechanic, distinct skills (listening, timing, working memory).
- Age fit: decoding letters needs reading fluency — banded 7-12,
  honestly below the source's general "for kids."
- Safety/materials: flashlights + paper + a chart the adult writes on
  the board. One real rule (never shine a light in eyes) covers it.
- Verdict: ACCEPTED, adapted into original words below, source
  credited on the record per PIPELINE.md. The decision + reason are
  written back onto the queue entry by this script.

This accept is pipeline duty, not frontier work: the wave's chosen
frontier was the age-3 build (see add_wave27.py). One Morse record
for older kids lands because the Scout found it and it earned its
place on review — not to pad the thin "coding" keyword count, which
wave 26 recorded as a shelf the Vault does not promise.

Deltas from this accept: total 576 -> 577, stem primary 107 -> 108,
copy_free 196 -> 197, inclusion 74 -> 75. Age-3 numbers unchanged
(this is a 7-12 record).

Run once: dedupes by id, writes data/activities.json and
pipeline/review-queue.json. Run scripts/build.py afterwards.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_winter import A, DATA, ROOT

REC = A("morse-code-signal-post", "Morse Code Signal Post",
  "Dots and dashes sent by flashlight and table-tap — learn SOS, signal your initials, and run a message post across the room.",
  ["stem", "quiet-focus"], (7, 12), (2, 24), (25, 40), ["indoor"],
  ["flashlights (one per pair)", "paper and pencils (for logging signals)", "a board or big paper for the Morse chart"],
  False, "Write the Morse alphabet on the board yourself before the session — A is dot-dash, and the whole alphabet fits in two columns; no printing needed and no handouts to lose. Dimming the room helps the flashlight rounds if your space allows it, but the game works in daylight against a plain wall. Test every flashlight; a dying battery sends a dying signal.",
  ["Start with the one message the whole world knows: SOS. S is three dots, O is three dashes — tap it on the table together until the room can send it without looking: dot-dot-dot, dash-dash-dash, dot-dot-dot. It has been the distress call for over a century because it is unmistakable.",
   "Learn the code's one rule: a dot is short, a dash lasts three times as long, and the pause between letters is what keeps a message from becoming soup. Send your first name's first letter across the table by finger-taps, partner logging each mark on paper and decoding it against the board chart.",
   "Initials round: each kid writes their two initials as dots and dashes, practises them until smooth, then pairs up across the room. Sender flashes initials at the wall above their partner's head — never at a face — receiver logs and decodes, then they swap.",
   "Sound post: same game, no lights. A knuckle tap is a dot; a flat-palm thump is a dash — two sounds different enough to tell apart with your eyes closed. Receivers log by ear only and check against the chart after.",
   "Message relay: split into lines of three or four stations. The first station gets a three-letter word from the word bank (CAT, SUN, MAP, EGG, TOP), sends it by taps station to station, and the last station writes what arrived. Compare the word that landed with the word that left — where it garbled is the real telegraph problem, and the fix is always the same: slower, with honest pauses.",
   "Close in the dimmed room if you have one: the whole group sends SOS by flashlight together on your count, three times, then lights up. A room that can signal together can be quiet together — the stillness after the last round is the proof."],
  "Initials only, chart open in front of both partners, and sender and receiver side by side instead of across the room.",
  "Send full words from the bank with no chart for the common letters (E, T, A, O, N, S), or receive the sound round with eyes closed the whole way.",
  safety="Flashlights point at walls, ceilings, or paper — never at eyes, and that rule is stated before the first light comes out. Tapping stays on tables, not on each other.",
  copy_free=True,
  inclusion="The signal post is a full job for a kid who would rather not speak in front of the room: a sender by light or by tap talks all session without saying a word, and their messages land exactly like everyone else's. Logging can be marks on paper, tallies, or dots and dashes drawn big — the code does not care how it is written down.")
REC["source"] = "https://teachbesideme.com/morse-code-games-for-kids/"

QUEUE_ID = "a0d0a7a320378ef3"
DECISION = ("Morse is a code sent as signals — light, sound, timing — and decoded by eye and ear in real "
            "time; the catalog's two code records are a paper cipher wheel and beaded binary, neither of "
            "which teaches or uses Morse. Distinct mechanic, real classroom classic, one honest safety "
            "rule. Banded 7-12 (decoding needs reading fluency). Adapted in original words, source credited.")


def tokens(s):
    return set(re.findall(r"[a-z0-9]+", s.lower()))


def main():
    path = os.path.join(DATA, "activities.json")
    acts = json.load(open(path))
    corpus = [(a["id"], tokens(a["name"] + " " + a["tagline"])) for a in acts]
    t = tokens(REC["name"] + " " + REC["tagline"])
    worst, wid = 0.0, None
    for oid, ot in corpus:
        j = len(t & ot) / max(1, len(t | ot))
        if j > worst:
            worst, wid = j, oid
    print(f"jaccard {REC['id']}: worst {worst:.2f} vs {wid}")
    assert worst < 0.55, f"near-duplicate: {REC['id']} vs {wid} ({worst:.2f})"
    if REC["id"] not in {a["id"] for a in acts}:
        acts.append(REC)
        json.dump(acts, open(path, "w"), indent=1, ensure_ascii=False)
        print(f"added {REC['id']}; total now {len(acts)}")
    else:
        print("skip (exists):", REC["id"])

    qpath = os.path.join(ROOT, "pipeline", "review-queue.json")
    queue = json.load(open(qpath))
    for q in queue:
        if q["id"] == QUEUE_ID and q["status"] == "pending":
            q["status"] = "accepted"
            q["decision"] = DECISION
            q["reviewed"] = "2026-10-12"
            q["activity_id"] = REC["id"]
            print("queue entry decided: accepted ->", REC["id"])
    json.dump(queue, open(qpath, "w"), indent=2, ensure_ascii=False)
    from collections import Counter
    print("queue:", dict(Counter(q["status"] for q in queue)), "total", len(queue))


if __name__ == "__main__":
    main()
