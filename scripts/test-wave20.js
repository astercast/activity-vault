#!/usr/bin/env node
/* Activity Vault — wave-20 tests: the Halloween 2026 pack (+40 -> 455).
   Asserts the 40 new activities, the halloween-week collection, hub section,
   HALLOWEEN 2026 stamp chrome, and planner seasonal-seed integration. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(path.dirname(path.resolve(__filename)));

let pass = 0, fail = 0;
const failures = [];
function ok(cond, label, detail) {
  if (cond) { pass++; }
  else { fail++; failures.push(label + (detail ? ' :: ' + detail : '')); }
}

const acts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/activities.json'), 'utf8'));
const byId = {};
acts.forEach(a => { byId[a.id] = a; });

const W20 = [
  'roll-a-monster-dice-draw', 'marigold-cempasuchil-flowers', 'pumpkin-seed-mosaic', 'witch-hat-decorate',
  'ghost-rocket-fizz', 'glow-stick-temperature-lab', 'spiderweb-weight-bridge', 'vampire-teeth-acid-test',
  'witch-broomstick-relay', 'ghost-freeze-tag', 'monster-movement-dice', 'zombie-walk-relay',
  'halloween-inference-riddles', 'thumbprint-monsters', 'halloween-dots-and-boxes', 'spiderweb-sketch-study',
  'ghost-banana-pops', 'monster-mix-bags', 'candy-apple-slices', 'witches-brew-punch', 'halloween-countdown-calendar',
  'monster-name-alliteration-circle', 'costume-guess-who', 'halloween-this-or-that',
  'monster-stomp-rhythms', 'trick-or-treat-chant-parade', 'haunted-house-soundtrack',
  'haunted-hallway-build', 'costume-swap-shop', 'kindness-pumpkins',
  'pumpkin-bowling', 'spiderweb-yarn-maze', 'haunted-lantern-tour',
  'pumpkin-patch-scavenger-hunt', 'leaf-pile-monster-dig', 'ghost-balloon-stomp', 'graveyard-number-dash',
  'harvest-moon-journal', 'pumpkin-life-cycle-wheel', 'acorn-cap-witches'
];

// 1. ids present and unique; total count
ok(acts.length === 455, '455 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');
W20.forEach(id => ok(!!byId[id], 'wave-20 id present: ' + id));

// 2. primary-category split across all 11 categories
const EXPECT_SPLIT = {
  'crafts': 4, 'stem': 4, 'pe-movement': 4, 'quiet-focus': 4, 'holidays': 5,
  'icebreakers': 3, 'music-rhythm': 3, 'team-community': 3, 'rainy-day': 3,
  'outdoor': 4, 'seasons': 3
};
const split = {};
W20.forEach(id => {
  const c = byId[id].categories[0];
  split[c] = (split[c] || 0) + 1;
});
Object.keys(EXPECT_SPLIT).forEach(c =>
  ok(split[c] === EXPECT_SPLIT[c], 'primary category ' + c + ' = ' + EXPECT_SPLIT[c], String(split[c])));
ok(Object.keys(split).length === 11, 'all 11 categories covered', Object.keys(split).join(','));

// 3. tag splits
const tagKey = id => JSON.stringify((byId[id].tags || []).slice().sort());
const H = JSON.stringify(['holiday:halloween']);
const HS = JSON.stringify(['holiday:halloween', 'theme:spooky']);
const HF = JSON.stringify(['holiday:halloween', 'season:fall']);
const HSF = JSON.stringify(['holiday:halloween', 'season:fall', 'theme:spooky']);
ok(W20.filter(id => tagKey(id) === H).length === 10, '10 halloween-only', String(W20.filter(id => tagKey(id) === H).length));
ok(W20.filter(id => tagKey(id) === HS).length === 19, '19 halloween+spooky', String(W20.filter(id => tagKey(id) === HS).length));
ok(W20.filter(id => tagKey(id) === HF).length === 9, '9 fall+halloween', String(W20.filter(id => tagKey(id) === HF).length));
ok(W20.filter(id => tagKey(id) === HSF).length === 1, '1 fall+halloween+spooky', String(W20.filter(id => tagKey(id) === HSF).length));
ok(W20.filter(id => (byId[id].tags || []).includes('holiday:dia-de-muertos')).length === 1,
  '1 dia-de-muertos (marigold, respectful framing)');
const vocab = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'api/v1/filters.json'), 'utf8')).filters.tags.options);
W20.forEach(id => (byId[id].tags || []).forEach(t => ok(vocab.has(t), 'tag in vocabulary: ' + t + ' (' + id + ')')));

// 4. record shape on all 40
W20.forEach(id => {
  const a = byId[id];
  ok(a.name && a.name.length > 3, 'name: ' + id);
  ok(a.tagline && a.tagline.length > 20 && a.tagline.length <= 160, 'tagline 21-160 chars: ' + id, String(a.tagline && a.tagline.length));
  ok(Array.isArray(a.steps) && a.steps.length >= 3, '3+ steps: ' + id, String(a.steps && a.steps.length));
  ok(a.steps.every(s => s.split(' ').length >= 4), 'steps are real sentences: ' + id);
  ok(a.variations && a.variations.easier && a.variations.easier.length > 10, 'easier variation: ' + id);
  ok(a.variations && a.variations.harder && a.variations.harder.length > 10, 'harder variation: ' + id);
  ok(typeof a.safety === 'string' && a.safety.length > 20, 'safety note: ' + id);
  ok(a.age_min >= 3 && a.age_min <= a.age_max && a.age_max <= 18, 'sane age range: ' + id);
  ok(a.group_min >= 1 && a.group_min <= a.group_max, 'sane group range: ' + id);
  ok(a.time_min > 0 && a.time_min <= a.time_max, 'sane time range: ' + id);
  ok(a.location.every(l => l === 'indoor' || l === 'outdoor'), 'valid locations: ' + id);
  ['copy_free', 'no_elimination'].forEach(bf => {
    if (bf in a) ok(typeof a[bf] === 'boolean', bf + ' is boolean: ' + id);
  });
  ['why_it_works', 'inclusion'].forEach(sf => {
    if (sf in a) ok(typeof a[sf] === 'string' && a[sf].length > 20, sf + ' is a real string: ' + id);
  });
});

// 5. no medical claims anywhere in the pack
const MED = ['sunscreen is spf', 'uv index', 'heatstroke', 'dehydration', 'hypothermia',
  'diagnos', 'prescription', 'cures', 'heals'];
W20.forEach(id => {
  const blob = JSON.stringify(byId[id]).toLowerCase();
  MED.forEach(w => ok(!blob.includes(w), 'no medical claim "' + w + '": ' + id));
});

// 6. food activities all carry allergy notes; knife work is adult-only
const FOOD = ['ghost-banana-pops', 'monster-mix-bags', 'candy-apple-slices', 'witches-brew-punch', 'pumpkin-seed-mosaic'];
FOOD.forEach(id => {
  const blob = JSON.stringify(byId[id]).toLowerCase();
  ok(blob.includes('allerg'), 'food activity has allergy note: ' + id);
});
W20.forEach(id => {
  const blob = JSON.stringify(byId[id]).toLowerCase();
  if (blob.includes('knife') || blob.includes('carv')) {
    ok(blob.includes('adult'), 'knife/carve work is adult-only: ' + id);
  }
});

// 7. no-prep / copy-free / no-elimination coverage (Kit pools)
ok(W20.filter(id => byId[id].no_prep).length >= 6, '>= 6 no-prep in pack',
  String(W20.filter(id => byId[id].no_prep).length));
ok(W20.filter(id => byId[id].copy_free).length >= 8, '>= 8 copy-free in pack',
  String(W20.filter(id => byId[id].copy_free).length));
ok(W20.filter(id => byId[id].no_elimination).length >= 6, '>= 6 no-elimination in pack',
  String(W20.filter(id => byId[id].no_elimination).length));

// 8. generated pages exist for all 40
W20.forEach(id => ok(fs.existsSync(path.join(ROOT, 'activity', id + '.html')), 'page rendered: ' + id));

// 9. halloween-week collection: 13 collections, 12 picks, notes, resolves
const cols = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(cols.length === 13, '13 collections', String(cols.length));
const hw = cols.filter(c => c.id === 'halloween-week')[0];
ok(!!hw, 'halloween-week collection exists');
ok(hw.picks.length === 12, 'halloween-week 12 picks', String(hw.picks.length));
hw.picks.forEach(p => {
  ok(byId[p.id], 'halloween-week pick resolves: ' + p.id);
  ok(p.note && p.note.trim().length > 10, 'halloween-week pick has curator note: ' + p.id);
});
ok(hw.glyph && hw.title && hw.when_to_use, 'halloween-week has glyph/title/when_to_use');

// 10. halloween.js: new wave20 section; all 40 picks resolve with spook levels
const hwSrc = fs.readFileSync(path.join(ROOT, 'assets/halloween.js'), 'utf8');
ok(hwSrc.includes("id: 'wave20'"), 'halloween.js has wave20 section');
const w20Picks = [...hwSrc.matchAll(/\['(roll-a-monster-dice-draw|marigold-cempasuchil-flowers|pumpkin-seed-mosaic|witch-hat-decorate|ghost-rocket-fizz|glow-stick-temperature-lab|spiderweb-weight-bridge|vampire-teeth-acid-test|witch-broomstick-relay|ghost-freeze-tag|monster-movement-dice|zombie-walk-relay|halloween-inference-riddles|thumbprint-monsters|halloween-dots-and-boxes|spiderweb-sketch-study|ghost-banana-pops|monster-mix-bags|candy-apple-slices|witches-brew-punch|halloween-countdown-calendar|monster-name-alliteration-circle|costume-guess-who|halloween-this-or-that|monster-stomp-rhythms|trick-or-treat-chant-parade|haunted-house-soundtrack|haunted-hallway-build|costume-swap-shop|kindness-pumpkins|pumpkin-bowling|spiderweb-yarn-maze|haunted-lantern-tour|pumpkin-patch-scavenger-hunt|leaf-pile-monster-dig|ghost-balloon-stomp|graveyard-number-dash|harvest-moon-journal|pumpkin-life-cycle-wheel|acorn-cap-witches)', '[^']*', '(none|fun|mild)'\]/g)];
ok(w20Picks.length === 40, 'wave20 section has all 40 picks with spook levels', String(w20Picks.length));
ok(w20Picks.some(m => m[2] === 'none') && w20Picks.some(m => m[2] === 'fun') && w20Picks.some(m => m[2] === 'mild'),
  'wave20 picks use all three spook levels');

// 11. halloween.html hero: planner + collection deep links for the new pack
const hwHtml = fs.readFileSync(path.join(ROOT, 'halloween.html'), 'utf8');
ok(hwHtml.includes('planner.html?from=collection:halloween-week'), 'hub hero plans from halloween-week');
ok(hwHtml.includes('collections.html#halloween-week'), 'hub hero links halloween-week collection');
ok(hwHtml.includes('collection:haunted-halls'), 'hub still links haunted-halls (regression)');

// 12. index.html: HALLOWEEN 2026 stamp + updated promo
const idxHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok(idxHtml.includes('class="stamp-season"'), 'index.html has stamp-season element');
ok(idxHtml.includes('>Halloween 2026</span>'), 'stamp reads HALLOWEEN 2026');
ok(idxHtml.includes('40 brand-new Halloween activities'), 'promo copy updated to 40 new');
ok(idxHtml.includes('collections.html#halloween-week'), 'promo links halloween-week');

// 13. style.css: stamp-season treatment in Teacher's Desk identity
const css = fs.readFileSync(path.join(ROOT, 'assets/style.css'), 'utf8');
ok(css.includes('.stamp-season'), 'style.css defines .stamp-season');
ok(/\.stamp-season\s*\{[^}]*var\(--font-stamp\)[^}]*var\(--grunge\)/s.test(css),
  'stamp-season uses Archivo Black + grunge ink mask');

// 14. planner.js: seasonal collection seed for October
const plSrc = fs.readFileSync(path.join(ROOT, 'assets/planner.js'), 'utf8');
ok(plSrc.includes("'holiday:halloween': 'halloween-week'"), 'planner maps halloween -> halloween-week');
ok(plSrc.includes('?from=collection:'), 'planner seasonal seed uses ?from=collection:');
ok(plSrc.includes('function collTitle'), 'planner has collTitle helper');

// 15. api manifest + sitemap + llms reflect the new totals
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'api/v1/index.json'), 'utf8'));
const actEp = manifest.endpoints.filter(e => e.path === 'api/v1/activities.json')[0];
ok(actEp && actEp.records === 455, 'manifest activities records=455', String(actEp && actEp.records));
const apiColls = JSON.parse(fs.readFileSync(path.join(ROOT, 'api/v1/collections.json'), 'utf8'));
ok(apiColls.count === 13 && apiColls.collections.length === 13, 'api collections count 13');
const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
ok(sm.includes('activity/roll-a-monster-dice-draw.html'), 'sitemap has a wave-20 page');
ok(sm.includes('collections.html'), 'sitemap has collections');

console.log('\nwave20: ' + pass + ' passed, ' + fail + ' failed');
if (failures.length) { console.log('FAILURES:\n' + failures.join('\n')); process.exit(1); }
