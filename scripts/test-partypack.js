#!/usr/bin/env node
/* Wave 35 flagship assertions: The Party Pack — a group-event
   planner that COMPOSES the two earlier flagships: the Day
   Planner's five-slot arc (welcome, big group opener, making &
   games, movement break, calm close) filled from the real
   catalog by occasion + age band + group size, and the Kit
   Bag's materials aggregation (the party bag is built from the
   picks' real materials fields, through VaultKitBag itself).
   The hard rules never loosen (occasion tags/category/location,
   the real age band overlap, the real group range); slot
   categories are a preference ladder only. Thin coverage is
   asserted as a first-class behavior: when an occasion honestly
   holds fewer records than the arc has slots, the report says
   so in numbers, the plan fills only what fits, and the nearest
   options are each re-verified against the catalog before the
   suite believes them. Pure-core tests against
   assets/partypack-core.js plus wiring checks on
   partypack.html / assets/partypack.js / the print stylesheet.
   Run after scripts/build.py. Exits non-zero on first failure. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(path.dirname(path.resolve(__filename)));
const PP = require(path.join(ROOT, 'assets/partypack-core.js'));
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

// 1. The request shape: 8 occasions, 4 age bands, the five-part arc in order.
ok(PP.OCCASIONS.length === 8, 'eight occasions');
ok(PP.OCCASIONS.map(o => o.id).join(',') ===
  'birthday,halloween,thanksgiving,winter-holiday,valentines,spring,summer,rainy-day',
  'occasions in page order');
PP.OCCASIONS.forEach(o => {
  ok(o.label && o.glyph && o.blurb && o.blurb.length >= 30, 'occasion fully described: ' + o.id);
  if (o.tags) o.tags.forEach(t =>
    ok(acts.some(a => (a.tags || []).indexOf(t) !== -1), 'occasion tag is real on the shelf: ' + o.id + ' -> ' + t));
});
ok(PP.AGE_BANDS.map(b => b.id).join(',') === '3-4,5-6,7-8,9-12', 'four age bands');
ok(PP.PARTY_SLOTS.length === 5, 'five parts in the party arc');
ok(PP.PARTY_SLOTS.map(s => s.id).join(',') === 'welcome,big-group,making,movement,calm-close',
  'arc in event order: welcome, big group, making, movement, calm close');
PP.PARTY_SLOTS.forEach(s => {
  ok(s.label && s.glyph && s.clock && s.hint && s.hint.length >= 30, 'slot fully described: ' + s.id);
  ok(s.maxMinutes >= 15 && s.maxMinutes <= 30, 'slot has a sane minute cap: ' + s.id);
  s.cats.forEach(c => ok(cats.some(x => x.id === c), 'slot category is real: ' + s.id + ' -> ' + c));
});

// 2. The hard rules read the real fields — and never loosen.
{
  const val = acts.find(a => (a.tags || []).indexOf('holiday:valentines-day') !== -1);
  ok(!!val, 'a real valentines record exists to test with');
  ok(PP.fitsOccasion(val, PP.occasionById('valentines')) === true, 'valentines record fits the valentines occasion');
  ok(PP.fitsOccasion(val, PP.occasionById('birthday')) === true, 'birthday (any theme) honestly fits everything');
  const threeOnly = byId['big-wooden-bead-stringing'];
  ok(PP.fitsBand(threeOnly, PP.bandById('3-4')) === true, 'a 3-only record overlaps the 3-4 band');
  ok(PP.fitsBand(threeOnly, PP.bandById('5-6')) === false, 'a 3-only record does NOT serve the 5-6 band');
  ok(PP.fitsGroup(threeOnly, 6) === true, 'the bead record fits its real group range');
  ok(PP.fitsGroup(threeOnly, 28) === false, 'a small-group record does NOT stretch to a group of 28');
  const rainy = byId['umbrella-drip-count-listen'];
  ok(PP.fitsOccasion(rainy, PP.occasionById('rainy-day')) === true, 'a real rainy-day indoor record fits the rainy-day party');
  ok(PP.fitsOccasion(byId['grass-hill-roll-down'], PP.occasionById('rainy-day')) === false,
    'an outdoor-only record does NOT fit the indoor rainy-day party');
}

// 3. Pools are honest at every offered combination.
PP.OCCASIONS.forEach(occ => {
  PP.AGE_BANDS.forEach(band => {
    [6, 10, 16, 28].forEach(size => {
      const o = { occasion: occ.id, ageBand: band.id, groupSize: size };
      const pool = PP.occasionPool(acts, o);
      pool.forEach(a => ok(PP.fitsParty(a, o), 'pool pick honestly fits: ' + occ.id + '/' + band.id + '/' + size + ' ' + a.id));
      PP.PARTY_SLOTS.forEach(slot => {
        PP.slotPool(acts, slot, o).forEach(a =>
          ok(PP.fitsParty(a, o) && a.time_min <= slot.maxMinutes, 'slot pick honestly fits: ' + slot.id + ' ' + a.id));
      });
    });
  });
});

// 4. composeParty: full, varied, reproducible, honest when empty.
{
  const p1 = PP.composeParty(acts, { occasion: 'birthday', ageBand: '5-6', groupSize: 16, seed: 7 });
  const p2 = PP.composeParty(acts, { occasion: 'birthday', ageBand: '5-6', groupSize: 16, seed: 7 });
  ok(JSON.stringify(p1) === JSON.stringify(p2), 'composeParty is deterministic for a seed');
  [['birthday', '5-6', 16], ['halloween', '3-4', 16], ['rainy-day', '5-6', 16],
   ['winter-holiday', '3-4', 16], ['summer', '7-8', 16], ['thanksgiving', '5-6', 16],
   ['spring', '9-12', 28], ['birthday', '3-4', 6]].forEach(([occ, band, size]) => {
    const party = PP.composeParty(acts, { occasion: occ, ageBand: band, groupSize: size, seed: 35 });
    const ids = party.slots.map(s => s.activityId).filter(Boolean);
    ok(ids.length === 5, 'party fills all five parts: ' + occ + '/' + band + '/' + size, ids.join(','));
    ok(new Set(ids).size === ids.length, 'party never repeats an activity: ' + occ);
    party.slots.forEach(s => ok(PP.fitsParty(byId[s.activityId], { occasion: occ, ageBand: band, groupSize: size }),
      'party pick honestly fits: ' + s.slot + ' ' + s.activityId));
  });
  const pEmpty = PP.composeParty([], { occasion: 'birthday', ageBand: '5-6', groupSize: 16 });
  ok(pEmpty.slots.every(s => s.activityId === null), 'empty catalog packs an honestly empty party');
  const t = PP.partyTotals(PP.composeParty(acts, { occasion: 'birthday', ageBand: '5-6', groupSize: 16, seed: 3 }).slots, byId);
  ok(t.filled === 5 && t.minMinutes > 0 && t.maxMinutes >= t.minMinutes, 'party totals read the real time fields');
}

// 5. Thin coverage: reported in numbers, filled only honestly,
//    and the nearest options are real — re-verified one by one.
{
  const thinVal = { occasion: 'valentines', ageBand: '3-4', groupSize: 16 };
  const rep = PP.coverageReport(acts, thinVal);
  ok(rep.poolSize === 4, 'valentines at 3-4 honestly holds 4 real activities', String(rep.poolSize));
  ok(rep.thin === true && rep.full === false, 'valentines at 3-4 is reported THIN, not padded over');
  ok(rep.slotsFilled === 4, 'the thin plan fills the 4 honest parts and no more', String(rep.slotsFilled));
  const party = PP.composeParty(acts, Object.assign({}, thinVal, { seed: 35 }));
  ok(party.slots.filter(s => !s.activityId).length === 1, 'exactly one arc slot stays honestly open');
  party.slots.forEach(s => {
    if (s.activityId) ok(PP.fitsParty(byId[s.activityId], thinVal), 'thin-plan pick still honestly fits: ' + s.activityId);
  });
  const thinTg = PP.coverageReport(acts, { occasion: 'thanksgiving', ageBand: '3-4', groupSize: 16 });
  ok(thinTg.poolSize === 2 && thinTg.slotsFilled === 2, 'thanksgiving at 3-4: pool 2, fills 2, says so');
  const nearest = PP.nearestOptions(acts, thinVal);
  ok(nearest.length >= 1 && nearest.length <= 3, 'nearest options offered for the thin request', String(nearest.length));
  nearest.forEach(n => {
    ok(n.change && n.change.length >= 8, 'nearest option names what changes: ' + n.change);
    ok(n.slotsFilled > rep.slotsFilled, 'nearest option fills MORE than the thin request: ' + n.change);
    const check = PP.composeParty(acts, { occasion: n.occasion, ageBand: n.ageBand, groupSize: n.groupSize, seed: 35 });
    ok(check.slots.filter(s => s.activityId).length === n.slotsFilled,
      'nearest option re-verified by composing it: ' + n.change);
    ok(PP.occasionPool(acts, n).length === n.poolSize, 'nearest option pool size is honest: ' + n.change);
  });
  ok(nearest.some(n => n.full), 'at least one nearest option is a FULL party');
  const full = PP.coverageReport(acts, { occasion: 'birthday', ageBand: '5-6', groupSize: 16 });
  ok(full.thin === false && full.full === true && full.poolSize >= 400, 'birthday 5-6 is honestly deep', String(full.poolSize));
}

// 6. Swap: cycles the honest slot pool, never lands on a used pick.
{
  const slot = PP.slotById('making');
  const o = { occasion: 'birthday', ageBand: '5-6', groupSize: 16 };
  const party = PP.composeParty(acts, Object.assign({}, o, { seed: 3 }));
  const cur = party.slots[2].activityId;
  const others = party.slots.filter(s => s.slot !== 'making').map(s => s.activityId);
  const nxt = PP.swapCandidate(acts, slot, cur, others, o);
  ok(nxt && nxt !== cur, 'swap returns a different activity');
  ok(others.indexOf(nxt) === -1, 'swap never duplicates another part');
  ok(PP.fitsParty(byId[nxt], o), 'swap pick honestly fits the party');
  ok(PP.swapCandidate([], slot, cur, [], o) === null, 'swap on empty catalog is null, honestly');
}

// 7. The party bag IS the Kit Bag's aggregation — composed, not rebuilt.
{
  const A1 = { id: 'synthetic-a', name: 'Synthetic A', materials: [{ item: 'glue sticks' }, { item: 'paper (one per kid)' }] };
  const A2 = { id: 'synthetic-b', name: 'Synthetic B', materials: [{ item: 'glue sticks (one per team)' }, { item: 'scissors' }] };
  const viaPP = PP.partyKit([A1, A2]);
  const viaKB = KB.aggregateKit([A1, A2]);
  ok(JSON.stringify(viaPP) === JSON.stringify(viaKB), 'partyKit delegates to the Kit Bag aggregation verbatim');
  ok(viaPP.lineCount === 3 && viaPP.rawTotal === 4 && viaPP.sharedCount === 1,
    'the synthetic party bag merges the shared item once, like the Kit Bag');
  // The real composed party: provenance over its own bag.
  const party = PP.composeParty(acts, { occasion: 'birthday', ageBand: '5-6', groupSize: 16, seed: 35 });
  const picks = party.slots.map(s => byId[s.activityId]);
  const kit = PP.partyKit(picks);
  const raw = picks.reduce((n, a) => n + (a.materials || []).length, 0);
  ok(kit.rawTotal === raw, 'real party bag: raw total equals the picks\u2019 real materials count');
  const occ = kit.groups.reduce((n, g) => n + g.items.reduce((m, e) => m + e.occurrences, 0), 0);
  ok(occ === kit.rawTotal, 'real party bag: occurrences out equal materials in');
  const allVariants = new Set();
  kit.groups.forEach(g => g.items.forEach(e => {
    e.variants.forEach(v => allVariants.add(v));
    e.activities.forEach(x => ok(byId[x.id], 'bag line traces to a real activity: ' + x.id));
  }));
  picks.forEach(a => (a.materials || []).forEach(m =>
    ok(allVariants.has(m.item), 'every real material string survives verbatim: ' + a.id + ' / ' + m.item.slice(0, 40))));
}

// 8. The text party sheet carries the arc, the bag, the honesty.
{
  const party = PP.composeParty(acts, { occasion: 'birthday', ageBand: '5-6', groupSize: 16, seed: 35 });
  const text = PP.partySheetText(
    { occasion: 'birthday', ageBand: '5-6', groupSize: 16, slots: party.slots }, byId, catName);
  ok(/THE PARTY PACK/.test(text) && /Birthday Party/.test(text), 'sheet text carries the title and occasion');
  ok(/Ages 5–6/.test(text) && /Group of 16/.test(text), 'sheet text carries the band and group size');
  party.slots.forEach(s => ok(text.indexOf(byId[s.activityId].name) !== -1, 'sheet text names the pick: ' + s.activityId));
  ok(/THE PARTY BAG/.test(text), 'sheet text carries the party bag');
  const openText = PP.partySheetText(
    { occasion: 'birthday', ageBand: '5-6', groupSize: 16, slots: PP.composeParty([], { occasion: 'birthday', ageBand: '5-6', groupSize: 16 }).slots },
    byId, catName);
  ok(/open slot/.test(openText), 'sheet text marks open slots honestly');
}

// 9. Wiring: the page, the DOM layer, the print sheet, the links.
{
  const html = fs.readFileSync(path.join(ROOT, 'partypack.html'), 'utf8');
  ok(/The Party Pack/.test(html), 'partypack.html exists and is the Party Pack');
  ok(html.indexOf('assets/kitbag-core.js') !== -1, 'partypack.html loads the Kit Bag core (composition, not a rebuild)');
  ok(html.indexOf('assets/partypack-core.js') !== -1, 'partypack.html loads the party pack core');
  ok(html.indexOf('assets/partypack.js') !== -1, 'partypack.html loads the party pack logic');
  ok(html.indexOf('id="party-sheet"') !== -1, 'partypack.html has the printable party sheet');
  ok(html.indexOf('id="pp-coverage"') !== -1, 'partypack.html has the honest coverage panel');
  ok(html.indexOf('id="pp-print"') !== -1, 'partypack.html has the print action');
  const js = fs.readFileSync(path.join(ROOT, 'assets/partypack.js'), 'utf8');
  ok(js.indexOf('VaultPartyPack') !== -1, 'party logic runs on the pure core');
  ok(js.indexOf('data/activities.json') !== -1, 'party logic reads the real catalog file');
  const css = fs.readFileSync(path.join(ROOT, 'assets/style.css'), 'utf8');
  ok(css.indexOf('.party-sheet') !== -1, 'stylesheet styles the party sheet');
  ok(/@media print[\s\S]*?\.party-sheet/.test(css), 'print stylesheet covers the party sheet');
  const party = fs.readFileSync(path.join(ROOT, 'party.html'), 'utf8');
  ok(party.indexOf('partypack.html') !== -1, 'the Party Planner page links the Party Pack');
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  ok(sitemap.includes('partypack.html'), 'sitemap.xml has partypack.html');
  const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
  ok(llms.includes('partypack.html'), 'llms.txt mentions partypack.html');
  const pre = PP.composeParty(acts, { occasion: 'birthday', ageBand: '5-6', groupSize: 16, seed: 35 });
  pre.slots.forEach(s => ok(fs.existsSync(path.join(ROOT, 'activity', s.activityId + '.html')),
    'pre-packed pick page rendered: ' + s.activityId));
}

console.log('test-partypack: ' + passed + ' assertions pass');
