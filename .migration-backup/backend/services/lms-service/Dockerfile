FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/shared ./backend/shared
COPY backend/services/lms-service ./backend/services/lms-service
RUN npm ci --include-workspace-root && \
    cd backend/shared && npm run build && \
    cd backend/services/lms-service && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=builder /app/backend/services/lms-service/dist ./dist
COPY --from=builder /app/backend/services/lms-service/node_modules ./node_modules
COPY --from=builder /app/backend/services/lms-service/package.json ./
USER nestjs
EXPOSE 3003
CMD ["node", "dist/main.js"]
