#!/usr/bin/env node
/* Wave 35 assertions: Little Hands, Just Three, a Sixth Time —
   the sixth wave of the kind waves 30-34 proved: records banded
   3-only, because broad early-years records raise age 4 by
   exactly as much as age 3 and the gap never moves. Twelve
   more records banded 3-3 (age_min 3 AND age_max 3, runs
   <= 20 min, one rule per game), one for every one of the 11
   primary categories plus a second for rainy-day (still joint-
   thinnest category on the shelf). After this wave: age 3
   coverage 118 -> 130 while age 4 is UNCHANGED at 160 — the
   headline gap narrows for the sixth wave running
   (42 -> 30) — and every primary category carries at least 10
   age-3 primaries. Plus the 25th collection "Little Hands,
   Just Three, a Sixth Time", the Party Pack flagship (asserted
   in test-partypack.js), and a fresh Scout cycle that queued 0
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
ok(acts.length === 673, '673 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['big-dream-echo-circle', 'big-warm-stone-hold-tell',
  'big-bus-stop-ride-along', 'big-leg-tunnel-ball-roll',
  'big-heavy-light-hand-balance', 'big-one-statue-many-bodies',
  'big-pass-the-smile-circle', 'big-puddle-sky-mirror-look',
  'big-rainstick-tip-and-listen', 'big-bubble-wrap-print-paint',
  'big-log-roll-down-the-mat', 'big-wooden-bead-stringing'];
ok(NEW.length === 12, '12 new activities in the wave-35 pack');
NEW.forEach(id => ok(byId[id], 'wave-35 id present: ' + id));

// 1. The headline, narrowed for the sixth wave running.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 130, 'age 3 coverage 118 -> 130', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage UNCHANGED at 160 (the 3-only band working)', String(covers(4)));
ok(covers(4) - covers(3) === 30, 'headline gap 42 -> 30, narrowed a sixth time', String(covers(4) - covers(3)));
ok(acts.filter(a => a.age_min === 3).length === 130, '130 activities start at age 3');
ok(acts.filter(a => a.age_max === 3).length === 72, '72 activities banded 3-only (12 each, waves 30-35)');
ok(acts.filter(a => a.age_max <= 6).length === 123, 'early-years-only (age_max<=6) 111 -> 123');
[13, 14].forEach(age => ok(covers(age) === 76, 'age ' + age + ' coverage unchanged at 76', String(covers(age))));
ok(covers(3) > covers(13), 'age 3 (130) stays ahead of ages 13/14 (76)');
NEW.forEach(id => {
  ok(byId[id].age_min === 3 && byId[id].age_max === 3, id + ': banded 3-only (age_min 3, age_max 3)');
  ok(byId[id].time_max <= 20, id + ': short run for the youngest room (time_max <= 20)');
});

// 2. The floor inside age-3 coverage: every primary category now
//    carries >= 10 age-3 records; the two floor categories rose.
const age3primary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 3 && a.age_max >= 3).length;
ok(age3primary('holidays') === 10, 'age-3 holidays primary: 9 -> 10 (floor)', String(age3primary('holidays')));
ok(age3primary('team-community') === 10, 'age-3 team-community primary: 9 -> 10 (floor)', String(age3primary('team-community')));
ok(age3primary('rainy-day') === 16, 'age-3 rainy-day primary: 14 -> 16 (thinnest category + second record)', String(age3primary('rainy-day')));
ok(age3primary('seasons') === 11, 'age-3 seasons primary: 10 -> 11', String(age3primary('seasons')));
ok(age3primary('stem') === 11, 'age-3 stem primary: 10 -> 11', String(age3primary('stem')));
ok(age3primary('icebreakers') === 11, 'age-3 icebreakers primary: 10 -> 11', String(age3primary('icebreakers')));
ok(age3primary('outdoor') === 11, 'age-3 outdoor primary: 10 -> 11', String(age3primary('outdoor')));
ok(age3primary('music-rhythm') === 11, 'age-3 music-rhythm primary: 10 -> 11', String(age3primary('music-rhythm')));
ok(age3primary('crafts') === 12, 'age-3 crafts primary: 11 -> 12', String(age3primary('crafts')));
ok(age3primary('pe-movement') === 12, 'age-3 pe-movement primary: 11 -> 12', String(age3primary('pe-movement')));
ok(age3primary('quiet-focus') === 15, 'age-3 quiet-focus primary: 14 -> 15', String(age3primary('quiet-focus')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(age3primary(cat) >= 10, 'every category has >= 10 age-3 primaries: ' + cat, String(age3primary(cat)));
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
// Dream echo: Dr. King named plainly; every dream is a right dream; nothing promised.
ok(/Martin Luther King/.test(JSON.stringify(byId['big-dream-echo-circle'])), 'dream echo: Dr. King named plainly');
ok(/Every dream is a right dream/.test(JSON.stringify(byId['big-dream-echo-circle'])), 'dream echo: the constitution');
ok(/never tells a dreamer their dream will come true/.test(byId['big-dream-echo-circle'].safety || ''), 'dream echo: no promises made');
// Warm stones: the palms read the stations; sun stones wrist-checked first.
ok(/which hand is holding summer/i.test(JSON.stringify(byId['big-warm-stone-hold-tell'])), 'warm stones: palms report');
ok(/inner wrist first/.test(byId['big-warm-stone-hold-tell'].safety || ''), 'warm stones: wrist check before small palms');
// Bus ride: the bus never moves; tokens palm-sized and audited.
ok(/it never, ever moves/i.test(JSON.stringify(byId['big-bus-stop-ride-along'])), 'bus ride: the bus never moves');
ok(/palm-sized, single-piece/.test(byId['big-bus-stop-ride-along'].safety || ''), 'bus ride: audited tokens');
// Leg tunnel: feet stay planted; the ball is rolled, never thrown.
ok(/Feet stay planted like tunnel walls/.test(JSON.stringify(byId['big-leg-tunnel-ball-roll'])), 'leg tunnel: feet are walls');
ok(/rolled only from a kneel/.test(byId['big-leg-tunnel-ball-roll'].safety || ''), 'leg tunnel: kneeling rolls only');
// Hand balance: eyes cannot weigh; leaking bags retire.
ok(/Eyes cannot weigh. Hands can/.test(JSON.stringify(byId['big-heavy-light-hand-balance'])), 'hand balance: eyes cannot weigh');
ok(/leaking filled bag retires on the spot/.test(byId['big-heavy-light-hand-balance'].safety || ''), 'hand balance: leaking bag retires');
// One statue: every part holds itself up; melts are always available.
ok(/does their own part/.test(JSON.stringify(byId['big-one-statue-many-bodies'])), 'statue: each part holds itself');
ok(/no child leans their weight on/.test(byId['big-one-statue-many-bodies'].safety || ''), 'statue: nobody holds anybody up');
// Pass the smile: offered, never extracted; faces are believed.
ok(/Nobody grabs it early/.test(JSON.stringify(byId['big-pass-the-smile-circle'])), 'smile: passed one neighbour at a time');
ok(/never extracted/.test(byId['big-pass-the-smile-circle'].safety || ''), 'smile: offered, never extracted');
// Puddle mirror: feet out, hands out; the picture mends itself.
ok(/Feet stay OUT. Hands stay OUT/.test(JSON.stringify(byId['big-puddle-sky-mirror-look'])), 'puddle mirror: the laws whole');
ok(/gathering line is absolute/.test(byId['big-puddle-sky-mirror-look'].safety || ''), 'puddle mirror: the line is absolute');
// Rainstick: the rain is quiet, so we are; a shedding stick is out permanently.
ok(/The rain is quiet, so we are/.test(JSON.stringify(byId['big-rainstick-tip-and-listen'])), 'rainstick: quiet rain, quiet circle');
ok(/sheds one grain is out of the circle/.test(byId['big-rainstick-tip-and-listen'].safety || ''), 'rainstick: seal is the safety system');
// Bubble wrap press: flat palms, never popped; ingredients read first.
ok(/we never pop them/i.test(JSON.stringify(byId['big-bubble-wrap-print-paint'])), 'bubble press: never popped');
ok(/ingredient list the adult has read/.test(byId['big-bubble-wrap-print-paint'].safety || ''), 'bubble press: ingredients read first');
// Log roll: arms stay in; one log on the mat at a time.
ok(/Arms stay IN/.test(JSON.stringify(byId['big-log-roll-down-the-mat'])), 'log roll: arms in');
ok(/One log on the mat at a time/.test(byId['big-log-roll-down-the-mat'].safety || ''), 'log roll: one log at a time');
// Bead stringing: turn the bead to the point; beads audited one by one.
ok(/turn the bead until its hole faces the point/i.test(JSON.stringify(byId['big-wooden-bead-stringing'])), 'beads: turn the bead');
ok(/audited one by one before every session/.test(byId['big-wooden-bead-stringing'].safety || ''), 'beads: audited one by one');

// 5. Category + enrichment deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('holidays') === 50, 'holidays primary 49 -> 50');
ok(prim('seasons') === 38, 'seasons primary 37 -> 38');
ok(prim('rainy-day') === 37, 'rainy-day primary 35 -> 37');
ok(prim('stem') === 117, 'stem primary 116 -> 117');
ok(prim('team-community') === 74, 'team-community primary 73 -> 74');
ok(prim('icebreakers') === 44, 'icebreakers primary 43 -> 44');
ok(prim('outdoor') === 54, 'outdoor primary 53 -> 54');
ok(prim('music-rhythm') === 36, 'music-rhythm primary 35 -> 36');
ok(prim('crafts') === 96, 'crafts primary 95 -> 96');
ok(prim('pe-movement') === 67, 'pe-movement primary 66 -> 67');
ok(prim('quiet-focus') === 60, 'quiet-focus primary 59 -> 60');
ok(acts.filter(a => a.copy_free).length === 293, 'copy_free 281 -> 293');
ok(acts.filter(a => a.no_elimination).length === 105, 'no_elimination 99 -> 105');
ok(acts.filter(a => a.inclusion).length === 155, 'inclusion 143 -> 155');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:mlk-day') === 6, 'mlk-day tag 5 -> 6 (off the holiday floor)', String(tagCount('holiday:mlk-day')));
ok(tagCount('season:summer') === 31, 'summer tag 30 -> 31 (thinnest season rises)', String(tagCount('season:summer')));
ok(tagCount('holiday:indigenous-peoples-day') === 5, 'indigenous-peoples-day tag unchanged at 5 (the floor that remains)', String(tagCount('holiday:indigenous-peoples-day')));
ok(tagCount('season:winter') === 116, 'winter tag unchanged at 116', String(tagCount('season:winter')));

// 6. The 25th collection: Little Hands, Just Three, a Sixth Time — earlier shelves intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 25, '25 collections', String(colls.length));
const jt = colls.find(c => c.id === 'little-hands-just-three-sixth-time');
ok(!!jt, 'little-hands-just-three-sixth-time collection present');
ok(jt.picks.length === 12, 'just-three-sixth-time collection has 12 picks');
jt.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
  ok(byId[p.id].age_min === 3 && byId[p.id].age_max === 3, 'collection pick is banded 3-only: ' + p.id);
});
NEW.forEach(id => ok(jt.picks.some(p => p.id === id), 'collection anchors the new pack: ' + id));
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf', 'little-hands-fourth-shelf', 'little-hands-just-three', 'little-hands-just-three-more', 'little-hands-just-three-again', 'little-hands-just-three-once-more', 'little-hands-just-three-fifth-time'].forEach(cid => {
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

console.log('test-wave35: ' + passed + ' assertions pass');
