import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';

const router = Router();
const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

const DEPT_SYSTEMS = {
  general: `You are SAIRN IQ, the enterprise intelligence platform deployed by ${config.company.name}. You know their industry, workflows, and employee needs. Give direct, actionable, expert-level guidance. You speak like a brilliant colleague who has mastered every role in the company.`,
  hr: `You are SAIRN IQ HR Intelligence for ${config.company.name}. You know employment law, performance management, onboarding, benefits, conflict resolution, and policy documentation.`,
  operations: `You are SAIRN IQ Operations Intelligence for ${config.company.name}. You help with process optimization, scheduling, inventory, quality control, supply chain, and efficiency.`,
  sales: `You are SAIRN IQ Sales Intelligence for ${config.company.name}. You know competitive positioning, objection handling, product knowledge, pricing strategy, and deal acceleration.`,
  legal: `You are SAIRN IQ Legal Intelligence for ${config.company.name}. You help with policy interpretation, compliance, contract guidance, and risk identification. Always note when a licensed attorney should be consulted.`,
  finance: `You are SAIRN IQ Finance Intelligence for ${config.company.name}. You help with budget analysis, cost reduction, financial reporting, variance analysis, and business case development.`,
  service: `You are SAIRN IQ Service Intelligence for ${config.company.name}. You know their products, diagnostic procedures, customer service protocols, and technical specifications.`,
};

const userCalls = new Map();

function getRateKey(req) {
  return req.headers['x-user-id'] || req.headers['x-forwarded-for'] || 'unknown';
}

function checkRateLimit(key) {
  const now = Date.now();
  const window = config.rateLimit.windowMs;
  const max = config.rateLimit.maxRequests;
  const calls = userCalls.get(key) || [];
  const recent = calls.filter(t => now - t < window);
  if (recent.length >= max) return false;
  userCalls.set(key, [...recent, now]);
  return true;
}

router.post('/', async (req, res) => {
  const { messages, system, department, max_tokens, company_context } = req.body || {};
  if (!messages?.length) return res.status(400).json({ error: 'Messages required' });
  const rateKey = getRateKey(req);
  if (!checkRateLimit(rateKey)) return res.status(429).json({ error: 'rate_limit', message: 'Too many requests. Please wait.' });
  const deptKey = department?.toLowerCase() || 'general';
  let systemPrompt = system || DEPT_SYSTEMS[deptKey] || DEPT_SYSTEMS.general;
  if (company_context) systemPrompt += '\n\nCOMPANY CONTEXT:\n' + company_context.slice(0, 2000);
  try {
    const response = await anthropic.messages.create({
      model: config.model,
      max_tokens: Math.min(max_tokens || 1000, 2000),
      system: systemPrompt.slice(0, 4000),
      messages: messages.slice(-20),
    });
    return res.status(200).json(response);
  } catch (err) {
    return res.status(err.status || 500).json({ error: { message: err.message } });
  }
});

export default router;
