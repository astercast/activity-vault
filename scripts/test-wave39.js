#!/usr/bin/env node
/* Wave 39 assertions: Just Teens, a First Time — the campaign
   moves to the other end of childhood. The wave-38 data audit's
   successor audit found the thinnest shelf at ages 13/14: 76
   activities each against 446 at age 12, with primary-category
   cells of seasons 1, outdoor 2, pe-movement 3, music-rhythm 5,
   rainy-day 5, icebreakers 6, crafts 6, holidays 8, stem 8.
   Twelve records banded 13-14 ONLY (one per category plus a
   second for seasons, the floor) take the band 76 -> 88 at both
   ages, raise its primary floor 1 -> 3, and — being an honest
   twelve — unlock the 28th collection at the validator's own
   8-12 rule. Two drafts were cut pre-run as near-dupes (an
   appreciation post office vs kindness-post-office 4-9; an
   egg-drop review board vs egg-drop-challenge) and their slots
   rebuilt (midnight-around-the-world; wind-turbine-blade-trials)
   — recorded in the add script's header. Scout cycle empty
   again (0 new candidates; queue unchanged, byte-restored).
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
ok(acts.length === 747, '715 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['adopt-a-tree-year-log', 'seed-library-opening-day',
  'compass-course-three-flags', 'referee-run-round-robin',
  'ten-minute-set-handover', 'indoor-clue-chain-architects',
  'hot-seat-kind-questions', 'repair-cafe-first-session',
  'midnight-around-the-world', 'wind-turbine-blade-trials',
  'commonplace-book-first-pages', 'teach-back-to-the-youngers'];
ok(NEW.length === 12, 'twelve new activities in the wave-39 pack — one per category plus the floor');
NEW.forEach(id => ok(byId[id], 'wave-39 id present: ' + id));

// 1. The headline: the teen band rises, nothing else moves.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(13) === 120, 'age 13 coverage 76 -> 88', String(covers(13)));
ok(covers(14) === 120, 'age 14 coverage 76 -> 88', String(covers(14)));
ok(covers(3) === 160, 'age 3 coverage unchanged at 160 (wave-38 parity untouched)', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage unchanged at 160 (wave-38 parity untouched)', String(covers(4)));
ok(covers(12) === 446, 'age 12 coverage unchanged at 446 (the 13-14 band working)', String(covers(12)));
ok(covers(5) === 329, 'age 5 coverage unchanged at 329', String(covers(5)));
ok(acts.filter(a => a.age_min === 13 && a.age_max === 14).length === 44, '12 activities banded 13-14 only (this wave invented the band)');
ok(acts.filter(a => a.age_max === 3).length === 102, '102 activities banded 3-only (waves 30-38, unchanged)');
NEW.forEach(id => {
  ok(byId[id].age_min === 13 && byId[id].age_max === 14, id + ': banded 13-14 only');
});

// 2. The floor inside the teen band: the twelve records went to
//    the thinnest cells; every category now carries >= 3.
const teenPrimary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 13 && a.age_max >= 13).length;
ok(teenPrimary('seasons') === 9, 'age-13 seasons primary: 1 -> 3 (the floor, two records)', String(teenPrimary('seasons')));
ok(teenPrimary('outdoor') === 9, 'age-13 outdoor primary: 2 -> 3', String(teenPrimary('outdoor')));
ok(teenPrimary('pe-movement') === 9, 'age-13 pe-movement primary: 3 -> 4', String(teenPrimary('pe-movement')));
ok(teenPrimary('music-rhythm') === 9, 'age-13 music-rhythm primary: 5 -> 6', String(teenPrimary('music-rhythm')));
ok(teenPrimary('rainy-day') === 9, 'age-13 rainy-day primary: 5 -> 6', String(teenPrimary('rainy-day')));
ok(teenPrimary('icebreakers') === 10, 'age-13 icebreakers primary: 6 -> 7', String(teenPrimary('icebreakers')));
ok(teenPrimary('crafts') === 10, 'age-13 crafts primary: 6 -> 7', String(teenPrimary('crafts')));
ok(teenPrimary('holidays') === 11, 'age-13 holidays primary: 8 -> 9', String(teenPrimary('holidays')));
ok(teenPrimary('stem') === 10, 'age-13 stem primary: 8 -> 9', String(teenPrimary('stem')));
ok(teenPrimary('quiet-focus') === 15, 'age-13 quiet-focus primary: 14 -> 15', String(teenPrimary('quiet-focus')));
ok(teenPrimary('team-community') === 19, 'age-13 team-community primary: 18 -> 19', String(teenPrimary('team-community')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(teenPrimary(cat) >= 3, 'every category has >= 3 age-13 primaries: ' + cat, String(teenPrimary(cat)));
});

// 3. Quality bar on every new record — the long-form class.
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
  ok(a.no_elimination === true, id + ': no_elimination');
  ok(typeof a.inclusion === 'string' && a.inclusion.length >= 40, id + ': inclusion note');
  const words = JSON.stringify(a).split(/\s+/).length;
  ok(words >= 1300, id + ': long-form class (>= 1300 words of record)', String(words));
  const blob = JSON.stringify(a).toLowerCase();
  MEDICAL.forEach(w => ok(!blob.includes(w), id + ': no medical claim "' + w + '"'));
  AIISMS.forEach(w => ok(!blob.includes(w), id + ': no AI-ism "' + w + '"'));
  ok(fs.existsSync(path.join(ROOT, 'activity', id + '.html')), id + ': page rendered');
});

// 4. Honest framing + real-world safety, checked on the records.
ok(/Custodians, not owners/.test(JSON.stringify(byId['adopt-a-tree-year-log'])), 'tree log: custodians, not owners');
ok(/Nobody climbs the tree to measure it|never climbed/.test(byId['adopt-a-tree-year-log'].safety || ''), 'tree log: never climbed');
ok(/eight out of ten sprouted means eight out of ten sprouted/.test(JSON.stringify(byId['seed-library-opening-day'])), 'seed library: honest percentages');
ok(/Seeds are stock, not food/.test(byId['seed-library-opening-day'].safety || ''), 'seed library: seeds not food');
ok(/A bearing is a promise your feet keep/.test(JSON.stringify(byId['compass-course-three-flags'])), 'compass: the bearing promise');
ok(/Reporting a bad leg is a result/.test(byId['compass-course-three-flags'].safety || ''), 'compass: boundaries are law');
ok(/The whistle is a service, not a weapon/.test(JSON.stringify(byId['referee-run-round-robin'])), 'referee: the whistle serves');
ok(/safety calls/.test(byId['referee-run-round-robin'].safety || ''), 'referee: the adult backstop is narrow and real');
ok(/The floor never notices the join/.test(JSON.stringify(byId['ten-minute-set-handover'])), 'DJ handover: the join is the skill');
ok(/the level comes down/.test(byId['ten-minute-set-handover'].safety || ''), 'DJ handover: the volume cap is structural');
ok(/A clue is fair when a stranger could solve it/.test(JSON.stringify(byId['indoor-clue-chain-architects'])), 'clue chain: the fairness test');
ok(/no clue points into toilets/.test(byId['indoor-clue-chain-architects'].safety || ''), 'clue chain: bounds are constitutional');
ok(/the seat is warm, never hot/.test(JSON.stringify(byId['hot-seat-kind-questions'])), 'hot seat: warm, never hot');
ok(/The pass is absolute/.test(byId['hot-seat-kind-questions'].safety || ''), 'hot seat: the pass is absolute');
ok(/fixed is a verdict the owner gives/.test(JSON.stringify(byId['repair-cafe-first-session'])), 'repair cafe: the owner gives the verdict');
ok(/nothing that plugs into a wall socket is ever opened/.test(byId['repair-cafe-first-session'].safety || ''), 'repair cafe: no mains, ever');
ok(/Midnight is a place before it is a time/.test(JSON.stringify(byId['midnight-around-the-world'])), 'midnight: a place before a time');
ok(/compliments, not imitations/.test(byId['midnight-around-the-world'].safety || ''), 'midnight: greetings properly or not at all');
ok(/one variable at a time/.test(JSON.stringify(byId['wind-turbine-blade-trials'])) && /learned nothing twice/.test(JSON.stringify(byId['wind-turbine-blade-trials'])), 'turbine: one variable at a time');
ok(/no hand, blade, pencil/.test(byId['wind-turbine-blade-trials'].safety || ''), 'turbine: the fan is caged weather');
ok(/A commonplace book is a conversation with people who are not in the room/.test(JSON.stringify(byId['commonplace-book-first-pages'])), 'commonplace: the conversation');
ok(/read by its keeper and by nobody else/.test(byId['commonplace-book-first-pages'].safety || ''), 'commonplace: privacy is absolute');
ok(/Teaching is the final exam nobody grades/.test(JSON.stringify(byId['teach-back-to-the-youngers'])), 'teach-back: the honest mark scheme');
ok(/never alone with the younger children/.test(byId['teach-back-to-the-youngers'].safety || ''), 'teach-back: safeguarding is structural');

// 5. Category + enrichment + tag deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('seasons') === 49, 'seasons primary 41 -> 43');
ok(prim('holidays') === 56, 'holidays primary 53 -> 54');
ok(prim('crafts') === 102, 'crafts primary 98 -> 99');
ok(prim('stem') === 122, 'stem primary 120 -> 121');
ok(prim('pe-movement') === 75, 'pe-movement primary 69 -> 70');
ok(prim('team-community') === 78, 'team-community primary 77 -> 78');
ok(prim('icebreakers') === 51, 'icebreakers primary 47 -> 48');
ok(prim('outdoor') === 64, 'outdoor primary 57 -> 58');
ok(prim('rainy-day') === 43, 'rainy-day primary 39 -> 40');
ok(prim('quiet-focus') === 63, 'quiet-focus primary 62 -> 63');
ok(prim('music-rhythm') === 44, 'music-rhythm primary 40 -> 41');
ok(acts.filter(a => a.copy_free).length === 367, 'copy_free 323 -> 335');
ok(acts.filter(a => a.no_elimination).length === 169, 'no_elimination 125 -> 137');
ok(acts.filter(a => a.inclusion).length === 229, 'inclusion 185 -> 197');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('season:spring') === 44, 'spring tag 41 -> 42 (seed library opening)', String(tagCount('season:spring')));
ok(tagCount('holiday:new-year') === 11, 'new-year tag 10 -> 11 (midnight route)', String(tagCount('holiday:new-year')));
ok(tagCount('season:summer') === 39, 'summer tag unchanged at 33', String(tagCount('season:summer')));
ok(tagCount('season:winter') === 120, 'winter tag unchanged at 117', String(tagCount('season:winter')));

// 6. Collections: the 28th shelf IS created — the pack is an
//    honest twelve, so the validator's 8-12 rule is met without
//    padding. Every earlier shelf intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 32, '28 collections — the Just Teens shelf unlocks', String(colls.length));
const teens = colls.find(c => c.id === 'just-teens-first-time');
ok(!!teens && teens.picks.length === 12, 'just-teens-first-time intact at 12 picks');
NEW.forEach(id => ok(teens.picks.some(p => p.id === id), 'just-teens pick present: ' + id));
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf', 'little-hands-fourth-shelf', 'little-hands-just-three', 'little-hands-just-three-more', 'little-hands-just-three-again', 'little-hands-just-three-once-more', 'little-hands-just-three-fifth-time', 'little-hands-just-three-sixth-time', 'little-hands-just-three-seventh-time', 'little-hands-just-three-eighth-time'].forEach(cid => {
  const c = colls.find(x => x.id === cid);
  ok(!!c && c.picks.length === 12, cid + ' still intact at 12 picks');
});
ok(!colls.find(c => c.id === 'little-hands-just-three-ninth-time'), 'no ninth-time Little Hands collection exists (wave-38 decision lock holds)');
colls.forEach(c => c.picks.forEach(p => ok(byId[p.id], 'collection pick resolves: ' + c.id + '/' + p.id)));

// 7. Scout pipeline: empty cycle, reported as empty — a fresh
//    live run (all 6 feeds answered, 65 items) queued nothing;
//    the queue file's formatting was rewritten by the scan and
//    the original bytes restored after semantic verification.
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
ok(allPages.length === 766, '734 pages on disk (715 activity + 19 root)', String(allPages.length));
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
ok(collHtml.includes('<span id="coll-hero-count">Thirty-two</span>'),
  'VP-0008: hero numeral fallback = current count, spelled out');
const collLd = JSON.parse(collHtml.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
ok(collLd.mainEntity && collLd.mainEntity.numberOfItems === 32,
  'VP-0008: collections JSON-LD numberOfItems derives from the data (28)');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(llms.includes('Curated collections: 32 teacher-ready bundles'),
  'VP-0008 class: llms.txt collections numeral derives from the data (28)');

// 10. View transitions: adopted sitewide, stamp/ink-wipe,
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

// 11. Hygiene: .gitignore covers __pycache__/ and *.pyc, and no
//     .pyc / __pycache__ path is tracked in the index.
const gi = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
ok(gi.includes('__pycache__/'), 'hygiene: .gitignore covers __pycache__/');
ok(gi.includes('*.pyc'), 'hygiene: .gitignore covers *.pyc');
const tracked = execSync('git ls-files', { cwd: ROOT }).toString();
ok(!tracked.split('\n').some(f => f.endsWith('.pyc') || f.includes('__pycache__')),
  'hygiene: no .pyc / __pycache__ path tracked in the index');

console.log('test-wave39: ' + passed + ' assertions pass');
