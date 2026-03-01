# backend/Dockerfile
# Multi-stage build: install deps in stage 'deps' then copy into small runtime image
FROM node:20-alpine AS deps
WORKDIR /app

# Install only dependencies (no dev)
COPY package*.json ./
RUN npm ci --omit=dev

# Final runtime image: smaller and only production deps
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user 'node' already exists in official node images
# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application files
COPY . .

# Ensure app files are owned by 'node' user (required before switching user)
RUN chown -R node:node /app

# Switch to non-root user
USER node

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# healthcheck using Node built-in http to avoid adding curl/wget to image
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "const req = require('http').get('http://localhost:5000/health', r => { if (r.statusCode !== 200) process.exit(1); }); req.on('error', () => process.exit(1));"

# Start the app
CMD ["node", "src/index.js"]