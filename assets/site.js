/* Activity Vault, shared site chrome.
   1. Motion follows the visitor's own device setting: when the device
      asks for reduced motion, data-calm="true" is set and every
      motion-gated rule (planner included) reads that attribute. There
      is no site-level motion switch (CRITIC-001 fix 1: the "Calm: off"
      pill was removed; a control a stranger cannot understand in one
      look is deleted, and the device setting already says it).
   2. Nav hover/focus prefetch: cheap MPA speedup (progressive enhancement). */
(function () {
  'use strict';

  function calmOn() {
    return document.documentElement.getAttribute('data-calm') === 'true';
  }

  function setCalm(on) {
    if (on) document.documentElement.setAttribute('data-calm', 'true');
    else document.documentElement.removeAttribute('data-calm');
    if (on) revealAll(document);
  }

  function initCalm() {
    var mq = null;
    try { mq = window.matchMedia('(prefers-reduced-motion: reduce)'); } catch (e) { /* no media queries */ }
    if (!mq) return;
    setCalm(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', function (ev) { setCalm(ev.matches); });
    else if (mq.addListener) mq.addListener(function (ev) { setCalm(ev.matches); });
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

  /* when the device setting flips to reduced motion, setCalm instant-reveals everything */
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
