/* Activity Vault — After-School Kit UI (wave 18).
   Wizard -> generated week kit -> print sheets, checklist, shareable ?kit= link.
   Pure logic lives in assets/kit-core.js (window.VaultKit, UMD). */
(function () {
  'use strict';
  var K = window.VaultKit;
  if (!K) return;

  var acts = [], byId = {}, bucketByCat = {};
  var kit = null;

  var form, pantryBox, statusEl, resultsEl, deckEl, checkEl, actionsEl;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function cardUrl(page) {
    try { return new URL(page, document.baseURI).href; }
    catch (e) { return page; }
  }

  function readWizard() {
    function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }
    function checked(name) {
      var el = document.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    }
    var pantry = Array.prototype.map.call(
      pantryBox.querySelectorAll('input:checked'), function (i) { return i.value; });
    return K.clampCfg({
      groupSize: parseInt(val('kit-group'), 10),
      ageBand: val('kit-ageband'),
      days: parseInt(checked('kit-days'), 10),
      minutes: parseInt(checked('kit-minutes'), 10),
      startTime: val('kit-start'),
      mode: checked('kit-mode'),
      pantry: pantry
    });
  }

  function paintWizard(cfg) {
    document.getElementById('kit-group').value = cfg.groupSize;
    document.getElementById('kit-ageband').value = cfg.ageBand;
    document.getElementById('kit-start').value = cfg.startTime;
    setRadio('kit-days', String(cfg.days));
    setRadio('kit-minutes', String(cfg.minutes));
    setRadio('kit-mode', cfg.mode);
    Array.prototype.forEach.call(pantryBox.querySelectorAll('input'), function (i) {
      i.checked = cfg.pantry.indexOf(i.value) !== -1;
    });
  }

  function setRadio(name, value) {
    var el = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (el) el.checked = true;
  }

  function buildPantry() {
    var html = K.PANTRY.map(function (p) {
      var on = K.PANTRY_DEFAULT.indexOf(p.id) !== -1;
      return '<label class="chip pantry-chip"><input type="checkbox" value="' + p.id + '"' +
        (on ? ' checked' : '') + '> <span aria-hidden="true">' + p.glyph + '</span> ' +
        esc(p.label) + '</label>';
    }).join('');
    pantryBox.innerHTML = html;
  }

  function whyFits(a, cfg) {
    var bits = [];
    bits.push(a.no_prep ? '✅ no-prep' : '📦 ' + a.materials.length + ' material' + (a.materials.length === 1 ? '' : 's'));
    bits.push(a.time_min + '–' + a.time_max + ' min');
    bits.push('ages ' + a.age_min + '–' + a.age_max);
    bits.push('group ' + a.group_min + '–' + a.group_max);
    var fit = K.materialFit(a, cfg.pantry);
    if (!a.no_prep && a.materials.length && fit.ok) bits.push('all materials in your pantry ✓');
    return bits.join(' · ');
  }

  function roleLabel(role) {
    return role === 'opener' ? '🎬 Opener' : role === 'main' ? '⭐ Main activity' : '🌙 Closer';
  }

  function renderKit() {
    resultsEl.innerHTML = '';
    deckEl.innerHTML = '';
    checkEl.innerHTML = '';
    actionsEl.innerHTML = '';
    if (!kit || !kit.days.length) {
      statusEl.textContent = 'No kit yet — set your options and build one.';
      return;
    }
    var cfg = kit.cfg;
    var slotCount = kit.days.length * 3;
    var mats = K.aggregateMaterials(kit, byId, cfg.pantry);
    var gather = mats.filter(function (m) { return !m.have; });
    statusEl.textContent = 'Your kit is ready — ' + kit.days.length + ' day' +
      (kit.days.length === 1 ? '' : 's') + ', ' + slotCount + ' sessions, ' +
      mats.length + ' material line' + (mats.length === 1 ? '' : 's') +
      (gather.length ? ' (' + gather.length + ' to gather).' : ' — everything\'s on hand.');

    /* warnings */
    if (kit.warnings.length) {
      var w = document.createElement('div');
      w.className = 'kit-warnings';
      w.setAttribute('role', 'note');
      w.innerHTML = kit.warnings.map(function (x) {
        return '<p>⚠️ ' + esc(x) + '</p>';
      }).join('');
      resultsEl.appendChild(w);
    }

    /* day cards — index-card language, screen shows the plan, print turns
       each day into its own session plan sheet */
    kit.days.forEach(function (day, di) {
      var card = document.createElement('section');
      card.className = 'kit-day print-card';
      card.setAttribute('aria-label', 'Day ' + (di + 1) + ' session plan');
      var ros = K.runOfShow(day, cfg);
      var blocks = ros.map(function (b) {
        var a = byId[b.id];
        var name = a ? '<a href="activity/' + a.id + '.html">' + esc(a.name) + '</a>' : esc(b.id);
        var reused = day.slots.filter(function (s) { return s.id === b.id; })[0].reused;
        var matsLine = '';
        if (a) {
          var items = (a.materials || []).map(function (m) { return m.item; });
          matsLine = '<p class="plan-mats">🧰 ' + (items.length ? esc(items.join('; ')) : 'No materials needed.') + '</p>';
        }
        return '<li class="plan-block">' +
          '<div class="plan-block-head"><span class="plan-time">' + esc(b.start) + '–' + esc(b.end) + '</span>' +
          '<span class="plan-title">' + roleLabel(b.role) + ': ' + name + '</span>' +
          (reused ? ' <span class="chip tag-chip" title="Repeats an earlier day">↻ repeat</span>' : '') +
          ' <button type="button" class="btn btn-ghost btn-small no-print kit-swap" data-day="' + di +
          '" data-role="' + b.role + '" aria-label="Swap the ' + b.role + ' on day ' + (di + 1) + '">🔀 Swap</button></div>' +
          '<p class="plan-more no-print">' + esc(a ? whyFits(a, cfg) : '') + '</p>' +
          matsLine +
          (a && a.safety ? '<p class="plan-mats">⚠️ ' + esc(a.safety) + '</p>' : '') +
          '</li>';
      }).join('');
      card.innerHTML =
        '<div class="kit-day-head"><span class="kicker">📋 Session plan sheet</span>' +
        '<h2>Day ' + (di + 1) + ' — ' + esc(day.label) + '</h2>' +
        '<p class="plan-meta">' + cfg.groupSize + ' kids · starts ' + esc(cfg.startTime) + ' · ' +
        cfg.minutes + ' minutes · run of show below</p></div>' +
        '<ol class="plan-blocks">' + blocks + '</ol>' +
        '<p class="print-only print-url">Session plan — <span>' + esc(cardUrl('kit.html')) + '</span></p>';
      deckEl.appendChild(card);
    });

    /* material checklist */
    var det = document.createElement('details');
    det.className = 'ft-check';
    det.setAttribute('name', 'kit-checklist');
    det.open = true;
    var have = mats.filter(function (m) { return m.have; });
    function matList(list, glyph) {
      if (!list.length) return '<p class="dim">None.</p>';
      return '<ul>' + list.map(function (m) {
        return '<li>' + glyph + ' ' + esc(m.item) +
          ' <span class="opt">— day' + (m.days.length > 1 ? 's' : '') + ' ' + m.days.join(', ') + '</span></li>';
      }).join('') + '</ul>';
    }
    det.innerHTML = '<summary>🧾 Material checklist (' + mats.length + ' lines' +
      (gather.length ? ', ' + gather.length + ' to gather' : ', all on hand') + ')</summary>' +
      '<div class="kit-check-cols">' +
      '<div><h3>✅ Have on hand (' + have.length + ')</h3>' + matList(have, '✓') + '</div>' +
      '<div><h3>🛒 Gather before the week (' + gather.length + ')</h3>' + matList(gather, '•') + '</div>' +
      '</div>' +
      '<p class="no-print"><button type="button" class="btn btn-ghost btn-small" id="kit-copy-check">📋 Copy checklist</button> ' +
      '<span class="copy-status" id="kit-check-status" role="status" aria-live="polite"></span></p>';
    checkEl.appendChild(det);

    /* actions */
    actionsEl.innerHTML =
      '<button type="button" class="btn" id="kit-print">🖨️ Print the whole kit</button> ' +
      '<button type="button" class="btn btn-ghost" id="kit-copy-text">📋 Copy kit as text</button> ' +
      '<button type="button" class="btn btn-ghost" id="kit-copy-link">🔗 Copy share link</button> ' +
      '<span class="copy-status" id="kit-action-status" role="status" aria-live="polite"></span>' +
      '<p class="dim" style="margin-top:.6rem;">The share link restores this exact kit — wizard answers and all — on any device.</p>';
    wireActions();
    Array.prototype.forEach.call(deckEl.querySelectorAll('.kit-swap'), function (btn) {
      btn.addEventListener('click', function () { swapSlot(btn); });
    });
    var cc = document.getElementById('kit-copy-check');
    if (cc) cc.addEventListener('click', copyChecklist);
  }

  function flash(msg) {
    var s = document.getElementById('kit-action-status');
    if (s) {
      s.textContent = msg;
      setTimeout(function () { if (s.textContent === msg) s.textContent = ''; }, 4000);
    }
  }

  function copyText(text, okMsg) {
    function done() { flash(okMsg); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { flash('Copy failed — select the text manually.'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
  }

  function copyChecklist() {
    var mats = K.aggregateMaterials(kit, byId, kit.cfg.pantry);
    var lines = ['MATERIAL CHECKLIST — After-School Kit'];
    mats.forEach(function (m) {
      lines.push((m.have ? '[have] ' : '[GATHER] ') + m.item +
        ' — day' + (m.days.length > 1 ? 's' : '') + ' ' + m.days.join(', '));
    });
    var s = document.getElementById('kit-check-status');
    function done() { if (s) { s.textContent = 'Copied ✓'; setTimeout(function () { s.textContent = ''; }, 3000); } }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lines.join('\n')).then(done, function () { flash('Copy failed.'); });
    } else { flash('Copy failed — select the text manually.'); }
  }

  function wireActions() {
    document.getElementById('kit-print').addEventListener('click', function () { window.print(); });
    document.getElementById('kit-copy-text').addEventListener('click', function () {
      copyText(K.kitText(kit, byId), 'Kit copied as text ✓');
    });
    document.getElementById('kit-copy-link').addEventListener('click', function () {
      copyText(cardUrl('kit.html') + '?kit=' + K.encodeKit(kit), 'Share link copied ✓');
    });
  }

  /* Swap one slot for a fresh candidate from the role's pool. */
  function swapSlot(btn) {
    var di = parseInt(btn.getAttribute('data-day'), 10);
    var role = btn.getAttribute('data-role');
    var day = kit.days[di];
    if (!day) return;
    var cfg = kit.cfg;
    var pool = acts.filter(function (a) { return K.fitsKit(a, cfg); });
    var inKit = {};
    kit.days.forEach(function (d) {
      d.slots.forEach(function (s) { inKit[s.id] = true; });
    });
    var cands;
    if (role === 'opener') cands = K.openerCands(pool, bucketByCat);
    else if (role === 'closer') cands = K.closerCands(pool, bucketByCat);
    else cands = K.mainCands(pool);
    var fresh = cands.filter(function (a) { return !inKit[a.id]; });
    var pick = (fresh.length ? fresh : cands)[Math.floor(Math.random() * (fresh.length ? fresh : cands).length)];
    if (!pick) { flash('No swap candidate found.'); return; }
    day.slots.forEach(function (s) {
      if (s.role === role) { s.id = pick.id; s.reused = !!inKit[pick.id]; }
    });
    try { localStorage.setItem('activityvault.kit.v1', K.encodeKit(kit)); } catch (e) { /* private mode */ }
    renderKit();
    statusEl.textContent = 'Swapped in "' + pick.name + '". ' + statusEl.textContent;
    var h = deckEl.querySelectorAll('.kit-day')[di];
    if (h) h.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function generate(fromShare) {
    var cfg = fromShare ? fromShare.cfg : readWizard();
    var restored = fromShare && fromShare.days && fromShare.days.length;
    if (restored) {
      /* validate restored ids against the live catalog */
      var ok = fromShare.days.every(function (d) {
        return d.slots.every(function (s) { return byId[s.id]; });
      });
      if (!ok) restored = false;
    }
    if (restored) {
      kit = fromShare;
    } else {
      kit = K.buildKit(acts, cfg, bucketByCat, fromShare ? fromShare.seed : null);
    }
    if (!fromShare) paintWizard(cfg);
    else paintWizard(kit.cfg);
    try { localStorage.setItem('activityvault.kit.v1', K.encodeKit(kit)); } catch (e) { /* private mode */ }
    /* URL-sync: the address bar always reflects the current kit (button-mash-views style) */
    try {
      history.replaceState(null, '', 'kit.html?kit=' + K.encodeKit(kit));
    } catch (e) { /* file:// or odd contexts */ }
    renderKit();
  }

  function boot() {
    form = document.getElementById('kit-form');
    pantryBox = document.getElementById('kit-pantry');
    statusEl = document.getElementById('kit-status');
    resultsEl = document.getElementById('kit-warnings');
    deckEl = document.getElementById('kit-deck');
    checkEl = document.getElementById('kit-checklist');
    actionsEl = document.getElementById('kit-actions');
    buildPantry();

    Promise.all([
      fetch('data/v1/activities.json').then(function (r) { return r.json(); }),
      fetch('data/v1/balance-buckets.json').then(function (r) { return r.json(); })
    ]).then(function (res) {
      acts = res[0].activities;
      byId = {};
      acts.forEach(function (a) { byId[a.id] = a; });
      res[1].mapping.forEach(function (m) { bucketByCat[m.category] = m.bucket; });

      var params = new URLSearchParams(location.search);
      var shared = params.get('kit');
      if (shared) {
        var dec = K.decodeKit(shared);
        if (dec) {
          generate(dec);
          statusEl.textContent = 'Shared kit restored. ' + statusEl.textContent;
          return;
        }
      }
      /* last kit from this browser, if any */
      var last = null;
      try { last = localStorage.getItem('activityvault.kit.v1'); } catch (e) { /* ignore */ }
      if (last) {
        var dec2 = K.decodeKit(last);
        if (dec2 && dec2.days.length) {
          generate(dec2);
          statusEl.textContent = 'Picked up where you left off. ' + statusEl.textContent;
          return;
        }
      }
      statusEl.textContent = 'Set your options and build your kit — ' + acts.length + ' activities in the Vault.';
    }).catch(function () {
      statusEl.textContent = 'Could not load the activity library. Check your connection and reload.';
    });

    document.getElementById('kit-generate').addEventListener('click', function () {
      generate(null);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
