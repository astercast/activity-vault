#!/usr/bin/env node
/* Wave 12 assertions: summer pack integrity, tags, collection, planner/party/app wiring.
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
ok(acts.length === 577, '577 activities total', String(acts.length));
ok(actIds.size === acts.length, 'all activity ids unique');

// 1. New tags in the validator vocabulary (single source of truth: build.py)
const buildSrc = fs.readFileSync(path.join(ROOT, 'scripts/build.py'), 'utf8');
for (const t of ['season:summer', 'holiday:july-4th']) {
  ok(buildSrc.includes('"' + t + '"'), 'build.py TAG_IDS has ' + t);
}
// every tag used anywhere is in vocabulary
const vocabSrc = buildSrc.match(/TAG_IDS = \[([\s\S]*?)\]/)[1];
const vocab = new Set([...vocabSrc.matchAll(/"([^"]+)"/g)].map(m => m[1]));
acts.forEach(a => (a.tags || []).forEach(t => ok(vocab.has(t), 'tag in vocabulary: ' + t, a.id)));

// 2. The 25 wave-12 ids are all present
const W12 = ['water-balloon-toss','drip-drip-drop','bucket-brigade-race','sponge-launch-bullseye',
 'foam-noodle-tag','sprinkler-limbo','capture-the-flag-basics','flashlight-tag','chalk-obstacle-course',
 'frisbee-golf-nine','nature-color-scavenger','friendship-bracelet-basics','sun-print-cards',
 'pinwheel-garden','sand-art-bottles','ice-excavation-dig','fan-boat-races','indoor-campfire-circle',
 'shadow-puppet-matinee','camp-week-kickoff','talent-showcase-night','star-spangled-shoebox-parade',
 'liberty-quiz-bowl','longest-day-shadow-track','giant-bubble-chase'];
ok(W12.length === 25, '25 wave-12 ids listed');
W12.forEach(id => ok(actIds.has(id), 'wave-12 id present: ' + id));
// tag split: 23 season-only, 2 july-4th
const byId = Object.fromEntries(acts.map(a => [a.id, a]));
ok(W12.filter(id => JSON.stringify(byId[id].tags) === JSON.stringify(['season:summer'])).length === 23, '23 season:summer-only');
ok(W12.filter(id => (byId[id].tags || []).includes('holiday:july-4th')).length === 2, '2 july-4th-tagged');
// quality bar: steps + both variations on every new activity
W12.forEach(id => {
  const a = byId[id];
  ok(a.steps.length >= 3, 'steps>=3: ' + id);
  ok(a.variations && a.variations.easier && a.variations.harder, 'easier+harder: ' + id);
  ok(a.age_min >= 4 && a.age_max <= 12, 'age range sane: ' + id);
  ok(a.time_min >= 10, 'honest time floor: ' + id);
});
// no medical claims anywhere in the pack
const MED = ['sunscreen is spf', 'uv index', 'heatstroke', 'dehydration', 'hypothermia'];
W12.forEach(id => {
  const blob = JSON.stringify(byId[id]).toLowerCase();
  MED.forEach(w => ok(!blob.includes(w), 'no medical claim "' + w + '": ' + id));
});

// 3. Retro-tags on the 4 older summer activities
for (const id of ['ice-cube-painting', 'water-relay', 'chalk-art', 'water-cycle-in-a-bag']) {
  ok((byId[id].tags || []).includes('season:summer'), 'retro-tagged: ' + id);
}

// 4. Collections: 10 total, summer-splash valid
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 17, '17 collections', String(colls.length));
ok(new Set(colls.map(c => c.id)).size === 17, 'collection ids unique');
const splash = colls.find(c => c.id === 'summer-splash');
ok(!!splash, 'summer-splash exists');
ok(splash.picks.length >= 8 && splash.picks.length <= 12, 'summer-splash 8-12 picks', String(splash.picks.length));
splash.picks.forEach(p => {
  ok(actIds.has(p.id), 'splash pick resolves: ' + p.id);
  ok(p.note && p.note.trim().length > 10, 'splash pick has curator note: ' + p.id);
});

// 5. summer.js: every curated id resolves; group tags valid
const summerSrc = fs.readFileSync(path.join(ROOT, 'assets/summer.js'), 'utf8');
const jsIds = [...summerSrc.matchAll(/\['([a-z0-9-]+)',/g)].map(m => m[1]);
ok(jsIds.length > 20, 'summer.js has curated picks', String(jsIds.length));
jsIds.forEach(id => ok(actIds.has(id), 'summer.js id resolves: ' + id));
const jsTags = [...summerSrc.matchAll(/tag: '([a-z:-]+)'/g)].map(m => m[1]);
jsTags.forEach(t => ok(vocab.has(t), 'summer.js group tag in vocabulary: ' + t));

// 6. planner.js season strip: summer months + july-4th month + labels
const plannerSrc = fs.readFileSync(path.join(ROOT, 'assets/planner.js'), 'utf8');
for (const m of ['5:', '6:', '7:']) ok(plannerSrc.includes(m + " 'season:summer'"), 'planner month ' + m + ' -> season:summer');
ok(plannerSrc.includes("'holiday:july-4th'"), 'planner strip knows july-4th');
ok(plannerSrc.includes("'season:summer': '☀️ Summer'"), 'planner summer label');

// 7. party.js summer theme: shape + pool
const partySrc = fs.readFileSync(path.join(ROOT, 'assets/party.js'), 'utf8');
ok(/summer: \{/.test(partySrc), 'party.js has summer theme');
for (const k of ['label:', 'tags:', 'groupNames:', 'heroKicker:', 'heroTitle:', 'heroLede:',
                 'planKicker:', 'planTitle:', 'breakMin:', 'closingIntro:', 'closingRegroup:']) {
  const block = partySrc.match(/summer: \{([\s\S]*?)\n    \}/)[1];
  ok(block.includes(k), 'summer theme has ' + k);
}
const summerTags = ['holiday:july-4th', 'season:summer'];
const PARTY_CATS = ['crafts', 'pe-movement', 'rainy-day', 'quiet-focus', 'team-community', 'icebreakers'];
const pool = acts.filter(a =>
  (a.tags || []).some(t => summerTags.includes(t)) &&
  a.categories.some(c => PARTY_CATS.includes(c)));
ok(pool.length >= 6, 'summer party pool >= 6', String(pool.length) + ': ' + pool.map(a => a.id).join(','));
// party.html has the summer radio
const partyHtml = fs.readFileSync(path.join(ROOT, 'party.html'), 'utf8');
ok(partyHtml.includes('value="summer"'), 'party.html summer radio');

// 8. app.js tag order + summer promo hook
const appSrc = fs.readFileSync(path.join(ROOT, 'assets/app.js'), 'utf8');
for (const t of ['season:summer', 'holiday:july-4th'])
  ok(appSrc.includes("'" + t + "'"), 'app.js knows ' + t);
ok(appSrc.includes("getElementById('season-promo-summer')"), 'app.js summer promo hook');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok(indexHtml.includes('id="season-promo-summer"'), 'index.html has summer promo section');

// 9. nav: every hand-written shell links summer.html; generated pages do too
for (const f of ['index.html', 'planner.html', 'sub.html', 'party.html', 'collections.html',
                 'api.html', 'spring.html', 'summer.html']) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  ok(html.includes('href="summer.html"'), f + ' nav links summer.html');
}
const samplePage = fs.readFileSync(path.join(ROOT, 'activity/water-balloon-toss.html'), 'utf8');
ok(samplePage.includes('../summer.html'), 'generated activity page nav links summer.html');

// 10. Generated API: filters.json carries the new tags; collections endpoint count
const tagOpts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/filters.json'), 'utf8')).filters.tags.options;
for (const t of ['season:summer', 'holiday:july-4th'])
  ok(tagOpts.includes(t), 'filters.json has ' + t);
const apiColls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/collections.json'), 'utf8'));
ok(apiColls.count === 17 && apiColls.collections.length === 17, 'api collections.json count 17');
ok(apiColls.collections.some(c => c.id === 'summer-splash'), 'api has summer-splash');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/index.json'), 'utf8'));
const collEp = manifest.endpoints.find(e => e.path === 'data/v1/collections.json');
ok(collEp && collEp.records === 17, 'manifest collections records=17');
const actEp = manifest.endpoints.find(e => e.path === 'data/v1/activities.json');
ok(actEp && actEp.records === 577, 'manifest activities records=577', String(actEp && actEp.records));
// schema tag enum carries the new tags
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/schema/activity.schema.json'), 'utf8'));
const enumSrc = JSON.stringify(schema);
for (const t of ['season:summer', 'holiday:july-4th'])
  ok(enumSrc.includes(t), 'activity schema enum has ' + t);

console.log('summer pack: ' + passed + ' assertions passed');
