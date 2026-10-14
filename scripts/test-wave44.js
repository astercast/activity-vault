#!/usr/bin/env node
/* Wave 44 / QA-011 guard: the Age filter control must not drift from
   data/v1/filters.json again.
   - filters.json declares the catalogue's true age span
   - activities.json spans the same range, with teen coverage intact
   - assets/app.js fetches data/v1/filters.json and derives its Age
     range bounds from it (no hardcoded 5-12 literals remain)
   - scripts/build.py derives the filters.json age declaration from
     the data instead of a bare literal
   Run after build.py (or standalone — it reads committed files). */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(path.dirname(path.resolve(__filename)));

let passed = 0;
function ok(cond, label, extra) {
  if (!cond) { console.error('FAIL: ' + label + (extra ? ' — ' + extra : '')); process.exit(1); }
  passed++;
}

const filtersDoc = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/v1/filters.json'), 'utf8'));
const declared = filtersDoc.filters && filtersDoc.filters.age;
ok(declared, 'filters.json declares filters.age');
ok(declared.min === 3, 'filters.json age.min === 3', String(declared && declared.min));
ok(declared.max === 14, 'filters.json age.max === 14', String(declared && declared.max));

const acts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/activities.json'), 'utf8'));
ok(acts.length === 747, '747 activities total', String(acts.length));
const trueMin = Math.min.apply(null, acts.map(a => a.age_min));
const trueMax = Math.max.apply(null, acts.map(a => a.age_max));
ok(trueMin === declared.min, 'activities true min matches filters.json', String(trueMin));
ok(trueMax === declared.max, 'activities true max matches filters.json', String(trueMax));
const covers = age => acts.filter(a => a.age_min <= age && a.age_max >= age).length;
ok(covers(13) === 120, 'age 13 coverage === 120', String(covers(13)));
ok(covers(14) === 120, 'age 14 coverage === 120', String(covers(14)));
ok(covers(3) > 0, 'age 3 coverage > 0', String(covers(3)));
ok(covers(4) > 0, 'age 4 coverage > 0', String(covers(4)));

const app = fs.readFileSync(path.join(ROOT, 'assets/app.js'), 'utf8');
ok(app.includes("fetch('data/v1/filters.json')"), 'app.js fetches data/v1/filters.json (QA-011 source of truth)');
ok(app.includes('state.ageMin') && app.includes('state.ageMax'), 'app.js stores derived age bounds on state');
ok(app.includes('declaredAge.min') && app.includes('declaredAge.max'), 'app.js derives bounds from filters.age');
ok(!/ageRange\.min\s*=\s*'5'/.test(app), 'app.js: stale ageRange.min literal 5 removed');
ok(!/ageRange\.max\s*=\s*'12'/.test(app), 'app.js: stale ageRange.max literal 12 removed');
ok(!/ageRange\.min\s*=\s*'[^']+'/.test(app) || /ageRange\.min\s*=\s*String\(/.test(app), 'app.js: ageRange.min is computed (String(...)), not a bare literal');
ok(/ageRange\.min\s*=\s*String\(ageLo\)/.test(app), 'app.js: ageRange.min = String(ageLo)');
ok(/ageRange\.max\s*=\s*String\(ageHi\)/.test(app), 'app.js: ageRange.max = String(ageHi)');
ok(app.includes('Age '), 'app.js: Age label rendering kept');

const build = fs.readFileSync(path.join(ROOT, 'scripts/build.py'), 'utf8');
ok(build.includes("_age_min = min(a['age_min'] for a in acts)"), 'build.py derives _age_min from acts');
ok(build.includes("_age_max = max(a['age_max'] for a in acts)"), 'build.py derives _age_max from acts');
ok(!/"min": 3, "max": 14/.test(build), 'build.py: bare 3/14 age literal removed');

console.log('test-wave44: ' + passed + ' assertions pass');
