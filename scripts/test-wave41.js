#!/usr/bin/env node
/* Wave 41 assertions: Just Teens, a Third Time — the floor
   rises again. This wave's fresh audit measured the whole
   archive again before building: ages 13/14 still thinnest
   at 96 each (3/4 at 160, 12 at 446), and inside the band the
   primary cells were seasons 6, outdoor 6, pe-movement 6,
   music-rhythm 6, rainy-day 6, icebreakers 7, crafts 7,
   holidays 9, stem 9, quiet-focus 15, team-community 19 —
   floor 6, shared by five categories. The pack is one record
   for each of the eight thinnest cells (the five at 6, the
   two at 7, and holidays from the tie at 9 — the tie broken
   on the Lunar New Year tag standing at 6 overall), banded
   13-14 ONLY, taking the band 96 -> 104 at both ages and its
   floor 6 -> 7, and unlocking the 30th collection at an
   honest eight picks. Two drafts were cut pre-run as
   near-dupes (a pond-dip tray survey vs
   stream-watch-testing-round; a New Year letter capsule vs
   new-year-time-capsule) and their slots rebuilt (transect
   line; dumpling folding night) — recorded in the add
   script's header. Scout cycle: 0 new candidates queued;
   the queue unchanged and fully decided; seen.json grew by
   exactly one — a WeAreTeachers mattress deal published the
   same day, marked seen and dropped by the KEEP/DROP filter
   (sale/deal), never queued. Run after scripts/build.py.
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
ok(acts.length === 731, '731 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['cold-stratification-seed-bank', 'transect-line-field-survey',
  'long-rope-turning-crew', 'part-singing-choir-first-rehearsals',
  'foley-radio-play-recording', 'partner-portrait-interviews',
  'one-sheet-zine-workshop', 'lunar-new-year-dumpling-folding-night'];
ok(NEW.length === 8, 'eight new activities in the wave-41 pack — one per the band\'s eight thinnest primary cells');
NEW.forEach(id => ok(byId[id], 'wave-41 id present: ' + id));

// 1. The headline: the teen band rises, nothing else moves.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(13) === 104, 'age 13 coverage 96 -> 104', String(covers(13)));
ok(covers(14) === 104, 'age 14 coverage 96 -> 104', String(covers(14)));
ok(covers(3) === 160, 'age 3 coverage unchanged at 160 (wave-38 parity untouched)', String(covers(3)));
ok(covers(4) === 160, 'age 4 coverage unchanged at 160 (wave-38 parity untouched)', String(covers(4)));
ok(covers(12) === 446, 'age 12 coverage unchanged at 446', String(covers(12)));
ok(covers(5) === 329, 'age 5 coverage unchanged at 329', String(covers(5)));
ok(160 - covers(13) === 56, 'remaining gap to the 160 benchmark: 56 at age 13, stated numerically');
ok(160 - covers(14) === 56, 'remaining gap to the 160 benchmark: 56 at age 14, stated numerically');
ok(acts.filter(a => a.age_min === 13 && a.age_max === 14).length === 28, '28 activities banded 13-14 only (12 wave-39 + 8 wave-40 + 8 wave-41)');
ok(acts.filter(a => a.age_max === 3).length === 102, '102 activities banded 3-only (waves 30-38, unchanged)');
NEW.forEach(id => {
  ok(byId[id].age_min === 13 && byId[id].age_max === 14, id + ': banded 13-14 only');
});

// 2. The floor inside the teen band: the eight records went to
//    the eight thinnest cells; every category now carries >= 7.
const teenPrimary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 13 && a.age_max >= 13).length;
ok(teenPrimary('seasons') === 7, 'age-13 seasons primary: 6 -> 7', String(teenPrimary('seasons')));
ok(teenPrimary('outdoor') === 7, 'age-13 outdoor primary: 6 -> 7', String(teenPrimary('outdoor')));
ok(teenPrimary('pe-movement') === 7, 'age-13 pe-movement primary: 6 -> 7', String(teenPrimary('pe-movement')));
ok(teenPrimary('music-rhythm') === 7, 'age-13 music-rhythm primary: 6 -> 7', String(teenPrimary('music-rhythm')));
ok(teenPrimary('rainy-day') === 7, 'age-13 rainy-day primary: 6 -> 7', String(teenPrimary('rainy-day')));
ok(teenPrimary('icebreakers') === 8, 'age-13 icebreakers primary: 7 -> 8', String(teenPrimary('icebreakers')));
ok(teenPrimary('crafts') === 8, 'age-13 crafts primary: 7 -> 8', String(teenPrimary('crafts')));
ok(teenPrimary('holidays') === 10, 'age-13 holidays primary: 9 -> 10 (the tie at 9, broken on the Lunar New Year tag shelf)', String(teenPrimary('holidays')));
ok(teenPrimary('stem') === 9, 'age-13 stem primary: 9, unchanged (the other half of the tie)', String(teenPrimary('stem')));
ok(teenPrimary('quiet-focus') === 15, 'age-13 quiet-focus primary: 15, unchanged', String(teenPrimary('quiet-focus')));
ok(teenPrimary('team-community') === 19, 'age-13 team-community primary: 19, unchanged', String(teenPrimary('team-community')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(teenPrimary(cat) >= 7, 'every category has >= 7 age-13 primaries (floor 6 -> 7): ' + cat, String(teenPrimary(cat)));
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
ok(/Cold is an ingredient, and the calendar is the recipe/.test(JSON.stringify(byId['cold-stratification-seed-bank'])), 'stratification: cold is an ingredient');
ok(/nothing from the bank is tasted/.test(byId['cold-stratification-seed-bank'].safety || ''), 'stratification: seed is never food');
ok(/The line does not move; that is what makes it evidence/.test(JSON.stringify(byId['transect-line-field-survey'])), 'transect: the line does not move');
ok(/never tasted/.test(byId['transect-line-field-survey'].safety || ''), 'transect: plants are read, never tasted');
ok(/The rope belongs to the turners; the jumping belongs to everyone/.test(JSON.stringify(byId['long-rope-turning-crew'])), 'long rope: the turners hold the skilled job');
ok(/never wrapped around a hand or wrist/.test(byId['long-rope-turning-crew'].safety || ''), 'long rope: a snagged rope must be droppable');
ok(/Blending is listening louder than you sing/.test(JSON.stringify(byId['part-singing-choir-first-rehearsals'])), 'choir: blending is listening');
ok(/warm-up is never skipped/.test(byId['part-singing-choir-first-rehearsals'].safety || ''), 'choir: voices worked like instruments');
ok(/The audience believes its ears/.test(JSON.stringify(byId['foley-radio-play-recording'])), 'foley: the audience believes its ears');
ok(/no glass is broken for any sound/.test(byId['foley-radio-play-recording'].safety || ''), 'foley: no glass, ever');
ok(/You introduce the person you actually met, not the one you expected/.test(JSON.stringify(byId['partner-portrait-interviews'])), 'portraits: the person actually met');
ok(/strike law is absolute/.test(byId['partner-portrait-interviews'].safety || ''), 'portraits: the strike law is absolute');
ok(/Eight pages, one sheet, no editor but the maker/.test(JSON.stringify(byId['one-sheet-zine-workshop'])), 'zine: no editor but the maker');
ok(/one cut per sheet/.test(byId['one-sheet-zine-workshop'].safety || ''), 'zine: the single cut, governed');
ok(/Every fold is a signature the steamer will read/.test(JSON.stringify(byId['lunar-new-year-dumpling-folding-night'])), 'dumpling night: every fold a signature');
ok(/All cooking is the adult's alone/.test(byId['lunar-new-year-dumpling-folding-night'].safety || ''), 'dumpling night: the steamer is the adult\'s alone');

// 5. Category + enrichment + tag deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('seasons') === 47, 'seasons primary 46 -> 47');
ok(prim('outdoor') === 62, 'outdoor primary 61 -> 62');
ok(prim('pe-movement') === 73, 'pe-movement primary 72 -> 73');
ok(prim('music-rhythm') === 42, 'music-rhythm primary 41 -> 42');
ok(prim('rainy-day') === 41, 'rainy-day primary 40 -> 41');
ok(prim('icebreakers') === 49, 'icebreakers primary 48 -> 49');
ok(prim('crafts') === 100, 'crafts primary 99 -> 100');
ok(prim('holidays') === 55, 'holidays primary 54 -> 55');
ok(prim('stem') === 121, 'stem primary unchanged at 121');
ok(prim('team-community') === 78, 'team-community primary unchanged at 78');
ok(prim('quiet-focus') === 63, 'quiet-focus primary unchanged at 63');
ok(acts.filter(a => a.copy_free).length === 351, 'copy_free 343 -> 351');
ok(acts.filter(a => a.no_elimination).length === 153, 'no_elimination 145 -> 153');
ok(acts.filter(a => a.inclusion).length === 213, 'inclusion 205 -> 213');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('season:winter') === 119, 'winter tag 117 -> 119 (stratification bank + dumpling night)', String(tagCount('season:winter')));
ok(tagCount('season:spring') === 43, 'spring tag 42 -> 43 (the stratification bank\'s germination spring)', String(tagCount('season:spring')));
ok(tagCount('holiday:lunar-new-year') === 7, 'lunar-new-year tag 6 -> 7 (a floor holiday tag rises — the tie-break, landed)', String(tagCount('holiday:lunar-new-year')));
ok(tagCount('season:fall') === 54, 'fall tag unchanged at 54', String(tagCount('season:fall')));
ok(tagCount('season:summer') === 35, 'summer tag unchanged at 35', String(tagCount('season:summer')));

// 6. Collections: the 30th shelf IS created — the pack is an
//    honest eight, inside the validator's 8-12 rule. Every
//    earlier shelf intact.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 30, '30 collections — the Third Time shelf unlocks at an honest eight', String(colls.length));
const teens3 = colls.find(c => c.id === 'just-teens-third-time');
ok(!!teens3 && teens3.picks.length === 8, 'just-teens-third-time at exactly 8 picks (the measured pack, unpadded)');
NEW.forEach(id => ok(teens3.picks.some(p => p.id === id), 'just-teens-third-time pick present: ' + id));
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
//    unchanged and fully decided; seen.json grew by exactly
//    one (a same-day mattress-deal item the DROP filter
//    turned away — seen, never queued); the scan's formatting
//    rewrite of the queue was restored byte-identical.
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
ok(Object.keys(seen).length === 73, 'seen.json dedupe memory 72 -> 73 (one same-day deal post, dropped by the filter, never queued)', String(Object.keys(seen).length));
ok(!!seen['12488135232aeb6d'], 'the dropped deal post is the seen.json growth, by its hash');
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds configured', String(feeds.length));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/review-queue.json'), 'utf8'));
ok((pub.candidates || []).length === 0, 'published queue shows 0 pending candidates');

// 8. Placement pass held: generator-owned head meta on every page.
const rootPages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const actPages = fs.readdirSync(path.join(ROOT, 'activity')).filter(f => f.endsWith('.html'));
const allPages = rootPages.map(f => path.join(ROOT, f))
  .concat(actPages.map(f => path.join(ROOT, 'activity', f)));
ok(allPages.length === 750, '750 pages on disk (731 activity + 19 root)', String(allPages.length));
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
//    page's catalogue count is the current data count (731).
const collHtml = fs.readFileSync(path.join(ROOT, 'collections.html'), 'utf8');
ok(collHtml.includes('<span id="coll-hero-count">Thirty</span>'),
  'VP-0008: hero numeral fallback = current count, spelled out');
const collLd = JSON.parse(collHtml.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
ok(collLd.mainEntity && collLd.mainEntity.numberOfItems === 30,
  'VP-0008: collections JSON-LD numberOfItems derives from the data (30)');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(llms.includes('Curated collections: 30 teacher-ready bundles'),
  'VP-0008 class: llms.txt collections numeral derives from the data (30)');
const dayHtml = fs.readFileSync(path.join(ROOT, 'day.html'), 'utf8');
ok((dayHtml.match(/731 real activities/g) || []).length >= 4 && !dayHtml.includes('723 real activities'),
  'day.html catalogue count current at 731 (no stale count survives)');

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

console.log('test-wave41: ' + passed + ' assertions pass');
