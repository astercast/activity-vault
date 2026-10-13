#!/usr/bin/env node
/* Wave 42 assertions: Just Teens, a Fourth Time — the floor
   rises to eight. This wave's fresh audit measured the whole
   archive again before building: ages 13/14 still thinnest
   at 104 each (3/4 at 160, 12 at 446), and inside the band
   the primary cells were seasons 7, outdoor 7, pe-movement
   7, music-rhythm 7, rainy-day 7, icebreakers 8, crafts 8,
   stem 9, holidays 10, quiet-focus 15, team-community 19 —
   floor 7, shared by five categories. The pack is one record
   for each of the eight thinnest cells (the five at 7, the
   two at 8, and stem at 9), banded 13-14 ONLY, taking the
   band 104 -> 112 at both ages and its floor 7 -> 8, and
   unlocking the 31st collection at exactly the 8-pick
   validator minimum, unpadded. Two drafts were cut pre-run
   as near-dupes (a guided constellation tour vs
   star-party-hosts; a speed-introductions carousel vs
   two-minute-mingle) and their slots rebuilt (dusk bat exit
   count; spectrum line introductions) — recorded in the add
   script's header. Scout cycle: 0 new candidates queued;
   the queue unchanged and fully decided; seen.json unchanged
   at 73 this cycle. Run after scripts/build.py.
   Exits non-zero on first failure. */
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
ok(acts.length === 739, '739 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['overwintering-garlic-planting-crew', 'dusk-bat-exit-count',
  'tchoukball-first-session', 'song-arranging-studio-first-session',
  'one-room-documentary-crew', 'spectrum-line-introductions',
  'pamphlet-stitch-bookbinding-studio', 'solar-oven-temperature-trials'];
ok(NEW.length === 8, 'eight new activities in the wave-42 pack — one per the band\'s eight thinnest primary cells');
NEW.forEach(id => ok(byId[id], 'wave-42 id present: ' + id));

// 1. The headline: the teen band rises, nothing else moves.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(13) === 112, 'age 13 coverage 104 -> 112', String(covers(13)));
ok(covers(14) === 112, 'age 14 coverage 104 -> 112', String(covers(14)));
ok(covers(3) === 160, 'age 3 coverage unchanged at 160 (wave-38 parity untouched)', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage unchanged at 160 (wave-38 parity untouched)', String(covers(4)));
ok(covers(12) === 446, 'age 12 coverage unchanged at 446', String(covers(12)));
ok(covers(5) === 329, 'age 5 coverage unchanged at 329', String(covers(5)));
ok(160 - covers(13) === 48, 'remaining gap to the 160 benchmark: 48 at age 13, stated numerically');
ok(160 - covers(14) === 48, 'remaining gap to the 160 benchmark: 48 at age 14, stated numerically');
ok(acts.filter(a => a.age_min === 13 && a.age_max === 14).length === 36, '36 activities banded 13-14 only (12 wave-39 + 8 wave-40 + 8 wave-41 + 8 wave-42)');
ok(acts.filter(a => a.age_max === 3).length === 102, '102 activities banded 3-only (waves 30-38, unchanged)');
NEW.forEach(id => {
  ok(byId[id].age_min === 13 && byId[id].age_max === 14, id + ': banded 13-14 only');
});

// 2. The floor inside the teen band: the eight records went to
//    the eight thinnest cells; every category now carries >= 8.
const teenPrimary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 13 && a.age_max >= 13).length;
ok(teenPrimary('seasons') === 8, 'age-13 seasons primary: 7 -> 8', String(teenPrimary('seasons')));
ok(teenPrimary('outdoor') === 8, 'age-13 outdoor primary: 7 -> 8', String(teenPrimary('outdoor')));
ok(teenPrimary('pe-movement') === 8, 'age-13 pe-movement primary: 7 -> 8', String(teenPrimary('pe-movement')));
ok(teenPrimary('music-rhythm') === 8, 'age-13 music-rhythm primary: 7 -> 8', String(teenPrimary('music-rhythm')));
ok(teenPrimary('rainy-day') === 8, 'age-13 rainy-day primary: 7 -> 8', String(teenPrimary('rainy-day')));
ok(teenPrimary('icebreakers') === 9, 'age-13 icebreakers primary: 8 -> 9', String(teenPrimary('icebreakers')));
ok(teenPrimary('crafts') === 9, 'age-13 crafts primary: 8 -> 9', String(teenPrimary('crafts')));
ok(teenPrimary('stem') === 10, 'age-13 stem primary: 9 -> 10', String(teenPrimary('stem')));
ok(teenPrimary('holidays') === 10, 'age-13 holidays primary: 10, unchanged', String(teenPrimary('holidays')));
ok(teenPrimary('quiet-focus') === 15, 'age-13 quiet-focus primary: 15, unchanged', String(teenPrimary('quiet-focus')));
ok(teenPrimary('team-community') === 19, 'age-13 team-community primary: 19, unchanged', String(teenPrimary('team-community')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(teenPrimary(cat) >= 8, 'every category has >= 8 age-13 primaries (floor 7 -> 8): ' + cat, String(teenPrimary(cat)));
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
ok(/You plant for a harvest you will hand to summer/.test(JSON.stringify(byId['overwintering-garlic-planting-crew'])), 'garlic: plant for a harvest handed to summer');
ok(/never carried point-first toward another person/.test(byId['overwintering-garlic-planting-crew'].safety || ''), 'garlic: tools carried point-down');
ok(/Count what leaves; never chase what returns/.test(JSON.stringify(byId['dusk-bat-exit-count'])), 'bat count: count what leaves');
ok(/no bat is ever handled/.test(byId['dusk-bat-exit-count'].safety || ''), 'bat count: no bat is ever handled');
ok(/The catch is the defence/.test(JSON.stringify(byId['tchoukball-first-session'])), 'tchoukball: the catch is the defence');
ok(/forbidden zone stays empty while a shot is live/.test(byId['tchoukball-first-session'].safety || ''), 'tchoukball: the zone stays empty');
ok(/An arrangement is an argument about what the song is/.test(JSON.stringify(byId['song-arranging-studio-first-session'])), 'arranging: an arrangement is an argument');
ok(/if ears are ringing, the room was too loud/.test(byId['song-arranging-studio-first-session'].safety || ''), 'arranging: volume governed');
ok(/Consent comes before camera, every time/.test(JSON.stringify(byId['one-room-documentary-crew'])), 'documentary: consent before camera');
ok(/nothing is posted, shared or uploaded/.test(byId['one-room-documentary-crew'].safety || ''), 'documentary: nothing is posted or uploaded');
ok(/Your feet answer first; then you get to explain/.test(JSON.stringify(byId['spectrum-line-introductions'])), 'spectrum: feet answer first');
ok(/screened in advance/.test(byId['spectrum-line-introductions'].safety || ''), 'spectrum: the deck is screened in advance');
ok(/A book is a machine you can make by hand/.test(JSON.stringify(byId['pamphlet-stitch-bookbinding-studio'])), 'bookbinding: a book is a machine');
ok(/used only by the adult/.test(byId['pamphlet-stitch-bookbinding-studio'].safety || ''), 'bookbinding: the sharp station is the adult\'s alone');
ok(/Sunlight is slow; the log is how you know it is working/.test(JSON.stringify(byId['solar-oven-temperature-trials'])), 'solar: sunlight is slow, the log knows');
ok(/tested with the thermometer, never a hand/.test(byId['solar-oven-temperature-trials'].safety || ''), 'solar: interiors tested by thermometer, never a hand');

// 5. Category + enrichment + tag deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('seasons') === 48, 'seasons primary 47 -> 48');
ok(prim('outdoor') === 63, 'outdoor primary 62 -> 63');
ok(prim('pe-movement') === 74, 'pe-movement primary 73 -> 74');
ok(prim('music-rhythm') === 43, 'music-rhythm primary 42 -> 43');
ok(prim('rainy-day') === 42, 'rainy-day primary 41 -> 42');
ok(prim('icebreakers') === 50, 'icebreakers primary 49 -> 50');
ok(prim('crafts') === 101, 'crafts primary 100 -> 101');
ok(prim('stem') === 122, 'stem primary 121 -> 122');
ok(prim('holidays') === 55, 'holidays primary unchanged at 55');
ok(prim('team-community') === 78, 'team-community primary unchanged at 78');
ok(prim('quiet-focus') === 63, 'quiet-focus primary unchanged at 63');
ok(acts.filter(a => a.copy_free).length === 359, 'copy_free 351 -> 359');
ok(acts.filter(a => a.no_elimination).length === 161, 'no_elimination 153 -> 161');
ok(acts.filter(a => a.inclusion).length === 221, 'inclusion 213 -> 221');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('season:summer') === 37, 'summer tag 35 -> 37 (bat season + solar trials — the thinnest season rises twice)', String(tagCount('season:summer')));
ok(tagCount('season:fall') === 55, 'fall tag 54 -> 55 (the garlic planting)', String(tagCount('season:fall')));
ok(tagCount('season:winter') === 120, 'winter tag 119 -> 120 (the garlic winter)', String(tagCount('season:winter')));
ok(tagCount('season:spring') === 43, 'spring tag unchanged at 43', String(tagCount('season:spring')));
ok(tagCount('holiday:lunar-new-year') === 7, 'lunar-new-year tag unchanged at 7', String(tagCount('holiday:lunar-new-year')));

// 6. Collections: the 31st shelf IS created — the pack is an
//    honest eight, inside the validator's 8-12 rule at its
//    minimum. Every earlier shelf intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 31, '31 collections — the Fourth Time shelf unlocks at exactly the 8-pick minimum', String(colls.length));
const teens4 = colls.find(c => c.id === 'just-teens-fourth-time');
ok(!!teens4 && teens4.picks.length === 8, 'just-teens-fourth-time at exactly 8 picks (the measured pack, unpadded)');
NEW.forEach(id => ok(teens4.picks.some(p => p.id === id), 'just-teens-fourth-time pick present: ' + id));
const teens3 = colls.find(c => c.id === 'just-teens-third-time');
ok(!!teens3 && teens3.picks.length === 8, 'just-teens-third-time still intact at 8 picks');
const teens2 = colls.find(c => c.id === 'just-teens-second-time');
ok(!!teens2 && teens2.picks.length === 8, 'just-teens-second-time still intact at 8 picks');
const teens1 = colls.find(c => c.id === 'just-teens-first-time');
ok(!!teens1 && teens1.picks.length === 12, 'just-teens-first-time still intact at 12 picks');
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf', 'little-hands-fourth-shelf', 'little-hands-just-three', 'little-hands-just-three-more', 'little-hands-just-three-again', 'little-hands-just-three-once-more', 'little-hands-just-three-fifth-time', 'little-hands-just-three-sixth-time', 'little-hands-just-three-seventh-time', 'little-hands-just-three-eighth-time'].forEach(cid => {
  const c = colls.find(x => x.id === cid);
  ok(!!c && c.picks.length === 12, cid + ' still intact at 12 picks');
});
ok(!colls.find(c => c.id === 'little-hands-just-three-ninth-time'), 'no ninth-time Little Hands collection exists (wave-38 decision lock holds)');
colls.forEach(c => {
  ok(c.picks.length >= 8 && c.picks.length <= 12, 'collection within the validator 8-12 rule: ' + c.id, String(c.picks.length));
  c.picks.forEach(p => ok(byId[p.id], 'collection pick resolves: ' + c.id + '/' + p.id));
});

// 7. Scout pipeline: 0 new candidates — a fresh live run (all
//    6 feeds answered, 65 items) queued nothing; the queue is
//    unchanged and fully decided; seen.json unchanged at 73
//    this cycle; the scan's formatting rewrite of the queue
//    was restored byte-identical.
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
ok(Object.keys(seen).length === 73, 'seen.json dedupe memory unchanged at 73 this cycle', String(Object.keys(seen).length));
ok(!!seen['12488135232aeb6d'], 'the wave-41 dropped deal post is still in seen.json, by its hash');
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds configured', String(feeds.length));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/review-queue.json'), 'utf8'));
ok((pub.candidates || []).length === 0, 'published queue shows 0 pending candidates');

// 8. Placement pass held: generator-owned head meta on every page.
const rootPages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const actPages = fs.readdirSync(path.join(ROOT, 'activity')).filter(f => f.endsWith('.html'));
const allPages = rootPages.map(f => path.join(ROOT, f))
  .concat(actPages.map(f => path.join(ROOT, 'activity', f)));
ok(allPages.length === 758, '758 pages on disk (739 activity + 19 root)', String(allPages.length));
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

// 9. VP-0008 family: numerals derive from the data; the day
//    page's catalogue count is the current data count (739).
const collHtml = fs.readFileSync(path.join(ROOT, 'collections.html'), 'utf8');
ok(collHtml.includes('<span id="coll-hero-count">Thirty-one</span>'),
  'VP-0008: hero numeral fallback = current count, spelled out');
const collLd = JSON.parse(collHtml.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
ok(collLd.mainEntity && collLd.mainEntity.numberOfItems === 31,
  'VP-0008: collections JSON-LD numberOfItems derives from the data (31)');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(llms.includes('Curated collections: 31 teacher-ready bundles'),
  'VP-0008 class: llms.txt collections numeral derives from the data (31)');
const dayHtml = fs.readFileSync(path.join(ROOT, 'day.html'), 'utf8');
ok((dayHtml.match(/739 real activities/g) || []).length >= 4 && !dayHtml.includes('731 real activities'),
  'day.html catalogue count current at 739 (no stale count survives)');

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

console.log('test-wave42: ' + passed + ' assertions pass');
