# ============================================================
# SAIRN IQ — Enterprise Docker Container
# Deploys to any Fortune 500 internal server
# Michael L. Dibert · SAIRN Technologies · 2026
# ============================================================

FROM node:20-alpine

# Metadata
LABEL maintainer="Michael L. Dibert <support@sairntechnologies.com>"
LABEL version="1.0.0"
LABEL description="SAIRN IQ Enterprise Intelligence Platform"

# Create app directory
WORKDIR /app

# Install dependencies first (cached layer)
COPY package.json ./
RUN npm install --production

# Copy API files
COPY api/ ./api/
COPY server.js ./
COPY config.js ./

# Create non-root user for security
RUN addgroup -g 1001 -S sairn && \
    adduser -S sairn -u 1001 && \
    chown -R sairn:sairn /app

USER sairn

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]
