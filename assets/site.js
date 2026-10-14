/* Activity Vault, shared site chrome.
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

  /* 3. Index-card stagger reveals (wave 17, "The Teacher's Desk"):
        progressive enhancement, the.js class gates the hidden initial
        state in CSS, so no-JS / no-IO never hides content. Calm mode and
        prefers-reduced-motion reveal instantly with no stagger. */
  var REVEAL_SEL = '.activity-row, .collection-card, .collection-section, .day-card, .pick, .extra-section, .plan-block';

  function motionOK() {
    if (calmOn()) return false;
    try {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) { return true; }
  }

  function revealAll(root) {
    var els = (root || document).querySelectorAll(REVEAL_SEL);
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
  }

  function watchReveals(root) {
    var els = (root || document).querySelectorAll(REVEAL_SEL);
    if (!els.length) return;
    document.documentElement.classList.add('js');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.classList.contains('reveal')) continue;
      el.classList.add('reveal');
      if (el.style.getPropertyValue('--i') === '') {
        el.style.setProperty('--i', String(i % 10));
      }
    }
    if (!motionOK() || !('IntersectionObserver' in window)) {
      revealAll(root);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) {
          entries[j].target.classList.add('in');
          io.unobserve(entries[j].target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    for (var k = 0; k < els.length; k++) {
      if (!els[k].classList.contains('in')) io.observe(els[k]);
    }
  }

  /* re-run when the calm toggle flips: instant-reveal everything if calming down */
  function initReveal() {
    watchReveals(document);
    /* pages render cards after DOMContentLoaded (planner, collections, sub,
       party, field trip), catch late arrivals without touching those files */
    if ('MutationObserver' in window && document.body) {
      var mo = new MutationObserver(function (muts) {
        for (var m = 0; m < muts.length; m++) {
          var nodes = muts[m].addedNodes;
          for (var n = 0; n < nodes.length; n++) {
            var node = nodes[n];
            if (node.nodeType !== 1) continue;
            if (node.matches && node.matches(REVEAL_SEL)) watchReveals(node.parentNode || document);
            else if (node.querySelectorAll) {
              var hits = node.querySelectorAll(REVEAL_SEL);
              if (hits.length) watchReveals(node);
            }
          }
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
    var b = document.getElementById('site-calm-toggle');
    if (b) b.addEventListener('click', function () {
      if (!motionOK()) revealAll(document);
    });
  }

  /* pages that render cards after load (browse grid, planner) call this */
  window.VaultReveal = { watch: watchReveals, revealAll: revealAll };

  function init() {
    initCalm();
    initPrefetch();
    initReveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
