/* Activity Vault, The Party Pack core logic (Wave 35 flagship).
   The Party Pack composes the two flagships that came before it:
   the Day Planner's slot arc (five slots in an event's order,
   each filled from the real catalog) and the Kit Bag's materials
   aggregation (the party's pack list is built from the REAL
   materials fields of the activities the plan selects, through
   VaultKitBag.aggregateKit, loaded before this file; in Node,
   required from ./kitbag-core.js).

   The hard rules never loosen: a pick must really match the
   occasion (the real tags / category / location fields named in
   OCCASIONS below), really overlap the room's age band (the real
   age_min/age_max fields), and really fit the group size (the
   real group_min/group_max fields). A slot's categories are a
   preference ladder only, exactly as in the Kit Bag: the slot's
   own pool first, then the whole honest occasion pool, and a
   slot with no honest pick left comes back open, never padded.

   Honest thin coverage: when an occasion + age band + group
   size honestly holds fewer records than the arc has slots, the
   coverage report says so in numbers, the composed plan fills
   only what honestly fits, and nearestOptions() names the
   nearest REAL alternatives (a neighbouring age band, a smaller
   group, another occasion), each verified against the catalog
   before it is offered. Nothing is invented to fill a gap.

   Pure functions only: no DOM, no network, no localStorage.
   Browser: window.VaultPartyPack. Node: module.exports (UMD). */
(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('./kitbag-core.js'));
  } else {
    global.VaultPartyPack = factory(global.VaultKitBag);
  }
})(typeof window !== 'undefined' ? window : this, function (KB) {
  'use strict';

  /* Age bands as the page offers them: [min, max]. An activity
     serves a band when its own band OVERLAPS it. The Vault's
     standing filter convention (data/v1/filters.json). */
  var AGE_BANDS = [
    { id: '3-4', label: 'Ages 3–4', min: 3, max: 4 },
    { id: '5-6', label: 'Ages 5–6', min: 5, max: 6 },
    { id: '7-8', label: 'Ages 7–8', min: 7, max: 8 },
    { id: '9-12', label: 'Ages 9–12', min: 9, max: 12 }
  ];

  /* Occasions, each defined by the real fields it filters on.
     `tags`: an activity matches when it carries ANY listed tag.
     `anyTag: true` (birthday) means the whole catalog is the
     honest pool. A birthday has no season in the vocabulary,
     and the page says so. `rainy-day` matches on the real
     category + location fields, like the Kit Bag's scenario. */
  var OCCASIONS = [
    { id: 'birthday', label: 'Birthday Party', glyph: '🎂', anyTag: true,
      blurb: 'No season, no holiday. The whole catalog is honestly in play, filtered by age band and group size.' },
    { id: 'halloween', label: 'Halloween Party', glyph: '🎃', tags: ['holiday:halloween', 'theme:spooky'],
      blurb: 'Activities carrying the Halloween or spooky tags.' },
    { id: 'thanksgiving', label: 'Thanksgiving & Friendsgiving', glyph: '🦃', tags: ['holiday:thanksgiving'],
      blurb: 'Activities carrying the Thanksgiving tag.' },
    { id: 'winter-holiday', label: 'Winter Holiday Party', glyph: '❄️',
      tags: ['holiday:christmas', 'holiday:hanukkah', 'holiday:kwanzaa', 'holiday:new-year', 'season:winter'],
      blurb: 'Christmas, Hanukkah, Kwanzaa, New Year, and winter-season activities.' },
    { id: 'valentines', label: "Valentine's Party", glyph: '💌', tags: ['holiday:valentines-day'],
      blurb: "Activities carrying the Valentine's Day tag, a small, honest shelf." },
    { id: 'spring', label: 'Spring & Easter Party', glyph: '🌷',
      tags: ['holiday:easter', 'holiday:earth-day', 'season:spring'],
      blurb: 'Easter, Earth Day, and spring-season activities.' },
    { id: 'summer', label: 'Summer & July 4th Party', glyph: '☀️', tags: ['holiday:july-4th', 'season:summer'],
      blurb: 'July 4th and summer-season activities.' },
    { id: 'rainy-day', label: 'Rainy-Day Party (indoors)', glyph: '🌧️', rainyDay: true,
      blurb: 'Real rainy-day activities that really run indoors, the Kit Bag\u2019s scenario, wearing a party hat.' }
  ];

  /* The party arc: the Day Planner's slot shape, in an event's
     order. `cats` are preferences (the ladder above); `maxMinutes`
     caps an activity's time_min so it can start inside the slot. */
  var PARTY_SLOTS = [
    { id: 'welcome', label: 'Welcome & Arrival', glyph: '🎈', clock: 'Start',
      hint: 'Guests arriving in ones and twos: something welcoming that runs itself while coats come off.',
      cats: ['icebreakers'], maxMinutes: 20 },
    { id: 'big-group', label: 'Big Group Opener', glyph: '🎉', clock: 'Opener',
      hint: 'The whole party together: one game everybody is inside.',
      cats: ['team-community', 'icebreakers', 'pe-movement'], maxMinutes: 30 },
    { id: 'making', label: 'Making & Games', glyph: '🎨', clock: 'Middle',
      hint: 'Busy hands and working brains: making, building, testing.',
      cats: ['crafts', 'stem'], maxMinutes: 30 },
    { id: 'movement', label: 'Movement Break', glyph: '🏃', clock: 'Energy',
      hint: 'Burn the party energy before it burns the room.',
      cats: ['pe-movement', 'music-rhythm', 'outdoor'], maxMinutes: 30 },
    { id: 'calm-close', label: 'Calm Close & Goodbye', glyph: '🌙', clock: 'Close',
      hint: 'Land the party softly: calm, together, done.',
      cats: ['quiet-focus', 'music-rhythm'], maxMinutes: 20 }
  ];

  function occasionById(id) {
    for (var i = 0; i < OCCASIONS.length; i++) if (OCCASIONS[i].id === id) return OCCASIONS[i];
    return null;
  }
  function bandById(id) {
    for (var i = 0; i < AGE_BANDS.length; i++) if (AGE_BANDS[i].id === id) return AGE_BANDS[i];
    return null;
  }
  function slotById(id) {
    for (var i = 0; i < PARTY_SLOTS.length; i++) if (PARTY_SLOTS[i].id === id) return PARTY_SLOTS[i];
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

  /* The hard rules, these never loosen, at any fallback. */
  function fitsOccasion(a, occ) {
    if (!a || !occ) return false;
    if (occ.anyTag) return true;
    if (occ.rainyDay) {
      return a.categories.indexOf('rainy-day') !== -1 &&
        a.location.indexOf('indoor') !== -1;
    }
    var tags = a.tags || [];
    return occ.tags.some(function (t) { return tags.indexOf(t) !== -1; });
  }
  function fitsBand(a, band) {
    return !!a && !!band && a.age_min <= band.max && a.age_max >= band.min;
  }
  function fitsGroup(a, groupSize) {
    return !!a && a.group_min <= groupSize && a.group_max >= groupSize;
  }
  function fitsParty(a, opts) {
    var occ = occasionById(opts.occasion);
    var band = bandById(opts.ageBand);
    return fitsOccasion(a, occ) && fitsBand(a, band) && fitsGroup(a, opts.groupSize);
  }

  /* The honest pool for one request: every real record passing
     all three hard rules. */
  function occasionPool(activities, opts) {
    return (activities || []).filter(function (a) { return fitsParty(a, opts); });
  }

  /* One slot's pool: the slot-preferred slice of the occasion
     pool when it has anything fresh, else the whole fresh
     occasion pool. The Kit Bag's preference ladder, verbatim
     in spirit. The hard rules are applied before the ladder. */
  function slotPool(activities, slot, opts) {
    var used = (opts && opts.used) || {};
    var pool = occasionPool(activities, opts).filter(function (a) {
      return !used[a.id] && a.time_min <= slot.maxMinutes;
    });
    var role = pool.filter(function (a) {
      return a.categories.some(function (c) { return slot.cats.indexOf(c) !== -1; });
    });
    return role.length ? role : pool;
  }

  /* Compose the party. Deterministic for a given seed. Prefers
     a fresh primary category per slot, then no-prep, as the Day
     Planner does. Slots come back null only when the honest
     occasion pool is exhausted, never stretched, never padded. */
  function composeParty(activities, opts) {
    opts = opts || {};
    var rng = mulberry32(opts.seed == null ? 35 : opts.seed);
    var used = {};
    var usedCats = {};
    var slots = PARTY_SLOTS.map(function (slot) {
      var pool = slotPool(activities, slot, {
        occasion: opts.occasion, ageBand: opts.ageBand,
        groupSize: opts.groupSize, used: used
      });
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
    return { occasion: opts.occasion, ageBand: opts.ageBand, groupSize: opts.groupSize, slots: slots };
  }

  /* Swap one slot: the next honest candidate for that slot
     (ladder pool, id order) that is not the current pick and
     not used elsewhere in the party. Null when nothing else
     honestly fits, the page says so plainly. */
  function swapCandidate(activities, slot, currentId, usedIds, opts) {
    var used = {};
    (usedIds || []).forEach(function (id) { if (id && id !== currentId) used[id] = true; });
    var pool = slotPool(activities, slot, {
      occasion: opts.occasion, ageBand: opts.ageBand, groupSize: opts.groupSize, used: used
    }).sort(function (x, y) { return x.id < y.id ? -1 : (x.id > y.id ? 1 : 0); });
    if (!pool.length) return null;
    var idx = -1;
    pool.forEach(function (a, i) { if (a.id === currentId) idx = i; });
    if (idx === -1) return pool[0].id;
    if (pool.length === 1) return null;
    return pool[(idx + 1) % pool.length].id;
  }

  /* Coverage, in honest numbers: how many real records the
     request holds, how many of the arc's slots can honestly
     fill, and whether the coverage is thin, fewer honest
     records than the arc has slots, so a full distinct plan
     cannot exist no matter how the picks are arranged. */
  function coverageReport(activities, opts) {
    var pool = occasionPool(activities, opts);
    var party = composeParty(activities, {
      occasion: opts.occasion, ageBand: opts.ageBand,
      groupSize: opts.groupSize, seed: opts.seed == null ? 35 : opts.seed
    });
    var filled = party.slots.filter(function (s) { return s.activityId; }).length;
    return {
      poolSize: pool.length,
      slotsTotal: PARTY_SLOTS.length,
      slotsFilled: filled,
      thin: pool.length < PARTY_SLOTS.length,
      full: filled === PARTY_SLOTS.length
    };
  }

  /* Nearest real options for a thin request: single-dimension
     neighbours, the adjacent age bands at the same occasion
     and size, smaller group sizes at the same occasion and
     band, and every other occasion at the same band and size.
     Each candidate is composed against the real catalog before
     it is offered; only neighbours that fill MORE slots than
     the request are returned, best first, at most three. */
  function nearestOptions(activities, opts) {
    var base = coverageReport(activities, opts);
    var seen = {};
    var out = [];
    function consider(o, changeLabel) {
      var key = o.occasion + '|' + o.ageBand + '|' + o.groupSize;
      if (seen[key]) return;
      seen[key] = true;
      var rep = coverageReport(activities, o);
      if (rep.slotsFilled <= base.slotsFilled) return;
      out.push({
        occasion: o.occasion, ageBand: o.ageBand, groupSize: o.groupSize,
        change: changeLabel, poolSize: rep.poolSize,
        slotsFilled: rep.slotsFilled, slotsTotal: rep.slotsTotal, full: rep.full
      });
    }
    var bands = AGE_BANDS.map(function (b) { return b.id; });
    var bi = bands.indexOf(opts.ageBand);
    [bi - 1, bi + 1].forEach(function (j) {
      if (j < 0 || j >= bands.length) return;
      consider({ occasion: opts.occasion, ageBand: bands[j], groupSize: opts.groupSize },
        'Age band → ' + bandById(bands[j]).label);
    });
    [16, 10, 6].forEach(function (size) {
      if (size >= opts.groupSize) return;
      consider({ occasion: opts.occasion, ageBand: opts.ageBand, groupSize: size },
        'Group size → about ' + size);
    });
    OCCASIONS.forEach(function (occ) {
      if (occ.id === opts.occasion) return;
      consider({ occasion: occ.id, ageBand: opts.ageBand, groupSize: opts.groupSize },
        'Occasion → ' + occ.label);
    });
    out.sort(function (x, y) {
      if (y.slotsFilled !== x.slotsFilled) return y.slotsFilled - x.slotsFilled;
      if (y.full !== x.full) return y.full ? 1 : -1;
      return y.poolSize - x.poolSize;
    });
    return out.slice(0, 3);
  }

  /* The party's pack list: the Kit Bag's aggregation, composed
. Every line copied from a real pick's materials field,
     deduplicated and grouped by the Kit Bag's own rules, every
     line naming every activity that asked for it. */
  function partyKit(picks) {
    if (!KB) return null;
    return KB.aggregateKit(picks);
  }

  function partyTotals(partySlots, byId) {
    var min = 0, max = 0, filled = 0;
    (partySlots || []).forEach(function (s) {
      var a = s.activityId && byId[s.activityId];
      if (!a) return;
      filled++;
      min += a.time_min;
      max += a.time_max;
    });
    return { filled: filled, total: (partySlots || []).length, minMinutes: min, maxMinutes: max };
  }

  /* Plain-text party sheet, the copy/paste twin of the printed
     sheet, in the established export pattern. */
  function partySheetText(party, byId, catName) {
    var occ = occasionById(party.occasion);
    var band = bandById(party.ageBand);
    var lines = ['🎉 THE PARTY PACK, ' + (occ? occ.label: party.occasion) + ' · Activity Vault', '',
      'Party: ' + (occ ? occ.label : '') + ' · ' + (band ? band.label : party.ageBand) +
      ' · Group of ' + party.groupSize, ''];
    var picks = [];
    (party.slots || []).forEach(function (s) {
      var slot = slotById(s.slot);
      var a = s.activityId && byId[s.activityId];
      lines.push((slot ? slot.glyph + ' ' + slot.label : s.slot));
      if (!a) {
        lines.push('  \u00b7 open slot (nothing in the catalog honestly fits this part of the arc)');
        lines.push('');
        return;
      }
      picks.push(a);
      lines.push('  ' + a.name + ', ages ' + a.age_min + '–' + a.age_max + ' · ' +
        a.time_min + '–' + a.time_max + ' min · group ' + a.group_min + '–' + a.group_max + ' · ' +
        a.categories.map(catName).join(' · ') + ' · activity/' + a.id + '.html');
      lines.push('');
    });
    var kit = partyKit(picks);
    if (kit) {
      lines.push('🎒 THE PARTY BAG, ' + kit.lineCount + ' lines from ' + kit.rawTotal +
        ' materials listed across the party\u2019s activities' +
        (kit.sharedCount ? ' · ' + kit.sharedCount + ' shared by more than one activity' : ''));
      kit.groups.forEach(function (g) {
        if (!g.items.length) return;
        lines.push('', g.glyph + ' ' + g.label.toUpperCase());
        g.items.forEach(function (e) {
          lines.push('  [ ] ' + e.item + ', for: ' +
            e.activities.map(function (x) { return x.name; }).join(', '));
          e.variants.forEach(function (v) {
            if (v !== e.item) lines.push('      also listed as: ' + v);
          });
        });
      });
      kit.noMaterials.forEach(function (n) {
        lines.push('  (nothing to pack for ' + n.name + '. It needs no materials)');
      });
    }
    lines.push('', 'Every activity and every pack line above is copied from a real ' +
      'Activity Vault record. Open its card for setup, steps, and safety.');
    return lines.join('\n');
  }

  return {
    AGE_BANDS: AGE_BANDS,
    OCCASIONS: OCCASIONS,
    PARTY_SLOTS: PARTY_SLOTS,
    occasionById: occasionById,
    bandById: bandById,
    slotById: slotById,
    fitsOccasion: fitsOccasion,
    fitsBand: fitsBand,
    fitsGroup: fitsGroup,
    fitsParty: fitsParty,
    occasionPool: occasionPool,
    slotPool: slotPool,
    composeParty: composeParty,
    swapCandidate: swapCandidate,
    coverageReport: coverageReport,
    nearestOptions: nearestOptions,
    partyKit: partyKit,
    partyTotals: partyTotals,
    partySheetText: partySheetText,
    mulberry32: mulberry32
  };
});
