/* Activity Vault, Day Planner core logic (Wave 33 flagship).
   Compose ONE day: five named slots (arrival, morning meeting,
   centers, outdoor, closing), each filled from the real catalog
   filtered by the room's age and the slot's honest shape, the
   real age_min/age_max/time_min fields, the slot's categories,
   and (for the outdoor slot) a real outdoor location. Pure
   functions only: no DOM, no network, no localStorage.
   Browser: window.VaultDayPlanner. Node: module.exports (UMD). */
(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    global.VaultDayPlanner = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  /* The five slots of a real program day, in order. `cats` are the
     catalog categories that honestly belong in the slot; `maxMinutes`
     is a cap on an activity's time_min (it must be able to START
     inside the slot's budget); `clock` is a suggested start time,
     display only. */
  var DAY_SLOTS = [
    { id: 'arrival', label: 'Arrival', glyph: '🚌', clock: '8:00',
      hint: 'First minutes: something welcoming that runs itself while coats come off.',
      cats: ['icebreakers'], maxMinutes: 20, outdoorOnly: false },
    { id: 'morning-meeting', label: 'Morning Meeting', glyph: '🌅', clock: '9:00',
      hint: 'The whole group together: names, voices, one shared start.',
      cats: ['icebreakers', 'team-community', 'music-rhythm'], maxMinutes: 20, outdoorOnly: false },
    { id: 'centers', label: 'Centers', glyph: '🧩', clock: '10:00',
      hint: 'Small groups, busy hands: making, testing, concentrating.',
      cats: ['crafts', 'stem', 'quiet-focus'], maxMinutes: 30, outdoorOnly: false },
    { id: 'outdoor', label: 'Outdoor', glyph: '🌳', clock: '11:30',
      hint: 'Fresh air and big movement, a real outdoor activity, not an indoor one renamed.',
      cats: ['outdoor', 'pe-movement'], maxMinutes: 30, outdoorOnly: true },
    { id: 'closing', label: 'Closing', glyph: '🌙', clock: '14:30',
      hint: 'Land the day softly: quiet, together, done.',
      cats: ['quiet-focus', 'music-rhythm'], maxMinutes: 20, outdoorOnly: false }
  ];

  function slotById(id) {
    for (var i = 0; i < DAY_SLOTS.length; i++) if (DAY_SLOTS[i].id === id) return DAY_SLOTS[i];
    return null;
  }

  /* mulberry32, same seeded PRNG family as planner-core, so a
     composed day is reproducible in tests for a given seed. */
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

  /* Does this activity honestly serve a room of exactly `age`?
     The real band fields: it must START at or before the age and
     still COVER the age. A 3-only record serves age 3 and no one
     else. That is the band doing its job, not a filter trick. */
  function fitsAge(a, age) {
    return !!a && a.age_min <= age && a.age_max >= age;
  }

  /* The honest pool for one slot: real catalog entries that fit
     the age, can start inside the slot's minutes, belong to one
     of the slot's categories, and (outdoor slot) really are
     outdoor activities. `used` (id -> true) is excluded so a day
     never repeats an activity. */
  function slotPool(activities, slot, opts) {
    opts = opts || {};
    var used = opts.used || {};
    return (activities || []).filter(function (a) {
      if (used[a.id]) return false;
      if (!fitsAge(a, opts.age)) return false;
      if (a.time_min > slot.maxMinutes) return false;
      if (!a.categories.some(function (c) { return slot.cats.indexOf(c) !== -1; })) return false;
      if (slot.outdoorOnly && a.location.indexOf('outdoor') === -1) return false;
      return true;
    });
  }

  /* Compose a full day. Deterministic for a given seed. Prefers a
     fresh primary category per slot, then no-prep, so a composed
     day feels varied rather than five of the same shelf. Slots
     with an empty honest pool come back null. An honest empty
     state, never a stretched fit. */
  function composeDay(activities, opts) {
    opts = opts || {};
    var rng = mulberry32(opts.seed == null ? 33 : opts.seed);
    var used = {};
    var usedCats = {};
    var slots = DAY_SLOTS.map(function (slot) {
      var pool = slotPool(activities, slot, { age: opts.age, used: used });
      if (!pool.length) return { slot: slot.id, activityId: null };
      var cands = shuffled(pool, rng);
      cands.sort(function (x, y) {
        function score(a) {
          return (usedCats[a.categories[0]] ? 4 : 0) + (a.no_prep ? 0 : 1);
        }
        return score(x) - score(y);
      });
      var pick = cands[0];
      used[pick.id] = true;
      usedCats[pick.categories[0]] = true;
      return { slot: slot.id, activityId: pick.id };
    });
    return { age: opts.age, slots: slots };
  }

  /* The "Just Three" starter day: a pre-composed day for a room of
     three-year-olds, built ONLY from records banded 3-only
     (age_min 3 AND age_max 3). Preferred picks are named first;
     any missing pick falls back to the first 3-only record in
     that slot's honest pool, and a slot with no 3-only fit at all
     comes back null rather than borrowing an older kids' record. */
  var STARTER_PICKS = {
    'arrival': ['name-echo-two-claps', 'show-me-three-fingers'],
    'morning-meeting': ['show-me-three-fingers', 'big-hat-pass-and-say'],
    'centers': ['big-zip-up-down-board', 'big-peg-clip-card-row', 'big-lid-match-basket'],
    'outdoor': ['grass-hill-roll-down', 'big-texture-feet-path-walk', 'after-rain-worm-count'],
    'closing': ['one-shake-pass-around', 'feel-the-beat-heart-tap']
  };
  var STARTER = { id: 'just-three', name: 'Just Three Starter Day', age: 3, picks: STARTER_PICKS };

  function isThreeOnly(a) { return !!a && a.age_min === 3 && a.age_max === 3; }

  function starterDay(activities) {
    var byId = {};
    (activities || []).forEach(function (a) { byId[a.id] = a; });
    var used = {};
    var slots = DAY_SLOTS.map(function (slot) {
      var prefs = STARTER_PICKS[slot.id] || [];
      for (var i = 0; i < prefs.length; i++) {
        var a = byId[prefs[i]];
        if (a && isThreeOnly(a) && !used[a.id] &&
            slotPool([a], slot, { age: 3 }).length === 1) {
          used[a.id] = true;
          return { slot: slot.id, activityId: a.id };
        }
      }
      var pool = slotPool(activities, slot, { age: 3, used: used })
        .filter(isThreeOnly)
        .sort(function (x, y) { return x.id < y.id ? -1 : (x.id > y.id ? 1 : 0); });
      if (!pool.length) return { slot: slot.id, activityId: null };
      used[pool[0].id] = true;
      return { slot: slot.id, activityId: pool[0].id };
    });
    return { name: STARTER.name, age: 3, slots: slots };
  }

  /* Swap one slot: the next honest candidate for that slot that
     is not the current pick and not used elsewhere in the day.
     Deterministic rotation through the pool (by id order, from
     just after the current pick) so repeated swaps cycle the
     whole shelf instead of re-rolling dice. Null when the pool
     has nothing else, the UI says so plainly. */
  function swapCandidate(activities, slot, currentId, usedIds, age) {
    var used = {};
    (usedIds || []).forEach(function (id) { if (id && id !== currentId) used[id] = true; });
    var pool = slotPool(activities, slot, { age: age, used: used })
      .sort(function (x, y) { return x.id < y.id ? -1 : (x.id > y.id ? 1 : 0); });
    if (!pool.length) return null;
    var idx = -1;
    pool.forEach(function (a, i) { if (a.id === currentId) idx = i; });
    if (idx === -1) return pool[0].id;
    if (pool.length === 1) return null;
    return pool[(idx + 1) % pool.length].id;
  }

  /* Day totals from the real time fields: the optimistic and the
     honest end of the day, plus how many slots are filled. */
  function dayTotals(daySlots, byId) {
    var min = 0, max = 0, filled = 0;
    (daySlots || []).forEach(function (s) {
      var a = s.activityId && byId[s.activityId];
      if (!a) return;
      filled++;
      min += a.time_min;
      max += a.time_max;
    });
    return { filled: filled, total: (daySlots || []).length, minMinutes: min, maxMinutes: max };
  }

  /* Plain-text day sheet, the copy/paste twin of the printed
     sheet, in the wave-7 export pattern. */
  function daySheetText(day, byId, catName) {
    var lines = ['🗓️ ' + (day.title || 'My day') + ' · Activity Vault', ''];
    if (day.dateLabel) lines.push('Date: ' + day.dateLabel);
    if (day.age != null) lines.push('Room age: ' + day.age);
    if (day.dateLabel || day.age != null) lines.push('');
    (day.slots || []).forEach(function (s) {
      var slot = slotById(s.slot);
      var head = (slot ? slot.glyph + ' ' + slot.label : s.slot) +
        (slot ? ' · ' + slot.clock : '');
      lines.push(head);
      var a = s.activityId && byId[s.activityId];
      if (!a) { lines.push('  \u00b7 open slot (nothing in the catalog honestly fits)'); lines.push(''); return; }
      lines.push('  ' + a.name);
      lines.push('    Ages ' + a.age_min + '–' + a.age_max + ' · ' +
        a.time_min + '–' + a.time_max + ' min · Group ' + a.group_min + '–' + a.group_max +
        (a.no_prep ? ' · no prep' : ''));
      lines.push('    ' + a.categories.map(catName).join(' · '));
      lines.push('    activity/' + a.id + '.html');
      lines.push('');
    });
    lines.push('Full cards: index.html');
    return lines.join('\n');
  }

  return {
    DAY_SLOTS: DAY_SLOTS,
    STARTER: STARTER,
    slotById: slotById,
    fitsAge: fitsAge,
    isThreeOnly: isThreeOnly,
    slotPool: slotPool,
    composeDay: composeDay,
    starterDay: starterDay,
    swapCandidate: swapCandidate,
    dayTotals: dayTotals,
    daySheetText: daySheetText,
    mulberry32: mulberry32
  };
});
