/* Activity Vault, personal ratings library (shared).
 *
 * Ratings live ONLY in this browser, in localStorage under
 * "activityvault.ratings.v1". There are no accounts, no servers, no
 * community ratings. Every "star" on this site is the visitor's own.
 * Never present a rating as an aggregate, average, or someone else's.
 *
 * localStorage shape:
 *   { "<activity-id>": {
 *       "stars": 1..5,
 *       "note": "one-line note (string, may be empty)",
 *       "reflections": { "change": "...", "age_band": "...", "again": "..." },
 *       "ratedAt": "ISO-8601 timestamp"
 *   } }
 */
(function () {
  'use strict';

  var KEY = 'activityvault.ratings.v1';
  var ID_RE = /^[a-z0-9-]+$/;

  var REFLECTIONS = [
    { id: 'change',   label: 'What would you change next time?' },
    { id: 'age_band', label: 'Which age band shone the most?' },
    { id: 'again',    label: 'Would you run it again? (yes / with tweaks / no)' }
  ];

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return {};
      // Sanitize: keep only well-formed entries for valid ids.
      var clean = {};
      Object.keys(parsed).forEach(function (id) {
        var e = parsed[id];
        if (!ID_RE.test(id) || !e || typeof e !== 'object') return;
        var stars = parseInt(e.stars, 10);
        if (!(stars >= 1 && stars <= 5)) return;
        clean[id] = {
          stars: stars,
          note: typeof e.note === 'string' ? e.note.slice(0, 140) : '',
          reflections: (e.reflections && typeof e.reflections === 'object') ? {
            change: typeof e.reflections.change === 'string' ? e.reflections.change.slice(0, 280) : '',
            age_band: typeof e.reflections.age_band === 'string' ? e.reflections.age_band.slice(0, 280) : '',
            again: typeof e.reflections.again === 'string' ? e.reflections.again.slice(0, 280) : ''
          } : { change: '', age_band: '', again: '' },
          ratedAt: typeof e.ratedAt === 'string' ? e.ratedAt : null
        };
      });
      return clean;
    } catch (err) {
      return {};
    }
  }

  function save(all) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(all));
      return true;
    } catch (err) {
      return false;
    }
  }

  function getRating(id) {
    if (!ID_RE.test(id || '')) return null;
    var all = load();
    return all[id] || null;
  }

  function setRating(id, entry) {
    if (!ID_RE.test(id || '')) return false;
    var stars = parseInt(entry && entry.stars, 10);
    if (!(stars >= 1 && stars <= 5)) return false;
    var all = load();
    all[id] = {
      stars: stars,
      note: (entry.note || '').slice(0, 140),
      reflections: {
        change: (entry.reflections && entry.reflections.change || '').slice(0, 280),
        age_band: (entry.reflections && entry.reflections.age_band || '').slice(0, 280),
        again: (entry.reflections && entry.reflections.again || '').slice(0, 280)
      },
      ratedAt: new Date().toISOString()
    };
    return save(all);
  }

  function clearRating(id) {
    if (!ID_RE.test(id || '')) return false;
    var all = load();
    if (!all[id]) return true;
    delete all[id];
    return save(all);
  }

  // Rated activity ids sorted by stars desc (stable by id). Unrated never appear.
  function topRated(limit) {
    var all = load();
    var ids = Object.keys(all).sort(function (a, b) {
      return (all[b].stars - all[a].stars) || (a < b ? -1 : 1);
    });
    if (limit) ids = ids.slice(0, limit);
    return ids.map(function (id) { return { id: id, entry: all[id] }; });
  }

  function countRated() {
    return Object.keys(load()).length;
  }

  function starsText(stars) {
    return stars >= 1 && stars <= 5 ? '★'.repeat(stars) + '☆'.repeat(5 - stars) : '';
  }

  window.VaultRatings = {
    KEY: KEY,
    REFLECTIONS: REFLECTIONS,
    getRating: getRating,
    setRating: setRating,
    clearRating: clearRating,
    topRated: topRated,
    countRated: countRated,
    starsText: starsText
  };
})();
