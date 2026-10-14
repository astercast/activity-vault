/* Activity Vault, The Kit Bag page logic (Wave 34 flagship).
   Thin DOM layer over window.VaultKitBag (pure core). All
   filtering and aggregation decisions live in the core; this
   file only renders and wires events. */
(function () {
  'use strict';
  var KB = window.VaultKitBag;
  if (!KB) return;

  var state = { date: null, age: 6, slots: [] };
  var acts = [], byId = {}, catName = {};

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
  function picks() {
    return state.slots.map(function (s) { return s.activityId && byId[s.activityId]; }).filter(Boolean);
  }

  function renderSlots() {
    var wrap = el('kb-slots');
    wrap.innerHTML = KB.BAG_SLOTS.map(function (slot) {
      var cur = slotState(slot.id);
      var curId = cur && cur.activityId;
      var used = usedIds(slot.id);
      var pool = KB.slotPool(acts, slot, { age: state.age, used: {} })
        .filter(function (a) { return used.indexOf(a.id) === -1 || a.id === curId; });
      var a = curId && byId[curId];
      var body;
      if (!pool.length) {
        body = '<p class="kb-empty">Nothing in the rainy-day catalog honestly fits this role at age ' +
          state.age + '. The slot stays open rather than borrowing a record that does not belong in this bag.</p>';
      } else if (!a) {
        body = '<p class="kb-empty">Open slot, pick from ' + pool.length + ' honest fits below, or pack the bag.</p>' +
          '<label class="flabel" for="sel-' + slot.id + '">Activity</label>' +
          '<select class="kb-select" id="sel-' + slot.id + '" data-slot="' + slot.id + '"><option value="">, choose, </option>' +
          pool.slice().sort(function (x, y) { return x.name < y.name ? -1 : 1; }).map(function (p) {
            return '<option value="' + esc(p.id) + '">' + esc(p.name) + ' (' + p.time_min + '–' + p.time_max + ' min)</option>';
          }).join('') + '</select>';
      } else {
        body = '<p class="kb-tagline">' + esc(a.tagline) + '</p>' +
          '<p class="kb-facts">Ages ' + a.age_min + '–' + a.age_max + ' · ' + a.time_min + '–' + a.time_max +
          ' min · Group ' + a.group_min + '–' + a.group_max + (a.no_prep ? ' · no prep' : '') + ' · ' +
          a.categories.map(function (c) { return esc(catName[c] || c); }).join(' · ') +
          ' · <a href="activity/' + esc(a.id) + '.html">Open the card</a></p>' +
          '<p class="kb-mats"><strong>Packs:</strong> ' +
          ((a.materials || []).length
            ? a.materials.map(function (m) { return esc(m.item); }).join(' · ')
: 'nothing. This one needs no materials') + '</p>' +
          '<label class="flabel" for="sel-' + slot.id + '">Activity</label>' +
          '<div class="kb-pickrow"><select class="kb-select" id="sel-' + slot.id + '" data-slot="' + slot.id + '">' +
          pool.slice().sort(function (x, y) { return x.name < y.name ? -1 : 1; }).map(function (p) {
            return '<option value="' + esc(p.id) + '"' + (p.id === curId ? ' selected' : '') + '>' +
              esc(p.name) + ' (' + p.time_min + '–' + p.time_max + ' min)</option>';
          }).join('') + '</select>' +
          '<button class="btn btn-ghost btn-small" type="button" data-swap="' + slot.id + '">🎲 Swap</button></div>';
      }
      return '<article class="kb-card" data-slot-card="' + slot.id + '">' +
        '<header class="kb-card-head"><span class="kb-glyph" aria-hidden="true">' + slot.glyph + '</span>' +
        '<div><h3>' + slot.clock + ' · ' + slot.label + '</h3><p class="kb-hint">' + esc(slot.hint) + '</p></div></header>' +
        body + '</article>';
    }).join('');

    wrap.querySelectorAll('.kb-select').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var s = slotState(sel.getAttribute('data-slot'));
        if (s) { s.activityId = sel.value || null; renderAll(); }
      });
    });
    wrap.querySelectorAll('[data-swap]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var slotId = btn.getAttribute('data-swap');
        var slot = KB.slotById(slotId);
        var s = slotState(slotId);
        var next = KB.swapCandidate(acts, slot, s.activityId, usedIds(slotId), state.age);
        if (next) { s.activityId = next; renderAll(); }
        else {
          el('kb-status').textContent = 'No other honest fit for the ' + slot.label +
            ' role at age ' + state.age + '. This is the one.';
        }
      });
    });
  }

  function renderSheet() {
    var day = picks();
    var kit = KB.aggregateKit(day);
    var totals = KB.bagTotals(state.slots, byId);
    var meta = [];
    if (dateLabel()) meta.push(dateLabel());
    meta.push('Room age: ' + state.age);
    if (totals.filled) meta.push(totals.filled + ' of ' + totals.total + ' roles filled · ' +
      totals.minMinutes + '–' + totals.maxMinutes + ' min of activities');
    meta.push(kit.lineCount + ' kit lines from ' + kit.rawTotal + ' listed materials');
    el('kit-sheet-meta').textContent = meta.join(' · ');

    el('kit-sheet-day').innerHTML = state.slots.map(function (s) {
      var slot = KB.slotById(s.slot);
      var a = s.activityId && byId[s.activityId];
      if (!a) {
        return '<div class="kit-sheet-row kit-sheet-open"><div class="kit-sheet-when">' +
          slot.clock + '<br>' + slot.glyph + ' ' + slot.label + '</div>' +
          '<div><p class="kit-sheet-name">, open slot, </p>' +
          '<p class="kit-sheet-sub">Nothing in the rainy-day catalog honestly fits this role at this age.</p></div></div>';
      }
      return '<div class="kit-sheet-row"><div class="kit-sheet-when">' + slot.clock + '<br>' +
        slot.glyph + ' ' + slot.label + '</div><div>' +
        '<p class="kit-sheet-name">' + esc(a.name) + '</p>' +
        '<p class="kit-sheet-sub">Ages ' + a.age_min + '–' + a.age_max + ' · ' + a.time_min + '–' +
        a.time_max + ' min · ' + a.categories.map(function (c) { return esc(catName[c] || c); }).join(' · ') +
        ' · activity/' + esc(a.id) + '.html</p></div></div>';
    }).join('');

    el('kit-sheet-groups').innerHTML = kit.groups.map(function (g) {
      if (!g.items.length) return '';
      return '<section class="kit-group"><h3>' + g.glyph + ' ' + esc(g.label) + '</h3><ul class="kit-list">' +
        g.items.map(function (e) {
          var variants = e.variants.filter(function (v) { return v !== e.item; })
            .map(function (v) { return '<span class="kit-variant">also listed as: ' + esc(v) + '</span>'; }).join(' ');
          return '<li><span class="kit-box" aria-hidden="true">☐</span> <span class="kit-item">' +
            esc(e.item) + '</span> <span class="kit-for">, for: ' +
            e.activities.map(function (x) { return esc(x.name); }).join(', ') + '</span>' +
            (variants ? ' ' + variants : '') + '</li>';
        }).join('') + '</ul></section>';
    }).join('') + (kit.noMaterials.length
      ? '<p class="kit-none">Nothing to pack for: ' +
        kit.noMaterials.map(function (n) { return esc(n.name); }).join(', ') +
        '. Those activities need no materials at all.</p>'
      : '');

    el('kb-summary').textContent = totals.filled
      ? 'Bag so far: ' + kit.lineCount + ' lines to pack (from ' + kit.rawTotal +
        ' materials listed across ' + totals.filled + ' activities' +
        (kit.sharedCount ? '; ' + kit.sharedCount + ' item' + (kit.sharedCount > 1 ? 's' : '') +
          ' shared by more than one activity, listed once' : '') +
        '). Every line is copied from a real activity\u2019s materials list.'
: 'No roles filled yet, pack the bag, or pick role by role.';
  }

  function renderAll() { renderSlots(); renderSheet(); }

  function setBag(bag) {
    state.slots = bag.slots.map(function (s) { return { slot: s.slot, activityId: s.activityId }; });
    renderAll();
  }

  function init() {
    var today = new Date();
    var iso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') +
      '-' + String(today.getDate()).padStart(2, '0');
    state.date = iso;
    el('kb-date').value = iso;
    state.slots = KB.BAG_SLOTS.map(function (s) { return { slot: s.id, activityId: null }; });

    el('kb-date').addEventListener('change', function () { state.date = this.value; renderSheet(); });
    el('kb-age').addEventListener('change', function () {
      state.age = parseInt(this.value, 10);
      state.slots.forEach(function (s) {
        var a = s.activityId && byId[s.activityId];
        if (a && !KB.fitsScenario(a, state.age)) s.activityId = null;
      });
      renderAll();
    });
    el('kb-compose').addEventListener('click', function () {
      var bag = KB.composeBag(acts, { age: state.age, seed: Math.floor(Math.random() * 1e9) });
      setBag(bag);
      var t = KB.bagTotals(state.slots, byId);
      el('kb-status').textContent = 'Packed a rainy-day bag for age ' + state.age + ': ' + t.filled +
        ' of ' + t.total + ' roles filled from the real rainy-day shelf.';
    });
    el('kb-print').addEventListener('click', function () { window.print(); });
    el('kb-copy').addEventListener('click', function () {
      var text = KB.kitBagText(
        { dateLabel: dateLabel(), age: state.age, slots: state.slots },
        byId, function (c) { return catName[c] || c; });
      function done() { el('kb-copy-status').textContent = 'Kit list copied, paste it anywhere.'; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else { done(); }
    });

    setBag(KB.composeBag(acts, { age: state.age, seed: 34 }));
    el('kb-status').textContent = 'Pre-packed for age ' + state.age +
      ', repack above, swap any role, or print the kit list.';
  }

  Promise.all([
    fetch('data/activities.json').then(function (r) { return r.json(); }),
    fetch('data/categories.json').then(function (r) { return r.json(); })
  ]).then(function (res) {
    acts = res[0];
    acts.forEach(function (a) { byId[a.id] = a; });
    res[1].forEach(function (c) { catName[c.id] = c.name; });
    init();
  }).catch(function () {
    el('kb-status').textContent = 'The catalog could not be loaded. The Kit Bag is unavailable right now.';
  });
})();
