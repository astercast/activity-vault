/* lib/envelope.js — the §1.1 API envelope. Shared helper, copied verbatim per repo.
 * Every function returns ONLY through ok()/err(). No raw res.json() ad-hoc shapes.
 *
 * Cache policy (§1.6): GET functions -> public, s-maxage=600, stale-while-revalidate=86400.
 * POST / cron / admin -> no-store.
 */
'use strict';

const crypto = require('crypto');

function newRequestId() {
  return 'req_' + crypto.randomBytes(3).toString('hex');
}

// RFC 3339 UTC, second precision (§1.3)
function nowIso() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function send(res, status, cacheControl, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', cacheControl);
  res.end(JSON.stringify(obj));
}

const CACHE_GET = 'public, s-maxage=600, stale-while-revalidate=86400';
const CACHE_NONE = 'no-store';

// ok(res, service, version, data, opts)
// opts: { requestId, source, degraded, stale_since, upstream, note, cache: 'get'|'none', smaxage }
function ok(res, service, version, data, opts) {
  opts = opts || {};
  const cache = opts.cache === 'none'
    ? CACHE_NONE
    : 'public, s-maxage=' + (opts.smaxage || 600) + ', stale-while-revalidate=86400';
  send(res, 200, cache, {
    ok: true,
    data: data === undefined ? null : data,
    meta: {
      service: service,
      version: version,
      generated_at: nowIso(),
      source: opts.source || 'live',
      degraded: !!opts.degraded,
      stale_since: opts.stale_since || null,
      upstream: opts.upstream || [],
      note: opts.note || null,
      request_id: opts.requestId || newRequestId(),
    },
  });
}

// err(res, service, version, httpStatus, code, message, details)
// codes: BAD_INPUT 400, UNAUTHORIZED 401, NOT_FOUND 404, RATE_LIMITED 429,
//        UPSTREAM_UNAVAILABLE 502, REFRESH_FAILED 500, INTERNAL 500 (§1.2)
function err(res, service, version, httpStatus, code, message, details) {
  const error = { code: code, message: message };
  if (details !== undefined) error.details = details;
  send(res, httpStatus, CACHE_NONE, {
    ok: false,
    data: null,
    meta: {
      service: service,
      version: version,
      generated_at: nowIso(),
      request_id: newRequestId(),
    },
    error: error,
  });
}

module.exports = { ok, err, newRequestId, nowIso };
