# --- Builder Stage ---
FROM node:18-alpine AS builder
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max_old_space_size=4096
WORKDIR /app

COPY package.json package-lock.json shared client server ./
RUN npm ci
RUN npm run build --workspace=shared
RUN npm run build --workspace=client
RUN npm run build --workspace=server

# --- Production Stage ---
FROM nginx:alpine AS production
ENV NODE_ENV=production

# Install Node.js for running the server
RUN apk add --update nodejs npm

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/client/dist /usr/share/nginx/html

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/shared/dist /app/shared/package.json ./shared
COPY --from=builder /app/server/dist /app/server/package.json /app/server/env.production ./server

RUN npm ci --workspace=server

# Start node server
CMD ["node", "./server/index.js"]