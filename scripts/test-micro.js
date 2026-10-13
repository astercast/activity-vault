// scripts/test-micro.js — wave 19 "The Micro-Activity Pack" assertions.
// 60 new genuine 5-10 minute micro-activities, all no_prep, all copy_free,
// materials empty or pantry-staple only. Proves the Kit tool's opener/closer
// slot pools are strengthened end-to-end via the real VaultKit candidate fns.
const fs = require('fs');
const api = JSON.parse(fs.readFileSync('data/v1/activities.json', 'utf8'));
const acts = api.activities;
const byId = new Map(acts.map(a => [a.id, a]));
const K = require('../assets/kit-core.js');
const buckets = JSON.parse(fs.readFileSync('data/v1/balance-buckets.json', 'utf8'));
const bucketByCat = {};
buckets.mapping.forEach(m => { bucketByCat[m.category] = m.bucket; });
// full 16-staple pantry WORDS (not ids) — what itemCovered actually matches against.
// (Balloons, yarn, chalk, dice, cups, plates, cards are opt-in chips beyond the
// 9 defaults; materials must still be word-matchable against the pantry vocabulary.)
const PANTRY_WORDS = K.PANTRY.reduce((out, p) => out.concat(p.words), []);
let pass = 0, fail = 0;
const ok = (cond, msg) => { cond ? pass++ : (fail++, console.log('FAIL', msg)); };

const IDS = [
  'dice-fitness-roll','squat-spell','mirror-march','beat-the-bell-burst',
  'clock-lunges','popcorn-jumps','traffic-cop',
  'zip-zap-zop','alphabet-lineup','word-ball-toss','two-minute-mingle',
  'secret-high-five','pass-the-face','guess-the-leader',
  'rhythm-echo-clap','body-percussion-build','volume-dial-chant','hum-line-guess',
  'silent-beat-march',
  'silent-count-twenty','rose-thorn-bud','one-word-weather','tense-and-release',
  'crumple-and-toss','hand-squeeze-pass','gratitude-minute','finger-count-breath',
  'silent-sketch-minute',
  'yarn-appreciation-web','human-machine','helping-hands-pledge','shout-out-sixty',
  'circle-of-strength','word-of-the-day-vote',
  'window-weather-sketch','indoor-picnic-memory','paper-boat-race','shadow-guess',
  'puddle-poetry',
  'chalk-number-dash','bird-call-count','stick-shape-sprint','cloud-drift-race',
  'leaf-catch',
  'origami-corner-bookmark','accordion-paper-fan','paper-cup-telephone',
  'mini-me-flag','gratitude-chain-links',
  'shadow-size-test','gravity-drop-race','balloon-static-pickup','breath-power-race',
  'sound-vibration-hum',
  'season-sort-sprint','weather-compare','season-stretch',
  'celebration-circle','gift-wrap-speed','thank-you-sprint',
];

ok(api.count === 661, `count 661, got ${api.count}`);
ok(acts.length === 661, `acts.length 661, got ${acts.length}`);
ok(acts.length === new Set(acts.map(a => a.id)).size, 'ids unique');
ok(IDS.length === 60, `60 wave19 ids, got ${IDS.length}`);
ok(new Set(IDS).size === 60, 'wave19 ids unique inside pack');
IDS.forEach(id => ok(byId.has(id), `wave19 id present: ${id}`));

// per-category split on the primary (first) category
const split = {};
IDS.forEach(id => { const c = byId.get(id).categories[0]; split[c] = (split[c] || 0) + 1; });
const EXPECT = {'pe-movement':7,'icebreakers':7,'music-rhythm':5,'quiet-focus':9,
  'team-community':6,'rainy-day':5,'outdoor':5,'crafts':5,'stem':5,'seasons':3,'holidays':3};
Object.keys(EXPECT).forEach(c => ok(split[c] === EXPECT[c], `split ${c}: ${EXPECT[c]}, got ${split[c]||0}`));
ok(Object.keys(split).length === 11, `all 11 categories covered, got ${Object.keys(split).length}`);

const MED = ['therap','anxiety','depress','heal','cure','immunity','immune system',
  'blood pressure','cortisol','dopamine','serotonin','detox','prescription'];
IDS.forEach(id => {
  const a = byId.get(id);
  ok(a.time_min >= 5 && a.time_max <= 10 && a.time_min <= a.time_max, `${id}: genuine 5-10 micro time ${a.time_min}-${a.time_max}`);
  ok(a.no_prep === true, `${id}: no_prep`);
  ok(a.copy_free === true, `${id}: copy_free`);
  ok(a.steps && a.steps.length >= 3, `${id}: 3+ steps`);
  ok(a.variations && a.variations.easier && a.variations.harder, `${id}: easier+harder`);
  ok(a.age_min >= 3 && a.age_min <= a.age_max && a.age_max <= 18, `${id}: sane age range`);
  ok(a.group_min <= a.group_max && a.group_min >= 2, `${id}: sane group range`);
  ok(a.tagline && a.tagline.length <= 160 && a.tagline.length > 20, `${id}: tagline length`);
  ok(a.safety && a.safety.length > 10, `${id}: safety note present`);
  ok(a.setup && a.setup.length > 5, `${id}: setup present`);
  ok(a.location.every(l => l === 'indoor' || l === 'outdoor'), `${id}: location enum`);
  ok(!a.tags, `${id}: no tags needed`);
  const blob = JSON.stringify(a).toLowerCase();
  MED.forEach(m => ok(!blob.includes(m), `${id}: no medical claim ${m}`));
  // materials: empty or every item covered by the default pantry (word-boundary match)
  (a.materials || []).forEach(m => {
    ok(K.itemCovered(m.item, PANTRY_WORDS),
       `${id}: material pantry-covered: "${m.item}"`);
  });
  ok(fs.existsSync(`activity/${id}.html`), `${id}: generated page exists`);
});

// opener pool: hot candidates = time_max<=15 && no_prep && (movement bucket via
// pe-movement first cat, or icebreakers anywhere in categories) — wave 19 dominates it.
// 18 new: 7 pe-movement-first + 7 icebreakers-first + 4 more with icebreakers as a
// second category (indoor-picnic-memory, rhythm-echo-clap, hum-line-guess, human-machine).
const openerHot = K.openerCands(acts, bucketByCat);
const openerNew = openerHot.filter(a => IDS.includes(a.id));
ok(openerHot.length >= 20, `opener hot pool >= 20, got ${openerHot.length}`);
ok(openerNew.length === 18, `18 new opener-hot micros, got ${openerNew.length}`);
// every new opener-hot micro genuinely fits the hot filter
openerNew.forEach(a => ok(a.time_max <= 15 && a.no_prep === true, `${a.id}: opener-hot eligible`));

// closer pool: calm candidates = time_max<=20 && (calm bucket or quiet-focus)
const closerHot = K.closerCands(acts, bucketByCat);
const closerNew = closerHot.filter(a => IDS.includes(a.id));
ok(closerHot.length >= 15, `closer calm pool >= 15, got ${closerHot.length}`);
ok(closerNew.length === 13, `13 new closer-calm micros, got ${closerNew.length}`);

// end-to-end: a real kit deal's opener/closer slots pull from the new micro pool
const cfg = K.clampCfg({ ageBand: 'g3-5', groupSize: 20, days: 5, minutes: 60,
  mode: 'pantry', pantry: K.PANTRY_DEFAULT });
const pool = acts.filter(a => K.fitsKit(a, cfg));
ok(pool.length > 50, `kit pool healthy: ${pool.length}`);
const kit = K.buildKit(pool, cfg, bucketByCat, 42);
ok(kit && kit.days.length === 5, 'kit built: 5 days');
let microOpeners = 0, microClosers = 0;
kit.days.forEach(d => {
  const op = d.slots.find(s => s.role === 'opener');
  const cl = d.slots.find(s => s.role === 'closer');
  const oa = byId.get(op.id), ca = byId.get(cl.id);
  if (IDS.includes(op.id) && oa.time_max <= 10) microOpeners++;
  if (IDS.includes(cl.id) && ca.time_max <= 10) microClosers++;
  ok(oa.time_max <= 15 && oa.no_prep, `day opener slot fits opener role: ${op.id}`);
  ok(ca.time_max <= 20, `day closer slot fits closer role: ${cl.id}`);
});
// Wave 24 note (pool 521 -> 536; wave 25 -> 550; wave 26 -> 564): the seed-42 deal's exact
// composition changed (1 wave-19 opener this deal; every dealt opener still
// meets the role bound asserted per-slot above, and the opener-hot pool
// counts in section 2 are unchanged). Assert presence, not the old count.
ok(microOpeners >= 1, `>=1 dealt opener from new micro pool, got ${microOpeners}`);
ok(microClosers >= 3, `>=3 dealt closers from new micro pool, got ${microClosers}`);

// no-repeat across days still holds with the bigger pool
const allSlotIds = kit.days.flatMap(d => d.slots.map(s => s.id));
ok(new Set(allSlotIds).size === allSlotIds.length, 'no repeats across 5 days');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
