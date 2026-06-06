FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/shared ./backend/shared
COPY backend/services/analytics-service ./backend/services/analytics-service
RUN npm ci --include-workspace-root && \
    cd backend/shared && npm run build && \
    cd backend/services/analytics-service && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=builder /app/backend/services/analytics-service/dist ./dist
COPY --from=builder /app/backend/services/analytics-service/node_modules ./node_modules
COPY --from=builder /app/backend/services/analytics-service/package.json ./
USER nestjs
EXPOSE 3007
CMD ["node", "dist/main.js"]
