/* Activity Vault — Field Trip Planner (wave 14).
   Builds a complete field-trip plan from the real library: chaperone math,
   buddy pairs, budget arithmetic, a clock-time timeline, on-site suggestions
   matched to the destination, bus-ride activities from the real
   field-trip-bus-ride collection, and printable permission-slip + pack lists.
   Pure math lives in assets/fieldtrip-core.js (UMD, headless-testable);
   this file is the DOM layer. */
(function () {
  'use strict';

  var FT = window.VaultFieldTrip;
  if (!FT) return;

  var BUS_COLLECTION_ID = 'field-trip-bus-ride';

  function $(id) { return document.getElementById(id); }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }

  function money(n) {
    return '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
  }

  function readForm() {
    var destSel = $('ft-destination'), bandSel = $('ft-ageband');
    var band = FT.AGE_BANDS[bandSel.value] || FT.AGE_BANDS.all;
    var tripLength = document.querySelector('input[name="ft-length"]:checked');
    var ratioSel = $('ft-ratio');
    return {
      destId: destSel.value,
      ageMin: band.min, ageMax: band.max, bandLabel: band.label,
      kids: Math.max(4, Math.min(60, parseInt($('ft-kids').value, 10) || 24)),
      tripLength: tripLength ? tripLength.value : 'half',
      startMin: FT.parseClock($('ft-start').value) || 9 * 60,
      travelOutMin: Math.max(0, parseInt($('ft-travel-out').value, 10) || 0),
      travelBackMin: Math.max(0, parseInt($('ft-travel-back').value, 10) || 0),
      ratio: parseInt(ratioSel.value, 10) || 8,
      admission: Math.max(0, parseFloat($('ft-admission').value) || 0),
      transport: Math.max(0, parseFloat($('ft-transport').value) || 0),
      rideMin: Math.max(0, parseInt($('ft-ride').value, 10) || 0)
    };
  }

  function planSummary(f, chap, buddies, budget, dest) {
    var s = el('section', 'collection-section');
    s.setAttribute('aria-labelledby', 'ft-h-summary');
    var head = el('div', 'collection-head');
    var glyph = el('span', 'collection-glyph-lg', '📋');
    glyph.setAttribute('aria-hidden', 'true');
    var h2 = el('h2', 'collection-h2', 'Trip summary');
    h2.id = 'ft-h-summary';
    head.appendChild(glyph); head.appendChild(h2);
    s.appendChild(head);
    var dl = el('dl', 'fact-grid');
    var rows = [
      ['Destination', dest.glyph + ' ' + dest.label],
      ['Group', f.kids + ' kids (' + f.bandLabel + ')'],
      ['Chaperones', chap.chaperones + ' adults (1:' + f.ratio + ' ratio) — ' + chap.total + ' total headcount'],
      ['Buddy pairs', buddies.pairs + ' pairs' + (buddies.trios ? ' + 1 trio' : '')],
      ['Budget', money(budget.total) + ' total (' + money(budget.perKid) + ' per kid)']
    ];
    rows.forEach(function (r) {
      var div = el('div');
      div.appendChild(el('dt', null, r[0]));
      div.appendChild(el('dd', null, r[1]));
      dl.appendChild(div);
    });
    s.appendChild(dl);
    var note = el('p', 'dim',
      'Chaperone ratio is your input — confirm the required ratio with your program\u2019s policy before the trip. ' +
      'Budget is arithmetic on the numbers you entered; confirm admission prices with the destination.');
    s.appendChild(note);
    return s;
  }

  function planTimeline(tl) {
    var s = el('section', 'collection-section');
    s.setAttribute('aria-labelledby', 'ft-h-timeline');
    var head = el('div', 'collection-head');
    var glyph = el('span', 'collection-glyph-lg', '🕐');
    glyph.setAttribute('aria-hidden', 'true');
    var h2 = el('h2', 'collection-h2', 'Timeline');
    h2.id = 'ft-h-timeline';
    head.appendChild(glyph); head.appendChild(h2);
    s.appendChild(head);
    if (tl.warning) {
      var warn = el('p', 'ft-warning', '⚠️ ' + tl.warning);
      warn.setAttribute('role', 'alert');
      s.appendChild(warn);
    }
    var ol = el('ol', 'pick-list');
    tl.blocks.forEach(function (b) {
      var li = el('li', 'pick');
      var row = el('div', 'pick-row');
      row.appendChild(el('strong', null, FT.fmtClock(b.start) + ' – ' + FT.fmtClock(b.end)));
      li.appendChild(row);
      li.appendChild(el('p', 'pick-facts', b.label + ' · ' + b.minutes + ' min'));
      ol.appendChild(li);
    });
    s.appendChild(ol);
    return s;
  }

  function activityCards(title, glyph, blurb, picks, headingId) {
    var s = el('section', 'collection-section');
    s.setAttribute('aria-labelledby', headingId);
    var head = el('div', 'collection-head');
    var g = el('span', 'collection-glyph-lg', glyph);
    g.setAttribute('aria-hidden', 'true');
    var h2 = el('h2', 'collection-h2', title);
    h2.id = headingId;
    head.appendChild(g); head.appendChild(h2);
    s.appendChild(head);
    s.appendChild(el('p', 'collection-when', blurb));
    var ol = el('ol', 'pick-list');
    picks.forEach(function (a) {
      var li = el('li', 'pick');
      var row = el('div', 'pick-row');
      var link = el('a', 'pick-name', a.name);
      link.href = 'activity/' + a.id + '.html';
      row.appendChild(link);
      li.appendChild(row);
      li.appendChild(el('p', 'pick-facts',
        'Ages ' + a.age_min + '–' + a.age_max + ' · ' + a.time_min + '–' + a.time_max + ' min' +
        (a.no_prep ? ' · no prep' : '')));
      li.appendChild(el('p', 'pick-note', '💡 ' + a.tagline));
      ol.appendChild(li);
    });
    s.appendChild(ol);
    return s;
  }

  function checklistsSection(kids) {
    var s = el('section', 'collection-section');
    s.setAttribute('aria-labelledby', 'ft-h-check');
    var head = el('div', 'collection-head');
    var glyph = el('span', 'collection-glyph-lg', '✅');
    glyph.setAttribute('aria-hidden', 'true');
    var h2 = el('h2', 'collection-h2', 'Checklists');
    h2.id = 'ft-h-check';
    head.appendChild(glyph); head.appendChild(h2);
    s.appendChild(head);

    // web-craft round 2: native <details name> accordions — free keyboard behavior,
    // exclusive-open; print CSS forces them open so nothing is lost on paper.
    function accord(title, open, build) {
      var d = document.createElement('details');
      d.className = 'ft-check';
      d.setAttribute('name', 'ft-checklists');
      if (open) d.setAttribute('open', '');
      var sum = document.createElement('summary');
      sum.textContent = title;
      d.appendChild(sum);
      build(d);
      return d;
    }

    s.appendChild(accord('📝 Permission slips (' + kids + ' students)', true, function (d) {
    var table = el('table', 'ft-table');
    var thead = el('thead');
    var hr = el('tr');
    ['Student name', 'Emergency contact', 'Allergies / medical notes', 'Photo release', 'Signature'].forEach(function (t) {
      hr.appendChild(el('th', null, t));
    });
    thead.appendChild(hr); table.appendChild(thead);
    var tbody = el('tbody');
    for (var i = 0; i < kids; i++) {
      var tr = el('tr');
      for (var c = 0; c < 5; c++) tr.appendChild(el('td', 'ft-cell', ''));
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    d.appendChild(table);
    }));

    s.appendChild(accord('🎒 Pack list', false, function (d) {
    var pack = ['First-aid kit', 'Attendance roster + buddy-pair list', 'Water bottles',
      'Snacks', 'Allergy / medical info folder (sealed, with a lead chaperone)',
      'Charged phone + destination phone number', 'Trash bags + hand wipes',
      'Sunscreen / hats if outdoors (check the forecast)', 'Emergency cash / card'];
    var ul = el('ul', 'pick-list');
    pack.forEach(function (p) {
      var li = el('li', 'pick');
      li.appendChild(el('p', 'pick-note', '☐ ' + p));
      ul.appendChild(li);
    });
    d.appendChild(ul);
    }));

    s.appendChild(accord('🔢 Headcount routine', false, function (d) {
    var hc = el('ol', 'pick-list');
    ['Count at departure — kids + chaperones, out loud, twice.',
     'Count on arrival before anyone leaves the bus.',
     'Count at every transition: site entry, lunch, site exit.',
     'Buddy check: pairs confirm each other before each move.',
     'Final count on the bus before it rolls — no one left behind.'].forEach(function (t) {
      var li = el('li', 'pick');
      li.appendChild(el('p', 'pick-note', t));
      hc.appendChild(li);
    });
    d.appendChild(hc);
    }));
    return s;
  }

  function copyText(f, dest, chap, buddies, budget, tl) {
    var lines = [
      'FIELD TRIP PLAN — ' + dest.label,
      f.kids + ' kids (' + f.bandLabel + '), ' + (f.tripLength === 'full' ? 'full day' : 'half day'),
      'Chaperones: ' + chap.chaperones + ' (1:' + f.ratio + ') — ' + chap.total + ' total',
      'Buddy groups: ' + buddies.pairs + ' pairs' + (buddies.trios ? ' + 1 trio' : ''),
      'Budget: ' + money(budget.total) + ' total, ' + money(budget.perKid) + ' per kid',
      '', 'TIMELINE:'
    ];
    tl.blocks.forEach(function (b) {
      lines.push(FT.fmtClock(b.start) + '–' + FT.fmtClock(b.end) + '  ' + b.label + ' (' + b.minutes + ' min)');
    });
    if (tl.warning) lines.push('', 'WARNING: ' + tl.warning);
    return lines.join('\n');
  }

  var cache = { activities: null, collections: null };

  function loadData() {
    if (cache.activities) return Promise.resolve(cache);
    return Promise.all([
      fetch('api/v1/activities.json').then(function (r) { return r.json(); }),
      fetch('api/v1/collections.json').then(function (r) { return r.json(); })
    ]).then(function (res) {
      cache.activities = res[0].activities || res[0];
      cache.collections = res[1].collections || res[1];
      return cache;
    });
  }

  function generate() {
    var status = $('ft-status');
    var host = $('ft-results');
    var f = readForm();
    var dest = FT.DESTINATIONS[f.destId];
    status.textContent = 'Building your field-trip plan…';
    loadData().then(function (data) {
      var byId = {};
      data.activities.forEach(function (a) { byId[a.id] = a; });
      var chap = FT.chaperonesNeeded(f.kids, f.ratio);
      var buddies = FT.buddyGroups(f.kids);
      var budget = FT.budgetTotal(f.kids, f.admission, f.transport);
      var tl = FT.buildTimeline({
        tripLength: f.tripLength, travelOutMin: f.travelOutMin,
        travelBackMin: f.travelBackMin, startMin: f.startMin
      });
      var onsite = FT.matchOnSite(data.activities, f.destId, f.ageMin, f.ageMax, 6);
      var busColl = data.collections.filter(function (c) { return c.id === BUS_COLLECTION_ID; })[0];
      var busPicks = busColl ? FT.pickBusActivities(busColl.picks, byId, f.ageMin, f.ageMax, f.rideMin) : [];

      host.textContent = '';
      host.appendChild(planSummary(f, chap, buddies, budget, dest));
      host.appendChild(planTimeline(tl));
      host.appendChild(activityCards('On-site activity ideas', dest.glyph,
        dest.blurb + ' Matched from the Vault to your destination and age band — tap through for full instructions.',
        onsite, 'ft-h-onsite'));
      if (busPicks.length) {
        host.appendChild(activityCards('Bus-ride activities', '🚌',
          'From the Vault\u2019s field-trip-bus-ride collection — sized for a ' + f.rideMin + '-minute ride.',
          busPicks, 'ft-h-bus'));
      }
      host.appendChild(checklistsSection(f.kids));

      var actions = el('div', 'hero-actions no-print');
      var printBtn = el('button', 'btn', '🖨️ Print trip sheet');
      printBtn.type = 'button';
      printBtn.addEventListener('click', function () { window.print(); });
      var copyBtn = el('button', 'btn btn-ghost', '📋 Copy trip summary');
      copyBtn.type = 'button';
      copyBtn.addEventListener('click', function () {
        var text = copyText(f, dest, chap, buddies, budget, tl);
        function done() { copyBtn.textContent = '✅ Copied!'; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
        } else { fallbackCopy(text, done); }
      });
      actions.appendChild(printBtn);
      actions.appendChild(copyBtn);
      host.appendChild(actions);

      status.textContent = 'Plan ready: ' + dest.label + ', ' + f.kids + ' kids, ' +
        chap.chaperones + ' chaperones, ' + onsite.length + ' on-site ideas' +
        (busPicks.length ? ', ' + busPicks.length + ' bus activities' : '') + '.';
      host.scrollIntoView();
    }).catch(function () {
      status.textContent = 'Could not load the activity library. Check your connection and reload.';
    });
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute'; ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  function init() {
    var destSel = $('ft-destination');
    if (!destSel) return;
    FT.DESTINATION_IDS.forEach(function (id) {
      var d = FT.DESTINATIONS[id];
      var o = el('option', null, d.glyph + ' ' + d.label);
      o.value = id;
      destSel.appendChild(o);
    });
    var bandSel = $('ft-ageband');
    Object.keys(FT.AGE_BANDS).forEach(function (k) {
      var o = el('option', null, FT.AGE_BANDS[k].label);
      o.value = k;
      bandSel.appendChild(o);
    });
    $('ft-generate').addEventListener('click', generate);
    loadData().catch(function () { /* status shows on generate */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
