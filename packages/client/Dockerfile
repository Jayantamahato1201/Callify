FROM node:18-alpine AS build

WORKDIR /app

# Copy package configurations
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/

# Install dependencies
RUN npm install --workspace=packages/client

# Copy client source
COPY packages/client ./packages/client

# Build the Vite app
WORKDIR /app/packages/client
RUN npm run build

# Production server using Nginx
FROM nginx:alpine
COPY --from=build /app/packages/client/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
