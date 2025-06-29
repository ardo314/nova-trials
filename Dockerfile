# --- Builder Stage ---
FROM node:18-alpine AS builder

ARG BASE_URL="/"

WORKDIR /app

COPY . .

ENV NODE_ENV=development
RUN npm ci

ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm run build --workspace=shared
RUN npm run build --workspace=client
RUN npm run build --workspace=server

# --- Production Stage ---
FROM nginx:alpine AS production

ENV NODE_ENV=production
ENV BASE_PATH=""

EXPOSE 2567

# Install Node.js for running the server
RUN apk add --update nodejs npm

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json /app
COPY --from=builder /app/public/ /app/public

# Copy shared package files
COPY --from=builder /app/shared/dist /app/shared/dist
COPY --from=builder /app/shared/package.json /app/shared/package.json

# Copy server package files
COPY --from=builder /app/server/dist /app/server/dist
COPY --from=builder /app/server/package.json /app/server/package.json
COPY --from=builder /app/server/.env.production /app/server/.env.production

RUN npm ci

WORKDIR /app/server
# Use entrypoint script to start both services
ENTRYPOINT ["node", "dist/index.js"]