#!/usr/bin/env node
/* Wave 31 assertions: Little Hands, Just Three More — the
   second wave of the kind wave 30 proved: records banded
   3-only, because broad early-years records raise age 4 by
   exactly as much as age 3 and the gap never moves. Twelve
   more records banded 3-3 (age_min 3 AND age_max 3, runs
   <= 20 min, one rule per game), one for every one of the 11
   primary categories plus a second for rainy-day (still the
   thinnest category on the shelf). After this wave: age 3
   coverage 70 -> 82 while age 4 is UNCHANGED at 160 — the
   headline gap narrows for the second wave running
   (90 -> 78) — every primary category carries at least 6
   age-3 primaries, and age 3 (82) passes ages 13/14 (76) to
   stop being the thinnest single age in the archive.
   Plus the 21st collection "Little Hands, Just Three More",
   and a fresh Scout cycle that queued 0 new candidates
   (reported as empty; all 6 feeds answered, 65 items).
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
ok(acts.length === 661, '661 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['big-heart-hand-delivery', 'one-branch-bud-count',
  'big-pot-stir-together', 'rain-drums-on-pots',
  'big-funnel-sand-pour', 'long-banner-carry-together',
  'how-i-got-here-moves', 'big-tree-hug-listen',
  'sing-it-back-echo-lines', 'paint-the-big-box-house',
  'giant-steps-baby-steps', 'sock-pair-match-basket'];
ok(NEW.length === 12, '12 new activities in the wave-31 pack');
NEW.forEach(id => ok(byId[id], 'wave-31 id present: ' + id));

// 1. The headline, narrowed for the second wave running: this
//    pack is banded 3-3, so age 3 rises 70 -> 82 and age 4 does
//    NOT rise with it (160, unchanged). Gap 90 -> 78.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 118, 'age 3 coverage 70 -> 82; wave 32 -> 94; wave 33 -> 106', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage UNCHANGED at 160 (the 3-only band working)', String(covers(4)));
ok(covers(4) - covers(3) === 42, 'headline gap 90 -> 78, narrowed again; wave 32 -> 66; wave 33 -> 54; wave 34 -> 42', String(covers(4) - covers(3)));
ok(acts.filter(a => a.age_min === 3).length === 118, '94 activities start at age 3 (82 after wave 31; wave 32 -> 94)');
ok(acts.filter(a => a.age_max === 3).length === 60, '36 activities banded 3-only (12 wave-30 + 12 wave-31 + 12 wave-32 + 12 wave-33)');
ok(acts.filter(a => a.age_max <= 6).length === 111, 'early-years-only (age_max<=6) 63 -> 75; wave 32 -> 87; wave 33 -> 99; wave 34 -> 111');
[13, 14].forEach(age => ok(covers(age) === 76, 'age ' + age + ' coverage unchanged at 76', String(covers(age))));
ok(covers(3) > covers(13), 'age 3 (94) passes ages 13/14 (76) — no longer the thinnest single age');
NEW.forEach(id => {
  ok(byId[id].age_min === 3 && byId[id].age_max === 3, id + ': banded 3-only (age_min 3, age_max 3)');
  ok(byId[id].time_max <= 20, id + ': short run for the youngest room (time_max <= 20)');
});

// 2. The floor inside age-3 coverage: every primary category now
//    carries >= 6 age-3 records; the two floor categories rose.
const age3primary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 3 && a.age_max >= 3).length;
ok(age3primary('holidays') === 9, 'age-3 holidays primary: 5 -> 6 (floor); wave 32 -> 8', String(age3primary('holidays')));
ok(age3primary('team-community') === 9, 'age-3 team-community primary: 5 -> 6 (floor); wave 32 -> 8', String(age3primary('team-community')));
ok(age3primary('rainy-day') === 14, 'age-3 rainy-day primary: 6 -> 8 (floor + thinnest category); wave 32 -> 12', String(age3primary('rainy-day')));
ok(age3primary('seasons') === 10, 'age-3 seasons primary: 6 -> 7; wave 32 -> 9', String(age3primary('seasons')));
ok(age3primary('stem') === 10, 'age-3 stem primary: 6 -> 7; wave 32 -> 9', String(age3primary('stem')));
ok(age3primary('icebreakers') === 10, 'age-3 icebreakers primary: 6 -> 7; wave 32 -> 9', String(age3primary('icebreakers')));
ok(age3primary('outdoor') === 10, 'age-3 outdoor primary: 6 -> 7; wave 32 -> 9', String(age3primary('outdoor')));
ok(age3primary('music-rhythm') === 10, 'age-3 music-rhythm primary: 6 -> 7; wave 32 -> 9', String(age3primary('music-rhythm')));
ok(age3primary('crafts') === 11, 'age-3 crafts primary: 7 -> 8; wave 32 -> 10', String(age3primary('crafts')));
ok(age3primary('pe-movement') === 11, 'age-3 pe-movement primary: 7 -> 8; wave 32 -> 10', String(age3primary('pe-movement')));
ok(age3primary('quiet-focus') === 14, 'age-3 quiet-focus primary: 10 -> 11; wave 32 -> 13', String(age3primary('quiet-focus')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(age3primary(cat) >= 6, 'every category has >= 6 age-3 primaries: ' + cat, String(age3primary(cat)));
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
// Heart delivery: the adult's list guarantees give-one/get-one.
ok(/every kid gives exactly one and receives exactly one/.test(byId['big-heart-hand-delivery'].setup || ''), 'heart delivery: give-one/get-one guaranteed by the adult list');
ok(/a heart given stays given/.test(byId['big-heart-hand-delivery'].safety || ''), 'heart delivery: a heart given stays given');
// Bud count: one finger, one bud, one number; unnamed plants are not touched.
ok(/One finger, one bud, one number/.test(JSON.stringify(byId['one-branch-bud-count'])), 'bud count: one finger, one bud, one number');
ok(/if the plant cannot be named, it is looked at, not touched/.test(byId['one-branch-bud-count'].safety || ''), 'bud count: unnamed plant is looked at, not touched');
// Pretend soup: nothing real goes in, nothing is tasted.
ok(/Nothing real goes in the pot and nothing is tasted/.test(byId['big-pot-stir-together'].safety || ''), 'pot stir: nothing real, nothing tasted');
// Rain drums: hands only, never sticks.
ok(/Hands only, never sticks/.test(byId['rain-drums-on-pots'].safety || ''), 'rain drums: hands only, never sticks');
// Funnel: the bottle fills from the bottom up; sand-and-eyes is the named hazard.
ok(/The bottle fills from the bottom up/.test(JSON.stringify(byId['big-funnel-sand-pour'])), 'funnel: bottle fills from the bottom up');
ok(/sand in an eye is the one real accident/.test(byId['big-funnel-sand-pour'].safety || ''), 'funnel: sand-and-eyes hazard stated plainly');
// Banner: hurry is what tears it; the pace is the slowest carrier's.
ok(/If one of us hurries, it folds and tears/.test(JSON.stringify(byId['long-banner-carry-together'])), 'banner: hurrying is what tears it');
ok(/pace is the slowest carrier's/.test(byId['long-banner-carry-together'].safety || ''), 'banner: pace is the slowest carrier');
// How I got here: every way copied the same; a telling is never corrected.
ok(/we copy EVERY way of getting here the same/.test(JSON.stringify(byId['how-i-got-here-moves'])), 'how i got here: every way copied the same');
ok(/never corrected/.test(byId['how-i-got-here-moves'].safety || ''), 'how i got here: a telling is never corrected');
// Tree hug: the adult's check is the safety; hugging offered, never assigned.
ok(/no wasp or bee activity/.test(byId['big-tree-hug-listen'].setup || ''), 'tree hug: adult checks for hives first');
ok(/Hugging is offered, never assigned/.test(byId['big-tree-hug-listen'].safety || ''), 'tree hug: hugging offered, never assigned');
// Echo lines: same words, same tune; a passed turn passes without comment.
ok(/the same words, the same tune/.test(JSON.stringify(byId['sing-it-back-echo-lines'])), 'echo lines: same words, same tune');
ok(/passed without comment/.test(byId['sing-it-back-echo-lines'].safety || ''), 'echo lines: a passed turn passes without comment');
// Box house: adults cut, never during the session; one painter inside.
ok(/cut by an adult's hands only/.test(JSON.stringify(byId['paint-the-big-box-house'])), 'box house: cut by adult hands only');
ok(/no blades at a painting session/.test(byId['paint-the-big-box-house'].safety || ''), 'box house: no blades at a painting session');
// Giant steps: the no-out promise is the design; steps are stretches, not leaps.
ok(/Nobody is ever out, nobody is sent back/.test(JSON.stringify(byId['giant-steps-baby-steps'])), 'giant steps: nobody out, nobody sent back');
ok(/Giant steps are stretches, not leaps/.test(byId['giant-steps-baby-steps'].safety || ''), 'giant steps: stretches, not leaps');
// Sock basket: every pair genuinely in the basket; near-matches are discoveries.
ok(/count them in pairs as you load it/.test(byId['sock-pair-match-basket'].setup || ''), 'sock basket: pairs audited as the basket is built');
ok(/Those two fooled us for a second/.test(JSON.stringify(byId['sock-pair-match-basket'])), 'sock basket: a near-match is a discovery, not an error');

// 5. Category + enrichment deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('holidays') === 49, 'holidays primary 45 -> 46; wave 32 -> 48');
ok(prim('seasons') === 37, 'seasons primary 33 -> 34; wave 32 -> 36');
ok(prim('rainy-day') === 35, 'rainy-day primary 27 -> 29; wave 32 -> 33');
ok(prim('stem') === 116, 'stem primary 112 -> 113; wave 32 -> 115');
ok(prim('team-community') === 73, 'team-community primary 69 -> 70; wave 32 -> 72');
ok(prim('icebreakers') === 43, 'icebreakers primary 39 -> 40; wave 32 -> 42');
ok(prim('outdoor') === 53, 'outdoor primary 49 -> 50; wave 32 -> 52');
ok(prim('music-rhythm') === 35, 'music-rhythm primary 31 -> 32; wave 32 -> 34');
ok(prim('crafts') === 95, 'crafts primary 91 -> 92; wave 32 -> 94');
ok(prim('pe-movement') === 66, 'pe-movement primary 62 -> 63; wave 32 -> 65');
ok(prim('quiet-focus') === 59, 'quiet-focus primary 55 -> 56; wave 32 -> 58');
ok(acts.filter(a => a.copy_free).length === 281, 'copy_free 233 -> 245; wave 32 -> 257; wave 33 -> 269');
ok(acts.filter(a => a.no_elimination).length === 99, 'no_elimination 75 -> 81; wave 32 -> 87; wave 33 -> 93');
ok(acts.filter(a => a.inclusion).length === 143, 'inclusion 95 -> 107; wave 32 -> 119; wave 33 -> 131');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:valentines-day') === 7, 'valentines-day tag 6 -> 7', String(tagCount('holiday:valentines-day')));
ok(tagCount('season:spring') === 40, 'spring tag 38 -> 39; wave 32 -> 40', String(tagCount('season:spring')));
ok(tagCount('holiday:christmas') === 27, 'christmas tag unchanged at 27', String(tagCount('holiday:christmas')));
ok(tagCount('season:winter') === 116, 'winter tag unchanged at 115 in wave 31; wave 32 -> 116', String(tagCount('season:winter')));

// 6. The 21st collection: Little Hands, Just Three More — earlier shelves intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 24, '24 collections', String(colls.length));
const jt = colls.find(c => c.id === 'little-hands-just-three-more');
ok(!!jt, 'little-hands-just-three-more collection present');
ok(jt.picks.length === 12, 'just-three-more collection has 12 picks');
jt.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
  ok(byId[p.id].age_min === 3 && byId[p.id].age_max === 3, 'collection pick is banded 3-only: ' + p.id);
});
NEW.forEach(id => ok(jt.picks.some(p => p.id === id), 'collection anchors the new pack: ' + id));
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf', 'little-hands-fourth-shelf', 'little-hands-just-three'].forEach(cid => {
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

console.log('test-wave31: ' + passed + ' assertions pass');
