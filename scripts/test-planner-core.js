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
check('bucketFor total coverage (326)', weird.length === 0, weird.length + ' uncovered');

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

// 10. encode/decode + validatePlanData (v2 payload; v1 imports wrap as week 1)
var rec = P.savedPlanRecord('My plan', Object.assign({ programType: 'after-school', ageBand: 'g3-5' }, opts),
  [{ weekNum: 1, days: w1.days }]);
check('plan record: v2 shape', rec.version === 2 && rec.weeks.length === 1 && rec.weeks[0].days.length === 5);
var b64 = P.encodePlan(rec);
var back = P.validatePlanData(P.decodePlan(b64), byId);
check('plan share: round-trip', back.name === 'My plan' && back.weeks.length === 1 && back.weeks[0].days.length === 5);
check('plan share: slots survive', back.weeks[0].days[0].slots.length === 2 &&
      back.weeks[0].days[0].slots[0].activityId === w1.days[0].slots[0].activityId);
var dirty = P.validatePlanData({ version: 1, days: [{ day: 'Monday', slots: [{ slot: 1, activityId: 'nope-not-real' }] }] }, byId);
check('plan import: v1 payload wraps as week 1', dirty.weeks.length === 1 && dirty.weeks[0].weekNum === 1);
check('plan import: unknown ids dropped', dirty.dropped.length === 1 && dirty.weeks[0].days[0].slots[0].activityId === null);
var badDay = P.validatePlanData({ days: [{ day: 'Funday', slots: [] }] }, byId);
check('plan import: bad day names dropped', badDay.weeks[0].days.length === 0);

// 11. presets + bands
check('program: camp defaults', P.PROGRAMS.camp.slotsPerDay === 3 && P.PROGRAMS.camp.maxTime === 45);
check('program: classroom indoor', P.PROGRAMS.classroom.indoorOnly === true);
check('band: g3-5 range', P.AGE_BANDS['g3-5'].min === 8 && P.AGE_BANDS['g3-5'].max === 11);

// 12. buildMultiWeek (3.0)
var mopts = Object.assign({}, opts, { weeks: 2 });
var mw1 = P.buildMultiWeek(activities, mopts, catBucket, 42);
var mw2 = P.buildMultiWeek(activities, mopts, catBucket, 42);
check('multiweek: 2 weeks', mw1.weeks.length === 2 && mw1.weeks[0].weekNum === 1 && mw1.weeks[1].weekNum === 2);
var mids = [];
mw1.weeks.forEach(function (w) {
  w.days.forEach(function (d) {
    d.slots.forEach(function (s) { if (s.activityId) mids.push(s.activityId); });
  });
});
check('multiweek: 20 slots filled', mids.length === 20, mids.length + ' slots');
check('multiweek: no repeats across weeks', new Set(mids).size === mids.length);
check('multiweek: deterministic', JSON.stringify(mw1) === JSON.stringify(mw2));
check('multiweek: weeks clamped to 4', P.buildMultiWeek(activities, Object.assign({}, opts, { weeks: 9 }), catBucket, 42).weeks.length === 4);
check('multiweek: weeks default 1', P.buildMultiWeek(activities, opts, catBucket, 42).weeks.length === 1);
check('clampWeeks guards', P.clampWeeks(0) === 1 && P.clampWeeks('x') === 1 && P.clampWeeks(3) === 3 && P.clampWeeks(9) === 4);
var mseed = P.buildMultiWeek(activities, Object.assign({}, mopts, { seedIds: ['freeze-dance', 'charades'] }), catBucket, 42);
function countSeeds(week) {
  var n = 0;
  week.days.forEach(function (d) {
    d.slots.forEach(function (s) {
      if (s.activityId === 'freeze-dance' || s.activityId === 'charades') n++;
    });
  });
  return n;
}
check('multiweek: seeds land in week 1 only', countSeeds(mseed.weeks[0]) === 2 && countSeeds(mseed.weeks[1]) === 0);

// 13. brainBreak (3.0)
var usedAll = {};
mids.forEach(function (id) { usedAll[id] = true; });
var bb1 = P.brainBreak(pool, usedAll, byId, catBucket, 99);
check('brainBreak: movement + runs cold <=10 min',
  !!bb1 && P.bucketFor(byId[bb1], catBucket) === 'movement' && byId[bb1].time_min <= 10, bb1);
check('brainBreak: not already scheduled', !!bb1 && !usedAll[bb1]);
check('brainBreak: deterministic', P.brainBreak(pool, usedAll, byId, catBucket, 99) === bb1);
var allUsed = {};
pool.forEach(function (a) { allUsed[a.id] = true; });
check('brainBreak: null when everything is scheduled', P.brainBreak(pool, allUsed, byId, catBucket, 1) === null);

// 14. weatherBackupFor (3.0)
var outdoorPick = pool.filter(function (a) { return P.needsWeatherBackup(a); })[0];
check('weather: pool has outdoor-only picks', !!outdoorPick, outdoorPick && outdoorPick.id);
var indoorPick = pool.filter(function (a) { return !P.needsWeatherBackup(a); })[0];
check('weather: indoor pick needs no backup', !!indoorPick && !P.needsWeatherBackup(indoorPick));
var wb1 = P.weatherBackupFor(outdoorPick, pool, {}, byId, catBucket, g35, 5);
check('weather: backup is indoor + real',
  !!wb1 && byId[wb1].location.indexOf('indoor') !== -1, wb1);
check('weather: backup is not the slot itself', !!wb1 && wb1 !== outdoorPick.id);
var wbu = {}; wbu[wb1] = true;
var wb2 = P.weatherBackupFor(outdoorPick, pool, wbu, byId, catBucket, g35, 5);
check('weather: backup skips used ids', !!wb2 && wb2 !== wb1, wb2);
check('weather: deterministic', P.weatherBackupFor(outdoorPick, pool, {}, byId, catBucket, g35, 5) === wb1);
check('weather: null for indoor activity', P.weatherBackupFor(indoorPick, pool, {}, byId, catBucket, g35, 5) === null);
check('weather: null when nothing fits', P.weatherBackupFor(outdoorPick, [], {}, byId, catBucket, g35, 5) === null);

// 15. subBackupFor (3.0)
var sb1 = P.subBackupFor(outdoorPick, pool, {}, byId, catBucket, g35, 6);
check('subkit: backup is no-prep', !!sb1 && byId[sb1].no_prep, sb1);
check('subkit: backup real + different', !!sb1 && sb1 !== outdoorPick.id && !!byId[sb1]);
check('subkit: backup prefers indoor', byId[sb1].location.indexOf('indoor') !== -1, byId[sb1].location.join(','));
check('subkit: deterministic', P.subBackupFor(outdoorPick, pool, {}, byId, catBucket, g35, 6) === sb1);
check('subkit: null when empty pool', P.subBackupFor(outdoorPick, [], {}, byId, catBucket, g35, 6) === null);

// 16. aggregateSupplies (3.0)
var sup = P.aggregateSupplies(mw1.weeks, byId);
check('supplies: non-empty', sup.length > 0, sup.length + ' groups');
check('supplies: sorted by count desc', sup.every(function (g, i) {
  return i === 0 || sup[i - 1].count >= g.count;
}));
check('supplies: dayLabels present', sup.every(function (g) { return g.dayLabels.length > 0; }));
check('supplies: counts match slots', sup.every(function (g) { return g.count === g.slots.length; }));
check('supplies: normalize strips parentheticals',
  P.normalizeSupplyItem('printer paper (a stack)') === 'printer paper');
check('supplies: normalize drops quantity words',
  P.normalizeSupplyItem('small apples (one per kid)') === 'small apples');
check('supplies: empty plan -> empty list', P.aggregateSupplies([], byId).length === 0);
var synthWeeks = [{ weekNum: 1, days: [
  { day: 'Monday', slots: [{ slot: 1, activityId: 'paper-airplane-challenge' }] },
  { day: 'Tuesday', slots: [{ slot: 1, activityId: 'paper-airplane-challenge' }] }
]}];
var ssup = P.aggregateSupplies(synthWeeks, byId);
var paper = ssup.filter(function (g) { return g.key === 'printer paper'; })[0];
check('supplies: same item across slots counted', !!paper && paper.count === 2 &&
  paper.dayLabels.join(',') === 'W1 Mon,W1 Tue', paper && (paper.count + ' / ' + paper.dayLabels.join(',')));
// the real library has multi-wording materials — key grouping must collapse them
var rawByKey = {};
activities.forEach(function (a) {
  (a.materials || []).forEach(function (m) {
    var k = P.normalizeSupplyItem(m.item);
    if (!k) return;
    (rawByKey[k] = rawByKey[k] || {})[m.item] = true;
  });
});
var multiWording = Object.keys(rawByKey).filter(function (k) { return Object.keys(rawByKey[k]).length > 1; });
check('supplies: library has multi-wording materials to collapse',
  multiWording.length > 0, multiWording.length + ' keys, e.g. ' + multiWording.slice(0, 2).join(' / '));

// 17. exportICS weekOffset (3.0)
var icsW2 = P.exportICS({ name: 'T', programType: 'after-school', maxTime: 30, days: mw1.weeks[1].days },
  byId, new Date(2026, 9, 11, 12, 0, 0), 1);
check('ics: weekOffset shifts +7 days', /DTSTART:20261019T150000/.test(icsW2));
check('ics: weekOffset labels summary', /week 2/.test(icsW2));
check('ics: weekOffset UID carries -w1', /-w1@activityvault/.test(icsW2));
var icsW0 = P.exportICS({ name: 'T', programType: 'after-school', maxTime: 30, days: mw1.weeks[0].days },
  byId, new Date(2026, 9, 11, 12, 0, 0), 0);
check('ics: week 0 UID format unchanged', /UID:av-[A-Za-z0-9-]+-\d{8}T\d{6}-\d+@activityvault/.test(icsW0));

// 18. planText multi-week (3.0)
var txt = P.planText({ name: 'T', weeks: mw1.weeks }, byId, function (c) { return c; }, null);
check('planText: WEEK headers', /WEEK 1 of 2/.test(txt) && /WEEK 2 of 2/.test(txt));
var txt1 = P.planText({ name: 'T', days: mw1.weeks[0].days }, byId, function (c) { return c; }, null);
check('planText: v1 days still work', !/WEEK 1 of/.test(txt1) && /Monday/.test(txt1));

// 19. multi-week share round-trip (3.0)
var wrec = P.savedPlanRecord('Two weeks', Object.assign({ programType: 'camp', ageBand: 'g3-5' }, mopts), mw1.weeks);
var wback = P.validatePlanData(P.decodePlan(P.encodePlan(wrec)), byId);
check('plan share: multi-week round-trip',
  wback.name === 'Two weeks' && wback.weeks.length === 2 &&
  wback.weeks[1].days[0].slots[0].activityId === mw1.weeks[1].days[0].slots[0].activityId);

// 20. DOM id cross-check: every getElementById in planner.js exists in planner.html,
//    or is created dynamically by planner.js itself (el.id = '...').
var fs = require('fs');
var html = fs.readFileSync(path.join(ROOT, 'planner.html'), 'utf8');
var pjs = fs.readFileSync(path.join(ROOT, 'assets', 'planner.js'), 'utf8');
var idSet = {};
var re = /getElementById\('([^']+)'\)/g, mm;
while ((mm = re.exec(pjs))) idSet[mm[1]] = true;
var dynSet = {};
var re2 = /\.id\s*=\s*'([^']+)'/g, mm2;
while ((mm2 = re2.exec(pjs))) dynSet[mm2[1]] = true;
var idList = Object.keys(idSet);
var missing = idList.filter(function (id) {
  return !dynSet[id] && html.indexOf('id="' + id + '"') === -1;
});
check('dom: all planner.js getElementById ids exist in planner.html',
  missing.length === 0, missing.join(', ') || (idList.length + ' ids checked'));

console.log();
if (failures.length) {
  console.log('FAILURES:', failures);
  process.exit(1);
}
console.log('ALL PLANNER-CORE CHECKS PASSED');
