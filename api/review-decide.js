/* POST /api/review-decide, §7.6 "The Scout" human-in-the-loop decision.
 * Body: { id, decision: 'approve'|'reject', note? } + CRON_SECRET bearer.
 * The human operator holds the secret (same mechanism as cron); the browser
 * never sees it, the review panel only renders for?admin=1 with the secret
 * pasted into session storage, never in a URL, never committed.
 *
 * Approve: the candidate is ACCEPTED into the pipeline and recorded in
 * pipeline/decided.json with approved_via:'scout'. The decision entry moves
 * the item out of the open queue.
 *
 * DOCUMENTED DEVIATION from §7.6 ("approve appends to activities.json"):
 * the endpoint cannot mint a valid activity record, PIPELINE.md requires a
 * human to adapt each idea into original words (steps, materials, safety…),
 * and inventing that content server-side would be fabricated data, violating
 * §6. So approve records the human's acceptance decision honestly; the human's
 * wave adds the real activity to data/activities.json via scripts/build.py.
 * Nothing is auto-published. Reject moves the item to decided.json as usual.
 *
 * PENDING TOKEN (2026-10-11): GITHUB_REPO_TOKEN (fine-grained PAT,
 * contents:write on this repo only) is still awaiting the user's decision.
 * Without it the endpoint is read-only: it validates and reports the decision
 * honestly but returns 503 REFRESH_FAILED instead of committing.
 * No static fallback, admin only; the UI hides the control without the secret.
 */
'use strict';

const { ok, err, newRequestId, nowIso } = require('../lib/envelope');
const { checkLimit, clientIp, ipHash } = require('../lib/ratelimit');
const { assertCron } = require('../lib/cronauth');
const github = require('../lib/github');

const SERVICE = 'vault-scout';
const VERSION = '1.0.0';
const MAX_BODY = 64 * 1024;
const RETENTION_DAYS = 90;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    const chunks = [];
    req.on('data', (c) => {
      bytes += c.length;
      if (bytes > MAX_BODY) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function pruneDecided(decisions) {
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 3600 * 1000;
  const kept = [];
  for (const d of decisions) {
    const t = Date.parse(d.decided_at || d.reviewed || '');
    if (Number.isNaN(t)) { kept.push(d); continue; } // undated: keep, can't prove age
    if (t >= cutoff) kept.push(d);
  }
  return kept;
}

async function loadPipeline() {
  // Source of truth: the repo files (via GitHub when the token exists).
  // Read-only fallback: the copies bundled with the deployment.
  if (github.tokenConfigured()) {
    const [q, d] = await Promise.all([
      github.readJson('pipeline/review-queue.json').catch((e) => {
        if (e.code === 'TOKEN_MISSING') throw e;
        return { data: [], sha: null };
      }),
      github.readJson('pipeline/decided.json').catch(() => ({ data: [], sha: null })),
    ]);
    return {
      queue: Array.isArray(q.data) ? q.data : [],
      decided: Array.isArray(d.data) ? d.data : [],
      writable: true,
    };
  }
  return {
    queue: require('../pipeline/review-queue.json'),
    decided: (() => { try { return require('../pipeline/decided.json'); } catch (e) { return []; } })(),
    writable: false,
  };
}

module.exports = async (req, res) => {
  const requestId = newRequestId();

  if (req.method !== 'POST') {
    return err(res, SERVICE, VERSION, 400, 'BAD_INPUT',
      'Only POST is supported on /api/review-decide. Send JSON {id, decision, note?}.');
  }

  if (!assertCron(req)) {
    console.log('[cronauth] review-decide denied request_id=' + requestId);
    return err(res, SERVICE, VERSION, 401, 'UNAUTHORIZED',
      'This endpoint needs the operator secret: Authorization: Bearer <CRON_SECRET>. ' +
      'Without it, review decisions are not accepted.');
  }

  const ip = clientIp(req);
  const limit = checkLimit(ip, 'compute');
  if (!limit.allowed) {
    console.log('[ratelimit] ip=' + ipHash(ip) + ' bucket=compute path=/api/review-decide');
    res.setHeader('Retry-After', String(limit.retryAfter));
    return err(res, SERVICE, VERSION, 429, 'RATE_LIMITED',
      'Too many decision attempts. Try again in ' + limit.retryAfter + 's.');
  }

  let raw;
  try {
    raw = await readBody(req);
  } catch (e) {
    return err(res, SERVICE, VERSION, 400, 'BAD_INPUT', 'Could not read the request body: ' + e.message);
  }
  let body;
  try {
    body = JSON.parse(raw || '{}');
  } catch (e) {
    return err(res, SERVICE, VERSION, 400, 'BAD_INPUT',
      'The request body must be JSON, e.g. {"id":"abc123","decision":"approve"}.',
      { fields: { body: 'invalid JSON' } });
  }

  const fields = {};
  if (!body || typeof body.id !== 'string' || !body.id.trim()) fields.id = 'required: the candidate id string';
  if (body.decision !== 'approve' && body.decision !== 'reject') {
    fields.decision = "required: 'approve' or 'reject'";
  }
  if (body.note !== undefined && (typeof body.note !== 'string' || body.note.length > 500)) {
    fields.note = 'optional string, max 500 characters';
  }
  if (Object.keys(fields).length) {
    return err(res, SERVICE, VERSION, 400, 'BAD_INPUT',
      'The decision was not recorded: some fields need attention.', { fields });
  }
  const id = body.id.trim();
  const decision = body.decision;
  const note = (body.note || '').trim();

  let pipeline;
  try {
    pipeline = await loadPipeline();
  } catch (e) {
    return err(res, SERVICE, VERSION, 502, 'UPSTREAM_UNAVAILABLE',
      'Could not load the review queue to record your decision: ' + e.message);
  }

  const idx = pipeline.queue.findIndex((c) => c.id === id);
  if (idx === -1) {
    return err(res, SERVICE, VERSION, 404, 'NOT_FOUND',
      "No review candidate with id '" + id + "'. It may already be decided, check /api/review-queue?status=all.");
  }
  const candidate = pipeline.queue[idx];
  if (candidate.status && candidate.status !== 'pending') {
    return err(res, SERVICE, VERSION, 400, 'BAD_INPUT',
      "Candidate '" + id + "' is already decided (" + candidate.status + "). Decisions are final; re-review it by hand in a wave.",
      { fields: { id: 'already decided as ' + candidate.status } });
  }

  if (!pipeline.writable) {
    // Graceful read-only degradation: validate honestly, commit nothing.
    return err(res, SERVICE, VERSION, 500, 'REFRESH_FAILED',
      'Decision validated but NOT recorded: the GITHUB_REPO_TOKEN commit-back token ' +
      'is still pending setup (awaiting the human\'s decision), so the queue is read-only. ' +
      'Your decision was: ' + decision + " on '" + candidate.title + "'.",
      { id: id, decision: decision, committed: false, reason: 'no-github-token' });
  }

  const decidedAt = nowIso();
  candidate.status = decision === 'approve' ? 'accepted' : 'rejected';
  candidate.decided_at = decidedAt;
  candidate.decision = decision;
  if (note) candidate.note = note;

  const decidedEntry = {
    id: candidate.id,
    title: candidate.title,
    source_url: candidate.source_url || candidate.link || null,
    feed: candidate.feed || null,
    decision: decision,
    decided_at: decidedAt,
    decided_by: 'human',
    note: note || candidate.note || null,
    activity_id: candidate.activity_id || null,
    approved_via: decision === 'approve' ? 'scout' : null,
  };
  if (decision === 'approve' && !decidedEntry.note) {
    decidedEntry.note = 'Accepted by the human reviewer via the Scout. Adapt into original words per PIPELINE.md before adding to data/activities.json.';
  }

  const newQueue = pipeline.queue.slice(0, idx).concat(pipeline.queue.slice(idx + 1));
  const newDecided = pruneDecided([decidedEntry].concat(pipeline.decided));

  const msg = 'scout: ' + decision + ' ' + id;
  const wq = await github.writeJsonIfChanged('pipeline/review-queue.json', newQueue, msg);
  const wd = await github.writeJsonIfChanged('pipeline/decided.json', newDecided, msg);

  const committed = !!(wq.committed || wd.committed);
  console.log('[cron] review-decide ' + decision + ' id=' + id +
    ' committed=' + committed + ' request_id=' + requestId);

  ok(res, SERVICE, VERSION, {
    id: id,
    decision: decision,
    committed: committed,
    decided_at: decidedAt,
    approved_via: decidedEntry.approved_via,
    queue_pending_remaining: newQueue.filter((c) => !c.status || c.status === 'pending').length,
    commit: { queue: wq, decided: wd },
  }, { requestId: requestId, cache: 'none' });
};
