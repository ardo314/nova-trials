# --- Builder Stage ---
FROM node:18-alpine AS builder

ARG BASE_URL="/"

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

ENV NODE_ENV=production
ENV BASE_PATH=""

EXPOSE 80
EXPOSE 2567

# Install Node.js for running the server
RUN apk add --update nodejs npm

WORKDIR /app

# Copy client files
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html

COPY --from=builder /app/package.json /app/package-lock.json /app

# Copy shared package files
COPY --from=builder /app/packages/shared/dist /app/packages/shared/dist
COPY --from=builder /app/packages/shared/package.json /app/packages/shared/package.json

# Copy server package files
COPY --from=builder /app/packages/server/dist /app/packages/server/dist
COPY --from=builder /app/packages/server/package.json /app/packages/server/package.json
COPY --from=builder /app/packages/server/.env.production /app/packages/server/.env.production

RUN npm ci

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create entrypoint script to run both nginx and node server, with BASE_PATH substitution for nginx.conf
RUN echo -e "#!/bin/sh\n\
echo 'Starting Node.js server...'\n\
node ./packages/server/dist/index.js &\n\
echo 'Configuring nginx with BASE_PATH=\${BASE_PATH:-/}...'\n\
export BASE_PATH\n\
envsubst '\${BASE_PATH}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp\n\
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf\n\
echo 'Starting Nginx...'\n\
nginx -g 'daemon off;'" > entrypoint.sh && chmod +x entrypoint.sh

# Use entrypoint script to start both services
ENTRYPOINT ["sh", "./entrypoint.sh"]