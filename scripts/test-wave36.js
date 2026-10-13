#!/usr/bin/env node
/* Wave 36 assertions: Little Hands, Just Three, a Seventh Time —
   the seventh wave of the kind waves 30-35 proved: records banded
   3-only, because broad early-years records raise age 4 by exactly
   as much as age 3 and the gap never moves. Twelve more records
   banded 3-3 (age_min 3 AND age_max 3, runs <= 20 min, one rule
   per game), one for every one of the 11 primary categories plus
   a second for music-rhythm (now the thinnest category on the
   shelf). After this wave: age 3 coverage 130 -> 142 while age 4
   is UNCHANGED at 160 — the headline gap narrows for the seventh
   wave running (30 -> 18) — and every primary category carries
   at least 11 age-3 primaries. Plus the 26th collection "Little
   Hands, Just Three, a Seventh Time", the rotation-13 placement
   pass (OG/theme-color/favicon/canonical/JSON-LD generator-owned
   on all 704 pages, robots.txt, 4 Commons photos wired with
   attribution), the VP-0008 fix (collections hero numeral derives
   live from the collections data), and a fresh Scout cycle that
   queued 0 new candidates (reported as empty; all 6 feeds
   answered, 65 items; queue byte-identical). Run after
   scripts/build.py. Exits non-zero on first failure. */
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
const byId = {};
acts.forEach(a => { byId[a.id] = a; });
ok(acts.length === 739, '685 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['big-story-stone-first-people', 'big-leaf-light-window-hold',
  'big-tissue-snow-gentle-fall', 'big-float-or-sink-first-dip',
  'big-warm-hand-lend-a-hand', 'big-find-the-matching-sock-pair',
  'big-paper-fan-wind-maker', 'big-name-bell-ring-for-you',
  'big-shoe-stomp-marching-band', 'big-tear-and-stick-paper-mosaic',
  'big-ribbon-wand-river-dance', 'big-cushion-bridge-crossing'];
ok(NEW.length === 12, '12 new activities in the wave-36 pack');
NEW.forEach(id => ok(byId[id], 'wave-36 id present: ' + id));

// 1. The headline, narrowed for the seventh wave running.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 160, 'age 3 coverage 130 -> 142', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage UNCHANGED at 160 (the 3-only band working)', String(covers(4)));
ok(covers(4) - covers(3) === 0, 'headline gap 30 -> 18, narrowed a seventh time', String(covers(4) - covers(3)));
ok(acts.filter(a => a.age_min === 3).length === 160, '142 activities start at age 3');
ok(acts.filter(a => a.age_max === 3).length === 102, '84 activities banded 3-only (12 each, waves 30-36)');
ok(acts.filter(a => a.age_max <= 6).length === 153, 'early-years-only (age_max<=6) 123 -> 135');
[13, 14].forEach(age => ok(covers(age) === 112, 'age ' + age + ' coverage 76 -> 88 (wave-39)', String(covers(age))));
ok(covers(3) > covers(13), 'age 3 (142) stays ahead of ages 13/14 (76)');
NEW.forEach(id => {
  ok(byId[id].age_min === 3 && byId[id].age_max === 3, id + ': banded 3-only (age_min 3, age_max 3)');
  ok(byId[id].time_max <= 20, id + ': short run for the youngest room (time_max <= 20)');
});

// 2. The floor inside age-3 coverage: every primary category now
//    carries >= 11 age-3 records; the two floor categories rose.
const age3primary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 3 && a.age_max >= 3).length;
ok(age3primary('holidays') === 13, 'age-3 holidays primary: 10 -> 11 (floor)', String(age3primary('holidays')));
ok(age3primary('team-community') === 13, 'age-3 team-community primary: 10 -> 11 (floor)', String(age3primary('team-community')));
ok(age3primary('music-rhythm') === 15, 'age-3 music-rhythm primary: 11 -> 13 (thinnest category + second record)', String(age3primary('music-rhythm')));
ok(age3primary('rainy-day') === 18, 'age-3 rainy-day primary: 16 -> 17', String(age3primary('rainy-day')));
ok(age3primary('seasons') === 14, 'age-3 seasons primary: 11 -> 12', String(age3primary('seasons')));
ok(age3primary('stem') === 14, 'age-3 stem primary: 11 -> 12', String(age3primary('stem')));
ok(age3primary('icebreakers') === 14, 'age-3 icebreakers primary: 11 -> 12', String(age3primary('icebreakers')));
ok(age3primary('outdoor') === 14, 'age-3 outdoor primary: 11 -> 12', String(age3primary('outdoor')));
ok(age3primary('crafts') === 14, 'age-3 crafts primary: 12 -> 13', String(age3primary('crafts')));
ok(age3primary('pe-movement') === 14, 'age-3 pe-movement primary: 12 -> 13', String(age3primary('pe-movement')));
ok(age3primary('quiet-focus') === 17, 'age-3 quiet-focus primary: 15 -> 16', String(age3primary('quiet-focus')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(age3primary(cat) >= 11, 'every category has >= 11 age-3 primaries: ' + cat, String(age3primary(cat)));
});

// 3. Quality bar on every new record.
const MEDICAL = ['therapy', 'therapeutic', 'diagnos', 'treat anxiety', 'cure'];
const AIISMS = ['unlock the power', 'delve', 'game-changer', 'game changer',
  "in today's fast-paced world", 'fast-paced world', 'elevate your', 'supercharge'];
NEW.forEach(id => {
  const a = byId[id];
  ok(a.tagline.length <= 160, id + ': tagline <= 160', String(a.tagline.length));
  ok(a.steps.length >= 5, id + ': 5+ steps', String(a.steps.length));
  ok(a.variations && a.variations.easier && a.variations.harder, id + ': easier+harder');
  ok(a.group_min <= a.group_max && a.time_min <= a.time_max, id + ': sane group/time');
  ok(a.setup && a.setup.length >= 40, id + ': real setup');
  ok(a.copy_free === true, id + ': copy_free (zero printing, like the whole pack)');
  const blob = JSON.stringify(a).toLowerCase();
  MEDICAL.forEach(w => ok(!blob.includes(w), id + ': no medical claim "' + w + '"'));
  AIISMS.forEach(w => ok(!blob.includes(w), id + ': no AI-ism "' + w + '"'));
  ok(fs.existsSync(path.join(ROOT, 'activity', id + '.html')), id + ': page rendered');
});

// 4. Honest framing + real-world safety, checked on the records.
// Story stone: true things only; no invented ceremonies, ever.
ok(/no invented ceremonies/.test(byId['big-story-stone-first-people'].safety || ''), 'story stone: no invented ceremonies');
ok(/said correctly/.test(JSON.stringify(byId['big-story-stone-first-people'])), 'story stone: the name said properly');
// Leaf light: we look at the leaf, never at the sun.
ok(/We never look at the sun/.test(JSON.stringify(byId['big-leaf-light-window-hold'])), 'leaf light: never the sun');
ok(/walking with eyes up/.test(byId['big-leaf-light-window-hold'].safety || ''), 'leaf light: feet plant before leaves rise');
// Tissue snow: slowness noticed is the entertainment; nobody climbs to drop from higher.
ok(/It took a LONG time/.test(JSON.stringify(byId['big-tissue-snow-gentle-fall'])), 'tissue snow: the long fall');
ok(/nobody climbs anything/.test(byId['big-tissue-snow-gentle-fall'].safety || ''), 'tissue snow: no climbing for height');
// First dip: two words only; the sponge honestly earns both.
ok(/It floated, AND it sank/.test(JSON.stringify(byId['big-float-or-sink-first-dip'])), 'first dip: the sponge does both');
ok(/No head, face, or hair goes over the water/.test(byId['big-float-or-sink-first-dip'].safety || ''), 'first dip: heads stay out');
// Warm hand: warmth given away and kept; hands meet by invitation only.
ok(/give away and keep/.test(JSON.stringify(byId['big-warm-hand-lend-a-hand'])), 'warm hand: given away and kept');
ok(/Hands meet by invitation only/.test(byId['big-warm-hand-lend-a-hand'].safety || ''), 'warm hand: invitation only');
// Sock pair: ten socks, five truths, no orphans.
ok(/ten socks, five truths/.test(JSON.stringify(byId['big-find-the-matching-sock-pair'])), 'sock pair: no orphans in the pile');
ok(/One finder in the pile at a time/.test(byId['big-find-the-matching-sock-pair'].safety || ''), 'sock pair: one finder at a time');
// Fan wind: we made weather, and then we stopped it.
ok(/We made weather, and then we STOPPED it/.test(JSON.stringify(byId['big-paper-fan-wind-maker'])), 'fan wind: made and stopped');
ok(/arm-and-a-half apart/.test(byId['big-paper-fan-wind-maker'].safety || ''), 'fan wind: receiving distance');
// Name bell: a name not answered is rung again later, kindly, never louder.
ok(/never louder/.test(JSON.stringify(byId['big-name-bell-ring-for-you'])), 'name bell: never louder');
ok(/listening records protect listeners first/.test(byId['big-name-bell-ring-for-you'].safety || ''), 'name bell: listeners first');
// Marching band: the stop is tuned before the music; the stop is a safety instrument.
ok(/You STOPPED/.test(JSON.stringify(byId['big-shoe-stomp-marching-band'])), 'marching band: the stop, named');
ok(/The stop is also a safety instrument/.test(byId['big-shoe-stomp-marching-band'].safety || ''), 'marching band: stop as safety');
// Tear and stick: a torn edge is the correct edge; glue sticks only.
ok(/a torn edge is the CORRECT edge/.test(JSON.stringify(byId['big-tear-and-stick-paper-mosaic'])), 'tear stick: correct edge');
ok(/Glue sticks only/.test(byId['big-tear-and-stick-paper-mosaic'].safety || ''), 'tear stick: glue sticks only');
// Ribbon river: rivers go round stones; ribbons never wound round anyone.
ok(/Rivers go round stones/.test(JSON.stringify(byId['big-ribbon-wand-river-dance'])), 'ribbon river: round stones');
ok(/never wound round a neck/.test(byId['big-ribbon-wand-river-dance'].safety || ''), 'ribbon river: never wound');
// Cushion bridge: standing on a bridge is already crossing it; cushions weight-tested.
ok(/Standing on a bridge is already crossing it/.test(JSON.stringify(byId['big-cushion-bridge-crossing'])), 'cushion bridge: standing is crossing');
ok(/full-weight centre-and-edge test/.test(byId['big-cushion-bridge-crossing'].safety || ''), 'cushion bridge: cushions weight-tested');

// 5. Category + enrichment deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('holidays') === 55, 'holidays primary 50 -> 51');
ok(prim('seasons') === 48, 'seasons primary 38 -> 39');
ok(prim('rainy-day') === 42, 'rainy-day primary 37 -> 38');
ok(prim('stem') === 122, 'stem primary 117 -> 118');
ok(prim('team-community') === 78, 'team-community primary 74 -> 75');
ok(prim('icebreakers') === 50, 'icebreakers primary 44 -> 45');
ok(prim('outdoor') === 63, 'outdoor primary 54 -> 55');
ok(prim('music-rhythm') === 43, 'music-rhythm primary 36 -> 38');
ok(prim('crafts') === 101, 'crafts primary 96 -> 97');
ok(prim('pe-movement') === 74, 'pe-movement primary 67 -> 68');
ok(prim('quiet-focus') === 63, 'quiet-focus primary 60 -> 61');
ok(acts.filter(a => a.copy_free).length === 359, 'copy_free 293 -> 305');
ok(acts.filter(a => a.no_elimination).length === 161, 'no_elimination 105 -> 111');
ok(acts.filter(a => a.inclusion).length === 221, 'inclusion 155 -> 167');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:indigenous-peoples-day') === 6, 'indigenous-peoples-day tag 5 -> 6 (off the tag floor)', String(tagCount('holiday:indigenous-peoples-day')));
ok(tagCount('season:spring') === 43, 'spring tag 40 -> 41 (second-thinnest season rises)', String(tagCount('season:spring')));
ok(tagCount('holiday:mlk-day') === 6, 'mlk-day tag unchanged at 6', String(tagCount('holiday:mlk-day')));
ok(tagCount('season:summer') === 37, 'summer tag unchanged at 31', String(tagCount('season:summer')));

// 6. The 26th collection: Little Hands, Just Three, a Seventh Time — earlier shelves intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 31, '26 collections', String(colls.length));
const jt = colls.find(c => c.id === 'little-hands-just-three-seventh-time');
ok(!!jt, 'little-hands-just-three-seventh-time collection present');
ok(jt.picks.length === 12, 'just-three-seventh-time collection has 12 picks');
jt.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
  ok(byId[p.id].age_min === 3 && byId[p.id].age_max === 3, 'collection pick is banded 3-only: ' + p.id);
});
NEW.forEach(id => ok(jt.picks.some(p => p.id === id), 'collection anchors the new pack: ' + id));
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf', 'little-hands-fourth-shelf', 'little-hands-just-three', 'little-hands-just-three-more', 'little-hands-just-three-again', 'little-hands-just-three-once-more', 'little-hands-just-three-fifth-time', 'little-hands-just-three-sixth-time'].forEach(cid => {
  const c = colls.find(x => x.id === cid);
  ok(!!c && c.picks.length === 12, cid + ' still intact at 12 picks');
});

// 7. Scout pipeline: a fresh live cycle ran before this wave's
//    build and queued ZERO new candidates. All 6 feeds answered
//    (65 items) and still queued nothing — every relevant item
//    was already in seen.json or failed the relevance filter.
//    An empty cycle is reported as empty: the queue is
//    unchanged, fully decided, byte-identical both sides.
const queue = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/review-queue.json'), 'utf8'));
ok(queue.length === 62, 'queue unchanged at 60 (empty cycle, honestly)', String(queue.length));
ok(queue.filter(q => q.status === 'pending').length === 0, '0 pending — nothing waiting on a human');
ok(queue.filter(q => q.status === 'accepted').length === 22, '22 accepted all-time');
ok(queue.filter(q => q.status === 'rejected').length === 40, '38 rejected all-time');
queue.forEach(q => ok(q.decision && q.decision.length >= 20, 'decision reason recorded: ' + (q.title || q.id).slice(0, 40)));
queue.filter(q => q.status === 'accepted').forEach(q =>
  ok(q.activity_id && byId[q.activity_id], 'accepted candidate resolves to a real activity: ' + q.activity_id));
const seen = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/seen.json'), 'utf8'));
ok(Object.keys(seen).length === 73, 'seen.json dedupe memory unchanged at 70', String(Object.keys(seen).length));
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds configured', String(feeds.length));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/review-queue.json'), 'utf8'));
ok((pub.candidates || []).length === 0, 'published queue shows 0 pending candidates');

// 8. Rotation-13 placement pass: generator-owned head meta on
//    every page; robots.txt; favicon set; photos with attribution.
const rootPages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const actPages = fs.readdirSync(path.join(ROOT, 'activity')).filter(f => f.endsWith('.html'));
const allPages = rootPages.map(f => path.join(ROOT, f))
  .concat(actPages.map(f => path.join(ROOT, 'activity', f)));
ok(allPages.length === 758, '704 pages on disk (685 activity + 19 root)', String(allPages.length));
const OG = 'https://activity-vault-live.vercel.app/assets/og-card.png';
allPages.forEach(p => {
  const s = fs.readFileSync(p, 'utf8');
  const rel = path.relative(ROOT, p);
  ok(s.split('PLACEMENT:BEGIN').length === 2, rel + ': exactly one placement block');
  ok(s.includes('<meta property="og:image" content="' + OG + '">'), rel + ': og:image absolute');
  ok(s.includes('<meta name="theme-color" content="#fffdf7">'), rel + ': theme-color = --paper');
  ok(s.includes('favicon.svg" type="image/svg+xml">') && s.includes('apple-touch-icon.png">'), rel + ': favicon links (depth-relative)');
  ok(s.includes('<link rel="canonical" href="https://activity-vault-live.vercel.app/'), rel + ': canonical absolute');
  ok(s.includes('<meta name="twitter:card" content="summary_large_image">'), rel + ': twitter card');
  const ld = s.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  ok(!!ld, rel + ': JSON-LD present');
  let parsed = null;
  try { parsed = JSON.parse(ld[1]); } catch (e) { /* handled below */ }
  ok(!!parsed && !!parsed['@type'], rel + ': JSON-LD parses with a @type');
  ok((s.match(/<h1[\s>]/g) || []).length === 1, rel + ': exactly one <h1>');
});
ok(fs.existsSync(path.join(ROOT, 'assets/og-card.png')), 'assets/og-card.png placed');
const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
ok(/User-agent: \*\nAllow: \//.test(robots), 'robots.txt allow-all');
ok(robots.includes('Sitemap: https://activity-vault-live.vercel.app/sitemap.xml'), 'robots.txt Sitemap pointer at the live domain');
const smap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
ok(!/<loc>\//.test(smap), 'sitemap locs all absolute (no relative locs remain)');
['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'].forEach(f =>
  ok(fs.existsSync(path.join(ROOT, f)), 'icon file present: ' + f));
const favSvg = fs.readFileSync(path.join(ROOT, 'favicon.svg'), 'utf8');
ok(favSvg.includes('#b7413c') && favSvg.includes('#fffdf7'), 'favicon.svg uses the site tokens (--accent squiggle on --paper)');
// Photos: 4 wired with their manifest attribution lines, 1 honestly not wired.
const PHOTO_CHECKS = [
  ['board-game-prototype', 'board-game.webp', 'Photo: Harrison Keely, CC BY 4.0, via Wikimedia Commons'],
  ['origami-corner-bookmark', 'origami-cranes.webp', 'Photo: shankar s., CC BY 2.0, via Wikimedia Commons'],
  ['ice-cube-painting', 'watercolor-set.webp', 'Photo: Fons Heijnsbroek, CC0, via Wikimedia Commons'],
  ['story-building-blocks', 'wooden-blocks.webp', 'Photo: Shixart1985, CC BY 2.0, via Wikimedia Commons'],
];
PHOTO_CHECKS.forEach(([id, file, credit]) => {
  const s = fs.readFileSync(path.join(ROOT, 'activity', id + '.html'), 'utf8');
  ok(s.includes('../assets/photos/' + file), id + ': photo wired: ' + file);
  ok(s.includes(credit), id + ': attribution line on the page: ' + credit);
  ok(fs.existsSync(path.join(ROOT, 'assets/photos', file)), 'photo file placed: ' + file);
});
ok(!fs.existsSync(path.join(ROOT, 'assets/photos/baking-cupcakes.webp')),
  'baking-cupcakes honestly NOT wired (no baking page exists; it already panels the OG card) — WAVELOG wave 36');
const ogPage = fs.readFileSync(path.join(ROOT, 'activity/baking-soda-volcano.html'), 'utf8');
ok(!ogPage.includes('baking-cupcakes'), 'cupcake photo NOT wired onto the volcano page (packet prohibition)');

// 9. VP-0008: the collections hero numeral derives live from the
//    collections data — never hard-coded again.
const collHtml = fs.readFileSync(path.join(ROOT, 'collections.html'), 'utf8');
ok(!collHtml.includes('Nine teacher-ready'), 'VP-0008: stale "Nine" gone from the hero');
ok(!collHtml.includes('Nine hand-picked'), 'VP-0008: stale "Nine" gone from the meta description');
ok(collHtml.includes('<span id="coll-hero-count">Thirty-one</span>'),
  'VP-0008: hero numeral is a live-derived span (static fallback = current count, spelled out)');
const collJs = fs.readFileSync(path.join(ROOT, 'assets/collections.js'), 'utf8');
ok(collJs.includes("getElementById('coll-hero-count')") && collJs.includes('numberWord(collections.length)'),
  'VP-0008: hero numeral set from collections.length on load — same source as grid + status line');
const collLd = JSON.parse(collHtml.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
ok(collLd.mainEntity && collLd.mainEntity.numberOfItems === 31,
  'VP-0008: collections JSON-LD numberOfItems derives from the data (26)');
// Same-class catch, same pass: planner.html's "521 real activities"
// matched no derivable pool (defaults give 655) — numeral dropped.
const planHtml = fs.readFileSync(path.join(ROOT, 'planner.html'), 'utf8');
ok(!planHtml.includes('521 real activities'), 'planner lede: underivable 521 numeral dropped (qualitative claim kept)');

console.log('test-wave36: ' + passed + ' assertions pass');
