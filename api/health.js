/* GET /api/health, §1.4. No auth. Edge-cacheable (s-maxage=60).
 * Never returns 5xx: status is 'ok' unless a check fails, then 'degraded'.
 * uptime_s is per-instance (resets on cold start, expected, not a bug).
 */
'use strict';

const { ok } = require('../lib/envelope');
const { secretConfigured } = require('../lib/cronauth');
const { tokenConfigured } = require('../lib/github');

const SERVICE = 'vault-scout';
const VERSION = '1.0.0';
// §7.6 roster, the wave A test asserts this list matches exactly.
const ROSTER = ['health', 'review-queue', 'review-decide', 'cron/scout'];
const STARTED_AT = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

function loadJson(path) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(path);
  } catch (e) {
    return null;
  }
}

function freshness(name, generatedAtIso, slaS) {
  if (!generatedAtIso) {
    return { generated_at: null, age_s: null, sla_s: slaS, within_sla: false };
  }
  const t = Date.parse(generatedAtIso);
  if (Number.isNaN(t)) return { generated_at: generatedAtIso, age_s: null, sla_s: slaS, within_sla: false };
  const ageS = Math.max(0, Math.floor((Date.now() - t) / 1000));
  return { generated_at: generatedAtIso, age_s: ageS, sla_s: slaS, within_sla: ageS <= slaS };
}

module.exports = async (req, res) => {
  const requestId = require('../lib/envelope').newRequestId();

  // Data files the functions depend on (§1.4 data_freshness).
  // review-queue.json / decided.json carry generated_at (stamped by scripts/build.py).
  // activities.json carries date-only `updated`; the build's index.json meta.generated
  // is the honest regeneration timestamp for the archive files.
  const queue = loadJson('../data/v1/review-queue.json');
  const decided = loadJson('../data/v1/decided.json');
  const index = loadJson('../data/v1/index.json');
  const activities = loadJson('../data/v1/activities.json');

  const SLA = 86400; // §7.6: 24h freshness SLA
  const dataFreshness = {
    'review-queue.json': freshness('review-queue.json', queue && queue.generated_at, SLA),
    'decided.json': freshness('decided.json', decided && decided.generated_at, SLA),
    'activities.json': freshness('activities.json',
      index && index.meta && index.meta.generated, SLA),
  };

  const checks = {
    static_fallback_present: !!(queue && decided && activities && index),
    cron_secret_configured: secretConfigured(),
    github_token_configured: tokenConfigured(),
  };

  const stale = Object.values(dataFreshness).some((f) => !f.within_sla);
  const status = (checks.static_fallback_present && !stale) ? 'ok' : 'degraded';

  ok(res, SERVICE, VERSION, {
    status: status,
    service: SERVICE,
    version: VERSION,
    started_at: STARTED_AT,
    uptime_s: Math.floor(process.uptime()),
    node: process.version,
    functions: ROSTER,
    data_freshness: dataFreshness,
    checks: checks,
  }, { requestId: requestId, smaxage: 60 });
};
