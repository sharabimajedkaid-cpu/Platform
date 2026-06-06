FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/shared ./backend/shared
COPY backend/services/search-service ./backend/services/search-service
RUN npm ci --include-workspace-root && \
    cd backend/shared && npm run build && \
    cd backend/services/search-service && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=builder /app/backend/services/search-service/dist ./dist
COPY --from=builder /app/backend/services/search-service/node_modules ./node_modules
COPY --from=builder /app/backend/services/search-service/package.json ./
USER nestjs
EXPOSE 3011
CMD ["node", "dist/main.js"]
