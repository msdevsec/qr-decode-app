FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Development command
CMD ["npm", "run", "dev"]
