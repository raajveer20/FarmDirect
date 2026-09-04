FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build frontend production bundle
RUN npm run build

# Expose port
ENV PORT=5001
EXPOSE 5001

# Start full-stack production server
CMD ["npm", "start"]
