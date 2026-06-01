import { Router } from 'express';
import { config } from '../config.js';

const router = Router();
const startTime = Date.now();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'SAIRN IQ Enterprise',
    company: config.company.name,
    version: '1.0.0',
    uptime: Math.floor((Date.now() - startTime) / 1000) + 's',
    timestamp: new Date().toISOString(),
    anthropic: config.anthropicApiKey ? 'configured' : 'missing',
  });
});

export default router;
