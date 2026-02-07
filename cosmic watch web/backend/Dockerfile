FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src

# Build TypeScript (for production)
RUN npm run build

EXPOSE 5000

# Default to production, but can be overridden by docker-compose
CMD ["npm", "start"]

