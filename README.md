# SAIRN IQ Enterprise — Docker Container

The intelligence layer for Fortune 500 workforces. Deploy in 10 minutes on any server.

## Quick Start

### 1. Clone and configure

```bash
git clone https://github.com/SAIRN1/sairn-iq-enterprise
cd sairn-iq-enterprise
cp .env.example .env
```

Edit `.env` with your values:
- `ANTHROPIC_API_KEY` — from console.anthropic.com
- `COMPANY_NAME` — your company name
- `COMPANY_INDUSTRY` — your industry

### 2. Deploy with Docker

```bash
docker-compose up -d
```

SAIRN IQ is now live at `http://localhost:3000`

### 3. Test it

```bash
curl http://localhost:3000/api/health
```

### 4. Connect your apps

Point your SAIRN IQ frontend to your internal server:

```
SAIRN_API = "http://your-server-ip:3000/api/claude"
```

---

## Configuration

All configuration is done via environment variables. See `.env.example` for full list.

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `COMPANY_NAME` | Yes | Your company name |
| `COMPANY_INDUSTRY` | No | Industry for context |
| `PORT` | No | Server port (default 3000) |
| `ALLOWED_ORIGINS` | No | CORS origins (default *) |
| `SSO_ENABLED` | No | Enable SSO auth |
| `AUDIT_LOG_ENABLED` | No | Enable audit logging |

---

## API Endpoints

### POST /api/claude
Main intelligence endpoint.

```json
{
  "messages": [{"role": "user", "content": "Your question here"}],
  "department": "service_center",
  "company_context": "Optional company-specific context"
}
```

### GET /api/health
Health check. Returns status and uptime.

### POST /api/greeting
Personalized employee greeting.

### GET /api/audit
Usage audit log (last 100 entries).

---

## Security

- Runs as non-root user inside container
- Helmet.js security headers
- CORS restricted to your origins
- Rate limiting per user
- Audit logging for all queries
- No data stored — all queries are stateless

---

## Support

support@sairntechnologies.com  
sairn.vercel.app/enterprise  
© 2026 SAIRN Technologies · Michael L. Dibert · Patents Pending
