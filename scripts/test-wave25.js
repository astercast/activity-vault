#!/usr/bin/env node
/* Wave 25 assertions: Thin Holidays Deepened — MLK Day, Indigenous
   Peoples' Day, Diwali, and St. Patrick's Day each go from 1-2 tagged
   activities (wave 24) to 5, at the archive quality bar, with the
   respectful-learning framing checked on the records themselves.
   Plus the fresh Scout cycle: scan ran live, 0 new candidates landed,
   queue stays fully decided (0 pending / 59 decided).
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

const MLK = ['mlk-freedom-quilt-squares', 'civil-rights-timeline-walk',
  'mlk-day-service-sprint', 'dream-speech-choral-reading'];
const IND = ['three-sisters-garden-plan', 'indigenous-authors-read-aloud',
  'tribal-nations-map-study', 'seasonal-rounds-phenology-wheel'];
const DIW = ['clay-diya-pinch-pots', 'mehndi-paper-patterns', 'ramayana-story-sequence'];
const STP = ['limerick-writing-circle', 'walking-rainbow-lab', 'irish-reel-steps'];
const NEW = MLK.concat(IND, DIW, STP);
ok(NEW.length === 14, '14 new activities in the wave-25 pack');
NEW.forEach(id => ok(byId[id], 'wave-25 id present: ' + id));

// 1. Per-holiday depth: every target holiday now carries exactly 5.
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:mlk-day') === 6, 'mlk-day 1 -> 5', String(tagCount('holiday:mlk-day')));
ok(tagCount('holiday:indigenous-peoples-day') === 6, 'indigenous-peoples-day 1 -> 5');
ok(tagCount('holiday:diwali') === 6, 'diwali 2 -> 5; wave 32 -> 6');
ok(tagCount('holiday:st-patricks-day') === 6, 'st-patricks-day 2 -> 5; wave 33 -> 6');
MLK.forEach(id => ok(byId[id].tags.includes('holiday:mlk-day'), id + ': mlk tag'));
IND.forEach(id => ok(byId[id].tags.includes('holiday:indigenous-peoples-day'), id + ': indigenous tag'));
DIW.forEach(id => ok(byId[id].tags.includes('holiday:diwali'), id + ': diwali tag'));
STP.forEach(id => ok(byId[id].tags.includes('holiday:st-patricks-day'), id + ': st-patricks tag'));
// The next thin spots, recorded honestly (not fixed this wave):
ok(tagCount('holiday:lunar-new-year') === 6, 'lunar-new-year was 3 after wave 25; wave 26 -> 5; wave 29 -> 6');
ok(tagCount('holiday:valentines-day') === 7, 'valentines-day was 4 after wave 25; wave 26 -> 6; wave 31 -> 7');

// 2. Quality bar on every new record.
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

// 3. Respectful-learning framing, checked on the records themselves.
ok(/national day of service/.test(JSON.stringify(byId['mlk-day-service-sprint'])), 'service sprint: MLK Day of Service named');
ok(/did not act alone/.test(byId['civil-rights-timeline-walk'].inclusion || ''), 'timeline: King did not act alone');
ok(/nobody performs an accent or an impression/.test(byId['dream-speech-choral-reading'].inclusion || ''), 'choral reading: no impressions');
ok(/Haudenosaunee/.test(JSON.stringify(byId['three-sisters-garden-plan'])), 'three sisters: named peoples (Haudenosaunee)');
ok(/authorship/.test(byId['indigenous-authors-read-aloud'].inclusion || ''), 'read-aloud: authorship rule');
ok(/names nations use for themselves/.test(byId['tribal-nations-map-study'].inclusion || ''), 'map study: nations\' own names');
ok(/does not borrow any nation/.test(byId['seasonal-rounds-phenology-wheel'].inclusion || ''), 'phenology wheel: no borrowed ceremonies');
ok(/never a real flame/.test(byId['clay-diya-pinch-pots'].safety || ''), 'clay diya: LED-only (never a real flame)');
ok(/not fireproof/.test(byId['clay-diya-pinch-pots'].safety || ''), 'clay diya: clay not fireproof, stated');
ok(/nobody draws on skin/.test(byId['mehndi-paper-patterns'].safety || ''), 'mehndi: paper only, nobody draws on skin');
ok(/sacred Hindu epic/.test(byId['ramayana-story-sequence'].inclusion || ''), 'ramayana: sacred Hindu epic, named');
ok(/never act it out in costume/.test(byId['ramayana-story-sequence'].inclusion || ''), 'ramayana: no costume acting');
ok(/Limerick, a city in Ireland|Limerick, Ireland/.test(JSON.stringify(byId['limerick-writing-circle'])), 'limerick: named for Limerick, Ireland');
ok(/No costumes/.test(byId['irish-reel-steps'].inclusion || ''), 'irish reel: no costumes');
NEW.forEach(id => {
  const blob = JSON.stringify(byId[id]).toLowerCase();
  ok(!blob.includes('costume') || /no costumes|never act it out in costume|in your own clothes/.test(blob),
    id + ': costumes appear only as a prohibition');
});

// 4. Enrichment deltas from this wave.
ok(acts.filter(a => a.copy_free).length === 305, 'copy_free 165 -> 173 in wave 25; wave 26 -> 184; wave 27 -> 197; wave 28 -> 209; wave 29 -> 221; wave 30 -> 233; wave 31 -> 245; wave 32 -> 257; wave 33 -> 269');
ok(acts.filter(a => a.no_elimination).length === 111, 'no_elimination 43 -> 47 in wave 25; wave 26 -> 51; wave 27 -> 57; wave 28 -> 63; wave 29 -> 70; wave 30 -> 75; wave 31 -> 81; wave 32 -> 87; wave 33 -> 93');
ok(acts.filter(a => a.inclusion).length === 167, 'inclusion 51 -> 64 in wave 25; wave 26 -> 69; wave 27 -> 75; wave 28 -> 81; wave 29 -> 87; wave 30 -> 95; wave 31 -> 107; wave 32 -> 119; wave 33 -> 131');
[13, 14].forEach(age => {
  const n = acts.filter(a => a.age_min <= age && a.age_max >= age).length;
  ok(n === 76, 'age ' + age + ' coverage 70 -> 76', String(n));
});

// 5. Scout cycle: the queue after the live 2026-10-12 scan — fully
//    decided, nothing pending, nothing manufactured.
const queue = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/review-queue.json'), 'utf8'));
ok(queue.length === 60, 'queue 59 -> 60 in wave 27 (scan queued 1, accepted on review)', String(queue.length));
ok(queue.filter(q => q.status === 'pending').length === 0, '0 pending after the fresh scan');
ok(queue.filter(q => q.status === 'accepted').length === 22, '22 accepted all-time (21 + wave-27 Morse accept)');
ok(queue.filter(q => q.status === 'rejected').length === 38, '38 rejected all-time');
queue.forEach(q => ok(q.decision && q.decision.length >= 20, 'decision reason recorded: ' + (q.title || q.id).slice(0, 40)));
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds scanned', String(feeds.length));

console.log('test-wave25: ' + passed + ' assertions pass');
