# Stage 1: Build React App
FROM node:alpine3.19 AS builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the built app
FROM node:alpine3.19

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000

# ✅ Correct way to serve the app
CMD ["serve", "-s", "build"]
