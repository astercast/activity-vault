/* lib/cronauth.js, CRON_SECRET gate (§8). Shared helper, copied verbatim per repo.
 *
 * Vercel automatically sends `Authorization: Bearer <CRON_SECRET>` on cron
 * invocations when CRON_SECRET is set. The same bearer authorizes admin
 * endpoints (e.g. POST /api/review-decide). The human operator holds the
 * secret; it never goes in a query string (query strings land in logs).
 *
 * Fail closed: if CRON_SECRET is unset, assertCron() returns false and the
 * endpoint must 401 with code UNAUTHORIZED. No secrets in code/vercel.json.
 */
'use strict';

function assertCron(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers && req.headers.authorization;
  return auth === 'Bearer ' + secret;
}

function secretConfigured() {
  return !!process.env.CRON_SECRET;
}

module.exports = { assertCron, secretConfigured };
