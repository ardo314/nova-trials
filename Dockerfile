FROM node:18-alpine AS builder
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max_old_space_size=4096

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

# Copy built files from the builder stage
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html
COPY --from=builder /app/packages/server/dist ./server

# Start node server
CMD ["node", "./server/index.js"]