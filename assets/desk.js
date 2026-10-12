/* Activity Vault — "The Desk" drawer pulls (wave 21).
   Progressive enhancement: desk.html renders every tray OPEN in the markup,
   so no-JS readers (and printers) get the full content. This script adds
   `desk-ready` to <html> (CSS then collapses the trays) and wires the brass
   pulls as real buttons (aria-expanded + aria-controls). Motion is pure
   CSS (transform/opacity); calm mode and prefers-reduced-motion kill it via
   the global rules while the content still toggles. */
(function () {
  'use strict';

  function setOpen(drawer, open) {
    var btn = drawer.querySelector('.drawer-pull');
    if (!btn) return;
    drawer.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function init() {
    var drawers = Array.prototype.slice.call(document.querySelectorAll('.drawer'));
    if (!drawers.length) return;
    document.documentElement.classList.add('desk-ready');

    drawers.forEach(function (drawer) {
      var btn = drawer.querySelector('.drawer-pull');
      if (!btn) return;
      btn.addEventListener('click', function () {
        setOpen(drawer, !drawer.classList.contains('open'));
      });
    });

    var openAll = document.getElementById('drawers-open-all');
    var closeAll = document.getElementById('drawers-close-all');
    if (openAll) openAll.addEventListener('click', function () {
      drawers.forEach(function (d) { setOpen(d, true); });
    });
    if (closeAll) closeAll.addEventListener('click', function () {
      drawers.forEach(function (d) { setOpen(d, false); });
    });

    /* Escape closes every open drawer — the tidy-desk gesture. */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var anyOpen = false;
      drawers.forEach(function (d) {
        if (d.classList.contains('open')) { setOpen(d, false); anyOpen = true; }
      });
      if (anyOpen) e.preventDefault();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
