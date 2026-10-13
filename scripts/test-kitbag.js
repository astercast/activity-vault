#!/usr/bin/env node
/* Wave 34 flagship assertions: The Kit Bag — pack one rainy
   day indoors (the setting the catalog genuinely serves: a real
   rainy-day category, a real indoor location field, a real
   rainy-day collection) and compose a printable kit list from
   the REAL materials fields of the activities it selects.
   Scenario rules never loosen (rainy-day category + indoor
   location + the real age band); role categories are a
   preference ladder only. The bag's aggregation is asserted
   for provenance: every raw material string lands in exactly
   one line, quantities stay exactly as the activities state
   them (verbatim variants), shared items merge once with every
   requesting activity named, and no line exists that no
   activity asked for. Pure-core tests against
   assets/kitbag-core.js plus wiring checks on kitbag.html /
   assets/kitbag.js / the print stylesheet. Run after
   scripts/build.py. Exits non-zero on first failure. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(path.dirname(path.resolve(__filename)));
const KB = require(path.join(ROOT, 'assets/kitbag-core.js'));

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

// 1. The scenario and the day's shape: rainy-day indoor, five roles in order.
ok(KB.SCENARIO.id === 'rainy-day-indoor', 'the scenario is rainy-day indoor — a shelf the catalog really has');
ok(KB.SCENARIO.name === 'Rainy-Day Indoor', 'scenario named');
ok(KB.BAG_SLOTS.length === 5, 'five roles in the bag day');
ok(KB.BAG_SLOTS.map(s => s.id).join(',') === 'burn-off,making-table,big-group,quiet-table,calm-close',
  'roles in day order: burn-off, making table, big group, quiet table, calm close');
KB.BAG_SLOTS.forEach(s => {
  ok(s.label && s.glyph && s.clock && s.hint && s.hint.length >= 30, 'role is fully described: ' + s.id);
  ok(Array.isArray(s.cats) && s.cats.length >= 1, 'role names preferred categories: ' + s.id);
  s.cats.forEach(c => ok(cats.some(x => x.id === c), 'role category is real: ' + s.id + ' -> ' + c));
});
ok(KB.GROUPS.map(g => g.id).join(',') === 'consumables,equipment,print',
  'the three groups, in pack order: consumables, equipment, print-at-desk');

// 2. fitsScenario reads the real fields — and never loosens.
ok(KB.fitsScenario(byId['umbrella-drip-count-listen'], 3) === true, 'wave-34 rainy 3-only record fits age 3');
ok(KB.fitsScenario(byId['umbrella-drip-count-listen'], 4) === false, 'a 3-only record does NOT fit age 4');
ok(KB.fitsScenario(byId['grass-hill-roll-down'], 3) === false, 'an outdoor-only record does not fit an indoor bag');
ok(KB.fitsScenario(byId['paper-airplane-challenge'], 8) === false, 'a non-rainy-day record does not fit the scenario');
ok(KB.fitsScenario(byId['freeze-dance'], 8) === true, 'a real rainy-day indoor record fits');

// 3. Pools are honest at every age the page offers.
[3, 4, 5, 6, 7, 8, 9, 10].forEach(age => {
  const pool = KB.scenarioPool(acts, { age });
  ok(pool.length >= 10, 'scenario pool is real at age ' + age, String(pool.length));
  pool.forEach(a => ok(KB.fitsScenario(a, age), 'pool pick fits the scenario: ' + a.id));
  KB.BAG_SLOTS.forEach(slot => {
    const sp = KB.slotPool(acts, slot, { age });
    ok(sp.length >= 1, 'role pool non-empty at age ' + age + ': ' + slot.id);
    sp.forEach(a => ok(KB.fitsScenario(a, age), 'role pick fits the scenario: ' + a.id));
  });
});
// The role ladder: a role with no preferred picks falls back to
// the whole honest scenario pool — and to nothing beyond it.
{
  const fakeSlot = { id: 'fake', cats: ['no-such-category'] };
  const fb = KB.slotPool(acts, fakeSlot, { age: 6 });
  ok(fb.length === KB.scenarioPool(acts, { age: 6 }).length, 'unknown role falls back to the full scenario pool, no further');
  const burn = KB.slotPool(acts, KB.slotById('burn-off'), { age: 6 });
  ok(burn.every(a => a.categories.some(c => KB.slotById('burn-off').cats.indexOf(c) !== -1)),
    'burn-off role pool is role-preferred while role picks exist');
}

// 4. composeBag: full, varied, reproducible, honest when empty.
{
  const b1 = KB.composeBag(acts, { age: 6, seed: 7 });
  const b2 = KB.composeBag(acts, { age: 6, seed: 7 });
  ok(JSON.stringify(b1) === JSON.stringify(b2), 'composeBag is deterministic for a seed');
  [3, 5, 6, 8, 10].forEach(age => {
    const bag = KB.composeBag(acts, { age, seed: 42 });
    const ids = bag.slots.map(s => s.activityId).filter(Boolean);
    ok(ids.length === 5, 'bag fills all five roles at age ' + age, ids.join(','));
    ok(new Set(ids).size === ids.length, 'bag never repeats an activity at age ' + age);
    bag.slots.forEach(s => ok(KB.fitsScenario(byId[s.activityId], age),
      'bag pick fits the scenario at age ' + age + ': ' + s.slot));
  });
  const bEmpty = KB.composeBag([], { age: 6, seed: 1 });
  ok(bEmpty.slots.every(s => s.activityId === null), 'empty catalog packs an honestly empty bag');
  const t = KB.bagTotals(KB.composeBag(acts, { age: 6, seed: 3 }).slots, byId);
  ok(t.filled === 5 && t.minMinutes > 0 && t.maxMinutes >= t.minMinutes, 'bag totals read the real time fields');
}

// 5. Swap: cycles the honest role pool, never lands on a used pick.
{
  const slot = KB.slotById('making-table');
  const bag = KB.composeBag(acts, { age: 6, seed: 3 });
  const cur = bag.slots[1].activityId;
  const others = bag.slots.filter(s => s.slot !== 'making-table').map(s => s.activityId);
  const nxt = KB.swapCandidate(acts, slot, cur, others, 6);
  ok(nxt && nxt !== cur, 'swap returns a different activity');
  ok(others.indexOf(nxt) === -1, 'swap never duplicates another role');
  ok(KB.fitsScenario(byId[nxt], 6), 'swap pick fits the scenario');
  ok(KB.swapCandidate([], slot, cur, [], 6) === null, 'swap on empty catalog is null, honestly');
}

// 6. Normalization + classification: the honest merge rules.
ok(KB.normalizeKey('glue sticks (one per kid)') === KB.normalizeKey('Glue sticks'),
  'quantifier parentheticals and case merge: glue sticks is glue sticks');
ok(KB.normalizeKey('one big pot (a sturdy bucket)') === 'big pot', 'leading quantifiers strip');
ok(KB.normalizeKey('glue') !== KB.normalizeKey('glue sticks'),
  'near-identical is NOT identical: "glue" never merges into "glue sticks"');
ok(KB.classifyItem('printed clue lists') === 'print', 'printed items go to print-at-desk');
ok(KB.classifyItem('big picture cards of each smell source') === 'print', 'picture cards go to print-at-desk');
ok(KB.classifyItem('washable finger paint in wide trays') === 'consumables', 'paint is a consumable');
ok(KB.classifyItem('printer paper (a stack)') === 'consumables', 'printer paper is paper — a consumable, not a print job');
ok(KB.classifyItem('one big pot (a sturdy bucket)') === 'equipment', 'a pot is equipment');
ok(KB.classifyItem('chunky pegs (the biggest spring pegs)') === 'equipment', 'pegs are equipment');

// 7. Aggregation provenance — synthetic day with a shared item.
{
  const A1 = { id: 'synthetic-a', name: 'Synthetic A', materials: [{ item: 'glue sticks' }, { item: 'paper (one per kid)' }] };
  const A2 = { id: 'synthetic-b', name: 'Synthetic B', materials: [{ item: 'glue sticks (one per team)' }, { item: 'scissors' }] };
  const A3 = { id: 'synthetic-c', name: 'Synthetic C', materials: [] };
  const kit = KB.aggregateKit([A1, A2, A3]);
  ok(kit.rawTotal === 4, 'raw total counts every listed material', String(kit.rawTotal));
  ok(kit.lineCount === 3, 'four listings dedupe to three lines', String(kit.lineCount));
  const occ = kit.groups.reduce((n, g) => n + g.items.reduce((m, e) => m + e.occurrences, 0), 0);
  ok(occ === kit.rawTotal, 'occurrences out equal materials in — nothing dropped, nothing invented');
  ok(kit.sharedCount === 1, 'exactly one shared item');
  const glue = kit.groups.map(g => g.items).flat().find(e => e.key === 'glue sticks');
  ok(!!glue, 'the shared glue-sticks line exists');
  ok(glue.activities.length === 2 && glue.activities[0].name === 'Synthetic A' && glue.activities[1].name === 'Synthetic B',
    'the shared line names BOTH activities that asked for it');
  ok(glue.variants.length === 2 && glue.variants.indexOf('glue sticks (one per team)') !== -1,
    'both verbatim quantity phrasings are preserved on the line');
  ok(glue.group === 'consumables', 'glue sticks grouped as consumables');
  const sciss = kit.groups.map(g => g.items).flat().find(e => e.key === 'scissors');
  ok(sciss && sciss.group === 'equipment', 'scissors grouped as equipment');
  ok(kit.noMaterials.length === 1 && kit.noMaterials[0].id === 'synthetic-c',
    'an activity needing nothing is reported as packing nothing — not silently vanished');
}

// 8. Aggregation provenance — the real composed bag.
{
  const bag = KB.composeBag(acts, { age: 6, seed: 34 });
  const picks = bag.slots.map(s => byId[s.activityId]);
  const kit = KB.aggregateKit(picks);
  const raw = picks.reduce((n, a) => n + (a.materials || []).length, 0);
  ok(kit.rawTotal === raw, 'real bag: raw total equals the picks\u2019 real materials count');
  ok(kit.lineCount <= kit.rawTotal, 'real bag: dedupe never adds lines');
  const allVariants = new Set();
  kit.groups.forEach(g => g.items.forEach(e => {
    e.variants.forEach(v => allVariants.add(v));
    e.activities.forEach(x => ok(byId[x.id], 'line traces to a real activity: ' + x.id));
    ok(e.activities.length >= 1, 'every line names at least one requesting activity');
  }));
  picks.forEach(a => (a.materials || []).forEach(m =>
    ok(allVariants.has(m.item), 'every real material string survives verbatim: ' + a.id + ' / ' + m.item.slice(0, 40))));
  const grouped = kit.groups.reduce((n, g) => n + g.items.length, 0);
  ok(grouped === kit.lineCount, 'every line appears in exactly one group');
}

// 9. The text kit list carries the day, the groups, the provenance.
{
  const bag = KB.composeBag(acts, { age: 6, seed: 34 });
  const text = KB.kitBagText({ age: 6, slots: bag.slots }, byId, catName);
  ok(/THE KIT BAG/.test(text) && /Rainy-Day Indoor/.test(text), 'kit text carries the title and scenario');
  ok(/Room age: 6/.test(text), 'kit text carries the room age — the day it supports');
  bag.slots.forEach(s => ok(text.indexOf(byId[s.activityId].name) !== -1, 'kit text names the pick: ' + s.activityId));
  KB.GROUPS.forEach(g => {
    const kit = KB.aggregateKit(bag.slots.map(s => byId[s.activityId]));
    const grp = kit.groups.find(x => x.id === g.id);
    if (grp.items.length) ok(text.indexOf(g.label.toUpperCase()) !== -1, 'kit text has the group: ' + g.id);
  });
  const openText = KB.kitBagText({ age: 6, slots: KB.composeBag([], { age: 6 }).slots }, byId, catName);
  ok(/open slot/.test(openText), 'kit text marks open slots honestly');
}

// 10. Wiring: the page, the DOM layer, the print sheet, the links.
{
  const html = fs.readFileSync(path.join(ROOT, 'kitbag.html'), 'utf8');
  ok(/The Kit Bag/.test(html), 'kitbag.html exists and is the Kit Bag');
  ok(html.indexOf('assets/kitbag-core.js') !== -1, 'kitbag.html loads the kit bag core');
  ok(html.indexOf('assets/kitbag.js') !== -1, 'kitbag.html loads the kit bag logic');
  ok(html.indexOf('id="kit-sheet"') !== -1, 'kitbag.html has the printable kit sheet');
  ok(html.indexOf('id="kb-print"') !== -1, 'kitbag.html has the print action');
  const js = fs.readFileSync(path.join(ROOT, 'assets/kitbag.js'), 'utf8');
  ok(js.indexOf('VaultKitBag') !== -1, 'bag logic runs on the pure core');
  ok(js.indexOf('data/activities.json') !== -1, 'bag logic reads the real catalog file');
  const css = fs.readFileSync(path.join(ROOT, 'assets/style.css'), 'utf8');
  ok(css.indexOf('.kit-sheet') !== -1, 'stylesheet styles the kit sheet');
  ok(/@media print[\s\S]*?\.kit-sheet/.test(css), 'print stylesheet covers the kit sheet');
  const kit = fs.readFileSync(path.join(ROOT, 'kit.html'), 'utf8');
  ok(kit.indexOf('kitbag.html') !== -1, 'the After-School Kit page links the Kit Bag');
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  ok(sitemap.includes('kitbag.html'), 'sitemap.xml has kitbag.html');
  const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
  ok(llms.includes('kitbag.html'), 'llms.txt mentions kitbag.html');
  const bag = KB.composeBag(acts, { age: 6, seed: 34 });
  bag.slots.forEach(s => ok(fs.existsSync(path.join(ROOT, 'activity', s.activityId + '.html')),
    'bag pick page rendered: ' + s.activityId));
}

console.log('test-kitbag: ' + passed + ' assertions pass');
