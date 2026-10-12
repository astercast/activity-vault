/* Activity Vault — Smart Weekly Planner 2.0.
   Auto-build balanced weeks, balance meter, drag-and-drop, swap, surprise-fill,
   named saved plans, .ics export, collection seeding, shareable ?plan= links. */
(function () {
  'use strict';

  var P = window.VaultPlanner;
  var DAYS7 = P.WEEKDAYS;
  var PLANS_KEY = 'activityvault.plans.v1';

  var state = {
    activities: [], categories: [], catMap: {}, actmap: {},
    catBucket: {}, collections: [],
    plan: null,   // {version, name, programType, maxTime, days:[{day, slots:[{slot, activityId}]}]}
    opts: null,   // last-used constraint snapshot (drives swap/fill)
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
    state.notes = [];

    if (!state.pool.length) {
      status('No activities match those constraints — try loosening them.');
      document.getElementById('plan-actions').hidden = true;
      buildPrintDeck();
      return;
    }

    var res = P.buildWeek(state.activities, opts, state.catBucket);
    state.notes = res.notes;
    state.plan = {
      version: 1,
      name: document.getElementById('plan-name-input') &&
            document.getElementById('plan-name-input').value.trim() || defaultPlanName(),
      programType: opts.programType,
      maxTime: opts.maxTime,
      ageBand: opts.ageBand,
      days: res.days
    };

    var totalSlots = opts.days.length * opts.slotsPerDay;
    var filled = 0;
    res.days.forEach(function (d) {
      d.slots.forEach(function (s) { if (s.activityId) filled++; });
    });
    var msg = notePrefix || '';
    msg += 'Planned ' + filled + ' of ' + totalSlots + ' slots from ' + state.pool.length + ' matching activities.';
    if (res.seedPlaced) msg += ' Seeded ' + res.seedPlaced + ' curator pick' + (res.seedPlaced > 1 ? 's' : '') + '.';
    if (res.seedSkipped) msg += ' ' + res.seedSkipped + ' collection pick' + (res.seedSkipped > 1 ? 's' : '') +
      ' didn\u2019t fit your filters — filled from the library instead.';
    if (res.notes.length) msg += ' ' + res.notes.join(' ');
    status(msg);

    renderPlan();
    buildPrintDeck();
    document.getElementById('plan-actions').hidden = false;
  }

  function defaultPlanName() {
    var d = new Date();
    return 'Week of ' + d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
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

  function renderSlot(d, s, dayIdx) {
    var li = el('li', 'slot');
    li.draggable = true;
    li.dataset.day = String(dayIdx);
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
      swap.setAttribute('aria-label', 'Swap ' + a.name + ' for a different activity');
      swap.addEventListener('click', function () { swapSlot(dayIdx, s.slot); });
      acts.appendChild(swap);
    }
    var up = el('button', 'btn btn-small btn-ghost', '↑');
    up.type = 'button';
    up.setAttribute('aria-label', 'Move slot ' + s.slot + ' up');
    up.addEventListener('click', function () { moveSlot(dayIdx, s.slot, -1); });
    var down = el('button', 'btn btn-small btn-ghost', '↓');
    down.type = 'button';
    down.setAttribute('aria-label', 'Move slot ' + s.slot + ' down');
    down.addEventListener('click', function () { moveSlot(dayIdx, s.slot, 1); });
    acts.appendChild(up);
    acts.appendChild(down);
    body.appendChild(acts);
    li.appendChild(body);

    // Drag-and-drop reorder within the day (keyboard users get the ↑/↓ buttons).
    li.addEventListener('dragstart', function (ev) {
      ev.dataTransfer.setData('text/plain', dayIdx + ':' + s.slot);
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
      dropSlot(dayIdx, parseInt(parts[1], 10), s.slot);
    });
    return li;
  }

  function renderPlan() {
    var out = document.getElementById('week-plan');
    out.innerHTML = '';
    if (!state.plan) return;

    // Week-level balance summary + warnings.
    var weekBal = el('div', 'week-balance');
    var wcounts = {};
    P.BUCKET_IDS.forEach(function (b) { wcounts[b] = 0; });
    var wtotal = 0;
    state.plan.days.forEach(function (d) {
      var b = P.balanceOf(d.slots, state.actmap, state.catBucket);
      P.BUCKET_IDS.forEach(function (k) { wcounts[k] += b.counts[k]; });
      wtotal += b.total;
    });
    weekBal.appendChild(el('h3', null, 'Week balance'));
    weekBal.appendChild(meterBar({ counts: wcounts, total: wtotal }));
    var wwarn = P.weekWarnings(state.plan.days, state.actmap, state.catBucket);
    if (wwarn.length) {
      var wul = el('ul', 'meter-warnings');
      wwarn.forEach(function (w) { wul.appendChild(el('li', null, '⚠️ ' + w)); });
      weekBal.appendChild(wul);
    }
    out.appendChild(weekBal);

    state.plan.days.forEach(function (d, dayIdx) {
      var card = el('section', 'day-card');
      card.setAttribute('aria-label', d.day + ' plan');
      card.appendChild(el('h3', null, d.day));
      var bal = P.balanceOf(d.slots, state.actmap, state.catBucket);
      card.appendChild(meterBar(bal));
      var legend = el('p', 'meter-legend',
        P.BUCKETS.map(function (b) { return b.glyph + ' ' + b.label + ': ' + bal.counts[b.id]; }).join(' · '));
      card.appendChild(legend);
      var warns = P.dayWarnings(bal, d.day);
      if (warns.length) {
        var ul = el('ul', 'meter-warnings');
        warns.forEach(function (w) { ul.appendChild(el('li', null, '⚠️ ' + w)); });
        card.appendChild(ul);
      }
      var list = el('ol', 'slot-list');
      list.setAttribute('aria-label', d.day + ' slots');
      d.slots.forEach(function (s) { list.appendChild(renderSlot(d, s, dayIdx)); });
      card.appendChild(list);
      out.appendChild(card);
    });
  }

  function refreshDay(dayIdx) {
    renderPlan();
    buildPrintDeck();
  }

  /* ---------------- slot actions ---------------- */

  function swapSlot(dayIdx, slotNum) {
    var day = state.plan.days[dayIdx];
    var s = day.slots.filter(function (x) { return x.slot === slotNum; })[0];
    if (!s || !s.activityId) return;
    var oldName = state.actmap[s.activityId].name;
    var newId = P.swapCandidate(state.pool, state.plan.days, dayIdx,
      day.slots.indexOf(s), state.actmap, state.catBucket, state.opts);
    if (!newId) {
      status('Nothing else fits those constraints — loosen a filter and try again.');
      return;
    }
    s.activityId = newId;
    refreshDay(dayIdx);
    status('Swapped “' + oldName + '” for “' + state.actmap[newId].name + '”.');
  }

  function moveSlot(dayIdx, slotNum, dir) {
    var slots = state.plan.days[dayIdx].slots;
    var i = slots.map(function (x) { return x.slot; }).indexOf(slotNum);
    var j = i + dir;
    if (i < 0 || j < 0 || j >= slots.length) return;
    var t = slots[i]; slots[i] = slots[j]; slots[j] = t;
    slots.forEach(function (x, k) { x.slot = k + 1; });
    var a = slots[j].activityId ? state.actmap[slots[j].activityId].name : 'open slot';
    refreshDay(dayIdx);
    status('Moved “' + a + '” ' + (dir < 0 ? 'up' : 'down') + '.');
  }

  function dropSlot(dayIdx, fromSlotNum, toSlotNum) {
    if (fromSlotNum === toSlotNum) return;
    var slots = state.plan.days[dayIdx].slots;
    var from = slots.map(function (x) { return x.slot; }).indexOf(fromSlotNum);
    var to = slots.map(function (x) { return x.slot; }).indexOf(toSlotNum);
    if (from < 0 || to < 0) return;
    var moved = slots.splice(from, 1)[0];
    slots.splice(to, 0, moved);
    slots.forEach(function (x, k) { x.slot = k + 1; });
    var a = moved.activityId ? state.actmap[moved.activityId].name : 'open slot';
    refreshDay(dayIdx);
    status('Moved “' + a + '” to slot ' + (to + 1) + '.');
  }

  function surpriseFill() {
    if (!state.plan) return;
    function gaps() {
      var n = 0;
      state.plan.days.forEach(function (d) {
        d.slots.forEach(function (s) { if (!s.activityId) n++; });
      });
      return n;
    }
    var before = gaps();
    if (before === 0) { status('No gaps to fill — every slot already has an activity.'); return; }
    P.fillGaps(state.plan.days, state.pool, state.actmap, state.catBucket, state.opts);
    var placed = before - gaps();
    refreshDay(0);
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
        ' · ' + rec.days.length + ' days · saved ' +
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
    var rec = P.savedPlanRecord(name, state.opts, state.plan.days);
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
    state.opts = rec.opts || Object.assign(getForm(), {
      programType: validated.programType, maxTime: validated.maxTime
    });
    setForm(state.opts);
    state.pool = P.filterPool(state.activities, state.opts);
    state.plan = {
      version: 1, name: rec.name,
      programType: validated.programType, maxTime: validated.maxTime,
      ageBand: state.opts.ageBand, days: validated.days
    };
    renderPlan();
    buildPrintDeck();
    document.getElementById('plan-actions').hidden = false;
    status('Loaded “' + rec.name + '”.');
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

  function copyWeek() {
    if (!state.plan) return;
    var text = P.planText(state.plan, state.actmap, catName, ratingExportLine);
    // Deep links: absolute URLs when served over http(s).
    text = text.split('\n').map(function (line) {
      if (/^(activity|index)\//.test(line.trim())) {
        return line.replace(/(activity\/[a-z0-9-]+\.html|index\.html)/, function (m) {
          return cardUrl(m);
        });
      }
      return line;
    }).join('\n');
    copyText(text, document.getElementById('copy-week-status'));
  }

  function copyPlanLink() {
    if (!state.plan) return;
    var url = cardUrl('planner.html') + '?plan=' + P.encodePlan(state.plan);
    copyText(url, document.getElementById('copy-link-status'));
  }

  function exportICS() {
    if (!state.plan) return;
    var ics = P.exportICS(state.plan, state.actmap, new Date());
    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'activity-vault-week.ics';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    }, 1000);
    status('Downloaded activity-vault-week.ics — import it into any calendar app.');
  }

  /* ---------------- print deck (wave 7 pattern + balance lines) ---------------- */

  function buildPrintDeck() {
    var host = document.getElementById('print-week-cards');
    host.textContent = '';
    if (!state.plan) return;
    state.plan.days.forEach(function (d) {
      var bal = P.balanceOf(d.slots, state.actmap, state.catBucket);
      var dayHead = el('div', 'print-day-head');
      dayHead.appendChild(el('h3', null, d.day));
      dayHead.appendChild(el('p', null, 'Energy balance: ' +
        P.BUCKETS.map(function (b) { return b.glyph + ' ' + bal.counts[b.id]; }).join(' · ')));
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
        card.appendChild(el('p', 'print-url', 'Full card — ' + cardUrl('activity/' + a.id + '.html')));
        host.appendChild(card);
      });
    });
  }

  /* ---------------- season strip (kept from 1.0) ---------------- */

  var SEASON_LABELS = {
    'season:fall': '🎃 Fall', 'season:winter': '❄️ Winter', 'season:spring': '🌷 Spring',
    'holiday:halloween': '👻 Halloween', 'holiday:dia-de-muertos': '💀 Día de los Muertos',
    'holiday:christmas': '🎄 Christmas', 'holiday:hanukkah': '🕎 Hanukkah',
    'holiday:kwanzaa': '🖤 Kwanzaa', 'holiday:new-year': '🎆 New Year',
    'holiday:easter': '🐣 Easter', 'holiday:earth-day': '🌎 Earth Day',
    'theme:spooky': '🕸️ Spooky (not scary)'
  };
  var SEASON_BY_MONTH = { 8: 'season:fall', 9: 'season:fall', 10: 'season:fall',
                          11: 'season:winter', 0: 'season:winter', 1: 'season:winter',
                          2: 'season:spring', 3: 'season:spring', 4: 'season:spring' };
  var HOLIDAY_BY_MONTH = {
    2: ['holiday:easter'],
    3: ['holiday:easter', 'holiday:earth-day'],
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
        if (!data.days.length) {
          status('That plan link didn\u2019t contain any usable days — it may be from an older version.');
          return;
        }
        var opts = getForm();
        opts.programType = data.programType;
        opts.maxTime = data.maxTime;
        state.opts = opts;
        setForm(opts);
        state.pool = P.filterPool(state.activities, opts);
        state.plan = {
          version: 1, name: data.name,
          programType: data.programType, maxTime: data.maxTime,
          ageBand: opts.ageBand, days: data.days
        };
        renderPlan();
        buildPrintDeck();
        document.getElementById('plan-actions').hidden = false;
        var msg = 'Opened shared plan “' + data.name + '”.';
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
