/* Activity Vault — class-party planner (Halloween + winter presets).
   Fetches data/activities.json, builds a timed station-rotation plan
   from seasonal activities for theme + class size + minutes + stations + budget. */
(function () {
  'use strict';

  var PARTY_CATS = ['crafts', 'pe-movement', 'rainy-day', 'quiet-focus', 'team-community', 'icebreakers'];
  var THEMES = {
    halloween: {
      label: 'Halloween',
      tags: ['holiday:halloween', 'holiday:dia-de-muertos', 'season:fall', 'theme:spooky'],
      groupNames: ['Ghosts', 'Bats', 'Pumpkins', 'Spiders', 'Witches', 'Black Cats'],
      heroKicker: '🎃 Party Planner',
      heroTitle: 'The Halloween<br>class-party planner.',
      heroLede: 'Tell it your class size, how long the party runs, how many stations you can staff, and your budget — it builds a timed station-rotation plan from the Vault\'s fall and Halloween activities, with a merged setup list and a print-ready run sheet.',
      planKicker: '🎃 Halloween class-party run sheet',
      planTitle: 'Halloween party',
      breakMin: 0,
      closingIntro: '0:05 — Welcome & costume parade (5 min). Then rotate on the timer.',
      closingRegroup: 'Regroup: costume category vote or group photo, hand out take-homes, clean stations'
    },
    winter: {
      label: 'Winter',
      tags: ['holiday:christmas', 'holiday:new-year', 'season:winter'],
      groupNames: ['Snowflakes', 'Penguins', 'Reindeer', 'Mittens', 'Icicles', 'Cocoa Bears'],
      heroKicker: '❄️ Party Planner',
      heroTitle: 'The winter<br>class-party planner.',
      heroLede: 'Tell it your class size, how long the party runs, how many stations you can staff, and your budget — it builds a timed station-rotation plan from the Vault\'s winter activities, with a cozy warm-up break halfway through, a merged setup list, and a print-ready run sheet.',
      planKicker: '❄️ Winter class-party run sheet',
      planTitle: 'Winter party',
      breakMin: 5,
      closingIntro: '0:05 — Welcome & winter wishes (5 min). Then rotate on the timer, with a warm-up break halfway.',
      closingRegroup: 'Regroup: share one favorite moment, hand out take-homes, clean stations'
    }
  };
  var CHEAP_WORDS = ['paper', 'crayon', 'marker', 'pencil', 'pen', 'glue', 'scissors',
    'tape', 'balloon', 'bag', 'plate', 'cup', 'string', 'yarn', 'dice', 'card',
    'bean', 'print', 'chalk', 'sticker', 'ribbon', 'towel', 'tissue', 'newspaper',
    'box', 'sock', 'button', 'cotton', 'pipe cleaner', 'toothpick'];
  var BUDGET_LABELS = {
    shoestring: 'Shoestring budget',
    moderate: 'Moderate budget',
    splurge: 'Splurge budget'
  };
  var INTRO_MIN = 5, WRAP_MIN = 5;

  var activities = [];

  function $(id) { return document.getElementById(id); }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function getTheme() {
    var r = document.querySelector('input[name="theme"]:checked');
    var key = r ? r.value : 'halloween';
    return THEMES[key] ? { key: key, def: THEMES[key] } : { key: 'halloween', def: THEMES.halloween };
  }

  function isPartyReady(a, themeDef) {
    var tags = a.tags || [];
    if (!tags.some(function (t) { return themeDef.tags.indexOf(t) !== -1; })) return false;
    return a.categories.some(function (c) { return PARTY_CATS.indexOf(c) !== -1; });
  }

  function cheapEnough(a) {
    if (!a.materials.length || a.no_prep) return true;
    return a.materials.every(function (m) {
      var item = m.item.toLowerCase();
      return CHEAP_WORDS.some(function (w) { return item.indexOf(w) !== -1; });
    });
  }

  function filterPool(themeDef, roundMin, perGroup, budget) {
    return activities.filter(function (a) {
      if (!isPartyReady(a, themeDef)) return false;
      // Party stations run a "party-paced" cut: the activity's honest floor
      // can be up to 5 minutes longer than the round.
      if (a.time_min > roundMin + 5) return false;
      if (a.group_max < perGroup || a.group_min > perGroup) return false;
      if (budget === 'shoestring' && !cheapEnough(a)) return false;
      return true;
    });
  }

  function pickStations(pool, n, offset) {
    var order = pool.slice().sort(function (x, y) {
      return ((y.no_prep ? 1 : 0) - (x.no_prep ? 1 : 0)) ||
             (y.time_max - x.time_max) ||
             (x.id < y.id ? -1 : 1);
    });
    if (offset) order = order.slice(offset).concat(order.slice(0, offset));
    var picks = [], usedCats = {}, remaining = order;
    while (picks.length < n && remaining.length) {
      var idx = 0, i;
      for (i = 0; i < remaining.length; i++) {
        if (!usedCats[remaining[i].categories[0]]) { idx = i; break; }
      }
      var a = remaining.splice(idx, 1)[0];
      picks.push(a);
      usedCats[a.categories[0]] = true;
    }
    return picks;
  }

  function fmtClock(total) {
    var h = Math.floor(total / 60), m = total % 60;
    return (h ? h + ':' : '0:') + (m < 10 ? '0' + m : m);
  }

  function renderPlan(picks, opts) {
    var stations = picks.length;
    var roundMin = opts.roundMin;
    var themeDef = opts.themeDef;
    var groups = themeDef.groupNames.slice(0, stations);
    var breakMin = themeDef.breakMin;
    var breakAfter = breakMin ? Math.ceil(stations / 2) : 0; // cozy warm-up break midway

    $('party-meta').textContent =
      themeDef.label + ' theme · ' + opts.classSize + ' kids · ' + opts.minutes + ' minutes · ' +
      stations + ' stations (' + roundMin + ' min each) · ' + BUDGET_LABELS[opts.budget];
    document.getElementById('party-kicker').textContent = themeDef.planKicker;
    $('party-plan-title').textContent = themeDef.planTitle + ' — ' + opts.minutes + '-minute run sheet';

    // rotation timetable
    var rounds = $('party-rounds');
    rounds.textContent = '';
    var t = INTRO_MIN;
    for (var r = 0; r < stations; r++) {
      var li = el('li', 'plan-block');
      var head = el('div', 'plan-block-head');
      head.appendChild(el('span', 'plan-time', fmtClock(t) + '–' + fmtClock(t + roundMin)));
      head.appendChild(el('span', 'plan-title', 'Round ' + (r + 1)));
      li.appendChild(head);
      var body = el('div', 'plan-block-body');
      var ul = el('ul', 'rotation-list');
      for (var g = 0; g < stations; g++) {
        var st = picks[(g + r) % stations];
        ul.appendChild(el('li', null, groups[g] + ' → ' + st.name));
      }
      body.appendChild(ul);
      li.appendChild(body);
      rounds.appendChild(li);
      t += roundMin;
      if (breakAfter && r + 1 === breakAfter) {
        var bli = el('li', 'plan-block');
        var bhead = el('div', 'plan-block-head');
        bhead.appendChild(el('span', 'plan-time', fmtClock(t) + '–' + fmtClock(t + breakMin)));
        bhead.appendChild(el('span', 'plan-title', '☕ Warm-up break'));
        bli.appendChild(bhead);
        var bbody = el('div', 'plan-block-body');
        bbody.appendChild(el('p', null, 'Stretch, sip water (cocoa if your school allows it), and get cozy — then rotate to your next station.'));
        bli.appendChild(bbody);
        rounds.appendChild(bli);
        t += breakMin;
      }
    }

    // setup checklist, one column per station
    var setup = $('party-setup');
    setup.textContent = '';
    var seenItems = {};
    picks.forEach(function (a, i) {
      var col = el('div', 'setup-col');
      col.appendChild(el('h4', null, 'Station ' + (i + 1) + ': ' + a.name));
      var ul2 = el('ul', 'setup-list');
      var added = 0;
      a.materials.forEach(function (m) {
        var key = m.item.toLowerCase();
        if (seenItems[key]) return;
        seenItems[key] = true;
        var li2 = el('li');
        var box = el('span', 'checkbox', '☐');
        box.setAttribute('aria-hidden', 'true');
        li2.appendChild(box);
        li2.appendChild(document.createTextNode(' ' + m.item + '  (station ' + (i + 1) + ')'));
        ul2.appendChild(li2);
        added++;
      });
      if (!added) ul2.appendChild(el('li', null, 'Nothing to gather — no materials needed.'));
      col.appendChild(ul2);
      setup.appendChild(col);
    });

    // station cards
    var list = $('party-stations-list');
    list.textContent = '';
    picks.forEach(function (a, i) {
      var li3 = el('li', 'plan-block');
      var head3 = el('div', 'plan-block-head');
      head3.appendChild(el('span', 'plan-time', roundMin + ' min'));
      var title = el('span', 'plan-title');
      var link = el('a', null, 'Station ' + (i + 1) + ': ' + a.name);
      link.href = 'activity/' + a.id + '.html';
      link.target = '_blank';
      link.rel = 'noopener';
      title.appendChild(link);
      head3.appendChild(title);
      li3.appendChild(head3);
      var body3 = el('div', 'plan-block-body');
      var steps = el('ol', 'plan-steps');
      a.steps.slice(0, 3).forEach(function (s) { steps.appendChild(el('li', null, s)); });
      body3.appendChild(steps);
      var more = el('p', 'plan-more');
      more.appendChild(document.createTextNode('Full card: '));
      var fl = el('a', null, 'activity/' + a.id + '.html');
      fl.href = 'activity/' + a.id + '.html';
      fl.target = '_blank';
      fl.rel = 'noopener';
      more.appendChild(fl);
      if (a.safety) more.appendChild(document.createTextNode(' — ⚠️ ' + a.safety));
      body3.appendChild(more);
      li3.appendChild(body3);
      list.appendChild(li3);
    });

    var wrapMin = opts.minutes - INTRO_MIN - stations * roundMin - themeDef.breakMin + WRAP_MIN;
    $('party-closing').textContent =
      themeDef.closingIntro + ' ' +
      fmtClock(INTRO_MIN + stations * roundMin + themeDef.breakMin) + ' — ' +
      themeDef.closingRegroup + ' (' + wrapMin + ' min). ' +
      'Tip: ring a bell 1 minute before each rotation so groups can finish up.';

    $('party-plan').hidden = false;
    $('party-actions').hidden = false;
    $('party-plan-title').focus({ preventScroll: false });
  }

  function generate(offset) {
    var theme = getTheme();
    var themeDef = theme.def;
    var classSize = Math.max(4, Math.min(60, parseInt($('party-size').value, 10) || 24));
    $('party-size').value = classSize;
    var minutes = parseInt($('party-minutes').value, 10);
    var stations = parseInt($('party-stations').value, 10);
    var budget = document.querySelector('input[name="budget"]:checked').value;
    var status = $('party-status');

    var roundMin = Math.floor((minutes - INTRO_MIN - WRAP_MIN - themeDef.breakMin) / stations);
    if (roundMin < 10) {
      status.textContent = 'Only ' + roundMin + ' minutes per station — that is too rushed. Add minutes or drop a station.';
      $('party-plan').hidden = true;
      $('party-actions').hidden = true;
      return;
    }
    var perGroup = Math.ceil(classSize / stations);
    var pool = filterPool(themeDef, roundMin, perGroup, budget);
    if (pool.length < stations) {
      status.textContent = 'Only ' + pool.length + ' ' + themeDef.label.toLowerCase() +
        ' party-ready activities fit ' + roundMin + '-minute rounds for groups of ~' + perGroup +
        (budget === 'shoestring' ? ' on a shoestring budget' : '') +
        '. Try fewer stations, more minutes, or a bigger budget.';
      $('party-plan').hidden = true;
      $('party-actions').hidden = true;
      return;
    }
    var picks = pickStations(pool, stations, offset);
    renderPlan(picks, { classSize: classSize, minutes: minutes, budget: budget, roundMin: roundMin, themeDef: themeDef });
    status.textContent = themeDef.label + ' party plan built: ' + stations + ' stations, ' + roundMin +
      ' minutes each, groups of ~' + perGroup + '.';
  }

  function init() {
    fetch('data/activities.json').then(function (r) { return r.json(); }).then(function (d) {
      activities = d.activities || d;
      $('party-status').textContent = 'Ready — ' + activities.length + ' activities loaded.';
    }).catch(function () {
      $('party-status').textContent = 'Could not load the activity library. Check your connection and reload.';
    });
    function syncHero() {
      var t = getTheme().def;
      document.getElementById('party-hero-kicker').textContent = t.heroKicker;
      document.getElementById('hero-title').innerHTML = t.heroTitle;
      document.getElementById('party-hero-lede').textContent = t.heroLede;
      document.getElementById('party-generate').textContent = '🎉 Build my ' + t.label.toLowerCase() + ' party plan';
    }
    $('party-generate').addEventListener('click', function () { generate(0); });
    $('party-reshuffle').addEventListener('click', function () {
      generate(Math.floor(Math.random() * 6) + 1);
    });
    document.querySelectorAll('input[name="theme"]').forEach(function (r) {
      r.addEventListener('change', syncHero);
    });
    syncHero();
    $('print-party').addEventListener('click', function () { window.print(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
