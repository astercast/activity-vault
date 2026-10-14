/* lib/github.js. The repo is the database (§5). Shared helper, copied verbatim per repo.
 *
 * GitHub Contents API with GITHUB_REPO_TOKEN.
 *
 * PENDING TOKEN (documented 2026-10-11): the fine-grained PAT (contents:write on
 * THIS repo only) the cron commit-back path needs is still awaiting the user's
 * decision (ARCHITECTURE.md §14 open decision 1). Until GITHUB_REPO_TOKEN is set:
 *   - readJson() throws TOKEN_MISSING (callers must fall back to bundled copies).
 *   - writeJsonIfChanged() returns { committed: false, changed: false,
 *     reason: 'no-github-token' }. Callers degrade to read-only and say so
 *     honestly in the envelope (degraded:true + human note), never silently.
 * Nothing here invents a token, reads one from anywhere else, or logs one.
 *
 * writeJsonIfChanged(path, obj, message):
 *   GETs the current file, compares canonical JSON (sorted keys, 2-space indent,
 *   trailing newline) by SHA-256, PUTs only on change. On SHA mismatch (409) it
 *   re-reads once and retries once, then returns { committed: false, reason: 'conflict' }.
 *   Returns { committed, sha, changed, reason? }. All calls carry an 8000ms timeout.
 */
'use strict';

const { fetchTimeout } = require('./fetchx');

function repoSlug() {
  return process.env.GITHUB_REPO || 'astercast/activity-vault';
}

function branch() {
  return process.env.GITHUB_BRANCH || 'main';
}

function tokenConfigured() {
  return !!process.env.GITHUB_REPO_TOKEN;
}

// Canonical JSON: sorted keys (recursive), 2-space indent, trailing newline.
function canonicalize(obj) {
  if (Array.isArray(obj)) return obj.map(canonicalize);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const k of Object.keys(obj).sort()) out[k] = canonicalize(obj[k]);
    return out;
  }
  return obj;
}

function canonicalJson(obj) {
  return JSON.stringify(canonicalize(obj), null, 2) + '\n';
}

function sha256hex(s) {
  return require('crypto').createHash('sha256').update(s, 'utf8').digest('hex');
}

async function gh(path, method, body) {
  const url = 'https://api.github.com/repos/' + repoSlug() + '/contents/' + path;
  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Authorization': 'Bearer ' + process.env.GITHUB_REPO_TOKEN,
  };
  const r = await fetchTimeout(url, {
    timeoutMs: 8000,
    headers,
    userAgent: 'vault-scout/1.0 (+https://github.com/astercast/activity-vault)',
  });
  // fetchx only does GET-shaped calls; for PUT/POST we need our own fetch here.
  if (method && method !== 'GET') {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const t0 = Date.now();
    try {
      const resp = await fetch(url, {
        method,
        headers: Object.assign({}, headers, { 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const text = await resp.text();
      return { ok: resp.ok, status: resp.status, text, ms: Date.now() - t0, error: resp.ok ? null : 'http ' + resp.status };
    } catch (e) {
      clearTimeout(timer);
      const name = e && e.name;
      return { ok: false, status: 0, text: '', ms: Date.now() - t0,
               error: name === 'AbortError' ? 'timeout after 8000ms' : String((e && e.message) || e) };
    }
  }
  return r;
}

// readJson(path) -> { data, sha } ; { data: null, sha: null } on 404.
// Throws { code: 'TOKEN_MISSING' } when GITHUB_REPO_TOKEN is unset.
async function readJson(path) {
  if (!tokenConfigured()) {
    const e = new Error('GITHUB_REPO_TOKEN is not configured');
    e.code = 'TOKEN_MISSING';
    throw e;
  }
  const r = await gh(path + '?ref=' + encodeURIComponent(branch()), 'GET');
  if (!r.ok && r.status === 404) return { data: null, sha: null };
  if (!r.ok) {
    const e = new Error('github read failed: ' + r.error);
    e.code = 'GITHUB_READ_FAILED';
    e.status = r.status;
    throw e;
  }
  let payload;
  try {
    payload = JSON.parse(r.text);
  } catch (e) {
    const err = new Error('github read: invalid JSON in API response');
    err.code = 'GITHUB_READ_FAILED';
    throw err;
  }
  const content = Buffer.from(payload.content || '', 'base64').toString('utf8');
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    const err = new Error('github read: file ' + path + ' is not valid JSON');
    err.code = 'GITHUB_READ_FAILED';
    throw err;
  }
  return { data, sha: payload.sha || null };
}

// writeJsonIfChanged(path, obj, message) -> { committed, sha, changed, reason? }
async function writeJsonIfChanged(path, obj, message) {
  if (!tokenConfigured()) {
    return { committed: false, sha: null, changed: false, reason: 'no-github-token' };
  }
  const newText = canonicalJson(obj);
  const newHash = sha256hex(newText);

  async function putOnce(currentSha) {
    const body = { message, content: Buffer.from(newText, 'utf8').toString('base64'), branch: branch() };
    if (currentSha) body.sha = currentSha;
    return gh(path, 'PUT', body);
  }

  let current;
  try {
    current = await readJson(path);
  } catch (e) {
    return { committed: false, sha: null, changed: false, reason: 'read-failed: ' + e.message };
  }

  if (current.data !== null) {
    try {
      if (sha256hex(canonicalJson(current.data)) === newHash) {
        return { committed: false, sha: current.sha, changed: false };
      }
    } catch (e) {
      // fall through and attempt the write
    }
  }

  let r = await putOnce(current.sha);
  if (!r.ok && r.status === 409) {
    // SHA mismatch. Re-read once, retry once (§1.11).
    try {
      current = await readJson(path);
    } catch (e) {
      return { committed: false, sha: null, changed: false, reason: 'conflict-reread-failed' };
    }
    if (current.data !== null) {
      try {
        if (sha256hex(canonicalJson(current.data)) === newHash) {
          return { committed: false, sha: current.sha, changed: false, reason: 'already-current' };
        }
      } catch (e) { /* attempt write */ }
    }
    r = await putOnce(current.sha);
    if (!r.ok && r.status === 409) {
      return { committed: false, sha: null, changed: false, reason: 'conflict' };
    }
  }
  if (!r.ok) {
    return { committed: false, sha: null, changed: false, reason: 'write-failed: ' + r.error };
  }
  let sha = null;
  try {
    sha = JSON.parse(r.text).content.sha || null;
  } catch (e) { /* sha stays null */ }
  return { committed: true, sha, changed: true };
}

module.exports = { readJson, writeJsonIfChanged, tokenConfigured, canonicalJson, repoSlug, branch };
