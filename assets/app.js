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
    outdoorOnly: false
  };

  var TAG_LABELS = {
    'season:fall': '🎃 Fall',
    'season:winter': '❄️ Winter',
    'holiday:halloween': '👻 Halloween',
    'holiday:dia-de-muertos': '💀 Día de los Muertos',
    'holiday:christmas': '🎄 Christmas',
    'holiday:hanukkah': '🕎 Hanukkah',
    'holiday:kwanzaa': '🖤 Kwanzaa',
    'holiday:new-year': '🎆 New Year',
    'theme:spooky': '🕸️ Spooky (not scary)'
  };
  var TAG_ORDER = ['season:fall', 'season:winter', 'holiday:halloween', 'holiday:dia-de-muertos',
                   'holiday:christmas', 'holiday:hanukkah', 'holiday:kwanzaa', 'holiday:new-year',
                   'theme:spooky'];

  var grid, countEl, searchInput;

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
    grid.innerHTML = '';
    if (!list.length) {
      var empty = el('div', 'empty');
      empty.innerHTML = '<span class="big" aria-hidden="true">🗂️</span><p><strong>No activities match.</strong></p><p>Try loosening a filter or two.</p>';
      grid.appendChild(empty);
    } else {
      list.forEach(function (a) { grid.appendChild(renderCard(a)); });
    }
    countEl.textContent = list.length + (list.length === 1 ? ' activity' : ' activities');
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
      row.appendChild(chipButton(c.glyph + ' ' + c.name, false, function (on) {
        if (on) state.cats.add(c.id); else state.cats.delete(c.id);
      }, c.color));
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
     ['🌳 Outdoor only', function (on) { state.outdoorOnly = on; if (on) { state.indoorOnly = false; syncIndoor(); } }]
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

    // reset
    var reset = el('button', 'btn btn-ghost btn-reset', 'Reset all filters');
    reset.type = 'button';
    reset.addEventListener('click', function () {
      state.q = ''; state.age = null; state.maxTime = null; state.group = null;
      state.cats.clear(); state.tags.clear();
      state.noPrepOnly = false; state.indoorOnly = false; state.outdoorOnly = false;
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
      buildFilters();
      // ?tag= deep links (used by the week planner's seasonal suggestions)
      try {
        var qtag = new URLSearchParams(window.location.search).get('tag');
        if (qtag && TAG_ORDER.indexOf(qtag) !== -1) {
          state.tags.add(qtag);
          var tbtn = document.querySelector('[data-tag="' + qtag + '"]');
          if (tbtn) tbtn.setAttribute('aria-pressed', 'true');
        }
      } catch (e) { /* malformed query string — ignore */ }
      render();
    }).catch(function () {
      grid.innerHTML = '<div class="empty"><span class="big" aria-hidden="true">⚠️</span><p>Could not load the activity library. Check your connection and reload.</p></div>';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
