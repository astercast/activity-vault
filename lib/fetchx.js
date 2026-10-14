/* lib/fetchx.js, bounded upstream fetch. Shared helper, copied verbatim per repo.
 * All upstream calls go through fetchTimeout(): AbortController timeout,
 * default 4000ms (§4.2), identifying User-Agent (§8.7).
 * Returns { ok, status, text, ms, error }. Never throws on network failure.
 */
'use strict';

function fetchTimeout(url, opts) {
  opts = opts || {};
  const timeoutMs = opts.timeoutMs || 4000;
  const userAgent = opts.userAgent || 'vault-scout/1.0 (+https://github.com/astercast/activity-vault)';
  const headers = Object.assign({ 'User-Agent': userAgent, 'Accept': '*/*' }, opts.headers || {});

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const t0 = Date.now();

  return fetch(url, { headers, signal: ctrl.signal, redirect: 'follow' })
    .then(async (r) => {
      clearTimeout(timer);
      const ms = Date.now() - t0;
      let text = '';
      try {
        text = await r.text();
      } catch (e) {
        return { ok: false, status: r.status, text: '', ms, error: 'body read failed: ' + String(e && e.message || e) };
      }
      if (!r.ok) {
        return { ok: false, status: r.status, text: text.slice(0, 2000), ms, error: 'http ' + r.status };
      }
      return { ok: true, status: r.status, text, ms, error: null };
    })
    .catch((e) => {
      clearTimeout(timer);
      const ms = Date.now() - t0;
      const name = e && e.name;
      const error = name === 'AbortError' ? 'timeout after ' + timeoutMs + 'ms' : String((e && e.message) || e);
      return { ok: false, status: 0, text: '', ms, error };
    });
}

module.exports = { fetchTimeout };
