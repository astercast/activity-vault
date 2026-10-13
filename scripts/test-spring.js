#!/usr/bin/env node
/* Wave 11 assertions: spring pack integrity, tags, collection, planner/party/app wiring.
   Run after scripts/build.py. Exits non-zero on the first failure. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(path.dirname(path.resolve(__filename)));

let passed = 0;
function ok(cond, label, extra) {
  if (!cond) { console.error('FAIL: ' + label + (extra ? ' — ' + extra : '')); process.exit(1); }
  passed++;
  // console.log('ok: ' + label);
}

const acts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/activities.json'), 'utf8'));
const actIds = new Set(acts.map(a => a.id));
ok(acts.length === 661, '661 activities total', String(acts.length));
ok(actIds.size === acts.length, 'all activity ids unique');

// 1. New tags in the validator vocabulary (single source of truth: build.py)
const buildSrc = fs.readFileSync(path.join(ROOT, 'scripts/build.py'), 'utf8');
for (const t of ['season:spring', 'holiday:easter', 'holiday:earth-day']) {
  ok(buildSrc.includes('"' + t + '"'), 'build.py TAG_IDS has ' + t);
}
// every tag used anywhere is in vocabulary
const tagRe = /"((?:season|holiday|theme):[a-z-]+)"/g;
const vocabSrc = buildSrc.match(/TAG_IDS = \[([\s\S]*?)\]/)[1];
const vocab = new Set([...vocabSrc.matchAll(/"([^"]+)"/g)].map(m => m[1]));
acts.forEach(a => (a.tags || []).forEach(t => ok(vocab.has(t), 'tag in vocabulary: ' + t, a.id)));

// 2. The 25 wave-11 ids are all present
const W11 = ['tissue-paper-cherry-blossoms','coffee-filter-butterflies','painted-rock-ladybugs',
 'pressed-flower-bookmarks','egg-carton-tulip-garden','paper-plate-sunflower','worm-weather-watch',
 'puddle-depth-gauge','flower-part-dissect','nest-material-challenge','seed-dispersal-design',
 'sprout-growth-race','bubble-snake-blower','evaporation-chalk-lines','sponge-bucket-relay',
 'puddle-stomp-parade','spring-sound-map','puddle-hopscotch','egg-roll-race','jellybean-sort-graph',
 'easter-egg-catapult','earth-day-trash-audit','seed-ball-wildflowers','recycled-paper-making',
 'thunderstorm-clap-along'];
ok(W11.length === 25, '25 wave-11 ids listed');
W11.forEach(id => ok(actIds.has(id), 'wave-11 id present: ' + id));
// tag split: 18 season-only, 4 easter, 3 earth-day
const byId = Object.fromEntries(acts.map(a => [a.id, a]));
ok(W11.filter(id => JSON.stringify(byId[id].tags) === JSON.stringify(['season:spring'])).length === 19, '19 season:spring-only');
ok(W11.filter(id => (byId[id].tags || []).includes('holiday:easter')).length === 3, '3 easter-tagged');
ok(W11.filter(id => (byId[id].tags || []).includes('holiday:earth-day')).length === 3, '3 earth-day-tagged');
// quality bar: steps + both variations on every new activity
W11.forEach(id => {
  const a = byId[id];
  ok(a.steps.length >= 3, 'steps>=3: ' + id);
  ok(a.variations && a.variations.easier && a.variations.harder, 'easier+harder: ' + id);
  ok(a.age_min >= 4 && a.age_max <= 12, 'age range sane: ' + id);
  ok(a.time_min >= 10, 'honest time floor: ' + id);
});

// 3. Retro-tags on the 4 older spring activities
for (const [id, tags] of [['spring-seed-cups', ['season:spring']],
                          ['spring-bulb-forcing', ['season:spring']],
                          ['kite-flying-basics', ['season:spring']],
                          ['egg-hunt-design', ['season:spring', 'holiday:easter']]]) {
  ok(JSON.stringify(byId[id].tags) === JSON.stringify(tags), 'retro-tagged: ' + id);
}

// 4. Collections: 9 total, spring-burst valid, sub-tub-essentials spring pick
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 24, '24 collections', String(colls.length));
ok(new Set(colls.map(c => c.id)).size === 24, 'collection ids unique');
const burst = colls.find(c => c.id === 'spring-burst');
ok(!!burst, 'spring-burst exists');
ok(burst.picks.length >= 8 && burst.picks.length <= 12, 'spring-burst 8-12 picks', String(burst.picks.length));
burst.picks.forEach(p => {
  ok(actIds.has(p.id), 'burst pick resolves: ' + p.id);
  ok(p.note && p.note.trim().length > 10, 'burst pick has curator note: ' + p.id);
});
const sub = colls.find(c => c.id === 'sub-tub-essentials');
ok(sub.picks.some(p => p.id === 'thunderstorm-clap-along'), 'sub-tub-essentials has spring pick');
ok(sub.picks.length <= 12, 'sub-tub-essentials within cap');

// 5. spring.js: every curated id resolves; group tags valid
const springSrc = fs.readFileSync(path.join(ROOT, 'assets/spring.js'), 'utf8');
const jsIds = [...springSrc.matchAll(/\['([a-z0-9-]+)',/g)].map(m => m[1]);
ok(jsIds.length > 20, 'spring.js has curated picks', String(jsIds.length));
jsIds.forEach(id => ok(actIds.has(id), 'spring.js id resolves: ' + id));
const jsTags = [...springSrc.matchAll(/tag: '([a-z:-]+)'/g)].map(m => m[1]);
jsTags.forEach(t => ok(vocab.has(t), 'spring.js group tag in vocabulary: ' + t));

// 6. planner.js season strip: spring months + holiday months + labels
const plannerSrc = fs.readFileSync(path.join(ROOT, 'assets/planner.js'), 'utf8');
for (const m of ['2:', '3:', '4:']) ok(plannerSrc.includes(m + " 'season:spring'"), 'planner month ' + m + ' -> season:spring');
ok(plannerSrc.includes("'holiday:easter'"), 'planner strip knows easter');
ok(plannerSrc.includes("'holiday:earth-day'"), 'planner strip knows earth-day');
ok(plannerSrc.includes("'season:spring': '🌷 Spring'"), 'planner spring label');

// 7. party.js spring theme: shape + pool
const partySrc = fs.readFileSync(path.join(ROOT, 'assets/party.js'), 'utf8');
ok(/spring: \{/.test(partySrc), 'party.js has spring theme');
for (const k of ['label:', 'tags:', 'groupNames:', 'heroKicker:', 'heroTitle:', 'heroLede:',
                 'planKicker:', 'planTitle:', 'breakMin:', 'closingIntro:', 'closingRegroup:']) {
  const block = partySrc.match(/spring: \{([\s\S]*?)\n    \}/)[1];
  ok(block.includes(k), 'spring theme has ' + k);
}
const springTags = ['holiday:easter', 'holiday:earth-day', 'season:spring'];
const PARTY_CATS = ['crafts', 'pe-movement', 'rainy-day', 'quiet-focus', 'team-community', 'icebreakers'];
const pool = acts.filter(a =>
  (a.tags || []).some(t => springTags.includes(t)) &&
  a.categories.some(c => PARTY_CATS.includes(c)));
ok(pool.length >= 6, 'spring party pool >= 6', String(pool.length) + ': ' + pool.map(a => a.id).join(','));
// party.html has the spring radio
const partyHtml = fs.readFileSync(path.join(ROOT, 'party.html'), 'utf8');
ok(partyHtml.includes('value="spring"'), 'party.html spring radio');

// 8. Sub Tub: the 3 zero-material spring activities flow into the "nothing at all" tier
for (const id of ['puddle-stomp-parade', 'spring-sound-map', 'thunderstorm-clap-along']) {
  const a = byId[id];
  ok(a.materials.length === 0 && a.no_prep === true, 'sub-tub-ready (nothing at all): ' + id);
}

// 9. app.js tag order + season promo hook
const appSrc = fs.readFileSync(path.join(ROOT, 'assets/app.js'), 'utf8');
for (const t of ['season:spring', 'holiday:easter', 'holiday:earth-day'])
  ok(appSrc.includes("'" + t + "'"), 'app.js knows ' + t);
ok(appSrc.includes("getElementById('season-promo')"), 'app.js season promo hook');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok(indexHtml.includes('id="season-promo"'), 'index.html has season promo section');

// 10. Generated API: filters.json carries the new tags; collections endpoint count
const tagOpts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/filters.json'), 'utf8')).filters.tags.options;
for (const t of ['season:spring', 'holiday:easter', 'holiday:earth-day'])
  ok(tagOpts.includes(t), 'filters.json has ' + t);
const apiColls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/collections.json'), 'utf8'));
ok(apiColls.count === 24 && apiColls.collections.length === 24, 'api collections.json count 24');
ok(apiColls.collections.some(c => c.id === 'spring-burst'), 'api has spring-burst');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/index.json'), 'utf8'));
const collEp = manifest.endpoints.find(e => e.path === 'data/v1/collections.json');
ok(collEp && collEp.records === 24, 'manifest collections records=24');
const actEp = manifest.endpoints.find(e => e.path === 'data/v1/activities.json');
ok(actEp && actEp.records === 661, 'manifest activities records=661', String(actEp && actEp.records));

console.log('spring pack: ' + passed + ' assertions passed');
