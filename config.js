// ============================================================
// SAIRN IQ Enterprise Configuration
// Edit this file to configure your deployment
// ============================================================

export const config = {
  // Server
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'production',

  // Anthropic
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  model: process.env.SAIRN_MODEL || 'claude-haiku-4-5-20251001',
  maxTokens: parseInt(process.env.SAIRN_MAX_TOKENS || '1000'),

  // Company configuration
  company: {
    name: process.env.COMPANY_NAME || 'Your Company',
    industry: process.env.COMPANY_INDUSTRY || 'enterprise',
    logoUrl: process.env.COMPANY_LOGO_URL || '',
    primaryColor: process.env.COMPANY_PRIMARY_COLOR || '#F0B429',
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  },

  // SSO (optional)
  sso: {
    enabled: process.env.SSO_ENABLED === 'true',
    provider: process.env.SSO_PROVIDER || 'okta',
    domain: process.env.SSO_DOMAIN || '',
    clientId: process.env.SSO_CLIENT_ID || '',
    clientSecret: process.env.SSO_CLIENT_SECRET || '',
  },

  // Supabase (optional — for org intelligence layer)
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  // Allowed origins for CORS
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['*'],

  // Audit logging
  audit: {
    enabled: process.env.AUDIT_LOG_ENABLED !== 'false',
    logFile: process.env.AUDIT_LOG_FILE || './logs/audit.log',
  },
};

export default config;
