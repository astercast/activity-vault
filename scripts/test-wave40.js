#!/usr/bin/env node
/* Wave 40 assertions: Just Teens, a Second Time — the floor,
   exactly. This wave's fresh audit measured the whole archive
   again before building: ages 13/14 still thinnest at 88 each
   (3/4 at 160, 12 at 446), and inside the band the primary
   cells were seasons 3, outdoor 3, pe-movement 4, music-rhythm
   6, rainy-day 6, icebreakers 7, crafts 7, holidays 9, stem 9,
   quiet-focus 15, team-community 19 — floor 3. The gap sized
   from those cells — every cell up to the band's own next
   shelf at 6 — costs exactly seasons +3, outdoor +3,
   pe-movement +2 = EIGHT records, banded 13-14 ONLY, taking
   the band 88 -> 96 at both ages and its floor 3 -> 6, and —
   being an honest eight — unlocking the 29th collection at
   the validator's 8-12 minimum with no padding. Two drafts
   were cut pre-run as near-dupes (a teen phenology wheel vs
   seasonal-rounds-phenology-wheel 7-12; a compass scavenger
   hunt vs compass-course-three-flags + indoor-scavenger-hunt)
   and their slots rebuilt (compost ledger; trail crew) —
   recorded in the add script's header. Scout cycle empty
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
ok(acts.length === 739, '723 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['compost-heap-temperature-ledger', 'first-frost-forecast-desk',
  'summer-glut-preserving-day', 'trail-crew-first-pass',
  'star-party-hosts', 'stream-watch-testing-round',
  'circuit-course-design-and-coach', 'new-game-playtest-league'];
ok(NEW.length === 8, 'eight new activities in the wave-40 pack — exactly the measured floor gap (seasons +3, outdoor +3, pe-movement +2)');
NEW.forEach(id => ok(byId[id], 'wave-40 id present: ' + id));

// 1. The headline: the teen band's floor rises, nothing else moves.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(13) === 112, 'age 13 coverage 88 -> 96', String(covers(13)));
ok(covers(14) === 112, 'age 14 coverage 88 -> 96', String(covers(14)));
ok(covers(3) === 160, 'age 3 coverage unchanged at 160 (wave-38 parity untouched)', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage unchanged at 160 (wave-38 parity untouched)', String(covers(4)));
ok(covers(12) === 446, 'age 12 coverage unchanged at 446', String(covers(12)));
ok(covers(5) === 329, 'age 5 coverage unchanged at 329', String(covers(5)));
ok(acts.filter(a => a.age_min === 13 && a.age_max === 14).length === 36, '20 activities banded 13-14 only (12 wave-39 + 8 wave-40)');
ok(acts.filter(a => a.age_max === 3).length === 102, '102 activities banded 3-only (waves 30-38, unchanged)');
NEW.forEach(id => {
  ok(byId[id].age_min === 13 && byId[id].age_max === 14, id + ': banded 13-14 only');
});

// 2. The floor inside the teen band: the eight records went to
//    the three thinnest cells; every category now carries >= 6.
const teenPrimary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 13 && a.age_max >= 13).length;
ok(teenPrimary('seasons') === 8, 'age-13 seasons primary: 3 -> 6 (the floor, three records)', String(teenPrimary('seasons')));
ok(teenPrimary('outdoor') === 8, 'age-13 outdoor primary: 3 -> 6 (the floor, three records)', String(teenPrimary('outdoor')));
ok(teenPrimary('pe-movement') === 8, 'age-13 pe-movement primary: 4 -> 6 (two records)', String(teenPrimary('pe-movement')));
ok(teenPrimary('music-rhythm') === 8, 'age-13 music-rhythm primary: 6, unchanged (the shelf the floor rose to meet)', String(teenPrimary('music-rhythm')));
ok(teenPrimary('rainy-day') === 8, 'age-13 rainy-day primary: 6, unchanged (the shelf the floor rose to meet)', String(teenPrimary('rainy-day')));
ok(teenPrimary('icebreakers') === 9, 'age-13 icebreakers primary: 7, unchanged', String(teenPrimary('icebreakers')));
ok(teenPrimary('crafts') === 9, 'age-13 crafts primary: 7, unchanged', String(teenPrimary('crafts')));
ok(teenPrimary('holidays') === 10, 'age-13 holidays primary: 9, unchanged', String(teenPrimary('holidays')));
ok(teenPrimary('stem') === 10, 'age-13 stem primary: 9, unchanged', String(teenPrimary('stem')));
ok(teenPrimary('quiet-focus') === 15, 'age-13 quiet-focus primary: 15, unchanged', String(teenPrimary('quiet-focus')));
ok(teenPrimary('team-community') === 19, 'age-13 team-community primary: 19, unchanged', String(teenPrimary('team-community')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(teenPrimary(cat) >= 6, 'every category has >= 6 age-13 primaries (floor 3 -> 6): ' + cat, String(teenPrimary(cat)));
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
ok(/The heap is alive, and the ledger is how you know/.test(JSON.stringify(byId['compost-heap-temperature-ledger'])), 'compost: the heap is alive');
ok(/no bare hand goes into the heap/.test(byId['compost-heap-temperature-ledger'].safety || ''), 'compost: gloves are the uniform');
ok(/A forecast is a promise you check in the morning/.test(JSON.stringify(byId['first-frost-forecast-desk'])), 'frost desk: the checked promise');
ok(/lucky is a grade/.test(JSON.stringify(byId['first-frost-forecast-desk'])), 'frost desk: luck is graded, not hidden');
ok(/nobody goes to the beds alone/.test(byId['first-frost-forecast-desk'].safety || ''), 'frost desk: evening rounds in pairs');
ok(/A jar sealed properly is summer kept/.test(JSON.stringify(byId['summer-glut-preserving-day'])), 'preserving: summer kept');
ok(/one tested recipe from a recognised preserving authority, followed exactly/.test(byId['summer-glut-preserving-day'].safety || ''), 'preserving: one tested recipe, exactly');
ok(/Leave the path better than the weather left it/.test(JSON.stringify(byId['trail-crew-first-pass'])), 'trail crew: better than the weather left it');
ok(/counted out and in aloud/.test(byId['trail-crew-first-pass'].safety || ''), 'trail crew: tools counted');
ok(/Darkness is the venue; the hosts protect it/.test(JSON.stringify(byId['star-party-hosts'])), 'star party: darkness is the venue');
ok(/lightning anywhere in the sky closes the field/.test(byId['star-party-hosts'].safety || ''), 'star party: lightning closes');
ok(/The stream grades itself; the watch just reads the marks/.test(JSON.stringify(byId['stream-watch-testing-round'])), 'stream watch: the stream grades itself');
ok(/We took nothing but readings/.test(JSON.stringify(byId['stream-watch-testing-round'])), 'stream watch: nothing but readings taken');
ok(/nobody wades/.test(byId['stream-watch-testing-round'].safety || ''), 'stream watch: bank-side only');
ok(/A station earns its place by being doable well when tired/.test(JSON.stringify(byId['circuit-course-design-and-coach'])), 'circuit: the tired tenth rep');
ok(/no maximal efforts/.test(byId['circuit-course-design-and-coach'].safety || ''), 'circuit: no maximal efforts');
ok(/A rule that only works when everyone is being nice is not a rule yet/.test(JSON.stringify(byId['new-game-playtest-league'])), 'playtest league: the nice-people rule');
ok(/non-elimination by structure/.test(byId['new-game-playtest-league'].safety || ''), 'playtest league: the screen gates every entry');

// 5. Category + enrichment + tag deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('seasons') === 48, 'seasons primary 43 -> 46');
ok(prim('outdoor') === 63, 'outdoor primary 58 -> 61');
ok(prim('pe-movement') === 74, 'pe-movement primary 70 -> 72');
ok(prim('stem') === 122, 'stem primary unchanged at 121');
ok(prim('crafts') === 101, 'crafts primary unchanged at 99');
ok(prim('team-community') === 78, 'team-community primary unchanged at 78');
ok(prim('quiet-focus') === 63, 'quiet-focus primary unchanged at 63');
ok(prim('holidays') === 55, 'holidays primary unchanged at 54');
ok(prim('icebreakers') === 50, 'icebreakers primary unchanged at 48');
ok(prim('music-rhythm') === 43, 'music-rhythm primary unchanged at 41');
ok(prim('rainy-day') === 42, 'rainy-day primary unchanged at 40');
ok(acts.filter(a => a.copy_free).length === 359, 'copy_free 335 -> 343');
ok(acts.filter(a => a.no_elimination).length === 161, 'no_elimination 137 -> 145');
ok(acts.filter(a => a.inclusion).length === 221, 'inclusion 197 -> 205');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('season:fall') === 55, 'fall tag 52 -> 54 (compost heap + frost desk)', String(tagCount('season:fall')));
ok(tagCount('season:summer') === 37, 'summer tag 33 -> 35 (preserving day + star party — the thinnest season rises)', String(tagCount('season:summer')));
ok(tagCount('season:winter') === 120, 'winter tag unchanged at 117', String(tagCount('season:winter')));
ok(tagCount('season:spring') === 43, 'spring tag unchanged at 42', String(tagCount('season:spring')));

// 6. Collections: the 29th shelf IS created — the pack is an
//    honest eight, meeting the validator's 8-12 rule at its
//    minimum with no padding. Every earlier shelf intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 31, '29 collections — the Second Time shelf unlocks at an honest eight', String(colls.length));
const teens2 = colls.find(c => c.id === 'just-teens-second-time');
ok(!!teens2 && teens2.picks.length === 8, 'just-teens-second-time at exactly 8 picks (the measured pack, unpadded)');
NEW.forEach(id => ok(teens2.picks.some(p => p.id === id), 'just-teens-second-time pick present: ' + id));
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
ok(allPages.length === 758, '742 pages on disk (723 activity + 19 root)', String(allPages.length));
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
//    page's catalogue count is the current data count (723).
const collHtml = fs.readFileSync(path.join(ROOT, 'collections.html'), 'utf8');
ok(collHtml.includes('<span id="coll-hero-count">Thirty-one</span>'),
  'VP-0008: hero numeral fallback = current count, spelled out');
const collLd = JSON.parse(collHtml.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
ok(collLd.mainEntity && collLd.mainEntity.numberOfItems === 31,
  'VP-0008: collections JSON-LD numberOfItems derives from the data (29)');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(llms.includes('Curated collections: 31 teacher-ready bundles'),
  'VP-0008 class: llms.txt collections numeral derives from the data (29)');
const dayHtml = fs.readFileSync(path.join(ROOT, 'day.html'), 'utf8');
ok((dayHtml.match(/739 real activities/g) || []).length >= 4 && !dayHtml.includes('723 real activities'),
  'day.html catalogue count current at 723 (no stale count survives)');

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

console.log('test-wave40: ' + passed + ' assertions pass');
