# Use a lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY utils/package*.json ./utils/
COPY api-gateway/package*.json ./api-gateway/

# Install dependencies
RUN cd utils && npm ci && cd ../api-gateway && npm ci

# Copy full source
COPY utils ./utils
COPY api-gateway ./api-gateway

# Set working directory to api-gateway
WORKDIR /app/api-gateway

# Expose app port
EXPOSE 3000

# Start the service
CMD ["npm", "run", "dev"]