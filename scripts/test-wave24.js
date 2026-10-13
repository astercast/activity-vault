#!/usr/bin/env node
/* Wave 24 assertions: the Scout review (36 candidates -> 8 accepted /
   28 rejected, 0 pending) + full-calendar completeness fills (6 new tags,
   7 gap fills, 5 retags, 15th collection "the-whole-calendar").
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
ok(acts.length === 715, '685 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const SCOUT = ['dream-for-our-community', 'floating-ink-ghost', 'binary-code-keychain',
  'indigenous-innovators-spotlight', 'feelings-pumpkin-faces', 'christmas-light-stencil-art',
  'twig-snowflake-craft', 'cd-rainbow-light-lab'];
const GAPS = ['valentine-to-a-favorite-book', 'lantern-riddle-walk', 'leprechaun-trap-build',
  'shamrock-shapes-hunt', 'rangoli-pattern-art', 'paper-diya-lanterns', 'scarf-dance-patterns'];
const NEW = SCOUT.concat(GAPS);
NEW.forEach(id => ok(byId[id], 'wave-24 id present: ' + id));

// 1. Quality bar on every new record.
const MEDICAL = ['therapy', 'therapeutic', 'diagnos', 'treat anxiety', 'cure'];
NEW.forEach(id => {
  const a = byId[id];
  ok(a.tagline.length <= 160, id + ': tagline <= 160', String(a.tagline.length));
  ok(a.steps.length >= 4, id + ': 4+ steps', String(a.steps.length));
  ok(a.variations && a.variations.easier && a.variations.harder, id + ': easier+harder');
  ok(a.age_min >= 3 && a.age_min <= a.age_max && a.age_max <= 18, id + ': sane ages');
  ok(a.group_min <= a.group_max && a.time_min <= a.time_max, id + ': sane group/time');
  const blob = JSON.stringify(a).toLowerCase();
  MEDICAL.forEach(w => ok(!blob.includes(w), id + ': no medical claim "' + w + '"'));
  ok(fs.existsSync(path.join(ROOT, 'activity', id + '.html')), id + ': page rendered');
});

// 2. Scout accepts carry a source credit that resolves to a queue link.
const queue = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/review-queue.json'), 'utf8'));
const queueLinks = new Set(queue.map(q => q.link));
SCOUT.forEach(id => {
  ok(byId[id].source && byId[id].source.startsWith('http'), id + ': source credited');
  ok([...queueLinks].some(l => l.split('?')[0] === byId[id].source.split('?')[0]), id + ': source is a real queue link (tracking params stripped)');
});

// 3. Queue fully decided by this wave's batch: 36 reviewed 2026-10-12,
//    8 accepted with activity_id, 28 rejected, every decision has a reason.
// Wave-27 note: the Morse accept was also reviewed 2026-10-12 (a later
// same-day cycle) — it is excluded here so this stays the wave-24 batch.
const batch = queue.filter(q => q.reviewed === '2026-10-12' && q.id !== 'a0d0a7a320378ef3');
ok(batch.length === 36, '36 candidates reviewed in wave 24', String(batch.length));
ok(queue.filter(q => q.status === 'pending').length === 0, '0 pending left');
const acc = batch.filter(q => q.status === 'accepted');
const rej = batch.filter(q => q.status === 'rejected');
ok(acc.length === 8, '8 accepted', String(acc.length));
ok(rej.length === 28, '28 rejected', String(rej.length));
batch.forEach(q => ok(q.decision && q.decision.length >= 30, 'reason recorded: ' + q.title.slice(0, 40)));
acc.forEach(q => ok(q.activity_id && byId[q.activity_id], 'accepted maps to real activity: ' + q.activity_id));
ok(new Set(acc.map(q => q.activity_id)).size === 8, 'accepted activity ids distinct');

// 4. New tag vocabulary present and used.
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:mlk-day') === 6, 'mlk-day 0 -> 1 (wave-24) -> 5 (wave-25 deepening)', String(tagCount('holiday:mlk-day')));
ok(tagCount('holiday:indigenous-peoples-day') === 6, 'indigenous-peoples-day 0 -> 1 (wave-24) -> 5 (wave-25 deepening) -> 6 (wave-36)');
ok(tagCount('holiday:valentines-day') === 7, 'valentines-day 0 -> 4 in wave 24; wave 26 -> 6; wave 31 -> 7');
ok(tagCount('holiday:lunar-new-year') === 6, 'lunar-new-year 0 -> 3 in wave 24; wave 26 -> 5; wave 29 -> 6');
ok(tagCount('holiday:st-patricks-day') === 6, 'st-patricks-day 0 -> 2 (wave-24) -> 5 (wave-25 deepening); wave 33 -> 6');
ok(tagCount('holiday:diwali') === 6, 'diwali 0 -> 2 (wave-24) -> 5 (wave-25 deepening); wave 32 -> 6');
['valentine-card-exchange', 'valentine-compliment-cards', 'valentine-heart-hunt'].forEach(id =>
  ok((byId[id].tags || []).includes('holiday:valentines-day'), id + ': retagged valentines'));
['dragon-parade', 'paper-lantern-festival'].forEach(id =>
  ok((byId[id].tags || []).includes('holiday:lunar-new-year'), id + ': retagged lunar-new-year'));
const buildPy = fs.readFileSync(path.join(ROOT, 'scripts/build.py'), 'utf8');
const appJs = fs.readFileSync(path.join(ROOT, 'assets/app.js'), 'utf8');
const plannerJs = fs.readFileSync(path.join(ROOT, 'assets/planner.js'), 'utf8');
['holiday:mlk-day', 'holiday:valentines-day', 'holiday:lunar-new-year',
 'holiday:st-patricks-day', 'holiday:diwali', 'holiday:indigenous-peoples-day'].forEach(t => {
  ok(buildPy.includes('"' + t + '"'), 'build.py vocabulary: ' + t);
  ok(appJs.includes("'" + t + "'"), 'app.js labels: ' + t);
  ok(plannerJs.includes("'" + t + "'"), 'planner.js labels: ' + t);
});

// 5. Respectful framing + safety specifics on the cultural activities.
ok(/real Lantern Festival|Lantern Festival custom/.test(byId['lantern-riddle-walk'].inclusion || ''), 'lantern riddles: real-tradition framing');
ok(/living Diwali tradition/.test(byId['rangoli-pattern-art'].inclusion || ''), 'rangoli: living-tradition framing');
ok(/never real candles/.test(byId['paper-diya-lanterns'].safety || ''), 'diya: LED-only safety');
ok(/No costumes/.test(byId['indigenous-innovators-spotlight'].inclusion || ''), 'innovators: no-costumes framing');
ok(/peanut/.test((queue.find(q => q.title.includes('Snickers')) || {}).decision || ''), 'snickers rejection names the allergen');

// 6. The new collection: 12 picks, calendar order anchors, all resolve.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 28, '26 collections', String(colls.length));
const cal = colls.find(c => c.id === 'the-whole-calendar');
ok(cal, 'the-whole-calendar collection exists');
ok(cal.picks.length === 12, 'whole-calendar has 12 picks', String(cal.picks.length));
cal.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
});
['dream-for-our-community', 'indigenous-innovators-spotlight', 'shamrock-shapes-hunt',
 'rangoli-pattern-art'].forEach(id =>
  ok(cal.picks.some(p => p.id === id), 'collection anchors on wave-24 pick: ' + id));

// 7. Thin spots moved: age 3 coverage and music-rhythm.
const age3 = acts.filter(a => a.age_min <= 3).length;
ok(age3 >= 11, 'age-3 coverage 8 -> >=11', String(age3));
ok(byId['scarf-dance-patterns'].categories[0] === 'music-rhythm', 'scarf dance is music-rhythm primary');

// 8. Feeds expanded for the Scout.
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds', String(feeds.length));
['littlebins', 'kidsactivitiesblog', 'buggyandbuddy'].forEach(id =>
  ok(feeds.some(f => f.id === id), 'feed present: ' + id));

console.log('test-wave24: ' + passed + ' assertions pass');
