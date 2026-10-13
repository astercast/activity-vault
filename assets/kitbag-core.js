/* Activity Vault — The Kit Bag core logic (Wave 34 flagship).
   The Kit Bag packs ONE day that the catalog genuinely serves:
   a Rainy-Day Indoor day. Its scenario rules never loosen — an
   activity must really carry the rainy-day category, really run
   indoors (the real location field), and really cover the room's
   age (the real age_min/age_max fields). Five roles shape the
   day's arc; a role's preferred categories are a preference
   ladder only (role pool first, then the whole honest scenario
   pool), never a reason to stretch the scenario rules.

   The bag itself is built from the REAL materials fields of the
   activities it selects. Items are deduplicated by a normalized
   key; every line keeps the activities' own wording — quantities
   exactly as the activities state them — and names every activity
   that asked for the item. No material is invented, paraphrased
   into a quantity, or dropped: the raw count in always equals
   the occurrence count out. Grouping (consumables / equipment /
   print-at-desk) is presentation only, done by the transparent
   keyword rules in classifyItem below.

   Pure functions only: no DOM, no network, no localStorage.
   Browser: window.VaultKitBag. Node: module.exports (UMD). */
(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    global.VaultKitBag = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  var SCENARIO = {
    id: 'rainy-day-indoor',
    name: 'Rainy-Day Indoor',
    glyph: '🌧️',
    dayLabel: 'One rainy day, indoors',
    blurb: 'Recess is cancelled, the gym is taken, and the rain is not stopping. ' +
      'This bag packs one whole indoor day from the catalog\u2019s real rainy-day shelf.'
  };

  /* The day's five roles, in order. `cats` are preferences: the
     slot tries its role pool first and falls back to the whole
     scenario pool before it would ever come back empty-handed
     while honest picks remain. */
  var BAG_SLOTS = [
    { id: 'burn-off', label: 'Shake the Rain Off', glyph: '🏃', clock: '9:00',
      hint: 'First: burn the stuck-inside energy before it burns the room.',
      cats: ['pe-movement', 'music-rhythm'] },
    { id: 'making-table', label: 'Making Table', glyph: '🎨', clock: '10:00',
      hint: 'Busy hands at tables: making, building, testing.',
      cats: ['crafts', 'stem'] },
    { id: 'big-group', label: 'Big Group Game', glyph: '🤝', clock: '11:30',
      hint: 'The whole room together: one game everybody is inside.',
      cats: ['team-community', 'icebreakers', 'pe-movement'] },
    { id: 'quiet-table', label: 'Quiet Table', glyph: '🤫', clock: '13:30',
      hint: 'Heads down, volume down: concentration as a rest.',
      cats: ['quiet-focus'] },
    { id: 'calm-close', label: 'Calm Close', glyph: '🌙', clock: '14:45',
      hint: 'Land the grey day softly: calm, together, done.',
      cats: ['quiet-focus', 'music-rhythm'] }
  ];

  var GROUPS = [
    { id: 'consumables', label: 'Consumables — used up: buy, restock, or substitute', glyph: '🛒' },
    { id: 'equipment', label: 'Equipment — fetch it off the shelves', glyph: '🧺' },
    { id: 'print', label: 'Print at the desk — before the day starts', glyph: '🖨️' }
  ];

  function slotById(id) {
    for (var i = 0; i < BAG_SLOTS.length; i++) if (BAG_SLOTS[i].id === id) return BAG_SLOTS[i];
    return null;
  }
  function groupById(id) {
    for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].id === id) return GROUPS[i];
    return null;
  }

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

  function fitsAge(a, age) {
    return !!a && a.age_min <= age && a.age_max >= age;
  }

  /* The scenario's hard rules — these never loosen, at any age,
     in any fallback: the activity really is a rainy-day record,
     really runs indoors, and really covers the room's age. */
  function fitsScenario(a, age) {
    return !!a && fitsAge(a, age) &&
      a.categories.indexOf('rainy-day') !== -1 &&
      a.location.indexOf('indoor') !== -1;
  }

  function scenarioPool(activities, opts) {
    opts = opts || {};
    var used = opts.used || {};
    return (activities || []).filter(function (a) {
      return fitsScenario(a, opts.age) && !used[a.id];
    });
  }

  /* One slot's pool: the role-preferred slice of the scenario
     pool when it has anything fresh, else the whole fresh
     scenario pool. The preference ladder is the only loosening
     that exists in this tool. */
  function slotPool(activities, slot, opts) {
    var pool = scenarioPool(activities, opts);
    var role = pool.filter(function (a) {
      return a.categories.some(function (c) { return slot.cats.indexOf(c) !== -1; });
    });
    return role.length ? role : pool;
  }

  /* Compose the bag's day. Deterministic for a given seed.
     Prefers a fresh primary category per slot, then no-prep, so
     the day feels varied. A slot comes back null only when the
     whole honest scenario pool is exhausted — never stretched. */
  function composeBag(activities, opts) {
    opts = opts || {};
    var rng = mulberry32(opts.seed == null ? 34 : opts.seed);
    var used = {};
    var usedCats = {};
    var slots = BAG_SLOTS.map(function (slot) {
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
    return { scenario: SCENARIO.id, age: opts.age, slots: slots };
  }

  /* Swap one slot: the next honest candidate for that slot (role
     pool first) that is not the current pick and not used
     elsewhere in the day. Deterministic rotation by id order.
     Null when nothing else honestly fits. */
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

  /* --- The bag: honest materials aggregation ------------------ */

  /* Dedupe key: lowercase, parentheticals removed (they carry the
     per-activity quantity phrasing, which is preserved verbatim in
     the entry's variants), leading quantifiers/articles stripped,
     whitespace collapsed. Deliberately conservative: "glue sticks"
     and "glue sticks (one per kid)" merge; "glue" and "glue
     sticks" do NOT — near-identical is not identical, and the bag
     never pretends two different wordings were one item. */
  var LEAD_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
    'nine', 'ten', 'a', 'an', 'the', 'some'];
  function normalizeKey(item) {
    var s = (item || '').toLowerCase()
      .replace(/\([^)]*\)/g, ' ')
      .replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    var words = s.split(' ');
    while (words.length && LEAD_WORDS.indexOf(words[0]) !== -1) words.shift();
    return words.join(' ');
  }

  /* Grouping is presentation only, and the rules are on the tin:
     print-at-desk wins first (an item the activity itself says is
     printed), then consumables (things a session uses up), and
     everything else is equipment you fetch and put back. */
  var PRINT_RE = /\b(printed|printable|print-at-desk|picture cards?|clue lists?|photocop\w*)\b/;
  var CONSUMABLE_RE = /\b(paper|cardstock|paint|glue|tape|chalk|stickers?|tissue|newspaper|flour|sand|water|candy|popcorn|ribbon|cotton|pipe cleaners?|index cards?|envelopes?|balloons?)\b/;
  function classifyItem(item) {
    var t = (item || '').toLowerCase();
    if (PRINT_RE.test(t)) return 'print';
    if (CONSUMABLE_RE.test(t)) return 'consumables';
    return 'equipment';
  }

  /* Aggregate the materials of the day's picks into the bag.
     picks: activity objects, in slot order. Every raw material
     string lands in exactly one entry; entries carry the first
     verbatim wording as their headline, every distinct verbatim
     wording in `variants`, and every activity that asked for the
     item in `activities`. Occurrences sum to the raw total. */
  function aggregateKit(picks) {
    var byKey = {};
    var order = [];
    var rawTotal = 0;
    (picks || []).forEach(function (a) {
      if (!a) return;
      (a.materials || []).forEach(function (m) {
        var verbatim = (m && m.item) || '';
        if (!verbatim) return;
        rawTotal++;
        var key = normalizeKey(verbatim);
        if (!byKey[key]) {
          byKey[key] = {
            key: key,
            item: verbatim,
            group: classifyItem(verbatim),
            variants: [],
            activities: [],
            occurrences: 0
          };
          order.push(key);
        }
        var e = byKey[key];
        e.occurrences++;
        if (e.variants.indexOf(verbatim) === -1) e.variants.push(verbatim);
        if (!e.activities.some(function (x) { return x.id === a.id; })) {
          e.activities.push({ id: a.id, name: a.name });
        }
      });
    });
    var groups = GROUPS.map(function (g) {
      var items = order.map(function (k) { return byKey[k]; })
        .filter(function (e) { return e.group === g.id; });
      items.sort(function (x, y) {
        if (y.activities.length !== x.activities.length) return y.activities.length - x.activities.length;
        return x.item.localeCompare(y.item);
      });
      return { id: g.id, label: g.label, glyph: g.glyph, items: items };
    });
    var noMaterials = (picks || []).filter(function (a) {
      return a && !(a.materials && a.materials.length);
    }).map(function (a) { return { id: a.id, name: a.name }; });
    return {
      groups: groups,
      lineCount: order.length,
      rawTotal: rawTotal,
      sharedCount: order.filter(function (k) { return byKey[k].activities.length > 1; }).length,
      noMaterials: noMaterials
    };
  }

  function bagTotals(bagSlots, byId) {
    var min = 0, max = 0, filled = 0;
    (bagSlots || []).forEach(function (s) {
      var a = s.activityId && byId[s.activityId];
      if (!a) return;
      filled++;
      min += a.time_min;
      max += a.time_max;
    });
    return { filled: filled, total: (bagSlots || []).length, minMinutes: min, maxMinutes: max };
  }

  /* Plain-text kit list — the copy/paste twin of the printed
     sheet, in the established export pattern. Quantities appear
     exactly as the activities state them, because the item text
     IS the activities' text. */
  function kitBagText(bag, byId, catName) {
    var lines = ['🎒 THE KIT BAG — ' + SCENARIO.name + ' — Activity Vault', '',
      'The day it supports: ' + SCENARIO.dayLabel + ' · Room age: ' + bag.age, ''];
    var picks = [];
    (bag.slots || []).forEach(function (s) {
      var slot = slotById(s.slot);
      var a = s.activityId && byId[s.activityId];
      lines.push((slot ? slot.glyph + ' ' + slot.clock + ' · ' + slot.label : s.slot));
      if (!a) { lines.push('  — open slot (nothing in the catalog honestly fits)'); lines.push(''); return; }
      picks.push(a);
      lines.push('  ' + a.name + ' — ages ' + a.age_min + '–' + a.age_max + ' · ' +
        a.time_min + '–' + a.time_max + ' min · ' +
        a.categories.map(catName).join(' · ') + ' · activity/' + a.id + '.html');
      lines.push('');
    });
    var kit = aggregateKit(picks);
    lines.push('THE BAG — ' + kit.lineCount + ' lines from ' + kit.rawTotal +
      ' materials listed across the day\u2019s activities' +
      (kit.sharedCount ? ' · ' + kit.sharedCount + ' shared by more than one activity' : ''));
    kit.groups.forEach(function (g) {
      if (!g.items.length) return;
      lines.push('', g.glyph + ' ' + g.label.toUpperCase());
      g.items.forEach(function (e) {
        lines.push('  [ ] ' + e.item + ' — for: ' +
          e.activities.map(function (x) { return x.name; }).join(', '));
        e.variants.forEach(function (v) {
          if (v !== e.item) lines.push('      also listed as: ' + v);
        });
      });
    });
    kit.noMaterials.forEach(function (n) {
      lines.push('  (nothing to pack for ' + n.name + ' — it needs no materials)');
    });
    lines.push('', 'Every line above is copied from a real activity\u2019s materials list — ' +
      'open its card from the Vault for setup, steps, and safety.');
    return lines.join('\n');
  }

  return {
    SCENARIO: SCENARIO,
    BAG_SLOTS: BAG_SLOTS,
    GROUPS: GROUPS,
    slotById: slotById,
    groupById: groupById,
    fitsAge: fitsAge,
    fitsScenario: fitsScenario,
    scenarioPool: scenarioPool,
    slotPool: slotPool,
    composeBag: composeBag,
    swapCandidate: swapCandidate,
    normalizeKey: normalizeKey,
    classifyItem: classifyItem,
    aggregateKit: aggregateKit,
    bagTotals: bagTotals,
    kitBagText: kitBagText,
    mulberry32: mulberry32
  };
});
