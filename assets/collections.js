/* Activity Vault — curated collections page (wave 9).
   Renders the 8 hand-picked collections from api/v1/collections.json, resolves
   picks against api/v1/activities.json, shows the visitor's own rating badges
   (localStorage only — never invented), printable per collection, with a
   "copy this collection" text export per collection (wave-7 pattern). */
(function () {
  'use strict';

  var grid = document.getElementById('collection-grid');
  var sectionsHost = document.getElementById('collection-sections');
  var statusEl = document.getElementById('coll-status');
  var allLinkWrap = document.getElementById('all-link-wrap');

  /* Hand links: collections that tie to a tool get a "pairs with" callout. */
  var TIES = {
    'sub-tub-essentials': { label: '🆘 Pairs with the Sub Tub kit', href: 'sub.html' },
    'winter-party-night': { label: '❄️ Pairs with the Party Planner winter theme', href: 'party.html' }
  };

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
    var s = el('span', 'rate-badge', '⭐ ' + entry.stars + '★ — your rating');
    s.setAttribute('aria-label', 'You rated this activity ' + entry.stars + ' of 5 stars');
    return s;
  }

  function facts(a) {
    return 'Ages ' + a.age_min + '–' + a.age_max + ' · ' +
      a.time_min + '–' + a.time_max + ' min · ' +
      (a.no_prep ? 'no prep' : 'some prep') + ' · ' +
      a.location.map(function (l) { return l === 'indoor' ? 'indoors' : 'outdoors'; }).join(' & ');
  }

  function renderGrid(collections) {
    grid.textContent = '';
    collections.forEach(function (c) {
      var card = el('a', 'collection-card');
      card.href = '#' + c.id;
      card.setAttribute('aria-label', c.glyph + ' ' + c.title + ': ' + c.picks.length +
        ' activities, ages ' + c.age_span[0] + ' to ' + c.age_span[1] +
        ', ' + c.time_span[0] + ' to ' + c.time_span[1] + ' minutes each');
      var glyph = el('span', 'collection-glyph', c.glyph);
      glyph.setAttribute('aria-hidden', 'true');
      card.appendChild(glyph);
      card.appendChild(el('span', 'collection-title', c.title));
      card.appendChild(el('span', 'collection-count', c.picks.length + ' activities'));
      card.appendChild(el('span', 'collection-span',
        'Ages ' + c.age_span[0] + '–' + c.age_span[1] + ' · ' +
        c.time_span[0] + '–' + c.time_span[1] + ' min'));
      grid.appendChild(card);
    });
    grid.hidden = false;
  }

  function renderSection(c, actmap) {
    var sec = el('section', 'collection-section');
    sec.id = c.id;
    sec.setAttribute('aria-labelledby', 'coll-' + c.id);

    var head = el('div', 'collection-head');
    var glyph = el('span', 'collection-glyph-lg', c.glyph);
    glyph.setAttribute('aria-hidden', 'true');
    var h2 = el('h2', 'collection-h2', c.title);
    h2.id = 'coll-' + c.id;
    head.appendChild(glyph);
    head.appendChild(h2);
    sec.appendChild(head);

    sec.appendChild(el('p', 'collection-when', 'When to reach for it: ' + c.when_to_use));

    var stats = el('p', 'collection-stats',
      c.picks.length + ' hand-picked activities · Ages ' +
      c.age_span[0] + '–' + c.age_span[1] + ' · ' +
      c.time_span[0] + '–' + c.time_span[1] + ' min each');
    sec.appendChild(stats);

    if (TIES[c.id]) {
      var tie = el('p', 'collection-tie no-print');
      var a = el('a', null, TIES[c.id].label + ' →');
      a.href = TIES[c.id].href;
      tie.appendChild(a);
      sec.appendChild(tie);
    }

    var list = el('ol', 'pick-list');
    c.picks.forEach(function (p) {
      var a = actmap[p.activity_id];
      if (!a) return; /* build-time validated; never happens */
      var li = el('li', 'pick');
      var row = el('div', 'pick-row');
      var link = el('a', 'pick-name', a.name);
      link.href = 'activity/' + a.id + '.html';
      row.appendChild(link);
      var badge = ratingBadge(a.id);
      if (badge) row.appendChild(badge);
      li.appendChild(row);
      li.appendChild(el('p', 'pick-facts', facts(a)));
      li.appendChild(el('p', 'pick-note', '💡 Why it’s here: ' + p.curator_note));
      list.appendChild(li);
    });
    sec.appendChild(list);

    var actions = el('div', 'collection-actions no-print');
    var printBtn = el('button', 'btn btn-small', '🖨️ Print this collection');
    printBtn.type = 'button';
    printBtn.addEventListener('click', function () { printOne(c.id); });
    var copyBtn = el('button', 'btn btn-small btn-ghost', '📋 Copy this collection');
    copyBtn.type = 'button';
    var copyStatus = el('span', 'copy-status');
    copyStatus.setAttribute('role', 'status');
    copyStatus.setAttribute('aria-live', 'polite');
    copyBtn.addEventListener('click', function () { copyOne(c, actmap, copyStatus); });
    actions.appendChild(printBtn);
    actions.appendChild(copyBtn);
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
      '📚 Activity Vault — ' + c.glyph + ' ' + c.title,
      'When to reach for it: ' + c.when_to_use,
      ''
    ];
    c.picks.forEach(function (p) {
      var a = actmap[p.activity_id];
      if (!a) return;
      lines.push('• ' + a.name + ' — ' + facts(a));
      lines.push('  💡 Why it’s here: ' + p.curator_note);
      if (R) {
        var entry = R.getRating(a.id);
        if (entry) {
          var rline = '  ⭐ You rated this ' + entry.stars + '/5';
          if (entry.note) rline += ' — “' + entry.note + '”';
          lines.push(rline);
        }
      }
      lines.push('  ' + baseUrl() + 'activity/' + a.id + '.html');
    });
    lines.push('');
    lines.push('View the collection: ' + baseUrl() + 'collections.html#' + c.id);
    lines.push('Your ratings are yours alone — stored only in this browser.');
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
      catch (e) { statusEl.textContent = 'Copy failed — select the text manually.'; }
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
    var sections = sectionsHost.querySelectorAll('.collection-section');
    Array.prototype.forEach.call(sections, function (s) {
      s.hidden = inSingle && s.id !== hash;
    });
    allLinkWrap.hidden = !inSingle;
    statusEl.hidden = true;
    if (inSingle) {
      var target = document.getElementById(hash);
      if (target) target.scrollIntoView({ block: 'start' });
      var h = target && target.querySelector('h2');
      if (h) document.title = h.textContent + ' — Activity Vault';
    } else {
      document.title = 'Curated collections — Activity Vault';
    }
  }

  function init() {
    if (!grid || !sectionsHost) return;
    Promise.all([
      fetch('api/v1/collections.json').then(function (r) { return r.json(); }),
      fetch('api/v1/activities.json').then(function (r) { return r.json(); })
    ]).then(function (res) {
      var collections = res[0].collections || [];
      var actmap = {};
      (res[1].activities || []).forEach(function (a) { actmap[a.id] = a; });
      renderGrid(collections);
      collections.forEach(function (c) {
        sectionsHost.appendChild(renderSection(c, actmap));
      });
      applyRoute(collections);
      window.addEventListener('hashchange', function () { applyRoute(collections); });
      statusEl.textContent = collections.length + ' curated collections loaded.';
    }).catch(function () {
      statusEl.textContent = 'Could not load the collections. Check your connection and reload.';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
