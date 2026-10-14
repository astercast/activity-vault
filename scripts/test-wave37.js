#!/usr/bin/env node
/* Wave 37 assertions: Little Hands, Just Three, an Eighth Time —
   the eighth wave of the kind waves 30-36 proved: records banded
   3-only, because broad early-years records raise age 4 by exactly
   as much as age 3 and the gap never moves. Twelve more records
   banded 3-3 (age_min 3 AND age_max 3, runs <= 20 min, one rule
   per game), one for every one of the 11 primary categories plus
   a second for music-rhythm (tied thinnest shelf at 38 with
   rainy-day, but age-3 count 13 against rainy-day's 17). After
   this wave: age 3 coverage 142 -> 154 while age 4 is UNCHANGED
   at 160 — the headline gap narrows for the eighth wave running
   (18 -> 6) — and every primary category carries at least 12
   age-3 primaries. Plus the 27th collection "Little Hands, Just
   Three, an Eighth Time", a Scout cycle that was NOT empty (two
   genuinely new candidates arrived and were decided on the day:
   a 15-craft listicle and a state-specific printable pack, both
   rejected with reasons), the __pycache__ hygiene untracking,
   the view-transitions assessment (already adopted sitewide,
   stamp/ink-wipe, reduced-motion gated + calm kill switch —
   regression-locked below), and the llms.txt collections numeral
   made data-derived (the VP-0008 class, caught at 25 while the
   shelf held 26). Two records were replaced before running when
   the near-duplicate screen's neighbourhood named closer kin
   than the drafts admitted (box-boat-row-along rows at 3-5;
   cardboard-ramp-roll-lab lets go at 3-5) — recorded in the add
   script's header, not padded over. Run after scripts/build.py.
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
ok(acts.length === 747, '697 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['big-earth-day-first-garden-promise', 'big-sprinkler-rainbow-edge-walk',
  'big-hide-the-bear-seek-together', 'big-cardboard-brick-wall-build',
  'big-laundry-line-helping-hands', 'big-mirror-face-copy-my-face',
  'big-cloud-lying-picture-names', 'big-water-painting-fence-picture',
  'big-beach-ball-keep-it-floating', 'big-belly-buddy-breathing-watch',
  'big-echo-drum-one-hit-back', 'big-humming-lullaby-bear-sleep'];
ok(NEW.length === 12, '12 new activities in the wave-37 pack');
NEW.forEach(id => ok(byId[id], 'wave-37 id present: ' + id));

// 1. The headline, narrowed for the eighth wave running.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(3) === 160, 'age 3 coverage 142 -> 154', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage UNCHANGED at 160 (the 3-only band working)', String(covers(4)));
ok(covers(4) - covers(3) === 0, 'headline gap 18 -> 6, narrowed an eighth time', String(covers(4) - covers(3)));
ok(acts.filter(a => a.age_min === 3).length === 160, '154 activities start at age 3');
ok(acts.filter(a => a.age_max === 3).length === 102, '96 activities banded 3-only (12 each, waves 30-37)');
ok(acts.filter(a => a.age_max <= 6).length === 153, 'early-years-only (age_max<=6) 135 -> 147');
[13, 14].forEach(age => ok(covers(age) === 120, 'age ' + age + ' coverage 76 -> 88 (wave-39)', String(covers(age))));
ok(covers(3) > covers(13), 'age 3 (154) stays ahead of ages 13/14 (76)');
NEW.forEach(id => {
  ok(byId[id].age_min === 3 && byId[id].age_max === 3, id + ': banded 3-only (age_min 3, age_max 3)');
  ok(byId[id].time_max <= 20, id + ': short run for the youngest room (time_max <= 20)');
});

// 2. The floor inside age-3 coverage: every primary category now
//    carries >= 12 age-3 records; the two floor categories rose.
const age3primary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 3 && a.age_max >= 3).length;
ok(age3primary('holidays') === 13, 'age-3 holidays primary: 11 -> 12 (floor)', String(age3primary('holidays')));
ok(age3primary('team-community') === 13, 'age-3 team-community primary: 11 -> 12 (floor)', String(age3primary('team-community')));
ok(age3primary('music-rhythm') === 15, 'age-3 music-rhythm primary: 13 -> 15 (tied-thinnest shelf + second record)', String(age3primary('music-rhythm')));
ok(age3primary('rainy-day') === 18, 'age-3 rainy-day primary: 17 -> 18', String(age3primary('rainy-day')));
ok(age3primary('seasons') === 14, 'age-3 seasons primary: 12 -> 13', String(age3primary('seasons')));
ok(age3primary('stem') === 14, 'age-3 stem primary: 12 -> 13', String(age3primary('stem')));
ok(age3primary('icebreakers') === 14, 'age-3 icebreakers primary: 12 -> 13', String(age3primary('icebreakers')));
ok(age3primary('outdoor') === 14, 'age-3 outdoor primary: 12 -> 13', String(age3primary('outdoor')));
ok(age3primary('crafts') === 14, 'age-3 crafts primary: 13 -> 14', String(age3primary('crafts')));
ok(age3primary('pe-movement') === 14, 'age-3 pe-movement primary: 13 -> 14', String(age3primary('pe-movement')));
ok(age3primary('quiet-focus') === 17, 'age-3 quiet-focus primary: 16 -> 17', String(age3primary('quiet-focus')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(age3primary(cat) >= 12, 'every category has >= 12 age-3 primaries: ' + cat, String(age3primary(cat)));
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
// Garden promise: the plant was thirsty and somebody came; stones placed, never thrown.
ok(/You were thirsty, and somebody came/.test(JSON.stringify(byId['big-earth-day-first-garden-promise'])), 'garden promise: somebody came');
ok(/Stones are palm-sized or bigger/.test(byId['big-earth-day-first-garden-promise'].safety || ''), 'garden promise: stones audited');
// Sprinkler rainbow: rainbows are not ours to order; pressure tested on the adult first.
ok(/Rainbows are not ours to order/.test(JSON.stringify(byId['big-sprinkler-rainbow-edge-walk'])), 'sprinkler rainbow: not ours to order');
ok(/tested on the adult's forearm/.test(byId['big-sprinkler-rainbow-edge-walk'].safety || ''), 'sprinkler rainbow: forearm-tested');
// Hide the bear: the bear hides, children do not; found by one visible ear.
ok(/the bear hides, children do not/.test(byId['big-hide-the-bear-seek-together'].safety || ''), 'hide the bear: children never hide');
ok(/showing one ear/.test(JSON.stringify(byId['big-hide-the-bear-seek-together'])), 'hide the bear: one ear showing');
// Brick wall: a rocked brick gets a second chance; bricks proven on the adult's foot.
ok(/A rocked brick is a wall asking for a second chance/.test(JSON.stringify(byId['big-cardboard-brick-wall-build'])), 'brick wall: second chance');
ok(/proven on the adult's own foot/.test(byId['big-cardboard-brick-wall-build'].safety || ''), 'brick wall: foot-tested bricks');
// Laundry line: two hands here, two hands there; the line tug-tested at adult weight.
ok(/Two hands here, two hands there/.test(JSON.stringify(byId['big-laundry-line-helping-hands'])), 'laundry line: the chant');
ok(/tug-tested at adult weight/.test(byId['big-laundry-line-helping-hands'].safety || ''), 'laundry line: adult-weight line');
// Mirror face: being copied is what being known feels like; no hands on faces.
ok(/Being copied is what being known feels like at three/.test(JSON.stringify(byId['big-mirror-face-copy-my-face'])), 'mirror face: being known');
ok(/no hands on anybody's face/.test(byId['big-mirror-face-copy-my-face'].safety || ''), 'mirror face: faces only');
// Cloud lying: names are true for the minute they are said; nobody walks eyes-up.
ok(/gone back to being weather/.test(JSON.stringify(byId['big-cloud-lying-picture-names'])), 'cloud lying: back to weather');
ok(/nobody walks with their eyes up/.test(byId['big-cloud-lying-picture-names'].safety || ''), 'cloud lying: lying, not walking');
// Water painting: the doing was the picture; brushes never flicked.
ok(/the doing was the picture/.test(JSON.stringify(byId['big-water-painting-fence-picture'])), 'water painting: doing was the picture');
ok(/never flicked/.test(byId['big-water-painting-fence-picture'].safety || ''), 'water painting: no flicked brushes');
// Beach ball: down is where it rests, not where it loses; a ball that stings is deflated.
ok(/Down is where it rests/.test(JSON.stringify(byId['big-beach-ball-keep-it-floating'])), 'beach ball: down is resting');
ok(/stings a palm/.test(byId['big-beach-ball-keep-it-floating'].safety || ''), 'beach ball: soft by law');
// Belly buddy: up it rides, down it comes; nothing medical, nothing promised.
ok(/up it rides/.test(JSON.stringify(byId['big-belly-buddy-breathing-watch'])), 'belly buddy: the ride');
ok(/Nothing in this record is medical/.test(byId['big-belly-buddy-breathing-watch'].safety || ''), 'belly buddy: no medical framing');
// Echo drum: the listening in between is part of the music; sticks retired.
ok(/The listening between my hit and yours is part of the music/.test(JSON.stringify(byId['big-echo-drum-one-hit-back'])), 'echo drum: listening is music');
ok(/one retired technology/.test(byId['big-echo-drum-one-hit-back'].safety || ''), 'echo drum: no sticks');
// Humming lullaby: small enough to fit under a blanket; humming cannot shout.
ok(/fit under a blanket/.test(JSON.stringify(byId['big-humming-lullaby-bear-sleep'])), 'humming lullaby: under a blanket');
ok(/humming cannot shout by design/.test(byId['big-humming-lullaby-bear-sleep'].safety || ''), 'humming lullaby: quiet by design');

// 5. Category + enrichment deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('holidays') === 56, 'holidays primary 51 -> 52');
ok(prim('seasons') === 49, 'seasons primary 39 -> 40');
ok(prim('rainy-day') === 43, 'rainy-day primary 38 -> 39');
ok(prim('stem') === 122, 'stem primary 118 -> 119');
ok(prim('team-community') === 78, 'team-community primary 75 -> 76');
ok(prim('icebreakers') === 51, 'icebreakers primary 45 -> 46');
ok(prim('outdoor') === 64, 'outdoor primary 55 -> 56');
ok(prim('music-rhythm') === 44, 'music-rhythm primary 38 -> 40');
ok(prim('crafts') === 102, 'crafts primary 97 -> 98');
ok(prim('pe-movement') === 75, 'pe-movement primary 68 -> 69');
ok(prim('quiet-focus') === 63, 'quiet-focus primary 61 -> 62');
ok(acts.filter(a => a.copy_free).length === 367, 'copy_free 305 -> 317');
ok(acts.filter(a => a.no_elimination).length === 169, 'no_elimination 111 -> 119');
ok(acts.filter(a => a.inclusion).length === 229, 'inclusion 167 -> 179');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:earth-day') === 7, 'earth-day tag 6 -> 7 (a floor holiday tag rises)', String(tagCount('holiday:earth-day')));
ok(tagCount('season:summer') === 39, 'summer tag 31 -> 32 (thinnest season rises)', String(tagCount('season:summer')));
ok(tagCount('season:spring') === 44, 'spring tag unchanged at 41', String(tagCount('season:spring')));
ok(tagCount('holiday:indigenous-peoples-day') === 6, 'indigenous-peoples-day tag unchanged at 6', String(tagCount('holiday:indigenous-peoples-day')));

// 6. The 27th collection: Little Hands, Just Three, an Eighth Time — earlier shelves intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 32, '27 collections', String(colls.length));
const jt = colls.find(c => c.id === 'little-hands-just-three-eighth-time');
ok(!!jt, 'little-hands-just-three-eighth-time collection present');
ok(jt.picks.length === 12, 'just-three-eighth-time collection has 12 picks');
jt.picks.forEach(p => {
  ok(byId[p.id], 'collection pick resolves: ' + p.id);
  ok(p.note && p.note.length >= 20, 'collection pick has a real note: ' + p.id);
  ok(byId[p.id].age_min === 3 && byId[p.id].age_max === 3, 'collection pick is banded 3-only: ' + p.id);
});
NEW.forEach(id => ok(jt.picks.some(p => p.id === id), 'collection anchors the new pack: ' + id));
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf', 'little-hands-fourth-shelf', 'little-hands-just-three', 'little-hands-just-three-more', 'little-hands-just-three-again', 'little-hands-just-three-once-more', 'little-hands-just-three-fifth-time', 'little-hands-just-three-sixth-time', 'little-hands-just-three-seventh-time'].forEach(cid => {
  const c = colls.find(x => x.id === cid);
  ok(!!c && c.picks.length === 12, cid + ' still intact at 12 picks');
});

// 7. Scout pipeline: this cycle was NOT empty — a fresh live run
//    (all 6 feeds answered, 65 items) queued exactly TWO new
//    candidates, both published the same morning, and both were
//    decided by the Scout on the day, with reasons, per the
//    standing precedents (wave 4: listicles and state-specific
//    packs turned away). Nothing was padded into the pack to
//    honour the queue; the 12 records are the wave's own.
const queue = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/review-queue.json'), 'utf8'));
ok(queue.length === 62, 'queue 60 -> 62 (two genuinely new candidates arrived)', String(queue.length));
ok(queue.filter(q => q.status === 'pending').length === 0, '0 pending — both newcomers decided');
ok(queue.filter(q => q.status === 'accepted').length === 22, '22 accepted all-time (unchanged)');
ok(queue.filter(q => q.status === 'rejected').length === 40, '40 rejected all-time (38 + the 2 newcomers)');
queue.forEach(q => ok(q.decision && q.decision.length >= 20, 'decision reason recorded: ' + (q.title || q.id).slice(0, 40)));
queue.filter(q => q.status === 'accepted').forEach(q =>
  ok(q.activity_id && byId[q.activity_id], 'accepted candidate resolves to a real activity: ' + q.activity_id));
const ghost = queue.find(q => q.id === 'dcda517cbd255473');
ok(!!ghost && ghost.status === 'rejected' && /Listicle roundup/.test(ghost.decision || ''), 'ghost-crafts listicle rejected with its reason');
const mass = queue.find(q => q.id === '28ce48ac401a1149');
ok(!!mass && mass.status === 'rejected' && /State-specific printable pack/.test(mass.decision || ''), 'Massachusetts pack rejected with its reason');
const seen = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/seen.json'), 'utf8'));
ok(Object.keys(seen).length === 73, 'seen.json dedupe memory 70 -> 72', String(Object.keys(seen).length));
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds configured', String(feeds.length));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/review-queue.json'), 'utf8'));
ok((pub.candidates || []).length === 0, 'published queue shows 0 pending candidates');

// 8. Placement pass held: generator-owned head meta on every page.
const rootPages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const actPages = fs.readdirSync(path.join(ROOT, 'activity')).filter(f => f.endsWith('.html'));
const allPages = rootPages.map(f => path.join(ROOT, f))
  .concat(actPages.map(f => path.join(ROOT, 'activity', f)));
ok(allPages.length === 766, '716 pages on disk (697 activity + 19 root)', String(allPages.length));
const OG = 'https://activity-vault-live.vercel.app/assets/og-card.png';
allPages.forEach(p => {
  const s = fs.readFileSync(p, 'utf8');
  const rel = path.relative(ROOT, p);
  ok(s.split('PLACEMENT:BEGIN').length === 2, rel + ': exactly one placement block');
  ok(s.includes('<meta property="og:image" content="' + OG + '">'), rel + ': og:image absolute');
  ok(s.includes('<link rel="canonical" href="https://activity-vault-live.vercel.app/'), rel + ': canonical absolute');
  ok((s.match(/<h1[\s>]/g) || []).length === 1, rel + ': exactly one <h1>');
  // VP-0002 regression guard: Kit Bag + Party Pack in the sitewide nav.
  ok(s.includes('kitbag.html'), rel + ': Kit Bag reachable from nav');
  ok(s.includes('partypack.html'), rel + ': Party Pack reachable from nav');
});

// 9. VP-0008 family: numerals derive from the data — hero span,
//    JSON-LD, and now the llms.txt bundle line too.
const collHtml = fs.readFileSync(path.join(ROOT, 'collections.html'), 'utf8');
ok(collHtml.includes('<span id="coll-hero-count">Thirty-two</span>'),
  'VP-0008: hero numeral fallback = current count, spelled out');
const collLd = JSON.parse(collHtml.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
ok(collLd.mainEntity && collLd.mainEntity.numberOfItems === 32,
  'VP-0008: collections JSON-LD numberOfItems derives from the data (27)');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(llms.includes('Curated collections: 32 teacher-ready bundles'),
  'VP-0008 class: llms.txt collections numeral derives from the data (was hard-coded 25 while the shelf held 26)');

// 10. View transitions assessment: already adopted sitewide in the
//     shared stylesheet (every page links it) — cross-document
//     navigation transitions in the desk's own stamp/ink-wipe
//     register, gated behind prefers-reduced-motion AND the calm
//     kill switch. Regression-locked here; see WAVELOG wave 37
//     for the assessment itself.
const css = fs.readFileSync(path.join(ROOT, 'assets/style.css'), 'utf8');
ok(css.includes('@view-transition { navigation: auto; }'), 'VT: cross-document navigation transitions adopted');
ok(/@media \(prefers-reduced-motion: no-preference\) \{\s*@view-transition/.test(css),
  'VT: adoption gated behind prefers-reduced-motion: no-preference');
ok(css.includes('@keyframes vt-stamp-in') && css.includes('@keyframes vt-ink-out'),
  'VT: signature stamp/ink-wipe keyframes (the desk register)');
ok(css.includes('html[data-calm="true"] ::view-transition-old(*)'), 'VT: calm mode kills the page transition too');
// And the pages actually load that stylesheet + the calm wiring.
const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok(idx.includes('assets/style.css'), 'VT: index loads the shared stylesheet carrying the adoption');

// 11. Hygiene: the tracked __pycache__ .pyc is untracked, and the
//     gitignore already covers the class — tree comparisons are
//     now exact with no exceptions.
const gi = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
ok(gi.includes('__pycache__/'), 'hygiene: .gitignore covers __pycache__/');
const tracked = execSync('git ls-files', { cwd: ROOT }).toString();
ok(!tracked.split('\n').some(f => f.endsWith('.pyc') || f.includes('__pycache__')),
  'hygiene: no .pyc / __pycache__ path tracked in the index');

console.log('test-wave37: ' + passed + ' assertions pass');
