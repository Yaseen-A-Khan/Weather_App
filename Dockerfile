# Multi-stage build to reduce final image size
# --- Stage 1: Build React app ---
FROM node:alpine3.19 AS builder

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Serve React build ---
FROM node:alpine3.19

WORKDIR /app
RUN npm install -g serve

# Copy built files from previous stage
COPY --from=builder /app/build ./build

EXPOSE 3000

# Serve on 0.0.0.0 so it's reachable from outside the container
CMD ["serve", "-s", "build", "--listen", "0.0.0.0:3000"]
