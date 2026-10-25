/* Activity Vault, The Dateline (Claude bundle 2026-10-24, item 6).
   Rebuilt from the verified spec in fleet-ops/design-consult/
   bundle-2026-10-24/RECORD.md ("NOT DOWNLOADED"): the original
   vault-dateline.js never transferred; its verified shape was a
   36-line class of file with localStorage keys av.place.v1 +
   av.weather.v1, holiday math (Halloween, Day of the Dead,
   Thanksgiving, St. Patrick's Day, Earth Day, Fourth of July, plus
   the standard set), Open-Meteo geocoding + forecast with no key,
   and exports nextHoliday / place / dateline.

   Adaptation (recorded per the brief): this site loads classic
   scripts (IIFE + a window global, see assets/site.js), not ES
   modules, so the exports land on window.VaultDateline, with a
   CommonJS export alongside so scripts/test-dateline.js can verify
   the holiday math in node.

   The rendered line: "Saturday, October 24. Halloween in 7 days.
   58°F, rain likely from 2 pm." Date + holiday are computed
   on-device. Weather comes from Open-Meteo (no key). If the
   weather fetch fails, the line is date + holiday only — weather
   is never invented. The visitor's city is set once via the "Set
   your city" text link beside the dateline, stored rounded to
   about a mile (2 decimal places), and sent nowhere except the
   weather lookup itself. */
(function () {
  'use strict';

  var PLACE_KEY = 'av.place.v1';
  var WEATHER_KEY = 'av.weather.v1';
  var WEATHER_TTL_MS = 3 * 60 * 60 * 1000;

  function dayNum(y, m, d) { return Date.UTC(y, m, d) / 86400000; }

  function nthWeekday(year, month, weekday, n) {
    var first = new Date(Date.UTC(year, month, 1)).getUTCDay();
    var day = 1 + ((weekday - first + 7) % 7) + (n - 1) * 7;
    return { month: month, day: day };
  }
  function lastWeekday(year, month, weekday) {
    var last = new Date(Date.UTC(year, month + 1, 0));
    var day = last.getUTCDate() - ((last.getUTCDay() - weekday + 7) % 7);
    return { month: month, day: day };
  }
  function easter(year) {
    // Anonymous Gregorian computus.
    var a = year % 19, b = Math.floor(year / 100), c = year % 100,
        d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
        g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
        m = Math.floor((a + 11 * h + 22 * l) / 451),
        month = Math.floor((h + l - 7 * m + 114) / 31) - 1,
        day = ((h + l - 7 * m + 114) % 31) + 1;
    return { month: month, day: day };
  }

  function holidaysForYear(year) {
    function fixed(name, month, day) { return { name: name, year: year, month: month, day: day }; }
    function floated(name, md) { return { name: name, year: year, month: md.month, day: md.day }; }
    var es = easter(year);
    // Countdown set, matched to Claude's verified checks: his
    // Dec 28 -> "Valentine's in 48" only holds if New Year's Day
    // and MLK Day (both nearer) are NOT countdown holidays here,
    // so they are deliberately absent from this set.
    return [
      fixed("Valentine's Day", 1, 14),
      floated("Presidents' Day", nthWeekday(year, 1, 1, 3)),
      fixed("St. Patrick's Day", 2, 17),
      { name: 'Easter', year: year, month: es.month, day: es.day },
      fixed('Earth Day', 3, 22),
      floated("Mother's Day", nthWeekday(year, 4, 0, 2)),
      floated('Memorial Day', lastWeekday(year, 4, 1)),
      floated("Father's Day", nthWeekday(year, 5, 0, 3)),
      fixed('Juneteenth', 5, 19),
      fixed('Fourth of July', 6, 4),
      floated('Labor Day', nthWeekday(year, 8, 1, 1)),
      floated("Indigenous Peoples' Day", nthWeekday(year, 9, 1, 2)),
      fixed('Halloween', 9, 31),
      fixed('Day of the Dead', 10, 1),
      fixed('Veterans Day', 10, 11),
      floated('Thanksgiving', nthWeekday(year, 10, 4, 4)),
      fixed('Christmas Day', 11, 25),
      fixed('Kwanzaa', 11, 26)
    ];
  }

  function nextHoliday(from) {
    var y = from.getFullYear(), m = from.getMonth(), d = from.getDate();
    var today = dayNum(y, m, d), best = null;
    [y, y + 1].forEach(function (yr) {
      holidaysForYear(yr).forEach(function (h) {
        var n = dayNum(h.year, h.month, h.day);
        if (n >= today && (!best || n < best.num)) {
          best = { name: h.name, year: h.year, month: h.month, day: h.day, num: n, days: n - today };
        }
      });
    });
    return best;
  }

  function holidayPhrase(h) {
    if (!h) return '';
    if (h.days === 0) return h.name + ' is today';
    if (h.days === 1) return h.name + ' in 1 day';
    return h.name + ' in ' + h.days + ' days';
  }

  function datePhrase(now) {
    return now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  /* ---- place (av.place.v1) ---- */
  function place() {
    try {
      var raw = window.localStorage.getItem(PLACE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function roundMile(v) { return Math.round(v * 100) / 100; }
  function savePlace(p) {
    var stored = { name: p.name, lat: roundMile(p.lat), lon: roundMile(p.lon) };
    try { window.localStorage.setItem(PLACE_KEY, JSON.stringify(stored)); } catch (e) { /* private mode */ }
    return stored;
  }

  /* ---- weather (av.weather.v1) ---- */
  function cachedWeather(forPlace) {
    try {
      var raw = window.localStorage.getItem(WEATHER_KEY);
      if (!raw) return null;
      var w = JSON.parse(raw);
      if (!w || Date.now() - w.at > WEATHER_TTL_MS) return null;
      if (w.placeKey !== forPlace.lat + ',' + forPlace.lon) return null;
      return w;
    } catch (e) { return null; }
  }
  function hourLabel(iso) {
    var h = parseInt(iso.slice(11, 13), 10);
    if (isNaN(h)) return '';
    var ap = h >= 12 ? 'pm' : 'am', h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ' ' + ap;
  }
  function summarizeForecast(j) {
    // Returns {text, rain} or null when the payload has nothing honest to say.
    if (!j || !j.hourly || !j.hourly.time) return null;
    var times = j.hourly.time, probs = j.hourly.precipitation_probability || [],
        temps = j.hourly.temperature_2m || [], codes = j.hourly.weather_code || [];
    var nowH = new Date().getHours(), temp = null, rainAt = -1, maxProb = 0;
    for (var i = 0; i < times.length; i++) {
      var hr = parseInt(times[i].slice(11, 13), 10);
      if (hr === nowH && temps[i] != null) temp = Math.round(temps[i]);
      var p = probs[i] || 0;
      if (p > maxProb) maxProb = p;
      var rainyCode = codes[i] != null && codes[i] >= 51 && codes[i] <= 99;
      if (rainAt === -1 && hr >= nowH && (p >= 50 || rainyCode)) rainAt = i;
    }
    if (temp === null && temps.length) temp = Math.round(temps[Math.min(nowH, temps.length - 1)]);
    if (temp === null) return null;
    var rain = rainAt !== -1 || maxProb >= 50;
    var text = temp + '°F';
    if (rain) text += ', rain likely' + (rainAt !== -1 ? ' from ' + hourLabel(times[rainAt]) : '');
    else text += ', no rain likely';
    return { text: text, rain: rain };
  }
  function fetchWeather(p) {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + p.lat + '&longitude=' + p.lon +
      '&hourly=temperature_2m,precipitation_probability,weather_code&forecast_days=1' +
      '&temperature_unit=fahrenheit&timezone=auto';
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('weather ' + r.status);
      return r.json();
    }).then(function (j) {
      var s = summarizeForecast(j);
      if (!s) return null;
      var w = { at: Date.now(), placeKey: p.lat + ',' + p.lon, text: s.text, rain: s.rain };
      try { window.localStorage.setItem(WEATHER_KEY, JSON.stringify(w)); } catch (e) { /* ignore */ }
      return w;
    }).catch(function () { return null; });
  }
  function geocode(name) {
    var url = 'https://geocoding-api.open-meteo.com/v1/search?name=' +
      encodeURIComponent(name) + '&count=1&language=en&format=json';
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('geocode ' + r.status);
      return r.json();
    }).then(function (j) {
      var hit = j && j.results && j.results[0];
      if (!hit) return null;
      return savePlace({
        name: hit.name + (hit.admin1 ? ', ' + hit.admin1 : ''),
        lat: hit.latitude, lon: hit.longitude
      });
    }).catch(function () { return null; });
  }

  /* ---- the line itself ---- */
  function dateline(now, weather) {
    var parts = [datePhrase(now), holidayPhrase(nextHoliday(now))];
    if (weather && weather.text) parts.push(weather.text);
    return parts.filter(Boolean).join('. ') + '.';
  }

  function renderPicks(weather) {
    var host = document.querySelector('[data-weather-picks]');
    if (!host || !weather) return;
    host.innerHTML = '';
    var p = document.createElement('p');
    p.className = 'weather-picks';
    if (weather.rain) {
      p.appendChild(document.createTextNode('Today, indoors: '));
      var a1 = document.createElement('a'); a1.href = 'index.html?cats=rainy-day#browse'; a1.textContent = 'rainy-day activities';
      var a2 = document.createElement('a'); a2.href = 'index.html?cats=quiet-focus#browse'; a2.textContent = 'quiet activities';
      p.appendChild(a1); p.appendChild(document.createTextNode(' · ')); p.appendChild(a2);
    } else {
      p.appendChild(document.createTextNode('Today, outside: '));
      var a3 = document.createElement('a'); a3.href = 'index.html?cats=outdoor#browse'; a3.textContent = 'outdoor activities';
      p.appendChild(a3);
    }
    host.appendChild(p);
  }

  function render() {
    var els = document.querySelectorAll('[data-dateline]');
    if (!els.length) return;
    var now = new Date();
    var setLink = document.querySelector('[data-set-city]');
    function paint(weather) {
      var line = dateline(now, weather);
      els.forEach(function (el) { el.textContent = line; });
      renderPicks(weather);
    }
    var p = place();
    if (setLink && p) setLink.textContent = 'City: ' + p.name + ' — change';
    if (!p) { paint(null); return; }
    var cached = cachedWeather(p);
    if (cached) { paint(cached); return; }
    paint(null); // date + holiday first; weather joins when it honestly arrives
    fetchWeather(p).then(function (w) { if (w) paint(w); });
  }

  function initCityForm() {
    var link = document.querySelector('[data-set-city]');
    var form = document.querySelector('[data-city-form]');
    if (!link || !form) return;
    link.addEventListener('click', function (ev) {
      ev.preventDefault();
      form.hidden = !form.hidden;
      if (!form.hidden) { var i = form.querySelector('input'); if (i) i.focus(); }
    });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var input = form.querySelector('input');
      var name = input && input.value.trim();
      if (!name) return;
      geocode(name).then(function (saved) {
        if (saved) {
          try { window.localStorage.removeItem(WEATHER_KEY); } catch (e) { /* ignore */ }
          form.hidden = true;
          render();
        } else if (input) {
          input.setAttribute('aria-invalid', 'true');
          input.placeholder = 'Could not find that city — try again';
        }
      });
    });
  }

  var api = {
    nextHoliday: nextHoliday, place: place, dateline: dateline,
    holidaysForYear: holidaysForYear, holidayPhrase: holidayPhrase,
    summarizeForecast: summarizeForecast,
    KEYS: { place: PLACE_KEY, weather: WEATHER_KEY }
  };
  if (typeof window !== 'undefined') window.VaultDateline = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { render(); initCityForm(); });
    } else { render(); initCityForm(); }
  }
})();
