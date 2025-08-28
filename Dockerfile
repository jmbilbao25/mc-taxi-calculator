# Multi-stage build for Express.js backend
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy application files
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/server.js ./
COPY --from=builder --chown=nodejs:nodejs /app/config ./config
COPY --from=builder --chown=nodejs:nodejs /app/controllers ./controllers
COPY --from=builder --chown=nodejs:nodejs /app/middleware ./middleware
COPY --from=builder --chown=nodejs:nodejs /app/models ./models
COPY --from=builder --chown=nodejs:nodejs /app/routes ./routes

USER nodejs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
