#!/usr/bin/env node
/* Wave 23 assertions: thin-spot fills — 12 teen-designed activities + 12
   holiday-tag fills (july-4th / earth-day / easter / dia-de-muertos).
   Run after scripts/build.py. Exits non-zero on the first failure. */
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
const actIds = new Set(acts.map(a => a.id));
ok(acts.length === 685, '685 activities total', String(acts.length));
ok(actIds.size === acts.length, 'all activity ids unique');

const TEEN = ['lightning-debates', 'escape-room-build', 'mini-podcast-studio',
  'public-art-proposal', 'survival-rank-challenge', 'board-game-prototype',
  'peer-skill-swap', 'improv-scene-showdown', 'event-budget-challenge',
  'photo-story-sequence', 'town-hall-simulation', 'water-filter-build'];
const HOL = ['flag-folding-ceremony', 'parade-route-planners', 'independence-debate',
  'upcycle-invention-challenge', 'classroom-water-audit', 'litter-tally-cleanup',
  'natural-dye-easter-eggs', 'wax-resist-easter-eggs', 'kindness-egg-missions',
  'calavera-literaria-poems', 'sugar-skull-decorating', 'marigold-petal-path'];
const NEW24 = TEEN.concat(HOL);
ok(NEW24.length === 24, '24 wave-23 ids listed');
NEW24.forEach(id => ok(actIds.has(id), 'wave-23 id present: ' + id));

const byId = {};
acts.forEach(a => { byId[a.id] = a; });

// 1. Thin-spot deltas: ages 13/14 and the four holiday tags.
[13, 14].forEach(age => {
  const n = acts.filter(a => a.age_min <= age && age <= a.age_max).length;
  ok(n === 76, 'age ' + age + ' coverage 53 -> 68 (wave-23) -> 70 (wave-24) -> 76 (wave-25: six new activities reach 14)', String(n));
});
const teenDesigned = acts.filter(a => a.age_min >= 11 && a.age_max >= 13).length;
ok(teenDesigned >= 13, 'teen-designed activities (age_min>=11)', String(teenDesigned));
const tagCount = t => acts.filter(a => (a.tags || []).includes(t)).length;
ok(tagCount('holiday:july-4th') === 6, 'july-4th 2 -> 5', String(tagCount('holiday:july-4th')));
ok(tagCount('holiday:earth-day') === 6, 'earth-day 3 -> 6', String(tagCount('holiday:earth-day')));
ok(tagCount('holiday:easter') === 8, 'easter 4 -> 7 in wave 23; wave 28 -> 8', String(tagCount('holiday:easter')));
ok(tagCount('holiday:dia-de-muertos') === 6, 'dia-de-muertos 3 -> 6', String(tagCount('holiday:dia-de-muertos')));

// 2. Tag correctness per activity.
const expectTag = {
  'flag-folding-ceremony': 'holiday:july-4th', 'parade-route-planners': 'holiday:july-4th',
  'independence-debate': 'holiday:july-4th',
  'upcycle-invention-challenge': 'holiday:earth-day', 'classroom-water-audit': 'holiday:earth-day',
  'litter-tally-cleanup': 'holiday:earth-day',
  'natural-dye-easter-eggs': 'holiday:easter', 'wax-resist-easter-eggs': 'holiday:easter',
  'kindness-egg-missions': 'holiday:easter',
  'calavera-literaria-poems': 'holiday:dia-de-muertos', 'sugar-skull-decorating': 'holiday:dia-de-muertos',
  'marigold-petal-path': 'holiday:dia-de-muertos',
};
Object.keys(expectTag).forEach(id => {
  ok((byId[id].tags || []).includes(expectTag[id]), id + ' carries ' + expectTag[id]);
});

// 3. Quality bar on all 24: tagline <=160, 3+ steps, easier+harder, sane ranges.
const MEDICAL = /therap|anxiety|depress|heal |cure|treatment|diagnos|medical/i;
NEW24.forEach(id => {
  const a = byId[id];
  ok(a.tagline.length <= 160, id + ': tagline <=160', String(a.tagline.length));
  ok(a.steps.length >= 3, id + ': 3+ steps', String(a.steps.length));
  ok(a.variations.easier && a.variations.harder, id + ': easier+harder variations');
  ok(a.age_min <= a.age_max && a.group_min <= a.group_max && a.time_min <= a.time_max,
    id + ': sane ranges');
  ok(!MEDICAL.test(JSON.stringify(a)), id + ': no medical-claim strings');
  ok(fs.existsSync(path.join(ROOT, 'activity', id + '.html')), id + ': page rendered');
  const page = fs.readFileSync(path.join(ROOT, 'activity', id + '.html'), 'utf8');
  ok(page.includes(a.name), id + ': page carries its name');
});

// 4. Teen activities are genuinely teen-banded.
TEEN.forEach(id => {
  const a = byId[id];
  ok(a.age_min >= 11, id + ': teen-banded (age_min>=11)', String(a.age_min));
  ok(a.age_max >= 13, id + ': covers 13-14', a.age_min + '-' + a.age_max);
});

// 5. Respectful framing: Dia de los Muertos activities carry inclusion notes
//    naming the real tradition; no invented rituals.
['calavera-literaria-poems', 'sugar-skull-decorating', 'marigold-petal-path'].forEach(id => {
  const inc = byId[id].inclusion || '';
  ok(inc.length > 20, id + ': inclusion note present');
  ok(/real|tradition/i.test(inc), id + ': inclusion names the real tradition');
});

// 6. Food/egg activities carry allergy notes; litter carries glove safety;
//    water filter states the non-drinkable rule.
['natural-dye-easter-eggs', 'wax-resist-easter-eggs'].forEach(id => {
  ok(/allerg/i.test(byId[id].safety || ''), id + ': allergy note in safety');
});
ok(/glove/i.test(byId['litter-tally-cleanup'].safety || ''), 'litter-tally-cleanup: glove safety');
ok(/not drinkable/i.test(byId['water-filter-build'].safety || ''), 'water-filter-build: not-drinkable rule');
ok(/never touches the ground/i.test(byId['flag-folding-ceremony'].safety || ''),
  'flag-folding-ceremony: respectful handling note');

// 7. Near-duplicate screen re-run: no pair at Jaccard >= 0.55 on
//    name+tagline+first-step tokens (same bar as the pack script).
function toks(a) {
  const s = (a.name + ' ' + a.tagline + ' ' + a.steps[0]).toLowerCase();
  return new Set((s.match(/[a-z]{4,}/g) || []));
}
NEW24.forEach(id => {
  const ta = toks(byId[id]);
  acts.forEach(b => {
    if (b.id === id) return;
    const tb = toks(b);
    const inter = [...ta].filter(t => tb.has(t)).length;
    const j = inter / (ta.size + tb.size - inter);
    ok(j < 0.55, 'no near-dupe: ' + id + ' vs ' + b.id, j.toFixed(2));
  });
});

console.log('\ntest-wave23: ' + passed + ' assertions passed');
