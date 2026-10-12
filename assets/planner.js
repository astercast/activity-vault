/* Activity Vault — Smart Weekly Planner 3.0.
   Auto-build balanced weeks (1–4), balance meter, drag-and-drop, swap,
   surprise-fill, named saved plans, .ics export, collection seeding,
   shareable ?plan= links — plus 3.0: multi-week no-repeat dealing,
   ⚡ brain breaks, 🌦️ weather-aware indoor backups, 🛒 supply-list
   aggregation, 🆘 substitute kit per slot.
   Design craft: container queries, view transitions (reduced-motion safe),
   scroll-driven card entrance, sticky plan section nav, DnD affordances. */
(function () {
  'use strict';

  var P = window.VaultPlanner;
  var DAYS7 = P.WEEKDAYS;
  var PLANS_KEY = 'activityvault.plans.v1';

  var state = {
    activities: [], categories: [], catMap: {}, actmap: {},
    catBucket: {}, collections: [],
    plan: null,   // {version:2, name, programType, maxTime, ageBand, weeks:[{weekNum, days:[...]}]}
    opts: null,   // last-used constraint snapshot (drives swap/fill/backups)
    pool: [],
    notes: []
  };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function catName(id) { return (state.catMap[id] || {}).name || id; }
  function reduceMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* View-transition-safe re-render: crossfades slot changes, skipped for
     reduced-motion users and older browsers (plain render fallback). */
  function transitionRender(fn) {
    if (!reduceMotion() && document.startViewTransition) {
      document.startViewTransition(function () { fn(); });
    } else { fn(); }
  }

  function refocus(key) {
    if (!key) return;
    var b = document.querySelector('[data-fkey="' + key + '"]');
    if (b && b.focus) b.focus({ preventScroll: true });
  }

  /* ---------------- form ---------------- */

  function programDefaults() {
    var prog = P.PROGRAMS[document.getElementById('p-program').value] || P.PROGRAMS['after-school'];
    document.getElementById('slots-per-day').value = String(prog.slotsPerDay);
    document.getElementById('max-time').value = String(prog.maxTime);
    document.getElementById('p-indoor').checked = !!prog.indoorOnly;
    updateDayMinutes();
  }

  function updateDayMinutes() {
    var slots = parseInt(document.getElementById('slots-per-day').value, 10) || 2;
    var mins = parseInt(document.getElementById('max-time').value, 10) || 30;
    document.getElementById('day-minutes').textContent = '≈ ' + (slots * mins) + ' min/day';
  }

  function getForm() {
    var days = [];
    document.querySelectorAll('input[name="day"]:checked').forEach(function (c) { days.push(c.value); });
    var programType = document.getElementById('p-program').value;
    var band = P.AGE_BANDS[document.getElementById('p-ageband').value] || P.AGE_BANDS.all;
    var cats = [];
    document.querySelectorAll('input[name="pcat"]:checked').forEach(function (c) { cats.push(c.value); });
    var slots = Math.min(Math.max(parseInt(document.getElementById('slots-per-day').value, 10) || 2, 1), 4);
    var maxTime = parseInt(document.getElementById('max-time').value, 10) || null;
    var prepCap = parseInt(document.getElementById('p-prepcap').value, 10);
    var collId = document.getElementById('p-collection').value;
    var seedIds = [];
    if (collId) {
      var coll = state.collections.filter(function (c) { return c.id === collId; })[0];
      if (coll) seedIds = coll.picks.map(function (p) { return p.id; });
    }
    return {
      days: days.length ? days : DAYS7.slice(0, 5),
      weeks: P.clampWeeks(document.getElementById('p-weeks').value),
      slotsPerDay: slots,
      maxTime: maxTime,
      ageBand: document.getElementById('p-ageband').value,
      ageMin: band.min, ageMax: band.max,
      programType: programType,
      cats: cats,
      noPrepOnly: document.getElementById('p-noprep').checked,
      indoorOnly: document.getElementById('p-indoor').checked,
      allowRepeats: document.getElementById('p-repeats').checked,
      maxPrepHeavy: isNaN(prepCap) ? 2 : prepCap,
      seedIds: seedIds,
      collectionId: collId || null
    };
  }

  function setForm(opts) {
    document.getElementById('p-program').value = opts.programType || 'after-school';
    document.getElementById('p-ageband').value = opts.ageBand || 'all';
    document.getElementById('p-weeks').value = String(P.clampWeeks(opts.weeks || 1));
    document.getElementById('slots-per-day').value = String(opts.slotsPerDay || 2);
    document.getElementById('max-time').value = opts.maxTime ? String(opts.maxTime) : '30';
    document.getElementById('p-prepcap').value = String(opts.maxPrepHeavy != null ? opts.maxPrepHeavy : 2);
    document.getElementById('p-noprep').checked = !!opts.noPrepOnly;
    document.getElementById('p-indoor').checked = !!opts.indoorOnly;
    document.getElementById('p-repeats').checked = !!opts.allowRepeats;
    document.getElementById('p-collection').value = opts.collectionId || '';
    document.querySelectorAll('input[name="day"]').forEach(function (c) {
      c.checked = (opts.days || []).indexOf(c.value) !== -1;
    });
    document.querySelectorAll('input[name="pcat"]').forEach(function (c) {
      c.checked = (opts.cats || []).indexOf(c.value) !== -1;
    });
    updateDayMinutes();
  }

  /* ---------------- generation ---------------- */

  function status(msg) {
    document.getElementById('plan-note').textContent = msg;
  }

  function generate(seedIdsOverride, notePrefix) {
    var opts = getForm();
    if (seedIdsOverride !== undefined) opts.seedIds = seedIdsOverride;
    state.opts = opts;
    state.pool = P.filterPool(state.activities, opts);
    var out = document.getElementById('week-plan');
    out.innerHTML = '';
    document.getElementById('plan-extras').innerHTML = '';
    document.getElementById('plan-sections').hidden = true;
    state.notes = [];

    if (!state.pool.length) {
      status('No activities match those constraints — try loosening them.');
      document.getElementById('plan-actions').hidden = true;
      buildPrintDeck();
      return;
    }

    var res = P.buildMultiWeek(state.activities, opts, state.catBucket);
    state.plan = {
      version: 2,
      name: document.getElementById('plan-name-input') &&
            document.getElementById('plan-name-input').value.trim() || defaultPlanName(),
      programType: opts.programType,
      maxTime: opts.maxTime,
      ageBand: opts.ageBand,
      weeks: res.weeks
    };

    var totalSlots = 0, filled = 0, seedPlaced = 0, seedSkipped = 0;
    res.weeks.forEach(function (w) {
      seedPlaced += w.seedPlaced; seedSkipped += w.seedSkipped;
      (w.notes || []).forEach(function (n) { state.notes.push('Week ' + w.weekNum + ': ' + n); });
      w.days.forEach(function (d) {
        d.slots.forEach(function (s) { totalSlots++; if (s.activityId) filled++; });
      });
    });
    var msg = notePrefix || '';
    msg += 'Planned ' + filled + ' of ' + totalSlots + ' slots across ' + res.weeks.length +
      (res.weeks.length === 1 ? ' week' : ' weeks') + ' from ' + state.pool.length +
      ' matching activities — no repeats between weeks.';
    if (seedPlaced) msg += ' Seeded ' + seedPlaced + ' curator pick' + (seedPlaced > 1 ? 's' : '') + ' into week 1.';
    if (seedSkipped) msg += ' ' + seedSkipped + ' collection pick' + (seedSkipped > 1 ? 's' : '') +
      ' didn\u2019t fit your filters — filled from the library instead.';
    if (state.notes.length) msg += ' ' + state.notes.join(' ');
    status(msg);

    renderPlan();
    buildPrintDeck();
    document.getElementById('plan-actions').hidden = false;
  }

  function defaultPlanName() {
    var d = new Date();
    return 'Week of ' + d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  /* All scheduled ids across every week — the shared no-repeat set for
     swaps, backups, and brain breaks. */
  function usedIds() {
    var u = {};
    if (!state.plan) return u;
    state.plan.weeks.forEach(function (w) {
      w.days.forEach(function (d) {
        d.slots.forEach(function (s) { if (s.activityId) u[s.activityId] = true; });
      });
    });
    return u;
  }

  /* ---------------- rendering ---------------- */

  function meterBar(balance) {
    var total = balance.total;
    var wrap = el('div', 'meter');
    wrap.setAttribute('role', 'img');
    var parts = [];
    P.BUCKETS.forEach(function (b) {
      var n = balance.counts[b.id];
      if (n > 0 && total > 0) {
        var seg = el('span', 'meter-seg meter-' + b.id);
        seg.style.width = (n / total * 100) + '%';
        seg.title = b.glyph + ' ' + b.label + ': ' + n;
        wrap.appendChild(seg);
        parts.push(b.glyph + ' ' + n);
      }
    });
    wrap.setAttribute('aria-label', 'Energy balance: ' + (parts.length ? parts.join(', ') : 'no activities yet'));
    return wrap;
  }

  function slotWhy(a) { return P.whyFits(a, catName); }
  function fkey(kind, wi, di, slotNum) { return kind + '-w' + wi + '-d' + di + '-s' + slotNum; }

  function renderSlot(w, d, s, wi, di) {
    var li = el('li', 'slot');
    li.draggable = true;
    li.dataset.week = String(wi);
    li.dataset.day = String(di);
    li.dataset.slot = String(s.slot);
    li.setAttribute('aria-label', 'Slot ' + s.slot + (s.activityId ? ': ' + state.actmap[s.activityId].name : ' (empty)'));

    var a = s.activityId ? state.actmap[s.activityId] : null;
    var body = el('div', 'slot-body');
    if (a) {
      body.appendChild(el('div', 'slot-time', 'Slot ' + s.slot));
      var nm = el('div', 'slot-name');
      var link = el('a', null, a.name);
      link.href = 'activity/' + a.id + '.html';
      nm.appendChild(link);
      var bucket = P.bucketFor(a, state.catBucket);
      var bl = P.BUCKETS.filter(function (b) { return b.id === bucket; })[0];
      nm.appendChild(el('span', 'slot-bucket', ' ' + (bl ? bl.glyph : '')));
      body.appendChild(nm);
      body.appendChild(el('p', 'slot-why', slotWhy(a)));
      var R = window.VaultRatings;
      var mine = R ? R.getRating(a.id) : null;
      if (mine) {
        var rline = '⭐ You rated this ' + mine.stars + '★';
        if (mine.note) rline += ' — ' + mine.note;
        body.appendChild(el('p', 'slot-rating', rline));
      }
    } else {
      body.appendChild(el('div', 'slot-time', 'Slot ' + s.slot));
      body.appendChild(el('div', 'slot-name slot-empty', '— open slot —'));
      body.appendChild(el('p', 'slot-why', 'Hit “🎲 Surprise me” to fill this gap.'));
    }

    var acts = el('div', 'slot-actions');
    if (a) {
      var swap = el('button', 'btn btn-small btn-ghost', '🔀 Swap');
      swap.type = 'button';
      swap.setAttribute('data-fkey', fkey('swap', wi, di, s.slot));
      swap.setAttribute('aria-label', 'Swap ' + a.name + ' for a different activity');
      swap.addEventListener('click', function () { swapSlot(wi, di, s.slot); });
      acts.appendChild(swap);
    }
    var up = el('button', 'btn btn-small btn-ghost', '↑');
    up.type = 'button';
    up.setAttribute('data-fkey', fkey('up', wi, di, s.slot));
    up.setAttribute('aria-label', 'Move slot ' + s.slot + ' up');
    up.addEventListener('click', function () { moveSlot(wi, di, s.slot, -1); });
    var down = el('button', 'btn btn-small btn-ghost', '↓');
    down.type = 'button';
    down.setAttribute('data-fkey', fkey('down', wi, di, s.slot));
    down.setAttribute('aria-label', 'Move slot ' + s.slot + ' down');
    down.addEventListener('click', function () { moveSlot(wi, di, s.slot, 1); });
    acts.appendChild(up);
    acts.appendChild(down);
    body.appendChild(acts);
    li.appendChild(body);

    // Drag-and-drop reorder within the day (keyboard users get the ↑/↓ buttons).
    // Grip affordance: the whole row grabs; .drag-over shows a drop bar.
    li.addEventListener('dragstart', function (ev) {
      ev.dataTransfer.setData('text/plain', wi + ':' + di + ':' + s.slot);
      ev.dataTransfer.effectAllowed = 'move';
      li.classList.add('dragging');
    });
    li.addEventListener('dragend', function () {
      li.classList.remove('dragging');
      document.querySelectorAll('.slot.drag-over').forEach(function (x) { x.classList.remove('drag-over'); });
    });
    li.addEventListener('dragover', function (ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      li.classList.add('drag-over');
    });
    li.addEventListener('dragleave', function () { li.classList.remove('drag-over'); });
    li.addEventListener('drop', function (ev) {
      ev.preventDefault();
      var parts = ev.dataTransfer.getData('text/plain').split(':');
      if (parseInt(parts[0], 10) === wi && parseInt(parts[1], 10) === di) {
        dropSlot(wi, di, parseInt(parts[2], 10), s.slot);
      }
    });
    return li;
  }
