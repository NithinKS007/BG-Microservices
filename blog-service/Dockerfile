# Use a lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY utils/package*.json ./utils/
COPY blog-service/package*.json ./blog-service/

# Install dependencies
RUN cd utils && npm ci && cd ../blog-service && npm ci

# Copy full source
COPY utils ./utils
COPY blog-service ./blog-service

# Set working directory to blog-service
WORKDIR /app/blog-service

# Expose app port
EXPOSE 3001

# Start the service
CMD ["npm", "run", "dev"] 