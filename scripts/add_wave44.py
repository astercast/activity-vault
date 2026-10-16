#!/usr/bin/env python3
"""Wave 44: The Completeness Wave, the canon comes home.

Ordered by the user's 2026-10-15 call for massive research
across the fleet. The full research record stands at
~/workspace/fleet-ops/research-audits/activity-completeness-2026-10-15.md;
this docstring carries its build-relevant findings.

The wave-43 close left the Vault at 747 activities, 222
with a photo, 105 with a named source. This wave's audit
measured the whole archive again before anything was
built. Category counts at the audit: crafts 166, stem 159,
team-community 150, quiet-focus 137, holidays 129,
pe-movement 126, seasons 124, outdoor 120, icebreakers 77,
rainy-day 76, music-rhythm 50, the thinnest category in
the Vault by a wide margin. Season tags: winter 120,
fall 55, spring 44, summer 39, the thinnest season.
Per-age coverage: 3: 160, 4: 160, 5: 329, 6: 426, 7: 496,
8: 530, 9: 524, 10: 518, 11: 456, 12: 446, 13: 120,
14: 120.

Against that shape, the absence census. Every canonical
activity below was checked by id against all 747 records
and found entirely absent: kickball and four square
(Playworks treats both as core recess games), sharks and
minnows and marco polo (the pool canon), hot potato and
pass the parcel (the music circle canon, aimed at the
thinnest category), follow the leader, mother may I,
what's the time Mr Wolf, sardines, kick the can (the
traditional playground set named in Wikipedia's own
children's games lists), the four field day races every
school sports day runs (egg-and-spoon, sack, three-legged,
wheelbarrow), gaga ball and 9 square in the air (the camp
free-time canon, rules read in the Camp Allendale
activity guide), cornhole, tie-dye (carrying the summer
tag for the thinnest season), and the quiet table canon
the Vault never held: chess, dominoes, go fish, plus a
first kids yoga session (the Vault held breathing and
mindfulness records; yoga itself was absent, and Cosmic
Kids' schools research page documents the program
evidence teachers cite).

The wave's size is the canon's size: 23 records, no more,
no fewer. Every record carries a source verified firsthand
during the audit. Eleven carry a Wikimedia Commons photo
whose licence was read from the MediaWiki API and whose
frame was viewed against the activity before wiring;
six further candidates were rejected on viewing (a
kickball stadium shot too distant to read, two giant
street chess sets wrong for a first session, an empty
vendor gaga pit, a crew building a pit instead of playing
in one, a costume parade in real wheelbarrows instead of
the partner race), and four square has no in-play
photograph on Commons at all. Those records ship with a
designed absence, the Vault's honest first-class state.

Eight existing records were slated to gain a verified
source: red-light-green-light (Statues),
jump-rope-countdown (Skipping rope), relay-race-mixup
(Relay race), hula-hoop-pass (Hula hoop),
puddle-hopscotch (Hopscotch, plus its photo),
paper-cup-telephone (Tin-can telephone),
winter-hide-and-seek (Hide-and-seek), shadow-tag (Tag).
One existing record gains a photo: puddle-hopscotch.

Reconciliation, stated plainly: this wave does not land
on the audited 747. The wave engine's own completeness
run (scripts/add_completeness_2026_10_15.py, its landing
record at ~/workspace/fleet-ops/wave-engine/
landing-activity-completeness-2026-10-15.md) landed in
this tree first, uncommitted: 8 records aimed at the
thinnest cells (747 to 755), 28 sources (105 to 133,
including the Tin-can telephone source for
paper-cup-telephone, so this wave's script skips that
target as already set), and the 33rd collection,
filling-the-thin-drawers. No id in this wave collides
with any of theirs; the two slates are complementary.

On that base, the four field day races unlock the 34th
collection, Field Day Classics, at exactly the 8-pick
minimum joined with relay-race-mixup, obstacle-course,
cup-stack-relay and tug-of-war. The build.py collection
assert moves 33 to 34 in the same commit.

Result, asserted in the landing record: total 755 to 778
(747 audited, +8 theirs, +23 here); photos 222 to 233
(all eleven from this wave; the earlier run added none);
sources 133 to 163 (23 new records plus 7 completions,
the eighth already landed by the earlier run);
collections 33 to 34. Twelve of the 23 records reach
age 14, lifting the thin teen band honestly.

Deliberate neighbours, kept on purpose and named here:
- mother-may-i vs giant-steps-baby-steps (present): that
  record is a caller-led group journey, the whole line
  taking the named step together. Mother May I is the
  permission game: individual asks, a leader who answers
  yes or swaps the move, and a race to the leader's line.
  Shared vocabulary, different games.
- hot-potato vs musical-chairs (present since the early
  waves): chairs is the seat race when the music stops;
  hot potato is the pass that never stops moving. Both
  belong to the music circle; neither replaces the other.
- sharks-and-minnows vs marco-polo: the two pool pillars,
  one a crossing game of tag, one a hunting game of
  listening. A pool shelf with only one would be half a
  shelf.
- sardines vs winter-hide-and-seek (present): hide and
  seek hides everyone from one seeker; sardines hides one
  player from everyone, and the tin fills. Reverse games
  are different games.
- kick-the-can vs capture-the-flag-basics (present): the
  flag games guard an object in territory; kick the can
  guards prisoners with a can, and the can can be kicked.
- chess-first-session vs liberty-quiz-bowl (present):
  the bowl is the Vault's loud thinking; chess is its
  quiet thinking. The quiet-focus shelf needed its pillar.
- kids-yoga-first-session vs the breathing records
  (present): breathing-buddies and its kin teach breath
  alone; the yoga session is the whole practice, poses
  and all, named as what programs actually run.
- dodgeball is NOT in this wave, on purpose and for the
  record: the Vault's standing ethos is no-elimination
  play, and its target-throwing slot is already covered
  without an elimination core.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
sys.path.insert(0, os.path.join(ROOT, "scripts"))

WIKI = "https://en.wikipedia.org/wiki/"

PACK = [
    dict(
        id="kickball", name="Kickball",
        tagline="Baseball's playground cousin: one big ball, pitched slow, kicked far, and run like the bases are on fire.",
        categories=["pe-movement", "outdoor", "team-community"],
        age_min=6, age_max=14, group_min=10, group_max=30,
        time_min=20, time_max=40, location=["outdoor"],
        materials=[{"item": "playground ball (10 inch rubber ball)"},
                   {"item": "4 bases or cones"}],
        no_prep=False,
        setup="Mark a diamond on grass or blacktop with four bases, home plate at one corner. A kickball diamond can be half the size of a baseball one and still play true. Split the group into two teams and write a kicking order for each, so nobody argues about turns.",
        steps=[
            "The pitcher rolls the ball underhand toward home plate, smooth and bouncy. A pitch that hops wildly or rolls too fast can be called back by the kicker.",
            "The kicker waits for the roll and kicks it into fair ground, anywhere inside the lines the group agreed on.",
            "Fielders get a runner out three ways: catch the kick in the air, tag a base ahead of the runner, or touch the runner with the ball below the shoulders while they run. Head shots never count and stop play on the spot.",
            "Three outs and the teams swap sides. Everyone on a team kicks before anyone kicks twice.",
            "Play two or three innings, or until the agreed time runs out. Count the runs together out loud; the scorekeeping is part of the game.",
        ],
        variations={
            "easier": "Let young kickers kick a still ball set on a cone, tee style, and shorten the base paths.",
            "harder": "Shrink the diamond and play hands-free fielding on ground balls: fielders may trap the ball with feet and shins only, soccer style.",
        },
        safety="Throws at runners stay below the shoulders, always. Clear the base paths of bags and bottles before the first pitch, and no fielder stands inside the front arc of the diamond until the ball is kicked.",
        inclusion="A player who kicks from a seated position or off a tee plays by the same outs as everyone else. A larger, softer ball makes one diamond fair for mixed ages.",
        source=WIKI + "Kickball",
        photo={
            "file": "r30/kickball.webp",
            "alt": "Children playing kickball on a grass field, a green playground ball in play",
            "caption": "Kickball on the grass, playground ball in play.",
            "credit": "Photo: NPS, Public domain, via Wikimedia Commons",
            "licence": "Public domain",
            "source_url": "https://commons.wikimedia.org/wiki/File:Members_of_the_Plains_Boys_and_Girls_Club_play_a_game_of_kickball_on_the_field_at_Plains_High_School._(857f119b-1dd8-b71c-0763-80955484a90e).jpg",
        },
        copy_free=True,
    ),
    dict(
        id="four-square", name="Four Square",
        tagline="Four chalk squares, one ball, and a line of challengers waiting to climb to the top court.",
        categories=["pe-movement", "outdoor"],
        age_min=6, age_max=14, group_min=4, group_max=20,
        time_min=10, time_max=30, location=["outdoor"],
        materials=[{"item": "playground ball"},
                   {"item": "chalk or tape for the court"}],
        no_prep=False,
        setup="Draw a square about ten feet across and split it into four smaller squares, lettered A to D, with A the top court. One player stands in each square and the rest form a line at the court's edge. Agree the house rules before the first serve; four square runs on rules every player can repeat.",
        steps=[
            "The player in A serves: bounce the ball once in your own square, then hit it underhand into another player's square.",
            "The receiving player lets it bounce once in their square, then hits it on into any other square. Hands only; no catching, no carrying.",
            "A player is out when the ball bounces twice in their square, when they hit it out of the court, or when a ball landing in their square goes unreturned.",
            "The out player goes to the back of the line. Everyone below their square moves up one, and the first player in line enters at D.",
            "The goal is the long climb: survive at D, rise through C and B, and hold A against all challengers.",
        ],
        variations={
            "easier": "Allow two bounces and a catch for young players, and shrink the court so small arms can reach every corner.",
            "harder": "Classic call-outs apply: no backsies, no double taps, and the A player may add one rule per reign, announced before serving.",
        },
        safety="Keep the waiting line a full step behind the court so swings and lunges stay clear of faces. Use a soft playground ball, never a hard ball, and stop play for anyone crossing the court.",
        source=WIKI + "Four_square",
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="sharks-and-minnows", name="Sharks and Minnows",
        tagline="One shark in the middle of the pool, a wall of minnows at the edge, and a crossing nobody wants to rush.",
        categories=["outdoor", "pe-movement"],
        age_min=7, age_max=14, group_min=6, group_max=30,
        time_min=15, time_max=30, location=["outdoor"],
        materials=[{"item": "a swimming pool, with a lifeguard or supervising adult on watch"}],
        no_prep=False,
        setup="Play in water where every swimmer can handle the depth, with an adult watching the water, and nobody in the game who is not a confident swimmer at that depth. One player starts as the shark in the middle of the pool. Everyone else lines up at one wall as minnows.",
        steps=[
            "The shark calls the start: 'Sharks and minnows, one, two, three, minnows, minnows, swim to me!'",
            "Minnows swim for the far wall any way they like: fast, slow, along the bottom. Touching the far wall means safety.",
            "The shark tags as many minnows as possible mid-crossing. A light one-hand touch counts; grabbing and pulling never do.",
            "Tagged minnows become sharks for the next crossing. The wall of sharks grows every round, and the crossing takes more nerve each time.",
            "The last minnow still free when the crossings end becomes the first shark of the next game.",
        ],
        variations={
            "easier": "Play in the shallow end where minnows can run and splash across, and let newer swimmers cross with a pool noodle.",
            "harder": "Minnows keep their heads above water for the whole crossing, so the sharks hunt by sight and sound.",
        },
        safety="A lifeguard or supervising adult is not optional; this game runs only under watch, in water matched to the weakest swimmer, with no diving in, no dunking, and no holding anyone under. Ever.",
        tags=["season:summer"],
        source="https://scoutermom.com/24751/sharks-and-minnows/",
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="marco-polo", name="Marco Polo",
        tagline="Eyes closed in the pool: one voice calls 'Marco' and every splash answers 'Polo'.",
        categories=["outdoor", "pe-movement"],
        age_min=7, age_max=14, group_min=4, group_max=20,
        time_min=15, time_max=30, location=["outdoor"],
        materials=[{"item": "a swimming pool, with a lifeguard or supervising adult on watch"}],
        no_prep=False,
        setup="Play in a pool where everyone can swim the depth, under a lifeguard's or supervising adult's eye. One player is Marco. Everyone else spreads through the water. Agree the boundaries first: the game stays inside the marked area, and climbing out is out of bounds unless the group votes to allow deck play.",
        steps=[
            "Marco closes their eyes, counts to ten out loud, and calls 'Marco!'",
            "Every other player answers 'Polo!' at once, wherever they are. No silent swimmers; the answer is the game.",
            "Marco swims toward the voices, calling as often as they like, hunting by ear for a one-hand tag.",
            "Players dodge, duck, and glide quietly between calls, but the moment 'Marco' rings out, their 'Polo' gives them away.",
            "A tagged player becomes the new Marco, and the old Marco joins the chorus.",
        ],
        variations={
            "easier": "Play in the shallow end where everyone can stand, and let Marco take one open-eyed look between every third call.",
            "harder": "Fish out of water: if Marco calls it and a player is sneaking along the deck, that player is caught on the spot. Use it only where the deck is dry and safe to walk.",
        },
        safety="Supervision is the first rule: a lifeguard or adult watches the whole game. No diving, no holding under, no play in water over a swimmer's depth. A player who needs a break climbs out and says so, and the game pauses for anyone in trouble, instantly.",
        tags=["season:summer"],
        source=WIKI + "Marco_Polo_(game)",
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="hot-potato", name="Hot Potato",
        tagline="A beanbag too hot to hold: pass it fast, pass it kind, and never be holding it when the music stops.",
        categories=["music-rhythm", "icebreakers"],
        age_min=4, age_max=10, group_min=6, group_max=30,
        time_min=10, time_max=20, location=["indoor", "outdoor"],
        materials=[{"item": "beanbag or soft ball"},
                   {"item": "music player"}],
        no_prep=False,
        setup="Sit or stand in a circle close enough to pass hand to hand. One soft object is the potato; a beanbag beats a ball because it does not roll away mid-panic. The music keeper sits outside the circle, back turned or eyes averted, so no stop can be called a fix.",
        steps=[
            "Music starts and the potato travels around the circle, hand to hand, as fast as hands can safely move it. No throwing across the circle.",
            "The music stops without warning. Whoever holds the potato takes the hot seat: answer a silly question, name a favourite food, or lead three jumping jacks while the circle cheers.",
            "Music restarts and the potato moves again. Nobody leaves the circle; the hot seat is a moment, not an exit.",
            "Keep the rounds short and the music clips shorter as the game warms up. End while everyone still wants one more stop.",
        ],
        variations={
            "easier": "Roll the potato around a seated circle instead of passing, and count down 'three, two, one' before some stops so young players can brace.",
            "harder": "Two potatoes travelling in opposite directions. When the music stops, both holders take the hot seat and answer as a pair.",
        },
        safety="Underhand, hand to hand, always. A dropped potato is picked up by the nearest hands and play goes on; nobody dives for it.",
        source=WIKI + "Hot_potato",
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="pass-the-parcel", name="Pass the Parcel",
        tagline="A prize wrapped in a dozen layers, passed to the music: every stop unwraps somebody's layer.",
        categories=["music-rhythm", "icebreakers"],
        age_min=4, age_max=10, group_min=6, group_max=25,
        time_min=15, time_max=25, location=["indoor"],
        materials=[{"item": "one small prize"},
                   {"item": "wrapping paper or fabric bags, many layers"},
                   {"item": "music player"}],
        no_prep=False,
        setup="Wrap one small prize in many layers, one layer per player plus a few spare, using different papers or fabric bags so the layers are easy to tell apart. Slip a sticker, a joke, or a tiny treat between some of the layers if you like. Players sit in a circle; the music keeper stays outside it, where the stops stay honest.",
        steps=[
            "Music plays and the parcel passes hand to hand around the circle, quickly and kindly.",
            "The music stops. The player holding the parcel unwraps exactly one layer and keeps whatever they find tucked in it.",
            "Music starts again and the parcel moves on. The stops come at uneven moments, so over a full game every seat gets its unwrap.",
            "The last layer holds the prize. The player who unwraps it keeps it, and the circle applauds the parcel that made it all the way around.",
        ],
        variations={
            "easier": "Hide a small treat in every layer, so the youngest players win something at their very first stop.",
            "harder": "Hide challenge slips between the layers instead of treats: unwrap, then do the challenge (hop five times, name five animals that swim) before the music may restart.",
        },
        safety="Choose any layer treats with the group's allergies in mind, or skip food entirely for stickers and jokes. Passing stays hand to hand; a torn layer is a hazard to nobody.",
        source=WIKI + "Pass_the_parcel",
        no_elimination=True,
    ),
    dict(
        id="follow-the-leader", name="Follow the Leader",
        tagline="One leader, one winding line, and every hop, spin, and silly walk copied all the way down.",
        categories=["pe-movement", "icebreakers"],
        age_min=3, age_max=7, group_min=4, group_max=25,
        time_min=10, time_max=20, location=["indoor", "outdoor"],
        materials=[],
        no_prep=True,
        setup="Pick the first leader, often the teacher or an older child, and line everyone else up behind them, an arm's length apart. Clear the path ahead: the line will wind wherever the leader takes it, around the chairs, down the hall, or across the yard.",
        steps=[
            "The leader starts moving: marching, hopping, tiptoeing, flapping, freezing. Whatever the leader does, the line copies.",
            "Keep the moves big and slow enough for the smallest follower to copy. The leader's job is to be followed, not to escape.",
            "Every minute or so, or at a natural pause, the leader goes to the back of the line and the next child leads. Everyone leads; nobody waits long.",
            "Finish with the whole line copying one last slow move together: a stretch up tall, then a melt down to the floor, for quiet.",
        ],
        variations={
            "easier": "The leader names each move as they do it ('now we hop!'), and the line stays short: five or six followers.",
            "harder": "Silent leading with an echo rule: the leader adds a rhythm, two claps and a stomp, and the line must copy the moves and echo the rhythm in time.",
        },
        safety="Leaders keep the line on safe ground: no climbing, no running near edges or roads, and a walking pace anywhere near stairs. A follower who needs to stop steps out of the line and rejoins at the back.",
        source=WIKI + "List_of_children%27s_games",
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="mother-may-i", name="Mother, May I?",
        tagline="Ask politely, move cleverly: giant steps, baby steps, and a leader who loves to answer 'no, but you may instead'.",
        categories=["pe-movement", "outdoor"],
        age_min=4, age_max=8, group_min=4, group_max=20,
        time_min=10, time_max=20, location=["indoor", "outdoor"],
        materials=[],
        no_prep=True,
        setup="One player is the leader, called Mother, Father, or Captain, standing at one end of the space. Everyone else lines up at the far end, an arm's length apart. Mark both ends so the distance is honest, and agree that the leader's line is the goal.",
        steps=[
            "Players take turns asking: 'Mother, may I take three giant steps?' Every ask names a number and a kind of step: giant steps, baby steps, umbrella steps (twirling), frog hops, crab steps.",
            "The leader answers 'Yes, you may', or 'No, you may not, but you may take two baby steps instead.' The leader's answer rules, even when it sends a player backwards.",
            "Move without asking 'may I' and the move does not count; the player returns to where they stood. The asking is the game.",
            "The first player to reach the leader's line becomes the leader for the next round.",
        ],
        variations={
            "easier": "Use picture steps for pre-readers, big dinosaur steps and tiny mouse steps, and let the leader always say yes to a polite ask.",
            "harder": "The leader may only answer with swaps, never a plain yes, and each player may bargain once per turn: 'May I trade those baby steps for one giant step?'",
        },
        safety="Keep the playing lane clear and the step sizes honest for the smallest legs in the line. Crab walks and frog hops belong on soft ground or mats.",
        source=WIKI + "Mother_may_I%3F",
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="whats-the-time-mr-wolf", name="What's the Time, Mr Wolf?",
        tagline="'Three o'clock' means three brave steps closer. 'Dinner time' means run for the line.",
        categories=["pe-movement", "outdoor"],
        age_min=4, age_max=9, group_min=5, group_max=25,
        time_min=10, time_max=20, location=["indoor", "outdoor"],
        materials=[],
        no_prep=True,
        setup="One player is Mr Wolf, standing at one end of the space with their back to the group. Everyone else lines up at the far end. Mark the safe line behind the group: crossing it means safety when the chase comes, and leave room beyond it to slow down.",
        steps=[
            "The group chants together: 'What's the time, Mr Wolf?'",
            "The Wolf answers with an hour: 'Four o'clock!' Everyone takes four steps toward the Wolf, counting out loud as they go.",
            "Ask, answer, step, again and again. The Wolf picks the hours: big ones to hurry the group close, small ones to tease.",
            "Sooner or later the Wolf answers 'Dinner time!' and spins around to chase. Everyone runs for the safe line.",
            "A player caught before the line becomes the Wolf for the next round. If nobody is caught, the Wolf stays Wolf, and the line creeps closer next time.",
        ],
        variations={
            "easier": "The Wolf answers only small hours, one to three, and saves 'dinner time' for rare moments, with a head start called for the youngest runners.",
            "harder": "Add midnight: 'Midnight!' means freeze exactly where you stand until the next question; a mover the Wolf spots returns to the start line.",
        },
        safety="The chase runs one way, toward the safe line, with open room at the end to slow down in. Tag with a touch, never a tackle, and keep the Wolf's turning space clear.",
        source=WIKI + "What%27s_the_time,_Mr_Wolf%3F",
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="sardines", name="Sardines",
        tagline="Hide and seek turned inside out: one player hides, everyone hunts, and the hiding spot slowly fills with sardines.",
        categories=["icebreakers", "team-community"],
        age_min=8, age_max=14, group_min=6, group_max=25,
        time_min=20, time_max=40, location=["indoor", "outdoor"],
        materials=[],
        no_prep=True,
        setup="Agree the boundaries and the off-limits places before anyone hides; sardines only works where hiding is allowed. One player is the first sardine and goes off to hide while everyone else closes their eyes and counts slowly to fifty, out loud, together.",
        steps=[
            "Seekers split up and hunt alone and quietly. No teams, no calling out a find; the secret is the game.",
            "A seeker who finds the hiding spot says nothing. They check that nobody is watching, then squeeze in and hide too, silent as a sardine in the tin.",
            "The spot fills one player at a time. Seekers still hunting roam a space that feels emptier and emptier, which is its own kind of funny.",
            "The last seeker still hunting when everyone else is packed in becomes the first sardine of the next round.",
            "Unpack the tin together, count the sardines, and argue happily about who gave it away by giggling.",
        ],
        variations={
            "easier": "Play in a small, familiar space and send two sardines out together, so the first hiding spot is found fast and fills faster.",
            "harder": "Silent round: the packed sardines may not laugh, whisper, or shift. One sound that draws a seeker in, and the tin is found.",
        },
        safety="Hiding spots must be safe to stay in and easy to leave: never inside appliances, cupboards that latch, vehicles, or anywhere a player could be trapped or hard to find in an emergency. The leader always knows the boundaries and the round's time limit, and the leader's whistle ends any round at once.",
        source=WIKI + "Hide-and-seek",
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="kick-the-can", name="Kick the Can",
        tagline="One can, one jail, and a whole ground full of hiders: kick the can and everybody runs free.",
        categories=["outdoor", "pe-movement"],
        age_min=8, age_max=14, group_min=6, group_max=20,
        time_min=20, time_max=40, location=["outdoor"],
        materials=[{"item": "an empty can or plastic bottle"}],
        no_prep=True,
        setup="Set the can on open ground at home base and mark a jail beside it: a porch step, a bench, a chalk square. Agree the boundaries of the hiding ground and what is off limits, and walk them once with the whole group. One player is It, and guards the can.",
        steps=[
            "It closes their eyes and counts to fifty while everyone hides inside the boundaries.",
            "It hunts. Spotting a hider, It races back to the can, stamps beside it, and calls the hider's name and hiding place: 'One, two, three on Maya, behind the oak!'",
            "A named hider comes in and waits in jail. It keeps hunting, but now the can has a second game running around it.",
            "Any free hider may sneak in and kick the can as hard as they dare. A kicked can frees every prisoner, who scatter and hide again while It sets the can up and counts to twenty.",
            "The round ends when every hider sits in jail. The first player caught becomes It for the next round.",
        ],
        variations={
            "easier": "Shrink the ground, shorten the count to twenty, and let jailed players hold a hand-chain reaching out of the jail: a free hider only has to tag the chain's end to free everyone.",
            "harder": "Twilight round: It hunts with a flashlight, hiders move in the dark, and the can gets a new home base every round.",
        },
        safety="Set the boundaries tighter than feels necessary and keep them off streets and driveways entirely; in fading light, smaller and familiar beats big and thrilling. The can is kicked along the ground, never thrown. Jail is a waiting spot and nothing more: a player who needs out is out, no argument.",
        source=WIKI + "Tag_sports",
        copy_free=True,
    ),
    dict(
        id="egg-and-spoon-race", name="Egg-and-Spoon Race",
        tagline="A spoon, a wobbling egg, and a finish line that punishes every hurried step.",
        categories=["pe-movement", "team-community"],
        age_min=4, age_max=12, group_min=4, group_max=30,
        time_min=10, time_max=20, location=["indoor", "outdoor"],
        materials=[{"item": "spoons (one per racer)"},
                   {"item": "eggs, or stand-ins: ping pong balls, small potatoes, cotton balls"}],
        no_prep=False,
        setup="Mark a start and a finish on grass or a gym floor, fifteen to twenty big steps apart for young racers and farther for older ones. Use a stand-in unless the group is ready for real shells and the cleanup that follows them. One spoon and one egg per racer, and a spare basket of eggs at the start line.",
        steps=[
            "Racers line up, spoon held out in one hand at waist height, egg balanced in the spoon's bowl. The free hand goes behind the back.",
            "On 'go', walk fast. Running breaks eggs; the quickest walker with the steadiest hand wins this race.",
            "A dropped egg stops its racer: pick it up, set it back on the spoon where it fell, and only then walk on. No steadying the egg with a thumb; thumbs are famous cheats in this race.",
            "Cross the finish with the egg still riding the spoon. In relay form, pass spoon and egg to the next racer without any hand touching the egg.",
        ],
        variations={
            "easier": "Balance the egg on a big serving spoon, shorten the course, and let racers walk in pairs who may steady each other by the elbow.",
            "harder": "Add a slalom of cones and a turn at the far end, or race with the spoon in the non-dominant hand.",
        },
        safety="Walk, do not run, is a safety rule as much as a game rule: racers watch their spoons, so the course stays clear of holes, hoses, and other racers' lanes. Real eggs mean slippery spills underfoot; stop and wipe them at once, or race with stand-ins.",
        source=WIKI + "Egg-and-spoon_race",
        photo={
            "file": "r30/egg-and-spoon-race.webp",
            "alt": "Two racers walking fast, each balancing a small ball on a spoon",
            "caption": "Spoons steady, eyes down, feet quick.",
            "credit": "Photo: Dobfalog, CC BY-SA 4.0, via Wikimedia Commons",
            "licence": "CC BY-SA 4.0",
            "source_url": "https://commons.wikimedia.org/wiki/File:Egg_and_Spoon_Race.jpg",
        },
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="sack-race", name="Sack Race",
        tagline="Both legs in one burlap sack: the field day race where the fastest runners become beginners again.",
        categories=["pe-movement", "outdoor"],
        age_min=4, age_max=12, group_min=4, group_max=30,
        time_min=10, time_max=20, location=["outdoor"],
        materials=[{"item": "burlap sacks or sturdy pillowcases (one per racer)"}],
        no_prep=False,
        setup="Grass is the only fair course for a sack race; falls are part of the fun and should land softly. Mark a start and a finish about twenty big steps apart. Each racer stands inside a sack pulled up to the waist, holding its top edge with both hands.",
        steps=[
            "On 'go', hop. Both feet stay in the sack and the sack stays held up; a sack that slides to the ankles stops all travel until it is hauled back up.",
            "Small hops beat giant ones. The racers who try to leap usually meet the grass, to general applause.",
            "Fall down, get up, hop on. Nobody is out for falling; this race forgives everything except quitting.",
            "First across the finish with both feet still in the sack wins. In relay form, hop the return leg too, then hand the sack to the next racer, who climbs fully in before hopping.",
        ],
        variations={
            "easier": "Short course, pillowcases for small racers, and a walking partner beside each racer for balance.",
            "harder": "Double sack: two racers share one wide sack, four legs and one hop rhythm, or add a turn cone at halfway.",
        },
        safety="Grass only, checked for holes and stones first, and sacks checked for torn seams before racing. A racer who falls badly sits out and cheers; hopping on a hurt ankle is never the price of finishing.",
        source=WIKI + "Sack_race",
        photo={
            "file": "r30/sack-race.webp",
            "alt": "Children hopping in burlap sacks while friends cheer them on",
            "caption": "Sack racers mid-hop, with the crowd close by.",
            "credit": "Photo: Irsam Soetarto, CC BY-SA 4.0, via Wikimedia Commons",
            "licence": "CC BY-SA 4.0",
            "source_url": "https://commons.wikimedia.org/wiki/File:Balap_Karung.jpg",
        },
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="three-legged-race", name="Three-Legged Race",
        tagline="Two racers, three legs, one rhythm: 'inside, outside' all the way to the finish line.",
        categories=["pe-movement", "team-community"],
        age_min=6, age_max=14, group_min=4, group_max=30,
        time_min=10, time_max=20, location=["outdoor"],
        materials=[{"item": "soft ties: scarves, bandanas, or velcro straps (one per pair)"}],
        no_prep=False,
        setup="Pair racers of similar height where you can. The tie joins the inside ankles of partners standing side by side; use a soft scarf or a velcro strap, snug but never tight. Mark start and finish on grass, twenty to thirty steps apart, and give every pair two practice minutes before any racing. The practice is where the rhythm is found.",
        steps=[
            "Partners put arms around each other's shoulders or waists. The tied legs move together or nobody moves at all.",
            "Find the chant: 'inside, outside, inside, outside', with the tied legs stepping on 'inside'. Say it out loud the whole way; every good pair does.",
            "On 'go', walk the rhythm first. Pairs who start at a run usually finish on the grass. Speed arrives after the chant is steady.",
            "Cross the finish still tied and still standing. In relay form, the finished pair passes the tie to the next pair, who tie up before stepping off.",
        ],
        variations={
            "easier": "Walk the whole course with no racing at all, and let first-time pairs hold hands instead of tying, to learn the rhythm.",
            "harder": "A longer course with one gentle turn, or the whisper rule: no chanting, so pairs must find the rhythm by feel alone.",
        },
        safety="Soft ties only, tied at the ankle and checked before starting; a tie that hurts comes off, full stop. Grass course, clear of holes. Teach the fall in the practice minutes: lean into your partner and sit down together, because pairs fall together or not at all.",
        source=WIKI + "Three-legged_race",
        photo={
            "file": "r30/three-legged-race.webp",
            "alt": "Two racers with their inside legs tied together, mid-stride on a court",
            "caption": "Tied at the ankle, moving as one.",
            "credit": "Photo: Tony Alter, CC BY 2.0, via Wikimedia Commons",
            "licence": "CC BY 2.0",
            "source_url": "https://commons.wikimedia.org/wiki/File:Three-Legged_Race_(8149193405).jpg",
        },
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="wheelbarrow-race", name="Wheelbarrow Race",
        tagline="One partner walks on their hands while the other steers by the ankles: the race that empties every arm in the field.",
        categories=["pe-movement", "team-community"],
        age_min=6, age_max=12, group_min=4, group_max=30,
        time_min=10, time_max=15, location=["outdoor"],
        materials=[],
        no_prep=True,
        setup="Pairs: one wheelbarrow, one driver. The barrow starts on hands and knees on the grass, and the driver stands behind, ready to lift the barrow's ankles to waist height. Mark a short course, ten to fifteen steps is plenty to begin with; this race is harder on arms than it looks.",
        steps=[
            "The driver lifts the barrow's legs gently, and the barrow walks forward on their hands. Slow is steady; a barrow who rushes plants face first.",
            "Drivers steer with gentle pressure and call the turns early. The pair that talks is the pair that stays up.",
            "At the far line, swap: the barrow becomes the driver, the driver becomes the barrow, and the pair races back.",
            "First pair home with both halves raced wins. Rest between heats; tired arms get a vote on whether there is a final.",
        ],
        variations={
            "easier": "Half the course, with the driver holding at the knees instead of the ankles, which shortens the lever and the effort.",
            "harder": "Slalom the cones on the way out, or pivot turns only: at the far line the driver may not set the barrow down, only turn and go.",
        },
        safety="Grass only, soft and clear. Drivers lift by the ankles, never yank, and set their barrow down gently the moment a wrist or shoulder complains. A barrow who says 'down' goes down; that rule outranks every race.",
        source=WIKI + "Wheelbarrow_race",
        photo={
            "file": "r30/wheelbarrow-race.webp",
            "alt": "Children racing as wheelbarrow pairs on grass, partners holding their legs",
            "caption": "Hands down, legs up, and off they go.",
            "credit": "Photo: Eirian Evans, CC BY-SA 2.0, via Wikimedia Commons",
            "licence": "CC BY-SA 2.0",
            "source_url": "https://commons.wikimedia.org/wiki/File:Wheelbarrow_race_-_geograph.org.uk_-_815093.jpg",
        },
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="gaga-ball", name="Gaga Ball",
        tagline="Inside the pit the ball stays low and the hits stay kind: last player standing takes the round.",
        categories=["pe-movement", "outdoor"],
        age_min=7, age_max=14, group_min=6, group_max=20,
        time_min=10, time_max=25, location=["indoor", "outdoor"],
        materials=[{"item": "a gaga pit, or a low-walled octagon of benches and mats"},
                   {"item": "a soft foam or light rubber ball"}],
        no_prep=False,
        setup="You need a pit: an octagon of low walls, or a ring of gym benches and mats that keeps a soft ball in play. Players stand inside, spread around the walls, each with one hand touching the wall until the start. The ball must be soft; gaga is a foam or light rubber ball game, never a hard ball game.",
        steps=[
            "The leader bounces the ball in the centre three times, calling 'Ga... Ga... Go!' No player may touch the ball before the third bounce.",
            "Hit the ball with an open hand, one hit at a time, aiming at other players below the knee. This is a tapping game; swings stay gentle.",
            "A player hit below the knee is out for the round and steps out to cheer from the wall. Players may block with their hands but may never catch, hold, or carry the ball.",
            "Last player in the pit takes the round, and the next round starts at once with everyone back inside.",
        ],
        variations={
            "easier": "Two lives: a first hit costs a hand held behind the back, and only a second hit ends a player's round.",
            "harder": "Two balls in the pit at once, or a silent round where the only sounds allowed are the ball and the walls.",
        },
        safety="Hits stay below the knee and the ball stays soft; a hit above the knee, a hard swing, or a dive ends that player's round on the spot. The pit floor stays clear and dry, and players enter and leave through the wall gap, never over the top mid-play.",
        source=WIKI + "Gaga_(game)",
        copy_free=True,
    ),
    dict(
        id="nine-square-in-the-air", name="9 Square in the Air",
        tagline="A court in the air on a nine-square frame: one hit per square, and the middle square is the throne.",
        categories=["pe-movement", "team-community"],
        age_min=9, age_max=14, group_min=9, group_max=25,
        time_min=15, time_max=30, location=["indoor", "outdoor"],
        materials=[{"item": "a 9 Square frame (commercial set, or a pvc grid raised on poles)"},
                   {"item": "playground ball"}],
        no_prep=False,
        setup="Set the frame so its nine squares stand at overhead height, each square big enough for one player to stand in and reach up through. One player per square; everyone else lines up outside square one. The centre square is the top seat, the King or Top Cat, and every player on the frame is climbing toward it.",
        steps=[
            "The centre player serves: hit the ball up through the top of your own square so it drops into any other square.",
            "The player in that square gets one hit to send the ball up and out of their square into somebody else's. One hit only; no catches, no double taps.",
            "A player is out when a ball landing in their square drops, when their hit flies outside the frame, when they hit twice, or when they touch the frame itself.",
            "The out player leaves to the back of the waiting line. Every player below moves up one square toward the centre, and the first in line enters at square one.",
            "Hold the centre through as many serves as you can. The throne is rented, never owned.",
        ],
        variations={
            "easier": "Allow one bounce inside a player's square before the hit, and lower the frame for younger or shorter players.",
            "harder": "Call your square: the hitter names the target square before hitting, and a ball landing anywhere else costs the point.",
        },
        safety="Eyes up, feet planted inside your own square. Collisions happen when players chase balls into a neighbour's square, so a ball that leaves your square is gone; let it go. Check the frame stands stable before every session, and nobody hangs from the bars, ever.",
        source="https://www.camp-allendale.org/_files/ugd/b61ac6_5952abd65d7744889d87403bb05dd136.pdf",
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="cornhole", name="Cornhole",
        tagline="Two boards, eight bags, and the sweetest three points in the yard: a bag clean through the hole.",
        categories=["outdoor", "team-community"],
        age_min=6, age_max=14, group_min=2, group_max=20,
        time_min=15, time_max=30, location=["outdoor"],
        materials=[{"item": "2 cornhole boards"},
                   {"item": "8 bean bags (4 per side)"}],
        no_prep=False,
        setup="Set the two boards facing each other on flat ground. Full distance is 27 feet between the fronts of the boards; for children, pace off a shorter court, 12 to 18 feet, and stretch it back as arms grow. Players pair up: partners stand at opposite boards, with their opponents beside them.",
        steps=[
            "Players at one board throw in turn, one bag at a time, alternating with their opponent, underhand at the far board. Four bags each.",
            "Score the round when all eight bags have flown. A bag through the hole is worth 3. A bag resting on the board is worth 1. A bag that touched the ground first, or hangs off the board onto the grass, scores nothing and is cleared away.",
            "Score by cancellation: a round of 9 against 5 is worth 4 to the higher side. Losing rounds sting less and comebacks stay alive.",
            "The other end throws back. First side to 21 wins; agree before the first bag whether an exact 21 is required.",
        ],
        variations={
            "easier": "Move the boards closer, let young throwers stand beside their board rather than behind its front edge, and count any bag on the board as 2.",
            "harder": "Race games: first side to 21 exactly, with a bag that takes you past 21 not counting, so the endgame becomes a marksman's problem.",
        },
        safety="One thrower throws at a time, and nobody walks the court while bags are in the air. Bags are gathered only when both ends agree the round is done.",
        source=WIKI + "Cornhole",
        photo={
            "file": "r30/cornhole.webp",
            "alt": "A cornhole board with bean bags resting on it, a player throwing from the far end",
            "caption": "Bags on the board, one more in the air.",
            "credit": "Photo: Viro, Public domain, via Wikimedia Commons",
            "licence": "Public domain",
            "source_url": "https://commons.wikimedia.org/wiki/File:Cornhole_game.jpg",
        },
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="tie-dye-shirts", name="Tie-Dye Shirts",
        tagline="Twist it, band it, drown it in colour: no two shirts ever come out of the bucket alike.",
        categories=["crafts", "seasons"],
        age_min=6, age_max=14, group_min=4, group_max=30,
        time_min=30, time_max=60, location=["outdoor"],
        materials=[{"item": "plain white cotton shirts (one per child, pre-washed)"},
                   {"item": "fibre-reactive dye kit, or squeeze bottles of dye"},
                   {"item": "rubber bands"},
                   {"item": "plastic gloves (one pair per child)"},
                   {"item": "buckets and plastic bags"}],
        no_prep=False,
        setup="Work outside or over covered tables; dye is forever on everything it touches. Follow the kit on pre-soaking. Lay out gloves, bands, and bottles grouped by colour, and write each child's name on a plastic bag before the first shirt gets wet, because a finished shirt goes straight into its own bag to rest.",
        steps=[
            "Lay a damp shirt flat and choose a pattern. For the classic spiral, pinch the centre, twist the shirt into a flat swirl, and band it into wedges, like a pie.",
            "Band it tight. The sections the bands divide become the colour zones, and every white line in the finished shirt is a band that held.",
            "Gloves on, then add dye wedge by wedge: one colour per wedge, or two where wedges meet. Push the bottle's tip into the folds so the colour reaches inside the spiral.",
            "Slide each shirt, still banded, into its named bag and let it rest as the dye directions say; overnight gives the deepest colour.",
            "Rinse in cool water until it runs nearly clear, unband over the rinse bucket, and hold the reveal, one shirt at a time, to the group's full gasp. Wash dyed shirts separately for their first few washes.",
        ],
        variations={
            "easier": "One colour per shirt and a scrunch pattern: ball the shirt up, band it loosely, dye it, and get a mottled sky that never fails.",
            "harder": "Fold and clamp: accordion folds with wooden shapes clamped on both sides, dyed over the clamps, open to sharp white geometry (the itajime way).",
        },
        safety="Gloves on every hand, aprons or smocks over anything worth keeping, and dye mixed and poured by an adult or under an adult's eye. Spent dye water goes down a household drain or onto bare dirt away from gardens and pets, never into a storm drain, and no shirt is worn home against skin while still wet with dye.",
        tags=["season:summer"],
        source=WIKI + "Tie-dye",
        photo={
            "file": "r30/tie-dye-shirts.webp",
            "alt": "A white shirt twisted and bound with rubber bands, held ready for dyeing",
            "caption": "Bound and banded, the shirt is ready for colour.",
            "credit": "Photo: Virginia State Parks staff, CC BY 2.0, via Wikimedia Commons",
            "licence": "CC BY 2.0",
            "source_url": "https://commons.wikimedia.org/wiki/File:Caleb_helping_with_a_tie-dye_shirt_(7726087946).jpg",
        },
    ),
    dict(
        id="chess-first-session", name="Chess, First Session",
        tagline="Sixteen pieces, six kinds of moves, one quiet hour: the first game, taught so it never feels like a test.",
        categories=["quiet-focus"],
        age_min=7, age_max=14, group_min=2, group_max=30,
        time_min=30, time_max=60, location=["indoor"],
        materials=[{"item": "chess sets (one per pair)"},
                   {"item": "a demonstration board (optional)"}],
        no_prep=False,
        setup="One set per pair, a quiet table, and no clock anywhere in sight; first sessions run on curiosity, not time. Set up the demonstration position with the group watching: a light square at every player's right hand, and each queen on her own colour. Pair players of similar experience where you can, and let true beginners play two-to-a-side at first.",
        steps=[
            "Teach the board and the army first. Name every piece, set the position together twice, then have every player set it once alone. Setting up correctly is the first skill of chess.",
            "Teach the moves one piece at a time: pawn first (forward to march, sideways to capture, dreaming of the far side), then rook, bishop, queen, king, and the knight last, because the knight's hop is the move every beginner loves.",
            "Play pawn games before whole games: eight pawns each, first to march one home or capture all of the other's. Small games finish, and finishing teaches more than any lecture.",
            "Then play a first full game with one house rule: any player may take back one move per game, no questions asked. Say check kindly: 'your king is in trouble' before the word check.",
            "End the session mid-interest, never mid-exhaustion, and record nothing but who wants a rematch.",
        ],
        variations={
            "easier": "Mini-chess with half the army (king, queen, two rooks, pawns) and take-backs allowed freely for the first month.",
            "harder": "Bring in a friendly ten-minute clock, and teach one opening idea as the session's single lesson: fight for the centre.",
        },
        safety="The safety here is social, and it is real: chess clubs die on mockery. A lost game is never laughed at, a win is celebrated quietly, and any player may resign with dignity at any time. Pieces stay on the table or in hands, never thrown.",
        inclusion="Large-print and tactile sets serve players with low vision, and players may choose the piece colours they read best. A player who cannot yet sit a full game plays the pawn-game circuit at full standing.",
        source=WIKI + "Chess",
        photo={
            "file": "r30/chess-first-session.webp",
            "alt": "Two boys playing chess over a board set between them",
            "caption": "A game on the street, one move at a time.",
            "credit": "Photo: Adam Jones, CC BY-SA 3.0, via Wikimedia Commons",
            "licence": "CC BY-SA 3.0",
            "source_url": "https://commons.wikimedia.org/wiki/File:Children_Playing_Chess_on_the_Street_-_Santiago_de_Cuba_-_Cuba.jpg",
        },
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="dominoes-first-game", name="Dominoes, First Game",
        tagline="Match the dots and empty your hand: the draw game that teaches counting without ever saying so.",
        categories=["quiet-focus", "rainy-day"],
        age_min=5, age_max=12, group_min=2, group_max=6,
        time_min=15, time_max=30, location=["indoor"],
        materials=[{"item": "a double-six domino set (28 tiles)"}],
        no_prep=False,
        setup="A double-six set is the teaching set: 28 tiles, dots running from blank to six. Turn every tile face down on the table and shuffle them with flat hands, the wash, which children will happily do for a full minute. That minute is part of the game.",
        steps=[
            "Each player draws seven tiles and stands them on edge, dots facing themselves. The rest form the boneyard, the draw pile at the table's edge.",
            "The player holding the double six, or the highest double anyone holds, lays it in the centre to start the line.",
            "Take turns adding one tile to either open end of the line, matching the touching ends dot for dot. Doubles are laid crosswise.",
            "No match in hand? Draw from the boneyard until you can play, or the boneyard runs out. Passing is for players who truly cannot play, and the table will check.",
            "The round ends when one player lays their last tile (call 'domino!') or nobody can move. Count the dots still in each hand; the lowest count takes the round.",
        ],
        variations={
            "easier": "Play one long cooperative snake with all tiles face up, building together and cheering every fit.",
            "harder": "Keep score across five rounds by leftover dots and play to a match total, or graduate the table to a double-nine set.",
        },
        safety="Tiles are small and hard: keep them off the floor, where bare feet and chair wheels go, and away from the youngest children sharing the room.",
        source=WIKI + "Dominoes",
        photo={
            "file": "r30/dominoes-first-game.webp",
            "alt": "A line of dominoes laid end to end with matching dot counts touching",
            "caption": "A domino line grows one matched end at a time.",
            "credit": "Photo: Bermicourt, CC BY-SA 4.0, via Wikimedia Commons",
            "licence": "CC BY-SA 4.0",
            "source_url": "https://commons.wikimedia.org/wiki/File:Dominoes_-_Muggins_-_IMG_7709.jpg",
        },
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="go-fish", name="Go Fish",
        tagline="'Do you have any sevens?' The first card game every child learns, and still the best way to teach asking.",
        categories=["quiet-focus", "rainy-day"],
        age_min=4, age_max=10, group_min=2, group_max=6,
        time_min=10, time_max=20, location=["indoor"],
        materials=[{"item": "a standard deck of cards"}],
        no_prep=True,
        setup="One ordinary deck, jokers out. Deal five cards to each player (seven each when only two play) and scatter the rest face down in a loose pile in the middle: the ocean. Young players may fan their cards face up on the table with a partner's help; the game forgives it completely.",
        steps=[
            "On your turn, choose one player and ask for a rank you already hold: 'Do you have any threes?' You may only ask for what is in your own hand.",
            "Holding that rank? They hand over every card of it, and you ask again. A good ask earns another turn.",
            "Holding none? They say 'Go fish!', and you draw one card from the ocean. Draw the rank you asked for and you show it and take another turn; otherwise your turn ends.",
            "Four cards of one rank make a book. Lay books face up in front of you the moment they are complete.",
            "When the ocean is empty and the hands run out, count the books. Most books wins, and the player with the fewest deals the rematch.",
        ],
        variations={
            "easier": "Play in pairs with cards face up on the table, asking together, or play to pairs instead of books of four.",
            "harder": "The memory rule for older players: nothing may be written down, and a player caught asking for a rank they handed away earlier loses their next turn.",
        },
        safety="Cards are paper; tempers are the only hazard in the game. Keep the asking cheerful and the answers honest, and make rematches instant: the second game of Go Fish is where the learning lives.",
        source=WIKI + "Go_Fish",
        no_elimination=True, copy_free=True,
    ),
    dict(
        id="kids-yoga-first-session", name="Kids Yoga, First Session",
        tagline="Animal poses, slow breaths, and a room that settles itself: a first yoga session built for wiggly bodies.",
        categories=["quiet-focus", "pe-movement"],
        age_min=4, age_max=12, group_min=4, group_max=25,
        time_min=20, time_max=30, location=["indoor"],
        materials=[{"item": "yoga mats or carpet squares (one per child)"},
                   {"item": "calm music (optional)"}],
        no_prep=False,
        setup="Mats or carpet squares in rows with a clear lane to walk, shoes off at the door, and the lights as low as the room allows. The leader sits where every child can see. One rule covers the whole session, said at the start: your mat is your island, and nobody corrects anybody else's pose.",
        steps=[
            "Start seated. Breathe in while hands float up, out while they float down, five slow rounds, until the room's noise drops along with the hands.",
            "Move through animal poses, three breaths each: cat and cow on hands and knees, downward dog, a low hissing cobra, then frog squats with three jumps at the end of the set to spend the giggles.",
            "Standing poses next: tree (foot resting at ankle or calf, never pressed into the knee), warrior two, and airplane, tipping forward with arms out, where falling over is expected and applauded.",
            "Close the active half with a partner pose: seated back to back, breathing slowly enough that each partner can feel the other's breath move. Thirty quiet seconds is a triumph.",
            "Finish lying down, eyes closed or gazing up, for one minute of stillness with a picture to hold in mind: floating on a raft, snow falling. Wake the room slowly: fingers, toes, then sitting.",
        ],
        variations={
            "easier": "Chair yoga for the whole session: every pose takes its seated form, and the breathing rounds carry the class.",
            "harder": "Flow round: link four known poses into a sequence and repeat it without the leader's voice, the group counting breaths in silence.",
        },
        safety="Yoga is invited, never forced: any child may rest in child's pose or sit out any move, no reason needed. No pose pushes a joint past comfort, and a child who feels dizzy sits down at once. Bodies differ; the session bends to the bodies in it, never the other way around.",
        inclusion="Every pose here has a chair form and a standing form of equal standing, and the leader shows both. A child using a mobility aid places their mat where the lane is widest.",
        source="https://cosmickids.com/kids-yoga-in-schools-research-benefits/",
        photo={
            "file": "r30/kids-yoga-first-session.webp",
            "alt": "A class of children holding a yoga pose together in a bright room",
            "caption": "One pose, held together, in a quiet room.",
            "credit": "Photo: Georgia National Guard, CC BY 2.0, via Wikimedia Commons",
            "licence": "CC BY 2.0",
            "source_url": "https://commons.wikimedia.org/wiki/File:Kids_Yoga_(19125038413).jpg",
        },
        no_elimination=True, copy_free=True,
    ),
]

SOURCE_COMPLETIONS = {
    "red-light-green-light": WIKI + "Statues_(game)",
    "jump-rope-countdown": WIKI + "Skipping_rope",
    "relay-race-mixup": WIKI + "Sprint_relay",
    "hula-hoop-pass": "http://en.wikipedia.org/wiki/Hula_hoop",
    "puddle-hopscotch": WIKI + "Hopscotch",
    "paper-cup-telephone": WIKI + "Tin-can_telephone",
    "winter-hide-and-seek": "http://en.wikipedia.org/wiki/Hide-and-seek",
    "shadow-tag": WIKI + "Tag_sports",
}

PHOTO_COMPLETIONS = {
    "puddle-hopscotch": {
        "file": "r30/puddle-hopscotch.webp",
        "alt": "A boy hopping along a chalk hopscotch court on a driveway",
        "caption": "A chalk court on the pavement, hopped one square at a time.",
        "credit": "Photo: Lenore Edman, CC BY 2.0, via Wikimedia Commons",
        "licence": "CC BY 2.0",
        "source_url": "https://commons.wikimedia.org/wiki/File:Hopscotch_in_driveway.jpg",
    },
}

COLLECTION = {
    "id": "field-day-classics",
    "title": "Field Day Classics",
    "glyph": "\U0001F3C5",
    "when_to_use": "The whole sports day on one shelf: the four races every field day runs (spoon, sack, three legs, wheelbarrow), a relay where every leg travels differently, the home obstacle course, a cup-stacking relay against the clock, and the one-rope closer. Reach for it when the field, the cones, and the whole school are yours for a day.",
    "picks": [
        {"id": "egg-and-spoon-race", "note": "Balance beats speed: a spoon, a wobbling egg, and a whole field learning to walk fast without running."},
        {"id": "sack-race", "note": "Two legs, one sack, no dignity: the hop race that turns the fastest kid in school into a beginner again."},
        {"id": "three-legged-race", "note": "Pairs tied at the ankle learn the day's real lesson in ten strides: match your partner or sit down together."},
        {"id": "wheelbarrow-race", "note": "Half of each pair walks on their hands: the race that makes the whole field laugh and every arm honest-tired."},
        {"id": "relay-race-mixup", "note": "The baton relay where no two legs travel the same way: hop it, spin it, balance it home."},
        {"id": "obstacle-course", "note": "The home course: chalk lines, hoops, tunnels, and whatever the gym closet gives up."},
        {"id": "cup-stack-relay", "note": "Pyramids against the clock, run as a team relay: hands fast, stacks faster."},
        {"id": "tug-of-war", "note": "The closer: one rope, two teams, and a line in the grass that nobody wants to be pulled across."},
    ],
}


def tokens(s):
    return set(re.findall(r"[a-z0-9]+", s.lower()))


def main():
    path = os.path.join(DATA, "activities.json")
    acts = json.load(open(path))
    by_id = {a["id"]: a for a in acts}
    corpus = [(a["id"], tokens(a["name"] + " " + a["tagline"])) for a in acts]
    for rec in PACK:
        assert rec["id"] not in by_id, f"id already exists: {rec['id']}"
        t = tokens(rec["name"] + " " + rec["tagline"])
        worst, wid = 0.0, None
        for oid, ot in corpus:
            j = len(t & ot) / max(1, len(t | ot))
            if j > worst:
                worst, wid = j, oid
        print(f"jaccard {rec['id']}: worst {worst:.2f} vs {wid}")
        assert worst < 0.55, f"near-duplicate: {rec['id']} vs {wid} ({worst:.2f})"
        assert len(rec["tagline"]) <= 160, f"tagline too long: {rec['id']} ({len(rec['tagline'])})"
        words = len(json.dumps(rec).split())
        print(f"words {rec['id']}: {words}")
        assert words >= 240, f"record under the classic bar: {rec['id']} ({words})"
        blob = json.dumps(rec, ensure_ascii=False)
        assert "—" not in blob, f"em dash in record copy: {rec['id']}"
    added = 0
    for rec in PACK:
        acts.append(rec)
        by_id[rec["id"]] = rec
        added += 1
    print(f"added {added} activities; total now {len(acts)}")

    src_done = 0
    for rid, url in SOURCE_COMPLETIONS.items():
        rec = by_id.get(rid)
        assert rec is not None, f"completion target missing: {rid}"
        if rec.get("source"):
            print(f"source skip (already set): {rid}")
            continue
        rec["source"] = url
        src_done += 1
        print(f"source added: {rid} -> {url}")
    ph_done = 0
    for rid, photo in PHOTO_COMPLETIONS.items():
        rec = by_id.get(rid)
        assert rec is not None, f"photo target missing: {rid}"
        if rec.get("photo"):
            print(f"photo skip (already set): {rid}")
            continue
        rec["photo"] = photo
        ph_done += 1
        print(f"photo added: {rid} -> {photo['file']}")
    json.dump(acts, open(path, "w"), indent=1, ensure_ascii=False)
    print(f"completions: {src_done} sources, {ph_done} photos")

    cpath = os.path.join(DATA, "collections.json")
    cdata = json.load(open(cpath))
    colls = cdata["collections"]
    if COLLECTION["id"] not in {c["id"] for c in colls}:
        colls.append(COLLECTION)
        cdata["collections"] = colls
        json.dump(cdata, open(cpath, "w"), indent=1, ensure_ascii=False)
        print(f"collection added: {COLLECTION['id']} ({len(COLLECTION['picks'])} picks); collections now {len(colls)}")
    else:
        print("collection exists, skipped; collections:", len(colls))

    n_photo = sum(1 for a in acts if a.get("photo"))
    n_source = sum(1 for a in acts if a.get("source"))
    print(f"CENSUS after wave 44 data step: {len(acts)} activities, {n_photo} with photo, {n_source} with source")


if __name__ == "__main__":
    main()
