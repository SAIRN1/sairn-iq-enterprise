// ============================================================
// SAIRN IQ Enterprise Server
// The intelligence layer for Fortune 500 workforces
// Michael L. Dibert · SAIRN Technologies · 2026
// ============================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import claudeRouter from './api/claude.js';
import greetingRouter from './api/greeting.js';
import healthRouter from './api/health.js';
import auditRouter from './api/audit.js';

const app = express();

// ── Security middleware ─────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// ── CORS ────────────────────────────────────────────────────
app.use(cors({
  origin: config.allowedOrigins.includes('*')
    ? '*'
    : (origin, callback) => {
        if (!origin || config.allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Company-ID', 'X-User-ID'],
}));

// ── Body parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Request logging ──────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(JSON.stringify({
      ts: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms: duration,
      company: req.headers['x-company-id'] || 'unknown',
    }));
  });
  next();
});

// ── Routes ───────────────────────────────────────────────────
app.use('/api/claude',    claudeRouter);
app.use('/api/greeting',  greetingRouter);
app.use('/api/health',    healthRouter);
app.use('/api/audit',     auditRouter);

// ── Root info endpoint ───────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'SAIRN IQ Enterprise',
    version: '1.0.0',
    company: config.company.name,
    status: 'operational',
    endpoints: [
      'POST /api/claude   — Intelligence queries',
      'POST /api/greeting — Personalized greetings',
      'GET  /api/health   — Health check',
      'GET  /api/audit    — Usage audit log',
    ],
    docs: 'https://sairn.vercel.app/enterprise',
  });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start server ─────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(JSON.stringify({
    ts: new Date().toISOString(),
    event: 'SAIRN IQ Enterprise started',
    port: config.port,
    company: config.company.name,
    industry: config.company.industry,
    environment: config.environment,
  }));
});

export default app;
