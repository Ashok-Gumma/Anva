# Multi-stage Dockerfile for Anva Full-Stack Application

# Step 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source and build (outputs directly to /app/backend/dist via vite.config.js)
COPY frontend/ ./
RUN npm run build

# Step 2: Production Server
FROM node:20-alpine AS runner
WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=5001

# Copy backend dependencies and install production packages only
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source code
COPY backend/src ./src

# Copy built frontend assets from builder stage
COPY --from=frontend-builder /app/backend/dist ./dist

# Expose backend port
EXPOSE 5001

# Start the full-stack server
CMD ["node", "--max-http-header-size=65536", "src/server.js"]
