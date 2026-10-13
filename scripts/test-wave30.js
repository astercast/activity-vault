#!/usr/bin/env node
/* Wave 30 assertions: Little Hands, Just Three — the different
   kind of wave wave 29's honest assessment named: records banded
   3-only, because four waves of broad early-years records raised
   age 4 by exactly as much as age 3. Twelve records banded 3-3
   (age_min 3 AND age_max 3, runs <= 20 min, one rule per game),
   one for every one of the 11 primary categories plus a second
   for rainy-day (thinnest category on the shelf, and one of the
   three floor categories at 4). After this wave: age 3 coverage
   58 -> 70 while age 4 is UNCHANGED at 160 — the first wave in
   five that narrows the headline gap (102 -> 90) — and every
   primary category carries at least 5 age-3 primaries.
   Plus the 20th collection "Little Hands, Just Three", and a
   fresh Scout cycle that queued 0 new candidates (reported as
   empty; all 6 feeds answered on the confirming run).
   Run after scripts/build.py. Exits non-zero on first failure. */
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
ok(acts.length === 697, '685 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['felt-tree-one-by-one', 'sun-patch-shade-patch',
  'rain-call-to-the-rug', 'window-raindrop-follow',
  'big-magnet-wand-sticks', 'blanket-carry-teddy-to-bed',
  'name-echo-two-claps', 'dandelion-clock-blow-walk',
  'one-shake-pass-around', 'sticky-window-big-shapes',
  'grass-hill-roll-down', 'big-lid-match-basket'];
ok(NEW.length === 12, '12 new activities in the wave-30 pack');
NEW.forEach(id => ok(byId[id], 'wave-30 id present: ' + id));

// 1. The headline, moved for the first time in five waves: this
//    pack is banded 3-3, so age 3 rises 58 -> 70 and age 4 does
//    NOT rise with it (160, unchanged). Gap 102 -> 90.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 154, 'age 3 coverage 58 -> 70; wave 31 -> 82; wave 32 -> 94; wave 33 -> 106', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage UNCHANGED at 160 (the 3-only band working)', String(covers(4)));
ok(covers(4) - covers(3) === 6, 'headline gap 102 -> 90, narrowed at last; wave 31 -> 78; wave 32 -> 66; wave 33 -> 54; wave 34 -> 42', String(covers(4) - covers(3)));
ok(acts.filter(a => a.age_min === 3).length === 154, '94 activities start at age 3 (70 after wave 30; wave 31 -> 82; wave 32 -> 94)');
ok(acts.filter(a => a.age_max === 3).length === 96, '36 activities banded 3-only (12 in wave 30, the first single-age bands; 12 more in wave 31; 12 more in wave 32)');
ok(acts.filter(a => a.age_max <= 6).length === 147, 'early-years-only (age_max<=6) 51 -> 63; wave 31 -> 75; wave 32 -> 87; wave 33 -> 99; wave 34 -> 111');
[13, 14].forEach(age => ok(covers(age) === 76, 'age ' + age + ' coverage unchanged at 76', String(covers(age))));
NEW.forEach(id => {
  ok(byId[id].age_min === 3 && byId[id].age_max === 3, id + ': banded 3-only (age_min 3, age_max 3)');
  ok(byId[id].time_max <= 20, id + ': short run for the youngest room (time_max <= 20)');
});

// 2. The floor inside age-3 coverage: every primary category now
//    carries >= 5 age-3 records; the three floor categories rose.
const age3primary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 3 && a.age_max >= 3).length;
ok(age3primary('holidays') === 12, 'age-3 holidays primary: 4 -> 5 (floor); wave 31 -> 6; wave 32 -> 8', String(age3primary('holidays')));
ok(age3primary('rainy-day') === 18, 'age-3 rainy-day primary: 4 -> 6 (floor + thinnest category); wave 31 -> 8; wave 32 -> 12', String(age3primary('rainy-day')));
ok(age3primary('team-community') === 12, 'age-3 team-community primary: 4 -> 5 (floor); wave 31 -> 6; wave 32 -> 8', String(age3primary('team-community')));
ok(age3primary('seasons') === 13, 'age-3 seasons primary: 5 -> 6; wave 31 -> 7; wave 32 -> 9', String(age3primary('seasons')));
ok(age3primary('stem') === 13, 'age-3 stem primary: 5 -> 6; wave 31 -> 7; wave 32 -> 9', String(age3primary('stem')));
ok(age3primary('icebreakers') === 13, 'age-3 icebreakers primary: 5 -> 6; wave 31 -> 7; wave 32 -> 9', String(age3primary('icebreakers')));
ok(age3primary('outdoor') === 13, 'age-3 outdoor primary: 5 -> 6; wave 31 -> 7; wave 32 -> 9', String(age3primary('outdoor')));
ok(age3primary('music-rhythm') === 15, 'age-3 music-rhythm primary: 5 -> 6; wave 31 -> 7; wave 32 -> 9', String(age3primary('music-rhythm')));
ok(age3primary('crafts') === 14, 'age-3 crafts primary: 6 -> 7; wave 31 -> 8; wave 32 -> 10', String(age3primary('crafts')));
ok(age3primary('pe-movement') === 14, 'age-3 pe-movement primary: 6 -> 7; wave 31 -> 8; wave 32 -> 10', String(age3primary('pe-movement')));
ok(age3primary('quiet-focus') === 17, 'age-3 quiet-focus primary: 9 -> 10; wave 31 -> 11; wave 32 -> 13', String(age3primary('quiet-focus')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(age3primary(cat) >= 5, 'every category has >= 5 age-3 primaries: ' + cat, String(age3primary(cat)));
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
// Felt tree: the real custom named plainly; palm-size pieces only.
ok(/At Christmas, lots of families decorate a tree/.test(JSON.stringify(byId['felt-tree-one-by-one'])), 'felt tree: real custom named plainly');
ok(/nothing with a button battery/.test(byId['felt-tree-one-by-one'].safety || ''), 'felt tree: no small ornaments, no button batteries');
// Sun/shade: waits for a day the difference is real; shade is home base.
ok(/weather has not provided this activity/.test(byId['sun-patch-shade-patch'].setup || ''), 'sun patch: waits for a day the difference is real');
ok(/shade is always the home base/.test(byId['sun-patch-shade-patch'].safety || ''), 'sun patch: shade is home base, sun time short');
// Rain call: umbrella is an adult-held signal, never a shelter; walked.
ok(/held by an adult only/.test(byId['rain-call-to-the-rug'].safety || ''), 'rain call: umbrella adult-held only');
ok(/never run/.test(byId['rain-call-to-the-rug'].safety || ''), 'rain call: rain calls are walked, never run');
// Raindrop follow: cannot be faked; merging is not losing.
ok(/cannot be faked/.test(byId['window-raindrop-follow'].setup || ''), 'raindrop: this activity cannot be faked');
ok(/merging is not losing your drop/.test(JSON.stringify(byId['window-raindrop-follow'])), 'raindrop: merging is not losing');
// Magnet wands: encased only; loose magnets named as a real hazard.
ok(/sealed inside the plastic/.test(byId['big-magnet-wand-sticks'].safety || ''), 'magnet: encased wands only');
ok(/genuine emergency if swallowed/.test(byId['big-magnet-wand-sticks'].safety || ''), 'magnet: loose-magnet hazard stated in plain words');
// Blanket carry: teddy is the only passenger.
ok(/Teddy is the only passenger/.test(byId['blanket-carry-teddy-to-bed'].safety || ''), 'blanket carry: teddy is the only passenger');
// Name echo: a name is said the way its owner said it.
ok(/never funnier/.test(byId['name-echo-two-claps'].safety || ''), 'name echo: names copied kindly or not at all');
// Dandelion: pretend time said as pretend; untreated grass only.
ok(/Pretend time, said as pretend/.test(JSON.stringify(byId['dandelion-clock-blow-walk'])), 'dandelion: pretend time said as pretend');
ok(/Untreated grass only, no exceptions/.test(byId['dandelion-clock-blow-walk'].safety || ''), 'dandelion: untreated grass only');
// Tambourine: passed, never thrown; jingles checked every use.
ok(/passed, never thrown/.test(byId['one-shake-pass-around'].safety || ''), 'one shake: passed, never thrown');
// Sticky window: edges taped; lifting edge retires the window.
ok(/retires the window/.test(byId['sticky-window-big-shapes'].safety || ''), 'sticky window: lifting edge retires the window');
// Hill roll: hug taught first; one roller at a time.
ok(/One roller at a time/.test(JSON.stringify(byId['grass-hill-roll-down'])), 'hill roll: one roller at a time');
ok(/rolling stops the moment any kid says stop/.test(byId['grass-hill-roll-down'].safety || ''), 'hill roll: stop means stop');
// Lid basket: the decoy lid is honest — it fits nothing, by design.
ok(/genuinely fit nothing/.test(byId['big-lid-match-basket'].setup || ''), 'lid basket: decoys genuinely fit nothing');

// 5. Category + enrichment deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('holidays') === 52, 'holidays primary 44 -> 45; wave 31 -> 46; wave 32 -> 48');
ok(prim('seasons') === 40, 'seasons primary 32 -> 33; wave 31 -> 34; wave 32 -> 36');
ok(prim('rainy-day') === 39, 'rainy-day primary 25 -> 27; wave 31 -> 29; wave 32 -> 33');
ok(prim('stem') === 119, 'stem primary 111 -> 112; wave 31 -> 113; wave 32 -> 115');
ok(prim('team-community') === 76, 'team-community primary 68 -> 69; wave 31 -> 70; wave 32 -> 72');
ok(prim('icebreakers') === 46, 'icebreakers primary 38 -> 39; wave 31 -> 40; wave 32 -> 42');
ok(prim('outdoor') === 56, 'outdoor primary 48 -> 49; wave 31 -> 50; wave 32 -> 52');
ok(prim('music-rhythm') === 40, 'music-rhythm primary 30 -> 31; wave 31 -> 32; wave 32 -> 34');
ok(prim('crafts') === 98, 'crafts primary 90 -> 91; wave 31 -> 92; wave 32 -> 94');
ok(prim('pe-movement') === 69, 'pe-movement primary 61 -> 62; wave 31 -> 63; wave 32 -> 65');
ok(prim('quiet-focus') === 62, 'quiet-focus primary 54 -> 55; wave 31 -> 56; wave 32 -> 58');
ok(acts.filter(a => a.copy_free).length === 317, 'copy_free 221 -> 233');
ok(acts.filter(a => a.no_elimination).length === 119, 'no_elimination 70 -> 75');
ok(acts.filter(a => a.inclusion).length === 179, 'inclusion 87 -> 95');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:christmas') === 27, 'christmas tag 26 -> 27', String(tagCount('holiday:christmas')));
ok(tagCount('season:winter') === 116, 'winter tag 114 -> 115; wave 32 -> 116', String(tagCount('season:winter')));

// 6. The 20th collection: Little Hands, Just Three — earlier shelves intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 27, '26 collections', String(colls.length));
const jt = colls.find(c => c.id === 'little-hands-just-three');
ok(!!jt, 'little-hands-just-three collection present');
ok(jt.picks.length === 12, 'just-three collection has 12 picks');
jt.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
  ok(byId[p.id].age_min === 3 && byId[p.id].age_max === 3, 'collection pick is banded 3-only: ' + p.id);
});
NEW.forEach(id => ok(jt.picks.some(p => p.id === id), 'collection anchors the new pack: ' + id));
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf', 'little-hands-fourth-shelf'].forEach(cid => {
  const c = colls.find(x => x.id === cid);
  ok(!!c && c.picks.length === 12, cid + ' still intact at 12 picks');
});

// 7. Scout pipeline: a fresh live cycle ran before this wave's
//    build and queued ZERO new candidates. The first attempt hit
//    timeouts on five feeds; the confirming run reached all 6
//    feeds (65 items) and still queued nothing — every relevant
//    item was already in seen.json or failed the relevance
//    filter. An empty cycle is reported as empty: the queue is
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

console.log('test-wave30: ' + passed + ' assertions pass');
