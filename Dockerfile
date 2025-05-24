
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/ packages/

RUN npm ci

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/packages/client
RUN npm run build

WORKDIR /app/packages/server
RUN npm run build


FROM nginx:alpine AS production

# Install Node.js for running the server
RUN apk add --update nodejs npm

WORKDIR /app

# Copy built client to nginx serve directory
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html

COPY --from=builder /app/packages/server/dist ./server
COPY --from=builder /app/packages/shared/dist ./shared