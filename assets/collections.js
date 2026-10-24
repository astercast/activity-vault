/* Activity Vault, curated collections page (wave 9).
   Renders the curated collections from data/v1/collections.json, resolves
   picks against data/v1/activities.json, shows the visitor's own rating badges
   (localStorage only, never invented), printable per collection, with a
   "copy this collection" text export per collection (wave-7 pattern). */
(function () {
  'use strict';

  var grid = document.getElementById('collection-grid');
  var sectionsHost = document.getElementById('collection-sections');
  var statusEl = document.getElementById('coll-status');
  var allLinkWrap = document.getElementById('all-link-wrap');
  var glanceEl = document.getElementById('collection-glance');
  var top6El = document.getElementById('collection-top6');

  /* R113, ruling (10)(c) fallback (Aesthetics lane filed no unfenced item):
     intent-led grouping + verdict-led Top-6, from the seven paired teardown
     batches. Groups keyed by collection id; the visitor's desire organizes
     the page, never the data schema. */
  var INTENTS = [
    { label: 'When the plan breaks',
      ids: ['rainy-day-rescue', 'last-10-minutes', 'no-prep-lifesavers', 'calm-down-corner'] },
    { label: 'First days',
      ids: ['first-day-of-program'] },
    { label: 'Sub coverage',
      ids: ['sub-tub-essentials'] },
    { label: 'Seasons & parties',
      ids: ['winter-party-night', 'spring-burst', 'summer-splash', 'haunted-halls',
            'grateful-gathering', 'halloween-week', 'winter-lights', 'the-whole-calendar'] },
    { label: 'The littles',
      ids: ['little-hands-first-years', 'little-hands-next-steps', 'little-hands-third-shelf',
            'little-hands-fourth-shelf', 'little-hands-just-three', 'little-hands-just-three-more',
            'little-hands-just-three-again', 'little-hands-just-three-once-more',
            'little-hands-just-three-fifth-time', 'little-hands-just-three-sixth-time',
            'little-hands-just-three-seventh-time', 'little-hands-just-three-eighth-time'] },
    { label: 'The teens',
      ids: ['just-teens-first-time', 'just-teens-second-time', 'just-teens-third-time',
            'just-teens-fourth-time', 'just-teens-fifth-time'] },
    { label: 'Big days',
      ids: ['field-trip-bus-ride', 'field-day-classics', 'filling-the-thin-drawers'] }
  ];

  /* The curator's short list: the six shelves teachers reach for first,
     each with a one-line verdict (title specificity + the reason to care). */
  var START_HERE = [
    { id: 'rainy-day-rescue', verdict: 'Recess cancelled? This shelf holds the afternoon.' },
    { id: 'first-day-of-program', verdict: 'New faces, new room: the order that lands the first day.' },
    { id: 'sub-tub-essentials', verdict: 'The ten cards your sub folder cannot be without.' },
    { id: 'last-10-minutes', verdict: 'The dying clock, handled: ten minutes, no chaos.' },
    { id: 'the-whole-calendar', verdict: 'One shelf for the whole school year, twelve holidays.' },
    { id: 'field-day-classics', verdict: 'Sports day on one shelf: the four races every field day runs.' }
  ];

  /* Hand links: collections that tie to a tool get a "pairs with" callout. */
  var TIES = {
    'sub-tub-essentials': { label: 'Pairs with the Sub Tub kit', href: 'sub.html' },
    'winter-party-night': { label: 'Pairs with the Party Planner winter theme', href: 'party.html' }
  };

  /* Spelled-out count for the hero (VP-0008): 0–99, Title-case first word. */
  function numberWord(n) {
    var ones = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
      'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
      'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    var tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty',
      'Seventy', 'Eighty', 'Ninety'];
    if (n < 20) return ones[n];
    var t = tens[Math.floor(n / 10)], r = n % 10;
    return r ? t + '-' + ones[r].toLowerCase() : t;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }

  function baseUrl() {
    try { return new URL('.', document.baseURI).href; }
    catch (e) { return location.href; }
  }

  function ratingBadge(activityId) {
    var R = window.VaultRatings;
    if (!R) return null;
    var entry = R.getRating(activityId);
    if (!entry) return null;
    var s = el('span', 'rate-badge', 'Your rating: ' + entry.stars + ' of 5');
    s.setAttribute('aria-label', 'You rated this activity ' + entry.stars + ' of 5 stars');
    return s;
  }

  function facts(a) {
    var mats = a.materials && a.materials.length
      ? a.materials.length + (a.materials.length === 1 ? ' material' : ' materials')
      : 'no materials';
    return 'Ages ' + a.age_min + '–' + a.age_max + ' · ' +
      a.time_min + '–' + a.time_max + ' min · ' + mats;
  }

  /* Tab colour law: each collection owns one colour from the vault's
     category palette; it recurs as the margin rule and note voice on
     the collection's pages, never as a fill. */
  var COLL_COLORS = ['#c77b1e', '#b7413c', '#7b5fc7', '#0d8a96', '#2e9e5b',
    '#c98f1b', '#d4567e', '#4f7d3a', '#4a7ec2', '#6b7280', '#a855f7'];
  function collColor(c, i) { return COLL_COLORS[i % COLL_COLORS.length]; }

  /* Rotation 21: cards are distinguished by real content, the moment the
     bundle is for (when_to_use), its size, its age/time span, and the names
     of its first activities, never by an emoji glyph. */
  function makeCard(c, ci, actmap) {
    var card = el('a', 'collection-card');
    card.style.setProperty('--cat', collColor(c, ci));
    card.href = '#' + c.id;
    var names = c.picks.slice(0, 3).map(function (p) {
      var a = actmap[p.activity_id];
      return a ? a.name : p.activity_id;
    });
    var more = c.picks.length - names.length;
    card.setAttribute('aria-label', c.title + ': ' + c.picks.length +
      ' activities, ages ' + c.age_span[0] + ' to ' + c.age_span[1] +
      ', ' + c.time_span[0] + ' to ' + c.time_span[1] + ' minutes each. Includes ' +
      names.join(', ') + (more > 0 ? ' and ' + more + ' more' : ''));
    card.appendChild(el('span', 'collection-title', c.title));
    card.appendChild(el('span', 'collection-count',
      c.picks.length + ' activities · Ages ' + c.age_span[0] + '–' + c.age_span[1] +
      ' · ' + c.time_span[0] + '–' + c.time_span[1] + ' min each'));
    card.appendChild(el('span', 'collection-when-snippet', c.when_to_use));
    card.appendChild(el('span', 'collection-includes',
      'Includes: ' + names.join(', ') + (more > 0 ? ' · +' + more + ' more' : '')));
    return card;
  }

  /* R113: the at-a-glance band comes FIRST, before the list. Decision facts
     computed from the loaded data — never hardcoded, so it cannot go stale. */
  function renderGlance(collections, actmap, updated) {
    if (!glanceEl) return;
    glanceEl.textContent = '';
    var totalPicks = collections.reduce(function (n, c) { return n + c.picks.length; }, 0);
    var factsList = el('dl', 'glance-facts');
    var cells = [
      ['Bundles', numberWord(collections.length)],
      ['Activities', String(totalPicks)],
      ['Every pick', 'a curator\u2019s one-line note'],
      /* The label follows the data field's own name and semantics: build.py
         rewrites this stamp on every regeneration, so it is the data's
         refresh date, not a claim of human curation on that date. */
      ['Data updated', fmtUpdated(updated)]
    ];
    cells.forEach(function (cell) {
      var wrap = el('div');
      wrap.appendChild(el('dt', null, cell[0]));
      wrap.appendChild(el('dd', null, cell[1]));
      factsList.appendChild(wrap);
    });
    glanceEl.appendChild(factsList);
    glanceEl.appendChild(el('p', 'glance-intents',
      'Rainy days · dying clocks · sub coverage · first days · seasons & parties · the littles · the teens · field days'));
    var tip = el('p', 'glance-tip');
    tip.appendChild(el('strong', null, 'Good to know: '));
    tip.appendChild(document.createTextNode(
      'print the bundle the night before. Every one is built to run from the printed page, no screen needed.'));
    glanceEl.appendChild(tip);
    glanceEl.hidden = false;
  }

  function fmtUpdated(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return 'see the data';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[Number(m[2]) - 1] + ' ' + Number(m[3]) + ', ' + m[1];
  }

  /* R113: the confident short list leads; the full grid follows. */
  function renderTop6(collections, actmap) {
    if (!top6El) return;
    top6El.textContent = '';
    top6El.appendChild(el('h2', 'top6-heading', 'Start here'));
    top6El.appendChild(el('p', 'top6-sub',
      'The six shelves teachers reach for first, with the curator\u2019s verdict on each.'));
    var byId = {};
    collections.forEach(function (c) { byId[c.id] = c; });
    var list = el('ol', 'top6-list');
    START_HERE.forEach(function (s) {
      var c = byId[s.id];
      if (!c) return; /* build-time validated; never happens */
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + c.id;
      a.appendChild(el('strong', null, c.title));
      a.appendChild(el('span', null, s.verdict));
      li.appendChild(a);
      list.appendChild(li);
    });
    top6El.appendChild(list);
    top6El.hidden = false;
  }

  /* R113: the grid renders intent-led groups. Any collection not claimed by
     a group falls into a named trailing group, so none can vanish silently. */
  function renderGrid(collections, actmap) {
    grid.textContent = '';
    var byId = {};
    collections.forEach(function (c, i) { byId[c.id] = { c: c, i: i }; });
    var placed = {};
    INTENTS.forEach(function (g) {
      var items = g.ids.map(function (id) { return byId[id]; })
                        .filter(function (it) { return it; });
      if (!items.length) return;
      var group = el('div', 'intent-group');
      group.appendChild(el('h2', 'intent-heading', g.label));
      var cards = el('div', 'intent-cards');
      items.forEach(function (it) {
        cards.appendChild(makeCard(it.c, it.i, actmap));
        placed[it.c.id] = 1;
      });
      group.appendChild(cards);
      grid.appendChild(group);
    });
    var rest = collections.filter(function (c) { return !placed[c.id]; });
    if (rest.length) {
      var group = el('div', 'intent-group');
      group.appendChild(el('h2', 'intent-heading', 'Everything else'));
      var cards = el('div', 'intent-cards');
      collections.forEach(function (c, i) {
        if (!placed[c.id]) cards.appendChild(makeCard(c, i, actmap));
      });
      group.appendChild(cards);
      grid.appendChild(group);
    }
    grid.hidden = false;
  }

  function renderSection(c, actmap, ci) {
    var sec = el('section', 'collection-section');
    sec.id = c.id;
    sec.style.setProperty('--cat', collColor(c, ci || 0));
    sec.setAttribute('aria-labelledby', 'coll-' + c.id);

    /* The squaring stack (P12, paper): the collection opener shows its
       first papers slightly rotated; they square into the tidy list
       once, here, and nowhere else. */
    var stack = el('div', 'square-stack no-print');
    stack.setAttribute('aria-hidden', 'true');
    c.picks.slice(0, 3).forEach(function (p, i) {
      var a = actmap[p.activity_id];
      var sheet = el('span', 'stack-sheet', a ? a.name : p.activity_id);
      sheet.style.setProperty('--tilt', String((i - 1) * 4));
      stack.appendChild(sheet);
    });
    sec.appendChild(stack);

    var head = el('div', 'collection-head');
    var h2 = el('h2', 'collection-h2', c.title);
    h2.id = 'coll-' + c.id;
    head.appendChild(h2);
    sec.appendChild(head);

    /* ONE context line per collection (round 3 law): season or moment,
       plus the age span, set once at the head as furniture. */
    sec.appendChild(el('p', 'collection-context',
      c.when_to_use + ' · Ages ' + c.age_span[0] + ' to ' + c.age_span[1] + '.'));

    /* The when line lives inside the one context line above; it is
       not repeated per section (L13 discipline). */

    if (TIES[c.id]) {
      var tie = el('p', 'collection-tie no-print');
      var a = el('a', null, TIES[c.id].label + ' →');
      a.href = TIES[c.id].href;
      tie.appendChild(a);
      sec.appendChild(tie);
    }

    var list = el('ol', 'pick-list');
    c.picks.forEach(function (p, pi) {
      var a = actmap[p.activity_id];
      if (!a) return; /* build-time validated; never happens */
      var li = el('li', pi === 0 ? 'pick pick-anchor' : 'pick');
      var row = el('div', 'pick-row');
      var link = el('a', 'pick-name', a.name);
      link.href = 'activity/' + a.id + '.html';
      row.appendChild(link);
      var badge = ratingBadge(a.id);
      if (badge) row.appendChild(badge);
      li.appendChild(row);
      li.appendChild(el('p', 'pick-facts', facts(a)));
      li.appendChild(el('p', 'pick-note', 'Why it’s here: ' + p.curator_note));
      list.appendChild(li);
    });
    sec.appendChild(list);

    var actions = el('div', 'collection-actions no-print');
    var printBtn = el('button', 'btn btn-small', 'Print this collection');
    printBtn.type = 'button';
    printBtn.addEventListener('click', function () { printOne(c.id); });
    var copyBtn = el('button', 'btn btn-small btn-ghost', 'Copy this collection');
    copyBtn.type = 'button';
    var copyStatus = el('span', 'copy-status');
    copyStatus.setAttribute('role', 'status');
    copyStatus.setAttribute('aria-live', 'polite');
    copyBtn.addEventListener('click', function () { copyOne(c, actmap, copyStatus); });
    var planLink = el('a', 'btn btn-small btn-ghost', 'Plan a week from this');
    planLink.href = 'planner.html?from=collection:' + encodeURIComponent(c.id);
    actions.appendChild(printBtn);
    actions.appendChild(copyBtn);
    actions.appendChild(planLink);
    actions.appendChild(copyStatus);
    sec.appendChild(actions);

    return sec;
  }

  function printOne(id) {
    var target = document.getElementById(id);
    if (!target) return;
    document.body.classList.add('print-one-coll');
    var others = sectionsHost.querySelectorAll('.collection-section');
    Array.prototype.forEach.call(others, function (s) {
      s.classList.toggle('is-print-target', s === target);
    });
    function cleanup() {
      document.body.classList.remove('print-one-coll');
      window.removeEventListener('afterprint', cleanup);
    }
    window.addEventListener('afterprint', cleanup);
    window.print();
  }

  function copyOne(c, actmap, statusEl) {
    var R = window.VaultRatings;
    var lines = [
      'Activity Vault, ' + c.title,
      'When to reach for it: ' + c.when_to_use,
      ''
    ];
    c.picks.forEach(function (p) {
      var a = actmap[p.activity_id];
      if (!a) return;
      lines.push('• ' + a.name + ', ' + facts(a));
      lines.push('  Why it’s here: ' + p.curator_note);
      if (R) {
        var entry = R.getRating(a.id);
        if (entry) {
          var rline = '  You rated this ' + entry.stars + '/5';
          if (entry.note) rline += ', “' + entry.note + '”';
          lines.push(rline);
        }
      }
      lines.push('  ' + baseUrl() + 'activity/' + a.id + '.html');
    });
    lines.push('');
    lines.push('View the collection: ' + baseUrl() + 'collections.html#' + c.id);
    lines.push('Your ratings are yours alone, stored only in this browser.');
    copyText(lines.join('\n'), statusEl);
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
      catch (e) { statusEl.textContent = 'Copy failed, select the text manually.'; }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else { fallback(); }
  }

  function applyRoute(collections) {
    var hash = (location.hash || '').replace(/^#/, '');
    var known = collections.some(function (c) { return c.id === hash; });
    var inSingle = known;
    grid.hidden = inSingle;
    /* R113: the glance band and the short list live with the grid in
       browse mode; a single collection routes alone. */
    if (glanceEl) glanceEl.hidden = inSingle;
    if (top6El) top6El.hidden = inSingle;
    var sections = sectionsHost.querySelectorAll('.collection-section');
    Array.prototype.forEach.call(sections, function (s) {
      /* Rotation 20 minimal pass: detail panels are on-demand only.
         Browse mode shows the grid alone; a panel opens only when its
         collection is routed to (card click / deep link). */
      s.hidden = !inSingle || s.id !== hash;
    });
    allLinkWrap.hidden = !inSingle;
    statusEl.hidden = true;
    if (inSingle) {
      var target = document.getElementById(hash);
      if (target) target.scrollIntoView({ block: 'start' });
      var h = target && target.querySelector('h2');
      if (h) document.title = h.textContent + ' · Activity Vault';
    } else {
      document.title = 'Curated collections · Activity Vault';
    }
  }

  function init() {
    if (!grid || !sectionsHost) return;
    Promise.all([
      fetch('data/v1/collections.json').then(function (r) { return r.json(); }),
      fetch('data/v1/activities.json').then(function (r) { return r.json(); })
    ]).then(function (res) {
      var collections = res[0].collections || [];
      var updated = res[0].updated || '';
      var actmap = {};
      (res[1].activities || []).forEach(function (a) { actmap[a.id] = a; });
      renderGlance(collections, actmap, updated);
      renderTop6(collections, actmap);
      renderGrid(collections, actmap);
      collections.forEach(function (c, ci) {
        sectionsHost.appendChild(renderSection(c, actmap, ci));
      });
      applyRoute(collections);
      window.addEventListener('hashchange', function () { applyRoute(collections); });
      statusEl.textContent = collections.length + ' curated collections loaded.';
      /* VP-0008: the hero numeral derives from the same loaded data as
         the grid and the status line. It can never drift stale again. */
      var heroCount = document.getElementById('coll-hero-count');
      if (heroCount) heroCount.textContent = numberWord(collections.length);
    }).catch(function () {
      statusEl.textContent = 'Could not load the collections. Check your connection and reload.';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
