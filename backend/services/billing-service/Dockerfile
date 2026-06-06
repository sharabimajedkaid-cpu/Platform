FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/shared ./backend/shared
COPY backend/services/billing-service ./backend/services/billing-service
RUN npm ci --include-workspace-root && \
    cd backend/shared && npm run build && \
    cd backend/services/billing-service && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=builder /app/backend/services/billing-service/dist ./dist
COPY --from=builder /app/backend/services/billing-service/node_modules ./node_modules
COPY --from=builder /app/backend/services/billing-service/package.json ./
USER nestjs
EXPOSE 3010
CMD ["node", "dist/main.js"]
