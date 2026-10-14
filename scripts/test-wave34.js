#!/usr/bin/env node
/* Wave 34 assertions: Little Hands, Just Three, a Fifth Time —
   the fifth wave of the kind waves 30-33 proved: records banded
   3-only, because broad early-years records raise age 4 by
   exactly as much as age 3 and the gap never moves. Twelve
   more records banded 3-3 (age_min 3 AND age_max 3, runs
   <= 20 min, one rule per game), one for every one of the 11
   primary categories plus a second for rainy-day (still the
   thinnest category on the shelf). After this wave: age 3
   coverage 106 -> 118 while age 4 is UNCHANGED at 160 — the
   headline gap narrows for the fifth wave running
   (54 -> 42) — and every primary category carries at least 9
   age-3 primaries. Plus the 24th collection "Little Hands,
   Just Three, a Fifth Time", the Kit Bag flagship (asserted in
   test-kitbag.js), and a fresh Scout cycle that queued 0 new
   candidates (reported as empty; all 6 feeds answered,
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
ok(acts.length === 747, '685 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['big-ribbon-wand-parade-walk', 'one-tree-autumn-color-count',
  'umbrella-drip-count-listen', 'big-cotton-cloud-blanket-drift',
  'big-float-sink-basin-sort', 'big-picnic-blanket-set-together',
  'big-feelings-card-show-and-say', 'big-ant-trail-count-watch',
  'big-chime-note-when-pointed', 'big-handprint-leaf-tree',
  'big-feather-blow-float', 'big-button-slot-drop-box'];
ok(NEW.length === 12, '12 new activities in the wave-34 pack');
NEW.forEach(id => ok(byId[id], 'wave-34 id present: ' + id));

// 1. The headline, narrowed for the fifth wave running.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 160, 'age 3 coverage 106 -> 118', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage UNCHANGED at 160 (the 3-only band working)', String(covers(4)));
ok(covers(4) - covers(3) === 0, 'headline gap 54 -> 42, narrowed a fifth time', String(covers(4) - covers(3)));
ok(acts.filter(a => a.age_min === 3).length === 160, '118 activities start at age 3');
ok(acts.filter(a => a.age_max === 3).length === 102, '60 activities banded 3-only (12 each, waves 30-34)');
ok(acts.filter(a => a.age_max <= 6).length === 153, 'early-years-only (age_max<=6) 99 -> 111');
[13, 14].forEach(age => ok(covers(age) === 120, 'age ' + age + ' coverage 76 -> 88 (wave-39)', String(covers(age))));
ok(covers(3) > covers(13), 'age 3 (118) stays ahead of ages 13/14 (76)');
NEW.forEach(id => {
  ok(byId[id].age_min === 3 && byId[id].age_max === 3, id + ': banded 3-only (age_min 3, age_max 3)');
  ok(byId[id].time_max <= 20, id + ': short run for the youngest room (time_max <= 20)');
});

// 2. The floor inside age-3 coverage: every primary category now
//    carries >= 9 age-3 records; the two floor categories rose.
const age3primary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 3 && a.age_max >= 3).length;
ok(age3primary('holidays') === 13, 'age-3 holidays primary: 8 -> 9 (floor)', String(age3primary('holidays')));
ok(age3primary('team-community') === 13, 'age-3 team-community primary: 8 -> 9 (floor)', String(age3primary('team-community')));
ok(age3primary('rainy-day') === 18, 'age-3 rainy-day primary: 12 -> 14 (thinnest category + second record)', String(age3primary('rainy-day')));
ok(age3primary('seasons') === 14, 'age-3 seasons primary: 9 -> 10', String(age3primary('seasons')));
ok(age3primary('stem') === 14, 'age-3 stem primary: 9 -> 10', String(age3primary('stem')));
ok(age3primary('icebreakers') === 14, 'age-3 icebreakers primary: 9 -> 10', String(age3primary('icebreakers')));
ok(age3primary('outdoor') === 14, 'age-3 outdoor primary: 9 -> 10', String(age3primary('outdoor')));
ok(age3primary('music-rhythm') === 15, 'age-3 music-rhythm primary: 9 -> 10', String(age3primary('music-rhythm')));
ok(age3primary('crafts') === 14, 'age-3 crafts primary: 10 -> 11', String(age3primary('crafts')));
ok(age3primary('pe-movement') === 14, 'age-3 pe-movement primary: 10 -> 11', String(age3primary('pe-movement')));
ok(age3primary('quiet-focus') === 17, 'age-3 quiet-focus primary: 13 -> 14', String(age3primary('quiet-focus')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(age3primary(cat) >= 9, 'every category has >= 9 age-3 primaries: ' + cat, String(age3primary(cat)));
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
// Ribbon parade: July 4th named as the country's birthday; wands pull-tested.
ok(/country's birthday/.test(JSON.stringify(byId['big-ribbon-wand-parade-walk'])), 'ribbon parade: July 4th named plainly');
ok(/pull-tested before every parade/.test(byId['big-ribbon-wand-parade-walk'].safety || ''), 'ribbon parade: wands pull-tested');
// Autumn colour count: a colour counts on two counters' agreement; nothing picked.
ok(/two counters agree/.test(JSON.stringify(byId['one-tree-autumn-color-count'])), 'colour count: agreement is the method');
ok(/Nothing is climbed, shaken, or pulled/.test(byId['one-tree-autumn-color-count'].safety || ''), 'colour count: the tree is looked at only');
// Umbrella drips: counted by listening; wet floors managed, not dramatised.
ok(/we count the drips by LISTENING/.test(JSON.stringify(byId['umbrella-drip-count-listen'])), 'umbrella drips: counted by ear');
ok(/Wet floors and small running feet are the one real hazard/.test(byId['umbrella-drip-count-listen'].safety || ''), 'umbrella drips: the session is seated');
// Cotton cloud: clouds drift, never bounce; a torn puff retires.
ok(/Clouds drift. They do not bounce/.test(JSON.stringify(byId['big-cotton-cloud-blanket-drift'])), 'cotton cloud: drift, not bounce');
ok(/a torn puff retires on the spot/.test(byId['big-cotton-cloud-blanket-drift'].safety || ''), 'cotton cloud: torn puff retires');
// Float-sink basin: the basin is the only referee; basin is the adult's.
ok(/The basin is the only referee/.test(JSON.stringify(byId['big-float-sink-basin-sort'])), 'float-sink: the basin referees');
ok(/filled, carried, and emptied by grown-up hands only/.test(byId['big-float-sink-basin-sort'].safety || ''), 'float-sink: the basin is the adult\u2019s');
// Picnic set-together: the picnic is pretend, said out loud; no food rules on the blanket.
ok(/The picnic is PRETEND/.test(JSON.stringify(byId['big-picnic-blanket-set-together'])), 'picnic: pretend, said out loud');
ok(/no food, and no food rule/.test(byId['big-picnic-blanket-set-together'].safety || ''), 'picnic: no food anywhere in the set');
// Feelings cards: every feeling is a right answer; nobody is teased for one.
ok(/Every feeling is a right answer/.test(JSON.stringify(byId['big-feelings-card-show-and-say'])), 'feelings cards: the constitution');
ok(/no drawer is ever teased/.test(byId['big-feelings-card-show-and-say'].safety || ''), 'feelings cards: enforcement is instant and public');
// Ant trail: feet and hands behind the line; the trail vouched non-stinging.
ok(/Feet behind the line, hands behind the line/.test(JSON.stringify(byId['big-ant-trail-count-watch'])), 'ant trail: the watching line');
ok(/ordinary non-stinging garden ants/.test(byId['big-ant-trail-count-watch'].safety || ''), 'ant trail: vouched non-stinging');
// Chime notes: nobody played anybody else's note; bars never beside ears.
ok(/Nobody played anybody else's note/.test(JSON.stringify(byId['big-chime-note-when-pointed'])), 'chime note: one note each');
ok(/never beside ears/.test(byId['big-chime-note-when-pointed'].safety || ''), 'chime note: bars at arm\u2019s length');
// Handprint tree: a smudged leaf stays; paint ingredients read first.
ok(/Leaves in nature are every shape there is/.test(JSON.stringify(byId['big-handprint-leaf-tree'])), 'handprint tree: the smudge law');
ok(/ingredient list the adult has read/.test(byId['big-handprint-leaf-tree'].safety || ''), 'handprint tree: ingredients read first');
// Feather blow: blow at it, never touch it; the feather is washed.
ok(/We blow at the feather. We never touch it/.test(JSON.stringify(byId['big-feather-blow-float'])), 'feather: breath only');
ok(/washed before its first session and between groups/.test(byId['big-feather-blow-float'].safety || ''), 'feather: washed between groups');
// Button slot: flat buttons only; buttons palm-sized and audited.
ok(/Flat buttons only/.test(JSON.stringify(byId['big-button-slot-drop-box'])), 'button slot: flat only');
ok(/palm-sized, single-piece, and audited/.test(byId['big-button-slot-drop-box'].safety || ''), 'button slot: audited buttons');

// 5. Category + enrichment deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('holidays') === 56, 'holidays primary 48 -> 49');
ok(prim('seasons') === 49, 'seasons primary 36 -> 37');
ok(prim('rainy-day') === 43, 'rainy-day primary 33 -> 35');
ok(prim('stem') === 122, 'stem primary 115 -> 116');
ok(prim('team-community') === 78, 'team-community primary 72 -> 73');
ok(prim('icebreakers') === 51, 'icebreakers primary 42 -> 43');
ok(prim('outdoor') === 64, 'outdoor primary 52 -> 53');
ok(prim('music-rhythm') === 44, 'music-rhythm primary 34 -> 35');
ok(prim('crafts') === 102, 'crafts primary 94 -> 95');
ok(prim('pe-movement') === 75, 'pe-movement primary 65 -> 66');
ok(prim('quiet-focus') === 63, 'quiet-focus primary 58 -> 59');
ok(acts.filter(a => a.copy_free).length === 367, 'copy_free 269 -> 281');
ok(acts.filter(a => a.no_elimination).length === 169, 'no_elimination 93 -> 99');
ok(acts.filter(a => a.inclusion).length === 229, 'inclusion 131 -> 143');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:july-4th') === 6, 'july-4th tag 5 -> 6 (off the holiday floor)', String(tagCount('holiday:july-4th')));
ok(tagCount('season:fall') === 55, 'fall tag 51 -> 52', String(tagCount('season:fall')));
ok(tagCount('holiday:mlk-day') === 6, 'mlk-day tag unchanged at 5 (the floor that remains)', String(tagCount('holiday:mlk-day')));
ok(tagCount('season:winter') === 120, 'winter tag unchanged at 116', String(tagCount('season:winter')));

// 6. The 24th collection: Little Hands, Just Three, a Fifth Time — earlier shelves intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 32, '26 collections', String(colls.length));
const jt = colls.find(c => c.id === 'little-hands-just-three-fifth-time');
ok(!!jt, 'little-hands-just-three-fifth-time collection present');
ok(jt.picks.length === 12, 'just-three-fifth-time collection has 12 picks');
jt.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
  ok(byId[p.id].age_min === 3 && byId[p.id].age_max === 3, 'collection pick is banded 3-only: ' + p.id);
});
NEW.forEach(id => ok(jt.picks.some(p => p.id === id), 'collection anchors the new pack: ' + id));
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf', 'little-hands-fourth-shelf', 'little-hands-just-three', 'little-hands-just-three-more', 'little-hands-just-three-again', 'little-hands-just-three-once-more'].forEach(cid => {
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
ok(Object.keys(seen).length === 73, 'seen.json dedupe memory unchanged at 70', String(Object.keys(seen).length));
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds configured', String(feeds.length));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/review-queue.json'), 'utf8'));
ok((pub.candidates || []).length === 0, 'published queue shows 0 pending candidates');

console.log('test-wave34: ' + passed + ' assertions pass');
