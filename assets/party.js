/* Activity Vault — class-party planner (Halloween, winter + spring presets).
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
    },
    spring: {
      label: 'Spring',
      tags: ['holiday:easter', 'holiday:earth-day', 'season:spring'],
      groupNames: ['Bunnies', 'Sprouts', 'Rainclouds', 'Ladybugs', 'Tadpoles', 'Seedlings'],
      heroKicker: '🌷 Party Planner',
      heroTitle: 'The spring<br>class-party planner.',
      heroLede: 'Tell it your class size, how long the party runs, how many stations you can staff, and your budget — it builds a timed station-rotation plan from the Vault\'s spring activities (Easter stations, Earth Day projects, and outdoor games), with a merged setup list and a print-ready run sheet.',
      planKicker: '🌷 Spring class-party run sheet',
      planTitle: 'Spring party',
      breakMin: 0,
      closingIntro: '0:05 — Welcome & spring hello (5 min). Then rotate on the timer.',
      closingRegroup: 'Regroup: show off what each station made, hand out take-homes, clean stations'
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
  var lastPlan = null; // {themeLabel, meta, picks:[{name,url}], rounds:[{time,title,rows:[string]}], setup:[string], closing}

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
    // The visitor's own ratings come first (localStorage) — never an aggregate.
    // Unrated activities sink below every rated one; within a rating the
    // original order (no-prep, longest, id) is kept.
    var R = window.VaultRatings;
    var order = pool.slice().sort(function (x, y) {
      var rx = R && R.getRating(x.id), ry = R && R.getRating(y.id);
      return ((ry ? ry.stars : 0) - (rx ? rx.stars : 0)) ||
             ((y.no_prep ? 1 : 0) - (x.no_prep ? 1 : 0)) ||
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

    var metaText =
      themeDef.label + ' theme · ' + opts.classSize + ' kids · ' + opts.minutes + ' minutes · ' +
      stations + ' stations (' + roundMin + ' min each) · ' + BUDGET_LABELS[opts.budget];
    $('party-meta').textContent = metaText;
    document.getElementById('party-kicker').textContent = themeDef.planKicker;
    $('party-plan-title').textContent = themeDef.planTitle + ' — ' + opts.minutes + '-minute run sheet';

    lastPlan = {
      themeLabel: themeDef.label,
      title: themeDef.planTitle + ' — ' + opts.minutes + '-minute run sheet',
      meta: metaText,
      picks: picks.map(function (a) {
        var PR = window.VaultRatings;
        var pm = PR ? PR.getRating(a.id) : null;
        return { name: a.name, url: cardUrl('activity/' + a.id + '.html'), safety: a.safety || null,
                 stars: pm ? pm.stars : null };
      }),
      rounds: [],
      setup: [],
      closing: ''
    };

    // rotation timetable
    var rounds = $('party-rounds');
    rounds.textContent = '';
    var t = INTRO_MIN;
    for (var r = 0; r < stations; r++) {
      var li = el('li', 'plan-block');
      var head = el('div', 'plan-block-head');
      var timeRange = fmtClock(t) + '–' + fmtClock(t + roundMin);
      head.appendChild(el('span', 'plan-time', timeRange));
      head.appendChild(el('span', 'plan-title', 'Round ' + (r + 1)));
      li.appendChild(head);
      var body = el('div', 'plan-block-body');
      var ul = el('ul', 'rotation-list');
      var rows = [];
      for (var g = 0; g < stations; g++) {
        var st = picks[(g + r) % stations];
        rows.push(groups[g] + ' → ' + st.name);
        ul.appendChild(el('li', null, groups[g] + ' → ' + st.name));
      }
      body.appendChild(ul);
      li.appendChild(body);
      rounds.appendChild(li);
      lastPlan.rounds.push({ time: timeRange, title: 'Round ' + (r + 1), rows: rows });
      t += roundMin;
      if (breakAfter && r + 1 === breakAfter) {
        var bTime = fmtClock(t) + '–' + fmtClock(t + breakMin);
        var bli = el('li', 'plan-block');
        var bhead = el('div', 'plan-block-head');
        bhead.appendChild(el('span', 'plan-time', bTime));
        bhead.appendChild(el('span', 'plan-title', '☕ Warm-up break'));
        bli.appendChild(bhead);
        var bbody = el('div', 'plan-block-body');
        var breakText = 'Stretch, sip water (cocoa if your school allows it), and get cozy — then rotate to your next station.';
        bbody.appendChild(el('p', null, breakText));
        bli.appendChild(bbody);
        rounds.appendChild(bli);
        lastPlan.rounds.push({ time: bTime, title: '☕ Warm-up break', rows: [breakText] });
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
        var label = m.item + ' (station ' + (i + 1) + ')';
        lastPlan.setup.push(label);
        var li2 = el('li');
        var box = el('span', 'checkbox', '☐');
        box.setAttribute('aria-hidden', 'true');
        li2.appendChild(box);
        li2.appendChild(document.createTextNode(' ' + label));
        ul2.appendChild(li2);
        added++;
      });
      if (!added) {
        ul2.appendChild(el('li', null, 'Nothing to gather — no materials needed.'));
      }
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
      var RP = window.VaultRatings;
      var mine = RP ? RP.getRating(a.id) : null;
      if (mine) body3.appendChild(el('span', 'rate-badge', '⭐ ' + mine.stars + '★ — your rating (picked first)'));
      li3.appendChild(body3);
      list.appendChild(li3);
    });

    var wrapMin = opts.minutes - INTRO_MIN - stations * roundMin - themeDef.breakMin + WRAP_MIN;
    var closingText =
      themeDef.closingIntro + ' ' +
      fmtClock(INTRO_MIN + stations * roundMin + themeDef.breakMin) + ' — ' +
      themeDef.closingRegroup + ' (' + wrapMin + ' min). ' +
      'Tip: ring a bell 1 minute before each rotation so groups can finish up.';
    $('party-closing').textContent = closingText;
    lastPlan.closing = closingText;

    $('party-plan').hidden = false;
    $('party-actions').hidden = false;
    $('party-plan-title').focus({ preventScroll: false });
  }

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

  function copyParty() {
    if (!lastPlan) return;
    var p = lastPlan;
    var lines = [p.title + ' (Activity Vault)', p.meta, ''];
    lines.push('Stations:');
    p.picks.forEach(function (s, i) {
      lines.push('  Station ' + (i + 1) + ' — ' + s.name +
        (s.stars ? ' (your rating: ' + s.stars + '/5 stars)' : ''));
      lines.push('  ' + s.url);
    });
    lines.push('');
    lines.push('Rotation:');
    p.rounds.forEach(function (r) {
      lines.push('  ' + r.time + ' — ' + r.title + ': ' + r.rows.join(' · '));
    });
    lines.push('');
    lines.push('Setup checklist:');
    if (p.setup.length) {
      p.setup.forEach(function (it) { lines.push('  ☐ ' + it); });
    } else {
      lines.push('  Nothing to gather — no materials needed.');
    }
    lines.push('');
    lines.push('Closing:');
    lines.push('  ' + p.closing);
    lines.push('');
    lines.push('Full cards at the links above — share this sheet with co-teachers and volunteers.');
    copyText(lines.join('\n'), $('copy-party-status'));
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
    var R = window.VaultRatings;
    var anyRated = R && picks.some(function (a) { return R.getRating(a.id); });
    status.textContent = themeDef.label + ' party plan built: ' + stations + ' stations, ' + roundMin +
      ' minutes each, groups of ~' + perGroup + '.' +
      (anyRated ? ' Your top-rated stations went in first (ratings live only in your browser).' : '');
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
    $('copy-party').addEventListener('click', copyParty);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
