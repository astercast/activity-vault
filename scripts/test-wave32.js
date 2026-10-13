#!/usr/bin/env node
/* Wave 32 assertions: Little Hands, Just Three, Again — the
   third wave of the kind waves 30-31 proved: records banded
   3-only, because broad early-years records raise age 4 by
   exactly as much as age 3 and the gap never moves. Twelve
   more records banded 3-3 (age_min 3 AND age_max 3, runs
   <= 20 min, one rule per game), one for every one of the 11
   primary categories plus a second for rainy-day (still the
   thinnest category on the shelf). After this wave: age 3
   coverage 82 -> 94 while age 4 is UNCHANGED at 160 — the
   headline gap narrows for the third wave running
   (78 -> 66) — and every primary category carries at least 7
   age-3 primaries. Plus the 22nd collection "Little Hands,
   Just Three, Again", and a fresh Scout cycle that queued 0
   new candidates (reported as empty; all 6 feeds answered,
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
ok(acts.length === 637, '637 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['paper-diya-welcome-row', 'roll-it-bigger-snowball',
  'big-tape-roads-car-town', 'fog-window-finger-drawing',
  'big-shadow-grow-shrink', 'sponge-pass-fill-the-pot',
  'show-me-three-fingers', 'after-rain-worm-count',
  'feel-the-beat-heart-tap', 'big-sponge-stamp-mural',
  'big-ball-kick-to-wall', 'big-zip-up-down-board'];
ok(NEW.length === 12, '12 new activities in the wave-32 pack');
NEW.forEach(id => ok(byId[id], 'wave-32 id present: ' + id));

// 1. The headline, narrowed for the third wave running: this
//    pack is banded 3-3, so age 3 rises 82 -> 94 and age 4 does
//    NOT rise with it (160, unchanged). Gap 78 -> 66.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 94, 'age 3 coverage 82 -> 94', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage UNCHANGED at 160 (the 3-only band working)', String(covers(4)));
ok(covers(4) - covers(3) === 66, 'headline gap 78 -> 66, narrowed a third time', String(covers(4) - covers(3)));
ok(acts.filter(a => a.age_min === 3).length === 94, '94 activities start at age 3');
ok(acts.filter(a => a.age_max === 3).length === 36, '36 activities banded 3-only (12 wave-30 + 12 wave-31 + 12 wave-32)');
ok(acts.filter(a => a.age_max <= 6).length === 87, 'early-years-only (age_max<=6) 75 -> 87');
[13, 14].forEach(age => ok(covers(age) === 76, 'age ' + age + ' coverage unchanged at 76', String(covers(age))));
ok(covers(3) > covers(13), 'age 3 (94) stays ahead of ages 13/14 (76)');
NEW.forEach(id => {
  ok(byId[id].age_min === 3 && byId[id].age_max === 3, id + ': banded 3-only (age_min 3, age_max 3)');
  ok(byId[id].time_max <= 20, id + ': short run for the youngest room (time_max <= 20)');
});

// 2. The floor inside age-3 coverage: every primary category now
//    carries >= 7 age-3 records; the two floor categories rose.
const age3primary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 3 && a.age_max >= 3).length;
ok(age3primary('holidays') === 7, 'age-3 holidays primary: 6 -> 7 (floor)', String(age3primary('holidays')));
ok(age3primary('team-community') === 7, 'age-3 team-community primary: 6 -> 7 (floor)', String(age3primary('team-community')));
ok(age3primary('rainy-day') === 10, 'age-3 rainy-day primary: 8 -> 10 (thinnest category + second record)', String(age3primary('rainy-day')));
ok(age3primary('seasons') === 8, 'age-3 seasons primary: 7 -> 8', String(age3primary('seasons')));
ok(age3primary('stem') === 8, 'age-3 stem primary: 7 -> 8', String(age3primary('stem')));
ok(age3primary('icebreakers') === 8, 'age-3 icebreakers primary: 7 -> 8', String(age3primary('icebreakers')));
ok(age3primary('outdoor') === 8, 'age-3 outdoor primary: 7 -> 8', String(age3primary('outdoor')));
ok(age3primary('music-rhythm') === 8, 'age-3 music-rhythm primary: 7 -> 8', String(age3primary('music-rhythm')));
ok(age3primary('crafts') === 9, 'age-3 crafts primary: 8 -> 9', String(age3primary('crafts')));
ok(age3primary('pe-movement') === 9, 'age-3 pe-movement primary: 8 -> 9', String(age3primary('pe-movement')));
ok(age3primary('quiet-focus') === 12, 'age-3 quiet-focus primary: 11 -> 12', String(age3primary('quiet-focus')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(age3primary(cat) >= 7, 'every category has >= 7 age-3 primaries: ' + cat, String(age3primary(cat)));
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
// Diya row: Diwali named as itself; battery lights only, adult-lit.
ok(/Diwali is a festival of lights/.test(JSON.stringify(byId['paper-diya-welcome-row'])), 'diya row: Diwali named plainly');
ok(/Battery tea lights only/.test(byId['paper-diya-welcome-row'].safety || ''), 'diya row: battery lights only, no flame');
// Snowball: rolled, never thrown; a ball too heavy is finished, not carried.
ok(/it picks up more snow and gets bigger/.test(JSON.stringify(byId['roll-it-bigger-snowball'])), 'snowball: rolling makes it grow');
ok(/Snowballs are rolled, never thrown/.test(byId['roll-it-bigger-snowball'].safety || ''), 'snowball: rolled, never thrown');
// Tape roads: cars on roads, feet on paths.
ok(/Cars stay on the roads, and feet walk around them/.test(JSON.stringify(byId['big-tape-roads-car-town'])), 'tape roads: cars on roads, feet around them');
ok(/never on skin, hair, or faces/.test(byId['big-tape-roads-car-town'].safety || ''), 'tape roads: tape is floor-only');
// Fog window: no wrong marks exist in it; spray bottle is adult-only.
ok(/Nothing in this picture can be wrong/.test(JSON.stringify(byId['fog-window-finger-drawing'])), 'fog window: no wrong marks');
ok(/never pointed at a face/.test(byId['fog-window-finger-drawing'].safety || ''), 'fog window: spray never at a face');
// Shadow: nearer the light, bigger the shadow; lamp never at eyes.
ok(/Near the light, the shadow is big/.test(JSON.stringify(byId['big-shadow-grow-shrink'])), 'shadow: near the light, the shadow is big');
ok(/never at eyes/.test(byId['big-shadow-grow-shrink'].safety || ''), 'shadow: lamp never at eyes');
// Sponge pass: hand to hand only; the slow-hands rule is discovered, not announced.
ok(/The sponge travels hand to hand/.test(JSON.stringify(byId['sponge-pass-fill-the-pot'])), 'sponge pass: hand to hand only');
ok(/Slow hands keep the water/.test(JSON.stringify(byId['sponge-pass-fill-the-pot'])), 'sponge pass: slow-hands rule discovered by the team');
// Three fingers: every version counts; a helped three is the standard three.
ok(/the whole circle copies their three/.test(JSON.stringify(byId['show-me-three-fingers'])), 'three fingers: the circle copies every shower');
ok(/fingers get folded by their owner/.test(byId['show-me-three-fingers'].safety || ''), 'three fingers: nobody folds another kid\'s fingers');
// Worm count: counted with eyes; nobody touches a worm.
ok(/We count with our eyes/.test(JSON.stringify(byId['after-rain-worm-count'])), 'worm count: counted with eyes');
ok(/Nobody touches a worm, ever/.test(byId['after-rain-worm-count'].safety || ''), 'worm count: nobody touches a worm, ever');
// Heart tap: your beat is yours; no health claims read aloud.
ok(/we never feel anybody else's/.test(JSON.stringify(byId['feel-the-beat-heart-tap'])), 'heart tap: your beat is yours');
ok(/makes no health claims/.test(byId['feel-the-beat-heart-tap'].safety || ''), 'heart tap: no health claims');
// Sponge mural: lift straight; a sideways lift is a comet, not a failure.
ok(/lift straight/.test(JSON.stringify(byId['big-sponge-stamp-mural'])), 'sponge mural: dip, press, lift straight');
ok(/the mural's first comet/.test(JSON.stringify(byId['big-sponge-stamp-mural'])), 'sponge mural: a smear becomes a comet');
// Kick to wall: one kicker in the lane; reaching is the achievement.
ok(/Only the kicker is in the lane/.test(JSON.stringify(byId['big-ball-kick-to-wall'])), 'kick to wall: one kicker in the lane');
ok(/no running kicks at three/.test(byId['big-ball-kick-to-wall'].safety || ''), 'kick to wall: no running kicks');
// Zip board: a zip is never forced; expert move is stop and back off.
ok(/a zip is never forced/.test(JSON.stringify(byId['big-zip-up-down-board'])), 'zip board: a zip is never forced');
ok(/Zips pinch/.test(byId['big-zip-up-down-board'].safety || ''), 'zip board: the pinch risk stated plainly');

// 5. Category + enrichment deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('holidays') === 47, 'holidays primary 46 -> 47');
ok(prim('seasons') === 35, 'seasons primary 34 -> 35');
ok(prim('rainy-day') === 31, 'rainy-day primary 29 -> 31');
ok(prim('stem') === 114, 'stem primary 113 -> 114');
ok(prim('team-community') === 71, 'team-community primary 70 -> 71');
ok(prim('icebreakers') === 41, 'icebreakers primary 40 -> 41');
ok(prim('outdoor') === 51, 'outdoor primary 50 -> 51');
ok(prim('music-rhythm') === 33, 'music-rhythm primary 32 -> 33');
ok(prim('crafts') === 93, 'crafts primary 92 -> 93');
ok(prim('pe-movement') === 64, 'pe-movement primary 63 -> 64');
ok(prim('quiet-focus') === 57, 'quiet-focus primary 56 -> 57');
ok(acts.filter(a => a.copy_free).length === 257, 'copy_free 245 -> 257');
ok(acts.filter(a => a.no_elimination).length === 87, 'no_elimination 81 -> 87');
ok(acts.filter(a => a.inclusion).length === 119, 'inclusion 107 -> 119');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:diwali') === 6, 'diwali tag 5 -> 6 (off the holiday floor)', String(tagCount('holiday:diwali')));
ok(tagCount('season:winter') === 116, 'winter tag 115 -> 116', String(tagCount('season:winter')));
ok(tagCount('season:spring') === 40, 'spring tag 39 -> 40', String(tagCount('season:spring')));
ok(tagCount('holiday:christmas') === 27, 'christmas tag unchanged at 27', String(tagCount('holiday:christmas')));

// 6. The 22nd collection: Little Hands, Just Three, Again — earlier shelves intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 22, '22 collections', String(colls.length));
const jt = colls.find(c => c.id === 'little-hands-just-three-again');
ok(!!jt, 'little-hands-just-three-again collection present');
ok(jt.picks.length === 12, 'just-three-again collection has 12 picks');
jt.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
  ok(byId[p.id].age_min === 3 && byId[p.id].age_max === 3, 'collection pick is banded 3-only: ' + p.id);
});
NEW.forEach(id => ok(jt.picks.some(p => p.id === id), 'collection anchors the new pack: ' + id));
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf', 'little-hands-fourth-shelf', 'little-hands-just-three', 'little-hands-just-three-more'].forEach(cid => {
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
ok(queue.length === 60, 'queue unchanged at 60 (empty cycle, honestly)', String(queue.length));
ok(queue.filter(q => q.status === 'pending').length === 0, '0 pending — nothing waiting on a human');
ok(queue.filter(q => q.status === 'accepted').length === 22, '22 accepted all-time');
ok(queue.filter(q => q.status === 'rejected').length === 38, '38 rejected all-time');
queue.forEach(q => ok(q.decision && q.decision.length >= 20, 'decision reason recorded: ' + (q.title || q.id).slice(0, 40)));
queue.filter(q => q.status === 'accepted').forEach(q =>
  ok(q.activity_id && byId[q.activity_id], 'accepted candidate resolves to a real activity: ' + q.activity_id));
const seen = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/seen.json'), 'utf8'));
ok(Object.keys(seen).length === 70, 'seen.json dedupe memory unchanged at 70', String(Object.keys(seen).length));
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds configured', String(feeds.length));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/review-queue.json'), 'utf8'));
ok((pub.candidates || []).length === 0, 'published queue shows 0 pending candidates');

console.log('test-wave32: ' + passed + ' assertions pass');
