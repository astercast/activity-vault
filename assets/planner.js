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

    if (!pool.length) {
      note.textContent = 'No activities match those constraints — try loosening them.';
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
      for (var s = 0; s < opts.slots; s++) {
        var a = pick(pool, usedIds, weekCats.concat(dayCats), opts);
        var slot = el('div', 'slot');
        slot.appendChild(el('div', 'slot-time', 'Slot ' + (s + 1)));
        if (a) {
          var nm = el('div', 'slot-name');
          var link = el('a', null, a.name);
          link.href = 'activity/' + a.id + '.html';
          nm.appendChild(link);
          slot.appendChild(nm);
          slot.appendChild(el('p', 'slot-why', whyFits(a, opts)));
          if (usedIds.indexOf(a.id) === -1 || !opts.allowRepeats) usedIds.push(a.id);
          a.categories.forEach(function (c) {
            if (dayCats.indexOf(c) === -1) dayCats.push(c);
            if (weekCats.indexOf(c) === -1) weekCats.push(c);
          });
        } else {
          slot.appendChild(el('div', 'slot-name', '— open slot —'));
          slot.appendChild(el('p', 'slot-why', 'Not enough unique activities matched. Loosen a filter.'));
        }
        card.appendChild(slot);
      }
      out.appendChild(card);
    });

    var actions = document.getElementById('plan-actions');
    actions.hidden = false;
    note.textContent = note.textContent ||
      ('Planned ' + totalSlots + ' slots from ' + pool.length + ' matching activities.');
  }

  function buildForm() {
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
