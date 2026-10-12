/* Activity Vault — Sub Tub emergency planner.
   Fetches data/activities.json, builds a sequenced print-ready plan
   for a grade band + minutes + materials + location. */
(function () {
  'use strict';

  var BANDS = {
    'prek-k': { label: 'PreK–K', min: 3, max: 6 },
    'g1-2': { label: 'Grades 1–2', min: 6, max: 8 },
    'g3-5': { label: 'Grades 3–5', min: 8, max: 11 },
    'g6-8': { label: 'Grades 6–8', min: 11, max: 14 }
  };
  var MAT_LABELS = {
    nothing: 'nothing at all',
    paper: 'paper & pencils',
    art: 'basic art supplies',
    any: 'a full classroom'
  };
  var PAPER_WORDS = ['paper', 'pencil', 'pen', 'crayon', 'marker', 'cardstock',
    'notebook', 'sticky note', 'index card', 'envelope', 'worksheet', 'clipboard'];
  var ART_WORDS = PAPER_WORDS.concat(['glue', 'scissors', 'tape', 'paint', 'string',
    'yarn', 'cup', 'plate', 'flashlight', 'sticker', 'button', 'chalk',
    'newspaper', 'bag', 'box', 'sock', 'spoon', 'ruler', 'dice', 'ribbon',
    'feather', 'sequin', 'glitter']);
  var CALM_CATS = ['quiet-focus', 'rainy-day'];

  var activities = [];
  var lastPlan = null;

  function $(id) { return document.getElementById(id); }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function esc(s) { return String(s); } // textContent used everywhere; no innerHTML

  function materialWords(a) {
    return a.materials.map(function (m) { return m.item.toLowerCase(); });
  }

  function fitsTier(a, tier) {
    var mats = materialWords(a);
    if (tier === 'nothing') return mats.length === 0; // truly empty-handed
    if (a.no_prep) return true;
    if (tier === 'any') return true;
    var words = tier === 'paper' ? PAPER_WORDS : ART_WORDS;
    if (!mats.length) return true;
    return mats.every(function (item) {
      return words.some(function (w) { return item.indexOf(w) !== -1; });
    });
  }

  function isCalm(a) {
    return a.categories.some(function (c) { return CALM_CATS.indexOf(c) !== -1; });
  }

  function filterPool(band, tier, loc) {
    var b = BANDS[band];
    return activities.filter(function (a) {
      if (a.age_min > b.max || a.age_max < b.min) return false;
      if (loc === 'indoor' && a.location.indexOf('indoor') === -1) return false;
      return fitsTier(a, tier);
    });
  }

  function shuffled(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function fillerBlock(rem, tier) {
    if (tier === 'nothing') {
      return {
        filler: true,
        name: 'Share circle & cleanup',
        minutes: rem,
        how: 'Gather in a circle. Each kid shares one highlight from today while the group tidies the room around them. End with a group cheer.'
      };
    }
    return {
      filler: true,
      name: 'Read-aloud + free draw',
      minutes: rem,
      how: 'Read a picture book aloud (any book in the room works). Then hand out paper: kids draw their favorite part of the story. Collect drawings as exit tickets.'
    };
  }

  // Greedy time-fill: calm activity preferred for the final slot.
  function buildPlan(pool, minutes, tier, reshuffle) {
    var picks = [], rem = minutes;
    var order = reshuffle ? shuffled(pool) :
      pool.slice().sort(function (x, y) {
        return ((y.no_prep ? 1 : 0) - (x.no_prep ? 1 : 0)) ||
               (y.time_max - x.time_max) ||
               (x.id < y.id ? -1 : 1);
      });
    var guard = 0;
    while (rem >= 12 && picks.length < 5 && guard++ < 50) {
      var finalSlot = rem <= 30;
      var cands = order.filter(function (a) { return picks.indexOf(a) === -1; });
      var calm = cands.filter(isCalm);
      var target = (finalSlot && calm.length) ? calm.concat(cands) : cands;
      var found = null, i, a;
      for (i = 0; i < target.length; i++) {
        a = target[i];
        if (a.time_max <= rem) { found = a; break; }
      }
      if (!found) {
        for (i = 0; i < target.length; i++) {
          a = target[i];
          if (a.time_min <= rem) { found = a; break; }
        }
      }
      if (!found) break;
      var alloc = Math.min(found.time_max, rem);
      if (alloc < found.time_min) break;
      picks.push({ activity: found, minutes: alloc });
      rem -= alloc;
    }
    if (rem >= 10) {
      picks.push(fillerBlock(rem, tier));
      rem = 0;
    }
    return { picks: picks, leftover: rem };
  }

  function fmtClock(total) {
    var h = Math.floor(total / 60), m = total % 60;
    if (!h) return '0:' + (m < 10 ? '0' + m : m);
    return h + ':' + (m < 10 ? '0' + m : m);
  }

  function renderPlan(plan, opts) {
    var blocks = $('plan-blocks');
    blocks.textContent = '';
    var t = 0;
    plan.picks.forEach(function (p, i) {
      var li = el('li', 'plan-block');
      var head = el('div', 'plan-block-head');
      head.appendChild(el('span', 'plan-time', fmtClock(t) + '–' + fmtClock(t + p.minutes)));
      var title = el('span', 'plan-title');
      if (p.filler) {
        title.textContent = p.name + ' (' + p.minutes + ' min)';
      } else {
        var link = el('a', null, p.activity.name);
        link.href = 'activity/' + p.activity.id + '.html';
        link.target = '_blank';
        link.rel = 'noopener';
        title.appendChild(link);
        title.appendChild(document.createTextNode(' (' + p.minutes + ' min)'));
      }
      head.appendChild(title);
      li.appendChild(head);

      var body = el('div', 'plan-block-body');
      if (p.filler) {
        body.appendChild(el('p', null, p.how));
      } else {
        var a = p.activity;
        if (!a.no_prep && a.materials.length) {
          var mats = el('p', 'plan-mats');
          mats.appendChild(el('strong', null, 'Grab: '));
          mats.appendChild(document.createTextNode(
            a.materials.map(function (m) { return m.item; }).join('; ')));
          body.appendChild(mats);
        }
        var steps = el('ol', 'plan-steps');
        a.steps.slice(0, 3).forEach(function (s) {
          steps.appendChild(el('li', null, s));
        });
        body.appendChild(steps);
        if (a.steps.length > 3 || a.safety) {
          var more = el('p', 'plan-more');
          more.appendChild(document.createTextNode('Full card: '));
          var fl = el('a', null, 'activity/' + a.id + '.html');
          fl.href = 'activity/' + a.id + '.html';
          fl.target = '_blank';
          fl.rel = 'noopener';
          more.appendChild(fl);
          if (a.safety) {
            more.appendChild(document.createTextNode(' — ⚠️ ' + a.safety));
          }
          body.appendChild(more);
        }
      }
      li.appendChild(body);
      blocks.appendChild(li);
      t += p.minutes;
    });

    var meta = $('plan-meta');
    meta.textContent = BANDS[opts.band].label + ' · ' + opts.minutes + ' minutes · ' +
      MAT_LABELS[opts.tier] + ' · ' + (opts.loc === 'indoor' ? 'indoors' : 'outdoors OK') +
      ' · ' + plan.picks.length + ' blocks';
    $('plan-title').textContent = 'Emergency plan — ' + opts.minutes + ' minutes';

    buildNote(plan, opts);
    $('sub-plan').hidden = false;
    $('sub-actions').hidden = false;
    $('plan-title').focus({ preventScroll: false });
  }

  function buildNote(plan, opts) {
    var teacher = $('sub-teacher').value.trim();
    var cls = $('sub-class').value.trim() || '[class/grade]';
    var date = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    var lines = [];
    lines.push('Dear substitute,');
    lines.push('');
    lines.push('Thank you for covering ' + cls + ' today (' + date + ')! This emergency plan fills ' +
      opts.minutes + ' minutes with ' + MAT_LABELS[opts.tier] + ', ' +
      (opts.loc === 'indoor' ? 'indoors' : 'indoors or outdoors') + '. Follow it top to bottom — times are suggestions.');
    lines.push('');
    lines.push('CLASS AT A GLANCE (fill in before printing):');
    lines.push('- Schedule quirks: [lunch, recess, specials times]');
    lines.push('- Pickup/dismissal: [where kids go, bus notes]');
    lines.push('- Behavior plan: [your system, e.g., table points]');
    lines.push('- Reliable helpers: [2-3 student names]');
    lines.push('- Supplies live at: [paper, pencils, first aid]');
    lines.push('- If you finish early: [read-aloud basket location]');
    lines.push('');
    lines.push('THE PLAN:');
    var t = 0;
    plan.picks.forEach(function (p, i) {
      var name = p.filler ? p.name : p.activity.name;
      lines.push((i + 1) + '. ' + fmtClock(t) + '–' + fmtClock(t + p.minutes) + ' — ' + name + ' (' + p.minutes + ' min)');
      t += p.minutes;
    });
    lines.push('');
    lines.push('Full activity cards with step-by-step instructions: open the links in the printed plan, or browse the Activity Vault.');
    lines.push('If anything feels off, swap in any no-prep activity — the plan is a guide, not a script. You have got this!');
    lines.push('');
    lines.push('- ' + (teacher || '[your name]'));
    $('sub-note-text').value = lines.join('\n');
  }

  function generate(reshuffle) {
    var band = document.querySelector('input[name="band"]:checked').value;
    var minutes = parseInt($('sub-minutes').value, 10);
    var tier = document.querySelector('input[name="mats"]:checked').value;
    var loc = document.querySelector('input[name="loc"]:checked').value;
    var pool = filterPool(band, tier, loc);
    var status = $('sub-status');
    if (!pool.length) {
      status.textContent = 'No activities match that combo — try "Full classroom" or "Outdoors OK".';
      $('sub-plan').hidden = true;
      $('sub-actions').hidden = true;
      return;
    }
    var plan = buildPlan(pool, minutes, tier, reshuffle);
    lastPlan = { plan: plan, opts: { band: band, minutes: minutes, tier: tier, loc: loc } };
    renderPlan(plan, lastPlan.opts);
    status.textContent = 'Plan built from ' + pool.length + ' matching activities.';
  }

  function init() {
    fetch('data/activities.json').then(function (r) { return r.json(); }).then(function (d) {
      activities = d.activities || d;
      $('sub-status').textContent = 'Ready — ' + activities.length + ' activities loaded.';
    }).catch(function () {
      $('sub-status').textContent = 'Could not load the activity library. Check your connection and reload.';
    });
    $('sub-generate').addEventListener('click', function () { generate(false); });
    $('sub-reshuffle').addEventListener('click', function () { generate(true); });
    $('print-sub').addEventListener('click', function () { window.print(); });
    $('copy-note').addEventListener('click', function () {
      var ta = $('sub-note-text'), done = $('copy-status');
      function ok() { done.textContent = 'Copied ✓'; setTimeout(function () { done.textContent = ''; }, 2500); }
      function fallback() {
        ta.focus(); ta.select();
        try { document.execCommand('copy'); ok(); }
        catch (e) { done.textContent = 'Copy failed — select the text manually.'; }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ta.value).then(ok, fallback);
      } else { fallback(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
