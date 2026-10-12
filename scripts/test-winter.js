#!/usr/bin/env node
/* Wave 22 assertions: the Winter Holidays pack (30 activities) + gap fills (12),
   holiday:christmas/hanukkah/kwanzaa/new-year tag vocabulary, the Winter Lights
   collection (14th), winter hub page, planner/party/app wiring, nav aria-current.
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
ok(acts.length === 550, '550 activities total', String(acts.length));
ok(actIds.size === acts.length, 'all activity ids unique');

// 1. Tag vocabulary: the four winter holiday tags are in the validator,
//    app.js labels/order, planner labels, schema, filters.json.
const buildSrc = fs.readFileSync(path.join(ROOT, 'scripts/build.py'), 'utf8');
const vocabSrc = buildSrc.match(/TAG_IDS = \[([\s\S]*?)\]/)[1];
const vocab = new Set([...vocabSrc.matchAll(/"([^"]+)"/g)].map(m => m[1]));
const WINTER_TAGS = ['holiday:christmas', 'holiday:hanukkah', 'holiday:kwanzaa', 'holiday:new-year', 'season:winter'];
WINTER_TAGS.forEach(t => ok(vocab.has(t), 'TAG_IDS has ' + t));
acts.forEach(a => (a.tags || []).forEach(t => ok(vocab.has(t), 'tag in vocabulary: ' + t, a.id)));
const appSrc = fs.readFileSync(path.join(ROOT, 'assets/app.js'), 'utf8');
[['holiday:christmas', '🎄 Christmas'], ['holiday:hanukkah', '🕎 Hanukkah'],
 ['holiday:kwanzaa', '🖤 Kwanzaa'], ['holiday:new-year', '🎆 New Year']].forEach(([t, label]) => {
  ok(appSrc.includes("'" + t + "': '" + label + "'"), 'app.js TAG_LABELS has ' + t);
});
const plannerSrc = fs.readFileSync(path.join(ROOT, 'assets/planner.js'), 'utf8');
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/schema/activity.schema.json'), 'utf8'));
WINTER_TAGS.forEach(t => ok(JSON.stringify(schema).includes(t), 'activity schema enum has ' + t));
const filters = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/filters.json'), 'utf8')).filters.tags;
WINTER_TAGS.forEach(t => ok(filters.options.includes(t), 'filters.json has ' + t));

// 2. The 30 wave-22 winter ids are all present
const W22 = [
  'ornament-geometry-stars','jingle-bell-rhythm-band','christmas-light-circuit-cards','candy-cane-olympics',
  'gumdrop-bridge-build','holiday-card-print-shop','reindeer-relay-race','advent-kindness-envelopes',
  'dreidel-spin-physics','menorah-mosaic-tiles','hanukkah-story-circle','gelt-math-market','blue-white-weaving',
  'kinara-candle-counting','kente-pattern-strips','ujima-unity-mural','seven-principles-talk-tokens','harvest-bowl-centerpiece',
  'countdown-clock-craft','resolution-seed-packets','new-year-noise-parade','ball-drop-physics','year-in-review-comic','countdown-number-line-hop',
  'snowflake-symmetry-lab','ice-melt-rescue-race','winter-bird-feeder','snowy-day-story-walk','arctic-animal-charades','winter-solstice-shadow-track'];
ok(W22.length === 30, '30 wave-22 winter ids listed');
W22.forEach(id => ok(actIds.has(id), 'wave-22 id present: ' + id));
const GAPS = ['rainstick-rhythm-circle','body-percussion-patterns','call-and-response-clap','found-sound-orchestra',
  'indoor-camping-day','tape-maze-challenge','balloon-volleyball','story-building-blocks',
  'color-sorting-trays','big-brush-painting','animal-parade-march','nesting-cup-towers'];
GAPS.forEach(id => ok(actIds.has(id), 'gap-fill id present: ' + id));
const byId = Object.fromEntries(acts.map(a => [a.id, a]));
// tag splits
ok(W22.filter(id => (byId[id].tags || []).includes('holiday:christmas')).length === 8, '8 christmas');
ok(W22.filter(id => (byId[id].tags || []).includes('holiday:hanukkah')).length === 5, '5 hanukkah');
ok(W22.filter(id => (byId[id].tags || []).includes('holiday:kwanzaa')).length === 5, '5 kwanzaa');
ok(W22.filter(id => (byId[id].tags || []).includes('holiday:new-year')).length === 6, '6 new-year');
ok(W22.filter(id => (byId[id].tags || []).includes('season:winter')).length === 30, 'all 30 carry season:winter');
// gap fills: music-rhythm x4, rainy-day x4, age-3 x4
ok(GAPS.filter(id => byId[id].categories[0] === 'music-rhythm').length === 4, '4 music-rhythm gap fills');
ok(GAPS.filter(id => byId[id].categories[0] === 'rainy-day').length === 4, '4 rainy-day gap fills');
ok(GAPS.filter(id => byId[id].age_min === 3).length === 4, '4 age-3 gap fills');
// quality bar on all 42
W22.concat(GAPS).forEach(id => {
  const a = byId[id];
  ok(a.steps.length >= 3, 'steps>=3: ' + id);
  ok(a.variations && a.variations.easier && a.variations.harder, 'easier+harder: ' + id);
  ok(a.age_min >= 3 && a.age_max <= 18 && a.age_min <= a.age_max, 'age range sane: ' + id);
  ok(a.time_min >= 10, 'honest time floor: ' + id);
  ok(a.tagline.length <= 160, 'tagline<=160: ' + id, String(a.tagline.length));
});
// no medical claims anywhere in the pack
const MED = ['sunscreen is spf', 'uv index', 'heatstroke', 'dehydration', 'hypothermia',
             'boosts immunity', 'cures ', 'lowers blood'];
W22.concat(GAPS).forEach(id => {
  const blob = JSON.stringify(byId[id]).toLowerCase();
  MED.forEach(w => ok(!blob.includes(w), 'no medical claim "' + w + '": ' + id));
});
// food activities carry practical allergy notes
['candy-cane-olympics','gumdrop-bridge-build','gelt-math-market','winter-bird-feeder','harvest-bowl-centerpiece','indoor-camping-day']
  .forEach(id => ok(JSON.stringify(byId[id]).toLowerCase().includes('allerg'),
    'food activity has allergy check note: ' + id));
// respectful framing on the Hanukkah/Kwanzaa picks
ok((byId['hanukkah-story-circle'].inclusion || '').toLowerCase().includes('curiosity'),
  'hanukkah-story-circle carries respectful-framing inclusion note');
ok((byId['kente-pattern-strips'].inclusion || '').toLowerCase().includes('ghanaian'),
  'kente-pattern-strips names the real tradition');
ok((byId['seven-principles-talk-tokens'].inclusion || '').toLowerCase().includes('real'),
  'seven-principles-talk-tokens treats the principles as real');

// 3. Collections: 14 total, winter-lights valid with 12 picks + curator notes
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 15, '15 collections', String(colls.length));
ok(new Set(colls.map(c => c.id)).size === 15, 'collection ids unique');
const wl = colls.find(c => c.id === 'winter-lights');
ok(!!wl, 'winter-lights exists');
ok(wl.glyph === '❄️', 'winter-lights glyph');
ok(wl.picks.length === 12, 'winter-lights 12 picks', String(wl.picks.length));
wl.picks.forEach(p => {
  ok(actIds.has(p.id), 'winter-lights pick resolves: ' + p.id);
  ok(p.note && p.note.trim().length > 10, 'winter-lights pick has curator note: ' + p.id);
});

// 4. winter.js: every curated id resolves; ids unique
const wSrc = fs.readFileSync(path.join(ROOT, 'assets/winter.js'), 'utf8');
const jsIds = [...wSrc.matchAll(/\['([a-z0-9-]+)',/g)].map(m => m[1]);
ok(jsIds.length === 36, 'winter.js has 36 curated picks', String(jsIds.length));
ok(new Set(jsIds).size === jsIds.length, 'winter.js curated ids unique');
jsIds.forEach(id => ok(actIds.has(id), 'winter.js id resolves: ' + id));
const jsTags = [...wSrc.matchAll(/browse: 'index\.html\?tag=([a-z:-]+)'/g)].map(m => m[1]);
jsTags.forEach(t => ok(vocab.has(t), 'winter.js browse tag in vocabulary: ' + t));

// 5. winter.html: hub structure
const wHtml = fs.readFileSync(path.join(ROOT, 'winter.html'), 'utf8');
ok(wHtml.includes('id="winter-status"'), 'winter.html has live status region');
ok(wHtml.includes('role="status"'), 'winter.html status is a live region');
ok(wHtml.includes('id="winter-sections"'), 'winter.html has sections host');
ok(wHtml.includes('assets/winter.js'), 'winter.html loads winter.js');
ok(wHtml.includes('assets/ratings.js'), 'winter.html loads ratings.js');
ok(wHtml.includes('skip-link'), 'winter.html has skip link');
ok(wHtml.includes('collection:winter-lights'), 'hub links the winter-lights collection');
ok(wHtml.toLowerCase().includes('not every family celebrates every holiday'),
  'winter.html hero lede is inclusive');

// 6. Nav: shells link winter.html; exactly one aria-current per shell
const SHELLS = {
  'index.html': 'index.html', 'planner.html': 'planner.html', 'kit.html': 'kit.html', 'sub.html': 'sub.html',
  'party.html': 'party.html', 'fieldtrip.html': 'fieldtrip.html',
  'collections.html': 'collections.html', 'api.html': null,
  'spring.html': 'spring.html', 'summer.html': 'summer.html', 'halloween.html': 'halloween.html',
  'thanksgiving.html': 'thanksgiving.html', 'winter.html': 'winter.html', 'desk.html': null
};
for (const [f, current] of Object.entries(SHELLS)) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  ok(html.includes('href="winter.html"'), f + ' nav links winter.html');
  const curs = [...html.matchAll(/aria-current="page"/g)];
  if (current) {
    ok(curs.length === 1, f + ' has exactly one aria-current', String(curs.length));
    ok(html.includes('href="' + current + '" aria-current="page"'), f + ' aria-current points at itself');
  }
  ok(html.includes('id="site-calm-toggle"'), f + ' has the site-wide calm toggle');
  ok(html.includes('assets/site.js'), f + ' loads site.js');
}
// generated activity pages link the hub too
const samplePage = fs.readFileSync(path.join(ROOT, 'activity/ornament-geometry-stars.html'), 'utf8');
ok(samplePage.includes('../winter.html'), 'generated activity page nav links winter.html');

// 7. planner.js: November + December map to the winter holidays; party.js winter theme
ok(plannerSrc.includes("10: ['holiday:thanksgiving', 'holiday:hanukkah', 'holiday:kwanzaa'"),
  'planner November -> thanksgiving/hanukkah/kwanzaa');
ok(plannerSrc.includes("11: ['holiday:christmas', 'holiday:new-year', 'holiday:hanukkah', 'holiday:kwanzaa']"),
  'planner December -> christmas/new-year/hanukkah/kwanzaa');
const partySrc = fs.readFileSync(path.join(ROOT, 'assets/party.js'), 'utf8');
ok(/winter: \{/.test(partySrc), 'party.js has winter theme');
const partyHtml = fs.readFileSync(path.join(ROOT, 'party.html'), 'utf8');
ok(partyHtml.includes('value="winter"'), 'party.html has winter radio chip');

// 8. app.js winter promo hook (Dec=11, Jan=0) + index.html promo section
ok(appSrc.includes("getElementById('season-promo-winter')"), 'app.js winter promo hook');
ok(/pm === 11 \|\| pm === 0/.test(appSrc), 'app.js gates winter promo on Dec/Jan');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok(indexHtml.includes('id="season-promo-winter"'), 'index.html has winter promo section');
ok(indexHtml.includes('collections.html#winter-lights'), 'promo links winter-lights');
ok(indexHtml.includes('winter.html'), 'promo links winter.html');

// 9. Generated API: collections + manifest + sitemap + llms mention winter
const apiColls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/collections.json'), 'utf8'));
ok(apiColls.count === 15 && apiColls.collections.length === 15, 'api collections.json count 15');
ok(apiColls.collections.some(c => c.id === 'winter-lights'), 'api has winter-lights');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/index.json'), 'utf8'));
const collEp = manifest.endpoints.find(e => e.path === 'data/v1/collections.json');
ok(collEp && collEp.records === 15, 'manifest collections records=15');
const actEp = manifest.endpoints.find(e => e.path === 'data/v1/activities.json');
ok(actEp && actEp.records === 550, 'manifest activities records=550', String(actEp && actEp.records));
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
ok(sitemap.includes('winter.html'), 'sitemap.xml has winter.html');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(llms.includes('winter.html'), 'llms.txt mentions winter.html');
ok(llms.includes('winter lights'), 'llms.txt mentions winter lights');

console.log('winter pack: ' + passed + ' assertions passed');
