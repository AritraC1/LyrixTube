# Base Image
FROM node:20-slim

# Set working directory inside container
WORKDIR /app

# Copy and Install requirements first
COPY --chown=node:node package*.json ./
RUN npm ci

# Copy application code
COPY --chown=node:node . .

# Non-root user
USER node

# Expose Port
EXPOSE 3000

# Command to run the app
CMD [ "node", "index.js" ]
