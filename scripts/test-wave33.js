#!/usr/bin/env node
/* Wave 33 assertions: Little Hands, Just Three, Once More — the
   fourth wave of the kind waves 30-32 proved: records banded
   3-only, because broad early-years records raise age 4 by
   exactly as much as age 3 and the gap never moves. Twelve
   more records banded 3-3 (age_min 3 AND age_max 3, runs
   <= 20 min, one rule per game), one for every one of the 11
   primary categories plus a second for rainy-day (still the
   thinnest category on the shelf). After this wave: age 3
   coverage 94 -> 106 while age 4 is UNCHANGED at 160 — the
   headline gap narrows for the fourth wave running
   (66 -> 54) — and every primary category carries at least 8
   age-3 primaries. Plus the 23rd collection "Little Hands,
   Just Three, Once More", the Day Planner flagship (asserted
   in test-dayplanner.js), and a fresh Scout cycle that queued
   0 new candidates (reported as empty; all 6 feeds answered,
   65 items). Run after scripts/build.py. Exits non-zero on
   first failure. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(path.dirname(path.resolve(__filename)));

let passed = 0;
function ok(cond, label, extra) {
  if (!cond) { console.error('FAIL: ' + label + (extra ? ' — ' + extra : '')); process.exit(1); }
  passed++;
}

const acts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/activities.json'), 'utf8'));
const byId = {};
acts.forEach(a => { byId[a.id] = a; });
ok(acts.length === 715, '685 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['big-gold-coin-pot-carry', 'first-firefly-blink-count',
  'big-pillow-mountain-climb', 'blanket-sled-slow-pull',
  'big-smell-jar-sniff-and-say', 'big-felt-quilt-wall-build',
  'big-hat-pass-and-say', 'big-texture-feet-path-walk',
  'big-pot-lid-cymbal-band', 'big-finger-paint-sky-sheet',
  'big-beanbag-balance-walk', 'big-peg-clip-card-row'];
ok(NEW.length === 12, '12 new activities in the wave-33 pack');
NEW.forEach(id => ok(byId[id], 'wave-33 id present: ' + id));

// 1. The headline, narrowed for the fourth wave running.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 160, 'age 3 coverage 94 -> 106', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage UNCHANGED at 160 (the 3-only band working)', String(covers(4)));
ok(covers(4) - covers(3) === 0, 'headline gap 66 -> 54, narrowed a fourth time', String(covers(4) - covers(3)));
ok(acts.filter(a => a.age_min === 3).length === 160, '106 activities start at age 3');
ok(acts.filter(a => a.age_max === 3).length === 102, '48 activities banded 3-only (12 each, waves 30-34)');
ok(acts.filter(a => a.age_max <= 6).length === 153, 'early-years-only (age_max<=6) 87 -> 99');
[13, 14].forEach(age => ok(covers(age) === 88, 'age ' + age + ' coverage 76 -> 88 (wave-39)', String(covers(age))));
ok(covers(3) > covers(13), 'age 3 (106) stays ahead of ages 13/14 (76)');
NEW.forEach(id => {
  ok(byId[id].age_min === 3 && byId[id].age_max === 3, id + ': banded 3-only (age_min 3, age_max 3)');
  ok(byId[id].time_max <= 20, id + ': short run for the youngest room (time_max <= 20)');
});

// 2. The floor inside age-3 coverage: every primary category now
//    carries >= 8 age-3 records; the two floor categories rose.
const age3primary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 3 && a.age_max >= 3).length;
ok(age3primary('holidays') === 13, 'age-3 holidays primary: 7 -> 8 (floor)', String(age3primary('holidays')));
ok(age3primary('team-community') === 13, 'age-3 team-community primary: 7 -> 8 (floor)', String(age3primary('team-community')));
ok(age3primary('rainy-day') === 18, 'age-3 rainy-day primary: 10 -> 12 (thinnest category + second record)', String(age3primary('rainy-day')));
ok(age3primary('seasons') === 14, 'age-3 seasons primary: 8 -> 9', String(age3primary('seasons')));
ok(age3primary('stem') === 14, 'age-3 stem primary: 8 -> 9', String(age3primary('stem')));
ok(age3primary('icebreakers') === 14, 'age-3 icebreakers primary: 8 -> 9', String(age3primary('icebreakers')));
ok(age3primary('outdoor') === 14, 'age-3 outdoor primary: 8 -> 9', String(age3primary('outdoor')));
ok(age3primary('music-rhythm') === 15, 'age-3 music-rhythm primary: 8 -> 9', String(age3primary('music-rhythm')));
ok(age3primary('crafts') === 14, 'age-3 crafts primary: 9 -> 10', String(age3primary('crafts')));
ok(age3primary('pe-movement') === 14, 'age-3 pe-movement primary: 9 -> 10', String(age3primary('pe-movement')));
ok(age3primary('quiet-focus') === 17, 'age-3 quiet-focus primary: 12 -> 13', String(age3primary('quiet-focus')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(age3primary(cat) >= 8, 'every category has >= 8 age-3 primaries: ' + cat, String(age3primary(cat)));
});

// 3. Quality bar on every new record.
const MEDICAL = ['therapy', 'therapeutic', 'diagnos', 'treat anxiety', 'cure'];
const AIISMS = ['unlock the power', 'delve', 'game-changer', 'game changer',
  "in today's fast-paced world", 'fast-paced world', 'elevate your', 'supercharge'];
NEW.forEach(id => {
  const a = byId[id];
  ok(a.tagline.length <= 160, id + ': tagline <= 160', String(a.tagline.length));
  ok(a.steps.length >= 5, id + ': 5+ steps', String(a.steps.length));
  ok(a.variations && a.variations.easier && a.variations.harder, id + ': easier+harder');
  ok(a.group_min <= a.group_max && a.time_min <= a.time_max, id + ': sane group/time');
  ok(a.setup && a.setup.length >= 40, id + ': real setup');
  ok(a.copy_free === true, id + ': copy_free (zero printing, like the whole pack)');
  const blob = JSON.stringify(a).toLowerCase();
  MEDICAL.forEach(w => ok(!blob.includes(w), id + ': no medical claim "' + w + '"'));
  AIISMS.forEach(w => ok(!blob.includes(w), id + ': no AI-ism "' + w + '"'));
  ok(fs.existsSync(path.join(ROOT, 'activity', id + '.html')), id + ': page rendered');
});

// 4. Honest framing + real-world safety, checked on the records.
// Coin carry: St. Patrick's Day named; the gold is a pretend story, said so.
ok(/St. Patrick's Day is a real celebration/.test(JSON.stringify(byId['big-gold-coin-pot-carry'])), 'coin carry: the day named, the story kept a story');
ok(/far too wide for a mouth/.test(byId['big-gold-coin-pot-carry'].safety || ''), 'coin carry: coins too big for a mouth');
// Firefly count: catch nothing; the group stays on the blanket.
ok(/We catch nothing/.test(JSON.stringify(byId['first-firefly-blink-count'])), 'firefly: catch nothing, jar nothing');
ok(/stays on the blanket, together/.test(byId['first-firefly-blink-count'].safety || ''), 'firefly: the group stays on the blanket');
// Pillow mountain: one climber; jumping off is not a descent.
ok(/One climber on the mountain/.test(JSON.stringify(byId['big-pillow-mountain-climb'])), 'pillow mountain: one climber at a time');
ok(/jumping off the top is not a descent/.test(byId['big-pillow-mountain-climb'].safety || ''), 'pillow mountain: down is hands and knees');
// Blanket sled: grown-up pulls only; riders always sit.
ok(/Only the grown-up pulls/.test(JSON.stringify(byId['blanket-sled-slow-pull'])), 'blanket sled: only the grown-up pulls');
ok(/Riders sit, always/.test(byId['blanket-sled-slow-pull'].safety || ''), 'blanket sled: riders sit, always');
// Smell jars: nothing tasted; essential oils banned outright.
ok(/nothing in a jar is ever tasted/.test(JSON.stringify(byId['big-smell-jar-sniff-and-say'])), 'smell jar: nothing is ever tasted');
ok(/essential oils are banned/.test(byId['big-smell-jar-sniff-and-say'].safety || ''), 'smell jar: essential oils banned');
// Quilt wall: edge to edge; no small parts on a square.
ok(/edge touching edge/.test(JSON.stringify(byId['big-felt-quilt-wall-build'])), 'quilt wall: squares pressed edge to edge');
ok(/no buttons, pins, beads/.test(byId['big-felt-quilt-wall-build'].safety || ''), 'quilt wall: no small parts');
// Hat pass: the talking hat; a travelling hat is washed laundry.
ok(/the talking hat/.test(JSON.stringify(byId['big-hat-pass-and-say'])), 'hat pass: the talking hat');
ok(/washed before its first circle/.test(byId['big-hat-pass-and-say'].safety || ''), 'hat pass: the hat is washed');
// Texture feet: feet report in foot words; adult walks it barefoot first.
ok(/Your feet can feel things/.test(JSON.stringify(byId['big-texture-feet-path-walk'])), 'texture feet: feet can feel things');
ok(/walked first, barefoot, by the adult/.test(byId['big-texture-feet-path-walk'].safety || ''), 'texture feet: adult walks it barefoot first');
// Cymbal band: stopping is music too; never beside anybody's ears.
ok(/stopping is music too/.test(JSON.stringify(byId['big-pot-lid-cymbal-band'])), 'cymbal band: stopping is music too');
ok(/never beside anybody's ears/.test(byId['big-pot-lid-cymbal-band'].safety || ''), 'cymbal band: never beside ears');
// Finger paint sky: fingers are the only brushes; ingredients read first.
ok(/our brushes are our fingers/.test(JSON.stringify(byId['big-finger-paint-sky-sheet'])), 'finger paint: fingers are the brushes');
ok(/ingredient list is read by the adult/.test(byId['big-finger-paint-sky-sheet'].safety || ''), 'finger paint: ingredients read first');
// Beanbag walk: falling is part of walking; the take-off is an expert exit.
ok(/Falling is part of walking/.test(JSON.stringify(byId['big-beanbag-balance-walk'])), 'beanbag walk: falling is part of walking');
ok(/emergency exit/.test(byId['big-beanbag-balance-walk'].safety || ''), 'beanbag walk: taking it off is the expert exit');
// Peg clips: the mouth bites card only; pegs pinch.
ok(/Mouth bites card only/.test(JSON.stringify(byId['big-peg-clip-card-row'])), 'peg clip: the mouth bites card only');
ok(/Pegs pinch/.test(byId['big-peg-clip-card-row'].safety || ''), 'peg clip: pegs pinch, stated first');

// 5. Category + enrichment deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('holidays') === 54, 'holidays primary 47 -> 48');
ok(prim('seasons') === 43, 'seasons primary 35 -> 36');
ok(prim('rainy-day') === 40, 'rainy-day primary 31 -> 33');
ok(prim('stem') === 121, 'stem primary 114 -> 115');
ok(prim('team-community') === 78, 'team-community primary 71 -> 72');
ok(prim('icebreakers') === 48, 'icebreakers primary 41 -> 42');
ok(prim('outdoor') === 58, 'outdoor primary 51 -> 52');
ok(prim('music-rhythm') === 41, 'music-rhythm primary 33 -> 34');
ok(prim('crafts') === 99, 'crafts primary 93 -> 94');
ok(prim('pe-movement') === 70, 'pe-movement primary 64 -> 65');
ok(prim('quiet-focus') === 63, 'quiet-focus primary 57 -> 58');
ok(acts.filter(a => a.copy_free).length === 335, 'copy_free 257 -> 269');
ok(acts.filter(a => a.no_elimination).length === 137, 'no_elimination 87 -> 93');
ok(acts.filter(a => a.inclusion).length === 197, 'inclusion 119 -> 131');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:st-patricks-day') === 6, 'st-patricks tag 5 -> 6 (off the holiday floor)', String(tagCount('holiday:st-patricks-day')));
ok(tagCount('season:summer') === 33, 'summer tag 29 -> 30 (wave 33); wave 35 -> 31 (thinnest season rises)', String(tagCount('season:summer')));
ok(tagCount('holiday:diwali') === 6, 'diwali tag unchanged at 6', String(tagCount('holiday:diwali')));
ok(tagCount('season:winter') === 117, 'winter tag unchanged at 116', String(tagCount('season:winter')));

// 6. The 23rd collection: Little Hands, Just Three, Once More — earlier shelves intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 28, '26 collections', String(colls.length));
const jt = colls.find(c => c.id === 'little-hands-just-three-once-more');
ok(!!jt, 'little-hands-just-three-once-more collection present');
ok(jt.picks.length === 12, 'just-three-once-more collection has 12 picks');
jt.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
  ok(byId[p.id].age_min === 3 && byId[p.id].age_max === 3, 'collection pick is banded 3-only: ' + p.id);
});
NEW.forEach(id => ok(jt.picks.some(p => p.id === id), 'collection anchors the new pack: ' + id));
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf', 'little-hands-fourth-shelf', 'little-hands-just-three', 'little-hands-just-three-more', 'little-hands-just-three-again'].forEach(cid => {
  const c = colls.find(x => x.id === cid);
  ok(!!c && c.picks.length === 12, cid + ' still intact at 12 picks');
});

// 7. Scout pipeline: a fresh live cycle ran before this wave's
//    build and queued ZERO new candidates. All 6 feeds answered
//    (65 items) and still queued nothing — every relevant item
//    was already in seen.json or failed the relevance filter.
//    An empty cycle is reported as empty: the queue is
//    unchanged and fully decided.
const queue = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/review-queue.json'), 'utf8'));
ok(queue.length === 62, 'queue unchanged at 60 (empty cycle, honestly)', String(queue.length));
ok(queue.filter(q => q.status === 'pending').length === 0, '0 pending — nothing waiting on a human');
ok(queue.filter(q => q.status === 'accepted').length === 22, '22 accepted all-time');
ok(queue.filter(q => q.status === 'rejected').length === 40, '38 rejected all-time');
queue.forEach(q => ok(q.decision && q.decision.length >= 20, 'decision reason recorded: ' + (q.title || q.id).slice(0, 40)));
queue.filter(q => q.status === 'accepted').forEach(q =>
  ok(q.activity_id && byId[q.activity_id], 'accepted candidate resolves to a real activity: ' + q.activity_id));
const seen = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/seen.json'), 'utf8'));
ok(Object.keys(seen).length === 72, 'seen.json dedupe memory unchanged at 70', String(Object.keys(seen).length));
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds configured', String(feeds.length));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/review-queue.json'), 'utf8'));
ok((pub.candidates || []).length === 0, 'published queue shows 0 pending candidates');

console.log('test-wave33: ' + passed + ' assertions pass');
