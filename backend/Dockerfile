# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl (required for Prisma)
RUN apk add --no-cache openssl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY . .

# Build the NestJS application
RUN npm run build

# --- Stage 2: Production ---
FROM node:20-alpine AS production

WORKDIR /app

# Install openssl (required for Prisma)
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy Prisma schema and generated client from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Start the application (Apply DB migrations if necessary before starting, or run them in CI/CD)
CMD ["npm", "run", "start:prod"]
