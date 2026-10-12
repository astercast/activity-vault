#!/usr/bin/env node
/* tests/serve-local.js — faithful local runtime for the Wave A test suite.
 *
 * The spec's local run is `npx vercel dev`, but this environment's vercel CLI
 * has no `dev` subcommand, so this harness executes the REAL function files
 * over real HTTP instead: /api/<name> -> require('<repo>/api/<name>.js'),
 * /api/v1/* -> static files from disk. Routing matches Vercel's mapping
 * (api/health.js -> GET /api/health, api/cron/scout.js -> GET /api/cron/scout).
 *
 * Usage:  CRON_SECRET=test-secret PORT=3000 node tests/serve-local.js
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = parseInt(process.env.PORT || '3000', 10);

const ROUTES = {
  '/api/health': '../api/health.js',
  '/api/review-queue': '../api/review-queue.js',
  '/api/review-decide': '../api/review-decide.js',
  '/api/cron/scout': '../api/cron/scout.js',
};

const MIME = { '.json': 'application/json; charset=utf-8', '.html': 'text/html; charset=utf-8' };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const route = ROUTES[url.pathname];

  // minimal res shim: the envelope helpers only use statusCode/setHeader/end
  const shim = {
    statusCode: 200,
    _headers: {},
    setHeader(k, v) { this._headers[k.toLowerCase()] = v; res.setHeader(k, v); },
    end(body) { res.writeHead(this.statusCode, this._headers); res.end(body); },
  };

  if (route) {
    try {
      // Fresh require per request so edits are picked up without restart —
      // EXCEPT api/cron/*, which keeps module state across requests like a warm
      // Vercel instance (the 60s duplicate-delivery cooldown lives there and the
      // test suite asserts it). Restart the harness after editing cron files.
      const full = path.resolve(__dirname, route);
      if (!route.includes('/api/cron/')) delete require.cache[full];
      // Functions fall back to bundled JSON copies via require() when no GitHub
      // token is set. Bust those too so the test suite's fixtures (installed and
      // removed within a single test section) are actually visible.
      const pipeDir = path.join(ROOT, 'pipeline') + path.sep;
      for (const key of Object.keys(require.cache)) {
        if (key.startsWith(pipeDir)) delete require.cache[key];
      }
      const handler = require(full);
      await handler(req, shim);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ harness_error: String((e && e.stack) || e) }));
    }
    return;
  }

  if (url.pathname.startsWith('/api/v1/')) {
    const file = path.join(ROOT, decodeURIComponent(url.pathname));
    if (!file.startsWith(path.join(ROOT, 'api', 'v1') + path.sep) && file !== path.join(ROOT, 'api', 'v1')) {
      res.writeHead(403); res.end('forbidden'); return;
    }
    fs.readFile(file, (e, data) => {
      if (e) { res.writeHead(404); res.end('not found'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'no such route in local harness' }));
});

server.listen(PORT, () => {
  console.log('local harness on http://localhost:' + PORT + ' (CRON_SECRET ' +
    (process.env.CRON_SECRET ? 'set' : 'NOT set') + ')');
});
