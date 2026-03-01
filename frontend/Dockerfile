# frontend/Dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Build the static assets
RUN npm run build

# Production image
FROM nginx:stable-alpine AS prod
# Copy built assets to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: custom nginx conf (if you need SPA fallback)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]