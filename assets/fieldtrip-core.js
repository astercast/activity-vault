/* Activity Vault, Field Trip Planner core logic (wave 14).
   Pure functions only: no DOM, no network, no localStorage.
   Browser: window.VaultFieldTrip. Node: module.exports (UMD). */
(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    global.VaultFieldTrip = factory();
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  var AGE_BANDS = {
    'prek-k': { label: 'PreK–K (ages 3–6)', min: 3, max: 6 },
    'g1-2': { label: 'Grades 1–2 (ages 6–8)', min: 6, max: 8 },
    'g3-5': { label: 'Grades 3–5 (ages 8–11)', min: 8, max: 11 },
    'g6-8': { label: 'Grades 6–8 (ages 11–14)', min: 11, max: 14 },
    'all': { label: 'All ages (3–14)', min: 3, max: 14 }
  };

  /* Destination -> library matching. cats are real category ids; keywords are
     matched (case-insensitive) against name + tagline. If fewer than 3 picks
     match the keywords, the matcher falls back to cats alone, asserted by
     scripts/test-fieldtrip.js so every destination always yields suggestions. */
  var DESTINATIONS = {
    'museum': {
      label: 'Museum / science center', glyph: '🏛️',
      blurb: 'Galleries, exhibits, and quiet looking, then sketch it.',
      cats: ['quiet-focus', 'crafts', 'seasons'],
      keywords: ['museum', 'scavenger', 'sketch', 'gallery', 'observe']
    },
    'nature': {
      label: 'Nature park / trail', glyph: '🌳',
      blurb: 'Trails, leaves, birds, and dirt, the outdoor classroom.',
      cats: ['outdoor', 'seasons', 'stem'],
      keywords: ['nature', 'leaf', 'bird', 'hike', 'trail', 'scavenger', 'bug']
    },
    'farm': {
      label: 'Farm / orchard', glyph: '🚜',
      blurb: 'Animals, crops, and where food comes from.',
      cats: ['outdoor', 'seasons', 'stem', 'team-community'],
      keywords: ['farm', 'plant', 'seed', 'harvest', 'garden', 'pumpkin', 'apple']
    },
    'library': {
      label: 'Library / bookstore', glyph: '📚',
      blurb: 'Quiet stacks, story time, and the summer reading wall.',
      cats: ['quiet-focus', 'crafts', 'team-community'],
      keywords: ['book', 'story', 'reading', 'library', 'poem']
    },
    'helpers': {
      label: 'Community helpers visit', glyph: '🚒',
      blurb: 'Fire station, post office, bakery. Meet the neighborhood at work.',
      cats: ['team-community', 'icebreakers', 'seasons'],
      keywords: ['community', 'helper', 'interview', 'thank-you', 'post']
    },
    'playground': {
      label: 'Playground / sports field', glyph: '⚽',
      blurb: 'Big space, big energy. Run it out, together.',
      cats: ['pe-movement', 'outdoor', 'team-community'],
      keywords: []
    },
    'arts': {
      label: 'Art gallery / theater', glyph: '🎭',
      blurb: 'Stages, studios, and making something to take home.',
      cats: ['crafts', 'music-rhythm', 'team-community'],
      keywords: ['art', 'drama', 'theater', 'theatre', 'music', 'dance', 'puppet']
    }
  };
  var DESTINATION_IDS = Object.keys(DESTINATIONS);

  var TRIP_LENGTHS = {
    'half': { label: 'Half day (~3 hours)', minutes: 180 },
    'full': { label: 'Full day (~5 hours)', minutes: 300 }
  };

  function fmtClock(totalMin) {
    var m = ((totalMin % 1440) + 1440) % 1440;
    var h = Math.floor(m / 60), mm = m % 60;
    var ap = h < 12 ? 'AM' : 'PM';
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ':' + (mm < 10 ? '0' + mm : mm) + ' ' + ap;
  }

  function parseClock(str) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(String(str || '').trim());
    if (!m) return null;
    var h = parseInt(m[1], 10), mm = parseInt(m[2], 10);
    if (h > 23 || mm > 59) return null;
    return h * 60 + mm;
  }

  /* Timeline: fixed on-site blocks + user travel minutes. Returns
     {blocks:[{label, minutes, start, end}], travelBudget, warning}. */
  function buildTimeline(opts) {
    var len = TRIP_LENGTHS[opts.tripLength] ? TRIP_LENGTHS[opts.tripLength].minutes : 180;
    var travelOut = Math.max(0, opts.travelOutMin | 0);
    var travelBack = Math.max(0, opts.travelBackMin | 0);
    var full = opts.tripLength === 'full';
    var blocks = [
      { label: '🚌 Travel to destination', minutes: travelOut, travel: true },
      { label: '👋 Welcome, rules & buddy check', minutes: 10 },
      { label: '🔍 Explore block 1', minutes: 45 },
      { label: '🍎 Snack & regroup headcount', minutes: 15 },
      { label: '🔍 Explore block 2', minutes: full ? 45 : 30 }
    ];
    if (full) blocks.push({ label: '🥪 Lunch', minutes: 30 });
    blocks.push({ label: '🎒 Free explore / gift shop', minutes: full ? 30 : 15 });
    blocks.push({ label: '📋 Wrap-up & final headcount', minutes: 10 });
    blocks.push({ label: '🚌 Travel back', minutes: travelBack, travel: true });

    var onSite = blocks.reduce(function (a, b) { return a + (b.travel ? 0 : b.minutes); }, 0);
    var travelBudget = len - onSite;
    var warning = null;
    if (travelOut + travelBack > travelBudget) {
      warning = 'Travel (' + (travelOut + travelBack) + ' min) exceeds the ' +
        travelBudget + '-min travel budget, shorten a block or extend the day.';
    }
    var t = opts.startMin | 0;
    blocks.forEach(function (b) {
      b.start = t; b.end = t + b.minutes; t = b.end;
    });
    return { blocks: blocks, travelBudget: travelBudget, warning: warning, totalMin: t - (opts.startMin | 0) };
  }

  /* Chaperones: ratio like 8 means 1 adult per 8 kids. The default (1:8) is a
     common planning figure. The UI tells the teacher to confirm with their
     program's policy, since required ratios vary. */
  function chaperonesNeeded(kids, ratio) {
    kids = Math.max(1, kids | 0); ratio = Math.max(1, ratio | 0);
    var chaperones = Math.ceil(kids / ratio);
    return { chaperones: chaperones, total: kids + chaperones };
  }

  /* Buddy pairs: even split into pairs; an odd kid out joins a trio. */
  function buddyGroups(kids) {
    kids = Math.max(1, kids | 0);
    var trios = kids % 2 === 1 ? 1 : 0;
    var pairs = Math.floor((kids - trios * 3) / 2);
    return { pairs: pairs, trios: trios, covered: pairs * 2 + trios * 3 };
  }

  /* Budget: user-entered numbers only. The tool does the arithmetic. */
  function budgetTotal(kids, admissionPerKid, transportFlat) {
    kids = Math.max(0, kids | 0);
    admissionPerKid = Math.max(0, Number(admissionPerKid) || 0);
    transportFlat = Math.max(0, Number(transportFlat) || 0);
    var total = kids * admissionPerKid + transportFlat;
    return { total: total, perKid: kids ? total / kids : 0 };
  }

  function ageOverlaps(a, min, max) {
    return a.age_min <= max && a.age_max >= min;
  }

  /* On-site suggestions from the real library. Returns up to `limit`
     activity records, no-prep first, then longest time_max. */
  function matchOnSite(activities, destId, ageMin, ageMax, limit) {
    var dest = DESTINATIONS[destId];
    if (!dest) return [];
    limit = limit || 6;
    var pool = activities.filter(function (a) {
      return a.categories.some(function (c) { return dest.cats.indexOf(c) !== -1; }) &&
        ageOverlaps(a, ageMin, ageMax) && a.time_max <= 60;
    });
    var picked = pool;
    if (dest.keywords.length) {
      var scored = pool.filter(function (a) {
        var blob = (a.name + ' ' + a.tagline).toLowerCase();
        return dest.keywords.some(function (k) { return blob.indexOf(k) !== -1; });
      });
      if (scored.length >= 3) picked = scored;
    }
    picked = picked.slice().sort(function (x, y) {
      if (!!x.no_prep !== !!y.no_prep) return x.no_prep ? -1 : 1;
      return y.time_max - x.time_max;
    });
    return picked.slice(0, limit);
  }

  /* Bus-ride picks from the real field-trip-bus-ride collection. */
  function pickBusActivities(collectionPicks, byId, ageMin, ageMax, rideMinutes) {
    var want = Math.max(2, Math.min(collectionPicks.length, Math.ceil((rideMinutes | 0) / 15) || 2));
    var pool = collectionPicks
      .map(function (p) { return byId[p.activity_id || p.id]; })
      .filter(function (a) { return a && ageOverlaps(a, ageMin, ageMax); });
    pool.sort(function (x, y) {
      if (!!x.no_prep !== !!y.no_prep) return x.no_prep ? -1 : 1;
      return y.time_max - x.time_max;
    });
    return pool.slice(0, want);
  }

  return {
    AGE_BANDS: AGE_BANDS,
    DESTINATIONS: DESTINATIONS,
    DESTINATION_IDS: DESTINATION_IDS,
    TRIP_LENGTHS: TRIP_LENGTHS,
    fmtClock: fmtClock,
    parseClock: parseClock,
    buildTimeline: buildTimeline,
    chaperonesNeeded: chaperonesNeeded,
    buddyGroups: buddyGroups,
    budgetTotal: budgetTotal,
    matchOnSite: matchOnSite,
    pickBusActivities: pickBusActivities
  };
});
