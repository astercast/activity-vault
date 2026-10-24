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
    kitMax: null,       // kit to gather (activity matches if its materials count <= kitMax)
    longMin: null,      // can run for (activity matches if its longest run time_max >= longMin)
    stretchMin: null,   // can stretch by (activity matches if its run window time_max - time_min >= stretchMin)
    flexMin: null,      // can flex by (activity matches if its group window group_max - group_min >= flexMin)
    spanMin: null,      // can span by (activity matches if its age window age_max - age_min >= spanMin)
    startMax: null,     // starts at (activity matches if its youngest age age_min <= startMax)
    endMin: null,       // ends at (activity matches if its oldest age age_max >= endMin)
    floorMax: null,     // starts with (activity matches if its smallest group group_min <= floorMax)
    ceilingMin: null,   // fits (activity matches if its largest group group_max >= ceilingMin)
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
    if (state.kitMax != null && a.materials.length > state.kitMax) return false;
    if (state.longMin != null && a.time_max < state.longMin) return false;
    if (state.stretchMin != null && (a.time_max - a.time_min) < state.stretchMin) return false;
    if (state.flexMin != null && (a.group_max - a.group_min) < state.flexMin) return false;
    if (state.spanMin != null && (a.age_max - a.age_min) < state.spanMin) return false;
    if (state.startMax != null && a.age_min > state.startMax) return false;
    if (state.endMin != null && a.age_max < state.endMin) return false;
    if (state.floorMax != null && a.group_min > state.floorMax) return false;
    if (state.ceilingMin != null && a.group_max < state.ceilingMin) return false;
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

  function sourceName(url) {
    // R110: the source label grammar mirrors scripts/build.py (detail page):
    // Wikipedia -> "Wikipedia"; anything else -> "source post at <host>".
    try {
      var host = new URL(url, 'https://example.org').hostname.replace(/^www\./, '');
      if (host.indexOf('wikipedia.org') !== -1) return 'Wikipedia';
      return 'source post at ' + host;
    } catch (e) { return 'source'; }
  }

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
    } else {
      // Round 2 (Claude consult 2026-10-24): honest empty state, per
      // the extract. An unpictured record says so instead of looking
      // finished. (Deviation from the extract's paste: its comment
      // above this block called the plain row a designed absence; the
      // consult's own verdict overrules that, so the state is shown.)
      var ph = el('span', 'row-thumb row-thumb--empty');
      ph.setAttribute('aria-hidden', 'true');
      ph.appendChild(el('span', null, 'No photo yet'));
      row.appendChild(ph);
      row.classList.add('has-thumb');
    }

    var h = el('h3');
    var link = el('a', null, a.name);
    link.href = 'activity/' + a.id + '.html';
    h.appendChild(link);
    row.appendChild(h);

    // R110 (ruling 10(c)): verdict-led index rows. The tagline is the row's
    // reason-to-care line — it leads on its own ledger line, the tombstone
    // facts follow. Trust is printed on the card: a sourced record names its
    // source here, not only at the bottom of its detail page.
    // (Infatuation #1, Wirecutter #1, R293 #1, R292 #2, R294 #4, R295 #2.)
    if (a.tagline) {
      var verdict = el('p', 'tagline', a.tagline);
      if (a.source) {
        verdict.appendChild(document.createTextNode(' '));
        var prov = el('span', 'row-src');
        prov.appendChild(document.createTextNode('\u00B7 Source: '));
        var sl = document.createElement('a');
        sl.href = a.source;
        sl.rel = 'noopener';
        sl.textContent = sourceName(a.source);
        prov.appendChild(sl);
        verdict.appendChild(prov);
      } else {
        // Round 2: same honesty for the source. The extract's paste
        // targeted a verdict element that only exists inside this
        // tagline block, so the else sits here, not after it.
        verdict.appendChild(document.createTextNode(' '));
        verdict.appendChild(el('span', 'row-src row-src--none', ' \u00B7 Source: not listed yet'));
      }
      row.appendChild(verdict);
    }

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
    return !!(state.q || state.age != null || state.maxTime != null || state.group != null || state.kitMax != null || state.longMin != null || state.stretchMin != null || state.flexMin != null || state.spanMin != null || state.startMax != null || state.endMin != null || state.floorMax != null || state.ceilingMin != null ||
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
    if (state.kitMax != null) bits.push(state.kitMax === 0 ? 'nothing to gather' : 'kit: ' + state.kitMax + ' things or fewer');
    if (state.longMin != null) bits.push('runs ' + state.longMin + ' minutes or more');
    if (state.stretchMin != null) bits.push('stretches ' + state.stretchMin + ' minutes or more');
    if (state.flexMin != null) bits.push('flexes ' + state.flexMin + ' kids or more');
    if (state.spanMin != null) bits.push('spans ' + state.spanMin + ' years or more');
    if (state.startMax != null) bits.push('starts at ' + state.startMax + ' or younger');
    if (state.endMin != null) bits.push('ends at ' + state.endMin + ' or older');
    if (state.floorMax != null) bits.push('starts with ' + state.floorMax + ' or fewer');
    if (state.ceilingMin != null) bits.push('fits ' + state.ceilingMin + ' or more');
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
    var ageRange = el('input'); ageRange.type = 'range'; ageRange.id = 'age-range';
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
    var ageOut = el('div', null, 'Age ' + ageDefault); ageOut.id = 'age-out';
    ageOut.style.fontWeight = '700';
    var ageOn = false;
    var ageToggle = chipButton('Filter by age', false, function (on) {
      ageOn = on;
      state.age = on ? parseInt(ageRange.value, 10) : null;
    });
    ageToggle.id = 'age-toggle';
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
    tsel.id = 'time-select';
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
    gsel.id = 'group-select';
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

    // kit to gather (R120 headline): the materials-count twin of the
    // time / group selects. Matches on the activity's own materials
    // list length, exactly what the home page's By kit shelves count.
    var kg = el('div', 'filter-group');
    kg.appendChild(el('label', 'flabel', 'Kit to gather'));
    var ksel = el('select');
    ksel.id = 'kit-select';
    ksel.setAttribute('aria-label', 'Most things you can gather');
    [['Any kit', ''], ['Nothing to gather', '0'], ['Up to 2 things', '2'], ['Up to 3 things', '3'], ['Up to 5 things', '5']]
      .forEach(function (o) {
        var opt = el('option', null, o[0]); opt.value = o[1]; ksel.appendChild(opt);
      });
    ksel.addEventListener('change', function () {
      state.kitMax = ksel.value ? parseInt(ksel.value, 10) : null;
      render();
    });
    kg.appendChild(ksel);
    host.appendChild(kg);

    // can run for (R121 headline): the longest-run twin of the time
    // select. Matches on the activity's own longest run (time_max),
    // exactly what the home page's By length shelves count.
    var lg = el('div', 'filter-group');
    lg.appendChild(el('label', 'flabel', 'Can run for'));
    var lsel = el('select');
    lsel.id = 'length-select';
    lsel.setAttribute('aria-label', 'Shortest long run you need');
    [['Any length', ''], ['30 minutes or more', '30'], ['45 minutes or more', '45'], ['An hour or more', '60']]
      .forEach(function (o) {
        var opt = el('option', null, o[0]); opt.value = o[1]; lsel.appendChild(opt);
      });
    lsel.addEventListener('change', function () {
      state.longMin = lsel.value ? parseInt(lsel.value, 10) : null;
      render();
    });
    lg.appendChild(lsel);
    host.appendChild(lg);

    // can stretch by (R122 headline): the run-window twin of the time
    // and length selects. Matches on the window between the activity's
    // own shortest and longest run (time_max - time_min), exactly what
    // the home page's By stretch shelves count.
    var sg = el('div', 'filter-group');
    sg.appendChild(el('label', 'flabel', 'Can stretch by'));
    var ssel = el('select');
    ssel.id = 'stretch-select';
    ssel.setAttribute('aria-label', 'How far the run can stretch');
    [['Any stretch', ''], ['10 minutes or more', '10'], ['15 minutes or more', '15'], ['20 minutes or more', '20'], ['30 minutes or more', '30']]
      .forEach(function (o) {
        var opt = el('option', null, o[0]); opt.value = o[1]; ssel.appendChild(opt);
      });
    ssel.addEventListener('change', function () {
      state.stretchMin = ssel.value ? parseInt(ssel.value, 10) : null;
      render();
    });
    sg.appendChild(ssel);
    host.appendChild(sg);

    // can flex by (R123 headline): the group-window twin of the
    // stretch select. Matches on the window between the activity's
    // own smallest and largest group (group_max - group_min),
    // exactly what the home page's By flex shelves count.
    var fg = el('div', 'filter-group');
    fg.appendChild(el('label', 'flabel', 'Can flex by'));
    var fsel = el('select');
    fsel.id = 'flex-select';
    fsel.setAttribute('aria-label', 'How far the group size can flex');
    [['Any flex', ''], ['20 kids or more', '20'], ['25 kids or more', '25'], ['30 kids or more', '30'], ['35 kids or more', '35']]
      .forEach(function (o) {
        var opt = el('option', null, o[0]); opt.value = o[1]; fsel.appendChild(opt);
      });
    fsel.addEventListener('change', function () {
      state.flexMin = fsel.value ? parseInt(fsel.value, 10) : null;
      render();
    });
    fg.appendChild(fsel);
    host.appendChild(fg);

    // can span by (R124 headline): the age-window twin of the
    // flex select. Matches on the window between the activity's
    // own youngest and oldest age (age_max - age_min), exactly
    // what the home page's By span shelves count.
    var ng = el('div', 'filter-group');
    ng.appendChild(el('label', 'flabel', 'Can span by'));
    var nsel = el('select');
    nsel.id = 'span-select';
    nsel.setAttribute('aria-label', 'How wide an age range it can hold');
    [['Any span', ''], ['5 years or more', '5'], ['6 years or more', '6'], ['7 years or more', '7'], ['8 years or more', '8']]
      .forEach(function (o) {
        var opt = el('option', null, o[0]); opt.value = o[1]; nsel.appendChild(opt);
      });
    nsel.addEventListener('change', function () {
      state.spanMin = nsel.value ? parseInt(nsel.value, 10) : null;
      render();
    });
    ng.appendChild(nsel);
    host.appendChild(ng);

    // starts at (R125 headline): the start-point twin of the span
    // select. Matches on the activity's own youngest age (age_min),
    // exactly what the home page's By start shelves count.
    var ug = el('div', 'filter-group');
    ug.appendChild(el('label', 'flabel', 'Starts at'));
    var usel = el('select');
    usel.id = 'start-select';
    usel.setAttribute('aria-label', 'The youngest age it starts at');
    [['Any start', ''], ['4 or younger', '4'], ['5 or younger', '5'], ['6 or younger', '6'], ['3 or younger', '3']]
      .forEach(function (o) {
        var opt = el('option', null, o[0]); opt.value = o[1]; usel.appendChild(opt);
      });
    usel.addEventListener('change', function () {
      state.startMax = usel.value ? parseInt(usel.value, 10) : null;
      render();
    });
    ug.appendChild(usel);
    host.appendChild(ug);

    // ends at (R126 headline): the end-point twin of the starts at
    // select. Matches on the activity's own oldest age (age_max),
    // exactly what the home page's By end shelves count.
    var vg = el('div', 'filter-group');
    vg.appendChild(el('label', 'flabel', 'Ends at'));
    var vsel = el('select');
    vsel.id = 'end-select';
    vsel.setAttribute('aria-label', 'The oldest age it ends at');
    [['Any end', ''], ['10 or older', '10'], ['12 or older', '12'], ['Ends at 14', '14'], ['13 or older', '13']]
      .forEach(function (o) {
        var opt = el('option', null, o[0]); opt.value = o[1]; vsel.appendChild(opt);
      });
    vsel.addEventListener('change', function () {
      state.endMin = vsel.value ? parseInt(vsel.value, 10) : null;
      render();
    });
    vg.appendChild(vsel);
    host.appendChild(vg);

    // starts with (R127 headline): the group-side twin of the
    // starts at select. Matches on the activity's own smallest
    // group (group_min), exactly what the home page's By floor
    // shelves count.
    var wg = el('div', 'filter-group');
    wg.appendChild(el('label', 'flabel', 'Starts with'));
    var wsel = el('select');
    wsel.id = 'floor-select';
    wsel.setAttribute('aria-label', 'The smallest group it starts with');
    [['Any group size', ''], ['2 or fewer', '2'], ['4 or fewer', '4'], ['6 or fewer', '6'], ['Just 1 kid', '1']]
      .forEach(function (o) {
        var opt = el('option', null, o[0]); opt.value = o[1]; wsel.appendChild(opt);
      });
    wsel.addEventListener('change', function () {
      state.floorMax = wsel.value ? parseInt(wsel.value, 10) : null;
      render();
    });
    wg.appendChild(wsel);
    host.appendChild(wg);

    // fits (R128 headline): the group-side twin of the ends at
    // select. Matches on the activity's own largest group
    // (group_max), exactly what the home page's By ceiling
    // shelves count.
    var xg = el('div', 'filter-group');
    xg.appendChild(el('label', 'flabel', 'Fits'));
    var xsel = el('select');
    xsel.id = 'ceiling-select';
    xsel.setAttribute('aria-label', 'The largest group it can hold');
    [['Any size', ''], ['10 or more', '10'], ['20 or more', '20'], ['30 or more', '30'], ['40 or more', '40']]
      .forEach(function (o) {
        var opt = el('option', null, o[0]); opt.value = o[1]; xsel.appendChild(opt);
      });
    xsel.addEventListener('change', function () {
      state.ceilingMin = xsel.value ? parseInt(xsel.value, 10) : null;
      render();
    });
    xg.appendChild(xsel);
    host.appendChild(xg);

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
      state.q = ''; state.age = null; state.maxTime = null; state.group = null; state.kitMax = null; state.longMin = null; state.stretchMin = null; state.flexMin = null; state.spanMin = null; state.startMax = null; state.endMin = null; state.floorMax = null; state.ceilingMin = null;
      state.cats.clear(); state.tags.clear();
      state.noPrepOnly = false; state.indoorOnly = false; state.outdoorOnly = false;
      state.copyFreeOnly = false; state.noElimOnly = false;
      state.sortByRating = false; state.topTen = false;
      searchInput.value = ''; tsel.value = ''; gsel.value = ''; ksel.value = ''; lsel.value = ''; ssel.value = ''; fsel.value = ''; nsel.value = ''; usel.value = ''; vsel.value = ''; wsel.value = ''; xsel.value = '';
      host.querySelectorAll('[aria-pressed]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      render();
    });
    host.appendChild(reset);
  }

  /* Wave R111: the home "current issue" hero and the "What's coming up"
     rows are baked at build time with the build day's day-counts. Recompute
     them from the visitor's real today: refresh every row's numeral, hide
     rows whose occasion has passed since the build, and advance the hero to
     the next upcoming occasion (keeping the seasonal cover). No-ops on pages
     without [data-date] countdowns. */
  function refreshCountdowns() {
    var rows = document.querySelectorAll('.cal-row[data-date]');
    if (!rows.length) return;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    function diffDays(ds) {
      var p = ds.split('-');
      var d = new Date(+p[0], +p[1] - 1, +p[2]);
      return Math.round((d - today) / 86400000);
    }
    function rowLabel(n) {
      if (n === 0) return 'today';
      if (n === 1) return '<span class="cal-num">1</span> day';
      return '<span class="cal-num">' + n + '</span> days';
    }
    var firstFuture = null;
    Array.prototype.forEach.call(rows, function (li) {
      var n = diffDays(li.getAttribute('data-date'));
      if (n < 0) { li.style.display = 'none'; return; }
      if (!firstFuture) firstFuture = li;
      var slot = li.querySelector('.cal-days');
      if (slot) slot.innerHTML = rowLabel(n);
    });
    var hero = document.querySelector('.issue-count[data-date]');
    if (!hero) return;
    var hn = diffDays(hero.getAttribute('data-date'));
    var num = hero.querySelector('.issue-num');
    var kicker = hero.querySelector('.issue-num-kicker');
    if (hn < 0 && firstFuture) {
      var link = firstFuture.querySelector('.cal-name');
      var countEl = firstFuture.querySelector('.cal-count');
      var fn = diffDays(firstFuture.getAttribute('data-date'));
      var p = firstFuture.getAttribute('data-date').split('-');
      var d = new Date(+p[0], +p[1] - 1, +p[2]);
      var dateLine = hero.querySelector('.issue-num-date');
      var nameA = hero.querySelector('.issue-num-text a');
      if (num) { num.textContent = fn; num.style.display = ''; }
      if (kicker) kicker.textContent = 'days to';
      if (nameA && link) {
        nameA.textContent = link.textContent;
        nameA.setAttribute('href', link.getAttribute('href'));
      }
      if (dateLine) {
        var wd = d.toLocaleDateString('en-US', { weekday: 'long' });
        var md = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        var cnt = countEl ? countEl.textContent.replace(' activities', '') : '';
        dateLine.innerHTML = wd + ', ' + md + ' &middot; ' + cnt + ' activities filed for it';
      }
      hero.setAttribute('data-date', firstFuture.getAttribute('data-date'));
    } else if (hn === 0) {
      if (num) num.style.display = 'none';
      if (kicker) kicker.textContent = 'today is';
    } else if (hn > 0 && num) {
      num.textContent = hn;
    }
  }

  /* Wave R112: the "current issue · <Month Year>" kicker is baked at build
     time. Recompute it from the visitor's real today so a stale build never
     claims the wrong month — the same staleness class R111 cured on the
     countdown numerals. No-ops on pages without [data-issue-kicker]. */
  function refreshIssueKicker() {
    var k = document.querySelector('[data-issue-kicker]');
    if (!k) return;
    var monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    k.textContent = 'Activity Vault \u00B7 the current issue \u00B7 ' + monthYear;
  }

  function init() {
    refreshCountdowns(); // wave R111: the home "current issue" countdowns are
    // build-time snapshots; recompute them from the visitor's real today so a
    // stale build never claims "N days to" an occasion that already passed.
    refreshIssueKicker(); // wave R112: same staleness class on the kicker's month.
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
        // ?loc= deep link (R115 headline): preselect the where toggle from
        // the home page's By where shelves. Same state + pressed-chip form
        // as the ?tag= / ?cats= links above; the toggles are data-toggle-idx
        // 1 (indoor) and 2 (outdoor) in buildFilters.
        // ?time= deep link (R116 headline): preselect the Time available
        // select from the home page's By time shelves. Same state form as
        // the select's own change handler; the shelf counts are computed
        // from time_min, exactly what this filter matches on.
        var qtime = new URLSearchParams(window.location.search).get('time');
        if (qtime && ['15', '20', '30', '45', '60'].indexOf(qtime) !== -1) {
          state.maxTime = parseInt(qtime, 10);
          var tsel2 = document.getElementById('time-select');
          if (tsel2) tsel2.value = qtime;
        }
        // ?group= deep link (R117 headline): preselect the Group size
        // select from the home page's By group shelves. Same state form
        // as the select's own change handler; the shelf counts are
        // computed from group_min/group_max, exactly what this filter
        // matches on.
        var qgroup = new URLSearchParams(window.location.search).get('group');
        if (qgroup && ['8', '16', '25', '40'].indexOf(qgroup) !== -1) {
          state.group = parseInt(qgroup, 10);
          var gsel2 = document.getElementById('group-select');
          if (gsel2) gsel2.value = qgroup;
        }
        // ?age= deep link (R118 headline): preselect the Age filter
        // from the home page's By age shelves. Same state form as the
        // filter's own controls: the slider is set to the age and the
        // Filter by age toggle is switched on by its own click
        // handler, which is what sets state.age from the slider. The
        // shelf counts are computed from age_min/age_max, exactly
        // what this filter matches on. Only ages inside the slider's
        // own declared bounds are accepted.
        var qage = new URLSearchParams(window.location.search).get('age');
        var ageRange2 = document.getElementById('age-range');
        if (qage && ageRange2 && /^\d+$/.test(qage)) {
          var ageVal = parseInt(qage, 10);
          if (ageVal >= parseInt(ageRange2.min, 10) && ageVal <= parseInt(ageRange2.max, 10)) {
            ageRange2.value = qage;
            var ageOut2 = document.getElementById('age-out');
            if (ageOut2) ageOut2.textContent = 'Age ' + qage;
            var ageToggle2 = document.getElementById('age-toggle');
            if (ageToggle2 && ageToggle2.getAttribute('aria-pressed') !== 'true') ageToggle2.click();
          }
        }
        // ?ready= deep link (R119 headline): preselect one of the
        // browse's three verified "only" toggles from the home page's
        // Ready to run shelves. Same state + pressed-chip form as the
        // ?loc= link below; the toggles are data-toggle-idx 0
        // (no-prep), 3 (copy-free) and 4 (no-elimination) in
        // buildFilters, and the shelf counts are computed from the
        // same fields those toggles match on.
        // ?kit= deep link (R120 headline): preselect the Kit to
        // gather select from the home page's By kit shelves. Same
        // state form as the select's own change handler; the shelf
        // counts are computed from each activity's materials list
        // length, exactly what this filter matches on.
        var qkit = new URLSearchParams(window.location.search).get('kit');
        if (qkit && ['0', '2', '3', '5'].indexOf(qkit) !== -1) {
          state.kitMax = parseInt(qkit, 10);
          var ksel2 = document.getElementById('kit-select');
          if (ksel2) ksel2.value = qkit;
        }
        // ?long= deep link (R121 headline): preselect the Can run
        // for select from the home page's By length shelves. Same
        // state form as the select's own change handler; the shelf
        // counts are computed from each activity's longest run
        // (time_max), exactly what this filter matches on.
        var qlong = new URLSearchParams(window.location.search).get('long');
        if (qlong && ['30', '45', '60'].indexOf(qlong) !== -1) {
          state.longMin = parseInt(qlong, 10);
          var lsel2 = document.getElementById('length-select');
          if (lsel2) lsel2.value = qlong;
        }
        // ?stretch= deep link (R122 headline): preselect the Can
        // stretch by select from the home page's By stretch shelves.
        // Same state form as the select's own change handler; the
        // shelf counts are computed from each activity's run window
        // (time_max - time_min), exactly what this filter matches on.
        var qstretch = new URLSearchParams(window.location.search).get('stretch');
        if (qstretch && ['10', '15', '20', '30'].indexOf(qstretch) !== -1) {
          state.stretchMin = parseInt(qstretch, 10);
          var ssel2 = document.getElementById('stretch-select');
          if (ssel2) ssel2.value = qstretch;
        }
        // ?flex= deep link (R123 headline): preselect the Can flex
        // by select from the home page's By flex shelves. Same state
        // form as the select's own change handler; the shelf counts
        // are computed from each activity's group window
        // (group_max - group_min), exactly what this filter matches on.
        var qflex = new URLSearchParams(window.location.search).get('flex');
        if (qflex && ['20', '25', '30', '35'].indexOf(qflex) !== -1) {
          state.flexMin = parseInt(qflex, 10);
          var fsel2 = document.getElementById('flex-select');
          if (fsel2) fsel2.value = qflex;
        }
        // ?span= deep link (R124 headline): preselect the Can span
        // by select from the home page's By span shelves. Same state
        // form as the select's own change handler; the shelf counts
        // are computed from each activity's age window
        // (age_max - age_min), exactly what this filter matches on.
        var qspan = new URLSearchParams(window.location.search).get('span');
        if (qspan && ['5', '6', '7', '8'].indexOf(qspan) !== -1) {
          state.spanMin = parseInt(qspan, 10);
          var nsel2 = document.getElementById('span-select');
          if (nsel2) nsel2.value = qspan;
        }
        // ?start= deep link (R125 headline): preselect the Starts
        // at select from the home page's By start shelves. Same state
        // form as the select's own change handler; the shelf counts
        // are computed from each activity's youngest age (age_min),
        // exactly what this filter matches on.
        var qstart = new URLSearchParams(window.location.search).get('start');
        if (qstart && ['3', '4', '5', '6'].indexOf(qstart) !== -1) {
          state.startMax = parseInt(qstart, 10);
          var usel2 = document.getElementById('start-select');
          if (usel2) usel2.value = qstart;
        }
        // ?end= deep link (R126 headline): preselect the Ends
        // at select from the home page's By end shelves. Same state
        // form as the select's own change handler; the shelf counts
        // are computed from each activity's oldest age (age_max),
        // exactly what this filter matches on.
        var qend = new URLSearchParams(window.location.search).get('end');
        if (qend && ['10', '12', '13', '14'].indexOf(qend) !== -1) {
          state.endMin = parseInt(qend, 10);
          var vsel2 = document.getElementById('end-select');
          if (vsel2) vsel2.value = qend;
        }
        // ?floor= deep link (R127 headline): preselect the Starts
        // with select from the home page's By floor shelves. Same
        // state form as the select's own change handler; the shelf
        // counts are computed from each activity's smallest group
        // (group_min), exactly what this filter matches on.
        var qfloor = new URLSearchParams(window.location.search).get('floor');
        if (qfloor && ['1', '2', '4', '6'].indexOf(qfloor) !== -1) {
          state.floorMax = parseInt(qfloor, 10);
          var wsel2 = document.getElementById('floor-select');
          if (wsel2) wsel2.value = qfloor;
        }
        // ?ceiling= deep link (R128 headline): preselect the Fits
        // select from the home page's By ceiling shelves. Same
        // state form as the select's own change handler; the shelf
        // counts are computed from each activity's largest group
        // (group_max), exactly what this filter matches on.
        var qceiling = new URLSearchParams(window.location.search).get('ceiling');
        if (qceiling && ['10', '20', '30', '40'].indexOf(qceiling) !== -1) {
          state.ceilingMin = parseInt(qceiling, 10);
          var xsel2 = document.getElementById('ceiling-select');
          if (xsel2) xsel2.value = qceiling;
        }
        var qready = new URLSearchParams(window.location.search).get('ready');
        if (qready === 'noprep' || qready === 'copyfree' || qready === 'noelim') {
          var rmap = { noprep: ['noPrepOnly', '0'], copyfree: ['copyFreeOnly', '3'], noelim: ['noElimOnly', '4'] };
          state[rmap[qready][0]] = true;
          var rbtn = document.querySelector('[data-toggle-idx="' + rmap[qready][1] + '"]');
          if (rbtn) rbtn.setAttribute('aria-pressed', 'true');
        }
        var qloc = new URLSearchParams(window.location.search).get('loc');
        if (qloc === 'indoor' || qloc === 'outdoor') {
          var indoor = qloc === 'indoor';
          if (indoor) { state.indoorOnly = true; } else { state.outdoorOnly = true; }
          var lbtn = document.querySelector('[data-toggle-idx="' + (indoor ? '1' : '2') + '"]');
          if (lbtn) lbtn.setAttribute('aria-pressed', 'true');
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
