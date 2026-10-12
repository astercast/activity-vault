/* GET /api/review-queue — §7.6 "The Scout".
 * ?status= pending|all|decided (default pending)
 * Serves the human-in-the-loop review queue: candidates the RSS scan found,
 * awaiting a human to adapt them into original words (PIPELINE.md).
 * Reads the build-published data/v1/review-queue.json + data/v1/decided.json
 * (bundled with the deployment — the same bytes the static fallback serves).
 * Fallback: /data/v1/review-queue.json.
 */
'use strict';

const { ok, err, newRequestId } = require('../lib/envelope');
const { checkLimit, clientIp, ipHash } = require('../lib/ratelimit');

const SERVICE = 'vault-scout';
const VERSION = '1.0.0';
const STATUSES = ['pending', 'all', 'decided'];

function loadJson(path) {
  try {
    return require(path);
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  const requestId = newRequestId();

  if (req.method !== 'GET') {
    return err(res, SERVICE, VERSION, 400, 'BAD_INPUT',
      'Only GET is supported on /api/review-queue. Decisions go to POST /api/review-decide.');
  }

  const ip = clientIp(req);
  const limit = checkLimit(ip, 'public');
  if (!limit.allowed) {
    console.log('[ratelimit] ip=' + ipHash(ip) + ' bucket=public path=/api/review-queue');
    res.setHeader('Retry-After', String(limit.retryAfter));
    return err(res, SERVICE, VERSION, 429, 'RATE_LIMITED',
      'Too many requests. Slow down and try again in ' + limit.retryAfter + 's.');
  }

  let status = 'pending';
  try {
    const url = new URL(req.url, 'http://localhost');
    const q = url.searchParams.get('status');
    if (q !== null) status = q;
  } catch (e) {
    return err(res, SERVICE, VERSION, 400, 'BAD_INPUT', 'Could not parse the query string.');
  }
  if (!STATUSES.includes(status)) {
    return err(res, SERVICE, VERSION, 400, 'BAD_INPUT',
      "Unknown status '" + status + "'. Use one of: pending, all, decided.",
      { fields: { status: 'must be one of pending|all|decided' } });
  }

  const queue = loadJson('../data/v1/review-queue.json');
  const decided = loadJson('../data/v1/decided.json');

  if (!queue || !decided) {
    return err(res, SERVICE, VERSION, 502, 'UPSTREAM_UNAVAILABLE',
      'The review queue data files are missing from this deployment; the static fallback /data/v1/review-queue.json may still be served by the CDN.');
  }

  const open = queue.candidates || [];
  const done = decided.decisions || [];
  let candidates;
  if (status === 'pending') candidates = open.filter((c) => c.status === 'pending');
  else if (status === 'decided') candidates = done;
  else candidates = open.concat(done);

  ok(res, SERVICE, VERSION, {
    candidates: candidates,
    counts: {
      pending: open.filter((c) => c.status === 'pending').length,
      open: open.length,
      decided_90d: done.length,
      returned: candidates.length,
    },
    generated_at: queue.generated_at || null,
    filter: { status: status },
  }, { requestId: requestId });
};
