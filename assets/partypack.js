/* Activity Vault — The Party Pack page logic (Wave 35 flagship).
   Thin DOM layer over window.VaultPartyPack (pure core). All
   filtering, coverage, and aggregation decisions live in the
   cores (partypack-core.js, which composes kitbag-core.js);
   this file only renders and wires events. */
(function () {
  'use strict';
  var PP = window.VaultPartyPack;
  if (!PP) return;

  var state = { occasion: 'birthday', ageBand: '5-6', groupSize: 16, slots: [] };
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
  function slotState(slotId) {
    for (var i = 0; i < state.slots.length; i++) if (state.slots[i].slot === slotId) return state.slots[i];
    return null;
  }
  function picks() {
    return state.slots.map(function (s) { return s.activityId && byId[s.activityId]; }).filter(Boolean);
  }
  function opts() {
    return { occasion: state.occasion, ageBand: state.ageBand, groupSize: state.groupSize };
  }

  function renderCoverage() {
    var box = el('pp-coverage');
    var rep = PP.coverageReport(acts, Object.assign(opts(), { seed: 35 }));
    if (!rep.thin && rep.full) { box.hidden = true; box.innerHTML = ''; return; }
    var occ = PP.occasionById(state.occasion);
    var nearest = PP.nearestOptions(acts, opts());
    var html = '<p class="pp-thin-head">🧮 Honest coverage check: ' + esc(occ ? occ.label : state.occasion) +
      ' at ' + esc(PP.bandById(state.ageBand).label) + ' for a group of ' + state.groupSize +
      ' holds <strong>' + rep.poolSize + ' real activities</strong> — the party arc has ' +
      rep.slotsTotal + ' parts, so this plan fills ' + rep.slotsFilled + ' of ' + rep.slotsTotal +
      ' honestly and leaves the rest open. The Pack never pads a plan with invented activities.</p>';
    if (nearest.length) {
      html += '<p class="pp-thin-sub">Nearest real options — each checked against the catalog just now:</p>' +
        '<div class="pp-nearest">' + nearest.map(function (n, i) {
          return '<button class="btn btn-ghost btn-small" type="button" data-nearest="' + i + '">' +
            esc(n.change) + ' — ' + n.slotsFilled + ' of ' + n.slotsTotal + ' parts fill' +
            ' (' + n.poolSize + ' real activities)</button>';
        }).join('') + '</div>';
    }
    box.innerHTML = html;
    box.hidden = false;
    box.querySelectorAll('[data-nearest]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var n = nearest[parseInt(btn.getAttribute('data-nearest'), 10)];
        state.occasion = n.occasion;
        state.ageBand = n.ageBand;
        state.groupSize = n.groupSize;
        el('pp-occasion').value = n.occasion;
        el('pp-band').value = n.ageBand;
        el('pp-size').value = String(n.groupSize);
        setParty(PP.composeParty(acts, Object.assign(opts(), { seed: 35 })));
        el('pp-status').textContent = 'Switched to the nearest real option: ' + n.change + '.';
      });
    });
  }

  function renderSlots() {
    var wrap = el('pp-slots');
    wrap.innerHTML = PP.PARTY_SLOTS.map(function (slot) {
      var cur = slotState(slot.id);
      var curId = cur && cur.activityId;
      var used = usedIds(slot.id);
      var pool = PP.slotPool(acts, slot, Object.assign(opts(), { used: {} }))
        .filter(function (a) { return used.indexOf(a.id) === -1 || a.id === curId; });
      var a = curId && byId[curId];
      var body;
      if (!pool.length) {
        body = '<p class="pp-empty">Nothing in the catalog honestly fits this part of the arc for this ' +
          'occasion, age band, and group size — the slot stays open rather than borrowing a record ' +
          'that does not belong at this party.</p>';
      } else if (!a) {
        body = '<p class="pp-empty">Open slot — pick from ' + pool.length + ' honest fits below, or pack the party.</p>' +
          '<label class="flabel" for="sel-' + slot.id + '">Activity</label>' +
          '<select class="pp-select" id="sel-' + slot.id + '" data-slot="' + slot.id + '"><option value="">— choose —</option>' +
          pool.slice().sort(function (x, y) { return x.name < y.name ? -1 : 1; }).map(function (p) {
            return '<option value="' + esc(p.id) + '">' + esc(p.name) + ' (' + p.time_min + '–' + p.time_max + ' min)</option>';
          }).join('') + '</select>';
      } else {
        body = '<p class="pp-tagline">' + esc(a.tagline) + '</p>' +
          '<p class="pp-facts">Ages ' + a.age_min + '–' + a.age_max + ' · ' + a.time_min + '–' + a.time_max +
          ' min · Group ' + a.group_min + '–' + a.group_max + (a.no_prep ? ' · no prep' : '') + ' · ' +
          a.categories.map(function (c) { return esc(catName[c] || c); }).join(' · ') +
          ' · <a href="activity/' + esc(a.id) + '.html">Open the card</a></p>' +
          '<label class="flabel" for="sel-' + slot.id + '">Activity</label>' +
          '<div class="pp-pickrow"><select class="pp-select" id="sel-' + slot.id + '" data-slot="' + slot.id + '">' +
          pool.slice().sort(function (x, y) { return x.name < y.name ? -1 : 1; }).map(function (p) {
            return '<option value="' + esc(p.id) + '"' + (p.id === curId ? ' selected' : '') + '>' +
              esc(p.name) + ' (' + p.time_min + '–' + p.time_max + ' min)</option>';
          }).join('') + '</select>' +
          '<button class="btn btn-ghost btn-small" type="button" data-swap="' + slot.id + '">🎲 Swap</button></div>';
      }
      return '<article class="pp-card" data-slot-card="' + slot.id + '">' +
        '<header class="pp-card-head"><span class="pp-glyph" aria-hidden="true">' + slot.glyph + '</span>' +
        '<div><h3>' + slot.clock + ' · ' + slot.label + '</h3><p class="pp-hint">' + esc(slot.hint) + '</p></div></header>' +
        body + '</article>';
    }).join('');

    wrap.querySelectorAll('.pp-select').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var s = slotState(sel.getAttribute('data-slot'));
        if (s) { s.activityId = sel.value || null; renderAll(); }
      });
    });
    wrap.querySelectorAll('[data-swap]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var slotId = btn.getAttribute('data-swap');
        var slot = PP.slotById(slotId);
        var s = slotState(slotId);
        var next = PP.swapCandidate(acts, slot, s.activityId, usedIds(slotId), opts());
        if (next) { s.activityId = next; renderAll(); }
        else {
          el('pp-status').textContent = 'No other honest fit for the ' + slot.label +
            ' part at this occasion, age band, and group size — this is the one.';
        }
      });
    });
  }

  function renderSheet() {
    var day = picks();
    var kit = PP.partyKit(day);
    var totals = PP.partyTotals(state.slots, byId);
    var occ = PP.occasionById(state.occasion);
    var meta = [];
    meta.push((occ ? occ.glyph + ' ' + occ.label : state.occasion));
    meta.push(PP.bandById(state.ageBand).label);
    meta.push('Group of ' + state.groupSize);
    if (totals.filled) meta.push(totals.filled + ' of ' + totals.total + ' parts filled · ' +
      totals.minMinutes + '–' + totals.maxMinutes + ' min of activities');
    if (kit) meta.push(kit.lineCount + ' pack lines from ' + kit.rawTotal + ' listed materials');
    el('party-sheet-meta').textContent = meta.join(' · ');

    el('party-sheet-rows').innerHTML = state.slots.map(function (s) {
      var slot = PP.slotById(s.slot);
      var a = s.activityId && byId[s.activityId];
      if (!a) {
        return '<div class="party-sheet-row party-sheet-open"><div class="party-sheet-when">' +
          slot.clock + '<br>' + slot.glyph + ' ' + slot.label + '</div>' +
          '<div><p class="party-sheet-name">— open slot —</p>' +
          '<p class="party-sheet-sub">Nothing in the catalog honestly fits this part of the arc at this occasion, age band, and group size.</p></div></div>';
      }
      return '<div class="party-sheet-row"><div class="party-sheet-when">' + slot.clock + '<br>' +
        slot.glyph + ' ' + slot.label + '</div><div>' +
        '<p class="party-sheet-name">' + esc(a.name) + '</p>' +
        '<p class="party-sheet-sub">Ages ' + a.age_min + '–' + a.age_max + ' · ' + a.time_min + '–' +
        a.time_max + ' min · Group ' + a.group_min + '–' + a.group_max + ' · ' +
        a.categories.map(function (c) { return esc(catName[c] || c); }).join(' · ') +
        ' · activity/' + esc(a.id) + '.html</p></div></div>';
    }).join('');

    el('party-sheet-bag').innerHTML = kit ? kit.groups.map(function (g) {
      if (!g.items.length) return '';
      return '<section class="kit-group"><h3>' + g.glyph + ' ' + esc(g.label) + '</h3><ul class="kit-list">' +
        g.items.map(function (e) {
          var variants = e.variants.filter(function (v) { return v !== e.item; })
            .map(function (v) { return '<span class="kit-variant">also listed as: ' + esc(v) + '</span>'; }).join(' ');
          return '<li><span class="kit-box" aria-hidden="true">☐</span> <span class="kit-item">' +
            esc(e.item) + '</span> <span class="kit-for">— for: ' +
            e.activities.map(function (x) { return esc(x.name); }).join(', ') + '</span>' +
            (variants ? ' ' + variants : '') + '</li>';
        }).join('') + '</ul></section>';
    }).join('') + (kit.noMaterials.length
      ? '<p class="kit-none">Nothing to pack for: ' +
        kit.noMaterials.map(function (n) { return esc(n.name); }).join(', ') +
        ' — those activities need no materials at all.</p>'
      : '') : '';

    el('pp-summary').textContent = totals.filled
      ? 'Party so far: ' + totals.filled + ' of ' + totals.total + ' parts filled' +
        (kit ? '; the party bag holds ' + kit.lineCount + ' lines to pack (from ' + kit.rawTotal +
          ' materials listed across ' + totals.filled + ' activities' +
          (kit.sharedCount ? '; ' + kit.sharedCount + ' item' + (kit.sharedCount > 1 ? 's' : '') +
            ' shared by more than one activity, listed once' : '') + ')' : '') +
        '. Every pick and every line is copied from a real Activity Vault record.'
      : 'No parts filled yet — pack the party, or pick part by part.';
  }

  function renderAll() { renderCoverage(); renderSlots(); renderSheet(); }

  function setParty(party) {
    state.slots = party.slots.map(function (s) { return { slot: s.slot, activityId: s.activityId }; });
    renderAll();
  }

  function init() {
    state.slots = PP.PARTY_SLOTS.map(function (s) { return { slot: s.id, activityId: null }; });

    el('pp-occasion').addEventListener('change', function () {
      state.occasion = this.value;
      setParty(PP.composeParty(acts, Object.assign(opts(), { seed: 35 })));
    });
    el('pp-band').addEventListener('change', function () {
      state.ageBand = this.value;
      setParty(PP.composeParty(acts, Object.assign(opts(), { seed: 35 })));
    });
    el('pp-size').addEventListener('change', function () {
      state.groupSize = parseInt(this.value, 10);
      setParty(PP.composeParty(acts, Object.assign(opts(), { seed: 35 })));
    });
    el('pp-compose').addEventListener('click', function () {
      var party = PP.composeParty(acts, Object.assign(opts(), { seed: Math.floor(Math.random() * 1e9) }));
      setParty(party);
      var t = PP.partyTotals(state.slots, byId);
      el('pp-status').textContent = 'Packed a new party: ' + t.filled + ' of ' + t.total +
        ' parts filled from the real catalog.';
    });
    el('pp-print').addEventListener('click', function () { window.print(); });
    el('pp-copy').addEventListener('click', function () {
      var text = PP.partySheetText(
        { occasion: state.occasion, ageBand: state.ageBand, groupSize: state.groupSize, slots: state.slots },
        byId, function (c) { return catName[c] || c; });
      function done() { el('pp-copy-status').textContent = 'Party sheet copied — paste it anywhere.'; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else { done(); }
    });

    setParty(PP.composeParty(acts, Object.assign(opts(), { seed: 35 })));
    el('pp-status').textContent = 'Pre-packed: a birthday party for ages 5–6, group of 16 — ' +
      'change the occasion, band, or size and the Pack repacks from the real catalog.';
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
    el('pp-status').textContent = 'The catalog could not be loaded — the Party Pack is unavailable right now.';
  });
})();
