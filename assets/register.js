/* The Register: search, filter and page the records. No framework.
   The first 24 rows are already in the HTML. Data loads on first use. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var list = $("#list"), count = $("#count"), more = $("#more"), q = $("#q");
  if (!list) return;
  var all = null, state = { q: "", cat: "", proof: "", age: "", time: "" }, shown = 40, loading = null;
  var CATS = {};
  document.querySelectorAll(".rg-chip").forEach(function (b) { CATS[b.dataset.cat] = b.textContent; });

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return u; } }
  function photoOk(a) { var p = a.photo || {}; return !!(p.file && p.licence && p.source_url); }
  function sourceUrl(a) { if (typeof a.source === "string") return a.source; if (a.source && typeof a.source === "object") return a.source.url || ""; return ""; }
  function sourceOk(a) { return sourceUrl(a).indexOf("http") === 0; }
  function facts(a) {
    var t = a.time_min === a.time_max ? a.time_min : a.time_min + " to " + a.time_max;
    return "Ages " + a.age_min + " to " + a.age_max + " · " + t + " min · " + a.group_min + " to " + a.group_max + " kids · " + (CATS[a.categories[0]] || a.categories[0]);
  }
  function row(a, i) {
    var p = a.photo || {}, img, ph, so;
    if (p.file) {
      img = '<a class="rg-img" href="activity/' + esc(a.id) + '.html" tabindex="-1"><img src="assets/photos/' + esc(p.file) + '" alt="' + esc(p.alt || "") + '" width="224" height="168" loading="lazy"></a>';
      ph = photoOk(a)
        ? '<div class="ok"><dt>Photo</dt><dd><a href="' + esc(p.source_url) + '" rel="noopener">' + esc(p.licence) + ' <span aria-hidden="true">↗</span></a></dd></div>'
        : '<div class="gap"><dt>Photo</dt><dd>Rights not recorded</dd></div>';
    } else {
      img = '<span class="rg-img none" aria-hidden="true">No photo yet</span>';
      ph = '<div class="gap"><dt>Photo</dt><dd>Not yet</dd></div>';
    }
    so = sourceOk(a)
      ? '<div class="ok"><dt>Source</dt><dd><a href="' + esc(sourceUrl(a)) + '" rel="noopener">' + esc(host(sourceUrl(a))) + ' <span aria-hidden="true">↗</span></a></dd></div>'
      : '<div class="gap"><dt>Source</dt><dd>Not yet</dd></div>';
    return '<li class="rg-row" style="--i:' + Math.min(i, 12) + '">' + img + '<div class="rg-main"><h3><a href="activity/' + esc(a.id) + '.html">' + esc(a.name) + '</a></h3><p class="rg-line">' + esc(a.tagline) + '</p><p class="rg-facts">' + esc(facts(a)) + '</p></div><dl class="rg-proof">' + ph + so + "</dl></li>";
  }
  function rank(a) { return -((photoOk(a) ? 1 : 0) + (sourceOk(a) ? 1 : 0)); }
  function match(a) {
    var s = state;
    if (s.cat && a.categories.indexOf(s.cat) < 0) return false;
    if (s.age && !(a.age_min <= +s.age && a.age_max >= +s.age)) return false;
    if (s.time && a.time_min > +s.time) return false;
    var p = photoOk(a), o = sourceOk(a);
    if (s.proof === "both" && !(p && o)) return false;
    if (s.proof === "ph" && !(p && !o)) return false;
    if (s.proof === "so" && !(o && !p)) return false;
    if (s.proof === "none" && (p || o)) return false;
    if (s.q) {
      var hay = (a.name + " " + a.tagline + " " + (a.materials || []).map(function (m) { return m.item; }).join(" ")).toLowerCase();
      return s.q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
    }
    return true;
  }
  function render() {
    var r = all.filter(match).sort(function (a, b) { return rank(a) - rank(b) || a.name.localeCompare(b.name); });
    list.innerHTML = r.slice(0, shown).map(row).join("") || '<li class="rg-empty">Nothing matches. Try fewer words or press Clear.</li>';
    count.textContent = r.length + (r.length === 1 ? " record" : " records") + (state.q || state.cat || state.proof || state.age || state.time ? "." : ". Proven ones first.");
    more.hidden = r.length <= shown;
    more.textContent = "Show " + Math.min(40, r.length - shown) + " more";
    $("#clear").hidden = !(state.q || state.cat || state.proof || state.age || state.time);
    document.querySelectorAll(".rg-chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.cat === state.cat)); });
    document.querySelectorAll(".seg").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.proof === state.proof)); });
  }
  function load() {
    if (all) return Promise.resolve();
    return loading || (loading = fetch("data/v1/activities.json").then(function (r) { return r.json(); }).then(function (d) { all = d.activities; }));
  }
  function go() { shown = 40; load().then(render); }

  q.addEventListener("input", function () { state.q = q.value.trim(); go(); });
  document.querySelectorAll(".rg-chip").forEach(function (b) { b.addEventListener("click", function () { state.cat = state.cat === b.dataset.cat ? "" : b.dataset.cat; go(); }); });
  document.querySelectorAll(".seg").forEach(function (b) { b.addEventListener("click", function () { state.proof = state.proof === b.dataset.proof ? "" : b.dataset.proof; go(); }); });
  $("#age").addEventListener("change", function (e) { state.age = e.target.value; go(); });
  $("#time").addEventListener("change", function (e) { state.time = e.target.value; go(); });
  $("#clear").addEventListener("click", function () { state = { q: "", cat: "", proof: "", age: "", time: "" }; q.value = ""; $("#age").value = ""; $("#time").value = ""; go(); });
  more.addEventListener("click", function () { shown += 40; render(); });

  var u = new URLSearchParams(location.search);          // old links: ?cats=stem
  if (u.get("cats")) state.cat = u.get("cats").split(",")[0];
  if (u.get("q")) { state.q = u.get("q"); q.value = state.q; }
  if (state.cat || state.q) go();
})();
