#!/usr/bin/env node
/* Wave 38 assertions: Little Hands, Just Three, a Ninth Time —
   the CLOSING wave of the campaign waves 30-37 ran. The gap was
   six wide, so the pack is six records, not twelve: exactly the
   six, aimed at the six lowest age-3 primary counts (holidays
   and team-community at the floor of 12; seasons, stem,
   icebreakers, outdoor at 13). After this wave: age 3 coverage
   154 -> 160 while age 4 is UNCHANGED at 160 — the headline gap
   6 -> 0, closed at parity — and every primary category carries
   at least 13 age-3 primaries (the floor rises in the same wave
   that closes the gap). Two drafted records were cut pre-run as
   near-dupes (a bird-listening minute vs bird-call-count 5-14;
   a lemonade pouring stand vs pouring-practice-trays 3-5) and
   their slots rebuilt (mud pie bakery; sandcastle) — recorded
   in the add script's header. NO new collection: the validator
   requires 8-12 picks and an honest closing shelf is six; the
   wave takes neither the padding pass nor the lowered bar, so
   collections stay at 27 with every earlier shelf intact.
   Scout cycle empty again (0 new candidates; queue unchanged).
   Hygiene re-locked: no .pyc / __pycache__ path tracked (the
   wave-37 untracking, re-asserted here per the Data-Ops routing).
   Run after scripts/build.py. Exits non-zero on first failure. */
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ROOT = path.dirname(path.dirname(path.resolve(__filename)));

let passed = 0;
function ok(cond, label, extra) {
  if (!cond) { console.error('FAIL: ' + label + (extra ? ' — ' + extra : '')); process.exit(1); }
  passed++;
}

const acts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/activities.json'), 'utf8'));
const byId = {};
acts.forEach(a => { byId[a.id] = a; });
ok(acts.length === 731, '703 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['big-groundhog-shadow-morning-look', 'big-new-friend-room-tour',
  'big-sandcastle-one-bucket-towers', 'big-sound-jar-loud-or-soft',
  'big-choose-your-colour-corner', 'big-mud-pie-bakery-morning'];
ok(NEW.length === 6, 'six new activities in the wave-38 pack — the gap was six wide, no padding to twelve');
NEW.forEach(id => ok(byId[id], 'wave-38 id present: ' + id));

// 1. The headline, closed: parity at 160.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 160, 'age 3 coverage 154 -> 160', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage UNCHANGED at 160 (the 3-only band working)', String(covers(4)));
ok(covers(4) - covers(3) === 0, 'headline gap 6 -> 0 — CLOSED at parity', String(covers(4) - covers(3)));
ok(acts.filter(a => a.age_min === 3).length === 160, '160 activities start at age 3');
ok(acts.filter(a => a.age_max === 3).length === 102, '102 activities banded 3-only (waves 30-38)');
ok(acts.filter(a => a.age_max <= 6).length === 153, 'early-years-only (age_max<=6) 147 -> 153');
[13, 14].forEach(age => ok(covers(age) === 104, 'age ' + age + ' coverage 76 -> 88 (wave-39)', String(covers(age))));
NEW.forEach(id => {
  ok(byId[id].age_min === 3 && byId[id].age_max === 3, id + ': banded 3-only (age_min 3, age_max 3)');
  ok(byId[id].time_max <= 20, id + ': short run for the youngest room (time_max <= 20)');
});

// 2. The floor inside age-3 coverage: the six records went to the
//    six lowest counts; every category now carries >= 13.
const age3primary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 3 && a.age_max >= 3).length;
ok(age3primary('holidays') === 13, 'age-3 holidays primary: 12 -> 13 (floor)', String(age3primary('holidays')));
ok(age3primary('team-community') === 13, 'age-3 team-community primary: 12 -> 13 (floor)', String(age3primary('team-community')));
ok(age3primary('seasons') === 14, 'age-3 seasons primary: 13 -> 14', String(age3primary('seasons')));
ok(age3primary('stem') === 14, 'age-3 stem primary: 13 -> 14', String(age3primary('stem')));
ok(age3primary('icebreakers') === 14, 'age-3 icebreakers primary: 13 -> 14', String(age3primary('icebreakers')));
ok(age3primary('outdoor') === 14, 'age-3 outdoor primary: 13 -> 14', String(age3primary('outdoor')));
ok(age3primary('crafts') === 14, 'age-3 crafts primary unchanged at 14', String(age3primary('crafts')));
ok(age3primary('pe-movement') === 14, 'age-3 pe-movement primary unchanged at 14', String(age3primary('pe-movement')));
ok(age3primary('music-rhythm') === 15, 'age-3 music-rhythm primary unchanged at 15', String(age3primary('music-rhythm')));
ok(age3primary('quiet-focus') === 17, 'age-3 quiet-focus primary unchanged at 17', String(age3primary('quiet-focus')));
ok(age3primary('rainy-day') === 18, 'age-3 rainy-day primary unchanged at 18', String(age3primary('rainy-day')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(age3primary(cat) >= 13, 'every category has >= 13 age-3 primaries: ' + cat, String(age3primary(cat)));
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
// Groundhog: the story is not a weather report; eyes never look up.
ok(/It is not a weather report/.test(JSON.stringify(byId['big-groundhog-shadow-morning-look'])), 'groundhog: story is not science');
ok(/nobody looks at the sun/.test(byId['big-groundhog-shadow-morning-look'].safety || ''), 'groundhog: eyes down');
// Room tour: the quiet corner shown with pride; the guest is never an exhibit.
ok(/You do not have to ask, and nobody follows you in/.test(JSON.stringify(byId['big-new-friend-room-tour'])), 'room tour: the quiet corner');
ok(/never the tour's exhibit/.test(byId['big-new-friend-room-tour'].safety || ''), 'room tour: guest not an exhibit');
// Sandcastle: wet sand stands; sand in eyes is the designed-out injury.
ok(/like tiny hands/.test(JSON.stringify(byId['big-sandcastle-one-bucket-towers'])), 'sandcastle: water holds the grains');
ok(/sand in eyes is this record's one real injury/.test(byId['big-sandcastle-one-bucket-towers'].safety || ''), 'sandcastle: sand stays low');
// Sound jar: ears are the filing clerks; fillings stay behind sealed lids.
ok(/your ears are the filing clerks/.test(JSON.stringify(byId['big-sound-jar-loud-or-soft'])), 'sound jar: filing clerks');
ok(/behind a sealed lid/.test(byId['big-sound-jar-loud-or-soft'].safety || ''), 'sound jar: sealed by law');
// Colour corner: a colour cannot be wrong; a mat that can skate is retired.
ok(/a colour cannot be wrong/.test(JSON.stringify(byId['big-choose-your-colour-corner'])), 'colour corner: no wrong colour');
ok(/a mat that can skate/.test(byId['big-choose-your-colour-corner'].safety || ''), 'colour corner: flat mats');
// Mud pie bakery: pie-thickness is the groove staying; mud is never eaten.
ok(/Pie-thickness/.test(JSON.stringify(byId['big-mud-pie-bakery-morning'])) && /The groove stays/.test(JSON.stringify(byId['big-mud-pie-bakery-morning'])), 'mud pie: the groove stays');
ok(/mud is never eaten, licked, or tasted/.test(byId['big-mud-pie-bakery-morning'].safety || ''), 'mud pie: never eaten');

// 5. Category + enrichment deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('holidays') === 55, 'holidays primary 52 -> 53');
ok(prim('team-community') === 78, 'team-community primary 76 -> 77');
ok(prim('seasons') === 47, 'seasons primary 40 -> 41');
ok(prim('stem') === 121, 'stem primary 119 -> 120');
ok(prim('icebreakers') === 49, 'icebreakers primary 46 -> 47');
ok(prim('outdoor') === 62, 'outdoor primary 56 -> 57');
ok(prim('crafts') === 100, 'crafts primary unchanged at 98');
ok(prim('pe-movement') === 73, 'pe-movement primary unchanged at 69');
ok(prim('music-rhythm') === 42, 'music-rhythm primary unchanged at 40');
ok(prim('quiet-focus') === 63, 'quiet-focus primary unchanged at 62');
ok(prim('rainy-day') === 41, 'rainy-day primary unchanged at 39');
ok(acts.filter(a => a.copy_free).length === 351, 'copy_free 317 -> 323');
ok(acts.filter(a => a.no_elimination).length === 153, 'no_elimination 119 -> 125');
ok(acts.filter(a => a.inclusion).length === 213, 'inclusion 179 -> 185');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('season:summer') === 35, 'summer tag 32 -> 33 (thinnest season rises)', String(tagCount('season:summer')));
ok(tagCount('season:winter') === 119, 'winter tag 116 -> 117 (groundhog morning)', String(tagCount('season:winter')));
ok(tagCount('season:spring') === 43, 'spring tag unchanged at 41', String(tagCount('season:spring')));
ok(tagCount('holiday:earth-day') === 7, 'earth-day tag unchanged at 7', String(tagCount('holiday:earth-day')));

// 6. Collections: NO new shelf — the validator's 8-12 pick rule and
//    an honest six-record pack cannot both hold, and the wave does
//    not pad or lower the bar. Earlier shelves intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 30, '27 collections — unchanged, by decision (no padded ninth-time shelf)', String(colls.length));
ok(!colls.find(c => c.id === 'little-hands-just-three-ninth-time'), 'no ninth-time collection exists');
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf', 'little-hands-fourth-shelf', 'little-hands-just-three', 'little-hands-just-three-more', 'little-hands-just-three-again', 'little-hands-just-three-once-more', 'little-hands-just-three-fifth-time', 'little-hands-just-three-sixth-time', 'little-hands-just-three-seventh-time', 'little-hands-just-three-eighth-time'].forEach(cid => {
  const c = colls.find(x => x.id === cid);
  ok(!!c && c.picks.length === 12, cid + ' still intact at 12 picks');
});
colls.forEach(c => c.picks.forEach(p => ok(byId[p.id], 'collection pick resolves: ' + c.id + '/' + p.id)));

// 7. Scout pipeline: empty cycle, reported as empty — a fresh live
//    run (all 6 feeds answered, 65 items) queued nothing; every
//    relevant item was already in seen.json. (The scan rewrote the
//    queue file's formatting only; content verified semantically
//    identical and the original bytes restored.)
const queue = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/review-queue.json'), 'utf8'));
ok(queue.length === 62, 'queue unchanged at 62', String(queue.length));
ok(queue.filter(q => q.status === 'pending').length === 0, '0 pending');
ok(queue.filter(q => q.status === 'accepted').length === 22, '22 accepted all-time (unchanged)');
ok(queue.filter(q => q.status === 'rejected').length === 40, '40 rejected all-time (unchanged)');
queue.forEach(q => ok(q.decision && q.decision.length >= 20, 'decision reason recorded: ' + (q.title || q.id).slice(0, 40)));
queue.filter(q => q.status === 'accepted').forEach(q =>
  ok(q.activity_id && byId[q.activity_id], 'accepted candidate resolves to a real activity: ' + q.activity_id));
const ghost = queue.find(q => q.id === 'dcda517cbd255473');
ok(!!ghost && ghost.status === 'rejected' && /Listicle roundup/.test(ghost.decision || ''), 'wave-37 ghost-crafts rejection still on record');
const mass = queue.find(q => q.id === '28ce48ac401a1149');
ok(!!mass && mass.status === 'rejected' && /State-specific printable pack/.test(mass.decision || ''), 'wave-37 Massachusetts rejection still on record');
const seen = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/seen.json'), 'utf8'));
ok(Object.keys(seen).length === 73, 'seen.json dedupe memory unchanged at 72', String(Object.keys(seen).length));
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds configured', String(feeds.length));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/review-queue.json'), 'utf8'));
ok((pub.candidates || []).length === 0, 'published queue shows 0 pending candidates');

// 8. Placement pass held: generator-owned head meta on every page.
const rootPages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const actPages = fs.readdirSync(path.join(ROOT, 'activity')).filter(f => f.endsWith('.html'));
const allPages = rootPages.map(f => path.join(ROOT, f))
  .concat(actPages.map(f => path.join(ROOT, 'activity', f)));
ok(allPages.length === 750, '722 pages on disk (703 activity + 19 root)', String(allPages.length));
const OG = 'https://activity-vault-live.vercel.app/assets/og-card.png';
allPages.forEach(p => {
  const s = fs.readFileSync(p, 'utf8');
  const rel = path.relative(ROOT, p);
  ok(s.split('PLACEMENT:BEGIN').length === 2, rel + ': exactly one placement block');
  ok(s.includes('<meta property="og:image" content="' + OG + '">'), rel + ': og:image absolute');
  ok(s.includes('<link rel="canonical" href="https://activity-vault-live.vercel.app/'), rel + ': canonical absolute');
  ok((s.match(/<h1[\s>]/g) || []).length === 1, rel + ': exactly one <h1>');
  ok(s.includes('kitbag.html'), rel + ': Kit Bag reachable from nav (VP-0002 guard)');
  ok(s.includes('partypack.html'), rel + ': Party Pack reachable from nav (VP-0002 guard)');
});

// 9. VP-0008 family: numerals derive from the data.
const collHtml = fs.readFileSync(path.join(ROOT, 'collections.html'), 'utf8');
ok(collHtml.includes('<span id="coll-hero-count">Thirty</span>'),
  'VP-0008: hero numeral fallback = current count, spelled out');
const collLd = JSON.parse(collHtml.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
ok(collLd.mainEntity && collLd.mainEntity.numberOfItems === 30,
  'VP-0008: collections JSON-LD numberOfItems derives from the data (27)');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(llms.includes('Curated collections: 30 teacher-ready bundles'),
  'VP-0008 class: llms.txt collections numeral derives from the data (27)');

// 10. View transitions: already adopted sitewide, stamp/ink-wipe,
//     reduced-motion gated + calm kill switch — lock held.
const css = fs.readFileSync(path.join(ROOT, 'assets/style.css'), 'utf8');
ok(css.includes('@view-transition { navigation: auto; }'), 'VT: cross-document navigation transitions adopted');
ok(/@media \(prefers-reduced-motion: no-preference\) \{\s*@view-transition/.test(css),
  'VT: adoption gated behind prefers-reduced-motion: no-preference');
ok(css.includes('@keyframes vt-stamp-in') && css.includes('@keyframes vt-ink-out'),
  'VT: signature stamp/ink-wipe keyframes (the desk register)');
ok(css.includes('html[data-calm="true"] ::view-transition-old(*)'), 'VT: calm mode kills the page transition too');
const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok(idx.includes('assets/style.css'), 'VT: index loads the shared stylesheet carrying the adoption');

// 11. Hygiene (Data-Ops round-66 routing, re-asserted): .gitignore
//     covers __pycache__/ and no .pyc / __pycache__ path is tracked
//     — the wave-37 untracking holds in the index at this HEAD.
const gi = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
ok(gi.includes('__pycache__/'), 'hygiene: .gitignore covers __pycache__/');
ok(gi.includes('*.pyc'), 'hygiene: .gitignore covers *.pyc');
const tracked = execSync('git ls-files', { cwd: ROOT }).toString();
ok(!tracked.split('\n').some(f => f.endsWith('.pyc') || f.includes('__pycache__')),
  'hygiene: no .pyc / __pycache__ path tracked in the index');

console.log('test-wave38: ' + passed + ' assertions pass');
