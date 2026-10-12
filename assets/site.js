/* Activity Vault — shared site chrome.
   1. Calm mode (sensory-envelope toggle, web-craft 2026-10-11 round 2):
      a user-controlled kill switch for motion + transparency, beyond the
      prefers-reduced-motion binary. Persists in localStorage; the planner
      and every motion-gated rule read the same data-calm="true" attribute.
   2. Nav hover/focus prefetch: cheap MPA speedup (progressive enhancement). */
(function () {
  'use strict';

  var CALM_KEY = 'activityvault.calm.v1';

  function calmOn() {
    return document.documentElement.getAttribute('data-calm') === 'true';
  }

  function setCalm(on, silent) {
    if (on) document.documentElement.setAttribute('data-calm', 'true');
    else document.documentElement.removeAttribute('data-calm');
    var b = document.getElementById('site-calm-toggle');
    if (b) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      var label = b.querySelector('.calm-state');
      if (label) label.textContent = on ? 'on' : 'off';
    }
    if (!silent) {
      try { localStorage.setItem(CALM_KEY, on ? '1' : '0'); } catch (e) { /* storage unavailable */ }
    }
  }

  function initCalm() {
    var stored = null;
    try { stored = localStorage.getItem(CALM_KEY); } catch (e) { /* storage unavailable */ }
    setCalm(stored === '1', true);
    var b = document.getElementById('site-calm-toggle');
    if (b) b.addEventListener('click', function () { setCalm(!calmOn()); });
  }

  function initPrefetch() {
    var nav = document.querySelector('.site-header nav');
    if (!nav) return;
    var seen = {};
    function prefetch(a) {
      var href = a.getAttribute('href');
      if (!href || seen[href] || href.charAt(0) === '#') return;
      seen[href] = true;
      var l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = href;
      document.head.appendChild(l);
    }
    nav.addEventListener('mouseover', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (a) prefetch(a);
    });
    nav.addEventListener('focusin', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (a) prefetch(a);
    });
  }

  function init() {
    initCalm();
    initPrefetch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
