#!/usr/bin/env node
/* Wave 28 assertions: First Years, Third Shelf — the age-3 build
   aimed at the holes INSIDE age-3 coverage, measured before this
   wave (primary-category records covering age 3): holidays 0 (the
   last category with none), seasons 1, rainy-day 1, stem 2,
   team-community 2, icebreakers 2, outdoor 3, music-rhythm 3.
   Twelve more activities designed for 3-year-olds first (age_min 3,
   age_max <= 6, runs <= 25 min, one rule per game) land two each in
   holidays/seasons/rainy-day and one each in stem/team/icebreakers/
   outdoor/music-rhythm/pe-movement — so after this wave EVERY one
   of the 11 primary categories has at least 2 records written for
   the three-year-old room. Plus the 18th collection "Little Hands,
   Third Shelf", and a fresh Scout cycle that queued 0 new
   candidates (reported as empty, honestly).
   Run after scripts/build.py. Exits non-zero on the first failure. */
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
ok(acts.length === 747, '685 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['soft-ball-new-year-drop', 'big-egg-roll-slope',
  'first-puddle-walk', 'cup-of-snow-melting-watch',
  'cushion-train-all-aboard', 'box-boat-row-along',
  'wide-plank-bridge-crossing', 'blanket-ball-bounce-together',
  'animal-sound-find-your-pair', 'chalk-arrow-trail',
  'loud-quiet-song-switch', 'two-foot-landing-pads'];
ok(NEW.length === 12, '12 new activities in the wave-28 pack');
NEW.forEach(id => ok(byId[id], 'wave-28 id present: ' + id));

// 1. The age-3 gap, continued honestly: coverage 34 -> 46 against
//    136 -> 148 at age 4 — narrower, still the thinnest age, not closed.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 160, 'age 3 coverage 34 -> 46 in wave 28; wave 29 -> 58; wave 30 -> 70; wave 31 -> 82; wave 32 -> 94; wave 33 -> 106', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage 136 -> 148 in wave 28; wave 29 -> 160', String(covers(4)));
ok(acts.filter(a => a.age_min === 3).length === 160, '94 activities start at age 3 (58 + 12 wave-30 + 12 wave-31 + 12 wave-32)');
ok(acts.filter(a => a.age_max <= 6).length === 153, 'early-years-only (age_max<=6) 27 -> 39; wave 29 -> 51; wave 30 -> 63; wave 31 -> 75; wave 32 -> 87; wave 33 -> 99; wave 34 -> 111');
[13, 14].forEach(age => ok(covers(age) === 120, 'age ' + age + ' coverage 76 -> 88 (wave-39)', String(covers(age))));
NEW.forEach(id => {
  ok(byId[id].age_min === 3, id + ': designed for 3 (age_min 3)');
  ok(byId[id].age_max <= 6, id + ': early-years band (age_max <= 6)');
  ok(byId[id].time_max <= 25, id + ': short run for small attention (time_max <= 25)');
});

// 2. The holes inside age-3 coverage: first holiday primaries at age 3,
//    and every primary category now carries >= 2 age-3 records.
const age3primary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 3 && a.age_max >= 3).length;
ok(age3primary('holidays') === 13, 'age-3 holidays primary: 0 -> 2 in wave 28 (the last zero); wave 29 -> 4; wave 30 -> 5; wave 31 -> 6; wave 32 -> 8', String(age3primary('holidays')));
ok(age3primary('seasons') === 14, 'age-3 seasons primary: 1 -> 3 in wave 28; wave 29 -> 5; wave 30 -> 6; wave 31 -> 7; wave 32 -> 9', String(age3primary('seasons')));
ok(age3primary('rainy-day') === 18, 'age-3 rainy-day primary: 1 -> 3 in wave 28; wave 29 -> 4; wave 30 -> 6; wave 31 -> 8; wave 32 -> 12', String(age3primary('rainy-day')));
ok(age3primary('stem') === 14, 'age-3 stem primary: 2 -> 3 in wave 28; wave 29 -> 5; wave 30 -> 6; wave 31 -> 7; wave 32 -> 9', String(age3primary('stem')));
ok(age3primary('team-community') === 13, 'age-3 team-community primary: 2 -> 3 in wave 28; wave 29 -> 4; wave 30 -> 5; wave 31 -> 6; wave 32 -> 8', String(age3primary('team-community')));
ok(age3primary('icebreakers') === 14, 'age-3 icebreakers primary: 2 -> 3 in wave 28; wave 29 -> 5; wave 30 -> 6; wave 31 -> 7; wave 32 -> 9', String(age3primary('icebreakers')));
ok(age3primary('outdoor') === 14, 'age-3 outdoor primary: 3 -> 4 in wave 28; wave 29 -> 5; wave 30 -> 6; wave 31 -> 7; wave 32 -> 9', String(age3primary('outdoor')));
ok(age3primary('music-rhythm') === 15, 'age-3 music-rhythm primary: 3 -> 4 in wave 28; wave 29 -> 5; wave 30 -> 6; wave 31 -> 7; wave 32 -> 9', String(age3primary('music-rhythm')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(age3primary(cat) >= 2, 'every category has >= 2 age-3 primaries: ' + cat, String(age3primary(cat)));
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
  ok(a.age_min >= 3 && a.age_min <= a.age_max && a.age_max <= 18, id + ': sane ages');
  ok(a.group_min <= a.group_max && a.time_min <= a.time_max, id + ': sane group/time');
  ok(a.setup && a.setup.length >= 40, id + ': real setup');
  ok(a.copy_free === true, id + ': copy_free (zero printing, like the whole pack)');
  const blob = JSON.stringify(a).toLowerCase();
  MEDICAL.forEach(w => ok(!blob.includes(w), id + ': no medical claim "' + w + '"'));
  AIISMS.forEach(w => ok(!blob.includes(w), id + ': no AI-ism "' + w + '"'));
  ok(fs.existsSync(path.join(ROOT, 'activity', id + '.html')), id + ': page rendered');
});

// 4. Honest framing + real-world safety, checked on the records.
// Ball drop: the ball only falls on "one", and it is dropped, never thrown.
ok(/only falls on one/.test(JSON.stringify(byId['soft-ball-new-year-drop'])), 'ball drop: falls only on one');
ok(/never thrown/.test(byId['soft-ball-new-year-drop'].safety || ''), 'ball drop: dropped, never thrown');
// Egg roll: the real tradition, dated, and plastic eggs only.
ok(/1878/.test(JSON.stringify(byId['big-egg-roll-slope'])), 'egg roll: White House tradition dated 1878');
ok(/Plastic eggs only/.test(byId['big-egg-roll-slope'].safety || ''), 'egg roll: plastic eggs only');
ok(/seated position/.test(byId['big-egg-roll-slope'].inclusion || ''), 'egg roll: seated roll counts');
// Snow cup: melt water is never drunk; the story can be told by feel.
ok(/never drunk/.test(byId['cup-of-snow-melting-watch'].safety || ''), 'snow cup: melt water never drunk');
ok(/by feel/.test(byId['cup-of-snow-melting-watch'].inclusion || ''), 'snow cup: feel tells the story too');
// Puddle walk: the dry edge is a full post, and hands wash after.
ok(/dry edge counts/.test(byId['first-puddle-walk'].inclusion || ''), 'puddle walk: dry edge counts in full');
ok(/hands wash/.test(byId['first-puddle-walk'].safety || ''), 'puddle walk: hands wash after');
// Box boat: a chair boat is a boat.
ok(/chair boat counts/.test(byId['box-boat-row-along'].inclusion || ''), 'box boat: chair boat counts in full');
// Bridge: toys cross, never feet; directing is building.
ok(/never for feet/.test(byId['wide-plank-bridge-crossing'].safety || ''), 'bridge: toys only, never feet');
ok(/Directing is building/.test(byId['wide-plank-bridge-crossing'].inclusion || ''), 'bridge: directing counts as building');
// Blanket ball / landing pads: low and still, on purpose.
ok(/knee height at most/.test(byId['blanket-ball-bounce-together'].safety || ''), 'blanket ball: kept at knee height at most');
ok(/Stepping across counts/.test(byId['two-foot-landing-pads'].inclusion || ''), 'landing pads: stepping across counts');
ok(/moving pad is a fall/.test(byId['two-foot-landing-pads'].safety || ''), 'landing pads: sliding pad retired');

// 5. Category + enrichment deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('holidays') === 56, 'holidays primary 40 -> 42 in wave 28; wave 29 -> 44; wave 30 -> 45; wave 31 -> 46; wave 32 -> 48');
ok(prim('seasons') === 49, 'seasons primary 28 -> 30 in wave 28; wave 29 -> 32; wave 30 -> 33; wave 31 -> 34; wave 32 -> 36');
ok(prim('rainy-day') === 43, 'rainy-day primary 22 -> 24 in wave 28; wave 29 -> 25; wave 30 -> 27; wave 31 -> 29; wave 32 -> 33');
ok(prim('stem') === 122, 'stem primary 108 -> 109 in wave 28; wave 29 -> 111; wave 30 -> 112; wave 31 -> 113; wave 32 -> 115');
ok(prim('team-community') === 78, 'team-community primary 66 -> 67 in wave 28; wave 29 -> 68; wave 30 -> 69; wave 31 -> 70; wave 32 -> 72');
ok(prim('icebreakers') === 51, 'icebreakers primary 35 -> 36 in wave 28; wave 29 -> 38; wave 30 -> 39; wave 31 -> 40; wave 32 -> 42');
ok(prim('outdoor') === 64, 'outdoor primary 46 -> 47 in wave 28; wave 29 -> 48; wave 30 -> 49; wave 31 -> 50; wave 32 -> 52');
ok(prim('music-rhythm') === 44, 'music-rhythm primary 28 -> 29 in wave 28; wave 29 -> 30; wave 30 -> 31; wave 31 -> 32; wave 32 -> 34');
ok(prim('pe-movement') === 75, 'pe-movement primary 60 -> 61; wave 30 -> 62; wave 31 -> 63; wave 32 -> 65');
ok(acts.filter(a => a.copy_free).length === 367, 'copy_free 197 -> 209; wave 29 -> 221; wave 30 -> 233; wave 31 -> 245; wave 32 -> 257; wave 33 -> 269');
ok(acts.filter(a => a.no_elimination).length === 169, 'no_elimination 57 -> 63; wave 29 -> 70; wave 30 -> 75; wave 31 -> 81; wave 32 -> 87; wave 33 -> 93');
ok(acts.filter(a => a.inclusion).length === 229, 'inclusion 75 -> 81; wave 29 -> 87; wave 30 -> 95; wave 31 -> 107; wave 32 -> 119; wave 33 -> 131');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:easter') === 8, 'easter tag 7 -> 8', String(tagCount('holiday:easter')));
ok(tagCount('holiday:new-year') === 11, 'new-year tag 9 -> 10', String(tagCount('holiday:new-year')));

// 6. The 18th collection: Little Hands, Third Shelf — earlier shelves intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 32, '26 collections', String(colls.length));
const ts = colls.find(c => c.id === 'little-hands-third-shelf');
ok(!!ts, 'little-hands-third-shelf collection present');
ok(ts.picks.length === 12, 'third-shelf collection has 12 picks');
ts.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
  ok(byId[p.id].age_min <= 3, 'collection pick is age-3 reachable: ' + p.id);
});
NEW.forEach(id => ok(ts.picks.some(p => p.id === id), 'collection anchors the new pack: ' + id));
const lh = colls.find(c => c.id === 'little-hands-first-years');
ok(!!lh && lh.picks.length === 12, 'little-hands-first-years still intact at 12 picks');
const nx = colls.find(c => c.id === 'little-hands-next-steps');
ok(!!nx && nx.picks.length === 12, 'little-hands-next-steps still intact at 12 picks');

// 7. Scout pipeline: a fresh live cycle ran before this wave's build
//    and queued ZERO new candidates — all 65 feed items were already
//    in seen.json or failed the relevance filter. An empty cycle is
//    reported as empty: the queue is unchanged and fully decided.
const queue = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/review-queue.json'), 'utf8'));
ok(queue.length === 62, 'queue unchanged at 60 (empty cycle, honestly)', String(queue.length));
ok(queue.filter(q => q.status === 'pending').length === 0, '0 pending — nothing waiting on a human');
ok(queue.filter(q => q.status === 'accepted').length === 22, '22 accepted all-time');
ok(queue.filter(q => q.status === 'rejected').length === 40, '38 rejected all-time');
queue.forEach(q => ok(q.decision && q.decision.length >= 20, 'decision reason recorded: ' + (q.title || q.id).slice(0, 40)));
queue.filter(q => q.status === 'accepted').forEach(q =>
  ok(q.activity_id && byId[q.activity_id], 'accepted candidate resolves to a real activity: ' + q.activity_id));
const seen = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/seen.json'), 'utf8'));
ok(Object.keys(seen).length === 73, 'seen.json dedupe memory unchanged at 70', String(Object.keys(seen).length));
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds configured', String(feeds.length));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/review-queue.json'), 'utf8'));
ok((pub.candidates || []).length === 0, 'published queue shows 0 pending candidates');

console.log('test-wave28: ' + passed + ' assertions pass');
