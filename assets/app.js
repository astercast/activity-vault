/* Activity Vault — filter browser.
   Fetches data/activities.json + data/categories.json, renders filterable card grid. */
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
    topTen: false        // "My top 10": rated-only, top 10 by own stars
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
    'season:fall': '🎃 Fall',
    'season:winter': '❄️ Winter',
    'season:spring': '🌷 Spring',
    'season:summer': '☀️ Summer',
    'holiday:halloween': '👻 Halloween',
    'holiday:thanksgiving': '🦃 Thanksgiving',
    'holiday:dia-de-muertos': '💀 Día de los Muertos',
    'holiday:christmas': '🎄 Christmas',
    'holiday:hanukkah': '🕎 Hanukkah',
    'holiday:kwanzaa': '🖤 Kwanzaa',
    'holiday:new-year': '🎆 New Year',
    'holiday:easter': '🐣 Easter',
    'holiday:earth-day': '🌎 Earth Day',
    'holiday:july-4th': '🇺🇸 July 4th',
    'theme:spooky': '🕸️ Spooky (not scary)'
  };
  var TAG_ORDER = ['season:fall', 'season:winter', 'season:spring', 'season:summer', 'holiday:halloween', 'holiday:thanksgiving', 'holiday:dia-de-muertos',
                   'holiday:christmas', 'holiday:hanukkah', 'holiday:kwanzaa', 'holiday:new-year',
                   'holiday:easter', 'holiday:earth-day', 'holiday:july-4th',
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

  function renderCard(a) {
    var cat = primaryCat(a);
    var card = el('article', 'act-card');
    card.style.setProperty('--cat', cat.color);

    var chips = el('div', 'cat-chips');
    a.categories.forEach(function (cid) {
      var c = state.catMap[cid];
      if (!c) return;
      var chip = el('span', 'chip cat-chip', c.glyph + ' ' + c.name);
      chip.style.setProperty('--cat', c.color);
      chip.setAttribute('aria-hidden', 'true');
      chips.appendChild(chip);
    });
    (a.tags || []).forEach(function (t) {
      var chip = el('span', 'chip tag-chip', TAG_LABELS[t] || t);
      chip.setAttribute('aria-hidden', 'true');
      chips.appendChild(chip);
    });
    // wave 14 scope-up: research-backed badges, visible in the browse grid too
    if (a.copy_free) {
      var cf = el('span', 'chip tag-chip', '🖨️ Copy-free');
      cf.setAttribute('aria-hidden', 'true');
      chips.appendChild(cf);
    }
    if (a.no_elimination) {
      var ne = el('span', 'chip tag-chip', '♾️ No elimination');
      ne.setAttribute('aria-hidden', 'true');
      chips.appendChild(ne);
    }
    card.appendChild(chips);

    var h = el('h3');
    var link = el('a', null, a.name);
    link.href = 'activity/' + a.id + '.html';
    h.appendChild(link);
    card.appendChild(h);

    card.appendChild(el('p', 'tagline', a.tagline));

    var meta = el('div', 'meta');
    meta.appendChild(metaItem('Ages', a.age_min + '–' + a.age_max));
    meta.appendChild(metaItem('Time', a.time_min + '–' + a.time_max + ' min'));
    meta.appendChild(metaItem('Group', a.group_min + '–' + a.group_max));
    var prep = el('span', 'prep-flag ' + (a.no_prep ? 'yes' : 'no'),
      a.no_prep ? '✓ No-prep' : '◷ Some prep');
    meta.appendChild(prep);
    var loc = el('span', null, '');
    loc.innerHTML = '⌂ <b>' + (a.location.indexOf('indoor') !== -1 && a.location.indexOf('outdoor') !== -1
      ? 'In / Out' : (a.location[0] === 'indoor' ? 'Indoors' : 'Outdoors')) + '</b>';
    meta.appendChild(loc);
    card.appendChild(meta);

    // The visitor's OWN rating — never an aggregate; there are no community ratings.
    var mine = myRating(a);
    if (mine) {
      card.appendChild(el('span', 'rate-badge', '⭐ ' + mine.stars + '★ — your rating'));
    } else if (state.sortByRating || state.topTen) {
      card.appendChild(el('span', 'rate-badge unrated', 'Not rated yet'));
    }

    return card;
  }

  function metaItem(label, value) {
    var s = el('span', null, '');
    s.innerHTML = label + ' <b></b>';
    s.querySelector('b').textContent = value;
    return s;
  }

  function render() {
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
      // Rated first (best stars first), unrated last — clearly marked.
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
      note.innerHTML = '<strong>⭐ ' + (state.topTen ? 'Your top 10' : 'Sorted by your ratings') +
        '.</strong> These are <em>your</em> ratings, stored only in this browser. ' +
        'Activity Vault has no community ratings, so nothing here is an average or a "top" voted by others.';
      grid.appendChild(note);
    }
    if (!list.length) {
      var empty = el('div', 'empty');
      if (state.topTen) {
        empty.innerHTML = '<span class="big" aria-hidden="true">⭐</span>' +
          '<p><strong>No ratings yet.</strong></p>' +
          '<p>Open any activity card and give it 1–5 stars — your top 10 will appear here.</p>';
      } else {
        empty.innerHTML = '<span class="big" aria-hidden="true">🗂️</span><p><strong>No activities match.</strong></p><p>Try loosening a filter or two.</p>';
      }
      grid.appendChild(empty);
    } else {
      list.forEach(function (a, idx) {
        var c = renderCard(a);
        c.style.setProperty('--i', String(idx % 9)); /* stagger order for the desk reveal */
        grid.appendChild(c);
      });
    }
    countEl.textContent = list.length + (list.length === 1 ? ' activity' : ' activities');
    if (window.VaultReveal) window.VaultReveal.watch(grid);
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
      statusEl.textContent = 'Copied ✓';
      setTimeout(function () { statusEl.textContent = ''; }, 2500);
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try { document.execCommand('copy'); ok(); }
      catch (e) { statusEl.textContent = 'Copy failed — select the text manually.'; }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else { fallback(); }
  }

  function copyCollection() {
    var list = state.visible || [];
    var bits = describeFilters();
    var title = bits.length
      ? '🗂️ Activity Vault collection — ' + bits.join(' · ')
      : '🗂️ Activity Vault collection — all activities';
    var lines = [title, ''];
    if (list.length) {
      list.forEach(function (a) {
        lines.push('• ' + a.name + ' — Ages ' + a.age_min + '–' + a.age_max + ', ' +
          a.time_min + '–' + a.time_max + ' min');
        lines.push('  ' + cardUrl('activity/' + a.id + '.html'));
      });
    } else {
      lines.push('No activities match these filters right now.');
    }
    lines.push('');
    lines.push('View it: ' + viewUrl());
    lines.push('Paste this into your newsletter or email — every link opens the right activity card.');
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

    // search
    var g = el('div', 'filter-group');
    g.appendChild(el('label', 'flabel', 'Search'));
    searchInput = el('input');
    searchInput.type = 'search';
    searchInput.placeholder = 'Name, material, keyword…';
    searchInput.setAttribute('aria-label', 'Search activities');
    var t;
    searchInput.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        state.q = searchInput.value.trim().toLowerCase();
        render();
      }, 150);
    });
    g.appendChild(searchInput);
    host.appendChild(g);

    // categories
    var cg = el('div', 'filter-group');
    cg.appendChild(el('span', 'flabel', 'Category'));
    var row = el('div', 'chip-row');
    state.categories.forEach(function (c) {
      var cb = chipButton(c.glyph + ' ' + c.name, false, function (on) {
        if (on) state.cats.add(c.id); else state.cats.delete(c.id);
      }, c.color);
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
      }, '#8b5cf6');
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
    ageRange.min = '5'; ageRange.max = '12'; ageRange.value = '9';
    ageRange.setAttribute('aria-label', 'Age of kids');
    var ageOut = el('div', null, 'Age 9');
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

    // your ratings (localStorage only — never aggregated, never shared)
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
      fetch('data/categories.json').then(function (r) { return r.json(); })
    ]).then(function (res) {
      state.activities = res[0];
      state.categories = res[1];
      res[1].forEach(function (c) { state.catMap[c.id] = c; });
      var statActs = document.getElementById('stat-activities');
      var statCats = document.getElementById('stat-categories');
      var statPrep = document.getElementById('stat-noprep');
      if (statActs) statActs.textContent = state.activities.length;
      if (statCats) statCats.textContent = state.categories.length;
      if (statPrep) statPrep.textContent = state.activities.filter(function (a) { return a.no_prep; }).length;
      // Seasonal homepage promos: spring (Mar–May), summer (Jun–Aug), halloween (Oct),
      // thanksgiving (Nov) — client-side, month-gated.
      var promo = document.getElementById('season-promo');
      var summerPromo = document.getElementById('season-promo-summer');
      var halloweenPromo = document.getElementById('season-promo-halloween');
      var thanksgivingPromo = document.getElementById('season-promo-thanksgiving');
      if (promo) {
        var pm = new Date().getMonth();
        promo.hidden = !(pm === 2 || pm === 3 || pm === 4);
        if (summerPromo) summerPromo.hidden = !(pm === 5 || pm === 6 || pm === 7);
        if (halloweenPromo) halloweenPromo.hidden = !(pm === 9);
        if (thanksgivingPromo) thanksgivingPromo.hidden = !(pm === 10);
      }
      buildFilters();
      // ?view=top-rated deep link (My top 10 — ratings live in the visitor's browser)
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
      } catch (e) { /* malformed query string — ignore */ }
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
      grid.innerHTML = '<div class="empty"><span class="big" aria-hidden="true">⚠️</span><p>Could not load the activity library. Check your connection and reload.</p></div>';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
