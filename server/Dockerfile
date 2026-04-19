FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and server package files
COPY package.json package-lock.json ./
COPY server/package.json ./server/

# Install all dependencies (with legacy-peer-deps if needed based on root)
RUN npm install --legacy-peer-deps

# Copy server source
COPY server ./server

WORKDIR /app/server
# Generate prisma client
RUN npx prisma generate
# Build the server
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY server/package.json ./server/

# Install only production dependencies
# Here we just copy from builder for simplicity since it's a monorepo setup
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/node_modules ./server/node_modules

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/prisma ./server/prisma
COPY --from=builder /app/server/.env ./server/.env

WORKDIR /app/server

EXPOSE 3000

# Start script
CMD ["npm", "run", "start"]
