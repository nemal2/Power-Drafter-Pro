# Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Include .env.local
COPY .env.local .env

EXPOSE 3000
CMD ["npm", "run", "start"]
