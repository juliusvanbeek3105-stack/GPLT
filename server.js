'use strict';
const express = require('express');
const path    = require('path');
const { Readable } = require('stream');

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => { res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:"); next(); });
app.use(express.static(path.join(__dirname, 'public')));

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

function headers() {
  return {
    'Content-Type':    'application/json',
    'x-api-key':       process.env.ANTHROPIC_API_KEY || '',
    'anthropic-version': '2023-06-01'
  };
}

/* ── Main analysis (web-search, returns full JSON) ────────────── */
app.post('/api/analyze', async (req, res) => {
  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method:  'POST',
      headers: headers(),
      body:    JSON.stringify(req.body)
    });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: data.error || 'API error' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

/* ── Streaming deep-dive (SSE piped back to browser) ─────────── */
app.post('/api/stream', async (req, res) => {
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();
  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method:  'POST',
      headers: headers(),
      body:    JSON.stringify({ ...req.body, stream: true })
    });
    if (!upstream.ok) {
      const err = await upstream.json();
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.error?.message })}\n\n`);
      return res.end();
    }
    Readable.fromWeb(upstream.body).pipe(res);
  } catch (err) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n  ╔══════════════════════════════════════════╗');
  console.log(`  ║  WAR WATCH — Intelligence Terminal       ║`);
  console.log(`  ║  http://localhost:${PORT}                   ║`);
  console.log('  ╚══════════════════════════════════════════╝\n');
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('  ⚠  ANTHROPIC_API_KEY not set — set it in .env\n');
  }
});
