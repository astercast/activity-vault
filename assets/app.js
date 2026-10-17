/* Activity Vault, filter browser.
   Fetches data/activities.json + data/categories.json + data/v1/filters.json,
   renders filterable card grid. Age bounds come from filters.json (QA-011). */
(function () {
  'use strict';

  var state = {
    activities: [],
    categories: [],
    catMap: {},
    q: '',
    age: null,          // selected age (activity matches if age range overlaps)
    maxTime: null,      // minutes available (activity matches if time_min <= maxTime)
    group: null,        // group size (activity matches if range overlaps)
    cats: new Set(),    // selected category ids
    tags: new Set(),    // selected season/occasion tags (activity matches if it has ANY)
    noPrepOnly: false,
    indoorOnly: false,
    outdoorOnly: false,
    copyFreeOnly: false,  // wave 14 scope-up: only activities verified copy-free (zero printing)
    noElimOnly: false,    // wave 14 scope-up: only no-elimination activities
    sortByRating: false, // sort by the visitor's OWN ratings (localStorage)
    topTen: false,       // "My top 10": rated-only, top 10 by own stars
    ageMin: null,        // QA-011: derived in init() from data/v1/filters.json
    ageMax: null         // (fallback: true span of the loaded activities)
  };

  function myRating(a) {
    var R = window.VaultRatings;
    return R ? R.getRating(a.id) : null;
  }

  function applyRatingView(sort, top) {
    state.sortByRating = !!sort;
    state.topTen = !!top;
    if (sortChipBtn) sortChipBtn.setAttribute('aria-pressed', state.sortByRating ? 'true' : 'false');
    if (topTenBtn) topTenBtn.setAttribute('aria-pressed', state.topTen ? 'true' : 'false');
    render();
  }

  var TAG_LABELS = {
    'season:fall': 'Fall',
    'season:winter': 'Winter',
    'season:spring': 'Spring',
    'season:summer': 'Summer',
    'holiday:halloween': 'Halloween',
    'holiday:thanksgiving': 'Thanksgiving',
    'holiday:dia-de-muertos': 'Día de los Muertos',
    'holiday:christmas': 'Christmas',
    'holiday:hanukkah': 'Hanukkah',
    'holiday:kwanzaa': 'Kwanzaa',
    'holiday:new-year': 'New Year',
    'holiday:easter': 'Easter',
    'holiday:earth-day': 'Earth Day',
    'holiday:july-4th': 'July 4th',
    'holiday:mlk-day': 'MLK Day',
    'holiday:valentines-day': "Valentine's Day",
    'holiday:lunar-new-year': 'Lunar New Year',
    'holiday:st-patricks-day': "St. Patrick's Day",
    'holiday:diwali': 'Diwali',
    'holiday:indigenous-peoples-day': "Indigenous Peoples' Day",
    'theme:spooky': 'Spooky (not scary)'
  };
  var TAG_ORDER = ['season:fall', 'season:winter', 'season:spring', 'season:summer', 'holiday:halloween', 'holiday:thanksgiving', 'holiday:dia-de-muertos',
                   'holiday:christmas', 'holiday:hanukkah', 'holiday:kwanzaa', 'holiday:new-year',
                   'holiday:easter', 'holiday:earth-day', 'holiday:july-4th',
                   'holiday:mlk-day', 'holiday:valentines-day', 'holiday:lunar-new-year',
                   'holiday:st-patricks-day', 'holiday:diwali', 'holiday:indigenous-peoples-day',
                   'theme:spooky'];

  var grid, countEl, searchInput, sortChipBtn, topTenBtn;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function matches(a) {
    if (state.age != null && (a.age_min > state.age || a.age_max < state.age)) return false;
    if (state.maxTime != null && a.time_min > state.maxTime) return false;
    if (state.group != null && (a.group_min > state.group || a.group_max < state.group)) return false;
    if (state.cats.size && !a.categories.some(function (c) { return state.cats.has(c); })) return false;
    if (state.tags.size && !(a.tags || []).some(function (t) { return state.tags.has(t); })) return false;
    if (state.noPrepOnly && !a.no_prep) return false;
    if (state.indoorOnly && a.location.indexOf('indoor') === -1) return false;
    if (state.outdoorOnly && a.location.indexOf('outdoor') === -1) return false;
    if (state.copyFreeOnly && !a.copy_free) return false;
    if (state.noElimOnly && !a.no_elimination) return false;
    if (state.q) {
      var hay = (a.name + ' ' + a.tagline + ' ' +
        a.materials.map(function (m) { return m.item; }).join(' ') + ' ' +
        a.steps.join(' ')).toLowerCase();
      if (hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }

  function primaryCat(a) {
    return state.catMap[a.categories[0]] || { color: '#b7413c', name: '', glyph: '' };
  }

  /* Rotation 21 (ACTIVITY-STUDY 4.2): every listing is a ruled row with
     a four-fact tombstone in Tate's fixed order: name; age band; time;
     materials count or the word none. The one-word action tag sits in a
     fixed position at the row's head (the Tate contract). No card grid. */
  var ACTION_BY_CAT = {
    'crafts': 'Make', 'stem': 'Learn', 'pe-movement': 'Play',
    'holidays': 'Celebrate', 'quiet-focus': 'Calm', 'seasons': 'Explore',
    'team-community': 'Gather', 'icebreakers': 'Meet', 'outdoor': 'Wander',
    'rainy-day': 'Play', 'music-rhythm': 'Listen'
  };

  function renderCard(a) {
    var cat = primaryCat(a);
    var row = el('article', 'activity-row act-row');
    row.style.setProperty('--cat', cat.color);

    var action = ACTION_BY_CAT[a.categories[0]] || 'Open';
    row.appendChild(el('span', 'action-tag', action));

    // PRO REWORK 2026-10-15: a pictured record carries its plate into the
    // listing, so the browse reads photo-led like the records themselves.
    // An unpictured record keeps the plain typographic row (designed
    // absence, never a filler image).
    if (a.photo && a.photo.file) {
      var th = el('span', 'row-thumb');
      var im = document.createElement('img');
      im.src = 'assets/photos/' + a.photo.file;
      im.alt = '';
      im.loading = 'lazy';
      im.decoding = 'async';
      th.appendChild(im);
      row.appendChild(th);
      row.classList.add('has-thumb');
    }

    var h = el('h3');
    var link = el('a', null, a.name);
    link.href = 'activity/' + a.id + '.html';
    h.appendChild(link);
    row.appendChild(h);

    var mats = a.materials && a.materials.length
      ? a.materials.length + (a.materials.length === 1 ? ' material' : ' materials')
      : 'no materials';
    var tomb = el('p', 'tombstone');
    tomb.appendChild(el('span', 'tomb-fact', 'Ages ' + a.age_min + '\u2013' + a.age_max));
    tomb.appendChild(el('span', 'tomb-sep', ' \u00b7 '));
    tomb.appendChild(el('span', 'tomb-fact', a.time_min + '\u2013' + a.time_max + ' min'));
    tomb.appendChild(el('span', 'tomb-sep', ' \u00b7 '));
    tomb.appendChild(el('span', 'tomb-fact', mats));
    row.appendChild(tomb);

    // The visitor's OWN rating: never an aggregate; no community ratings.
    var mine = myRating(a);
    if (mine) {
      row.appendChild(el('span', 'rate-badge', mine.stars + ' \u2605, your rating'));
    } else if (state.sortByRating || state.topTen) {
      row.appendChild(el('span', 'rate-badge unrated', 'Not rated yet'));
    }

    return row;
  }

  function metaItem(label, value) {
    var s = el('span', null, '');
    s.innerHTML = label + ' <b></b>';
    s.querySelector('b').textContent = value;
    return s;
  }

  function anyFilterActive() {
    return !!(state.q || state.age != null || state.maxTime != null || state.group != null ||
      state.cats.size || state.tags.size || state.noPrepOnly || state.indoorOnly ||
      state.outdoorOnly || state.copyFreeOnly || state.noElimOnly ||
      state.sortByRating || state.topTen);
  }

  function render() {
    // CRITIC-001 fix 2 (R47): the homepage is a door, not a dump. With no
    // search or filter chosen, show the door state (counts + the way in)
    // instead of pouring all 747 records onto the page. The full vault
    // renders the moment a visitor searches or picks any filter, and
    // every category/contents link above arrives with a filter set.
    if (!anyFilterActive()) {
      grid.innerHTML = '';
      state.visible = [];
      var door = el('div', 'empty');
      door.innerHTML = '<span class="big" aria-hidden="true">§</span>' +
        '<p><strong>' + state.activities.length + ' activities in the vault.</strong></p>' +
        '<p>Search by name, material or keyword, or pick a category, age or season on the left. ' +
        'The vault opens the moment you choose. Browsing shelf by shelf? ' +
        '<a href="desk.html">The Desk</a> walks the categories one drawer at a time.</p>';
      grid.appendChild(door);
      if (countEl) countEl.textContent = state.activities.length + ' activities · search or filter to browse them';
      return;
    }
    var list = state.activities.filter(matches);
    var ratingMode = state.sortByRating || state.topTen;
    if (state.topTen) {
      // "My top 10": only activities the visitor rated, best stars first.
      list = list.filter(function (a) { return myRating(a); });
      list.sort(function (x, y) {
        return (myRating(y).stars - myRating(x).stars) ||
               (x.name < y.name ? -1 : (x.name > y.name ? 1 : 0));
      });
      list = list.slice(0, 10);
    } else if (state.sortByRating) {
      // Rated first (best stars first), unrated last, clearly marked.
      list.sort(function (x, y) {
        var rx = myRating(x), ry = myRating(y);
        return ((ry ? ry.stars : -1) - (rx ? rx.stars : -1)) ||
               (x.name < y.name ? -1 : (x.name > y.name ? 1 : 0));
      });
    }
    state.visible = list;
    grid.innerHTML = '';
    if (ratingMode) {
      var note = el('div', 'top-rated-note');
      note.innerHTML = '<strong>★ ' + (state.topTen ? 'Your top 10' : 'Sorted by your ratings') +
        '.</strong> These are <em>your</em> ratings, stored only in this browser. ' +
        'Activity Vault has no community ratings, so nothing here is an average or a "top" voted by others.';
      grid.appendChild(note);
    }
    if (!list.length) {
      var empty = el('div', 'empty');
      if (state.topTen) {
        empty.innerHTML = '<span class="big" aria-hidden="true">★</span>' +
          '<p><strong>No ratings yet.</strong></p>' +
          '<p>Open any activity card and give it 1–5 stars. Your top 10 will appear here.</p>';
      } else {
        empty.innerHTML = '<span class="big" aria-hidden="true">§</span><p><strong>The drawer came up empty.</strong></p><p>Nothing in the vault matches that exact combination, loosen a filter or two and dig again. The good stuff is in here somewhere.</p>';
      }
      grid.appendChild(empty);
    } else {
      list.forEach(function (a) {
        grid.appendChild(renderCard(a));
      });
    }
    countEl.textContent = list.length + (list.length === 1 ? ' activity' : ' activities');
  }

  // ---------- share a collection ----------
  function cardUrl(rel) {
    try { return new URL(rel, document.baseURI).href; }
    catch (e) { return rel; }
  }

  function describeFilters() {
    var bits = [];
    if (state.topTen) bits.push('⭐ your top 10 rated');
    else if (state.sortByRating) bits.push('sorted by your ratings');
    if (state.q) bits.push('search "' + state.q + '"');
    if (state.age != null) bits.push('age ' + state.age);
    if (state.maxTime != null) bits.push('≤ ' + state.maxTime + ' min');
    if (state.group != null) bits.push('group of ' + state.group);
    if (state.cats.size) bits.push('categories: ' + Array.from(state.cats).map(function (c) {
      return (state.catMap[c] || {}).name || c;
    }).join(', '));
    if (state.tags.size) bits.push('season/occasion: ' + Array.from(state.tags).map(function (t) {
      return TAG_LABELS[t] || t;
    }).join(', '));
    if (state.noPrepOnly) bits.push('no-prep only');
    if (state.indoorOnly) bits.push('indoor only');
    if (state.outdoorOnly) bits.push('outdoor only');
    return bits;
  }

  // Deep link for the current view: a single-tag collection gets index.html?tag=;
  // richer filter mixes point at the browse page plus a filter description.
  function viewUrl() {
    var bits = describeFilters();
    if (state.topTen) {
      // True deep link for "My top 10" (ratings live in the visitor's browser).
      return cardUrl('index.html?view=top-rated');
    }
    if (state.tags.size === 1 && bits.length === 1 && bits[0].indexOf('season/occasion:') === 0) {
      return cardUrl('index.html?tag=' + encodeURIComponent(Array.from(state.tags)[0]));
    }
    return cardUrl('index.html');
  }

  function copyText(text, statusEl) {
    function ok() {
      statusEl.textContent = 'Copied. Paste it into an email or newsletter.';
      setTimeout(function () { statusEl.textContent = ''; }, 2500);
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try { document.execCommand('copy'); ok(); }
      catch (e) { statusEl.textContent = 'Copy failed, select the text manually.'; }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else { fallback(); }
  }

  function copyCollection() {
    // Door state (no search or filter yet): there is no list on screen to
    // copy, so say the step in plain words instead of copying an empty
    // list under an "all activities" title (R100, ruling 10: the share
    // surface carries no gated or mystery step).
    if (!anyFilterActive()) {
      var doorStatus = document.getElementById('copy-collection-status');
      if (doorStatus) doorStatus.textContent = 'Search or pick a category first, then this copies the list you are looking at.';
      return;
    }
    var list = state.visible || [];
    var bits = describeFilters();
    var title = bits.length
? '🗂️ Activity Vault collection, ' + bits.join(' · ')
: '🗂️ Activity Vault collection, all activities';
    var lines = [title, ''];
    if (list.length) {
      list.forEach(function (a) {
        lines.push('• ' + a.name + ', Ages ' + a.age_min + '–' + a.age_max + ', ' +
          a.time_min + '–' + a.time_max + ' min');
        lines.push('  ' + cardUrl('activity/' + a.id + '.html'));
      });
    } else {
      lines.push('No activities match these filters right now.');
    }
    lines.push('');
    lines.push('View it: ' + viewUrl());
    lines.push('Paste this into your newsletter or email. Every link opens the right activity card.');
    copyText(lines.join('\n'), document.getElementById('copy-collection-status'));
  }

  function chipButton(label, pressed, onToggle, color) {
    var b = el('button', 'chip', label);
    b.type = 'button';
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    if (color) b.style.setProperty('--cat', color);
    b.addEventListener('click', function () {
      var next = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', next ? 'true' : 'false');
      onToggle(next);
      render();
    });
    return b;
  }

  function buildFilters() {
    var host = document.getElementById('filters');
    if (!host) return;

    // search: the keyword box is static HTML in the form (VP-0046,
    // rotation 30) so the Search label always has its box under it,
    // with or without scripts. Adopt it when present; build it only
    // as a fallback for a page that lacks one.
    var t;
    function wireSearch() {
      searchInput.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () {
          state.q = searchInput.value.trim().toLowerCase();
          render();
        }, 150);
      });
    }
    searchInput = document.getElementById('q');
    if (searchInput) {
      wireSearch();
    } else {
      var g = el('div', 'filter-group');
      g.appendChild(el('label', 'flabel', 'Search'));
      searchInput = el('input');
      searchInput.type = 'search';
      searchInput.placeholder = 'Name, material, keyword…';
      searchInput.setAttribute('aria-label', 'Search activities');
      wireSearch();
      g.appendChild(searchInput);
      host.appendChild(g);
    }

    // categories
    var cg = el('div', 'filter-group');
    cg.appendChild(el('span', 'flabel', 'Category'));
    var row = el('div', 'chip-row');
    state.categories.forEach(function (c) {
      // PRO REWORK 2026-10-15: the category speaks in its colour (a dot,
      // the same device as the record chips), not an emoji glyph.
      var cb = chipButton(c.name, false, function (on) {
        if (on) state.cats.add(c.id); else state.cats.delete(c.id);
      }, c.color);
      var dot = el('span', 'chip-dot');
      dot.setAttribute('aria-hidden', 'true');
      cb.insertBefore(dot, cb.firstChild);
      cb.classList.add('folder-tab');
      cb.setAttribute('data-cat', c.id);
      row.appendChild(cb);
    });
    cg.appendChild(row);
    host.appendChild(cg);

    // season / occasion tags
    var tagg = el('div', 'filter-group');
    tagg.appendChild(el('span', 'flabel', 'Season / occasion'));
    var tagrow = el('div', 'chip-row');
    TAG_ORDER.forEach(function (t) {
      var tb = chipButton(TAG_LABELS[t], false, function (on) {
        if (on) state.tags.add(t); else state.tags.delete(t);
      }, '#b7413c');
      tb.setAttribute('data-tag', t);
      tagrow.appendChild(tb);
    });
    tagg.appendChild(tagrow);
    host.appendChild(tagg);

    // age
    var ag = el('div', 'filter-group');
    ag.appendChild(el('label', 'flabel', 'Age'));
    var ageWrap = el('div');
    var ageRange = el('input'); ageRange.type = 'range';
    // QA-011: bounds are NOT literals here. They are set in init() from
    // data/v1/filters.json (filters.age), the same source as the published
    // declaration, with the loaded activities' true span as fallback.
    // Deriving again from activities here covers any init() edge case.
    var ageLo = state.ageMin, ageHi = state.ageMax;
    if (ageLo == null || ageHi == null) {
      ageLo = Math.min.apply(null, state.activities.map(function (a) { return a.age_min; }));
      ageHi = Math.max.apply(null, state.activities.map(function (a) { return a.age_max; }));
    }
    var ageDefault = Math.min(Math.max(9, ageLo), ageHi);
    ageRange.min = String(ageLo); ageRange.max = String(ageHi); ageRange.value = String(ageDefault);
    ageRange.setAttribute('aria-label', 'Age of kids');
    var ageOut = el('div', null, 'Age ' + ageDefault);
    ageOut.style.fontWeight = '700';
    var ageOn = false;
    var ageToggle = chipButton('Filter by age', false, function (on) {
      ageOn = on;
      state.age = on ? parseInt(ageRange.value, 10) : null;
    });
    ageRange.addEventListener('input', function () {
      ageOut.textContent = 'Age ' + ageRange.value;
      if (ageOn) { state.age = parseInt(ageRange.value, 10); render(); }
    });
    ageWrap.appendChild(ageToggle); ageWrap.appendChild(ageRange); ageWrap.appendChild(ageOut);
    ag.appendChild(ageWrap);
    host.appendChild(ag);

    // time
    var tg = el('div', 'filter-group');
    tg.appendChild(el('label', 'flabel', 'Time available'));
    var tsel = el('select');
    tsel.setAttribute('aria-label', 'Time available in minutes');
    [['Any time', ''], ['15 min', '15'], ['20 min', '20'], ['30 min', '30'], ['45 min', '45'], ['60+ min', '60']]
      .forEach(function (o) {
        var opt = el('option', null, o[0]); opt.value = o[1]; tsel.appendChild(opt);
      });
    tsel.addEventListener('change', function () {
      state.maxTime = tsel.value ? parseInt(tsel.value, 10) : null;
      render();
    });
    tg.appendChild(tsel);
    host.appendChild(tg);

    // group size
    var gg = el('div', 'filter-group');
    gg.appendChild(el('label', 'flabel', 'Group size'));
    var gsel = el('select');
    gsel.setAttribute('aria-label', 'Number of kids');
    [['Any size', ''], ['Small (2–8)', '8'], ['Medium (9–16)', '16'], ['Large (17–25)', '25'], ['Huge (26+)', '40']]
      .forEach(function (o) {
        var opt = el('option', null, o[0]); opt.value = o[1]; gsel.appendChild(opt);
      });
    gsel.addEventListener('change', function () {
      state.group = gsel.value ? parseInt(gsel.value, 10) : null;
      render();
    });
    gg.appendChild(gsel);
    host.appendChild(gg);

    // toggles
    var og = el('div', 'filter-group');
    og.appendChild(el('span', 'flabel', 'Quick filters'));
    [['✓ Only no-prep', function (on) { state.noPrepOnly = on; }],
     ['⌂ Indoor only', function (on) { state.indoorOnly = on; if (on) { state.outdoorOnly = false; syncOutdoor(); } }],
     ['🌳 Outdoor only', function (on) { state.outdoorOnly = on; if (on) { state.indoorOnly = false; syncIndoor(); } }],
     ['🖨️ Copy-free only', function (on) { state.copyFreeOnly = on; }],
     ['♾️ No-elimination only', function (on) { state.noElimOnly = on; }]
    ].forEach(function (pair, idx) {
      var b = chipButton(pair[0], false, function (on) { pair[1](on); });
      b.dataset.toggleIdx = idx;
      og.appendChild(b);
    });
    function syncIndoor() {
      var b = og.querySelector('[data-toggle-idx="1"]');
      if (b) b.setAttribute('aria-pressed', 'false');
    }
    function syncOutdoor() {
      var b = og.querySelector('[data-toggle-idx="2"]');
      if (b) b.setAttribute('aria-pressed', 'false');
    }
    host.appendChild(og);

    // your ratings (localStorage only, never aggregated, never shared)
    var rtg = el('div', 'filter-group');
    rtg.appendChild(el('span', 'flabel', 'Your ratings'));
    var rtHint = el('p', 'rate-privacy',
      'Stars you gave on activity cards, stored only in this browser. No community ratings exist.');
    rtg.appendChild(rtHint);
    sortChipBtn = chipButton('⭐ Sort by my rating', false, function (on) {
      state.sortByRating = on;
      if (!on) applyRatingView(false, false);
    });
    rtg.appendChild(sortChipBtn);
    topTenBtn = el('button', 'chip', '⭐ My top 10');
    topTenBtn.type = 'button';
    topTenBtn.setAttribute('aria-pressed', 'false');
    topTenBtn.addEventListener('click', function () {
      var next = topTenBtn.getAttribute('aria-pressed') !== 'true';
      applyRatingView(next, next);
    });
    rtg.appendChild(topTenBtn);
    host.appendChild(rtg);

    // reset
    var reset = el('button', 'btn btn-ghost btn-reset', 'Reset all filters');
    reset.type = 'button';
    reset.addEventListener('click', function () {
      state.q = ''; state.age = null; state.maxTime = null; state.group = null;
      state.cats.clear(); state.tags.clear();
      state.noPrepOnly = false; state.indoorOnly = false; state.outdoorOnly = false;
      state.copyFreeOnly = false; state.noElimOnly = false;
      state.sortByRating = false; state.topTen = false;
      searchInput.value = ''; tsel.value = ''; gsel.value = '';
      host.querySelectorAll('[aria-pressed]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      render();
    });
    host.appendChild(reset);
  }

  function init() {
    grid = document.getElementById('cards');
    countEl = document.getElementById('result-count');
    if (!grid) return;
    Promise.all([
      fetch('data/activities.json').then(function (r) { return r.json(); }),
      fetch('data/categories.json').then(function (r) { return r.json(); }),
      // QA-011: the published filter declaration is the source of truth for
      // the Age control's bounds. A failed fetch must not break the browser:
      // resolve to null and fall back to the activities' true span below.
      fetch('data/v1/filters.json').then(function (r) {
        if (!r.ok) throw new Error('filters fetch failed');
        return r.json();
      }).catch(function () { return null; })
    ]).then(function (res) {
      state.activities = res[0];
      state.categories = res[1];
      // QA-011: derive Age bounds from filters.json; fallback = true span.
      var declaredAge = res[2] && res[2].filters && res[2].filters.age;
      if (declaredAge && typeof declaredAge.min === 'number' && typeof declaredAge.max === 'number') {
        state.ageMin = declaredAge.min;
        state.ageMax = declaredAge.max;
      } else {
        state.ageMin = Math.min.apply(null, state.activities.map(function (a) { return a.age_min; }));
        state.ageMax = Math.max.apply(null, state.activities.map(function (a) { return a.age_max; }));
      }
      res[1].forEach(function (c) { state.catMap[c.id] = c; });
      var statActs = document.getElementById('stat-activities');
      var statCats = document.getElementById('stat-categories');
      var statPrep = document.getElementById('stat-noprep');
      if (statActs) statActs.textContent = state.activities.length;
      if (statCats) statCats.textContent = state.categories.length;
      if (statPrep) statPrep.textContent = state.activities.filter(function (a) { return a.no_prep; }).length;
      // The curator's note: a sticky note with opinions. Clicking cycles through
      // them, the human-made easter egg (makeover wave 22).
      var noteBtn = document.getElementById('curator-note');
      var noteText = document.getElementById('curator-note-text');
      if (noteBtn && noteText) {
        var notes = [
          'everything\u2019s filed & ready, grab a card ↓',
          'if you only try one thing this week: make it the noise parade. trust me.',
          'psst. The sub tub has saved more mondays than coffee.',
          'hot take: the best STEM demos use trash. fight me. (kitchen trash. calm down.)'
        ];
        var ni = 0;
        noteBtn.addEventListener('click', function () {
          ni = (ni + 1) % notes.length;
          noteText.textContent = notes[ni];
        });
      }
      buildFilters();
      //?view=top-rated deep link (My top 10. Ratings live in the visitor's browser)
      try {
        var qtag = new URLSearchParams(window.location.search).get('tag');
        if (qtag && TAG_ORDER.indexOf(qtag) !== -1) {
          state.tags.add(qtag);
          var tbtn = document.querySelector('[data-tag="' + qtag + '"]');
          if (tbtn) tbtn.setAttribute('aria-pressed', 'true');
        }
        var qview = new URLSearchParams(window.location.search).get('view');
        if (qview === 'top-rated') applyRatingView(true, true);
        // ?cats= deep link (wave 14 nav audit): preselect category chips from hub links
        var qcats = new URLSearchParams(window.location.search).get('cats');
        if (qcats) {
          qcats.split(',').forEach(function (cid) {
            cid = cid.trim();
            if (cid && state.catMap[cid] && !state.cats.has(cid)) {
              state.cats.add(cid);
              var cbtn = document.querySelector('[data-cat="' + cid + '"]');
              if (cbtn) cbtn.setAttribute('aria-pressed', 'true');
            }
          });
        }
      } catch (e) { /* malformed query string, ignore */ }
      // "/" focuses search from anywhere (wave 14 nav audit)
      document.addEventListener('keydown', function (e) {
        if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '')) {
          e.preventDefault();
          if (searchInput) searchInput.focus();
        }
      });
      render();
      var copyBtn = document.getElementById('copy-collection');
      if (copyBtn) copyBtn.addEventListener('click', copyCollection);
    }).catch(function () {
      grid.innerHTML = '<div class="empty"><p><strong>Could not load the activity library.</strong></p><p>Check your connection and reload.</p></div>';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
