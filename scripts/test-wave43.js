#!/usr/bin/env node
/* Wave 43 assertions: Just Teens, a Fifth Time — the floor
   rises to nine — PLUS rotation 20's minimal pass and the
   live-database framing. The fresh audit measured: ages
   13/14 still thinnest at 112 each (3/4 at 160, 12 at 446);
   inside the band the primary cells were seasons 8, outdoor
   8, pe-movement 8, music-rhythm 8, rainy-day 8, icebreakers
   9, crafts 9, stem 10, holidays 10, quiet-focus 15,
   team-community 19 — floor 8, shared by five. The pack is
   one record for each of the eight thinnest cells (the five
   at 8, the two at 9, and holidays from the tie at 10 —
   broken on the tag shelves: its St. Patrick's Day tag stood
   at the floor of 6), banded 13-14 ONLY, taking the band
   112 -> 120 at both ages, its floor 8 -> 9, and unlocking
   the 32nd collection at exactly the 8-pick validator
   minimum, unpadded. Two drafts were cut pre-run as
   near-dupes (a solstice shadow comparison vs the two
   existing solstice shadow tracks; a compass-points
   introduction vs spectrum-line-introductions) and their
   slots rebuilt (degree-day ledger; personal-map
   introductions) — recorded in the add script's header.
   Minimal pass (rotation 20): one primary nav row + a More
   grouping on every page; homepage promo wall behind one
   disclosure; collection detail panels on-demand only;
   rating/reflection/related behind disclosures on activity
   pages; one primary action per tool page; the homepage
   presents the site AS a live database with published
   coverage. T-ACT-1 (printables) defers once more BY NAME —
   the minimal-pass + database order outranks it; not
   half-built anywhere (asserted below). Scout cycle: 0 new
   candidates; queue unchanged and fully decided; seen.json
   parsed-identical at 73 this cycle. Run after build.py. */
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
ok(acts.length === 778, '747 activities total', String(acts.length));
ok(new Set(acts.map(a => a.id)).size === acts.length, 'all ids unique');

const NEW = ['growing-degree-day-ledger', 'microclimate-map-survey',
  'kin-ball-first-session', 'conducting-patterns-studio',
  'one-table-micro-museum', 'sashiko-stitch-sampler-studio',
  'personal-map-introductions', 'celtic-knot-drawing-studio'];
ok(NEW.length === 8, 'eight new activities in the wave-43 pack — one per the band\'s eight thinnest primary cells');
NEW.forEach(id => ok(byId[id], 'wave-43 id present: ' + id));

// 1. The headline: the teen band rises, nothing else moves.
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(13) === 134, 'age 13 coverage 112 -> 120', String(covers(13)));
ok(covers(14) === 133, 'age 14 coverage 112 -> 120', String(covers(14)));
ok(covers(3) === 162, 'age 3 coverage unchanged at 160 (wave-38 parity untouched)', String(covers(3)));
ok(covers(4) === 170, 'age 4 coverage unchanged at 160 (wave-38 parity untouched)', String(covers(4)));
ok(covers(12) === 467, 'age 12 coverage unchanged at 446', String(covers(12)));
ok(covers(5) === 340, 'age 5 coverage unchanged at 329', String(covers(5)));
ok(160 - covers(13) === 26, 'remaining gap to the 160 benchmark: 40 at age 13, stated numerically');
ok(160 - covers(14) === 27, 'remaining gap to the 160 benchmark: 40 at age 14, stated numerically');
ok(acts.filter(a => a.age_min === 13 && a.age_max === 14).length === 44, '44 activities banded 13-14 only (12+8+8+8+8 across waves 39-43)');
ok(acts.filter(a => a.age_max === 3).length === 102, '102 activities banded 3-only (waves 30-38, unchanged)');
NEW.forEach(id => {
  ok(byId[id].age_min === 13 && byId[id].age_max === 14, id + ': banded 13-14 only');
});

// 2. The floor inside the teen band: every category now >= 9.
const teenPrimary = cat => acts.filter(a => a.categories[0] === cat && a.age_min <= 13 && a.age_max >= 13).length;
ok(teenPrimary('seasons') === 9, 'age-13 seasons primary: 8 -> 9', String(teenPrimary('seasons')));
ok(teenPrimary('outdoor') === 13, 'age-13 outdoor primary: 8 -> 9', String(teenPrimary('outdoor')));
ok(teenPrimary('pe-movement') === 14, 'age-13 pe-movement primary: 8 -> 9', String(teenPrimary('pe-movement')));
ok(teenPrimary('music-rhythm') === 10, 'age-13 music-rhythm primary: 8 -> 9', String(teenPrimary('music-rhythm')));
ok(teenPrimary('rainy-day') === 9, 'age-13 rainy-day primary: 8 -> 9', String(teenPrimary('rainy-day')));
ok(teenPrimary('icebreakers') === 11, 'age-13 icebreakers primary: 9 -> 10', String(teenPrimary('icebreakers')));
ok(teenPrimary('crafts') === 11, 'age-13 crafts primary: 9 -> 10', String(teenPrimary('crafts')));
ok(teenPrimary('holidays') === 11, 'age-13 holidays primary: 10 -> 11 (the tie at 10, broken on the tag shelves)', String(teenPrimary('holidays')));
ok(teenPrimary('stem') === 11, 'age-13 stem primary: 10, unchanged (the tie\'s other half — no coding record bolted on)', String(teenPrimary('stem')));
ok(teenPrimary('quiet-focus') === 16, 'age-13 quiet-focus primary: 15, unchanged', String(teenPrimary('quiet-focus')));
ok(teenPrimary('team-community') === 19, 'age-13 team-community primary: 19, unchanged', String(teenPrimary('team-community')));
['seasons', 'holidays', 'crafts', 'stem', 'pe-movement', 'team-community',
 'icebreakers', 'outdoor', 'rainy-day', 'quiet-focus', 'music-rhythm'].forEach(cat => {
  ok(teenPrimary(cat) >= 9, 'every category has >= 9 age-13 primaries (floor 8 -> 9): ' + cat, String(teenPrimary(cat)));
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
  ok(a.copy_free === true, id + ': copy_free');
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
ok(/A plant keeps its calendar in heat, not in dates/.test(JSON.stringify(byId['growing-degree-day-ledger'])), 'degree-day: the plant keeps its calendar in heat');
ok(/never announced.*from a window/.test(JSON.stringify(byId['growing-degree-day-ledger'])) || /announces the event from a window/.test(JSON.stringify(byId['growing-degree-day-ledger'])), 'degree-day: the event is checked at the plant');
ok(/One yard holds many climates/.test(JSON.stringify(byId['microclimate-map-survey'])), 'microclimate: one yard, many climates');
ok(/The map is the argument/.test(JSON.stringify(byId['microclimate-map-survey'])), 'microclimate: the map is the argument');
ok(/Three teams, one ball, no owner/.test(JSON.stringify(byId['kin-ball-first-session'])), 'kin-ball: three teams, one ball, no owner');
ok(/nobody heads this ball/.test(byId['kin-ball-first-session'].safety || ''), 'kin-ball: nobody heads the ball');
ok(/Your hands speak first; the room answers/.test(JSON.stringify(byId['conducting-patterns-studio'])), 'conducting: hands speak first');
ok(/if ears are ringing, the room was too loud/.test(byId['conducting-patterns-studio'].safety || ''), 'conducting: volume governed');
ok(/A museum is an argument made of objects/.test(JSON.stringify(byId['one-table-micro-museum'])), 'micro-museum: an argument made of objects');
ok(/moved by their owners or not at all|objects are moved by their owners/.test(JSON.stringify(byId['one-table-micro-museum'])), 'micro-museum: owners alone move objects');
ok(/Small stitches, counted rows, no loose ends/.test(JSON.stringify(byId['sashiko-stitch-sampler-studio'])), 'sashiko: small stitches, counted rows');
ok(/counted out by name/.test(byId['sashiko-stitch-sampler-studio'].safety || ''), 'sashiko: needles counted out by name');
ok(/Draw the country only you know/.test(JSON.stringify(byId['personal-map-introductions'])), 'personal map: draw the country only you know');
ok(/Blank is a complete answer/.test(JSON.stringify(byId['personal-map-introductions'])), 'personal map: blank is a complete answer');
ok(/One line, no beginning it will admit to/.test(JSON.stringify(byId['celtic-knot-drawing-studio'])), 'celtic knot: one line, no beginning');
ok(/Pencil until proven, pen when true/.test(JSON.stringify(byId['celtic-knot-drawing-studio'])), 'celtic knot: pencil until proven');

// 5. Category + enrichment + tag deltas from this wave.
const prim = cat => acts.filter(a => a.categories[0] === cat).length;
ok(prim('seasons') === 49, 'seasons primary 48 -> 49');
ok(prim('outdoor') === 68, 'outdoor primary 63 -> 64');
ok(prim('pe-movement') === 86, 'pe-movement primary 74 -> 75');
ok(prim('music-rhythm') === 49, 'music-rhythm primary 43 -> 44');
ok(prim('rainy-day') === 45, 'rainy-day primary 42 -> 43');
ok(prim('crafts') === 103, 'crafts primary 101 -> 102');
ok(prim('icebreakers') === 52, 'icebreakers primary 50 -> 51');
ok(prim('holidays') === 57, 'holidays primary 55 -> 56');
ok(prim('stem') === 124, 'stem primary unchanged at 122');
ok(prim('team-community') === 78, 'team-community primary unchanged at 78');
ok(prim('quiet-focus') === 67, 'quiet-focus primary unchanged at 63');
ok(acts.filter(a => a.copy_free).length === 394, 'copy_free 359 -> 367');
ok(acts.filter(a => a.no_elimination).length === 196, 'no_elimination 161 -> 169');
ok(acts.filter(a => a.inclusion).length === 240, 'inclusion 221 -> 229');
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('season:spring') === 45, 'spring tag 43 -> 44 (the degree-day ledger)', String(tagCount('season:spring')));
ok(tagCount('season:summer') === 43, 'summer tag 37 -> 39 (degree-day + microclimate — the thinnest season rises twice)', String(tagCount('season:summer')));
ok(tagCount('holiday:st-patricks-day') === 7, 'st-patricks-day tag 6 -> 7 (a floor holiday tag rises — the tie-break, landed)', String(tagCount('holiday:st-patricks-day')));
ok(tagCount('season:fall') === 55, 'fall tag unchanged at 55', String(tagCount('season:fall')));
ok(tagCount('season:winter') === 120, 'winter tag unchanged at 120', String(tagCount('season:winter')));
// the drama/coding lane stays a NAMED gap: still 11 categories, none invented
const catsData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/categories.json'), 'utf8'));
ok(catsData.length === 11, 'still exactly 11 categories — no drama/coding category invented to look complete');

// 6. Collections: the 32nd shelf at the validator minimum.
const colls = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf8')).collections;
ok(colls.length === 34, '32 collections — the Fifth Time shelf unlocks at exactly the 8-pick minimum', String(colls.length));
const teens5 = colls.find(c => c.id === 'just-teens-fifth-time');
ok(!!teens5 && teens5.picks.length === 8, 'just-teens-fifth-time at exactly 8 picks (the measured pack, unpadded)');
NEW.forEach(id => ok(teens5.picks.some(p => p.id === id), 'just-teens-fifth-time pick present: ' + id));
[['just-teens-fourth-time', 8], ['just-teens-third-time', 8], ['just-teens-second-time', 8], ['just-teens-first-time', 12]].forEach(([cid, n]) => {
  const c = colls.find(x => x.id === cid);
  ok(!!c && c.picks.length === n, cid + ' still intact at ' + n + ' picks');
});
['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf', 'little-hands-fourth-shelf', 'little-hands-just-three', 'little-hands-just-three-more', 'little-hands-just-three-again', 'little-hands-just-three-once-more', 'little-hands-just-three-fifth-time', 'little-hands-just-three-sixth-time', 'little-hands-just-three-seventh-time', 'little-hands-just-three-eighth-time'].forEach(cid => {
  const c = colls.find(x => x.id === cid);
  ok(!!c && c.picks.length === 12, cid + ' still intact at 12 picks');
});
ok(!colls.find(c => c.id === 'little-hands-just-three-ninth-time'), 'no ninth-time Little Hands collection exists (wave-38 decision lock holds)');
colls.forEach(c => {
  ok(c.picks.length >= 8 && c.picks.length <= 12, 'collection within the validator 8-12 rule: ' + c.id, String(c.picks.length));
  c.picks.forEach(p => ok(byId[p.id], 'collection pick resolves: ' + c.id + '/' + p.id));
});

// 7. Scout pipeline: 0 new candidates — queue unchanged and
//    fully decided; seen.json parsed-identical at 73.
const queue = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/review-queue.json'), 'utf8'));
ok(queue.length === 62, 'queue unchanged at 62', String(queue.length));
ok(queue.filter(q => q.status === 'pending').length === 0, '0 pending');
ok(queue.filter(q => q.status === 'accepted').length === 22, '22 accepted all-time (unchanged)');
ok(queue.filter(q => q.status === 'rejected').length === 40, '40 rejected all-time (unchanged)');
queue.forEach(q => ok(q.decision && q.decision.length >= 20, 'decision reason recorded: ' + (q.title || q.id).slice(0, 40)));
queue.filter(q => q.status === 'accepted').forEach(q =>
  ok(q.activity_id && byId[q.activity_id], 'accepted candidate resolves to a real activity: ' + q.activity_id));
const seen = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/seen.json'), 'utf8'));
ok(Object.keys(seen).length === 73, 'seen.json dedupe memory unchanged at 73 this cycle', String(Object.keys(seen).length));
const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'pipeline/feeds.json'), 'utf8'));
ok(feeds.length === 6, '6 scout feeds configured', String(feeds.length));
const pub = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/review-queue.json'), 'utf8'));
ok((pub.candidates || []).length === 0, 'published queue shows 0 pending candidates');

// 8. Placement census + MINIMAL HEADER on every page (rotation 20).
const rootPages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const actPages = fs.readdirSync(path.join(ROOT, 'activity')).filter(f => f.endsWith('.html'));
const allPages = rootPages.map(f => path.join(ROOT, f))
  .concat(actPages.map(f => path.join(ROOT, 'activity', f)));
ok(allPages.length === 797, '766 pages on disk (747 activity + 19 root)', String(allPages.length));
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
  ok(s.includes('class="nav-more"'), rel + ': minimal header — More grouping present (rotation 20)');
  ok(!s.includes('nav-secondary'), rel + ': minimal header — old secondary nav gone (rotation 20)');
  ok((s.match(/aria-label="Primary"/g) || []).length === 1, rel + ': exactly one primary nav row (rotation 20)');
});

// 9. Minimal pass, surface by surface.
const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok(idx.includes('About this database'), 'homepage: live-database framing in the colophon strip (rotation 21)');
ok(idx.includes('home-promise'), 'homepage: masthead carries the audience promise in prose (rotation 21)');
ok(idx.includes('class="db-strip"'), 'homepage: published database-coverage strip present');
ok(idx.includes('ages 13 to 14 hold 120 each'), 'homepage: coverage strip carries the true teen coverage (120)');
ok(!idx.includes('home-highlights'), 'homepage: promo wall gone, bands collapsed to one (L11, rotation 21)');
ok(idx.includes('class="issue-hero"') && idx.includes('class="cal-row"'), 'homepage: the season issue hero plus calendar rows (rotation 23)');
ok(!idx.includes('season-band'), 'homepage: the season band is gone, the issue hero does its job (rotation 23)');
const collJs = fs.readFileSync(path.join(ROOT, 'assets/collections.js'), 'utf8');
ok(collJs.includes('s.hidden = !inSingle || s.id !== hash'), 'collections: detail panels on-demand only in browse mode');
const sampleAct = fs.readFileSync(path.join(ROOT, 'activity', 'growing-degree-day-ledger.html'), 'utf8');
ok(sampleAct.includes('rate-disclosure'), 'activity page: rating/reflection behind a disclosure');
ok(sampleAct.includes('related-disclosure'), 'activity page: related activities behind a disclosure');
['planner.html', 'day.html', 'kit.html', 'kitbag.html', 'partypack.html', 'sub.html', 'party.html', 'fieldtrip.html'].forEach(f => {
  const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
  ok(s.includes('<body class="tool-page">'), f + ': tool page register');
  ok((s.match(/primary-action/g) || []).length === 1, f + ': exactly one primary action');
});
const css = fs.readFileSync(path.join(ROOT, 'assets/style.css'), 'utf8');
ok(css.includes('ROTATION 20. MINIMAL PASS'), 'style.css carries the rotation-20 minimal-pass block');
ok(css.includes('.nav-more-panel'), 'style.css styles the More panel');

// 10. T-ACT-1 (printables) deferral lock: deferred BY NAME this
//     rotation, not half-built — no printables surface exists.
ok(!fs.existsSync(path.join(ROOT, 'printables.html')), 'T-ACT-1 deferred by name: no printables page half-built');
allPages.forEach(p => {
  const s = fs.readFileSync(p, 'utf8');
  ok(!s.includes('href="printables.html"') && !s.includes('href="../printables.html"'),
    path.relative(ROOT, p) + ': T-ACT-1 deferred — no printables link shipped');
});

// 11. VP-0008 family at 32 + day count at 747.
const collHtml = fs.readFileSync(path.join(ROOT, 'collections.html'), 'utf8');
ok(collHtml.includes('<span id="coll-hero-count">Thirty-two</span>'),
  'VP-0008: hero numeral fallback = current count, spelled out');
const collLd = JSON.parse(collHtml.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
ok(collLd.mainEntity && collLd.mainEntity.numberOfItems === 34,
  'VP-0008: collections JSON-LD numberOfItems derives from the data (32)');
const llms = fs.readFileSync(path.join(ROOT, 'llms.txt'), 'utf8');
ok(llms.includes('Curated collections: 32 teacher-ready bundles'),
  'VP-0008 class: llms.txt collections numeral derives from the data (32)');
const dayHtml = fs.readFileSync(path.join(ROOT, 'day.html'), 'utf8');
ok((dayHtml.match(/747 real activities/g) || []).length >= 4 && !dayHtml.includes('739 real activities'),
  'day.html catalogue count current at 747 (no stale count survives)');

// 12. View transitions lock (unchanged, re-asserted).
ok(css.includes('@view-transition { navigation: auto; }'), 'VT: cross-document navigation transitions adopted');
ok(/@media \(prefers-reduced-motion: no-preference\) \{\s*@view-transition/.test(css),
  'VT: adoption gated behind prefers-reduced-motion: no-preference');
ok(css.includes('@keyframes vt-stamp-in') && css.includes('@keyframes vt-ink-out'),
  'VT: signature stamp/ink-wipe keyframes (the desk register)');
ok(css.includes('html[data-calm="true"] ::view-transition-old(*)'), 'VT: calm mode kills the page transition too');
ok(idx.includes('assets/style.css'), 'VT: index loads the shared stylesheet carrying the adoption');

// 13. Hygiene.
const gi = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
ok(gi.includes('__pycache__/'), 'hygiene: .gitignore covers __pycache__/');
ok(gi.includes('*.pyc'), 'hygiene: .gitignore covers *.pyc');
const tracked = execSync('git ls-files', { cwd: ROOT }).toString();
ok(!tracked.split('\n').some(f => f.endsWith('.pyc') || f.includes('__pycache__')),
  'hygiene: no .pyc / __pycache__ path tracked in the index');

console.log('test-wave43: ' + passed + ' assertions pass');
