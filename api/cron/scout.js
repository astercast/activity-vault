/* GET /api/cron/scout, §7.6 "The Scout" daily RSS scan.
 * Cron only (CRON_SECRET bearer). Cache: no-store. Idempotent (§4.3):
 * content-hash commits (identical output -> no commit), stable upstream ids
 * (sha256, same scheme as pipeline/scan.py so the two never double-queue),
 * and a 60-second global cooldown against duplicate Vercel deliveries.
 *
 * Each run (≤10s):
 *  1. load pipeline/feeds.json (bundled), the queue + seen set (GitHub when the
 *     token exists, bundled copies otherwise), and data/v1/activities.json (bundled)
 *  2. fetch feeds in parallel (fetchx, 4000ms each, Promise.allSettled
 *     partial success is the normal case), parse RSS 2.0 / Atom
 *  3. relevance filter (KEEP/DROP, ported verbatim from pipeline/scan.py) +
 *     airtight dedupe: uid in seen/queue -> skip; near-dupe screen vs the full
 *     455-activity archive (title token Jaccard >= 0.6) and vs queued links/urls
 *  4. append `pending` candidates (with detected_at + suggested_tags) to the queue,
 *     move decided items to decided.json (90d retention), prune
 *  5. writeJsonIfChanged back to pipeline/seen.json, pipeline/review-queue.json,
 *     pipeline/decided.json. Then the triggered redeploy runs scripts/build.py,
 *     which publishes data/v1/review-queue.json + data/v1/decided.json.
 *
 * PENDING TOKEN (2026-10-11): GITHUB_REPO_TOKEN is still awaiting the user's
 * decision. Without it the job degrades to read-only: it computes real
 * candidates and returns them in the envelope (degraded:true + honest note),
 * but commits nothing. It never fabricates a commit.
 */
'use strict';

const crypto = require('crypto');
const { ok, err, newRequestId, nowIso } = require('../../lib/envelope');
const { fetchTimeout } = require('../../lib/fetchx');
const { assertCron } = require('../../lib/cronauth');
const github = require('../../lib/github');

const SERVICE = 'vault-scout';
const VERSION = '1.0.0';
const JOB_PATH = '/api/cron/scout';
const COOLDOWN_MS = 60 * 1000;
const RETENTION_DAYS = 90;
const NEAR_DUPE_JACCARD = 0.6;

const lastRun = new Map(); // job path -> timestamp (double-fire protection, §4.3)

// --- relevance filter: ported verbatim from pipeline/scan.py -----------------
const KEEP = /\b(activit|craf|game|project|experiment|challenge|printable|worksheet|lesson|stem|steam|art\b|recipe|scavenger|bingo|relay|obstacle|song|rhythm|dance|puppet|slime|volcano|sensory|holiday|halloween|thanksgiving|christmas|valentine|easter|spring|summer|fall|autumn|winter|snow|outdoor|indoor|rainy|icebreaker|team.build|mindful|breath|yoga|sport|ball|tag\b|parachute|playground|recess|after.school|preschool|kindergarten)\w*/i;
const DROP = /\b(sale|deal|coupon|discount|giveaway|sweepstakes|contest|job|hiring|webinar|podcast|opinion|editorial|policy|funding|grant|salary|union|election|obituary)\b/i;

function relevant(item) {
  const text = item.title + ' ' + item.summary;
  return KEEP.test(text) && !DROP.test(text);
}

// --- suggested_tags: real keyword signal -> the fixed TAG_IDS vocabulary -----
// Only tags whose pattern actually matched the item's text are suggested.
const TAG_RULES = [
  [/halloween/i, 'holiday:halloween'],
  [/thanksgiving/i, 'holiday:thanksgiving'],
  [/christmas|\bxmas\b/i, 'holiday:christmas'],
  [/hanukkah|chanukah/i, 'holiday:hanukkah'],
  [/kwanzaa/i, 'holiday:kwanzaa'],
  [/new year/i, 'holiday:new-year'],
  [/d[ií]a de (los )?muertos|day of the dead/i, 'holiday:dia-de-muertos'],
  [/easter/i, 'holiday:easter'],
  [/earth day/i, 'holiday:earth-day'],
  [/july 4|fourth of july|independence day/i, 'holiday:july-4th'],
  [/spooky|ghost|monster|witch|pumpkin|haunted/i, 'theme:spooky'],
  [/\bfall\b|autumn/i, 'season:fall'],
  [/winter|snow/i, 'season:winter'],
  [/spring/i, 'season:spring'],
  [/summer/i, 'season:summer'],
];

function suggestedTags(item) {
  const text = item.title + ' ' + item.summary;
  const tags = [];
  for (const [re, tag] of TAG_RULES) {
    if (re.test(text)) tags.push(tag);
  }
  return tags;
}

// --- tiny dependency-free RSS 2.0 / Atom parser ------------------------------
function unescapeEntities(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (m, n) => { try { return String.fromCodePoint(parseInt(n, 10)); } catch (e) { return m; } })
    .replace(/&#x([0-9a-fA-F]+);/g, (m, n) => { try { return String.fromCodePoint(parseInt(n, 16)); } catch (e) { return m; } })
    .replace(/&amp;/g, '&');
}

function cleanText(s) {
  if (!s) return '';
  s = String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  s = s.replace(/<[^>]+>/g, ' ');
  s = unescapeEntities(s);
  return s.replace(/\s+/g, ' ').trim();
}

function tagContent(block, names) {
  for (const name of names) {
    const m = block.match(new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + name + '>', 'i'));
    if (m) return cleanText(m[1]);
  }
  return '';
}

function atomLink(block) {
  const links = block.match(/<link(?:\s[^>]*)?\/?>/gi) || [];
  for (const l of links) {
    const rel = /rel="([^"]*)"/i.exec(l);
    if (!rel || rel[1] === 'alternate') {
      const href = /href="([^"]*)"/i.exec(l);
      if (href) return href[1];
    }
  }
  return '';
}

function parseFeed(xml) {
  const items = [];
  const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  for (const b of itemBlocks) {
    let link = tagContent(b, ['link']);
    if (!link) link = tagContent(b, ['guid']);
    items.push({
      title: tagContent(b, ['title']),
      link: link,
      published: tagContent(b, ['pubDate', 'dc:date']),
      summary: (tagContent(b, ['content:encoded']) || tagContent(b, ['description'])).slice(0, 500),
    });
  }
  const entryBlocks = xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const b of entryBlocks) {
    items.push({
      title: tagContent(b, ['title']),
      link: atomLink(b),
      published: tagContent(b, ['published', 'updated']),
      summary: (tagContent(b, ['summary']) || tagContent(b, ['content'])).slice(0, 500),
    });
  }
  return items.filter((it) => it.title && it.link);
}

// --- dedupe ------------------------------------------------------------------
// uid scheme identical to pipeline/scan.py so the VM pipeline and the cron
// job share one seen set and never double-queue.
function uid(feedId, link, title) {
  return crypto.createHash('sha256').update(feedId + '|' + link + '|' + title, 'utf8').digest('hex').slice(0, 16);
}

function normalizeUrl(u) {
  try {
    const p = new URL(u);
    p.hash = '';
    for (const k of [...p.searchParams.keys()]) {
      if (/^utm_|^fbclid$|^gclid$/i.test(k)) p.searchParams.delete(k);
    }
    let s = p.toString().toLowerCase();
    return s.replace(/\/$/, '');
  } catch (e) {
    return String(u).toLowerCase().replace(/\/$/, '');
  }
}

function tokenSet(s) {
  return new Set(
    String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ')
      .filter((t) => t.length > 2)
  );
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

async function loadInputs() {
  const feeds = require('../../pipeline/feeds.json');
  const activities = require('../../data/v1/activities.json');
  let queue, seen, decided, writable;
  if (github.tokenConfigured()) {
    const [q, s, d] = await Promise.all([
      github.readJson('pipeline/review-queue.json').catch(() => ({ data: [] })),
      github.readJson('pipeline/seen.json').catch(() => ({ data: {} })),
      github.readJson('pipeline/decided.json').catch(() => ({ data: [] })),
    ]);
    queue = Array.isArray(q.data) ? q.data : [];
    seen = (s.data && typeof s.data === 'object' && !Array.isArray(s.data)) ? s.data : {};
    decided = Array.isArray(d.data) ? d.data : [];
    writable = true;
  } else {
    queue = require('../../pipeline/review-queue.json');
    seen = require('../../pipeline/seen.json');
    try { decided = require('../../pipeline/decided.json'); } catch (e) { decided = []; }
    writable = false;
  }
  return { feeds, activities: activities.activities || [], queue, seen, decided, writable };
}

module.exports = async (req, res) => {
  const requestId = newRequestId();
  const runStart = nowIso();

  if (!assertCron(req)) {
    console.log('[cronauth] scout denied request_id=' + requestId);
    return err(res, SERVICE, VERSION, 401, 'UNAUTHORIZED',
      'The scout only runs on its schedule or with the operator secret: ' +
      'Authorization: Bearer <CRON_SECRET>.');
  }

  const sinceLast = Date.now() - (lastRun.get(JOB_PATH) || 0);
  if (sinceLast < COOLDOWN_MS) {
    console.log('[cron] scout duplicate suppressed request_id=' + requestId);
    return ok(res, SERVICE, VERSION, {
      duplicate: true,
      checked: 0, changed: false, committed: false, new_candidates: [],
      note: 'A run finished ' + Math.floor(sinceLast / 1000) + 's ago; duplicate delivery suppressed.',
    }, { requestId: requestId, cache: 'none' });
  }
  lastRun.set(JOB_PATH, Date.now());
  console.log('[cron] scout start request_id=' + requestId);

  let inputs;
  try {
    inputs = await loadInputs();
  } catch (e) {
    console.log('[cron] scout fail stage=load error=' + e.message + ' request_id=' + requestId);
    return err(res, SERVICE, VERSION, 500, 'REFRESH_FAILED',
      'The scout could not load its inputs: ' + e.message, { stage: 'load' });
  }

  const { feeds, activities, queue, seen, decided, writable } = inputs;
  const queuedIds = new Set(queue.map((q) => q.id));
  const queuedUrls = new Set(queue.map((q) => normalizeUrl(q.link || q.source_url || '')).filter(Boolean));
  const activityNames = activities.map((a) => ({ id: a.id, tokens: tokenSet(a.name) }));
  const activityUrls = new Set(
    activities.map((a) => normalizeUrl(a.source || '')).filter(Boolean)
  );

  const upstream = [];
  const newCandidates = [];
  const screened = { seen_before: 0, near_dupe: 0, url_dupe: 0, irrelevant: 0 };
  let feedsOk = 0;

  // Bounded parallel fetch: 4000ms per source, partial success is normal.
  const fetches = await Promise.allSettled(
    feeds.map((f) => fetchTimeout(f.url, { timeoutMs: 4000 }))
  );

  for (let i = 0; i < feeds.length; i++) {
    const feed = feeds[i];
    const fr = fetches[i].status === 'fulfilled' ? fetches[i].value : { ok: false, error: 'settled rejection', ms: 0 };
    const checkedAt = nowIso();
    if (!fr.ok) {
      upstream.push({ source: feed.id, ok: false, checked_at: checkedAt, error: fr.error || 'fetch failed' });
      console.log('[upstream] ' + feed.id + ' fail error=' + (fr.error || 'fetch failed') + ' latency_ms=' + (fr.ms || 0));
      continue;
    }
    let items;
    try {
      items = parseFeed(fr.text);
    } catch (e) {
      upstream.push({ source: feed.id, ok: false, checked_at: checkedAt, error: 'parse failed: ' + e.message });
      console.log('[upstream] ' + feed.id + ' fail error=parse failed: ' + e.message + ' latency_ms=' + fr.ms);
      continue;
    }
    feedsOk++;
    upstream.push({ source: feed.id, ok: true, checked_at: checkedAt, latency_ms: fr.ms });

    for (const it of items) {
      const id = uid(feed.id, it.link, it.title);
      if (seen[id] || queuedIds.has(id)) { screened.seen_before++; continue; }
      // mark seen immediately (same convention as pipeline/scan.py: uid -> published)
      seen[id] = it.published || '';
      if (!relevant(it)) { screened.irrelevant++; continue; }
      const nurl = normalizeUrl(it.link);
      if (queuedUrls.has(nurl) || activityUrls.has(nurl)) { screened.url_dupe++; continue; }
      // near-dupe screen vs the full archive (wave-20 style): similar title =
      // the same classic concept already in the vault under a different name.
      const toks = tokenSet(it.title);
      const near = activityNames.find((a) => jaccard(toks, a.tokens) >= NEAR_DUPE_JACCARD);
      if (near) { screened.near_dupe++; continue; }
      // near-dupe vs already-queued candidates (same idea, different feed)
      const nearQ = newCandidates.find((c) => jaccard(toks, tokenSet(c.title)) >= NEAR_DUPE_JACCARD)
        || queue.find((c) => jaccard(toks, tokenSet(c.title || '')) >= NEAR_DUPE_JACCARD);
      if (nearQ) { screened.near_dupe++; continue; }

      const candidate = {
        id: id,
        status: 'pending',
        feed: feed.name,
        title: it.title,
        link: it.link,
        source_url: it.link,
        published: it.published,
        detected_at: runStart,
        summary: it.summary.slice(0, 300),
        suggested_tags: suggestedTags(it),
        note: 'Adapt into original words per PIPELINE.md. Link as source if adapted.',
      };
      newCandidates.push(candidate);
      queuedIds.add(id);
      queuedUrls.add(nurl);
    }
  }

  // Move decided items out of the open queue into decided.json (90d retention, §5.1).
  const openQueue = [];
  const movedDecided = [];
  for (const c of queue) {
    if (c.status && c.status !== 'pending') {
      movedDecided.push({
        id: c.id,
        title: c.title,
        source_url: c.source_url || c.link || null,
        feed: c.feed || null,
        decision: c.status === 'accepted' ? 'approve' : 'reject',
        decided_at: c.decided_at || null,
        decided_by: c.decided_by || 'human',
        note: c.decision || c.note || null,
        activity_id: c.activity_id || null,
        approved_via: c.status === 'accepted' ? 'scout' : null,
        reviewed: c.reviewed || null,
      });
    } else {
      openQueue.push(c);
    }
  }
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 3600 * 1000;
  const allDecided = movedDecided.concat(decided).filter((d) => {
    const t = Date.parse(d.decided_at || d.reviewed || '');
    return Number.isNaN(t) || t >= cutoff; // undated: keep, can't prove age
  });

  const finalQueue = openQueue.concat(newCandidates);
  const queueChanged = JSON.stringify(finalQueue) !== JSON.stringify(queue) || movedDecided.length > 0;

  let commits = [];
  let committed = false;
  /* Wave-35 free-tier audit: deadline guard. The GitHub write phase
     chains reads + PUTs with 8s per-call timeouts; on a slow GitHub
     day its worst case could pass the function's 10s ceiling and
     the platform would kill the run mid-commit, leaving the three
     pipeline files half-updated. If the fetch+filter phases have
     already burned most of the budget, skip the writes entirely
     and say so honestly. Tomorrow's run re-derives everything
     from the feeds, so a skipped commit loses nothing. */
  const WRITE_DEADLINE_MS = 7000;
  const elapsedMs = Date.now() - Date.parse(runStart);
  const writeSkipped = writable && elapsedMs > WRITE_DEADLINE_MS;
  if (writable && !writeSkipped) {
    const msg = 'scout: daily scan ' + runStart.slice(0, 10) + ' (+' + newCandidates.length + ' candidates)';
    const results = await Promise.all([
      github.writeJsonIfChanged('pipeline/seen.json', seen, msg),
      github.writeJsonIfChanged('pipeline/review-queue.json', finalQueue, msg),
      github.writeJsonIfChanged('pipeline/decided.json', allDecided, msg),
    ]);
    commits = results;
    committed = results.some((r) => r.committed);
  }

  const degraded = feedsOk < feeds.length || !writable || writeSkipped;
  const notes = [];
  if (writeSkipped) {
    notes.push('Commit skipped on purpose: the fetch and filter phases took ' + elapsedMs +
      'ms, past the safe write deadline inside the 10s function ceiling. Committing now could be ' +
      'killed mid-write. Nothing was lost: tomorrow\u2019s run re-derives the same candidates.');
  }
  if (feedsOk < feeds.length) {
    const failed = upstream.filter((u) => !u.ok).map((u) => u.source).join(', ');
    notes.push('Feed fetch failed for: ' + failed + '. Candidates below come only from the feeds that answered.');
  }
  if (!writable) {
    notes.push('Read-only run: the GITHUB_REPO_TOKEN commit-back token is still pending setup ' +
      '(awaiting the human\'s decision), so nothing was committed. The candidates below are fresh ' +
      'but will not persist until the token exists.');
  }
  if (!notes.length && newCandidates.length === 0) {
    notes.push('All feeds answered; nothing new worth queuing today.');
  }

  const data = {
    checked: feeds.length,
    feeds_ok: feedsOk,
    changed: queueChanged || newCandidates.length > 0,
    committed: committed,
    commits: commits,
    new_candidates: newCandidates,
    screened_out: screened,
    queue_pending: finalQueue.filter((c) => !c.status || c.status === 'pending').length,
    read_only: !writable,
  };

  console.log('[cron] scout done changed=' + data.changed + ' committed=' + committed +
    ' sources_ok=' + feedsOk + '/' + feeds.length + ' new=' + newCandidates.length +
    ' request_id=' + requestId);

  ok(res, SERVICE, VERSION, data, {
    requestId: requestId,
    cache: 'none',
    degraded: degraded,
    stale_since: degraded ? runStart : null,
    upstream: upstream,
    note: notes.length ? notes.join(' ') : null,
  });
};
