# ==============================
# Builder
# ==============================
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
# Use npm ci for faster, more reliable builds in Docker
RUN npm install 

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client (No DB connection needed for this step)
RUN npx prisma generate

# Copy project files
COPY . .

# Build Next.js
# Note: Ensure your next.config.js has output: 'standalone'
RUN npm run build

# ==============================
# Runner
# ==============================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy standalone build and static files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
# We need prisma CLI in runner to run migrations at startup
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001

# 8️⃣ Run migrations then start the server
# Using 'sh -c' allows us to chain commands at runtime
CMD ["sh", "-c", "npx prisma db push && node server.js"]