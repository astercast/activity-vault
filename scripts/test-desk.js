#!/usr/bin/env node
/* Wave 21 assertions: "The Desk" — desk.html drawers, trays, pencil notes,
   deep links, nav wiring, planner blotter CSS. Run after scripts/build.py.
   Exits non-zero on the first failure. */
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
const cats = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/categories.json'), 'utf8'));
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
const actIds = new Set(acts.map(a => a.id));
ok(acts.length === 601, '601 activities total', String(acts.length));
ok(actIds.size === acts.length, 'all activity ids unique (validator re-run)');
ok(cats.length === 11, '11 categories', String(cats.length));

const deskPath = path.join(ROOT, 'desk.html');
ok(fs.existsSync(deskPath), 'desk.html generated');
const desk = fs.readFileSync(deskPath, 'utf8');

// 1. Eleven drawers, numbered in category order.
const drawers = [...desk.matchAll(/<div class="drawer" data-drawer="([a-z-]+)">/g)].map(m => m[1]);
ok(drawers.length === 11, '11 drawers', String(drawers.length));
ok(JSON.stringify(drawers) === JSON.stringify(cats.map(c => c.id)),
  'drawers follow data/categories.json order', drawers.join(','));
for (let i = 1; i <= 11; i++) {
  const n = 'DRAWER ' + String(i).padStart(2, '0');
  ok(desk.includes(n), 'drawer number present: ' + n);
}

// 2. Pencil notes carry the real build-computed counts.
const byCat = {};
acts.forEach(a => { (byCat[a.categories[0]] = byCat[a.categories[0]] || []).push(a); });
cats.forEach(c => {
  const cands = byCat[c.id] || [];
  const note = cands.length + ' cards · ' + cands.filter(a => a.no_prep).length + ' no-prep';
  ok(desk.includes('class="pencil-note">' + note + '<'),
    'pencil note honest for ' + c.id, note);
});

// 3. Tray picks: 6 per drawer, resolve to real activity pages; algorithm
//    recomputed independently (curator picks first, then no-prep, then id).
const pickedIds = new Set();
colls.forEach(c => c.picks.forEach(p => pickedIds.add(p.id)));
const trayBlocks = [...desk.matchAll(/<div class="drawer-tray" id="tray-([a-z-]+)"[\s\S]*?<\/ul>/g)];
ok(trayBlocks.length === 11, '11 trays', String(trayBlocks.length));
trayBlocks.forEach(m => {
  const cid = m[1];
  const hrefs = [...m[0].matchAll(/href="activity\/([a-z0-9-]+)\.html"/g)].map(x => x[1]);
  ok(hrefs.length === 6, '6 cards in ' + cid + ' tray', String(hrefs.length));
  hrefs.forEach(id => {
    ok(actIds.has(id), 'tray card resolves: ' + id, cid);
    ok(fs.existsSync(path.join(ROOT, 'activity', id + '.html')), 'tray card page exists: ' + id);
  });
  const cands = (byCat[cid] || []).slice().sort((a, b) =>
    ((pickedIds.has(a.id) ? 0 : 1) - (pickedIds.has(b.id) ? 0 : 1)) ||
    ((a.no_prep ? 0 : 1) - (b.no_prep ? 0 : 1)) ||
    (a.id < b.id ? -1 : 1));
  const expected = cands.slice(0, 6).map(a => a.id);
  ok(JSON.stringify(hrefs) === JSON.stringify(expected),
    'tray picks match curator-first/no-prep/id order: ' + cid,
    hrefs.join(',') + ' vs ' + expected.join(','));
  // tray footer deep link (checked on the full page: the block regex ends at </ul>)
  ok(desk.includes('…and ' + (cands.length - 6) + ' more cards in this drawer — ' +
    '<a href="index.html?cats=' + cid + '#browse">'),
    'tray footer honest count + deep link: ' + cid);
});

// 4. Drawer a11y wiring: buttons with aria-expanded/controls, tray regions.
cats.forEach(c => {
  ok(desk.includes('id="pull-' + c.id + '" aria-expanded="false" aria-controls="tray-' + c.id + '"'),
    'pull button wired: ' + c.id);
  ok(desk.includes('id="tray-' + c.id + '" role="region" aria-labelledby="pull-' + c.id + '"'),
    'tray region labeled: ' + c.id);
});
ok(desk.includes('id="drawers-open-all"') && desk.includes('id="drawers-close-all"'),
  'open-all / close-all toolbar present');
ok(desk.includes('assets/desk.js'), 'desk.html loads desk.js');

// 5. No duplicate ids anywhere in desk.html.
const ids = [...desk.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
ok(new Set(ids).size === ids.length, 'no duplicate ids in desk.html', String(ids.length));

// 6. Nav wiring: every top-level page + review.html + activity pages link the Desk.
const staticPages = ['index.html', 'planner.html', 'kit.html', 'sub.html', 'party.html',
  'fieldtrip.html', 'collections.html', 'halloween.html', 'thanksgiving.html',
  'spring.html', 'summer.html', 'api.html', 'review.html', 'desk.html'];
staticPages.forEach(p => {
  const s = fs.readFileSync(path.join(ROOT, p), 'utf8');
  ok(s.includes('href="desk.html"'), 'nav links desk.html: ' + p);
});
ok(desk.includes('aria-current="page">The Desk'), 'desk.html marks itself current');
['paper-airplane-challenge', 'monster-mash-dance', 'thumbprint-monsters'].forEach(id => {
  const s = fs.readFileSync(path.join(ROOT, 'activity', id + '.html'), 'utf8');
  ok(s.includes('href="../desk.html"'), 'activity page nav links desk: ' + id);
});

// 7. Sitemap + llms.txt surface updates.
const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
ok(sm.includes('<loc>/desk.html</loc>'), 'sitemap has desk.html');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(/^-\sdesk\.html\s/m.test(llms), 'llms.txt lists desk.html');

// 8. CSS: desk tokens, keyframes, print rule, sr-only class.
const css = fs.readFileSync(path.join(ROOT, 'assets/style.css'), 'utf8');
['--wood:', '--brass:', '--blotter:', '@keyframes stamp-slam', '@keyframes desk-card-in',
 '.visually-hidden', 'html.desk-ready .drawer-tray', '.blotter-card', '.week-section .day-card::before'
].forEach(tok => ok(css.includes(tok), 'style.css has ' + tok));
ok(/@media print \{[\s\S]*?html\.desk-ready \.drawer-tray \{ display: block !important;/.test(css),
  'print shows all trays');
// Wave 23: pressed filter chips must keep their fill — `.chip-row .chip`
// (same specificity, later source) once overrode the base pressed rule's
// background, leaving white text on white. The fill is re-declared here.
ok(/\.chip-row \.chip\[aria-pressed="true"\] \{[^}]*background: var\(--cat/.test(css),
  'pressed chip fill wins over .chip-row .chip background');

// 9. desk.js: progressive enhancement, aria handling, no injected HTML.
const djs = fs.readFileSync(path.join(ROOT, 'assets/desk.js'), 'utf8');
ok(djs.includes("classList.add('desk-ready')"), 'desk.js gates on desk-ready');
ok(djs.includes("setAttribute('aria-expanded'"), 'desk.js manages aria-expanded');
ok(djs.includes("key !== 'Escape'"), 'desk.js has Escape-to-close');
ok(!djs.includes('innerHTML'), 'desk.js injects no HTML');
let syntaxOk = true;
try { new (require('vm').Script)(djs); } catch (e) { syntaxOk = false; }
ok(syntaxOk, 'desk.js parses');

// 10. Wave 23: the archive landing (index.html) is a desk you can open.
const landingPath = path.join(ROOT, 'index.html');
const landing = fs.readFileSync(landingPath, 'utf8');
ok(landing.includes('<!-- BUILD:DESK -->') && landing.includes('<!-- /BUILD:DESK -->'),
  'index.html carries BUILD:DESK markers');
ok(landing.includes('<section class="desk-section" id="desk"'),
  'landing desk section present');
ok(landing.includes('assets/desk.js'), 'index.html loads desk.js');
ok(landing.includes('href="#desk">Find an activity'), 'hero CTA points at the desk');
const ldrawers = [...landing.matchAll(/<div class="drawer" data-drawer="([a-z-]+)">/g)].map(m => m[1]);
ok(ldrawers.length === 11, 'landing: 11 drawers', String(ldrawers.length));
ok(JSON.stringify(ldrawers) === JSON.stringify(cats.map(c => c.id)),
  'landing: drawers follow data/categories.json order', ldrawers.join(','));
cats.forEach(c => {
  const cands = byCat[c.id] || [];
  const note = cands.length + ' cards · ' + cands.filter(a => a.no_prep).length + ' no-prep';
  ok(landing.includes('class="pencil-note">' + note + '<'),
    'landing: pencil note honest for ' + c.id, note);
  ok(landing.includes('id="pull-' + c.id + '" aria-expanded="false" aria-controls="tray-' + c.id + '"'),
    'landing: pull button wired: ' + c.id);
  ok(landing.includes('id="tray-' + c.id + '" role="region" aria-labelledby="pull-' + c.id + '"'),
    'landing: tray region labeled: ' + c.id);
  ok(landing.includes('<a href="index.html?cats=' + c.id + '#browse">Open the full drawer'),
    'landing: tray footer deep-links to the filter browser: ' + c.id);
});
const ltrays = [...landing.matchAll(/<div class="drawer-tray" id="tray-([a-z-]+)"[\s\S]*?<\/ul>/g)];
ok(ltrays.length === 11, 'landing: 11 trays', String(ltrays.length));
ltrays.forEach(m => {
  const cid = m[1];
  const hrefs = [...m[0].matchAll(/href="activity\/([a-z0-9-]+)\.html"/g)].map(x => x[1]);
  ok(hrefs.length === 6, 'landing: 6 cards in ' + cid + ' tray', String(hrefs.length));
  hrefs.forEach(id => {
    ok(actIds.has(id), 'landing: tray card resolves: ' + id, cid);
    ok(fs.existsSync(path.join(ROOT, 'activity', id + '.html')), 'landing: tray card page exists: ' + id);
  });
  const cands = (byCat[cid] || []).slice().sort((a, b) =>
    ((pickedIds.has(a.id) ? 0 : 1) - (pickedIds.has(b.id) ? 0 : 1)) ||
    ((a.no_prep ? 0 : 1) - (b.no_prep ? 0 : 1)) ||
    (a.id < b.id ? -1 : 1));
  const expected = cands.slice(0, 6).map(a => a.id);
  ok(JSON.stringify(hrefs) === JSON.stringify(expected),
    'landing: tray picks match curator-first/no-prep/id order: ' + cid,
    hrefs.join(',') + ' vs ' + expected.join(','));
});
ok(landing.includes('id="drawers-open-all"') && landing.includes('id="drawers-close-all"'),
  'landing: open-all / close-all toolbar present');
ok(landing.includes('id="blotter-h"') && landing.includes('href="planner.html"'),
  'landing: kneehole blotter links the planner');
const lids = [...landing.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
ok(new Set(lids).size === lids.length, 'no duplicate ids in index.html', String(lids.length));

console.log('\ntest-desk: ' + passed + ' assertions passed');
