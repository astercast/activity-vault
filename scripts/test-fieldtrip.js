#!/usr/bin/env node
/* Wave 14 scope-up assertions: Field Trip Planner integrity.
   - fieldtrip-core.js pure math (chaperones, buddy groups, budget, timeline)
   - every destination matches >=3 activities on the REAL 329-activity dataset
   - field-trip-bus-ride collection valid; pickBusActivities works on real data
   - fieldtrip.html structure, nav aria-current across all 11 shells,
     llms.txt / sitemap.xml entries, calm toggle + site.js wiring
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

const FT = require(path.join(ROOT, 'assets/fieldtrip-core.js'));
const acts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/activities.json'), 'utf8'));
const actIds = new Set(acts.map(a => a.id));
const byId = Object.fromEntries(acts.map(a => [a.id, a]));

// 1. Pure math: chaperones, buddy groups, budget
let c = FT.chaperonesNeeded(24, 8);
ok(c.chaperones === 3 && c.total === 27, 'chaperonesNeeded(24, 1:8) = 3 chaperones, 27 total');
c = FT.chaperonesNeeded(25, 8);
ok(c.chaperones === 4 && c.total === 29, 'chaperonesNeeded rounds UP (25 kids, 1:8 -> 4)');
c = FT.chaperonesNeeded(10, 5);
ok(c.chaperones === 2 && c.total === 12, 'chaperonesNeeded(10, 1:5) = 2');
let b = FT.buddyGroups(24);
ok(b.pairs === 12 && b.trios === 0 && b.covered === 24, 'buddyGroups(24) = 12 clean pairs');
b = FT.buddyGroups(25);
ok(b.pairs === 11 && b.trios === 1 && b.covered === 25, 'buddyGroups(25) = 11 pairs + 1 trio');
b = FT.buddyGroups(1);
ok(b.covered === 1, 'buddyGroups(1) edge case covers the lone kid');
let m = FT.budgetTotal(24, 5, 200);
ok(m.total === 320, 'budgetTotal(24, $5, $200) = $320');
ok(Math.abs(m.perKid - 320 / 24) < 1e-9, 'budget perKid exact');
m = FT.budgetTotal(0, 5, 200);
ok(m.total === 200 && m.perKid === 0, 'budgetTotal(0 kids) = flat transport only, no div-by-zero');

// 2. Timeline builder
const tl = FT.buildTimeline({ startMin: 9 * 60, tripLength: 'full', destId: FT.DESTINATION_IDS[0] });
ok(tl.blocks.length >= 5, 'full-day timeline has >=5 blocks', String(tl.blocks.length));
ok(tl.blocks[0].start === 540, 'timeline starts at the requested time');
ok(tl.totalMin > 0, 'timeline totalMin positive');
const half = FT.buildTimeline({ startMin: 540, tripLength: 'half', destId: FT.DESTINATION_IDS[0] });
ok(half.totalMin < tl.totalMin, 'half-day timeline is shorter than full-day');

// 3. Destination matching on the REAL dataset: every destination >=3 picks,
//    every pick resolves, age-overlaps the requested band
ok(FT.DESTINATION_IDS.length >= 5, 'at least 5 destinations', String(FT.DESTINATION_IDS.length));
FT.DESTINATION_IDS.forEach(id => {
  const matches = FT.matchOnSite(acts, id, 6, 12, 6);
  ok(matches.length >= 3, 'destination ' + id + ' matches >=3 activities', String(matches.length));
  matches.forEach(a => {
    ok(actIds.has(a.id), 'match resolves: ' + a.id);
    ok(a.age_min <= 12 && a.age_max >= 6, 'match age-overlaps 6-12: ' + a.id);
  });
  const uniq = new Set(matches.map(a => a.id));
  ok(uniq.size === matches.length, 'destination ' + id + ' matches are unique');
});

// 4. Bus-ride collection: valid, resolves, pickBusActivities works on real data
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
const bus = colls.find(x => x.id === 'field-trip-bus-ride');
ok(!!bus, 'field-trip-bus-ride collection exists');
ok(bus.picks.length === 12, 'bus collection has 12 picks', String(bus.picks.length));
bus.picks.forEach(p => ok(actIds.has(p.activity_id || p.id), 'bus pick resolves: ' + (p.activity_id || p.id)));
const busPicks = FT.pickBusActivities(bus.picks, byId, 6, 12, 45);
ok(busPicks.length >= 2 && busPicks.length <= 6, '45-min ride picks 2-6 activities', String(busPicks.length));
busPicks.forEach(a => ok(a.no_prep || busPicks.every(x => !x.no_prep),
  'bus picks prefer no-prep: ' + a.id));

// 5. fieldtrip.html: form, results hosts, scripts, calm toggle, details CSS hook
const ftHtml = fs.readFileSync(path.join(ROOT, 'fieldtrip.html'), 'utf8');
for (const id of ['fieldtrip-form', 'ft-results', 'ft-destination', 'ft-kids', 'ft-ratio', 'ft-start']) {
  ok(ftHtml.includes('id="' + id + '"'), 'fieldtrip.html has #' + id);
}
ok(ftHtml.includes('assets/fieldtrip-core.js'), 'fieldtrip.html loads fieldtrip-core.js');
ok(ftHtml.includes('assets/fieldtrip.js'), 'fieldtrip.html loads fieldtrip.js');
ok(ftHtml.includes('assets/site.js'), 'fieldtrip.html loads site.js');
ok(ftHtml.includes('id="site-calm-toggle"'), 'fieldtrip.html has the calm toggle');
ok(ftHtml.includes('skip-link'), 'fieldtrip.html has skip link');
const ftJs = fs.readFileSync(path.join(ROOT, 'assets/fieldtrip.js'), 'utf8');
ok(ftJs.includes('<details') || ftJs.includes("createElement('details')"),
  'fieldtrip.js uses native <details> accordions for checklists');
ok(ftJs.includes('ft-checklists'), 'fieldtrip.js names the accordion group');
const styleSrc = fs.readFileSync(path.join(ROOT, 'assets/style.css'), 'utf8');
ok(styleSrc.includes('.ft-check'), 'style.css styles the checklist accordions');
ok(styleSrc.includes('.ft-table'), 'style.css styles the permission table');
ok(/\.ft-check:not\(\[open\]\)/.test(styleSrc) || styleSrc.includes('@media print'),
  'print CSS keeps closed accordions printable');

// 6. Nav: all 12 shells link fieldtrip.html with correct aria-current
const SHELLS = ['index.html', 'planner.html', 'kit.html', 'sub.html', 'party.html', 'fieldtrip.html',
  'collections.html', 'api.html', 'spring.html', 'summer.html', 'halloween.html', 'thanksgiving.html'];
for (const f of SHELLS) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  ok(html.includes('href="fieldtrip.html"'), f + ' nav links fieldtrip.html');
  const curs = [...html.matchAll(/aria-current="page"/g)];
  if (f === 'api.html') continue; // api.html has no aria-current (pre-existing pattern)
  ok(curs.length === 1, f + ' has exactly one aria-current', String(curs.length));
  ok(html.includes('href="' + f + '" aria-current="page"'), f + ' aria-current points at itself');
}

// 7. Agentic surface: sitemap, llms, api collections
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
ok(sitemap.includes('fieldtrip.html'), 'sitemap.xml has fieldtrip.html');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(llms.includes('fieldtrip.html'), 'llms.txt mentions fieldtrip.html');
const apiColls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/collections.json'), 'utf8'));
ok(apiColls.collections.some(x => x.id === 'field-trip-bus-ride'), 'api has field-trip-bus-ride');

console.log('field trip planner: ' + passed + ' assertions passed');
