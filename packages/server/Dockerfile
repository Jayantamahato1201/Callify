FROM node:18-alpine

WORKDIR /app

# Copy root package configurations
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/

# Install dependencies (only for server due to monorepo structure, but we can do a local npm install)
RUN npm install --workspace=packages/server

# Copy server source
COPY packages/server ./packages/server

# Build TypeScript
WORKDIR /app/packages/server
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
