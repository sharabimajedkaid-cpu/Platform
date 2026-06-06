FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/shared ./backend/shared
COPY backend/services/auth-service ./backend/services/auth-service
RUN npm ci --include-workspace-root && \
    cd backend/shared && npm run build && \
    cd backend/services/auth-service && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=builder /app/backend/services/auth-service/dist ./dist
COPY --from=builder /app/backend/services/auth-service/node_modules ./node_modules
COPY --from=builder /app/backend/services/auth-service/package.json ./
USER nestjs
EXPOSE 3001
CMD ["node", "dist/main.js"]
