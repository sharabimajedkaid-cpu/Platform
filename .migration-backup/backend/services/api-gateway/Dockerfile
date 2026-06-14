FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/shared ./backend/shared
COPY backend/services/api-gateway ./backend/services/api-gateway
RUN npm ci --include-workspace-root && \
    cd backend/shared && npm run build && \
    cd backend/services/api-gateway && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=builder /app/backend/services/api-gateway/dist ./dist
COPY --from=builder /app/backend/services/api-gateway/node_modules ./node_modules
COPY --from=builder /app/backend/services/api-gateway/package.json ./
USER nestjs
EXPOSE 3000
CMD ["node", "dist/main.js"]
