/* Activity Vault, Season packs (Claude bundle 2026-10-24, item 6).
   data/v1/calendar.json carries dated packs (Halloween to Nov 1,
   Thanksgiving to Nov 28, then winter, spring 2027, ...). This
   file reads the pack list on-device and switches the home season
   label, the season hub link and the document's season marker by
   the visitor's own date — no deploy needed when a pack turns. */
(function () {
  'use strict';

  function activePack(packs, now) {
    var iso = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
    for (var i = 0; i < packs.length; i++) {
      if (iso >= packs[i].start && iso <= packs[i].end) return packs[i];
    }
    return null;
  }

  function apply(pack) {
    if (!pack) return;
    document.documentElement.setAttribute('data-season-pack', pack.id);
    document.querySelectorAll('[data-season-name]').forEach(function (el) {
      el.textContent = pack.name;
    });
    document.querySelectorAll('[data-season-hub]').forEach(function (el) {
      el.setAttribute('href', pack.hub);
      if (el.hasAttribute('data-season-hub-label')) el.textContent = pack.name + ': the hub';
    });
    document.querySelectorAll('nav a[href="' + pack.hub + '"]').forEach(function (el) {
      el.setAttribute('aria-current', 'true');
    });
  }

  function init() {
    if (!document.querySelector('[data-season-name], [data-season-hub]')) return;
    fetch('data/v1/calendar.json').then(function (r) {
      if (!r.ok) throw new Error('calendar ' + r.status);
      return r.json();
    }).then(function (j) {
      apply(activePack(j.packs || [], new Date()));
    }).catch(function () { /* build-time season label stays; it is honest, just static */ });
  }

  window.VaultSeason = { activePack: activePack };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
