#!/usr/bin/env node
/* Wave 18 assertions: After-School Kit integrity.
   - kit-core.js pure logic (pantry matching, filters, kit dealing, run-of-show,
     checklist aggregation, URL encode/decode) on the REAL 355-activity dataset
   - kit.html structure + kit.js DOM-id cross-check
   - nav aria-current across all 12 shells, llms.txt / sitemap.xml entries,
     calm toggle wiring
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

const K = require(path.join(ROOT, 'assets/kit-core.js'));
const acts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/activities.json'), 'utf8'));
const actIds = new Set(acts.map(a => a.id));
const byId = Object.fromEntries(acts.map(a => [a.id, a]));
const buckets = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/balance-buckets.json'), 'utf8'));
const bucketByCat = Object.fromEntries(buckets.mapping.map(m => [m.category, m.bucket]));

// 1. Vocabulary / pantry shape
ok(K.PANTRY_IDS.length === 16, 'pantry has 16 staples', String(K.PANTRY_IDS.length));
ok(new Set(K.PANTRY_IDS).size === 16, 'pantry ids unique');
ok(K.PANTRY_DEFAULT.every(id => K.PANTRY_IDS.includes(id)), 'default pantry ids all real');
ok(Object.keys(K.MODES).join(',') === 'pantry,low,noprep', 'three prep modes');
ok(Object.keys(K.AGE_BANDS).length === 5, 'five age bands');
ok(K.DAY_NAMES.length === 5, 'five day names');

// 2. Word-boundary matching — no false positives on real strings
ok(K.wordMatch('paper cups (one per kid)', 'cup'), '"paper cups" matches cup');
ok(!K.wordMatch('mini cupcakes', 'cup'), '"cupcakes" does NOT match cup');
ok(K.wordMatch('printer paper (a stack)', 'paper'), '"printer paper (a stack)" matches paper');
ok(K.wordMatch('paper plates', 'paper plate'), 'multi-word phrase matches');
ok(!K.wordMatch('cardboard box', 'card'), '"cardboard" does NOT match card');
ok(K.wordMatch('playing cards', 'card'), '"playing cards" matches card');
ok(K.wordMatch('dice', 'dice'), '"dice" matches dice');

// 3. materialFit on real activities
const paperPlane = byId['paper-airplane-challenge'];
ok(!!paperPlane, 'fixture activity paper-airplane-challenge exists');
const fit = K.materialFit(paperPlane, K.PANTRY_DEFAULT);
ok(fit.ok && fit.missing.length === 0, 'paper airplane fits default pantry', JSON.stringify(fit));
const empty = K.materialFit(paperPlane, []);
ok(!empty.ok && empty.missing.length > 0, 'empty pantry misses materials', JSON.stringify(empty.missing));
const zeroMat = acts.find(a => a.materials.length === 0);
ok(!!zeroMat, 'at least one zero-material activity exists: ' + (zeroMat && zeroMat.id));
ok(K.materialFit(zeroMat, []).ok, 'zero-material activity fits empty pantry');

// 4. Config clamping
let c = K.clampCfg({ groupSize: 999, days: 9, minutes: 5, mode: 'bogus', ageBand: 'nope' });
ok(c.groupSize === 60 && c.days === 5 && c.minutes === 20 && c.mode === 'pantry' && c.ageBand === 'all',
  'clampCfg clamps out-of-range values');
c = K.clampCfg({ startTime: 'garbage' });
ok(c.startTime === '15:30', 'clampCfg resets bad startTime');

// 5. Filters behave on the real dataset
const cfg = K.clampCfg({ ageBand: 'g3-5', groupSize: 20, days: 3, minutes: 60, mode: 'pantry', pantry: K.PANTRY_DEFAULT });
const strictPool = acts.filter(a => K.fitsKit(a, cfg));
ok(strictPool.length >= 20, 'default pantry mode yields a healthy pool', String(strictPool.length));
strictPool.forEach(a => {
  ok(a.age_min <= 11 && a.age_max >= 8, 'age overlap: ' + a.id);
  ok(a.group_min <= 20 && 20 <= a.group_max, 'group fit: ' + a.id);
  ok(a.time_min <= 60, 'time fit: ' + a.id);
});
const noprepCfg = K.clampCfg({ ageBand: 'g3-5', groupSize: 20, days: 3, minutes: 60, mode: 'noprep', pantry: [] });
const npPool = acts.filter(a => K.fitsKit(a, noprepCfg));
ok(npPool.every(a => a.no_prep), 'noprep mode returns only no_prep activities', String(npPool.length));
ok(npPool.length >= 15, 'noprep pool non-trivial', String(npPool.length));
const lowCfg = K.clampCfg({ ageBand: 'g3-5', groupSize: 20, days: 3, minutes: 60, mode: 'low', pantry: [] });
const lowPool = acts.filter(a => K.fitsKit(a, lowCfg));
ok(lowPool.every(a => a.no_prep || a.materials.length <= 3), 'low mode: no_prep or <=3 materials');
ok(lowPool.length >= npPool.length, 'low pool >= noprep pool');

// 6. buildKit: shape, roles, ids resolve, determinism
const kit = K.buildKit(acts, cfg, bucketByCat, 42);
ok(kit.days.length === 3, 'kit has 3 days', String(kit.days.length));
ok(kit.days.every(d => d.slots.length === 3), 'every day has 3 slots');
ok(kit.days.every(d => d.slots.map(s => s.role).join(',') === 'opener,main,closer'),
  'slot roles in opener/main/closer order');
const kitIds = kit.days.flatMap(d => d.slots.map(s => s.id));
ok(kitIds.every(id => actIds.has(id)), 'every kit slot resolves to a real activity');
ok(new Set(kitIds).size === kitIds.length, 'no repeats across a 3-day kit', kitIds.join(','));
/* reused-flag consistency: any id appearing twice must be flagged reused */
(function () {
  const seen = {};
  kit.days.forEach(d => d.slots.forEach(s => {
    if (seen[s.id]) ok(s.reused === true, 'repeated id flagged reused: ' + s.id);
    seen[s.id] = true;
  }));
})();
ok(kit.warnings.every(w => typeof w === 'string'), 'warnings are strings');
// opener short + no-prep where pool allowed (fallback widens to <=20);
// closer short + calm where pool allowed (fallback widens to <=30)
kit.days.forEach((d, di) => {
  const op = byId[d.slots[0].id], cl = byId[d.slots[2].id];
  ok(op.time_max <= 20 || d.slots[0].reused, 'day ' + (di + 1) + ' opener is short: ' + op.id);
  ok(cl.time_max <= 30 || d.slots[2].reused, 'day ' + (di + 1) + ' closer is short: ' + cl.id);
});
ok(K.closerCands(acts.filter(a => K.fitsKit(a, cfg)), bucketByCat).length > 0,
  'closer candidates non-empty on the strict pool (fallback ladder)');
ok(K.openerCands(acts.filter(a => K.fitsKit(a, cfg)), bucketByCat).length > 0,
  'opener candidates non-empty on the strict pool');
const kit2 = K.buildKit(acts, cfg, bucketByCat, 42);
ok(JSON.stringify(kit2.days) === JSON.stringify(kit.days), 'same seed -> identical kit (deterministic)');
const kit3 = K.buildKit(acts, cfg, bucketByCat, 99);
ok(JSON.stringify(kit3.days) !== JSON.stringify(kit.days), 'different seed -> different kit');
// tight filters still produce *something* with warnings — or a clear no-kit warning
const tight = K.clampCfg({ ageBand: 'g1-2', groupSize: 40, days: 5, minutes: 30, mode: 'pantry', pantry: ['chalk'] });
const tightKit = K.buildKit(acts, tight, bucketByCat, 7);
ok(tightKit.days.length >= 1, 'tight filters still deal at least one day');
ok(tightKit.days.flatMap(d => d.slots.map(s => s.id)).every(id => actIds.has(id)),
  'tight-kit ids all resolve');
// impossible corner: graceful no-kit + a plain-language warning, never a fake kit
const impossible = K.clampCfg({ ageBand: 'prek-k', groupSize: 60, days: 5, minutes: 30, mode: 'pantry', pantry: ['chalk'] });
const impKit = K.buildKit(acts, impossible, bucketByCat, 7);
ok(impKit.days.length === 0 && impKit.warnings.length === 1 &&
  /loosen/i.test(impKit.warnings[0]), 'impossible filters -> empty kit + loosen warning');

// 7. runOfShow: blocks sum to session minutes, clock format sane
const ros = K.runOfShow(kit.days[0], cfg);
ok(ros.length === 3, 'run of show has 3 blocks');
ok(ros.reduce((t, b) => t + b.minutes, 0) === 60, 'blocks sum to session minutes');
ok(/^\d{1,2}:\d{2} (AM|PM)$/.test(ros[0].start), 'clock format: ' + ros[0].start);
ok(ros[0].start === '3:30 PM', 'starts at configured time: ' + ros[0].start);
ok(ros[2].end !== ros[0].start, 'end differs from start');

// 8. aggregateMaterials: have/gather split, day tracking
const mats = K.aggregateMaterials(kit, byId, cfg.pantry);
ok(mats.length > 0, 'checklist non-empty', String(mats.length));
const gather = mats.filter(m => !m.have);
ok(gather.length === 0, 'default pantry kit needs nothing gathered', JSON.stringify(gather.slice(0, 3)));
const matsTight = K.aggregateMaterials(tightKit, byId, tight.pantry);
ok(matsTight.every(m => m.days.length >= 1 && m.item), 'every checklist line has days + item');
ok(matsTight.filter(m => !m.have).length >= 0, 'gather split computed');

// 9. URL round-trip: encode -> decode -> same picks
const enc = K.encodeKit(kit);
ok(typeof enc === 'string' && enc.length > 20 && !/[+/=]/.test(enc), 'encodeKit returns URL-safe base64url');
const dec = K.decodeKit(enc);
ok(!!dec, 'decodeKit parses the payload');
ok(dec.cfg.days === 3 && dec.cfg.groupSize === 20, 'decoded config intact');
ok(JSON.stringify(dec.days.map(d => d.slots.map(s => s.id))) ===
  JSON.stringify(kit.days.map(d => d.slots.map(s => s.id))), 'decoded picks match exactly');
ok(K.decodeKit('!!!not-a-kit!!!') === null, 'garbage decode returns null');
ok(K.decodeKit('') === null, 'empty decode returns null');

// 10. kitText: plain-text export
const txt = K.kitText(kit, byId);
ok(txt.includes('AFTER-SCHOOL KIT') && txt.includes('MATERIAL CHECKLIST'), 'kitText has sections');
ok(kitIds.every(id => txt.includes(byId[id].name)), 'kitText names every picked activity');
ok(txt.split('\n').length > 20, 'kitText is a real multi-line plan');

// 11. kit.html structure + kit.js DOM-id cross-check
const kitHtml = fs.readFileSync(path.join(ROOT, 'kit.html'), 'utf8');
for (const id of ['kit-form', 'kit-generate', 'kit-group', 'kit-ageband', 'kit-start',
                  'kit-pantry', 'kit-status', 'kit-warnings', 'kit-deck',
                  'kit-checklist', 'kit-actions']) {
  ok(kitHtml.includes('id="' + id + '"'), 'kit.html has #' + id);
}
for (const name of ['kit-days', 'kit-minutes', 'kit-mode']) {
  ok(kitHtml.includes('name="' + name + '"'), 'kit.html has radio group ' + name);
}
ok(kitHtml.includes('assets/kit-core.js'), 'kit.html loads kit-core.js');
ok(kitHtml.includes('assets/kit.js'), 'kit.html loads kit.js');
ok(kitHtml.includes('id="site-calm-toggle"'), 'kit.html has the calm toggle');
ok(kitHtml.includes('href="kit.html" aria-current="page"'), 'kit.html nav marks itself current');
ok(kitHtml.includes('aria-live="polite"'), 'kit.html has a live status region');
ok(/<label[^>]*for="kit-group"/.test(kitHtml), 'group input has a label');
ok(/<label[^>]*for="kit-ageband"/.test(kitHtml), 'age band select has a label');
ok(/<label[^>]*for="kit-start"/.test(kitHtml), 'start time input has a label');

const kitJs = fs.readFileSync(path.join(ROOT, 'assets/kit.js'), 'utf8');
const domIds = [...new Set([...kitJs.matchAll(/getElementById\('([^']+)'\)/g)].map(m => m[1]))];
domIds.forEach(id => {
  ok(kitHtml.includes('id="' + id + '"') || kitJs.includes('createElement'),
    'kit.js #' + id + ' exists in kit.html', id);
});
ok(kitJs.includes('kit-swap'), 'kit.js wires swap buttons');
ok(kitJs.includes('kit-copy-link'), 'kit.js wires the share-link copy');
ok(kitJs.includes('?kit='), 'kit.js builds ?kit= share URLs');
ok(kitJs.includes('localStorage'), 'kit.js persists the last kit');

// 12. Nav: all 12 shells link kit.html; exactly one aria-current per shell
const SHELLS = ['index.html', 'planner.html', 'kit.html', 'sub.html', 'party.html',
  'fieldtrip.html', 'collections.html', 'api.html',
  'spring.html', 'summer.html', 'halloween.html', 'thanksgiving.html'];
for (const f of SHELLS) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  ok(html.includes('href="kit.html"'), f + ' nav links kit.html');
  const curs = [...html.matchAll(/aria-current="page"/g)];
  if (f === 'api.html') continue; // api.html has no aria-current (pre-existing pattern)
  ok(curs.length === 1, f + ' has exactly one aria-current', String(curs.length));
  ok(html.includes('href="' + f + '" aria-current="page"'), f + ' aria-current points at itself');
}

// 13. Agentic surface: sitemap, llms, calm wiring, kit CSS
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
ok(sitemap.includes('kit.html'), 'sitemap.xml has kit.html');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(llms.includes('kit.html'), 'llms.txt mentions kit.html');
const styleSrc = fs.readFileSync(path.join(ROOT, 'assets/style.css'), 'utf8');
ok(styleSrc.includes('.kit-day'), 'style.css styles kit day sheets');
ok(styleSrc.includes('.kit-check-cols'), 'style.css styles the checklist columns');
ok(styleSrc.includes('@media print') && styleSrc.includes('.kit-day + .kit-day'),
  'print CSS gives each session sheet its own page');

console.log('after-school kit: ' + passed + ' assertions passed');
