#!/usr/bin/env node
/* Wave 29 assertions: First Years, Fourth Shelf — the age-3 build
   as a floor-raiser. Measured before this wave (primary-category
   records covering age 3): holidays 2 (the floor), seasons /
   rainy-day / stem / team-community / icebreakers 3 each,
   outdoor / music-rhythm 4 each; crafts 6, pe-movement 6 and
   quiet-focus 9 were NOT the hole and got nothing. Twelve more
   activities designed for 3-year-olds first (age_min 3,
   age_max <= 6, runs <= 25 min, one rule per game) land two each
   in holidays/seasons/stem/icebreakers and one each in
   rainy-day/team-community/outdoor/music-rhythm — so after this
   wave EVERY one of the 11 primary categories carries at least
   4 records written for the three-year-old room. Plus the 19th
   collection "Little Hands, Fourth Shelf", and a fresh Scout
   cycle that queued 0 new candidates (reported as empty).
   HONEST HEADLINE, asserted below rather than spun: age 4 rises
   by the same 12 (every band covers it), so the 46-vs-148 count
   gap does not shrink — what closed is the floor, not the gap.
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
ok(acts.length === 637, '637 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['lantern-carry-parade', 'eight-lights-line-up',
  'wind-ribbon-watch', 'boot-print-snow-trail',
  'paper-puddle-stepping', 'big-tongs-ice-move',
  'pan-balance-heavy-light', 'toy-wagon-pull-together',
  'teddy-says-my-name', 'find-a-friend-wearing',
  'watering-can-plant-round', 'lullaby-rock-and-sway'];
ok(NEW.length === 12, '12 new activities in the wave-29 pack');
NEW.forEach(id => ok(byId[id], 'wave-29 id present: ' + id));

// 1. The age-3 gap, stated honestly: coverage 46 -> 58, and age 4
//    148 -> 160 by the same 12 — the count gap (102) does not
//    shrink; the floor under it is what this wave raised.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 94, 'age 3 coverage 46 -> 58; wave 30 -> 70; wave 31 -> 82; wave 32 -> 94', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage 148 -> 160 (same +12; gap honestly unchanged)', String(covers(4)));
ok(acts.filter(a => a.age_min === 3).length === 94, '94 activities start at age 3 (58 + 12 wave-30 + 12 wave-31 + 12 wave-32)');
ok(acts.filter(a => a.age_max <= 6).length === 87, 'early-years-only (age_max<=6) 39 -> 51; wave 30 -> 63; wave 31 -> 75; wave 32 -> 87');
[13, 14].forEach(age => ok(covers(age) === 76, 'age ' + age + ' coverage unchanged at 76', String(covers(age))));
NEW.forEach(id => {
  ok(byId[id].age_min === 3, id + ': designed for 3 (age_min 3)');
  ok(byId[id].age_max <= 6, id + ': early-years band (age_max <= 6)');
  ok(byId[id].time_max <= 25, id + ': short run for small attention (time_max <= 25)');
});

// 2. The floor inside age-3 coverage: holidays doubled off the
//    floor, and every primary category now carries >= 4 age-3 records.
const age3primary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 3 && a.age_max >= 3).length;
ok(age3primary('holidays') === 7, 'age-3 holidays primary: 2 -> 4 (the floor, doubled); wave 30 -> 5; wave 31 -> 6; wave 32 -> 7', String(age3primary('holidays')));
ok(age3primary('seasons') === 8, 'age-3 seasons primary: 3 -> 5; wave 30 -> 6; wave 31 -> 7; wave 32 -> 8', String(age3primary('seasons')));
ok(age3primary('stem') === 8, 'age-3 stem primary: 3 -> 5; wave 30 -> 6; wave 31 -> 7; wave 32 -> 8', String(age3primary('stem')));
ok(age3primary('icebreakers') === 8, 'age-3 icebreakers primary: 3 -> 5; wave 30 -> 6; wave 31 -> 7; wave 32 -> 8', String(age3primary('icebreakers')));
ok(age3primary('rainy-day') === 10, 'age-3 rainy-day primary: 3 -> 4; wave 30 -> 6; wave 31 -> 8; wave 32 -> 10', String(age3primary('rainy-day')));
ok(age3primary('team-community') === 7, 'age-3 team-community primary: 3 -> 4; wave 30 -> 5; wave 31 -> 6; wave 32 -> 7', String(age3primary('team-community')));
ok(age3primary('outdoor') === 8, 'age-3 outdoor primary: 4 -> 5; wave 30 -> 6; wave 31 -> 7; wave 32 -> 8', String(age3primary('outdoor')));
ok(age3primary('music-rhythm') === 8, 'age-3 music-rhythm primary: 4 -> 5; wave 30 -> 6; wave 31 -> 7; wave 32 -> 8', String(age3primary('music-rhythm')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(age3primary(cat) >= 4, 'every category has >= 4 age-3 primaries: ' + cat, String(age3primary(cat)));
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
// Lantern parade: the real festival named; LED only; lap tray rides in full.
ok(/Lantern Festival/.test(JSON.stringify(byId['lantern-carry-parade'])), 'lantern parade: real festival named');
ok(/LED tealights only/.test(byId['lantern-carry-parade'].safety || ''), 'lantern parade: LED only, no flames');
ok(/lap tray/.test(byId['lantern-carry-parade'].inclusion || ''), 'lantern parade: lap tray in the parade in full');
// Eight lights: menorah named, helper light not counted, battery rule stated.
ok(/menorah/.test(JSON.stringify(byId['eight-lights-line-up'])), 'eight lights: menorah named');
ok(/not counted in the eight/.test(JSON.stringify(byId['eight-lights-line-up'])), 'eight lights: helper is not counted');
ok(/button batteries/.test(byId['eight-lights-line-up'].safety || ''), 'eight lights: button battery hazard stated');
// Ribbons + boot prints: adult-tied, and prints are prints.
ok(/tied by an adult/.test(byId['wind-ribbon-watch'].safety || ''), 'wind ribbons: adult-tied, out of reach');
ok(/Prints are prints/.test(byId['boot-print-snow-trail'].inclusion || ''), 'boot prints: wheelchair tracks write in snow too');
// Paper puddles: stepping IN is the rule; wheeling across counts.
ok(/Step IN the puddles/.test(JSON.stringify(byId['paper-puddle-stepping'])), 'paper puddles: stepping in is the rule');
ok(/Wheeling across/.test(byId['paper-puddle-stepping'].inclusion || ''), 'paper puddles: wheeling across counts in full');
// Ice move: tongs only, and the choking note is on the record.
ok(/hands do not help/.test(JSON.stringify(byId['big-tongs-ice-move'])), 'ice move: tongs carry it, hands do not help');
ok(/choking hazard/.test(byId['big-tongs-ice-move'].safety || ''), 'ice move: choking hazard stated');
// Balance: the beam decides; directing the test is doing the test.
ok(/goes DOWN is carrying the heavier/.test(JSON.stringify(byId['pan-balance-heavy-light'])), 'balance: side that goes down is heavier');
ok(/Directing the test is doing the test/.test(byId['pan-balance-heavy-light'].inclusion || ''), 'balance: directing counts as testing');
// Wagon: both pullers or it does not go; nobody rides.
ok(/BOTH pullers are holding on/.test(JSON.stringify(byId['toy-wagon-pull-together'])), 'wagon: both pullers holding on');
ok(/nobody rides in the wagon/.test(byId['toy-wagon-pull-together'].safety || ''), 'wagon: nobody rides');
// Teddy + friend-wearing: the toy talks; you stand WITH them.
ok(/toy does the talking/.test(JSON.stringify(byId['teddy-says-my-name'])), 'teddy: the toy does the talking');
ok(/stand WITH them/.test(byId['find-a-friend-wearing'].safety || ''), 'friend wearing: stand with them, never pull');
// Watering can: two hands, water on the soil, hands wash after.
ok(/water on the soil/.test(JSON.stringify(byId['watering-can-plant-round'])), 'watering can: water on the soil');
ok(/Hands wash after/.test(byId['watering-can-plant-round'].safety || ''), 'watering can: hands wash after');
// Lullaby: rocking stops when the song stops.
ok(/baby is asleep/.test(JSON.stringify(byId['lullaby-rock-and-sway'])), 'lullaby: song ends, baby is asleep');

// 5. Category + enrichment deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('holidays') === 47, 'holidays primary 42 -> 44; wave 30 -> 45; wave 31 -> 46; wave 32 -> 47');
ok(prim('seasons') === 35, 'seasons primary 30 -> 32; wave 30 -> 33; wave 31 -> 34; wave 32 -> 35');
ok(prim('stem') === 114, 'stem primary 109 -> 111; wave 30 -> 112; wave 31 -> 113; wave 32 -> 114');
ok(prim('icebreakers') === 41, 'icebreakers primary 36 -> 38; wave 30 -> 39; wave 31 -> 40; wave 32 -> 41');
ok(prim('rainy-day') === 31, 'rainy-day primary 24 -> 25; wave 30 -> 27; wave 31 -> 29; wave 32 -> 31');
ok(prim('team-community') === 71, 'team-community primary 67 -> 68; wave 30 -> 69; wave 31 -> 70; wave 32 -> 71');
ok(prim('outdoor') === 51, 'outdoor primary 47 -> 48; wave 30 -> 49; wave 31 -> 50; wave 32 -> 51');
ok(prim('music-rhythm') === 33, 'music-rhythm primary 29 -> 30; wave 30 -> 31; wave 31 -> 32; wave 32 -> 33');
ok(acts.filter(a => a.copy_free).length === 257, 'copy_free 209 -> 221; wave 30 -> 233; wave 31 -> 245; wave 32 -> 257');
ok(acts.filter(a => a.no_elimination).length === 87, 'no_elimination 63 -> 70; wave 30 -> 75; wave 31 -> 81; wave 32 -> 87');
ok(acts.filter(a => a.inclusion).length === 119, 'inclusion 81 -> 87; wave 30 -> 95; wave 31 -> 107; wave 32 -> 119');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:lunar-new-year') === 6, 'lunar-new-year tag 5 -> 6', String(tagCount('holiday:lunar-new-year')));
ok(tagCount('holiday:hanukkah') === 8, 'hanukkah tag 7 -> 8', String(tagCount('holiday:hanukkah')));

// 6. The 19th collection: Little Hands, Fourth Shelf — earlier shelves intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 22, '22 collections', String(colls.length));
const fs4 = colls.find(c => c.id === 'little-hands-fourth-shelf');
ok(!!fs4, 'little-hands-fourth-shelf collection present');
ok(fs4.picks.length === 12, 'fourth-shelf collection has 12 picks');
fs4.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
  ok(byId[p.id].age_min <= 3, 'collection pick is age-3 reachable: ' + p.id);
});
NEW.forEach(id => ok(fs4.picks.some(p => p.id === id), 'collection anchors the new pack: ' + id));
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf'].forEach(cid => {
  const c = colls.find(x => x.id === cid);
  ok(!!c && c.picks.length === 12, cid + ' still intact at 12 picks');
});

// 7. Scout pipeline: a fresh live cycle ran before this wave's build
//    and queued ZERO new candidates — all 65 feed items were already
//    in seen.json or failed the relevance filter. An empty cycle is
//    reported as empty: the queue is unchanged and fully decided.
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

console.log('test-wave29: ' + passed + ' assertions pass');
