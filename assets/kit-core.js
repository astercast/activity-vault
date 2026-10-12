/* Activity Vault — After-School Kit core logic (wave 18).
   Pure functions only: no DOM, no network, no localStorage.
   Browser: window.VaultKit. Node: module.exports (UMD). */
(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    global.VaultKit = factory();
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

  /* The low-materials pantry: 16 classroom staples. Each maps to the
     substrings (word-boundary matched) it covers in real material strings.
     A phone timer and tap water count as "on hand" — the labels say so. */
  var PANTRY = [
    { id: 'paper',    label: 'Printer / copy paper', glyph: '📰', words: ['paper'] },
    { id: 'markers',  label: 'Markers',              glyph: '🖍️', words: ['marker'] },
    { id: 'crayons',  label: 'Crayons',              glyph: '🖊️', words: ['crayon'] },
    { id: 'pencils',  label: 'Pencils',              glyph: '✏️', words: ['pencil'] },
    { id: 'scissors', label: 'Scissors',             glyph: '✂️', words: ['scissors', 'scissor'] },
    { id: 'tape',     label: 'Tape',                 glyph: '📎', words: ['tape'] },
    { id: 'glue',     label: 'Glue sticks',          glyph: '🧴', words: ['glue'] },
    { id: 'plates',   label: 'Paper plates',         glyph: '🍽️', words: ['paper plate', 'plate'] },
    { id: 'cups',     label: 'Paper cups',           glyph: '🥤', words: ['paper cup', 'cup'] },
    { id: 'yarn',     label: 'Yarn & string',        glyph: '🧶', words: ['yarn', 'string', 'twine'] },
    { id: 'balloons', label: 'Balloons',             glyph: '🎈', words: ['balloon'] },
    { id: 'chalk',    label: 'Chalk',                glyph: '🪨', words: ['chalk'] },
    { id: 'dice',     label: 'Dice',                 glyph: '🎲', words: ['dice'] },
    { id: 'cards',    label: 'Playing cards',        glyph: '🃏', words: ['playing card', 'index card', 'card'] },
    { id: 'timer',    label: 'Timer (phone counts)', glyph: '⏱️', words: ['timer', 'stopwatch'] },
    { id: 'water',    label: 'Tap water',            glyph: '🚰', words: ['water'] }
  ];
  var PANTRY_IDS = PANTRY.map(function (p) { return p.id; });
  var PANTRY_DEFAULT = ['paper', 'markers', 'crayons', 'pencils', 'scissors',
                        'tape', 'glue', 'timer', 'water'];

  var MODES = {
    'pantry': { label: '🧰 Use what I have', blurb: 'Only activities whose materials are all in your pantry (or need none).' },
    'low': { label: '📦 Low-materials', blurb: 'No-prep or 3 materials or fewer — scrounge-able in one trip.' },
    'noprep': { label: '⚡ No-prep only', blurb: 'Only no_prep activities. Nothing to gather, nothing to set up.' }
  };

  var DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  /* Word-boundary matching so "cup" doesn't match "cupcakes" and "card"
     doesn't match "cardboard". Multi-word phrases matched as-is. */
  function wordMatch(text, word) {
    if (word.indexOf(' ') !== -1) {
      return text.indexOf(word) !== -1;
    }
    return new RegExp('\\b' + escRe(word) + 's?\\b').test(text);
  }

  function pantryWords(pantryIds) {
    var map = {};
    PANTRY.forEach(function (p) { map[p.id] = p.words; });
    var out = [];
    (pantryIds || []).forEach(function (id) {
      (map[id] || []).forEach(function (w) {
        if (out.indexOf(w) === -1) out.push(w);
      });
    });
    return out;
  }

  /* Does pantry cover one raw material string? */
  function itemCovered(itemText, words) {
    var t = (itemText || '').toLowerCase();
    return words.some(function (w) { return wordMatch(t, w); });
  }

  /* Material fit for one activity against a pantry id list.
     Returns {ok, missing[]} — missing holds the raw item strings to gather. */
  function materialFit(a, pantryIds) {
    var words = pantryWords(pantryIds);
    var missing = [];
    (a.materials || []).forEach(function (m) {
      if (!itemCovered(m.item, words)) missing.push(m.item);
    });
    return { ok: missing.length === 0, missing: missing };
  }

  /* Normalize a material string for the checklist: lowercase, strip
     per-kid/count parentheticals so "paper plates (one per kid)" groups
     with "paper plates". */
  function normalizeItem(item) {
    return (item || '').toLowerCase()
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Hard filters: age overlap, group range includes groupSize, time_min fits.
     Material/prep rules live in modeFilter — kept separate so relaxation
     rounds can loosen them without touching age/group/time. */
  function fitsHard(a, cfg) {
    var band = AGE_BANDS[cfg.ageBand] || AGE_BANDS.all;
    if (!(band.min <= a.age_max && a.age_min <= band.max)) return false;
    if (!(a.group_min <= cfg.groupSize && cfg.groupSize <= a.group_max)) return false;
    if (!(a.time_min <= cfg.minutes)) return false;
    return true;
  }

  function fitsMode(a, cfg) {
    var mode = cfg.mode || 'pantry';
    if (mode === 'noprep') return !!a.no_prep;
    if (mode === 'low') return !!a.no_prep || (a.materials || []).length <= 3;
    /* pantry: everything must be covered by what's on hand */
    return materialFit(a, cfg.pantry || []).ok;
  }

  function fitsKit(a, cfg) {
    return fitsHard(a, cfg) && fitsMode(a, cfg);
  }

  function clampCfg(cfg) {
    var c = Object.assign({
      ageBand: 'all', groupSize: 20, days: 3, minutes: 60,
      startTime: '15:30', mode: 'pantry', pantry: PANTRY_DEFAULT.slice()
    }, cfg || {});
    if (!AGE_BANDS[c.ageBand]) c.ageBand = 'all';
    c.groupSize = Math.max(2, Math.min(60, parseInt(c.groupSize, 10) || 20));
    c.days = Math.max(1, Math.min(5, parseInt(c.days, 10) || 3));
    c.minutes = Math.max(20, Math.min(120, parseInt(c.minutes, 10) || 60));
    if (!MODES[c.mode]) c.mode = 'pantry';
    if (!/^\d{2}:\d{2}$/.test(c.startTime)) c.startTime = '15:30';
    c.pantry = (c.pantry || []).filter(function (id) { return PANTRY_IDS.indexOf(id) !== -1; });
    return c;
  }

  function mulberry32(seed) {
    var t = (seed >>> 0) || 1;
    return function () {
      t += 0x6D2B79F5;
      var z = Math.imul(t ^ (t >>> 15), t | 1);
      z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
      return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rnd) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function bucketOf(a, bucketByCat) {
    var cat = (a.categories || [])[0];
    return (bucketByCat && cat && bucketByCat[cat]) || 'mixed';
  }

  /* Shortest-N helper for fallback ladders: dataset reality is that very few
     activities run ≤12 minutes, so role slots fall back to the shortest
     available picks rather than the whole pool. */
  function shortest(pool, n, pred) {
    var list = pool.filter(pred || function () { return true; });
    list.sort(function (x, y) { return x.time_max - y.time_max || x.id.localeCompare(y.id); });
    return list.slice(0, Math.max(1, n));
  }

  /* Slot-role candidate filters. Openers are short + no-prep; closers are
     short + calm. Each has a fallback ladder so the slot never degrades to
     "any activity in the pool". */
  function openerCands(pool, bucketByCat) {
    var c = pool.filter(function (a) { return a.time_max <= 15 && a.no_prep; });
    var hot = c.filter(function (a) {
      var b = bucketOf(a, bucketByCat);
      return b === 'movement' || a.categories.indexOf('icebreakers') !== -1;
    });
    if (hot.length) return hot;
    if (c.length) return c;
    return shortest(pool, 8, function (a) { return a.no_prep; });
  }

  function closerCands(pool, bucketByCat) {
    var c = pool.filter(function (a) { return a.time_max <= 20; });
    var calm = c.filter(function (a) {
      return bucketOf(a, bucketByCat) === 'calm' || a.categories.indexOf('quiet-focus') !== -1;
    });
    if (calm.length) return calm;
    if (c.length) return c;
    return shortest(pool, 8);
  }

  function mainCands(pool) {
    return pool.slice();
  }

  /* Pick one candidate: prefer unused ids, then unused primary categories,
     no-prep first, ties shuffled. Returns the activity or null. */
  function pickScored(list, usedCats, rnd) {
    var scored = list.map(function (a) {
      var newCat = a.categories.some(function (c) { return !usedCats[c]; }) ? 0 : 1;
      return { a: a, s: (newCat * 2) + (a.no_prep ? 0 : 1) };
    });
    scored.sort(function (x, y) { return x.s - y.s || x.a.id.localeCompare(y.a.id); });
    var best = scored[0].s;
    var ties = scored.filter(function (x) { return x.s === best; }).map(function (x) { return x.a; });
    return shuffle(ties, rnd)[0] || null;
  }

  /* Deal one slot with a fallback ladder:
       1. fresh role candidates (keeps the day's arc)
       2. fresh picks from a loosened role bound (openers ≤20 min, closers ≤30)
       3. fresh picks from the whole pool (variety beats role fidelity)
       4. role candidates with repeats allowed (flagged reused:true)
     Repeats only happen when the entire pool is exhausted. */
  function dealSlot(roleCands, fallbackCands, pool, usedIds, usedCats, rnd) {
    var freshRole = roleCands.filter(function (a) { return !usedIds[a.id]; });
    if (freshRole.length) return { a: pickScored(freshRole, usedCats, rnd), reused: false };
    var freshFb = fallbackCands.filter(function (a) { return !usedIds[a.id]; });
    if (freshFb.length) return { a: pickScored(freshFb, usedCats, rnd), reused: false };
    var freshPool = pool.filter(function (a) { return !usedIds[a.id]; });
    if (freshPool.length) return { a: pickScored(freshPool, usedCats, rnd), reused: false };
    if (roleCands.length) return { a: pickScored(roleCands, usedCats, rnd), reused: true };
    return null;
  }

  function markUsed(a, usedIds, usedCats) {
    usedIds[a.id] = true;
    a.categories.forEach(function (c) { usedCats[c] = true; });
  }

  /* Deal one day: opener → main → closer. */
  function dealDay(pool, bucketByCat, usedIds, usedCats, rnd) {
    var byShort = shortest(pool, pool.length);
    var roles = [
      { role: 'opener', cands: openerCands(pool, bucketByCat),
        fallback: byShort.filter(function (a) { return a.time_max <= 20; }) },
      { role: 'main', cands: mainCands(pool), fallback: pool },
      { role: 'closer', cands: closerCands(pool, bucketByCat),
        fallback: byShort.filter(function (a) { return a.time_max <= 30; }) }
    ];
    var day = [];
    for (var i = 0; i < roles.length; i++) {
      var r = roles[i];
      var dealt = dealSlot(r.cands.length ? r.cands : pool, r.fallback, pool, usedIds, usedCats, rnd);
      if (!dealt || !dealt.a) return null;
      day.push({ role: r.role, id: dealt.a.id, reused: dealt.reused });
      markUsed(dealt.a, usedIds, usedCats);
    }
    return day;
  }

  /* Relaxation ladder for pool building: strict mode filters → allow
     repeats → drop the mode filter (age/group/time still hold).
     Warnings name exactly what loosened so the teacher trusts the page. */
  function buildKit(acts, cfgIn, bucketByCat, seed) {
    var cfg = clampCfg(cfgIn);
    var warnings = [];
    var strict = acts.filter(function (a) { return fitsKit(a, cfg); });
    var rnd = mulberry32(seed == null ? (Date.now() % 2147483647) : seed);
    var pool = shuffle(strict, rnd);

    var minSlots = cfg.days * 3;
    if (pool.length < minSlots && pool.length >= 3) {
      warnings.push('Small strict pool (' + pool.length + ' activities) — some favorites may repeat across days.');
    }
    if (pool.length < 3) {
      var lowCfg = Object.assign({}, cfg, { mode: 'low' });
      var lowPool = acts.filter(function (a) { return fitsHard(a, lowCfg) && fitsMode(a, lowCfg); });
      if (lowPool.length >= 3 && cfg.mode !== 'low') {
        pool = shuffle(lowPool, rnd);
        warnings.push('Your pantry was too tight for a full week — loosened to low-materials picks (3 items or fewer). Check the gather list.');
      } else {
        pool = shuffle(acts.filter(function (a) { return fitsHard(a, cfg); }), rnd);
        if (pool.length < 3) {
          return { cfg: cfg, seed: seed, days: [], warnings: warnings.concat(['No activities fit these filters — loosen the age band, group size, or prep mode.']) };
        }
        warnings.push('Filters were too tight — showing age/group/time fits with no prep restriction. The gather list shows what to grab.');
      }
    }

    var usedIds = {}, usedCats = {};
    var days = [];
    for (var d = 0; d < cfg.days; d++) {
      var day = dealDay(pool, bucketByCat, usedIds, usedCats, rnd);
      if (!day) {
        warnings.push('Ran out of fresh picks on day ' + (d + 1) + ' — repeats were used.');
        var freshIds = {};
        day = dealDay(pool, bucketByCat, freshIds, usedCats, rnd);
      }
      if (!day) break;
      days.push({ day: d, label: DAY_NAMES[d], slots: day });
    }
    return { cfg: cfg, seed: seed, days: days, warnings: warnings };
  }

  function fmtClock(totalMin) {
    var m = ((totalMin % 1440) + 1440) % 1440;
    var h = Math.floor(m / 60), mm = m % 60;
    var ap = h < 12 ? 'AM' : 'PM';
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap;
  }

  /* Run of show for one day: opener ~15% / main ~70% / closer ~15% of the
     session, clock times from cfg.startTime. Opener capped at 15, closer at 10. */
  function runOfShow(day, cfg) {
    var total = cfg.minutes;
    var openerMin = Math.min(15, Math.max(5, Math.round(total * 0.15)));
    var closerMin = Math.min(10, Math.max(5, Math.round(total * 0.15)));
    var mainMin = Math.max(10, total - openerMin - closerMin);
    var parts = cfg.startTime.split(':');
    var t = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    var blocks = [
      { role: 'opener', minutes: openerMin },
      { role: 'main', minutes: mainMin },
      { role: 'closer', minutes: closerMin }
    ];
    return blocks.map(function (b, i) {
      var slot = day.slots[i];
      var start = t, end = t + b.minutes;
      t = end;
      return { role: b.role, id: slot ? slot.id : null, minutes: b.minutes,
               start: fmtClock(start), end: fmtClock(end) };
    });
  }

  /* Aggregate the material checklist across the whole kit.
     have = covered by the pantry (or the activity needs none);
     gather = the exact missing items, with the days that need them. */
  function aggregateMaterials(kit, byId, pantryIds) {
    var seen = {};
    var words = pantryWords(pantryIds);
    kit.days.forEach(function (day, di) {
      day.slots.forEach(function (slot) {
        var a = byId[slot.id];
        if (!a) return;
        (a.materials || []).forEach(function (m) {
          var key = normalizeItem(m.item);
          if (!key) return;
          if (!seen[key]) {
            seen[key] = { item: m.item, days: [], have: itemCovered(m.item, words) };
          }
          if (seen[key].days.indexOf(di + 1) === -1) seen[key].days.push(di + 1);
        });
      });
    });
    var list = Object.keys(seen).map(function (k) { return seen[k]; });
    list.sort(function (x, y) {
      if (x.have !== y.have) return x.have ? -1 : 1;
      if (x.days.length !== y.days.length) return y.days.length - x.days.length;
      return x.item.localeCompare(y.item);
    });
    return list;
  }

  function dayLabel(day, i) {
    return day.label || ('Day ' + (i + 1));
  }

  function kitText(kit, byId) {
    var cfg = kit.cfg;
    var band = AGE_BANDS[cfg.ageBand] || AGE_BANDS.all;
    var lines = ['THE AFTER-SCHOOL KIT — Activity Vault',
      'Group: ' + cfg.groupSize + ' kids · ' + band.label + ' · ' + cfg.days +
      ' days · ' + cfg.minutes + ' min sessions starting ' + cfg.startTime,
      'Prep mode: ' + (MODES[cfg.mode] ? MODES[cfg.mode].label : cfg.mode), ''];
    kit.days.forEach(function (day, i) {
      lines.push('— ' + dayLabel(day, i).toUpperCase() + ' —');
      runOfShow(day, cfg).forEach(function (b) {
        var a = byId[b.id];
        var name = a ? a.name : b.id;
        var role = b.role === 'opener' ? 'Opener' : b.role === 'main' ? 'Main' : 'Closer';
        lines.push(b.start + '–' + b.end + '  ' + role + ': ' + name + ' (' + b.minutes + ' min)');
        if (a) {
          lines.push('  Steps: ' + a.steps.slice(0, 3).join(' / ') +
            (a.steps.length > 3 ? ' … (' + a.steps.length + ' total)' : ''));
          var mats = (a.materials || []).map(function (m) { return m.item; });
          lines.push('  Materials: ' + (mats.length ? mats.join('; ') : 'none'));
          if (a.safety) lines.push('  Safety: ' + a.safety);
        }
      });
      lines.push('');
    });
    var mats = aggregateMaterials(kit, byId, cfg.pantry);
    if (mats.length) {
      lines.push('MATERIAL CHECKLIST');
      mats.forEach(function (m) {
        lines.push((m.have ? '[have] ' : '[gather] ') + m.item +
          ' — day' + (m.days.length > 1 ? 's' : '') + ' ' + m.days.join(', '));
      });
    } else {
      lines.push('MATERIAL CHECKLIST: nothing needed all week.');
    }
    if (kit.warnings.length) {
      lines.push('', 'NOTES');
      kit.warnings.forEach(function (w) { lines.push('• ' + w); });
    }
    return lines.join('\n');
  }

  function encodeKit(kit) {
    var payload = {
      v: 1,
      cfg: kit.cfg,
      seed: kit.seed,
      picks: kit.days.map(function (day) {
        return day.slots.map(function (s) { return s.id; });
      })
    };
    var json = JSON.stringify(payload);
    var b64 = (typeof Buffer !== 'undefined')
      ? Buffer.from(json, 'utf8').toString('base64')
      : btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodeKit(str) {
    try {
      var b64 = String(str).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var json = (typeof Buffer !== 'undefined')
        ? Buffer.from(b64, 'base64').toString('utf8')
        : decodeURIComponent(escape(atob(b64)));
      var p = JSON.parse(json);
      if (!p || p.v !== 1 || !p.cfg || !Array.isArray(p.picks)) return null;
      var cfg = clampCfg(p.cfg);
      var days = p.picks.slice(0, cfg.days).map(function (ids, i) {
        var roles = ['opener', 'main', 'closer'];
        return {
          day: i, label: DAY_NAMES[i],
          slots: (ids || []).slice(0, 3).map(function (id, j) {
            return { role: roles[j], id: String(id), reused: false };
          })
        };
      }).filter(function (d) { return d.slots.length === 3; });
      return { cfg: cfg, seed: p.seed == null ? null : p.seed, days: days, warnings: [] };
    } catch (e) {
      return null;
    }
  }

  return {
    AGE_BANDS: AGE_BANDS,
    PANTRY: PANTRY,
    PANTRY_IDS: PANTRY_IDS,
    PANTRY_DEFAULT: PANTRY_DEFAULT,
    MODES: MODES,
    DAY_NAMES: DAY_NAMES,
    clampCfg: clampCfg,
    wordMatch: wordMatch,
    itemCovered: itemCovered,
    materialFit: materialFit,
    normalizeItem: normalizeItem,
    fitsHard: fitsHard,
    fitsMode: fitsMode,
    fitsKit: fitsKit,
    openerCands: openerCands,
    closerCands: closerCands,
    mainCands: mainCands,
    buildKit: buildKit,
    runOfShow: runOfShow,
    aggregateMaterials: aggregateMaterials,
    kitText: kitText,
    encodeKit: encodeKit,
    decodeKit: decodeKit,
    fmtClock: fmtClock
  };
});
