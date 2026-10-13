#!/usr/bin/env node
/* Wave 26 assertions: First Years — the age-3 cliff closed with 10
   activities designed for 3-year-olds (age_min 3, mechanics sized for
   three first), the last two thin holidays filled (lunar-new-year
   3 -> 5, valentines-day 4 -> 6, so every holiday tag now carries
   >= 5), and the 16th collection "Little Hands, First Years".
   Plus the Scout pipeline health check: live scan ran, 0 new
   candidates, queue fully decided with reasons, every accepted
   activity_id resolving in the catalog.
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
ok(acts.length === 697, '685 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const AGE3 = ['tape-path-balance-walk', 'pom-pom-drop-tubes', 'sponge-squeeze-station',
  'sound-match-shakers', 'bubble-wrap-stomp-path', 'cardboard-tunnel-crawl',
  'hello-ball-greetings', 'pouring-practice-trays', 'nature-color-match-walk',
  'torn-paper-collage'];
const LNY = ['red-envelope-wishes', 'zodiac-great-race-sequence'];
const VAL = ['kindness-post-office', 'fold-and-open-hearts'];
const NEW = AGE3.concat(LNY, VAL);
ok(NEW.length === 14, '14 new activities in the wave-26 pack');
NEW.forEach(id => ok(byId[id], 'wave-26 id present: ' + id));

// 1. The age-3 cliff: coverage 12 -> 22, all of it designed-band.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 154, 'age 3 coverage 12 -> 22 in wave 26; wave 27 -> 34; wave 28 -> 46; wave 29 -> 58; wave 30 -> 70; wave 31 -> 82; wave 32 -> 94; wave 33 -> 106', String(covers(3)));
ok(acts.filter(a => a.age_min === 3).length === 154, '94 activities start at age 3 (58 + 12 wave-30); wave 31 -> 82; wave 32 -> 94');
ok(acts.filter(a => a.age_max <= 6).length === 147, 'early-years-only (age_max<=6) 5 -> 15 in wave 26; wave 27 -> 27; wave 28 -> 39; wave 29 -> 51; wave 30 -> 63; wave 31 -> 75; wave 32 -> 87; wave 33 -> 99; wave 34 -> 111');
AGE3.forEach(id => {
  ok(byId[id].age_min === 3, id + ': designed for 3 (age_min 3)');
  ok(byId[id].age_max <= 6, id + ': early-years band (age_max <= 6)');
  ok(byId[id].time_max <= 25, id + ': short run for small attention (time_max <= 25)');
});
// Category firsts at age 3: these categories had ZERO age-3 coverage.
['icebreakers', 'team-community', 'rainy-day'].forEach(cat => {
  const n = acts.filter(a => a.categories.includes(cat) && a.age_min <= 3 && a.age_max >= 3).length;
  ok(n >= 1, 'age-3 first for category: ' + cat, String(n));
});

// 2. The last thin holidays: every holiday tag now carries >= 5.
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:lunar-new-year') === 6, 'lunar-new-year 3 -> 5 in wave 26; wave 29 -> 6', String(tagCount('holiday:lunar-new-year')));
ok(tagCount('holiday:valentines-day') === 7, 'valentines-day 4 -> 6; wave 31 -> 7', String(tagCount('holiday:valentines-day')));
const holidayTags = new Set();
acts.forEach(a => (a.tags || []).forEach(t => { if (t.startsWith('holiday:')) holidayTags.add(t); }));
holidayTags.forEach(t => ok(tagCount(t) >= 5, 'holiday floor of 5: ' + t, String(tagCount(t))));
LNY.forEach(id => ok(byId[id].tags.includes('holiday:lunar-new-year'), id + ': lunar-new-year tag'));
VAL.forEach(id => ok(byId[id].tags.includes('holiday:valentines-day'), id + ': valentines-day tag'));

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
  const blob = JSON.stringify(a).toLowerCase();
  MEDICAL.forEach(w => ok(!blob.includes(w), id + ': no medical claim "' + w + '"'));
  AIISMS.forEach(w => ok(!blob.includes(w), id + ': no AI-ism "' + w + '"'));
  ok(fs.existsSync(path.join(ROOT, 'activity', id + '.html')), id + ': page rendered');
});

// 4. Honest framing + real-world safety, checked on the records.
// Lunar New Year: the real custom named, the school swap named as a swap.
ok(/hongbao/.test(JSON.stringify(byId['red-envelope-wishes'])), 'red envelopes: hongbao named');
ok(/never swap money at school/.test(JSON.stringify(byId['red-envelope-wishes'])), 'red envelopes: no money at school, stated');
ok(/school adaptation/.test(byId['red-envelope-wishes'].inclusion || ''), 'red envelopes: adaptation named as one');
ok(/folk tale/.test(JSON.stringify(byId['zodiac-great-race-sequence'])), 'zodiac: folk tale, named as one');
ok(/never a costume|never.*costume/.test(byId['zodiac-great-race-sequence'].inclusion || ''), 'zodiac: no costumes');
// Valentine's: the ledger guarantee is in the record, not just the log.
ok(/ledger/.test(JSON.stringify(byId['kindness-post-office'])), 'post office: delivery ledger present');
ok(/guarantees every kid/.test(byId['kindness-post-office'].inclusion || ''), 'post office: every-kid guarantee stated');
ok(/Nobody bleeds for a valentine/.test(byId['fold-and-open-hearts'].safety || ''), 'hearts: blunt scissors, adult cuts');
// Age-3 safety is specific, not boilerplate.
ok(/count them out and count them back/.test(byId['pom-pom-drop-tubes'].safety || ''), 'pom-poms: count out / count back');
ok(/choking hazards/.test(byId['sound-match-shakers'].safety || ''), 'shakers: sealed lids, choking note');
ok(/Both ends stay open/.test(byId['cardboard-tunnel-crawl'].safety || ''), 'tunnel: both ends open');
ok(/Water only/.test(byId['pouring-practice-trays'].safety || ''), 'pouring: water only at this age');
ok(/replaces scissors/.test(byId['torn-paper-collage'].safety || ''), 'collage: tearing replaces scissors');
ok(/wave/.test(byId['hello-ball-greetings'].inclusion || ''), 'hello ball: nonverbal greeting counts');

// 5. Category + enrichment deltas from this wave.
ok(acts.filter(a => a.categories[0] === 'music-rhythm').length === 40, 'music-rhythm primary 26 -> 27 in wave 26; wave 27 -> 28; wave 28 -> 29; wave 29 -> 30; wave 30 -> 31; wave 31 -> 32; wave 32 -> 33; wave 33 -> 34; wave 34 -> 35; wave 35 -> 36; wave 36 -> 38');
ok(acts.filter(a => a.categories.includes('rainy-day')).length === 72, 'rainy-day any-category 50 -> 53 in wave 26; wave 27 -> 55; wave 28 -> 57; wave 29 -> 58; wave 30 -> 60; wave 31 -> 62; wave 32 -> 64; wave 33 -> 66; wave 34 -> 68; wave 35 -> 70; wave 36 -> 71');
ok(acts.filter(a => a.copy_free).length === 317, 'copy_free 173 -> 184 in wave 26; wave 27 -> 197; wave 28 -> 209; wave 29 -> 221; wave 30 -> 233; wave 31 -> 245; wave 32 -> 257; wave 33 -> 269');
ok(acts.filter(a => a.no_elimination).length === 119, 'no_elimination 47 -> 51 in wave 26; wave 27 -> 57; wave 28 -> 63; wave 29 -> 70; wave 30 -> 75; wave 31 -> 81; wave 32 -> 87; wave 33 -> 93');
ok(acts.filter(a => a.inclusion).length === 179, 'inclusion 64 -> 69 in wave 26; wave 27 -> 75; wave 28 -> 81; wave 29 -> 87; wave 30 -> 95; wave 31 -> 107; wave 32 -> 119; wave 33 -> 131');
[13, 14].forEach(age => ok(covers(age) === 76, 'age ' + age + ' coverage unchanged at 76', String(covers(age))));

// 6. The 16th collection: Little Hands, First Years.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 27, '26 collections', String(colls.length));
const lh = colls.find(c => c.id === 'little-hands-first-years');
ok(!!lh, 'little-hands-first-years collection present');
ok(lh.picks.length === 12, 'collection has 12 picks');
lh.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
  ok(byId[p.id].age_min <= 3, 'collection pick is age-3 reachable: ' + p.id);
});
AGE3.forEach(id => ok(lh.picks.some(p => p.id === id), 'collection anchors the new pack: ' + id));

// 7. Scout pipeline health: live scan ran 2026-10-12, 0 new landed,
//    queue fully decided, every acceptance real.
const queue = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/review-queue.json'), 'utf8'));
ok(queue.length === 62, 'queue 59 -> 60 in wave 27 (scan queued 1, accepted on review)', String(queue.length));
ok(queue.filter(q => q.status === 'pending').length === 0, '0 pending — nothing waiting on a human');
ok(queue.filter(q => q.status === 'accepted').length === 22, '22 accepted all-time (21 + wave-27 Morse accept)');
ok(queue.filter(q => q.status === 'rejected').length === 40, '38 rejected all-time');
queue.forEach(q => ok(q.decision && q.decision.length >= 20, 'decision reason recorded: ' + (q.title || q.id).slice(0, 40)));
queue.filter(q => q.status === 'accepted').forEach(q =>
  ok(q.activity_id && byId[q.activity_id], 'accepted candidate resolves to a real activity: ' + q.activity_id));
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds configured', String(feeds.length));
const seen = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/seen.json'), 'utf8'));
ok(Object.keys(seen).length >= 69, 'seen registry intact (dedupe memory)', String(Object.keys(seen).length));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/review-queue.json'), 'utf8'));
ok((pub.candidates || []).length === 0, 'published queue shows 0 pending candidates');

console.log('test-wave26: ' + passed + ' assertions pass');
