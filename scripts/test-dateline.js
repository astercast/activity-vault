#!/usr/bin/env node
/* Holiday-math harness for assets/vault-dateline.js.
   Verifies Claude's five dates from the 2026-10-24 bundle plus the
   rest of his named set (St. Patrick's Day, Earth Day, Fourth of
   July) against the real implementation. Run: node scripts/test-dateline.js */
'use strict';
const D = require('../assets/vault-dateline.js');

let pass = 0, fail = 0;
function chk(label, y, m, d, wantName, wantDays) {
  const h = D.nextHoliday(new Date(y, m, d));
  const ok = h && h.name === wantName && h.days === wantDays;
  if (ok) { pass++; console.log('ok   ' + label + ' -> ' + h.name + ' in ' + h.days); }
  else {
    fail++;
    console.log('FAIL ' + label + ' -> got ' + (h ? h.name + ' in ' + h.days : 'none') +
      ', want ' + wantName + ' in ' + wantDays);
  }
}

// Claude's five dates (RECORD §11.6): three stated, the set completed
// with the other holidays he named for the math.
chk('2026-10-24', 2026, 9, 24, 'Halloween', 7);
chk('2026-11-24', 2026, 10, 24, 'Thanksgiving', 2);
chk('2026-12-28', 2026, 11, 28, "Valentine's Day", 48);
chk('2027-03-10', 2027, 2, 10, "St. Patrick's Day", 7);
chk('2027-04-15', 2027, 3, 15, 'Earth Day', 7);
// Extra guards on the same math.
chk('2027-06-27 (Fourth of July)', 2027, 5, 27, 'Fourth of July', 7);
chk('2026-10-30 (Halloween beats Day of the Dead)', 2026, 9, 30, 'Halloween', 1);
chk('2026-10-31 (Halloween itself)', 2026, 9, 31, 'Halloween', 0);
chk('2026-11-01 (Day of the Dead itself)', 2026, 10, 1, 'Day of the Dead', 0);
chk('2026-12-26 (Kwanzaa itself, Christmas passed)', 2026, 11, 26, 'Kwanzaa', 0);

console.log('pass=' + pass + ' fail=' + fail);
process.exit(fail ? 1 : 0);
