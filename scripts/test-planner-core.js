#!/usr/bin/env node
/* Wave 10: headless assertions for assets/planner-core.js (pure functions).
   Usage: node scripts/test-planner-core.js   (exit non-zero on failure) */
'use strict';
var path = require('path');
var ROOT = path.join(__dirname, '..');
var P = require('../assets/planner-core.js');
var activities = require(path.join(ROOT, 'data', 'activities.json'));
var bucketData = require(path.join(ROOT, 'data', 'balance-buckets.json'));
var categories = require(path.join(ROOT, 'data', 'categories.json'));

var failures = [];
function check(name, cond, detail) {
  console.log((cond ? 'PASS' : 'FAIL') + ' ' + name + (detail ? ' — ' + detail : ''));
  if (!cond) failures.push(name);
}

var byId = {};
activities.forEach(function (a) { byId[a.id] = a; });
var catBucket = P.buildCatBucket(bucketData.mapping);
var catIds = categories.map(function (c) { return c.id; });

// 1. bucket mapping covers every category, fixed vocabulary
check('mapping covers all 11 categories', catIds.every(function (c) { return catBucket[c]; }));
check('bucket vocab fixed', bucketData.mapping.every(function (r) {
  return P.BUCKET_IDS.indexOf(r.bucket) !== -1;
}));

// 2. filterPool semantics
var g35 = { ageMin: 8, ageMax: 11, maxTime: 30, cats: [], noPrepOnly: false, indoorOnly: false };
var pool = P.filterPool(activities, g35);
check('pool non-empty', pool.length > 10, pool.length + ' activities');
check('pool: age overlap', pool.every(function (a) { return a.age_min <= 11 && a.age_max >= 8; }));
check('pool: time floor', pool.every(function (a) { return a.time_min <= 30; }));
var np = P.filterPool(activities, Object.assign({}, g35, { noPrepOnly: true }));
check('pool: no_prep gate', np.every(function (a) { return a.no_prep; }));
var ind = P.filterPool(activities, Object.assign({}, g35, { indoorOnly: true }));
check('pool: indoor gate', ind.every(function (a) { return a.location.indexOf('indoor') !== -1; }));
var cr = P.filterPool(activities, Object.assign({}, g35, { cats: ['crafts'] }));
check('pool: category gate', cr.every(function (a) { return a.categories.indexOf('crafts') !== -1; }));

// 3. buildWeek: constraints, no repeats, prep cap, determinism
var opts = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  slotsPerDay: 2, ageMin: 8, ageMax: 11, maxTime: 30, cats: [],
  noPrepOnly: false, indoorOnly: false, allowRepeats: false, maxPrepHeavy: 2
};
var w1 = P.buildWeek(activities, opts, catBucket, 42);
var w2 = P.buildWeek(activities, opts, catBucket, 42);
var ids1 = [], slots1 = 0, prep1 = 0;
w1.days.forEach(function (d) {
  d.slots.forEach(function (s) {
    slots1++;
    if (!s.activityId) return;
    ids1.push(s.activityId);
    if (!byId[s.activityId].no_prep) prep1++;
  });
});
check('week: 10 slots', slots1 === 10, slots1 + ' slots');
check('week: no repeats', new Set(ids1).size === ids1.length);
check('week: all ids real', ids1.every(function (id) { return !!byId[id]; }));
check('week: maxTime respected', ids1.every(function (id) { return byId[id].time_min <= 30; }));
check('week: prep cap respected', prep1 <= 2, prep1 + ' prep-heavy');
check('week: deterministic seed', JSON.stringify(w1.days) === JSON.stringify(w2.days));
var w3 = P.buildWeek(activities, opts, catBucket, 43);
check('week: different seed varies', JSON.stringify(w1.days) !== JSON.stringify(w3.days));

// 4. buildWeek seeded from a collection id list
var seedOpts = Object.assign({}, opts, { seedIds: ['freeze-dance', 'charades', 'bogus-id-xyz'] });
var ws = P.buildWeek(activities, seedOpts, catBucket, 42);
var seeded = [];
ws.days.forEach(function (d) {
  d.slots.forEach(function (s) {
    if (s.activityId === 'freeze-dance' || s.activityId === 'charades') seeded.push(s.activityId);
  });
});
check('week: collection seeds placed', seeded.length === 2, seeded.join(','));
check('week: bogus seed dropped', ws.seedSkipped === 1, 'skipped=' + ws.seedSkipped);

// 5. balanceOf math + bucketFor primary-category rule
var sampleDay = [{ slot: 1, activityId: 'freeze-dance' }, { slot: 2, activityId: 'paper-airplane-challenge' }];
var bal = P.balanceOf(sampleDay, byId, catBucket);
var sum = P.BUCKET_IDS.reduce(function (n, b) { return n + bal.counts[b]; }, 0);
check('balance: counts sum to filled slots', bal.total === 2 && sum === 2);
check('bucketFor uses primary category', P.bucketFor(byId['freeze-dance'], catBucket) === 'movement');
// every activity resolves to a real bucket
var weird = activities.filter(function (a) {
  return P.BUCKET_IDS.indexOf(P.bucketFor(a, catBucket)) === -1;
});
check('bucketFor total coverage (238)', weird.length === 0, weird.length + ' uncovered');

// 6. dayWarnings
var moveHeavy = activities.filter(function (a) {
  return P.bucketFor(a, catBucket) === 'movement' && a.time_min <= 30 &&
         a.age_min <= 11 && a.age_max >= 8;
}).slice(0, 3);
var heavyDay = moveHeavy.map(function (a, i) { return { slot: i + 1, activityId: a.id }; });
var hw = P.dayWarnings(P.balanceOf(heavyDay, byId, catBucket), 'Monday');
check('warnings: movement-heavy day warns', hw.length >= 1 && /lands softly/.test(hw[0]), hw[0] || '(none)');
var calmHeavy = activities.filter(function (a) {
  return P.bucketFor(a, catBucket) === 'calm' && a.time_min <= 30 &&
         a.age_min <= 11 && a.age_max >= 8;
}).slice(0, 3);
var cw = P.dayWarnings(P.balanceOf(
  calmHeavy.map(function (a, i) { return { slot: i + 1, activityId: a.id }; }), byId, catBucket), 'Tuesday');
check('warnings: calm-heavy day warns', cw.length >= 1 && /sleepy/.test(cw[0]), cw[0] || '(none)');
var mixedDay = [
  { slot: 1, activityId: moveHeavy[0].id },
  { slot: 2, activityId: calmHeavy[0].id }
];
check('warnings: balanced day quiet', P.dayWarnings(P.balanceOf(mixedDay, byId, catBucket), 'Wed').length === 0);
var noCalm3 = moveHeavy.concat(calmHeavy.slice(0, 0)).slice(0, 3)
  .map(function (a, i) { return { slot: i + 1, activityId: a.id }; });
var ncl = P.dayWarnings(P.balanceOf(noCalm3, byId, catBucket), 'Thursday');
check('warnings: 3-slot day with no calm warns', ncl.some(function (w) { return /no calm slot/.test(w); }));

// 7. swapCandidate
var swapPool = P.filterPool(activities, g35);
var swapOpts = Object.assign({}, g35, { allowRepeats: false, maxPrepHeavy: 2 });
var newId = P.swapCandidate(swapPool, w1.days, 0, 0, byId, catBucket, swapOpts);
var oldId = w1.days[0].slots[0].activityId;
check('swap: returns a different real id', newId && newId !== oldId && !!byId[newId], newId);
var allIds = new Set(); w1.days.forEach(function (d) {
  d.slots.forEach(function (s) { if (s.activityId) allIds.add(s.activityId); });
});
check('swap: no repeat of used ids', !allIds.has(newId) || swapOpts.allowRepeats);
// exhausted pool -> null
var tiny = P.swapCandidate([byId[oldId]], w1.days, 0, 0, byId, catBucket, swapOpts);
check('swap: null when nothing fits', tiny === null);

// 8. fillGaps
var gappy = w1.days.map(function (d, di) {
  return { day: d.day, slots: d.slots.map(function (s, si) {
    return { slot: s.slot, activityId: (di === 0 && si === 0) ? null : s.activityId };
  }) };
});
P.fillGaps(gappy, swapPool, byId, catBucket, swapOpts, 7);
var filledIds = [];
gappy.forEach(function (d) {
  d.slots.forEach(function (s) { if (s.activityId) filledIds.push(s.activityId); });
});
check('fillGaps: gap filled', filledIds.length === ids1.length);
check('fillGaps: no repeats', new Set(filledIds).size === filledIds.length);

// 9. exportICS
var icsPlan = { name: 'Test week', programType: 'after-school', maxTime: 30, days: w1.days };
var ics = P.exportICS(icsPlan, byId, new Date(2026, 9, 11, 12, 0, 0)); // Sun Oct 11 2026
check('ics: VCALENDAR envelope', /^BEGIN:VCALENDAR/.test(ics) && /END:VCALENDAR\r?\n$/.test(ics));
var vevents = (ics.match(/BEGIN:VEVENT/g) || []).length;
check('ics: one VEVENT per filled slot', vevents === ids1.length, vevents + ' events');
check('ics: DTSTART floating format', /DTSTART:\d{8}T\d{6}/.test(ics));
check('ics: DURATION present', /DURATION:PT\d+M/.test(ics));
check('ics: Monday lands on 20261012', /DTSTART:20261012T150000/.test(ics));
check('ics: line endings CRLF', ics.indexOf('\r\n') !== -1);

// 10. encode/decode + validatePlanData
var rec = P.savedPlanRecord('My plan', Object.assign({ programType: 'after-school', ageBand: 'g3-5' }, opts), w1.days);
var b64 = P.encodePlan(rec);
var back = P.validatePlanData(P.decodePlan(b64), byId);
check('plan share: round-trip', back.name === 'My plan' && back.days.length === 5);
check('plan share: slots survive', back.days[0].slots.length === 2 &&
      back.days[0].slots[0].activityId === w1.days[0].slots[0].activityId);
var dirty = P.validatePlanData({ days: [{ day: 'Monday', slots: [{ slot: 1, activityId: 'nope-not-real' }] }] }, byId);
check('plan import: unknown ids dropped', dirty.dropped.length === 1 && dirty.days[0].slots[0].activityId === null);
var badDay = P.validatePlanData({ days: [{ day: 'Funday', slots: [] }] }, byId);
check('plan import: bad day names dropped', badDay.days.length === 0);

// 11. presets + bands
check('program: camp defaults', P.PROGRAMS.camp.slotsPerDay === 3 && P.PROGRAMS.camp.maxTime === 45);
check('program: classroom indoor', P.PROGRAMS.classroom.indoorOnly === true);
check('band: g3-5 range', P.AGE_BANDS['g3-5'].min === 8 && P.AGE_BANDS['g3-5'].max === 11);

console.log();
if (failures.length) {
  console.log('FAILURES:', failures);
  process.exit(1);
}
console.log('ALL PLANNER-CORE CHECKS PASSED');
