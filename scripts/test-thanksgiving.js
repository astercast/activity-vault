#!/usr/bin/env node
/* Wave 14 assertions: Thanksgiving pack integrity, holiday:thanksgiving tag
   vocabulary, retro-tags, Grateful Gathering collection, hub page,
   planner/party/app wiring, nav aria-current.
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
ok(acts.length === 673, '673 activities total', String(acts.length));
ok(actIds.size === acts.length, 'all activity ids unique');

// 1. Tag vocabulary: holiday:thanksgiving is NEW in wave 14 — confirm it is
//    in the validator, app.js labels/order, planner labels, and the schema.
const buildSrc = fs.readFileSync(path.join(ROOT, 'scripts/build.py'), 'utf8');
ok(buildSrc.includes('"holiday:thanksgiving"'), 'build.py TAG_IDS has holiday:thanksgiving');
const vocabSrc = buildSrc.match(/TAG_IDS = \[([\s\S]*?)\]/)[1];
const vocab = new Set([...vocabSrc.matchAll(/"([^"]+)"/g)].map(m => m[1]));
ok(vocab.has('holiday:thanksgiving'), 'holiday:thanksgiving parsed from TAG_IDS');
acts.forEach(a => (a.tags || []).forEach(t => ok(vocab.has(t), 'tag in vocabulary: ' + t, a.id)));
const appSrc = fs.readFileSync(path.join(ROOT, 'assets/app.js'), 'utf8');
ok(appSrc.includes("'holiday:thanksgiving': '🦃 Thanksgiving'"), 'app.js TAG_LABELS has thanksgiving');
ok(/TAG_ORDER = \[[^\]]*'holiday:thanksgiving'/.test(appSrc), 'app.js TAG_ORDER has thanksgiving');
const plannerSrc = fs.readFileSync(path.join(ROOT, 'assets/planner.js'), 'utf8');
ok(plannerSrc.includes("'holiday:thanksgiving': '🦃 Thanksgiving'"), 'planner.js SEASON_LABELS has thanksgiving');
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/schema/activity.schema.json'), 'utf8'));
ok(JSON.stringify(schema).includes('holiday:thanksgiving'), 'activity schema enum has holiday:thanksgiving');
const tagOpts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/filters.json'), 'utf8')).filters.tags.options;
ok(tagOpts.includes('holiday:thanksgiving'), 'filters.json has holiday:thanksgiving');
const tagLabels = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/filters.json'), 'utf8')).filters.tags.labels;
ok(tagLabels['holiday:thanksgiving'] === '🦃 Thanksgiving', 'filters.json label for thanksgiving');

// 2. The 21 wave-14 ids are all present (18 core + 3 research STEM from the
//    2026-10-11 activity-ideas research mission)
const W14 = ['thankful-turkey-handprints','paper-cornucopia-build','friendsgiving-place-cards','harvest-weave-placemats',
 'turkey-tag-chase','pumpkin-bucket-toss','harvest-basket-relay',
 'cranberry-toothpick-towers','turkey-baster-relay','shake-jar-butter',
 'friendsgiving-potluck-plan','friendsgiving-story-circle',
 'gratitude-alphabet-circle','thankful-jar-shares','gratitude-all-year',
 'food-drive-planning','staff-thank-you-cards','blessing-bag-pack',
 'turkey-code-feathers','cornucopia-catch-game','thanksgiving-table-build'];
ok(W14.length === 21, '21 wave-14 ids listed');
W14.forEach(id => ok(actIds.has(id), 'wave-14 id present: ' + id));
const byId = Object.fromEntries(acts.map(a => [a.id, a]));
// tag split: 16 thanksgiving-only / 4 fall+thanksgiving / 1 fall-only
const tagKey = id => JSON.stringify((byId[id].tags || []).slice().sort());
ok(W14.filter(id => tagKey(id) === JSON.stringify(['holiday:thanksgiving'])).length === 16, '16 thanksgiving-only');
ok(W14.filter(id => tagKey(id) === JSON.stringify(['holiday:thanksgiving','season:fall'])).length === 4, '4 fall+thanksgiving');
ok(W14.filter(id => tagKey(id) === JSON.stringify(['season:fall'])).length === 1, '1 fall-only');
W14.forEach(id => ok((byId[id].tags || []).includes('holiday:thanksgiving') || id === 'harvest-weave-placemats',
  'thanksgiving-tagged or fall harvest: ' + id));
// quality bar: steps + both variations + sane ages + honest time floors on every new activity
W14.forEach(id => {
  const a = byId[id];
  ok(a.steps.length >= 3, 'steps>=3: ' + id);
  ok(a.variations && a.variations.easier && a.variations.harder, 'easier+harder: ' + id);
  ok(a.age_min >= 3 && a.age_max <= 18 && a.age_min <= a.age_max, 'age range sane: ' + id);
  ok(a.time_min >= 10, 'honest time floor: ' + id);
});
// no medical claims anywhere in the pack
const MED = ['sunscreen is spf', 'uv index', 'heatstroke', 'dehydration', 'hypothermia',
             'boosts immunity', 'cures ', 'lowers blood'];
W14.forEach(id => {
  const blob = JSON.stringify(byId[id]).toLowerCase();
  MED.forEach(w => ok(!blob.includes(w), 'no medical claim "' + w + '": ' + id));
});
// food activities carry practical allergy/dairy notes (no medical claims, just checks)
W14.forEach(id => {
  const blob = JSON.stringify(byId[id]).toLowerCase();
  if (blob.includes('cream') || blob.includes('cranberr') || blob.includes('snack') || blob.includes('dish')) {
    ok(blob.includes('allerg'), 'food activity has allergy check note: ' + id);
  }
});
// inclusive framing: the pack names the alternative explicitly
ok(JSON.stringify(byId['gratitude-all-year']).toLowerCase().includes('not every family celebrates'),
  'gratitude-all-year names non-celebrants');
ok(JSON.stringify(byId['friendsgiving-potluck-plan']).toLowerCase().includes('harvest feast'),
  'friendsgiving-potluck-plan notes the harvest-feast alternative name');

// 3. Retro-tags on the 5 older Thanksgiving-appropriate activities (tags only)
ok(JSON.stringify(byId['gratitude-tree'].tags) === JSON.stringify(['holiday:thanksgiving']),
  'retro-tagged: gratitude-tree', JSON.stringify(byId['gratitude-tree'].tags));
ok(JSON.stringify(byId['gratitude-journals'].tags) === JSON.stringify(['holiday:thanksgiving']),
  'retro-tagged: gratitude-journals', JSON.stringify(byId['gratitude-journals'].tags));
ok(JSON.stringify(byId['harvest-thanksgiving-skits'].tags) === JSON.stringify(['holiday:thanksgiving']),
  'retro-tagged: harvest-thanksgiving-skits', JSON.stringify(byId['harvest-thanksgiving-skits'].tags));
ok(JSON.stringify((byId['gratitude-door-decor'].tags || []).slice().sort()) ===
   JSON.stringify(['holiday:thanksgiving', 'season:fall']),
  'retro-tagged: gratitude-door-decor', JSON.stringify(byId['gratitude-door-decor'].tags));
ok(JSON.stringify((byId['harvest-gratitude-circle'].tags || []).slice().sort()) ===
   JSON.stringify(['holiday:thanksgiving', 'season:fall']),
  'retro-tagged: harvest-gratitude-circle', JSON.stringify(byId['harvest-gratitude-circle'].tags));

// 4. Collections: 12 total, grateful-gathering valid
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 25, '25 collections', String(colls.length));
ok(new Set(colls.map(c => c.id)).size === 25, 'collection ids unique');
const gg = colls.find(c => c.id === 'grateful-gathering');
ok(!!gg, 'grateful-gathering exists');
ok(gg.glyph === '🦃', 'grateful-gathering glyph');
ok(gg.picks.length === 12, 'grateful-gathering 12 picks', String(gg.picks.length));
gg.picks.forEach(p => {
  ok(actIds.has(p.id), 'grateful-gathering pick resolves: ' + p.id);
  ok(p.note && p.note.trim().length > 10, 'grateful-gathering pick has curator note: ' + p.id);
});

// 5. thanksgiving.js: every curated id resolves; group tags valid
const tgSrc = fs.readFileSync(path.join(ROOT, 'assets/thanksgiving.js'), 'utf8');
const jsIds = [...tgSrc.matchAll(/\['([a-z0-9-]+)',/g)].map(m => m[1]);
ok(jsIds.length >= 20, 'thanksgiving.js has curated picks', String(jsIds.length));
ok(new Set(jsIds).size === jsIds.length, 'thanksgiving.js curated ids unique');
jsIds.forEach(id => ok(actIds.has(id), 'thanksgiving.js id resolves: ' + id));
const jsTags = [...tgSrc.matchAll(/tag: '([a-z:-]+)'/g)].map(m => m[1]);
jsTags.forEach(t => ok(vocab.has(t), 'thanksgiving.js group tag in vocabulary: ' + t));
// inclusive copy on the hub JS + HTML
ok(tgSrc.toLowerCase().includes('not every family celebrates'), 'thanksgiving.js gratitude section blurb is inclusive');
const tgHtml = fs.readFileSync(path.join(ROOT, 'thanksgiving.html'), 'utf8');
ok(tgHtml.toLowerCase().includes('not every family celebrates'), 'thanksgiving.html hero lede is inclusive');
// hero deep links
ok(fs.readFileSync(path.join(ROOT, 'thanksgiving.html'), 'utf8').includes('collection:grateful-gathering'),
  'hub links the grateful-gathering collection');

// 6. thanksgiving.html: hub structure (status live region, sections host, scripts)
ok(tgHtml.includes('id="thanksgiving-status"'), 'thanksgiving.html has live status region');
ok(tgHtml.includes('role="status"'), 'thanksgiving.html status is a live region');
ok(tgHtml.includes('id="thanksgiving-sections"'), 'thanksgiving.html has sections host');
ok(tgHtml.includes('assets/thanksgiving.js'), 'thanksgiving.html loads thanksgiving.js');
ok(tgHtml.includes('assets/ratings.js'), 'thanksgiving.html loads ratings.js');
ok(tgHtml.includes('skip-link'), 'thanksgiving.html has skip link');

// 7. planner.js: November maps to thanksgiving
ok(plannerSrc.includes("10: ['holiday:thanksgiving'"), 'planner November -> holiday:thanksgiving');

// 8. party.js: thanksgiving theme exists; pool grows with the new pack
const partySrc = fs.readFileSync(path.join(ROOT, 'assets/party.js'), 'utf8');
ok(/thanksgiving: \{/.test(partySrc), 'party.js has thanksgiving theme');
for (const k of ['label:', 'tags:', 'groupNames:', 'heroKicker:', 'heroTitle:', 'heroLede:',
                 'planKicker:', 'planTitle:', 'breakMin:', 'closingIntro:', 'closingRegroup:']) {
  const block = partySrc.match(/thanksgiving: \{([\s\S]*?)\n    \}/)[1];
  ok(block.includes(k), 'thanksgiving theme has ' + k);
}
const partyHtml = fs.readFileSync(path.join(ROOT, 'party.html'), 'utf8');
ok(partyHtml.includes('value="thanksgiving"'), 'party.html has thanksgiving radio chip');
ok(partyHtml.includes('Thanksgiving party theme') || partyHtml.includes('🦃 Thanksgiving'), 'party.html mentions thanksgiving');
const tgTags = ['holiday:thanksgiving', 'season:fall'];
const PARTY_CATS = ['crafts', 'pe-movement', 'rainy-day', 'quiet-focus', 'team-community', 'icebreakers'];
const pool = acts.filter(a =>
  (a.tags || []).some(t => tgTags.includes(t)) &&
  a.categories.some(c => PARTY_CATS.includes(c)));
ok(pool.length >= 6, 'thanksgiving party pool >= 6', String(pool.length));
const newInPool = pool.filter(a => W14.includes(a.id)).length;
ok(newInPool >= 6, 'new thanksgiving pack feeds the party pool', String(newInPool));

// 9. app.js November promo hook + index.html promo section
ok(appSrc.includes("getElementById('season-promo-thanksgiving')"), 'app.js thanksgiving promo hook');
ok(/pm === 10/.test(appSrc), 'app.js gates thanksgiving promo on November (month 10)');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok(indexHtml.includes('id="season-promo-thanksgiving"'), 'index.html has thanksgiving promo section');
ok(indexHtml.includes('collections.html#grateful-gathering'), 'promo links grateful-gathering');
ok(indexHtml.includes('thanksgiving.html'), 'promo links thanksgiving.html');

// research integration (wave 14 scope-up): the 3 STEM activities carry source
// links and copy-free flags; research fields validate across the dataset
const RESEARCH3 = ['turkey-code-feathers','cornucopia-catch-game','thanksgiving-table-build'];
RESEARCH3.forEach(id => {
  ok((byId[id].source || '').startsWith('https://'), 'research activity has source URL: ' + id);
  ok(byId[id].copy_free === true, 'research activity is copy-free: ' + id);
});
ok(acts.filter(a => a.copy_free).length === 293, '269 copy_free notes (197 + 12 wave-28 + 12 wave-29 + 12 wave-30 + 12 wave-31 + 12 wave-32 + 12 wave-33)', String(acts.filter(a => a.copy_free).length));
ok(acts.filter(a => a.no_elimination).length === 105, '87 no_elimination notes (57 + 6 wave-28 + 7 wave-29 + 5 wave-30 + 6 wave-31 + 6 wave-32)');
ok(acts.filter(a => a.inclusion).length === 155, '119 inclusion notes (75 + 6 wave-28 + 6 wave-29 + 8 wave-30 + 12 wave-31 + 12 wave-32)');
// research fields appear on built pages
const cfPage = fs.readFileSync(path.join(ROOT, 'activity/turkey-code-feathers.html'), 'utf8');
ok(cfPage.includes('Copy-free'), 'copy-free badge renders on activity page');
ok(cfPage.includes('source post'), 'source attribution renders on activity page');
const whyPage = fs.readFileSync(path.join(ROOT, 'activity/cornucopia-catch-game.html'), 'utf8');
ok(whyPage.includes('Why it works'), 'why_it_works renders on activity page');
const inclPage = fs.readFileSync(path.join(ROOT, 'activity/thankful-turkey-handprints.html'), 'utf8');
ok(inclPage.includes('Inclusion notes'), 'inclusion notes render on activity page');
// nav audit (wave 14 scope-up): breadcrumbs, related cross-links, deep links
ok(inclPage.includes('?cats=crafts'), 'breadcrumb links the primary category deep link');
ok(inclPage.includes('h-related'), 'related-activities block renders');
const relIds = [...inclPage.matchAll(/href="([a-z0-9-]+)\.html"/g)].map(m => m[1])
  .filter(id => id !== 'thankful-turkey-handprints');
ok(relIds.length >= 3, 'related block has >=3 cross-links', String(relIds.length));
relIds.forEach(id => ok(actIds.has(id), 'related cross-link resolves: ' + id));
ok(appSrc.includes('copyFreeOnly'), 'app.js has copyFreeOnly filter state');
ok(appSrc.includes('noElimOnly'), 'app.js has noElimOnly filter state');
ok(appSrc.includes("get('cats')"), 'app.js parses ?cats= deep links');
ok(appSrc.includes('data-cat'), 'app.js marks category buttons with data-cat');
// web-craft round 2: calm toggle + site.js on every shell, gated view transitions
const styleSrc = fs.readFileSync(path.join(ROOT, 'assets/style.css'), 'utf8');
ok(/@media \(prefers-reduced-motion: no-preference\) \{\s*@view-transition/.test(styleSrc),
  'view-transition opt-in is reduced-motion gated (round-2 correction)');
ok(styleSrc.includes('data-calm="true"'), 'style.css has calm-mode kill rules');
ok(styleSrc.includes('content-visibility'), 'style.css uses content-visibility on listings');
ok(fs.existsSync(path.join(ROOT, 'assets/site.js')), 'assets/site.js exists');
const siteSrc = fs.readFileSync(path.join(ROOT, 'assets/site.js'), 'utf8');
ok(siteSrc.includes('activityvault.calm.v1'), 'site.js uses the shared calm storage key');
ok(siteSrc.includes('prefetch'), 'site.js prefetches nav links on hover/focus');

// 10. Nav: all 12 shells link thanksgiving.html; exactly one aria-current per shell,
//     pointing at that shell (wave-12 lesson: verify aria-current explicitly)
const SHELLS = {
  'index.html': 'index.html', 'planner.html': 'planner.html', 'kit.html': 'kit.html', 'sub.html': 'sub.html',
  'party.html': 'party.html', 'fieldtrip.html': 'fieldtrip.html',
  'collections.html': 'collections.html', 'api.html': null,
  'spring.html': 'spring.html', 'summer.html': 'summer.html', 'halloween.html': 'halloween.html',
  'thanksgiving.html': 'thanksgiving.html'
};
for (const [f, current] of Object.entries(SHELLS)) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  ok(html.includes('href="thanksgiving.html"'), f + ' nav links thanksgiving.html');
  const curs = [...html.matchAll(/aria-current="page"/g)];
  if (current) {
    ok(curs.length === 1, f + ' has exactly one aria-current', String(curs.length));
    ok(html.includes('href="' + current + '" aria-current="page"'),
      f + ' aria-current points at itself');
    if (f !== 'thanksgiving.html') {
      ok(!html.includes('href="thanksgiving.html" aria-current="page"'),
        f + ' does not mark thanksgiving as current');
    }
  }
  ok(html.includes('id="site-calm-toggle"'), f + ' has the site-wide calm toggle');
  ok(html.includes('assets/site.js'), f + ' loads site.js');
}
// generated activity pages link the hub too
const samplePage = fs.readFileSync(path.join(ROOT, 'activity/thankful-turkey-handprints.html'), 'utf8');
ok(samplePage.includes('../thanksgiving.html'), 'generated activity page nav links thanksgiving.html');

// 11. Generated API: filters.json + collections + manifest + schema + sitemap + llms
const apiColls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/collections.json'), 'utf8'));
ok(apiColls.count === 25 && apiColls.collections.length === 25, 'api collections.json count 25');
ok(apiColls.collections.some(c => c.id === 'grateful-gathering'), 'api has grateful-gathering');
const coll = apiColls.collections.find(c => c.id === 'grateful-gathering');
ok(coll.page === 'collections.html#grateful-gathering', 'grateful-gathering deep link');
ok(coll.age_span.length === 2 && coll.time_span.length === 2, 'grateful-gathering spans computed');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/index.json'), 'utf8'));
const collEp = manifest.endpoints.find(e => e.path === 'data/v1/collections.json');
ok(collEp && collEp.records === 25, 'manifest collections records=25');
const actEp = manifest.endpoints.find(e => e.path === 'data/v1/activities.json');
ok(actEp && actEp.records === 673, 'manifest activities records=673', String(actEp && actEp.records));
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
ok(sitemap.includes('thanksgiving.html'), 'sitemap.xml has thanksgiving.html');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(llms.includes('thanksgiving.html'), 'llms.txt mentions thanksgiving.html');
ok(llms.includes('grateful gathering'), 'llms.txt mentions grateful gathering');

console.log('thanksgiving pack: ' + passed + ' assertions passed');
