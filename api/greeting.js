import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';

const router = Router();
const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

router.post('/', async (req, res) => {
  const { department, user_name, client_hour } = req.body || {};
  const hour = client_hour ?? new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const name = user_name ? `, ${user_name}` : '';
  const dept = department || 'General';
  try {
    const response = await anthropic.messages.create({
      model: config.model,
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `Generate a brief professional good ${timeOfDay}${name} greeting for a ${config.company.name} employee in the ${dept} department. One sentence. Mention you are SAIRN IQ and ready to help. No contractions.`,
      }],
    });
    const greeting = response.content[0]?.text || `Good ${timeOfDay}${name}. SAIRN IQ is ready to help you with ${dept} intelligence.`;
    return res.status(200).json({ greeting });
  } catch (err) {
    return res.status(200).json({ greeting: `Good ${timeOfDay}${name}. SAIRN IQ is ready. How can I help you today?` });
  }
});

export default router;
