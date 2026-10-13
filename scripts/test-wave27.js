#!/usr/bin/env node
/* Wave 27 assertions: First Years, Second Shelf — the age-3 cliff
   continued on purpose. Wave 26 halved the cliff (12 -> 22) and said
   so honestly; this wave adds 12 more activities designed for
   3-year-olds first (age_min 3, age_max <= 6, runs <= 25 min, one
   rule per game), aimed at the holes INSIDE age-3 coverage: before
   this wave, age 3 had zero primary-category records in stem,
   team-community and rainy-day. Plus the 17th collection
   "Little Hands, Next Steps". The thin subjects (drama/coding) were
   NOT padded — wave 26 recorded them as shelves the Vault does not
   promise, and this wave kept that call.
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
ok(acts.length === 685, '685 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['cardboard-ramp-roll-lab', 'hand-lens-look-closer',
  'pass-it-down-delivery-line', 'ring-around-the-rosie-circle',
  'pillow-islands', 'show-me-your-move', 'knee-drum-copycat',
  'texture-touch-basket-walk', 'big-dot-sticker-pictures',
  'pool-noodle-rope-threading', 'jump-the-river-ropes',
  'blanket-fort-book-nook'];
ok(NEW.length === 12, '12 new activities in the wave-27 pack');
NEW.forEach(id => ok(byId[id], 'wave-27 id present: ' + id));

// 1. The age-3 cliff, continued: coverage 22 -> 34, all designed-band.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 142, 'age 3 coverage 22 -> 34 in wave 27; wave 28 -> 46; wave 29 -> 58; wave 30 -> 70; wave 31 -> 82; wave 32 -> 94; wave 33 -> 106', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage 124 -> 136 in wave 27; wave 28 -> 148; wave 29 -> 160', String(covers(4)));
ok(acts.filter(a => a.age_min === 3).length === 142, '94 activities start at age 3 (58 + 12 wave-30 + 12 wave-31 + 12 wave-32)');
ok(acts.filter(a => a.age_max <= 6).length === 135, 'early-years-only (age_max<=6) 15 -> 27 in wave 27; wave 28 -> 39; wave 29 -> 51; wave 30 -> 63; wave 31 -> 75; wave 32 -> 87; wave 33 -> 99; wave 34 -> 111');
[13, 14].forEach(age => ok(covers(age) === 76, 'age ' + age + ' coverage unchanged at 76', String(covers(age))));
NEW.forEach(id => {
  ok(byId[id].age_min === 3, id + ': designed for 3 (age_min 3)');
  ok(byId[id].age_max <= 6, id + ': early-years band (age_max <= 6)');
  ok(byId[id].time_max <= 25, id + ': short run for small attention (time_max <= 25)');
});

// 2. The holes inside age-3 coverage: first PRIMARY-category records at
//    age 3 for stem, team-community and rainy-day.
const age3primary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 3 && a.age_max >= 3).length;
ok(age3primary('stem') === 12, 'age-3 stem primary: 0 -> 2 in wave 27; wave 28 -> 3; wave 29 -> 5; wave 30 -> 6; wave 31 -> 7; wave 32 -> 9', String(age3primary('stem')));
ok(age3primary('team-community') === 11, 'age-3 team-community primary: 0 -> 2 in wave 27; wave 28 -> 3; wave 29 -> 4; wave 30 -> 5; wave 31 -> 6; wave 32 -> 8', String(age3primary('team-community')));
ok(age3primary('rainy-day') === 17, 'age-3 rainy-day primary: 0 -> 1 in wave 27; wave 28 -> 3; wave 29 -> 4; wave 30 -> 6; wave 31 -> 8; wave 32 -> 12', String(age3primary('rainy-day')));
['stem', 'team-community', 'rainy-day', 'icebreakers', 'music-rhythm',
 'outdoor', 'crafts', 'quiet-focus', 'pe-movement'].forEach(cat => {
  const n = acts.filter(a => a.categories.includes(cat) && a.age_min <= 3 && a.age_max >= 3).length;
  ok(n >= 2, 'age-3 coverage (any-category) >= 2: ' + cat, String(n));
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
// Ramp lab: the fair-test rule is in the steps, the low-ramp rule in safety.
ok(/Let go, don't push/.test(JSON.stringify(byId['cardboard-ramp-roll-lab'])), 'ramp: let-go rule stated');
ok(/never on chairs/.test(byId['cardboard-ramp-roll-lab'].safety || ''), 'ramp: low ramp only');
// Hand lens: the sun warning is plain, and touch is a first-class path in.
ok(/never point a lens at the sun/.test(byId['hand-lens-look-closer'].safety || ''), 'lens: sun warning stated plainly');
ok(/low vision/.test(byId['hand-lens-look-closer'].inclusion || ''), 'lens: touch path for low-vision kids');
// Rosie: the record never repeats the plague-origin story (disputed history,
// kept out on purpose) and the words-vary note is in the inclusion line.
ok(!/plague/.test(JSON.stringify(byId['ring-around-the-rosie-circle']).toLowerCase()), 'rosie: no plague-origin claim');
ok(/words vary/.test(byId['ring-around-the-rosie-circle'].inclusion || ''), 'rosie: words-vary note present');
ok(/The fall is a sit/.test(byId['ring-around-the-rosie-circle'].safety || ''), 'rosie: fall is a sit, never a drop');
// Pillow islands: deliberately NOT the lava game — no lava framing anywhere
// in the record, and nobody is eliminated.
ok(!/lava/.test(JSON.stringify(byId['pillow-islands']).toLowerCase()), 'pillow islands: no lava framing borrowed');
ok(byId['pillow-islands'].no_elimination === true, 'pillow islands: no elimination (unlike lava-floor)');
ok(/non-skid/.test(byId['pillow-islands'].safety || ''), 'pillow islands: flat non-skid islands only');
// Show-me / delivery / texture: inclusion is a mechanic, not a sticker.
ok(/A move is anything/.test(byId['show-me-your-move'].inclusion || ''), 'show-me: any body movement counts');
ok(/works seated/.test(byId['pass-it-down-delivery-line'].inclusion || ''), 'delivery line: seated line counts in full');
ok(/eyes are the backup/.test(byId['texture-touch-basket-walk'].inclusion || ''), 'texture walk: touch leads, eyes backup');
// Age-3 safety is specific, not boilerplate.
ok(/too big and too soft|small enough to be a choking/.test(JSON.stringify(byId['pool-noodle-rope-threading'])), 'noodle threading: big soft pieces, stated');
ok(/never in mouths/.test(byId['big-dot-sticker-pictures'].safety || ''), 'stickers: big dots, mouth rule');
ok(/only one kid jumps at a time/.test(byId['jump-the-river-ropes'].safety || ''), 'river jump: one jumper at a time');
ok(/opening stays wide/.test(byId['blanket-fort-book-nook'].safety || ''), 'fort: opening stays wide and uncovered');
ok(/never a hiding place/.test(byId['blanket-fort-book-nook'].safety || ''), 'fort: never a hiding place');

// 5. Category + enrichment deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('stem') === 118, 'stem primary 108 by wave 27; wave 28 -> 109; wave 29 -> 111; wave 30 -> 112; wave 31 -> 113; wave 32 -> 115');
ok(prim('team-community') === 75, 'team-community primary 64 -> 66 in wave 27; wave 28 -> 67; wave 29 -> 68; wave 30 -> 69; wave 31 -> 70; wave 32 -> 72');
ok(prim('rainy-day') === 38, 'rainy-day primary 21 -> 22 in wave 27; wave 28 -> 24; wave 29 -> 25; wave 30 -> 27; wave 31 -> 29; wave 32 -> 33');
ok(prim('music-rhythm') === 38, 'music-rhythm primary 27 -> 28 in wave 27; wave 28 -> 29; wave 29 -> 30; wave 30 -> 31; wave 31 -> 32; wave 32 -> 34');
ok(prim('icebreakers') === 45, 'icebreakers primary 34 -> 35 in wave 27; wave 28 -> 36; wave 29 -> 38; wave 30 -> 39; wave 31 -> 40; wave 32 -> 42');
ok(prim('crafts') === 97, 'crafts primary 89 -> 90; wave 30 -> 91; wave 31 -> 92; wave 32 -> 94');
ok(prim('quiet-focus') === 61, 'quiet-focus primary 52 -> 54; wave 30 -> 55; wave 31 -> 56; wave 32 -> 58');
ok(prim('outdoor') === 55, 'outdoor primary 45 -> 46 in wave 27; wave 28 -> 47; wave 29 -> 48; wave 30 -> 49; wave 31 -> 50; wave 32 -> 52');
ok(prim('pe-movement') === 68, 'pe-movement primary 59 -> 60 in wave 27; wave 28 -> 61; wave 30 -> 62; wave 31 -> 63; wave 32 -> 65');
ok(acts.filter(a => a.copy_free).length === 305, 'copy_free 184 -> 197 by wave 27; wave 28 -> 209; wave 29 -> 221; wave 30 -> 233; wave 31 -> 245; wave 32 -> 257; wave 33 -> 269');
ok(acts.filter(a => a.no_elimination).length === 111, 'no_elimination 51 -> 57 in wave 27; wave 28 -> 63; wave 29 -> 70; wave 30 -> 75; wave 31 -> 81; wave 32 -> 87; wave 33 -> 93');
ok(acts.filter(a => a.inclusion).length === 167, 'inclusion 69 -> 75 by wave 27; wave 28 -> 81; wave 29 -> 87; wave 30 -> 95; wave 31 -> 107; wave 32 -> 119; wave 33 -> 131');

// 6. The 17th collection: Little Hands, Next Steps — and First Years intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 26, '26 collections', String(colls.length));
const nx = colls.find(c => c.id === 'little-hands-next-steps');
ok(!!nx, 'little-hands-next-steps collection present');
ok(nx.picks.length === 12, 'next-steps collection has 12 picks');
nx.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
  ok(byId[p.id].age_min <= 3, 'collection pick is age-3 reachable: ' + p.id);
});
NEW.forEach(id => ok(nx.picks.some(p => p.id === id), 'collection anchors the new pack: ' + id));
const lh = colls.find(c => c.id === 'little-hands-first-years');
ok(!!lh && lh.picks.length === 12, 'little-hands-first-years still intact at 12 picks');

// 7. Scout pipeline: the fresh live scan queued ONE genuinely new
//    candidate (the first non-empty cycle since wave 24) — Teach Beside
//    Me's Morse code games post. Reviewed by hand against the catalog:
//    ACCEPTED (signal-sent code, distinct from the paper cipher wheel
//    and the beaded binary record), adapted in original words as
//    morse-code-signal-post with the source credited on the record.
const queue = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/review-queue.json'), 'utf8'));
ok(queue.length === 60, 'queue 59 -> 60 (one new candidate this cycle)', String(queue.length));
ok(queue.filter(q => q.status === 'pending').length === 0, '0 pending — nothing waiting on a human');
ok(queue.filter(q => q.status === 'accepted').length === 22, '22 accepted all-time');
ok(queue.filter(q => q.status === 'rejected').length === 38, '38 rejected all-time');
const morseQ = queue.find(q => q.id === 'a0d0a7a320378ef3');
ok(!!morseQ && morseQ.status === 'accepted', 'Morse candidate accepted on review');
ok(morseQ.activity_id === 'morse-code-signal-post', 'Morse accept carries its activity_id');
ok(morseQ.decision && morseQ.decision.length >= 20, 'Morse decision reason recorded');
const morse = byId['morse-code-signal-post'];
ok(!!morse, 'morse-code-signal-post record present');
ok(morse.source === morseQ.link, 'Morse record credits the Scout source link');
ok(morse.age_min === 7 && morse.age_max === 12, 'Morse banded 7-12 (decoding needs reading fluency)');
ok(/never at eyes/.test(JSON.stringify(morse)) || /never at a face/.test(JSON.stringify(morse)), 'Morse: flashlight aim rule present');
queue.forEach(q => ok(q.decision && q.decision.length >= 20, 'decision reason recorded: ' + (q.title || q.id).slice(0, 40)));
queue.filter(q => q.status === 'accepted').forEach(q =>
  ok(q.activity_id && byId[q.activity_id], 'accepted candidate resolves to a real activity: ' + q.activity_id));
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds configured', String(feeds.length));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/review-queue.json'), 'utf8'));
ok((pub.candidates || []).length === 0, 'published queue shows 0 pending candidates');

console.log('test-wave27: ' + passed + ' assertions pass');
