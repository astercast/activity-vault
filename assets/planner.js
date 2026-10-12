/* Activity Vault — Plan-my-week planner.
   Pick days + slots + constraints -> generates a no-repeat week plan. Printable. */
(function () {
  'use strict';

  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  var state = { activities: [], categories: [], catMap: {} };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function getForm() {
    var days = [];
    document.querySelectorAll('input[name="day"]:checked').forEach(function (c) { days.push(c.value); });
    var slots = parseInt(document.getElementById('slots-per-day').value, 10) || 2;
    var maxTime = document.getElementById('max-time').value;
    var cats = new Set();
    document.querySelectorAll('input[name="pcat"]:checked').forEach(function (c) { cats.add(c.value); });
    return {
      days: days.length ? days : DAYS.slice(),
      slots: Math.min(Math.max(slots, 1), 4),
      maxTime: maxTime ? parseInt(maxTime, 10) : null,
      cats: cats,
      noPrepOnly: document.getElementById('p-noprep').checked,
      indoorOnly: document.getElementById('p-indoor').checked,
      allowRepeats: document.getElementById('p-repeats').checked
    };
  }

  function poolFor(opts) {
    return state.activities.filter(function (a) {
      if (opts.maxTime != null && a.time_min > opts.maxTime) return false;
      if (opts.cats.size && !a.categories.some(function (c) { return opts.cats.has(c); })) return false;
      if (opts.noPrepOnly && !a.no_prep) return false;
      if (opts.indoorOnly && a.location.indexOf('indoor') === -1) return false;
      return true;
    });
  }

  function whyFits(a, opts) {
    var bits = [];
    bits.push(a.time_min + '–' + a.time_max + ' min');
    if (a.no_prep) bits.push('no prep');
    var cnames = a.categories.map(function (c) { return (state.catMap[c] || {}).name || c; });
    bits.push(cnames.slice(0, 2).join(' · '));
    return bits.join(' — ');
  }

  // Spread categories across the week: prefer an activity whose categories
  // haven't been used yet that day/week.
  function pick(pool, usedIds, usedCats, opts) {
    var cands = shuffle(pool.filter(function (a) { return usedIds.indexOf(a.id) === -1; }));
    if (!cands.length && opts.allowRepeats) cands = shuffle(pool);
    if (!cands.length) return null;
    cands.sort(function (x, y) {
      var xn = x.categories.filter(function (c) { return usedCats.indexOf(c) === -1; }).length;
      var yn = y.categories.filter(function (c) { return usedCats.indexOf(c) === -1; }).length;
      return yn - xn;
    });
    return cands[0];
  }

  function generate() {
    var opts = getForm();
    var pool = poolFor(opts);
    var out = document.getElementById('week-plan');
    var note = document.getElementById('plan-note');
    out.innerHTML = '';
    note.textContent = '';
    state.plan = [];

    if (!pool.length) {
      note.textContent = 'No activities match those constraints — try loosening them.';
      document.getElementById('plan-actions').hidden = true;
      buildPrintDeck();
      return;
    }

    var usedIds = [];
    var weekCats = [];
    var totalSlots = opts.days.length * opts.slots;
    if (!opts.allowRepeats && pool.length < totalSlots) {
      note.textContent = 'Only ' + pool.length + ' activities match, but you asked for ' +
        totalSlots + ' slots. Repeats are off — some slots may stay empty, or allow repeats.';
    }

    opts.days.forEach(function (day) {
      var card = el('section', 'day-card');
      card.appendChild(el('h3', null, day));
      var dayCats = [];
      var dayPlan = { day: day, slots: [] };
      for (var s = 0; s < opts.slots; s++) {
        var a = pick(pool, usedIds, weekCats.concat(dayCats), opts);
        var slot = el('div', 'slot');
        slot.appendChild(el('div', 'slot-time', 'Slot ' + (s + 1)));
        var slotPlan = { slot: s + 1, name: null, id: null, a: null };
        if (a) {
          var nm = el('div', 'slot-name');
          var link = el('a', null, a.name);
          link.href = 'activity/' + a.id + '.html';
          nm.appendChild(link);
          slot.appendChild(nm);
          slot.appendChild(el('p', 'slot-why', whyFits(a, opts)));
          if (usedIds.indexOf(a.id) === -1 || !opts.allowRepeats) usedIds.push(a.id);
          slotPlan.name = a.name;
          slotPlan.id = a.id;
          slotPlan.a = a;
          a.categories.forEach(function (c) {
            if (dayCats.indexOf(c) === -1) dayCats.push(c);
            if (weekCats.indexOf(c) === -1) weekCats.push(c);
          });
        } else {
          slot.appendChild(el('div', 'slot-name', '— open slot —'));
          slot.appendChild(el('p', 'slot-why', 'Not enough unique activities matched. Loosen a filter.'));
        }
        dayPlan.slots.push(slotPlan);
        card.appendChild(slot);
      }
      state.plan.push(dayPlan);
      out.appendChild(card);
    });

    buildPrintDeck();

    var actions = document.getElementById('plan-actions');
    actions.hidden = false;
    note.textContent = note.textContent ||
      ('Planned ' + totalSlots + ' slots from ' + pool.length + ' matching activities.');
  }

  function cardUrl(rel) {
    // Deep link: absolute when served over http(s), relative path otherwise.
    try { return new URL(rel, document.baseURI).href; }
    catch (e) { return rel; }
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

  function copyWeek() {
    var lines = ['📅 My week — Activity Vault', ''];
    state.plan.forEach(function (d) {
      lines.push(d.day);
      d.slots.forEach(function (s) {
        if (!s.a) { lines.push('  Slot ' + s.slot + ' — open slot'); return; }
        var a = s.a;
        lines.push('  Slot ' + s.slot + ' — ' + a.name);
        lines.push('    Ages ' + a.age_min + '–' + a.age_max + ' · ' +
          a.time_min + '–' + a.time_max + ' min · Group ' + a.group_min + '–' + a.group_max +
          (a.no_prep ? ' · no prep' : ''));
        lines.push('    ' + cardUrl('activity/' + a.id + '.html'));
      });
      lines.push('');
    });
    lines.push('Full cards: ' + cardUrl('index.html'));
    lines.push('Paste this into your newsletter or email — every link opens the right activity card.');
    copyText(lines.join('\n'), document.getElementById('copy-week-status'));
  }

  // Print deck: one full card per scheduled activity, one page each in print.
  function buildPrintDeck() {
    var host = document.getElementById('print-week-cards');
    host.textContent = '';
    state.plan.forEach(function (d) {
      d.slots.forEach(function (s) {
        if (!s.a) return;
        var a = s.a;
        var card = el('section', 'print-week-card');
        card.setAttribute('aria-label', 'Print card: ' + a.name);
        card.appendChild(el('h3', null, d.day + ' — Slot ' + s.slot));
        card.appendChild(el('h4', null, a.name));
        var dl = el('dl', 'fact-grid');
        [['Ages', a.age_min + '–' + a.age_max],
         ['Group', a.group_min + '–' + a.group_max + ' kids'],
         ['Time', a.time_min + '–' + a.time_max + ' min'],
         ['Prep', a.no_prep ? 'No prep needed' : 'Some prep needed'],
         ['Materials', a.materials.length ? a.materials.length + ' item(s)' : 'None needed'],
         ['Steps', a.steps.length + ' steps']].forEach(function (f) {
          var wrap = el('div', null);
          wrap.appendChild(el('dt', null, f[0]));
          wrap.appendChild(el('dd', null, f[1]));
          dl.appendChild(wrap);
        });
        card.appendChild(dl);
        if (a.materials.length) {
          card.appendChild(el('h4', null, 'Materials'));
          var mu = el('ul', null);
          a.materials.forEach(function (m) { mu.appendChild(el('li', null, m.item)); });
          card.appendChild(mu);
        }
        if (a.safety) card.appendChild(el('p', null, '⚠️ ' + a.safety));
        card.appendChild(el('p', 'print-url', 'Full card — ' + cardUrl('activity/' + a.id + '.html')));
        host.appendChild(card);
      });
    });
  }

  var SEASON_LABELS = {
    'season:fall': '🎃 Fall', 'season:winter': '❄️ Winter',
    'holiday:halloween': '👻 Halloween', 'holiday:dia-de-muertos': '💀 Día de los Muertos',
    'holiday:christmas': '🎄 Christmas', 'holiday:hanukkah': '🕎 Hanukkah',
    'holiday:kwanzaa': '🖤 Kwanzaa', 'holiday:new-year': '🎆 New Year',
    'theme:spooky': '🕸️ Spooky (not scary)'
  };
  var SEASON_BY_MONTH = { 8: 'season:fall', 9: 'season:fall', 10: 'season:fall',
                          11: 'season:winter', 0: 'season:winter', 1: 'season:winter' };
  var HOLIDAY_BY_MONTH = {
    9: ['holiday:halloween', 'holiday:dia-de-muertos'],
    10: ['holiday:hanukkah', 'holiday:kwanzaa'],
    11: ['holiday:christmas', 'holiday:new-year', 'holiday:hanukkah', 'holiday:kwanzaa'],
    0: ['holiday:new-year', 'holiday:hanukkah', 'holiday:kwanzaa']
  };

  function buildSeasonStrip() {
    var host = document.getElementById('season-strip');
    if (!host) return;
    var month = new Date().getMonth();
    var tags = [];
    if (SEASON_BY_MONTH[month]) tags.push(SEASON_BY_MONTH[month]);
    (HOLIDAY_BY_MONTH[month] || []).forEach(function (t) { tags.push(t); });
    var chips = [];
    tags.forEach(function (t) {
      var n = state.activities.filter(function (a) {
        return (a.tags || []).indexOf(t) !== -1;
      }).length;
      if (n) chips.push({ tag: t, n: n });
    });
    if (!chips.length) { host.hidden = true; return; }
    host.textContent = '';
    host.appendChild(el('span', 'season-strip-title', '🌿 This season in the Vault:'));
    var row = el('div', 'chip-row');
    chips.forEach(function (c) {
      var a = el('a', 'chip chip-link', SEASON_LABELS[c.tag] + ' (' + c.n + ')');
      a.href = 'index.html?tag=' + encodeURIComponent(c.tag);
      row.appendChild(a);
    });
    host.appendChild(row);
    host.hidden = false;
  }

  function buildForm() {
    buildSeasonStrip();
    // category checkboxes
    var host = document.getElementById('pcat-row');
    state.categories.forEach(function (c) {
      var lab = el('label', 'chip');
      lab.style.setProperty('--cat', c.color);
      var cb = el('input');
      cb.type = 'checkbox'; cb.name = 'pcat'; cb.value = c.id;
      cb.style.accentColor = c.color;
      cb.addEventListener('change', function () {
        lab.setAttribute('aria-pressed', cb.checked ? 'true' : 'false');
      });
      lab.setAttribute('aria-pressed', 'false');
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(' ' + c.glyph + ' ' + c.name));
      host.appendChild(lab);
    });

    document.getElementById('generate').addEventListener('click', generate);
    document.getElementById('print-plan').addEventListener('click', function () { window.print(); });
    document.getElementById('copy-week').addEventListener('click', copyWeek);
    document.getElementById('regenerate').addEventListener('click', generate);
  }

  function init() {
    if (!document.getElementById('week-plan')) return;
    Promise.all([
      fetch('data/activities.json').then(function (r) { return r.json(); }),
      fetch('data/categories.json').then(function (r) { return r.json(); })
    ]).then(function (res) {
      state.activities = res[0];
      state.categories = res[1];
      res[1].forEach(function (c) { state.catMap[c.id] = c; });
      buildForm();
    }).catch(function () {
      document.getElementById('plan-note').textContent =
        'Could not load the activity library. Check your connection and reload.';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
