#!/usr/bin/env node
/* Wave 33 flagship assertions: the Day Planner — compose one
   whole day (arrival, morning meeting, centers, outdoor,
   closing) from the real catalog, filtered by the room's age
   and each slot's minutes using the real age_min/age_max/
   time_min fields, with honest empty states, a printable day
   sheet, and the "Just Three" starter day pre-composed ONLY
   from records banded 3-only. Pure-core tests against
   assets/dayplanner-core.js plus wiring checks on day.html /
   assets/dayplanner.js / the print stylesheet. Run after
   scripts/build.py. Exits non-zero on first failure. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(path.dirname(path.resolve(__filename)));
const DP = require(path.join(ROOT, 'assets/dayplanner-core.js'));

let passed = 0;
function ok(cond, label, extra) {
  if (!cond) { console.error('FAIL: ' + label + (extra ? ' — ' + extra : '')); process.exit(1); }
  passed++;
}

const acts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/activities.json'), 'utf8'));
const byId = {};
acts.forEach(a => { byId[a.id] = a; });
const cats = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/categories.json'), 'utf8'));
const catName = id => (cats.find(c => c.id === id) || {}).name || id;

// 1. The day's shape: five slots, in a real day's order.
ok(DP.DAY_SLOTS.length === 5, 'five day slots');
ok(DP.DAY_SLOTS.map(s => s.id).join(',') === 'arrival,morning-meeting,centers,outdoor,closing',
  'slots in day order: arrival, morning meeting, centers, outdoor, closing');
DP.DAY_SLOTS.forEach(s => {
  ok(s.label && s.glyph && s.clock && s.hint && s.hint.length >= 30, 'slot is fully described: ' + s.id);
  ok(Array.isArray(s.cats) && s.cats.length >= 1, 'slot names its categories: ' + s.id);
  s.cats.forEach(c => ok(cats.some(x => x.id === c), 'slot category is real: ' + s.id + ' -> ' + c));
  ok(s.maxMinutes >= 15 && s.maxMinutes <= 45, 'slot minutes are a real slot budget: ' + s.id);
});
ok(DP.slotById('outdoor').outdoorOnly === true, 'the outdoor slot demands a real outdoor activity');

// 2. fitsAge reads the real band fields — a 3-only record serves
//    age 3 and nobody else.
ok(DP.fitsAge(byId['big-zip-up-down-board'], 3) === true, '3-only record fits age 3');
ok(DP.fitsAge(byId['big-zip-up-down-board'], 4) === false, '3-only record does NOT fit age 4');
ok(DP.fitsAge(byId['morse-code-signal-post'], 3) === false, 'older record does not fit age 3');
ok(DP.fitsAge(byId['morse-code-signal-post'], 9) === true, 'older record fits inside its band');

// 3. Slot pools are honest at every age the page offers.
[3, 4, 5, 6, 7, 8, 9, 10].forEach(age => {
  DP.DAY_SLOTS.forEach(slot => {
    const pool = DP.slotPool(acts, slot, { age });
    ok(pool.length >= 3, 'slot pool is real at age ' + age + ': ' + slot.id, String(pool.length));
    pool.forEach(a => {
      ok(DP.fitsAge(a, age), 'pool pick covers the age: ' + a.id);
      ok(a.time_min <= slot.maxMinutes, 'pool pick starts inside the slot budget: ' + a.id);
      ok(a.categories.some(c => slot.cats.indexOf(c) !== -1), 'pool pick belongs to the slot: ' + a.id);
      if (slot.outdoorOnly) ok(a.location.indexOf('outdoor') !== -1, 'outdoor pick is really outdoor: ' + a.id);
    });
  });
});
// Used ids are excluded — a day never repeats an activity.
{
  const slot = DP.slotById('centers');
  const pool = DP.slotPool(acts, slot, { age: 5 });
  const first = pool[0].id;
  const pool2 = DP.slotPool(acts, slot, { age: 5, used: { [first]: true } });
  ok(!pool2.some(a => a.id === first), 'used activity is excluded from the pool');
  ok(pool2.length === pool.length - 1, 'pool shrinks by exactly the used record');
}

// 4. composeDay: full, varied, reproducible, honest when empty.
{
  const d1 = DP.composeDay(acts, { age: 3, seed: 7 });
  const d2 = DP.composeDay(acts, { age: 3, seed: 7 });
  ok(JSON.stringify(d1) === JSON.stringify(d2), 'composeDay is deterministic for a seed');
  ok(d1.slots.length === 5, 'composed day has five slots');
  const ids = d1.slots.map(s => s.activityId).filter(Boolean);
  ok(ids.length === 5, 'composed day fills all five slots at age 3', ids.join(','));
  ok(new Set(ids).size === ids.length, 'composed day never repeats an activity');
  d1.slots.forEach(s => {
    const slot = DP.slotById(s.slot);
    const a = byId[s.activityId];
    ok(a && DP.fitsAge(a, 3), 'composed pick fits age 3: ' + s.slot);
    ok(a.time_min <= slot.maxMinutes, 'composed pick fits the slot minutes: ' + s.slot);
  });
  const d6 = DP.composeDay(acts, { age: 6, seed: 11 });
  ok(d6.slots.every(s => s.activityId), 'composed day fills all five slots at age 6');
  // Honest empty state: no catalog, no picks — never a stretched fit.
  const dEmpty = DP.composeDay([], { age: 3, seed: 1 });
  ok(dEmpty.slots.every(s => s.activityId === null), 'empty catalog composes an honestly empty day');
  const totalsEmpty = DP.dayTotals(dEmpty.slots, byId);
  ok(totalsEmpty.filled === 0 && totalsEmpty.minMinutes === 0, 'empty day totals are zero, not invented');
}

// 5. The Just Three starter day: every slot from a 3-only record.
{
  const st = DP.starterDay(acts);
  ok(st.age === 3 && /Just Three/.test(st.name), 'starter day is the Just Three day');
  ok(st.slots.length === 5, 'starter day has five slots');
  const ids = st.slots.map(s => s.activityId);
  ok(ids.every(Boolean), 'starter day fills every slot', ids.join(','));
  ok(new Set(ids).size === ids.length, 'starter day never repeats an activity');
  st.slots.forEach(s => {
    const a = byId[s.activityId];
    const slot = DP.slotById(s.slot);
    ok(DP.isThreeOnly(a), 'starter pick is banded 3-only: ' + s.slot + ' -> ' + s.activityId);
    ok(DP.slotPool([a], slot, { age: 3 }).length === 1, 'starter pick honestly fits its slot: ' + s.slot);
  });
  // The named anchors of the pre-composition are really in it.
  ok(ids.indexOf('name-echo-two-claps') !== -1, 'starter arrival is the name echo');
  ok(ids.indexOf('show-me-three-fingers') !== -1, 'starter morning meeting shows three fingers');
  ok(ids.indexOf('big-zip-up-down-board') !== -1, 'starter centers is the zip board');
  ok(ids.indexOf('grass-hill-roll-down') !== -1, 'starter outdoor is the grass hill roll');
  ok(ids.indexOf('one-shake-pass-around') !== -1, 'starter closing is one shake passed around');
  // With an empty catalog the starter is honestly empty too.
  ok(DP.starterDay([]).slots.every(s => s.activityId === null), 'starter on empty catalog is honestly empty');
}

// 6. Swap: cycles the honest pool, never lands on a used pick.
{
  const slot = DP.slotById('arrival');
  const day = DP.composeDay(acts, { age: 4, seed: 3 });
  const cur = day.slots[0].activityId;
  const others = day.slots.slice(1).map(s => s.activityId);
  const nxt = DP.swapCandidate(acts, slot, cur, others, 4);
  ok(nxt && nxt !== cur, 'swap returns a different activity');
  ok(others.indexOf(nxt) === -1, 'swap never duplicates another slot');
  ok(DP.fitsAge(byId[nxt], 4), 'swap pick fits the age');
  const nxt2 = DP.swapCandidate(acts, slot, nxt, others, 4);
  ok(nxt2 && nxt2 !== nxt, 'a second swap moves on again');
  ok(DP.swapCandidate([], slot, cur, [], 4) === null, 'swap on empty catalog is null, honestly');
}

// 7. Totals + the text day sheet read the real fields.
{
  const st = DP.starterDay(acts);
  const t = DP.dayTotals(st.slots, byId);
  ok(t.filled === 5 && t.total === 5, 'starter totals: 5 of 5 filled');
  ok(t.minMinutes === st.slots.reduce((n, s) => n + byId[s.activityId].time_min, 0), 'totals sum real time_min');
  ok(t.maxMinutes === st.slots.reduce((n, s) => n + byId[s.activityId].time_max, 0), 'totals sum real time_max');
  const text = DP.daySheetText({ title: 'Just Three Starter Day', dateLabel: 'Monday', age: 3, slots: st.slots }, byId, catName);
  ok(/Just Three Starter Day/.test(text), 'day sheet text carries the title');
  ok(/Room age: 3/.test(text), 'day sheet text carries the room age');
  DP.DAY_SLOTS.forEach(slot => ok(text.indexOf(slot.label) !== -1, 'day sheet text has the slot: ' + slot.id));
  st.slots.forEach(s => ok(text.indexOf(byId[s.activityId].name) !== -1, 'day sheet text names the pick: ' + s.activityId));
  const openText = DP.daySheetText({ title: 'X', age: 3, slots: DP.composeDay([], { age: 3 }).slots }, byId, catName);
  ok(/open slot/.test(openText), 'day sheet text marks open slots honestly');
}

// 8. Wiring: the page, the DOM layer, the print sheet, the links.
{
  const html = fs.readFileSync(path.join(ROOT, 'day.html'), 'utf8');
  ok(/Day Planner/.test(html), 'day.html exists and is the Day Planner');
  ok(html.indexOf('assets/dayplanner-core.js') !== -1, 'day.html loads the day planner core');
  ok(html.indexOf('assets/dayplanner.js') !== -1, 'day.html loads the day planner logic');
  ok(html.indexOf('id="day-sheet"') !== -1, 'day.html has the printable day sheet');
  ok(html.indexOf('id="dp-starter"') !== -1, 'day.html offers the Just Three starter day');
  ok(html.indexOf('id="dp-print"') !== -1, 'day.html has the print action');
  ok(html.indexOf('723 real activities') !== -1, 'day.html cites the true catalog size');
  const js = fs.readFileSync(path.join(ROOT, 'assets/dayplanner.js'), 'utf8');
  ok(js.indexOf('VaultDayPlanner') !== -1, 'day logic runs on the pure core');
  ok(js.indexOf('data/activities.json') !== -1, 'day logic reads the real catalog file');
  const css = fs.readFileSync(path.join(ROOT, 'assets/style.css'), 'utf8');
  ok(css.indexOf('.day-sheet') !== -1, 'stylesheet styles the day sheet');
  ok(/@media print[\s\S]*?\.day-sheet/.test(css), 'print stylesheet covers the day sheet');
  const planner = fs.readFileSync(path.join(ROOT, 'planner.html'), 'utf8');
  ok(planner.indexOf('day.html') !== -1, 'week planner links the Day Planner');
  DP.DAY_SLOTS.forEach(s => {
  });
  const st = DP.starterDay(acts);
  st.slots.forEach(s => ok(fs.existsSync(path.join(ROOT, 'activity', s.activityId + '.html')),
    'starter pick page rendered: ' + s.activityId));
}

console.log('test-dayplanner: ' + passed + ' assertions pass');
