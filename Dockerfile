# ====================== Stage 1: Build ======================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# ====================== Stage 2: Production ======================
FROM node:20-alpine AS production

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy only production artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Create logs directory
RUN mkdir -p /app/logs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

# Run with PM2 in cluster mode
CMD ["pm2-runtime", "start", "ecosystem.config.js"]