/* lib/ratelimit.js — per-instance in-memory token bucket (§1.7). Shared helper,
 * copied verbatim per repo. Best-effort: resets on cold start (documented, not hidden).
 *
 * Buckets: 'public' 60 req/min per IP (GET functions), 'compute' 20 req/min per IP
 * (POST compute endpoints). Keyed on x-forwarded-for (first entry), not socket IP.
 * checkLimit(ip, bucket) -> { allowed: bool, retryAfter: seconds }.
 */
'use strict';

const LIMITS = { public: 60, compute: 20 };
const WINDOW_MS = 60 * 1000;

// ip -> bucket -> array of request timestamps (ms)
const buckets = new Map();

function checkLimit(ip, bucket) {
  const limit = LIMITS[bucket] || LIMITS.public;
  const now = Date.now();
  const key = (ip || 'unknown') + '|' + bucket;
  let hits = buckets.get(key);
  if (!hits) {
    hits = [];
    buckets.set(key, hits);
  }
  // drop timestamps outside the window
  while (hits.length && hits[0] <= now - WINDOW_MS) hits.shift();
  if (hits.length >= limit) {
    const retryAfter = Math.ceil((hits[0] + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter: Math.max(retryAfter, 1) };
  }
  hits.push(now);
  // hygiene: bound the map so a pathological IP set can't grow it forever
  if (buckets.size > 20000) buckets.clear();
  return { allowed: true, retryAfter: 0 };
}

function clientIp(req) {
  const fwd = req.headers && req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

// Log a SHA-256 hash of the IP, never the raw IP (§4.5).
function ipHash(ip) {
  return require('crypto').createHash('sha256').update(String(ip)).digest('hex').slice(0, 12);
}

module.exports = { checkLimit, clientIp, ipHash, LIMITS };
