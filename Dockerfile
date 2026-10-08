# Multi-stage production build for Google Cloud Run
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production runner stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/dist ./dist
COPY server.js ./

EXPOSE 8080

CMD ["node", "server.js"]
