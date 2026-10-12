/* Activity Vault — Smart Weekly Planner 2.0 core logic.
   Pure functions only: no DOM, no network, no localStorage.
   Browser: window.VaultPlanner. Node: module.exports (UMD). */
(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    global.VaultPlanner = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  var WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  var BUCKETS = [
    { id: 'movement', label: 'High-energy movement', glyph: '⚡' },
    { id: 'calm', label: 'Calm & focus', glyph: '🧘' },
    { id: 'creative', label: 'Creative & messy', glyph: '🎨' },
    { id: 'outdoor', label: 'Outdoor', glyph: '🌳' },
    { id: 'mixed', label: 'All-rounder', glyph: '🔀' }
  ];
  var BUCKET_IDS = BUCKETS.map(function (b) { return b.id; });

  var AGE_BANDS = {
    'prek-k': { label: 'PreK–K (ages 3–6)', min: 3, max: 6 },
    'g1-2': { label: 'Grades 1–2 (ages 6–8)', min: 6, max: 8 },
    'g3-5': { label: 'Grades 3–5 (ages 8–11)', min: 8, max: 11 },
    'g6-8': { label: 'Grades 6–8 (ages 11–14)', min: 11, max: 14 },
    'all': { label: 'All ages (3–14)', min: 3, max: 14 }
  };

  var PROGRAMS = {
    'after-school': { label: 'After-school', slotsPerDay: 2, maxTime: 30, indoorOnly: false, startHour: 15, slotGapMin: 45 },
    'camp': { label: 'Camp', slotsPerDay: 3, maxTime: 45, indoorOnly: false, startHour: 9, slotGapMin: 60 },
    'classroom': { label: 'Classroom', slotsPerDay: 2, maxTime: 20, indoorOnly: true, startHour: 13, slotGapMin: 45 }
  };

  function emptyCounts() {
    var c = {};
    BUCKET_IDS.forEach(function (b) { c[b] = 0; });
    return c;
  }

  /* Map category id -> bucket id, from data/balance-buckets.json's `mapping` array. */
  function buildCatBucket(mapping) {
    var m = {};
    (mapping || []).forEach(function (row) { m[row.category] = row.bucket; });
    return m;
  }

  /* An activity's energy bucket = the bucket of its PRIMARY (first) category. */
  function bucketFor(activity, catBucket) {
    if (!activity || !activity.categories || !activity.categories.length) return 'mixed';
    return catBucket[activity.categories[0]] || 'mixed';
  }

  /* mulberry32 — small seeded PRNG so auto-built weeks are reproducible in tests. */
  function mulberry32(seed) {
    var t = seed >>> 0;
    return function () {
      t += 0x6D2B79F5;
      var z = Math.imul(t ^ (t >>> 15), t | 1);
      z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
      return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function toSet(list) {
    var s = {};
    (list || []).forEach(function (x) { s[x] = true; });
    return s;
  }

  /* ---- pool filtering (same semantics as AGENT.md filter rules) ----
     opts: {ageMin, ageMax, maxTime, cats[], noPrepOnly, indoorOnly} */
  function filterPool(activities, opts) {
    var cats = toSet(opts.cats);
    var wantCats = opts.cats && opts.cats.length;
    return (activities || []).filter(function (a) {
      if (opts.ageMin != null && (a.age_max < opts.ageMin || a.age_min > opts.ageMax)) return false;
      if (opts.maxTime != null && a.time_min > opts.maxTime) return false;
      if (wantCats && !a.categories.some(function (c) { return cats[c]; })) return false;
      if (opts.noPrepOnly && !a.no_prep) return false;
      if (opts.indoorOnly && a.location.indexOf('indoor') === -1) return false;
      return true;
    });
  }

  /* One line on why an activity fits — carried over from planner 1.0. */
  function whyFits(a, catName) {
    var bits = [a.time_min + '–' + a.time_max + ' min'];
    if (a.no_prep) bits.push('no prep');
    var cnames = a.categories.slice(0, 2).map(function (c) { return catName(c); });
    bits.push(cnames.join(' · '));
    return bits.join(' — ');
  }

  /* Balance-aware scoring: prefer buckets that are scarce today, then this week,
     then categories not yet used this week. Lower = better. */
  function scoreCandidate(a, dayCounts, weekCounts, weekCats, catBucket) {
    var b = bucketFor(a, catBucket);
    var score = dayCounts[b] * 3 + weekCounts[b];
    for (var i = 0; i < a.categories.length; i++) {
      if (weekCats[a.categories[i]]) score += 2;
    }
    return score;
  }

  /* ---- auto-build a full week ----
     opts: {days[], slotsPerDay, ageMin, ageMax, maxTime, cats[], noPrepOnly,
            indoorOnly, allowRepeats, maxPrepHeavy, seedIds[]}
     Returns {days: [{day, slots: [{slot, activityId}]}], notes[], seedPlaced, seedSkipped} */
  function buildWeek(activities, opts, catBucket, seed) {
    var rng = mulberry32(seed == null ? Math.floor(Math.random() * 0xffffffff) : seed);
    var byId = {};
    activities.forEach(function (a) { byId[a.id] = a; });
    var pool = filterPool(activities, opts);
    var poolIds = toSet(pool.map(function (a) { return a.id; }));
    var used = {};           // activity id -> true (whole week, unless allowRepeats)
    var weekCats = {};
    var weekCounts = emptyCounts();
    var prepHeavy = 0;
    var notes = [];
    var seedIds = (opts.seedIds || []).filter(function (id) { return poolIds[id] && !used[id]; });
    var seedPlaced = 0, seedSkipped = (opts.seedIds || []).length - seedIds.length;

    function prepOk(a) {
      return a.no_prep || opts.maxPrepHeavy == null || prepHeavy < opts.maxPrepHeavy;
    }

    function candidates(excludeId) {
      var cands = pool.filter(function (a) {
        if (used[a.id] && !opts.allowRepeats) return false;
        if (a.id === excludeId) return false;
        return true;
      });
      var roomy = cands.filter(prepOk);
      // Only relax the prep cap when repeats are allowed and nothing else fits.
      return (roomy.length || !opts.allowRepeats) ? roomy : cands;
    }

    function pickFor(dayCounts, excludeId) {
      var cands = shuffled(candidates(excludeId), rng);
      if (!cands.length) return null;
      cands.sort(function (x, y) {
        var d = scoreCandidate(x, dayCounts, weekCounts, weekCats, catBucket) -
                scoreCandidate(y, dayCounts, weekCounts, weekCats, catBucket);
        return d; // shuffled first, so equal scores keep the random order (stable sort)
      });
      return cands[0];
    }

    function place(a) {
      used[a.id] = true;
      if (!a.no_prep) prepHeavy++;
      a.categories.forEach(function (c) { weekCats[c] = true; });
      weekCounts[bucketFor(a, catBucket)]++;
      return a.id;
    }

    var days = [];
    var totalSlots = opts.days.length * opts.slotsPerDay;
    if (!opts.allowRepeats && pool.length < totalSlots && !seedIds.length) {
      notes.push('Only ' + pool.length + ' activities match, but you asked for ' + totalSlots +
        ' slots. Repeats are off — some slots may stay empty, or allow repeats.');
    }

    opts.days.forEach(function (day) {
      var dayCounts = emptyCounts();
      var slots = [];
      for (var s = 0; s < opts.slotsPerDay; s++) {
        var a = null;
        var seedId = seedIds.length ? seedIds.shift() : null;
        if (seedId) {
          var sa = byId[seedId];
          if (sa && !used[sa.id] && prepOk(sa)) { a = sa; seedPlaced++; }
        }
        if (!a) a = pickFor(dayCounts);
        if (a) {
          dayCounts[bucketFor(a, catBucket)]++;
          slots.push({ slot: s + 1, activityId: place(a) });
        } else {
          slots.push({ slot: s + 1, activityId: null }); // gap slot
        }
      }
      days.push({ day: day, slots: slots });
    });

    return { days: days, notes: notes, seedPlaced: seedPlaced, seedSkipped: seedSkipped };
  }

  /* ---- balance meter ----
     slots: [{activityId}] resolved against byId. Returns {counts, total} */
  function balanceOf(daySlots, byId, catBucket) {
    var counts = emptyCounts();
    var total = 0;
    daySlots.forEach(function (s) {
      var a = s.activityId && byId[s.activityId];
      if (!a) return;
      counts[bucketFor(a, catBucket)]++;
      total++;
    });
    return { counts: counts, total: total };
  }

  function bucketLabel(id) {
    var b = BUCKETS.filter(function (x) { return x.id === id; })[0];
    return b ? (b.glyph + ' ' + b.label) : id;
  }

  /* Human warnings when a day's energy is lopsided. Returns string[]. */
  function dayWarnings(balance, dayName) {
    var out = [];
    var total = balance.total;
    if (total < 2) return out;
    var counts = balance.counts;
    BUCKET_IDS.forEach(function (b) {
      if (b === 'mixed') return; // all-rounders are the neutral filler — no warning
      if (counts[b] > total / 2) {
        var advice = {
          movement: 'High energy all day — add a calm or creative slot so the room lands softly.',
          calm: 'All calm — the room may get sleepy; mix in some movement.',
          creative: 'Messy-heavy — budget extra cleanup time between slots.',
          outdoor: 'Weather-dependent day — keep an indoor backup ready.'
        }[b];
        out.push(dayName + ' leans hard on ' + bucketLabel(b) + ' (' + counts[b] + ' of ' + total +
          ' slots). ' + advice);
      }
    });
    if (total >= 3 && counts.calm === 0) {
      out.push(dayName + ' has no calm slot — consider a quiet landing so the day ends settled.');
    }
    return out;
  }

  function weekWarnings(planDays, byId, catBucket) {
    var counts = emptyCounts();
    var total = 0;
    planDays.forEach(function (d) {
      var b = balanceOf(d.slots, byId, catBucket);
      BUCKET_IDS.forEach(function (k) { counts[k] += b.counts[k]; });
      total += b.total;
    });
    var out = [];
    if (total >= 4 && counts.movement === 0) {
      out.push('No high-energy slot all week — kids need to move; add a ⚡ slot somewhere.');
    }
    if (total >= 6 && counts.calm === 0) {
      out.push('No calm slot all week — plan a 🧘 landing at least once.');
    }
    return out;
  }

  /* ---- swap one slot for a fresh, balance-friendly pick ----
     Returns the new activity id, or null if nothing fits. */
  function swapCandidate(pool, planDays, dayIdx, slotIdx, byId, catBucket, opts) {
    var day = planDays[dayIdx];
    var curId = day.slots[slotIdx].activityId;
    var used = {};
    planDays.forEach(function (d) {
      d.slots.forEach(function (s) { if (s.activityId) used[s.activityId] = true; });
    });
    var prepHeavy = planDays.reduce(function (n, d) {
      return n + d.slots.filter(function (s) {
        return s.activityId && !byId[s.activityId].no_prep;
      }).length;
    }, 0);
    var cur = curId && byId[curId];
    var dayCounts = emptyCounts();
    day.slots.forEach(function (s, i) {
      if (i === slotIdx || !s.activityId) return;
      dayCounts[bucketFor(byId[s.activityId], catBucket)]++;
    });
    var weekCats = {};
    planDays.forEach(function (d) {
      d.slots.forEach(function (s) {
        if (s.activityId && byId[s.activityId]) {
          byId[s.activityId].categories.forEach(function (c) { weekCats[c] = true; });
        }
      });
    });
    var weekCounts = emptyCounts(); // week-level balance for scoring is approximated by day here
    var cands = pool.filter(function (a) {
      if (a.id === curId) return false;
      if (used[a.id] && !opts.allowRepeats) return false;
      if (!a.no_prep && opts.maxPrepHeavy != null &&
          prepHeavy - (cur && !cur.no_prep ? 1 : 0) >= opts.maxPrepHeavy) return false;
      return true;
    });
    if (!cands.length) return null;
    var rng = mulberry32(1); // neutral shuffle; browser re-shuffles by calling with fresh seed via buildWeek path
    cands = shuffled(cands, rng);
    cands.sort(function (x, y) {
      return scoreCandidate(x, dayCounts, weekCounts, weekCats, catBucket) -
             scoreCandidate(y, dayCounts, weekCounts, weekCats, catBucket);
    });
    return cands[0].id;
  }

  /* Fill every gap slot (activityId null) with a balance-friendly pick. Mutates planDays. */
  function fillGaps(planDays, pool, byId, catBucket, opts, seed) {
    var rng = mulberry32(seed == null ? Math.floor(Math.random() * 0xffffffff) : seed);
    var used = {};
    var weekCats = {};
    var weekCounts = emptyCounts();
    var prepHeavy = 0;
    planDays.forEach(function (d) {
      d.slots.forEach(function (s) {
        var a = s.activityId && byId[s.activityId];
        if (!a) return;
        used[a.id] = true;
        if (!a.no_prep) prepHeavy++;
        a.categories.forEach(function (c) { weekCats[c] = true; });
        weekCounts[bucketFor(a, catBucket)]++;
      });
    });
    planDays.forEach(function (d) {
      var dayCounts = emptyCounts();
      d.slots.forEach(function (s) {
        var a = s.activityId && byId[s.activityId];
        if (a) dayCounts[bucketFor(a, catBucket)]++;
      });
      d.slots.forEach(function (s) {
        if (s.activityId) return;
        var cands = shuffled(pool.filter(function (a) {
          if (used[a.id] && !opts.allowRepeats) return false;
          if (!a.no_prep && opts.maxPrepHeavy != null && prepHeavy >= opts.maxPrepHeavy) return false;
          return true;
        }), rng);
        if (!cands.length) return;
        cands.sort(function (x, y) {
          return scoreCandidate(x, dayCounts, weekCounts, weekCats, catBucket) -
                 scoreCandidate(y, dayCounts, weekCounts, weekCats, catBucket);
        });
        var a = cands[0];
        s.activityId = a.id;
        used[a.id] = true;
        if (!a.no_prep) prepHeavy++;
        a.categories.forEach(function (c) { weekCats[c] = true; });
        dayCounts[bucketFor(a, catBucket)]++;
        weekCounts[bucketFor(a, catBucket)]++;
      });
    });
    return planDays;
  }

  /* ---- plan text export (wave-7 pattern) ---- */
  function planText(plan, byId, catName, ratingLine) {
    var lines = ['📅 ' + (plan.name || 'My week') + ' — Activity Vault', ''];
    if (plan.balanceNote) lines.push(plan.balanceNote, '');
    plan.days.forEach(function (d) {
      lines.push(d.day);
      d.slots.forEach(function (s) {
        var a = s.activityId && byId[s.activityId];
        if (!a) { lines.push('  Slot ' + s.slot + ' — open slot'); return; }
        lines.push('  Slot ' + s.slot + ' — ' + a.name);
        lines.push('    Ages ' + a.age_min + '–' + a.age_max + ' · ' +
          a.time_min + '–' + a.time_max + ' min · Group ' + a.group_min + '–' + a.group_max +
          (a.no_prep ? ' · no prep' : ''));
        var rl = ratingLine ? ratingLine(a) : null;
        if (rl) lines.push('    ' + rl);
        lines.push('    activity/' + a.id + '.html');
      });
      lines.push('');
    });
    lines.push('Full cards: index.html');
    lines.push('Paste this into your newsletter or email — every link opens the right activity card.');
    return lines.join('\n');
  }

  /* ---- .ics calendar export (client-side; floating local times) ---- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function icsDate(d) {
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' +
           pad(d.getHours()) + pad(d.getMinutes()) + '00';
  }
  function icsEscape(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;')
      .replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }
  var WD_IDX = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

  /* plan: {name, programType, days:[{day, slots:[{slot, activityId}]}]}
     now: Date (injectable for tests). Returns the .ics file text. */
  function exportICS(plan, byId, now) {
    var prog = PROGRAMS[plan.programType] || PROGRAMS['after-school'];
    now = now || new Date();
    var maxTime = plan.maxTime;
    var out = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Activity Vault//Week Planner 2.0//EN',
               'X-WR-CALNAME:' + icsEscape(plan.name || 'Activity Vault week plan')];
    var stamp = icsDate(now);
    plan.days.forEach(function (d) {
      var target = WD_IDX[d.day] == null ? 1 : WD_IDX[d.day];
      var date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      while (date.getDay() !== target) date.setDate(date.getDate() + 1); // today-or-next
      d.slots.forEach(function (s, i) {
        var a = s.activityId && byId[s.activityId];
        if (!a) return;
        var start = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
                             prog.startHour, i * prog.slotGapMin, 0);
        var mins = Math.min(a.time_max, maxTime || a.time_max);
        var facts = 'Ages ' + a.age_min + '–' + a.age_max + ' · Group ' +
                    a.group_min + '–' + a.group_max + (a.no_prep ? ' · no prep' : ' · prep needed');
        out.push('BEGIN:VEVENT');
        out.push('UID:av-' + a.id + '-' + icsDate(date) + '-' + s.slot + '@activityvault');
        out.push('DTSTAMP:' + stamp);
        out.push('DTSTART:' + icsDate(start));
        out.push('DURATION:PT' + mins + 'M');
        out.push('SUMMARY:' + icsEscape(a.name + ' (' + d.day + ')'));
        out.push('DESCRIPTION:' + icsEscape(facts + '\n' + a.tagline));
        out.push('END:VEVENT');
      });
    });
    out.push('END:VCALENDAR');
    return out.join('\r\n') + '\r\n';
  }

  /* ---- plan share/import ----
     Shareable plan payload (v1). Deep link: planner.html?plan=<base64url>. */
  var PLAN_VERSION = 1;
  function encodePlan(plan) {
    var json = JSON.stringify(plan);
    var b64 = (typeof Buffer !== 'undefined')
      ? Buffer.from(json, 'utf8').toString('base64')
      : btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decodePlan(b64) {
    var std = String(b64).replace(/-/g, '+').replace(/_/g, '/');
    while (std.length % 4) std += '=';
    var json = (typeof Buffer !== 'undefined')
      ? Buffer.from(std, 'base64').toString('utf8')
      : decodeURIComponent(escape(atob(std)));
    return JSON.parse(json);
  }
  /* Validate an imported plan: ids must resolve to real activities. */
  function validatePlanData(data, byId) {
    var dropped = [];
    var days = [];
    (data.days || []).forEach(function (d) {
      if (WEEKDAYS.indexOf(d.day) === -1) return;
      var slots = [];
      (d.slots || []).forEach(function (s, i) {
        var id = s && s.activityId;
        if (id && !byId[id]) { dropped.push(id); id = null; }
        slots.push({ slot: (s && s.slot) || (i + 1), activityId: id || null });
      });
      days.push({ day: d.day, slots: slots });
    });
    return {
      version: data.version || PLAN_VERSION,
      name: data.name || 'Shared week plan',
      programType: PROGRAMS[data.programType] ? data.programType : 'after-school',
      maxTime: data.maxTime || null,
      days: days,
      dropped: dropped
    };
  }

  /* localStorage plan record shape (v1) for named saved plans. */
  function savedPlanRecord(name, opts, planDays) {
    return {
      version: PLAN_VERSION,
      name: name,
      created: new Date().toISOString(),
      programType: opts.programType,
      maxTime: opts.maxTime,
      ageBand: opts.ageBand,
      days: planDays.map(function (d) {
        return { day: d.day, slots: d.slots.map(function (s) {
          return { slot: s.slot, activityId: s.activityId };
        }) };
      })
    };
  }

  return {
    WEEKDAYS: WEEKDAYS,
    BUCKETS: BUCKETS,
    BUCKET_IDS: BUCKET_IDS,
    AGE_BANDS: AGE_BANDS,
    PROGRAMS: PROGRAMS,
    buildCatBucket: buildCatBucket,
    bucketFor: bucketFor,
    filterPool: filterPool,
    whyFits: whyFits,
    buildWeek: buildWeek,
    balanceOf: balanceOf,
    bucketLabel: bucketLabel,
    dayWarnings: dayWarnings,
    weekWarnings: weekWarnings,
    swapCandidate: swapCandidate,
    fillGaps: fillGaps,
    planText: planText,
    exportICS: exportICS,
    encodePlan: encodePlan,
    decodePlan: decodePlan,
    validatePlanData: validatePlanData,
    savedPlanRecord: savedPlanRecord
  };
});
