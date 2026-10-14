#!/usr/bin/env node
/* Rotation 23: the year's almanac.
   Asserts: the emoji cards are dead, Contents are ruled numbered lines,
   the season issue system is in the generator, body type is the chosen
   warm text face (Newsreader, self-hosted), every photo record carries
   provenance (licence + source page + credit) and its file exists, and
   source-link / photo coverage never silently drops below the filed
   rotation-23 counts. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
let passed = 0;
function ok(cond, msg) { if (!cond) { console.error('FAIL: ' + msg); process.exit(1); } passed++; }

const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok(!idx.includes('verb-door') && !idx.includes('verb-glyph'), 'home: emoji verb cards deleted');
ok((idx.match(/class="contents-line"/g) || []).length === 9, 'home: nine contents lines');
ok(idx.includes('class="issue-num"'), 'home: giant day-count numeral present');
ok(idx.includes('class="issue-cover"'), 'home: a real photograph is the issue cover');
ok(idx.includes('--season:'), 'home: the season colour is set by the issue system');

const css = fs.readFileSync(path.join(ROOT, 'assets/style.css'), 'utf8');
ok(css.includes('"Newsreader"'), 'css: Newsreader is the chosen body face');
ok(!css.includes('--font-body: -apple-system'), 'css: body is off the raw system stack');
ok(!css.includes('.verb-door'), 'css: verb-door rules deleted');
ok(!css.includes('.card-grid') && !css.includes('.act-card'), 'css: legacy card-grid/act-card names renamed clean');
ok(fs.existsSync(path.join(ROOT, 'assets/fonts/newsreader-latin-var.woff2')), 'fonts: Newsreader self-hosted');

const acts = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/activities.json'), 'utf8'));
ok(acts.length === 747, 'data: the full pool stands at 747');
let withPhoto = 0, withSource = 0;
for (const a of acts) {
  if (a.source) withSource++;
  if (a.photo) {
    withPhoto++;
    for (const k of ['file', 'alt', 'caption', 'credit', 'licence', 'source_url'])
      ok(typeof a.photo[k] === 'string' && a.photo[k].length > 0, a.id + ': photo.' + k + ' recorded');
    ok(fs.existsSync(path.join(ROOT, 'assets/photos', a.photo.file)), a.id + ': photo file exists');
    ok(/^(CC|Public domain)/i.test(a.photo.licence), a.id + ': photo licence is public/CC: ' + a.photo.licence);
  }
  const page = fs.readFileSync(path.join(ROOT, 'activity', a.id + '.html'), 'utf8');
  if (a.photo) ok(page.includes('assets/photos/' + a.photo.file) && page.includes('Photo source'), a.id + ': photo + photo source render on the page');
  if (a.source) ok(page.includes('class="source-line"') && page.includes(a.source.replace(/&/g, '&amp;')), a.id + ': source link renders plainly on the page');
}
/* Filed rotation-24 coverage floors: 198 photos, 93 source links.
   The floors only ever move up; a drop below the filed count fails. */
ok(withPhoto >= 198, 'coverage: at least the filed 198 activities carry a sourced photo (got ' + withPhoto + ')');
ok(withSource >= 93, 'coverage: at least the filed 93 activities carry a source link (got ' + withSource + ')');
console.log('test-r23: ' + passed + ' assertions passed; photo ' + withPhoto + '/747, source ' + withSource + '/747');
