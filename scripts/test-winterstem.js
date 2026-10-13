// scripts/test-winterstem.js — wave 16 "Winter Holiday Build Lab" assertions
const fs = require('fs');
const api = JSON.parse(fs.readFileSync('data/v1/activities.json', 'utf8'));
const acts = api.activities;
const byId = new Map(acts.map(a => [a.id, a]));
let pass = 0, fail = 0;
const ok = (cond, msg) => { cond ? pass++ : (fail++, console.log('FAIL', msg)); };

const IDS = [
  'holiday-zipline-delivery','sled-and-slope-run','snow-globe-slow-fall',
  'reindeer-shelter-storm','stocking-holder-build','gift-conveyor-design',
  'cookie-dissolve-race','instant-snow-polymers','dancing-cranberries',
  'paper-maze-swap','gift-wrap-measure','reindeer-grid-coding',
  'ornament-pendulum-paint','blizzard-in-a-bottle','dreidel-spin-math',
  'kwanzaa-principle-cards','story-gift-pass','winter-bird-watch-tally',
  'northern-lights-pastels','snow-paint-spray','snowman-soup-gift-mix',
  'solstice-lantern-stroll','holiday-cleanup-crew-game','snowflake-statue-balance',
  'red-nose-green-nose','winter-hide-and-seek',
];

ok(api.count === 637, `count 637, got ${api.count}`);
ok(acts.length === new Set(acts.map(a => a.id)).size, 'ids unique');
IDS.forEach(id => ok(byId.has(id), `wave16 id present: ${id}`));

const hasTag = (a, t) => (a.tags || []).includes(t);
const split = {
  'christmas+winter': IDS.filter(id => hasTag(byId.get(id),'holiday:christmas') && hasTag(byId.get(id),'season:winter') && byId.get(id).tags.length===2),
  'winter-only': IDS.filter(id => byId.get(id).tags.length===1 && hasTag(byId.get(id),'season:winter')),
  'christmas-only': IDS.filter(id => byId.get(id).tags.length===1 && hasTag(byId.get(id),'holiday:christmas')),
  'hanukkah+winter': IDS.filter(id => hasTag(byId.get(id),'holiday:hanukkah')),
  'kwanzaa+winter': IDS.filter(id => hasTag(byId.get(id),'holiday:kwanzaa')),
};
ok(split['christmas+winter'].length === 13, `christmas+winter 13, got ${split['christmas+winter'].length}`);
ok(split['winter-only'].length === 10, `winter-only 10, got ${split['winter-only'].length}`);
ok(split['christmas-only'].length === 1, `christmas-only 1, got ${split['christmas-only'].length}`);
ok(split['hanukkah+winter'].length === 1, 'hanukkah+winter 1');
ok(split['kwanzaa+winter'].length === 1, 'kwanzaa+winter 1');

IDS.forEach(id => {
  const a = byId.get(id);
  ok(a.steps && a.steps.length >= 3, `${id}: 3+ steps`);
  ok(a.variations && a.variations.easier && a.variations.harder, `${id}: easier+harder`);
  ok(a.age_min >= 3 && a.age_min <= a.age_max && a.age_max <= 18, `${id}: sane age range`);
  ok(a.time_min <= a.time_max && a.time_max > 0, `${id}: sane time range`);
  ok(a.safety && a.safety.length > 10, `${id}: safety note present`);
});

const MED = ['therap','anxiety','depress','heal','cure','immunity','immune system',
  'blood pressure','cortisol','dopamine','serotonin','detox','prescription'];
IDS.forEach(id => {
  const blob = JSON.stringify(byId.get(id)).toLowerCase();
  MED.forEach(m => ok(!blob.includes(m), `${id}: no medical claim ${m}`));
});

['cookie-dissolve-race','snowman-soup-gift-mix'].forEach(id => {
  ok((byId.get(id).safety||'').toLowerCase().includes('allerg'), `${id}: allergy note`);
});

// no-prep emergencies present (sub-tub candidates)
const noprep = IDS.filter(id => byId.get(id).no_prep === true);
ok(noprep.length >= 4, `no-prep wave16 >= 4, got ${noprep.length}`);

console.log(`winterstem: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
