# Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Runtime image
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy deps + source
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package*.json ./

# Port
EXPOSE 5000

USER node

CMD ["npm", "start"]