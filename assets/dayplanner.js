/* Activity Vault — Day Planner page logic (Wave 33 flagship).
   Thin DOM layer over window.VaultDayPlanner (pure core) +
   window.VaultPlanner (bucket meter). All filtering decisions
   live in the core; this file only renders and wires events. */
(function () {
  'use strict';
  var DP = window.VaultDayPlanner;
  var VP = window.VaultPlanner;
  if (!DP) return;

  var state = { date: null, age: 3, slots: [] };
  var acts = [], byId = {}, catName = {}, catBucket = {};

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function usedIds(exceptSlot) {
    return state.slots.filter(function (s) { return s.slot !== exceptSlot; })
      .map(function (s) { return s.activityId; }).filter(Boolean);
  }
  function dateLabel() {
    if (!state.date) return '';
    var d = new Date(state.date + 'T12:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  function slotState(slotId) {
    for (var i = 0; i < state.slots.length; i++) if (state.slots[i].slot === slotId) return state.slots[i];
    return null;
  }

  function renderSlots() {
    var wrap = el('dp-slots');
    wrap.innerHTML = DP.DAY_SLOTS.map(function (slot) {
      var cur = slotState(slot.id);
      var curId = cur && cur.activityId;
      var used = usedIds(slot.id);
      var pool = DP.slotPool(acts, slot, { age: state.age, used: {} })
        .filter(function (a) { return used.indexOf(a.id) === -1 || a.id === curId; });
      var a = curId && byId[curId];
      var facts = a
        ? 'Ages ' + a.age_min + '–' + a.age_max + ' · ' + a.time_min + '–' + a.time_max +
          ' min · Group ' + a.group_min + '–' + a.group_max + (a.no_prep ? ' · no prep' : '')
        : '';
      var opts = pool.slice().sort(function (x, y) { return x.name < y.name ? -1 : 1; }).map(function (p) {
        return '<option value="' + esc(p.id) + '"' + (p.id === curId ? ' selected' : '') + '>' +
          esc(p.name) + ' (' + p.time_min + '–' + p.time_max + ' min)</option>';
      }).join('');
      var body;
      if (!pool.length) {
        body = '<p class="dp-empty">Nothing in the catalog honestly fits this slot for age ' +
          state.age + ' — the slot stays open rather than stretching a record that does not belong here.</p>';
      } else if (!a) {
        body = '<p class="dp-empty">Open slot — pick from ' + pool.length + ' honest fits below, or compose the day.</p>' +
          '<label class="flabel" for="sel-' + slot.id + '">Activity</label>' +
          '<select class="dp-select" id="sel-' + slot.id + '" data-slot="' + slot.id + '">' +
          '<option value="">— choose —</option>' + opts + '</select>';
      } else {
        body = '<p class="dp-tagline">' + esc(a.tagline) + '</p>' +
          '<p class="dp-facts">' + esc(facts) + ' · ' +
          a.categories.map(function (c) { return esc(catName[c] || c); }).join(' · ') +
          ' · <a href="activity/' + esc(a.id) + '.html">Open the card</a></p>' +
          '<label class="flabel" for="sel-' + slot.id + '">Activity</label>' +
          '<div class="dp-pickrow"><select class="dp-select" id="sel-' + slot.id + '" data-slot="' + slot.id + '">' + opts + '</select>' +
          '<button class="btn btn-ghost btn-small" type="button" data-swap="' + slot.id + '">🎲 Swap</button></div>';
      }
      return '<article class="dp-card" data-slot-card="' + slot.id + '">' +
        '<header class="dp-card-head"><span class="dp-glyph" aria-hidden="true">' + slot.glyph + '</span>' +
        '<div><h3>' + slot.clock + ' · ' + slot.label + '</h3><p class="dp-hint">' + esc(slot.hint) + '</p></div></header>' +
        body + '</article>';
    }).join('');

    wrap.querySelectorAll('.dp-select').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var s = slotState(sel.getAttribute('data-slot'));
        if (s) { s.activityId = sel.value || null; renderAll(); }
      });
    });
    wrap.querySelectorAll('[data-swap]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var slotId = btn.getAttribute('data-swap');
        var slot = DP.slotById(slotId);
        var s = slotState(slotId);
        var next = DP.swapCandidate(acts, slot, s.activityId, usedIds(slotId), state.age);
        if (next) { s.activityId = next; renderAll(); }
        else {
          el('dp-status').textContent = 'No other honest fit for the ' + slot.label +
            ' slot at age ' + state.age + ' — this is the one.';
        }
      });
    });
  }

  function renderSheet() {
    el('sheet-title').textContent = state.starter ? '🧸 Just Three Starter Day' : 'My day';
    var meta = [];
    if (dateLabel()) meta.push(dateLabel());
    meta.push('Room age: ' + state.age);
    var totals = DP.dayTotals(state.slots, byId);
    if (totals.filled) meta.push(totals.filled + ' of ' + totals.total + ' slots filled · ' +
      totals.minMinutes + '–' + totals.maxMinutes + ' min of activities');
    el('sheet-meta').textContent = meta.join(' · ');
    el('sheet-rows').innerHTML = state.slots.map(function (s) {
      var slot = DP.slotById(s.slot);
      var a = s.activityId && byId[s.activityId];
      if (!a) {
        return '<div class="day-sheet-row day-sheet-open"><div class="day-sheet-when">' +
          slot.clock + '<br>' + slot.glyph + ' ' + slot.label + '</div>' +
          '<div class="day-sheet-what"><p class="day-sheet-name">— open slot —</p>' +
          '<p class="day-sheet-sub">Nothing in the catalog honestly fits this slot at this age.</p></div></div>';
      }
      var mats = (a.materials || []).slice(0, 4).map(function (m) { return m.item; }).join(' · ');
      return '<div class="day-sheet-row"><div class="day-sheet-when">' + slot.clock + '<br>' +
        slot.glyph + ' ' + slot.label + '</div><div class="day-sheet-what">' +
        '<p class="day-sheet-name">' + esc(a.name) + '</p>' +
        '<p class="day-sheet-sub">' + esc(a.tagline) + '</p>' +
        '<p class="day-sheet-facts">Ages ' + a.age_min + '–' + a.age_max + ' · ' + a.time_min + '–' +
        a.time_max + ' min · Group ' + a.group_min + '–' + a.group_max +
        (a.no_prep ? ' · no prep' : '') + ' · ' +
        a.categories.map(function (c) { return esc(catName[c] || c); }).join(' · ') +
        ' · activity/' + esc(a.id) + '.html</p>' +
        (mats ? '<p class="day-sheet-mats">Bring: ' + esc(mats) + '</p>' : '') +
        '</div></div>';
    }).join('');
    var t = DP.dayTotals(state.slots, byId);
    el('dp-summary').textContent = t.filled
      ? 'Day so far: ' + t.filled + ' of ' + t.total + ' slots filled · ' + t.minMinutes + '–' +
        t.maxMinutes + ' minutes of activities · every pick a real catalog record covering age ' + state.age + '.'
      : 'No slots filled yet — compose the day, load the starter, or pick slot by slot.';
  }

  function renderAll() { renderSlots(); renderSheet(); }

  function setDay(day, starter) {
    state.slots = day.slots.map(function (s) { return { slot: s.slot, activityId: s.activityId }; });
    state.starter = !!starter;
    renderAll();
  }

  function init() {
    var today = new Date();
    var iso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') +
      '-' + String(today.getDate()).padStart(2, '0');
    state.date = iso;
    el('dp-date').value = iso;
    state.slots = DP.DAY_SLOTS.map(function (s) { return { slot: s.id, activityId: null }; });

    el('dp-date').addEventListener('change', function () { state.date = this.value; renderSheet(); });
    el('dp-age').addEventListener('change', function () {
      state.age = parseInt(this.value, 10);
      state.starter = false;
      // Honest re-filter: a pick that no longer covers the new age leaves the slot.
      state.slots.forEach(function (s) {
        var a = s.activityId && byId[s.activityId];
        if (a && !DP.fitsAge(a, state.age)) s.activityId = null;
      });
      renderAll();
    });
    el('dp-compose').addEventListener('click', function () {
      var day = DP.composeDay(acts, { age: state.age, seed: Math.floor(Math.random() * 1e9) });
      setDay(day, false);
      var t = DP.dayTotals(state.slots, byId);
      el('dp-status').textContent = 'Composed a day for age ' + state.age + ': ' + t.filled +
        ' of ' + t.total + ' slots filled from the real catalog.';
    });
    el('dp-starter').addEventListener('click', function () {
      state.age = 3;
      el('dp-age').value = '3';
      setDay(DP.starterDay(acts), true);
      el('dp-status').textContent = 'The Just Three starter day: every slot filled from a record banded for three-year-olds only.';
    });
    el('dp-print').addEventListener('click', function () { window.print(); });
    el('dp-copy').addEventListener('click', function () {
      var text = DP.daySheetText(
        { title: state.starter ? 'Just Three Starter Day' : 'My day', dateLabel: dateLabel(), age: state.age, slots: state.slots },
        byId, function (c) { return catName[c] || c; });
      function done() { el('dp-copy-status').textContent = 'Day copied — paste it anywhere.'; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else { done(); }
    });

    // A first day, pre-composed: the starter, so the sheet never opens blank.
    setDay(DP.starterDay(acts), true);
    el('dp-status').textContent = 'Pre-loaded with the Just Three starter day — compose your own above, or swap any slot.';
  }

  Promise.all([
    fetch('data/activities.json').then(function (r) { return r.json(); }),
    fetch('data/categories.json').then(function (r) { return r.json(); }),
    fetch('data/balance-buckets.json').then(function (r) { return r.json(); })
  ]).then(function (res) {
    acts = res[0];
    acts.forEach(function (a) { byId[a.id] = a; });
    res[1].forEach(function (c) { catName[c.id] = c.name; });
    if (VP) catBucket = VP.buildCatBucket(res[2].mapping);
    init();
  }).catch(function () {
    el('dp-status').textContent = 'The catalog could not be loaded — the day sheet is unavailable right now.';
  });
})();
