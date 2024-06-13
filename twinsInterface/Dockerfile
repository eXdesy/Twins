# Stage 1: Build the Angular application
FROM node:18.17.1-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points

# Copy application files
COPY . .

# Build the Angular application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy built application files to Nginx directory
COPY --from=build /app/dist/twins/browser /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80
