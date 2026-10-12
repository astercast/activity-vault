#!/usr/bin/env node
/* Wave 13 assertions: Halloween pack integrity, retro-tags, Haunted Halls
   collection, hub page, planner/party/app wiring, nav aria-current.
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

const acts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/activities.json'), 'utf8'));
const actIds = new Set(acts.map(a => a.id));
ok(acts.length === 497, '497 activities total', String(acts.length));
ok(actIds.size === acts.length, 'all activity ids unique');

// 1. Tag vocabulary: holiday:halloween predates this wave (wave 4); confirm it is
//    still in the validator, app.js, and the schema — no new tag was needed.
const buildSrc = fs.readFileSync(path.join(ROOT, 'scripts/build.py'), 'utf8');
ok(buildSrc.includes('"holiday:halloween"'), 'build.py TAG_IDS has holiday:halloween');
ok(buildSrc.includes('"theme:spooky"'), 'build.py TAG_IDS has theme:spooky');
const vocabSrc = buildSrc.match(/TAG_IDS = \[([\s\S]*?)\]/)[1];
const vocab = new Set([...vocabSrc.matchAll(/"([^"]+)"/g)].map(m => m[1]));
acts.forEach(a => (a.tags || []).forEach(t => ok(vocab.has(t), 'tag in vocabulary: ' + t, a.id)));

// 2. The 20 wave-13 ids are all present
const W13 = ['ghost-garland-string','monster-mask-making','lollipop-ghost-treats','pressed-leaf-mandala',
 'costume-runway-walk','costume-piece-relay','mystery-feel-boxes','monster-mash-dance','apple-string-bite',
 'pumpkin-volcano-fizz','candy-chromatography','monster-slime-lab','haunted-house-blueprint',
 'apple-tasting-party','harvest-gratitude-circle','pumpkin-guts-sensory',
 'trunk-or-treat-planning','reverse-trick-or-treat','teal-pumpkin-project','trick-or-treat-route-map'];
ok(W13.length === 20, '20 wave-13 ids listed');
W13.forEach(id => ok(actIds.has(id), 'wave-13 id present: ' + id));
const byId = Object.fromEntries(acts.map(a => [a.id, a]));
// tag split: 8 halloween-only / 7 halloween+spooky / 4 fall+halloween / 1 fall-only
const tagKey = id => JSON.stringify((byId[id].tags || []).slice().sort());
ok(W13.filter(id => tagKey(id) === JSON.stringify(['holiday:halloween'])).length === 8, '8 halloween-only');
ok(W13.filter(id => tagKey(id) === JSON.stringify(['holiday:halloween','theme:spooky'])).length === 7, '7 halloween+spooky');
ok(W13.filter(id => tagKey(id) === JSON.stringify(['holiday:halloween','season:fall'])).length === 4, '4 fall+halloween');
// wave 14 retro-tagged harvest-gratitude-circle with holiday:thanksgiving (was the 1 fall-only)
ok(tagKey('harvest-gratitude-circle') === JSON.stringify(['holiday:thanksgiving','season:fall']), 'harvest-gratitude-circle now fall+thanksgiving');
W13.forEach(id => ok((byId[id].tags || []).includes('holiday:halloween') || id === 'harvest-gratitude-circle',
  'halloween-tagged or harvest: ' + id));
// quality bar: steps + both variations + sane ages + honest time floors on every new activity
W13.forEach(id => {
  const a = byId[id];
  ok(a.steps.length >= 3, 'steps>=3: ' + id);
  ok(a.variations && a.variations.easier && a.variations.harder, 'easier+harder: ' + id);
  ok(a.age_min >= 3 && a.age_max <= 18 && a.age_min <= a.age_max, 'age range sane: ' + id);
  ok(a.time_min >= 10, 'honest time floor: ' + id);
});
// no medical claims anywhere in the pack
const MED = ['sunscreen is spf', 'uv index', 'heatstroke', 'dehydration', 'hypothermia'];
W13.forEach(id => {
  const blob = JSON.stringify(byId[id]).toLowerCase();
  MED.forEach(w => ok(!blob.includes(w), 'no medical claim "' + w + '": ' + id));
});
// sharp/blade safety: knife work is always adult-only in the new pack
W13.forEach(id => {
  const blob = JSON.stringify(byId[id]).toLowerCase();
  if (blob.includes('knife') || blob.includes('carv')) {
    ok(blob.includes('adult'), 'knife/carve work is adult-only: ' + id);
  }
});

// 3. Retro-tags on the 2 older Halloween-appropriate activities (tags only)
ok(JSON.stringify(byId['halloween-mummy-wrap'].tags) === JSON.stringify(['holiday:halloween']),
  'retro-tagged: halloween-mummy-wrap', JSON.stringify(byId['halloween-mummy-wrap'].tags));
ok(JSON.stringify((byId['pumpkin-letter-hunt'].tags || []).slice().sort()) ===
   JSON.stringify(['holiday:halloween', 'season:fall']),
  'retro-tagged: pumpkin-letter-hunt', JSON.stringify(byId['pumpkin-letter-hunt'].tags));

// 4. Collections: 11 total, haunted-halls valid
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 14, '14 collections', String(colls.length));
ok(new Set(colls.map(c => c.id)).size === 14, 'collection ids unique');
const halls = colls.find(c => c.id === 'haunted-halls');
ok(!!halls, 'haunted-halls exists');
ok(halls.glyph === '👻', 'haunted-halls glyph');
ok(halls.picks.length === 12, 'haunted-halls 12 picks', String(halls.picks.length));
halls.picks.forEach(p => {
  ok(actIds.has(p.id), 'haunted-halls pick resolves: ' + p.id);
  ok(p.note && p.note.trim().length > 10, 'haunted-halls pick has curator note: ' + p.id);
});

// 5. halloween.js: every curated id resolves; group tags valid; spook levels valid
const hwSrc = fs.readFileSync(path.join(ROOT, 'assets/halloween.js'), 'utf8');
const jsIds = [...hwSrc.matchAll(/\['([a-z0-9-]+)',/g)].map(m => m[1]);
ok(jsIds.length >= 30, 'halloween.js has curated picks', String(jsIds.length));
ok(new Set(jsIds).size === jsIds.length, 'halloween.js curated ids unique');
jsIds.forEach(id => ok(actIds.has(id), 'halloween.js id resolves: ' + id));
const jsTags = [...hwSrc.matchAll(/tag: '([a-z:-]+)'/g)].map(m => m[1]);
jsTags.forEach(t => ok(vocab.has(t), 'halloween.js group tag in vocabulary: ' + t));
const jsSpooks = [...hwSrc.matchAll(/, '(none|fun|mild)'\]/g)].map(m => m[1]);
ok(jsSpooks.length === jsIds.length, 'every pick has a spook level', jsSpooks.length + '/' + jsIds.length);
ok(jsSpooks.includes('none') && jsSpooks.includes('fun') && jsSpooks.includes('mild'),
  'all three spook levels used');
// hero deep links
ok(hwSrc.includes('haunted-halls') || fs.readFileSync(path.join(ROOT, 'halloween.html'), 'utf8').includes('collection:haunted-halls'),
  'hub links the haunted-halls collection');

// 6. halloween.html: spookiness filter markup (buttons, aria-pressed, levels)
const hwHtml = fs.readFileSync(path.join(ROOT, 'halloween.html'), 'utf8');
for (const lvl of ['all', 'none', 'fun', 'mild'])
  ok(hwHtml.includes('data-spook="' + lvl + '"'), 'halloween.html spook filter button: ' + lvl);
ok(hwHtml.includes('aria-pressed="true"'), 'halloween.html filter has aria-pressed');
ok(hwHtml.includes('Spookiness level'), 'halloween.html filter labelled');
ok(hwHtml.includes('id="halloween-status"'), 'halloween.html has live status region');
ok(hwHtml.includes('role="status"'), 'halloween.html status is a live region');

// 7. planner.js: October already maps to halloween (pre-existing); pin it
const plannerSrc = fs.readFileSync(path.join(ROOT, 'assets/planner.js'), 'utf8');
ok(plannerSrc.includes("9: ['holiday:halloween'"), 'planner October -> holiday:halloween');

// 8. party.js: halloween theme exists (pre-existing); pool grows with the new pack
const partySrc = fs.readFileSync(path.join(ROOT, 'assets/party.js'), 'utf8');
ok(/halloween: \{/.test(partySrc), 'party.js has halloween theme');
for (const k of ['label:', 'tags:', 'groupNames:', 'heroKicker:', 'heroTitle:', 'heroLede:',
                 'planKicker:', 'planTitle:', 'breakMin:', 'closingIntro:', 'closingRegroup:']) {
  const block = partySrc.match(/halloween: \{([\s\S]*?)\n    \}/)[1];
  ok(block.includes(k), 'halloween theme has ' + k);
}
const hwTags = ['holiday:halloween', 'holiday:dia-de-muertos', 'season:fall', 'theme:spooky'];
const PARTY_CATS = ['crafts', 'pe-movement', 'rainy-day', 'quiet-focus', 'team-community', 'icebreakers'];
const pool = acts.filter(a =>
  (a.tags || []).some(t => hwTags.includes(t)) &&
  a.categories.some(c => PARTY_CATS.includes(c)));
ok(pool.length >= 6, 'halloween party pool >= 6', String(pool.length));
const newInPool = pool.filter(a => W13.includes(a.id)).length;
ok(newInPool >= 6, 'new halloween pack feeds the party pool', String(newInPool));

// 9. app.js October promo hook + index.html promo section
const appSrc = fs.readFileSync(path.join(ROOT, 'assets/app.js'), 'utf8');
ok(appSrc.includes("getElementById('season-promo-halloween')"), 'app.js halloween promo hook');
ok(/pm === 9/.test(appSrc), 'app.js gates halloween promo on October (month 9)');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok(indexHtml.includes('id="season-promo-halloween"'), 'index.html has halloween promo section');
ok(indexHtml.includes('collections.html#haunted-halls'), 'promo links haunted-halls');
ok(indexHtml.includes('halloween.html'), 'promo links halloween.html');

// 10. Nav: all 10 shells link halloween.html; exactly one aria-current per shell,
//     pointing at that shell (wave-12 lesson: verify aria-current explicitly)
const SHELLS = {
  'index.html': 'index.html', 'planner.html': 'planner.html', 'kit.html': 'kit.html', 'sub.html': 'sub.html',
  'party.html': 'party.html', 'collections.html': 'collections.html', 'api.html': null,
  'spring.html': 'spring.html', 'summer.html': 'summer.html', 'halloween.html': 'halloween.html'
};
for (const [f, current] of Object.entries(SHELLS)) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  ok(html.includes('href="halloween.html"'), f + ' nav links halloween.html');
  const curs = [...html.matchAll(/aria-current="page"/g)];
  if (current) {
    ok(curs.length === 1, f + ' has exactly one aria-current', String(curs.length));
    ok(html.includes('href="' + current + '" aria-current="page"'),
      f + ' aria-current points at itself');
    if (f !== 'halloween.html') {
      ok(!html.includes('href="halloween.html" aria-current="page"'),
        f + ' does not mark halloween as current');
    }
  }
}
// generated activity pages link the hub too
const samplePage = fs.readFileSync(path.join(ROOT, 'activity/ghost-garland-string.html'), 'utf8');
ok(samplePage.includes('../halloween.html'), 'generated activity page nav links halloween.html');

// 11. Generated API: filters.json + collections + manifest + schema + sitemap + llms
const tagOpts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/filters.json'), 'utf8')).filters.tags.options;
ok(tagOpts.includes('holiday:halloween'), 'filters.json has holiday:halloween');
const apiColls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/collections.json'), 'utf8'));
ok(apiColls.count === 14 && apiColls.collections.length === 14, 'api collections.json count 14');
ok(apiColls.collections.some(c => c.id === 'haunted-halls'), 'api has haunted-halls');
const hh = apiColls.collections.find(c => c.id === 'haunted-halls');
ok(hh.page === 'collections.html#haunted-halls', 'haunted-halls deep link');
ok(hh.age_span.length === 2 && hh.time_span.length === 2, 'haunted-halls spans computed');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/index.json'), 'utf8'));
const collEp = manifest.endpoints.find(e => e.path === 'data/v1/collections.json');
ok(collEp && collEp.records === 14, 'manifest collections records=14');
const actEp = manifest.endpoints.find(e => e.path === 'data/v1/activities.json');
ok(actEp && actEp.records === 497, 'manifest activities records=497', String(actEp && actEp.records));
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/schema/activity.schema.json'), 'utf8'));
ok(JSON.stringify(schema).includes('holiday:halloween'), 'activity schema enum has holiday:halloween');
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
ok(sitemap.includes('halloween.html'), 'sitemap.xml has halloween.html');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(llms.includes('halloween.html'), 'llms.txt mentions halloween.html');
ok(llms.includes('haunted halls'), 'llms.txt mentions haunted halls');

console.log('halloween pack: ' + passed + ' assertions passed');
