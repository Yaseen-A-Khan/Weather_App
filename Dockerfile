# Use official Node.js Alpine image
FROM node:alpine3.19

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy all source code including .env
COPY . .

# Build React app (this reads .env and embeds env vars)
RUN npm run build

# Install serve to serve the static build files
RUN npm install -g serve
# RUN serve -s build

# Expose port 3000
EXPOSE 3000

# Serve the build folder statically
CMD ["serve", "-s", "build", "-l", "3000"]
