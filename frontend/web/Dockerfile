FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/shared ./backend/shared
COPY frontend/web ./frontend/web
RUN npm ci --include-workspace-root && \
    cd backend/shared && npm run build && \
    cd frontend/web && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/frontend/web/public ./public
COPY --from=builder /app/frontend/web/.next/standalone ./
COPY --from=builder /app/frontend/web/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
CMD ["node", "server.js"]
