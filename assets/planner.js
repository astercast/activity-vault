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
  function calmMode() {
    return document.documentElement.hasAttribute('data-calm');
  }

  /* View-transition-safe re-render: crossfades slot changes, skipped for
     reduced-motion users, calm-mode users, and older browsers (plain render). */
  function transitionRender(fn) {
    if (!reduceMotion() && !calmMode() && document.startViewTransition) {
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

  function weekBalance(weeks) {
    var wcounts = {};
    P.BUCKET_IDS.forEach(function (b) { wcounts[b] = 0; });
    var wtotal = 0;
    weeks.forEach(function (w) {
      w.days.forEach(function (d) {
        var b = P.balanceOf(d.slots, state.actmap, state.catBucket);
        P.BUCKET_IDS.forEach(function (k) { wcounts[k] += b.counts[k]; });
        wtotal += b.total;
      });
    });
    return { counts: wcounts, total: wtotal };
  }

  function warningsList(warns) {
    var wul = el('ul', 'meter-warnings');
    warns.forEach(function (w) { wul.appendChild(el('li', null, '⚠️ ' + w)); });
    return wul;
  }

  function renderPlan() {
    var out = document.getElementById('week-plan');
    var extras = document.getElementById('plan-extras');
    var nav = document.getElementById('plan-sections');
    out.innerHTML = '';
    extras.innerHTML = '';
    if (!state.plan) { nav.hidden = true; return; }

    var used = usedIds();

    // Sticky section nav: week anchors + the three 3.0 extras.
    nav.innerHTML = '';
    var navLabel = el('span', 'plan-sections-label', 'Jump to:');
    navLabel.id = 'plan-sections-label';
    nav.appendChild(navLabel);
    var navRow = el('div', 'chip-row');
    navRow.setAttribute('role', 'group');
    navRow.setAttribute('aria-labelledby', 'plan-sections-label');
    state.plan.weeks.forEach(function (w) {
      var a = el('a', 'chip chip-link', 'Week ' + w.weekNum);
      a.href = '#week-' + w.weekNum;
      navRow.appendChild(a);
    });
    var weatherRows = collectWeatherRows();
    if (weatherRows.length) {
      var wa = el('a', 'chip chip-link', '🌦️ Weather backups');
      wa.href = '#weather-section';
      navRow.appendChild(wa);
    }
    var sa = el('a', 'chip chip-link', '🛒 Supply list');
    sa.href = '#supply-section';
    navRow.appendChild(sa);
    var ka = el('a', 'chip chip-link', '🆘 Substitute kit');
    ka.href = '#subkit-section';
    navRow.appendChild(ka);
    nav.appendChild(navRow);
    nav.hidden = false;

    // Week sections.
    state.plan.weeks.forEach(function (w, wi) {
      var sec = el('section', 'week-section');
      sec.setAttribute('aria-labelledby', 'week-' + w.weekNum + '-h');
      var h = el('h2', 'week-head');
      h.id = 'week-' + w.weekNum + '-h';
      var anchor = el('span', 'week-head-anchor', 'Week ' + w.weekNum);
      anchor.id = 'week-' + w.weekNum;
      anchor.tabIndex = -1;
      h.appendChild(anchor);
      var filled = 0, total = 0;
      w.days.forEach(function (d) {
        d.slots.forEach(function (s) { total++; if (s.activityId) filled++; });
      });
      h.appendChild(el('span', 'week-head-sub', ' · ' + filled + ' of ' + total + ' slots planned'));
      sec.appendChild(h);

      var weekBal = el('div', 'week-balance');
      weekBal.appendChild(el('h3', null, 'Week ' + w.weekNum + ' balance'));
      var wb = weekBalance([w]);
      weekBal.appendChild(meterBar(wb));
      var wwarn = [];
      w.days.forEach(function (d) {
        var b = P.balanceOf(d.slots, state.actmap, state.catBucket);
        wwarn = wwarn.concat(P.dayWarnings(b, d.day));
      });
      wwarn = wwarn.concat(P.weekWarnings(w.days, state.actmap, state.catBucket));
      if (wwarn.length) weekBal.appendChild(warningsList(wwarn));
      sec.appendChild(weekBal);

      w.days.forEach(function (d, di) {
        var card = el('section', 'day-card');
        card.setAttribute('aria-label', 'Week ' + w.weekNum + ', ' + d.day + ' plan');
        card.appendChild(el('h3', null, d.day));
        var bal = P.balanceOf(d.slots, state.actmap, state.catBucket);
        card.appendChild(meterBar(bal));
        var legend = el('p', 'meter-legend',
          P.BUCKETS.map(function (b) { return b.glyph + ' ' + b.label + ': ' + bal.counts[b.id]; }).join(' · '));
        card.appendChild(legend);
        // ⚡ Brain break of the day — research-backed <10 min movement reset.
        var bbId = P.brainBreak(state.pool, used, state.actmap, state.catBucket, wi * 100 + di + 11);
        if (bbId) {
          var bb = state.actmap[bbId];
          var bbLine = el('p', 'brain-break');
          bbLine.appendChild(document.createTextNode('⚡ Brain-break idea: '));
          var bbLink = el('a', null, bb.name);
          bbLink.href = 'activity/' + bb.id + '.html';
          bbLine.appendChild(bbLink);
          bbLine.appendChild(document.createTextNode(' — runs cold in ' + bb.time_min + ' min or less.'));
          card.appendChild(bbLine);
        }
        var list = el('ol', 'slot-list');
        list.setAttribute('aria-label', d.day + ' slots');
        d.slots.forEach(function (s) { list.appendChild(renderSlot(w, d, s, wi, di)); });
        card.appendChild(list);
        sec.appendChild(card);
      });
      out.appendChild(sec);
    });

    renderExtras(extras, weatherRows, used);
  }

  /* ---------------- 3.0 extras: weather, supplies, sub kit ---------------- */

  function collectWeatherRows() {
    var rows = [];
    if (!state.plan) return rows;
    var used = usedIds();
    state.plan.weeks.forEach(function (w, wi) {
      w.days.forEach(function (d, di) {
        d.slots.forEach(function (s) {
          var a = s.activityId && state.actmap[s.activityId];
          if (!a || !P.needsWeatherBackup(a)) return;
          var backupId = P.weatherBackupFor(a, state.pool, used, state.actmap,
            state.catBucket, state.opts, wi * 1000 + di * 10 + s.slot);
          rows.push({ wi: wi, di: di, slot: s.slot, weekNum: w.weekNum,
                      day: d.day, activity: a, backupId: backupId });
        });
      });
    });
    return rows;
  }

  function renderExtras(extras, weatherRows, used) {
    // 🌦️ Weather backups — every outdoor-only slot gets an indoor plan B.
    if (weatherRows.length) {
      var wsec = el('section', 'extra-section');
      wsec.setAttribute('aria-labelledby', 'weather-h');
      var wh = el('h2', 'extra-head');
      wh.id = 'weather-h';
      var wanchor = el('span', null, '🌦️ Weather backups');
      wanchor.id = 'weather-section';
      wanchor.tabIndex = -1;
      wh.appendChild(wanchor);
      wsec.appendChild(wh);
      wsec.appendChild(el('p', 'muted',
        'Rain happens. Every outdoor-only slot below already has an indoor backup picked — one tap swaps it in.'));
      var wul = el('ul', 'backup-list');
      weatherRows.forEach(function (r) {
        var li = el('li', 'backup-row');
        li.appendChild(el('span', 'backup-from',
          '⛈️ ' + r.activity.name + ' (Week ' + r.weekNum + ' ' + r.day + ', slot ' + r.slot + ') is outdoor-only.'));
        if (r.backupId) {
          var b = state.actmap[r.backupId];
          li.appendChild(el('span', 'backup-to', ' → Indoor backup: ' + b.name +
            (b.no_prep ? ' (no prep)' : '') + ' — '));
          var swapIn = el('button', 'btn btn-small', 'Swap in backup');
          swapIn.type = 'button';
          swapIn.setAttribute('aria-label',
            'Swap ' + r.activity.name + ' for indoor backup ' + b.name);
          (function (row, bid) {
            swapIn.addEventListener('click', function () { swapInBackup(row, bid); });
          })(r, r.backupId);
          li.appendChild(swapIn);
        } else {
          li.appendChild(el('span', 'backup-to muted',
            ' → No indoor backup fit your filters — keep a rainy-day fallback handy.'));
        }
        wul.appendChild(li);
      });
      wsec.appendChild(wul);
      extras.appendChild(wsec);
    }

    // 🛒 Supply list — one aggregated prep list for the whole plan.
    var supplies = P.aggregateSupplies(state.plan.weeks, state.actmap);
    var ssec = el('section', 'extra-section');
    ssec.setAttribute('aria-labelledby', 'supply-h');
    var sh = el('h2', 'extra-head');
    sh.id = 'supply-h';
    var sanchor = el('span', null, '🛒 Supply list');
    sanchor.id = 'supply-section';
    sanchor.tabIndex = -1;
    sh.appendChild(sanchor);
    ssec.appendChild(sh);
    if (!supplies.length) {
      ssec.appendChild(el('p', 'muted', 'No materials needed — this whole plan is copy-free. 🎉'));
    } else {
      ssec.appendChild(el('p', 'muted',
        'Everything below, counted across ' + state.plan.weeks.length +
        (state.plan.weeks.length === 1 ? ' week' : ' weeks') +
        '. Busiest items first — grab these and the week is prepped.'));
      var sul = el('ul', 'supply-list');
      supplies.slice(0, 40).forEach(function (g) {
        var li = el('li', 'supply-row');
        li.appendChild(el('span', 'supply-item', g.display));
        li.appendChild(el('span', 'supply-count',
          ' × ' + g.count + ' activit' + (g.count === 1 ? 'y' : 'ies')));
        li.appendChild(el('span', 'supply-days', ' — ' + g.dayLabels.join(', ')));
        sul.appendChild(li);
      });
      ssec.appendChild(sul);
      if (supplies.length > 40) {
        ssec.appendChild(el('p', 'muted', '…and ' + (supplies.length - 40) +
          ' more one-off items (see the printed list for all).'));
      }
      var copyBtn = el('button', 'btn btn-ghost', '📋 Copy supply list');
      copyBtn.type = 'button';
      copyBtn.id = 'copy-supply';
      var copySt = el('span', 'copy-status');
      copySt.id = 'copy-supply-status';
      copySt.setAttribute('role', 'status');
      copySt.setAttribute('aria-live', 'polite');
      copyBtn.addEventListener('click', function () { copySupplyList(copySt); });
      ssec.appendChild(copyBtn);
      ssec.appendChild(copySt);
    }
    extras.appendChild(ssec);

    // 🆘 Substitute kit — an any-sub-can-run-it backup for every slot.
    var ksec = el('section', 'extra-section');
    ksec.setAttribute('aria-labelledby', 'subkit-h');
    var kh = el('h2', 'extra-head');
    kh.id = 'subkit-h';
    var kanchor = el('span', null, '🆘 Substitute kit');
    kanchor.id = 'subkit-section';
    kanchor.tabIndex = -1;
    kh.appendChild(kanchor);
    ksec.appendChild(kh);
    ksec.appendChild(el('p', 'muted',
      'Out sick? Hand this to your sub. Every backup below is no-prep, zero materials — ' +
      'the 2026 gold standard is "copy-free" — with plain-language steps any adult can run cold. ' +
      'Print the week plan and the kit rides along.'));
    state.plan.weeks.forEach(function (w, wi) {
      // Native <details> per week: free keyboard behavior, keeps a long kit scannable.
      var det = el('details', 'subkit-week-details');
      if (wi === 0) det.open = true;
      var slotCount = 0;
      w.days.forEach(function (d) {
        d.slots.forEach(function (s) { if (s.activityId) slotCount++; });
      });
      var sum = el('summary', 'subkit-week',
        'Week ' + w.weekNum + ' substitute kit (' + slotCount + ' slots)');
      det.appendChild(sum);
      var kul = el('ul', 'subkit-list');
      w.days.forEach(function (d, di) {
        d.slots.forEach(function (s) {
          var a = s.activityId && state.actmap[s.activityId];
          if (!a) return;
          var bid = P.subBackupFor(a, state.pool, used, state.actmap,
            state.catBucket, state.opts, wi * 1000 + di * 10 + s.slot + 7);
          var li = el('li', 'subkit-row');
          var head = el('p', 'subkit-head');
          head.appendChild(document.createTextNode(
            d.day + ', slot ' + s.slot + ' — instead of “' + a.name + '”: '));
          if (bid) {
            var b = state.actmap[bid];
            var blink = el('a', null, b.name);
            blink.href = 'activity/' + b.id + '.html';
            var strong = el('strong', null, null);
            strong.appendChild(blink);
            head.appendChild(strong);
            head.appendChild(document.createTextNode(
              ' (' + b.time_min + '–' + b.time_max + ' min · no prep · no materials)'));
            li.appendChild(head);
            if (b.steps && b.steps.length) {
              var ol = el('ol', 'subkit-steps');
              b.steps.slice(0, 3).forEach(function (st) {
                ol.appendChild(el('li', null, typeof st === 'string' ? st : (st.text || st.step || '')));
              });
              li.appendChild(ol);
            }
          } else {
            head.appendChild(document.createTextNode('no no-prep backup fit — the room\u2019s usual filler works.'));
            li.appendChild(head);
          }
          kul.appendChild(li);
        });
      });
      det.appendChild(kul);
      ksec.appendChild(det);
    });
    extras.appendChild(ksec);
  }

  function refreshPlan(focusKey) {
    transitionRender(function () {
      renderPlan();
      buildPrintDeck();
    });
    if (focusKey) {
      // Re-focus after the view transition finishes painting.
      setTimeout(function () { refocus(focusKey); }, (reduceMotion() || calmMode()) ? 0 : 120);
    }
  }

  /* ---------------- slot actions ---------------- */

  function swapSlot(wi, di, slotNum) {
    var week = state.plan.weeks[wi];
    var day = week.days[di];
    var s = day.slots.filter(function (x) { return x.slot === slotNum; })[0];
    if (!s || !s.activityId) return;
    var oldName = state.actmap[s.activityId].name;
    var newId = P.swapCandidate(state.pool, week.days, di,
      day.slots.indexOf(s), state.actmap, state.catBucket, state.opts);
    if (!newId) {
      status('Nothing else fits those constraints — loosen a filter and try again.');
      return;
    }
    s.activityId = newId;
    var key = fkey('swap', wi, di, slotNum);
    refreshPlan(key);
    status('Swapped “' + oldName + '” for “' + state.actmap[newId].name + '”.');
  }

  function swapInBackup(row, backupId) {
    var s = state.plan.weeks[row.wi].days[row.di].slots.filter(function (x) {
      return x.slot === row.slot;
    })[0];
    if (!s) return;
    var oldName = state.actmap[s.activityId].name;
    s.activityId = backupId;
    refreshPlan(null);
    status('🌦️ Swapped “' + oldName + '” for indoor backup “' + state.actmap[backupId].name + '”.');
  }

  function moveSlot(wi, di, slotNum, dir) {
    var slots = state.plan.weeks[wi].days[di].slots;
    var i = slots.map(function (x) { return x.slot; }).indexOf(slotNum);
    var j = i + dir;
    if (i < 0 || j < 0 || j >= slots.length) return;
    var t = slots[i]; slots[i] = slots[j]; slots[j] = t;
    slots.forEach(function (x, k) { x.slot = k + 1; });
    var a = slots[j].activityId ? state.actmap[slots[j].activityId].name : 'open slot';
    refreshPlan(fkey(dir < 0 ? 'up' : 'down', wi, di, slotNum));
    status('Moved “' + a + '” ' + (dir < 0 ? 'up' : 'down') + '.');
  }

  function dropSlot(wi, di, fromSlotNum, toSlotNum) {
    if (fromSlotNum === toSlotNum) return;
    var slots = state.plan.weeks[wi].days[di].slots;
    var from = slots.map(function (x) { return x.slot; }).indexOf(fromSlotNum);
    var to = slots.map(function (x) { return x.slot; }).indexOf(toSlotNum);
    if (from < 0 || to < 0) return;
    var moved = slots.splice(from, 1)[0];
    slots.splice(to, 0, moved);
    slots.forEach(function (x, k) { x.slot = k + 1; });
    var a = moved.activityId ? state.actmap[moved.activityId].name : 'open slot';
    refreshPlan(null);
    status('Moved “' + a + '” to slot ' + (to + 1) + '.');
  }

  function surpriseFill() {
    if (!state.plan) return;
    function gaps() {
      var n = 0;
      state.plan.weeks.forEach(function (w) {
        w.days.forEach(function (d) {
          d.slots.forEach(function (s) { if (!s.activityId) n++; });
        });
      });
      return n;
    }
    var before = gaps();
    if (before === 0) { status('No gaps to fill — every slot already has an activity.'); return; }
    state.plan.weeks.forEach(function (w) {
      P.fillGaps(w.days, state.pool, state.actmap, state.catBucket, state.opts);
    });
    var placed = before - gaps();
    refreshPlan(null);
    status(placed > 0
      ? '🎲 Surprise! Filled ' + placed + ' gap' + (placed === 1 ? '' : 's') + ' with fresh picks.'
      : 'No gap could be filled with those constraints — loosen a filter and try again.');
  }

  /* ---------------- saved plans (localStorage) ---------------- */

  function loadSaved() {
    try {
      var raw = localStorage.getItem(PLANS_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function storeSaved(arr) {
    try { localStorage.setItem(PLANS_KEY, JSON.stringify(arr)); }
    catch (e) { status('Could not save — browser storage is unavailable.'); }
  }

  function savedMeta(rec) {
    var days = 0, weeks = 0;
    if (rec.weeks) {
      weeks = rec.weeks.length;
      rec.weeks.forEach(function (w) { days += (w.days || []).length; });
    } else if (rec.days) { // v1 record from the 2.0 era
      days = rec.days.length;
      weeks = 1;
    }
    return weeks + (weeks === 1 ? ' week' : ' weeks') + ' · ' + days + ' days';
  }

  function renderSaved() {
    var host = document.getElementById('saved-plans');
    host.innerHTML = '';
    var plans = loadSaved();
    if (!plans.length) {
      host.appendChild(el('p', 'muted', 'No saved plans yet — build a week, name it, hit Save.'));
      return;
    }
    plans.forEach(function (rec, i) {
      var li = el('li', 'saved-plan');
      li.appendChild(el('span', 'saved-plan-name', rec.name));
      li.appendChild(el('span', 'saved-plan-meta',
        ' · ' + savedMeta(rec) + ' · saved ' +
        new Date(rec.created).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })));
      var loadBtn = el('button', 'btn btn-small', 'Load');
      loadBtn.type = 'button';
      loadBtn.addEventListener('click', function () { loadPlanRecord(rec); });
      var delBtn = el('button', 'btn btn-small btn-ghost', 'Delete');
      delBtn.type = 'button';
      delBtn.setAttribute('aria-label', 'Delete saved plan ' + rec.name);
      delBtn.addEventListener('click', function () {
        var arr = loadSaved();
        arr.splice(i, 1);
        storeSaved(arr);
        renderSaved();
        status('Deleted saved plan “' + rec.name + '”.');
      });
      li.appendChild(loadBtn);
      li.appendChild(delBtn);
      host.appendChild(li);
    });
  }

  function saveCurrentPlan() {
    if (!state.plan) { status('Generate a week first, then save it.'); return; }
    var nameInput = document.getElementById('plan-name-input');
    var name = (nameInput.value || '').trim() || defaultPlanName();
    var rec = P.savedPlanRecord(name, state.opts, state.plan.weeks);
    rec.opts = state.opts; // full constraint snapshot so swaps/fills keep working
    var arr = loadSaved();
    var dup = arr.map(function (r) { return r.name; }).indexOf(name);
    if (dup !== -1) arr.splice(dup, 1);
    arr.unshift(rec);
    storeSaved(arr);
    renderSaved();
    status('Saved “' + name + '” — it lives only in this browser.');
  }

  function loadPlanRecord(rec) {
    var validated = P.validatePlanData(rec, state.actmap);
    var totalDays = 0;
    validated.weeks.forEach(function (w) { totalDays += w.days.length; });
    if (!totalDays) {
      status('That saved plan didn\u2019t contain any usable days.');
      return;
    }
    state.opts = rec.opts || Object.assign(getForm(), {
      programType: validated.programType, maxTime: validated.maxTime
    });
    state.opts.weeks = validated.weeks.length;
    setForm(state.opts);
    state.pool = P.filterPool(state.activities, state.opts);
    state.plan = {
      version: 2, name: rec.name || validated.name,
      programType: validated.programType, maxTime: validated.maxTime,
      ageBand: state.opts.ageBand, weeks: validated.weeks
    };
    renderPlan();
    buildPrintDeck();
    document.getElementById('plan-actions').hidden = false;
    status('Loaded “' + state.plan.name + '” (' + validated.weeks.length +
      (validated.weeks.length === 1 ? ' week' : ' weeks') + ').');
  }

  /* ---------------- exports ---------------- */

  function cardUrl(rel) {
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

  function ratingExportLine(a) {
    var R = window.VaultRatings;
    var mine = R ? R.getRating(a.id) : null;
    if (!mine) return null;
    var line = 'Your rating: ' + mine.stars + '/5 stars' + (mine.note ? ' — ' + mine.note : '');
    if (mine.reflections) {
      if (mine.reflections.change) line += ' | change next time: ' + mine.reflections.change;
      if (mine.reflections.age_band) line += ' | age band that shone: ' + mine.reflections.age_band;
      if (mine.reflections.again) line += ' | run it again? ' + mine.reflections.again;
    }
    return line;
  }

  function absolutize(text) {
    // Deep links: absolute URLs when served over http(s).
    return text.split('\n').map(function (line) {
      if (/^(activity|index)\//.test(line.trim())) {
        return line.replace(/(activity\/[a-z0-9-]+\.html|index\.html)/, function (m) {
          return cardUrl(m);
        });
      }
      return line;
    }).join('\n');
  }

  function copyWeek() {
    if (!state.plan) return;
    var text = P.planText(state.plan, state.actmap, catName, ratingExportLine);
    copyText(absolutize(text), document.getElementById('copy-week-status'));
  }

  function copySupplyList(statusEl) {
    if (!state.plan) return;
    var supplies = P.aggregateSupplies(state.plan.weeks, state.actmap);
    var lines = ['🛒 Supply list — ' + state.plan.name + ' — Activity Vault', ''];
    supplies.forEach(function (g) {
      lines.push(g.display + ' — ' + g.count + ' activit' + (g.count === 1 ? 'y' : 'ies') +
        ' (' + g.dayLabels.join(', ') + ')');
    });
    lines.push('', 'Counts are scheduled slots — buy once, use all week.');
    copyText(lines.join('\n'), statusEl || document.getElementById('copy-supply-status'));
  }

  function copyPlanLink() {
    if (!state.plan) return;
    var url = cardUrl('planner.html') + '?plan=' + P.encodePlan(state.plan);
    copyText(url, document.getElementById('copy-link-status'));
  }

  function exportICS() {
    if (!state.plan) return;
    var now = new Date();
    var header = null;
    var events = [];
    state.plan.weeks.forEach(function (w, wi) {
      var ics = P.exportICS({
        name: state.plan.name + (state.plan.weeks.length > 1 ? ' — Week ' + w.weekNum : ''),
        programType: state.plan.programType,
        maxTime: state.plan.maxTime,
        days: w.days
      }, state.actmap, now, wi);
      var parts = ics.split('BEGIN:VEVENT');
      if (!header) header = parts[0];
      for (var i = 1; i < parts.length; i++) {
        var ev = parts[i].split('END:VEVENT')[0];
        events.push('BEGIN:VEVENT' + ev + 'END:VEVENT');
      }
    });
    var text = header + events.join('\r\n') + '\r\nEND:VCALENDAR\r\n';
    var blob = new Blob([text], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'activity-vault-plan.ics';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    }, 1000);
    status('Downloaded activity-vault-plan.ics (' + events.length + ' events' +
      (state.plan.weeks.length > 1 ? ', ' + state.plan.weeks.length + ' weeks' : '') +
      ') — import it into any calendar app.');
  }

  /* ---------------- print deck (wave-7 pattern, 3.0: multi-week + extras) ---------------- */

  function buildPrintDeck() {
    var host = document.getElementById('print-week-cards');
    host.textContent = '';
    if (!state.plan) return;
    var used = usedIds();

    state.plan.weeks.forEach(function (w, wi) {
      if (state.plan.weeks.length > 1) {
        var whead = el('div', 'print-week-head');
        whead.appendChild(el('h2', null, 'Week ' + w.weekNum + ' — ' + state.plan.name));
        host.appendChild(whead);
      }
      w.days.forEach(function (d, di) {
        var bal = P.balanceOf(d.slots, state.actmap, state.catBucket);
        var dayHead = el('div', 'print-day-head');
        dayHead.appendChild(el('h3', null, (state.plan.weeks.length > 1 ? 'Week ' + w.weekNum + ' · ' : '') + d.day));
        dayHead.appendChild(el('p', null, 'Energy balance: ' +
          P.BUCKETS.map(function (b) { return b.glyph + ' ' + bal.counts[b.id]; }).join(' · ')));
        var bbId = P.brainBreak(state.pool, used, state.actmap, state.catBucket, wi * 100 + di + 11);
        if (bbId) {
          dayHead.appendChild(el('p', null, '⚡ Brain-break idea: ' + state.actmap[bbId].name +
            ' (runs cold in ' + state.actmap[bbId].time_min + ' min or less)'));
        }
        host.appendChild(dayHead);
        d.slots.forEach(function (s) {
          var a = s.activityId && state.actmap[s.activityId];
          if (!a) return;
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
          if (P.needsWeatherBackup(a)) {
            var wbId = P.weatherBackupFor(a, state.pool, used, state.actmap,
              state.catBucket, state.opts, wi * 1000 + di * 10 + s.slot);
            if (wbId) {
              card.appendChild(el('p', null, '🌦️ If it rains: run “' +
                state.actmap[wbId].name + '” instead (indoor' +
                (state.actmap[wbId].no_prep ? ', no prep' : '') + ').'));
            }
          }
          card.appendChild(el('p', 'print-url', 'Full card — ' + cardUrl('activity/' + a.id + '.html')));
          host.appendChild(card);
        });
      });
    });

    // Supply list print page.
    var supplies = P.aggregateSupplies(state.plan.weeks, state.actmap);
    if (supplies.length) {
      var sp = el('section', 'print-supply');
      sp.setAttribute('aria-label', 'Print: supply list');
      sp.appendChild(el('h3', null, '🛒 Supply list — ' + state.plan.name));
      var sul = el('ul', null);
      supplies.forEach(function (g) {
        sul.appendChild(el('li', null, g.display + ' — ' + g.count + ' activit' +
          (g.count === 1 ? 'y' : 'ies') + ' (' + g.dayLabels.join(', ') + ')'));
      });
      sp.appendChild(sul);
      host.appendChild(sp);
    }

    // Substitute kit print pages.
    var kp = el('section', 'print-subkit');
    kp.setAttribute('aria-label', 'Print: substitute kit');
    kp.appendChild(el('h3', null, '🆘 Substitute kit — ' + state.plan.name));
    kp.appendChild(el('p', null,
      'Every backup is no-prep, zero materials. Any adult can run these cold.'));
    state.plan.weeks.forEach(function (w, wi) {
      if (state.plan.weeks.length > 1) kp.appendChild(el('h4', null, 'Week ' + w.weekNum));
      w.days.forEach(function (d, di) {
        kp.appendChild(el('h4', null, d.day));
        var kul = el('ul', null);
        d.slots.forEach(function (s) {
          var a = s.activityId && state.actmap[s.activityId];
          if (!a) return;
          var bid = P.subBackupFor(a, state.pool, used, state.actmap,
            state.catBucket, state.opts, wi * 1000 + di * 10 + s.slot + 7);
          if (bid) {
            var b = state.actmap[bid];
            var li = el('li', null, 'Slot ' + s.slot + ' — instead of “' + a.name +
              '”: ' + b.name + ' (' + b.time_min + '–' + b.time_max + ' min, no prep). ');
            if (b.steps && b.steps.length) {
              li.appendChild(el('br', null, null));
              li.appendChild(document.createTextNode(
                'Steps: ' + b.steps.slice(0, 3).map(function (st) {
                  return typeof st === 'string' ? st : (st.text || st.step || '');
                }).join(' → ')));
            }
            kul.appendChild(li);
          } else {
            kul.appendChild(el('li', null, 'Slot ' + s.slot + ' (“' + a.name +
              '”): no no-prep backup fit — room\u2019s usual filler works.'));
          }
        });
        kp.appendChild(kul);
      });
    });
    host.appendChild(kp);
  }

  /* ---------------- season strip (kept from 1.0) ---------------- */

  var SEASON_LABELS = {
    'season:fall': '🎃 Fall', 'season:winter': '❄️ Winter', 'season:spring': '🌷 Spring',
    'season:summer': '☀️ Summer',
    'holiday:halloween': '👻 Halloween', 'holiday:thanksgiving': '🦃 Thanksgiving',
    'holiday:dia-de-muertos': '💀 Día de los Muertos',
    'holiday:christmas': '🎄 Christmas', 'holiday:hanukkah': '🕎 Hanukkah',
    'holiday:kwanzaa': '🖤 Kwanzaa', 'holiday:new-year': '🎆 New Year',
    'holiday:easter': '🐣 Easter', 'holiday:earth-day': '🌎 Earth Day',
    'holiday:july-4th': '🇺🇸 July 4th',
    'theme:spooky': '🕸️ Spooky (not scary)'
  };
  var SEASON_BY_MONTH = { 8: 'season:fall', 9: 'season:fall', 10: 'season:fall',
                          11: 'season:winter', 0: 'season:winter', 1: 'season:winter',
                          2: 'season:spring', 3: 'season:spring', 4: 'season:spring',
                          5: 'season:summer', 6: 'season:summer', 7: 'season:summer' };
  var HOLIDAY_BY_MONTH = {
    2: ['holiday:easter'],
    3: ['holiday:easter', 'holiday:earth-day'],
    6: ['holiday:july-4th'],
    9: ['holiday:halloween', 'holiday:dia-de-muertos'],
    10: ['holiday:thanksgiving', 'holiday:hanukkah', 'holiday:kwanzaa'],
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

  /* ---------------- form build ---------------- */

  function buildForm() {
    buildSeasonStrip();

    // Program presets + age bands.
    var progSel = document.getElementById('p-program');
    Object.keys(P.PROGRAMS).forEach(function (k) {
      var o = el('option', null, P.PROGRAMS[k].label);
      o.value = k;
      progSel.appendChild(o);
    });
    var bandSel = document.getElementById('p-ageband');
    Object.keys(P.AGE_BANDS).forEach(function (k) {
      var o = el('option', null, P.AGE_BANDS[k].label);
      o.value = k;
      bandSel.appendChild(o);
    });
    bandSel.value = 'g3-5';
    progSel.addEventListener('change', programDefaults);

    // Collection seed dropdown.
    var collSel = document.getElementById('p-collection');
    state.collections.forEach(function (c) {
      var o = el('option', null, c.glyph + ' ' + c.title + ' (' + c.picks.length + ')');
      o.value = c.id;
      collSel.appendChild(o);
    });

    // Category chips.
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

    document.getElementById('slots-per-day').addEventListener('change', updateDayMinutes);
    document.getElementById('max-time').addEventListener('change', updateDayMinutes);

    document.getElementById('generate').addEventListener('click', function () { generate(); });
    document.getElementById('regenerate').addEventListener('click', function () { generate(); });
    document.getElementById('surprise-fill').addEventListener('click', surpriseFill);
    document.getElementById('print-plan').addEventListener('click', function () { window.print(); });
    document.getElementById('copy-week').addEventListener('click', copyWeek);
    document.getElementById('copy-plan-link').addEventListener('click', copyPlanLink);
    document.getElementById('export-ics').addEventListener('click', exportICS);
    document.getElementById('save-plan').addEventListener('click', saveCurrentPlan);

    renderSaved();
    programDefaults();
    handleDeepLinks();
  }

  /* ---------------- deep links ---------------- */

  function handleDeepLinks() {
    var q = {};
    window.location.search.replace(/^\?/, '').split('&').forEach(function (pair) {
      var kv = pair.split('=');
      if (kv[0]) q[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    });

    if (q.plan) {
      try {
        var data = P.validatePlanData(P.decodePlan(q.plan), state.actmap);
        var totalDays = 0;
        data.weeks.forEach(function (w) { totalDays += w.days.length; });
        if (!totalDays) {
          status('That plan link didn\u2019t contain any usable days — it may be from an older version.');
          return;
        }
        var opts = getForm();
        opts.programType = data.programType;
        opts.maxTime = data.maxTime;
        opts.weeks = data.weeks.length;
        state.opts = opts;
        setForm(opts);
        state.pool = P.filterPool(state.activities, opts);
        state.plan = {
          version: 2, name: data.name,
          programType: data.programType, maxTime: data.maxTime,
          ageBand: opts.ageBand, weeks: data.weeks
        };
        renderPlan();
        buildPrintDeck();
        document.getElementById('plan-actions').hidden = false;
        var msg = 'Opened shared plan “' + data.name + '” (' + data.weeks.length +
          (data.weeks.length === 1 ? ' week' : ' weeks') + ').';
        if (data.dropped.length) msg += ' ' + data.dropped.length + ' activit' +
          (data.dropped.length === 1 ? 'y' : 'ies') + ' in the link aren\u2019t in the library and were skipped.';
        status(msg);
      } catch (e) {
        status('That plan link couldn\u2019t be read — it may be corrupted.');
      }
      return;
    }

    if (q.from && q.from.indexOf('collection:') === 0) {
      var cid = q.from.slice('collection:'.length);
      var coll = state.collections.filter(function (c) { return c.id === cid; })[0];
      if (coll) {
        document.getElementById('p-collection').value = cid;
        generate(coll.picks.map(function (p) { return p.id; }),
          'Seeded from ' + coll.glyph + ' ' + coll.title + '. ');
      } else {
        status('Collection “' + cid + '” not found — showing the plain planner.');
      }
    }
  }

  /* ---------------- init ---------------- */

  function init() {
    if (!document.getElementById('week-plan')) return;
    Promise.all([
      fetch('data/activities.json').then(function (r) { return r.json(); }),
      fetch('data/categories.json').then(function (r) { return r.json(); }),
      fetch('data/balance-buckets.json').then(function (r) { return r.json(); }),
      fetch('data/collections.json').then(function (r) { return r.json(); })
    ]).then(function (res) {
      state.activities = res[0];
      state.categories = res[1];
      res[1].forEach(function (c) { state.catMap[c.id] = c; });
      state.activities.forEach(function (a) { state.actmap[a.id] = a; });
      state.catBucket = P.buildCatBucket(res[2].mapping);
      state.collections = res[3].collections;
      buildForm();
    }).catch(function () {
      status('Could not load the activity library. Check your connection and reload.');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
