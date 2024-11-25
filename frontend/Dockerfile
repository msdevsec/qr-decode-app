# frontend/Dockerfile

# ========================================
# Stage 1: Dependencies
# This stage installs all dependencies
# ========================================
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
# We only copy these first to leverage Docker's cache
COPY package*.json ./

# Install dependencies using clean install
RUN npm ci

# ========================================
# Stage 2: Builder
# This stage builds the Next.js application
# ========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all project files
COPY . .

# Build the Next.js application
RUN npm run build

# ========================================
# Stage 3: Development
# This stage is used for development with hot reload
# ========================================
FROM node:20-alpine AS development
WORKDIR /app

# Install dependencies (including dev dependencies)
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose port 3000 for Next.js
EXPOSE 3000

# Start development server with hot reload
CMD ["npm", "run", "dev"]

# ========================================
# Stage 4: Production
# This stage creates the production image
# ========================================
FROM node:20-alpine AS production
WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port 3000
EXPOSE 3000

# Start production server
CMD ["npm", "start"]