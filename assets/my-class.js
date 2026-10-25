/* Activity Vault, My Class (Claude bundle 2026-10-24, item 6).
   The visitor's class profile — ages, group size, minutes — saved
   ON-DEVICE ONLY in localStorage av.myclass.v1. Nothing is sent
   anywhere. The home "Fits my class" filter (assets/app.js reads
   window.VaultClass.fits) and the planners start from it: on Sub
   Tub, the week planner and the Party Planner this file prefills
   any control whose options include the saved values. */
(function () {
  'use strict';
  var KEY = 'av.myclass.v1';

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var p = raw ? JSON.parse(raw) : null;
      if (!p) return null;
      return {
        age: typeof p.age === 'number' ? p.age : null,
        group: typeof p.group === 'number' ? p.group : null,
        minutes: typeof p.minutes === 'number' ? p.minutes : null
      };
    } catch (e) { return null; }
  }
  function save(p) {
    try { window.localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* private mode */ }
    return p;
  }
  function fits(a, p) {
    p = p || load();
    if (!p) return true;
    if (p.age != null && (a.age_min > p.age || a.age_max < p.age)) return false;
    if (p.group != null && (a.group_min > p.group || a.group_max < p.group)) return false;
    if (p.minutes != null && a.time_min > p.minutes) return false;
    return true;
  }

  function readForm() {
    function num(id) {
      var el = document.getElementById(id);
      if (!el || el.value === '') return null;
      var v = parseInt(el.value, 10);
      return isNaN(v) ? null : v;
    }
    return { age: num('mc-age'), group: num('mc-group'), minutes: num('mc-minutes') };
  }

  function initForm() {
    var form = document.getElementById('my-class-form');
    if (!form) return;
    var p = load();
    if (p) {
      if (p.age != null) document.getElementById('mc-age').value = p.age;
      if (p.group != null) document.getElementById('mc-group').value = p.group;
      if (p.minutes != null) document.getElementById('mc-minutes').value = p.minutes;
    }
    form.addEventListener('change', function () {
      save(readForm());
      // app.js listens for this and re-renders the browse list.
      document.dispatchEvent(new CustomEvent('vault:myclass'));
    });
  }

  /* Planners start from My Class: prefill any select/input whose
     options or purpose match a saved value. A control is only
     touched when an exact option exists, so planner defaults are
     never clobbered with a value the planner cannot use. */
  var PREFILL = [
    { ids: ['party-size', 'pp-size', 'sub-size'], field: 'group' },
    { ids: ['party-minutes', 'day-minutes', 'max-time'], field: 'minutes' }
  ];
  function prefillPlanners() {
    var p = load();
    if (!p) return;
    PREFILL.forEach(function (rule) {
      var want = p[rule.field];
      if (want == null) return;
      rule.ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (el.tagName === 'SELECT') {
          for (var i = 0; i < el.options.length; i++) {
            if (parseInt(el.options[i].value, 10) === want) {
              el.selectedIndex = i;
              el.dispatchEvent(new Event('change', { bubbles: true }));
              return;
            }
          }
        } else if (el.tagName === 'INPUT' && !el.value) {
          el.value = want;
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });
    // Age: the week planner's band select uses ranges; pick the band
    // containing the saved age when its value encodes "min-max".
    var band = document.getElementById('p-ageband') || document.getElementById('dp-age');
    if (band && p.age != null && band.tagName === 'SELECT') {
      for (var j = 0; j < band.options.length; j++) {
        var m = /^(\d+)-(\d+)$/.exec(band.options[j].value || '');
        if (m && p.age >= parseInt(m[1], 10) && p.age <= parseInt(m[2], 10)) {
          band.selectedIndex = j;
          band.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }
    var note = document.querySelector('[data-myclass-note]');
    if (note) {
      var bits = [];
      if (p.age != null) bits.push('age ' + p.age);
      if (p.group != null) bits.push('group of ' + p.group);
      if (p.minutes != null) bits.push(p.minutes + ' minutes');
      if (bits.length) note.textContent = 'Starting from your class (' + bits.join(', ') + '), saved on this device only.';
    }
  }

  window.VaultClass = { load: load, save: save, fits: fits, KEY: KEY };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initForm(); prefillPlanners(); });
  } else { initForm(); prefillPlanners(); }
})();
