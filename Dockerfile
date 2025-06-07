# --- Builder Stage ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages packages

ENV NODE_ENV=development
RUN npm ci

ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=packages/client
RUN npm run build --workspace=packages/server

# --- Production Stage ---
FROM nginx:alpine AS production

# Install Node.js for running the server
RUN apk add --update nodejs npm

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html

COPY --from=builder /app/package.json /app/package-lock.json /app
COPY --from=builder /app/packages/shared/dist /app/packages/shared/package.json /app/packages/shared
COPY --from=builder /app/packages/server/dist /app/packages/server/package.json /app/packages/server/.env.production /app/packages/server

ENV NODE_ENV=production
RUN npm ci --workspace=packages/server

EXPOSE 80
EXPOSE 2567

# Start node server
CMD ["node", "./packages/server/index.js"]